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
- npm 9+
- Docker (or compatible container runtime)

### 2) Configure environment variables
From repo root:

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env.local
```

Recommended `.env` values for local development:

```dotenv
DATABASE_URL=postgresql://fairmarket:fairmarket@localhost:5432/fairmarket
JWT_SECRET=replace-with-a-long-random-secret
FAIRFETCH_TOKEN_SECRET=replace-with-another-long-random-secret
PORT=4000
```

`frontend/.env.local` should include:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

> `FAIRFETCH_TOKEN_SECRET` currently falls back to `dev-secret` if unset, but you should always set it explicitly in production.

### 3) Start Postgres

```bash
docker compose up -d
```

### 4) Install dependencies

```bash
npm --prefix backend install
npm --prefix frontend install
```

### 5) Run database migrations

```bash
npm --prefix backend run prisma:migrate
```

### 6) Start backend + frontend
In separate terminals:

```bash
npm --prefix backend run dev
npm --prefix frontend run dev
```

### 7) Local access points
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000/api`
- Health check: `http://localhost:4000/api/health`

---

## Production setup (current toolchain: Render + Vercel)

This repo is structured to deploy as **two services**:
- **Backend API on Render** (root directory `backend`)
- **Frontend on Vercel** (root directory `frontend`)

If the website is “not being hosted according to plan”, it is usually one of these issues:
1. Frontend deployed without `NEXT_PUBLIC_API_BASE_URL` pointing to Render.
2. Backend deployed without required env vars (`DATABASE_URL`, `JWT_SECRET`, `FAIRFETCH_TOKEN_SECRET`).
3. DNS/domain records point at the wrong provider.
4. Database migrations were not applied in production.

### A) Deploy backend on Render

1. Create a new **Web Service** from this repo.
2. Set **Root Directory** to `backend`.
3. Build command:
   ```bash
   npm install && npm run build
   ```
4. Start command:
   ```bash
   npm run start
   ```
5. Add environment variables in Render:
   - `DATABASE_URL` (Render Postgres or external Postgres)
   - `JWT_SECRET`
   - `FAIRFETCH_TOKEN_SECRET`
   - `PORT` (Render usually injects this automatically)

After each Prisma schema change, run migrations against production DB:

```bash
cd backend
npx prisma migrate deploy
```

Verify backend:

```bash
curl https://<your-render-service>/api/health
```

### B) Deploy frontend on Vercel

1. Create a Vercel project from this repo.
2. Set **Root Directory** to `frontend`.
3. Build command (default):
   ```bash
   npm run build
   ```
4. Add environment variable:
   - `NEXT_PUBLIC_API_BASE_URL=https://<your-render-service>`

Redeploy frontend whenever backend domain changes.

### C) Domain and DNS checklist (important)

If you are using a custom domain, split traffic by responsibility:

- `app.<your-domain>` (or apex site) -> **Vercel frontend**
- `api.<your-domain>` -> **Render backend**

Then set:

```dotenv
NEXT_PUBLIC_API_BASE_URL=https://api.<your-domain>
```

For the tokenized host flow, requests like `https://fairfetch.<publisher-domain>/<path>` must reach the backend service because host-based rewrite happens in Express middleware. If that hostname points to Vercel, token spend routes will fail.

### D) Production readiness checklist

- [ ] Render backend healthy at `/api/health`
- [ ] Vercel frontend builds successfully
- [ ] Frontend env uses the Render/API domain
- [ ] Backend env includes `DATABASE_URL`, `JWT_SECRET`, `FAIRFETCH_TOKEN_SECRET`
- [ ] `prisma migrate deploy` has run on production DB
- [ ] DNS records point frontend hostnames to Vercel and API/token hosts to Render

### E) One-command local restart flow

```bash
docker compose up -d
npm --prefix backend run prisma:migrate
npm --prefix backend run dev
npm --prefix frontend run dev
```

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
