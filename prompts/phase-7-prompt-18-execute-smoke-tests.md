# Phase 7 — Prompt 18: Execute Smoke Tests

**Prompt:** Run all tests tagged with `@Smoke`. For failures: classify issue type, provide evidence, suggest minimal fix. Do not remove assertions, add fixed waits, or make unrelated changes.

---

## Execution Command

```bash
cd PrismStructure
npm run test:smoke
# equivalent: playwright test --grep @Smoke
```

**Environment:** Chromium (Desktop Chrome), 1 worker, `retries: 0` (local), timeout 60s/test  
**SUT:** https://practicesoftwaretesting.com  
**API:** https://api.practicesoftwaretesting.com  
**Date:** 2026-08-06

---

## Smoke Test Inventory (6 tests)

| Test ID | Title | Layer | Spec |
|---------|-------|-------|------|
| TC-API-01 | Register valid user and reject duplicate email | API | `tests/api/auth.api.spec.js` |
| TC-API-02 | Valid login returns bearer token | API | `tests/api/auth.api.spec.js` |
| TC-API-07 | Complete API purchase lifecycle | API | `tests/api/lifecycle.api.spec.js` |
| TC-UI-01 | Register new user with valid data | UI | `tests/ui/auth.spec.js` |
| TC-UI-02 | Valid user login redirects and shows authenticated UI | UI | `tests/ui/login.spec.js` |
| TC-UI-07 | Complete purchase journey with COD and invoice verification | UI | `tests/ui/checkout.spec.js` |

---

## Execution Result

| Metric | Value |
|--------|-------|
| **Total** | 6 |
| **Passed** | 6 |
| **Failed** | 0 |
| **Flaky** | 0 |
| **Duration** | ~55s |

```
✓ TC-API-01  (2.8s)
✓ TC-API-02  (1.8s)
✓ TC-API-07  (8.2s)
✓ TC-UI-01   (3.9s)
✓ TC-UI-07   (31.8s)
✓ TC-UI-02   (4.9s)

6 passed (54.9s)
```

**Exit code:** `0`

---

## Failure Analysis

**No failures observed.** No code changes required for Prompt 18.

---

## Evidence Artifacts

| Artifact | Location |
|----------|----------|
| HTML report | `PrismStructure/reports/html/index.html` |
| JSON results | `PrismStructure/reports/json/results.json` |
| Screenshots / video | Not generated (only-on-failure; all tests passed) |

---

## Observations (informational, no action required)

| Test | Note |
|------|------|
| TC-UI-07 | Longest smoke test (~32s) — expected for full E2E with double-confirm checkout and invoice polling |
| TC-API-07 | Covers cart + invoice positive path previously split across TC-API-03/05 |
| `checkout.spec.js` | Has `retries: 1` at describe level for flaky double-confirm timing; passed on first attempt in this run |

---

## Re-run Commands

```bash
npm run test:smoke          # all @Smoke (UI + API)
npm run test:ui:smoke       # UI smoke only (3 tests)
npm run test:api:smoke      # API smoke only (3 tests)
npm run report              # open HTML report
```

---

## AI Response Summary

Executed full `@Smoke` suite (6 tests: 3 API + 3 UI). All passed in 54.9s with exit code 0. No failures to classify; no fixes applied per prompt constraints.
