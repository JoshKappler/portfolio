"use client";

import { useEffect, useRef } from "react";
import { STAGE_HALF, createGlobe } from "./globe/globe-core.js";
import { MARK_GEOMETRY } from "./globe/mark-geometry.js";
import { drawGlobeScene, setInk, setMark } from "./globe/globe-draw.js";

const INK = "22, 18, 12";

// The sprite ships pre-inked and pre-tinted (scripts/generate-inked-mark.html
// bakes the #ink-mark recipe at build time), so the browser never runs the
// SVG filter. The still <img> below is placed exactly where drawMarkInk puts
// the intact mark: origin toCanvas([0,0]) and width imgW * scale, as
// fractions of the square globe box.
const STAGE = STAGE_HALF * 2;
const STILL = {
  left: `${((50 - (100 * MARK_GEOMETRY.mark.mcx) / STAGE)).toFixed(3)}%`,
  top: `${((50 - (100 * MARK_GEOMETRY.mark.mcy) / STAGE)).toFixed(3)}%`,
  width: `${((100 * MARK_GEOMETRY.mark.imgW) / STAGE).toFixed(3)}%`,
};

export function Globe() {
  const ref = useRef<HTMLCanvasElement>(null);
  const stillRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const stillQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const globe = createGlobe({ holdMs: 1400 });
    const { holdMs, moveMs } = globe.timing;
    let frame = 0;
    let startedAt: number | null = null;
    let markReady = false;
    let holdDrawn = false;
    let needsRedraw = false;

    const markImage = new Image();
    markImage.onload = () => {
      setMark(markImage);
      markReady = true;
      needsRedraw = true;
      if (stillQuery.matches) draw(0);
    };
    markImage.src = "/jk-mark-inked.png";

    // Reading layout inside the frame loop forces a reflow per frame; track
    // the box from resize events instead. When the page holds still, resize
    // is also the only thing that triggers a repaint.
    let box = canvas.getBoundingClientRect();
    const sizer = new ResizeObserver(() => {
      box = canvas.getBoundingClientRect();
      needsRedraw = true;
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
      const resized =
        canvas.width !== pixelWidth || canvas.height !== pixelHeight;
      const t = elapsed % (holdMs + moveMs);
      const hold = t < holdMs;
      // The hold is a still frame; drawing it once per cycle instead of
      // every vsync is most of the loop's CPU.
      if (hold && holdDrawn && !resized && !needsRedraw) return;
      if (resized) {
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
      const tau = hold ? 0 : (t - holdMs) / moveMs;
      // One layer, no handoff: the scene's own ink is the rendered mark image,
      // eroded by the melt, so the intact letters are the true font pixels.
      drawGlobeScene(context, view, globe, tau, tau * moveMs);
      holdDrawn = hold;
      needsRedraw = false;
      if (markReady && stillRef.current) {
        stillRef.current.style.visibility = "hidden";
      }
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      // The still image stands in until the sprite arrives; the first frame
      // then opens on the melt itself, skipping the opening hold.
      if (!markReady) return;
      if (startedAt == null) startedAt = now - holdMs;
      draw(now - startedAt);
    };
    // Follow the motion preference live, not just at mount: hold on the
    // full mark when it flips to reduce, restart the cycle when it lifts.
    const setMotion = () => {
      cancelAnimationFrame(frame);
      needsRedraw = true;
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
      {/* The mark is on the sheet at first paint, before any script runs;
          the first canvas frame that has the sprite hides it. If scripts
          never run, the still IS the mark. A plain img, not next/image:
          the canvas draws these exact sprite bytes, so nothing may
          re-encode or resize them. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={stillRef}
        src="/jk-mark-inked.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={STILL}
      />
      {/* Above the grain overlay (z-1): a repainting canvas under a blend
          layer forces a re-blend every frame, which stutters in Firefox.
          The mark's ink texture is baked into its sprite instead. */}
      <canvas ref={ref} className="relative block h-full w-full will-change-transform" aria-hidden="true" />
    </a>
  );
}
