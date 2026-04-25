import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Presentation, 
  CheckCircle,
  Sparkles,
  Loader2,
  Edit3,
  Save,
  Clock
} from 'lucide-react';
import { BusinessProfile } from './types/business';
import { 
  generateMonthlyNarrative, 
  DashboardContextData, 
  ReportDraft 
} from './lib/gemini';
import { PdfExportService } from './components/dashboard/PdfExportService';

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Load from persistence
  useEffect(() => {
    const saved = localStorage.getItem(`draft_${CURRENT_BUSINESS.name}_April_2026`);
    if (saved) {
      setDraft(JSON.parse(saved));
    }
  }, []);

  const handleGenerateNarrative = async (refinementNote?: string) => {
    if (isGenerating) return;
    setIsGenerating(true);

    const contextData: DashboardContextData = {
      month: 'April 2026',
      metrics: {
        'Total Revenue': 'IDR 1.16B',
        'Total Spend': 'IDR 30.1M',
        'Blended ROAS': '38.5x',
        'Meta Funnel Alert': 'Pixel integration failing'
      },
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

    // Call the AI engine
    const newDraft = await generateMonthlyNarrative(CURRENT_BUSINESS, contextData, '');
    
    setDraft(newDraft);
    setIsGenerating(false);
    setCustomPrompt('');
  };

  const handleFinalize = () => {
    const finalizedDraft: ReportDraft = {
      ...draft,
      status: 'Approved',
      lastUpdated: new Date().toLocaleString()
    };
    setDraft(finalizedDraft);
    // Persistence Strategy
    localStorage.setItem(`draft_${CURRENT_BUSINESS.name}_April_2026`, JSON.stringify(finalizedDraft));
    alert('Report Finalized and Saved to History.');
  };

  const startEditing = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const saveEdit = (id: string) => {
    setDraft(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, content: editContent } : s)
    }));
    setEditingId(null);
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
          <div className="w-10 h-10 rounded-xl bg-[#FDF8F3] border border-[#EAE3D9] flex items-center justify-center text-brand-primary">
            <FileText size={20} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold font-serif text-[#3E1510]">Month-End Narrative</h1>
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${draft.status === 'Approved' ? 'bg-[#E6F4EA] text-[#1E7E34]' : 'bg-[#FDF4E6] text-[#A46A38]'}`}>
                {isGenerating ? 'Generating' : draft.status}
              </span>
            </div>
            <p className="text-xs text-[#A88C87] font-medium mt-0.5 flex items-center gap-1">
              <Clock size={12} />
              Last updated: {isGenerating ? '...' : draft.lastUpdated}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <PdfExportService contentRef={printRef} documentTitle={`${CURRENT_BUSINESS.name}-Report-${draft.month}`} />
          <button 
            disabled={isGenerating || draft.status === 'Approved'}
            onClick={handleFinalize}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:grayscale"
          >
            <CheckCircle size={16} />
            {draft.status === 'Approved' ? 'Already Approved' : 'Approve & Finalize'}
          </button>
        </div>
      </div>

      {/* Section B: The Document Canvas (Main Scrollable Area) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center custom-scrollbar relative">
        <div ref={printRef} className="max-w-4xl w-full bg-white rounded-[2rem] shadow-sm border border-[#EAE3D9] mb-[80px] relative overflow-hidden">
          
          {/* PDF Header (Only visible in PDF) */}
          <div className="hidden print:block p-12 border-b-4 border-brand-primary bg-[#FDF8F3]">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-serif font-extrabold text-brand-primary">{CURRENT_BUSINESS.name}</h2>
                <p className="text-sm font-bold text-brand-secondary uppercase tracking-[0.2em] mt-1">Monthly Analytics Insight</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-[#A88C87] uppercase">Reporting Period</p>
                <p className="text-xl font-bold text-[#3E1510]">{draft.month}</p>
              </div>
            </div>
          </div>
          
          {/* Loading Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[2px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-[#FDF8F3] rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-[#EAE3D9]">
                <Loader2 size={32} className="text-brand-primary animate-spin flex-shrink-0" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#3E1510] mb-2">Analyzing blended metrics...</h2>
              <p className="text-[#A88C87] font-medium flex items-center gap-2 animate-pulse">
                <Sparkles size={16} /> Generating executive narrative
              </p>
            </div>
          )}

          <div className={`p-8 md:p-14 transition-opacity duration-500 ${isGenerating ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
            {draft.sections.map((section) => {
              const isEditing = editingId === section.id;

              if (section.type === 'title') {
                return (
                  <div key={section.id} className="mb-12 text-center relative group">
                    {isEditing ? (
                      <div className="space-y-4">
                        <input 
                          type="text" 
                          value={editContent} 
                          onChange={(e) => setEditContent(e.target.value)}
                          className="text-center w-full text-4xl font-serif font-bold text-[#3E1510] border-b-2 border-brand-primary outline-none py-2"
                        />
                        <button onClick={() => saveEdit(section.id)} className="flex items-center gap-2 mx-auto text-sm font-bold text-brand-primary"><Save size={16} /> Save Changes</button>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-4xl font-serif font-bold text-[#3E1510] leading-tight mb-4 pr-8 print:pr-0">
                          {section.heading}
                        </h2>
                        <p className="text-lg text-[#A88C87] font-medium tracking-wide uppercase">
                          {section.content}
                        </p>
                        <div className="absolute top-2 right-0 flex gap-2 print:hidden">
                          <button 
                            onClick={() => startEditing(section.id, section.heading)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-[#A88C87] hover:text-brand-primary bg-[#FDF8F3] rounded-lg transition-all" 
                            title="Edit"
                          >
                            <Edit3 size={18} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              }

              return (
                <div key={section.id} className="mb-8 relative group">
                  <div className="flex items-center justify-between border-b border-[#EAE3D9] mb-4 pb-2 mt-8">
                    <h3 className="text-xl font-bold text-[#5C4541] font-serif">
                      {section.heading}
                    </h3>
                    <div className="flex gap-2 print:hidden">
                      <button 
                        onClick={() => startEditing(section.id, section.content)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-[#A88C87] hover:text-brand-primary bg-[#FDF8F3] rounded-md transition-all -mb-1"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleInlineRefine(section.heading)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-brand-secondary hover:text-brand-primary bg-[#FDF8F3] rounded-md transition-all -mb-1" 
                        title="AI Rewrite"
                      >
                        <Sparkles size={16} />
                      </button>
                    </div>
                  </div>
                  {isEditing ? (
                    <div className="space-y-4">
                      <textarea 
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full h-32 p-4 text-base text-[#3E1510] border-2 border-brand-primary rounded-xl outline-none"
                      />
                      <button onClick={() => saveEdit(section.id)} className="flex items-center gap-2 text-sm font-bold text-brand-primary bg-white border border-brand-primary px-4 py-2 rounded-lg hover:bg-brand-primary hover:text-white transition-all"><Save size={16} /> Save Section</button>
                    </div>
                  ) : (
                    <div className="text-base text-[#3E1510] leading-relaxed whitespace-pre-wrap pl-1 group-hover:bg-[#F9F7F4]/50 rounded-lg transition-colors p-2 -ml-3">
                      {section.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section C: The AI Refinement Prompt Bar (Sticky Bottom) */}
      <div className="bg-white border-t border-[#EAE3D9] p-4 z-20 shrink-0 sticky bottom-0 print:hidden">
        <div className={`max-w-4xl mx-auto flex items-end gap-3 bg-[#FDF8F3] border border-[#EAE3D9] rounded-[1.25rem] p-2 shadow-sm focus-within:ring-2 focus-within:ring-brand-secondary/50 focus-within:border-brand-secondary transition-all ${isGenerating ? 'opacity-50 pointer-events-none' : ''}`}>
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
            placeholder="Refine this narrative with AI (e.g., 'Make it more aggressive' or 'Add data about high CPA')..."
            rows={1}
          />
          <button 
            onClick={() => handleGenerateNarrative(customPrompt)}
            disabled={isGenerating || !customPrompt.trim()}
            className="h-[44px] w-[44px] flex items-center justify-center shrink-0 bg-brand-primary text-white rounded-xl shadow hover:bg-opacity-90 transition-colors mb-1 mr-1 disabled:opacity-70"
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} fill="currentColor" className="opacity-90" />}
          </button>
        </div>
      </div>
      
    </div>
  );
}
