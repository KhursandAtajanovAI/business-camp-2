import { isBill, usd, type Rule, type RuleFinding } from "./rule";

// Plain arithmetic: the lines of a bill must add up to its total.
// The money in question is what the total says above the sum of the lines.
export const totalMismatch: Rule = {
  id: "total-mismatch",
  check(documents) {
    const findings: RuleFinding[] = [];
    for (const document of documents.filter(isBill)) {
      const lineSum = document.lines.reduce((sum, line) => sum + line.amountCents, 0);
      if (document.totalCents <= lineSum) continue;
      findings.push({
        documentId: document.id,
        lineIds: [],
        title: `The lines add up to ${usd(lineSum)}, but the bill says the total is ${usd(document.totalCents)}`,
        atStakeCents: document.totalCents - lineSum,
        confidence: "sure",
      });
    }
    return findings;
  },
};
