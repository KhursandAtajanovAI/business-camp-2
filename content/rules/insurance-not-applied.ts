import type { RuleDescription } from "./types";

export const insuranceNotApplied: RuleDescription = {
  id: "insurance-not-applied",
  name: "Insurance payment not applied yet",
  summary:
    "The bill asks for the full price, while the insurance explanation shows that the plan has already paid part or all of it.",
  explanation:
    "This bill asks for the full price, but your insurance explanation shows the plan has paid. Bills are sometimes printed before the payment arrives. It is worth asking for an updated bill before paying; the amount in question is {{amount}}.",
  sourceName: "CMS, How to read a health insurance explanation of benefits",
  sourceUrl:
    "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/read-explanation-benefits",
  sourceSays:
    "\"Your bill should not be higher than the Patient Balance. If it is, talk to your provider.\" That the bill was printed before the payment arrived is our reading of the two papers, not a statement of the source.",
  sourceCheck: "confirmed",
  checkedOn: "2026-11-15",
  confidenceNote: "Likely. The bill shows no payment at all and the EOB shows one.",
};
