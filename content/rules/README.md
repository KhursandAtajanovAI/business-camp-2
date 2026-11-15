# content/rules

Owner: Adilet. One file per rule: what it looks for in plain English, the short
explanation shown next to a finding, the source, and why findings get the confidence they get.

| Rule | Looks for | Confidence | Source check |
|---|---|---|---|
| `duplicate-line` | the same line twice on one bill | likely | confirmed, CMS |
| `birth-package` | part of the birth package billed again | likely / worth asking | confirmed for the four named parts, CMS |
| `balance-above-eob` | bill asks more than the EOB says | likely | confirmed, CMS |
| `insurance-not-applied` | bill printed before insurance paid | likely | confirmed, CMS |
| `mother-baby-repeat` | same charge on mother's and baby's bill | worth asking | not confirmed |
| `out-of-network-surprise` | out-of-network provider in an in-network hospital | likely / worth asking | confirmed, CMS |
| `price-above-reference` | price over ten times a public price list | worth asking | official prices, our threshold |
| `once-per-birth` | once-per-birth service with quantity above one | worth asking | not confirmed |
| `total-mismatch` | total higher than the lines add up to | sure / worth asking | CMS definition plus arithmetic |
| `preventive-care-charged` | well-baby visit or breastfeeding support in network with a charge | worth asking | confirmed, HealthCare.gov |
| `stay-not-covered` | hospital day right after the birth that the plan did not cover | worth asking | confirmed, CMS (federal law) |

The links, the quotes and the date of the check are in [SOURCES.md](SOURCES.md).

A rule whose source does not confirm it (`sourceCheck` is not `confirmed`) can only say `worth asking`;
the engine enforces this in `src/engine/checks/run-rules.ts`. Billing codes are named by number and
described in our own words; see `docs/economics/data-license.md` for why.
