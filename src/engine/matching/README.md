# src/engine/matching

Owner: Adilet.

Rules that compare papers with each other.

- `find-eob.ts` — which insurance explanation (EOB) belongs to which bill, and back.
- `balance-above-eob.ts`, `insurance-not-applied.ts` — the bill asks for more than the EOB says.
- `mother-baby-repeat.ts` — the same charge on the mother's and the baby's bill.
- `preventive-care-charged.ts` — a well-baby visit or breastfeeding support in network with a charge.
- `stay-not-covered.ts` — a hospital day right after the birth that the plan did not cover.
