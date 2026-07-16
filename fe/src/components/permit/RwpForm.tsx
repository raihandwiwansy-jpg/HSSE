'use client';
import { useEffect } from 'react';
import { getNextSequence } from '@/lib/api/permit';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import MasterSelect from '@/components/ui/MasterSelect';
import DynamicFields from './DynamicFields';
import PermitApprovalTable from './PermitApprovalTable';

interface RwpFormProps { data: Record<string,unknown>; onChange: (d: Record<string,unknown>)=>void; }

const CHECKLIST_ITEMS = ['Plot Layout Lokasi Radiografi','Peralatan Listrik/Intrinsik Aman','Entri Kendaraan/Penggunaan Mesin','Pekerjaan Pada Peralatan Bertegangan','Penggunaan Alat Listrik/Pneumatik/Buffing','Lainnya'];

const BAHAYA_RADIASI = [
  'Radiasi','Material Beracun','Paparan Bahan Kimia','Bahaya Listrik',
  'Udara Berbahaya/Beracun','Kontak dengan Panas/Dingin','Pandangan Terbatas',
  'Penyimpanan Energi/Area Bertekanan','Bahan Piroforik','Kemudahan Akses',
  'Pergerakan Mesin','Jalan Keluar/Masuk','Material Terperangkap',
  'Ventilasi Buruk','Ruang Terbatas','Terpeleset/Tersandung','Potensi Terjatuh',
  'Api/Percikan','Hilang Kesadaran','Kebisingan','Lainnya'
];

const PENCEGAHAN = [
  'Pemberitahuan ke Grup Lain','Pemberitahuan CCR & TL/ATL','Penggunaan Scaffolding',
  'Life Line','Penerangan Tambahan','Safety Harness','Sarung Tangan Kulit',
  'Proteksi Pendengaran','Ruang Terbatas','Permit Masuk','Klip Beracun'
];

const PPE_RWP = ['Goggles/Face Shield','Disposable Coverall','Survey Badge','Survey Meter','Dosimeter','Lainnya'];

const Sec = ({title,children}:{title:string;children:React.ReactNode}) => (
  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 sm:p-4 space-y-3 border border-gray-200 dark:border-gray-700">
    <h4 className="font-bold text-gray-800 dark:text-white text-xs sm:text-sm border-b-2 border-gray-200 dark:border-gray-700 pb-2 uppercase tracking-wide">{title}</h4>{children}</div>
);

