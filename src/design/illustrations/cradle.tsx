// A small cradle under a moon. Abstract on purpose: no faces, no stock photos.
export function Cradle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true">
      <path d="M126 12 a14 14 0 1 0 13 19 a11 11 0 0 1 -13 -19Z" className="fill-amber" />
      <path d="M30 60 H130 C130 86 110 98 80 98 C50 98 30 86 30 60Z" className="fill-lavender" />
      <path d="M30 60 C30 40 44 30 58 30 V60Z" className="fill-lavender-deep" />
      <path d="M58 60 C72 50 104 50 126 60Z" className="fill-coral-soft" />
      <path d="M40 108 C62 116 98 116 120 108" className="stroke-ink-soft" strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
