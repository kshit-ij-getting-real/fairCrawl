'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

type WorkspaceStage = 'query' | 'sources' | 'retrieving' | 'answer';

const sources = [
  {
    id: 'gridline',
    provider: 'GridLine Research',
    title: 'India Power Exchanges: Regulation, Market Coupling and the IEX Moat',
    published: '24 July 2026',
    match: '96% match',
    access: 'PAID',
    accessClass: 'border-[#d97706]/25 bg-[#fffbeb] text-[#a16207]',
    price: '₹120',
    license: 'Summary + citations',
  },
  {
    id: 'cea',
    provider: 'Central Electricity Authority',
    title: 'Power Market Monitoring Report',
    published: 'June 2026',
    match: '82% match',
    access: 'ALLOWED',
    accessClass: 'border-[#059669]/20 bg-[#ecfdf5] text-[#047857]',
    price: 'Free',
    license: 'Public source',
  },
  {
    id: 'bank',
    provider: 'Institutional bank research',
    title: 'Indian Utilities and Power Markets',
    published: '18 July 2026',
    match: '88% match',
    access: 'BLOCKED',
    accessClass: 'border-[#dc2626]/20 bg-[#fef2f2] text-[#b91c1c]',
    price: 'Unavailable',
    license: 'No agent licence',
  },
] as const;

const checkpoints = [
  ['Agent identity', 'Aster Wealth Copilot', 'verified'],
  ['Provider policy', 'Summary licence', 'matched'],
  ['Payment', '₹120 retrieval', 'authorised'],
  ['Research', 'Encrypted source', 'delivered'],
] as const;

