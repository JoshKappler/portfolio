// Central place for the CTA links used across the site.
export const DEMO_URL = "https://memo.joshuakappler.com/demo";

// "Book a call" target. Swap this to a Cal.com / Calendly scheduler link when set up;
// until then it opens an email to request a call (still functional, just lower-friction
// once a real scheduler is in place).
export const BOOKING_URL =
  "mailto:Joshua.Kappler@gmail.com?subject=Let%27s%20set%20up%20a%20call";

// True when BOOKING_URL is an external scheduler (so we open it in a new tab).
export const BOOKING_EXTERNAL = BOOKING_URL.startsWith("http");
