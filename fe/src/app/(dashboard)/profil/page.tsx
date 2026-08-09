'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Camera, Mail, Building2, Shield, Save, Edit2, Phone } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', no_hp: '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', no_hp: user.no_hp || '' });
      const url = user.photo_url || user.avatar || user.foto || null;
      setPhotoUrl(url);
    }
  }, [user]);

  const handleFotoClick = () => fileInputRef.current?.click();

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('photo', file);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${baseUrl}/user/update-profile-photo`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        body: formData,
      });
      const json = await res.json();
      if (res.ok) {
        const baseUrl = json?.data?.photo_url;
        const newUrlWithCache = baseUrl + '?t=' + Date.now();
        // Update local state immediately (no refresh needed)
        setPhotoUrl(newUrlWithCache);
        // Propagate to all components via useAuth context + localStorage
        updateUser({ photo_url: newUrlWithCache });
        // Trigger sidebar/header to re-read localStorage
        window.dispatchEvent(new Event('storage'));
        toast.success('Foto profil berhasil diupdate!');
      } else {
        toast.error(json.message || 'Gagal mengupload foto');
      }
    } catch {
      toast.error('Gagal terhubung ke server');
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${baseUrl}/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (res.ok) {
        updateUser(form);
        window.dispatchEvent(new Event('storage'));
        setEditing(false);
        toast.success('Profil berhasil diperbarui');
      } else {
        toast.error(json.message || 'Gagal menyimpan');
      }
    } catch {
      toast.error('Gagal terhubung ke server');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const displayPhoto = photoUrl;
  const roleColor = user.role === 'admin'
    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800'
    : user.role === 'supervisor'
    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';

  const roleLabel = user.role === 'admin' ? 'Admin HSE' : user.role === 'supervisor' ? 'Supervisor' : 'User (Karyawan)';

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 animate-fade-in-up">
      {/* Header Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Profil Pengguna</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Kelola informasi data diri dan akun MS-HSSE Anda
          </p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800/60 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <Edit2 size={14} />
            <span>Edit Profil</span>
          </button>
        )}
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Column: Avatar & Summary Card */}
        <div className="md:col-span-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6 flex flex-col items-center text-center justify-center shadow-sm">
          {/* Avatar Upload */}
          <div className="relative mb-4">
            <button
              onClick={handleFotoClick}
              disabled={uploading}
              className="group relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-md block hover:opacity-95 transition-all disabled:opacity-60 bg-gray-100 dark:bg-gray-800"
              title="Klik untuk ubah foto"
            >
              {displayPhoto ? (
                <img src={displayPhoto} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#1A365D] text-white">
                  <span className="text-3xl sm:text-4xl font-bold">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={22} className="text-white" />
              </div>
            </button>

            {/* Camera badge */}
            <button
              onClick={handleFotoClick}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-md transition-all disabled:opacity-50 active:scale-90"
              title="Ubah Foto"
            >
              {uploading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Camera size={14} />
              )}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
          </div>

          {/* User Name & Email */}
          <div className="w-full">
            {editing ? (
              <div className="mb-2">
                <label className="block text-[11px] font-semibold text-left text-gray-500 dark:text-gray-400 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="text-sm font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nama Lengkap"
                />
              </div>
            ) : (
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">{user.name}</h2>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{user.email}</p>
          </div>

          {/* Badges */}
          <div className="mt-3.5 flex flex-wrap gap-2 justify-center">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${roleColor}`}>
              <Shield size={12} />
              {roleLabel}
            </span>
            {user.departemen && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                <Building2 size={12} />
                {user.departemen}
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Account Details */}
        <div className="md:col-span-7 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
              Informasi Akun
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Email */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <Mail size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Email</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-white truncate" title={user.email}>{user.email}</p>
                </div>
              </div>

              {/* Departemen */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                <div className="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                  <Building2 size={16} className="text-violet-600 dark:text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Departemen</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-white">{user.departemen || '-'}</p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                  <Shield size={16} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Peran Sistem</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-white capitalize">{user.role}</p>
                </div>
              </div>

              {/* No HP */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <Phone size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">No. HP / Telepon</p>
                  {editing ? (
                    <input
                      type="text"
                      value={form.no_hp}
                      onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
                      className="text-xs sm:text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 w-full mt-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="08xxxxxxxxxx"
                    />
                  ) : (
                    <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-white">{user.no_hp || '-'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Edit Actions */}
          {editing && (
            <div className="flex items-center justify-end gap-2.5 pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setForm({ name: user.name, no_hp: user.no_hp || '' });
                }}
                className="px-4 py-2 text-xs sm:text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50"
              >
                <Save size={14} />
                <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
