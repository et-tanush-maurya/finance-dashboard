import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { formatCompactNumber } from '@/utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 shadow-lg rounded-lg border border-gray-100">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-semibold text-gray-900">
          {payload[0].value.toLocaleString()} transactions
        </p>
        <p className="text-xs text-gray-500">
          {formatCompactNumber(payload[1]?.value || 0)} revenue
        </p>
      </div>
    );
  }
  return null;
};

export default function TransactionVolumeChart({ data, title = "Weekly Transaction Volume", subtitle }) {
  return (
    <Card className="border-0 shadow-sm border-t-4 border-t-[#F5CA23]">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="transactionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F5CA23" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#F5CA23" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="weekLabel"
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={1}
              />
              <YAxis
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => formatCompactNumber(value)}
                width={45}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="transactions"
                stroke="#F5CA23"
                strokeWidth={2}
                fill="url(#transactionGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-sm">
          <div className="text-gray-500">
            Total: <span className="font-semibold text-gray-900">
              {data.reduce((sum, d) => sum + d.transactions, 0).toLocaleString()}
            </span>
          </div>
          <div className="text-gray-500">
            Avg/week: <span className="font-semibold text-gray-900">
              {Math.round(data.reduce((sum, d) => sum + d.transactions, 0) / data.length).toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
