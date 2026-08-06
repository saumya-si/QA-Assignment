# AI Prompts – Test Design

Prompts used to generate and refine test scenarios, manual cases, RTM, and coverage reviews for UI + API.

**AI tool:** Cursor AI (Agent mode)  
**Detailed artifacts:** `prompts/phase-2-prompt-*.md`

---

## Entry 1 — Manual test cases (P6)

- **Prompt:** Create 8 manual test cases (CSV) covering registration, login, search, cart, COD, invoice, edge case. Smoke/Regression tags.
- **AI Response Summary:** `FunctionalTestCase.csv` with 8 rows; blank ActualResult/Status for execution.
- **Validation Notes:** Count = 8; mix of positive, negative, edge; traceability to risk IDs.

## Entry 2 — Non-functional manual tests (P6b)

- **Prompt:** Add NFR manual coverage (security, performance) within 8-case cap.
- **AI Response Summary:** Replaced TC-MAN-03/04 with HTTPS/protected-route security and catalog load-time performance tests.
- **Validation Notes:** Functional search/cart covered by TC-UI-07; RTM updated with NFR-SEC/PERF IDs.

## Entry 3 — Coverage review (P7)

- **Prompt:** Review manual CSV for gaps, traceability, and assessment alignment.
- **AI Response Summary:** 9 issues (ID naming, profile assertion, TC-MAN-06 self-containment, TC-MAN-07 clarity).
- **Validation Notes:** CSV edits applied; confirmed 5–8 cap and Smoke/Regression mix.

## Entry 4 — Requirement Traceability Matrix (P8)

- **Prompt:** Create RTM mapping requirements to test cases (Requirement ID, Test Case ID, Coverage Type, Layer).
- **AI Response Summary:** `RequirementTraceabilityMatrix.csv` with AC, AUTH, CART, CHK, DCF, INV, NFR mappings.
- **Validation Notes:** Updated through Phase 9 for final API suite (TC-API-07–11).

---

*See `FunctionalTestCase.csv` and `RequirementTraceabilityMatrix.csv` for deliverables.*
