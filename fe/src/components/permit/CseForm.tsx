'use client';
import Input from '@/components/ui/Input';
import { useEffect } from 'react';
import { getNextSequence } from '@/lib/api/permit';
import { Plus, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import MasterSelect from '@/components/ui/MasterSelect';
import DynamicFields from './DynamicFields';
import PermitApprovalTable from './PermitApprovalTable';

interface CseFormProps { data: Record<string, unknown>; onChange: (d: Record<string, unknown>) => void; }

export default function CseForm({ data, onChange }: CseFormProps) {
  const u = (k: string, v: unknown) => onChange({ ...data, [k]: v });
  const orang = (data.daftar_orang as {nama:string;masuk:string;keluar:string}[]) || [{ nama:'', masuk:'', keluar:'' }];
  const cseLog = (data.cse_log as {no:number;nama:string;jam_masuk:string;kegiatan:string;jam_keluar:string;keterangan:string}[]) || [{ no:1, nama:'', jam_masuk:'', kegiatan:'', jam_keluar:'', keterangan:'' }];

  useEffect(() => {
    const fetch = async () => {
      try {
        const [numRes, seqRes] = await Promise.all([
          getNextSequence('permit_number', 'cse'),
          getNextSequence('no_izin_kerja_umum'),
        ]);
        const upd: Record<string,unknown> = {};
        const permitNum = numRes?.data?.data?.next;
        const seq = seqRes?.data?.data?.next;
        if (permitNum && !data.no_permit_cse) upd.no_permit_cse = permitNum;
        if (seq && !data.no_izin_kerja_umum) upd.no_izin_kerja_umum = seq;
        if (Object.keys(upd).length) onChange({...data, ...upd});
      } catch {}
    };
    fetch();
  }, []);

  const addOrang = () => { const n = [...orang, { nama:'', masuk:'', keluar:'' }]; u('daftar_orang', n); };
  const rmOrang = (i:number) => { const n = orang.filter((_,x)=>x!==i); u('daftar_orang', n); };
  const upOrang = (i:number, f:string, v:string) => { const n = [...orang]; (n[i] as any)[f]=v; u('daftar_orang', n); };

  const addCseLog = () => { const n = [...cseLog, { no:cseLog.length+1, nama:'', jam_masuk:'', kegiatan:'', jam_keluar:'', keterangan:'' }]; u('cse_log', n); };
  const rmCseLog = (i:number) => { const n = cseLog.filter((_,x)=>x!==i).map((r,idx)=>({...r, no:idx+1})); u('cse_log', n); };
  const upCseLog = (i:number, f:string, v:string) => { const n = [...cseLog]; (n[i] as any)[f]=v; u('cse_log', n); };

  const checklist = (data.checklist_persyaratan as string[]) || [];
  const toggleChecklist = (item: string) => {
    const n = checklist.includes(item) ? checklist.filter(x => x !== item) : [...checklist, item];
    u('checklist_persyaratan', n);
  };

  return (
    <div className="space-y-5">
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src="/Picture1.png" alt="Logo INL" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
          <div className="text-left space-y-0.5">
            <h2 className="text-base font-bold text-gray-800 dark:text-white leading-tight">PT. INDUSTRI NABATI LESTARI</h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">KEK Sei Mangkei, Kab. Simalungun, Sumatera Utara</p>
          </div>
        </div>
        <div className="text-center mb-3">
          <p className="text-xs italic text-gray-600 dark:text-gray-400">Izin ini hanya berlaku untuk satu shift kerja</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <Input label="No. Permit CSE" name="no_permit_cse" value={(data.no_permit_cse as string)||''} onChange={e=>u('no_permit_cse',e.target.value)} register={()=>({})} readOnly placeholder="Auto" />
          <Input label="No. Izin Kerja Umum (GWP)" name="no_izin_kerja_umum" value={(data.no_izin_kerja_umum as string)||''} onChange={e=>u('no_izin_kerja_umum',e.target.value)} register={()=>({})} readOnly placeholder="Auto" />
        </div>

        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2">
            <h4 className="font-semibold text-xs text-gray-800 dark:text-white uppercase">Section A - Diisi oleh Pemohon Izin</h4>
          </div>
          <div className="p-3 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Tanggal" name="tanggal" type="date" value={(data.tanggal as string)||''} onChange={e=>u('tanggal',e.target.value)} register={()=>({})} />
              <Input label="Pemohon Izin (Foreman/Supervisor) *" name="pemohon_izin" value={(data.pemohon_izin as string)||''} onChange={e=>u('pemohon_izin',e.target.value)} register={()=>({})} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Perusahaan</label>
                <MasterSelect masterType="perusahaan" value={(data.perusahaan as string)||''} onChange={(v) => u('perusahaan', v)} placeholder="Pilih perusahaan..." />
              </div>
              <Input label="Fasilitas" name="fasilitas" value={(data.fasilitas as string)||''} onChange={e=>u('fasilitas',e.target.value)} register={()=>({})} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Jumlah Pekerja" name="jumlah_pekerja" type="number" value={(data.jumlah_pekerja as string)||''} onChange={e=>u('jumlah_pekerja',e.target.value)} register={()=>({})} />
              <Input label="Nama Peralatan/Area yang akan Dimasuki *" name="nama_peralatan_area" value={(data.nama_peralatan_area as string)||''} onChange={e=>u('nama_peralatan_area',e.target.value)} register={()=>({})} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Jam Masuk" name="jam_masuk" type="time" value={(data.jam_masuk as string)||''} onChange={e=>u('jam_masuk',e.target.value)} register={()=>({})} />
              <Input label="Jam Keluar" name="jam_keluar" type="time" value={(data.jam_keluar as string)||''} onChange={e=>u('jam_keluar',e.target.value)} register={()=>({})} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Alasan Memasuki Peralatan/Area Tersebut *</label>
              <textarea className="hse-input min-h-[60px] text-sm" value={(data.alasan_memasuki as string)||''} onChange={e=>u('alasan_memasuki',e.target.value)} placeholder="Alasan masuk..." />
            </div>
          </div>
        </div>

        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden mt-3">
          <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2">
            <h4 className="font-semibold text-xs text-gray-800 dark:text-white uppercase">Instrumen Penguji Gas</h4>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Nama Instrumen" name="instrumen_gas" value={(data.instrumen_gas as string)||''} onChange={e=>u('instrumen_gas',e.target.value)} register={()=>({})} />
              <Input label="Tanggal Terakhir Dikalibrasi" name="tanggal_kalibrasi" type="date" value={(data.tanggal_kalibrasi as string)||''} onChange={e=>u('tanggal_kalibrasi',e.target.value)} register={()=>({})} />
            </div>
          </div>
        </div>

        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden mt-3">
          <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2">
            <h4 className="font-semibold text-xs text-gray-800 dark:text-white uppercase">Isi Tangki/Alat/Area pada Kondisi Sebelumnya</h4>
          </div>
          <div className="p-3">
            <textarea className="hse-input min-h-[60px] text-sm" value={(data.kondisi_sebelumnya as string)||''} onChange={e=>u('kondisi_sebelumnya',e.target.value)} placeholder="Kondisi sebelumnya..." />
          </div>
        </div>

        {/* Hasil Pengujian Gas - Dynamic Rows */}
        {(() => {
          const gasRows = (data.hasil_pengujian_gas as any[]) || [{ waktu: '', lel: '', o2: '', h2s: '', lainnya: '', agt_initials: '' }];
          const addGasRow = () => u('hasil_pengujian_gas', [...gasRows, { waktu: '', lel: '', o2: '', h2s: '', lainnya: '', agt_initials: '' }]);
          const rmGasRow = (i: number) => { if (gasRows.length > 1) u('hasil_pengujian_gas', gasRows.filter((_, x) => x !== i)); };
          const upGasRow = (i: number, f: string, v: string) => { const n = [...gasRows]; (n[i] as any)[f] = v; u('hasil_pengujian_gas', n); };
          return (
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden mt-3">
              <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2 flex items-center justify-between">
                <h4 className="font-semibold text-xs text-gray-800 dark:text-white uppercase">Hasil Pengujian Gas</h4>
                <button type="button" onClick={addGasRow} className="text-[10px] px-2 py-0.5 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors flex items-center gap-1">
                  <Plus size={12} /> Tambah Baris
                </button>
              </div>
              <div className="p-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="bg-gray-200 dark:bg-gray-700">
                        <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Waktu</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">%LEL</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">%O2</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">PPM H2S</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Lainnya</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">AGT Initials</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {gasRows.map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20">
                          <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5"><input type="time" className="hse-input text-[11px] py-0.5 w-full" value={row.waktu} onChange={e => upGasRow(i, 'waktu', e.target.value)} /></td>
                          <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5"><input className="hse-input text-[11px] py-0.5 w-full" value={row.lel} onChange={e => upGasRow(i, 'lel', e.target.value)} /></td>
                          <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5"><input className="hse-input text-[11px] py-0.5 w-full" value={row.o2} onChange={e => upGasRow(i, 'o2', e.target.value)} /></td>
                          <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5"><input className="hse-input text-[11px] py-0.5 w-full" value={row.h2s} onChange={e => upGasRow(i, 'h2s', e.target.value)} /></td>
                          <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5"><input className="hse-input text-[11px] py-0.5 w-full" value={row.lainnya} onChange={e => upGasRow(i, 'lainnya', e.target.value)} /></td>
                          <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5"><input className="hse-input text-[11px] py-0.5 w-full" value={row.agt_initials} onChange={e => upGasRow(i, 'agt_initials', e.target.value)} /></td>
                          <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center">
                            {gasRows.length > 1 && <button type="button" onClick={() => rmGasRow(i)} className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"><Trash2 size={14} /></button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={!!data.peningkatan_frekuensi} onChange={e=>u('peningkatan_frekuensi',e.target.checked)} className="rounded text-blue-500 w-4 h-4" />
                    <span className="text-xs text-gray-700 dark:text-gray-300">Diperlukan Peningkatan Frekuensi</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={!!data.pengujian_kontinyu} onChange={e=>u('pengujian_kontinyu',e.target.checked)} className="rounded text-blue-500 w-4 h-4" />
                    <span className="text-xs text-gray-700 dark:text-gray-300">Pengujian Gas Kontinyu</span>
                  </label>
                </div>
              </div>
            </div>
          );
        })()}

        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden mt-3">
          <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2">
            <h4 className="font-semibold text-xs text-gray-800 dark:text-white uppercase">Daftar Orang yang Memasuki Ruang Terbatas</h4>
          </div>
          <div className="p-3">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300 w-1/3">NAMA</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300 w-1/3">WAKTU MASUK</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300 w-1/4">WAKTU KELUAR</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {orang.map((o,i) => (
                    <tr key={i}>
                      <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5"><input className="hse-input text-[11px] py-0.5" value={o.nama} onChange={e=>upOrang(i,'nama',e.target.value)} placeholder="Nama" /></td>
                      <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5"><input type="time" className="hse-input text-[11px] py-0.5" value={o.masuk} onChange={e=>upOrang(i,'masuk',e.target.value)} /></td>
                      <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5"><input type="time" className="hse-input text-[11px] py-0.5" value={o.keluar} onChange={e=>upOrang(i,'keluar',e.target.value)} /></td>
                      <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center">
                        {orang.length > 1 && <button type="button" onClick={()=>rmOrang(i)} className="p-1 text-red-500 hover:text-red-700"><Trash2 size={14}/></button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2">
              <Button type="button" variant="outline" size="sm" onClick={addOrang}><Plus size={14}/> Tambah Orang</Button>
            </div>
          </div>
        </div>

        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden mt-3">
          <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2">
            <h4 className="font-semibold text-xs text-gray-800 dark:text-white uppercase">Section B - Diisi oleh Pemberi Izin</h4>
          </div>
          <div className="p-3">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300 w-12">No</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">Persyaratan</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-center font-semibold text-gray-700 dark:text-gray-300 w-16">Ya/Tidak</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300 w-20">Inisial</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    'Semua ketentuan dan persyaratan sesuai Izin Kerja terkait',
                    'Pengawasan Area Masuk',
                    'Alat PPE dan/atau pakaian khusus',
                    'Alat pelindung pernapasan',
                    'Tanda larangan sebagai barikade area kerja',
                    'Rencana penyelamatan telah disiapkan',
                    'Pencahayaan, Ventilasi',
                    'Isolasi/Peralatan pengaman (LOTO)',
                    'Lainnya',
                  ].map((item, idx) => (
                    <tr key={idx}>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-center text-gray-700 dark:text-gray-300">{idx + 1}</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-gray-700 dark:text-gray-300">{item}</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-center">
                        <label className="flex items-center justify-center gap-1 cursor-pointer">
                          <input type="checkbox" checked={checklist.includes(item)} onChange={()=>toggleChecklist(item)} className="rounded text-blue-500" />
                        </label>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5">
                        <input className="hse-input text-[11px] py-0.5" value={(data[`checklist_inisial_${idx}`] as string)||''} onChange={e=>u(`checklist_inisial_${idx}`,e.target.value)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 space-y-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Alat Pelindung Pernapasan - Nama Alat Bantu Pernapasan</label>
                <input className="hse-input text-sm" value={(data.nama_alat_pernapasan as string)||''} onChange={e=>u('nama_alat_pernapasan',e.target.value)} placeholder="Nama alat bantu pernapasan" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Tambahan kondisi bahaya, peralatan/tindakan pencegahan, instruksi khusus</label>
                <textarea className="hse-input min-h-[60px] text-sm" value={(data.tambahan_kondisi_bahaya as string)||''} onChange={e=>u('tambahan_kondisi_bahaya',e.target.value)} placeholder="Kondisi bahaya, peralatan/tindakan pencegahan, instruksi khusus..." />
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden mt-3">
          <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2">
            <h4 className="font-semibold text-xs text-gray-800 dark:text-white uppercase">Section C - Bagian Pengesahan</h4>
          </div>
          <div className="p-3">
            <PermitApprovalTable
              data={data}
              update={u}
              rows={[
                {
                  label: 'A. Pemohon Izin',
                  statement: 'Saya bertanggung jawab atas keselamatan pekerjaan di ruang terbatas ini',
                  tanggalField: 'pengesahan_tgl_pemohon',
                  namaField: 'pengesahan_nama_pemohon',
                  jabatanField: 'pengesahan_jabatan_pemohon',
                  parafField: 'pengesahan_paraf_pemohon',
                  bgClass: 'bg-blue-50 dark:bg-blue-900/20',
                  disableName: false,
                },
                {
                  label: 'B. Pemilik Lokasi',
                  statement: 'Lokasi ruang terbatas telah diperiksa dan dapat dimasuki dengan aman',
                  tanggalField: 'pengesahan_tgl_pemilik',
                  namaField: 'pengesahan_nama_pemilik',
                  jabatanField: 'pengesahan_jabatan_pemilik',
                  parafField: 'pengesahan_paraf_pemilik',
                  bgClass: 'bg-green-50 dark:bg-green-900/20',
                },
                {
                  label: 'C. Pemberi Izin',
                  statement: 'Izin masuk ruang terbatas ini sah setelah semua persyaratan dipenuhi',
                  tanggalField: 'pengesahan_tgl_pemberi',
                  namaField: 'pengesahan_nama_pemberi',
                  jabatanField: 'pengesahan_jabatan_pemberi',
                  parafField: 'pengesahan_paraf_pemberi',
                  bgClass: 'bg-orange-50 dark:bg-orange-900/20',
                },
              ]}
              mengetahuiRows={[
                { subLabel: 'HSSE Admin/Inspektor', tanggalField: 'mengetahui_tgl_hse', namaField: 'mengetahui_nama_hse', jabatanField: 'mengetahui_jabatan_hse', parafField: 'mengetahui_paraf_hse' },
                { subLabel: 'Asisten HSSE', tanggalField: 'mengetahui_tgl_asisten', namaField: 'mengetahui_nama_asisten', jabatanField: 'mengetahui_jabatan_asisten', parafField: 'mengetahui_paraf_asisten' },
                { subLabel: 'Kasubag Sistem & IT', tanggalField: 'mengetahui_tgl_kasubag', namaField: 'mengetahui_nama_kasubag', jabatanField: 'mengetahui_jabatan_kasubag', parafField: 'mengetahui_paraf_kasubag' },
              ]}
            />
          </div>
        </div>

        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden mt-3">
          <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2">
            <h4 className="font-semibold text-xs text-gray-800 dark:text-white uppercase">CSE LOG Sheet</h4>
          </div>
          <div className="p-3">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300 w-10">No</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">Nama</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">Jam Masuk</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">Kegiatan</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">Jam Keluar</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">Keterangan</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {cseLog.map((r,i) => (
                    <tr key={i}>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-center text-gray-700 dark:text-gray-300">{r.no}</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5"><input className="hse-input text-[11px] py-0.5" value={r.nama} onChange={e=>upCseLog(i,'nama',e.target.value)} placeholder="Nama" /></td>
                      <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5"><input type="time" className="hse-input text-[11px] py-0.5" value={r.jam_masuk} onChange={e=>upCseLog(i,'jam_masuk',e.target.value)} /></td>
                      <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5"><input className="hse-input text-[11px] py-0.5" value={r.kegiatan} onChange={e=>upCseLog(i,'kegiatan',e.target.value)} placeholder="Kegiatan" /></td>
                      <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5"><input type="time" className="hse-input text-[11px] py-0.5" value={r.jam_keluar} onChange={e=>upCseLog(i,'jam_keluar',e.target.value)} /></td>
                      <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5"><input className="hse-input text-[11px] py-0.5" value={r.keterangan} onChange={e=>upCseLog(i,'keterangan',e.target.value)} placeholder="Keterangan" /></td>
                      <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center">
                        {cseLog.length > 1 && <button type="button" onClick={()=>rmCseLog(i)} className="p-1 text-red-500 hover:text-red-700"><Trash2 size={12}/></button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2">
              <Button type="button" variant="outline" size="sm" onClick={addCseLog}><Plus size={14}/> Tambah Baris</Button>
            </div>
          </div>
        </div>

        <DynamicFields
          permitType="cse"
          data={data}
          onChange={onChange}
          hardcodedFields={[
            'no_permit_cse','no_izin_kerja_umum','tanggal','pemohon_izin','perusahaan','fasilitas',
            'jumlah_pekerja','nama_peralatan_area','jam_masuk','jam_keluar','alasan_memasuki',
            'instrumen_gas','tanggal_kalibrasi','kondisi_sebelumnya',
            'hasil_pengujian_gas',
            'peningkatan_frekuensi','pengujian_kontinyu','daftar_orang',
            'checklist_persyaratan',
            'pengesahan_tgl_pemohon','pengesahan_nama_pemohon','pengesahan_paraf_pemohon',
            'pengesahan_tgl_pemilik','pengesahan_nama_pemilik','pengesahan_paraf_pemilik',
            'pengesahan_tgl_pemberi','pengesahan_nama_pemberi','pengesahan_paraf_pemberi',
            'mengetahui_tgl_hse','mengetahui_nama_hse','mengetahui_paraf_hse',
            'mengetahui_tgl_asisten','mengetahui_nama_asisten','mengetahui_paraf_asisten',
            'mengetahui_tgl_kasubag','mengetahui_nama_kasubag','mengetahui_paraf_kasubag',
            'cse_log','nama_alat_pernapasan','tambahan_kondisi_bahaya',
          ]}
        />
      </div>
    </div>
  );
}
