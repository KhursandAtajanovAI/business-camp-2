# src/app/_session

Owner: Dias.

Keeps the person's progress in the browser so any screen can be left and reopened:
the last check (`analysis`), chosen findings (`chosen`), the screen to return to (`resume`).

- `storage.ts` — safe read and write.
- `use-stored.ts` — the same for React screens.
