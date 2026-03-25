import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Grid3X3,
  ChevronDown,
  ChevronsUpDown,
  FileText,
  Users,
  Building2,
  User,
  LogOut,
  KeyRound
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import LogoWhite from '@/assets/logos/UAEKYC LOGO White.png';
import LogoIcon from '@/assets/logos/icp.jpg';

const navItems = [
  {
    label: 'Overview',
    icon: LayoutDashboard,
    path: '/finance/revenue'
  },
  {
    label: 'Clients',
    icon: Building2,
    path: '/finance/clients'
  },
  {
    label: 'Sectors',
    icon: Grid3X3,
    path: '/finance/sectors'
  },
  {
    label: 'User Management',
    icon: Users,
    path: '/finance/settings'
  },
  {
    label: 'Reports',
    icon: FileText,
    children: [
      { label: 'Scheduled Reports', icon: FileText, path: '/finance/reports/scheduled' },
      { label: 'Report History', icon: FileText, path: '/finance/reports/history' }
    ]
  }
];

export default function FinanceSidebar({ currentPath, sidebarOpen, onClose }) {
  const [reportsOpen, setReportsOpen] = useState(true);

  const isActive = (path) => currentPath === path;

  const isReportsActive = () => {
    return currentPath?.startsWith('/finance/reports');
  };

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50
      w-72 xl:w-64 h-screen bg-gray-950 backdrop-blur-xl border-r border-gray-800
      transform transition-transform duration-300 ease-out shadow-xl lg:shadow-none overflow-hidden
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Logo */}
        <div className="h-20 flex items-center px-4">
          <Link
            to="/finance/revenue"
            className="flex items-center gap-3 w-full px-2 py-2.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center">
              <img src={LogoIcon} alt="" className="w-8 h-8" />
            </div>
            <img src={LogoWhite} alt="UAEKYC Logo" className="h-5 w-auto flex-1 object-contain object-left" />
            <ChevronsUpDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 pt-2 space-y-2">
          {navItems.map((item) => (
            item.children ? (
              <div key={item.label}>
                <button
                  onClick={() => setReportsOpen(!reportsOpen)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl
                    transition-all duration-200
                    ${isReportsActive()
                      ? 'bg-white/15 text-white shadow-sm'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
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
                <div className="mt-2 ml-4 pl-4 border-l-2 border-white/20 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                          ${isActive(child.path)
                            ? 'bg-white text-gray-900 shadow-lg'
                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
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
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200
                  ${isActive(item.path)
                    ? 'bg-white text-gray-900 shadow-lg'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
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
        <div className="p-4 border-t border-white/15">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center gap-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-xl px-3 py-2 justify-start">
                <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-300" />
                </div>
                <div className="flex-1 text-left">
                  <span className="font-medium text-gray-200">Admin</span>
                  <p className="text-xs text-gray-400">admin@icp.ae</p>
                </div>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-56 p-2 rounded-xl mb-2">
              <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2.5">
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2.5">
                <KeyRound className="w-4 h-4 mr-2" />
                Update Password
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1.5" />
              <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2.5 text-red-600 focus:text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
}
