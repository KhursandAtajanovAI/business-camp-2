# Work packages

Take a package by putting your name in "Who" and setting the status to `in progress`.
Statuses: `not started` -> `in progress` -> `ready` -> `merged`.
Stages: 0 skeleton, 1 core, 2 full path (all P0), 3 retention (P1), 4 growth (P2).

## Khursand: intake, letters, payments, case file, deck, merges

| ID | Package | Folder | Stage | Who | Status |
|----|---------|--------|-------|-----|--------|
| H0 | Skeleton, contracts, README | root, `src/contracts` | 0 | Khursand | ready |
| H1 | Upload a file or paste text | `src/intake/upload` | 1 | Khursand | ready |
| H2 | Parse a paper into the shared format | `src/intake/parse` | 1 | Khursand | ready |
| H3 | Hide personal data | `src/intake/redact` | 1 | Khursand | ready |
| H4 | Letter and call-script templates | `content/letters` | 2 | Khursand | ready |
| H5 | Claim letter as a PDF | `src/letters/letter` | 2 | Khursand | ready |
| H6 | Call script | `src/letters/call-script` | 2 | Khursand | ready |
| H7 | Payments: plans and Stripe | `src/payments` | 2 | Khursand | ready |
| H8 | Escalation steps | `src/letters/escalation` | 3 | Khursand | ready |
| H9 | Case file: storage and deadlines | `src/case-file/store` | 3 | Khursand | ready |
| H10 | Reminders and calendar file | `src/case-file/reminders` | 3 | Khursand | ready |
| H11 | Outcome loop: won or lost | `src/case-file/outcomes` | 3 | Khursand | ready |
| H12 | Connector to ChatGPT and Claude | `src/connector` | 4 | Khursand | ready |
| H13 | Appeal after an insurance denial | `src/letters/appeal` | 4 | Khursand | ready |
| H14 | Deck, up to 10 slides | `docs/deck` | 1-4 | Khursand | ready, screenshots and live link to add |
| H15 | Merges into main and final check | `main` | 0-4 | Khursand | in progress: pull requests wait for merge and deploy |

## Adilet: rules, explanations, demo data, economics

| ID | Package | Folder | Stage | Who | Status |
|----|---------|--------|-------|-----|--------|
| A1 | Rule: repeated line | `src/engine/rules` | 1 | Khursand (handed over) | ready |
| A2 | Rule: service belongs to the birth package | `src/engine/rules` | 1 | Khursand (handed over) | ready |
| A3 | Result: money in question and confidence | `src/engine/checks`, `src/engine/money` | 1 | Khursand (handed over) | ready |
| A4 | Plain-English rule descriptions | `content/rules` | 1 | Khursand (handed over) | ready |
| A5 | Five synthetic bill sets | `content/demo-documents` | 1 | Khursand (handed over) | ready |
| A6 | License check of CMS and AMA data | `docs/economics` | 1 | Khursand (handed over) | ready |
| A7 | Rule: bill disagrees with the EOB | `src/engine/matching` | 2 | Khursand (handed over) | ready |
| A8 | Rule: repeats between mother and baby | `src/engine/matching` | 2 | Khursand (handed over) | ready |
| A9 | Plain-English explanations | `src/explain` | 2 | Khursand (handed over) | ready |
| A10 | Unit economics with sources | `docs/economics` | 2 | Khursand (handed over) | ready |
| A11 | Rule: out-of-network doctor in an in-network hospital | `src/engine/rules` | 3 | Khursand (handed over) | ready |
| A12 | Rule: price above public prices | `src/engine/rules` | 3 | Khursand (handed over) | ready |
| A13 | Bill health score | `src/engine/money` | 3 | Khursand (handed over) | ready |
| A14 | Helper chat | `src/explain` | 3 | Khursand (handed over) | ready |
| A15 | Survey or interviews | `docs/economics` | 3 | Khursand (handed over) | ready |
| A16 | More rules, all rules on all sets | `src/engine`, `content` | 4 | Khursand (handed over) | ready |

## Dias: screens, design, hints, lessons, game

| ID | Package | Folder | Stage | Who | Status |
|----|---------|--------|-------|-----|--------|
| D1 | Design system | `src/design` | 1 | Dias | in progress |
| D2 | Home page and "try a sample" | `src/app/home` | 1 | Dias | in progress |
| D3 | Upload screen | `src/app/upload` | 1 | Dias | in progress |
| D4 | Results screen | `src/app/results` | 2 | Dias | in progress |
| D5 | Hints and glossary | `src/components/hint` | 2 | Dias | in progress |
| D6 | Letter and call-script screen | `src/app/letter` | 2 | Dias | in progress |
| D7 | Pricing and payment screen | `src/app/pricing` | 2 | Dias | in progress |
| D8 | Mobile version, empty and error states | `src/components`, `src/app` | 2 | Dias | in progress |
| D9 | Case file screen | `src/app/case` | 3 | Dias | in progress |
| D10 | Micro-lessons | `content/lessons`, `src/app/lessons` | 3 | Dias | in progress |
| D11 | Detective game | `src/app/game` | 4 | Dias | in progress |
| D12 | Share a report without personal data | `src/app/share` | 4 | Dias | in progress |
| D13 | Screenshots for the deck | `docs/screens` | 4 | Dias | in progress |
| D14 | Check of English texts and disclaimers | `src`, `content` | 4 | Dias | in progress |
