# src/app/pricing

Owner: Dias.

The pricing screen (`/pricing`): the free check and the two plans, in honest words, with no timers and no pressure.
Plan names and prices come from `src/payments`; a plan button calls `startCheckout` and sends the person to the payment page.
`?returnTo=/letter` says where to come back after paying.

Three steps of the family path are shown: the free check, Start (the two plans on sale now) and, as a plan
with no button, Family and Pause (`later-plans.tsx`, prices from `src/contracts/family`, marked as assumptions).
