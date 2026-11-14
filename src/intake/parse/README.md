# src/intake/parse

Owner: Khursand. Turns the plain text of a paper into the shared `ParsedDocument`.
This is ordinary code, not a language model, so the same text always gives the same result.

- `read-money.ts` — finds dollar amounts and turns them into cents.
- `read-date.ts` — reads US dates.
- `read-lines.ts` — finds the charge lines.
- `read-header.ts` — finds who sent the paper, when, and what kind of paper it is.
- `parse-text.ts` — puts it all together and notes anything a person should double-check.
