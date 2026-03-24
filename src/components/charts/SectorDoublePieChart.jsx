import React, { useState } from 'react';
import { Pie, PieChart, Label, Sector } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { formatCompactNumber } from '../utils/formatters';

const COLORS = ['#F5CA23', '#F6AB29', '#464646', '#CBBE9E', '#A99D7F'];

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 9}
        outerRadius={outerRadius + 12}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.4}
      />
    </g>
  );
};

export default function SectorDoublePieChart({ data, title }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const totalRevenue = data.reduce((sum, d) => sum + d.totalRevenue, 0);
  const totalClients = data.reduce((sum, d) => sum + d.clientCount, 0);

  // Build chart config for shadcn
  const chartConfig = {};
  data.forEach((d, i) => {
    chartConfig[d.sector] = {
      label: d.sector,
      color: COLORS[i % COLORS.length],
    };
  });

  const revenueData = data.map((d, i) => ({
    name: d.sector,
    value: d.totalRevenue,
    fill: COLORS[i % COLORS.length],
  }));

  const clientData = data.map((d, i) => ({
    name: d.sector,
    value: d.clientCount,
    fill: COLORS[i % COLORS.length],
  }));

  const hoveredSector = activeIndex !== null ? data[activeIndex] : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-[#F5CA23] p-8">
      {title && (
        <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
      )}
      <p className="text-xs text-gray-400 mb-6">
        Outer ring: Revenue &middot; Inner ring: Clients
      </p>

      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Chart */}
        <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[300px]">
          <PieChart>
            {/* Outer ring — Revenue */}
            <Pie
              data={revenueData}
              cx="50%"
              cy="50%"
              outerRadius={130}
              innerRadius={95}
              dataKey="value"
              nameKey="name"
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              paddingAngle={2}
              strokeWidth={0}
            />

            {/* Inner ring — Clients */}
            <Pie
              data={clientData}
              cx="50%"
              cy="50%"
              outerRadius={82}
              innerRadius={55}
              dataKey="value"
              nameKey="name"
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              paddingAngle={3}
              strokeWidth={0}
              opacity={0.65}
            />

            {/* Center label */}
            <Pie
              data={[{ value: 1 }]}
              cx="50%"
              cy="50%"
              outerRadius={50}
              innerRadius={0}
              dataKey="value"
              fill="transparent"
              strokeWidth={0}
              isAnimationActive={false}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy - 12}
                          className="fill-gray-400 text-[10px] font-semibold uppercase"
                        >
                          {hoveredSector ? hoveredSector.sector : 'Total'}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy + 6}
                          className="fill-[#464646] text-base font-bold"
                        >
                          {hoveredSector
                            ? formatCompactNumber(hoveredSector.totalRevenue)
                            : formatCompactNumber(totalRevenue)
                          }
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy + 22}
                          className="fill-gray-400 text-[9px]"
                        >
                          {hoveredSector
                            ? `${hoveredSector.clientCount} clients`
                            : `${totalClients} clients`
                          }
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>

            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, item) => (
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">{name}</span>
                      <span className="font-mono font-medium">
                        {item.payload.value > 100
                          ? `AED ${formatCompactNumber(value)}`
                          : value
                        }
                      </span>
                    </div>
                  )}
                />
              }
            />
          </PieChart>
        </ChartContainer>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2.5">
          {data.map((sector, i) => {
            const revenuePercent = Math.round((sector.totalRevenue / totalRevenue) * 100);
            const isHovered = activeIndex === i;

            return (
              <div
                key={sector.sector}
                className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  isHovered ? 'bg-gray-50 shadow-sm' : 'hover:bg-gray-50/50'
                }`}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#464646]">{sector.sector}</p>
                    <p className="text-xs text-gray-400">
                      {sector.clientCount} clients &middot; {formatCompactNumber(sector.totalTransactions)} txns
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#464646]">
                    AED {formatCompactNumber(sector.totalRevenue)}
                  </p>
                  <p className="text-xs text-gray-400">{revenuePercent}% of revenue</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
