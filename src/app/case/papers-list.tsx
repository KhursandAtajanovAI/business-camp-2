import type { ParsedDocument } from "@/contracts";
import { Card } from "@/components/card/card";
import { SampleTag } from "@/components/card/sample-tag";
import { WithHints } from "@/components/hint/with-hints";
import { formatDate, formatMoney, paperName } from "../_format/format";
import { caseFile as words } from "../_strings/case";

// All papers of this birth, one short row each.
export function PapersList({ papers }: { papers: ParsedDocument[] }) {
  return (
    <Card className="flex flex-col gap-2">
      <h2 className="text-2xl font-extrabold">{words.papersTitle}</h2>
      <ul>
        {papers.map((paper) => (
          <li key={paper.id} className="flex flex-col border-b-2 border-lavender-soft py-3 last:border-0">
            <span className="flex flex-wrap items-center gap-2 font-bold">
              <span><WithHints text={paperName(paper.kind)} /></span>
              {paper.isDemo && <SampleTag />}
            </span>
            <span className="text-ink-soft">{[paper.provider, formatDate(paper.issuedOn), formatMoney(paper.totalCents)].filter(Boolean).join(" · ")}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
