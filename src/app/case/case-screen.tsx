"use client";

import { useEffect, useState } from "react";
import type { Analysis, CaseFile } from "@/contracts";
import { addDeadline, markOutcome } from "@/case-file";
import { Button } from "@/components/button/button";
import { WithHints } from "@/components/hint/with-hints";
import { NextStep } from "@/components/layout/next-step";
import { QuietState, Waiting } from "@/components/states/quiet-state";
import { readStored } from "../_session/storage";
import { caseFile as words } from "../_strings/case";
import { keepCase, openCase } from "./case-source";
import { ItemCard } from "./item-card";
import { PapersList } from "./papers-list";
import { ProgressCard } from "./progress-card";
import { Reminders } from "./reminders";

export function CaseScreen() {
  const [state, setState] = useState<{ ready: boolean; caseFile: CaseFile | null }>({ ready: false, caseFile: null });

  useEffect(() => {
    const opened = openCase(readStored<Analysis>("analysis"), readStored<string[]>("chosen"));
    if (opened) keepCase(opened);
    setState({ ready: true, caseFile: opened });
  }, []);

  // Every change is saved at once, so the screen can be left at any moment.
  function update(next: CaseFile) {
    keepCase(next);
    setState({ ready: true, caseFile: next });
  }

  const current = state.caseFile;
  if (!state.ready) return <Waiting text={words.loading} />;
  if (!current) {
    return (
      <QuietState title={words.emptyTitle} text={words.emptyText}>
        <Button href="/upload">{words.emptyAction}</Button>
      </QuietState>
    );
  }

  const items = current.analysis.findings.filter((finding) => current.claimedFindingIds.includes(finding.id));
  const toggleDone = (index: number) =>
    update({ ...current, deadlines: current.deadlines.map((deadline, at) => (at === index ? { ...deadline, done: !deadline.done } : deadline)) });

  return (
    <>
      <h1 className="text-3xl font-extrabold leading-tight">{words.title}</h1>
      <p className="text-xl text-ink-soft">{words.lead}</p>
      <ProgressCard caseFile={current} />
      {items.length > 0 && (
        <section className="flex flex-col gap-4" aria-labelledby="case-items">
          <h2 id="case-items" className="text-2xl font-extrabold">{words.itemsTitle}</h2>
          {items.map((finding) => (
            <ItemCard
              key={finding.id}
              finding={finding}
              outcome={current.outcomes.find((outcome) => outcome.findingId === finding.id) ?? { findingId: finding.id, status: "open" }}
              onMark={(status, savedCents) => update(markOutcome(current, finding.id, status, savedCents))}
            />
          ))}
        </section>
      )}
      <Reminders deadlines={current.deadlines} onAdd={(deadline) => update(addDeadline(current, deadline))} onToggle={toggleDone} />
      <PapersList papers={current.analysis.documents} />
      <p className="text-ink-soft"><WithHints text={words.nextNote} /></p>
      <NextStep>
        <Button href="/upload">{words.next}</Button>
        {items.length > 0 && <Button tone="quiet" href="/letter">{words.letter}</Button>}
      </NextStep>
    </>
  );
}
