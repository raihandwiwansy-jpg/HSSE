'use client';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/lib/api/users';
import Button from '@/components/ui/Button';
import { Save, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ManHoursFormProps {
  initialData?: {
    user_id: number;
    judul_pekerjaan: string;
    lokasi: string;
    tanggal: string;
    durasi_jam: number;
    deskripsi?: string;
  };
  onSubmit: (data: {
    user_id: number;
    judul_pekerjaan: string;
    lokasi: string;
    tanggal: string;
    durasi_jam: number;
    deskripsi: string;
  }) => void;
  isLoading: boolean;
  title: string;
}

export default function ManHoursForm({ initialData, onSubmit, isLoading, title }: ManHoursFormProps) {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [judulPekerjaan, setJudulPekerjaan] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [durasiJam, setDurasiJam] = useState('8');
  const [deskripsi, setDeskripsi] = useState('');

  // Fetch users with role 'user'
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users-options-karyawan'],
    queryFn: () => getUsers({ role: 'user', per_page: 1000 }),
  });

  const karyawanUsers = usersData?.data?.data || [];

  useEffect(() => {
    if (initialData) {
      setUserId(String(initialData.user_id));
      setJudulPekerjaan(initialData.judul_pekerjaan);
      setLokasi(initialData.lokasi);
      setTanggal(initialData.tanggal);
      setDurasiJam(String(initialData.durasi_jam));
      setDeskripsi(initialData.deskripsi || '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !judulPekerjaan || !lokasi || !tanggal || !durasiJam) {
      return;
    }
    onSubmit({
      user_id: Number(userId),
      judul_pekerjaan: judulPekerjaan,
      lokasi: lokasi,
      tanggal: tanggal,
      durasi_jam: Number(durasiJam),
      deskripsi: deskripsi,
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 sm:space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push('/man-hours')}
          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="Kembali"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-850 dark:text-white">{title}</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Penugasan kerja baru untuk memantau jam kerja selamat karyawan.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Select Karyawan (Floating-Like or Clean Label) */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 ml-1">
              Karyawan yang Ditugaskan <span className="text-red-500">*</span>
            </label>
            <select
              value={userId}
              onChange={e => setUserId(e.target.value)}
              className="hse-input text-sm w-full block rounded-lg border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-900 p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              disabled={isLoadingUsers}
              required
            >
              <option value="">-- Pilih Karyawan --</option>
              {karyawanUsers.map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.karyawan?.nik || 'No NIK'} - {u.karyawan?.jabatan || 'Karyawan'})
                </option>
              ))}
            </select>
            {isLoadingUsers && <p className="text-[10px] text-gray-400 mt-1">Sedang memuat daftar karyawan...</p>}
          </div>

          {/* Judul Pekerjaan (Floating Label) */}
          <div className="relative">
            <input
              type="text"
              id="judul_pekerjaan"
              placeholder=" "
              value={judulPekerjaan}
              onChange={e => setJudulPekerjaan(e.target.value)}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 dark:border-gray-650 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-indigo-600 peer hse-input"
              required
            />
            <label
              htmlFor="judul_pekerjaan"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-indigo-600 peer-focus:dark:text-indigo-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2 cursor-text"
            >
              Judul Pekerjaan <span className="text-red-500">*</span>
            </label>
          </div>

          {/* Lokasi Pekerjaan (Floating Label) */}
          <div className="relative">
            <input
              type="text"
              id="lokasi"
              placeholder=" "
              value={lokasi}
              onChange={e => setLokasi(e.target.value)}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 dark:border-gray-650 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-indigo-600 peer hse-input"
              required
            />
            <label
              htmlFor="lokasi"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-indigo-600 peer-focus:dark:text-indigo-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2 cursor-text"
            >
              Lokasi Pekerjaan <span className="text-red-500">*</span>
            </label>
          </div>

          {/* Grid: Tanggal & Durasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Tanggal (Floating Label Style) */}
            <div className="relative">
              <input
                type="date"
                id="tanggal"
                placeholder=" "
                value={tanggal}
                onChange={e => setTanggal(e.target.value)}
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 dark:border-gray-650 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-indigo-600 peer hse-input"
                required
              />
              <label
                htmlFor="tanggal"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-indigo-600 peer-focus:dark:text-indigo-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2 cursor-text"
              >
                Tanggal Tugas <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Durasi Jam (Floating Label) */}
            <div className="relative">
              <input
                type="number"
                id="durasi_jam"
                placeholder=" "
                min="0.5"
                max="24"
                step="0.5"
                value={durasiJam}
                onChange={e => setDurasiJam(e.target.value)}
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 dark:border-gray-650 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-indigo-600 peer hse-input"
                required
              />
              <label
                htmlFor="durasi_jam"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-indigo-600 peer-focus:dark:text-indigo-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2 cursor-text"
              >
                Durasi (Jam) <span className="text-red-500">*</span>
              </label>
            </div>

          </div>

          {/* Deskripsi (Floating Label Area) */}
          <div className="relative">
            <textarea
              id="deskripsi"
              placeholder=" "
              value={deskripsi}
              onChange={e => setDeskripsi(e.target.value)}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 dark:border-gray-650 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-indigo-600 peer hse-input min-h-[120px]"
            />
            <label
              htmlFor="deskripsi"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-indigo-600 peer-focus:dark:text-indigo-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2 cursor-text"
            >
              Deskripsi Pekerjaan / Catatan
            </label>
          </div>

          {/* Form Submit Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-150 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/man-hours')}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/25"
            >
              <Save size={16} /> Simpan Penugasan
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
