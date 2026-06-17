"use client";

import { useEffect, useState } from "react";
import { EtheralShadow } from "@/components/ui/etheral-shadow";
import { useTheme } from "./theme-provider";

/**
 * A single, fixed background shared by the whole page. The blue fluid/cloudy
 * shader sits behind all content at low opacity so it reads as ambient rather
 * than competing with the text. Honors prefers-reduced-motion by swapping the
 * animated WebGL layer for a static gradient.
 */
export function SiteBackground() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const color = isLight ? "rgba(70, 120, 200, 1)" : "rgba(40, 80, 180, 1)";

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      {/* Solid base so the shader blends toward the page background */}
      <div className="absolute inset-0 bg-bg" />

      {reducedMotion ? (
        // Static, motion-free fallback in the same blue family
        <div
          className="absolute inset-0"
          style={{
            opacity: isLight ? 0.22 : 0.32,
            background:
              "radial-gradient(ellipse 70% 60% at 25% 15%, rgba(40,80,180,0.9), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 85%, rgba(70,120,200,0.7), transparent 60%)",
          }}
        />
      ) : (
        // Animated cloudy shader, dialed back so it stays ambient
        <div
          className="absolute inset-0"
          style={{ opacity: isLight ? 0.3 : 0.42 }}
        >
          <EtheralShadow
            color={color}
            animation={{ scale: 100, speed: 80 }}
            noise={{ opacity: 0.45, scale: 1.2 }}
            sizing="fill"
          />
        </div>
      )}

      {/* Light scrim keeps text legible over the brightest cloud areas */}
      <div className={`absolute inset-0 ${isLight ? "bg-white/30" : "bg-bg/35"}`} />
    </div>
  );
}
