'use client';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createManHours } from '@/lib/api/man-hours';
import { toast } from 'react-toastify';
import ManHoursForm from '@/components/man-hours/ManHoursForm';

export default function CreateManHoursPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const mut = useMutation({
    mutationFn: createManHours,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['man-hours'] });
      qc.invalidateQueries({ queryKey: ['dashboard-summary'] });
      qc.invalidateQueries({ queryKey: ['dashboard-role-data'] });
      toast.success('Penugasan kerja berhasil dibuat');
      router.push('/man-hours');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Gagal membuat penugasan kerja';
      toast.error(msg);
    },
  });

  const handleSubmit = (data: any) => {
    mut.mutate(data);
  };

  return (
    <ManHoursForm
      title="Tambah Tugas Kerja"
      onSubmit={handleSubmit}
      isLoading={mut.isPending}
    />
  );
}
