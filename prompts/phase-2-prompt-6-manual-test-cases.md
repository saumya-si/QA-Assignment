# Phase 2 — Prompt 6: Manual Test Cases (CSV)

**Prompt:** Create 8 manual test cases covering registration/login, invalid login, product search, cart (multi-item + qty), COD checkout, invoice verification, and one edge/negative scenario. CSV format with specified columns. Use Smoke/Regression tags. Leave ActualResult and Status blank.

**Output file:** `FunctionalTestCase.csv`

---

## Test Case Summary

| TestCaseID | Title | Tag | Priority | Type |
|------------|-------|-----|----------|------|
| TC-MAN-01 | User registration and login with profile verification | @Smoke | Critical | Positive |
| TC-MAN-02 | Invalid login attempt shows error message | @Regression | High | Negative |
| TC-MAN-03 | Product search returns matching results | @Regression | Medium | Positive |
| TC-MAN-04 | Add multiple items to cart and update quantity | @Regression | High | Positive |
| TC-MAN-05 | Checkout completes using Cash on Delivery | @Smoke | Critical | Positive |
| TC-MAN-06 | Invoice verification under My Invoices | @Smoke | Critical | Positive |
| TC-MAN-07 | Single Confirm click does not generate invoice | @Regression | High | Edge |
| TC-MAN-08 | Registration with duplicate email is rejected | @Regression | Medium | Negative |

## Coverage Mapping

| Scenario (requested) | Test Case |
|---------------------|-----------|
| User registration and login | TC-MAN-01 |
| Invalid login attempt | TC-MAN-02 |
| Product search | TC-MAN-03 |
| Cart — multi-item + qty update | TC-MAN-04 |
| Checkout COD | TC-MAN-05 |
| Invoice verification | TC-MAN-06 |
| Edge / negative scenario | TC-MAN-07 (edge), TC-MAN-08 (negative) |

## Tag Distribution

| Tag | Count |
|-----|-------|
| @Smoke | 3 |
| @Regression | 5 |

## Traceability

| TestCaseID | Requirement IDs |
|------------|-------------------|
| TC-MAN-01 | AUTH-R01, AUTH-R02, AUTH-R03 |
| TC-MAN-02 | AUTH-R05 |
| TC-MAN-03 | BRW-03 |
| TC-MAN-04 | CART-R02, CART-R03 |
| TC-MAN-05 | CHK-R01 |
| TC-MAN-06 | INV-R01, INV-R04, DCF-R01 |
| TC-MAN-07 | DCF-R02 |
| TC-MAN-08 | AUTH-R06 |

---

## AI Response Summary

Created 8 manual test cases in `FunctionalTestCase.csv` with all required columns. Covers all requested scenarios with Smoke/Regression tags, positive/negative/edge coverage, and traceability to Phase 1 risk IDs. ActualResult and Status left blank for execution.
