'use client';

import { Info, Code, Cpu, Award, ExternalLink, ShieldCheck } from 'lucide-react';

export default function AboutTab() {
  const techStack = [
    { name: 'Next.js 14', category: 'Frontend Framework' },
    { name: 'React 18', category: 'Frontend Logic' },
    { name: 'Tailwind CSS', category: 'Styling Engine' },
    { name: 'TypeScript', category: 'Type Safety' },
    { name: 'Laravel 10', category: 'Backend Framework' },
    { name: 'MySQL', category: 'Relational Database' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up pb-10">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1A365D]/10 text-[#1A365D] dark:text-blue-400 flex items-center justify-center">
            <Info size={16} />
          </div>
          Tentang Aplikasi
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Informasi mengenai detail versi aplikasi, sistem, dan pengembang portal HSSE
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="lg:col-span-2 bg-white dark:bg-[#12121E] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-6 shadow-sm relative overflow-hidden">
          {/* Subtle background graphic */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-[#1A365D]/10 to-transparent rounded-bl-full pointer-events-none" />

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 uppercase">
              Official Release
            </div>
            <h2 className="text-2xl font-black text-gray-850 dark:text-white tracking-tight">
              HSSE Management System Portal
            </h2>
            <p className="text-xs text-gray-450 dark:text-gray-400 leading-relaxed max-w-xl">
              Portal manajemen terintegrasi untuk menangani sistem keselamatan, kesehatan kerja, dan lingkungan (HSSE) di lingkungan kerja PT. Industri Nabati Lestari. Memfasilitasi penerbitan surat izin kerja (Permit to Work), pemantauan Safety Patrol, pencatatan Safety Behavior Observation, serta manajemen Master Data pendukung secara digital.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-b border-gray-100 dark:border-gray-800 py-5">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Versi Aplikasi</p>
              <p className="text-sm font-extrabold text-[#1A365D] dark:text-blue-400 mt-0.5">v2.4.0-Stable</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Lingkungan</p>
              <p className="text-sm font-extrabold text-gray-800 dark:text-white mt-0.5">Production Mode</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Lisensi</p>
              <p className="text-sm font-extrabold text-gray-800 dark:text-white mt-0.5">Proprietary (INL)</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Cpu size={14} className="text-[#1A365D] dark:text-blue-400" />
              Teknologi Pendukung (Tech Stack)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {techStack.map((tech, idx) => (
                <div key={idx} className="p-3 bg-gray-50 dark:bg-[#1A1A2E]/50 rounded-xl border border-gray-200/60 dark:border-gray-800/60 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-white">{tech.name}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-550">{tech.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Developer Info Card */}
        <div className="bg-gradient-to-b from-[#1A365D] to-[#122544] dark:from-[#1E293B] dark:to-[#0F172A] text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden">
          {/* Decorative mesh */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
              <Award size={20} className="text-blue-300" />
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-bold tracking-widest text-blue-200 uppercase">Lead Developer</p>
              <h3 className="text-xl font-extrabold tracking-tight text-white break-words">
                RaihanDwiWansyah
              </h3>
              <p className="text-[11px] text-blue-200/90 font-medium">
                Siswa SMK Al-Washliyah 2 Perdagangan
              </p>
              <p className="text-xs text-blue-100/70 leading-relaxed font-light">
                Developer utama yang merancang dan membangun ekosistem, alur logika, REST API, serta arsitektur UI/UX portal HSSE PT. Industri Nabati Lestari.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 mt-6 relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[10px] text-blue-200">
              <ShieldCheck size={12} />
              <span>Verified Developer Identity</span>
            </div>
            <p className="text-[10px] text-white/50">
              Copyright &copy; {new Date().getFullYear()} INL. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
