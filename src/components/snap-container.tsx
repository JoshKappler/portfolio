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
import { motion } from "motion/react";

type Phase = "idle" | "out" | "in";

interface SnapContextValue {
  visibleIndex: number;
  phase: Phase;
  totalSections: number;
  registerScroller: (index: number, el: HTMLElement | null) => void;
}

const SnapContext = createContext<SnapContextValue>({
  visibleIndex: 0,
  phase: "idle",
  totalSections: 0,
  registerScroller: () => {},
});

export function useSnapContext() {
  return useContext(SnapContext);
}

const OUT_MS = 350;
const IN_MS = 400;

export function SnapContainer({
  children,
  sectionCount,
}: {
  children: ReactNode;
  sectionCount: number;
}) {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const transitioningRef = useRef(false);
  const pendingRef = useRef<number | null>(null);
  const visibleIndexRef = useRef(0);
  const scrollersRef = useRef<Map<number, HTMLElement>>(new Map());
  // Track scroll direction for "entering from below" behavior
  const lastDirectionRef = useRef<1 | -1>(1);

  visibleIndexRef.current = visibleIndex;

  const registerScroller = useCallback(
    (index: number, el: HTMLElement | null) => {
      if (el) scrollersRef.current.set(index, el);
      else scrollersRef.current.delete(index);
    },
    []
  );

  const runTransition = useCallback((target: number, direction: 1 | -1) => {
    transitioningRef.current = true;
    lastDirectionRef.current = direction;

    setPhase("out");

    setTimeout(() => {
      setVisibleIndex(target);
      setPhase("in");

      // If navigating backward into a section, scroll it to the bottom
      // so the user continues scrolling upward naturally
      if (direction === -1) {
        setTimeout(() => {
          const scroller = scrollersRef.current.get(target);
          if (scroller && scroller.scrollHeight > scroller.clientHeight) {
            scroller.scrollTop = scroller.scrollHeight - scroller.clientHeight;
          }
        }, 0);
      }

      setTimeout(() => {
        setPhase("idle");
        transitioningRef.current = false;

        if (pendingRef.current !== null && pendingRef.current !== target) {
          const next = pendingRef.current;
          const dir = next > target ? 1 : -1;
          pendingRef.current = null;
          runTransition(next, dir);
        }
      }, IN_MS);
    }, OUT_MS);
  }, []);

  const navigate = useCallback(
    (direction: 1 | -1) => {
      const current = visibleIndexRef.current;
      const target = Math.max(0, Math.min(current + direction, sectionCount - 1));
      if (target === current) return;

      if (transitioningRef.current) {
        pendingRef.current = target;
        return;
      }

      runTransition(target, direction);
    },
    [sectionCount, runTransition]
  );

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (transitioningRef.current) {
        e.preventDefault();
        return;
      }
      if (Math.abs(e.deltaY) < 30) return;

      const current = visibleIndexRef.current;
      const scroller = scrollersRef.current.get(current);

      // Check if the current section has scrollable content
      if (scroller && scroller.scrollHeight > scroller.clientHeight) {
        const atTop = scroller.scrollTop <= 1;
        const atBottom =
          scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;

        // Scrolling down and not at bottom — let it scroll naturally
        if (e.deltaY > 0 && !atBottom) return;
        // Scrolling up and not at top — let it scroll naturally
        if (e.deltaY < 0 && !atTop) return;
      }

      // At boundary or non-scrollable — navigate sections
      e.preventDefault();
      navigate(e.deltaY > 0 ? 1 : -1);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (transitioningRef.current) return;

      const current = visibleIndexRef.current;
      const scroller = scrollersRef.current.get(current);
      const hasScroll = scroller && scroller.scrollHeight > scroller.clientHeight;

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        if (hasScroll) {
          const atBottom =
            scroller!.scrollTop + scroller!.clientHeight >= scroller!.scrollHeight - 1;
          if (!atBottom) return; // let native scroll handle it
        }
        e.preventDefault();
        navigate(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (hasScroll) {
          const atTop = scroller!.scrollTop <= 1;
          if (!atTop) return;
        }
        e.preventDefault();
        navigate(-1);
      }
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (transitioningRef.current) return;
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 50) return;

      const current = visibleIndexRef.current;
      const scroller = scrollersRef.current.get(current);

      if (scroller && scroller.scrollHeight > scroller.clientHeight) {
        const atTop = scroller.scrollTop <= 1;
        const atBottom =
          scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;
        if (deltaY > 0 && !atBottom) return;
        if (deltaY < 0 && !atTop) return;
      }

      navigate(deltaY > 0 ? 1 : -1);
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
  }, [navigate]);

  return (
    <SnapContext.Provider value={{ visibleIndex, phase, totalSections: sectionCount, registerScroller }}>
      <main className="relative h-screen w-screen overflow-hidden">
        {children}
        <ScrollIndicator
          visibleIndex={visibleIndex}
          sectionCount={sectionCount}
          phase={phase}
        />
      </main>
    </SnapContext.Provider>
  );
}

function ScrollIndicator({
  visibleIndex,
  sectionCount,
  phase,
}: {
  visibleIndex: number;
  sectionCount: number;
  phase: Phase;
}) {
  const isLast = visibleIndex === sectionCount - 1;
  const visible = !isLast && phase === "idle";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center"
    >
      <motion.div
        animate={{ opacity: visible ? 0.35 : 0, y: [0, 4, 0] }}
        transition={{
          opacity: { duration: 0.4 },
          y: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
        }}
        className="text-text"
      >
        <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
          <path
            d="M1 1 L7 7 L13 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}
