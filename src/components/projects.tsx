"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { ProjectCard } from "./project-card";

const projects = [
  {
    title: "memo-engine",
    subtitle: "Deal Analysis + Investment Memo Platform",
    description:
      "memo-engine is an AI deal-analysis and investment-memo platform built for a private credit investment firm. It takes a messy deal data room (PDFs, Excel models, Word drafts, Outlook emails, scans) and produces an institutional-format credit memo where every claim is cited back to the exact source page or cell. Reasoning passes run on Claude Fable 5 over agentic RAG with pgvector; parsing, extraction, drafting, and export run as durable workflow steps. The client build is under NDA. The public demo is the same system pointed at public data: an 80-file SEC data room for AMC Entertainment, ingested and analyzed end to end, browsable down to each citation.",
    techStack: [
      "Next.js 16",
      "TypeScript",
      "Anthropic SDK",
      "Claude Fable 5",
      "Postgres",
      "pgvector",
      "Voyage AI",
      "Vercel Workflow DevKit",
    ],
    highlights: [
      "Contextual retrieval: per-chunk Sonnet 4.6 prefixes run over the full document, with the first 400K chars cached via ephemeral prompt caching so every call reads at the $0.30/M cached rate",
      "Voyage AI voyage-3 embeddings (1024-dim) batched by byte budget (≤400KB, ≤96 items) to respect the 320K-token-per-batch cap on dense financial text",
      "Forced tool_use with Zod-to-JSON-schema for ~40-field structured extraction: credit snapshot, capital structure, financials, covenants, management, comps, scenarios",
      "Reasoning and extraction split by API constraint: Fable 5 thinks through the deal (thinking is always on), then Sonnet runs the forced tool_use extraction, because the API rejects thinking combined with forced tool choice",
      "Durable pipeline orchestration via Vercel Workflow DevKit: parse, analysis, research, internal memo, and external memo each run as a step with its own 800s budget",
      "Multi-format export: PDF via @sparticuz/chromium + puppeteer-core (Vercel-compatible headless Chromium), Excel with ExcelJS formulas and sensitivity tables, DOCX, ZIP bundle",
    ],
    link: "https://github.com/JoshKappler/memo-engine",
    linkLabel: "GitHub",
    secondaryLink: "https://memo.joshuakappler.com/demo",
    secondaryLinkLabel: "Live demo",
    accentColor: "#2c3e50",
  },
  {
    title: "claim-wright",
    subtitle: "Full-Stack Claim Adjudication · Built in 36 Hours",
    description:
      "claim-wright is a fully working full-stack claim-adjudication system built end to end in a single 36-hour sprint. It reads the documents behind a security-deposit insurance claim (lease, tenant ledger, deposit-waiver addendum, move-out itemization, repair invoices) and recommends a payout capped at the policy benefit, or a decline, with a line-by-line audit trail behind every dollar. The split is the whole point: Claude Opus 4.8 does the reading and extracts structured facts, then a pure-Python deterministic engine applies the caps, rules, and eligibility gates, so a payout can never be a number the model invented. On a held-out test split it lands within $250 of the human adjudicator on 91% of claims with a median error of $0, at about $0.33 per claim.",
    techStack: [
      "Python 3.13",
      "Anthropic SDK",
      "Claude Opus 4.8",
      "Pydantic",
      "Django-Ninja",
      "React 19",
      "Vite",
      "SQLite",
    ],
    highlights: [
      "Full stack in a weekend: a Python adjudication core, a Django-Ninja API, a React 19 single-page app, and a packaged desktop build, all shipped end to end in 36 hours",
      "Model reads, engine decides: forced tool_use extraction pulls charges, ledger balance, and eligibility, then a pure-Python function computes the payout, so every dollar traces back to code and a document line and nothing is hallucinated",
      "91% of claims within $250 of the human decision, median error of $0, mean absolute error of $62, at about $0.33 per claim on the held-out test split",
      "Multi-user with per-tenant SQLite databases and workspace sharing: a run can be snapshotted and shared read-only into a space, copied on share so a viewer never touches the originator's live data",
      "Security hardening throughout: master-approved signup, PBKDF2 passwords, session tokens stored only as SHA-256 hashes, and an allow-list column projection that structurally blocks the human-answer fields from ever reaching the model",
      "Built-in white-hat security pass: the code is reviewed by autohack, my own autonomous bug-hunter, which traces user input to sinks and has a second model try to disprove each finding",
      "Hybrid document reading routes each PDF page by text density: about 75% read free with pure-Python pdfminer, scanned pages go to vision, and no poppler or tesseract binaries means the same code runs everywhere including the desktop build",
      "Calibration with zero API calls: extractions are stored and the engine is a pure function, so a candidate rulebook (JSON, not code) re-scores against the human decisions by replaying stored reads",
    ],
    link: "https://github.com/JoshKappler/claim-wright",
    linkLabel: "GitHub",
    accentColor: "#b5824a",
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
    title: "pinch",
    subtitle: "Claude Code, Driven From an Apple Watch",
    description:
      "pinch drives a real Claude Code session from an Apple Watch over cellular. A native watchOS SwiftUI app is the thin client; a Node and TypeScript backend runs the Claude Agent SDK against the live repos on my Mac, and a tunnel exposes it to the wrist. watchOS refuses WebSockets on the watch's network path, so the transport is plain HTTP request/response with a short-poll loop instead of a socket. Prompts go through a durable on-device outbox that retries until a confirmed 2xx, and the backend dedups by client prompt id so an at-least-once retry never double-runs a turn. Session state is recorded durably, so a backend restart or idle sweep revives the same conversation with full context through the SDK's resume.",
    techStack: [
      "Swift",
      "SwiftUI",
      "watchOS",
      "TypeScript",
      "Claude Agent SDK",
      "Node.js",
      "ngrok",
    ],
    highlights: [
      "HTTP request/response with a short-poll loop instead of a socket: watchOS refuses URLSessionWebSocketTask on the watch's cellular path, so the watch polls /api/* while the browser simulator keeps the WebSocket, both driving one shared session lifecycle",
      "Durable persisted outbox on the watch: a prompt is removed only on a confirmed 2xx, drained FIFO single-flight with Sending / Sent / Not sent states, and the backend dedups by client prompt id so a retry can never double-run a turn",
      "Session resume across restarts: our session id maps to the SDK session id in a durable record, so an idle-swept or restarted backend rebuilds the conversation with options.resume and Claude keeps full context",
      "Poll-cursor invariant kills duplicate replies: a resumed session continues its persisted cursor while a revived session resets to zero on a backend reset signal, so the event log never re-delivers history",
      "Watch-aware output: a cached system-prompt append tells the model it is speaking to a wrist screen with text-to-speech, so replies stay plain-text and brief without touching tools, edits, or rigor",
      "Stable ngrok static domain with bearer-token auth on every request; the watch can restart the backend from Settings, which builds first and only swaps the process if the build succeeds",
    ],
    link: "https://github.com/JoshKappler/apple-watch-claude-code-",
    linkLabel: "GitHub",
    accentColor: "#0a84ff",
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
    title: "sniply",
    subtitle: "Live Two-Sided Marketplace",
    description:
      "A booking marketplace for barbers and stylists, live at sniply.biz. Customers find pros by map, specialty, and availability; pros run their book, services, and hours from a dashboard. This is the one project here with no AI in the runtime path. It exists to prove the unglamorous parts: real auth, race-condition-safe booking, and a test suite that covers both sides of the product.",
    techStack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "PostgreSQL",
      "Tailwind 4",
      "Playwright",
    ],
    highlights: [
      "Double-booking prevention with PostgreSQL advisory locks: pg_advisory_xact_lock on barber + date serializes concurrent booking requests, which row locks alone cannot do for empty slots",
      "Custom HMAC-SHA256 session auth with timing-safe comparison, httpOnly cookies, and role separation between customers and pros",
      "291 test cases across 29 files, including 54 Playwright end-to-end tests covering browse, booking, messaging, reviews, and the pro dashboard",
      "Map-based discovery with Leaflet plus filters for hair type, specialty, and availability windows",
      "In-app messaging threads, verified reviews with pro replies, and a typed data access layer from rows to API responses",
      "Seed data for 22 pro profiles so local dev and demos work without production data",
    ],
    link: "https://github.com/JoshKappler/sniply",
    linkLabel: "GitHub",
    secondaryLink: "https://sniply.biz",
    secondaryLinkLabel: "Live site",
    accentColor: "#e67e22",
  },
];

const TOP_COUNT = 4;

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
