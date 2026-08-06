# AI Prompts – Automation and Debugging

Prompts used for Prism/Playwright framework setup, UI/API automation, execution, and failure analysis.

**AI tool:** Cursor AI (Agent mode)  
**Detailed artifacts:** `prompts/phase-4-prompt-*.md` through `phase-7-prompt-*.md`

---

## Entry 1 — Framework inspection (P10)

- **Prompt:** Inspect Prism framework architecture before implementation.
- **AI Response Summary:** POM layers, fixtures, tagging, reporting conventions documented.
- **Validation Notes:** Blueprint matched assessment Quick Tips (Playwright + Prism + Cursor).

## Entry 2 — Framework scaffold (P11)

- **Prompt:** Scaffold `PrismStructure/` with Playwright, POM, API clients, fixtures, initial specs.
- **AI Response Summary:** Runnable framework with HTML/JSON reporters and npm scripts.
- **Validation Notes:** `npm install` and initial test run succeeded.

## Entry 3 — Login UI automation (P12)

- **Prompt:** Automate valid and invalid login (TC-UI-02, TC-UI-03).
- **AI Response Summary:** `loginPage.js`, `login.spec.js` with Smoke/Regression tags.
- **Validation Notes:** Both tests passed against live SUT.

## Entry 4 — E2E purchase flow (P13)

- **Prompt:** Automate COD checkout with double confirm and invoice verification (TC-UI-07).
- **AI Response Summary:** `purchaseFlowHelper.js`, `confirmTwice()` with `expect.poll()`.
- **Validation Notes:** Passed; added `retries: 1` for flaky first Confirm click.

## Entry 5 — Additional UI negatives (P14)

- **Prompt:** Reach 8 UI tests with negative/edge coverage within cap.
- **AI Response Summary:** OOS product, empty cart, single-confirm edge, duplicate email.
- **Validation Notes:** Fixed `AuthPage.register()` for SUT v2.3 address/phone rules.

## Entry 6 — API analysis (P15)

- **Prompt:** Analyze OpenAPI v5.0.0 only — no assumptions.
- **AI Response Summary:** Endpoint inventory, JWT auth, status codes, cart/invoice paths.
- **Validation Notes:** Sourced from `api-docs.json` URL only.

## Entry 7 — API lifecycle (P16)

- **Prompt:** Automate register→login→cart→invoice lifecycle (TC-API-07).
- **AI Response Summary:** `apiLifecycleHelper.js`; full purchase API flow.
- **Validation Notes:** Fixed `POST /carts/{id}` body; IDOR test strengthened.

## Entry 8 — Negative API tests (P17)

- **Prompt:** Add negative API tests within 8-test cap (TC-API-08–11).
- **AI Response Summary:** `apiNegativeHelper.js`; invalid login, missing token, bad IDs, invalid payloads.
- **Validation Notes:** 8/8 API tests passed.

## Entry 9 — Smoke execution (P18)

- **Prompt:** Run `@Smoke` suite and document results.
- **AI Response Summary:** 6/6 smoke passed (~55–60 s).
- **Validation Notes:** Exit code 0; log captured in execution evidence.

## Entry 10 — Debug historical failures (P19)

- **Prompt:** RCA for 9 historical failures; document fixes without weakening assertions.
- **AI Response Summary:** Cart endpoint, registration fields, IDOR, double-confirm timing, search re-scope.
- **Validation Notes:** Full suite 16/16 pass after fixes.

## Entry 11 — Final automation execution (P20)

- **Prompt:** Run full/smoke/regression suites; validate reports; check for secrets in artifacts.
- **AI Response Summary:** 16/16 full, 6/6 smoke, 13/13 regression; no credentials in logs.
- **Validation Notes:** Documented in `execution-summary.md` and `execution-evidence/`.

---

*Automation code: `PrismStructure/tests/` · Debug RCA: `prompts/phase-7-prompt-19-debug-test-failures.md`*
