import type { Analysis } from "@/contracts";
import { explainFinding } from "@/explain";
import { callModel } from "./call-model";
import { checkAnswer } from "./check-answer";
import type { LocalReason, Review } from "./types";

const usd = (cents: number) => `$${Math.floor(cents / 100).toLocaleString("en-US")}.${String(cents % 100).padStart(2, "0")}`;

function localSummary(analysis: Analysis): string {
  const count = analysis.findings.length;
  if (count === 0) return "We checked your papers and found nothing to ask about.";
  return `We found ${count === 1 ? "one thing" : `${count} things`} worth asking about, with ${usd(analysis.totalAtStakeCents)} in question.`;
}

// The honest fallback: code alone, with the rule's own words. It says why the model was not used.
export function localReview(analysis: Analysis, reason: LocalReason, modelStatus?: number): Review {
  return {
    mode: "local",
    reason,
    ...(modelStatus === undefined ? {} : { modelStatus }),
    summary: localSummary(analysis),
    explanations: analysis.findings.map((finding) => ({ findingId: finding.id, text: explainFinding(finding) })),
  };
}

// With a key the model explains the findings on this bill; code then checks its answer.
// Without a key, or when the model is busy, silent or wrong, the local review is returned.
export async function reviewOnServer(analysis: Analysis, apiKey = process.env.ANTHROPIC_API_KEY, call = callModel): Promise<Review> {
  if (!apiKey) return localReview(analysis, "no_key");
  if (analysis.findings.length === 0) return { mode: "model", summary: localSummary(analysis), explanations: [] };
  const reply = await call(analysis, apiKey);
  if (!reply.ok) return localReview(analysis, reply.reason, reply.status);
  const review = checkAnswer(reply.text, analysis);
  if (!review) return localReview(analysis, "answer_rejected");
  return { ...review, summary: review.summary || localSummary(analysis) };
}
