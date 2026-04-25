import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Github, Chrome, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: (email: string, pass: string) => Promise<void>;
  onSwitchToRegister: () => void;
  onGoogleLogin: () => Promise<void>;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister, onGoogleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
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
        <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary" />
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#7A2B20] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
             <div className="w-8 h-8 border-4 border-white rounded-md" />
          </div>
          <h1 className="text-3xl font-serif font-black text-[#3E1510]">Welcome Back</h1>
          <p className="text-[#5C4541] mt-2">Log in to your Digital Command Center.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-[#A88C87] tracking-widest pl-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A88C87]" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="CEO@youragency.com"
                className="w-full pl-12 pr-5 py-4 bg-[#F9F7F4] border-none rounded-2xl focus:ring-2 focus:ring-brand-primary text-[#3E1510] font-medium placeholder-[#A88C87]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
               <label className="text-[10px] font-black uppercase text-[#A88C87] tracking-widest">Password</label>
               <button type="button" className="text-[10px] font-black uppercase text-brand-primary hover:underline">Forgot?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A88C87]" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-5 py-4 bg-[#F9F7F4] border-none rounded-2xl focus:ring-2 focus:ring-brand-primary text-[#3E1510] font-medium"
              />
            </div>
          </div>

          {error && (
            <p className="text-[10px] font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-2">
              <ShieldCheck size={14} /> {error}
            </p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#3E1510] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#5C2118] transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 relative">
           <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#EAE3D9]"></div>
           </div>
           <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
              <span className="bg-white px-4 text-[#A88C87]">Or Continue With</span>
           </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
           <button 
            onClick={onGoogleLogin}
            className="flex items-center justify-center gap-2 py-3 bg-white border border-[#EAE3D9] rounded-xl text-xs font-bold text-[#5C4541] hover:bg-[#F9F7F4] transition-colors"
           >
             <Chrome size={16} className="text-blue-500" /> Google
           </button>
           <button className="flex items-center justify-center gap-2 py-3 bg-white border border-[#EAE3D9] rounded-xl text-xs font-bold text-[#5C4541] hover:bg-[#F9F7F4] transition-colors">
             <Github size={16} /> GitHub
           </button>
        </div>

        <p className="mt-10 text-center text-xs text-[#5C4541] font-medium">
          New to ImmerShift? {' '}
          <button onClick={onSwitchToRegister} className="text-brand-primary font-bold hover:underline">Create Agency Account</button>
        </p>
      </motion.div>
    </div>
  );
};
