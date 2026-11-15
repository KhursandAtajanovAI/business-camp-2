"use client";

import { useId, useState } from "react";
import { hintWords, type GlossaryTerm } from "@/app/_strings/glossary";

// A hard word with a soft dotted line under it. A tap opens its one-sentence meaning
// right below the word, and the person stays on the same page.
export function Hint({ term, children }: { term: GlossaryTerm; children: string }) {
  const [open, setOpen] = useState(false);
  const noteId = useId();
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={noteId}
        title={hintWords.open}
        className="-my-3 inline rounded-md py-3 font-bold text-lavender-deep underline decoration-lavender decoration-dotted decoration-2 underline-offset-4 hover:decoration-solid"
      >
        {children}
      </button>
      {open && (
        <span id={noteId} role="note" className="my-2 block animate-settle rounded-soft bg-lavender-soft p-4 text-left font-normal text-ink">
          <span className="font-bold">{term.word}: </span>
          {term.meaning}{" "}
          <button type="button" onClick={() => setOpen(false)} className="inline py-3 font-bold text-lavender-deep underline decoration-2 underline-offset-4">
            {hintWords.close}
          </button>
        </span>
      )}
    </>
  );
}
