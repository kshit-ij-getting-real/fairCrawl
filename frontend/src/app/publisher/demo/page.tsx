'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Button, Card, Select } from '@/components/dashboard/primitives';

const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export default function DemoConsolePage() {
  const [seed, setSeed] = useState<any>(null);
  const [receipt, setReceipt] = useState<any>(null);
  const [domain, setDomain] = useState('macro-notes-demo.vercel.app');
  const [path, setPath] = useState('/notes/how-liquidity-cycles-hit-job-markets.html');
  const [licenseType, setLicenseType] = useState('SUMMARY');
  const [aiclientEmail, setAiClientEmail] = useState('aiclient+atlas@fairfetch.demo');

  const pathOptions = useMemo(
    () => ({
      'macro-notes-demo.vercel.app': [
        '/notes/how-liquidity-cycles-hit-job-markets.html',
        '/notes/why-interest-rates-obsess-macro-nerds.html',
        '/policy.html',
        '/about.html',
      ],
      'ai-essays.vercel.app': ['/essays/why-agents-need-markets', '/essays/on-knowledge-and-compounding'],
    }),
    []
  );

  if (!isDemo) return <Card><p className="text-sm text-faircrawl-textMuted">Demo mode is disabled.</p></Card>;

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold">1) Seed demo data</h2>
        <Button className="mt-3" onClick={async () => setSeed(await apiFetch('/api/demo/seed', { method: 'POST' }))}>Seed demo data</Button>
        {seed && <pre className="mt-3 overflow-auto rounded bg-black/40 p-3 text-xs">{JSON.stringify(seed, null, 2)}</pre>}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">2) Simulate transaction</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <Select value={domain} onChange={(e) => { setDomain(e.target.value); setPath(pathOptions[e.target.value as keyof typeof pathOptions][0]); }}>
            <option value="macro-notes-demo.vercel.app">macro-notes-demo.vercel.app</option>
            <option value="ai-essays.vercel.app">ai-essays.vercel.app</option>
          </Select>
          <Select value={path} onChange={(e) => setPath(e.target.value)}>
            {pathOptions[domain as keyof typeof pathOptions].map((p) => <option key={p} value={p}>{p}</option>)}
          </Select>
          <Select value={licenseType} onChange={(e) => setLicenseType(e.target.value)}>
            <option value="SUMMARY">SUMMARY</option>
            <option value="DISPLAY">DISPLAY</option>
          </Select>
          <Select value={aiclientEmail} onChange={(e) => setAiClientEmail(e.target.value)}>
            <option value="aiclient+atlas@fairfetch.demo">aiclient+atlas@fairfetch.demo</option>
            <option value="aiclient+ragworks@fairfetch.demo">aiclient+ragworks@fairfetch.demo</option>
          </Select>
        </div>
        <Button
          className="mt-3"
          onClick={async () =>
            setReceipt(
              await apiFetch('/api/demo/simulate-transaction', {
                method: 'POST',
                body: JSON.stringify({ domain, path, licenseType, aiclientEmail }),
              })
            )
          }
        >
          Run simulation
        </Button>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">3) Receipt</h2>
        {receipt ? <pre className="mt-3 overflow-auto rounded bg-black/40 p-3 text-xs">{JSON.stringify(receipt, null, 2)}</pre> : <p className="mt-2 text-sm text-faircrawl-textMuted">Run a simulation to view receipt output.</p>}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">4) Jump to dashboards</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link href="/publisher/transactions" className="rounded-full border border-white/20 px-4 py-2 text-white hover:bg-white/10">Publisher Transactions</Link>
          <Link href="/aiclient/dashboard" className="rounded-full border border-white/20 px-4 py-2 text-white hover:bg-white/10">AI Team Dashboard</Link>
        </div>
      </Card>
    </div>
  );
}
