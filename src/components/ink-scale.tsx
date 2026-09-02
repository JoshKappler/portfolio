"use client";

import { useEffect } from "react";

/* The page ink filters (#ink-page, #ink-small) are authored in visual
   pixels against a 16px type size. The sheet lays out at twice that (32px
   root font, scaled to half by globals.css so WebKit rasterizes the ink on
   a grid as fine as the glass), and below 42rem of window the root font
   shrinks with the viewport. SVG filter lengths never follow the font, so
   this rescales every spatial primitive to the live root size and the
   strike looks the same at every width. The mark's ink is baked into its
   sprite at build time and needs no scaling. */
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
    // Rewriting the attributes invalidates every filter and rasterizes the
    // whole sheet's ink again, so an unchanged root font is skipped unless
    // the caller asks for the invalidation itself.
    let appliedK = 0;
    const apply = (force = false) => {
      const k =
        parseFloat(getComputedStyle(document.documentElement).fontSize) / 16;
      if (!Number.isFinite(k) || k <= 0) return;
      if (!force && k === appliedK) return;
      appliedK = k;
      for (const [node, attr, base, inverse] of primitives) {
        node.setAttribute(attr, String(inverse ? base / k : base * k));
      }
    };
    // On the 2x grid the scaled main leaves layout height behind it, so
    // the wrapper's height is pinned to the sheet's transformed height and
    // the page ends where the paper does. On the 1x grid (touch devices,
    // print) the paper's own height already ends the page, and a pinned
    // height would go stale when the grid flips.
    const sheet = document.querySelector<HTMLElement>("[data-sheet]");
    const paper = document.querySelector<HTMLElement>("main[data-paper]");
    const fit = () => {
      if (!sheet || !paper) return;
      sheet.style.height =
        getComputedStyle(paper).transform === "none"
          ? ""
          : `${paper.getBoundingClientRect().height}px`;
    };
    // The paper resizes when the window, its content, or the sheet grid
    // (a pointer-mode flip) changes; the filters follow the root font too.
    const sizer = paper
      ? new ResizeObserver(() => {
          apply();
          fit();
        })
      : null;
    if (paper) sizer?.observe(paper);
    apply();
    fit();
    const onResize = () => apply();
    window.addEventListener("resize", onResize);
    // Re-touch the filters once after first paint: the invalidation makes
    // the browser rasterize the whole sheet's ink during load idle time,
    // instead of buffering visibly at the first scroll into the lower half.
    const nudge = window.setTimeout(() => apply(true), 250);
    return () => {
      window.clearTimeout(nudge);
      window.removeEventListener("resize", onResize);
      sizer?.disconnect();
    };
  }, []);
  return null;
}
