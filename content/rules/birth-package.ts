import type { RuleDescription } from "./types";

export const birthPackage: RuleDescription = {
  id: "birth-package",
  name: "Service that belongs to the birth package",
  summary:
    "The doctor billed a birth package code, which already covers care before the birth, the delivery and care after it, and also billed one of those parts as a separate line.",
  explanation:
    "Your doctor billed a birth package, which already covers routine care before the birth, the delivery and care after it. This line is one of those parts, billed again on its own. It is worth asking why; the amount in question is {{amount}}.",
  sourceName: "CMS, National Correct Coding Initiative Policy Manual for Medicare Services (2026), Chapter VII, Section G, Maternity Care and Delivery",
  sourceUrl: "https://www.cms.gov/files/document/07-chapter7-ncci-medicare-policy-manual-2026-final.pdf",
  confidenceNote: "Likely. The manual is written for Medicare; private plans usually follow the same packaging but may differ.",
};
