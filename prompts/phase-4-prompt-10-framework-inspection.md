# Phase 4 — Prompt 10: Prism Playwright Framework Inspection

**Prompt:** Inspect the Prism Playwright automation framework and explain architecture: project structure, POM, fixtures, test data, tagging, reporting. Analysis only — no code changes.

**Inspection date:** Phase 4  
**Target path:** `PrismStructure/` (per assessment submission structure)

---

## 0. Inspection Status

| Item | Status |
|------|--------|
| `PrismStructure/` folder in `QA-Assignment` repo | ❌ **Not present** |
| Prism framework on local filesystem | ❌ **Not found** |
| Assessment mandate | ✅ Playwright + **Prism Framework** required |
| Inspection basis | Assessment PDF, Quick Tips, submission structure, Prism naming conventions |

> **Note:** Prism is an **organizational/internal framework** referenced in the QA AI Capability Exercise. It is not a public npm package. This document describes the **expected Prism architecture** as defined by the assessment and standard Prism conventions cited in the exercise (e.g., `authApiPage.js`, `PrismStructure-toolshop-playwright`). When the framework is scaffolded in Phase 4, re-run this inspection against actual source files.

---

## 1. Framework Purpose

Prism is a **Playwright-based test automation framework** that standardises how QA engineers structure UI and API tests for the Toolshop application. It enforces:

- **Separation of concerns** — pages, tests, data, and config in distinct layers
- **Reusability** — shared base page, API helpers, and fixtures across TC-UI and TC-API suites
- **Traceability** — `@Smoke` / `@Regression` tags aligned with manual tests and RTM
- **Dual-layer testing** — UI browser tests and API request tests in one project
- **Execution evidence** — HTML/JSON reports for assessment submission

---

## 2. Project & Folder Structure

### 2.1 Expected top-level layout (per assessment)

```
PrismStructure/
├── playwright.config.js          # Central Playwright configuration
├── package.json                  # Dependencies (@playwright/test, faker, dotenv)
├── .env                          # Credentials (gitignored — see .env.example at repo root)
│
├── config/                       # Environment and runtime configuration
│   ├── env.config.js             # BASE_URL, API_BASE_URL from process.env
│   └── testTags.js               # Smoke/Regression tag constants
│
├── pages/                        # Page Object Model — UI layer
│   ├── basePage.js               # Shared navigation, waits, common actions
│   ├── authPage.js               # Login, register, profile
│   ├── productPage.js            # Product listing, search, detail
│   ├── cartPage.js               # Cart view, quantity update
│   ├── checkoutPage.js           # Billing, payment, double-confirm
│   └── invoicePage.js            # My Invoices list and detail
│
├── api/                          # API Object Model — API layer
│   ├── baseApiClient.js          # Bearer token, base URL, request helper
│   ├── authApiPage.js            # POST /users/register, /users/login
│   ├── cartApiPage.js            # POST /carts, add product, update qty
│   ├── productApiPage.js         # GET /products, /products/search
│   └── invoiceApiPage.js         # POST /invoices, GET /invoices
│
├── tests/                        # Test specifications
│   ├── ui/
│   │   ├── auth.spec.js          # TC-UI-01, 02, 03, 08
│   │   ├── product.spec.js       # TC-UI-04, 06
│   │   ├── cart.spec.js          # TC-UI-05
│   │   └── checkout.spec.js      # TC-UI-07 (E2E + double confirm)
│   └── api/
│       ├── auth.api.spec.js      # TC-API-01, 02
│       ├── cart.api.spec.js      # TC-API-03, 04
│       └── invoice.api.spec.js   # TC-API-05, 06
│
├── fixtures/                     # Playwright custom fixtures
│   ├── testFixtures.js           # Extended test with page objects injected
│   └── authFixture.js            # Pre-authenticated session / token
│
├── utils/                        # Shared utility classes
│   ├── testDataFactory.js        # Faker-based user/cart/billing generators
│   ├── apiHelper.js              # Token capture, response assertions
│   └── logger.js                 # Structured logging (token-redacted)
│
├── test-data/                    # Static reference data (or symlink to repo root)
│   └── static-test-data.json     # Assessment billing address, search terms
│
└── reports/                      # Execution output (gitignored or snapshot for evidence)
    ├── html/                     # Playwright HTML report
    ├── json/                     # JSON results for CI
    └── screenshots/                # Failure captures
```

### 2.2 Layer responsibilities

