'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Card, Table, EmptyState, Badge } from '@/components/dashboard/primitives';
import { apiFetch } from '@/lib/http';
import { toast } from '@/components/toast/ToastProvider';
import { getErrorMessage } from '@/lib/errorMessage';
import { getOrResolveOrgId } from '@/lib/orgContext';

// Common bots and their simplified icons (SVG paths)
const BOT_ICONS: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  'openai.com/bot': {
    color: '#10a37f', // OpenAI green
    label: 'OpenAI Bot',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A6.0651 6.0651 0 0 0 19.022 19.819a5.9847 5.9847 0 0 0 3.9977-2.9001 6.051 6.051 0 0 0-.7378-7.0978ZM16.326 2.8256a4.2642 4.2642 0 0 1 2.394 2.1158c-.503-.0491-1.0088-.0491-1.5118 0l-5.6568.5562a.49.49 0 0 0-.3064.8196c1.3664 1.3413 2.73 2.6853 4.0988 4.024A.481.481 0 0 0 16 10.3626l5.7725-1.921c.2163-.0715.39-.239.4673-.4504A4.3031 4.3031 0 0 0 20.306 4.606a4.2642 4.2642 0 0 0-3.98-1.7804Zm-7.7922.3854a4.3031 4.3031 0 0 1 3.2514-.2984l.8703 2.6105a1.4428 1.4428 0 0 1-.3637 1.4852l-2.4827 2.4826a1.4428 1.4428 0 0 1-1.4851.3637l-2.6105-.8703A4.2642 4.2642 0 0 0 2.2282 10.39c.2114-.0773.379-.2508.4504-.4672l1.921-5.7726A4.3031 4.3031 0 0 1 8.5338 3.211Zm-5.32 8.789a4.2642 4.2642 0 0 1 1.7804-3.98c.1965.856.551 1.6738 1.047 2.4116.5937.886 1.3483 1.6406 2.234 2.234a4.4253 4.4253 0 0 0 2.4578 1.0543c-.495.068-.9928.0935-1.4891.0772l-5.6425-.5552a.49.49 0 0 1-.4415-.49v-5.6989c.0051-.2355.0718-.465.191-.6632A4.2642 4.2642 0 0 0 5.4802 6.54c-.1648.1186-.3184.2505-.4584.394-1.2292 1.258-2.0006 2.87-2.2153 4.6293a4.2642 4.2642 0 0 0 1.05 4.0935c1.458 1.455 3.6593 1.9547 5.6192 1.272.2346-.0814.3965-.304.3855-.5512l-.2086-5.8336a.49.49 0 0 0-.49-.4414H3.2138Zm12.2524 8.789a4.2642 4.2642 0 0 1-2.394-2.1158c.503.049 1.0088.049 1.5118 0l5.6568-.5562a.49.49 0 0 0 .3064-.8196c-1.3664-1.3413-2.73-2.6853-4.0988-4.024a.481.481 0 0 0-.6617 0l-5.7726 1.921c-.2163.0715-.39.239-.4672.4504A4.3031 4.3031 0 0 0 3.694 19.394a4.2642 4.2642 0 0 0 3.98 1.7804Zm7.7922-.3854a4.3031 4.3031 0 0 1-3.2515.2984l-.8702-2.6105a1.4428 1.4428 0 0 1 .3637-1.4851l2.4826-2.4827a1.4428 1.4428 0 0 1 1.4852-.3637l2.6105.8702A4.2642 4.2642 0 0 0 21.7718 13.61c-.2114.0773-.379.2508-.4504.4673l-1.921 5.7725A4.3031 4.3031 0 0 1 15.4662 20.789Zm5.32-8.789a4.2642 4.2642 0 0 1-1.7804 3.98c-.1965-.856-.551-1.6738-1.047-2.4116-.5937-.886-1.3483-1.6406-2.234-2.234a4.4253 4.4253 0 0 0-2.4578-1.0543c.495-.068.9928-.0935 1.4891-.0772l5.6425.5552a.49.49 0 0 1 .4415.49v5.6989c-.0051.2355-.0718.465-.191.6632A4.2642 4.2642 0 0 0 18.5198 17.46c.1648-.1186.3184-.2505.4584-.394 1.2292-1.258 2.0006-2.87 2.2153-4.6293a4.2642 4.2642 0 0 0-1.05-4.0935c-1.458-1.455-3.6593-1.9547-5.6192-1.272-.2346.0814-.3965.304-.3855.5512l.2086 5.8336a.49.49 0 0 0 .49.4414H20.7862Z" />
      </svg>
    ),
  },
  'Claude-User@anthropic.com': {
    color: '#d97757', // Anthropic peach/orange approx
    label: 'Claude Bot',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
      </svg>
    ),
  },
  'Google-Extended': {
    color: '#4285F4', // Google blue
    label: 'Google GenAI',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z" />
      </svg>
    ),
  },
  'Amazonbot': {
    color: '#FF9900', // Amazon orange
    label: 'Amazon Bot',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M14.636 18.068c-2.479 1.496-5.833 2.05-8.232 1.638-.582-.1-1.026.471-.62.923 2.126 2.378 6.48 3.031 9.47 1.62.502-.236.467-.932-.016-1.125a17.203 17.203 0 00-4.226-1.294c-.219-.045-.298-.291-.129-.413.754-.543 2.452-1.921 3.518-2.92.355-.33-.081-.84-.465-.54z" />
      </svg>
    ),
  },
  'Bytespider': {
    color: '#00F0FF', // TikTok cyan approx
    label: 'ByteDance Bot',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M19.321 5.562a5.122 5.122 0 01-3.55-1.447A5.205 5.205 0 0114.305.5h-3.41v15.22c0 2.213-1.79 4.004-4.004 4.004-2.214 0-4.004-1.79-4.004-4.004 0-2.214 1.79-4.004 4.004-4.004.385 0 .755.056 1.106.155v-3.53a7.485 7.485 0 00-1.106-.084c-4.14 0-7.498 3.358-7.498 7.498 0 4.14 3.358 7.498 7.498 7.498 4.14 0 7.498-3.358 7.498-7.498V8.65a8.625 8.625 0 004.932 1.54V6.756a5.14 5.14 0 01-2.988-1.194" />
      </svg>
    ),
  },
  'others': {
    color: '#8884d8', // Fallback purple
    label: 'Human traffic',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
      </svg>
    ),
  },
};

