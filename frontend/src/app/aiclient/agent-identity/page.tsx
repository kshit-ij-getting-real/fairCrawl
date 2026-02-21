'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Button, Card, Input } from '@/components/dashboard/primitives';
import { toast } from '@/components/toast/ToastProvider';
import { getErrorMessage } from '@/lib/errorMessage';
import { ApiError } from '@/lib/http';
import { demoAgentIdentity, isDemoMode } from '@/lib/demoData';

export default function AIClientAgentIdentityPage() {
  const [agentId, setAgentId] = useState('');
  const [uaRegex, setUaRegex] = useState('.*');
  const [savedIdentity, setSavedIdentity] = useState<{ agentId: string; allowedUserAgentRegex: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadIdentity = async () => {
    try {
      const identity = await apiFetch('/api/aiclient/identity');
      const resolvedAgentId = identity?.agentId || '';
      const resolvedRegex = identity?.allowedUserAgentRegex || identity?.allowedUserAgentRe || '.*';
      if (resolvedAgentId) setAgentId(resolvedAgentId);
      setUaRegex(resolvedRegex);
      if (resolvedAgentId) {
        setSavedIdentity({ agentId: resolvedAgentId, allowedUserAgentRegex: resolvedRegex });
      }
    } catch (error) {
      if (error instanceof ApiError && error.code === 'REQUEST_FAILED') {
        const identities = await apiFetch('/api/aiclient/agents');
        const latestIdentity = Array.isArray(identities) ? identities[0] : null;
        const resolvedAgentId = latestIdentity?.agentId || '';
        const resolvedRegex = latestIdentity?.allowedUserAgentRe || '.*';
        if (resolvedAgentId) setAgentId(resolvedAgentId);
        setUaRegex(resolvedRegex);
        if (resolvedAgentId) {
          setSavedIdentity({ agentId: resolvedAgentId, allowedUserAgentRegex: resolvedRegex });
        }
        return;
      }
      if (isDemoMode) {
        setAgentId(demoAgentIdentity.agentId);
        setUaRegex(demoAgentIdentity.allowedUserAgentRegex);
        setSavedIdentity(demoAgentIdentity);
      } else {
        toast.error(getErrorMessage(error));
      }
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
                const identity = await apiFetch('/api/aiclient/identity', {
                  method: 'POST',
                  body: JSON.stringify({ agentId, allowedUserAgentRegex: uaRegex }),
                });
                setSavedIdentity({ agentId: identity.agentId, allowedUserAgentRegex: identity.allowedUserAgentRegex });
              } catch (error) {
                if (error instanceof ApiError && error.code === 'REQUEST_FAILED') {
                  const identity = await apiFetch('/api/aiclient/agents', {
                    method: 'POST',
                    body: JSON.stringify({ agentId, allowedUserAgentRe: uaRegex }),
                  });
                  setSavedIdentity({ agentId: identity.agentId, allowedUserAgentRegex: identity.allowedUserAgentRe });
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

      {savedIdentity?.agentId && (
        <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-4 text-sm">
          <h3 className="font-medium text-white">Registered credentials</h3>
          <p className="mt-1 text-faircrawl-textMuted">Use this identity alongside your API key when minting tokens.</p>
          <div className="mt-3 space-y-2">
            <p>
              <span className="text-faircrawl-textMuted">agent_id:</span> <code>{savedIdentity.agentId}</code>
            </p>
            <p>
              <span className="text-faircrawl-textMuted">allowed_user_agent_regex:</span>{' '}
              <code>{savedIdentity.allowedUserAgentRegex}</code>
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
