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
      <div className="mt-4 rounded-2xl border border-[rgba(126,135,212,0.18)] bg-[rgba(255,255,255,0.72)] p-4 text-sm text-faircrawl-textMuted shadow-[0_16px_34px_rgba(126,120,210,0.1)]">
        <p className="font-medium text-[#25306d]">How to use this dashboard</p>
        <ul className="mt-2 grid gap-1 md:grid-cols-2">
          <li><span className="font-medium text-[#4953cb]">Overview:</span> Track revenue, onboarding progress, and latest paid reads.</li>
          <li><span className="font-medium text-[#4953cb]">Domains:</span> Add domains and monitor DNS verification status.</li>
          <li><span className="font-medium text-[#4953cb]">Pricing:</span> Set per-license prices for paths that AI can access.</li>
          <li><span className="font-medium text-[#4953cb]">Transactions/Controls:</span> Audit ledger history and block protected content patterns.</li>
        </ul>
      </div>
      <div className="mt-6">{children}</div>
    </DashboardShell>
  );
}
