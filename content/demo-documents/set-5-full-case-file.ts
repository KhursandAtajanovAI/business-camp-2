import { buildPaper } from "./build-paper";
import type { DemoSet } from "./types";

const hospital = "Riverside Women's Hospital";

export const set5: DemoSet = {
  id: "set-5",
  title: "A full case file: six papers from one birth",
  story: "Half a year of papers for one family: the hospital for Jane and for the baby, the obstetrician, the lab, the pediatrician and one insurance explanation.",
  papers: [
    {
      name: "Hospital bill (mother)",
      text: buildPaper({
        heading: "ITEMIZED STATEMENT", sender: hospital, patient: "Jane Sample", date: "06/22/2026", network: "In-network",
        lines: [
          { date: "06/15/2026", code: "0120", description: "Room and board, semi-private", quantity: 2, billedCents: 480_000 },
          { date: "06/15/2026", code: "0720", description: "Labor and delivery room", quantity: 1, billedCents: 620_000 },
        ],
        paidAndAdjustedCents: 805_000,
      }),
    },
    {
      name: "Insurance explanation (EOB) for the hospital",
      text: buildPaper({
        heading: "EXPLANATION OF BENEFITS - THIS IS NOT A BILL", sender: "Buckeye Health Plan", provider: hospital, patient: "Jane Sample", date: "06/30/2026", network: "In-network",
        lines: [
          { date: "06/15/2026", code: "0120", description: "Room and board, semi-private", quantity: 2, billedCents: 480_000, allowedCents: 360_000, planPaidCents: 264_000, owesCents: 96_000 },
          { date: "06/15/2026", code: "0720", description: "Labor and delivery room", quantity: 1, billedCents: 620_000, allowedCents: 465_000, planPaidCents: 341_000, owesCents: 124_000 },
        ],
      }),
    },
    {
      name: "Obstetrician bill",
      text: buildPaper({
        heading: "STATEMENT OF PHYSICIAN SERVICES", sender: "Maple Grove Obstetrics and Midwifery", patient: "Jane Sample", date: "06/25/2026", network: "In-network",
        lines: [{ date: "06/15/2026", code: "59400", description: "Routine obstetric care with vaginal delivery", quantity: 2, billedCents: 960_000 }],
        paidAndAdjustedCents: 700_000,
      }),
    },
    {
      name: "Hospital bill (baby)",
      text: buildPaper({
        heading: "ITEMIZED STATEMENT", sender: `${hospital} - Newborn Nursery`, patient: "Baby Boy Sample", date: "06/22/2026", network: "In-network",
        lines: [
          { date: "06/15/2026", code: "0171", description: "Newborn nursery", quantity: 2, billedCents: 190_000 },
          { date: "06/16/2026", code: "92558", description: "Newborn hearing screening", quantity: 1, billedCents: 18_500 },
        ],
        paidAndAdjustedCents: 166_800,
      }),
    },
    {
      name: "Lab bill",
      text: buildPaper({
        heading: "ITEMIZED STATEMENT", sender: "ClearPath Laboratory Services", patient: "Jane Sample", date: "06/20/2026", network: "In-network",
        lines: [
          { date: "06/14/2026", code: "36415", description: "Blood draw", quantity: 1, billedCents: 14_500 },
          { date: "06/14/2026", code: "86850", description: "Antibody screen", quantity: 1, billedCents: 6_200 },
        ],
        paidAndAdjustedCents: 9_000,
      }),
    },
    {
      name: "Pediatrician bill",
      text: buildPaper({
        heading: "STATEMENT OF PHYSICIAN SERVICES", sender: "Little Sprouts Pediatrics", patient: "Baby Boy Sample", date: "07/02/2026", network: "In-network",
        lines: [{ date: "06/18/2026", code: "99391", description: "Well-baby visit", quantity: 1, billedCents: 21_000 }],
        paidAndAdjustedCents: 21_000,
      }),
    },
  ],
  planted: [
    { ruleId: "balance-above-eob", note: "The hospital bill asks for $2,950.00 but the EOB says the family owes $2,200.00.", atStakeCents: 75_000 },
    { ruleId: "once-per-birth", note: "The birth package (59400) is billed with quantity 2 for one birth.", atStakeCents: 480_000 },
    { ruleId: "price-above-reference", note: "A blood draw (36415) is billed at $145.00, far above the public reference price.", atStakeCents: 5_670 },
  ],
};
