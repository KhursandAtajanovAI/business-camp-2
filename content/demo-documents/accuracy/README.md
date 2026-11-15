# content/demo-documents/accuracy

Owner: Adilet. Extra labelled sets used only to measure the rules. They are not shown in the
product. All of it is invented and marked SAMPLE, like the five sample sets.

- `paper.ts` — short helpers to write a paper and its lines.
- `clean-sets.ts` — nothing is wrong; any finding is a false alarm.
- `tricky-sets.ts` — looks wrong, but the story has an innocent explanation.
- `mistake-sets-a.ts`, `mistake-sets-b.ts` — real mistakes in shapes the sample sets do not have.
- `index.ts` — `checkSets`, read by `src/engine/accuracy`.

Label a set by its story, the way a careful person would, and never by what the engine says today.
The result of the measurement is in `docs/economics/accuracy.md`.
