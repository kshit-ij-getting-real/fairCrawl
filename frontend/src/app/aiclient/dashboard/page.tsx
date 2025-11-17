'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, clearSession, getRole } from '../../../lib/api';
import { API_BASE } from '../../../lib/config';

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
    <div className="space-y-10">
      <section className="bg-white rounded-xl shadow-sm p-6 flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Your AI agent dashboard</h1>
          <p className="text-sm text-slate-500">
            💭 Helper: Use this page to create API keys for your agents and see how many pages they fetch through Fair Crawl.
          </p>
        </div>
        <button
          onClick={() => {
            clearSession();
            router.replace('/');
          }}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Log out
        </button>
      </section>

      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">API keys for your agents</h2>
            <p className="text-sm text-slate-500">
              💭 Helper: Each key belongs to one agent or one app. Keep keys secret. Use them in the X-API-Key header when
              calling the gateway.
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition" onClick={generateKey}>
            Generate new key
          </button>
        </div>
        {newKey && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm space-y-1">
            <p className="font-semibold">Your new API key:</p>
            <p className="font-mono break-all">{newKey}</p>
            <p>Store this in a safe place. You will not see it again.</p>
          </div>
        )}
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-500">
              <th className="py-2">Key ID</th>
              <th>Created</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((key) => (
              <tr key={key.id}>
                <td className="py-2">{key.id}</td>
                <td>{new Date(key.createdAt).toLocaleString()}</td>
                <td>{key.revokedAt ? 'Revoked' : 'Active'}</td>
                <td>
                  {!key.revokedAt && (
                    <button className="text-sm text-blue-600 hover:text-blue-700" onClick={() => revokeKey(key.id)}>
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="bg-white rounded-xl shadow-sm p-6 space-y-3">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Usage</h2>
          <p className="text-sm text-slate-500">💭 Helper: Check how many requests your agents made through Fair Crawl.</p>
        </div>
        <p className="text-sm text-slate-700">Total requests: {usage.totalRequests}</p>
        <div className="space-y-2">
          {usage.usageByDomain.length === 0 ? (
            <p className="text-sm text-slate-500">No usage recorded yet.</p>
          ) : (
            usage.usageByDomain.map((item) => (
              <div key={item.domain} className="flex justify-between text-sm">
                <span>{item.domain}</span>
                <span>{item.requests} req</span>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm p-6 space-y-3 text-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Example: ask Fair Crawl to fetch one page for your AI</h2>
          <p className="text-slate-500">
            💭 Helper: Replace YOUR_KEY with the API key above and change the url to the page your AI wants to read.
          </p>
        </div>
        <pre className="bg-slate-900 text-white p-4 rounded text-xs overflow-x-auto">
curl "${API_BASE}/api/gateway/fetch?url=https://example.com/premium/article" \\
  -H "X-API-Key: YOUR_KEY"
        </pre>
        <ul className="list-disc list-inside space-y-1 text-slate-700">
          <li>Use {API_BASE} as the base URL. Update it if your deploy uses another host.</li>
          <li>Swap YOUR_KEY for the key shown above.</li>
          <li>Set the url value to the page your agent wants to fetch.</li>
        </ul>
      </section>
    </div>
  );
}
