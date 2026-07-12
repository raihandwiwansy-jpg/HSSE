'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSafetyBehaviorById, updateSafetyBehavior } from '@/lib/api/safetyBehavior';
import axios from '@/lib/axios';
import Button from '@/components/ui/Button';
import WifiLoader from '@/components/ui/WifiLoader';
import Select from '@/components/ui/Select';
import { toast } from 'react-toastify';
import { ArrowLeft, Save, Camera, Trash2 } from 'lucide-react';
import PermitModal from '@/components/permit/PermitModal';

const PPE_ITEMS = [
  'Tidak/Menggunakan Safety Shoes', 'Tidak/Menggunakan Helmet', 'Tidak/Menggunakan Tali dagu',
  'Tidak/Menggunakan Ear plug/ear muff', 'Tidak/Menggunakan Face Shield', 'Tidak/Menggunakan Safety Harness',
  'Tidak/Menggunakan Masker Debu/Masker Gas', 'Tidak/Menggunakan Sarung tangan', 'Tidak/Menggunakan APD yg sudah dipersyaratkan',
];
const POSITION_ITEMS = [
  'Berada pada lokasi temperature/tegangan tinggi*', 'Terhirup/Tertelan/Terserap oleh bahan kimia/berbahaya*',
  'Melakukan pekerjaan yg terlalu keras', 'Berada di antara/dalam objek yg tertutup/sumber bahaya*',
  'Terlalu dekat dengan sumber api/bahaya',
];
const TOOLS_ITEMS = [
  'Cara penggunaan alat kerja yg salah', 'Menggunakan Alat/peralatan yg salah',
  'Tidak sesuai dengan prosedur yg berlaku', 'Mesin/peralatan yg digunakan dalam kondisi abnormal/emergency',
];
const HOUSEKEEPING_ITEMS = [
  'Sampah berserakan / Sampah dikumpulkan Rapi', 'Tidak /Banyak debu diarea kerja',
  'Tidak melakukan sesuai dengan prosedur yg berlaku', 'Tidak perduli dengan kondisi housekeeping tempat kerja',
  'Tidak/Tempat kerja berantakan dan kotor',
];
const ENVIRONMENT_ITEMS = ['Tidak/Mencegah tumpahan kimia/limbah', 'Tidak/Melakukan pembersihan tumpahan', 'Tidak/ Menangani tumpahan'];
const NEARMISS_ITEMS = ['Hampir kena timpa benda lain', 'Hampir terjatuh ke dalam lubang terbuka', 'Hampir masuk kedalam mesin produksi'];
const SWA_ITEMS = ['Bekerja tidak mengunakan Prosedur', 'Membahayakan pekerja / mesin/Equipment', 'Terkena tumpahan bahan kimia'];

interface CategoryConfig { key: string; title: string; items: string[]; hasLainnya?: boolean }
const CATEGORIES: CategoryConfig[] = [
  { key: 'ppe', title: 'A. PPE (Personal Protection Equipment)', items: PPE_ITEMS, hasLainnya: true },
  { key: 'position_of_people', title: 'B. Position Of People', items: POSITION_ITEMS, hasLainnya: true },
  { key: 'tools_and_equipment', title: 'C. Tools and Equipment', items: TOOLS_ITEMS, hasLainnya: true },
  { key: 'housekeeping', title: 'D. Housekeeping', items: HOUSEKEEPING_ITEMS },
  { key: 'environment', title: 'E. Environment', items: ENVIRONMENT_ITEMS, hasLainnya: true },
  { key: 'nearmiss', title: 'F. Nearmiss (Hampir Celaka)', items: NEARMISS_ITEMS, hasLainnya: true },
  { key: 'swa', title: 'G. SWA (Stop Work Authority)', items: SWA_ITEMS },
];

