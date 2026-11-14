export type PaperLine = {
  date: string; // MM/DD/YYYY, as printed on US papers
  code: string;
  description: string;
  quantity: number;
  billedCents: number;
  // EOB columns
  allowedCents?: number;
  planPaidCents?: number;
  owesCents?: number;
};

export type PaperSpec = {
  heading: "ITEMIZED STATEMENT" | "STATEMENT OF PHYSICIAN SERVICES" | "EXPLANATION OF BENEFITS - THIS IS NOT A BILL";
  sender: string; // provider on a bill, health plan on an EOB
  provider?: string; // EOB only: whose claim this is
  patient: string;
  date: string; // statement date or date processed
  network?: "In-network" | "Out-of-network";
  lines: PaperLine[];
  paidAndAdjustedCents?: number; // bills only
  amountDueCents?: number; // bills only; defaults to total minus payments
};

export type PlantedMistake = { ruleId: string; note: string; atStakeCents: number };

export type DemoSet = {
  id: string;
  title: string;
  story: string;
  papers: { name: string; text: string }[];
  planted: PlantedMistake[];
};
