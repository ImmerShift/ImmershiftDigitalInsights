import React from 'react';
import { 
  BarChart2, 
  ChevronDown, 
  Download,
  Calendar,
  Filter,
  Users,
  Activity,
  Clock,
  Target
} from 'lucide-react';
import {
  ComposedChart,
  Area,
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

export interface KpiMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  iconName: 'users' | 'activity' | 'clock' | 'target';
}

export interface TimeSeriesData {
  date: string;
  users: number;
  sessions: number;
}

export interface TrafficSourceData {
  name: string;
  value: number;
  fill: string;
}

export interface DeviceData {
  category: string;
  percentage: number;
  fill: string;
}

export interface PageData {
  pagePath: string;
  views: number;
  users: number;
  bounceRate: string;
}

export interface Ga4DashboardPayload {
  kpis: KpiMetric[];
  timeSeries: TimeSeriesData[];
  sources: TrafficSourceData[];
  devices: DeviceData[];
  topPages: PageData[];
}

const MOCK_FALLBACK_DATA: Ga4DashboardPayload = {
  kpis: [
    { title: 'Total Users', value: '125,430', change: '+15.2%', trend: 'up', iconName: 'users' },
    { title: 'Sessions', value: '168,200', change: '+12.4%', trend: 'up', iconName: 'activity' },
    { title: 'Avg. Engagement', value: '1m 45s', change: '+5.0%', trend: 'up', iconName: 'clock' },
    { title: 'Conversions', value: '4,520', change: '+8.1%', trend: 'up', iconName: 'target' }
  ],
  timeSeries: [
    { date: 'Apr 19', users: 15000, sessions: 20000 },
    { date: 'Apr 20', users: 16500, sessions: 22000 },
    { date: 'Apr 21', users: 18000, sessions: 24000 },
    { date: 'Apr 22', users: 17500, sessions: 23500 },
    { date: 'Apr 23', users: 19000, sessions: 25000 },
    { date: 'Apr 24', users: 21000, sessions: 28000 },
    { date: 'Apr 25', users: 18430, sessions: 25700 }
  ],
  sources: [
    { name: 'Organic Search', value: 45, fill: '#7A2B20' },
    { name: 'Direct', value: 35, fill: '#DDA77B' },
    { name: 'Paid Social', value: 15, fill: '#A88C87' },
    { name: 'Referral', value: 5, fill: '#EAE3D9' }
  ],
  devices: [
    { category: 'Mobile', percentage: 65, fill: '#DDA77B' },
    { category: 'Desktop', percentage: 30, fill: '#7A2B20' },
    { category: 'Tablet', percentage: 5, fill: '#A88C87' }
  ],
  topPages: [
    { pagePath: '/', views: 45000, users: 38000, bounceRate: '35.2%' },
    { pagePath: '/menu', views: 28000, users: 22000, bounceRate: '42.1%' },
    { pagePath: '/daybeds', views: 18500, users: 15000, bounceRate: '28.5%' },
    { pagePath: '/events', views: 12000, users: 9500, bounceRate: '45.0%' },
    { pagePath: '/contact', views: 8500, users: 7000, bounceRate: '38.4%' }
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
            {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'users': return Users;
    case 'activity': return Activity;
    case 'clock': return Clock;
    case 'target': return Target;
    default: return BarChart2;
  }
};

export default function Ga4PlatformOverview() {
  const { data, isLoading, error } = useDashboardData<Ga4DashboardPayload>('ga4', MOCK_FALLBACK_DATA);

  const kpis = Array.isArray(data?.kpis) ? data.kpis : [];
  const timeSeries = Array.isArray(data?.timeSeries) ? data.timeSeries : [];
  const devices = Array.isArray(data?.devices) ? data.devices : [];
  const sources = Array.isArray(data?.sources) ? data.sources : [];
  const topPages = Array.isArray(data?.topPages) ? data.topPages : [];

  return (
    <div className="min-h-screen bg-[#F9F7F4] text-[#3E1510] p-6 lg:p-10 font-sans">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* Section A: The Global Filter Bar */}
        <div className="sticky top-0 bg-white rounded-xl border border-[#EAE3D9] shadow-sm p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FDF8F3] rounded-lg border border-[#EAE3D9] flex items-center justify-center text-[#7A2B20]">
              <BarChart2 size={20} />
            </div>
            <h1 className="text-xl font-bold font-serif text-[#3E1510]">Google Analytics 4</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button disabled aria-disabled="true" title="Filter functionality coming soon" className="flex items-center gap-2 px-3 py-2 bg-[#F9F7F4] border border-[#EAE3D9] rounded-lg text-sm font-medium text-[#5C4541] opacity-50 cursor-not-allowed transition-colors">
              <Filter size={16} />
              All Traffic
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
                <h2 className="text-xl font-bold font-serif text-[#3E1510]">Traffic Volume Over Time</h2>
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
                      stroke="#A88C87" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#A88C87' }}
                      tickFormatter={(val) => val >= 1000 ? `${val / 1000}k` : val}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="sessions" 
                      name="Sessions"
                      fill="#FDF8F3" 
                      stroke="#DDA77B" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      name="Users"
                      stroke="#7A2B20" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#7A2B20', strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: '#7A2B20', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Section D: Categorical Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-[#EAE3D9] p-6 shadow-sm flex flex-col">
                <h2 className="text-xl font-bold font-serif text-[#3E1510] mb-6">Device Breakdown</h2>
                
                <div className="flex-1 min-h-[250px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      layout="vertical" 
                      data={devices}
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
                        formatter={(value: number) => [`${value}%`, 'Share']}
                      />
                      <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={32}>
                        {devices.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-[#EAE3D9] p-6 shadow-sm flex flex-col">
                <h2 className="text-xl font-bold font-serif text-[#3E1510] mb-6">Traffic Sources</h2>
                <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8">
                  <div className="relative h-[220px] w-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sources}
                          innerRadius={70}
                          outerRadius={95}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {sources.map((entry, index) => (
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
                      <span className="text-xs font-semibold text-[#A88C87] uppercase tracking-widest mt-1">Total</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-5">
                    {sources.map(item => (
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

            {/* Section E: Detailed Data Table */}
            <div className="bg-white rounded-xl border border-[#EAE3D9] overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[#EAE3D9]">
                <h2 className="text-xl font-bold font-serif text-[#3E1510]">Top Pages</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider">Page Path</th>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">Views</th>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">Users</th>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">Bounce Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPages.map((page, index) => (
                      <tr key={index} className="border-b border-[#EAE3D9] last:border-b-0 hover:bg-[#F9F7F4] transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-[#3E1510]">
                          {page.pagePath}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#5C4541] text-right">
                          {page.views?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#5C4541] text-right">
                          {page.users?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-[#7A2B20] text-right">
                          {page.bounceRate}
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
