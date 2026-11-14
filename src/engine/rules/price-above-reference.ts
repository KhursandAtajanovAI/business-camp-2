import { referencePrices, TIMES_ABOVE_REFERENCE } from "./reference-prices";
import { isBill, usd, type Rule, type RuleFinding } from "./rule";

// Finds a price far above a public reference price for the same service.
// The money in question is the part above ten times the reference.
export const priceAboveReference: Rule = {
  id: "price-above-reference",
  check(documents) {
    const findings: RuleFinding[] = [];
    for (const document of documents.filter(isBill)) {
      for (const line of document.lines) {
        const reference = line.code ? referencePrices[line.code] : undefined;
        if (!reference || line.quantity < 1) continue;
        const ceiling = reference.cents * TIMES_ABOVE_REFERENCE * line.quantity;
        if (line.amountCents <= ceiling) continue;
        findings.push({
          documentId: document.id,
          lineIds: [line.id],
          title: `"${line.description}" is billed at ${usd(line.amountCents)}; a public price list shows about ${usd(reference.cents)}`,
          atStakeCents: line.amountCents - ceiling,
          confidence: "worth_asking",
        });
      }
    }
    return findings;
  },
};
