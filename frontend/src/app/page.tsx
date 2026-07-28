import Link from 'next/link';
import { ResearchWorkspace } from '@/components/research/ResearchWorkspace';

const workflow = [
  {
    number: '01',
    title: 'Discover',
    body: 'The agent finds relevant specialist sources across providers, not only research already in its stack.',
  },
  {
    number: '02',
    title: 'Resolve rights',
    body: 'FairFetch returns an explicit decision for each source: allowed, paid, or blocked.',
  },
  {
    number: '03',
    title: 'Retrieve',
    body: 'The agent buys the permitted licence and receives only the approved research scope.',
  },
  {
    number: '04',
    title: 'Settle',
    body: 'Buyer and provider receive the same citation, usage record, payment, and receipt.',
  },
] as const;

export default function Page() {
  return (
    <div className="bg-[#f8fafc] text-[#0f172a]">
      <section className="relative overflow-hidden border-b border-[#dbe3ee]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_6%,rgba(37,99,235,0.12),transparent_27%),radial-gradient(circle_at_12%_20%,rgba(16,185,129,0.07),transparent_24%)]" />
          <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#cbd5e1] bg-white px-3 py-1.5 text-xs font-semibold text-[#475569] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#10b981]" />
                Licensed retrieval infrastructure for AI
              </div>
              <h1 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#0f172a] sm:text-6xl lg:text-7xl">
                Enterprise AI agents can search the public web. FairFetch lets them retrieve paid specialist research.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[#475569]">
                One query at a time, with permission, citations, usage metering, and automatic payment.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#workspace"
                  className="inline-flex items-center justify-center rounded-full bg-[#0f172a] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(15,23,42,0.2)] transition hover:-translate-y-0.5 hover:bg-[#1e293b]"
                >
                  Open the research workspace
                </a>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center justify-center rounded-full border border-[#cbd5e1] bg-white px-6 py-3 text-sm font-semibold text-[#334155] transition hover:border-[#94a3b8] hover:bg-[#f8fafc]"
                >
                  How the transaction works
                </Link>
              </div>
              <p className="mt-5 text-xs text-[#64748b]">
                Starting with Indian energy and infrastructure research.
              </p>
            </div>

            <div id="workspace" className="scroll-mt-24 pt-12 lg:pt-16">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563eb]">FairFetch product</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[#0f172a] sm:text-3xl">
                    Run a licensed research retrieval.
                  </h2>
                </div>
                <p className="max-w-md text-xs leading-5 text-[#64748b]">
                  Illustrative sources and economics. The permission, payment, citation, and receipt flow is the product.
                </p>
              </div>
              <ResearchWorkspace />
            </div>
          </div>
      </section>

      <section className="border-b border-[#e2e8f0] bg-white">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#64748b] sm:grid-cols-4 sm:px-6 lg:px-8">
            <span>Discovery</span>
            <span>Rights</span>
            <span>Retrieval</span>
            <span>Settlement</span>
          </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563eb]">The missing transaction</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] text-[#0f172a]">
                Search finds information. FairFetch procures permissioned knowledge.
              </h2>
              <p className="mt-5 text-base leading-7 text-[#64748b]">
                Valuable research sits behind separate subscriptions, contracts, and sales calls. AI agents cannot compare
                it, buy the right licence, or prove what they used. FairFetch turns that procurement process into one
                machine-readable transaction.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {workflow.map((step) => (
                <article key={step.number} className="rounded-2xl border border-[#dbe3ee] bg-white p-6">
                  <p className="text-xs font-semibold text-[#94a3b8]">{step.number}</p>
                  <h3 className="mt-8 text-xl font-semibold text-[#0f172a]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#64748b]">{step.body}</p>
                </article>
              ))}
            </div>
          </div>
      </section>

      <section className="bg-[#0f172a] text-white">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6ee7b7]">Initial market</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em]">
                Specialist Indian research that enterprise agents cannot reliably reach today.
              </h2>
              <p className="mt-5 text-base leading-7 text-[#94a3b8]">
                FairFetch starts with energy, infrastructure, mobility, and industrial research from independent firms,
                databases, and sector experts.
              </p>
            </div>
            <div className="grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94a3b8]">For AI teams</p>
                <h3 className="mt-3 text-xl font-semibold">One route to research outside your current stack.</h3>
                <p className="mt-2 text-sm leading-6 text-[#94a3b8]">
                  Search providers, resolve rights, retrieve through an API, and attach licensed citations to every answer.
                </p>
                <Link href="/ai-teams" className="mt-5 inline-flex text-sm font-semibold text-[#6ee7b7] hover:text-white">
                  Explore the buyer product →
                </Link>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94a3b8]">For research providers</p>
                <h3 className="mt-3 text-xl font-semibold">Sell controlled retrievals without rebuilding distribution.</h3>
                <p className="mt-2 text-sm leading-6 text-[#94a3b8]">
                  Publish licences and prices, approve machine use, see who retrieved what, and receive usage-linked payouts.
                </p>
                <Link href="/creators" className="mt-5 inline-flex text-sm font-semibold text-[#6ee7b7] hover:text-white">
                  Explore the provider product →
                </Link>
              </div>
            </div>
          </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="rounded-[28px] border border-[#dbe3ee] bg-white p-8 sm:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563eb]">What FairFetch is</p>
            <div className="mt-5 grid gap-8 lg:grid-cols-2">
              <h2 className="text-4xl font-semibold tracking-[-0.035em] text-[#0f172a]">
                The transaction and trust layer beneath AI research products.
              </h2>
              <div className="space-y-4 text-sm leading-7 text-[#64748b]">
                <p>
                  FairFetch does not produce reports and is not another market-intelligence interface. It connects AI
                  systems to external specialist sources and handles discovery, rights, retrieval, attribution, metering,
                  payments, and provider controls.
                </p>
                <p>
                  The long-term goal is a standard rights and settlement network for machine-consumed knowledge. The first
                  proof is simpler: complete one paid, cited retrieval that neither side could transact efficiently before.
                </p>
              </div>
            </div>
            <div className="mt-8">
              <a
                href="#workspace"
                className="inline-flex items-center justify-center rounded-full bg-[#0f172a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1e293b]"
              >
                Run the transaction
              </a>
            </div>
          </div>
      </section>
    </div>
  );
}
