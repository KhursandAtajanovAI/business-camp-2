import { isBill, usd, type Rule, type RuleFinding } from "../rules/rule";
import { findEobFor } from "./find-eob";

// Finds a bill that asks the family for more than the insurance explanation says they owe.
// The money in question is the difference between the two papers.
export const balanceAboveEob: Rule = {
  id: "balance-above-eob",
  check(documents) {
    const findings: RuleFinding[] = [];
    for (const bill of documents.filter(isBill)) {
      const eob = findEobFor(bill, documents);
      const asked = bill.patientBalanceCents;
      const owed = eob?.patientBalanceCents;
      if (asked === undefined || owed === undefined || asked <= owed) continue;
      findings.push({
        documentId: bill.id,
        lineIds: [],
        title: `The bill asks for ${usd(asked)}, but your insurance explanation says you owe ${usd(owed)}`,
        atStakeCents: asked - owed,
        confidence: "likely",
      });
    }
    return findings;
  },
};
