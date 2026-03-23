import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 shadow-lg rounded-lg border border-gray-100">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-sm text-gray-900">
          <span className="font-semibold">{payload[0]?.value}</span> total clients
        </p>
        <p className="text-sm text-green-600">
          +{payload[1]?.value} new clients
        </p>
      </div>
    );
  }
  return null;
};

export default function ClientGrowthChart({ data, title = "Client Growth" }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">{title}</h3>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={35}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={25}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                yAxisId="right"
                dataKey="newClients"
                fill="#22C55E"
                radius={[4, 4, 0, 0]}
                barSize={20}
                opacity={0.7}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="totalClients"
                stroke="#111827"
                strokeWidth={2}
                dot={{ fill: '#111827', r: 3 }}
                activeDot={{ r: 5, fill: '#111827' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-gray-900 rounded" />
            <span className="text-xs text-gray-500">Total Clients</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded opacity-70" />
            <span className="text-xs text-gray-500">New Clients</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
