import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function FilterDropdown({ 
  label, 
  value, 
  onChange, 
  options,
  placeholder,
  className = '' 
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
          {label}
        </label>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 bg-white border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-gray-100 focus:border-gray-900 min-w-[160px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}