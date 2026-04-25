import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Presentation, 
  CheckCircle,
  Sparkles,
  Loader2
} from 'lucide-react';
import { 
  generateMonthlyNarrative, 
  DashboardContextData, 
  ReportDraft 
} from './lib/gemini';

const MOCK_DRAFT: ReportDraft = {
  month: 'April 2026',
  status: 'Draft Ready',
  lastUpdated: 'Just now',
  sections: [
    {
      id: 'sec-1',
      type: 'title',
      heading: 'April 2026 Performance: Riding the Sunset Wave',
      content: 'Executive Brief & Funnel Analysis'
    },
    {
      id: 'sec-2',
      type: 'summary',
      heading: 'Executive Summary',
      content: 'April saw a critical shift in booking behavior. While total reservations dipped seasonally to 578 (pacing IDR 1.16B min spend), digital reliance grew. Walk-in traffic dropped from 78% to 68%, successfully offset by Website bookings recovering to 15.7% and WhatsApp bookings doubling to 15.2%.'
    },
    {
      id: 'sec-3',
      type: 'insight',
      heading: 'The Meta Funnel Gap',
      content: 'Meta Ads successfully drove cheap top-of-funnel traffic (IDR 347 CPC) yielding 37,849 link clicks. However, the TableCheck pixel integration is failing, tracking only 21 Initiate Checkouts. This represents a massive data blindspot that must be fixed before the July peak season.'
    },
    {
      id: 'sec-4',
      type: 'insight',
      heading: 'Emerging Markets (Organic)',
      content: 'Without targeted ad spend, we are seeing strong organic signals from France (+300% to 32 reservations) and the UAE (22 new reservations). Russia remains a steady 7-10% of our guest makeup.'
    },
    {
      id: 'sec-5',
      type: 'action',
      heading: 'May Action Items',
      content: '1. Urgent: Developer fix for TableCheck Meta Pixel integration.\n2. Shift budget to YouTube Demand Gen (currently yielding best CPA at IDR 525).\n3. Launch experimental broad targeting campaigns for France and UAE tourists currently in Bali.'
    }
  ]
};

