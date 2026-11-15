"use client";

import { useEffect, useState } from "react";
import type { Analysis } from "@/contracts";
import { reviewAnalysis, type Review } from "@/model-review";

// Asks for the live explanation once per check. A corrected line gives a new check,
// so the explanation is asked for again and always matches what is on screen.
export function useReview(analysis: Analysis | null): Review | null {
  const [state, setState] = useState<{ key: string; review: Review } | null>(null);
  const key = analysis ? analysis.findings.map((finding) => `${finding.id}:${finding.atStakeCents}`).join("|") : "";

  useEffect(() => {
    if (!analysis || analysis.findings.length === 0) return;
    let current = true;
    void reviewAnalysis(analysis).then((review) => current && setState({ key, review }));
    return () => {
      current = false;
    };
    // The key stands for the findings; the analysis object itself changes on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state && state.key === key ? state.review : null;
}
