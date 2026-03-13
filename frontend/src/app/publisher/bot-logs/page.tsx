import { BotAnalyticsCharts } from '@/components/dashboard/BotAnalyticsCharts';

export default function BotLogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-[#25306d]">Bot Analytics</h1>
        <p className="text-sm text-faircrawl-textMuted">
          View which AI agents are crawling your domains based on publisher access logs. Select a domain and time range to see the breakdown.
        </p>
      </div>

      <BotAnalyticsCharts />
    </div>
  );
}
