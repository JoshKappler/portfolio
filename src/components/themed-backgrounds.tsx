"use client";

import { useTheme } from "./theme-provider";
import { NeuralVortexBackground } from "./ui/neural-vortex-background";
import { SmokeBackground } from "./ui/smoke-background";
import { DottedSurface } from "./ui/dotted-surface";

export function ThemedNeuralVortex() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <>
      <NeuralVortexBackground isLight={isLight} />
      <div className={`absolute inset-0 z-[1] ${isLight ? "bg-white/40" : "bg-bg/40"}`} />
    </>
  );
}

export function ThemedSmoke({ smokeColor }: { smokeColor?: string }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <>
      <SmokeBackground smokeColor={smokeColor} isLight={isLight} />
      <div className={`absolute inset-0 z-[1] ${isLight ? "bg-white/30" : "bg-bg/50"}`} />
    </>
  );
}

export function ThemedDottedSurface() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <>
      <DottedSurface isLight={isLight} />
      <div className={`absolute inset-0 z-[1] ${isLight ? "bg-white/30" : "bg-bg/40"}`} />
    </>
  );
}
