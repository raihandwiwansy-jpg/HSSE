'use client';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPermitById, submitPermit, supervisorApprovePermit, supervisorRejectPermit, hseApprovePermit, hseRejectPermit, completePermit, confirmCompletePermit, deletePermit, updatePermit } from '@/lib/api/permit';
import { Permit } from '@/types';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import Checkbox from '@/components/ui/Checkbox';
import ExportButtons from '@/components/ui/ExportButtons';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import PermitCompletionForm from '@/components/permit/PermitCompletionForm';
import JsaForm from '@/components/permit/JsaForm';
import WifiLoader from '@/components/ui/WifiLoader';

const PermitPrintView = dynamic(() => import('@/components/permit/PermitPrintView'), { ssr: false });
const JsaPrintView = dynamic(() => import('@/components/permit/JsaPrintView'), { ssr: false });
import {
  ArrowLeft, Edit, Send, CheckCircle, XCircle, Clock, FileText, MapPin, Calendar,
  User, ClipboardList, Shield, AlertTriangle, PenTool, Stamp, CircleCheck,
  ClipboardCheck, Printer, X, Trash2
} from 'lucide-react';
import dynamic from 'next/dynamic';

const JC: Record<string,{l:string;i:string;c:string;bg:string;d:string}> = {
  gwp:{l:'General Work Permit',i:'📄',c:'text-blue-600',bg:'bg-blue-500',d:'FM-BSHS-19/01'},
  hwp:{l:'Hot Work Permit',i:'🔥',c:'text-orange-600',bg:'bg-orange-500',d:'FM-BSHS-19/03'},
  cse:{l:'Confined Space Entry',i:'🚪',c:'text-purple-600',bg:'bg-purple-500',d:'FM-BSHS-19/02'},
  elp:{l:'Electrical Work Permit',i:'⚡',c:'text-yellow-600',bg:'bg-yellow-500',d:'FM-BSHS-19/05'},
  ewp:{l:'Excavation Work Permit',i:'🏗️',c:'text-amber-600',bg:'bg-amber-500',d:'FM-BSHS-19/06'},
  lwp:{l:'Lifting Work Permit',i:'🏗️',c:'text-teal-600',bg:'bg-teal-500',d:'FM-BSHS-19/07'},
  rwp:{l:'Radiography Work Permit',i:'☢️',c:'text-red-600',bg:'bg-red-500',d:'FM-BSHS-19/08'},
  whp:{l:'Work at Height Permit',i:'📏',c:'text-indigo-600',bg:'bg-indigo-500',d:'FM-BSHS-19/04'},
};

const WORKFLOW_STEPS = [
  { key:'draft', label:'Draft', icon:FileText, desc:'Permit dibuat' },
  { key:'submitted', label:'Submit', icon:Send, desc:'Menunggu Supervisor' },
  { key:'supervisor_approved', label:'Supervisor', icon:Shield, desc:'Disetujui Pemilik Lokasi' },
  { key:'hse_approved', label:'HSSE Admin', icon:Stamp, desc:'Disetujui Admin HSSE' },
  { key:'work_ready', label:'Siap Kerja', icon:Clock, desc:'Pekerjaan Selesai, Menunggu Konfirmasi' },
  { key:'completed', label:'Selesai', icon:CircleCheck, desc:'Permit Selesai' },
];

