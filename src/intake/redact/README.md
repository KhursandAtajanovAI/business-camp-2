# src/intake/redact

Owner: Khursand. Hides personal data before any text goes to a language model.

- `patterns.ts` — what counts as personal: names, addresses, dates of birth, policy,
  member, account and claim numbers, phone numbers, emails, Social Security numbers.
- `redact.ts` — replaces each of them with a plain marker such as `[hidden name]`.

Charges, codes, service dates and the provider name stay, because the check needs them.
The parser in `../parse` is ordinary code and runs on the device, so it may see the full text.
