"use client";

import { useState } from "react";
import type { Analysis } from "@/contracts";
import { Button } from "@/components/button/button";
import { Card } from "@/components/card/card";
import { formatMoney, paperName } from "../_format/format";
import { checkPapers } from "../_pipeline/check-papers";
import { editLine, type LineEdit } from "../_pipeline/edit-line";
import { results } from "../_strings/results";
import { LineRow } from "./line-row";

// Lets a person correct what we read. After every correction the engine checks all
// the papers again, so the money in question is always counted from the current lines.
export function LinesEditor({ analysis, onChange }: { analysis: Analysis; onChange: (next: Analysis) => void }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  function correct(documentId: string, lineId: string, edit: LineEdit) {
    const next = checkPapers(editLine(analysis.documents, documentId, lineId, edit));
    onChange(next);
    setNote(results.recounted(formatMoney(next.totalAtStakeCents)));
  }

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-2xl font-extrabold">{results.linesTitle}</h2>
      <p className="text-ink-soft">{results.linesLead}</p>
      {note && <p role="status" className="rounded-soft bg-sage-soft p-3 font-bold">{note}</p>}
      {open &&
        analysis.documents.map((paper) => (
          <section key={paper.id} aria-label={paperName(paper.kind)}>
            <h3 className="font-extrabold text-lavender-deep">{paperName(paper.kind)}</h3>
            <ul>
              {paper.lines.map((line) => (
                <LineRow key={`${line.id}-${line.description}-${line.amountCents}`} line={line} onSave={(edit) => correct(paper.id, line.id, edit)} />
              ))}
            </ul>
          </section>
        ))}
      <Button tone="second" onClick={() => setOpen(!open)}>{open ? results.linesClose : results.linesOpen}</Button>
    </Card>
  );
}
