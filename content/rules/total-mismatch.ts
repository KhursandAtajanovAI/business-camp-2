import type { RuleDescription } from "./types";

export const totalMismatch: RuleDescription = {
  id: "total-mismatch",
  name: "Total is higher than the lines add up to",
  summary: "The total printed on the bill is higher than the sum of its lines.",
  explanation:
    "We added up every line on this bill. The total printed on the bill is higher than that sum. It is worth asking the billing office to explain the difference of {{amount}}.",
  sourceName: "CMS, How to read a medical bill, and arithmetic on the bill itself",
  sourceUrl:
    "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/how-read-your-bill",
  sourceSays:
    "CMS defines total charges as \"the full price for the service(s) and/or item(s)\", so the total should equal the sum of the lines.",
  sourceCheck: "confirmed",
  checkedOn: "2026-11-15",
  confidenceNote:
    "Sure about the arithmetic when every line was read clearly; worth asking when part of the paper was hard to read. A missing page can also explain it, which is why it is still a question.",
};
