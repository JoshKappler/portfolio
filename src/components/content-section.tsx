"use client";

import { ReactNode, useRef, useEffect, useMemo } from "react";
import { EtheralShadow } from "@/components/ui/etheral-shadow";
import { useSnapContext } from "./snap-container";
import { useTheme } from "./theme-provider";

const ANIMATION_CONFIG = { scale: 100, speed: 90 };
const NOISE_DARK = { opacity: 0.8, scale: 1.2 };
const NOISE_LIGHT = { opacity: 0.4, scale: 1.2 };

export function ContentSection({
  children,
  index,
  background,
}: {
  children: ReactNode;
  index: number;
  background?: ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { visibleIndex, phase, registerScroller } = useSnapContext();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const isVisible = index === visibleIndex;
  // Only mount the background for current section and immediate neighbors
  const shouldRenderBg = Math.abs(index - visibleIndex) <= 1;

  useEffect(() => {
    registerScroller(index, scrollRef.current);
    return () => registerScroller(index, null);
  }, [index, registerScroller]);

  let opacity = 0;
  if (isVisible) {
    opacity = phase === "out" ? 0 : 1;
  }

  return (
    <section
      className="absolute inset-0 h-screen w-full overflow-hidden transition-opacity duration-400 ease-in-out"
      style={{
        opacity,
        pointerEvents: isVisible && phase === "idle" ? "auto" : "none",
      }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        {shouldRenderBg &&
          (background ?? (
            <>
              <EtheralShadow
                color={isLight ? "rgba(100, 130, 200, 1)" : "rgba(40, 80, 180, 1)"}
                animation={ANIMATION_CONFIG}
                noise={isLight ? NOISE_LIGHT : NOISE_DARK}
                sizing="fill"
              />
              <div className={`absolute inset-0 z-[1] ${isLight ? "bg-bg/[0.93]" : "bg-bg/55"}`} />
            </>
          ))}
      </div>
      <div
        ref={scrollRef}
        data-scroller
        className="relative z-[1] h-full overflow-y-auto scrollbar-hide will-change-transform"
      >
        {children}
      </div>
    </section>
  );
}
