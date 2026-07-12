'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Send, Info, Plus, X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { showToast } from '../ui/Toast';
import { createCse, updateCse } from '@/lib/api/cse';
import type { CsePermit } from '@/types';
import Link from 'next/link';

const cseSchema = z.object({
  tanggal: z.string().min(1, 'Tanggal harus diisi'),
  supervisor: z.string().min(2, 'Supervisor harus diisi'),
  fasilitas: z.string().min(3, 'Fasilitas harus diisi'),
  lokasi: z.string().min(3, 'Lokasi harus diisi'),
  alasan: z.string().min(5, 'Alasan harus diisi'),
  jumlah_pekerja: z.coerce.number().min(1, 'Minimal 1 pekerja'),
  catatan: z.string().optional(),
});

type CseForm = z.infer<typeof cseSchema>;

interface CseFormProps {
  mode: 'create' | 'edit';
  initialData?: CsePermit;
}

export default function CseFormComponent({ mode, initialData }: CseFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hasilGas, setHasilGas] = useState<string[]>(initialData?.hasil_gas || []);
  const [newGas, setNewGas] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(cseSchema),
    defaultValues: initialData ? {
      tanggal: initialData.tanggal,
      supervisor: initialData.supervisor,
      fasilitas: initialData.fasilitas,
      lokasi: initialData.lokasi,
      alasan: initialData.alasan,
      jumlah_pekerja: initialData.jumlah_pekerja,
      catatan: initialData.catatan || '',
    } : {
      tanggal: new Date().toISOString().split('T')[0],
      jumlah_pekerja: 1,
    },
  });

  const addGas = () => {
    if (newGas.trim()) {
      setHasilGas([...hasilGas, newGas.trim()]);
      setNewGas('');
    }
  };

  const removeGas = (index: number) => {
    setHasilGas(hasilGas.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CseForm) => {
    setIsLoading(true);
    try {
      const payload = { ...data, hasil_gas: hasilGas.length > 0 ? hasilGas : undefined };
      if (mode === 'create') {
        await createCse(payload);
        showToast.success('CSE permit berhasil dibuat');
      } else {
        await updateCse(initialData!.id, payload);
        showToast.success('CSE permit berhasil diupdate');
      }
      router.push('/cse');
    } catch (err: any) {
      showToast.error(err?.response?.data?.message || 'Gagal menyimpan CSE');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/cse" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {mode === 'create' ? 'Buat CSE Permit' : 'Edit CSE Permit'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {mode === 'create' ? 'Confined Space Entry - Isi formulir untuk membuat izin baru' : `Edit CSE #${initialData?.id}`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 dark:bg-[#1E1E2E] dark:border-[#333355]">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#2E7D32] text-white text-xs flex items-center justify-center font-bold">A</span>
            Identitas Izin Kerja
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tanggal"
              name="tanggal"
              type="date"
              register={register}
              error={errors.tanggal?.message}
            />
            <Input
              label="Supervisor"
              name="supervisor"
              placeholder="Nama supervisor yang bertanggung jawab"
              register={register}
              error={errors.supervisor?.message}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              label="Fasilitas"
              name="fasilitas"
              placeholder="Nama fasilitas/area yang akan dimasuki"
              register={register}
              error={errors.fasilitas?.message}
            />
            <Input
              label="Lokasi"
              name="lokasi"
              placeholder="Lokasi spesifik"
              register={register}
              error={errors.lokasi?.message}
            />
          </div>
          <div className="mt-4">
            <Input
              label="Jumlah Pekerja"
              name="jumlah_pekerja"
              type="number"
              register={register}
              error={errors.jumlah_pekerja?.message}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 dark:bg-[#1E1E2E] dark:border-[#333355]">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#2E7D32] text-white text-xs flex items-center justify-center font-bold">B</span>
            Alasan &amp; Detail Pekerjaan
          </h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Alasan Masuk Confined Space
              </label>
              <textarea
                {...register('alasan')}
                rows={3}
                placeholder="Jelaskan alasan pekerja harus masuk ke confined space..."
                className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 shadow-sm focus:border-[#2E7D32] focus:outline-none focus:ring-1 focus:ring-[#2E7D32] transition-colors"
              />
              {errors.alasan && (
                <p className="text-xs text-red-600">{errors.alasan.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Catatan (opsional)
              </label>
              <textarea
                {...register('catatan')}
                rows={2}
                placeholder="Catatan tambahan..."
                className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 shadow-sm focus:border-[#2E7D32] focus:outline-none focus:ring-1 focus:ring-[#2E7D32] transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 dark:bg-[#1E1E2E] dark:border-[#333355]">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#2E7D32] text-white text-xs flex items-center justify-center font-bold">C</span>
            Hasil Uji Gas
          </h2>
          <div className="space-y-3">
            {hasilGas.map((gas, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                  {gas}
                </span>
                <button
                  type="button"
                  onClick={() => removeGas(idx)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/20 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newGas}
                onChange={(e) => setNewGas(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGas())}
                placeholder="Contoh: O2: 20.9%, CO: 0 ppm, H2S: 0 ppm"
                className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 shadow-sm focus:border-[#2E7D32] focus:outline-none focus:ring-1 focus:ring-[#2E7D32] transition-colors"
              />
              <button
                type="button"
                onClick={addGas}
                className="p-2.5 bg-[#2E7D32] text-white rounded-xl hover:bg-[#1B5E20] transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 dark:bg-blue-900/20 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <p><strong>Simpan Draft</strong> &rarr; CSE tersimpan sebagai DRAFT, bisa diedit lagi</p>
              <p><strong>Submit</strong> &rarr; CSE dikirim ke HSSE untuk review</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
          <Link href="/cse" className="order-last sm:order-first">
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
              Submit ke HSSE
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
