const fs = require('fs');
const path = require('path');

const dir = 'src/components/permit';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Form.tsx'));

files.forEach(f => {
  const fp = path.join(dir, f);
  let content = fs.readFileSync(fp, 'utf8');
  let original = content;

  // Fix onChange={e= disabled >u('...')} 
  // It should be disabled onChange={e=>u('...')}
  content = content.replace(/onChange=\{e=\s*disabled\s*>\s*u/g, 'disabled onChange={e=>u');

  // Any other variations? 
  // RwpForm.tsx might have different?
  // Let's do a more general match:
  // onChange={e= disabled >
  // should be: disabled onChange={e=>
  content = content.replace(/onChange=\{e=\s*disabled\s*>/g, 'disabled onChange={e=>');

  if (content !== original) {
    fs.writeFileSync(fp, content);
    console.log(`Fixed JSX in ${f}`);
  }
});
