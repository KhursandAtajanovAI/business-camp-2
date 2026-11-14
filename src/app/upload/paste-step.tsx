"use client";

import { useState } from "react";
import { Button } from "@/components/button/button";
import { NextStep } from "@/components/layout/next-step";
import { upload } from "../_strings/upload";

// Step one, the "paste" way: a big text box and one button.
export function PasteStep({ onText, onBack }: { onText: (text: string) => void; onBack: () => void }) {
  const [text, setText] = useState("");
  return (
    <form
      className="flex flex-1 flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onText(text);
      }}
    >
      <label htmlFor="bill-text" className="text-xl font-extrabold">{upload.pasteTitle}</label>
      <textarea
        id="bill-text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={upload.pastePlaceholder}
        rows={9}
        className="w-full rounded-soft border-2 border-lavender bg-surface p-4 placeholder:text-ink-soft"
      />
      <NextStep>
        <Button type="submit">{upload.pasteAction}</Button>
        <Button tone="quiet" onClick={onBack}>{upload.pasteBack}</Button>
      </NextStep>
    </form>
  );
}
