import { sampleFamilyPlans } from "@/contracts/family";
import { Card } from "@/components/card/card";
import { WithHints } from "@/components/hint/with-hints";
import { pricing } from "../_strings/pricing";

const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;

function Planned({ name, price, items }: { name: string; price: string; items: string[] }) {
  return (
    <Card className="flex flex-col gap-2">
      <span className="self-start rounded-full bg-lavender-soft px-3 py-1 font-bold text-lavender-deep">{pricing.planned}</span>
      <h3 className="text-xl font-extrabold">{name}</h3>
      <p className="text-2xl font-extrabold">{price}</p>
      <ul className="list-disc pl-5">{items.map((item) => <li key={item}><WithHints text={item} /></li>)}</ul>
      <p className="text-ink-soft">{pricing.assumption}</p>
    </Card>
  );
}

// What comes after the birth case: the Family plan and Pause. They are shown as a plan,
// with no button, because they cannot be bought yet. Prices come from the shared family
// types (src/contracts/family), where they are marked as assumptions.
export function LaterPlans() {
  const family = sampleFamilyPlans.find((plan) => plan.id === "family");
  const pause = sampleFamilyPlans.find((plan) => plan.id === "pause");
  if (!family || !pause) return null;
  return (
    <section className="flex flex-col gap-4" aria-labelledby="later-plans">
      <h2 id="later-plans" className="text-2xl font-extrabold">{pricing.laterTitle}</h2>
      <p className="text-ink-soft">{pricing.laterLead}</p>
      <Planned name={pricing.familyName} price={pricing.familyPrice(dollars(family.priceCents))} items={pricing.familyItems} />
      <Planned name={pricing.pauseName} price={pricing.pausePrice(pause.pauseMonthsMax ?? 6)} items={pricing.pauseItems} />
    </section>
  );
}
