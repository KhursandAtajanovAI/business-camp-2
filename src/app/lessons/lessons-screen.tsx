"use client";

import { useState } from "react";
import type { Analysis } from "@/contracts";
import { sampleAnalysis } from "@/contracts/stubs";
import { lessons } from "@content/lessons/lessons";
import { Button } from "@/components/button/button";
import { NextStep } from "@/components/layout/next-step";
import { Waiting } from "@/components/states/quiet-state";
import { useStored } from "../_session/use-stored";
import { lessonWords as words } from "../_strings/lessons";
import { states } from "../_strings/states";
import { LessonList } from "./lesson-list";
import { LessonView } from "./lesson-view";
import { fillLesson, ownExample } from "./own-example";

export function LessonsScreen() {
  const analysis = useStored<Analysis>("analysis");
  const readIds = useStored<string[]>("lessons");
  const [openId, setOpenId] = useState<string | null>(null);
  if (!analysis.ready || !readIds.ready) return <Waiting text={states.loading} />;

  // With no papers yet, or only our made-up bill, the example is marked as a sample.
  const own = analysis.value && analysis.value.documents.length > 0 ? analysis.value : null;
  const source = own ?? sampleAnalysis;
  const isSample = source.documents.every((document) => document.isDemo);
  const done = readIds.value ?? [];
  const open = lessons.find((lesson) => lesson.id === openId);

  if (open) {
    return (
      <LessonView
        lesson={fillLesson(open, ownExample(source, isSample))}
        isSample={isSample}
        onDone={() => {
          readIds.save([...done.filter((id) => id !== open.id), open.id]);
          setOpenId(null);
          window.scrollTo(0, 0);
        }}
      />
    );
  }
  return (
    <>
      <h1 className="text-3xl font-extrabold leading-tight">{words.title}</h1>
      <p className="text-xl text-ink-soft">{own ? words.lead : words.sampleLead}</p>
      <LessonList lessons={lessons} readIds={done} onOpen={(id) => { setOpenId(id); window.scrollTo(0, 0); }} />
      {!own && (
        <NextStep>
          <Button href="/upload">{words.next}</Button>
        </NextStep>
      )}
    </>
  );
}
