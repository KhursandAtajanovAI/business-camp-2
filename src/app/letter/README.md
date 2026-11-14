# src/app/letter

Owner: Dias.

The letter and call-script screen (`/letter`).

- Not paid yet (`hasPaid()` from `src/payments` is false): says what is ready and leads to the plans.
- Paid: asks `src/letters` for the letter package and shows the download button, the call script and what to do next.
