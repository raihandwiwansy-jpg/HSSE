'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, AlertTriangle } from 'lucide-react';
import { masterDataApi, type MasterItem } from '@/lib/api/masterData';

interface JsaRow {
  id: string;
  proses: string;
  sifat: 'rutin' | 'non_rutin';
  tahapan: string;
  deskripsi_bahaya: string;
  identifikasi_bahaya: string;
  peluang: number;
  akibat: number;
  tindakan_pengendalian: string;
  pic: string;
  supervisi: string;
  keterangan: string;
}

interface JsaFormProps {
  value?: JsaRow[];
  onChange: (rows: JsaRow[]) => void;
}

const PELUANG = [
  { val: 1, label: '1 - Sangat Jarang' },
  { val: 2, label: '2 - Jarang' },
  { val: 3, label: '3 - Mungkin' },
  { val: 4, label: '4 - Hampir Pasti' },
  { val: 5, label: '5 - Pasti' },
];

const AKIBAT = [
  { val: 1, label: '1 - Tidak Ada' },
  { val: 2, label: '2 - Kecil' },
  { val: 3, label: '3 - Sedang' },
  { val: 4, label: '4 - Besar' },
  { val: 5, label: '5 - Fatal' },
];

function getRiskLevel(a: number, b: number) {
  const score = a * b;
  if (score <= 4) return { level: 'Rendah', color: 'bg-green-100 text-green-800 border-green-300' };
  if (score <= 9) return { level: 'Sedang', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
  if (score <= 16) return { level: 'Tinggi', color: 'bg-orange-100 text-orange-800 border-orange-300' };
  return { level: 'Ekstrim', color: 'bg-red-100 text-red-800 border-red-300' };
}

function genId() { return Math.random().toString(36).slice(2, 9); }

const emptyRow = (): JsaRow => ({
  id: genId(), proses: '', sifat: 'rutin', tahapan: '', deskripsi_bahaya: '',
  identifikasi_bahaya: '', peluang: 1, akibat: 1, tindakan_pengendalian: '',
  pic: '', supervisi: '', keterangan: '',
});

export default function JsaForm({ value, onChange }: JsaFormProps) {
  const rows = value || [];
  const [bahayaOptions, setBahayaOptions] = useState<MasterItem[]>([]);

  useEffect(() => {
    masterDataApi.getAll('bahaya').then((res) => {
      setBahayaOptions(res.data || []);
    }).catch(() => {});
  }, []);

  const u = (idx: number, k: keyof JsaRow, v: unknown) => {
    const next = rows.map((r, i) => i === idx ? { ...r, [k]: v } : r);
    onChange(next);
  };
  const add = () => onChange([...rows, emptyRow()]);
  const rm = (idx: number) => onChange(rows.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      {/* Risk Matrix Legend */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2.5 border border-blue-200 dark:border-blue-800">
        <p className="text-[10px] font-semibold text-blue-800 dark:text-blue-300 mb-1">Matriks Risiko (Peluang x Akibat)</p>
        <div className="flex flex-wrap gap-1.5 text-[9px]">
          <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-800 border border-green-300">1-4 Rendah</span>
          <span className="px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-800 border border-yellow-300">5-9 Sedang</span>
          <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-300">10-16 Tinggi</span>
          <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-300">17-25 Ekstrim</span>
        </div>
      </div>

      {/* Rows - Mobile Card View */}
      <div className="md:hidden space-y-2">
        {rows.map((row, idx) => {
          const risk = getRiskLevel(row.peluang, row.akibat);
          return (
            <div key={row.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical size={14} className="text-gray-400 dark:text-gray-500" />
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Tahapan {idx + 1}</span>
                  <select value={row.sifat} onChange={e => u(idx, 'sifat', e.target.value)}
                    className="text-[10px] border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-white dark:text-gray-200 outline-none">
                    <option value="rutin">Rutin</option>
                    <option value="non_rutin">Non Rutin</option>
                  </select>
                </div>
                <button onClick={() => rm(idx)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded">
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Row 1: Proses + Tahapan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <label className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Proses/Pekerjaan/Mesin/Alat</label>
                  <input value={row.proses} onChange={e => u(idx, 'proses', e.target.value)}
                    className="hse-input text-xs px-2 py-1"
                    placeholder="Misal: Loading karton" />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Tahapan Kegiatan / Deskripsi</label>
                  <input value={row.tahapan} onChange={e => u(idx, 'tahapan', e.target.value)}
                    className="hse-input text-xs px-2 py-1"
                    placeholder="Deskripsi tahapan pekerjaan" />
                </div>
              </div>

              {/* Row 2: Bahaya + Identifikasi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <label className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Deskripsi Bahaya</label>
                  <input value={row.deskripsi_bahaya} onChange={e => u(idx, 'deskripsi_bahaya', e.target.value)}
                    className="hse-input text-xs px-2 py-1"
                    placeholder="Bahaya potensial" />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Identifikasi Bahaya</label>
                  <select value={row.identifikasi_bahaya} onChange={e => u(idx, 'identifikasi_bahaya', e.target.value)}
                    className="hse-input text-xs px-2 py-1">
                    <option value="">Pilih tipe bahaya...</option>
                    {bahayaOptions.map((opt) => (
                      <option key={opt.id} value={opt.nama || ''}>{opt.nama}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Risk Assessment */}
              <div className="flex flex-wrap items-end gap-2">
                <div className="space-y-0.5">
                  <label className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Peluang (A)</label>
                  <select value={row.peluang} onChange={e => u(idx, 'peluang', Number(e.target.value))}
                    className="hse-input text-xs px-2 py-1 w-auto">
                    {PELUANG.map(p => <option key={p.val} value={p.val}>{p.label}</option>)}
                  </select>
                </div>
                <div className="space-y-0.5">
                  <label className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Akibat (B)</label>
                  <select value={row.akibat} onChange={e => u(idx, 'akibat', Number(e.target.value))}
                    className="hse-input text-xs px-2 py-1 w-auto">
                    {AKIBAT.map(a => <option key={a.val} value={a.val}>{a.label}</option>)}
                  </select>
                </div>
                <div className={`px-2 py-1.5 rounded-lg border text-[10px] font-bold ${risk.color}`}>
                  {row.peluang} x {row.akibat} = {row.peluang * row.akibat} ({risk.level})
                </div>
              </div>

              {/* Row 4: Control + PIC */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="space-y-0.5 sm:col-span-2">
                  <label className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Tindakan Pengendalian</label>
                  <input value={row.tindakan_pengendalian} onChange={e => u(idx, 'tindakan_pengendalian', e.target.value)}
                    className="hse-input text-xs px-2 py-1"
                    placeholder="Langkah pengendalian risiko" />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[10px] font-medium text-gray-600 dark:text-gray-400">PIC</label>
                  <input value={row.pic} onChange={e => u(idx, 'pic', e.target.value)}
                    className="hse-input text-xs px-2 py-1"
                    placeholder="Penanggung jawab" />
                </div>
              </div>

              {/* Row 5: Supervisi + Keterangan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <label className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Supervisi</label>
                  <input value={row.supervisi} onChange={e => u(idx, 'supervisi', e.target.value)}
                    className="hse-input text-xs px-2 py-1"
                    placeholder="Supervisor terkait" />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Keterangan</label>
                  <input value={row.keterangan} onChange={e => u(idx, 'keterangan', e.target.value)}
                    className="hse-input text-xs px-2 py-1"
                    placeholder="Catatan tambahan" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rows - Desktop Table View */}
      {rows.length > 0 && (
        <div className="hidden md:block overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                <th className="p-2.5 font-bold w-20 text-center border-r border-gray-200 dark:border-gray-700">No / Sifat</th>
                <th className="p-2.5 font-bold w-1/5 border-r border-gray-200 dark:border-gray-700">Proses & Tahapan Kerja</th>
                <th className="p-2.5 font-bold w-1/5 border-r border-gray-200 dark:border-gray-700">Bahaya & Identifikasi</th>
                <th className="p-2.5 font-bold w-36 border-r border-gray-200 dark:border-gray-700">Penilaian Risiko</th>
                <th className="p-2.5 font-bold w-1/5 border-r border-gray-200 dark:border-gray-700">Pengendalian & PIC</th>
                <th className="p-2.5 font-bold w-1/5 border-r border-gray-200 dark:border-gray-700">Supervisi & Catatan</th>
                <th className="p-2.5 font-bold w-12 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {rows.map((row, idx) => {
                const risk = getRiskLevel(row.peluang, row.akibat);
                return (
                  <tr key={row.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                    {/* No & Sifat */}
                    <td className="p-2.5 text-center align-top space-y-2 border-r border-gray-200 dark:border-gray-700">
                      <span className="font-bold text-gray-400 dark:text-gray-500 block text-[11px]">#{idx + 1}</span>
                      <select
                        value={row.sifat}
                        onChange={e => u(idx, 'sifat', e.target.value)}
                        className="w-full text-[10px] border border-gray-300 dark:border-gray-650 rounded px-1.5 py-0.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-white dark:text-gray-200 outline-none"
                      >
                        <option value="rutin">Rutin</option>
                        <option value="non_rutin">Non Rutin</option>
                      </select>
                    </td>

                    {/* Proses & Tahapan */}
                    <td className="p-2.5 align-top space-y-2 border-r border-gray-200 dark:border-gray-700">
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase tracking-wide font-semibold text-gray-400 dark:text-gray-500 block">Proses / Alat</label>
                        <input
                          value={row.proses}
                          onChange={e => u(idx, 'proses', e.target.value)}
                          className="hse-input text-xs px-2 py-1"
                          placeholder="Misal: Loading karton"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase tracking-wide font-semibold text-gray-400 dark:text-gray-500 block">Tahapan</label>
                        <textarea
                          value={row.tahapan}
                          onChange={e => u(idx, 'tahapan', e.target.value)}
                          rows={2}
                          className="hse-input text-xs px-2 py-1 resize-y min-h-[44px]"
                          placeholder="Deskripsi kegiatan..."
                        />
                      </div>
                    </td>

                    {/* Bahaya & Identifikasi */}
                    <td className="p-2.5 align-top space-y-2 border-r border-gray-200 dark:border-gray-700">
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase tracking-wide font-semibold text-gray-400 dark:text-gray-500 block">Potensi Bahaya</label>
                        <input
                          value={row.deskripsi_bahaya}
                          onChange={e => u(idx, 'deskripsi_bahaya', e.target.value)}
                          className="hse-input text-xs px-2 py-1"
                          placeholder="Kebocoran gas, terjepit..."
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase tracking-wide font-semibold text-gray-400 dark:text-gray-500 block">Tipe Bahaya</label>
                        <select
                          value={row.identifikasi_bahaya}
                          onChange={e => u(idx, 'identifikasi_bahaya', e.target.value)}
                          className="hse-input text-xs px-2 py-1"
                        >
                          <option value="">Pilih...</option>
                          {bahayaOptions.map((opt) => (
                            <option key={opt.id} value={opt.nama || ''}>{opt.nama}</option>
                          ))}
                        </select>
                      </div>
                    </td>

                    {/* Risk Assessment */}
                    <td className="p-2.5 align-top space-y-2 border-r border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-2 gap-1.5">
                        <div>
                          <label className="text-[8px] uppercase tracking-wide font-semibold text-gray-400 dark:text-gray-500 block mb-0.5">Peluang</label>
                          <select
                            value={row.peluang}
                            onChange={e => u(idx, 'peluang', Number(e.target.value))}
                            className="hse-input text-xs px-1 py-1"
                          >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[8px] uppercase tracking-wide font-semibold text-gray-400 dark:text-gray-500 block mb-0.5">Akibat</label>
                          <select
                            value={row.akibat}
                            onChange={e => u(idx, 'akibat', Number(e.target.value))}
                            className="hse-input text-xs px-1 py-1"
                          >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                          </select>
                        </div>
                      </div>
                      <div className={`mt-2 p-1 rounded border text-[9px] font-bold text-center ${risk.color}`}>
                        {row.peluang} x {row.akibat} = {row.peluang * row.akibat}
                        <span className="block font-medium text-[8px]">{risk.level}</span>
                      </div>
                    </td>

                    {/* Pengendalian & PIC */}
                    <td className="p-2.5 align-top space-y-2 border-r border-gray-200 dark:border-gray-700">
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase tracking-wide font-semibold text-gray-400 dark:text-gray-500 block">Langkah Pengendalian</label>
                        <textarea
                          value={row.tindakan_pengendalian}
                          onChange={e => u(idx, 'tindakan_pengendalian', e.target.value)}
                          rows={2}
                          className="hse-input text-xs px-2 py-1 resize-y min-h-[44px]"
                          placeholder="Tindakan pencegahan..."
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase tracking-wide font-semibold text-gray-400 dark:text-gray-500 block">PIC</label>
                        <input
                          value={row.pic}
                          onChange={e => u(idx, 'pic', e.target.value)}
                          className="hse-input text-xs px-2 py-1"
                          placeholder="Nama PIC"
                        />
                      </div>
                    </td>

                    {/* Supervisi & Catatan */}
                    <td className="p-2.5 align-top space-y-2 border-r border-gray-200 dark:border-gray-700">
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase tracking-wide font-semibold text-gray-400 dark:text-gray-500 block">Supervisi</label>
                        <input
                          value={row.supervisi}
                          onChange={e => u(idx, 'supervisi', e.target.value)}
                          className="hse-input text-xs px-2 py-1"
                          placeholder="Supervisor"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase tracking-wide font-semibold text-gray-400 dark:text-gray-500 block">Catatan</label>
                        <input
                          value={row.keterangan}
                          onChange={e => u(idx, 'keterangan', e.target.value)}
                          className="hse-input text-xs px-2 py-1"
                          placeholder="Keterangan..."
                        />
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="p-2.5 text-center align-middle">
                      <button
                        onClick={() => rm(idx)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"
                        title="Hapus Tahapan"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Row */}
      <button onClick={add}
        className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-xs font-medium text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
        <Plus size={14} /> Tambah Tahapan JSA
      </button>

      {rows.length === 0 && (
        <div className="text-center py-4">
          <AlertTriangle size={20} className="mx-auto text-yellow-400 mb-1" />
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Belum ada tahapan JSA. Klik tombol di atas untuk menambah.</p>
        </div>
      )}
    </div>
  );
}
