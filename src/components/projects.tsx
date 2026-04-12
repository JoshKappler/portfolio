"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ProjectCard } from "./project-card";

const projects = [
  {
    title: "Socratic",
    subtitle: "Multi-Agent Debate Platform",
    description:
      "A live web app where five AI agents with distinct philosophical perspectives debate any topic in real time. An orchestrator agent controls turn order based on conversation state — creating natural back-and-forths, interjections, and redirects instead of round-robin. Agents track their own positions throughout the debate, conceding points and evolving their arguments as the conversation develops.",
    techStack: [
      "TypeScript",
      "Next.js 16",
      "Anthropic SDK",
      "Zod",
      "SSE Streaming",
      "Tailwind",
    ],
    highlights: [
      "Orchestrator uses tool_use to return structured decisions — who speaks next, who they address, and convergence status — validated with Zod at the boundary",
      "Position tracking: each agent maintains a running record of concessions, firm holds, and compelling counterarguments, fed back into their next prompt",
      "Multi-provider LLM abstraction: Anthropic API, Claude Agent SDK (Max subscription), OpenRouter, and Groq — auto-selects based on environment variables",
      "Server-sent events stream debate events (turn_start, token, turn_end, status_change, debate_end) to a React frontend in real time",
      "Classical courtroom UI with semicircular avatar layout, color-coded chat feed, and animated speaking/thinking states per agent",
      "Convergence detection: orchestrator tracks position drift across agents and declares resolution or deadlock with a synthesis of where they agreed and diverged",
    ],
    link: "https://github.com/JoshKappler/Socratic",
    linkLabel: "GitHub",
    accentColor: "#c9a96e",
  },
  {
    title: "autohack",
    subtitle: "Autonomous Security Agent",
    description:
      "A 5-package TypeScript monorepo that polls four bounty platforms, spawns hour-long Claude sessions to hunt for vulnerabilities, validates its own findings through adversarial review, and submits reports without human intervention. A separate Sonnet pass compresses verbose findings before submission. The system writes hunt outcomes, near-misses, and triager feedback to a JSON memory store so every future session starts with context from every past one.",
    techStack: [
      "TypeScript",
      "Anthropic SDK",
      "Next.js 15",
      "SQLite",
      "Drizzle",
      "tRPC",
    ],
    highlights: [
      "12-state finding lifecycle from discovery through submission across HackerOne, Immunefi, Huntr, and an aggregator covering Bugcrowd, Intigriti, and YesWeHack",
      "Adversarial review: a separate Claude instance scores findings on a 0-15 binary rubric — anything below 8 is rejected before it reaches a triager",
      "Two Claude backends: CLI mode (Max subscription, zero per-token cost) or API mode with ephemeral prompt caching for 90% input token savings",
      "Cross-process coordination via lock files, shared runtime-override JSON with a 2-second TTL cache, and stale-PID detection on startup",
      "Error classification (transient, permanent, validation, timeout) decides whether to retry, skip, or kill the hunt",
      "Real-time tRPC dashboard with xterm.js terminal streaming live Claude tool calls and reasoning",
    ],
    link: "https://github.com/JoshKappler/autohack",
    linkLabel: "GitHub",
    accentColor: "#e74c3c",
  },
  {
    title: "Village",
    subtitle: "Emergent Multi-Agent Simulation",
    description:
      "Drops 4-8 AI agents into a persistent world with locations, an economy, spoilage timers, and a DM orchestrator. Each agent runs a 4-phase cognitive pipeline per tick. The DM has its own 3-tier memory and persistent beliefs across runs, intervening with crises and events to maintain narrative tension.",
    techStack: [
      "TypeScript",
      "Next.js 15",
      "Claude Agent SDK",
      "Groq",
      "OpenRouter",
    ],
    highlights: [
      "4-phase concurrent execution per tick: decision, action, reflection, planning — each agent returns an immutable result object, mutations applied after",
      "3-tier memory: episodic events with Nomic embeddings for semantic retrieval, learned beliefs from reflection, and a knowledge graph tracking who knows what about whom",
      "DM orchestrator computes a tension score from agent emotions, death count, and stagnation signals, then fires interventions (crises, resource drops, new agents) to maintain drama",
      "Scene director picks next speaker via weighted relevance scoring across 11 factors including emotional state, obligations, starvation, and conversation context",
      "Custom distributed tracing: hierarchical spans with parent-child relationships, ring buffer (100 traces), and 14 automated health checks post-phase",
      "AbortSignal threaded through the entire call stack for graceful cancellation of any running simulation",
    ],
    link: "https://github.com/JoshKappler/Village",
    linkLabel: "GitHub",
    accentColor: "#9b59b6",
  },
  {
    title: "genesis",
    subtitle: "Directed Evolution Engine",
    description:
      "I wanted to see if I could breed better AI agent prompts instead of writing them by hand. This system represents personality as ~20 modular traits across 5 psychological categories, mutates them, runs agents through behavioral scenarios with a dynamic narrator that adapts to their responses, and selects winners through natural selection. The agents develop behavior they were never explicitly told to have.",
    techStack: ["Python", "Ollama", "Gemma 4", "Pydantic", "Textual TUI"],
    highlights: [
      "Traits describe WHO someone IS, not WHAT TO DO — avoids instruction pollution so evolution operates on semantic building blocks",
      "4 mutation operators: tweak (60%), swap from trait pool (20%), delete (10%), duplicate+drift across categories (10%)",
      "Two-phase evaluation: binary pass/fail gates first, then anonymous head-to-head ranking using letter labels (A/B/C/D/E) so the evaluator can't be biased by champion status",
      "Champion caching reuses scenario runs until a new champion is crowned, cutting ~20% of LLM calls per generation",
      "Full generation rollback — revert to any past generation, trim later data, and resume evolution from that point",
      "Runs entirely local on Ollama. No cloud calls, no API keys, no rate limits",
    ],
    link: "https://github.com/JoshKappler/genesis",
    linkLabel: "GitHub",
    accentColor: "#2ecc71",
  },
  {
    title: "algora",
    subtitle: "Autonomous Bounty Solver",
    description:
      "A 6-package monorepo that discovers open-source bounties from Algora and GitHub, scouts each repo for language, CI setup, and test framework, then spawns Claude Code to implement fixes. It creates PRs, watches for reviewer feedback, and pushes follow-up commits. On startup it resets any bounties stuck in transient states from a previous crash.",
    techStack: [
      "TypeScript",
      "npm monorepo",
      "Anthropic SDK",
      "Next.js 15",
      "Drizzle",
      "tRPC",
    ],
    highlights: [
      "Priority scoring: (reward × feasibility) / (1 + competitors) — competitors counted by parsing /attempt comments on the issue",
      "Claude Code spawned with up to 100 turns and a 45-minute timeout; auto-generates a CLAUDE.md for repos that don't have one",
      "Self-review pass: Claude diffs its own changes and checks for debug logs, TODOs, and accidental deletions before creating the PR",
      "Error classification (transient, permanent, validation, timeout, git_error) decides retry vs. fail — max 2 fix attempts per bounty",
      "JSON memory store tracks success rates per language, repo, and failure pattern so it picks better bounties over time",
      "Watchdog resets stalled solves every 5 minutes; global mutex prevents the analyzer and solver from modifying the same repo concurrently",
    ],
    link: "https://github.com/JoshKappler/algora",
    linkLabel: "GitHub",
    accentColor: "#3498db",
  },
  {
    title: "leadfinder",
    subtitle: "5-Stage Agent Pipeline",
    description:
      "Built for a bank consulting firm. Five independent agents run in sequence — bank analysis, contact discovery, behavioral profiling, connection mapping, and content generation — with a human checkpoint between each stage. Each agent starts with a clean context window and receives only the structured JSON output of the previous stage. Analysts can re-run any single stage without re-running the rest.",
    techStack: [
      "TypeScript",
      "Anthropic SDK",
      "Zod",
      "PDF parsing",
    ],
    highlights: [
      "Stage 1 ingests 20-100 page call reports, 10-K filings, and FDIC data, then extracts NIM, efficiency ratio, NPA ratio, CET1, and peer benchmarks",
      "Stage 2 discovers contacts via website scraping, SMTP verification without sending, and pattern matching — each email gets a confidence score",
      "Stage 3 profiles prospects from LinkedIn, press, earnings calls, and podcasts — findings get confidence calibration (single mention = low, multiple sources = high)",
      "Stage 4 cross-references the prospect's public network against internal contacts and scores relationship strength (former colleague > LinkedIn connection)",
      "Stage 5 drafts outreach and runs a self-review pass against a banned-words list to strip AI-detectable writing patterns",
      "Calibrated against 2GB of real deal documents (8 completed deals with inputs, working documents, and final deliverables)",
    ],
    linkLabel: "Private",
    accentColor: "#8e44ad",
  },
  {
    title: "Mafia",
    subtitle: "AI Social Deduction Game",
    description:
      "A full Mafia game where every player is an LLM agent. Wolves lie, the doctor protects, the detective investigates, and villagers vote. Each agent gets a unique personality and must reason about hidden information — wolves coordinate kills at night while maintaining cover during day discussions.",
    techStack: [
      "TypeScript",
      "Next.js 15",
      "Claude Agent SDK",
      "Groq",
    ],
    highlights: [
      "Night phase: wolves choose victims, doctor picks protection target, detective investigates — all via independent LLM calls with role-specific context",
      "Day discussion: 3 configurable rounds where agents speak in turn, referencing prior accusations, defending themselves, and sharing (or hiding) information",
      "Name extraction parser resolves ambiguous LLM outputs to valid player names for voting and targeting",
      "Win condition evaluation after every elimination — wolves win when they equal villagers, villagers win when all wolves are dead",
      "22 pre-written personality archetypes (greedy, paranoid, empathetic, manipulative, etc.) shuffled across players each game",
      "Full game transcripts saved as JSON for post-game analysis",
    ],
    link: "https://github.com/JoshKappler/Mafia",
    linkLabel: "GitHub",
    accentColor: "#c0392b",
  },
  {
    title: "content-pipeline",
    subtitle: "AI Video Generation",
    description:
      "Audio-first pipeline for YouTube Shorts. Narration is generated and timestamped before any visuals exist — scene durations are derived from word counts in the audio, so images and clips are generated to fit the timing instead of the other way around. Produces broadcast-ready MP4s with word-level subtitles, background music, and cinematic Ken Burns motion on every frame.",
    techStack: [
      "Python",
      "Anthropic SDK",
      "Gemini",
      "Imagen 4",
      "faster-whisper",
      "ffmpeg",
    ],
    highlights: [
      "Word-level subtitle alignment: Whisper extracts timestamps, then a sequence matcher replaces transcribed words with the original script and interpolates gaps",
      "Pitch shifting lowers narration by 2 semitones via ffmpeg, then scales Whisper timestamps by the stretch factor instead of re-running speech-to-text",
      "3 visual styles (photorealistic, claymation, Pixar) from the same story pipeline — each has its own image prompt guidelines and color grading",
      "Dual Claude client: SDK with tool_use for structured output, CLI fallback for Max plan when no API key is set",
      "Batch mode with mechanism-level deduplication — no two videos in a run share the same comedy concept",
      "Split-screen mode generates 1080x1080 frames and composites gameplay footage in the bottom half",
    ],
    link: "https://github.com/JoshKappler/content-pipeline",
    linkLabel: "GitHub",
    accentColor: "#f39c12",
  },
  {
    title: "chadGPT",
    subtitle: "Hostile AI Chatbot",
    description:
      "An intentionally antagonistic chatbot running on local models through Ollama. The frontend renders a David bust via Canvas 2D with Sobel edge detection for a wireframe contour effect, layered with phosphor dots, scan lines, and VHS tracking bands. TTS sentences are synthesized in parallel with token generation so audio starts playing before the full response is finished.",
    techStack: [
      "Python",
      "FastAPI",
      "Ollama",
      "Qwen3-TTS",
      "Whisper",
      "Canvas 2D",
      "JavaScript",
    ],
    highlights: [
      "Streaming TTS pipeline: responses split at sentence boundaries, each sentence queued for synthesis while the LLM generates the next one",
      "3 TTS backends with automatic fallback chain — Qwen3-TTS (emotional synthesis with voice cloning), Kokoro, and macOS say as last resort",
      "Audio post-processing: pitch shift, echo with decay taps, soft-knee compression, normalization, and trailing silence trim — all applied in-process",
      "Irritation system escalates the system prompt injection from 30 to 95 based on message count, with LLM-generated context-aware taunts referencing recent messages",
      "Think-block filtering handles <think> tags split across token boundaries via buffering, so reasoning models can think without the user seeing it",
      "Whisper-based voice input with Web Audio API gain management across 3 parallel audio nodes (boot, session, glitch)",
    ],
    link: "https://github.com/JoshKappler/chadGPT",
    linkLabel: "GitHub",
    accentColor: "#e67e22",
  },
  {
    title: "sniply.biz",
    subtitle: "Full-Stack SaaS Marketplace",
    description:
      "A two-sided marketplace for booking barbers and stylists, built and deployed end to end. Custom session auth with no external library — HMAC-SHA256 token signing with timing-safe comparison. PostgreSQL advisory locks serialize concurrent booking requests to prevent double-booking even across multiple server instances.",
    techStack: [
      "Next.js 16",
      "TypeScript",
      "PostgreSQL",
      "Tailwind",
      "Vitest",
      "Playwright",
    ],
    highlights: [
      "Match scoring: 40% hair type compatibility + 60% style preference overlap, with graceful fallback when profile data is incomplete",
      "Advisory locks (pg_advisory_xact_lock) serialize booking transactions — unlike FOR UPDATE, these work even when no row exists yet",
      "API endpoints strip PII from bookings when queried by non-owning professionals — only time-block data leaks for availability calculation",
      "Browser-side image compression using Canvas API, dynamically adjusting JPEG quality from 0.80 down to 0.30 to fit a 400KB limit",
      "54 Playwright E2E tests covering auth, booking flows, messaging, and the pro dashboard — run against production builds on a separate port",
      "Haversine distance search with Nominatim geocoding, bi-directional JSONB messaging with per-side unread tracking",
    ],
    link: "https://github.com/JoshKappler/sniply.biz",
    linkLabel: "GitHub",
    accentColor: "#1abc9c",
  },
  {
    title: "Arena",
    subtitle: "Two-Agent AI Roleplay",
    description:
      "Streams two-agent conversations in real time with configurable personalities, situations, and guidelines. Modular prompt assembly system lets you reorder identity, situation, and guideline blocks per character. Includes a killer/narrator role system for structured storytelling scenarios.",
    techStack: [
      "TypeScript",
      "Next.js 15",
      "Claude Agent SDK",
      "Groq",
      "OpenRouter",
    ],
    highlights: [
      "Modular prompt blocks (guidelines, identity, situation) with configurable order and per-character overrides",
      "Loop detection: checks if the last 4 turns form a repeating pattern and terminates gracefully",
      "NDJSON streaming with rate limit handling — emits retry events to the frontend instead of failing silently",
      "Preset system: save, load, and share conversation configurations as JSON with full character state",
      "Context windowing keeps only the last N turns in the prompt to manage token budgets on long conversations",
      "Multi-provider support with automatic fallback: Claude Agent SDK, OpenRouter, or Groq",
    ],
    link: "https://github.com/JoshKappler/Arena",
    linkLabel: "GitHub",
    accentColor: "#e056a0",
  },
  {
    title: "prisoners-dilemma",
    subtitle: "AI Game Theory Tournament",
    description:
      "Round-robin tournament where LLM agents play iterated Prisoner's Dilemma. Each agent negotiates in natural language before secretly choosing to cooperate or defect. The system tracks strategies that emerge across rounds — agents develop grudges, build trust, and learn to detect deception.",
    techStack: [
      "TypeScript",
      "Next.js 15",
      "Claude Agent SDK",
      "Groq",
    ],
    highlights: [
      "Negotiation phase: agents discuss in natural language before each round, trying to convince their opponent to cooperate",
      "Secret decision extraction: LLM output parsed for cooperate/defect choice independently from the negotiation text",
      "Tournament scoring across all pairings with running leaderboard",
      "Agents receive full history of prior rounds with their current opponent, enabling grudge and trust dynamics",
      "22 personality archetypes produce distinct emergent strategies — some always defect, some reciprocate, some forgive",
      "Dynamic agent generation from a pool of personalities, backstories, and alignment traits",
    ],
    link: "https://github.com/JoshKappler/prisoners-dilemma",
    linkLabel: "GitHub",
    accentColor: "#16a085",
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
          Everything here was built from scratch — direct SDK calls, no
          LangChain, no CrewAI, no agent frameworks.
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
