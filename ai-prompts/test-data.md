# AI Prompts – Test Data

Prompts used to design and generate test data for UI + API automation.

**AI tool:** Cursor AI (Agent mode)

---

## Entry 1 — Test data strategy

**Prompt:**  
Develop a comprehensive test data strategy: data categories, static vs dynamic, generation methods (Faker, env vars), cleanup/isolation, shared-data risks, and responsible AI usage for test data. Align with OpenAPI password and DOB rules.

**AI Response Summary:**  
| Category | Approach |
|----------|----------|
| Users | Faker + `testuser_{timestamp}@example.com` |
| Passwords | `TEST_USER_PASSWORD`, `TEST_CUSTOMER_PASSWORD` in `.env` only |
| Billing (COD) | Static assessment example in `test-data/static-test-data.json` |
| Product IDs | Runtime discovery via `GET /products` (in-stock filter) |
| Search keyword | Static `"hammer"` |
| Negative literals | `WrongPassword@99`, `weakpass`, invalid ULID |

Principles: isolation per run, no secrets in repo, AI suggests patterns but human validates against API contract.

**Validation Notes:**  
Validated password rules against OpenAPI v5.0.0. `.env.example` has empty placeholders. `testDataFactory.js` implemented in framework phase.

---

## Entry 2 — Factory implementation

**Prompt:**  
Implement `testDataFactory.js` with `createUser()`, `createBillingAddress(cartId)`, `getInStockProducts()`, `getSearchKeyword()`, and env-based customer credentials.

**AI Response Summary:**  
- `createUser()` — Faker names, unique email suffix, env password, valid DOB range  
- `createBillingAddress()` — merges static JSON with dynamic `cart_id`  
- `getInStockProducts()` — filters `in_stock !== false` from API  
- `redactToken()` in `apiHelper.js` for safe logging

**Validation Notes:**  
Registration and lifecycle tests pass without hardcoded product IDs. Email collision fixed with alphanumeric suffix (Phase 6).

---

## Entry 3 — Invoice payload alignment

**Prompt:**  
Ensure API invoice POST body matches assessment example: `billing_street`, `billing_city`, `billing_state`, `billing_country`, `billing_postal_code`, `payment_method: cash-on-delivery`, `cart_id`, `payment_details: {}`.

**AI Response Summary:**  
`createBillingAddress(cartId)` returns assessment-compatible payload. TC-API-07 uses this for invoice creation after cart setup.

**Validation Notes:**  
TC-API-07 returns 201 with valid invoice ID. TC-API-11 negative test deletes `billing_city` to trigger validation error.

---

*Assessment submission file — Test Data phase (Prompt P9 + factory implementation).*
