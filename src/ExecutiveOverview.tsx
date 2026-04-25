import React from 'react';
import { Building2, Calendar, ChevronDown, AlertTriangle } from 'lucide-react';
import { useDashboardData } from './hooks/useDashboardData';
import { BusinessProfile } from './types/business';
import { getKpiMapping } from './utils/kpiMapping';
import { KpiCard } from './components/dashboard/KpiCard';
import { PacingChart } from './components/dashboard/PacingChart';
import { ChannelEconomicsTable } from './components/dashboard/ChannelEconomicsTable';

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
  primary: number;
  secondary: number;
}

export interface ChannelContribution {
  channel: string;
  metric1: string;
  metric2: string;
  efficiency: string;
  share: number;
}

export interface ExecutiveDashboardPayload {
  kpis: ExecutiveKpi[];
  timeSeries: BlendedTimeSeries[];
  channelContribution: ChannelContribution[];
}

// Current business profile - modularized and multi-tenant ready
const CURRENT_BUSINESS: BusinessProfile = {
  name: 'Digital Insights Pro',
  industry: 'saas',
  primaryGoal: 'Scale Monthly Recurring Revenue with 4.0x LTV:CAC efficiency',
  persona: 'analytical'
};

const MOCK_FALLBACK_DATA_EXECUTIVE: ExecutiveDashboardPayload = {
  kpis: [
    { title: 'New MRR', value: 'IDR 125M', subtitle: 'Pacing to IDR 300M', trend: 'up', percentage: '+15.2%', iconName: 'trending-up' },
    { title: 'CAC', value: 'IDR 4.2M', subtitle: 'Target: IDR 5M', trend: 'neutral', percentage: '-2.1%', iconName: 'target' },
    { title: 'LTV:CAC', value: '4.8x', subtitle: 'Target: 4.0x', trend: 'up', percentage: '+8.0%', iconName: 'activity' },
    { title: 'Trial Signups', value: '1,240', subtitle: '+22% vs Last Month', trend: 'up', percentage: '+34.0%', iconName: 'users' }
  ],
  timeSeries: Array.from({ length: 15 }, (_, i) => ({
    date: `Apr ${i + 1}`,
    primary: Math.round(Math.random() * 50 + 50),
    secondary: Math.round(Math.random() * 20 + 10)
  })),
  channelContribution: [
    { channel: 'Meta Ads', metric1: 'IDR 45M', metric2: '120 Signups', efficiency: 'IDR 375k', share: 45 },
    { channel: 'Google Search', metric1: 'IDR 32M', metric2: '85 Signups', efficiency: 'IDR 376k', share: 35 },
    { channel: 'LinkedIn B2B', metric1: 'IDR 25M', metric2: '40 Signups', efficiency: 'IDR 625k', share: 20 }
  ]
};

export default function ExecutiveOverview({ onDataLoaded }: { onDataLoaded?: (data: any) => void }) {
  const { data, isLoading, error } = useDashboardData<ExecutiveDashboardPayload>('executive', MOCK_FALLBACK_DATA_EXECUTIVE);
  const kpiLabels = getKpiMapping(CURRENT_BUSINESS.industry);

  React.useEffect(() => {
    if (data && onDataLoaded) {
      onDataLoaded(data);
    }
  }, [data, onDataLoaded]);

  const kpis = Array.isArray(data?.kpis) ? data.kpis : [];
  const timeSeries = Array.isArray(data?.timeSeries) ? data.timeSeries : [];
  const channels = Array.isArray(data?.channelContribution) ? data.channelContribution : [];

  return (
    <div className="min-h-screen bg-[#F9F7F4] text-[#3E1510] p-6 lg:p-10 font-sans">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#EAE3D9] pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#3E1510]">Digital Command Center</h1>
            <p className="text-[#5C4541] mt-1 flex items-center gap-2">
              <Building2 size={16} />
              {CURRENT_BUSINESS.name} — <span className="capitalize">{CURRENT_BUSINESS.industry}</span> Insights
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#EAE3D9] rounded-xl text-sm font-medium text-[#3E1510] hover:bg-[#FDF8F3] transition-colors shadow-sm">
              <Calendar size={16} className="text-[#A88C87]" />
              April 1 - April 15, 2026
              <ChevronDown size={14} className="ml-1 text-[#A88C87]" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-8 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="bg-[#EAE3D9] h-40 rounded-2xl"></div>)}
            </div>
            <div className="bg-[#EAE3D9] h-[450px] rounded-2xl"></div>
            <div className="bg-[#EAE3D9] h-[350px] rounded-2xl"></div>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-[#FFF9E6] text-[#B8860B] border border-[#F5E1C8] px-4 py-3 rounded-xl mb-6 flex items-center shadow-sm">
                <AlertTriangle size={18} className="mr-2" />
                <span className="text-sm font-medium">Live data sync failed. Using profile-specific defaults.</span>
              </div>
            )}

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {kpis.map((kpi, idx) => (
                <KpiCard key={idx} {...kpi} />
              ))}
            </div>

            {/* Main Pacing Chart */}
            <PacingChart 
              title={`${kpiLabels[0].label} vs ${kpiLabels[1].label} Pacing`}
              data={timeSeries}
              primaryKey="primary"
              secondaryKey="secondary"
              primaryLabel={kpiLabels[0].label}
              secondaryLabel={kpiLabels[1].label}
            />

            {/* Channel Performance Economics */}
            <ChannelEconomicsTable 
              title="Channel Economics & Lead Distribution"
              data={channels}
              labels={{
                metric1: 'Spend',
                metric2: 'Performance',
                efficiency: 'Unit Economics'
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

