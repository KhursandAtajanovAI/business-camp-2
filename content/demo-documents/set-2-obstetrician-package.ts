import { buildPaper } from "./build-paper";
import type { DemoSet } from "./types";

const practice = "Maple Grove Obstetrics and Midwifery";

export const set2: DemoSet = {
  id: "set-2",
  title: "An obstetrician bill with a birth package",
  story: "Jane had a cesarean birth. Her obstetrician billed the full birth package and then billed two parts of that package again as separate lines.",
  papers: [
    {
      name: "Obstetrician bill",
      text: buildPaper({
        heading: "STATEMENT OF PHYSICIAN SERVICES", sender: practice, patient: "Jane Sample", date: "04/02/2026", network: "In-network",
        lines: [
          { date: "02/20/2026", code: "76805", description: "Pregnancy ultrasound", quantity: 1, billedCents: 31_000 },
          { date: "03/10/2026", code: "59510", description: "Routine obstetric care with cesarean delivery", quantity: 1, billedCents: 540_000 },
          { date: "03/10/2026", code: "59414", description: "Delivery of placenta", quantity: 1, billedCents: 38_000 },
          { date: "03/24/2026", code: "59430", description: "Postpartum care visit", quantity: 1, billedCents: 24_000 },
        ],
        paidAndAdjustedCents: 551_200,
      }),
    },
    {
      name: "Insurance explanation (EOB) for the obstetrician",
      text: buildPaper({
        heading: "EXPLANATION OF BENEFITS - THIS IS NOT A BILL", sender: "Buckeye Health Plan", provider: practice,
        patient: "Jane Sample", date: "04/09/2026", network: "In-network",
        lines: [
          { date: "02/20/2026", code: "76805", description: "Pregnancy ultrasound", quantity: 1, billedCents: 31_000, allowedCents: 19_000, planPaidCents: 15_200, owesCents: 3_800 },
          { date: "03/10/2026", code: "59510", description: "Routine obstetric care with cesarean delivery", quantity: 1, billedCents: 540_000, allowedCents: 390_000, planPaidCents: 312_000, owesCents: 78_000 },
          { date: "03/10/2026", code: "59414", description: "Delivery of placenta", quantity: 1, billedCents: 38_000, allowedCents: 0, planPaidCents: 0, owesCents: 0 },
          { date: "03/24/2026", code: "59430", description: "Postpartum care visit", quantity: 1, billedCents: 24_000, allowedCents: 0, planPaidCents: 0, owesCents: 0 },
        ],
      }),
    },
  ],
  planted: [
    { ruleId: "birth-package", note: "Delivery of placenta (59414) is billed next to the full package (59510).", atStakeCents: 38_000 },
    { ruleId: "birth-package", note: "Postpartum care (59430) is billed next to the full package (59510).", atStakeCents: 24_000 },
  ],
};
