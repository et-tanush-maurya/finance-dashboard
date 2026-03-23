import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import KElement from '../../assets/UAEKYC LOGO Element.svg';

export default function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon: Icon,
  variant = 'default',
  className = ''
}) {
  const isPositive = trend === 'up';

  const variantStyles = {
    default: 'border-gray-100',
    warning: 'border-amber-200 bg-amber-50/30',
    success: 'border-green-200 bg-green-50/30',
    danger: 'border-red-200 bg-red-50/30'
  };

  return (
    <div className={`group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 border-l-[#F5CA23] border border-gray-100 min-h-[160px] overflow-hidden ${variantStyles[variant]} ${className}`}>
      <img
        src={KElement}
        alt=""
        aria-hidden="true"
        className="absolute -bottom-4 -right-3 w-24 h-auto opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-300 pointer-events-none select-none"
      />
      <div className="relative flex items-start justify-between gap-4 h-full">
        <div className="flex-1 min-w-0 flex flex-col">
          <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-3">
            {title}
          </p>
          <p className="text-2xl xl:text-3xl font-bold text-black tracking-tight break-words">
            {value}
          </p>
          {subtitle && (
            <p className="mt-2 text-xs text-gray-500 truncate">{subtitle}</p>
          )}
          {trendValue && (
            <div className="mt-auto pt-3 flex items-center gap-2 flex-wrap">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-50' : 'bg-red-50'}`}>
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span className={`text-xs font-bold ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                  {trendValue}
                </span>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">vs last period</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="flex-shrink-0 p-3 bg-gradient-to-br from-[#F5CA23]/10 to-[#F6AB29]/15 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-5 h-5 text-[#464646]" strokeWidth={1.5} />
          </div>
        )}
      </div>
    </div>
  );
}