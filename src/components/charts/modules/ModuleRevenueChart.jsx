import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatCompactNumber } from '@/utils/formatters';

const MODULE_COLORS = {
  onboarding: '#2563EB',
  rekyc: '#16A34A',
  authorise: '#DC2626'
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white px-3 py-2 shadow-lg rounded-lg border border-gray-100">
        <p className="text-sm font-semibold text-gray-900">{data.displayName}</p>
        <p className="text-sm text-gray-600">Revenue: {formatCurrency(data.revenue)}</p>
        <p className="text-sm text-gray-500">Transactions: {data.transactions.toLocaleString()}</p>
        <p className="text-xs text-gray-400">{data.percentage}% of total</p>
      </div>
    );
  }
  return null;
};

export default function ModuleRevenueChart({ data, title = "Revenue by Module" }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">{title}</h3>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
              <XAxis
                type="number"
                tickFormatter={(value) => formatCompactNumber(value)}
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="displayName"
                tick={{ fill: '#374151', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={28}>
                {data.map((entry) => (
                  <Cell key={entry.module} fill={MODULE_COLORS[entry.module] || '#6B7280'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
          {data.map((item) => (
            <div key={item.module} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: MODULE_COLORS[item.module] }}
              />
              <span className="text-xs text-gray-500">{item.displayName}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
