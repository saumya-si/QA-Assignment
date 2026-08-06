# QA Assignment — Practice Software Testing Toolshop

Repository for the **QA AI Capability Exercise** — end-to-end quality engineering for the [Practice Software Testing Toolshop v5.0](https://practicesoftwaretesting.com/).

**Repository:** [https://github.com/saumya-si/QA-Assignment](https://github.com/saumya-si/QA-Assignment)  
**Project documentation:** [project-info.md](project-info.md)

---

## Overview

| Layer | URL |
|-------|-----|
| **UI** | https://practicesoftwaretesting.com |
| **API** | https://api.practicesoftwaretesting.com |
| **API docs** | https://api.practicesoftwaretesting.com/api/documentation |

| Suite | Count | Location |
|-------|-------|----------|
| Manual tests | 8 | `FunctionalTestCase.csv` |
| UI automation | 8 | `PrismStructure/tests/ui/` |
| API automation | 8 | `PrismStructure/tests/api/` |
| Traceability | RTM | `RequirementTraceabilityMatrix.csv` |

**Framework:** Playwright with Prism conventions (POM, fixtures, helpers, `@Smoke` / `@Regression` tags)

---

## Prerequisites

- **Node.js** 18 or later
- **npm** (bundled with Node.js)
- Network access to the public Toolshop demo (UI + API)
- A `.env` file with test passwords (see below)

---

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/saumya-si/QA-Assignment.git
cd QA-Assignment
```

### 2. Configure environment variables

Copy the example file and set required passwords:

```bash
cp .env.example .env
```

Edit `.env` and set **both required** values:

```env
TEST_USER_PASSWORD=YourComplexPassword@99    # min 8 chars; upper, lower, number, symbol
TEST_CUSTOMER_PASSWORD=YourCustomerPassword  # pre-seeded demo customer password
```

Optional overrides:

```env
BASE_URL=https://practicesoftwaretesting.com
API_BASE_URL=https://api.practicesoftwaretesting.com
TEST_CUSTOMER_EMAIL=customer@practicesoftwaretesting.com
```

> **Security:** Never commit `.env`. Passwords are loaded at runtime via `PrismStructure/config/env.config.js`.

### 3. Install dependencies and browser

```bash
cd PrismStructure
npm install
npx playwright install chromium
```

### 4. Verify setup (smoke tests)

```bash
npm run test:smoke
```

Expected: **6 passed** (3 API + 3 UI smoke tests). Full suite: **16 passed**.

---

## Test Execution Commands

All commands run from the `PrismStructure/` directory.

### Full suite

```bash
cd PrismStructure
npm test
```

Runs **16 tests** (8 UI + 8 API). Duration ~2–3 minutes.

### Tagged suites

| Command | Description | Tests |
|---------|-------------|-------|
| `npm run test:smoke` | Critical path (`@Smoke`) | 6 |
| `npm run test:regression` | Broader coverage (`@Regression`) | 13 |
| `npm run test:ui` | All UI tests | 8 |
| `npm run test:api` | All API tests | 8 |
| `npm run test:ui:smoke` | UI smoke only | 3 |
| `npm run test:api:smoke` | API smoke only | 3 |
| `npm run test:ui:regression` | UI regression only | 7 |
| `npm run test:api:regression` | API regression only | 10 |

### Run a single spec or test

```bash
npx playwright test tests/ui/checkout.spec.js
npx playwright test tests/api/lifecycle.api.spec.js
npx playwright test --grep "TC-UI-07"
```

### Open last HTML report

```bash
npm run report
```

---

## Test Inventory

### UI automation (`tests/ui/`)

| ID | Scenario | Tags |
|----|----------|------|
| TC-UI-01 | Register valid user | `@Smoke @positive` |
| TC-UI-02 | Valid login + profile verification | `@Smoke @positive` |
| TC-UI-03 | Invalid login | `@Regression @negative` |
| TC-UI-04 | Out-of-stock product | `@Regression @negative @edge` |
| TC-UI-05 | Empty cart blocks checkout | `@Regression @negative` |
| TC-UI-06 | Single COD confirm — no invoice | `@Regression @negative @edge` |
| TC-UI-07 | Full E2E purchase + invoice | `@Smoke @Regression @positive` |
| TC-UI-08 | Duplicate email registration | `@Regression @negative` |

### API automation (`tests/api/`)

| ID | Scenario | Tags |
|----|----------|------|
| TC-API-01 | Register + duplicate email | `@Smoke @Regression` |
| TC-API-02 | Valid login returns token | `@Smoke @positive` |
| TC-API-06 | IDOR — own invoices only | `@Regression @negative` |
| TC-API-07 | Full purchase lifecycle | `@Smoke @Regression @positive` |
| TC-API-08 | Invalid login credentials | `@Regression @negative` |
| TC-API-09 | Missing auth token | `@Regression @negative` |
| TC-API-10 | Invalid resource IDs | `@Regression @negative` |
| TC-API-11 | Invalid request payloads | `@Regression @negative` |

---

## Test Data — Location and Management

### Static data

| File | Contents |
|------|----------|
| `test-data/static-test-data.json` | COD billing address, search keyword (`hammer`), DOB age bounds |
| `.env.example` | Environment variable template (no secrets) |

### Dynamic data (runtime)

| Data | Source | File |
|------|--------|------|
| User profiles (name, email, address) | Faker.js | `PrismStructure/utils/testDataFactory.js` |
| Passwords | `.env` → `TEST_USER_PASSWORD` | `PrismStructure/config/env.config.js` |
| Product IDs | `GET /products` (in-stock filter) | `testDataFactory.js`, `apiLifecycleHelper.js` |
| Cart / invoice IDs | API responses | Created per test run |
| Bearer tokens | `POST /users/login` | Captured at runtime; never stored in repo |

### Billing address (assessment example)

Used for API invoice and UI checkout tests:

```json
{
  "billing_street": "Zoey Shore",
  "billing_city": "Hesselbury",
  "billing_state": "Florida",
  "billing_country": "TG",
  "billing_postal_code": "1234AA",
  "payment_method": "cash-on-delivery",
  "payment_details": {}
}
```

Factory helper: `createBillingAddress(cartId)` in `testDataFactory.js`.

### Data isolation rules

- Unique email per run: `testuser_{timestamp}_{suffix}@example.com`
- New user and cart per test where possible
- Pre-seeded `customer@...` email used only for **negative** login scenarios
- No cleanup API required — demo app tolerates accumulated test users

---

## Reports — Generation and Access

Reports are generated automatically after every test run.

| Format | Path | How to open |
|--------|------|-------------|
| **Execution summary** | `PrismStructure/reports/execution-summary.md` | Committed redacted pass/fail evidence (no secrets) |
| **Execution evidence** | `PrismStructure/reports/execution-evidence/` | Console log, manual results, screenshot index |
| **HTML** | `PrismStructure/reports/html/index.html` | `npm run report` (from `PrismStructure/`) — gitignored, regenerate locally |
| **JSON** | `PrismStructure/reports/json/results.json` | Parse for CI integration — not committed |
| **Screenshots** | `PrismStructure/test-results/` | On failure — kept for failed attempts and retries (`retain-on-failure-and-retries`) |
| **Video** | `PrismStructure/test-results/` | On failure/retry — kept for failed attempts and retries (`retain-on-failure-and-retries`) |

HTML report includes per-test status, duration, steps, and failure attachments.

---

## Project Folder Structure

```
QA-Assignment/
├── README.md                          # Setup and execution guide (GitHub default)
├── readme.md                          # Assessment-required copy (same content)
├── project-info.md                    # Full project documentation (strategy, AI usage, risks)
├── .env.example                       # Environment template (copy to .env)
├── .cursor/                           # Cursor rules and project skills (optional)
│   ├── rules/                         # Project conventions for AI agent
│   └── skills/                        # Toolshop QA workflow skill
├── FunctionalTestCase.csv             # 8 manual test cases (all Passed)
├── RequirementTraceabilityMatrix.csv  # Requirements ↔ test mapping
├── QA Practical Assessment.pdf        # Assessment source document
│
├── test-data/
│   └── static-test-data.json          # Billing, search keywords, DOB rules
│
├── ai-prompt-history.md               # Consolidated AI prompt history (master index)
├── ai-prompts/                        # Assessment-required prompt history (self-contained)
│   ├── requirements-and-planning.md
│   ├── test-design.md
│   ├── test-data.md
│   ├── automation-and-debugging.md
│   └── documentation-and-summary.md
├── prompts/                           # Extended per-prompt artifacts (Phases 1–9)
│
└── PrismStructure/                    # Playwright automation framework
    ├── package.json                   # npm scripts and dependencies
    ├── playwright.config.js           # Playwright configuration
    ├── README.md                      # Framework-specific quick reference
    │
    ├── api/                           # API Page Objects
    │   └── index.js                   # Auth, Product, Cart, Invoice clients
    ├── pages/                         # UI Page Objects
    │   ├── index.js                   # Auth, Product, Cart, Checkout, Invoice
    │   ├── loginPage.js
    │   └── basePage.js
    ├── fixtures/
    │   └── testFixtures.js            # Injects POM + API clients + testUser
    ├── utils/
    │   ├── testDataFactory.js         # Faker users, billing, product discovery
    │   ├── apiHelper.js               # Status assertions, JSON parsing
    │   ├── apiLifecycleHelper.js      # API purchase flow steps
    │   ├── apiNegativeHelper.js       # Negative API assertions
    │   └── purchaseFlowHelper.js      # UI purchase flow steps
    ├── config/
    │   └── env.config.js              # Loads .env from repo root
    ├── tests/
    │   ├── ui/                        # 8 UI specs (TC-UI-01 – 08)
    │   └── api/                       # 8 API specs (TC-API-01, 02, 06 – 11)
    └── reports/
        ├── html/                      # HTML report (generated)
        └── json/                      # JSON results (generated)
```

---

## Known Issues and Limitations

### Double-confirmation checkout (critical)

The Toolshop UI requires clicking **Confirm twice** during Cash on Delivery checkout:

1. **First Confirm** — shows *"Payment was successful"* (order **not** complete; invoice **not** created)
2. **Second Confirm** — shows *"Thanks for your order! Your invoice number is INV-…"*

`TC-UI-06` validates that a single confirm does **not** create an invoice. `TC-UI-07` validates the full double-confirm flow. The checkout spec uses `retries: 1` and `expect.poll()` to handle occasional timing sensitivity — **no fixed `waitForTimeout()` sleeps**.

### Application / environment

| Limitation | Notes |
|------------|-------|
| **Public demo SUT** | Shared environment; occasional slowness or rate limiting |
| **Product IDs are ULIDs** | Never hardcoded — discovered at runtime via API |
| **Registration form (v2.3)** | Requires country, full address, and digits-only phone |
| **Search “no results”** | Live SUT may still list products for nonsense keywords — UI test uses OOS instead |
| **Cloudflare** | May affect headless CI; run headed if blocked |

### Out of scope (not automated)

- Guest checkout, credit card / bank transfer payment
- Google OAuth registration
- Product filter, sort, pagination UI
- Invoice PDF download
- Admin and reporting API endpoints
- TOTP two-factor authentication

### Test count constraint

Assessment limits each automation tier to **5–8 tests**. Current counts: **8 UI**, **8 API**. Positive cart/invoice flows are consolidated into lifecycle E2E tests (`TC-UI-07`, `TC-API-07`).

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Missing required environment variable: TEST_USER_PASSWORD` | Create `.env` from `.env.example` and set passwords |
| `405` on cart add (API) | Ensure `CartApiPage.addProduct` uses `POST /carts/{id}` with `{ product_id, quantity }` |
| Registration stays on `/auth/register` | Verify address, country, and numeric phone are filled |
| TC-UI-07 flaky on first run | Normal — retries once; failure + retry artifacts kept under `test-results/` (`retain-on-failure-and-retries`) |
| `npx playwright: command not found` | Run `npm install` inside `PrismStructure/` |

---

## Additional Documentation

| Document | Description |
|----------|-------------|
| [project-info.md](project-info.md) | Strategy, risks, AI usage, maintainability |
| [PrismStructure/README.md](PrismStructure/README.md) | Framework quick reference |
| [ai-prompt-history.md](ai-prompt-history.md) | Consolidated AI prompt history (master index) |
| [ai-prompts/](ai-prompts/) | Assessment-required prompt history (5 themed files) |
| [prompts/](prompts/) | Detailed per-prompt artifacts by phase |
| [RequirementTraceabilityMatrix.csv](RequirementTraceabilityMatrix.csv) | Requirement traceability |

---

## License

MIT — see assessment context for Toolshop application licensing (demo application by Testsmith).
