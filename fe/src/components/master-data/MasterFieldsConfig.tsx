'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, X } from 'lucide-react';
import { masterFieldApi } from '@/lib/api/masterData';
import { toast } from 'react-toastify';

interface MasterField {
  id: number;
  permit_type: string;
  field_name: string;
  field_label: string;
  field_type: string;
  source_master: string | null;
  is_required: boolean;
  is_locked: boolean;
  urutan: number;
}

const permitTypes = [
  'gwp', 'hwp', 'cse', 'ewp', 'elp', 'rwp', 'lwp', 'whp',
];

const permitTypeLabels: Record<string, string> = {
  gwp: 'GWP (General Work Permit)',
  hwp: 'HWP (Hot Work Permit)',
  cse: 'CSE (Confined Space Entry)',
  ewp: 'EWP (Excavation Work Permit)',
  elp: 'ELP (Electrical Work Permit)',
  rwp: 'RWP (Radiography Work Permit)',
  lwp: 'LWP (Lifting Work Permit)',
  whp: 'WHP (Working at Height Permit)',
};

const fieldTypeOptions = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select (Dropdown)' },
  { value: 'date', label: 'Date' },
  { value: 'time', label: 'Time' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio' },
  { value: 'file', label: 'File' },
];

const inputCls = "w-full px-3 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

