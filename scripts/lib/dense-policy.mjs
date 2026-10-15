import {LANES} from './cloud-state.mjs';
import {normalizeUrl} from './issue-policy.mjs';
const fields=['productName','productType','interactionFlow','specsOrStack','useCases','painPointsSolved','newTech','availability','limitsOrUnknowns','productVerdict'];
const chinese=s=>(s.match(/[\u3400-\u9fff]/g)??[]).length;
const english=s=>(s.match(/\b[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*\b/gu)??[]).length;
export function validateDenseDaily(input) {
  const topics=input.topics??input.candidates??[];
  const errors=[],counts={zh:0,en:0,products:topics.length,sources:new Set(topics.flatMap(t=>(t.sources??[]).map(s=>normalizeUrl(s.url)))).size,visuals:new Set(topics.flatMap(t=>(t.visuals??[]).map(v=>v.path+'|'+v.sourceUrl))).size};
  if(topics.length<5||topics.length>8)errors.push('daily needs 5–8 verified product dossiers');
  if(counts.sources<12||counts.sources>20)errors.push('daily needs 12–20 cited source URLs');
  if(counts.visuals<6)errors.push('daily needs at least six traceable visuals');
  for(const t of topics) {
    if(!t.visuals?.length)errors.push(t.id+' missing product visual');
    for(const lang of ['zh','en']) {
      const d=t.dossier?.[lang];
      if(!d||fields.some(k=>!d[k]?.trim()))errors.push(t.id+' missing '+lang+' dossier information units');
      const body=fields.map(k=>d?.[k]??'').join(' ');
      const count=lang==='zh'?chinese(body):english(body);
      counts[lang]+=count;
      if(count<(lang==='zh'?520:380))errors.push(t.id+' below '+lang+' per-product density');
    }
  }
  if(counts.zh<6000)errors.push('Chinese product body below 6000 dense characters');
  if(counts.en<4500)errors.push('English product body below 4500 words');
  const scans=input.laneScans??[];
  if(new Set(scans.map(s=>s.lane)).size!==8||scans.some(s=>!LANES.includes(s.lane)))errors.push('daily needs eight actual scan/access records');
  for(const s of scans)if(chinese(s.zh??'')<180||english(s.en??'')<140)errors.push(s.lane+' below bilingual scan density');
  if(errors.length)throw new Error('Dense daily editorial gate failed: '+JSON.stringify({counts,errors}));
  return counts;
}
