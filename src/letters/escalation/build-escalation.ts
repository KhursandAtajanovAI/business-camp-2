import type { Analysis, Finding, LetterPackage } from "@/contracts";
import { escalation } from "@content/letters/escalation";

// Insurance steps appear only when the case has an insurance paper,
// and the surprise-bill step only when a chosen paper is out of network.
export function buildEscalationSteps(analysis: Analysis, selected: Finding[]): LetterPackage["escalationSteps"] {
  const chosenPapers = analysis.documents.filter((document) => selected.some((finding) => finding.documentId === document.id));
  const hasInsurancePaper = analysis.documents.some((document) => document.kind === "insurance_eob");
  const hasOutOfNetwork = chosenPapers.some((document) => document.network === "out_of_network");

  const texts = [
    ...escalation.always,
    ...(hasInsurancePaper ? escalation.insurance : []),
    ...(hasOutOfNetwork ? [escalation.outOfNetwork] : []),
    escalation.last,
  ];
  return texts.map((text, index) => ({ step: index + 1, text }));
}
