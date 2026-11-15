"use client";

import { Button } from "@/components/button/button";
import { QuietState } from "@/components/states/quiet-state";
import { nunito } from "@/design/font";
import { states } from "./_strings/states";
import "./globals.css";

// The framework requires this file name. It is the last safety net: if the whole page
// cannot be drawn, a parent still sees calm words and one button instead of a blank screen.
export default function WholePageHiccup({ reset }: { error: unknown; reset: () => void }) {
  return (
    <html lang="en" className={nunito.variable}>
      <body>
        <main className="mx-auto max-w-xl px-5 py-10">
          <QuietState title={states.wholeTitle} text={states.wholeText}>
            <Button onClick={reset}>{states.wholeAction}</Button>
          </QuietState>
        </main>
      </body>
    </html>
  );
}
