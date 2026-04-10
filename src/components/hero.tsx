"use client";

import { motion } from "motion/react";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import { Marquee } from "./marquee";
import { useSnapContext } from "./snap-container";

const headline1 = "I build autonomous";
const headline2 = "AI agents.";

function AnimatedText({
  text,
  delay,
  className,
}: {
  text: string;
  delay: number;
  className?: string;
}) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.4,
            delay: delay + i * 0.025,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="inline-block"
          style={{ whiteSpace: char === " " ? "pre" : undefined }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero({ index }: { index: number }) {
  const { visibleIndex, phase } = useSnapContext();
  const isVisible = index === visibleIndex;
  const shouldRenderBg = Math.abs(index - visibleIndex) <= 1;

  let opacity = 0;
  if (isVisible) {
    opacity = phase === "out" ? 0 : 1;
  }

  return (
    <section
      className="absolute inset-0 h-screen w-full flex flex-col justify-center px-6 md:px-16 lg:px-24 overflow-hidden transition-opacity duration-400 ease-in-out"
      style={{
        opacity,
        pointerEvents: isVisible && phase === "idle" ? "auto" : "none",
      }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        {shouldRenderBg && <ShaderAnimation />}
      </div>
      <div className="absolute inset-0 z-[1] bg-black/50 pointer-events-none" />

      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute top-0 left-[10%] md:left-[8%] w-px h-[40vh] bg-gradient-to-b from-transparent via-accent/20 to-transparent origin-top z-[2]"
      />

      <div className="max-w-5xl relative z-[2]">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-mono text-sm text-accent tracking-[0.3em] uppercase mb-8"
        >
          Josh Kappler
        </motion.p>

        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.92] tracking-tight mb-10">
          <AnimatedText text={headline1} delay={0.4} />
          <br />
          <AnimatedText text={headline2} delay={0.9} className="text-accent" />
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="max-w-xl"
        >
          <p className="text-text-muted text-lg md:text-xl leading-relaxed mb-12">
            2.1M YouTube subscribers. I build AI agents from scratch — no
            frameworks, no shortcuts. Looking for an early-stage startup where I
            can do more of it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="flex flex-wrap gap-8 text-sm"
        >
          {[
            { label: "YouTube", href: "https://youtube.com/boffy" },
            { label: "GitHub", href: "https://github.com/JoshKappler" },
            {
              label: "LinkedIn",
              href: "https://linkedin.com/in/josh-kappler-b2b9b5374",
            },
            { label: "Email", href: "mailto:Joshua.Kappler@gmail.com" },
          ].map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 + i * 0.1 }}
              className="group relative text-text-muted hover:text-accent transition-colors duration-300"
            >
              <span className="font-mono text-xs tracking-wider">
                {link.label}
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-[2]">
        <Marquee />
      </div>
    </section>
  );
}
