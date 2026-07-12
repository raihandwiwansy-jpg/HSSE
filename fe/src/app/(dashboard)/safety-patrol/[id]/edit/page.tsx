'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSafetyPatrolById, updateSafetyPatrol } from '@/lib/api/safetyPatrol';
import axios from '@/lib/axios';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Select from '@/components/ui/Select';
import { toast } from 'react-toastify';
import { ArrowLeft, Save, Camera, Trash2 } from 'lucide-react';
import WifiLoader from '@/components/ui/WifiLoader';
import PermitModal from '@/components/permit/PermitModal';

const REACTIONS_ITEMS = [
  'Disiplin safety hanya karena atasan',
  'Melakukan pekerjaan dengan sembrono, jika tidak ada atasan',
  'Safety tidak menjadi bagian dari rutinitas pekerjaan',
  'Berpura-pura melakukan pekerjaan dengan aman',
  'Menghindari observator',
];
const PPE_ITEMS = [
  'Tidak/Menggunakan Safety Shoes', 'Tidak/Menggunakan Helmet', 'Tidak/Menggunakan Ear plug/ear muff',
  'Tidak/Menggunakan Face Shield', 'Tidak/Menggunakan Safety Harness', 'Tidak/Menggunakan Masker Debu/Masker Gas',
  'Tidak/Menggunakan Sarung tangan',
];
const POSITION_ITEMS = [
  'Berada pada lokasi temperature/tegangan tinggi', 'Terhirup/Tertelan/Terserap oleh bahan kimia/berbahaya',
  'Melakukan pekerjaan yg terlalu keras', 'Berada di antara/dalam objek yg tertutup/sumber bahaya',
  'Terlalu dekat dengan sumber api/bahaya',
];
const TOOLS_ITEMS = [
  'Cara penggunaan alat kerja yg salah', 'Menggunakan Alat/peralatan yg salah',
  'Tidak sesuai dengan prosedur yg berlaku', 'Mesin/peralatan yg digunakan dalam kondisi abnormal/emergency',
];
const PROCEDURE_ITEMS = [
  'Tidak memiliki prosedure', 'Tidak mengetahui/memahami isi prosedure',
  'Tidak melakukan sesuai dengan prosedur yg berlaku', 'Tidak perduli dengan kondisi housekeeping tempat kerja',
  'Tempat kerja berantakan dan kotor',
];

interface ChecklistCategory { key: string; title: string; items: string[] }
const CATEGORIES: ChecklistCategory[] = [
  { key: 'reactions_of_people', title: 'A. Reactions of People', items: REACTIONS_ITEMS },
  { key: 'ppe', title: 'B. PPE (Alat Pelindung Diri)', items: PPE_ITEMS },
  { key: 'position_of_people', title: 'C. Position of People', items: POSITION_ITEMS },
  { key: 'tools_and_equipment', title: 'D. Tools and Equipment', items: TOOLS_ITEMS },
  { key: 'procedure_housekeeping', title: 'E. Procedure and Housekeeping', items: PROCEDURE_ITEMS },
];

