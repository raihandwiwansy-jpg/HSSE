'use client';
import { useEffect } from 'react';
import { getNextSequence } from '@/lib/api/permit';
import Input from '@/components/ui/Input';
import MasterSelect from '@/components/ui/MasterSelect';
import DynamicFields from './DynamicFields';
import PermitApprovalTable from './PermitApprovalTable';

interface ElpFormProps { data: Record<string,unknown>; onChange: (d: Record<string,unknown>)=>void; }

const CHECKLIST_ITEMS = [
  'Breaker Mati',
  'Racking out/Down Breaker',
  'Shutters Terkunci + Nomor Padlock',
  'Mengubah Main Isolator ke Keadaan Mati',
  'C.B/Isolator Terkunci',
  'Menghilangkan Sekring Utama',
  'Memantau No. Voltase',
  'Pembumian di Area Bilik',
  'Pembumian Tambahan',
  'Penghilangan Sekring Kendali',
  'Padlock dan Taken terpasang',
  'Tanda Peringatan Terpasang di Setiap Bilik',
  'Sistem Penguncian Halon atau CO2',
  'Isolasi Heater',
  'Posisi dan Nomor Pembumian',
];

const Sec = ({title,children}:{title:string;children:React.ReactNode}) => (
  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 sm:p-4 space-y-3 border border-gray-200 dark:border-gray-700">
    <h4 className="font-bold text-gray-800 dark:text-white text-xs sm:text-sm border-b-2 border-gray-200 dark:border-gray-700 pb-2 uppercase tracking-wide">{title}</h4>{children}</div>
);

