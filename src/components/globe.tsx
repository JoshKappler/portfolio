"use client";

import { useEffect, useRef } from "react";
import { STAGE_HALF, createGlobe, rasterAlphaAt } from "./globe/globe-core.js";
import { MARK_GEOMETRY } from "./globe/mark-geometry.js";
import { drawGlobeScene, setInk } from "./globe/globe-draw.js";

const LIGHT_INK = "25, 25, 25";
const DARK_INK = "232, 230, 222";

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

    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const stillQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const globe = createGlobe({ holdMs: 1400 });
    const { holdMs, moveMs } = globe.timing;
    let frame = 0;
    let startedAt: number | null = null;

    const marks: { light?: HTMLCanvasElement; dark?: HTMLCanvasElement } = {};
    const markImage = new Image();
    markImage.onload = () => {
      marks.light = tintedMark(markImage, `rgb(${LIGHT_INK})`);
      marks.dark = tintedMark(markImage, `rgb(${DARK_INK})`);
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
      const dark = darkQuery.matches;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, box.width, box.height);
      setInk(dark ? DARK_INK : LIGHT_INK);
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
      if (!hold) drawGlobeScene(context, view, globe, tau, tau * moveMs);
      const markAlpha = hold ? 1 : rasterAlphaAt(tau);
      const mark = dark ? marks.dark : marks.light;
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
      const redraw = () => draw(0);
      darkQuery.addEventListener("change", redraw);
      return () => darkQuery.removeEventListener("change", redraw);
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
    <canvas
      ref={ref}
      className="mx-auto block h-[200px] w-[200px]"
      aria-hidden="true"
    />
  );
}