export default function MasterFieldsConfig() {
  const [fields, setFields] = useState<MasterField[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPermit, setFilterPermit] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MasterField | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    permit_type: 'gwp',
    field_name: '',
    field_label: '',
    field_type: 'text',
    source_master: '',
    is_required: true,
    is_locked: false,
    urutan: 0,
  });

  useEffect(() => {
    fetchFields();
  }, [filterPermit]);

  // Reset form when modal opens
  useEffect(() => {
    if (showForm) {
      setFormData({
        permit_type: editItem?.permit_type || (filterPermit || 'gwp'),
        field_name: editItem?.field_name || '',
        field_label: editItem?.field_label || '',
        field_type: editItem?.field_type || 'text',
        source_master: editItem?.source_master || '',
        is_required: editItem?.is_required ?? true,
        is_locked: editItem?.is_locked ?? false,
        urutan: editItem?.urutan ?? 0,
      });
    }
  }, [showForm, editItem, filterPermit]);

  const fetchFields = async () => {
    setLoading(true);
    try {
      const res = await masterFieldApi.getAll(filterPermit || undefined);
      setFields(res.data || []);
    } catch {
      toast.error('Gagal memuat field');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus field ini?')) return;
    try {
      await masterFieldApi.delete(id);
      toast.success('Field berhasil dihapus');
      fetchFields();
    } catch {
      toast.error('Gagal menghapus field');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = {
        ...formData,
        source_master: formData.source_master || null,
      };
      if (editItem) {
        await masterFieldApi.update(editItem.id, payload);
        toast.success('Field berhasil diupdate');
      } else {
        await masterFieldApi.create(payload);
        toast.success('Field berhasil ditambahkan');
      }
      setShowForm(false);
      setEditItem(null);
      fetchFields();
    } catch {
      toast.error('Gagal menyimpan field');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-3 flex-wrap">
        <select
          value={filterPermit}
          onChange={(e) => setFilterPermit(e.target.value)}
          className={inputCls + " w-auto"}
        >
          <option value="">Semua Permit</option>
          {permitTypes.map((pt) => (
            <option key={pt} value={pt}>{permitTypeLabels[pt]}</option>
          ))}
        </select>
        <button
          onClick={() => { setEditItem(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 rounded-xl transition-all shadow-sm"
        >
          <Plus size={16} />
          Tambah Field
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Permit Type</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Field Name</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Label</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Master Data</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Req</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Lock</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Urutan</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr><td colSpan={10} className="px-4 py-12 text-center text-gray-500">Memuat data...</td></tr>
            ) : fields.length === 0 ? (
              <tr><td colSpan={10} className="px-4 py-12 text-center text-gray-500">
                <p className="font-medium mb-1">Belum ada field</p>
                <p className="text-xs text-gray-400">Tambah field untuk mengatur form permit</p>
              </td></tr>
            ) : fields.map((f, idx) => (
              <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3 text-xs text-gray-400">{idx + 1}</td>
                <td className="px-4 py-3 text-xs text-gray-800 dark:text-white">{permitTypeLabels[f.permit_type] || f.permit_type}</td>
                <td className="px-4 py-3 text-xs text-gray-800 dark:text-white font-mono">{f.field_name}</td>
                <td className="px-4 py-3 text-xs text-gray-800 dark:text-white">{f.field_label}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md">{f.field_type}</span></td>
                <td className="px-4 py-3 text-xs text-gray-500">{f.source_master || '-'}</td>
                <td className="px-4 py-3 text-center">{f.is_required ? <span className="text-green-500 font-bold">Y</span> : <span className="text-gray-400">-</span>}</td>
                <td className="px-4 py-3 text-center">{f.is_locked ? <span className="text-amber-500 font-bold">Y</span> : <span className="text-gray-400">-</span>}</td>
                <td className="px-4 py-3 text-center text-xs text-gray-500">{f.urutan}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => { setEditItem(f); setShowForm(true); }} className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors" title="Edit">
                      <Edit size={15} />
                    </button>
                    <button onClick={() => handleDelete(f.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Hapus">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal — rendered via portal to escape parent transforms */}
      {showForm && typeof window !== 'undefined' && require('react-dom').createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => { setShowForm(false); setEditItem(null); }}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-lg p-6 animate-fade-in-up"
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editItem ? 'Edit Field' : 'Tambah Field'}
              </h3>
              <button
                onClick={() => { setShowForm(false); setEditItem(null); }}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipe Permit</label>
                <select
                  value={formData.permit_type}
                  onChange={(e) => setFormData({ ...formData, permit_type: e.target.value })}
                  className={inputCls}
                  required
                >
                  {permitTypes.map((pt) => (
                    <option key={pt} value={pt}>{permitTypeLabels[pt]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Field (snake_case)</label>
                <input
                  value={formData.field_name}
                  onChange={(e) => setFormData({ ...formData, field_name: e.target.value })}
                  className={inputCls}
                  required
                  placeholder="contoh: lokasi_kerja"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Label Field</label>
                <input
                  value={formData.field_label}
                  onChange={(e) => setFormData({ ...formData, field_label: e.target.value })}
                  className={inputCls}
                  required
                  placeholder="contoh: Lokasi Kerja"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipe Input</label>
                <select
                  value={formData.field_type}
                  onChange={(e) => setFormData({ ...formData, field_type: e.target.value })}
                  className={inputCls}
                >
                  {fieldTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sumber Master Data (opsional)</label>
                <select
                  value={formData.source_master}
                  onChange={(e) => setFormData({ ...formData, source_master: e.target.value })}
                  className={inputCls}
                >
                  <option value="">-- Tidak ada --</option>
                  <option value="departemen">Departemen</option>
                  <option value="personil">Personil</option>
                  <option value="peralatan">Peralatan</option>
                  <option value="bahaya">Bahaya</option>
                  <option value="risiko">Risiko</option>
                  <option value="checklist">Checklist</option>
                  <option value="shift">Shift</option>
                  <option value="lokasi">Lokasi</option>
                  <option value="apd">APD</option>
                </select>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_required}
                    onChange={(e) => setFormData({ ...formData, is_required: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Required
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_locked}
                    onChange={(e) => setFormData({ ...formData, is_locked: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Locked (read-only)
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Urutan</label>
                <input
                  type="number"
                  value={formData.urutan}
                  onChange={(e) => setFormData({ ...formData, urutan: parseInt(e.target.value) || 0 })}
                  className={inputCls + " w-28"}
                  min="0"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditItem(null); }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {formLoading && <Loader2 size={16} className="animate-spin" />}
                  {editItem ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
