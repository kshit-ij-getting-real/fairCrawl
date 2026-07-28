# FairFetch

FairFetch is the transaction and trust layer for AI agents retrieving paid specialist research.

## Product thesis
Enterprise AI agents can search public information, but they cannot efficiently procure research outside their existing subscriptions. FairFetch lets agents discover specialist sources, resolve machine-use rights, pay for a permitted retrieval, return a cited answer, and create a shared buyer/provider receipt.

The initial wedge is Indian energy, infrastructure, mobility, and industrial research. The first proof is one paid, cited retrieval. The long-term goal is a standard rights and settlement network for machine-consumed knowledge.

## Current MVP surfaces
- Public site: buyer-first positioning and a self-contained interactive transaction experience (`/`, `/how-it-works`, `/creators`, `/ai-teams`).
- Research provider dashboard: domains, pricing, transactions, controls.
- AI client dashboard: API keys, agent identity, usage/spend, test paid request flow.
- Backend APIs: auth, directory, policy, token mint/redeem, provider and AI client endpoints.

## Recordable product walkthrough
The homepage workspace is deterministic and does not depend on authentication or backend availability. It demonstrates:

1. An enterprise agent asking a research question.
2. FairFetch returning `ALLOWED`, `PAID`, and `BLOCKED` source decisions.
3. The agent purchasing a summary licence.
4. Identity, policy, payment, and delivery checks.
5. A cited answer and shared transaction receipt.
6. An illustrative provider payout and FairFetch fee.

All sources, answer content, and economics in the homepage workspace are clearly labelled as illustrative.

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
