import React, { useState } from 'react';
import { format, subDays, subMonths, startOfMonth, endOfMonth, startOfYear, subYears } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const presets = [
  { label: 'All Time', value: 'all', getValue: () => ({ from: null, to: null }) },
  { label: 'Today', value: 'today', getValue: () => ({ from: new Date(), to: new Date() }) },
  { label: 'Last 7 Days', value: '7d', getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
  { label: 'Last 30 Days', value: '30d', getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
  { label: 'This Month', value: 'this_month', getValue: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
  { label: 'Last Month', value: 'last_month', getValue: () => ({ from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) }) },
  { label: 'Last 3 Months', value: '3m', getValue: () => ({ from: subMonths(new Date(), 3), to: new Date() }) },
  { label: 'Last 6 Months', value: '6m', getValue: () => ({ from: subMonths(new Date(), 6), to: new Date() }) },
  { label: 'This Year', value: 'this_year', getValue: () => ({ from: startOfYear(new Date()), to: new Date() }) },
  { label: 'Last Year', value: 'last_year', getValue: () => ({ from: startOfYear(subYears(new Date(), 1)), to: new Date(new Date().getFullYear() - 1, 11, 31) }) },
];

export default function DateRangePicker({ dateRange, onDateRangeChange, className }) {
  const [open, setOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('all');

  const handlePresetClick = (preset) => {
    setSelectedPreset(preset.value);
    const range = preset.getValue();
    onDateRangeChange(range);
    setOpen(false);
  };

  const getDisplayText = () => {
    if (!dateRange?.from && !dateRange?.to) {
      return 'All Time';
    }
    if (dateRange?.from && dateRange?.to) {
      if (format(dateRange.from, 'yyyy-MM-dd') === format(dateRange.to, 'yyyy-MM-dd')) {
        return format(dateRange.from, 'MMM dd, yyyy');
      }
      return `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd, yyyy')}`;
    }
    if (dateRange?.from) {
      return `From ${format(dateRange.from, 'MMM dd')}`;
    }
    return 'Select dates';
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[160px] sm:w-[200px] h-10 justify-start text-left font-normal border-gray-200 hover:bg-gray-50 rounded-xl",
            !dateRange?.from && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">{getDisplayText()}</span>
          <ChevronDown className="ml-auto h-4 w-4 opacity-50 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="flex flex-col sm:flex-row">
          {/* Presets - Left Side */}
          <div className="border-b sm:border-b-0 sm:border-r border-gray-100 p-3 sm:w-[180px]">
            <p className="text-xs font-semibold text-gray-500 px-2 pb-2">Quick Select</p>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-1">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePresetClick(preset)}
                  className={cn(
                    "text-left px-3 py-1.5 text-sm rounded-lg transition-colors",
                    selectedPreset === preset.value
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-100"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar - Right Side */}
          <div className="p-3">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from || new Date()}
              selected={dateRange}
              onSelect={(range) => {
                setSelectedPreset('custom');
                onDateRangeChange(range || { from: null, to: null });
              }}
              numberOfMonths={1}
            />
            {/* Apply button for custom selection */}
            {dateRange?.from && dateRange?.to && (
              <div className="flex justify-end pt-2 border-t border-gray-100 mt-2">
                <Button
                  size="sm"
                  className="bg-gray-900 hover:bg-gray-800 rounded-lg"
                  onClick={() => setOpen(false)}
                >
                  Apply
                </Button>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
