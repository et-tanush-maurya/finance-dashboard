import React, { useState } from 'react';
import { formatCompactNumber, formatCurrency } from '@/utils/formatters';

const SECTOR_COLORS = [
  { ring: '#F5CA23', track: '#F5CA23' },
  { ring: '#F6AB29', track: '#F6AB29' },
  { ring: '#464646', track: '#464646' },
  { ring: '#CBBE9E', track: '#CBBE9E' },
  { ring: '#A99D7F', track: '#A99D7F' },
];

export default function SectorRadialChart({ data, title, subtitle }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const maxRevenue = Math.max(...data.map(d => d.totalRevenue));

  const size = 280;
  const center = size / 2;
  const ringWidth = 14;
  const ringGap = 5;
  const startAngle = -225;
  const sweepRange = 270;

  const rings = data
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .map((sector, i) => {
      const radius = center - 14 - i * (ringWidth + ringGap);
      const percentage = sector.totalRevenue / maxRevenue;
      const sweep = percentage * sweepRange;

      return {
        ...sector,
        radius,
        percentage,
        sweep,
        color: SECTOR_COLORS[i % SECTOR_COLORS.length],
        index: i,
      };
    });

  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const describeArc = (cx, cy, r, startDeg, endDeg) => {
    const start = polarToCartesian(cx, cy, r, endDeg);
    const end = polarToCartesian(cx, cy, r, startDeg);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  };

  const hoveredSector = hoveredIndex !== null ? rings[hoveredIndex] : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-[#F5CA23] p-8">
      {title && (
        <div className="mb-6">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Radial Chart */}
        <div className="relative flex-shrink-0">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {rings.map((ring) => (
              <g key={ring.sector}>
                {/* Background track */}
                <path
                  d={describeArc(center, center, ring.radius, startAngle, startAngle + sweepRange)}
                  fill="none"
                  stroke={ring.color.track}
                  strokeWidth={ringWidth}
                  strokeLinecap="round"
                  opacity={0.12}
                />
                {/* Filled arc */}
                <path
                  d={describeArc(center, center, ring.radius, startAngle, startAngle + ring.sweep)}
                  fill="none"
                  stroke={ring.color.ring}
                  strokeWidth={ringWidth}
                  strokeLinecap="round"
                  opacity={hoveredIndex === null || hoveredIndex === ring.index ? 1 : 0.3}
                  className="transition-opacity duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(ring.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            ))}

          </svg>

          {/* Center text overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-full w-[90px] h-[90px] shadow-sm flex flex-col items-center justify-center">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                {hoveredSector ? hoveredSector.sector : 'Total'}
              </span>
              <span className="text-base font-bold text-[#464646] leading-tight mt-0.5">
                {hoveredSector
                  ? formatCompactNumber(hoveredSector.totalRevenue)
                  : formatCompactNumber(data.reduce((s, d) => s + d.totalRevenue, 0))
                }
              </span>
              <span className="text-[9px] text-gray-400">AED</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-3">
          {rings.map((ring) => (
            <div
              key={ring.sector}
              className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                hoveredIndex === ring.index
                  ? 'bg-gray-50 shadow-sm'
                  : 'hover:bg-gray-50/50'
              }`}
              onMouseEnter={() => setHoveredIndex(ring.index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: ring.color.ring }}
                />
                <div>
                  <p className="text-sm font-semibold text-[#464646]">{ring.sector}</p>
                  <p className="text-xs text-gray-400">
                    {ring.clientCount} clients · {formatCompactNumber(ring.totalTransactions)} txns
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#464646]">
                  AED {formatCompactNumber(ring.totalRevenue)}
                </p>
                <p className="text-xs text-gray-400">
                  {Math.round(ring.percentage * 100)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
