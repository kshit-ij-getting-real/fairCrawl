import { DashboardHeader, DashboardNav, DashboardShell } from '@/components/dashboard/layout';

const publisherItems = [
  { href: '/publisher/dashboard', label: 'Overview' },
  { href: '/publisher/bot-logs', label: 'Bot Logs' },
  { href: '/publisher/domains', label: 'Domains' },
  { href: '/publisher/pricing', label: 'Pricing' },
  { href: '/publisher/transactions', label: 'Transactions' },
  { href: '/publisher/controls', label: 'Content Controls' },
];

export default function PublisherLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell>
      <DashboardHeader
        title="Publisher Dashboard"
        subtitle="Onboard domains, set pricing, and track AI usage revenue."
      />
      <DashboardNav items={publisherItems} />
      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-faircrawl-textMuted">
        <p className="font-medium text-white">How to use this dashboard</p>
        <ul className="mt-2 grid gap-1 md:grid-cols-2">
          <li><span className="text-white">Overview:</span> Track revenue, onboarding progress, and latest paid reads.</li>
          <li><span className="text-white">Domains:</span> Add domains and monitor DNS verification status.</li>
          <li><span className="text-white">Pricing:</span> Set per-license prices for paths that AI can access.</li>
          <li><span className="text-white">Transactions/Controls:</span> Audit ledger history and block protected content patterns.</li>
        </ul>
      </div>
      <div className="mt-6">{children}</div>
    </DashboardShell>
  );
}