const HSE_CHECKLISTS: Record<string, {title: string; items: string[]}[]> = {
  gwp: [
    {
      title: 'Daftar Check Untuk HSSE',
      items: [
        'Daerah kerja telah diperiksa dari kebocoran atau bahaya lain dan telah dipasang tanda-tanda yang benar',
        'Semua tindakan pencegahan untuk bahaya listrik, steam, hidrolik dll telah diperiksa dan diberi label',
        'Persyaratan penerangan daerah kerja telah memenuhi standar/layak',
        'Memastikan tidak ada sumber api dekat bahan mudah terbakar',
        'Memastikan tidak ada pelepasan bahan mudah terbakar dari pekerjaan lain di sekitar area kerja',
      ],
    },
  ],
  hwp: [
    {
      title: 'Verifikasi Keselamatan Kerja Panas',
      items: [
        'Area kerja telah diperiksa dan aman untuk hot work',
        'Fire fighting equipment tersedia dan berfungsi',
        'Gas testing telah dilakukan dan hasilnya aman',
        'Fire watchman telah ditugaskan',
        'Peralatan PPE lengkap untuk pekerjaan hot work',
        'Barikade dan tanda peringatan terpasang',
      ],
    },
  ],
  cse: [
    {
      title: 'Verifikasi Ruang Terbatas',
      items: [
        'Gas testing telah dilakukan dan hasilnya aman',
        'Ventilasi dan pencahayaan memadai',
        'Rescuer dan rescue plan telah disiapkan',
        'PPE lengkap termasuk SCBA tersedia',
        'Daftar orang yang masuk telah tercatat',
        'Alat komunikasi tersedia',
      ],
    },
  ],
  elp: [
    {
      title: 'Verifikasi Isolasi Elektrikal',
      items: [
        'Semua isolasi telah terverifikasi dan terkunci (LOTO)',
        'Lock dan tag telah terpasang dengan benar',
        'Tanda peringatan terpasang di setiap bilik',
        'Voltase telah dipastikan nol sebelum bekerja',
        'Pembumian telah dilakukan dengan benar',
      ],
    },
  ],
  ewp: [
    {
      title: 'Verifikasi Penggalian',
      items: [
        'Fasilitas bawah tanah telah teridentifikasi',
        'Barikade dan tanda peringatan terpasang',
        'Shoring/trench shield tersedia jika diperlukan',
        'Gas testing telah dilakukan',
        'Standby man telah ditugaskan',
      ],
    },
  ],
  lwp: [
    {
      title: 'Verifikasi Critical Lifting',
      items: [
        'Sertifikat crane masih berlaku',
        'SIO operator crane valid',
        'Load calculation benar dan tidak melebihi 80% kapasitas',
        'Rigging equipment dalam kondisi baik',
        'Area lifting telah dibersihkan dan diamankan',
      ],
    },
  ],
  rwp: [
    {
      title: 'Verifikasi Radiografi',
      items: [
        'Sertifikat BATAN operator valid',
        'Barikade radiasi terpasang dengan benar',
        'Survey meter dan dosimeter berfungsi',
        'Area kerja telah diinspeksi',
        'Semua pihak terkait telah diberitahu',
      ],
    },
  ],
  whp: [
    {
      title: 'Verifikasi Kerja Ketinggian',
      items: [
        'Safety harness dalam kondisi baik dan valid',
        'Anchor point telah terverifikasi',
        'Fall protection equipment lengkap',
        'Drop zone telah ditentukan dan ditandai',
        'Rescue plan telah disiapkan',
        'Scaffolding/platform telah diinspeksi',
      ],
    },
  ],
};

