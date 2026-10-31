# CriticalEye: response to the product and technical review

Matheus Barros · 31 Oct 2026 · copy of the reply kept in Claude

## Summary

Of your 28 proposals, I adopted 19 as written, adjusted 5 and did not adopt 4. The biggest change is the pilot site: it will start in CTI 5, a 6-bed clinical/general ICU, with CTI 1 and CTI 2 later.

The other changes that affect your work most:

- **Storage:** test the folder approach on hospital PCs first, one editor at a time. IT comes in only if the test fails or before expanding.
- **Sign-in:** physicians enter with CRM + a 4-digit PIN. ADM keeps the shared button, and ADM entries stay "awaiting review" until a physician confirms them.
- **Prototype:** the confirmed defects are now fixed in the prototype itself, so the logic you port is already correct.
- **Pilot scope:** both of your options go to the ICU chief, without a recommendation from me.

Thank you for the careful review. It found real defects that would have reached production.

## Decisions

The adjustments keep your intent but avoid waiting on IT or on extra approvals before the pilot. Rows follow the order of your review.

| # | Your proposal | Decision | Notes |
| --- | --- | --- | --- |
| 1 | Persistent encounter ID, separate from the bed; two identifiers, never the bed | Adopted | TI MED exposes only the record number, so the app creates its own encounter ID. |
| 2 | Admissions enter the live census at once; the morning round is kept as a snapshot | Adopted | Short admission form marked "admissão incompleta"; the next round completes it. |
| 3 | Carry facts forward with their original times and a review state | Adopted | One "conferido hoje" click per section, not per field, to keep the round light. |
| 4 | Take concrete storage options to IT while testing the folder path | Adjusted | Folder test on real PCs first, one editor at a time. IT only if the test fails or before expanding, so the project never waits on IT. |
| 5 | Honest save states, backup and restore, enforceable locks, idempotent day opening, offline fonts and PDF reader, real copy, keyboard access | Adopted | All items. |
| 6 | Individually attributable access agreed with IT | Adjusted | Physicians: CRM + 4-digit PIN, no IT dependency. ADM keeps the shared button. Known limit: it prevents mix-ups, not misuse. |
| 7 | Revision history; "reviewed" separate from "last edited"; handover tied to a version | Adopted | ADM entries show "aguardando conferência" until a physician confirms them. |
| 8 | Fix the confirmed prototype defects | Adopted | Fixed in the prototype itself (Branco and Cti2) before porting. |
| 9 | Missing is not zero; provisional fluid balance | Adopted | "PARCIAL" on screen, note, handover and print. |
| 10 | Allow an unknown insertion date | Adopted | Never blank. "Desconhecida" creates a to-do; the pilot counts confirmed and unknown dates separately. |
| 11 | New infusions start empty; pharmacy-approved concentration catalogue | Adjusted | Infusions start empty and need drug, concentration and rate. The catalogue stays the unit standard, without formal pharmacy sign-off. |
| 12 | eGFR shown with its limits, without the G category | Not adopted | CKD-EPI 2021 stays as in the prototype, G category included. |
| 13 | Take two pilot scopes to the ICU chief | Adopted | Both go, without a recommendation. Validation means automated reference cases run on every change, with no separate reviewer. |
| 14 | Imports as reconciliation: identity match, current to proposed, no duplicates, confirmed D0 kept | Adopted |  |
| 15 | Commit and verify before deleting the temporary PDF | Not adopted | The PDF is deleted right after import. The original stays in TI MED, so a failed save means downloading it again. |
| 16 | Confirm what PVP means; keep the raw source wording | Adopted | PVP is punção venosa profunda, a central venous catheter. The raw wording is kept beside the mapped field. |
| 17 | Persistent patient banner, "not reviewed today" marks, per-doctor review list | Adopted |  |
| 18 | Acuity separate from palliative status; "review device need" with CCIH thresholds | Adopted |  |
| 19 | Larger clinical text and better contrast, tested on the oldest monitor | Not adopted | Current sizes stay. |
| 20 | Test the TI MED character policy before writing a sanitizer | Adjusted | No TI MED test for now. The list gains comma, period and parentheses: letters, digits, accents and / - : > < + % , . ( ) |
| 21 | Versioned handover, acknowledged version, filter with a hidden count, owned tasks | Adopted |  |
| 22 | Print may overflow to numbered continuation pages | Adopted | Two beds per sheet stays as a compact option. |
| 23 | Separate hospital policy from LGPD conclusions | Adopted | The requirements text will be rewritten; "no cloud" stays as a hospital rule. |
| 24 | Intended-use statement and the hospital's assessment under RDC 657/2022 | Adopted | One page, before the calculators are switched on. |
| 25 | Brain-death workflow corrections | Adopted | Starts "não avaliado", with pending, interrupted and inconclusive states; core temperature above 35 °C; family informed by the attending physician (art. 8); term filled by the examiners (art. 7); CIHDOTT coordinates. |
| 26 | Validation by nursing, pharmacy, CCIH and CIHDOTT; a palliative consult alone never changes support level | Not adopted | No formal sign-off per team. The design already changes the support level only through a recorded decision. |
| 27 | Stages A to C, starting in one station | Adjusted | Same stages, starting in CTI 5 (clinical/general, 6 beds); CTI 1 and CTI 2 later. |
| 28 | Indicators with denominators and agreed pause criteria | Adopted |  |

## Answers to your questions

Most answers are known now; three items still depend on IT, pharmacy or a later decision.

| Your question | Answer |
| --- | --- |
| Is CTI 2's shared Windows profile temporary? | No. It is how that unit works and is hard to change, but everyone has an individual login to the hospital system. |
| Does TI MED export an encounter ID? | No, only the medical record number (prontuário). The app will create its own encounter ID. |
| Which task saves the most time? | Writing the daily note, updating day counts and dates, and gathering lab and imaging results. Baseline times are still to be measured. |
| Who maintains the project after a change of post? Is external distribution planned? | Not decided yet. |
| Who reviews ADM entries overnight? | ADM enters everything in the morning; the on-call and the routine physician both review it. |
| What do PVP and "de N" mean? | PVP is punção venosa profunda (decision 16). "de N" is still unknown and will be checked with IT or pharmacy. |
| How often do the network and printer fail? | Unknown; to be asked to IT. |

## Next steps

The prototype fixes are done, so you can port from correct logic; the Stage A test on CTI 5 computers comes next.

1. Done: the confirmed defects are fixed in the prototype (Branco and Cti2), along with decisions 2, 9, 10, 11, 18, 25 and the hidden-count filter from 21, and pushed to the repository. The other adopted screens (patient banner, review marks, PIN, import reconciliation, print continuation) are still to be drawn.
2. Update the requirements report: CTI 5 first, the LGPD wording, CRM + PIN, and the TI MED character list.
3. Write the one-page intended-use statement (decision 24).
4. Present the two pilot scopes to the ICU chief (decision 13).
5. Run Stage A on CTI 5 computers with fictional records: save, reopen, failed save and backup restore.

Still open: what "de N" means, how often the network and printer fail, and who maintains the app long term.
