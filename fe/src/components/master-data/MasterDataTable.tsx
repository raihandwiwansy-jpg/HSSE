'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import { masterDataApi, type MasterItem } from '@/lib/api/masterData';
import { toast } from 'react-toastify';

interface Props {
  type: string;
  onBack?: () => void;
  title?: string;
}

const fieldLabels: Record<string, Record<string, string>> = {
  departemen: { nama: 'Nama Departemen' },
  perusahaan: { nama: 'Nama Perusahaan', alamat: 'Alamat', telepon: 'Telepon' },
  personil: { nama: 'Nama', jabatan: 'Jabatan', telepon: 'Telepon' },
  peralatan: { nama: 'Nama', tipe: 'Tipe', spesifikasi: 'Spesifikasi' },
  bahaya: { nama: 'Nama', kategori: 'Kategori', deskripsi: 'Deskripsi' },
  risiko: { nama: 'Nama', tingkat: 'Tingkat', deskripsi: 'Deskripsi' },
  checklist: { permit_type: 'Tipe Permit', kategori: 'Kategori', item: 'Item' },
  shift: { nama: 'Nama', jam_mulai: 'Jam Mulai', jam_selesai: 'Jam Selesai' },
  'kategori-patrol': { nama: 'Nama Kategori' },
  'kategori-perilaku': { nama: 'Nama', tipe: 'Tipe (safe/at_risk)' },
  lokasi: { name: 'Nama Lokasi' },
  apd: { nama: 'Nama APD', kode: 'Kode', stok: 'Stok', satuan: 'Satuan' },
};

const labelKeys: Record<string, string> = {
  departemen: 'nama',
  perusahaan: 'nama',
  personil: 'nama',
  peralatan: 'nama',
  bahaya: 'nama',
  risiko: 'nama',
  checklist: 'item',
  shift: 'nama',
  'kategori-patrol': 'nama',
  'kategori-perilaku': 'nama',
  lokasi: 'name',
  apd: 'nama',
};

export default function MasterDataTable({ type, onBack, title }: Props) {
  const [data, setData] = useState<MasterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState<MasterItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);
  const perPage = 10;

  const fields = fieldLabels[type] || {};
  const displayKeys = Object.keys(fields);
  const labelKey = labelKeys[type] || 'nama';

  useEffect(() => {
    fetchData();
  }, [type]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await masterDataApi.getAll(type);
      setData(res.data || []);
    } catch {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    try {
      await masterDataApi.delete(type, id);
      toast.success('Data berhasil dihapus');
      fetchData();
    } catch {
      toast.error('Gagal menghapus data');
    }
  };

  const handleSeed = async () => {
    setSeedLoading(true);
    try {
      await masterDataApi.seedDefaults();
      toast.success('Default data berhasil ditambahkan');
      fetchData();
    } catch {
      toast.error('Gagal menambahkan default data');
    } finally {
      setSeedLoading(false);
    }
  };

  const filtered = data.filter((item) => {
    const searchVal = search.toLowerCase();
    return displayKeys.some((key) => {
      const val = item[key];
      return val && String(val).toLowerCase().includes(searchVal);
    });
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const ModalForm = () => {
    const [formData, setFormData] = useState<Record<string, string>>(() => {
      if (editItem) {
        const init: Record<string, string> = {};
        displayKeys.forEach((k) => { init[k] = String(editItem[k] || ''); });
        return init;
      }
      const init: Record<string, string> = {};
      displayKeys.forEach((k) => { init[k] = ''; });
      return init;
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormLoading(true);
      try {
        if (editItem) {
          await masterDataApi.update(type, editItem.id, formData);
          toast.success('Data berhasil diupdate');
        } else {
          await masterDataApi.create(type, formData);
          toast.success('Data berhasil ditambahkan');
        }
        setShowForm(false);
        setEditItem(null);
        fetchData();
      } catch {
        toast.error('Gagal menyimpan data');
      } finally {
        setFormLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)}>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            {editItem ? 'Edit Data' : 'Tambah Data'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {displayKeys.map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{fields[key]}</label>
                {key === 'deskripsi' ? (
                  <textarea
                    value={formData[key] || ''}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50"
                    rows={3}
                    required={key === labelKey}
                  />
                ) : key === 'tipe' && type === 'kategori-perilaku' ? (
                  <select
                    value={formData[key] || ''}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50"
                    required
                  >
                    <option value="">Pilih tipe</option>
                    <option value="safe">Safe</option>
                    <option value="at_risk">At-Risk</option>
                  </select>
                ) : (
                  <input
                    type={key === 'jam_mulai' || key === 'jam_selesai' ? 'time' : key === 'telepon' ? 'tel' : 'text'}
                    value={formData[key] || ''}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50"
                    placeholder={fields[key]}
                    required={key === labelKey}
                  />
                )}
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setShowForm(false); setEditItem(null); }} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors">
                Batal
              </button>
              <button type="submit" disabled={formLoading} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {formLoading && <Loader2 size={16} className="animate-spin" />}
                {editItem ? 'Simpan' : 'Tambah'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-[#12121E] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800/60 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-2 -ml-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">{title || type}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{filtered.length} item</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari..."
              className="w-56 pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all"
            />
          </div>
          <button onClick={handleSeed} disabled={seedLoading} className="px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/60 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50 border border-gray-200 dark:border-gray-700">
            {seedLoading ? <Loader2 size={14} className="animate-spin" /> : 'Seed Default'}
          </button>
          <button onClick={() => { setEditItem(null); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 rounded-xl transition-all shadow-sm shadow-blue-500/10">
            <Plus size={16} />
            Tambah
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-gray-900/30 border-y border-gray-100 dark:border-gray-800">
              <th className="px-2.5 py-2 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider w-10">#</th>
              {displayKeys.map((key) => (
                <th key={key} className="px-2.5 py-2 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">{fields[key]}</th>
              ))}
              <th className="px-2.5 py-2 text-center text-[11px] font-bold text-gray-500 uppercase tracking-wider w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/40">
            {loading ? (
              <tr><td colSpan={displayKeys.length + 2} className="px-4 py-8 text-center text-gray-400">Memuat data...</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={displayKeys.length + 2} className="px-4 py-8 text-center">
                <p className="text-xs font-medium text-gray-500 mb-1">Data tidak ditemukan</p>
                <p className="text-[11px] text-gray-400">Tambahkan data baru untuk memulai</p>
              </td></tr>
            ) : paginated.map((item, idx) => (
              <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                <td className="px-2.5 py-1.5 text-xs text-gray-400">{(page - 1) * perPage + idx + 1}</td>
                {displayKeys.map((key) => (
                  <td key={key} className="px-2.5 py-1.5">
                    <p className="text-xs text-gray-800 dark:text-gray-200 truncate max-w-[240px]">
                      {String(item[key] ?? '-')}
                    </p>
                  </td>
                ))}
                <td className="px-2.5 py-1.5">
                  <div className="flex items-center justify-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditItem(item); setShowForm(true); }} className="p-1 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-all" title="Edit">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all" title="Hapus">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} dari {filtered.length}
          </p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl disabled:opacity-30 transition-all">
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map((n) => (
              <button key={n} onClick={() => setPage(n)} className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${n === page ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl disabled:opacity-30 transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {showForm && <ModalForm />}
    </div>
  );
}
