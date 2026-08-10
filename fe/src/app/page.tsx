'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { 
  ClipboardCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Users, 
  AlertTriangle, 
  BarChart3,
  ChevronRight,
  Calendar,
  Layers,
  History,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  TrendingUp,
  Award,
  HardHat
} from 'lucide-react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
});

type PeriodKey = 'this_month' | 'last_month' | 'last_year' | 'all_time';

interface PeriodMetrics {
  period: PeriodKey;
  label: string;
  target_year: number | null;
  target_month: number | null;
  total_safe_manhours: number;
  total_manpower: number;
  total_permits: number;
  permits_completed: number;
  permits_by_status?: Record<string, number>;
  total_insiden: number;
  insiden_by_jenis?: Record<string, number>;
  insiden_by_status?: Record<string, number>;
  last_accident_date: string | null;
  total_safety_behavior: number;
  total_safety_patrol: number;
  total_karyawan: number;
  kpi_total_entries: number;
  kpi_totals: Record<string, number>;
}

interface ApiResponseData extends PeriodMetrics {
  periods?: {
    this_month: PeriodMetrics;
    last_month: PeriodMetrics;
    last_year: PeriodMetrics;
    all_time: PeriodMetrics;
  };
  insiden_this_month?: number;
  permits_this_month?: number;
}

