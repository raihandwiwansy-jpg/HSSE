'use client';

import { useState, useEffect } from 'react';
import { changePassword, changeEmail, toggleOtpForgot } from '@/lib/api/auth';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';
import { ShieldAlert, KeyRound, Mail, ToggleLeft, ToggleRight, CheckCircle2, Lock } from 'lucide-react';

export default function SecurityTab() {
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const [emailForm, setEmailForm] = useState({
    email: '',
    password: '',
  });

  const [requireOtp, setRequireOtp] = useState(true);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (typeof user.require_otp_forgot_password !== 'undefined') {
          setRequireOtp(user.require_otp_forgot_password);
        }
        setEmailForm((prev) => ({ ...prev, email: user.email || '' }));
      } catch (e) {
        console.error('Failed parsing user from localStorage', e);
      }
    }
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.current_password || !passwordForm.password || !passwordForm.password_confirmation) {
      toast.error('Semua kolom password wajib diisi');
      return;
    }

    if (passwordForm.password !== passwordForm.password_confirmation) {
      toast.error('Konfirmasi password tidak cocok');
      return;
    }

    if (passwordForm.password.length < 8) {
      toast.error('Password baru minimal 8 karakter');
      return;
    }

    setLoadingPassword(true);
    try {
      const res = await changePassword({
        current_password: passwordForm.current_password,
        password: passwordForm.password,
        password_confirmation: passwordForm.password_confirmation,
      });

      if (res.success) {
        toast.success(res.message || 'Password berhasil diubah');
        setPasswordForm({
          current_password: '',
          password: '',
          password_confirmation: '',
        });
      }
    } catch (err: any) {
      const msg = err?.message || err?.response?.data?.message || 'Gagal mengubah password';
      toast.error(msg);
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.email || !emailForm.password) {
      toast.error('Email baru dan password konfirmasi wajib diisi');
      return;
    }

    setLoadingEmail(true);
    try {
      const res = await changeEmail({
        email: emailForm.email,
        password: emailForm.password,
      });

      if (res.success) {
        toast.success('Email berhasil diubah');
        // Update localstorage user email
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.email = emailForm.email;
          localStorage.setItem('user', JSON.stringify(user));
        }
        setEmailForm((prev) => ({ ...prev, password: '' }));
      }
    } catch (err: any) {
      const msg = err?.message || err?.response?.data?.message || 'Gagal mengubah email';
      toast.error(msg);
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleToggleOtp = async () => {
    setLoadingOtp(true);
    const newValue = !requireOtp;
    try {
      const res = await toggleOtpForgot(newValue);
      if (res.success) {
        setRequireOtp(newValue);
        toast.success(res.message || 'Preferensi verifikasi keamanan berhasil diperbarui');
        // Update localstorage user otp setting
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.require_otp_forgot_password = newValue;
          localStorage.setItem('user', JSON.stringify(user));
        }
      }
    } catch (err: any) {
      const msg = err?.message || err?.response?.data?.message || 'Gagal memperbarui preferensi';
      toast.error(msg);
    } finally {
      setLoadingOtp(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up pb-10">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1A365D]/10 text-[#1A365D] dark:text-blue-400 flex items-center justify-center">
            <KeyRound size={16} />
          </div>
          Keamanan Akun
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Kelola password, email, dan pengaturan verifikasi keamanan akun Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Change Password Form */}
        <div className="bg-white dark:bg-[#12121E] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <Lock size={16} className="text-[#1A365D] dark:text-blue-400" />
            Ubah Password
          </h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-650 dark:text-gray-300 mb-1.5">
                Password Sekarang
              </label>
              <input
                type="password"
                value={passwordForm.current_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1A1A2E] border border-gray-350 dark:border-gray-700 rounded-xl text-xs text-gray-850 dark:text-white focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all"
                placeholder="Masukkan password saat ini"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-650 dark:text-gray-300 mb-1.5">
                Password Baru
              </label>
              <input
                type="password"
                value={passwordForm.password}
                onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1A1A2E] border border-gray-350 dark:border-gray-700 rounded-xl text-xs text-gray-850 dark:text-white focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all"
                placeholder="Minimal 8 karakter"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-650 dark:text-gray-300 mb-1.5">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                value={passwordForm.password_confirmation}
                onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1A1A2E] border border-gray-350 dark:border-gray-700 rounded-xl text-xs text-gray-850 dark:text-white focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all"
                placeholder="Ulangi password baru"
              />
            </div>
            <div className="pt-2">
              <Button type="submit" isLoading={loadingPassword} size="sm" className="w-full bg-[#1A365D] text-white">
                Simpan Password Baru
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          {/* Change Email Form */}
          <div className="bg-white dark:bg-[#12121E] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <Mail size={16} className="text-[#1A365D] dark:text-blue-400" />
              Ganti Email
            </h3>
            <form onSubmit={handleEmailChange} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-650 dark:text-gray-300 mb-1.5">
                  Alamat Email Baru
                </label>
                <input
                  type="email"
                  value={emailForm.email}
                  onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1A1A2E] border border-gray-350 dark:border-gray-700 rounded-xl text-xs text-gray-850 dark:text-white focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-650 dark:text-gray-300 mb-1.5">
                  Konfirmasi Password Anda
                </label>
                <input
                  type="password"
                  value={emailForm.password}
                  onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1A1A2E] border border-gray-350 dark:border-gray-700 rounded-xl text-xs text-gray-850 dark:text-white focus:ring-2 focus:ring-[#1A365D] focus:border-transparent transition-all"
                  placeholder="Masukkan password Anda untuk konfirmasi"
                />
              </div>
              <div className="pt-2">
                <Button type="submit" isLoading={loadingEmail} size="sm" className="w-full bg-[#1A365D] text-white">
                  Perbarui Email
                </Button>
              </div>
            </form>
          </div>

          {/* Forgot Password OTP Verification Setting */}
          <div className="bg-white dark:bg-[#12121E] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <ShieldAlert size={16} className="text-[#1A365D] dark:text-blue-400" />
              Verifikasi Keamanan
            </h3>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-800 dark:text-white">
                  Verifikasi Email Saat Lupa Password
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  Jika diaktifkan, Anda harus memasukkan kode OTP 6 digit yang dikirim ke email Anda untuk mereset password. Jika dinonaktifkan, Anda dapat langsung membuat password baru.
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleOtp}
                disabled={loadingOtp}
                className="text-[#1A365D] dark:text-blue-400 focus:outline-none transition-all active:scale-95 shrink-0"
              >
                {loadingOtp ? (
                  <span className="block w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : requireOtp ? (
                  <ToggleRight size={36} className="text-green-500" />
                ) : (
                  <ToggleLeft size={36} className="text-gray-400 dark:text-gray-600" />
                )}
              </button>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-xl p-3 text-[10px] text-blue-800 dark:text-blue-300 flex items-start gap-2">
              <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
              <p>Preferensi ini dapat diubah sewaktu-waktu sesuai dengan tingkat kenyamanan dan keamanan Anda.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
