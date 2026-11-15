import { DELIVERY_CODES, FULL_PACKAGE_CODES, PARTS_OF_ANY_DELIVERY, PARTS_OF_FULL_PACKAGE } from "./birth-codes";
import { isBill, type Rule, type RuleFinding } from "./rule";

const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

// Finds parts of the birth package that are billed again next to the package itself.
// Papers from the same provider are looked at together, because a practice may send two bills.
export const birthPackage: Rule = {
  id: "birth-package",
  check(documents) {
    const findings: RuleFinding[] = [];
    const bills = documents.filter(isBill);
    for (const document of bills) {
      const sameProvider = bills.filter((other) => normalize(other.provider) === normalize(document.provider));
      const codes = sameProvider.flatMap((other) => other.lines.map((line) => line.code ?? ""));
      const fullPackage = FULL_PACKAGE_CODES.find((code) => codes.includes(code));
      const anyDelivery = DELIVERY_CODES.find((code) => codes.includes(code));

      for (const line of document.lines) {
        if (!line.code || line.amountCents <= 0) continue;
        const partOfDelivery = anyDelivery && PARTS_OF_ANY_DELIVERY.includes(line.code);
        const partOfPackage = fullPackage && PARTS_OF_FULL_PACKAGE.includes(line.code) && line.code !== fullPackage;
        if (!partOfDelivery && !partOfPackage) continue;
        findings.push({
          documentId: document.id,
          lineIds: [line.id],
          title: `"${line.description}" (${line.code}) is usually part of the birth package (${partOfPackage ? fullPackage : anyDelivery})`,
          atStakeCents: line.amountCents,
          // The CMS manual names the four parts of a delivery by number. For other parts it
          // states only the principle, and with twins a second delivery line can be right.
          confidence: partOfDelivery ? "likely" : "worth_asking",
        });
      }
    }
    return findings;
  },
};
