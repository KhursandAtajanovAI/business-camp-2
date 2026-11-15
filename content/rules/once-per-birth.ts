import type { RuleDescription } from "./types";

export const oncePerBirth: RuleDescription = {
  id: "once-per-birth",
  name: "Once-per-birth service billed more than once",
  summary:
    "A service that happens once in a birth, such as the delivery itself or the anesthesia for labor, is billed with a quantity above one.",
  explanation:
    "This service normally happens once in a birth, but the bill shows a quantity above one. With twins a bill can look different, so this is a question. It is worth asking why; the amount in question is {{amount}}.",
  sourceName:
    "Our own check; CMS, National Correct Coding Initiative Policy Manual for Medicare Services (revision of January 1, 2026), Chapter VII, lists the delivery codes but sets no limit",
  sourceUrl: "https://www.cms.gov/files/document/07-chapter7-ncci-medicare-policy-manual-2026-final.pdf",
  sourceSays:
    "Source not verified. Chapter VII lists the delivery codes but does not say how many times one may be billed for a birth, and it does not mention anesthesia for labor. CMS publishes unit limits in separate tables that we do not use because of their license.",
  sourceCheck: "not_confirmed",
  checkedOn: "2026-11-15",
  confidenceNote:
    "Worth asking. Source not verified: no official text we could read sets the limit, and births of twins or more are billed differently.",
};
