# Phase 2 — Prompt 6b: Add Non-Functional Manual Test Cases

**Prompt:** Add non-functional manual test coverage (security, performance) to close the assessment gap for manual test design (functional, edge, negative, **non-functional**). Stay within the 8-case manual cap.

---

## Changes

| File | Change |
|------|--------|
| `FunctionalTestCase.csv` | Replaced TC-MAN-03 (search) and TC-MAN-04 (cart qty) with NFR cases |
| `RequirementTraceabilityMatrix.csv` | Added NFR-SEC-01/02, NFR-PERF-01; remapped BRW-03 to TC-UI-07 |
| `project-info.md` | Added manual test design table documenting functional + NFR mix |

## New manual tests

| ID | Type | Scenario |
|----|------|----------|
| **TC-MAN-03** | Non-functional (security) | HTTPS enforcement; protected account/checkout routes require authentication |
| **TC-MAN-04** | Non-functional (performance) | Product catalog loads within ≤ 5 s average |

## Rationale

- Product **search** and **multi-item cart** are fully covered by automated **TC-UI-07**
- Assessment requires NFR in manual design; cap of 8 cases preserved by swapping redundant functional cases
- Security NFR aligns with AUTH risks; performance NFR aligns with browse/catalog AC2 scope

## Validation

- Manual count remains **8**
- Mix: 4 functional, 2 non-functional, 1 edge, negative cases in TC-MAN-02/08
- RTM traceability updated for NFR requirement IDs
