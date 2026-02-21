'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Button, Card, EmptyState } from '@/components/dashboard/primitives';
import { toast } from '@/components/toast/ToastProvider';
import { getErrorMessage } from '@/lib/errorMessage';
import { demoApiKeys, isDemoMode } from '@/lib/demoData';

export default function AIClientApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newKey, setNewKey] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = async () => {
    try {
      const keys = await apiFetch('/api/aiclient/apikeys');
      setApiKeys(isDemoMode && keys.length === 0 ? demoApiKeys : keys);
    } catch (error) {
      if (!isDemoMode) throw error;
      setApiKeys(demoApiKeys);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Card>
      <h2 className="text-lg font-semibold">API keys</h2>
      <Button
        className="mt-2"
        disabled={isCreating}
        onClick={async () => {
          setIsCreating(true);
          try {
            const key = await apiFetch('/api/aiclient/apikeys', { method: 'POST' });
            setNewKey(key.key);
            setCopied(false);
            toast.success('API key created');
            await load();
          } catch (error) {
            toast.error(getErrorMessage(error));
          } finally {
            setIsCreating(false);
          }
        }}
      >
        {isCreating ? 'Creating...' : 'Create key'}
      </Button>
      {newKey && (
        <div className="mt-2 rounded-lg border border-white/10 bg-black/20 p-3 text-sm">
          <p className="text-faircrawl-textMuted">New key. Copy it now. You can only view it once.</p>
          <p className="mt-2 break-all">
            <code>{newKey}</code>
          </p>
          <Button
            className="mt-2"
            variant="secondary"
            onClick={async () => {
              await navigator.clipboard.writeText(newKey);
              setCopied(true);
            }}
          >
            {copied ? 'Copied' : 'Copy key'}
          </Button>
        </div>
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
