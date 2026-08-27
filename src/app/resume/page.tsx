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
