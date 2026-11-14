import type { RuleDescription } from "./types";

export const priceAboveReference: RuleDescription = {
  id: "price-above-reference",
  name: "Price far above a public price list",
  summary: "A line is billed at more than ten times the price a public fee schedule lists for the same service.",
  explanation:
    "This price is more than ten times what a public price list shows for the same service. Prices do differ between providers, so this is only a question. It is worth asking how the price was set; the amount in question is {{amount}}.",
  sourceName: "Kentucky Medicaid 2026 clinical laboratory fee schedule, used as a public reference price list",
  sourceUrl: "https://www.chfs.ky.gov/agencies/dms/DMSFeeRateSchedules/2026ClinicalLabRates.pdf",
  confidenceNote: "Worth asking. A small hand-written table of two services; a reference price is not what a private plan must pay.",
};
