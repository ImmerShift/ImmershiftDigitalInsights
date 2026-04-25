import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export interface ChartData {
  date: string;
  primary: number;
  secondary: number;
}

export interface PacingChartProps {
  title: string;
  data: any[];
  primaryKey: string;
  secondaryKey: string;
  primaryLabel: string;
  secondaryLabel: string;
  formatPrimary?: (val: any) => string;
  formatSecondary?: (val: any) => string;
}

const CustomTooltip = ({ active, payload, label, primaryLabel, secondaryLabel, primaryKey, secondaryKey }: any) => {
  if (active && payload && payload.length) {
    const primary = payload.find((p: any) => p.dataKey === primaryKey || p.name === primaryLabel)?.value;
    const secondary = payload.find((p: any) => p.dataKey === secondaryKey || p.name === secondaryLabel)?.value;

    return (
      <div className="bg-white border border-[#EAE3D9] p-4 shadow-lg rounded-xl min-w-[200px]">
        <p className="font-bold text-[#3E1510] mb-3 border-b border-[#EAE3D9] pb-2">{label}</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-[#7A2B20] flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#7A2B20]"></div>
              {primaryLabel}
            </span>
            <span className="font-bold text-[#3E1510]">{primary}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-[#DDA77B] flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#DDA77B]"></div>
              {secondaryLabel}
            </span>
            <span className="font-bold text-[#3E1510]">{secondary}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const PacingChart: React.FC<PacingChartProps> = ({ 
  title, data, primaryKey, secondaryKey, primaryLabel, secondaryLabel, formatPrimary, formatSecondary 
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#EAE3D9] p-6 lg:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold font-serif text-[#3E1510]">{title}</h2>
        <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-1.5 text-[#7A2B20]">
                <div className="w-3 h-3 rounded-full bg-[#7A2B20]"></div>
                {primaryLabel}
            </div>
            <div className="flex items-center gap-1.5 text-[#DDA77B]">
                <div className="w-3 h-3 rounded-md bg-[#DDA77B] opacity-40"></div>
                {secondaryLabel}
            </div>
        </div>
      </div>
      
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAE3D9" />
            <XAxis 
              dataKey="date" 
              stroke="#A88C87" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12, fill: '#A88C87', fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              yAxisId="left" 
              stroke="#A88C87" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#A88C87', fontWeight: 500 }}
              tickFormatter={formatPrimary || ((val) => val)}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#A88C87" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#A88C87', fontWeight: 500 }}
              tickFormatter={formatSecondary || ((val) => val)}
            />
            <Tooltip 
              content={(props) => (
                <CustomTooltip 
                  {...props} 
                  primaryLabel={primaryLabel} 
                  secondaryLabel={secondaryLabel} 
                  primaryKey={primaryKey}
                  secondaryKey={secondaryKey}
                />
              )} 
              cursor={{ fill: '#F9F7F4' }} 
            />
            <Bar 
              yAxisId="right"
              dataKey={secondaryKey} 
              name={secondaryLabel}
              fill="#DDA77B" 
              fillOpacity={0.4}
              radius={[4, 4, 0, 0]}
              barSize={32}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey={primaryKey} 
              name={primaryLabel}
              stroke="#7A2B20" 
              strokeWidth={4} 
              dot={false}
              activeDot={{ r: 6, fill: '#7A2B20', stroke: '#fff', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
