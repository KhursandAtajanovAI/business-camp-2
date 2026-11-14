import type { Confidence, Finding, ParsedDocument } from "@/contracts";

// How much a finding weighs depends on how sure the rule is.
export const CONFIDENCE_WEIGHT: Record<Confidence, number> = { sure: 1, likely: 0.75, worth_asking: 0.4 };
const POINTS_PER_FINDING = 5;
const POINTS_PER_PERCENT_IN_QUESTION = 3;

export type ScoreParts = { billedCents: number; weightedCents: number; percentInQuestion: number; findingCount: number };

export function scoreParts(documents: ParsedDocument[], findings: Finding[]): ScoreParts {
  const billedCents = documents.filter((document) => document.kind !== "insurance_eob").reduce((sum, document) => sum + document.totalCents, 0);
  const weightedCents = Math.round(findings.reduce((sum, finding) => sum + finding.atStakeCents * CONFIDENCE_WEIGHT[finding.confidence], 0));
  const percentInQuestion = billedCents > 0 ? Math.min(100, (weightedCents / billedCents) * 100) : 0;
  return { billedCents, weightedCents, percentInQuestion, findingCount: findings.length };
}

// 100 means nothing to ask about. Each finding takes 5 points and each percent of the
// billed money that is in question (weighted by confidence) takes 3 points.
export function healthScore(documents: ParsedDocument[], findings: Finding[]): number {
  const parts = scoreParts(documents, findings);
  const lost = parts.findingCount * POINTS_PER_FINDING + parts.percentInQuestion * POINTS_PER_PERCENT_IN_QUESTION;
  return Math.max(0, Math.min(100, Math.round(100 - lost)));
}
