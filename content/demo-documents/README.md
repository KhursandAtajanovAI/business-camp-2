# content/demo-documents

Owner: Adilet. Five synthetic sets of birth bills and insurance explanations (EOBs).
Everything here is invented: no real patients, providers, plans or account numbers.
Every paper is marked SAMPLE and goes through the same pipeline as a real upload
(text, then `parseDocument`, then `analyze`).

- `build-paper.ts` — lays a paper out as text the way a real statement looks, so totals always add up.
- `set-1-...` to `set-5-...` — one family story each, with the mistakes planted in it.
- `index.ts` — `demoSets`, the list the "try a sample" button uses.
- `accuracy/` — extra labelled sets (clean, tricky, mistakes) used only to measure the rules.

Each set lists its planted mistakes in `planted`, with the rule that should find each one
and the money in question, so tests can prove the engine finds exactly what was planted.
