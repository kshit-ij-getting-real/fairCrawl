'use client';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Button, Card, Select } from '@/components/dashboard/primitives';

export default function DemoConsolePage() {
  const [seed, setSeed] = useState<any>(null);
  const [licenseType, setLicenseType] = useState('SUMMARY');
  const [receipt, setReceipt] = useState<any>(null);

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold">1) Seed demo workspace</h2>
        <Button onClick={async () => setSeed(await apiFetch('/api/demo/seed', { method: 'POST' }))}>Seed demo workspace</Button>
        {seed && <pre className="mt-3 overflow-auto rounded bg-black/40 p-3 text-xs">{JSON.stringify(seed, null, 2)}</pre>}
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">2) Review pricing + license toggles</h2>
        <p className="text-sm text-faircrawl-textMuted">Open the Pricing tab to inspect seeded hierarchy and activation states.</p>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">3) Simulate AI fetch</h2>
        <div className="flex gap-2">
          <Select value={licenseType} onChange={(e) => setLicenseType(e.target.value)}><option>SUMMARY</option><option>DISPLAY</option></Select>
          <Button onClick={async () => setReceipt(await apiFetch('/api/demo/simulate-transaction', { method: 'POST', body: JSON.stringify({ domainId: seed?.domainId, path: '/premium/story-1', licenseType }) }))} disabled={!seed}>Simulate fetch</Button>
        </div>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">4) Receipt</h2>
        {receipt && <pre className="mt-3 overflow-auto rounded bg-black/40 p-3 text-xs">{JSON.stringify(receipt, null, 2)}</pre>}
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">5) Open Transactions and Analytics</h2>
        <p className="text-sm text-faircrawl-textMuted">Visit Transactions and AI Team dashboard usage tables to confirm updates.</p>
      </Card>
    </div>
  );
}
