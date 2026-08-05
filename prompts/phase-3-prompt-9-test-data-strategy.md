# Phase 3 — Prompt 9: Test Data Strategy

**Prompt:** Develop a comprehensive test data strategy covering data categories, static vs dynamic data, generation methods, cleanup/maintenance, shared data risks, and AI usage for test data.

**SUT:** Practice Software Testing — Toolshop v5.0  
**References:** FunctionalTestCase.csv, RTM, Prompt 4 (Responsible AI), TC-UI/API/MAN test suites

---

## 1. Strategy Overview

| Principle | Approach |
|-----------|----------|
| **Isolation** | Each test run creates its own user/cart where possible |
| **No secrets in repo** | Credentials and tokens live in `.env` only |
| **Synthetic data** | Faker-generated PII; no real personal data |
| **Deterministic where needed** | Billing address uses assessment-fixed example |
| **Dynamic by default** | Emails, names, cart IDs, invoice IDs generated at runtime |
| **AI augments, not replaces** | AI suggests data patterns; human validates against API rules |

---

## 2. Test Data Categories

### 2.1 User Accounts (Authentication)

| Data element | Type | Source | Used by |
|--------------|------|--------|---------|
| `first_name` | Dynamic | Faker `person.firstName()` | TC-MAN-01, TC-UI-01, TC-API-01 |
| `last_name` | Dynamic | Faker `person.lastName()` | TC-MAN-01, TC-UI-01, TC-API-01 |
| `email` | Dynamic | `testuser_${timestamp}@example.com` | Registration tests (unique per run) |
| `password` | Static (env) | `TEST_USER_PASSWORD` in `.env` | All login/register tests |
| `dob` | Dynamic | Faker date between 18–75 years ago | TC-MAN-01, TC-API-01 |
| `phone` | Dynamic | Faker `phone.number()` (optional field) | Registration |
| `address.street` | Dynamic | Faker `location.streetAddress()` | Registration, profile |
| `address.city` | Dynamic | Faker `location.city()` | Registration, profile |
| `address.state` | Dynamic | Faker `location.state()` | Registration, profile |
| `address.country` | Static | `"TG"` or `"US"` (2-letter code) | Registration |
| `address.postal_code` | Dynamic | Faker `location.zipCode()` | Registration |
| Pre-seeded customer email | Static (env) | `TEST_CUSTOMER_EMAIL` | TC-MAN-02, TC-UI-03 (negative login) |
| Pre-seeded customer password | Static (env) | `TEST_CUSTOMER_PASSWORD` | TC-MAN-02, TC-UI-03 |
| Bearer token | Dynamic (runtime) | Captured from POST `/users/login` | TC-API-02 – 06; never stored in repo |

**Password complexity rule (API):** min 8 chars; uppercase + lowercase + number + symbol  
**Example pattern:** `Test@Pass123` (stored in `.env`, not in code or prompts)

---

### 2.2 Products & Catalog

| Data element | Type | Source | Used by |
|--------------|------|--------|---------|
| Product ID | Dynamic | Discovered at runtime via GET `/products` | TC-UI-05, TC-UI-07, TC-API-03 |
| Product name | Dynamic | First in-stock product from listing | Cart and E2E tests |
| Search keyword | Static | `"hammer"` or `"drill"` (known catalog terms) | TC-MAN-03, TC-UI-06 |
| Search — no results | Static | `"zzznomatch999"` | Manual deferred / future regression |
| Out-of-stock product | Dynamic | Filter `in_stock: false` from API response | Deferred manual scenario |
| Category / brand filter | Dynamic | First available from GET `/categories` | Deferred manual scenario |

**Rule:** Never hardcode product IDs — they are ULIDs and may change between environments.

---

### 2.3 Shopping Cart

| Data element | Type | Source | Used by |
|--------------|------|--------|---------|
| `cart_id` | Dynamic | POST `/carts` response | TC-API-03 – 05 |
| Line item quantity | Dynamic | `1` initial; `2` for qty-update tests | TC-MAN-04, TC-UI-05, TC-API-04 |
| Multi-item cart | Dynamic | Two distinct in-stock products | TC-MAN-04, TC-UI-07 |
| Empty cart | Dynamic | Fresh session with no items added | CHK-R04 gap (deferred) |
| Cart total | Dynamic (computed) | Asserted against UI/API response | TC-MAN-04, TC-UI-05, TC-API-04 |

**Rule:** Create a new cart per API test suite run; do not reuse `cart_id` across parallel tests.

---

### 2.4 Checkout & Billing

