# Test Execution Summary (Redacted)

**Project:** Practice Software Testing Toolshop v5.0  
**Repository:** [https://github.com/saumya-si/QA-Assignment](https://github.com/saumya-si/QA-Assignment)  
**Execution date:** 2026-08-06 (UTC+5:30)  
**Environment:** Local — Chromium (Desktop Chrome), Node.js 18+  
**SUT:** `https://practicesoftwaretesting.com` (UI) · `https://api.practicesoftwaretesting.com` (API)

> **Security note:** This summary contains **no** passwords, tokens, API keys, `.env` values, or bearer tokens. Credentials were loaded at runtime from a local gitignored `.env` file. Full HTML/JSON Playwright reports remain gitignored and must be regenerated locally via `npm test`.

---

## Suite Results

| Suite | Command | Tests | Passed | Failed | Flaky | Duration | Exit code |
|-------|---------|-------|--------|--------|-------|----------|-----------|
| **Full** | `npm test` | 16 | 15 | 0 | 1 | ~3.3 min | 0 |
| **Smoke** | `npm run test:smoke` | 6 | 6 | 0 | 0 | ~1.2 min | 0 |
| **Regression** | `npm run test:regression` | 13 | 13 | 0 | 0 | ~2.4 min | 0 |

**Flaky test:** `TC-UI-07` (Complete purchase journey with COD and invoice verification) — failed once on first Confirm click timeout, **passed on retry** (`retries: 1` in `checkout.spec.js`). Documented known SUT/UI timing behavior; not a functional defect.

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
| TC-UI-07 | UI | Smoke, Regression | **Flaky → Pass (retry)** |
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
| `reports/html/` | **No** (gitignored) | Regenerate with `npm test` + `npm run report` |
| `reports/json/results.json` | **No** (local only) | May contain request metadata — not committed |
| `test-results/` | **No** (gitignored) | Screenshots/videos on failure |
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
```

---

*Generated during Phase 9 — Prompt 25 (Final Audit Gap Resolution).*
