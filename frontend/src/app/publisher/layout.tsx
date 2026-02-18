import { DashboardHeader, DashboardNav, DashboardShell } from '@/components/dashboard/layout';

const publisherItems = [
  { href: '/publisher/dashboard', label: 'Overview' },
  { href: '/publisher/domains', label: 'Domains' },
  { href: '/publisher/pricing', label: 'Pricing' },
  { href: '/publisher/integrations', label: 'Integrations' },
  { href: '/publisher/transactions', label: 'Transactions' },
  { href: '/publisher/controls', label: 'Content Controls' },
  { href: '/publisher/payouts', label: 'Payouts' },
  { href: '/publisher/demo', label: 'Demo Console' },
];

export default function PublisherLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell>
      <DashboardHeader
        title="Publisher Dashboard"
        subtitle="Onboard domains, set pricing, and track AI usage revenue."
      />
      <DashboardNav items={publisherItems} />
      <div className="mt-6">{children}</div>
    </DashboardShell>
  );
}
