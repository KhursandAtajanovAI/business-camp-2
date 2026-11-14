# src/explain

Owner: Adilet. Plain-English words about findings the engine has already made.
Import only from `index.ts`:

- `explainFinding(finding)` — up to three short sentences. The words come from `content/rules`,
  the amount comes from the finding. No language model is involved.
- `askHelper(question, analysis)` — answers a question about the person's own case.

How the helper works (`helper/`):

- `guard.ts` — a health question is never answered; the person is kindly sent to their doctor.
- `local-answer.ts` — answers from the case data with ordinary code. Always available.
- `ask-model.ts` — server only. When `ANTHROPIC_API_KEY` is set, a language model words the answer
  from the same case facts. It gets no names, addresses or policy numbers: the question goes
  through `redactPersonalData` and the facts are built from the analysis, which has none.
- The route `src/app/api/helper` picks the model when a key is set and the local answer otherwise.

All numbers in an answer come from the engine. The model may not add findings or amounts.
