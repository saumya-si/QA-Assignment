# Test Execution Summary (Redacted)

**Project:** Practice Software Testing Toolshop v5.0  
**Repository:** [https://github.com/saumya-si/QA-Assignment](https://github.com/saumya-si/QA-Assignment)  
**Execution date:** 2026-08-06 (UTC+5:30)  
**Environment:** Local — Chromium (Desktop Chrome), Node.js 18+  
**SUT:** `https://practicesoftwaretesting.com` (UI) · `https://api.practicesoftwaretesting.com` (API)

> **Security note:** This summary contains **no** passwords, tokens, API keys, `.env` values, or bearer tokens. Credentials were loaded at runtime from a local gitignored `.env` file. Full HTML/JSON Playwright reports remain gitignored and must be regenerated locally via `npm test`.

---

## Manual Test Results (`FunctionalTestCase.csv`)

**Execution date:** 2026-08-06 · **Status: 8/8 Passed**

| Test ID | Result |
|---------|--------|
| TC-MAN-01 – TC-MAN-08 | **Passed** |

Detailed results: `execution-evidence/manual-test-execution.md`

---

## Suite Results (Automation)

| Suite | Command | Tests | Passed | Failed | Flaky | Duration | Exit code |
|-------|---------|-------|--------|--------|-------|----------|-----------|
| **Full** | `npm test` | 16 | **16** | 0 | 0 | ~2.4 min | 0 |
| **Smoke** | `npm run test:smoke` | 6 | 6 | 0 | 0 | ~1.0 min | 0 |
| **Regression** | `npm run test:regression` | 13 | 13 | 0 | 0 | ~2.0 min | 0 |

**Note:** `TC-UI-07` has `retries: 1` in `checkout.spec.js` for occasional SUT timing sensitivity. Latest validation run completed **16/16 on first attempt** with no flaky results.

---

## Per-Test Results (Full Suite)

| Test ID | Layer | Tags | Result |
|---------|-------|------|--------|
| TC-API-01 | API | Smoke, Regression | Pass |
| TC-API-02 | API | Smoke | Pass |
| TC-API-06 | API | Regression | Pass |
| TC-API-07 | API | Smoke, Regression | Pass |
| TC-API-08 | API | Regression | Pass |
| TC-API-09 | API | Regression | Pass |
| TC-API-10 | API | Regression | Pass |
| TC-API-11 | API | Regression | Pass |
| TC-UI-01 | UI | Smoke | Pass |
| TC-UI-02 | UI | Smoke | Pass |
| TC-UI-03 | UI | Regression | Pass |
| TC-UI-04 | UI | Regression | Pass |
| TC-UI-05 | UI | Regression | Pass |
| TC-UI-06 | UI | Regression | Pass |
| TC-UI-07 | UI | Smoke, Regression | Pass |
| TC-UI-08 | UI | Regression | Pass |

---

## Smoke Suite Detail (`@Smoke`)

| Test ID | Result |
|---------|--------|
| TC-API-01 | Pass |
| TC-API-02 | Pass |
| TC-API-07 | Pass |
| TC-UI-01 | Pass |
| TC-UI-02 | Pass |
| TC-UI-07 | Pass |

---

## Regression Suite Detail (`@Regression`)

All **13** regression-tagged tests passed (8 API + 5 UI dual-tagged + UI-only regression tests).

---

## Artifact Policy

| Artifact | Committed to repo | Notes |
|----------|-------------------|-------|
| This summary | **Yes** | Redacted, review-safe |
| `execution-evidence/` | **Yes** | Console log, manual results, API collection index |
| `execution-evidence/screenshots/` | **Yes** | Redacted PNGs — regenerate with `npm run capture:screenshots` |
| `execution-evidence/api-test-collection.md` | **Yes** | Playwright API tests as executable collection |
| `reports/html/` | **No** (gitignored) | Regenerate with `npm test` + `npm run report` |
| `reports/json/results.json` | **No** (gitignored) | May contain request metadata — not committed |
| `test-results/` | **No** (gitignored) | Raw failure screenshots/videos/traces |
| `.env` | **No** (gitignored) | Required for local execution |

---

## How to Reproduce

```bash
cd PrismStructure
cp ../.env.example ../.env   # set TEST_USER_PASSWORD and TEST_CUSTOMER_PASSWORD
npm install
npx playwright install chromium
npm test
npm run test:smoke
npm run test:regression
npm run capture:screenshots   # optional — refresh committed PNG evidence
```

---

*Last refreshed: 2026-08-06 — 16/16 automation + 8/8 manual passed (no flaky results in latest run).*
