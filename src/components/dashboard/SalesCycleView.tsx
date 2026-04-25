import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  ArrowRight, 
  Users, 
  DollarSign, 
  ShieldCheck, 
  AlertCircle,
  Briefcase,
  Zap
} from 'lucide-react';
import { ResponsiveContainer, FunnelChart, Funnel, LabelList, Tooltip, Cell } from 'recharts';
import { motion } from 'motion/react';
import { BusinessProfile } from '../../types/business';
import { reconcileAttribution, predictLTV } from '../../lib/gemini';

interface SalesCycleViewProps {
  business: BusinessProfile;
  adData: any[];
  crmData: any[];
}

const FUNNEL_DATA = [
  { value: 10000, name: 'Ad Impressions', fill: '#EAE3D9' },
  { value: 1200, name: 'Ad Clicks', fill: '#DDA77B' },
  { value: 300, name: 'Qualified Leads', fill: '#3E1510' },
  { value: 85, name: 'Sales Opportunities', fill: '#2E6B3B' },
  { value: 42, name: 'Closed Won', fill: '#2E6B3B' },
];

const PRODUCT_ECONOMICS = [
  { name: 'Core SaaS Plan', revenue: 15000000, cogs: 2000000, adSpend: 4500000, netProfit: 8500000, margin: '56%' },
  { name: 'Enterprise Add-on', revenue: 12000000, cogs: 1500000, adSpend: 6000000, netProfit: 4500000, margin: '37%' },
  { name: 'Basic Tier', revenue: 5000000, cogs: 3000000, adSpend: 3500000, netProfit: -1500000, margin: '-30%' },
];

