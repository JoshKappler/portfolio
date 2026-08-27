"use client";

import { useEffect } from "react";

const NEARLY_FULL = 0.85;

/* The copy is tuned so every block's last line nearly fills the column in
   Georgia. On fonts with other metrics the lines wrap elsewhere and a
   stretched short last line looks broken, so this measures each block once
   and centers the last lines that fall short. The set-measure-restore all
   runs in one task, so the intermediate state never paints. */
export function SquareParagraphs() {
  useEffect(() => {
    const blocks = Array.from(
      document.querySelectorAll<HTMLElement>("main > p, main li"),
    );
    for (const el of blocks) el.style.textAlignLast = "center";
    const loose = blocks.map((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      const rects = Array.from(range.getClientRects()).filter(
        (r) => r.width > 0,
      );
      if (rects.length === 0) return false;
      const bottom = Math.max(...rects.map((r) => r.bottom));
      const last = rects.filter((r) => r.bottom > bottom - r.height / 2);
      const span =
        Math.max(...last.map((r) => r.right)) -
        Math.min(...last.map((r) => r.left));
      return span < el.clientWidth * NEARLY_FULL;
    });
    blocks.forEach((el, i) => {
      el.style.textAlignLast = "";
      el.classList.toggle("loose-last", loose[i]);
    });
  }, []);
  return null;
}
