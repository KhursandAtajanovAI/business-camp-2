import { gameBill, gameWords as words } from "@content/lessons/game";
import { Card } from "@/components/card/card";
import { SampleTag } from "@/components/card/sample-tag";
import { formatMoney } from "../_format/format";
import { BillRow, type RowState } from "./bill-row";

export const TOTAL_ID = "total";
export const clueIds = [...gameBill.rows.filter((row) => row.clue).map((row) => row.id), TOTAL_ID];

type GameBoardProps = { tapped: string[]; onTap: (id: string) => void };

// The made-up bill itself: every line and the total can be tapped.
export function GameBoard({ tapped, onTap }: GameBoardProps) {
  const stateOf = (id: string): RowState => (!tapped.includes(id) ? "untouched" : clueIds.includes(id) ? "found" : "fine");
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <SampleTag />
        <span className="font-extrabold">{gameBill.provider}</span>
      </div>
      <p className="text-ink-soft">{gameBill.stay}</p>
      <ul className="flex flex-col gap-2">
        {gameBill.rows.map((row) => {
          const state = stateOf(row.id);
          return (
            <BillRow
              key={row.id}
              state={state}
              onTap={() => onTap(row.id)}
              left={<>{row.date} · {row.description}<br /><span className="text-ink-soft">{row.quantity} × {formatMoney(row.unitCents)} {words.each}</span></>}
              right={formatMoney(row.amountCents)}
              note={state === "found" ? row.clue?.found : state === "fine" ? words.fine : undefined}
            />
          );
        })}
        <BillRow
          state={stateOf(TOTAL_ID)}
          onTap={() => onTap(TOTAL_ID)}
          left={<span className="font-extrabold">{words.total}</span>}
          right={formatMoney(gameBill.statedTotalCents)}
          note={tapped.includes(TOTAL_ID) ? gameBill.totalClue.found : undefined}
        />
      </ul>
    </Card>
  );
}

// The hint for the first thing not found yet.
export function nextHint(tapped: string[]): string | null {
  const missing = clueIds.find((id) => !tapped.includes(id));
  if (!missing) return null;
  return missing === TOTAL_ID ? gameBill.totalClue.hint : gameBill.rows.find((row) => row.id === missing)?.clue?.hint ?? null;
}
