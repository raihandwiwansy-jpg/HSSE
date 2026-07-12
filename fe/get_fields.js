const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/components/permit/*Form.tsx');
files.forEach(file => {
  if (file === 'src/components/permit/PermitForm.tsx' || file === 'src/components/permit/PermitCompletionForm.tsx' || file === 'src/components/permit/JsaForm.tsx') return;
  const content = fs.readFileSync(file, 'utf8');
  const matches = [...content.matchAll(/name="([^"]+)"/g)].map(m => m[1]);
  const pengesahanFields = matches.filter(m => m.includes('pemilik') || m.includes('pemberi') || m.includes('mengetahui') || m.includes('pemohon') || m.includes('admin') || m.includes('supervisor') || m.includes('kasubag') || m.includes('manager') || m.includes('hse') || m.includes('asisten') || m.includes('supt') || m.includes('cm') || m.includes('cp') || m.includes('op1') || m.includes('op2') || m.includes('qc') || m.includes('eksekutor') || m.includes('issuing') || m.includes('pengesahan') || m.includes('otorisasi'));
  console.log('--- ' + file + ' ---');
  console.log(pengesahanFields.filter(f => f.includes('nama') || f.includes('op1') || f.includes('op2') || f.includes('cp') || f.includes('cm') || f.includes('supt') || f.includes('manager') || f.includes('hse') || f.includes('asisten') || f.includes('sit') || f.includes('admin') || f.includes('supervisor') || f.includes('qc') || f.includes('issuing') || f.includes('eksekutor')));
});
