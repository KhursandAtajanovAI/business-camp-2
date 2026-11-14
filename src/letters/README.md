# src/letters

Owner: Khursand. Turns chosen findings into things a parent can act on.
Import only from `index.ts`: `buildLetterPackage(analysis, selectedFindings)`.

- `letter/` — the claim letter and its PDF.
- `call-script/` — the phone script.
- `escalation/` — next steps after a refusal (stage 3).
- `appeal/` — appeal letter after an insurance denial (stage 4).
- `shared/` — small helpers used by all of the above.

All words come from `content/letters`. Numbers come from the engine, never from a model.
The paywall is not here: the screen asks `hasPaid()` from `src/payments` before it calls this module.
