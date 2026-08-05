# Phase 4 — Prompt 11: Playwright Framework Setup

**Prompt:** Set up Playwright automation following Prism conventions: POM, API helpers, separate test data, @Smoke/@Regression tags, HTML reports, .env support, no hardcoded credentials.

**Output:** `PrismStructure/` folder

---

## Summary of Changes

### Framework scaffolded

| Component | Path | Purpose |
|-----------|------|---------|
| **Package config** | `package.json` | Dependencies, npm scripts for smoke/regression/ui/api |
| **Playwright config** | `playwright.config.js` | HTML + JSON reporters, timeouts, Chromium project |
| **Env config** | `config/env.config.js` | Loads `.env` from repo root; no hardcoded secrets |
| **UI Page Objects** | `pages/index.js` | Auth, Product, Cart, Checkout, Invoice pages |
| **API Page Objects** | `api/index.js` | Auth, Product, Cart, Invoice API clients |
| **Fixtures** | `fixtures/testFixtures.js` | Injects page objects + API clients into tests |
| **Test data factory** | `utils/testDataFactory.js` | Faker users, static billing from JSON, product discovery |
| **API helper** | `utils/apiHelper.js` | Status assertions, JSON parsing, token redaction |
| **UI tests** | `tests/ui/*.spec.js` | TC-UI-01 – 08 (8 tests) |
| **API tests** | `tests/api/*.api.spec.js` | TC-API-01 – 06 (6 tests) |
| **Reports** | `reports/html/`, `reports/json/` | HTML + JSON execution output |

---

## Enhancement Details

### 1. Page Object Model (POM)

- **BasePage** — shared `navigate()`, `waitForAngularLoad()`, role/label helpers
- **Feature pages** — business methods only (`register()`, `confirmTwice()`, `searchProduct()`)
- **No assertions in page objects** — tests own all `expect()` calls
- **Double-confirm encapsulated** in `CheckoutPage.confirmTwice()` per assessment requirement

### 2. API helper classes

- **BaseApiClient** — token management, GET/POST/PUT/DELETE with auth headers
- **AuthApiPage** — register, login (auto-captures token)
- **CartApiPage** — create cart, add product, update quantity
- **InvoiceApiPage** — create invoice, list invoices
- Mirrors UI POM pattern for API layer (Prism convention)

### 3. Test data separation

| Data | Location | Not in test scripts |
|------|----------|---------------------|
| Static billing | `test-data/static-test-data.json` | ✅ |
| Credentials | `.env` (repo root) | ✅ |
| Dynamic users | `utils/testDataFactory.js` | ✅ |
| Product IDs | Runtime API discovery | ✅ |

### 4. @Smoke and @Regression tags

- Tags in test titles: `TC-UI-01 @Smoke @positive ...`
- Run via npm scripts:
  - `npm run test:smoke` → `--grep @Smoke`
  - `npm run test:regression` → `--grep @Regression`
- Separate UI/API smoke commands available

### 5. HTML report generation

```javascript
reporter: [
  ['html', { outputFolder: 'reports/html', open: 'never' }],
  ['json', { outputFile: 'reports/json/results.json' }],
]
```

View: `npm run report` → opens `reports/html/index.html`

### 6. Environment variable support

- Loads from `../../.env` (repo root)
- Required: `TEST_USER_PASSWORD`, `TEST_CUSTOMER_PASSWORD`
- Optional: `BASE_URL`, `API_BASE_URL`, customer emails
- `requireEnv()` throws clear error if password missing

### 7. No hardcoded credentials

- Passwords read from `process.env` only
- Demo customer email is public identifier; password from env
- Tokens captured at runtime, redacted in helper
- `.env` gitignored; `.env.example` committed with empty values

---

## Alignment with Prism Architecture

| Prism principle | Implementation |
|-----------------|----------------|
| Layered structure | `pages/`, `api/`, `tests/`, `utils/`, `config/` |
| UI + API dual POM | `authPage` + `authApi` naming convention |
| Fixtures inject dependencies | `testFixtures.js` extends Playwright `test` |
| Test ID traceability | Every spec titled `TC-UI-##` / `TC-API-##` |
| Smoke/Regression tags | `@Smoke`, `@Regression` in titles + grep scripts |
| Execution evidence | HTML report in `reports/html/` |
| Test data factory | `testDataFactory.js` per Prompt 9 strategy |
| authApiPage.js pattern | `api/index.js` AuthApiPage class (Quick Tips reference) |

---

## Test Coverage Matrix

| Tier | Count | Tags |
|------|-------|------|
| UI automation | 8 | 4 Smoke, 5 Regression |
| API automation | 6 | 4 Smoke, 5 Regression |
| **Total automated** | **14** | Within 5–8 per tier ✅ |

---

## Setup Instructions

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env — set TEST_USER_PASSWORD and TEST_CUSTOMER_PASSWORD

# 2. Install and run
cd PrismStructure
npm install
npx playwright install chromium
npm run test:smoke
npm run report
```

---

## AI Response Summary

Scaffolded complete PrismStructure Playwright framework with POM (UI + API), fixtures, testDataFactory, 14 tagged test specs, HTML/JSON reporting, and .env-based configuration. No credentials in source. Aligns with Prompt 10 architecture inspection and assessment submission structure.
