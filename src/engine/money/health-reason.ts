import type { Analysis } from "@/contracts";
import { scoreText } from "@content/rules/score-text";
import { scoreParts } from "./health-score";

// One short sentence that says what the 0 to 100 score is made of.
export function describeHealthScore(analysis: Analysis): string {
  const parts = scoreParts(analysis.documents, analysis.findings);
  if (parts.findingCount === 0) return scoreText.clean;
  const template = parts.findingCount === 1 ? scoreText.oneFinding : scoreText.manyFindings;
  const percent = parts.percentInQuestion < 1 ? "less than 1" : String(Math.round(parts.percentInQuestion));
  return template.replace("{{score}}", String(analysis.healthScore)).replace("{{count}}", String(parts.findingCount)).replace("{{percent}}", percent);
}
