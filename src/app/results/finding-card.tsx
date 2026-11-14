import type { Finding, ParsedDocument } from "@/contracts";
import { explainFinding } from "@/explain";
import { Card } from "@/components/card/card";
import { WithHints } from "@/components/hint/with-hints";
import { formatMoney, paperName } from "../_format/format";
import { confidenceNames } from "../_strings/papers";
import { results } from "../_strings/results";

type FindingCardProps = { finding: Finding; paper?: ParsedDocument; chosen: boolean; onToggle: () => void };

// One soft card per finding: what we noticed, the amount, how sure we are, and why.
// Amber and calm words only. The tick decides whether it goes into the letter.
export function FindingCard({ finding, paper, chosen, onToggle }: FindingCardProps) {
  const lines = paper?.lines.filter((line) => finding.lineIds.includes(line.id)) ?? [];
  const explanation = explainFinding(finding);
  return (
    <Card tone="notice" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-amber-soft px-3 py-1 font-bold text-amber-deep">{confidenceNames[finding.confidence]}</span>
        {paper && <span className="text-ink-soft">{results.onPaper(paperName(paper.kind), paper.provider)}</span>}
      </div>
      <h3 className="text-xl font-extrabold"><WithHints text={finding.title} /></h3>
      {explanation !== finding.title && <p><WithHints text={explanation} /></p>}
      <p>
        <span className="text-ink-soft">{results.amountLabel}: </span>
        <span className="text-2xl font-extrabold">{formatMoney(finding.atStakeCents)}</span>
      </p>
      {lines.length > 0 && (
        <div>
          <p className="text-ink-soft">{results.linesLabel}</p>
          <ul className="mt-1 flex flex-col gap-1">
            {lines.map((line) => (
              <li key={line.id} className="flex justify-between gap-3 rounded-soft bg-cream px-3 py-2">
                <span className="break-words">{[line.code, line.description].filter(Boolean).join(" · ")}</span>
                <span className="shrink-0 font-bold">{formatMoney(line.amountCents)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p><span className="font-bold">{results.whyLabel}: </span><WithHints text={finding.sourceNote} /></p>
      <label className="tap flex min-h-12 cursor-pointer items-center gap-3 rounded-soft bg-lavender-soft px-4 font-bold">
        <input type="checkbox" checked={chosen} onChange={onToggle} className="h-6 w-6 accent-lavender-deep" />
        {results.include}
      </label>
    </Card>
  );
}
