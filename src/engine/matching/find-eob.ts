import type { ParsedDocument } from "@/contracts";

const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

// Finds the insurance explanation (EOB) that belongs to a bill: same provider, same patient.
// When there are several, the one that shares the most billing codes with the bill wins.
export function findEobFor(bill: ParsedDocument, documents: ParsedDocument[]): ParsedDocument | undefined {
  const billCodes = new Set(bill.lines.map((line) => line.code).filter(Boolean));
  const sharedCodes = (eob: ParsedDocument) => eob.lines.filter((line) => billCodes.has(line.code)).length;
  return documents
    .filter((document) => document.kind === "insurance_eob" && document.patientRole === bill.patientRole && normalize(document.provider) === normalize(bill.provider))
    .sort((first, second) => sharedCodes(second) - sharedCodes(first))[0];
}

export const planPaidTotal = (eob: ParsedDocument): number => eob.lines.reduce((sum, line) => sum + (line.planPaidCents ?? 0), 0);
