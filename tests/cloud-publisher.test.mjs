import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {LANES,DIMENSIONS,sha,ingest,preflight,privateRoot,REPO,completedWeek} from '../scripts/lib/cloud-state.mjs';
import {plan,main} from '../scripts/cloud-run.mjs';
import {validateDenseDaily} from '../scripts/lib/dense-policy.mjs';
import {validateWeekly,weekWindow,buildWeekly} from '../scripts/lib/weekly.mjs';
import {checkWeekly} from '../scripts/lib/weekly-qa.mjs';
import {digestTree,digestRelease,releasePlan,publicFiles} from '../scripts/lib/release.mjs';

const pair=(zh='测试说明：这是隔离测试资料，不是刊物。',en='TEST FIXTURE: isolated validation material, not a publication.')=>({zh,en});
export const batch={
 queries:[{query_id:'test-query',source_lane:'official',platform:'fixture',query:'test',region:'CA',window:{start:'2026-10-12',end:'2026-10-19'},observed_at:'2026-10-19T14:00:00Z',access_status:'accessible',panel_type:'fixed',inspected_count:1,sampling_limit:1}],
 observations:[{schema_version:1,signal_id:'test-signal',product_key:'test-product',event_key:'test-product:v1',event_type:'release',event_at:'2026-10-13',event_time_precision:'date',published_at:'2026-10-13',first_seen_at:'2026-10-13T14:00:00Z',observed_at:'2026-10-19T14:00:00Z',research_cutoff:'2026-10-19T14:00:00Z',source_url:'https://example.com/fixture',canonical_url:'https://example.com/fixture',origin_group:'test-origin',query_id:'test-query',source_lane:'official',region:'CA',organization:'test-org',signal_dimensions:['feasibility'],evidence_label:'developer surface',claim:'TEST FIXTURE',evidence_locator:'fixture paragraph',verification_status:'verified',user_task:'test',interaction_before:'test',interaction_after:'test',hardware_api_stack_delta:'test',availability_stage:'test',limitations:'test',counterevidence:[],visual_provenance:[],independence_status:'independent'}],
 decisions:[{issue_date:'2026-10-19',signal_id:'test-signal',decision:'selected',reason:'test only',freshness_class:'weekly-lookback'}]
};
export const weekly={
 weekStart:'2026-10-12',timezone:'America/Toronto',windowStart:'2026-10-12T00:00:00-04:00',windowEnd:'2026-10-19T00:00:00-04:00',cutoff:'2026-10-19T14:00:00Z',partialWeek:false,title:pair(),summary:pair(),baselineStatus:'establishing',coverageLimitations:pair(),watchlist:pair(),
 sources:[{id:'S1',label:'Test fixture',url:'https://example.com/fixture',publishedAt:'2026-10-13',signalId:'test-signal'}],
 laneScans:LANES.map(lane=>({lane,status:'incomplete',note:pair()})),
 highlights:[{id:'H1',title:pair(),signalIds:['test-signal'],pages:[{title:pair(),paragraphs:[pair()],sourceIds:['S1']}]}],
 trends:[{id:'T1',title:pair(),state:'new',classification:'emerging',confidence:'low',claimType:'interface-supply',signalIds:['test-signal'],pages:[{title:pair(),paragraphs:[pair()],sourceIds:['S1']}],...Object.fromEntries(['thisWeek','baseline','counterevidence','alternativeExplanation','confidenceReason','hciImpact','experiment','falsifiableWatch'].map(k=>[k,pair()])),matrix:Object.fromEntries(DIMENSIONS.map(d=>[d,{status:d==='feasibility'?'support':'unknown',signalIds:d==='feasibility'?['test-signal']:[],note:pair()}]))}]
};
test('Toronto full-week planning handles DST, first run, catch-up, and pilot isolation',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'ai-cloud-plan-'));
 try {
  assert.equal(completedWeek(new Date('2026-11-02T15:00:00Z')),'2026-10-26');
  assert.equal(completedWeek(new Date('2026-03-09T14:00:00Z')),'2026-03-02');
  const before=await plan({root,repo:root,now:new Date('2026-10-15T14:00:00Z')});assert.equal(before.weekly.due,false);assert.equal(before.weekly.key,'2026-10-12');
  await fs.mkdir(path.join(root,'weekly/2026-10-12/pilot'),{recursive:true});
  await fs.writeFile(path.join(root,'weekly/2026-10-12/pilot/manifest.json'),JSON.stringify({partial_week:true}));
  const first=await plan({root,repo:root,now:new Date('2026-10-19T14:00:00Z')});assert.equal(first.weekly.due,true);assert.equal(first.weekly.key,'2026-10-12');assert.equal(first.weekly.catchUp,false);
  const missed=await plan({root,repo:root,now:new Date('2026-10-20T14:00:00Z')});assert.equal(missed.weekly.catchUp,true);
  await fs.writeFile(path.join(root,'weekly/2026-10-12/manifest.json'),JSON.stringify({issue_type:'weekly',partial_week:false,week_start:'2026-10-12'}));
  assert.equal((await plan({root,repo:root,now:new Date('2026-10-20T14:00:00Z')})).weekly.due,false);
 }finally{await fs.rm(root,{recursive:true,force:true});}
});
test('private ledger is immutable, idempotent, conflicts before writes, and blocks public storage',async()=>{
 assert.throws(()=>privateRoot(path.join(REPO,'research')),/public repository/);
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'ai-cloud-ledger-'));
 try{
  await ingest(root,batch);const original=await fs.readFile(path.join(root,'signals/observations/test-signal.json'));
  await ingest(root,batch);assert.deepEqual(await fs.readFile(path.join(root,'signals/observations/test-signal.json')),original);
  const changed=structuredClone(batch);changed.observations[0].claim='changed';
  await assert.rejects(ingest(root,changed),/Immutable record conflict/);
  const index=JSON.parse(await fs.readFile(path.join(root,'signals/index.json'),'utf8'));assert.equal(index.observations,1);assert.deepEqual(index.events['test-product:v1'],['test-signal']);
  await fs.mkdir(path.join(root,'ledger.lock'));await assert.rejects(ingest(root,batch),/busy/);
 }finally{await fs.rm(root,{recursive:true,force:true});}
});
test('rule preflight verifies bytes and hashes, never treats missing files as ready',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'ai-cloud-rules-'));
 try{
  await assert.rejects(preflight(root),/ENOENT/);
  await fs.mkdir(path.join(root,'rules'));
  const files=[];for(const name of ['daily-method.md','weekly-method.md','collection-handbook.md','execution-prompt.md','HANDOFF.md']) {
   const bytes=Buffer.from('Synthetic preflight test only.');await fs.writeFile(path.join(root,'rules',name),bytes);files.push({file_name:name,bytes:bytes.length,sha256:sha(bytes)});
  }
  await fs.writeFile(path.join(root,'rules/manifest.json'),JSON.stringify({files}));
  assert.equal((await preflight(root)).timezone,'America/Toronto');
  await fs.writeFile(path.join(root,'rules/daily-method.md'),'changed');await assert.rejects(preflight(root),/hash mismatch/);
 }finally{await fs.rm(root,{recursive:true,force:true});}
});
test('dense daily gate refuses concise existing policy and mismatched per-product parity',()=>{
 assert.throws(()=>validateDenseDaily({candidates:[],laneScans:[]}),/6000/);
 const d=Object.fromEntries(['productName','productType','interactionFlow','specsOrStack','useCases','painPointsSolved','newTech','availability','limitsOrUnknowns','productVerdict'].map(k=>[k,'实'.repeat(120)]));
 const en=Object.fromEntries(Object.keys(d).map(k=>[k,'word '.repeat(90)]));
 const input={candidates:Array.from({length:5},(_,i)=>({id:'test-'+i,dossier:{zh:d,en},sources:Array.from({length:3},(_,j)=>({url:'https://example.com/'+i+'/'+j})),visuals:[0,1].map(j=>({path:'assets/test-'+i+'-'+j+'.png',sourceUrl:'https://example.com/'+i}))})),laneScans:LANES.map(lane=>({lane,zh:'字'.repeat(180),en:'word '.repeat(140)}))};
 assert.equal(validateDenseDaily(input).zh,6000);
 input.candidates[0].dossier.en={...en,availability:''};assert.throws(()=>validateDenseDaily(input),/information units/);
});
test('weekly complete windows preserve Toronto DST and refuse partial pilots',()=>{
 weekWindow({...weekly,weekStart:'2026-10-26',windowStart:'2026-10-26T00:00:00-04:00',windowEnd:'2026-11-02T00:00:00-05:00',cutoff:'2026-11-02T15:00:00Z'});
 assert.throws(()=>weekWindow({...weekly,partialWeek:true}),/partial-week/);
 assert.throws(()=>weekWindow({...weekly,windowEnd:'2026-10-19T00:00:00Z'}),/Toronto/);
});
test('weekly evidence requires shared originals and downgrades unsupported trends',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'ai-cloud-weekly-'));
 try{
  await ingest(root,batch);assert.equal((await validateWeekly(weekly,root)).observations,1);
  const invalid=structuredClone(weekly);invalid.trends[0].classification='trend';await assert.rejects(validateWeekly(invalid,root),/threshold/);
  invalid.trends[0].classification='emerging';invalid.trends[0].matrix.attention={status:'support',signalIds:['test-signal'],note:pair()};await assert.rejects(validateWeekly(invalid,root),/dimension mismatch/);
  const wrong=structuredClone(weekly);wrong.sources[0].url='https://example.com/not-the-original';await assert.rejects(validateWeekly(wrong,root),/shared evidence/);
 }finally{await fs.rm(root,{recursive:true,force:true});}
});
test('failed weekly records its own outcome and releases its lock without touching daily state',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'ai-cloud-run-state-')),prior=process.env.AI_DAILY_PRIVATE_ROOT;
 try{
  process.env.AI_DAILY_PRIVATE_ROOT=root;await fs.mkdir(path.join(root,'rules'));await fs.mkdir(path.join(root,'runs'));
  const bytes=Buffer.from('Isolated test rule, not the migration package.');
  const names=['daily-method.md','weekly-method.md','collection-handbook.md','execution-prompt.md','HANDOFF.md'];
  for(const name of names)await fs.writeFile(path.join(root,'rules',name),bytes);
  await fs.writeFile(path.join(root,'rules/manifest.json'),JSON.stringify({files:names.map(file_name=>({file_name,bytes:bytes.length,sha256:sha(bytes)}))}));
  const daily='{"kind":"daily","status":"failed","error":"Independent test state"}';
  await fs.writeFile(path.join(root,'runs/daily-2026-10-19.json'),daily);
  const file=path.join(root,'input.json');await fs.writeFile(file,JSON.stringify({...weekly,partialWeek:true}));
  await assert.rejects(main(['build','--kind','weekly','--input',file,'--output',path.join(root,'dry')]),/partial-week/);
  assert.equal(await fs.readFile(path.join(root,'runs/daily-2026-10-19.json'),'utf8'),daily);
  assert.equal(JSON.parse(await fs.readFile(path.join(root,'runs/weekly-2026-10-12.json'),'utf8')).status,'failed');
  await assert.rejects(fs.access(path.join(root,'runs/weekly-2026-10-12.lock')),/ENOENT/);
 }finally{if(prior===undefined)delete process.env.AI_DAILY_PRIVATE_ROOT;else process.env.AI_DAILY_PRIVATE_ROOT=prior;await fs.rm(root,{recursive:true,force:true});}
});
test('independent weekly dry build preserves published archive and passes real bilingual PDF/layout/navigation checks',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'ai-cloud-weekly-browser-'));
 const historical=await fs.readFile(path.join(REPO,'weekly/2026-10-12/pilot/manifest.json'));
 const daily=await fs.readFile(path.join(REPO,'2026-10-14/zh/index.html'));
 try{
  await ingest(root,batch);const output=path.join(root,'dry-output');
  const result=await buildWeekly({input:weekly,privateDir:root,output});assert.equal(result.counts.events,1);
  const index=JSON.parse(await fs.readFile(path.join(output,'weekly/manifest.json'),'utf8'));
  assert.equal(index.filter(e=>e.type==='weekly').length,1);assert.equal(index.filter(e=>e.type==='weekly-pilot').length,1);
  const qa=await checkWeekly({root:output,weekStart:weekly.weekStart,pdf:true});assert.equal(qa.counts.zh,qa.counts.en);assert.equal(qa.results.length,6);
  const inputFile=path.join(root,'reviewed.json'),bytes=JSON.stringify(weekly);await fs.writeFile(inputFile,bytes);
  const receipt={kind:'weekly',key:weekly.weekStart,status:'validated-draft',result,output,inputSha256:sha(bytes),artifactSha256:await digestTree(result.target),releaseSha256:await digestRelease('weekly',weekly.weekStart,output)};
  const release=await releasePlan(receipt,inputFile,path.join(root,'public-site'));
  assert.deepEqual(release.files,['weekly/2026-10-12','weekly/index.html','weekly/manifest.json']);
  assert.ok(!release.files.some(f=>f==='index.html'||f==='data/issues.json'||f.startsWith('research/')));
  await fs.appendFile(path.join(output,'weekly/index.html'),'changed');
  await assert.rejects(releasePlan(receipt,inputFile,path.join(root,'public-site')),/navigation\/data\/styles changed/);
  await assert.rejects(fs.access(path.join(output,'index.html')),/ENOENT/);
  assert.deepEqual(await fs.readFile(path.join(REPO,'weekly/2026-10-12/pilot/manifest.json')),historical);
  assert.deepEqual(await fs.readFile(path.join(REPO,'2026-10-14/zh/index.html')),daily);
 }finally{await fs.rm(root,{recursive:true,force:true});}
});
