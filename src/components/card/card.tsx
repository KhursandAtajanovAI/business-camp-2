import type { ReactNode } from "react";

type CardTone = "plain" | "notice" | "calm" | "hint";

// "notice" is how a finding looks: soft amber, never red.
const tones: Record<CardTone, string> = {
  plain: "bg-surface",
  notice: "bg-surface border-l-8 border-amber",
  calm: "bg-sage-soft",
  hint: "bg-lavender-soft",
};

export function Card({ children, tone = "plain", className = "" }: { children: ReactNode; tone?: CardTone; className?: string }) {
  return <section className={`animate-settle rounded-soft p-5 shadow-soft sm:p-7 ${tones[tone]} ${className}`}>{children}</section>;
}
