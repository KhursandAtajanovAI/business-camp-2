import type { LineItem, ParsedDocument } from "@/contracts";
import { isBill, usDate, type Rule, type RuleFinding } from "../rules/rule";

const sameService = (first: LineItem, second: LineItem) =>
  Boolean(first.code) && first.code === second.code && first.serviceDate === second.serviceDate && first.amountCents === second.amountCents;

const isBabyService = (line: LineItem) => /newborn|infant|baby|nursery/i.test(line.description);

// Finds the same charge on the mother's paper and on the baby's paper.
// The copy in question is the one on the paper of the person who did not get the service.
export const motherBabyRepeat: Rule = {
  id: "mother-baby-repeat",
  check(documents) {
    const bills = documents.filter(isBill);
    const of = (role: ParsedDocument["patientRole"]) => bills.filter((document) => document.patientRole === role);
    const findings: RuleFinding[] = [];
    for (const motherBill of of("mother")) {
      for (const babyBill of of("baby")) {
        for (const motherLine of motherBill.lines) {
          const babyLine = babyBill.lines.find((line) => sameService(motherLine, line));
          if (!babyLine || motherLine.amountCents <= 0) continue;
          const onWrongPaper = isBabyService(motherLine) ? { document: motherBill, line: motherLine } : { document: babyBill, line: babyLine };
          const when = motherLine.serviceDate ? ` on ${usDate(motherLine.serviceDate)}` : "";
          findings.push({
            documentId: onWrongPaper.document.id,
            lineIds: [onWrongPaper.line.id],
            title: `"${motherLine.description}"${when} is on the mother's bill and on the baby's bill`,
            atStakeCents: motherLine.amountCents,
            confidence: "worth_asking",
          });
        }
      }
    }
    return findings;
  },
};
