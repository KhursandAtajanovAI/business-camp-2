# Unit economics

Every number has a link or the word **estimate**. Estimates are ours and are kept conservative.

## The market and the pain

| Number | Value | Source |
|---|---|---|
| Births in the US, 2024 | 3,628,934 | CDC NCHS, Births in the United States, 2024 (Data Brief 535): https://www.cdc.gov/nchs/products/databriefs/db535.htm |
| Out-of-pocket cost of pregnancy, birth and care after it, employer plans | $2,743 on average | Peterson-KFF Health System Tracker, 2025: https://www.kff.org/health-costs/issue-brief/health-costs-associated-with-pregnancy-childbirth-and-postpartum-care/ |
| Out-of-pocket cost for the newborn | $475 on average | same KFF brief |
| Insured working-age adults who got a bill they thought insurance should have paid | 45% | Commonwealth Fund, 2024: https://www.commonwealthfund.org/sites/default/files/2024-07/Gupta_unforeseen_bills_coverage_denials_PR_2024-08-01.pdf |
| Of those with a billing error, how many challenged it | fewer than half | same Commonwealth Fund report |
| Of those who challenged a bill, how many had it reduced or removed | 38% | same Commonwealth Fund report |

## Price against competitors

| Who | Price | Source |
|---|---|---|
| Goodbill | 20% of the savings | https://www.goodbill.com/faq |
| Bill negotiators in general | 10% to 40% of the savings | third-party guides, for example https://www.careroute.ai/bill-defense/medical-bill-negotiation-cost |
| Us | $29 once, or $14.99 a month | this repository, `src/payments/plans.ts` |

On a correction of $500, a 20% fee is $100; our one-time plan is $29. Over a typical half-year
case the monthly plan costs at most about $90 (6 x $14.99), still inside the competitor range.

## Conversion

| Number | Value | Source |
|---|---|---|
| Download to paid, apps with a hard paywall, median | 10.7% | RevenueCat, State of Subscription Apps 2026: https://www.revenuecat.com/state-of-subscription-apps/ |
| Download to paid, freemium apps, median | 2.1% | same RevenueCat report |
| Our base case: free check to paid | 3% | **estimate**: we are freemium, but the person sees a dollar amount in question before the paywall |

## Revenue for one paying family

| Number | Value | Source |
|---|---|---|
| Share choosing $29 once | 70% | **estimate** |
| Share choosing monthly, staying 3 months | 30%, $44.97 | **estimate**: a birth case lasts about half a year; we assume half of it |
| Average revenue per paying family | $33.79 | 0.7 x $29 + 0.3 x $44.97 |
| Card fee | about $1.28 | Stripe public price, 2.9% + $0.30: https://stripe.com/pricing |
| Hosting and model cost per family | about $0.20 | **estimate**: rules run as code; the model only answers helper questions |
| Contribution per paying family (LTV, first case only) | about $32 | $33.79 - $1.28 - $0.20 |

## CAC

| Number | Value | Source |
|---|---|---|
| Target LTV to CAC | 3 to 1 | common rule of thumb, **estimate** |
| CAC we can afford per paying family | about $10.70 | $32 / 3 |
| That is, per person who runs a free check, at 3% | about $0.32 | $10.70 x 3% |

At $0.32 per visitor, paid ads do not work. The plan is channels that cost time, not money:
referrals between parents ("share with a friend"), parent groups, doulas and childbirth classes,
and search pages that answer "is my hospital bill after birth right".

## Retention

A birth is half a year of papers, not one bill. The paid plan stays useful through the
case file, reminders and the outcome loop, and the monthly plan is cancelled in one click
when the case closes. Growth after that comes from the next events of the same family
(first-year pediatric bills, the next child), which is roadmap, not product.
RevenueCat's reports are the benchmark we will compare our monthly retention against once we have data.

## What would change these numbers

- Conversion is the most uncertain input: at 2.1% the affordable cost per visitor is $0.22, at 10.7% it is $1.14.
- A higher share of monthly plans raises revenue per family but depends on the case staying open.
