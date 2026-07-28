# FairFetch fundraising MVP gap analysis

## Scope

The fundraising iteration needs to prove one credible transaction, not complete every production workflow:

1. A provider makes one private document available under explicit machine-use terms.
2. An identified buyer agent starts with 100 credits.
3. The agent searches metadata without receiving the source file.
4. FairFetch authorises a five-credit answer-only retrieval.
5. The agent receives a bounded answer with a licensed citation.
6. The buyer balance moves to 95 credits.
7. Four credits accrue to the provider and one to FairFetch.
8. Both sides can refer to the same receipt.

## Repository audit

| Capability | Current status | Evidence in the repository | Next action |
| --- | --- | --- | --- |
| Web authentication | Partial | Password hashing and JWT sessions exist | Add production session hardening and recovery |
| API keys | Partial | Keys are hashed, scoped, and revocable | Add rate limits and per-key usage policy |
| Agent identity | Partial | Buyer dashboard stores agent identity | Bind every retrieval and receipt to it |
| Pricing and licence policy | Partial | Domain/path rules support access modes and prices | Move rules to document-level licences |
| Spend token and idempotency | Partial | Legacy token and ledger transaction primitives exist | Make credit debit and settlement one atomic operation |
| Available credit balance | Incorrect semantics | `ClientBalance` tracks aggregate spend rather than spendable credits | Introduce an account/entry ledger with available balance |
| Document supply | Missing | No document, ownership-attestation, or licence schema | Add private upload and explicit document rights |
| Processing and retrieval | Missing | No extraction, chunks, embeddings, or vector index | Add page-aware extraction and retrieval |
| Grounded answer API | Missing | Existing flow is URL/domain oriented | Return bounded answers from retrieved licensed chunks |
| Private source storage | Missing | No object-storage integration | Store originals privately and issue no public source URLs |
| Audit trail | Partial | Transaction records exist but not append-only events | Record policy, debit, delivery, and settlement events |
| Dashboards | Partial | Buyer/provider surfaces exist, with demo fallbacks | Connect them to the persistent document and credit ledger |
| Automated tests | Partial | Authentication and database-error coverage only | Add licence, idempotency, accounting, and source-leakage tests |

## What this iteration ships

- A TollBit-inspired transaction interface centred on visible access terms, metering, and auditability.
- Live `POST /api/v1/pilot/search` and `POST /api/v1/pilot/retrieve` route handlers.
- A complete recordable path from licensed supply to agent identity, paid retrieval, bounded citation, and shared receipt.
- Explicit disclosure that the public document, provider, credits, and economics are illustrative.
- An ephemeral pilot receipt that does not claim real payment or persistent accounting.

## Required for the first customer pilot

1. Obtain one provider-owned PDF and a signed machine-use licence.
2. Store the original privately and model the document, version, attestation, price, quote limit, and permitted output.
3. Extract page-aware text, create chunks and embeddings, and retrieve only permitted passages.
4. Replace the public pilot API key with authenticated, rate-limited buyer keys.
5. Implement an append-only credit ledger with an atomic five-credit debit, four-credit provider earning, and one-credit fee.
6. Persist the receipt and expose it in both buyer and provider views.
7. Test insufficient funds, revoked keys, inactive licences, duplicate idempotency keys, prompt injection, and raw-source leakage.

## Deliberate non-goals for fundraising

- Self-serve provider onboarding.
- Stripe checkout and cash settlement.
- A large research marketplace.
- Production-scale vector infrastructure.
- Full administrator tooling.
- Multi-currency pricing or complex contracts.

Those are customer-pilot or post-pilot work. They should not block demonstrating the core transaction now.
