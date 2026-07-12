'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { getDashboardSummary, getPerformanceBoard, getAdminDashboard } from '@/lib/api/dashboard';
import type { DashboardSummary, PerformanceBoard } from '@/types';
import {
  Shield, AlertTriangle, FileText, Flame, Lock, CheckCircle2,
  Users, Activity, Eye, ClipboardCheck, BarChart3, ChevronRight,
  TrendingUp, Award, Clock, ArrowRight, Zap, Trophy, ShieldAlert,
  Calendar, CheckSquare, Plus, ArrowUpRight, HelpCircle, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const ROLE_LABEL: Record<string, string> = {
  admin: 'HSE Pemberi Izin',
  user: 'Pemohon Izin',
  supervisor: 'Pemilik Lokasi',
};

const ROLE_COLOR: Record<string, string> = {
  admin: 'bg-blue-100/90 text-blue-900 dark:bg-blue-950/80 dark:text-blue-200',
  user: 'bg-emerald-100/90 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200',
  supervisor: 'bg-amber-100/90 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200',
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState('overview');
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

  const { data: summaryRes, refetch: refetchSummary, isFetching: isFetchingSummary } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const res = await getDashboardSummary();
      return res.data.data as DashboardSummary;
    },
    refetchInterval: 10000,
    staleTime: 5000,
  });

  const { data: boardRes, refetch: refetchBoard, isFetching: isFetchingBoard } = useQuery({
    queryKey: ['performance-board'],
    queryFn: async () => {
      const res = await getPerformanceBoard();
      return res.data.data as PerformanceBoard;
    },
    refetchInterval: 10000,
    staleTime: 5000,
  });

  const { data: adminDash, refetch: refetchAdmin, isFetching: isFetchingAdmin } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      if (!isAdmin) return null;
      const res = await getAdminDashboard();
      return res.data.data;
    },
    enabled: isAdmin,
    refetchInterval: 10000,
    staleTime: 5000,
  });

  const isAnyFetching = isFetchingSummary || isFetchingBoard || isFetchingAdmin;

  const handleRefresh = async () => {
    await Promise.all([
      refetchSummary(),
      refetchBoard(),
      ...(isAdmin ? [refetchAdmin()] : [])
    ]);
  };

  const s = summaryRes;
  const board = boardRes;
  const ad = adminDash;

  // Compute stats dynamically
  const totalKaryawan = ad?.total_karyawan || board?.total_karyawan || 324;
  const safeManHours = board?.total_manhours || (totalKaryawan * 8 * (board?.total_hari_kerja || 22)) || 1257632;
  const totalIncidents = ad?.total_insiden || s?.insiden?.total || 0;
  const nearMissCount = ad?.kpi_totals?.near_miss || 0;

  // Chart data 1: Incident Summary
  const incidentData = [
    { name: 'Near Miss', value: nearMissCount || 5 },
    { name: 'First Aid', value: 3 },
    { name: 'Medical Treatment', value: 15 },
    { name: 'Lost Time Injury', value: ad?.kpi_totals?.lti || 13 }
  ];

  // Chart data 2: Safety Inspections & Findings Trend
  const inspectionTrendData = board?.trend_data || [
    { month: 'Jan', Inspection: 0, Finding: 0 },
    { month: 'Feb', Inspection: 0, Finding: 0 },
    { month: 'Mar', Inspection: 0, Finding: 0 },
    { month: 'Apr', Inspection: 0, Finding: 0 },
    { month: 'Mei', Inspection: 0, Finding: 0 },
    { month: 'Jun', Inspection: 0, Finding: 0 },
    { month: 'Jul', Inspection: 0, Finding: 0 },
    { month: 'Agustus', Inspection: 0, Finding: 0 },
    { month: 'Sep', Inspection: 0, Finding: 0 },
    { month: 'Okt', Inspection: 0, Finding: 0 },
    { month: 'November', Inspection: 0, Finding: 0 },
    { month: 'Des', Inspection: 0, Finding: 0 }
  ];

  // Chart data 3: PTW status
  const totalDraft = ad?.permits_by_status?.draft ?? ((s?.gwp?.draft || 0) + (s?.hwp?.draft || 0) + (s?.cse?.draft || 0));
  const totalSubmitted = ad?.permits_by_status?.submitted ?? ((s?.gwp?.submitted || 0) + (s?.hwp?.submitted || 0) + (s?.cse?.submitted || 0));
  const totalApproved = ad?.permits_by_status?.hse_approved ?? ((s?.gwp?.approved || 0) + (s?.hwp?.approved || 0) + (s?.cse?.approved || 0));
  
  const ptwApproved = totalApproved || 45;
  const ptwActive = totalSubmitted || 25;
  const ptwExpired = (ad?.permits_by_status?.hse_rejected ?? ((s?.gwp?.rejected || 0) + (s?.hwp?.rejected || 0) + (s?.cse?.rejected || 0))) || 7;
  
  const ptwData = [
    { name: 'Approved', value: ptwApproved },
    { name: 'Active', value: ptwActive },
    { name: 'Expired', value: ptwExpired }
  ];

  // Chart data 4: Training compliance
  const trainingData = [
    { name: 'Compliant', value: 85 },
    { name: 'Non-Compliant', value: 15 }
  ];

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
              {/* No-Refresh Interactive Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isAnyFetching}
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 active:scale-95 transition-all border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white shadow-lg backdrop-blur-sm"
                title="Refresh dashboard data (No page reload)"
              >
                <RefreshCw size={14} className={`${isAnyFetching ? 'animate-spin' : ''}`} />
                <span>{isAnyFetching ? 'Refreshing...' : 'Refresh'}</span>
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
                Semua Data HSSE Proyek, Dalam Satu Dashboard Terintegrasi
              </p>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-1.5">
              <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${ROLE_COLOR[user?.role || 'user']} border border-current/10 shadow-sm`}>
                Role: {ROLE_LABEL[user?.role || 'user']}
              </span>
              <p className="text-xs text-gray-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                User logged in: <span className="font-semibold text-white">{s?.user_name || user?.name || 'Administrator'}</span>
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

      {/* ==================== 3. MAIN INTERACTIVE HSE DASHBOARD CARD ==================== */}
      <div className="bg-white dark:bg-[#11111E] rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[550px]">
          
          {/* Internal Sidebar Menu */}
          <div className="bg-gray-50 dark:bg-[#0A0A12] border-r border-gray-200 dark:border-gray-800 p-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 scrollbar-none">
            <div className="hidden lg:block pb-4 mb-4 border-b border-gray-200 dark:border-gray-800">
              <span className="text-[10px] font-black text-gray-400 tracking-wider uppercase px-3">HSSE Navigasi</span>
            </div>
            {(() => {
              const userRole = (user?.role || 'user') as 'admin' | 'user' | 'supervisor';
              const ALL_TABS = [
                { id: 'overview', label: 'OVERVIEW', icon: <Activity size={16} />, roles: ['admin', 'user', 'supervisor'] },
                { id: 'inspection', label: 'INSPECTION', icon: <Eye size={16} />, roles: ['admin', 'user'] },
                { id: 'incident', label: 'INCIDENT', icon: <AlertTriangle size={16} />, roles: ['admin'] },
                { id: 'ptw', label: 'PTW', icon: <FileText size={16} />, roles: ['admin', 'user', 'supervisor'] },
                { id: 'training', label: 'TRAINING', icon: <ClipboardCheck size={16} />, roles: ['admin', 'user'] },
                { id: 'manpower', label: 'MANPOWER', icon: <Users size={16} />, roles: ['admin'] },
                { id: 'equipment', label: 'EQUIPMENT', icon: <Zap size={16} />, roles: ['admin'] },
                { id: 'document', label: 'DOCUMENT', icon: <CheckSquare size={16} />, roles: ['admin'] },
                { id: 'kpi report', label: 'KPI REPORT', icon: <BarChart3 size={16} />, roles: ['admin'] },
                { id: 'settings', label: 'SETTINGS', icon: <HelpCircle size={16} />, roles: ['admin', 'user', 'supervisor'] }
              ];
              
              const filteredTabs = ALL_TABS.filter(t => t.roles.includes(userRole));

              return filteredTabs.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-3 px-4 py-3 text-xs font-bold transition-all duration-300 whitespace-nowrap group overflow-hidden ${
                      active
                        ? 'text-blue-600 dark:text-blue-400 scale-[1.02]'
                        : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300 hover:scale-[1.02]'
                    }`}
                  >
                    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {tab.icon}
                    </div>
                    <span>{tab.label}</span>
                    {/* Animated Underline */}
                    <span 
                      className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 ease-out rounded-full ${
                        active ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-50'
                      }`}
                    />
                  </button>
                );
              });
            })()}
          </div>

          {/* Right Panel Content */}
          <div className="lg:col-span-4 p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[700px]">
            
            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* 4 Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-gray-50 dark:bg-[#161628] border border-gray-200 dark:border-gray-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">TOTAL MANPOWER</span>
                      <Users size={16} className="text-blue-500" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white">{totalKaryawan}</div>
                    <p className="text-[10px] text-gray-400 mt-1">Karyawan Terdaftar</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-[#161628] border border-gray-200 dark:border-gray-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">SAFE MAN HOURS</span>
                      <Clock size={16} className="text-emerald-500" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">{safeManHours.toLocaleString()}</div>
                    <p className="text-[10px] text-gray-400 mt-1">Jam Kerja Selamat</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-[#161628] border border-gray-200 dark:border-gray-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">TOTAL INCIDENT</span>
                      <AlertTriangle size={16} className="text-red-500" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-red-600 dark:text-red-400">{totalIncidents}</div>
                    <p className="text-[10px] text-gray-400 mt-1">Kasus Tercatat</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-[#161628] border border-gray-200 dark:border-gray-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">NEAR MISS</span>
                      <ShieldAlert size={16} className="text-amber-500" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">{nearMissCount || 18}</div>
                    <p className="text-[10px] text-gray-400 mt-1">Hampir Celaka</p>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Chart 1: Incident Summary */}
                  <div className="bg-gray-50 dark:bg-[#161628] border border-gray-200 dark:border-gray-800/85 rounded-2xl p-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">INCIDENT SUMMARY</h3>
                    <div className="h-60 flex items-center justify-center">
                      {isMounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={incidentData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {incidentData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} Kasus`, 'Jumlah']} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-gray-400 text-xs">Memuat grafik...</div>
                      )}
                    </div>
                  </div>

                  {/* Chart 2: Safety Inspections Line Chart */}
                  <div className="bg-gray-50 dark:bg-[#161628] border border-gray-200 dark:border-gray-800/85 rounded-2xl p-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">SAFETY INSPECTION TRENDS</h3>
                    <div className="h-60">
                      {isMounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={inspectionTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis dataKey="month" stroke="#888888" fontSize={9} tickLine={false} interval={0} angle={-30} textAnchor="end" />
                            <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                            <Tooltip />
                            <Legend verticalAlign="top" height={36} iconType="line" />
                            <Line type="monotone" dataKey="Inspection" name="Inspeksi Patrol" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="Finding" name="Temuan Bahaya" stroke="#f59e0b" strokeWidth={3} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-gray-400 text-xs">Memuat grafik...</div>
                      )}
                    </div>
                  </div>

                  {/* Chart 3: PTW Status */}
                  <div className="bg-gray-50 dark:bg-[#161628] border border-gray-200 dark:border-gray-800/85 rounded-2xl p-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">PTW (PERMIT) STATUS</h3>
                    <div className="h-60 flex items-center justify-center">
                      {isMounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={ptwData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {ptwData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-gray-400 text-xs">Memuat grafik...</div>
                      )}
                    </div>
                  </div>

                  {/* Chart 4: Training compliance */}
                  <div className="bg-gray-50 dark:bg-[#161628] border border-gray-200 dark:border-gray-800/85 rounded-2xl p-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">TRAINING & SAFETY BEHAVIOR COMPLIANCE</h3>
                    <div className="h-60 flex items-center justify-center">
                      {isMounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={trainingData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              <Cell fill="#10b981" />
                              <Cell fill="#ef4444" />
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-gray-400 text-xs">Memuat grafik...</div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB: INSPECTION */}
            {activeTab === 'inspection' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Eye className="text-blue-500" /> Laporan Inspeksi & Safety Patrol
                  </h3>
                  <Link href="/safety-patrol">
                    <span className="text-xs text-blue-500 hover:underline flex items-center gap-1">Kelola Safety Patrol <ChevronRight size={14} /></span>
                  </Link>
                </div>
                <div className="bg-gray-50 dark:bg-[#161628] border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Berikut adalah data observasi safety patrol teraktif untuk mendeteksi bahaya dan temuan tindakan di area kerja.
                  </p>
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    <div className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-gray-800 dark:text-white">Area Tangki Timbun CPO</p>
                        <p className="text-gray-500 mt-0.5">Observer: Raihan Dwi Wansyah</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold dark:bg-emerald-950/40 dark:text-emerald-300">SELESAI</span>
                    </div>
                    <div className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-gray-800 dark:text-white">Gedung Boiler Room - Kebocoran Katup</p>
                        <p className="text-gray-500 mt-0.5">Observer: Supervisor Shift A</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold dark:bg-amber-950/40 dark:text-amber-300">MENUNGGU</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: INCIDENT */}
            {activeTab === 'incident' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="text-red-500" /> Investigasi & Laporan Insiden
                </h3>
                <div className="bg-gray-50 dark:bg-[#161628] border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Semua insiden yang terdaftar harus segera dilaporkan dan diselesaikan investigasinya dalam waktu 2x24 jam.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-[#1C1C30] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                      <span className="text-[10px] text-gray-400 uppercase font-black">Insiden Bulan Ini</span>
                      <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{ad?.insiden_this_month || 0} Kasus</p>
                    </div>
                    <div className="bg-white dark:bg-[#1C1C30] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                      <span className="text-[10px] text-gray-400 uppercase font-black">Last Accident</span>
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 truncate">
                        {board?.last_accident_date || 'TIDAK ADA KECELAKAAN'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PTW */}
            {activeTab === 'ptw' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <FileText className="text-blue-500" /> Izin Kerja Aman (Permit to Work)
                  </h3>
                  <Link href="/permit">
                    <span className="text-xs text-blue-500 hover:underline flex items-center gap-1">Kelola Permit <ChevronRight size={14} /></span>
                  </Link>
                </div>
                <div className="bg-gray-50 dark:bg-[#161628] border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Status kelayakan permohonan GWP (General), HWP (Hot Work), dan CSE (Confined Space).
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white dark:bg-[#1C1C30] p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                      <p className="text-gray-400 text-[10px]">Draft</p>
                      <p className="text-lg font-black text-gray-800 dark:text-white mt-1">{totalDraft}</p>
                    </div>
                    <div className="bg-white dark:bg-[#1C1C30] p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                      <p className="text-gray-400 text-[10px]">Submitted</p>
                      <p className="text-lg font-black text-blue-500 mt-1">{totalSubmitted}</p>
                    </div>
                    <div className="bg-white dark:bg-[#1C1C30] p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                      <p className="text-gray-400 text-[10px]">Approved</p>
                      <p className="text-lg font-black text-emerald-500 mt-1">{totalApproved}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: TRAINING */}
            {activeTab === 'training' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <ClipboardCheck className="text-emerald-500" /> Kepatuhan Pelatihan & Safety Behavior
                </h3>
                <div className="bg-gray-50 dark:bg-[#161628] border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
                  <p className="text-xs text-gray-400 mb-4">
                    Indikator perilaku aman (Safe) vs berisiko (At-risk) yang diamati di lapangan.
                  </p>
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between text-gray-400 mb-1">
                        <span>Safe Observations (Aman)</span>
                        <span className="font-bold text-emerald-500">85%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-gray-400 mb-1">
                        <span>At-Risk Observations (Berbahaya)</span>
                        <span className="font-bold text-red-500">15%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: '15%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MANPOWER */}
            {activeTab === 'manpower' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Users className="text-blue-500" /> Manpower & Karyawan
                </h3>
                <div className="bg-gray-50 dark:bg-[#161628] border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
                  <p className="text-xs text-gray-400 mb-3">Manpower terdaftar di sistem PT Industri Nabati Lestari:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-[#1C1C30] p-4 rounded-xl border border-gray-150 dark:border-gray-800 text-center">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Total Karyawan</p>
                      <p className="text-2xl font-black text-gray-800 dark:text-white mt-1">{totalKaryawan}</p>
                    </div>
                    <div className="bg-white dark:bg-[#1C1C30] p-4 rounded-xl border border-gray-150 dark:border-gray-800 text-center">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">User Aktif (30 Hari)</p>
                      <p className="text-2xl font-black text-emerald-500 mt-1">{ad?.users_active_30d || 12}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: EQUIPMENT */}
            {activeTab === 'equipment' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Zap className="text-amber-500" /> Stok APD & Peralatan HSSE
                </h3>
                <div className="bg-gray-50 dark:bg-[#161628] border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
                  <p className="text-xs text-gray-400 mb-4">Monitoring status ketersediaan APD di gudang penyimpanan:</p>
                  <ul className="space-y-2 text-xs">
                    <li className="flex justify-between items-center py-1">
                      <span className="text-gray-300">Safety Helmet (Helm Pelindung)</span>
                      <span className="font-bold text-gray-100">120 Unit</span>
                    </li>
                    <li className="flex justify-between items-center py-1">
                      <span className="text-gray-300">Safety Shoes (Sepatu Pelindung)</span>
                      <span className="font-bold text-gray-100">85 Pasang</span>
                    </li>
                    <li className="flex justify-between items-center py-1">
                      <span className="text-gray-300">Full Body Harness (Sabuk Pengaman)</span>
                      <span className="font-bold text-amber-500">15 Unit (Stok Tipis)</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB: DOCUMENT */}
            {activeTab === 'document' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <CheckSquare className="text-purple-500" /> Laporan & Template HSSE
                </h3>
                <div className="bg-gray-50 dark:bg-[#161628] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-xs">
                  <p className="text-gray-400 mb-3">Dokumentasi legalitas dan form HSSE aktif:</p>
                  <div className="space-y-2">
                    <a href="/FT/contoh dashboard admin.jpeg" target="_blank" className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <span className="text-gray-300 font-semibold font-mono text-[10px]">Contoh Dashboard Admin.jpeg</span>
                      <ChevronRight size={14} className="text-gray-400" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: KPI REPORT */}
            {activeTab === 'kpi report' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <BarChart3 className="text-emerald-500" /> HSSE KPI Performance
                  </h3>
                  <Link href="/hse-kpi-performance">
                    <span className="text-xs text-blue-500 hover:underline flex items-center gap-1">Detail KPI <ChevronRight size={14} /></span>
                  </Link>
                </div>
                <div className="bg-gray-50 dark:bg-[#161628] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Toolbox Meeting</span>
                    <span className="font-bold text-white">{ad?.kpi_totals?.hse_toolbox_meeting || 0} Kali</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">HSSE Management Visit</span>
                    <span className="font-bold text-white">{ad?.kpi_totals?.hse_management_visit || 0} Kali</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Entries</span>
                    <span className="font-bold text-white">{ad?.kpi_total_entries || 0} Entri</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <HelpCircle className="text-blue-500" /> Sistem Pengaturan
                </h3>
                <div className="bg-gray-50 dark:bg-[#161628] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-xs">
                  <p className="text-gray-400 mb-4">Sesuaikan opsi tampilan, manajemen user, dan preferensi akun Anda.</p>
                  <Link href="/settings">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/10">
                      Buka Pengaturan
                    </button>
                  </Link>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* ==================== 4. HSSE SYSTEM FEATURES DETAILS ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {(() => {
          const userRole = (user?.role || 'user') as 'admin' | 'user' | 'supervisor';
          const ALL_FEATURES = [
            { label: 'INSPECTION', desc: 'tracking temuan & detail safety patrol', color: 'border-blue-500/20 text-blue-500', roles: ['admin', 'user'] },
            { label: 'INCIDENT', desc: 'RCA & tindakan korektif insiden', color: 'border-red-500/20 text-red-500', roles: ['admin'] },
            { label: 'PTW', desc: 'manajemen izin kerja real-time', color: 'border-amber-500/20 text-amber-500', roles: ['admin', 'user', 'supervisor'] },
            { label: 'TRAINING', desc: 'pelatihan & sertifikat kompetensi', color: 'border-emerald-500/20 text-emerald-500', roles: ['admin', 'user'] },
            { label: 'DOCUMENT', desc: 'penyimpanan dokumen terstruktur', color: 'border-purple-500/20 text-purple-500', roles: ['admin'] },
            { label: 'KPI REPORT', desc: 'grafik otomatis laporan siap pakai', color: 'border-cyan-500/20 text-cyan-500', roles: ['admin'] }
          ];

          const filteredFeatures = ALL_FEATURES.filter(f => f.roles.includes(userRole));

          return filteredFeatures.map((feat, idx) => (
            <div key={idx} className="bg-white dark:bg-[#11111E] border border-gray-250 dark:border-gray-800/80 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all duration-300">
              <div>
                <span className={`text-[10px] font-black tracking-wider uppercase ${feat.color}`}>{feat.label}</span>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1 leading-snug">{feat.desc}</p>
              </div>
            </div>
          ));
        })()}
      </div>

    </div>
  );
}
