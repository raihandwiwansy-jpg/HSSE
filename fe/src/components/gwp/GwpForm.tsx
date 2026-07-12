'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Send, Info, Plus, X, Check } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { showToast } from '../ui/Toast';
import { createGwp, updateGwp } from '@/lib/api/gwp';
import type { GwpPermit } from '@/types';
import Link from 'next/link';

const gwpSchema = z.object({
  tanggal: z.string().min(1, 'Tanggal harus diisi'),
  pukul_mulai: z.string().min(1, 'Jam mulai harus diisi'),
  pukul_selesai: z.string().min(1, 'Jam selesai harus diisi'),
  departemen: z.string().min(2, 'Departemen harus diisi'),
  lokasi: z.string().min(3, 'Lokasi harus diisi'),
  deskripsi_pekerjaan: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  peralatan: z.string().min(3, 'Peralatan harus diisi'),
  kategori_risiko: z.enum(['rendah', 'sedang', 'tinggi'], {
    message: 'Pilih kategori risiko',
  }),
  berdasarkan_jsa: z.string().optional(),
  kategori_pekerjaan: z.enum(['cold_work', 'hot_work'], {
    message: 'Pilih kategori pekerjaan',
  }),
});

type GwpForm = z.infer<typeof gwpSchema>;

const risikoOptions = [
  { value: 'rendah', label: 'Rendah' },
  { value: 'sedang', label: 'Sedang' },
  { value: 'tinggi', label: 'Tinggi' },
];

const kategoriOptions = [
  { value: 'cold_work', label: 'Kerja Dingin (Cold Work)' },
  { value: 'hot_work', label: 'Kerja Panas (Hot Work)' },
];

