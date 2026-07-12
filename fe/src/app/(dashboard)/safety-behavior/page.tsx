'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSafetyBehaviors, deleteSafetyBehavior, getSafetyBehaviorStatusCounts } from '@/lib/api/safetyBehavior';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'react-toastify';
import { Plus, Search, Eye, Edit, Trash2, FileText, ChevronLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import ExportButtons from '@/components/ui/ExportButtons';
import { useAuth } from '@/hooks/useAuth';
import Modal from '@/components/ui/Modal';
import WifiLoader from '@/components/ui/WifiLoader';

export default function SafetyBehaviorListPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['safety-behaviors', search, statusF, page],
    queryFn: () => getSafetyBehaviors({ search, status: statusF, page, per_page: 10 }),
  });
  const { data: countsData } = useQuery({ queryKey: ['safety-behavior-status-counts'], queryFn: () => getSafetyBehaviorStatusCounts() });

  const delMut = useMutation({
    mutationFn: deleteSafetyBehavior,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['safety-behaviors'] }); qc.invalidateQueries({ queryKey: ['safety-behavior-status-counts'] }); toast.success('Safety behavior dihapus'); },
    onError: () => toast.error('Gagal hapus'),
  });

  const items = data?.data?.data || [];
  const pg = data?.data?.pagination;
  const c = countsData?.data?.data || { total: 0, menunggu: 0, selesai: 0 };

  const statusFilters = [
    { l: 'Semua', v: '', ic: <FileText size={14} />, bg: 'bg-gray-500', count: c.total },
    { l: 'Menunggu', v: 'menunggu', ic: <Clock size={14} />, bg: 'bg-amber-500', count: c.menunggu },
    { l: 'Selesai', v: 'selesai', ic: <CheckCircle size={14} />, bg: 'bg-green-500', count: c.selesai },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FileText size={18} />
            </div>
            Safety Behavior Observation
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 ml-11">Observasi perilaku keselamatan kerja</p>
        </div>
        <div className="flex items-center gap-2">
          {user?.role === 'admin' && <ExportButtons module="safety-behavior" hideExcel />}
          {user?.role === 'user' && (
            <Button onClick={() => router.push('/safety-behavior/create')} size="sm" className="shadow-lg shadow-blue-500/20">
              <Plus size={16} /> Buat Laporan Baru
            </Button>
          )}
        </div>
      </div>


      <div className="bg-white dark:bg-gray-900 rounded-2xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input type="text" placeholder="Cari berdasarkan lokasi, observer, auditee..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="hse-input text-sm" style={{ paddingLeft: '2.5rem' }} />
          </div>
          <div className="flex gap-2">
            <select value={statusF} onChange={e => { setStatusF(e.target.value); setPage(1); }} className="hse-input text-sm min-w-[140px]">
              <option value="">Semua Status</option>
              <option value="menunggu">Menunggu Konfirmasi</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-2.5 py-2 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">#</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Tanggal</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Lokasi</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Observer</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Kategori</th>
                <th className="px-2.5 py-2 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-2.5 py-2 text-center text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {isLoading ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                  <div className="flex justify-center py-4"><WifiLoader text="Memuat data..." /></div>
                </td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center"><FileText size={28} className="text-gray-300" /></div>
                  <p className="font-medium text-xs mb-1">Tidak ada laporan safety behavior</p>
                  <p className="text-xs text-gray-400">Buat laporan baru untuk memulai</p>
                </td></tr>
              ) : items.map((p: any, i: number) => {
                const sn = pg ? (pg.current_page - 1) * pg.per_page + 1 : 1;
                const od = p.observation_data || {};
                const kat = od.kategori_perilaku === 'safe' ? 'Safe' : od.kategori_perilaku === 'at_risk' ? 'At-Risk' : '-';
                return (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={() => router.push(`/safety-behavior/${p.id}`)}>
                    <td className="px-2.5 py-1.5 text-xs text-gray-400">{sn + i}</td>
                    <td className="px-2.5 py-1.5"><span className="text-xs font-medium text-gray-800 dark:text-white">{new Date(p.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span></td>
                    <td className="px-2.5 py-1.5"><p className="text-xs font-medium text-gray-800 dark:text-white truncate max-w-[180px]">{p.lokasi}</p></td>
                    <td className="px-2.5 py-1.5 hidden sm:table-cell"><p className="text-xs text-gray-600 dark:text-gray-400">{p.observer || '-'}</p></td>
                    <td className="px-2.5 py-1.5 hidden md:table-cell"><span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${kat === 'Safe' ? 'bg-green-100 text-green-700' : kat === 'At-Risk' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>{kat}</span></td>
                    <td className="px-2.5 py-1.5"><StatusBadge status={p.status} /></td>
                    <td className="px-2.5 py-1.5" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => router.push(`/safety-behavior/${p.id}`)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors" title="Detail"><Eye size={14} /></button>
                        {(user?.role === 'admin' || (user?.role === 'user' && p.status === 'menunggu')) && (
                          <button onClick={() => router.push(`/safety-behavior/${p.id}/edit`)} className="p-1.5 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-colors" title="Edit"><Edit size={14} /></button>
                        )}
                        {(user?.role === 'admin' || (user?.role === 'user' && p.status === 'menunggu')) && (
                          <button onClick={() => setDeleteId(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors" title="Hapus"><Trash2 size={14} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {pg && pg.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-[11px] sm:text-xs text-gray-500">{((pg.current_page - 1) * pg.per_page) + 1}-{Math.min(pg.current_page * pg.per_page, pg.total)} dari {pg.total}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={pg.current_page === 1} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50"><ChevronLeft size={15} /></button>
              {Array.from({ length: Math.min(5, pg.last_page) }, (_, i) => { const sp = Math.max(1, pg.current_page - 2); const n = sp + i; if (n > pg.last_page) return null; return (
                <button key={n} onClick={() => setPage(n)} className={`w-9 h-9 rounded-lg text-xs font-medium transition-all ${n === pg.current_page ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{n}</button>
              );})}
              <button onClick={() => setPage(p => Math.min(pg.last_page, p + 1))} disabled={pg.current_page === pg.last_page} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50"><ChevronRight size={15} /></button>
            </div>
          </div>
        )}
      </div>
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) delMut.mutate(deleteId); setDeleteId(null); }}
        title="Hapus Laporan" description="Apakah Anda yakin ingin menghapus laporan safety behavior ini?"
        confirmText="Ya, Hapus" variant="danger" isLoading={delMut.isPending} />
    </div>
  );
}
