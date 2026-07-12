'use client';
import { useEffect } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { getNextSequence } from '@/lib/api/permit';
import MasterSelect from '@/components/ui/MasterSelect';
import DynamicFields from './DynamicFields';
import PermitApprovalTable from './PermitApprovalTable';

interface LwpFormProps { data: Record<string,unknown>; onChange: (d: Record<string,unknown>)=>void; }

const Sec = ({title,children}:{title:string;children:React.ReactNode}) => (
  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 sm:p-4 space-y-3 border border-gray-200 dark:border-gray-700">
    <h4 className="font-bold text-gray-800 dark:text-white text-xs sm:text-sm border-b-2 border-gray-200 dark:border-gray-700 pb-2 uppercase tracking-wide">{title}</h4>{children}</div>
);

const LwpYN = ({name,label,data,u}:{name:string;label:string;data:Record<string,unknown>;u:(k:string,v:unknown)=>void}) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <div className="flex gap-4">
      <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name={name} value="ya" checked={data[name]==='ya'} onChange={()=>u(name,'ya')} className="text-blue-500"/><span className="text-sm text-gray-700 dark:text-gray-300">Ya</span></label>
      <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name={name} value="tidak" checked={data[name]==='tidak'} onChange={()=>u(name,'tidak')} className="text-blue-500"/><span className="text-sm text-gray-700 dark:text-gray-300">Tidak</span></label>
    </div>
  </div>
);

