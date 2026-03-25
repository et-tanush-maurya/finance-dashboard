import React, { useState, useCallback } from 'react';
import {
  Mail,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  RotateCcw,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { formatDate, formatCurrency } from '@/utils/formatters';

const REPORT_TYPES = [
  { value: 'Client Summary', label: 'Client Summary' },
  { value: 'Sector Summary', label: 'Sector Summary' },
  { value: 'Full Reconciliation', label: 'Full Reconciliation' }
];

const DATE_FILTERS = [
  { label: '7 Days', value: '7d' },
  { label: '15 Days', value: '15d' },
  { label: 'Month', value: 'month' },
  { label: 'Custom', value: 'custom' },
];

// Mock historical report data for auditing
const generateReportHistory = () => {
  const history = [];
  const reports = ['Monthly Client Summary', 'Sector Performance Report', 'Full Reconciliation Report'];
  const statuses = ['success', 'success', 'success', 'success', 'failed'];
  const users = ['admin@icp.ae', 'finance@icp.ae', 'system'];

  const now = new Date();
  for (let i = 0; i < 25; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - (i * 3));

    history.push({
      id: `hist-${i + 1}`,
      reportName: reports[i % reports.length],
      type: REPORT_TYPES[i % REPORT_TYPES.length].value,
      generatedAt: date.toISOString(),
      generatedBy: users[i % users.length],
      status: statuses[i % statuses.length],
      fileSize: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
      recipients: ['finance@icp.ae', 'management@icp.ae'].slice(0, (i % 2) + 1),
      splitRatio: { icp: 60, dalil: 40 },
      totalRevenue: Math.round(Math.random() * 5000000 + 1000000),
      clientsIncluded: Math.floor(Math.random() * 10 + 15),
      period: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    });
  }
  return history;
};

export default function ReportAutomation() {
  const [reportHistory] = useState(generateReportHistory());
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedHistoryReport, setSelectedHistoryReport] = useState(null);
  const [dateFilter, setDateFilter] = useState('month');
  const [customRange, setCustomRange] = useState({ from: undefined, to: undefined });
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Pagination for history
  const [historyPage, setHistoryPage] = useState(1);
  const historyPerPage = 10;
  const totalHistoryPages = Math.ceil(reportHistory.length / historyPerPage);
  const paginatedHistory = reportHistory.slice(
    (historyPage - 1) * historyPerPage,
    historyPage * historyPerPage
  );

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

  const handleViewHistoryDetails = (report) => {
    setSelectedHistoryReport(report);
    setIsHistoryModalOpen(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700';
      case 'failed':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-amber-50 text-amber-700';
    }
  };

  return (
    <div className="space-y-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Report History</h1>
          <p className="text-sm text-gray-500 mt-1">View and audit previously generated reports</p>
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

          {/* Fetch Button */}
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Fetch
          </Button>
        </div>
      </div>

      {/* Report History Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-[#F5CA23] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50 w-[22%]">Report</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50 w-[14%]">Type</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50 w-[14%]">Generated</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50 w-[14%]">Generated By</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50 w-[10%]">Status</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50 w-[10%]">Size</th>
                  <th className="text-right py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50 w-[16%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedHistory.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-50 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    } hover:bg-gray-50`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-3.5 h-3.5 text-[#464646]" />
                        </div>
                        <span className="font-medium text-gray-900 truncate">{item.reportName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 truncate">{item.type}</td>
                    <td className="py-4 px-6 text-gray-600">
                      <div>
                        <p className="font-medium">{formatDate(item.generatedAt)}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(item.generatedAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 truncate">{item.generatedBy}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${getStatusStyle(item.status)}`}>
                        {getStatusIcon(item.status)}
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{item.fileSize}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 gap-1.5 text-xs h-8"
                          onClick={() => handleViewHistoryDetails(item)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-lg bg-[#F5CA23] hover:bg-[#F6AB29] text-gray-900 gap-1.5 text-xs font-semibold h-8"
                          disabled={item.status === 'failed'}
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalHistoryPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
              <div className="text-sm text-gray-500">
                Showing {((historyPage - 1) * historyPerPage) + 1} to {Math.min(historyPage * historyPerPage, reportHistory.length)} of {reportHistory.length} records
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setHistoryPage(prev => Math.max(prev - 1, 1))}
                  disabled={historyPage === 1}
                  className="h-8 w-8 p-0 border-gray-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalHistoryPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setHistoryPage(page)}
                    className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                      historyPage === page
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setHistoryPage(prev => Math.min(prev + 1, totalHistoryPages))}
                  disabled={historyPage === totalHistoryPages}
                  className="h-8 w-8 p-0 border-gray-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
      </div>

      {/* History Details Modal */}
      <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
          </DialogHeader>

          {selectedHistoryReport && (
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedHistoryReport.reportName}</p>
                  <p className="text-sm text-gray-500">{selectedHistoryReport.type}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase">Generated At</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {formatDate(selectedHistoryReport.generatedAt)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(selectedHistoryReport.generatedAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase">Generated By</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {selectedHistoryReport.generatedBy}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase">Report Period</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {selectedHistoryReport.period}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase">File Size</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {selectedHistoryReport.fileSize}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase mb-2">Report Snapshot</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Split Ratio</span>
                    <span className="font-medium">{selectedHistoryReport.splitRatio.icp}/{selectedHistoryReport.splitRatio.dalil}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="font-medium">{formatCurrency(selectedHistoryReport.totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Clients Included</span>
                    <span className="font-medium">{selectedHistoryReport.clientsIncluded}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase mb-2">Recipients</p>
                <div className="flex flex-wrap gap-2">
                  {selectedHistoryReport.recipients.map((email, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 text-xs bg-white border border-gray-200 px-2 py-1 rounded-full">
                      <Mail className="w-3 h-3 text-gray-400" />
                      {email}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${getStatusStyle(selectedHistoryReport.status)}`}>
                  {getStatusIcon(selectedHistoryReport.status)}
                  {selectedHistoryReport.status === 'success' ? 'Successfully Generated' : 'Generation Failed'}
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsHistoryModalOpen(false)}>
              Close
            </Button>
            {selectedHistoryReport?.status === 'success' && (
              <Button className="bg-[#F5CA23] hover:bg-[#F6AB29] text-gray-900 font-semibold">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
