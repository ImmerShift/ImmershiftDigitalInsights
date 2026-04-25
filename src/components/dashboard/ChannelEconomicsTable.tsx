import React from 'react';
import { PieChart } from 'lucide-react';

export interface ChannelData {
  channel: string;
  metric1: string; // e.g. Spend
  metric2: string; // e.g. Revenue
  efficiency: string; // e.g. ROAS
  share: number;
}

export interface ChannelEconomicsTableProps {
  title: string;
  data: ChannelData[];
  labels: {
    metric1: string;
    metric2: string;
    efficiency: string;
  };
}

export const ChannelEconomicsTable: React.FC<ChannelEconomicsTableProps> = ({ title, data, labels }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#EAE3D9] overflow-hidden shadow-sm">
      <div className="p-6 border-b border-[#EAE3D9] flex items-center gap-3 bg-[#FDF8F3]">
        <PieChart className="text-brand-primary" size={20} />
        <h2 className="text-xl font-bold font-serif text-[#3E1510]">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="bg-[#FDF8F3] px-6 py-4 text-xs font-bold text-[#A88C87] uppercase tracking-wider">Channel</th>
              <th className="bg-[#FDF8F3] px-6 py-4 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">{labels.metric1}</th>
              <th className="bg-[#FDF8F3] px-6 py-4 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">{labels.metric2}</th>
              <th className="bg-[#FDF8F3] px-6 py-4 text-xs font-bold text-[#A88C87] uppercase tracking-wider text-right">{labels.efficiency}</th>
              <th className="bg-[#FDF8F3] px-6 py-4 text-xs font-bold text-[#A88C87] uppercase tracking-wider w-64">Distribution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE3D9]">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-[#F9F7F4] transition-colors">
                <td className="px-6 py-5 text-sm font-bold text-[#3E1510]">
                  {item.channel}
                </td>
                <td className="px-6 py-5 text-sm font-medium text-[#5C4541] text-right">
                  {item.metric1}
                </td>
                <td className="px-6 py-5 text-sm font-medium text-brand-primary text-right">
                  {item.metric2}
                </td>
                <td className="px-6 py-5 text-sm font-bold text-[#2E6B3B] text-right">
                  <span className="bg-[#EBF4ED] px-2.5 py-1 rounded-lg">
                    {item.efficiency}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-[#EAE3D9] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-secondary rounded-full"
                        style={{ width: `${item.share}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-[#5C4541] w-10 text-right">
                      {item.share}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
