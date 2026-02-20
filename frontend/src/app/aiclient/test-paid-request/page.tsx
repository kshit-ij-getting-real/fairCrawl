'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { ApiError } from '@/lib/http';
import { Button, Card, Input } from '@/components/dashboard/primitives';

export default function AIClientTestPaidRequestPage() {
  const [testForm, setTestForm] = useState<any>({ url: '', license: 'SUMMARY', maxPriceMicros: '' });
  const [receipt, setReceipt] = useState<any>(null);
  const [error, setError] = useState('');

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  return (
    <Card>
      <h2 className="text-lg font-semibold">Test paid request</h2>
      <p className="mt-2 text-sm text-faircrawl-textMuted">Mint a spend token, redeem it once, and inspect the receipt returned by the gateway.</p>
      <div className="mt-4 grid gap-2 md:grid-cols-4">
        <Input
          placeholder="https://ai-essays.vercel.app/premium/demo"
          value={testForm.url}
          onChange={(e) => setTestForm({ ...testForm, url: e.target.value })}
        />
        <select
          className="rounded-lg border border-white/10 bg-black/20 px-3 py-2"
          value={testForm.license}
          onChange={(e) => setTestForm({ ...testForm, license: e.target.value })}
        >
          <option>SUMMARY</option>
          <option>DISPLAY</option>
        </select>
        <Input
          placeholder="maxPriceMicros"
          value={testForm.maxPriceMicros}
          onChange={(e) => setTestForm({ ...testForm, maxPriceMicros: e.target.value })}
        />
        <Button
          onClick={async () => {
            setError('');
            setReceipt(null);
            try {
              const tokenResp = await apiFetch('/api/tokens', {
                method: 'POST',
                body: JSON.stringify({
                  url: testForm.url,
                  license: testForm.license,
                  maxPriceMicros: testForm.maxPriceMicros ? Number(testForm.maxPriceMicros) : undefined,
                }),
              });

              const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/content?url=${encodeURIComponent(testForm.url)}`,
                { headers: { 'x-fairfetch-token': tokenResp.token } },
              );
              const content = await response.json();
              if (!response.ok) {
                throw new ApiError(content.error || 'REQUEST_FAILED', content.message || 'Request failed', content.details);
              }
              setReceipt(content.receipt);
            } catch (err) {
              if (err instanceof ApiError) {
                if (err.code === 'NO_PRICING_RULE') {
                  setError('No active pricing rule matches this domain, path, and license. Create one under Publisher Pricing.');
                  return;
                }
                if (err.code === 'DOMAIN_NOT_VERIFIED') {
                  setError(
                    isDemoMode
                      ? 'Domains are auto verified in demo mode.'
                      : 'This domain is not verified yet. Verified domains appear in the directory and can be priced.',
                  );
                  return;
                }
                setError(err.message || err.code);
                return;
              }
              setError('Failed to run paid request test.');
            }
          }}
        >
          Run test
        </Button>
      </div>
      {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
      {receipt && (
        <p className="mt-3 text-xs text-faircrawl-textMuted">
          Receipt: {receipt.txId} | {receipt.priceMicros} micros | {receipt.domain}{receipt.path} | {new Date(receipt.timestamp).toLocaleString()}
        </p>
      )}
    </Card>
  );
}
