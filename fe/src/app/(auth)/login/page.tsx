'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { login, isAuthenticated } from '@/lib/api/auth';
import { ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';

const schema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setErrorDetail(null);

    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        document.cookie = `token=${result.data.token}; path=/; max-age=86400; SameSite=Lax`;
        toast.success('Selamat datang!');
        setTimeout(() => router.push('/dashboard'), 500);
      } else {
        toast.error(result.message || 'Login gagal');
        setErrorDetail(result.message || 'Login gagal');
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Terjadi kesalahan saat login';
      toast.error(errorMsg);
      setErrorDetail(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 theme-transition ${isDark
      ? 'bg-[#0B0F19]'
      : 'bg-[#F8F9FA]'
      }`}>
      
      {/* Background subtle grid pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
        <div className={`absolute inset-0 ${isDark ? 'opacity-[0.03]' : 'opacity-[0.05]'}`} style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>

      <div className="w-full max-w-lg z-10">
        {/* Login Card */}
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
              PT. Industri Nabati Lestari HSSE
            </h2>
            <p className={`text-xs sm:text-sm mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Masuk ke dashboard manajemen HSSE
            </p>
          </div>

          <div className={`border-b my-6 ${isDark ? 'border-slate-800/80' : 'border-slate-100'}`} />

          {errorDetail && (
            <div className={`mb-5 p-3.5 rounded-xl text-center text-xs font-semibold ${isDark ? 'bg-red-950/30 border border-red-900/40 text-red-400' : 'bg-red-50 border border-red-100 text-red-600'}`}>
              {errorDetail}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className={`block text-xs sm:text-sm font-semibold ${isDark ? 'text-slate-350' : 'text-slate-700'}`}>
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className={`w-full px-4 py-3 border rounded-xl text-sm transition-all placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 ${isDark
                  ? 'bg-slate-800/40 border-slate-700 text-white focus:bg-slate-850'
                  : 'bg-slate-50/50 border-slate-200 text-slate-800 focus:bg-white'
                  }`}
                placeholder="admin@inl.co.id"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 pl-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className={`block text-xs sm:text-sm font-semibold ${isDark ? 'text-slate-350' : 'text-slate-700'}`}>
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`w-full pl-4 pr-10 py-3 border rounded-xl text-sm transition-all placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 ${isDark
                    ? 'bg-slate-800/40 border-slate-700 text-white focus:bg-slate-850'
                    : 'bg-slate-50/50 border-slate-200 text-slate-800 focus:bg-white'
                    }`}
                  placeholder="Masukkan password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-250 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1 pl-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className={`w-4 h-4 rounded ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-300 bg-white'} text-blue-500 focus:ring-blue-500/50`} />
                <span className={`text-xs transition-colors ${isDark ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-500 group-hover:text-slate-700'}`}>Ingat saya</span>
              </label>
              <Link
                href="/forgot-password"
                className={`text-xs font-semibold transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                Lupa password?
              </Link>
            </div>

            {/* Animated Masuk Button */}
            <button
              type="submit"
              disabled={loading}
              className={`relative w-full py-3.5 bg-[#111111] dark:bg-[#1f2937] text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98] group overflow-hidden border border-transparent hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10`}
            >
              {/* Premium shifting gradient border effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {loading ? (
                <span className="relative flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </span>
              ) : (
                <>
                  <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes borderFlow {
                      0% { background-position: 0% 50%; }
                      50% { background-position: 100% 50%; }
                      100% { background-position: 0% 50%; }
                    }
                    .text-gradient-animated {
                      background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6);
                      background-size: 300% auto;
                      color: transparent;
                      -webkit-background-clip: text;
                      background-clip: text;
                      animation: borderFlow 3s ease infinite;
                    }
                  `}} />
                  <span className="relative flex items-center gap-2">
                    <span className="text-white group-hover:text-gradient-animated font-bold text-sm sm:text-base tracking-widest transition-colors duration-300">MASUK</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform text-white group-hover:text-blue-400 duration-300" />
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Back link */}
          <div className="text-center mt-6">
            <Link href="/" className={`text-xs font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-650'}`}>
              Kembali ke Beranda
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
