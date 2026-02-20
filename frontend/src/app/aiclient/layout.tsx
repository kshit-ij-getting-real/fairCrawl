import { DashboardHeader, DashboardNav, DashboardShell } from '@/components/dashboard/layout';

const aiItems = [{ href: '/aiclient/dashboard', label: 'Dashboard' }, { href: '/aiclient/usage-spend', label: 'AI Usage & Spend' }];

export default function AIClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell>
      <DashboardHeader title="AI Team Dashboard" subtitle="Manage keys, agent identity, and paid access usage." />
      <DashboardNav items={aiItems} />
      <div className="mt-6">{children}</div>
    </DashboardShell>
  );
}
