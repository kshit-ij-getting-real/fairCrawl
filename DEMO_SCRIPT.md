# FairFetch demo script (outside-in + post-login talk track)

## 0) Before you start
- Use demo accounts:
  - Publisher: `publisher+demo@stack.com`
  - AI team: `ai@example.com`
- Ensure `NEXT_PUBLIC_DEMO_MODE=true` so dashboards render showcase data even without backend activity.

---

## 1) Outside-in story (public pages)

### Home
**Say:**
> “FairFetch helps creators get paid when AI reads their content. Instead of uncontrolled scraping, AI teams request through FairFetch with explicit access rules and receipts.”

### How it works
**Say:**
> “The flow is simple: crawler request enters FairFetch, FairFetch checks policy, then allows, blocks, or charges based on publisher rules. Both sides see the same audit trail.”

### Creators page
**Say:**
> “For publishers, this is control + monetization: choose what’s open, what’s premium, and what stays blocked.”

### AI teams page
**Say:**
> “For AI teams, it’s a cleaner API with clear licensing and predictable pricing.”

### Directory
**Say:**
> “Directory lists verified AI-ready domains and pricing signals, so teams can start with permissioned sources.”

---

## 2) Publisher login flow

1. Log in as publisher.
2. Go tab-by-tab:

### Overview
**Say:**
> “This is the control room: 30-day revenue, request volume, onboarding status, and recent paid redemptions.”

### Domains
**Say:**
> “Here I register domains and confirm verification. In demo mode, we preload two verified domains so you can instantly show the full workflow.”

### Pricing
**Say:**
> “Licenses define what buyers can do—summary or full display. Pricing rules apply by path, so premium sections can have different rates.”

### Transactions
**Say:**
> “Every paid access event shows up here with timestamp, domain/path, license, and price. This is payout evidence.”

### Content controls
**Say:**
> “Sensitive paths can be explicitly excluded. That means publishers keep hard boundaries while still monetizing approved sections.”

---

## 3) AI team login flow

1. Log out, then log in as AI team.
2. Walk through each tab:

### API keys
**Say:**
> “AI clients mint tokens using these credentials. Demo data shows realistic masked keys.”

### Agent identity
**Say:**
> “Agent identity is what publishers see in receipts. It ties usage to a known crawler profile.”

### Usage/Spend
**Say:**
> “This is cost visibility—daily trend line plus domain breakdown. Teams can monitor spikes and optimize crawl behavior.”

### Test paid request
**Say:**
> “This runs the full loop: mint token, redeem content, inspect receipt. It proves both access control and payment accounting.”

---

## 4) Close (30-second ending)

**Say:**
> “FairFetch turns AI access into a transparent market: creators set rules and get paid, AI teams get clean licensed data, and both sides share auditable receipts.”


## 5) Demo data guardrails (important)

- Dashboards now auto-fallback to seeded demo examples when API responses are empty.
- Keep `NEXT_PUBLIC_DEMO_FALLBACK=true` (default) for pitch/demo environments.
- Set `NEXT_PUBLIC_DEMO_FALLBACK=false` in strict QA if you want to validate true empty-state behavior.

## 6) Populate publisher + AI agent story quickly

Use the two copy/paste prompts in `README.md` under **Demo content prompts (copy/paste)** to generate:
- publisher-side free preview + premium report content
- AI agent run history, usage charts, and receipts

Then narrate the generated content while walking through publisher tabs and AI team tabs.
