"use client";

import { motion } from "motion/react";
import { useSnapContext } from "./snap-container";

const links = [
  { label: "YouTube", href: "#youtube" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  const { visibleIndex } = useSnapContext();
  // Show nav on every page except the hero (index 0)
  const visible = visibleIndex > 0;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-bg/70 border-b border-border/50"
    >
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 h-14">
        <a
          href="#"
          className="font-display text-sm font-bold tracking-tight text-text"
        >
          JK
        </a>
        <div className="flex gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-xs text-text-muted hover:text-accent transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
