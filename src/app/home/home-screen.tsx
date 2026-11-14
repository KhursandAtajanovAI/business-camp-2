import { Card } from "@/components/card/card";
import { NextStep } from "@/components/layout/next-step";
import { PageShell } from "@/components/layout/page-shell";
import { Cradle, Family } from "@/design/illustrations";
import { home } from "../_strings/home";
import { HowItWorks } from "./how-it-works";
import { ResumeCard } from "./resume-card";
import { TrySample } from "./try-sample";

export function HomeScreen() {
  return (
    <PageShell>
      <ResumeCard />
      <section className="flex flex-col gap-4">
        <Cradle className="h-28 w-40 animate-settle" />
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{home.title}</h1>
        <p className="text-xl text-ink-soft">{home.lead}</p>
      </section>
      <HowItWorks />
      <Card tone="calm" className="flex flex-col gap-2">
        <h2 className="text-xl font-extrabold">{home.priceTitle}</h2>
        <p>{home.priceText}</p>
      </Card>
      <Card tone="hint" className="flex items-start gap-4">
        <Family className="h-16 w-24 shrink-0" />
        <div>
          <h2 className="text-xl font-extrabold">{home.privacyTitle}</h2>
          <p className="mt-1">{home.privacyText}</p>
        </div>
      </Card>
      <NextStep note={`${home.trySampleNote} ${home.noAccount}`}>
        <TrySample />
        
      </NextStep>
    </PageShell>
  );
}
