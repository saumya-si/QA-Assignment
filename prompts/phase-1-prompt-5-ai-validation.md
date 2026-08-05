# Phase 1 — Prompt 5: AI Validation Review

**Prompt:** Review previous AI output. Check correctness, missing edge cases, over-complexity, alignment with constraints (5–8 tests). Suggest only necessary corrections.

**Artifacts reviewed:** Prompts 1–4 (`phase-1-prompt-1` through `phase-1-prompt-4`)

---

## 1. Overall Verdict

| Artifact | Correctness | Edge Cases | Complexity | 5–8 Constraint | Status |
|----------|-------------|------------|------------|----------------|--------|
| Prompt 1 — Requirements | ✅ Strong | N/A | ✅ Appropriate | ✅ Noted per tier | **Accept with minor note** |
| Prompt 2 — App Analysis | ⚠️ 2 issues | ⚠️ 2 gaps | ✅ Appropriate | ✅ UI = 8 | **Correct 2 items** |
| Prompt 3 — Risk Analysis | ⚠️ 2 issues | ✅ Good | ⚠️ API over-scoped | ❌ API = 10 planned | **Correct 2 items** |
| Prompt 4 — Responsible AI | ✅ Strong | N/A | ✅ Appropriate | N/A | **Accept; fix Prompt 2 conflict** |

**Bottom line:** Planning quality is solid. Four targeted corrections needed before Phase 2. No full rework required.

---

## 2. Prompt 1 — Requirements Extraction

### ✅ Correct
- Mandatory deliverables, ACs, tools, submission structure accurately extracted from PDF
- Ambiguity register (15 items) is thorough and actionable
- Correct interpretation: plan all flows, automate 5–8 per tier
- `test-data.md` inclusion decision is correct

### ⚠️ Minor note (no edit required)
- Item count says "12 mandatory deliverable categories" — Part B list has 12 numbered items but item 9–10 overlap with structure; acceptable for planning

### ❌ Missing (forward action for Phase 2, not a Prompt 1 defect)
- No explicit decision on **comment/search** Core AC boilerplate — correctly flagged as ambiguous; **resolve in Phase 2 as out-of-scope** with justification in `project-info.md`

**Correction needed:** None to Prompt 1.

---

## 3. Prompt 2 — Application Analysis

### ✅ Correct
- 8 UI tests (TC-UI-01–08) within 5–8 limit
- Smoke + Regression tags present across suite
- AC1 and AC2 both covered
- Double-confirm captured in TC-UI-07
- Positive (5) + negative (3) balance is sound
- Deferred scenarios appropriately assigned to manual CSV

### ❌ Correction 1 — Passwords in public repo (conflicts with Prompt 4)

**Issue:** Pre-seeded accounts table lists `welcome01` in plaintext. Prompt 4 says do not share/commit passwords. Repo is **public**.

**Fix:** Replace password column with:
> `Password: via env var TEST_CUSTOMER_PASSWORD (see .env.example)`

Keep email addresses — they are public demo identifiers.

### ❌ Correction 2 — Traceability typo (carried into Prompt 3)

**Issue:** TC-UI-04 is *browse listing only*; it does not add to cart. CART-R01 in Prompt 3 incorrectly maps TC-UI-04 to cart-add risk.

**Fix:** CART-R01 UI mapping → **TC-UI-05, TC-UI-07** only (not TC-UI-04).

### ⚠️ Missing edge cases (acceptable as manual — no automation change)

| Edge case | Status | Action |
|-----------|--------|--------|
| INV-02 — single confirm, no invoice | Manual only | ✅ Correct for 8-test cap; include in `FunctionalTestCase.csv` |
| CRT-08 — empty cart checkout | Manual only | ✅ Include in manual CSV |
| Out-of-stock product add to cart | Not listed | Add 1 manual row in Phase 2 CSV |
| API token expiry mid-flow | Not listed | API Phase 2 concern |

### ⚠️ Test isolation note (clarify in Phase 2, not a restructure)

**Issue:** TC-UI-01 (register) and TC-UI-02 (login + profile) don't specify whether TC-UI-02 reuses TC-UI-01's user or registers independently.

**Fix:** Each UI test must be **self-contained** — TC-UI-02 should register + login in `beforeEach`, or TC-UI-02 uses env-based pre-seeded customer. Do not depend on TC-UI-01 execution order.

### ✅ Complexity check
- 42 scenarios identified but only 8 automated — appropriate breadth for planning without over-building

**Correction needed:** 2 items (password redaction, traceability note).

---

## 4. Prompt 3 — Risk Analysis

### ✅ Correct
- 23 risks across 5 focus areas — well-structured
- Priority ratings align with business impact
- Double-confirm correctly marked UI-only
- DCF-R01 → TC-UI-07 mapping is correct
- Out-of-scope section is practical

### ❌ Correction 1 — API test count exceeds constraint

**Issue:** References **TC-API-01 through TC-API-10** (10 tests). Assessment caps each tier at **5–8**.

**Fix:** Consolidate to **6 API tests** in Phase 2:

