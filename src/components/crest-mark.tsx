/* The de Falco family seal, stylized from a photo of the wax stamp
   (over a century old): a marquess coronet over an interlaced cipher,
   inside the double ring of the oval face. One ink, drawn by hand. */
export function CrestMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 130"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
    >
      <ellipse cx="50" cy="65" rx="45" ry="59" strokeWidth="3.6" />
      <ellipse cx="50" cy="65" rx="39.5" ry="53.5" strokeWidth="1.4" />
      <path d="M 29 45 Q 50 50 71 45" strokeWidth="2.4" />
      <path d="M 29.8 39 Q 50 44 70.2 39" strokeWidth="2.4" />
      <g strokeWidth="1.1">
        <line x1="33.5" y1="40.6" x2="33.1" y2="46.2" />
        <line x1="38.5" y1="41.9" x2="38.3" y2="47.5" />
        <line x1="44" y1="42.7" x2="43.9" y2="48.3" />
        <line x1="50" y1="43" x2="50" y2="48.6" />
        <line x1="56" y1="42.7" x2="56.1" y2="48.3" />
        <line x1="61.5" y1="41.9" x2="61.7" y2="47.5" />
        <line x1="66.5" y1="40.6" x2="66.9" y2="46.2" />
      </g>
      <g strokeWidth="2.2">
        <path d="M 30.5 39 C 27.5 34.5 25 32.8 23.2 34 C 21.8 35 22.6 37.2 24.4 36.8" />
        <path d="M 69.5 39 C 72.5 34.5 75 32.8 76.8 34 C 78.2 35 77.4 37.2 75.6 36.8" />
        <line x1="39.5" y1="41.2" x2="38.6" y2="33.5" />
        <line x1="50" y1="42.4" x2="50" y2="31.5" />
        <line x1="60.5" y1="41.2" x2="61.4" y2="33.5" />
      </g>
      <g fill="currentColor" stroke="none">
        <circle cx="38.5" cy="31.8" r="1.9" />
        <circle cx="35.9" cy="29.4" r="1.9" />
        <circle cx="41.1" cy="29.2" r="1.9" />
        <circle cx="50" cy="29.4" r="2" />
        <circle cx="47.2" cy="26.6" r="2" />
        <circle cx="52.8" cy="26.6" r="2" />
        <circle cx="61.5" cy="31.8" r="1.9" />
        <circle cx="64.1" cy="29.4" r="1.9" />
        <circle cx="58.9" cy="29.2" r="1.9" />
        <circle cx="31" cy="36" r="1.6" />
        <circle cx="69" cy="36" r="1.6" />
      </g>
      <g fill="currentColor" stroke="none">
        <path d="M 25 89 Q 50 67 75 89 Q 50 80.5 25 89 Z" />
        <path d="M 25 89 Q 50 111 75 89 Q 50 97.5 25 89 Z" />
      </g>
      <path
        d="M 46.5 111 C 46.5 95 46 74 43.5 66.5 C 42.2 62.5 38.5 60 36 62.2 C 34 64 35.6 66.8 37.9 66"
        strokeWidth="2.9"
      />
      <path
        d="M 53.5 111 C 53.5 95 54 74 56.5 66.5 C 57.8 62.5 61.5 60 64 62.2 C 66 64 64.4 66.8 62.1 66"
        strokeWidth="2.9"
      />
      <path
        d="M 46.5 108 C 46 116 41 121.5 35.5 120 C 31.8 119 31.8 114.6 34.8 114.4"
        strokeWidth="2.6"
      />
      <path
        d="M 53.5 108 C 54 116 59 121.5 64.5 120 C 68.2 119 68.2 114.6 65.2 114.4"
        strokeWidth="2.6"
      />
      <ellipse cx="50" cy="95.5" rx="4.4" ry="5" strokeWidth="2" />
      <path
        d="M 50 110 C 48.2 113 48.2 115.4 50 116.8 C 51.8 115.4 51.8 113 50 110 Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
