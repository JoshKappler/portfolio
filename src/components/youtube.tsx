"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { AnimatedCounter } from "./animated-counter";

export function YouTube() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative min-h-screen py-20 md:py-24 px-6 md:px-16 lg:px-24 overflow-hidden flex flex-col justify-center"
      id="youtube"
    >
      <div className="relative max-w-6xl mx-auto">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs text-accent tracking-[0.3em] uppercase mb-4"
        >
          01 / YouTube
        </motion.p>

        {/* Big stat hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-accent/90">
            <AnimatedCounter target={2} suffix=".1M" />
          </h2>
          <p className="font-display text-2xl md:text-3xl text-text-muted mt-2">
            subscribers on YouTube
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-3 gap-8 mb-16 pb-16 border-b border-border/50"
        >
          {[
            { value: 270, suffix: "M+", label: "Total Views" },
            { value: 136, suffix: "+", label: "Videos" },
            { value: 7, suffix: "+", label: "Years" },
          ].map((stat, i) => (
            <div key={stat.label}>
              <p className="font-display text-3xl md:text-4xl font-bold text-text">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  duration={1800 + i * 200}
                />
              </p>
              <p className="font-mono text-[10px] text-text-dim tracking-[0.2em] uppercase mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <p className="text-text-muted leading-relaxed text-lg">
              I have been creating content on YouTube for over seven years under
              the name{" "}
              <a
                href="https://youtube.com/boffy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 transition-colors"
              >
                Boffy
              </a>
              . I grew the channel from zero to 2.1 million subscribers. No
              team at first — just figuring out what gets clicks and doing more
              of it.
            </p>
            <p className="text-text-muted leading-relaxed">
              Eventually I hired editors and designers, negotiated
              sponsorships with RedMagic, Wargaming, GeoGuessr, and others, and
              spent a lot of time in analytics trying to figure out what was
              actually working.
            </p>
            <p className="text-text-muted leading-relaxed">
              Running a YouTube channel at this scale is a lot like running a
              product. You put something out, look at the numbers, adjust, and
              do it again.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col justify-center"
          >
            <div className="relative border border-border rounded-2xl p-8 bg-bg-card/30 backdrop-blur-sm">
              <div className="absolute -top-3 left-6">
                <span className="px-3 py-1 text-[10px] font-mono text-accent tracking-widest uppercase bg-bg-card border border-border rounded-full">
                  Brand Partnerships
                </span>
              </div>
              <div className="flex flex-wrap gap-3 mt-2">
                {[
                  "RedMagic",
                  "Wargaming",
                  "GeoGuessr",
                  "YouTooz",
                  "Factor",
                  "GamerSupps",
                  "Ellify",
                ].map((brand) => (
                  <span
                    key={brand}
                    className="px-4 py-2 text-sm text-text-muted border border-border/60 rounded-lg bg-bg/50"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
