"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/button/button";
import { checkSample } from "../_pipeline/check-papers";
import { writeStored } from "../_session/storage";
import { home } from "../_strings/home";

// One tap: the made-up bill goes down the same road as a real upload, then we show the results.
export function TrySample() {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "working" | "stuck">("idle");

  async function run() {
    setState("working");
    try {
      const analysis = await checkSample();
      writeStored("analysis", analysis);
      writeStored("chosen", null);
      router.push("/results");
    } catch {
      setState("stuck");
    }
  }

  return (
    <>
      <Button onClick={run} waiting={state === "working"}>
        {state === "working" ? home.trySampleWorking : home.trySample}
      </Button>
      {state === "stuck" && <p role="status" className="rounded-soft bg-amber-soft p-3">{home.gentleProblem}</p>}
    </>
  );
}
