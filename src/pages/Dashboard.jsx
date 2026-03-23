import React, { useMemo } from 'react';
import {
  DollarSign,
  Activity,
  Users,
  TrendingUp,
  Wallet,
  Receipt
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import RevenueLineChart from '../components/charts/RevenueLineChart';
import SectorRadialChart from '../components/charts/SectorRadialChart';
import SplitDonutChart from '../components/charts/SplitDonutChart';
import ModuleRevenueChart from '../components/charts/ModuleRevenueChart';
import TopClientsTable from '../components/charts/TopClientsTable';
import ClientStatusChart from '../components/charts/ClientStatusChart';
import MonthComparisonWidget from '../components/charts/MonthComparisonWidget';
import TransactionVolumeChart from '../components/charts/TransactionVolumeChart';
import ClientGrowthChart from '../components/charts/ClientGrowthChart';
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
} from '../components/data/mockData';
import {
  formatCurrency,
  formatNumber,
  calculatePercentageChange
} from '../components/utils/formatters';
import { useSplitRatio } from '../contexts/SplitRatioContext';

export default function Dashboard() {
  const summary = getDashboardSummary();
  const { activeSplit } = useSplitRatio();

  const revenueChange = calculatePercentageChange(summary.totalRevenue, summary.previousPeriodRevenue);
  const txChange = calculatePercentageChange(summary.totalTransactions, summary.previousPeriodTransactions);

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
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Revenue analytics and performance metrics</p>
      </div>

      {/* Summary Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(summary.totalRevenue)}
          icon={DollarSign}
          trend="up"
          trendValue={`${revenueChange}%`}
        />
        <StatCard
          title="ICP Revenue"
          value={formatCurrency(icpRevenue)}
          icon={Wallet}
          subtitle={`${activeSplit.icp}% split`}
        />
        <StatCard
          title="Total Transactions"
          value={formatNumber(summary.totalTransactions)}
          icon={Activity}
          trend="up"
          trendValue={`${txChange}%`}
        />
        <StatCard
          title="Revenue / Transaction"
          value={`AED ${summary.revenuePerTransaction}`}
          icon={Receipt}
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
        <RevenueLineChart
          data={MONTHLY_REVENUE}
          title="Revenue Trend"
        />
        <SectorRadialChart
          data={SECTOR_DATA}
          title="Sector-wise Revenue"
        />
      </div>

      {/* Top Clients & Month Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TopClientsTable
            clients={topClients}
            title="Top 5 Clients by Revenue"
            activeSplit={activeSplit}
          />
        </div>
        <MonthComparisonWidget
          data={monthComparison}
          title="Month over Month"
        />
      </div>

      {/* Transaction Volume & Client Growth */}
      <div className="w-full gap-6">
        <TransactionVolumeChart
          data={weeklyVolume}
          title="Weekly Transaction Volume"
        />
        {/* <ClientGrowthChart
          data={clientGrowth}
          title="Client Growth Trend"
        /> */}
      </div>
    </div>
  );
}
