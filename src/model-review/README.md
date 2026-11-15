# src/model-review

Owner: Khursand. The live language model on the person's own papers.

After the rules have run, the server sends the bill lines and the findings to a model,
and the model explains each finding in the context of this bill. Code stays in charge of the facts:

- `facts.ts` — what the model gets: lines, amounts, findings. No names, addresses or policy numbers
  (a `ParsedDocument` has none).
- `call-model.ts` — server only. Calls the model with `ANTHROPIC_API_KEY`.
- `check-answer.ts` — every dollar amount the model writes must exist in the facts, and it may only
  talk about findings the engine made. Anything else is replaced by the rule's own explanation.
- `review.ts` — picks the mode. With a key: `model`. Without a key, on a limit, an empty or a broken
  answer: `local`, and the answer says so honestly.
- `index.ts` — `reviewAnalysis(analysis)` for screens; the route is `src/app/api/review`.

The answer always carries `mode: "model" | "local"` and, for local, a `reason`,
so a screen can show a truthful "explained by the model / explained locally" badge.
