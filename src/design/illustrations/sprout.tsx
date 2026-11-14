// The sprout is our progress picture: it grows a little with every step,
// so nobody has to look at a bar with percents. Stage 0 is a seed, 4 is in bloom.
export type SproutStage = 0 | 1 | 2 | 3 | 4;

export function sproutStage(done: number, total: number): SproutStage {
  if (total <= 0 || done <= 0) return 0;
  return Math.min(4, Math.max(1, Math.round((done / total) * 4))) as SproutStage;
}

export function Sprout({ stage, className = "", label }: { stage: SproutStage; className?: string; label?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={`animate-grow ${className}`} role="img" aria-label={label ?? "A growing sprout"} key={stage}>
      <ellipse cx="60" cy="104" rx="38" ry="9" className="fill-amber-soft" />
      {stage === 0 && <ellipse cx="60" cy="98" rx="8" ry="6" className="fill-amber" />}
      {stage >= 1 && <path d={`M60 100 V${[0, 78, 62, 46, 40][stage]}`} className="stroke-sage-deep" strokeWidth="5" strokeLinecap="round" fill="none" />}
      {stage >= 1 && <path d="M60 86 C46 86 40 76 40 68 C54 68 60 76 60 86Z" className="fill-sage" />}
      {stage >= 2 && <path d="M60 78 C74 78 82 68 82 58 C68 58 60 66 60 78Z" className="fill-sage" />}
      {stage >= 3 && <path d="M60 64 C46 64 38 54 38 44 C52 44 60 52 60 64Z" className="fill-sage" />}
      {stage >= 3 && <path d="M60 56 C72 56 80 47 80 38 C67 38 60 46 60 56Z" className="fill-sage" />}
      {stage >= 4 && (
        <g>
          {[0, 72, 144, 216, 288].map((turn) => (
            <ellipse key={turn} cx="60" cy="24" rx="7" ry="10" className="fill-coral" transform={`rotate(${turn} 60 34)`} />
          ))}
          <circle cx="60" cy="34" r="6" className="fill-amber" />
        </g>
      )}
    </svg>
  );
}
