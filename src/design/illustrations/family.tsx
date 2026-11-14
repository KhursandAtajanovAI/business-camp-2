// Three simple figures of different sizes and colors: any family can see itself here.
export function Family({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 130" className={className} aria-hidden="true">
      <ellipse cx="100" cy="120" rx="80" ry="8" className="fill-sage-soft" />
      <circle cx="62" cy="34" r="16" className="fill-amber" />
      <path d="M36 118 C36 78 46 56 62 56 C78 56 88 78 88 118Z" className="fill-coral" />
      <circle cx="138" cy="30" r="16" className="fill-lavender" />
      <path d="M112 118 C112 76 122 52 138 52 C154 52 164 76 164 118Z" className="fill-sage" />
      <circle cx="100" cy="74" r="10" className="fill-coral-soft" />
      <path d="M84 110 C84 96 90 86 100 86 C110 86 116 96 116 110Z" className="fill-lavender-soft" />
    </svg>
  );
}
