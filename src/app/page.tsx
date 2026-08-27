import { Globe } from "@/components/globe";
import { BOOKING_URL, DEMO_URL } from "@/lib/site";

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
    line: "General Translation's internal growth dashboard. Agent pipelines find leads, research and score them, and draft the outreach; a reviewer model gates every draft. Internal tool, no public link.",
  },
  {
    name: "memo-engine",
    href: DEMO_URL,
    line: "Reads a private-credit deal data room and writes a credit memo with every claim cited to its source page. The public demo ingests an 80-file SEC data room end to end.",
  },
  {
    name: "claim-wright",
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
    line: "Claude Code, driven from an Apple Watch over cellular.",
  },
  {
    name: "fleetview",
    href: "https://github.com/JoshKappler/claude-control-center",
    line: "A terminal cockpit that runs up to eight Claude agents in parallel and keeps every machine I own in sync. Zero npm dependencies.",
  },
  {
    name: "sniply",
    href: "https://github.com/JoshKappler/sniply",
    line: "A live booking marketplace for barbers and stylists. The one project here with no AI in it. 234 tests.",
    links: [{ label: "Live", href: "https://sniply.biz" }],
  },
  {
    name: "survival-station",
    href: "https://github.com/JoshKappler/survival-station",
    line: "An air-gapped, solar-powered AI survival computer for a non-technical user: local models, an offline encyclopedia, offline maps, no internet ever.",
  },
  {
    name: "property-leads",
    line: "An autonomous lead-finding pipeline for a real-estate cash buyer. Four agents on an hourly cron, about $0.22 per 33-property batch. Private client work.",
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
  },
  {
    name: "deskfly",
    href: "https://github.com/JoshKappler/deskfly",
    line: "A fruit fly's real connectome, living on my desktop.",
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
    <main className="mx-auto max-w-[37rem] px-6 py-14 text-justify text-[17px] leading-relaxed hyphens-auto">
      <Globe />

      <header className="mt-6 text-center">
        <h1 className="text-3xl">Josh Kappler</h1>
        <p className="mt-1 font-mono text-[13px] text-text-muted">
          Founding DX Engineer · San Francisco
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

      <p className="mt-10">
        I&apos;m the founding DX Engineer at{" "}
        <a
          href="https://generaltranslation.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          General Translation
        </a>
        , where I build the developer-facing side of localization: open-source
        SDKs, a CLI, and the platform behind them.
      </p>
      <p className="mt-4">
        I build AI agents from scratch and write the orchestration layer
        myself: tool loops, state machines, memory, routing. No agent
        frameworks.
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
        , a YouTube channel with 2.1M subscribers and 270M views.
      </p>

      <ItemList title="projects" items={projects} />
      <ItemList title="playground" items={playground} />

      <section className="mt-12">
        <h2 className="text-center font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
          contact
        </h2>
        <p className="mt-4">
          Email me at{" "}
          <a href="mailto:Joshua.Kappler@gmail.com" className="underline">
            Joshua.Kappler@gmail.com
          </a>
          , or{" "}
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            book a call
          </a>
          .
        </p>
      </section>

      <footer className="mt-14 border-t border-border pt-4 text-center font-mono text-xs text-text-muted">
        Josh Kappler · 2026
      </footer>
    </main>
  );
}
