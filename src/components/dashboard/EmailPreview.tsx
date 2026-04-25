import React from 'react';
import { Mail, Clock, Send, ChevronRight, BarChart3, TrendingUp, AlertCircle } from 'lucide-react';
import { ReportDraft } from '../../lib/gemini';
import { BusinessProfile } from '../../types/business';

interface EmailPreviewProps {
  business: BusinessProfile;
  report: ReportDraft;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({ business, report }) => {
  const topInsights = report.sections.filter(s => s.type === 'insight').slice(0, 3);
  const summary = report.sections.find(s => s.type === 'summary')?.content;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-[#EAE3D9] overflow-hidden font-sans my-8">
      {/* Email Client Chrome */}
      <div className="bg-[#F9F7F4] border-b border-[#EAE3D9] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#EAE3D9] flex items-center justify-center">
            <Mail size={16} className="text-[#A88C87]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#A88C87] uppercase">Subject</p>
            <p className="text-sm font-bold text-[#3E1510]">{report.month} Performance Executive Summary - {business.name}</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-1.5 bg-[#7A2B20] text-white rounded-lg text-xs font-bold shadow-sm">
          <Send size={14} /> Send Now
        </button>
      </div>

      {/* Email Body */}
      <div className="p-8 md:p-12">
        {/* Brand Header */}
        <div className="flex justify-between items-center border-b-2 border-brand-primary pb-6 mb-8">
          <h1 className="text-2xl font-serif font-extrabold text-brand-primary">{business.name}</h1>
          <div className="text-right">
            <p className="text-[10px] font-bold text-[#A88C87] uppercase">Prepared for Executive Team</p>
            <p className="text-sm font-bold text-[#3E1510]">{report.month} Summary</p>
          </div>
        </div>

        {/* Intro */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-[#3E1510] mb-4">Executive Brief</h2>
          <p className="text-[#5C4541] leading-relaxed italic border-l-4 border-brand-secondary pl-4 py-1">
            {summary}
          </p>
        </div>

        {/* AI Powered Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {topInsights.map((insight, idx) => (
            <div key={idx} className="bg-[#FDF8F3] border border-[#EAE3D9] rounded-xl p-5">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#EAE3D9] flex items-center justify-center text-brand-secondary mb-3">
                {idx === 0 ? <TrendingUp size={16} /> : idx === 1 ? <BarChart3 size={16} /> : <AlertCircle size={16} />}
              </div>
              <h4 className="text-xs font-bold text-[#5C4541] mb-2 uppercase tracking-wide">{insight.heading}</h4>
              <p className="text-xs text-[#3E1510] leading-relaxed line-clamp-4">{insight.content}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-brand-primary rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-3">Ready to dive deeper?</h3>
          <p className="text-white/80 text-sm mb-6 max-w-md mx-auto">Click below to view the interactive dashboard with real-time pacing and channel economics for {report.month}.</p>
          <button className="bg-white text-brand-primary px-8 py-3 rounded-xl font-bold text-sm shadow-xl inline-flex items-center gap-2 hover:bg-brand-secondary hover:text-white transition-all">
            View Full Dashboard <ChevronRight size={18} />
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-[#EAE3D9] text-center">
          <p className="text-[10px] text-[#A88C87] font-medium uppercase tracking-widest leading-loose">
            Digitally Powered by Insights Pro AI<br />
            Strategy • Performance • Scale
          </p>
        </div>
      </div>
    </div>
  );
};
