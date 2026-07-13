'use client';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getManHoursById, updateManHours } from '@/lib/api/man-hours';
import { toast } from 'react-toastify';
import ManHoursForm from '@/components/man-hours/ManHoursForm';
import WifiLoader from '@/components/ui/WifiLoader';

export default function EditManHoursPage() {
  const router = useRouter();
  const { id } = useParams();
  const qc = useQueryClient();

  // Fetch current task details
  const { data: taskData, isLoading } = useQuery({
    queryKey: ['man-hour', id],
    queryFn: () => getManHoursById(Number(id)),
  });

  const task = taskData?.data?.data;

  const mut = useMutation({
    mutationFn: (data: any) => updateManHours(Number(id), data),
    onSuccess: () => {
      toast.success('Penugasan kerja berhasil diperbarui');
      qc.invalidateQueries({ queryKey: ['man-hour', id] });
      qc.invalidateQueries({ queryKey: ['man-hours'] });
      qc.invalidateQueries({ queryKey: ['dashboard-summary'] });
      qc.invalidateQueries({ queryKey: ['dashboard-role-data'] });
      router.push('/man-hours');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Gagal memperbarui penugasan';
      toast.error(msg);
    },
  });

  const handleSubmit = (formData: any) => {
    mut.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <WifiLoader text="Memuat data penugasan..." />
      </div>
    );
  }

  // Map backend keys to matching frontend initialData form fields
  const initialData = task ? {
    user_id: task.user_id,
    judul_pekerjaan: task.judul_pekerjaan,
    lokasi: task.lokasi,
    tanggal: task.tanggal,
    durasi_jam: task.durasi_jam,
    deskripsi: task.deskripsi,
  } : undefined;

  return (
    <ManHoursForm
      title="Edit Tugas Kerja"
      initialData={initialData}
      onSubmit={handleSubmit}
      isLoading={mut.isPending}
    />
  );
}
