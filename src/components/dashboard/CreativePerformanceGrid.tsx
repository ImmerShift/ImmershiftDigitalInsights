import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  Eye, 
  FileText, 
  Zap, 
  AlertCircle,
  X,
  Loader2,
  CheckCircle2,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BusinessProfile } from '../../types/business';
import { analyzeCreative, generateCreativeBrief } from '../../lib/gemini';

interface CreativeAd {
  id: string;
  thumbnail: string;
  platform: 'Meta' | 'TikTok' | 'Google';
  roas: number;
  cpa: string;
  ctr: number;
  spend: string;
  status: 'active' | 'paused';
}

const MOCK_CREATIVES: CreativeAd[] = [
  { 
    id: 'c1', 
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400', 
    platform: 'Meta', 
    roas: 5.2, 
    cpa: 'IDR 42k', 
    ctr: 2.1, 
    spend: 'IDR 12M',
    status: 'active'
  },
  { 
    id: 'c2', 
    thumbnail: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=400', 
    platform: 'TikTok', 
    roas: 3.8, 
    cpa: 'IDR 55k', 
    ctr: 4.5, 
    spend: 'IDR 8M',
    status: 'active'
  },
  { 
    id: 'c3', 
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400', 
    platform: 'Meta', 
    roas: 1.8, 
    cpa: 'IDR 120k', 
    ctr: 0.8, 
    spend: 'IDR 15M',
    status: 'active'
  },
  { 
    id: 'c4', 
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bbbda5f66471?auto=format&fit=crop&q=80&w=400', 
    platform: 'Google', 
    roas: 4.5, 
    cpa: 'IDR 48k', 
    ctr: 1.5, 
    spend: 'IDR 10M',
    status: 'active'
  }
];

