import { ContactEmail } from "@/components/contact-email";
import { CrestMark } from "@/components/crest-mark";
import { Globe } from "@/components/globe";
import { SquareParagraphs } from "@/components/square-paragraphs";
import { DEMO_URL } from "@/lib/site";

type ItemLink = { label: string; href: string };
type Item = { name: string; href?: string; line: string };

const projects: Item[] = [
  {
    name: "Ask AI",
    href: "https://dash.generaltranslation.com",
    line: "The assistant on the General Translation dashboard, live in production today. Grounded in the docs, with read-only account tools, per-plan model tiers, per-plan rate limits, and per-plan usage billing.",
  },
  {
    name: "GTM dashboard",
    line: "General Translation's internal growth dashboard. Agent pipelines find the leads, research and score them, and then draft the outreach; a separate reviewer model gates every outgoing draft.",
  },
  {
    name: "autovid",
    href: "https://autovid.joshuakappler.com",
    line: "A pipeline built at General Translation that turns docs pages into finished demo videos, 22 of them live so far: it writes the scene script, scaffolds a real working app, drives a real browser and a real code editor, records the whole run, and then cuts together the finished video.",
  },
  {
    name: "memo engine",
    href: DEMO_URL,
    line: "Built for a private credit firm. It reads a deal's documents and writes the credit memo, with every claim cited back to the exact source page. The demo runs a full 80-file deal start to finish.",
  },
  {
    name: "claim wright",
    href: "https://github.com/JoshKappler/claim-wright",
    line: "Insurance claim adjudication where Claude reads the documents and a deterministic engine computes the payout. Median error against the human adjudicator: $0. Built end to end in 36 hours.",
  },
  {
    name: "autohack",
    href: "https://github.com/JoshKappler/autohack",
    line: "An autonomous bug-hunter that watches seven public bug bounty platforms, spawns hour-long hunts, adversarially reviews every one of its own findings, and then drafts submission-ready reports.",
  },
  {
    name: "pinch",
    href: "https://github.com/JoshKappler/apple-watch-claude-code",
    line: "Claude Code, driven from an Apple Watch over a cellular connection. The agent itself runs on my Mac behind an authenticated tunnel; the watch is a native watchOS client: dictate a prompt, pinch to send it, roll the crown to approve diffs, shake your wrist to stop it.",
  },
  {
    name: "fleetview",
    href: "https://github.com/JoshKappler/claude-control-center",
    line: "A terminal cockpit that runs up to eight Claude agents in parallel and keeps every machine I own in sync. The agents survive crashes and reboots. Plain Node, raw ANSI, zero npm dependencies.",
  },
  {
    name: "survival station",
    href: "https://github.com/JoshKappler/survival-station",
    line: "An air-gapped, solar-powered AI survival computer built for a non-technical user: local models, an 85 GB offline library with all of English Wikipedia, full offline US maps, no internet ever.",
  },
  {
    name: "property leads",
    line: "Built for a Chicago property holding company that buys foreclosures for cash. Four agents on an hourly cron find, research, and score the properties, all at roughly $0.22 per 33-property batch.",
  },
];

const playground: Item[] = [
  {
    name: "herdr layout",
    href: "https://github.com/JoshKappler/herdr-layout",
    line: "The terminal cockpit I live in: a forked agent multiplexer whose UI I rebuilt to herd nine Claude Code sessions. Boxed-tab sidebar, a live action line per session, a native detail panel.",
  },
  {
    name: "chadGPT",
    href: "https://chadgpt.joshuakappler.com",
    line: "A hostile chatbot on a green CRT. He answers your question correctly, and then insults you for asking. He has a real phone number.",
  },
  {
    name: "chud",
    href: "https://chud.joshuakappler.com",
    line: "A goblin voice assistant with a jiggly skin. He talks back to you. You can beat him up if you want; he just stays grumpy until he heals.",
  },
  {
    name: "deskfly",
    href: "https://deskfly.joshuakappler.com",
    line: "A fruit fly's real connectome, living as a fly on my desktop.",
  },
  {
    name: "scuttle",
    href: "https://scuttle.joshuakappler.com",
    line: "A voxel pirate roguelite in the browser. Cannonballs remove real voxels, compartments flood, and the ships list, capsize, and sink.",
  },
];

