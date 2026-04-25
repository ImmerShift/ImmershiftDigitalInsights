import React from 'react';
import { 
  Building2, 
  Calendar, 
  ChevronDown, 
  TrendingUp, 
  Target, 
  Activity, 
  Globe,
  PieChart,
  AlertTriangle
} from 'lucide-react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useDashboardData } from './hooks/useDashboardData';

export interface ExecutiveKpi {
  title: string;
  value: string;
  subtitle: string;
  trend: 'up' | 'down' | 'neutral';
  percentage: string;
  iconName: string;
}

export interface BlendedTimeSeries {
  date: string;
  revenue: number;
  adSpend: number;
  roas: number;
}

export interface ChannelContribution {
  channel: string;
  spend: string;
  revenue: string;
  roas: string;
  shareOfVoice: number;
}

export interface ExecutiveDashboardPayload {
  kpis: ExecutiveKpi[];
  timeSeries: BlendedTimeSeries[];
  channelContribution: ChannelContribution[];
}

const MOCK_FALLBACK_DATA_EXECUTIVE: ExecutiveDashboardPayload = {
  kpis: [
    {
      title: 'Total Digital Revenue',
      value: 'IDR 1.16B',
      subtitle: 'Pacing to IDR 2.8B',
      trend: 'up',
      percentage: '+14.2%',
      iconName: 'trending-up'
    },
    {
      title: 'Blended Ad Spend',
      value: 'IDR 30.1M',
      subtitle: 'Meta + Google + TikTok',
      trend: 'neutral',
      percentage: '+2.1%',
      iconName: 'target'
    },
    {
      title: 'Blended ROAS',
      value: '38.5x',
      subtitle: 'Target: 25.0x',
      trend: 'up',
      percentage: '+12.0%',
      iconName: 'activity'
    },
    {
      title: 'Total Digital Reach',
      value: '545k',
      subtitle: 'Across all platforms',
      trend: 'up',
      percentage: '+34.0%',
      iconName: 'globe'
    }
  ],
  timeSeries: Array.from({ length: 15 }, (_, i) => {
    const day = i + 1;
    const adSpend = Math.round((Math.random() * 1 + 1.5) * 10) / 10;
    const revenue = Math.round((Math.random() * 60 + 60) * 10) / 10;
    const roas = Math.round((revenue / adSpend) * 10) / 10;
    
    return {
      date: `Apr ${day.toString().padStart(2, '0')}`,
      adSpend,
      revenue,
      roas
    };
  }),
  channelContribution: [
    {
      channel: 'Meta Ads',
      spend: 'IDR 19.5M',
      revenue: 'IDR 480M',
      roas: '24.6x',
      shareOfVoice: 45
    },
    {
      channel: 'Google P-Max',
      spend: 'IDR 8.5M',
      revenue: 'IDR 510M',
      roas: '60.0x',
      shareOfVoice: 35
    },
    {
      channel: 'YouTube Demand Gen',
      spend: 'IDR 2.1M',
      revenue: 'IDR 170M',
      roas: '80.9x',
      shareOfVoice: 20
    }
  ]
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const revenue = payload.find((p: any) => p.dataKey === 'revenue')?.value;
    const spend = payload.find((p: any) => p.dataKey === 'adSpend')?.value;
    const roas = spend > 0 ? (revenue / spend).toFixed(1) : 0;

    return (
      <div className="bg-white border border-[#EAE3D9] p-4 shadow-lg rounded-xl min-w-[200px]">
        <p className="font-bold text-[#3E1510] mb-3 border-b border-[#EAE3D9] pb-2">{label}, 2026</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-[#7A2B20] flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#7A2B20]"></div>
              Revenue
            </span>
            <span className="font-bold text-[#3E1510]">IDR {revenue?.toFixed(1)}M</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-[#DDA77B] flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#DDA77B]"></div>
              Ad Spend
            </span>
            <span className="font-bold text-[#3E1510]">IDR {spend?.toFixed(1)}M</span>
          </div>
          <div className="pt-2 mt-2 border-t border-dashed border-[#EAE3D9] flex justify-between items-center text-sm">
            <span className="font-medium text-[#5C4541]">Daily ROAS</span>
            <span className="font-bold text-[#2E6B3B] bg-[#EBF4ED] px-2 py-0.5 rounded">{roas}x</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'trending-up': return TrendingUp;
    case 'target': return Target;
    case 'activity': return Activity;
    case 'globe': return Globe;
    default: return Building2;
  }
};

export default function ExecutiveOverview() {
  const { data, isLoading, error } = useDashboardData<ExecutiveDashboardPayload>('executive', MOCK_FALLBACK_DATA_EXECUTIVE);

  const kpis = Array.isArray(data?.kpis) ? data.kpis : [];
  const timeSeries = Array.isArray(data?.timeSeries) ? data.timeSeries : [];
  const channelContribution = Array.isArray(data?.channelContribution) ? data.channelContribution : [];

  return (
    <div className="min-h-screen bg-[#F9F7F4] text-[#3E1510] p-6 lg:p-10 font-sans">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        
        {/* Section A: The SaaS Command Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#EAE3D9] pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#3E1510]">Executive Command Center</h1>
            <p className="text-[#5C4541] mt-1 flex items-center gap-2">
              <Building2 size={16} />
              Property: Mari Beach Club, Bali
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#EAE3D9] rounded-xl text-sm font-medium text-[#3E1510] hover:bg-[#FDF8F3] transition-colors shadow-sm">
              <Building2 size={16} className="text-[#A88C87]" />
              Mari Beach Club
              <ChevronDown size={14} className="ml-1 text-[#A88C87]" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#EAE3D9] rounded-xl text-sm font-medium text-[#3E1510] hover:bg-[#FDF8F3] transition-colors shadow-sm">
              <Calendar size={16} className="text-[#A88C87]" />
              April 1 - April 15, 2026
              <ChevronDown size={14} className="ml-1 text-[#A88C87]" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-8 mt-6">
            {/* KPI Skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-[#EAE3D9] h-40 rounded-2xl"></div>
              ))}
            </div>
            {/* Chart Skeleton */}
            <div className="bg-[#EAE3D9] h-[450px] rounded-2xl"></div>
            {/* Table Skeleton */}
            <div className="bg-[#EAE3D9] h-[350px] rounded-2xl"></div>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-[#FFF9E6] text-[#B8860B] border border-[#F5E1C8] px-4 py-3 rounded-xl mb-6 flex items-center shadow-sm">
                <AlertTriangle size={18} className="mr-2" />
                <span className="text-sm font-medium">Live data sync failed. Displaying cached data.</span>
              </div>
            )}

            {/* Section B: The North Star KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {kpis.map((kpi, index) => {
                const Icon = getIcon(kpi.iconName);
                const isPositive = kpi.trend === 'up';
                const badgeClasses = isPositive 
                  ? 'bg-[#EBF4ED] text-[#2E6B3B]' 
                  : 'bg-gray-100 text-gray-600';

                return (
                  <div key={index} className="bg-white rounded-2xl border border-[#EAE3D9] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-sm font-bold text-[#5C4541] uppercase tracking-wide pr-2">{kpi.title}</h3>
                      <div className="w-10 h-10 rounded-xl bg-[#FDF8F3] text-[#A88C87] flex items-center justify-center shrink-0">
                        <Icon size={20} />
                      </div>
                    </div>
                    
                    <div className="text-4xl tracking-tight font-bold text-[#3E1510] mb-4">
                      {kpi.value}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-auto">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${badgeClasses}`}>
                        {kpi.percentage}
                      </span>
                      <span className="text-xs font-medium text-[#A88C87] truncate">
                        {kpi.subtitle}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Section C: The Revenue Engine Chart (Full Width) */}
            <div className="bg-white rounded-2xl border border-[#EAE3D9] p-6 lg:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold font-serif text-[#3E1510]">Revenue vs Blended Spend Pacing</h2>
                <div className="flex items-center gap-4 text-sm font-medium">
                    <div className="flex items-center gap-1.5 text-[#7A2B20]">
                        <div className="w-3 h-3 rounded-full bg-[#7A2B20]"></div>
                        Revenue
                    </div>
                    <div className="flex items-center gap-1.5 text-[#DDA77B]">
                        <div className="w-3 h-3 rounded-md bg-[#DDA77B] opacity-40"></div>
                        Ad Spend
                    </div>
                </div>
              </div>
              
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={timeSeries} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAE3D9" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#A88C87" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#A88C87', fontWeight: 500 }}
                      dy={10}
                    />
                    <YAxis 
                      yAxisId="left" 
                      stroke="#A88C87" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#A88C87', fontWeight: 500 }}
                      tickFormatter={(val) => `${val}M`}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      stroke="#A88C87" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#A88C87', fontWeight: 500 }}
                      tickFormatter={(val) => `${val}M`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9F7F4' }} />
                    <Bar 
                      yAxisId="right"
                      dataKey="adSpend" 
                      name="Ad Spend"
                      fill="#DDA77B" 
                      fillOpacity={0.4}
                      radius={[4, 4, 0, 0]}
                      barSize={32}
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="revenue" 
                      name="Revenue"
                      stroke="#7A2B20" 
                      strokeWidth={4} 
                      dot={false}
                      activeDot={{ r: 6, fill: '#7A2B20', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Section D: Channel Economics Table */}
            <div className="bg-white rounded-2xl border border-[#EAE3D9] overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[#EAE3D9] flex items-center gap-3">
                <PieChart className="text-[#A88C87]" size={20} />
                <h2 className="text-xl font-bold font-serif text-[#3E1510]">Channel Contribution & ROAS</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr>
                      <th className="bg-[#FDF8F3] px-6 py-4 text-xs font-bold text-[#A88C87] uppercase tracking-wider">Channel</th>
                      <th className="bg-[#FDF8F3] px-6 py-4 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">Ad Spend</th>
                      <th className="bg-[#FDF8F3] px-6 py-4 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">Attributed Revenue</th>
                      <th className="bg-[#FDF8F3] px-6 py-4 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">ROAS</th>
                      <th className="bg-[#FDF8F3] px-6 py-4 text-xs font-bold text-[#A88C87] uppercase tracking-wider w-64">Share of Voice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE3D9]">
                    {channelContribution.map((channel, index) => (
                      <tr key={index} className="hover:bg-[#F9F7F4] transition-colors">
                        <td className="px-6 py-5 text-sm font-bold text-[#3E1510]">
                          {channel.channel}
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-[#5C4541] text-right">
                          {channel.spend}
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-[#7A2B20] text-right">
                          {channel.revenue}
                        </td>
                        <td className="px-6 py-5 text-sm font-bold text-[#2E6B3B] text-right">
                          <span className="bg-[#EBF4ED] px-2.5 py-1 rounded-lg">
                            {channel.roas}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-[#EAE3D9] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#DDA77B] rounded-full"
                                style={{ width: `${channel.shareOfVoice}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-bold text-[#5C4541] w-10 text-right">
                              {channel.shareOfVoice}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
