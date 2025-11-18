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
      <MarketingCard className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold">Your AI teams dashboard</h1>
            <p className="text-sm text-white/70">
              Create API keys for your crawlers and see how many pages they fetch through FairCrawl.
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
      </MarketingCard>

      <MarketingCard className="flex flex-col gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-white">API keys for your crawlers</h2>
          <p className="text-sm text-white/60">Each key belongs to one AI crawler or app. Keep keys secret.</p>
        </div>
        {newKey && (
          <div className="space-y-1 rounded-2xl border border-blue-400/40 bg-blue-500/10 p-4 text-sm">
            <p className="font-semibold text-white">Your new API key:</p>
            <p className="break-all font-mono text-white/90">{newKey}</p>
            <p className="text-white/70">Store this securely. You will not see it again.</p>
          </div>
        )}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <table className="w-full text-left text-sm text-white/80">
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
        <div className="mt-4 flex justify-end">
          <button
            className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
            onClick={generateKey}
          >
            Generate new key
          </button>
        </div>
      </MarketingCard>

      <MarketingCard className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-white">Usage</h2>
          <p className="text-sm text-white/60">Check how many requests your AI crawlers made through FairCrawl.</p>
        </div>
        <p className="text-sm text-white">Total requests: {usage.totalRequests}</p>
        <div className="space-y-2 text-sm text-white/80">
          {usage.usageByDomain.length === 0 ? (
            <p className="text-white/60">No usage recorded yet.</p>
          ) : (
            usage.usageByDomain.map((item) => (
              <div key={item.domain} className="flex justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                <span>{item.domain}</span>
                <span>{item.requests} req</span>
              </div>
            ))
          )}
        </div>
      </MarketingCard>

      <MarketingCard className="flex flex-col gap-4 text-sm">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-white">Example: ask FairCrawl to fetch one page for your AI</h2>
          <p className="text-white/70">Replace YOUR_KEY with the API key above and change the url to the page your crawler wants to read.</p>
        </div>
        <pre className="mt-3 overflow-x-auto rounded-2xl bg-black/50 px-4 py-3 text-xs font-mono text-blue-100">
{`curl "${API_BASE}/api/gateway/fetch?url=https://example.com/premium/article" \\
  -H "X-API-Key: YOUR_KEY"`}
        </pre>
        <ul className="list-disc list-inside space-y-1 text-white/70">
          <li>Use {API_BASE} as the base URL. Update it if your deploy uses another host.</li>
          <li>Swap YOUR_KEY for the key shown above.</li>
          <li>Set the url value to the page your crawler wants to fetch.</li>
        </ul>
        <div className="mt-6 flex justify-end">
          <Link
            href="/ai-teams"
            className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/50 hover:text-white"
          >
            Read the API overview
          </Link>
        </div>
      </MarketingCard>
    </div>
  );
}
