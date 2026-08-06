# AI Prompts – Documentation and Summary

Prompts used for README, project-info, prompt history, audits, and submission packaging.

**AI tool:** Cursor AI (Agent mode)

---

## Entry 1 — project-info.md

**Prompt:**  
Create `project-info.md` per assessment Part A: project overview, AI tools, requirement analysis, test strategy, manual/automation design, validation approach, test data, debugging, responsible AI, reusability.

**AI Response Summary:**  
10-section document with objectives, tools, risk summary, test pyramid, coverage tables, test data strategy, AI usage by phase, prompt evolution, maintainability patterns, quick reference.

**Validation Notes:**  
Cross-referenced test counts, RTM, and execution status. Matches PDF template topics 1–11.

**Edits You Made:**  
Added assessment start/submission dates; NFR manual design section; TC-MAN-06 vs TC-MAN-07 clarification; `ai-prompts/` references.

**Reason for Edits:**  
PDF template requires dates and explicit non-functional manual design coverage.

---

## Entry 2 — README and readme.md

**Prompt:**  
Create comprehensive README: framework, setup, `.env`, npm commands (smoke/regression), test inventory, reports, folder structure, known issues (double confirm). Validate commands work.

**AI Response Summary:**  
Root `README.md` + `PrismStructure/README.md`. Sections: prerequisites, install, tagged suites, test tables, execution evidence paths, troubleshooting.

**Validation Notes:**  
`npm run test:smoke` verified (6 passed). All scripts match `package.json`.

**Edits You Made:**  
Added `readme.md` (assessment-required lowercase filename, identical content). Linked `ai-prompts/`, `execution-evidence/`.

**Reason for Edits:**  
PDF submission structure specifies `readme.md`; GitHub also renders `README.md`.

---

## Entry 3 — AI prompt history consolidation

**Prompt:**  
Create master `ai-prompt-history.md` and populate assessment `ai-prompts/` folder with five themed files per PDF layout.

**AI Response Summary:**  
- `ai-prompt-history.md` — table index across 26 prompts, 9 phases  
- `ai-prompts/requirements-and-planning.md` through `documentation-and-summary.md` — self-contained entries

**Validation Notes:**  
Each `ai-prompts/` file uses PDF format (Prompt, AI Response Summary, Validation Notes). No dependency on external `prompts/` folder for evaluator review.

**Edits You Made:**  
Expanded stub files into full prompt records; removed “see prompts/” deferrals.

**Reason for Edits:**  
Assessment requires `ai-prompts/` as primary submission artifact, not cross-references.

---

## Entry 4 — Repository audit and gap resolution

**Prompt:**  
Run 10-area repository audit (structure, counts, tags, RTM, coverage, evidence, README, prompt history, secrets, Git). Close all gaps.

**AI Response Summary:**  
- P24: 7 Pass, 1 Fail (stale RTM), 2 Needs Evidence  
- P25: RTM synced to TC-API-07–11; execution summary committed  
- P26: manual CSV Status=Passed; `execution-evidence/`; `ai-prompts/` populated

**Validation Notes:**  
Post-resolution audit: 10/10 Pass. 8/8 manual + 16/16 automation documented Passed.

**Edits You Made:**  
RTM 98 rows; `FunctionalTestCase.csv` ActualResult filled; `.gitignore` scoped so `reports/execution-evidence/` is tracked.

**Reason for Edits:**  
PDF requires execution reports with all tests Passed and complete prompt history in `ai-prompts/`.

---

## Entry 5 — Cursor project configuration

**Prompt:**  
Add optional `.cursor/` Rules and Skills per assessment repository structure.

**AI Response Summary:**  
- `.cursor/rules/qa-assignment-conventions.mdc` — test caps, tags, secrets, double-confirm quirk  
- `.cursor/skills/toolshop-qa-workflow/SKILL.md` — commands and file map for extending the suite

**Validation Notes:**  
Optional deliverable per PDF. Rules apply `alwaysApply: true` for consistent AI context in this repo.

**Edits You Made:**  
Created `.cursor/` tree with rules + project skill.

**Reason for Edits:**  
Complete assessment folder structure checklist.

---

*Assessment submission file — Documentation and Summary phase (Prompts P21–P26).*
