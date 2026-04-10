"use client";

import { motion } from "motion/react";

const items = [
  "Agent Orchestration",
  "Prompt Engineering",
  "Multi-Provider LLM",
  "Evolutionary AI",
  "Tool Use",
  "Streaming",
  "State Machines",
  "Adversarial Review",
  "Knowledge Graphs",
  "Cognitive Pipelines",
  "Learning Loops",
  "Structured Output",
];

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden whitespace-nowrap py-3">
      <motion.div
        animate={{ x: reverse ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="inline-flex gap-4"
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-5 py-2 border border-border/40 rounded-full font-mono text-xs text-text-dim"
          >
            <span className="w-1 h-1 rounded-full bg-accent/40" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function Marquee() {
  return (
    <section className="py-8 border-y border-border/30 overflow-hidden bg-bg-elevated/20">
      <MarqueeRow />
      <MarqueeRow reverse />
    </section>
  );
}
