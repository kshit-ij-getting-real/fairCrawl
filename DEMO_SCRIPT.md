# FairFetch 2-minute MVP demo

1. **Publisher login + domain setup**
   - Login as a Publisher.
   - Open **Publisher → Domains**.
   - Add:
     - `ai-essays.vercel.app`
     - `macro-notes-demo.vercel.app`
   - With `MVP_BYPASS_VERIFICATION=true`, each domain appears as verified immediately.

2. **Publisher pricing setup**
   - Open **Publisher → Pricing**.
   - Select each domain and create rules:
     - `SUMMARY`, path prefix `/`, `100000` micros.
     - `DISPLAY`, path prefix `/`, `300000` micros.
     - Optional override for premium pages: `SUMMARY` or `DISPLAY` with `/premium/` and a higher price.

3. **AI team setup**
   - Login as an AI client.
   - Open **AI Client Dashboard**.
   - In **API keys**, click **Create key** (raw key appears once).
   - In **Agent identity**, set:
     - `agent_id`: e.g. `demo-agent`
     - `allowedUserAgentRegex`: `.*`
   - Click **Save**.

4. **Run a paid request from UI**
   - In **Test paid request** panel, enter:
     - URL: `https://ai-essays.vercel.app/premium/demo-article`
     - License: `SUMMARY` (or `DISPLAY`)
     - Optional max price micros.
   - Click **Test paid request**.
   - UI calls:
     - `POST /api/tokens`
     - `GET /api/content?url=...` with `x-fairfetch-token`
   - Receipt is shown with request/transaction ids and price.

5. **Show proof of marketplace loop**
   - AI dashboard **Usage + spend** now shows non-zero usage/spend.
   - Publisher **Transactions** shows matching row.
   - Publisher **Overview** KPIs show updated revenue, requests, active domains.
   - Public **Directory** lists verified domains with “Verified by …” and “Pricing from … micros”.
