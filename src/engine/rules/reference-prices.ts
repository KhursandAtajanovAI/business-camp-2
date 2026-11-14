// A small hand-written table of public reference prices, in cents per unit.
// It stands in for full public price files until their license is cleared
// (see docs/economics/data-license.md). Each entry names its public source.
export type ReferencePrice = { cents: number; what: string; source: string };

const KENTUCKY_MEDICAID_2026 = "Kentucky Medicaid 2026 clinical laboratory fee schedule";

export const referencePrices: Record<string, ReferencePrice> = {
  "36415": { cents: 934, what: "blood draw", source: KENTUCKY_MEDICAID_2026 },
  "80053": { cents: 1056, what: "comprehensive metabolic panel", source: KENTUCKY_MEDICAID_2026 },
};

// Hospital list prices are often several times a public rate, so only a price
// more than ten times the reference is worth a question.
export const TIMES_ABOVE_REFERENCE = 10;
