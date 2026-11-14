import type { Analysis } from "@/contracts";
import type { Lesson } from "@content/lessons/lessons";
import { countOf, formatMoney, paperName } from "../_format/format";
import { lessonWords as words } from "../_strings/lessons";
import { confidenceNames } from "../_strings/papers";

// Takes the facts a lesson needs from the person's own papers.
export function ownExample(analysis: Analysis, isSample: boolean): Record<string, string> {
  const whose = isSample ? words.whose.sample : words.whose.own;
  const paper = analysis.documents.find((document) => document.kind !== "insurance_eob") ?? analysis.documents[0];
  const line = paper.lines[0];
  const lineSum = paper.lines.reduce((sum, item) => sum + item.amountCents, 0);
  const eob = analysis.documents.find((document) => document.kind === "insurance_eob");
  const finding = analysis.findings[0];
  return {
    whose,
    provider: paper.provider,
    lineDescription: line.description,
    lineQuantity: String(line.quantity),
    lineAmount: formatMoney(line.amountCents),
    lineCodeNote: line.code ? words.codeNote(line.code) : words.noCodeNote,
    lineCount: countOf(paper.lines.length, "line", "lines"),
    lineSum: formatMoney(lineSum),
    total: formatMoney(paper.totalCents),
    totalVerdict: lineSum === paper.totalCents ? words.totalMatch : words.totalGap(formatMoney(Math.abs(paper.totalCents - lineSum))),
    eobVerdict: eob ? words.eobYes(whose, eob.provider) : words.eobNo(whose),
    findingVerdict: finding
      ? words.findingYes(whose, finding.title, formatMoney(finding.atStakeCents), confidenceNames[finding.confidence])
      : words.findingNo(whose),
    paperCount: countOf(analysis.documents.length, "paper", "papers"),
    paperList: analysis.documents.map((document) => paperName(document.kind).toLowerCase()).join(", "),
  };
}

// Puts the facts into the {{places}} of a lesson. An unknown place is left out quietly.
export function fillLesson(lesson: Lesson, facts: Record<string, string>): Lesson {
  const fill = (text: string) => text.replace(/\{\{(\w+)\}\}/g, (_, name: string) => facts[name] ?? "");
  return { ...lesson, body: lesson.body.map(fill), takeaway: fill(lesson.takeaway) };
}
