import { buildPaper } from "./build-paper";
import type { DemoSet } from "./types";

const hospital = "Riverside Women's Hospital";

export const set1: DemoSet = {
  id: "set-1",
  title: "A hospital bill and its insurance explanation",
  story: "Jane had a vaginal birth. The hospital bill lists one blood test twice and asks for more than the insurance plan says she owes.",
  papers: [
    {
      name: "Hospital bill (mother)",
      text: buildPaper({
        heading: "ITEMIZED STATEMENT", sender: hospital, patient: "Jane Sample", date: "03/20/2026", network: "In-network",
        lines: [
          { date: "03/14/2026", code: "0120", description: "Room and board, semi-private", quantity: 2, billedCents: 480_000 },
          { date: "03/14/2026", code: "0720", description: "Labor and delivery room", quantity: 1, billedCents: 620_000 },
          { date: "03/14/2026", code: "0250", description: "Pharmacy", quantity: 1, billedCents: 41_800 },
          { date: "03/14/2026", code: "85025", description: "Complete blood count", quantity: 1, billedCents: 7_250 },
          { date: "03/14/2026", code: "85025", description: "Complete blood count", quantity: 1, billedCents: 7_250 },
          { date: "03/15/2026", code: "0270", description: "Medical supplies", quantity: 1, billedCents: 26_500 },
        ],
        paidAndAdjustedCents: 910_000,
      }),
    },
    {
      name: "Insurance explanation (EOB) for the hospital",
      text: buildPaper({
        heading: "EXPLANATION OF BENEFITS - THIS IS NOT A BILL", sender: "Buckeye Health Plan", provider: hospital,
        patient: "Jane Sample", date: "03/28/2026", network: "In-network",
        lines: [
          { date: "03/14/2026", code: "0120", description: "Room and board, semi-private", quantity: 2, billedCents: 480_000, allowedCents: 360_000, planPaidCents: 288_000, owesCents: 72_000 },
          { date: "03/14/2026", code: "0720", description: "Labor and delivery room", quantity: 1, billedCents: 620_000, allowedCents: 465_000, planPaidCents: 372_000, owesCents: 93_000 },
          { date: "03/14/2026", code: "0250", description: "Pharmacy", quantity: 1, billedCents: 41_800, allowedCents: 25_000, planPaidCents: 20_000, owesCents: 5_000 },
          { date: "03/14/2026", code: "85025", description: "Complete blood count", quantity: 1, billedCents: 7_250, allowedCents: 3_100, planPaidCents: 2_480, owesCents: 620 },
          { date: "03/15/2026", code: "0270", description: "Medical supplies", quantity: 1, billedCents: 26_500, allowedCents: 15_000, planPaidCents: 12_000, owesCents: 3_000 },
        ],
      }),
    },
  ],
  planted: [
    { ruleId: "duplicate-line", note: "Complete blood count is listed twice on 03/14/2026.", atStakeCents: 7_250 },
    { ruleId: "balance-above-eob", note: "The bill asks for $2,728.00 but the EOB says the family owes $1,736.20.", atStakeCents: 99_180 },
  ],
};
