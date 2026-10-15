import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {dailyAssetPaths,copyPublicAssets} from '../scripts/lib/public-assets.mjs';
import {repositoryBaseline,digestTree,digestRelease,releasePlan,prepareRelease} from '../scripts/lib/release.mjs';
import {privateRoot,REPO,sha} from '../scripts/lib/cloud-state.mjs';
import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {batch,weekly} from './fixtures/cloud-publisher.mjs';
import {ingest} from '../scripts/lib/cloud-state.mjs';
import {buildWeekly} from '../scripts/lib/weekly.mjs';

async function dailyDraft(root) {
  const output=path.join(root,'draft'),repo=path.join(root,'site'),key='2026-10-19';
  const input={date:key,topics:[{visuals:[{path:'assets/photo.png'}]}]},bytes=JSON.stringify(input);
  await fs.mkdir(repo);
  await fs.writeFile(path.join(repo,'index.html'),'Existing navigation');
  const names=[key+'/zh/index.html',key+'/en/index.html',key+'/manifest.json',key+'/sources.md',key+'/pdf-export.json',
    key+'/ai-daily-'+key+'-zh.pdf',key+'/ai-daily-'+key+'-en.pdf',key+'/assets/photo.png',
    'index.html','en/index.html','manifest.json','assets/site.css','assets/issue-v2.css','data/editions/'+key+'.json'];
  for(const rel of names){await fs.mkdir(path.dirname(path.join(output,rel)),{recursive:true});await fs.writeFile(path.join(output,rel),rel.startsWith('data/editions/')?bytes:rel===key+'/manifest.json'?JSON.stringify({date:key}):'TEST PUBLIC FILE '+rel);}
  await fs.writeFile(path.join(output,key,'assets/raw-notes.txt'),'PRIVATE UNREFERENCED NOTES');
  const inputFile=path.join(root,'input.json');await fs.writeFile(inputFile,bytes);
  const receipt={kind:'daily',key,status:'validated-draft',output,result:{target:path.join(output,key)},inputSha256:(await import('../scripts/lib/cloud-state.mjs')).sha(bytes),
    artifactSha256:await digestTree(path.join(output,key)),releaseSha256:await digestRelease('daily',key,output),repositoryBaseline:await repositoryBaseline(repo)};
  return {receipt,inputFile,repo,output};
}
async function fakePrivateRules(root) {
  const folder=path.join(root,'private/rules');await fs.mkdir(folder,{recursive:true});
  const bytes=Buffer.from('Synthetic test rules only.'),files=[];
  for(const file_name of ['daily-method.md','weekly-method.md','collection-handbook.md','execution-prompt.md','HANDOFF.md']) {
    await fs.writeFile(path.join(folder,file_name),bytes);files.push({file_name,bytes:bytes.length,sha256:sha(bytes)});
  }
  await fs.writeFile(path.join(folder,'manifest.json'),JSON.stringify({files}));return path.dirname(folder);
}

