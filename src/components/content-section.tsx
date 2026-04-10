"use client";

import { ReactNode, useRef, useEffect } from "react";
import { EtheralShadow } from "@/components/ui/etheral-shadow";
import { useSnapContext } from "./snap-container";

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
                color="rgba(40, 80, 180, 1)"
                animation={{ scale: 100, speed: 90 }}
                noise={{ opacity: 0.8, scale: 1.2 }}
                sizing="fill"
              />
              <div className="absolute inset-0 bg-bg/55" />
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
