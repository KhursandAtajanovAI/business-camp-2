import { HOSPITAL, OBSTETRICIAN, PLAN, line, paper, type CheckSet } from "./paper";

// Papers that look wrong but are not: the story gives an innocent explanation.
// A finding here is a false alarm. We keep these sets because real life has them.
export const trickySets: CheckSet[] = [
  {
    id: "check-tricky-1", group: "tricky",
    title: "Twins: a second delivery line next to the birth package",
    story: "Jane had twins. The practice billed the birth package for the first baby and a delivery-only line for the second. The insurance plan accepted and paid both lines.",
    papers: [
      paper("Obstetrician bill", "doctor", {
        sender: OBSTETRICIAN, date: "08/12/2026", paidAndAdjustedCents: 590_000,
        lines: [
          line("08/03/2026", "59400", "Routine obstetric care with vaginal delivery", 480_000),
          line("08/03/2026", "59409", "Vaginal delivery only, second twin", 210_000),
        ],
      }),
      paper("Insurance explanation (EOB) for the obstetrician", "eob", {
        sender: PLAN, provider: OBSTETRICIAN, date: "08/20/2026",
        lines: [
          line("08/03/2026", "59400", "Routine obstetric care with vaginal delivery", 480_000, 1, [350_000, 280_000, 70_000]),
          line("08/03/2026", "59409", "Vaginal delivery only, second twin", 210_000, 1, [150_000, 120_000, 30_000]),
        ],
      }),
    ],
    planted: [],
  },
  {
    id: "check-tricky-2", group: "tricky",
    title: "A blood test that really was done twice in one day",
    story: "Jane lost blood during the birth, so her blood count was checked before and after. The insurance plan reviewed both tests and paid for both.",
    papers: [
      paper("Hospital bill (mother)", "bill", {
        sender: HOSPITAL, date: "09/12/2026", paidAndAdjustedCents: 945_360,
        lines: [
          line("09/05/2026", "0120", "Room and board, semi-private", 480_000, 2),
          line("09/05/2026", "0720", "Labor and delivery room", 620_000),
          line("09/05/2026", "85025", "Complete blood count", 5_800),
          line("09/05/2026", "85025", "Complete blood count", 5_800),
        ],
      }),
      paper("Insurance explanation (EOB) for the hospital", "eob", {
        sender: PLAN, provider: HOSPITAL, date: "09/20/2026",
        lines: [
          line("09/05/2026", "0120", "Room and board, semi-private", 480_000, 2, [360_000, 288_000, 72_000]),
          line("09/05/2026", "0720", "Labor and delivery room", 620_000, 1, [465_000, 372_000, 93_000]),
          line("09/05/2026", "85025", "Complete blood count", 5_800, 1, [3_100, 2_480, 620]),
          line("09/05/2026", "85025", "Complete blood count", 5_800, 1, [3_100, 2_480, 620]),
        ],
      }),
    ],
    planted: [],
  },
  {
    id: "check-tricky-3", group: "tricky",
    title: "An insurance explanation that was later corrected",
    story: "The plan first said Jane owed $1,650.00, then corrected the claim and sent a second explanation: $2,200.00. The hospital bill, printed after that, asks for $2,200.00.",
    papers: [
      paper("Insurance explanation (EOB), first version", "eob", {
        sender: PLAN, provider: HOSPITAL, date: "10/01/2026",
        lines: [
          line("09/22/2026", "0120", "Room and board, semi-private", 480_000, 2, [360_000, 288_000, 72_000]),
          line("09/22/2026", "0720", "Labor and delivery room", 620_000, 1, [465_000, 372_000, 93_000]),
        ],
      }),
      paper("Insurance explanation (EOB), corrected", "eob", {
        sender: PLAN, provider: HOSPITAL, date: "10/20/2026",
        lines: [
          line("09/22/2026", "0120", "Room and board, semi-private", 480_000, 2, [360_000, 264_000, 96_000]),
          line("09/22/2026", "0720", "Labor and delivery room", 620_000, 1, [465_000, 341_000, 124_000]),
        ],
      }),
      paper("Hospital bill (mother)", "bill", {
        sender: HOSPITAL, date: "10/25/2026", paidAndAdjustedCents: 880_000,
        lines: [line("09/22/2026", "0120", "Room and board, semi-private", 480_000, 2), line("09/22/2026", "0720", "Labor and delivery room", 620_000)],
      }),
    ],
    planted: [],
  },
];
