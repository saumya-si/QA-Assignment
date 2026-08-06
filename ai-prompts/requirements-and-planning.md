# AI Prompts – Requirements and Planning

Record of prompts and responses used for understanding the Toolshop flow, identifying risks, and drafting the test plan.

**AI tool:** Cursor AI (Agent mode)  
**SUT:** https://practicesoftwaretesting.com · API: https://api.practicesoftwaretesting.com

---

## Entry 1 — Requirements extraction

**Prompt:**  
Read the attached `QA Practical Assessment.pdf`. Extract mandatory deliverables, UI/API acceptance criteria, test-count restrictions (5–8 per tier), required tools (Playwright, Prism, Cursor), submission folder structure (`FunctionalTestCase.csv`, `PrismStructure/`, `project-info.md`, `readme.md`, `ai-prompts/`), and special instructions (double-confirm invoice, iterative Git, public repo). Do not generate code.

**AI Response Summary:**  
- Part A: `project-info.md` with 11 AI-workflow topics  
- Part B: manual + UI + API tiers, RTM, test data strategy, execution evidence, README, prompt history  
- UI AC1: register, login, profile · UI AC2: browse, cart, COD, double-confirm invoice  
- API AC1: register, login, token, cart · API AC2: products, cart, invoice generation  
- Max 8 tests per type; each tier must include `@Smoke` and `@Regression`  
- Flagged 15 ambiguities (generic CRUD wording, NFR scope, `ai-prompts/` vs `prompts/` naming)

**Validation Notes:**  
Cross-checked every deliverable against the PDF table of contents. Confirmed assessment mandates Playwright + Prism + Cursor. Used output as baseline for Phases 2–9.

---

## Entry 2 — Application analysis

**Prompt:**  
Analyze the Toolshop ecommerce application. List testable flows, categorize as sanity (smoke) vs regression, and recommend a 5–8 test UI automation scope. Document the double-confirm checkout quirk.

**AI Response Summary:**  
- 42 scenarios across registration, login, browse/search, cart, checkout, invoice  
- Proposed TC-UI-01–08: register, login, invalid login, OOS product, empty cart, single-confirm edge, full E2E purchase, duplicate email  
- Smoke: auth + purchase path (TC-UI-01, 02, 07)  
- Regression: negatives and edge cases  
- Critical quirk: invoice requires **two Confirm clicks** on COD payment step

**Validation Notes:**  
Reviewed live SUT and API documentation URL. Smoke/regression split matches assessment “sanity vs regression” requirement. Double-confirm encoded in TC-UI-07 and documented in README.

---

## Entry 3 — Risk analysis

**Prompt:**  
Perform risk analysis for Toolshop covering authentication, cart state, checkout, double confirmation, invoice generation, and API security. Map risks to test IDs and priority.

**AI Response Summary:**  
- 23 risks: 8 Critical, 9 High, 6 Medium  
- Critical: AUTH-R01/R02 (registration/login), CART-R01 (add to cart), CHK-R01 (COD), DCF-R01 (double confirm), INV-R02 (invoice creation), INV-R05 (IDOR)  
- Each risk mapped to planned TC-MAN, TC-UI, or TC-API IDs with `@Smoke`/`@Regression` tags

**Validation Notes:**  
Verified every Critical risk has at least one manual or automated test in RTM. Risk IDs used as Requirement IDs in `FunctionalTestCase.csv`.

---

## Entry 4 — Responsible AI usage

**Prompt:**  
Document what information must NOT be shared with AI tools when working on this public GitHub repo. Provide safe alternatives.

**AI Response Summary:**  
- Never share: passwords, bearer tokens, `.env` contents, GitHub PATs, real PII  
- Safe to share: public SUT URLs, OpenAPI schemas, error messages, locator strategies  
- Use `<from-env>` placeholders in prompts and docs instead of `welcome01` or live credentials

**Validation Notes:**  
Aligned with assessment Part A item 10. All committed source files grep-clean for hardcoded secrets.

---

## Entry 5 — Validate planning outputs

**Prompt:**  
Review AI outputs from Prompts 1–4. Check test count caps, tag usage, AC coverage, traceability, and credential hygiene before starting automation.

**AI Response Summary:**  
- UI scope OK at 8 tests  
- Initial API plan exceeded 8-test cap (10 planned) — reduce before coding  
- Traceability errors in early RTM (CART-R01/TC-UI-04 mapping)  
- Conflict: pre-seeded password table in planning doc vs public repo policy

**Validation Notes:**  
Applied corrections: API suite consolidated to 8 tests in Phase 6; passwords env-only; RTM fixes in Phases 2 and 9. Checklist used before every subsequent automation prompt.

---

*Assessment submission file — Requirements and Planning phase (Prompts P1–P5).*
