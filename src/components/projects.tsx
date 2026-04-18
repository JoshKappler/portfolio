"use client";

import { motion, AnimatePresence, useInView } from "motion/react";
import { useRef, useState } from "react";
import { ProjectCard } from "./project-card";

const projects = [
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
      "Adversarial review: a separate Claude instance scores findings on a 0-15 binary rubric. Anything below 8 is rejected before it reaches a triager",
      "Ephemeral prompt caching cuts input tokens by roughly 90% across repeated hunt sessions, with a local backend fallback for development",
      "Cross-process coordination via lock files, shared runtime-override JSON with a 2-second TTL cache, and stale-PID detection on startup",
      "Error classification (transient, permanent, validation, timeout) decides whether to retry, skip, or kill the hunt",
      "Real-time tRPC dashboard with xterm.js terminal streaming live Claude tool calls and reasoning",
    ],
    link: "https://github.com/JoshKappler/autohack",
    linkLabel: "GitHub",
    accentColor: "#e74c3c",
  },
  {
    title: "Socratic",
    subtitle: "Multi-Agent Debate Platform",
    description:
      "A live web app where five AI agents with distinct philosophical perspectives debate any topic in real time. An orchestrator agent controls turn order based on conversation state, creating natural back-and-forths, interjections, and redirects instead of round-robin. Agents track their own positions throughout the debate, conceding points and evolving their arguments as the conversation develops.",
    techStack: [
      "TypeScript",
      "Next.js 16",
      "Anthropic SDK",
      "Zod",
      "SSE Streaming",
      "Tailwind",
    ],
    highlights: [
      "Orchestrator uses tool_use to return structured decisions (who speaks next, who they address, and convergence status), validated with Zod at the boundary",
      "Position tracking: each agent maintains a running record of concessions, firm holds, and compelling counterarguments, fed back into their next prompt",
      "Multi-provider LLM abstraction: Anthropic API, OpenRouter, and Groq, auto-selected based on environment variables",
      "Server-sent events stream debate events (turn_start, token, turn_end, status_change, debate_end) to a React frontend in real time",
      "Classical courtroom UI with semicircular avatar layout, color-coded chat feed, and animated speaking/thinking states per agent",
      "Convergence detection: orchestrator tracks position drift across agents and declares resolution or deadlock with a synthesis of where they agreed and diverged",
    ],
    link: "https://github.com/JoshKappler/Socratic",
    linkLabel: "GitHub",
    accentColor: "#c9a96e",
  },
  {
    title: "Village",
    subtitle: "Emergent Multi-Agent Simulation",
    description:
      "Drops 4-8 AI agents into a persistent world with locations, an economy, spoilage timers, and a DM orchestrator. Each agent runs a 4-phase cognitive pipeline per tick. The DM has its own 3-tier memory and persistent beliefs across runs, intervening with crises and events to maintain narrative tension.",
    techStack: [
      "TypeScript",
      "Next.js 15",
      "Anthropic SDK",
      "Groq",
      "OpenRouter",
    ],
    highlights: [
      "4-phase concurrent execution per tick: decision, action, reflection, planning. Each agent returns an immutable result object, mutations applied after",
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
    title: "sniply.biz",
    subtitle: "Full-Stack SaaS Marketplace",
    description:
      "A two-sided marketplace for booking barbers and stylists, built and deployed end to end. Custom session auth with no external library. HMAC-SHA256 token signing with timing-safe comparison. PostgreSQL advisory locks serialize concurrent booking requests to prevent double-booking even across multiple server instances.",
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
      "Advisory locks (pg_advisory_xact_lock) serialize booking transactions. Unlike FOR UPDATE, these work even when no row exists yet",
      "API endpoints strip PII from bookings when queried by non-owning professionals, so only time-block data leaks for availability calculation",
      "Browser-side image compression using Canvas API, dynamically adjusting JPEG quality from 0.80 down to 0.30 to fit a 400KB limit",
      "54 Playwright E2E tests covering auth, booking flows, messaging, and the pro dashboard, run against production builds on a separate port",
      "Haversine distance search with Nominatim geocoding, bi-directional JSONB messaging with per-side unread tracking",
    ],
    link: "https://github.com/JoshKappler/sniply.biz",
    linkLabel: "GitHub",
    accentColor: "#1abc9c",
  },
  {
    title: "genesis",
    subtitle: "Directed Evolution Engine",
    description:
      "I wanted to see if I could breed better AI agent prompts instead of writing them by hand. This system represents personality as ~20 modular traits across 5 psychological categories, mutates them, runs agents through behavioral scenarios with a dynamic narrator that adapts to their responses, and selects winners through natural selection. The agents develop behavior they were never explicitly told to have.",
    techStack: ["Python", "Ollama", "Gemma 4", "Pydantic", "Textual TUI"],
    highlights: [
      "Traits describe WHO someone IS, not WHAT TO DO. This avoids instruction pollution so evolution operates on semantic building blocks",
      "4 mutation operators: tweak (60%), swap from trait pool (20%), delete (10%), duplicate+drift across categories (10%)",
      "Two-phase evaluation: binary pass/fail gates first, then anonymous head-to-head ranking using letter labels (A/B/C/D/E) so the evaluator can't be biased by champion status",
      "Champion caching reuses scenario runs until a new champion is crowned, cutting ~20% of LLM calls per generation",
      "Full generation rollback: revert to any past generation, trim later data, and resume evolution from that point",
      "Runs entirely local on Ollama. No cloud calls, no API keys, no rate limits",
    ],
    link: "https://github.com/JoshKappler/genesis",
    linkLabel: "GitHub",
    accentColor: "#2ecc71",
  },
  {
    title: "content-pipeline",
    subtitle: "Audio-First Video Synthesis",
    description:
      "A video pipeline that inverts the usual generation order. Narration is synthesized and transcribed with word-level timestamps before any visuals exist. Scene durations are derived from word counts in the audio, so images and clips are generated to fit the timing instead of the other way around. The hard engineering problem here is keeping word-level subtitles, Ken Burns motion, and music beds all aligned to a timeline that was never edited, only transcribed.",
    techStack: [
      "Python",
      "Anthropic SDK",
      "Gemini",
      "Imagen 4",
      "faster-whisper",
      "ffmpeg",
    ],
    highlights: [
      "Word-level subtitle alignment: Whisper extracts timestamps, a sequence matcher replaces transcribed words with the original script, and gaps are interpolated so no word falls out of sync with the audio",
      "Pitch shifting lowers narration by 2 semitones via ffmpeg, then rescales the existing Whisper timestamps by the stretch factor instead of re-running speech-to-text on the shifted audio",
      "Provider pattern for swappable TTS, image, and LLM backends. The same pipeline runs against Gemini, Imagen 4, ElevenLabs, or Edge TTS without touching orchestration code",
      "Claude SDK with tool_use for structured scene output. Scenes return as validated objects instead of parsing JSON from free-form text",
      "Batch mode with mechanism-level deduplication so no two runs in a batch are built on the same underlying narrative device",
      "Full prompt archival per scenario: every image/TTS/LLM prompt used in a run is saved next to the MP4, so any output is reproducible from its archive folder alone",
    ],
    link: "https://github.com/JoshKappler/content-pipeline",
    linkLabel: "GitHub",
    accentColor: "#f39c12",
  },
  {
    title: "Mafia",
    subtitle: "Multi-Agent Social Deduction Game",
    description:
      "A full werewolf/mafia game played entirely by LLM agents. Four roles (wolf, villager, doctor, detective), day and night phases, three rounds of open discussion per day, voting, and a win-condition check after every phase. Each agent generates its own personality from a trait pool at the start of a game and carries that identity across every round.",
    techStack: [
      "TypeScript",
      "Next.js 15",
      "React 19",
      "Anthropic SDK",
      "Groq",
    ],
    highlights: [
      "Four distinct role prompts. Wolves coordinate privately at night, the doctor picks someone to protect, the detective investigates one player per night, villagers vote blind during the day",
      "Three-round day discussions where each living player speaks in turn, referencing accusations from earlier rounds and adjusting their own story in response",
      "Deterministic name extraction parses LLM output against the living-player list to resolve votes, instead of trusting the model to return structured output",
      "Every run is saved to disk as both JSON (machine replayable) and TXT (human readable), so transcripts persist for analysis across dozens of completed games",
      "Multi-provider LLM abstraction so roles can swap backends mid-game: Anthropic API, Groq, or OpenRouter, picked via environment variable",
      "Temperature 0.9 and 300-token cap per message keeps agents tight and stops them from monologuing themselves into obvious tells",
    ],
    link: "https://github.com/JoshKappler/Mafia",
    linkLabel: "GitHub",
    accentColor: "#3498db",
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
      "3 TTS backends with automatic fallback chain: Qwen3-TTS (emotional synthesis with voice cloning), Kokoro, and macOS say as last resort",
      "Audio post-processing: pitch shift, echo with decay taps, soft-knee compression, normalization, and trailing silence trim, all applied in-process",
      "Irritation system escalates the system prompt injection from 30 to 95 based on message count, with LLM-generated context-aware taunts referencing recent messages",
      "Think-block filtering handles <think> tags split across token boundaries via buffering, so reasoning models can think without the user seeing it",
      "Whisper-based voice input with Web Audio API gain management across 3 parallel audio nodes (boot, session, glitch)",
    ],
    link: "https://github.com/JoshKappler/chadGPT",
    linkLabel: "GitHub",
    accentColor: "#e67e22",
  },
  {
    title: "Arena",
    subtitle: "Moral-Dilemma Agent Scenarios",
    description:
      "An engine for dropping LLM agents into sealed-room moral dilemmas and watching what they do. Three built-in situations: the Escape Room (only one person leaves alive), the Basement (captor holds a captive), and the Control Room (collective crisis decision). Situations and personalities are hand-authored JSON files, so new scenarios can be added without touching code.",
    techStack: [
      "TypeScript",
      "Next.js 15",
      "React 19",
      "Anthropic SDK",
    ],
    highlights: [
      "Scenario-driven: each situation JSON defines the rules and stakes, each personality JSON defines who the agent is. Everything after that emerges from the conversation",
      "Personality files are character-first, not instruction-first. They describe who the agent IS, not what to say, so behavior is emergent rather than scripted",
      "Three built-in situations covering distinct pressure types: coercion (escape room), power imbalance (basement), and collective responsibility (control room)",
      "10+ saved runs per scenario, used to compare how different personality mixes behave under the same constraints",
      "Full run history persisted to disk so any scenario can be replayed, diffed against past runs, or used as input for new behavioral experiments",
      "Runs on the same multi-provider LLM layer as my other agent projects: Anthropic API, Groq, or OpenRouter, picked via environment variable",
    ],
    link: "https://github.com/JoshKappler/Arena",
    linkLabel: "GitHub",
    accentColor: "#34495e",
  },
];

