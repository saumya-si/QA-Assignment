# Phase 1 — Prompt 2: Application Analysis

**Prompt:** Analyze https://practicesoftwaretesting.com/ as a Senior Quality Engineer. Identify testable ecommerce flows, classify Smoke/Regression, include positive/negative/edge scenarios. Limit scope to 5–8 UI automated tests.

**SUT:** Practice Software Testing — Toolshop v5.0  
**URL:** https://practicesoftwaretesting.com/  
**API:** https://api.practicesoftwaretesting.com/api/documentation  
**Stack:** Angular SPA (frontend) + Laravel REST API

---

## 1. Application Overview

Toolshop is a demo ecommerce application for software testing practice. It supports a full customer journey: account management, product catalog with search/filter, shopping cart, checkout with multiple payment methods, and invoice management. The assessment focuses on **Cash on Delivery** checkout and the **double-confirm** invoice quirk.

### Known UI Routes (inferred from app structure + API)

| Area | Route / Entry Point |
|------|---------------------|
| Home | `/` |
| Login | `/auth/login` |
| Register | `/auth/register` |
| Products | `/` or `/products` (catalog with categories) |
| Product detail | `/product/{id}` |
| Cart | Cart icon / checkout flow |
| Checkout | `/checkout` |
| Profile | Account / profile section (post-login) |
| My Invoices | Account → invoices |

### Pre-seeded Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | `customer@practicesoftwaretesting.com` | via `TEST_CUSTOMER_PASSWORD` env var |
| Customer 2 | `customer2@practicesoftwaretesting.com` | via `TEST_CUSTOMER2_PASSWORD` env var |
| Admin | `admin@practicesoftwaretesting.com` | via `TEST_ADMIN_PASSWORD` env var |

> Passwords are not stored in repo — configure in `.env` (see `.env.example` in Phase 2).

---

## 2. Testable Ecommerce Flows

### Flow 1 — Registration

**Purpose:** Create a new customer account before purchase flows.

| Field | Rules (from API) |
|-------|------------------|
| first_name | Required, max 40 chars |
| last_name | Required, max 20 chars |
| email | Required, valid format, max 256, unique |
| password | Min 8 chars; uppercase + lowercase + number + symbol |
| dob | Valid date, age 18–75 |
| address | street, house_number, city, state, country, postal_code |
| phone | Optional, max 24 chars |

| ID | Scenario | Type | Classification | Automate? |
|----|----------|------|----------------|-----------|
| REG-01 | Register with all valid required fields | Positive | Smoke | ✅ |
| REG-02 | Register with duplicate email | Negative | Regression | ✅ |
| REG-03 | Register with weak password (no symbol) | Negative | Regression | Manual |
| REG-04 | Register with invalid email format | Negative | Regression | Manual |
| REG-05 | Register with DOB under 18 | Edge | Regression | Manual |
| REG-06 | Register with max-length boundary names | Edge | Regression | Manual |
| REG-07 | Register with Google OAuth | Positive | Regression | Out of scope (external auth) |

---

### Flow 2 — Login & Profile

**Purpose:** Authenticate and verify account data persists correctly.

| ID | Scenario | Type | Classification | Automate? |
|----|----------|------|----------------|-----------|
| LOG-01 | Login with valid registered credentials | Positive | Smoke | ✅ (part of AC1) |
| LOG-02 | Login with invalid password | Negative | Regression | ✅ |
| LOG-03 | Login with unregistered email | Negative | Regression | Manual |
| LOG-04 | Login with empty email/password | Negative | Smoke | Manual |
| LOG-05 | Verify profile shows correct name, email, address after login | Positive | Smoke | ✅ (part of AC1) |
| LOG-06 | Forgot password link navigates correctly | Positive | Regression | Manual |
| LOG-07 | Logout and verify session cleared | Positive | Regression | Manual |
| LOG-08 | Profile update (edit address/phone) | Positive | Regression | Manual |

---

### Flow 3 — Product Browsing & Search

**Purpose:** Discover products before adding to cart.

