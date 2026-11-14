# src/payments

Owner: Khursand. Two plans and Stripe in test mode.
Screens import only from `index.ts`:

- `plans` — names and prices to show ($29 once, $14.99 a month).
- `startCheckout(plan, returnTo)` — gives a link to the payment page. Send the person there.
- `hasPaid()` — true after a successful payment. Use it to open the letter and call script.

How a payment goes: the screen calls `startCheckout`, the person pays on Stripe,
Stripe sends them to `/api/payments/return`, that page asks the server to confirm the
payment, remembers it in the browser and goes back to `returnTo`.

- `client/` — what runs in the browser (remembering the payment).
- `server/` — what runs on the server (talking to Stripe). Never import it from a screen.
- Routes live in `src/app/api/payments/*` and only call `server/`.

Without `STRIPE_SECRET_KEY` the site uses a built-in checkout page that is clearly marked
as a test and never asks for a card. Live Stripe keys are refused: this build only takes test payments.
The paid mark lives in the browser, which is enough for a demo without accounts;
a real launch would check the payment on the server for every paid action.