| Data element | Type | Source | Used by |
|--------------|------|--------|---------|
| `billing_street` | Static | `"Zoey Shore"` (assessment example) | TC-MAN-05, TC-MAN-06, TC-API-05 |
| `billing_city` | Static | `"Hesselbury"` | TC-MAN-05, TC-MAN-06, TC-API-05 |
| `billing_state` | Static | `"Florida"` | TC-MAN-05, TC-MAN-06, TC-API-05 |
| `billing_country` | Static | `"TG"` | TC-MAN-05, TC-MAN-06, TC-API-05 |
| `billing_postal_code` | Static | `"1234AA"` | TC-MAN-05, TC-MAN-06, TC-API-05 |
| `payment_method` | Static | `"cash-on-delivery"` | All checkout tests (assessment mandate) |
| `payment_details` | Static | `{}` (empty object for COD) | TC-API-05 |
| Invalid billing (negative) | Dynamic | Omit `billing_city` field | CHK-R02 gap — TC-API-05 negative |

**Rationale for static billing:** Assessment provides explicit example payload; using it ensures evaluator recognition and reproducible API tests.

---

### 2.5 Invoices

| Data element | Type | Source | Used by |
|--------------|------|--------|---------|
| `invoice_id` / invoice number | Dynamic | Captured from checkout response or GET `/invoices` | TC-MAN-06, TC-UI-07 |
| Invoice line items | Dynamic (computed) | Match cart contents at checkout time | TC-MAN-06, TC-UI-07, TC-API-05 |
| Invoice total | Dynamic (computed) | Asserted against cart total | TC-MAN-06, INV-R03 |
| Double-confirm action | Static (behaviour) | Click Confirm **twice** on UI | TC-MAN-05, TC-MAN-06, TC-UI-07 |
| Single-confirm (negative) | Static (behaviour) | Click Confirm **once** only | TC-MAN-07 |

---

### 2.6 Environment & Configuration

| Data element | Type | Source | Used by |
|--------------|------|--------|---------|
| `BASE_URL` | Static (env) | `https://practicesoftwaretesting.com` | All UI tests |
| `API_BASE_URL` | Static (env) | `https://api.practicesoftwaretesting.com` | All API tests |
| `.env` file | Static (local) | Developer machine / CI secrets | All automation |
| `.env.example` | Static (repo) | Committed template with empty values | Setup documentation |

---

## 3. Static vs Dynamic Test Data

| Category | Static | Dynamic | Rationale |
|----------|--------|---------|-------------|
| **User email** | Pre-seeded customer email (negative tests) | Registration email (unique per run) | Uniqueness prevents 409 conflicts |
| **User password** | Env var (same complex password) | — | Simplifies maintenance; meets API rules |
| **User name/address** | — | Faker per run | Avoids duplicate identity collisions |
| **Product ID** | — | Runtime discovery | IDs are environment-specific ULIDs |
| **Cart ID** | — | Created per test/API flow | Prevents cross-test contamination |
| **Billing address** | Assessment example (COD tests) | — | Assessment alignment + reproducibility |
| **Payment method** | `cash-on-delivery` | — | Assessment mandate |
| **Search keyword** | `"hammer"` | — | Known catalog content |
| **Bearer token** | — | Runtime from login | Security — never persisted |
| **Invoice ID** | — | Runtime from checkout | Unique per order |

### Decision rule

```
IF field requires uniqueness across runs → Dynamic (Faker / timestamp)
IF field is assessment-mandated or env config  → Static
IF field is a security credential/token        → Env var, runtime capture only
IF field is a product/cart/invoice ID          → Dynamic discovery, never hardcoded
```

---

## 4. Test Data Generation Methods

### 4.1 Faker Library (Primary — UI & API automation)

| Field | Faker method / pattern |
|-------|------------------------|
| Email | `` `testuser_${Date.now()}@example.com` `` or `@faker-js/faker` |
| First / last name | `faker.person.firstName()`, `faker.person.lastName()` |
| DOB | `faker.date.birthdate({ min: 18, max: 75, mode: 'age' })` |
| Address | `faker.location.streetAddress()`, `.city()`, `.zipCode()` |
| Phone | `faker.phone.number()` |

**Used in:** Playwright test fixtures, API helper `createTestUser()` utility

### 4.2 API-Driven Discovery (Runtime)

| Need | API call |
|------|----------|
| Product ID | `GET /products` → filter `in_stock: true` → take first |
| Cart ID | `POST /carts` → extract `id` |
| Bearer token | `POST /users/login` → extract `access_token` |
| Invoice ID | `POST /invoices` or `GET /invoices` → extract latest |

