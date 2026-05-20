import Link from "next/link";

export const metadata = {
  title: "Resume — Josh Kappler",
};

export default function ResumePage() {
  return (
    <main className="fixed inset-0 bg-bg">
      <iframe
        src="/resume.pdf#toolbar=0&navpanes=0"
        title="Joshua Kappler resume"
        className="w-full h-full border-0"
      />

      <div className="fixed top-4 right-4 z-50 flex gap-3">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 px-4 py-2 border border-border/60 bg-bg/80 backdrop-blur-md hover:border-accent/60 hover:text-accent text-text-muted font-mono text-xs tracking-[0.2em] uppercase transition-all duration-300"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <a
          href="/resume.pdf"
          download="Joshua_Kappler_Resume.pdf"
          className="group inline-flex items-center gap-2 px-4 py-2 border border-accent bg-accent/15 hover:bg-accent hover:text-bg text-accent font-mono text-xs tracking-[0.2em] uppercase transition-all duration-300"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </a>
      </div>
    </main>
  );
}
