import type { RuleDescription } from "./types";

export const motherBabyRepeat: RuleDescription = {
  id: "mother-baby-repeat",
  name: "Same charge on the mother's and the baby's bill",
  summary: "A hospital sends separate bills for the mother and for the baby. The same service, on the same day and at the same price, is on both.",
  explanation:
    "After a birth the hospital bills the mother and the baby separately. This service is on both bills with the same date and price. It is worth asking which bill it belongs on; the amount in question is {{amount}}.",
  sourceName: "Our own cross-check of the two bills; no single official source",
  sourceUrl: "https://www.cms.gov/medical-bill-rights",
  confidenceNote: "Worth asking. There is no official rule behind this check, and some services are done for both mother and baby.",
};
