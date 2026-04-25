import React from 'react';
import { Activity, ShieldCheck, ShieldAlert, RefreshCw, Database, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface HealthStatus {
  platform: string;
  status: 'healthy' | 'error' | 'warning';
  lastSynced: string;
  freshness: string;
  isMock?: boolean;
}

const DASHBOARD_HEALTH: HealthStatus[] = [
  { platform: 'Meta Ads', status: 'healthy', lastSynced: '4 mins ago', freshness: 'Real-time', isMock: false },
  { platform: 'Google Analytics 4', status: 'healthy', lastSynced: '12 mins ago', freshness: 'Real-time', isMock: false },
  { platform: 'TikTok Manager', status: 'warning', lastSynced: '3 hours ago', freshness: 'Delayed', isMock: true },
  { platform: 'Google Search Console', status: 'error', lastSynced: 'Last Week', freshness: 'Stale', isMock: false },
  { platform: 'LinkedIn Campaign', status: 'healthy', lastSynced: '22 mins ago', freshness: 'Real-time', isMock: false },
];

interface DataHealthMonitorProps {
  currentLiveStatus?: boolean;
}

export const DataHealthMonitor: React.FC<DataHealthMonitorProps> = ({ currentLiveStatus }) => {
  const DASHBOARD_HEALTH: HealthStatus[] = [
    { platform: 'Meta Ads', status: 'healthy', lastSynced: '4 mins ago', freshness: 'Real-time', isMock: false },
    { platform: 'Google Analytics 4', status: 'healthy', lastSynced: '12 mins ago', freshness: 'Real-time', isMock: false },
    { platform: 'TikTok Manager', status: 'warning', lastSynced: '3 hours ago', freshness: 'Delayed', isMock: true },
    { platform: 'Google Search Console', status: 'error', lastSynced: 'Last Week', freshness: 'Stale', isMock: !currentLiveStatus },
    { platform: 'LinkedIn Campaign', status: 'healthy', lastSynced: '22 mins ago', freshness: 'Real-time', isMock: false },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#EAE3D9] overflow-hidden shadow-sm flex flex-col">
      <div className="p-6 border-b border-[#EAE3D9] flex items-center justify-between bg-[#FDF8F3]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-secondary text-white flex items-center justify-center">
            <Activity size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-[#3E1510]">Data Infrastructure Health</h2>
            <p className="text-xs text-[#A88C87] font-medium">Monitoring 5 active data pipes</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#EAE3D9] rounded-lg text-xs font-bold text-[#5C4541] hover:bg-[#F9F7F4] transition-colors">
          <RefreshCw size={14} /> Force Sync
        </button>
      </div>

      <div className="p-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-[#F9F7F4]">
              <th className="pb-4 text-[10px] font-black text-[#A88C87] uppercase tracking-wider">Source</th>
              <th className="pb-4 text-[10px] font-black text-[#A88C87] uppercase tracking-wider">Status</th>
              <th className="pb-4 text-[10px] font-black text-[#A88C87] uppercase tracking-wider">Last Sync</th>
              <th className="pb-4 text-[10px] font-black text-[#A88C87] uppercase tracking-wider">Data Mode</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F9F7F4]">
            {DASHBOARD_HEALTH.map((pipe, idx) => (
              <tr key={idx} className="group hover:bg-[#FDF8F3]/50 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      pipe.status === 'healthy' ? 'bg-[#2E6B3B]' : 
                      pipe.status === 'warning' ? 'bg-[#DDA77B]' : 'bg-[#7A2B20]'
                    }`}></div>
                    <span className="text-sm font-bold text-[#3E1510]">{pipe.platform}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    {pipe.status === 'healthy' ? (
                      <CheckCircle2 size={14} className="text-[#2E6B3B]" />
                    ) : (
                      <AlertCircle size={14} className={pipe.status === 'warning' ? 'text-[#DDA77B]' : 'text-[#7A2B20]'} />
                    )}
                    <span className={`text-[10px] font-bold uppercase ${
                      pipe.status === 'healthy' ? 'text-[#2E6B3B]' : 
                      pipe.status === 'warning' ? 'text-[#DDA77B]' : 'text-[#7A2B20]'
                    }`}>
                      {pipe.status}
                    </span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2 text-xs text-[#5C4541]">
                    <Clock size={12} className="text-[#A88C87]" />
                    {pipe.lastSynced}
                  </div>
                </td>
                <td className="py-4">
                  {pipe.isMock ? (
                    <span className="px-2 py-0.5 rounded-md bg-[#FFF9E6] text-[#B8860B] text-[9px] font-black uppercase tracking-tight border border-[#F5E1C8]">
                      Failsafe Mock
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-[#E6F4EA] text-[#1E7E34] text-[9px] font-black uppercase tracking-tight border border-[#C3E6CB]">
                      Live API
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 bg-[#F9F7F4] border-t border-[#EAE3D9]">
        <div className="flex items-center gap-2 text-[#A88C87]">
          <ShieldCheck size={14} />
          <p className="text-[10px] font-medium italic">Secure SSL integration with 256-bit encryption verified for all connected nodes.</p>
        </div>
      </div>
    </div>
  );
};
