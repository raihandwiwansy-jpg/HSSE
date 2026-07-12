'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPermit } from '@/lib/api/permit';
import { fetchPermitDefaults, applyPermitDefaults } from '@/lib/permitDefaults';
import { PermitJenis } from '@/types';
import PermitTypeSelector from '@/components/permit/PermitTypeSelector';
import PermitForm from '@/components/permit/PermitForm';
import PermitModal from '@/components/permit/PermitModal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { toast } from 'react-toastify';
import { ArrowLeft, ArrowRight, Save, Send, FileText, CheckCircle, ClipboardList, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const JL: Record<PermitJenis, string> = {
  gwp: 'General Work Permit (GWP)', hwp: 'Hot Work Permit (HWP)', cse: 'Confined Space Entry (CSE)',
  elp: 'Electrical Work Permit (ELP)', ewp: 'Excavation Work Permit (EWP)', lwp: 'Lifting Work Permit (LWP)',
  rwp: 'Radiography Work Permit (RWP)', whp: 'Work at Height Permit (WHP)',
};
const JD: Record<PermitJenis, string> = {
  gwp: 'FM-BSHS-19/01', hwp: 'FM-BSHS-19/03', cse: 'FM-BSHS-19/02', elp: 'FM-BSHS-19/05',
  ewp: 'FM-BSHS-19/06', lwp: 'FM-BSHS-19/07', rwp: 'FM-BSHS-19/08', whp: 'FM-BSHS-19/04',
};

export default function CreatePermitPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const qc = useQueryClient();
  const [step, setStep] = useState(0);
  const [basic, setBasic] = useState({ judul: '', lokasi: '', deskripsi: '', tanggal: new Date().toISOString().split('T')[0] });
  const [jenis, setJenis] = useState<PermitJenis | null>(null);
  const [detail, setDetail] = useState<Record<string, unknown>>({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!loading && user && user.role !== 'user') {
      toast.error('Hanya user yang dapat membuat izin baru');
      router.push('/permit');
    }
  }, [user, loading, router]);

  const mut = useMutation({
    mutationFn: createPermit,
    onSuccess: () => { qc.invalidateQueries({queryKey:['permits']}); qc.invalidateQueries({queryKey:['permit-status-counts']}); toast.success('Permit dibuat!'); router.push('/permit'); },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Gagal'),
  });

  const canNext = () => {
    if (step === 0) return basic.judul && basic.lokasi && basic.tanggal;
    if (step === 1) return jenis !== null;
    return true;
  };

  const handleSelectType = async (t: PermitJenis) => {
    setJenis(t);
    const defaults = await fetchPermitDefaults();
    setDetail(applyPermitDefaults({}, defaults));
    setStep(2);
    setShowModal(true);
  };

  const validate = useCallback((): string | null => {
    if (!basic.judul?.trim()) return 'Judul pekerjaan harus diisi';
    if (!basic.lokasi?.trim()) return 'Lokasi area kerja harus diisi';
    if (!basic.tanggal) return 'Tanggal harus diisi';
    const jsa = detail.jsa_tahapan as any[] | undefined;
    if (!jsa || jsa.length === 0) return 'JSA minimal harus memiliki satu tahapan';
    const requiredRowFields = ['proses', 'tahapan', 'identifikasi_bahaya', 'deskripsi_bahaya', 'tindakan_pengendalian'];
    for (let i = 0; i < jsa.length; i++) {
      for (const field of requiredRowFields) {
        if (!jsa[i][field]?.toString().trim()) {
          return `JSA tahapan ke-${i + 1}: ${field} harus diisi`;
        }
      }
    }
    return null;
  }, [basic, detail]);

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const focusFirstEmptyField = () => {
    setTimeout(() => {
      const container = document.querySelector('.permit-modal-content');
      if (!container) return;
      const inputs = Array.from(container.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
        'input:not([type="hidden"]):not([readonly]):not([disabled]), textarea:not([readonly]):not([disabled]), select:not([disabled])'
      ));
      for (const input of inputs) {
        const val = 'value' in input ? input.value : '';
        if (!val || val.trim() === '') {
          input.focus();
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
            input.setSelectionRange?.(0, 0);
          }
          break;
        }
      }
    }, 150);
  };

  const handleSubmit = (isSubmit = false) => {
    if (!jenis) return;
    if (isSubmit) {
      const err = validate();
      if (err) {
        setValidationErrors(['Data belum lengkap:', err, err.includes('JSA') ? 'Silakan lengkapi data JSA di form permit.' : '']);
        if (step === 3) {
          setStep(2);
          setShowModal(true);
          setTimeout(focusFirstEmptyField, 300);
        } else {
          focusFirstEmptyField();
        }
        return;
      }
    }
    setValidationErrors([]);
    mut.mutate({
      jenis, judul: basic.judul, lokasi: basic.lokasi, deskripsi: basic.deskripsi, tanggal: basic.tanggal,
      pukul_mulai: detail.pukul_mulai as string || undefined, pukul_selesai: detail.pukul_selesai as string || undefined,
      departemen: detail.departemen as string || undefined, jsa_id: detail.jsa_id as number || undefined, detail_data: detail,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><ArrowLeft size={20} /></button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Buat Izin Kerja Baru</h1>
          <p className="text-xs sm:text-sm text-gray-500">Lengkapi data permit kerja</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between gap-1">
          {[{ l: 'Data Dasar', ic: <FileText size={16} /> }, { l: 'Pilih Jenis', ic: <ClipboardList size={16} /> }, { l: 'Form Permit', ic: <FileText size={16} /> }, { l: 'Konfirmasi', ic: <CheckCircle size={16} /> }].map((s, i) => (
            <div key={i} className="flex items-center gap-1.5 flex-1">
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs sm:text-sm ${i <= step ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'} ${i === step ? 'ring-4 ring-blue-100 dark:ring-blue-900/30' : ''}`}>
                {i < step ? <CheckCircle size={16} /> : s.ic}
              </div>
              <span className={`text-[10px] sm:text-xs font-medium hidden sm:block ${i <= step ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>{s.l}</span>
              {i < 3 && <div className={`flex-1 h-0.5 mx-1 ${i < step ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        {step === 0 && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">Data Dasar Permit</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input label="Judul Pekerjaan *" name="judul" value={basic.judul} onChange={e => setBasic({ ...basic, judul: e.target.value })} register={() => ({})} placeholder="Contoh: Perbaikan Pompa" />
              <Input label="Tanggal *" name="tanggal" type="date" value={basic.tanggal} onChange={e => setBasic({ ...basic, tanggal: e.target.value })} register={() => ({})} />
            </div>
            <Input label="Lokasi Area Kerja *" name="lokasi" value={basic.lokasi} onChange={e => setBasic({ ...basic, lokasi: e.target.value })} register={() => ({})} placeholder="Contoh: Workshop Maintenance" />
            <div className="space-y-1.5"><label className="block text-sm font-medium text-gray-700">Deskripsi Singkat</label><textarea className="hse-input min-h-[70px] text-sm" value={basic.deskripsi} onChange={e => setBasic({ ...basic, deskripsi: e.target.value })} placeholder="Deskripsi singkat pekerjaan..." /></div>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-4">Pilih Jenis Izin Kerja</h3>
            <PermitTypeSelector selected={jenis} onSelect={handleSelectType} />
          </div>
        )}
        {step === 2 && jenis && (
          <div className="text-center py-8">
            <div className="animate-pulse text-gray-500">Membuka form permit...</div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">Konfirmasi</h3>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-2 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div><p className="text-[10px] text-gray-500">Judul</p><p className="text-sm font-medium text-gray-800 dark:text-white">{basic.judul}</p></div>
                <div><p className="text-[10px] text-gray-500">Lokasi</p><p className="text-sm font-medium text-gray-800 dark:text-white">{basic.lokasi}</p></div>
                <div><p className="text-[10px] text-gray-500">Tanggal</p><p className="text-sm font-medium text-gray-800 dark:text-white">{basic.tanggal}</p></div>
                <div><p className="text-[10px] text-gray-500">Jenis</p><p className="text-sm font-medium text-gray-800 dark:text-white uppercase">{jenis}</p></div>
              </div>
              {basic.deskripsi && <div><p className="text-[10px] text-gray-500">Deskripsi</p><p className="text-sm text-gray-600 dark:text-gray-400">{basic.deskripsi}</p></div>}
            </div>
            {validationErrors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 space-y-1">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    {validationErrors.map((msg, i) => (
                      <p key={i} className={`text-xs sm:text-sm ${i === 0 ? 'font-semibold text-red-700 dark:text-red-300' : 'text-red-600 dark:text-red-400'}`}>{msg}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3"><p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">Permit akan disimpan sebagai <strong>Draft</strong>.</p></div>
          </div>
        )}
      </div>

      {/* Buttons */}
      {step !== 2 && (
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => step > 0 ? setStep(step - 1) : router.back()}>
            <ArrowLeft size={16} /> {step === 0 ? 'Batal' : 'Kembali'}
          </Button>
          <div className="flex items-center gap-2">
            {step === 3 ? (
              <>
                <Button variant="secondary" size="sm" onClick={() => handleSubmit()} isLoading={mut.isPending}><Save size={16} /> Draft</Button>
                <Button size="sm" onClick={() => handleSubmit(true)} isLoading={mut.isPending}><Send size={16} /> Submit</Button>
              </>
            ) : (
              <Button size="sm" onClick={() => setStep(step + 1)} disabled={!canNext()}>Lanjut <ArrowRight size={16} /></Button>
            )}
          </div>
        </div>
      )}

      {/* Floating Permit Form Modal */}
      <PermitModal
        isOpen={showModal && step === 2 && jenis !== null}
        onClose={() => { setShowModal(false); setStep(1); setJenis(null); }}
        title={jenis ? JL[jenis] : ''}
        docNo={jenis ? JD[jenis] : ''}
      >
        <PermitForm jenis={jenis!} data={{ ...detail, judul: basic.judul, lokasi: basic.lokasi, deskripsi: basic.deskripsi, tanggal: basic.tanggal }} onChange={setDetail} />
        <div className="sticky bottom-0 z-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 -mx-3 sm:-mx-6 -mb-3 sm:-mb-6 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between mt-4 rounded-b-2xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_-8px_30px_rgb(0,0,0,0.2)]">
          <Button variant="outline" size="sm" onClick={() => { setShowModal(false); setStep(1); setJenis(null); }}>
            <ArrowLeft size={16} /> Kembali
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => { setShowModal(false); setStep(3); }} isLoading={mut.isPending}>
              <Save size={16} /> Simpan Draft
            </Button>
            <Button size="sm" onClick={() => {
              const err = validate();
              if (err) {
                setValidationErrors(['Data belum lengkap:', err, err.includes('JSA') ? 'Silakan lengkapi data JSA di form permit.' : '']);
                focusFirstEmptyField();
                return;
              }
              setValidationErrors([]);
              setShowModal(false); setStep(3);
            }} isLoading={mut.isPending}>
              <Send size={16} /> Submit
            </Button>
          </div>
        </div>
      </PermitModal>
    </div>
  );
}
