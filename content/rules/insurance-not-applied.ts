import type { RuleDescription } from "./types";

export const insuranceNotApplied: RuleDescription = {
  id: "insurance-not-applied",
  name: "Insurance payment not applied yet",
  summary: "The bill asks for the full price, while the insurance explanation shows that the plan has already paid part or all of it.",
  explanation:
    "This bill asks for the full price, but your insurance explanation shows the plan has paid. Bills are sometimes printed before the payment arrives. It is worth asking for an updated bill before paying; the amount in question is {{amount}}.",
  sourceName: "CMS, Know your medical bill rights when using insurance, and the family's own Explanation of Benefits",
  sourceUrl: "https://www.cms.gov/medical-bill-rights/know-your-rights/using-insurance",
  confidenceNote: "Likely. The bill shows no payment at all and the EOB shows one.",
};
