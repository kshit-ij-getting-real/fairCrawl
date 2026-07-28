'use client';

import { useState, type ReactNode } from 'react';
import {
  PILOT_API_KEY,
  PILOT_DOCUMENT,
  PILOT_ECONOMICS,
  PILOT_QUERY,
} from '@/lib/pilotTransaction';

type WorkspaceStage = 'supply' | 'agent' | 'search' | 'source' | 'transacting' | 'receipt';

type SearchResult = {
  document_id: string;
  title: string;
  publisher: string;
  description: string;
  relevance_score: number;
  credit_cost: number;
  access_modes: string[];
  license_status: string;
  raw_source_exposed: boolean;
};

type TransactionResponse = {
  transaction_id: string;
  status: string;
  answer: string;
  findings: Array<{ label: string; value: string }>;
  citation: {
    document_id: string;
    title: string;
    publisher: string;
    page: number;
    section: string;
  };
  metering: {
    credits_before: number;
    credits_charged: number;
    credits_remaining: number;
  };
  settlement: {
    publisher_gross_credits: number;
    platform_fee_credits: number;
    publisher_net_credits: number;
  };
  controls: {
    raw_source_exposed: boolean;
    response_hash: string;
    idempotency_key: string;
    pilot_ledger: string;
  };
};

const progress = [
  ['01', 'Licensed supply'],
  ['02', 'Agent identity'],
  ['03', 'Paid retrieval'],
  ['04', 'Receipt'],
] as const;

const transactionChecks = [
  ['API key', 'Aster Strategy Agent', 'authenticated'],
  ['Licence', 'Answer mode · 600 characters quoted', 'permitted'],
  ['Credits', '5 credits from 100 available', 'authorised'],
  ['Source', 'Private file · three bounded chunks', 'protected'],
  ['Settlement', '4 publisher · 1 FairFetch', 'recorded'],
] as const;

const stageIndex: Record<WorkspaceStage, number> = {
  supply: 0,
  agent: 1,
  search: 2,
  source: 2,
  transacting: 2,
  receipt: 3,
};

const sleep = (milliseconds: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

function CheckMark({ complete }: { complete: boolean }) {
  return (
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
        complete
          ? 'border-[#ff4f1f] bg-[#ff4f1f] text-white'
          : 'border-[#cfc7c1] bg-white text-transparent'
      }`}
      aria-hidden="true"
    >
      ✓
    </span>
  );
}

function StatusPill({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'good' | 'accent';
}) {
  const classes = {
    neutral: 'border-[#d8d1cc] bg-[#f4f0ed] text-[#625d59]',
    good: 'border-[#b7ddca] bg-[#ecf8f2] text-[#167451]',
    accent: 'border-[#ff4f1f]/25 bg-[#fff0ea] text-[#c83b16]',
  }[tone];

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${classes}`}>
      {children}
    </span>
  );
}

