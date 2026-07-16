'use client';
import { useState, useEffect, useMemo } from 'react';
import Button from '@/components/ui/Button';
import { Save, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ManHoursFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  title: string;
}

export default function ManHoursForm({ initialData, onSubmit, isLoading, title }: ManHoursFormProps) {
  const router = useRouter();
  
  const currentYear = new Date().getFullYear().toString();
  const [tahun, setTahun] = useState(currentYear);
  const [bulan, setBulan] = useState('Januari');
  
  const [manpowerInl, setManpowerInl] = useState('0');
  const [manpowerKontraktor, setManpowerKontraktor] = useState('0');
  const [manpowerOutsourcing, setManpowerOutsourcing] = useState('0');
  
  const [normalJamInl, setNormalJamInl] = useState('0');
  const [normalJamKontraktor, setNormalJamKontraktor] = useState('0');
  const [normalJamOutsourcing, setNormalJamOutsourcing] = useState('0');
  
  const [overtimeInl, setOvertimeInl] = useState('0');
  const [overtimeKontraktor, setOvertimeKontraktor] = useState('0');
  const [overtimeOutsourcing, setOvertimeOutsourcing] = useState('0');
  
  const [cutiSakit, setCutiSakit] = useState('0');

  useEffect(() => {
    if (initialData) {
      setTahun(initialData.tahun || currentYear);
      setBulan(initialData.bulan || 'Januari');
      
      setManpowerInl(String(initialData.manpower_inl || 0));
      setManpowerKontraktor(String(initialData.manpower_kontraktor || 0));
      setManpowerOutsourcing(String(initialData.manpower_outsourcing || 0));
      
      setNormalJamInl(String(initialData.normal_jam_inl || 0));
      setNormalJamKontraktor(String(initialData.normal_jam_kontraktor || 0));
      setNormalJamOutsourcing(String(initialData.normal_jam_outsourcing || 0));
      
      setOvertimeInl(String(initialData.overtime_inl || 0));
      setOvertimeKontraktor(String(initialData.overtime_kontraktor || 0));
      setOvertimeOutsourcing(String(initialData.overtime_outsourcing || 0));
      
      setCutiSakit(String(initialData.cuti_sakit || 0));
    }
  }, [initialData, currentYear]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      tahun,
      bulan,
      manpower_inl: Number(manpowerInl),
      manpower_kontraktor: Number(manpowerKontraktor),
      manpower_outsourcing: Number(manpowerOutsourcing),
      normal_jam_inl: Number(normalJamInl),
      normal_jam_kontraktor: Number(normalJamKontraktor),
      normal_jam_outsourcing: Number(normalJamOutsourcing),
      overtime_inl: Number(overtimeInl),
      overtime_kontraktor: Number(overtimeKontraktor),
      overtime_outsourcing: Number(overtimeOutsourcing),
      cuti_sakit: Number(cutiSakit)
    });
  };

  const years = useMemo(() => {
    const ys = [];
    const cy = parseInt(currentYear);
    for (let i = 2018; i <= cy + 1; i++) {
      ys.push(i.toString());
    }
    const reversed = ys.reverse();
    return ["2018-2025", ...reversed];
  }, [currentYear]);

  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push('/man-hours')}
          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="Kembali"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-850 dark:text-white">{title}</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Input data rekapitulasi man hours bulanan berdasarkan klasifikasi.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                Tahun <span className="text-red-500">*</span>
              </label>
              <select
                value={tahun}
                onChange={e => setTahun(e.target.value)}
                className="hse-input text-sm w-full"
                required
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                Bulan <span className="text-red-500">*</span>
              </label>
              <select
                value={bulan}
                onChange={e => setBulan(e.target.value)}
                className="hse-input text-sm w-full"
                required
              >
                {months.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Man Power */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-indigo-600 border-b border-indigo-100 dark:border-indigo-900 pb-2">Man Power (Orang)</h3>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">INL</label>
                <input type="number" min="0" value={manpowerInl} onChange={e => setManpowerInl(e.target.value)} className="hse-input text-sm w-full" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Kontraktor</label>
                <input type="number" min="0" value={manpowerKontraktor} onChange={e => setManpowerKontraktor(e.target.value)} className="hse-input text-sm w-full" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Outsourcing</label>
                <input type="number" min="0" value={manpowerOutsourcing} onChange={e => setManpowerOutsourcing(e.target.value)} className="hse-input text-sm w-full" required />
              </div>
            </div>

            {/* Normal Jam Kerja */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-indigo-600 border-b border-indigo-100 dark:border-indigo-900 pb-2">Normal Jam Kerja (Jam)</h3>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">INL</label>
                <input type="number" min="0" step="any" value={normalJamInl} onChange={e => setNormalJamInl(e.target.value)} className="hse-input text-sm w-full" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Kontraktor</label>
                <input type="number" min="0" step="any" value={normalJamKontraktor} onChange={e => setNormalJamKontraktor(e.target.value)} className="hse-input text-sm w-full" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Outsourcing</label>
                <input type="number" min="0" step="any" value={normalJamOutsourcing} onChange={e => setNormalJamOutsourcing(e.target.value)} className="hse-input text-sm w-full" required />
              </div>
            </div>

            {/* Overtime */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-indigo-600 border-b border-indigo-100 dark:border-indigo-900 pb-2">Overtime (Jam)</h3>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">INL</label>
                <input type="number" min="0" step="any" value={overtimeInl} onChange={e => setOvertimeInl(e.target.value)} className="hse-input text-sm w-full" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Kontraktor</label>
                <input type="number" min="0" step="any" value={overtimeKontraktor} onChange={e => setOvertimeKontraktor(e.target.value)} className="hse-input text-sm w-full" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Outsourcing</label>
                <input type="number" min="0" step="any" value={overtimeOutsourcing} onChange={e => setOvertimeOutsourcing(e.target.value)} className="hse-input text-sm w-full" required />
              </div>
            </div>

          </div>

          <div className="pt-4 mt-6 border-t border-gray-100 dark:border-gray-800 max-w-sm">
             <div className="bg-rose-50 dark:bg-rose-900/10 p-4 rounded-xl border border-rose-100 dark:border-rose-900/30">
                <h3 className="font-bold text-sm text-rose-600 dark:text-rose-400 mb-3">Hari Hilang (Cuti / Sakit)</h3>
                <div>
                  <label className="block text-xs text-rose-500 dark:text-rose-400/80 mb-1">Total Jam Cuti & Sakit</label>
                  <input type="number" min="0" step="any" value={cutiSakit} onChange={e => setCutiSakit(e.target.value)} className="hse-input text-sm w-full border-rose-200 focus:border-rose-500 focus:ring-rose-500" required />
                </div>
             </div>
          </div>

          {/* Form Submit Footer */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-150 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/man-hours')}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/25"
            >
              <Save size={16} /> Simpan Rekap
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
