import { common } from "@/app/_strings/common";

// Every made-up example on the site carries this tag, so nobody takes it for a real bill.
export function SampleTag() {
  return (
    <span title={common.sampleNote} className="inline-flex items-center rounded-full bg-amber px-3 py-1 font-bold text-ink">
      {common.sample}
    </span>
  );
}