export function ResearchWorkspace() {
  const [stage, setStage] = useState<WorkspaceStage>('supply');
  const [query, setQuery] = useState(PILOT_QUERY);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [transaction, setTransaction] = useState<TransactionResponse | null>(null);
  const [completedChecks, setCompletedChecks] = useState(0);
  const [error, setError] = useState('');
  const currentProgress = stageIndex[stage];

  const reset = () => {
    setStage('supply');
    setQuery(PILOT_QUERY);
    setSearchResult(null);
    setTransaction(null);
    setCompletedChecks(0);
    setError('');
  };

  const search = async () => {
    setError('');

    try {
      const response = await fetch('/api/v1/pilot/search', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PILOT_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, limit: 3 }),
      });
      const body = await response.json();

      if (!response.ok || !body.results?.[0]) {
        throw new Error(body.message || 'Search could not be completed.');
      }

      setSearchResult(body.results[0]);
      setStage('source');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Search could not be completed.');
    }
  };

  const retrieve = async () => {
    if (!searchResult) return;

    setError('');
    setCompletedChecks(0);
    setStage('transacting');

    try {
      const responsePromise = fetch('/api/v1/pilot/retrieve', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PILOT_API_KEY}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': 'fundraise-pilot-iex-001',
        },
        body: JSON.stringify({
          document_id: searchResult.document_id,
          question: query,
        }),
      }).then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.message || body.error || 'Retrieval could not be completed.');
        return body as TransactionResponse;
      });

      for (let index = 1; index <= transactionChecks.length; index += 1) {
        await sleep(360);
        setCompletedChecks(index);
      }

      const result = await responsePromise;
      setTransaction(result);
      await sleep(240);
      setStage('receipt');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Retrieval could not be completed.');
      setStage('source');
    }
  };

  const balance =
    stage === 'receipt' && transaction
      ? transaction.metering.credits_remaining
      : PILOT_ECONOMICS.startingCredits;

  return (
    <div className="overflow-hidden rounded-[30px] border border-[#d8d1cc] bg-[#fbfaf9] shadow-[0_32px_90px_rgba(44,35,28,0.12)]">
      <div className="border-b border-[#ded8d3] bg-[#171717] px-5 py-4 text-white sm:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff4f1f] text-xs font-black">
              FF
            </span>
            <div>
              <p className="text-sm font-semibold">FairFetch transaction room</p>
              <p className="text-xs text-white/55">Live API calls · illustrative licensed content</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {progress.map(([number, label], index) => {
              const complete = index < currentProgress || stage === 'receipt';
              const active = index === currentProgress && stage !== 'receipt';
              return (
                <div
                  key={number}
                  className={`rounded-xl border px-3 py-2 ${
                    active
                      ? 'border-[#ff4f1f] bg-[#ff4f1f]/10'
                      : complete
                        ? 'border-white/20 bg-white/10'
                        : 'border-white/10'
                  }`}
                >
                  <p className={`text-[9px] font-bold ${active ? 'text-[#ff7653]' : 'text-white/40'}`}>{number}</p>
                  <p className="mt-1 text-[10px] font-semibold text-white/85">{label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_310px]">
        <div className="min-h-[650px] p-5 sm:p-8">
          {error ? (
            <div role="alert" className="mb-5 rounded-xl border border-[#efb8aa] bg-[#fff0ea] px-4 py-3 text-sm text-[#a72f13]">
              {error}
            </div>
          ) : null}

          {stage === 'supply' ? (
            <section>
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c83b16]">Step 1 · Licensed supply</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#171717] sm:text-4xl">
                  Start with one premium document.
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#6c6662]">
                  The source is registered, priced and permissioned before any agent can retrieve from it.
                </p>
              </div>

              <article className="mt-8 overflow-hidden rounded-2xl border border-[#d8d1cc] bg-white">
                <div className="border-b border-[#e6e1dd] bg-[#f4f0ed] px-5 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d8d1cc] bg-white text-xs font-black text-[#171717]">
                        PDF
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-[#7c746f]">{PILOT_DOCUMENT.category}</p>
                        <p className="mt-0.5 text-sm font-semibold text-[#171717]">{PILOT_DOCUMENT.publisher}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <StatusPill tone="good">Licence active</StatusPill>
                      <StatusPill>Private source</StatusPill>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="max-w-2xl text-xl font-semibold leading-7 text-[#171717]">{PILOT_DOCUMENT.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6c6662]">{PILOT_DOCUMENT.description}</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      ['Ownership', 'Attested'],
                      ['Access mode', 'Answer only'],
                      ['Price', '5 credits'],
                      ['Quote limit', '600 characters'],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-xl bg-[#f7f4f1] p-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#918984]">{label}</p>
                        <p className="mt-2 text-sm font-semibold text-[#292624]">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-col gap-3 border-t border-[#e6e1dd] pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-mono text-[11px] text-[#7c746f]">{PILOT_DOCUMENT.privateFile.fileHash}</p>
                    <button
                      type="button"
                      onClick={() => setStage('agent')}
                      className="rounded-full bg-[#ff4f1f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e63f14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4f1f]"
                    >
                      Confirm licensed supply
                    </button>
                  </div>
                </div>
              </article>
            </section>
          ) : null}

          {stage === 'agent' ? (
            <section>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c83b16]">Step 2 · Agent identity</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#171717] sm:text-4xl">
                Give one external agent a spending identity.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6c6662]">
                The public pilot key has no production privileges. It proves the authentication and metering contract an
                external client will use.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#d8d1cc] bg-white p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#918984]">Service user</p>
                  <p className="mt-3 text-lg font-semibold text-[#171717]">Aster Strategy Agent</p>
                  <p className="mt-1 text-sm text-[#6c6662]">Buyer: Aster Wealth · Active</p>
                  <div className="mt-5 rounded-xl bg-[#171717] p-4 text-white">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-white/45">API key</p>
                    <p className="mt-2 font-mono text-xs text-[#ff9f84]">{PILOT_API_KEY}</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-[#d8d1cc] bg-white p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#918984]">Credit account</p>
                  <p className="mt-3 text-5xl font-semibold tracking-[-0.05em] text-[#171717]">100</p>
                  <p className="mt-1 text-sm text-[#6c6662]">Pilot credits available</p>
                  <div className="mt-5 flex items-center justify-between rounded-xl bg-[#f7f4f1] p-3 text-sm">
                    <span className="text-[#6c6662]">Per-request cap</span>
                    <span className="font-semibold text-[#171717]">10 credits</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStage('search')}
                  className="rounded-full bg-[#ff4f1f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e63f14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4f1f]"
                >
                  Activate agent
                </button>
              </div>
            </section>
          ) : null}

          {stage === 'search' ? (
            <section>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c83b16]">Step 3 · Search</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#171717] sm:text-4xl">
                Find the right licensed source before paying.
              </h2>
              <div className="mt-8 rounded-2xl border border-[#d8d1cc] bg-white p-4">
                <label htmlFor="research-query" className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#918984]">
                  Agent question
                </label>
                <textarea
                  id="research-query"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="mt-3 min-h-[120px] w-full resize-none bg-transparent text-base leading-7 text-[#292624] outline-none"
                />
                <div className="flex flex-col gap-3 border-t border-[#e6e1dd] pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-mono text-[11px] text-[#7c746f]">POST /api/v1/pilot/search</p>
                    <p className="mt-1 text-xs text-[#918984]">Metadata only · no source passage returned</p>
                  </div>
                  <button
                    type="button"
                    onClick={search}
                    disabled={query.trim().length < 8}
                    className="rounded-full bg-[#ff4f1f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e63f14] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4f1f]"
                  >
                    Search licensed research
                  </button>
                </div>
              </div>
            </section>
          ) : null}

          {stage === 'source' && searchResult ? (
            <section>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c83b16]">Source resolved</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#171717]">
                    One eligible source found.
                  </h2>
                </div>
                <button type="button" onClick={() => setStage('search')} className="text-sm font-semibold text-[#6c6662] hover:text-[#171717]">
                  Edit question
                </button>
              </div>

              <article className="mt-7 rounded-2xl border border-[#ff4f1f]/35 bg-white p-5 shadow-[0_14px_36px_rgba(60,42,31,0.08)]">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap gap-2">
                      <StatusPill tone="accent">Paid · Answer</StatusPill>
                      <StatusPill tone="good">{Math.round(searchResult.relevance_score * 100)}% match</StatusPill>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold leading-7 text-[#171717]">{searchResult.title}</h3>
                    <p className="mt-2 text-sm text-[#6c6662]">{searchResult.publisher}</p>
                    <p className="mt-4 text-sm leading-6 text-[#6c6662]">{searchResult.description}</p>
                  </div>
                  <div className="shrink-0 rounded-xl bg-[#f7f4f1] px-5 py-4 text-left sm:text-right">
                    <p className="text-3xl font-semibold tracking-[-0.04em] text-[#171717]">{searchResult.credit_cost}</p>
                    <p className="text-xs text-[#6c6662]">credits per answer</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-3 border-t border-[#e6e1dd] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xl text-xs leading-5 text-[#7c746f]">
                    Policy permits a grounded answer and citation. The PDF and unrestricted chunks remain private.
                  </p>
                  <button
                    type="button"
                    onClick={retrieve}
                    className="shrink-0 rounded-full bg-[#171717] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#34302d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                  >
                    Pay 5 credits & retrieve
                  </button>
                </div>
              </article>

              <div className="mt-5 rounded-xl border border-[#d8d1cc] bg-[#f4f0ed] p-4 font-mono text-[11px] leading-6 text-[#625d59]">
                <p>Authorization: Bearer {PILOT_API_KEY}</p>
                <p>Idempotency-Key: fundraise-pilot-iex-001</p>
                <p>POST /api/v1/pilot/retrieve</p>
              </div>
            </section>
          ) : null}

          {stage === 'transacting' ? (
            <section className="flex min-h-[560px] flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c83b16]">Executing transaction</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#171717]">
                Five checks. One paid answer.
              </h2>
              <p className="mt-3 text-sm text-[#6c6662]">
                The endpoint is authenticating, enforcing the licence, metering usage and writing the pilot receipt.
              </p>
              <div className="mt-8 max-w-2xl overflow-hidden rounded-2xl border border-[#d8d1cc] bg-white">
                {transactionChecks.map(([label, value, status], index) => (
                  <div key={label} className="flex items-center gap-3 border-b border-[#e6e1dd] px-4 py-4 last:border-0">
                    <CheckMark complete={completedChecks > index} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#918984]">{label}</p>
                      <p className="mt-1 text-sm font-medium text-[#292624]">{value}</p>
                    </div>
                    <span className="text-xs text-[#7c746f]">{completedChecks > index ? status : 'checking'}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {stage === 'receipt' && transaction ? (
            <section>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#167451]">Transaction completed</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#171717]">
                    The agent got an answer. The source stayed private.
                  </h2>
                </div>
                <button type="button" onClick={reset} className="text-sm font-semibold text-[#6c6662] hover:text-[#171717]">
                  Run again
                </button>
              </div>

              <div className="mt-7 rounded-2xl border border-[#d8d1cc] bg-white p-5">
                <p className="text-sm leading-7 text-[#3f3a37]">{transaction.answer}</p>
                <div className="mt-5 grid gap-3">
                  {transaction.findings.map((finding) => (
                    <div key={finding.label} className="grid gap-1 border-t border-[#e6e1dd] pt-3 sm:grid-cols-[100px_1fr]">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#918984]">{finding.label}</p>
                      <p className="text-sm text-[#4f4945]">{finding.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-[#ffc4b3] bg-[#fff0ea] p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill tone="accent">Licensed citation</StatusPill>
                  <StatusPill tone="good">Raw source not exposed</StatusPill>
                </div>
                <p className="mt-3 text-sm font-semibold leading-6 text-[#70250f]">
                  [1] {transaction.citation.publisher}, “{transaction.citation.title},” page {transaction.citation.page},{' '}
                  {transaction.citation.section}.
                </p>
                <p className="mt-2 font-mono text-[10px] text-[#9a4c35]">
                  response_hash: {transaction.controls.response_hash.slice(0, 24)}…
                </p>
              </div>
            </section>
          ) : null}
        </div>

        <aside className="border-t border-[#d8d1cc] bg-[#f0ebe7] p-5 lg:border-l lg:border-t-0">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7c746f]">Proof ledger</p>
            <span className="h-2 w-2 rounded-full bg-[#ff4f1f]" />
          </div>

          <div className="mt-5 rounded-2xl bg-[#171717] p-4 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Buyer balance</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-4xl font-semibold tracking-[-0.05em]">{balance}</p>
              <p className="pb-1 text-xs text-white/50">credits</p>
            </div>
            {stage === 'receipt' ? (
              <p className="mt-3 border-t border-white/10 pt-3 text-xs text-[#ff9f84]">−5 credits · transaction completed</p>
            ) : (
              <p className="mt-3 border-t border-white/10 pt-3 text-xs text-white/45">Budget cap: 10 per request</p>
            )}
          </div>

          <div className="mt-5 space-y-4">
            {[
              ['Buyer', currentProgress >= 1 ? 'Aster Wealth' : 'Not connected'],
              ['Agent', currentProgress >= 1 ? 'Aster Strategy Agent' : 'Not authenticated'],
              ['Document', currentProgress >= 0 ? PILOT_DOCUMENT.id : '—'],
              ['Licence', currentProgress >= 0 ? 'ACTIVE · ANSWER' : '—'],
              ['Source file', 'PRIVATE'],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-[#d8d1cc] pb-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#918984]">{label}</p>
                <p className="mt-1 break-words text-sm font-semibold text-[#292624]">{value}</p>
              </div>
            ))}
          </div>

          {transaction ? (
            <div className="mt-5 rounded-2xl border border-[#ff4f1f]/25 bg-[#fff0ea] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#c83b16]">Shared receipt</p>
              <p className="mt-2 break-all font-mono text-xs text-[#70250f]">{transaction.transaction_id}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  ['Gross', transaction.settlement.publisher_gross_credits],
                  ['Fee', transaction.settlement.platform_fee_credits],
                  ['Net', transaction.settlement.publisher_net_credits],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-white/70 p-2">
                    <p className="text-[9px] uppercase text-[#9a4c35]">{label}</p>
                    <p className="mt-1 text-sm font-bold text-[#70250f]">{value}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[10px] leading-4 text-[#9a4c35]">
                Ephemeral pilot ledger. Illustrative content and credits; no real payment was processed.
              </p>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-[#d8d1cc] bg-white/60 p-4">
              <p className="text-xs leading-5 text-[#6c6662]">
                This ledger fills as the licensed access, metering and settlement contract is executed.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
