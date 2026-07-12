const fs = require('fs');
const path = require('path');

const dir = 'src/components/permit';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Form.tsx'));

files.forEach(f => {
  const fp = path.join(dir, f);
  let content = fs.readFileSync(fp, 'utf8');
  let original = content;

  // Fix onChange={(e) = disabled className="disabled:opacity-50 disabled:cursor-not-allowed " > update
  content = content.replace(/onChange=\{\(e\)\s*=\s*disabled[^>]*>\s*/g, 'disabled className="disabled:opacity-50 disabled:cursor-not-allowed" onChange={(e) => ');
  
  if (content !== original) {
    fs.writeFileSync(fp, content);
    console.log(`Fixed ${f}`);
  }
});
