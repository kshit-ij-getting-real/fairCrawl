'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, clearSession, getRole } from '../../../lib/api';
import { API_BASE } from '../../../lib/config';
import { MarketingCard } from '../../../components/ui/MarketingCard';
import { formatMicrosToCurrency } from '../../../lib/money';

interface ApiKey {
  id: number;
  createdAt: string;
  revokedAt: string | null;
}

type AccessType = 'OPEN' | 'PAID' | 'BLOCKED';

interface ClientReadEvent {
  id: string;
  domain: string;
  path: string;
  accessType: AccessType;
  priceMicros: number;
  createdAt: string;
}

interface UsageSummary {
  totalReads: number;
  totalSpendMicros: number;
  paidReads: number;
  paidSpendMicros: number;
  last7Days: { reads: number; spendMicros: number };
  last30Days: { reads: number; spendMicros: number };
  topDomains: { domainId: number; domainName: string; reads: number; spendMicros: number }[];
}

export default function AIClientDashboard() {
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKey, setNewKey] = useState<string>('');
  const [readEvents, setReadEvents] = useState<ClientReadEvent[]>([]);
  const [usageSummary, setUsageSummary] = useState<UsageSummary | null>(null);
  const [checkUrl, setCheckUrl] = useState('');
  const [checkResult, setCheckResult] = useState<{ status: AccessType; priceMicros: number; maxRps: number | null; pathPattern: string | null } | null>(null);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (getRole() !== 'AICLIENT') {
      router.replace('/login');
      return;
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    const [keys, events, summary] = await Promise.all([
      apiFetch('/api/client/apikeys'),
      apiFetch('/api/client/read-events?limit=50'),
      apiFetch('/api/client/usage-summary'),
    ]);
    setApiKeys(keys);
    setReadEvents(events);
    setUsageSummary(summary);
  };

  const generateKey = async () => {
    const key = await apiFetch('/api/client/apikeys', { method: 'POST' });
    setNewKey(key.key);
    loadData();
  };

  const revokeKey = async (id: number) => {
    await apiFetch(`/api/client/apikeys/${id}/revoke`, { method: 'POST' });
    loadData();
  };

  const runCheck = async () => {
    if (!checkUrl) {
      setCheckError('Enter a URL to check.');
      return;
    }
    setChecking(true);
    setCheckError(null);
    try {
      const result = await apiFetch(`/api/client/check?url=${encodeURIComponent(checkUrl)}`);
      setCheckResult(result);
    } catch (err: any) {
      setCheckResult(null);
      setCheckError(err?.message || 'Failed to check access');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 text-white lg:px-8">
      <div className="space-y-4 rounded-3xl bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo p-8 shadow-lg">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">AI team controls</p>
            <h1 className="text-3xl font-semibold">Crawler control panel</h1>
            <p className="text-sm text-white/70">Create API keys, check which pages are open, and track what your crawlers read and spend.</p>
          </div>
          <button
            onClick={() => {
              clearSession();
              router.replace('/');
            }}
            className="text-sm font-semibold text-blue-300 hover:text-white"
          >
            Log out
          </button>
        </div>
      </div>

      <MarketingCard className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-white/70">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1">STEP 1 · API keys</span>
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-white">Create keys for your crawlers</h2>
          <p className="text-sm text-white/60">Create or revoke API keys for each crawler. Every request through FairMarket must use a valid key so publishers can see who is reading their content.</p>
        </div>
        {newKey && (
          <div className="space-y-1 rounded-2xl border border-blue-400/40 bg-blue-500/10 p-4 text-sm">
            <p className="font-semibold text-white">Your new API key:</p>
            <p className="break-all font-mono text-white/90">{newKey}</p>
            <p className="text-white/70">Store this securely. You will not see it again.</p>
          </div>
        )}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="overflow-x-auto">
            <table className="min-w-[640px] w-full text-left text-sm text-white/80">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-white/40">
                <tr>
                  <th className="py-3 px-4">Key ID</th>
                  <th className="px-4">Created at</th>
                  <th className="px-4">Status</th>
                  <th className="px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {apiKeys.map((key) => (
                  <tr key={key.id}>
                    <td className="py-3 px-4 font-semibold text-white">{key.id}</td>
                    <td className="px-4">{new Date(key.createdAt).toLocaleString()}</td>
                    <td className="px-4">{key.revokedAt ? 'Revoked' : 'Active'}</td>
                    <td className="px-4 text-right">
                      {!key.revokedAt && (
                        <button
                          className="text-sm font-semibold text-blue-300 hover:text-white"
                          onClick={() => revokeKey(key.id)}
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4 flex justify-start sm:justify-end">
          <button
            className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
            onClick={generateKey}
          >
            Create API key
          </button>
        </div>
      </MarketingCard>

      <MarketingCard className="flex flex-col gap-4 text-sm">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-white/70">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1">STEP 2 · Try the API</span>
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-white">Check if a page is open</h2>
          <p className="text-white/70">Use this endpoint to see how a publisher treats a given URL for your crawler. You’ll learn whether the path is open, premium, throttled, or blocked before you fetch it.</p>
        </div>
        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              className="w-full rounded-xl border border-white/15 bg-[#101424] px-4 py-2 text-sm text-white placeholder:text-white/40"
              placeholder="https://publisher.com/premium/post"
              value={checkUrl}
              onChange={(e) => setCheckUrl(e.target.value)}
            />
            <button
              className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              onClick={runCheck}
              disabled={checking}
            >
              {checking ? 'Checking…' : 'Check access'}
            </button>
          </div>
          {checkError && <p className="text-xs text-red-300">{checkError}</p>}
          {checkResult && (
            <div className="grid gap-3 text-sm text-white/80 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase text-white/50">Access</p>
                <p className="text-base font-semibold text-white">{checkResult.status}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-white/50">Price</p>
                <p className="text-base font-semibold text-white">
                  {checkResult.status === 'PAID' ? formatMicrosToCurrency(checkResult.priceMicros) : 'Free'} / 1k reads
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-white/50">Max rate</p>
                <p className="text-base font-semibold text-white">{checkResult.maxRps ?? 'Publisher default'}</p>
              </div>
              {checkResult.pathPattern && (
                <div className="sm:col-span-3 text-xs text-white/60">
                  Matches rule <span className="font-mono text-white/90">{checkResult.pathPattern}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <p className="text-white/70">Call this endpoint with your API key and the URL you’d like to read.</p>
        <pre className="mt-3 overflow-x-auto rounded-2xl bg-black/50 px-4 py-3 text-xs font-mono text-blue-100">
{`curl "${API_BASE}/api/gateway/fetch?url=https://example.com/premium/article" \\
  -H "X-API-Key: YOUR_KEY"`}
        </pre>
        <div className="space-y-2 rounded-2xl border border-white/10 bg-black/60 p-4 text-xs font-mono text-blue-100">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70">Response preview</p>
          <pre className="overflow-x-auto whitespace-pre-wrap text-white">{`{
  "status": "allowed",
  "path": "/blog/*",
  "price_per_1000": 1.0,
  "max_rps": 5
}`}</pre>
        </div>
        <p className="text-white/70">Use status and access_type to decide how your crawler should behave.</p>
        <div className="mt-6 flex justify-end">
          <Link
            href="/ai-teams"
            className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/50 hover:text-white"
          >
            Read the API reference
          </Link>
        </div>
      </MarketingCard>

      <MarketingCard className="space-y-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-white/70">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1">STEP 3 · Usage</span>
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-white">Track reads and spend</h2>
          <p className="text-sm text-white/60">
            Every request through FairMarket is logged with domain, path, and access type. Monitor your total spend and dig into each read.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Total reads</p>
            <p className="mt-2 text-2xl font-semibold text-white">{usageSummary?.totalReads ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Paid reads</p>
            <p className="mt-2 text-2xl font-semibold text-white">{usageSummary?.paidReads ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Total spend</p>
            <p className="mt-2 text-2xl font-semibold text-white">{formatMicrosToCurrency(usageSummary?.totalSpendMicros)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Paid spend</p>
            <p className="mt-2 text-base text-white">{formatMicrosToCurrency(usageSummary?.paidSpendMicros)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Last 7 days</p>
            <p className="mt-2 text-base text-white">
              {(usageSummary?.last7Days.reads ?? 0).toLocaleString()} reads ·
              {formatMicrosToCurrency(usageSummary?.last7Days.spendMicros)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Last 30 days</p>
            <p className="mt-2 text-base text-white">
              {(usageSummary?.last30Days.reads ?? 0).toLocaleString()} reads ·
              {formatMicrosToCurrency(usageSummary?.last30Days.spendMicros)}
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Top domains by spend</p>
          <div className="mt-2 space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/80">
            {usageSummary?.topDomains?.length ? (
              usageSummary.topDomains.map((domain) => (
                <div key={domain.domainId} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-semibold text-white">{domain.domainName}</span>
                  <span className="text-white/70">
                    {domain.reads} reads · {formatMicrosToCurrency(domain.spendMicros)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-white/60">No reads yet.</p>
            )}
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] text-sm text-white/80">
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full text-left">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-white/50">
                <tr>
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Domain</th>
                  <th className="px-3 py-2">Path</th>
                  <th className="px-3 py-2">Access</th>
                  <th className="px-3 py-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {readEvents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-white/60">
                      No reads yet. Once your crawlers use FairMarket, you’ll see live logs here.
                    </td>
                  </tr>
                ) : (
                  readEvents.map((event) => (
                    <tr key={event.id}>
                      <td className="px-3 py-2">{new Date(event.createdAt).toLocaleString()}</td>
                      <td className="px-3 py-2">{event.domain}</td>
                      <td className="px-3 py-2 font-mono text-white/90">{event.path}</td>
                      <td className="px-3 py-2">{event.accessType}</td>
                      <td className="px-3 py-2 text-right">
                        {event.accessType === 'PAID' ? formatMicrosToCurrency(event.priceMicros) : 'Free'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </MarketingCard>
    </div>
  );
}