| Layer | Responsibility | Changes when UI breaks |
|-------|----------------|------------------------|
| `pages/` | UI locators + user actions | Update page class only |
| `api/` | REST endpoint wrappers | Update API class only |
| `tests/` | Test logic, assertions, tags | Minimal — calls page/api methods |
| `fixtures/` | Setup/teardown, dependency injection | Rarely |
| `utils/` | Cross-cutting helpers | Rarely |
| `config/` | URLs, timeouts, reporters | Environment-specific |

### 2.3 Naming conventions (Prism standard)

| Artifact | Convention | Example |
|----------|------------|---------|
| UI page class | `{feature}Page.js` | `authPage.js`, `checkoutPage.js` |
| API page class | `{feature}ApiPage.js` | `authApiPage.js` (cited in assessment Quick Tips) |
| UI spec file | `{feature}.spec.js` | `checkout.spec.js` |
| API spec file | `{feature}.api.spec.js` | `invoice.api.spec.js` |
| Test ID in title | `TC-UI-##` / `TC-API-##` | Traceability to RTM |

---

## 3. Page Object Model (POM) Implementation

### 3.1 Prism POM pattern

Prism implements a **two-tier POM**:

1. **UI Page Objects** (`pages/`) — encapsulate browser interactions
2. **API Page Objects** (`api/`) — encapsulate REST calls (Prism extends classic POM to API layer)

### 3.2 Base Page pattern

```
basePage.js
├── constructor(page)           # Playwright Page instance
├── navigate(path)              # Common goto with base URL
├── waitForLoad()               # Angular SPA ready-state wait
├── getByRole / getByTestId     # Preferred locator strategy
└── takeScreenshot(name)        # Evidence capture
```

All feature pages **extend or compose** `basePage.js`:

```
authPage.js       → login(), register(), verifyProfile()
productPage.js    → browseProducts(), searchProduct(), openProductDetail()
cartPage.js       → addToCart(), updateQuantity(), getCartTotal()
checkoutPage.js   → fillBilling(), selectCOD(), confirmTwice()
invoicePage.js    → navigateToInvoices(), getLatestInvoiceId()
```

### 3.3 API Page Object pattern

Assessment Quick Tips reference: *"Create authApiPage.js following Prism pattern"*

```
authApiPage.js
├── constructor(request, token?)    # Playwright APIRequestContext
├── register(userPayload)          # POST /users/register
├── login(email, password)           # POST /users/login → returns token
└── getProfile(token)                # GET /users/me

invoiceApiPage.js
├── createInvoice(billingPayload)    # POST /invoices
└── getInvoices(token)               # GET /invoices
```

### 3.4 POM rules in Prism

| Rule | Rationale |
|------|-----------|
| **No locators in spec files** | Maintenance — one place to update selectors |
| **No assertions in page objects** | Pages perform actions; tests assert outcomes |
| **Business-language methods** | `confirmCheckoutTwice()` not `clickButton('#confirm')` |
| **Private locators** | Locators defined in constructor; not exported |
| **Composition over inheritance** | Feature pages use basePage helpers, not deep inheritance chains |

### 3.5 Toolshop-specific POM consideration

The **double-confirm invoice quirk** is encapsulated in `checkoutPage.js`:

```
async confirmCheckoutTwice() {
  await this.confirmButton.click();
  await this.confirmButton.click();  // Assessment requirement
}
```

Tests call this method — they do not implement the two-click logic inline.

---

## 4. Fixtures & Utility Classes

### 4.1 Playwright fixtures (`fixtures/`)

Prism extends Playwright's built-in `test` object with custom fixtures:

| Fixture | Injects | Used for |
|---------|---------|----------|
| `authPage` | `AuthPage` instance | UI auth tests |
| `checkoutPage` | `CheckoutPage` instance | E2E purchase flow |
| `authApiPage` | `AuthApiPage` + token | API test setup |
| `testUser` | Fresh registered user payload | Isolation per test |
| `authenticatedPage` | Browser session with logged-in user | Cart/checkout UI tests |

**Example fixture flow (conceptual):**

```
test.beforeEach → testDataFactory.createUser()
               → authApiPage.register(user)
               → authApiPage.login(user) → token
               → inject token into API tests OR login via UI
```

### 4.2 Utility classes (`utils/`)

| Utility | Purpose |
|---------|---------|
| `testDataFactory.js` | Generates unique users (Faker), static billing, discovers products |
| `apiHelper.js` | Attaches `Authorization: Bearer {token}` header; status code assertions |
| `logger.js` | Logs test steps; redacts tokens and passwords |
| `dateHelper.js` | DOB generation within 18–75 year constraint |

### 4.3 Fixture vs utility decision

| Use fixture when | Use utility when |
|------------------|------------------|
| Setup is needed per test/worker | Pure function with no Playwright context |
| Injecting page objects into tests | Data transformation or formatting |
| Managing browser session lifecycle | Reading static JSON test data |

