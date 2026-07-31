'use client';

import React, { useMemo, useState } from 'react';

type Source = {
  id: string;
  title: string;
  provider: string;
  type: 'Public' | 'Licensed' | 'Internal';
  freshness: string;
  price: number;
  policy: string;
  evidence: string;
};

type UseCase = {
  id: string;
  company: string;
  employee: string;
  task: string;
  outcome: string;
};

const useCases: UseCase[] = [
  {
    id: 'payments-india',
    company: 'Global payments company',
    employee: 'Market Expansion AI Employee',
    task: 'Should we launch instant merchant payouts in India in the next two quarters?',
    outcome: 'Recommend launch, pilot, or wait with evidence, risks, and a decision trace.',
  },
  {
    id: 'delivery-market',
    company: 'Global delivery platform',
    employee: 'Merchant Economics AI Employee',
    task: 'Which Indian city should we enter next, and what merchant commission range is viable?',
    outcome: 'Rank cities using market demand, regulation, competitor economics, and internal thresholds.',
  },
  {
    id: 'mobility-regulation',
    company: 'Global mobility platform',
    employee: 'Regulatory Intelligence AI Employee',
    task: 'What regulatory changes could alter driver economics in our top five Indian cities?',
    outcome: 'Identify changes, quantify exposure, and route material risks for approval.',
  },
];

const sources: Source[] = [
  {
    id: 'rbi',
    title: 'Payment Aggregator and Settlement Guidance',
    provider: 'Reserve Bank of India',
    type: 'Public',
    freshness: 'Updated 3 days ago',
    price: 0,
    policy: 'Allowed for retrieval and citation',
    evidence: 'Defines current settlement, safeguarding, and operational requirements relevant to payout products.',
  },
  {
    id: 'npci',
    title: 'Instant Payments Operating Statistics',
    provider: 'NPCI public data',
    type: 'Public',
    freshness: 'Updated this month',
    price: 0,
    policy: 'Allowed for retrieval and citation',
    evidence: 'Shows transaction growth, participating institutions, and payment rail adoption patterns.',
  },
  {
    id: 'fintech-report',
    title: 'India Merchant Payments Market Map 2026',
    provider: 'Atlas Fintech Research',
    type: 'Licensed',
    freshness: 'Published 12 days ago',
    price: 180,
    policy: 'Summary and citation allowed. No raw document export.',
    evidence: 'Benchmarks merchant segments, adoption barriers, competitor positioning, and market size.',
  },
  {
    id: 'pricing-data',
    title: 'Merchant Payout Pricing Benchmark',
    provider: 'Payments Benchmarking Collective',
    type: 'Licensed',
    freshness: 'Updated 7 days ago',
    price: 120,
    policy: 'Derived metrics allowed. Source-level receipt required.',
    evidence: 'Compares payout pricing, settlement speed, minimum volume, and enterprise contract structures.',
  },
  {
    id: 'internal-policy',
    title: 'India Expansion Risk Policy v4.2',
    provider: 'Enterprise-owned memory',
    type: 'Internal',
    freshness: 'Updated 19 days ago',
    price: 0,
    policy: 'Private. Never shared with external providers.',
    evidence: 'Contains internal margin floor, compliance threshold, launch criteria, and prior exception rules.',
  },
  {
    id: 'prior-decision',
    title: 'Brazil Instant Payout Pilot Decision Trace',
    provider: 'Enterprise-owned memory',
    type: 'Internal',
    freshness: 'Decision closed 4 months ago',
    price: 0,
    policy: 'Private precedent. Use for internal reasoning only.',
    evidence: 'Records the evidence, rejected options, executive override, and outcome from a similar market launch.',
  },
];

const steps = ['Define task', 'Select knowledge', 'Review brief', 'Save judgment'];

function money(value: number) {
  return value === 0 ? 'Free' : `₹${value}`;
}

