import type { ReactNode } from "react";
import { WithHints } from "@/components/hint/with-hints";
import { common } from "@/app/_strings/common";

// The next step of a screen: one sentence about what happens next, then the main button
// within reach of a thumb. While it is further down the page, the button waits at the
// bottom of the screen, so it is never out of sight.
export function NextStep({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <>
      {note && (
        <p className="text-ink-soft">
          <span className="font-bold">{common.whatNext}: </span>
          <WithHints text={note} />
        </p>
      )}
      <div className="sticky bottom-0 z-10 -mx-5 flex flex-col gap-3 bg-cream/95 px-5 py-3 sm:flex-row sm:items-center">{children}</div>
    </>
  );
}
