'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getManHours, deleteManHours } from '@/lib/api/man-hours';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, Clock, Calendar, Download } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Modal from '@/components/ui/Modal';
import WifiLoader from '@/components/ui/WifiLoader';
import * as XLSX from 'xlsx';

export default function ManHoursListPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { user } = useAuth();
  if (user && user.role !== 'admin' && user.role !== 'kasubag') {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-red-200 dark:border-red-900/30 text-center max-w-md mx-auto my-12 shadow-sm animate-fade-in-up">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-600 dark:text-red-400">
          <Clock size={32} />
        </div>
        <h2 className="text-lg font-bold text-gray-850 dark:text-white">Akses Ditolak</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Anda tidak memiliki akses ke modul Rekap Man Hours. Silakan kembali ke Dashboard.
        </p>
        <Button onClick={() => router.push('/dashboard')} size="sm" className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const canEdit = user?.role === 'admin' || user?.role === 'kasubag';

  const { data, isLoading } = useQuery({
    queryKey: ['man-hours', selectedYear],
    queryFn: () => getManHours({ tahun: selectedYear }),
  });

  const delMut = useMutation({
    mutationFn: deleteManHours,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['man-hours'] });
      toast.success('Rekap bulanan berhasil dihapus');
    },
    onError: () => toast.error('Gagal menghapus rekap bulanan'),
  });

  const records = data?.data?.data?.records || [];
  const totals = data?.data?.data?.totals || {};
  const averages = data?.data?.data?.averages || {};

  const handleExport = () => {
    if (!records.length) {
      toast.warning('Tidak ada data untuk diekspor');
      return;
    }

    // Call the backend endpoint to download the formatted template
    const token = localStorage.getItem('token');
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/export/man-hours-excel?tahun=${selectedYear}`;
    
    // Create a temporary link to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Rekap_Man_Hours_${selectedYear}.xlsx`);
    
    // Optional: if token is needed for download, we might need to fetch it via blob
    // But since this is a GET request and if the export endpoint needs auth, 
    // it's better to fetch and create object URL. Let's do that for safety.
    
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.blob();
    })
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `Rekap_Man_Hours_${selectedYear}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch(error => {
      console.error('Error downloading export:', error);
      toast.error('Gagal mengekspor data');
    });
  };

  const years = useMemo(() => {
    const ys = [];
    const cy = parseInt(currentYear);
    for (let i = 2018; i <= cy + 1; i++) {
      ys.push(i.toString());
    }
    const reversed = ys.reverse();
    return ["2018-2025", ...reversed];
  }, [currentYear]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Clock size={18} />
            </div>
            Rekap Man Hours Bulanan
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 ml-11">
            Data Jam Kerja Karyawan per Bulan (INL, Kontraktor, Outsourcing)
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <Button onClick={() => router.push('/man-hours/create')} size="sm" className="shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus size={16} /> Isi Rekap Bulan
            </Button>
          )}
          <Button onClick={handleExport} size="sm" variant="outline" className="gap-2">
            <Download size={16} /> Export Excel
          </Button>
        </div>
      </div>

      {/* Filter Box */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-3">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Calendar size={16} /> Pilih Tahun:
        </label>
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}
          className="hse-input text-sm w-32"
        >
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-[10px]">
                <th className="px-1 py-1 border-r border-gray-300 dark:border-gray-600 font-bold" rowSpan={2}>Bulan</th>
                <th className="px-1 py-1 border-r border-gray-300 dark:border-gray-600 font-bold text-center" colSpan={4}>Man Power</th>
                <th className="px-1 py-1 border-r border-gray-300 dark:border-gray-600 font-bold text-center" colSpan={4}>Normal Jam Kerja</th>
                <th className="px-1 py-1 border-r border-gray-300 dark:border-gray-600 font-bold text-center" colSpan={4}>Overtime</th>
                <th className="px-1 py-1 border-r border-gray-300 dark:border-gray-600 font-bold text-center" rowSpan={2}>Total<br/>Jam Kerja</th>
                <th className="px-1 py-1 border-r border-gray-300 dark:border-gray-600 font-bold text-center" rowSpan={2}>Cuti<br/>Sakit</th>
                <th className="px-1 py-1 border-r border-gray-300 dark:border-gray-600 font-bold text-center" rowSpan={2}>Jam Kerja<br/>Aman</th>
                {canEdit && <th className="px-1 py-1 font-bold text-center" rowSpan={2}>Aksi</th>}
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-[9px]">
                {/* Man Power */}
                <th className="px-1 py-0.5 border-r border-gray-200 dark:border-gray-700 font-semibold text-center">INL</th>
                <th className="px-1 py-0.5 border-r border-gray-200 dark:border-gray-700 font-semibold text-center">Kontraktor</th>
                <th className="px-1 py-0.5 border-r border-gray-200 dark:border-gray-700 font-semibold text-center">Outsourcing</th>
                <th className="px-1 py-0.5 border-r border-gray-300 dark:border-gray-600 font-bold text-indigo-600 dark:text-indigo-400 text-center">Total</th>
                
                {/* Normal Jam Kerja */}
                <th className="px-1 py-0.5 border-r border-gray-200 dark:border-gray-700 font-semibold text-center">INL</th>
                <th className="px-1 py-0.5 border-r border-gray-200 dark:border-gray-700 font-semibold text-center">Kontraktor</th>
                <th className="px-1 py-0.5 border-r border-gray-200 dark:border-gray-700 font-semibold text-center">Outsourcing</th>
                <th className="px-1 py-0.5 border-r border-gray-300 dark:border-gray-600 font-bold text-indigo-600 dark:text-indigo-400 text-center">Total</th>
                
                {/* Overtime */}
                <th className="px-1 py-0.5 border-r border-gray-200 dark:border-gray-700 font-semibold text-center">INL</th>
                <th className="px-1 py-0.5 border-r border-gray-200 dark:border-gray-700 font-semibold text-center">Kontraktor</th>
                <th className="px-1 py-0.5 border-r border-gray-200 dark:border-gray-700 font-semibold text-center">Outsourcing</th>
                <th className="px-1 py-0.5 border-r border-gray-300 dark:border-gray-600 font-bold text-indigo-600 dark:text-indigo-400 text-center">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-gray-300 text-[10px]">
              {isLoading ? (
                <tr>
                  <td colSpan={17} className="px-2 py-8 text-center text-gray-500">
                    <div className="flex justify-center py-4"><WifiLoader text="Memuat data..." /></div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={17} className="px-2 py-8 text-center text-gray-500">
                    Belum ada data rekap untuk tahun {selectedYear}
                  </td>
                </tr>
              ) : (
                <>
                  {records.map((r: any) => (
                    <tr key={r.id} className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors text-right">
                      <td className="px-1 py-1.5 border-r border-gray-200 dark:border-gray-700 text-left font-bold">{r.bulan.substring(0,3)}</td>
                      
                      <td className="px-1 py-1.5 border-r border-gray-200 dark:border-gray-700">{r.manpower_inl}</td>
                      <td className="px-1 py-1.5 border-r border-gray-200 dark:border-gray-700">{r.manpower_kontraktor}</td>
                      <td className="px-1 py-1.5 border-r border-gray-200 dark:border-gray-700">{r.manpower_outsourcing}</td>
                      <td className="px-1 py-1.5 border-r border-gray-300 dark:border-gray-600 font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50/50 dark:bg-indigo-900/10">{r.total_manpower}</td>
                      
                      <td className="px-1 py-1.5 border-r border-gray-200 dark:border-gray-700">{Number(r.normal_jam_inl).toLocaleString('id-ID')}</td>
                      <td className="px-1 py-1.5 border-r border-gray-200 dark:border-gray-700">{Number(r.normal_jam_kontraktor).toLocaleString('id-ID')}</td>
                      <td className="px-1 py-1.5 border-r border-gray-200 dark:border-gray-700">{Number(r.normal_jam_outsourcing).toLocaleString('id-ID')}</td>
                      <td className="px-1 py-1.5 border-r border-gray-300 dark:border-gray-600 font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50/50 dark:bg-indigo-900/10">{Number(r.total_normal_jam).toLocaleString('id-ID')}</td>
                      
                      <td className="px-1 py-1.5 border-r border-gray-200 dark:border-gray-700">{Number(r.overtime_inl).toLocaleString('id-ID')}</td>
                      <td className="px-1 py-1.5 border-r border-gray-200 dark:border-gray-700">{Number(r.overtime_kontraktor).toLocaleString('id-ID')}</td>
                      <td className="px-1 py-1.5 border-r border-gray-200 dark:border-gray-700">{Number(r.overtime_outsourcing).toLocaleString('id-ID')}</td>
                      <td className="px-1 py-1.5 border-r border-gray-300 dark:border-gray-600 font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50/50 dark:bg-indigo-900/10">{Number(r.total_overtime).toLocaleString('id-ID')}</td>
                      
                      <td className="px-1 py-1.5 border-r border-gray-300 dark:border-gray-600 font-bold text-blue-700 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-900/20">{Number(r.total_jam_kerja).toLocaleString('id-ID')}</td>
                      <td className="px-1 py-1.5 border-r border-gray-300 dark:border-gray-600 font-bold text-rose-600 dark:text-rose-400 bg-rose-50/30 dark:bg-rose-900/10">{Number(r.cuti_sakit).toLocaleString('id-ID')}</td>
                      <td className="px-1 py-1.5 border-r border-gray-300 dark:border-gray-600 font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20">{Number(r.jam_kerja_aman).toLocaleString('id-ID')}</td>
                      
                      {canEdit && (
                        <td className="px-1 py-1.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => router.push(`/man-hours/${r.id}/edit`)} className="text-amber-500 hover:text-amber-600"><Edit size={12}/></button>
                            <button onClick={() => setDeleteId(r.id)} className="text-red-500 hover:text-red-600"><Trash2 size={12}/></button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                  {/* Totals Row */}
                  <tr className="bg-gray-100 dark:bg-gray-800 border-t-2 border-gray-300 dark:border-gray-600 font-bold text-right text-[10px]">
                    <td className="px-1 py-2 border-r border-gray-300 dark:border-gray-600 text-left text-gray-800 dark:text-gray-100">TOTAL</td>
                    <td colSpan={4} className="px-1 py-2 border-r border-gray-300 dark:border-gray-600 text-center text-[9px] text-gray-500 font-normal italic">
                      Avg: {averages.manpower_inl} | {averages.manpower_kontraktor} | {averages.manpower_outsourcing}
                    </td>
                    <td colSpan={3} className="border-r border-gray-200 dark:border-gray-700"></td>
                    <td className="px-1 py-2 border-r border-gray-300 dark:border-gray-600 text-indigo-700 dark:text-indigo-400">{Number(totals.normal_jam_inl + totals.normal_jam_kontraktor + totals.normal_jam_outsourcing).toLocaleString('id-ID')}</td>
                    <td colSpan={3} className="border-r border-gray-200 dark:border-gray-700"></td>
                    <td className="px-1 py-2 border-r border-gray-300 dark:border-gray-600 text-indigo-700 dark:text-indigo-400">{Number(totals.overtime_inl + totals.overtime_kontraktor + totals.overtime_outsourcing).toLocaleString('id-ID')}</td>
                    <td className="px-1 py-2 border-r border-gray-300 dark:border-gray-600 text-blue-700 dark:text-blue-400">{Number(totals.normal_jam_inl + totals.normal_jam_kontraktor + totals.normal_jam_outsourcing + totals.overtime_inl + totals.overtime_kontraktor + totals.overtime_outsourcing).toLocaleString('id-ID')}</td>
                    <td className="px-1 py-2 border-r border-gray-300 dark:border-gray-600 text-rose-600 dark:text-rose-400">{Number(totals.cuti_sakit).toLocaleString('id-ID')}</td>
                    <td className="px-1 py-2 border-r border-gray-300 dark:border-gray-600 text-emerald-700 dark:text-emerald-400">{Number((totals.normal_jam_inl + totals.normal_jam_kontraktor + totals.normal_jam_outsourcing + totals.overtime_inl + totals.overtime_kontraktor + totals.overtime_outsourcing) - totals.cuti_sakit).toLocaleString('id-ID')}</td>
                    {canEdit && <td></td>}
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE LIST VIEW */}
      <div className="lg:hidden space-y-3">
        {isLoading ? (
           <div className="flex justify-center py-4"><WifiLoader text="Memuat data..." /></div>
        ) : records.length === 0 ? (
           <div className="bg-white dark:bg-gray-900 rounded-xl p-8 text-center text-gray-500 shadow-sm border border-gray-200 dark:border-gray-700">
             Belum ada data rekap untuk tahun {selectedYear}
           </div>
        ) : (
          records.map((r: any) => (
            <div key={r.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-lg text-indigo-700 dark:text-indigo-400">{r.bulan} {r.tahun}</h3>
                {canEdit && (
                  <div className="flex gap-2">
                    <button onClick={() => router.push(`/man-hours/${r.id}/edit`)} className="p-1.5 text-amber-500 bg-amber-50 dark:bg-amber-900/20 rounded-md"><Edit size={14}/></button>
                    <button onClick={() => setDeleteId(r.id)} className="p-1.5 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md"><Trash2 size={14}/></button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Total Manpower</p>
                  <p className="font-bold text-gray-800 dark:text-gray-200">{r.total_manpower} Orang</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Total Normal Jam</p>
                  <p className="font-bold text-gray-800 dark:text-gray-200">{Number(r.total_normal_jam).toLocaleString('id-ID')} Jam</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Total Overtime</p>
                  <p className="font-bold text-gray-800 dark:text-gray-200">{Number(r.total_overtime).toLocaleString('id-ID')} Jam</p>
                </div>
                <div className="bg-rose-50 dark:bg-rose-900/20 p-2 rounded">
                  <p className="text-rose-600 dark:text-rose-400 mb-1">Cuti & Sakit</p>
                  <p className="font-bold text-rose-700 dark:text-rose-300">{Number(r.cuti_sakit).toLocaleString('id-ID')} Jam</p>
                </div>
              </div>
              
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg flex justify-between items-center border border-emerald-100 dark:border-emerald-800">
                <span className="font-bold text-emerald-800 dark:text-emerald-400">Jam Kerja Aman</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-500">{Number(r.jam_kerja_aman).toLocaleString('id-ID')}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) delMut.mutate(deleteId); setDeleteId(null); }}
        title="Hapus Rekap Bulanan"
        description="Apakah Anda yakin ingin menghapus data rekap bulan ini?"
        confirmText="Ya, Hapus"
        variant="danger"
        isLoading={delMut.isPending}
      />
    </div>
  );
}
