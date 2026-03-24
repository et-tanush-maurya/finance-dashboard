import React, { useState } from 'react';
import { formatCompactNumber, formatNumber } from '../utils/formatters';

const RING_COLORS = [
  { stroke: '#F5CA23', bg: '#F5CA23' },
  { stroke: '#464646', bg: '#464646' },
  { stroke: '#F6AB29', bg: '#F6AB29' },
];

export default function ModuleRingsChart({ data, title }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const maxTransactions = Math.max(...data.map(d => d.transactionCount));

  const size = 220;
  const center = size / 2;
  const ringWidth = 18;
  const ringGap = 8;

  const rings = data.slice(0, 3).map((mod, i) => {
    const radius = (size / 2) - 16 - i * (ringWidth + ringGap);
    const percentage = mod.transactionCount / maxTransactions;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - percentage);

    return {
      ...mod,
      radius,
      percentage,
      circumference,
      offset,
      color: RING_COLORS[i % RING_COLORS.length],
      index: i,
    };
  });

  const totalTransactions = data.reduce((sum, d) => sum + d.transactionCount, 0);
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-[#F5CA23] p-8">
      {title && (
        <h3 className="text-base font-bold text-gray-900 mb-6">{title}</h3>
      )}

      <div className="flex flex-col items-center gap-6">
        {/* Rings */}
        <div className="relative">
          <svg width={size} height={size} className="transform -rotate-90">
            {rings.map((ring) => (
              <g key={ring.module}>
                {/* Background track */}
                <circle
                  cx={center}
                  cy={center}
                  r={ring.radius}
                  fill="none"
                  stroke={ring.color.bg}
                  strokeWidth={ringWidth}
                  opacity={0.1}
                />
                {/* Progress arc */}
                <circle
                  cx={center}
                  cy={center}
                  r={ring.radius}
                  fill="none"
                  stroke={ring.color.stroke}
                  strokeWidth={ringWidth}
                  strokeDasharray={ring.circumference}
                  strokeDashoffset={ring.offset}
                  strokeLinecap="round"
                  opacity={hoveredIndex === null || hoveredIndex === ring.index ? 1 : 0.25}
                  className="transition-all duration-500 ease-out cursor-pointer"
                  style={{
                    filter: hoveredIndex === ring.index ? `drop-shadow(0 0 6px ${ring.color.stroke}40)` : 'none',
                  }}
                  onMouseEnter={() => setHoveredIndex(ring.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            ))}
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {hoveredIndex !== null ? (
                <>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                    {rings[hoveredIndex].displayName}
                  </p>
                  <p className="text-lg font-bold text-[#464646] leading-tight mt-0.5">
                    {Math.round(rings[hoveredIndex].percentage * 100)}%
                  </p>
                  <p className="text-[9px] text-gray-400">
                    {formatCompactNumber(rings[hoveredIndex].transactionCount)} txns
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Total</p>
                  <p className="text-lg font-bold text-[#464646] leading-tight mt-0.5">
                    {formatCompactNumber(totalTransactions)}
                  </p>
                  <p className="text-[9px] text-gray-400">transactions</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Legend cards */}
        <div className="w-full space-y-2">
          {rings.map((ring) => {
            const isHovered = hoveredIndex === ring.index;
            return (
              <div
                key={ring.module}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  isHovered ? 'bg-gray-50 shadow-sm scale-[1.01]' : 'hover:bg-gray-50/50'
                }`}
                onMouseEnter={() => setHoveredIndex(ring.index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Color indicator */}
                <div className="relative flex-shrink-0">
                  <svg width="36" height="36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke={ring.color.bg} strokeWidth="4" opacity={0.15} />
                    <circle
                      cx="18" cy="18" r="14" fill="none"
                      stroke={ring.color.stroke} strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 14}`}
                      strokeDashoffset={`${2 * Math.PI * 14 * (1 - ring.percentage)}`}
                      strokeLinecap="round"
                      className="transform -rotate-90 origin-center"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-[#464646]">
                    {Math.round(ring.percentage * 100)}%
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#464646]">{ring.displayName}</p>
                  <p className="text-xs text-gray-400">
                    {formatNumber(ring.transactionCount)} txns
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-[#464646]">
                    AED {formatCompactNumber(ring.revenue)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {ring.percentage ? `${((ring.revenue / totalRevenue) * 100).toFixed(0)}%` : '0%'} rev
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
