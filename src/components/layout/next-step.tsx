import { Children, type ReactNode } from "react";
import { WithHints } from "@/components/hint/with-hints";
import { common } from "@/app/_strings/common";

// The next step of a screen: one sentence about what happens next, then the buttons.
// The first button is the main one. While it is further down the page it waits at the
// bottom of the screen, within reach of a thumb. Quieter choices follow below it.
export function NextStep({ children, note }: { children: ReactNode; note?: string }) {
  const [main, ...quieter] = Children.toArray(children);
  return (
    <>
      {note && (
        <p className="text-ink-soft">
          <span className="font-bold">{common.whatNext}: </span>
          <WithHints text={note} />
        </p>
      )}
      <div className="sticky bottom-0 z-10 -mx-5 flex flex-col gap-3 bg-cream px-5 py-3">{main}</div>
      {quieter.length > 0 && <div className="flex flex-col gap-3 sm:flex-row sm:items-center">{quieter}</div>}
    </>
  );
}
