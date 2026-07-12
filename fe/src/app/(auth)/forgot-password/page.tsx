'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { forgotPassword, verifyOtp, resetPassword } from '@/lib/api/auth';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Logo } from '@/components/ui/Logo';
import { Mail, KeyRound, Lock, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

const emailSchema = z.object({
  email: z.string().email('Email tidak valid'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'Kode OTP harus 6 digit').regex(/^\d{6}$/, 'Hanya angka'),
});

const passwordSchema = z.object({
  password: z.string().min(8, 'Password minimal 8 karakter'),
  password_confirmation: z.string().min(8, 'Password minimal 8 karakter'),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'Konfirmasi password tidak cocok',
  path: ['password_confirmation'],
});

type EmailData = z.infer<typeof emailSchema>;
type OtpData = z.infer<typeof otpSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

type Step = 'email' | 'otp' | 'password' | 'success';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [step, setStep] = useState<Step>('email');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [receivedOtp, setReceivedOtp] = useState('');

  const emailForm = useForm<EmailData>({ resolver: zodResolver(emailSchema) });
  const otpForm = useForm<OtpData>({ resolver: zodResolver(otpSchema) });
  const passwordForm = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) });

  const handleSendOtp = async (data: EmailData) => {
    setLoading(true);
    setErrorDetail(null);
    try {
      const res = await forgotPassword(data.email);
      if (res.success) {
        setEmail(data.email);
        if (res.data?.bypass) {
          setResetToken(res.data.reset_token);
          setStep('password');
          toast.success('Verifikasi email dinonaktifkan. Silakan buat password baru.');
        } else {
          if (res.data?.otp) {
            setReceivedOtp(res.data.otp);
          }
          setStep('otp');
          toast.success('Kode OTP telah dikirim ke email Anda');
        }
      } else {
        setErrorDetail(res.message || 'Gagal mengirim OTP');
      }
    } catch (err: any) {
      setErrorDetail(err?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (data: OtpData) => {
    setLoading(true);
    setErrorDetail(null);
    try {
      const res = await verifyOtp(email, data.otp);
      if (res.success) {
        setResetToken(res.data.reset_token);
        setStep('password');
        toast.success('Kode OTP valid');
      } else {
        setErrorDetail(res.message || 'Kode OTP salah');
      }
    } catch (err: any) {
      setErrorDetail(err?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (data: PasswordData) => {
    setLoading(true);
    setErrorDetail(null);
    try {
      const res = await resetPassword(email, resetToken, data.password, data.password_confirmation);
      if (res.success) {
        setStep('success');
        toast.success('Password berhasil direset');
      } else {
        setErrorDetail(res.message || 'Gagal mereset password');
      }
    } catch (err: any) {
      setErrorDetail(err?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const steps: Step[] = ['email', 'otp', 'password'];

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden ${isDark
      ? 'bg-gradient-to-br from-[#0B1121] via-[#111827] to-[#0B1121]'
      : 'bg-gradient-to-br from-blue-50 via-indigo-50/50 to-cyan-50'
    }`}>
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.12),transparent_50%)]' : 'bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.08),transparent_50%)]'}`} />
        <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.1),transparent_50%)]' : 'bg-[radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.06),transparent_50%)]'}`} />
        <div className={`absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-gradient-to-br ${isDark ? 'from-blue-500/15 via-cyan-500/10' : 'from-blue-400/10 via-cyan-400/8'} to-transparent blur-3xl animate-float`} />
        <div className={`absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-gradient-to-tr ${isDark ? 'from-violet-500/15 via-fuchsia-500/8' : 'from-violet-400/10 via-fuchsia-400/6'} to-transparent blur-3xl animate-float-delayed`} />
      </div>

      {/* Header */}
      <header className={`relative w-full px-6 py-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/70 border-slate-200'} backdrop-blur-xl border-b transition-colors duration-300 z-10`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1.5 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-xl blur-sm" />
              <Logo size="md" />
            </div>
          </div>
          <div className="hidden md:block text-center">
            <h1 className={`text-sm font-bold tracking-wide ${isDark ? 'text-white/90' : 'text-slate-800'}`}>
              PT. INDUSTRI NABATI LESTARI
            </h1>
            <p className={`text-[10px] tracking-wider ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
              PALM OIL REFINERY &amp; FRACTIONATION
            </p>
          </div>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md relative">
          {/* Progress Steps */}
          {step !== 'success' && (
            <div className="flex items-center justify-center gap-2 mb-6 animate-fade-in-up">
              {steps.map((s, i) => {
                const currentIdx = steps.indexOf(step);
                const isDone = i < currentIdx;
                const isActive = step === s;
                return (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300 theme-transition ${
                      isDone
                        ? 'bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30'
                        : isActive
                        ? 'bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-400/30'
                        : `theme-transition ${isDark ? 'bg-white/10 text-white/40' : 'bg-slate-200 text-slate-400'}`
                    }`}>
                      {isDone ? <CheckCircle2 size={16} /> : i + 1}
                    </div>
                    {i < 2 && (
                      <div className={`w-8 h-0.5 rounded-full transition-all duration-500 ${
                        isDone ? 'bg-gradient-to-r from-emerald-500 to-green-500' : isDark ? 'bg-white/10' : 'bg-slate-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {step === 'success' ? (
            /* Success Card */
            <div className={`relative backdrop-blur-2xl rounded-3xl shadow-[0_8px_60px_-12px_rgba(0,0,0,0.3)] p-8 animate-scale-in text-center theme-transition ${isDark
              ? 'bg-white/10 border border-white/20'
              : 'bg-white/80 border border-white/60'
            }`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                <CheckCircle2 size={32} className={isDark ? 'text-emerald-400' : 'text-emerald-600'} />
              </div>
              <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Password Berhasil Direset
              </h2>
              <p className={`text-sm mb-6 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                Silakan login dengan password baru Anda
              </p>
              <button
                onClick={() => router.push('/login')}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-blue-500 to-violet-500 hover:from-blue-500 hover:via-blue-400 hover:to-violet-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.97]"
              >
                Kembali ke Login
              </button>
            </div>
          ) : (
            /* Card */
            <div className={`relative backdrop-blur-2xl rounded-3xl shadow-[0_8px_60px_-12px_rgba(0,0,0,0.3)] p-7 sm:p-8 animate-fade-in-up theme-transition ${isDark
              ? 'bg-white/10 border border-white/20'
              : 'bg-white/80 border border-white/60 shadow-blue-500/5'
            }`}>
              {/* Card top gradient accent */}
              <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

              <div className="text-center mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-blue-500/15' : 'bg-blue-50'}`}>
                  {step === 'email' && <Mail size={24} className={isDark ? 'text-blue-400' : 'text-blue-600'} />}
                  {step === 'otp' && <ShieldCheck size={24} className={isDark ? 'text-blue-400' : 'text-blue-600'} />}
                  {step === 'password' && <KeyRound size={24} className={isDark ? 'text-blue-400' : 'text-blue-600'} />}
                </div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {step === 'email' && 'Lupa Password'}
                  {step === 'otp' && 'Verifikasi Kode OTP'}
                  {step === 'password' && 'Buat Password Baru'}
                </h2>
                <p className={`text-sm mt-1 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                  {step === 'email' && 'Masukkan email terdaftar untuk menerima kode OTP'}
                  {step === 'otp' && `Masukkan kode 6 digit yang dikirim ke ${email}`}
                  {step === 'password' && 'Buat password baru untuk akun Anda'}
                </p>
              </div>

              {errorDetail && (
                <div className={`mb-4 p-3 rounded-xl animate-shake flex items-start gap-2 ${isDark ? 'bg-red-500/15 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
                  <AlertCircle size={16} className={`mt-0.5 shrink-0 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                  <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-600'}`}>{errorDetail}</p>
                </div>
              )}

              {/* Step 1: Email */}
              {step === 'email' && (
                <form onSubmit={emailForm.handleSubmit(handleSendOtp)} className="space-y-5">
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                      Email
                    </label>
                    <div className="relative group">
                      <div className={`absolute -inset-0.5 bg-gradient-to-r rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 ${isDark ? 'from-blue-500/30 to-violet-500/30' : 'from-blue-400/40 to-violet-400/40'}`} />
                      <div className="relative flex items-center">
                        <Mail size={16} className={`absolute left-3.5 pointer-events-none transition-colors ${isDark ? 'text-white/40 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
                        <input
                          type="email"
                          {...emailForm.register('email')}
                          className={`w-full pl-10 pr-4 py-3 backdrop-blur-md border rounded-xl transition-all duration-300 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 ${isDark
                            ? 'bg-white/5 border-white/20 text-white focus:bg-white/10'
                            : 'bg-white/70 border-slate-200 text-slate-800 focus:bg-white'
                          }`}
                          placeholder="admin@inl.co.id"
                          disabled={loading}
                        />
                      </div>
                    </div>
                    {emailForm.formState.errors.email && (
                      <p className={`text-sm mt-1 ${isDark ? 'text-red-400' : 'text-red-500'}`}>{emailForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-blue-500 to-violet-500 hover:from-blue-500 hover:via-blue-400 hover:to-violet-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.97] group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.15)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
                    {loading ? (
                      <span className="relative flex items-center gap-3">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Mengirim...
                      </span>
                    ) : (
                      <span className="relative flex items-center gap-2">
                        Kirim Kode OTP
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </button>
                </form>
              )}

              {/* Step 2: OTP */}
              {step === 'otp' && (
                <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-5">
                  {receivedOtp && (
                    <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                      <p className={`font-semibold mb-1 text-[11px] uppercase tracking-wider ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                        [Development Mode]
                      </p>
                      <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                        Kode OTP Anda: <code className={`font-mono font-bold text-base select-all px-2 py-0.5 rounded ${isDark ? 'bg-blue-500/30 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>{receivedOtp}</code>
                      </p>
                    </div>
                  )}
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 text-center ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                      Kode OTP
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      {...otpForm.register('otp')}
                      className={`w-full text-center text-2xl tracking-[0.5em] font-mono py-3 backdrop-blur-md border rounded-xl transition-all duration-300 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 ${isDark
                        ? 'bg-white/5 border-white/20 text-white focus:bg-white/10'
                        : 'bg-white/70 border-slate-200 text-slate-800 focus:bg-white'
                      }`}
                      placeholder="000000"
                      disabled={loading}
                      autoComplete="one-time-code"
                    />
                    {otpForm.formState.errors.otp && (
                      <p className={`text-sm mt-1 text-center ${isDark ? 'text-red-400' : 'text-red-500'}`}>{otpForm.formState.errors.otp.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-blue-500 to-violet-500 hover:from-blue-500 hover:via-blue-400 hover:to-violet-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.97] group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.15)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
                    {loading ? (
                      <span className="relative flex items-center gap-3">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Memverifikasi...
                      </span>
                    ) : (
                      <span className="relative">Verifikasi</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStep('email'); setErrorDetail(null); }}
                    className={`w-full text-sm transition-colors ${isDark ? 'text-white/50 hover:text-blue-400' : 'text-slate-500 hover:text-blue-600'}`}
                  >
                    Ganti email
                  </button>
                </form>
              )}

              {/* Step 3: New Password */}
              {step === 'password' && (
                <form onSubmit={passwordForm.handleSubmit(handleResetPassword)} className="space-y-5">
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                      Password Baru
                    </label>
                    <div className="relative group">
                      <div className={`absolute -inset-0.5 bg-gradient-to-r rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 ${isDark ? 'from-blue-500/30 to-violet-500/30' : 'from-blue-400/40 to-violet-400/40'}`} />
                      <div className="relative flex items-center">
                        <Lock size={16} className={`absolute left-3.5 pointer-events-none transition-colors ${isDark ? 'text-white/40 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
                        <input
                          type="password"
                          {...passwordForm.register('password')}
                          className={`w-full pl-10 pr-4 py-3 backdrop-blur-md border rounded-xl transition-all duration-300 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 ${isDark
                            ? 'bg-white/5 border-white/20 text-white focus:bg-white/10'
                            : 'bg-white/70 border-slate-200 text-slate-800 focus:bg-white'
                          }`}
                          placeholder="Minimal 8 karakter"
                          disabled={loading}
                        />
                      </div>
                    </div>
                    {passwordForm.formState.errors.password && (
                      <p className={`text-sm mt-1 ${isDark ? 'text-red-400' : 'text-red-500'}`}>{passwordForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                      Konfirmasi Password Baru
                    </label>
                    <div className="relative group">
                      <div className={`absolute -inset-0.5 bg-gradient-to-r rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 ${isDark ? 'from-blue-500/30 to-violet-500/30' : 'from-blue-400/40 to-violet-400/40'}`} />
                      <div className="relative flex items-center">
                        <Lock size={16} className={`absolute left-3.5 pointer-events-none transition-colors ${isDark ? 'text-white/40 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
                        <input
                          type="password"
                          {...passwordForm.register('password_confirmation')}
                          className={`w-full pl-10 pr-4 py-3 backdrop-blur-md border rounded-xl transition-all duration-300 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 ${isDark
                            ? 'bg-white/5 border-white/20 text-white focus:bg-white/10'
                            : 'bg-white/70 border-slate-200 text-slate-800 focus:bg-white'
                          }`}
                          placeholder="Ulangi password baru"
                          disabled={loading}
                        />
                      </div>
                    </div>
                    {passwordForm.formState.errors.password_confirmation && (
                      <p className={`text-sm mt-1 ${isDark ? 'text-red-400' : 'text-red-500'}`}>{passwordForm.formState.errors.password_confirmation.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-blue-500 to-violet-500 hover:from-blue-500 hover:via-blue-400 hover:to-violet-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.97] group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.15)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
                    {loading ? (
                      <span className="relative flex items-center gap-3">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Menyimpan...
                      </span>
                    ) : (
                      <span className="relative">Reset Password</span>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className={`text-sm transition-colors flex items-center justify-center gap-1 ${isDark ? 'text-white/50 hover:text-blue-400' : 'text-slate-500 hover:text-blue-600'}`}
                >
                  <ArrowLeft size={16} />
                  Kembali ke Login
                </Link>
              </div>

              <div className={`mt-6 pt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                <p className={`text-xs text-center ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                  &copy; {new Date().getFullYear()} PT. Industri Nabati Lestari
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
