'use client';
import { useEffect } from 'react';
import Input from '@/components/ui/Input';
import { getNextSequence } from '@/lib/api/permit';
import MasterSelect from '@/components/ui/MasterSelect';
import DynamicFields from './DynamicFields';
import PermitApprovalTable from './PermitApprovalTable';

interface WhpFormProps { data: Record<string,unknown>; onChange: (d: Record<string,unknown>)=>void; }

const CHECKLIST_WHP = [
  {k:'area_masuk_keluar',l:'Diketahui dimana area masuk dan keluar untuk pekerjaan pada ketinggian'},
  {k:'barikade',l:'Barikade dan tanda peringatan dipasang disekitar area kerja'},
  {k:'drop_zone',l:'Drop Zone didirikan, lengkap dengan barikade dan tanda peringatan'},
];

const CHECKLIST_PENGAMAT = [
  {k:'pengamat_safety',l:'Pengamat Safety telah dikerahkan di area yang diperlukan'},
];

const CHECKLIST_INSPEKSI = [
  {k:'peralatan_akses_inspeksi',l:'Peralatan akses kerja pada ketinggian diinspeksi dan diberi tag (Kode warna)'},
  {k:'peralatan_keselamatan_inspeksi',l:'Peralatan keselamatan kerja pada ketinggian diinspeksi dan diberi tag'},
  {k:'anchor_point_permanen',l:'Anchor Point permanen sesuai jenis pekerjaan, memiliki papan informasi, diinspeksi dan diberi tag'},
];

const CHECKLIST_RENCANA = [
  {k:'safety_harness',l:'Pekerja menggunakan safety harness saat pekerjaan'},
  {k:'penilaian_risiko_rendah',l:'Penilaian risiko menunjukkan risiko rendah terhadap ketinggian'},
];

const Sec = ({title,children}:{title:string;children:React.ReactNode}) => (
  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 sm:p-4 space-y-3 border border-gray-200 dark:border-gray-700">
    <h4 className="font-bold text-gray-800 dark:text-white text-xs sm:text-sm border-b-2 border-gray-200 dark:border-gray-700 pb-2 uppercase tracking-wide">{title}</h4>{children}</div>
);

const WhpYaTidakRow = ({k,l,checklist,onFieldChange}:{k:string;l:string;checklist:string[];onFieldChange:(k:string,v:unknown)=>void}) => {
  const isChecked = checklist.includes(k);
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
      <span className="text-xs text-gray-700 dark:text-gray-300 flex-1 leading-relaxed">{l}</span>
      <div className="flex gap-3">
        <label className="flex items-center gap-1 cursor-pointer">
          <input type="radio" name={`whp_${k}`} checked={isChecked}
            onChange={()=>{const n=checklist.includes(k)?checklist.filter(x=>x!==k):[...checklist,k];onFieldChange('checklist_whp',n);}} className="text-blue-500"/>
          <span className="text-xs text-gray-600 dark:text-gray-300">Ya</span>
        </label>
        <label className="flex items-center gap-1 cursor-pointer">
          <input type="radio" name={`whp_${k}`} checked={!isChecked}
            onChange={()=>{const n=checklist.filter(x=>x!==k);onFieldChange('checklist_whp',n);}} className="text-blue-500"/>
          <span className="text-xs text-gray-600 dark:text-gray-300">Tidak</span>
        </label>
      </div>
    </div>
  );
};

