import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'src');
const files = fs.readdirSync(dir).filter(f => f.endsWith('PlatformOverview.tsx'));

const buttonRegex1 = /<button className="flex items-center gap-2 px-3 py-2 bg-\[#F9F7F4\] border border-\[#EAE3D9\] rounded-lg text-sm font-medium text-\[#5C4541\] hover:bg-\[#FDF8F3\] transition-colors">/g;
const replacement1 = '<button disabled aria-disabled="true" title="Filter functionality coming soon" className="flex items-center gap-2 px-3 py-2 bg-[#F9F7F4] border border-[#EAE3D9] rounded-lg text-sm font-medium text-[#5C4541] opacity-50 cursor-not-allowed transition-colors">';

const buttonRegex2 = /<button className="flex items-center gap-2 px-4 py-2 bg-\[#7A2B20\] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-\[#6A241A\] transition-colors ml-auto md:ml-0">/g;
const replacement2 = '<button disabled aria-disabled="true" title="Export functionality coming soon" className="flex items-center gap-2 px-4 py-2 bg-[#7A2B20] text-white rounded-lg text-sm font-bold shadow-sm opacity-50 cursor-not-allowed transition-colors ml-auto md:ml-0">';

const thRegex1 = /<th className="bg-\[#FDF8F3\]/g;
const thReplacement1 = '<th scope="col" className="bg-[#FDF8F3]';

const thRegex2 = /<th className="px-6 py-4/g;
const thReplacement2 = '<th scope="col" className="px-6 py-4';

for (const f of files) {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(buttonRegex1, replacement1);
  content = content.replace(buttonRegex2, replacement2);
  content = content.replace(thRegex1, thReplacement1);
  content = content.replace(thRegex2, thReplacement2);
  fs.writeFileSync(filePath, content, 'utf-8');
}
console.log('Done replacing strings.');
