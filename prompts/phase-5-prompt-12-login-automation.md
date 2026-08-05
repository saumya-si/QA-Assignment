# Phase 5 — Prompt 12: Login Test Automation

**Prompt:** Implement automated Playwright test cases for valid and invalid user login with dynamic test data, stable locators, meaningful assertions, and Playwright auto-waiting (no fixed waits). Tag valid login `@Smoke`, invalid login `@Regression`.

---

## Implementation Summary

| Test ID | Scenario | Tags | Spec |
|---------|----------|------|------|
| TC-UI-02 | Valid user login | `@Smoke @positive` | `PrismStructure/tests/ui/login.spec.js` |
| TC-UI-03 | Invalid user login | `@Regression @negative` | `PrismStructure/tests/ui/login.spec.js` |

Login tests were extracted from `auth.spec.js` into a dedicated `login.spec.js` to keep registration and login concerns separate.

---

## Files Added / Modified

| File | Change |
|------|--------|
| `PrismStructure/pages/loginPage.js` | **New** — dedicated login POM with role/label locators |
| `PrismStructure/pages/basePage.js` | **New** — shared `BasePage` extracted from `pages/index.js` |
| `PrismStructure/tests/ui/login.spec.js` | **New** — TC-UI-02 and TC-UI-03 login scenarios |
| `PrismStructure/fixtures/testFixtures.js` | Added `loginPage` fixture |
| `PrismStructure/utils/testDataFactory.js` | Added `generateInvalidPassword()`, `getCustomerEmail()` |
| `PrismStructure/tests/ui/auth.spec.js` | Removed duplicate login tests (now in `login.spec.js`) |

---

## Design Decisions

### Dynamic test data
- **Valid login:** User registered via API (`authApi.register(testUser)`) with Faker-generated profile and env-based password (`TEST_USER_PASSWORD`).
- **Invalid login:** Known customer email from env (`TEST_CUSTOMER_EMAIL`) + dynamically generated invalid password (`generateInvalidPassword()`).

### Stable locators (LoginPage)
- `getByRole('textbox', { name: /email address/i })`
- `getByRole('textbox', { name: /^password/i })`
- `getByRole('button', { name: /^login$/i })`
- `getByRole('heading', { name: /login/i })`
- Error: `[data-test="login-error"], .alert-danger, .invalid-feedback`

### Assertions
- **Valid:** API register succeeds → URL leaves `/auth/login` → `Sign in` nav link hidden.
- **Invalid:** Stays on `/auth/login` → login heading visible → error alert visible.

### Synchronization
- `waitForURL()` for post-login navigation
- `locator.waitFor({ state: 'visible' })` for form readiness
- No `waitForTimeout()` in login flow

---

## Run Commands

```bash
cd PrismStructure
cp ../.env.example ../.env   # set TEST_USER_PASSWORD

npm run test:ui:smoke        # TC-UI-02
npm run test:ui:regression   # TC-UI-03
npx playwright test tests/ui/login.spec.js
```

---

## Execution Result

Both login tests **passed** against https://practicesoftwaretesting.com (Chromium, headed=false).
