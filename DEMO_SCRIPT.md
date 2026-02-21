# FairFetch Demo Script (Read-Aloud + Built-In Stage Directions)

Use this as a teleprompter script: read every line exactly as written, including the bracketed directions when it is time to perform an action.

---

## 0) Opening (30–45 seconds)

[On home page `/`. Look at camera.]  
Today, publishers have two bad options with AI crawlers: either block everything and lose discovery, or allow everything and lose control. There is no simple way to set clear access rules, attach pricing, and keep an audit trail both sides can trust.

[Small pause.]  
FairFetch solves that by creating a permissioned market between publishers and AI teams. Publishers define rules and pricing by domain and path. AI teams request licensed access through tokens. And when the paid lane is fully live, both sides see the same receipt trail.

[Emphasize this line.]  
In this demo, I am focusing on product surfaces and workflow. I am not claiming real marketplace settlement is happening live unless separately verified in this environment.

---

## 1) Outside-In Walkthrough

### Home: `/`

[Stay on `/`. Gesture to hero/value props.]  
This first page explains the core value: publishers keep control and can monetize access, while AI teams get a cleaner path to licensed content.

[Point to Control / Track / Earn messaging.]  
You can see the key promises here: control access, track usage, and earn from your work.

[Point to gateway status examples.]  
The gateway snapshot also shows clear states like allowed, not listed, and metered.

[Simple framing.]  
Think of FairFetch like a smart front desk. Every AI request checks in, gets matched against the publisher’s house rules, and then gets the right response.

### How It Works: `/how-it-works`

[Click to `/how-it-works`.]  
This page shows the three-step lifecycle: publisher setup, AI request through FairFetch, then rule-based access with logging.

[Keep tone simple.]  
Instead of AI bots guessing what is okay to read, both sides use one shared flow: identify who is asking, check the rule, and return a clear outcome.

### Directory: `/directory`

[Click to `/directory`.]  
This is the discoverability layer. Buyers can browse verified AI-ready domains instead of scraping unknown sources.

[Point to listing structure.]  
Directory entries act like trusted listings: who owns the domain and whether AI access rules are published.

---

## 2) Publisher Flow

### Login as Publisher

[Go to `/login`. Enter publisher credentials. Sign in. Wait for `/publisher/dashboard`.]  
Now we are in the publisher operator workspace.

### Publisher Dashboard: `/publisher/dashboard`

[On dashboard, point to top cards/checklist/activity.]  
This dashboard is the control room view: top metrics, setup checklist, and recent monetization activity surfaces.

[If data is light.]  
In this environment, treat these values as demo indicators of what the live operating view looks like.

### Domains: `/publisher/domains`

[Click to `/publisher/domains`.]  
Here publishers register domains and handle ownership verification steps. For MVP demos, verification may be simplified to keep onboarding fast.

[Short technical line.]  
Before rules can apply, the platform needs to know the publisher actually controls the domain.

### Pricing: `/publisher/pricing`

[Click to `/publisher/pricing`.]  
This is where monetization logic is configured. Pricing can vary by URL path and by license type.

[Give example.]  
A publisher can treat sections differently, for example public blog paths versus premium research paths.

### Transactions: `/publisher/transactions`

[Click to `/publisher/transactions`.]  
This page is designed as the evidence trail for paid redemptions: who accessed what, when, and at what price.

[If empty/simulated.]  
Because this is a front-end demo environment, treat this as the final reporting surface, not proof of live payment settlement right now.

### Optional Publisher Pages

[Optional: open `/publisher/controls`.]  
This area represents governance and policy controls in the broader publisher toolkit.

[Optional: open `/publisher/payouts`.]  
This area represents where payout and settlement workflows are surfaced for publishers.

---

## 3) AI Client Flow

### Login as AI Client

[Log out. Go to `/login`. Enter AI client credentials. Sign in.]  
Now I am switching to the AI buyer/operator view.

### API Keys: `/aiclient/api-keys`

[Navigate to `/aiclient/api-keys`.]  
API keys are the machine credentials used to request access in a controlled way.

[Simple analogy.]  
This is like issuing company badges to software agents so requests are identifiable.

### Agent Identity: `/aiclient/agent-identity`

[Click to `/aiclient/agent-identity`.]  
Agent identity ties requests to a known crawler or model profile for accountability.

[Simple explanation.]  
Instead of an anonymous bot, each request can be linked to a declared identity.

### Usage and Spend: `/aiclient/usage-spend`

[Click to `/aiclient/usage-spend`.]  
Teams get usage and spend visibility so they can manage budget and tune crawl behavior.

[If data is sparse.]  
In demo mode, this shows reporting layout and controls even if production volumes are not populated.

### Test Paid Request: `/aiclient/test-paid-request` or `/aiclient/dashboard`

[Click to `/aiclient/test-paid-request` (or dashboard fallback).]  
This is the guided test surface for the paid-request flow and receipt output.

[Read this accuracy line clearly.]  
For this demo, I am showing the product experience and expected outputs. I am not claiming that real marketplace money movement is occurring in this exact run.

---

## 4) 60-Second Technical Summary

[Face camera; stop clicking.]  
Under the hood, FairFetch does three simple things.

[Count on fingers.]  
First, it confirms who is asking for content.  
Second, it checks the publisher’s rule for that exact URL section and license.  
Third, it returns an outcome: allowed, blocked, or paid path with a record.

[Close this section.]  
The key idea is shared visibility: publishers and AI teams can work from the same access and receipt history instead of arguing over logs later.

---

## 5) Close (20 seconds)

[Return to confident close; slight smile.]  
FairFetch turns AI access from a gray area into a structured workflow: clear permissions for publishers, cleaner licensed access for AI teams, and transparent records as the foundation for trust.

---

## 6) Optional Q&A Lines (Honesty-Safe)

[Use only if asked whether real revenue is moving in this demo.]  
What I am demonstrating here is the front-end workflow and product surfaces.

[If pressed.]  
The settlement and ledger model is part of the platform design; this environment is focused on UX walkthrough rather than proving live funds transfer.

[If they ask for proof.]  
If needed, we can run a backend-verified environment separately to demonstrate end-to-end transaction state changes.
