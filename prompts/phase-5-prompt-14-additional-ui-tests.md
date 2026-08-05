# Phase 5 — Prompt 14: Additional UI Tests

**Prompt:** Add only high-value UI test scenarios (maintain 5–8 tests total). Include negative and edge-case scenarios, no duplicate coverage, and focus on meaningful user flows only.

---

## Implementation Summary

**Total UI tests: 8** — replaced three redundant positive flows (browse-only, search-only, cart-qty-only) that were already covered by TC-UI-07 E2E with focused negative/edge scenarios.

| Test ID | Scenario | Tags | Spec |
|---------|----------|------|------|
| TC-UI-01 | Register new user with valid data | `@Smoke @positive` | `tests/ui/auth.spec.js` |
| TC-UI-02 | Valid user login redirects and shows authenticated UI | `@Smoke @positive` | `tests/ui/login.spec.js` |
| TC-UI-03 | Invalid user login shows error and stays on login page | `@Regression @negative` | `tests/ui/login.spec.js` |
| TC-UI-04 | Out-of-stock product cannot be added to cart | `@Regression @negative @edge` | `tests/ui/product.spec.js` |
| TC-UI-05 | Empty cart prevents checkout progression | `@Regression @negative` | `tests/ui/cart.spec.js` |
| TC-UI-06 | Single COD confirm does not complete order or create invoice | `@Regression @negative @edge` | `tests/ui/checkout.spec.js` |
| TC-UI-07 | Complete purchase journey with COD and invoice verification | `@Smoke @Regression @positive` | `tests/ui/checkout.spec.js` |
| TC-UI-08 | Register with duplicate email shows error | `@Regression @negative` | `tests/ui/auth.spec.js` |

---

## Coverage Rationale

| Removed (duplicate of TC-UI-07) | Replaced with |
|----------------------------------|---------------|
| Browse product listing | TC-UI-04 — OOS guard on Add to cart |
| Search with valid keyword | TC-UI-05 — Empty cart blocks checkout |
| Cart quantity update | TC-UI-06 — Incomplete COD double-confirm edge |

**Negative / edge focus:** login failure, duplicate registration, empty cart, out-of-stock, single-confirm checkout (invoice not created).

**Positive smoke paths:** registration, login, full E2E purchase (TC-UI-07).

---

## Files Added / Modified

| File | Change |
|------|--------|
| `tests/ui/product.spec.js` | TC-UI-04 — out-of-stock product edge case |
| `tests/ui/cart.spec.js` | TC-UI-05 — empty cart negative flow |
| `tests/ui/checkout.spec.js` | TC-UI-06 — single COD confirm edge case |
| `pages/index.js` | `openFirstOutOfStockProduct()`, `expectCannotAddToCart()`, `expectEmptyCart()`, `expectCheckoutBlocked()`, `expectIncompleteCodOrder()`; registration fills address/country/phone |
| `utils/purchaseFlowHelper.js` | `prepareCodPaymentStep()`, `verifyNoInvoicesForUser()` |
| `utils/testDataFactory.js` | Numeric-only phone for registration form validation |

---

## Key Design Decisions

### TC-UI-04 — Out-of-stock instead of “no search results”
Live SUT still lists products when searching `zzznomatch999` (“45 products found”). OOS validation is a real catalog edge case and avoids brittle empty-state locators.

### TC-UI-05 — Empty cart on checkout wizard
Logged-in user navigates to `/checkout` with no line items; asserts zero quantity inputs and checkout CTA hidden/disabled (no reliance on a specific “cart is empty” message).

### TC-UI-06 — Double-confirm quirk (negative)
One Confirm shows intermediate “Payment was successful” but must **not** create an invoice; API + UI invoice count stay at 0.

### TC-UI-01 — Registration form completeness
SUT v2.3 requires country, full address, and digits-only phone. `AuthPage.register()` fills these fields; `createUser()` generates `faker.string.numeric(10)` phone.

---

## Run Commands

```bash
cd PrismStructure
npx playwright test tests/ui
npm run test:ui:smoke        # TC-UI-01, TC-UI-02, TC-UI-07
npm run test:ui:regression   # all @Regression-tagged UI tests
```

---

## Execution Result

All **8 UI tests passed** against https://practicesoftwaretesting.com (~1.4 min, 1 worker).
