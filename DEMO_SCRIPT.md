# FairFetch Final Demo Script

## 0) Demo prep (2 minutes before call)
- Open frontend: `https://fair-fetch.vercel.app`
- Keep backend handy: `https://fairfetch.onrender.com`
- Confirm demo accounts:
  - Publisher: `publisher@fairfetch.local` / `password123`
  - AI client: `client@fairfetch.local` / `password123`
- If using local/dev fallback, run seed first so data is present.

---

## 1) 30-second opener (outside-in)
**Say:**
> “FairFetch creates a permissioned market between publishers and AI teams. Publishers define rules and pricing by domain/path; AI teams request licensed access through tokens. Every paid fetch creates a shared, auditable receipt.”

Then quickly visit:
1. `/` (home)
2. `/how-it-works`
3. `/directory`

**Narration cues:**
- Home: “This is the value proposition: control + monetization for publishers, clean licensing for AI teams.”
- How-it-works: “Requests are policy-checked and either allowed, blocked, or paid.”
- Directory: “Only verified domains are discoverable to buyers.”

---

## 2) Publisher flow (3 minutes)
1. Log in as publisher.
2. Open `/publisher/dashboard`.
   - **Say:** “This is the operator view: performance, onboarding, and recent monetized activity.”
3. Open `/publisher/domains`.
   - **Say:** “Publishers register domains and verify ownership. For MVP demos, verification is often bypass-enabled for speed.”
4. Open `/publisher/pricing`.
   - **Say:** “Pricing is path-aware and license-aware, so premium sections can be monetized differently than public sections.”
5. Open `/publisher/transactions`.
   - **Say:** “This ledger is the revenue evidence trail—every paid redemption is timestamped and attributable.”
6. (Optional) Open `/publisher/controls` and `/publisher/payouts`.
   - **Say:** “These are productized surfaces in progress, illustrating how governance and settlement fit into the full workflow.”

---

## 3) AI client flow (3 minutes)
1. Log out and log in as AI client.
2. Open `/aiclient/api-keys`.
   - **Say:** “Keys provide machine credentials for token minting.”
3. Open `/aiclient/agent-identity`.
   - **Say:** “Identity maps usage to a known crawler/agent profile for accountability.”
4. Open `/aiclient/usage-spend`.
   - **Say:** “Teams get daily and domain-level spend visibility to control budget and optimize crawl policy.”
5. Open `/aiclient/test-paid-request` (or dashboard if you prefer).
   - **Say:** “Now we run the paid lane end-to-end.”

---

## 4) Live paid-lane proof (CLI, 90 seconds)

### A) Mint token
```bash
curl -X POST "https://fairfetch.onrender.com/api/tokens" \
  -H "Content-Type: application/json" \
  -H "x-api-key: <AI_CLIENT_API_KEY>" \
  -H "User-Agent: DemoBot/1.0" \
  -d '{
    "url": "https://ai-essays.vercel.app/premium/demo-article",
    "license": "SUMMARY",
    "maxPriceMicros": 200000
  }'
```

### B) Redeem token
```bash
curl "https://fairfetch.onrender.com/api/content?url=https%3A%2F%2Fai-essays.vercel.app%2Fpremium%2Fdemo-article" \
  -H "x-fairfetch-token: <SPEND_TOKEN>"
```

### C) Prove shared receipt outcome
- Refresh `/publisher/transactions`
- Refresh `/aiclient/dashboard` or `/aiclient/usage-spend`

**Say:**
> “One transaction, two perspectives: publisher monetization record and AI client cost/usage record. That shared receipt model is the core trust primitive.”

---

## 5) Close (20 seconds)
**Say:**
> “FairFetch turns unstructured scraping into structured licensed access: publishers control and monetize access, AI teams buy compliant data access, and both sides operate from the same auditable ledger.”

---

## 6) Backup plan (if something breaks live)
- If frontend fails: run only the two curl commands and narrate mint → redeem → ledger semantics.
- If backend fails: switch to local stack (`docker compose up -d`, migrate, seed) and repeat same flow.
- If login is flaky: continue with pre-generated API key and run API-only demonstration.
