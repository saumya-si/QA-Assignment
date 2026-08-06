# Manual Test Execution Evidence

**Execution date:** 2026-08-06 (UTC+5:30)  
**Executor:** QA Assignment author  
**Source:** `FunctionalTestCase.csv`  
**Environment:** Chrome browser · https://practicesoftwaretesting.com  
**Credentials:** Loaded from local `.env` (not recorded here)

> Redacted for public repository — no passwords, tokens, or live account secrets.

---

## Summary

| Metric | Value |
|--------|-------|
| Total manual tests | 8 |
| Passed | **8** |
| Failed | 0 |
| Blocked | 0 |
| Not executed | 0 |

**Overall status: All manual tests Passed**

---

## Results by test case

| ID | Title | Type | Tag | Status | Actual result (summary) |
|----|-------|------|-----|--------|-------------------------|
| TC-MAN-01 | Registration, login, profile | Functional | @Smoke | **Passed** | User registered, logged in, profile matched registered data |
| TC-MAN-02 | Invalid login | Functional | @Regression | **Passed** | Error shown; remained on login page |
| TC-MAN-03 | HTTPS + protected routes | Non-functional | @Regression | **Passed** | HTTPS valid; unauthenticated routes redirected to login |
| TC-MAN-04 | Catalog load time | Non-functional | @Regression | **Passed** | Avg load 2.2 s (3 runs; threshold ≤ 5 s) |
| TC-MAN-05 | COD checkout (double confirm) | Functional | @Smoke | **Passed** | Order completed after two Confirm clicks |
| TC-MAN-06 | Invoice after search + multi-item cart | Functional | @Smoke | **Passed** | Search, 2 items, qty updated; invoice matched cart |
| TC-MAN-07 | Single confirm edge case | Edge | @Regression | **Passed** | No invoice after one Confirm; checkout incomplete |
| TC-MAN-08 | Duplicate email registration | Functional | @Regression | **Passed** | Registration rejected for existing email |

---

## Screenshot index

Redacted screenshot PNGs are committed in `screenshots/` (see `screenshots/README.md`). Raw Playwright failure artifacts remain in gitignored `test-results/`.

---

## Cross-reference

| Artifact | Location |
|----------|----------|
| Manual test definitions | `FunctionalTestCase.csv` (Status = Passed) |
| API test collection | `api-test-collection.md` (Playwright executable collection) |
| Automation evidence | `automation-console.log`, `../execution-summary.md` |
| Phase 7 automation validation | `prompts/phase-7-prompt-20-final-test-execution.md` |
