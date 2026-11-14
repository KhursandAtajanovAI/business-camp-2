import { PageShell } from "@/components/layout/page-shell";
import { Waiting } from "@/components/states/quiet-state";
import { states } from "./_strings/states";

export default function Loading() {
  return (
    <PageShell>
      <Waiting text={states.loading} />
    </PageShell>
  );
}
