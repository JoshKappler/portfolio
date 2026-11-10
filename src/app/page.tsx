import type { Viewport } from "next";
import { ContactEmail } from "@/components/contact-email";
import { Globe } from "@/components/globe";
import { InkScale } from "@/components/ink-scale";
import { SquareParagraphs } from "@/components/square-paragraphs";
import { DEMO_URL } from "@/lib/site";

/* Phones get the sheet at its full 672px layout width and scale the whole
   render to fit, instead of shrinking the root font. WebKit rasterizes
   CSS url() SVG filters at layout resolution, so small CSS pixels turn
   the ink into upscaled mush on iPhones; at 672 the type and its strike
   rasterize at full detail and the OS scales the finished print. */
export const viewport: Viewport = {
  width: 672,
  // The key must be present: Next merges per present key over its default
  // initial-scale=1, which would load phones zoomed into the sheet's left
  // half. Left unset, browsers compute the fit scale themselves.
  initialScale: undefined,
};

type ItemLink = { label: string; href: string };
type Item = { name: string; href?: string; line: string };

const projects: Item[] = [
  {
    name: "Ask AI",
    href: "https://dash.generaltranslation.com",
    line: "The assistant on the General Translation dashboard, live in production. Grounded in the docs, with per-plan model tiers and limits.",
  },
  {
    name: "autodemo",
    href: "https://autovid.joshuakappler.com",
    line: "Turns a docs page into a demo video in any language: it builds a real app, drives a real browser and editor, and cuts the video.",
  },
  {
    name: "memo engine",
    href: DEMO_URL,
    line: "Built for a private credit firm: it reads a deal's docs and writes the credit memo, with every claim cited back to its source page.",
  },
  {
    name: "claim wright",
    href: "https://github.com/JoshKappler/claim-wright",
    line: "Insurance claims: Claude reads the documents and a deterministic engine sets the payout. Median error against humans: $0.",
  },
  {
    name: "sixteen",
    href: "https://www.youtube.com/watch?v=I1aBncW7lgY",
    line: "Minecraft's engine rewritten from scratch in Rust, with terrain that matches the real game block for block. The video has 430K views.",
  },
  {
    name: "pinch",
    href: "https://github.com/JoshKappler/apple-watch-claude-code",
    line: "Claude Code driven from an Apple Watch over cellular. Dictate a prompt, pinch to send it, roll the crown to approve diffs, shake to stop.",
  },
  {
    name: "butler",
    href: "https://github.com/JoshKappler/butler",
    line: "An open-source voice agent for my Windows PC. Hold a key and talk: it opens apps, reads the screen, and starts Claude Code agents.",
  },
  {
    name: "autohack",
    href: "https://github.com/JoshKappler/autohack",
    line: "An autonomous bug-hunter across seven bounty platforms. It runs hour-long hunts, attacks its own findings, and drafts the reports.",
  },
  {
    name: "lasso",
    href: "https://github.com/JoshKappler/herdr-layout",
    line: "The terminal cockpit I run Claude Code from: a forked multiplexer with live AI summaries on every tab and a subagent viewer.",
  },
];

