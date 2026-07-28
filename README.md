# FairFetch

FairFetch is the transaction and trust layer for AI agents retrieving paid specialist research.

## Product thesis
Enterprise AI agents can search public information, but they cannot efficiently procure research outside their existing subscriptions. FairFetch lets agents discover specialist sources, resolve machine-use rights, pay for a permitted retrieval, return a cited answer, and create a shared buyer/provider receipt.

The initial wedge is Indian energy, infrastructure, mobility, and industrial research. The first proof is one paid, cited retrieval. The long-term goal is a standard rights and settlement network for machine-consumed knowledge.

## Current MVP surfaces
- Public site: buyer-first positioning and a recordable transaction room (`/`, `/how-it-works`, `/creators`, `/ai-teams`).
- Public pilot API: live Next.js route handlers for metadata search and bounded retrieval.
- Research provider dashboard: domains, pricing, transactions, controls.
- AI client dashboard: API keys, agent identity, usage/spend, test paid request flow.
- Backend APIs: auth, directory, policy, token mint/redeem, provider and AI client endpoints.

## Recordable product walkthrough
The homepage transaction room makes real calls to:

- `POST /api/v1/pilot/search`
- `POST /api/v1/pilot/retrieve`

The flow starts with one licensed private document and an identified agent holding 100 credits. It searches metadata, authorises a five-credit answer-only retrieval, returns a bounded cited answer without exposing the raw PDF, reduces the visible balance to 95 credits, and records a four-credit provider settlement plus a one-credit FairFetch fee.

The public pilot is deliberately honest: the document, provider, credits, and economics are illustrative, and the receipt uses an ephemeral in-memory pilot ledger. It does not claim persistent accounting, a real payment, or production document licensing. See [`docs/FUNDRAISING_MVP_GAP_ANALYSIS.md`](docs/FUNDRAISING_MVP_GAP_ANALYSIS.md) for the audited path to a first customer pilot.

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

## Public pilot smoke test
1. Open `/` and scroll to the transaction room.
2. Confirm the licensed supply and activate the agent.
3. Search the illustrative IEX research question.
4. Pay five credits and retrieve the bounded answer.
5. Confirm the receipt shows 95 remaining credits, four provider credits, one FairFetch credit, one licensed citation, and no raw-source access.

## Existing backend smoke test
1. Run the backend seed and sign in with both demo accounts.
2. Confirm `stack-research.demo` appears verified in the provider dashboard.
3. Create or review an AI client API key.
4. Mint a token and retrieve licensed content through the legacy API flow.
5. Verify transactions and logs appear in both dashboards.
