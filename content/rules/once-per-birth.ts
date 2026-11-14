import type { RuleDescription } from "./types";

export const oncePerBirth: RuleDescription = {
  id: "once-per-birth",
  name: "Once-per-birth service billed more than once",
  summary: "A service that happens once in a birth, such as the delivery itself or the anesthesia for labor, is billed with a quantity above one.",
  explanation:
    "This service normally happens once in a birth, but the bill shows a quantity above one. With twins a bill can look different, so this is a question. It is worth asking why; the amount in question is {{amount}}.",
  sourceName: "CMS, National Correct Coding Initiative Policy Manual for Medicare Services (2026), Chapter VII, Sections G and H",
  sourceUrl: "https://www.cms.gov/files/document/07-chapter7-ncci-medicare-policy-manual-2026-final.pdf",
  confidenceNote: "Likely. Births of twins or more are billed differently and can explain a higher quantity.",
};
