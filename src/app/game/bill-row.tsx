import type { ReactNode } from "react";

export type RowState = "untouched" | "fine" | "found";

const looks: Record<RowState, string> = {
  untouched: "bg-surface hover:bg-lavender-soft",
  fine: "bg-sage-soft",
  found: "bg-amber-soft",
};

type BillRowProps = { state: RowState; onTap: () => void; left: ReactNode; right: string; note?: string };

// One tappable line of the made-up bill. After a tap it answers in a sentence:
// amber with the explanation for a find, sage with "looks fine" otherwise.
export function BillRow({ state, onTap, left, right, note }: BillRowProps) {
  return (
    <li>
      <button
        type="button"
        onClick={onTap}
        aria-pressed={state !== "untouched"}
        className={`flex min-h-12 w-full flex-col gap-1 rounded-soft border-2 border-lavender-soft px-4 py-3 text-left ${looks[state]}`}
      >
        <span className="flex w-full justify-between gap-3">
          <span className="break-words">{left}</span>
          <span className="shrink-0 font-bold">{right}</span>
        </span>
        {note && <span role="status" className="font-bold">{note}</span>}
      </button>
    </li>
  );
}
