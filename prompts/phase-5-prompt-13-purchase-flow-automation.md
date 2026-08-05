# Phase 5 — Prompt 13: End-to-End Purchase Flow Automation

**Prompt:** Implement a comprehensive E2E Playwright test covering login, browse/search, cart, quantity update, COD checkout, double-confirm, and invoice verification. Use reusable POM/helpers, robust assertions, Playwright synchronization, and tags `@Smoke` `@Regression`.

---

## Implementation Summary

| Test ID | Scenario | Tags | Spec |
|---------|----------|------|------|
| TC-UI-07 | Complete purchase journey with COD and invoice verification | `@Smoke @Regression @positive` | `PrismStructure/tests/ui/checkout.spec.js` |

---

## Files Added / Modified

| File | Change |
|------|--------|
| `PrismStructure/utils/purchaseFlowHelper.js` | **New** — reusable flow helpers (`registerAndLogin`, `searchAndAddProduct`, `completeCodCheckout`, `verifyLatestInvoice`) |
| `PrismStructure/tests/ui/checkout.spec.js` | **Enhanced** — full E2E with step comments and assertions |
| `PrismStructure/pages/index.js` | **Enhanced** — ProductPage, CartPage, CheckoutPage, InvoicePage with stable locators and wizard handling |
| `PrismStructure/utils/testDataFactory.js` | Added `getInStockProducts()` for API-driven product discovery |

---

## E2E Flow (TC-UI-07)

1. **Login** — API register + UI login via `registerAndLogin()`
2. **Search & add** — Search `hammer`, open first in-stock result, add to cart
3. **Browse & add** — Add second in-stock product from catalog
4. **Cart** — Open cart, update quantity to `2`, assert total contains `$`
5. **Checkout** — Proceed through wizard (cart → sign-in → billing → payment)
6. **COD + double confirm** — Select Cash on Delivery, click Confirm twice (intermediate `Payment was successful`, final `Thanks for your order! Your invoice number is INV-...`)
7. **Invoice verify** — API + UI polling; assert invoice row contains INV number and total

---

## Key Design Decisions

### Reusable helpers (`purchaseFlowHelper.js`)
Orchestrates multi-page flows so `checkout.spec.js` stays readable and DRY.

### In-stock product handling
`openFirstInStockFromResults()` skips out-of-stock items; `getInStockProducts()` uses API for reliable search/browse data.

### Checkout wizard
`advanceToBillingStep()` clicks through cart/sign-in steps; billing uses `data-test` locators and US country for form compatibility.

### Double-confirm quirk
`confirmTwice()` handles intermediate payment success message, then second Confirm; captures order confirmation text atomically in poll to avoid race with auto-navigation.

### Invoice verification
Hybrid API poll + UI list row assertion (invoice number, `$` total). COD verified implicitly via checkout helper.

### Synchronization
No `waitForTimeout()`; uses `expect.poll()`, `waitForURL()`, `waitForLoadState()`, and Playwright auto-waiting.

---

## Run Commands

```bash
cd PrismStructure
npm run test:ui:smoke        # includes TC-UI-07
npm run test:ui:regression   # includes TC-UI-07
npx playwright test tests/ui/checkout.spec.js
```

---

## Execution Result

TC-UI-07 **passed** against https://practicesoftwaretesting.com (may retry once on flaky double-confirm timing).
