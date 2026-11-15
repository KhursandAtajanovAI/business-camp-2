import { buildPaper } from "../build-paper";
import type { DemoSet, PaperLine, PaperSpec } from "../types";

// clean: nothing is wrong. tricky: looks wrong, but the story has an innocent explanation.
// mistakes: something is wrong, and `planted` says what a careful person would ask about.
export type CheckGroup = "clean" | "tricky" | "mistakes";
export type CheckSet = DemoSet & { group: CheckGroup };

export const HOSPITAL = "Riverside Women's Hospital";
export const OBSTETRICIAN = "Maple Grove Obstetrics and Midwifery";
export const PLAN = "Buckeye Health Plan";

const HEADINGS = {
  bill: "ITEMIZED STATEMENT",
  doctor: "STATEMENT OF PHYSICIAN SERVICES",
  eob: "EXPLANATION OF BENEFITS - THIS IS NOT A BILL",
} as const;

// One line of a paper. For an EOB, `eob` is [allowed, plan paid, you owe] in cents.
export const line = (date: string, code: string, description: string, billedCents: number, quantity = 1, eob?: [number, number, number]): PaperLine => ({
  date, code, description, quantity, billedCents,
  ...(eob ? { allowedCents: eob[0], planPaidCents: eob[1], owesCents: eob[2] } : {}),
});

type Spec = Omit<PaperSpec, "heading" | "patient"> & { patient?: string };

// Every paper is synthetic and marked SAMPLE by buildPaper, like the five sample sets.
export const paper = (name: string, kind: keyof typeof HEADINGS, spec: Spec) => ({
  name,
  text: buildPaper({ heading: HEADINGS[kind], patient: "Jane Sample", network: "In-network", ...spec }),
});
