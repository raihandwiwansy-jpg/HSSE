const fs = require('fs');
const path = require('path');

const dir = 'src/components/permit';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Form.tsx'));

const lockedFields = [
  'persetujuan_pemilik_lokasi_nama',
  'persetujuan_pemberi_izin_nama',
  'mengetahui_hse_nama',
  'mengetahui_asisten_hse_nama',
  'mengetahui_kasubag_nama',
  'pengesahan_nama_pemilik',
  'pengesahan_nama_pemberi',
  'verif_pemilik_nama',
  'verif_mengetahui_manager',
  'pemberi_admin_nama',
  'pemberi_asisten_nama',
  'verif_pemberi_hse_foreman',
  'verif_pemberi_hse_spi',
  'tt_pemberi_manager',
  'tt_pemberi_cm',
  'manager_approve',
  'diketahui_hse',
  'mengetahui_nama_hse',
  'mengetahui_nama_asisten',
  'mengetahui_nama_kasubag',
  'tt_pemohon_supervisor',
  'persetujuan_d_manager_nama',
  'persetujuan_b_nama',
  'persetujuan_c_admin_nama',
  'persetujuan_c_asisten_nama',
  'persetujuan_d_kasubag_nama',
  'mengetahui_kasubag_sit_nama'
];

files.forEach(f => {
  const fp = path.join(dir, f);
  let content = fs.readFileSync(fp, 'utf8');
  let original = content;

  // For <Input ... name="xyz" />
  lockedFields.forEach(field => {
    // Match <Input ... name="field" ... /> and insert disabled
    // We want to avoid adding disabled if it's already there
    const regex = new RegExp(`(<Input[^>]*?name="${field}"[^>]*?)(?!disabled)(/?>)`, 'g');
    content = content.replace(regex, (match, p1, p2) => {
      if (match.includes('disabled')) return match;
      return `${p1} disabled ${p2}`;
    });

    // Match raw <input ... value={(data.field as string) || ''} ... />
    const rawRegex = new RegExp(`(<input[^>]*?value={\\(data\\.${field}\\s*as\\s*string\\)[^>]*?)(?!disabled)(/?>)`, 'g');
    content = content.replace(rawRegex, (match, p1, p2) => {
      if (match.includes('disabled')) return match;
      return `${p1} disabled className="disabled:opacity-50 disabled:cursor-not-allowed " ${p2}`;
    });
  });

  if (content !== original) {
    fs.writeFileSync(fp, content);
    console.log(`Updated ${f}`);
  }
});
