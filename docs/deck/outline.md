# Deck outline (first draft)

Ten slides at most, title included. English only. A source under every number.
Rule for every slide: one message, said in one sentence at the top.

## 1. Title

**[Product name]: your birth bills, checked.**
For new parents in the US. We find billing mistakes and write the letter for you.
Team: Khursand, Adilet, Dias. Live link and repository on the slide.

## 2. The person and the pain

**Maya had a baby in March. By May she has nine papers and no idea which are right.**
- One birth produces separate papers: the hospital for the mother, the hospital for the baby,
  the anesthesiologist, the obstetrician, the lab, the pediatrician, and an insurance
  explanation (EOB) for each.
- She is tired, the papers use codes, and nobody tells her what to check.
- [number: average out-of-pocket cost of a birth with employer insurance, with source]
- [number: share of insured adults who got a bill they did not expect, and how few challenge it, with source]

## 3. What we do

**Upload a bill, see what is worth asking about, send a ready letter.**
1. Upload a photo or PDF, or paste the text. Or try a sample.
2. Our rules check every line and compare the bill with the insurance explanation.
3. You see the money in question and a plain-English reason for each finding.
4. You get a claim letter (PDF) and a call script.
[screenshot: upload] [screenshot: results] [screenshot: letter]

## 4. Why it is a real product, not a chat wrapper

**Code does the math. The model only explains.**
- Rule engine with tests: every rule has a public source and a confidence level.
- Sample bills run through the same pipeline as real uploads.
- Names, addresses and policy numbers are hidden before any text reaches the model.
- No medical or legal advice; we say "money in question", never "we will get your money back".
[number: how many rules, how many tests]

## 5. Why parents come back

**A birth is not one bill. It is half a year of papers.**
- Case file: all papers of one family, with deadlines.
- Gentle reminders on the site and in the calendar.
- Outcome loop: mark a claim as won or lost and see how much the family saved.
- Next steps after a refusal, and an appeal letter after an insurance denial.
[screenshot: case file]

## 6. Business model

**The check is free. People pay for the action.**
- $29 once, or $14.99 a month while the case is open. Cancel in one click.
- Paywall in front of the letter and call script; Stripe checkout (test mode in the demo).
- [number: what competitors charge, with source]
[screenshot: pricing]

## 7. Unit economics

**One paying family covers the cost of reaching several.**
- [number: births per year in the US, with source]
- [number: conversion from free check to paid, benchmark with source or marked "estimate"]
- [number: retention benchmark for monthly plans, with source]
- [number: CAC and LTV, with source or marked "estimate"]

## 8. What is different

**Narrow on purpose: one life event, done properly.**
| | General bill tools | Human advocates | Us |
|---|---|---|---|
| Focus | any bill | any bill | birth only: mother and baby papers together |
| How | chat answer | a person, weeks | rules with sources, minutes |
| Price | varies | share of savings | $29 flat |
- Not a copy of Finelo, Coursiv or Subpilot: no courses, no subscription tracker.
- Micro-lessons and a detective game live inside the product, on the family's own case.
- A connector lets ChatGPT and Claude read a bill review.

## 9. Roadmap

**After the birth: the first year, then the next child.**
- Next: pediatrician and vaccine bills of the first year, emergency visits, the partner's bills.
- Later: a yearly family plan; a money-back guarantee on the letter.
- B2B (benefits for employers and doulas) only as a later channel, the payer stays the parent.

## 10. Ask and proof

**Try it now, no sign-up.**
- Live link, QR code, public repository with stage-by-stage history.
- [number: real people who tried it during the hackathon, quotes if we have them]
- Disclaimer: not medical or legal advice.
