# Phase 1 — Prompt 4: Responsible AI Usage

**Prompt:** List what information should NOT be shared with AI tools: credentials, tokens, sensitive data, internal configs. Suggest safe alternatives.

**Context:** QA AI Capability Exercise — Toolshop v5.0 (Playwright + Cursor AI)

---

## 1. Guiding Principle

Share **context, not secrets**. AI tools need enough information to help with test design, automation, and debugging — but must never receive credentials, production data, or proprietary configuration that could be logged, retained, or exposed through third-party model providers.

> **Rule of thumb:** If you would not paste it into a public Slack channel, do not paste it into an AI prompt.

---

## 2. What NOT to Share with AI Tools

### 2.1 Credentials

| Do NOT share | Why | Examples in this project |
|--------------|-----|--------------------------|
| User passwords | Stored in chat logs; model training/retention risk | `welcome01`, real account passwords |
| GitHub username + password | Account takeover risk | Personal GitHub login |
| Database connection strings with password | Full DB access exposure | `mysql://user:pass@host/db` |
| Admin account credentials | Elevated privilege leak | `admin@practicesoftwaretesting.com` + password |
| CI/CD service account passwords | Pipeline compromise | Jenkins, GitHub Actions secrets |
| OAuth client secrets | Impersonation of application | Google Sign-In client secret |

### 2.2 Tokens & API Keys

| Do NOT share | Why | Examples in this project |
|--------------|-----|--------------------------|
| GitHub Personal Access Tokens (PAT) | Repo read/write/delete access | `ghp_xxxx`, `github_pat_xxxx` |
| Bearer / access tokens from login API | Session hijacking | `access_token` from POST `/users/login` |
| Refresh tokens | Long-lived session compromise | `refresh_token` in API response |
| Cursor API keys | Billing and agent access | Cursor SDK / API tokens |
| Cloud provider API keys | Infrastructure access | AWS, Azure, GCP keys |
| Payment gateway test/live keys | Financial fraud risk | Stripe, PayPal API keys |
| JWT tokens (decoded or raw) | User impersonation | Any live JWT from SUT |

### 2.3 Sensitive Data

| Do NOT share | Why | Examples in this project |
|--------------|-----|--------------------------|
| Real customer PII | GDPR / privacy violation | Real names, emails, phone numbers, DOB |
| Real billing / payment card data | PCI-DSS scope; fraud risk | Credit card numbers, CVV, bank accounts |
| Production user data exports | Data breach if prompt logged | CSV dumps of real users |
| Internal employee information | HR / privacy violation | Colleague emails, performance data |
| Authentication cookies / session IDs | Session hijacking | Browser `Set-Cookie` headers from live sessions |
| Screenshots containing real credentials | Visual leak in chat context | Login screen with password visible |
| Invoice PDFs with real customer data | Order PII exposure | Downloaded invoices from non-demo env |

### 2.4 Internal Configs & Proprietary Assets

| Do NOT share | Why | Examples in this project |
|--------------|-----|--------------------------|
| `.env` files (full contents) | Contains secrets and endpoints | `GITHUB_TOKEN=...`, `BASE_URL=...` |
| `mcp.json` with embedded tokens | MCP server credentials | GitHub MCP PAT in headers |
| Private Prism Framework source (if licensed) | IP / license violation | Internal org framework code |
| Corporate VPN / proxy credentials | Network access exposure | Proxy auth strings |
| Internal test environment URLs (non-public) | Attack surface disclosure | `https://staging.internal.company.com` |
| CI pipeline secrets configuration | Supply chain risk | Full `secrets` block from GitHub Actions YAML |
| `.cursor/` rules containing org secrets | Accidental credential embed | Rules referencing internal API keys |
| Proprietary test data from client projects | NDA / confidentiality breach | Real client application test cases |

---

## 3. Safe Alternatives

### 3.1 Credentials → Placeholders & Environment Variables

| Instead of | Use |
|------------|-----|
| `password: "welcome01"` in prompt | `password: process.env.TEST_PASSWORD` or `<from-env>` |
| Pasting GitHub PAT | Reference: *"authenticate via `gh auth login` locally"* |
| Hardcoded admin password in spec file | `.env.example` with `ADMIN_PASSWORD=` (empty) + README setup instructions |
| Sharing login response with token | *"After login, store bearer token in a runtime variable — do not log it"* |

**Example safe prompt:**
> *"Create a Playwright login helper that reads email and password from environment variables `TEST_USER_EMAIL` and `TEST_USER_PASSWORD`. Do not hardcode credentials."*

### 3.2 Tokens → Runtime Capture, Never in Prompts

| Instead of | Use |
|------------|-----|
| Pasting `access_token` into chat | Capture in test via API login step; pass to next request in code |
| Sharing JWT in debugging prompt | Describe error: *"401 Unauthorized on GET /invoices after login"* |
| Committing tokens to git | `.gitignore` for `.env`, `*.token`, `auth.json` |

**Example safe prompt:**
> *"The API test fails with 401 on POST /invoices. The login step returns 200. Help me debug token attachment in the Authorization header — I will not share the actual token."*

