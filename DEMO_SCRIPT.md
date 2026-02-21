# FairFetch Front-End Demo Script (No Live Transaction Dependency)

Use this script when dashboard data is light or mocked and you want a clean, credible walkthrough of what is visible in the UI today.

---

## 0) Opening: Start with the problem (30–45 seconds)

**Say:**
> “Today, publishers have two bad options with AI crawlers: either block everything and lose discovery, or allow everything and lose control. There’s no simple way to set clear access rules, attach pricing, and keep an audit trail both sides can trust.”

**Then transition:**
> “FairFetch solves that by creating a permissioned market between publishers and AI teams. Publishers define rules and pricing by domain and path. AI teams request licensed access through tokens. And when the paid lane is fully live, both sides see the same receipt trail.”

> **Important presenter note:** In this demo, focus on product surfaces and workflow. Do **not** claim real marketplace settlement is happening live unless you have verified it in this environment.

---

## 1) Outside-in walkthrough (home → how-it-works → directory)

### Page: `/` (Home)

**Say:**
> “This first page explains the core value: publishers keep control and can monetize access, while AI teams get a cleaner path to licensed content.”

**Point out:**
- “Control access” messaging (publishers choose what AI can reach).
- “Track usage” messaging (usage and paid-access logs).
- “Earn from your work” messaging (pricing premium access).
- Gateway snapshot states: allowed, not listed, metered.

**Simple technical explanation (no jargon):**
> “Think of FairFetch like a smart front desk. Every AI request checks in, gets matched against the publisher’s house rules, and then gets the right response.”

### Page: `/how-it-works`

**Say:**
> “This page shows the 3-step lifecycle: publisher setup, AI request via FairFetch, then rule-based access with logging.”

**Simple technical explanation:**
> “Instead of AI bots guessing what is okay to read, both sides use one shared flow: identify who is asking, check the rule, and return a clear outcome.”

### Page: `/directory`

**Say:**
> “This is the discoverability layer. Buyers can browse verified AI-ready domains instead of scraping unknown sources.”

**Simple technical explanation:**
> “Directory entries act like trusted listings: who owns the domain, and whether AI access rules are published.”

---

## 2) Publisher flow (operator perspective)

### Step A: Login as publisher
- Go to `/login`
- Use publisher credentials
- Land on `/publisher/dashboard`

**Say:**
> “Now we’re in the publisher operator workspace.”

### Page: `/publisher/dashboard`

**Say:**
> “This dashboard is the control room view: top metrics, setup checklist, and recent monetization activity surfaces.”

**If numbers are demo/mock:**
> “In this environment, treat these values as demo indicators of what the live operating view looks like.”

### Page: `/publisher/domains`

**Say:**
> “Here publishers register domains and handle ownership verification steps. For MVP demos, verification may be simplified to keep onboarding fast.”

**Simple technical explanation:**
> “Before rules can apply, the platform needs to know the publisher actually controls the domain.”

### Page: `/publisher/pricing`

**Say:**
> “This is where monetization logic is configured: pricing can vary by URL path and by license type.”

**Simple technical explanation:**
> “A publisher can treat sections differently—for example, public blog paths vs premium research paths.”

### Page: `/publisher/transactions`

**Say:**
> “This page is designed as the evidence trail for paid redemptions: who accessed what, when, and at what price.”

**If empty or simulated:**
> “Because this is a front-end demo environment, think of this as the final reporting surface, not proof of live payment settlement right now.”

### Optional pages

#### `/publisher/controls`
**Say:**
> “Governance and policy controls are represented here as part of the full publisher toolkit.”

#### `/publisher/payouts`
**Say:**
> “This area represents where payout and settlement workflows are surfaced for publishers.”

---

## 3) AI client flow (buyer/operator perspective)

### Step A: Log out, then login as AI client
- Go to `/login`
- Use AI client credentials
- Land on `/aiclient/api-keys` (or navigate there)

### Page: `/aiclient/api-keys`

**Say:**
> “API keys are the machine credentials used to request access in a controlled way.”

**Simple technical explanation:**
> “This is like issuing company badges to software agents so requests are identifiable.”

### Page: `/aiclient/agent-identity`

**Say:**
> “Agent identity ties requests to a known crawler or model profile for accountability.”

**Simple technical explanation:**
> “Instead of an anonymous bot, each request can be linked to a declared identity.”

### Page: `/aiclient/usage-spend`

**Say:**
> “Teams get usage and spend visibility so they can manage budget and tune crawl behavior.”

**If data is sparse:**
> “In demo mode, this shows the reporting layout and controls even if production volumes are not populated.”

### Page: `/aiclient/test-paid-request` (or `/aiclient/dashboard`)

**Say:**
> “This is the guided test surface for the paid-request flow and receipt output.”

**Important accuracy line:**
> “For this demo, we’re showing the product experience and expected outputs. We are not claiming that real marketplace money movement is occurring in this exact run.”

---

## 4) User-friendly technical explanation (60-second version)

**Say:**
> “Under the hood, FairFetch does three simple things:
> 1) Confirms who is asking for content.
> 2) Checks the publisher’s rule for that exact URL section and license.
> 3) Returns an outcome: allowed, blocked, or paid path with a record.
>
> The key idea is shared visibility: publishers and AI teams can work from the same access and receipt history, instead of arguing over logs later.”

---

## 5) Close (20 seconds)

**Say:**
> “FairFetch turns AI access from a gray area into a structured workflow: clear permissions for publishers, cleaner licensed access for AI teams, and transparent records as the foundation for trust.”

---

## 6) Optional honesty-safe lines for Q&A

Use these if asked whether revenue is truly moving in the demo:

- “What we’re demonstrating here is the front-end workflow and product surfaces.”
- “The settlement and ledger model is part of the platform design; this environment is focused on UX walkthrough rather than proving live funds transfer.”
- “If needed, we can run a backend-verified environment separately to demonstrate end-to-end transaction state changes.”
