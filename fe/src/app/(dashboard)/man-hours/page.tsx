'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getManHours, deleteManHours, updateManHoursStatus } from '@/lib/api/man-hours';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';
import { Plus, Search, Edit, Trash2, Clock, ChevronLeft, ChevronRight, Play, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Modal from '@/components/ui/Modal';
import WifiLoader from '@/components/ui/WifiLoader';

export default function ManHoursListPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const isAdmin = user?.role === 'admin';

  const { data, isLoading } = useQuery({
    queryKey: ['man-hours', search, dateFrom, dateTo, status, page],
    queryFn: () => getManHours({ search, date_from: dateFrom, date_to: dateTo, status, page, per_page: 10 }),
  });

  const delMut = useMutation({
    mutationFn: deleteManHours,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['man-hours'] });
      toast.success('Penugasan kerja berhasil dihapus');
    },
    onError: () => toast.error('Gagal menghapus penugasan kerja'),
  });

  const statusMut = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'pending' | 'in_progress' | 'completed' }) => 
      updateManHoursStatus(id, status),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['man-hours'] });
      qc.invalidateQueries({ queryKey: ['dashboard-summary'] });
      qc.invalidateQueries({ queryKey: ['dashboard-role-data'] });
      let msg = 'Tugas berhasil dimulai';
      if (variables.status === 'completed') msg = 'Tugas berhasil diselesaikan! Safe man-hours dicatat.';
      toast.success(msg);
    },
    onError: () => toast.error('Gagal memperbarui status tugas'),
  });

  const tasks = data?.data?.data || [];
  const pg = data?.data?.pagination;

  const handleUpdateStatus = (id: number, nextStatus: 'pending' | 'in_progress' | 'completed') => {
    statusMut.mutate({ id, status: nextStatus });
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50">
            Pending
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50">
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-800 border border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50">
            Selesai
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-800 border border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800">
            {s}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Clock size={18} />
            </div>
            Safe Man Hours & Penugasan Kerja
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 ml-11">
            {isAdmin 
              ? 'Kelola dan berikan penugasan kerja kepada karyawan untuk pencatatan Safe Man Hours.' 
              : 'Daftar penugasan kerja Anda. Selesaikan tugas untuk mencatatkan Safe Man Hours Anda.'}
          </p>
        </div>
        {isAdmin && (
          <div>
            <Button onClick={() => router.push('/man-hours/create')} size="sm" className="shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus size={16} /> Tambah Tugas Kerja
            </Button>
          </div>
        )}
      </div>

      {/* Filter Box */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-3">
          <div className="relative md:col-span-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder={isAdmin ? "Cari tugas, lokasi, nama karyawan..." : "Cari tugas atau lokasi..."}
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="hse-input text-sm w-full"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <div>
            <select
              value={status}
              onChange={e => { setStatus(e.target.value); setPage(1); }}
              className="hse-input text-sm w-full"
            >
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed (Selesai)</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={e => { setDateFrom(e.target.value); setPage(1); }}
              className="hse-input text-sm w-full"
              placeholder="Dari"
            />
            <input
              type="date"
              value={dateTo}
              onChange={e => { setDateTo(e.target.value); setPage(1); }}
              className="hse-input text-sm w-full"
              placeholder="Sampai"
            />
          </div>
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Pekerjaan / Detail</th>
                {isAdmin && (
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Ditugaskan Kepada</th>
                )}
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Lokasi</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Tanggal</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Durasi</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} className="px-4 py-12 text-center text-gray-500">
                    <div className="flex justify-center py-4"><WifiLoader text="Memuat daftar tugas..." /></div>
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} className="px-4 py-12 text-center text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Clock size={28} className="text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="font-medium text-xs mb-1">Tidak ada catatan penugasan kerja</p>
                    <p className="text-xs text-gray-400">
                      {isAdmin ? 'Klik tombol di atas untuk menambah penugasan baru.' : 'Anda belum menerima penugasan kerja.'}
                    </p>
                  </td>
                </tr>
              ) : tasks.map((task: any, i: number) => {
                const sn = pg ? (pg.current_page - 1) * pg.per_page + 1 : 1;
                return (
                  <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-850/40 transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-400">{sn + i}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-850 dark:text-white">{task.judul_pekerjaan}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{task.deskripsi || '-'}</p>
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-xs font-semibold text-gray-805 dark:text-white">{task.user?.name || '-'}</p>
                          <p className="text-[10px] text-gray-400">NIK: {task.user?.karyawan?.nik || '-'}</p>
                        </div>
                      </td>
                    )}
                    <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300 font-medium">
                      {task.lokasi}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-800 dark:text-white font-medium">
                        {new Date(task.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400">
                        {task.durasi_jam} Jam
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(task.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {/* Admin Action Buttons */}
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => router.push(`/man-hours/${task.id}/edit`)}
                              className="p-1.5 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-colors"
                              title="Edit Penugasan"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteId(task.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                              title="Hapus Penugasan"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}

                        {/* Karyawan Interactive Progress Buttons */}
                        {!isAdmin && (
                          <>
                            {task.status === 'pending' && (
                              <Button
                                onClick={() => handleUpdateStatus(task.id, 'in_progress')}
                                size="sm"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 font-semibold"
                                isLoading={statusMut.isPending && statusMut.variables?.id === task.id}
                              >
                                <Play size={12} /> Mulai Bekerja
                              </Button>
                            )}
                            {task.status === 'in_progress' && (
                              <Button
                                onClick={() => handleUpdateStatus(task.id, 'completed')}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1 font-semibold"
                                isLoading={statusMut.isPending && statusMut.variables?.id === task.id}
                              >
                                <CheckCircle size={12} /> Selesaikan Tugas
                              </Button>
                            )}
                            {task.status === 'completed' && (
                              <span className="text-[11px] text-green-600 dark:text-green-455 font-medium flex items-center gap-1">
                                <CheckCircle size={12} /> Tugas Selesai
                              </span>
                            )}
                          </>
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
                        ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
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
        title="Hapus Penugasan Kerja"
        description="Apakah Anda yakin ingin menghapus catatan penugasan kerja ini?"
        confirmText="Ya, Hapus"
        variant="danger"
        isLoading={delMut.isPending}
      />
    </div>
  );
}
