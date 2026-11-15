import type { LineItem, ParsedDocument } from "@/contracts";
import { isBill, usd, type Rule, type RuleFinding } from "../rules/rule";
import { findBillFor } from "./find-eob";

// Federal law speaks of 48 hours after a vaginal birth and 96 hours after a cesarean.
// A paper shows days, not hours, so we use two and four days and only ask.
const DAYS_AFTER_VAGINAL_BIRTH = 2;
const DAYS_AFTER_CESAREAN = 4;

const isRoomDay = (line: LineItem) => /room and board|\bnursery\b/i.test(line.description);
const mentionsCesarean = (document: ParsedDocument) => document.lines.some((line) => /c(a)?esarean|c-section/i.test(line.description));
// "Not covered": the plan allowed nothing and paid nothing, and the day is left to the family.
const notCovered = (line: LineItem) => line.allowedCents === 0 && (line.planPaidCents ?? 0) === 0 && (line.patientOwesCents ?? 0) > 0;

// Finds a hospital day right after the birth that the insurance plan did not cover at all.
// The money in question is what the insurance explanation leaves to the family for those days.
export const stayNotCovered: Rule = {
  id: "stay-not-covered",
  check(documents) {
    const protectedDays = documents.some(mentionsCesarean) ? DAYS_AFTER_CESAREAN : DAYS_AFTER_VAGINAL_BIRTH;
    const findings: RuleFinding[] = [];
    for (const eob of documents.filter((document) => !isBill(document))) {
      const roomDays = eob.lines.filter(isRoomDay);
      const days = roomDays.reduce((sum, line) => sum + line.quantity, 0);
      const refused = roomDays.filter(notCovered);
      if (refused.length === 0 || days > protectedDays) continue;
      const atStakeCents = refused.reduce((sum, line) => sum + (line.patientOwesCents ?? 0), 0);
      const bill = findBillFor(eob, documents);
      findings.push({
        documentId: (bill ?? eob).id,
        lineIds: bill ? [] : refused.map((line) => line.id),
        title: `Your plan paid nothing for ${usd(atStakeCents)} of a ${days}-day hospital stay after the birth`,
        atStakeCents,
        confidence: "worth_asking",
      });
    }
    return findings;
  },
};
