/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import ConnectorsSetup from './ConnectorsSetup';
import GscPlatformOverview from './GscPlatformOverview';
import YoutubePlatformOverview from './YoutubePlatformOverview';
import MetaPlatformOverview from './MetaPlatformOverview';
import ExecutiveOverview from './ExecutiveOverview';
import DraftReportView from './DraftReportView';
import EmailPlatformOverview from './EmailPlatformOverview';
import TiktokPlatformOverview from './TiktokPlatformOverview';
import Ga4PlatformOverview from './Ga4PlatformOverview';
import { AiAnalystSidebar } from './components/dashboard/AiAnalystSidebar';
import { MessageSquare, Sparkles } from 'lucide-react';

type ViewType = 'connectors' | 'gsc' | 'youtube' | 'meta' | 'executive' | 'draft' | 'email' | 'tiktok' | 'ga4';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('ga4');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeContext, setActiveContext] = useState<any>(null);

  // This function allows child views to register their data context for the AI Analyst
  const handleContextUpdate = (data: any) => {
    setActiveContext(data);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F4] flex flex-col relative overflow-hidden">
      {/* Navigation Bar */}
      <div className="bg-white border-b border-[#EAE3D9] p-4 flex gap-4 overflow-x-auto shrink-0 z-50 shadow-sm">
        <button 
          onClick={() => setCurrentView('executive')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${currentView === 'executive' ? 'bg-[#7A2B20] text-white' : 'bg-[#FDF8F3] text-[#5C4541] border border-[#EAE3D9] hover:bg-[#F9F7F4]'}`}
        >
          Executive Overview
        </button>
        <button 
          onClick={() => setCurrentView('draft')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${currentView === 'draft' ? 'bg-[#7A2B20] text-white' : 'bg-[#FDF8F3] text-[#5C4541] border border-[#EAE3D9] hover:bg-[#F9F7F4]'}`}
        >
          Draft Report
        </button>
        <button 
          onClick={() => setCurrentView('ga4')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${currentView === 'ga4' ? 'bg-[#7A2B20] text-white' : 'bg-[#FDF8F3] text-[#5C4541] border border-[#EAE3D9] hover:bg-[#F9F7F4]'}`}
        >
          GA4
        </button>
        <button 
          onClick={() => setCurrentView('meta')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${currentView === 'meta' ? 'bg-[#7A2B20] text-white' : 'bg-[#FDF8F3] text-[#5C4541] border border-[#EAE3D9] hover:bg-[#F9F7F4]'}`}
        >
          Meta Ads
        </button>
        <button 
          onClick={() => setCurrentView('tiktok')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${currentView === 'tiktok' ? 'bg-[#7A2B20] text-white' : 'bg-[#FDF8F3] text-[#5C4541] border border-[#EAE3D9] hover:bg-[#F9F7F4]'}`}
        >
          TikTok
        </button>
        <button 
          onClick={() => setCurrentView('youtube')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${currentView === 'youtube' ? 'bg-[#7A2B20] text-white' : 'bg-[#FDF8F3] text-[#5C4541] border border-[#EAE3D9] hover:bg-[#F9F7F4]'}`}
        >
          YouTube
        </button>
        <button 
          onClick={() => setCurrentView('gsc')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${currentView === 'gsc' ? 'bg-[#7A2B20] text-white' : 'bg-[#FDF8F3] text-[#5C4541] border border-[#EAE3D9] hover:bg-[#F9F7F4]'}`}
        >
          Search Console
        </button>
        <button 
          onClick={() => setCurrentView('email')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${currentView === 'email' ? 'bg-[#7A2B20] text-white' : 'bg-[#FDF8F3] text-[#5C4541] border border-[#EAE3D9] hover:bg-[#F9F7F4]'}`}
        >
          Email & CRM
        </button>
        <button 
          onClick={() => setCurrentView('connectors')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${currentView === 'connectors' ? 'bg-[#7A2B20] text-white' : 'bg-[#FDF8F3] text-[#5C4541] border border-[#EAE3D9] hover:bg-[#F9F7F4]'}`}
        >
          Connectors
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        {currentView === 'executive' && <ExecutiveOverview onDataLoaded={handleContextUpdate} />}
        {currentView === 'draft' && <DraftReportView />}
        {currentView === 'email' && <EmailPlatformOverview />}
        {currentView === 'tiktok' && <TiktokPlatformOverview />}
        {currentView === 'ga4' && <Ga4PlatformOverview />}
        {currentView === 'meta' && <MetaPlatformOverview onDataLoaded={handleContextUpdate} />}
        {currentView === 'gsc' && <GscPlatformOverview />}
        {currentView === 'youtube' && <YoutubePlatformOverview />}
        {currentView === 'connectors' && <ConnectorsSetup />}
      </div>

      {/* AI Analyst Floating Trigger */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#7A2B20] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group"
      >
        <div className="absolute -top-12 right-0 bg-white border border-[#EAE3D9] px-3 py-1.5 rounded-lg text-[#3E1510] text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-sm pointer-events-none">
          <Sparkles size={12} className="inline mr-1 text-[#DDA77B]" />
          Ask AI Analyst
        </div>
        <MessageSquare size={28} />
      </button>

      {/* AI Analyst Sidebar */}
      <AiAnalystSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        dashboardContext={activeContext}
      />
    </div>
  );
}
