import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Download,
  Filter,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import DataTable from '../components/common/DataTable';
import SearchInput from '../components/common/SearchInput';
import FilterDropdown from '../components/common/FilterDropdown';
import DateRangePicker from '../components/common/DateRangePicker';
import StatusBadge from '../components/common/StatusBadge';
import {
  CLIENTS,
  SECTORS,
} from '../components/data/mockData';
import {
  formatCurrency,
  formatNumber,
  exportToCSV
} from '../components/utils/formatters';
import { useSplitRatio } from '../contexts/SplitRatioContext';

export default function Clients() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const { activeSplit, calculateShares } = useSplitRatio();
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const filteredClients = useMemo(() => {
    return CLIENTS.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(search.toLowerCase());
      const matchesSector = sectorFilter === 'all' || client.sector === sectorFilter;

      // Date range filter based on activeSince
      let matchesDate = true;
      if (dateRange.from || dateRange.to) {
        const clientDate = new Date(client.activeSince);
        if (dateRange.from && clientDate < dateRange.from) {
          matchesDate = false;
        }
        if (dateRange.to && clientDate > dateRange.to) {
          matchesDate = false;
        }
      }

      return matchesSearch && matchesSector && matchesDate;
    }).map(client => {
      // Recalculate shares based on active split ratio
      const { icpShare, dalilShare } = calculateShares(client.revenue);
      return {
        ...client,
        icpShare,
        dalilShare
      };
    });
  }, [search, sectorFilter, dateRange, activeSplit, calculateShares]);

  const hasActiveFilters = search || sectorFilter !== 'all' || dateRange.from || dateRange.to;

  const columns = [
    {
      key: 'name',
      label: 'Client Name',
      sortable: true,
      width: '20%'
    },
    {
      key: 'sector',
      label: 'Sector',
      sortable: true,
      width: '12%'
    },
    {
      key: 'totalTransactions',
      label: 'Transactions',
      sortable: true,
      width: '12%',
      render: (val) => formatNumber(val)
    },
    {
      key: 'revenue',
      label: 'Revenue',
      sortable: true,
      width: '16%',
      render: (val) => <span className="font-semibold">{formatCurrency(val)}</span>
    },
    {
      key: 'icpShare',
      label: 'ICP Share',
      sortable: true,
      width: '14%',
      render: (val) => <span className="text-xs">{formatCurrency(val)}</span>
    },
    // {
    //   key: 'dalilShare',
    //   label: 'Dalil Share',
    //   sortable: true,
    //   width: '12%',
    //   render: (val) => <span className="text-xs">{formatCurrency(val)}</span>
    // },
    // {
    //   key: 'status',
    //   label: 'Status',
    //   sortable: true,
    //   width: '8%',
    //   render: (val) => <StatusBadge status={val} />
    // }
  ];

  const sectorOptions = [
    { value: 'all', label: 'All Sectors' },
    ...SECTORS.map(s => ({ value: s, label: s }))
  ];

  const handleExport = () => {
    const exportData = filteredClients.map(c => ({
      'Client Name': c.name,
      'Sector': c.sector,
      'Total Transactions': c.totalTransactions,
      'Revenue (AED)': c.revenue,
      'ICP Share': c.icpShare,
      'Dalil Share': c.dalilShare,
      'Split Ratio': `${activeSplit.icp}/${activeSplit.dalil}`,
      'Status': c.status
    }));

    

    // Build filename based on active filters
    let filename = 'clients-report';
    if (sectorFilter !== 'all') {
      filename += `-${sectorFilter.toLowerCase()}`;
    }
    if (dateRange.from || dateRange.to) {
      if (dateRange.from) filename += `-from-${format(dateRange.from, 'yyyy-MM-dd')}`;
      if (dateRange.to) filename += `-to-${format(dateRange.to, 'yyyy-MM-dd')}`;
    }
    filename += `-${format(new Date(), 'yyyy-MM-dd')}`;

    exportToCSV(exportData, filename);
  };

  const handleRowClick = (client) => {
    navigate(`/clientprofile?id=${client.id}`);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSectorFilter('all');
    setDateRange({ from: null, to: null });
  };

  

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and view all client reconciliation data</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search clients..."
            className="w-full sm:w-80"
          />
          {/* <FilterDropdown
            value={sectorFilter}
            onChange={setSectorFilter}
            options={sectorOptions}
            placeholder="Sector"
          /> */}
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          <Button
            className="bg-gray-900 hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all rounded-xl"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Export {hasActiveFilters ? `(${filteredClients.length})` : 'All'}
          </Button>
          {hasActiveFilters && <Button
            className="shadow-lg hover:shadow-xl transition-all rounded-xl"
            onClick={handleResetFilters}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset  
          </Button>}
        </div>
      </div>

      {/* Clients Table */}
      <DataTable
        columns={columns}
        data={filteredClients}
        onRowClick={handleRowClick}
        pageSize={10}
      />
    </div>
  );
}
