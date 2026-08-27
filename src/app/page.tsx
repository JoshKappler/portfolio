import { Globe } from "@/components/globe";
import { StretchLast } from "@/components/stretch-last";
import { DEMO_URL } from "@/lib/site";

type ItemLink = { label: string; href: string };
type Item = { name: string; href?: string; line: string; links?: ItemLink[] };

const projects: Item[] = [
  {
    name: "Ask AI",
    href: "https://dash.generaltranslation.com",
    line: "The assistant on the General Translation dashboard, live in production. Docs-grounded, with read-only account tools, per-plan model tiers, rate limits, and usage billing.",
  },
  {
    name: "GTM dashboard",
    line: "General Translation's internal growth dashboard. Agent pipelines find leads, research and score them, and draft the outreach; a reviewer model gates every draft.",
  },
  {
    name: "autovid",
    href: "https://autovid.joshuakappler.com",
    line: "A pipeline built at General Translation that turns docs pages into finished demo videos, 22 of them live so far: it writes the scene script, scaffolds a real app, drives a real browser and a code editor, records the run, and cuts the finished video.",
  },
  {
    name: "memo engine",
    href: DEMO_URL,
    line: "Built for a private credit firm. It reads a deal's documents and writes the credit memo, with every claim cited to the exact source page. The demo runs an 80-file deal end to end.",
  },
  {
    name: "claim wright",
    href: "https://github.com/JoshKappler/claim-wright",
    line: "Insurance claim adjudication where Claude reads the documents and a deterministic engine computes the payout. Median error against the human adjudicator: $0. Built in 36 hours.",
  },
  {
    name: "autohack",
    href: "https://github.com/JoshKappler/autohack",
    line: "An autonomous bug-hunter that watches seven bounty platforms, spawns hour-long hunts, adversarially reviews its own findings, and drafts submission-ready reports.",
  },
  {
    name: "pinch",
    href: "https://github.com/JoshKappler/apple-watch-claude-code",
    line: "Claude Code, driven from an Apple Watch over cellular. The agent runs on my Mac behind an authenticated tunnel; the watch is a native watchOS client: dictate a prompt, pinch to send, roll the crown to approve diffs, shake your wrist to stop it.",
  },
  {
    name: "fleetview",
    href: "https://github.com/JoshKappler/claude-control-center",
    line: "A terminal cockpit that runs up to eight Claude agents in parallel and keeps every machine I own in sync. Agents survive crashes and reboots. Plain Node, raw ANSI, zero npm dependencies.",
  },
  {
    name: "survival station",
    href: "https://github.com/JoshKappler/survival-station",
    line: "An air-gapped, solar-powered AI survival computer for a non-technical user: local models, an 85 GB offline library with all of English Wikipedia, offline US maps, no internet ever.",
  },
  {
    name: "property leads",
    line: "Built for a Chicago property holding company that buys foreclosures for cash. Four agents on an hourly cron find, research, and score properties, about $0.22 per 33-property batch.",
  },
];

const playground: Item[] = [
  {
    name: "chadGPT",
    href: "https://github.com/JoshKappler/chadGPT",
    line: "A hostile chatbot on a green CRT. He answers your question correctly, then insults you for asking. Has a phone number.",
    links: [{ label: "Live", href: "https://chadgpt.joshuakappler.com" }],
  },
  {
    name: "chud",
    href: "https://github.com/JoshKappler/chud",
    line: "A goblin voice assistant with a jiggly skin. He talks back. You can beat him up; he stays grumpy until he heals.",
    links: [{ label: "Live", href: "https://chud.joshuakappler.com" }],
  },
  {
    name: "deskfly",
    href: "https://github.com/JoshKappler/deskfly",
    line: "A fruit fly's real connectome, living on my desktop.",
    links: [{ label: "Live", href: "https://deskfly.joshuakappler.com" }],
  },
  {
    name: "scuttle",
    href: "https://github.com/JoshKappler/scuttle",
    line: "A voxel pirate roguelite in the browser. Cannonballs remove real voxels, compartments flood, and ships list, capsize, and sink.",
    links: [{ label: "Live", href: "https://scuttle-gold.vercel.app" }],
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
            {item.links && item.links.length > 0 && (
              <span className="font-mono text-[13px]">
                {" "}
                {item.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-1 underline"
                  >
                    {link.label}
                  </a>
                ))}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-[37rem] border-border px-6 py-14 text-[17px] leading-relaxed min-[42rem]:border-x">
      <StretchLast />
      <Globe />

      <header className="mt-6 text-center">
        <h1 className="text-3xl">Josh Kappler</h1>
        <p className="mt-1 font-mono text-[13px] text-text-muted">
          Software Engineer · San Francisco
        </p>
        <nav className="mt-4 font-mono text-[13px]">
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
        , a YouTube channel with 2.1M subscribers and 270M views across 136
        long-form videos.
      </p>

      <ItemList title="projects" items={projects} />
      <ItemList title="playground" items={playground} />

      <section className="mt-12">
        <h2 className="text-center font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
          contact
        </h2>
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-y-2">
          <a href="mailto:Joshua.Kappler@gmail.com" className="underline">
            Joshua.Kappler@gmail.com
          </a>
          <a href="tel:+15122109934" className="underline">
            512-210-9934
          </a>
        </div>
      </section>

      <footer className="mt-14 border-t border-border pt-4 text-center font-mono text-xs text-text-muted">
        <p>Founding Developer Experience Engineer, General Translation, Inc.</p>
        <p className="mt-1">Josh Kappler · President, Boffy LLC · 2026</p>
      </footer>
    </main>
  );
}
