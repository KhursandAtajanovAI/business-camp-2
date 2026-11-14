"use client";

import { useEffect, useState } from "react";
import type { Plan } from "@/contracts";
import { PaymentError, paidPlan, plans, startCheckout } from "@/payments";
import { Button } from "@/components/button/button";
import { Card } from "@/components/card/card";
import { WithHints } from "@/components/hint/with-hints";
import { pricing } from "../_strings/pricing";
import { upload } from "../_strings/upload";
import { PlanCard } from "./plan-card";

function List({ items }: { items: string[] }) {
  return <ul className="list-disc pl-5">{items.map((item) => <li key={item}><WithHints text={item} /></li>)}</ul>;
}

export function PricingScreen({ returnTo }: { returnTo: string }) {
  const [paid, setPaid] = useState<Plan | null>(null);
  const [opening, setOpening] = useState<Plan | null>(null);
  const [trouble, setTrouble] = useState<PaymentError | null>(null);
  useEffect(() => setPaid(paidPlan()), []);

  async function choose(plan: Plan) {
    setOpening(plan);
    setTrouble(null);
    try {
      window.location.assign(await startCheckout(plan, returnTo));
    } catch (problem) {
      setOpening(null);
      setTrouble(problem instanceof PaymentError ? problem : new PaymentError(upload.gentleText));
    }
  }

  return (
    <>
      <h1 className="text-3xl font-extrabold leading-tight">{pricing.title}</h1>
      <p className="text-xl text-ink-soft">{pricing.lead}</p>
      {paid && (
        <Card tone="calm" className="flex flex-col gap-3">
          <h2 className="text-xl font-extrabold">{pricing.paidTitle}</h2>
          <p>{pricing.paidText(plans[paid].name)}</p>
          <Button href={returnTo}>{pricing.paidAction}</Button>
        </Card>
      )}
      <Card tone="calm" className="flex flex-col gap-2">
        <h2 className="text-xl font-extrabold">{pricing.freeName}</h2>
        <p className="text-3xl font-extrabold">{pricing.freePrice}</p>
        <List items={pricing.freeItems} />
      </Card>
      {trouble && (
        <Card tone="notice">
          <p role="status" className="font-bold">{trouble.message}</p>
          <p>{trouble.nextStep}</p>
        </Card>
      )}
      {!paid && (
        <>
          <PlanCard plan="one_time_29" tone="main" waiting={opening === "one_time_29"} onChoose={choose} />
          <PlanCard plan="monthly_14_99" tone="second" waiting={opening === "monthly_14_99"} onChoose={choose} />
        </>
      )}
      <Card tone="hint" className="flex flex-col gap-2">
        <h2 className="text-xl font-extrabold">{pricing.honestTitle}</h2>
        <List items={[...pricing.paidIncludes, ...pricing.honest]} />
      </Card>
      {!paid && <Button tone="quiet" href="/results">{pricing.notNow}</Button>}
    </>
  );
}
