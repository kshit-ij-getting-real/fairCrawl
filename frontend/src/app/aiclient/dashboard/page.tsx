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
  const [usage, setUsage] = useState<{ totalRequests: number; usageByDomain: { domain: string; requests: number }[] }>({
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
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">AI TEAM CONTROL</p>
            <h1 className="text-3xl font-semibold">Crawler control panel</h1>
            <p className="text-sm text-white/70">
              Create API keys, check which paths are open, and track every AI read.
            </p>
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
          <p className="text-sm text-white/60">Each key belongs to one crawler or app. Keep keys secret.</p>
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
                  <th className="px-4">Created</th>
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
          <p className="text-white/70">Send a URL to FairCrawl to see if it is open, throttled, or blocked for your crawler.</p>
        </div>
        <p className="text-white/70">Use YOUR_KEY from Step 1 and set the url= value to the page your crawler wants to read.</p>
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
        <div className="mt-6 flex justify-end">
          <Link
            href="/ai-teams"
            className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/50 hover:text-white"
          >
            Read the API overview
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
            Usage shows how many pages each crawler read, which domains they accessed, and what you owe publishers.
          </p>
        </div>
        <p className="text-sm text-white">Total reads: {usage.totalRequests}</p>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] text-sm text-white/80">
          <div className="overflow-x-auto">
            <div className="min-w-[560px]">
              <div className="grid grid-cols-5 gap-2 bg-white/[0.04] px-3 py-2 text-xs uppercase tracking-wide text-white/50">
                <span>API key</span>
                <span>Domain</span>
                <span>Reads</span>
                <span>Spend</span>
                <span>Last seen</span>
              </div>
              <div className="divide-y divide-white/5">
                {usage.usageByDomain.length === 0 ? (
                  <p className="px-3 py-4 text-white/60">
                    No reads yet. Once your crawlers use FairCrawl, you’ll see reads and spend here.
                  </p>
                ) : (
                  usage.usageByDomain.map((item) => (
                    <div key={item.domain} className="grid grid-cols-5 gap-2 px-3 py-2">
                      <span>—</span>
                      <span>{item.domain}</span>
                      <span>{item.requests}</span>
                      <span>—</span>
                      <span>—</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </MarketingCard>
    </div>
  );
}
