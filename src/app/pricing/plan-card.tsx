import type { Plan } from "@/contracts";
import { plans } from "@/payments";
import { Button, type ButtonTone } from "@/components/button/button";
import { Card } from "@/components/card/card";
import { WithHints } from "@/components/hint/with-hints";
import { pricing } from "../_strings/pricing";

export function planPrice(plan: Plan): string {
  const details = plans[plan];
  const dollars = `$${(details.priceCents / 100).toFixed(2).replace(/\.00$/, "")}`;
  return `${dollars} ${details.billing === "monthly" ? pricing.monthly : pricing.once}`;
}

type PlanCardProps = { plan: Plan; tone: ButtonTone; waiting: boolean; onChoose: (plan: Plan) => void };

// One plan: its name, price and what it gives. Names and prices come from src/payments.
export function PlanCard({ plan, tone, waiting, onChoose }: PlanCardProps) {
  const details = plans[plan];
  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-xl font-extrabold">{details.name}</h2>
      <p className="text-3xl font-extrabold">{planPrice(plan)}</p>
      <p><WithHints text={details.summary} /></p>
      <Button tone={tone} waiting={waiting} onClick={() => onChoose(plan)}>
        {waiting ? pricing.opening : pricing.choose(details.name, planPrice(plan))}
      </Button>
    </Card>
  );
}
