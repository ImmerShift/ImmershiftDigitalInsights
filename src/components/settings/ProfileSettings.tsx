import React, { useState } from 'react';
import { 
  User, 
  Camera, 
  Building, 
  Shield, 
  Lock, 
  CreditCard, 
  Bell, 
  Upload,
  Globe,
  Palette,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileSettingsProps {
  user: any;
  onUpdateLogo: (url: string) => void;
  logoUrl?: string;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUpdateLogo, logoUrl }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'brand' | 'security' | 'billing'>('profile');
  const [isUploading, setIsUploading] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // In a real app, you'd upload to Firebase Storage
    // For this demo, we'll use a FileReader and local state
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onUpdateLogo(result);
      setIsUploading(false);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    };
    reader.readAsDataURL(file);
  };

  const [toggles, setToggles] = useState({ pdf: true, clientDomain: false });

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button
      role="tab"
      aria-selected={activeTab === id}
      aria-controls={`panel-${id}`}
      id={`tab-${id}`}
      tabIndex={activeTab === id ? 0 : -1}
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A2B20] focus-visible:ring-offset-2 ${
        activeTab === id 
          ? 'border-[#7A2B20] text-[#7A2B20]' 
          : 'border-transparent text-[#A88C87] hover:text-[#5C4541]'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
           <h1 className="text-3xl font-serif font-black text-[#3E1510]">Account Settings</h1>
           <p className="text-[#5C4541] mt-2">Manage your professional profile and agency branding configurations.</p>
        </div>
        {savedMessage && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-4 py-2 bg-[#F2FFF4] border border-[#2E6B3B]/20 text-[#2E6B3B] rounded-xl text-xs font-bold"
          >
            <CheckCircle2 size={14} /> Settings Saved
          </motion.div>
        )}
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Settings Categories" className="flex border-b border-[#EAE3D9] mb-8 overflow-x-auto whitespace-nowrap">
        <TabButton id="profile" label="User Profile" icon={User} />
        <TabButton id="brand" label="Brand Assets" icon={Palette} />
        <TabButton id="security" label="Security" icon={Lock} />
        <TabButton id="billing" label="Billing" icon={CreditCard} />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-[#EAE3D9] p-10 shadow-sm">
        {activeTab === 'profile' && (
          <div role="tabpanel" id="panel-profile" aria-labelledby="tab-profile" className="space-y-8">
            <div className="flex items-center gap-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl bg-[#F9F7F4] border-2 border-[#EAE3D9] flex items-center justify-center text-3xl font-black text-brand-primary overflow-hidden">
                  {user?.photoURL ? <img src={user.photoURL} alt="User" /> : user?.email?.charAt(0).toUpperCase()}
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-[#7A2B20] text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all">
                  <Camera size={16} />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#3E1510]">{user?.displayName || 'John Doe'}</h3>
                <p className="text-sm text-[#A88C87] mt-1 italic">Product Design Manager at Syah Bali Ventura</p>
                <div className="flex items-center gap-2 mt-3">
                   <div className="px-2 py-0.5 bg-[#FDF8F3] border border-[#F5E1C8] rounded-md text-[9px] font-black uppercase text-[#DDA77B]">Admin Account</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[#A88C87] tracking-widest pl-1">Display Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.displayName || 'John Doe'}
                  className="w-full px-5 py-3 bg-[#F9F7F4] border-none rounded-2xl focus:ring-2 focus:ring-brand-primary text-[#3E1510] font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[#A88C87] tracking-widest pl-1">Email Address</label>
                <input 
                  type="email" 
                  disabled
                  defaultValue={user?.email || 'john@immershift.com'}
                  className="w-full px-5 py-3 bg-[#F9F7F4] border-none rounded-2xl text-[#A88C87] font-medium cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'brand' && (
          <div role="tabpanel" id="panel-brand" aria-labelledby="tab-brand" className="space-y-10">
            <div className="flex flex-col md:flex-row gap-10 items-start">
               <div className="w-full md:w-1/3">
                  <h4 className="font-bold text-[#3E1510] mb-2">Company Logo</h4>
                  <p className="text-xs text-[#5C4541] leading-relaxed">
                    Upload your agency or company logo. This will white-label the entire dashboard, reports, and exported configurations for your clients.
                  </p>
               </div>
               <div className="w-full md:w-2/3">
                  <div aria-busy={isUploading} className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all ${isUploading ? 'bg-[#F9F7F4] border-[#DDA77B]' : 'border-[#EAE3D9] hover:border-brand-primary'}`}>
                    {logoUrl ? (
                      <div className="relative mb-6 group">
                         <div className="w-32 h-32 bg-[#F9F7F4] rounded-2xl flex items-center justify-center overflow-hidden border border-[#EAE3D9]">
                            <img src={logoUrl} alt="White label logo" className="w-full h-full object-contain p-4" />
                         </div>
                         <button 
                          onClick={() => onUpdateLogo('')}
                          className="absolute -top-2 -right-2 p-2 bg-white border border-red-100 rounded-lg text-[#7A2B20] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                         >
                           <Shield size={14} />
                         </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-[#FDF8F3] rounded-full flex items-center justify-center mb-6">
                        <Palette size={32} className="text-[#DDA77B]" />
                      </div>
                    )}
                    
                    <label className="cursor-pointer">
                      <span className="px-6 py-3 bg-[#3E1510] text-white rounded-xl text-xs font-bold hover:bg-[#5C2118] transition-all flex items-center gap-2">
                        {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        {logoUrl ? 'Change Profile Logo' : 'Upload Brand Asset'}
                      </span>
                      <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                    </label>
                    <p className="text-[10px] text-[#A88C87] mt-4 font-bold uppercase tracking-widest">SVG, PNG or JPG (Max 500KB)</p>
                  </div>
               </div>
            </div>

            <div className="pt-8 border-t border-[#F9F7F4]">
              <h4 className="font-bold text-[#3E1510] mb-6">Brand Permissions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   { id: 'pdf', label: 'Apply to PDF Exports', desc: 'Auto-inject logo into all generated report documents.', enabled: toggles.pdf },
                   { id: 'clientDomain', label: 'Enable Client Domain', desc: 'Map this dashboard to your custom agency subdomain.', enabled: toggles.clientDomain },
                 ].map((item, i) => (
                   <div key={i} className="p-4 rounded-2xl border border-[#F9F7F4] flex justify-between items-center group">
                      <div>
                        <p id={`toggle-label-${item.id}`} className="text-xs font-bold text-[#3E1510]">{item.label}</p>
                        <p className="text-[10px] text-[#A88C87] mt-1">{item.desc}</p>
                      </div>
                      <button 
                         role="switch" 
                         aria-checked={item.enabled}
                         aria-labelledby={`toggle-label-${item.id}`}
                         onClick={() => setToggles(p => ({ ...p, [item.id]: !item.enabled }))}
                         className={`w-10 h-5 rounded-full relative transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A2B20] focus-visible:ring-offset-2 ${item.enabled ? 'bg-[#2E6B3B]' : 'bg-[#EAE3D9]'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${item.enabled ? 'right-1' : 'left-1'}`} />
                      </button>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div role="tabpanel" id="panel-security" aria-labelledby="tab-security" className="py-20 flex flex-col items-center justify-center text-center">
            <Shield size={64} className="text-[#A88C87] mb-6 opacity-20" />
            <h3 className="text-xl font-bold text-[#3E1510]">Enhanced Security Layer</h3>
            <p className="text-[#5C4541] mt-2 max-w-sm">
              Your account is currently protected by Firebase Identity Management. MFA and advanced logging are enabled by default.
            </p>
          </div>
        )}

        {activeTab === 'billing' && (
          <div role="tabpanel" id="panel-billing" aria-labelledby="tab-billing" className="py-20 flex flex-col items-center justify-center text-center">
            <CreditCard size={64} className="text-[#A88C87] mb-6 opacity-20" />
            <h3 className="text-xl font-bold text-[#3E1510]">Agency Pro Plan</h3>
            <p className="text-[#5C4541] mt-2 max-w-sm">
              You are on the highest tier, allowing unlimited connectors and unlimited AI analyst tokens.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-end gap-3 font-bold text-sm">
         <button className="px-8 py-3 text-[#A88C87] hover:text-[#5C4541]">Cancel</button>
         <button 
          onClick={() => {
            setSavedMessage(true);
            setTimeout(() => setSavedMessage(false), 3000);
          }}
          className="px-10 py-3 bg-brand-primary text-white rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
         >
           Push to Production
         </button>
      </div>
    </div>
  );
};

const Loader2 = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);
