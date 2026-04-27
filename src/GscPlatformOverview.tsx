import React from 'react';
import { 
  Search, 
  Eye, 
  MousePointerClick, 
  Percent, 
  ListOrdered, 
  ChevronDown, 
  Download,
  Calendar,
  Smartphone,
  Tag
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
  Cell
} from 'recharts';
import { useDashboardData } from './hooks/useDashboardData';

export interface GscKpiMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  iconName: string;
}

export interface GscTimeSeriesData {
  date: string;
  impressions: number;
  clicks: number;
}

export interface RankingDistribution {
  positionGroup: string;
  keywords: number;
  fill: string;
}

export interface SearchQueryData {
  query: string;
  clicks: number;
  impressions: number;
  ctr: string;
  position: number;
}

export interface BrandData {
  name: string;
  value: number;
  fill: string;
}

export interface GscDashboardPayload {
  kpis: GscKpiMetric[];
  timeSeries: GscTimeSeriesData[];
  rankingDistribution: RankingDistribution[];
  topQueries: SearchQueryData[];
  brandData: BrandData[];
}

const MOCK_FALLBACK_DATA_GSC: GscDashboardPayload = {
  kpis: [
    {
      id: 'impressions',
      title: 'Total Impressions',
      value: '168,430',
      change: '+22.4%',
      trend: 'up',
      iconName: 'eye'
    },
    {
      id: 'clicks',
      title: 'Total Clicks',
      value: '1,762',
      change: '+15.2%',
      trend: 'up',
      iconName: 'click'
    },
    {
      id: 'ctr',
      title: 'Average CTR',
      value: '1.05%',
      change: '-0.1%',
      trend: 'down',
      iconName: 'percent'
    },
    {
      id: 'position',
      title: 'Average Position',
      value: '14.2',
      change: '+1.5',
      trend: 'down',
      iconName: 'list'
    }
  ],
  timeSeries: [
    { date: 'Apr 19', impressions: 5200, clicks: 50 },
    { date: 'Apr 20', impressions: 5800, clicks: 55 },
    { date: 'Apr 21', impressions: 6100, clicks: 62 },
    { date: 'Apr 22', impressions: 5900, clicks: 58 },
    { date: 'Apr 23', impressions: 6500, clicks: 70 },
    { date: 'Apr 24', impressions: 7200, clicks: 85 },
    { date: 'Apr 25', impressions: 7000, clicks: 80 }
  ],
  rankingDistribution: [
    { positionGroup: 'Top 3', keywords: 45, fill: '#2E6B3B' },
    { positionGroup: 'Pos 4 to 10', keywords: 120, fill: '#7A2B20' },
    { positionGroup: 'Pos 11 to 20', keywords: 340, fill: '#DDA77B' },
    { positionGroup: 'Pos 21+', keywords: 850, fill: '#A88C87' }
  ],
  brandData: [
    { name: 'Brand', value: 65, fill: '#7A2B20' },
    { name: 'Generic', value: 35, fill: '#DDA77B' }
  ],
  topQueries: [
    { query: 'mari beach club', clicks: 450, impressions: 2100, ctr: '21.4', position: 1.2 },
    { query: 'mari beach club bali', clicks: 320, impressions: 1800, ctr: '17.7', position: 1.5 },
    { query: 'sunset beach club bali', clicks: 115, impressions: 5400, ctr: '2.1', position: 5.4 },
    { query: 'beach club bali', clicks: 85, impressions: 12500, ctr: '0.6', position: 11.2 },
    { query: 'what to do in canggu', clicks: 42, impressions: 8200, ctr: '0.5', position: 14.8 }
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
    case 'click': return MousePointerClick;
    case 'percent': return Percent;
    case 'list': return ListOrdered;
    default: return Search;
  }
};

