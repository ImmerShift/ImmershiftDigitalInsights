import React from 'react';
import { 
  PlaySquare, 
  Eye, 
  Clock, 
  Users, 
  Timer, 
  ChevronDown, 
  Download,
  Calendar,
  MonitorPlay,
  Share2
} from 'lucide-react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useDashboardData } from './hooks/useDashboardData';

export interface YoutubeKpiMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  iconName: string;
}

export interface YoutubeTimeSeriesData {
  date: string;
  views: number;
  watchTimeHours: number;
}

export interface FormatDistribution {
  format: string;
  views: number;
  fill: string;
}

export interface TrafficSourceData {
  source: string;
  value: number;
  fill: string;
}

export interface TopVideoData {
  title: string;
  format: 'Shorts' | 'Video';
  views: number;
  watchTime: string;
  avgDuration: string;
  subscribersGained: number;
}

export interface YoutubeDashboardPayload {
  kpis: YoutubeKpiMetric[];
  timeSeries: YoutubeTimeSeriesData[];
  formatDistribution: FormatDistribution[];
  trafficSources: TrafficSourceData[];
  topVideos: TopVideoData[];
}

const MOCK_FALLBACK_DATA_YOUTUBE: YoutubeDashboardPayload = {
  kpis: [
    {
      title: 'Total Views',
      value: '54,969',
      change: '+45.2%',
      trend: 'up',
      iconName: 'eye'
    },
    {
      title: 'Watch Time (Hours)',
      value: '1,240',
      change: '+18.5%',
      trend: 'up',
      iconName: 'clock'
    },
    {
      title: 'Net Subscribers',
      value: '+3,104',
      change: '+112.4%',
      trend: 'up',
      iconName: 'users'
    },
    {
      title: 'Avg. View Duration',
      value: '1m 21s',
      change: '+0m 05s',
      trend: 'up',
      iconName: 'timer'
    }
  ],
  timeSeries: [
    { date: 'Apr 19', views: 1500, watchTimeHours: 45 },
    { date: 'Apr 20', views: 1800, watchTimeHours: 50 },
    { date: 'Apr 21', views: 3200, watchTimeHours: 80 },
    { date: 'Apr 22', views: 8500, watchTimeHours: 150 },
    { date: 'Apr 23', views: 12000, watchTimeHours: 210 },
    { date: 'Apr 24', views: 9500, watchTimeHours: 180 },
    { date: 'Apr 25', views: 8100, watchTimeHours: 160 }
  ],
  formatDistribution: [
    { format: 'Shorts', views: 41226, fill: '#7A2B20' },
    { format: 'Standard Video', views: 13743, fill: '#DDA77B' }
  ],
  trafficSources: [
    { source: 'Shorts Feed', value: 65, fill: '#DDA77B' },
    { source: 'YouTube Search', value: 15, fill: '#DDA77B' },
    { source: 'Suggested Videos', value: 12, fill: '#DDA77B' },
    { source: 'External', value: 8, fill: '#DDA77B' }
  ],
  topVideos: [
    {
      title: 'Sunset Sessions @ Mari Beach Club vol. 4',
      format: 'Video',
      views: 5400,
      watchTime: '380h',
      avgDuration: '4m 12s',
      subscribersGained: 420
    },
    {
      title: "POV: You just arrived at Bali's best beach club",
      format: 'Shorts',
      views: 22500,
      watchTime: '187h',
      avgDuration: '0m 30s',
      subscribersGained: 1150
    },
    {
      title: 'Making the perfect Mari Signature Cocktail',
      format: 'Shorts',
      views: 15800,
      watchTime: '131h',
      avgDuration: '0m 30s',
      subscribersGained: 890
    },
    {
      title: 'Mari Beach Club Bali - Full Venue Walkthrough 2026',
      format: 'Video',
      views: 4100,
      watchTime: '210h',
      avgDuration: '3m 05s',
      subscribersGained: 215
    },
    {
      title: 'Sunday Brunch Vibes',
      format: 'Shorts',
      views: 7169,
      watchTime: '59h',
      avgDuration: '0m 29s',
      subscribersGained: 429
    }
  ]
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#EAE3D9] p-3 shadow-md rounded-lg">
        <p className="font-bold text-[#3E1510] mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            <span className="font-medium mr-2">{entry.name}:</span>
            {entry.value !== undefined && entry.value !== null ? 
              (typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value) : ''}
            {entry.name === 'Watch Time' ? ' hrs' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'eye': return Eye;
    case 'clock': return Clock;
    case 'users': return Users;
    case 'timer': return Timer;
    default: return PlaySquare;
  }
};

