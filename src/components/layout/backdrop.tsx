import { Cloud } from "@/design/illustrations";

// Two faint clouds that slowly "breathe" behind the page. Still when less motion is asked for.
export function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <Cloud className="absolute -left-24 top-10 w-80 animate-breathe fill-lavender-soft" />
      <Cloud className="absolute -right-28 top-96 w-96 animate-breathe fill-coral-soft [animation-delay:-5s]" />
    </div>
  );
}
