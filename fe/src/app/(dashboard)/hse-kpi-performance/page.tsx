'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHseKpiData, getHseKpiEntries, createHseKpi, updateHseKpi, deleteHseKpi } from '@/lib/api/hseKpi';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';
import { Plus, Search, Edit, Trash2, BarChart3, ChevronLeft, ChevronRight, X, Calendar, FileText, Target, TrendingUp, Eye } from 'lucide-react';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface EntryData {
  id: number;
  period_start: string;
  period_end: string;
  week_name: string;
  user?: { id: number; name: string };
  [key: string]: any;
}

const emptyForm: Record<string, any> = {
  period_start: '',
  period_end: '',
  week_name: '',
  fatality: 0,
  lti: 0,
  rwdc: 0,
  mtc: 0,
  fac: 0,
  near_miss: 0,
  environmental_incident: 0,
  property_damage: 0,
  customer_formal_complaint: 0,
  hse_management_visit: 0,
  hse_joint_safety_patrol: 0,
  behavior_based_safe: 0,
  emergency_drill: 0,
  equipment_inspection: 0,
  hse_toolbox_meeting: 0,
  hse_meeting: 0,
  general_safety_talk: 0,
  safety_stand_down_meeting: 0,
  installation_of_safety_banner: 0,
  reward: 0,
  punishment: 0,
  campaign_bulan_k3_nasional: 0,
  hse_induction: 0,
  hse_training: 0,
  audit_program_internal: 0,
  audit_program_eksternal: 0,
};

