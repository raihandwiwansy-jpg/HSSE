const fs = require('fs');
const path = require('path');

const dir = 'src/components/permit';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Form.tsx'));

files.forEach(f => {
  const fp = path.join(dir, f);
  let content = fs.readFileSync(fp, 'utf8');
  let original = content;

  // Add disabled prop where we put it in the className by mistake
  content = content.replace(/disabled:cursor-not-allowed disabled"/g, 'disabled:cursor-not-allowed" disabled ');
  content = content.replace(/disabled:cursor-not-allowed"/g, 'disabled:cursor-not-allowed" disabled ');

  // deduplicate disabled
  content = content.replace(/disabled disabled /g, 'disabled ');

  if (content !== original) {
    fs.writeFileSync(fp, content);
    console.log(`Fixed disabled in ${f}`);
  }
});
