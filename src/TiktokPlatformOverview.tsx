import React from 'react';
import { 
  Video, 
  Eye, 
  Activity, 
  UserPlus, 
  User, 
  ChevronDown, 
  Download,
  Calendar,
  Filter,
  BarChart2,
  AlertTriangle
} from 'lucide-react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useDashboardData } from './hooks/useDashboardData';

export interface TiktokKpiMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  iconName: string;
}

export interface TiktokTimeSeriesData {
  date: string;
  views: number;
  engagements: number;
}

export interface DemographicData {
  category: string;
  percentage: number;
  fill: string;
}

export interface TopTiktokData {
  videoTitle: string;
  duration: string;
  views: number;
  likes: number;
  shares: number;
  engagementRate: string;
}

export interface TiktokDashboardPayload {
  kpis: TiktokKpiMetric[];
  timeSeries: TiktokTimeSeriesData[];
  demographics: DemographicData[];
  trafficSources: { name: string; value: number; fill: string }[];
  topVideos: TopTiktokData[];
}

const MOCK_FALLBACK_DATA_TIKTOK: TiktokDashboardPayload = {
  kpis: [
    { title: 'Total Video Views', value: '452,100', change: '+85.4%', trend: 'up', iconName: 'eye' },
    { title: 'Engagement Rate', value: '9.2%', change: '+1.1%', trend: 'up', iconName: 'activity' },
    { title: 'Net New Followers', value: '+1,840', change: '+45.0%', trend: 'up', iconName: 'user-plus' },
    { title: 'Profile Views', value: '15,300', change: '+22.5%', trend: 'up', iconName: 'user' }
  ],
  timeSeries: [
    { date: 'Apr 19', views: 45000, engagements: 4100 },
    { date: 'Apr 20', views: 52000, engagements: 4800 },
    { date: 'Apr 21', views: 110000, engagements: 12500 },
    { date: 'Apr 22', views: 85000, engagements: 8100 },
    { date: 'Apr 23', views: 60000, engagements: 5500 },
    { date: 'Apr 24', views: 48000, engagements: 4200 },
    { date: 'Apr 25', views: 52100, engagements: 4900 }
  ],
  demographics: [
    { category: '18-24', percentage: 45, fill: '#DDA77B' },
    { category: '25-34', percentage: 35, fill: '#7A2B20' },
    { category: '35-44', percentage: 15, fill: '#A88C87' },
    { category: '45+', percentage: 5, fill: '#EAE3D9' }
  ],
  trafficSources: [
    { name: 'For You Feed', value: 85, fill: '#7A2B20' },
    { name: 'Personal Profile', value: 10, fill: '#DDA77B' },
    { name: 'Sound/Hashtag Search', value: 5, fill: '#A88C87' }
  ],
  topVideos: [
    {
      videoTitle: 'pov: skipping work for bali 🌴',
      duration: '0:15',
      views: 215000,
      likes: 24500,
      shares: 3200,
      engagementRate: '12.8%'
    },
    {
      videoTitle: 'Daybed views hit different',
      duration: '0:08',
      views: 85000,
      likes: 7200,
      shares: 450,
      engagementRate: '9.0%'
    },
    {
      videoTitle: 'What IDR 2M gets you at MBC',
      duration: '0:45',
      views: 54000,
      likes: 4800,
      shares: 890,
      engagementRate: '10.5%'
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
            {entry.value.toLocaleString()}
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
    case 'activity': return Activity;
    case 'user-plus': return UserPlus;
    case 'user': return User;
    default: return Video;
  }
};

export default function TiktokPlatformOverview() {
  const { data, isLoading, error } = useDashboardData<TiktokDashboardPayload>('tiktok', MOCK_FALLBACK_DATA_TIKTOK);

  const kpis = Array.isArray(data?.kpis) ? data.kpis : [];
  const timeSeries = Array.isArray(data?.timeSeries) ? data.timeSeries : [];
  const demographicsData = Array.isArray(data?.demographics) ? data.demographics : [];
  const trafficData = Array.isArray(data?.trafficSources) ? data.trafficSources : [];
  const topVideos = Array.isArray(data?.topVideos) ? data.topVideos : [];

  return (
    <div className="min-h-screen bg-[#F9F7F4] text-[#3E1510] p-6 lg:p-10 font-sans">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* Section A: The Global Filter Bar */}
        <div className="sticky top-0 bg-white rounded-xl border border-[#EAE3D9] shadow-sm p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FDF8F3] rounded-lg border border-[#EAE3D9] flex items-center justify-center text-[#7A2B20]">
              <Video size={20} />
            </div>
            <h1 className="text-xl font-bold font-serif text-[#3E1510]">TikTok Performance</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button disabled aria-disabled="true" title="Filter functionality coming soon" className="flex items-center gap-2 px-3 py-2 bg-[#F9F7F4] border border-[#EAE3D9] rounded-lg text-sm font-medium text-[#5C4541] opacity-50 cursor-not-allowed transition-colors">
              <Filter size={16} />
              All Content Types
              <ChevronDown size={14} className="ml-1" />
            </button>
            <button disabled aria-disabled="true" title="Filter functionality coming soon" className="flex items-center gap-2 px-3 py-2 bg-[#F9F7F4] border border-[#EAE3D9] rounded-lg text-sm font-medium text-[#5C4541] opacity-50 cursor-not-allowed transition-colors">
              <BarChart2 size={16} />
              All Metrics
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
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-[#FFF9E6] text-[#B8860B] border border-[#F5E1C8] px-4 py-3 rounded-xl mb-6 flex items-center shadow-sm">
                <AlertTriangle size={18} className="mr-2" />
                <span className="text-sm font-medium">Live data sync failed. Displaying cached data.</span>
              </div>
            )}

            {/* Section B: High Contrast KPI Scorecards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((kpi, index) => {
                const Icon = getIcon(kpi.iconName);
                
                const isPositive = kpi.trend === 'up';
                const badgeClasses = isPositive 
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

            {/* Section C: Performance Over Time */}
            <div className="bg-white rounded-xl border border-[#EAE3D9] p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold font-serif text-[#3E1510]">Virality & Engagement Velocity</h2>
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
                      tickFormatter={(val) => {
                        if (val >= 1000) {
                          return `${val / 1000}k`;
                        }
                        return val;
                      }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      stroke="#A88C87" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#A88C87' }}
                      tickFormatter={(val) => {
                        if (val >= 1000) {
                          return `${val / 1000}k`;
                        }
                        return val;
                      }}
                    />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#F9F7F4' }} />
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
                      dataKey="engagements" 
                      name="Engagements"
                      stroke="#7A2B20" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#7A2B20', strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: '#7A2B20', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Section D: Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-[#EAE3D9] p-6 shadow-sm flex flex-col">
                <h2 className="text-xl font-bold font-serif text-[#3E1510] mb-6">Audience Demographics (Age)</h2>
                
                <div className="flex-1 min-h-[250px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      layout="vertical" 
                      data={demographicsData}
                      margin={{ top: 0, right: 30, bottom: 0, left: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EAE3D9" />
                      <XAxis type="number" hide />
                      <YAxis 
                        type="category" 
                        dataKey="category" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#5C4541', fontWeight: 500 }}
                        width={60}
                      />
                      <RechartsTooltip 
                        cursor={{ fill: '#FDF8F3' }}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #EAE3D9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`${value}%`, 'Percentage']}
                      />
                      <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={32}>
                        {demographicsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-[#EAE3D9] p-6 shadow-sm flex flex-col">
                <h2 className="text-xl font-bold font-serif text-[#3E1510] mb-6">Traffic Source</h2>
                <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8">
                  <div className="relative h-[220px] w-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={trafficData}
                          innerRadius={70}
                          outerRadius={95}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {trafficData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #EAE3D9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          itemStyle={{ color: '#3E1510', fontWeight: 'bold' }}
                          formatter={(value: number) => `${value}%`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-bold font-serif text-[#3E1510]">100%</span>
                      <span className="text-xs font-semibold text-[#A88C87] uppercase tracking-widest mt-1">Sources</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-5">
                    {trafficData.map(item => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: item.fill }}></div>
                        <div>
                          <div className="text-sm font-bold text-[#3E1510]">{item.name}</div>
                          <div className="text-xs font-medium text-[#5C4541]">{item.value}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section E: Detailed Table */}
            <div className="bg-white rounded-xl border border-[#EAE3D9] overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[#EAE3D9]">
                <h2 className="text-xl font-bold font-serif text-[#3E1510]">Top Performing Content</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider">Video Title</th>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">Duration</th>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">Views</th>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">Likes</th>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">Shares</th>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">Eng. Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topVideos.map((video, index) => (
                      <tr key={index} className="border-b border-[#EAE3D9] last:border-b-0 hover:bg-[#F9F7F4] transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-[#3E1510]">
                          {video.videoTitle}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#5C4541] text-right">
                          {video.duration}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#5C4541] text-right">
                          {video.views?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-[#7A2B20] text-right">
                          {video.likes?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#5C4541] text-right">
                          {video.shares?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-[#2E6B3B] text-right">
                          {video.engagementRate}
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

