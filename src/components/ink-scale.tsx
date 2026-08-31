"use client";

import { useEffect } from "react";

/* The page ink filters (#ink-page, #ink-small) are authored in raw
   pixels against the full 16px root font. Below 42rem the root font shrinks with the
   viewport so the sheet keeps one composition, but SVG filter lengths
   never follow the font: the same absolute wobble, blur, and noise land on
   half-size letterforms and smear them illegible on phones. This rescales
   every spatial primitive to the live root size, so the strike looks the
   same at every width. #ink-mark is left alone: it runs once in the mark
   sprite's own 1200px pixel space, which never changes with the page. */
const SPATIAL: readonly (readonly [attr: string, inverse: boolean])[] = [
  ["baseFrequency", true], // cycles per px: grows as the page shrinks
  ["scale", false], // feDisplacementMap offset in px
  ["stdDeviation", false], // feGaussianBlur radius in px
];

export function InkScale() {
  useEffect(() => {
    const primitives: [Element, string, number, boolean][] = [];
    for (const filter of document.querySelectorAll("#ink-page, #ink-small")) {
      for (const node of filter.children) {
        for (const [attr, inverse] of SPATIAL) {
          const value = node.getAttribute(attr);
          if (value !== null) {
            primitives.push([node, attr, parseFloat(value), inverse]);
          }
        }
      }
    }
    const apply = () => {
      const k =
        parseFloat(getComputedStyle(document.documentElement).fontSize) / 16;
      if (!Number.isFinite(k) || k <= 0) return;
      for (const [node, attr, base, inverse] of primitives) {
        node.setAttribute(attr, String(inverse ? base / k : base * k));
      }
    };
    apply();
    window.addEventListener("resize", apply);
    // Re-touch the filters once after first paint: the invalidation makes
    // the browser rasterize the whole sheet's ink during load idle time,
    // instead of buffering visibly at the first scroll into the lower half.
    const nudge = window.setTimeout(apply, 250);
    return () => {
      window.clearTimeout(nudge);
      window.removeEventListener("resize", apply);
    };
  }, []);
  return null;
}