export default function EditSafetyBehaviorPage() {
  const params = useParams();
  const router = useRouter();
  const qc = useQueryClient();

  const [tanggal, setTanggal] = useState('');
  const [waktu, setWaktu] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [observer, setObserver] = useState('');
  const [auditee, setAuditee] = useState('');
  const [kasubag, setKasubag] = useState('');
  const [nilai, setNilai] = useState<Record<string, Record<string, 'safe' | 'at_risk'>>>({});
  const [lainnya, setLainnya] = useState<Record<string, string>>({});
  const [kategoriPerilaku, setKategoriPerilaku] = useState<'safe' | 'at_risk' | ''>('');
  const [aktivitas, setAktivitas] = useState('');
  const [observasiPerilaku, setObservasiPerilaku] = useState('');
  const [alasanBeresiko, setAlasanBeresiko] = useState('');
  const [perluTindakan, setPerluTindakan] = useState(false);
  const [tindakanPerbaikan, setTindakanPerbaikan] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [fotoFiles, setFotoFiles] = useState<File[]>([]);
  const [fotoPreview, setFotoPreview] = useState<string[]>([]);
  const [existingFoto, setExistingFoto] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  const { data: pData, isLoading } = useQuery({
    queryKey: ['safety-behavior', params.id],
    queryFn: () => getSafetyBehaviorById(Number(params.id)),
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
      setKasubag(p.kasubag || '');
      setExistingFoto(p.foto || []);
      const od = p.observation_data || {};
      setKategoriPerilaku((od as any).kategori_perilaku || '');
      setAktivitas((od as any).aktivitas || '');
      setObservasiPerilaku((od as any).observasi_perilaku || '');
      setAlasanBeresiko((od as any).alasan_beresiko || '');
      setPerluTindakan((od as any).perlu_tindakan || false);
      setTindakanPerbaikan(p.tindakan_perbaikan || '');
      setDueDate(p.due_date || '');

      const nl: Record<string, Record<string, 'safe' | 'at_risk'>> = {};
      const lny: Record<string, string> = {};
      CATEGORIES.forEach(cat => {
        const catData = (od as any)[cat.key];
        if (catData) {
          const items: Record<string, 'safe' | 'at_risk'> = {};
          (catData.items || []).forEach((item: any) => { items[item.label || item] = item.value; });
          if (Object.keys(items).length > 0) nl[cat.key] = items;
          if (catData.lainnya) lny[cat.key] = catData.lainnya;
        }
      });
      setNilai(nl);
      setLainnya(lny);
      setShowModal(true);
    }
  }, [p]);

  const handleClose = () => { setShowModal(false); router.back(); };

  const updateMut = useMutation({
    mutationFn: (formData: FormData) => updateSafetyBehavior(Number(params.id), formData),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['safety-behaviors'] }); qc.invalidateQueries({ queryKey: ['safety-behavior-status-counts'] }); toast.success('Safety behavior berhasil diupdate!'); router.push(`/safety-behavior/${params.id}`); },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Gagal update'),
  });

  const setItemValue = (catKey: string, item: string, val: 'safe' | 'at_risk') => {
    setNilai(prev => ({ ...prev, [catKey]: { ...(prev[catKey] || {}), [item]: val } }));
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFotoFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev: ProgressEvent<FileReader>) => { const t = ev.target; if (t && t.result) setFotoPreview(prev => [...prev, t.result as string]); };
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
      const items = cat.items.filter(item => nilai[cat.key]?.[item]).map(item => ({ label: item, value: nilai[cat.key][item] }));
      if (items.length > 0 || lainnya[cat.key]) { data[cat.key] = { items }; if (lainnya[cat.key]) data[cat.key].lainnya = lainnya[cat.key]; }
    });
    if (kategoriPerilaku) data.kategori_perilaku = kategoriPerilaku;
    data.aktivitas = aktivitas; data.observasi_perilaku = observasiPerilaku; data.alasan_beresiko = alasanBeresiko; data.perlu_tindakan = perluTindakan;
    return data;
  };

  const handleSave = () => {
    const fd = new FormData();
    fd.append('tanggal', tanggal); fd.append('waktu', waktu); fd.append('lokasi', lokasi);
    fd.append('observer', observer); fd.append('auditee', auditee); fd.append('kasubag', kasubag);
    fd.append('observation_data', JSON.stringify(buildObservationData()));
    if (perluTindakan && tindakanPerbaikan) fd.append('tindakan_perbaikan', tindakanPerbaikan);
    if (dueDate) fd.append('due_date', dueDate);
    fotoFiles.forEach(f => fd.append('foto[]', f));

    updateMut.mutate(fd as FormData);
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-[400px]"><WifiLoader text="Memuat data..." /></div>;
  if (!p || p.status !== 'menunggu') return <div className="text-center py-16"><p className="text-gray-500 font-medium">Tidak bisa diedit</p><Button variant="outline" size="sm" onClick={() => router.back()}><ArrowLeft size={14} /> Kembali</Button></div>;

  return (
    <PermitModal
      isOpen={showModal}
      onClose={handleClose}
      title="Edit Safety Behavior"
      docNo="FM-BSHS-17/01"
    >
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Informasi Observasi</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Tanggal *</label><input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} className="hse-input text-sm" /></div>
            <div className="space-y-1"><label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Waktu</label><input type="time" value={waktu} onChange={e => setWaktu(e.target.value)} className="hse-input text-sm" /></div>
            <div className="space-y-1"><label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Observer</label><input type="text" value={observer} onChange={e => setObserver(e.target.value)} className="hse-input text-sm" /></div>
            <div className="space-y-1"><label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Auditee</label><input type="text" value={auditee} onChange={e => setAuditee(e.target.value)} className="hse-input text-sm" /></div>
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Lokasi *</label>
              <Select 
                options={locationOptions} 
                value={lokasi} 
                onChange={setLokasi} 
                placeholder={isLoadingLoc ? "Memuat lokasi..." : "Pilih Lokasi"} 
              />
            </div>
            <div className="space-y-1"><label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Kasubag</label><input type="text" value={kasubag} onChange={e => setKasubag(e.target.value)} className="hse-input text-sm" /></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
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
                            className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all ${catNilai[item] === 'safe' ? 'bg-green-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-green-100 dark:hover:bg-green-900/30'}`}>Safe</button>
                          <button type="button" onClick={() => setItemValue(cat.key, item, 'at_risk')}
                            className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all ${catNilai[item] === 'at_risk' ? 'bg-red-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30'}`}>At-Risk</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {cat.hasLainnya && <div className="mt-2"><label className="text-[10px] text-gray-400">Kondisi lainnya:</label><input type="text" value={lainnya[cat.key] || ''} onChange={e => setLainnya(prev => ({ ...prev, [cat.key]: e.target.value }))} className="hse-input text-xs mt-1" /></div>}
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Observation Report</h4>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Kategori Perilaku</label>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setKategoriPerilaku('safe')} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${kategoriPerilaku === 'safe' ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>Safe</button>
                  <button type="button" onClick={() => setKategoriPerilaku('at_risk')} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${kategoriPerilaku === 'at_risk' ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>At-Risk</button>
                </div>
              </div>
              <div className="space-y-1"><label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Aktifitas yang dilakukan</label><textarea value={aktivitas} onChange={e => setAktivitas(e.target.value)} className="hse-input min-h-[60px] text-sm" /></div>
              <div className="space-y-1"><label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Observasi perilaku</label><textarea value={observasiPerilaku} onChange={e => setObservasiPerilaku(e.target.value)} className="hse-input min-h-[60px] text-sm" /></div>
              <div className="space-y-1"><label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Alasan perilaku beresiko</label><textarea value={alasanBeresiko} onChange={e => setAlasanBeresiko(e.target.value)} className="hse-input min-h-[60px] text-sm" /></div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Tindakan Perbaikan</h4>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={perluTindakan} onChange={e => setPerluTindakan(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Butuh tindakan perbaikan</span>
              </label>
              {perluTindakan && (
                <><div className="space-y-1"><label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Tindakan Perbaikan</label><textarea value={tindakanPerbaikan} onChange={e => setTindakanPerbaikan(e.target.value)} className="hse-input min-h-[60px] text-sm" /></div>
                <div className="space-y-1"><label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Due Date</label><input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="hse-input text-sm" /></div></>
              )}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Dokumentasi Foto</h4>
              {existingFoto.length > 0 && <div className="grid grid-cols-2 gap-2 mb-2">{existingFoto.map((f, i) => <div key={i} className="relative"><img src={`http://localhost:8000/storage/${f}`} alt={`Foto ${i + 1}`} className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600" /></div>)}</div>}
              <div className="grid grid-cols-2 gap-2">
                {fotoPreview.map((preview, idx) => (
                  <div key={idx} className="relative group">
                    <img src={preview} alt={`New ${idx + 1}`} className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600" />
                    <button onClick={() => removeNewFoto(idx)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"><Trash2 size={12} /></button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                  <Camera size={20} className="text-gray-400 mb-1" /><span className="text-[10px] text-gray-400">Tambah Foto</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleFotoChange} />
                </label>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Pengesahan</h4>
              <p className="text-xs text-gray-500 mt-2">Observer: {observer || '-'}</p>
              <p className="text-xs text-gray-500">Auditee: {auditee || '-'}</p>
              <p className="text-xs text-gray-500">Kasubag Sistem & IT: {kasubag || '-'}</p>
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
