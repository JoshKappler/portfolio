"use client";

import { useEffect, useRef } from "react";
import { STAGE_HALF, createGlobe } from "./globe/globe-core.js";
import { MARK_GEOMETRY } from "./globe/mark-geometry.js";
import { drawGlobeScene, setInk, setMark } from "./globe/globe-draw.js";

const INK = "42, 35, 24";

function tintedMark(image: HTMLImageElement, color: string) {
  const off = document.createElement("canvas");
  off.width = image.naturalWidth;
  off.height = image.naturalHeight;
  const ctx = off.getContext("2d");
  if (ctx) {
    ctx.drawImage(image, 0, 0);
    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, off.width, off.height);
  }
  return off;
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
    };
    markImage.src = "/jk-mark.png";

    // Reading layout inside the frame loop forces a reflow per frame; track
    // the box from resize events instead.
    let box = canvas.getBoundingClientRect();
    const sizer = new ResizeObserver(() => {
      box = canvas.getBoundingClientRect();
    });
    sizer.observe(canvas);

    const draw = (elapsed: number) => {
      if (box.width < 2 || box.height < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
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

    if (stillQuery.matches) {
      draw(0);
      return;
    }

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (startedAt == null) startedAt = now;
      draw(now - startedAt);
    };
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      sizer.disconnect();
    };
  }, []);

  return (
    <a
      href="https://github.com/JoshKappler/gt-logo-loader-studio"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Source for the JK globe animation on GitHub"
      className="mx-auto block h-[12.5rem] w-[12.5rem] print:hidden"
    >
      {/* Own compositor layer: repaints must not re-blend the paper texture. */}
      <canvas ref={ref} className="block h-full w-full will-change-transform" aria-hidden="true" />
    </a>
  );
}
