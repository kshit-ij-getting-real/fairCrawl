import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'For AI teams',
  description: 'Give enterprise agents licensed access to external specialist research through one API and receipt layer.',
};

const outputs = [
  ['Source match', 'Relevant specialist reports across providers'],
  ['Access decision', 'Allowed, paid, or blocked before content is read'],
  ['Permitted content', 'Only the licensed summary, extract, display, or dataset scope'],
  ['Proof', 'Citation, usage log, cost allocation, and transaction receipt'],
] as const;

export default function AiTeamsPage() {
  return (
    <main className="bg-[#f8fafc]">
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563eb]">For enterprise AI teams</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-[#0f172a] sm:text-6xl">
              Give agents a legal way to buy knowledge.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#64748b]">
              Use one discovery and retrieval layer for research outside your existing subscriptions. FairFetch checks
              provider rights, enforces spend limits, returns approved content, and attaches a receipt to every answer.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#workspace"
                className="inline-flex items-center justify-center rounded-full bg-[#0f172a] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1e293b]"
              >
                Open research workspace
              </Link>
              <Link
                href="/signup?role=aiclient"
                className="inline-flex items-center justify-center rounded-full border border-[#cbd5e1] bg-white px-6 py-3 text-sm font-semibold text-[#334155] hover:border-[#94a3b8]"
              >
                Request API access
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-[#dbe3ee] bg-[#0f172a] shadow-[0_30px_80px_rgba(15,23,42,0.16)]">
            <div className="border-b border-white/10 px-5 py-4">
              <p className="font-mono text-xs text-[#94a3b8]">POST /v1/research/retrieve</p>
            </div>
            <pre className="overflow-x-auto p-5 text-xs leading-6 text-[#d1fae5]">{`{
  "query": "IEX earnings risks",
  "agent_id": "aster_wealth_copilot",
  "licence": "SUMMARY",
  "budget_cap": 50000
}

→ access: "PAID"
→ source: "GridLine Research"
→ price: 12000
→ citation_rights: 5
→ receipt_id: "ff_tx_7F41A9"`}</pre>
          </div>
        </div>

        <div className="mt-16 rounded-[28px] border border-[#dbe3ee] bg-white p-7 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563eb]">One response, four guarantees</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {outputs.map(([title, body]) => (
              <div key={title} className="rounded-2xl bg-[#f8fafc] p-5">
                <h2 className="text-base font-semibold text-[#0f172a]">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#64748b]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
