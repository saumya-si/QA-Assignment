# Phase 6 — Prompt 17: Negative API Test Automation

**Prompt:** Implement negative API test scenarios for invalid login, missing token, invalid resource IDs, and invalid payloads with status code and message assertions.

---

## Implementation Summary

| Test ID | Scenario | Tags | Spec |
|---------|----------|------|------|
| TC-API-08 | Invalid login credentials (wrong password + unregistered email) | `@Regression @negative` | `tests/api/negative.api.spec.js` |
| TC-API-09 | Missing authentication token on protected endpoints | `@Regression @negative` | `tests/api/negative.api.spec.js` |
| TC-API-10 | Invalid resource IDs (product, cart, invoice, cart add) | `@Regression @negative` | `tests/api/negative.api.spec.js` |
| TC-API-11 | Invalid request payloads (weak password, missing fields, bad qty) | `@Regression @negative` | `tests/api/negative.api.spec.js` |

**Total API tests: 8** (within 5–8 cap). Cart positive tests (TC-API-03/04) and invoice smoke (TC-API-05) consolidated into TC-API-07 lifecycle.

---

## Negative Scenarios

### TC-API-08 — Invalid login
- Wrong password for registered user → `400/401/422`, no `access_token`
- Unregistered email → same error class, no token

### TC-API-09 — Missing token
- `GET /users/me`, `GET /invoices`, `POST /invoices` without `Authorization` → `401` with `Unauthorized` message

### TC-API-10 — Invalid resource IDs
- `GET /products/{id}`, `GET /carts/{id}`, `GET /invoices/{id}` with invalid ULID → `404`
- `POST /carts/{id}` with invalid `product_id` → `404/422` with not-found or invalid message

### TC-API-11 — Invalid payloads
- Register with weak password → `400/422`
- Add to cart without `product_id` → `400/422`
- Add to cart with `quantity: 0` → `400/422`
- Invoice missing `billing_city` → `400/422`

---

## Files Added / Modified

| File | Change |
|------|--------|
| `utils/apiNegativeHelper.js` | **New** — `assertErrorResponse`, `assertUnauthorized`, `assertNotFound`, `assertValidationError` |
| `tests/api/negative.api.spec.js` | **New** — TC-API-08 – 11 |
| `tests/api/auth.api.spec.js` | TC-API-02 positive-only; TC-API-01 duplicate asserts error message |
| `api/index.js` | Added `clearToken()` for unauthenticated requests |
| `tests/api/cart.api.spec.js` | **Removed** — covered by TC-API-07 lifecycle |
| `tests/api/invoice.api.spec.js` | TC-API-05 removed; TC-API-06 IDOR retained |

---

## Run Commands

```bash
cd PrismStructure
npx playwright test tests/api
npx playwright test tests/api/negative.api.spec.js
npm run test:api:regression
```

---

## Execution Result

All **8 API tests passed** against https://api.practicesoftwaretesting.com.
