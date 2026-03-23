import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatCompactNumber } from '../utils/formatters';

const COLORS = ['#111827', '#9CA3AF'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white px-3 py-2 shadow-lg rounded-lg border border-gray-100">
        <p className="text-sm font-semibold text-gray-900">{data.name}</p>
        <p className="text-sm text-gray-600">{formatCurrency(data.value)}</p>
        <p className="text-xs text-gray-400">{data.percentage}%</p>
      </div>
    );
  }
  return null;
};

export default function SplitDonutChart({ icpRevenue, dalilRevenue, title = "Revenue Split" }) {
  const total = icpRevenue + dalilRevenue;
  const icpPercentage = ((icpRevenue / total) * 100).toFixed(0);
  const dalilPercentage = ((dalilRevenue / total) * 100).toFixed(0);

  const data = [
    { name: 'ICP', value: icpRevenue, percentage: icpPercentage },
    { name: 'Dalil', value: dalilRevenue, percentage: dalilPercentage }
  ];

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">{title}</h3>

        <div className="flex items-center gap-6">
          <div className="relative w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-gray-400">Total</span>
              <span className="text-sm font-bold text-gray-900">{formatCompactNumber(total)}</span>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{formatCompactNumber(item.value)}</p>
                  <p className="text-xs text-gray-400">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
