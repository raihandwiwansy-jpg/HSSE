'use client';

import { Loader2 } from 'lucide-react';
import { useMasterData } from '@/hooks/useMasterData';

interface Props {
  masterType: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function MasterSelect({
  masterType, value, onChange,
  placeholder = 'Pilih...', className = '',
  disabled, required,
}: Props) {
  const { options, loading } = useMasterData(masterType);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || loading}
      required={required}
      className={`w-full text-xs border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <option value="">{loading ? 'Memuat...' : placeholder}</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.nama || opt.name || ''}>
          {opt.nama || opt.name || ''}
        </option>
      ))}
      {value && !options.find((o) => o.nama === value || o.name === value) && (
        <option value={value} disabled>{value}</option>
      )}
    </select>
  );
}

export function MasterSelectInline({
  masterType, value, onChange,
  placeholder = 'Pilih...', className = '',
  disabled, required,
}: Props) {
  const { options, loading } = useMasterData(masterType);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || loading}
      required={required}
      className={`text-xs border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none disabled:opacity-50 ${className}`}
    >
      <option value="">{loading ? '...' : placeholder}</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.nama || opt.name || ''}>
          {opt.nama || opt.name || ''}
        </option>
      ))}
    </select>
  );
}