export default function WhpForm({ data, onChange }: WhpFormProps) {
  const u = (k:string,v:unknown) => onChange({...data,[k]:v});
  const checklist = (data.checklist_whp as string[])||[];

  useEffect(() => {
    const fetch = async () => {
      try {
        const [numRes, seqRes] = await Promise.all([
          getNextSequence('permit_number', 'whp'),
          getNextSequence('no_izin_kerja_umum'),
        ]);
        const permitNum = numRes?.data?.data?.next;
        const seq = seqRes?.data?.data?.next;
        const upd: Record<string,unknown> = {};
        if (permitNum && !data.no_permit_whp) upd.no_permit_whp = permitNum;
        if (seq && !data.no_izin_kerja_umum) upd.no_izin_kerja_umum = seq;
        if (Object.keys(upd).length) onChange({...data, ...upd});
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
      <Sec title="Informasi Umum">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="No. Permit WHP" name="no_permit_whp" value={(data.no_permit_whp as string)||''} onChange={e=>u('no_permit_whp',e.target.value)} register={()=>({})} placeholder="Auto" readOnly />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Dept / Bagian / CV</label>
            <MasterSelect masterType="departemen" value={(data.dept_bagian_cv as string)||''} onChange={(v) => u('dept_bagian_cv', v)} placeholder="Pilih departemen..." />
          </div>
          <Input label="Tanggal" name="tanggal_permit" type="date" value={(data.tanggal_permit as string)||''} onChange={e=>u('tanggal_permit',e.target.value)} register={()=>({})} />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Shift Kerja</label>
            <select className="hse-input text-xs font-medium" value={(data.shift_kerja as string)||''} onChange={e=>u('shift_kerja',e.target.value)}>
              <option value="">Pilih shift...</option>
              <option value="Pagi">Pagi</option>
              <option value="Siang">Siang</option>
              <option value="Malam">Malam</option>
            </select>
          </div>
          <Input label="No. Izin Kerja Umum" name="no_izin_kerja_umum" value={(data.no_izin_kerja_umum as string)||''} onChange={e=>u('no_izin_kerja_umum',e.target.value)} register={()=>({})} placeholder="Auto" readOnly />
        </div>
      </Sec>

      {/* SECTION 1: Detail Pekerjaan pada Ketinggian */}
      <Sec title="SECTION 1: Detail Pekerjaan pada Ketinggian">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Lokasi Kerja Spesifik *</label>
          <MasterSelect masterType="lokasi" value={(data.lokasi as string)||''} onChange={(v) => u('lokasi', v)} placeholder="Pilih lokasi..." />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Detail Pekerjaan yang akan Dikerjakan *</label>
          <textarea className="hse-input min-h-[70px] text-sm" value={(data.detail_pekerjaan_whp as string)||''} onChange={e=>u('detail_pekerjaan_whp',e.target.value)} placeholder="Jelaskan pekerjaan pada ketinggian..." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input label="Tanggal Pekerjaan" name="tanggal_pekerjaan" type="date" value={(data.tanggal_pekerjaan as string)||''} onChange={e=>u('tanggal_pekerjaan',e.target.value)} register={()=>({})} />
          <Input label="Waktu Mulai" name="jam_mulai" type="time" value={(data.jam_mulai as string)||''} onChange={e=>u('jam_mulai',e.target.value)} register={()=>({})} />
          <Input label="Waktu Selesai" name="jam_selesai" type="time" value={(data.jam_selesai as string)||''} onChange={e=>u('jam_selesai',e.target.value)} register={()=>({})} />
        </div>
      </Sec>

      {/* SECTION 2: Checklist Bekerja Pada Ketinggian */}
      <Sec title="SECTION 2: Checklist Bekerja Pada Ketinggian">
        {CHECKLIST_WHP.map(({k,l})=>(<WhpYaTidakRow key={k} k={k} l={l} checklist={checklist} onFieldChange={u} />))}

        {/* Pengendali Resiko */}
        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pengendali Resiko yang akan Diterapkan</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['Pencegahan Jatuh/Perlindungan dibagian tepi','Pengendalian Jatuh/Fall Restraint','Penangkap saat jatuh/Fall Arrest'].map(it=>(
              <label key={it} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700/50 border border-gray-200 dark:border-gray-700">
                <input type="radio" name="pengendali_resiko" value={it} checked={data.pengendali_resiko===it} onChange={()=>u('pengendali_resiko',it)} className="text-blue-500"/>
                <span className="text-xs text-gray-700 dark:text-gray-300">{it}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Detail Peralatan */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Detail Peralatan yang Digunakan</label>
          <textarea className="hse-input min-h-[60px] text-sm" value={(data.peralatan_whp as string)||''} onChange={e=>u('peralatan_whp',e.target.value)} placeholder="Contoh: Platform Elevasi, Man Lifting Basket Box, Fall Arrest..." />
        </div>

        {CHECKLIST_PENGAMAT.map(({k,l})=>(<WhpYaTidakRow key={k} k={k} l={l} checklist={checklist} onFieldChange={u} />))}

        {/* Nama Pengamat Safety */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Nama Pengamat Safety" name="nama_pengamat_safety" value={(data.nama_pengamat_safety as string)||''} onChange={e=>u('nama_pengamat_safety',e.target.value)} register={()=>({})} placeholder="Nama Pengamat Safety" />
        </div>

        {CHECKLIST_INSPEKSI.map(({k,l})=>(<WhpYaTidakRow key={k} k={k} l={l} checklist={checklist} onFieldChange={u} />))}

        {/* Anchor Point Temporer */}
        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!data.anchor_point_temporer} onChange={e=>u('anchor_point_temporer',e.target.checked)} className="rounded text-blue-500"/>
            <span className="text-sm text-gray-700 dark:text-gray-300">Apakah anchor point temporer digunakan? (Perlu persetujuan Supervisor Safety/Engineer)</span>
          </label>
          {!!data.anchor_point_temporer && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              <Input label="Nama" name="nama_anchor" value={(data.nama_anchor as string)||''} onChange={e=>u('nama_anchor',e.target.value)} register={()=>({})} />
              <Input label="Tanda Tangan" name="ttd_anchor" disabled value={(data.ttd_anchor as string)||''} onChange={()=>{}} register={()=>({})} className="opacity-60" />
              <Input label="Tanggal" name="tanggal_anchor" type="date" value={(data.tanggal_anchor as string)||''} onChange={e=>u('tanggal_anchor',e.target.value)} register={()=>({})} />
            </div>
          )}
        </div>

        {/* Rencana Penyelamatan */}
        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rencana penyelamatan pada pekerjaan risiko tinggi</label>
          {CHECKLIST_RENCANA.map(({k,l})=>(<WhpYaTidakRow key={k} k={k} l={l} checklist={checklist} onFieldChange={u} />))}
        </div>

        {/* Instruksi Tambahan */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Instruksi atau Informasi Tambahan</label>
          <textarea className="hse-input min-h-[60px] text-sm" value={(data.instruksi_tambahan_whp as string)||''} onChange={e=>u('instruksi_tambahan_whp',e.target.value)} placeholder="Instruksi atau informasi tambahan..." />
        </div>
      </Sec>

      {/* SECTION 3: Verifikasi Kendali Risiko */}
      <Sec title="SECTION 3: Verifikasi Kendali Risiko">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Supervisor review kendali risiko</label>
          <textarea className="hse-input min-h-[50px] text-sm" value={(data.supervisor_review_kendali_risiko as string)||''} onChange={e=>u('supervisor_review_kendali_risiko',e.target.value)} placeholder="Catatan review kendali risiko..." />
        </div>

        <PermitApprovalTable
          data={data}
          update={u}
          rows={[
            {
              label: 'A. Pemohon Izin (Foreman/Spv)',
              statement: 'Saya bertanggung jawab atas keselamatan pekerjaan pada ketinggian ini',
              tanggalField: 'verif_pemohon_tgl',
              namaField: 'verif_pemohon_nama',
              jabatanField: 'verif_pemohon_jabatan',
              parafField: 'verif_pemohon_paraf',
              bgClass: 'bg-blue-50 dark:bg-blue-900/20',
              disableName: false,
            },
            {
              label: 'B. Pemilik Lokasi (Spv/SPI)',
              statement: 'Saya telah memeriksa lokasi dan pekerjaan pada ketinggian dapat dilaksanakan',
              tanggalField: 'verif_pemilik_tgl',
              namaField: 'verif_pemilik_nama',
              jabatanField: 'verif_pemilik_jabatan',
              parafField: 'verif_pemilik_paraf',
              bgClass: 'bg-green-50 dark:bg-green-900/20',
            },
            {
              label: 'C. Pemberi Izin',
              statement: 'Izin kerja pada ketinggian ini telah diverifikasi dan dapat dilaksanakan',
              tanggalField: 'verif_pemberi_tgl',
              namaField: 'verif_pemberi_nama',
              jabatanField: 'verif_pemberi_jabatan',
              parafField: 'verif_pemberi_paraf',
              bgClass: 'bg-orange-50 dark:bg-orange-900/20',
            },
          ]}
          mengetahuiRows={[
            { subLabel: 'HSSE Foreman/Spv', tanggalField: 'verif_mengetahui_hsse_tgl', namaField: 'verif_pemberi_hse_foreman', jabatanField: 'verif_mengetahui_hsse_jabatan', parafField: 'verif_mengetahui_hsse_paraf' },
            { subLabel: 'Asisten HSSE (SPI)', tanggalField: 'verif_mengetahui_spi_tgl', namaField: 'verif_pemberi_hse_spi', jabatanField: 'verif_mengetahui_spi_jabatan', parafField: 'verif_mengetahui_spi_paraf' },
            { subLabel: 'Manager', tanggalField: 'verif_mengetahui_manager_tgl', namaField: 'verif_mengetahui_manager', jabatanField: 'verif_mengetahui_manager_jabatan', parafField: 'verif_mengetahui_manager_paraf' },
          ]}
        />
      </Sec>

      <DynamicFields
        permitType="whp"
        data={data}
        onChange={onChange}
        hardcodedFields={[
          'no_permit_whp','dept_bagian_cv','tanggal_permit','shift_kerja','no_izin_kerja_umum',
          'lokasi','detail_pekerjaan_whp','tanggal_pekerjaan','jam_mulai','jam_selesai',
          'checklist_whp','pengendali_resiko','peralatan_whp','nama_pengamat_safety',
          'anchor_point_temporer','nama_anchor','ttd_anchor','tanggal_anchor','instruksi_tambahan_whp',
          'supervisor_review_kendali_risiko',
          'verif_pemohon_tgl','verif_pemohon_nama','verif_pemohon_paraf',
          'verif_pemilik_tgl','verif_pemilik_nama','verif_pemilik_paraf',
          'verif_pemberi_hse_foreman','verif_pemberi_hse_spi','verif_mengetahui_manager',
        ]}
      />
    </div>
  );
}
