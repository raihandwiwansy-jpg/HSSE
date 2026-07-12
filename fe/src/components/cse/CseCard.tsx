'use client';

import { useRouter } from 'next/navigation';
import { Eye, Edit3, Send, Trash2, Calendar, MapPin, Users, Shield } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import type { CsePermit } from '@/types';

interface CseCardProps {
  data: CsePermit;
  isOwner: boolean;
  isAdmin: boolean;
  onEdit?: (id: number) => void;
  onsubmit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function CseCard({ data, isOwner, isAdmin, onEdit, onsubmit, onDelete }: CseCardProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm dark:bg-[#1E1E2E] dark:border-[#333355] transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            CSE-{String(data.id).padStart(3, '0')}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
            <Calendar className="h-3 w-3" />
            {data.tanggal}
          </p>
        </div>
        <StatusBadge status={data.status} />
      </div>

      <div className="space-y-2 mb-3">
        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{data.fasilitas}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {data.lokasi}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Shield className="h-3 w-3" />
          Supervisor: {data.supervisor}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Users className="h-3 w-3" />
          {data.jumlah_pekerja} Pekerja
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2">
          {data.alasan}
        </p>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => router.push(`/cse/${data.id}`)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          Detail
        </button>

        {isOwner && data.status === 'draft' && onEdit && (
          <button
            onClick={() => onEdit(data.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit
          </button>
        )}

        {isOwner && data.status === 'draft' && onsubmit && (
          <button
            onClick={() => onsubmit(data.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-green-600 bg-green-50 rounded-xl hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30 transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
            Submit
          </button>
        )}

        {isAdmin && onDelete && (
          <button
            onClick={() => onDelete(data.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-xl dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
