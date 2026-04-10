"use client";

import { ReactNode } from "react";
import { EtheralShadow } from "@/components/ui/etheral-shadow";
import { useSnapContext } from "./snap-container";

export function ContentSection({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
}) {
  const { visibleIndex } = useSnapContext();
  const isVisible = index === visibleIndex;

  return (
    <section
      className="absolute inset-0 h-screen w-full overflow-hidden transition-opacity duration-500 ease-in-out"
      style={{ opacity: isVisible ? 1 : 0, pointerEvents: isVisible ? "auto" : "none" }}
    >
      {/* Ethereal shadow background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <EtheralShadow
          color="rgba(40, 80, 180, 1)"
          animation={{ scale: 100, speed: 90 }}
          noise={{ opacity: 0.8, scale: 1.2 }}
          sizing="fill"
        />
        <div className="absolute inset-0 bg-bg/55" />
      </div>

      {/* Content — scrollable if it overflows */}
      <div className="relative z-[1] h-full overflow-y-auto scrollbar-hide">
        {children}
      </div>
    </section>
  );
}
