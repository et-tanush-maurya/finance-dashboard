import React from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { formatCompactNumber } from '@/utils/formatters';

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: '#F5CA23',
  },
  transactions: {
    label: 'Transactions',
    color: '#464646',
  },
};

export default function MonthlyTrendRadialChart({ data, title }) {
  const last6 = data.slice(-6).map(d => ({
    ...d,
    month: d.month.split(' ')[0],
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-[#F5CA23] p-8">
      {title && (
        <h3 className="text-base font-bold text-gray-900 mb-6">{title}</h3>
      )}
      <ChartContainer config={chartConfig} className="mx-auto w-full max-w-[400px] aspect-square">
        <RadarChart data={last6}>
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">
                      {chartConfig[name]?.label || name}
                    </span>
                    <span className="font-mono font-medium">
                      {name === 'revenue'
                        ? `AED ${formatCompactNumber(value)}`
                        : formatCompactNumber(value)
                      }
                    </span>
                  </div>
                )}
              />
            }
          />
          <PolarGrid stroke="#E5E7EB" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="month"
            tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
            tickLine={false}
          />
          <Radar
            name="revenue"
            dataKey="revenue"
            stroke="var(--color-revenue)"
            fill="var(--color-revenue)"
            fillOpacity={0.2}
            strokeWidth={2}
            dot={{ r: 4, fill: 'var(--color-revenue)', strokeWidth: 0 }}
          />
          <Radar
            name="transactions"
            dataKey="transactions"
            stroke="var(--color-transactions)"
            fill="var(--color-transactions)"
            fillOpacity={0.08}
            strokeWidth={2}
            dot={{ r: 4, fill: 'var(--color-transactions)', strokeWidth: 0 }}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </RadarChart>
      </ChartContainer>
    </div>
  );
}
