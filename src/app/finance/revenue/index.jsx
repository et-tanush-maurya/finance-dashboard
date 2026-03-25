import React, { useMemo, useState, useCallback } from 'react';
import {
  DollarSign,
  Activity,
  Users,
  TrendingUp,
  Wallet,
  Receipt,
  RefreshCw,
  RotateCcw,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, subDays, startOfMonth } from 'date-fns';
import { cn } from '@/lib/utils';
import StatCard from '@/components/common/StatCard';
import RevenueRadarChart from '@/components/charts/revenue/RevenueRadarChart';
import SectorRadialChart from '@/components/charts/sectors/SectorRadialChart';
import SplitDonutChart from '@/components/charts/revenue/SplitDonutChart';
import ModuleRevenueChart from '@/components/charts/modules/ModuleRevenueChart';
import TopClientsTable from '@/components/charts/revenue/TopClientsTable';
import ClientStatusChart from '@/components/charts/clients/ClientStatusChart';
import MonthComparisonWidget from '@/components/charts/revenue/MonthComparisonWidget';
import TransactionVolumeChart from '@/components/charts/revenue/TransactionVolumeChart';
import ClientGrowthChart from '@/components/charts/clients/ClientGrowthChart';
import {
  MONTHLY_REVENUE,
  SECTOR_DATA,
  getDashboardSummary,
  getTopClients,
  getModuleRevenueBreakdown,
  getClientStatusBreakdown,
  getClientGrowthData,
  getWeeklyTransactionVolume,
  getMonthComparison
} from '@/data/mockData';
import {
  formatCurrency,
  formatNumber,
  calculatePercentageChange
} from '@/utils/formatters';
import { useSplitRatio } from '@/contexts/SplitRatioContext';

const DATE_FILTERS = [
  { label: '7 Days', value: '7d' },
  { label: '15 Days', value: '15d' },
  { label: 'Month', value: 'month' },
  { label: 'Custom', value: 'custom' },
];

export default function Dashboard() {
  const summary = getDashboardSummary();
  const { activeSplit } = useSplitRatio();
  const [dateFilter, setDateFilter] = useState('month');
  const [customRange, setCustomRange] = useState({ from: undefined, to: undefined });
  const [calendarOpen, setCalendarOpen] = useState(false);

  const revenueChange = calculatePercentageChange(summary.totalRevenue, summary.previousPeriodRevenue);
  const txChange = calculatePercentageChange(summary.totalTransactions, summary.previousPeriodTransactions);

  const handleDateFilterChange = useCallback((value) => {
    setDateFilter(value);
    if (value === 'custom') {
      setCalendarOpen(true);
    }
  }, []);

  const handleReset = useCallback(() => {
    setDateFilter('month');
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

  // Calculate ICP revenue based on active split
  const icpRevenue = useMemo(() => {
    return Math.round((summary.totalRevenue * (activeSplit.icp / 100)) * 100) / 100;
  }, [summary.totalRevenue, activeSplit.icp]);

  const dalilRevenue = useMemo(() => {
    return summary.totalRevenue - icpRevenue;
  }, [summary.totalRevenue, icpRevenue]);

  // Get data for charts
  const topClients = useMemo(() => getTopClients(5), []);
  const moduleBreakdown = useMemo(() => getModuleRevenueBreakdown(), []);
  const clientStatus = useMemo(() => getClientStatusBreakdown(), []);
  const clientGrowth = useMemo(() => getClientGrowthData(), []);
  const weeklyVolume = useMemo(() => getWeeklyTransactionVolume(), []);
  const monthComparison = useMemo(() => getMonthComparison(), []);

  return (
    <div className="space-y-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Revenue analytics and performance metrics</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Date Range Filter */}
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
          {dateFilter !== 'month' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="rounded-xl border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
          )}

          {/* Update Button */}
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Update
          </Button>
        </div>
      </div>

      {/* Summary Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(summary.totalRevenue)}
          icon={DollarSign}
          trend="up"
          trendValue={`${revenueChange}%`}
          subtitle="All channels combined"
        />
        <StatCard
          title="ICP Revenue"
          value={formatCurrency(icpRevenue)}
          icon={Wallet}
          subtitle={`${activeSplit.icp}% of total revenue`}
        />
        <StatCard
          title="Total Transactions"
          value={formatNumber(summary.totalTransactions)}
          icon={Activity}
          trend="up"
          trendValue={`${txChange}%`}
          subtitle="Across all modules"
        />
        <StatCard
          title="Dalil Share"
          value={formatCurrency(dalilRevenue)}
          icon={Receipt}
          subtitle={`${activeSplit.dalil}% of total revenue`}
        />
      </div>

      {/* Summary Cards - Row 2 */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Active Clients"
          value={summary.activeClients}
          icon={Users}
        />
        <StatCard
          title="Avg Revenue / Client"
          value={formatCurrency(summary.avgRevenuePerClient)}
          icon={TrendingUp}
        />
        <StatCard
          title="Total Clients"
          value={summary.totalClients}
          icon={Users}
        />
        <StatCard
          title="Inactive Clients"
          value={summary.inactiveClients}
          icon={Users}
          variant="warning"
        />
      </div> */}

      {/* Split & Module Charts */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        <SplitDonutChart
          icpRevenue={icpRevenue}
          dalilRevenue={dalilRevenue}
          title="ICP vs Dalil Split"
        />
      
        <ClientStatusChart
          data={clientStatus}
          title="Client Status"
        />
      </div> */}

      {/* Main Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RevenueRadarChart
          data={MONTHLY_REVENUE}
          title="Revenue Trend"
          subtitle="Last 6 months performance overview"
        />
        <SectorRadialChart
          data={SECTOR_DATA}
          title="Sector Revenue"
          subtitle="Revenue distribution by industry"
        />
      </div>

      {/* Top Clients & Month Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TopClientsTable
            clients={topClients}
            title="Top Clients"
            subtitle="Highest revenue generating accounts"
            activeSplit={activeSplit}
          />
        </div>
        <MonthComparisonWidget
          data={monthComparison}
          title="Monthly Change"
          subtitle="Current vs previous month"
        />
      </div>

      {/* Transaction Volume & Client Growth */}
      <div className="w-full gap-6">
        <TransactionVolumeChart
          data={weeklyVolume}
          title="Transaction Volume"
          subtitle="Weekly transaction activity across all modules"
        />
        {/* <ClientGrowthChart
          data={clientGrowth}
          title="Client Growth Trend"
        /> */}
      </div>
    </div>
  );
}