test('daily public assets include only retained figures/detail figures/media posters, never raw siblings',async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'ai-public-assets-'));
  try {
    const source=path.join(root,'incoming'),target=path.join(root,'published');
    await fs.mkdir(source);
    for(const file of ['photo.png','detail.png','poster.png','unused.png','raw-notes.txt'])await fs.writeFile(path.join(source,file),file);
    const issue={topics:[{visuals:[{path:'assets/photo.png'}],detailPages:[{visuals:[{path:'assets/detail.png'}],media:[{poster:{path:'assets/poster.png'}}]}]}]};
    const files=dailyAssetPaths(issue);
    await copyPublicAssets({assetsDir:source,target,paths:files});
    assert.deepEqual((await fs.readdir(path.join(target,'assets'))).sort(),['detail.png','photo.png','poster.png']);
    await assert.rejects(fs.access(path.join(target,'assets/raw-notes.txt')),/ENOENT/);
    await assert.rejects(fs.access(path.join(target,'assets/unused.png')),/ENOENT/);
    assert.equal((await fs.lstat(path.join(target,'assets'))).isSymbolicLink(),false);
  }finally{await fs.rm(root,{recursive:true,force:true});}
});
test('reviewed release uses a file-level allowlist and cannot publish unreferenced private assets',async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'ai-release-allowlist-'));
  try {
    const fixture=await dailyDraft(root),plan=await releasePlan(fixture.receipt,fixture.inputFile,fixture.repo);
    assert.ok(plan.files.includes('2026-10-19/assets/photo.png'));
    assert.ok(!plan.files.includes('2026-10-19'));
    assert.ok(!plan.files.some(p=>p.includes('raw-notes')));
  }finally{await fs.rm(root,{recursive:true,force:true});}
});
test('a later daily or weekly navigation/archive mutation rejects an older draft before writing',async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'ai-release-baseline-'));
  try {
    const fixture=await dailyDraft(root);
    await fs.writeFile(path.join(fixture.repo,'index.html'),'Navigation with newer issue B');
    await assert.rejects(releasePlan(fixture.receipt,fixture.inputFile,fixture.repo),/repository baseline.*changed/i);
    assert.equal(await fs.readFile(path.join(fixture.repo,'index.html'),'utf8'),'Navigation with newer issue B');
    await assert.rejects(fs.access(path.join(fixture.repo,'2026-10-19')),/ENOENT/);
  }finally{await fs.rm(root,{recursive:true,force:true});}
});
test('weekly navigation and published weekly data participate in every draft baseline',async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'ai-weekly-baseline-'));
  try {
    const f=await dailyDraft(root);
    await fs.mkdir(path.join(f.repo,'weekly'));
    await fs.writeFile(path.join(f.repo,'weekly/manifest.json'),'[{"week_start":"2026-10-26"}]');
    await assert.rejects(releasePlan(f.receipt,f.inputFile,f.repo),/repository baseline.*changed/i);
  }finally{await fs.rm(root,{recursive:true,force:true});}
});
test('public asset materialization rejects traversal, external files and escaping directory/file symlinks before copying',async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'ai-public-assets-'));
  try {
    const source=path.join(root,'incoming'),target=path.join(root,'published');await fs.mkdir(source);
    await fs.writeFile(path.join(root,'private.png'),'PRIVATE');
    await fs.symlink(path.join(root,'private.png'),path.join(source,'escape.png'));
    await fs.symlink(root,path.join(source,'folder'));
    for(const value of ['assets/../private.png','assets/escape.png','assets/folder/private.png','/private.png','assets/raw-notes.txt']) {
      await assert.rejects(copyPublicAssets({assetsDir:source,target,paths:[value]}),/asset|symlink|image/i);
    }
    await assert.rejects(fs.access(target),/ENOENT/);
  }finally{await fs.rm(root,{recursive:true,force:true});}
});
test('private/output roots resolve existing symlink ancestors before allowing a nonexistent child',async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'ai-public-root-'));
  try {
    await fs.symlink(REPO,path.join(root,'public-alias'));
    assert.throws(()=>privateRoot(path.join(root,'public-alias/new-private')),/public repository/);
    await ingest(root,batch);
    await assert.rejects(buildWeekly({input:weekly,privateDir:root,output:path.join(root,'public-alias/forbidden-dry')}),/outside public checkout/);
  }finally{await fs.rm(root,{recursive:true,force:true});}
});
test('an interrupted multi-file release rolls back all navigation/edition files and can safely retry',async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'ai-release-rollback-')),old=process.env.AI_DAILY_PRIVATE_ROOT;
  try {
    const f=await dailyDraft(root);process.env.AI_DAILY_PRIVATE_ROOT=await fakePrivateRules(root);
    const receiptFile=path.join(root,'receipt.json');await fs.writeFile(receiptFile,JSON.stringify(f.receipt));
    let copies=0;
    await assert.rejects(prepareRelease({receiptFile,inputFile:f.inputFile,repo:f.repo,copyFile:async(...args)=>{
      if(++copies===5)throw new Error('Simulated copy interruption');return fs.copyFile(...args);
    }}),/Simulated copy interruption/);
    assert.equal((await repositoryBaseline(f.repo)).sha256,f.receipt.repositoryBaseline.sha256);
    await assert.rejects(fs.access(path.join(f.repo,f.receipt.key,'manifest.json')),/ENOENT/);
    await prepareRelease({receiptFile,inputFile:f.inputFile,repo:f.repo});
    assert.equal(await fs.readFile(path.join(f.repo,f.receipt.key,'assets/photo.png'),'utf8'),'TEST PUBLIC FILE '+f.receipt.key+'/assets/photo.png');
    await assert.rejects(fs.access(path.join(f.repo,f.receipt.key,'assets/raw-notes.txt')),/ENOENT/);
  }finally{if(old===undefined)delete process.env.AI_DAILY_PRIVATE_ROOT;else process.env.AI_DAILY_PRIVATE_ROOT=old;await fs.rm(root,{recursive:true,force:true});}
});
test('a process crash after a manifest copy is recovered from a private journal before an idempotent retry',async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'ai-release-crash-')),old=process.env.AI_DAILY_PRIVATE_ROOT;
  try {
    const f=await dailyDraft(root);process.env.AI_DAILY_PRIVATE_ROOT=await fakePrivateRules(root);
    const receiptFile=path.join(root,'receipt.json');await fs.writeFile(receiptFile,JSON.stringify(f.receipt));
    const code="import fs from 'node:fs/promises';const {prepareRelease}=await import(process.argv[1]);let n=0;await prepareRelease({receiptFile:process.argv[2],inputFile:process.argv[3],repo:process.argv[4],copyFile:async(...args)=>{await fs.copyFile(...args);if(++n===7)process.exit(42);}});";
    const exit=await new Promise((resolve,reject)=>{
      const child=spawn(process.execPath,['--input-type=module','-e',code,path.join(REPO,'scripts/lib/release.mjs'),receiptFile,f.inputFile,f.repo],{env:process.env,stdio:'pipe'});
      let stderr='';child.stderr.on('data',s=>stderr+=s);child.on('error',reject);child.on('exit',code=>code===42?resolve(code):reject(new Error(stderr)));
    });
    assert.equal(exit,42);
    await prepareRelease({receiptFile,inputFile:f.inputFile,repo:f.repo});
    const repeated=await prepareRelease({receiptFile,inputFile:f.inputFile,repo:f.repo});
    assert.equal(repeated.reused,true);
    await assert.rejects(fs.access(path.join(f.repo,f.receipt.key,'assets/raw-notes.txt')),/ENOENT/);
    await fs.writeFile(path.join(f.repo,'index.html'),'Newer issue B');
    await assert.rejects(prepareRelease({receiptFile,inputFile:f.inputFile,repo:f.repo}),/prepared.*changed/i);
    assert.equal(await fs.readFile(path.join(f.repo,'index.html'),'utf8'),'Newer issue B');
  }finally{if(old===undefined)delete process.env.AI_DAILY_PRIVATE_ROOT;else process.env.AI_DAILY_PRIVATE_ROOT=old;await fs.rm(root,{recursive:true,force:true});}
});
test('crash recovery never rolls back files after the repository has been committed',async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'ai-release-committed-')),old=process.env.AI_DAILY_PRIVATE_ROOT;
  try {
    const f=await dailyDraft(root);process.env.AI_DAILY_PRIVATE_ROOT=await fakePrivateRules(root);
    const git=async(...args)=>promisify(execFile)('git',['-C',f.repo,...args]);
    await git('init','-q');await git('add','.');await git('-c','user.name=Test','-c','user.email=test@example.invalid','commit','-qm','initial fixture');
    f.receipt.repositoryBaseline=await repositoryBaseline(f.repo);
    const receiptFile=path.join(root,'receipt.json');await fs.writeFile(receiptFile,JSON.stringify(f.receipt));
    const code="import fs from 'node:fs/promises';const {prepareRelease}=await import(process.argv[1]);let n=0;await prepareRelease({receiptFile:process.argv[2],inputFile:process.argv[3],repo:process.argv[4],copyFile:async(...args)=>{await fs.copyFile(...args);if(++n===7)process.exit(42);}});";
    await new Promise((resolve,reject)=>{const child=spawn(process.execPath,['--input-type=module','-e',code,path.join(REPO,'scripts/lib/release.mjs'),receiptFile,f.inputFile,f.repo],{env:process.env,stdio:'ignore'});child.on('error',reject);child.on('exit',c=>c===42?resolve():reject(new Error('Unexpected child exit '+c)));});
    await git('add','.');await git('-c','user.name=Test','-c','user.email=test@example.invalid','commit','-qm','committed fixture after interruption');
    const manifest=await fs.readFile(path.join(f.repo,f.receipt.key,'manifest.json'));
    await assert.rejects(prepareRelease({receiptFile,inputFile:f.inputFile,repo:f.repo}),/HEAD changed/);
    assert.deepEqual(await fs.readFile(path.join(f.repo,f.receipt.key,'manifest.json')),manifest);
  }finally{if(old===undefined)delete process.env.AI_DAILY_PRIVATE_ROOT;else process.env.AI_DAILY_PRIVATE_ROOT=old;await fs.rm(root,{recursive:true,force:true});}
});
