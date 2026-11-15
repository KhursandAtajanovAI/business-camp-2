import type { RuleDescription } from "./types";

export const priceAboveReference: RuleDescription = {
  id: "price-above-reference",
  name: "Price far above a public price list",
  summary: "A line is billed at more than ten times the price a public fee schedule lists for the same service.",
  explanation:
    "This price is more than ten times what a public price list shows for the same service. Prices do differ between providers, so this is only a question. It is worth asking how the price was set; the amount in question is {{amount}}.",
  sourceName:
    "Kentucky Medicaid, 2026 Clinical Diagnostic Laboratory Fee Schedule (effective January 1, 2026; revised September 23, 2026), used as a public reference price list",
  sourceUrl: "https://www.chfs.ky.gov/agencies/dms/DMSFeeRateSchedules/2026ClinicalLabRates.pdf",
  sourceSays:
    "The schedule lists what one state Medicaid program pays for each lab service, for example 9.34 dollars for a blood draw and 7.77 dollars for a complete blood count. No official source says that a price ten times higher is wrong; that threshold is our own.",
  sourceCheck: "data_only",
  checkedOn: "2026-11-15",
  confidenceNote:
    "Worth asking. A hand-written table of 31 common lab tests, each price read from the source; a reference price is not what a private plan must pay.",
};
