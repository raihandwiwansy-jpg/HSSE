'use client';
import { useEffect } from 'react';
import { getNextSequence } from '@/lib/api/permit';
import Input from '@/components/ui/Input';
import MasterSelect from '@/components/ui/MasterSelect';
import DynamicFields from './DynamicFields';
import PermitApprovalTable from './PermitApprovalTable';

interface EwpFormProps { data: Record<string,unknown>; onChange: (d: Record<string,unknown>)=>void; }

const BAHAYA_ITEMS = [
  'Power Cables',
  'Proses Piping',
  'Communication Cable',
  'Flooding/Banjir',
  'Cave-in Potential/Potensi Terjebak',
  'Bahan Mudah Terbakar/Beracun',
  'Vehicular Traffic/Lalu Lintas Kendaraan',
  'Noise/Kebisingan',
  'Pengrusakan Alat/Pondasi',
  'Sewer/Drainage Pipe Work',
  'Efek Getaran Akibat Penggalian',
  'Terlampir Plot Plan Lokasi Pekerjaan',
];
const KEWASPADAAN = [
  {k:'mencegah_tertimbun',l:'Mencegah agar Orang Tidak Tertimbun',ops:['Shoring/Landai','Trench Shield/Penahan','Sloping/Lereng','Benching/lereng bertingkat']},
  {k:'penahan_banjir',l:'Pasang penahan banjir',ops:['Ya','Tidak','N/A','Lainnya']},
  {k:'pondasi_support',l:'Fondasi perlu penahan/support',ops:['Ya','Tidak','N/A']},
  {k:'standby_man',l:'Standby Man diperlukan pd area bising',ops:['Ya','Tidak','N/A']},
  {k:'gali_manual',l:'Gali manual dgn hati-hati',ops:['Ya','Tidak','N/A']},
  {k:'service_bawah_tanah',l:'Service yang Berlokasi di Bawah Tanah',ops:['Ya','Tidak','N/A']},
  {k:'process_pipe',l:'Process pipe perlu dimatikan, tekanan 0',ops:['Ya','Tidak','N/A']},
  {k:'electrical_services',l:'Electrical services perlu dimatikan',ops:['Ya','Tidak','N/A']},
];

const Sec = ({title,children}:{title:string;children:React.ReactNode}) => (
  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 sm:p-4 space-y-3 border border-gray-200 dark:border-gray-700">
    <h4 className="font-bold text-gray-800 dark:text-white text-xs sm:text-sm border-b-2 border-gray-200 dark:border-gray-700 pb-2 uppercase tracking-wide">{title}</h4>{children}</div>
);

