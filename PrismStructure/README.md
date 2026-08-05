# PrismStructure — Toolshop Playwright Framework

Prism-convention Playwright automation for [Practice Software Testing Toolshop](https://practicesoftwaretesting.com/).

> **Setup and full documentation:** see the [repository README](../README.md).

## Prerequisites

- Node.js 18+
- `.env` at **repo root** (copy from `.env.example`) with `TEST_USER_PASSWORD` and `TEST_CUSTOMER_PASSWORD`

## Quick setup

```bash
# From repo root
cp .env.example .env    # edit passwords
cd PrismStructure
npm install
npx playwright install chromium
```

## Run tests

| Command | Description |
|---------|-------------|
| `npm test` | All UI + API tests (16) |
| `npm run test:smoke` | `@Smoke` tagged (6) |
| `npm run test:regression` | `@Regression` tagged (13) |
| `npm run test:ui` | UI tests only (8) |
| `npm run test:api` | API tests only (8) |
| `npm run test:ui:smoke` | UI smoke (3) |
| `npm run test:api:smoke` | API smoke (3) |
| `npm run test:ui:regression` | UI regression (7) |
| `npm run test:api:regression` | API regression (10) |
| `npm run report` | Open HTML report |

## Reports

| Format | Path |
|--------|------|
| HTML | `reports/html/index.html` → `npm run report` |
| JSON | `reports/json/results.json` |
| Failure artifacts | `test-results/` (screenshots, video) |

## Structure

```
api/                    → API Page Objects (Auth, Product, Cart, Invoice)
pages/                  → UI Page Objects + LoginPage
fixtures/               → Playwright custom fixtures
utils/
  testDataFactory.js    → Faker users, billing, product discovery
  apiHelper.js          → Status assertions, token propagation
  apiLifecycleHelper.js → API purchase lifecycle steps
  apiNegativeHelper.js  → Negative API error assertions
  purchaseFlowHelper.js → UI purchase flow steps
config/env.config.js    → Loads .env from repo root
tests/ui/               → TC-UI-01 – 08
tests/api/              → TC-API-01, 02, 06 – 11
```

## Test data

- **Static:** `../test-data/static-test-data.json` (billing, search keyword)
- **Dynamic:** `utils/testDataFactory.js` (Faker users, runtime product IDs)
- **Secrets:** `../.env` only — never in source code

## Security

- No credentials in source code
- Tokens captured at runtime only
- `redactToken()` helper available in `apiHelper.js`

## Known quirk — double confirm

COD checkout requires **two Confirm clicks**. See [repository README — Known Issues](../README.md#known-issues-and-limitations).
