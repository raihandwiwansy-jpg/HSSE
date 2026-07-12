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
      const res = await fetch('http://localhost:8000/api/user/update-profile-photo', {
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
      const res = await fetch('http://localhost:8000/api/user/profile', {
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
    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
    : user.role === 'supervisor'
    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';

  const roleLabel = user.role === 'admin' ? 'Admin' : user.role === 'supervisor' ? 'Supervisor' : 'User';

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5 animate-fade-in-up">
      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        
        {/* Cover gradient */}
        <div className="h-24 bg-gradient-to-r from-blue-500 via-violet-500 to-blue-600 relative">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Avatar + Info */}
        <div className="px-6 pb-6">
          {/* Avatar (overlapping cover) */}
          <div className="relative -mt-12 mb-3 flex justify-center sm:justify-start">
            <div className="relative">
              <button
                onClick={handleFotoClick}
                disabled={uploading}
                className="group relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg block hover:opacity-90 transition-opacity disabled:opacity-60 bg-gray-100 dark:bg-gray-700"
              >
                {displayPhoto ? (
                  <img src={displayPhoto} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-violet-500">
                    <span className="text-3xl sm:text-4xl font-bold text-white">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
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
                className="absolute bottom-0 right-0 w-7 h-7 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Camera size={13} className="text-white" />
                )}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
            </div>
          </div>

          {/* Name & Role */}
          <div className="text-center sm:text-left">
            {editing ? (
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="text-lg font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
            ) : (
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{user.email}</p>
            <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${roleColor}`}>
                <Shield size={11} />
                {roleLabel}
              </span>
              {user.departemen && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  <Building2 size={11} />
                  {user.departemen}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Informasi Akun</h3>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
            >
              <Edit2 size={13} />
              Edit
            </button>
          )}
        </div>

        {/* Email */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
            <Mail size={15} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Email</p>
            <p className="text-sm text-gray-800 dark:text-white truncate">{user.email}</p>
          </div>
        </div>

        {/* Departemen */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
          <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
            <Building2 size={15} className="text-violet-600 dark:text-violet-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Departemen</p>
            <p className="text-sm text-gray-800 dark:text-white">{user.departemen || '-'}</p>
          </div>
        </div>

        {/* Role */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
            <Shield size={15} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Peran</p>
            <p className="text-sm text-gray-800 dark:text-white capitalize">{user.role}</p>
          </div>
        </div>

        {/* No HP */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
          <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
            <Phone size={15} className="text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">No. HP</p>
            {editing ? (
              <input
                type="text"
                value={form.no_hp}
                onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
                className="text-sm text-gray-800 dark:text-white bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-md px-2 py-1 w-full mt-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Belum diisi"
              />
            ) : (
              <p className="text-sm text-gray-800 dark:text-white">{user.no_hp || '-'}</p>
            )}
          </div>
        </div>

        {/* Edit Actions */}
        {editing && (
          <div className="flex gap-2 pt-3">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              <Save size={15} />
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setForm({ name: user.name, no_hp: user.no_hp || '' });
              }}
              className="px-4 py-2.5 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Batal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
