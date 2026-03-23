import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Clients from "./Clients";

import ClientProfile from "./ClientProfile";

import SectorAnalytics from "./SectorAnalytics";

import UserManagement from "./UserManagement";

import ScheduleReport from "./ScheduleReport";

import SplitRatioConfig from "./SplitRatioConfig";

import ReportAutomation from "./ReportAutomation";

import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { SplitRatioProvider } from '../contexts/SplitRatioContext';

const PAGES = {

    Dashboard: Dashboard,

    Clients: Clients,

    ClientProfile: ClientProfile,

    SectorAnalytics: SectorAnalytics,

    UserManagement: UserManagement,

    ScheduleReport: ScheduleReport,

    // SplitRatioConfig: SplitRatioConfig,

    ReportAutomation: ReportAutomation,

}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/Clients" element={<Clients />} />
                <Route path="/clientprofile" element={<ClientProfile />} />
                <Route path="/ClientProfile" element={<ClientProfile />} />
                <Route path="/sectoranalytics" element={<SectorAnalytics />} />
                <Route path="/SectorAnalytics" element={<SectorAnalytics />} />
                <Route path="/usermanagement" element={<UserManagement />} />
                <Route path="/UserManagement" element={<UserManagement />} />
                <Route path="/schedulereport" element={<ScheduleReport />} />
                <Route path="/ScheduleReport" element={<ScheduleReport />} />
                <Route path="/splitratioconfig" element={<SplitRatioConfig />} />
                <Route path="/SplitRatioConfig" element={<SplitRatioConfig />} />
                <Route path="/reportautomation" element={<ReportAutomation />} />
                <Route path="/ReportAutomation" element={<ReportAutomation />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <SplitRatioProvider>
            <Router>
                <PagesContent />
            </Router>
        </SplitRatioProvider>
    );
}