const TOP_COUNT = 3;

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [expanded, setExpanded] = useState(false);

  const topProjects = projects.slice(0, TOP_COUNT);
  const restProjects = projects.slice(TOP_COUNT);

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
          01 / Projects
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
          Everything here was built from scratch. I write the orchestration
          layer myself. No LangChain, no CrewAI, no agent frameworks.
        </motion.p>
      </div>

      {/* Project cards */}
      <div className="max-w-5xl mx-auto space-y-8">
        {topProjects.map((project, i) => (
          <ProjectCard key={project.title} index={i + 1} {...project} />
        ))}

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="rest"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-8 overflow-hidden"
            >
              {restProjects.map((project, i) => (
                <ProjectCard
                  key={project.title}
                  index={TOP_COUNT + i + 1}
                  {...project}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle button */}
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="group relative inline-flex items-center gap-3 px-6 py-3 font-mono text-xs tracking-[0.2em] uppercase text-text-muted border border-border/60 rounded-full hover:text-accent hover:border-accent/40 transition-all duration-300"
            aria-expanded={expanded}
          >
            <span>
              {expanded
                ? "Show fewer projects"
                : `Show ${restProjects.length} more projects`}
            </span>
            <span
              className={`inline-block transition-transform duration-300 ${
                expanded ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            >
              ↓
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
