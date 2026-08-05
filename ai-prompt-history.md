# AI Prompt History — QA Assignment

**Project:** Practice Software Testing Toolshop v5.0  
**Repository:** [https://github.com/saumya-si/QA-Assignment](https://github.com/saumya-si/QA-Assignment)  
**AI Tool:** Cursor AI (Agent mode)  
**Document purpose:** Record of AI-assisted planning, implementation, review, and debugging across Phases 1–8

---

## How to read this document

| Column | Description |
|--------|-------------|
| **Entry** | Phase and prompt number |
| **Prompt** | Task given to AI (summarized) |
| **AI Response Summary** | What AI produced or recommended |
| **Validation Notes** | How the output was verified |
| **Changes Made** | Corrections, refinements, or commits |
| **Reason** | Why changes were needed |

Detailed per-prompt artifacts: `prompts/phase-*-prompt-*.md`

---

## Phase 1 — Requirements & Planning

| Entry | Prompt | AI Response Summary | Validation Notes | Changes Made | Reason |
|-------|--------|---------------------|------------------|--------------|--------|
| **P1** | Extract assessment requirements from PDF | Listed 12 deliverables, AC1/AC2, 5–8 test cap, Playwright/Prism/Cursor stack, repo structure, 15 ambiguities | Cross-checked against `QA Practical Assessment.pdf` | None — planning artifact | Baseline for all subsequent work |
| **P2** | Application analysis — flows, Smoke/Regression, 5–8 UI scope | 42 scenarios across 6 flows; recommended 8 UI tests (TC-UI-01–08); documented double-confirm quirk | Reviewed live SUT and API docs URL | Pre-seeded password table later revised to env-only refs (P5) | Align automation scope before coding |
| **P3** | Risk analysis — auth, cart, checkout, double confirm, invoice | 23 risks (8 Critical, 9 High, 6 Medium) mapped to UI/API tests and tags | Mapped to AC1/AC2 and planned test IDs | API test count in risk doc updated in P5 (10→8) | Prioritize critical ecommerce paths |
| **P4** | Responsible AI usage — what not to share | Four categories (credentials, tokens, PII, internal configs) + safe alternatives | Aligned with public GitHub repo constraint | Password examples use `<from-env>` not live values | Prevent secret leakage in prompts/commits |
| **P5** | Validate AI outputs (Prompts 1–4) | UI scope OK; API plan exceeded 8-test cap; traceability errors; password-in-repo conflict | Checklist: count ≤8, tags, AC coverage, no credentials | Reduced API plan to 6 then expanded to 8 in Phase 6; fixed CART-R01/TC-UI-04 mapping | Correct over-scoping before automation |

---

## Phase 2 — Test Design

| Entry | Prompt | AI Response Summary | Validation Notes | Changes Made | Reason |
|-------|--------|---------------------|------------------|--------------|--------|
| **P6** | Create 8 manual test cases (CSV) | `FunctionalTestCase.csv` with registration, login, search, cart, COD, invoice, edge case | 8 rows, Smoke/Regression tags, blank ActualResult/Status | None initially | Manual tier deliverable |
| **P7** | Review manual CSV coverage | 9 issues found; compliant with 5–8 cap and coverage mix | Human review of traceability and step clarity | CSV edits: RequirementID prefixes, TC-MAN-01 address assertion, TC-MAN-06 self-contained, TC-MAN-07 single expected result, TestType→Functional | Improve submission quality and traceability |
| **P8** | Create Requirement Traceability Matrix | `RequirementTraceabilityMatrix.csv` — 82 mappings, 28 requirements, 22 tests | Cross-walked to P6 CSV and planned automation IDs | RTM updated as API suite grew to 8 tests in Phase 6 | Assessment traceability deliverable |

---

## Phase 3 — Test Data

| Entry | Prompt | AI Response Summary | Validation Notes | Changes Made | Reason |
|-------|--------|---------------------|------------------|--------------|--------|
| **P9** | Test data strategy | 6 categories; dynamic Faker + env passwords; static billing; API discovery for product IDs | Validated against OpenAPI password/DOB rules | `testDataFactory.js` implemented in P11; email suffix added in P16 | Reproducible, isolated data without secrets in repo |

---

## Phase 4 — Framework

| Entry | Prompt | AI Response Summary | Validation Notes | Changes Made | Reason |
|-------|--------|---------------------|------------------|--------------|--------|
| **P10** | Inspect Prism framework architecture | Documented expected POM, fixtures, tagging, reporting (framework not yet in repo) | Compared to assessment Quick Tips and Prism conventions | Informed P11 scaffold — no code | Architecture blueprint before implementation |
| **P11** | Scaffold Playwright + Prism framework | `PrismStructure/` with POM, API clients, fixtures, 14 initial specs, HTML/JSON reports, `.env` | `npm install`, initial test run | Committed framework; later refined in Phases 5–6 | Runnable automation foundation |

---

## Phase 5 — UI Automation

| Entry | Prompt | AI Response Summary | Validation Notes | Changes Made | Reason |
|-------|--------|---------------------|------------------|--------------|--------|
| **P12** | Login automation — valid + invalid | `login.spec.js`, `loginPage.js`; TC-UI-02 Smoke, TC-UI-03 Regression | Both tests passed against live SUT | Extracted login from `auth.spec.js` | Dedicated login POM and isolation |
| **P13** | E2E purchase flow — COD, double confirm, invoice | `purchaseFlowHelper.js`, `checkout.spec.js` TC-UI-07; wizard + `confirmTwice()` | Passed; occasionally flaky on first attempt | Added `retries: 1`, `expect.poll()` in `confirmTwice()` | Handle async double-confirm without fixed waits |
| **P14** | Additional UI tests — negative/edge, 5–8 total | Replaced redundant positives with OOS, empty cart, single-confirm edge; kept 8 tests | 8/8 UI passed after fixes | Fixed `AuthPage.register()` (address/phone); empty cart assertions; OOS instead of no-search | SUT v2.3 registration rules; meaningful negatives vs duplicate E2E coverage |

---

## Phase 6 — API Automation

| Entry | Prompt | AI Response Summary | Validation Notes | Changes Made | Reason |
|-------|--------|---------------------|------------------|--------------|--------|
| **P15** | API analysis from OpenAPI only | Documented endpoints, Bearer JWT auth, schemas, status codes (Toolshop API v5.0.0) | Sourced from `docs?api-docs.json` only — no assumptions | None — analysis artifact | API test design grounded in contract |
| **P16** | API lifecycle automation | `apiLifecycleHelper.js`, TC-API-07; register→login→cart→invoice | 7/8 API passed; cart add failed initially | Fixed `POST /carts/{id}` body; `token_type` case-insensitive; email uniqueness suffix; invoice line fetch | Undocumented cart path returned 405; API response quirks |
| **P17** | Negative API tests | `apiNegativeHelper.js`, TC-API-08–11; missing token, bad IDs, invalid payloads | 8/8 API passed | Removed redundant cart/invoice positives (covered by TC-API-07); split invalid login to TC-API-08 | Stay within 8-test cap; dedicated negative coverage |

---

## Phase 7 — Execution & Debugging

| Entry | Prompt | AI Response Summary | Validation Notes | Changes Made | Reason |
|-------|--------|---------------------|------------------|--------------|--------|
| **P18** | Execute `@Smoke` tests | 6/6 smoke passed (~55s); no failures | `npm run test:smoke`, exit code 0 | None | Sanity validation before submission |
| **P19** | Debug test failures | Documented 9 historical failures with RCA; current suite 16/16 pass | Re-ran full suite; reviewed error-context artifacts | Fixes already applied in Phases 5–6 (documented, not re-done) | Assessment debugging evidence; preserve assertion strength |
| **P20** | Final test execution | 16/16 full, 6/6 smoke, 13/13 regression; reports generated; security clean | `npm test`, report file checks, no tokens in JSON | None | Submission readiness validation |

---

## Phase 8 — Documentation

| Entry | Prompt | AI Response Summary | Validation Notes | Changes Made | Reason |
|-------|--------|---------------------|------------------|--------------|--------|
| **P21** | Create `project-info.md` | Full project doc: overview, tools, risks, strategy, coverage, test data, AI usage, prompt evolution, maintainability | Cross-referenced prompts, RTM, final test counts | Committed `project-info.md` | Assessment Part A deliverable |
| **P22** | Create comprehensive `README.md` | Setup, commands, test data, reports, structure, known issues (double confirm) | `npm run test:smoke` verified (6 passed, 1 flaky retry) | Rewrote root `README.md`; aligned `PrismStructure/README.md` | Evaluator setup and execution guide |
| **P23** | AI prompt history (this document) | Consolidated 23-prompt history with validation and change log | Cross-checked against `prompts/` artifacts and git history | Created `ai-prompt-history.md` | Transparent AI workflow record for assessment |

---

## Cross-cutting corrections (applied across multiple prompts)

| Theme | Discovery (when) | Fix | Reason |
|-------|------------------|-----|--------|
| **Double-confirm checkout** | P2 analysis | `confirmTwice()` + TC-UI-06 negative + README known issues | Assessment-mandated UI quirk |
| **Registration form v2.3** | P14 test failure | Full address, country, numeric phone in POM | SUT validation rules changed |
| **Cart API endpoint** | P16 test failure | `POST /carts/{id}` with `{ product_id, quantity }` | OpenAPI contract vs wrong client path |
| **IDOR test weakness** | P16 test failure | User A creates invoice before User B checks | Empty lists made comparison meaningless |
| **Test count cap** | P5 validation | UI=8, API=8; consolidated positives into lifecycle tests | Assessment 5–8 limit per tier |
| **Secrets hygiene** | P4 policy | `.env` only; no passwords in source or prompts | Public repo + responsible AI |
| **No fixed waits** | P13, P19 | `expect.poll()`, Playwright auto-wait | Reliable sync without masking bugs |

---

## AI usage statistics

| Metric | Value |
|--------|-------|
| Total documented prompts | 23 |
| Phases | 8 |
| Prompt artifact files | 21 in `prompts/` + 2 root docs (P21, P23) |
| Git commits (iterative) | Multiple per phase — not single commit |
| Primary AI activities | Requirements, test design, framework, UI/API automation, debugging, documentation |

---

## Validation checklist (applied throughout)

- [x] Test count per automation tier ≤ 8
- [x] `@Smoke` and `@Regression` on each tier
- [x] AC1 and AC2 traceably covered
- [x] Double-confirm encoded in TC-UI-07 and documented
- [x] No credentials in committed source files
- [x] Each automated test independently runnable
- [x] AI outputs executed against live SUT before commit
- [x] Prompt history captured with validation notes

---

## Related artifacts

| Artifact | Location |
|----------|----------|
| Per-prompt detail | `prompts/phase-*-prompt-*.md` |
| Project overview | `project-info.md` |
| Setup & execution | `README.md` |
| Manual tests | `FunctionalTestCase.csv` |
| Traceability | `RequirementTraceabilityMatrix.csv` |
| Automation | `PrismStructure/` |

---

*Last updated: Phase 8 — Prompt 23. Reflects final project state (16/16 automated tests passing).*
