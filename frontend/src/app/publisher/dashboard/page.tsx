'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, clearSession, getRole } from '../../../lib/api';
import { MarketingCard } from '../../../components/ui/MarketingCard';
import { SectionActions } from '../../../components/ui/SectionActions';
import { formatMicrosToCurrency, formatPricePerThousand } from '../../../lib/money';
import { SectionEyebrow } from '../../../components/ui/SectionEyebrow';
import { PrimaryButton, SecondaryButton } from '../../../components/ui/Buttons';
import { UsageTable } from '../../../components/ui/UsageTable';
import { MetricCard } from '../../../components/ui/MetricCard';

interface Domain {
  id: number;
  name: string;
  verified: boolean;
  policies: any[];
}

type AccessType = 'OPEN' | 'PAID' | 'BLOCKED';

interface AccessRule {
  id: number;
  pathPattern: string;
  accessType: AccessType;
  priceMicros: number;
  maxRps: number | null;
}

interface ReadEvent {
  id: string;
  url: string;
  path: string;
  accessType: AccessType;
  priceMicros: number;
  createdAt: string;
  aiClient: { id: number; name: string };
}

interface EarningsSummary {
  totalReads: number;
  totalEarningsMicros: number;
  paidReads: number;
  paidEarningsMicros: number;
  last7Days: { reads: number; earningsMicros: number };
  last30Days: { reads: number; earningsMicros: number };
  topClients: { aiClientId: number; name: string; reads: number; earningsMicros: number }[];
}

