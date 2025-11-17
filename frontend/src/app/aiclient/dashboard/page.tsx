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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">AI Client dashboard</h1>
        <button
          onClick={() => {
            clearSession();
            router.replace('/');
          }}
          className="text-sm text-slate-500"
        >
          Log out
        </button>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded p-4 text-sm text-slate-700 space-y-1">
        <p className="font-semibold">This is your AI Client dashboard.</p>
        <p>Here you generate API keys and see how many requests you&apos;ve made through the Fair Crawl gateway.</p>
      </div>

      <section className="bg-white rounded shadow p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">API keys</h2>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={generateKey}>
            Generate new key
          </button>
        </div>
        <div className="text-sm text-slate-700 space-y-1">
          <p className="font-semibold">Your API key is a secret token that identifies your AI system to Fair Crawl.</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Keep it private and never share it in client-side code or public repos.</li>
            <li>You can revoke a key at any time if it is leaked.</li>
            <li>Use this key in the X-API-Key header when calling the gateway.</li>
          </ul>
        </div>
        {newKey && (
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm">
            <p className="font-semibold">Your new API key:</p>
            <p className="font-mono break-all">{newKey}</p>
            <p>Store this securely. You will not be able to see it again.</p>
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
                    <button className="text-sm text-red-600" onClick={() => revokeKey(key.id)}>
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="bg-white rounded shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">Usage</h2>
        <p className="text-sm text-slate-600">Usage shows how many gateway requests your keys have made and the estimated spend.</p>
        <p className="text-sm text-slate-600">Total requests: {usage.totalRequests}</p>
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

      <section className="bg-white rounded shadow p-6 space-y-3 text-sm">
        <h2 className="text-xl font-semibold">Call the Fair Crawl gateway</h2>
        <p className="text-slate-700">Use your API key to fetch URLs that respect publisher policies.</p>
        <div className="space-y-2">
          <p className="font-semibold">Example: fetch a single URL through the Fair Crawl gateway</p>
          <pre className="bg-slate-900 text-white p-4 rounded text-xs overflow-x-auto">
curl "${API_BASE}/api/gateway/fetch?url=https://example.com/premium/article" \
  -H "X-API-Key: YOUR_KEY"
          </pre>
          <ul className="list-disc list-inside space-y-1 text-slate-700">
            <li>Replace ${'{'}API_BASE{'}'} with the deployed base URL of your Fair Crawl instance.</li>
            <li>Replace YOUR_KEY with the API key shown above.</li>
            <li>Replace the url parameter with the page you want to fetch.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
