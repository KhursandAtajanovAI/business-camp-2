import { buildPaper } from "./build-paper";
import type { DemoSet } from "./types";

const eobHeading = "EXPLANATION OF BENEFITS - THIS IS NOT A BILL" as const;
const anesthesia = "Lakeshore Anesthesia Associates";
const lab = "ClearPath Laboratory Services";

export const set4: DemoSet = {
  id: "set-4",
  title: "An out-of-network doctor inside an in-network hospital",
  story: "Jane chose an in-network hospital, but the anesthesiologist was out of network and billed her the difference. The lab sent a bill before the insurance payment was applied.",
  papers: [
    {
      name: "Hospital bill (mother)",
      text: buildPaper({
        heading: "ITEMIZED STATEMENT", sender: "Riverside Women's Hospital", patient: "Jane Sample", date: "05/10/2026", network: "In-network",
        lines: [
          { date: "05/02/2026", code: "0120", description: "Room and board, semi-private", quantity: 2, billedCents: 480_000 },
          { date: "05/02/2026", code: "0720", description: "Labor and delivery room", quantity: 1, billedCents: 620_000 },
        ],
        paidAndAdjustedCents: 880_000,
      }),
    },
    {
      name: "Anesthesia bill",
      text: buildPaper({
        heading: "STATEMENT OF PHYSICIAN SERVICES", sender: anesthesia, patient: "Jane Sample", date: "05/12/2026", network: "Out-of-network",
        lines: [{ date: "05/02/2026", code: "01967", description: "Anesthesia for labor (epidural)", quantity: 1, billedCents: 240_000 }],
        paidAndAdjustedCents: 60_000,
      }),
    },
    {
      name: "Insurance explanation (EOB) for anesthesia",
      text: buildPaper({
        heading: eobHeading, sender: "Buckeye Health Plan", provider: anesthesia, patient: "Jane Sample", date: "05/18/2026", network: "Out-of-network",
        lines: [{ date: "05/02/2026", code: "01967", description: "Anesthesia for labor (epidural)", quantity: 1, billedCents: 240_000, allowedCents: 110_000, planPaidCents: 88_000, owesCents: 22_000 }],
      }),
    },
    {
      name: "Lab bill",
      text: buildPaper({
        heading: "ITEMIZED STATEMENT", sender: lab, patient: "Jane Sample", date: "05/09/2026", network: "In-network",
        lines: [
          { date: "05/01/2026", code: "86900", description: "Blood typing", quantity: 1, billedCents: 4_800 },
          { date: "05/01/2026", code: "86850", description: "Antibody screen", quantity: 1, billedCents: 6_200 },
          { date: "05/01/2026", code: "85025", description: "Complete blood count", quantity: 1, billedCents: 7_250 },
        ],
      }),
    },
    {
      name: "Insurance explanation (EOB) for the lab",
      text: buildPaper({
        heading: eobHeading, sender: "Buckeye Health Plan", provider: lab, patient: "Jane Sample", date: "05/20/2026", network: "In-network",
        lines: [
          { date: "05/01/2026", code: "86900", description: "Blood typing", quantity: 1, billedCents: 4_800, allowedCents: 2_000, planPaidCents: 2_000, owesCents: 0 },
          { date: "05/01/2026", code: "86850", description: "Antibody screen", quantity: 1, billedCents: 6_200, allowedCents: 2_600, planPaidCents: 2_600, owesCents: 0 },
          { date: "05/01/2026", code: "85025", description: "Complete blood count", quantity: 1, billedCents: 7_250, allowedCents: 3_100, planPaidCents: 3_100, owesCents: 0 },
        ],
      }),
    },
  ],
  planted: [
    { ruleId: "out-of-network-surprise", note: "The out-of-network anesthesiologist asks for $1,800.00; the EOB says the in-network share is $220.00.", atStakeCents: 158_000 },
    { ruleId: "insurance-not-applied", note: "The lab bill shows no insurance payment, but the EOB says the plan paid and the family owes $0.00.", atStakeCents: 18_250 },
  ],
};
