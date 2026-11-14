"use client";

import { useState } from "react";
import type { CaseFile, Finding } from "@/contracts";
import { Button } from "@/components/button/button";
import { Card } from "@/components/card/card";
import { WithHints } from "@/components/hint/with-hints";
import { formatMoney } from "../_format/format";
import { caseFile as words } from "../_strings/case";

type Outcome = CaseFile["outcomes"][number];
type ItemCardProps = { finding: Finding; outcome: Outcome; onMark: (status: Outcome["status"], savedCents?: number) => void };

const statusWords = { open: words.open, won: words.won, lost: words.lost };

// One thing the family is asking about, and how it ended. A closed item gets a small, warm note.
export function ItemCard({ finding, outcome, onMark }: ItemCardProps) {
  const [asking, setAsking] = useState(false);
  const [dollars, setDollars] = useState((finding.atStakeCents / 100).toFixed(2));
  const inputId = `saved-${finding.id}`;

  function saveWon() {
    const cents = Math.max(0, Math.round(Number(dollars) * 100)) || 0;
    onMark("won", cents);
    setAsking(false);
  }

  return (
    <Card tone={outcome.status === "open" ? "notice" : "plain"} className="flex flex-col gap-3">
      <span className={`self-start rounded-full px-3 py-1 font-bold ${outcome.status === "won" ? "bg-sage-soft text-sage-deep" : "bg-amber-soft text-amber-deep"}`}>
        {statusWords[outcome.status]}
      </span>
      <h3 className="text-xl font-extrabold"><WithHints text={finding.title} /></h3>
      <p className="text-ink-soft">{formatMoney(finding.atStakeCents)}</p>
      {outcome.status === "won" && <p role="status" className="rounded-soft bg-sage-soft p-3">{words.wonCheer}</p>}
      {outcome.status === "lost" && <p role="status" className="rounded-soft bg-lavender-soft p-3">{words.lostNote}</p>}
      {asking && (
        <form className="flex flex-col gap-2" onSubmit={(event) => { event.preventDefault(); saveWon(); }}>
          <label htmlFor={inputId} className="font-bold">{words.savedQuestion}</label>
          <input id={inputId} inputMode="decimal" value={dollars} onChange={(event) => setDollars(event.target.value)} className="min-h-12 rounded-soft border-2 border-lavender bg-surface px-4" />
          <Button type="submit" tone="second">{words.savedSave}</Button>
        </form>
      )}
      {outcome.status === "open" && !asking && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button tone="second" onClick={() => setAsking(true)}>{words.markWon}</Button>
          <Button tone="second" onClick={() => onMark("lost")}>{words.markLost}</Button>
        </div>
      )}
      {outcome.status !== "open" && <Button tone="quiet" onClick={() => onMark("open")}>{words.reopen}</Button>}
    </Card>
  );
}
