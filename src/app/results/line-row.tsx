"use client";

import { useState } from "react";
import type { LineItem } from "@/contracts";
import { Button } from "@/components/button/button";
import { formatMoney } from "../_format/format";
import { readDollars, type LineEdit } from "../_pipeline/edit-line";
import { results } from "../_strings/results";

const field = "min-h-12 w-full rounded-soft border-2 border-lavender bg-surface px-4";

// One line of a paper. "Change" opens two fields; saving hands the correction back.
export function LineRow({ line, onSave }: { line: LineItem; onSave: (edit: LineEdit) => void }) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState(line.description);
  const [dollars, setDollars] = useState((line.amountCents / 100).toFixed(2));
  const [unclear, setUnclear] = useState(false);

  function save() {
    const amountCents = readDollars(dollars);
    if (amountCents === null) return setUnclear(true);
    onSave({ description: description.trim() || line.description, amountCents });
    setUnclear(false);
    setOpen(false);
  }

  if (!open) {
    return (
      <li className="flex flex-wrap items-center justify-between gap-x-3 border-b-2 border-lavender-soft py-2 last:border-0">
        <span className="min-w-0 flex-1 basis-40">{line.description}</span>
        <span className="font-bold">{formatMoney(line.amountCents)}</span>
        <button type="button" onClick={() => setOpen(true)} aria-label={`${results.change}: ${line.description}`} className="min-h-12 px-2 font-bold text-lavender-deep underline decoration-lavender decoration-2 underline-offset-4">
          {results.change}
        </button>
      </li>
    );
  }
  return (
    <li className="border-b-2 border-lavender-soft py-3 last:border-0">
      <form className="flex flex-col gap-2" onSubmit={(event) => { event.preventDefault(); save(); }}>
        <label htmlFor={`name-${line.id}`} className="font-bold">{results.lineName}</label>
        <input id={`name-${line.id}`} value={description} onChange={(event) => setDescription(event.target.value)} maxLength={120} className={field} />
        <label htmlFor={`amount-${line.id}`} className="font-bold">{results.lineAmount}</label>
        <input id={`amount-${line.id}`} inputMode="decimal" value={dollars} onChange={(event) => setDollars(event.target.value)} className={field} />
        {unclear && <p role="status" className="rounded-soft bg-amber-soft p-3">{results.lineHint}</p>}
        <Button type="submit" tone="second">{results.lineSave}</Button>
        <Button tone="quiet" onClick={() => setOpen(false)}>{results.lineCancel}</Button>
      </form>
    </li>
  );
}