**Used in:** TC-API-03 – 06, TC-UI-05, TC-UI-07 setup steps

### 4.3 Environment Variables (Static credentials)

```bash
# .env.example (committed — no values)
BASE_URL=https://practicesoftwaretesting.com
API_BASE_URL=https://api.practicesoftwaretesting.com
TEST_USER_PASSWORD=
TEST_CUSTOMER_EMAIL=
TEST_CUSTOMER_PASSWORD=
```

**Used in:** All tests requiring login; never committed with real values

### 4.4 Manual Test Data (CSV / tester reference)

| Source | Usage |
|--------|-------|
| `FunctionalTestCase.csv` TestData column | Human-readable data per TC-MAN case |
| Assessment billing example | TC-MAN-05, TC-MAN-06 |
| `testuser_<timestamp>@example.com` pattern | TC-MAN-01 (tester generates at execution) |

### 4.5 Data Factory Pattern (Automation)

```
TestDataFactory
├── createUser(overrides?)     → unique user payload for POST /users/register
├── createBillingAddress()     → static assessment billing object
├── getInStockProduct()        → API discovery helper
├── createCartWithProducts(n)  → cart_id + line items
└── loginAndGetToken(user?)    → bearer token for API tests
```

Implemented in Phase 3 automation (PrismStructure); referenced here as strategy.

---

## 5. Test Data Cleanup & Maintenance

### 5.1 Cleanup Approach

| Layer | Strategy | Rationale |
|-------|----------|-----------|
| **UI automation** | No explicit delete — use unique users per run | Demo app; no delete-user API required for assessment |
| **API automation** | No explicit teardown — unique users/carts per suite | Avoids cleanup API dependency |
| **Manual testing** | Use disposable `@example.com` emails | No pollution of shared accounts |
| **Bearer tokens** | Discarded after test / suite | Security best practice |
| **Local artifacts** | `.env`, `test-results/`, `playwright-report/` in `.gitignore` | Prevent credential/report leakage |
| **CI environment** | Fresh runner per build | Natural isolation |

### 5.2 Maintenance Schedule

| Activity | Frequency | Owner |
|----------|-----------|-------|
| Verify pre-seeded demo accounts still work | Before each test execution cycle | QA engineer |
| Rotate `.env` passwords if exposed | Immediately on leak | QA engineer |
| Update product search keyword if catalog changes | When UI search test fails | QA + AI assist |
| Review Faker output against API validation rules | After API schema changes | QA engineer |
| Refresh `.env.example` when new vars added | Per automation PR | Developer |

### 5.3 Data Lifecycle per Test Tier

```
[Generate unique user] → [Execute test] → [Discard session]
        ↓
[Optional: invoice persists in SUT] → acceptable (demo app, no PII)
```

No automated purge required — Toolshop is a public demo environment designed for test data accumulation.

---

## 6. Risks of Shared or Reusable Test Data

| Risk | Description | Impact | Mitigation |
|------|-------------|--------|------------|
| **R-01 Email collision** | Reusing same registration email across runs | 409 Conflict; test fails | Unique email per run (`timestamp` / Faker) |
| **R-02 Parallel test interference** | Two tests login as same user simultaneously | Cart/session overwrite; flaky E2E | Unique user per parallel worker; serialise checkout tests |
| **R-03 Stale product IDs** | Hardcoded product ULID after catalog refresh | 404 on add-to-cart | Runtime discovery via GET `/products` |
| **R-04 Shared demo account mutation** | Multiple testers use `customer@...` for positive flows | Cart/invoice pollution | Reserve demo account for **negative tests only**; Faker users for positive |
| **R-05 Token leakage** | Bearer token in logs, reports, or git | Security exposure | Redact in logs; runtime capture only; `.gitignore` auth files |
| **R-06 Invoice history noise** | Repeated checkouts on same account | TC-MAN-07 edge case ambiguous | Use fresh user for single-confirm test |
| **R-07 Password in repo** | Hardcoded `welcome01` in specs | Public repo credential exposure | Env vars only; `.env.example` template |
| **R-08 Billing data drift** | Changing assessment example without updating tests | API 422 / UI validation fail | Centralise in `TestDataFactory.createBillingAddress()` |

### Shared data usage matrix

| Data | Safe to share? | Condition |
|------|----------------|-----------|
| Demo customer email | ⚠️ Limited | Negative login tests only |
| Demo customer password | ❌ Never in repo | `.env` only |
| Registration email | ❌ Never reuse | Unique per run |
| Billing address (assessment) | ✅ Yes | Static across all COD tests |
| Search keyword `"hammer"` | ✅ Yes | Read-only catalog query |
| Product ID | ❌ Never hardcode | Discover at runtime |
| Cart ID | ❌ Never reuse | New cart per flow |