function StatusDot({ complete }: { complete: boolean }) {
  return (
    <span
      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
        complete
          ? 'border-[#059669] bg-[#059669] text-white'
          : 'border-[#cbd5e1] bg-white text-transparent'
      }`}
      aria-hidden="true"
    >
      ✓
    </span>
  );
}

export function ResearchWorkspace() {
  const [stage, setStage] = useState<WorkspaceStage>('query');
  const [completedChecks, setCompletedChecks] = useState(0);

  const reset = () => {
    setStage('query');
    setCompletedChecks(0);
  };

  const retrieve = async () => {
    setStage('retrieving');
    setCompletedChecks(0);

    for (let index = 1; index <= checkpoints.length; index += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 420));
      setCompletedChecks(index);
    }

    await new Promise((resolve) => window.setTimeout(resolve, 300));
    setStage('answer');
  };

  return (
    <div className="overflow-hidden rounded-[28px] border border-[#dbe3ee] bg-white shadow-[0_32px_90px_rgba(15,23,42,0.12)]">
      <div className="flex flex-col gap-3 border-b border-[#e2e8f0] bg-[#f8fafc] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f172a] text-xs font-bold text-white">
            FF
          </span>
          <div>
            <p className="text-sm font-semibold text-[#0f172a]">Aster Wealth Copilot</p>
            <p className="text-xs text-[#64748b]">Licensed research workspace</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#64748b]">
          <span className="h-2 w-2 rounded-full bg-[#10b981]" />
          Illustrative workspace
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-h-[620px] p-5 sm:p-7">
          {stage === 'query' ? (
            <section className="flex h-full min-h-[560px] flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b]">Step 1 · Ask</p>
              <h1 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight text-[#0f172a] sm:text-4xl">
                Ask across research you do not already subscribe to.
              </h1>
              <div className="mt-8 rounded-2xl border border-[#cbd5e1] bg-white p-3 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
                <label htmlFor="research-query" className="sr-only">
                  Research query
                </label>
                <textarea
                  id="research-query"
                  readOnly
                  value="What could change the earnings power and market position of Indian Energy Exchange over the next 12 months?"
                  className="min-h-[112px] w-full resize-none bg-transparent p-3 text-base leading-7 text-[#1e293b] outline-none"
                />
                <div className="flex flex-col gap-3 border-t border-[#e2e8f0] px-2 pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-[#64748b]">Indian energy and infrastructure sources · ₹500 budget cap</p>
                  <Button
                    onClick={() => setStage('sources')}
                    className="bg-[#0f172a] px-5 py-2.5 shadow-none hover:bg-[#1e293b]"
                  >
                    Find licensed research
                  </Button>
                </div>
              </div>
            </section>
          ) : null}

          {stage === 'sources' ? (
            <section>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b]">Step 2 · Compare</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#0f172a]">3 relevant sources found</h2>
                  <p className="mt-1 text-sm text-[#64748b]">FairFetch checks access before the agent reads anything.</p>
                </div>
                <button onClick={reset} className="text-left text-sm font-semibold text-[#475569] hover:text-[#0f172a]">
                  Edit query
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {sources.map((source) => (
                  <article
                    key={source.id}
                    className={`rounded-2xl border p-4 transition ${
                      source.id === 'gridline'
                        ? 'border-[#334155] bg-[#f8fafc] shadow-[0_12px_34px_rgba(15,23,42,0.08)]'
                        : 'border-[#e2e8f0] bg-white'
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wide ${source.accessClass}`}>
                            {source.access}
                          </span>
                          <span className="text-xs font-semibold text-[#475569]">{source.match}</span>
                        </div>
                        <h3 className="mt-3 text-base font-semibold leading-6 text-[#0f172a]">{source.title}</h3>
                        <p className="mt-1 text-xs text-[#64748b]">
                          {source.provider} · {source.published}
                        </p>
                      </div>
                      <div className="shrink-0 text-left sm:text-right">
                        <p className="text-base font-semibold text-[#0f172a]">{source.price}</p>
                        <p className="mt-1 text-xs text-[#64748b]">{source.license}</p>
                      </div>
                    </div>
                    {source.id === 'gridline' ? (
                      <div className="mt-4 flex flex-col gap-3 border-t border-[#e2e8f0] pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs leading-5 text-[#64748b]">
                          Licence permits answer generation, five citations and 30-day internal retention.
                        </p>
                        <Button
                          onClick={retrieve}
                          className="shrink-0 bg-[#0f172a] px-5 py-2.5 shadow-none hover:bg-[#1e293b]"
                        >
                          License & retrieve · ₹120
                        </Button>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {stage === 'retrieving' ? (
            <section className="flex h-full min-h-[560px] flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b]">Step 3 · Transact</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#0f172a]">Retrieving with permission</h2>
              <p className="mt-2 text-sm text-[#64748b]">
                One request resolves identity, rights, payment and delivery.
              </p>
              <div className="mt-8 max-w-xl overflow-hidden rounded-2xl border border-[#dbe3ee] bg-[#f8fafc]">
                {checkpoints.map(([label, value, status], index) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 border-b border-[#e2e8f0] px-4 py-4 last:border-b-0"
                  >
                    <StatusDot complete={completedChecks > index} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">{label}</p>
                      <p className="mt-0.5 text-sm font-medium text-[#0f172a]">{value}</p>
                    </div>
                    <span className="text-xs capitalize text-[#64748b]">
                      {completedChecks > index ? status : 'checking'}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {stage === 'answer' ? (
            <section>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#059669]">Step 4 · Answer delivered</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#0f172a]">IEX: the next 12 months</h2>
                </div>
                <button onClick={reset} className="text-left text-sm font-semibold text-[#475569] hover:text-[#0f172a]">
                  Run again
                </button>
              </div>

              <div className="mt-6 rounded-2xl border border-[#dbe3ee] bg-[#f8fafc] p-5">
                <p className="text-sm leading-7 text-[#334155]">
                  IEX’s earnings power remains supported by electricity-market volume growth and operating leverage, but
                  its market position is most sensitive to the implementation of market coupling. The specialist source
                  argues that the near-term base case is margin resilience, while the downside case is a slower volume
                  mix and lower pricing power if coupling compresses exchange differentiation.
                </p>
                <div className="mt-5 space-y-3">
                  {[
                    ['Base case', 'Double-digit market-volume growth offsets modest take-rate pressure.'],
                    ['Key risk', 'Faster market-coupling implementation reduces IEX’s liquidity advantage.'],
                    ['Watch next', 'CERC implementation timeline, DAM market share and new-product volumes.'],
                  ].map(([label, body]) => (
                    <div key={label} className="grid gap-1 border-t border-[#e2e8f0] pt-3 sm:grid-cols-[100px_1fr]">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">{label}</p>
                      <p className="text-sm text-[#334155]">{body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-[#bfdbfe] bg-[#eff6ff] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#1d4ed8]">Licensed citation</p>
                <p className="mt-2 text-sm font-medium text-[#1e3a8a]">
                  [1] GridLine Research, “India Power Exchanges: Regulation, Market Coupling and the IEX Moat,” 24 July 2026.
                </p>
                <p className="mt-1 text-xs leading-5 text-[#475569]">
                  Illustrative research content · Summary licence · Five citations allowed · Internal use · Expires 27
                  August 2026.
                </p>
              </div>
            </section>
          ) : null}
        </div>

        <aside className="border-t border-[#e2e8f0] bg-[#0f172a] p-5 text-white lg:border-l lg:border-t-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Transaction ledger</p>
          <div className="mt-5 space-y-4">
            {[
              ['Buyer', 'Aster Wealth Copilot'],
              ['Provider', stage === 'query' ? '—' : 'GridLine Research'],
              ['Access', stage === 'query' ? 'Not checked' : stage === 'sources' ? 'PAID' : 'Licensed'],
              ['Licence', stage === 'query' ? '—' : 'SUMMARY'],
              ['Retrieval price', stage === 'query' ? '—' : '₹120'],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-white/10 pb-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">{label}</p>
                <p className="mt-1 text-sm font-medium text-[#e2e8f0]">{value}</p>
              </div>
            ))}
          </div>

          {stage === 'answer' ? (
            <div className="mt-6 rounded-2xl border border-[#34d399]/25 bg-[#064e3b]/35 p-4">
              <div className="flex items-center gap-2 text-[#6ee7b7]">
                <StatusDot complete />
                <p className="text-xs font-semibold uppercase tracking-wide">Receipt created</p>
              </div>
              <p className="mt-3 font-mono text-xs text-[#d1fae5]">ff_tx_7F41A9</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-[#6ee7b7]">Provider payout</p>
                  <p className="mt-1 font-semibold text-white">₹102</p>
                </div>
                <div>
                  <p className="text-[#6ee7b7]">FairFetch fee</p>
                  <p className="mt-1 font-semibold text-white">₹18</p>
                </div>
              </div>
              <p className="mt-3 text-[10px] leading-4 text-[#a7f3d0]">Illustrative transaction economics.</p>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs leading-5 text-[#94a3b8]">
                FairFetch creates the same auditable record for the AI team and the research provider.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
