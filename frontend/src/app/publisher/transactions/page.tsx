'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button, Card, EmptyState, Input, Select, Table } from '@/components/dashboard/primitives';
import { formatMicrosToCurrency } from '@/lib/money';
import { toast } from '@/components/toast/ToastProvider';
import { publisherMockStore } from '@/lib/publisherMockStore';

type ReceiptRow = {
  txId: string;
  timestamp: string;
  domain: string;
  path: string;
  license: 'SUMMARY' | 'DISPLAY';
  priceMicros: number;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<ReceiptRow[]>([]);
  const [filters, setFilters] = useState({ from: '', to: '', domain: '', licenseType: '' });

  useEffect(() => {
    setTransactions(publisherMockStore.getTransactions().rows as ReceiptRow[]);
  }, []);

  const filteredTransactions = useMemo(() => transactions.filter((tx) => {
    const fromValid = filters.from ? new Date(tx.timestamp) >= new Date(filters.from) : true;
    const toValid = filters.to ? new Date(tx.timestamp) <= new Date(filters.to) : true;
    const domainValid = filters.domain ? tx.domain.toLowerCase().includes(filters.domain.toLowerCase()) : true;
    const licenseValid = filters.licenseType ? tx.license === filters.licenseType : true;
    return fromValid && toValid && domainValid && licenseValid;
  }), [transactions, filters]);

  const applyFilters = async () => {
    toast.success('Updated');
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold">Transactions</h2>
      <p className="mt-1 text-xs text-faircrawl-textMuted">Database-backed transaction history is temporarily disabled; showing local demo records for now.</p>
      <div className="mt-3 grid gap-2 md:grid-cols-5">
        <Input value={filters.from} placeholder="From YYYY-MM-DD" onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
        <Input value={filters.to} placeholder="To YYYY-MM-DD" onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
        <Input value={filters.domain} placeholder="Domain" onChange={(e) => setFilters({ ...filters, domain: e.target.value })} />
        <Select value={filters.licenseType} onChange={(e) => setFilters({ ...filters, licenseType: e.target.value })}>
          <option value="">Any license</option>
          <option value="SUMMARY">SUMMARY</option>
          <option value="DISPLAY">DISPLAY</option>
        </Select>
        <Button onClick={applyFilters}>Apply filters</Button>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No transactions" description="Transactions appear after an AI client redeems a token for your content." />
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <Table>
            <thead className="text-left text-faircrawl-textMuted">
              <tr>
                <th>Transaction ID</th>
                <th>Timestamp</th>
                <th>Domain</th>
                <th>Path</th>
                <th>License</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.txId} className="border-t border-[rgba(126,135,212,0.12)]">
                  <td className="py-2">{tx.txId}</td>
                  <td>{new Date(tx.timestamp).toLocaleString()}</td>
                  <td>{tx.domain}</td>
                  <td>{tx.path}</td>
                  <td>{tx.license}</td>
                  <td>{formatMicrosToCurrency(tx.priceMicros)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Button className="mt-4" variant="secondary" onClick={async () => {
        const csvRows = [
          'transaction_id,timestamp,domain,path,license,price_micros',
          ...filteredTransactions.map((tx) => `${tx.txId},${tx.timestamp},${tx.domain},${tx.path},${tx.license},${tx.priceMicros}`),
        ];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transactions.csv';
        a.click();
      }}>Export CSV</Button>
    </Card>
  );
}
