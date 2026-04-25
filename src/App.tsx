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

type ViewType = 'connectors' | 'gsc' | 'youtube' | 'meta' | 'executive' | 'draft' | 'email' | 'tiktok' | 'ga4';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('ga4');

  return (
    <div className="min-h-screen bg-[#F9F7F4] flex flex-col">
      <div className="bg-white border-b border-[#EAE3D9] p-4 flex gap-4 overflow-x-auto shrink-0 z-50">
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
          onClick={() => setCurrentView('email')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${currentView === 'email' ? 'bg-[#7A2B20] text-white' : 'bg-[#FDF8F3] text-[#5C4541] border border-[#EAE3D9] hover:bg-[#F9F7F4]'}`}
        >
          Email & CRM
        </button>
        <button 
          onClick={() => setCurrentView('meta')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${currentView === 'meta' ? 'bg-[#7A2B20] text-white' : 'bg-[#FDF8F3] text-[#5C4541] border border-[#EAE3D9] hover:bg-[#F9F7F4]'}`}
        >
          Meta Ads
        </button>
        <button 
          onClick={() => setCurrentView('ga4')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${currentView === 'ga4' ? 'bg-[#7A2B20] text-white' : 'bg-[#FDF8F3] text-[#5C4541] border border-[#EAE3D9] hover:bg-[#F9F7F4]'}`}
        >
          Google Analytics 4
        </button>
        <button 
          onClick={() => setCurrentView('gsc')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${currentView === 'gsc' ? 'bg-[#7A2B20] text-white' : 'bg-[#FDF8F3] text-[#5C4541] border border-[#EAE3D9] hover:bg-[#F9F7F4]'}`}
        >
          Google Search Console
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
          onClick={() => setCurrentView('connectors')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${currentView === 'connectors' ? 'bg-[#7A2B20] text-white' : 'bg-[#FDF8F3] text-[#5C4541] border border-[#EAE3D9] hover:bg-[#F9F7F4]'}`}
        >
          Connectors Setup
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        {currentView === 'executive' && <ExecutiveOverview />}
        {currentView === 'draft' && <DraftReportView />}
        {currentView === 'email' && <EmailPlatformOverview />}
        {currentView === 'tiktok' && <TiktokPlatformOverview />}
        {currentView === 'ga4' && <Ga4PlatformOverview />}
        {currentView === 'meta' && <MetaPlatformOverview />}
        {currentView === 'gsc' && <GscPlatformOverview />}
        {currentView === 'youtube' && <YoutubePlatformOverview />}
        {currentView === 'connectors' && <ConnectorsSetup />}
      </div>
    </div>
  );
}