---

## 5. Test Data Management Approach

### 5.1 Prism data strategy (aligned with Prompt 9)

| Data type | Prism location | Method |
|-----------|----------------|--------|
| Static billing (COD) | `test-data/static-test-data.json` | Imported directly |
| Env credentials | `.env` via `dotenv` | `process.env.TEST_USER_PASSWORD` |
| Dynamic users | `utils/testDataFactory.js` | Faker + timestamp email |
| Product/cart IDs | Runtime in spec `beforeEach` | API discovery — never hardcoded |
| Bearer tokens | Runtime variable in test scope | Captured from login; never logged |

### 5.2 Data flow in Prism tests

```
.env.example (repo root)
       ↓
config/env.config.js  →  reads BASE_URL, credentials
       ↓
testDataFactory.js    →  creates user payload, billing object
       ↓
authApiPage.register() / authPage.register()
       ↓
test execution        →  dynamic cart_id, invoice_id captured
       ↓
assertions            →  compare UI vs API state
```

### 5.3 Prism data isolation rules

- **One unique user per test** for registration flows (prevents 409)
- **Demo customer account** reserved for negative login only
- **No test data in spec files** — always via factory or fixture
- **Static assessment billing** centralised in JSON — single source of truth

---

## 6. Test Tagging Strategy

### 6.1 Tag implementation

Prism uses Playwright's native tag support via `@` annotations in test titles or `grep` config:

```javascript
// Pattern (conceptual — not modifying code)
test('TC-UI-01 @Smoke @positive Register new user', async ({ authPage }) => { ... });
test('TC-UI-03 @Regression @negative Invalid login', async ({ authPage }) => { ... });
```

### 6.2 Tag matrix (aligned with RTM)

| Tag | UI tests | API tests | Run command (expected) |
|-----|----------|-----------|------------------------|
| `@Smoke` | TC-UI-01, 02, 04, 07 | TC-API-01, 02, 03, 05 | `npm run test:smoke` |
| `@Regression` | TC-UI-03, 05, 06, 07, 08 | TC-API-01, 02, 04, 05, 06 | `npm run test:regression` |
| `@positive` | TC-UI-01, 02, 04, 05, 06, 07 | TC-API-01–05 | Filter via grep |
| `@negative` | TC-UI-03, 08 | TC-API-01, 02, 06 | Filter via grep |

### 6.3 playwright.config.js tagging (expected)

```
projects: [
  { name: 'ui-smoke',     grep: /@Smoke/,     testDir: 'tests/ui' },
  { name: 'ui-regression', grep: /@Regression/, testDir: 'tests/ui' },
  { name: 'api-smoke',    grep: /@Smoke/,     testDir: 'tests/api' },
  { name: 'api-regression', grep: /@Regression/, testDir: 'tests/api' },
]
```

### 6.4 Tag rules

| Rule | Detail |
|------|--------|
| Every automated test has `@Smoke` OR `@Regression` (some both) | Assessment mandate |
| Test ID (`TC-UI-##`) in title | RTM traceability |
| Type tag (`@positive` / `@negative`) | Coverage reporting |
| Tags are lowercase | `@Smoke` / `@Regression` per assessment (case as specified) |

---

## 7. Reporting Configuration & Output

### 7.1 Prism reporting stack (expected)

| Reporter | Output | Purpose |
|----------|--------|---------|
| **HTML** | `reports/html/` or `playwright-report/` | Human-readable execution evidence for assessment |
| **JSON** | `reports/json/results.json` | CI parsing, pass/fail counts |
| **JUnit** | `reports/junit.xml` | Optional CI integration |
| **List** | Console stdout | Developer feedback during run |
| **Screenshot** | `reports/screenshots/` | On failure only (`screenshot: 'only-on-failure'`) |
| **Trace** | `reports/traces/` | On retry (`trace: 'on-first-retry'`) |

### 7.2 Expected playwright.config.js reporter block

```javascript
// Conceptual — inspection reference only
reporter: [
  ['html',  { outputFolder: 'reports/html', open: 'never' }],
  ['json',  { outputFile: 'reports/json/results.json' }],
  ['list'],
],
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'on-first-retry',
},
```

### 7.3 Assessment execution evidence requirements

| Requirement | Prism output |
|-------------|--------------|
| All tests **Passed** | HTML report showing green status per TC-UI/API |
| Execution reports included | `reports/html/index.html` committed or screenshot in `execution-evidence/` |
| README documents report location | `readme.md` → "Reports generated at `PrismStructure/reports/html/`" |
| Smoke vs Regression separate commands | `npm run test:smoke` / `npm run test:regression` |