| Test ID | Covers | Merged risks |
|---------|--------|--------------|
| TC-API-01 | Register (201) + duplicate email (409) | AUTH-R01, AUTH-R06 |
| TC-API-02 | Login (200 + token) + invalid login (401) | AUTH-R02, AUTH-R04, AUTH-R05 |
| TC-API-03 | Create cart + add product + get cart | CART-R01, CART-R04 |
| TC-API-04 | Update quantity + verify cart total | CART-R03 |
| TC-API-05 | POST /invoices COD (201) + verify response body | CHK-R01, INV-R02, INV-R03 |
| TC-API-06 | GET /invoices — own data only (IDOR negative) | INV-R05, CHK-R03 |

Remove standalone: TC-API-07–10. Defer billing validation (422) and duplicate invoice check to **manual API collection** or TC-API-05 negative variant if slot allows.

### ❌ Correction 2 — CART-R01 traceability (same as Prompt 2)

**Fix:** Remove TC-UI-04 from CART-R01 UI mapping.

### ⚠️ Over-complexity (acceptable, no change)

- 23-risk register is detailed but appropriate for a mandatory deliverable
- DCF-R03 (triple-click duplicate) marked Critical — acceptable as manual/API spot-check, not automation priority

### ⚠️ Missing edge case (manual only)

| Edge case | Action |
|-----------|--------|
| POST /invoices with empty cart_id | Add to manual API tests |
| POST /invoices with invalid payment_method | Add to manual API tests |

**Correction needed:** 2 items (reduce API to 6, fix CART-R01 mapping).

---

## 5. Prompt 4 — Responsible AI Usage

### ✅ Correct
- Four categories comprehensively covered
- Safe alternatives are practical and project-specific
- Redaction checklist aligns with `ai-prompts/` submission requirements
- Demo vs real data table is clear

### ❌ Conflict with committed Prompt 2

**Issue:** Prompt 4 says don't commit `welcome01`; Prompt 2 already committed it to public GitHub.

**Fix (necessary):**
1. Redact passwords from `phase-1-prompt-2-application-analysis.md`
2. Add note: *"Demo passwords documented in README setup only via `.env.example` — not in prompt history"*
3. Scan all `prompts/` files before next commit for credential strings

### ⚠️ Minor clarification (optional)

- `customer@practicesoftwaretesting.com` listed as "safe identifier" — correct for test design docs
- Assessment PDF itself contains `welcome01` in API examples — using it in **runtime `.env`** is fine; avoid in **AI prompts and git**

**Correction needed:** 1 item (redact Prompt 2 passwords).

---

## 6. Cross-Artifact Constraint Alignment

| Tier | Constraint | Current plan | Aligned? |
|------|------------|--------------|----------|
| UI automation | 5–8 tests | 8 (TC-UI-01–08) | ✅ |
| API automation | 5–8 tests | 10 (TC-API-01–10) | ❌ → reduce to 6 |
| Manual CSV | 5–8 tests | Not yet defined | ⚠️ Phase 2 action |
| Each tier has @Smoke + @Regression | Required | UI ✅ / API TBD | ⚠️ Tag API tests in Phase 2 |

### Recommended manual CSV scope (6 cases — Phase 2)

| ID | Scenario | Tag |
|----|----------|-----|
| TC-MAN-01 | Register weak password rejected | Regression |
| TC-MAN-02 | Empty cart checkout blocked | Regression |
| TC-MAN-03 | Single confirm — no invoice | Regression |
| TC-MAN-04 | Search no results message | Regression |
| TC-MAN-05 | Out-of-stock product cannot be purchased | Edge |
| TC-MAN-06 | Forgot password navigation | Smoke |

---

## 7. Necessary Corrections Summary

Only these changes are required — no full rework:

| # | Correction | File(s) | Priority |
|---|------------|---------|----------|
| 1 | Redact plaintext passwords; reference env vars | `phase-1-prompt-2-application-analysis.md` | **High** |
| 2 | Fix CART-R01 mapping: remove TC-UI-04 | `phase-1-prompt-3-risk-analysis.md` | **Medium** |
| 3 | Reduce API plan from 10 → 6 tests | `phase-1-prompt-3-risk-analysis.md` + Phase 2 | **High** |
| 4 | Add test isolation note to TC-UI-02 | `phase-1-prompt-2-application-analysis.md` | **Medium** |
| 5 | Define 6 manual CSV cases in Phase 2 | Phase 2 deliverable | **High** |

### What NOT to change (avoid over-engineering)

- Do not merge TC-UI-01 + TC-UI-02 — separate tests give clearer failure diagnosis
- Do not add more UI automation — 8 is at cap
- Do not expand risk register — 23 risks is sufficient
- Do not automate Google OAuth, admin flows, or PDF download
- Do not rename repo to `qa-ai-practical-assessment/` — `QA-Assignment` is fine

---

## 8. Validation Checklist (for future prompts)

After each AI step, verify:

- [ ] Test count per tier ≤ 8
- [ ] Both @Smoke and @Regression represented per tier
- [ ] AC1 and AC2 traceably covered
- [ ] Double-confirm encoded in TC-UI-07
- [ ] No credentials in committed files
- [ ] Each automated test is independently runnable
- [ ] Edge cases either automated or in manual CSV with ID
- [ ] API/UI mapping traceability is accurate

---

## AI Response Summary

Validated Prompts 1–4: UI scope (8 tests) is aligned; API scope (10 planned) exceeds constraint and must reduce to 6. Two traceability errors (CART-R01 / TC-UI-04), password conflict between Prompt 2 and Prompt 4 on public repo, and manual CSV undefined. Four necessary corrections identified; no full rework needed.
