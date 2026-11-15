import { HOSPITAL, PLAN, line, paper, type CheckSet } from "./paper";

const room = (date: string) => line(date, "0120", "Room and board, semi-private", 480_000, 2);
const delivery = (date: string) => line(date, "0720", "Labor and delivery room", 620_000);

// Papers with a mistake in them, in shapes the five sample sets do not have.
// `planted` names the rule that should speak up; "no-rule-yet" means no rule covers it.
export const mistakeSetsA: CheckSet[] = [
  {
    id: "check-mistake-1", group: "mistakes",
    title: "The insurance plan writes the hospital's name differently",
    story: "The hospital bill asks for more than the insurance explanation says Jane owes. The plan prints a shortened hospital name.",
    papers: [
      paper("Hospital bill (mother)", "bill", {
        sender: HOSPITAL, date: "07/20/2026", paidAndAdjustedCents: 880_000,
        lines: [room("07/12/2026"), delivery("07/12/2026"), line("07/12/2026", "0250", "Pharmacy", 41_800)],
      }),
      paper("Insurance explanation (EOB) for the hospital", "eob", {
        sender: PLAN, provider: "Riverside Womens Hosp Inc", date: "07/28/2026",
        lines: [
          line("07/12/2026", "0120", "Room and board, semi-private", 480_000, 2, [360_000, 288_000, 72_000]),
          line("07/12/2026", "0720", "Labor and delivery room", 620_000, 1, [465_000, 372_000, 93_000]),
          line("07/12/2026", "0250", "Pharmacy", 41_800, 1, [25_000, 20_000, 5_000]),
        ],
      }),
    ],
    planted: [{ ruleId: "balance-above-eob", note: "The bill asks for $2,618.00 but the EOB says the family owes $1,700.00.", atStakeCents: 91_800 }],
  },
  {
    id: "check-mistake-2", group: "mistakes",
    title: "The same charge on two statements from one hospital",
    story: "The hospital sent a second statement with late charges. The pharmacy charge from the first statement is on it again.",
    papers: [
      paper("Hospital bill (mother), first statement", "bill", {
        sender: HOSPITAL, date: "08/20/2026", paidAndAdjustedCents: 880_000,
        lines: [room("08/12/2026"), delivery("08/12/2026"), line("08/12/2026", "0250", "Pharmacy", 41_800)],
      }),
      paper("Hospital bill (mother), late charges", "bill", {
        sender: HOSPITAL, date: "09/05/2026",
        lines: [line("08/12/2026", "0250", "Pharmacy", 41_800), line("08/13/2026", "0270", "Medical supplies", 26_500)],
      }),
    ],
    planted: [{ ruleId: "duplicate-line", note: "Pharmacy on 08/12/2026 is billed on both statements.", atStakeCents: 41_800 }],
  },
  {
    id: "check-mistake-3", group: "mistakes",
    title: "Parts of the delivery billed next to the package",
    story: "Jane had a vaginal birth after an earlier cesarean. The practice billed the birth package and also billed monitoring during labor and an episiotomy as separate lines.",
    papers: [
      paper("Obstetrician bill", "doctor", {
        sender: "Cedar Hill Women's Care", date: "08/28/2026", paidAndAdjustedCents: 400_000,
        lines: [
          line("08/15/2026", "59610", "Routine obstetric care, vaginal delivery after cesarean", 520_000),
          line("08/15/2026", "59050", "Fetal monitoring during labor", 45_000),
          line("08/15/2026", "59300", "Episiotomy", 60_000),
        ],
      }),
    ],
    planted: [
      { ruleId: "birth-package", note: "Fetal monitoring during labor (59050) is billed next to the package (59610).", atStakeCents: 45_000 },
      { ruleId: "birth-package", note: "Episiotomy (59300) is billed next to the package (59610).", atStakeCents: 60_000 },
    ],
  },
  {
    id: "check-mistake-4", group: "mistakes",
    title: "Lab prices far above a public price list",
    story: "A lab billed a blood draw at $120.00 and a metabolic panel at $250.00. A public price list shows $9.34 and $10.56.",
    papers: [
      paper("Lab bill", "bill", {
        sender: "ClearPath Laboratory Services", date: "09/02/2026",
        lines: [
          line("08/25/2026", "36415", "Blood draw", 12_000),
          line("08/25/2026", "80053", "Comprehensive metabolic panel", 25_000),
          line("08/25/2026", "86850", "Antibody screen", 6_200),
        ],
      }),
    ],
    planted: [
      { ruleId: "price-above-reference", note: "Blood draw at $120.00 is more than ten times $9.34.", atStakeCents: 2_660 },
      { ruleId: "price-above-reference", note: "Metabolic panel at $250.00 is more than ten times $10.56.", atStakeCents: 14_440 },
    ],
  },
  {
    id: "check-mistake-5", group: "mistakes",
    title: "An out-of-network lab inside an in-network hospital, no EOB yet",
    story: "Jane chose an in-network hospital. A lab that worked there billed her as out of network. The insurance explanation has not arrived yet.",
    papers: [
      paper("Hospital bill (mother)", "bill", { sender: HOSPITAL, date: "09/18/2026", paidAndAdjustedCents: 880_000, lines: [room("09/10/2026"), delivery("09/10/2026")] }),
      paper("Lab bill", "bill", {
        sender: "Summit Pathology and Laboratory", date: "09/20/2026", network: "Out-of-network",
        lines: [line("09/10/2026", "85025", "Complete blood count", 5_800), line("09/10/2026", "86900", "Blood typing", 1_900)],
      }),
    ],
    planted: [{ ruleId: "out-of-network-surprise", note: "The out-of-network lab asks for $77.00 for care inside an in-network hospital.", atStakeCents: 7_700 }],
  },
];
