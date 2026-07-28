# FairFetch two-minute transaction walkthrough

## 0:00 to 0:20 · Problem and product

[Open `/`.]

AI agents can search public information, but valuable specialist research sits behind fragmented subscriptions, contracts, and sales calls. Agents cannot compare it, buy the correct machine-use licence, or prove what they used.

FairFetch is the transaction and trust layer between enterprise AI agents and specialist research providers. It handles discovery, permissions, paid retrieval, citations, usage metering, and settlement.

## 0:20 to 0:35 · Initial wedge

[Point to the initial-market line.]

We are starting with Indian energy and infrastructure research. The buyers are research-heavy enterprise teams and the AI products that serve them. The providers are independent research firms, databases, and sector experts.

## 0:35 to 1:45 · Run one transaction

[Scroll to the transaction room on the homepage.]

The provider has made one private report available under an answer-only licence. FairFetch shows the active licence, ownership attestation, five-credit price, quote limit, and the fact that the raw PDF remains private.

[Click **Confirm licensed supply** and then **Activate agent**.]

This is Aster Strategy Agent. It has an API identity, 100 credits, and a ten-credit transaction cap. It asks what could change the earnings power and market position of Indian Energy Exchange over the next 12 months.

[Click **Search licensed research**.]

The homepage calls the live FairFetch pilot search endpoint. Search returns metadata and a five-credit access offer, but not the source file.

[Click **Pay 5 credits & retrieve** and let the checks run.]

The retrieval request authenticates the agent, checks the licence and balance, protects the source, and records the split. The agent receives a bounded answer with a licensed page citation and response hash. The raw PDF is never returned.

The proof ledger shows the shared receipt: the buyer balance moves from 100 to 95 credits, the provider receives four credits, and FairFetch receives one.

This fundraising pilot makes real API calls, but the provider, document, credits, and economics are illustrative and the receipt is ephemeral. No real payment is processed.

## 1:45 to 2:00 · Close

[Return to `/` or stay on the receipt.]

FairFetch is not another research database and does not produce reports. It lets AI systems procure external specialist knowledge one query at a time.

The first proof is one permitted, metered, cited retrieval that neither side could transact efficiently before. The next customer milestone is to replace the illustrative report and ledger with one provider-owned document and persistent credit accounting.
