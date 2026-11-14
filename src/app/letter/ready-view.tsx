import type { LetterPackage } from "@/contracts";
import { Button } from "@/components/button/button";
import { Card } from "@/components/card/card";
import { WithHints } from "@/components/hint/with-hints";
import { NextStep } from "@/components/layout/next-step";
import { Sprout } from "@/design/illustrations";
import { letter } from "../_strings/letter";
import { CallScriptView } from "./call-script-view";

// The happy moment: the letter exists. A sprout in bloom, one download button, then what to do next.
export function ReadyView({ pack }: { pack: LetterPackage }) {
  return (
    <>
      <Card tone="calm" className="flex flex-col items-start gap-2">
        <Sprout stage={4} className="h-24 w-24" />
        <h1 className="text-3xl font-extrabold leading-tight">{letter.readyTitle}</h1>
        <p><WithHints text={letter.readyText} /></p>
      </Card>
      <Card className="flex flex-col gap-2">
        <h2 className="text-2xl font-extrabold">{letter.nextTitle}</h2>
        <ol className="list-decimal pl-6">
          {letter.nextSteps.map((step) => <li key={step}><WithHints text={step} /></li>)}
        </ol>
        <p className="text-ink-soft">{letter.honest}</p>
      </Card>
      <CallScriptView script={pack.callScript} />
      {pack.escalationSteps.length > 0 && (
        <Card className="flex flex-col gap-2">
          <h2 className="text-2xl font-extrabold">{letter.escalationTitle}</h2>
          <ol className="list-decimal pl-6">
            {pack.escalationSteps.map((item) => <li key={item.step}><WithHints text={item.text} /></li>)}
          </ol>
        </Card>
      )}
      <NextStep>
        <Button href={pack.letterPdfUrl} download={letter.fileName}>{letter.download}</Button>
        <Button tone="quiet" href="/results">{letter.changeChoice}</Button>
      </NextStep>
    </>
  );
}
