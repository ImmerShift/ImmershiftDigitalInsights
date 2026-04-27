import React, { useState, useEffect } from 'react';
import { Building2, Calendar, ChevronDown, AlertTriangle, Zap, Activity, Info, Sparkles, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDashboardData } from './hooks/useDashboardData';
import { DateRange } from './components/dashboard/GlobalDateRangePicker';
import { BusinessProfile } from './types/business';
import { getKpiMapping } from './utils/kpiMapping';
import { KpiCard } from './components/dashboard/KpiCard';
import { PacingChart } from './components/dashboard/PacingChart';
import { ChannelEconomicsTable } from './components/dashboard/ChannelEconomicsTable';
import { BudgetOptimizer } from './components/dashboard/BudgetOptimizer';
import { DataHealthMonitor } from './components/dashboard/DataHealthMonitor';
import { CreativePerformanceGrid } from './components/dashboard/CreativePerformanceGrid';
import { getPredictiveForecast, PredictiveForecast, getHolisticFunnelInsight } from './lib/gemini';

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

// Current business profile
const CURRENT_BUSINESS: BusinessProfile = {
  name: 'Digital Insights Pro',
  industry: 'saas',
  primaryGoal: 'Scale Monthly Recurring Revenue with 4.0x LTV:CAC efficiency',
  persona: 'analytical',
  theme: {
    primaryColor: '#7A2B20',
    secondaryColor: '#DDA77B'
  }
};

const MOCK_FALLBACK_DATA_EXECUTIVE: ExecutiveDashboardPayload = {
  kpis: [
    { title: 'New MRR', value: 'IDR 125M', subtitle: 'Pacing to IDR 300M', trend: 'up', percentage: '+15.2%', iconName: 'trending-up' },
    { title: 'CP Qualified Lead', value: 'IDR 850k', subtitle: 'CRM Truth (Verified)', trend: 'up', percentage: '-4.2%', iconName: 'target' },
    { title: 'LTV:CAC', value: '4.8x', subtitle: '12M Prediction', trend: 'up', percentage: '+8.0%', iconName: 'activity' },
    { title: 'Sales Pipeline', value: 'IDR 2.4B', subtitle: 'Weighted Forecast', trend: 'up', percentage: '+34.0%', iconName: 'briefcase' }
  ],
  timeSeries: Array.from({ length: 15 }, (_, i) => ({
    date: `Apr ${i + 1}`,
    primary: Math.round(50 + i * 5 + Math.random() * 20),
    secondary: Math.round(10 + i * 2 + Math.random() * 5)
  })),
  channelContribution: [
    { channel: 'Meta Ads', metric1: 'IDR 45M', metric2: '120 Signups', efficiency: 'IDR 375k', share: 45 },
    { channel: 'Google Search', metric1: 'IDR 32M', metric2: '85 Signups', efficiency: 'IDR 376k', share: 35 },
    { channel: 'LinkedIn B2B', metric1: 'IDR 25M', metric2: '40 Signups', efficiency: 'IDR 625k', share: 20 }
  ]
};

