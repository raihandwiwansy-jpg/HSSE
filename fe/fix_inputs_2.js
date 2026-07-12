const fs = require('fs');
const path = require('path');

const dir = 'src/components/permit';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Form.tsx'));

files.forEach(f => {
  const fp = path.join(dir, f);
  let content = fs.readFileSync(fp, 'utf8');
  let original = content;

  // Fix duplicate className:
  // <input className="w-full text-xs bg-transparent border-0 p-0.5 focus:ring-0" value={(data.mengetahui_hse_nama as string) || ''} disabled className="disabled:opacity-50 disabled:cursor-not-allowed" onChange={(e) => update('mengetahui_hse_nama', e.target.value)} placeholder="Nama" />
  
  content = content.replace(/(className="[^"]*)"([^>]*?)disabled className="([^"]*)"/g, '$1 $3 disabled"$2');

  if (content !== original) {
    fs.writeFileSync(fp, content);
    console.log(`Fixed duplicate className in ${f}`);
  }
});
