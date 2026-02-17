- Summary (what fails, where, error text)
  - Signup-related pages fail during Next.js build/static prerender when `NEXT_PUBLIC_API_BASE_URL` is not set.
  - Failure surfaced in frontend build output while collecting page data, e.g. `/ai-teams` (same shared API config is imported by signup page and auth flow): `Error: Missing NEXT_PUBLIC_API_BASE_URL`.

- Repro steps (exact commands, URLs, inputs)
  - From repo root:
    - `cd frontend && npm install`
    - `cd frontend && NEXT_DISABLE_ESLINT=1 npm run build`
  - Observed failing output before the fix:
    - `Error: Missing NEXT_PUBLIC_API_BASE_URL`
  - Runtime impact:
    - With missing env var, client pages that import `apiFetch`/`API_BASE_URL` (including `/signup`) are unable to execute signup requests.

- Observations (logs, stack traces, HTTP status, response body shape)
  - The error occurred at module evaluation time in frontend build/prerender, not from backend HTTP response handling.
  - Stack included generated app page bundles and terminated with:
    - `Error: Failed to collect page data for /ai-teams`
  - No signup POST request was sent in this failure class because frontend initialization failed first.

- Likely root causes (ranked, with evidence)
  1. Missing `NEXT_PUBLIC_API_BASE_URL` causes an eager throw in `frontend/src/lib/apiBase.ts` during import time.
     - Evidence: reproducible build error text exactly matching thrown string and stack frames from compiled page modules.
  2. Secondary environment hygiene issue: frontend build reports missing ESLint dependency, but this did not stop post-fix build completion in this environment.

- Fixes applied (with file paths + rationale)
  - `frontend/src/lib/apiBase.ts`
    - Changed base URL resolution so missing `NEXT_PUBLIC_API_BASE_URL` no longer crashes import-time SSR/prerender.
    - Behavior now:
      - Browser: warns and returns empty base (so app renders and can show explicit request-time error).
      - Server/build: falls back to `http://localhost:4000` for local/dev resilience.
    - Rationale: prevent hard failure that blocks signup flow before any API call.
  - `frontend/src/lib/http.ts`
    - Added explicit guard to throw `Missing NEXT_PUBLIC_API_BASE_URL` when API requests are attempted with empty base URL.
    - Rationale: keep error explicit and actionable at request time instead of crashing during module import.

- Open issues / external checks (each item: what to check, where, expected vs actual, how it could break signup)
  - Check `NEXT_PUBLIC_API_BASE_URL` in deployment environment (e.g., deployment host project settings).
    - Where read: `frontend/src/lib/apiBase.ts`.
    - Expected: absolute URL to backend origin (e.g. `https://<backend-domain>`).
    - Actual in this sandbox: unset by default.
    - Breakage mode: signup UI cannot reach backend auth endpoint or may fail pre-render depending on code path.
  - Check backend availability and route reachability for `POST /api/auth/signup`.
    - Where handled: `backend/src/routes/auth.ts`.
    - Expected: HTTP 201 with `{ token, role }` on valid input.
    - Actual in this sandbox: full backend runtime reproduction blocked (no Docker/Postgres available).
    - Breakage mode: signup returns 5xx or connection failure if backend/database unavailable.
  - Check required backend env vars (`DATABASE_URL`, `JWT_SECRET`).
    - Where validated: `backend/src/config.ts`.
    - Expected: both present and valid.
    - Actual in this sandbox: not fully exercised end-to-end due missing local Postgres runtime.
    - Breakage mode: backend startup failure, so signup endpoint unavailable.

- Next experiments (smallest steps to disambiguate remaining hypotheses)
  1. Start a reachable Postgres instance and backend, then run:
     - `curl -i -X POST http://localhost:4000/api/auth/signup -H 'Content-Type: application/json' -d '{"email":"test@example.com","password":"Pass123!","role":"PUBLISHER","name":"Demo"}'`
     - Confirm 201 and JWT body.
  2. Run frontend locally with `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000` and complete signup via `/signup`; capture browser network request/response.
  3. Add a focused frontend unit test around `resolveBaseUrl` fallback behavior (missing env on server vs client) to prevent regression.
