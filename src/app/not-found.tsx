import { Button } from "@/components/button/button";
import { PageShell } from "@/components/layout/page-shell";
import { QuietState } from "@/components/states/quiet-state";
import { states } from "./_strings/states";

// Shown for an address that does not exist. Calm words and one way forward.
export default function NotFound() {
  return (
    <PageShell>
      <QuietState title={states.lostTitle} text={states.lostText}>
        <Button href="/">{states.lostAction}</Button>
      </QuietState>
    </PageShell>
  );
}
