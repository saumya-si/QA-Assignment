# Phase 2 — Prompt 7: Test Coverage Review

**Prompt:** Review `FunctionalTestCase.csv` for requirement traceability, positive/negative/edge coverage, Smoke/Regression classification, step clarity, duplicates, and 5–8 test limit compliance. List issues first, then recommended corrections.

**Artifact reviewed:** `FunctionalTestCase.csv` (8 test cases)

---

## Executive Summary

| Criterion | Verdict |
|-----------|---------|
| Test count (5–8 limit) | ✅ **Pass** — 8 cases |
| Requirement traceability | ⚠️ **Mostly pass** — 3 gaps |
| Positive / negative / edge coverage | ✅ **Pass** — 5 / 2 / 1 |
| Smoke / Regression classification | ✅ **Pass** — 3 Smoke, 5 Regression |
| Step clarity & completeness | ⚠️ **Mostly pass** — 4 gaps |
| Duplicates / low-value cases | ⚠️ **Minor concern** — 1 overlap, no true duplicates |

**Overall:** The CSV is **submission-ready with minor corrections**. No test cases need to be added or removed.

---

## Identified Issues

### Issue 1 — Inconsistent requirement ID naming (TC-MAN-03)

**Finding:** TC-MAN-03 uses `BRW-03` (scenario ID from Prompt 2) while all other cases use risk IDs (`AUTH-R05`, `CHK-R01`, `DCF-R02`, etc.).

**Impact:** Weakens traceability consistency for evaluators mapping tests → risks → ACs.

---

### Issue 2 — AC1 / AC2 not explicitly referenced

**Finding:** No test case includes assessment acceptance criteria labels (`AC1`, `AC2`) in the `RequirementID` column.

**Impact:** Harder to demonstrate direct traceability from assessment ACs to manual tests without cross-referencing Phase 1 docs.

| AC | Manual coverage | Explicit in CSV? |
|----|-----------------|------------------|
| AC1 — Registration, login, profile | TC-MAN-01, 02, 08 | ❌ Implicit only |
| AC2 — Browse, cart, COD, invoice | TC-MAN-03, 04, 05, 06, 07 | ❌ Implicit only |

---

### Issue 3 — TC-MAN-01 profile verification incomplete vs AUTH-R03

**Finding:** AUTH-R03 requires profile to display correct name, email, **and address**. TC-MAN-01 expected result only verifies first name, last name, and email — address is collected at registration but not asserted.

**Impact:** Partial coverage of AUTH-R03 / AC1 profile verification requirement.

---

### Issue 4 — TC-MAN-06 is not self-contained (execution dependency)

**Finding:** TC-MAN-06 precondition states *"depends on TC-MAN-05 or equivalent purchase flow"*. A tester cannot execute TC-MAN-06 in isolation without first completing TC-MAN-05.

**Impact:** Reduces standalone executability; evaluators may flag test design weakness. Steps do not include the checkout portion needed to create an invoice.

---

### Issue 5 — TC-MAN-07 expected result is ambiguous

**Finding:** Expected result reads: *"invoice is NOT generated OR checkout remains incomplete; no new invoice appears (or clear prompt to confirm again is shown)"* — three alternate outcomes with OR logic.

**Impact:** Tester cannot determine pass/fail unambiguously; ActualResult will be inconsistent across testers.

---

### Issue 6 — TC-MAN-05 and TC-MAN-06 overlap on purchase path (low-value split)

**Finding:** Both are `@Smoke` + `Critical`. TC-MAN-05 completes checkout with double Confirm; TC-MAN-06 verifies the invoice from that same flow. Together they form one logical E2E journey split across two cases.

**Impact:** Not a duplicate, but at the 8-test cap this split consumes 2 slots for one user journey. Acceptable for risk traceability (CHK-R01 vs INV-R01) but borderline low-value if evaluator expects maximum breadth.

---

### Issue 7 — CART-R01 not explicitly traced

**Finding:** TC-MAN-04 maps to `CART-R02` (multiple items) and `CART-R03` (qty update) but not `CART-R01` (add product to cart — Critical risk).

