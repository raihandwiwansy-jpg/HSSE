'use client';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInsidenById, updateStatusInsiden } from '@/lib/api/insiden';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'react-toastify';
import { ChevronLeft, Calendar, MapPin, Tag, User, Clock, FileText, CheckCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import WifiLoader from '@/components/ui/WifiLoader';
import Image from 'next/image';
import ExportButtons from '@/components/ui/ExportButtons';

export default function InsidenDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const qc = useQueryClient();
  const { user } = useAuth();

  if (user && user.role !== 'admin' && user.role !== 'kasubag') {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-red-200 dark:border-red-900/30 text-center max-w-md mx-auto my-12 shadow-sm animate-fade-in-up">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-600 dark:text-red-400">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-lg font-bold text-gray-850 dark:text-white">Akses Ditolak</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Anda tidak memiliki akses ke modul Laporan Insiden. Silakan kembali ke Dashboard.
        </p>
        <Button onClick={() => router.push('/dashboard')} size="sm" className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  const { data, isLoading } = useQuery({
    queryKey: ['insiden', id],
    queryFn: () => getInsidenById(Number(id)),
  });

  const statusMut = useMutation({
    mutationFn: ({ status }: { status: string }) => updateStatusInsiden(Number(id), status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['insiden', id] });
      qc.invalidateQueries({ queryKey: ['insidens'] });
      toast.success('Status insiden berhasil diperbarui');
    },
    onError: () => toast.error('Gagal memperbarui status insiden'),
  });

  const insiden = data?.data?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <WifiLoader text="Memuat detail insiden..." />
      </div>
    );
  }

  if (!insiden) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-250 dark:border-gray-700">
        <p className="text-gray-500 font-semibold mb-4">Laporan insiden tidak ditemukan</p>
        <Button onClick={() => router.push('/insiden')}>Kembali ke Daftar</Button>
      </div>
    );
  }

  const getJenisLabel = (jenis: string) => {
    switch (jenis) {
      case 'kecelakaan': return 'Kecelakaan Kerja';
      case 'near_miss': return 'Near Miss';
      case 'unsafe_condition': return 'Unsafe Condition';
      default: return jenis;
    }
  };

  const getJenisColor = (jenis: string) => {
    switch (jenis) {
      case 'kecelakaan': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20';
      case 'near_miss': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20';
      case 'unsafe_condition': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800';
    }
  };

  const handleStatusChange = (status: string) => {
    statusMut.mutate({ status });
  };

  const showStatusOptions = user?.role === 'admin' || user?.role === 'supervisor';

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/insiden')}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Kembali"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-850 dark:text-white">Detail Laporan Insiden</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Detail laporan, kronologi, bukti foto, serta penanganan status insiden.
            </p>
          </div>
        </div>
        {(user?.role === 'admin' || user?.role === 'kasubag') && (
          <div className="shrink-0">
            <ExportButtons isSingle module="insiden" id={Number(id)} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-6 space-y-5 shadow-sm">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getJenisColor(insiden.jenis)}`}>
                  <Tag size={12} />
                  {getJenisLabel(insiden.jenis)}
                </span>
                <StatusBadge status={insiden.status} />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-850 dark:text-white">{insiden.judul}</h2>
            </div>

            <hr className="border-gray-150 dark:border-gray-800" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <MapPin size={16} className="text-red-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-700 dark:text-gray-400">Lokasi</p>
                  <p className="text-xs">{insiden.lokasi}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Calendar size={16} className="text-blue-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-700 dark:text-gray-400">Tanggal Kejadian</p>
                  <p className="text-xs">
                    {new Date(insiden.tanggal_kejadian).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <User size={16} className="text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-700 dark:text-gray-400">Dilaporkan Oleh</p>
                  <p className="text-xs">{insiden.user?.name || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Clock size={16} className="text-gray-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-700 dark:text-gray-400">Dilaporkan Pada</p>
                  <p className="text-xs">
                    {new Date(insiden.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-gray-150 dark:border-gray-800" />

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-850 dark:text-white flex items-center gap-1.5">
                <FileText size={16} className="text-gray-400" />
                Deskripsi Kronologi Kejadian
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-350 leading-relaxed whitespace-pre-line">
                {insiden.deskripsi}
              </p>
            </div>

            {insiden.foto && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-850 dark:text-white">Foto Bukti Lapangan</h3>
                <div className="relative aspect-video w-full max-w-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-750">
                  <Image
                    src={`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace('/api', '')}/storage/${insiden.foto}`}
                    alt="Bukti Insiden"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {showStatusOptions && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Tindakan Perbaikan / Status
              </h3>
              <div className="space-y-2.5">
                {[
                  { value: 'pending', label: 'Pending (Baru)', desc: 'Menunggu penyelidikan awal', color: 'hover:bg-amber-50 dark:hover:bg-amber-950/20 text-amber-500' },
                  { value: 'investigation', label: 'Investigation', desc: 'Dalam proses penyelidikan', color: 'hover:bg-purple-50 dark:hover:bg-purple-950/20 text-purple-500' },
                  { value: 'resolved', label: 'Resolved (Selesai)', desc: 'Tindakan perbaikan selesai', color: 'hover:bg-green-50 dark:hover:bg-green-950/20 text-green-500' },
                  { value: 'closed', label: 'Closed (Ditutup)', desc: 'Kasus dinyatakan selesai sepenuhnya', color: 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    disabled={statusMut.isPending}
                    onClick={() => handleStatusChange(opt.value)}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                      insiden.status === opt.value
                        ? 'border-red-500 bg-red-500/5 text-red-600 dark:text-red-400 font-semibold shadow-sm'
                        : 'border-gray-200 dark:border-gray-750 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{opt.label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{opt.desc}</p>
                    </div>
                    {insiden.status === opt.value && <CheckCircle size={14} className="text-red-500 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
