import { HOSPITAL, OBSTETRICIAN, PLAN, line, paper, type CheckSet } from "./paper";

// Papers with nothing wrong in them. Every finding here is a false alarm.
export const cleanSets: CheckSet[] = [
  {
    id: "check-clean-1", group: "clean",
    title: "A hospital bill that matches its insurance explanation",
    story: "Jane had a vaginal birth. The hospital bill asks for exactly what the insurance explanation says she owes.",
    papers: [
      paper("Hospital bill (mother)", "bill", {
        sender: HOSPITAL, date: "07/20/2026", paidAndAdjustedCents: 973_780,
        lines: [
          line("07/12/2026", "0120", "Room and board, semi-private", 480_000, 2),
          line("07/12/2026", "0720", "Labor and delivery room", 620_000),
          line("07/12/2026", "0250", "Pharmacy", 38_000),
          line("07/13/2026", "85025", "Complete blood count", 5_800),
        ],
      }),
      paper("Insurance explanation (EOB) for the hospital", "eob", {
        sender: PLAN, provider: HOSPITAL, date: "07/28/2026",
        lines: [
          line("07/12/2026", "0120", "Room and board, semi-private", 480_000, 2, [360_000, 288_000, 72_000]),
          line("07/12/2026", "0720", "Labor and delivery room", 620_000, 1, [465_000, 372_000, 93_000]),
          line("07/12/2026", "0250", "Pharmacy", 38_000, 1, [22_000, 17_600, 4_400]),
          line("07/13/2026", "85025", "Complete blood count", 5_800, 1, [3_100, 2_480, 620]),
        ],
      }),
    ],
    planted: [],
  },
  {
    id: "check-clean-2", group: "clean",
    title: "An obstetrician bill with a package and an ultrasound",
    story: "The obstetrician billed the birth package once and one ultrasound, which is not part of the package. The bill matches the insurance explanation.",
    papers: [
      paper("Obstetrician bill", "doctor", {
        sender: OBSTETRICIAN, date: "07/30/2026", paidAndAdjustedCents: 437_200,
        lines: [
          line("06/02/2026", "76805", "Pregnancy ultrasound", 31_000),
          line("07/12/2026", "59400", "Routine obstetric care with vaginal delivery", 480_000),
        ],
      }),
      paper("Insurance explanation (EOB) for the obstetrician", "eob", {
        sender: PLAN, provider: OBSTETRICIAN, date: "08/06/2026",
        lines: [
          line("06/02/2026", "76805", "Pregnancy ultrasound", 31_000, 1, [19_000, 15_200, 3_800]),
          line("07/12/2026", "59400", "Routine obstetric care with vaginal delivery", 480_000, 1, [350_000, 280_000, 70_000]),
        ],
      }),
    ],
    planted: [],
  },
  {
    id: "check-clean-3", group: "clean",
    title: "Three ordinary papers of one family",
    story: "The baby's hospital bill, a lab bill with ordinary prices and a well-baby visit that the plan paid in full.",
    papers: [
      paper("Hospital bill (baby)", "bill", {
        sender: `${HOSPITAL} - Newborn Nursery`, patient: "Baby Boy Sample", date: "07/20/2026", paidAndAdjustedCents: 166_800,
        lines: [line("07/12/2026", "0171", "Newborn nursery", 190_000, 2), line("07/13/2026", "92558", "Newborn hearing screening", 18_500)],
      }),
      paper("Lab bill", "bill", {
        sender: "ClearPath Laboratory Services", date: "07/18/2026", paidAndAdjustedCents: 8_000,
        lines: [
          line("07/11/2026", "36415", "Blood draw", 2_500),
          line("07/11/2026", "86850", "Antibody screen", 6_200),
          line("07/11/2026", "86900", "Blood typing", 1_900),
        ],
      }),
      paper("Pediatrician bill", "doctor", {
        sender: "Little Sprouts Pediatrics", patient: "Baby Boy Sample", date: "07/29/2026", paidAndAdjustedCents: 21_000,
        lines: [line("07/16/2026", "99391", "Well-baby visit", 21_000)],
      }),
    ],
    planted: [],
  },
];
