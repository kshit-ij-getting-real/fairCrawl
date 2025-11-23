# FairFetch

FairFetch is a marketplace where creators license their paywalled and premium content to AI companies. It is a minimal marketplace and gateway where publishers expose AI-friendly content policies and AI builders access verified domains through a single authenticated proxy.

## Features
- Publisher onboarding with domain registration, policy controls, verification flow, and analytics snapshot.
- AI client workspace for managing API keys, usage, and gateway instructions.
- Gateway endpoint that enforces publisher policies, authenticates API clients, proxies requests, and logs usage.
- Background usage aggregation job to estimate charges per client/domain pair.
- Next.js frontend for signup/login and both role dashboards.

## Getting started

### Prerequisites
- Node.js 18+
- Docker (for PostgreSQL)

### Environment
```bash
cp .env.example .env
```
Adjust values if necessary.

### Start PostgreSQL
```bash
docker-compose up -d
```

### Backend setup
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```
This starts the Express API on port `4000` by default.

Run the aggregation job manually when needed:
```bash
npm run aggregate
```

### Frontend setup
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:3000 to access the UI.

### Example gateway call (local development)
```bash
curl "http://localhost:4000/api/gateway/fetch?url=https://example.com/path" \
  -H "X-API-Key: YOUR_FAIRFETCH_KEY"
```
Replace the URL with an approved domain/path and provide a valid API key from the AI client dashboard.

<!-- In production, replace localhost with your deployed backend URL, for example: -->
<!-- https://fairfetch.onrender.com/api/gateway/fetch?url=... -->

## Deployment notes

- The database examples now point to the `fairmarket` database. Existing deployments that previously used `faircrawl` should either rename their database manually or provision a new one before applying migrations.
- Deployment dashboards such as Vercel or Render may still need manual renaming; the config in this repo now references FairFetch but cloud UI names have to be updated separately.

## Repository structure
```
backend/   # Express + Prisma API, jobs, routes
frontend/  # Next.js app router UI
```
