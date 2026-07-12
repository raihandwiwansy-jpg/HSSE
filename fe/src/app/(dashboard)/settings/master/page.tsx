'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import {
  Database, Users, Contact, ShieldCheck, MapPin, List,
} from 'lucide-react';
import MasterUsersTab from '@/components/settings/MasterUsersTab';
import MasterKaryawanTab from '@/components/settings/MasterKaryawanTab';
import MasterApdTab from '@/components/settings/MasterApdTab';
import MasterLokasiTab from '@/components/settings/MasterLokasiTab';
import MasterReferensiTab from '@/components/settings/MasterReferensiTab';

type MasterSub = 'users' | 'karyawan' | 'apd' | 'lokasi' | 'referensi';

const masterSubTabs = [
  { key: 'users' as MasterSub, label: 'Users', icon: <Users size={16} /> },
  { key: 'karyawan' as MasterSub, label: 'Karyawan', icon: <Contact size={16} /> },
  { key: 'apd' as MasterSub, label: 'APD', icon: <ShieldCheck size={16} /> },
  { key: 'lokasi' as MasterSub, label: 'Lokasi', icon: <MapPin size={16} /> },
  { key: 'referensi' as MasterSub, label: 'Referensi', icon: <List size={16} /> },
];

export default function MasterDataPage() {
  const { user, loading } = useAuth();
  const [activeMasterTab, setActiveMasterTab] = useState<MasterSub>('users');

  if (loading) return <div>Loading...</div>;

  if (!user || user.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="max-w-5xl mx-auto pt-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm">
            <Database size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Master Data</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Kelola data master untuk seluruh sistem</p>
          </div>
        </div>

        {/* Sub tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex gap-1 overflow-x-auto scrollbar-none -mb-px">
            {masterSubTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveMasterTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all shrink-0 ${
                  activeMasterTab === tab.key
                    ? 'border-blue-500 text-blue-700 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <span className={activeMasterTab === tab.key ? 'text-blue-500' : 'text-gray-400'}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          {activeMasterTab === 'users' && <MasterUsersTab />}
          {activeMasterTab === 'karyawan' && <MasterKaryawanTab />}
          {activeMasterTab === 'apd' && <MasterApdTab />}
          {activeMasterTab === 'lokasi' && <MasterLokasiTab />}
          {activeMasterTab === 'referensi' && <MasterReferensiTab />}
        </div>
      </div>
    </div>
  );
}
