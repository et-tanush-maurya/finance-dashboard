import React, { useState, useMemo } from 'react';
import { 
  Download,
  Building2,
  Users,
  DollarSign,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatCard from '../components/common/StatCard';
import DataTable from '../components/common/DataTable';
import FilterDropdown from '../components/common/FilterDropdown';
import SectorDoublePieChart from '../components/charts/SectorDoublePieChart';
import { 
  CLIENTS, 
  SECTORS, 
  ENTITIES,
  SECTOR_DATA,
  MODULES
} from '../components/data/mockData';
import { 
  formatCurrency, 
  formatNumber,
  exportToCSV 
} from '../components/utils/formatters';

export default function SectorAnalytics() {
  const [periodFilter, setPeriodFilter] = useState('monthly');
  const [selectedSectors, setSelectedSectors] = useState([]);

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
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Sectors</h1>
        <p className="text-sm text-gray-500 mt-1">Analyze performance across different business sectors</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Sectors"
          value={totals.sectors}
          icon={Building2}
        />
        <StatCard
          title="Total Clients"
          value={totals.totalClients}
          icon={Users}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totals.totalRevenue)}
          icon={DollarSign}
        />
        <StatCard
          title="Total Transactions"
          value={formatNumber(totals.totalTransactions)}
          icon={Activity}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900">Sector Overview</h2>
        <div className="flex items-center gap-3">
          <FilterDropdown
            value={periodFilter}
            onChange={setPeriodFilter}
            options={periodOptions}
            placeholder="Period"
          />
          <Button 
            variant="outline" 
            className="border-gray-300"
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

      {/* Module Comparison */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Module Usage Comparison</h2>
        <DataTable
          columns={moduleColumns}
          data={moduleComparison}
          showPagination={false}
        />
      </div>
    </div>
  );
}