export default function LandingPage() {
  const [data, setData] = useState<ApiResponseData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>('this_month');
  const [showComparisonBoard, setShowComparisonBoard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await api.get('/public-dashboard');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
      if (isManual) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(false), 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Memuat Papan Informasi Keselamatan Kerja MS-HSSE...</p>
      </div>
    );
  }

  // Determine active metrics based on period selected
  const activeMetrics: PeriodMetrics = (data?.periods && data.periods[selectedPeriod]) 
    ? data.periods[selectedPeriod] 
    : data || {
        period: selectedPeriod,
        label: 'Semua Periode',
        target_year: null,
        target_month: null,
        total_safe_manhours: 0,
        total_manpower: 0,
        total_permits: 0,
        permits_completed: 0,
        total_insiden: 0,
        last_accident_date: null,
        total_safety_behavior: 0,
        total_safety_patrol: 0,
        total_karyawan: 0,
        kpi_total_entries: 0,
        kpi_totals: {},
        insiden_by_jenis: {},
        permits_by_status: {}
      };

  const kpi = activeMetrics.kpi_totals || {};
  const insidenJenis = activeMetrics.insiden_by_jenis || {};
  const periodsData = data?.periods;

  const periodTabs = [
    { 
      key: 'this_month' as PeriodKey, 
      title: 'Bulan Ini', 
      subtitle: periodsData?.this_month?.label?.replace('Bulan Ini ', '') || 'Bulan Berjalan',
      icon: Sparkles,
      color: 'blue'
    },
    { 
      key: 'last_month' as PeriodKey, 
      title: 'Bulan Kemarin', 
      subtitle: periodsData?.last_month?.label?.replace('Bulan Kemarin ', '') || 'Bulan Lalu',
      icon: History,
      color: 'amber'
    },
    { 
      key: 'last_year' as PeriodKey, 
      title: 'Tahun Kemarin', 
      subtitle: periodsData?.last_year?.label?.replace('Tahun Kemarin ', '') || 'Tahun Lalu',
      icon: Calendar,
      color: 'purple'
    },
    { 
      key: 'all_time' as PeriodKey, 
      title: 'Semua Periode', 
      subtitle: 'Akumulasi Total',
      icon: Layers,
      color: 'emerald'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans pb-16">
      {/* Top Navbar Header */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 relative bg-transparent shrink-0">
                <Image src="/logo-hsse.png" alt="Logo HSSE" fill className="object-contain" priority />
              </div>
              <div className="h-5 w-px bg-gray-200 dark:bg-gray-700 shrink-0" />
              <div className="w-8 h-8 relative bg-transparent shrink-0">
                <Image src="/Picture1.png" alt="Logo INL" fill className="object-contain" priority />
              </div>
              <div>
                <h1 className="text-xs sm:text-base font-bold text-gray-900 dark:text-white leading-tight uppercase">PT. INDUSTRI NABATI LESTARI</h1>
                <p className="text-[9px] sm:text-[10px] text-green-600 dark:text-green-400 font-semibold tracking-wider">MS-HSSE PERFORMANCE INFORMATION</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchData(true)}
                disabled={isRefreshing}
                title="Perbarui Data Real-time"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-blue-600' : ''} />
                <span>Live Sync</span>
              </button>
              <Link href="/login" className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm">
                Masuk <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 🚀 FLOATING SLIDEBOARD BAR (KONTROL PERIODE MENGAMBANG)                   */}
      {/* ========================================================================= */}
      <div className="sticky top-16 z-40 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-800 py-2.5 px-3 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
          
          {/* Active Period Pills Slider */}
          <div className="w-full md:w-auto flex items-center gap-1.5 p-1 bg-white/90 dark:bg-gray-800/90 border border-gray-200/80 dark:border-gray-700/80 rounded-2xl shadow-sm overflow-x-auto no-scrollbar">
            {periodTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedPeriod === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setSelectedPeriod(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/30'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/60'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-white' : 'text-gray-400'} />
                  <span>{tab.title}</span>
                  {tab.key === 'this_month' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Controls: Comparison Toggle & Active Filter Info */}
          <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 font-medium">
              <span className="font-semibold text-gray-500 dark:text-gray-400">Filter Aktif:</span>
              <span className="font-bold">{activeMetrics.label}</span>
            </div>

            {/* Toggle Floating Comparison Slideboard */}
            <button
              onClick={() => setShowComparisonBoard(!showComparisonBoard)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all border shadow-sm ${
                showComparisonBoard
                  ? 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">Slideboard Komparasi</span>
              <span className="sm:hidden">Komparasi</span>
              {showComparisonBoard ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

        </div>
      </div>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6">
        
        {/* ========================================================================= */}
        {/* 📊 FLOATING COMPARISON SLIDEBOARD PANEL (EXPANDABLE)                      */}
        {/* ========================================================================= */}
        {showComparisonBoard && periodsData && (
          <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-blue-950 text-white rounded-3xl p-4 sm:p-6 shadow-xl border border-blue-800/40 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-700/60">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-400">
                  <SlidersHorizontal size={18} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    Slideboard Komparasi Kinerja HSSE
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 font-semibold border border-blue-400/30">
                      Real-time Comparison
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400">Pembandingan metrik utama keselamatan kerja antar periode waktu</p>
                </div>
              </div>
              <button
                onClick={() => setShowComparisonBoard(false)}
                className="text-xs text-gray-400 hover:text-white px-2.5 py-1 rounded-lg bg-gray-800/60 hover:bg-gray-800 self-end sm:self-center"
              >
                Tutup Panel ✕
              </button>
            </div>

            {/* 3 Columns Comparison Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              
              {/* Card A: Bulan Ini */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/[0.08] transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={13} /> Bulan Ini
                    </span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md border border-blue-400/30">
                      {periodsData.this_month?.label?.replace('Bulan Ini ', '')}
                    </span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-gray-400">Jam Kerja Selamat:</span>
                      <span className="font-bold text-white">{Number(periodsData.this_month?.total_safe_manhours || 0).toLocaleString('id-ID')} Jam</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-gray-400">Total Insiden:</span>
                      <span className={`font-bold ${(periodsData.this_month?.total_insiden || 0) === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {periodsData.this_month?.total_insiden || 0} Kasus
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-gray-400">Izin Kerja (PTW):</span>
                      <span className="font-bold text-white">{periodsData.this_month?.total_permits || 0} ({periodsData.this_month?.permits_completed || 0} Selesai)</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-gray-400">Tenaga Kerja:</span>
                      <span className="font-bold text-white">{periodsData.this_month?.total_manpower || 0} Orang</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Toolbox & Edukasi:</span>
                      <span className="font-bold text-emerald-400">
                        {((periodsData.this_month?.kpi_totals?.hse_toolbox_meeting || 0) + (periodsData.this_month?.kpi_totals?.hse_training || 0))} Kegiatan
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPeriod('this_month')}
                  className={`mt-3 w-full py-1.5 text-center text-xs font-semibold rounded-xl transition-all ${
                    selectedPeriod === 'this_month'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-gray-200'
                  }`}
                >
                  {selectedPeriod === 'this_month' ? '✓ Sedang Ditampilkan' : 'Pilih Periode Ini'}
                </button>
              </div>

              {/* Card B: Bulan Kemarin */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/[0.08] transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <History size={13} /> Bulan Kemarin
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-400/30">
                      {periodsData.last_month?.label?.replace('Bulan Kemarin ', '')}
                    </span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-gray-400">Jam Kerja Selamat:</span>
                      <span className="font-bold text-white">{Number(periodsData.last_month?.total_safe_manhours || 0).toLocaleString('id-ID')} Jam</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-gray-400">Total Insiden:</span>
                      <span className={`font-bold ${(periodsData.last_month?.total_insiden || 0) === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {periodsData.last_month?.total_insiden || 0} Kasus
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-gray-400">Izin Kerja (PTW):</span>
                      <span className="font-bold text-white">{periodsData.last_month?.total_permits || 0} ({periodsData.last_month?.permits_completed || 0} Selesai)</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-gray-400">Tenaga Kerja:</span>
                      <span className="font-bold text-white">{periodsData.last_month?.total_manpower || 0} Orang</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Toolbox & Edukasi:</span>
                      <span className="font-bold text-emerald-400">
                        {((periodsData.last_month?.kpi_totals?.hse_toolbox_meeting || 0) + (periodsData.last_month?.kpi_totals?.hse_training || 0))} Kegiatan
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPeriod('last_month')}
                  className={`mt-3 w-full py-1.5 text-center text-xs font-semibold rounded-xl transition-all ${
                    selectedPeriod === 'last_month'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-gray-200'
                  }`}
                >
                  {selectedPeriod === 'last_month' ? '✓ Sedang Ditampilkan' : 'Pilih Periode Ini'}
                </button>
              </div>

              {/* Card C: Tahun Kemarin */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/[0.08] transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar size={13} /> Tahun Kemarin
                    </span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-md border border-purple-400/30">
                      {periodsData.last_year?.label?.replace('Tahun Kemarin ', '')}
                    </span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-gray-400">Jam Kerja Selamat:</span>
                      <span className="font-bold text-white">{Number(periodsData.last_year?.total_safe_manhours || 0).toLocaleString('id-ID')} Jam</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-gray-400">Total Insiden:</span>
                      <span className={`font-bold ${(periodsData.last_year?.total_insiden || 0) === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {periodsData.last_year?.total_insiden || 0} Kasus
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-gray-400">Izin Kerja (PTW):</span>
                      <span className="font-bold text-white">{periodsData.last_year?.total_permits || 0} ({periodsData.last_year?.permits_completed || 0} Selesai)</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-gray-400">Rata-rata Tenaga Kerja:</span>
                      <span className="font-bold text-white">{periodsData.last_year?.total_manpower || 0} Orang</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Toolbox & Edukasi:</span>
                      <span className="font-bold text-emerald-400">
                        {((periodsData.last_year?.kpi_totals?.hse_toolbox_meeting || 0) + (periodsData.last_year?.kpi_totals?.hse_training || 0))} Kegiatan
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPeriod('last_year')}
                  className={`mt-3 w-full py-1.5 text-center text-xs font-semibold rounded-xl transition-all ${
                    selectedPeriod === 'last_year'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-gray-200'
                  }`}
                >
                  {selectedPeriod === 'last_year' ? '✓ Sedang Ditampilkan' : 'Pilih Periode Ini'}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Main Title Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            INFORMASI KESELAMATAN KERJA
          </h2>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Sistem Pemantauan Terpadu MS-HSSE ( Management System Health, Safety, Security, and Environment ) PT. Industri Nabati Lestari
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
                {Number(activeMetrics.total_safe_manhours || 0).toLocaleString('id-ID')}
              </p>
              <p className="text-[10px] sm:text-xs text-blue-100 mt-1">Safe Man Hours ({activeMetrics.label})</p>
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
                {activeMetrics.total_insiden || 0}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                <span className="text-red-500 font-semibold">{activeMetrics.total_insiden || 0}</span> kasus tercatat
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
                {activeMetrics.total_permits || 0}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                <span className="text-emerald-500 font-semibold">{activeMetrics.permits_completed || 0}</span> selesai
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
                {activeMetrics.total_manpower || activeMetrics.total_karyawan || 0}
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
                {activeMetrics.last_accident_date 
                  ? new Date(activeMetrics.last_accident_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) 
                  : 'NIL / Nihil Kecelakaan'}
              </span>
            </div>
          </div>

          {/* Rincian Jenis Insiden */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" />
                Rincian Kategori Insiden ({activeMetrics.label})
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
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Rekapitulasi HSE KPI Performance</h3>
                <p className="text-[11px] text-gray-400">Periode: {activeMetrics.label}</p>
              </div>
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
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{activeMetrics.total_safety_patrol || 0}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-100 dark:border-gray-700/60">
              <p className="text-xs text-gray-500 dark:text-gray-400">Safety Behavior</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{activeMetrics.total_safety_behavior || 0}</p>
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
