import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Search,
  Megaphone,
  Mail,
  MoreVertical,
  CheckCircle2,
  Plus,
  ArrowLeft,
  Loader2,
  X,
  AlertCircle,
  Link2,
  RefreshCcw,
  Clock
} from 'lucide-react';

import { db, auth } from './lib/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './utils/firebaseErrors';

export interface Platform {
  id: string;
  name: string;
  icon: React.ElementType;
  category: 'Google Ecosystem' | 'Social Ads' | 'Email/CRM';
  description: string;
}

export interface ConnectedAccount {
  id: string;
  platformId: string;
  accountName: string;
  accountId: string;
  connectedAt: any;
  lastSyncedAt?: any;
  status: 'active' | 'error' | 'syncing';
}

const AVAILABLE_PLATFORMS: Platform[] = [
  {
    id: 'ga4',
    name: 'Google Analytics 4',
    icon: BarChart3,
    category: 'Google Ecosystem',
    description: 'Track website traffic, user behavior, and conversion metrics.'
  },
  {
    id: 'google_ads',
    name: 'Google Ads',
    icon: Search,
    category: 'Google Ecosystem',
    description: 'Analyze ad performance, cost per click, and return on ad spend.'
  },
  {
    id: 'search_console',
    name: 'Search Console',
    icon: Search, // Using Search as a generic icon for Search Console
    category: 'Google Ecosystem',
    description: 'Monitor organic search presence and keyword rankings.'
  },
  {
    id: 'meta_ads',
    name: 'Meta Ads',
    icon: Megaphone,
    category: 'Social Ads',
    description: 'Pull data from Facebook and Instagram advertising campaigns.'
  },
  {
    id: 'tiktok_ads',
    name: 'TikTok Ads',
    icon: Megaphone,
    category: 'Social Ads',
    description: 'Track video ad performance, engagement, and conversions.'
  },
  {
    id: 'ig_insights',
    name: 'Instagram Insights',
    icon: BarChart3,
    category: 'Social Ads',
    description: 'Gather metrics on followers, reach, and profile interactions.'
  },
  {
    id: 'klaviyo',
    name: 'Klaviyo',
    icon: Mail,
    category: 'Email/CRM',
    description: 'Analyze email marketing performance and customer segments.'
  }
];

const INITIAL_CONNECTIONS: ConnectedAccount[] = [
  {
    id: '1',
    platformId: 'ga4',
    accountName: 'All Website Data',
    accountId: '528782336',
    connectedAt: new Date().toISOString(),
    status: 'active'
  },
  {
    id: '2',
    platformId: 'meta_ads',
    accountName: 'PT Syah Bali Ventura',
    accountId: '499201992',
    connectedAt: new Date().toISOString(),
    status: 'active'
  },
  {
    id: '3',
    platformId: 'google_ads',
    accountName: 'Search Performance',
    accountId: '102-394-222',
    connectedAt: new Date().toISOString(),
    status: 'error'
  }
];

// Mock sub-accounts to display when a platform is selected
const MOCK_SUB_ACCOUNTS: Record<string, { name: string; id: string }[]> = {
  tiktok_ads: [
    { name: 'PT SYAH BALI VENTURA', id: '7479667722700587009' },
    { name: 'Mari Beach Club', id: '7480480376067325953' },
    { name: 'Syah Bali Corporate', id: '9122312211222123233' }
  ],
  google_ads: [
    { name: 'ImmerShift Main Search', id: '349-291-0021' },
    { name: 'ImmerShift Display', id: '882-120-9938' }
  ],
  klaviyo: [
    { name: 'ImmerShift Global', id: 'Kx8B2n' },
    { name: 'ImmerShift APAC', id: 'Jq9M1x' }
  ],
  search_console: [
    { name: 'immershift.com', id: 'sc-domain-immershift.com' },
    { name: 'blog.immershift.com', id: 'sc-domain-blog.immershift.com' }
  ],
  ig_insights: [
    { name: '@immershift_hq', id: 'ig-4829103' }
  ]
};

