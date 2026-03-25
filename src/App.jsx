import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SplitRatioProvider } from '@/contexts/SplitRatioContext';
import { Toaster } from "@/components/ui/toaster"
import FinanceLayout from '@/app/finance';
import Revenue from '@/app/finance/revenue';
import Clients from '@/app/finance/clients';
import ClientDetails from '@/app/finance/clients/client-details';
import Sectors from '@/app/finance/sectors';
import ScheduledReports from '@/app/finance/reports/scheduled-reports';
import ReportHistory from '@/app/finance/reports/report-history';
import Settings from '@/app/finance/settings';

function App() {
  return (
    <SplitRatioProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/finance/revenue" replace />} />
          <Route path="/finance" element={<FinanceLayout />}>
            <Route index element={<Navigate to="revenue" replace />} />
            <Route path="revenue" element={<Revenue />} />
            <Route path="clients" element={<Clients />} />
            <Route path="clients/:clientId" element={<ClientDetails />} />
            <Route path="sectors" element={<Sectors />} />
            <Route path="reports/scheduled" element={<ScheduledReports />} />
            <Route path="reports/history" element={<ReportHistory />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {/* Legacy routes redirect to new paths */}
          <Route path="/dashboard" element={<Navigate to="/finance/revenue" replace />} />
          <Route path="/clients" element={<Navigate to="/finance/clients" replace />} />
          <Route path="/clientprofile" element={<Navigate to="/finance/clients" replace />} />
          <Route path="/sectoranalytics" element={<Navigate to="/finance/sectors" replace />} />
          <Route path="/schedulereport" element={<Navigate to="/finance/reports/scheduled" replace />} />
          <Route path="/reportautomation" element={<Navigate to="/finance/reports/history" replace />} />
          <Route path="/usermanagement" element={<Navigate to="/finance/settings" replace />} />
          <Route path="*" element={<Navigate to="/finance/revenue" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </SplitRatioProvider>
  )
}

export default App
