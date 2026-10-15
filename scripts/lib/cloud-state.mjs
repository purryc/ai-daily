import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

export const LANES = ['official','reviews','community','wild','research','patent','china','global'];
export const DIMENSIONS = ['attention','friction','feasibility','payment_intent'];
export const REPO = path.resolve(new URL('../..', import.meta.url).pathname);
export const sha = bytes => createHash('sha256').update(bytes).digest('hex');
export function privateRoot(value = process.env.AI_DAILY_PRIVATE_ROOT) {
  if (!value) throw new Error('Set AI_DAILY_PRIVATE_ROOT to persistent private storage outside the public repository');
  const root = path.resolve(value);
  if (root === REPO || root.startsWith(REPO + path.sep)) throw new Error('Private storage cannot be inside the public repository');
  return root;
}
export function localDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
}
export function completedWeek(now = new Date()) {
  const day = new Date(localDate(now)+'T12:00:00Z');
  const distance = (day.getUTCDay()+6)%7;
  day.setUTCDate(day.getUTCDate()-distance-7);
  return day.toISOString().slice(0,10);
}
export function monday(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || new Date(date+'T12:00:00Z').toISOString().slice(0,10)!==date || new Date(date+'T12:00:00Z').getUTCDay()!==1) throw new Error('weekStart must be a real Monday');
  return date;
}
export async function atomic(file, value) {
  await fs.mkdir(path.dirname(file),{recursive:true});
  const tmp = file+'.'+process.pid+'.tmp';
  await fs.writeFile(tmp,JSON.stringify(value,null,2)+'\n',{mode:0o600});
  await fs.rename(tmp,file);
}
export async function immutable(file, value) {
  await fs.mkdir(path.dirname(file),{recursive:true});
  const bytes=JSON.stringify(value,null,2)+'\n';
  try { await fs.writeFile(file,bytes,{flag:'wx',mode:0o600}); return true; }
  catch(e) { if(e.code!=='EEXIST')throw e; if(await fs.readFile(file,'utf8')!==bytes)throw new Error('Immutable record conflict: '+path.basename(file)); return false; }
}
const required = (o, fields, type) => { for(const k of fields) if(o[k]===undefined || o[k]===null || o[k]==='')throw new Error(type+' missing '+k); };
export function validateBatch(batch) {
  for(const key of ['queries','observations','decisions'])if(!Array.isArray(batch[key]))throw new Error('Ledger batch requires '+key);
  const qs=new Set(batch.queries.map(q=>q.query_id)), ids=new Set(batch.observations.map(o=>o.signal_id));
  for(const q of batch.queries) {
    required(q,['query_id','source_lane','platform','query','region','window','observed_at','access_status','panel_type','inspected_count','sampling_limit'],'query');
    if(!LANES.includes(q.source_lane)||!['fixed','discovery'].includes(q.panel_type))throw new Error('Invalid query lane/panel');
    if(!Number.isInteger(q.inspected_count)||q.inspected_count<0||!Number.isInteger(q.sampling_limit)||q.sampling_limit<q.inspected_count)throw new Error('Invalid inspected/sample counts');
  }
  for(const o of batch.observations) {
    required(o,['schema_version','signal_id','product_key','event_key','event_type','event_at','event_time_precision','first_seen_at','observed_at','research_cutoff','source_url','canonical_url','origin_group','query_id','source_lane','region','organization','signal_dimensions','evidence_label','claim','evidence_locator','verification_status','user_task','interaction_before','interaction_after','hardware_api_stack_delta','availability_stage','limitations','counterevidence','visual_provenance'],'observation');
    if(!Object.hasOwn(o,'published_at'))throw new Error('Observation must preserve unknown published_at as null');
    if(!LANES.includes(o.source_lane)||!qs.has(o.query_id)||!Array.isArray(o.signal_dimensions)||o.signal_dimensions.some(d=>!DIMENSIONS.includes(d)))throw new Error('Invalid observation lane/dimensions/query');
    if(!/^https?:\/\//.test(o.source_url)||!/^https?:\/\//.test(o.canonical_url))throw new Error('Invalid evidence URL');
    for(const k of ['first_seen_at','observed_at','research_cutoff'])if(!Number.isFinite(Date.parse(o[k]))||!/[Zz]|[+-]\d\d:\d\d$/.test(o[k]))throw new Error('Timestamp needs offset: '+k);
    if(Date.parse(o.first_seen_at)>Date.parse(o.observed_at))throw new Error('first_seen_at after observed_at');
    if(!['verified','reported','unverified'].includes(o.verification_status))throw new Error('Invalid verification status');
  }
  for(const d of batch.decisions) {
    required(d,['issue_date','signal_id','decision','reason','freshness_class'],'decision');
    if(!ids.has(d.signal_id)||!['selected','watch','rejected','duplicate','background','correction'].includes(d.decision))throw new Error('Invalid selection reference/decision');
  }
  for(const id of [...qs,...ids])if(!/^[A-Za-z0-9._-]+$/.test(id))throw new Error('Unsafe ledger ID');
  if(qs.size!==batch.queries.length||ids.size!==batch.observations.length)throw new Error('Duplicate batch IDs');
}
export async function ingest(root, batch) {
  root=privateRoot(root); validateBatch(batch);
  const lock=path.join(root,'ledger.lock');
  await fs.mkdir(root,{recursive:true});
  await fs.mkdir(lock).catch(e=>{if(e.code==='EEXIST')throw new Error('Ledger busy; inspect existing lock before retry');throw e;});
  try {
    // Preflight all conflicts before writing any record.
    const records=[...batch.queries.map(q=>['queries',q.query_id,q]),...batch.observations.map(o=>['observations',o.signal_id,o]),...batch.decisions.map(d=>['decisions',sha(JSON.stringify(d)),d])];
    for(const [kind,id,value] of records) {
      try { if(await fs.readFile(path.join(root,'signals',kind,id+'.json'),'utf8')!==JSON.stringify(value,null,2)+'\n')throw new Error('Immutable record conflict: '+id); }
      catch(e){if(e.code!=='ENOENT')throw e;}
    }
    for(const [kind,id,value] of records)await immutable(path.join(root,'signals',kind,id+'.json'),value);
    const files=await fs.readdir(path.join(root,'signals','observations')).catch(()=>[]);
    const observations=await Promise.all(files.map(f=>fs.readFile(path.join(root,'signals','observations',f),'utf8').then(JSON.parse)));
    const events=Object.create(null),products=Object.create(null);
    for(const o of observations){(events[o.event_key]??=[]).push(o.signal_id);(products[o.product_key]??=[]).push(o.signal_id);}
    await atomic(path.join(root,'signals','index.json'),{schema_version:1,events,products,observations:observations.length});
    return {queries:batch.queries.length,observations:batch.observations.length,decisions:batch.decisions.length};
  } finally {await fs.rmdir(lock);}
}
export async function loadSignals(root, ids) {
  root=privateRoot(root);
  return Promise.all(ids.map(async id=>{
    if(!/^[A-Za-z0-9._-]+$/.test(id))throw new Error('Unsafe signal ID');
    return JSON.parse(await fs.readFile(path.join(root,'signals','observations',id+'.json'),'utf8'));
  }));
}
export async function preflight(root) {
  root=privateRoot(root);
  const files={};
  const manifest=JSON.parse(await fs.readFile(path.join(root,'rules','manifest.json'),'utf8'));
  for(const record of manifest.files) {
    const bytes=await fs.readFile(path.join(root,'rules',record.file_name));
    if(bytes.length!==record.bytes||sha(bytes)!==record.sha256)throw new Error('Migration rule hash mismatch: '+record.file_name);
    files[record.file_name]={bytes:bytes.length,sha256:sha(bytes)};
  }
  for(const name of ['daily-method.md','weekly-method.md','collection-handbook.md','execution-prompt.md','HANDOFF.md'])if(!files[name])throw new Error('Missing required method '+name);
  return {privateRoot:root,timezone:'America/Toronto',files};
}
