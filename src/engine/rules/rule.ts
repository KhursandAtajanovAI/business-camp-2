import type { Confidence, ParsedDocument } from "@/contracts";

// What a rule returns. The runner adds the id, the rule id and the source.
export type RuleFinding = { documentId: string; lineIds: string[]; title: string; atStakeCents: number; confidence: Confidence };

// Every rule gets all papers of the family, so a rule may compare papers with each other.
export type Rule = { id: string; check: (documents: ParsedDocument[]) => RuleFinding[] };

export const isBill = (document: ParsedDocument): boolean => document.kind !== "insurance_eob";

export function usd(cents: number): string {
  return `$${Math.floor(cents / 100).toLocaleString("en-US")}.${String(cents % 100).padStart(2, "0")}`;
}

// "2026-03-14" is shown the way US papers print it: 03/14/2026.
export function usDate(isoDate: string | undefined): string {
  const match = isoDate?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[2]}/${match[3]}/${match[1]}` : "";
}
