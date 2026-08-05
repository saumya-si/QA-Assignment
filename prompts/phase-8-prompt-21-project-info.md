# Phase 8 — Prompt 21: Create project-info.md

**Prompt:** Create `project-info.md` documenting the full QA workflow: overview, tools, risks, strategy, coverage, test data, AI usage, prompt evolution, and maintainability guidance.

---

## Deliverable

| File | Purpose |
|------|---------|
| `project-info.md` | Assessment Part A — comprehensive project documentation (repo root) |

---

## Document sections

1. **Project overview and summary** — AC1/AC2 objectives, deliverables table, final execution status (16/16)
2. **Tools and technologies** — Playwright, Prism POM, Faker, dotenv, Cursor AI
3. **Risk summary** — Critical risks from Phase 1 (auth, cart, checkout, double-confirm, invoice, IDOR)
4. **Test strategy** — Manual + UI + API tiers, 5–8 test cap, Smoke/Regression tagging
5. **Coverage overview** — Requirement areas mapped to test IDs
6. **Test data approach** — Dynamic Faker users, env passwords, static billing JSON
7. **AI usage and validation** — Responsible AI policy, validation checkpoints, iterative corrections
8. **Prompt evolution** — Phase-by-phase summary (Phases 1–8 at time of writing)
9. **Maintainability** — Framework structure, helpers, extension points, known SUT quirks

---

## Validation

| Check | Result |
|-------|--------|
| Cross-referenced `prompts/` artifacts | Yes |
| Test counts match final suite (8 manual, 8 UI, 8 API) | Yes |
| Double-confirm documented | Yes |
| No live credentials in document | Yes |
| Links to README, RTM, FunctionalTestCase.csv | Yes |

---

## Notes

- P21 output lives at **repo root** (`project-info.md`), not under `prompts/`, matching assessment deliverable placement.
- This prompt artifact (`phase-8-prompt-21-project-info.md`) provides documentation parity with other phase prompt files.
- RTM synchronization for final API suite (`TC-API-07`–`11`) completed in Phase 9 — Prompt 25.

---

*Committed: `15ebd90` — Add project-info.md with full QA workflow documentation*
