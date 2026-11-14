import type { ReactNode } from "react";
import { Card } from "@/components/card/card";
import { Cloud } from "@/design/illustrations";

// A kind message for moments when there is nothing to show or something did not work:
// what happened, in calm words, and one thing the person can do next.
export function QuietState({ title, text, children }: { title: string; text: string; children?: ReactNode }) {
  return (
    <Card className="flex flex-col items-start gap-3" tone="hint">
      <Cloud className="h-14 w-24 fill-lavender" />
      <h1 className="text-2xl font-extrabold">{title}</h1>
      <p>{text}</p>
      {children}
    </Card>
  );
}

// Shown for the short moment before saved progress is read from the device.
export function Waiting({ text }: { text: string }) {
  return (
    <p role="status" className="flex items-center gap-3 py-10 text-ink-soft">
      <Cloud className="h-8 w-14 animate-breathe fill-lavender" />
      {text}
    </p>
  );
}
