import fs from 'node:fs/promises';
import path from 'node:path';
import {allIssueTopics,allTopicVisuals} from './topic-content.mjs';
export function assetPath(value) {
  if(typeof value!=='string'||!/^assets\/[A-Za-z0-9_./-]+$/.test(value)||value.split('/').some(p=>!p||p==='.'||p==='..')||
    !['.png','.jpg','.jpeg','.webp','.avif','.gif','.svg'].includes(path.posix.extname(value).toLowerCase()))
    throw new Error('Invalid public image asset path');
  return value;
}
export function dailyAssetPaths(issue) {
  return [...new Set(allIssueTopics(issue).flatMap(t=>allTopicVisuals(t).map(v=>assetPath(v.path))))].sort();
}
export function weeklyAssetPaths(input) {
  return [...new Set([...input.highlights,...input.trends].flatMap(i=>i.pages.flatMap(p=>(p.visuals??[]).map(v=>assetPath(v.path)))))].sort();
}
export async function regularFile(root,relative) {
  if(path.isAbsolute(relative)||relative.split(/[\\/]/).some(p=>!p||p==='.'||p==='..'))throw new Error('Unsafe public file path');
  const rootStat=await fs.lstat(root);
  if(rootStat.isSymbolicLink()||!rootStat.isDirectory())throw new Error('Public source root cannot be a symlink');
  const canonical=await fs.realpath(root);
  let file=canonical;
  for(const part of relative.split('/')) {
    file=path.join(file,part);
    if((await fs.lstat(file)).isSymbolicLink())throw new Error('Public source symlink is forbidden');
  }
  if(!(await fs.stat(file)).isFile())throw new Error('Public source must be a regular file');
  const real=await fs.realpath(file);
  if(!real.startsWith(canonical+path.sep))throw new Error('Public source escapes approved root');
  return real;
}
export async function copyPublicAssets({assetsDir,target,paths}) {
  const unique=[...new Set(paths.map(assetPath))];
  if(!unique.length)return [];
  if(!assetsDir)throw new Error('Missing reviewed asset directory');
  // Resolve every source before writing anything. Never import an entire directory.
  const files=await Promise.all(unique.map(async rel=>({rel,source:await regularFile(path.resolve(assetsDir),rel.slice(7))})));
  for(const {rel,source} of files) {
    const destination=path.join(target,rel);
    await fs.mkdir(path.dirname(destination),{recursive:true});
    await fs.copyFile(source,destination);
  }
  return unique;
}
export async function retainPublicAssets(target,paths) {
  const keep=new Set(paths.map(assetPath));
  async function walk(dir,prefix) {
    for(const name of await fs.readdir(dir)) {
      const file=path.join(dir,name),rel=prefix+name,stat=await fs.lstat(file);
      if(stat.isSymbolicLink())throw new Error('Public output asset symlink is forbidden');
      if(stat.isDirectory())await walk(file,rel+'/');
      else if(!keep.has(rel))await fs.rm(file);
    }
  }
  try {await walk(path.join(target,'assets'),'assets/');}
  catch(e){if(e.code!=='ENOENT')throw e;}
}