export default function PublisherDashboard() {
  const router = useRouter();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [domainName, setDomainName] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<number | null>(null);
  const [analytics, setAnalytics] = useState<Record<number, any>>({});
  const [rules, setRules] = useState<AccessRule[]>([]);
  const [readEvents, setReadEvents] = useState<ReadEvent[]>([]);
  const [earningsSummary, setEarningsSummary] = useState<EarningsSummary | null>(null);
  const [policyForm, setPolicyForm] = useState({
    pathPattern: '/*',
    accessType: 'OPEN' as AccessType,
    pricePerThousand: '0',
    maxRps: '',
  });
  const [verificationToken, setVerificationToken] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [ruleError, setRuleError] = useState<string | null>(null);

  const inputClasses =
    'w-full rounded-xl border border-white/15 bg-[#101424] px-4 py-2 text-sm text-white shadow-sm outline-none ring-0 placeholder:text-white/40 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40';

  const getDomainFromUrl = (url?: string) => {
    if (!url) return '—';
    try {
      return new URL(url).hostname;
    } catch {
      return url.replace(/^https?:\/\//, '').split('/')[0] || '—';
    }
  };

  useEffect(() => {
    if (getRole() !== 'PUBLISHER') {
      router.replace('/login');
      return;
    }
    loadDomains();
  }, [router]);

  const loadAnalytics = async (domainId: number) => {
    try {
      const stats = await apiFetch(`/api/publisher/domains/${domainId}/analytics`);
      setAnalytics((prev) => ({ ...prev, [domainId]: stats }));
    } catch (err) {
      console.error(err);
    }
  };

  const loadRules = async (domainId: number) => {
    try {
      const data: AccessRule[] = await apiFetch(`/api/publisher/domains/${domainId}/rules`);
      setRules(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadReadEvents = async (domainId: number) => {
    try {
      const events: ReadEvent[] = await apiFetch(`/api/publisher/domains/${domainId}/read-events?limit=50`);
      setReadEvents(events);
    } catch (err) {
      console.error(err);
    }
  };

  const loadEarningsSummary = async (domainId: number) => {
    try {
      const summary: EarningsSummary = await apiFetch(`/api/publisher/domains/${domainId}/earnings-summary`);
      setEarningsSummary(summary);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshDomainData = (domainId: number) => {
    setRules([]);
    setReadEvents([]);
    setEarningsSummary(null);
    loadAnalytics(domainId);
    loadRules(domainId);
    loadReadEvents(domainId);
    loadEarningsSummary(domainId);
  };

  const loadDomains = async () => {
    try {
      const result = await apiFetch('/api/publisher/domains');
      setDomains(result);
      if (result.length > 0) {
        setSelectedDomain(result[0].id);
        refreshDomainData(result[0].id);
      }
    } catch (err: any) {
      console.error(err);
      if (err.message.includes('token')) {
        clearSession();
        router.replace('/login');
      }
    }
  };

  const addDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/api/publisher/domains', { method: 'POST', body: JSON.stringify({ name: domainName }) });
    setDomainName('');
    loadDomains();
  };

  const addPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDomain) return;
    setRuleError(null);
    const trimmedPattern = policyForm.pathPattern.trim();
    if (!trimmedPattern) {
      setRuleError('Path pattern is required.');
      return;
    }
    const priceNumber = Number(policyForm.pricePerThousand);
    if (policyForm.accessType === 'PAID' && (!priceNumber || priceNumber <= 0)) {
      setRuleError('Paid rules require a price greater than $0.');
      return;
    }

    const payload = {
      pattern: trimmedPattern,
      accessType: policyForm.accessType,
      priceMicros: policyForm.accessType === 'PAID' ? Math.round(priceNumber * 1_000_000) : 0,
      maxRps: policyForm.maxRps ? Number(policyForm.maxRps) : null,
    };

    try {
      await apiFetch(`/api/publisher/domains/${selectedDomain}/rules`, { method: 'POST', body: JSON.stringify(payload) });
      setPolicyForm({ pathPattern: '/premium/*', accessType: policyForm.accessType, pricePerThousand: '0.25', maxRps: '' });
      refreshDomainData(selectedDomain);
    } catch (err: any) {
      setRuleError(err?.message || 'Failed to save rule');
    }
  };

  const fetchToken = async () => {
    if (!selectedDomain) return;
    const data = await apiFetch(`/api/publisher/domains/${selectedDomain}/verification-token`);
    setVerificationToken(data.token);
  };

  const verifyDomain = async () => {
    if (!selectedDomain) return;
    try {
      await apiFetch(`/api/publisher/domains/${selectedDomain}/verify`, { method: 'POST' });
      setMessage('Domain verified!');
      loadDomains();
    } catch (err: any) {
      const defaultMsg =
        "We couldn’t read '/.well-known/fairmarket-verification.txt' on this domain. Check that the file exists and contains the token shown above.";
      const msg = err?.message ?? defaultMsg;
      if (msg.toLowerCase().includes('not found') || msg.includes('404')) {
        setMessage(defaultMsg);
      } else {
        setMessage(msg);
      }
    }
  };

  const selectedPolicies: AccessRule[] = rules;
  const usageTableColumns = [
    { label: 'Time' },
    { label: 'Domain' },
    { label: 'Path' },
    { label: 'Access' },
    { label: 'Price', align: 'right' as const },
    { label: 'AI client' },
  ];

  const usageTableRows = readEvents.map((event) => {
    const date = new Date(event.createdAt).toLocaleString();
    const domain = getDomainFromUrl(event.url);
    const price = event.priceMicros ? formatMicrosToCurrency(event.priceMicros, 'Free') : 'Free';
    const accessLabel = event.accessType === 'PAID' ? 'Paid' : event.accessType === 'BLOCKED' ? 'Blocked' : 'Open';

    return {
      key: event.id,
      cells: [
        <span className="text-white" key="time">
          {date}
        </span>,
        <span className="text-white/80" key="domain">
          {domain}
        </span>,
        <span className="font-mono text-white/90" key="path">
          {event.path}
        </span>,
        <span key="access">{accessLabel}</span>,
        <span className="text-white" key="price">
          {price}
        </span>,
        <span key="client">{event.aiClient.name}</span>,
      ],
    };
  });

  const hasEarnings = Boolean(earningsSummary && earningsSummary.paidReads > 0);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 lg:px-8">
      <section className="space-y-4 rounded-3xl bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo p-8 shadow-lg">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <SectionEyebrow className="text-white/70">Publisher controls</SectionEyebrow>
            <h1 className="text-3xl font-semibold text-white">Creator control panel</h1>
            <p className="text-sm text-faircrawl-textMuted">
              Verify your sites, set AI access rules, and track paid access to your content.
            </p>
            <p className="text-xs text-white/70">Use this dashboard to manage your domains, rules, and earnings in one place.</p>
          </div>
          <SecondaryButton
            onClick={() => {
              clearSession();
              router.replace('/');
            }}
          >
            Log out
          </SecondaryButton>
        </div>
      </section>

      <section className="space-y-4">
        <MarketingCard className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-white">Your sites</h2>
            <p className="text-sm text-white/70">Track the domains you’ve added and jump into their rules and stats.</p>
          </div>
          <form onSubmit={addDomain} className="space-y-2">
            <label className="block text-sm font-medium text-white/80" htmlFor="domain-input">
              Add a domain
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                id="domain-input"
                className={`${inputClasses} flex-1`}
                placeholder="example.com"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
              />
              <PrimaryButton type="submit" className="px-6">
                Add domain
              </PrimaryButton>
            </div>
          </form>
          {domains.length === 0 ? (
            <p className="text-sm text-white/70">No sites yet. Add a domain you control to start setting AI rules.</p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="overflow-x-auto">
                <table className="min-w-[720px] w-full text-left text-sm text-white">
                  <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-white/50">
                    <tr>
                      <th className="py-2 px-3">Domain</th>
                      <th className="px-3">Status</th>
                      <th className="px-3">Rules</th>
                      <th className="px-3">Total reads</th>
                      <th className="px-3 text-right">Earnings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {domains.map((domain) => (
                      <tr key={domain.id} className={selectedDomain === domain.id ? 'bg-white/5' : ''}>
                        <td className="py-3 px-3 font-medium">{domain.name}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                              domain.verified
                                ? 'border-green-400/50 bg-green-500/10 text-green-50'
                                : 'border-amber-300/50 bg-amber-500/10 text-amber-50'
                            }`}
                          >
                            {domain.verified ? 'Verified' : 'Not verified'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-white/80">
                          <button
                            className="font-semibold text-faircrawl-accent hover:text-faircrawl-accentSoft"
                            onClick={() => {
                              setSelectedDomain(domain.id);
                              refreshDomainData(domain.id);
                              document.getElementById('ai-rules')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                          >
                            Manage rules
                          </button>
                        </td>
                        <td className="py-3 px-3 text-white/80">{analytics[domain.id]?.totalRequests ?? '—'}</td>
                        <td className="py-3 px-3 text-right text-white/80">
                          ${analytics[domain.id]?.estimatedRevenue?.toFixed?.(2) ?? '0.00'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </MarketingCard>
      </section>

      {selectedDomain && (
        <>
          <section className="grid gap-8 lg:grid-cols-2" id="ai-rules">
          <MarketingCard className="space-y-5 text-white">
            <SectionEyebrow className="text-white/70">Step 1 · Verify ownership</SectionEyebrow>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">Prove you own this site</h3>
              <p className="text-sm text-white/70">
                Complete one of the steps below to verify that you control this domain. Once verified, you can publish AI access rules and start earning from AI usage.
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase text-white/50">How to verify</p>
              <ol className="list-inside list-decimal space-y-2 text-sm text-white/80">
                <li>Fetch your unique verification token.</li>
                <li>
                  Add a file at <code className="rounded bg-white/10 px-2 py-1">/.well-known/fairmarket-verification.txt</code> with
                  only the token below.
                </li>
                <li>Click “Check verification status” once the record is live.</li>
              </ol>
              <p className="text-xs text-white/60">After you’ve added the record, click “Check verification status”.</p>
              <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white/80">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <button onClick={fetchToken} className="text-sm font-semibold text-blue-300 hover:text-white">
                    Get verification token
                  </button>
                  {verificationToken && (
                    <p className="break-all rounded bg-white/10 p-2 font-mono text-white">{verificationToken}</p>
                  )}
                </div>
                {message && <p className="text-sm text-white/70">{message}</p>}
              </div>
            </div>
            <SectionActions className="justify-start sm:justify-end">
              <PrimaryButton onClick={verifyDomain}>Check verification status</PrimaryButton>
            </SectionActions>
          </MarketingCard>

          <MarketingCard className="space-y-5 text-white">
            <SectionEyebrow className="text-white/70">Step 2 · Analytics (optional)</SectionEyebrow>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">Analytics (optional)</h3>
              <p className="text-sm text-white/70">
                Connect your own analytics if you want extra insight into how AI and humans use your site. This is optional and doesn’t affect payouts.
              </p>
            </div>
            <div className="space-y-3">
              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/80">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span>Total reads</span>
                  <span>{analytics[selectedDomain]?.totalRequests ?? 0}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span>Estimated revenue</span>
                  <span>${analytics[selectedDomain]?.estimatedRevenue?.toFixed?.(2) ?? '0.00'}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-white/50">Top AI teams</p>
                <div className="mt-2 space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/80">
                  {analytics[selectedDomain]?.topClients?.length ? (
                    analytics[selectedDomain].topClients.map((client: any) => (
                      <div
                        key={client.aiClientId}
                        className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span className="font-medium text-white">{client.name}</span>
                        <span className="text-white/80">{client.requests} reads</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/60">No data yet.</p>
                  )}
                </div>
              </div>
            </div>
          </MarketingCard>

          <MarketingCard className="space-y-5 text-white">
            <SectionEyebrow className="text-white/70">Step 3 · Publish AI access rules</SectionEyebrow>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">Set what AI can read and pay</h3>
              <p className="text-sm text-white/70">
                Create simple rules for each path. Choose what’s open, what’s premium, and what stays private, then set the price for AI access.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase text-white/50">Current rules</p>
              {selectedPolicies.length === 0 ? (
                <p className="text-sm text-white/70">No rules yet. Add a path rule to decide how AI can use this site.</p>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                  <div className="overflow-x-auto">
                    <table className="min-w-[560px] w-full text-left text-sm text-white/80">
                      <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-white/50">
                        <tr>
                          <th className="px-3 py-2">Path</th>
                          <th className="px-3 py-2">Access type</th>
                          <th className="px-3 py-2">Speed limit (req/sec)</th>
                          <th className="px-3 py-2 text-right">Price per 1k requests</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {selectedPolicies.map((policy) => {
                          const accessTypeLabel =
                            policy.accessType === 'PAID' ? 'Paid access' : policy.accessType === 'BLOCKED' ? 'Blocked' : 'Open';
                          return (
                            <tr key={policy.id}>
                              <td className="px-3 py-2 font-semibold text-white">{policy.pathPattern}</td>
                              <td className="px-3 py-2">{accessTypeLabel}</td>
                              <td className="px-3 py-2">{policy.maxRps ? `${policy.maxRps} req/sec` : '—'}</td>
                              <td className="px-3 py-2 text-right">{formatPricePerThousand(policy.priceMicros)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={addPolicy} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white" title="Pick the paths this rule covers. * matches anything in the path.">
                  Path rule
                </label>
                <input
                  className={inputClasses}
                  placeholder="/, /blog/*, /docs/*"
                  value={policyForm.pathPattern}
                  onChange={(e) => setPolicyForm({ ...policyForm, pathPattern: e.target.value })}
                />
                <p className="text-xs text-white/60">Use patterns like /blog/* or /premium/* to control groups of pages.</p>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-white">Access</p>
                <div className="space-y-3">
                  {[
                    { label: 'Open', value: 'OPEN', description: 'AI can read this path for free.' },
                    { label: 'Paid access', value: 'PAID', description: 'AI can read this path, but each request is metered and billed.' },
                    { label: 'Blocked', value: 'BLOCKED', description: 'AI cannot read this path.' },
                  ].map((option) => {
                    const accessState = policyForm.accessType;

                    return (
                      <label
                        key={option.value}
                        className={`flex flex-col gap-1 rounded-2xl border px-4 py-3 text-sm ${
                          accessState === option.value ? 'border-blue-400/70 bg-blue-500/10 text-white' : 'border-white/15 text-white/80'
                        }`}
                      >
                        <span className="flex items-center gap-2 font-semibold">
                          <input
                            type="radio"
                            className="h-4 w-4 accent-blue-500"
                            name="access-level"
                            checked={accessState === option.value}
                            onChange={() => {
                              setPolicyForm((prev) => ({
                                ...prev,
                                accessType: option.value as AccessType,
                                pricePerThousand:
                                  option.value === 'PAID'
                                    ? prev.pricePerThousand && Number(prev.pricePerThousand) > 0
                                      ? prev.pricePerThousand
                                      : '0.25'
                                    : '0',
                              }));
                            }}
                          />
                          {option.label}
                        </span>
                        <span className="text-xs text-white/70">{option.description}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-white">Rate</p>
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="flex-1 space-y-1">
                    <label className="text-sm font-semibold text-white" title="Charge AI crawlers per 1,000 requests if you want metered access.">
                      Price per 1,000 requests
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className={`${inputClasses} ${policyForm.accessType !== 'PAID' ? 'opacity-50' : ''}`}
                      placeholder="e.g. 0.25"
                      value={policyForm.pricePerThousand}
                      disabled={policyForm.accessType !== 'PAID'}
                      onChange={(e) => setPolicyForm({ ...policyForm, pricePerThousand: e.target.value })}
                    />
                    <p className="text-xs text-white/60">Set the price in USD per 1,000 reads. Leave at $0 for open paths.</p>
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-sm font-semibold text-white" title="Speed limit for crawlers hitting this path.">
                      Speed limit (req/sec)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      className={inputClasses}
                      placeholder="e.g. 5"
                      value={policyForm.maxRps}
                      onChange={(e) => setPolicyForm({ ...policyForm, maxRps: e.target.value })}
                    />
                    <p className="text-xs text-white/60">Optional. Slow down crawlers on this path without blocking them.</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-white/70">
                AI crawlers can read https://{domains.find((d) => d.id === selectedDomain)?.name ?? 'your-domain.com'}
                {policyForm.pathPattern || '/*'} at up to {policyForm.maxRps || '—'} req/sec for
                {policyForm.accessType === 'PAID'
                  ? ` $${Number(policyForm.pricePerThousand || 0).toFixed(2)}`
                  : ' Free'}
                per 1,000 requests.
              </p>
              {ruleError && <p className="text-xs text-red-300">{ruleError}</p>}
              <SectionActions className="justify-start sm:justify-end">
                <PrimaryButton type="submit">Save rules</PrimaryButton>
              </SectionActions>
            </form>
          </MarketingCard>
          </section>
          <div className="mt-10 space-y-8">
          <MarketingCard className="space-y-4 text-white">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">Usage insights</h3>
              <p className="text-sm text-white/70">Real-time reads from AI clients appear here with access type and price.</p>
            </div>
            <UsageTable
              columns={usageTableColumns}
              rows={usageTableRows}
              emptyMessage="No reads yet. Once AI clients hit your rules, they’ll show up here instantly."
              minWidthClassName="min-w-[820px]"
            />
          </MarketingCard>

          <MarketingCard className="space-y-4 text-white">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">Transactions & earnings</h3>
              <p className="text-sm text-white/70">
                Track lifetime earnings, paid reads, and recent performance. These numbers update as soon as new reads are logged.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Total reads" value={(earningsSummary?.totalReads ?? 0).toLocaleString()} />
              <MetricCard label="Paid reads" value={(earningsSummary?.paidReads ?? 0).toLocaleString()} />
              <MetricCard label="Total earnings" value={formatMicrosToCurrency(earningsSummary?.totalEarningsMicros)} />
              <MetricCard
                label="Last 7 days"
                valueClassName="text-base font-semibold text-white"
                value={`${(earningsSummary?.last7Days.reads ?? 0).toLocaleString()} reads · ${formatMicrosToCurrency(
                  earningsSummary?.last7Days.earningsMicros,
                )}`}
                caption={`Last 30 days: ${(earningsSummary?.last30Days.reads ?? 0).toLocaleString()} reads · ${formatMicrosToCurrency(
                  earningsSummary?.last30Days.earningsMicros,
                )}`}
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Top AI clients</p>
              <div className="mt-2 space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/80">
                {hasEarnings && earningsSummary?.topClients?.length ? (
                  earningsSummary.topClients.map((client) => (
                    <div key={client.aiClientId} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-white">{client.name}</p>
                        <p className="text-xs text-white/60">{client.reads} reads</p>
                      </div>
                      <span className="text-white/80">{formatMicrosToCurrency(client.earningsMicros)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-white/60">
                    No paid reads yet. As soon as AI teams license your content, you’ll see earnings here.
                  </p>
                )}
              </div>
            </div>
          </MarketingCard>
          </div>
        </>
      )}
    </div>
  );
}
