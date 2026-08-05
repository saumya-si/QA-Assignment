# Phase 1 — Prompt 3: Requirement & Risk Analysis

**Prompt:** Create requirement and risk analysis. For each flow: Requirement/AC, business risk, failure impact, priority, UI or API coverage, Smoke/Regression tag. Focus on authentication, cart state, checkout, double confirmation, invoice generation.

**SUT:** Practice Software Testing — Toolshop v5.0  
**References:** Assessment AC1 (UI/API auth), AC2 (UI purchase / API invoice), Prompt 2 flow analysis

---

## 1. Risk Analysis Summary

| Focus Area | # Risks | Critical | High | Medium |
|------------|---------|----------|------|--------|
| Authentication | 6 | 2 | 2 | 2 |
| Cart State | 5 | 1 | 2 | 2 |
| Checkout | 4 | 1 | 2 | 1 |
| Double Confirmation | 3 | 2 | 1 | 0 |
| Invoice Generation | 5 | 2 | 2 | 1 |
| **Total** | **23** | **8** | **9** | **6** |

**Risk rating key:** Critical = revenue-blocking / security; High = major user journey break; Medium = degraded UX or recoverable defect.

---

## 2. Authentication

| ID | Requirement / AC | Business Risk | Failure Impact | Priority | Coverage | Tag |
|----|----------------|---------------|----------------|----------|----------|-----|
| **AUTH-R01** | **AC1 (UI):** User can register with valid details (first name, last name, email, password, DOB 18–75) | New customers cannot onboard; no account = no purchase | Registration blocked; 100% new-user conversion loss | **Critical** | UI + API | `@Smoke` |
| **AUTH-R02** | **AC1 (UI):** User can log in with registered credentials | Existing customers locked out of account and purchase | Cannot access cart, checkout, or invoices; support tickets spike | **Critical** | UI + API | `@Smoke` |
| **AUTH-R03** | **AC1 (UI):** Profile displays correct name, email, and address after login | Trust erosion; wrong identity shown; GDPR/privacy concern | User sees incorrect PII; may proceed with wrong billing data | **High** | UI | `@Smoke` |
| **AUTH-R04** | **AC1 (API):** Register via API returns 201; login returns valid bearer token | API consumers (mobile, integrations) cannot authenticate | Downstream API cart/invoice flows blocked entirely | **Critical** | API | `@Smoke` |
| **AUTH-R05** | Invalid password rejected at login (wrong password, empty fields) | Weak security perception; brute-force surface if no lockout | Unauthorized access if validation bypassed; false positives lock legit users | **High** | UI + API | `@Regression` |
| **AUTH-R06** | Duplicate email registration rejected (409 Conflict) | Data integrity; account hijack confusion | Two accounts with same email; login ambiguity; data corruption | **Medium** | UI + API | `@Regression` |

### Authentication — Traceability

| Risk ID | Mapped Test | Layer |
|---------|-------------|-------|
| AUTH-R01 | TC-UI-01, TC-API-01 (register) | UI + API |
| AUTH-R02 | TC-UI-02, TC-API-02 (login) | UI + API |
| AUTH-R03 | TC-UI-02 (profile assertion) | UI |
| AUTH-R04 | TC-API-01, TC-API-02 | API |
| AUTH-R05 | TC-UI-03, TC-API-03 (invalid login) | UI + API |
| AUTH-R06 | TC-UI-08, TC-API-04 (duplicate email) | UI + API |

---

## 3. Cart State

| ID | Requirement / AC | Business Risk | Failure Impact | Priority | Coverage | Tag |
|----|----------------|---------------|----------------|----------|----------|-----|
| **CART-R01** | **AC2 (UI):** User can add product(s) to cart from product detail | Core ecommerce action broken; no path to purchase | Zero conversion; users abandon site | **Critical** | UI + API | `@Smoke` |
| **CART-R02** | **AC2 (UI):** User can add **multiple different** items to cart | Incomplete orders; lost upsell revenue | Customer buys only one item; AOV drops | **High** | UI | `@Regression` |
| **CART-R03** | **AC2 (UI):** User can update item quantity in cart; line total recalculates | Incorrect pricing charged or displayed | Financial loss (undercharge) or customer dispute (overcharge) | **High** | UI + API | `@Regression` |
| **CART-R04** | **AC1 (API):** Authenticated user can create cart and obtain `cart_id` | API checkout pipeline has no container for line items | Invoice generation fails — no `cart_id` for POST /invoices | **Critical** | API | `@Smoke` |
| **CART-R05** | Cart persists across session until checkout or explicit clear | User loses selections on navigation/refresh | Frustration; abandoned carts; repeat browsing | **Medium** | UI | `@Regression` |

### Cart State — Traceability

| Risk ID | Mapped Test | Layer |
|---------|-------------|-------|
| CART-R01 | TC-UI-04, TC-UI-05, TC-API-05 (create cart + add product) | UI + API |
| CART-R02 | TC-UI-07 (multi-item E2E) | UI |
| CART-R03 | TC-UI-05 (qty update + total assertion) | UI + API |
| CART-R04 | TC-API-05 (POST /carts, POST /carts/{id}/product/{productId}) | API |
| CART-R05 | Manual TC-MAN-05 | UI |

