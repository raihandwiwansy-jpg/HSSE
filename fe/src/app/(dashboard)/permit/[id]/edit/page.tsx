'use client';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPermitById, updatePermit } from '@/lib/api/permit';
import { fetchPermitDefaults, applyPermitDefaults } from '@/lib/permitDefaults';
import { PermitJenis } from '@/types';
import PermitForm from '@/components/permit/PermitForm';
import PermitModal from '@/components/permit/PermitModal';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';
import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Save, FileText, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import WifiLoader from '@/components/ui/WifiLoader';

const JL: Record<string, string> = {
  gwp: 'General Work Permit (GWP)', hwp: 'Hot Work Permit (HWP)', cse: 'Confined Space Entry (CSE)',
  elp: 'Electrical Work Permit (ELP)', ewp: 'Excavation Work Permit (EWP)', lwp: 'Lifting Work Permit (LWP)',
  rwp: 'Radiography Work Permit (RWP)', whp: 'Work at Height Permit (WHP)',
};
const JD: Record<string, string> = {
  gwp: 'FM-BSHS-19/01', hwp: 'FM-BSHS-19/03', cse: 'FM-BSHS-19/02', elp: 'FM-BSHS-19/05',
  ewp: 'FM-BSHS-19/06', lwp: 'FM-BSHS-19/07', rwp: 'FM-BSHS-19/08', whp: 'FM-BSHS-19/04',
};

export default function EditPermitPage() {
  const params = useParams();
  const router = useRouter();
  const qc = useQueryClient();
  const { user, loading } = useAuth();
  const [detail, setDetail] = useState<Record<string,unknown>>({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!loading && user && user.role !== 'user' && user.role !== 'admin') {
      toast.error('Hanya user atau admin yang dapat mengedit izin');
      router.push('/permit');
    }
  }, [user, loading, router]);

  const { data: pData, isLoading } = useQuery({ queryKey:['permit',params.id], queryFn:()=>getPermitById(Number(params.id)) });
  const p = pData?.data?.data;

  useEffect(()=>{
    if(p) {
      fetchPermitDefaults().then(defaults => {
        setDetail(applyPermitDefaults({
          judul:p.judul, lokasi:p.lokasi, deskripsi:p.deskripsi||'', tanggal:p.tanggal,
          pukul_mulai:p.pukul_mulai||'', pukul_selesai:p.pukul_selesai||'',
          departemen:p.departemen||'', jsa_id:p.jsa_id||null,
          ...(p.detail?.detail_data||{}),
        }, defaults));
        setShowModal(true);
      });
    }
  },[p]);

  const mut = useMutation({
    mutationFn:(d:Record<string,unknown>)=>updatePermit(p!.id,d),
    onSuccess:()=>{qc.invalidateQueries({queryKey:['permits']});qc.invalidateQueries({queryKey:['permit',params.id]});qc.invalidateQueries({queryKey:['permit-status-counts']});toast.success('Updated!');router.push(`/permit/${params.id}`);},
    onError:(e:any)=>toast.error(e?.response?.data?.message||'Gagal'),
  });

  const validate = useCallback((): string | null => {
    if (!detail.judul?.toString().trim()) return 'Judul pekerjaan harus diisi';
    if (!detail.lokasi?.toString().trim()) return 'Lokasi area kerja harus diisi';
    if (!detail.tanggal) return 'Tanggal harus diisi';
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
  }, [detail]);

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

  const handleSave = () => {
    const err = validate();
    if (err) {
      setValidationErrors(['Data belum lengkap:', err, err.includes('JSA') ? 'Silakan lengkapi data JSA di form permit.' : '']);
      focusFirstEmptyField();
      return;
    }
    setValidationErrors([]);
    mut.mutate({judul:detail.judul,lokasi:detail.lokasi,deskripsi:detail.deskripsi,tanggal:detail.tanggal,pukul_mulai:detail.pukul_mulai,pukul_selesai:detail.pukul_selesai,departemen:detail.departemen,jsa_id:detail.jsa_id,detail_data:detail});
  };

  const handleClose = () => { setShowModal(false); router.back(); };

  if(isLoading) return <div className="flex items-center justify-center min-h-[300px]"><WifiLoader text="Memuat data..." /></div>;
  if(!p) return <div className="text-center py-12"><FileText size={40} className="mx-auto mb-3 text-gray-300"/><p className="text-gray-500 text-sm">Tidak ditemukan</p></div>;

  return (
    <PermitModal
      isOpen={showModal}
      onClose={handleClose}
      title={`Edit ${p.permit_number}`}
      docNo={JD[p.jenis] || ''}
    >
      {validationErrors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 space-y-1 mx-3 sm:mx-6">
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
      <PermitForm jenis={p.jenis as PermitJenis} data={detail} onChange={setDetail} />
      <div className="sticky bottom-0 z-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 -mx-3 sm:-mx-6 -mb-3 sm:-mb-6 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between mt-4 rounded-b-2xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_-8px_30px_rgb(0,0,0,0.2)]">
        <Button variant="outline" size="sm" onClick={handleClose}>
          <ArrowLeft size={16} /> Batal
        </Button>
        <Button size="sm" onClick={handleSave} isLoading={mut.isPending}>
          <Save size={16} /> Simpan
        </Button>
      </div>
    </PermitModal>
  );
}
