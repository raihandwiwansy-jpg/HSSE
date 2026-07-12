'use client';

import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = '',
  size = 'md',
}: CheckboxProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const iconSize = { sm: 10, md: 12, lg: 14 };

  return (
    <label
      className={`group flex items-start gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div
          className={`
            ${sizeClasses[size]} rounded-lg border-2 transition-all duration-200 ease-in-out
            flex items-center justify-center
            ${checked
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-500 shadow-md shadow-blue-500/25 scale-100'
              : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 group-hover:border-blue-400 dark:group-hover:border-blue-500 scale-100'
            }
            ${!disabled && !checked ? 'group-hover:shadow-sm group-hover:scale-105' : ''}
            ${disabled ? '' : 'active:scale-95'}
          `}
        >
          <Check
            size={iconSize[size]}
            className={`text-white transition-all duration-200 ${
              checked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
            strokeWidth={3}
          />
        </div>
      </div>
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-tight block">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed block mt-0.5">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}
