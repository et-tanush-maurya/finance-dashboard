import React, { useState, useMemo, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Building2,
  Activity,
  Wallet,
  TrendingUp,
  DollarSign,
  RefreshCw,
  RotateCcw,
  Calendar as CalendarIcon
} from 'lucide-react';
import { subDays, startOfMonth, subMonths, endOfMonth, format } from 'date-fns';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import DataTable from '@/components/common/DataTable';
import StatCard from '@/components/common/StatCard';
import {
  CLIENTS,
  MODULES,
  generateClientModuleData,
  generateTransactionHistory,
} from '@/data/mockData';
import {
  formatCurrency,
  formatNumber,
  formatCompactNumber,
  formatDate,
  formatSplitRatio,
  exportToCSV
} from '@/utils/formatters';
import { useSplitRatio } from '@/contexts/SplitRatioContext';

const DATE_FILTERS = [
  { label: '7 Days', value: '7d' },
  { label: '15 Days', value: '15d' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'Custom', value: 'custom' },
];

const radarChartConfig = {
  revenue: { label: 'Revenue', color: '#F5CA23' },
  transactions: { label: 'Transactions', color: '#464646' },
};

export default function ClientProfile() {
  const { clientId } = useParams();

  const [dateFilter, setDateFilter] = useState('last_month');
  const [customRange, setCustomRange] = useState({ from: undefined, to: undefined });
  const [calendarOpen, setCalendarOpen] = useState(false);

  const { activeSplit } = useSplitRatio();
  const client = CLIENTS.find(c => c.id === clientId);

  const clientShares = useMemo(() => {
    if (!client) return { icpShare: 0, dalilShare: 0 };
    const icpShare = Math.round((client.revenue * (activeSplit.icp / 100)) * 100) / 100;
    const dalilShare = Math.round((client.revenue - icpShare) * 100) / 100;
    return { icpShare, dalilShare };
  }, [client, activeSplit.icp, activeSplit.dalil]);

  const moduleData = useMemo(() => client ? generateClientModuleData(clientId) : [], [clientId]);
  const transactionHistory = useMemo(() => client ? generateTransactionHistory(clientId) : [], [clientId]);

  const handleDateFilterChange = useCallback((value) => {
    setDateFilter(value);
    if (value === 'custom') {
      setCalendarOpen(true);
    }
  }, []);

  const handleReset = useCallback(() => {
    setDateFilter('last_month');
    setCustomRange({ from: undefined, to: undefined });
    setCalendarOpen(false);
  }, []);

  const getFilterDisplayText = () => {
    if (dateFilter === 'custom' && customRange?.from) {
      if (customRange.to) {
        return `${format(customRange.from, 'MMM dd')} - ${format(customRange.to, 'MMM dd')}`;
      }
      return format(customRange.from, 'MMM dd, yyyy');
    }
    return null;
  };

  // Compute the active date range from the filter selection
  const activeDateRange = useMemo(() => {
    const now = new Date();
    switch (dateFilter) {
      case '7d':
        return { from: subDays(now, 7), to: now };
      case '15d':
        return { from: subDays(now, 15), to: now };
      case 'last_month':
        return { from: startOfMonth(subMonths(now, 1)), to: endOfMonth(subMonths(now, 1)) };
      case 'custom':
        return { from: customRange?.from || null, to: customRange?.to || null };
      default:
        return { from: null, to: null };
    }
  }, [dateFilter, customRange]);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-gray-500 mb-4">Client not found</p>
        <Link to="/finance/clients">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Clients
          </Button>
        </Link>
      </div>
    );
  }

  // Aggregate transaction history: one row per month
  const monthlyRows = useMemo(() => {
    const groups = {};
    transactionHistory.forEach(item => {
      if (!groups[item.month]) {
        groups[item.month] = {
          id: item.month,
          month: item.month,
          date: item.date,
          totalTxn: 0,
          totalRevenue: 0,
        };
        MODULES.forEach(m => {
          groups[item.month][`${m}_txn`] = 0;
          groups[item.month][`${m}_rev`] = 0;
        });
      }
      groups[item.month][`${item.module}_txn`] += item.transactions;
      groups[item.month][`${item.module}_rev`] += item.revenue;
      groups[item.month].totalTxn += item.transactions;
      groups[item.month].totalRevenue += item.revenue;
    });
    return Object.values(groups).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactionHistory]);

  // Apply date range filter
  const filteredRows = useMemo(() => {
    let filtered = monthlyRows;
    if (activeDateRange.from) {
      filtered = filtered.filter(row => new Date(row.date) >= activeDateRange.from);
    }
    if (activeDateRange.to) {
      const endOfDay = new Date(activeDateRange.to);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter(row => new Date(row.date) <= endOfDay);
    }
    return filtered;
  }, [monthlyRows, activeDateRange]);

  const moduleDisplayNames = MODULES.reduce((acc, m) => {
    acc[m] = m.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return acc;
  }, {});

  // Radar chart data
  const radarData = useMemo(() => {
    return moduleData.map(mod => ({
      module: mod.displayName,
      revenue: mod.revenue,
      transactions: mod.transactionCount,
    }));
  }, [moduleData]);

  // Table columns
  const transactionColumns = [
    {
      key: 'month',
      label: 'Period',
      sortable: true,
      render: (val) => <span className="font-semibold text-gray-900">{val}</span>
    },
    ...MODULES.map(m => ({
      key: `${m}_rev`,
      label: moduleDisplayNames[m],
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="tabular-nums font-medium text-gray-900">{formatCurrency(val)}</span>
          <p className="text-[11px] tabular-nums text-gray-400 leading-tight">{formatNumber(row[`${m}_txn`])} txns</p>
        </div>
      )
    })),
    {
      key: 'totalRevenue',
      label: 'Total Revenue',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold tabular-nums text-gray-900">{formatCurrency(val)}</span>
          <p className="text-[11px] tabular-nums text-gray-400 leading-tight">{formatNumber(row.totalTxn)} txns</p>
        </div>
      )
    },
    {
      key: 'icpShare',
      label: 'ICP Share',
      sortable: true,
      render: (_, row) => {
        const share = Math.round((row.totalRevenue * (activeSplit.icp / 100)) * 100) / 100;
        return <span className="font-semibold text-amber-700 tabular-nums">{formatCurrency(share)}</span>;
      }
    }
  ];

  const handleExportHistory = () => {
    const exportData = filteredRows.map(row => {
      const entry = { 'Period': row.month };
      MODULES.forEach(m => {
        entry[`${moduleDisplayNames[m]} Transactions`] = row[`${m}_txn`];
        entry[`${moduleDisplayNames[m]} Revenue (AED)`] = row[`${m}_rev`];
      });
      entry['Total Transactions'] = row.totalTxn;
      entry['Total Revenue (AED)'] = row.totalRevenue;
      entry['ICP Share (AED)'] = Math.round((row.totalRevenue * (activeSplit.icp / 100)) * 100) / 100;
      return entry;
    });
    exportToCSV(exportData, `${client.name}-transactions`);
  };

  const revenuePerTx = client.totalTransactions > 0
    ? (client.revenue / client.totalTransactions).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-5 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <Link
          to="/finance/clients"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Clients
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold">{client.name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 leading-tight">{client.name}</h1>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                <Building2 className="w-3 h-3" />
                <span>{client.sector}</span>
                <span className="text-gray-300">|</span>
                <CalendarIcon className="w-3 h-3" />
                <span>Since {formatDate(client.activeSince)}</span>
                <span className="text-gray-300">|</span>
                <span className="font-mono">{formatSplitRatio(activeSplit)}</span>
              </div>
            </div>
          </div>

          {/* Date Range Filter - Dashboard style */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5">
              {DATE_FILTERS.map((filter) =>
                filter.value === 'custom' ? (
                  <Popover key={filter.value} open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <button
                        onClick={() => handleDateFilterChange('custom')}
                        className={cn(
                          "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5",
                          dateFilter === 'custom'
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        <CalendarIcon className="w-3 h-3" />
                        {getFilterDisplayText() || filter.label}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={customRange?.from || new Date()}
                        selected={customRange}
                        onSelect={(range) => setCustomRange(range || { from: undefined, to: undefined })}
                        numberOfMonths={1}
                      />
                      {customRange?.from && customRange?.to && (
                        <div className="flex justify-end px-3 pb-3">
                          <Button
                            size="sm"
                            className="bg-[#F5CA23] hover:bg-[#F6AB29] text-gray-900 rounded-lg text-xs font-semibold"
                            onClick={() => setCalendarOpen(false)}
                          >
                            Apply
                          </Button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                ) : (
                  <button
                    key={filter.value}
                    onClick={() => handleDateFilterChange(filter.value)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200",
                      dateFilter === filter.value
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    {filter.label}
                  </button>
                )
              )}
            </div>

            {/* Reset Button - only show when not at default */}
            {dateFilter !== 'last_month' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="rounded-xl border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 gap-1.5 h-8"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </Button>
            )}

            {/* Update Button */}
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 gap-1.5 h-8"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Update
            </Button>
          </div>
        </div>
      </div>

      {/* Stat Cards (2x2) + Module Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(client.revenue)}
            subtitle="All modules combined"
            icon={DollarSign}
          />
          <StatCard
            title="ICP Revenue"
            value={formatCurrency(clientShares.icpShare)}
            subtitle={`${activeSplit.icp}% of total revenue`}
            icon={Wallet}
          />
          <StatCard
            title="Total Transactions"
            value={formatNumber(client.totalTransactions)}
            subtitle="All modules combined"
            icon={Activity}
          />
          <StatCard
            title="Avg. Revenue / Txn"
            value={`AED ${revenuePerTx}`}
            subtitle="Revenue per transaction"
            icon={TrendingUp}
          />
        </div>

        <Card className="border-gray-100 shadow-sm border-t-4 border-t-[#F5CA23] rounded-2xl">
          <CardContent className="p-5 flex flex-col h-full">
            <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-4">Module Breakdown</p>
            <div className="flex-1 flex items-center justify-center">
              <ChartContainer config={radarChartConfig} className="mx-auto w-full aspect-square max-h-[220px]">
                <RadarChart
                  data={radarData}
                  margin={{ top: 24, right: 24, bottom: 24, left: 24 }}
                >
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => (
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">
                              {radarChartConfig[name]?.label || name}
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
                  <PolarAngleAxis
                    dataKey="module"
                    tick={({ x, y, textAnchor, index, ...props }) => {
                      const d = radarData[index];
                      if (!d) return null;
                      const yVal = typeof y === 'number' ? y : 0;
                      return (
                        <text
                          x={x}
                          y={yVal + (index === 0 ? -10 : 0)}
                          textAnchor={textAnchor}
                          fontSize={11}
                          fontWeight={500}
                          {...props}
                        >
                          <tspan className="fill-gray-700" fontWeight={600}>{formatCompactNumber(d.transactions)}</tspan>
                          <tspan className="fill-gray-300"> / </tspan>
                          <tspan className="fill-amber-600">{formatCompactNumber(d.revenue)}</tspan>
                          <tspan
                            x={x}
                            dy="1.1em"
                            fontSize={10}
                            className="fill-muted-foreground"
                          >
                            {d.module}
                          </tspan>
                        </text>
                      );
                    }}
                  />
                  <PolarGrid stroke="#E5E7EB" strokeDasharray="3 3" />
                  <Radar
                    name="revenue"
                    dataKey="revenue"
                    fill="#F5CA23"
                    fillOpacity={0.5}
                    stroke="#F5CA23"
                    strokeWidth={1.5}
                  />
                  <Radar
                    name="transactions"
                    dataKey="transactions"
                    fill="#464646"
                    fillOpacity={0.1}
                    stroke="#464646"
                    strokeWidth={1.5}
                  />
                </RadarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Transaction History</h2>
          <Button variant="outline" size="sm" onClick={handleExportHistory} className="h-8 rounded-xl text-xs">
            <Download className="w-3.5 h-3.5 mr-1" />
            Export CSV
          </Button>
        </div>

        <DataTable
          columns={transactionColumns}
          data={filteredRows}
          pageSize={12}
          showPagination={true}
        />
      </div>
    </div>
  );
}
