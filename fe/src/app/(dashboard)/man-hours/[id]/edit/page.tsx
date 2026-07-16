'use client';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getManHoursById, updateManHours } from '@/lib/api/man-hours';
import { toast } from 'react-toastify';
import ManHoursForm from '@/components/man-hours/ManHoursForm';
import WifiLoader from '@/components/ui/WifiLoader';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import { Clock } from 'lucide-react';

export default function EditManHoursPage() {
  const router = useRouter();
  const { id } = useParams();
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

  // Fetch current task details
  const { data: taskData, isLoading } = useQuery({
    queryKey: ['man-hour', id],
    queryFn: () => getManHoursById(Number(id)),
  });

  const task = taskData?.data?.data;

  const mut = useMutation({
    mutationFn: (data: any) => updateManHours(Number(id), data),
    onSuccess: () => {
      toast.success('Rekap bulanan berhasil diperbarui');
      qc.invalidateQueries({ queryKey: ['man-hour', id] });
      qc.invalidateQueries({ queryKey: ['man-hours'] });
      qc.invalidateQueries({ queryKey: ['dashboard-summary'] });
      qc.invalidateQueries({ queryKey: ['dashboard-role-data'] });
      router.push('/man-hours');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Gagal memperbarui rekap';
      toast.error(msg);
    },
  });

  const handleSubmit = (formData: any) => {
    mut.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <WifiLoader text="Memuat data rekap..." />
      </div>
    );
  }

  return (
    <ManHoursForm
      title="Edit Rekap Bulanan"
      initialData={task}
      onSubmit={handleSubmit}
      isLoading={mut.isPending}
    />
  );
}
