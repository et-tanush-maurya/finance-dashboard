import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { formatCurrency, formatCompactNumber } from '@/utils/formatters';

export default function MonthComparisonWidget({ data, title = "Month over Month", subtitle }) {
  const revenueUp = data.revenueChange >= 0;
  const transactionsUp = data.transactionChange >= 0;

  return (
    <Card className="border-0 shadow-sm border-t-4 border-t-[#F5CA23]">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center justify-center gap-2 mb-6 text-sm text-gray-500">
          <span className="font-medium text-gray-700">{data.previousMonth}</span>
          <ArrowRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">{data.currentMonth}</span>
        </div>

        <div className="space-y-4">
          {/* Revenue Comparison */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Revenue</span>
              <div className={`flex items-center gap-1 text-sm font-semibold ${revenueUp ? 'text-green-600' : 'text-red-600'}`}>
                {revenueUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {revenueUp ? '+' : ''}{data.revenueChange}%
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-400">Previous</p>
                <p className="text-lg font-semibold text-gray-600">{formatCompactNumber(data.previousRevenue)}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 mb-1" />
              <div className="text-right">
                <p className="text-xs text-gray-400">Current</p>
                <p className="text-lg font-bold text-gray-900">{formatCompactNumber(data.currentRevenue)}</p>
              </div>
            </div>
          </div>

          {/* Transactions Comparison */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Transactions</span>
              <div className={`flex items-center gap-1 text-sm font-semibold ${transactionsUp ? 'text-green-600' : 'text-red-600'}`}>
                {transactionsUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {transactionsUp ? '+' : ''}{data.transactionChange}%
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-400">Previous</p>
                <p className="text-lg font-semibold text-gray-600">{formatCompactNumber(data.previousTransactions)}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 mb-1" />
              <div className="text-right">
                <p className="text-xs text-gray-400">Current</p>
                <p className="text-lg font-bold text-gray-900">{formatCompactNumber(data.currentTransactions)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
