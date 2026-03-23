
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from './utils';
import {
  LayoutDashboard,
  Grid3X3,
  Settings,
  ChevronDown,
  SplitSquareVertical,
  FileText,
  Menu,
  X,
  User,
  LogOut,
  Users,
  FlaskConical,
  Building2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useSplitRatio } from '../contexts/SplitRatioContext';
import { CLIENTS } from '../components/data/mockData';
import { formatCurrency, formatCompactNumber } from '../components/utils/formatters';
import Logo from '../assets/logos/UAEKYC LOGO BlacK.svg';

const navItems = [
  {
    label: 'Overview',
    icon: LayoutDashboard,
    page: 'Dashboard'
  },
  {
    label: 'Clients',
    icon: Building2,
    page: 'Clients'
  },
  {
    label: 'Sectors',
    icon: Grid3X3,
    page: 'SectorAnalytics'
  },
  {
    label: 'User Management',
    icon: Users,
    page: 'UserManagement'
  },
  {
    label: 'Reports',
    icon: FileText,
    children: [
      // { label: 'Split Ratio', icon: SplitSquareVertical, page: 'SplitRatioConfig' },
      { label: 'Scheduled Reports', icon: FileText, page: 'ScheduleReport' },
      { label: 'Report History', icon: FileText, page: 'ReportAutomation' }
    ]
  }
];

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const location = useLocation();
  const {
    activeSplit,
    simulatedSplit,
    isSimulationMode,
    toggleSimulation,
    updateSimulatedSplit
  } = useSplitRatio();

  const isActive = (page) => {
    return currentPageName === page;
  };

  const isReportsActive = () => {
    return ['SplitRatioConfig', 'ReportAutomation', 'ScheduleReport'].includes(currentPageName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50
        w-72 xl:w-64 h-screen bg-white/80 backdrop-blur-xl border-r border-gray-100
        transform transition-transform duration-300 ease-out shadow-xl lg:shadow-none overflow-hidden
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col overflow-hidden">
          {/* Logo */}
          <div className="h-20 flex items-center  px-6 border-b border-gray-100">
            <Link to={createPageUrl('Dashboard')} className="flex items-center group">
              <img src={Logo} alt="UAEKYC Logo" className="h-8 w-auto" />
            </Link>
            {/* <button
              className="lg:hidden p-1 hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button> */}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-2">
            {navItems.map((item) => (
              item.children ? (
                <div key={item.label}>
                  <button
                    onClick={() => setReportsOpen(!reportsOpen)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl
                      transition-all duration-200
                      ${isReportsActive()
                        ? 'bg-gray-100 text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${reportsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {reportsOpen && (
                  <div className="mt-2 ml-4 pl-4 border-l-2 border-gray-200 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.page}
                          to={createPageUrl(child.page)}
                          className={`
                            flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                            ${isActive(child.page)
                              ? 'bg-gray-900 text-white shadow-lg'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }
                          `}
                        >
                          <child.icon className="w-4 h-4" />
                          <span>{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`
                    flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200
                    ${isActive(item.page)
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            ))}
          </nav>

          {/* Split Ratio Section */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <SplitSquareVertical className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-500 uppercase">ICP Share</span>
              </div>
              <div className="flex items-center gap-2">
                <FlaskConical className={`w-3.5 h-3.5 ${isSimulationMode ? 'text-amber-500' : 'text-gray-400'}`} />
                <Switch
                  checked={isSimulationMode}
                  onCheckedChange={toggleSimulation}
                  className="scale-75"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 space-y-2">
              {(() => {
                const totalRevenue = CLIENTS.reduce((sum, c) => sum + c.revenue, 0);
                const icpRevenue = Math.round((totalRevenue * (activeSplit.icp / 100)) * 100) / 100;
                const activeClients = CLIENTS.filter(c => c.status === 'active').length;
                return (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-500">My Split</span>
                      <span className="text-sm font-bold text-gray-900">{activeSplit.icp.toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-500">Total Revenue</span>
                      <span className="text-sm font-semibold text-gray-900">{formatCompactNumber(totalRevenue)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-500">My Revenue</span>
                      <span className="text-sm font-semibold text-gray-900">{formatCompactNumber(icpRevenue)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      {/* <span className="text-[11px] text-gray-500">Active Clients</span> */}
                      {/* <span className="text-sm font-semibold text-gray-900">{activeClients}</span> */}
                    </div>
                  </>
                );
              })()}

              {isSimulationMode && (
                <div className="pt-2 border-t border-gray-200">
                  <Slider
                    value={[simulatedSplit.icp]}
                    onValueChange={(value) => updateSimulatedSplit(value[0])}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              )}
            </div>

            {isSimulationMode && (
              <p className="text-[10px] text-amber-600 mt-2 text-center">
                Simulation Mode Active
              </p>
            )}
          </div>

          {/* Profile at bottom */}
          <div className="p-4 border-t border-gray-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl px-3 py-2 justify-start">
                  <div className="w-9 h-9 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-medium">Admin</span>
                    <p className="text-xs text-gray-400">admin@icp.ae</p>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {/* <DropdownMenuItem className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Profile 
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64 xl:ml-64">
        {/* Mobile menu button */}
        <div className="lg:hidden p-4">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Simulation Banner */}
        {isSimulationMode && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
            <div className="flex items-center justify-center gap-2 text-sm text-amber-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">Simulation Mode:</span>
              <span>Data shown reflects simulated split ratio ({activeSplit.icp}% / {activeSplit.dalil}%). This is not actual data.</span>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 xl:p-10 overflow-auto">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
