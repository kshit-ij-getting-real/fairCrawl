# FairFetch

FairFetch is an opt-in marketplace for paid access to paywalled content.

## Repo layout
- `backend/` Express + Prisma API
- `frontend/` Next.js app (marketing, dashboard, docs)

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

Backend `.env` keys:
- `DATABASE_URL`
- `JWT_SECRET`
- `FAIRFETCH_TOKEN_SECRET`
- `PORT` (optional)

## Run
```bash
npm --prefix backend run dev
npm --prefix frontend run dev
```

## Build checks
```bash
npm --prefix backend run build
npm --prefix frontend run build
```

## Deployment (Render + Vercel)

### Backend (`backend/`) on Render
Deploy as a **Web Service** from this repo root with service root set to `backend/`.

- Build command: `npm ci && npm run prisma:generate && npm run build`
- Start command: `npm run prisma:migrate && npm start`

Required env vars (Render):
- `DATABASE_URL`
- `JWT_SECRET`

Recommended env vars (Render):
- `FAIRFETCH_TOKEN_SECRET` (set in production; code falls back to `dev-secret` only for local/dev)
- `CORS_ORIGINS` (include your Vercel domain)
- `MVP_BYPASS_VERIFICATION` (`true` for demo ease, `false` for stricter behavior)
- `DEMO_MODE`, `DEMO_SECRET` (only if using Demo Console endpoints)

### Frontend (`frontend/`) on Vercel
Deploy as a **Next.js** app with root set to `frontend/`.

Required env vars (Vercel):
- `NEXT_PUBLIC_API_BASE_URL` = your Render backend URL (example: `https://fairfetch.onrender.com`)

Optional env vars (Vercel):
- `NEXT_PUBLIC_DEMO_SECRET` (must match backend `DEMO_SECRET` if demo console features are used)

### Runtime env var verification (backend URL / research URL)
- Frontend runtime API base URL resolves from `NEXT_PUBLIC_API_BASE_URL`.
- If missing during SSR, frontend falls back to `https://fairfetch.onrender.com`.
- There is currently **no runtime `DEFAULT_RESEARCH_URL` / research backend env var** in this repo; any “research” text shown in UI is static copy.

## Live smoke test flow (investor demo runbook)

Canonical live URLs:
- Frontend: `https://fair-fetch.vercel.app`
- Backend: `https://fairfetch.onrender.com`

Smoke test steps:
1. Log in as publisher and verify domain/rate setup in `/publisher/domains` and `/publisher/pricing`.
2. Log in as AI client and generate API key in `/aiclient/dashboard`.
3. Mint spend token:

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

4. Redeem content:

   ```bash
   curl "https://fairfetch.onrender.com/api/content?url=https%3A%2F%2Fai-essays.vercel.app%2Fpremium%2Fdemo-article" \
     -H "x-fairfetch-token: <SPEND_TOKEN>"
   ```

5. Confirm transaction appears in:
   - Publisher: `/publisher/transactions`
   - AI client: `/aiclient/dashboard`

## Paid lane flow
1. Publisher creates property and rates.
2. AI client calls `GET /api/rates?url=...`.
3. AI client mints token with `POST /api/tokens`.
4. AI client fetches content with `GET /api/content?url=...` and `x-fairfetch-token`.
5. Transaction is visible at `GET /api/publisher/transactions` and `GET /api/aiclient/transactions`.

## Seed data
The seed script creates:
- 1 publisher user
- 1 AI client user
- 1 verified property
- 2 licenses
- 2 rates

Run:
```bash
npm --prefix backend run seed
```


## Demo quickstart
Set these env vars for demo-only controls:
- Backend: `DEMO_MODE=true`, `DEMO_SECRET=your-secret`
- Frontend: `NEXT_PUBLIC_DEMO_SECRET=your-secret`

Then use **Publisher Dashboard → Demo Console**:
1. Seed demo workspace.
2. Simulate transaction.
3. Review Transactions and AI Team usage updates.

## Operator checklist (demo-day)

### Credentials / demo accounts
- Seed publisher login: `publisher@fairfetch.local` / `password123`
- Seed AI client login: `client@fairfetch.local` / `password123`

### Seeded demo data expectations
- Verified domain: `news.local`
- Licenses: `SUMMARY`, `DISPLAY`
- Pricing rules on `/premium` path

### Fallback plan if one service is unavailable
- If **Vercel frontend** is down: run API-only demo via curl (`/api/tokens` + `/api/content`) and narrate transaction semantics.
- If **Render backend** is down: switch to local demo environment (`docker compose up -d`, migrations, seed, local frontend/backend).
- If auth/login is degraded: use pre-generated API key + token mint/redeem steps to prove the paid lane independently of UI session state.

## Recent frontend UI consistency updates
- Header auth actions are now session-aware across the app (unauthenticated users see **Log in / Get started**; authenticated users see an account chip, **Dashboard**, and **Logout**).
- Logged-in dashboard actions now reuse the same shared button variants used on exterior marketing pages for consistent primary/secondary styling.