### Cart State Machine (for traceability)

```
[Empty] ──add item──▶ [Has Items] ──update qty──▶ [Has Items]
     ▲                      │                          │
     │                      │ checkout                 │ remove all
     └──── clear/expire ◀───┴──────────────────────────┘
```

---

## 4. Checkout

| ID | Requirement / AC | Business Risk | Failure Impact | Priority | Coverage | Tag |
|----|----------------|---------------|----------------|----------|----------|-----|
| **CHK-R01** | **AC2 (UI):** Checkout completes with **Cash on Delivery** payment method | Assessment-mandated payment path broken; orders not placed | No order completion; COD customers cannot buy | **Critical** | UI + API | `@Smoke` |
| **CHK-R02** | Billing address fields validated (street, city, state, country, postal code) | Invalid orders shipped to wrong address; fulfilment failures | Delivery failures; returns; customer complaints | **High** | UI + API | `@Regression` |
| **CHK-R03** | Checkout requires authenticated session (or valid guest flow) | Unauthorized order placement; cart hijacking | Orders tied to wrong account; security incident | **High** | UI + API | `@Regression` |
| **CHK-R04** | Checkout blocked when cart is empty | Phantom orders or system errors on zero-item checkout | Backend errors; misleading success UI | **Medium** | UI | `@Regression` |

### Checkout — Traceability

| Risk ID | Mapped Test | Layer |
|---------|-------------|-------|
| CHK-R01 | TC-UI-07, TC-API-07 (POST /invoices, `payment_method: cash-on-delivery`) | UI + API |
| CHK-R02 | Manual TC-MAN-08; TC-API-08 (missing billing field → 422) | UI + API |
| CHK-R03 | TC-UI-07 (logged-in E2E); TC-API-06 (bearer token required) | UI + API |
| CHK-R04 | Manual TC-MAN-09 | UI |

### Required Billing Payload (API reference)

```json
{
  "billing_street": "Zoey Shore",
  "billing_city": "Hesselbury",
  "billing_state": "Florida",
  "billing_country": "TG",
  "billing_postal_code": "1234AA",
  "payment_method": "cash-on-delivery",
  "cart_id": "<dynamic>",
  "payment_details": {}
}
```

---

## 5. Double Confirmation

| ID | Requirement / AC | Business Risk | Failure Impact | Priority | Coverage | Tag |
|----|----------------|---------------|----------------|----------|----------|-----|
| **DCF-R01** | **Special instruction:** Invoice generated only after pressing **Confirm twice** on checkout UI | Assessment-critical UX quirk untested = false failures in automation | Automated tests fail intermittently; manual testers miss invoice | **Critical** | UI | `@Smoke` |
| **DCF-R02** | Single Confirm click does **not** generate invoice | Users think order is placed but invoice missing | Customer believes purchase complete; no order record; support escalation | **High** | UI | `@Regression` |
| **DCF-R03** | Second Confirm is idempotent (no duplicate invoices on triple-click) | Duplicate orders/invoices charged | Double billing; inventory oversell | **Critical** | UI + API | `@Regression` |

### Double Confirmation — Traceability

| Risk ID | Mapped Test | Layer |
|---------|-------------|-------|
| DCF-R01 | TC-UI-07 (explicit double-click Confirm step) | UI |
| DCF-R02 | Manual TC-MAN-10 (single confirm → no invoice) | UI |
| DCF-R03 | Manual TC-MAN-11; TC-API-09 (verify single invoice per cart) | UI + API |

### Double-Confirm Test Design Note

```
Step N:   Click [Confirm]  →  modal/step advances (invoice NOT yet created)
Step N+1: Click [Confirm]  →  invoice created, success message shown
Assert:   Invoice visible under My Invoices with matching cart total
```

> This is a **UI-only** behaviour; API POST /invoices has no double-submit concept. UI tests must encode the two-click sequence explicitly.

---

## 6. Invoice Generation

| ID | Requirement / AC | Business Risk | Failure Impact | Priority | Coverage | Tag |
|----|----------------|---------------|----------------|----------|----------|-----|
| **INV-R01** | **AC2 (UI):** Generated invoice visible under **My Invoices** after checkout | Customer has no proof of purchase | Cannot verify order; disputes unresolvable | **Critical** | UI | `@Smoke` |
| **INV-R02** | **AC2 (API):** Invoice created via POST /invoices with valid `cart_id` and billing payload | API order pipeline broken for integrations | Partner/mobile apps cannot complete purchase | **Critical** | API | `@Smoke` |
| **INV-R03** | Invoice line items, quantities, and totals match cart at time of checkout | Financial discrepancy between charged and displayed amounts | Accounting errors; refund requests; legal exposure | **High** | UI + API | `@Regression` |
| **INV-R04** | Invoice ID displayed after successful generation | User cannot reference order in support calls | Poor post-purchase experience; support inefficiency | **High** | UI | `@Smoke` |
| **INV-R05** | GET /invoices returns only authenticated user's invoices (not other users') | **IDOR / data leak** — user sees another customer's orders | Privacy breach; regulatory violation (GDPR) | **Critical** | API | `@Regression` |

