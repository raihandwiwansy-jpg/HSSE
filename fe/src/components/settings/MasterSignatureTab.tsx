import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { Save, PenTool } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { toast } from 'react-toastify';

export default function MasterSignatureTab() {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    mengetahui_kasubag_nama: '',
    mengetahui_hse_nama: '',
    mengetahui_asisten_hse_nama: '',
    persetujuan_d_manager_nama: '',
    persetujuan_pemilik_lokasi_nama: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await axios.get('/settings');
      return res.data;
    }
  });

  useEffect(() => {
    if (data) {
      setForm({
        mengetahui_kasubag_nama: data.mengetahui_kasubag_nama || 'OKA ARITONANG',
        mengetahui_hse_nama: data.mengetahui_hse_nama || 'ADMIN HSSE',
        mengetahui_asisten_hse_nama: data.mengetahui_asisten_hse_nama || 'ASISTEN HSSE',
        persetujuan_d_manager_nama: data.persetujuan_d_manager_nama || 'MANAGER',
        persetujuan_pemilik_lokasi_nama: data.persetujuan_pemilik_lokasi_nama || 'SUPERVISOR',
      });
    }
  }, [data]);

  const mut = useMutation({
    mutationFn: async (settings: any) => await axios.post('/settings', { settings }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Pengaturan nama jabatan berhasil disimpan');
    },
    onError: () => toast.error('Gagal menyimpan pengaturan')
  });

  if (isLoading) return <div className="py-8 text-center text-gray-500">Memuat data...</div>;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
          <PenTool size={22} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">Master Signatures</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Atur default nama penandatangan untuk form permit</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-5 max-w-2xl">
        <Input 
          label="Nama Kasubag Sistem & IT" 
          value={form.mengetahui_kasubag_nama} 
          onChange={(e) => setForm({...form, mengetahui_kasubag_nama: e.target.value})}
        />
        <Input 
          label="Nama Asisten HSSE" 
          value={form.mengetahui_asisten_hse_nama} 
          onChange={(e) => setForm({...form, mengetahui_asisten_hse_nama: e.target.value})}
        />
        <Input 
          label="Nama Admin HSSE" 
          value={form.mengetahui_hse_nama} 
          onChange={(e) => setForm({...form, mengetahui_hse_nama: e.target.value})}
        />
        <Input 
          label="Nama Manager (Pemberi Izin)" 
          value={form.persetujuan_d_manager_nama} 
          onChange={(e) => setForm({...form, persetujuan_d_manager_nama: e.target.value})}
        />
        <Input 
          label="Nama Supervisor (Pemilik Lokasi)" 
          value={form.persetujuan_pemilik_lokasi_nama} 
          onChange={(e) => setForm({...form, persetujuan_pemilik_lokasi_nama: e.target.value})}
        />

        <div className="pt-4 flex justify-end">
          <Button onClick={() => mut.mutate(form)} isLoading={mut.isPending}>
            <Save size={18} /> Simpan Perubahan
          </Button>
        </div>
      </div>
    </div>
  );
}
