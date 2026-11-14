import type { Finding } from "@/contracts";

// Money in question for the whole case: the plain sum of the findings, in cents.
// It is money worth asking about, not a promise of a refund.
export function totalAtStake(findings: Finding[]): number {
  return findings.reduce((sum, finding) => sum + finding.atStakeCents, 0);
}
