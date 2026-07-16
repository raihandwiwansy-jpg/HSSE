'use client';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createManHours } from '@/lib/api/man-hours';
import { toast } from 'react-toastify';
import ManHoursForm from '@/components/man-hours/ManHoursForm';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import { Clock } from 'lucide-react';

export default function CreateManHoursPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { user } = useAuth();

  if (user && user.role !== 'admin' && user.role !== 'kasubag') {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-red-200 dark:border-red-900/30 text-center max-w-md mx-auto my-12 shadow-sm animate-fade-in-up">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-600 dark:text-red-400">
          <Clock size={32} />
        </div>
        <h2 className="text-lg font-bold text-gray-850 dark:text-white">Akses Ditolak</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Anda tidak memiliki akses ke modul Rekap Man Hours. Silakan kembali ke Dashboard.
        </p>
        <Button onClick={() => router.push('/dashboard')} size="sm" className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  const mut = useMutation({
    mutationFn: createManHours,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['man-hours'] });
      qc.invalidateQueries({ queryKey: ['dashboard-summary'] });
      qc.invalidateQueries({ queryKey: ['dashboard-role-data'] });
      toast.success('Rekap bulanan berhasil dibuat');
      router.push('/man-hours');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Gagal membuat rekap bulanan';
      toast.error(msg);
    },
  });

  const handleSubmit = (data: any) => {
    mut.mutate(data);
  };

  return (
    <ManHoursForm
      title="Tambah Rekap Bulanan"
      onSubmit={handleSubmit}
      isLoading={mut.isPending}
    />
  );
}
