import React, { useState } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface DateRange {
  startDate: string;
  endDate: string;
  label: string;
}

interface GlobalDateRangePickerProps {
  range: DateRange;
  onChange: (range: DateRange) => void;
}

const PRESETS: DateRange[] = [
  { label: 'Last 7 Days', startDate: '2026-04-18', endDate: '2026-04-25' },
  { label: 'Last 14 Days', startDate: '2026-04-11', endDate: '2026-04-25' },
  { label: 'Last 30 Days', startDate: '2026-03-26', endDate: '2026-04-25' },
  { label: 'Month to Date', startDate: '2026-04-01', endDate: '2026-04-25' },
];

export const GlobalDateRangePicker: React.FC<GlobalDateRangePickerProps> = ({ range, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#EAE3D9] rounded-xl text-sm font-bold text-[#3E1510] hover:bg-[#FDF8F3] transition-all shadow-sm active:scale-95"
      >
        <Calendar size={16} className="text-brand-primary" />
        <span className="min-w-[140px] text-left">{range.label}</span>
        <ChevronDown size={14} className={`text-[#A88C87] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full right-0 mt-2 w-56 bg-white border border-[#EAE3D9] rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      onChange(preset);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      range.label === preset.label 
                        ? 'bg-[#FDF8F3] text-[#7A2B20]' 
                        : 'text-[#5C4541] hover:bg-[#F9F7F4]'
                    }`}
                  >
                    {preset.label}
                    {range.label === preset.label && <Check size={14} />}
                  </button>
                ))}
              </div>
              <div className="p-3 bg-[#F9F7F4] border-t border-[#EAE3D9] flex justify-between items-center">
                 <span className="text-[10px] text-[#A88C87] uppercase font-black tracking-widest">Custom Range</span>
                 <button className="text-[10px] text-brand-primary font-bold hover:underline">Select Date</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