export default function YoutubePlatformOverview() {
  const { data, isLoading, error } = useDashboardData<YoutubeDashboardPayload>('youtube', MOCK_FALLBACK_DATA_YOUTUBE);

  const kpis = Array.isArray(data?.kpis) ? data.kpis : [];
  const timeSeries = Array.isArray(data?.timeSeries) ? data.timeSeries : [];
  const formatDistribution = Array.isArray(data?.formatDistribution) ? data.formatDistribution : [];
  const trafficSources = Array.isArray(data?.trafficSources) ? data.trafficSources : [];
  const topVideos = Array.isArray(data?.topVideos) ? data.topVideos : [];

  return (
    <div className="min-h-screen bg-[#F9F7F4] text-[#3E1510] p-6 lg:p-10 font-sans">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* Section A: The Global Filter Bar */}
        <div className="sticky top-0 bg-white rounded-xl border border-[#EAE3D9] shadow-sm p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FDF8F3] rounded-lg border border-[#EAE3D9] flex items-center justify-center text-[#7A2B20]">
              <PlaySquare size={20} />
            </div>
            <h1 className="text-xl font-bold font-serif text-[#3E1510]">YouTube Channel Performance</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button disabled aria-disabled="true" title="Filter functionality coming soon" className="flex items-center gap-2 px-3 py-2 bg-[#F9F7F4] border border-[#EAE3D9] rounded-lg text-sm font-medium text-[#5C4541] opacity-50 cursor-not-allowed transition-colors">
              <Calendar size={16} />
              Last 7 Days
              <ChevronDown size={14} className="ml-1" />
            </button>
            <button disabled aria-disabled="true" title="Filter functionality coming soon" className="flex items-center gap-2 px-3 py-2 bg-[#F9F7F4] border border-[#EAE3D9] rounded-lg text-sm font-medium text-[#5C4541] opacity-50 cursor-not-allowed transition-colors">
              <MonitorPlay size={16} />
              All Formats
              <ChevronDown size={14} className="ml-1" />
            </button>
            <button disabled aria-disabled="true" title="Filter functionality coming soon" className="flex items-center gap-2 px-3 py-2 bg-[#F9F7F4] border border-[#EAE3D9] rounded-lg text-sm font-medium text-[#5C4541] opacity-50 cursor-not-allowed transition-colors">
              <Share2 size={16} />
              All Sources
              <ChevronDown size={14} className="ml-1" />
            </button>
            
            <div className="w-px h-6 bg-[#EAE3D9] hidden md:block mx-1"></div>
            
            <button disabled aria-disabled="true" title="Export functionality coming soon" className="flex items-center gap-2 px-4 py-2 bg-[#7A2B20] text-white rounded-lg text-sm font-bold shadow-sm opacity-50 cursor-not-allowed transition-colors ml-auto md:ml-0">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#EAE3D9] h-32 rounded-xl"></div>
              <div className="bg-[#EAE3D9] h-32 rounded-xl"></div>
              <div className="bg-[#EAE3D9] h-32 rounded-xl"></div>
              <div className="bg-[#EAE3D9] h-32 rounded-xl"></div>
            </div>
            <div className="bg-[#EAE3D9] h-80 rounded-xl"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#EAE3D9] h-[300px] rounded-xl"></div>
              <div className="bg-[#EAE3D9] h-[300px] rounded-xl"></div>
            </div>
            <div className="bg-[#EAE3D9] h-64 rounded-xl"></div>
          </div>
        ) : (
          <>
            {/* Error State Failsafe */}
            {error && (
              <div className="bg-[#FFF9E6] text-[#B8860B] border border-[#F5E1C8] rounded-xl p-3 mb-6 text-sm font-medium flex justify-between items-center shadow-sm">
                <span>⚠️ Live data sync failed. Displaying cached data.</span>
              </div>
            )}

            {/* Section B: High Contrast KPI Scorecards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((kpi, index) => {
                const Icon = getIcon(kpi.iconName);
                const badgeClasses = kpi.trend === 'up' 
                  ? 'bg-[#EBF4ED] text-[#2E6B3B]' 
                  : kpi.trend === 'down'
                    ? 'bg-[#FEE2E2] text-[#A43927]'
                    : 'bg-gray-100 text-gray-600';

                return (
                  <div key={index} className="bg-white rounded-xl border border-[#EAE3D9] p-5 shadow-sm flex flex-col justify-between h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-[#A88C87]">
                        <Icon size={20} />
                      </div>
                      <h3 className="text-sm font-bold text-[#5C4541] uppercase tracking-wide">{kpi.title}</h3>
                    </div>
                    
                    <div className="text-3xl font-bold font-serif text-[#3E1510] mb-3">
                      {kpi.value}
                    </div>
                    
                    <div className="mt-auto">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${badgeClasses}`}>
                        {kpi.change}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Section C: Performance Over Time (Full Width) */}
            <div className="bg-white rounded-xl border border-[#EAE3D9] p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold font-serif text-[#3E1510]">Channel Growth Trends</h2>
                <p className="text-[#5C4541] text-sm mt-1">Tracking daily Views against Watch Time Hours over the last 7 days.</p>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={timeSeries} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAE3D9" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#A88C87" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#A88C87' }}
                      dy={10}
                    />
                    <YAxis 
                      yAxisId="left" 
                      stroke="#A88C87" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#A88C87' }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      stroke="#A88C87" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#A88C87' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      yAxisId="left"
                      dataKey="views" 
                      name="Views"
                      fill="#FDF8F3" 
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="watchTimeHours" 
                      name="Watch Time"
                      stroke="#7A2B20" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#7A2B20', strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: '#7A2B20', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Section D: Categorical Breakdown (Two Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-[#EAE3D9] p-6 shadow-sm flex flex-col">
                <h2 className="text-xl font-bold font-serif text-[#3E1510] mb-6">Views by Video Format</h2>
                <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={formatDistribution}
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="views"
                        stroke="none"
                      >
                        {formatDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: '1px solid #EAE3D9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#3E1510', fontWeight: 'bold' }}
                        formatter={(value: number) => value.toLocaleString()}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        iconType="circle"
                        formatter={(value, entry: any) => <span className="text-[#3E1510] font-medium ml-1">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-8">
                      <span className="text-2xl font-bold font-serif text-[#3E1510]">54.9K</span>
                      <span className="text-xs font-semibold text-[#A88C87] uppercase tracking-widest mt-1">Total</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-[#EAE3D9] p-6 shadow-sm flex flex-col">
                <h2 className="text-xl font-bold font-serif text-[#3E1510] mb-6">Top Traffic Sources</h2>
                <div className="flex-1 min-h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      layout="vertical" 
                      data={trafficSources}
                      margin={{ top: 0, right: 30, bottom: 0, left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EAE3D9" />
                      <XAxis type="number" hide />
                      <YAxis 
                        type="category" 
                        dataKey="source" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 13, fill: '#5C4541', fontWeight: 500 }}
                        width={110}
                      />
                      <Tooltip 
                        cursor={{ fill: '#FDF8F3' }}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #EAE3D9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`${value}%`, 'Share']}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                        {trafficSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Section E: Detailed Data Table (Full Width) */}
            <div className="bg-white rounded-xl border border-[#EAE3D9] overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[#EAE3D9]">
                <h2 className="text-xl font-bold font-serif text-[#3E1510]">Top Performing Videos</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider w-[40%]">Video Title</th>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">Views</th>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">Watch Time</th>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">Avg Duration</th>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">+ Subs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topVideos.map((video, index) => (
                      <tr key={index} className="border-b border-[#EAE3D9] last:border-b-0 hover:bg-[#F9F7F4] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                              video.format === 'Shorts' ? 'bg-[#EBF4ED] text-[#2E6B3B]' : 'bg-[#FDF8F3] text-[#7A2B20] border border-[#EAE3D9]'
                            }`}>
                              {video.format}
                            </span>
                            <span className="text-sm font-medium text-[#3E1510] line-clamp-1">{video.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#3E1510] text-right">
                          {typeof video.views === 'number' ? video.views.toLocaleString() : video.views}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#5C4541] text-right">
                          {video.watchTime}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#5C4541] text-right">
                          {video.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#2E6B3B] text-right">
                          +{typeof video.subscribersGained === 'number' ? video.subscribersGained.toLocaleString() : video.subscribersGained}
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
