"use client";

import { useState } from "react";
import type { Analysis } from "@/contracts";
import { Button } from "@/components/button/button";
import { Card } from "@/components/card/card";
import { NextStep } from "@/components/layout/next-step";
import { QuietState, Waiting } from "@/components/states/quiet-state";
import { useStored } from "../_session/use-stored";
import { share } from "../_strings/share";
import { states } from "../_strings/states";
import { ReportCard } from "./report-card";
import { makeReport, reportPath } from "./share-report";

// For the person who shares: a preview, what is left out, and one button.
export function MakeShare() {
  const { value: analysis, ready } = useStored<Analysis>("analysis");
  const [copied, setCopied] = useState(false);
  if (!ready) return <Waiting text={states.loading} />;
  if (!analysis) {
    return (
      <QuietState title={share.emptyTitle} text={share.emptyText}>
        <Button href="/upload">{share.emptyAction}</Button>
      </QuietState>
    );
  }
  const report = makeReport(analysis);
  const link = `${window.location.origin}${reportPath(report)}`;

  async function send() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      setCopied(false); // copying is not allowed in this browser: the link is on screen to copy by hand
    }
  }

  return (
    <>
      <h1 className="text-3xl font-extrabold leading-tight">{share.title}</h1>
      <p className="text-xl text-ink-soft">{share.lead}</p>
      <h2 className="text-2xl font-extrabold">{share.previewTitle}</h2>
      <ReportCard report={report} />
      <Card tone="hint" className="flex flex-col gap-2">
        <h2 className="text-xl font-extrabold">{share.leftOutTitle}</h2>
        <ul className="list-disc pl-5">{share.leftOut.map((item) => <li key={item}>{item}</li>)}</ul>
      </Card>
      <label htmlFor="share-link" className="font-bold">{share.linkLabel}</label>
      <input id="share-link" readOnly value={link} onFocus={(event) => event.target.select()} className="min-h-12 w-full rounded-soft border-2 border-lavender bg-surface px-4" />
      <NextStep>
        <Button onClick={send}>{copied ? share.copied : share.copy}</Button>
      </NextStep>
    </>
  );
}
