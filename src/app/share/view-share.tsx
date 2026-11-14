import { Button } from "@/components/button/button";
import { NextStep } from "@/components/layout/next-step";
import { share } from "../_strings/share";
import { ReportCard } from "./report-card";
import type { SharedReport } from "./share-report";

// For the person who opens a shared link: the numbers, an honest note, and a way to try it.
export function ViewShare({ report }: { report: SharedReport }) {
  return (
    <>
      <h1 className="text-3xl font-extrabold leading-tight">{share.viewerTitle}</h1>
      <p className="text-xl text-ink-soft">{report.sample ? share.viewerSample : share.viewerLead}</p>
      <ReportCard report={report} />
      <p className="text-ink-soft">{share.viewerNote}</p>
      <NextStep>
        <Button href="/upload">{share.viewerAction}</Button>
        <Button tone="quiet" href="/">{share.viewerSecond}</Button>
      </NextStep>
    </>
  );
}
