# Frontend Copy Audit

## Corrected claims (before vs after)

| Area | Before | After |
| --- | --- | --- |
| Signup publisher onboarding | "Prove you own it by serving a small verification file." | "Verify ownership from the Domains setup flow (auto-verified in demo mode)." |
| Signup publisher onboarding | "Set crawl policies and see which AI clients access your site." | "Create pricing and content controls for the paths you want to allow or monetize." |
| Creators page hero | "turn AI training into income" | "turn AI access into income" |
| Home page directory card | "permissioned training data" | "permissioned data with clear licensing terms" |
| Directory hero | "permissioned training data" | "permissioned data with clear licensing terms" |
| Directory listing behavior copy | "show up in the directory once we go live" | "Verified domains appear in the directory after ownership checks are complete" |
| Directory rendering | Fallback displayed all domains when no verified domains were returned | Directory now displays verified domains only, matching verified-gated behavior |
| How it works flow | "how fast they can crawl" and "open, premium, throttled" | "what they can read" and "open, premium, or not listed" |
| AI teams page API statuses | "open, throttled, or not listed" | "open, paid, or not listed" |
| Publisher pricing empty state | "Create and activate at least one rate" | "Create and activate at least one pricing rule..." |
| Publisher transactions empty state | "after successful paid fetches" | "after an AI client redeems a token for content" |
| Publisher overview transactions empty state | "After tokens are spent" | "after an AI client redeems a token for content" |
| AI client paid test errors | Generic/unhandled API errors | Actionable messages for no pricing rule and unverified domain (demo-mode aware) |
| Em dash usage | Em dashes in marketing and dashboard strings | Replaced with commas, pipes, or plain text labels |

## Pages touched

- `frontend/src/app/page.tsx`
- `frontend/src/app/creators/page.tsx`
- `frontend/src/app/ai-teams/page.tsx`
- `frontend/src/app/directory/page.tsx`
- `frontend/src/app/how-it-works/page.tsx`
- `frontend/src/app/signup/page.tsx`
- `frontend/src/app/publisher/dashboard/page.tsx`
- `frontend/src/app/publisher/pricing/page.tsx`
- `frontend/src/app/publisher/transactions/page.tsx`
- `frontend/src/app/aiclient/test-paid-request/page.tsx`
- `frontend/src/app/vision/page.tsx`
- `frontend/src/lib/directory.ts`

## Checklist

- [x] No em dashes remain in frontend UI strings.
- [x] Verification and directory copy now reflects verified-domain gating.
- [x] Pricing and transaction copy now reflects token redemption and receipt flow.
- [x] No backend functionality changed.
