import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'For research providers',
  description: 'List specialist research, set machine-use rights and prices, and earn from licensed AI retrievals.',
};

const controls = [
  ['Discovery', 'Choose which reports, datasets, and expert research AI systems can find.'],
  ['Licence', 'Define permitted use such as summary, display, citation count, retention, and client type.'],
  ['Price', 'Set a per-retrieval price by report, collection, provider, or licence class.'],
  ['Evidence', 'See the buyer, query scope, source used, price, receipt, and payout for every retrieval.'],
] as const;

export default function CreatorsPage() {
  return (
    <main className="bg-[#f8fafc]">
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563eb]">For research providers</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-[#0f172a] sm:text-6xl">
              Sell research to AI systems without giving up control.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#64748b]">
              FairFetch gives independent research firms, databases, and sector experts a machine-readable storefront.
              List what agents can discover, define the exact licence, and get paid for each approved retrieval.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup?role=publisher"
                className="inline-flex items-center justify-center rounded-full bg-[#0f172a] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1e293b]"
              >
                List research
              </Link>
              <Link
                href="/#workspace"
                className="inline-flex items-center justify-center rounded-full border border-[#cbd5e1] bg-white px-6 py-3 text-sm font-semibold text-[#334155] hover:border-[#94a3b8]"
              >
                See a paid retrieval
              </Link>
            </div>
          </div>
          <div className="rounded-[28px] bg-[#0f172a] p-7 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Provider receipt</p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#94a3b8]">Research retrieved</p>
                  <p className="mt-1 text-sm font-semibold">India Power Exchanges</p>
                </div>
                <span className="rounded-full bg-[#064e3b] px-2.5 py-1 text-[10px] font-bold text-[#6ee7b7]">PAID</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 text-sm">
                <div>
                  <p className="text-xs text-[#64748b]">Buyer</p>
                  <p className="mt-1 font-medium">Aster Wealth</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748b]">Licence</p>
                  <p className="mt-1 font-medium">Summary</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748b]">Gross price</p>
                  <p className="mt-1 font-medium">₹120</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748b]">Provider payout</p>
                  <p className="mt-1 font-medium text-[#6ee7b7]">₹102</p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs leading-5 text-[#94a3b8]">Illustrative transaction economics.</p>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          {controls.map(([title, body]) => (
            <article key={title} className="rounded-2xl border border-[#dbe3ee] bg-white p-6">
              <h2 className="text-xl font-semibold text-[#0f172a]">{title}</h2>
              <p className="mt-2 text-sm leading-7 text-[#64748b]">{body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
