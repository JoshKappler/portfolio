"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ProjectCard } from "./project-card";

const projects = [
  {
    title: "autohack",
    subtitle: "Autonomous Security Agent",
    description:
      "I built an agent that finds bug bounty programs, hunts for security vulnerabilities using Claude, reviews its own findings, and submits reports on its own. It runs hour-long sessions with 200-turn conversations and gets better over time by learning from past outcomes.",
    techStack: [
      "TypeScript",
      "Anthropic SDK",
      "Next.js 15",
      "SQLite",
      "Drizzle",
      "tRPC",
    ],
    highlights: [
      "12-state pipeline from discovery through submission across HackerOne, Immunefi, and Huntr",
      "A separate Claude instance validates findings on a 0-15 rubric before anything gets submitted",
      "Learning system that records outcomes, near-misses, and triager feedback to improve future hunts",
      "Two Claude backends: CLI mode (Max subscription) or API mode with prompt caching for 90% input token savings",
      "Watchdog process that detects stalled solves and resets state automatically",
      "Real-time dashboard with xterm.js terminal showing live Claude output",
    ],
    accentColor: "#e74c3c",
  },
  {
    title: "AgentArena",
    subtitle: "Multi-Agent Simulation Platform",
    description:
      "A sandbox where multiple LLM-powered agents interact in scenarios designed to produce emergent behavior. Includes a genetic algorithm that evolves prompt configurations and a village simulation where agents have memory, emotions, and relationships.",
    techStack: [
      "TypeScript",
      "Next.js 15",
      "Claude Agent SDK",
      "Groq",
      "OpenRouter",
    ],
    highlights: [
      "Village mode: 4-8 agents each run a 5-step cognitive pipeline (perception, action selection, reflection, planning, state resolution)",
      "3-tier memory system: episodic with embeddings, semantic from reflection, and a knowledge graph tracking who knows what",
      "Genetic optimizer that evolves prompt configs across hundreds of scenarios, scored by an LLM judge on 5 dimensions",
      "Emotional state (grief, fear, anger, hope, loneliness) that influences how agents make decisions",
      "A DM orchestrator that watches tension metrics and creates dramatic events when things get too calm",
      "Multi-provider LLM client routing to Claude, Groq, or OpenRouter through a single interface",
    ],
    accentColor: "#9b59b6",
  },
  {
    title: "genisis",
    subtitle: "Directed Evolution Engine",
    description:
      "I wanted to see if I could breed better AI agent prompts instead of writing them by hand. This system mutates traits, runs agents through behavioral scenarios, and selects winners through natural selection. The agents end up developing behavior they were never explicitly told to have.",
    techStack: ["Python", "Ollama", "Gemma 4", "Pydantic", "Textual TUI"],
    highlights: [
      "~20 modular traits across 5 psychological categories that get assembled into system prompts",
      "4 mutation operators: tweak (60%), swap (20%), delete (10%), duplicate+drift (10%)",
      "Two-phase evaluation to prevent gaming: binary pass/fail gates, then anonymous head-to-head ranking",
      "4 behavioral scenarios testing threat detection, manipulation resistance, moral reasoning, and opportunism",
      "Trait pool that accumulates proven traits from past champions for future mutations",
      "Runs entirely local on Ollama with no cloud dependencies",
    ],
    accentColor: "#2ecc71",
  },
  {
    title: "algora",
    subtitle: "Autonomous Bounty Solver",
    description:
      "This agent finds GitHub bounties with financial rewards, figures out which ones are worth attempting, and solves them using Claude Code. It clones repos, implements fixes, runs tests, creates PRs, and responds to reviewer feedback.",
    techStack: [
      "TypeScript",
      "pnpm monorepo",
      "Anthropic SDK",
      "Next.js 15",
      "Drizzle",
      "tRPC",
    ],
    highlights: [
      "Spawns Claude Code with up to 100 turns and a 45-minute timeout per solve",
      "Priority scoring: (reward * feasibility) / (1 + competitors) to pick the best bounties to attempt",
      "Sends specific lint/test errors back to Claude for targeted fixes, up to 3 retry attempts",
      "Monitors PRs for review comments, generates responses, and pushes code fixes based on feedback",
      "Classifies errors as transient, permanent, validation, or timeout to decide whether to retry",
      "Tracks success rates by language, repo, and failure pattern to improve over time",
    ],
    accentColor: "#3498db",
  },
  {
    title: "ContentPipeline",
    subtitle: "AI Video Generation",
    description:
      "A pipeline that produces YouTube Shorts from start to finish. Claude writes the script, image and video providers generate the visuals, TTS handles narration, and ffmpeg assembles the final video with word-level subtitles synced to the audio.",
    techStack: [
      "Python",
      "Anthropic SDK",
      "Gemini",
      "Imagen 4",
      "faster-whisper",
      "ffmpeg",
    ],
    highlights: [
      "Claude generates structured story JSON via tool_use, then writes image prompts for each scene",
      "Word-level subtitle sync using faster-whisper for timestamps and difflib to align back to the original script",
      "Swappable provider backends: Gemini/Imagen for images, Motion/Kling/Veo for video, Gemini/Edge/ElevenLabs for TTS",
      "Retries image generation up to 4 times when safety filters reject a prompt, with exponential backoff",
      "Python picks the comedy concept randomly, then Claude writes a unique story around it",
    ],
    accentColor: "#f39c12",
  },
  {
    title: "sniply.biz",
    subtitle: "Full-Stack SaaS Marketplace",
    description:
      "A live marketplace connecting customers with hair care professionals. I built and deployed this end-to-end, from the matching algorithm to the booking system to the messaging feature.",
    techStack: [
      "Next.js 16",
      "TypeScript",
      "PostgreSQL",
      "Tailwind",
      "Vitest",
      "Playwright",
    ],
    highlights: [
      "Match scoring algorithm weighing hair type compatibility (40%) and style preference overlap (60%)",
      "PostgreSQL advisory locks to prevent double-booking race conditions",
      "Haversine distance calculation for geographic search",
      "Session auth with HMAC-signed cookies and rate-limited login (5 attempts per IP per 15 min)",
      "22+ seed professionals with deterministic availability generation for testing",
    ],
    link: "https://sniply.biz",
    linkLabel: "Visit",
    accentColor: "#1abc9c",
  },
];

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative min-h-screen py-20 md:py-24 px-6 md:px-16 lg:px-24"
      id="projects"
    >
      {/* Section header */}
      <div className="max-w-6xl mx-auto mb-20">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs text-accent tracking-[0.3em] uppercase mb-4"
        >
          02 / Projects
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
        >
          What I have built
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-text-muted text-lg max-w-2xl"
        >
          Every project here was built from scratch using direct SDK calls. No
          LangChain, no CrewAI, no agent frameworks. All repos are private, but
          I am happy to walk through any of them.
        </motion.p>
      </div>

      {/* Project cards */}
      <div className="max-w-5xl mx-auto space-y-8">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} index={i + 1} {...project} />
        ))}
      </div>
    </section>
  );
}