export default function ElpForm({ data, onChange }: ElpFormProps) {
  const u = (k:string,v:unknown) => onChange({...data,[k]:v});

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getNextSequence('permit_number', 'elp');
        const num = res?.data?.data?.next;
        if (num && !data.no_permit_elp) {
          onChange({...data, no_permit_elp: num});
        }
      } catch {}
    };
    fetch();
  }, []);



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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="No. Permit ELP" name="no_permit_elp" value={(data.no_permit_elp as string)||''} onChange={e=>u('no_permit_elp',e.target.value)} register={()=>({})} readOnly placeholder="Auto" />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Dep/Bag/CV</label>
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

      {/* 1. PERMINTAAN ISOLASI */}
      <Sec title="1. Permintaan Isolasi (Otoritas Kerja)">
        <Input label="Alat yang akan diisolasi" name="alat_isolasi" value={(data.alat_isolasi as string)||''} onChange={e=>u('alat_isolasi',e.target.value)} register={()=>({})} placeholder="Nama/alat yang akan diisolasi" />
        <Input label="Tag No." name="tag_no" value={(data.tag_no as string)||''} onChange={e=>u('tag_no',e.target.value)} register={()=>({})} placeholder="Nomor tag" />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nyatakan tepatnya sifat pekerjaan yang harus dilakukan *</label>
          <textarea className="hse-input min-h-[80px] text-sm" value={(data.sifat_pekerjaan as string)||''} onChange={e=>u('sifat_pekerjaan',e.target.value)} placeholder="Jelaskan sifat pekerjaan isolasi..." />
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Diminta Oleh</p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <Input label="Nama" name="diminta_nama" value={(data.diminta_nama as string)||''} onChange={e=>u('diminta_nama',e.target.value)} register={()=>({})} />
            <Input label="Jabatan" name="diminta_jabatan" value={(data.diminta_jabatan as string)||''} onChange={e=>u('diminta_jabatan',e.target.value)} register={()=>({})} />
            <Input label="Tanda Tangan" name="diminta_tt" disabled value={(data.diminta_tt as string)||''} onChange={()=>{}} register={()=>({})} placeholder="Tanda tangan" className="opacity-60" />
            <Input label="Tanggal" name="diminta_tanggal" type="date" value={(data.diminta_tanggal as string)||''} onChange={e=>u('diminta_tanggal',e.target.value)} register={()=>({})} />
          </div>
        </div>
      </Sec>

      {/* 2. PEKERJAAN ISOLASI ELEKTRIKAL */}
      <Sec title="2. Pekerjaan Isolasi Elektrikal">
        <Input label="Penanggungjawab Elektrik" name="pj_elektrik_1" value={(data.pj_elektrik_1 as string)||''} onChange={e=>u('pj_elektrik_1',e.target.value)} register={()=>({})} placeholder="Nama penanggungjawab elektrik" />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sebutkan C/Breaker mana yang diisolasi dan lokasinya *</label>
          <textarea className="hse-input min-h-[60px] text-sm" value={(data.cb_isolasi_lokasi as string)||''} onChange={e=>u('cb_isolasi_lokasi',e.target.value)} placeholder="Sebutkan C/Breaker dan lokasi..." />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipe Isolasi</label>
          <div className="flex flex-wrap gap-4">
            {['Parsial','Total','H.V.','L.V.'].map(t=>(
              <label key={t} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="tipe_isolasi" value={t} checked={data.tipe_isolasi===t} onChange={()=>u('tipe_isolasi',t)} className="text-blue-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{t}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Isolasi Checklist */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Isolasi Checklist</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700/50">
                <tr>
                  <th className="border border-gray-200 dark:border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-700 dark:text-gray-300 w-10">No</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Item Pemeriksaan</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-2 py-1 text-center text-xs font-medium text-gray-700 dark:text-gray-300 w-16">YA</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-2 py-1 text-center text-xs font-medium text-gray-700 dark:text-gray-300 w-16">TIDAK</th>
                </tr>
              </thead>
              <tbody>
                {CHECKLIST_ITEMS.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border border-gray-200 dark:border-gray-600 px-2 py-1 text-center text-xs text-gray-700 dark:text-gray-300">{idx + 1}</td>
                    <td className="border border-gray-200 dark:border-gray-600 px-2 py-1 text-xs text-gray-700 dark:text-gray-300">{item}</td>
                    <td className="border border-gray-200 dark:border-gray-600 px-2 py-1 text-center">
                      <input type="radio" name={`checklist_${idx}`} checked={data[`checklist_${idx}`]===true} onChange={()=>u(`checklist_${idx}`,true)} className="text-blue-500" />
                    </td>
                    <td className="border border-gray-200 dark:border-gray-600 px-2 py-1 text-center">
                      <input type="radio" name={`checklist_${idx}`} checked={data[`checklist_${idx}`]===false} onChange={()=>u(`checklist_${idx}`,false)} className="text-blue-500" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. PERSETUJUAN IZIN KERJA */}
      </Sec>

      <Sec title="3. Persetujuan Izin Kerja (ELP)">
        <PermitApprovalTable
          data={data}
          update={u}
          rows={[
            {
              label: 'A. Penanggung Jawab Elektrik',
              statement: 'Saya bertanggung jawab atas pelaksanaan isolasi elektrikal dengan aman',
              tanggalField: 'elp_pj_tgl',
              namaField: 'elp_pj_nama',
              jabatanField: 'elp_pj_jabatan',
              parafField: 'elp_pj_paraf',
              bgClass: 'bg-blue-50 dark:bg-blue-900/20',
              disableName: false,
            },
            {
              label: 'B. Pemilik Lokasi',
              statement: 'Saya telah memeriksa area dan menyetujui isolasi kelistrikan ini',
              tanggalField: 'elp_pemilik_tgl',
              namaField: 'elp_pemilik_nama',
              jabatanField: 'elp_pemilik_jabatan',
              parafField: 'elp_pemilik_paraf',
              bgClass: 'bg-green-50 dark:bg-green-900/20',
            },
            {
              label: 'C. Pemberi Izin',
              statement: 'Izin isolasi elektrikal ini sah untuk dilaksanakan',
              tanggalField: 'elp_pemberi_tgl',
              namaField: 'elp_pemberi_nama',
              jabatanField: 'elp_pemberi_jabatan',
              parafField: 'elp_pemberi_paraf',
              bgClass: 'bg-orange-50 dark:bg-orange-900/20',
            },
          ]}
          mengetahuiRows={[
            { subLabel: 'HSSE Admin/Inspektor', tanggalField: 'elp_hsse_tgl', namaField: 'elp_hsse_nama', jabatanField: 'elp_hsse_jabatan', parafField: 'elp_hsse_paraf' },
            { subLabel: 'Asisten HSSE', tanggalField: 'elp_asisten_tgl', namaField: 'elp_asisten_nama', jabatanField: 'elp_asisten_jabatan', parafField: 'elp_asisten_paraf' },
            { subLabel: 'Kasubag Sistem & IT', tanggalField: 'elp_kasubag_tgl', namaField: 'elp_kasubag_nama', jabatanField: 'elp_kasubag_jabatan', parafField: 'elp_kasubag_paraf' },
          ]}
        />
      </Sec>

      <DynamicFields
        permitType="elp"
        data={data}
        onChange={onChange}
        hardcodedFields={[
          'no_permit_elp','dept','tanggal','shift_kerja',
          'alat_isolasi','tag_no','sifat_pekerjaan','diminta_nama','diminta_jabatan','diminta_tt','diminta_tanggal',
          'pj_elektrik_1','cb_isolasi_lokasi','tipe_isolasi',
          'otorisasi_isolasi_nama','otorisasi_isolasi_paraf','otorisasi_isolasi_tanggal','otorisasi_isolasi_waktu',
        ]}
      />
    </div>
  );
}
