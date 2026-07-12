'use client';

import AboutTab from '@/components/settings/AboutTab';
import { Info } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto pt-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center shadow-sm">
            <Info size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Tentang Aplikasi</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Informasi versi dan kredit aplikasi</p>
          </div>
        </div>
        <AboutTab />
      </div>
    </div>
  );
}
