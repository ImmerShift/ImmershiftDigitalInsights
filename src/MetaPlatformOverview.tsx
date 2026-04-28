import React from 'react';
import { 
  Share2, 
  CircleDollarSign,
  MousePointerClick,
  Target,
  ShoppingCart,
  ChevronDown, 
  Download,
  Calendar,
  Layers,
  AlertTriangle
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

export interface MetaKpiMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  iconName: string;
}

export interface MetaTimeSeriesData {
  date: string;
  spend: number;
  clicks: number;
}

export interface FunnelData {
  stage: string;
  users: number;
  fill: string;
}

export interface CampaignData {
  campaignName: string;
  objective: string;
  spend: string;
  clicks: number;
  cpc: string;
  checkouts: number;
}

export interface MetaDashboardPayload {
  kpis: MetaKpiMetric[];
  timeSeries: MetaTimeSeriesData[];
  funnel: FunnelData[];
  objectives: { name: string; value: number; fill: string }[];
  campaigns: CampaignData[];
}

const MOCK_FALLBACK_DATA_META: MetaDashboardPayload = {
  kpis: [
    { title: 'Total Ad Spend', value: 'IDR 19.5M', change: '+5.2%', trend: 'up', iconName: 'spend' },
    { title: 'Link Clicks', value: '37,849', change: '+14.1%', trend: 'up', iconName: 'click' },
    { title: 'Cost Per Click (CPC)', value: 'IDR 347', change: '-12.4%', trend: 'down', iconName: 'target' },
    { title: 'Tracked Checkouts', value: '21', change: '-75.0%', trend: 'down', iconName: 'cart' }
  ],
  timeSeries: [
    { date: 'Apr 19', spend: 1.2, clicks: 2100 },
    { date: 'Apr 20', spend: 1.5, clicks: 2400 },
    { date: 'Apr 21', spend: 1.4, clicks: 2200 },
    { date: 'Apr 22', spend: 1.8, clicks: 3100 },
    { date: 'Apr 23', spend: 2.1, clicks: 3800 },
    { date: 'Apr 24', spend: 2.5, clicks: 4200 },
    { date: 'Apr 25', spend: 2.2, clicks: 3500 }
  ],
  funnel: [
    { stage: 'Link Clicks', users: 37849, fill: '#DDA77B' },
    { stage: 'Landing Page Views', users: 15200, fill: '#A88C87' },
    { stage: 'Initiate Checkout', users: 21, fill: '#A43927' }
  ],
  objectives: [
    { name: 'Traffic', value: 58, fill: '#DDA77B' },
    { name: 'Conversions', value: 22, fill: '#7A2B20' },
    { name: 'Engagement', value: 20, fill: '#A88C87' }
  ],
  campaigns: [
    {
      campaignName: 'MBC_Retargeting_April_Offers',
      objective: 'Conversions',
      spend: 'IDR 4.2M',
      clicks: 8400,
      cpc: 'IDR 500',
      checkouts: 12
    },
    {
      campaignName: 'Cold_Lookalike_Bali_Tourists',
      objective: 'Traffic',
      spend: 'IDR 8.5M',
      clicks: 18500,
      cpc: 'IDR 459',
      checkouts: 5
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
            {entry.name === 'Spend' ? `IDR ${entry.value}M` : entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'spend': return CircleDollarSign;
    case 'click': return MousePointerClick;
    case 'target': return Target;
    case 'cart': return ShoppingCart;
    default: return Share2;
  }
};

export default function MetaPlatformOverview({ onDataLoaded }: { onDataLoaded?: (data: any) => void }) {
  const { data, isLoading, error } = useDashboardData<MetaDashboardPayload>('meta', MOCK_FALLBACK_DATA_META);

  React.useEffect(() => {
    if (data && onDataLoaded) {
      onDataLoaded(data);
    }
  }, [data, onDataLoaded]);

  const kpis = Array.isArray(data?.kpis) ? data.kpis : [];
  const timeSeries = Array.isArray(data?.timeSeries) ? data.timeSeries : [];
  const funnelData = Array.isArray(data?.funnel) ? data.funnel : [];
  const objectiveData = Array.isArray(data?.objectives) ? data.objectives : [];
  const campaignData = Array.isArray(data?.campaigns) ? data.campaigns : [];

  return (
    <div className="min-h-screen bg-[#F9F7F4] text-[#3E1510] p-6 lg:p-10 font-sans">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* Section A: The Global Filter Bar */}
        <div className="sticky top-0 bg-white rounded-xl border border-[#EAE3D9] shadow-sm p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FDF8F3] rounded-lg border border-[#EAE3D9] flex items-center justify-center text-[#7A2B20]">
              <Share2 size={20} />
            </div>
            <h1 className="text-xl font-bold font-serif text-[#3E1510]">Meta Ads Ecosystem</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button disabled aria-disabled="true" title="Filter functionality coming soon" className="flex items-center gap-2 px-3 py-2 bg-[#F9F7F4] border border-[#EAE3D9] rounded-lg text-sm font-medium text-[#5C4541] opacity-50 cursor-not-allowed transition-colors">
              <Layers size={16} />
              All Accounts
              <ChevronDown size={14} className="ml-1" />
            </button>
            <button disabled aria-disabled="true" title="Filter functionality coming soon" className="flex items-center gap-2 px-3 py-2 bg-[#F9F7F4] border border-[#EAE3D9] rounded-lg text-sm font-medium text-[#5C4541] opacity-50 cursor-not-allowed transition-colors">
              <Target size={16} />
              All Objectives
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
                
                let isPositive = kpi.trend === 'up';
                let isNegative = kpi.trend === 'down';
                
                // Specials for CPC and cost metrics
                if (kpi.title.includes('CPC')) {
                  isPositive = kpi.trend === 'down';
                  isNegative = kpi.trend === 'up';
                }

                const badgeClasses = isPositive 
                  ? 'bg-[#EBF4ED] text-[#2E6B3B]' 
                  : isNegative
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
                <h2 className="text-xl font-bold font-serif text-[#3E1510]">Spend vs Volume Efficiency</h2>
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
                      tickFormatter={(val) => `${val}M`}
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
                      dataKey="spend" 
                      name="Spend"
                      fill="#FDF8F3" 
                      stroke="#7A2B20" 
                      strokeWidth={2}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="clicks" 
                      name="Clicks"
                      stroke="#DDA77B" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#DDA77B', strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: '#DDA77B', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Section D: Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-[#EAE3D9] p-6 shadow-sm flex flex-col">
                <div className="mb-4">
                   <h2 className="text-xl font-bold font-serif text-[#3E1510]">Funnel Conversion Health</h2>
                </div>
                
                <div className="flex-1 min-h-[200px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      layout="vertical" 
                      data={funnelData}
                      margin={{ top: 0, right: 30, bottom: 0, left: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EAE3D9" />
                      <XAxis type="number" hide />
                      <YAxis 
                        type="category" 
                        dataKey="stage" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#5C4541', fontWeight: 500 }}
                        width={130}
                      />
                      <Tooltip 
                        cursor={{ fill: '#FDF8F3' }}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #EAE3D9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="users" radius={[0, 4, 4, 0]} barSize={24}>
                        {funnelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-[#EAE3D9] p-6 shadow-sm flex flex-col">
                <h2 className="text-xl font-bold font-serif text-[#3E1510] mb-6">Spend by Objective</h2>
                <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8">
                  <div className="relative h-[200px] w-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={objectiveData}
                          innerRadius={65}
                          outerRadius={85}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {objectiveData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #EAE3D9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          itemStyle={{ color: '#3E1510', fontWeight: 'bold' }}
                          formatter={(value: number) => `${value}%`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-bold font-serif text-[#3E1510]">100%</span>
                      <span className="text-xs font-semibold text-[#A88C87] uppercase tracking-widest mt-1">Spend</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    {objectiveData.map(item => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.fill }}></div>
                        <div>
                          <div className="text-sm font-bold text-[#3E1510]">{item.name}</div>
                          <div className="text-xs font-medium text-[#5C4541]">{item.value}% of Spend</div>
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
                <h2 className="text-xl font-bold font-serif text-[#3E1510]">Campaign Performance Breakdown</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider">Campaign Name</th>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider">Objective</th>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">Spend</th>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">Link Clicks</th>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">CPC</th>
                      <th scope="col" className="bg-[#FDF8F3] px-6 py-3 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">Checkouts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignData.map((campaign, index) => (
                      <tr key={index} className="border-b border-[#EAE3D9] last:border-b-0 hover:bg-[#F9F7F4] transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-[#3E1510]">
                          {campaign.campaignName}
                        </td>
                        <td className="px-6 py-4">
                           <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F9F7F4] text-[#5C4541] border border-[#EAE3D9]">
                              {campaign.objective}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#7A2B20] text-right">
                          {campaign.spend}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#5C4541] text-right">
                          {campaign.clicks?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#5C4541] text-right">
                          {campaign.cpc}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#3E1510] text-right">
                          {campaign.checkouts}
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

