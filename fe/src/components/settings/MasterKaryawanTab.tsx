'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getKaryawan, createKaryawan, updateKaryawan, deleteKaryawan, importKaryawan } from '@/lib/api/karyawan';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';
import { Plus, Search, Eye, Edit, Trash2, Contact, ChevronLeft, ChevronRight, X, User, Phone, Building2, Briefcase, IdCard, FileSpreadsheet, Upload } from 'lucide-react';

interface KaryawanData {
  id: number;
  nama: string;
  nik: string;
  jabatan: string;
  departemen: string;
  no_hp: string | null;
  created_at?: string;
}

interface FormData {
  nama: string;
  nik: string;
  jabatan: string;
  departemen: string;
  no_hp: string;
}

const emptyForm: FormData = {
  nama: '',
  nik: '',
  jabatan: '',
  departemen: '',
  no_hp: '',
};

export default function MasterKaryawanTab() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [deptF, setDeptF] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showDetail, setShowDetail] = useState<KaryawanData | null>(null);

  const downloadTemplate = () => {
    const headers = ['nik', 'nama', 'jabatan', 'departemen', 'no_hp'];
    const sampleData = ['NIK-0001', 'Budi Santoso', 'Operator', 'Produksi', '08123456789'];
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), sampleData.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "template_master_karyawan.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = async () => {
    if (!importFile) return;
    setImporting(true);
    setImportErrors([]);
    try {
      const res = await importKaryawan(importFile);
      if (res.success) {
        toast.success(res.message || 'Data karyawan berhasil diimpor');
        if (res.errors && res.errors.length > 0) {
          setImportErrors(res.errors);
        } else {
          setShowImportModal(false);
          setImportFile(null);
        }
        qc.invalidateQueries({ queryKey: ['master-karyawan'] });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Gagal mengimpor data karyawan';
      toast.error(msg);
    } finally {
      setImporting(false);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['master-karyawan', search, deptF, page],
    queryFn: async () => {
      const res = await getKaryawan({ search: search || undefined, departemen: deptF || undefined, page, per_page: 10 });
      return res.data;
    },
  });

  const karyawans: KaryawanData[] = data?.data || [];
  const pagination = data;

  const delMut = useMutation({
    mutationFn: deleteKaryawan,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['master-karyawan'] });
      toast.success('Data karyawan berhasil dihapus');
      setDeleteId(null);
    },
    onError: () => toast.error('Gagal menghapus data karyawan'),
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (k: KaryawanData) => {
    setEditingId(k.id);
    setForm({
      nama: k.nama,
      nik: k.nik,
      jabatan: k.jabatan,
      departemen: k.departemen,
      no_hp: k.no_hp || '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.nama.trim()) errs.nama = 'Nama lengkap wajib diisi';
    if (!form.nik.trim()) errs.nik = 'NIK wajib diisi';
    if (!form.jabatan.trim()) errs.jabatan = 'Jabatan wajib diisi';
    if (!form.departemen.trim()) errs.departemen = 'Departemen wajib diisi';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        no_hp: form.no_hp || undefined,
      };
      if (editingId) {
        await updateKaryawan(editingId, payload);
        toast.success('Data karyawan berhasil diperbarui');
      } else {
        await createKaryawan(payload);
        toast.success('Karyawan berhasil ditambahkan');
      }
      qc.invalidateQueries({ queryKey: ['master-karyawan'] });
      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Terjadi kesalahan';
      const errors = err?.response?.data?.errors;
      if (errors) {
        const newErrors: Record<string, string> = {};
        Object.entries(errors).forEach(([key, val]) => {
          newErrors[key] = (val as string[])[0];
        });
        setFormErrors(newErrors);
      } else {
        toast.error(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1A365D]/10 text-[#1A365D] dark:text-blue-400 flex items-center justify-center">
              <Contact size={16} />
            </div>
            Master Data Karyawan
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Kelola data NIK, departemen, dan jabatan karyawan internal
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => { setShowImportModal(true); setImportFile(null); setImportErrors([]); }} size="sm" variant="outline" className="flex items-center gap-2 border-[#1A365D] text-[#1A365D] hover:bg-[#1A365D]/5 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400/5">
            <FileSpreadsheet size={16} /> Impor Excel
          </Button>
          <Button onClick={openCreate} size="sm" className="bg-[#1A365D] hover:bg-[#2B4C7E] text-white">
            <Plus size={16} /> Tambah Karyawan
          </Button>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-[#12121E] rounded-xl border border-gray-200 dark:border-gray-800 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari NIK, nama, jabatan..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1A1A2E] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-850 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all text-sm"
            />
          </div>
          <input
            type="text"
            value={deptF}
            onChange={(e) => { setDeptF(e.target.value); setPage(1); }}
            placeholder="Filter Departemen..."
            className="px-4 py-2 bg-gray-50 dark:bg-[#1A1A2E] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-850 dark:text-white focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#12121E] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1A1A2E] border-b border-gray-200 dark:border-gray-800">
                <th className="text-left px-2.5 py-2 text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">NIK / Nama</th>
                <th className="text-left px-2.5 py-2 text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Jabatan</th>
                <th className="text-left px-2.5 py-2 text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Departemen</th>
                <th className="text-left px-2.5 py-2 text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">No. HP</th>
                <th className="text-right px-2.5 py-2 text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-[#1A365D] border-t-transparent rounded-full animate-spin" />
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : karyawans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    <Contact size={40} className="mx-auto mb-2 opacity-30" />
                    <p>Tidak ada karyawan ditemukan</p>
                  </td>
                </tr>
              ) : karyawans.map((k) => (
                <tr key={k.id} className="hover:bg-gray-50 dark:hover:bg-[#1A1A2E] transition-colors">
                  <td className="px-2.5 py-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1A365D] to-[#2B4C7E] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {k.nama.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 dark:text-white truncate">{k.nama}</p>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500">NIK: {k.nik}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2.5 py-1.5 text-xs text-gray-600 dark:text-gray-300 hidden sm:table-cell">{k.jabatan}</td>
                  <td className="px-2.5 py-1.5 text-xs text-gray-700 dark:text-gray-300">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 dark:bg-blue-900/20 text-[#1A365D] dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                      {k.departemen}
                    </span>
                  </td>
                  <td className="px-2.5 py-1.5 text-xs text-gray-500 dark:text-gray-400 hidden md:table-cell">{k.no_hp || '-'}</td>
                  <td className="px-2.5 py-1.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setShowDetail(k)}
                        className="p-1 text-gray-400 hover:text-[#1A365D] dark:hover:text-[#4A8CC7] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all active:scale-90"
                        title="Detail"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => openEdit(k)}
                        className="p-1 text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-all active:scale-90"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(k.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all active:scale-90"
                        title="Hapus"
                      >
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
        {pagination && pagination.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Menampilkan {((pagination.current_page - 1) * pagination.per_page) + 1} - {Math.min(pagination.current_page * pagination.per_page, pagination.total)} dari {pagination.total}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={pagination.current_page === 1}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                    p === pagination.current_page
                      ? 'bg-[#1A365D] text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                disabled={pagination.current_page === pagination.last_page}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-4" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="bg-white dark:bg-[#12121E] rounded-2xl shadow-2xl dark:shadow-black/60 w-full max-w-lg max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-800 my-auto overflow-hidden">
            <div className="bg-white/90 dark:bg-[#12121E]/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 px-5 py-4 flex items-center justify-between shrink-0 sticky top-0 z-10">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Contact size={18} />
                </div>
                {editingId ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
              {/* NIK */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">NIK (Nomor Induk Karyawan)</label>
                <div className="relative">
                  <IdCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={form.nik}
                    onChange={(e) => setForm({ ...form, nik: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1A1A2E] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-850 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all text-sm"
                    placeholder="NIK-1234"
                  />
                </div>
                {formErrors.nik && <p className="text-red-500 text-xs mt-1">{formErrors.nik}</p>}
              </div>

              {/* Nama Lengkap */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1A1A2E] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-850 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all text-sm"
                    placeholder="Nama Karyawan"
                  />
                </div>
                {formErrors.nama && <p className="text-red-500 text-xs mt-1">{formErrors.nama}</p>}
              </div>

              {/* Jabatan & Departemen */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jabatan</label>
                  <div className="relative">
                    <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={form.jabatan}
                      onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1A1A2E] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-850 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all text-sm"
                      placeholder="Operator"
                    />
                  </div>
                  {formErrors.jabatan && <p className="text-red-500 text-xs mt-1">{formErrors.jabatan}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Departemen</label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={form.departemen}
                      onChange={(e) => setForm({ ...form, departemen: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1A1A2E] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-850 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all text-sm"
                      placeholder="Maintenance"
                    />
                  </div>
                  {formErrors.departemen && <p className="text-red-500 text-xs mt-1">{formErrors.departemen}</p>}
                </div>
              </div>

              {/* No HP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No. HP</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={form.no_hp}
                    onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1A1A2E] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-850 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all text-sm"
                    placeholder="0812xxxxxx"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50/90 dark:bg-[#161626]/90 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800 px-5 py-3.5 flex items-center justify-end gap-3 shrink-0 sticky bottom-0 z-10">
              <Button variant="outline" onClick={() => setShowModal(false)} size="sm">Batal</Button>
              <Button variant="primary" onClick={handleSave} isLoading={saving} size="sm" className="bg-[#1A365D] text-white">
                {editingId ? 'Simpan Perubahan' : 'Tambah Karyawan'}
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Detail Modal */}
      {showDetail && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-4" onClick={(e) => e.target === e.currentTarget && setShowDetail(null)}>
          <div className="bg-white dark:bg-[#12121E] rounded-2xl shadow-2xl dark:shadow-black/60 w-full max-w-md max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-800 my-auto overflow-hidden">
            <div className="bg-white/90 dark:bg-[#12121E]/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 px-5 py-4 flex items-center justify-between shrink-0 sticky top-0 z-10">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1A365D]/10 text-[#1A365D] dark:text-[#4A8CC7] flex items-center justify-center font-bold">
                  <Eye size={18} />
                </div>
                Detail Karyawan
              </h3>
              <button onClick={() => setShowDetail(null)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1A365D] to-[#2B4C7E] text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-md shadow-[#1A365D]/20">
                  {showDetail.nama.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold text-gray-800 dark:text-white truncate">{showDetail.nama}</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">NIK: {showDetail.nik}</p>
                </div>
              </div>
              <div className="space-y-3.5">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1A1A2E] flex items-center justify-center text-gray-500 shrink-0">
                    <Briefcase size={16} />
                  </div>
                  <span className="text-gray-705 dark:text-gray-200 font-medium">{showDetail.jabatan}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1A1A2E] flex items-center justify-center text-gray-500 shrink-0">
                    <Building2 size={16} />
                  </div>
                  <span className="text-gray-705 dark:text-gray-200 font-medium">{showDetail.departemen}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1A1A2E] flex items-center justify-center text-gray-500 shrink-0">
                    <Phone size={16} />
                  </div>
                  <span className="text-gray-750 dark:text-gray-200">{showDetail.no_hp || '-'}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50/90 dark:bg-[#161626]/90 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800 px-5 py-3.5 flex justify-end shrink-0 sticky bottom-0 z-10">
              <Button variant="outline" onClick={() => setShowDetail(null)} size="sm">Tutup</Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-4" onClick={(e) => e.target === e.currentTarget && setDeleteId(null)}>
          <div className="bg-white dark:bg-[#12121E] rounded-2xl shadow-2xl dark:shadow-black/60 w-full max-w-sm border border-gray-200 dark:border-gray-800 p-6 my-auto overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Trash2 size={24} className="text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white text-center mb-2">Hapus Karyawan</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus data karyawan ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-[0.97]"
              >
                Batal
              </button>
              <button
                onClick={() => delMut.mutate(deleteId)}
                disabled={delMut.isPending}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 active:scale-[0.97] flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
              >
                {delMut.isPending ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Import Modal */}
      {showImportModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-4" onClick={(e) => e.target === e.currentTarget && setShowImportModal(false)}>
          <div className="bg-white dark:bg-[#12121E] rounded-2xl shadow-2xl dark:shadow-black/60 w-full max-w-lg max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-800 my-auto overflow-hidden">
            <div className="bg-white/90 dark:bg-[#12121E]/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 px-5 py-4 flex items-center justify-between shrink-0 sticky top-0 z-10">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1A365D]/10 text-[#1A365D] dark:text-blue-400 flex items-center justify-center font-bold">
                  <FileSpreadsheet size={18} />
                </div>
                Impor Karyawan dari Excel
              </h3>
              <button onClick={() => setShowImportModal(false)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-xl p-3.5 text-xs text-blue-800 dark:text-blue-300 space-y-2">
                <p className="font-semibold">Panduan Format File Excel:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Baris pertama harus berisi judul kolom: <strong>nik, nama, jabatan, departemen, no_hp</strong></li>
                  <li>Kolom <strong>nik, nama, jabatan, departemen</strong> wajib diisi.</li>
                  <li>Jika NIK sudah terdaftar, data karyawan tersebut akan diperbarui otomatis.</li>
                </ul>
                <button
                  type="button"
                  onClick={downloadTemplate}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-bold flex items-center gap-1.5"
                >
                  Download Template CSV/Excel
                </button>
              </div>

              {/* Upload Input */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 text-center hover:border-[#1A365D] dark:hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="excel-file-karyawan"
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setImportFile(file);
                  }}
                />
                <label htmlFor="excel-file-karyawan" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload size={32} className="text-gray-400 dark:text-gray-650" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-250">
                    {importFile ? importFile.name : 'Pilih atau drop file Excel di sini'}
                  </span>
                  <span className="text-xs text-gray-450 dark:text-gray-400">
                    Mendukung file .xlsx, .xls, atau .csv (maksimal 5MB)
                  </span>
                </label>
              </div>

              {/* Error messages if present */}
              {importErrors.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl p-4 text-xs text-amber-800 dark:text-amber-300 space-y-2">
                  <p className="font-semibold">Beberapa baris gagal diimpor:</p>
                  <div className="max-h-36 overflow-y-auto space-y-1 custom-scrollbar">
                    {importErrors.map((err, idx) => (
                      <p key={idx}>{err}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50/90 dark:bg-[#161626]/90 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800 px-5 py-3.5 flex items-center justify-end gap-3 shrink-0 sticky bottom-0 z-10">
              <Button variant="outline" onClick={() => setShowImportModal(false)} size="sm">Batal</Button>
              <Button variant="primary" onClick={handleImport} isLoading={importing} disabled={!importFile} size="sm" className="bg-[#1A365D] text-white">
                Mulai Impor
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
