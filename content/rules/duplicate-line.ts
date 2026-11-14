import type { RuleDescription } from "./types";

export const duplicateLine: RuleDescription = {
  id: "duplicate-line",
  name: "Repeated line",
  summary: "The same service, with the same code, date and price, is listed more than once on one bill.",
  explanation:
    "This line appears more than once with the same code, date and price. A service done once is billed once. It is worth asking whether it was really done again; the amount in question is {{amount}}.",
  sourceName: "CMS, Medically Unlikely Edits: the most units of a service a provider would report for one patient on one day",
  sourceUrl: "https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-medically-unlikely-edits",
  confidenceNote: "Likely when code, date and price all match. Some services really are done twice in a day, so it is a question, not a verdict.",
};
