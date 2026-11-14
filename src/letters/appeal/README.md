# src/letters/appeal

Owner: Khursand. The appeal letter after an insurance denial.
`build-appeal.ts` reads the family case file: it finds the insurance explanation (EOB),
lists the services the plan paid nothing for, adds the findings the family already raised,
and fills the template from `content/letters/appeal-letter.ts`.
The plan name, member ID and claim number stay blank lines: we do not keep them.
