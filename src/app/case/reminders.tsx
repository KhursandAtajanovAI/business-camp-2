"use client";

import { useState } from "react";
import type { CaseFile } from "@/contracts";
import { Button } from "@/components/button/button";
import { Card } from "@/components/card/card";
import { WithHints } from "@/components/hint/with-hints";
import { formatDate } from "../_format/format";
import { caseFile as words } from "../_strings/case";

type Deadline = CaseFile["deadlines"][number];
type RemindersProps = { deadlines: Deadline[]; onAdd: (deadline: Deadline) => void; onToggle: (index: number) => void };

const field = "min-h-12 w-full rounded-soft border-2 border-lavender bg-surface px-4";

// Dates the family chose for itself. A day that has passed is never called late:
// it simply reads "Whenever you are ready".
export function Reminders({ deadlines, onAdd, onToggle }: RemindersProps) {
  const [label, setLabel] = useState(words.presets[0]);
  const [dueOn, setDueOn] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-2xl font-extrabold">{words.remindersTitle}</h2>
      <p className="text-ink-soft">{words.remindersLead}</p>
      {deadlines.length === 0 && <p>{words.noReminders}</p>}
      <ul className="flex flex-col gap-2">
        {deadlines.map((deadline, index) => (
          <li key={`${deadline.label}-${deadline.dueOn}-${index}`}>
            <label className={`tap flex min-h-12 cursor-pointer items-center gap-3 rounded-soft px-4 py-2 ${deadline.done ? "bg-sage-soft" : "bg-cream"}`}>
              <input type="checkbox" checked={deadline.done} onChange={() => onToggle(index)} className="h-6 w-6 shrink-0 accent-sage-deep" aria-label={`${words.reminderDone}: ${deadline.label}`} />
              <span className="flex flex-col">
                <span className={deadline.done ? "line-through" : "font-bold"}>{deadline.label}</span>
                <span className="text-ink-soft">
                  {deadline.done ? words.reminderDone : deadline.dueOn >= today ? words.around(formatDate(deadline.dueOn)) : words.whenReady}
                </span>
              </span>
            </label>
          </li>
        ))}
      </ul>
      <form
        className="flex flex-col gap-2 border-t-2 border-lavender-soft pt-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (!dueOn) return;
          onAdd({ label, dueOn, done: false });
          setDueOn("");
        }}
      >
        <label htmlFor="reminder-label" className="font-bold">{words.reminderLabel}</label>
        <select id="reminder-label" value={label} onChange={(event) => setLabel(event.target.value)} className={field}>
          {words.presets.map((preset) => <option key={preset}>{preset}</option>)}
        </select>
        <label htmlFor="reminder-date" className="font-bold">{words.reminderDate}</label>
        <input id="reminder-date" type="date" required min={today} value={dueOn} onChange={(event) => setDueOn(event.target.value)} className={field} />
        <Button type="submit" tone="second">{words.reminderAdd}</Button>
      </form>
    </Card>
  );
}
