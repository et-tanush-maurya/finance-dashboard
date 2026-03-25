import React, { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Mail,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { SCHEDULED_REPORTS } from '@/data/mockData';
import { formatDate } from '@/utils/formatters';

const REPORT_TYPES = [
  { value: 'Client Summary', label: 'Client Summary' },
  { value: 'Sector Summary', label: 'Sector Summary' },
  { value: 'Full Reconciliation', label: 'Full Reconciliation' }
];

const DEFAULT_FORM = {
  name: '',
  type: 'Client Summary',
  frequency: 'Monthly',
  dayOfMonth: 1,
  recipients: '',
  status: 'active'
};

export default function ScheduleReport() {
  const [reports, setReports] = useState(SCHEDULED_REPORTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);

  const handleAdd = () => {
    setEditingReport(null);
    setFormData(DEFAULT_FORM);
    setIsModalOpen(true);
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setFormData({
      name: report.name,
      type: report.type,
      frequency: report.frequency,
      dayOfMonth: report.dayOfMonth,
      recipients: report.recipients.join(', '),
      status: report.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = (report) => {
    setReportToDelete(report);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setReports(reports.filter(r => r.id !== reportToDelete.id));
    setIsDeleteDialogOpen(false);
    setReportToDelete(null);
  };

  const handleToggle = (report) => {
    setReports(reports.map(r => {
      if (r.id === report.id) {
        return {
          ...r,
          status: r.status === 'active' ? 'inactive' : 'active'
        };
      }
      return r;
    }));
  };

  const handleSave = () => {
    const recipientsList = formData.recipients
      .split(',')
      .map(e => e.trim())
      .filter(e => e);

    if (editingReport) {
      setReports(reports.map(r => {
        if (r.id === editingReport.id) {
          return {
            ...r,
            ...formData,
            recipients: recipientsList
          };
        }
        return r;
      }));
    } else {
      const newReport = {
        id: `report-${Date.now()}`,
        ...formData,
        recipients: recipientsList,
        lastSent: null
      };
      setReports([...reports, newReport]);
    }

    setIsModalOpen(false);
    setEditingReport(null);
    setFormData(DEFAULT_FORM);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingReport(null);
    setFormData(DEFAULT_FORM);
  };

  const columns = [
    {
      key: 'name',
      label: 'Report Name',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{val}</span>
        </div>
      )
    },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'frequency', label: 'Frequency', sortable: true },
    {
      key: 'recipients',
      label: 'Recipients',
      sortable: false,
      render: (val) => (
        <div className="flex items-center gap-1">
          <Mail className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-sm">{val.length} recipient{val.length !== 1 ? 's' : ''}</span>
        </div>
      )
    },
    {
      key: 'lastSent',
      label: 'Last Sent',
      sortable: true,
      render: (val) => val ? formatDate(val) : '-'
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => <StatusBadge status={val} />
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Switch
            checked={row.status === 'active'}
            onCheckedChange={() => handleToggle(row)}
            className="mr-2"
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
          >
            <Pencil className="w-4 h-4 text-gray-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Scheduled Reports</h1>
          <p className="text-sm text-gray-500 mt-1">
            Schedule automated reports to be generated and sent to recipients.
          </p>
        </div>
        <Button
          className="bg-gray-900 hover:bg-gray-800"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Report
        </Button>
      </div>

      {/* Scheduled Reports Table */}
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={reports}
          showPagination={false}
        />
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingReport ? 'Edit Report' : 'Add New Report'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Report Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Monthly Finance Report"
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select
                value={formData.type}
                onValueChange={(val) => setFormData({...formData, type: val})}
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Schedule Day of Month</Label>
              <Select
                value={String(formData.dayOfMonth)}
                onValueChange={(val) => setFormData({...formData, dayOfMonth: parseInt(val)})}
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({length: 28}, (_, i) => i + 1).map(day => (
                    <SelectItem key={day} value={String(day)}>
                      {day}{day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} of each month
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipients">Email Recipients</Label>
              <Input
                id="recipients"
                value={formData.recipients}
                onChange={(e) => setFormData({...formData, recipients: e.target.value})}
                placeholder="email@example.com, another@example.com"
                className="border-gray-300"
              />
              <p className="text-xs text-gray-500">Separate multiple emails with commas</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="active">Active</Label>
              <Switch
                id="active"
                checked={formData.status === 'active'}
                onCheckedChange={(checked) => setFormData({
                  ...formData,
                  status: checked ? 'active' : 'inactive'
                })}
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              className="bg-gray-900 hover:bg-gray-800"
              onClick={handleSave}
              disabled={!formData.name || !formData.recipients}
            >
              <Check className="w-4 h-4 mr-2" />
              {editingReport ? 'Save Changes' : 'Create Report'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{reportToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
