"use client";

import { useEffect, useState } from "react";
import type { Analysis, LetterPackage } from "@/contracts";
import { buildLetterPackage, LetterError } from "@/letters";
import { hasPaid } from "@/payments";
import { Button } from "@/components/button/button";
import { QuietState, Waiting } from "@/components/states/quiet-state";
import { countOf, formatMoney } from "../_format/format";
import { useStored } from "../_session/use-stored";
import { common } from "../_strings/common";
import { letter } from "../_strings/letter";
import { LockedView } from "./locked-view";
import { ReadyView } from "./ready-view";

type Trouble = { message: string; nextStep: string };

export function LetterScreen() {
  const analysis = useStored<Analysis>("analysis");
  const chosen = useStored<string[]>("chosen");
  const [paid, setPaid] = useState<boolean | null>(null);
  const [pack, setPack] = useState<LetterPackage | null>(null);
  const [trouble, setTrouble] = useState<Trouble | null>(null);

  const findings = analysis.value?.findings.filter((finding) => chosen.value?.includes(finding.id) ?? true) ?? [];
  const key = findings.map((finding) => finding.id).join(",");

  useEffect(() => setPaid(hasPaid()), []);
  useEffect(() => {
    if (!paid || !analysis.value || findings.length === 0) return;
    let current = true;
    buildLetterPackage(analysis.value, findings)
      .then((built) => current && setPack(built))
      .catch((problem) => {
        if (!current) return;
        const kind = problem instanceof LetterError;
        setTrouble({ message: kind ? problem.message : letter.gentleTitle, nextStep: kind ? problem.nextStep : letter.gentleNext });
      });
    return () => {
      current = false;
    };
    // The letter is rebuilt only when the chosen findings change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paid, key]);

  if (!analysis.ready || !chosen.ready || paid === null) return <Waiting text={letter.loading} />;
  if (!analysis.value || findings.length === 0 || trouble) {
    return (
      <QuietState title={trouble?.message ?? letter.emptyTitle} text={trouble?.nextStep ?? letter.emptyText}>
        <Button href={analysis.value ? "/results" : "/upload"}>{letter.emptyAction}</Button>
      </QuietState>
    );
  }
  if (!paid) {
    const money = formatMoney(findings.reduce((sum, finding) => sum + finding.atStakeCents, 0));
    return <LockedView summary={letter.lockedText(countOf(findings.length, common.things), money)} />;
  }
  if (!pack) return <Waiting text={letter.loading} />;
  return <ReadyView pack={pack} />;
}
