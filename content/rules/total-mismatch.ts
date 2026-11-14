import type { RuleDescription } from "./types";

export const totalMismatch: RuleDescription = {
  id: "total-mismatch",
  name: "Total is higher than the lines add up to",
  summary: "The total printed on the bill is higher than the sum of its lines.",
  explanation:
    "We added up every line on this bill. The total printed on the bill is higher than that sum. It is worth asking the billing office to explain the difference of {{amount}}.",
  sourceName: "Arithmetic on the bill itself",
  sourceUrl: "https://www.cms.gov/medical-bill-rights",
  confidenceNote: "Sure about the arithmetic. A missing page or an unreadable line can also explain it, which is why it is still a question.",
};
