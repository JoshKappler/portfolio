"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { ProjectCard } from "./project-card";

const projects = [
  {
    title: "memo-engine",
    subtitle: "Deal Analysis + Investment Memo Platform",
    description:
      "memo-engine is an AI deal-analysis and investment-memo platform built for a private credit investment firm. It ingests messy deal documents (PDFs, Excel models, Word drafts, Outlook .msg emails) and produces institutional-grade memos where every claim is cited back to its source. It runs agentic RAG over pgvector, uses forced tool_use for about 40 fields of structured extraction, and orchestrates the pipeline durably on Vercel Workflow DevKit. The production app is under NDA, so the linked repository is a sanitized build with placeholder branding and no client data.",
    techStack: [
      "Next.js 16",
      "TypeScript",
      "Anthropic SDK",
      "Postgres",
      "pgvector",
      "Voyage AI",
      "Vercel Workflow DevKit",
    ],
    highlights: [
      "Contextual retrieval: per-chunk Sonnet 4.6 prefixes run over the full document, with the first 400K chars cached via ephemeral prompt caching so every call reads at the $0.30/M cached rate",
      "Voyage AI voyage-3 embeddings (1024-dim) batched by byte budget (≤400KB, ≤96 items) to respect the 320K-token-per-batch cap on dense financial text",
      "Forced tool_use with Zod-to-JSON-schema for ~40-field structured extraction: credit snapshot, capital structure, financials, covenants, management, comps, scenarios",
      "Durable pipeline orchestration via Vercel Workflow DevKit: parse, analysis, research, internal memo, and external memo each run as a step with its own 800s budget",
      "Multi-format export: PDF via @sparticuz/chromium + puppeteer-core (Vercel-compatible headless Chromium), Excel with ExcelJS formulas and sensitivity tables, DOCX, ZIP bundle",
      "Multi-user auth with bcrypt cost 12 and JWT sessions via jose, admin approval gate, with a legacy shared-password fallback for continuity",
    ],
    link: "https://github.com/JoshKappler/memo-engine",
    linkLabel: "GitHub",
    accentColor: "#2c3e50",
  },
  {
    title: "autohack",
    subtitle: "Autonomous Security Agent",
    description:
      "A 5-package TypeScript monorepo that polls four bounty platforms, spawns hour-long Claude sessions to hunt for vulnerabilities, validates its own findings through adversarial review, and submits reports without human intervention. A separate Sonnet pass compresses verbose findings before submission. The system writes hunt outcomes, near-misses, and triager feedback to a JSON memory store so every future session starts with context from every past one. The same harness also runs a bounty agent on the Algora platform: it spawns Claude Code sessions for long autonomous runs, executes the test suite, opens PRs, and addresses review feedback on its own.",
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
    title: "property-leads",
    subtitle: "Autonomous Lead-Finding Pipeline",
    description:
      "property-leads is an autonomous lead-finding pipeline for a real-estate cash buyer, built as private client work. A four-agent chain runs on an hourly cron: a Haiku orchestrator, Sonnet research and scoring, and a Sonnet writer gated by a Haiku reviewer. Outreach runs at about $0.22 per 33-property batch. Private client work, no public repository.",
    techStack: [
      "Next.js 16",
      "Anthropic SDK",
      "Neon Postgres",
      "Drizzle",
      "Apify",
      "Resend",
      "Leaflet",
    ],
    highlights: [
      "4-stage agent pipeline with tiered models: Haiku for orchestration and the outreach reviewer, Sonnet for research, scoring, and draft writing",
      "Research agent folds FEMA flood zones and municipal violation and permit data into a single MAO with cited reasoning per property",
      "Scoring returns 0-100 with hot/warm/cold tiering and a breakdown so an analyst can disagree with the model in one read",
      "Outreach has a Sonnet drafter and a separate Haiku reviewer that can block or rewrite a draft before it reaches Resend. emailPolicy defaults to off so test runs never blast",
      "Scheduling is three knobs on a versioned config row: pause, interval in minutes, and time-of-day with IANA timezone. Vercel cron fires hourly and the route gates itself",
      "Idempotent ALTER TABLE migration runner, fingerprint-based dedup across runs, Nominatim geocoding queue with a hard 1 req/sec rate limit",
    ],
    linkLabel: "Private",
    accentColor: "#1abc9c",
  },
  {
    title: "survival-station",
    subtitle: "Offline-First AI Survival Appliance",
    description:
      "An air-gapped PC, built for a non-technical user, that runs with no internet on solar power. A stdlib-only Python server (the machine had Windows Smart App Control blocking unsigned binaries, so no numpy, torch, or Open WebUI) proxies a local Ollama for streaming chat and multimodal photo identification. Answers are grounded with retrieval over an offline Kiwix encyclopedia, fetched in parallel with the model and fail-open. Offline maps run on a pure-PowerShell PMTiles server with a MapLibre viewer.",
    techStack: [
      "Python (stdlib)",
      "Ollama",
      "gemma3 / moondream",
      "Kiwix",
      "PowerShell",
      "MapLibre",
    ],
    highlights: [
      "Stdlib-only Python web server: streaming NDJSON chat, multimodal photo input, and a single-file inline UI, with zero pip packages because Smart App Control blocked unsigned binaries during the build",
      "Retrieval grounding over an offline Kiwix library: the lookup runs in parallel with the model answer, carries its own short timeout, and fails open so a slow or missing library never blocks the chat",
      "Hand-rolled HTMLParser scrapes Kiwix search results and maps ZIM slugs to readable source labels (Medical Encyclopedia, iFixit, Prepper Pack, Wikipedia)",
      "Local multimodal vision via gemma3:4b and moondream for plant and wound identification, behind a hard safety prompt that refuses to ever call a wild plant edible from a photo alone",
      "Pure-PowerShell PMTiles server resolves map tiles out of a single binary archive over HTTP range requests, paired with a vendored MapLibre viewer for fully offline maps",
      "Localhost-only with no runtime telemetry; about 87 GB of encyclopedias, tiles, and models stays out of git and rebuilds from a manifest (aria2 download list plus extract scripts)",
    ],
    link: "https://github.com/JoshKappler/survival-station",
    linkLabel: "GitHub",
    accentColor: "#4a7c59",
  },
  {
    title: "Village",
    subtitle: "Experiment · Emergent Multi-Agent Simulation",
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

        {/* Always mounted so crawlers and AI screeners see every project; collapsed visually */}
        <motion.div
          key="rest"
          initial={false}
          animate={{
            opacity: expanded ? 1 : 0,
            height: expanded ? "auto" : 0,
          }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="space-y-8 overflow-hidden"
          aria-hidden={!expanded}
        >
          {restProjects.map((project, i) => (
            <ProjectCard
              key={project.title}
              index={TOP_COUNT + i + 1}
              {...project}
            />
          ))}
        </motion.div>

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
