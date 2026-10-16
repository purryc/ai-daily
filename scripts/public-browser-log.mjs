import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {PUBLIC_PRODUCT_URL,safeProbeError} from './public-browser-check.mjs';
import {realDestination} from './lib/cloud-state.mjs';

const MAX_RAW=2*1024*1024,MAX_LOG=3*1024*1024,CHUNK=4096;
const BEGIN='PUBLIC_BROWSER_BUNDLE_V1_BEGIN ',END='PUBLIC_BROWSER_BUNDLE_V1_END';
const NAMES=['index.html','product.png','receipt.json'];
const REPO=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const hash=b=>createHash('sha256').update(b).digest('hex');
const keys=new Set(['schemaVersion','kind','publication','sourceUrl','sourcePublishedAt','sourceDateNote','requestedAt','captureStatus','visualReviewStatus','viewport','captureRange','github','preventedExternalRequestCount','refusedStatuses','files','browser','httpStatus','finalUrl','title','visibleInteractiveElements','capturedAt','localHtmlCheck','error','completedAt']);

function validateReceipt(r,allowFixture) {
  if(Object.keys(r).some(k=>!keys.has(k)))throw new Error('Unexpected receipt field; no data emitted');
  const fixture=r.kind==='engineering-fixture-only';
  if(fixture&&!allowFixture)throw new Error('Engineering fixture cannot be emitted as a real public probe');
  if(!fixture&&(r.kind!=='public-product-browser-probe'||r.sourceUrl!==PUBLIC_PRODUCT_URL))throw new Error('Unexpected public source');
  if(fixture&&!/^http:\/\/127\.0\.0\.1:\d+\/$/.test(r.sourceUrl))throw new Error('Unexpected fixture source');
  if(r.schemaVersion!==1||r.publication!==false||r.visualReviewStatus!=='pending-pixel-review'||!['captured-and-browser-validated','failed'].includes(r.captureStatus))throw new Error('Invalid probe receipt status');
  if(r.error&&r.error!==safeProbeError(new Error(r.error)))throw new Error('Unsafe error details; no data emitted');
  if(r.github&&Object.keys(r.github).some(k=>!['repository','commit','runId','runAttempt'].includes(k)))throw new Error('Unexpected receipt field');
  if(r.github?.repository!=null&&r.github.repository!=='purryc/ai-daily')throw new Error('Unexpected repository');
  if(r.github?.commit!=null&&!/^[a-f0-9]{40}$/.test(r.github.commit))throw new Error('Invalid public commit');
  for(const k of ['runId','runAttempt'])if(r.github?.[k]!=null&&!/^\d+$/.test(r.github[k]))throw new Error('Invalid public run identifier');
  return fixture;
}

