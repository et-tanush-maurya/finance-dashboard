import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { formatCompactNumber, formatCurrency } from '@/utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    return (
      <div className="bg-white border border-gray-200 p-3 shadow-lg rounded-lg min-w-[180px]">
        <p className="text-sm font-medium text-gray-900 mb-2 pb-2 border-b border-gray-100">{data?.date}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2563EB' }} />
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-700">Onboarding</p>
              <p className="text-xs text-gray-500">
                Txn: <span className="font-medium text-gray-700">{formatCompactNumber(data?.onboarding)}</span>
                {' • '}
                Rev: <span className="font-medium text-gray-700">{formatCurrency(data?.onboardingRevenue)}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#16A34A' }} />
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-700">Rekyc</p>
              <p className="text-xs text-gray-500">
                Txn: <span className="font-medium text-gray-700">{formatCompactNumber(data?.rekyc)}</span>
                {' • '}
                Rev: <span className="font-medium text-gray-700">{formatCurrency(data?.rekycRevenue)}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#DC2626' }} />
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-700">Authorise</p>
              <p className="text-xs text-gray-500">
                Txn: <span className="font-medium text-gray-700">{formatCompactNumber(data?.authorise)}</span>
                {' • '}
                Rev: <span className="font-medium text-gray-700">{formatCurrency(data?.authoriseRevenue)}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Total Revenue: <span className="font-semibold text-gray-900">{formatCurrency(data?.totalRevenue)}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const MODULE_COLORS = {
  onboarding: '#2563EB',  // Blue
  rekyc: '#16A34A',       // Green
  authorise: '#DC2626'    // Red
};

const CustomXAxisTick = ({ x, y, payload, data }) => {
  const dayData = data?.find(d => d.date === payload.value);
  const revenue = dayData?.totalRevenue || 0;

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={12} textAnchor="middle" fill="#666" fontSize={9}>
        {payload.value}
      </text>
      <text x={0} y={0} dy={24} textAnchor="middle" fill="#9CA3AF" fontSize={8}>
        {formatCompactNumber(revenue)}
      </text>
    </g>
  );
};

export default function DailyModuleChart({ data, title }) {
  return (
    <div className="bg-white rounded-lg">
      {title && (
        <h3 className="text-xs font-medium text-gray-500 uppercase mb-4">
          {title}
        </h3>
      )}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={<CustomXAxisTick data={data} />}
              interval={0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 10 }}
              tickFormatter={formatCompactNumber}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
            />
            <Line
              type="monotone"
              dataKey="onboarding"
              name="Onboarding"
              stroke={MODULE_COLORS.onboarding}
              strokeWidth={2}
              dot={{ fill: MODULE_COLORS.onboarding, strokeWidth: 0, r: 2 }}
              activeDot={{ r: 4, fill: MODULE_COLORS.onboarding }}
            />
            <Line
              type="monotone"
              dataKey="rekyc"
              name="Rekyc"
              stroke={MODULE_COLORS.rekyc}
              strokeWidth={2}
              dot={{ fill: MODULE_COLORS.rekyc, strokeWidth: 0, r: 2 }}
              activeDot={{ r: 4, fill: MODULE_COLORS.rekyc }}
            />
            <Line
              type="monotone"
              dataKey="authorise"
              name="Authorise"
              stroke={MODULE_COLORS.authorise}
              strokeWidth={2}
              dot={{ fill: MODULE_COLORS.authorise, strokeWidth: 0, r: 2 }}
              activeDot={{ r: 4, fill: MODULE_COLORS.authorise }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
