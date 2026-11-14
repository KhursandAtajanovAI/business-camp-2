# src/app/case

Owner: Dias.

The case-file screen (`/case`): all papers of one birth, what the family is asking about,
gentle reminders, and a sprout that grows as items are closed.

The case itself is kept by `src/case-file` (Khursand): this screen calls `saveCase`, `loadCase`,
`addDeadline` and `markOutcome`.
The case survives a page reload because `src/case-file` keeps it in the browser.
