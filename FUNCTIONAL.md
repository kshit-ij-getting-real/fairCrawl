# FUNCTIONAL

## 1) One-sentence summary
FairFetch is a two-sided MVP where publishers set paid access rules for domain paths, and AI teams buy one-time spend tokens to fetch licensed content with usage receipts.

## 2) Who it is for
- **Publisher**: A site owner who wants to list a domain, set per-path pricing rules, and track paid AI fetch transactions.
- **AI Team**: An AI product team that creates API keys, declares agent identity (user-agent regex), mints spend tokens, and tracks spend/usage.

## 3) End-to-end 2-minute demo flow (runnable)
Base URLs:
- Frontend: `https://fair-fetch.vercel.app`
- Backend: `https://fairfetch.onrender.com`

### Publisher flow
1. Go to `https://fair-fetch.vercel.app/login` and sign in as a Publisher.
2. Open `https://fair-fetch.vercel.app/publisher/domains`.
3. Add a domain (example: `ai-essays.vercel.app`).
4. Verification behavior **today**:
   - If backend env `MVP_BYPASS_VERIFICATION=true`, domain is immediately marked verified.
   - Otherwise, `Re-check` calls verify endpoint but returns `VERIFICATION_NOT_IMPLEMENTED_FOR_MVP`.
5. Open `https://fair-fetch.vercel.app/publisher/pricing` and create pricing rules:
   - Path prefix: `/`
   - License: `SUMMARY`
   - Price: e.g. `100000` micros
6. Open `https://fair-fetch.vercel.app/publisher/transactions` (starts empty until token spend happens).

### AI Team flow
1. Go to `https://fair-fetch.vercel.app/login` and sign in as an AI Team (`AICLIENT`).
2. Open `https://fair-fetch.vercel.app/aiclient/dashboard`.
3. In **API keys**, click **Create key** and copy the shown key.
4. In **Agent identity**, set:
   - `agentId`: `demo-agent`
   - `allowedUserAgentRegex`: `.*`
5. Mint token (example curl using API key auth):

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

6. Redeem token for content:

```bash
curl "https://fairfetch.onrender.com/api/content?url=https%3A%2F%2Fai-essays.vercel.app%2Fpremium%2Fdemo-article" \
  -H "x-fairfetch-token: <SPEND_TOKEN>"
```

7. Refresh `https://fair-fetch.vercel.app/aiclient/dashboard` to see usage/spend and `https://fair-fetch.vercel.app/publisher/transactions` to see the matching transaction.

## 4) Directory behavior (what makes a domain appear)
A domain appears in the public directory when backend `GET /api/public/domains` includes it; this endpoint only returns domains where `Domain.verified=true`.

## 5) MVP boundaries (what it does NOT do yet)
- DNS verification is effectively bypass-only in MVP (`MVP_BYPASS_VERIFICATION=true`) or returns not-implemented for real checks.
- `GET /api/content` returns licensed **demo content payload**, not the publisher’s real page body.
- Publisher **Content Controls** and **Payouts** UI pages call endpoints that are not implemented yet.
- Demo endpoints (`/api/demo/*`) exist in code but are not mounted in the main backend router yet.
- License settings endpoint currently returns stub values and save is a no-op success response.

## 6) Next upgrades (top 5 by leverage)
1. Implement real DNS verification polling/challenge flow and remove bypass dependence.
2. Serve actual fetched/transformed publisher content (with content filters), not placeholder content.
3. Mount and production-gate `/api/demo/*` so demo console works consistently.
4. Implement backend routes for content controls and payouts used by existing UI pages.
5. Persist and enforce license settings beyond current stub responses.
