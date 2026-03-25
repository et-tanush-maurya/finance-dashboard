import React from 'react';
import { Menu } from 'lucide-react';

export default function FinanceHeader({ onMenuToggle }) {
  return (
    <div className="lg:hidden p-4">
      <button
        className="p-2 hover:bg-gray-100 rounded-lg"
        onClick={onMenuToggle}
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}
