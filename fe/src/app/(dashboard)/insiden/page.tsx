'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInsiden, deleteInsiden } from '@/lib/api/insiden';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'react-toastify';
import { Plus, Search, Eye, Edit, Trash2, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Modal from '@/components/ui/Modal';
import WifiLoader from '@/components/ui/WifiLoader';
import ExportButtons from '@/components/ui/ExportButtons';

export default function InsidenListPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('');
  const [jenisF, setJenisF] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  if (user?.role === 'supervisor') {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-red-200 dark:border-red-900/30 text-center max-w-md mx-auto my-12 shadow-sm animate-fade-in-up">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-55 dark:bg-red-950/20 flex items-center justify-center text-red-600 dark:text-red-400">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-lg font-bold text-gray-850 dark:text-white">Akses Ditolak</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Supervisor tidak memiliki akses ke modul Laporan Insiden. Silakan kembali ke Dashboard.
        </p>
        <Button onClick={() => router.push('/dashboard')} size="sm" className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  const { data, isLoading } = useQuery({
    queryKey: ['insidens', search, statusF, jenisF, page],
    queryFn: () => getInsiden({ search, status: statusF, jenis: jenisF, page, per_page: 10 }),
  });

  const delMut = useMutation({
    mutationFn: deleteInsiden,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['insidens'] });
      toast.success('Laporan insiden berhasil dihapus');
    },
    onError: () => toast.error('Gagal menghapus laporan insiden'),
  });

  const insidens = data?.data?.data || [];
  const pg = data?.data?.pagination;

  const getJenisLabel = (jenis: string) => {
    switch (jenis) {
      case 'kecelakaan': return 'Kecelakaan';
      case 'near_miss': return 'Near Miss';
      case 'unsafe_condition': return 'Unsafe Condition';
      default: return jenis;
    }
  };

  const getJenisBadgeColor = (jenis: string) => {
    switch (jenis) {
      case 'kecelakaan': return 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400';
      case 'near_miss': return 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400';
      case 'unsafe_condition': return 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-700 text-white flex items-center justify-center shadow-lg shadow-red-500/30">
              <ShieldAlert size={18} />
            </div>
            Laporan Insiden
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 ml-11">
            Daftar kecelakaan, near miss, dan unsafe condition yang dilaporkan
          </p>
        </div>
        <div className="flex items-center gap-2">
          {user?.role === 'admin' && <ExportButtons module="insiden" hideExcel />}
          {user?.role === 'user' && (
            <Button onClick={() => router.push('/insiden/create')} size="sm" className="shadow-lg shadow-red-500/20 bg-red-600 hover:bg-red-700 text-white">
              <Plus size={16} /> Laporkan Insiden
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col md:flex-row gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari berdasarkan judul atau lokasi..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="hse-input text-sm"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:w-auto">
            <select
              value={jenisF}
              onChange={e => { setJenisF(e.target.value); setPage(1); }}
              className="hse-input text-sm min-w-[140px]"
            >
              <option value="">Semua Jenis</option>
              <option value="kecelakaan">Kecelakaan</option>
              <option value="near_miss">Near Miss</option>
              <option value="unsafe_condition">Unsafe Condition</option>
            </select>
            <select
              value={statusF}
              onChange={e => { setStatusF(e.target.value); setPage(1); }}
              className="hse-input text-sm min-w-[140px]"
            >
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="investigation">Dalam Penyelidikan</option>
              <option value="resolved">Selesai</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-55 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-3 py-2.5 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">#</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Judul</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Jenis</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Lokasi</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Tanggal</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-3 py-2.5 text-center text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    <div className="flex justify-center py-4"><WifiLoader text="Memuat data insiden..." /></div>
                  </td>
                </tr>
              ) : insidens.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <ShieldAlert size={28} className="text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="font-medium text-xs mb-1">Tidak ada laporan insiden</p>
                    <p className="text-xs text-gray-400">Gunakan tombol di atas untuk melaporkan insiden baru</p>
                  </td>
                </tr>
              ) : insidens.map((insiden: any, i: number) => {
                const sn = pg ? (pg.current_page - 1) * pg.per_page + 1 : 1;
                return (
                  <tr key={insiden.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors cursor-pointer" onClick={() => router.push(`/insiden/${insiden.id}`)}>
                    <td className="px-3 py-2.5 text-xs text-gray-400">{sn + i}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-xs font-semibold text-gray-850 dark:text-white line-clamp-1">{insiden.judul}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${getJenisBadgeColor(insiden.jenis)}`}>
                        {getJenisLabel(insiden.jenis)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-xs text-gray-600 dark:text-gray-300 line-clamp-1">{insiden.lokasi}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-xs text-gray-600 dark:text-gray-450">
                        {new Date(insiden.tanggal_kejadian).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <StatusBadge status={insiden.status} />
                    </td>
                    <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => router.push(`/insiden/${insiden.id}`)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                          title="Detail"
                        >
                          <Eye size={14} />
                        </button>
                        {(user?.role === 'admin' || user?.role === 'supervisor' || (user?.role === 'user' && insiden.status === 'pending')) && (
                          <button
                            onClick={() => router.push(`/insiden/${insiden.id}/edit`)}
                            className="p-1.5 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                        )}
                        {(user?.role === 'admin' || (user?.role === 'user' && insiden.status === 'pending')) && (
                          <button
                            onClick={() => setDeleteId(insiden.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={14} />
                          </button>
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
            <p className="text-[11px] sm:text-xs text-gray-500">
              {((pg.current_page - 1) * pg.per_page) + 1}-{Math.min(pg.current_page * pg.per_page, pg.total)} dari {pg.total}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={pg.current_page === 1}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 transition-colors"
              >
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: Math.min(5, pg.last_page) }, (_, i) => {
                const sp = Math.max(1, pg.current_page - 2);
                const n = sp + i;
                if (n > pg.last_page) return null;
                return (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-9 h-9 rounded-lg text-xs font-medium transition-all ${
                      n === pg.current_page
                        ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(pg.last_page, p + 1))}
                disabled={pg.current_page === pg.last_page}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 transition-colors"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) delMut.mutate(deleteId); setDeleteId(null); }}
        title="Hapus Laporan Insiden"
        description="Apakah Anda yakin ingin menghapus laporan insiden ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        variant="danger"
        isLoading={delMut.isPending}
      />
    </div>
  );
}
