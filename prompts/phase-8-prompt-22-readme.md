# Phase 8 — Prompt 22: Create README.md

**Prompt:** Create comprehensive README with setup, commands, test data, reports, structure, known issues. Validate commands work.

---

## Deliverables

| File | Purpose |
|------|---------|
| `README.md` | Primary setup and execution guide (repo root) |
| `PrismStructure/README.md` | Framework quick reference (updated, aligned) |

---

## Command validation

| Command | Result |
|---------|--------|
| `npm run test:smoke` | **6 passed** (1 flaky TC-UI-07, passed on retry; exit 0) |
| Full suite (prior run) | **16/16 passed** |
| `npm run report` | Opens `reports/html/index.html` |

All documented npm scripts match `PrismStructure/package.json`.

---

## README sections

1. Overview and prerequisites
2. Setup (clone → `.env` → install → verify smoke)
3. Test execution commands (full, tagged, single spec)
4. Test inventory (8 UI + 8 API)
5. Test data location and management
6. Report generation and access
7. Project folder structure
8. Known issues (double confirm, SUT limitations, scope)
9. Troubleshooting
10. Links to `project-info.md`, RTM, prompts

---

## AI Response Summary

Created comprehensive root `README.md` and aligned `PrismStructure/README.md`. Verified `npm run test:smoke` executes successfully. Documentation reflects current 16-test suite, env-based secrets, and double-confirmation checkout quirk.
