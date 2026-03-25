import React, { useState, useMemo, useCallback } from 'react';
import {
  Download,
  Building2,
  Users,
  DollarSign,
  Activity,
  RefreshCw,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import StatCard from '@/components/common/StatCard';
import DataTable from '@/components/common/DataTable';
import FilterDropdown from '@/components/common/FilterDropdown';
import SectorDoublePieChart from '@/components/charts/sectors/SectorDoublePieChart';
import ModuleBarChart from '@/components/charts/modules/ModuleBarChart';
import {
  CLIENTS,
  SECTORS,
  ENTITIES,
  SECTOR_DATA,
  MODULES
} from '@/data/mockData';
import {
  formatCurrency,
  formatNumber,
  exportToCSV
} from '@/utils/formatters';

const DATE_FILTERS = [
  { label: '7 Days', value: '7d' },
  { label: '15 Days', value: '15d' },
  { label: 'Month', value: 'month' },
  { label: 'Custom', value: 'custom' },
];

export default function SectorAnalytics() {
  const [periodFilter, setPeriodFilter] = useState('monthly');
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [dateFilter, setDateFilter] = useState('7d');
  const [customRange, setCustomRange] = useState({ from: undefined, to: undefined });
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleDateFilterChange = useCallback((value) => {
    setDateFilter(value);
    if (value === 'custom') {
      setCalendarOpen(true);
    }
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

  const periodOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const sectorColumns = [
    { key: 'sector', label: 'Sector', sortable: true },
    {
      key: 'clientCount',
      label: 'Clients',
      sortable: true,
      render: (val) => formatNumber(val)
    },
    {
      key: 'totalRevenue',
      label: 'Total Revenue',
      sortable: true,
      render: (val) => formatCurrency(val)
    },
    {
      key: 'totalTransactions',
      label: 'Transactions',
      sortable: true,
      render: (val) => formatNumber(val)
    },
    {
      key: 'avgRevenuePerClient',
      label: 'Avg Revenue/Client',
      sortable: true,
      render: (val) => formatCurrency(val)
    }
  ];

  // Entity breakdown by sector
  const entityBreakdown = useMemo(() => {
    const breakdown = [];
    SECTORS.forEach(sector => {
      ENTITIES.forEach(entity => {
        const clients = CLIENTS.filter(c => c.sector === sector && c.entity === entity);
        if (clients.length > 0) {
          breakdown.push({
            id: `${sector}-${entity}`,
            sector,
            entity,
            clientCount: clients.length,
            totalRevenue: clients.reduce((sum, c) => sum + c.revenue, 0),
            totalTransactions: clients.reduce((sum, c) => sum + c.totalTransactions, 0)
          });
        }
      });
    });
    return breakdown;
  }, []);

  const entityColumns = [
    { key: 'sector', label: 'Sector', sortable: true },
    { key: 'entity', label: 'Entity', sortable: true },
    {
      key: 'clientCount',
      label: 'Clients',
      sortable: true,
      render: (val) => formatNumber(val)
    },
    {
      key: 'totalRevenue',
      label: 'Revenue',
      sortable: true,
      render: (val) => formatCurrency(val)
    },
    {
      key: 'totalTransactions',
      label: 'Transactions',
      sortable: true,
      render: (val) => formatNumber(val)
    }
  ];

  // Module usage comparison
  const moduleComparison = useMemo(() => {
    return MODULES.slice(0, 8).map(module => {
      const data = {
        id: module,
        module,
        displayName: module.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      };
      SECTORS.forEach(sector => {
        const sectorClients = CLIENTS.filter(c => c.sector === sector);
        const txCount = sectorClients.reduce((sum, c) => sum + Math.floor(c.totalTransactions * Math.random() * 0.15), 0);
        data[sector] = txCount;
      });
      return data;
    });
  }, []);

  const moduleColumns = [
    { key: 'displayName', label: 'Module', sortable: true },
    ...SECTORS.map(sector => ({
      key: sector,
      label: sector,
      sortable: true,
      render: (val) => formatNumber(val)
    }))
  ];

  const handleExportSectors = () => {
    const exportData = SECTOR_DATA.map(s => ({
      'Sector': s.sector,
      'Clients': s.clientCount,
      'Total Revenue (AED)': s.totalRevenue,
      'Total Transactions': s.totalTransactions,
      'Avg Revenue/Client': s.avgRevenuePerClient
    }));
    exportToCSV(exportData, 'sector-analytics');
  };

  // Calculate totals
  const totals = useMemo(() => {
    return {
      sectors: SECTORS.length,
      totalClients: CLIENTS.length,
      totalRevenue: CLIENTS.reduce((sum, c) => sum + c.revenue, 0),
      totalTransactions: CLIENTS.reduce((sum, c) => sum + c.totalTransactions, 0)
    };
  }, []);

  return (
    <div className="space-y-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Sectors</h1>
          <p className="text-sm text-gray-500 mt-1">Analyze performance across business sectors</p>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Sectors"
          value={totals.sectors}
          icon={Building2}
          subtitle="Active industry verticals"
        />
        <StatCard
          title="Total Clients"
          value={totals.totalClients}
          icon={Users}
          subtitle="Across all sectors"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totals.totalRevenue)}
          icon={DollarSign}
          subtitle="Combined sector revenue"
        />
        <StatCard
          title="Total Transactions"
          value={formatNumber(totals.totalTransactions)}
          icon={Activity}
          subtitle="All sector activity"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Sector Overview</h2>
          <p className="text-xs text-gray-400 mt-1">Detailed breakdown by industry</p>
        </div>
        <div className="flex items-center gap-3">
          <FilterDropdown
            value={periodFilter}
            onChange={setPeriodFilter}
            options={periodOptions}
            placeholder="Period"
          />
          <Button
            variant="outline"
            className="h-10 border-gray-300 rounded-xl"
            onClick={handleExportSectors}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Sector Table */}
      <DataTable
        columns={sectorColumns}
        data={SECTOR_DATA}
        showPagination={false}
      />

      {/* Chart */}
      <SectorDoublePieChart
        data={SECTOR_DATA}
        title="Revenue by Sector"
        subtitle="Outer ring: Revenue · Inner ring: Clients"
      />

      {/* Entity Breakdown */}
      {/* <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Entity-wise Breakdown</h2>
        <DataTable
          columns={entityColumns}
          data={entityBreakdown}
          pageSize={10}
        />
      </div> */}

      {/* Module Comparison - Chart + Table combined */}
      <ModuleBarChart
        data={moduleComparison}
        sectors={SECTORS}
        title="Module Usage"
        subtitle="Transaction volume by module across sectors"
      >
        <div className="mt-6 pt-6 border-t border-gray-100">
          <DataTable
            columns={moduleColumns}
            data={moduleComparison}
            showPagination={false}
            className="border-0 shadow-none rounded-none"
          />
        </div>
      </ModuleBarChart>
    </div>
  );
}
