'use client';
import { useEffect, useState } from 'react';
import { Badge, Button, Card, Drawer, EmptyState, Input, Table } from '@/components/dashboard/primitives';
import { toast } from '@/components/toast/ToastProvider';
import { publisherMockStore } from '@/lib/publisherMockStore';

export default function DomainsPage() {
  const [domains, setDomains] = useState<any[]>([]);
  const [domain, setDomain] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const load = () => {
    setDomains(publisherMockStore.getDomains());
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold">Add domain</h2>
        <p className="mt-2 text-sm text-faircrawl-textMuted">Database-driven domain sync is temporarily disabled. New domains are saved locally for now.</p>
        <div className="mt-3 flex gap-2">
          <Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" />
          <Button
            onClick={async () => {
              setIsAdding(true);
              const nextDomain = {
                id: Date.now(),
                name: domain.trim(),
                verified: true,
                subdomainVerified: true,
                createdAt: new Date().toISOString(),
                verifyToken: 'demo-token',
                subdomainHost: `pay.${domain.trim()}`,
                subdomainCnameTarget: 'edge.fairfetch.dev',
              };
              const nextDomains = [nextDomain, ...domains];
              publisherMockStore.setDomains(nextDomains);
              setDomains(nextDomains);
              setDomain('');
              toast.success('Domain added');
              setIsAdding(false);
            }}
            disabled={!domain.trim() || isAdding}
          >
            {isAdding ? 'Adding...' : 'Add'}
          </Button>
        </div>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">Domain setup</h2>
        {domains.length === 0 ? <div className="mt-4"><EmptyState title="No domains yet" description="Add your first domain to begin onboarding." /></div> : (
          <div className="mt-4 overflow-x-auto">
            <Table>
              <thead className="text-left text-faircrawl-textMuted"><tr><th>Domain</th><th>DNS</th><th>Paid subdomain</th><th>Created</th><th>Actions</th></tr></thead>
              <tbody>
                {domains.map((d) => (
                  <tr key={d.id} className="border-t border-white/10">
                    <td className="py-2">{d.name}</td>
                    <td><Badge tone={d.verified ? 'success' : 'warning'}>{d.verified ? 'Verified' : 'Pending'}</Badge></td>
                    <td><Badge tone={d.subdomainVerified ? 'success' : 'warning'}>{d.subdomainVerified ? 'Verified' : 'Pending'}</Badge></td>
                    <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td className="space-x-2">
                      <Button variant="secondary" onClick={() => setSelected(d)}>View setup</Button>
                      <Button variant="ghost" onClick={() => toast.success('Re-check complete')}>Re-check</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      <Drawer open={Boolean(selected)} title="Domain setup instructions" onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-3 text-sm">
            <p>Add TXT record: <code>_fairfetch-verify.{selected.name}</code> with token <code>{selected.verifyToken || 'demo-token'}</code>.</p>
            <p>Delegate paid subdomain <code>{selected.subdomainHost || `pay.${selected.name}`}</code> to <code>{selected.subdomainCnameTarget || 'edge.fairfetch.dev'}</code>.</p>
            <div className="flex gap-2">
              <Button onClick={() => toast.success('Verification checked')}>Re-check verification</Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
