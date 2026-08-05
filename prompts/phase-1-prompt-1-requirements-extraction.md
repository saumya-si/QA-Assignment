# Phase 1 — Prompt 1: Extract Assessment Requirements

**Prompt:** Read the attached QA Practical Assessment document. Extract mandatory deliverables, UI/API ACs, test-count restrictions, tools/framework, submission structure, special instructions, and ambiguous/conflicting requirements. Do not generate code.

**Source:** `QA Practical Assessment.pdf`

---

## 1. Mandatory Deliverables

### Part A — AI Workflow Foundation (30% weight)
- **`project-info.md`** documenting:
  1. What the project is about
  2. Primary AI tool(s) used (e.g., ChatGPT, Cursor)
  3. How project/SUT context is provided to AI
  4. How AI is used for requirement analysis
  5. How AI is used for test planning and strategy (UI vs API, smoke vs regression)
  6. How AI is used for manual test case design (functional, edge, negative, non-functional)
  7. How AI is used for automation design (framework, structure, data, utilities)
  8. How AI-generated test cases/scripts are validated and refined
  9. How AI is used for test data generation, environment assumptions, API payloads
  10. How AI is used for debugging failing tests and interpreting logs
  11. What information is avoided sharing with AI tools
  12. How this QA workflow would be reused in a real project

### Part B — QA Mini Project (70% weight)
1. **Requirement and risk analysis** specific to the application under test
2. **`project-info.md`** (Project Info, UI, API, positive/negative/edge, Smoke/Regression)
3. **Manual test suite** — `FunctionalTestCase.csv` for key flows
4. **UI automation tier** (Playwright) — smoke and E2E/regression flows
5. **API automation tier** (Playwright) — core lifecycle APIs
6. **Test data strategy** (design/generation, including via AI)
7. **Execution evidence** — logs, reports, screenshots, or API collections
8. **`readme.md`** — setup and execution instructions
9. **Full prompt history** in `ai-prompts/` folder
10. All artifacts in a clear repository/folder structure
11. **Execution reports** with all test cases in **Passed** status
12. **Public git repo URL** shared as submission

### Core QA Acceptance (quality bar)
- Clear test objectives and scope derived from application/tickets
- Traceable mapping: requirements/state machine → scenarios → cases
- Valid and invalid status transitions covered (manual + API automation)
- UI flows: create, list, view, update, comment, search, error handling
- API flows: create, list, view, update, comment, search, error handling
- Well-planned test data (priorities, statuses, edge cases)
- At least one automation suite runnable from README (beyond env setup)
- Prompt history shows thoughtful AI use, not unreviewed copy-paste

---

## 2. UI and API Acceptance Criteria

### System Under Test
| Layer | URL |
|-------|-----|
| **UI** | https://practicesoftwaretesting.com/ |
| **API** | https://api.practicesoftwaretesting.com/api/documentation |

**Application:** PracticeSoftwareTesting Toolshop — ecommerce; checkout and application flow focus.

### UI Acceptance Criteria (examples — adapt as formal ACs)

**AC1: User Registration & Login**
- Register with valid details
- Log in with registered credentials
- Verify profile information successfully

**AC2: End-to-End Purchase Flow**
- Browse products
- Add multiple items to cart (including quantity updates)
- Checkout using **Cash on Delivery**
- View generated invoice under **My Invoices**

**UI scope note:** Include all possible testable flows; categorize as **sanity** or **regression**.

### API Acceptance Criteria (examples — adapt as formal ACs)

**AC1: User Authentication & Cart Creation**
- Register via API
- Log in with registered credentials
- Obtain valid bearer token
- Create a new cart successfully

**AC2: Product Selection & Invoice Generation**
- Retrieve products using bearer token
- Add selected products to cart
- Verify cart contents
- Generate invoice with required customer and order details

**Example invoice POST body:**
```json
{
  "billing_street": "Zoey Shore",
  "billing_city": "Hesselbury",
  "billing_state": "Florida",
  "billing_country": "TG",
  "billing_postal_code": "1234AA",
  "payment_method": "cash-on-delivery",
  "cart_id": "<dynamic-cart-id>",
  "payment_details": {}
}
```

---

## 3. Test-Count Restrictions

- **Maximum 5–8 test cases per type:** manual, UI automation, and API automation
- Each type must include **`@Smoke`** and **`@Regression`** tags
- Do **not** expand automation surface area at the expense of lifecycle artifacts
- Core project scoped to **~5–10 focused hours**; quality over breadth

---

## 4. Required Tools and Framework

| Category | Requirement |
|----------|-------------|
| **Automation framework** | Playwright with **Prism Framework** |
| **AI tool** | **Cursor AI** (primary) |
| **Alternative mentions** | Selenium listed in repo structure as optional path |
| **Browser** | Not explicitly specified — document in `readme.md` |
| **API testing** | Playwright (not Postman/Karate for automation tier) |
| **Cursor config (optional)** | `.cursor/` — Rules, Skills, agent/MCP |
| **Model strategy** | Auto/Composer 2.5 for planning (~70%); Sonnet 4.6 for automation/debugging |
| **Token budget** | Stay within Cursor **monthly limit** |

