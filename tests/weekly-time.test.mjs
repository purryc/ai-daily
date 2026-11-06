import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {batch,weekly,pair} from './fixtures/cloud-publisher.mjs';
import {ingest} from '../scripts/lib/cloud-state.mjs';
import {validateWeekly,weekWindow,buildWeekly} from '../scripts/lib/weekly.mjs';
test('weekly rejects NaN/invalid cutoff and malformed complete-week timestamps',()=>{
  for(const cutoff of ['Z','2026-02-30T10:00:00Z','2026-10-19T14:00:00','2026-10-19T25:00:00Z'])
    assert.throws(()=>weekWindow({...weekly,cutoff}),/timestamp|cutoff|date/i);
});
async function withEvidence(change,check) {
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'ai-weekly-time-'));
  try{const evidence=structuredClone(batch),input=structuredClone(weekly);change(evidence,input);await ingest(root,evidence);await check(input,root);}
  finally{await fs.rm(root,{recursive:true,force:true});}
}
test('a cutoff-late publication is rejected even with an earlier event date and a current-page disclosure',async()=>{
  await withEvidence((b,w)=>{
    b.observations[0].published_at='2026-10-19T14:00:01Z';w.sources[0].publishedAt=b.observations[0].published_at;
    w.sources[0].snapshotStatus='current-page-not-historical';w.sources[0].asOfCutoff=w.cutoff;w.sources[0].temporalNote=pair();
  },(w,root)=>assert.rejects(validateWeekly(w,root),/published.*cutoff/i));
});
test('post-cutoff verification of already public evidence needs an explicit public disclosure and preserves its actual times',async()=>{
  await withEvidence((b,w)=>{b.observations[0].observed_at='2026-10-19T14:30:00Z';},
    (w,root)=>assert.rejects(validateWeekly(w,root),/post-cutoff.*disclosure/i));
  await withEvidence((b,w)=>{
    b.observations[0].observed_at='2026-10-19T14:30:00Z';b.observations[0].research_cutoff='2026-10-19T14:10:00Z';
    w.sources[0].snapshotStatus='current-page-not-historical';w.sources[0].asOfCutoff=w.cutoff;
    w.sources[0].temporalNote=pair('原文发布于截止前，本次回读在截止后；当前页面不是历史快照。','Published before cutoff, reread afterward; the current page is not a historical snapshot.');
  },async(w,root)=>{
    assert.equal((await validateWeekly(w,root)).observations,1);
    const result=await buildWeekly({input:w,privateDir:root,output:path.join(root,'dry')});
    assert.match(await fs.readFile(path.join(result.target,'en/index.html'),'utf8'),/Current page reread after cutoff; not a historical snapshot/);
    assert.match(await fs.readFile(path.join(result.target,'sources.md'),'utf8'),/not a historical snapshot/);
  });
});
test('matrix-only late evidence is rejected rather than bypassing the highlight gate',async()=>{
  await withEvidence((b,w)=>{
    const late={...b.observations[0],signal_id:'late',source_url:'https://example.com/late',canonical_url:'https://example.com/late',published_at:'2026-10-19T15:00:00Z'};
    b.observations.push(late);w.sources.push({id:'S2',label:'Later source',url:late.source_url,signalId:'late',publishedAt:late.published_at});
    w.trends[0].matrix.feasibility.signalIds.push('late');
  },(w,root)=>assert.rejects(validateWeekly(w,root),/published.*cutoff/i));
});
test('a live metric observed after cutoff cannot borrow an old publication date',async()=>{
  await withEvidence((b,w)=>{
    b.observations[0].observed_at='2026-10-19T14:30:00Z';b.observations[0].metric={name:'current stars',value:123};
    w.sources[0].snapshotStatus='current-page-not-historical';w.sources[0].asOfCutoff=w.cutoff;w.sources[0].temporalNote=pair();
  },(w,root)=>assert.rejects(validateWeekly(w,root),/Post-cutoff measurement/));
});
