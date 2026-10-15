import fs from 'node:fs/promises';
import path from 'node:path';
import {DIMENSIONS,LANES,REPO,monday,localDate,loadSignals,sha} from './cloud-state.mjs';
import {writeWeeklyIndex} from './weekly-index.mjs';
const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const textPair=(o,label)=>{if(!o?.zh?.trim()||!o?.en?.trim())throw new Error('Missing bilingual '+label);};
const url=u=>{if(!/^https?:\/\//.test(u))throw new Error('Unsafe source URL');return esc(u);};
export function weekWindow(input) {
  monday(input.weekStart);
  const end=new Date(input.weekStart+'T12:00:00Z');end.setUTCDate(end.getUTCDate()+7);
  const endDate=end.toISOString().slice(0,10);
  const midnight=t=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).format(new Date(t))==='00:00:00';
  if(input.timezone!=='America/Toronto'||localDate(new Date(input.windowStart))!==input.weekStart||localDate(new Date(input.windowEnd))!==endDate||!midnight(input.windowStart)||!midnight(input.windowEnd))throw new Error('Weekly window must be the complete Toronto Monday-to-Monday week');
  if(!/[Zz]|[+-]\d\d:\d\d$/.test(input.cutoff)||Date.parse(input.cutoff)<Date.parse(input.windowEnd))throw new Error('Weekly cutoff precedes completed week');
  if(input.partialWeek!==false)throw new Error('Formal weekly cannot be a partial-week pilot');
}
function validatePages(pages, label) {
  if(!Array.isArray(pages)||!pages.length)throw new Error('Missing explicit pages: '+label);
  for(const page of pages) {
    textPair(page.title,'page title');
    if(!Array.isArray(page.paragraphs)||!page.paragraphs.length)throw new Error('Page needs substantive bilingual paragraphs');
    for(const p of page.paragraphs)textPair(p,'paragraph');
    if(!Array.isArray(page.sourceIds)||!page.sourceIds.length)throw new Error('Page needs source IDs');
    for(const v of page.visuals??[]) {
      textPair(v.caption,'visual caption');textPair(v.alt,'visual alt');
      if(!/^assets\/[a-zA-Z0-9_./-]+$/.test(v.path)||v.path.split('/').includes('..'))throw new Error('Unsafe visual path');
      url(v.sourceUrl);if(!v.kind||!v.capturedAt)throw new Error('Visual provenance incomplete');
    }
  }
}
export async function validateWeekly(input, privateDir) {
  weekWindow(input); textPair(input.title,'title');textPair(input.summary,'summary');
  if(!['establishing','comparable'].includes(input.baselineStatus))throw new Error('Missing baseline status');
  if(!Array.isArray(input.highlights)||!input.highlights.length||!Array.isArray(input.trends)||!input.trends.length)throw new Error('Weekly needs independent highlights and trend investigations');
  if(!Array.isArray(input.sources)||!input.sources.length)throw new Error('Missing reviewed sources');
  if(!Array.isArray(input.laneScans)||new Set(input.laneScans.map(s=>s.lane)).size!==8||input.laneScans.some(s=>!LANES.includes(s.lane)))throw new Error('Weekly needs all eight actual scan/access statuses');
  for(const s of input.laneScans){
    textPair(s.note,'lane note');if(!['scanned','blocked','incomplete'].includes(s.status))throw new Error('Invalid lane scan status');
    if(s.status!=='incomplete'&&!s.queryIds?.length)throw new Error('Completed/blocked scan needs actual query IDs');
    for(const id of s.queryIds??[]) {
      if(!/^[A-Za-z0-9._-]+$/.test(id))throw new Error('Unsafe query ID');
      const query=JSON.parse(await fs.readFile(path.join(privateDir,'signals/queries',id+'.json'),'utf8'));
      if(query.source_lane!==s.lane||s.status==='blocked'&&query.access_status!=='blocked')throw new Error('Lane/query access mismatch');
    }
  }
  textPair(input.coverageLimitations,'coverage limitations');textPair(input.watchlist,'watchlist');
  const sourceIds=new Set(input.sources.map(s=>s.id));
  if(sourceIds.size!==input.sources.length)throw new Error('Duplicate source ID');
  for(const s of input.sources){url(s.url);if(!s.label||!s.signalId)throw new Error('Source needs label and shared signal ID');}
  const signals=await loadSignals(privateDir,[...new Set(input.sources.map(s=>s.signalId))]);
  const byId=new Map(signals.map(s=>[s.signal_id,s]));
  for(const s of input.sources) {
    const observation=byId.get(s.signalId);
    if(!['verified','reported'].includes(observation.verification_status)||![observation.source_url,observation.canonical_url].includes(s.url)||(s.publishedAt??null)!==observation.published_at)throw new Error('Source does not match reviewed shared evidence: '+s.id);
  }
  const selectedEvents=new Set();
  for(const item of input.highlights) {
    textPair(item.title,'highlight title');validatePages(item.pages,'highlight');
    if(!item.signalIds?.length)throw new Error('Highlight needs shared signal IDs');
    for(const id of item.signalIds) {
      const s=byId.get(id); if(!s)throw new Error('Unknown highlight signal '+id);
      const date=s.event_at.length===10?s.event_at:localDate(new Date(s.event_at));
      if(date<input.weekStart||date>=localDate(new Date(input.windowEnd)))throw new Error('Highlight event outside covered week');
    }
    const keys=[...new Set(item.signalIds.map(id=>byId.get(id).event_key))];
    for(const key of keys){if(selectedEvents.has(key))throw new Error('Duplicate weekly event');selectedEvents.add(key);}
  }
  const states=['new','strengthening','continuing','weakening','conflicted','withdrawn'];
  for(const t of input.trends) {
    if(!t.id||!states.includes(t.state)||!['trend','emerging'].includes(t.classification)||!['low','moderate','high'].includes(t.confidence))throw new Error('Invalid trend identity/state/classification/confidence');
    textPair(t.title,'trend title');validatePages(t.pages,'trend');
    for(const key of ['thisWeek','baseline','counterevidence','alternativeExplanation','confidenceReason','hciImpact','experiment','falsifiableWatch'])textPair(t[key],key);
    for(const d of DIMENSIONS) {
      const cell=t.matrix?.[d];
      if(!cell||!['support','contradiction','unknown'].includes(cell.status)||!Array.isArray(cell.signalIds))throw new Error('Incomplete four-dimension evidence matrix');
      textPair(cell.note,'matrix note');
      if(cell.status==='unknown'&&cell.signalIds.length)throw new Error('Unknown matrix cell cannot claim evidence');
      if(cell.status!=='unknown'&&!cell.signalIds.length)throw new Error('Known matrix cell needs signal IDs');
      for(const id of cell.signalIds)if(!byId.has(id)||!byId.get(id).signal_dimensions.includes(d))throw new Error('Matrix evidence dimension mismatch');
    }
    const rows=(t.signalIds??[]).map(id=>{if(!byId.has(id))throw new Error('Unknown trend signal');return byId.get(id);});
    const set=k=>new Set(rows.map(s=>s[k])).size;
    if(t.classification==='trend'&&(rows.some(s=>s.independence_status!=='independent')||set('event_key')<3||set('organization')<2||new Set(rows.map(s=>s.source_lane).filter(l=>!['china','global'].includes(l))).size<2||set('event_at')<2))throw new Error('Trend does not meet independent event/organization/class/time threshold; label emerging');
    if(!['interface-supply','demand-growth','commercial-opportunity'].includes(t.claimType))throw new Error('Missing trend claim type');
    if(t.claimType!=='interface-supply'&&!t.behavioralValidationReviewed)throw new Error('Demand/commercial claim needs separately reviewed behavioral validation');
    if(t.claimType==='commercial-opportunity'&&(t.matrix.payment_intent.status!=='support'||!t.paymentValidationReviewed))throw new Error('Commercial claim needs reviewed payment validation');
  }
  const pages=[...input.highlights,...input.trends].flatMap(i=>i.pages);
  for(const p of pages)for(const id of p.sourceIds)if(!sourceIds.has(id))throw new Error('Unknown page source ID');
  const ids=[...input.highlights,...input.trends].map(i=>i.id);
  if(ids.some(id=>!id||!/^[a-zA-Z0-9_-]+$/.test(id))||new Set(ids).size!==ids.length)throw new Error('Unsafe or duplicate chapter IDs');
  return {events:selectedEvents.size,observations:signals.length,originGroups:new Set(signals.map(s=>s.origin_group)).size,baselineStatus:input.baselineStatus};
}
function makeSlides(input, lang) {
  const sources=new Map(input.sources.map(s=>[s.id,s]));
  const slides=[];
  const add=(id,title,body,sourceIds=[],kicker='AI Product Weekly')=>slides.push({id,title,body,sourceIds,kicker});
  const p=v=>'<p>'+esc(v[lang])+'</p>';
  add('cover',input.title[lang],'<p class="lead">'+esc(input.summary[lang])+'</p>'+p(input.coverageLimitations));
  add('contents',lang==='zh'?'本周亮点与趋势调查':'Highlights and trend investigations','<div class="toc-grid">'+[...input.highlights,...input.trends].map(i=>'<a class="toc-item" href="#'+esc(i.id)+'-1">'+esc(i.title[lang])+'</a>').join('')+'</div>');
  for(const [kind,items] of [['Highlights',input.highlights],['Trend investigation',input.trends]])for(const item of items) {
    item.pages.forEach((page,i)=>add(item.id+'-'+(i+1),page.title[lang],page.paragraphs.map(p).join('')+(page.visuals??[]).map(v=>'<figure><img src="../'+esc(v.path)+'" alt="'+esc(v.alt[lang])+'"><figcaption>'+esc(v.caption[lang])+' · <a href="'+url(v.sourceUrl)+'">'+esc(v.kind)+'</a></figcaption></figure>').join(''),page.sourceIds,kind));
    if(kind==='Trend investigation') {
      add(item.id+'-matrix',item.title[lang],'<div class="matrix">'+DIMENSIONS.map(d=>'<div class="cell"><strong>'+esc(d)+'</strong><span>'+esc(item.matrix[d].status)+' · '+esc(item.matrix[d].signalIds.join(', '))+'</span><span>'+esc(item.matrix[d].note[lang])+'</span></div>').join('')+'</div>','',item.classification+' · '+item.state);
      const fields=[['This week','thisWeek'],['Baseline','baseline'],['Counterevidence','counterevidence'],['Alternative explanation','alternativeExplanation'],['Confidence','confidenceReason'],['HCI impact','hciImpact'],['Experiment','experiment'],['Next falsifiable watch','falsifiableWatch']];
      for(let i=0;i<fields.length;i+=2)add(item.id+'-analysis-'+i,item.title[lang],fields.slice(i,i+2).map(([label,key])=>'<h3>'+esc(label)+'</h3>'+p(item[key])).join(''),[],item.classification+' · '+item.state);
    }
  }
  for(let i=0;i<8;i+=4)add('radar-'+i,lang==='zh'?'八线扫描与覆盖缺口':'Source radar and coverage gaps',input.laneScans.slice(i,i+4).map(s=>'<h3>'+esc(s.lane)+' · '+esc(s.status)+'</h3>'+p(s.note)).join(''));
  add('watchlist',lang==='zh'?'下周可证伪观察':'Next week’s falsifiable watch',p(input.watchlist)+p(input.coverageLimitations));
  for(let i=0;i<input.sources.length;i+=12)add('sources-'+i,lang==='zh'?'来源索引':'Source index','<div class="source-list">'+input.sources.slice(i,i+12).map(s=>'<p><a href="'+url(s.url)+'">'+esc(s.id)+' · '+esc(s.label)+'</a> · '+esc(s.publishedAt??'date not stated')+'</p>').join('')+'</div>');
  if(slides.length>50)throw new Error('Weekly exceeds 50 pages; edit explicit pages');
  return slides.map((s,i)=>'<section class="slide'+(i===0?' active':'')+'" id="'+esc(s.id)+'"><p class="eyebrow">'+esc(s.kicker)+'</p><h2>'+esc(s.title)+'</h2><div class="content">'+s.body+'</div><footer class="footer"><div class="source-links">'+(Array.isArray(s.sourceIds)?s.sourceIds:[]).map(id=>'<a href="'+url(sources.get(id).url)+'">'+esc(id)+'</a>').join(' · ')+'</div><span class="page-number">'+(i+1)+' / '+slides.length+'</span></footer></section>').join('');
}
export async function buildWeekly({input,privateDir,output,assetsDir}) {
  const counts=await validateWeekly(input,privateDir);
  output=path.resolve(output);
  if(output===REPO||output.startsWith(REPO+path.sep))throw new Error('Weekly dry output must be outside public checkout');
  await fs.mkdir(output,{recursive:false});
  const target=path.join(output,'weekly',input.weekStart);
  await fs.mkdir(path.join(target,'assets'),{recursive:true});
  const css=await fs.readFile(path.join(REPO,'weekly/assets/pilot.css'),'utf8');
  const js=await fs.readFile(path.join(REPO,'weekly/assets/pilot.js'),'utf8');
  await fs.writeFile(path.join(target,'assets/weekly.css'),css+'\n.slide figure{display:flex;gap:1cqw;align-items:center;margin:1cqw 0}.slide figure img{max-width:45%;max-height:15cqw;object-fit:contain;background:white}.slide figcaption{font-size:1cqw;line-height:1.5}@media(max-width:700px){.slide figure{display:block}.slide figure img{max-width:100%;max-height:280px}.slide figcaption{font-size:12px}}');
  await fs.writeFile(path.join(target,'assets/weekly.js'),js);
  for(const page of [...input.highlights,...input.trends].flatMap(i=>i.pages))for(const v of page.visuals??[]) {
    if(!assetsDir)throw new Error('Missing reviewed asset directory');
    const dest=path.join(target,v.path);
    await fs.mkdir(path.dirname(dest),{recursive:true});await fs.copyFile(path.join(assetsDir,v.path.slice(7)),dest);
  }
  for(const lang of ['zh','en']) {
    const title=input.title[lang],other=lang==='zh'?'en':'zh';
    const html='<!doctype html><html lang="'+(lang==='zh'?'zh-CN':'en')+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+'</title><link rel="stylesheet" href="../assets/weekly.css"></head><body><main class="shell"><nav class="topbar"><a class="brand" href="/ai-daily/weekly/">AI PRODUCT WEEKLY</a><span class="badge">'+esc(input.weekStart)+'</span><div class="links"><a href="#contents">Contents</a><a href="../'+other+'/">'+(lang==='zh'?'English':'中文')+'</a><a href="../sources.md">Sources</a><a href="/ai-daily/">Daily</a></div></nav><div class="deck">'+makeSlides(input,lang)+'</div><div class="controls"><button data-prev>Previous</button><output data-counter></output><div class="progress"><i></i></div><button data-next>Next</button></div></main><script src="../assets/weekly.js"></script></body></html>';
    await fs.mkdir(path.join(target,lang));await fs.writeFile(path.join(target,lang,'index.html'),html);
  }
  await fs.writeFile(path.join(target,'index.html'),'<!doctype html><meta charset="utf-8"><a href="zh/">中文</a> · <a href="en/">English</a>');
  await fs.writeFile(path.join(target,'sources.md'),'# Reviewed weekly sources\n\n'+input.sources.map(s=>'- '+s.id+' ['+s.label+']('+s.url+') · '+s.signalId).join('\n')+'\n');
  await fs.writeFile(path.join(target,'manifest.json'),JSON.stringify({issue_type:'weekly',week_start:input.weekStart,window_start:input.windowStart,window_end:input.windowEnd,timezone:input.timezone,cutoff:input.cutoff,partial_week:false,baseline_status:input.baselineStatus,counts,sourceDataSha256:sha(JSON.stringify(input)),zh_path:'zh/',en_path:'en/',sources_path:'sources.md'},null,2)+'\n');
  await writeWeeklyIndex({repo:REPO,output,input});
  return {target,counts};
}
