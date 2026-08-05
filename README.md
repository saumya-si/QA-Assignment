# QA Assignment

Repository for QA AI Capability Exercise — Practice Software Testing Toolshop.

**Remote:** https://github.com/saumya-si/QA-Assignment

## Structure

- `FunctionalTestCase.csv` — Manual test cases
- `RequirementTraceabilityMatrix.csv` — RTM
- `PrismStructure/` — Playwright UI + API automation (Prism framework)
- `test-data/` — Static test data (billing, search keywords)
- `prompts/` — Phase prompt history and AI workflow artifacts
- `QA Practical Assessment.pdf` — Assessment document

## Quick Start (Automation)

```bash
cp .env.example .env   # Set TEST_USER_PASSWORD and TEST_CUSTOMER_PASSWORD
cd PrismStructure
npm install
npx playwright install chromium
npm run test:smoke
```

See [PrismStructure/README.md](PrismStructure/README.md) for full commands and report locations.
