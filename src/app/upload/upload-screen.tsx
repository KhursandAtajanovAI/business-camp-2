"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ParsedDocument } from "@/contracts";
import { IntakeError } from "@/intake";
import { Button } from "@/components/button/button";
import { Card } from "@/components/card/card";
import { NextStep } from "@/components/layout/next-step";
import { Waiting } from "@/components/states/quiet-state";
import { addPaper, checkPapers, readPaper } from "../_pipeline/check-papers";
import { writeStored } from "../_session/storage";
import { useStored } from "../_session/use-stored";
import { upload } from "../_strings/upload";
import { ChooseStep } from "./choose-step";
import { PaperCard } from "./paper-card";
import { PasteStep } from "./paste-step";

type Step = "choose" | "paste" | "reading" | "read";
type Trouble = { message: string; nextStep: string };

export function UploadScreen() {
  const router = useRouter();
  const papers = useStored<ParsedDocument[]>("papers");
  const list = papers.value ?? [];
  const [step, setStep] = useState<Step | null>(null);
  const [trouble, setTrouble] = useState<Trouble | null>(null);
  // Someone who comes back with papers already added lands on the list, not at the start.
  const shown: Step = step ?? (list.length > 0 ? "read" : "choose");

  async function read(input: File | string) {
    setStep("reading");
    setTrouble(null);
    try {
      papers.save(addPaper(list, await readPaper(input)));
      setStep("read");
    } catch (problem) {
      const kind = problem instanceof IntakeError;
      setTrouble({ message: kind ? problem.message : upload.gentleText, nextStep: kind ? problem.nextStep : upload.gentleNext });
      setStep(typeof input === "string" ? "paste" : "choose");
    }
  }

  function check() {
    writeStored("analysis", checkPapers(list));
    writeStored("chosen", null);
    router.push("/results");
  }

  function remove(id: string) {
    const rest = list.filter((paper) => paper.id !== id);
    papers.save(rest);
    if (rest.length === 0) setStep("choose");
  }

  if (!papers.ready || shown === "reading") return <Waiting text={upload.reading} />;
  return (
    <>
      <h1 className="text-3xl font-extrabold leading-tight">{shown === "read" ? upload.readTitle : upload.title}</h1>
      {trouble && (
        <Card tone="notice" className="flex flex-col gap-1">
          <p role="status" className="font-bold">{trouble.message}</p>
          <p>{trouble.nextStep}</p>
        </Card>
      )}
      {shown === "choose" && (
        <>
          <p className="text-xl text-ink-soft">{upload.lead}</p>
          <ChooseStep onFile={read} onPaste={() => setStep("paste")} />
          <Card tone="hint" className="flex flex-col gap-2">
            <p><span className="font-bold">{upload.whyTitle}. </span>{upload.whyText}</p>
            <p>{upload.privacy}</p>
          </Card>
        </>
      )}
      {shown === "paste" && <PasteStep onText={read} onBack={() => setStep("choose")} />}
      {shown === "read" && (
        <>
          {list.map((paper) => <PaperCard key={paper.id} paper={paper} onRemove={() => remove(paper.id)} />)}
          <NextStep note={upload.checkNote}>
            <Button onClick={check}>{upload.check}</Button>
            <Button tone="second" onClick={() => setStep("choose")}>{upload.addAnother}</Button>
          </NextStep>
        </>
      )}
    </>
  );
}
