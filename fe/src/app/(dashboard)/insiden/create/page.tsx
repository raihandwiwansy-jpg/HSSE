'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { createInsiden } from '@/lib/api/insiden';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';
import { ChevronLeft, Save } from 'lucide-react';
import WebcamCapture from '@/components/ui/WebcamCapture';

export default function CreateInsidenPage() {
  const router = useRouter();
  const [judul, setJudul] = useState('');
  const [jenis, setJenis] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [deskripsi, setDeskripsi] = useState('');
  const [fotoData, setFotoData] = useState<string | File | null>(null);

  const mut = useMutation({
    mutationFn: createInsiden,
    onSuccess: () => {
      toast.success('Laporan insiden berhasil dikirim');
      router.push('/insiden');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Gagal mengirim laporan insiden';
      toast.error(msg);
    },
  });

  const handleCapture = (data: string | File | null) => {
    setFotoData(data);
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

    if (fotoData instanceof File) {
      formData.append('foto_file', fotoData);
    } else if (typeof fotoData === 'string') {
      formData.append('foto', fotoData);
    }

    mut.mutate(formData);
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 sm:space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/insiden')}
          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="Kembali"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-850 dark:text-white">Laporkan Insiden Baru</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Laporkan kecelakaan kerja, near miss, atau unsafe condition untuk tindakan perbaikan segera.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Judul Insiden (Floating Label) */}
          <div className="relative">
            <input
              type="text"
              id="judul"
              placeholder=" "
              value={judul}
              onChange={e => setJudul(e.target.value)}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 dark:border-gray-650 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-red-600 peer hse-input"
              required
            />
            <label
              htmlFor="judul"
              className="absolute text-sm text-gray-505 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-red-650 peer-focus:dark:text-red-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2 cursor-text"
            >
              Judul Insiden <span className="text-red-500">*</span>
            </label>
          </div>

          {/* Grid: Jenis & Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Jenis Insiden (Select with Label) */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 ml-1">
                Jenis Insiden <span className="text-red-500">*</span>
              </label>
              <select
                value={jenis}
                onChange={e => setJenis(e.target.value)}
                className="hse-input text-sm w-full block rounded-lg border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-900 p-2.5 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                required
              >
                <option value="">Pilih jenis...</option>
                <option value="kecelakaan">Kecelakaan Kerja</option>
                <option value="near_miss">Near Miss (Hampir Celaka)</option>
                <option value="unsafe_condition">Unsafe Condition (Kondisi Tidak Aman)</option>
              </select>
            </div>

            {/* Tanggal Kejadian (Floating Label) */}
            <div className="relative pt-6">
              <input
                type="date"
                id="tanggal"
                placeholder=" "
                value={tanggal}
                onChange={e => setTanggal(e.target.value)}
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 dark:border-gray-650 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-red-600 peer hse-input"
                required
              />
              <label
                htmlFor="tanggal"
                className="absolute text-sm text-gray-505 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-8 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-red-650 peer-focus:dark:text-red-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-[60%] peer-focus:top-8 peer-focus:scale-75 peer-focus:-translate-y-4 left-2 cursor-text"
              >
                Tanggal Kejadian <span className="text-red-505">*</span>
              </label>
            </div>

          </div>

          {/* Lokasi Kejadian (Floating Label) */}
          <div className="relative">
            <input
              type="text"
              id="lokasi"
              placeholder=" "
              value={lokasi}
              onChange={e => setLokasi(e.target.value)}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 dark:border-gray-650 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-red-600 peer hse-input"
              required
            />
            <label
              htmlFor="lokasi"
              className="absolute text-sm text-gray-505 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-red-650 peer-focus:dark:text-red-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2 cursor-text"
            >
              Lokasi Kejadian <span className="text-red-500">*</span>
            </label>
          </div>

          {/* Deskripsi Kronologi (Floating Label) */}
          <div className="relative">
            <textarea
              id="deskripsi"
              placeholder=" "
              value={deskripsi}
              onChange={e => setDeskripsi(e.target.value)}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 dark:border-gray-650 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-red-600 peer hse-input min-h-[120px]"
              required
            />
            <label
              htmlFor="deskripsi"
              className="absolute text-sm text-gray-505 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-red-650 peer-focus:dark:text-red-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2 cursor-text"
            >
              Deskripsi Kronologi Kejadian <span className="text-red-500">*</span>
            </label>
          </div>

          {/* Live Webcam & Upload (Live Browser Camera Support) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1">
              Foto Bukti Pendukung <span className="text-gray-400 font-normal">(Opsional)</span>
            </label>
            <WebcamCapture onCapture={handleCapture} />
          </div>

          {/* Form Submit Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-150 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/insiden')}
              disabled={mut.isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              isLoading={mut.isPending}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-500/25"
            >
              <Save size={16} /> Kirim Laporan
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
