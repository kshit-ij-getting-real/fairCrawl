# TECHNICAL

## 1) Architecture
- Frontend: Next.js app (`frontend/`) deployed to Vercel.
- Backend: Express + Prisma API (`backend/`) deployed to Render.
- Data store: PostgreSQL via Prisma models.
- Auth split:
  - App sessions: JWT Bearer (`Authorization: Bearer <jwt>`)
  - Marketplace token minting: API key (`x-api-key`) or AI JWT
  - Content redemption: spend token (`x-fairfetch-token`)

```text
Browser (Next.js on Vercel)
  -> /api/* HTTP
Express API (Render)
  -> Prisma Client
PostgreSQL
```

## 2) Repo map (key paths)
- `backend/src/app.ts` - Express app, middleware, route mounting.
- `backend/src/routes/*.ts` - Auth, publisher, AI client, policy, gateway, demo routes.
- `backend/prisma/schema.prisma` - DB schema.
- `frontend/src/app/login`, `signup` - auth entry pages.
- `frontend/src/app/publisher/*` - publisher dashboard pages.
- `frontend/src/app/aiclient/dashboard` - AI dashboard.
- `frontend/src/app/directory` - public directory page.
- `frontend/src/lib/http.ts` - API client wrapper with JWT + demo headers.

## 3) Auth model (exact headers)
- **JWT auth** (publisher + AI dashboard APIs):
  - Header: `Authorization: Bearer <jwt>`
  - JWT issued by `/api/auth/login` or `/api/auth/signup`
- **AI token minting auth** (`POST /api/tokens`):
  - `x-api-key: <plain key>` **or** `Authorization: Bearer <ai-jwt>`
- **Spend token auth** (`GET /api/content`):
  - `x-fairfetch-token: <spend token>`

## 4) Database model map (major Prisma models)
- `User`: login identity + role (`PUBLISHER` or `AICLIENT`).
- `Publisher`: publisher profile linked to user.
- `AIClient`: AI team profile linked to user.
- `Domain`: publisher-owned domain + verification fields.
- `PricingRule`: path/license price rules used by token minting.
- `License`: domain license definitions (`SUMMARY`, `DISPLAY`).
- `APIKey`: hashed AI API keys for token minting auth.
- `AgentIdentity`: per-client `agentId` + allowed user-agent regex.
- `SpendToken`: one-time token minted before content access.
- `LedgerTransaction`: immutable spend/settlement record.
- `RequestLog`: content request log row written on redemption.
- `AIPolicy`: public policy records returned by policy endpoints.

## 5) API inventory

### Auth
| Method | Path | Auth | Purpose | Writes (tables) |
|---|---|---|---|---|
| POST | `/api/auth/signup` | None | Create user + role profile | `User`, `Publisher`/`AIClient`, balance table |
| POST | `/api/auth/login` | None | Return JWT | None |

### Publisher
| Method | Path | Auth | Purpose | Writes (tables) |
|---|---|---|---|---|
| GET | `/api/publisher/domains` | Publisher JWT | List publisher domains | None |
| POST | `/api/publisher/domains` | Publisher JWT | Create domain | `Domain` |
| POST | `/api/publisher/domains/:id/verify-dns` | Publisher JWT | Mark verified only in bypass mode | `Domain` (bypass only) |
| GET | `/api/publisher/domains/:domainId/pricing-rules` | Publisher JWT | List domain rules | None |
| POST | `/api/publisher/domains/:domainId/pricing-rules` | Publisher JWT | Create domain rule | `PricingRule` |
| GET | `/api/publisher/pricing-rules` | Publisher JWT | List all publisher rules | None |
| POST | `/api/publisher/pricing-rules` | Publisher JWT | Create rule by body domainId | `PricingRule` |
| DELETE | `/api/publisher/pricing-rules/:ruleId` | Publisher JWT | Delete rule | `PricingRule` |
| POST | `/api/publisher/pricing-rules/:id/activate` | Publisher JWT | Enable rule | `PricingRule` |
| GET | `/api/publisher/transactions` | Publisher JWT | List transaction feed | None |
| GET | `/api/publisher/overview` | Publisher JWT | KPI + recent tx summary | None |
| GET | `/api/publisher/license-settings` | Publisher JWT | Stubbed license settings | None |
| POST | `/api/publisher/license-settings` | Publisher JWT | Stubbed save | None |
| GET | `/api/publisher/transactions/export` | Publisher JWT | Stubbed CSV header response | None |

