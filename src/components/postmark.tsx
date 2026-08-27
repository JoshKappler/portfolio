/* An ink postmark: two rings, circular text, JK at center, edges roughened
   by a turbulence filter so it reads as a hand-cancelled stamp. */
export function Postmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <defs>
        <filter id="pm-ink" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.4" />
        </filter>
        <path id="pm-top" d="M 12 50 A 38 38 0 0 1 88 50" />
        <path id="pm-bottom" d="M 12 50 A 38 38 0 0 0 88 50" />
      </defs>
      <g filter="url(#pm-ink)" stroke="currentColor" strokeWidth="1.4">
        <circle cx="50" cy="50" r="46" />
        <circle cx="50" cy="50" r="30" strokeWidth="1" />
      </g>
      <g
        filter="url(#pm-ink)"
        fill="currentColor"
        fontFamily="'Courier New', Courier, monospace"
        fontSize="9.5"
        letterSpacing="2.5"
      >
        <text textAnchor="middle">
          <textPath href="#pm-top" startOffset="50%">
            SAN FRANCISCO
          </textPath>
        </text>
        <text textAnchor="middle">
          <textPath href="#pm-bottom" startOffset="50%">
            &#183; 2026 &#183;
          </textPath>
        </text>
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Georgia, serif"
          fontSize="22"
          letterSpacing="1"
        >
          JK
        </text>
      </g>
    </svg>
  );
}
