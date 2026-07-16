'use client';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSafetyBehaviorById, reviewSafetyBehavior, deleteSafetyBehavior } from '@/lib/api/safetyBehavior';
import { SafetyBehavior } from '@/types';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import { useState } from 'react';
import {
  ArrowLeft, CheckCircle, Clock, FileText, MapPin, Calendar,
  User, ClipboardCheck, AlertTriangle, Eye, Trash2, Camera, Printer
} from 'lucide-react';
import WifiLoader from '@/components/ui/WifiLoader';
import SafetyBehaviorPrintView from '@/components/safety-behavior/SafetyBehaviorPrintView';

const CATEGORY_LABELS: Record<string, string> = {
  ppe: 'A. PPE (Personal Protection Equipment)',
  position_of_people: 'B. Position Of People (Posisi Kerja Orang)',
  tools_and_equipment: 'C. Tools and Equipment',
  housekeeping: 'D. Housekeeping',
  environment: 'E. Environment',
  nearmiss: 'F. Nearmiss (Hampir Celaka)',
  swa: 'G. SWA (Stop Work Authority)',
};

export default function SafetyBehaviorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const qc = useQueryClient();
  const { user } = useAuth();
  const [showReview, setShowReview] = useState(false);
  const [catatanReview, setCatatanReview] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);

  const { data: pData, isLoading } = useQuery({
    queryKey: ['safety-behavior', params.id],
    queryFn: () => getSafetyBehaviorById(Number(params.id)),
  });
  const p: SafetyBehavior | undefined = pData?.data?.data;

  const reviewMut = useMutation({
    mutationFn: ({ id, c, action }: { id: number; c?: string, action: 'approve' | 'reject' }) => reviewSafetyBehavior(id, c, action),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['safety-behavior', params.id] }); qc.invalidateQueries({ queryKey: ['safety-behaviors'] }); qc.invalidateQueries({ queryKey: ['safety-behavior-status-counts'] }); toast.success('Safety behavior dikonfirmasi!'); setShowReview(false); setCatatanReview(''); },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Gagal'),
  });
  const delMut = useMutation({
    mutationFn: deleteSafetyBehavior,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['safety-behaviors'] }); qc.invalidateQueries({ queryKey: ['safety-behavior-status-counts'] }); toast.success('Dihapus!'); router.push('/safety-behavior'); },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Gagal'),
  });

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <WifiLoader text="Memuat data..." />
    </div>
  );

  if (!p) return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center"><FileText size={36} className="text-gray-300" /></div>
      <p className="text-gray-500 font-medium mb-1">Tidak Ditemukan</p>
      <Button variant="outline" size="sm" onClick={() => router.back()}><ArrowLeft size={14} /> Kembali</Button>
    </div>
  );

  const od = p.observation_data || {} as any;
  const canConfirmKasubag = (user?.role === 'kasubag' || user?.role === 'admin') && p.admin_status === 'pending';
  const canConfirmAudit = user?.role === 'audit' && p.audit_status === 'pending';
  const canConfirm = p.status === 'menunggu' && (canConfirmKasubag || canConfirmAudit);
  const canDelete = (user?.role === 'admin') || (user?.role === 'user' && p.status === 'menunggu');

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all hover:scale-105 active:scale-95"><ArrowLeft size={20} /></button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                Safety Behavior - {new Date(p.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </h1>
              <StatusBadge status={p.status} size="md" />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{p.lokasi} &bull; FM-BSHS-17/01</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {canConfirm && !showReview && (
            <Button variant="success" size="sm" onClick={() => setShowReview(true)}>
              <CheckCircle size={14} /> Review Laporan
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setShowPrintView(true)}>
            <Printer size={14} /> Cetak Laporan
          </Button>
          {canDelete && <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}><Trash2 size={14} /> Hapus</Button>}
        </div>
      </div>

      {showReview && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 sm:p-5 border border-green-200 dark:border-green-800 space-y-3 animate-scale-in">
          <div className="flex items-center gap-2"><CheckCircle size={18} className="text-green-600" /><label className="text-sm font-semibold text-gray-700">Konfirmasi Safety Behavior Selesai</label></div>
          <textarea className="hse-input min-h-[80px] text-sm" value={catatanReview} onChange={e => setCatatanReview(e.target.value)} placeholder="Tambahkan catatan (opsional)..." />
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => reviewMut.mutate({ id: p.id, c: catatanReview, action: 'approve' })} isLoading={reviewMut.isPending}>
              <CheckCircle size={14} /> Setujui
            </Button>
            <Button variant="danger" size="sm" onClick={() => reviewMut.mutate({ id: p.id, c: catatanReview, action: 'reject' })} isLoading={reviewMut.isPending}>
              Tolak
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setShowReview(false); setCatatanReview(''); }}>Batal</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <DetailCard title="Informasi Observasi" icon={<FileText size={14} className="text-blue-500" />}>
          <InfoRow icon={<Calendar size={11} />} label="Tanggal" value={new Date(p.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />
          {p.waktu && <InfoRow icon={<Clock size={11} />} label="Waktu" value={p.waktu} />}
          <InfoRow icon={<MapPin size={11} />} label="Lokasi" value={p.lokasi} />
        </DetailCard>
        <DetailCard title="Personil" icon={<User size={14} className="text-blue-500" />}>
          <InfoRow label="Observer" value={p.observer || '-'} />
          <InfoRow label="Auditee" value={p.auditee || '-'} />
          <InfoRow label="Kasubag Sistem & IT" value={p.kasubag || '-'} />
          <InfoRow label="Dibuat Oleh" value={p.user?.name || '-'} />
        </DetailCard>
      </div>

      {od.kategori_perilaku && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-3 flex items-center gap-2">
            <ClipboardCheck size={14} className="text-blue-500" /> Kategori Perilaku
          </h3>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold ${od.kategori_perilaku === 'safe' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
            {od.kategori_perilaku === 'safe' ? 'Safe' : 'At-Risk'}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
          const cat = od[key];
          if (!cat) return null;
          const items = cat.items || [];
          const lainnya = cat.lainnya;
          return (
            <DetailCard key={key} title={label}>
              {items.length > 0 ? (
                <div className="space-y-1">
                  {items.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                      <span className="text-xs text-gray-700 dark:text-gray-300">{item.label || item}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.value === 'safe' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {item.value === 'safe' ? 'Safe' : 'At-Risk'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
              {lainnya && <p className="text-xs text-gray-500 mt-1 italic">Lainnya: {lainnya}</p>}
              {items.length === 0 && !lainnya && <p className="text-xs text-gray-400 italic">Tidak ada item</p>}
            </DetailCard>
          );
        })}
      </div>

      {od.aktivitas && <DetailCard title="Aktifitas yang dilakukan"><p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{od.aktivitas}</p></DetailCard>}
      {od.observasi_perilaku && <DetailCard title="Observasi perilaku"><p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{od.observasi_perilaku}</p></DetailCard>}
      {od.alasan_beresiko && <DetailCard title="Alasan perilaku beresiko dilakukan"><p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{od.alasan_beresiko}</p></DetailCard>}

      {od.perlu_tindakan && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {p.tindakan_perbaikan && (
            <DetailCard title="Tindakan Perbaikan" icon={<AlertTriangle size={14} className="text-amber-500" />}>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{p.tindakan_perbaikan}</p>
            </DetailCard>
          )}
          {p.due_date && (
            <DetailCard title="Due Date" icon={<Calendar size={14} className="text-blue-500" />}>
              <p className="text-sm font-medium text-gray-800 dark:text-white">{new Date(p.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </DetailCard>
          )}
        </div>
      )}

      {p.foto && p.foto.length > 0 && (
        <DetailCard title="Dokumentasi Foto" icon={<Camera size={14} className="text-blue-500" />}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {p.foto.map((f, i) => {
              const baseStorageUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:8000';
              return (
              <a key={i} href={`${baseStorageUrl}/storage/${f}`} target="_blank" rel="noopener noreferrer"
                className="block aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <img src={`${baseStorageUrl}/storage/${f}`} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
              </a>
              )
            })}
          </div>
        </DetailCard>
      )}

      {p.catatan && (
        <DetailCard title="Catatan" icon={<ClipboardCheck size={14} className="text-green-500" />}>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-700 dark:text-green-300">{p.catatan}</p>
          </div>
        </DetailCard>
      )}

      <DetailCard title="Status & Riwayat Waktu" icon={<Clock size={14} className="text-blue-500" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Status Kasubag (Pak Oka)</p>
            <StatusBadge status={p.admin_status || 'pending'} />
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Status Audit</p>
            <StatusBadge status={p.audit_status || 'pending'} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {p.submitted_at && <TimestampItem label="Dibuat" value={p.submitted_at} />}
          {p.reviewed_at && <TimestampItem label="Dikonfirmasi" value={p.reviewed_at} />}
        </div>
      </DetailCard>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in" onClick={() => setShowDeleteConfirm(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-2xl space-y-4 mx-3 sm:mx-0 animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0"><Trash2 size={20} className="text-red-600 dark:text-red-400" /></div>
              <div><h3 className="font-bold text-gray-800 dark:text-white text-sm sm:text-base">Hapus Laporan?</h3><p className="text-xs text-gray-500 mt-0.5">Laporan ini akan dihapus secara permanen.</p></div>
            </div>
            <div className="flex items-center gap-2 justify-end pt-1">
              <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>Batal</Button>
              <Button variant="danger" size="sm" onClick={() => delMut.mutate(p.id)} isLoading={delMut.isPending}><Trash2 size={14} /> Ya, Hapus</Button>
            </div>
          </div>
        </div>
      )}

      {showPrintView && (
        <div className="fixed inset-0 z-[9999] bg-white overflow-y-auto" id="safety-behavior-print-preview-container">
          <div id="print-toolbar" className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm print:hidden">
            <h2 className="text-lg font-bold text-gray-800">Preview Cetak Safety Behavior</h2>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => window.print()}><Printer size={14} /> Cetak Sekarang</Button>
              <Button variant="outline" size="sm" onClick={() => setShowPrintView(false)}>
                Tutup
              </Button>
            </div>
          </div>
          <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg my-6 border border-gray-200 print:shadow-none print:border-none print:my-0 print:p-0">
            <SafetyBehaviorPrintView data={p} />
          </div>
        </div>
      )}
    </div>
  );
}

function DetailCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-gray-800 dark:text-white text-sm flex items-center gap-2">{icon}{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-xs py-1">
      <span className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</span>
      <span className="text-gray-500 min-w-[80px]">{label}:</span>
      <span className="font-medium text-gray-800 dark:text-white">{value}</span>
    </div>
  );
}

function TimestampItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
      <Clock size={12} className="text-gray-400" />
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{label}</p>
        <p className="text-xs text-gray-800 dark:text-white font-medium">{new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    </div>
  );
}