const playground: Item[] = [
  {
    name: "escapement",
    href: "https://escapement.joshuakappler.com",
    line: "A perpetual calendar watch simulated gear by gear in the browser: 51 wheels in 26 tested meshes, running at six beats a second.",
  },
  {
    name: "scuttle",
    href: "https://scuttle.joshuakappler.com",
    line: "A voxel pirate roguelite in the browser. Cannonballs knock out real hull voxels, breaches flood below, and ships list, capsize, and sink.",
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
      <h2 className="text-center text-xs">
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
    <div data-sheet>
    <main
      data-paper
      className="mx-auto max-w-[42rem] px-16 pt-6 pb-14 text-[1.0625rem] leading-relaxed"
    >
      {/* Referenced by globals.css. Wobble the edge, blur, then rebuild
          two layers from the soft alpha: a worn rim that noise chews at,
          and a solid core merged on top, so stroke centers are always full
          ink and all the wear lives at the edges, like a typewriter
          strike. Wear is only ever an alpha mask over the clean glyph:
          arithmetic noise composites bleed the noise's own RGB into the
          ink and gray it. #ink-small is the same recipe with every
          spatial length at 0.72x, matching the 12 and 13px type, so the
          wear shrinks with the glyphs instead of gouging them. */}
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <filter id="ink-page" x="-4%" y="-12%" width="108%" height="124%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.3"
            numOctaves="1"
            seed="11"
            result="warp"
          />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="0.8" />
          <feGaussianBlur stdDeviation="0.22" result="soft" />
          <feComponentTransfer in="soft" result="inked">
            <feFuncA type="linear" slope="2.6" intercept="-0.58" />
          </feComponentTransfer>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.12"
            numOctaves="3"
            seed="29"
          />
          <feComponentTransfer result="press">
            <feFuncA type="linear" slope="0.2" intercept="0.85" />
          </feComponentTransfer>
          <feComposite in="inked" in2="press" operator="in" result="worn" />
          <feComponentTransfer in="soft" result="core">
            <feFuncA type="linear" slope="8" intercept="-5" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="worn" />
            <feMergeNode in="core" />
          </feMerge>
        </filter>
        <filter id="ink-small" x="-4%" y="-12%" width="108%" height="124%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.42"
            numOctaves="1"
            seed="11"
            result="warp"
          />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="0.58" />
          <feGaussianBlur stdDeviation="0.16" result="soft" />
          <feComponentTransfer in="soft" result="inked">
            <feFuncA type="linear" slope="2.6" intercept="-0.58" />
          </feComponentTransfer>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.17"
            numOctaves="3"
            seed="29"
          />
          <feComponentTransfer result="press">
            <feFuncA type="linear" slope="0.2" intercept="0.85" />
          </feComponentTransfer>
          <feComposite in="inked" in2="press" operator="in" result="worn" />
          <feComponentTransfer in="soft" result="core">
            <feFuncA type="linear" slope="8" intercept="-5" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="worn" />
            <feMergeNode in="core" />
          </feMerge>
        </filter>
      </svg>
      <SquareParagraphs />
      <InkScale />
      <Globe />

      <header className="mt-2 text-center">
        <h1 className="text-3xl">Josh Kappler</h1>
        <p className="mt-1 text-[0.8125rem]">
          Software Engineer · San Francisco
        </p>
        <nav className="mt-4 text-[0.8125rem] print:hidden">
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
        Most recently I was the founding DX Engineer at{" "}
        <a
          href="https://generaltranslation.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          General Translation
        </a>
        , where I built the dashboard&apos;s AI assistant, an
        autonomous outbound growth engine, and a content engine that turns the
        docs into finished demo videos and clear step-by-step written
        tutorials in any language.
      </p>
      <p className="mt-4">
        I ship whole products: the frontend, the backend, the data model, and
        the AI inside them. When that means agents, I write the orchestration
        myself: tool loops, state machines, memory, routing. No frameworks.
      </p>
      <p className="mt-4">
        I also run Boffy Media LLC, the company behind{" "}
        <a
          href="https://youtube.com/boffy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Boffy
        </a>
        , a gaming YouTube channel with 2.1M+ subscribers and 270M+ lifetime views
        across all 136 long-form videos, each one written and presented by me.
      </p>

      <ItemList title="projects" items={projects} />
      <ItemList title="playground" items={playground} />

      <section className="mt-12">
        <h2 className="text-center text-xs">
          contact
        </h2>
        <div className="relative mt-4 text-center">
          <ContactEmail />
          <p className="mt-2 text-xs">
            I read everything.
          </p>
        </div>
      </section>

      <footer className="mt-14 border-t-2 border-border pt-4 text-center text-xs print:border-t">
        <p>Josh Kappler · Software Engineer, San Francisco · 2026</p>
        <p className="mt-1">
          Founding Developer Experience Engineer, General Translation, Inc., Jul to Sep 2026
        </p>
        <p className="mt-1">Set in Georgia. System fonts only, no trackers.</p>
      </footer>
    </main>
    </div>
  );
}