const headerLinks: ItemLink[] = [
  { label: "Resume", href: "/resume" },
  { label: "GitHub", href: "https://github.com/JoshKappler" },
  { label: "YouTube", href: "https://youtube.com/boffy" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/josh-kappler" },
  { label: "Email", href: "mailto:Joshua.Kappler@gmail.com" },
];

function ItemList({ title, items }: { title: string; items: Item[] }) {
  return (
    <section className="mt-12">
      <h2 className="text-center font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
        {title}
      </h2>
      <ul className="mt-4 space-y-5">
        {items.map((item) => (
          <li key={item.name}>
            {item.href ? (
              <a
                href={item.href}
                target={item.href.startsWith("/") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="font-bold underline"
              >
                {item.name}
              </a>
            ) : (
              <span className="font-bold">{item.name}</span>
            )}
            <span className="font-bold">.</span> {item.line}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Home() {
  return (
    <main
      data-paper
      className="mx-auto max-w-[37rem] border-x-[0.0625rem] border-border px-6 pt-6 pb-14 text-[1.0625rem] leading-relaxed"
    >
      {/* Referenced by globals.css: nudges glyph edges like ink on fiber. */}
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <filter id="ink-bleed" x="-3%" y="-8%" width="106%" height="116%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.4"
            numOctaves="2"
            seed="7"
          />
          <feDisplacementMap in="SourceGraphic" scale="0.9" />
        </filter>
      </svg>
      <SquareParagraphs />
      <Globe />

      <header className="mt-2 text-center">
        <h1 className="text-3xl">Josh Kappler</h1>
        <p className="mt-1 font-mono text-[0.8125rem] text-text-muted">
          Software Engineer · San Francisco
        </p>
        <nav className="mt-4 font-mono text-[0.8125rem] print:hidden">
          {headerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="mx-1.5 underline"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <div aria-hidden className="mt-8 text-center text-text-muted">
        *&nbsp;&nbsp;*&nbsp;&nbsp;*
      </div>

      <p className="mt-8">
        I&apos;m the founding DX Engineer at{" "}
        <a
          href="https://generaltranslation.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          General Translation
        </a>
        , where I&apos;ve built the dashboard&apos;s AI assistant, an
        autonomous outbound growth engine, and a content engine that turns the
        docs into demo videos and tutorials.
      </p>
      <p className="mt-4">
        I ship whole products: the frontend, the backend, the data model, and
        the AI inside them. When that means agents, I write the orchestration
        myself: tool loops, state machines, memory, routing. No frameworks.
      </p>
      <p className="mt-4">
        Before engineering I ran{" "}
        <a
          href="https://youtube.com/boffy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Boffy
        </a>
        , a YouTube channel with 2.1M subscribers and 270M lifetime views
        across its 136 long-form videos.
      </p>

      <ItemList title="projects" items={projects} />
      <ItemList title="playground" items={playground} />

      <section className="mt-12">
        <h2 className="text-center font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
          contact
        </h2>
        <div className="relative mt-4 text-center">
          <ContactEmail />
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
            I read everything.
          </p>
        </div>
      </section>

      <div aria-hidden className="mt-14 text-center leading-none">
        <CrestMark className="inline-block h-[5.33rem] text-seal" />
      </div>

      <footer className="mt-12 border-t border-border pt-4 text-center font-mono text-xs text-text-muted">
        <p>Josh Kappler · President, Boffy LLC · 2026</p>
        <p className="mt-1">
          Founding Developer Experience Engineer, General Translation, Inc.
        </p>
        <p className="mt-1">Set in Georgia. System fonts only, no trackers.</p>
      </footer>
    </main>
  );
}
