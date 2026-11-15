# Accuracy of the rules: a measurement, not an estimate

Owner: Adilet. This page answers one question for the deck: **when the engine says
"this is worth asking about", how often is it right, and how much does it miss?**

The numbers between the two markers below are written by a test from a real run of the
engine (`src/engine/accuracy`). The same test fails if this page and the engine disagree,
so nobody can edit the numbers by hand.

## What was measured

Every labelled set is a small family story with its papers and a list of the mistakes
planted in it. Each paper goes the same way an upload goes: text, `parseDocument`, `analyze`.

| Group | What it is | Why it is here |
|---|---|---|
| sample | the five sets behind the "try a sample" button | the rules were written together with these sets, so a perfect score here proves little |
| clean | papers with nothing wrong | any finding is a false alarm |
| tricky | papers that look wrong but have an innocent explanation in the story (twins, a test really done twice, a corrected insurance explanation) | the engine cannot read the story, so this is where false alarms come from |
| mistakes | mistakes in shapes the sample sets do not have | shows what the engine misses |

How we count:

- **Found**: the expected rule spoke up with exactly the expected amount in cents.
- **Missed**: a planted mistake with no such finding. `no-rule-yet` marks a mistake no rule covers.
- **False alarm**: a finding that is not in the planted list.

## Result

<!-- measured:start -->
Rules in the engine: 11. Labelled sets: 20. Planted mistakes: 22.

**Headline: the engine found 20 of 22 planted mistakes (91%). It raised 22 findings, and 20 of them were planted (91%); 2 were false alarms.**

On the 6 sets with no mistake in them, the engine stayed silent on 4.

| Group | Sets | Planted | Found | Missed | False alarms | Found, % | Findings that were right, % |
|---|---|---|---|---|---|---|---|
| sample | 5 | 10 | 10 | 0 | 0 | 100% | 100% |
| clean | 3 | 0 | 0 | 0 | 0 | n/a | n/a |
| tricky | 3 | 0 | 0 | 0 | 2 | n/a | 0% |
| mistakes | 9 | 12 | 10 | 2 | 0 | 83% | 100% |
| **all** | 20 | 22 | 20 | 2 | 2 | 91% | 91% |

### By rule

| Rule | Planted | Found | Missed | False alarms |
|---|---|---|---|---|
| `balance-above-eob` | 3 | 3 | 0 | 0 |
| `birth-package` | 4 | 4 | 0 | 1 |
| `duplicate-line` | 2 | 1 | 1 | 1 |
| `insurance-not-applied` | 1 | 1 | 0 | 0 |
| `mother-baby-repeat` | 1 | 1 | 0 | 0 |
| `no-rule-yet` | 1 | 0 | 1 | 0 |
| `once-per-birth` | 2 | 2 | 0 | 0 |
| `out-of-network-surprise` | 2 | 2 | 0 | 0 |
| `preventive-care-charged` | 1 | 1 | 0 | 0 |
| `price-above-reference` | 3 | 3 | 0 | 0 |
| `stay-not-covered` | 1 | 1 | 0 | 0 |
| `total-mismatch` | 1 | 1 | 0 | 0 |

### Every miss and every false alarm

- `check-tricky-1`: **false alarm** from `birth-package`, $2,100.00.
- `check-tricky-2`: **false alarm** from `duplicate-line`, $58.00.
- `check-mistake-2`: **missed** `duplicate-line`, $418.00. Pharmacy on 08/12/2026 is billed on both statements.
- `check-mistake-7`: **missed** `no-rule-yet`, $950.00. One nursery day too many: the mother's bill shows a two-day stay.
<!-- measured:end -->

## The number for the deck

Use the headline sentence above, word for word, with "on 20 synthetic labelled sets" next to it.
Say it together with the first row of the history table: 77% (17 of 22) before the rules were improved on the same sets.
Do not use the 100% of the sample group alone: those sets and the rules were written together.

## What this number does not tell us

- **All papers are synthetic.** We have no real bills, so this is not accuracy on real families' papers.
- **The sets are few and written by us.** 22 planted mistakes is a small sample; one more miss moves the result by about 5 points.
- **We wrote the sets knowing the rules.** We tried to label them the way a careful person would
  (the story decides what is a mistake, not the engine), but an outside set would be a fairer test.
- **Text, not photos.** The papers enter as clean text. A photo read badly by the browser adds
  errors this page does not count.
- **A false alarm here is still only a question.** The product says "worth asking", never "error",
  and the three tricky cases are exactly the kind where asking is reasonable.

## History

| When | Rules | Found | False alarms | Note |
|---|---|---|---|---|
| Stage 5 / Commit 1 | 9 | 17 of 22 (77%) | 3 of 20 findings | first measurement, rules as merged in stage 4 |
| Stage 5 / Commit 3 | 11 | 19 of 22 (86%) | 3 of 22 findings | two new rules: `preventive-care-charged`, `stay-not-covered` |
| Stage 5 / Commit 4 | 11 | 19 of 22 (86%) | 3 of 22 findings | reference prices grew from 2 to 31 lab tests; no number moved, because no labelled set has a new overpriced test |
| Stage 5 / Commit 5 | 11 | 20 of 22 (91%) | 2 of 22 findings | a bill is matched to its insurance explanation even when the plan shortens the provider's name, and a corrected explanation replaces the earlier one |

The gain from 77% to 91% is **not independent evidence**. The two new rules and the matching fix
were written by people who already knew the check sets they now solve (`check-mistake-1`,
`check-mistake-8`, `check-mistake-9`, `check-tricky-3`). The honest number for rules meeting
papers they were not written for is the first row: 77% found, 3 false alarms.

## What is still wrong, and why we left it

- `check-tricky-1` (twins) and `check-tricky-2` (a test really done twice): the engine cannot know
  the story. Both findings are marked "worth asking" or "likely" and worded as a question.
- `check-mistake-2` (the same charge on two statements): hospitals often send the same charges
  again on a later statement. Treating every such repeat as a mistake would raise many false alarms,
  so the rule looks for repeats inside one paper only.
- `check-mistake-7` (one nursery day too many): no rule compares the baby's days with the mother's stay yet.

## How to repeat it

```bash
npm test                      # fails if this page and the engine disagree
UPDATE_ACCURACY=1 npm test    # rewrites the measured part after a rule changes
```

The labelled sets are in `content/demo-documents` (sample) and `content/demo-documents/accuracy` (the rest).
