@AGENTS.md

# Portfolio Site Architecture

## Overview

Single-page portfolio with full-screen section transitions. No actual scrolling between sections — wheel/keyboard/touch events trigger opacity fade transitions between stacked absolute-positioned sections. Each section has its own distinct animated WebGL/SVG background.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4 (uses `@theme inline` syntax, not `tailwind.config`)
- `motion` (framer-motion successor) for animations
- `three` for WebGL backgrounds
- `lenis` installed but **not active** — removed in favor of custom snap system

## Navigation System (`snap-container.tsx`)

**This is NOT scroll-snap CSS.** It's a fully custom system:

- All sections are `position: absolute; inset: 0` — stacked on top of each other
- `SnapContainer` intercepts wheel/keyboard/touch events and manages which section is visible via React state
- Transition sequence: current section fades out (350ms) → new section fades in (400ms)
- Phase state (`"idle" | "out" | "in"`) drives opacity on each section
- Input is blocked during transitions (`transitioningRef`)
- `visibleIndex` is the source of truth for which section is shown

### Scrollable sections

Some sections (e.g. Projects) have content taller than the viewport. The system handles this:

- Each `ContentSection` registers its inner scroll div via `registerScroller()`
- The wheel handler checks `scrollTop` / `scrollHeight` on the active scroller
- If content is scrollable and not at boundary → native scroll happens
- If at top/bottom boundary → section navigation fires
- Navigating backward into a scrollable section auto-scrolls to the bottom for continuity

## Section Structure (page.tsx)

```
index 0: Hero        → ShaderAnimation (WebGL rings)
index 1: YouTube     → EtheralShadow (SVG filters, default)
index 2: Projects    → NeuralVortexBackground (WebGL)
index 3: About       → SmokeBackground (WebGL2)
index 4: Contact     → DottedSurface (Three.js points)
```

Each section gets its background via `ContentSection`'s `background` prop. If omitted, defaults to `EtheralShadow`. Custom backgrounds are passed as ReactNode with a dark overlay div for text readability.

## Performance

**Critical: only current ± 1 neighbor sections have their backgrounds mounted.** Sections 2+ away unmount their WebGL contexts entirely. This is controlled by `shouldRenderBg = Math.abs(index - visibleIndex) <= 1` in both `ContentSection` and `Hero`.

All WebGL backgrounds render at `devicePixelRatio = 1` regardless of display. The backgrounds are organic/blurry enough that retina resolution is wasted GPU. This is the single biggest perf optimization.

Shader-specific optimizations:
- Neural vortex: 10 loop iterations (reduced from 15)
- Smoke: 4 FBM octaves (reduced from 5)
- Dotted surface: 1200 particles (reduced from 2400), no antialiasing

## Component Map

### Layout
- `snap-container.tsx` — Navigation state machine, input handling, transition phases
- `content-section.tsx` — Section wrapper with background slot, scroller registration
- `hero.tsx` — Landing section with shader background + marquee

### Animated Backgrounds (`/components/ui/`)
- `shader-animation.tsx` — Three.js fullscreen quad with GLSL fragment shader (concentric rings)
- `etheral-shadow.tsx` — SVG filter displacement + noise (default section background)
- `neural-vortex-background.tsx` — WebGL interactive neural pattern, responds to pointer
- `smoke-background.tsx` — WebGL2 FBM smoke, accepts `smokeColor` hex prop
- `dotted-surface.tsx` — Three.js animated point grid wave

### Content Sections
- `youtube.tsx` — YouTube channel section with stats + brand partnerships
- `projects.tsx` — Project listing with expandable cards
- `project-card.tsx` — Individual project card (glass style: `bg-bg/60 backdrop-blur-xl`)
- `about.tsx` — Bio + tools + approach
- `contact.tsx` — CTA + footer links
- `marquee.tsx` — Horizontal scrolling skill tags (rendered inside Hero)

### Utilities
- `cursor-glow.tsx` — Custom cursor glow effect
- `animated-counter.tsx` — Number animation component
- `lenis-provider.tsx` — Exists but unused (smooth scroll removed)

## Theming

Colors defined in `globals.css` via `@theme inline`:
- `--color-bg: #06060a` (near-black)
- `--color-accent: #c9a96e` (gold)
- `--color-text: #e8e6e3`

Fonts: Syne (display), DM Sans (body), JetBrains Mono (mono)

Global effects: film grain overlay (`body::after`), vignette (`body::before`)

## Key Patterns

- **Adding a new section:** Add component, add `ContentSection` wrapper in `page.tsx` with incremented index, update `sectionCount` prop on `SnapContainer`
- **Custom background for a section:** Pass `background={<YourBackground />}` prop to `ContentSection`
- **Background overlay opacity:** Each custom background includes a `<div className="absolute inset-0 bg-bg/XX" />` — adjust the `/XX` value (40-55 range) for readability vs visual impact
- **All backgrounds must handle cleanup** in their useEffect return (dispose WebGL, cancel rAF, remove event listeners)
