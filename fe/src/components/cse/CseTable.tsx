'use client';

import { useRouter } from 'next/navigation';
import { Eye, Edit3, Send, Trash2 } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import type { CsePermit } from '@/types';

interface CseTableProps {
  data: CsePermit[];
  page: number;
  isOwner: (item: CsePermit) => boolean;
  isAdmin: boolean;
  onEdit?: (id: number) => void;
  onsubmit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function CseTable({ data, page, isOwner, isAdmin, onEdit, onsubmit, onDelete }: CseTableProps) {
  const router = useRouter();

  if (data.length === 0) {
    return (
      <div className="hidden md:block bg-white rounded-2xl border border-gray-200 dark:bg-[#1E1E2E] dark:border-[#333355] p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">Tidak ada data CSE Permit</p>
      </div>
    );
  }

  return (
    <div className="hidden md:block bg-white rounded-2xl border border-gray-200 dark:bg-[#1E1E2E] dark:border-[#333355] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-[#333355]">
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">No</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Tanggal</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Fasilitas</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Lokasi</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Supervisor</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Pekerja</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Status</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr
                key={item.id}
                className="border-b border-gray-100 dark:border-[#333355] hover:bg-gray-50 dark:hover:bg-[#252540] transition-colors"
              >
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{(page - 1) * 10 + idx + 1}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.tanggal}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">{item.fasilitas}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.lokasi}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.supervisor}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.jumlah_pekerja}</td>
                <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1 shrink-0">
                    <button
                      onClick={() => router.push(`/cse/${item.id}`)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg dark:hover:bg-blue-900/20 transition-colors shrink-0"
                      title="Detail"
                    >
                      <Eye className="h-4 w-4 shrink-0" />
                    </button>
                    {isOwner(item) && item.status === 'draft' && onEdit && (
                      <button
                        onClick={() => onEdit(item.id)}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-700 transition-colors shrink-0"
                        title="Edit"
                      >
                        <Edit3 className="h-4 w-4 shrink-0" />
                      </button>
                    )}
                    {isOwner(item) && item.status === 'draft' && onsubmit && (
                      <button
                        onClick={() => onsubmit(item.id)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg dark:hover:bg-green-900/20 transition-colors shrink-0"
                        title="Submit"
                      >
                        <Send className="h-4 w-4 shrink-0" />
                      </button>
                    )}
                    {isAdmin && onDelete && (
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/20 transition-colors shrink-0"
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
    </div>
  );
}
