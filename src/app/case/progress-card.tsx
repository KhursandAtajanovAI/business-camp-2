import type { CaseFile } from "@/contracts";
import { Card } from "@/components/card/card";
import { Sprout, sproutStage } from "@/design/illustrations";
import { formatMoney } from "../_format/format";
import { caseFile as words } from "../_strings/case";
import { caseProgress } from "./case-source";

// Progress as a growing sprout instead of a bar with percents.
export function ProgressCard({ caseFile }: { caseFile: CaseFile }) {
  const { total, closed, savedCents } = caseProgress(caseFile);
  return (
    <Card tone="calm" className="flex items-center gap-4">
      <Sprout stage={sproutStage(closed, total)} className="h-24 w-24 shrink-0" label={words.sproutLabel(closed, total)} />
      <div className="flex flex-col gap-1">
        <p className="text-xl font-extrabold">{total > 0 ? words.progress(closed, total) : words.progressNone}</p>
        {total > 0 && closed === total && <p>{words.allClosed}</p>}
        {savedCents > 0 && <p>{words.saved(formatMoney(savedCents))}</p>}
      </div>
    </Card>
  );
}
