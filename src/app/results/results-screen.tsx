"use client";

import type { Analysis } from "@/contracts";
import { Button } from "@/components/button/button";
import { QuietState, Waiting } from "@/components/states/quiet-state";
import { useStored } from "../_session/use-stored";
import { results } from "../_strings/results";
import { SummaryCard } from "./summary-card";

export function ResultsScreen() {
  const { value: analysis, ready } = useStored<Analysis>("analysis");
  if (!ready) return <Waiting text={results.loading} />;
  if (!analysis) {
    return (
      <QuietState title={results.emptyTitle} text={results.emptyText}>
        <Button href="/upload">{results.emptyAction}</Button>
      </QuietState>
    );
  }
  return <SummaryCard analysis={analysis} />;
}
