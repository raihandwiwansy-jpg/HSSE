'use client';

import { useState } from 'react';
import {
  Building2, Building, Users, Wrench, AlertTriangle, Activity,
  ClipboardCheck, Clock, Shield, Eye, MapPin,
} from 'lucide-react';
import MasterDataTable from '@/components/master-data/MasterDataTable';
import MasterFieldsConfig from '@/components/master-data/MasterFieldsConfig';

const referensiTypes = [
  { key: 'departemen', label: 'Departemen', icon: Building2, desc: 'Data departemen / bagian' },
  { key: 'perusahaan', label: 'Perusahaan', icon: Building, desc: 'Data perusahaan / kontraktor' },
  { key: 'personil', label: 'Personil', icon: Users, desc: 'Data personil / petugas' },
  { key: 'peralatan', label: 'Peralatan', icon: Wrench, desc: 'Data peralatan / alat kerja' },
  { key: 'bahaya', label: 'Bahaya', icon: AlertTriangle, desc: 'Identifikasi bahaya' },
  { key: 'risiko', label: 'Risiko', icon: Activity, desc: 'Penilaian risiko' },
  { key: 'checklist', label: 'Checklist', icon: ClipboardCheck, desc: 'Item checklist per permit' },
  { key: 'shift', label: 'Shift', icon: Clock, desc: 'Data shift kerja' },
  { key: 'kategori-patrol', label: 'Kategori Patrol', icon: Eye, desc: 'Kategori safety patrol' },
  { key: 'kategori-perilaku', label: 'Kategori Perilaku', icon: Activity, desc: 'Kategori safety behavior' },
  { key: 'lokasi', label: 'Lokasi', icon: MapPin, desc: 'Area / lokasi kerja' },
  { key: 'apd', label: 'APD', icon: Shield, desc: 'Alat pelindung diri' },
];

export default function MasterReferensiTab() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showFieldsConfig, setShowFieldsConfig] = useState(false);

  if (showFieldsConfig) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowFieldsConfig(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l-7-7 7-7M5 12h14"/></svg>
          </button>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Konfigurasi Field Permit</h3>
            <p className="text-sm text-gray-500">Atur field yang muncul di setiap form permit</p>
          </div>
        </div>
        <MasterFieldsConfig />
      </div>
    );
  }

  if (selectedType) {
    const info = referensiTypes.find(t => t.key === selectedType);
    return (
      <div className="animate-fade-in-up">
        <MasterDataTable
          type={selectedType}
          onBack={() => setSelectedType(null)}
          title={info?.label}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Data Referensi</h3>
          <p className="text-sm text-gray-500 mt-0.5">Kelola referensi data untuk dropdown dan pilihan di form</p>
        </div>
        <button
          onClick={() => setShowFieldsConfig(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl hover:from-blue-500 hover:to-violet-500 transition-all shadow-sm shadow-blue-500/10"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          Konfigurasi Field
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {referensiTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.key}
              onClick={() => setSelectedType(type.key)}
              className="flex items-center gap-4 p-5 bg-white dark:bg-[#12121E] rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md hover:shadow-blue-500/5 transition-all text-left group"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                <Icon size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{type.label}</h4>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{type.desc}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors shrink-0">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}
