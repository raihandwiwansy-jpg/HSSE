'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { getDashboardRoleData } from '@/lib/api/dashboard';
import {
  Shield, AlertTriangle, FileText, Flame, Lock, CheckCircle2,
  Users, Activity, Eye, ClipboardCheck, BarChart3, ChevronRight,
  TrendingUp, Award, Clock, ArrowRight, Zap, Trophy, ShieldAlert,
  Calendar, CheckSquare, Plus, ArrowUpRight, HelpCircle, RefreshCw,
  Play, BookOpen, X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar
} from 'recharts';
import Button from '@/components/ui/Button';
import WifiLoader from '@/components/ui/WifiLoader';

const ROLE_LABEL: Record<string, string> = {
  admin: 'HSE Pemberi Izin',
  user: 'Pemohon Izin / Karyawan',
  supervisor: 'Pemilik Lokasi / Supervisor',
};

const ROLE_COLOR: Record<string, string> = {
  admin: 'bg-blue-100/90 text-blue-900 dark:bg-blue-950/80 dark:text-blue-200',
  user: 'bg-emerald-100/90 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200',
  supervisor: 'bg-amber-100/90 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200',
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const role = user?.role || 'user';
  const [isMounted, setIsMounted] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const carouselTimer = useRef<NodeJS.Timeout | null>(null);

  const photos = [
    '/FT/foto1.jpeg',
    '/FT/foto2.jpeg',
    '/FT/foto3.jpeg',
    '/FT/foto4.jpeg',
    '/FT/foto5.jpeg',
    '/FT/foto6.jpeg',
    '/FT/foto7.jpeg',
  ];

  useEffect(() => {
    setIsMounted(true);
    startCarousel();
    return () => stopCarousel();
  }, []);

  const startCarousel = () => {
    stopCarousel();
    carouselTimer.current = setInterval(() => {
      setActivePhoto((prev) => (prev + 1) % photos.length);
    }, 4500);
  };

  const stopCarousel = () => {
    if (carouselTimer.current) {
      clearInterval(carouselTimer.current);
    }
  };

  const { data: roleDataRes, refetch: refetchRoleData, isFetching } = useQuery({
    queryKey: ['dashboard-role-data'],
    queryFn: async () => {
      const res = await getDashboardRoleData();
      return res.data.data;
    },
    refetchInterval: 10000,
    staleTime: 5000,
  });

  const handleRefresh = () => {
    refetchRoleData();
  };

  const rd = roleDataRes;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up pb-10">
      
      {/* ==================== 1. BRANDING HEADER BANNER WITH ROTATING BACKGROUND ==================== */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-900/30 p-6 sm:p-8 text-white shadow-2xl min-h-[300px] sm:min-h-[350px] flex flex-col justify-between transition-all duration-500">
        
        {/* Slideshow background layer */}
        <div className="absolute inset-0 z-0">
          {photos.map((src, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out ${
                activePhoto === idx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
              }`}
            >
              <img
                src={src}
                alt={`Dokumentasi HSSE ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {/* Multi-layered dark gradients for perfect text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50 dark:from-black/85 dark:via-black/60 dark:to-black/85 z-20 pointer-events-none transition-colors duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 dark:from-black/85 dark:via-transparent dark:to-black/30 z-20 pointer-events-none transition-colors duration-500" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent z-20 pointer-events-none" />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-30 flex flex-col justify-between h-full w-full gap-8">
          
          {/* Header Badges */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 flex items-center justify-center p-0.5 shrink-0 overflow-hidden">
                <img src="/Picture1.png" alt="Logo INL" className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-200">
                  PT INDUSTRI NABATI LESTARI
                </h2>
                <p className="text-[10px] sm:text-xs text-gray-300 font-semibold tracking-wider">SMART SOLUTION FOR HSSE</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={isFetching}
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 active:scale-95 transition-all border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white shadow-lg backdrop-blur-sm"
              >
                <RefreshCw size={14} className={`${isFetching ? 'animate-spin' : ''}`} />
                <span>{isFetching ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              
              <div className="flex items-center gap-2 bg-black/45 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-blue-200 backdrop-blur-sm">
                <Award size={14} className="text-yellow-400" />
                <span>OPENSIGNAL AWARD</span>
              </div>
              <div className="flex items-center gap-2 bg-black/45 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-cyan-200 backdrop-blur-sm">
                <Trophy size={14} className="text-yellow-400" />
                <span>The Most Reliable for HSSE</span>
              </div>
            </div>
          </div>

          {/* Dashboard Title & Description */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                HSSE DASHBOARD
              </h1>
              <p className="text-sm sm:text-base text-gray-200 mt-2 font-medium tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                Real-Time Monitoring Keamanan & Jam Kerja Selamat (Safe Man Hours)
              </p>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-1.5">
              <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${ROLE_COLOR[role]} border border-current/10 shadow-sm`}>
                Role: {ROLE_LABEL[role]}
              </span>
              <p className="text-xs text-gray-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                Logged in: <span className="font-semibold text-white">{user?.name || 'Administrator'}</span>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ==================== 2. VALUE PROPOSITION CARDS (4 COLUMNS) ==================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { title: 'HEMAT WAKTU', desc: 'Semua data tersedia instan', icon: <Clock className="text-blue-500" />, bg: 'from-blue-500/10 to-transparent border-blue-500/20' },
          { title: 'AKURAT', desc: 'Mengurangi risiko human error', icon: <CheckCircle2 className="text-emerald-500" />, bg: 'from-emerald-500/10 to-transparent border-emerald-500/20' },
          { title: 'TERPANTAU', desc: 'Monitoring real-time & integrasi', icon: <Eye className="text-amber-500" />, bg: 'from-amber-500/10 to-transparent border-amber-500/20' },
          { title: 'SIAP AUDIT', desc: 'Laporan rapi siap kapan saja', icon: <ShieldAlert className="text-purple-500" />, bg: 'from-purple-500/10 to-transparent border-purple-500/20' }
        ].map((item, idx) => (
          <div key={idx} className={`bg-gradient-to-b ${item.bg} border rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}>
            <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800/80 flex items-center justify-center shadow-md mb-2">
              {item.icon}
            </div>
            <h4 className="text-xs sm:text-sm font-black text-gray-800 dark:text-white tracking-wider">{item.title}</h4>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 leading-snug">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* ==================== 3. ROLE-BASED DASHBOARD WIDGETS ==================== */}
      {isFetching && !rd ? (
        <div className="flex justify-center items-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800">
          <WifiLoader text="Memuat statistik dashboard..." />
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">TOTAL MANPOWER</span>
                <Users size={16} className="text-blue-500" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white">
                {role === 'admin' ? (rd?.stats?.total_manpower ?? 0) : '-'}
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Karyawan Terdaftar</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">SAFE MAN HOURS</span>
                <Clock size={16} className="text-emerald-500" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {(role === 'admin' || role === 'user') ? (rd?.stats?.safe_man_hours ?? 0).toLocaleString() : '-'}
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Jam Kerja Selamat</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">TOTAL INCIDENT</span>
                <AlertTriangle size={16} className="text-red-500" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-red-650 dark:text-red-400">
                {(role === 'admin' || role === 'user') ? (rd?.stats?.total_incident ?? 0) : '-'}
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Laporan Masuk</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">NEAR MISS</span>
                <ShieldAlert size={16} className="text-amber-500" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
                {(role === 'admin' || role === 'user') ? (rd?.stats?.near_miss ?? 0) : '-'}
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Kejadian Hampir Celaka</p>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap size={16} className="text-indigo-500" /> {role === 'admin' ? 'HSE Quick Actions' : role === 'supervisor' ? 'Supervisor Quick Actions' : 'Karyawan Quick Actions'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {role === 'admin' && (
                <>
                  <Link href="/man-hours/create" className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 transition-all group">
                    <div>
                      <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200">Buat Tugas Kerja</h4>
                      <p className="text-[10px] text-indigo-500 dark:text-indigo-400 mt-1">Beri tugas ke karyawan</p>
                    </div>
                    <Plus size={18} className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/permit" className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 transition-all group">
                    <div>
                      <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Verifikasi Izin Kerja</h4>
                      <p className="text-[10px] text-emerald-500 dark:text-emerald-400 mt-1">Review draft & submitted permit</p>
                    </div>
                    <FileText size={18} className="text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/insiden" className="flex items-center justify-between p-4 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 border border-red-100 dark:border-red-900/50 transition-all group">
                    <div>
                      <h4 className="text-xs font-bold text-red-900 dark:text-red-200">Investigasi Insiden</h4>
                      <p className="text-[10px] text-red-500 dark:text-red-400 mt-1">Update status & ekspor PDF resmi</p>
                    </div>
                    <ShieldAlert size={18} className="text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </>
              )}
              {role === 'user' && (
                <>
                  <Link href="/man-hours" className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 transition-all group">
                    <div>
                      <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200">Mulai Kerja & Safe Hours</h4>
                      <p className="text-[10px] text-indigo-500 dark:text-indigo-400 mt-1">Lihat dan update tugas aktif Anda</p>
                    </div>
                    <Play size={18} className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/insiden/create" className="flex items-center justify-between p-4 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 border border-red-100 dark:border-red-900/50 transition-all group">
                    <div>
                      <h4 className="text-xs font-bold text-red-900 dark:text-red-200">Laporkan Insiden Baru</h4>
                      <p className="text-[10px] text-red-500 dark:text-red-400 mt-1">Kecelakaan, near miss, unsafe condition</p>
                    </div>
                    <Plus size={18} className="text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/permit" className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 transition-all group">
                    <div>
                      <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Ajukan Izin Kerja (PTW)</h4>
                      <p className="text-[10px] text-emerald-500 dark:text-emerald-400 mt-1">Buat permit GWP, HWP, atau CSE baru</p>
                    </div>
                    <FileText size={18} className="text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </>
              )}
              {role === 'supervisor' && (
                <>
                  <Link href="/permit" className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50 transition-all group col-span-1">
                    <div>
                      <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">Verifikasi & Approve Permit</h4>
                      <p className="text-[10px] text-amber-500 dark:text-amber-400 mt-1">Approve pengajuan izin kerja area Anda</p>
                    </div>
                    <FileText size={18} className="text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/profil" className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 transition-all group col-span-1 sm:col-span-2">
                    <div>
                      <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200">Profil & Sistem Akun</h4>
                      <p className="text-[10px] text-indigo-500 dark:text-indigo-400 mt-1">Lihat detail akun dan log lokasi kerja</p>
                    </div>
                    <Users size={18} className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Incident Summary */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>INCIDENT SUMMARY BY TYPE</span>
                <AlertTriangle size={14} className="text-red-500" />
              </h3>
              <div className="h-60 flex items-center justify-center">
                {isMounted && rd?.charts?.incident_summary?.length > 0 && rd.charts.incident_summary.some((c: any) => c.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={rd.charts.incident_summary}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {rd.charts.incident_summary.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} Kasus`, 'Jumlah']} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-gray-450 text-xs">Belum ada data insiden untuk divisualisasikan</div>
                )}
              </div>
            </div>

            {/* PTW Status */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>PERMIT TO WORK STATUS</span>
                <FileText size={14} className="text-blue-500" />
              </h3>
              <div className="h-60 flex items-center justify-center">
                {isMounted && rd?.charts?.ptw_status?.length > 0 && rd.charts.ptw_status.some((c: any) => c.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={rd.charts.ptw_status}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {rd.charts.ptw_status.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} Permit`, 'Jumlah']} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-gray-450 text-xs">Belum ada data permit aktif</div>
                )}
              </div>
            </div>

            {/* Safety Inspection Trends */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>SAFETY INSPECTION PATROL TRENDS</span>
                <Eye size={14} className="text-indigo-500" />
              </h3>
              <div className="h-60">
                {isMounted && rd?.charts?.safety_inspection_trends?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rd.charts.safety_inspection_trends} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} />
                      <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                      <Tooltip />
                      <Legend verticalAlign="top" height={36} />
                      <Bar dataKey="inspeksi" name="Inspeksi Safety Patrol" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-gray-450 text-xs flex items-center justify-center h-full">Belum ada data trend inspeksi</div>
                )}
              </div>
            </div>

            {/* Training & Behavior Compliance */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>TRAINING & BEHAVIOR OBSERVATIONS</span>
                <ClipboardCheck size={14} className="text-emerald-500" />
              </h3>
              <div className="h-60">
                {isMounted && rd?.charts?.training_safety_behavior?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={rd.charts.training_safety_behavior} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} />
                      <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                      <Tooltip />
                      <Legend verticalAlign="top" height={36} />
                      <Line type="monotone" dataKey="safety_behavior" name="Observasi Perilaku" stroke="#f59e0b" strokeWidth={3} activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="training" name="Pelatihan Karyawan" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-gray-450 text-xs flex items-center justify-center h-full">Belum ada data behavior/pelatihan</div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================== 4. HSSE SYSTEM FEATURES DETAILS ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {(() => {
          const ALL_FEATURES = [
            { label: 'INSPECTION', desc: 'tracking temuan & detail safety patrol', color: 'border-blue-500/20 text-blue-500', roles: ['admin', 'user'] },
            { label: 'INCIDENT', desc: 'RCA & tindakan korektif insiden', color: 'border-red-500/20 text-red-500', roles: ['admin', 'user'] },
            { label: 'PTW', desc: 'manajemen izin kerja real-time', color: 'border-amber-500/20 text-amber-500', roles: ['admin', 'user', 'supervisor'] },
            { label: 'TRAINING', desc: 'pelatihan & sertifikat kompetensi', color: 'border-emerald-500/20 text-emerald-500', roles: ['admin', 'user'] },
            { label: 'DOCUMENT', desc: 'penyimpanan dokumen terstruktur', color: 'border-purple-500/20 text-purple-500', roles: ['admin'] },
            { label: 'KPI REPORT', desc: 'grafik otomatis laporan siap pakai', color: 'border-cyan-500/20 text-cyan-500', roles: ['admin'] }
          ];

          const filteredFeatures = ALL_FEATURES.filter(f => f.roles.includes(role));

          return filteredFeatures.map((feat, idx) => (
            <div key={idx} className="bg-white dark:bg-[#11111E] border border-gray-250 dark:border-gray-800/80 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all duration-300">
              <div>
                <span className={`text-[10px] font-black tracking-wider uppercase ${feat.color}`}>{feat.label}</span>
                <p className="text-xs text-gray-650 dark:text-gray-400 font-medium mt-1 leading-snug">{feat.desc}</p>
              </div>
            </div>
          ));
        })()}
      </div>

    </div>
  );
}
