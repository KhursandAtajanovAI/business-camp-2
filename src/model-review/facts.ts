import type { Analysis } from "@/contracts";
import { explainFinding } from "@/explain";

// Everything the model is allowed to know. All of it comes from the parser and the engine.
export function buildFacts(analysis: Analysis) {
  return {
    totalInQuestionCents: analysis.totalAtStakeCents,
    papers: analysis.documents.map((document) => ({
      id: document.id, kind: document.kind, provider: document.provider, issuedOn: document.issuedOn,
      totalCents: document.totalCents, patientBalanceCents: document.patientBalanceCents,
      lines: document.lines.map((line) => ({ id: line.id, code: line.code, description: line.description, quantity: line.quantity, amountCents: line.amountCents, serviceDate: line.serviceDate })),
    })),
    findings: analysis.findings.map((finding) => ({
      id: finding.id, paperId: finding.documentId, lineIds: finding.lineIds, title: finding.title,
      inQuestionCents: finding.atStakeCents, confidence: finding.confidence, ruleExplanation: explainFinding(finding),
    })),
  };
}

// Every amount of money that appears in the facts, in cents. Used to check the model's words.
export function knownAmounts(analysis: Analysis): Set<number> {
  const amounts = new Set<number>([analysis.totalAtStakeCents]);
  for (const document of analysis.documents) {
    amounts.add(document.totalCents);
    if (document.patientBalanceCents !== undefined) amounts.add(document.patientBalanceCents);
    for (const line of document.lines) {
      for (const cents of [line.amountCents, line.allowedCents, line.planPaidCents, line.patientOwesCents]) if (cents !== undefined) amounts.add(cents);
    }
  }
  for (const finding of analysis.findings) amounts.add(finding.atStakeCents);
  return amounts;
}
