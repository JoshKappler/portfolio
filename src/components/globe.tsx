"use client";

import { useEffect, useRef } from "react";
import { STAGE_HALF, createGlobe } from "./globe/globe-core.js";
import { MARK_GEOMETRY } from "./globe/mark-geometry.js";
import { drawGlobeScene, setInk } from "./globe/globe-draw.js";

const INK = "42, 35, 24";

// Smooth 0..1 ramp of tau across [from, to]; the raster and the strip ink
// crossfade on complementary ramps so the strips never show at full strength
// under a faded mark.
function ramp(tau: number, from: number, to: number) {
  const u = Math.min(1, Math.max(0, (tau - from) / (to - from)));
  return u * u * (3 - 2 * u);
}

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

    let mark: HTMLCanvasElement | undefined;
    const markImage = new Image();
    markImage.onload = () => {
      mark = tintedMark(markImage, `rgb(${INK})`);
      if (stillQuery.matches) draw(0);
    };
    markImage.src = "/jk-mark.png";

    const draw = (elapsed: number) => {
      const box = canvas.getBoundingClientRect();
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
      const markAlpha = hold
        ? 1
        : Math.max(1 - ramp(tau, 0.06, 0.16), ramp(tau, 0.93, 0.99));
      if (!hold) {
        drawGlobeScene(context, view, globe, tau, tau * moveMs, 1 - markAlpha);
      }
      if (markAlpha > 0.01 && mark) {
        const origin = view.toCanvas([0, 0]);
        const size = MARK_GEOMETRY.mark.imgW * scale;
        context.save();
        context.globalAlpha = markAlpha;
        context.drawImage(mark, origin[0], origin[1], size, size);
        context.restore();
      }
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
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <a
      href="https://github.com/JoshKappler/gt-logo-loader-studio"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Source for the JK globe animation on GitHub"
      className="mx-auto block h-[12.5rem] w-[12.5rem]"
    >
      <canvas ref={ref} className="block h-full w-full" aria-hidden="true" />
    </a>
  );
}
