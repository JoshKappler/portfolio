"use client";

import { useTheme } from "./theme-provider";
import { NeuralVortexBackground } from "./ui/neural-vortex-background";
import { SmokeBackground } from "./ui/smoke-background";
import { DottedSurface } from "./ui/dotted-surface";

export function ThemedNeuralVortex() {
  const { theme } = useTheme();
  return <NeuralVortexBackground isLight={theme === "light"} />;
}

export function ThemedSmoke({ smokeColor }: { smokeColor?: string }) {
  const { theme } = useTheme();
  return <SmokeBackground smokeColor={smokeColor} isLight={theme === "light"} />;
}

export function ThemedDottedSurface() {
  const { theme } = useTheme();
  return <DottedSurface isLight={theme === "light"} />;
}
