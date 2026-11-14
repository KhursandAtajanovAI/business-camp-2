// The only file other modules import from the engine.
import type { Analysis, ParsedDocument } from "@/contracts";
import { runRules } from "./checks/run-rules";
import { healthScore } from "./money/health-score";
import { totalAtStake } from "./money/total";

// Checks all papers of one family. Rules written in code find the problems and do
// all the math; nothing here calls a language model. Money is in cents.
export function analyze(documents: ParsedDocument[]): Analysis {
  const findings = runRules(documents);
  return {
    documents,
    findings,
    totalAtStakeCents: totalAtStake(findings),
    healthScore: healthScore(documents, findings),
  };
}
