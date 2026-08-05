# PrismStructure — Toolshop Playwright Framework

Prism-convention Playwright automation for [Practice Software Testing Toolshop](https://practicesoftwaretesting.com/).

## Prerequisites

- Node.js 18+
- Copy `.env.example` from repo root to `.env` and set passwords

## Setup

```bash
cd PrismStructure
npm install
npx playwright install chromium
```

## Run Tests

| Command | Description |
|---------|-------------|
| `npm test` | Run all UI + API tests |
| `npm run test:smoke` | Run `@Smoke` tagged tests |
| `npm run test:regression` | Run `@Regression` tagged tests |
| `npm run test:ui` | UI tests only |
| `npm run test:api` | API tests only |
| `npm run report` | Open HTML report |

## Reports

HTML report: `PrismStructure/reports/html/index.html`  
JSON results: `PrismStructure/reports/json/results.json`

## Structure

```
pages/     → UI Page Object Model
api/       → API Page Object Model
tests/ui/  → TC-UI-01 – 08
tests/api/ → TC-API-01 – 06
fixtures/  → Playwright custom fixtures
utils/     → testDataFactory, apiHelper
config/    → Environment configuration
```

## Security

- No credentials in source code
- All secrets via `.env` (gitignored)
- Tokens captured at runtime only
