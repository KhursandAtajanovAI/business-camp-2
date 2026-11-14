import { isBill, usd, type Rule, type RuleFinding } from "../rules/rule";
import { findEobFor, planPaidTotal } from "./find-eob";

// Finds a bill that still shows the full price although the insurance plan has already paid.
// This usually means the bill was printed before the payment arrived.
export const insuranceNotApplied: Rule = {
  id: "insurance-not-applied",
  check(documents) {
    const findings: RuleFinding[] = [];
    for (const bill of documents.filter(isBill)) {
      const eob = findEobFor(bill, documents);
      if (!eob || eob.patientBalanceCents === undefined) continue;
      const asksFullPrice = bill.patientBalanceCents === bill.totalCents;
      const gap = bill.totalCents - eob.patientBalanceCents;
      if (!asksFullPrice || planPaidTotal(eob) <= 0 || gap <= 0) continue;
      findings.push({
        documentId: bill.id,
        lineIds: [],
        title: `This bill asks for the full ${usd(bill.totalCents)} and does not show your insurance payment yet`,
        atStakeCents: gap,
        confidence: "likely",
      });
    }
    return findings;
  },
};
