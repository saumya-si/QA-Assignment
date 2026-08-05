# Phase 6 — Prompt 16: API Lifecycle Test Automation

**Prompt:** Implement API lifecycle tests covering the complete user purchase flow with dynamic test data, no hardcoded credentials, response/status/data assertions, and maintainable reusable code.

---

## Implementation Summary

| Test ID | Scenario | Tags | Spec |
|---------|----------|------|------|
| TC-API-07 | Complete API purchase lifecycle (register → login → products → cart → invoice) | `@Smoke @Regression @positive` | `tests/api/lifecycle.api.spec.js` |

Existing tests **TC-API-01 – 06** were refactored to use shared lifecycle helpers and fixed cart add endpoint.

**Total API tests: 7** (within 5–8 cap)

---

## Lifecycle Flow (TC-API-07)

1. **Register** — `POST /users/register` → assert `201`, user `id` + `email`
2. **Login** — `POST /users/login` → assert `200`, `access_token`, `token_type: Bearer`
3. **Profile** — `GET /users/me` → assert authenticated user email
4. **Discover products** — `GET /products` → filter `in_stock`, fetch details via `GET /products/{id}`
5. **Create cart** — `POST /carts` → assert `201`, capture `cart_id`
6. **Add products** — `POST /carts/{id}` with `{ product_id, quantity }` → assert `200`
7. **Validate cart** — `GET /carts/{cartId}` → assert `cart_items` match product IDs and quantities
8. **Generate invoice** — `POST /invoices` (COD) → assert `200/201`, `INV-*` number, `invoicelines`
9. **Verify list** — `GET /invoices` → assert invoice present for authenticated user

---

## Files Added / Modified

| File | Change |
|------|--------|
| `utils/apiLifecycleHelper.js` | **New** — reusable lifecycle steps (`registerUser`, `loginUser`, `validateCartContents`, `generateInvoice`, `runApiPurchaseLifecycle`) |
| `utils/apiHelper.js` | Added `assertStatusIn`, `extractPaginatedData`, `propagateToken` |
| `api/index.js` | Fixed `addProduct` to documented `POST /carts/{id}`; added `getProduct`, `getInvoice` |
| `tests/api/lifecycle.api.spec.js` | **New** — TC-API-07 full lifecycle |
| `tests/api/cart.api.spec.js` | Refactored TC-API-03/04 to use lifecycle helpers |
| `tests/api/invoice.api.spec.js` | Refactored TC-API-05/06; IDOR test creates invoice for user A first |

---

## Key Fixes

### Cart add endpoint
OpenAPI documents `POST /carts/{id}` with body `{ product_id, quantity }`. Previous client used undocumented path (returned `405`).

### IDOR test (TC-API-06)
Both users had empty invoice lists. Test now creates an invoice for user A, then asserts user B cannot see it in `GET /invoices` or `GET /invoices/{id}`.

### Dynamic data
- Users via `createUser()` + env password (`TEST_USER_PASSWORD`)
- Product IDs via runtime `GET /products` discovery
- Cart/invoice IDs from API responses
- Billing payload from `createBillingAddress(cartId)` (assessment template + dynamic `cart_id`)

---

## Run Commands

```bash
cd PrismStructure
npx playwright test tests/api
npx playwright test tests/api/lifecycle.api.spec.js
npm run test:api:smoke
```

---

## Execution Result

All **7 API tests passed** against https://api.practicesoftwaretesting.com (~40s, 1 worker).
