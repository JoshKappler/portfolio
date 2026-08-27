"use client";

import { useRef, useState } from "react";

const EMAIL = "Joshua.Kappler@gmail.com";

export function ContactEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  const copy = () => {
    navigator.clipboard.writeText(EMAIL).then(
      () => {
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), 1600);
      },
      () => {
        window.location.href = `mailto:${EMAIL}`;
      },
    );
  };
  return (
    <span className="relative">
      <button
        type="button"
        onClick={copy}
        className="cursor-pointer underline decoration-1 [text-decoration-skip-ink:none] [text-underline-offset:0.3em]"
      >
        {EMAIL}
      </button>
      <span
        aria-live="polite"
        className={`absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap font-mono text-xs uppercase tracking-[0.2em] text-text-muted transition-opacity duration-300 ${
          copied ? "opacity-100" : "opacity-0"
        }`}
      >
        {copied ? "copied" : ""}
      </span>
    </span>
  );
}