**Impact:** Minor traceability gap; add-to-cart is implicitly covered in steps but not reflected in RequirementID.

---

### Issue 8 — TestType value inconsistency

**Finding:** All cases use `Manual`. Assessment template references *"Manual/Functional Test case"*.

**Impact:** Cosmetic only; unlikely to fail evaluation but inconsistent with assessment wording.

---

### Issue 9 — Known coverage gaps (acceptable at 8-test cap, not defects)

**Finding:** The following planned manual scenarios from Phase 1 validation are **not** in the CSV:

| Missing scenario | Risk ID | Reason not included |
|------------------|---------|---------------------|
| Empty cart checkout blocked | CHK-R04 / CRT-08 | 8-test cap prioritization |
| Search no results | BRW-04 | 8-test cap prioritization |
| Weak password rejected | REG-03 | Covered by automation TC-UI-08 path |
| Out-of-stock product | BRW-08 | 8-test cap prioritization |

**Impact:** Acceptable trade-off at maximum test count — not an issue requiring CSV changes unless a case is swapped.

---

## What Passes Review (No Issues)

| Criterion | Evidence |
|-----------|----------|
| **5–8 test limit** | Exactly 8 cases |
| **Positive coverage** | TC-MAN-01, 03, 04, 05, 06 (5 cases) |
| **Negative coverage** | TC-MAN-02, 08 (2 cases) |
| **Edge coverage** | TC-MAN-07 (1 case) |
| **Smoke tag present** | 3 cases (01, 05, 06) |
| **Regression tag present** | 5 cases (02, 03, 04, 07, 08) |
| **Invalid login** | TC-MAN-02 ✅ |
| **Product search** | TC-MAN-03 ✅ |
| **Multi-item cart + qty** | TC-MAN-04 ✅ |
| **COD checkout** | TC-MAN-05 with double Confirm ✅ |
| **Invoice verification** | TC-MAN-06 ✅ |
| **Duplicate email negative** | TC-MAN-08 ✅ |
| **No true duplicate test cases** | Each case has distinct primary assertion |
| **ActualResult / Status blank** | Compliant ✅ |
| **Billing test data** | Matches assessment example (Zoey Shore, etc.) ✅ |
| **Double-confirm documented** | TC-MAN-05 step 6 ✅ |

---

## Recommended Corrections

### Correction for Issue 1 — Standardize TC-MAN-03 requirement ID

**Change `RequirementID` from:**
```
BRW-03
```
**To:**
```
AC2-UI;CART-R01
```
Or minimally add risk context:
```
BRW-03;AC2-UI
```

---

### Correction for Issue 2 — Add AC references to RequirementID column

Apply across all cases:

| TestCaseID | Updated RequirementID |
|------------|----------------------|
| TC-MAN-01 | `AC1-UI;AUTH-R01;AUTH-R02;AUTH-R03` |
| TC-MAN-02 | `AC1-UI;AUTH-R05` |
| TC-MAN-03 | `AC2-UI;BRW-03` |
| TC-MAN-04 | `AC2-UI;CART-R01;CART-R02;CART-R03` |
| TC-MAN-05 | `AC2-UI;CHK-R01;DCF-R01` |
| TC-MAN-06 | `AC2-UI;INV-R01;INV-R03;INV-R04` |
| TC-MAN-07 | `AC2-UI;DCF-R02` |
| TC-MAN-08 | `AC1-UI;AUTH-R06` |

---

### Correction for Issue 3 — Extend TC-MAN-01 profile assertion

**Update ExpectedResult to:**
```
User registers successfully; logs in successfully; profile displays correct first name, last name, email, and registered address details
```

**Add Step 7b:**
```
7b. Verify registered address (street, city, country) is displayed on profile
```

---

### Correction for Issue 4 — Make TC-MAN-06 self-contained

**Option A (recommended):** Merge checkout + invoice into one Smoke E2E and reclassify TC-MAN-06 steps into TC-MAN-05 — *only if willing to free a slot for empty-cart negative*.

