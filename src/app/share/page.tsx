import { PageShell } from "@/components/layout/page-shell";
import { MakeShare } from "./make-share";
import { readReport } from "./share-report";
import { ViewShare } from "./view-share";

// With numbers in the address this is a shared report; without them it is the place to make one.
export default async function SharePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const report = readReport(await searchParams);
  return <PageShell>{report ? <ViewShare report={report} /> : <MakeShare />}</PageShell>;
}