### Invoice Generation — Traceability

| Risk ID | Mapped Test | Layer |
|---------|-------------|-------|
| INV-R01 | TC-UI-07 (My Invoices navigation + visibility) | UI |
| INV-R02 | TC-API-07 (POST /invoices → 201) | API |
| INV-R03 | TC-UI-07 (line item assertions); TC-API-07 (response body validation) | UI + API |
| INV-R04 | TC-UI-07 (invoice ID assertion) | UI |
| INV-R05 | TC-API-10 (user A token cannot read user B invoices) | API |

---

## 7. Consolidated Risk Register

| Risk ID | Flow | Requirement / AC Summary | Priority | UI | API | Tag |
|---------|------|--------------------------|----------|----|----|-----|
| AUTH-R01 | Auth | Valid registration | Critical | ✅ | ✅ | Smoke |
| AUTH-R02 | Auth | Valid login | Critical | ✅ | ✅ | Smoke |
| AUTH-R03 | Auth | Profile data correct | High | ✅ | — | Smoke |
| AUTH-R04 | Auth | API token on login | Critical | — | ✅ | Smoke |
| AUTH-R05 | Auth | Invalid login rejected | High | ✅ | ✅ | Regression |
| AUTH-R06 | Auth | Duplicate email blocked | Medium | ✅ | ✅ | Regression |
| CART-R01 | Cart | Add product to cart | Critical | ✅ | ✅ | Smoke |
| CART-R02 | Cart | Multiple items in cart | High | ✅ | — | Regression |
| CART-R03 | Cart | Quantity update + total | High | ✅ | ✅ | Regression |
| CART-R04 | Cart | API cart creation | Critical | — | ✅ | Smoke |
| CART-R05 | Cart | Cart session persistence | Medium | ✅ | — | Regression |
| CHK-R01 | Checkout | COD payment completes | Critical | ✅ | ✅ | Smoke |
| CHK-R02 | Checkout | Billing validation | High | ✅ | ✅ | Regression |
| CHK-R03 | Checkout | Auth required | High | ✅ | ✅ | Regression |
| CHK-R04 | Checkout | Empty cart blocked | Medium | ✅ | — | Regression |
| DCF-R01 | Double Confirm | Two clicks generate invoice | Critical | ✅ | — | Smoke |
| DCF-R02 | Double Confirm | One click fails silently | High | ✅ | — | Regression |
| DCF-R03 | Double Confirm | No duplicate invoices | Critical | ✅ | ✅ | Regression |
| INV-R01 | Invoice | Visible in My Invoices | Critical | ✅ | — | Smoke |
| INV-R02 | Invoice | API invoice creation | Critical | — | ✅ | Smoke |
| INV-R03 | Invoice | Totals match cart | High | ✅ | ✅ | Regression |
| INV-R04 | Invoice | Invoice ID displayed | High | ✅ | — | Smoke |
| INV-R05 | Invoice | User isolation (no IDOR) | Critical | — | ✅ | Regression |

---

## 8. Priority-Based Test Execution Order

### Smoke suite (run first — blocks all downstream testing)

1. AUTH-R01 → AUTH-R02 → AUTH-R04 (register + login UI/API)
2. CART-R01 → CART-R04 (add to cart UI/API)
3. CHK-R01 (COD checkout)
4. DCF-R01 (double confirm)
5. INV-R01 → INV-R02 → INV-R04 (invoice visible + API created)

### Regression suite (run after smoke passes)

1. AUTH-R05, AUTH-R06 (negative auth)
2. CART-R02, CART-R03, CART-R05 (cart edge cases)
3. CHK-R02, CHK-R03, CHK-R04 (checkout validation)
4. DCF-R02, DCF-R03 (confirm edge cases)
5. INV-R03, INV-R05 (invoice accuracy + security)

---

## 9. Out-of-Scope / Accepted Risks

| Item | Rationale |
|------|-----------|
| Google OAuth login | External provider; not in assessment ACs |
| Non-COD payment methods | Assessment mandates Cash on Delivery only |
| Admin PIM / reporting | Sprint 5 admin features outside customer journey scope |
| PDF invoice download | Nice-to-have; manual only |
| TOTP / 2FA | API exists (`/totp/setup`) but not in assessment ACs |
| Performance / load testing | Not required per assessment scope |

---

## AI Response Summary

Created risk register of **23 requirements** across 5 focus areas (Authentication, Cart State, Checkout, Double Confirmation, Invoice Generation). Identified **8 Critical**, **9 High**, **6 Medium** risks with UI/API coverage mapping, Smoke/Regression tags, and traceability to planned TC-UI and TC-API tests. Double-confirm is UI-only critical risk requiring explicit two-click automation in TC-UI-07.
