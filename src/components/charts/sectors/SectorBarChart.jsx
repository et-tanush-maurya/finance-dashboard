import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCompactNumber } from '@/utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 p-3 shadow-lg">
        <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm text-gray-600">
            Revenue: <span className="font-medium">AED {formatCompactNumber(entry.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SectorBarChart({ data, title }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-[#F5CA23] p-8">
      {title && (
        <h3 className="text-base font-bold text-gray-900 mb-6">
          {title}
        </h3>
      )}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
            <XAxis 
              dataKey="sector" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 11 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 11 }}
              tickFormatter={formatCompactNumber}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="totalRevenue" 
              fill="#5BA88A" 
              radius={[2, 2, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}