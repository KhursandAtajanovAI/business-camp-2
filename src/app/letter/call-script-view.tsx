"use client";

import { useState } from "react";
import { Button } from "@/components/button/button";
import { Card } from "@/components/card/card";
import { WithHints } from "@/components/hint/with-hints";
import { letter } from "../_strings/letter";

// The script arrives as plain text: blocks separated by empty lines,
// a heading on the first line of a block and "- " in front of each thing to say.
function Block({ block }: { block: string }) {
  const [heading, ...rest] = block.split("\n");
  return (
    <div>
      <h3 className="font-extrabold text-lavender-deep">{heading}</h3>
      <ul className="mt-1 flex flex-col gap-2">
        {rest.map((line) => <li key={line} className="break-words"><WithHints text={line.replace(/^- /, "")} /></li>)}
      </ul>
    </div>
  );
}

export function CallScriptView({ script }: { script: string }) {
  const [copied, setCopied] = useState(false);
  const blocks = script.split(/\n\n+/).filter((block) => !/^-+$/.test(block.trim()));

  async function copy() {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
    } catch {
      setCopied(false); // some browsers do not allow copying; the text is on screen either way
    }
  }

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-2xl font-extrabold">{letter.scriptTitle}</h2>
      <p className="text-ink-soft">{letter.scriptLead}</p>
      {blocks.map((block) => <Block key={block} block={block} />)}
      <Button tone="second" onClick={copy}>{copied ? letter.copied : letter.copy}</Button>
    </Card>
  );
}
