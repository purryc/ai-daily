import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {REPO,privateRoot,preflight,localDate,completedWeek,atomic,loadSignals,sha,monday} from './lib/cloud-state.mjs';
import {generateIssue} from './create-issue.mjs';
import {normalizeUrl} from './lib/issue-policy.mjs';
import {validateDenseDaily} from './lib/dense-policy.mjs';
import {buildWeekly} from './lib/weekly.mjs';
import {checkWeekly} from './lib/weekly-qa.mjs';
import {digestTree,digestRelease,rejectPrivateFields} from './lib/release.mjs';
import {buildSlidevSource} from './lib/slidev-source.mjs';

export async function plan({root,now=new Date(),repo=REPO}) {
  root=privateRoot(root);
  const daily=localDate(now),completed=completedWeek(now),weekly=completed<'2026-10-12'?'2026-10-12':completed;
  const published=async(kind,key)=>{
    const file=kind==='daily'?path.join(repo,key,'manifest.json'):path.join(repo,'weekly',key,'manifest.json');
    try {const m=JSON.parse(await fs.readFile(file,'utf8'));return kind==='daily'?m.date===key:m.issue_type==='weekly'&&m.partial_week===false&&m.week_start===key;}
    catch(e){if(e.code==='ENOENT')return false;throw e;}
  };
  const dailyPublished=await published('daily',daily),weeklyPublished=await published('weekly',weekly);
  const isMonday=new Date(daily+'T12:00:00Z').getUTCDay()===1;
  return {timezone:'America/Toronto',researchCutoff:now.toISOString(),daily:{key:daily,due:!dailyPublished,published:dailyPublished},weekly:{key:weekly,due:completed>='2026-10-12'&&!weeklyPublished,published:weeklyPublished,catchUp:!isMonday,independent:true,firstEligibleRun:'2026-10-19'},schedule:'External owner only: daily and Monday weekly at 10:00 America/Toronto'};
}
const child=(file,env)=>new Promise((resolve,reject)=>{
  const p=spawn(process.execPath,[path.join(REPO,'scripts',file)],{cwd:REPO,env:{...process.env,...env},stdio:'inherit'});
  p.on('error',reject);p.on('exit',code=>code===0?resolve():reject(new Error(file+' failed with exit '+code)));
});
export async function stageDaily({input,output,assetsDir,privateDir}) {
  validateDenseDaily(input);
  if(input.cloudEditorialContract!=='dense-v1')throw new Error('Cloud daily input must explicitly select dense-v1');
  const cutoff=Date.parse(input.cutoff);
  if(!Number.isFinite(cutoff)||input.primaryWindowStart!==new Date(cutoff-86400000).toISOString())throw new Error('Daily primary window must be exactly the preceding 24 hours');
  for(const scan of input.laneScans??[]) {
    if(!['scanned','blocked','incomplete'].includes(scan.status)||scan.status!=='incomplete'&&!scan.queryIds?.length)throw new Error('Daily scan needs an actual access status and query references');
    for(const id of scan.queryIds??[]) {
      if(!/^[A-Za-z0-9._-]+$/.test(id))throw new Error('Unsafe query ID');
      const query=JSON.parse(await fs.readFile(path.join(privateDir,'signals/queries',id+'.json'),'utf8'));
      if(query.source_lane!==scan.lane||scan.status==='blocked'&&query.access_status!=='blocked')throw new Error('Daily scan/query access mismatch');
    }
  }
  for(const t of input.candidates??[]) {
    if(!t.signalIds?.length)throw new Error('Daily candidate missing shared signal references');
    const observations=await loadSignals(privateDir,t.signalIds);
    for(const o of observations) {
      if(o.product_key!==t.event.productKey||o.event_at.slice(0,10)!==t.event.occurredAt.slice(0,10)||o.verification_status!=='verified'||o.research_cutoff!==input.cutoff)throw new Error('Daily candidate/shared evidence mismatch');
    }
    for(const source of t.sources??[])if(!observations.some(o=>[o.source_url,o.canonical_url].some(u=>normalizeUrl(u)===normalizeUrl(source.url))&&(source.publishedAt??null)===o.published_at))throw new Error('Daily citation lacks a matching shared original observation');
    if(!['primary-24h','delayed-72h','weekly-lookback','date-boundary-uncertain'].includes(t.freshnessClass))throw new Error('Daily freshness label missing');
    const event=Date.parse(t.event.occurredAt);
    if(t.event.occurredAt.length===10&&t.freshnessClass!=='date-boundary-uncertain')throw new Error('Date-only event needs explicit boundary uncertainty');
    if(t.event.occurredAt.length>10&&(event>=cutoff||event<cutoff-7*86400000))throw new Error('Daily event outside allowed discovery window');
    if(t.freshnessClass==='primary-24h'&&event<cutoff-86400000)throw new Error('Backfill mislabeled as 24h news');
    if(t.freshnessClass==='delayed-72h'&&event<cutoff-3*86400000)throw new Error('Weekly lookback mislabeled as 72h news');
  }
  output=path.resolve(output);
  if(output===REPO||output.startsWith(REPO+path.sep))throw new Error('Daily dry output must be outside public checkout');
  await fs.mkdir(output,{recursive:false});
  await fs.mkdir(path.join(output,'data/editions'),{recursive:true});
  // Reuse immutable archive bytes; never duplicate the historical PDFs/assets.
  await fs.symlink(path.join(REPO,'data/issues.json'),path.join(output,'data/issues.json'));
  for(const dir of ['editions','coverage']) {
    const src=path.join(REPO,'data',dir),dest=path.join(output,'data',dir);
    await fs.cp(src,dest,{recursive:true});
  }
  await fs.cp(path.join(REPO,'assets'),path.join(output,'assets'),{recursive:true});
  await fs.mkdir(path.join(output,input.date),{recursive:true});
  if(assetsDir)await fs.symlink(path.resolve(assetsDir),path.join(output,input.date,'assets'));
  const result=await generateIssue({root:output,input});
  validateDenseDaily(result.issue);
  const env={AI_DAILY_ROOT:output,AI_DAILY_DATES:input.date,AI_DAILY_CHROMIUM_PATH:process.env.AI_DAILY_CHROMIUM_PATH??'/usr/bin/chromium'};
  await child('render-site.mjs',env);await child('export-pdfs.mjs',env);await child('check-site.mjs',env);
  const slidev=await buildSlidevSource({issue:result.issue,output,assetsDir,sources:await fs.readFile(path.join(output,input.date,'sources.md'),'utf8')});
  return {target:path.join(output,input.date),slidev,counts:validateDenseDaily(result.issue),excluded:result.excluded};
}
export async function main(args=process.argv.slice(2)) {
  const command=args[0],arg=k=>{const i=args.indexOf(k);if(i<0||!args[i+1])throw new Error('Missing '+k);return args[i+1];};
  const root=privateRoot();
  if(command==='preflight') {console.log(JSON.stringify(await preflight(root)));return;}
  if(command==='plan') {console.log(JSON.stringify(await plan({root,now:args.includes('--now')?new Date(arg('--now')):new Date()})));return;}
  if(command!=='build')throw new Error('Usage: cloud-run preflight | plan | build --kind daily|weekly --input FILE --output NEW_DRY_DIRECTORY [--assets DIR]');
  await preflight(root);
  const kind=arg('--kind');if(!['daily','weekly'].includes(kind))throw new Error('Invalid run kind');
  const bytes=await fs.readFile(arg('--input')),input=JSON.parse(bytes);
  rejectPrivateFields(input);
  const key=kind==='daily'?input.date:monday(input.weekStart);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(key))throw new Error('Invalid run key');
  const destination=path.resolve(arg('--output'));
  const lock=path.join(root,'runs',kind+'-'+key+'.lock');
  await fs.mkdir(path.dirname(lock),{recursive:true});
  await fs.mkdir(lock).catch(e=>{if(e.code==='EEXIST')throw new Error('Run already active; inspect lock before retry');throw e;});
  const receipt=path.join(root,'runs',kind+'-'+key+'.json');
  try {
    try {
      const prior=JSON.parse(await fs.readFile(receipt,'utf8'));
      if(prior.status==='validated-draft') {
        if(prior.inputSha256!==sha(bytes))throw new Error('Existing reviewed draft has different input; resolve it explicitly before replacing');
        await fs.access(prior.result.target);
        if(await digestTree(prior.result.target)!==prior.artifactSha256)throw new Error('Prior validated artifact changed; inspect it before retry');
        if(await digestRelease(kind,key,prior.output)!==prior.releaseSha256)throw new Error('Prior navigation/data/styles changed; inspect it before retry');
        console.log(JSON.stringify({...prior,reused:true}));return;
      }
    }catch(e){if(e.code!=='ENOENT')throw e;}
    const manifest=kind==='daily'?path.join(REPO,key,'manifest.json'):path.join(REPO,'weekly',key,'manifest.json');
    try {
      const published=JSON.parse(await fs.readFile(manifest,'utf8'));
      if(kind==='daily'||published.issue_type==='weekly'&&published.partial_week===false)throw new Error('Already published; historical edition is immutable');
    }catch(e){if(e.code!=='ENOENT')throw e;}
    const options={input,output:destination,privateDir:root,assetsDir:args.includes('--assets')?arg('--assets'):undefined};
    const result=kind==='daily'?await stageDaily(options):await buildWeekly(options);
    if(kind==='weekly')result.qa=await checkWeekly({root:destination,weekStart:key,pdf:true});
    await atomic(receipt,{kind,key,status:'validated-draft',inputSha256:sha(bytes),artifactSha256:await digestTree(result.target),releaseSha256:await digestRelease(kind,key,destination),output:destination,completedAt:new Date().toISOString(),result,publication:'not pushed or deployed'});
    console.log(JSON.stringify({kind,key,status:'validated-draft',receipt,...result}));
  }catch(error) {
    let prior;
    try {prior=JSON.parse(await fs.readFile(receipt,'utf8'));}
    catch(e){if(e.code!=='ENOENT')throw e;}
    await atomic(receipt,prior?.status==='validated-draft'?{...prior,lastAttemptError:error.message,lastAttemptAt:new Date().toISOString()}:{kind,key,status:'failed',failedAt:new Date().toISOString(),error:error.message});
    throw error;
  }finally{await fs.rmdir(lock);}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await main();
