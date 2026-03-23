import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCompactNumber } from '../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 p-3 shadow-lg">
        <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm text-gray-600">
            {entry.name}: <span className="font-medium">{formatCompactNumber(entry.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueLineChart({ data, dataKey = 'revenue', title }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      {title && (
        <h3 className="text-base font-bold text-gray-900 mb-6">
          {title}
        </h3>
      )}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
            <XAxis 
              dataKey="month" 
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
            <Line
              type="monotone"
              dataKey={dataKey}
              name="Revenue"
              stroke="#4A90A4"
              strokeWidth={2}
              dot={{ fill: '#4A90A4', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: '#4A90A4' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}