import {isWebOnly} from './publication-format.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import {sha,privateRoot,preflight,REPO,atomic} from './cloud-state.mjs';
import {dailyAssetPaths,weeklyAssetPaths,regularFile} from './public-assets.mjs';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {hostname} from 'node:os';
import {randomUUID} from 'node:crypto';
export async function digestTree(directory) {
  const rows=[];
  async function walk(dir,prefix='') {
    for(const name of (await fs.readdir(dir)).sort()) {
      const file=path.join(dir,name),rel=prefix+name,stat=await fs.lstat(file);
      if(stat.isSymbolicLink())throw new Error('Public output symlink is forbidden');
      if(stat.isDirectory())await walk(file,rel+'/');
      else if(stat.isFile())rows.push(rel+':'+sha(await fs.readFile(file)));
      else throw new Error('Unsupported output file type');
    }
  }
  await walk(directory);return sha(rows.join('\n'));
}
export function rejectPrivateFields(value) {
  if(!value||typeof value!=='object')return;
  const forbidden=new Set(['queries','observations','raw_html','raw_text','credentials','password','access_token','api_key','secret','research']);
  for(const [key,child] of Object.entries(value)){if(forbidden.has(key))throw new Error('Private research/credential field cannot enter public input: '+key);rejectPrivateFields(child);}
}
export function publicFiles(kind,key,data,{webOnly=isWebOnly(data)}={}) {
  const prefix=kind==='weekly'?'weekly/'+key:key;
  const local=['zh/index.html','en/index.html','manifest.json','sources.md'];
  const global=kind==='weekly'?['weekly/index.html','weekly/manifest.json','data/weekly/'+key+'.json']:
    ['data/editions/'+key+'.json','index.html','en/index.html','manifest.json','assets/site.css','assets/issue-v2.css'];
  if(kind==='weekly')local.push('index.html','qa.json','assets/weekly.css','assets/weekly.js');
  else if(!webOnly)local.push('pdf-export.json');
  if(!webOnly)for(const lang of ['zh','en'])local.push((kind==='weekly'?'ai-weekly-':'ai-daily-')+key+'-'+lang+'.pdf');
  local.push(...(kind==='weekly'?weeklyAssetPaths(data):dailyAssetPaths(data)));
  return [...new Set([...local.map(rel=>prefix+'/'+rel),...global])].sort();
}
async function releaseFiles(kind,key,output) {
  const source=kind==='weekly'?'data/weekly/'+key+'.json':'data/editions/'+key+'.json';
  return publicFiles(kind,key,JSON.parse(await fs.readFile(await regularFile(output,source),'utf8')));
}
export async function repositoryBaseline(repo) {
  const hashes={};
  const names=['index.html','en/index.html','manifest.json','assets/site.css','assets/issue-v2.css','weekly/index.html','weekly/manifest.json','data/issues.json'];
  for(const dir of ['data/editions','data/coverage','data/weekly']) {
    let files=[];
    try {files=await fs.readdir(path.join(repo,dir));}catch(e){if(e.code!=='ENOENT')throw e;}
    names.push(...files.filter(f=>/^[0-9]{4}-[0-9]{2}-[0-9]{2}\.json$/.test(f)).map(f=>dir+'/'+f));
  }
  for(const rel of names.sort()) {
    try{hashes[rel]=sha(await fs.readFile(path.join(repo,rel)));}
    catch(e){if(e.code!=='ENOENT')throw e;hashes[rel]=null;}
  }
  let head=null;
  try{head=(await promisify(execFile)('git',['-C',repo,'rev-parse','HEAD'])).stdout.trim();}
  catch(e){if(e.code==='ENOENT')throw e;}
  return {sha256:sha(JSON.stringify({head,hashes})),head,hashes};
}
export async function assertRepositoryBaseline(baseline,repo) {
  if(!baseline?.sha256||(await repositoryBaseline(repo)).sha256!==baseline.sha256)
    throw new Error('Repository baseline has changed; rebuild navigation and repeat QA/editorial review');
}
export async function digestRelease(kind,key,output) {
  const rows=[];
  for(const rel of await releaseFiles(kind,key,output)) {
    rows.push(rel+':'+sha(await fs.readFile(await regularFile(output,rel))));
  }
  return sha(rows.join('\n'));
}
export async function releasePlan(receipt,inputFile,repo=REPO) {
  if(receipt.status!=='validated-draft')throw new Error('Only a validated draft can be prepared for release');
  await assertRepositoryBaseline(receipt.repositoryBaseline,repo);
  if(await digestTree(receipt.result.target)!==receipt.artifactSha256)throw new Error('Validated artifact changed; rerun checks before release');
  if(await digestRelease(receipt.kind,receipt.key,receipt.output)!==receipt.releaseSha256)throw new Error('Validated navigation/data/styles changed; rerun checks before release');
  const bytes=await fs.readFile(inputFile);
  if(sha(bytes)!==receipt.inputSha256)throw new Error('Reviewed input differs from validated input');
  const input=JSON.parse(bytes);rejectPrivateFields(input);
  const key=receipt.key,output=receipt.output,kind=receipt.kind;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(key)||!['daily','weekly'].includes(kind))throw new Error('Invalid receipt identity');
  const issueDest=path.join(repo,kind==='weekly'?'weekly/'+key:key);
  try {
    const m=JSON.parse(await fs.readFile(path.join(issueDest,'manifest.json'),'utf8'));
    if(kind==='daily'||m.issue_type==='weekly'&&!m.partial_week)throw new Error('Historical edition already exists; refusing overwrite');
  }catch(e){if(e.code!=='ENOENT')throw e;}
  const files=await releaseFiles(kind,key,output);
  const expected=path.join(output,kind==='weekly'?'weekly/'+key:key);
  if(path.resolve(receipt.result.target)!==path.resolve(expected))throw new Error('Receipt target/output mismatch');
  for(const rel of files)await regularFile(output,rel);
  return {kind,key,files,input,publicData:kind==='weekly'?'data/weekly/'+key+'.json':null,publication:'prepared files only; commit, push, deployment and live verification remain separate'};
}
async function destinationFile(repo,rel) {
  const root=await fs.realpath(repo);
  let current=root;
  for(const part of rel.split('/')) {
    current=path.join(current,part);
    try{if((await fs.lstat(current)).isSymbolicLink())throw new Error('Public destination symlink is forbidden');}
    catch(e){if(e.code!=='ENOENT')throw e;}
  }
  return current;
}
async function fileHash(file) {
  try{return sha(await fs.readFile(file));}catch(e){if(e.code!=='ENOENT')throw e;return null;}
}
async function releaseLock(root) {
  const lock=path.join(root,'release.lock'),guard=path.join(root,'release.lock.acquire');
  // Every creator/reclaimer participates in this atomic namespace guard.
  // A guard left by a crash is never automatically removed or stolen.
  try{await fs.mkdir(guard,{mode:0o700});}
  catch(e){if(e.code==='EEXIST')throw new Error('Publication lock acquisition is busy; inspect a leftover acquisition guard before retry');throw e;}
  try {
    try{await fs.mkdir(lock);}
    catch(error) {
      if(error.code!=='EEXIST')throw error;
      const before=await fs.lstat(lock);
      if(!before.isDirectory()||before.isSymbolicLink())throw new Error('Unknown publication lock; inspect before retry');
      const owner=JSON.parse(await fs.readFile(await regularFile(lock,'owner.json'),'utf8'));
      let live=true;
      if(owner.host===hostname()&&Number.isInteger(owner.pid)&&owner.pid>0) {
        try{process.kill(owner.pid,0);}catch(e){if(e.code==='ESRCH')live=false;else throw e;}
      }
      if(live)throw new Error('Publication release is busy; inspect its owner before retry');
      const current=await fs.lstat(lock);
      if(before.dev!==current.dev||before.ino!==current.ino)throw new Error('Publication lock instance changed; inspect before retry');
      // The guard prevents another acquirer from creating a replacement here.
      await fs.rm(lock,{recursive:true});await fs.mkdir(lock);
    }
    const instance=randomUUID();
    await atomic(path.join(lock,'owner.json'),{pid:process.pid,host:hostname(),instance});
    return {path:lock,instance};
  }finally{await fs.rmdir(guard);}
}
async function releaseOwnedLock(lock) {
  const owner=JSON.parse(await fs.readFile(await regularFile(lock.path,'owner.json'),'utf8'));
  if(owner.instance!==lock.instance||owner.pid!==process.pid||owner.host!==hostname())
    throw new Error('Publication lock ownership changed; refusing to remove another instance');
  await fs.rm(lock.path,{recursive:true});
}
async function restoreJournal(journal,folder,repo) {
  // Refuse to undo unrelated edits. Atomic target replacement makes each file
  // either its old value or the reviewed new value even after a process crash.
  for(const row of journal.rows) {
    const current=await fileHash(await destinationFile(repo,row.rel));
    if(current!==row.before&&current!==row.after)throw new Error('Interrupted release conflicts with newer public edits; inspect before recovery');
  }
  for(const row of journal.rows) {
    const dest=await destinationFile(repo,row.rel),temp=dest+'.ai-release-'+journal.id+'.tmp';
    if(row.before===null)await fs.rm(dest,{force:true});
    else {
      const bytes=await fs.readFile(path.join(folder,row.backup));
      if(sha(bytes)!==row.before)throw new Error('Interrupted release backup is damaged');
      await fs.mkdir(path.dirname(dest),{recursive:true});
      await fs.writeFile(temp,bytes);await fs.rename(temp,dest);
    }
    await fs.rm(temp,{force:true});
  }
}
export async function prepareRelease({receiptFile,inputFile,repo=REPO,copyFile=fs.copyFile}) {
  const root=privateRoot();const rules=await preflight(root,{requireCurrentNotion:true});
  repo=await fs.realpath(repo);
  const receiptBytes=await fs.readFile(receiptFile),receipt=JSON.parse(receiptBytes);
  if(receipt.ruleSource?.snapshotSha256!==rules.ruleSnapshotSha256)throw new Error('Release rules differ from the current Notion snapshot; rebuild and repeat editorial review');
  const id=sha(Buffer.concat([receiptBytes,Buffer.from(repo)])),folder=path.join(root,'releases',id),journalFile=path.join(folder,'transaction.json');
  const lock=await releaseLock(root);
  try {
    let journal;
    try{journal=JSON.parse(await fs.readFile(journalFile,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
    if(journal?.status==='prepared') {
      if(sha(await fs.readFile(inputFile))!==receipt.inputSha256)throw new Error('Prepared input changed');
      for(const row of journal.rows)if(await fileHash(await destinationFile(repo,row.rel))!==row.after)throw new Error('Prepared public files changed; never replay an old navigation draft');
      return {kind:receipt.kind,key:receipt.key,files:journal.rows.map(r=>r.rel),reused:true,publication:'files already prepared; git push/deployment/live status remain separate'};
    }
    if(journal?.status==='copying') {
      if((await repositoryBaseline(repo)).head!==journal.repositoryHead)throw new Error('Repository HEAD changed since interrupted release; inspect committed history before recovery');
      await restoreJournal(journal,folder,repo);
      await atomic(journalFile,{...journal,status:'rolled-back'});
    }
    const plan=await releasePlan(receipt,inputFile,repo);
    await fs.mkdir(folder,{recursive:true,mode:0o700});
    const rows=[];
    for(const [i,rel] of plan.files.entries()) {
      const destination=await destinationFile(repo,rel),before=await fileHash(destination),backup=i+'.backup';
      if(before!==null)await fs.writeFile(path.join(folder,backup),await fs.readFile(destination),{mode:0o600});
      rows.push({rel,before,backup,after:sha(await fs.readFile(await regularFile(receipt.output,rel)))});
    }
    journal={id,status:'copying',repositoryHead:receipt.repositoryBaseline.head,rows};
    await assertRepositoryBaseline(receipt.repositoryBaseline,repo);
    await atomic(journalFile,journal);
    try {
      for(const row of rows) {
        const destination=await destinationFile(repo,row.rel),temp=destination+'.ai-release-'+id+'.tmp';
        await fs.mkdir(path.dirname(destination),{recursive:true});
        await copyFile(await regularFile(receipt.output,row.rel),temp);
        await fs.rename(temp,destination);
      }
      await atomic(journalFile,{...journal,status:'prepared'});
    }catch(error) {
      await restoreJournal(journal,folder,repo);
      await atomic(journalFile,{...journal,status:'rolled-back'});
      throw error;
    }
    return {...plan,input:undefined};
  }finally{await releaseOwnedLock(lock);}
}
