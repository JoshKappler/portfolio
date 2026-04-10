"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const visible = useRef(false);

  useEffect(() => {
    // Only show on devices with a pointer
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!visible.current && ref.current) {
        ref.current.style.opacity = "1";
        visible.current = true;
      }
    };

    function tick() {
      current.current.x += (mouse.current.x - current.current.x) * 0.05;
      current.current.y += (mouse.current.y - current.current.y) * 0.05;
      if (ref.current) {
        ref.current.style.transform = `translate(${current.current.x - 300}px, ${current.current.y - 300}px)`;
      }
      requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove);
    requestAnimationFrame(tick);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none z-0 opacity-0 transition-opacity duration-[2000ms]"
      style={{
        background:
          "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 65%)",
        filter: "blur(50px)",
      }}
    />
  );
}
