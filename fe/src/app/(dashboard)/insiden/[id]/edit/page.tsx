'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInsidenById, updateInsiden } from '@/lib/api/insiden';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';
import { ChevronLeft, Save, Upload, X, ShieldAlert } from 'lucide-react';
import WifiLoader from '@/components/ui/WifiLoader';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

export default function EditInsidenPage() {
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

  const [judul, setJudul] = useState('');
  const [jenis, setJenis] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentFoto, setCurrentFoto] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['insiden', id],
    queryFn: () => getInsidenById(Number(id)),
  });

  const insiden = data?.data?.data;

  useEffect(() => {
    if (insiden) {
      setJudul(insiden.judul);
      setJenis(insiden.jenis);
      setLokasi(insiden.lokasi);
      setTanggal(insiden.tanggal_kejadian);
      setDeskripsi(insiden.deskripsi);
      if (insiden.foto) {
        setCurrentFoto(insiden.foto);
      }
    }
  }, [insiden]);

  const mut = useMutation({
    mutationFn: (formData: FormData) => updateInsiden(Number(id), formData),
    onSuccess: () => {
      toast.success('Laporan insiden berhasil diperbarui');
      qc.invalidateQueries({ queryKey: ['insiden', id] });
      qc.invalidateQueries({ queryKey: ['insidens'] });
      router.push(`/insiden/${id}`);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Gagal memperbarui laporan insiden';
      toast.error(msg);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ukuran foto maksimal adalah 2MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast.error('Format foto harus JPEG atau PNG');
        return;
      }
      setFoto(file);
      setPreview(URL.createObjectURL(file));
      setCurrentFoto(null); // Overwrite current photo
    }
  };

  const handleRemoveFoto = () => {
    setFoto(null);
    setPreview(null);
    setCurrentFoto(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !jenis || !lokasi.trim() || !tanggal || !deskripsi.trim()) {
      toast.error('Mohon lengkapi semua field wajib');
      return;
    }

    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('jenis', jenis);
    formData.append('lokasi', lokasi);
    formData.append('tanggal_kejadian', tanggal);
    formData.append('deskripsi', deskripsi);
    if (foto) {
      formData.append('foto', foto);
    } else if (!currentFoto) {
      // If photo was removed
      formData.append('foto_removed', 'true');
    }

    mut.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <WifiLoader text="Memuat data insiden..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push(`/insiden/${id}`)}
          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="Kembali"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-850 dark:text-white">Edit Laporan Insiden</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Perbarui informasi kronologi, jenis, lokasi atau bukti foto laporan insiden.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-1 md:col-span-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Judul Insiden <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Masukkan judul laporan insiden..."
                value={judul}
                onChange={e => setJudul(e.target.value)}
                className="hse-input text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Jenis Insiden <span className="text-red-500">*</span>
              </label>
              <select
                value={jenis}
                onChange={e => setJenis(e.target.value)}
                className="hse-input text-sm"
                required
              >
                <option value="">Pilih jenis insiden...</option>
                <option value="kecelakaan">Kecelakaan Kerja</option>
                <option value="near_miss">Near Miss (Hampir Celaka)</option>
                <option value="unsafe_condition">Unsafe Condition (Kondisi Tidak Aman)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Tanggal Kejadian <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={e => setTanggal(e.target.value)}
                className="hse-input text-sm"
                required
              />
            </div>

            <div className="space-y-1.5 col-span-1 md:col-span-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Lokasi Kejadian <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Masukkan spesifikasi lokasi kejadian..."
                value={lokasi}
                onChange={e => setLokasi(e.target.value)}
                className="hse-input text-sm"
                required
              />
            </div>

            <div className="space-y-1.5 col-span-1 md:col-span-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Deskripsi Kronologi Kejadian <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Jelaskan detail kejadian, kronologi, serta dampak insiden secara terperinci..."
                value={deskripsi}
                onChange={e => setDeskripsi(e.target.value)}
                className="hse-input text-sm min-h-[120px]"
                required
              />
            </div>

            <div className="space-y-1.5 col-span-1 md:col-span-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Foto Bukti Pendukung <span className="text-gray-400 font-normal">(Opsional, Maksimal 2MB, Format: JPG/PNG)</span>
              </label>

              {!preview && !currentFoto ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-750 hover:border-red-500 dark:hover:border-red-500 transition-colors rounded-2xl p-6 text-center cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 block">Klik untuk memilih foto baru</span>
                  <span className="text-[10px] text-gray-455 mt-1 block">Format file JPG atau PNG (maksimal 2MB)</span>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-750 bg-gray-50 dark:bg-gray-800 p-2 max-w-sm">
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden">
                    <Image
                      src={preview || `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace('/api', '')}/storage/${currentFoto}`}
                      alt="Bukti Foto"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFoto}
                    className="absolute top-4 right-4 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-150 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/insiden/${id}`)}
              disabled={mut.isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              isLoading={mut.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Save size={16} /> Perbarui Laporan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
