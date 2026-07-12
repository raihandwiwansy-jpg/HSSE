'use client';

import { useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface Filter {
  key: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: Filter[];
  onSearch?: () => void;
  onReset?: () => void;
  showReset?: boolean;
  className?: string;
}

export default function FilterBar({
  searchPlaceholder = 'Cari...',
  searchValue,
  onSearchChange,
  filters = [],
  onSearch = () => {},
  onReset,
  showReset = true,
  className = '',
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className={`bg-white dark:bg-[#1E1E2E] rounded-xl border border-gray-200 dark:border-[#333355] p-3 md:p-4 ${className}`}>
      {/* Main row: search + toggle + buttons */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" size={18} />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSearch();
              }
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Mobile filter toggle */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200"
        >
          <SlidersHorizontal size={16} />
          Filter
        </button>

        {/* Filter dropdowns - always visible on desktop, toggle on mobile */}
        <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-wrap gap-2`}>
          {filters.map((filter) => (
            <select
              key={filter.key}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition min-w-[120px]"
            >
              <option value="">{filter.label}</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
        </div>

        {/* Action Buttons */}
        <div className={`${showFilters ? 'flex' : 'hidden'} md:flex gap-2`}>
          <button
            type="button"
            onClick={onSearch}
            className="flex-1 md:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition whitespace-nowrap"
          >
            Cari
          </button>
          {showReset && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center justify-center gap-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition whitespace-nowrap"
            >
              <X size={16} />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
