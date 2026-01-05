# Changelog
## 2026-01-05
- Initialized `market-primitives.md` with required section order.
- Added starter goals, principles, and primitives to guide initial market modeling.
- Listed immediate actions to gather real inputs and validate assumptions.
- Documented licensing risk with explicit AGPL implications.
- Added open questions to capture unknowns instead of overwriting plans.

# Goal
- Define a testable set of market primitives that Fairfetch can implement by Q2.
- Produce a single source of truth for market-layer design decisions.

# Principles
- Prefer measurable primitives over narrative descriptions.
- Keep each primitive tied to a single owner and success metric.
- Record conflicts as open questions, not edits to agreed plans.
- Treat licensing choices as product constraints with AGPL implications.

# Primitives (Operate)
- Data ingestion pipeline: ingest 1,000 supplier updates/day with <5% failure rate.
- Normalization rules: map 95% of supplier fields to a stable schema within 24 hours.
- Audit log: retain immutable change history for 12 months.

# Primitives (Market Layer)
- Supplier registry: unique supplier ID with verified contact and region fields.
- Offer listings: each listing has price, MOQ, lead time, and validity window.
- Demand signals: capture 50 buyer requests/month with category tags.
- Matching logic: generate ranked supplier lists with a documented scoring formula.

# Priorities (Now / Next / Later)
- Now
  - Collect initial market-layer requirements from stakeholders.
  - Define the first scoring formula and its measurable inputs.
- Next
  - Validate offer listing schema with 3 real suppliers.
  - Draft API contracts for supplier registry and listings.
- Later
  - Automate demand signal ingestion from partner systems.

# Risks (Licensing / Security / Ops)
- Licensing
  - If any component is AGPL, distribution triggers source disclosure obligations.
  - Decision needed on whether AGPL constraints are acceptable for market layer.
- Security
  - Supplier data may include PII; enforce least-privilege access.
- Ops
  - Data ingestion failures could block daily updates; define retry policy.

# Open Questions
- Which stakeholders own final approval of market-layer primitives?
- What metrics define success for supplier matching quality?
- Do we accept AGPL implications if we integrate AGPL-licensed components?

# References (links + 1-line why it matters)
- https://www.gnu.org/licenses/agpl-3.0.html — Defines AGPL obligations and distribution triggers.
