import { results } from "../_strings/results";

type Who = "rules" | "model" | "local";

const words: Record<Who, { label: string; note: string; look: string }> = {
  rules: { label: results.checkedLocally, note: results.checkedNote, look: "bg-sage-soft text-sage-deep" },
  model: { label: results.byModel, note: results.byModelNote, look: "bg-lavender-soft text-lavender-deep" },
  local: { label: results.byLocal, note: results.byLocalNote, look: "bg-sage-soft text-sage-deep" },
};

// Says honestly who did the thinking: our rules in code, or the language model.
// The label is words, never color alone, and the note explains what it means.
export function CheckBadge({ who }: { who: Who }) {
  const { label, note, look } = words[who];
  return (
    <p className="flex flex-col gap-1">
      <span className={`self-start rounded-full px-3 py-1 font-bold ${look}`}>{label}</span>
      <span className="text-ink-soft">{note}</span>
    </p>
  );
}
