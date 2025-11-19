'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, clearSession, getRole } from '../../../lib/api';
import { MarketingCard } from '../../../components/ui/MarketingCard';
import { SectionActions } from '../../../components/ui/SectionActions';

interface Domain {
  id: number;
  name: string;
  verified: boolean;
  policies: any[];
}

export default function PublisherDashboard() {
  const router = useRouter();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [domainName, setDomainName] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<number | null>(null);
  const [analytics, setAnalytics] = useState<Record<number, any>>({});
  const [policyForm, setPolicyForm] = useState({ pathPattern: '/*', allowAI: true, pricePer1k: 0, maxRps: '' });
  const [verificationToken, setVerificationToken] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);

  const inputClasses =
    'w-full rounded-xl border border-white/15 bg-[#101424] px-4 py-2 text-sm text-white shadow-sm outline-none ring-0 placeholder:text-white/40 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40';

  useEffect(() => {
    if (getRole() !== 'PUBLISHER') {
      router.replace('/login');
      return;
    }
    loadDomains();
  }, [router]);

  const loadDomains = async () => {
    try {
      const result = await apiFetch('/api/publisher/domains');
      setDomains(result);
      if (result.length > 0) {
        setSelectedDomain(result[0].id);
        loadAnalytics(result[0].id);
      }
    } catch (err: any) {
      console.error(err);
      if (err.message.includes('token')) {
        clearSession();
        router.replace('/login');
      }
    }
  };

  const loadAnalytics = async (domainId: number) => {
    try {
      const stats = await apiFetch(`/api/publisher/domains/${domainId}/analytics`);
      setAnalytics((prev) => ({ ...prev, [domainId]: stats }));
    } catch (err) {
      console.error(err);
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
    const payload = {
      ...policyForm,
      pricePer1k: Number(policyForm.pricePer1k),
      maxRps: policyForm.maxRps ? Number(policyForm.maxRps) : null,
    };
    await apiFetch(`/api/publisher/domains/${selectedDomain}/policies`, { method: 'POST', body: JSON.stringify(payload) });
    setPolicyForm({ pathPattern: '/premium/*', allowAI: true, pricePer1k: 0, maxRps: '' });
    loadDomains();
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

  const selectedPolicies: any[] = selectedDomain
    ? domains.find((d) => d.id === selectedDomain)?.policies ?? []
    : [];

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 lg:px-8">
      <section className="space-y-4 rounded-3xl bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo p-8 shadow-lg">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-faircrawl-textMuted">Publisher controls</p>
            <h1 className="text-3xl font-semibold text-white">Creator control panel</h1>
            <p className="text-sm text-faircrawl-textMuted">
              Verify your sites, set AI access rules, and track paid access to your content.
            </p>
            <p className="text-xs text-white/70">Use this dashboard to manage your domains, rules, and earnings in one place.</p>
          </div>
          <button
            onClick={() => {
              clearSession();
              router.replace('/');
            }}
            className="rounded-full bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
          >
            Log out
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <MarketingCard className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-white">Your sites</h2>
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
              <button
                className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
                type="submit"
              >
                Add domain
              </button>
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
                              loadAnalytics(domain.id);
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
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-white/70">
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1">Step 1 · Verify ownership</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Prove you own this site</h3>
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
              <button onClick={verifyDomain} className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500/80">
                Check verification status
              </button>
            </SectionActions>
          </MarketingCard>

          <MarketingCard className="space-y-5 text-white">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-white/70">
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1">Step 2 · Analytics (optional)</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Analytics (optional)</h3>
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
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-white/70">
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1">Step 3 · Publish AI access rules</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Set what AI can read and pay</h3>
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
                        {selectedPolicies.map((policy: any) => {
                          const accessType = !policy.allowAI ? 'Blocked' : policy.pricePer1k > 0 ? 'Paid access' : 'Open';
                          return (
                            <tr key={policy.id}>
                              <td className="px-3 py-2 font-semibold text-white">{policy.pathPattern}</td>
                              <td className="px-3 py-2">{accessType}</td>
                              <td className="px-3 py-2">{policy.maxRps ? `${policy.maxRps} req/sec` : '—'}</td>
                              <td className="px-3 py-2 text-right">{policy.pricePer1k ? `${policy.pricePer1k}¢` : 'Free'}</td>
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
                    { label: 'Open', value: 'open', description: 'AI can read this path for free.' },
                    { label: 'Paid access', value: 'paid', description: 'AI can read this path, but each request is metered and billed.' },
                    { label: 'Blocked', value: 'blocked', description: 'AI cannot read this path.' },
                  ].map((option) => {
                    const accessState = !policyForm.allowAI ? 'blocked' : policyForm.pricePer1k > 0 ? 'paid' : 'open';

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
                              if (option.value === 'blocked') {
                                setPolicyForm({ ...policyForm, allowAI: false });
                              }
                              if (option.value === 'open') {
                                setPolicyForm({ ...policyForm, allowAI: true, pricePer1k: 0 });
                              }
                              if (option.value === 'paid') {
                                setPolicyForm({ ...policyForm, allowAI: true, pricePer1k: policyForm.pricePer1k || 1 });
                              }
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
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-white" title="Charge AI crawlers per 1,000 requests if you want metered access.">
                      Price per 1,000 requests
                    </label>
                    <input
                      className={inputClasses}
                      placeholder="Price in cents"
                      value={policyForm.pricePer1k}
                      onChange={(e) => setPolicyForm({ ...policyForm, pricePer1k: Number(e.target.value) })}
                    />
                    <p className="text-xs text-white/60">This is what AI teams pay when they access this path through FairMarket.</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-white" title="Speed limit for crawlers hitting this path.">
                      Speed limit (req/sec)
                    </label>
                    <input
                      className={inputClasses}
                      placeholder="e.g. 1"
                      value={policyForm.maxRps}
                      onChange={(e) => setPolicyForm({ ...policyForm, maxRps: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-white/70">
                AI crawlers can read https://{domains.find((d) => d.id === selectedDomain)?.name ?? 'your-domain.com'}
                {policyForm.pathPattern || '/*'} at up to {policyForm.maxRps || '—'} req/sec for {policyForm.pricePer1k || 0}¢ per 1,000 requests.
              </p>
              <SectionActions className="justify-start sm:justify-end">
                <button className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500/80" type="submit">
                  Save rules
                </button>
              </SectionActions>
            </form>
          </MarketingCard>
          </section>
          <MarketingCard className="mt-8 space-y-4 text-white">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Earnings</h3>
            <p className="text-sm text-white/70">
              See how much you’ve earned from AI access to this site. Every paid read is logged and added to your balance.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Total reads</p>
              <p className="mt-2 text-2xl font-semibold text-white">{analytics[selectedDomain]?.totalRequests ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Earnings to date</p>
              <p className="mt-2 text-2xl font-semibold text-white">${analytics[selectedDomain]?.estimatedRevenue?.toFixed?.(2) ?? '0.00'}</p>
            </div>
          </div>
          </MarketingCard>
        </>
      )}
    </div>
  );
}
