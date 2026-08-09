'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { getDashboardRoleData } from '@/lib/api/dashboard';
import { getHseKpiData } from '@/lib/api/hseKpi';
import {
  Shield, AlertTriangle, FileText, Flame, Lock, CheckCircle2,
  Users, Activity, Eye, ClipboardCheck, BarChart3, ChevronRight,
  TrendingUp, Award, Clock, ArrowRight, Zap, Trophy, ShieldAlert,
  Calendar, CheckSquare, Plus, ArrowUpRight, HelpCircle, RefreshCw,
  Play, BookOpen, X, Target
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
  const [kpiYear, setKpiYear] = useState(new Date().getFullYear());
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

  const { data: roleDataRes, refetch: refetchRoleData, isFetching: isRoleFetching } = useQuery({
    queryKey: ['dashboard-role-data'],
    queryFn: async () => {
      const res = await getDashboardRoleData();
      return res.data.data;
    },
    refetchInterval: 10000,
    staleTime: 5000,
  });

  const { data: kpiRes, refetch: refetchKpi, isFetching: isKpiFetching } = useQuery({
    queryKey: ['dashboard-hse-kpi', kpiYear],
    queryFn: () => getHseKpiData(kpiYear),
    refetchInterval: 10000,
    staleTime: 5000,
  });

  const handleRefresh = () => {
    refetchRoleData();
    refetchKpi();
  };

  const isFetching = isRoleFetching || isKpiFetching;
  const rd = roleDataRes;
  const kpiData = kpiRes?.data;
  const yearCum = kpiData?.year_cumulative;
  const monthsKpi = kpiData?.months || [];

  const totalLeadingKpi = yearCum
    ? (yearCum.hse_toolbox_meeting || 0) +
      (yearCum.hse_joint_safety_patrol || 0) +
      (yearCum.behavior_based_safe || 0) +
      (yearCum.hse_training || 0) +
      (yearCum.hse_induction || 0) +
      (yearCum.general_safety_talk || 0) +
      (yearCum.hse_management_visit || 0) +
      (yearCum.emergency_drill || 0) +
      (yearCum.equipment_inspection || 0) +
      (yearCum.hse_meeting || 0)
    : 0;

  const totalLaggingIncidents = yearCum
    ? (yearCum.fatality || 0) + (yearCum.lti || 0) + (yearCum.rwdc || 0) + (yearCum.mtc || 0) + (yearCum.fac || 0)
    : 0;

  const kpiTrendChartData = monthsKpi.map((m: any) => ({
    month: m.month,
    toolbox: m.hse_toolbox_meeting || 0,
    patrol: m.hse_joint_safety_patrol || 0,
    bbs: m.behavior_based_safe || 0,
    training: (m.hse_training || 0) + (m.hse_induction || 0),
  }));

  const kpiComparisonData = [
    { name: 'Toolbox Meeting', value: yearCum?.hse_toolbox_meeting || 0, color: '#3b82f6' },
    { name: 'Behavior Safe (BBS)', value: yearCum?.behavior_based_safe || 0, color: '#10b981' },
    { name: 'Joint Patrol', value: yearCum?.hse_joint_safety_patrol || 0, color: '#8b5cf6' },
    { name: 'Training & Induksi', value: (yearCum?.hse_training || 0) + (yearCum?.hse_induction || 0), color: '#f59e0b' },
    { name: 'Inspeksi Alat', value: yearCum?.equipment_inspection || 0, color: '#06b6d4' },
    { name: 'Safety Talk & Mtg', value: (yearCum?.general_safety_talk || 0) + (yearCum?.hse_meeting || 0), color: '#ec4899' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up pb-10">
      
      {/* ==================== 1. BRANDING HEADER BANNER WITH ROTATING BACKGROUND ==================== */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-900/30 dark:border-white/5 text-white shadow-2xl dark:shadow-[0_10px_40px_rgba(0,0,0,0.8)] min-h-[340px] sm:min-h-[380px] flex flex-col justify-between transition-all duration-500 group">
        
        {/* Slideshow background layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
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
                className="w-full h-full object-cover transition-transform duration-[4500ms] ease-out group-hover:scale-110"
              />
            </div>
          ))}
          {/* Multi-layered dark gradients for perfect text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 dark:from-black/90 dark:via-black/75 dark:to-black/90 z-20 pointer-events-none transition-colors duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 dark:from-black/95 dark:via-transparent dark:to-black/40 z-20 pointer-events-none transition-colors duration-500" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent z-20 pointer-events-none" />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-30 flex flex-col justify-between h-full w-full gap-8 p-6 sm:p-8 flex-1">
          
          {/* Header Badges */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex flex-col items-start gap-2.5 shrink-0">
              <span className={`px-3 py-1.5 rounded-xl text-xs font-black tracking-wider ${ROLE_COLOR[role]} border border-current/10 shadow-lg backdrop-blur-md`}>
                ROLE: {ROLE_LABEL[role]}
              </span>
              <div className="backdrop-blur-md bg-black/35 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-gray-300 shadow-md">
                Karyawan: <span className="font-extrabold text-white dark:text-blue-100">{user?.name || 'Administrator'}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={isFetching}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 transition-all border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white dark:text-blue-50 shadow-lg backdrop-blur-md"
              >
                <RefreshCw size={14} className={`${isFetching ? 'animate-spin' : ''}`} />
                <span>{isFetching ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-blue-200 backdrop-blur-md hover:border-blue-500/30 transition-all">
                <Award size={14} className="text-yellow-400" />
                <span className="font-semibold">OPENSIGNAL AWARD</span>
              </div>
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-cyan-200 backdrop-blur-md hover:border-cyan-500/30 transition-all">
                <Trophy size={14} className="text-yellow-400" />
                <span className="font-semibold">The Most Reliable for MS-HSSE</span>
              </div>
            </div>
          </div>

          {/* Dashboard Title & Description with modern layout */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
            <div className="backdrop-blur-md bg-black/30 dark:bg-black/50 border border-white/10 rounded-2xl p-4 sm:p-5 max-w-2xl shadow-xl">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-50 to-blue-200 dark:from-blue-100 dark:via-indigo-100 dark:to-cyan-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                MS-HSSE DASHBOARD
              </h1>
              <p className="text-xs sm:text-sm text-gray-200 dark:text-gray-300 mt-3 font-semibold tracking-wide leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                Sistem monitoring terpusat untuk kesehatan, keselamatan, keamanan kerja, serta pencatatan Jam Kerja Selamat (Safe Man Hours) secara real-time.
              </p>
            </div>
            
            <div className="hidden"></div>
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
                {rd?.stats?.total_manpower ?? '-'}
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Karyawan Terdaftar</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">SAFE MAN HOURS</span>
                <Clock size={16} className="text-emerald-500" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {(rd?.stats?.safe_man_hours ?? 0).toLocaleString()}
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Jam Kerja Selamat</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">TOTAL INCIDENT</span>
                <AlertTriangle size={16} className="text-red-500" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-red-650 dark:text-red-400">
                {rd?.stats?.total_incident ?? '-'}
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Laporan Masuk</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">NEAR MISS</span>
                <ShieldAlert size={16} className="text-amber-500" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
                {rd?.stats?.near_miss ?? '-'}
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

          {/* ==================== 4. HSSE KPI PERFORMANCE REAL-TIME SECTION ==================== */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
            
            {/* Widget Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white">
                      HSSE KPI PERFORMANCE
                    </h3>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                      Live Data
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Monitoring indikator kinerja Leading & Lagging K3 real-time ({kpiYear})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-start sm:self-auto">
                <select
                  value={kpiYear}
                  onChange={(e) => setKpiYear(parseInt(e.target.value))}
                  className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>

                {role === 'admin' && (
                  <Link
                    href="/hse-kpi-performance"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
                  >
                    <span>Input & Kelola KPI</span>
                    <ArrowRight size={13} />
                  </Link>
                )}
              </div>
            </div>

            {/* KPI Summary 4 Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Zero Accident Status</span>
                  <Shield size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-lg sm:text-2xl font-black text-emerald-700 dark:text-emerald-300">
                  {totalLaggingIncidents === 0 ? '100% AMAN' : `${totalLaggingIncidents} Kejadian`}
                </div>
                <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mt-1">Fatality: {yearCum?.fatality || 0} • LTI: {yearCum?.lti || 0}</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Program Leading K3</span>
                  <TrendingUp size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-lg sm:text-2xl font-black text-blue-700 dark:text-blue-300">
                  {totalLeadingKpi.toLocaleString()}
                </div>
                <p className="text-[10px] text-blue-600/80 dark:text-blue-400/80 mt-1">Total Kegiatan Preventif</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">Behavior Safe (BBS)</span>
                  <Eye size={16} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-lg sm:text-2xl font-black text-purple-700 dark:text-purple-300">
                  {(yearCum?.behavior_based_safe || 0).toLocaleString()}
                </div>
                <p className="text-[10px] text-purple-600/80 dark:text-purple-400/80 mt-1">Observasi Perilaku Selamat</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Training & Induksi</span>
                  <Award size={16} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-lg sm:text-2xl font-black text-amber-700 dark:text-amber-300">
                  {((yearCum?.hse_training || 0) + (yearCum?.hse_induction || 0)).toLocaleString()}
                </div>
                <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80 mt-1">Peserta Edukasi Keselamatan</p>
              </div>
            </div>

            {/* Charts: 2 Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Chart A: Monthly Leading Indicators Trends */}
              <div className="lg:col-span-7 bg-gray-50/50 dark:bg-gray-800/40 rounded-2xl p-4 sm:p-5 border border-gray-150 dark:border-gray-800 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white">
                      Tren Bulanan Program Leading K3
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Toolbox Meeting, BBS, Patrol, dan Edukasi per bulan</p>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700">
                    Tahun {kpiYear}
                  </span>
                </div>

                <div className="h-64 sm:h-72 w-full">
                  {isMounted && monthsKpi.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={kpiTrendChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} />
                        <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                        <Tooltip />
                        <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                        <Bar dataKey="toolbox" name="Toolbox Mtg" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="bbs" name="Behavior Safe" fill="#10b981" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="patrol" name="Joint Patrol" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="training" name="Training/Induksi" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-gray-400">
                      Memuat grafik KPI...
                    </div>
                  )}
                </div>
              </div>

              {/* Chart B: Distribution & Cumulative Key Indicators */}
              <div className="lg:col-span-5 bg-gray-50/50 dark:bg-gray-800/40 rounded-2xl p-4 sm:p-5 border border-gray-150 dark:border-gray-800 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white">
                      Realisasi Program Terbanyak (YTD)
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Akumulasi kegiatan indikator K3 utama</p>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-md border border-emerald-200 dark:border-emerald-800/50">
                    YTD Total
                  </span>
                </div>

                <div className="h-64 sm:h-72 w-full">
                  {isMounted && kpiComparisonData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={kpiComparisonData}
                        layout="vertical"
                        margin={{ top: 10, right: 25, left: 15, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis type="number" stroke="#888888" fontSize={11} tickLine={false} />
                        <YAxis dataKey="name" type="category" stroke="#888888" fontSize={10} width={95} tickLine={false} />
                        <Tooltip formatter={(val) => [`${val} Kegiatan`, 'Realisasi YTD']} />
                        <Bar dataKey="value" name="Realisasi YTD" radius={[0, 4, 4, 0]}>
                          {kpiComparisonData.map((entry, index) => (
                            <Cell key={`cell-kpi-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-gray-400">
                      Memuat data akumulasi...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lagging Indicators Record Summary Bar */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Matriks Lagging Indicators (Target Kinerja 0 Insiden)
                </span>
                <span className="text-[10px] text-gray-400">Target vs Realisasi YTD</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
                {[
                  { key: 'Fatality', val: yearCum?.fatality || 0, target: 0 },
                  { key: 'LTI', val: yearCum?.lti || 0, target: 0 },
                  { key: 'RWDC', val: yearCum?.rwdc || 0, target: 0 },
                  { key: 'MTC', val: yearCum?.mtc || 0, target: 0 },
                  { key: 'FAC', val: yearCum?.fac || 0, target: 0 },
                  { key: 'Near Miss', val: yearCum?.near_miss || 0, target: 3 },
                  { key: 'Env Incident', val: yearCum?.environmental_incident || 0, target: 0 },
                  { key: 'Prop Damage', val: yearCum?.property_damage || 0, target: 0 },
                  { key: 'Complaint', val: yearCum?.customer_formal_complaint || 0, target: 5 },
                ].map((item, idx) => {
                  const isSafe = item.val <= item.target;
                  return (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl text-center border transition-all ${
                        isSafe
                          ? 'bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700/60'
                          : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
                      }`}
                    >
                      <p className="text-[9px] font-semibold text-gray-400 truncate" title={item.key}>{item.key}</p>
                      <p className={`text-sm font-black mt-0.5 ${isSafe ? 'text-gray-800 dark:text-white' : 'text-red-600 dark:text-red-400'}`}>
                        {item.val}
                      </p>
                      <p className="text-[8px] text-gray-400">Tgt: {item.target}</p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ==================== 5. OPERATIONAL CHARTS GRID ==================== */}
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
