"use client";

import { useTheme } from "./theme-provider";
import { EtheralShadow } from "./ui/etheral-shadow";
import { NeuralVortexBackground } from "./ui/neural-vortex-background";
import { SmokeBackground } from "./ui/smoke-background";
import { DottedSurface } from "./ui/dotted-surface";

export function ThemedEtheralShadow() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <>
      <EtheralShadow
        color={isLight ? "rgba(120, 160, 220, 1)" : "rgba(40, 80, 180, 1)"}
        animation={{ scale: 100, speed: 90 }}
        noise={{ opacity: isLight ? 0.4 : 0.8, scale: 1.2 }}
        sizing="fill"
      />
      <div className={`absolute inset-0 ${isLight ? "z-[1] bg-white/55" : "bg-bg/55"}`} />
    </>
  );
}

export function ThemedNeuralVortex() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <>
      <NeuralVortexBackground isLight={isLight} />
      <div className={`absolute inset-0 ${isLight ? "z-[1] bg-white/40" : "bg-bg/40"}`} />
    </>
  );
}

export function ThemedSmoke({ smokeColor }: { smokeColor?: string }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <>
      <SmokeBackground smokeColor={smokeColor} isLight={isLight} />
      <div className={`absolute inset-0 ${isLight ? "z-[1] bg-white/30" : "bg-bg/50"}`} />
    </>
  );
}

export function ThemedDottedSurface() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <>
      <DottedSurface isLight={isLight} />
      <div className={`absolute inset-0 ${isLight ? "z-[1] bg-white/30" : "bg-bg/40"}`} />
    </>
  );
}
