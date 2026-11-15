# src/engine/accuracy

Owner: Adilet. Measures how often the rules are right, on labelled sets.

- `measure.ts` — compares planted mistakes with the engine's findings: found, missed, false alarms.
- `report.ts` — turns the counts into the measured part of `docs/economics/accuracy.md`.
- `accuracy.test.ts` — runs every labelled set through `parseDocument` and `analyze` and fails
  if the document shows other numbers. `UPDATE_ACCURACY=1 npm test` rewrites the document.
