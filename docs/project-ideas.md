# Project ideas

Recorded 2026-08-30. The goal: a portfolio project that grabs attention on
the site in five seconds and clearly could not be vibe coded. The filter
that produced this list: a project is vibe-code-proof when its correctness
is measurable and its failure is public. Nobody one-shots a thing that has
to be right, visibly, for months.

Chosen for first builds: 2 (escapement), 4 (inkwell), 12 (scriptorium).

## The list

1. **Atlantic crossing.** An autonomous simulated sailboat sails a real
   ocean using live NOAA wind and current data, in real time, for the
   roughly three months a crossing takes. Visitors check on the boat like
   a serial drama. Hard parts: routing against real weather, and a system
   that cannot crash for a quarter of a year. Uptime is the proof.

2. **Escapement.** A full mechanical clock, every gear and pallet
   simulated, that keeps real time by physics alone. No wall clock in the
   loop. A counter shows honest drift: "31 days running, 0.4s behind."
   Numerical stability engineering with a public scoreboard.

3. **Marble computer.** A physically simulated marble-run adding machine.
   Type 13 + 29, watch marbles cascade through flippers and gates, read
   42 off the bottom. Legible in five seconds; making rolling-ball
   physics compute reliably is brutally hard.

4. **Inkwell.** A quill you write with, where the ink is a real fluid
   simulation soaking into simulated paper fibers: bleed, feathering,
   pooling, drying. The site aesthetic made literal.

5. **Glassblowing.** Sculpt molten glass in the browser: heat, viscosity,
   gravity. Cool it too fast and it cracks. Continuum mechanics wearing a
   toy's face.

6. **Overhead.** Real orbital mechanics (SGP4 from raw public TLE data)
   rendering the actual satellites over the visitor's head right now.
   Verifiable against reality: anyone can look up a pass time.

7. **Boffy Analog.** A simulated analog TV station broadcasting the Boffy
   archive through a genuine NTSC signal pipeline: real modulation, real
   ghosting, static that worsens with actual SF weather.

8. **The orchestra with no recordings.** Instruments synthesized by
   physical modeling (waveguide strings, resonating air columns), not
   samples. Bow a violin with the cursor.

9. **Creature breeding.** Soft-body creatures with evolved neural-net
   brains that visitors breed and race. Each visitor's dish is local, so
   there is no shared surface to vandalize.

10. **Slime mold vs. the highway department.** A physarum simulation on
    real city maps, converging on networks overlaid against the actual
    roads.

11. **The weather machine.** A real 2D fluid solver ingesting live
    atmospheric data and painting today's actual sky. The visitor's
    weather, computed, not fetched as an icon.

12. **Scriptorium.** A simulated arm (joints, muscles, tremor) that is
    learning calligraphy on the site, practicing continuously and
    improving over weeks, its progress charted. Motor control plus a
    persistent learning loop. Visitors return to see if the hand got
    better.

## Notes

- Ideas 1 and 12 share a trait none of the current projects have: they
  are still running. The opposite of a 36-hour build.
- Rejected along the way: a Next.js migration codemod (invisible on the
  site), a shared collaborative editor (moderation burden, cold start), a
  two-pane CRDT partition demo (not legible at a glance), a perpetual
  agent workspace (amplifies the vibe-coding read, unbounded cost).