| ID | Scenario | Type | Classification | Automate? |
|----|----------|------|----------------|-----------|
| BRW-01 | View product listing page loads with products | Positive | Smoke | ✅ |
| BRW-02 | Open product detail page from listing | Positive | Smoke | Manual (covered in cart flow) |
| BRW-03 | Search product by known name (e.g., "hammer") | Positive | Regression | ✅ |
| BRW-04 | Search with term returning no results | Negative | Regression | Manual |
| BRW-05 | Filter by category | Positive | Regression | Manual |
| BRW-06 | Filter by brand | Positive | Regression | Manual |
| BRW-07 | Sort products (price/name) | Positive | Regression | Manual |
| BRW-08 | View out-of-stock product detail | Edge | Regression | Manual |
| BRW-09 | Pagination — navigate to page 2 | Edge | Regression | Manual |

---

### Flow 4 — Cart & Quantity Updates

**Purpose:** Manage items before checkout.

| ID | Scenario | Type | Classification | Automate? |
|----|----------|------|----------------|-----------|
| CRT-01 | Add single product to cart from detail page | Positive | Smoke | ✅ |
| CRT-02 | Add multiple different products to cart | Positive | Regression | Manual |
| CRT-03 | Increase product quantity in cart | Positive | Regression | ✅ |
| CRT-04 | Decrease quantity to 1 | Positive | Regression | Manual |
| CRT-05 | Remove product from cart | Positive | Regression | Manual |
| CRT-06 | Cart total recalculates after qty change | Positive | Regression | ✅ (assertion in CRT-03) |
| CRT-07 | Add same product twice (qty increments) | Edge | Regression | Manual |
| CRT-08 | Checkout with empty cart | Negative | Regression | Manual |
| CRT-09 | Set quantity to 0 or negative | Negative/Edge | Regression | Manual |

---

### Flow 5 — Checkout (Cash on Delivery)

**Purpose:** Complete purchase using assessment-mandated payment method.

| ID | Scenario | Type | Classification | Automate? |
|----|----------|------|----------------|-----------|
| CHK-01 | Complete checkout with Cash on Delivery — valid billing address | Positive | Smoke | ✅ |
| CHK-02 | Select payment method other than COD (credit card) | Positive | Regression | Out of scope |
| CHK-03 | Checkout without login (guest) | Positive | Regression | Manual |
| CHK-04 | Submit checkout with missing billing fields | Negative | Regression | Manual |
| CHK-05 | Invalid postal code format | Negative | Regression | Manual |
| CHK-06 | Postcode lookup integration | Positive | Edge | Manual |

**Payment methods available (API):** `cash-on-delivery`, `bank-transfer`, `credit-card`, `buy-now-pay-later`, `gift-card`

---

### Flow 6 — Invoice Generation (Double Confirm)

**Purpose:** Verify order completion and invoice visibility — **critical assessment quirk**.

| ID | Scenario | Type | Classification | Automate? |
|----|----------|------|----------------|-----------|
| INV-01 | Generate invoice — press Confirm **twice** on checkout | Positive | Smoke | ✅ |
| INV-02 | Press Confirm only once — invoice NOT generated | Negative/Edge | Regression | Manual |
| INV-03 | View generated invoice under My Invoices | Positive | Smoke | ✅ (assertion in INV-01) |
| INV-04 | Invoice shows correct items, qty, and totals | Positive | Regression | ✅ (assertion in INV-01) |
| INV-05 | Download invoice PDF | Positive | Regression | Manual |
| INV-06 | Invoice ID displayed after double confirm | Positive | Smoke | ✅ |

> **Special instruction:** Invoice generation requires clicking the **Confirm** button **twice** on the application UI.

---

## 3. Smoke vs Regression Classification

### @Smoke (Sanity) — Critical path, fast feedback (~5–10 min suite)

Validates the application is **testable** and core ecommerce works:

| Priority | Flow | Scenarios |
|----------|------|-----------|
| 1 | Registration + Login + Profile | REG-01, LOG-01, LOG-05 |
| 2 | Product browse + add to cart | BRW-01, CRT-01 |
| 3 | Checkout COD + double-confirm invoice | CHK-01, INV-01, INV-03, INV-06 |

### @Regression — Broader coverage, negative/edge paths

| Priority | Flow | Scenarios |
|----------|------|-----------|
| 1 | Login negative | LOG-02 |
| 2 | Registration negative | REG-02 |
| 3 | Cart quantity update | CRT-03, CRT-06 |
| 4 | Product search | BRW-03 |
| 5 | Invoice edge | INV-02 (manual) |

---

## 4. Recommended UI Automation Scope (8 Tests)

Scoped to assessment limit of **5–8 UI automated tests**, covering both ACs with Smoke + Regression tags:

