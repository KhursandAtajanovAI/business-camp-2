import { HOSPITAL, PLAN, line, paper, type CheckSet } from "./paper";

const PEDIATRICIAN = "Little Sprouts Pediatrics";

// The printed total is $350.00 higher than the two lines add up to.
const wrongTotal = paper("Hospital bill (mother)", "bill", {
  sender: HOSPITAL, date: "10/08/2026", paidAndAdjustedCents: 880_000, amountDueCents: 255_000,
  lines: [line("09/30/2026", "0120", "Room and board, semi-private", 480_000, 2), line("09/30/2026", "0720", "Labor and delivery room", 620_000)],
});

export const mistakeSetsB: CheckSet[] = [
  {
    id: "check-mistake-6", group: "mistakes",
    title: "Anesthesia billed twice and a total that does not add up",
    story: "The anesthesia bill shows the epidural with a quantity of two for one birth. The hospital bill prints a total that is higher than its lines.",
    papers: [
      { name: wrongTotal.name, text: wrongTotal.text.replace("Total charges: $11,000.00", "Total charges: $11,350.00") },
      paper("Anesthesia bill", "doctor", {
        sender: "Lakeshore Anesthesia Associates", date: "10/09/2026", paidAndAdjustedCents: 380_000,
        lines: [line("09/30/2026", "01967", "Anesthesia for labor (epidural)", 480_000, 2)],
      }),
    ],
    planted: [
      { ruleId: "total-mismatch", note: "The lines add up to $11,000.00 but the bill says $11,350.00.", atStakeCents: 35_000 },
      { ruleId: "once-per-birth", note: "Anesthesia for labor (01967) is billed with quantity 2 for one birth.", atStakeCents: 240_000 },
    ],
  },
  {
    id: "check-mistake-7", group: "mistakes",
    title: "Three nursery days for a two-day stay",
    story: "Jane and her healthy baby went home together after two days. The baby's bill charges three nursery days.",
    papers: [
      paper("Hospital bill (mother)", "bill", {
        sender: HOSPITAL, date: "10/20/2026", paidAndAdjustedCents: 880_000,
        lines: [line("10/12/2026", "0120", "Room and board, semi-private", 480_000, 2), line("10/12/2026", "0720", "Labor and delivery room", 620_000)],
      }),
      paper("Hospital bill (baby)", "bill", {
        sender: `${HOSPITAL} - Newborn Nursery`, patient: "Baby Girl Sample", date: "10/20/2026", paidAndAdjustedCents: 240_000,
        lines: [line("10/12/2026", "0171", "Newborn nursery", 285_000, 3), line("10/13/2026", "92558", "Newborn hearing screening", 18_500)],
      }),
    ],
    planted: [{ ruleId: "no-rule-yet", note: "One nursery day too many: the mother's bill shows a two-day stay.", atStakeCents: 95_000 }],
  },
  {
    id: "check-mistake-8", group: "mistakes",
    title: "A well-baby visit with a charge for the family",
    story: "The baby's routine checkup was with an in-network pediatrician. The plan left $40.00 for the family to pay, and the bill asks for it.",
    papers: [
      paper("Pediatrician bill", "doctor", {
        sender: PEDIATRICIAN, patient: "Baby Boy Sample", date: "10/28/2026", paidAndAdjustedCents: 17_000,
        lines: [line("10/16/2026", "99391", "Well-baby visit", 21_000)],
      }),
      paper("Insurance explanation (EOB) for the pediatrician", "eob", {
        sender: PLAN, provider: PEDIATRICIAN, patient: "Baby Boy Sample", date: "10/24/2026",
        lines: [line("10/16/2026", "99391", "Well-baby visit", 21_000, 1, [17_000, 13_000, 4_000])],
      }),
    ],
    planted: [{ ruleId: "preventive-care-charged", note: "A well-baby visit in network left $40.00 for the family to pay.", atStakeCents: 4_000 }],
  },
  {
    id: "check-mistake-9", group: "mistakes",
    title: "The plan did not cover the second day in the hospital",
    story: "Jane had a vaginal birth and stayed two days. The insurance explanation covers the first day and marks the second day as not covered.",
    papers: [
      paper("Hospital bill (mother)", "bill", {
        sender: HOSPITAL, date: "11/02/2026", paidAndAdjustedCents: 731_000,
        lines: [
          line("10/24/2026", "0120", "Room and board, semi-private", 240_000),
          line("10/25/2026", "0120", "Room and board, semi-private", 240_000),
          line("10/24/2026", "0720", "Labor and delivery room", 620_000),
        ],
      }),
      paper("Insurance explanation (EOB) for the hospital", "eob", {
        sender: PLAN, provider: HOSPITAL, date: "10/30/2026",
        lines: [
          line("10/24/2026", "0120", "Room and board, semi-private", 240_000, 1, [180_000, 144_000, 36_000]),
          line("10/25/2026", "0120", "Room and board, semi-private", 240_000, 1, [0, 0, 240_000]),
          line("10/24/2026", "0720", "Labor and delivery room", 620_000, 1, [465_000, 372_000, 93_000]),
        ],
      }),
    ],
    planted: [{ ruleId: "stay-not-covered", note: "The plan paid nothing for the second of two hospital days after a vaginal birth.", atStakeCents: 240_000 }],
  },
];
