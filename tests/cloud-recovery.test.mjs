import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {main} from '../scripts/cloud-run.mjs';
import {REPO,sha,ingest} from '../scripts/lib/cloud-state.mjs';
import {digestTree,digestRelease,repositoryBaseline} from '../scripts/lib/release.mjs';
import {batch,weekly,installRuleFixture} from './fixtures/cloud-publisher.mjs';

async function withPrivateFixture(fn) {
  const base=await fs.mkdtemp(path.join(os.tmpdir(),'ai-cloud-recovery-TEST-FIXTURE-'));
  const old=process.env.AI_DAILY_PRIVATE_ROOT;
  try {await fn(base);}
  finally {
    if(old===undefined)delete process.env.AI_DAILY_PRIVATE_ROOT;
    else process.env.AI_DAILY_PRIVATE_ROOT=old;
    await fs.rm(base,{recursive:true,force:true});
  }
}
async function invoke(root,kind,output) {
  process.env.AI_DAILY_PRIVATE_ROOT=root;
  const logs=[],original=console.log;
  console.log=value=>logs.push(value);
  try {
    await main(['build','--kind',kind,'--input',path.join(root,'input.json'),'--output',output??path.join(root,'dry')]);
    return JSON.parse(logs.at(-1));
  } finally {console.log=original;}
}
// These files represent an already-reviewed TEST FIXTURE, not rendered news.
// Migration tests exercise real file hashes and the actual cloud-run entrypoint.
async function savedDraft(root,kind='weekly') {
  const ruleSource=await installRuleFixture(root),output=path.join(root,'dry');
  const key=kind==='weekly'?'2026-10-12':'2026-10-19';
  const prefix=kind==='weekly'?'weekly/'+key:key;
  const input=kind==='weekly'?{...weekly,ruleSnapshotSha256:ruleSource.snapshotSha256}:
    {date:key,topics:[],ruleSnapshotSha256:ruleSource.snapshotSha256};
  const bytes=JSON.stringify(input);
  const files=[prefix+'/zh/index.html',prefix+'/en/index.html',prefix+'/manifest.json',prefix+'/sources.md',
    prefix+'/'+(kind==='weekly'?'ai-weekly-':'ai-daily-')+key+'-zh.pdf',
    prefix+'/'+(kind==='weekly'?'ai-weekly-':'ai-daily-')+key+'-en.pdf'];
  if(kind==='weekly')files.push(prefix+'/index.html',prefix+'/qa.json',prefix+'/assets/weekly.css',prefix+'/assets/weekly.js','weekly/index.html','weekly/manifest.json');
  else files.push(prefix+'/pdf-export.json','index.html','en/index.html','manifest.json','assets/site.css','assets/issue-v2.css');
  for(const rel of files) {
    await fs.mkdir(path.dirname(path.join(output,rel)),{recursive:true});
    await fs.writeFile(path.join(output,rel),'TEST FIXTURE ONLY '+rel);
  }
  const data=path.join(output,'data',kind==='weekly'?'weekly':'editions',key+'.json');
  await fs.mkdir(path.dirname(data),{recursive:true});await fs.writeFile(data,bytes);
  await fs.writeFile(path.join(root,'input.json'),bytes);
  const result={target:path.join(output,prefix)};
  if(kind==='daily') {
    result.slidev=path.join(output,'output/slidev','ai-product-morning-brief-'+key);
    await fs.mkdir(result.slidev,{recursive:true});
    await fs.writeFile(path.join(result.slidev,'slides.md'),'TEST FIXTURE ONLY');
  }
  const receipt={kind,key,status:'validated-draft',ruleSource,repositoryBaseline:await repositoryBaseline(REPO),
    inputSha256:sha(bytes),artifactSha256:await digestTree(result.target),releaseSha256:await digestRelease(kind,key,output),
    output,completedAt:'2026-10-19T14:00:00Z',result};
  const receiptFile=path.join(root,'runs',kind+'-'+key+'.json');
  await fs.mkdir(path.dirname(receiptFile),{recursive:true});await fs.writeFile(receiptFile,JSON.stringify(receipt));
  return {receipt,receiptFile,output,prefix};
}

