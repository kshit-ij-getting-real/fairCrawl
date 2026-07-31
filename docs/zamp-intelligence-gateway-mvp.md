# Zamp Intelligence Gateway MVP

## One-line thesis

AI employees cannot own serious enterprise work if they only know what is inside the company. Zamp Intelligence Gateway gives them governed access to external knowledge while keeping the customer’s private judgment and learning inside the enterprise.

## Product direction

Zamp should move from AI employees that execute workflows to the trusted operating layer for AI employees.

That layer should govern:

- internal context
- external knowledge
- source permissions
- research budgets
- citations and receipts
- human approvals
- decision traces
- enterprise-owned memory

## Why external knowledge is different

The best knowledge is not contained in one model or one database. It is distributed across regulators, research firms, datasets, experts, and the enterprise itself. It is also local, changing, and shaped by the people using it.

The product should therefore bring intelligence to distributed knowledge instead of copying all knowledge into a central model.

The separation is deliberate:

- external providers retain control of their research and licensing terms
- the agent retrieves only what the task and policy permit
- private enterprise context is not exposed to external providers
- the model can remain replaceable
- the enterprise owns the final decision trace, correction, and precedent

## Demo customer

The MVP uses a hypothetical workflow for a global payments company, similar to the type of customer Zamp already serves.

### AI employee

Market Expansion AI Employee

### Task

Should we launch instant merchant payouts in India in the next two quarters?

### Knowledge required

- current RBI requirements
- payment rail adoption data
- licensed merchant payments market research
- competitor pricing benchmarks
- private company risk policy
- a prior internal market-launch decision

### Output

A pilot, launch, or wait recommendation with:

- evidence
- citations
- source freshness
- licensing policy
- retrieval cost
- model and tool cost
- uncertainty
- human approval
- saved decision rationale

## MVP flow

1. Define the business decision.
2. Generate a research plan.
3. Discover public, licensed, and private sources.
4. Check policy and cost before retrieval.
5. Build a cited decision brief.
6. Show what evidence changed the answer.
7. Route the recommendation to a human.
8. Save the human correction as enterprise-owned precedent.

## What the current prototype proves

The interactive frontend at `/zamp-intelligence-gateway` proves the product flow and the core product judgment:

- the unit of work is a business decision, not a search query
- external research is governed before retrieval
- source cost and rights are visible to the agent and reviewer
- internal context stays private
- human corrections become reusable judgment

The current page uses mocked sources and output. It is intentionally a product prototype, not a claim of live research coverage.

## Next technical slice

The next working version should add four backend primitives:

### 1. Research request

`POST /api/research-requests`

Stores the task, AI employee, allowed source classes, budget, and customer policy.

### 2. Source discovery

`POST /api/research-requests/:id/discover`

Returns public, licensed, and internal sources with price, rights, freshness, and trust metadata.

### 3. Governed retrieval

Reuse FairFetch’s existing paid retrieval and receipt mechanics. Add task ID, customer policy, and source evidence metadata to each transaction.

### 4. Decision trace

`POST /api/decision-traces`

Stores the research request, sources used, costs, recommendation, uncertainty, human decision, correction, and later outcome.

## What not to build yet

- a broad publisher marketplace redesign
- autonomous purchasing without a budget policy
- generic web search
- model training on customer corrections
- a full context graph
- multiple enterprise workflows

The Zamp assignment needs one sharp, working wedge. The payments expansion workflow is enough.

## Demo sequence

1. Open `/zamp-intelligence-gateway`.
2. Show that the task is a decision, not a prompt.
3. Click **Find governed sources**.
4. Explain the mix of public, licensed, and internal knowledge.
5. Remove and re-add a paid source to show budget control.
6. Click **Retrieve and build brief**.
7. Show the recommendation, uncertainty, receipts, and total cost.
8. Click **Send for human decision**.
9. Add a correction and save it.
10. End on the decision trace and enterprise-owned precedent.

## Pitch spine

AI employees need more than internal company data. A serious finance, compliance, strategy, or risk decision also depends on live regulation, market research, pricing benchmarks, and expert knowledge.

Today an agent either browses loosely, relies on stale context, or asks a human. None of those paths is enterprise-grade.

Zamp Intelligence Gateway turns external research into governed infrastructure. It tells the AI employee what it may retrieve, what it costs, how it can be used, what must be cited, and when a human must approve. The source stays distributed. The enterprise keeps the judgment.

Zamp should own the point where external knowledge becomes enterprise action.
