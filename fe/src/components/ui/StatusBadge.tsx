'use client';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, XCircle, FileEdit, Send, Shield, Stamp } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  menunggu: {
    label: 'Menunggu Konfirmasi Admin',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  selesai: {
    label: 'Selesai',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: <CheckCircle className="h-3.5 w-3.5" />,
  },
  draft: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    icon: <FileEdit className="h-3.5 w-3.5" />,
  },
  submitted: {
    label: 'Menunggu Supervisor',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    icon: <Send className="h-3.5 w-3.5" />,
  },
  approved: {
    label: 'Approved',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: <CheckCircle className="h-3.5 w-3.5" />,
  },
  supervisor_approved: {
    label: 'Menunggu HSSE',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    icon: <Shield className="h-3.5 w-3.5" />,
  },
  supervisor_rejected: {
    label: 'Ditolak Supervisor',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
  hse_approved: {
    label: 'Siap Dikerjakan',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    icon: <Stamp className="h-3.5 w-3.5" />,
  },
  hse_rejected: {
    label: 'Ditolak HSSE',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
  rejected: {
    label: 'Ditolak',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
  work_ready: {
    label: 'Menunggu Konfirmasi Admin',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  completed: {
    label: 'Selesai',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: <CheckCircle className="h-3.5 w-3.5" />,
  },
  closed: {
    label: 'Closed',
    color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    icon: <CheckCircle className="h-3.5 w-3.5" />,
  },
  pending: {
    label: 'Pending',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  investigation: {
    label: 'Dalam Penyelidikan',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    icon: <Shield className="h-3.5 w-3.5" />,
  },
  resolved: {
    label: 'Selesai',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: <CheckCircle className="h-3.5 w-3.5" />,
  },
  cold_work: {
    label: 'Cold Work',
    color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
    icon: <span className="text-xs">&#10052;</span>,
  },
  hot_work: {
    label: 'Hot Work',
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    icon: <span className="text-xs">&#128293;</span>,
  },
  rendah: {
    label: 'Rendah',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    icon: <span className="text-xs">&#9889;</span>,
  },
  sedang: {
    label: 'Sedang',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    icon: <span className="text-xs">&#9889;</span>,
  },
  tinggi: {
    label: 'Tinggi',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: <span className="text-xs">&#9889;</span>,
  },
};

export default function StatusBadge({ status, size = 'sm', showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold rounded-full transition-all duration-200',
        size === 'sm' ? 'px-2.5 py-1 text-[10px]' : 'px-3 py-1.5 text-xs',
        config.color
      )}
    >
      {showIcon && config.icon}
      {config.label}
    </span>
  );
}
