import type { CaseFile, LineItem, ParsedDocument } from "@/contracts";
import { appealLetter } from "@content/letters/appeal-letter";
import { disclaimer } from "@content/letters/disclaimer";
import type { LetterBlock } from "../letter/letter-content";
import { fillTemplate } from "../shared/fill-template";
import { formatDate, formatMoney } from "../shared/format";
import { LetterError } from "../shared/group-findings";

const text = (value: string): LetterBlock => ({ style: "text", text: value });
const gap: LetterBlock = { style: "gap", text: "" };

// A service counts as not paid when the plan paid nothing toward a real charge.
export function unpaidLines(eob: ParsedDocument): LineItem[] {
  return eob.lines.filter((line) => line.amountCents > 0 && line.planPaidCents === 0);
}

export function buildAppealContent(caseFile: CaseFile, today: string): LetterBlock[][] {
  const eobs = caseFile.analysis.documents.filter((document) => document.kind === "insurance_eob");
  if (eobs.length === 0) throw new LetterError(appealLetter.noEob, appealLetter.noEobNextStep);
  const denied = eobs.map((eob) => ({ eob, lines: unpaidLines(eob) })).filter((item) => item.lines.length > 0);
  if (denied.length === 0) throw new LetterError(appealLetter.nothingDenied, appealLetter.nothingDeniedNextStep);

  const claimed = caseFile.analysis.findings.filter((finding) => caseFile.claimedFindingIds.includes(finding.id));
  return denied.map(({ eob, lines }) => {
    const issuedOn = formatDate(eob.issuedOn);
    const opening = issuedOn ? fillTemplate(appealLetter.opening, { provider: eob.provider, issuedOn }) : fillTemplate(appealLetter.openingNoDate, { provider: eob.provider });
    const total = lines.reduce((sum, line) => sum + line.amountCents, 0);
    const blocks: LetterBlock[] = [
      { style: "title", text: appealLetter.title }, text(formatDate(today)), gap,
      text(appealLetter.greeting), ...appealLetter.planBlanks.map(text), gap, text(opening), gap,
      { style: "heading", text: appealLetter.linesHeading },
      ...lines.map((line, index) =>
        text(`${index + 1}. ${fillTemplate(appealLetter.line, { description: [line.code, line.description].filter(Boolean).join(" "), billed: formatMoney(line.amountCents), paid: formatMoney(line.planPaidCents ?? 0) })}`),
      ),
      { style: "heading", text: fillTemplate(appealLetter.total, { total: formatMoney(total) }) }, gap,
    ];
    if (claimed.length > 0) {
      blocks.push({ style: "heading", text: appealLetter.findingsHeading });
      claimed.forEach((finding) => blocks.push(text(`- ${finding.title} (${formatMoney(finding.atStakeCents)} in question)`)));
      blocks.push(gap);
    }
    blocks.push(text(appealLetter.requestsIntro), ...appealLetter.requests.map((request, index) => text(`${index + 1}. ${request}`)), gap, text(appealLetter.closing), gap);
    blocks.push(...appealLetter.signature.map((line) => text(fillTemplate(line, { today: formatDate(today) }))), gap, { style: "small", text: disclaimer });
    return blocks;
  });
}
