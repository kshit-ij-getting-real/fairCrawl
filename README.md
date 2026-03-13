# FairFetch

FairFetch is a two-sided marketplace MVP where publishers define paid access rules for their domains and AI teams buy one-time spend tokens to fetch licensed content with auditable receipts.

## What is in this repo
- `frontend/` — Next.js application (marketing site + publisher dashboard + AI client dashboard).
- `backend/` — Express + Prisma API (auth, directory/policy endpoints, publisher + AI APIs, token mint/redeem gateway).
- `docs/` — operator/demo support docs.
- `DEMO_SCRIPT.md` — final presenter talk track for live demos.

## Product surfaces (all components)

### Public / marketing pages (`frontend/src/app`)
- `/` Home
- `/how-it-works`
- `/creators`
- `/ai-teams`
- `/directory`
- `/docs`
- `/about`
- `/vision`
- `/login`, `/signup`

### Publisher console (`/publisher/*`)
- `/publisher/dashboard` — overview metrics and onboarding state.
- `/publisher/domains` — add and verify domains.
- `/publisher/pricing` — create/update pricing rules by path + license.
- `/publisher/transactions` — paid redemption ledger view.
- `/publisher/controls` — content controls UI (backend support still partial).
- `/publisher/payouts` — payouts UI (backend support still partial).
- `/publisher/integrations` — integration guidance.
- `/publisher/demo` — demo helper page.

### AI client console (`/aiclient/*`)
- `/aiclient/dashboard` — high-level usage and spend overview.
- `/aiclient/api-keys` — create/revoke API keys.
- `/aiclient/agent-identity` — declare crawler identity and allowed User-Agent regex.
- `/aiclient/usage-spend` — daily and domain-level spend.
- `/aiclient/test-paid-request` — walkthrough UI for paid request flow.

## Backend capabilities

### Auth + access
- JWT auth for app sessions (`/api/auth/login`, `/api/auth/signup`).
- Role-protected dashboard routes:
  - `/api/publisher/*` for `PUBLISHER`
  - `/api/aiclient/*` and `/api/client/*` for `AICLIENT`

### Marketplace flow
- `POST /api/tokens` — mint spend token (via `x-api-key` or AI JWT).
- `GET /api/content?url=...` — redeem with `x-fairfetch-token`.
- `GET /api/public/domains` — verified-domain directory feed.
- `GET /api/ai-policy` — policy feed endpoint.
- `POST /api/publisher/domains/:domainId/logs` — store one domain log from request `userAgent` (static token in `x-publisher-log-token`).

### Health + ops
- `GET /api/health` checks API and database reachability.
- Request IDs are generated/propagated via `x-request-id`.

## Current MVP boundaries
- DNS verification is MVP/bypass-oriented (`MVP_BYPASS_VERIFICATION=true` is common for demos).
- `GET /api/content` currently returns licensed demo payload behavior, not full publisher-origin extraction.
- Publisher `controls` and `payouts` pages are present, but backend support is still partial.
- Demo routes exist in code under `backend/src/routes/demo.ts`, but are not mounted in the main app router.

## Local setup
```bash
npm --prefix backend ci
npm --prefix frontend ci
docker compose up -d
cp .env.example .env
cp frontend/.env.example frontend/.env.local
npm --prefix backend run prisma:migrate
npm --prefix backend run prisma:generate
npm --prefix backend run seed
```

### Backend `.env` keys
- `DATABASE_URL`
- `JWT_SECRET`
- `FAIRFETCH_TOKEN_SECRET`
- `PUBLISHER_LOG_INGEST_TOKEN` (required for `/api/publisher/domains/:domainId/logs`)
- `CORS_ORIGINS` (recommended)
- `MVP_BYPASS_VERIFICATION` (recommended for demo)
- `DEMO_MODE`, `DEMO_SECRET` (optional demo controls)
- `PORT` (optional)

### Frontend `.env.local` keys
- `NEXT_PUBLIC_API_BASE_URL` (required for deployed environments)
- `NEXT_PUBLIC_DEMO_SECRET` (optional; must match backend `DEMO_SECRET` for demo endpoints)
- `NEXT_PUBLIC_DEMO_MODE` (optional)
- `NEXT_PUBLIC_DEMO_FALLBACK` (`true` by default; set `false` for strict empty-state QA)

## Run locally
```bash
npm --prefix backend run dev
npm --prefix frontend run dev
```

## Build checks
```bash
npm --prefix backend run build
npm --prefix frontend run build
```

## Seeded demo users and data
After `npm --prefix backend run seed`:
- Publisher: `publisher@fairfetch.local` / `password123`
- AI client: `client@fairfetch.local` / `password123`
- Verified domain: `news.local`
- Licenses: `SUMMARY`, `DISPLAY`
- Pricing rules: `/premium` for both licenses

## Deployment (Render + Vercel)

### Backend on Render
Deploy from `backend/` as a Web Service.
- Build command: `npm ci && npm run prisma:generate && npm run build`
- Start command: `npm run prisma:migrate && npm start`

Required:
- `DATABASE_URL`
- `JWT_SECRET`

Recommended:
- `FAIRFETCH_TOKEN_SECRET`
- `CORS_ORIGINS`
- `MVP_BYPASS_VERIFICATION`
- `DEMO_MODE`, `DEMO_SECRET` (if demo features are used)

### Frontend on Vercel
Deploy from `frontend/` as a Next.js app.

Required:
- `NEXT_PUBLIC_API_BASE_URL=https://fairfetch.onrender.com` (or your backend URL)

Optional:
- `NEXT_PUBLIC_DEMO_SECRET`
- `NEXT_PUBLIC_DEMO_FALLBACK`
- `NEXT_PUBLIC_DEMO_MODE`

## Live smoke test (canonical demo endpoints)
- Frontend: `https://fair-fetch.vercel.app`
- Backend: `https://fairfetch.onrender.com`

1) Log in as publisher and confirm domain + pricing.
2) Log in as AI client and generate API key.
3) Mint token:

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

4) Redeem content:

```bash
curl "https://fairfetch.onrender.com/api/content?url=https%3A%2F%2Fai-essays.vercel.app%2Fpremium%2Fdemo-article" \
  -H "x-fairfetch-token: <SPEND_TOKEN>"
```

5) Verify transaction visibility in:
- `/publisher/transactions`
- `/aiclient/dashboard`

## Final demo script
Use `DEMO_SCRIPT.md` for the latest outside-in walkthrough, role-based talk track, and close.