export default function GscPlatformOverview() {
  const { data, isLoading, error } = useDashboardData<GscDashboardPayload>('gsc', MOCK_FALLBACK_DATA_GSC);

  const kpis = Array.isArray(data?.kpis) ? data.kpis : [];
  const timeSeries = Array.isArray(data?.timeSeries) ? data.timeSeries : [];
  const rankingDistribution = Array.isArray(data?.rankingDistribution) ? data.rankingDistribution : [];
  const brandData = Array.isArray(data?.brandData) ? data.brandData : [];
  const topQueries = Array.isArray(data?.topQueries) ? data.topQueries : [];

  return (
    <div className="min-h-screen bg-[#F9F7F4] text-[#3E1510] p-6 lg:p-10 font-sans">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* Section A: The Global Filter Bar */}
        <div className="sticky top-0 bg-white rounded-xl border border-[#EAE3D9] shadow-sm p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FDF8F3] rounded-lg border border-[#EAE3D9] flex items-center justify-center text-[#7A2B20]">
              <Search size={20} />
            </div>
            <h1 className="text-xl font-bold font-serif text-[#3E1510]">Search Console Performance</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button disabled aria-disabled="true" title="Filter functionality coming soon" className="flex items-center gap-2 px-3 py-2 bg-[#F9F7F4] border border-[#EAE3D9] rounded-lg text-sm font-medium text-[#5C4541] opacity-50 cursor-not-allowed transition-colors">
              <Calendar size={16} />
              Last 7 Days
              <ChevronDown size={14} className="ml-1" />
            </button>
            <button disabled aria-disabled="true" title="Filter functionality coming soon" className="flex items-center gap-2 px-3 py-2 bg-[#F9F7F4] border border-[#EAE3D9] rounded-lg text-sm font-medium text-[#5C4541] opacity-50 cursor-not-allowed transition-colors">
              <Smartphone size={16} />
              All Devices
              <ChevronDown size={14} className="ml-1" />
            </button>
            <button disabled aria-disabled="true" title="Filter functionality coming soon" className="flex items-center gap-2 px-3 py-2 bg-[#F9F7F4] border border-[#EAE3D9] rounded-lg text-sm font-medium text-[#5C4541] opacity-50 cursor-not-allowed transition-colors">
              <Tag size={16} />
              All Queries
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

            {/* Section B: High-Contrast KPI Scorecards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map(kpi => {
                const Icon = getIcon(kpi.iconName);
                
                const badgeClasses = kpi.trend === 'up' 
                  ? 'bg-[#EBF4ED] text-[#2E6B3B]' 
                  : kpi.trend === 'down'
                    ? 'bg-[#FEE2E2] text-[#A43927]'
                    : 'bg-gray-100 text-gray-600';

                return (
                  <div key={kpi.id} className="bg-white rounded-xl border border-[#EAE3D9] p-5 shadow-sm flex flex-col justify-between h-full">
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
                <h2 className="text-xl font-bold font-serif text-[#3E1510]">Visibility vs Engagement</h2>
                <p className="text-[#5C4541] text-sm mt-1">Tracking daily Impressions against Clicks over the last 7 days.</p>
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
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="impressions" 
                      name="Impressions"
                      fill="#FDF8F3" 
                      stroke="#DDA77B" 
                      strokeWidth={2}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="clicks" 
                      name="Clicks"
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
              <div className="bg-white rounded-xl border border-[#EAE3D9] p-6 shadow-sm">
                <h2 className="text-xl font-bold font-serif text-[#3E1510] mb-6">Keyword Ranking Distribution</h2>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      layout="vertical" 
                      data={rankingDistribution}
                      margin={{ top: 0, right: 30, bottom: 0, left: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EAE3D9" />
                      <XAxis type="number" hide />
                      <YAxis 
                        type="category" 
                        dataKey="positionGroup" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 13, fill: '#5C4541', fontWeight: 500 }}
                        width={90}
                      />
                      <Tooltip 
                        cursor={{ fill: '#FDF8F3' }}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #EAE3D9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="keywords" radius={[0, 4, 4, 0]} barSize={32}>
                        {rankingDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-[#EAE3D9] p-6 shadow-sm flex flex-col">
                <h2 className="text-xl font-bold font-serif text-[#3E1510] mb-2">Brand vs Generic Queries</h2>
                <p className="text-sm text-[#5C4541] mb-4">Distribution of total clicks based on brand term inclusion.</p>
                <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8">
                  <div className="relative h-[200px] w-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={brandData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {brandData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #EAE3D9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          itemStyle={{ color: '#3E1510', fontWeight: 'bold' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Center text for Donut */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-bold font-serif text-[#3E1510]">1,762</span>
                      <span className="text-xs font-semibold text-[#A88C87] uppercase tracking-widest mt-1">Total Clicks</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    {brandData.map(item => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.fill }}></div>
                        <div>
                          <div className="text-sm font-bold text-[#3E1510]">{item.name}</div>
                          <div className="text-xs font-medium text-[#5C4541]">{item.value}% of Traffic</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section E: Detailed Data Table (Full Width) */}
            <div className="bg-white rounded-xl border border-[#EAE3D9] overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[#EAE3D9]">
                <h2 className="text-xl font-bold font-serif text-[#3E1510]">Top Search Queries</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider">Search Query</th>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">Clicks</th>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">Impressions</th>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">CTR</th>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">Avg Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topQueries.map((query, index) => (
                      <tr key={index} className="border-b border-[#EAE3D9] last:border-b-0 hover:bg-[#F9F7F4] transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-[#3E1510]">
                          {query.query}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#3E1510] text-right">
                          {typeof query.clicks === 'number' ? query.clicks.toLocaleString() : query.clicks}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#5C4541] text-right">
                          {typeof query.impressions === 'number' ? query.impressions.toLocaleString() : query.impressions}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#5C4541] text-right">
                          {query.ctr}%
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[rgb(92,69,65)] text-right">
                          {typeof query.position === 'number' ? query.position.toFixed(1) : query.position}
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
