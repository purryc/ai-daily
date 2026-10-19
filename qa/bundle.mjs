import fs from 'node:fs/promises';
import path from 'node:path';
import {filesUnder,digest} from './check.mjs';
const limit=24*1024*1024;
const [mode,dir]=process.argv.slice(2);
if(mode!=='emit'||!dir)throw new Error('Expected emit and isolated output directory');
const approved=JSON.parse(await fs.readFile(new URL('./public-files.json',import.meta.url),'utf8')).map(f=>'candidate/'+f.path);
approved.push('candidate/2026-10-19/assets/deepseek-api-docs.png','report.json');
for(const language of ['zh','en'])for(let i=1;i<=28;i++)approved.push(`screenshots/${language}-${String(i).padStart(2,'0')}.jpg`);
for(const name of ['search-request','search-response','fetch-request','fetch-response'])approved.push(`screenshots/deepseek-${name}.png`);
const names=await filesUnder(dir);let total=0;const entries=[];
for(const name of names){
 if(!approved.includes(name))throw new Error('Unexpected output file; nothing exported');
 const locale=process.env.QA_EVIDENCE_LOCALE;
 if(!['zh','en'].includes(locale))throw new Error('A bounded evidence locale is required');
 if(/^screenshots\/(zh|en)-/.test(name)&&!name.startsWith('screenshots/'+locale+'-'))continue;
 if(locale==='en'&&(name.startsWith('candidate/')||name.startsWith('screenshots/deepseek-')))continue;
 const bytes=await fs.readFile(path.join(dir,name));
 if(name.startsWith('candidate/')) {
  const originals=JSON.parse(await fs.readFile(new URL('./public-files.json',import.meta.url),'utf8'));
  const original=originals.find(f=>'candidate/'+f.path===name);
  if(original?.sha256===digest(bytes))continue; // Exact checkout bytes need no second transmission.
 }
 total+=bytes.length;
 if(total>limit)throw new Error('Public output exceeds bounded log allowance');
 entries.push({path:name,bytes:bytes.length,sha256:digest(bytes),body:bytes.toString('base64')});
}
console.log('DAILY_PUBLIC_BUNDLE_BEGIN '+JSON.stringify(entries.map(({body,...meta})=>meta)));
for(const entry of entries){const count=Math.ceil(entry.body.length/4096);for(let i=0;i<count;i++)console.log(`DAILY_PUBLIC_FILE ${entry.path} ${i}/${count} ${entry.body.slice(i*4096,(i+1)*4096)}`);}
console.log('DAILY_PUBLIC_BUNDLE_END');
