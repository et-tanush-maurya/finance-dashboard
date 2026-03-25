import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { formatCompactNumber } from '@/utils/formatters';

const SECTOR_COLORS = {
  Banking: '#F5CA23',
  Insurance: '#F6AB29',
  Fintech: '#464646',
  Government: '#CBBE9E',
  Healthcare: '#A99D7F',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 shadow-lg rounded-xl border border-gray-100">
        <p className="text-xs font-semibold text-gray-900 mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-gray-500">{entry.name}</span>
              </div>
              <span className="text-xs font-semibold text-gray-900">
                {formatCompactNumber(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function ModuleBarChart({ data, sectors, title, subtitle, children }) {
  return (
    <Card className="border-0 shadow-sm border-t-4 border-t-[#F5CA23]">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              barCategoryGap="20%"
              barGap={2}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="displayName"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => formatCompactNumber(value)}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                iconType="circle"
                iconSize={8}
              />
              {sectors.map((sector) => (
                <Bar
                  key={sector}
                  dataKey={sector}
                  name={sector}
                  fill={SECTOR_COLORS[sector] || '#9CA3AF'}
                  radius={[3, 3, 0, 0]}
                  maxBarSize={24}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {children}
      </CardContent>
    </Card>
  );
}
