import { ONCE_PER_BIRTH_CODES } from "./birth-codes";
import { isBill, type Rule, type RuleFinding } from "./rule";

// Finds a once-per-birth service billed with a quantity above one.
// The money in question is the price of the extra units.
// No official text we could read sets this limit, so the rule only asks (see content/rules).
export const oncePerBirth: Rule = {
  id: "once-per-birth",
  check(documents) {
    const findings: RuleFinding[] = [];
    for (const document of documents.filter(isBill)) {
      for (const line of document.lines) {
        if (!line.code || !ONCE_PER_BIRTH_CODES.includes(line.code) || line.quantity <= 1 || line.amountCents <= 0) continue;
        findings.push({
          documentId: document.id,
          lineIds: [line.id],
          title: `"${line.description}" (${line.code}) is billed ${line.quantity} times for one birth`,
          atStakeCents: Math.round((line.amountCents * (line.quantity - 1)) / line.quantity),
          confidence: "worth_asking",
        });
      }
    }
    return findings;
  },
};
