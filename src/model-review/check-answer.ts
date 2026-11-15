import type { Analysis } from "@/contracts";
import { explainFinding } from "@/explain";
import { knownAmounts } from "./facts";
import type { Review } from "./types";

const MONEY = /\$\s?(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d{2}))?/g;
const NOT_ALLOWED = /guarantee|we will get|you will get your money|refund is|you should (take|stop)|diagnos|lawsuit|!/i;

// True when every dollar amount in the text is an amount from the papers or the findings.
export function amountsAreKnown(text: string, known: Set<number>): boolean {
  for (const match of text.matchAll(MONEY)) {
    const cents = Number(match[1].replace(/,/g, "")) * 100 + Number(match[2] ?? "0");
    if (!known.has(cents)) return false;
  }
  return true;
}

function parse(text: string): { summary?: unknown; explanations?: unknown } | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

// Turns the model's raw answer into a Review, or null when it cannot be trusted at all.
// A single explanation that mentions an unknown amount or breaks the tone rules is
// swapped for the rule's own explanation; findings the engine did not make are dropped.
export function checkAnswer(raw: string, analysis: Analysis): Review | null {
  const parsed = parse(raw);
  if (!parsed || !Array.isArray(parsed.explanations)) return null;
  const known = knownAmounts(analysis);
  const acceptable = (text: unknown): text is string => typeof text === "string" && text.trim() !== "" && text.length <= 600 && amountsAreKnown(text, known) && !NOT_ALLOWED.test(text);
  const byId = new Map<string, unknown>();
  for (const item of parsed.explanations as { findingId?: unknown; text?: unknown }[]) {
    if (typeof item?.findingId === "string") byId.set(item.findingId, item.text);
  }

  let fromModel = 0;
  const explanations = analysis.findings.map((finding) => {
    const text = byId.get(finding.id);
    if (acceptable(text)) {
      fromModel += 1;
      return { findingId: finding.id, text: text.trim() };
    }
    return { findingId: finding.id, text: explainFinding(finding) };
  });
  if (analysis.findings.length > 0 && fromModel === 0) return null;
  const summary = acceptable(parsed.summary) ? parsed.summary.trim() : "";
  return { mode: "model", summary, explanations };
}
