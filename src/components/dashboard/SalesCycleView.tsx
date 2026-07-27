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
  Zap,
  Link,
  Database
} from 'lucide-react';
import { ResponsiveContainer, FunnelChart, Funnel, LabelList, Tooltip, Cell } from 'recharts';
import { motion } from 'motion/react';
import { BusinessProfile } from '../../types/business';
import { reconcileAttribution, predictLTV } from '../../lib/gemini';
import { EmptyStateDisplay } from './EmptyStateDisplay';

interface SalesCycleViewProps {
  business: BusinessProfile;
  adData: any[];
  crmData: any[];
}

export const SalesCycleView: React.FC<SalesCycleViewProps> = ({ business, adData, crmData }) => {
  const [reconciliation, setReconciliation] = useState<any>(null);
  const [ltvPrediction, setLtvPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (adData && adData.length > 0 && crmData && crmData.length > 0) {
          const [rec, ltv] = await Promise.all([
            reconcileAttribution(adData, crmData),
            predictLTV({ historical: 'data' })
          ]);
          setReconciliation(rec);
          setLtvPrediction(ltv);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [adData, crmData]);

  const hasData = adData && adData.length > 0 && crmData && crmData.length > 0;

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 animate-in fade-in duration-700">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] border border-[#EAE3D9] p-12 shadow-sm max-w-2xl w-full"
        >
          <div className="w-20 h-20 bg-[#FDF8F3] rounded-full flex items-center justify-center mb-6">
            <Database size={32} className="text-[#7A2B20]" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#3E1510] mb-4">Revenue Sync Required</h2>
          <p className="text-[#5C4541] mb-8 leading-relaxed text-lg">
            You are currently viewing this without connected data. We don't use mock data for Revenue Intelligence because it requires precise cross-referencing.
          </p>

          <div className="bg-[#F9F7F4] p-6 rounded-2xl border border-[#EAE3D9] mb-8">
            <h3 className="text-sm font-bold text-[#3E1510] uppercase tracking-widest mb-4">How Revenue Sync Works</h3>
            <ul className="space-y-4 text-sm text-[#5C4541]">
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#7A2B20] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">1</div>
                <div><strong>Connect your CRM:</strong> Link Salesforce, HubSpot, or your custom database to pull in actual Closed-Won revenue, leads, and sales cycles.</div>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#7A2B20] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">2</div>
                <div><strong>Connect Ad Networks:</strong> Link Meta, Google, and TikTok ads to gather impression, click, and cost data.</div>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#7A2B20] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">3</div>
                <div><strong>AI Attribution Matching:</strong> The engine automatically matches Click IDs (GCLID, FBCLID) and hashed customer emails, bridging the gap between ad platforms (which over-claim) and the CRM (the ultimate truth).</div>
              </li>
            </ul>
          </div>

          <button 
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#7A2B20] text-white rounded-xl font-bold hover:bg-[#6A2318] transition-colors"
            onClick={() => {
              alert('Connector modal would open to link CRM and Ads.');
            }}
          >
            <Link size={18} />
            Connect CRM & Ad Sources
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* ... data UI goes here when data is implemented ... */}
      <div>Revenue Sync Dashboard (Requires Data)</div>
    </div>
  );
};

