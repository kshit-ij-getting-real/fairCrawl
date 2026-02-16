# FairFetch

FairFetch is a two-sided marketplace where publishers monetize licensed content access for AI teams. The platform supports direct gateway fetches and a tokenized, publisher-subdomain spend flow inspired by TollBit.

## Current architecture

### Monorepo layout
- `backend/`: Express + Prisma API for auth, pricing, token minting/spending, and reporting.
- `frontend/`: Next.js dashboard/UI for publishers and AI clients.
- `fairfetch-notes/`: product and market notes.
- `docker-compose.yml`: local Postgres service for development.

### Backend (Express + Prisma)
Core API entrypoint: `backend/src/index.ts`.

#### Auth + role model
- `POST /api/auth/signup` creates users as either `PUBLISHER` or `AICLIENT`.
- `POST /api/auth/login` returns JWTs used by protected dashboard endpoints.
- Protected route groups:
  - `/api/publisher/*` (publisher role)
  - `/api/aiclient/*` and `/api/client/*` (AI client role alias)

#### Publisher APIs
- Domain onboarding (`POST /api/publisher/domains`)
- DNS token retrieval (`GET /api/publisher/domains/:domainId/verification-token`)
- DNS verification (`POST /api/publisher/domains/:domainId/verify-dns`)
- Pricing rules CRUD (`GET/POST /api/publisher/domains/:domainId/pricing-rules`)
- Transaction reporting (`GET /api/publisher/transactions`)

#### AI client APIs
- API key lifecycle (`GET/POST /api/aiclient/apikeys`, revoke endpoint)
- Agent identity/user-agent controls (`GET/POST /api/aiclient/agents`)
- Usage + spend breakdown (`GET /api/aiclient/usage-spend`)

#### Content monetization APIs

1) **Gateway fetch path**

`GET /api/gateway/fetch?url=<origin_url>&license_type=<summary|display>&format=<markdown|json>&max_price_micros=<int>`

Headers:
- `X-API-Key: <developer key>`
- optional `X-Request-Id`

Behavior:
- Validates API key.
- Canonicalizes URL.
- Resolves pricing deterministically from rule precedence.
- Fetches and extracts origin content.
- Writes idempotent ledger transaction.
- Returns content + metadata + transaction totals.

2) **Tokenized subdomain spend path**

Step A: mint short-lived token

`POST /api/token`

Headers:
- `X-API-Key: <developer key>`

Body:
```json
{
  "url": "https://publisher.com/article",
  "license_type": "display",
  "user_agent": "my-bot/1.0",
  "format": "markdown",
  "max_price_micros": 500000
}
```

Step B: spend token against publisher subdomain

`GET https://fairfetch.<publisher-domain>/<path>`

Headers:
- `Fairfetch-Org-Id: <developer org id>`
- `Fairfetch-Token: <minted token>`
- `User-Agent: <same UA used during mint>`

Backend host rewrite middleware maps incoming `fairfetch.*` host requests to `/api/fairfetch/*`.

### Deterministic pricing precedence
1. `BOT` (user-agent regex)
2. `PAGE` (exact URL/path)
3. `KEYWORD` (schema-ready)
4. `FRESHNESS` (schema-ready)
5. `DIRECTORY` / `GLOBAL` (longest prefix for directories)

If no rule matches, APIs return a deterministic `403 UNPRICED` payload.

### Persistence model highlights
Prisma schema tracks:
- user/role entities (`User`, `Publisher`, `AIClient`)
- monetization configuration (`Domain`, `PricingRule`, `ContentFilter`)
- key/token auth artifacts (`APIKey`, `SpendToken`, `AgentIdentity`)
- billing/usage records (`LedgerTransaction`, `UsageAggregate`, `RequestLog`)

### Frontend (Next.js)
Primary app routes:
- `/login`, `/signup`
- `/publisher/dashboard`: domain onboarding, DNS verification, pricing rules, transactions
- `/aiclient/dashboard`: API keys, agent identity, usage/spend insights

Frontend API base URL is centralized via `NEXT_PUBLIC_API_BASE_URL`.

---

## Run everything locally

### 1) Prerequisites
- Node.js 18+
- npm
- Docker (or compatible container runtime)

### 2) Configure environment variables
From repo root:

```bash
cp .env.example .env
```

Recommended `.env` values:

```dotenv
DATABASE_URL=postgresql://fairmarket:fairmarket@localhost:5432/fairmarket
JWT_SECRET=replace-with-a-long-random-secret
FAIRFETCH_TOKEN_SECRET=replace-with-another-long-random-secret
PORT=4000
```

For frontend:

```bash
cp frontend/.env.example frontend/.env.local
```

`frontend/.env.local` should include:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

### 3) Start Postgres

```bash
docker-compose up -d
```

### 4) Install + start backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

Backend runs at: `http://localhost:4000`

Health check:

```bash
curl http://localhost:4000/api/health
```

### 5) Install + start frontend
In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

### 6) Access points locally
- Marketing pages: `http://localhost:3000`
- Signup/login: `http://localhost:3000/signup`, `http://localhost:3000/login`
- Publisher dashboard: `http://localhost:3000/publisher/dashboard`
- AI client dashboard: `http://localhost:3000/aiclient/dashboard`
- Backend API base: `http://localhost:4000/api`

---

## Local API smoke examples

### Signup / Login

```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{"email":"pub@example.com","password":"Pass123!","role":"PUBLISHER","name":"Publisher One"}'
```

```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{"email":"ai@example.com","password":"Pass123!","role":"AICLIENT","name":"Agentic Labs"}'
```

### Gateway fetch

```bash
curl "http://localhost:4000/api/gateway/fetch?url=https://example.com/news/1&license_type=display&format=markdown&max_price_micros=500000" \
  -H "X-API-Key: YOUR_KEY" \
  -H "X-Request-Id: req-123"
```

### Mint token

```bash
curl -X POST "http://localhost:4000/api/token" \
  -H "X-API-Key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/news/1","license_type":"display","user_agent":"my-bot/1.0","format":"markdown","max_price_micros":500000}'
```

### Spend token (local host-header simulation)

```bash
curl "http://localhost:4000/news/1" \
  -H "Host: fairfetch.example.com" \
  -H "Fairfetch-Org-Id: 1" \
  -H "Fairfetch-Token: <token>" \
  -H "User-Agent: my-bot/1.0"
```
