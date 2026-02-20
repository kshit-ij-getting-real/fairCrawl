'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Button, Card, Input } from '@/components/dashboard/primitives';
import { toast } from '@/components/toast/ToastProvider';
import { getErrorMessage } from '@/lib/errorMessage';

export default function AIClientAgentIdentityPage() {
  const [agentId, setAgentId] = useState('');
  const [uaRegex, setUaRegex] = useState('.*');
  const [isSaving, setIsSaving] = useState(false);

  return (
    <Card>
      <h2 className="text-lg font-semibold">Agent identity</h2>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <Input value={agentId} onChange={(e) => setAgentId(e.target.value)} placeholder="agent_id" />
        <Input value={uaRegex} onChange={(e) => setUaRegex(e.target.value)} placeholder="allowed user-agent regex" />
        <Button
          disabled={isSaving}
          onClick={async () => {
            setIsSaving(true);
            try {
              await apiFetch('/api/aiclient/identity', {
                method: 'POST',
                body: JSON.stringify({ agentId, allowedUserAgentRegex: uaRegex }),
              });
              toast.success('Agent identity saved');
            } catch (error) {
              toast.error(getErrorMessage(error));
            } finally {
              setIsSaving(false);
            }
          }}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </Card>
  );
}
