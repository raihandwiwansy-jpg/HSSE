'use client';

import { PermitJenis } from '@/types';
import { FileText, Flame, Shield, Zap, Mountain, ArrowUpDown, Radio, ArrowUp } from 'lucide-react';

interface PermitTypeSelectorProps {
  selected: PermitJenis | null;
  onSelect: (jenis: PermitJenis) => void;
}

const permitTypes: { jenis: PermitJenis; label: string; shortLabel: string; icon: React.ReactNode; color: string; desc: string; docNo: string }[] = [
  { jenis: 'gwp', label: 'General Work Permit', shortLabel: 'GWP', icon: <FileText size={24} />, color: 'bg-blue-500', desc: 'General Work', docNo: 'FM-BSHS-19/01' },
  { jenis: 'hwp', label: 'Hot Work Permit', shortLabel: 'HWP', icon: <Flame size={24} />, color: 'bg-orange-500', desc: 'Hot Work', docNo: 'FM-BSHS-19/03' },
  { jenis: 'cse', label: 'Confined Space Entry', shortLabel: 'CSE', icon: <Shield size={24} />, color: 'bg-purple-500', desc: 'Confined Space', docNo: 'FM-BSHS-19/02' },
  { jenis: 'elp', label: 'Electrical Work Permit', shortLabel: 'ELP', icon: <Zap size={24} />, color: 'bg-yellow-500', desc: 'Electrical', docNo: 'FM-BSHS-19/05' },
  { jenis: 'ewp', label: 'Excavation Work Permit', shortLabel: 'EWP', icon: <Mountain size={24} />, color: 'bg-amber-600', desc: 'Excavation', docNo: 'FM-BSHS-19/06' },
  { jenis: 'lwp', label: 'Lifting Work Permit', shortLabel: 'LWP', icon: <ArrowUpDown size={24} />, color: 'bg-teal-500', desc: 'Lifting', docNo: 'FM-BSHS-19/07' },
  { jenis: 'rwp', label: 'Radiography Work Permit', shortLabel: 'RWP', icon: <Radio size={24} />, color: 'bg-red-600', desc: 'Radiography', docNo: 'FM-BSHS-19/08' },
  { jenis: 'whp', label: 'Work at Height Permit', shortLabel: 'WHP', icon: <ArrowUp size={24} />, color: 'bg-indigo-500', desc: 'Work at Height', docNo: 'FM-BSHS-19/04' },
];

export default function PermitTypeSelector({ selected, onSelect }: PermitTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Pilih Jenis Izin Kerja:</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {permitTypes.map((type) => (
          <button
            key={type.jenis}
            type="button"
            onClick={() => onSelect(type.jenis)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-200 text-left
              ${selected === type.jenis
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
              }
            `}
          >
            <div className={`w-10 h-10 rounded-lg ${type.color} text-white flex items-center justify-center mb-2`}>
              {type.icon}
            </div>
            <p className="font-bold text-sm text-gray-800 dark:text-white">{type.shortLabel}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{type.desc}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{type.docNo}</p>
            {selected === type.jenis && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
