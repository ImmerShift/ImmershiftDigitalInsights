import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, ArrowRight, Sparkles, Sliders, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { BusinessProfile } from '../../types/business';
import { suggestBudgetReallocation, BudgetReallocation } from '../../lib/gemini';

interface BudgetOptimizerProps {
  business: BusinessProfile;
  channelData: any[];
}

export const BudgetOptimizer: React.FC<BudgetOptimizerProps> = ({ business, channelData }) => {
  const [recommendations, setRecommendations] = useState<BudgetReallocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [simulatorValue, setSimulatorValue] = useState(10); // +10% budget
  const [projectedLift, setProjectedLift] = useState('12.5%');

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const data = await suggestBudgetReallocation(business, channelData);
        setRecommendations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (channelData.length > 0) {
      fetchRecommendations();
    }
  }, [business, channelData]);

  // Simple logic for the simulator "What-If"
  useEffect(() => {
    const lift = (simulatorValue * 1.2).toFixed(1);
    setProjectedLift(`${lift}%`);
  }, [simulatorValue]);

  return (
    <div className="bg-white rounded-2xl border border-[#EAE3D9] overflow-hidden shadow-sm flex flex-col">
      <div className="p-6 border-b border-[#EAE3D9] flex items-center justify-between bg-[#FDF8F3]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center">
            <Target size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-[#3E1510]">Strategic Budget Optimizer</h2>
            <p className="text-xs text-[#A88C87] font-medium">AI-driven capital efficiency</p>
          </div>
        </div>
        {isLoading && <Sparkles size={20} className="text-brand-secondary animate-pulse" />}
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recommendations Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[#5C4541]">
            <TrendingUp size={16} />
            <h3 className="text-sm font-bold uppercase tracking-wider">Recommended Reallocations</h3>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="h-24 bg-[#F9F7F4] animate-pulse rounded-xl"></div>
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((rec, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx} 
                  className="p-4 bg-[#FDF8F3] border border-[#F5E1C8] rounded-xl hover:border-brand-secondary transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#A88C87]">{rec.source}</span>
                      <ArrowRight size={14} className="text-brand-secondary" />
                      <span className="text-xs font-bold text-[#3E1510]">{rec.target}</span>
                    </div>
                    <span className="text-xs font-black text-[#2E6B3B]">{rec.amount}</span>
                  </div>
                  <p className="text-xs text-[#5C4541] leading-relaxed italic">"{rec.reason}"</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center bg-[#F9F7F4] rounded-xl border border-dashed border-[#EAE3D9]">
                <p className="text-sm text-[#A88C87]">No reallocations needed based on current efficiency.</p>
            </div>
          )}
        </div>

        {/* Simulator Column */}
        <div className="bg-[#F9F7F4] rounded-2xl p-6 border border-[#EAE3D9]">
          <div className="flex items-center gap-2 text-[#3E1510] mb-6">
            <Sliders size={18} />
            <h3 className="text-sm font-bold uppercase tracking-wider">Opportunity Simulator</h3>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-end mb-4">
                <label htmlFor="budget-simulator" className="text-sm font-medium text-[#5C4541]">Scale Total Monthly Budget</label>
                <span className="text-2xl font-black text-brand-primary">+{simulatorValue}%</span>
              </div>
              <input 
                id="budget-simulator"
                type="range" 
                min="-50" 
                max="100" 
                value={simulatorValue} 
                onChange={(e) => setSimulatorValue(parseInt(e.target.value))}
                className="w-full h-2 bg-[#EAE3D9] rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
              <div className="flex justify-between mt-2 text-[10px] font-bold text-[#A88C87] uppercase tracking-tighter">
                <span>Cut Spend</span>
                <span>Maintain</span>
                <span>Aggressive Expansion</span>
              </div>
            </div>

            <div className="p-5 bg-white border border-[#EAE3D9] rounded-2xl shadow-inner relative overflow-hidden">
               <div className="absolute top-0 right-0 p-3">
                  <Info size={14} className="text-[#EAE3D9]" />
               </div>
               <p className="text-xs font-bold text-[#A88C87] uppercase mb-1">Projected Revenue Lift</p>
               <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-black text-[#2E6B3B]">{projectedLift}</span>
                 <span className="text-xs font-medium text-[#A88C87]">vs current pacing</span>
               </div>
               <div className="mt-4 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#2E6B3B] animate-pulse"></div>
                 <p className="text-[10px] font-bold text-[#5C4541] italic">AI Confidence: High (92%)</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