export default function ZampIntelligenceGatewayPage() {
  const [selectedUseCase, setSelectedUseCase] = useState(useCases[0]);
  const [task, setTask] = useState(useCases[0].task);
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([
    'rbi',
    'npci',
    'fintech-report',
    'pricing-data',
    'internal-policy',
    'prior-decision',
  ]);
  const [step, setStep] = useState(0);
  const [decision, setDecision] = useState<'approve' | 'edit' | null>(null);
  const [correction, setCorrection] = useState(
    'Pilot with enterprise merchants first. Do not launch broadly until settlement failure rate stays below the internal threshold for 30 days.',
  );
  const [saved, setSaved] = useState(false);

  const selectedSources = useMemo(
    () => sources.filter((source) => selectedSourceIds.includes(source.id)),
    [selectedSourceIds],
  );

  const externalCost = selectedSources.reduce((sum, source) => sum + source.price, 0);
  const externalCount = selectedSources.filter((source) => source.type !== 'Internal').length;
  const internalCount = selectedSources.filter((source) => source.type === 'Internal').length;

  function chooseUseCase(useCase: UseCase) {
    setSelectedUseCase(useCase);
    setTask(useCase.task);
    setStep(0);
    setDecision(null);
    setSaved(false);
  }

  function toggleSource(id: string) {
    setSelectedSourceIds((current) =>
      current.includes(id) ? current.filter((sourceId) => sourceId !== id) : [...current, id],
    );
  }

  return (
    <main className="min-h-screen bg-[#090b10] text-[#f7f5ec]">
      <div className="mx-auto max-w-[1500px] px-5 py-6 md:px-8 lg:px-12">
        <header className="border-b border-white/10 pb-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a9b7ff]">
                Zamp Intelligence Gateway
              </p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.045em] md:text-6xl">
                Bring intelligence to knowledge. Keep judgment with the enterprise.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-white/58 md:text-lg">
                AI employees use distributed external knowledge without centralising it into one model. Sources stay governed,
                access stays auditable, and the decision trace stays inside the customer workspace.
              </p>
            </div>
            <div className="grid min-w-[310px] grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/[0.035] p-3">
              <Metric value={`${externalCount}`} label="External sources" />
              <Metric value={`${internalCount}`} label="Private sources" />
              <Metric value={money(externalCost)} label="Research cost" />
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <Panel>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Customer workflow</p>
              <div className="mt-4 space-y-2">
                {useCases.map((useCase) => {
                  const active = useCase.id === selectedUseCase.id;
                  return (
                    <button
                      key={useCase.id}
                      onClick={() => chooseUseCase(useCase)}
                      className={`w-full rounded-xl border p-3 text-left transition ${
                        active
                          ? 'border-[#91a1ff]/60 bg-[#91a1ff]/10 text-white'
                          : 'border-white/8 bg-white/[0.02] text-white/55 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#a9b7ff]">
                        {useCase.company}
                      </span>
                      <span className="mt-1 block text-sm font-medium leading-5">{useCase.employee}</span>
                    </button>
                  );
                })}
              </div>
            </Panel>

            <Panel>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Demo flow</p>
              <div className="mt-4 space-y-2">
                {steps.map((label, index) => (
                  <button
                    key={label}
                    onClick={() => setStep(index)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      step === index ? 'bg-white text-[#11131a]' : 'text-white/48 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        step === index ? 'bg-[#11131a] text-white' : 'border border-white/15'
                      }`}
                    >
                      {index + 1}
                    </span>
                    {label}
                  </button>
                ))}
              </div>
            </Panel>

            <div className="rounded-2xl border border-[#84d8aa]/20 bg-[#84d8aa]/8 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9ce1ba]">Ownership rule</p>
              <p className="mt-2 text-sm leading-6 text-white/62">
                External providers receive the query they are allowed to answer. They do not receive the customer&apos;s private
                policy, rejected options, or human correction.
              </p>
            </div>
          </aside>

          <section className="min-w-0">
            {step === 0 && (
              <Panel className="min-h-[680px]">
                <SectionHeader
                  number="01"
                  title="Define the outcome"
                  description="The AI employee starts with a business decision, not a search box."
                />

                <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.6fr)]">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">Decision task</label>
                    <textarea
                      value={task}
                      onChange={(event) => setTask(event.target.value)}
                      className="mt-3 min-h-[180px] w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-5 text-xl leading-8 text-white outline-none transition focus:border-[#91a1ff]/60"
                    />
                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      <InputCard label="AI employee" value={selectedUseCase.employee} />
                      <InputCard label="Expected output" value={selectedUseCase.outcome} />
                      <InputCard label="Authority" value="Research and recommend. Human approves launch." />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a9b7ff]">Research plan</p>
                    <div className="mt-5 space-y-4">
                      <PlanItem title="Regulation" body="Find the latest primary-source rules that constrain launch." />
                      <PlanItem title="Market" body="Retrieve paid market structure and adoption research." />
                      <PlanItem title="Economics" body="Benchmark pricing and settlement models." />
                      <PlanItem title="Company judgment" body="Apply private policy and similar prior decisions." />
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="mt-7 w-full rounded-xl bg-[#f7f5ec] px-4 py-3 text-sm font-semibold text-[#11131a] transition hover:bg-white"
                    >
                      Find governed sources
                    </button>
                  </div>
                </div>
              </Panel>
            )}

            {step === 1 && (
              <Panel className="min-h-[680px]">
                <SectionHeader
                  number="02"
                  title="Select distributed knowledge"
                  description="The gateway finds sources, checks policy, and exposes cost before the agent retrieves anything."
                />

                <div className="mt-7 grid gap-3">
                  {sources.map((source) => {
                    const selected = selectedSourceIds.includes(source.id);
                    return (
                      <button
                        key={source.id}
                        onClick={() => toggleSource(source.id)}
                        className={`grid w-full gap-4 rounded-2xl border p-4 text-left transition md:grid-cols-[34px_minmax(0,1fr)_180px_100px] md:items-center ${
                          selected
                            ? 'border-[#91a1ff]/45 bg-[#91a1ff]/8'
                            : 'border-white/8 bg-white/[0.02] opacity-55 hover:opacity-85'
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-lg border text-xs font-semibold ${
                            selected ? 'border-[#91a1ff] bg-[#91a1ff] text-[#10131b]' : 'border-white/20 text-white/40'
                          }`}
                        >
                          {selected ? '✓' : ''}
                        </span>
                        <span>
                          <span className="flex flex-wrap items-center gap-2">
                            <strong className="text-sm text-white">{source.title}</strong>
                            <TypeBadge type={source.type} />
                          </span>
                          <span className="mt-1 block text-sm text-white/42">{source.provider}</span>
                          <span className="mt-2 block text-sm leading-6 text-white/62">{source.evidence}</span>
                        </span>
                        <span>
                          <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/30">Policy</span>
                          <span className="mt-1 block text-sm leading-5 text-white/58">{source.policy}</span>
                        </span>
                        <span className="text-right">
                          <strong className="block text-lg text-white">{money(source.price)}</strong>
                          <span className="mt-1 block text-xs text-white/35">{source.freshness}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Research budget: {money(externalCost)}</p>
                    <p className="mt-1 text-sm text-white/42">
                      {selectedSources.length} sources selected. Private context remains inside the enterprise workspace.
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    disabled={selectedSources.length === 0}
                    className="rounded-xl bg-[#f7f5ec] px-5 py-3 text-sm font-semibold text-[#11131a] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Retrieve and build brief
                  </button>
                </div>
              </Panel>
            )}

            {step === 2 && (
              <Panel className="min-h-[680px]">
                <SectionHeader
                  number="03"
                  title="Review the decision brief"
                  description="The answer shows what the agent believes, what evidence changed the answer, and what it cost."
                />

                <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9ce1ba]">Recommendation</p>
                        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em]">Run a controlled pilot</h2>
                      </div>
                      <div className="rounded-xl border border-[#9ce1ba]/25 bg-[#9ce1ba]/10 px-4 py-2 text-sm font-semibold text-[#b8eccd]">
                        82% confidence
                      </div>
                    </div>

                    <p className="mt-5 text-base leading-7 text-white/68">
                      Launch a 90-day pilot for enterprise merchants. The market and payment rail are large enough to justify
                      entry, but regulatory operating requirements and pricing pressure make a broad launch premature.
                    </p>

                    <div className="mt-6 space-y-4">
                      <EvidencePoint
                        title="Why now"
                        body="Payment rail adoption and merchant demand support a pilot, while the market report identifies a clear enterprise segment with higher willingness to pay for faster settlement."
                        sources="RBI, NPCI, Atlas Fintech Research"
                      />
                      <EvidencePoint
                        title="Main risk"
                        body="A full launch could miss the internal margin floor if pricing is set at the market median before failure and support costs are measured."
                        sources="Pricing Benchmark, Internal Risk Policy"
                      />
                      <EvidencePoint
                        title="Precedent"
                        body="The Brazil pilot succeeded after limiting the first cohort and requiring an operational threshold before broader rollout."
                        sources="Enterprise decision memory"
                      />
                    </div>

                    <div className="mt-6 rounded-xl border border-[#e4bc73]/20 bg-[#e4bc73]/8 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f0ca83]">Agent uncertainty</p>
                      <p className="mt-2 text-sm leading-6 text-white/62">
                        The licensed benchmark covers published contract structures, not negotiated rebates. Human review is
                        required before setting final pricing.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Panel className="bg-black/20">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">Run economics</p>
                      <div className="mt-4 space-y-3">
                        <RunLine label="External research" value={money(externalCost)} />
                        <RunLine label="Model and tool cost" value="₹34" />
                        <RunLine label="Human review" value="6 min" />
                        <RunLine label="Total decision cost" value={`₹${externalCost + 34}`} strong />
                      </div>
                    </Panel>

                    <Panel className="bg-black/20">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">Source receipts</p>
                      <div className="mt-4 space-y-3">
                        {selectedSources.map((source) => (
                          <div key={source.id} className="flex items-start justify-between gap-3 border-b border-white/8 pb-3 last:border-0 last:pb-0">
                            <div>
                              <p className="text-sm font-medium text-white/78">{source.provider}</p>
                              <p className="mt-1 text-xs text-white/35">{source.type} · {source.freshness}</p>
                            </div>
                            <span className="text-sm font-semibold text-white/68">{money(source.price)}</span>
                          </div>
                        ))}
                      </div>
                    </Panel>

                    <button
                      onClick={() => setStep(3)}
                      className="w-full rounded-xl bg-[#f7f5ec] px-5 py-3 text-sm font-semibold text-[#11131a]"
                    >
                      Send for human decision
                    </button>
                  </div>
                </div>
              </Panel>
            )}

            {step === 3 && (
              <Panel className="min-h-[680px]">
                <SectionHeader
                  number="04"
                  title="Save the human judgment"
                  description="The enterprise keeps the correction, rationale, and outcome. The shared model does not get the private learning."
                />

                <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">Human decision</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <button
                        onClick={() => setDecision('approve')}
                        className={`rounded-xl border p-4 text-left transition ${
                          decision === 'approve'
                            ? 'border-[#9ce1ba]/60 bg-[#9ce1ba]/10'
                            : 'border-white/10 bg-black/20 hover:border-white/25'
                        }`}
                      >
                        <strong className="block text-base text-white">Approve recommendation</strong>
                        <span className="mt-2 block text-sm leading-6 text-white/45">Save the pilot recommendation as proposed.</span>
                      </button>
                      <button
                        onClick={() => setDecision('edit')}
                        className={`rounded-xl border p-4 text-left transition ${
                          decision === 'edit'
                            ? 'border-[#a9b7ff]/60 bg-[#a9b7ff]/10'
                            : 'border-white/10 bg-black/20 hover:border-white/25'
                        }`}
                      >
                        <strong className="block text-base text-white">Approve with correction</strong>
                        <span className="mt-2 block text-sm leading-6 text-white/45">Add judgment the agent missed.</span>
                      </button>
                    </div>

                    <label className="mt-6 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      Decision rationale
                    </label>
                    <textarea
                      value={correction}
                      onChange={(event) => setCorrection(event.target.value)}
                      className="mt-3 min-h-[170px] w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-4 text-base leading-7 text-white outline-none focus:border-[#91a1ff]/60"
                    />

                    <button
                      onClick={() => {
                        setSaved(true);
                        if (!decision) setDecision('edit');
                      }}
                      className="mt-4 rounded-xl bg-[#f7f5ec] px-5 py-3 text-sm font-semibold text-[#11131a]"
                    >
                      Save to enterprise memory
                    </button>
                  </div>

                  <div className="space-y-4">
                    <Panel className="bg-black/20">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a9b7ff]">Decision trace</p>
                      <div className="mt-5 space-y-4">
                        <TraceItem time="09:41" body="AI employee received a launch decision task." />
                        <TraceItem time="09:42" body={`${selectedSources.length} governed sources selected.`} />
                        <TraceItem time="09:44" body={`₹${externalCost} in licensed research approved and retrieved.`} />
                        <TraceItem time="09:46" body="Agent recommended a controlled pilot." />
                        <TraceItem time="09:51" body={saved ? 'Human correction saved as private precedent.' : 'Awaiting human decision.'} active={!saved} />
                      </div>
                    </Panel>

                    <div className={`rounded-2xl border p-5 transition ${saved ? 'border-[#9ce1ba]/30 bg-[#9ce1ba]/10' : 'border-white/10 bg-white/[0.03]'}`}>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">What compounds</p>
                      <p className="mt-3 text-lg font-semibold text-white">
                        {saved ? 'The next market decision starts with this precedent.' : 'The enterprise owns the final learning.'}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/50">
                        Sources remain distributed. The private rationale, exception rule, and outcome stay inside the customer&apos;s Zamp workspace.
                      </p>
                    </div>
                  </div>
                </div>
              </Panel>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-white/10 bg-[#11141b] p-5 md:p-6 ${className}`}>{children}</div>;
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-black/20 p-3 text-center">
      <strong className="block text-xl font-semibold text-white">{value}</strong>
      <span className="mt-1 block text-[11px] leading-4 text-white/35">{label}</span>
    </div>
  );
}

function SectionHeader({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex flex-col gap-3 border-b border-white/8 pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a9b7ff]">{number}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-white">{title}</h2>
      </div>
      <p className="max-w-xl text-sm leading-6 text-white/45">{description}</p>
    </div>
  );
}

function InputCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.025] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/30">{label}</p>
      <p className="mt-2 text-sm leading-6 text-white/65">{value}</p>
    </div>
  );
}

function PlanItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-b border-white/8 pb-4 last:border-0 last:pb-0">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm leading-6 text-white/45">{body}</p>
    </div>
  );
}

function TypeBadge({ type }: { type: Source['type'] }) {
  const classes = {
    Public: 'border-[#88b7ff]/20 bg-[#88b7ff]/10 text-[#a9c9ff]',
    Licensed: 'border-[#e4bc73]/20 bg-[#e4bc73]/10 text-[#f0ca83]',
    Internal: 'border-[#9ce1ba]/20 bg-[#9ce1ba]/10 text-[#b8eccd]',
  }[type];

  return <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${classes}`}>{type}</span>;
}

function EvidencePoint({ title, body, sources: sourceNames }: { title: string; body: string; sources: string }) {
  return (
    <div className="border-t border-white/8 pt-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-white/58">{body}</p>
      <p className="mt-2 text-xs text-[#a9b7ff]">Evidence: {sourceNames}</p>
    </div>
  );
}

function RunLine({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between border-b border-white/8 pb-3 last:border-0 last:pb-0 ${strong ? 'pt-1' : ''}`}>
      <span className={`text-sm ${strong ? 'font-semibold text-white' : 'text-white/45'}`}>{label}</span>
      <span className={`text-sm ${strong ? 'font-semibold text-white' : 'text-white/68'}`}>{value}</span>
    </div>
  );
}

function TraceItem({ time, body, active = false }: { time: string; body: string; active?: boolean }) {
  return (
    <div className="grid grid-cols-[45px_12px_1fr] gap-3">
      <span className="text-xs text-white/30">{time}</span>
      <span className={`mt-1 h-2.5 w-2.5 rounded-full ${active ? 'bg-[#e4bc73]' : 'bg-[#91a1ff]'}`} />
      <p className="text-sm leading-5 text-white/58">{body}</p>
    </div>
  );
}
