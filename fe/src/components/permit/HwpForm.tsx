'use client';

import { useEffect } from 'react';
import { getNextSequence } from '@/lib/api/permit';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Checkbox from '@/components/ui/Checkbox';
import RadioGroup from '@/components/ui/RadioGroup';
import MasterSelect from '@/components/ui/MasterSelect';
import DynamicFields from './DynamicFields';
import PermitApprovalTable from './PermitApprovalTable';

interface HwpFormProps {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

const BAHAYA_KOLOM_1 = [
  'Flames/Welding/Percikan Api (Sparks)',
  'Produk Mudah Terbakar (Flammable products)',
  'Spontaneous Fire/Ignition',
  'CO, H2O, Asphyxia/Intoxication',
  'Toxic/Produk Korosif',
  'Gas/Cairan dalam wadah bertekanan',
  'Isolasi dengan blind flange sederhana',
  'Lainnya',
];

const BAHAYA_KOLOM_2 = [
  'Terdapat Area Kerja yang Berdekatan',
  'Penghilangan Kisi/Pegangan Tangan',
  'Area dibawah Resiko Spesifik',
  'Kebisingan',
  'Radiasi',
  'Keberadaan Kabel/Pipa',
  'Peralatan Bertegangan',
  'Panel Bertegangan',
  'Temperatur Tinggi/Rendah',
  'Bahaya Biologi',
];

const BAHAYA_KOLOM_3 = [
  'Bagian Bergerak/Berputar',
  'Kondisi Cuaca',
  'Bekerja dengan Alat Berat',
  'Pengangkatan Kritis (Lifting/Rigging Plan)',
  'Bekerja dekat Pinggiran Air',
  'Bekerja didalam Galian',
  'Area Terbatas',
  'Bekerja Pada Ketinggian (>1.8m)',
  'Bekerja pada Temporary Platform',
  'Memerlukan Scaffolding Tube >3m',
];

const PPE_ITEMS = [
  'Safety shoes', 'Helmet', 'Safety Glasses', 'High Reflective Vest',
  'Pakaian Lengan Panjang', 'PVC Gloves', 'SCBA', 'Dust Mask',
  'Face Shield', 'Alat Pelindung Pendengaran', 'Full Body Overall',
  'Pakaian Overall untuk Chemicals', 'Full Body Harness', 'Life Lines',
  'Life Jacket', 'Individual Gas Tester', 'Goggles', 'Welding Mask',
  'HEPA Mask', '*PPE Khusus (Katun, Antistatik)',
];

const PERALATAN_ITEMS = [
  'Fire Fighting Equipment', 'Peralatan Emergency',
  'Penerangan Tambahan Temporary', 'Tersedia Akses Jalan',
  'Safety Sign/Barikade', 'Alat Komunikasi untuk Keamanan',
  'Selimut Api/Fire Blanket', 'PPE Khusus Untuk Area Spesifik',
];

const PERSYARATAN_ITEMS = [
  'Diperlukan Fire Watchman', 'Pengujian Gas',
  'Pengujian Gas Secara Kontinyu', 'Peralatan Penekan/Pembuang Udara',
  'Berventilasi Alami/Mekanik', 'Peralatan Penguras',
  'Pemurnian Gas Inert', 'Monitoring HSSE Permanen',
  'Larangan Bekerja Sendirian', 'Isolasi Elektrikal/Lock-Out',
  'Isolasi Mekanikal/Lock-Out', 'Area Bebas Bahan Mudah Terbakar',
  'Pemantauan Area Masuk/Entry Watch', 'Monitoring Permanen (Ruang Terbatas)',
];

export default function HwpForm({ data, onChange }: HwpFormProps) {
  const update = (key: string, value: unknown) => onChange({ ...data, [key]: value });
  const bahaya = (data.bahaya_checklist as string[]) || [];
  const ppe = (data.ppe_checklist as string[]) || [];
  const peralatan = (data.peralatan_lain_checklist as string[]) || [];
  const persyaratan = (data.persyaratan_lain_checklist as string[]) || [];

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getNextSequence('permit_number', 'hwp');
        const num = res?.data?.data?.next;
        if (num && !data.no_permit_hwp) {
          onChange({...data, no_permit_hwp: num});
        }
      } catch {}
    };
    fetch();
  }, []);

  const toggle = (item: string, list: string[], key: string) => {
    update(key, list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  return (
    <div className="space-y-4">
      {/* Company Header */}
      <div className="flex flex-col items-center border-b-2 border-gray-300 dark:border-gray-600 pb-3 mb-4">
        <div className="flex items-center justify-center gap-3 w-full">
          <img src="/Picture1.png" alt="Logo INL" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
          <div className="text-left">
            <h2 className="text-sm sm:text-base font-bold text-gray-800 dark:text-white leading-tight">PT. INDUSTRI NABATI LESTARI</h2>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-tight mt-0.5">KEK Sei Mangkei, Kab. Simalungun, Sumatera Utara</p>
          </div>
        </div>
        <p className="text-[10px] text-orange-600 font-semibold mt-2">Izin ini hanya berlaku untuk satu shift kerja</p>
      </div>

      {/* Header Fields */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Dept/Bag/CV</label>
            <MasterSelect masterType="departemen" value={(data.departemen as string) || ''} onChange={(v) => update('departemen', v)} placeholder="Pilih departemen..." />
          </div>
          <Input label="Tanggal" name="tanggal" type="date" value={(data.tanggal as string) || ''} onChange={(e) => update('tanggal', e.target.value)} register={() => ({})} />
          <Input label="No. Permit HWP" name="no_permit_hwp" value={(data.no_permit_hwp as string) || ''} onChange={(e) => update('no_permit_hwp', e.target.value)} register={() => ({})} readOnly placeholder="Auto" />
          <Select label="Shift Kerja" name="shift" value={(data.shift as string) || ''} onChange={(e) => update('shift', e.target.value)} options={[{value:'Pagi',label:'Pagi'},{value:'Siang',label:'Siang'},{value:'Malam',label:'Malam'}]} placeholder="Pilih Shift" />
        </div>
      </div>

      {/* SECTION A */}
      <Section title="SECTION A: Identifikasi Skope Pekerjaan">
        <Input label="Tanggal Permohonan Izin Kerja" name="tanggal_permohonan" type="date" value={(data.tanggal_permohonan as string) || ''} onChange={(e) => update('tanggal_permohonan', e.target.value)} register={() => ({})} />
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Pekerjaan yang Akan Dilaksanakan *</label>
          <textarea className="hse-input min-h-[60px] text-sm" value={(data.pekerjaan_dilaksanakan as string) || ''} onChange={(e) => update('pekerjaan_dilaksanakan', e.target.value)} placeholder="Jelaskan pekerjaan..." />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Jam Mulai" name="jam_mulai" type="time" value={(data.jam_mulai as string) || ''} onChange={(e) => update('jam_mulai', e.target.value)} register={() => ({})} />
          <Input label="Jam Selesai" name="jam_selesai" type="time" value={(data.jam_selesai as string) || ''} onChange={(e) => update('jam_selesai', e.target.value)} register={() => ({})} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Pemohon Izin Oleh" name="pemohon_izin_oleh" value={(data.pemohon_izin_oleh as string) || ''} onChange={(e) => update('pemohon_izin_oleh', e.target.value)} register={() => ({})} placeholder="Nama" />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Nama Perusahaan</label>
            <MasterSelect masterType="perusahaan" value={(data.nama_perusahaan as string) || ''} onChange={(v) => update('nama_perusahaan', v)} placeholder="Pilih perusahaan..." />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Penanggung Jawab / Responsible Persons (RP)" name="penanggung_jawab" value={(data.penanggung_jawab as string) || ''} onChange={(e) => update('penanggung_jawab', e.target.value)} register={() => ({})} />
          <Input label="Position" name="position" value={(data.position as string) || ''} onChange={(e) => update('position', e.target.value)} register={() => ({})} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Jumlah Pekerja (Orang)" name="jumlah_pekerja" type="number" value={(data.jumlah_pekerja as string) || ''} onChange={(e) => update('jumlah_pekerja', e.target.value)} register={() => ({})} />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Lokasi Tempat Pekerjaan Dilakukan</label>
            <MasterSelect masterType="lokasi" value={(data.lokasi as string) || ''} onChange={(v) => update('lokasi', v)} placeholder="Pilih lokasi..." />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Equipment/Tools yang Digunakan</label>
          <textarea className="hse-input min-h-[50px] text-sm" value={(data.equipment_tools as string) || ''} onChange={(e) => update('equipment_tools', e.target.value)} placeholder="Sebutkan equipment/tools..." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Total Unit" name="total_unit" value={(data.total_unit as string) || ''} onChange={(e) => update('total_unit', e.target.value)} register={() => ({})} />
          <Checkbox checked={(data.daftar_alat_lulus_inspeksi as boolean) || false} onChange={(checked) => update('daftar_alat_lulus_inspeksi', checked)} label="Lampirkan Daftar Alat Lulus Inspeksi" size="md" />
        </div>
      </Section>

      {/* SECTION B - Hazard Analysis Table */}
      <Section title="SECTION B: Analisa Bahaya Terkait">
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">Beri tanda Ö pada bahaya yang terkait:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300 w-[60px]">Ö</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">Kolom 1</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300 w-[60px]">Ö</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">Kolom 2</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300 w-[60px]">Ö</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">Kolom 3</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.max(BAHAYA_KOLOM_1.length, BAHAYA_KOLOM_2.length, BAHAYA_KOLOM_3.length) }, (_, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'}>
                  <td className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-center">
                    {BAHAYA_KOLOM_1[i] && <input type="checkbox" checked={bahaya.includes(BAHAYA_KOLOM_1[i])} onChange={() => toggle(BAHAYA_KOLOM_1[i], bahaya, 'bahaya_checklist')} className="w-3.5 h-3.5 text-blue-500 rounded" />}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-gray-700 dark:text-gray-300">{BAHAYA_KOLOM_1[i] || ''}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-center">
                    {BAHAYA_KOLOM_2[i] && <input type="checkbox" checked={bahaya.includes(BAHAYA_KOLOM_2[i])} onChange={() => toggle(BAHAYA_KOLOM_2[i], bahaya, 'bahaya_checklist')} className="w-3.5 h-3.5 text-blue-500 rounded" />}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-gray-700 dark:text-gray-300">{BAHAYA_KOLOM_2[i] || ''}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-center">
                    {BAHAYA_KOLOM_3[i] && <input type="checkbox" checked={bahaya.includes(BAHAYA_KOLOM_3[i])} onChange={() => toggle(BAHAYA_KOLOM_3[i], bahaya, 'bahaya_checklist')} className="w-3.5 h-3.5 text-blue-500 rounded" />}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-gray-700 dark:text-gray-300">{BAHAYA_KOLOM_3[i] || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-2 mt-3">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Lainnya (sebutkan)</label>
          <textarea className="hse-input min-h-[40px] text-sm" value={(data.bahaya_lainnya as string) || ''} onChange={(e) => update('bahaya_lainnya', e.target.value)} placeholder="Bahaya lainnya..." />
        </div>
        <div className="space-y-2 mt-2">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Bersinggungan dengan Izin Kerja Lain</p>
          <RadioGroup name="bersinggungan_izin" options={[{ value: 'ya', label: 'Ya' }, { value: 'tidak', label: 'Tidak' }]} value={(data.bersinggungan_izin as string) || ''} onChange={(v) => update('bersinggungan_izin', v)} />
          {(data.bersinggungan_izin as string) === 'ya' && (
            <Input label="Nomor Izin Kerja Lain" name="nomor_izin_lain" value={(data.nomor_izin_lain as string) || ''} onChange={(e) => update('nomor_izin_lain', e.target.value)} register={() => ({})} placeholder="Nomor izin kerja lain" />
          )}
        </div>
      </Section>

      {/* SECTION C - PPE & Equipment with Wajib column */}
      <Section title="SECTION C: Perhatian - PPE & Peralatan">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300 w-[60px]">Ö</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">Alat Pelindung Pribadi (PPE)</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-center font-semibold text-gray-700 dark:text-gray-300 w-[60px]">Wajib</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300 w-[60px]">Ö</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">Peralatan Lainnya</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-center font-semibold text-gray-700 dark:text-gray-300 w-[60px]">Wajib</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.max(PPE_ITEMS.length, PERALATAN_ITEMS.length) }, (_, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'}>
                  <td className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-center">
                    {PPE_ITEMS[i] && <input type="checkbox" checked={ppe.includes(PPE_ITEMS[i])} onChange={() => toggle(PPE_ITEMS[i], ppe, 'ppe_checklist')} className="w-3.5 h-3.5 text-blue-500 rounded" />}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-gray-700 dark:text-gray-300">{PPE_ITEMS[i] || ''}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-center text-gray-500 dark:text-gray-400">
                    {PPE_ITEMS[i] ? (i < 6 ? 'Ö' : '') : ''}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-center">
                    {PERALATAN_ITEMS[i] && <input type="checkbox" checked={peralatan.includes(PERALATAN_ITEMS[i])} onChange={() => toggle(PERALATAN_ITEMS[i], peralatan, 'peralatan_lain_checklist')} className="w-3.5 h-3.5 text-blue-500 rounded" />}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-gray-700 dark:text-gray-300">{PERALATAN_ITEMS[i] || ''}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-center text-gray-500 dark:text-gray-400">
                    {PERALATAN_ITEMS[i] ? (i < 4 ? 'Ö' : '') : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Persyaratan Lainnya */}
        <div className="mt-3">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-2">Persyaratan Lainnya</p>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border border-gray-300 dark:border-gray-600">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-center font-semibold text-gray-700 dark:text-gray-300 w-[60px]">Ö</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">Persyaratan</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-center font-semibold text-gray-700 dark:text-gray-300 w-[60px]">Ö</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">Persyaratan</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.ceil(PERSYARATAN_ITEMS.length / 2) }, (_, i) => {
                  const left = PERSYARATAN_ITEMS[i * 2];
                  const right = PERSYARATAN_ITEMS[i * 2 + 1];
                  return (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'}>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-center">
                        <input type="checkbox" checked={persyaratan.includes(left)} onChange={() => toggle(left, persyaratan, 'persyaratan_lain_checklist')} className="w-3.5 h-3.5 text-blue-500 rounded" />
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-gray-700 dark:text-gray-300">{left}</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-center">
                        {right && <input type="checkbox" checked={persyaratan.includes(right)} onChange={() => toggle(right, persyaratan, 'persyaratan_lain_checklist')} className="w-3.5 h-3.5 text-blue-500 rounded" />}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-gray-700 dark:text-gray-300">{right || ''}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <Input label="Gas Detector ID Register No" name="gas_detector_id" value={(data.gas_detector_id as string) || ''} onChange={(e) => update('gas_detector_id', e.target.value)} register={() => ({})} placeholder="Masukkan ID Register" />
      </Section>

      {/* SECTION D */}
      <Section title="SECTION D: Instruksi Tambahan">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Instruksi Tambahan dan Catatan Penting</label>
          <textarea className="hse-input min-h-[60px] text-sm" value={(data.instruksi_tambahan as string) || ''} onChange={(e) => update('instruksi_tambahan', e.target.value)} placeholder="Instruksi tambahan dari pemberi izin..." />
        </div>
        <Checkbox checked={(data.mitigasi_bahaya as boolean) || false} onChange={(checked) => update('mitigasi_bahaya', checked)} label="Apabila Diminta Harap Dilengkapi Lembar Mitigasi Bahaya" size="md" />
      </Section>

      {/* SECTION E - Approval Table */}
      <Section title="SECTION E: Persetujuan Izin Kerja">
        <PermitApprovalTable
          data={data}
          update={update}
          rows={[
            {
              label: 'A. Pemohon Izin (Foreman/Spv)',
              statement: 'Saya bertanggung jawab atas keselamatan pekerjaan yang akan dilakukan',
              tanggalField: 'persetujuan_a_tanggal',
              namaField: 'persetujuan_a_nama',
              jabatanField: 'persetujuan_a_jabatan',
              parafField: 'persetujuan_a_paraf',
              bgClass: 'bg-blue-50 dark:bg-blue-900/20',
              disableName: false,
            },
            {
              label: 'B. Pemilik Lokasi (Spv/SPI)',
              statement: 'Saya telah memeriksa lokasi dan pekerjaan dapat dilaksanakan dengan aman',
              tanggalField: 'persetujuan_b_tanggal',
              namaField: 'persetujuan_b_nama',
              jabatanField: 'persetujuan_b_jabatan',
              parafField: 'persetujuan_b_paraf',
              bgClass: 'bg-green-50 dark:bg-green-900/20',
            },
            {
              label: 'C. Pemberi Izin',
              statement: 'Izin kerja ini sah untuk dilaksanakan setelah seluruh persyaratan terpenuhi',
              tanggalField: 'persetujuan_c_admin_tanggal',
              namaField: 'persetujuan_c_admin_nama',
              jabatanField: 'persetujuan_c_admin_jabatan',
              parafField: 'persetujuan_c_admin_paraf',
              bgClass: 'bg-orange-50 dark:bg-orange-900/20',
            },
          ]}
          mengetahuiRows={[
            { subLabel: 'HSSE Foreman/Spv', tanggalField: 'persetujuan_d_hsse_tanggal', namaField: 'persetujuan_d_hsse_nama', jabatanField: 'persetujuan_d_hsse_jabatan', parafField: 'persetujuan_d_hsse_paraf' },
            { subLabel: 'Asisten HSSE (SPI)', tanggalField: 'persetujuan_d_asisten_tanggal', namaField: 'persetujuan_d_asisten_nama', jabatanField: 'persetujuan_d_asisten_jabatan', parafField: 'persetujuan_d_asisten_paraf' },
            { subLabel: 'Kasubag Sistem & IT', tanggalField: 'persetujuan_d_kasubag_tanggal', namaField: 'persetujuan_d_kasubag_nama', jabatanField: 'persetujuan_d_kasubag_jabatan', parafField: 'persetujuan_d_kasubag_paraf' },
          ]}
        />
      </Section>

      {/* SECTION F - Gas Testing */}
      <Section title="SECTION F: Gas Testing">
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2 italic">Diisi Oleh Authorized Gas Tester dan Fire Watcher</p>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Atmospheric Testing</p>
          <RadioGroup name="atmospheric_testing" options={[{ value: 'terus_menerus', label: 'Terus Menerus' }, { value: 'periodik', label: 'Secara Periodik setiap ___jam' }]} value={(data.atmospheric_testing as string) || ''} onChange={(v) => update('atmospheric_testing', v)} />
        </div>
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-xs border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">Gas Tester</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">%LEL</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">Lainnya (Spesifik)</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">Tanggal</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">Waktu</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300">Diverifikasi Oleh (Fire Watcher)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 px-2 py-1"><input className="hse-input text-xs px-2 py-1" value={(data.gas_tester as string) || ''} onChange={(e) => update('gas_tester', e.target.value)} placeholder="Nama" /></td>
                <td className="border border-gray-300 dark:border-gray-600 px-2 py-1"><input className="hse-input text-xs px-2 py-1" value={(data.hasil_gas_lel as string) || ''} onChange={(e) => update('hasil_gas_lel', e.target.value)} /></td>
                <td className="border border-gray-300 dark:border-gray-600 px-2 py-1"><input className="hse-input text-xs px-2 py-1" value={(data.gas_lainnya as string) || ''} onChange={(e) => update('gas_lainnya', e.target.value)} /></td>
                <td className="border border-gray-300 dark:border-gray-600 px-2 py-1"><input type="date" className="hse-input text-xs px-2 py-1" value={(data.gas_tanggal as string) || ''} onChange={(e) => update('gas_tanggal', e.target.value)} /></td>
                <td className="border border-gray-300 dark:border-gray-600 px-2 py-1"><input type="time" className="hse-input text-xs px-2 py-1" value={(data.gas_waktu as string) || ''} onChange={(e) => update('gas_waktu', e.target.value)} /></td>
                <td className="border border-gray-300 dark:border-gray-600 px-2 py-1"><input className="hse-input text-xs px-2 py-1" value={(data.fire_watcher_nama as string) || ''} onChange={(e) => update('fire_watcher_nama', e.target.value)} placeholder="Nama Fire Watcher" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 italic mt-1">Apabila dipersyaratkan lakukan pengecekan gas kontinyu, lampirkan monitoring check dilembar terpisah</p>
      </Section>

      {/* SECTION G - Perpanjangan Izin */}
      <Section title="SECTION G: Perpanjangan Izin">
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2 italic">Diisi Oleh Pemohon Izin dan Pihak Lain yang Berwenang</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Waktu Perpanjangan Mulai dari" name="perpanjangan_mulai" type="datetime-local" value={(data.perpanjangan_mulai as string) || ''} onChange={(e) => update('perpanjangan_mulai', e.target.value)} register={() => ({})} />
          <Input label="Sampai" name="perpanjangan_sampai" type="datetime-local" value={(data.perpanjangan_sampai as string) || ''} onChange={(e) => update('perpanjangan_sampai', e.target.value)} register={() => ({})} />
        </div>
        <Input label="Penanggung Jawab (RP)" name="perpanjangan_rp" value={(data.perpanjangan_rp as string) || ''} onChange={(e) => update('perpanjangan_rp', e.target.value)} register={() => ({})} placeholder="Nama" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 dark:text-gray-400">HSE Foreman/Spv</label>
            <div className="grid grid-cols-2 gap-2">
              <input className="hse-input text-xs" value={(data.perpanjangan_hse_foreman_nama as string) || ''} onChange={(e) => update('perpanjangan_hse_foreman_nama', e.target.value)} placeholder="Nama" />
              <input className="hse-input text-xs" value={(data.perpanjangan_hse_foreman_sign as string) || ''} onChange={(e) => update('perpanjangan_hse_foreman_sign', e.target.value)} placeholder="Sign" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 dark:text-gray-400">HSSE SPI</label>
            <div className="grid grid-cols-2 gap-2">
              <input className="hse-input text-xs" value={(data.perpanjangan_hse_spi_nama as string) || ''} onChange={(e) => update('perpanjangan_hse_spi_nama', e.target.value)} placeholder="Nama" />
              <input className="hse-input text-xs" value={(data.perpanjangan_hse_spi_sign as string) || ''} onChange={(e) => update('perpanjangan_hse_spi_sign', e.target.value)} placeholder="Sign" />
            </div>
          </div>
        </div>
      </Section>

      <DynamicFields
        permitType="hwp"
        data={data}
        onChange={onChange}
        hardcodedFields={[
          'departemen','tanggal','no_permit_hwp','shift',
          'tanggal_permohonan','pekerjaan_dilaksanakan','jam_mulai','jam_selesai',
          'pemohon_izin_oleh','nama_perusahaan','penanggung_jawab','position',
          'jumlah_pekerja','lokasi','equipment_tools','total_unit','daftar_alat_lulus_inspeksi',
          'bahaya_checklist','bahaya_lainnya','bersinggungan_izin','nomor_izin_lain',
          'ppe_checklist','peralatan_lain_checklist','persyaratan_lain_checklist','gas_detector_id',
          'instruksi_tambahan','mitigasi_bahaya',
          'persetujuan_a_tanggal','persetujuan_a_nama','persetujuan_a_paraf',
          'persetujuan_b_tanggal','persetujuan_b_nama','persetujuan_b_paraf',
          'persetujuan_c_admin_tanggal','persetujuan_c_admin_nama',
          'persetujuan_c_asisten_tanggal','persetujuan_c_asisten_nama',
          'persetujuan_d_kasubag_tanggal','persetujuan_d_kasubag_nama',
          'persetujuan_d_manager_tanggal','persetujuan_d_manager_nama',
          'atmospheric_testing','gas_tester','hasil_gas_lel','gas_lainnya','gas_tanggal','gas_waktu',
          'fire_watcher_nama',
          'perpanjangan_mulai','perpanjangan_sampai','perpanjangan_rp',
          'perpanjangan_hse_foreman_nama','perpanjangan_hse_foreman_sign',
          'perpanjangan_hse_spi_nama','perpanjangan_hse_spi_sign',
        ]}
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 sm:p-4 space-y-3 border border-gray-200 dark:border-gray-700">
      <h4 className="font-bold text-gray-800 dark:text-white text-xs sm:text-sm border-b-2 border-gray-200 dark:border-gray-700 pb-2 uppercase tracking-wide">{title}</h4>
      {children}
    </div>
  );
}
