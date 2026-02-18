'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Button, Card, EmptyState, Input, Select, Table } from '@/components/dashboard/primitives';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filters, setFilters] = useState<any>({});
  const load = async () => setTransactions(await apiFetch(`/api/publisher/transactions?${new URLSearchParams(filters as any)}`));
  useEffect(() => { load(); }, []);

  return (
    <Card>
      <h2 className="text-lg font-semibold">Transactions</h2>
      <div className="mt-3 grid gap-2 md:grid-cols-5">
        <Input placeholder="From YYYY-MM-DD" onBlur={(e) => setFilters({ ...filters, from: e.target.value })} />
        <Input placeholder="To YYYY-MM-DD" onBlur={(e) => setFilters({ ...filters, to: e.target.value })} />
        <Input placeholder="Domain" onBlur={(e) => setFilters({ ...filters, domain: e.target.value })} />
        <Select onChange={(e) => setFilters({ ...filters, licenseType: e.target.value })}><option value="">Any license</option><option>SUMMARY</option><option>DISPLAY</option></Select>
        <Button onClick={load}>Apply filters</Button>
      </div>
      {transactions.length === 0 ? <div className="mt-4"><EmptyState title="No transactions" description="Transactions will appear after successful paid fetches." /></div> : (
        <div className="mt-4 overflow-x-auto">
          <Table><thead className="text-left text-faircrawl-textMuted"><tr><th>timestamp</th><th>AI client</th><th>domain</th><th>path</th><th>license</th><th>price</th><th>status</th><th>transaction</th></tr></thead><tbody>{transactions.map((tx) => <tr key={tx.id} className="border-t border-white/10"><td className="py-2">{new Date(tx.createdAt).toLocaleString()}</td><td>{tx.aiClientName}</td><td>{tx.domain}</td><td>{tx.path}</td><td>{tx.licenseType}</td><td>{tx.publisherAmountMicros}</td><td>settled</td><td>{tx.id}</td></tr>)}</tbody></Table>
        </div>
      )}
      <Button className="mt-4" variant="secondary" onClick={async () => { const csv = await apiFetch('/api/publisher/transactions/export'); const blob = new Blob([csv.csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'transactions.csv'; a.click(); }}>Export CSV</Button>
    </Card>
  );
}
