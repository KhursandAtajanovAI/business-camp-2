"use client";

import { Button } from "@/components/button/button";
import { PageShell } from "@/components/layout/page-shell";
import { QuietState } from "@/components/states/quiet-state";
import { states } from "./_strings/states";

// The framework requires this file name. It is what a person sees if a screen breaks:
// no red, no alarming words, their saved papers are safe, and they can try again.
export default function ScreenHiccup({ reset }: { error: unknown; reset: () => void }) {
  return (
    <PageShell>
      <QuietState title={states.hiccupTitle} text={states.hiccupText}>
        <Button onClick={reset}>{states.hiccupAction}</Button>
        <Button tone="quiet" href="/">{states.hiccupHome}</Button>
      </QuietState>
    </PageShell>
  );
}