const deptOptions = [
  { value: 'Produksi', label: 'Produksi' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'HSE', label: 'HSE' },
  { value: 'Warehouse', label: 'Warehouse' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Quality', label: 'Quality' },
];

const ALL_KESELAMATAN_PEMOHON = [
  'Peralatan telah dipisahkan/dikosongkan',
  'Peralatan telah dipasang label LOTO',
  'Penutup main hole tertutup',
  'Petugas telah menggunakan APD',
  'Perlakuan lain (sebutkan)',
];

const ALL_KESELAMATAN_HSE = [
  'Daerah kerja telah diperiksa dari kebocoran',
  'Tindakan pencegahan bahaya listrik/steam',
  'Persyaratan penerangan memenuhi standar',
  'Tidak ada sumber api dekat bahan mudah terbakar',
  'Perlakuan lain (sebutkan)',
];

const ALL_PPE = [
  'Helmet',
  'Safety shoes',
  'Seragam kerja',
  'Masker',
  'Safety Harness',
  'Goggle',
  'Sarung tangan',
  'Safety Boots',
  'Ear plug',
  'Ear Muff',
];

interface GwpFormProps {
  mode: 'create' | 'edit';
  initialData?: GwpPermit;
}

export default function GwpFormComponent({ mode, initialData }: GwpFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Checked state = Set of checked indices (0-based)
  const [checkedPemohon, setCheckedPemohon] = useState<Set<number>>(() => {
    if (initialData?.daftar_keselamatan_pemohon) {
      // Map stored items back to indices
      const checked = new Set<number>();
      initialData.daftar_keselamatan_pemohon.forEach((item) => {
        const idx = ALL_KESELAMATAN_PEMOHON.indexOf(item);
        if (idx !== -1) checked.add(idx);
      });
      return checked;
    }
    return new Set<number>(); // Create mode: all unchecked
  });

  const [checkedHse, setCheckedHse] = useState<Set<number>>(() => {
    if (initialData?.daftar_keselamatan_hse) {
      const checked = new Set<number>();
      initialData.daftar_keselamatan_hse.forEach((item) => {
        const idx = ALL_KESELAMATAN_HSE.indexOf(item);
        if (idx !== -1) checked.add(idx);
      });
      return checked;
    }
    return new Set<number>();
  });

  const [checkedPpe, setCheckedPpe] = useState<Set<number>>(() => {
    if (initialData?.ppe_checklist) {
      const checked = new Set<number>();
      initialData.ppe_checklist.forEach((item) => {
        const idx = ALL_PPE.indexOf(item);
        if (idx !== -1) checked.add(idx);
      });
      return checked;
    }
    return new Set<number>();
  });

  // Custom items (user-added)
  const [customPemohon, setCustomPemohon] = useState<string[]>(
    initialData?.daftar_keselamatan_pemohon?.filter(
      (item) => !ALL_KESELAMATAN_PEMOHON.includes(item)
    ) || []
  );
  const [checkedCustomPemohon, setCheckedCustomPemohon] = useState<Set<number>>(() => {
    if (initialData?.daftar_keselamatan_pemohon) {
      const checked = new Set<number>();
      const customs = initialData.daftar_keselamatan_pemohon.filter(
        (item) => !ALL_KESELAMATAN_PEMOHON.includes(item)
      );
      customs.forEach((_, i) => checked.add(i));
      return checked;
    }
    return new Set<number>();
  });

  const [customHse, setCustomHse] = useState<string[]>(
    initialData?.daftar_keselamatan_hse?.filter(
      (item) => !ALL_KESELAMATAN_HSE.includes(item)
    ) || []
  );
  const [checkedCustomHse, setCheckedCustomHse] = useState<Set<number>>(() => {
    if (initialData?.daftar_keselamatan_hse) {
      const checked = new Set<number>();
      const customs = initialData.daftar_keselamatan_hse.filter(
        (item) => !ALL_KESELAMATAN_HSE.includes(item)
      );
      customs.forEach((_, i) => checked.add(i));
      return checked;
    }
    return new Set<number>();
  });

  const [customPpe, setCustomPpe] = useState<string[]>(
    initialData?.ppe_checklist?.filter(
      (item) => !ALL_PPE.includes(item)
    ) || []
  );
  const [checkedCustomPpe, setCheckedCustomPpe] = useState<Set<number>>(() => {
    if (initialData?.ppe_checklist) {
      const checked = new Set<number>();
      const customs = initialData.ppe_checklist.filter(
        (item) => !ALL_PPE.includes(item)
      );
      customs.forEach((_, i) => checked.add(i));
      return checked;
    }
    return new Set<number>();
  });

  const [newCustomPemohon, setNewCustomPemohon] = useState('');
  const [newCustomHse, setNewCustomHse] = useState('');
  const [newCustomPpe, setNewCustomPpe] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<GwpForm>({
    resolver: zodResolver(gwpSchema),
    defaultValues: initialData ? {
      tanggal: initialData.tanggal,
      pukul_mulai: initialData.pukul_mulai,
      pukul_selesai: initialData.pukul_selesai,
      departemen: initialData.departemen,
      lokasi: initialData.lokasi,
      deskripsi_pekerjaan: initialData.deskripsi_pekerjaan,
      peralatan: initialData.peralatan,
      kategori_risiko: initialData.kategori_risiko,
      berdasarkan_jsa: initialData.berdasarkan_jsa || '',
      kategori_pekerjaan: initialData.kategori_pekerjaan,
    } : {
      tanggal: new Date().toISOString().split('T')[0],
      kategori_pekerjaan: 'cold_work',
    },
  });

  const kategoriPekerjaan = watch('kategori_pekerjaan');

  const togglePemohon = (idx: number) => {
    setCheckedPemohon((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const toggleHse = (idx: number) => {
    setCheckedHse((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const togglePpe = (idx: number) => {
    setCheckedPpe((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const toggleCustomPemohon = (idx: number) => {
    setCheckedCustomPemohon((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const toggleCustomHse = (idx: number) => {
    setCheckedCustomHse((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const toggleCustomPpe = (idx: number) => {
    setCheckedCustomPpe((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const addCustomItem = (
    value: string,
    setCustom: React.Dispatch<React.SetStateAction<string[]>>,
    setCheckedCustom: React.Dispatch<React.SetStateAction<Set<number>>>,
    resetInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (value.trim()) {
      setCustom((prev) => [...prev, value.trim()]);
      setCheckedCustom((prev) => {
        const next = new Set(prev);
        next.add(prev.size);
        return next;
      });
      resetInput('');
    }
  };

  const removeCustomItem = (
    idx: number,
    setCustom: React.Dispatch<React.SetStateAction<string[]>>,
    setCheckedCustom: React.Dispatch<React.SetStateAction<Set<number>>>
  ) => {
    setCustom((prev) => prev.filter((_, i) => i !== idx));
    setCheckedCustom((prev) => {
      const next = new Set<number>();
      prev.forEach((v) => {
        if (v < idx) next.add(v);
        else if (v > idx) next.add(v - 1);
      });
      return next;
    });
  };

  const onSubmit = async (data: GwpForm) => {
    setIsLoading(true);
    try {
      // Build checked items arrays
      const keselamatanPemohonResult = [
        ...ALL_KESELAMATAN_PEMOHON.filter((_, i) => checkedPemohon.has(i)),
        ...customPemohon.filter((_, i) => checkedCustomPemohon.has(i)),
      ];
      const keselamatanHseResult = [
        ...ALL_KESELAMATAN_HSE.filter((_, i) => checkedHse.has(i)),
        ...customHse.filter((_, i) => checkedCustomHse.has(i)),
      ];
      const ppeResult = [
        ...ALL_PPE.filter((_, i) => checkedPpe.has(i)),
        ...customPpe.filter((_, i) => checkedCustomPpe.has(i)),
      ];

      const payload = {
        ...data,
        daftar_keselamatan_pemohon: keselamatanPemohonResult,
        daftar_keselamatan_hse: keselamatanHseResult,
        ppe_checklist: ppeResult,
      };
      if (mode === 'create') {
        await createGwp(payload);
        showToast.success('GWP permit berhasil dibuat');
      } else {
        await updateGwp(initialData!.id, payload);
        showToast.success('GWP permit berhasil diupdate');
      }
      router.push('/gwp');
    } catch (err: any) {
      showToast.error(err?.response?.data?.message || 'Gagal menyimpan GWP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/gwp" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {mode === 'create' ? 'Buat GWP Permit' : 'Edit GWP Permit'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {mode === 'create' ? 'General Work Permit - Isi formulir sesuai format FM-BSHS-19' : `Edit GWP #${initialData?.id}`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Section A: Identitas Permintaan Izin */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 dark:bg-[#1E1E2E] dark:border-[#333355]">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#1A365D] text-white text-xs flex items-center justify-center font-bold">A</span>
            Identitas Permintaan Izin Kerja
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Tanggal"
              name="tanggal"
              type="date"
              register={register}
              error={errors.tanggal?.message}
            />
            <Input
              label="Pukul Mulai"
              name="pukul_mulai"
              type="time"
              register={register}
              error={errors.pukul_mulai?.message}
            />
            <Input
              label="Pukul Selesai"
              name="pukul_selesai"
              type="time"
              register={register}
              error={errors.pukul_selesai?.message}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Select
              label="Dept/Bagian/CV"
              name="departemen"
              placeholder="Pilih departemen"
              options={deptOptions}
              register={register}
              error={errors.departemen?.message}
            />
            <Input
              label="Lokasi Area Kerja"
              name="lokasi"
              placeholder="Area/unit kerja"
              register={register}
              error={errors.lokasi?.message}
            />
          </div>
        </div>

        {/* Section B: Identitas Pekerjaan */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 dark:bg-[#1E1E2E] dark:border-[#333355]">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#1A365D] text-white text-xs flex items-center justify-center font-bold">B</span>
            Identitas Pekerjaan
          </h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Deskripsi Jenis Pekerjaan
              </label>
              <textarea
                {...register('deskripsi_pekerjaan')}
                rows={3}
                placeholder="Uraian pekerjaan yang akan dilakukan..."
                className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 shadow-sm focus:border-[#1A365D] focus:outline-none focus:ring-1 focus:ring-[#1A365D] transition-colors"
              />
              {errors.deskripsi_pekerjaan && (
                <p className="text-xs text-red-600">{errors.deskripsi_pekerjaan.message}</p>
              )}
            </div>
            <Input
              label="Peralatan yang Akan Dipergunakan"
              name="peralatan"
              placeholder="Welding Machine, Gerinda, Tang, Obeng"
              register={register}
              error={errors.peralatan?.message}
            />
          </div>
        </div>

        {/* Section C: Kategori Risiko */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 dark:bg-[#1E1E2E] dark:border-[#333355]">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#1A365D] text-white text-xs flex items-center justify-center font-bold">C</span>
            Kategori Risiko Pekerjaan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Kategori Risiko"
              name="kategori_risiko"
              placeholder="Pilih tingkat risiko"
              options={risikoOptions}
              register={register}
              error={errors.kategori_risiko?.message}
            />
            <Input
              label="Berdasarkan JSA"
              name="berdasarkan_jsa"
              placeholder="Nomor JSA terkait (opsional)"
              register={register}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Select
              label="Kategori Pekerjaan"
              name="kategori_pekerjaan"
              placeholder="Pilih jenis pekerjaan"
              options={kategoriOptions}
              register={register}
              error={errors.kategori_pekerjaan?.message}
            />
          </div>
          {kategoriPekerjaan === 'hot_work' && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-xl dark:bg-orange-900/20 dark:border-orange-800">
              <p className="text-sm text-orange-700 dark:text-orange-400 font-medium">
                Kerja Panas (Hot Work) memerlukan Hot Work Permit (HWP) tambahan.
              </p>
            </div>
          )}
        </div>

        {/* Section D: Daftar Keselamatan */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 dark:bg-[#1E1E2E] dark:border-[#333355]">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#1A365D] text-white text-xs flex items-center justify-center font-bold">D</span>
            Daftar Keselamatan (Checklist)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kolom Pemohon */}
            <div>
              <h3 className="text-sm font-semibold text-[#1A365D] dark:text-blue-300 mb-3">Pemohon Izin</h3>
              <div className="space-y-2">
                {ALL_KESELAMATAN_PEMOHON.map((item, idx) => (
                  <label key={idx} className="flex items-start gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checkedPemohon.has(idx)}
                      onChange={() => togglePemohon(idx)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1A365D] focus:ring-[#1A365D]"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-[#1A365D]">{item}</span>
                  </label>
                ))}
                {/* Custom items */}
                {customPemohon.map((item, idx) => (
                  <label key={`custom-p-${idx}`} className="flex items-start gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checkedCustomPemohon.has(idx)}
                      onChange={() => toggleCustomPemohon(idx)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1A365D] focus:ring-[#1A365D]"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-[#1A365D]">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeCustomItem(idx, setCustomPemohon, setCheckedCustomPemohon)}
                      className="ml-auto text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </label>
                ))}
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={newCustomPemohon}
                    onChange={(e) => setNewCustomPemohon(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomItem(newCustomPemohon, setCustomPemohon, setCheckedCustomPemohon, setNewCustomPemohon);
                      }
                    }}
                    placeholder="Tambah item..."
                    className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm dark:bg-gray-800 dark:text-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => addCustomItem(newCustomPemohon, setCustomPemohon, setCheckedCustomPemohon, setNewCustomPemohon)}
                    className="p-1.5 bg-[#1A365D] text-white rounded-lg hover:bg-[#2B4C7E]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Kolom HSE */}
            <div>
              <h3 className="text-sm font-semibold text-[#1A365D] dark:text-blue-300 mb-3">HSE (Pemberi Izin)</h3>
              <div className="space-y-2">
                {ALL_KESELAMATAN_HSE.map((item, idx) => (
                  <label key={idx} className="flex items-start gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checkedHse.has(idx)}
                      onChange={() => toggleHse(idx)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1A365D] focus:ring-[#1A365D]"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-[#1A365D]">{item}</span>
                  </label>
                ))}
                {customHse.map((item, idx) => (
                  <label key={`custom-h-${idx}`} className="flex items-start gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checkedCustomHse.has(idx)}
                      onChange={() => toggleCustomHse(idx)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1A365D] focus:ring-[#1A365D]"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-[#1A365D]">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeCustomItem(idx, setCustomHse, setCheckedCustomHse)}
                      className="ml-auto text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </label>
                ))}
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={newCustomHse}
                    onChange={(e) => setNewCustomHse(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomItem(newCustomHse, setCustomHse, setCheckedCustomHse, setNewCustomHse);
                      }
                    }}
                    placeholder="Tambah item..."
                    className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm dark:bg-gray-800 dark:text-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => addCustomItem(newCustomHse, setCustomHse, setCheckedCustomHse, setNewCustomHse)}
                    className="p-1.5 bg-[#1A365D] text-white rounded-lg hover:bg-[#2B4C7E]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section E: Peralatan Keamanan (PPE) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 dark:bg-[#1E1E2E] dark:border-[#333355]">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#1A365D] text-white text-xs flex items-center justify-center font-bold">E</span>
            Peralatan Keamanan (PPE)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {ALL_PPE.map((item, idx) => (
              <label key={idx} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border border-gray-200 dark:border-gray-700">
                <input
                  type="checkbox"
                  checked={checkedPpe.has(idx)}
                  onChange={() => togglePpe(idx)}
                  className="h-4 w-4 rounded border-gray-300 text-[#1A365D] focus:ring-[#1A365D]"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
              </label>
            ))}
            {customPpe.map((item, idx) => (
              <label key={`custom-pp-${idx}`} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border border-gray-200 dark:border-gray-700">
                <input
                  type="checkbox"
                  checked={checkedCustomPpe.has(idx)}
                  onChange={() => toggleCustomPpe(idx)}
                  className="h-4 w-4 rounded border-gray-300 text-[#1A365D] focus:ring-[#1A365D]"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                <button
                  type="button"
                  onClick={() => removeCustomItem(idx, setCustomPpe, setCheckedCustomPpe)}
                  className="ml-auto text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </label>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <input
              type="text"
              value={newCustomPpe}
              onChange={(e) => setNewCustomPpe(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomItem(newCustomPpe, setCustomPpe, setCheckedCustomPpe, setNewCustomPpe);
                }
              }}
              placeholder="Tambah PPE..."
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm dark:bg-gray-800 dark:text-gray-100"
            />
            <button
              type="button"
              onClick={() => addCustomItem(newCustomPpe, setCustomPpe, setCheckedCustomPpe, setNewCustomPpe)}
              className="p-1.5 bg-[#1A365D] text-white rounded-lg hover:bg-[#2B4C7E]"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 dark:bg-blue-900/20 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <p><strong>Simpan Draft</strong> &rarr; GWP tersimpan sebagai DRAFT, bisa diedit lagi</p>
              <p><strong>Submit ke HSE</strong> &rarr; GWP dikirim ke HSE untuk review &amp; approve/reject</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
          <Link href="/gwp" className="order-last sm:order-first">
            <Button type="button" variant="outline" className="w-full sm:w-auto">
              Batal
            </Button>
          </Link>
          <Button type="submit" variant="primary" isLoading={isLoading} className="w-full sm:w-auto">
            <Save className="h-4 w-4" />
            {mode === 'create' ? 'Simpan Draft' : 'Simpan Perubahan'}
          </Button>
          {mode === 'create' && (
            <Button type="submit" variant="success" isLoading={isLoading} className="w-full sm:w-auto">
              <Send className="h-4 w-4" />
              Submit ke HSE
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
