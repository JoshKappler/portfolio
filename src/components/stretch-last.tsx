"use client";

import { useEffect } from "react";

const NEARLY_FULL = 0.9;

/* CSS cannot ask how full a block's last line is, so this measures each
   paragraph and list entry and marks the ones whose last line already
   nearly fills the column; only those stretch to both edges. */
export function StretchLast() {
  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLElement>("main > p, main li");
    const apply = () => {
      for (const el of blocks) {
        el.classList.remove("stretch-last");
        const range = document.createRange();
        range.selectNodeContents(el);
        const rects = Array.from(range.getClientRects()).filter(
          (r) => r.width > 0,
        );
        if (rects.length === 0) continue;
        const bottom = Math.max(...rects.map((r) => r.bottom));
        const last = rects.filter((r) => r.bottom > bottom - r.height / 2);
        const span =
          Math.max(...last.map((r) => r.right)) -
          Math.min(...last.map((r) => r.left));
        el.classList.toggle(
          "stretch-last",
          span >= el.clientWidth * NEARLY_FULL,
        );
      }
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);
  return null;
}
