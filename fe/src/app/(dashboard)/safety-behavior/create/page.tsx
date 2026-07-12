'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSafetyBehavior } from '@/lib/api/safetyBehavior';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { toast } from 'react-toastify';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import PermitModal from '@/components/permit/PermitModal';
import MasterSelect from '@/components/ui/MasterSelect';
import CameraCapture from '@/components/ui/CameraCapture';

interface PhotoItem { file: File; preview: string; }

// ============================================================
// DATA FROM EXCEL: Safety Behavior Observation.xls
// ============================================================

const PPE_ITEMS = [
  'Tidak/Menggunakan Safety Shoes',
  'Tidak/Menggunakan Helmet',
  'Tidak/Menggunakan Tali dagu',
  'Tidak/Menggunakan Ear plug/ear muff',
  'Tidak/Menggunakan Face Shield',
  'Tidak/Menggunakan Safety Harness',
  'Tidak/Menggunakan Masker Debu/Masker Gas',
  'Tidak/Menggunakan Sarung tangan',
  'Tidak/Menggunakan APD yg sudah dipersyaratkan',
];

const POSITION_ITEMS = [
  'Berada pada lokasi temperature/tegangan tinggi*',
  'Terhirup/Tertelan/Terserap oleh bahan kimia/berbahaya*',
  'Melakukan pekerjaan yg terlalu keras',
  'Berada di antara/dalam objek yg tertutup/sumber bahaya*',
  'Terlalu dekat dengan sumber api/bahaya',
];

const TOOLS_ITEMS = [
  'Cara penggunaan alat kerja yg salah',
  'Menggunakan Alat/peralatan yg salah',
  'Tidak sesuai dengan prosedur yg berlaku',
  'Mesin/peralatan yg digunakan dalam kondisi abnormal/emergency',
];

const HOUSEKEEPING_ITEMS = [
  'Sampah berserakan / Sampah dikumpulkan Rapi',
  'Tidak /Banyak debu diarea kerja',
  'Tidak melakukan sesuai dengan prosedur yg berlaku',
  'Tidak perduli dengan kondisi housekeeping tempat kerja',
  'Tidak/Tempat kerja berantakan dan kotor',
];

const ENVIRONMENT_ITEMS = [
  'Tidak/Mencegah tumpahan kimia/limbah',
  'Tidak/Melakukan pembersihan tumpahan',
  'Tidak/ Menangani tumpahan',
];

const NEARMISS_ITEMS = [
  'Hampir kena timpa benda lain',
  'Hampir terjatuh ke dalam lubang terbuka',
  'Hampir masuk kedalam mesin produksi',
];

const SWA_ITEMS = [
  'Bekerja tidak mengunakan Prosedur',
  'Membahayakan pekerja / mesin/Equipment',
  'Terkena tumpahan bahan kimia',
];

interface CategoryConfig {
  key: string;
  title: string;
  items: string[];
  hasLainnya?: boolean;
}

const CATEGORIES: CategoryConfig[] = [
  { key: 'ppe', title: 'A. PPE (Personal Protection Equipment)', items: PPE_ITEMS, hasLainnya: true },
  { key: 'position_of_people', title: 'B. Position Of People (Posisi Kerja Orang)', items: POSITION_ITEMS, hasLainnya: true },
  { key: 'tools_and_equipment', title: 'C. Tools and Equipment', items: TOOLS_ITEMS, hasLainnya: true },
  { key: 'housekeeping', title: 'D. Housekeeping', items: HOUSEKEEPING_ITEMS },
  { key: 'environment', title: 'E. Environment', items: ENVIRONMENT_ITEMS, hasLainnya: true },
  { key: 'nearmiss', title: 'F. Nearmiss (Hampir Celaka)', items: NEARMISS_ITEMS, hasLainnya: true },
  { key: 'swa', title: 'G. SWA (Stop Work Authority)', items: SWA_ITEMS },
];

export default function CreateSafetyBehaviorPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { user } = useAuth();

  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [waktu, setWaktu] = useState(new Date().toTimeString().slice(0, 5));
  const [lokasi, setLokasi] = useState('');
  const [observer, setObserver] = useState(user?.name || '');
  const [auditee, setAuditee] = useState('');
  const [kasubag, setKasubag] = useState('');

  // Safe/At-Risk for each item
  const [nilai, setNilai] = useState<Record<string, Record<string, 'safe' | 'at_risk'>>>({});
  const [lainnya, setLainnya] = useState<Record<string, string>>({});

  // Right panel
  const [kategoriPerilaku, setKategoriPerilaku] = useState<'safe' | 'at_risk' | ''>('');
  const [aktivitas, setAktivitas] = useState('');
  const [observasiPerilaku, setObservasiPerilaku] = useState('');
  const [alasanBeresiko, setAlasanBeresiko] = useState('');
  const [perluTindakan, setPerluTindakan] = useState(false);
  const [tindakanPerbaikan, setTindakanPerbaikan] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [showModal, setShowModal] = useState(true);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);

  const handleClose = () => router.push('/safety-behavior');

  const createMut = useMutation({
    mutationFn: createSafetyBehavior,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['safety-behaviors'] });
      qc.invalidateQueries({ queryKey: ['safety-behavior-status-counts'] });
      toast.success('Safety behavior berhasil dibuat!');
      router.push('/safety-behavior');
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Gagal membuat laporan'),
  });

  const setItemValue = (catKey: string, item: string, val: 'safe' | 'at_risk') => {
    setNilai(prev => ({
      ...prev,
      [catKey]: { ...(prev[catKey] || {}), [item]: val },
    }));
  };



  const buildObservationData = () => {
    const data: Record<string, any> = {};
    CATEGORIES.forEach(cat => {
      const items = cat.items
        .filter(item => nilai[cat.key]?.[item])
        .map(item => ({ label: item, value: nilai[cat.key][item] }));
      if (items.length > 0 || lainnya[cat.key]) {
        data[cat.key] = { items };
        if (lainnya[cat.key]) data[cat.key].lainnya = lainnya[cat.key];
      }
    });
    if (kategoriPerilaku) data.kategori_perilaku = kategoriPerilaku;
    data.aktivitas = aktivitas;
    data.observasi_perilaku = observasiPerilaku;
    data.alasan_beresiko = alasanBeresiko;
    data.perlu_tindakan = perluTindakan;
    return data;
  };

  const handleSubmit = () => {
    const fd = new FormData();
    fd.append('tanggal', tanggal);
    fd.append('waktu', waktu);
    fd.append('lokasi', lokasi);
    fd.append('observer', observer);
    fd.append('auditee', auditee);
    fd.append('kasubag', kasubag);
    fd.append('observation_data', JSON.stringify(buildObservationData()));
    if (perluTindakan && tindakanPerbaikan) fd.append('tindakan_perbaikan', tindakanPerbaikan);
    if (dueDate) fd.append('due_date', dueDate);
    photos.forEach(p => fd.append('foto[]', p.file));

    createMut.mutate(fd);
  };

  return (
    <PermitModal
      isOpen={showModal}
      onClose={handleClose}
      title="Buat Safety Behavior Observation"
      docNo="FM-BSHS-17/01"
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Info Panel */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="text-[10px] font-bold text-blue-600">01</span>
            </div>
            Informasi Observasi
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Tanggal *</label>
              <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} className="hse-input text-sm" />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Waktu</label>
              <input type="time" value={waktu} onChange={e => setWaktu(e.target.value)} className="hse-input text-sm" />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Observer</label>
              <input type="text" value={observer} onChange={e => setObserver(e.target.value)} className="hse-input text-sm" placeholder="Nama observer" />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Auditee</label>
              <input type="text" value={auditee} onChange={e => setAuditee(e.target.value)} className="hse-input text-sm" placeholder="Nama auditee" />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Lokasi *</label>
              <MasterSelect masterType="lokasi" value={lokasi} onChange={setLokasi} placeholder="Pilih lokasi..." />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Kasubag Sistem & IT</label>
              <input type="text" value={kasubag} onChange={e => setKasubag(e.target.value)} className="hse-input text-sm" placeholder="Nama kasubag" />
            </div>
          </div>
        </div>

        {/* Observation Checklist + Report */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* LEFT: Checklist Categories */}
          <div className="lg:col-span-3 space-y-4">
            {CATEGORIES.map(cat => {
              const catNilai = nilai[cat.key] || {};
              const safeCount = Object.values(catNilai).filter(v => v === 'safe').length;
              const atRiskCount = Object.values(catNilai).filter(v => v === 'at_risk').length;
              return (
                <div key={cat.key} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{cat.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Safe {safeCount}</span>
                      <span className="text-[10px] font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full">At-Risk {atRiskCount}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {cat.items.map(item => (
                      <div key={item} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <span className="text-xs text-gray-700 dark:text-gray-300 flex-1">{item}</span>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => setItemValue(cat.key, item, 'safe')}
                            className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all ${catNilai[item] === 'safe' ? 'bg-green-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-green-100 dark:hover:bg-green-900/30'}`}>
                            Safe
                          </button>
                          <button type="button" onClick={() => setItemValue(cat.key, item, 'at_risk')}
                            className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all ${catNilai[item] === 'at_risk' ? 'bg-red-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30'}`}>
                            At-Risk
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {cat.hasLainnya && (
                    <div className="mt-2">
                      <label className="text-[10px] text-gray-400">Kondisi lainnya:</label>
                      <input type="text" value={lainnya[cat.key] || ''} onChange={e => setLainnya(prev => ({ ...prev, [cat.key]: e.target.value }))} className="hse-input text-xs mt-1" placeholder="Lainnya..." />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT: Observation Report */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Observation Report</h4>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Kategori Perilaku</label>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setKategoriPerilaku('safe')}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${kategoriPerilaku === 'safe' ? 'bg-green-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-green-100'}`}>
                    Safe
                  </button>
                  <button type="button" onClick={() => setKategoriPerilaku('at_risk')}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${kategoriPerilaku === 'at_risk' ? 'bg-red-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-red-100'}`}>
                    At-Risk
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Jelaskan aktifitas yang dilakukan</label>
                <textarea value={aktivitas} onChange={e => setAktivitas(e.target.value)} className="hse-input min-h-[60px] text-sm" placeholder="Aktifitas yang diamati..." />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Observasi perilaku aman atau beresiko</label>
                <textarea value={observasiPerilaku} onChange={e => setObservasiPerilaku(e.target.value)} className="hse-input min-h-[60px] text-sm" placeholder="Deskripsi perilaku yang diamati..." />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Mengapa perilaku beresiko dilakukan</label>
                <textarea value={alasanBeresiko} onChange={e => setAlasanBeresiko(e.target.value)} className="hse-input min-h-[60px] text-sm" placeholder="Alasan mengapa perilaku beresiko terjadi..." />
              </div>

              <Checkbox checked={perluTindakan} onChange={setPerluTindakan} label="Apakah membutuhkan tindakan perbaikan?" size="sm" />

              {perluTindakan && (
                <>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Tindakan Perbaikan</label>
                    <textarea value={tindakanPerbaikan} onChange={e => setTindakanPerbaikan(e.target.value)} className="hse-input min-h-[60px] text-sm" placeholder="Deskripsi tindakan perbaikan..." />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Due Date</label>
                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="hse-input text-sm" />
                  </div>
                </>
              )}
            </div>

            {/* Foto Upload */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Dokumentasi Foto</h4>
              <CameraCapture photos={photos} onChange={setPhotos} maxPhotos={10} />
            </div>

            {/* Pengesahan */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Pengesahan</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">O</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800 dark:text-white">Observer: <span className="font-normal text-gray-500">{observer || '-'}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <span className="text-xs font-bold text-amber-600">A</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800 dark:text-white">Auditee: <span className="font-normal text-gray-500">{auditee || '-'}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <span className="text-xs font-bold text-green-600">K</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800 dark:text-white">Kasubag Sistem & IT: <span className="font-normal text-gray-500">{kasubag || '-'}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 z-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 -mx-3 sm:-mx-6 -mb-3 sm:-mb-6 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between mt-4 rounded-b-2xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_-8px_30px_rgb(0,0,0,0.2)]">
        <Button variant="outline" size="sm" onClick={handleClose}><ArrowLeft size={16} /> Batal</Button>
        <Button size="sm" onClick={handleSubmit} isLoading={createMut.isPending} disabled={!lokasi || !tanggal}><Send size={16} /> Submit ke Admin</Button>
      </div>
    </PermitModal>
  );
}
