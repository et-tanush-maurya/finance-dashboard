import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import {
  ArrowLeft,
  Download,
  Calendar,
  Building2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import FilterDropdown from '../components/common/FilterDropdown';
import ModuleRingsChart from '../components/charts/ModuleRingsChart';
import MonthlyTrendRadialChart from '../components/charts/MonthlyTrendRadialChart';
import {
  CLIENTS,
  generateClientModuleData,
  generateTransactionHistory,
  generateDailyDataForMonth
} from '../components/data/mockData';
import DailyModuleChart from '../components/charts/DailyModuleChart';
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatSplitRatio,
  formatPercentage,
  exportToCSV
} from '../components/utils/formatters';
import { useSplitRatio } from '../contexts/SplitRatioContext';

export default function ClientProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get('id');

  const [dateFilter, setDateFilter] = useState('all');
  const [expandedMonth, setExpandedMonth] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const { activeSplit } = useSplitRatio();
  const client = CLIENTS.find(c => c.id === clientId);

  // Calculate shares based on active split ratio (reactive to activeSplit changes)
  const clientShares = useMemo(() => {
    if (!client) return { icpShare: 0, dalilShare: 0 };
    const icpShare = Math.round((client.revenue * (activeSplit.icp / 100)) * 100) / 100;
    const dalilShare = Math.round((client.revenue - icpShare) * 100) / 100;
    return { icpShare, dalilShare };
  }, [client, activeSplit.icp, activeSplit.dalil]);
  const moduleData = useMemo(() => client ? generateClientModuleData(clientId) : [], [clientId]);
  const transactionHistory = useMemo(() => client ? generateTransactionHistory(clientId) : [], [clientId]);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-gray-500 mb-4">Client not found</p>
        <Link to={createPageUrl('Clients')}>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Clients
          </Button>
        </Link>
      </div>
    );
  }

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: '3', label: 'Last 3 Months' },
    { value: '6', label: 'Last 6 Months' },
    { value: '12', label: 'Last 12 Months' }
  ];

  const groupedByMonth = useMemo(() => {
    const groups = {};

    transactionHistory.forEach(item => {
      if (!groups[item.month]) {
        groups[item.month] = {
          month: item.month,
          date: item.date,
          modules: [],
          totalTransactions: 0,
          totalRevenue: 0
        };
      }
      groups[item.month].modules.push(item);
      groups[item.month].totalTransactions += item.transactions;
      groups[item.month].totalRevenue += item.revenue;
    });

    Object.values(groups).forEach(group => {
      group.modules.sort((a, b) => {
        const order = ['onboarding', 'rekyc', 'authorise'];
        return order.indexOf(a.module) - order.indexOf(b.module);
      });
    });

    // Sort by date descending (most recent first)
    return Object.values(groups).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactionHistory]);

  const filteredGroups = useMemo(() => {
    if (dateFilter === 'all') return groupedByMonth;
    const months = parseInt(dateFilter);
    return groupedByMonth.slice(0, months);
  }, [groupedByMonth, dateFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const paginatedGroups = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredGroups.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredGroups, currentPage, itemsPerPage]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [dateFilter]);

  const handleExportModules = () => {
    const exportData = moduleData.map(m => ({
      'Module': m.displayName,
      'Transaction Count': m.transactionCount,
      'Revenue (AED)': m.revenue,
      '% of Total': m.percentage
    }));
    exportToCSV(exportData, `${client.name}-modules`);
  };

  const handleExportHistory = () => {
    const exportData = transactionHistory.map(h => ({
      'Period': h.month,
      'Module': h.displayName,
      'Transactions': h.transactions,
      'Revenue (AED)': h.revenue
    }));
    exportToCSV(exportData, `${client.name}-history`);
  };

  const monthlyTrend = useMemo(() => {
    const grouped = {};
    transactionHistory.forEach(item => {
      if (!grouped[item.month]) {
        grouped[item.month] = { month: item.month, revenue: 0, transactions: 0 };
      }
      grouped[item.month].revenue += item.revenue;
      grouped[item.month].transactions += item.transactions;
    });
    return Object.values(grouped);
  }, [transactionHistory]);

  return (
    <div className="space-y-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div>
        <Link
          to={createPageUrl('Clients')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Clients
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {client.name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{client.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {client.sector}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Since {formatDate(client.activeSince)}
                </span>
                <span>•</span>
                <span className="font-mono text-xs">{formatSplitRatio(activeSplit)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportModules}>
              <Download className="w-4 h-4 mr-2" />
              Modules
            </Button>
            <Button size="sm" className="bg-gray-900 hover:bg-gray-800" onClick={handleExportHistory}>
              <Download className="w-4 h-4 mr-2" />
              History
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-gray-200">
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{formatNumber(client.totalTransactions)}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{formatCurrency(client.revenue)}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">ICP Share</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{formatCurrency(clientShares.icpShare)}</p>
            {/* <p className="text-xs text-gray-400 mt-0.5">{activeSplit.icp}% split</p> */}
          </CardContent>
        </Card>
        {/* <Card className="border-gray-200">
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Dalil Share</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{formatCurrency(clientShares.dalilShare)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{activeSplit.dalil}% split</p>
          </CardContent>
        </Card> */}
      </div>



      {/* Transaction History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
          {/* <div className="flex items-center gap-3">
            <FilterDropdown
              value={dateFilter}
              onChange={setDateFilter}
              options={dateOptions}
              placeholder="Period"
            />
            <Button variant="outline" size="sm" onClick={handleExportHistory}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div> */}
        </div>

        <Card className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="space-y-3 p-4">
              {paginatedGroups.map((group, groupIdx) => {
                const monthIcpShare = Math.round((group.totalRevenue * (activeSplit.icp / 100)) * 100) / 100;
                return (
                  <div key={group.month} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Month header with all stats on same line */}
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <span className="font-semibold text-gray-900 text-base">{group.month}</span>
                        <span className="text-sm text-gray-600">
                          Total Transactions: <span className="font-medium text-gray-900">{formatNumber(group.totalTransactions)}</span>
                        </span>
                        <span className="text-sm text-gray-600">
                          Total Revenue: <span className="font-medium text-gray-900">{formatCurrency(group.totalRevenue)}</span>
                        </span>
                        <span className="text-sm text-gray-600">
                          ICP Share: <span className="font-medium text-gray-900">{formatCurrency(monthIcpShare)}</span>
                        </span>
                      </div>
                      <button
                        onClick={() => setExpandedMonth(expandedMonth === group.month ? null : group.month)}
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                      >
                        {expandedMonth === group.month ? 'Hide Module Breakdown' : 'View Module Breakdown'}
                        <ChevronRight className={`w-4 h-4 transition-transform ${expandedMonth === group.month ? 'rotate-90' : ''}`} />
                      </button>
                    </div>

                    {/* Module breakdown table (replaces daily transaction graph) */}
                    {expandedMonth === group.month && (
                      <div className="bg-white">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="text-left py-3 px-4 font-medium text-gray-600">Module</th>
                              <th className="text-right py-3 px-4 font-medium text-gray-600">Transactions</th>
                              <th className="text-right py-3 px-4 font-medium text-gray-600">Revenue</th>
                              <th className="text-right py-3 px-4 font-medium text-gray-600">ICP Share</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.modules.map((item, idx) => {
                              const itemIcpShare = Math.round((item.revenue * (activeSplit.icp / 100)) * 100) / 100;
                              return (
                                <tr key={item.id} className={idx !== group.modules.length - 1 ? 'border-b border-gray-100' : ''}>
                                  <td className="py-3 px-4 text-gray-900">{item.displayName}</td>
                                  <td className="py-3 px-4 text-right text-gray-700">{formatNumber(item.transactions)}</td>
                                  <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(item.revenue)}</td>
                                  <td className="py-3 px-4 text-right text-gray-900 font-medium">{formatCurrency(itemIcpShare)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Commented out: Daily transaction graph */}
                    {/* {expandedMonth === group.month && (
                      <div className="bg-gray-50 p-4">
                        <DailyModuleChart
                          data={generateDailyDataForMonth(group.month)}
                          title={`Daily Transactions - ${group.month}`}
                        />
                      </div>
                    )} */}
                  </div>
                );
              })}
            </div>

            {filteredGroups.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">
                No transaction data available
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredGroups.length)} of {filteredGroups.length} months
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="h-8 px-3"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 text-sm rounded-lg transition-colors ${currentPage === page
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="h-8 px-3"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Module Breakdown */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Module Breakdown</h2>

        <Card className="border-gray-200">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Module</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Transactions</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Total Revenue</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">ICP Share</th>
                  {/* <th className="text-right py-3 px-4 font-medium text-gray-600">% of Total</th> */}
                </tr>
              </thead>
              <tbody>
                {moduleData.map((mod) => {
                  const icpRevenue = Math.round((mod.revenue * (activeSplit.icp / 100)) * 100) / 100;
                  return (
                    <tr key={mod.module} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{mod.displayName}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{formatNumber(mod.transactionCount)}</td>
                      <td className="py-3 px-4 text-right text-gray-500">{formatCurrency(mod.revenue)}</td>
                      <td className="py-3 px-4 text-right text-gray-900 font-medium">{formatCurrency(icpRevenue)}</td>
                      {/* <td className="py-3 px-4 text-right text-gray-700">{formatPercentage(mod.percentage)}</td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ModuleRingsChart data={moduleData} title="Module Distribution" />
        <MonthlyTrendRadialChart data={monthlyTrend} title="Monthly Trend" />
      </div>
    </div>
  );
}
