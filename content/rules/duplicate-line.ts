import type { RuleDescription } from "./types";

export const duplicateLine: RuleDescription = {
  id: "duplicate-line",
  name: "Repeated line",
  summary: "The same service, with the same code, date and price, is listed more than once on one bill.",
  explanation:
    "This line appears more than once with the same code, date and price. A service done once is billed once. It is worth asking whether it was really done again; the amount in question is {{amount}}.",
  sourceName: "CMS, Check your medical bill for errors",
  sourceUrl:
    "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/check-your-bill-errors",
  sourceSays:
    "CMS tells patients: \"Make sure you weren't billed twice for the same service.\" CMS also sets the most units of one service a provider would report for one patient on one day (Medically Unlikely Edits).",
  sourceCheck: "confirmed",
  checkedOn: "2026-11-15",
  confidenceNote:
    "Likely when code, date and price all match; worth asking when a line has no code or date. Some services really are done twice in a day, so it is a question, not a verdict.",
};
