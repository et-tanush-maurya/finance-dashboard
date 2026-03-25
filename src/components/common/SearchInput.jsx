import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SearchInput({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  className = '' 
}) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-11 h-10 bg-white border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-100 rounded-xl shadow-sm"
      />
    </div>
  );
}