export default function RwpForm({ data, onChange }: RwpFormProps) {
  const u = (k:string,v:unknown) => onChange({...data,[k]:v});

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getNextSequence('permit_number', 'rwp');
        const num = res?.data?.data?.next;
        if (num && !data.no_permit_rwp) {
          onChange({...data, no_permit_rwp: num});
        }
      } catch {}
    };
    fetch();
  }, []);

  const bahaya = (data.bahaya_radiasi as string[])||[];
  const pencegahan = (data.pencegahan_radiasi as string[])||[];
  const ppe = (data.ppe_rwp as string[])||[];

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

      {/* HEADER */}
      <Sec title="Informasi Umum">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="No. Permit RWP" name="no_permit_rwp" value={(data.no_permit_rwp as string)||''} onChange={e=>u('no_permit_rwp',e.target.value)} register={()=>({})} readOnly placeholder="Auto" />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Dept/Bag/CV</label>
            <MasterSelect masterType="departemen" value={(data.dept_bag_cv as string)||''} onChange={(v) => u('dept_bag_cv', v)} placeholder="Pilih departemen..." />
          </div>
          <Input label="Tanggal" name="tanggal_rwp" type="date" value={(data.tanggal_rwp as string)||''} onChange={e=>u('tanggal_rwp',e.target.value)} register={()=>({})} />
          <Select label="Shift Kerja" name="shift_kerja" value={(data.shift_kerja as string)||''} onChange={e=>u('shift_kerja',e.target.value)} options={[{value:'Pagi',label:'Pagi'},{value:'Siang',label:'Siang'},{value:'Malam',label:'Malam'}]} placeholder="Pilih Shift" />
        </div>
      </Sec>

      {/* SECTION A */}
      <Sec title="SECTION A: Detail Pekerjaan">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Peralatan</label>
            <MasterSelect masterType="peralatan" value={(data.peralatan as string)||''} onChange={(v) => u('peralatan', v)} placeholder="Pilih peralatan..." />
          </div>
          <Input label="Area" name="area_radiasi" value={(data.area_radiasi as string)||''} onChange={e=>u('area_radiasi',e.target.value)} register={()=>({})} />
        </div>
        <div className="space-y-1.5"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Detail Gambaran Pekerjaan *</label><textarea className="hse-input min-h-[70px] text-sm" value={(data.detail_pekerjaan_rwp as string)||''} onChange={e=>u('detail_pekerjaan_rwp',e.target.value)} placeholder="Jelaskan pekerjaan radiografi..." /></div>
        <div className="flex flex-wrap gap-3 mt-2">
          {CHECKLIST_ITEMS.map(it=>(<label key={it} className="flex items-start gap-2 cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700/50"><input type="checkbox" checked={(data.checklist_rwp as string[]||[]).includes(it)} onChange={()=>{const c=(data.checklist_rwp as string[])||[];u('checklist_rwp',c.includes(it)?c.filter(x=>x!==it):[...c,it]);}} className="mt-0.5 rounded text-blue-500"/><span className="text-xs text-gray-700 dark:text-gray-300">{it}</span></label>))}
        </div>
        <div className="space-y-1.5"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Copy Sertifikat BATAN; Izin, Transportasi, Operasi Manifes Limbah</label><textarea className="hse-input min-h-[50px] text-sm" value={(data.sertifikat_batan as string)||''} onChange={e=>u('sertifikat_batan',e.target.value)} placeholder="Keterangan sertifikat..." /></div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Pemohon Izin</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Input label="Nama" name="pemohon_nama" value={(data.pemohon_nama as string)||''} onChange={e=>u('pemohon_nama',e.target.value)} register={()=>({})} />
            <Input label="Perusahaan" name="pemohon_perusahaan" value={(data.pemohon_perusahaan as string)||''} onChange={e=>u('pemohon_perusahaan',e.target.value)} register={()=>({})} placeholder="Nama Perusahaan" />
            <Input label="Jabatan" name="pemohon_jabatan" value={(data.pemohon_jabatan as string)||''} onChange={e=>u('pemohon_jabatan',e.target.value)} register={()=>({})} />
            <Input label="No. Badge" name="pemohon_no_badge" value={(data.pemohon_no_badge as string)||''} onChange={e=>u('pemohon_no_badge',e.target.value)} register={()=>({})} />
            <Input label="Tanda Tangan" name="pemohon_tanda_tangan" value={(data.pemohon_tanda_tangan as string)||''} onChange={()=>{}} register={()=>({})} disabled className="opacity-60" />
          </div>
        </div>
      </Sec>

      {/* SECTION B */}
      <Sec title="SECTION B: Analisa Bahaya">
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={!!data.jsa_diperlukan} onChange={e=>u('jsa_diperlukan',e.target.checked)} className="rounded text-blue-500"/><span className="text-sm text-gray-700 dark:text-gray-300">Diperlukan JSA? (Jika Ya, Lampirkan Dokumen JSA)</span></label>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Identifikasi Potensi Bahaya:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {BAHAYA_RADIASI.map(it=>(<label key={it} className="flex items-start gap-2 cursor-pointer p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700/50"><input type="checkbox" checked={bahaya.includes(it)} onChange={()=>{const n=bahaya.includes(it)?bahaya.filter(x=>x!==it):[...bahaya,it];u('bahaya_radiasi',n);}} className="mt-0.5 rounded text-blue-500"/><span className="text-xs text-gray-700 dark:text-gray-300">{it}</span></label>))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Identifikasi Pencegahan yang Diperlukan:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {PENCEGAHAN.map(it=>(<label key={it} className="flex items-start gap-2 cursor-pointer p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700/50"><input type="checkbox" checked={pencegahan.includes(it)} onChange={()=>{const n=pencegahan.includes(it)?pencegahan.filter(x=>x!==it):[...pencegahan,it];u('pencegahan_radiasi',n);}} className="mt-0.5 rounded text-blue-500"/><span className="text-xs text-gray-700 dark:text-gray-300">{it}</span></label>))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Review MSDS, Rencana Tertulis Terlampir, Barikade:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={!!data.review_msds} onChange={e=>u('review_msds',e.target.checked)} className="rounded text-blue-500"/><span className="text-sm text-gray-700 dark:text-gray-300">Review MSDS</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={!!data.rencana_tertulis} onChange={e=>u('rencana_tertulis',e.target.checked)} className="rounded text-blue-500"/><span className="text-sm text-gray-700 dark:text-gray-300">Rencana Tertulis Terlampir</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={!!data.barikade} onChange={e=>u('barikade',e.target.checked)} className="rounded text-blue-500"/><span className="text-sm text-gray-700 dark:text-gray-300">Barikade</span></label>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Input label="Jarak Barikade (Meter)" name="jarak_barikade" value={(data.jarak_barikade as string)||''} onChange={e=>u('jarak_barikade',e.target.value)} register={()=>({})} />
          <Input label="Alat Komunikasi (Radio)" name="alat_komunikasi" value={(data.alat_komunikasi as string)||''} onChange={e=>u('alat_komunikasi',e.target.value)} register={()=>({})} />
          <Input label="Jumlah Keterpaparan" name="jumlah_keterpaparan" value={(data.jumlah_keterpaparan as string)||''} onChange={e=>u('jumlah_keterpaparan',e.target.value)} register={()=>({})} />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Keberadaan Operator & Plot Plan:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={!!data.keberadaan_operator} onChange={e=>u('keberadaan_operator',e.target.checked)} className="rounded text-blue-500"/><span className="text-sm text-gray-700 dark:text-gray-300">Keberadaan Operator</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={!!data.plot_plan_lokasi} onChange={e=>u('plot_plan_lokasi',e.target.checked)} className="rounded text-blue-500"/><span className="text-sm text-gray-700 dark:text-gray-300">Plot Plan Lokasi</span></label>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select label="Tipe Sumber (IRD/X-ray)" name="tipe_sumber" value={(data.tipe_sumber as string)||''} onChange={e=>u('tipe_sumber',e.target.value)} options={[{value:'IRD',label:'IRD'},{value:'X-ray',label:'X-ray'}]} placeholder="Pilih Tipe Sumber" />
          <Input label="Ukuran Sumber" name="ukuran_sumber" value={(data.ukuran_sumber as string)||''} onChange={e=>u('ukuran_sumber',e.target.value)} register={()=>({})} />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">PPE (Personal Protective Equipment):</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {PPE_RWP.map(it=>(<label key={it} className="flex items-start gap-2 cursor-pointer p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700/50"><input type="checkbox" checked={ppe.includes(it)} onChange={()=>{const n=ppe.includes(it)?ppe.filter(x=>x!==it):[...ppe,it];u('ppe_rwp',n);}} className="mt-0.5 rounded text-blue-500"/><span className="text-xs text-gray-700 dark:text-gray-300">{it}</span></label>))}
          </div>
        </div>
      </Sec>

      {/* SECTION C */}
      <Sec title="SECTION C: Pengesahan Izin Kerja Radiografi">
        <PermitApprovalTable
          data={data}
          update={u}
          rows={[
            {
              label: 'A. Pemohon Izin (Radiographer / Supervisor)',
              statement: 'Saya bertanggung jawab atas pelaksanaan pekerjaan radiografi sesuai prosedur keselamatan radiasi',
              tanggalField: 'rwp_pemohon_tgl',
              namaField: 'pemohon_nama',
              jabatanField: 'pemohon_jabatan',
              parafField: 'pemohon_tanda_tangan',
              bgClass: 'bg-blue-50 dark:bg-blue-900/20',
              disableName: false,
            },
            {
              label: 'B. Pemilik Lokasi (Area Supervisor)',
              statement: 'Saya telah memeriksa lokasi dan menyetujui pelaksanaan pekerjaan radiografi di area ini',
              tanggalField: 'rwp_pemilik_tgl',
              namaField: 'kepada_pemohon_izin',
              jabatanField: 'rwp_pemilik_jabatan',
              parafField: 'rwp_pemilik_paraf',
              bgClass: 'bg-green-50 dark:bg-green-900/20',
            },
            {
              label: 'C. Pemberi Izin (Issuing Authority)',
              statement: 'Izin kerja radiografi ini sah untuk dilaksanakan setelah seluruh persyaratan terpenuhi',
              tanggalField: 'rwp_pemberi_tgl',
              namaField: 'issuing_authority',
              jabatanField: 'rwp_pemberi_jabatan',
              parafField: 'rwp_pemberi_paraf',
              bgClass: 'bg-orange-50 dark:bg-orange-900/20',
            },
          ]}
          mengetahuiRows={[
            { subLabel: 'HSSE Admin/Inspektor', tanggalField: 'rwp_hsse_tgl', namaField: 'diketahui_hse', jabatanField: 'rwp_hsse_jabatan', parafField: 'rwp_hsse_paraf' },
            { subLabel: 'QC Inspector', tanggalField: 'rwp_qc_tgl', namaField: 'diketahui_qc', jabatanField: 'rwp_qc_jabatan', parafField: 'rwp_qc_paraf' },
            { subLabel: 'Manager / Approver', tanggalField: 'rwp_manager_tgl', namaField: 'manager_approve', jabatanField: 'rwp_manager_jabatan', parafField: 'rwp_manager_paraf' },
          ]}
        />
      </Sec>

      <DynamicFields
        permitType="rwp"
        data={data}
        onChange={onChange}
        hardcodedFields={[
          'no_permit_rwp','dept_bag_cv','tanggal_rwp','shift_kerja',
          'peralatan','area_radiasi','detail_pekerjaan_rwp','checklist_rwp','sertifikat_batan',
          'pemohon_nama','pemohon_perusahaan','pemohon_jabatan','pemohon_no_badge','pemohon_tanda_tangan',
          'jsa_diperlukan','bahaya_radiasi','pencegahan_radiasi','review_msds','rencana_tertulis',
          'barikade','jarak_barikade','alat_komunikasi','jumlah_keterpaparan','keberadaan_operator',
          'plot_plan_lokasi','tipe_sumber','ukuran_sumber','ppe_rwp',
          'dari_pembuat_izin','kepada_pemohon_izin','diketahui_hse','diketahui_qc',
          'area_kerja_diinspeksi','eksekutor_nama','eksekutor_no_badge','eksekutor_tanda_tangan',
          'eksekutor_tanggal','eksekutor_no_kontak','issuing_authority','manager_approve',
        ]}
      />
    </div>
  );
}
