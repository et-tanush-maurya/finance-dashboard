import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import {
  Settings,
  History,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CLIENTS } from '../components/data/mockData';
import { formatDate, formatCurrency } from '../components/utils/formatters';
import { useSplitRatio } from '../contexts/SplitRatioContext';

const initialSplitHistory = [
  {
    id: 1,
    date: new Date(2023, 0, 1).toISOString(),
    icp: 60,
    dalil: 40,
    changedBy: 'admin@icp.ae',
    approvedBy: 'cfo@icp.ae',
    status: 'approved',
    effectiveDate: new Date(2023, 0, 1).toISOString()
  },
  {
    id: 2,
    date: new Date(2023, 6, 1).toISOString(),
    icp: 55,
    dalil: 45,
    changedBy: 'finance@icp.ae',
    approvedBy: 'cfo@icp.ae',
    status: 'approved',
    effectiveDate: new Date(2023, 6, 15).toISOString()
  },
  {
    id: 3,
    date: new Date(2024, 0, 1).toISOString(),
    icp: 60,
    dalil: 40,
    changedBy: 'admin@icp.ae',
    approvedBy: 'cfo@icp.ae',
    status: 'approved',
    effectiveDate: new Date(2024, 0, 1).toISOString()
  }
];

export default function SplitRatioConfig() {
  const { actualSplit, updateActualSplit } = useSplitRatio();
  const [pendingSplit, setPendingSplit] = useState(null);
  const [splitHistory, setSplitHistory] = useState(initialSplitHistory);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newIcpPercentage, setNewIcpPercentage] = useState(60);
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [scheduleChange, setScheduleChange] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState(null);
  const [effectiveTime, setEffectiveTime] = useState('00:00');

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const totalRevenue = useMemo(() => CLIENTS.reduce((sum, c) => sum + c.revenue, 0), []);
  const totalIcpShare = Math.round((totalRevenue * (actualSplit.icp / 100)) * 100) / 100;
  const totalDalilShare = totalRevenue - totalIcpShare;

  const handleOpenEdit = () => {
    setNewIcpPercentage(actualSplit.icp);
    setRequiresApproval(true);
    setScheduleChange(false);
    setEffectiveDate(null);
    setIsEditModalOpen(true);
  };

  const handleSaveGlobalSplit = () => {
    const newSplit = {
      icp: Number(newIcpPercentage.toFixed(2)),
      dalil: Number((100 - newIcpPercentage).toFixed(2))
    };

    const historyEntry = {
      id: splitHistory.length + 1,
      date: new Date().toISOString(),
      icp: newSplit.icp,
      dalil: newSplit.dalil,
      changedBy: 'admin@icp.ae',
      status: requiresApproval ? 'pending' : 'approved',
      approvedBy: requiresApproval ? null : 'admin@icp.ae',
      effectiveDate: scheduleChange && effectiveDate ? effectiveDate.toISOString() : new Date().toISOString()
    };

    if (requiresApproval) {
      setPendingSplit({
        ...newSplit,
        requestedBy: 'admin@icp.ae',
        requestedAt: new Date().toISOString(),
        effectiveDate: scheduleChange && effectiveDate ? effectiveDate.toISOString() : null
      });
    } else {
      updateActualSplit(newSplit.icp);
    }

    setSplitHistory([...splitHistory, historyEntry]);
    setIsEditModalOpen(false);
  };

  const handleApprovePending = () => {
    if (pendingSplit) {
      updateActualSplit(pendingSplit.icp);
      setSplitHistory(splitHistory.map((h, i) =>
        i === splitHistory.length - 1
          ? { ...h, status: 'approved', approvedBy: 'checker@icp.ae' }
          : h
      ));
      setPendingSplit(null);
    }
  };

  const handleRejectPending = () => {
    setSplitHistory(splitHistory.map((h, i) =>
      i === splitHistory.length - 1
        ? { ...h, status: 'rejected', rejectedBy: 'checker@icp.ae' }
        : h
    ));
    setPendingSplit(null);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-50 text-emerald-700';
      case 'pending':
        return 'bg-amber-50 text-amber-700';
      case 'rejected':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Split Ratio Configuration</h1>
          <p className="text-sm text-gray-500 mt-1">Manage global revenue distribution between ICP and Dalil</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsHistoryOpen(true)}>
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
          <Button size="sm" className="bg-gray-900 hover:bg-gray-800" onClick={handleOpenEdit}>
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Pending Change Alert */}
      {pendingSplit && (
        <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600" />
            <div>
              <p className="font-medium text-gray-900">Pending Approval</p>
              <p className="text-sm text-gray-600">
                New ratio: {pendingSplit.icp.toFixed(2)}% / {pendingSplit.dalil.toFixed(2)}%
                <span className="text-gray-400 ml-2">• by {pendingSplit.requestedBy}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleRejectPending}>
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </Button>
            <Button size="sm" className="bg-gray-900 hover:bg-gray-800" onClick={handleApprovePending}>
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Approve
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards - 2 boxes only */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Split Ratio Box */}
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500 mb-4">Current Split Ratio</p>
            <div className="flex items-center gap-8">
              <div>
                <p className="text-4xl font-bold text-gray-900">{actualSplit.icp.toFixed(2)}%</p>
                <p className="text-sm text-gray-500 mt-1">ICP Share</p>
                <p className="text-sm font-medium text-gray-700 mt-1">{formatCurrency(totalIcpShare)}</p>
              </div>
              <div className="text-3xl text-gray-200 font-light">/</div>
              <div>
                <p className="text-4xl font-bold text-gray-900">{actualSplit.dalil.toFixed(2)}%</p>
                <p className="text-sm text-gray-500 mt-1">Dalil Share</p>
                <p className="text-sm font-medium text-gray-700 mt-1">{formatCurrency(totalDalilShare)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue & Clients Box */}
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500 mb-4">Portfolio Overview</p>
            <div className="flex items-center gap-10">
              <div>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                <p className="text-sm text-gray-500 mt-1">Total Revenue</p>
              </div>
              <div className="h-12 w-px bg-gray-200" />
              <div>
                <p className="text-3xl font-bold text-gray-900">{CLIENTS.filter(c => c.status === 'active').length}</p>
                <p className="text-sm text-gray-500 mt-1">Active Clients</p>
              </div>
              <div className="h-12 w-px bg-gray-200" />
              <div>
                <p className="text-sm font-medium text-gray-900">{formatDate(splitHistory[splitHistory.length - 1]?.date)}</p>
                <p className="text-sm text-gray-500 mt-1">Last Updated</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Simulation Mode Available</p>
              <p className="text-sm text-gray-600 mt-1">
                Use the simulation toggle in the sidebar to test different split ratios across the entire dashboard.
                Simulation mode allows you to see how different ratios would affect revenue distribution without making permanent changes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configure Global Split Ratio</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>This change will affect revenue distribution for all clients.</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm text-gray-600">ICP Percentage</Label>
                <Input
                  type="number"
                  value={newIcpPercentage}
                  onChange={(e) => setNewIcpPercentage(Math.min(100, Math.max(0, Number(e.target.value))))}
                  className="w-24 text-center"
                  step="0.01"
                />
              </div>
              <Slider
                value={[newIcpPercentage]}
                onValueChange={(value) => setNewIcpPercentage(value[0])}
                max={100}
                min={0}
                step={0.01}
              />
            </div>

            <div className="flex items-center justify-center gap-6 py-4 bg-gray-50 rounded-xl">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{newIcpPercentage.toFixed(2)}%</p>
                <p className="text-xs text-gray-500 mt-1">ICP</p>
              </div>
              <div className="text-2xl text-gray-300">/</div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{(100 - newIcpPercentage).toFixed(2)}%</p>
                <p className="text-xs text-gray-500 mt-1">Dalil</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-600">Requires Approval</Label>
                <Switch checked={requiresApproval} onCheckedChange={setRequiresApproval} />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-600">Schedule for later</Label>
                <Switch checked={scheduleChange} onCheckedChange={setScheduleChange} />
              </div>

              {scheduleChange && (
                <div className="flex gap-2 pt-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex-1 justify-start text-sm">
                        <CalendarDays className="w-4 h-4 mr-2" />
                        {effectiveDate ? format(effectiveDate, 'PPP') : 'Pick date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={effectiveDate}
                        onSelect={setEffectiveDate}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <Select value={effectiveTime} onValueChange={setEffectiveTime}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                          {`${i.toString().padStart(2, '0')}:00`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button className="bg-gray-900 hover:bg-gray-800" onClick={handleSaveGlobalSplit}>
              {requiresApproval ? 'Submit for Approval' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Modal */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Split Ratio History</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 font-medium text-gray-500">Ratio</th>
                  <th className="text-left py-3 font-medium text-gray-500">Changed By</th>
                  <th className="text-left py-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {[...splitHistory].reverse().map((item) => (
                  <tr key={item.id} className="border-b border-gray-50">
                    <td className="py-3 text-gray-900">{formatDate(item.date)}</td>
                    <td className="py-3">
                      <span className="font-mono font-medium">{item.icp}/{item.dalil}</span>
                    </td>
                    <td className="py-3 text-gray-600">{item.changedBy}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${getStatusStyle(item.status)}`}>
                        {item.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                        {item.status === 'pending' && <Clock className="w-3 h-3" />}
                        {item.status === 'rejected' && <XCircle className="w-3 h-3" />}
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHistoryOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
