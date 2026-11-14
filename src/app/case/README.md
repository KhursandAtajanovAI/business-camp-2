# src/app/case

Owner: Dias.

The case-file screen (`/case`): all papers of one birth, what the family is asking about,
gentle reminders, and a sprout that grows as items are closed.

The case itself is kept by `src/case-file` (Khursand): this screen calls `saveCase`, `loadCase`,
`addDeadline` and `markOutcome`. `case-source.ts` holds one STUB: a browser copy of the case,
needed only until `src/case-file` keeps it across a page reload (package H9).
