"use client";

import { useEffect, useRef } from "react";
import { STAGE_HALF, createGlobe, rasterAlphaAt } from "./globe/globe-core.js";
import { MARK_GEOMETRY } from "./globe/mark-geometry.js";
import { drawGlobeScene, drawMarkInk, setInk } from "./globe/globe-draw.js";

const LIGHT_INK = "25, 25, 25";
const DARK_INK = "232, 230, 222";

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
      setInk(darkQuery.matches ? DARK_INK : LIGHT_INK);
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
      drawMarkInk(context, view, hold ? 1 : rasterAlphaAt(tau));
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
      className="h-[112px] w-[112px] shrink-0 sm:h-[200px] sm:w-[200px]"
      aria-hidden="true"
    />
  );
}
