import fs from 'node:fs/promises';
import path from 'node:path';
import {sha,privateRoot,preflight,REPO} from './cloud-state.mjs';
export async function digestTree(directory) {
  const rows=[];
  async function walk(dir,prefix='') {
    for(const name of (await fs.readdir(dir)).sort()) {
      const file=path.join(dir,name),rel=prefix+name,stat=await fs.stat(file);
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
export function publicFiles(kind,key) {
  return kind==='weekly'?['weekly/'+key,'weekly/index.html','weekly/manifest.json']:
    [key,'data/editions/'+key+'.json','index.html','en/index.html','manifest.json','assets/site.css','assets/issue-v2.css'];
}
export async function digestRelease(kind,key,output) {
  const rows=[];
  for(const rel of publicFiles(kind,key)) {
    const file=path.join(output,rel),stat=await fs.stat(file);
    rows.push(rel+':'+(stat.isDirectory()?await digestTree(file):sha(await fs.readFile(file))));
  }
  return sha(rows.join('\n'));
}
export async function releasePlan(receipt,inputFile,repo=REPO) {
  if(receipt.status!=='validated-draft')throw new Error('Only a validated draft can be prepared for release');
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
  const files=publicFiles(kind,key);
  const expected=path.join(output,kind==='weekly'?'weekly/'+key:key);
  if(path.resolve(receipt.result.target)!==path.resolve(expected))throw new Error('Receipt target/output mismatch');
  for(const rel of files)await fs.access(path.join(output,rel));
  return {kind,key,files,input,publicData:kind==='weekly'?'data/weekly/'+key+'.json':null,publication:'prepared files only; commit, push, deployment and live verification remain separate'};
}
export async function prepareRelease({receiptFile,inputFile,repo=REPO}) {
  await preflight(privateRoot());
  const receipt=JSON.parse(await fs.readFile(receiptFile,'utf8')),plan=await releasePlan(receipt,inputFile,repo);
  // Explicit reviewed publication allowlist. Never copy output/data as a whole.
  for(const rel of plan.files) {
    const destination=path.join(repo,rel);
    await fs.mkdir(path.dirname(destination),{recursive:true});
    await fs.cp(path.join(receipt.output,rel),destination,{recursive:true,dereference:true});
  }
  if(plan.publicData) {
    await fs.mkdir(path.dirname(path.join(repo,plan.publicData)),{recursive:true});
    await fs.writeFile(path.join(repo,plan.publicData),JSON.stringify(plan.input,null,2)+'\n');
  }
  return {...plan,input:undefined};
}
