"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useTheme } from "./theme-provider";

const tools = [
  { name: "TypeScript", category: "language" },
  { name: "Python", category: "language" },
  { name: "Next.js", category: "framework" },
  { name: "PostgreSQL", category: "data" },
  { name: "SQLite", category: "data" },
  { name: "Zod", category: "framework" },
  { name: "Pydantic", category: "framework" },
  { name: "Anthropic SDK", category: "ai" },
  { name: "Groq", category: "ai" },
  { name: "OpenRouter", category: "ai" },
];

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section
      ref={ref}
      className="relative min-h-screen py-20 md:py-24 px-6 md:px-16 lg:px-24 flex flex-col justify-center"
      id="about"
    >
      <div className="relative max-w-6xl mx-auto">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs text-accent tracking-[0.3em] uppercase mb-4"
        >
          03 / About
        </motion.p>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16 md:gap-24">
          {/* Left column - narrative */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-10"
            >
              How I got here
            </motion.h2>

            <div className="space-y-6 text-text-muted leading-relaxed text-base md:text-lg">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                I build AI agents from scratch. I write the orchestration
                layer myself. Tool-use loops, state machines, memory
                management, multi-provider routing. Every system in the
                project list was built solo, no LangChain, no CrewAI, no agent
                frameworks.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Before this I spent seven years growing a YouTube channel from
                zero to 2.1 million subscribers. That is where I learned to
                follow through on long, unglamorous projects and manage
                something that kept getting bigger and more complex. Same
                instinct, different medium.
              </motion.p>
            </div>
          </div>

          {/* Right column - tools and approach */}
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h4 className="font-mono text-[10px] text-accent tracking-[0.3em] uppercase mb-5">
                What I work with
              </h4>
              <div className="flex flex-wrap gap-2">
                {tools.map((t, i) => (
                  <motion.span
                    key={t.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.02 }}
                    className={`px-3 py-1.5 text-xs font-mono border rounded-lg transition-colors duration-300 ${
                      t.category === "ai"
                        ? "text-accent/80 border-accent/20 hover:border-accent/40"
                        : "text-text-muted border-border/60 hover:border-border-hover"
                    }`}
                  >
                    {t.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className={`border rounded-2xl p-6 ${isLight ? "bg-bg-card border-border" : "border-border/40 bg-bg-card/20"}`}
            >
              <h4 className="font-mono text-[10px] text-accent tracking-[0.3em] uppercase mb-5">
                How I build
              </h4>
              <ul className="space-y-4 text-sm text-text-muted">
                {[
                  "Hand-rolled orchestration, no LangChain, no CrewAI",
                  "Claude Code as primary dev tool",
                  "Multi-provider LLM routing (Claude, Groq, OpenRouter, Ollama)",
                  "Full-stack: backend, frontend, dashboards, deployment",
                  "State machines for agent lifecycle management",
                  "Recording outcomes and feeding them back into future runs",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/50 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
