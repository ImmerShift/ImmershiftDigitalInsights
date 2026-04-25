import React from 'react';
import { 
  Mail, 
  Send, 
  MousePointerClick, 
  DollarSign, 
  Percent, 
  ChevronDown, 
  Download,
  Calendar,
  Filter,
  Users,
  AlertTriangle
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

export interface EmailKpiMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  iconName: string;
}

export interface EmailTimeSeriesData {
  date: string;
  openRate: number;
  clickRate: number;
}

export interface FlowRevenueData {
  flowName: string;
  revenue: number;
  fill: string;
}

export interface CampaignData {
  campaignName: string;
  provider: 'Klaviyo' | 'Mailchimp';
  sent: number;
  openRate: string;
  clickRate: string;
  revenue: string;
}

export interface EmailDashboardPayload {
  kpis: EmailKpiMetric[];
  timeSeries: EmailTimeSeriesData[];
  flowRevenue: FlowRevenueData[];
  audienceHealth: { name: string; value: number; fill: string }[];
  campaigns: CampaignData[];
}

const MOCK_FALLBACK_DATA_EMAIL: EmailDashboardPayload = {
  kpis: [
    { title: 'Total Emails Sent', value: '45,210', change: '+12.4%', trend: 'up', iconName: 'send' },
    { title: 'Average Open Rate', value: '42.8%', change: '+3.1%', trend: 'up', iconName: 'percent' },
    { title: 'Average Click Rate', value: '5.2%', change: '-0.4%', trend: 'down', iconName: 'click' },
    { title: 'Attributed Revenue', value: 'IDR 125.4M', change: '+18.2%', trend: 'up', iconName: 'dollar' }
  ],
  timeSeries: [
    { date: 'Apr 19', openRate: 38.5, clickRate: 4.1 },
    { date: 'Apr 20', openRate: 41.2, clickRate: 4.8 },
    { date: 'Apr 21', openRate: 45.0, clickRate: 5.5 },
    { date: 'Apr 22', openRate: 48.5, clickRate: 6.2 },
    { date: 'Apr 23', openRate: 42.1, clickRate: 5.0 },
    { date: 'Apr 24', openRate: 39.8, clickRate: 4.5 },
    { date: 'Apr 25', openRate: 44.5, clickRate: 5.8 }
  ],
  flowRevenue: [
    { flowName: 'Abandoned Booking (TableCheck)', revenue: 65, fill: '#7A2B20' },
    { flowName: 'Welcome Series - New Subscribers', revenue: 35, fill: '#DDA77B' },
    { flowName: 'Post-Visit VIP Upsell', revenue: 18, fill: '#2E6B3B' },
    { flowName: 'Birthday Month Offer', revenue: 7.4, fill: '#A88C87' }
  ],
  audienceHealth: [
    { name: 'Highly Engaged', value: 45, fill: '#2E6B3B' },
    { name: 'Occasional', value: 35, fill: '#DDA77B' },
    { name: 'Unengaged/Lapsed', value: 20, fill: '#A43927' }
  ],
  campaigns: [
    {
      campaignName: 'April Peak Season Announcement',
      provider: 'Mailchimp',
      sent: 25000,
      openRate: '45.2%',
      clickRate: '6.1%',
      revenue: 'IDR 45M'
    },
    {
      campaignName: 'Flash Sale: Daybed Packages',
      provider: 'Klaviyo',
      sent: 12500,
      openRate: '52.1%',
      clickRate: '8.4%',
      revenue: 'IDR 62M'
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
            {entry.name === 'Revenue' ? `IDR ${entry.value}M` : `${entry.value}%`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'send': return Send;
    case 'percent': return Percent;
    case 'click': return MousePointerClick;
    case 'dollar': return DollarSign;
    default: return Mail;
  }
};

export default function EmailPlatformOverview() {
  const { data, isLoading, error } = useDashboardData<EmailDashboardPayload>('email', MOCK_FALLBACK_DATA_EMAIL);

  const kpis = Array.isArray(data?.kpis) ? data.kpis : [];
  const timeSeries = Array.isArray(data?.timeSeries) ? data.timeSeries : [];
  const flowRevenue = Array.isArray(data?.flowRevenue) ? data.flowRevenue : [];
  const audienceHealth = Array.isArray(data?.audienceHealth) ? data.audienceHealth : [];
  const campaignData = Array.isArray(data?.campaigns) ? data.campaigns : [];

  return (
    <div className="min-h-screen bg-[#F9F7F4] text-[#3E1510] p-6 lg:p-10 font-sans">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* Section A: The Global Filter Bar */}
        <div className="sticky top-0 bg-white rounded-xl border border-[#EAE3D9] shadow-sm p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FDF8F3] rounded-lg border border-[#EAE3D9] flex items-center justify-center text-[#7A2B20]">
              <Mail size={20} />
            </div>
            <h1 className="text-xl font-bold font-serif text-[#3E1510]">Email & CRM Performance</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button className="flex items-center gap-2 px-3 py-2 bg-[#F9F7F4] border border-[#EAE3D9] rounded-lg text-sm font-medium text-[#5C4541] hover:bg-[#FDF8F3] transition-colors">
              <Calendar size={16} />
              Last 7 Days
              <ChevronDown size={14} className="ml-1" />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-[#F9F7F4] border border-[#EAE3D9] rounded-lg text-sm font-medium text-[#5C4541] hover:bg-[#FDF8F3] transition-colors">
              <Filter size={16} />
              All Providers
              <ChevronDown size={14} className="ml-1" />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-[#F9F7F4] border border-[#EAE3D9] rounded-lg text-sm font-medium text-[#5C4541] hover:bg-[#FDF8F3] transition-colors">
              <Users size={16} />
              All Campaigns
              <ChevronDown size={14} className="ml-1" />
            </button>
            
            <div className="w-px h-6 bg-[#EAE3D9] hidden md:block mx-1"></div>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-[#7A2B20] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#6A241A] transition-colors ml-auto md:ml-0">
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
                <h2 className="text-xl font-bold font-serif text-[#3E1510]">Engagement Trends (Open vs Click Rate)</h2>
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
                      tickFormatter={(val) => `${val}%`}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      stroke="#A88C87" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#A88C87' }}
                      tickFormatter={(val) => `${val}%`}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="openRate" 
                      name="Open Rate"
                      fill="#FDF8F3" 
                      stroke="#DDA77B" 
                      strokeWidth={2}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="clickRate" 
                      name="Click Rate"
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
                <h2 className="text-xl font-bold font-serif text-[#3E1510] mb-6">Revenue by Automation Flow</h2>
                
                <div className="flex-1 min-h-[250px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      layout="vertical" 
                      data={flowRevenue}
                      margin={{ top: 0, right: 30, bottom: 0, left: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EAE3D9" />
                      <XAxis type="number" hide />
                      <YAxis 
                        type="category" 
                        dataKey="flowName" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#5C4541', fontWeight: 500 }}
                        width={180}
                      />
                      <RechartsTooltip 
                        cursor={{ fill: '#FDF8F3' }}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #EAE3D9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`IDR ${value}M`, 'Revenue']}
                      />
                      <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={24}>
                        {flowRevenue.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-[#EAE3D9] p-6 shadow-sm flex flex-col">
                <h2 className="text-xl font-bold font-serif text-[#3E1510] mb-6">Audience Health</h2>
                <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8">
                  <div className="relative h-[220px] w-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={audienceHealth}
                          innerRadius={70}
                          outerRadius={95}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {audienceHealth.map((entry, index) => (
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
                      <span className="text-xs font-semibold text-[#A88C87] uppercase tracking-widest mt-1">Audience</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-5">
                    {audienceHealth.map(item => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: item.fill }}></div>
                        <div>
                          <div className="text-sm font-bold text-[#3E1510]">{item.name}</div>
                          <div className="text-xs font-medium text-[#5C4541]">{item.value}% of List</div>
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
                <h2 className="text-xl font-bold font-serif text-[#3E1510]">Recent Campaigns</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr>
                      <th className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider">Campaign Name</th>
                      <th className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider">Provider</th>
                      <th className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">Sent</th>
                      <th className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">Open Rate</th>
                      <th className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">Click Rate</th>
                      <th className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignData.map((campaign, index) => (
                      <tr key={index} className="border-b border-[#EAE3D9] last:border-b-0 hover:bg-[#F9F7F4] transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-[#3E1510]">
                          {campaign.campaignName}
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                             campaign.provider === 'Mailchimp' 
                              ? 'bg-[#FFE2B7] text-[#8C5A14] border-[#F2C98A]' 
                              : 'bg-[#E3E8EE] text-[#242A36] border-[#CDD4DF]'
                           }`}>
                              {campaign.provider}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#5C4541] text-right">
                          {campaign.sent?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-[#3E1510] text-right">
                          {campaign.openRate}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-[#5C4541] text-right">
                          {campaign.clickRate}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-[#2E6B3B] text-right">
                          {campaign.revenue}
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

