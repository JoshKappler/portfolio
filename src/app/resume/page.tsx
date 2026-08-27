import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Resume · Josh Kappler",
};

const chip =
  "inline-flex items-center gap-2 px-4 py-2 border border-border bg-bg text-text font-mono text-xs tracking-[0.2em] uppercase cursor-pointer select-none hover:bg-border/60 transition-colors";

export default function ResumePage() {
  return (
    <main className="min-h-screen bg-black px-4 pb-16 pt-20">
      <div className="fixed top-4 right-4 z-50 flex gap-3">
        <Link href="/" className={chip}>
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
          href="https://github.com/JoshKappler"
          target="_blank"
          rel="noopener noreferrer"
          className={chip}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 1.27a11 11 0 0 0-3.48 21.46c.55.09.73-.28.73-.55v-1.84c-3.03.64-3.67-1.46-3.67-1.46-.55-1.29-1.28-1.65-1.28-1.65-.92-.65.1-.65.1-.65 1.1 0 1.73 1.1 1.73 1.1.92 1.65 2.57 1.2 3.21.92a2 2 0 0 1 .64-1.47c-2.47-.27-5.04-1.19-5.04-5.5 0-1.1.46-2.1 1.2-2.84a3.76 3.76 0 0 1 0-2.93s.91-.28 3.11 1.1c1.8-.49 3.7-.49 5.5 0 2.1-1.38 3.02-1.1 3.02-1.1a3.76 3.76 0 0 1 .1 2.93c.83.74 1.19 1.74 1.19 2.94 0 4.21-2.57 5.13-5.04 5.4.45.37.82.92.82 2.02v3.03c0 .27.1.64.73.55A11 11 0 0 0 12 1.27" />
          </svg>
          GitHub
        </a>

        <details className="relative">
          <summary className={`${chip} list-none [&::-webkit-details-marker]:hidden`}>
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
          </summary>
          <div className="absolute right-0 mt-2 flex w-full flex-col border border-border bg-bg">
            <a
              href="/resume.pdf"
              download="Joshua_Kappler_Resume.pdf"
              className="px-4 py-2 font-mono text-xs tracking-[0.2em] uppercase text-text hover:bg-border/60"
            >
              PDF
            </a>
            <a
              href="/resume.png"
              download="Joshua_Kappler_Resume.png"
              className="border-t border-border px-4 py-2 font-mono text-xs tracking-[0.2em] uppercase text-text hover:bg-border/60"
            >
              PNG
            </a>
          </div>
        </details>
      </div>

      <Image
        src="/resume.png"
        alt="Joshua Kappler resume"
        width={2550}
        height={3300}
        unoptimized
        priority
        className="mx-auto h-auto w-full max-w-[52rem] shadow-[0_0_40px_rgba(0,0,0,0.8)]"
      />
    </main>
  );
}
