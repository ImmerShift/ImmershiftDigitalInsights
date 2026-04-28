const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('Overview.tsx'));

const buttonRegex = /<button[^>]*>\s*<Calendar[^>]*\/>\s*(?:Last 7 Days|April 1 - April 15, 2026)\s*<ChevronDown[^>]*\/>\s*<\/button>/g;

for (const file of files) {
  const filePath = path.join(srcDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.match(buttonRegex)) {
    console.log(`Fixing ${file}`);
    content = content.replace(buttonRegex, '');
    fs.writeFileSync(filePath, content, 'utf8');
  }
}
