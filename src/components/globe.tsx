"use client";

import { useEffect, useRef } from "react";
import { STAGE_HALF, createGlobe } from "./globe/globe-core.js";
import { MARK_GEOMETRY } from "./globe/mark-geometry.js";
import { drawGlobeScene, setInk, setMark } from "./globe/globe-draw.js";

const INK = "22, 18, 12";

// Tints an already-rendered mark (the clean image, or the inked bake)
// solid ink through its own alpha.
function tintedMark(
  source: HTMLImageElement | HTMLCanvasElement,
  color: string,
) {
  const off = document.createElement("canvas");
  off.width =
    source instanceof HTMLImageElement ? source.naturalWidth : source.width;
  off.height =
    source instanceof HTMLImageElement ? source.naturalHeight : source.height;
  const ctx = off.getContext("2d");
  if (ctx) {
    ctx.drawImage(source, 0, 0);
    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, off.width, off.height);
  }
  return off;
}

// Bakes the page's ink distortion into the mark once at load, so the JK
// has always been printed. The filter runs inside a self-contained SVG
// image rather than through ctx.filter, which WebKit never implemented:
// filters inside an SVG document rasterize on every engine. The caller
// keeps the clean mark until the bake lands, or forever if it fails.
async function inkedMark(image: HTMLImageElement) {
  const filter = document.getElementById("ink-mark");
  if (!filter) return null;
  const raster = document.createElement("canvas");
  raster.width = image.naturalWidth;
  raster.height = image.naturalHeight;
  raster.getContext("2d")?.drawImage(image, 0, 0);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${raster.width}" height="${raster.height}">` +
    `<defs>${filter.outerHTML}</defs>` +
    `<image width="${raster.width}" height="${raster.height}" filter="url(#ink-mark)" href="${raster.toDataURL("image/png")}"/>` +
    `</svg>`;
  const printed = new Image();
  printed.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  await printed.decode();
  const out = document.createElement("canvas");
  out.width = raster.width;
  out.height = raster.height;
  out.getContext("2d")?.drawImage(printed, 0, 0);
  return out;
}

export function Globe() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const stillQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const globe = createGlobe({ holdMs: 1400 });
    const { holdMs, moveMs } = globe.timing;
    let frame = 0;
    let startedAt: number | null = null;

    const markImage = new Image();
    markImage.onload = () => {
      setMark(tintedMark(markImage, `rgb(${INK})`));
      if (stillQuery.matches) draw(0);
      inkedMark(markImage)
        .then((printed) => {
          if (!printed) return;
          setMark(tintedMark(printed, `rgb(${INK})`));
          if (stillQuery.matches) draw(0);
        })
        .catch(() => {
          /* the clean mark is already set */
        });
    };
    markImage.src = "/jk-mark.png";

    // Reading layout inside the frame loop forces a reflow per frame; track
    // the box from resize events instead. When the page holds still, resize
    // is also the only thing that triggers a repaint.
    let box = canvas.getBoundingClientRect();
    const sizer = new ResizeObserver(() => {
      box = canvas.getBoundingClientRect();
      if (stillQuery.matches) draw(0);
    });
    sizer.observe(canvas);

    const draw = (elapsed: number) => {
      if (box.width < 2 || box.height < 2) return;
      // Cap 3, not 2: on DPR-3 phones the scaled-down sheet draws
      // continent glyphs near 2 CSS px, and they need every device pixel.
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const pixelWidth = Math.round(box.width * dpr);
      const pixelHeight = Math.round(box.height * dpr);
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }
      const context = canvas.getContext("2d");
      if (!context) return;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, box.width, box.height);
      setInk(INK);
      const scale = Math.min(box.width, box.height) / (STAGE_HALF * 2);
      const view = {
        scale,
        toCanvas: (point: [number, number]): [number, number] => [
          (point[0] - MARK_GEOMETRY.mark.mcx) * scale + box.width / 2,
          (point[1] - MARK_GEOMETRY.mark.mcy) * scale + box.height / 2,
        ],
      };
      const t = elapsed % (holdMs + moveMs);
      const hold = t < holdMs;
      const tau = hold ? 0 : (t - holdMs) / moveMs;
      // One layer, no handoff: the scene's own ink is the rendered mark image,
      // eroded by the melt, so the intact letters are the true font pixels.
      drawGlobeScene(context, view, globe, tau, tau * moveMs);
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (startedAt == null) startedAt = now;
      draw(now - startedAt);
    };
    // Follow the motion preference live, not just at mount: hold on the
    // full mark when it flips to reduce, restart the cycle when it lifts.
    const setMotion = () => {
      cancelAnimationFrame(frame);
      if (stillQuery.matches) {
        startedAt = null;
        draw(0);
      } else {
        frame = requestAnimationFrame(loop);
      }
    };
    setMotion();
    stillQuery.addEventListener("change", setMotion);
    return () => {
      cancelAnimationFrame(frame);
      stillQuery.removeEventListener("change", setMotion);
      sizer.disconnect();
    };
  }, []);

  return (
    <a
      href="https://github.com/JoshKappler/gt-logo-loader-studio"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Source for the JK globe animation on GitHub"
      className="relative z-[2] mx-auto block h-[12.5rem] w-[12.5rem] print:hidden"
    >
      {/* Above the grain overlay (z-1): a repainting canvas under a blend
          layer forces a re-blend every frame, which stutters in Firefox.
          The mark's ink texture is baked into its sprite instead. */}
      <canvas ref={ref} className="block h-full w-full will-change-transform" aria-hidden="true" />
    </a>
  );
}
