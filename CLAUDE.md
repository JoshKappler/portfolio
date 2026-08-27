@AGENTS.md

# Portfolio Site

Plain single-page personal site. Redesigned 2026-08-26 into a deliberately
understated register: one narrow text column, no hero effects, no webfonts.

- Next.js 16 App Router, React 19, Tailwind 4 (`@theme inline` in globals.css).
- Fonts are system-only: Times New Roman for body, Courier New for mono labels.
- Light/dark follows `prefers-color-scheme` via CSS vars in globals.css.
  There is no theme toggle and no theme-provider.
- All homepage content lives inline in `src/app/page.tsx` as `projects`,
  `playground`, and `headerLinks` arrays: one line of copy per item.
- `src/components/globe.tsx` is the only client component and the only visual
  effect: a small cobe WebGL globe marking San Francisco. It rebuilds on color
  scheme change and holds still under `prefers-reduced-motion`.
- `cobe` is the only visual dependency. Do not add animation, background, or
  font packages; the plainness is the design.
- `/resume` renders `public/resume.pdf` in an iframe and uses the theme token
  names `bg`, `border`, `accent`, `text-muted`. Keep those names defined in
  globals.css when changing colors.
- Copy style: first person, short declarative sentences, real numbers only,
  no em dashes.
