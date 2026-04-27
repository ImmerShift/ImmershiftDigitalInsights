import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Terminal, 
  Layout, 
  ShieldCheck, 
  Landmark, 
  Sparkles,
  Command as CommandIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommandCenterProps {
  onNavigate: (view: any) => void;
  onAiAsk: (query: string) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ onNavigate, onAiAsk }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const ACTIONS = [
    { id: 'executive', label: 'Go to Executive Overview', icon: Layout, category: 'Navigation' },
    { id: 'revenue-sync', label: 'Closed-Loop Revenue Sync', icon: Landmark, category: 'Navigation' },
    { id: 'scratchpad', label: 'Insight Scratchpad', icon: Sparkles, category: 'Tools' },
    { id: 'ga4', label: 'Google Analytics 4', icon: Terminal, category: 'Platforms' },
    { id: 'meta', label: 'Meta Ads Manager', icon: Terminal, category: 'Platforms' },
  ];

  const filteredActions = ACTIONS.filter(a => 
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredActions.length > 0) {
        setSelectedIndex(prev => (prev + 1) % filteredActions.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredActions.length > 0) {
        setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredActions.length > 0) {
        handleSelect(filteredActions[selectedIndex].id);
      } else {
        onAiAsk(query);
        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (actionId: string) => {
    if (actionId) onNavigate(actionId);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#3E1510]/40 backdrop-blur-md z-[100]"
            onClick={() => setIsOpen(false)}
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#EAE3D9] z-[101] overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Command Center"
          >
            <div className="flex items-center px-6 border-b border-[#F9F7F4]">
              <Search className="text-[#A88C87]" size={20} />
              <input 
                autoFocus
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleInputKeyDown}
                placeholder="Type a command or ask a question..."
                className="w-full h-16 px-4 bg-transparent border-none focus:ring-0 text-[#3E1510] font-medium"
                role="combobox"
                aria-expanded={filteredActions.length > 0}
                aria-controls="command-options"
                aria-activedescendant={filteredActions.length > 0 ? `action-${filteredActions[selectedIndex]?.id}` : undefined}
              />
              <div className="flex items-center gap-1 px-2 py-1 bg-[#F9F7F4] rounded-lg text-[#A88C87] text-[10px] font-black uppercase">
                 <CommandIcon size={10} /> K
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2" id="command-options" role="listbox">
              {filteredActions.length > 0 ? (
                <div className="space-y-1">
                  {filteredActions.map((action, i) => (
                    <button
                      key={action.id}
                      id={`action-${action.id}`}
                      role="option"
                      aria-selected={selectedIndex === i}
                      tabIndex={-1}
                      onClick={() => handleSelect(action.id)}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${selectedIndex === i ? 'bg-[#FDF8F3] text-[#7A2B20]' : 'text-[#5C4541] hover:bg-[#F9F7F4]'}`}
                    >
                      <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-lg ${selectedIndex === i ? 'bg-white shadow-sm' : 'bg-[#F9F7F4]'}`}>
                            <action.icon size={16} />
                         </div>
                         <span className="text-sm font-bold">{action.label}</span>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#A88C87]">{action.category}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                   <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mb-3">
                      <Sparkles size={20} className="text-brand-primary" />
                   </div>
                   <p className="text-sm font-bold text-[#3E1510]">Ask AI Analyst: "{query}"</p>
                   <p className="text-xs text-[#A88C87] mt-1">Press Enter to initiate a cross-channel data synthesized answer.</p>
                   <button 
                    onClick={() => { onAiAsk(query); setIsOpen(false); }}
                    className="mt-6 px-4 py-2 bg-brand-primary text-white text-xs font-black uppercase rounded-xl hover:bg-[#5C2118] transition-colors"
                   >
                     Initiate Deep Analysis
                   </button>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#F9F7F4] border-t border-[#EAE3D9] flex justify-between items-center text-[10px] text-[#A88C87] font-bold">
               <div className="flex gap-4">
                 <span className="flex items-center gap-1 tracking-widest"><ShieldCheck size={10} /> SOC-2 Compliant</span>
                 <span className="flex items-center gap-1 tracking-widest"><Terminal size={10} /> API v4.2 Agent</span>
               </div>
               <div>
                  ESC to close
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
