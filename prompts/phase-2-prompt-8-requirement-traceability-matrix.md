# Phase 2 — Prompt 8: Requirement Traceability Matrix (RTM)

**Prompt:** Create RTM mapping each requirement to test case(s) with columns: Requirement ID, Test Case ID, Coverage Type, Coverage Layer. Identify coverage gaps and recommendations.

**Output file:** `RequirementTraceabilityMatrix.csv`

---

## 1. RTM Summary

| Metric | Count |
|--------|-------|
| Requirements mapped | 28 |
| Unique test cases | 22 (8 Manual + 8 UI + 6 API) |
| RTM rows (requirement–test pairs) | 82 |
| Requirements with full coverage | 24 |
| **Coverage gaps** | **4** |

### Coverage by layer

| Layer | Test cases | Requirements covered |
|-------|------------|---------------------|
| Manual (UI) | TC-MAN-01 – 08 | AC1-UI, AC2-UI, AUTH, CART, CHK, DCF, INV (partial), BRW-03 |
| UI automation | TC-UI-01 – 08 | AC1-UI, AC2-UI, all critical risks |
| API automation | TC-API-01 – 06 | AC1-API, AC2-API, AUTH, CART, CHK, INV |

---

## 2. Requirement Traceability Matrix

### 2.1 Assessment Acceptance Criteria

| Requirement ID | Description | Test Case ID | Coverage Type | Coverage Layer |
|----------------|-------------|--------------|---------------|----------------|
| **AC1-UI** | Registration, login, profile | TC-MAN-01, TC-MAN-02, TC-MAN-08, TC-UI-01, TC-UI-02, TC-UI-03, TC-UI-08 | Positive, Negative | UI |
| **AC1-UI** | Registration, login, profile | TC-API-01, TC-API-02 | Positive, Negative | API |
| **AC2-UI** | Browse, cart, COD checkout, invoice | TC-MAN-03 – 07, TC-UI-04 – 07 | Positive, Edge | UI |
| **AC2-UI** | Browse, cart, COD checkout, invoice | TC-API-03 – 06 | Positive, Negative | API |
| **AC1-API** | Register, login, token, create cart | TC-API-01, TC-API-02, TC-API-03 | Positive | API |
| **AC2-API** | Products, cart, verify, generate invoice | TC-API-03, TC-API-04, TC-API-05 | Positive | API |

### 2.2 Authentication Requirements

| Requirement ID | Description | Test Case ID | Coverage Type | Coverage Layer |
|----------------|-------------|--------------|---------------|----------------|
| AUTH-R01 | Valid registration | TC-MAN-01, TC-UI-01, TC-API-01 | Positive | Both |
| AUTH-R02 | Valid login | TC-MAN-01, TC-UI-02, TC-API-02 | Positive | Both |
| AUTH-R03 | Profile data correct | TC-MAN-01, TC-UI-02 | Positive | UI |
| AUTH-R04 | API bearer token on login | TC-API-02 | Positive | API |
| AUTH-R05 | Invalid login rejected | TC-MAN-02, TC-UI-03, TC-API-02 | Negative | Both |
| AUTH-R06 | Duplicate email blocked | TC-MAN-08, TC-UI-08, TC-API-01 | Negative | Both |

### 2.3 Cart State Requirements

| Requirement ID | Description | Test Case ID | Coverage Type | Coverage Layer |
|----------------|-------------|--------------|---------------|----------------|
| CART-R01 | Add product to cart | TC-MAN-04, TC-MAN-06, TC-UI-05, TC-UI-07, TC-API-03 | Positive | Both |
| CART-R02 | Multiple items in cart | TC-MAN-04, TC-UI-07 | Positive | UI |
| CART-R03 | Qty update + total recalc | TC-MAN-04, TC-MAN-06, TC-UI-05, TC-UI-07, TC-API-04 | Positive | Both |
| CART-R04 | API cart creation | TC-API-03 | Positive | API |
| CART-R05 | Cart session persistence | TC-UI-07 | Positive | UI |

### 2.4 Checkout Requirements

| Requirement ID | Description | Test Case ID | Coverage Type | Coverage Layer |
|----------------|-------------|--------------|---------------|----------------|
| CHK-R01 | COD checkout completes | TC-MAN-05, TC-MAN-06, TC-UI-07, TC-API-05 | Positive | Both |
| CHK-R02 | Billing fields validated | — | — | **GAP** |
| CHK-R03 | Auth required for checkout | TC-MAN-06, TC-UI-07, TC-API-06 | Positive, Negative | Both |
| CHK-R04 | Empty cart checkout blocked | — | — | **GAP** |

