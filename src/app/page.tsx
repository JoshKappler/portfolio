import { Globe } from "@/components/globe";
import { BOOKING_URL, DEMO_URL } from "@/lib/site";

type ItemLink = { label: string; href: string };
type Item = { name: string; line: string; links: ItemLink[] };

const projects: Item[] = [
  {
    name: "memo-engine",
    line: "Reads a private-credit deal data room and writes an institutional credit memo with every claim cited back to its source page. The public demo ingests an 80-file SEC data room end to end.",
    links: [{ label: "demo", href: DEMO_URL }],
  },
  {
    name: "claim-wright",
    line: "Insurance claim adjudication where Claude reads the documents and a deterministic engine computes the payout. Median error against the human adjudicator: $0. Built in 36 hours.",
    links: [{ label: "github", href: "https://github.com/JoshKappler/claim-wright" }],
  },
  {
    name: "autohack",
    line: "An autonomous bug-hunter that polls four bounty platforms, spawns hour-long hunts, adversarially reviews its own findings, and submits reports on its own.",
    links: [{ label: "github", href: "https://github.com/JoshKappler/autohack" }],
  },
  {
    name: "pinch",
    line: "Claude Code, driven from an Apple Watch over cellular.",
    links: [
      { label: "github", href: "https://github.com/JoshKappler/apple-watch-claude-code-" },
    ],
  },
  {
    name: "fleetview",
    line: "A terminal cockpit that runs up to eight Claude agents in parallel and keeps every machine I own in sync. Zero npm dependencies.",
    links: [
      { label: "github", href: "https://github.com/JoshKappler/claude-control-center" },
    ],
  },
  {
    name: "sniply",
    line: "A live booking marketplace for barbers and stylists. The one project here with no AI in it. 291 tests.",
    links: [
      { label: "live", href: "https://sniply.biz" },
      { label: "github", href: "https://github.com/JoshKappler/sniply" },
    ],
  },
  {
    name: "survival-station",
    line: "An air-gapped, solar-powered AI survival computer for a non-technical user: local models, an offline encyclopedia, offline maps, no internet ever.",
    links: [
      { label: "github", href: "https://github.com/JoshKappler/survival-station" },
    ],
  },
  {
    name: "property-leads",
    line: "An autonomous lead-finding pipeline for a real-estate cash buyer. Four agents on an hourly cron, about $0.22 per 33-property batch. Private client work.",
    links: [],
  },
];

const playground: Item[] = [
  {
    name: "claude-thunder",
    line: "A WW2 dogfighter that runs in the browser.",
    links: [{ label: "play", href: "https://claude-thunder.vercel.app" }],
  },
  {
    name: "deskfly",
    line: "A fruit fly's real connectome, living on my desktop.",
    links: [{ label: "github", href: "https://github.com/JoshKappler/deskfly" }],
  },
];

const headerLinks: ItemLink[] = [
  { label: "resume", href: "/resume" },
  { label: "github", href: "https://github.com/JoshKappler" },
  { label: "youtube", href: "https://youtube.com/boffy" },
  { label: "linkedin", href: "https://www.linkedin.com/in/josh-kappler" },
  { label: "email", href: "mailto:Joshua.Kappler@gmail.com" },
];

function ItemList({ title, items }: { title: string; items: Item[] }) {
  return (
    <section className="mt-12">
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
        {title}
      </h2>
      <ul className="mt-4 space-y-4">
        {items.map((item) => (
          <li key={item.name}>
            <span className="font-bold">{item.name}.</span> {item.line}
            {item.links.length > 0 && (
              <span className="font-mono text-[13px]">
                {" "}
                {item.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("/") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="mr-2 underline"
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
    <main className="mx-auto max-w-[37rem] px-6 py-14 text-[17px] leading-relaxed">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl">Josh Kappler</h1>
          <p className="mt-1 font-mono text-[13px] text-text-muted">
            ai &amp; dx engineer · san francisco
          </p>
          <nav className="mt-4 font-mono text-[13px]">
            {headerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="mr-3 underline"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <Globe />
      </header>

      <p className="mt-10">
        I&apos;m the first DX Engineer at{" "}
        <a
          href="https://generaltranslation.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          General Translation
        </a>
        , where I build the developer-facing side of localization: open-source
        SDKs, a CLI, and the platform behind them. I build AI agents from
        scratch and write the orchestration layer myself: tool loops, state
        machines, memory, routing. No agent frameworks.
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
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
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

      <footer className="mt-14 border-t border-border pt-4 font-mono text-xs text-text-muted">
        josh kappler · 2026
      </footer>
    </main>
  );
}
