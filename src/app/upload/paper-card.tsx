import type { ParsedDocument } from "@/contracts";
import { Card } from "@/components/card/card";
import { SampleTag } from "@/components/card/sample-tag";
import { formatDate, formatMoney, paperName } from "../_format/format";
import { upload } from "../_strings/upload";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-x-4 border-b-2 border-lavender-soft py-2 last:border-0">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="font-bold">{value}</dd>
    </div>
  );
}

// What we understood from one paper, so the person can see we read it right.
export function PaperCard({ paper, onRemove }: { paper: ParsedDocument; onRemove?: () => void }) {
  return (
    <Card className="flex flex-col gap-2">
      {paper.isDemo && <div><SampleTag /></div>}
      <h2 className="text-xl font-extrabold">{paperName(paper.kind)}</h2>
      <dl>
        <Row label={upload.provider} value={paper.provider || upload.unknownProvider} />
        {paper.issuedOn && <Row label={upload.issued} value={formatDate(paper.issuedOn)} />}
        <Row label={upload.lines} value={String(paper.lines.length)} />
        <Row label={upload.total} value={formatMoney(paper.totalCents)} />
      </dl>
      {paper.needsReview && paper.needsReview.length > 0 && (
        <div className="rounded-soft bg-amber-soft p-4">
          <p className="font-bold text-amber-deep">{upload.reviewTitle}</p>
          <ul className="mt-1 list-disc pl-5">
            {paper.needsReview.map((note) => <li key={note} className="break-words">{note}</li>)}
          </ul>
        </div>
      )}
      {onRemove && (
        <button type="button" onClick={onRemove} className="min-h-12 self-start font-bold text-lavender-deep underline decoration-lavender decoration-2 underline-offset-4">
          {upload.remove}
        </button>
      )}
    </Card>
  );
}
