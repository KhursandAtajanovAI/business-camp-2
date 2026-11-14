import type { RuleDescription } from "./types";

export const balanceAboveEob: RuleDescription = {
  id: "balance-above-eob",
  name: "Bill asks for more than the insurance explanation says",
  summary: "The amount the bill asks the family to pay is higher than the amount the insurance explanation (EOB) says they owe for the same provider.",
  explanation:
    "Your insurance explanation says how much you owe this provider. The bill asks for more than that. It is worth asking the billing office to match the bill to the insurance explanation; the difference is {{amount}}.",
  sourceName: "CMS, Know your medical bill rights when using insurance, and the family's own Explanation of Benefits",
  sourceUrl: "https://www.cms.gov/medical-bill-rights/know-your-rights/using-insurance",
  confidenceNote: "Likely. The two papers are compared by arithmetic; a later EOB or another claim can explain a difference.",
};
