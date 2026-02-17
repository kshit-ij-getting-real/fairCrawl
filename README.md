# Fairfetch

Fairfetch is a two-service platform for licensed content access: an Express + Prisma backend API and a Next.js frontend dashboard for publishers and AI clients.

## Repository layout

- `backend/` — API server, auth, pricing, token mint/spend, usage reporting
- `frontend/` — dashboard UI
- `docker-compose.yml` — local PostgreSQL service

## Requirements

- Node.js **22.x** (recommended for Render parity)
- npm 10+
- Docker (for local PostgreSQL) or an external PostgreSQL instance

## Local development (copy/paste)

### 1) Clone and install dependencies

```bash
git clone <your-repo-url>
cd fairfetch
npm --prefix backend ci
npm --prefix frontend ci
```

### 2) Configure environment variables

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env.local
```

Required backend environment variables in `.env`:

- `DATABASE_URL` (secret): PostgreSQL connection string
- `JWT_SECRET` (secret): signing key for auth tokens
- `PORT` (optional): backend HTTP port (defaults to `4000`)
- `FAIRFETCH_TOKEN_SECRET` (secret recommended): spend token secret (falls back to dev default if omitted)

Example local `.env`:

```dotenv
DATABASE_URL=postgresql://fairfetch:fairfetch@localhost:5432/fairfetch
JWT_SECRET=replace-with-a-long-random-secret
FAIRFETCH_TOKEN_SECRET=replace-with-a-different-long-random-secret
PORT=4000
```

### 3) Start PostgreSQL

```bash
docker compose up -d
```

### 4) Run Prisma migration and client generation

```bash
npm --prefix backend run prisma:migrate
npm --prefix backend run prisma:generate
```

### 5) Start services

Backend:

```bash
npm --prefix backend run dev
```

Frontend (new terminal):

```bash
npm --prefix frontend run dev
```

### 6) Validate locally

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000/api`
- Healthcheck: `http://localhost:4000/api/health`

## Production setup (Render-first, generic)

## Backend service (Render web service)

- **Root directory:** `backend`
- **Build command:** `npm ci && npm run build`
- **Start command:** `npm run start`

Required production backend environment variables:

- `DATABASE_URL` (secret)
- `JWT_SECRET` (secret)
- `FAIRFETCH_TOKEN_SECRET` (secret strongly recommended)
- `PORT` (Render injects automatically; keep app bound to `process.env.PORT`)

Database expectations:

- Provision PostgreSQL before first deploy
- Apply migrations during deploy/release process:

```bash
cd backend
npx prisma migrate deploy
```

Healthcheck endpoint:

- `GET /api/health`

## Frontend service (Render static/Node, Vercel, or other)

- **Root directory:** `frontend`
- **Build command:** `npm ci && npm run build`
- **Start command:** `npm run start` (if deploying as Next.js server)

Required frontend environment variable:

- `NEXT_PUBLIC_API_BASE_URL` (non-secret): URL of backend API origin (example: `https://api.<your-domain>`)

## Recommended scripts

### Backend (`backend/package.json`)

- `npm run build`
- `npm run start`
- `npm run dev`
- `npm run test`
- `npm run prisma:migrate`
- `npm run prisma:generate`
- `npm run aggregate`

### Frontend (`frontend/package.json`)

- `npm run build`
- `npm run start`
- `npm run dev`
- `npm run lint`

## Troubleshooting

- **`Missing required environment variable(s)`**
  - Ensure `.env` exists and includes `DATABASE_URL` and `JWT_SECRET` for backend startup.
- **Prisma database connection errors (`PrismaClientInitializationError`, `ECONNREFUSED`, timeout)**
  - Confirm DB host/port/credentials in `DATABASE_URL`.
  - Confirm database is running and reachable from the backend runtime.
- **App not reachable in production**
  - Confirm service binds to `process.env.PORT`.
  - Confirm healthcheck path is `/api/health`.
- **Frontend can’t call API**
  - Check `NEXT_PUBLIC_API_BASE_URL` points to backend API origin.

## Naming consistency

Project naming is standardized as **Fairfetch** (service identifiers use lowercase `fairfetch`).

Legacy naming may still exist in non-runtime places (for example UI class/token names or historical schema text) where renaming is not required for correctness.
