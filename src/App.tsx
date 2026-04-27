/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import ConnectorsSetup from './ConnectorsSetup';
import GscPlatformOverview from './GscPlatformOverview';
import YoutubePlatformOverview from './YoutubePlatformOverview';
import MetaPlatformOverview from './MetaPlatformOverview';
import DigitalOverview from './DigitalOverview';
import DraftReportView from './DraftReportView';
import EmailPlatformOverview from './EmailPlatformOverview';
import TiktokPlatformOverview from './TiktokPlatformOverview';
import Ga4PlatformOverview from './Ga4PlatformOverview';
import { SalesCycleView } from './components/dashboard/SalesCycleView';
import { CustomInsightsBuilder } from './components/dashboard/CustomInsightsBuilder';
import { CommandCenter } from './components/dashboard/CommandCenter';
import { AiAnalystSidebar } from './components/dashboard/AiAnalystSidebar';
import { Sidebar, ViewType } from './components/layout/Sidebar';
import { ProfileSettings } from './components/settings/ProfileSettings';
import { GlobalDateRangePicker, DateRange } from './components/dashboard/GlobalDateRangePicker';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { MessageSquare, Sparkles } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('executive');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeContext, setActiveContext] = useState<any>(null);
  const [language, setLanguage] = useState<'en' | 'id'>('en');
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange>({ 
    label: 'Last 14 Days', 
    startDate: '2026-04-11', 
    endDate: '2026-04-25' 
  });

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Sync logo from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setLogoUrl(userDoc.data().logoUrl || '');
        }
      } else {
        setUser(null);
        setLogoUrl('');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: string, p: string) => {
    try {
      await signInWithEmailAndPassword(auth, e, p);
    } catch (err: any) {
      throw err;
    }
  };

  const handleRegister = async (e: string, p: string, n: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, e, p);
      await updateProfile(cred.user, { displayName: n });
      await sendEmailVerification(cred.user);
      
      // Initialize firestore doc
      await setDoc(doc(db, 'users', cred.user.uid), {
        email: e,
        displayName: n,
        createdAt: serverTimestamp(),
        logoUrl: ''
      });
    } catch (err: any) {
      throw err;
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      
      // Check if doc exists
      const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', cred.user.uid), {
          email: cred.user.email,
          displayName: cred.user.displayName,
          createdAt: serverTimestamp(),
          logoUrl: ''
        });
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const handleUpdateLogo = async (url: string) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), { 
        logoUrl: url,
        updatedAt: serverTimestamp()
      }, { merge: true });
      setLogoUrl(url);
    } catch (err) {
      console.error("Failed to update logo:", err);
    }
  };

  const handleContextUpdate = (data: any) => {
    setActiveContext(data);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#7A2B20]/20 border-t-[#7A2B20] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return authView === 'login' ? (
      <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthView('register')} onGoogleLogin={handleGoogleLogin} />
    ) : (
      <Register onRegister={handleRegister} onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  return (
    <div className="flex bg-[#F9F7F4] min-h-screen">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        user={user}
        logoUrl={logoUrl}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Global Toolbar */}
        <header className="h-16 bg-white border-b border-[#EAE3D9] flex items-center justify-between px-8 shrink-0 z-50">
          <div className="flex items-center gap-6">
            <h2 className="font-serif font-black text-[#3E1510] tracking-tight">
              {currentView.replace('-', ' ').toUpperCase()}
            </h2>
            <div className="h-4 w-px bg-[#EAE3D9]" />
            <div className="flex gap-2">
              <button 
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded text-[10px] font-black tracking-widest uppercase transition-colors ${language === 'en' ? 'bg-[#3E1510] text-white' : 'text-[#A88C87] hover:bg-[#F9F7F4]'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('id')}
                className={`px-2 py-1 rounded text-[10px] font-black tracking-widest uppercase transition-colors ${language === 'id' ? 'bg-[#3E1510] text-white' : 'text-[#A88C87] hover:bg-[#F9F7F4]'}`}
              >
                ID
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <GlobalDateRangePicker range={dateRange} onChange={setDateRange} />
            <button className="p-2.5 bg-[#FDF8F3] border border-[#EAE3D9] rounded-xl text-[#3E1510] relative group">
              <Sparkles size={18} className="text-brand-secondary" />
              <div className="absolute top-full right-0 mt-2 p-3 bg-[#3E1510] text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-[100] w-48 shadow-2xl pointer-events-none">
                 AI Insights are up to date based on the selected date window.
              </div>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative bg-[#F9F7F4]">
          {currentView === 'executive' && <DigitalOverview onDataLoaded={handleContextUpdate} dateRange={dateRange} />}
          {currentView === 'scratchpad' && (
            <div className="p-8 max-w-7xl mx-auto w-full">
              <CustomInsightsBuilder availableContext={activeContext} preferredLanguage={language} />
            </div>
          )}
          {currentView === 'revenue-sync' && (
            <div className="p-8 max-w-7xl mx-auto w-full">
              <SalesCycleView 
                business={{ name: 'Digital Insights Pro', industry: 'saas' } as any}
                adData={[]} 
                crmData={[]} 
              />
            </div>
          )}
          {currentView === 'draft' && <DraftReportView />}
          {currentView === 'email' && <EmailPlatformOverview />}
          {currentView === 'tiktok' && <TiktokPlatformOverview />}
          {currentView === 'ga4' && <Ga4PlatformOverview />}
          {currentView === 'meta' && <MetaPlatformOverview onDataLoaded={handleContextUpdate} />}
          {currentView === 'gsc' && <GscPlatformOverview />}
          {currentView === 'youtube' && <YoutubePlatformOverview />}
          {currentView === 'connectors' && <ConnectorsSetup />}
          {currentView === 'profile' && <ProfileSettings user={user} logoUrl={logoUrl} onUpdateLogo={handleUpdateLogo} />}
          {currentView === 'users' && (
            <div className="flex items-center justify-center p-20 text-[#A88C87] font-bold uppercase tracking-widest text-xs h-full">
              User Management coming soon (Firebase RBAC integration)
            </div>
          )}
        </main>
      </div>

      {/* Overlays */}
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

      <AiAnalystSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        dashboardContext={activeContext}
        language={language}
      />

      <CommandCenter 
        onNavigate={(view) => setCurrentView(view)} 
        onAiAsk={() => setIsSidebarOpen(true)} 
      />
    </div>
  );
}
