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
import {batch,weekly,installRuleFixture} from './fixtures/cloud-publisher.mjs';
import {ingest} from '../scripts/lib/cloud-state.mjs';
import {buildWeekly} from '../scripts/lib/weekly.mjs';
import {hostname} from 'node:os';

async function dailyDraft(root) {
  const ruleSource=await installRuleFixture(path.join(root,'private'));
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
  const receipt={kind:'daily',key,status:'validated-draft',ruleSource,output,result:{target:path.join(output,key)},inputSha256:(await import('../scripts/lib/cloud-state.mjs')).sha(bytes),
    artifactSha256:await digestTree(path.join(output,key)),releaseSha256:await digestRelease('daily',key,output),repositoryBaseline:await repositoryBaseline(repo)};
  return {receipt,inputFile,repo,output};
}
async function fakePrivateRules(root) {
  return path.join(root,'private');
}
async function deadReleaseOwner(root) {
  const child=spawn(process.execPath,['-e',''],{stdio:'ignore'}),pid=child.pid;
  await new Promise((resolve,reject)=>{child.on('error',reject);child.on('exit',resolve);});
  const lock=path.join(root,'release.lock');await fs.mkdir(lock);
  await fs.writeFile(path.join(lock,'owner.json'),JSON.stringify({pid,host:hostname(),instance:'dead-fixture-lock'}));
}
function latch() {let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};}

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
test('two same-process reclaimers cannot remove the replacement live lock after reading a dead owner',{timeout:15000},async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'ai-release-reclaim-')),old=process.env.AI_DAILY_PRIVATE_ROOT,readFile=fs.readFile;
  const ownerRead=latch(),resumeRead=latch(),finish=latch(),firstEntry=latch(),secondOutcome=latch();
  const attempts=[];let paused=false,active=0,maximum=0;
  try {
    const f=await dailyDraft(root),privateDir=await fakePrivateRules(root);process.env.AI_DAILY_PRIVATE_ROOT=privateDir;
    await deadReleaseOwner(privateDir);
    const receiptFile=path.join(root,'receipt.json');await fs.writeFile(receiptFile,JSON.stringify(f.receipt));
    fs.readFile=async(...args)=>{
      const bytes=await readFile(...args);
      if(!paused&&String(args[0])===path.join(privateDir,'release.lock/owner.json')){paused=true;ownerRead.resolve();await resumeRead.promise;}
      return bytes;
    };
    function copier(entry) {
      let first=true;
      return async(...args)=>{if(first){first=false;active++;maximum=Math.max(maximum,active);entry.resolve('entered');await finish.promise;active--;}return fs.copyFile(...args);};
    }
    const first=prepareRelease({receiptFile,inputFile:f.inputFile,repo:f.repo,copyFile:copier(firstEntry)});attempts.push(first);
    await ownerRead.promise;
    const second=prepareRelease({receiptFile,inputFile:f.inputFile,repo:f.repo,copyFile:copier(secondOutcome)});attempts.push(second);
    second.then(()=>secondOutcome.resolve('done'),error=>secondOutcome.resolve(error.message));
    const outcome=await secondOutcome.promise;
    resumeRead.resolve();await firstEntry.promise;
    assert.match(outcome,/busy|acquisition/i);assert.equal(maximum,1);
    const owner=JSON.parse(await readFile(path.join(privateDir,'release.lock/owner.json'),'utf8'));
    assert.equal(owner.pid,process.pid);
    finish.resolve();await first;
    await assert.rejects(second,/busy|acquisition/i);
  }finally{
    resumeRead.resolve();finish.resolve();fs.readFile=readFile;await Promise.allSettled(attempts);
    if(old===undefined)delete process.env.AI_DAILY_PRIVATE_ROOT;else process.env.AI_DAILY_PRIVATE_ROOT=old;await fs.rm(root,{recursive:true,force:true});
  }
});
test('two process reclaimers serialize takeover and the blocked reclaimer cannot delete a new live owner',{timeout:15000},async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'ai-release-reclaim-processes-'));
  const children=[];
  try {
    const f=await dailyDraft(root),privateDir=await fakePrivateRules(root);await deadReleaseOwner(privateDir);
    const receiptFile=path.join(root,'receipt.json');await fs.writeFile(receiptFile,JSON.stringify(f.receipt));
    const code=`import fs from 'node:fs/promises';
const role=process.argv[5],hold=type=>new Promise(r=>{const fn=m=>{if(m.type===type){process.off('message',fn);r();}};process.on('message',fn);});
const original=fs.readFile;let paused=false;
if(role==='first')fs.readFile=async(...args)=>{const bytes=await original(...args);if(!paused&&String(args[0]).endsWith('/release.lock/owner.json')){paused=true;const resume=hold('resume');process.send({stage:'read-owner'});await resume;}return bytes;};
const {prepareRelease}=await import(process.argv[1]);let first=true;
try{await prepareRelease({receiptFile:process.argv[2],inputFile:process.argv[3],repo:process.argv[4],copyFile:async(...args)=>{if(first){first=false;const finish=hold('finish');process.send({stage:'entered-copy'});await finish;}await fs.copyFile(...args);}});process.send({stage:'done'});}
catch(e){process.send({stage:'blocked',error:e.message});}
process.disconnect();`;
    function start(role) {
      const child=spawn(process.execPath,['--input-type=module','-e',code,path.join(REPO,'scripts/lib/release.mjs'),receiptFile,f.inputFile,f.repo,role],{env:{...process.env,AI_DAILY_PRIVATE_ROOT:privateDir},stdio:['ignore','pipe','pipe','ipc']});
      children.push(child);const queue=[],waiters=[];
      child.on('message',message=>{const i=waiters.findIndex(w=>w.stages.includes(message.stage));if(i<0)queue.push(message);else waiters.splice(i,1)[0].resolve(message);});
      return {child,wait:(...stages)=>{const i=queue.findIndex(m=>stages.includes(m.stage));if(i>=0)return Promise.resolve(queue.splice(i,1)[0]);return new Promise(resolve=>waiters.push({stages,resolve}));}};
    }
    const first=start('first');await first.wait('read-owner');
    const second=start('second');const outcome=await second.wait('entered-copy','blocked');
    first.child.send({type:'resume'});await first.wait('entered-copy','blocked');
    assert.equal(outcome.stage,'blocked');assert.match(outcome.error,/busy|acquisition/i);
    const owner=JSON.parse(await fs.readFile(path.join(privateDir,'release.lock/owner.json'),'utf8'));
    assert.equal(owner.pid,first.child.pid);
    first.child.send({type:'finish'});assert.equal((await first.wait('done','blocked')).stage,'done');
  }finally{
    for(const child of children)if(child.connected){child.send({type:'resume'},()=>{});child.send({type:'finish'},()=>{});}
    await Promise.all(children.map(child=>child.exitCode!==null?Promise.resolve():new Promise(resolve=>child.once('exit',resolve))));
    await fs.rm(root,{recursive:true,force:true});
  }
});
test('a leftover acquisition guard is fail-closed and never automatically reclaimed',async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'ai-release-leftover-guard-')),old=process.env.AI_DAILY_PRIVATE_ROOT;
  try {
    const f=await dailyDraft(root),privateDir=await fakePrivateRules(root);process.env.AI_DAILY_PRIVATE_ROOT=privateDir;
    await deadReleaseOwner(privateDir);await fs.mkdir(path.join(privateDir,'release.lock.acquire'));
    const before=await fs.readFile(path.join(privateDir,'release.lock/owner.json'));
    const receiptFile=path.join(root,'receipt.json');await fs.writeFile(receiptFile,JSON.stringify(f.receipt));
    await assert.rejects(prepareRelease({receiptFile,inputFile:f.inputFile,repo:f.repo}),/acquisition.*busy/);
    assert.deepEqual(await fs.readFile(path.join(privateDir,'release.lock/owner.json')),before);
    assert.equal((await repositoryBaseline(f.repo)).sha256,f.receipt.repositoryBaseline.sha256);
    assert.equal((await fs.stat(path.join(privateDir,'release.lock.acquire'))).isDirectory(),true);
  }finally{if(old===undefined)delete process.env.AI_DAILY_PRIVATE_ROOT;else process.env.AI_DAILY_PRIVATE_ROOT=old;await fs.rm(root,{recursive:true,force:true});}
});
