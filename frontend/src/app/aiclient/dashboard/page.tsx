'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, clearSession, getRole } from '../../../lib/api';
import { API_BASE } from '../../../lib/config';
import { MarketingCard } from '../../../components/ui/MarketingCard';

interface ApiKey {
  id: number;
  createdAt: string;
  revokedAt: string | null;
}

export default function AIClientDashboard() {
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKey, setNewKey] = useState<string>('');
  const [usage, setUsage] = useState<{
    totalRequests: number;
    usageByDomain: { domain: string; requests: number; path?: string; spend?: number }[];
  }>({
    totalRequests: 0,
    usageByDomain: [],
  });

  useEffect(() => {
    if (getRole() !== 'AICLIENT') {
      router.replace('/login');
      return;
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    const [keys, usageData] = await Promise.all([apiFetch('/api/aiclient/apikeys'), apiFetch('/api/aiclient/usage')]);
    setApiKeys(keys);
    setUsage(usageData);
  };

  const generateKey = async () => {
    const key = await apiFetch('/api/aiclient/apikeys', { method: 'POST' });
    setNewKey(key.key);
    loadData();
  };

  const revokeKey = async (id: number) => {
    await apiFetch(`/api/aiclient/apikeys/${id}/revoke`, { method: 'POST' });
    loadData();
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
          <p className="text-sm text-white/60">Create or revoke API keys for each crawler. Every request through FairCrawl must use a valid key so publishers can see who is reading their content.</p>
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

      <MarketingCard className="space-y-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-white/70">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1">STEP 3 · Usage</span>
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-white">Track reads and spend</h2>
          <p className="text-sm text-white/60">
            Every request through FairCrawl is logged with domain, path, and price. Use this table to see which sites you’re reading, how much you’re paying, and how usage changes over time.
          </p>
        </div>
        <p className="text-sm text-white">Total reads: {usage.totalRequests}</p>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] text-sm text-white/80">
          <div className="overflow-x-auto">
            <table className="min-w-[520px] w-full text-left">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-white/50">
                <tr>
                  <th className="px-3 py-2">Domain</th>
                  <th className="px-3 py-2">Path</th>
                  <th className="px-3 py-2">Requests</th>
                  <th className="px-3 py-2 text-right">Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {usage.usageByDomain.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-white/60">
                      No reads yet. Once your crawlers use FairCrawl, you’ll see reads and spend here.
                    </td>
                  </tr>
                ) : (
                  usage.usageByDomain.map((item) => (
                    <tr key={`${item.domain}-${item.path ?? 'all'}`}>
                      <td className="px-3 py-2">{item.domain}</td>
                      <td className="px-3 py-2">{item.path ?? '—'}</td>
                      <td className="px-3 py-2">{item.requests}</td>
                      <td className="px-3 py-2 text-right">{item.spend ? `$${Number(item.spend).toFixed(2)}` : '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end">
          <Link href="/ai-teams" className="text-sm font-semibold text-blue-300 hover:text-white">
            View full usage logs
          </Link>
        </div>
      </MarketingCard>
    </div>
  );
}
