import React from 'react';
import { Navigate } from 'react-router-dom';
import FinanceLayout from '@/app/finance';
import Revenue from '@/app/finance/revenue';
import Clients from '@/app/finance/clients';
import ClientDetails from '@/app/finance/clients/client-details';
import Sectors from '@/app/finance/sectors';
import ScheduledReports from '@/app/finance/reports/scheduled-reports';
import ReportHistory from '@/app/finance/reports/report-history';
import Settings from '@/app/finance/settings';

const financeRoutes = {
  path: '/finance',
  element: <FinanceLayout />,
  children: [
    { index: true, element: <Navigate to="revenue" replace /> },
    { path: 'revenue', element: <Revenue /> },
    { path: 'clients', element: <Clients /> },
    { path: 'clients/:clientId', element: <ClientDetails /> },
    { path: 'sectors', element: <Sectors /> },
    { path: 'reports/scheduled', element: <ScheduledReports /> },
    { path: 'reports/history', element: <ReportHistory /> },
    { path: 'settings', element: <Settings /> },
  ]
};

export default financeRoutes;