test('a relocated weekly draft reuses its verified files and persists portable receipt paths',async()=>withPrivateFixture(async base=>{
  const original=path.join(base,'original'),restored=path.join(base,'restored');
  await installRuleFixture(original);await ingest(original,batch);
  const rules=JSON.parse(await fs.readFile(path.join(original,'rules/notion-source.json'),'utf8'));
  await fs.writeFile(path.join(original,'input.json'),JSON.stringify({...weekly,ruleSnapshotSha256:rules.snapshotSha256}));
  const built=await invoke(original,'weekly');assert.equal(built.status,'validated-draft');
  const before=JSON.parse(await fs.readFile(built.receipt,'utf8'));
  const artifact=await digestTree(path.join(original,'dry'));
  await fs.rename(original,restored);
  await assert.rejects(fs.access(original),/ENOENT/);
  const reused=await invoke(restored,'weekly');
  assert.equal(reused.reused,true);
  assert.equal(reused.output,path.join(restored,'dry'));
  assert.equal(reused.result.target,path.join(restored,'dry/weekly/2026-10-12'));
  assert.equal(reused.completedAt,before.completedAt);
  assert.equal(await digestTree(path.join(restored,'dry')),artifact);
  const file=path.join(restored,'runs/weekly-2026-10-12.json'),saved=await fs.readFile(file);
  assert.equal(JSON.parse(saved).output,reused.output);
  assert.equal(JSON.parse(saved).result.target,reused.result.target);
  assert.equal((await invoke(restored,'weekly')).reused,true);
  assert.deepEqual(await fs.readFile(file),saved);
}));

test('missing validated files fail explicitly instead of rebuilding into an existing output',async()=>withPrivateFixture(async root=>{
  const fixture=await savedDraft(root);
  await fs.rm(fixture.receipt.result.target,{recursive:true});
  const navigation=await fs.readFile(path.join(fixture.output,'weekly/index.html'));
  await assert.rejects(invoke(root,'weekly'),/Validated draft files are missing.*restore/i);
  assert.deepEqual(await fs.readFile(path.join(fixture.output,'weekly/index.html')),navigation);
  assert.equal(JSON.parse(await fs.readFile(fixture.receiptFile)).status,'validated-draft');
  await assert.rejects(fs.access(path.join(root,'runs/weekly-2026-10-12.lock')),/ENOENT/);
}));

test('a relocated artifact with changed bytes cannot be relabeled as the validated draft',async()=>withPrivateFixture(async base=>{
  const original=path.join(base,'original'),restored=path.join(base,'restored');
  const fixture=await savedDraft(original);
  await fs.rename(original,restored);
  const target=path.join(restored,'dry',fixture.prefix,'zh/index.html');
  await fs.appendFile(target,'CHANGED TEST FIXTURE');
  await assert.rejects(invoke(restored,'weekly'),/Prior validated artifact changed/);
  assert.equal(JSON.parse(await fs.readFile(path.join(restored,'runs/weekly-2026-10-12.json'))).output,fixture.output);
  assert.match(await fs.readFile(target,'utf8'),/CHANGED TEST FIXTURE$/);
}));

test('a relocated draft with changed global navigation fails its release hash',async()=>withPrivateFixture(async base=>{
  const original=path.join(base,'original'),restored=path.join(base,'restored');
  await savedDraft(original);await fs.rename(original,restored);
  await fs.appendFile(path.join(restored,'dry/weekly/index.html'),'CHANGED TEST FIXTURE');
  await assert.rejects(invoke(restored,'weekly'),/Prior navigation\/data\/styles changed/);
}));

test('daily receipt relocation also updates the independent Slidev source path',async()=>withPrivateFixture(async base=>{
  const original=path.join(base,'original'),restored=path.join(base,'restored');
  const fixture=await savedDraft(original,'daily');
  await fs.rename(original,restored);
  const before=await digestTree(path.join(restored,'dry'));
  const reused=await invoke(restored,'daily');
  assert.equal(reused.reused,true);
  assert.equal(reused.result.slidev,path.join(restored,'dry/output/slidev/ai-product-morning-brief-2026-10-19'));
  assert.equal(reused.completedAt,fixture.receipt.completedAt);
  assert.equal(await digestTree(path.join(restored,'dry')),before);
}));

test('relocation without restored output stops before creating a replacement draft',async()=>withPrivateFixture(async base=>{
  const original=path.join(base,'original'),restored=path.join(base,'restored');
  await savedDraft(original);await fs.rename(original,restored);
  await fs.rm(path.join(restored,'dry'),{recursive:true});
  await assert.rejects(invoke(restored,'weekly'),/Validated draft files are missing.*restore/i);
  await assert.rejects(fs.access(path.join(restored,'dry')),/ENOENT/);
}));

test('relocation cannot point a validated draft into the public checkout',async()=>withPrivateFixture(async root=>{
  await savedDraft(root);
  const forbidden=path.join(REPO,'TEST-FIXTURE-forbidden-dry');
  await assert.rejects(invoke(root,'weekly',forbidden),/outside public checkout/);
  await assert.rejects(fs.access(forbidden),/ENOENT/);
}));