| Test ID | Title | Tags | AC | Scenarios Covered |
|---------|-------|------|----|-------------------|
| **TC-UI-01** | Register new user with valid data | `@Smoke` `@positive` | AC1 | REG-01 |
| **TC-UI-02** | Login with valid credentials and verify profile | `@Smoke` `@positive` | AC1 | LOG-01, LOG-05 |

> **Test isolation:** TC-UI-02 must be self-contained — register a fresh user in `beforeEach` or use env-based demo account. Do not depend on TC-UI-01 execution order.
| **TC-UI-03** | Login with invalid password shows error | `@Regression` `@negative` | AC1 | LOG-02 |
| **TC-UI-04** | Browse products and verify listing loads | `@Smoke` `@positive` | AC2 | BRW-01 |
| **TC-UI-05** | Add product to cart and update quantity | `@Regression` `@positive` | AC2 | CRT-01, CRT-03, CRT-06 |
| **TC-UI-06** | Search product by name returns results | `@Regression` `@positive` | AC2 | BRW-03 |
| **TC-UI-07** | End-to-end purchase: multi-item cart, COD checkout, double-confirm invoice | `@Smoke` `@Regression` `@positive` | AC2 | CRT-01, CHK-01, INV-01, INV-03, INV-04, INV-06 |
| **TC-UI-08** | Register with duplicate email shows error | `@Regression` `@negative` | AC1 | REG-02 |

**Count:** 8 UI automated tests (3 Smoke-only, 3 Regression-only, 2 dual-tagged)

### Tag distribution

| Tag | Count |
|-----|-------|
| `@Smoke` | 4 (TC-UI-01, 02, 04, 07) |
| `@Regression` | 5 (TC-UI-03, 05, 06, 07, 08) |
| `@positive` | 5 |
| `@negative` | 3 |

### Deferred to manual CSV only (not automated)

- Password validation rules (REG-03, REG-04)
- DOB boundary (REG-05)
- Empty cart checkout (CRT-08)
- Single-confirm invoice failure (INV-02)
- Search no results (BRW-04)
- Filter/sort/pagination (BRW-05–09)
- Profile update, logout, forgot password (LOG-06–08)
- Guest checkout (CHK-03)

---

## 5. End-to-End Flow Map

```
[Register] → [Login] → [Verify Profile]
                ↓
         [Browse Products] → [Search/Filter]
                ↓
         [Product Detail] → [Add to Cart]
                ↓
         [Update Quantity] → [Proceed to Checkout]
                ↓
         [Select Cash on Delivery] → [Enter Billing Details]
                ↓
         [Confirm] → [Confirm AGAIN] → [Invoice Generated]
                ↓
         [My Invoices] → [Verify Invoice Details]
```

---

## 6. Risks & Testing Considerations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Double-confirm invoice quirk | High — tests fail if Confirm clicked once | Explicit wait + second click in TC-UI-07; document in test data |
| Angular SPA rendering | Medium — flaky locators | Use Playwright auto-waiting; prefer role/data-testid locators |
| Dynamic product/cart IDs | Medium — hardcoded IDs break | Discover product at runtime; unique user per test run |
| Email uniqueness on register | Medium — parallel test conflicts | Generate unique email with timestamp/faker |
| Cloudflare challenge | Low — may block headless CI | Run headed or configure trusted CI IP |
| Token expiry (API cross-over) | Low for UI-only | UI tests use browser session, not API token |
| Pre-seeded data mutation | Medium — shared env state | Prefer fresh registration per test suite |

---

## 7. Test Data Strategy (Preview)

| Data Type | Approach |
|-----------|----------|
| New user | `faker`-based unique email per run; password meeting complexity rules |
| Existing user | `customer@practicesoftwaretesting.com` + env password for login-negative only |
| Billing address | Use assessment example: Zoey Shore, Hesselbury, Florida, TG, 1234AA |
| Products | Select first in-stock item from listing at runtime |
| Cart | Build fresh cart per test; avoid shared state |

---

## AI Response Summary

Analyzed Toolshop v5 across 6 ecommerce flows (42 scenarios identified). Recommended **8 UI automated tests** (TC-UI-01 to TC-UI-08) with Smoke/Regression/positive/negative coverage, aligned to AC1 (auth/profile) and AC2 (purchase/invoice). Remaining scenarios deferred to manual CSV. Critical quirk: invoice requires double Confirm click.
