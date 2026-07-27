import React from 'react';
import { Database, Link } from 'lucide-react';
import { motion } from 'motion/react';

export function EmptyStateDisplay({ platformName }: { platformName?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] border border-[#EAE3D9] p-12 shadow-sm text-center max-w-md w-full"
      >
        <div className="w-20 h-20 bg-[#FDF8F3] rounded-full flex items-center justify-center mx-auto mb-6">
          <Database size={32} className="text-[#7A2B20]" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#3E1510] mb-3">No Data Available</h2>
        <p className="text-[#5C4541] mb-8 leading-relaxed">
          It looks like there is no real-time data to display for {platformName || 'this platform'}. 
          Please connect your data source to start analyzing your metrics.
        </p>
        <button 
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#7A2B20] text-white rounded-xl font-bold text-sm shadow-md transition-transform hover:scale-105 active:scale-95"
          onClick={() => {
             // Mock action or trigger connector modal if global state allows
             alert('This would open the connector modal for ' + (platformName || 'this platform'));
          }}
        >
          <Link size={16} />
          Connect Data Source
        </button>
      </motion.div>
    </div>
  );
}
