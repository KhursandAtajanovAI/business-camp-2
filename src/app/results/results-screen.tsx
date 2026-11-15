"use client";

import type { Analysis } from "@/contracts";
import { Button } from "@/components/button/button";
import { Card } from "@/components/card/card";
import { NextStep } from "@/components/layout/next-step";
import { QuietState, Waiting } from "@/components/states/quiet-state";
import { formatMoney } from "../_format/format";
import { useStored } from "../_session/use-stored";
import { results } from "../_strings/results";
import { writeStored } from "../_session/storage";
import { FindingCard } from "./finding-card";
import { HelperCard } from "./helper-card";
import { LinesEditor } from "./lines-editor";
import { SummaryCard } from "./summary-card";

export function ResultsScreen() {
  const { value: analysis, ready, save: saveAnalysis } = useStored<Analysis>("analysis");
  const chosen = useStored<string[]>("chosen");
  if (!ready || !chosen.ready) return <Waiting text={results.loading} />;
  if (!analysis) {
    return (
      <QuietState title={results.emptyTitle} text={results.emptyText}>
        <Button href="/upload">{results.emptyAction}</Button>
      </QuietState>
    );
  }

  // Until the person unticks something, every finding goes into the letter.
  const chosenIds = chosen.value ?? analysis.findings.map((finding) => finding.id);
  const chosenFindings = analysis.findings.filter((finding) => chosenIds.includes(finding.id));
  const chosenCents = chosenFindings.reduce((sum, finding) => sum + finding.atStakeCents, 0);
  const toggle = (id: string) => chosen.save(chosenIds.includes(id) ? chosenIds.filter((other) => other !== id) : [...chosenIds, id]);

  // A corrected line gives a fresh check: finding ids may change, so the ticks start over.
  // The person's own papers are kept in step, so the upload screen shows the same lines.
  const recount = (next: Analysis) => {
    saveAnalysis(next);
    chosen.save(null);
    if (next.documents.every((document) => !document.isDemo)) writeStored("papers", next.documents);
  };

  if (analysis.findings.length === 0) {
    return (
      <>
        <SummaryCard analysis={analysis} />
        <LinesEditor analysis={analysis} onChange={recount} />
        <NextStep>
          <Button href="/upload">{results.calmNext}</Button>
        </NextStep>
      </>
    );
  }
  return (
    <>
      <SummaryCard analysis={analysis} />
      <section className="flex flex-col gap-4" aria-labelledby="findings">
        <h2 id="findings" className="text-2xl font-extrabold">{results.findingsTitle}</h2>
        <p className="text-ink-soft">{results.chooseNote}</p>
        {analysis.findings.map((finding) => (
          <FindingCard
            key={finding.id}
            finding={finding}
            paper={analysis.documents.find((document) => document.id === finding.documentId)}
            chosen={chosenIds.includes(finding.id)}
            onToggle={() => toggle(finding.id)}
          />
        ))}
      </section>
      <LinesEditor analysis={analysis} onChange={recount} />
      <HelperCard analysis={analysis} />
      <Card tone="hint" className="flex flex-col gap-2">
        <h2 className="text-xl font-extrabold">{results.lessonTitle}</h2>
        <p>{results.lessonText}</p>
        <Button tone="quiet" href="/lessons">{results.lessonLink}</Button>
        <Button tone="quiet" href="/share">{results.shareLink}</Button>
      </Card>
      <p role="status" className="font-bold">
        {chosenFindings.length > 0 ? results.chosenSummary(chosenFindings.length, formatMoney(chosenCents)) : results.noneChosen}
      </p>
      <NextStep note={results.nextNote}>
        {chosenFindings.length > 0 && <Button href="/letter">{results.next}</Button>}
        <Button tone="second" href="/upload">{results.addPaper}</Button>
      </NextStep>
    </>
  );
}
