'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, updateUser, deleteUser, UserData, getRoles, importUsers } from '@/lib/api/users';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';
import { Plus, Search, Eye, Edit, Trash2, Users, ChevronLeft, ChevronRight, X, Mail, Lock, User, Calendar, MapPin, Phone, Building2, ShieldCheck, FileSpreadsheet, Upload } from 'lucide-react';

const roleLabels: Record<string, string> = {
  user: 'User',
  supervisor: 'Supervisor',
  admin: 'Admin',
  audit: 'Audit',
  kasubag: 'Kasubag',
};

const roleColors: Record<string, string> = {
  user: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  supervisor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  admin: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  audit: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  kasubag: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
};

interface FormData {
  username: string;
  name: string;
  email: string;
  password: string;
  role: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  no_hp: string;
  departemen: string;
}

const emptyForm: FormData = {
  username: '',
  name: '',
  email: '',
  password: '',
  role: 'user',
  tempat_lahir: '',
  tanggal_lahir: '',
  no_hp: '',
  departemen: '',
};

export default function MasterUsersTab() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleF, setRoleF] = useState('');
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
  const [showDetail, setShowDetail] = useState<UserData | null>(null);

  const downloadTemplate = () => {
    const headers = ['username', 'name', 'email', 'password', 'role', 'tempat_lahir', 'tanggal_lahir', 'no_hp', 'departemen'];
    const sampleData = ['john_doe', 'John Doe', 'john@inl.co.id', 'password123', 'user', 'Jakarta', '1995-08-15', '08123456789', 'Produksi'];
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), sampleData.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "template_master_user.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = async () => {
    if (!importFile) return;
    setImporting(true);
    setImportErrors([]);
    try {
      const res = await importUsers(importFile);
      if (res.success) {
        toast.success(res.message || 'Data user berhasil diimpor');
        if (res.errors && res.errors.length > 0) {
          setImportErrors(res.errors);
        } else {
          setShowImportModal(false);
          setImportFile(null);
        }
        qc.invalidateQueries({ queryKey: ['master-users'] });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Gagal mengimpor data user';
      toast.error(msg);
    } finally {
      setImporting(false);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['master-users', search, roleF, page],
    queryFn: () => getUsers({ search: search || undefined, role: roleF || undefined, page, per_page: 10 }),
  });

  const { data: rolesData } = useQuery({
    queryKey: ['user-roles'],
    queryFn: () => getRoles(),
  });

  const users: UserData[] = data?.data?.data || [];
  const pagination = data?.data;
  const roles: { value: string; label: string }[] = rolesData?.data || [];

  const delMut = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['master-users'] });
      toast.success('User berhasil dihapus');
      setDeleteId(null);
    },
    onError: () => toast.error('Gagal menghapus user'),
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (u: UserData) => {
    setEditingId(u.id);
    setForm({
      username: u.username,
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
      tempat_lahir: u.tempat_lahir || '',
      tanggal_lahir: u.tanggal_lahir || '',
      no_hp: u.no_hp || '',
      departemen: u.departemen || '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.username.trim()) errs.username = 'Username wajib diisi';
    if (!form.name.trim()) errs.name = 'Nama lengkap wajib diisi';
    if (!form.email.trim()) errs.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Format email tidak valid';
    if (!editingId && !form.password) errs.password = 'Password wajib diisi';
    else if (form.password && form.password.length < 6) errs.password = 'Password minimal 6 karakter';
    if (!form.role) errs.role = 'Role wajib dipilih';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        password: form.password || undefined,
        tempat_lahir: form.tempat_lahir || undefined,
        tanggal_lahir: form.tanggal_lahir || undefined,
        no_hp: form.no_hp || undefined,
        departemen: form.departemen || undefined,
      };
      if (editingId) {
        await updateUser(editingId, payload);
        toast.success('User berhasil diperbarui');
      } else {
        await createUser(payload as any);
        toast.success('User berhasil ditambahkan');
      }
      qc.invalidateQueries({ queryKey: ['master-users'] });
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

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1A365D]/10 text-[#1A365D] dark:text-blue-400 flex items-center justify-center">
              <Users size={16} />
            </div>
            Master Data User
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Kelola semua akun login user, supervisor, dan admin
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => { setShowImportModal(true); setImportFile(null); setImportErrors([]); }} size="sm" variant="outline" className="flex items-center gap-2 border-[#1A365D] text-[#1A365D] hover:bg-[#1A365D]/5 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400/5">
            <FileSpreadsheet size={16} /> Impor Excel
          </Button>
          <Button onClick={openCreate} size="sm" className="bg-[#1A365D] hover:bg-[#2B4C7E] text-white">
            <Plus size={16} /> Tambah User
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
              placeholder="Cari username, nama, email..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1A1A2E] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-850 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all text-sm"
            />
          </div>
          <select
            value={roleF}
            onChange={(e) => { setRoleF(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-gray-50 dark:bg-[#1A1A2E] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-850 dark:text-white focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all text-sm"
          >
            <option value="">Semua Role</option>
            {roles.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#12121E] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1A1A2E] border-b border-gray-200 dark:border-gray-800">
                <th className="text-left px-2.5 py-2 text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">User</th>
                <th className="text-left px-2.5 py-2 text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="text-left px-2.5 py-2 text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Role</th>
                <th className="text-left px-2.5 py-2 text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Departemen</th>
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
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    <Users size={40} className="mx-auto mb-2 opacity-30" />
                    <p>Tidak ada user ditemukan</p>
                  </td>
                </tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-[#1A1A2E] transition-colors">
                  <td className="px-2.5 py-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1A365D] to-[#2B4C7E] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-semibold text-gray-800 dark:text-white truncate">{u.name}</p>
                          <span className={`sm:hidden inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${roleColors[u.role] || ''}`}>
                            {roleLabels[u.role] || u.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2.5 py-1.5 text-xs text-gray-600 dark:text-gray-300 hidden md:table-cell">{u.email}</td>
                  <td className="px-2.5 py-1.5 hidden sm:table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${roleColors[u.role] || ''}`}>
                      {roleLabels[u.role] || u.role}
                    </span>
                  </td>
                  <td className="px-2.5 py-1.5 text-xs text-gray-500 dark:text-gray-400 hidden lg:table-cell">{u.departemen || '-'}</td>
                  <td className="px-2.5 py-1.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setShowDetail(u)}
                        className="p-1 text-gray-400 hover:text-[#1A365D] dark:hover:text-[#4A8CC7] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all active:scale-90"
                        title="Detail"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => openEdit(u)}
                        className="p-1 text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-all active:scale-90"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(u.id)}
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
          <div className="bg-white dark:bg-[#12121E] rounded-2xl shadow-2xl dark:shadow-black/60 w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-800 my-auto overflow-hidden">
            <div className="bg-white/90 dark:bg-[#12121E]/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 px-5 py-4 flex items-center justify-between shrink-0 sticky top-0 z-10">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <User size={18} />
                </div>
                {editingId ? 'Edit User' : 'Tambah User Baru'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
              {/* Username & Nama Lengkap */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1A1A2E] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-850 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all text-sm"
                      placeholder="john_doe"
                    />
                  </div>
                  {formErrors.username && <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1A1A2E] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-855 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all text-sm"
                    placeholder="John Doe"
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>
              </div>

              {/* Email & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1A1A2E] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-850 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all text-sm"
                      placeholder="user@inl.co.id"
                    />
                  </div>
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password {editingId && <span className="text-gray-400 font-normal">(kosongkan jika tidak diubah)</span>}
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1A1A2E] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-850 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all text-sm"
                      placeholder={editingId ? 'Kosongkan jika tidak diubah' : 'Minimal 6 karakter'}
                    />
                  </div>
                  {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                </div>
              </div>

              {/* TTL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tempat Lahir</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={form.tempat_lahir}
                      onChange={(e) => setForm({ ...form, tempat_lahir: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1A1A2E] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-850 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all text-sm"
                      placeholder="Jakarta"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal Lahir</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      value={form.tanggal_lahir}
                      onChange={(e) => setForm({ ...form, tanggal_lahir: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1A1A2E] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-850 dark:text-white focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Role & Departemen */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                  <div className="relative">
                    <ShieldCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1A1A2E] border border-gray-300 dark:border-gray-700 rounded-xl text-gray-850 dark:text-white focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all text-sm"
                    >
                      {roles.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                  {formErrors.role && <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>}
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
                      placeholder="Produksi"
                    />
                  </div>
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
                {editingId ? 'Simpan Perubahan' : 'Tambah User'}
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
                Detail User
              </h3>
              <button onClick={() => setShowDetail(null)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1A365D] to-[#2B4C7E] text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-md shadow-[#1A365D]/20">
                  {showDetail.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold text-gray-800 dark:text-white truncate">{showDetail.name}</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">@{showDetail.username}</p>
                </div>
              </div>
              <div className="space-y-3.5">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1A1A2E] flex items-center justify-center text-gray-500 shrink-0">
                    <Mail size={16} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200 font-medium break-all">{showDetail.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1A1A2E] flex items-center justify-center text-gray-500 shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${roleColors[showDetail.role] || ''}`}>
                    {roleLabels[showDetail.role] || showDetail.role}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1A1A2E] flex items-center justify-center text-gray-500 shrink-0">
                    <MapPin size={16} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">{showDetail.tempat_lahir || '-'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1A1A2E] flex items-center justify-center text-gray-500 shrink-0">
                    <Calendar size={16} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">{formatDate(showDetail.tanggal_lahir)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1A1A2E] flex items-center justify-center text-gray-500 shrink-0">
                    <Building2 size={16} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">{showDetail.departemen || '-'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1A1A2E] flex items-center justify-center text-gray-500 shrink-0">
                    <Phone size={16} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">{showDetail.no_hp || '-'}</span>
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
            <h3 className="text-lg font-bold text-gray-800 dark:text-white text-center mb-2">Hapus User</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.
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
                Impor Data User dari Excel
              </h3>
              <button onClick={() => setShowImportModal(false)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-xl p-3.5 text-xs text-blue-800 dark:text-blue-300 space-y-2">
                <p className="font-semibold">Panduan Format File Excel:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Baris pertama harus berisi judul kolom: <strong>username, name, email, password, role, tempat_lahir, tanggal_lahir, no_hp, departemen</strong></li>
                  <li>Kolom <strong>username, name, email</strong> wajib diisi.</li>
                  <li>Jika password dikosongkan, default password adalah <strong>password123</strong>.</li>
                  <li>Role yang valid: <strong>user, supervisor, admin</strong> (default: user).</li>
                  <li>Format tanggal lahir: <strong>YYYY-MM-DD</strong>.</li>
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
                  id="excel-file-user"
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setImportFile(file);
                  }}
                />
                <label htmlFor="excel-file-user" className="cursor-pointer flex flex-col items-center gap-2">
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