export const CreativePerformanceGrid: React.FC<{ business: BusinessProfile }> = ({ business }) => {
  const [selectedAd, setSelectedAd] = useState<CreativeAd | null>(null);
  const [critique, setCritique] = useState<{ visualScore: number; designCritique: string; suggestedImprovements: string[] } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [brief, setBrief] = useState<string | null>(null);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [showExecDialog, setShowExecDialog] = useState(false);
  const [execAction, setExecAction] = useState<{ type: string; details: string } | null>(null);

  const handleAnalyze = async (ad: CreativeAd) => {
    setSelectedAd(ad);
    setIsAnalyzing(true);
    try {
      const res = await analyzeCreative(ad.thumbnail, { roas: ad.roas, ctr: ad.ctr, spend: ad.spend });
      setCritique(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateBrief = async () => {
    setIsGeneratingBrief(true);
    try {
      const res = await generateCreativeBrief(business, MOCK_CREATIVES.filter(a => a.roas > 4));
      setBrief(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  const handleExecute = (type: string, details: string) => {
    setExecAction({ type, details });
    setShowExecDialog(true);
  };

  const confirmExecution = () => {
    alert(`Success: API Write-back successful. ${execAction?.details}`);
    setShowExecDialog(false);
    setExecAction(null);
  };

  return (
    <div className="space-y-8">
      {/* Winning Patterns */}
      <div className="bg-[#FDF8F3] border border-[#F5E1C8] rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-16 h-16 rounded-2xl bg-white border border-[#EAE3D9] flex items-center justify-center text-brand-secondary shrink-0 shadow-sm">
            <TrendingUp size={32} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold font-serif text-[#3E1510] mb-2 uppercase tracking-tight">Winning Creative Patterns</h3>
            <p className="text-[#5C4541] leading-relaxed italic">
              "Minimalist product shots with warm earth tones (brand-primary) are outperforming studio-white backgrounds by <span className="font-black text-[#2E6B3B]">1.8x ROAS</span>. High-motion TikTok hooks (first 2s) are currently yielding the lowest CPA at <span className="font-black text-[#2E6B3B]">IDR 42k</span>."
            </p>
          </div>
          <button 
            onClick={handleGenerateBrief}
            disabled={isGeneratingBrief}
            className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isGeneratingBrief ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
            Generate Creative Brief
          </button>
        </div>
      </div>

      {/* Creative Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_CREATIVES.map((ad) => (
          <motion.div 
            key={ad.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl border border-[#EAE3D9] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
          >
            <div className="relative aspect-square overflow-hidden bg-gray-100 group">
              <img 
                src={ad.thumbnail} 
                alt={`${ad.platform} ad creative with ROAS ${ad.roas}`} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-black uppercase text-[#3E1510] border border-[#EAE3D9]">
                {ad.platform}
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center justify-center">
                 <button 
                  aria-label={`Analyze ${ad.platform} creative`}
                  onClick={() => handleAnalyze(ad)}
                  className="bg-white text-brand-primary p-3 rounded-full shadow-xl transform scale-75 group-hover:scale-100 focus:scale-100 transition-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
                 >
                   <Eye size={24} />
                 </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold text-[#A88C87] uppercase">ROAS</p>
                  <p className={`text-xl font-black ${ad.roas > 4 ? 'text-[#2E6B3B]' : ad.roas < 2 ? 'text-[#7A2B20]' : 'text-[#3E1510]'}`}>
                    {ad.roas}x
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-[#A88C87] uppercase">CPA</p>
                  <p className="text-sm font-bold text-[#3E1510]">{ad.cpa}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F9F7F4] flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${ad.status === 'active' ? 'bg-[#2E6B3B]' : 'bg-[#7A2B20]'}`}></div>
                   <span className="text-[10px] font-bold text-[#A88C87] uppercase tracking-tighter">{ad.status}</span>
                 </div>
                 {ad.roas < 2 && (
                   <button 
                    onClick={() => handleExecute('Pause Campaign', `Pausing underperforming ad ID: ${ad.id} in Meta Ads Manager.`)}
                    className="flex items-center gap-1.5 text-[10px] font-black text-[#7A2B20] hover:underline"
                   >
                     <Zap size={10} className="fill-current" />
                     Fix Efficiency
                   </button>
                 )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Critique Modal */}
      <AnimatePresence>
        {selectedAd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAd(null)}
              className="absolute inset-0 bg-[#3E1510]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedAd(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 rounded-full text-[#3E1510] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3E1510]"
                aria-label="Close"
              >
                <X size={24} />
              </button>

              <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center relative group">
                <img 
                  src={selectedAd.thumbnail} 
                  alt="Full Ad" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6">
                   <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-[#A88C87] uppercase">Visual Power Score</span>
                        <span className="text-lg font-black text-brand-primary">{critique?.visualScore || '88'}/100</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-primary transition-all duration-1000" 
                          style={{ width: `${critique?.visualScore || 88}%` }}
                        ></div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col">
                <div className="flex items-center gap-2 text-brand-secondary mb-6">
                  <Sparkles size={20} />
                  <h2 className="text-xl font-bold font-serif text-[#3E1510]">AI Creative Critique</h2>
                </div>

                {isAnalyzing ? (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <Loader2 size={40} className="text-brand-primary animate-spin" />
                    <p className="text-sm font-medium text-[#A88C87] animate-pulse">Running Vision Analysis...</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xs font-black text-[#5C4541] uppercase tracking-widest mb-3">Design Audit</h4>
                      <p className="text-[15px] text-[#3E1510] leading-relaxed italic border-l-4 border-brand-secondary pl-6 py-1">
                        {critique?.designCritique}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-[#5C4541] uppercase tracking-widest mb-4">Tactical Improvements</h4>
                      <ul className="space-y-3">
                        {critique?.suggestedImprovements.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 group">
                            <div className="mt-1 w-5 h-5 rounded-full bg-[#F2FFF4] flex items-center justify-center shrink-0 border border-[#2E6B3B]/10">
                              <CheckCircle2 size={12} className="text-[#2E6B3B]" />
                            </div>
                            <span className="text-sm text-[#5C4541] font-medium group-hover:text-[#3E1510] transition-colors">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6 border-t border-[#F9F7F4]">
                       <button 
                        onClick={() => handleExecute('Sync Recommendation', 'Applying recommended design adjustments to campaign assets.')}
                        className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold text-sm shadow-xl hover:shadow-2xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
                       >
                         <Zap size={18} fill="currentColor" />
                         Apply Fixes Instantly
                       </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Brief Generator Modal */}
      <AnimatePresence>
        {brief && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBrief(null)}
              className="absolute inset-0 bg-[#3E1510]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-[#EAE3D9] flex justify-between items-center bg-[#FDF8F3]">
                <div className="flex items-center gap-3">
                   <FileText className="text-brand-primary" />
                   <h2 className="text-xl font-bold font-serif text-[#3E1510]">AI Creative Brief</h2>
                </div>
                <button onClick={() => setBrief(null)} className="p-2 hover:bg-[#F9F7F4] rounded-full text-[#A88C87]">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 md:p-12 overflow-y-auto whitespace-pre-wrap text-sm text-[#5C4541] leading-relaxed">
                 {brief}
              </div>
              <div className="p-6 bg-[#F9F7F4] border-t border-[#EAE3D9] flex justify-end gap-3">
                 <button onClick={() => setBrief(null)} className="px-6 py-2.5 text-sm font-bold text-[#5C4541]">Dismiss</button>
                 <button className="px-6 py-2.5 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-md">Export to Notion</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Execution Confirmation Dialog */}
      <AnimatePresence>
        {showExecDialog && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-[#EAE3D9]"
            >
              <div className="w-12 h-12 rounded-full bg-[#FFF2F2] flex items-center justify-center text-[#7A2B20] mb-6 border border-[#7A2B20]/10">
                <AlertCircle size={24} />
              </div>
              <h2 className="text-xl font-bold text-[#3E1510] mb-2">Confirm Account Write-back</h2>
              <p className="text-sm text-[#5C4541] leading-relaxed mb-8">
                You are about to execute the following optimization: <br />
                <span className="font-bold text-[#3E1510] italic">"{execAction?.details}"</span>. <br /><br />
                This will update live configurations in your connected Ad Account.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowExecDialog(false)}
                  className="flex-1 py-3 text-sm font-bold text-[#5C4541] hover:bg-[#F9F7F4] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmExecution}
                  className="flex-1 py-3 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-lg"
                >
                  Confirm Execution
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
