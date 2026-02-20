'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Button, Card, Input } from '@/components/dashboard/primitives';
import { toast } from '@/components/toast/ToastProvider';
import { getErrorMessage } from '@/lib/errorMessage';
import { ApiError } from '@/lib/http';

export default function AIClientAgentIdentityPage() {
  const [agentId, setAgentId] = useState('');
  const [uaRegex, setUaRegex] = useState('.*');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadIdentity = async () => {
    try {
      const identity = await apiFetch('/api/aiclient/identity');
      if (identity?.agentId) setAgentId(identity.agentId);
      setUaRegex(identity?.allowedUserAgentRegex || identity?.allowedUserAgentRe || '.*');
    } catch (error) {
      if (error instanceof ApiError && error.code === 'REQUEST_FAILED') {
        const identities = await apiFetch('/api/aiclient/agents');
        const latestIdentity = Array.isArray(identities) ? identities[0] : null;
        if (latestIdentity?.agentId) setAgentId(latestIdentity.agentId);
        setUaRegex(latestIdentity?.allowedUserAgentRe || '.*');
        return;
      }
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIdentity();
  }, []);

  return (
    <Card>
      <h2 className="text-lg font-semibold">Agent identity</h2>
      <p className="mt-2 text-sm text-faircrawl-textMuted">
        This step tells publishers who your crawler is. The <code>agent_id</code> is stored in receipts, and the regex prevents token use from unexpected user agents.
      </p>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <Input value={agentId} onChange={(e) => setAgentId(e.target.value)} placeholder="agent_id" />
        <Input value={uaRegex} onChange={(e) => setUaRegex(e.target.value)} placeholder="allowed user-agent regex" />
        <Button
          disabled={isSaving || isLoading}
          onClick={async () => {
            setIsSaving(true);
            try {
              try {
                await apiFetch('/api/aiclient/identity', {
                  method: 'POST',
                  body: JSON.stringify({ agentId, allowedUserAgentRegex: uaRegex }),
                });
              } catch (error) {
                if (error instanceof ApiError && error.code === 'REQUEST_FAILED') {
                  await apiFetch('/api/aiclient/agents', {
                    method: 'POST',
                    body: JSON.stringify({ agentId, allowedUserAgentRe: uaRegex }),
                  });
                } else {
                  throw error;
                }
              }
              toast.success('Agent identity saved');
            } catch (error) {
              toast.error(getErrorMessage(error));
            } finally {
              setIsSaving(false);
            }
          }}
        >
          {isLoading ? 'Loading...' : isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </Card>
  );
}
