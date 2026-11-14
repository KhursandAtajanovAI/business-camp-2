// STUB (stage 0): returns the sample letter package. The real letters arrive in stage 2.
import type { Analysis, Finding, LetterPackage } from "@/contracts";
import { sampleLetterPackage } from "@/contracts/stubs";

export async function buildLetterPackage(_analysis: Analysis, _selected: Finding[]): Promise<LetterPackage> {
  return sampleLetterPackage;
}
