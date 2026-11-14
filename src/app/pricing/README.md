# src/app/pricing

Owner: Dias.

The pricing screen (`/pricing`): the free check and the two plans, in honest words, with no timers and no pressure.
Plan names and prices come from `src/payments`; a plan button calls `startCheckout` and sends the person to the payment page.
`?returnTo=/letter` says where to come back after paying.