### AI Client
| Method | Path | Auth | Purpose | Writes (tables) |
|---|---|---|---|---|
| GET | `/api/aiclient/me` | AI JWT | Get AI client profile | None |
| GET | `/api/aiclient/apikeys` | AI JWT | List keys (masked) | None |
| POST | `/api/aiclient/apikeys` | AI JWT | Create API key | `APIKey` |
| DELETE | `/api/aiclient/apikeys/:id` | AI JWT | Revoke key | `APIKey` |
| POST | `/api/aiclient/apikeys/:id/revoke` | AI JWT | Revoke key (alt) | `APIKey` |
| GET | `/api/aiclient/identity` | AI JWT | Get latest identity | None |
| POST | `/api/aiclient/identity` | AI JWT | Upsert identity | `AgentIdentity` |
| GET | `/api/aiclient/usage/by-domain` | AI JWT | Spend grouped by domain | None |
| GET | `/api/aiclient/usage/by-day` | AI JWT | Spend grouped by day | None |
| GET | `/api/aiclient/usage-spend` | AI JWT | Combined usage payload | None |
| GET | `/api/aiclient/agents` | AI JWT | List identities | None |
| POST | `/api/aiclient/agents` | AI JWT | Upsert identity (alt) | `AgentIdentity` |

### Marketplace flow + public
| Method | Path | Auth | Purpose | Writes (tables) |
|---|---|---|---|---|
| POST | `/api/tokens` | `x-api-key` or AI JWT | Mint spend token for URL/license | `SpendToken` |
| GET | `/api/content` | `x-fairfetch-token` | Redeem token, return content + receipt | `SpendToken`, `RequestLog`, `LedgerTransaction` |
| GET | `/api/public/domains` | None | Directory data for verified domains | None |
| GET | `/api/ai-policy?domain=` | None | Public policy for a domain | None |
| GET | `/api/health` | None | API + DB health | None |

## 6) Frontend page map (demo-relevant)
- `/login` -> login form -> `POST /api/auth/login`
- `/signup` -> signup form -> `POST /api/auth/signup`
- `/publisher/domains` -> domain onboarding -> `GET/POST /api/publisher/domains`, `POST /api/publisher/domains/:id/verify-dns`
- `/publisher/pricing` -> pricing + license UI -> publisher pricing-rules + license-settings endpoints
- `/publisher/transactions` -> transaction list/export -> `GET /api/publisher/transactions`, `GET /api/publisher/transactions/export`
- `/aiclient/dashboard` -> keys, identity, usage, test request -> AI endpoints + `/api/tokens` + `/api/content`
- `/directory` -> public verified domains -> `GET /api/public/domains`

## 7) Config / env vars (placeholders)
Backend (`backend/.env`):
- `DATABASE_URL=<postgres-connection-string>`
- `JWT_SECRET=<jwt-signing-secret>`
- `PORT=<optional-port>`
- `CORS_ORIGINS=<comma-separated-origins>`
- `MVP_BYPASS_VERIFICATION=<true|false>`
- `DEMO_MODE=<true|false>`
- `DEMO_SECRET=<demo-shared-secret>`

Frontend (`frontend/.env.local`):
- `NEXT_PUBLIC_API_BASE_URL=<backend-base-url>`
- `NEXT_PUBLIC_DEMO_SECRET=<optional-demo-secret>`

## 8) Local dev (short commands)
From repo root:

```bash
npm --prefix backend ci
npm --prefix frontend ci
docker compose up -d
npm --prefix backend run prisma:migrate
npm --prefix backend run prisma:generate
npm --prefix backend run seed
npm --prefix backend run dev
npm --prefix frontend run dev
```

Point frontend to backend by setting `frontend/.env.local`:
`NEXT_PUBLIC_API_BASE_URL=http://localhost:4000`

## 9) Known limitations (true today)
- Demo router file exists (`backend/src/routes/demo.ts`) but is not mounted in `backend/src/app.ts`.
- Publisher dashboard has UI pages for content controls and payouts, but matching backend routes are missing.
- Domain verification endpoint only flips to verified in bypass mode; full DNS verification flow is not implemented.
- Content response is static demo payload with receipt, not fetched page content.
- `license-settings` and transaction CSV export endpoints are stubbed/minimal responses.