function validateFiles(files,allowFixture) {
  const r=JSON.parse(files.get('receipt.json').toString('utf8'));
  validateReceipt(r,allowFixture);
  const expected=r.captureStatus==='failed'?['receipt.json']:NAMES;
  if([...files.keys()].sort().join()!==[...expected].sort().join())throw new Error('Unexpected file set');
  if(r.captureStatus!=='failed') {
    const png=files.get('product.png');
    if(png.length<24||png.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'||png.readUInt32BE(16)!==1440||png.readUInt32BE(20)!==1080)throw new Error('Invalid PNG bytes');
    for(const name of ['product.png','index.html']) {
      const b=files.get(name),record=r.files?.[name];
      if(record?.bytes!==b.length||record?.sha256!==hash(b))throw new Error('Capture receipt file hash/bytes mismatch');
    }
  }
  return r;
}

// All inputs are validated before returning any printable bytes. No arbitrary paths,
// extra files, archives, environment dumps or private receipt extensions are emitted.
export async function createPublicProbeLog({input,allowFixture=false}) {
  const dir=realDestination(input),names=(await fs.readdir(dir)).sort();
  if(names.some(n=>!NAMES.includes(n)))throw new Error('Unexpected file in public probe output');
  let total=0;const files=new Map();
  for(const name of names) {
    const file=path.join(dir,name),stat=await fs.lstat(file);
    if(!stat.isFile()||stat.isSymbolicLink())throw new Error('Public probe inputs must be regular files');
    total+=stat.size;if(total>MAX_RAW)throw new Error('Public probe size limit exceeded');
    files.set(name,await fs.readFile(file));
  }
  if(!files.has('receipt.json'))throw new Error('Missing public receipt');
  const receipt=validateFiles(files,allowFixture);
  const manifest={version:1,kind:receipt.kind,files:[...files].map(([name,b])=>({name,bytes:b.length,sha256:hash(b),chunks:Math.ceil(b.toString('base64').length/CHUNK)}))};
  const lines=[BEGIN+JSON.stringify(manifest)];
  for(const [name,b] of files) {
    const encoded=b.toString('base64'),total=Math.ceil(encoded.length/CHUNK);
    for(let i=0;i<total;i++)lines.push(`PUBLIC_BROWSER_FILE ${name} ${i}/${total} ${encoded.slice(i*CHUNK,(i+1)*CHUNK)}`);
  }
  lines.push(END);
  const log=lines.join('\n')+'\n';
  if(Buffer.byteLength(log)>MAX_LOG)throw new Error('Encoded log size limit exceeded');
  return log;
}

export async function decodePublicProbeLog({text,output}) {
  if(Buffer.byteLength(text)>12*1024*1024)throw new Error('Input log size limit exceeded');
  const starts=[...text.matchAll(/PUBLIC_BROWSER_BUNDLE_V1_BEGIN (\{[^\r\n]+\})/g)];
  const ends=[...text.matchAll(/PUBLIC_BROWSER_BUNDLE_V1_END/g)];
  if(starts.length!==1||ends.length!==1||ends[0].index<starts[0].index)throw new Error('Expected one complete bundle');
  const manifest=JSON.parse(starts[0][1]);
  if(manifest.version!==1||!Array.isArray(manifest.files)||manifest.files.length>3)throw new Error('Invalid log manifest');
  const meta=new Map();let total=0;
  for(const f of manifest.files) {
    if(!NAMES.includes(f.name)||meta.has(f.name)||!Number.isSafeInteger(f.bytes)||f.bytes<1||!Number.isSafeInteger(f.chunks)||f.chunks<1||f.chunks>1024||!/^[a-f0-9]{64}$/.test(f.sha256))throw new Error('Invalid log file metadata');
    total+=f.bytes;if(total>MAX_RAW)throw new Error('Decoded size limit exceeded');meta.set(f.name,f);
  }
  const chunkMap=new Map([...meta].map(([name,f])=>[name,new Array(f.chunks)]));
  const section=text.slice(starts[0].index,ends[0].index);
  for(const m of section.matchAll(/PUBLIC_BROWSER_FILE ([a-z.]+) (\d+)\/(\d+) ([A-Za-z0-9+/=]+)\r?$/gm)) {
    const [,name,iRaw,nRaw,b64]=m,i=Number(iRaw),f=meta.get(name),chunks=chunkMap.get(name);
    if(!f||Number(nRaw)!==f.chunks||i>=f.chunks||chunks[i]!==undefined||b64.length>CHUNK)throw new Error('Invalid or duplicate log chunk');
    chunks[i]=b64;
  }
  const files=new Map();
  for(const [name,f] of meta) {
    const chunks=chunkMap.get(name);if(Array.from(chunks).some(x=>x===undefined))throw new Error('Incomplete log bytes');
    const encoded=chunks.join(''),b=Buffer.from(encoded,'base64');
    if(b.toString('base64')!==encoded||b.length!==f.bytes||hash(b)!==f.sha256)throw new Error('Decoded file hash/bytes mismatch');
    files.set(name,b);
  }
  const receipt=validateFiles(files,true);
  if(receipt.kind!==manifest.kind)throw new Error('Bundle kind mismatch');
  const dest=realDestination(output);
  if(dest===REPO||dest.startsWith(REPO+path.sep))throw new Error('Decoded output must be outside checkout');
  try {if((await fs.readdir(dest)).length)throw new Error('Decoded output must be empty');}catch(e){if(e.code!=='ENOENT')throw e;}
  await fs.mkdir(dest,{recursive:true});
  for(const [name,b] of files)await fs.writeFile(path.join(dest,name),b,{flag:'wx'});
  return {kind:receipt.kind,captureStatus:receipt.captureStatus,visualReviewStatus:'pending-pixel-review',output:dest,files:[...files.keys()]};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {
    const [mode,flag,input,outputFlag,output]=process.argv.slice(2);
    if(mode==='emit'&&flag==='--input'&&input&&!outputFlag)process.stdout.write(await createPublicProbeLog({input}));
    else if(mode==='decode'&&flag==='--input'&&input&&outputFlag==='--output'&&output)console.log(JSON.stringify(await decodePublicProbeLog({text:await fs.readFile(input,'utf8'),output})));
    else throw new Error('Usage: public-browser-log.mjs emit --input <capture-dir> | decode --input <log.txt> --output <isolated-dir>');
  }catch(error){console.error(error.message);process.exitCode=1;}
}
