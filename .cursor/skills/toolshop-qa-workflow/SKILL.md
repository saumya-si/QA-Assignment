---
name: toolshop-qa-workflow
description: >-
  Run and extend QA Assignment tests for Practice Software Testing Toolshop.
  Use when working on FunctionalTestCase.csv, PrismStructure specs, RTM, or
  ai-prompts documentation for this repository.
---

# Toolshop QA Workflow

## Quick commands

```bash
cd PrismStructure
npm test                  # Full suite (16 tests)
npm run test:smoke        # 6 smoke tests
npm run test:regression   # 13 regression tests
```

## Before adding tests

1. Confirm tier count ≤ 8 (manual / UI / API)
2. Add RTM row in `RequirementTraceabilityMatrix.csv`
3. Log AI prompt in the matching `ai-prompts/*.md` file
4. Run suite and update `FunctionalTestCase.csv` or execution evidence if manual

## Key files

| Purpose | Path |
|---------|------|
| Manual tests | `FunctionalTestCase.csv` |
| Automation | `PrismStructure/tests/` |
| Traceability | `RequirementTraceabilityMatrix.csv` |
| Prompt history | `ai-prompts/` |
