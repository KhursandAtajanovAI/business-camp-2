# Data license check: CMS and AMA files

Short answer: **no CMS or AMA data files are in this repository, and none should be added.**
The rules use a few billing code numbers, described in our own words, and a short hand-written price table (31 lab tests, one public source).

## What we looked at

| Data | Who owns it | May it go in a public repository? | What we do |
|---|---|---|---|
| CPT codes and their official descriptions | American Medical Association (AMA), copyright | **No.** The AMA requires a license for any use of CPT content; the license CMS holds covers CMS programs only. | We never copy official descriptions or code tables. Rules name single code numbers and describe them in our own words. |
| NCCI edit files (pairs of codes that may not be billed together) | CMS publishes them; they contain CPT codes | **No**, not until an AMA license is in place. | Not downloaded, not committed. We use the rule stated in the NCCI Policy Manual text instead. |
| Medicare Physician Fee Schedule files | CMS publishes them; they contain CPT codes and require accepting the AMA license on download | **No.** | Not used. |
| NCCI Policy Manual (text of the rules) | CMS, a US government work | Quoting and citing is fine. | Cited as the source of the birth package rule, with a link. |
| Clinical Laboratory Fee Schedule and state Medicaid lab fee schedules | CMS and states; public documents, but keyed by CPT codes | Whole files: **no**, for the same CPT reason. | A hand-written table of 31 lab prices, each with its source, link and year (`src/engine/rules/reference-prices.ts`). Descriptions are our own words. |
| HCPCS Level II codes, revenue codes | CMS (HCPCS); NUBC (revenue codes, licensed) | HCPCS Level II is public; revenue code tables are licensed. | We only read the codes that are printed on the family's own paper. |

## Where data would be loaded, if licensed later

At deploy time, from the CMS website into server storage, never into git.
Until then the fallback is what the product uses today: a small table of rules written by hand.

## Open risk for a real launch

Showing CPT code numbers next to a family's own bill is common practice, but a commercial
product should get an AMA license before launch. This is a business task for the roadmap, not a hackathon blocker.

## Sources

- AMA, CPT licensing FAQ: https://www.ama-assn.org/practice-management/cpt-licensing
- CMS, License for Use of Current Procedural Terminology: https://www.cms.gov/license/ama
- CMS, NCCI for Medicare (policy manual and edit files): https://www.cms.gov/medicare/coding-billing/ncci-medicare
- CMS, NCCI Policy Manual 2026, Chapter VII: https://www.cms.gov/files/document/07-chapter7-ncci-medicare-policy-manual-2026-final.pdf
