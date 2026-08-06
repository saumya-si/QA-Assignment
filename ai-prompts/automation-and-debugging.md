# AI Prompts – Automation and Debugging

Prompts used for Prism/Playwright framework setup, UI/API automation, execution, and failure analysis.

**AI tool:** Cursor AI (Agent mode)

---

## Entry 1 — Framework inspection and scaffold

**Prompt:**  
Inspect Prism framework architecture (POM, fixtures, tagging, reporting). Scaffold `PrismStructure/` with Playwright, UI/API page objects, fixtures, config, and initial specs.

**AI Response Summary:**  
- Layered structure: `pages/`, `api/`, `fixtures/`, `utils/`, `tests/ui/`, `tests/api/`  
- `playwright.config.js` with HTML + JSON reporters, `@Smoke`/`@Regression` grep scripts  
- `.env` via `env.config.js` for secrets

**Validation Notes:**  
`npm install` and initial run succeeded. Structure matches assessment Quick Tips (Playwright + Prism + Cursor).

**Debugging Outcome:** N/A — greenfield scaffold.

---

## Entry 2 — Login UI automation

**Prompt:**  
Automate valid login (TC-UI-02, `@Smoke`) and invalid login (TC-UI-03, `@Regression`). Create dedicated `loginPage.js`.

**AI Response Summary:**  
`login.spec.js` with API pre-register for valid case; invalid case uses pre-seeded customer email + wrong password. Assertions: redirect away from `/auth/login`, authenticated nav visible, error alert on failure.

**Validation Notes:**  
Both tests passed against live SUT on first run after implementation.

**Debugging Outcome:** Login extracted from `auth.spec.js` for isolation — no failures.

---

## Entry 3 — E2E purchase flow

**Prompt:**  
Implement TC-UI-07: login, search, add 2 products, update cart quantity, COD checkout with **double confirm**, invoice verification. Tags `@Smoke @Regression`. Use reusable helpers.

**AI Response Summary:**  
`purchaseFlowHelper.js` with `registerAndLogin()`, `searchAndAddProduct()`, `addProductFromBrowse()`, `updateCartQuantity()`, `completeCodCheckout()`, `confirmTwice()` using `expect.poll()`, `verifyLatestInvoice()`.

**Validation Notes:**  
Test passed; occasionally flaky on first Confirm click.

**Debugging Outcome:** Added `retries: 1` on checkout describe block and `expect.poll()` in `confirmTwice()` — stable without fixed `waitForTimeout()`.

---

## Entry 4 — Additional UI negatives

**Prompt:**  
Reach 8 UI tests with negative/edge coverage. Replace redundant positives (search-only, browse-only) within cap.

**AI Response Summary:**  
TC-UI-04 out-of-stock, TC-UI-05 empty cart, TC-UI-06 single-confirm edge, TC-UI-08 duplicate email. Kept TC-UI-01/02/07 as smoke/positive anchors.

**Validation Notes:**  
8/8 UI passed. Fixed `AuthPage.register()` for SUT v2.3 (full address, country, numeric phone). Re-scoped TC-UI-04 from “no search results” (unreliable on live SUT) to out-of-stock.

**Debugging Outcome:** Registration failure RCA → extended POM fields. Empty cart → assert zero items + blocked CTA instead of missing message text.

---

## Entry 5 — API lifecycle automation

**Prompt:**  
Automate full API purchase lifecycle TC-API-07: register → login → discover products → create cart → add items → create invoice. Source endpoints from OpenAPI only.

**AI Response Summary:**  
`apiLifecycleHelper.js` with step functions and token propagation. TC-API-07 in `lifecycle.api.spec.js`.

**Validation Notes:**  
7/8 API tests passed initially; cart add returned 405.

**Debugging Outcome:** Wrong path `POST /carts/{id}/product/{pid}` → correct `POST /carts/{id}` with `{ product_id, quantity }` per OpenAPI. Fixed `token_type` case-insensitive check and IDOR test setup (User A creates invoice before User B checks).

---

## Entry 6 — Negative API tests

**Prompt:**  
Add TC-API-08–11 within 8-test API cap: invalid login, missing token, invalid resource IDs, invalid payloads.

**AI Response Summary:**  
`apiNegativeHelper.js` with `assertErrorResponse()`, `assertUnauthorized()`, `assertNotFound()`, `assertValidationError()`. Removed redundant cart-only positive spec.

**Validation Notes:**  
8/8 API tests passed. Invalid login split from TC-API-02 to dedicated TC-API-08.

**Debugging Outcome:** Consolidation avoided cap breach without losing negative coverage.

---

## Entry 7 — Smoke execution and debug RCA

**Prompt:**  
Execute `@Smoke` suite. Document historical failures with root-cause analysis. Re-run full suite and confirm 16/16 pass.

**AI Response Summary:**  
- Smoke: 6/6 passed (~55–60 s)  
- Full: 16/16 passed; TC-UI-07 flaky on retry  
- RCA documented for 9 historical failures (cart endpoint, registration fields, IDOR, double-confirm timing, search re-scope)

**Validation Notes:**  
Exit code 0. No credentials in `reports/json/results.json`. Evidence committed in `execution-evidence/automation-console.log`.

**Debugging Outcome:** Fixes applied in Phases 5–6; P19 documents RCA without weakening assertions.

---

*Assessment submission file — Automation and Debugging phase (Prompts P10–P20).*