### 2.5 Double Confirmation Requirements

| Requirement ID | Description | Test Case ID | Coverage Type | Coverage Layer |
|----------------|-------------|--------------|---------------|----------------|
| DCF-R01 | Double Confirm generates invoice | TC-MAN-05, TC-MAN-06, TC-UI-07 | Positive | UI |
| DCF-R02 | Single Confirm fails | TC-MAN-07 | Edge | UI |
| DCF-R03 | No duplicate invoices | TC-UI-07 | Positive | UI |

### 2.6 Invoice Generation Requirements

| Requirement ID | Description | Test Case ID | Coverage Type | Coverage Layer |
|----------------|-------------|--------------|---------------|----------------|
| INV-R01 | Invoice in My Invoices | TC-MAN-06, TC-UI-07 | Positive | UI |
| INV-R02 | API invoice creation (201) | TC-API-05 | Positive | API |
| INV-R03 | Totals match cart | TC-MAN-06, TC-UI-07, TC-API-05 | Positive | Both |
| INV-R04 | Invoice ID displayed | TC-MAN-06, TC-UI-07 | Positive | UI |
| INV-R05 | User isolation (no IDOR) | TC-API-06 | Negative | API |

### 2.7 Browse / Search Requirements

| Requirement ID | Description | Test Case ID | Coverage Type | Coverage Layer |
|----------------|-------------|--------------|---------------|----------------|
| BRW-03 | Product search returns results | TC-MAN-03, TC-UI-06 | Positive | UI |
| BRW-01 | Product listing loads | TC-UI-04 | Positive | UI |

---

## 3. Test Case Index (Reverse Traceability)

| Test Case ID | Layer | Type | Requirements covered |
|--------------|-------|------|---------------------|
| TC-MAN-01 | UI | Positive | AC1-UI, AUTH-R01, R02, R03 |
| TC-MAN-02 | UI | Negative | AC1-UI, AUTH-R05 |
| TC-MAN-03 | UI | Positive | AC2-UI, BRW-03 |
| TC-MAN-04 | UI | Positive | AC2-UI, CART-R01, R02, R03 |
| TC-MAN-05 | UI | Positive | AC2-UI, CHK-R01, DCF-R01 |
| TC-MAN-06 | UI | Positive | AC2-UI, CART-R01, R03, CHK-R01, R03, INV-R01, R03, R04 |
| TC-MAN-07 | UI | Edge | AC2-UI, DCF-R02 |
| TC-MAN-08 | UI | Negative | AC1-UI, AUTH-R06 |
| TC-UI-01 | UI | Positive | AC1-UI, AUTH-R01 |
| TC-UI-02 | UI | Positive | AC1-UI, AUTH-R02, R03 |
| TC-UI-03 | UI | Negative | AC1-UI, AUTH-R05 |
| TC-UI-04 | UI | Positive | AC2-UI, BRW-01 |
| TC-UI-05 | UI | Positive | AC2-UI, CART-R01, R03 |
| TC-UI-06 | UI | Positive | AC2-UI, BRW-03 |
| TC-UI-07 | UI | Positive | AC2-UI, CART-R01–R03, R05, CHK-R01, R03, DCF-R01, R03, INV-R01, R03, R04 |
| TC-UI-08 | UI | Negative | AC1-UI, AUTH-R06 |
| TC-API-01 | API | Positive, Negative | AC1-UI, AC1-API, AUTH-R01, R06 |
| TC-API-02 | API | Positive, Negative | AC1-UI, AC1-API, AUTH-R02, R04, R05 |
| TC-API-03 | API | Positive | AC2-UI, AC1-API, AC2-API, CART-R01, R04 |
| TC-API-04 | API | Positive | AC2-UI, AC2-API, CART-R03 |
| TC-API-05 | API | Positive | AC2-UI, AC2-API, CHK-R01, INV-R02, R03 |
| TC-API-06 | API | Negative | AC2-UI, CHK-R03, INV-R05 |

---

## 4. Coverage Gaps

### 🔴 GAP-01 — CHK-R02: Billing address validation

| Attribute | Detail |
|-----------|--------|
| **Requirement** | Billing fields validated (street, city, state, country, postal code) |
| **Priority** | High |
| **Current coverage** | None |
| **Risk** | Invalid orders with missing/invalid billing data may succeed |

**Recommendation:** Add negative assertion to **TC-API-05** (omit `billing_city` → expect 422) OR add manual row **TC-MAN-09** if CSV cap allows swap with lower-priority case. At 8-test cap, prefer API negative variant in TC-API-05.

---

### 🔴 GAP-02 — CHK-R04: Empty cart checkout blocked

