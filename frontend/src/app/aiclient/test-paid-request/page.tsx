'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { ApiError } from '@/lib/http';
import { Button, Card, Input } from '@/components/dashboard/primitives';
import { toast } from '@/components/toast/ToastProvider';
import { getErrorMessage } from '@/lib/errorMessage';
import { canUseDemoFallback } from '@/lib/demoData';

export default function AIClientTestPaidRequestPage() {
  const [testForm, setTestForm] = useState<any>({
    url: canUseDemoFallback ? 'https://fairfetch-publisher-macro-notes.vercel.app/premium/demo-article' : '',
    license: 'SUMMARY',
    maxPriceMicros: canUseDemoFallback ? '600000' : '',
  });
  const [receipt, setReceipt] = useState<any>(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  return (
    <Card>
      <h2 className="text-lg font-semibold">Test paid request</h2>
      <p className="mt-2 text-sm text-faircrawl-textMuted">Some publisher pages may be paywalled for humans but accessible to licensed AI via FairFetch.</p>
      <p className="mt-1 text-sm text-faircrawl-textMuted">The demo publisher site uses via=fairfetch as a marker of licensed access.</p>
      <p className="mt-1 text-sm text-faircrawl-textMuted">Run order: mint token → redeem token on publisher endpoint → inspect receipt.</p>
      <div className="mt-4 grid gap-2 md:grid-cols-4">
        <div className="space-y-1">
          <p className="text-xs text-faircrawl-textMuted">Target URL</p>
          <Input
            placeholder="https://ai-essays.vercel.app/premium/demo"
          value={testForm.url}
            onChange={(e) => setTestForm({ ...testForm, url: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <p className="text-xs text-faircrawl-textMuted">License type</p>
          <select
            className="w-full rounded-xl border border-[rgba(125,133,211,0.24)] bg-[rgba(255,255,255,0.82)] px-3 py-2 text-sm text-[#2a3274]"
            value={testForm.license}
            onChange={(e) => setTestForm({ ...testForm, license: e.target.value })}
          >
            <option>SUMMARY</option>
            <option>DISPLAY</option>
          </select>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-faircrawl-textMuted">Max price (optional, micros)</p>
          <Input
          placeholder="maxPriceMicros"
          value={testForm.maxPriceMicros}
            onChange={(e) => setTestForm({ ...testForm, maxPriceMicros: e.target.value })}
          />
        </div>
        <div className="flex items-end">
        <Button
          disabled={isRunning}
          onClick={async () => {
            setError('');
            setReceipt(null);
            setCopiedReceipt(false);
            setIsRunning(true);
            try {
              setStatus('Minting token...');
              const tokenResp = await apiFetch('/api/tokens', {
                method: 'POST',
                body: JSON.stringify({
                  url: testForm.url,
                  license: testForm.license,
                  maxPriceMicros: testForm.maxPriceMicros ? Number(testForm.maxPriceMicros) : undefined,
                }),
              });
              toast.success('Token minted');

              setStatus('Generating demo receipt...');
              setReceipt({
                txId: `demo_tx_${Date.now()}`,
                priceMicros: tokenResp?.priceMicros || 100000,
                domain: tokenResp?.domain || 'demo.local',
                path: tokenResp?.path || '/premium/demo',
                license: tokenResp?.license || testForm.license,
                timestamp: new Date().toISOString(),
              });
              setStatus('Done');
              toast.success('Content fetched');
            } catch (err) {
              setStatus('');
              if (err instanceof ApiError) {
                if (err.code === 'NO_PRICING_RULE') {
                  const message = 'No active pricing rule matches this domain, path, and license. Add one under Publisher Pricing.';
                  setError(message);
                  toast.error(message);
                  return;
                }
                if (err.code === 'PRICE_TOO_HIGH') {
                  const message = 'Price exceeds your max price limit';
                  setError(message);
                  toast.error(message);
                  return;
                }
                const message = getErrorMessage(err);
                setError(message);
                toast.error(message);
                return;
              }
              const message = getErrorMessage(err);
              setError(message);
              toast.error(message);
            } finally {
              setIsRunning(false);
            }
          }}
        >
          {isRunning ? 'Running...' : 'Run test'}
        </Button>
        </div>
      </div>
      {status ? <p className="mt-3 text-sm text-faircrawl-textMuted">{status}</p> : null}
      {error ? <p className="mt-3 text-sm text-rose-500">{error}</p> : null}
      {receipt && (
        <div className="mt-4 rounded-xl border border-[rgba(112,124,232,0.18)] bg-[rgba(112,124,232,0.08)] p-4">
          <h3 className="text-sm font-semibold text-[#25306d]">Receipt</h3>
          <div className="mt-2 grid gap-1 text-xs text-faircrawl-textMuted">
            <p>txId: {receipt.txId}</p>
            <p>priceMicros: {receipt.priceMicros}</p>
            <p>domain: {receipt.domain}</p>
            <p>path: {receipt.path}</p>
            <p>license: {receipt.license}</p>
            <p>timestamp: {new Date(receipt.timestamp).toLocaleString()}</p>
          </div>
          <Button
            className="mt-3"
            variant="secondary"
            onClick={async () => {
              await navigator.clipboard.writeText(JSON.stringify(receipt, null, 2));
              setCopiedReceipt(true);
            }}
          >
            {copiedReceipt ? 'Copied' : 'Copy receipt'}
          </Button>
          <p className="mt-2 text-xs text-faircrawl-textMuted">Receipt is your audit handle.</p>
        </div>
      )}
    </Card>
  );
}
