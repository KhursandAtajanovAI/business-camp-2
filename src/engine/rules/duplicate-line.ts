import type { LineItem } from "@/contracts";
import { isBill, usDate, type Rule, type RuleFinding } from "./rule";

const sameService = (line: LineItem) =>
  [line.code ?? line.description.toLowerCase().replace(/\s+/g, " "), line.serviceDate ?? "", line.quantity, line.amountCents].join("|");

// Finds a line that is listed more than once with the same code, date, quantity and price.
// The money in question is the price of the extra copies.
export const duplicateLine: Rule = {
  id: "duplicate-line",
  check(documents) {
    const findings: RuleFinding[] = [];
    for (const document of documents.filter(isBill)) {
      const groups = new Map<string, LineItem[]>();
      for (const line of document.lines) groups.set(sameService(line), [...(groups.get(sameService(line)) ?? []), line]);
      for (const copies of groups.values()) {
        if (copies.length < 2 || copies[0].amountCents <= 0) continue;
        const [first] = copies;
        const when = first.serviceDate ? ` on ${usDate(first.serviceDate)}` : "";
        findings.push({
          documentId: document.id,
          lineIds: copies.map((line) => line.id),
          title: `"${first.description}" is listed ${copies.length} times${when}`,
          atStakeCents: first.amountCents * (copies.length - 1),
          // Without a code or a date we cannot be as sure the lines are the same service.
          confidence: first.code && first.serviceDate ? "likely" : "worth_asking",
        });
      }
    }
    return findings;
  },
};
