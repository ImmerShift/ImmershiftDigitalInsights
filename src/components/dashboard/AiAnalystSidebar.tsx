import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, MessageSquare, Sparkles, AlertCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { analyzeDashboardQuery, detectAnomalies } from '../../lib/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AiAnalystSidebarProps {
  dashboardContext: any;
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'id';
}

export const AiAnalystSidebar: React.FC<AiAnalystSidebarProps> = ({ 
  dashboardContext, 
  isOpen, 
  onClose,
  language = 'en'
}) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: language === 'id' ? 'Halo! Saya adalah Analis Pemasaran AI Anda. Saya telah memindai tampilan saat ini. Ada yang bisa saya bantu hari ini?' : 'Hello! I am your AI Marketing Analyst. I have scanned the current view. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: 'assistant', content: language === 'id' ? 'Halo! Saya adalah Analis Pemasaran AI Anda. Saya telah memindai tampilan saat ini. Ada yang bisa saya bantu hari ini?' : 'Hello! I am your AI Marketing Analyst. I have scanned the current view. How can I help you today?' }]);
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const fetchAnomalies = async () => {
      if (dashboardContext) {
        const detected = await detectAnomalies(dashboardContext);
        setAlerts(detected);
      }
    };
    fetchAnomalies();
  }, [dashboardContext]);

  const handleSend = async (query?: string) => {
    const text = query || input;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await analyzeDashboardQuery(text, dashboardContext, language);
    
    const assistantMessage: Message = { role: 'assistant', content: response };
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const quickActions = [
    { label: language === 'id' ? 'Ringkasan Performa' : 'Summarize Performance', query: 'Give me a high-level summary of the performance in this view.' },
    { label: language === 'id' ? 'Cari Anomali' : 'Find Anomalies', query: 'What are the biggest anomalies or red flags in this data?' },
    { label: language === 'id' ? 'Perbandingan Channel' : 'Channel Comparison', query: 'Compare the performance effectiveness of the different channels shown.' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white shadow-2xl border-l border-[#EAE3D9] z-50 flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#EAE3D9] flex items-center justify-between bg-[#FDF8F3]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7A2B20] flex items-center justify-center text-white">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#3E1510]">AI Marketing Analyst</h3>
                <span className="text-xs text-[#2E6B3B] flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B3B] animate-pulse"></span>
                  Active Strategy Insight
                </span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-[#EAE3D9] rounded-lg transition-colors text-[#A88C87]"
            >
              <X size={20} />
            </button>
          </div>

          {/* Activity / Anomalies Bar */}
          {alerts.length > 0 && (
            <div className="bg-[#FFF9E6] border-b border-[#F5E1C8] px-6 py-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={14} className="text-[#B8860B]" />
                <span className="text-[10px] font-bold text-[#B8860B] uppercase tracking-wider">AI Strategy Alerts</span>
              </div>
              <div className="space-y-1.5">
                {alerts.slice(0, 2).map((alert, i) => (
                  <div key={i} className="text-xs text-[#5C4541] flex items-start gap-2">
                    <ChevronRight size={12} className="mt-0.5 shrink-0 text-[#DDA77B]" />
                    {alert}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-white"
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user' 
                    ? 'bg-[#7A2B20] text-white shadow-md' 
                    : 'bg-[#F9F7F4] border border-[#EAE3D9] text-[#3E1510]'
                }`}>
                  <div className="markdown-body prose prose-sm max-w-none prose-slate">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#F9F7F4] border border-[#EAE3D9] rounded-2xl px-5 py-3 flex gap-2 items-center">
                  <div className="w-1.5 h-1.5 bg-[#A88C87] rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[#A88C87] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-[#A88C87] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions & Input */}
          <div className="p-6 border-t border-[#EAE3D9] bg-[#FDF8F3] space-y-4">
            {messages.length < 3 && (
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(action.query)}
                    className="text-xs px-3 py-2 bg-white border border-[#EAE3D9] rounded-full text-[#5C4541] hover:border-[#7A2B20] hover:text-[#7A2B20] transition-all flex items-center gap-1.5"
                  >
                    <Sparkles size={12} className="text-[#DDA77B]" />
                    {action.label}
                  </button>
                ))}
              </div>
            )}
            
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="relative"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your performance..."
                className="w-full bg-white border border-[#EAE3D9] rounded-xl pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A2B20]/20 focus:border-[#7A2B20] transition-all shadow-inner"
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-2 w-10 h-10 bg-[#7A2B20] text-white rounded-lg flex items-center justify-center hover:bg-[#5C2018] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
