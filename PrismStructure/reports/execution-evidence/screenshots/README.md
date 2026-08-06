# Execution Screenshot Evidence (Redacted Index)

**Purpose:** Document visual evidence captured during manual and automated test execution without committing sensitive session data to a public repository.

| File / capture | Test(s) | What it demonstrates | Committed image |
|----------------|---------|----------------------|-----------------|
| `manual-login-success.png` | TC-MAN-01, TC-MAN-02 | Login page error state vs successful auth nav | Local only — redacted |
| `manual-profile-verification.png` | TC-MAN-01 | Profile name, email, address after registration | Local only — redacted |
| `manual-https-padlock.png` | TC-MAN-03 | Valid HTTPS certificate on practicesoftwaretesting.com | Local only — redacted |
| `manual-catalog-loaded.png` | TC-MAN-04 | Product listing rendered (performance check) | Local only — redacted |
| `manual-cod-double-confirm.png` | TC-MAN-05, TC-MAN-06 | COD checkout success after double Confirm | Local only — redacted |
| `manual-single-confirm-no-invoice.png` | TC-MAN-07 | Incomplete checkout after one Confirm | Local only — redacted |
| `manual-duplicate-email-error.png` | TC-MAN-08 | Duplicate registration error message | Local only — redacted |
| `auto-html-report-index.png` | TC-UI/API-01–11 | Playwright HTML report — 16/16 passed | Regenerate via `npm run report` |

## Policy

- **Committed to repo:** This index + text logs in `execution-evidence/`
- **Not committed:** Raw PNG/WebM from `test-results/` and `reports/html/` (gitignored; may contain URLs, emails, or tokens)
- **Regenerate locally:** `cd PrismStructure && npm test && npm run report`

All listed manual tests executed **2026-08-06** with status **Passed** — see `../manual-test-execution.md` and `FunctionalTestCase.csv`.
