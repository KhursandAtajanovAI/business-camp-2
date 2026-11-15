# src/app

Owner: Dias.

Pages of the site. One screen is one folder. Thin API routes in `api/<module>` belong to the owner of that module.

| Address | Folder | Screen |
|---|---|---|
| `/` | `home/` | Welcome and "Try it on an example" |
| `/upload` | `upload/` | Add a photo, a PDF or pasted text |
| `/results` | `results/` | Money in question and a card for each finding |
| `/letter` | `letter/` | Claim letter download and call script |
| `/pricing` | `pricing/` | The free check and the two plans |
| `/case` | `case/` | Case file: papers, reminders, outcomes |
| `/lessons` | `lessons/` | One-minute lessons on the person's own example |
| `/game` | `game/` | Detective game on a made-up bill |
| `/share` | `share/` | A report with no personal details |

Folders that start with an underscore are helpers, not pages:
`_strings` (all words), `_session` (progress saved in the browser),
`_pipeline` (the road from a paper to a result), `_format` (money and dates).

`not-found.tsx`, `error.tsx` and `loading.tsx` are the kind "nothing here", "did not work" and "one moment" states.

Other modules are used only through their main file: `@/intake`, `@/engine`, `@/explain`,
`@/letters`, `@/payments`, `@/case-file`. The sample comes from `@content/demo-documents`.
