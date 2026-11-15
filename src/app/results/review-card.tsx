import type { Review } from "@/model-review";
import { Card } from "@/components/card/card";
import { WithHints } from "@/components/hint/with-hints";
import { Waiting } from "@/components/states/quiet-state";
import { results } from "../_strings/results";

// The live explanation of this person's findings, with an honest badge:
// did a language model write these words, or ordinary code, and if code, why.
export function ReviewCard({ review }: { review: Review | null }) {
  if (!review) return <Waiting text={results.explainWorking} />;
  const byModel = review.mode === "model";
  return (
    <Card tone="hint" className="flex flex-col gap-3">
      <h2 className="text-2xl font-extrabold">{results.explainTitle}</h2>
      {review.summary.split(/\n+/).map((paragraph) => <p key={paragraph}><WithHints text={paragraph} /></p>)}
      <p className="flex flex-col gap-1">
        <span className={`self-start rounded-full px-3 py-1 font-bold ${byModel ? "bg-lavender text-ink" : "bg-sage-soft text-sage-deep"}`}>
          {byModel ? results.explainedByModel : results.explainedLocally}
        </span>
        <span>{byModel ? results.explainedByModelNote : results.localReasons[review.reason ?? "model_unreachable"]}</span>
      </p>
    </Card>
  );
}