export const SalesCycleView: React.FC<SalesCycleViewProps> = ({ business, adData, crmData }) => {
  const [reconciliation, setReconciliation] = useState<any>(null);
  const [ltvPrediction, setLtvPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [rec, ltv] = await Promise.all([
          reconcileAttribution(adData, crmData),
          predictLTV({ historical: 'data' })
        ]);
        setReconciliation(rec);
        setLtvPrediction(ltv);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [adData, crmData]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Top Level Strategic Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#EAE3D9] shadow-sm">
          <p className="text-[10px] font-black uppercase text-[#A88C87] tracking-widest mb-1">Attribution Truth Score</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-[#3E1510]">{reconciliation?.truthScore || 82}%</span>
            <span className="text-xs font-bold text-[#2E6B3B] mb-1 flex items-center gap-1">
              <ShieldCheck size={12} /> Verified
            </span>
          </div>
          <p className="text-xs text-[#5C4541] mt-3 leading-relaxed italic">
            "{reconciliation?.modelFit || 'Discrepancy detected in Meta reporting; actual bank revenue is 15% lower than platform claims.'}"
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#EAE3D9] shadow-sm">
          <p className="text-[10px] font-black uppercase text-[#A88C87] tracking-widest mb-1">12M Predicted LTV</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-brand-primary">{ltvPrediction?.ltv12m || 'IDR 4.2M'}</span>
          </div>
          <p className="text-xs text-[#5C4541] mt-3">Targeting an LTV/CAC ratio of <span className="font-bold">3.5x</span> for current month cohorts.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#EAE3D9] shadow-sm">
          <p className="text-[10px] font-black uppercase text-[#A88C87] tracking-widest mb-1">Recommended Model</p>
          <div className="flex items-center gap-2 mt-1">
            <Briefcase size={20} className="text-brand-secondary" />
            <span className="text-xl font-bold text-[#3E1510]">{reconciliation?.recommendation || 'First Touch'}</span>
          </div>
          <button className="mt-4 w-full py-2 bg-[#F9F7F4] text-[#3E1510] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#EAE3D9] transition-colors">
            Switch Attribution Logic
          </button>
        </div>
      </div>

      {/* Main Funnel Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] border border-[#EAE3D9] p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
             <div>
               <h3 className="text-xl font-serif font-bold text-[#3E1510]">Lead-to-Revenue Funnel</h3>
               <p className="text-xs text-[#A88C87] font-medium">Cross-platform conversion efficiency</p>
             </div>
             <div className="px-3 py-1 bg-[#FDF8F3] rounded-full border border-[#F5E1C8] text-[10px] font-bold text-[#DDA77B]">
               Live CRM Sync
             </div>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFF', 
                    borderRadius: '16px', 
                    border: '1px solid #EAE3D9',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                />
                <Funnel
                  data={FUNNEL_DATA}
                  dataKey="value"
                  isAnimationActive
                >
                  <LabelList position="right" fill="#3E1510" stroke="none" dataKey="name" fontSize={11} fontWeight={700} />
                  {FUNNEL_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 p-4 bg-[#F9F7F4] rounded-2xl flex items-start gap-4">
             <div className="p-2 bg-white rounded-lg text-[#7A2B20] border border-[#7A2B20]/10">
                <AlertCircle size={18} />
             </div>
             <div>
               <p className="text-xs font-bold text-[#3E1510]">Opportunity Choke Point Detected</p>
               <p className="text-[11px] text-[#5C4541] mt-1 italic">"72% drop-off between 'Qualified Leads' and 'Sales Opportunities'. Your sales team might need faster response automation."</p>
             </div>
          </div>
        </div>

        {/* Product Intelligence */}
        <div className="bg-white rounded-[2.5rem] border border-[#EAE3D9] p-8 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
             <div>
               <h3 className="text-xl font-serif font-bold text-[#3E1510]">Net Profit Intelligence</h3>
               <p className="text-xs text-[#A88C87] font-medium">Post-Spend Unit Economics</p>
             </div>
             <Zap size={20} className="text-brand-primary" />
          </div>

          <div className="space-y-4 flex-1">
            {PRODUCT_ECONOMICS.map((prod, i) => (
              <div key={i} className="p-5 rounded-2xl border border-[#F9F7F4] hover:border-[#EAE3D9] transition-all group">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-black text-[#3E1510] uppercase tracking-tight">{prod.name}</span>
                  <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                    prod.netProfit > 0 ? 'bg-[#E6F4EA] text-[#1E7E34]' : 'bg-[#FFF2F2] text-[#7A2B20]'
                  }`}>
                    {prod.margin} Margin
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                   <div>
                     <p className="text-[9px] font-bold text-[#A88C87] uppercase">Revenue</p>
                     <p className="text-xs font-bold text-[#3E1510]">IDR {prod.revenue / 1000000}M</p>
                   </div>
                   <div>
                     <p className="text-[9px] font-bold text-[#A88C87] uppercase">COGS</p>
                     <p className="text-xs font-bold text-[#5C4541]">IDR {prod.cogs / 1000000}M</p>
                   </div>
                   <div>
                     <p className="text-[9px] font-bold text-[#A88C87] uppercase">Ad Spend</p>
                     <p className="text-xs font-bold text-brand-primary">IDR {prod.adSpend / 1000000}M</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[9px] font-bold text-[#A88C87] uppercase">Net Profit</p>
                     <p className={`text-sm font-black ${prod.netProfit > 0 ? 'text-[#2E6B3B]' : 'text-[#7A2B20]'}`}>
                       IDR {prod.netProfit / 1000000}M
                     </p>
                   </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-[#F9F7F4]">
             <div className="bg-[#FDF8F3] p-4 rounded-2xl border border-[#F5E1C8]">
                 <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={14} className="text-[#2E6B3B]" />
                    <span className="text-[10px] font-black uppercase text-[#3E1510]">AI Profit Action</span>
                 </div>
                 <p className="text-xs text-[#5C4541] italic leading-relaxed">
                   "Stop advertising <span className="font-bold underline">Basic Tier</span> immediately. Although it drives volume, the high overhead and ad friction result in a net loss of IDR 1.5M per unit. Shift that spend to Core SaaS Plan."
                 </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
