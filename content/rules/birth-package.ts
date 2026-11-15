import type { RuleDescription } from "./types";

export const birthPackage: RuleDescription = {
  id: "birth-package",
  name: "Service that belongs to the birth package",
  summary:
    "The doctor billed a birth package code, which already covers care before the birth, the delivery and care after it, and also billed one of those parts as a separate line.",
  explanation:
    "Your doctor billed a birth package, which already covers routine care before the birth, the delivery and care after it. This line is one of those parts, billed again on its own. It is worth asking why; the amount in question is {{amount}}.",
  sourceName:
    "CMS, National Correct Coding Initiative Policy Manual for Medicare Services (revision of January 1, 2026), Chapter VII, Section G, Maternity Care and Delivery",
  sourceUrl: "https://www.cms.gov/files/document/07-chapter7-ncci-medicare-policy-manual-2026-final.pdf",
  sourceSays:
    "Section G says the total packages (for example 59400 and 59510) \"include antepartum care, the delivery, and postpartum care\", and that 59050, 59051, 59300 and 59414 are included in the twelve delivery codes and \"are not separately reportable\".",
  sourceCheck: "confirmed",
  checkedOn: "2026-11-15",
  confidenceNote:
    "Likely for the four parts the manual names by number (59050, 59051, 59300, 59414). Worth asking for other parts: the manual states the principle but does not name their numbers, and with twins a second delivery line can be right. The manual is written for Medicare; private plans usually follow it but may differ.",
};
