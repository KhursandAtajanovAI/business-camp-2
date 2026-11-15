import type { RuleDescription } from "./types";

export const motherBabyRepeat: RuleDescription = {
  id: "mother-baby-repeat",
  name: "Same charge on the mother's and the baby's bill",
  summary:
    "A hospital sends separate bills for the mother and for the baby. The same service, on the same day and at the same price, is on both.",
  explanation:
    "After a birth the hospital bills the mother and the baby separately. This service is on both bills with the same date and price. It is worth asking which bill it belongs on; the amount in question is {{amount}}.",
  sourceName:
    "Our own cross-check of the two bills; CMS, Check your medical bill for errors, speaks only of double billing in general",
  sourceUrl:
    "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/check-your-bill-errors",
  sourceSays:
    "Source not verified for this exact check. CMS says only that double billing \"is especially common if you got care from more than one provider\"; no official source says which of the two bills a newborn service belongs on.",
  sourceCheck: "not_confirmed",
  checkedOn: "2026-11-15",
  confidenceNote:
    "Worth asking. Source not verified: there is no official rule behind this check, and some services are done for both mother and baby.",
};
