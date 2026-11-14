"use client";

import type { Analysis } from "@/contracts";
import { Button } from "@/components/button/button";
import { NextStep } from "@/components/layout/next-step";
import { QuietState, Waiting } from "@/components/states/quiet-state";
import { formatMoney } from "../_format/format";
import { useStored } from "../_session/use-stored";
import { results } from "../_strings/results";
import { FindingCard } from "./finding-card";
import { SummaryCard } from "./summary-card";

export function ResultsScreen() {
  const { value: analysis, ready } = useStored<Analysis>("analysis");
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

  if (analysis.findings.length === 0) {
    return (
      <>
        <SummaryCard analysis={analysis} />
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
