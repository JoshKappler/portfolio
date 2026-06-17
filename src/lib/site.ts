// Central place for the CTA links used across the site.
export const DEMO_URL = "https://memo.joshuakappler.com/demo";

// "Book a call" target — Josh's Cal.com 30-min scheduler.
export const BOOKING_URL = "https://cal.com/josh-msqs3y/30min";

// True when BOOKING_URL is an external scheduler (so we open it in a new tab).
export const BOOKING_EXTERNAL = BOOKING_URL.startsWith("http");
