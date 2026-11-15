import type { LineItem, ParsedDocument } from "@/contracts";
import { isBill, usd, type Rule, type RuleFinding } from "../rules/rule";
import { findBillFor, findEobFor } from "./find-eob";

// We match by the words on the paper, not by billing code: we have not verified a code list.
const PREVENTIVE = /well[- ]?(baby|child|infant|newborn)|preventive (visit|care|medicine|exam)|lactation|breast[- ]?feeding|breast pump/i;
const isPreventive = (line: LineItem) => PREVENTIVE.test(line.description);
const inNetwork = (document: ParsedDocument) => document.network === "in_network";

// Finds preventive care (a well-baby visit, breastfeeding support) from an in-network
// provider that still left money for the family to pay. Most plans must cover it at no cost,
// but some plans are exempt, so this rule only asks.
export const preventiveCareCharged: Rule = {
  id: "preventive-care-charged",
  check(documents) {
    const findings: RuleFinding[] = [];

    // With an insurance explanation we know the family's share of each line.
    for (const eob of documents.filter((document) => !isBill(document) && inNetwork(document))) {
      const bill = findBillFor(eob, documents);
      for (const line of eob.lines.filter(isPreventive)) {
        const owed = line.patientOwesCents ?? 0;
        if (owed <= 0) continue;
        const billLine = bill?.lines.find((candidate) => candidate.code === line.code && candidate.serviceDate === line.serviceDate);
        findings.push({
          documentId: (bill ?? eob).id,
          lineIds: bill ? (billLine ? [billLine.id] : []) : [line.id],
          title: `"${line.description}" is preventive care, but the plan left ${usd(owed)} for you to pay`,
          atStakeCents: owed,
          confidence: "worth_asking",
        });
      }
    }

    // Without one we can only speak when the whole bill is preventive care.
    for (const bill of documents.filter((document) => isBill(document) && inNetwork(document))) {
      const asked = bill.patientBalanceCents ?? 0;
      if (findEobFor(bill, documents) || asked <= 0 || !bill.lines.every(isPreventive)) continue;
      findings.push({
        documentId: bill.id,
        lineIds: bill.lines.map((line) => line.id),
        title: `This bill is for preventive care, but it asks you to pay ${usd(asked)}`,
        atStakeCents: asked,
        confidence: "worth_asking",
      });
    }
    return findings;
  },
};
