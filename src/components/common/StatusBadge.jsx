import React from 'react';

const statusStyles = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-gray-100 text-gray-600 border-gray-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

export default function StatusBadge({ status, className = '' }) {
  const style = statusStyles[status] || statusStyles.inactive;
  
  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold border rounded-full capitalize ${style} ${className}`}>
      {status}
    </span>
  );
}