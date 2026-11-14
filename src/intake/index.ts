// STUB (stage 0): returns the sample document. The real intake arrives in stage 1.
import type { ParsedDocument } from "@/contracts";
import { sampleDocument } from "@/contracts/stubs";

export async function parseDocument(_input: File | string): Promise<ParsedDocument> {
  return sampleDocument;
}

export function redactPersonalData(text: string): string {
  return text; // STUB: nothing is hidden yet, do not send this text anywhere.
}
