# Execution Screenshot Evidence

**Purpose:** Visual evidence captured during manual and automated test execution. Passwords and tokens are not shown; dynamic test emails use `@example.com`.

| File / capture | Test(s) | What it demonstrates |
|----------------|---------|----------------------|
| `manual-https-padlock.png` | TC-MAN-03 | Valid HTTPS on practicesoftwaretesting.com |
| `manual-invalid-login.png` | TC-MAN-02 | Invalid login error state |
| `manual-login-success.png` | TC-MAN-01 | Successful login navigation |
| `manual-profile-verification.png` | TC-MAN-01, TC-UI-02 | Profile name, email, address after registration |
| `manual-catalog-loaded.png` | TC-MAN-04 | Product listing rendered (performance check) |
| `manual-cod-double-confirm.png` | TC-MAN-05, TC-MAN-06 | COD checkout success after double Confirm |
| `manual-single-confirm-no-invoice.png` | TC-MAN-07 | Incomplete checkout after one Confirm |
| `manual-duplicate-email-error.png` | TC-MAN-08 | Duplicate registration error message |
| `auto-html-report-index.png` | TC-UI/API-01–11 | Playwright HTML report — 16/16 passed |

## Regenerate

```bash
cd PrismStructure
npm test                        # optional — refreshes HTML report for auto-html-report-index.png
npm run capture:screenshots
```

## Policy

- **Committed to repo:** Redacted PNGs in this folder + index + text logs in `execution-evidence/`
- **API collection:** `../api-test-collection.md` — Playwright API tests as executable collection (assessment alternative to Postman)
- **Not committed:** Raw failure artifacts in `test-results/` and generated `reports/html/` (gitignored; may contain session URLs or tokens)

All listed manual tests executed **2026-08-06** with status **Passed** — see `../manual-test-execution.md` and `FunctionalTestCase.csv`.
