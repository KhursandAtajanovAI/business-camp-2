# content/rules

Owner: Adilet. One file per rule: what it looks for in plain English, the short
explanation shown next to a finding, the source, and why findings get the confidence they get.

| Rule | Looks for | Confidence | Source |
|---|---|---|---|
| `duplicate-line` | the same line twice on one bill | likely | CMS Medically Unlikely Edits |
| `birth-package` | part of the birth package billed again | likely | CMS NCCI Policy Manual 2026, Ch. VII, G |
| `balance-above-eob` | bill asks more than the EOB says | likely | the family's EOB; CMS medical bill rights |
| `insurance-not-applied` | bill printed before insurance paid | likely | the family's EOB; CMS medical bill rights |
| `mother-baby-repeat` | same charge on mother's and baby's bill | worth asking | own cross-check, no official source |
| `out-of-network-surprise` | out-of-network provider in an in-network hospital | likely / worth asking | No Surprises Act (CMS) |
| `price-above-reference` | price over ten times a public price list | worth asking | public fee schedule (small table) |
| `once-per-birth` | once-per-birth service with quantity above one | likely | CMS NCCI Policy Manual 2026, Ch. VII |
| `total-mismatch` | total higher than the lines add up to | sure | arithmetic |

A rule without an official source is never marked `sure`. Billing codes are named by number and
described in our own words; see `docs/economics/data-license.md` for why.
