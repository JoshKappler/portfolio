"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

const SAN_FRANCISCO: [number, number] = [37.77, -122.42];

export function Globe() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const stillQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let globe: ReturnType<typeof createGlobe> | null = null;
    let frame = 0;
    let phi = 0;

    const spin = () => {
      phi += 0.004;
      globe?.update({ phi });
      frame = requestAnimationFrame(spin);
    };

    const build = () => {
      globe?.destroy();
      const dark = darkQuery.matches;
      globe = createGlobe(canvas, {
        devicePixelRatio: 2,
        width: 240,
        height: 240,
        phi,
        theta: 0.25,
        dark: dark ? 1 : 0,
        diffuse: 1.2,
        mapSamples: 12000,
        mapBrightness: dark ? 2.5 : 5.5,
        baseColor: dark ? [0.42, 0.42, 0.4] : [0.84, 0.84, 0.8],
        markerColor: dark ? [0.95, 0.93, 0.87] : [0.12, 0.12, 0.12],
        glowColor: dark ? [0.07, 0.07, 0.07] : [0.99, 0.99, 0.97],
        markers: [{ location: SAN_FRANCISCO, size: 0.07 }],
      });
    };

    build();
    if (!stillQuery.matches) frame = requestAnimationFrame(spin);
    darkQuery.addEventListener("change", build);
    return () => {
      cancelAnimationFrame(frame);
      darkQuery.removeEventListener("change", build);
      globe?.destroy();
    };
  }, []);

  return (
    <canvas ref={ref} className="h-[120px] w-[120px] shrink-0" aria-hidden="true" />
  );
}
