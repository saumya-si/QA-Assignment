# API Test Collection (Playwright — executable)

**Purpose:** The assessment allows execution evidence as logs, screenshots, **or API collections**. This project uses **Playwright API tests** as the executable collection — each row maps an HTTP operation to a version-controlled spec (no separate Postman export required).

**Base URL:** `https://api.practicesoftwaretesting.com`  
**Auth:** Bearer JWT from `POST /users/login`  
**Run all API tests:** `cd PrismStructure && npm run test:api`

---

## Collection index

| # | Method | Endpoint | Test ID | Spec file | Scenario |
|---|--------|----------|---------|-----------|----------|
| 1 | POST | `/users/register` | TC-API-01 | `tests/api/auth.api.spec.js` | Register valid user |
| 2 | POST | `/users/register` | TC-API-01 | `tests/api/auth.api.spec.js` | Reject duplicate email |
| 3 | POST | `/users/login` | TC-API-02 | `tests/api/auth.api.spec.js` | Valid login returns `access_token` |
| 4 | POST | `/users/login` | TC-API-08 | `tests/api/negative.api.spec.js` | Invalid credentials — no token |
| 5 | GET | `/users/me` | TC-API-09 | `tests/api/negative.api.spec.js` | Missing token → 401 |
| 6 | GET | `/products` | TC-API-07 | `tests/api/lifecycle.api.spec.js` | List products (lifecycle) |
| 7 | GET | `/products/{id}` | TC-API-10 | `tests/api/negative.api.spec.js` | Invalid product ID → 404 |
| 8 | POST | `/carts` | TC-API-07 | `tests/api/lifecycle.api.spec.js` | Create cart |
| 9 | POST | `/carts/{id}` | TC-API-07 | `tests/api/lifecycle.api.spec.js` | Add product to cart |
| 10 | PUT | `/carts/{id}/product/quantity` | TC-API-07 | `tests/api/lifecycle.api.spec.js` | Update line quantity |
| 11 | GET | `/carts/{id}` | TC-API-07 | `tests/api/lifecycle.api.spec.js` | Verify cart contents |
| 12 | POST | `/invoices` | TC-API-07 | `tests/api/lifecycle.api.spec.js` | Generate invoice (COD payload) |
| 13 | GET | `/invoices` | TC-API-06, TC-API-07 | `tests/api/invoice.api.spec.js`, `lifecycle.api.spec.js` | List invoices |
| 14 | GET | `/invoices/{id}` | TC-API-06 | `tests/api/invoice.api.spec.js` | IDOR — user sees own invoices only |
| 15 | POST | `/users/register` | TC-API-11 | `tests/api/negative.api.spec.js` | Weak password → validation error |
| 16 | POST | `/invoices` | TC-API-11 | `tests/api/negative.api.spec.js` | Invalid invoice payload → validation error |

---

## Example invoice payload (assessment PDF)

Used in TC-API-07 via `createBillingAddress()`:

```json
{
  "billing_street": "Zoey Shore",
  "billing_city": "Hesselbury",
  "billing_state": "Florida",
  "billing_country": "TG",
  "billing_postal_code": "1234AA",
  "payment_method": "cash-on-delivery",
  "cart_id": "<dynamic-cart-id>",
  "payment_details": {}
}
```

---

## Client implementation

| Layer | Location |
|-------|----------|
| API Page Objects | `PrismStructure/api/index.js` |
| Lifecycle helper | `PrismStructure/utils/apiLifecycleHelper.js` |
| Negative assertions | `PrismStructure/utils/apiNegativeHelper.js` |

**OpenAPI source:** https://api.practicesoftwaretesting.com/docs?api-docs.json

---

*Re-run collection: `npm run test:api` · Full suite: `npm test`*
