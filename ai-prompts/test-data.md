# AI Prompts – Test Data

Prompts used to design and generate test data for UI + API automation.

**AI tool:** Cursor AI (Agent mode)  
**Detailed artifacts:** `prompts/phase-3-prompt-9-test-data-strategy.md`

---

## Entry 1 — Test data strategy (P9)

- **Prompt:** Define test data strategy: dynamic vs static, env secrets, API payloads, Faker usage, negative literals.
- **AI Response Summary:** Six data categories; `testDataFactory.js` design; static billing JSON; OpenAPI-aligned password rules; no secrets in repo.
- **Validation Notes:** Validated against OpenAPI v5.0.0 password/DOB constraints; `.env.example` has placeholders only.

## Entry 2 — Factory implementation validation (P11/P16)

- **Prompt:** (Implicit during framework setup) Implement Faker users, billing address factory, product discovery from API.
- **AI Response Summary:** `createUser()`, `createBillingAddress()`, `getInStockProducts()`; email uniqueness suffix for parallel runs.
- **Validation Notes:** Registration and lifecycle tests pass without hardcoded product IDs or passwords.

## Entry 3 — Invoice payload alignment (P16)

- **Prompt:** Align API invoice POST body with assessment example (COD billing fields, `cart_id`, `payment_method`).
- **AI Response Summary:** `createBillingAddress(cartId)` returns assessment-compatible payload from static JSON + dynamic cart ID.
- **Validation Notes:** TC-API-07 invoice creation returns 201 with valid invoice ID.

---

*Static data: `test-data/static-test-data.json` · Factory: `PrismStructure/utils/testDataFactory.js`*
