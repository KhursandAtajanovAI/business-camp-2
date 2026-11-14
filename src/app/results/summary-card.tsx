import type { Analysis } from "@/contracts";
import { Card } from "@/components/card/card";
import { SampleTag } from "@/components/card/sample-tag";
import { countOf, formatMoney } from "../_format/format";
import { results } from "../_strings/results";

// The first thing a parent sees: how many things are worth asking about and the money in question.
export function SummaryCard({ analysis }: { analysis: Analysis }) {
  const count = analysis.findings.length;
  const isSample = analysis.documents.some((document) => document.isDemo);
  return (
    <Card className="flex flex-col gap-3">
      {isSample && <div><SampleTag /></div>}
      <h1 className="text-3xl font-extrabold leading-tight">{count > 0 ? results.foundTitle(count) : results.calmTitle}</h1>
      {count > 0 ? (
        <div className="rounded-soft bg-amber-soft p-4">
          <p className="font-bold text-amber-deep">{results.moneyLabel}</p>
          <p className="text-4xl font-extrabold">{formatMoney(analysis.totalAtStakeCents)}</p>
          <p className="mt-1">{results.moneyNote}</p>
        </div>
      ) : (
        <p>{results.calmText}</p>
      )}
      <p className="text-ink-soft">{results.papersRead(countOf(analysis.documents.length, "paper", "papers"))}</p>
    </Card>
  );
}
