'use client';

import SecurityTab from '@/components/settings/SecurityTab';
import { KeyRound } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="max-w-4xl mx-auto pt-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm">
            <KeyRound size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Keamanan Akun</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Kelola password dan keamanan akun</p>
          </div>
        </div>
        <SecurityTab />
      </div>
    </div>
  );
}
