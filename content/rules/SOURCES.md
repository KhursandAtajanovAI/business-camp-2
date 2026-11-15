# Sources of the rules

Owner: Adilet. Every rule was compared with its source by opening the page or the PDF
on **November 15, 2026**. "Confirmed" means the official source states what the rule checks.
When it does not, the rule says so and the engine never goes above "worth asking".
The same facts live next to each rule in this folder (`sourceSays`, `sourceCheck`, `checkedOn`).

| Rule | Official source | What the source says | Result | Confidence in the product |
|---|---|---|---|---|
| `duplicate-line` | [CMS, Check your medical bill for errors](https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/check-your-bill-errors) | "Make sure you weren't billed twice for the same service." | confirmed | likely; worth asking without a code or date |
| `birth-package` | [CMS, NCCI Policy Manual for Medicare Services, Chapter VII, Section G (revision of January 1, 2026)](https://www.cms.gov/files/document/07-chapter7-ncci-medicare-policy-manual-2026-final.pdf) | Total packages "include antepartum care, the delivery, and postpartum care"; 59050, 59051, 59300 and 59414 are included in the delivery codes and "are not separately reportable". | confirmed for the four named parts; principle only for the others | likely for the four named parts; worth asking for the others |
| `balance-above-eob` | [CMS, How to read a health insurance explanation of benefits](https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/read-explanation-benefits) | "Your bill should not be higher than the Patient Balance. If it is, talk to your provider." | confirmed | likely |
| `insurance-not-applied` | [same CMS page](https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/read-explanation-benefits) | Same sentence. That the bill was printed before the payment arrived is our reading. | confirmed (the comparison) | likely |
| `mother-baby-repeat` | [CMS, Check your medical bill for errors](https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/check-your-bill-errors) | Only that double billing "is especially common if you got care from more than one provider". Nothing about mother and baby. | **not confirmed** | worth asking |
| `out-of-network-surprise` | [CMS, Know your medical bill rights when using insurance (No Surprises Act)](https://www.cms.gov/medical-bill-rights/know-your-rights/using-insurance) | "You're protected from out-of-network charges when you get care related to a visit to an in-network" hospital; anesthesiology, pathology, radiology, neonatology and laboratory providers "aren't allowed to ask you to sign a notice and consent form". | confirmed | likely for anesthesia and lab with an EOB; worth asking otherwise |
| `price-above-reference` | [Kentucky Medicaid, 2026 Clinical Diagnostic Laboratory Fee Schedule](https://www.chfs.ky.gov/agencies/dms/DMSFeeRateSchedules/2026ClinicalLabRates.pdf) | The rates themselves (see `src/engine/rules/reference-prices.ts`). No source says ten times a rate is wrong. | data only; the threshold is ours | worth asking |
| `once-per-birth` | [CMS, NCCI Policy Manual, Chapter VII](https://www.cms.gov/files/document/07-chapter7-ncci-medicare-policy-manual-2026-final.pdf) | Lists the delivery codes, sets no limit per birth, does not mention anesthesia for labor. | **not confirmed** | worth asking (was likely) |
| `total-mismatch` | [CMS, How to read a medical bill](https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/how-read-your-bill) | Total charges are "the full price for the service(s) and/or item(s)". | confirmed (a definition plus arithmetic) | sure; worth asking when the paper was hard to read |
| `preventive-care-charged` (new) | [HealthCare.gov, Preventive care benefits for children](https://www.healthcare.gov/preventive-care-children/) and [Breastfeeding benefits](https://www.healthcare.gov/coverage/breast-feeding-benefits/) | "Most health plans must cover a set of preventive health services for children at no cost", including "well-baby and well-child visits", in network; "$0 cost isn't guaranteed in all cases". Breastfeeding support and equipment must be covered "except for grandfathered plans". | confirmed, with the source's own caveats | worth asking |
| `stay-not-covered` (new) | [CMS, Newborns' and Mothers' Health Protection Act](https://www.cms.gov/cciio/programs-and-initiatives/other-insurance-protections/nmhpa_factsheet) | Plans "may NOT restrict benefits for a hospital stay in connection with childbirth to less than 48 hours following a vaginal delivery or 96 hours following a delivery by cesarean section". | confirmed; days instead of hours is our approximation | worth asking |

## What changed after the check

- `once-per-birth` went from likely to worth asking: the chapter it cited does not set the limit.
- `birth-package` now says likely only for the four parts the manual names by number.
- `total-mismatch` now says worth asking when part of the paper could not be read.
- `duplicate-line`, `balance-above-eob`, `insurance-not-applied` and `total-mismatch` got a more
  exact CMS page than the general one they pointed to before.

## Reference prices

`src/engine/rules/reference-prices.ts` holds 31 lab tests that are common around a birth. Every
price was read from the Kentucky Medicaid 2026 schedule above (effective January 1, 2026, revised
September 23, 2026) and carries the source, the link and the year. It is what one state Medicaid
program pays, not what a private plan must pay, so the rule only says "worth asking".
One more price is verified but not switched on yet: blood group typing, 2.99 dollars (see the note in that file).

## What we could not check

- The two new rules recognise the care by the words on the paper ("well-baby visit", "room and board"),
  not by billing codes: we found no official code list we may use, so we did not invent one.

- Three numbers for care before and after the birth (59425, 59426, 59430) and the number for
  anesthesia for labor (01967) are not named in the CMS chapters we read. They stay in the
  engine as unverified, and findings that rest on them only say "worth asking".
- Private plans are not bound by a Medicare manual. That is why even confirmed rules stop at "likely".
- State laws (for example on surprise bills) can add protections. We checked federal sources only.
