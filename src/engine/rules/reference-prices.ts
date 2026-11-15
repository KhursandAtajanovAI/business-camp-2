// A hand-written table of public reference prices, in cents per unit, for lab tests
// that are common around a birth. Every price was read from the source below on
// November 15, 2026; the descriptions are our own words. It stands in for full public
// price files until their license is cleared (see docs/economics/data-license.md).
export type ReferencePrice = { cents: number; what: string; source: string; sourceUrl: string; year: number };

// Kentucky Medicaid, "2026 Clinical Diagnostic Laboratory Fee Schedule",
// effective January 1, 2026, revised September 23, 2026.
const KENTUCKY_MEDICAID_2026 = {
  source: "Kentucky Medicaid 2026 clinical laboratory fee schedule",
  sourceUrl: "https://www.chfs.ky.gov/agencies/dms/DMSFeeRateSchedules/2026ClinicalLabRates.pdf",
  year: 2026,
};
const lab = (cents: number, what: string): ReferencePrice => ({ cents, what, ...KENTUCKY_MEDICAID_2026 });

export const referencePrices: Record<string, ReferencePrice> = {
  "36415": lab(934, "blood draw"),
  "80048": lab(846, "basic metabolic panel"),
  "80053": lab(1056, "comprehensive metabolic panel"),
  "80055": lab(4781, "obstetric blood test panel"),
  "81001": lab(317, "urine test, automated, with microscope"),
  "81002": lab(348, "urine test, manual"),
  "81003": lab(225, "urine test, automated"),
  "81025": lab(861, "urine pregnancy test"),
  "82247": lab(502, "bilirubin, total"),
  "82248": lab(502, "bilirubin, direct"),
  "82947": lab(393, "blood sugar level"),
  "82950": lab(475, "blood sugar level after a sugar drink"),
  "82951": lab(1287, "blood sugar tolerance test, three samples"),
  "83036": lab(971, "hemoglobin A1c"),
  "84443": lab(1680, "thyroid stimulating hormone (TSH)"),
  "85014": lab(237, "red blood cell concentration (hematocrit)"),
  "85018": lab(237, "hemoglobin"),
  "85025": lab(777, "complete blood count with automated differential"),
  "85027": lab(647, "complete blood count"),
  "86592": lab(427, "syphilis detection test"),
  "86762": lab(1439, "rubella antibody"),
  "86780": lab(1324, "treponema pallidum antibody"),
  "86803": lab(1427, "hepatitis C antibody"),
  "86850": lab(977, "red blood cell antibody screen"),
  "86880": lab(539, "red blood cell antibody test, direct"),
  "86901": lab(299, "blood typing for Rh (D)"),
  "87086": lab(807, "urine bacteria colony count"),
  "87340": lab(1033, "hepatitis B surface antigen"),
  "87491": lab(3509, "chlamydia test, amplified probe"),
  "87591": lab(3509, "gonorrhea test, amplified probe"),
  "87653": lab(3509, "group B strep test, amplified probe"),
};

// Verified but not switched on yet: 86900, blood group typing (ABO), 2.99 dollars in the same
// schedule. A test in src/intake (another owner's folder) uses this number as a line with no
// reference price, and the sample sets bill it at $48.00. Add it together with those changes.

// Hospital list prices are often several times a public rate, so only a price
// more than ten times the reference is worth a question. The threshold is our own.
export const TIMES_ABOVE_REFERENCE = 10;