export default function PermitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const qc = useQueryClient();
  const { user } = useAuth();
  const [catatan, setCatatan] = useState('');
  const [showCatatan, setShowCatatan] = useState(false);
  const [actType, setActType] = useState<'approve'|'reject'|null>(null);
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [completionData, setCompletionData] = useState<Record<string,unknown>>({});
  const [hseChecklist, setHseChecklist] = useState<string[]>([]);
  const [hseFormData, setHseFormData] = useState<Record<string,unknown>>({});
  const [showPrintView, setShowPrintView] = useState(false);
  const [showJsaPrintView, setShowJsaPrintView] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showJsaEdit, setShowJsaEdit] = useState(false);
  const [jsaRows, setJsaRows] = useState<any[]>([]);

  const { data: pData, isLoading } = useQuery({ queryKey:['permit',params.id], queryFn:()=>getPermitById(Number(params.id)) });
  const p: Permit|undefined = pData?.data?.data;

  // Load completion data from permit when data arrives
  useEffect(() => {
    if (p?.completion_data && Object.keys(completionData).length === 0) {
      setCompletionData(p.completion_data as Record<string, unknown>);
    }
    // Auto-close completion form when status is completed
    if (p?.status === 'completed' && showCompletionForm) {
      setShowCompletionForm(false);
    }
    // Load JSA data for admin editing
    if (p?.detail?.detail_data?.jsa_tahapan && jsaRows.length === 0) {
      setJsaRows(p.detail.detail_data.jsa_tahapan as any[]);
    }
  }, [p]);

  const invalidateAll = () => { qc.invalidateQueries({ queryKey: ['permit', params.id] }); qc.invalidateQueries({ queryKey: ['permits'] }); qc.invalidateQueries({ queryKey: ['permit-status-counts'] }); };
  const subMut = useMutation({ mutationFn:submitPermit, onSuccess:()=>{invalidateAll();toast.success('Disubmit ke Supervisor');}, onError:(e:any)=>toast.error(e?.response?.data?.message||'Gagal') });
  const spvAppMut = useMutation({ mutationFn:({id,c}:{id:number;c?:string})=>supervisorApprovePermit(id,c), onSuccess:()=>{invalidateAll();toast.success('Disetujui Supervisor');setShowCatatan(false);setCatatan('');}, onError:(e:any)=>toast.error(e?.response?.data?.message||'Gagal') });
  const spvRejMut = useMutation({ mutationFn:({id,c}:{id:number;c?:string})=>supervisorRejectPermit(id,c), onSuccess:()=>{invalidateAll();toast.success('Ditolak Supervisor');setShowCatatan(false);setCatatan('');}, onError:(e:any)=>toast.error(e?.response?.data?.message||'Gagal') });
  const hseAppMut = useMutation({ mutationFn:({id,c,h}:{id:number;c?:string;h?:Record<string,unknown>})=>hseApprovePermit(id,c,h), onSuccess:()=>{invalidateAll();toast.success('Disetujui HSSE');setShowCatatan(false);setCatatan('');setHseChecklist([]);setHseFormData({});}, onError:(e:any)=>toast.error(e?.response?.data?.message||'Gagal') });
  const hseRejMut = useMutation({ mutationFn:({id,c}:{id:number;c?:string})=>hseRejectPermit(id,c), onSuccess:()=>{invalidateAll();toast.success('Ditolak HSSE');setShowCatatan(false);setCatatan('');}, onError:(e:any)=>toast.error(e?.response?.data?.message||'Gagal') });
  const comMut = useMutation({ mutationFn:({id,d}:{id:number;d?:Record<string,unknown>})=>completePermit(id,d), onSuccess:()=>{invalidateAll();toast.success('Penyelesaian pekerjaan dikirim, menunggu konfirmasi admin');setShowCompletionForm(false);}, onError:(e:any)=>toast.error(e?.response?.data?.message||'Gagal') });
  const confirmComMut = useMutation({ mutationFn:({id,d}:{id:number;d?:Record<string,unknown>})=>confirmCompletePermit(id,d), onSuccess:()=>{invalidateAll();toast.success('Permit Selesai!');}, onError:(e:any)=>toast.error(e?.response?.data?.message||'Gagal') });
  const delMut = useMutation({ mutationFn:deletePermit, onSuccess:()=>{invalidateAll();toast.success('Permit dihapus!');router.push('/permit');}, onError:(e:any)=>toast.error(e?.response?.data?.message||'Gagal') });
  const saveJsaMut = useMutation({
    mutationFn: ({ id, jsa }: { id: number; jsa: any[] }) => {
      const det = p?.detail?.detail_data || {};
      return updatePermit(id, { detail_data: { ...det, jsa_tahapan: jsa } });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['permit', params.id] }); toast.success('JSA berhasil disimpan!'); setShowJsaEdit(false); },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Gagal simpan JSA'),
  });

  const handleAction = () => {
    if(!actType||!p) return;
    const id=p.id;
    if(actType==='approve'){
      if(canSPV) spvAppMut.mutate({id,c:catatan});
      else if(canHSE) {
        const allChecked = HSE_CHECKLISTS[p.jenis]?.every(sec => sec.items.length === hseChecklist.length);
        if(!allChecked) {
          toast.warning('Semua item checklist HSSE harus dicentang terlebih dahulu');
          return;
        }
        hseAppMut.mutate({id,c:catatan, h: hseFormData});
      }
    } else {
      if(canSPV) spvRejMut.mutate({id,c:catatan});
      else if(canHSE) hseRejMut.mutate({id,c:catatan});
    }
  };

  const toggleHseCheck = (item: string) => {
    setHseChecklist(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  if(isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <WifiLoader text="Memuat detail izin..." />
    </div>
  );

  if(!p) return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <FileText size={36} className="text-gray-300"/>
      </div>
      <p className="text-gray-500 font-medium mb-1">Permit Tidak Ditemukan</p>
      <p className="text-xs text-gray-400 mb-4">Data permit mungkin sudah dihapus</p>
      <Button variant="outline" size="sm" onClick={()=>router.back()}><ArrowLeft size={14}/> Kembali</Button>
    </div>
  );

  const jc = JC[p.jenis]||{l:p.jenis,i:'📋',c:'text-gray-600',bg:'bg-gray-500',d:'-'};
  const det = p.detail?.detail_data||{};
  const canSub = (p.status==='draft'||p.status==='supervisor_rejected'||p.status==='hse_rejected')&&user?.role==='user';
  const canSPV = p.status==='submitted'&&user?.role==='supervisor';
  const canHSE = p.status==='supervisor_approved'&&user?.role==='admin';
  const roleCompletion = (p.completion_data as Record<string, unknown>)?.role_completion as Record<string, boolean> || {};
  const myRoleDone = roleCompletion[user?.role ?? ''];
  const allRolesDone = roleCompletion.user && roleCompletion.supervisor && roleCompletion.admin;
  const canCom = (p.status==='hse_approved'||p.status==='work_ready') && !myRoleDone && (user?.role==='user'||user?.role==='supervisor'||user?.role==='admin');
  const canViewCompletion = p.status==='work_ready'||p.status==='completed';
  const canConfirm = p.status==='work_ready'&&user?.role==='admin'&&!!allRolesDone;
  const canEdit = canSub;
  const canPrint = !!user;
  const hasJsa = Array.isArray(det.jsa_tahapan) && det.jsa_tahapan.length > 0;

  const statusIdx = WORKFLOW_STEPS.findIndex(s=>s.key===p.status);
  const isRejected = p.status==='supervisor_rejected'||p.status==='hse_rejected';

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={()=>router.back()} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all hover:scale-105 active:scale-95">
            <ArrowLeft size={20}/>
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">{p.permit_number}</h1>
              <StatusBadge status={p.status} size="md"/>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-gray-700 ${jc.c}`}>{jc.i} {jc.l}</span>
              <span className="text-gray-400">&bull;</span>
              <span className="text-gray-400">{jc.d}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {canSub&&<Button size="sm" onClick={()=>subMut.mutate(p.id)} isLoading={subMut.isPending}><Send size={14}/> Submit ke Supervisor</Button>}
          {canCom&&!showCompletionForm&&<Button size="sm" onClick={()=>setShowCompletionForm(true)}><CircleCheck size={14}/> Isi Form Selesai Kerja</Button>}
          {!canConfirm&&p.status==='work_ready'&&user?.role==='admin'&&!allRolesDone&&<span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"><Clock size={14}/> Menunggu Sign-off Semua Pihak</span>}
          {canConfirm&&<Button variant="success" size="sm" onClick={()=>confirmComMut.mutate({id:p.id})} isLoading={confirmComMut.isPending}><CheckCircle size={14}/> Konfirmasi & Tutup Permit</Button>}
          {p.status==='completed'&&<span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"><CircleCheck size={14}/> Permit Selesai</span>}
          {(canSPV||canHSE)&&(<>
            <Button variant="success" size="sm" onClick={()=>{setActType('approve');setShowCatatan(true);}}><CheckCircle size={14}/> Setujui</Button>
            <Button variant="danger" size="sm" onClick={()=>{setActType('reject');setShowCatatan(true);}}><XCircle size={14}/> Tolak</Button>
          </>)}
          {canEdit&&<Button variant="outline" size="sm" onClick={()=>router.push(`/permit/${p.id}/edit`)}><Edit size={14}/> Edit</Button>}
          {user?.role==='admin' && (
            <>
              <Button variant="outline" size="sm" onClick={() => { setJsaRows((p?.detail?.detail_data?.jsa_tahapan as any[]) || []); setShowJsaEdit(true); }}>
                <ClipboardList size={14}/> Edit JSA
              </Button>
              <Button variant="danger" size="sm" onClick={()=>setShowDeleteConfirm(true)}><Trash2 size={14}/> Hapus</Button>
            </>
          )}
          {user?.role!=='admin' && (p.status==='draft'||p.status==='completed') && (
            <Button variant="danger" size="sm" onClick={()=>setShowDeleteConfirm(true)}><Trash2 size={14}/> Hapus</Button>
          )}
          {canPrint&&(
            <>
              <Button variant="secondary" size="sm" onClick={()=>setShowPrintView(true)}><Printer size={14}/> Cetak Laporan</Button>
              <Button variant="secondary" size="sm" onClick={()=>setShowJsaPrintView(true)}><FileText size={14}/> Cetak JSA</Button>
            </>
          )}
        </div>
      </div>

      {/* Workflow Timeline (Responsive) */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Alur Persetujuan</h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-2">
          <div className="flex items-center justify-between gap-1 relative min-w-[600px] sm:min-w-0">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 mx-10"/>
            <div className="absolute top-5 left-0 h-0.5 mx-10 transition-all duration-500"
              style={{
                width: isRejected ? '0%' : statusIdx >= 0 ? `${Math.min(100, (statusIdx / (WORKFLOW_STEPS.length-1)) * 100)}%` : '0%',
                background: isRejected ? '#EF4444' : 'linear-gradient(90deg, #1A365D, #3182CE)',
                maxWidth: 'calc(100% - 5rem)'
              }}
            />
            {WORKFLOW_STEPS.map((step, i) => {
              const Icon = step.icon;
              const isActive = i <= statusIdx && !isRejected;
              const isCurrent = step.key === p.status;
              const isRejectedStep = isRejected && i === statusIdx;
              return (
                <div key={step.key} className="flex flex-col items-center relative z-10 flex-1">
                  <div className={`
                    w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300
                    ${isCurrent ? 'ring-4 ring-blue-100 dark:ring-blue-900/40 shadow-lg' : ''}
                    ${isRejectedStep ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' :
                      isActive ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-400'}
                  `}>
                    {isRejectedStep ? <XCircle size={16}/> : isActive ? <Icon size={16}/> : <step.icon size={16}/>}
                  </div>
                  <p className={`text-[10px] sm:text-xs font-semibold mt-2 text-center leading-tight ${isActive?'text-blue-600 dark:text-blue-400':'text-gray-400'}`}>{step.label}</p>
                  <p className="text-[9px] text-gray-400 text-center hidden sm:block mt-0.5 leading-tight">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
        {isRejected && (
          <div className="mt-3 p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5">
              <AlertTriangle size={14}/>
              Permit ditolak {p.status==='supervisor_rejected'?'Supervisor':'HSSE Admin'}
              {p.catatan_reject && <span className="text-red-500">- {p.catatan_reject}</span>}
            </p>
          </div>
        )}
      </div>

      {/* Approval Action */}
      {showCatatan&&(
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-4 sm:p-5 border border-yellow-200 dark:border-yellow-800 space-y-3 animate-scale-in">
          <div className="flex items-center gap-2">
            {actType==='approve' ? <CheckCircle size={18} className="text-green-600"/> : <XCircle size={18} className="text-red-600"/>}
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{actType==='approve'?'Persetujuan':'Alasan Penolakan'}</label>
          </div>

          {/* HSE Checklist for approve action */}
          {actType==='approve' && canHSE && HSE_CHECKLISTS[p.jenis] && (
            <div className="space-y-3 bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardCheck size={16} className="text-blue-600"/>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Checklist Verifikasi HSSE</p>
              </div>
              {HSE_CHECKLISTS[p.jenis].map((section) => (
                <div key={section.title} className="space-y-2">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{section.title}</p>
                  <div className="space-y-1.5">
                    {section.items.map((item) => (
                      <Checkbox
                        key={item}
                        checked={hseChecklist.includes(item)}
                        onChange={() => toggleHseCheck(item)}
                        label={item}
                        size="md"
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* Admin Review Data per Permit Type */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Data Verifikasi Admin HSSE</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Nama Pemeriksa</label>
                    <input type="text" className="hse-input text-sm" value={(hseFormData.nama_pemeriksa as string)||''} onChange={e=>setHseFormData({...hseFormData,nama_pemeriksa:e.target.value})} placeholder="Nama lengkap"/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Jabatan</label>
                    <input type="text" className="hse-input text-sm" value={(hseFormData.jabatan_pemeriksa as string)||''} onChange={e=>setHseFormData({...hseFormData,jabatan_pemeriksa:e.target.value})} placeholder="Jabatan"/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Tanggal Pemeriksaan</label>
                    <input type="date" className="hse-input text-sm" value={(hseFormData.tanggal_pemeriksaan as string)||''} onChange={e=>setHseFormData({...hseFormData,tanggal_pemeriksaan:e.target.value})}/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Lokasi Pemeriksaan</label>
                    <input type="text" className="hse-input text-sm" value={(hseFormData.lokasi_pemeriksaan as string)||p.lokasi} onChange={e=>setHseFormData({...hseFormData,lokasi_pemeriksaan:e.target.value})} placeholder="Lokasi"/>
                  </div>
                </div>
              </div>
            </div>
          )}

          <textarea className="hse-input min-h-[80px] text-sm" value={catatan} onChange={e=>setCatatan(e.target.value)} placeholder={actType==='approve'?'Tambahkan catatan (opsional)...':'Masukkan alasan penolakan...'}/>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleAction} isLoading={spvAppMut.isPending||spvRejMut.isPending||hseAppMut.isPending||hseRejMut.isPending}>
              {actType==='approve'?'Ya, Setujui':'Ya, Tolak'}
            </Button>
            <Button variant="outline" size="sm" onClick={()=>{setShowCatatan(false);setCatatan('');setActType(null);setHseChecklist([]);}}>Batal</Button>
          </div>
        </div>
      )}

      {/* Post-Work Completion Form - User fills after work done */}
      {showCompletionForm && canCom && (
        <PermitCompletionForm
          jenis={p.jenis}
          userRole={user?.role || 'user'}
          completionData={completionData}
          onChange={setCompletionData}
          onSubmit={(mergedData) => {
            comMut.mutate({ id: p.id, d: mergedData });
          }}
          isPending={comMut.isPending}
        />
      )}

      {/* View Completed Completion Data (read-only for supervisor/admin) */}
      {canViewCompletion && p.completion_data && Object.keys(p.completion_data as Record<string, unknown>).length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
          <h3 className="font-semibold text-gray-800 dark:text-white text-sm flex items-center gap-2">
            <CircleCheck size={14} className="text-green-500"/> Data Penyelesaian Pekerjaan
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(p.completion_data as Record<string, unknown>).filter(([k]) => !['role_completion','hse_review'].includes(k)).map(([k, v]) => {
              if (v === null || v === undefined || v === '') return null;
              let display = String(v);
              if (typeof v === 'boolean') display = v ? 'Ya' : 'Tidak';
              else if (Array.isArray(v)) display = v.join(', ');
              else if (typeof v === 'object') display = JSON.stringify(v);
              return (
                <div key={k} className="bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-600/50">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5 uppercase tracking-wider">{k.replace(/_/g, ' ')}</p>
                  <p className="text-xs font-medium text-gray-800 dark:text-white">{display}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <DetailCard title="Informasi Permit" icon={<FileText size={14} className="text-blue-500"/>}>
          <InfoRow label="Judul" value={p.judul}/>
          <InfoRow icon={<MapPin size={11}/>} label="Lokasi" value={p.lokasi}/>
          <InfoRow icon={<Calendar size={11}/>} label="Tanggal" value={new Date(p.tanggal).toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}/>
          {p.pukul_mulai&&<InfoRow icon={<Clock size={11}/>} label="Waktu" value={`${p.pukul_mulai} - ${p.pukul_selesai}`}/>}
          {p.departemen&&<InfoRow icon={<User size={11}/>} label="Departemen" value={p.departemen}/>}
        </DetailCard>
        <DetailCard title="Pemohon" icon={<User size={14} className="text-blue-500"/>}>
          <InfoRow label="Nama" value={p.user?.name||'-'}/>
          <InfoRow label="Email" value={p.user?.email||'-'}/>
          <InfoRow label="Dibuat" value={new Date(p.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}/>
        </DetailCard>
      </div>

      {p.deskripsi&&(
        <DetailCard title="Deskripsi">
          <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">{p.deskripsi}</p>
        </DetailCard>
      )}

      {/* Detail Data */}
      {Object.keys(det).length>0&&(
        <DetailCard title="Detail Data Permit" icon={<ClipboardList size={14} className="text-blue-500"/>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(det).filter(([k])=>!['judul','lokasi','deskripsi','tanggal','pukul_mulai','pukul_selesai','departemen','jsa_id'].includes(k)).map(([k,v])=>{
              if(v===null||v===undefined||v==='') return null;
              const label=k.replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase());
              let display=String(v);
              if(Array.isArray(v))display=v.join(', ');
              else if(typeof v==='object')display=JSON.stringify(v);
              return (
                <div key={k} className="bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-600/50">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5 uppercase tracking-wider">{label}</p>
                  <p className="text-xs font-medium text-gray-800 dark:text-white leading-relaxed">{display}</p>
                </div>
              );
            })}
          </div>
        </DetailCard>
      )}

      {p.jsa&&(
        <DetailCard title="JSA Terkait" icon={<ClipboardList size={14} className="text-blue-500"/>}>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-100 dark:border-gray-600/50">
            <p className="text-sm font-medium text-gray-800 dark:text-white">{p.jsa.kegiatan}</p>
            <p className="text-xs text-gray-500 mt-1">{p.jsa.lokasi} &bull; {p.jsa.tanggal}</p>
          </div>
        </DetailCard>
      )}

      {/* Approval Notes */}
      {(p.catatan||p.catatan_reject)&&(
        <DetailCard title="Catatan Persetujuan" icon={<PenTool size={14} className="text-blue-500"/>}>
          <div className="space-y-2">
            {p.catatan&&(
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <p className="text-[10px] text-green-600 font-semibold uppercase tracking-wider mb-1">Persetujuan:</p>
                <p className="text-sm text-green-700 dark:text-green-300">{p.catatan}</p>
              </div>
            )}
            {p.catatan_reject&&(
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
                <p className="text-[10px] text-red-600 font-semibold uppercase tracking-wider mb-1">Penolakan:</p>
                <p className="text-sm text-red-700 dark:text-red-300">{p.catatan_reject}</p>
              </div>
            )}
          </div>
        </DetailCard>
      )}

      {/* Timestamps */}
      <DetailCard title="Riwayat Waktu" icon={<Clock size={14} className="text-blue-500"/>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {p.submitted_at&&<TimestampItem label="Submitted" value={p.submitted_at}/>}
          {p.supervisor_approved_at&&<TimestampItem label="Disetujui Supervisor" value={p.supervisor_approved_at}/>}
          {p.supervisor_rejected_at&&<TimestampItem label="Ditolak Supervisor" value={p.supervisor_rejected_at} rejected/>}
          {p.hse_approved_at&&<TimestampItem label="Disetujui HSSE" value={p.hse_approved_at}/>}
          {p.hse_rejected_at&&<TimestampItem label="Ditolak HSSE" value={p.hse_rejected_at} rejected/>}
          {p.work_ready_at&&<TimestampItem label="Siap Dikerjakan" value={p.work_ready_at}/>}
          {p.completed_at&&<TimestampItem label="Selesai" value={p.completed_at}/>}
        </div>
      </DetailCard>
    </div>

    {/* Print View Overlay */}
      {showPrintView && (
        <div className="fixed inset-0 z-[9999] bg-white overflow-y-auto" id="print-preview-container">
          <div id="print-toolbar" className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800">Preview Cetak Laporan</h2>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => window.print()}>
                <Printer size={14} /> Cetak
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowPrintView(false)}>
                <X size={14} /> Tutup
              </Button>
            </div>
          </div>
          <div className="max-w-[210mm] mx-auto p-6">
            <PermitPrintView permit={p} />
          </div>
        </div>
      )}

      {/* JSA Print View Overlay */}
      {showJsaPrintView && (
        <div className="fixed inset-0 z-[9999] bg-white overflow-y-auto" id="jsa-print-preview-container">
          <div id="print-toolbar" className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800">Preview Cetak JSA</h2>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => window.print()}>
                <Printer size={14} /> Cetak JSA
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowJsaPrintView(false)}>
                <X size={14} /> Tutup
              </Button>
            </div>
          </div>
          <div className="max-w-[210mm] mx-auto p-6">
            <JsaPrintView permit={p} />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Responsive) */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in" onClick={()=>setShowDeleteConfirm(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-2xl space-y-4 mx-3 sm:mx-0 animate-scale-in" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                <Trash2 size={20} className="text-red-600 dark:text-red-400"/>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white text-sm sm:text-base">Hapus Permit?</h3>
                <p className="text-xs text-gray-500 mt-0.5">Permit <strong>{p.permit_number}</strong> akan dihapus secara permanen.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 justify-end pt-1">
              <Button variant="outline" size="sm" onClick={()=>setShowDeleteConfirm(false)}>Batal</Button>
              <Button variant="danger" size="sm" onClick={()=>delMut.mutate(p.id)} isLoading={delMut.isPending}>
                <Trash2 size={14}/> Ya, Hapus
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* JSA Edit Modal - Admin Only (Responsive) */}
      {showJsaEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 animate-fade-in" onClick={() => setShowJsaEdit(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-gray-900 w-full h-full sm:h-auto sm:max-h-[90vh] sm:rounded-2xl sm:max-w-6xl xl:max-w-7xl sm:w-full shadow-2xl flex flex-col animate-slide-in-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 min-w-0">
                <ClipboardList size={18} className="text-blue-600 shrink-0" />
                <h3 className="font-bold text-gray-800 dark:text-white text-sm sm:text-base truncate">Edit JSA - {p.permit_number}</h3>
              </div>
              <button onClick={() => setShowJsaEdit(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors shrink-0"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              <JsaForm value={jsaRows} onChange={setJsaRows} />
            </div>
            <div className="flex items-center gap-2 justify-end px-4 sm:px-5 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <Button variant="outline" size="sm" onClick={() => setShowJsaEdit(false)}>Batal</Button>
              <Button size="sm" onClick={() => saveJsaMut.mutate({ id: p.id, jsa: jsaRows })} isLoading={saveJsaMut.isPending}>
                Simpan JSA
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DetailCard({title,icon,children}:{title:string;icon?:React.ReactNode;children:React.ReactNode}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
      <h3 className="font-semibold text-gray-800 dark:text-white text-sm flex items-center gap-2">
        {icon}{title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({label,value,icon}:{label:string;value:string;icon?:React.ReactNode}) {
  return (
    <div className="flex items-start gap-2 text-xs py-1">
      <span className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</span>
      <span className="text-gray-500 min-w-[80px]">{label}:</span>
      <span className="font-medium text-gray-800 dark:text-white">{value}</span>
    </div>
  );
}

function TimestampItem({label,value,rejected}:{label:string;value:string;rejected?:boolean}) {
  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg ${rejected?'bg-red-50 dark:bg-red-900/20':'bg-gray-50 dark:bg-gray-700/50'}`}>
      <Clock size={12} className={rejected?'text-red-400':'text-gray-400'}/>
      <div>
        <p className={`text-[10px] font-semibold uppercase tracking-wider ${rejected?'text-red-500':'text-gray-500'}`}>{label}</p>
        <p className="text-xs text-gray-800 dark:text-white font-medium">
          {new Date(value).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}
        </p>
      </div>
    </div>
  );
}
