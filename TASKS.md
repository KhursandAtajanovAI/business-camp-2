# Work packages

Take a package by putting your name in "Who" and setting the status to `in progress`.
Statuses: `not started` -> `in progress` -> `ready` -> `merged`.
Everything in stages 0 to 4 is merged into `main`. Stage 5 is at the end of this file.
Stages: 0 skeleton, 1 core, 2 full path (all P0), 3 retention (P1), 4 growth (P2).

## Khursand: intake, letters, payments, case file, deck, merges

| ID | Package | Folder | Stage | Who | Status |
|----|---------|--------|-------|-----|--------|
| H0 | Skeleton, contracts, README | root, `src/contracts` | 0 | Khursand | merged |
| H1 | Upload a file or paste text | `src/intake/upload` | 1 | Khursand | merged |
| H2 | Parse a paper into the shared format | `src/intake/parse` | 1 | Khursand | merged |
| H3 | Hide personal data | `src/intake/redact` | 1 | Khursand | merged |
| H4 | Letter and call-script templates | `content/letters` | 2 | Khursand | merged |
| H5 | Claim letter as a PDF | `src/letters/letter` | 2 | Khursand | merged |
| H6 | Call script | `src/letters/call-script` | 2 | Khursand | merged |
| H7 | Payments: plans and Stripe | `src/payments` | 2 | Khursand | merged |
| H8 | Escalation steps | `src/letters/escalation` | 3 | Khursand | merged |
| H9 | Case file: storage and deadlines | `src/case-file/store` | 3 | Khursand | merged |
| H10 | Reminders and calendar file | `src/case-file/reminders` | 3 | Khursand | merged |
| H11 | Outcome loop: won or lost | `src/case-file/outcomes` | 3 | Khursand | merged |
| H12 | Connector to ChatGPT and Claude | `src/connector` | 4 | Khursand | merged |
| H13 | Appeal after an insurance denial | `src/letters/appeal` | 4 | Khursand | merged |
| H14 | Deck, up to 10 slides | `docs/deck` | 1-4 | Khursand | merged |
| H15 | Merges into main and final check | `main` | 0-4 | Khursand | merged |

## Adilet: rules, explanations, demo data, economics

| ID | Package | Folder | Stage | Who | Status |
|----|---------|--------|-------|-----|--------|
| A1 | Rule: repeated line | `src/engine/rules` | 1 | Khursand (handed over) | merged |
| A2 | Rule: service belongs to the birth package | `src/engine/rules` | 1 | Khursand (handed over) | merged |
| A3 | Result: money in question and confidence | `src/engine/checks`, `src/engine/money` | 1 | Khursand (handed over) | merged |
| A4 | Plain-English rule descriptions | `content/rules` | 1 | Khursand (handed over) | merged |
| A5 | Five synthetic bill sets | `content/demo-documents` | 1 | Khursand (handed over) | merged |
| A6 | License check of CMS and AMA data | `docs/economics` | 1 | Khursand (handed over) | merged |
| A7 | Rule: bill disagrees with the EOB | `src/engine/matching` | 2 | Khursand (handed over) | merged |
| A8 | Rule: repeats between mother and baby | `src/engine/matching` | 2 | Khursand (handed over) | merged |
| A9 | Plain-English explanations | `src/explain` | 2 | Khursand (handed over) | merged |
| A10 | Unit economics with sources | `docs/economics` | 2 | Khursand (handed over) | merged |
| A11 | Rule: out-of-network doctor in an in-network hospital | `src/engine/rules` | 3 | Khursand (handed over) | merged |
| A12 | Rule: price above public prices | `src/engine/rules` | 3 | Khursand (handed over) | merged |
| A13 | Bill health score | `src/engine/money` | 3 | Khursand (handed over) | merged |
| A14 | Helper chat | `src/explain` | 3 | Khursand (handed over) | merged |
| A15 | Survey or interviews | `docs/economics` | 3 | Khursand (handed over) | merged |
| A16 | More rules, all rules on all sets | `src/engine`, `content` | 4 | Khursand (handed over) | merged |

## Dias: screens, design, hints, lessons, game

| ID | Package | Folder | Stage | Who | Status |
|----|---------|--------|-------|-----|--------|
| D1 | Design system | `src/design` | 1 | Dias | merged |
| D2 | Home page and "try a sample" | `src/app/home` | 1 | Dias | merged |
| D3 | Upload screen | `src/app/upload` | 1 | Dias | merged |
| D4 | Results screen | `src/app/results` | 2 | Dias | merged |
| D5 | Hints and glossary | `src/components/hint` | 2 | Dias | merged |
| D6 | Letter and call-script screen | `src/app/letter` | 2 | Dias | merged |
| D7 | Pricing and payment screen | `src/app/pricing` | 2 | Dias | merged |
| D8 | Mobile version, empty and error states | `src/components`, `src/app` | 2 | Dias | merged |
| D9 | Case file screen | `src/app/case` | 3 | Dias | merged |
| D10 | Micro-lessons | `content/lessons`, `src/app/lessons` | 3 | Dias | merged |
| D11 | Detective game | `src/app/game` | 4 | Dias | merged |
| D12 | Share a report without personal data | `src/app/share` | 4 | Dias | merged |
| D13 | Screenshots for the deck | `docs/screens` | 4 | Dias | merged |
| D14 | Check of English texts and disclaimers | `src`, `content` | 4 | Dias | merged |

## Stage 5: submission

| ID | Package | Who | Status |
|----|---------|-----|--------|
| H22 | Merge the phone fixes (PR #14) and build main | Khursand | merged |
| H23 | Deploy main and put the link in the README | Khursand | in progress |
| H16 | Types of the family path (`src/contracts/family.ts`) | Khursand | merged |
| H18 | Live model on the person's own bill (`src/model-review`, `/api/review`) | Khursand | merged |
| H19 | Editing bill lines, data side (`src/intake`) | Khursand | merged; the screen is D16 |
| H24 | Deck, package list, README, roadmap match the product | Khursand | merged |
| D15 | Results screen fits a 360 px phone; one pinned button, 11% of the screen | Dias | ready |
| D16 | Editable bill lines on the upload and results screens | Dias | ready |
| D17 | "Explained by the model / locally" badge on the results screen | Dias | ready |
| D18 | Empty states and problems in plain words, calm offline note | Dias | ready |
| D23 | Screenshots retaken from the live site | Dias | waits for H23 |


## Stage 6: before the pitch

| ID | Package | Who | Status |
|----|---------|-----|--------|
| D19 | Pricing page: free check, Start, and Family and Pause as the plan for later | Dias | ready |
| D20 | First screen understood in ten seconds | Dias | ready |
