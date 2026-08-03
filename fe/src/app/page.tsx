'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { ClipboardCheck, ShieldAlert, Activity, UserCheck, Shield, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
});

interface DashboardData {
  total_permits: number;
  permits_completed: number;
  total_insiden: number;
  insiden_this_month: number;
  total_safety_behavior: number;
  safety_behavior_this_month: number;
  total_safety_patrol: number;
  total_karyawan: number;
  last_accident_date: string | null;
  recent_activities: any[];
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
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Memuat Papan Informasi...</p>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, colorClass }: any) => (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow`}>
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 ${colorClass}`} />
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
          <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">{value}</h3>
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">{title}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans pb-12">
      {/* Top Navigation / Header */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 relative bg-transparent rounded overflow-hidden">
                <Image src="/Picture1.png" alt="Logo INL" fill className="object-contain" priority />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-tight uppercase">PT. INDUSTRI NABATI LESTARI</h1>
                <p className="text-[10px] text-green-600 dark:text-green-400 font-medium tracking-wider">HSE PERFORMANCE BOARD</p>
              </div>
            </div>
            <Link href="/login" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              Masuk <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Board Header Section */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            Informasi Keselamatan Kerja
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Pantauan langsung (real-time) mengenai data izin kerja, insiden, patroli keselamatan, dan observasi perilaku kerja di lingkungan perusahaan.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <StatCard 
            icon={ClipboardCheck} 
            title="Total Izin Kerja" 
            value={data?.total_permits || 0} 
            subtitle={`${data?.permits_completed || 0} telah selesai`} 
            colorClass="bg-blue-500" 
          />
          <StatCard 
            icon={ShieldAlert} 
            title="Total Insiden" 
            value={data?.total_insiden || 0} 
            subtitle={`${data?.insiden_this_month || 0} insiden bulan ini`} 
            colorClass="bg-red-500" 
          />
          <StatCard 
            icon={Activity} 
            title="Safety Behavior" 
            value={data?.total_safety_behavior || 0} 
            subtitle={`${data?.safety_behavior_this_month || 0} observasi bulan ini`} 
            colorClass="bg-amber-500" 
          />
          <StatCard 
            icon={Shield} 
            title="Safety Patrol" 
            value={data?.total_safety_patrol || 0} 
            subtitle={`${data?.total_karyawan || 0} karyawan terdaftar`} 
            colorClass="bg-emerald-500" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          
          {/* Highlight Section */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 flex flex-col justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Status Area Aman</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Selalu utamakan keselamatan dalam setiap langkah pekerjaan Anda.</p>
              
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Terakhir Kecelakaan Kerja</p>
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  {data?.last_accident_date 
                    ? new Date(data.last_accident_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) 
                    : 'Tidak ada catatan kecelakaan'}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock size={18} className="text-blue-500" />
              Aktivitas Terbaru
            </h3>
            
            <div className="flex-1 overflow-y-auto max-h-[300px] pr-2 space-y-3 custom-scrollbar">
              {data?.recent_activities && data.recent_activities.length > 0 ? (
                data.recent_activities.map((act: any, i: number) => {
                  let typeColor = 'bg-gray-100 text-gray-600';
                  let typeLabel = 'Lainnya';
                  
                  if (act.type === 'permit') { typeColor = 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'; typeLabel = 'Izin Kerja'; }
                  else if (act.type === 'insiden') { typeColor = 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'; typeLabel = 'Insiden'; }
                  else if (act.type === 'safety_behavior') { typeColor = 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'; typeLabel = 'Behavior'; }
                  else if (act.type === 'safety_patrol') { typeColor = 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'; typeLabel = 'Patrol'; }

                  return (
                    <div key={i} className="flex items-start gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
                      <div className={`mt-0.5 shrink-0 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${typeColor}`}>
                        {typeLabel}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{act.title || 'Dokumen'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Oleh: <span className="font-medium text-gray-700 dark:text-gray-300">{act.user || '-'}</span></p>
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap shrink-0">
                        {new Date(act.time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">Belum ada aktivitas terbaru hari ini.</div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