**Option B (minimal change):** Expand TC-MAN-06 preconditions and steps to include full checkout:

**Updated Preconditions:**
```
User is logged in; Cart is empty at start of test
```

**Add Steps 1–8 before invoice verification:**
```
1. Add at least one product to cart
2. Proceed to checkout
3. Enter valid billing address
4. Select Cash on Delivery
5. Click Confirm TWICE
6. Verify checkout success message
7. Navigate to My Invoices
8. [existing invoice verification steps]
```

This removes dependency on TC-MAN-05 execution order.

---

### Correction for Issue 5 — Clarify TC-MAN-07 expected result

**Replace ambiguous expected result with:**
```
After a single Confirm click: checkout does NOT complete; no success/invoice confirmation is shown; navigating to My Invoices shows no new invoice for this session; UI prompts user to confirm again or remains on checkout step
```

---

### Correction for Issue 6 — No change required (document rationale)

**Rationale to add in `project-info.md`:**
> TC-MAN-05 and TC-MAN-06 are intentionally split to trace CHK-R01 (checkout) and INV-R01 (invoice) separately, matching the assessment risk register. Both are Smoke because each validates a critical revenue checkpoint.

No CSV change needed unless consolidating to free a slot.

---

### Correction for Issue 7 — Add CART-R01 to TC-MAN-04

**Change RequirementID to:**
```
AC2-UI;CART-R01;CART-R02;CART-R03
```

---

### Correction for Issue 8 — Update TestType

**Change `TestType` from `Manual` to `Functional`** (or `Manual/Functional`) on all rows to match assessment template wording.

---

### Correction for Issue 9 — No CSV change; document in project-info.md

Add an **Out of Scope (Manual)** table listing empty-cart, search-no-results, and out-of-stock scenarios deferred to automation or future regression cycles.

---

## Priority of Corrections

| Priority | Correction | Effort |
|----------|------------|--------|
| **High** | Issue 5 — clarify TC-MAN-07 expected result | 1 line edit |
| **High** | Issue 4 — make TC-MAN-06 self-contained (Option B) | Steps rewrite |
| **Medium** | Issue 2 + 7 — add AC1/AC2 and CART-R01 to RequirementID | Column updates |
| **Medium** | Issue 3 — extend TC-MAN-01 profile address check | 1 step + 1 expected result |
| **Low** | Issue 1 — rename BRW-03 consistency | 1 cell edit |
| **Low** | Issue 8 — TestType to Functional | 8 cell edits |
| **None** | Issue 6, 9 — document rationale only | project-info.md |

---

## Final Verdict

| Question | Answer |
|----------|--------|
| Ready for execution? | ✅ Yes, after High-priority corrections |
| Ready for submission? | ✅ Yes, after Medium corrections applied |
| Need more test cases? | ❌ No — at 8-test cap |
| Need fewer test cases? | ❌ No — within 5–8 range |
| Swap any case? | Optional only — TC-MAN-03 (search) could swap for empty-cart negative if search is covered by UI automation TC-UI-06 |

---

## AI Response Summary

Reviewed 8 manual test cases: compliant with count limit and coverage mix (5 positive, 2 negative, 1 edge; 3 Smoke, 5 Regression). Identified 9 issues — 6 warrant CSV edits (traceability IDs, profile address assertion, TC-MAN-06 self-containment, TC-MAN-07 ambiguous expected result, TestType label), 3 are acceptable gaps or documentation-only. No duplicates; no cases to remove.

---

## Corrections Applied (Prompt 7 follow-up)

| Issue | Change applied |
|-------|----------------|
| Issue 1–2, 7 | AC1-UI/AC2-UI prefixes and CART-R01 added to RequirementID column |
| Issue 3 | TC-MAN-01: address verification step + expected result updated |
| Issue 4 | TC-MAN-06: full checkout flow added; no dependency on TC-MAN-05 |
| Issue 5 | TC-MAN-07: unambiguous single expected result |
| Issue 8 | TestType changed from Manual to Functional on all rows |
