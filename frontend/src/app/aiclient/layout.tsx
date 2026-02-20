import { DashboardHeader, DashboardNav, DashboardShell } from '@/components/dashboard/layout';

const aiItems = [
  { href: '/aiclient/api-keys', label: 'API keys' },
  { href: '/aiclient/agent-identity', label: 'Agent identity' },
  { href: '/aiclient/usage-spend', label: 'Usage/Spend' },
  { href: '/aiclient/test-paid-request', label: 'Test paid request' },
];

export default function AIClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell>
      <DashboardHeader title="AI Team Dashboard" subtitle="Manage keys, agent identity, and paid access usage." />
      <DashboardNav items={aiItems} />
      <div className="mt-6">{children}</div>
    </DashboardShell>
  );
}
