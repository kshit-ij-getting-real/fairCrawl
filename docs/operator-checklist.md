# Investor Demo Operator Checklist

## Repo coverage status
- `fairFetch`: ✅ updated in this workspace.
- `fairfetch-publisher-macro-notes`: ⚠️ not present in the provided filesystem; apply the same env/deploy checklist below when available.
- `fairfetch-agent-research-console`: ⚠️ not present in the provided filesystem; apply the same env/deploy checklist below when available.

## Deploy targets and runtime variables

### Render backend
- Service URL: `https://fairfetch.onrender.com`
- Required:
  - `DATABASE_URL`
  - `JWT_SECRET`
- Recommended:
  - `FAIRFETCH_TOKEN_SECRET`
  - `CORS_ORIGINS` (include Vercel domain)
  - `MVP_BYPASS_VERIFICATION`
  - `DEMO_MODE`, `DEMO_SECRET` (demo-only)

### Vercel frontend
- App URL: `https://fair-fetch.vercel.app`
- Required:
  - `NEXT_PUBLIC_API_BASE_URL=https://fairfetch.onrender.com`
- Optional:
  - `NEXT_PUBLIC_DEMO_SECRET` (must match backend `DEMO_SECRET` when demo mode is used)

### Runtime env verification
- Backend URL variable is `NEXT_PUBLIC_API_BASE_URL`.
- SSR fallback backend URL is `https://fairfetch.onrender.com` when the variable is missing.
- No `DEFAULT_RESEARCH_URL` runtime env var exists in this repo today.

## Smoke-test script (live endpoints)
1. Publisher login:
   - `https://fair-fetch.vercel.app/login`
2. Publisher config:
   - `https://fair-fetch.vercel.app/publisher/domains`
   - `https://fair-fetch.vercel.app/publisher/pricing`
3. AI client setup:
   - `https://fair-fetch.vercel.app/aiclient/dashboard`
4. Mint token:
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
5. Redeem token:
   ```bash
   curl "https://fairfetch.onrender.com/api/content?url=https%3A%2F%2Fai-essays.vercel.app%2Fpremium%2Fdemo-article" \
     -H "x-fairfetch-token: <SPEND_TOKEN>"
   ```
6. Confirm transaction UIs:
   - `https://fair-fetch.vercel.app/publisher/transactions`
   - `https://fair-fetch.vercel.app/aiclient/dashboard`

## Credentials and seeded demo data
- Publisher user: `publisher@fairfetch.local` / `password123`
- AI client user: `client@fairfetch.local` / `password123`
- Seeded domain: `news.local`
- Seeded licenses: `SUMMARY`, `DISPLAY`
- Seeded rules: `/premium` pricing rules for both licenses

## Fallback plan during live demo
- If frontend is unavailable: run API-only curl demo against Render to prove token mint + content redemption.
- If backend is unavailable: switch to local stack (`docker compose`, migrate, seed, local backend/frontend) and run same flow.
- If auth UI flow is unstable: use pre-generated API key and continue with mint/redeem to demonstrate core paid lane.
