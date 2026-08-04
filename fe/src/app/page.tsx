'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { 
  ClipboardCheck, 
  ShieldAlert, 
  Activity, 
  Shield, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Award, 
  Users, 
  AlertTriangle, 
  HardHat, 
  FileSpreadsheet, 
  BookOpen, 
  BarChart3,
  TrendingUp,
  UserCheck
} from 'lucide-react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
});

interface DashboardData {
  total_safe_manhours: number;
  total_manpower: number;
  total_permits: number;
  permits_completed: number;
  total_insiden: number;
  insiden_this_month: number;
  insiden_by_jenis: Record<string, number>;
  total_safety_behavior: number;
  safety_behavior_this_month: number;
  total_safety_patrol: number;
  total_karyawan: number;
  last_accident_date: string | null;
  kpi_totals: Record<string, number>;
}

export default function LandingPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/public-dashboard');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Memuat Papan Informasi HSSE...</p>
      </div>
    );
  }

  const kpi = data?.kpi_totals || {};
  const insidenJenis = data?.insiden_by_jenis || {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans pb-12">
      {/* Top Navbar Header */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 relative bg-transparent rounded overflow-hidden shrink-0">
                <Image src="/logo-hsse.jpeg" alt="Logo HSSE" fill className="object-contain rounded" priority />
              </div>
              <div className="w-8 h-8 relative bg-transparent rounded overflow-hidden shrink-0">
                <Image src="/Picture1.png" alt="Logo INL" fill className="object-contain" priority />
              </div>
              <div>
                <h1 className="text-xs sm:text-base font-bold text-gray-900 dark:text-white leading-tight uppercase">PT. INDUSTRI NABATI LESTARI</h1>
                <p className="text-[9px] sm:text-[10px] text-green-600 dark:text-green-400 font-semibold tracking-wider">HSE PERFORMANCE BOARD</p>
              </div>
            </div>
            <Link href="/login" className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm">
              Masuk <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        
        {/* Main Title Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            Papan Informasi Keselamatan Kerja
          </h2>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Sistem Pemantauan Terpadu Kesehatan, Keselamatan Kerja & Lingkungan (HSSE) PT. Industri Nabati Lestari
          </p>
        </div>

        {/* 1. TOP STATS GRID - 2 COLUMNS ON MOBILE, 4 ON DESKTOP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          
          {/* Safe Man Hours */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-blue-100">Jam Kerja Selamat</span>
              <Clock className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <p className="text-xl sm:text-3xl font-extrabold tracking-tight">
                {Number(data?.total_safe_manhours || 0).toLocaleString('id-ID')}
              </p>
              <p className="text-[10px] sm:text-xs text-blue-100 mt-1">Total Safe Man Hours</p>
            </div>
          </div>

          {/* Status Kecelakaan / Insiden */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">Total Insiden</span>
              <ShieldAlert className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {data?.total_insiden || 0}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                <span className="text-red-500 font-semibold">{data?.insiden_this_month || 0}</span> bulan ini
              </div>
            </div>
          </div>

          {/* Total Izin Kerja */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">Izin Kerja (PTW)</span>
              <ClipboardCheck className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {data?.total_permits || 0}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                <span className="text-emerald-500 font-semibold">{data?.permits_completed || 0}</span> selesai
              </div>
            </div>
          </div>

          {/* Manpower / Karyawan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">Total Tenaga Kerja</span>
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {data?.total_manpower || data?.total_karyawan || 0}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">Personel Terdaftar</p>
            </div>
          </div>

        </div>

        {/* 2. SECONDARY GRID: INSIDEN BREAKDOWN & STATUS AREA AMAN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5">
          
          {/* Status Kecelakaan Terakhir */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-center text-center">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={26} />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Status Kecelakaan Terakhir</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Last Accident Date Record</p>
            <div className="bg-gray-50 dark:bg-gray-900 py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <span className="text-sm sm:text-base font-extrabold text-gray-800 dark:text-white">
                {data?.last_accident_date 
                  ? new Date(data.last_accident_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) 
                  : 'NIL / Nihil Kecelakaan'}
              </span>
            </div>
          </div>

          {/* Rincian Jenis Insiden */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" />
                Rincian Kategori Insiden
              </h3>
              <span className="text-xs text-gray-400">Klasifikasi Kejadian</span>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-xl border border-red-100 dark:border-red-900/40">
                <p className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400">{insidenJenis['kecelakaan'] || 0}</p>
                <p className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 mt-0.5">Kecelakaan Kerja</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-100 dark:border-amber-900/40">
                <p className="text-lg sm:text-2xl font-bold text-amber-600 dark:text-amber-400">{insidenJenis['near_miss'] || 0}</p>
                <p className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 mt-0.5">Hampir Celaka (Near Miss)</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-xl border border-blue-100 dark:border-blue-900/40">
                <p className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{insidenJenis['unsafe_condition'] || 0}</p>
                <p className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 mt-0.5">Kondisi / Tindakan Tidak Aman</p>
              </div>
            </div>
          </div>

        </div>

        {/* 3. HSE KPI PERFORMANCE TABLE (HKI) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Rekapitulasi HSE KPI Performance</h3>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full w-fit">
              Key Performance Indicator
            </span>
          </div>

          {/* Grid KPI Metrics - 2 Cols on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
            <div className="bg-gray-50 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs text-gray-500 dark:text-gray-400">Fatality</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400 mt-0.5">{kpi.fatality || 0}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs text-gray-500 dark:text-gray-400">LTI (Lost Time)</p>
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5">{kpi.lti || 0}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs text-gray-500 dark:text-gray-400">Near Miss</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{kpi.near_miss || 0}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs text-gray-500 dark:text-gray-400">Mgmt Visit</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-0.5">{kpi.hse_management_visit || 0}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs text-gray-500 dark:text-gray-400">Toolbox Meeting</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{kpi.hse_toolbox_meeting || 0}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs text-gray-500 dark:text-gray-400">HSE Training</p>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-0.5">{kpi.hse_training || 0}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs text-gray-500 dark:text-gray-400">Safety Patrol</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{data?.total_safety_patrol || 0}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs text-gray-500 dark:text-gray-400">Safety Behavior</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{data?.total_safety_behavior || 0}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs text-gray-500 dark:text-gray-400">Reward</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{kpi.reward || 0}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs text-gray-500 dark:text-gray-400">Punishment</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400 mt-0.5">{kpi.punishment || 0}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs text-gray-500 dark:text-gray-400">Audit Internal</p>
              <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{kpi.audit_program_internal || 0}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs text-gray-500 dark:text-gray-400">Audit Eksternal</p>
              <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">{kpi.audit_program_eksternal || 0}</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
