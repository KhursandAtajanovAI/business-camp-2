// The only file other modules import from letters.
import type { Analysis, Finding, LetterPackage } from "@/contracts";
import { explainFinding } from "@/explain";
import { buildCallScript } from "./call-script/build-call-script";
import { buildLetterContent } from "./letter/letter-content";
import { renderLettersPdf } from "./letter/letter-pdf";
import { pdfToDataUrl } from "./letter/pdf-url";
import { todayIso } from "./shared/format";
import { groupFindings } from "./shared/group-findings";

export { LetterError } from "./shared/group-findings";

// Builds everything a parent needs to act on the chosen findings:
// a claim letter as a downloadable PDF link and a call script.
// Throws a LetterError with a kind message when nothing is chosen.
export async function buildLetterPackage(analysis: Analysis, selected: Finding[]): Promise<LetterPackage> {
  const groups = groupFindings(analysis, selected);
  const options = { today: todayIso(), explain: explainFinding };
  const pdf = await renderLettersPdf(groups.map((group) => buildLetterContent(group, options)));
  return {
    letterPdfUrl: pdfToDataUrl(pdf),
    callScript: buildCallScript(groups),
    escalationSteps: [], // filled in stage 3 (package H8)
  };
}
