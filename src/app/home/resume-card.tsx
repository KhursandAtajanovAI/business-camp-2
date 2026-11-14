"use client";

import { Button } from "@/components/button/button";
import { Card } from "@/components/card/card";
import { useStored } from "../_session/use-stored";
import { common } from "../_strings/common";

// Shown only to someone who pressed "Back later": one tap returns them to their screen.
export function ResumeCard() {
  const { value: resumePath } = useStored<string>("resume");
  if (!resumePath || !resumePath.startsWith("/")) return null;
  return (
    <Card tone="calm" className="flex flex-col gap-3">
      <h2 className="text-xl font-extrabold">{common.resumeTitle}</h2>
      <p>{common.resumeText}</p>
      <Button tone="second" href={resumePath}>{common.resumeAction}</Button>
    </Card>
  );
}
