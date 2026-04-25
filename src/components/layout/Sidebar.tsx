import React from 'react';
import { 
  Layout, 
  BarChart3, 
  Search, 
  Megaphone, 
  Youtube, 
  Mail, 
  FileText, 
  Settings, 
  Users, 
  Database, 
  PieChart, 
  Video,
  ChevronRight,
  LogOut,
  User,
  Landmark,
  LayoutTemplate
} from 'lucide-react';

export type ViewType = 'connectors' | 'gsc' | 'youtube' | 'meta' | 'executive' | 'draft' | 'email' | 'tiktok' | 'ga4' | 'revenue-sync' | 'scratchpad' | 'profile' | 'users';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  user?: any;
  logoUrl?: string;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, user, logoUrl, onLogout }) => {
  const NavItem = ({ id, label, icon: Icon, category }: { id: ViewType, label: string, icon: any, category?: string }) => {
    const isActive = currentView === id;
    return (
      <button
        onClick={() => onViewChange(id)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 group ${
          isActive 
            ? 'bg-[#7A2B20] text-white shadow-md' 
            : 'text-[#5C4541] hover:bg-[#EAE3D9]/30'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className={isActive ? 'text-white' : 'text-[#A88C87] group-hover:text-[#7A2B20]'} />
          <span className={`text-sm font-semibold ${isActive ? 'translate-x-1' : ''} transition-transform`}>
            {label}
          </span>
        </div>
        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#DDA77B]" />}
      </button>
    );
  };

  const CategoryLabel = ({ label }: { label: string }) => (
    <p className="px-4 text-[10px] font-black uppercase text-[#A88C87] tracking-[0.2em] mb-2 mt-6">
      {label}
    </p>
  );

  return (
    <aside className="w-72 h-screen bg-white border-r border-[#EAE3D9] flex flex-col shrink-0 overflow-y-auto">
      {/* Branding */}
      <div className="p-8 border-b border-[#F9F7F4] flex items-center gap-4">
        <div className="w-10 h-10 bg-[#7A2B20] rounded-2xl flex items-center justify-center shrink-0 shadow-lg overflow-hidden">
          {logoUrl ? (
            <img src={logoUrl} alt="Company Logo" className="w-full h-full object-cover" />
          ) : (
            <div className="w-5 h-5 border-2 border-white rounded-sm" />
          )}
        </div>
        <div>
           <h1 className="font-serif font-black text-xl text-[#3E1510] leading-none">ImmerShift</h1>
           <p className="text-[10px] font-bold text-[#A88C87] uppercase tracking-widest mt-1">Growth Engine</p>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 px-4 py-6">
        <CategoryLabel label="Dashboards" />
        <div className="space-y-1">
          <NavItem id="executive" label="Digital Overview" icon={Layout} />
          <NavItem id="meta" label="Meta Ads" icon={Megaphone} />
          <NavItem id="ga4" label="Google Analytics 4" icon={BarChart3} />
          <NavItem id="tiktok" label="TikTok Ads" icon={Video} />
          <NavItem id="youtube" label="YouTube" icon={Youtube} />
          <NavItem id="gsc" label="Search Console" icon={Search} />
          <NavItem id="email" label="Email & CRM" icon={Mail} />
          <NavItem id="revenue-sync" label="Revenue Sync" icon={Landmark} />
        </div>

        <CategoryLabel label="Reporting" />
        <div className="space-y-1">
          <NavItem id="draft" label="Draft Reports" icon={FileText} />
          <NavItem id="scratchpad" label="Insight Scratchpad" icon={LayoutTemplate} />
        </div>

        <CategoryLabel label="Workspace" />
        <div className="space-y-1">
          <NavItem id="connectors" label="Connectors" icon={Database} />
          <NavItem id="profile" label="Profile & Brand" icon={Settings} />
          <NavItem id="users" label="User Management" icon={Users} />
        </div>
      </div>

      {/* User Footer */}
      {user && (
        <div className="p-4 m-4 bg-[#F9F7F4] rounded-2xl border border-[#EAE3D9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-[#EAE3D9] flex items-center justify-center text-brand-primary font-bold">
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-sm font-bold text-[#3E1510] truncate">{user.displayName || 'Guest User'}</p>
               <p className="text-[10px] text-[#A88C87] font-medium truncate">{user.email}</p>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-[#A88C87] hover:text-[#7A2B20] transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
