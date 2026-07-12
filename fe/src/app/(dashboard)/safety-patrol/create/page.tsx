'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSafetyPatrol } from '@/lib/api/safetyPatrol';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import MasterSelect from '@/components/ui/MasterSelect';
import { toast } from 'react-toastify';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import PermitModal from '@/components/permit/PermitModal';
import CameraCapture from '@/components/ui/CameraCapture';

interface PhotoItem { file: File; preview: string; }

const REACTIONS_ITEMS = [
  'Disiplin safety hanya karena atasan',
  'Melakukan pekerjaan dengan sembrono, jika tidak ada atasan',
  'Safety tidak menjadi bagian dari rutinitas pekerjaan',
  'Berpura-pura melakukan pekerjaan dengan aman',
  'Menghindari observator',
];

const PPE_ITEMS = [
  'Tidak/Menggunakan Safety Shoes',
  'Tidak/Menggunakan Helmet',
  'Tidak/Menggunakan Ear plug/ear muff',
  'Tidak/Menggunakan Face Shield',
  'Tidak/Menggunakan Safety Harness',
  'Tidak/Menggunakan Masker Debu/Masker Gas',
  'Tidak/Menggunakan Sarung tangan',
];

const POSITION_ITEMS = [
  'Berada pada lokasi temperature/tegangan tinggi',
  'Terhirup/Tertelan/Terserap oleh bahan kimia/berbahaya',
  'Melakukan pekerjaan yg terlalu keras',
  'Berada di antara/dalam objek yg tertutup/sumber bahaya',
  'Terlalu dekat dengan sumber api/bahaya',
];

const TOOLS_ITEMS = [
  'Cara penggunaan alat kerja yg salah',
  'Menggunakan Alat/peralatan yg salah',
  'Tidak sesuai dengan prosedur yg berlaku',
  'Mesin/peralatan yg digunakan dalam kondisi abnormal/emergency',
];

const PROCEDURE_ITEMS = [
  'Tidak memiliki prosedure',
  'Tidak mengetahui/memahami isi prosedure',
  'Tidak melakukan sesuai dengan prosedur yg berlaku',
  'Tidak perduli dengan kondisi housekeeping tempat kerja',
  'Tempat kerja berantakan dan kotor',
];

interface ChecklistCategory {
  key: string;
  title: string;
  items: string[];
}

const CATEGORIES: ChecklistCategory[] = [
  { key: 'reactions_of_people', title: 'A. Reactions of People', items: REACTIONS_ITEMS },
  { key: 'ppe', title: 'B. PPE (Alat Pelindung Diri)', items: PPE_ITEMS },
  { key: 'position_of_people', title: 'C. Position of People', items: POSITION_ITEMS },
  { key: 'tools_and_equipment', title: 'D. Tools and Equipment', items: TOOLS_ITEMS },
  { key: 'procedure_housekeeping', title: 'E. Procedure and Housekeeping', items: PROCEDURE_ITEMS },
];

