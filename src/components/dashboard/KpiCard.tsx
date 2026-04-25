import React from 'react';
import { TrendingUp, Target, Activity, Globe, Building2, MousePointerClick, Users, DollarSign } from 'lucide-react';

export interface KpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend: 'up' | 'down' | 'neutral';
  percentage: string;
  iconName: string;
}

const getIcon = (name: string) => {
  switch (name) {
    case 'trending-up': return TrendingUp;
    case 'target': return Target;
    case 'activity': return Activity;
    case 'globe': return Globe;
    case 'click': return MousePointerClick;
    case 'users': return Users;
    case 'dollar': return DollarSign;
    default: return Building2;
  }
};

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, subtitle, trend, percentage, iconName }) => {
  const Icon = getIcon(iconName);
  const isPositive = trend === 'up';
  const badgeClasses = isPositive 
    ? 'bg-[#EBF4ED] text-[#2E6B3B]' 
    : trend === 'down' 
      ? 'bg-red-50 text-red-600'
      : 'bg-gray-100 text-gray-600';

  return (
    <div className="bg-white rounded-2xl border border-[#EAE3D9] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-bold text-[#5C4541] uppercase tracking-wide pr-2">{title}</h3>
        <div className="w-10 h-10 rounded-xl bg-[#FDF8F3] text-[#A88C87] flex items-center justify-center shrink-0">
          <Icon size={20} />
        </div>
      </div>
      
      <div className="text-4xl tracking-tight font-bold text-[#3E1510] mb-4">
        {value}
      </div>
      
      <div className="flex items-center gap-2 mt-auto">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${badgeClasses}`}>
          {percentage}
        </span>
        <span className="text-xs font-medium text-[#A88C87] truncate">
          {subtitle}
        </span>
      </div>
    </div>
  );
};
