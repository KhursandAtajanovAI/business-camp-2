import type { Plan } from "@/contracts";
import { PAYMENT_KEY } from "../client/payment-store";
import { plans } from "../plans";

const shell = (title: string, body: string) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
  body{margin:0;background:#FFF8F2;color:#3B3340;font:18px/1.5 system-ui,sans-serif;display:grid;place-items:center;min-height:100vh}
  main{background:#fff;border-radius:20px;padding:32px;max-width:420px;margin:16px;box-shadow:0 8px 30px rgba(59,51,64,.08)}
  .tag{display:inline-block;background:#E8B65C;border-radius:999px;padding:2px 12px;font-size:14px}
  a.button{display:block;text-align:center;background:#D9715F;color:#fff;text-decoration:none;border-radius:16px;padding:14px;margin-top:20px;min-height:24px}
  a.quiet{display:block;text-align:center;margin-top:14px;color:#3B3340}
</style></head><body><main>${body}</main></body></html>`;

const price = (cents: number) => `$${(cents / 100).toFixed(2).replace(/\.00$/, "")}`;

// Shown only when Stripe is not set up. It never asks for a card and says so.
export function testCheckoutPage(plan: Plan, payUrl: string, cancelPath: string): string {
  const details = plans[plan];
  return shell("Test checkout", `
    <span class="tag">Test mode</span>
    <h1>${details.name}: ${price(details.priceCents)}${details.billing === "monthly" ? " a month" : ""}</h1>
    <p>${details.summary}</p>
    <p>This is a practice checkout. No card is needed and no real money moves.</p>
    <a class="button" href="${payUrl}">Complete test payment</a>
    <a class="quiet" href="${cancelPath}">Go back</a>`);
}

// Confirms the payment with the server, remembers it in this browser, then goes back.
export function returnPage(sessionId: string, returnPath: string): string {
  return shell("Finishing up", `
    <h1 id="title">One moment</h1>
    <p id="text">We are checking your payment.</p>
    <a class="quiet" href="${returnPath}">Go back</a>
    <script>
      fetch("/api/payments/confirm?session_id=" + encodeURIComponent(${JSON.stringify(sessionId)}))
        .then(function (response) { return response.json(); })
        .then(function (result) {
          if (!result.paid) throw new Error("not paid");
          localStorage.setItem(${JSON.stringify(PAYMENT_KEY)}, JSON.stringify({ plan: result.plan, sessionId: ${JSON.stringify(sessionId)}, paidAt: new Date().toISOString() }));
          location.replace(${JSON.stringify(returnPath)});
        })
        .catch(function () {
          document.getElementById("title").textContent = "The payment did not go through";
          document.getElementById("text").textContent = "Nothing was charged. You can go back and try again whenever you like.";
        });
    </script>`);
}
