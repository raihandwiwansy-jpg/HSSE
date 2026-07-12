'use client';

import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  register?: any;
  error?: any;
}

export default function Select({
  label,
  name,
  options,
  register,
  error,
  className,
  ...props
}: SelectProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={name}
          className={cn(
            "w-full px-3 py-2 appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition",
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...(register ? register(name) : {})}
          {...props}
        >
          <option value="">Pilih...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <ChevronDown size={16} />
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{typeof error === 'string' ? error : error.message}</p>}
    </div>
  );
}
