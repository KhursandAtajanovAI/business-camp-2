"use client";

import { useState } from "react";
import type { Analysis } from "@/contracts";
import { Button } from "@/components/button/button";
import { Card } from "@/components/card/card";
import { WithHints } from "@/components/hint/with-hints";
import { askAboutCase, type HelperReply } from "../_pipeline/ask-helper";
import { results } from "../_strings/results";
import { CheckBadge } from "./check-badge";

// A small helper: one question, one answer about the person's own case,
// and a badge that says whether a language model worded it.
export function HelperCard({ analysis }: { analysis: Analysis }) {
  const [question, setQuestion] = useState("");
  const [state, setState] = useState<"idle" | "working" | "empty">("idle");
  const [reply, setReply] = useState<HelperReply | null>(null);

  async function ask() {
    if (question.trim() === "") return setState("empty");
    setState("working");
    setReply(await askAboutCase(question, analysis));
    setState("idle");
  }

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-2xl font-extrabold">{results.askTitle}</h2>
      <p className="text-ink-soft">{results.askLead}</p>
      <form className="flex flex-col gap-3" onSubmit={(event) => { event.preventDefault(); void ask(); }}>
        <label htmlFor="helper-question" className="font-bold">{results.askLabel}</label>
        <input
          id="helper-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={results.askPlaceholder}
          maxLength={400}
          className="min-h-12 w-full rounded-soft border-2 border-lavender bg-surface px-4 placeholder:text-ink-soft"
        />
        <Button type="submit" tone="second" waiting={state === "working"}>
          {state === "working" ? results.askWorking : results.askAction}
        </Button>
      </form>
      {state === "empty" && <p role="status" className="rounded-soft bg-amber-soft p-3">{results.askEmpty}</p>}
      {reply && (
        <div role="status" className="flex flex-col gap-3 rounded-soft bg-cream p-4">
          {reply.answer.split(/\n+/).map((paragraph) => <p key={paragraph}><WithHints text={paragraph} /></p>)}
          <CheckBadge who={reply.answeredBy} />
        </div>
      )}
    </Card>
  );
}
