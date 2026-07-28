import Link from 'next/link';
import { ResearchWorkspace } from '@/components/research/ResearchWorkspace';

const proofPoints = [
  {
    label: 'Licensed supply',
    title: 'One document with explicit machine-use terms.',
    body: 'The transaction starts with ownership, access mode, quote limits, price and private-source status.',
  },
  {
    label: 'Agent access',
    title: 'One external API contract.',
    body: 'The public pilot endpoint authenticates an agent key, searches metadata and accepts an idempotent retrieval request.',
  },
  {
    label: 'Controlled answer',
    title: 'Useful output without the raw file.',
    body: 'The response is bounded, grounded and cited. The source PDF and unrestricted chunks are never returned.',
  },
  {
    label: 'Economic proof',
    title: 'One shared receipt for both sides.',
    body: 'The buyer sees credits charged; the provider sees gross earnings, the FairFetch fee and net earnings.',
  },
] as const;

export default function Page() {
  return (
    <div className="bg-[#f7f3f0] text-[#171717]">
      <section className="relative overflow-hidden border-b border-[#ded8d3]">
        <div className="pointer-events-none absolute left-1/2 top-[-260px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#ff4f1f]/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 text-center sm:px-6 lg:px-8 lg:pb-20 lg:pt-24">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#d8d1cc] bg-[#eee9e5] px-3 py-1.5 text-xs font-semibold text-[#625d59]">
            <span className="h-2 w-2 rounded-full bg-[#ff4f1f]" />
            Paid access infrastructure for proprietary research
          </div>
          <h1 className="mx-auto mt-6 max-w-5xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            Make proprietary knowledge purchasable by AI agents.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#625d59]">
            FairFetch authenticates the agent, enforces the licence, returns a bounded cited answer, meters the use and
            creates a shared transaction receipt.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#transaction-room"
              className="inline-flex items-center justify-center rounded-full bg-[#ff4f1f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e63f14]"
            >
              Run the transaction
            </a>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-[#8f8781] bg-transparent px-6 py-3 text-sm font-semibold text-[#292624] transition hover:bg-white"
            >
              See the protocol
            </Link>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-px overflow-hidden rounded-2xl border border-[#ded8d3] bg-[#ded8d3] text-left sm:grid-cols-3">
            {[
              ['LIVE', 'Search and retrieval API'],
              ['BOUNDED', 'No raw source access'],
              ['AUDITABLE', 'Credits, earnings and receipt'],
            ].map(([label, value]) => (
              <div key={label} className="bg-[#fbfaf9] px-5 py-4">
                <p className="text-[10px] font-black tracking-[0.14em] text-[#c83b16]">{label}</p>
                <p className="mt-1 text-sm font-semibold text-[#292624]">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="transaction-room" className="scroll-mt-24 border-b border-[#ded8d3]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-7 grid gap-4 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c83b16]">Fundraising transaction proof</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Show the transaction while it happens.
              </h2>
            </div>
            <p className="text-sm leading-7 text-[#6c6662]">
              The API calls are live. The provider, document and credit economics are illustrative until the first
              licensed supplier document is connected.
            </p>
          </div>
          <ResearchWorkspace />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c83b16]">What this iteration proves</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            The smallest credible knowledge transaction.
          </h2>
        </div>
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {proofPoints.map((point, index) => (
            <article key={point.label} className="rounded-2xl border border-[#d8d1cc] bg-[#fbfaf9] p-6">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#c83b16]">{point.label}</p>
                <span className="font-mono text-xs text-[#aaa19b]">0{index + 1}</span>
              </div>
              <h3 className="mt-8 max-w-lg text-2xl font-semibold tracking-[-0.025em]">{point.title}</h3>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#6c6662]">{point.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#171717] text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ff7653]">From prototype to customer pilot</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Replace the illustrative source. Keep the transaction contract.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/55">
              The next operational milestone is one real, owned PDF and one external buyer. That adds private storage,
              document processing, grounded retrieval and a persistent ledger without changing the product story.
            </p>
          </div>
          <div className="grid gap-3">
            {[
              ['01', 'Store one licensed PDF privately'],
              ['02', 'Extract pages, chunk and embed it'],
              ['03', 'Connect the current endpoints to PostgreSQL'],
              ['04', 'Run repeated paid retrievals with one buyer'],
            ].map(([number, item]) => (
              <div key={number} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                <span className="font-mono text-xs text-[#ff7653]">{number}</span>
                <p className="text-sm font-semibold text-white/85">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="rounded-[28px] border border-[#d8d1cc] bg-[#fbfaf9] p-8 sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c83b16]">Initial wedge</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-2">
            <h2 className="text-4xl font-semibold tracking-[-0.04em]">
              Specialist research that is valuable, owned and hard for agents to procure.
            </h2>
            <div className="space-y-4 text-sm leading-7 text-[#6c6662]">
              <p>
                Start with independent energy, manufacturing, semiconductor and supply-chain research firms that already
                sell to humans but lack machine distribution.
              </p>
              <p>
                FairFetch is not another research database. It is the permission, retrieval and settlement layer between
                an external agent and a knowledge owner.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