### 3.3 Sensitive Data → Synthetic / Faker Data

| Instead of | Use |
|------------|-----|
| Real email `john.smith@gmail.com` | `testuser_${timestamp}@example.com` via Faker |
| Real address | Assessment example: *Zoey Shore, Hesselbury, Florida, TG, 1234AA* |
| Real DOB | Generated date 18–75 years ago: `1990-05-15` |
| Real phone number | `+1-555-0100` (reserved fictional range) |
| Customer PII in bug report screenshot | Redact or use demo app data only |

**Example safe prompt:**
> *"Generate test data for user registration: unique email, valid password meeting complexity rules, DOB between 18–75. Use faker-style synthetic data."*

### 3.4 Internal Configs → Structure & Patterns Only

| Instead of | Use |
|------------|-----|
| Full `.env` file contents | Describe structure: *"BASE_URL, TEST_USER_EMAIL, TEST_USER_PASSWORD"* |
| `mcp.json` with real PAT | *"Configure GitHub MCP with PAT stored in env var `GITHUB_PERSONAL_ACCESS_TOKEN`"* |
| Internal Prism Framework repo | Describe pattern: *"Page object model with basePage, authPage, cartPage following Prism conventions"* |
| Private staging URL | *"Base URL is configured via `process.env.BASE_URL`"* |
| Full CI secrets YAML | Share structure only: *"secrets.TEST_PASSWORD referenced in workflow, value set in GitHub Secrets UI"* |

**Example safe prompt:**
> *"Create a `.env.example` file listing required variables without values. Add `.env` to `.gitignore`."*

---

## 4. Project-Specific Safe Practices (Toolshop Assessment)

| Activity | Safe approach |
|----------|---------------|
| **Registration tests** | Generate unique synthetic emails per run; never use personal email |
| **Login tests** | Reference demo account by role (*"customer account"*) not password in prompts |
| **API automation** | Capture bearer token in test runtime; redact from logs and reports |
| **Invoice debugging** | Share cart_id format and error message, not full request with live token |
| **Git commits** | Never commit `.env`, tokens, or `auth.json`; use `.gitignore` |
| **ai-prompts/ folder** | Summarize prompts for evaluators; redact any accidental secrets before saving |
| **Execution reports** | Scrub screenshots of password fields before attaching |
| **Cursor chat** | Start fresh chats per phase; don't carry tokens across sessions |
| **GitHub repo** | Public repo — assume all committed files are world-readable |

### Demo vs Real Data

| Safe (Toolshop demo) | Unsafe |
|----------------------|--------|
| `customer@practicesoftwaretesting.com` as *account identifier* in test design docs | Sharing `welcome01` password in prompts or commits |
| Public SUT URL `practicesoftwaretesting.com` | Internal company staging URLs |
| Assessment example billing address | Real home address |
| Synthetic `testuser_20260805@mailinator.com` | Your personal Gmail |

---

## 5. Redaction Checklist (Before Saving to `ai-prompts/`)

Before copying any chat summary into `ai-prompts/requirements-and-planning.md` (or other prompt history files):

- [ ] No passwords or tokens in prompt text
- [ ] No `.env` values — only variable names
- [ ] No real PII — synthetic data only
- [ ] No screenshots with filled password fields
- [ ] No GitHub PAT or `ghp_` strings
- [ ] No bearer tokens or JWT strings
- [ ] No internal URLs or VPN details
- [ ] API error logs scrubbed of `Authorization` headers

---

## 6. What IS Safe to Share with AI

| Category | Examples |
|----------|----------|
| Public SUT URLs | `https://practicesoftwaretesting.com/` |
| API documentation (public) | Swagger endpoint list, request/response schemas |
| Assessment requirements | QA PDF content, AC descriptions |
| Test strategy | Smoke vs Regression, 5–8 test limit |
| Error messages (sanitized) | *"422 Unprocessable Entity on missing billing_city"* |
| Code structure | Page object names, spec file organization |
| Public demo account **role** | *"use pre-seeded customer account from docs"* |
| Synthetic test data patterns | Faker rules, timestamp-based emails |
| Framework patterns | Playwright + Prism POM structure |
| Risk analysis & test cases | TC-UI-01 through TC-UI-08 descriptions |

---

## 7. Incident Response (If a Secret Is Accidentally Shared)

1. **Revoke immediately** — rotate password, revoke PAT, invalidate token
2. **Remove from git history** if committed (and force-push only if repo is private and you own it)
3. **Do not repeat** the secret in follow-up prompts — reference *"the previously shared credential (now rotated)"*
4. **Update `.gitignore`** and use env vars going forward
5. For GitHub PAT: Settings → Developer settings → Personal access tokens → Delete

---

## AI Response Summary

Documented four categories of information to never share with AI (credentials, tokens, sensitive data, internal configs) with project-specific examples and safe alternatives: environment variables, synthetic/faker data, runtime token capture, structural config descriptions, and redaction checklist for `ai-prompts/` submission artifacts.
