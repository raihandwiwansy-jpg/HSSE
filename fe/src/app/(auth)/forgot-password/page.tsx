'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { forgotPassword, verifyOtp, resetPassword } from '@/lib/api/auth';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
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
    <div className={`min-h-screen lg:h-screen lg:overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8 theme-transition ${isDark
      ? 'bg-[#0B0F19]'
      : 'bg-[#F8F9FA]'
      }`}>


      {/* Background subtle grid pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
        <div className={`absolute inset-0 ${isDark ? 'opacity-[0.03]' : 'opacity-[0.05]'}`} style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>

      <div className="w-full max-w-lg z-10">
        {/* Card */}
        <div className={`rounded-2xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border theme-transition ${isDark
          ? 'bg-[#111827] border-slate-800/80 shadow-[#000000]/60'
          : 'bg-white border-slate-100'
          }`}>

          {/* INL Logo & Branding */}
          <div className="text-center">
            <div className="relative mx-auto mb-5 w-40 sm:w-48 h-12">
              <Image
                src="/Picture1.png"
                alt="PT Industri Nabati Lestari Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h2 className={`text-lg sm:text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
              PT. Industri Nabati Lestari
            </h2>
            <p className={`text-xs sm:text-sm mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Lupa password akun HSSE Anda
            </p>
          </div>

          <div className={`border-b my-6 ${isDark ? 'border-slate-800/80' : 'border-slate-100'}`} />

          {/* Progress Steps */}
          {step !== 'success' && (
            <div className="flex items-center justify-center gap-2 mb-6">
              {steps.map((s, i) => {
                const currentIdx = steps.indexOf(step);
                const isDone = i < currentIdx;
                const isActive = step === s;
                return (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isDone
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : isActive
                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/20'
                        : `${isDark ? 'bg-slate-800 text-slate-500 border border-slate-700' : 'bg-slate-100 text-slate-400 border border-slate-200'}`
                    }`}>
                      {isDone ? <CheckCircle2 size={16} /> : i + 1}
                    </div>
                    {i < 2 && (
                      <div className={`w-8 h-0.5 rounded-full transition-all duration-300 ${
                        isDone ? 'bg-emerald-500' : isDark ? 'bg-slate-850' : 'bg-slate-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {errorDetail && (
            <div className={`mb-5 p-3.5 rounded-xl text-center text-xs font-semibold ${isDark ? 'bg-red-950/30 border border-red-900/40 text-red-450' : 'bg-red-50 border border-red-100 text-red-605'}`}>
              {errorDetail}
            </div>
          )}

          {step === 'success' ? (
            /* Success Card Content */
            <div className="text-center space-y-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Password Berhasil Direset
                </h3>
                <p className={`text-xs mt-1.5 ${isDark ? 'text-slate-450' : 'text-slate-505'}`}>
                  Silakan login kembali dengan password baru Anda.
                </p>
              </div>
              <button
                onClick={() => router.push('/login')}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-550 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10 active:scale-[0.98] mt-4"
              >
                Kembali ke Login
              </button>
            </div>
          ) : (
            <>
              {/* Step 1: Email */}
              {step === 'email' && (
                <form onSubmit={emailForm.handleSubmit(handleSendOtp)} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className={`block text-xs sm:text-sm font-semibold ${isDark ? 'text-slate-350' : 'text-slate-705'}`}>
                      Email Akun
                    </label>
                    <div className="relative flex items-center">
                      <Mail size={16} className="absolute left-3.5 text-slate-450 pointer-events-none" />
                      <input
                        type="email"
                        {...emailForm.register('email')}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-all placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 ${isDark
                          ? 'bg-slate-800/40 border-slate-700 text-white focus:bg-slate-850'
                          : 'bg-slate-50/50 border-slate-200 text-slate-800 focus:bg-white'
                        }`}
                        placeholder="admin@inl.co.id"
                        disabled={loading}
                      />
                    </div>
                    {emailForm.formState.errors.email && (
                      <p className="text-xs text-red-500 mt-1 pl-1">{emailForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-505 hover:to-indigo-550 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        Kirim Kode OTP
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Step 2: OTP */}
              {step === 'otp' && (
                <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-5">
                  {receivedOtp && (
                    <div className={`p-3.5 rounded-xl border text-center ${isDark ? 'bg-blue-950/20 border-blue-900/40 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-800'}`}>
                      <p className="font-bold text-[10px] uppercase tracking-wider mb-1">
                        [Development Mode OTP]
                      </p>
                      <p className="text-xs">
                        Kode OTP: <code className="font-mono font-bold text-sm bg-blue-500/10 px-2 py-0.5 rounded">{receivedOtp}</code>
                      </p>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className={`block text-xs sm:text-sm font-semibold text-center ${isDark ? 'text-slate-350' : 'text-slate-705'}`}>
                      Masukkan 6 Digit OTP
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      {...otpForm.register('otp')}
                      className={`w-full text-center text-xl tracking-[0.25em] font-mono py-3 border rounded-xl transition-all placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 ${isDark
                        ? 'bg-slate-800/40 border-slate-700 text-white focus:bg-slate-850'
                        : 'bg-slate-50/50 border-slate-200 text-slate-800 focus:bg-white'
                      }`}
                      placeholder="000000"
                      disabled={loading}
                      autoComplete="one-time-code"
                    />
                    {otpForm.formState.errors.otp && (
                      <p className="text-xs text-red-500 mt-1 text-center">{otpForm.formState.errors.otp.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-505 hover:to-indigo-550 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Memverifikasi...
                      </>
                    ) : (
                      'Verifikasi Kode'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStep('email'); setErrorDetail(null); }}
                    className={`w-full text-xs font-semibold text-center transition-colors ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Ganti email
                  </button>
                </form>
              )}

              {/* Step 3: New Password */}
              {step === 'password' && (
                <form onSubmit={passwordForm.handleSubmit(handleResetPassword)} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className={`block text-xs sm:text-sm font-semibold ${isDark ? 'text-slate-355' : 'text-slate-700'}`}>
                      Password Baru
                    </label>
                    <div className="relative flex items-center">
                      <Lock size={16} className="absolute left-3.5 text-slate-450 pointer-events-none" />
                      <input
                        type="password"
                        {...passwordForm.register('password')}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-all placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 ${isDark
                          ? 'bg-slate-800/40 border-slate-700 text-white focus:bg-slate-850'
                          : 'bg-slate-50/50 border-slate-200 text-slate-800 focus:bg-white'
                        }`}
                        placeholder="Minimal 8 karakter"
                        disabled={loading}
                      />
                    </div>
                    {passwordForm.formState.errors.password && (
                      <p className="text-xs text-red-500 mt-1 pl-1">{passwordForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className={`block text-xs sm:text-sm font-semibold ${isDark ? 'text-slate-355' : 'text-slate-700'}`}>
                      Konfirmasi Password Baru
                    </label>
                    <div className="relative flex items-center">
                      <Lock size={16} className="absolute left-3.5 text-slate-450 pointer-events-none" />
                      <input
                        type="password"
                        {...passwordForm.register('password_confirmation')}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-all placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 ${isDark
                          ? 'bg-slate-800/40 border-slate-700 text-white focus:bg-slate-850'
                          : 'bg-slate-50/50 border-slate-200 text-slate-800 focus:bg-white'
                        }`}
                        placeholder="Ulangi password baru"
                        disabled={loading}
                      />
                    </div>
                    {passwordForm.formState.errors.password_confirmation && (
                      <p className="text-xs text-red-500 mt-1 pl-1">{passwordForm.formState.errors.password_confirmation.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-550 hover:to-indigo-550 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </form>
              )}

              <div className="mt-6 text-center border-t border-gray-100 dark:border-slate-800/80 pt-4 flex items-center justify-center">
                <Link
                  href="/login"
                  className={`text-xs font-semibold transition-colors flex items-center gap-1 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  <ArrowLeft size={14} />
                  Kembali ke Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