export default function LwpForm({ data, onChange }: LwpFormProps) {
  const u = (k:string,v:unknown) => onChange({...data,[k]:v});

  useEffect(() => {
    const fetch = async () => {
      try {
        const [numRes, seqRes] = await Promise.all([
          getNextSequence('permit_number', 'lwp'),
          getNextSequence('form_no'),
        ]);
        const permitNum = numRes?.data?.data?.next;
        const seq = seqRes?.data?.data?.next;
        const upd: Record<string,unknown> = {};
        if (permitNum && !data.no_permit_lwp) upd.no_permit_lwp = permitNum;
        if (seq && !data.form_no) upd.form_no = seq;
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
      <Sec title="Header Permit">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="No. Permit LWP" name="no_permit_lwp" value={(data.no_permit_lwp as string)||''} onChange={e=>u('no_permit_lwp',e.target.value)} register={()=>({})} readOnly placeholder="Auto" />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Dept/Bag/CV</label>
            <MasterSelect masterType="departemen" value={(data.dept_bag_cv as string)||''} onChange={(v) => u('dept_bag_cv', v)} placeholder="Pilih departemen..." />
          </div>
          <Input label="Tanggal" name="tanggal_header" type="date" value={(data.tanggal_header as string)||''} onChange={e=>u('tanggal_header',e.target.value)} register={()=>({})} />
          <Select label="Shift Kerja" name="shift" value={(data.shift as string)||''} onChange={e=>u('shift',e.target.value)} options={[{value:'Pagi',label:'Pagi'},{value:'Siang',label:'Siang'},{value:'Malam',label:'Malam'}]} placeholder="Pilih Shift" />
          <Input label="Nomor Permit" name="nomor_permit" value={(data.nomor_permit as string)||''} onChange={e=>u('nomor_permit',e.target.value)} register={()=>({})} />
          <Select label="Valid Seminggu atau Sesuai MWP No" name="valid_seminggu" value={(data.valid_seminggu as string)||''} onChange={e=>u('valid_seminggu',e.target.value)} options={[{value:'Valid Seminggu',label:'Valid Seminggu'},{value:'Valid Satu Hari',label:'Valid Satu Hari'}]} placeholder="Pilih Validitas" />
          <Input label="Form No" name="form_no" value={(data.form_no as string)||''} onChange={e=>u('form_no',e.target.value)} register={()=>({})} readOnly placeholder="Auto" />
        </div>
      </Sec>

      {/* General Information */}
      <Sec title="Informasi Umum">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Perusahaan/Kontraktor</label>
            <MasterSelect masterType="perusahaan" value={(data.perusahaan as string)||''} onChange={(v) => u('perusahaan', v)} placeholder="Pilih perusahaan..." />
          </div>
          <Input label="Tanggal" name="tanggal" type="date" value={(data.tanggal as string)||''} onChange={e=>u('tanggal',e.target.value)} register={()=>({})} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Lokasi Pengangkatan / Location of Lift</label>
          <MasterSelect masterType="lokasi" value={(data.lokasi as string)||''} onChange={(v) => u('lokasi', v)} placeholder="Pilih lokasi..." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pekerjaan / Task</label><textarea className="hse-input min-h-[50px] text-sm" value={(data.pekerjaan as string)||''} onChange={e=>u('pekerjaan',e.target.value)} placeholder="Jenis pekerjaan..." /></div>
          <div className="space-y-1.5"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Benda yang Hendak Diangkat? / Description of Load</label><textarea className="hse-input min-h-[50px] text-sm" value={(data.benda_diangkat as string)||''} onChange={e=>u('benda_diangkat',e.target.value)} placeholder="Benda yang diangkat..." /></div>
        </div>
      </Sec>

      {/* Crane Information */}
      <Sec title="Informasi Crane">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Merek Crane / Crane Manufacture" name="merek_crane" value={(data.merek_crane as string)||''} onChange={e=>u('merek_crane',e.target.value)} register={()=>({})} />
          <Input label="Kapasitas Crane? / Crane Type/Capacity" name="kapasitas_crane" type="number" value={(data.kapasitas_crane as string)||''} onChange={e=>u('kapasitas_crane',e.target.value)} register={()=>({})} />
        </div>
        <LwpYN name="sertifikat_crane" label="Sertifikat Crane Masih Berlaku?" data={data} u={u} />
        <LwpYN name="sio_operator" label="Apakah SIO Operator Crane Masih Berlaku?" data={data} u={u} />
      </Sec>

      {/* Load Calculation */}
      <Sec title="Load Calculation / Perhitungan Beban">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            ['load_weight','Beban Saat Mengangkut / Load Weight (Kg)'],
            ['block_weight','Beban Block / Block Weight (Kg)'],
            ['spreader_beam_weight','Berat Penyebar Balok / Spreader Beam Weight (Kg)'],
            ['rigging_weight','Berat Tali / Rigging Weight (Kg)'],
            ['jib_weight','Berat Jib / Jib Weight (Kg)'],
            ['jib_ball_weight','Berat Bola Jib / Jib Ball Weight (Kg)'],
            ['hoist_line_weight','Berat Tali Hoist / Hoist Line Weight (Kg)'],
            ['total_load','Berat Total / Total Load (Kg)'],
          ].map(([k,l])=>(<Input key={k} label={l} name={k} type="number" value={(data[k] as string)||''} onChange={e=>u(k,e.target.value)} register={()=>({})} />))}
        </div>
        <Input label="Persentasi Kapasitas / Percentage of Capacity (%)" name="persentasi_kapasitas" value={(data.persentasi_kapasitas as string)||''} onChange={e=>u('persentasi_kapasitas',e.target.value)} register={()=>({})} />
        <p className="text-xs text-orange-600 italic">Untuk Crane Tunggal, Jangan Melebihi 80% Kapasitas Crane yang Tertera</p>
      </Sec>

      {/* Crane Set Up */}
      <Sec title="Crane Set Up / Formasi Crane">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Konfigurasi / Configuration" name="konfigurasi_crane" value={(data.konfigurasi_crane as string)||''} onChange={e=>u('konfigurasi_crane',e.target.value)} register={()=>({})} />
          <Input label="Ukuran Mat/Pad / Mat/Pad Size" name="ukuran_mat_pad" value={(data.ukuran_mat_pad as string)||''} onChange={e=>u('ukuran_mat_pad',e.target.value)} register={()=>({})} />
          <Input label="Keadaan Tanah / Soil Condition" name="keadaan_tanah" value={(data.keadaan_tanah as string)||''} onChange={e=>u('keadaan_tanah',e.target.value)} register={()=>({})} />
          <Input label="Kekuatan & Level Daratan / Ground Firm & Level" name="kekuatan_daratan" value={(data.kekuatan_daratan as string)||''} onChange={e=>u('kekuatan_daratan',e.target.value)} register={()=>({})} />
          <Input label="Radius Muatan Maksimum / Maximum Load Radius" name="radius_maks" value={(data.radius_maks as string)||''} onChange={e=>u('radius_maks',e.target.value)} register={()=>({})} />
          <Input label="Panjang Boom yang Sesuai / Corresponding Boom Length" name="panjang_boom" value={(data.panjang_boom as string)||''} onChange={e=>u('panjang_boom',e.target.value)} register={()=>({})} />
          <Input label="Kapasitas yang Tertera / Rated Capacity" name="kapasitas_tertera" value={(data.kapasitas_tertera as string)||''} onChange={e=>u('kapasitas_tertera',e.target.value)} register={()=>({})} />
          <Input label="Persentasi Kapasitas / Percentage of Capacity (%)" name="persentasi_kapasitas_crane" value={(data.persentasi_kapasitas_crane as string)||''} onChange={e=>u('persentasi_kapasitas_crane',e.target.value)} register={()=>({})} />
        </div>
        <div className="space-y-2 mt-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Pengangkatan akan Dilakukan:</p>
          <div className="flex flex-wrap gap-3">
            {[
              ['pada_boom','Pada Boom / On Boom'],
              ['pada_jib','Pada Jib / On Jib'],
              ['di_depan','Di Depan / Over Front'],
              ['derajat_360','360 Derajat / 360 Degree'],
            ].map(([k,l])=>(<label key={k} className="flex items-center gap-1 cursor-pointer"><input type="radio" name="metode_angkat" value={k} checked={data.metode_angkat===k} onChange={()=>u('metode_angkat',k)} className="text-blue-500"/><span className="text-xs text-gray-600 dark:text-gray-300">{l}</span></label>))}
          </div>
        </div>
      </Sec>

      {/* Hazard Assessment */}
      <Sec title="Hazard Assessment / Penilaian Bahaya">
        <LwpYN name="bahaya_bwh_tanah" label="Apakah Ada Bahaya di Bawah Tanah?" data={data} u={u} />
        <LwpYN name="bahaya_listrik" label="Apakah ada bahaya Listrik di sekitar radius?" data={data} u={u} />
        <LwpYN name="atas_pipa_gas" label="Apakah beban akan diangkat diatas jalur pipa gas atau diatas peralatan lain?" data={data} u={u} />
      </Sec>

      {/* Rigging */}
      <Sec title="Rigging / Tali-temali">
        <LwpYN name="rigging_kondisi_baik" label="Apakah semua peralatan Rigging kondisi baik dan colour code?" data={data} u={u} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Kapasitas Wire/Webbing Sling" name="kapasitas_sling" value={(data.kapasitas_sling as string)||''} onChange={e=>u('kapasitas_sling',e.target.value)} register={()=>({})} />
          <Input label="Sudut Sling" name="sudut_sling" value={(data.sudut_sling as string)||''} onChange={e=>u('sudut_sling',e.target.value)} register={()=>({})} />
          <Input label="Jumlah Sling" name="jumlah_sling" type="number" value={(data.jumlah_sling as string)||''} onChange={e=>u('jumlah_sling',e.target.value)} register={()=>({})} />
          <Input label="Pengurangan Kapasitas angkat sling karena sudut/Metode Rigging" name="reduksi_sling" value={(data.reduksi_sling as string)||''} onChange={e=>u('reduksi_sling',e.target.value)} register={()=>({})} />
          <Input label="Kapasitas Spreader/Lifting Beam" name="kapasitas_spreader" value={(data.kapasitas_spreader as string)||''} onChange={e=>u('kapasitas_spreader',e.target.value)} register={()=>({})} />
          <Input label="Kapasitas Shackle" name="kapasitas_shackle" value={(data.kapasitas_shackle as string)||''} onChange={e=>u('kapasitas_shackle',e.target.value)} register={()=>({})} />
          <Input label="Kapasitas Chain Block" name="kapasitas_chain_block" value={(data.kapasitas_chain_block as string)||''} onChange={e=>u('kapasitas_chain_block',e.target.value)} register={()=>({})} />
          <Input label="Jumlah Block dipakai untuk pengimbang berat beban" name="jumlah_chain_block" type="number" value={(data.jumlah_chain_block as string)||''} onChange={e=>u('jumlah_chain_block',e.target.value)} register={()=>({})} />
        </div>
        <LwpYN name="crane_hook_center" label="Apakah Crane Hook tepat di posisi Centre Gravity beban yang diangkat?" data={data} u={u} />
      </Sec>

      {/* Otorisasi Penandatanganan */}
      <Sec title="Otorisasi Penandatanganan Perijinan">
        <PermitApprovalTable
          data={data}
          update={u}
          rows={[
            {
              label: 'Operator/Crane 1',
              statement: 'Saya menyatakan siap melaksanakan pengangkatan sesuai prosedur',
              tanggalField: 'tt_pemohon_op1_tgl',
              namaField: 'tt_pemohon_op1',
              jabatanField: 'tt_pemohon_op1_jabatan',
              parafField: 'tt_pemohon_op1_paraf',
              bgClass: 'bg-blue-50 dark:bg-blue-900/20',
              disableName: false,
            },
            {
              label: 'Operator/Crane 2',
              statement: 'Saya menyatakan siap melaksanakan pengangkatan sesuai prosedur',
              tanggalField: 'tt_pemohon_op2_tgl',
              namaField: 'tt_pemohon_op2',
              jabatanField: 'tt_pemohon_op2_jabatan',
              parafField: 'tt_pemohon_op2_paraf',
              bgClass: 'bg-blue-50 dark:bg-blue-900/20',
              disableName: false,
            },
            {
              label: 'Supervisor/Foreman Lifting',
              statement: 'Saya telah memverifikasi semua persiapan lifting dan mengizinkan pekerjaan',
              tanggalField: 'tt_pemohon_supervisor_tgl',
              namaField: 'tt_pemohon_supervisor',
              jabatanField: 'tt_pemohon_supervisor_jabatan',
              parafField: 'tt_pemohon_supervisor_paraf',
              bgClass: 'bg-green-50 dark:bg-green-900/20',
            },
            {
              label: 'Competent Person/Lifting Specialist',
              statement: 'Lifting plan telah dikaji ulang dan disetujui',
              tanggalField: 'tt_pemohon_cp_tgl',
              namaField: 'tt_pemohon_cp',
              jabatanField: 'tt_pemohon_cp_jabatan',
              parafField: 'tt_pemohon_cp_paraf',
              bgClass: 'bg-green-50 dark:bg-green-900/20',
              disableName: false,
            },
          ]}
          mengetahuiRows={[
            { subLabel: 'Contractor Manager', tanggalField: 'tt_pemberi_cm_tgl', namaField: 'tt_pemberi_cm', jabatanField: 'tt_pemberi_cm_jabatan', parafField: 'tt_pemberi_cm_paraf' },
            { subLabel: 'Superintendent (Owner)', tanggalField: 'tt_pemberi_supt_tgl', namaField: 'tt_pemberi_supt', jabatanField: 'tt_pemberi_supt_jabatan', parafField: 'tt_pemberi_supt_paraf' },
            { subLabel: 'Manager (Owner) / Tim Leader', tanggalField: 'tt_pemberi_manager_tgl', namaField: 'tt_pemberi_manager', jabatanField: 'tt_pemberi_manager_jabatan', parafField: 'tt_pemberi_manager_paraf' },
            { subLabel: 'Asisten HSSE', tanggalField: 'tt_pemberi_hsse_tgl', namaField: 'tt_pemberi_hsse', jabatanField: 'tt_pemberi_hsse_jabatan', parafField: 'tt_pemberi_hsse_paraf' },
            { subLabel: 'Kasubag Sistem & IT', tanggalField: 'tt_pemberi_it_tgl', namaField: 'tt_pemberi_it', jabatanField: 'tt_pemberi_it_jabatan', parafField: 'tt_pemberi_it_paraf' },
          ]}
        />
      </Sec>

      <DynamicFields
        permitType="lwp"
        data={data}
        onChange={onChange}
        hardcodedFields={[
          'no_permit_lwp','dept_bag_cv','tanggal_header','shift','nomor_permit','valid_seminggu','form_no',
          'perusahaan','tanggal','lokasi','pekerjaan','benda_diangkat',
          'merek_crane','kapasitas_crane','sertifikat_crane','sio_operator',
          'load_weight','block_weight','spreader_beam_weight','rigging_weight','jib_weight',
          'jib_ball_weight','hoist_line_weight','total_load','persentasi_kapasitas',
          'konfigurasi_crane','ukuran_mat_pad','keadaan_tanah','kekuatan_daratan','radius_maks',
          'panjang_boom','kapasitas_tertera','persentasi_kapasitas_crane','metode_angkat',
          'bahaya_bwh_tanah','bahaya_listrik','atas_pipa_gas',
          'rigging_kondisi_baik','kapasitas_sling','sudut_sling','jumlah_sling','reduksi_sling',
          'kapasitas_spreader','kapasitas_shackle','kapasitas_chain_block','jumlah_chain_block','crane_hook_center',
          'tt_pemohon_op1','tt_pemohon_op2','tt_pemohon_supervisor','tt_pemohon_cp',
          'tt_pemberi_cm','tt_pemberi_supt','tt_pemberi_manager','tt_pemberi_hsse','tt_pemberi_it',
        ]}
      />
    </div>
  );
}
