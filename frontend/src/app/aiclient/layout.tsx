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
      <div className="mt-4 rounded-2xl border border-[rgba(126,135,212,0.18)] bg-[rgba(255,255,255,0.72)] p-4 text-sm text-faircrawl-textMuted shadow-[0_16px_34px_rgba(126,120,210,0.1)]">
        <p className="font-medium text-[#25306d]">How to use this dashboard</p>
        <ul className="mt-2 grid gap-1 md:grid-cols-2">
          <li><span className="font-medium text-[#4953cb]">API keys:</span> Create and revoke credentials for token minting.</li>
          <li><span className="font-medium text-[#4953cb]">Agent identity:</span> Register the crawler ID and user-agent policy.</li>
          <li><span className="font-medium text-[#4953cb]">Usage/Spend:</span> Audit request count and spend by domain/day.</li>
          <li><span className="font-medium text-[#4953cb]">Test paid request:</span> Run an end-to-end token + content redemption test.</li>
        </ul>
      </div>
      <div className="mt-6">{children}</div>
    </DashboardShell>
  );
}
