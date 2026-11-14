import { PageShell } from "@/components/layout/page-shell";
import { PricingScreen } from "./pricing-screen";

// Only addresses inside our own site are accepted as the place to return to after paying.
function ownPath(value: string | string[] | undefined): string {
  return typeof value === "string" && /^\/[\w-]*$/.test(value) ? value : "/results";
}

export default async function PricingPage({ searchParams }: { searchParams: Promise<{ returnTo?: string | string[] }> }) {
  const { returnTo } = await searchParams;
  return (
    <PageShell>
      <PricingScreen returnTo={ownPath(returnTo)} />
    </PageShell>
  );
}
