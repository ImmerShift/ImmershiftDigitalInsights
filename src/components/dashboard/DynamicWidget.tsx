import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts';
import { motion } from 'motion/react';
import { Sparkles, Info } from 'lucide-react';
import { WidgetSchema } from '../../lib/gemini';

interface DynamicWidgetProps {
  schema: WidgetSchema;
}

export const DynamicWidget: React.FC<DynamicWidgetProps> = ({ schema }) => {
  const { type, title, dataKeys, colorPalette, insight, data } = schema;

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAE3D9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#A88C87' }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#A88C87' }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: '1px solid #EAE3D9', fontSize: '12px' }}
            />
            {dataKeys.map((key, idx) => (
              <Bar 
                key={key} 
                dataKey={key} 
                fill={colorPalette[idx % colorPalette.length]} 
                radius={[4, 4, 0, 0]} 
              />
            ))}
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAE3D9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#A88C87' }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#A88C87' }} 
            />
            <Tooltip 
               contentStyle={{ borderRadius: '12px', border: '1px solid #EAE3D9', fontSize: '12px' }}
            />
            {dataKeys.map((key, idx) => (
              <Line 
                key={key} 
                type="monotone" 
                dataKey={key} 
                stroke={colorPalette[idx % colorPalette.length]} 
                strokeWidth={3} 
                dot={{ r: 4 }} 
              />
            ))}
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colorPalette[index % colorPalette.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        );
      case 'kpi':
        return (
          <div className="h-full flex flex-col justify-center items-center text-center">
             <p className="text-[10px] font-black uppercase text-[#A88C87] tracking-widest mb-2">{dataKeys[0] || 'Metric'}</p>
             <p className="text-4xl font-serif font-black text-[#3E1510]">{data[0]?.value || '0'}</p>
             {data[0]?.subtext && (
               <p className="text-xs text-[#5C4541] mt-2 font-medium">{data[0].subtext}</p>
             )}
          </div>
        );
      default:
        return <div className="h-full flex items-center justify-center text-[#A88C87]">Unsupported Widget Type</div>;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl border border-[#EAE3D9] p-6 lg:p-8 shadow-sm flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold font-serif text-[#3E1510]">{title}</h2>
          <div className="flex items-center gap-1.5 mt-1">
             <Sparkles size={12} className="text-brand-secondary" />
             <span className="text-[10px] font-black uppercase tracking-tighter text-brand-secondary">AI Generated</span>
          </div>
        </div>
        <div className="p-2 hover:bg-[#F9F7F4] rounded-full text-[#EAE3D9] transition-colors cursor-help group relative">
          <Info size={16} />
          <div className="absolute right-0 top-full mt-2 w-48 p-3 bg-[#3E1510] text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-xl leading-relaxed">
            This widget was dynamically synthesized from your natural language request using the latest enterprise performance model.
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[200px]">
        {type !== 'kpi' ? (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        ) : (
          renderChart()
        )}
      </div>

      {insight && (
        <div className="mt-6 pt-6 border-t border-[#F9F7F4]">
          <p className="text-xs text-[#5C4541] leading-relaxed italic border-l-2 border-brand-primary pl-4">
            {insight}
          </p>
        </div>
      )}
    </motion.div>
  );
};