export default function EwpForm({ data, onChange }: EwpFormProps) {
  const u = (k:string,v:unknown) => onChange({...data,[k]:v});

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getNextSequence('permit_number', 'ewp');
        const num = res?.data?.data?.next;
        if (num && !data.no_permit_ewp) {
          onChange({...data, no_permit_ewp: num});
        }
      } catch {}
    };
    fetch();
  }, []);

  const bahaya = (data.bahaya_ewp as string[])||[];

  return (
    <div className="space-y-4">
      {/* Company Header */}
      <div className="flex items-center justify-center gap-3 border-b-2 border-gray-300 dark:border-gray-600 pb-3 mb-4">
        <img src="/Picture1.png" alt="Logo INL" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
        <div className="text-left">
          <h2 className="text-sm sm:text-base font-bold text-gray-800 dark:text-white leading-tight">PT. INDUSTRI NABATI LESTARI</h2>
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-tight mt-0.5">KEK Sei Mangkei, Kab. Simalungun, Sumatera Utara</p>
        </div>
      </div>

      {/* Header Fields */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-800 dark:text-white text-sm border-b border-gray-200 dark:border-gray-700 pb-2">Data Dokumen</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Input label="No. Dokumen" name="no_dokumen" value={(data.no_dokumen as string)||''} onChange={e=>u('no_dokumen',e.target.value)} register={()=>({})} />
          <Input label="Tgl. Berlaku" name="tgl_berlaku" type="date" value={(data.tgl_berlaku as string)||''} onChange={e=>u('tgl_berlaku',e.target.value)} register={()=>({})} />
          <Input label="No. Revisi" name="no_revisi" value={(data.no_revisi as string)||''} onChange={e=>u('no_revisi',e.target.value)} register={()=>({})} />
          <Input label="Halaman" name="halaman" value={(data.halaman as string)||''} onChange={e=>u('halaman',e.target.value)} register={()=>({})} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="No. Permit EWP" name="no_permit_ewp" value={(data.no_permit_ewp as string)||''} onChange={e=>u('no_permit_ewp',e.target.value)} register={()=>({})} readOnly placeholder="Auto" />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Dept/Bag/CV</label>
            <MasterSelect masterType="departemen" value={(data.dept as string)||''} onChange={(v) => u('dept', v)} placeholder="Pilih departemen..." />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Tanggal" name="tanggal" type="date" value={(data.tanggal as string)||''} onChange={e=>u('tanggal',e.target.value)} register={()=>({})} />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Shift Kerja</label>
            <select className="hse-input text-sm" value={(data.shift_kerja as string)||''} onChange={e=>u('shift_kerja',e.target.value)}>
              <option value="">Pilih Shift</option>
              <option value="Pagi">Pagi</option>
              <option value="Siang">Siang</option>
              <option value="Malam">Malam</option>
            </select>
          </div>
        </div>
      </div>

      <Sec title="SECTION A: Permohonan Izin Kerja Galian">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Nama" name="nama_pemohon" value={(data.nama_pemohon as string)||''} onChange={e=>u('nama_pemohon',e.target.value)} register={()=>({})} />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Perusahaan</label>
            <MasterSelect masterType="perusahaan" value={(data.perusahaan as string)||''} onChange={(v) => u('perusahaan', v)} placeholder="Pilih perusahaan..." />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Masa Berlaku Izin Galian Mulai" name="masa_mulai" type="date" value={(data.masa_mulai as string)||''} onChange={e=>u('masa_mulai',e.target.value)} register={()=>({})} />
          <Input label="Masa Berlaku Izin Galian Selesai" name="masa_selesai" type="date" value={(data.masa_selesai as string)||''} onChange={e=>u('masa_selesai',e.target.value)} register={()=>({})} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Area/Lokasi Galian *</label>
          <MasterSelect masterType="lokasi" value={(data.lokasi as string)||''} onChange={(v) => u('lokasi', v)} placeholder="Pilih lokasi..." />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Metode Penggalian *</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="metode_galian" checked={data.metode==='alat_berat'} onChange={()=>u('metode','alat_berat')} className="text-blue-500"/>
              <span className="text-sm text-gray-700 dark:text-gray-300">Dengan Alat Berat</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="metode_galian" checked={data.metode==='tangan'} onChange={()=>u('metode','tangan')} className="text-blue-500"/>
              <span className="text-sm text-gray-700 dark:text-gray-300">Dengan Tangan Saja</span>
            </label>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Input label="Panjang Alur Galian (m)" name="panjang" type="number" value={(data.panjang as string)||''} onChange={e=>u('panjang',e.target.value)} register={()=>({})} />
          <Input label="Lebar Galian (m)" name="lebar" type="number" value={(data.lebar as string)||''} onChange={e=>u('lebar',e.target.value)} register={()=>({})} />
          <Input label="Kedalaman Galian (m)" name="kedalaman" type="number" value={(data.kedalaman as string)||''} onChange={e=>u('kedalaman',e.target.value)} register={()=>({})} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Uraian Pekerjaan *</label>
          <textarea className="hse-input min-h-[70px] text-sm" value={(data.uraian_pekerjaan as string)||''} onChange={e=>u('uraian_pekerjaan',e.target.value)} placeholder="Jelaskan pekerjaan galian..."/>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <Input label="Tanggal" name="sec_a_tanggal" type="date" value={(data.sec_a_tanggal as string)||''} onChange={e=>u('sec_a_tanggal',e.target.value)} register={()=>({})} />
          <Input label="Nama" name="sec_a_nama" value={(data.sec_a_nama as string)||''} onChange={e=>u('sec_a_nama',e.target.value)} register={()=>({})} />
          <Input label="Tanda Tangan" name="sec_a_tt" disabled value={(data.sec_a_tt as string)||''} onChange={()=>{}} register={()=>({})} placeholder="Tanda tangan" className="opacity-60"/>
        </div>
      </Sec>

      <Sec title="SECTION B: Pemeriksaan Fasilitas Bawah Tanah">
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="fasilitas_bwh" checked={data.tidak_ada_fasilitas===true} onChange={()=>{u('tidak_ada_fasilitas',true);u('ada_fasilitas',false);}} className="text-blue-500"/>
            <span className="text-sm">Tidak ada fasilitas tertanam dibawah tanah</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="fasilitas_bwh" checked={data.ada_fasilitas===true} onChange={()=>{u('ada_fasilitas',true);u('tidak_ada_fasilitas',false);}} className="text-blue-500"/>
            <span className="text-sm">Ada fasilitas bawah tanah, tandai dilapangan dan digambar</span>
          </label>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Uraian Keterangan Fasilitas dibawah Lahan</label>
          <textarea className="hse-input min-h-[60px] text-sm" value={(data.detail_fasilitas as string)||''} onChange={e=>u('detail_fasilitas',e.target.value)} placeholder="Tandai dilapangan dan gambarkan..."/>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Operating Pressure / Operating Voltage" name="operating_pressure" value={(data.operating_pressure as string)||''} onChange={e=>u('operating_pressure',e.target.value)} register={()=>({})} placeholder="Operating Pressure/Voltage"/>
          <Input label="Ada dikedalaman Berikut (m)" name="kedalaman_fasilitas" type="number" value={(data.kedalaman_fasilitas as string)||''} onChange={e=>u('kedalaman_fasilitas',e.target.value)} register={()=>({})} placeholder="Kedalaman fasilitas"/>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gambar Diperiksa Oleh</label>
          <div className="flex flex-wrap gap-4">
            {['Civil','Electrical','Mechanical','HSSE Dept'].map(dept=>(
              <label key={dept} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={((data.gambar_diperiksa_oleh as string[])||[]).includes(dept)} onChange={()=>{
                  const cur=(data.gambar_diperiksa_oleh as string[])||[];
                  const n=cur.includes(dept)?cur.filter(x=>x!==dept):[...cur,dept];
                  u('gambar_diperiksa_oleh',n);
                }} className="rounded text-blue-500"/>
                <span className="text-sm text-gray-700 dark:text-gray-300">{dept}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <Input label="Tanggal" name="sec_b_tanggal" type="date" value={(data.sec_b_tanggal as string)||''} onChange={e=>u('sec_b_tanggal',e.target.value)} register={()=>({})} />
          <Input label="Tanda Tangan" name="sec_b_tt" disabled value={(data.sec_b_tt as string)||''} onChange={()=>{}} register={()=>({})} placeholder="Tanda tangan" className="opacity-60"/>
        </div>
      </Sec>

      <Sec title="SECTION C: Bahaya-Bahaya Terkait">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {BAHAYA_ITEMS.map(it=>(
            <label key={it} className="flex items-start gap-2 cursor-pointer p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700/50">
              <input type="checkbox" checked={bahaya.includes(it)} onChange={()=>{
                const n=bahaya.includes(it)?bahaya.filter(x=>x!==it):[...bahaya,it];
                u('bahaya_ewp',n);
              }} className="mt-0.5 rounded text-blue-500"/>
              <span className="text-xs text-gray-700 dark:text-gray-300">{it}</span>
            </label>
          ))}
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lain-lain (Jelaskan)</label>
          <input className="hse-input text-sm" value={(data.bahaya_lain as string)||''} onChange={e=>u('bahaya_lain',e.target.value)} placeholder="Bahaya lainnya..."/>
        </div>
      </Sec>

      <Sec title="SECTION D: Kewaspadaan yang Harus Dilakukan">
        {KEWASPADAAN.map(({k,l,ops})=>(
          <div key={k} className="flex flex-col sm:flex-row sm:items-center gap-2 py-1.5 border-b border-gray-200 dark:border-gray-700 last:border-0">
            <span className="text-xs text-gray-700 dark:text-gray-300 flex-1">{l}</span>
            <div className="flex gap-2">
              {ops.map(o=>(
                <label key={o} className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" name={k} value={o} checked={data[k]===o} onChange={()=>u(k,o)} className="text-blue-500"/>
                  <span className="text-xs text-gray-600 dark:text-gray-300">{o}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Petugas Pengawas (Standby Man)" name="petugas_pengawas" value={(data.petugas_pengawas as string)||''} onChange={e=>u('petugas_pengawas',e.target.value)} register={()=>({})} placeholder="Nama petugas pengawas"/>
            <Input label="Beritahukan ke Grup Lain" name="grup_lain" value={(data.grup_lain as string)||''} onChange={e=>u('grup_lain',e.target.value)} register={()=>({})} placeholder="Grup lainnya"/>
          </div>
          <div className="space-y-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Perlu Tambahan Penerangan</label>
              <div className="flex gap-4">
                {['Ya','Tidak','N/A'].map(o=>(
                  <label key={o} className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="tambahan_penerangan" value={o} checked={data.tambahan_penerangan===o} onChange={()=>u('tambahan_penerangan',o)} className="text-blue-500"/>
                    <span className="text-xs text-gray-600 dark:text-gray-300">{o}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">APD/PPE</label>
              <input className="hse-input text-sm" value={(data.apd_ppe as string)||''} onChange={e=>u('apd_ppe',e.target.value)} placeholder="APD/PPE yang diperlukan"/>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Diperlukan Toolbox Talk Khusus</label>
              <div className="flex gap-4">
                {['Ya','Tidak'].map(o=>(
                  <label key={o} className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="toolbox_talk" value={o} checked={data.toolbox_talk===o} onChange={()=>u('toolbox_talk',o)} className="text-blue-500"/>
                    <span className="text-xs text-gray-600 dark:text-gray-300">{o}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dokumen Pendukung</label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={((data.dokumen_pendukung as string[])||[]).includes('Izin Masuk Ruang Terbatas')} onChange={()=>{
                const cur=(data.dokumen_pendukung as string[])||[];
                const n=cur.includes('Izin Masuk Ruang Terbatas')?cur.filter(x=>x!=='Izin Masuk Ruang Terbatas'):[...cur,'Izin Masuk Ruang Terbatas'];
                u('dokumen_pendukung',n);
              }} className="rounded text-blue-500"/>
              <span className="text-xs text-gray-700 dark:text-gray-300">Izin Masuk Ruang Terbatas</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={((data.dokumen_pendukung as string[])||[]).includes('Electrical Isolation Permit')} onChange={()=>{
                const cur=(data.dokumen_pendukung as string[])||[];
                const n=cur.includes('Electrical Isolation Permit')?cur.filter(x=>x!=='Electrical Isolation Permit'):[...cur,'Electrical Isolation Permit'];
                u('dokumen_pendukung',n);
              }} className="rounded text-blue-500"/>
              <span className="text-xs text-gray-700 dark:text-gray-300">Electrical Isolation Permit</span>
            </label>
          </div>
        </div>
      </Sec>

      <Sec title="SECTION E: Pengujian Gas/Gas Testing">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Frekuensi:</p>
          <div className="flex flex-wrap gap-3">
            {['Sekali-sekali','Terus menerus','Sejam Sekali','Tidak Perlu'].map(f=>(
              <label key={f} className="flex items-center gap-1 cursor-pointer">
                <input type="radio" name="frekuensi_gas" value={f} checked={data.frekuensi_gas===f} onChange={()=>u('frekuensi_gas',f)} className="text-blue-500"/>
                <span className="text-xs text-gray-600 dark:text-gray-300">{f}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Hasil Pengujian Gas:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700/50">
                <tr>
                  <th className="border border-gray-200 dark:border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Tanggal</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Jam</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Nama</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Tanda Tangan</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-700 dark:text-gray-300">O2%</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-700 dark:text-gray-300">%LEL</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-700 dark:text-gray-300">H2S (ppm)</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Lainnya</th>
                </tr>
              </thead>
              <tbody>
                {((data.gas_test_rows as Array<Record<string,string>>) || [{}]).map((row, idx)=>(
                  <tr key={idx}>
                    <td className="border border-gray-200 dark:border-gray-600 px-1 py-0.5">
                      <input type="date" className="hse-input text-xs px-2 py-1" value={row.tanggal||''} onChange={e=>{
                        const rows=[...((data.gas_test_rows as Array<Record<string,string>>) || [{}])];
                        rows[idx]={...rows[idx],tanggal:e.target.value}; u('gas_test_rows',rows);
                      }}/>
                    </td>
                    <td className="border border-gray-200 dark:border-gray-600 px-1 py-0.5">
                      <input type="time" className="hse-input text-xs px-2 py-1" value={row.jam||''} onChange={e=>{
                        const rows=[...((data.gas_test_rows as Array<Record<string,string>>) || [{}])];
                        rows[idx]={...rows[idx],jam:e.target.value}; u('gas_test_rows',rows);
                      }}/>
                    </td>
                    <td className="border border-gray-200 dark:border-gray-600 px-1 py-0.5">
                      <input type="text" className="hse-input text-xs px-2 py-1" value={row.nama||''} onChange={e=>{
                        const rows=[...((data.gas_test_rows as Array<Record<string,string>>) || [{}])];
                        rows[idx]={...rows[idx],nama:e.target.value}; u('gas_test_rows',rows);
                      }}/>
                    </td>
                    <td className="border border-gray-200 dark:border-gray-600 px-1 py-0.5">
                      <input type="text" readOnly className="hse-input text-xs px-2 py-1 opacity-60" value={row.tanda_tangan||''} />
                    </td>
                    <td className="border border-gray-200 dark:border-gray-600 px-1 py-0.5">
                      <input type="text" className="hse-input text-xs px-2 py-1" value={row.o2||''} onChange={e=>{
                        const rows=[...((data.gas_test_rows as Array<Record<string,string>>) || [{}])];
                        rows[idx]={...rows[idx],o2:e.target.value}; u('gas_test_rows',rows);
                      }}/>
                    </td>
                    <td className="border border-gray-200 dark:border-gray-600 px-1 py-0.5">
                      <input type="text" className="hse-input text-xs px-2 py-1" value={row.lel||''} onChange={e=>{
                        const rows=[...((data.gas_test_rows as Array<Record<string,string>>) || [{}])];
                        rows[idx]={...rows[idx],lel:e.target.value}; u('gas_test_rows',rows);
                      }}/>
                    </td>
                    <td className="border border-gray-200 dark:border-gray-600 px-1 py-0.5">
                      <input type="text" className="hse-input text-xs px-2 py-1" value={row.h2s||''} onChange={e=>{
                        const rows=[...((data.gas_test_rows as Array<Record<string,string>>) || [{}])];
                        rows[idx]={...rows[idx],h2s:e.target.value}; u('gas_test_rows',rows);
                      }}/>
                    </td>
                    <td className="border border-gray-200 dark:border-gray-600 px-1 py-0.5">
                      <input type="text" className="hse-input text-xs px-2 py-1" value={row.lainnya||''} onChange={e=>{
                        const rows=[...((data.gas_test_rows as Array<Record<string,string>>) || [{}])];
                        rows[idx]={...rows[idx],lainnya:e.target.value}; u('gas_test_rows',rows);
                      }}/>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" className="text-xs text-blue-600 hover:text-blue-800 mt-1" onClick={()=>{
            const rows=[...((data.gas_test_rows as Array<Record<string,string>>) || [{}]),{}];
            u('gas_test_rows',rows);
          }}>+ Tambah Baris</button>
        </div>
      </Sec>

      <Sec title="SECTION F: Validasi dan Kewenangan (Persetujuan Izin Kerja)">
        <PermitApprovalTable
          data={data}
          update={u}
          rows={[
            {
              label: 'A. Pemohon Izin',
              statement: 'Saya mengajukan izin galian dan bertanggung jawab atas keselamatan pekerjaan',
              tanggalField: 'pemohon_tanggal',
              namaField: 'pemohon_nama',
              jabatanField: 'pemohon_jabatan',
              parafField: 'pemohon_tt',
              bgClass: 'bg-blue-50 dark:bg-blue-900/20',
              disableName: false,
            },
            {
              label: 'B. Pemilik Lokasi',
              statement: 'Lokasi galian telah diperiksa dan pekerjaan dapat dilaksanakan dengan aman',
              tanggalField: 'pemilik_tanggal',
              namaField: 'pemilik_nama',
              jabatanField: 'pemilik_jabatan',
              parafField: 'pemilik_tt',
              bgClass: 'bg-green-50 dark:bg-green-900/20',
            },
            {
              label: 'C. Otoritas Pemberi Izin',
              statement: 'Izin galian ini sah untuk dilaksanakan setelah seluruh persyaratan terpenuhi',
              tanggalField: 'otoritas_tanggal',
              namaField: 'otoritas_nama',
              jabatanField: 'otoritas_jabatan',
              parafField: 'otoritas_tt',
              bgClass: 'bg-orange-50 dark:bg-orange-900/20',
            },
          ]}
          mengetahuiRows={[
            { subLabel: 'HSSE Admin/Inspektor', tanggalField: 'mengetahui_hsse_tanggal', namaField: 'mengetahui_hsse_nama', jabatanField: 'mengetahui_hsse_jabatan', parafField: 'mengetahui_hsse_paraf' },
            { subLabel: 'Asisten HSSE', tanggalField: 'mengetahui_asisten_tanggal', namaField: 'mengetahui_asisten_nama', jabatanField: 'mengetahui_asisten_jabatan', parafField: 'mengetahui_asisten_paraf' },
            { subLabel: 'Kasubag Sistem & IT', tanggalField: 'mengetahui_kasubag_tanggal', namaField: 'mengetahui_kasubag_nama', jabatanField: 'mengetahui_kasubag_jabatan', parafField: 'mengetahui_kasubag_paraf' },
          ]}
        />
      </Sec>

      <DynamicFields
        permitType="ewp"
        data={data}
        onChange={onChange}
        hardcodedFields={[
          'no_dokumen','tgl_berlaku','no_revisi','halaman','no_permit_ewp','dept','tanggal','shift_kerja',
          'nama_pemohon','perusahaan','masa_mulai','masa_selesai','lokasi','metode','panjang','lebar','kedalaman',
          'uraian_pekerjaan','sec_a_tanggal','sec_a_nama','sec_a_tt',
          'tidak_ada_fasilitas','ada_fasilitas','detail_fasilitas','operating_pressure','kedalaman_fasilitas',
          'gambar_diperiksa_oleh','sec_b_tanggal','sec_b_tt',
          'bahaya_ewp','bahaya_lain',
          'mencegah_tertimbun','electrical_services','petugas_pengawas','grup_lain',
          'tambahan_penerangan','apd_ppe','toolbox_talk','dokumen_pendukung',
          'frekuensi_gas','gas_test_rows',
          'pemohon_nama','pemohon_tt','pemohon_tanggal','otoritas_nama','otoritas_tt','otoritas_tanggal',
        ]}
      />
    </div>
  );
}
