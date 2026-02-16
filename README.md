# FairFetch

FairFetch is a marketplace where creators license premium content to AI companies. This MVP now supports both direct gateway fetches and TollBit-style signed token spends via publisher subdomains.

## What ships in this MVP

### Path 1: Single gateway fetch
`GET /api/gateway/fetch?url=<origin_url>&license_type=<summary|display>&format=<markdown|json>&max_price_micros=<int>`

Header: `X-API-Key: <developer key>`

Behavior:
- Validates API key.
- Canonicalizes URL.
- Deterministically resolves price from pricing rule hierarchy.
- Writes an idempotent ledger transaction.
- Fetches origin HTML and extracts AI-friendly content.
- Returns content + metadata + transaction id.

### Path 2: Publisher subdomain token flow
1) Mint token

`POST /api/token`

Header: `X-API-Key`

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

Response:
```json
{
  "token": "<jwt>",
  "token_id": "<uuid>",
  "price_micros": 250000,
  "platform_fee_micros": 25000,
  "total_micros": 275000,
  "expires_at": "2026-01-01T00:00:00.000Z"
}
```

2) Spend token against publisher subdomain

`GET https://fairfetch.<publisher-domain>/<path>`

Headers:
- `Fairfetch-Org-Id: <developer org id>`
- `Fairfetch-Token: <token>`
- `User-Agent: <same user agent used for mint>`

For local backend testing, host-rewrite middleware maps subdomain requests into `/api/fairfetch/*`.

## Deterministic pricing precedence
1. `BOT` (user-agent regex)
2. `PAGE` (exact URL/path rule)
3. `KEYWORD` (schema-ready)
4. `FRESHNESS` (schema-ready)
5. `DIRECTORY` / `GLOBAL` (longest-prefix wins for directory)

If no rule matches: deterministic `403 UNPRICED` JSON.

## Deterministic deny/error shape
```json
{
  "code": "UNPRICED",
  "message": "No matching pricing rule",
  "request_id": "...",
  "help": "Create a pricing rule"
}
```

## Publisher dashboard additions
- Domain onboarding + DNS TXT verification.
- CNAME mapping display (`fairfetch.<domain> -> edge.fairfetch.com`).
- Pricing rule CRUD.
- Transaction listing with domain/dev/license/date filters.

## Developer dashboard additions
- Agent identity and allowed user-agent regex.
- API key management.
- Usage and spend views by domain and by day.

## Local dev

### Prerequisites
- Node.js 18+
- Docker (Postgres)

### Environment
```bash
cp .env.example .env
```
Set:
- `DATABASE_URL`
- `JWT_SECRET`
- `FAIRFETCH_TOKEN_SECRET`
- `NEXT_PUBLIC_API_BASE_URL`

### Start services
```bash
docker-compose up -d
cd backend && npm install && npx prisma migrate dev && npm run dev
cd frontend && npm install && npm run dev
```

Backend runs on `:4000`, frontend on `:3000`.

## cURL examples

### Mint token
```bash
curl -X POST "http://localhost:4000/api/token" \
  -H "X-API-Key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/news/1","license_type":"display","user_agent":"my-bot/1.0","format":"markdown","max_price_micros":500000}'
```

### Gateway fetch
```bash
curl "http://localhost:4000/api/gateway/fetch?url=https://example.com/news/1&license_type=display&format=markdown&max_price_micros=500000" \
  -H "X-API-Key: YOUR_KEY" \
  -H "X-Request-Id: req-123"
```

### Subdomain token spend (local simulation)
```bash
curl "http://localhost:4000/news/1" \
  -H "Host: fairfetch.example.com" \
  -H "Fairfetch-Org-Id: 1" \
  -H "Fairfetch-Token: <token>" \
  -H "User-Agent: my-bot/1.0"
```