export default function DraftReportView() {
  const [draft, setDraft] = useState<ReportDraft>(MOCK_DRAFT);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerateNarrative = async (refinementNote?: string) => {
    if (isGenerating) return;
    setIsGenerating(true);

    const contextData: DashboardContextData = {
      month: 'April 2026',
      totalRevenue: 'IDR 1.16B',
      totalSpend: 'IDR 30.1M',
      blendedRoas: '38.5x',
      metaFunnelDropoff: true,
      topChannels: ['Meta Ads', 'Google P-Max', 'YouTube Demand Gen'],
      keyHighlights: [
        'Website bookings recovering to 15.7%',
        'WhatsApp bookings doubling to 15.2%',
        'Strong organic signals from France and UAE'
      ]
    };

    if (refinementNote?.trim()) {
      contextData.keyHighlights.push(`[USER REFINEMENT REQUEST: ${refinementNote}]`);
    }

    // Call the AI engine (Swap empty string for your actual import.meta.env.VITE_GEMINI_API_KEY when running locally)
    const newDraft = await generateMonthlyNarrative(contextData, '');
    
    setDraft(newDraft);
    setIsGenerating(false);
    setCustomPrompt('');
  };

  const handleInlineRefine = (heading: string) => {
    setCustomPrompt(`Rewrite the [${heading}] section to be more...`);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  return (
    <div className="w-full h-screen flex flex-col font-sans bg-[#F9F7F4]">
      
      {/* Section A: The Workspace Header */}
      <div className="bg-white border-b border-[#EAE3D9] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-20 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#FDF8F3] border border-[#EAE3D9] flex items-center justify-center text-[#7A2B20]">
            <FileText size={20} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold font-serif text-[#3E1510]">Month-End Narrative</h1>
              <span className="px-2.5 py-1 rounded-md bg-[#FDF4E6] text-[#A46A38] text-[10px] font-bold uppercase tracking-wider">
                {isGenerating ? 'Generating' : draft.status}
              </span>
            </div>
            <p className="text-xs text-[#A88C87] font-medium mt-0.5">Last updated: {isGenerating ? '...' : draft.lastUpdated}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button 
            disabled={isGenerating}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#EAE3D9] rounded-xl text-sm font-semibold text-[#5C4541] hover:bg-[#FDF8F3] hover:text-[#3E1510] hover:border-[#DDA77B] transition-all disabled:opacity-50"
          >
            <Download size={16} />
            <span className="hidden md:inline">Export to</span> PDF
          </button>
          <button 
            disabled={isGenerating}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#EAE3D9] rounded-xl text-sm font-semibold text-[#5C4541] hover:bg-[#FDF8F3] hover:text-[#3E1510] hover:border-[#DDA77B] transition-all disabled:opacity-50"
          >
            <Presentation size={16} />
            <span className="hidden md:inline">Export to</span> Google Slides
          </button>
          <button 
            disabled={isGenerating}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#7A2B20] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:bg-[#6A241A] transition-all disabled:opacity-50"
          >
            <CheckCircle size={16} />
            Approve & Save
          </button>
        </div>
      </div>

      {/* Section B: The Document Canvas (Main Scrollable Area) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center custom-scrollbar relative">
        <div className="max-w-4xl w-full bg-white rounded-[2rem] shadow-sm border border-[#EAE3D9] mb-[80px] relative overflow-hidden">
          
          {/* Loading Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[2px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-[#FDF8F3] rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-[#EAE3D9]">
                <Loader2 size={32} className="text-[#7A2B20] animate-spin flex-shrink-0" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#3E1510] mb-2">Analyzing blended metrics...</h2>
              <p className="text-[#A88C87] font-medium flex items-center gap-2 animate-pulse">
                <Sparkles size={16} /> Generating executive narrative
              </p>
            </div>
          )}

          <div className={`p-8 md:p-14 transition-opacity duration-500 ${isGenerating ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
            {draft.sections.map((section) => {
              if (section.type === 'title') {
                return (
                  <div key={section.id} className="mb-12 text-center relative group">
                    <h2 className="text-4xl font-serif font-bold text-[#3E1510] leading-tight mb-4 pr-8">
                      {section.heading}
                    </h2>
                    <p className="text-lg text-[#A88C87] font-medium tracking-wide uppercase">
                      {section.content}
                    </p>
                    <button 
                      onClick={() => handleInlineRefine(section.heading)}
                      className="absolute top-2 right-0 opacity-0 group-hover:opacity-100 p-2 text-[#DDA77B] hover:text-[#7A2B20] bg-[#FDF8F3] rounded-lg transition-all" 
                      title="Rewrite Title"
                    >
                      <Sparkles size={20} />
                    </button>
                  </div>
                );
              }

              return (
                <div key={section.id} className="mb-8 relative group">
                  <div className="flex items-center justify-between border-b border-[#EAE3D9] mb-4 pb-2 mt-8">
                    <h3 className="text-xl font-bold text-[#5C4541] font-serif">
                      {section.heading}
                    </h3>
                    <button 
                      onClick={() => handleInlineRefine(section.heading)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-[#DDA77B] hover:text-[#7A2B20] bg-[#FDF8F3] rounded-md transition-all -mb-1" 
                      title="Rewrite Section"
                    >
                      <Sparkles size={16} />
                    </button>
                  </div>
                  <div className="text-base text-[#3E1510] leading-relaxed whitespace-pre-wrap pl-1 group-hover:bg-[#F9F7F4]/50 rounded-lg transition-colors p-2 -ml-3">
                    {section.content}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section C: The AI Refinement Prompt Bar (Sticky Bottom) */}
      <div className="bg-white border-t border-[#EAE3D9] p-4 z-20 shrink-0 sticky bottom-0">
        <div className={`max-w-4xl mx-auto flex items-end gap-3 bg-[#FDF8F3] border border-[#EAE3D9] rounded-[1.25rem] p-2 shadow-sm focus-within:ring-2 focus-within:ring-[#DDA77B]/50 focus-within:border-[#DDA77B] transition-all ${isGenerating ? 'opacity-50 pointer-events-none' : ''}`}>
          <textarea 
            ref={textareaRef}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            disabled={isGenerating}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (customPrompt.trim()) {
                  handleGenerateNarrative(customPrompt);
                }
              }
            }}
            className="flex-1 bg-transparent border-none outline-none resize-none px-4 py-3 text-sm text-[#3E1510] placeholder:text-[#A88C87] min-h-[52px] max-h-[120px]"
            placeholder="Refine this narrative (e.g., 'Make the executive summary punchier' or 'Add the latest TikTok views')..."
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
          <button 
            onClick={() => handleGenerateNarrative(customPrompt)}
            disabled={isGenerating || (!customPrompt.trim() && isGenerating)}
            className="h-[44px] w-[44px] flex items-center justify-center shrink-0 bg-[#7A2B20] text-white rounded-xl shadow hover:bg-[#6A241A] transition-colors mb-1 mr-1 disabled:opacity-70"
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} fill="currentColor" className="opacity-90" />}
            <span className="sr-only">Generate</span>
          </button>
        </div>
      </div>
      
    </div>
  );
}

