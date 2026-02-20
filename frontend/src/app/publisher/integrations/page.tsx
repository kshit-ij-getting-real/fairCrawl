'use client';
import { useState } from 'react';
import { Button, Card, Input, Modal } from '@/components/dashboard/primitives';
import { apiFetch } from '@/lib/api';

const providers = ['Cloudflare', 'Fastly', 'Akamai', 'Vercel', 'Other'];

export default function IntegrationsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [logConfig, setLogConfig] = useState({ serviceId: '', token: '', endpoint: '' });
  const [redirectConfig, setRedirectConfig] = useState({ patterns: '', enabled: false });

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold">Analytics / Log forwarding</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {providers.map((provider) => (
            <Button
              key={provider}
              variant={selected === provider ? 'primary' : 'secondary'}
              className="w-full justify-start rounded-lg p-4 text-left"
              onClick={() => setSelected(provider)}
            >
              {provider}
            </Button>
          ))}
        </div>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">Optional Bot Redirect</h2>
        <p className="text-sm text-faircrawl-textMuted">Instead of blocking bots, redirect them to paid access endpoint.</p>
        <div className="mt-3 space-y-2">
          <Input placeholder="User-agent patterns (comma separated)" value={redirectConfig.patterns} onChange={(e) => setRedirectConfig({ ...redirectConfig, patterns: e.target.value })} />
          <Button variant={redirectConfig.enabled ? 'secondary' : 'primary'} onClick={() => setRedirectConfig({ ...redirectConfig, enabled: !redirectConfig.enabled })}>{redirectConfig.enabled ? 'Redirect enabled' : 'Enable redirect'}</Button>
        </div>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">Demo data</h2>
        <Button onClick={async () => { await apiFetch('/api/demo/generate-logs', { method: 'POST' }); }}>Generate sample logs</Button>
      </Card>
      <Modal open={Boolean(selected)} title={`${selected} setup`} onClose={() => setSelected(null)}>
        <div className="space-y-2">
          <Input placeholder="Service ID" value={logConfig.serviceId} onChange={(e) => setLogConfig({ ...logConfig, serviceId: e.target.value })} />
          <Input placeholder="Token" value={logConfig.token} onChange={(e) => setLogConfig({ ...logConfig, token: e.target.value })} />
          <Input placeholder="Endpoint" value={logConfig.endpoint} onChange={(e) => setLogConfig({ ...logConfig, endpoint: e.target.value })} />
          <Button onClick={() => setSelected(null)}>Save config</Button>
        </div>
      </Modal>
    </div>
  );
}
