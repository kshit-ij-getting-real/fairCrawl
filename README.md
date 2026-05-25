# FairFetch

FairFetch is an early marketplace infrastructure product for licensed specialist research retrieval by AI agents.

## Product thesis
FairFetch is “AlphaSense for AI agents”: research providers list content, set license terms + retrieval pricing, and AI agents discover and retrieve high-quality external research with usage logs and receipts.

## Current MVP surfaces
- Public site: positioning, flow, and directory (`/`, `/how-it-works`, `/creators`, `/ai-teams`, `/directory`).
- Research provider dashboard: domains, pricing, transactions, controls.
- AI client dashboard: API keys, agent identity, usage/spend, test paid request flow.
- Backend APIs: auth, directory, policy, token mint/redeem, provider and AI client endpoints.

## Tech stack
- Frontend: Next.js + TypeScript + Tailwind.
- Backend: Express + TypeScript + Prisma.
- Database: PostgreSQL.

## Local setup
```bash
npm --prefix backend install
npm --prefix frontend install
cp .env.example .env
cp frontend/.env.example frontend/.env.local
npm --prefix backend run prisma:generate
npm --prefix backend run prisma:migrate
npm --prefix backend run seed
```

## Environment variables
### Backend (`.env`)
- `DATABASE_URL`
- `JWT_SECRET`
- `FAIRFETCH_TOKEN_SECRET`
- `PUBLISHER_LOG_INGEST_TOKEN`
- `CORS_ORIGINS`
- `MVP_BYPASS_VERIFICATION`
- `PORT` (optional)

### Frontend (`frontend/.env.local`)
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_DEMO_MODE` (optional)
- `NEXT_PUBLIC_DEMO_FALLBACK` (optional)

## Seed / demo credentials
Run:
```bash
npm --prefix backend run seed
```

Seeded users:
- Research provider: `publisher+demo@stack.com` / `asd@123`
- AI client: `fra@gmail.com` / `dra@123`

Seeded marketplace demo data:
- Provider org: `Stack Research Demo`
- AI client org: `FairFetch Agent Demo Client`
- Verified domain: `stack-research.demo`
- Licenses: `SUMMARY`, `DISPLAY`
- Pricing rules:
  - `/equity/iex` SUMMARY `150000` micros
  - `/market-intelligence` SUMMARY `250000` micros
  - `/pharma/glp-1` DISPLAY `400000` micros

## Deployment notes (Render + Vercel)
- Render (backend): set backend env vars, run `npm run build`, and start with migrations.
- Vercel (frontend): set `NEXT_PUBLIC_API_BASE_URL` to your Render backend URL.
- Keep secrets in platform env settings only; do not commit secrets.

## Smoke test checklist
1. Run backend seed and sign in with both demo accounts.
2. Confirm `stack-research.demo` appears verified in provider dashboard.
3. Confirm pricing rules for `/equity/iex`, `/market-intelligence`, `/pharma/glp-1` exist.
4. Create/review AI client API key.
5. Mint token and retrieve licensed content through API flow.
6. Verify transactions/logs appear in both provider and AI client dashboards.
