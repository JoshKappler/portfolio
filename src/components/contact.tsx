"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useTheme } from "./theme-provider";

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section
      ref={ref}
      className="relative min-h-screen py-20 md:py-24 px-6 md:px-16 lg:px-24 flex flex-col justify-center"
      id="contact"
    >
      <div className="max-w-6xl mx-auto">
        {/* CTA area */}
        <div className={`relative border rounded-3xl p-12 md:p-16 lg:p-20 overflow-hidden ${isLight ? "bg-bg-card border-border" : "border-border/40 bg-bg-card/20"}`}>
          {/* Ambient glow */}
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-accent/[0.03] rounded-full blur-[120px] pointer-events-none" />

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="font-mono text-xs text-accent tracking-[0.3em] uppercase mb-6"
          >
            04 / Contact
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            Get in touch.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-text-muted text-lg leading-relaxed mb-10 max-w-xl"
          >
            I am looking for AI agent engineering roles, or other AI-adjacent
            work, at early-stage startups in the Bay Area. If you are building
            something interesting, I want to hear about it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="mailto:Joshua.Kappler@gmail.com"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-bg font-display font-semibold text-sm tracking-wide rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
            >
              <span className="relative z-10">Joshua.Kappler@gmail.com</span>
            </a>
            <a
              href="https://linkedin.com/in/josh-kappler-b2b9b5374"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border text-text-muted font-display font-semibold text-sm tracking-wide rounded-xl hover:border-accent/40 hover:text-accent transition-all duration-300"
            >
              LinkedIn
            </a>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="mt-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="font-mono text-xs text-text-dim">
            Josh Kappler &middot; {new Date().getFullYear()}
          </p>
          <div className="flex gap-8">
            {[
              { label: "YouTube", href: "https://youtube.com/boffy" },
              {
                label: "GitHub",
                href: "https://github.com/JoshKappler",
              },
              { label: "sniply.biz", href: "https://sniply.biz" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative font-mono text-xs text-text-dim hover:text-accent transition-colors"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
