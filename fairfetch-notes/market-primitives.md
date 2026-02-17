# FairFetch Notes

## Changelog
### 2026-02-16
- Refreshed notes to reflect the current gateway + tokenized-subdomain architecture.
- Documented backend and frontend responsibilities by layer.
- Added local-access runbook for developers (services, URLs, and smoke checks).
- Updated market primitives to align with ledger-backed monetization.

### 2026-01-05
- Initialized `market-primitives.md` with required section order.
- Added starter goals, principles, and primitives to guide initial market modeling.
- Listed immediate actions to gather real inputs and validate assumptions.
- Documented licensing risk with explicit AGPL implications.
- Added open questions to capture unknowns instead of overwriting plans.

## Goal
- Operate FairFetch as a reliable licensed-content exchange between publishers and AI clients.
- Keep pricing, token spending, and billing events deterministic and auditable.
- Maintain a single internal reference for architecture + local developer workflows.

## System Architecture (current)

### 1) Control plane (identity + onboarding)
- **Auth layer**: email/password signup/login with JWT sessions and strict roles (`PUBLISHER`, `AICLIENT`).
- **Publisher onboarding**: publishers add domains, fetch DNS TXT verification tokens, and verify ownership before monetization.
- **Developer onboarding**: AI clients issue/revoke API keys and configure agent identity/user-agent constraints.

### 2) Pricing and policy plane
- Domain-level pricing rules support ordered scopes:
  1. `BOT`
  2. `PAGE`
  3. `KEYWORD`
  4. `FRESHNESS`
  5. `DIRECTORY` / `GLOBAL`
- Content filters can block paths by regex/prefix policy.
- Failure mode is deterministic (`UNPRICED`, `MAX_PRICE_EXCEEDED`, etc.) with request IDs.

### 3) Execution plane (content access)
- **Gateway fetch**: AI client calls `/api/gateway/fetch` with API key; system resolves price, extracts content, and writes ledger transaction.
- **Tokenized spend**: AI client mints token from `/api/token`, then spends once on `fairfetch.<publisher-domain>/<path>`.
- Host-rewrite middleware enables local subdomain simulation by converting `fairfetch.*` host traffic into `/api/fairfetch/*` handlers.

### 4) Settlement and analytics plane
- `LedgerTransaction` stores immutable billing events for both gateway and token spend sources.
- Publisher dashboard exposes transaction history with filters.
- AI client dashboard exposes spend trends by domain and by day.

## Principles
- Prefer deterministic pricing and error semantics over implicit fallback behavior.
- Enforce publisher control first: verified domains + explicit pricing + explicit filters.
- Keep monetization events auditable (idempotent ledger writes where applicable).
- Keep local developer setup simple: one Postgres container, one backend process, one frontend process.

## Primitives (Operate)
- **Domain trust primitive**: DNS TXT verification must gate paid content serving.
- **Price resolution primitive**: rule precedence is stable and testable.
- **Token integrity primitive**: token spend validates org, host/path, user-agent, signature, expiry, and one-time spend status.
- **Ledger primitive**: every paid content response emits one billing event with publisher and platform fee split.

## Primitives (Market Layer)
- **Publisher supply primitive**: each verified domain can publish granular licensing prices.
- **Buyer demand primitive**: AI teams signal demand via gateway fetches and token mints.
- **Matching primitive**: rule engine computes payable price based on URL/path/UA/license context.
- **Reporting primitive**: both sides can inspect usage + spend outcomes through dashboards.

## Priorities (Now / Next / Later)
- **Now**
  - Stabilize end-to-end local dev workflow documentation.
  - Harden deterministic error catalog across gateway and token flows.
  - Add seeded demo data scripts for faster onboarding.
- **Next**
  - Expand pricing scopes (`KEYWORD`, `FRESHNESS`) with full evaluator logic and UI support.
  - Add richer transaction exports for publisher accounting.
- **Later**
  - Add payout automation rails and reconciliation tooling.
  - Add enterprise controls for key scopes, quotas, and policy automation.

## Local Access Runbook

### Services and ports
- Frontend (Next.js): `http://localhost:3000`
- Backend API (Express): `http://localhost:4000`
- PostgreSQL: `localhost:5432`

### One-time setup
```bash
cp .env.example .env
cp frontend/.env.example frontend/.env.local
```

Set in `.env`:
```dotenv
DATABASE_URL=postgresql://fairfetch:fairfetch@localhost:5432/fairfetch
JWT_SECRET=<long-random-string>
FAIRFETCH_TOKEN_SECRET=<long-random-string>
PORT=4000
```

Set in `frontend/.env.local`:
```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

### Start stack locally
```bash
docker-compose up -d
cd backend && npm install && npx prisma migrate dev && npm run dev
cd frontend && npm install && npm run dev
```

### Local URLs to access everything
- Home/marketing: `http://localhost:3000`
- Signup: `http://localhost:3000/signup`
- Login: `http://localhost:3000/login`
- Publisher dashboard: `http://localhost:3000/publisher/dashboard`
- AI client dashboard: `http://localhost:3000/aiclient/dashboard`
- Backend health: `http://localhost:4000/api/health`

### Token spend local simulation
Use host header override to simulate `fairfetch.<publisher-domain>` routing:
```bash
curl "http://localhost:4000/news/1" \
  -H "Host: fairfetch.example.com" \
  -H "Fairfetch-Org-Id: 1" \
  -H "Fairfetch-Token: <token>" \
  -H "User-Agent: my-bot/1.0"
```

## Risks (Licensing / Security / Ops)
- **Licensing**
  - Revalidate AGPL compatibility before integrating any AGPL components into deployed services.
- **Security**
  - API keys and signing secrets are high-impact credentials; enforce rotation and secret-manager storage in non-local environments.
  - User-agent and token checks reduce replay risk but should be layered with rate limiting.
- **Ops**
  - DNS verification can block publisher onboarding; maintain clear troubleshooting docs.
  - Origin fetch reliability impacts response times; define timeout/retry strategy per source.

## Open Questions
- Should token TTL remain short-lived (120s) or become policy-configurable per client/domain?
- What payout cadence and threshold model should drive publisher settlement?
- Should agent identity constraints become mandatory for all API key usage?
- Which analytics dimensions are most valuable next (license type, endpoint source, matched rule)?

## References (links + 1-line why it matters)
- `README.md` — Canonical project onboarding and API/local-run documentation.
- `backend/prisma/schema.prisma` — Source of truth for market, pricing, token, and ledger data models.
- `backend/src/routes/gateway.ts` — Gateway fetch, token minting, and token spend handler logic.
- `backend/src/routes/publisher.ts` — Publisher onboarding, DNS verification, pricing, and transactions APIs.
- `backend/src/routes/aiclient.ts` — API key, agent identity, and usage/spend APIs.
