import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { Trash2, Plus, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { toast } from 'react-toastify';

export default function MasterLokasiTab() {
  const qc = useQueryClient();
  const [newLoc, setNewLoc] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const res = await axios.get('/locations');
      return res.data;
    }
  });

  const mutAdd = useMutation({
    mutationFn: async (name: string) => await axios.post('/locations', { name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['locations'] });
      setNewLoc('');
      toast.success('Lokasi berhasil ditambahkan');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Gagal menambahkan lokasi')
  });

  const mutDel = useMutation({
    mutationFn: async (id: number) => await axios.delete(`/locations/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Lokasi berhasil dihapus');
    },
    onError: () => toast.error('Gagal menghapus lokasi')
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
          <MapPin size={22} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">Master Data Lokasi</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Kelola daftar lokasi untuk Safety Patrol & Behavior</p>
        </div>
      </div>

      <div className="flex gap-2 max-w-md">
        <Input 
          placeholder="Nama Lokasi Baru..." 
          value={newLoc} 
          onChange={(e) => setNewLoc(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && newLoc && mutAdd.mutate(newLoc)}
        />
        <Button onClick={() => newLoc && mutAdd.mutate(newLoc)} isLoading={mutAdd.isPending}>
          <Plus size={18} /> Tambah
        </Button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-gray-500">Memuat data...</div>
      ) : (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-gray-500 bg-gray-50 dark:bg-gray-800/80 uppercase font-bold">
              <tr>
                <th className="px-3 py-2">Nama Lokasi</th>
                <th className="px-3 py-2 text-right w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {data?.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-3 py-6 text-center text-gray-500">Belum ada data lokasi</td>
                </tr>
              ) : (
                data?.map((loc: any) => (
                  <tr key={loc.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-3 py-1.5 font-medium text-gray-900 dark:text-gray-100">{loc.name}</td>
                    <td className="px-3 py-1.5 text-right">
                      <button 
                        onClick={() => { if(confirm('Hapus lokasi ini?')) mutDel.mutate(loc.id) }}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