export default function ConnectorsSetup() {
  const [currentView, setCurrentView] = useState<'active' | 'marketplace'>('active');
  const [activeConnections, setActiveConnections] = useState<ConnectedAccount[]>([]);
  const [loadingConnections, setLoadingConnections] = useState(true);

  // Sync connections from Firestore
  useEffect(() => {
    if (!auth.currentUser) return;
    const path = `users/${auth.currentUser.uid}/connectors`;
    const unsubscribe = onSnapshot(collection(db, path), (snapshot) => {
      const connections = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ConnectedAccount[];
      setActiveConnections(connections);
      setLoadingConnections(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, []);
  const [authenticatingPlatform, setAuthenticatingPlatform] = useState<string | null>(null);
  const [accountSelectionModal, setAccountSelectionModal] = useState<string | null>(null);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

  const handleRefresh = async (connId: string) => {
    if (!auth.currentUser) return;
    const path = `users/${auth.currentUser.uid}/connectors/${connId}`;
    try {
      await updateDoc(doc(db, path), {
        status: 'syncing'
      });
      
      // Simulate real-time data fetch delay
      setTimeout(async () => {
        await updateDoc(doc(db, path), {
          status: 'active',
          lastSyncedAt: serverTimestamp()
        });
      }, 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const handleDelete = async (connId: string) => {
    if (!auth.currentUser) return;
    if (!confirm('Are you sure you want to disconnect this account?')) return;
    
    const path = `users/${auth.currentUser.uid}/connectors/${connId}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const handleConnect = async (platformId: string) => {
    setAuthenticatingPlatform(platformId);
    
    // Map internal platform IDs to backend names
    const platformMap: Record<string, string> = {
      ga4: 'google',
      google_ads: 'google',
      search_console: 'google',
      meta_ads: 'meta',
    };

    const backendPlatform = platformMap[platformId] || platformId;

    try {
      // 1. Fetch OAuth URL from backend
      const response = await fetch(`/api/auth/${backendPlatform}/url`);
      const { url } = await response.json();

      // 2. Open Popup
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.innerWidth - width) / 2;
      const top = window.screenY + (window.innerHeight - height) / 2;
      
      const popup = window.open(
        url,
        `Connect to ${platformId}`,
        `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`
      );

      if (!popup) {
        throw new Error('Popup blocked. Please enable popups for this site.');
      }

      // 3. Listen for success message from callback window
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'OAUTH_SUCCESS' && event.data.platform === backendPlatform) {
          window.removeEventListener('message', handleMessage);
          setAuthenticatingPlatform(null);
          setAccountSelectionModal(platformId);
          setSelectedAccounts([]);
        }
      };

      window.addEventListener('message', handleMessage);

      // Failsafe: check if popup is closed manually
      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
          window.removeEventListener('message', handleMessage);
          setAuthenticatingPlatform(null);
        }
      }, 1000);

    } catch (err: any) {
      console.error(err);
      alert(err.message || 'OAuth Initiation Failed');
      setAuthenticatingPlatform(null);
    }
  };

  const handleSaveAccounts = async () => {
    if (!accountSelectionModal || !auth.currentUser) return;

    const platform = AVAILABLE_PLATFORMS.find(p => p.id === accountSelectionModal);
    const subAccounts = MOCK_SUB_ACCOUNTS[accountSelectionModal] || [{ name: 'Default Account', id: 'default-123' }];
    
    try {
      const newConnections: ConnectedAccount[] = await Promise.all(selectedAccounts.map(async accId => {
        const accDetails = subAccounts.find(a => a.id === accId);
        const data = {
          platformId: accountSelectionModal,
          accountName: accDetails ? accDetails.name : 'Unknown Account',
          accountId: accId,
          accessToken: 'MOCK_TOKEN_' + Math.random().toString(36).substring(7),
          connectedAt: serverTimestamp(),
          status: 'active'
        };

        const path = `users/${auth.currentUser?.uid}/connectors`;
        try {
          await addDoc(collection(db, path), data);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, path);
        }

        return {
          id: Math.random().toString(36).substr(2, 9),
          ...data
        } as ConnectedAccount;
      }));

      setActiveConnections(prev => [...prev, ...newConnections]);
      setAccountSelectionModal(null);
      setCurrentView('active');
    } catch (err) {
      console.error("Failed to save accounts:", err);
    }
  };

  const currentPlatformDetails = AVAILABLE_PLATFORMS.find(p => p.id === accountSelectionModal);
  const availableTargetAccounts = accountSelectionModal ? (MOCK_SUB_ACCOUNTS[accountSelectionModal] || [{ name: 'Default Account', id: 'default-123' }]) : [];

  const groupedPlatforms = AVAILABLE_PLATFORMS.reduce((acc, platform) => {
    if (!acc[platform.category]) acc[platform.category] = [];
    acc[platform.category].push(platform);
    return acc;
  }, {} as Record<string, Platform[]>);

  return (
    <div className="min-h-screen bg-[#F9F7F4] text-[#3E1510] font-sans overflow-hidden relative">
      {/* Navigation */}
      <nav className="h-16 px-6 sm:px-10 flex items-center justify-between border-b border-[#EAE3D9] bg-white sticky top-0 z-10 w-full">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-[#7A2B20] rounded-lg flex items-center justify-center shrink-0">
            <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block">ImmerShift</span>
          <div className="h-4 w-px bg-[#EAE3D9] mx-2 hidden sm:block"></div>
          <span className="text-[#5C4541] font-medium text-sm">Connectors Setup</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-xs font-semibold text-[#DDA77B] uppercase tracking-wider hidden sm:block cursor-pointer hover:opacity-80">Docs</span>
          <div className="w-8 h-8 rounded-full bg-[#EAE3D9] flex items-center justify-center text-xs font-medium cursor-pointer">JD</div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="p-6 sm:p-10 flex flex-col gap-8 max-w-7xl mx-auto">
        {currentView === 'active' && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h1 className="text-3xl font-serif font-black text-[#3E1510]">Data Sources</h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[#5C4541]">Manage your active connections and data synchronization pipelines.</p>
                  <div className="h-3 w-px bg-[#EAE3D9]" />
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#A88C87]">All Systems Operational</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => activeConnections.forEach(c => handleRefresh(c.id))}
                  className="px-4 py-2.5 bg-white border border-[#EAE3D9] text-[#3E1510] rounded-xl font-bold text-xs shadow-sm hover:bg-[#FDF8F3] flex items-center gap-2 transition-all"
                >
                  <RefreshCcw size={14} />
                  Sync All
                </button>
                <button 
                  onClick={() => setCurrentView('marketplace')}
                  className="px-6 py-2.5 bg-[#3E1510] text-white rounded-xl font-bold text-xs shadow-sm hover:opacity-90 flex items-center gap-2 whitespace-nowrap transition-opacity shrink-0"
                >
                  <Plus size={18} strokeWidth={3} />
                  Add Data Source
                </button>
              </div>
            </div>

            {/* Connections Table */}
            <div className="bg-white rounded-2xl border border-[#EAE3D9] shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#FDF8F3] border-b border-[#EAE3D9]">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#5C4541]">Platform</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#5C4541]">Authenticated Account</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#5C4541]">ID / Reference</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#5C4541]">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#5C4541] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE3D9]">
                  {loadingConnections ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                         <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#7A2B20] opacity-20" />
                         <p className="text-[10px] uppercase font-black tracking-widest text-[#A88C87] mt-4">Streaming Connections...</p>
                      </td>
                    </tr>
                  ) : activeConnections.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[#5C4541] bg-white">
                        <div className="flex flex-col items-center gap-3">
                          <BarChart3 className="w-10 h-10 opacity-20" />
                          <p>No active connections. Add a data source to get started.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    activeConnections.map(conn => {
                      const platform = AVAILABLE_PLATFORMS.find(p => p.id === conn.platformId);
                      const Icon = platform?.icon || BarChart3;
                      const isError = conn.status === 'error';
                      const isSyncing = conn.status === 'syncing';

                      return (
                        <tr key={conn.id} className={`hover:bg-[#FDF8F3]/50 transition-colors group ${isError ? 'opacity-60' : ''}`}>
                          <td className="px-6 py-4 flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 ${
                                isError ? 'bg-red-50 text-red-600' :
                                platform?.id === 'ga4' ? 'bg-blue-50 text-blue-600' :
                                platform?.id === 'meta_ads' ? 'bg-indigo-50 text-indigo-600' :
                                'bg-[#F9F7F4] text-[#7A2B20] border border-[#EAE3D9]'
                            }`}>
                                {platform?.id === 'meta_ads' ? 'f' : 
                                 platform?.id === 'google_ads' || platform?.id === 'ga4' || platform?.id === 'search_console' ? 'G' : 
                                 <Icon size={16} />}
                            </div>
                            <span className="font-semibold text-[#3E1510]">{platform?.name || 'Unknown Platform'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-[#3E1510]">{conn.accountName}</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <Clock size={10} className="text-[#A88C87]" />
                                <span className="text-[9px] font-bold text-[#A88C87]">
                                  {conn.lastSyncedAt 
                                    ? `Last synced: ${typeof conn.lastSyncedAt === 'object' && conn.lastSyncedAt.toDate 
                                        ? conn.lastSyncedAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        : new Date(conn.lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                    : 'Pending first sync'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[#5C4541] font-mono text-xs">
                             <span className="bg-[#EAE3D9]/30 px-2 py-0.5 rounded">{conn.accountId}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                isSyncing ? 'bg-amber-400 animate-pulse' :
                                isError ? 'bg-red-500' : 'bg-green-500'
                              }`} />
                              <span className={`text-xs font-bold ${
                                isSyncing ? 'text-amber-600' :
                                isError ? 'text-red-700' : 'text-green-700'
                              }`}>
                                {isSyncing ? 'Syncing...' : isError ? 'Error' : 'Connected'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleRefresh(conn.id)}
                                disabled={isSyncing}
                                className={`p-1.5 rounded-lg transition-colors ${isSyncing ? 'text-[#DDA77B]' : 'hover:bg-[#F5E1C8] text-[#7A2B20]'}`}
                                title="Refresh Sync"
                              >
                                <RefreshCcw size={14} className={isSyncing ? 'animate-spin' : ''} />
                              </button>
                              <button 
                                onClick={() => handleDelete(conn.id)}
                                className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                                title="Remove Connection"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Marketplace Visual Hint */}
            <div className="fixed bottom-8 right-8 flex items-center gap-4 z-10 pointer-events-none hidden md:flex">
                <div className="bg-white px-4 py-2 rounded-lg border border-[#EAE3D9] shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[10px] uppercase tracking-tighter font-black text-[#5C4541]">Marketplace Live</span>
                </div>
            </div>
          </>
        )}

        {currentView === 'marketplace' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={() => setCurrentView('active')}
              className="text-[#5C4541] hover:text-[#3E1510] font-bold flex items-center gap-2 text-sm transition-colors py-2 group w-fit"
            >
              <ArrowLeft size={18} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
              Back to connections
            </button>

            <div>
              <h1 className="text-3xl font-bold text-[#3E1510] mb-1">Add Data Source</h1>
              <p className="text-[#5C4541]">Connect your tools in one click. No coding required.</p>
            </div>

            <div className="space-y-10">
              {Object.entries(groupedPlatforms).map(([category, platforms]) => (
                <div key={category}>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-[#5C4541] mb-4 border-b border-[#EAE3D9] pb-3">{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {platforms.map(platform => {
                      const Icon = platform.icon;
                      return (
                        <div key={platform.id} className="bg-white border text-left border-[#EAE3D9] rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full hover:border-brand-primary group">
                          <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-[#F9F7F4] text-gray-700 flex items-center justify-center font-bold text-2xl overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
                                {platform.id === 'meta_ads' ? 'f' : 
                                 platform.id === 'google_ads' || platform.id === 'ga4' || platform.id === 'search_console' ? 'G' : 
                                 <Icon size={24} />}
                            </div>
                            <div className="px-2 py-1 bg-[#FDF8F3] border border-[#F5E1C8] rounded-md text-[8px] font-black uppercase text-[#DDA77B]">API v2.0</div>
                          </div>
                          <h3 className="font-serif font-black text-xl mb-3 text-[#3E1510] group-hover:text-brand-primary transition-colors">{platform.name}</h3>
                          <p className="text-[#5C4541] text-sm flex-grow mb-8 leading-relaxed opacity-80">{platform.description}</p>
                          <button
                            onClick={() => handleConnect(platform.id)}
                            className="w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white bg-[#3E1510] hover:bg-brand-primary transition-all flex items-center justify-center gap-2 group/btn"
                          >
                            <Link2 size={16} className="group-hover/btn:rotate-45 transition-transform" />
                            Connect Account
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Authenticating Overlay */}
      {authenticatingPlatform && (
        <div className="fixed inset-0 bg-[#3E1510]/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-6 max-w-sm w-full border border-[#EAE3D9] animate-in zoom-in-95 duration-200">
            <div className="text-[#7A2B20]">
              <Loader2 size={48} strokeWidth={2} className="animate-spin" />
            </div>
            <div className="text-center space-y-2">
                <p className="font-bold text-xl text-[#3E1510]">
                Authenticating
                </p>
                <p className="text-sm font-medium text-[#5C4541] leading-relaxed">
                Connecting to {AVAILABLE_PLATFORMS.find(p => p.id === authenticatingPlatform)?.name}...
                </p>
            </div>
          </div>
        </div>
      )}

      {/* Account Selection Modal Overlay */}
      {accountSelectionModal && (
        <div className="fixed inset-0 bg-[#3E1510]/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="w-[520px] max-w-full bg-white rounded-[2rem] shadow-2xl border border-[#EAE3D9] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            <div className="bg-[#FDF8F3] px-6 sm:px-8 py-6 border-b border-[#EAE3D9] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-black text-lg">
                    {currentPlatformDetails?.id === 'meta_ads' ? 
                     <span className="italic font-serif">f</span> : 
                     currentPlatformDetails?.id === 'tiktok_ads' ? 'd' :
                     currentPlatformDetails?.name.charAt(0)}
                  </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight text-[#3E1510]">{currentPlatformDetails?.name}</h3>
                  <p className="text-xs text-[#5C4541] font-bold uppercase tracking-wider mt-0.5">Account Selection</p>
                </div>
              </div>
              <button 
                onClick={() => setAccountSelectionModal(null)}
                className="text-[#5C4541] hover:text-[#3E1510] p-2 rounded-full hover:bg-[#EAE3D9]/50 transition-colors"
                aria-label="Close modal"
              >
                <X size={24} strokeWidth={2} />
              </button>
            </div>
            
            <div className="p-6 sm:p-8 flex flex-col gap-4 overflow-y-auto min-h-[100px]">
              <div className="bg-[#ECFDF5] border border-[#10B981]/20 p-4 rounded-2xl flex gap-3 mb-2 animate-in fade-in slide-in-from-top-2 duration-500">
                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                    <CheckCircle2 size={20} className="text-[#10B981]" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-xs font-black text-[#065F46] uppercase tracking-widest">Live Connection Active</p>
                    <p className="text-[11px] text-[#065F46]/80 leading-relaxed font-medium">
                      Select advertising accounts to sync data pipelines.
                    </p>
                 </div>
              </div>
              
              <div className="space-y-3">
                {availableTargetAccounts.map(account => {
                    const isSelected = selectedAccounts.includes(account.id);
                    return (
                      <label 
                        key={account.id}
                        className={`group flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all ${
                          isSelected
                            ? 'border-2 border-brand-primary bg-[#FDF8F3] shadow-md -translate-y-0.5'
                            : 'border border-[#EAE3D9] hover:border-brand-primary/50 hover:bg-[#F9F7F4] bg-white shadow-sm'
                        }`}
                      >
                        <div className="flex flex-col pr-4">
                          <span className={`font-black text-sm leading-tight mb-1 transition-colors ${isSelected ? 'text-brand-primary' : 'text-[#3E1510]'}`}>
                            {account.name}
                          </span>
                          <span className="text-[10px] text-[#A88C87] font-mono tracking-tighter truncate max-w-[240px] uppercase">
                            ID: {account.id}
                          </span>
                        </div>
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'bg-brand-primary border-brand-primary text-white scale-110 shadow-lg shadow-brand-primary/20' 
                            : 'border-[#EAE3D9] group-hover:border-brand-primary/30'
                        }`}>
                          {isSelected && <CheckCircle2 size={16} strokeWidth={3} />}
                        </div>
                         {/* Hidden input for accessibility/forms if needed */}
                        <input 
                            type="checkbox" 
                            className="sr-only"
                            checked={isSelected}
                            onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedAccounts(prev => [...prev, account.id]);
                            } else {
                                setSelectedAccounts(prev => prev.filter(id => id !== account.id));
                            }
                            }}
                        />
                      </label>
                    )
                })}
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-[#F9F7F4] border-t border-[#EAE3D9] flex gap-3 shrink-0">
              <button 
                onClick={() => setAccountSelectionModal(null)}
                className="flex-1 py-4 px-4 bg-white border border-[#EAE3D9] rounded-2xl text-[10px] uppercase tracking-widest font-black text-[#5C4541] hover:bg-gray-50 transition-all outline-none"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveAccounts}
                disabled={selectedAccounts.length === 0}
                className="flex-[1.5] py-4 px-4 bg-[#3E1510] text-white rounded-2xl text-[10px] uppercase tracking-widest font-black shadow-xl hover:shadow-2xl hover:bg-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all outline-none active:scale-95"
              >
                Complete Integration {selectedAccounts.length > 0 && `(${selectedAccounts.length})`}
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
