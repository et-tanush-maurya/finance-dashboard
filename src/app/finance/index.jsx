import React, { useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import FinanceSidebar from './sidebar';
import FinanceHeader from './header';
import KElement from '@/assets/UAEKYC LOGO Element.svg';

export default function FinanceLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <FinanceSidebar
        currentPath={location.pathname}
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64 xl:ml-64">
        <FinanceHeader onMenuToggle={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 xl:p-10 overflow-auto relative">
          <img
            src={KElement}
            alt=""
            aria-hidden="true"
            className="fixed bottom-[-40px] right-[-20px] w-[340px] h-auto opacity-[0.04] pointer-events-none select-none"
          />
          <div className="w-full relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