const getBotDisplayInfo = (name: string) => {
  return BOT_ICONS[name] || BOT_ICONS['others'];
};

type BotData = {
  name: string;
  count: number;
};

// Common Material UI styled palette for charts if fallbacks needed
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

type DomainRow = {
  id: number;
  domain: string;
};

export function BotAnalyticsCharts() {
  const [data, setData] = useState<BotData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [domains, setDomains] = useState<DomainRow[]>([]);
  const [selectedDomainId, setSelectedDomainId] = useState<string>('');
  
  // Custom Time Range values (1 Day, 7 Days, 30 Days)
  const [timeRangeDays, setTimeRangeDays] = useState<number>(1);

  // Load domains on mount
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const orgId = await getOrResolveOrgId();
        const domainsRes = orgId ? await apiFetch(`/api/domains?orgId=${orgId}`) : [];
        if (Array.isArray(domainsRes) && domainsRes.length > 0) {
          setDomains(domainsRes);
          setSelectedDomainId(domainsRes[0].id.toString());
        }
      } catch (err: any) {
        toast.error('Failed to load domains: ' + getErrorMessage(err));
      }
    };
    fetchDomains();
  }, []);

  // Fetch log data whenever domain or time range changes
  useEffect(() => {
    if (!selectedDomainId) return;

    const fetchLogs = async () => {
      setLoading(true);
      try {
        const nowSecs = Math.floor(Date.now() / 1000);
        const startSecs = nowSecs - (timeRangeDays * 24 * 60 * 60);

        const res = await apiFetch(`/api/user-agent-logs?domainId=${selectedDomainId}&startEpoch=${startSecs}&endEpoch=${nowSecs}`);
        
        // Ensure standard shape
        if (Array.isArray(res)) {
          setData(res);
        } else {
          setData([]);
        }
      } catch (err: any) {
        toast.error('Failed to fetch bot logs: ' + getErrorMessage(err));
        setData([]); // Clear data on error
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [selectedDomainId, timeRangeDays]);

  const totalHits = data.reduce((acc, curr) => acc + curr.count, 0);
  const topBot = data[0];

  return (
    <div className="space-y-6">
      
      {/* Controls */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <label className="text-xs text-faircrawl-textMuted mb-1">Select Domain</label>
            <select
              value={selectedDomainId}
              onChange={(e) => setSelectedDomainId(e.target.value)}
              className="rounded-xl border border-[rgba(126,135,212,0.16)] bg-[rgba(255,255,255,0.74)] px-3 py-2 text-sm text-[#25306d] shadow-[0_10px_24px_rgba(157,166,230,0.12)] focus:outline-none focus:ring-2 focus:ring-[rgba(110,122,228,0.2)]"
              disabled={domains.length === 0}
            >
              {domains.length === 0 ? (
                <option value="">No domains found</option>
              ) : (
                domains.map(d => (
                  <option key={d.id} value={d.id}>{d.domain}</option>
                ))
              )}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-faircrawl-textMuted mb-1">Time Range</label>
            <div className="flex space-x-2">
              {[1, 7, 30].map(days => (
                <button
                  key={days}
                  onClick={() => setTimeRangeDays(days)}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    timeRangeDays === days
                      ? 'bg-gradient-to-r from-[#4f58da] to-[#9368f4] text-white font-semibold shadow-[0_10px_22px_rgba(95,100,222,0.24)]'
                      : 'border border-[rgba(126,135,212,0.16)] bg-[rgba(255,255,255,0.68)] text-[#6670a2] hover:bg-[rgba(110,122,228,0.08)] hover:text-[#4953cb]'
                  }`}
                >
                  {days === 1 ? '1 Day' : `${days} Days`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Analytics Main View */}
      {loading ? (
        <Card>
          <div className="flex h-64 items-center justify-center">
            <p className="text-faircrawl-textMuted">Loading bot analytics...</p>
          </div>
        </Card>
      ) : data.length === 0 ? (
        <Card>
          <EmptyState title="No bot activity found" description={`No bot logs found for the selected time range (${timeRangeDays} days).`} />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Section */}
          <Card>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-[#25306d]">Crawl Distribution</h3>
                <p className="mt-1 text-xs text-faircrawl-textMuted">Traffic share by known AI agents for the selected domain.</p>
              </div>
              <div className="rounded-2xl border border-[rgba(126,135,212,0.14)] bg-[linear-gradient(135deg,rgba(111,120,230,0.12),rgba(201,140,255,0.08))] px-3 py-2 text-right shadow-[0_14px_34px_rgba(124,132,214,0.12)]">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#7c83b0]">Top Agent</p>
                <p className="mt-1 text-sm font-semibold text-[#25306d]">{topBot ? getBotDisplayInfo(topBot.name).label : 'None yet'}</p>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(220px,0.9fr)]">
              <div className="relative rounded-[28px] border border-[rgba(126,135,212,0.14)] bg-[radial-gradient(circle_at_top,rgba(165,173,244,0.18),rgba(255,255,255,0.72)_58%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
                <div className="h-72 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <RechartsTooltip 
                        formatter={(value: number, _name, item: any) => {
                          const percentage = totalHits > 0 ? ((Number(value) / totalHits) * 100).toFixed(1) : '0.0';
                          return [`${Number(value).toLocaleString()} hits (${percentage}%)`, getBotDisplayInfo(item?.payload?.name || '').label];
                        }}
                        contentStyle={{
                          backgroundColor: 'rgba(255,255,255,0.96)',
                          borderColor: 'rgba(126,135,212,0.18)',
                          borderRadius: '16px',
                          color: '#25306d',
                          boxShadow: '0 18px 40px rgba(109, 118, 199, 0.18)',
                        }}
                        itemStyle={{ color: '#25306d' }}
                        labelStyle={{ color: '#6f76a5' }}
                      />
                      <Pie
                        data={data}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={92}
                        innerRadius={62}
                        paddingAngle={3}
                        cornerRadius={8}
                        stroke="rgba(255,255,255,0.9)"
                        strokeWidth={4}
                      >
                        {data.map((entry, index) => {
                          const displayInfo = getBotDisplayInfo(entry.name);
                          const color = BOT_ICONS[entry.name] ? displayInfo.color : COLORS[index % COLORS.length];
                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full border border-[rgba(126,135,212,0.12)] bg-[rgba(255,255,255,0.9)] px-6 py-5 text-center shadow-[0_12px_30px_rgba(126,135,212,0.16)]">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[#8a91b8]">Total Hits</p>
                    <p className="mt-2 text-3xl font-semibold text-[#25306d]">{totalHits.toLocaleString()}</p>
                    <p className="mt-1 text-xs text-faircrawl-textMuted">{data.length} tracked bots</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {data.map((row, index) => {
                  const info = getBotDisplayInfo(row.name);
                  const percentage = totalHits > 0 ? (row.count / totalHits) * 100 : 0;
                  const color = BOT_ICONS[row.name] ? info.color : COLORS[index % COLORS.length];

                  return (
                    <div
                      key={`${row.name}-${index}`}
                      className="rounded-2xl border border-[rgba(126,135,212,0.14)] bg-[rgba(255,255,255,0.62)] p-3 shadow-[0_12px_32px_rgba(126,135,212,0.08)]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span
                            className="flex h-10 w-10 items-center justify-center rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
                            style={{ backgroundColor: `${color}1F`, color }}
                          >
                            {info.icon}
                          </span>
                          <div>
                            <p className="font-medium text-[#25306d]">{info.label}</p>
                            <p className="text-xs text-faircrawl-textMuted">{row.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#25306d]">{percentage.toFixed(1)}%</p>
                          <p className="text-xs text-faircrawl-textMuted">{row.count.toLocaleString()} hits</p>
                        </div>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[rgba(126,135,212,0.12)]">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.max(percentage, 6)}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Table Section */}
          <Card className="flex flex-col -space-y-4">
            <h3 className="mb-4 text-lg font-semibold text-[#25306d]">Bot Breakdown</h3>
            <div className="overflow-auto flex-grow h-64 sm:h-80">
              <Table>
                <thead className="text-left text-faircrawl-textMuted sticky top-0 bg-transparent backdrop-blur-md">
                  <tr>
                    <th className="py-2.5">AI Agent Requestor</th>
                    <th className="py-2.5 text-right">Hit Count</th>
                    <th className="py-2.5 text-right">% Share</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => {
                    const info = getBotDisplayInfo(row.name);
                    const percentage = ((row.count / totalHits) * 100).toFixed(1);
                    return (
                      <tr key={index} className="border-t border-[rgba(126,135,212,0.12)] transition-colors hover:bg-[rgba(255,255,255,0.34)]">
                        <td className="py-3 flex items-center space-x-3">
                            <span style={{ color: info.color }}>{info.icon}</span>
                            <div>
                               <p className="font-medium text-[#25306d]">{info.label}</p>
                               <p className="text-xs text-faircrawl-textMuted">{row.name}</p>
                            </div>
                        </td>
                        <td className="py-3 text-right font-medium text-[#25306d]">{row.count.toLocaleString()}</td>
                        <td className="py-3 text-right">
                          <Badge tone="muted">{percentage}%</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
