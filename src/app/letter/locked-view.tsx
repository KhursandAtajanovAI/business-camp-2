import { Button } from "@/components/button/button";
import { Card } from "@/components/card/card";
import { WithHints } from "@/components/hint/with-hints";
import { NextStep } from "@/components/layout/next-step";
import { Sprout } from "@/design/illustrations";
import { letter } from "../_strings/letter";

// Before paying: say plainly what is ready, what is paid, and that the check stays free.
export function LockedView({ summary }: { summary: string }) {
  return (
    <>
      <Card className="flex flex-col items-start gap-3">
        <Sprout stage={3} className="h-20 w-20" />
        <h1 className="text-3xl font-extrabold leading-tight">{letter.lockedTitle}</h1>
        <p>{summary}</p>
        <p><WithHints text={letter.lockedIncludes} /></p>
      </Card>
      <NextStep note={letter.lockedNote}>
        <Button href="/pricing?returnTo=/letter">{letter.lockedAction}</Button>
        <Button tone="quiet" href="/results">{letter.changeChoice}</Button>
      </NextStep>
    </>
  );
}
