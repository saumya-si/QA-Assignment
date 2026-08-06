# AI Prompts – Test Design

Prompts used to generate and refine test scenarios, manual cases, RTM, and coverage reviews for UI + API.

**AI tool:** Cursor AI (Agent mode)

---

## Entry 1 — Manual test cases (CSV)

**Prompt:**  
Create 8 manual test cases covering registration/login, invalid login, product search, cart (multi-item + quantity), COD checkout, invoice verification, and one edge/negative scenario. Output `FunctionalTestCase.csv` with columns: TestCaseID, RequirementID, Title, TestType, Tag, Priority, Preconditions, Steps, TestData, ExpectedResult, ActualResult, Status. Use `@Smoke`/`@Regression` tags.

**AI Response Summary:**  
Created TC-MAN-01–08: profile verification (Smoke), invalid login, search, cart qty, COD checkout (Smoke), invoice verification (Smoke), single-confirm edge, duplicate email. Tag mix: 3 Smoke, 5 Regression.

**Validation Notes:**  
Confirmed 8 rows, no duplicate scenarios, blank ActualResult/Status for later execution. Requirement IDs use risk prefixes (AUTH-R, CHK-R, DCF-R, etc.).

---

## Entry 2 — Manual coverage review

**Prompt:**  
Review `FunctionalTestCase.csv` for assessment compliance, traceability clarity, and coverage gaps.

**AI Response Summary:**  
Found 9 issues: inconsistent RequirementID on TC-MAN-03, TC-MAN-01 missing address assertion, TC-MAN-06 not self-contained, TC-MAN-07 ambiguous expected result, TestType labels. Coverage mix acceptable (positive, negative, edge).

**Validation Notes:**  
Applied CSV edits. Confirmed 5–8 cap and Smoke/Regression presence. Documented accepted gaps (guest checkout, filter/sort) in `project-info.md`.

---

## Entry 3 — Requirement Traceability Matrix

**Prompt:**  
Create RTM with columns Requirement ID, Test Case ID, Coverage Type, Coverage Layer. Map AC1/AC2, auth, cart, checkout, double-confirm, and invoice requirements to manual, UI, and API tests.

**AI Response Summary:**  
`RequirementTraceabilityMatrix.csv` with mappings for AC1-UI, AC2-UI, AC1-API, AC2-API, AUTH-R01–06, CART-R01–05, CHK-R01–04, DCF-R01–03, INV-R01–05, BRW-03, NFR-SEC/PERF.

**Validation Notes:**  
Cross-walked to manual CSV and automation IDs. Updated in Phase 9 for final API suite (TC-API-07–11; removed obsolete TC-API-03–05).

---

## Entry 4 — Non-functional manual tests

**Prompt:**  
Add non-functional manual test coverage (security, performance) within the 8-case cap. Assessment requires functional, edge, negative, and non-functional manual design.

**AI Response Summary:**  
- Replaced TC-MAN-03 with **security NFR**: HTTPS + protected routes require authentication  
- Replaced TC-MAN-04 with **performance NFR**: catalog load ≤ 5 s average  
- Search and multi-item cart remain covered by automated TC-UI-07

**Validation Notes:**  
RTM updated with NFR-SEC-01, NFR-SEC-02, NFR-PERF-01. Manual execution completed 2026-08-06 — all 8 Status = Passed in CSV.

---

*Assessment submission file — Test Design phase (Prompts P6–P8, P6b).*
