import type { RuleDescription } from "./types";

export const balanceAboveEob: RuleDescription = {
  id: "balance-above-eob",
  name: "Bill asks for more than the insurance explanation says",
  summary:
    "The amount the bill asks the family to pay is higher than the amount the insurance explanation (EOB) says they owe for the same provider.",
  explanation:
    "Your insurance explanation says how much you owe this provider. The bill asks for more than that. It is worth asking the billing office to match the bill to the insurance explanation; the difference is {{amount}}.",
  sourceName: "CMS, How to read a health insurance explanation of benefits",
  sourceUrl:
    "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/read-explanation-benefits",
  sourceSays: "\"Your bill should not be higher than the Patient Balance. If it is, talk to your provider.\"",
  sourceCheck: "confirmed",
  checkedOn: "2026-11-15",
  confidenceNote:
    "Likely. The two papers are compared by arithmetic; a later, corrected EOB or another claim can explain a difference.",
};
