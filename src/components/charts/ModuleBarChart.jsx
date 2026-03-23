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
import { formatCompactNumber, formatNumber } from '../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 p-3 shadow-lg">
        <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
        <p className="text-sm text-gray-600">
          Transactions: <span className="font-medium">{formatNumber(payload[0].value)}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function ModuleBarChart({ data, title }) {
  const chartData = data.slice(0, 10).map(d => ({
    ...d,
    name: d.displayName.length > 15 ? d.displayName.slice(0, 12) + '...' : d.displayName
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-[#F5CA23] p-8">
      {title && (
        <h3 className="text-base font-bold text-gray-900 mb-6">
          {title}
        </h3>
      )}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            layout="vertical"
            margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" horizontal={true} vertical={false} />
            <XAxis 
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 11 }}
              tickFormatter={formatCompactNumber}
            />
            <YAxis 
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 11 }}
              width={75}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="transactionCount" 
              fill="#4A90A4" 
              radius={[0, 2, 2, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}