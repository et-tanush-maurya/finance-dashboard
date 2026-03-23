
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from './utils';
import {
  LayoutDashboard,
  Grid3X3,
  Settings,
  ChevronDown,
  FileText,
  Menu,
  X,
  User,
  LogOut,
  Users,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import Logo from '../assets/logos/UAEKYC LOGO BlacK.svg';
import KElement from '../assets/UAEKYC LOGO Element.svg';

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
        w-72 xl:w-64 h-screen bg-gray-950 backdrop-blur-xl border-r border-gray-800
        transform transition-transform duration-300 ease-out shadow-xl lg:shadow-none overflow-hidden
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col overflow-hidden">
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-gray-800">
            <Link to={createPageUrl('Dashboard')} className="flex items-center group">
              <img src={Logo} alt="UAEKYC Logo" className="h-8 w-auto invert brightness-200" />
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
                        ? 'bg-gray-800 text-white shadow-sm'
                        : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
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
                  <div className="mt-2 ml-4 pl-4 border-l-2 border-gray-700 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.page}
                          to={createPageUrl(child.page)}
                          className={`
                            flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                            ${isActive(child.page)
                              ? 'bg-white text-gray-900 shadow-lg'
                              : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
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
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            ))}
          </nav>

          {/* Profile at bottom */}
          <div className="p-4 border-t border-gray-800">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full flex items-center gap-3 text-sm text-gray-300 hover:bg-gray-800/60 hover:text-white rounded-xl px-3 py-2 justify-start">
                  <div className="w-9 h-9 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-300" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-medium text-gray-200">Admin</span>
                    <p className="text-xs text-gray-500">admin@icp.ae</p>
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

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 xl:p-10 overflow-auto relative">
          <img
            src={KElement}
            alt=""
            aria-hidden="true"
            className="fixed bottom-[-40px] right-[-20px] w-[340px] h-auto opacity-[0.04] pointer-events-none select-none"
          />
          <div className="w-full relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