---

## 5. Submission Structure

```
qa-ai-practical-assessment/
├── FunctionalTestCase.csv
├── PrismStructure/          # Playwright/Selenium — API + UI + Execution Report
├── project-info.md
├── readme.md
├── ai-prompts/
│   ├── requirements-and-planning.md
│   ├── test-design.md
│   ├── test-data.md
│   ├── automation-and-debugging.md
│   └── documentation-and-summary.md
└── .cursor/                 # Optional: Rules, Skills, agent/MCP
```

### `readme.md` must include
- Framework used
- How to run tests
- Test data location
- Separate commands for **Smoke** and **Regression**
- Where final reports are generated

### `ai-prompts/` entry format
Each file records: **Prompt → AI Response Summary → Validation Notes** (or Debugging Outcome / Edits / Reason for Edits as applicable).

---

## 6. Important Special Instructions

1. **Invoice generation (UI):** Press **Confirm twice** to generate invoice (mentioned twice in document).
2. **Payment method:** Cash on Delivery (`cash-on-delivery`) for checkout/invoice flows.
3. **All automated tests must pass** — execution reports required with Passed status.
4. **Iterative development:** Prompt iteratively; **git pushes must NOT be a single commit** — multiple iterative commits expected.
5. **Public git submission:** Submit via public repository and share URL.
6. **AI visibility is graded:** Evaluators assess *how* AI was used, not only whether tests run.
7. **Caveman skill:** Short, focused prompts; one task per chat; summarize chats into `ai-prompts/` files.
8. **Suggested phase flow:** Requirements → Manual CSV + prompts → UI/API automation → Execute & evidence → Git push.
9. **Not a pass/fail exam** — development exercise with feedback report.
10. **Completion timeline:** Self-paced within **one week**.

---

## 7. Ambiguous or Conflicting Requirements

| # | Issue | Details |
|---|-------|---------|
| 1 | **"Three parts" vs two parts** | Section 5 says exercise has "three parts" but table lists only Part A and Part B. No Part C defined. |
| 2 | **Numbering errors in `project-info.md`** | Items jump: two "2." entries; items 3–11 follow but item 1 appears twice with different content. |
| 3 | **Numbering gap in Common QA Requirements** | List jumps from item 4 to 6 (no item 5); from 8 to 10 (no item 9). |
| 4 | **UI/API flow mismatch with Core AC** | Core AC references **comment** and **search** flows for UI and API, but example ACs (registration, purchase, cart, invoice) do not mention comment or search. Unclear if these are mandatory or template boilerplate from another project. |
| 5 | **"State machine" / status transitions** | Core AC requires valid/invalid status transitions, but SUT examples are ecommerce flows — no explicit state machine documented. |
| 6 | **"All possible flows" vs 5–8 test cap** | UI section says include *all possible flows* and categorize sanity/regression, but later caps each type at 5–8 cases. Interpret as: identify all flows in planning, but **execute/automate only 5–8 per tier**. |
| 7 | **Sanity vs Smoke terminology** | UI scope uses **sanity**; elsewhere **Smoke** (`@Smoke`) is used. Treat as equivalent unless evaluator specifies otherwise. |
| 8 | **Repo folder name** | Structure shows `qa-ai-practical-assessment/` but user's repo is `QA-Assignment`. Clarify whether root folder name must match exactly. |
| 9 | **`ai-prompts/` file list inconsistency** | Required structure (p. 8) omits `test-data.md`; detailed template (p. 10–11) includes it. **Include `test-data.md`** per detailed template. |
| 10 | **Playwright vs Selenium** | Tool expectations say Playwright (Prism); repo structure allows "Playwright/Selenium". Prism + Playwright is the stated primary path. |
| 11 | **Core vs Stretch** | Document mentions Core and Stretch evaluated the same way, but Stretch criteria are never defined. |
| 12 | **API scope** | "Test a flow/component" (singular) vs Core AC listing full CRUD-style flows. Breadth unclear beyond the two example ACs. |
| 13 | **Non-functional testing** | `project-info.md` asks about non-functional manual tests; no NFRs defined for Toolshop. Scope undefined. |
| 14 | **Risk analysis deliverable** | Listed as mandatory but no template or location specified (separate file vs section in `project-info.md`). |
| 15 | **Prism framework availability** | Prism is mandated but not included in this repo — assumes internal/organizational framework access. |

---

## AI Response Summary

Extracted 12 mandatory deliverable categories, 2 UI + 2 API example ACs, 5–8 test case cap per tier, Playwright/Prism/Cursor stack, full repo structure, and 15 ambiguity/conflict items for planning resolution in Phase 2.
