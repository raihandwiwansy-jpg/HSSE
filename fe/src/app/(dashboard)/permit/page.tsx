'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPermits, deletePermit, getPermitStatusCounts } from '@/lib/api/permit';
import { Permit, PermitStatusCounts } from '@/types';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'react-toastify';
import { Plus, Search, Eye, Edit, Trash2, FileText, ChevronLeft, ChevronRight, CheckCircle, XCircle, Send, FileCheck, LayoutGrid, List, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Modal from '@/components/ui/Modal';
import WifiLoader from '@/components/ui/WifiLoader';

const JENIS: Record<string,{l:string;full:string;i:string;c:string;bg:string}> = {
  gwp:{l:'GWP',full:'General Work Permit',i:'📄',c:'text-blue-600',bg:'bg-blue-500'},
  hwp:{l:'HWP',full:'Hot Work Permit',i:'🔥',c:'text-orange-600',bg:'bg-orange-500'},
  cse:{l:'CSE',full:'Confined Space Entry',i:'🚪',c:'text-purple-600',bg:'bg-purple-500'},
  elp:{l:'ELP',full:'Electrical Work Permit',i:'⚡',c:'text-yellow-600',bg:'bg-yellow-500'},
  ewp:{l:'EWP',full:'Excavation Work Permit',i:'🏗️',c:'text-amber-600',bg:'bg-amber-500'},
  lwp:{l:'LWP',full:'Lifting Work Permit',i:'🏗️',c:'text-teal-600',bg:'bg-teal-500'},
  rwp:{l:'RWP',full:'Radiography Work Permit',i:'☢️',c:'text-red-600',bg:'bg-red-500'},
  whp:{l:'WHP',full:'Work at Height Permit',i:'📏',c:'text-indigo-600',bg:'bg-indigo-500'},
};

export default function PermitListPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('');
  const [jenisF, setJenisF] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table'|'grid'>('table');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['permits', search, statusF, jenisF, page],
    queryFn: () => getPermits({ search, status: statusF, jenis: jenisF, page, per_page: 10 }),
  });
  const { data: countsData } = useQuery({ queryKey: ['permit-status-counts'], queryFn: () => getPermitStatusCounts() });

  const delMut = useMutation({ mutationFn: deletePermit, onSuccess: () => { qc.invalidateQueries({ queryKey: ['permits'] }); qc.invalidateQueries({ queryKey: ['permit-status-counts'] }); toast.success('Permit dihapus'); }, onError: () => toast.error('Gagal hapus') });

  const permits: Permit[] = data?.data?.data || [];
  const pg = data?.data?.pagination;
  const c: PermitStatusCounts = countsData?.data?.data || { total:0,draft:0,submitted:0,supervisor_approved:0,supervisor_rejected:0,hse_approved:0,hse_rejected:0,work_ready:0,completed:0 };

  const statusFilters = [
    { l:'Semua', v:'', ic:<FileText size={14}/>, bg:'bg-gray-500', count:c.total },
    { l:'Draft', v:'draft', ic:<FileCheck size={14}/>, bg:'bg-gray-400', count:c.draft },
    { l:'Submit', v:'submitted', ic:<Send size={14}/>, bg:'bg-amber-500', count:c.submitted },
    { l:'SPV OK', v:'supervisor_approved', ic:<CheckCircle size={14}/>, bg:'bg-blue-500', count:c.supervisor_approved },
    { l:'HSE OK', v:'hse_approved', ic:<CheckCircle size={14}/>, bg:'bg-emerald-500', count:c.hse_approved },
    { l:'Siap Kerja', v:'work_ready', ic:<Clock size={14}/>, bg:'bg-purple-500', count:c.work_ready },
    { l:'Selesai', v:'completed', ic:<CheckCircle size={14}/>, bg:'bg-green-600', count:c.completed },
    { l:'Ditolak', v:'rejected', ic:<XCircle size={14}/>, bg:'bg-red-500', count:c.supervisor_rejected+c.hse_rejected },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FileText size={18}/>
            </div>
            Permit / Izin Kerja
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 ml-11">Kelola semua izin kerja dalam satu halaman</p>
        </div>
        {user?.role === 'user' && (
          <Button onClick={() => router.push('/permit/create')} size="sm" className="shadow-lg shadow-blue-500/20">
            <Plus size={16}/> Buat Izin Baru
          </Button>
        )}
      </div>


      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
          <input type="text" placeholder="Cari permit berdasarkan nomor, judul, atau lokasi..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} className="hse-input text-sm" style={{ paddingLeft: '2.5rem' }}/>
          </div>
          <div className="flex gap-2">
            <select value={jenisF} onChange={e=>{setJenisF(e.target.value);setPage(1);}} className="hse-input text-sm min-w-[120px]">
              <option value="">Semua Jenis</option>
              {Object.entries(JENIS).map(([k,v])=>(<option key={k} value={k}>{v.i} {v.l}</option>))}
            </select>
            <select value={statusF} onChange={e=>{setStatusF(e.target.value);setPage(1);}} className="hse-input text-sm min-w-[160px]">
              <option value="">Semua Status</option>
              <option value="draft">Draft</option><option value="submitted">Menunggu Supervisor</option>
              <option value="supervisor_approved">Menunggu HSSE</option><option value="supervisor_rejected">Ditolak Supervisor</option>
              <option value="hse_approved">Disetujui HSSE</option><option value="hse_rejected">Ditolak HSSE</option>
              <option value="work_ready">Siap Dikerjakan</option><option value="completed">Selesai</option>
            </select>
            <div className="hidden sm:flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-lg p-0.5">
              <button onClick={()=>setViewMode('table')} className={`p-1.5 rounded ${viewMode==='table'?'bg-blue-500 text-white':'text-gray-400 hover:text-gray-600'}`}><List size={14}/></button>
              <button onClick={()=>setViewMode('grid')} className={`p-1.5 rounded ${viewMode==='grid'?'bg-blue-500 text-white':'text-gray-400 hover:text-gray-600'}`}><LayoutGrid size={14}/></button>
            </div>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-2.5 py-2 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">#</th>
                  <th className="px-2.5 py-2 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">No. Permit</th>
                  <th className="px-2.5 py-2 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Jenis</th>
                  <th className="px-2.5 py-2 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Judul</th>
                  <th className="px-2.5 py-2 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Lokasi</th>
                  <th className="px-2.5 py-2 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-2.5 py-2 text-left text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Tanggal</th>
                  <th className="px-2.5 py-2 text-center text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {isLoading ? (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    <div className="flex justify-center py-4"><WifiLoader text="Memuat data..." /></div>
                  </td></tr>
                ) : permits.length===0 ? (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <FileText size={28} className="text-gray-300"/>
                    </div>
                    <p className="font-medium text-xs mb-1">Tidak ada permit ditemukan</p>
                    <p className="text-xs text-gray-400">Buat permit baru untuk memulai</p>
                  </td></tr>
                ) : permits.map((p,i) => {
                  const j = JENIS[p.jenis]||{l:p.jenis,full:p.jenis,i:'📋',c:'text-gray-600',bg:'bg-gray-500'};
                  const sn = pg?(pg.current_page-1)*pg.per_page+1:1;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={()=>router.push(`/permit/${p.id}`)}>
                      <td className="px-2.5 py-1.5 text-xs text-gray-400">{sn+i}</td>
                      <td className="px-2.5 py-1.5">
                        <span className="font-mono text-xs font-semibold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{p.permit_number}</span>
                      </td>
                      <td className="px-2.5 py-1.5 hidden sm:table-cell">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 dark:bg-gray-700 ${j.c}`}>{j.i} {j.l}</span>
                      </td>
                      <td className="px-2.5 py-1.5"><p className="text-xs font-medium text-gray-800 dark:text-white truncate max-w-[140px] sm:max-w-[220px]">{p.judul}</p></td>
                      <td className="px-2.5 py-1.5 hidden md:table-cell"><p className="text-xs text-gray-500 truncate max-w-[140px]">{p.lokasi}</p></td>
                      <td className="px-2.5 py-1.5"><StatusBadge status={p.status}/></td>
                      <td className="px-2.5 py-1.5 text-xs text-gray-500 hidden lg:table-cell">
                        {new Date(p.tanggal).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})}
                      </td>
                      <td className="px-2.5 py-1.5" onClick={e=>e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={()=>router.push(`/permit/${p.id}`)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors" title="Detail"><Eye size={14}/></button>
                          {(user?.role === 'admin' || (user?.role === 'user' && (p.status==='draft'||p.status==='supervisor_rejected'||p.status==='hse_rejected'))) && (
                            <button onClick={()=>router.push(`/permit/${p.id}/edit`)} className="p-1.5 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-colors" title="Edit"><Edit size={14}/></button>
                          )}
                          {(user?.role === 'admin' || (user?.role !== 'admin' && (p.status==='draft'||p.status==='completed')))&&(
                            <button onClick={()=>setDeleteId(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors" title="Hapus"><Trash2 size={14}/></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {pg&&pg.last_page>1&&(
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-[11px] sm:text-xs text-gray-500">{((pg.current_page-1)*pg.per_page)+1}-{Math.min(pg.current_page*pg.per_page,pg.total)} dari {pg.total} permit</p>
              <div className="flex items-center gap-1">
                <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={pg.current_page===1} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 transition-colors"><ChevronLeft size={15}/></button>
                {Array.from({length:Math.min(5,pg.last_page)},(_,i)=>{const sp=Math.max(1,pg.current_page-2);const n=sp+i;if(n>pg.last_page)return null;return(
                  <button key={n} onClick={()=>setPage(n)} className={`w-9 h-9 rounded-lg text-xs font-medium transition-all ${n===pg.current_page?'bg-blue-500 text-white shadow-md shadow-blue-500/30':'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{n}</button>
                );})}
                <button onClick={()=>setPage(p=>Math.min(pg.last_page,p+1))} disabled={pg.current_page===pg.last_page} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 transition-colors"><ChevronRight size={15}/></button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {isLoading ? (
            Array.from({length:6}).map((_,i)=>(
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"/>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"/>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"/>
              </div>
            ))
          ) : permits.length===0 ? (
            <div className="col-span-full text-center py-16">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <FileText size={28} className="text-gray-300"/>
              </div>
              <p className="font-medium text-sm text-gray-500">Tidak ada permit ditemukan</p>
            </div>
          ) : permits.map(p => {
            const j = JENIS[p.jenis]||{l:p.jenis,full:p.jenis,i:'📋',c:'text-gray-600',bg:'bg-gray-500'};
            return (
              <div key={p.id} onClick={()=>router.push(`/permit/${p.id}`)} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg ${j.bg} text-white flex items-center justify-center text-sm group-hover:scale-110 transition-transform`}>{j.i}</div>
                    <div>
                      <p className="font-mono text-xs font-semibold text-gray-800 dark:text-white">{p.permit_number}</p>
                      <p className="text-[10px] text-gray-400">{j.full}</p>
                    </div>
                  </div>
                  <StatusBadge status={p.status}/>
                </div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-1 truncate">{p.judul}</h3>
                <p className="text-xs text-gray-500 mb-3 truncate">{p.lokasi}</p>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-[10px] text-gray-400">{new Date(p.tanggal).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})}</p>
                  <div className="flex gap-1" onClick={e=>e.stopPropagation()}>
                    <button onClick={()=>router.push(`/permit/${p.id}`)} className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"><Eye size={12}/></button>
                    {(user?.role === 'admin' || (user?.role === 'user' && (p.status==='draft'||p.status==='supervisor_rejected'||p.status==='hse_rejected'))) && (
                      <button onClick={()=>router.push(`/permit/${p.id}/edit`)} className="p-1 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded"><Edit size={12}/></button>
                    )}
                    {(user?.role === 'admin' || (user?.role !== 'admin' && (p.status==='draft'||p.status==='completed')))&&(
                      <button onClick={()=>setDeleteId(p.id)} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><Trash2 size={12}/></button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) delMut.mutate(deleteId); setDeleteId(null); }}
        title="Hapus Permit" description="Apakah Anda yakin ingin menghapus permit ini? Data yang dihapus tidak dapat dikembalikan."
        confirmText="Ya, Hapus" variant="danger" isLoading={delMut.isPending} />
    </div>
  );
}
