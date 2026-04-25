import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Save, 
  Trash2, 
  Plus, 
  Layout, 
  Search,
  Globe,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DynamicWidget } from './DynamicWidget';
import { generateWidgetSchema, WidgetSchema } from '../../lib/gemini';

interface CustomInsightsBuilderProps {
  availableContext: any;
  preferredLanguage?: 'en' | 'id';
}

export const CustomInsightsBuilder: React.FC<CustomInsightsBuilderProps> = ({ availableContext, preferredLanguage = 'en' }) => {
  const [request, setRequest] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pinnedWidgets, setPinnedWidgets] = useState<WidgetSchema[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<'en' | 'id'>(preferredLanguage);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLanguage(preferredLanguage);
  }, [preferredLanguage]);

  // Speech Recognition Setup
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'en' ? 'en-US' : 'id-ID';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setRequest(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setError(null);
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleGenerate = async () => {
    if (!request.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const widget = await generateWidgetSchema(request, availableContext, language);
      if (widget) {
        setPinnedWidgets([widget, ...pinnedWidgets]);
        setRequest('');
      } else {
        setError('Engine could not synthesize widget. Try refining your request.');
      }
    } catch (err) {
      setError('Communication error with AI Engine.');
    } finally {
      setIsGenerating(false);
    }
  };

  const removeWidget = (idx: number) => {
    setPinnedWidgets(pinnedWidgets.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <div className="p-1.5 bg-[#FDF8F3] border border-[#F5E1C8] rounded-lg">
                <Layout size={16} className="text-[#DDA77B]" />
             </div>
             <p className="text-[10px] font-black uppercase text-[#A88C87] tracking-widest">Workspace</p>
           </div>
           <h1 className="text-3xl font-serif font-black text-[#3E1510]">Insight Scratchpad</h1>
           <p className="text-[#5C4541] mt-2 max-w-xl">
             Generate real-time custom visualizations by describing the data relationship you want to see.
           </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EAE3D9] rounded-2xl text-xs font-bold text-[#3E1510] hover:bg-[#F9F7F4] transition-colors"
          >
            <Languages size={14} className="text-brand-secondary" />
            {language === 'en' ? 'English' : 'Bahasa Indonesia'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#3E1510] text-white rounded-2xl text-xs font-bold shadow-lg hover:scale-105 active:scale-95 transition-all">
            <Save size={14} />
            Export Config
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-[2.5rem] border border-[#EAE3D9] p-8 shadow-sm">
        <div className="relative">
          <textarea
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder={language === 'en' ? "e.g., 'Compare conversion rates of TikTok vs Meta Ads for the last 14 days'" : "misal: 'Bandingkan conversion rate TikTok vs Meta Ads selama 14 hari terakhir'"}
            className="w-full h-32 p-6 bg-[#F9F7F4] rounded-2xl border-none focus:ring-2 focus:ring-brand-primary text-[#3E1510] font-medium placeholder-[#A88C87] resize-none"
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <button 
              onClick={toggleListening}
              className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-[#A88C87] border border-[#EAE3D9] hover:text-brand-primary'}`}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !request.trim()}
              className="px-6 py-3 bg-brand-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#5C2118] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Synthesizing...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate UI
                </>
              )}
            </button>
          </div>
        </div>
        {error && (
          <p className="mt-4 text-xs font-bold text-[#7A2B20] flex items-center gap-1">
            <Trash2 size={12} /> {error}
          </p>
        )}
      </div>

      {/* Dynamic Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {pinnedWidgets.map((widget, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative group"
            >
              <button 
                onClick={() => removeWidget(i)}
                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur border border-red-100 rounded-full text-[#7A2B20] opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>
              <DynamicWidget schema={widget} />
            </motion.div>
          ))}
        </AnimatePresence>

        {pinnedWidgets.length === 0 && !isGenerating && (
          <div className="lg:col-span-2 py-20 flex flex-col items-center justify-center border-2 border-dashed border-[#EAE3D9] rounded-[2.5rem]">
             <div className="w-16 h-16 bg-[#FDF8F3] rounded-full flex items-center justify-center mb-4">
                <Plus size={32} className="text-[#DDA77B]" />
             </div>
             <p className="text-[#3E1510] font-black uppercase text-xs tracking-widest">Your Private Insight Workspace</p>
             <p className="text-[#A88C87] text-sm mt-2 text-center max-w-sm">
               Synthesized widgets will appear here. Pin them to your dashboard or export as a report section.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};
