'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Button, Card, Input } from '@/components/dashboard/primitives';

export default function AIClientTestPaidRequestPage() {
  const [testForm, setTestForm] = useState<any>({ url: '', license: 'SUMMARY', maxPriceMicros: '' });
  const [receipt, setReceipt] = useState<any>(null);

  return (
    <Card>
      <h2 className="text-lg font-semibold">Test paid request</h2>
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
            setReceipt(content.receipt);
          }}
        >
          Run test
        </Button>
      </div>
      {receipt && (
        <p className="mt-3 text-xs text-faircrawl-textMuted">
          Receipt: {receipt.txId} · {receipt.priceMicros} micros · {receipt.domain}
          {receipt.path} · {new Date(receipt.timestamp).toLocaleString()}
        </p>
      )}
    </Card>
  );
}
