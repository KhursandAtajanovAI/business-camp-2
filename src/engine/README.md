# src/engine

Owner: Adilet. The brain: rules written in code check the family's papers.
Import only from `index.ts`: `analyze(documents)` and `describeHealthScore(analysis)`.

- `rules/` — one small file per rule that looks at a single paper or at the papers of one provider.
- `matching/` — rules that compare papers: a bill with its insurance explanation, the mother's bill with the baby's.
- `checks/` — the list of rules and the runner that collects findings and never counts the same money twice.
- `accuracy/` — measures the rules on labelled sets; the result is in `docs/economics/accuracy.md`.
- `money/` — money in question, the 0 to 100 health score and its short reason.

Every rule has a test that finds the problem and a test that stays silent, a description
and a source in `content/rules`, and a confidence level. Money is in cents. No language model is used here.
