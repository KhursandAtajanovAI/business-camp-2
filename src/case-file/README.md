# src/case-file

Owner: Khursand. The family case file: every paper, claim, deadline and outcome in one place.
Screens import only from `index.ts`.

- `store/` — keeps the case in the browser so it survives a page reload; creates and updates a case.
- `reminders/` — gentle reminders for the site and a calendar file (.ics).
- `outcomes/` — mark a claim as won or lost and count what the family saved.

Every function takes a case and returns the updated case, already saved.
There is one case per browser: no account is needed.
