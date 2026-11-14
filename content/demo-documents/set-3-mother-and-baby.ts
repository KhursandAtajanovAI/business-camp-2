import { buildPaper } from "./build-paper";
import type { DemoSet } from "./types";

export const set3: DemoSet = {
  id: "set-3",
  title: "Two hospital bills: one for the mother, one for the baby",
  story: "The hospital sent separate bills for Jane and for her newborn. The newborn hearing screening is on both of them.",
  papers: [
    {
      name: "Hospital bill (mother)",
      text: buildPaper({
        heading: "ITEMIZED STATEMENT", sender: "Riverside Women's Hospital", patient: "Jane Sample", date: "04/14/2026", network: "In-network",
        lines: [
          { date: "04/06/2026", code: "0120", description: "Room and board, semi-private", quantity: 2, billedCents: 480_000 },
          { date: "04/06/2026", code: "0720", description: "Labor and delivery room", quantity: 1, billedCents: 620_000 },
          { date: "04/07/2026", code: "0250", description: "Pharmacy", quantity: 1, billedCents: 30_000 },
          { date: "04/07/2026", code: "92558", description: "Newborn hearing screening", quantity: 1, billedCents: 18_500 },
        ],
        paidAndAdjustedCents: 930_000,
      }),
    },
    {
      name: "Hospital bill (baby)",
      text: buildPaper({
        heading: "ITEMIZED STATEMENT", sender: "Riverside Women's Hospital - Newborn Nursery", patient: "Baby Girl Sample", date: "04/14/2026", network: "In-network",
        lines: [
          { date: "04/06/2026", code: "0171", description: "Newborn nursery", quantity: 2, billedCents: 190_000 },
          { date: "04/07/2026", code: "92558", description: "Newborn hearing screening", quantity: 1, billedCents: 18_500 },
          { date: "04/07/2026", code: "86900", description: "Blood typing", quantity: 1, billedCents: 4_800 },
        ],
        paidAndAdjustedCents: 170_000,
      }),
    },
  ],
  planted: [
    { ruleId: "mother-baby-repeat", note: "Newborn hearing screening (92558) on 04/07/2026 is on the mother's bill and on the baby's bill.", atStakeCents: 18_500 },
  ],
};