export default function EditSafetyPatrolPage() {
  const params = useParams();
  const router = useRouter();
  const qc = useQueryClient();

  const [tanggal, setTanggal] = useState('');
  const [waktu, setWaktu] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [observer, setObserver] = useState('');
  const [auditee, setAuditee] = useState('');
  const [leader, setLeader] = useState('');
  const [observasi, setObservasi] = useState('');
  const [perluTindakan, setPerluTindakan] = useState(false);
  const [tindakanPerbaikan, setTindakanPerbaikan] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [checklist, setChecklist] = useState<Record<string, Record<string, boolean>>>({});
  const [lainnya, setLainnya] = useState<Record<string, string>>({});
  const [fotoFiles, setFotoFiles] = useState<File[]>([]);
  const [fotoPreview, setFotoPreview] = useState<string[]>([]);
  const [existingFoto, setExistingFoto] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  const { data: pData, isLoading } = useQuery({
    queryKey: ['safety-patrol', params.id],
    queryFn: () => getSafetyPatrolById(Number(params.id)),
  });
  const p = pData?.data?.data;

  const { data: locations, isLoading: isLoadingLoc } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const res = await axios.get('/locations');
      return res.data;
    }
  });

  const locationOptions = locations?.map((l: any) => ({ value: l.name, label: l.name })) || [];

  useEffect(() => {
    if (p) {
      setTanggal(p.tanggal);
      setWaktu(p.waktu || '');
      setLokasi(p.lokasi);
      setObserver(p.observer || '');
      setAuditee(p.auditee || '');
      setLeader(p.leader || '');
      setExistingFoto(p.foto || []);

      const od = p.observation_data || {};
      setObservasi((od as any).observasi || '');
      setPerluTindakan((od as any).perlu_tindakan || false);
      setTindakanPerbaikan(p.tindakan_perbaikan || '');
      setDueDate(p.due_date || '');

      const chk: Record<string, Record<string, boolean>> = {};
      const lny: Record<string, string> = {};
      CATEGORIES.forEach(cat => {
        const catData = (od as any)[cat.key];
        if (catData) {
          const items: Record<string, boolean> = {};
          (catData.items || []).forEach((item: any) => {
            items[item.label || item] = true;
          });
          if (Object.keys(items).length > 0) chk[cat.key] = items;
          if (catData.lainnya) lny[cat.key] = catData.lainnya;
        }
      });
      setChecklist(chk);
      setLainnya(lny);
      setShowModal(true);
    }
  }, [p]);

  const updateMut = useMutation({
    mutationFn: (formData: FormData) => updateSafetyPatrol(Number(params.id), formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['safety-patrols'] });
      qc.invalidateQueries({ queryKey: ['safety-patrol-status-counts'] });
      toast.success('Safety patrol berhasil diupdate!');
      router.push(`/safety-patrol/${params.id}`);
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Gagal update'),
  });

  const handleClose = () => { setShowModal(false); router.back(); };

  const toggleCheck = (catKey: string, item: string) => {
    setChecklist(prev => ({
      ...prev,
      [catKey]: { ...(prev[catKey] || {}), [item]: !(prev[catKey]?.[item] || false) },
    }));
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFotoFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        const t = ev.target; if (t && t.result) setFotoPreview(prev => [...prev, t.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewFoto = (idx: number) => {
    setFotoFiles(prev => prev.filter((_, i) => i !== idx));
    setFotoPreview(prev => prev.filter((_, i) => i !== idx));
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

  const handleSave = () => {
    const fd = new FormData();
    fd.append('tanggal', tanggal);
    if (waktu) fd.append('waktu', waktu);
    fd.append('lokasi', lokasi);
    fd.append('observer', observer);
    fd.append('auditee', auditee);
    fd.append('leader', leader);
    fd.append('observation_data', JSON.stringify(buildObservationData()));
    if (perluTindakan && tindakanPerbaikan) fd.append('tindakan_perbaikan', tindakanPerbaikan);
    if (dueDate) fd.append('due_date', dueDate);
    fotoFiles.forEach(f => fd.append('foto[]', f));

    updateMut.mutate(fd as FormData);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <WifiLoader text="Memuat data..." />
    </div>
  );

  if (!p || p.status !== 'menunggu') return (
    <div className="text-center py-16">
      <p className="text-gray-500 font-medium">Safety patrol tidak bisa diedit</p>
      <Button variant="outline" size="sm" onClick={() => router.back()}><ArrowLeft size={14} /> Kembali</Button>
    </div>
  );

  return (
    <PermitModal
      isOpen={showModal}
      onClose={handleClose}
      title="Edit Safety Patrol"
      docNo="Safety Patrol Observation"
    >
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Informasi Patrol</h3>
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
              <input type="text" value={observer} onChange={e => setObserver(e.target.value)} className="hse-input text-sm" />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Auditee</label>
              <input type="text" value={auditee} onChange={e => setAuditee(e.target.value)} className="hse-input text-sm" />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Lokasi *</label>
              <Select 
                options={locationOptions} 
                value={lokasi} 
                onChange={setLokasi} 
                placeholder={isLoadingLoc ? "Memuat lokasi..." : "Pilih Lokasi"} 
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Leader</label>
              <input type="text" value={leader} onChange={e => setLeader(e.target.value)} className="hse-input text-sm" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
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
                      <Checkbox key={item} checked={!!catChecklist[item]} onChange={() => toggleCheck(cat.key, item)} label={item} size="sm" />
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

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Observation Report</h4>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Observasi</label>
                <textarea value={observasi} onChange={e => setObservasi(e.target.value)} className="hse-input min-h-[100px] text-sm" placeholder="Deskripsi hasil observasi..." />
              </div>
              <Checkbox checked={perluTindakan} onChange={setPerluTindakan} label="Apakah membutuhkan tindakan perbaikan?" size="sm" />
              {perluTindakan && (
                <>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Tindakan Perbaikan</label>
                    <textarea value={tindakanPerbaikan} onChange={e => setTindakanPerbaikan(e.target.value)} className="hse-input min-h-[80px] text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Due Date</label>
                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="hse-input text-sm" />
                  </div>
                </>
              )}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Dokumentasi Foto</h4>
              {existingFoto.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {existingFoto.map((f, i) => (
                    <div key={i} className="relative">
                      <img src={`http://localhost:8000/storage/${f}`} alt={`Foto ${i + 1}`} className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600" />
                    </div>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                {fotoPreview.map((preview, idx) => (
                  <div key={idx} className="relative group">
                    <img src={preview} alt={`New ${idx + 1}`} className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600" />
                    <button onClick={() => removeNewFoto(idx)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                  <Camera size={20} className="text-gray-400 mb-1" />
                  <span className="text-[10px] text-gray-400">Tambah Foto</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleFotoChange} />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 -mx-3 sm:-mx-6 -mb-3 sm:-mb-6 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between mt-4 rounded-b-2xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_-8px_30px_rgb(0,0,0,0.2)]">
        <Button variant="outline" size="sm" onClick={handleClose}><ArrowLeft size={16} /> Batal</Button>
        <Button size="sm" onClick={handleSave} isLoading={updateMut.isPending} disabled={!lokasi || !tanggal}><Save size={16} /> Simpan</Button>
      </div>
    </PermitModal>
  );
}
