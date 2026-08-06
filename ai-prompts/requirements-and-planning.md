# AI Prompts – Requirements and Planning

Record of prompts used for understanding the Toolshop flow, extracting assessment requirements, identifying risks, and drafting the test plan.

**AI tool:** Cursor AI (Agent mode)  
**Detailed artifacts:** `prompts/phase-1-prompt-*.md` · **Master index:** `ai-prompt-history.md`

---

## Entry 1 — Requirements extraction (P1)

- **Prompt:** Read `QA Practical Assessment.pdf`. Extract mandatory deliverables, UI/API ACs, test-count restrictions, tools/framework, submission structure, and ambiguities. No code.
- **AI Response Summary:** Listed 12 deliverables, AC1/AC2, 5–8 test cap per tier, Playwright/Prism/Cursor stack, `ai-prompts/` structure, iterative Git requirement.
- **Validation Notes:** Cross-checked every bullet against the PDF; flagged 15 ambiguities (e.g., generic CRUD wording, NFR scope).

## Entry 2 — Application analysis (P2)

- **Prompt:** Analyze Toolshop UI flows; categorize sanity vs regression; recommend 5–8 UI test scope.
- **AI Response Summary:** 42 scenarios across 6 flows; proposed TC-UI-01–08; documented double-confirm invoice quirk.
- **Validation Notes:** Reviewed live SUT; smoke = auth + purchase; regression = negatives and edge cases.

## Entry 3 — Risk analysis (P3)

- **Prompt:** Risk analysis for auth, cart, checkout, double confirm, invoice, API.
- **AI Response Summary:** 23 risks (8 Critical, 9 High, 6 Medium) mapped to test IDs and tags.
- **Validation Notes:** Each Critical risk linked to at least one planned manual or automated test.

## Entry 4 — Responsible AI usage (P4)

- **Prompt:** Document what not to share with AI (credentials, tokens, PII).
- **AI Response Summary:** Four risk categories + safe alternatives (`<from-env>`, redacted logs).
- **Validation Notes:** Aligned with public GitHub repo constraint; no live passwords in prompts.

## Entry 5 — Validate AI outputs (P5)

- **Prompt:** Review Prompts 1–4 for assessment compliance before automation.
- **AI Response Summary:** UI scope OK; API plan over-scoped; traceability gaps; password-in-repo conflict.
- **Validation Notes:** Reduced API plan to 8 tests; fixed requirement mappings; enforced env-only secrets.

---

*Consolidated from Phases 1–5 planning work. See `prompts/phase-1-prompt-1-requirements-extraction.md` through `phase-1-prompt-5-ai-validation.md` for full detail.*