export default function HseKpiPerformancePage() {
  const qc = useQueryClient();
  const [year, setYear] = useState(new Date().getFullYear());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Record<string, any>>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showEntries, setShowEntries] = useState(false);
  const [entriesPage, setEntriesPage] = useState(1);
  const [showDetail, setShowDetail] = useState<EntryData | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['hse-kpi', year],
    queryFn: () => getHseKpiData(year),
  });

  const { data: entriesData } = useQuery({
    queryKey: ['hse-kpi-entries', year, entriesPage],
    queryFn: () => getHseKpiEntries({ year, page: entriesPage, per_page: 15 }),
    enabled: showEntries,
  });

  const indicators = data?.data?.indicators;
  const months = data?.data?.months || [];
  const yearCumulative = data?.data?.year_cumulative;
  const totalEntries = data?.data?.total_entries || 0;
  const entries: EntryData[] = entriesData?.data?.data || [];
  const entriesPagination = entriesData?.data;

  const allIndicatorKeys = indicators
    ? [...Object.keys(indicators.lagging), ...Object.keys(indicators.leading)]
    : [];

  const delMut = useMutation({
    mutationFn: deleteHseKpi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hse-kpi'] });
      qc.invalidateQueries({ queryKey: ['hse-kpi-entries'] });
      toast.success('Data berhasil dihapus');
      setDeleteId(null);
    },
    onError: () => toast.error('Gagal menghapus data'),
  });

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  };

  const openEdit = async (id: number) => {
    try {
      const res = await getHseKpiEntries({ year, page: 1, per_page: 100 });
      const allEntries: EntryData[] = res?.data?.data || [];
      const entry = allEntries.find((e: EntryData) => e.id === id);
      if (entry) {
        setEditingId(id);
        const f: Record<string, any> = { ...emptyForm };
        Object.keys(emptyForm).forEach((k) => {
          f[k] = entry[k] !== undefined && entry[k] !== null ? entry[k] : '';
        });
        setForm(f);
        setShowForm(true);
      }
    } catch {
      toast.error('Gagal memuat data');
    }
  };

  const handleSave = async () => {
    if (!form.period_start || !form.period_end || !form.week_name) {
      toast.error('Lengkapi periode tanggal dan nama minggu');
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, any> = { ...form };
      allIndicatorKeys.forEach((k) => {
        payload[k] = parseInt(payload[k]) || 0;
      });

      if (editingId) {
        await updateHseKpi(editingId, payload);
        toast.success('Data KPI berhasil diperbarui');
      } else {
        await createHseKpi(payload);
        toast.success('Data KPI berhasil disimpan');
      }
      qc.invalidateQueries({ queryKey: ['hse-kpi'] });
      qc.invalidateQueries({ queryKey: ['hse-kpi-entries'] });
      setShowForm(false);
      setEditingId(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (d?: string) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const sectionLabels: Record<string, string> = {
    lagging: 'A. LAGGING INDICATORS',
    leading: 'B. LEADING INDICATORS',
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <BarChart3 size={18} />
            </div>
            HSSE KPI Performance
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 ml-11">
            Monitoring indikator KPI HSSE - {year}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={year}
            onChange={(e) => { setYear(parseInt(e.target.value)); setEntriesPage(1); }}
            className="px-3 py-2 bg-white dark:bg-[#1A1A2E] border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-[#1A365D] transition-all"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <Button onClick={() => setShowEntries(!showEntries)} variant="outline" size="sm">
            <Eye size={16} /> Entries ({totalEntries})
          </Button>
          <Button onClick={openAdd} size="sm" className="shadow-lg shadow-emerald-500/20">
            <Plus size={16} /> Input Data
          </Button>
        </div>
      </div>

      {/* Entries Panel */}
      {showEntries && (
        <div className="bg-white dark:bg-[#12121E] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Data Entries {year}</h3>
            <button onClick={() => setShowEntries(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-all">
              <X size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#1A1A2E] border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Week</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Periode</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Input By</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {entries.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">Belum ada data</td></tr>
                ) : entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-[#1A1A2E] transition-colors">
                    <td className="px-4 py-2.5 text-sm font-medium text-gray-800 dark:text-white">{entry.week_name}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300">
                      {formatDate(entry.period_start)} - {formatDate(entry.period_end)}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">{entry.user?.name || '-'}</td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setShowDetail(entry)} className="p-1.5 text-gray-400 hover:text-[#1A365D] dark:hover:text-[#4A8CC7] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all active:scale-90" title="Detail">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => openEdit(entry.id)} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all active:scale-90" title="Edit">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => setDeleteId(entry.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all active:scale-90" title="Hapus">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {entriesPagination && entriesPagination.last_page > 1 && (
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-800">
              <p className="text-xs text-gray-400">
                {((entriesPagination.current_page - 1) * entriesPagination.per_page) + 1} - {Math.min(entriesPagination.current_page * entriesPagination.per_page, entriesPagination.total)} / {entriesPagination.total}
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setEntriesPage(p => Math.max(1, p - 1))} disabled={entriesPagination.current_page === 1} className="p-1 text-gray-400 disabled:opacity-30">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => setEntriesPage(p => Math.min(entriesPagination.last_page, p + 1))} disabled={entriesPagination.current_page === entriesPagination.last_page} className="p-1 text-gray-400 disabled:opacity-30">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main KPI Table */}
      <div className="bg-white dark:bg-[#12121E] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#1A365D] dark:bg-[#0F2744]">
                <th className="text-center px-1.5 py-2 text-[11px] font-bold text-white uppercase tracking-wider w-7">No</th>
                <th className="text-left px-2 py-2 text-[11px] font-bold text-white uppercase tracking-wider min-w-[180px]">Key Performance Indicator</th>
                <th className="text-center px-1.5 py-2 text-[11px] font-bold text-white uppercase tracking-wider min-w-[55px]">Target</th>
                {monthNames.map((m) => (
                  <th key={m} className="text-center px-1 py-2 text-[11px] font-bold text-white uppercase tracking-wider min-w-[38px]">{m}</th>
                ))}
                <th className="text-center px-2 py-2 text-[11px] font-bold text-white uppercase tracking-wider min-w-[50px] bg-emerald-700">YTD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={16} className="px-4 py-8 text-center text-gray-400">
                    <span className="w-5 h-5 border-2 border-[#1A365D] border-t-transparent rounded-full animate-spin inline-block" />
                  </td>
                </tr>
              ) : !indicators ? (
                <tr>
                  <td colSpan={16} className="px-4 py-8 text-center text-gray-400">Gagal memuat data</td>
                </tr>
              ) : (
                <>
                  {/* Section: Lagging Indicators */}
                  <tr className="bg-gray-100 dark:bg-[#1A1A2E]">
                    <td colSpan={16} className="px-2.5 py-1.5 text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      A. LAGGING INDICATORS
                    </td>
                  </tr>
                  {Object.entries(indicators.lagging).map(([key, ind]: [string, any], idx) => (
                    <tr key={key} className="hover:bg-gray-50 dark:hover:bg-[#1A1A2E] transition-colors">
                      <td className="px-1.5 py-1.5 text-xs text-gray-400 text-center">{idx + 1}</td>
                      <td className="px-2 py-1.5 text-xs font-medium text-gray-800 dark:text-white">{ind.label}</td>
                      <td className="px-1.5 py-1.5 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">{ind.target}</td>
                      {months.map((m: any) => (
                        <td key={m.month_num} className={`px-1 py-1.5 text-center text-xs font-medium ${
                          m[key] > ind.target && ind.target > 0 ? 'text-red-600 dark:text-red-400 font-bold' :
                          m[key] > 0 && ind.target === 0 ? 'text-red-600 dark:text-red-400 font-bold' :
                          'text-gray-800 dark:text-white'
                        }`}>{m[key]}</td>
                      ))}
                      <td className={`px-2 py-1.5 text-center text-xs font-bold ${
                        yearCumulative && yearCumulative[key] > ind.target && ind.target > 0 ? 'text-red-600 dark:text-red-400' :
                        yearCumulative && yearCumulative[key] > 0 && ind.target === 0 ? 'text-red-600 dark:text-red-400' :
                        'text-emerald-700 dark:text-emerald-400'
                      }`}>{yearCumulative?.[key] || 0}</td>
                    </tr>
                  ))}

                  {/* Section: Leading Indicators */}
                  <tr className="bg-gray-100 dark:bg-[#1A1A2E]">
                    <td colSpan={16} className="px-2.5 py-1.5 text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      B. LEADING INDICATORS
                    </td>
                  </tr>
                  {Object.entries(indicators.leading).map(([key, ind]: [string, any], idx) => (
                    <tr key={key} className="hover:bg-gray-50 dark:hover:bg-[#1A1A2E] transition-colors">
                      <td className="px-1.5 py-1.5 text-xs text-gray-400 text-center">{idx + 1}</td>
                      <td className="px-2 py-1.5 text-xs font-medium text-gray-800 dark:text-white">
                        <span className="block">{ind.label}</span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 italic">{ind.target_desc}</span>
                      </td>
                      <td className="px-1.5 py-1.5 text-center text-[11px] text-gray-500 dark:text-gray-400 italic">{ind.target_desc}</td>
                      {months.map((m: any) => (
                        <td key={m.month_num} className="px-1 py-1.5 text-center text-xs text-gray-800 dark:text-white">{m[key]}</td>
                      ))}
                      <td className="px-2 py-1.5 text-center text-xs font-bold text-emerald-700 dark:text-emerald-400">{yearCumulative?.[key] || 0}</td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Input Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto animate-fade-in" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-4xl my-4 border border-gray-200 dark:border-gray-700 animate-scale-in">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-5 py-4 flex items-center justify-between z-10 rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                {editingId ? 'Edit Data KPI' : 'Input Data KPI Baru'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>
 
            <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Period */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Calendar size={16} /> Periode Data
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Tanggal Mulai</label>
                    <input
                      type="date"
                      value={form.period_start}
                      onChange={(e) => setForm({ ...form, period_start: e.target.value })}
                      className="hse-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Tanggal Selesai</label>
                    <input
                      type="date"
                      value={form.period_end}
                      onChange={(e) => setForm({ ...form, period_end: e.target.value })}
                      className="hse-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama Minggu (Week)</label>
                    <input
                      type="text"
                      value={form.week_name}
                      onChange={(e) => setForm({ ...form, week_name: e.target.value })}
                      className="hse-input text-sm"
                      placeholder="W#183"
                    />
                  </div>
                </div>
              </div>
 
              {indicators && (
                <>
                  {/* Lagging Indicators */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 px-1 uppercase tracking-wider">A. Lagging Indicators</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(indicators.lagging).map(([key, ind]: [string, any]) => (
                        <div key={key} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            {ind.label}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              value={form[key]}
                              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                              className="hse-input text-sm"
                            />
                            <span className="text-xs text-gray-400 whitespace-nowrap">Target: {ind.target}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
 
                  {/* Leading Indicators */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 px-1 uppercase tracking-wider">B. Leading Indicators</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(indicators.leading).map(([key, ind]: [string, any]) => (
                        <div key={key} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            {ind.label}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              value={form[key]}
                              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                              className="hse-input text-sm flex-1"
                            />
                            <span className="text-[10px] text-gray-400 italic max-w-[100px] leading-tight">{ind.target_desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
 
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-5 py-4 flex justify-end gap-3 rounded-b-2xl">
              <Button variant="outline" onClick={() => setShowForm(false)}>Batal</Button>
              <Button variant="primary" onClick={handleSave} isLoading={saving}>
                {editingId ? 'Simpan Perubahan' : 'Simpan Data'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={(e) => e.target === e.currentTarget && setShowDetail(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg border border-gray-200 dark:border-gray-700 animate-scale-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Detail Entry</h3>
              <button onClick={() => setShowDetail(null)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center gap-3 text-sm bg-gray-50 dark:bg-gray-900 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                <Calendar size={16} className="text-gray-400 shrink-0" />
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">{showDetail.week_name}</p>
                  <p className="text-xs text-gray-500">{formatDate(showDetail.period_start)} - {formatDate(showDetail.period_end)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {allIndicatorKeys.map((key) => {
                  const allInd = { ...indicators?.lagging, ...indicators?.leading };
                  const ind = allInd[key];
                  return (
                    <div key={key} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2.5 border border-gray-200 dark:border-gray-700">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mb-1">{ind?.label || key}</p>
                      <p className="text-sm font-bold text-gray-800 dark:text-white">{showDetail[key] ?? 0}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-900 flex justify-end">
              <Button variant="outline" onClick={() => setShowDetail(null)}>Tutup</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm border border-gray-200 dark:border-gray-700 p-6 animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white text-center mb-2">Hapus Data</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">Apakah Anda yakin ingin menghapus data ini?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-[0.97]">Batal</button>
              <button onClick={() => delMut.mutate(deleteId)} disabled={delMut.isPending} className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 active:scale-[0.97] flex items-center justify-center gap-2">
                {delMut.isPending ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