---

## 7. AI for Test Data Generation

### 7.1 Where AI adds value

| Use case | AI prompt example | Output |
|----------|-------------------|--------|
| Generate valid user payloads | *"Create 5 registration payloads meeting Toolshop API rules (DOB 18-75, password complexity)"* | JSON array for review |
| Edge case data ideas | *"List 10 boundary values for postal_code field max 10 chars"* | Test data ideas for manual CSV |
| Negative API payloads | *"Generate invoice POST body missing each required field one at a time"* | CHK-R02 negative data sets |
| Faker factory code | *"Create createTestUser() using @faker-js/faker matching UserRequest schema"* | Automation helper (review before use) |
| Data-driven test matrix | *"Map TC-API-01-06 to required data per step"* | Traceability aid |

### 7.2 AI usage rules (from Prompt 4)

| Do | Don't |
|----|-------|
| Ask AI for data **patterns** and **structures** | Paste real bearer tokens or passwords into prompts |
| Validate AI-generated payloads against Swagger schema | Trust AI output without API validation |
| Save AI prompts to `ai-prompts/test-data.md` | Commit generated credentials |
| Use AI to generate `.env.example` variable list | Share full `.env` contents with AI |
| Redact tokens before sharing API errors with AI | Include `Authorization` headers in debug prompts |

### 7.3 AI-generated data validation checklist

Before using AI-suggested test data in tests:

- [ ] Email format valid and unique mechanism included
- [ ] Password meets complexity rules (8+, upper, lower, number, symbol)
- [ ] DOB within 18–75 year range
- [ ] Field lengths within API maxLength constraints
- [ ] `payment_method` is `cash-on-delivery` for assessment flows
- [ ] `billing_country` uses valid country code
- [ ] No real PII or production values
- [ ] Product/cart IDs marked as runtime-discovered, not hardcoded

### 7.4 Example AI prompt for this project (save to `ai-prompts/test-data.md`)

```
Prompt: Generate a Playwright TestDataFactory for Toolshop v5 that:
- Creates unique users with faker (email with timestamp)
- Returns static assessment billing address for COD
- Discovers first in-stock product via API
- Reads credentials from process.env
Do not hardcode passwords or tokens.

AI Response Summary: Factory with createUser(), createBillingAddress(),
getInStockProduct(), loginAndGetToken() methods.

Validation Notes: Verified DOB range and password rules against Swagger
UserRequest schema; billing address matches assessment PDF example.
```

---

## 8. Test Data Mapping to Test Cases

| Test Case | Key test data |
|-----------|---------------|
| TC-MAN-01 | Dynamic user (Faker + timestamp email) |
| TC-MAN-02 | Static env customer email + invalid password |
| TC-MAN-03 | Static search keyword `"hammer"` |
| TC-MAN-04 | 2 dynamic in-stock products; qty 1→2 |
| TC-MAN-05 | Static assessment billing; COD; double Confirm |
| TC-MAN-06 | Static billing; dynamic products; double Confirm |
| TC-MAN-07 | Static billing; single Confirm |
| TC-MAN-08 | Static existing email (`customer@...`) + dynamic other fields |
| TC-UI-01 – 08 | Same patterns as manual; automated via TestDataFactory |
| TC-API-01 | Dynamic user JSON; duplicate uses static existing email |
| TC-API-02 | Env credentials; dynamic token capture |
| TC-API-03 – 05 | Runtime product ID, cart ID, token, static billing |
| TC-API-06 | Two dynamic users; cross-token IDOR check |

---

## 9. File & Folder Structure

```
QA-Assignment/
├── .env.example              # Template — committed
├── .env                      # Real values — gitignored
├── FunctionalTestCase.csv    # Manual test data reference
├── RequirementTraceabilityMatrix.csv
└── PrismStructure/           # Phase 3+ automation
    ├── test-data/
    │   ├── testDataFactory.js
    │   ├── billingAddress.json    # Static assessment billing
    │   └── searchTerms.json       # Static search keywords
    └── fixtures/
        └── testUser.fixture.js    # Per-test unique user
```

---

## AI Response Summary

Defined test data strategy across 6 categories (users, products, cart, billing, invoices, environment). Dynamic data for unique/runtime fields; static for assessment billing and env config. Faker + API discovery + env vars as generation methods. No cleanup API needed for demo SUT; unique users per run mitigates shared-data risks. AI used for payload patterns and factory code with validation checklist. Mapped data approach to all 22 test cases.
