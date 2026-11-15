import type { ParsedDocument } from "@/contracts";

// Words that say nothing about who the provider is.
const FILLER = new Set(["inc", "llc", "pllc", "pc", "pa", "ltd", "corp", "co", "the", "of", "and"]);
const words = (name: string) =>
  name.toLowerCase().replace(/['\u2019]/g, "").split(/[^a-z0-9]+/).filter((word) => word !== "" && !FILLER.has(word));
// "hosp" stands for "hospital": one word may be the start of the other, if it is long enough to mean something.
const sameWord = (first: string, second: string) =>
  first === second || (Math.min(first.length, second.length) >= 3 && (first.startsWith(second) || second.startsWith(first)));

// An insurance plan rarely prints a provider's name the way the provider does
// ("Riverside Womens Hosp Inc" for "Riverside Women's Hospital"). Two names are the same
// provider when they are equal, or when every word of the shorter one is in the longer one.
export function sameProvider(first: string, second: string): boolean {
  const [short, long] = [words(first), words(second)].sort((one, other) => one.length - other.length);
  if (short.length === 0) return false;
  if (short.join(" ") === long.join(" ")) return true;
  return short.length >= 2 && short.every((word) => long.some((other) => sameWord(word, other)));
}

// Finds the insurance explanation (EOB) that belongs to a bill: same provider, same patient.
// When there are several, the one that shares the most billing codes with the bill wins,
// and between equals the newest one, because a plan may correct an earlier explanation.
export function findEobFor(bill: ParsedDocument, documents: ParsedDocument[]): ParsedDocument | undefined {
  const billCodes = new Set(bill.lines.map((line) => line.code).filter(Boolean));
  const sharedCodes = (eob: ParsedDocument) => eob.lines.filter((line) => billCodes.has(line.code)).length;
  return documents
    .filter((document) => document.kind === "insurance_eob" && document.patientRole === bill.patientRole && sameProvider(document.provider, bill.provider))
    .sort((first, second) => sharedCodes(second) - sharedCodes(first) || second.issuedOn.localeCompare(first.issuedOn))[0];
}

// The other way round: the bill an insurance explanation belongs to, if the family has it.
export function findBillFor(eob: ParsedDocument, documents: ParsedDocument[]): ParsedDocument | undefined {
  return documents.find((document) => document.kind !== "insurance_eob" && findEobFor(document, documents) === eob);
}

export const planPaidTotal = (eob: ParsedDocument): number => eob.lines.reduce((sum, line) => sum + (line.planPaidCents ?? 0), 0);