export default function CreateSafetyPatrolPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { user } = useAuth();

  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [waktu, setWaktu] = useState(new Date().toTimeString().slice(0, 5));
  const [kategori, setKategori] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [observer, setObserver] = useState(user?.name || '');
  const [auditee, setAuditee] = useState('');
  const [leader, setLeader] = useState('');
  const [observasi, setObservasi] = useState('');
  const [perluTindakan, setPerluTindakan] = useState(false);
  const [tindakanPerbaikan, setTindakanPerbaikan] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [checklist, setChecklist] = useState<Record<string, Record<string, boolean>>>({});
  const [lainnya, setLainnya] = useState<Record<string, string>>({});

  const [showModal, setShowModal] = useState(true);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);

  const handleClose = () => { setShowModal(false); router.push('/safety-patrol'); };

  const createMut = useMutation({
    mutationFn: createSafetyPatrol,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['safety-patrols'] });
      qc.invalidateQueries({ queryKey: ['safety-patrol-status-counts'] });
      toast.success('Safety patrol berhasil dibuat!');
      router.push('/safety-patrol');
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Gagal membuat laporan'),
  });

  const toggleCheck = (catKey: string, item: string) => {
    setChecklist(prev => ({
      ...prev,
      [catKey]: { ...(prev[catKey] || {}), [item]: !(prev[catKey]?.[item] || false) },
    }));
  };



  const buildObservationData = () => {
    const data: Record<string, any> = {};
    CATEGORIES.forEach(cat => {
      const items = cat.items
        .filter(item => checklist[cat.key]?.[item])
        .map(item => ({ label: item, checked: true }));
      if (items.length > 0 || lainnya[cat.key]) {
        data[cat.key] = { items };
        if (lainnya[cat.key]) data[cat.key].lainnya = lainnya[cat.key];
      }
    });
    data.observasi = observasi;
    data.perlu_tindakan = perluTindakan;
    return data;
  };

  const handleSubmit = () => {
    const fd = new FormData();
    fd.append('tanggal', tanggal);
    fd.append('waktu', waktu);
    fd.append('kategori', kategori);
    fd.append('lokasi', lokasi);
    fd.append('observer', observer);
    fd.append('auditee', auditee);
    fd.append('leader', leader);
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
      title="Buat Laporan Safety Patrol"
      docNo="Safety Patrol Observation"
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Info Panel */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="text-[10px] font-bold text-blue-600">01</span>
            </div>
            Informasi Patrol
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
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Kategori Patrol</label>
              <MasterSelect masterType="kategori-patrol" value={kategori} onChange={setKategori} placeholder="Pilih kategori..." />
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
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Leader</label>
              <input type="text" value={leader} onChange={e => setLeader(e.target.value)} className="hse-input text-sm" placeholder="Nama leader" />
            </div>
          </div>
        </div>

        {/* Observation Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* LEFT: Checklist Categories */}
          <div className="lg:col-span-3 space-y-4">
            {CATEGORIES.map(cat => {
              const catChecklist = checklist[cat.key] || {};
              const checkedCount = Object.values(catChecklist).filter(Boolean).length;
              return (
                <div key={cat.key} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{cat.title}</h4>
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">{checkedCount}/{cat.items.length}</span>
                  </div>
                  <div className="space-y-1">
                    {cat.items.map(item => (
                      <Checkbox
                        key={item}
                        checked={!!catChecklist[item]}
                        onChange={() => toggleCheck(cat.key, item)}
                        label={item}
                        size="sm"
                      />
                    ))}
                  </div>
                  <div className="mt-2">
                    <label className="text-[10px] text-gray-400">Kondisi lainnya:</label>
                    <input type="text" value={lainnya[cat.key] || ''} onChange={e => setLainnya(prev => ({ ...prev, [cat.key]: e.target.value }))} className="hse-input text-xs mt-1" placeholder="Lainnya..." />
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Observation Report */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Observation Report</h4>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Observasi</label>
                <textarea value={observasi} onChange={e => setObservasi(e.target.value)} className="hse-input min-h-[100px] text-sm" placeholder="Deskripsi hasil observasi..." />
              </div>
              <Checkbox
                checked={perluTindakan}
                onChange={setPerluTindakan}
                label="Apakah membutuhkan tindakan perbaikan?"
                size="sm"
              />
              {perluTindakan && (
                <>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Tindakan Perbaikan</label>
                    <textarea value={tindakanPerbaikan} onChange={e => setTindakanPerbaikan(e.target.value)} className="hse-input min-h-[80px] text-sm" placeholder="Deskripsi tindakan perbaikan..." />
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

            {/* Tanda Tangan Digital */}
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
                    <span className="text-xs font-bold text-green-600">L</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800 dark:text-white">Leader: <span className="font-normal text-gray-500">{leader || '-'}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 z-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 -mx-3 sm:-mx-6 -mb-3 sm:-mb-6 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between mt-4 rounded-b-2xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_-8px_30px_rgb(0,0,0,0.2)]">
        <Button variant="outline" size="sm" onClick={handleClose}>
          <ArrowLeft size={16} /> Batal
        </Button>
        <Button size="sm" onClick={handleSubmit} isLoading={createMut.isPending} disabled={!lokasi || !tanggal}>
          <Send size={16} /> Submit ke Admin
        </Button>
      </div>
    </PermitModal>
  );
}
