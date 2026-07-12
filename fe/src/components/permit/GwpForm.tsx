'use client';

import { useEffect } from 'react';
import { getNextSequence } from '@/lib/api/permit';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import RadioGroup from '@/components/ui/RadioGroup';
import MasterSelect from '@/components/ui/MasterSelect';
import DynamicFields from './DynamicFields';
import PermitApprovalTable from './PermitApprovalTable';

interface GwpFormProps {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

const CHECKLIST_PEMOHON = [
  'Peralatan telah dipisahkan/di kosongkan/dibersihkan dari bekas bahan mudah terbakar/gas',
  'Peralatan telah dipasang label/memutus aliran listrik/mengunci dengan LOTO',
  'Penutup main hole dan saluran pembuangan telah tertutup',
  'Petugas operasi telah menggunakan/melengkapi APD yang diperlukan',
  'Perlakuan lain yang dilakukan, sebutkan',
];

const CHECKLIST_HSE = [
  'Daerah kerja telah diperiksa dari kebocoran atau bahaya lain dan telah dipasang tanda-tanda yang benar termasuk arah angin',
  'Semua tindakan pencegahan untuk bahaya listrik, steam, hidrolik dll telah diperiksa dan diberi label',
  'Persyaratan penerangan daerah kerja telah memenuhi standar/layak',
  'Memastikan tidak ada sumber api dekat bahan mudah terbakar',
  'Memastikan tidak ada pelepasan bahan mudah terbakar dari pekerjaan lain di sekitar area kerja',
  'Perlakuan lain yang dilakukan, sebutkan',
];

const PPE_OPTIONS = [
  { name: 'Helmet', icon: '🪖' },
  { name: 'Safety shoes', icon: '👢' },
  { name: 'Seragam kerja', icon: '👔' },
  { name: 'Masker', icon: '😷' },
  { name: 'Safety Harness', icon: '🦺' },
  { name: 'Goggle', icon: '🥽' },
  { name: 'Sarung tangan', icon: '🧤' },
  { name: 'Safety Boots', icon: '🥾' },
  { name: 'Ear plug', icon: '🔇' },
  { name: 'Ear Muff', icon: '🎧' },
];

export default function GwpForm({ data, onChange }: GwpFormProps) {
  const update = (key: string, value: unknown) => onChange({ ...data, [key]: value });
  const fc = { isLocked: () => false, isRequired: () => false, getSourceMaster: () => null };
  const pemohon = (data.checklist_pemohon as string[]) || [];
  const hse = (data.checklist_hse as string[]) || [];
  const ppe = (data.ppe_checklist as string[]) || [];

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getNextSequence('permit_number', 'gwp');
        const num = res?.data?.data?.next;
        if (num && !data.nomor_gwp) {
          onChange({...data, nomor_gwp: num});
        }
      } catch {}
    };
    fetch();
  }, []);

  const toggle = (item: string, list: string[], key: string) => {
    const next = list.includes(item) ? list.filter(i => i !== item) : [...list, item];
    update(key, next);
  };

  return (
    <div className="space-y-4">
      {/* Company Header */}
      {/* Company Header */}
      <div className="flex items-center justify-center gap-3 border-b-2 border-gray-300 dark:border-gray-600 pb-3 mb-4">
        <img src="/Picture1.png" alt="Logo INL" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
        <div className="text-left">
          <h2 className="text-sm sm:text-base font-bold text-gray-800 dark:text-white leading-tight">PT. INDUSTRI NABATI LESTARI</h2>
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-tight mt-0.5">KEK Sei Mangkei, Kab. Simalungun, Sumatera Utara</p>
        </div>
      </div>

      {/* Section A */}
      <Section title="SECTION A: Identitas Permintaan Izin Kerja">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Tanggal *" name="tanggal" type="date" value={(data.tanggal as string) || ''} onChange={(e) => update('tanggal', e.target.value)} register={() => ({})} />
          <div className="grid grid-cols-2 gap-2">
            <Input label="Pukul Mulai *" name="pukul_mulai" type="time" value={(data.pukul_mulai as string) || ''} onChange={(e) => update('pukul_mulai', e.target.value)} register={() => ({})} />
            <Input label="Pukul Selesai *" name="pukul_selesai" type="time" value={(data.pukul_selesai as string) || ''} onChange={(e) => update('pukul_selesai', e.target.value)} register={() => ({})} />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Dept/Bagian/CV *</label>
          <MasterSelect masterType="departemen" value={(data.departemen as string) || ''} onChange={(v) => update('departemen', v)} placeholder="Pilih departemen..." />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Lokasi Area Kerja *</label>
          <MasterSelect masterType="lokasi" value={(data.lokasi as string) || ''} onChange={(v) => update('lokasi', v)} placeholder="Pilih lokasi..." />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">GWP :</span>
          <input readOnly className="flex-1 text-xs border-b border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:border-blue-500 py-1" value={(data.nomor_gwp as string) || ''} onChange={(e) => update('nomor_gwp', e.target.value)} placeholder="Nomor GWP" />
        </div>
      </Section>

      {/* Section B */}
      <Section title="SECTION B: Identitas Pekerjaan">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Deskripsi jenis pekerjaan *</label>
            <textarea className="hse-input min-h-[70px] text-sm" value={(data.deskripsi_pekerjaan as string) || ''} onChange={(e) => update('deskripsi_pekerjaan', e.target.value)} placeholder="Jelaskan jenis pekerjaan yang akan dilakukan..." />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Peralatan yang akan dipergunakan *</label>
            <textarea className="hse-input min-h-[60px] text-sm" value={(data.peralatan as string) || ''} onChange={(e) => update('peralatan', e.target.value)} placeholder="Sebutkan peralatan yang digunakan..." />
          </div>
        </div>
      </Section>

      {/* Section C */}
      <Section title="SECTION C: Kategori Resiko Pekerjaan">
        <div className="space-y-3">
          <p className="text-[11px] text-gray-500 dark:text-gray-400">Berdasarkan Job Safety Analysis (JSA)</p>
          <Checkbox
            checked={(data.jsa_dilakukan as boolean) || false}
            onChange={(checked) => update('jsa_dilakukan', checked)}
            label="JSA dilakukan sebelum izin kerja dikeluarkan"
            size="md"
          />
          <div className="space-y-1.5">
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Penilaian tingkat resiko oleh pemohon izin, diverifikasi oleh HSSE</p>
            <RadioGroup
              name="kategori_risiko"
              options={[
                { value: 'rendah', label: 'Rendah' },
                { value: 'sedang', label: 'Sedang' },
                { value: 'tinggi', label: 'Tinggi' },
              ]}
              value={(data.kategori_risiko as string) || ''}
              onChange={(v) => update('kategori_risiko', v)}
            />
          </div>
        </div>
      </Section>

      {/* Section D - Daftar Keselamatan (Two-Column Table Layout) */}
      <Section title="SECTION D: Daftar Keselamatan">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 w-1/2">
                  Daftar Check Untuk Pemohon Izin
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 w-[60px]">
                  Ö
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 w-1/2">
                  Daftar Check Untuk HSSE
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 w-[60px]">
                  Ö
                </th>
              </tr>
            </thead>
            <tbody>
              {CHECKLIST_PEMOHON.map((item, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'}>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-700 dark:text-gray-300">{item}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={pemohon.includes(item)}
                      onChange={() => toggle(item, pemohon, 'checklist_pemohon')}
                      className="rounded text-blue-500 w-4 h-4"
                    />
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-700 dark:text-gray-300">
                    {CHECKLIST_HSE[i] || ''}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-center">
                    {CHECKLIST_HSE[i] ? (
                      <input
                        type="checkbox"
                        checked={hse.includes(CHECKLIST_HSE[i])}
                        onChange={() => toggle(CHECKLIST_HSE[i], hse, 'checklist_hse')}
                        className="rounded text-blue-500 w-4 h-4"
                      />
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Section E - Peralatan Keamanan (PPE Grid) */}
      <Section title="SECTION E: Peralatan Keamanan (APD)">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Peralatan Keamanan</th>
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 w-[60px]">Ö</th>
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Peralatan Keamanan</th>
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 w-[60px]">Ö</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.ceil(PPE_OPTIONS.length / 2) }, (_, i) => {
                const left = PPE_OPTIONS[i * 2];
                const right = PPE_OPTIONS[i * 2 + 1];
                return (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'}>
                    <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-700 dark:text-gray-300">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={ppe.includes(left.name)} onChange={() => toggle(left.name, ppe, 'ppe_checklist')} className="rounded text-blue-500 w-4 h-4" />
                        {left.name}
                      </label>
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-center">
                      <input type="checkbox" checked={ppe.includes(left.name)} onChange={() => toggle(left.name, ppe, 'ppe_checklist')} className="rounded text-blue-500 w-4 h-4" />
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-700 dark:text-gray-300">
                      {right ? (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={ppe.includes(right.name)} onChange={() => toggle(right.name, ppe, 'ppe_checklist')} className="rounded text-blue-500 w-4 h-4" />
                          {right.name}
                        </label>
                      ) : ''}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-center">
                      {right ? (
                        <input type="checkbox" checked={ppe.includes(right.name)} onChange={() => toggle(right.name, ppe, 'ppe_checklist')} className="rounded text-blue-500 w-4 h-4" />
                      ) : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Section F - Persetujuan Izin (4-Role Approval Table) */}
      <Section title="SECTION F: Persetujuan Izin">
        <PermitApprovalTable
          data={data}
          update={update}
          rows={[
            {
              label: 'A. Pemohon Izin',
              statement: 'Bahwa saya akan melakukan pekerjaan yang telah diinstruksikan dan bekerja sesuai dengan prosedur',
              tanggalField: 'persetujuan_pemohon_tanggal',
              namaField: 'persetujuan_pemohon_nama',
              jabatanField: 'persetujuan_pemohon_jabatan',
              parafField: 'persetujuan_pemohon_paraf',
              bgClass: 'bg-blue-50 dark:bg-blue-900/20',
              disableName: false,
            },
            {
              label: 'B. Pemilik Lokasi',
              statement: 'Saya telah melakukan pemeriksaan terhadap lokasi ini dan pekerjaan ini dapat dilakukan',
              tanggalField: 'persetujuan_pemilik_lokasi_tanggal',
              namaField: 'persetujuan_pemilik_lokasi_nama',
              jabatanField: 'persetujuan_pemilik_lokasi_jabatan',
              parafField: 'persetujuan_pemilik_lokasi_paraf',
              bgClass: 'bg-green-50 dark:bg-green-900/20',
            },
            {
              label: 'C. Pemberi Izin',
              statement: 'Saya telah memastikan pekerjaan ini dapat dilakukan dengan aman',
              tanggalField: 'persetujuan_pemberi_izin_tanggal',
              namaField: 'persetujuan_pemberi_izin_nama',
              jabatanField: 'persetujuan_pemberi_izin_jabatan',
              parafField: 'persetujuan_pemberi_izin_paraf',
              bgClass: 'bg-orange-50 dark:bg-orange-900/20',
            },
          ]}
          mengetahuiRows={[
            { subLabel: 'HSSE Admin/Inspektor', tanggalField: 'mengetahui_hse_tanggal', namaField: 'mengetahui_hse_nama', jabatanField: 'mengetahui_hse_jabatan', parafField: 'mengetahui_hse_paraf' },
            { subLabel: 'Asisten HSSE', tanggalField: 'mengetahui_asisten_hsse_tanggal', namaField: 'mengetahui_asisten_hse_nama', jabatanField: 'mengetahui_asisten_hse_jabatan', parafField: 'mengetahui_asisten_hse_paraf' },
            { subLabel: 'Kasubag Sistem & IT', tanggalField: 'mengetahui_kasubag_sit_tanggal', namaField: 'mengetahui_kasubag_sit_nama', jabatanField: 'mengetahui_kasubag_sit_jabatan', parafField: 'mengetahui_kasubag_sit_paraf' },
          ]}
        />
      </Section>

      {/* Dynamic Fields from Master Config */}
      <DynamicFields
        permitType="gwp"
        data={data}
        onChange={onChange}
        hardcodedFields={[
          'tanggal','pukul_mulai','pukul_selesai','departemen','lokasi','nomor_gwp',
          'deskripsi_pekerjaan','peralatan','jsa_dilakukan','kategori_risiko',
          'checklist_pemohon','checklist_hse','ppe_checklist',
          'persetujuan_pemohon_tanggal','persetujuan_pemohon_nama','persetujuan_pemohon_jabatan','persetujuan_pemohon_paraf',
          'persetujuan_pemilik_lokasi_tanggal','persetujuan_pemilik_lokasi_nama','persetujuan_pemilik_lokasi_jabatan','persetujuan_pemilik_lokasi_paraf',
          'persetujuan_pemberi_izin_tanggal','persetujuan_pemberi_izin_nama','persetujuan_pemberi_izin_jabatan','persetujuan_pemberi_izin_paraf',
          'mengetahui_hse_tanggal','mengetahui_hse_nama','mengetahui_hse_jabatan','mengetahui_hse_paraf',
          'mengetahui_asisten_hsse_tanggal','mengetahui_asisten_hse_nama','mengetahui_asisten_hse_jabatan','mengetahui_asisten_hse_paraf',
          'mengetahui_kasubag_sit_tanggal','mengetahui_kasubag_sit_nama','mengetahui_kasubag_sit_jabatan','mengetahui_kasubag_sit_paraf',
          'validasi_shift_1','validasi_shift_2','validasi_shift_3',
          'validasi_pemohon_1','validasi_pemohon_2','validasi_pemohon_3',
          'validasi_pemilik_lokasi_1','validasi_pemilik_lokasi_2','validasi_pemilik_lokasi_3',
          'validasi_pemberi_izin_1','validasi_pemberi_izin_2','validasi_pemberi_izin_3',
          'validasi_tanggal_1','validasi_tanggal_2','validasi_tanggal_3',
          'validasi_pukul_1','validasi_pukul_2','validasi_pukul_3',
          'validasi_paraf_1','validasi_paraf_2','validasi_paraf_3',
        ]}
      />

      {/* Section G - Validasi Ulang (Shift Table) */}
      <Section title="SECTION G: Validasi Ulang">
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2 italic">Penilaian pada awal shift kerja berikutnya - Izin kerja Umum hanya berlaku 1 hari (3 shift)</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300" rowSpan={2}>No</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-center font-semibold text-gray-700 dark:text-gray-300" colSpan={3}>Shift</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300" rowSpan={2}>Pemohon</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300" rowSpan={2}>Pemilik Lokasi</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300" rowSpan={2}>Pemberi Izin</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300" rowSpan={2}>Tanggal</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300" rowSpan={2}>Pukul</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-left font-semibold text-gray-700 dark:text-gray-300" rowSpan={2}>Paraf</th>
              </tr>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-medium text-gray-600 dark:text-gray-400">1</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-medium text-gray-600 dark:text-gray-400">2</th>
                <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-medium text-gray-600 dark:text-gray-400">3</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((row) => (
                <tr key={row}>
                  <td className="border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-center font-medium">{row}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-1 py-1 text-center">
                    <input type="radio" name={`validasi_shift_${row}`} checked={data[`validasi_shift_${row}`] === '1'} onChange={() => update(`validasi_shift_${row}`, '1')} className="w-4 h-4 text-blue-500 cursor-pointer" />
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-1 py-1 text-center">
                    <input type="radio" name={`validasi_shift_${row}`} checked={data[`validasi_shift_${row}`] === '2'} onChange={() => update(`validasi_shift_${row}`, '2')} className="w-4 h-4 text-blue-500 cursor-pointer" />
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-1 py-1 text-center">
                    <input type="radio" name={`validasi_shift_${row}`} checked={data[`validasi_shift_${row}`] === '3'} onChange={() => update(`validasi_shift_${row}`, '3')} className="w-4 h-4 text-blue-500 cursor-pointer" />
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-1 py-1"><input className="hse-input text-[11px] px-1.5 py-0.5" value={((data[`validasi_pemohon_${row}`] as string) || '')} onChange={(e) => update(`validasi_pemohon_${row}`, e.target.value)} placeholder="Nama" /></td>
                  <td className="border border-gray-300 dark:border-gray-600 px-1 py-1"><input className="hse-input text-[11px] px-1.5 py-0.5" value={((data[`validasi_pemilik_lokasi_${row}`] as string) || '')} onChange={(e) => update(`validasi_pemilik_lokasi_${row}`, e.target.value)} placeholder="Nama" /></td>
                  <td className="border border-gray-300 dark:border-gray-600 px-1 py-1"><input className="hse-input text-[11px] px-1.5 py-0.5" value={((data[`validasi_pemberi_izin_${row}`] as string) || '')} onChange={(e) => update(`validasi_pemberi_izin_${row}`, e.target.value)} placeholder="Nama" /></td>
                  <td className="border border-gray-300 dark:border-gray-600 px-1 py-1"><input type="date" className="hse-input text-[11px] px-1.5 py-0.5" value={((data[`validasi_tanggal_${row}`] as string) || '')} onChange={(e) => update(`validasi_tanggal_${row}`, e.target.value)} /></td>
                  <td className="border border-gray-300 dark:border-gray-600 px-1 py-1"><input type="time" className="hse-input text-[11px] px-1.5 py-0.5" value={((data[`validasi_pukul_${row}`] as string) || '')} onChange={(e) => update(`validasi_pukul_${row}`, e.target.value)} /></td>
                  <td className="border border-gray-300 dark:border-gray-600 px-1 py-1"><input readOnly className="hse-input text-[11px] px-1.5 py-0.5 opacity-60" placeholder="Paraf" value={((data[`validasi_paraf_${row}`] as string) || '')} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
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

function ApprovalRow({
  label, statement, tanggalField, namaField, jabatanField, parafField, data, update, bgClass, disableName = true,
}: {
  label: string; statement: string; tanggalField: string; namaField: string; jabatanField: string; parafField: string;
  data: Record<string, unknown>; update: (key: string, value: unknown) => void; bgClass: string; disableName?: boolean;
}) {
  return (
    <tr>
      <td className={`border border-gray-300 dark:border-gray-600 px-3 py-2 font-semibold text-gray-700 dark:text-gray-300 ${bgClass}`}>{label}</td>
      <td className={`border border-gray-300 dark:border-gray-600 px-3 py-2 text-[11px] text-gray-600 dark:text-gray-400 italic ${bgClass}`}>{statement}</td>
      <td className="border border-gray-300 dark:border-gray-600 px-2 py-1"><input type="date" className="hse-input text-xs px-2 py-1" value={(data[tanggalField] as string) || ''} onChange={(e) => update(tanggalField, e.target.value)} /></td>
      <td className="border border-gray-300 dark:border-gray-600 px-2 py-1"><input type="text" className={`hse-input text-xs px-2 py-1 ${disableName ? 'opacity-70 cursor-not-allowed' : ''}`} value={(data[namaField] as string) || ''} onChange={(e) => update(namaField, e.target.value)} disabled={disableName} placeholder="Nama" /></td>
      <td className="border border-gray-300 dark:border-gray-600 px-2 py-1"><input type="text" className="hse-input text-xs px-2 py-1" value={(data[jabatanField] as string) || ''} onChange={(e) => update(jabatanField, e.target.value)} placeholder="Jabatan" /></td>
      <td className="border border-gray-300 dark:border-gray-600 px-2 py-1"><input readOnly className="hse-input text-xs px-2 py-1 opacity-60" value={(data[parafField] as string) || ''} placeholder="Paraf" /></td>
    </tr>
  );
}
