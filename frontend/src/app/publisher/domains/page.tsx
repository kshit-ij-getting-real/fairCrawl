'use client';
import { useEffect, useState } from 'react';
import { Badge, Button, Card, Drawer, EmptyState, Input, Table } from '@/components/dashboard/primitives';
import { toast } from '@/components/toast/ToastProvider';
import { apiFetch } from '@/lib/api';
import { getErrorMessage } from '@/lib/errorMessage';

type PublisherDomain = {
  id: number;
  name: string;
  verified: boolean;
  verifyToken?: string;
  subdomainHost?: string | null;
  subdomainCnameTarget?: string | null;
  createdAt: string;
  instructions?: string;
};

export default function DomainsPage() {
  const [domains, setDomains] = useState<PublisherDomain[]>([]);
  const [domain, setDomain] = useState('');
  const [selected, setSelected] = useState<PublisherDomain | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch('/api/publisher/domains');
      setDomains(Array.isArray(response) ? response : []);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setDomains([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold">Add domain</h2>
        <p className="mt-2 text-sm text-faircrawl-textMuted">Domains are stored in FairFetch and mapped to your publisher account.</p>
        <div className="mt-3 flex gap-2">
          <Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" />
          <Button
            onClick={async () => {
              setIsAdding(true);
              try {
                await apiFetch('/api/publisher/domains', {
                  method: 'POST',
                  body: JSON.stringify({ domain: domain.trim() }),
                });
                setDomain('');
                toast.success('Domain added');
                await load();
              } catch (error) {
                toast.error(getErrorMessage(error));
              } finally {
                setIsAdding(false);
              }
            }}
            disabled={!domain.trim() || isAdding}
          >
            {isAdding ? 'Adding...' : 'Add'}
          </Button>
        </div>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">Domain setup</h2>
        {isLoading ? (
          <p className="mt-4 text-sm text-faircrawl-textMuted">Loading domains...</p>
        ) : domains.length === 0 ? <div className="mt-4"><EmptyState title="No domains yet" description="Add your first domain to begin onboarding." /></div> : (
          <div className="mt-4 overflow-x-auto">
            <Table>
              <thead className="text-left text-faircrawl-textMuted"><tr><th>Domain</th><th>DNS</th><th>Paid subdomain</th><th>Created</th><th>Actions</th></tr></thead>
              <tbody>
                {domains.map((d) => (
                  <tr key={d.id} className="border-t border-white/10">
                    <td className="py-2">{d.name}</td>
                    <td><Badge tone={d.verified ? 'success' : 'warning'}>{d.verified ? 'Verified' : 'Pending'}</Badge></td>
                    <td>
                      <Badge tone={d.subdomainHost ? 'success' : 'warning'}>
                        {d.subdomainHost ? 'Configured' : 'Pending'}
                      </Badge>
                    </td>
                    <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td className="space-x-2">
                      <Button variant="secondary" onClick={() => setSelected(d)}>View setup</Button>
                      <Button
                        variant="ghost"
                        disabled={isChecking}
                        onClick={async () => {
                          setIsChecking(true);
                          try {
                            await apiFetch(`/api/publisher/domains/${d.id}/verify-dns`, { method: 'POST' });
                            toast.success('Re-check complete');
                            await load();
                          } catch (error) {
                            toast.error(getErrorMessage(error));
                          } finally {
                            setIsChecking(false);
                          }
                        }}
                      >
                        {isChecking ? 'Checking...' : 'Re-check'}
                      </Button>
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
            <p>Add TXT record: <code>_fairfetch-verify.{selected.name}</code> with token <code>{selected.verifyToken || 'not available'}</code>.</p>
            <p>Delegate paid subdomain <code>{selected.subdomainHost || `pay.${selected.name}`}</code> to <code>{selected.subdomainCnameTarget || 'edge.fairfetch.dev'}</code>.</p>
            {selected.instructions ? <p className="text-faircrawl-textMuted">{selected.instructions}</p> : null}
            <div className="flex gap-2">
              <Button
                disabled={isChecking}
                onClick={async () => {
                  setIsChecking(true);
                  try {
                    await apiFetch(`/api/publisher/domains/${selected.id}/verify-dns`, { method: 'POST' });
                    toast.success('Verification checked');
                    await load();
                    setSelected(null);
                  } catch (error) {
                    toast.error(getErrorMessage(error));
                  } finally {
                    setIsChecking(false);
                  }
                }}
              >
                {isChecking ? 'Checking...' : 'Re-check verification'}
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
