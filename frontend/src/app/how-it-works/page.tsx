import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How it works',
  description: 'How FairFetch turns a research query into a permissioned, paid, cited retrieval.',
};

const steps = [
  {
    number: '01',
    title: 'The agent asks',
    body: 'An enterprise agent sends a research query, its identity, permitted use, and spending limit to FairFetch.',
    output: 'Query + buyer identity',
  },
  {
    number: '02',
    title: 'FairFetch finds eligible sources',
    body: 'FairFetch searches specialist providers and returns source relevance, licence terms, pricing, and an explicit access decision.',
    output: 'ALLOWED · PAID · BLOCKED',
  },
  {
    number: '03',
    title: 'The agent licenses one retrieval',
    body: 'The selected provider policy is enforced, payment is authorised, and only the approved research scope is returned.',
    output: 'Research + usage rights',
  },
  {
    number: '04',
    title: 'Both sides get proof',
    body: 'The agent receives a cited answer. The provider receives a usage record and payout. Both share the same receipt.',
    output: 'Citation + receipt + payout',
  },
] as const;

export default function HowItWorksPage() {
  return (
    <main className="bg-[#f8fafc]">
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563eb]">Product flow</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-[#0f172a] sm:text-6xl">
            One query becomes one auditable research transaction.
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#64748b]">
            FairFetch handles the steps that normal web search and RAG cannot: procurement, machine-readable rights,
            controlled delivery, attribution, and settlement.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          {steps.map((step) => (
            <article key={step.number} className="rounded-2xl border border-[#dbe3ee] bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-[#94a3b8]">{step.number}</span>
                <span className="rounded-full bg-[#f1f5f9] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#475569]">
                  {step.output}
                </span>
              </div>
              <h2 className="mt-10 text-2xl font-semibold text-[#0f172a]">{step.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#64748b]">{step.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-[28px] bg-[#0f172a] p-8 text-white sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6ee7b7]">See the complete loop</p>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.03em]">
                Run the product flow without an account or backend setup.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#94a3b8]">
                The homepage transaction room uses illustrative Indian energy research and shows the buyer and provider record
                created by one licensed retrieval.
              </p>
            </div>
            <Link
              href="/#transaction-room"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0f172a] hover:bg-[#e2e8f0]"
            >
              Open transaction room
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
