"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

interface SnapContextValue {
  visibleIndex: number;
  totalSections: number;
}

const SnapContext = createContext<SnapContextValue>({
  visibleIndex: 0,
  totalSections: 0,
});

export function useSnapContext() {
  return useContext(SnapContext);
}

// Timing (ms)
const FADE_OUT = 500;
const PAUSE = 200;
const FADE_IN = 500;

export function SnapContainer({
  children,
  sectionCount,
}: {
  children: ReactNode;
  sectionCount: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const transitioningRef = useRef(false);
  const pendingRef = useRef<number | null>(null);
  const cooldownRef = useRef(false);

  const goTo = useCallback(
    (target: number) => {
      if (target < 0 || target >= sectionCount) return;
      if (target === activeIndex) return;
      setActiveIndex(target);
    },
    [activeIndex, sectionCount]
  );

  // Listen for wheel and keyboard events to navigate
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (cooldownRef.current) return;

      // Require a meaningful scroll delta to avoid trackpad micro-scrolls
      if (Math.abs(e.deltaY) < 30) return;

      cooldownRef.current = true;
      setTimeout(() => {
        cooldownRef.current = false;
      }, FADE_OUT + PAUSE + FADE_IN + 100);

      if (e.deltaY > 0) {
        setActiveIndex((prev) => Math.min(prev + 1, sectionCount - 1));
      } else {
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (cooldownRef.current) return;

      if (
        e.key === "ArrowDown" ||
        e.key === "PageDown" ||
        e.key === " "
      ) {
        e.preventDefault();
        cooldownRef.current = true;
        setTimeout(() => {
          cooldownRef.current = false;
        }, FADE_OUT + PAUSE + FADE_IN + 100);
        setActiveIndex((prev) => Math.min(prev + 1, sectionCount - 1));
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        cooldownRef.current = true;
        setTimeout(() => {
          cooldownRef.current = false;
        }, FADE_OUT + PAUSE + FADE_IN + 100);
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    // Touch handling
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (cooldownRef.current) return;
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 50) return;

      cooldownRef.current = true;
      setTimeout(() => {
        cooldownRef.current = false;
      }, FADE_OUT + PAUSE + FADE_IN + 100);

      if (deltaY > 0) {
        setActiveIndex((prev) => Math.min(prev + 1, sectionCount - 1));
      } else {
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [sectionCount]);

  // Orchestrate fade-out → black → fade-in
  useEffect(() => {
    if (activeIndex === visibleIndex) return;

    if (transitioningRef.current) {
      pendingRef.current = activeIndex;
      return;
    }

    const runTransition = (target: number) => {
      transitioningRef.current = true;

      // Step 1: fade out everything
      setVisibleIndex(-1);

      // Step 2: after fade-out + pause, fade in the new section
      setTimeout(() => {
        setVisibleIndex(target);

        // Step 3: after fade-in, check for queued transitions
        setTimeout(() => {
          transitioningRef.current = false;
          if (pendingRef.current !== null && pendingRef.current !== target) {
            const next = pendingRef.current;
            pendingRef.current = null;
            runTransition(next);
          }
        }, FADE_IN);
      }, FADE_OUT + PAUSE);
    };

    runTransition(activeIndex);
  }, [activeIndex, visibleIndex]);

  return (
    <SnapContext.Provider
      value={{ visibleIndex, totalSections: sectionCount }}
    >
      <main className="relative h-screen w-screen overflow-hidden">
        {children}
      </main>
    </SnapContext.Provider>
  );
}
