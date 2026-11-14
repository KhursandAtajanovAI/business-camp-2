import type { Finding } from "@/contracts";
import { claimLetter } from "@content/letters/claim-letter";
import { disclaimer } from "@content/letters/disclaimer";
import { fillTemplate } from "../shared/fill-template";
import { formatDate, formatMoney } from "../shared/format";
import { describeLines, type FindingGroup } from "../shared/group-findings";

export type LetterBlock = { style: "title" | "heading" | "text" | "small" | "gap"; text: string };

type Options = { today: string; explain: (finding: Finding) => string };

const text = (value: string): LetterBlock => ({ style: "text", text: value });
const gap: LetterBlock = { style: "gap", text: "" };

// One letter for one billing office. Amounts come straight from the findings.
export function buildLetterContent(group: FindingGroup, options: Options): LetterBlock[] {
  const { document, findings } = group;
  const issuedOn = formatDate(document.issuedOn);
  const blocks: LetterBlock[] = [
    { style: "title", text: claimLetter.title },
    text(formatDate(options.today)),
    gap,
    text(fillTemplate(claimLetter.greeting, { provider: document.provider })),
    gap,
    text(issuedOn ? fillTemplate(claimLetter.opening, { issuedOn }) : claimLetter.openingNoDate),
    gap,
  ];

  findings.forEach((finding, index) => {
    blocks.push({ style: "heading", text: fillTemplate(claimLetter.findingHeading, { number: index + 1, title: finding.title }) });
    blocks.push(text(fillTemplate(claimLetter.findingAmount, { amount: formatMoney(finding.atStakeCents) })));
    const lines = describeLines(document, finding);
    if (lines) blocks.push(text(fillTemplate(claimLetter.findingLines, { lines })));
    blocks.push(text(fillTemplate(claimLetter.findingReason, { reason: options.explain(finding) })));
    blocks.push(gap);
  });

  const total = findings.reduce((sum, finding) => sum + finding.atStakeCents, 0);
  blocks.push({ style: "heading", text: fillTemplate(claimLetter.total, { total: formatMoney(total) }) });
  blocks.push(gap, text(claimLetter.requestsIntro));
  claimLetter.requests.forEach((request, index) => blocks.push(text(`${index + 1}. ${request}`)));
  blocks.push(gap, text(claimLetter.closing), gap);
  claimLetter.signature.forEach((line) => blocks.push(text(fillTemplate(line, { today: formatDate(options.today) }))));
  blocks.push(gap, { style: "small", text: disclaimer });
  return blocks;
}
