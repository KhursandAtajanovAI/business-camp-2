import { Card } from "@/components/card/card";
import { Sprout, type SproutStage } from "@/design/illustrations";
import { home } from "../_strings/home";

// Three steps, each with a sprout that is a little taller than the one before.
export function HowItWorks() {
  return (
    <section className="flex flex-col gap-4" aria-labelledby="how-it-works">
      <h2 id="how-it-works" className="text-2xl font-extrabold">{home.stepsTitle}</h2>
      {home.steps.map((step, index) => (
        <Card key={step.title} className="flex items-start gap-4">
          <Sprout stage={(index + 1) as SproutStage} className="h-16 w-16 shrink-0" />
          <div>
            <h3 className="text-xl font-extrabold">{step.title}</h3>
            <p className="mt-1 text-ink-soft">{step.text}</p>
          </div>
        </Card>
      ))}
    </section>
  );
}