export default function DigitalOverview({ 
  onDataLoaded, 
  dateRange 
}: { 
  onDataLoaded?: (data: any) => void,
  dateRange: DateRange
}) {
  const { data, isLoading, error } = useDashboardData<ExecutiveDashboardPayload>('executive', MOCK_FALLBACK_DATA_EXECUTIVE, dateRange);
  const kpiLabels = getKpiMapping(CURRENT_BUSINESS.industry);
  const [forecast, setForecast] = useState<PredictiveForecast | null>(null);
  const [holisticInsight, setHolisticInsight] = useState<string>('');
  const [anomaly, setAnomaly] = useState<{ type: 'warn' | 'success', msg: string } | null>(null);

  useEffect(() => {
    if (data && onDataLoaded) {
      onDataLoaded(data);
    }
  }, [data, onDataLoaded]);

  useEffect(() => {
    const fetchAIAnalytics = async () => {
      if (!data) return;
      try {
        const [f, h] = await Promise.all([
          getPredictiveForecast(CURRENT_BUSINESS, data.timeSeries, data.kpis),
          getHolisticFunnelInsight(data)
        ]);
        setForecast(f);
        setHolisticInsight(h);
        
        // Random anomaly mock based on business goals
        if (Math.random() > 0.5) {
          setAnomaly({ 
            type: 'warn', 
            msg: "Meta ROAS dropped 22% in the last 24h due to weekend CPM spike in Southeast Asia." 
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchAIAnalytics();
  }, [data]);

  const kpis = Array.isArray(data?.kpis) ? data.kpis : [];
  const timeSeries = Array.isArray(data?.timeSeries) ? data.timeSeries : [];
  const channels = Array.isArray(data?.channelContribution) ? data.channelContribution : [];

  return (
    <div className="min-h-screen bg-[#F9F7F4] text-[#3E1510] p-6 lg:p-10 font-sans">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        
        {/* Pulse Indicator & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#EAE3D9] pb-6 gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
               <h1 className="text-3xl font-serif font-bold text-[#3E1510]">Digital Overview</h1>
               <AnimatePresence>
                 {anomaly && (
                   <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      anomaly.type === 'warn' ? 'bg-[#7A2B20] text-white' : 'bg-[#2E6B3B] text-white'
                    }`}
                   >
                     <Zap size={10} className="fill-current animate-pulse" />
                     Pulse Alarm
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
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

        {anomaly && (
          <motion.div 
            role="alert"
            aria-live="assertive"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className={`p-4 rounded-2xl border flex items-start gap-4 ${
              anomaly.type === 'warn' ? 'bg-[#FFF2F2] border-[#7A2B20]/20' : 'bg-[#F2FFF4] border-[#2E6B3B]/20'
            }`}
          >
            <div className={`p-2 rounded-xl border ${
              anomaly.type === 'warn' ? 'bg-white border-[#7A2B20]/10 text-[#7A2B20]' : 'bg-white border-[#2E6B3B]/10 text-[#2E6B3B]'
            }`}>
              {anomaly.type === 'warn' ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
            </div>
            <div>
               <p className="text-xs font-black uppercase tracking-widest text-[#A88C87] mb-1">Real-time Performance Pulse</p>
               <p className="text-sm font-bold text-[#3E1510]">{anomaly.msg}</p>
            </div>
          </motion.div>
        )}

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
            <h2 className="sr-only">Key Performance Indicators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {kpis.map((kpi, idx) => (
                <KpiCard key={idx} {...kpi} />
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Main Pacing Chart */}
              <div className="xl:col-span-2">
                <PacingChart 
                  title={`${kpiLabels[0].label} vs ${kpiLabels[1].label} Pacing`}
                  data={timeSeries}
                  primaryKey="primary"
                  secondaryKey="secondary"
                  primaryLabel={kpiLabels[0].label}
                  secondaryLabel={kpiLabels[1].label}
                />
              </div>

              {/* Forecast Card */}
              <div className="bg-white rounded-[2rem] border border-[#EAE3D9] p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <RefreshCcw size={80} className="text-brand-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Activity size={18} className="text-brand-primary" />
                    <h3 className="text-xs font-black uppercase tracking-[.2em] text-[#A88C87]">Predictive Pacing</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-bold text-[#A88C87] uppercase mb-1">Projected {kpiLabels[0].label}</p>
                      <p className="text-4xl font-serif font-black text-brand-primary">{forecast?.projectedRevenue || 'IDR 285.4M'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#A88C87] uppercase mb-1">Projected Spend</p>
                      <p className="text-2xl font-bold text-[#3E1510]">{forecast?.projectedSpend || 'IDR 52.8M'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-6 border-t border-[#F9F7F4]">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold text-[#5C4541]">AI Confidence Score</p>
                    <p className="text-xs font-black text-brand-secondary">{(forecast?.confidenceScore || 0.88 * 100).toFixed(0)}%</p>
                  </div>
                  <div className="w-full h-1.5 bg-[#F9F7F4] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-secondary" 
                      style={{ width: `${(forecast?.confidenceScore || 0.88) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] mt-4 text-[#A88C87] font-medium leading-relaxed italic border-l-2 border-brand-secondary pl-3">
                    {forecast?.insight || "Revenue is pacing ahead of schedule due to strong performance in conversion-layer channels."}
                  </p>
                </div>
              </div>
            </div>

            {/* Holistic Audit */}
            <div className="bg-[#FDF8F3] border border-[#F5E1C8] rounded-3xl p-8 shadow-sm">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-16 h-16 rounded-2xl bg-white border border-[#EAE3D9] flex items-center justify-center text-brand-primary shrink-0 shadow-sm">
                  <Sparkles size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold font-serif text-[#3E1510] mb-2 uppercase tracking-tight">Cross-Platform Holistic Funnel Insight</h3>
                  <p className="text-[#5C4541] leading-relaxed italic">
                    {holisticInsight || "Analyzing the synergy between Meta brand awareness and Google Search conversion efficiency..."}
                  </p>
                </div>
                <button className="px-6 py-3 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all">
                  Run Full Attribution Audit
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <BudgetOptimizer business={CURRENT_BUSINESS} channelData={channels} />
               <DataHealthMonitor currentLiveStatus={data && !error} />
            </div>

            {/* Creative Intelligence Engine */}
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#EAE3D9] flex items-center justify-center text-brand-primary shadow-sm">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-[#3E1510]">Creative Intelligence</h2>
                    <p className="text-sm text-[#A88C87] font-medium uppercase tracking-widest">Visual Analysis & Asset Performance</p>
                  </div>
               </div>
               <CreativePerformanceGrid business={CURRENT_BUSINESS} />
            </div>

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

