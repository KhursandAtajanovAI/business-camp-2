# Business Cup 2.0 — birth bill check

> Status: ready for submission (hackathon build). All stages are merged into `main`.

A website for new parents in the United States. A parent uploads a birth bill, sees
the mistakes we found and the money in question, and gets a ready claim letter with a
call script. All papers of one family live in one case file with gentle reminders.

The check is free. The letter, the call script and case support cost $29 once or
$14.99 a month. We never promise a refund and we do not give medical or legal advice.

## Run it

Requirements: Node.js 22 or newer and npm.

```bash
npm install
cp .env.example .env.local   # optional: add test keys, the site also works without them
npm run dev                  # http://localhost:3000
```

Checks, the same ones CI runs:

```bash
npm run typecheck
npm test
npm run build
```

## Dependencies

| Package | Why |
|---|---|
| next, react, react-dom | the website |
| typescript | types double as contracts between the three work streams |
| tailwindcss | styles |
| pdf-lib | builds the claim letter PDF from a template |
| unpdf | reads text from an uploaded PDF |
| stripe | checkout in Stripe test mode |
| vitest | tests for the rules and every module |

## How it is built

Rules and math are plain code with tests. A language model only explains findings
that the code has already made, and personal data is hidden before any text leaves
the browser for the model.

```
upload or paste -> src/intake (parse, hide personal data)
                -> src/engine (rules find problems, money in question)
                -> src/explain (plain-English explanation)
                -> src/model-review (a live model explains the findings on this bill; code checks its numbers)
                -> src/letters (claim letter PDF, call script, next steps)
                -> src/payments (paywall, Stripe test mode)
                -> src/case-file (deadlines, reminders, won or lost)
```

One topic is one folder. Every folder has a short README and one owner.

| Folder | Owner | What is inside |
|---|---|---|
| `src/contracts` | Khursand | shared data types, the only link between streams |
| `src/intake`, `src/letters`, `src/case-file`, `src/payments`, `src/connector`, `src/model-review` | Khursand | upload, letters, case file, payments, assistant connector, live model review |
| `content/letters`, `docs/deck` | Khursand | letter templates, pitch deck |
| `src/engine`, `src/explain`, `content/rules`, `content/demo-documents`, `docs/economics` | Adilet | rules, explanations, synthetic bills, unit economics |
| `src/app`, `src/components`, `src/design`, `content/lessons`, `docs/screens` | Dias | screens, design, lessons |

## Where the language model works

- `POST /api/review`: the model reads the lines of the person's own bill and explains each finding.
  Code checks every dollar amount in the answer against the papers.
- `POST /api/helper`: the helper chat answers questions about the person's own case.
- Without `ANTHROPIC_API_KEY` both answer with ordinary code and say so (`mode: "local"`).
  `GET /api/review` shows which mode the site is in.

What comes next for the product is in [docs/ROADMAP.md](docs/ROADMAP.md).

## Working together

See [CONTRIBUTING.md](CONTRIBUTING.md). Short version: one branch per stage and person
(`stage-1/khursand-intake`), commits named `Stage N / Commit M: what the product can do now`,
nobody pushes to `main`, Khursand merges.

## Safety

No secrets in the repository, only `.env.example`. All demo documents are synthetic.
See [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
