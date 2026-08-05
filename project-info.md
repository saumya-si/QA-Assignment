# Project Info — QA AI Capability Exercise

**Repository:** [https://github.com/saumya-si/QA-Assignment](https://github.com/saumya-si/QA-Assignment)  
**Application Under Test:** [Practice Software Testing — Toolshop v5.0](https://practicesoftwaretesting.com/)  
**API:** [https://api.practicesoftwaretesting.com/api/documentation](https://api.practicesoftwaretesting.com/api/documentation)  
**Primary AI Tool:** Cursor AI (Agent mode)

---

## 1. Project Overview and Summary

This project delivers a complete QA workflow for the Toolshop ecommerce demo application, aligned with the QA AI Capability Exercise. The work spans requirement analysis, risk assessment, manual test design, UI and API automation (Playwright + Prism conventions), test data strategy, execution evidence, and documented AI-assisted development.

### Objectives

- Validate **AC1** — user registration, login, profile, and API authentication/cart creation
- Validate **AC2** — end-to-end purchase flow: browse/search, cart, Cash on Delivery checkout, double-confirm invoice, and API invoice generation
- Demonstrate responsible AI usage from planning through debugging
- Produce a maintainable, traceable automation framework within assessment constraints (5–8 tests per tier)

### Deliverables

| Artifact | Location |
|----------|----------|
| Manual test cases | `FunctionalTestCase.csv` |
| Requirement Traceability Matrix | `RequirementTraceabilityMatrix.csv` |
| UI + API automation | `PrismStructure/` |
| Test data (static) | `test-data/static-test-data.json` |
| Prompt history | `prompts/` (Phases 1–7) |
| Execution reports | `PrismStructure/reports/html/`, `reports/json/` |

### Final execution status

| Suite | Tests | Result |
|-------|-------|--------|
| Full automation | 16 (8 UI + 8 API) | **16/16 passed** |
| `@Smoke` | 6 | **6/6 passed** |
| `@Regression` | 13 | **13/13 passed** |

---

## 2. Tools and Technologies

| Category | Technology |
|----------|------------|
| **Test automation** | Playwright (`@playwright/test` ^1.49) |
| **Framework pattern** | Prism conventions — layered POM (UI + API), fixtures, helpers |
| **Language** | JavaScript (ES modules) |
| **Test data** | Faker.js (`@faker-js/faker` ^9.0) |
| **Configuration** | `dotenv` — secrets via `.env` (gitignored) |
| **Browser** | Chromium (Desktop Chrome profile) |
| **Reporting** | Playwright HTML + JSON reporters |
| **AI assistant** | Cursor AI (planning, implementation, debugging, documentation) |
| **Version control** | Git / GitHub (public repo) |
| **SUT stack** | Angular SPA (UI) + Laravel REST API (backend) |

### Key npm commands

```bash
cd PrismStructure
npm test                  # Full suite (16 tests)
npm run test:smoke        # @Smoke tagged (6 tests)
npm run test:regression   # @Regression tagged (13 tests)
npm run test:ui           # UI only (8 tests)
npm run test:api          # API only (8 tests)
npm run report            # Open HTML report
```

---

## 3. Requirement Analysis and Risk Assessment

### Acceptance criteria (assessment)

**AC1 — User authentication and cart (UI + API)**

- Register with valid details; log in; verify profile (UI)
- Register via API; login; obtain bearer token; create cart (API)

**AC2 — Purchase and invoice (UI + API)**

- Browse products; add/update cart; checkout with Cash on Delivery; view invoice (UI)
- Retrieve products; manage cart; generate invoice with billing details (API)

### Critical application quirk

**Double-confirm checkout:** On the UI, invoice generation requires clicking **Confirm twice** on the COD payment step. The first click shows an intermediate *"Payment was successful"* message; the second completes the order and displays `INV-…`.

### Risk summary (23 risks identified)

| Focus area | Critical | High | Medium |
|------------|----------|------|--------|
| Authentication | 2 | 2 | 2 |
| Cart state | 1 | 2 | 2 |
| Checkout | 1 | 2 | 1 |
| Double confirmation | 2 | 1 | 0 |
| Invoice generation | 2 | 2 | 1 |

**Top critical risks mitigated by automation:**

| Risk ID | Description | Primary tests |
|---------|-------------|---------------|
| AUTH-R01/R02 | Registration and login | TC-UI-01/02, TC-API-01/02 |
| CART-R01/R04 | Add to cart / API cart creation | TC-UI-07, TC-API-07 |
| CHK-R01 | COD checkout | TC-UI-07, TC-API-07 |
| DCF-R01 | Double-confirm required | TC-UI-07, TC-UI-06 (negative) |
| INV-R02/R05 | Invoice creation and isolation | TC-UI-07, TC-API-06/07 |

Full risk analysis: `prompts/phase-1-prompt-3-risk-analysis.md`

---

## 4. Test Strategy and Approach

### Testing pyramid for this project

```
                    ┌─────────────┐
                    │  Manual (8) │  Exploratory + key flows in CSV
                    ├─────────────┤
                    │  UI Auto (8)│  Browser E2E + negative/edge UI
                    ├─────────────┤
                    │ API Auto (8)│  Lifecycle + negative API
                    └─────────────┘
```

### Classification

| Tag | Purpose | When to run |
|-----|---------|-------------|
| `@Smoke` | Critical path sanity — auth + purchase | Every build / PR |
| `@Regression` | Broader positive, negative, and edge coverage | Nightly / pre-release |
| `@positive` / `@negative` / `@edge` | Scenario type filtering | Targeted debugging |

### Design principles

1. **Test isolation** — unique users per run (Faker + timestamp); fresh carts; no shared mutable state
2. **API-first setup for UI** — register via API, login via UI where faster and stable
3. **Documented API contract** — OpenAPI spec as source of truth for API tests
4. **Meaningful negatives** — invalid login, missing token, bad IDs, invalid payloads, IDOR, empty cart, single-confirm edge
5. **No fixed waits** — Playwright auto-waiting, `expect.poll()`, `waitForURL()`, `waitForLoadState()`
6. **Traceability** — every automated test maps to `TC-UI-##` or `TC-API-##` and RTM requirements

### Manual vs automated scope

- **8 manual cases** (`FunctionalTestCase.csv`) — flows not fully automated (guest checkout, filters, PDF download, etc.)
- **8 UI + 8 API automated** — assessment cap; positives consolidated into E2E lifecycle tests where redundant

---

## 5. Test Coverage Details

### Manual tests (8)

| ID | Focus |
|----|-------|
| TC-MAN-01 | Register + login + profile |
| TC-MAN-02 | Invalid login |
| TC-MAN-03 | Product search |
| TC-MAN-04 | Cart quantity update |
| TC-MAN-05 | COD checkout |
| TC-MAN-06 | Full purchase + invoice |
| TC-MAN-07 | Invoice details verification |
| TC-MAN-08 | Duplicate email registration |

### UI automation (8) — `PrismStructure/tests/ui/`

| ID | Scenario | Tags |
|----|----------|------|
| TC-UI-01 | Register valid user | `@Smoke @positive` |
| TC-UI-02 | Valid login + authenticated UI | `@Smoke @positive` |
| TC-UI-03 | Invalid login error | `@Regression @negative` |
| TC-UI-04 | Out-of-stock cannot add to cart | `@Regression @negative @edge` |
| TC-UI-05 | Empty cart blocks checkout | `@Regression @negative` |
| TC-UI-06 | Single COD confirm — no invoice | `@Regression @negative @edge` |
| TC-UI-07 | Full E2E purchase + invoice | `@Smoke @Regression @positive` |
| TC-UI-08 | Duplicate email registration | `@Regression @negative` |

### API automation (8) — `PrismStructure/tests/api/`

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

### Traceability

- **RTM:** `RequirementTraceabilityMatrix.csv` (82 requirement–test mappings)
- **Gaps documented:** guest checkout, billing field validation (partial), filter/sort/pagination (manual)

---

## 6. Test Data Management Strategy

### Principles

| Principle | Implementation |
|-----------|----------------|
| No secrets in repo | Passwords in `.env`; `.env.example` has empty placeholders |
| Dynamic uniqueness | `testuser_{timestamp}_{suffix}@example.com` via Faker |
| Runtime discovery | Product IDs from `GET /products` (in-stock filter) |
| Static where mandated | Assessment billing address in `test-data/static-test-data.json` |
| Token hygiene | Captured at runtime; `redactToken()` for logging; never committed |

### Data sources

| Category | Approach | Factory / file |
|----------|----------|----------------|
| Users | Faker + env password | `createUser()` in `testDataFactory.js` |
| Billing (COD) | Static assessment example | `createBillingAddress(cartId)` |
| Search keyword | Static `"hammer"` | `static-test-data.json` |
| Product IDs | API discovery | `getInStockProducts()`, `discoverInStockProducts()` |
| Negative literals | Intentional invalid values | `WrongPassword@99`, `weakpass`, invalid ULID |

### Environment variables (`.env`)

```
TEST_USER_PASSWORD          # All dynamic user registration/login
TEST_CUSTOMER_EMAIL         # Pre-seeded customer (negative login UI)
TEST_CUSTOMER_PASSWORD      # From env only — never in source
BASE_URL / API_BASE_URL     # Optional overrides
```

Full strategy: `prompts/phase-3-prompt-9-test-data-strategy.md`

---

## 7. AI Usage Throughout the Lifecycle

**Primary tool:** Cursor AI (Agent mode with Playwright, shell, and MCP tools)

### How AI was used by phase

| Phase | Activity | AI contribution | Human validation |
|-------|----------|-----------------|------------------|
| **1 — Planning** | Requirements extraction, app analysis, risk analysis | Structured ACs, flow inventory, risk IDs, smoke/regression classification | Reviewed against assessment PDF; resolved ambiguities |
| **2 — Test design** | Manual CSV, RTM, coverage review | Test case drafts, traceability mapping, gap analysis | Edited CSV for self-containment and traceability IDs |
| **3 — Test data** | Data strategy, Faker factory | Category matrix, factory scaffolding | Validated against OpenAPI password/DOB rules |
| **4 — Framework** | Prism inspection, Playwright setup | POM structure, fixtures, npm scripts, initial specs | Ran scaffold; verified Prism conventions |
| **5 — UI automation** | Login, E2E purchase, negative UI | Page objects, `purchaseFlowHelper`, checkout double-confirm | Executed against live SUT; fixed registration form fields |
| **6 — API automation** | API analysis, lifecycle, negatives | OpenAPI review, `apiLifecycleHelper`, endpoint fixes | Verified documented paths; fixed 405 on cart add |
| **7 — Execution** | Smoke run, debug, final validation | Failure RCA, execution reports | Re-ran full suite; confirmed 16/16 pass |

### Responsible AI practices

- **Never shared:** real passwords, bearer tokens, `.env` contents, PATs
- **Safe to share:** public SUT URLs, OpenAPI schemas, error messages, locator strategies
- **Validation:** every AI-generated test run against live environment before commit
- **Prompt history:** captured in `prompts/phase-*-prompt-*.md` (20 prompts, Phases 1–7)

Policy document: `prompts/phase-1-prompt-4-responsible-ai-usage.md`

---

## 8. Prompt Evolution, Improvements, and Corrections

### Iterative corrections (key learnings)

| Issue discovered | Phase | Correction | Outcome |
|------------------|-------|------------|---------|
| Registration form requires full address + numeric phone (SUT v2.3) | 5 | Extended `AuthPage.register()` | TC-UI-01 passes |
| Search "no results" not reliable on live SUT | 5 | Re-scoped TC-UI-04 to out-of-stock edge | Stable negative test |
| Empty cart has no message text on checkout wizard | 5 | Assert zero items + blocked CTA | TC-UI-05 passes |
| Wrong cart API path (`405 Method Not Allowed`) | 6 | `POST /carts/{id}` per OpenAPI | TC-API-03+ fixed |
| IDOR test compared empty invoice lists | 6 | User A creates invoice before B checks | Meaningful TC-API-06 |
| `token_type` case (`bearer` vs `Bearer`) | 6 | Case-insensitive assertion | Lifecycle tests stable |
| Email collision in same millisecond | 6 | Faker alphanumeric suffix on email | No 409 on parallel register |
| TC-UI-07 double-confirm race | 5 | `confirmTwice()` with `expect.poll()`, `retries: 1` | E2E stable without fixed waits |
| API test count exceeded cap | 6 | Consolidated cart/invoice positives into TC-API-07 | 8 API tests within limit |
| UI redundant positives | 5 | Replaced browse/search/cart-only with negatives | 8 UI tests, better edge coverage |

### Prompt discipline

- One focused task per prompt (Phases 1–7, Prompts 1–20)
- Each prompt documented with: objective, implementation summary, execution result
- Git commits after each phase (iterative history, not single commit)

### AI validation (Phase 1, Prompt 5)

Reviewed AI outputs for: test count caps, password in repo, RTM accuracy, and assessment alignment. Corrections applied before automation phase.

---

## 9. Reusability and Maintainability Considerations

### Framework structure (`PrismStructure/`)

```
PrismStructure/
├── api/              # API Page Objects (Auth, Product, Cart, Invoice)
├── pages/            # UI Page Objects + LoginPage
├── fixtures/         # Playwright fixtures (inject POM + API clients)
├── utils/
│   ├── testDataFactory.js      # Dynamic user, billing, product discovery
│   ├── apiHelper.js            # Status assertions, pagination, token propagation
│   ├── apiLifecycleHelper.js   # Reusable API purchase flow steps
│   ├── apiNegativeHelper.js    # Error response assertions
│   └── purchaseFlowHelper.js   # Reusable UI purchase flow steps
├── tests/ui/         # 8 UI specs (TC-UI-01 – 08)
├── tests/api/        # 8 API specs (TC-API-01, 02, 06 – 11)
├── config/           # env.config.js — centralized URLs and secrets
└── reports/          # HTML + JSON (generated, not committed)
```

### Maintainability patterns

| Pattern | Benefit |
|---------|---------|
| **Dual POM** (UI + API) | Endpoint/locator changes isolated to one class |
| **Flow helpers** | `runApiPurchaseLifecycle()`, `registerAndLogin()` keep specs readable |
| **Fixtures** | Consistent dependency injection; no duplicate client setup |
| **Test IDs in titles** | `TC-UI-##` / `TC-API-##` — grep and RTM traceability |
| **Env-based config** | Switch environments without code changes |
| **OpenAPI-aligned API client** | Reduces drift from documented contract |
| **Tagged suites** | Smoke/regression without duplicate spec files |

### Extending the suite

1. Add page method or API client method first
2. Add helper function if used in 2+ tests
3. Create spec with traceable `TC-##` title and appropriate tags
4. Update RTM row and `prompts/` documentation
5. Run `npm test` + update execution report

### Known limitations (documented, not automated)

- Guest checkout, credit card payment, Google OAuth
- Product filter/sort/pagination UI
- Invoice PDF download
- Admin/reporting API endpoints
- TOTP setup/verify flows

---

## 10. Quick Reference

| Need | Location |
|------|----------|
| Run tests | `PrismStructure/README.md` |
| Manual cases | `FunctionalTestCase.csv` |
| RTM | `RequirementTraceabilityMatrix.csv` |
| Prompt history | `prompts/` |
| API contract | OpenAPI at api.practicesoftwaretesting.com |
| Final execution proof | `prompts/phase-7-prompt-20-final-test-execution.md` |
| Debug history | `prompts/phase-7-prompt-19-debug-test-failures.md` |

---

*Document created for Phase 8 — Prompt 21. Reflects final project state as of Phase 7 execution (16/16 tests passing).*
