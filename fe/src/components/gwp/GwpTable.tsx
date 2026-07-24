'use client';

import { useRouter } from 'next/navigation';
import { Eye, Edit3, Send, Trash2 } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import type { GwpPermit } from '@/types';

interface GwpTableProps {
  data: GwpPermit[];
  page: number;
  isOwner: (item: GwpPermit) => boolean;
  isAdmin: boolean;
  onEdit?: (id: number) => void;
  onsubmit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function GwpTable({ data, page, isOwner, isAdmin, onEdit, onsubmit, onDelete }: GwpTableProps) {
  const router = useRouter();

  return (
    <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm dark:bg-[#1E1E2E] dark:border-[#333355] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">No</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tanggal</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Departemen</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lokasi</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kategori</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {data.map((item, index) => (
              <tr
                key={item.id}
                onClick={() => router.push(`/gwp/${item.id}`)}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {(page - 1) * 10 + index + 1}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">
                  {item.tanggal}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">
                  {item.departemen}
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {item.lokasi}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={item.kategori_pekerjaan} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); router.push(`/gwp/${item.id}`); }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors shrink-0"
                      title="Detail"
                    >
                      <Eye className="h-4 w-4 shrink-0" />
                    </button>

                    {isOwner(item) && item.status === 'draft' && onEdit && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(item.id); }}
                        className="p-1.5 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors shrink-0"
                        title="Edit"
                      >
                        <Edit3 className="h-4 w-4 shrink-0" />
                      </button>
                    )}

                    {isOwner(item) && item.status === 'draft' && onsubmit && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onsubmit(item.id); }}
                        className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors shrink-0"
                        title="Submit"
                      >
                        <Send className="h-4 w-4 shrink-0" />
                      </button>
                    )}

                    {isAdmin && onDelete && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4 shrink-0" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">Tidak ada data GWP</p>
        </div>
      )}
    </div>
  );
}
