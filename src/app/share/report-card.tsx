import { Card } from "@/components/card/card";
import { SampleTag } from "@/components/card/sample-tag";
import { Family } from "@/design/illustrations";
import { formatMoney } from "../_format/format";
import { share } from "../_strings/share";
import type { SharedReport } from "./share-report";

// The summary itself, the same for the person who shares and the person who opens the link.
export function ReportCard({ report }: { report: SharedReport }) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <Family className="h-16 w-24" />
        {report.sample && <SampleTag />}
      </div>
      <p className="text-2xl font-extrabold">{share.things(report.things)}</p>
      <div className="rounded-soft bg-amber-soft p-4">
        <p className="font-bold text-amber-deep">{share.money}</p>
        <p className="text-4xl font-extrabold">{formatMoney(report.cents)}</p>
      </div>
      <p>{share.papers(report.papers)} · {share.health(report.health)}</p>
    </Card>
  );
}
