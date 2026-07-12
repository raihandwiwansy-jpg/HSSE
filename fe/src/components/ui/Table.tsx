'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
}

export default function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  onRowClick,
}: TableProps<T>) {
  return (
    <div className="hse-table-container">
      <table className="hse-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={col.className}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-10">
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Memuat data...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-10">
                <div className="text-gray-400">
                  <p className="text-sm font-medium">Tidak ada data</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, rowIdx) => (
              <tr
                key={item.id ?? rowIdx}
                className={cn(
                  'transition-colors duration-150',
                  onRowClick && 'cursor-pointer hover:bg-[#f0faf0] dark:hover:bg-[#1E1E34]'
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={col.className}>
                    {typeof col.accessor === 'function'
                      ? col.accessor(item)
                      : item[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
