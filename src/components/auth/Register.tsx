import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface RegisterProps {
  onRegister: (email: string, pass: string, name: string) => Promise<void>;
  onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegister, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onRegister(email, password, name);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F4] flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] border border-[#EAE3D9] p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-brand-secondary" />
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#DDA77B] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg -rotate-3">
             <CheckCircle2 className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-serif font-black text-[#3E1510]">Get Started</h1>
          <p className="text-[#5C4541] mt-2">Build your agency's AI data infrastructure.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="register-name" className="text-[10px] font-black uppercase text-[#A88C87] tracking-widest pl-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A88C87]" size={18} />
              <input 
                id="register-name"
                type="text" 
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="CEO Name"
                className="w-full pl-12 pr-5 py-3.5 bg-[#F9F7F4] border-none rounded-2xl focus:ring-2 focus:ring-brand-secondary text-[#3E1510] font-medium placeholder-[#A88C87]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="register-email" className="text-[10px] font-black uppercase text-[#A88C87] tracking-widest pl-1">Agency Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A88C87]" size={18} />
              <input 
                id="register-email"
                type="email" 
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="growth@agency.com"
                className="w-full pl-12 pr-5 py-3.5 bg-[#F9F7F4] border-none rounded-2xl focus:ring-2 focus:ring-brand-secondary text-[#3E1510] font-medium placeholder-[#A88C87]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="register-password" className="text-[10px] font-black uppercase text-[#A88C87] tracking-widest pl-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A88C87]" size={18} />
              <input 
                id="register-password"
                type="password" 
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create secure password"
                className="w-full pl-12 pr-5 py-3.5 bg-[#F9F7F4] border-none rounded-2xl focus:ring-2 focus:ring-brand-secondary text-[#3E1510] font-medium"
              />
            </div>
          </div>

          {error && (
            <p role="alert" aria-live="assertive" className="text-[10px] font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-2">
              <ShieldCheck size={14} /> {error}
            </p>
          )}

          <div className="pt-4">
            <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#3E1510] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#5C2118] transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
                {loading ? 'Creating Account...' : 'Continue to Dashboard'}
                <ArrowRight size={18} />
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-xs text-[#5C4541] font-medium">
          Already have an account? {' '}
          <button onClick={onSwitchToLogin} className="text-brand-primary font-bold hover:underline">Sign In Instead</button>
        </p>

        <div className="mt-8 pt-8 border-t border-[#F9F7F4] flex items-center justify-center gap-6">
           <div className="flex flex-col items-center gap-1">
              <ShieldCheck size={16} className="text-[#A88C87]" />
              <span className="text-[8px] font-black uppercase text-[#A88C87]">SOC2 Secure</span>
           </div>
           <div className="flex flex-col items-center gap-1">
              <CheckCircle2 size={16} className="text-[#A88C87]" />
              <span className="text-[8px] font-black uppercase text-[#A88C87]">Verified API</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
};
