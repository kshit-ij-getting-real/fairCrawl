'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Button, Card, EmptyState } from '@/components/dashboard/primitives';

export default function AIClientApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newKey, setNewKey] = useState('');

  const load = async () => {
    const keys = await apiFetch('/api/aiclient/apikeys');
    setApiKeys(keys);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Card>
      <h2 className="text-lg font-semibold">API keys</h2>
      <Button
        className="mt-2"
        onClick={async () => {
          const key = await apiFetch('/api/aiclient/apikeys', { method: 'POST' });
          setNewKey(key.key);
          load();
        }}
      >
        Create key
      </Button>
      {newKey && (
        <p className="mt-2 text-sm">
          New key: <code>{newKey}</code>
        </p>
      )}
      {apiKeys.length === 0 ? (
        <div className="mt-3">
          <EmptyState title="No API keys" description="Create a key for token requests." />
        </div>
      ) : (
        <ul className="mt-3 space-y-2">
          {apiKeys.map((k) => (
            <li key={k.id} className="flex justify-between rounded-lg border border-white/10 p-3">
              {k.maskedKey}
              <Button
                variant="ghost"
                onClick={async () => {
                  await apiFetch(`/api/aiclient/apikeys/${k.id}`, { method: 'DELETE' });
                  load();
                }}
              >
                Revoke
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
