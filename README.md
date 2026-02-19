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

## Recent frontend UI consistency updates
- Header auth actions are now session-aware across the app (unauthenticated users see **Log in / Get started**; authenticated users see an account chip, **Dashboard**, and **Logout**).
- Logged-in dashboard actions now reuse the same shared button variants used on exterior marketing pages for consistent primary/secondary styling.
