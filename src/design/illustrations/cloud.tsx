// A soft cloud. Used large and faint behind the page, where it slowly "breathes".
export function Cloud({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
      <ellipse cx="70" cy="75" rx="55" ry="35" />
      <ellipse cx="120" cy="60" rx="50" ry="42" />
      <ellipse cx="150" cy="82" rx="38" ry="28" />
      <ellipse cx="95" cy="48" rx="34" ry="30" />
    </svg>
  );
}
