import { cn } from '@/lib/utils';

interface BadgeProps {
  status: string;
  children?: React.ReactNode;
}

const colors: Record<string, string> = {
  pending: 'hse-badge-pending badge-pulse-pending',
  approved: 'hse-badge-approved',
  rejected: 'hse-badge-rejected',
  draft: 'hse-badge-draft',
  submitted: 'hse-badge-submitted',
  completed: 'hse-badge-completed',
  investigation: 'hse-badge-investigation',
  resolved: 'hse-badge-resolved',
  closed: 'hse-badge-closed',
  aktif: 'hse-badge-approved',
  kadaluarsa: 'hse-badge-rejected',
  habis: 'hse-badge-rejected',
  nonaktif: 'hse-badge-closed',
  rendah: 'hse-badge-rendah',
  sedang: 'hse-badge-sedang',
  tinggi: 'hse-badge-tinggi',
  kecelakaan: 'hse-badge-kecelakaan',
  near_miss: 'hse-badge-near_miss',
  unsafe_condition: 'hse-badge-unsafe_condition',
  cold_work: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  hot_work: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
};

const customLabels: Record<string, string> = {
  cold_work: 'Kerja Dingin',
  hot_work: 'Kerja Panas',
};

function formatLabel(status: string): string {
  if (customLabels[status]) return customLabels[status];
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Badge({ status, children }: BadgeProps) {
  return (
    <span className={cn('hse-badge transition-all duration-200', colors[status] || 'hse-badge-draft')}>
      {children || formatLabel(status)}
    </span>
  );
}