### 7.4 Report contents per test case

Each report entry should show:
- Test ID (TC-UI-## / TC-API-##)
- Tag (@Smoke / @Regression)
- Pass/fail status
- Duration
- Screenshot on failure
- Trace link for debugging

---

## 8. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    playwright.config.js                      │
│         (projects, reporters, baseURL, timeouts)             │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
   ┌──────────┐     ┌────────────┐    ┌──────────────┐
   │ fixtures │     │   tests/   │    │   config/    │
   │          │────▶│ ui + api   │◀───│  env.config  │
   └──────────┘     └─────┬──────┘    └──────────────┘
         │                │
         │         ┌──────┴──────┐
         ▼         ▼             ▼
   ┌──────────┐ ┌────────┐ ┌──────────┐
   │  utils/  │ │ pages/ │ │   api/   │
   │ factory  │ │  (POM) │ │ (API POM)│
   └────┬─────┘ └───┬────┘ └────┬─────┘
        │           │           │
        ▼           ▼           ▼
   ┌─────────────────────────────────┐
   │         test-data/ + .env        │
   └─────────────────────────────────┘
        │           │           │
        ▼           ▼           ▼
   ┌─────────┐ ┌──────────┐ ┌─────────────┐
   │ Toolshop│ │ Browser  │ │  REST API   │
   │   UI    │ │ (Chromium)│ │  Laravel    │
   └─────────┘ └──────────┘ └─────────────┘
                           │
                           ▼
                   ┌──────────────┐
                   │   reports/   │
                   │ HTML + JSON  │
                   └──────────────┘
```

---

## 9. Mapping Prism to Assessment Test Cases

| Test ID | Prism spec (expected) | Page/API objects used |
|---------|----------------------|------------------------|
| TC-UI-01 | `tests/ui/auth.spec.js` | `authPage.register()` |
| TC-UI-02 | `tests/ui/auth.spec.js` | `authPage.login()`, `verifyProfile()` |
| TC-UI-03 | `tests/ui/auth.spec.js` | `authPage.login()` → expect error |
| TC-UI-04 | `tests/ui/product.spec.js` | `productPage.browseProducts()` |
| TC-UI-05 | `tests/ui/cart.spec.js` | `cartPage.addToCart()`, `updateQuantity()` |
| TC-UI-06 | `tests/ui/product.spec.js` | `productPage.searchProduct()` |
| TC-UI-07 | `tests/ui/checkout.spec.js` | All pages — full E2E |
| TC-UI-08 | `tests/ui/auth.spec.js` | `authPage.register()` → duplicate |
| TC-API-01 | `tests/api/auth.api.spec.js` | `authApiPage.register()` |
| TC-API-02 | `tests/api/auth.api.spec.js` | `authApiPage.login()` |
| TC-API-03 | `tests/api/cart.api.spec.js` | `cartApiPage.create()`, `addProduct()` |
| TC-API-04 | `tests/api/cart.api.spec.js` | `cartApiPage.updateQuantity()` |
| TC-API-05 | `tests/api/invoice.api.spec.js` | `invoiceApiPage.create()` |
| TC-API-06 | `tests/api/invoice.api.spec.js` | `invoiceApiPage.getInvoices()` IDOR |

---

## 10. Inspection Gaps & Next Steps

| Gap | Recommendation |
|-----|----------------|
| `PrismStructure/` not in repo | Scaffold in Prompt 11+ using structure above |
| No `playwright.config.js` to inspect | Create with Smoke/Regression projects |
| Prism source is organisational | Request internal Prism boilerplate from competency team if available |
| `authApiPage.js` not yet created | First API page object per assessment Quick Tips |
| Execution reports folder empty | Run suite after implementation; capture HTML report |

### Re-inspection trigger

Re-run this inspection after `PrismStructure/` is scaffolded to validate:
- [ ] Actual folder structure matches expected layout
- [ ] POM classes follow no-assertion-in-page rule
- [ ] Fixtures inject page objects correctly
- [ ] Tags parse via `npx playwright test --grep @Smoke`
- [ ] HTML report generates to `reports/html/`

---

## AI Response Summary

Prism Playwright framework is **not yet present** in the QA-Assignment repo. Provided architectural overview based on assessment submission structure, Quick Tips (`authApiPage.js`, `PrismStructure-toolshop-playwright`), and standard Prism conventions: layered POM (UI + API), fixtures for dependency injection, TestDataFactory for dynamic data, `@Smoke`/`@Regression` tagging via Playwright grep, and HTML/JSON reporting for execution evidence. No code was modified.
