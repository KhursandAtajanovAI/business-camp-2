import type { RuleDescription } from "./types";

export const outOfNetworkSurprise: RuleDescription = {
  id: "out-of-network-surprise",
  name: "Out-of-network provider inside an in-network hospital",
  summary:
    "The family chose an in-network hospital, but one of the providers who worked there, such as the anesthesiologist or the lab, billed as out of network.",
  explanation:
    "You chose an in-network hospital, but this provider billed you as out of network. A federal law, the No Surprises Act, limits what such providers can ask from patients for care at an in-network hospital. It is worth asking them to bill only your in-network share; the amount in question is {{amount}}.",
  sourceName: "CMS, No Surprises Act: Know your medical bill rights when using insurance",
  sourceUrl: "https://www.cms.gov/medical-bill-rights/know-your-rights/using-insurance",
  sourceSays:
    "\"You're protected from out-of-network charges when you get care related to a visit to an in-network\" hospital. Providers of anesthesiology, pathology, radiology, neonatology and diagnostic services, including laboratory services, \"aren't allowed to ask you to sign a notice and consent form\". Short-term, health care sharing ministry and fixed indemnity plans are not covered.",
  sourceCheck: "confirmed",
  checkedOn: "2026-11-15",
  confidenceNote:
    "Likely for anesthesia and lab bills with an EOB; worth asking otherwise, because other providers may ask patients to sign a consent form and some plans are not covered by the law.",
};