| Attribute | Detail |
|-----------|--------|
| **Requirement** | Checkout blocked when cart is empty |
| **Priority** | Medium |
| **Current coverage** | None |
| **Risk** | Phantom orders or backend errors on zero-item checkout |

**Recommendation:** Document as **accepted risk** in `project-info.md` OR swap TC-MAN-03 (search — already covered by TC-UI-06) for empty-cart manual test. Search has stronger automation coverage.

---

### 🟡 GAP-03 — DCF-R03: Duplicate invoice on triple-click

| Attribute | Detail |
|-----------|--------|
| **Requirement** | Second Confirm is idempotent; no duplicate invoices |
| **Priority** | Critical (risk) / Medium (test priority) |
| **Current coverage** | TC-UI-07 (partial — only verifies single invoice created) |
| **Risk** | Double billing if UI allows triple Confirm |

**Recommendation:** Add assertion in **TC-UI-07**: after double Confirm, verify exactly **one** invoice in My Invoices for the session. Add manual spot-check **TC-MAN-07b** or note in TC-UI-07 test steps. No new test case required if assertion strengthened.

---

### 🟡 GAP-04 — CART-R05: Cart session persistence

| Attribute | Detail |
|-----------|--------|
| **Requirement** | Cart persists across navigation until checkout |
| **Priority** | Medium |
| **Current coverage** | TC-UI-07 only (implicit during E2E) |
| **Risk** | Cart loss on page refresh not explicitly validated |

**Recommendation:** Accept as **implicit coverage** within TC-UI-07 E2E flow (navigate catalog → cart → checkout). Document in `project-info.md`. No dedicated test needed at current scope.

---

### 🟢 Deferred / Out of Scope (Not gaps)

| Item | Rationale |
|------|-----------|
| AUTH-R04 UI layer | API-only requirement (bearer token) — correctly API-only |
| DCF-R01 API layer | UI-only behaviour (double Confirm) — correctly UI-only |
| BRW-04 Search no results | Deferred at 8-test cap; TC-UI-06 covers positive search |
| REG-03 Weak password | Covered implicitly by TC-UI-01 / TC-MAN-01 valid password path |
| Google OAuth | Out of scope per Phase 1 |
| Admin / PIM flows | Out of scope |

---

## 5. Coverage Heatmap

| Requirement | Manual | UI Auto | API Auto | Status |
|-------------|--------|---------|----------|--------|
| AC1-UI | ✅ | ✅ | ✅ | Covered |
| AC2-UI | ✅ | ✅ | ✅ | Covered |
| AC1-API | — | — | ✅ | Covered |
| AC2-API | — | — | ✅ | Covered |
| AUTH-R01–R06 | ✅ | ✅ | ✅ | Covered |
| CART-R01–R04 | ✅ | ✅ | ✅ | Covered |
| CART-R05 | — | ⚠️ Implicit | — | Accept |
| CHK-R01 | ✅ | ✅ | ✅ | Covered |
| **CHK-R02** | ❌ | ❌ | ❌ | **GAP** |
| CHK-R03 | ✅ | ✅ | ✅ | Covered |
| **CHK-R04** | ❌ | ❌ | ❌ | **GAP** |
| DCF-R01 | ✅ | ✅ | N/A | Covered |
| DCF-R02 | ✅ | — | N/A | Covered |
| DCF-R03 | — | ⚠️ Partial | — | Strengthen |
| INV-R01–R05 | ✅ | ✅ | ✅ | Covered |
| BRW-03 | ✅ | ✅ | — | Covered |

---

## 6. Recommendations Summary

| Priority | Action | Effort |
|----------|--------|--------|
| **High** | Add CHK-R02 negative to TC-API-05 (missing billing field → 422) | Small — API test enhancement |
| **Medium** | Document CHK-R04 as accepted risk OR swap TC-MAN-03 for empty-cart test | Doc or 1 CSV row swap |
| **Medium** | Strengthen TC-UI-07 assertion for DCF-R03 (exactly one invoice) | Small — assertion add |
| **Low** | Document CART-R05 implicit coverage in project-info.md | Documentation only |
| **Low** | Add BRW-01 explicit row in RTM (covered by TC-UI-04 only) | Already in CSV |

---

## AI Response Summary

Created RTM with 82 requirement–test mappings across 28 requirements and 22 test cases (8 Manual + 8 UI + 6 API). AC1 and AC2 covered across all three layers. Identified 2 uncovered requirements (CHK-R02, CHK-R04), 2 partial gaps (DCF-R03, CART-R05) with targeted recommendations. No structural rework required.
