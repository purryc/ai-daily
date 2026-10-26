import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {createHash} from 'node:crypto';
const root=process.cwd(),base=path.join(root,'public'),issue='weekly/2026-10-19';
const digest=b=>createHash('sha256').update(b).digest('hex');
const assert=(v,m)=>{if(!v)throw Error(m)};
const cfg=JSON.parse(await fs.readFile('qa/acceptance-target.json'));
assert(['candidate','live'].includes(cfg.phase),'EXPLICIT_ACCEPTANCE_PHASE');
const counts=(s,l)=>l==='zh'?(s.match(/[\u3400-\u9fff]/g)||[]).length:(s.match(/\b[\w]+(?:[’'-][\w]+)*\b/g)||[]).length;
const decode=s=>s.replace(/&#x27;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const paragraphs=h=>[...h.matchAll(/data-product-unit[^>]*>[\s\S]*?<p>([\s\S]*?)<\/p>/g)].map(x=>decode(x[1]));
async function filesUnder(dir,prefix=''){const out=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){assert(!e.isSymbolicLink(),'SYMLINK');if(e.isDirectory())out.push(...await filesUnder(path.join(dir,e.name),prefix+e.name+'/'));else{assert(e.isFile(),'NONFILE');out.push(prefix+e.name)}}return out.sort()}
const attributes=h=>Object.fromEntries([...h.matchAll(/([\w-]+)="([^"]*)"/g)].map(x=>[x[1],decode(x[2])]));
const referenceRows=h=>[...h.matchAll(/<li\b[^>]*>\s*<b>\s*S(\d+)\s*<\/b>\s*<a\b([^>]*)>/g)].map(x=>({number:+x[1],url:attributes(x[2]).href}));
const units=h=>[...h.matchAll(/<article\b([^>]*\bdata-product-unit[^>]*)>([\s\S]*?)<\/article>/g)].map(x=>({id:attributes(x[1]).id,paragraphs:[...x[2].matchAll(/<p\b/g)].length,refs:[...x[2].matchAll(/\[S(\d+)\]/g)].map(r=>+r[1])}));
const hiddenMarkup=h=>[...h.matchAll(/<[a-z][\w:-]*\b([^>]*)>/gi)].some(tag=>[...tag[1].matchAll(/(?:^|\s)([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)].some(a=>a[1].toLowerCase()==='hidden'||(a[1].toLowerCase()==='style'&&/\bdisplay\s*:\s*none\b|\bvisibility\s*:\s*hidden\b/i.test(a[2]??a[3]??a[4]??''))));
async function links(h,dir){
 assert(!/(?:^|[>\s"'=(])\/workspace\/|sk-proj-|PRIVATE_ROOT|TODO|Lorem ipsum/.test(h),'PRIVATE_OR_PLACEHOLDER');
 for(const a of h.matchAll(/(?:src|href)="([^"]+)"/g)){
  const href=decode(a[1]);if(/^https?:/.test(href))continue;
  const [resource,fragment]=href.split('#'),rel=resource.split('?')[0];
  if(!rel){if(fragment)assert([...h.matchAll(/\bid="([^"]+)"/g)].some(x=>x[1]===decodeURIComponent(fragment)),'MISSING_FRAGMENT '+href);continue}
  let p=path.resolve(dir,rel);
  assert(p.startsWith(base+'/')||p===base,'PATH_ESCAPE');if(rel.endsWith('/'))p=path.join(p,'index.html');await fs.access(p);
  if(fragment){const target=await fs.readFile(p,'utf8');assert([...target.matchAll(/\bid="([^"]+)"/g)].some(x=>x[1]===decodeURIComponent(fragment)),'MISSING_FRAGMENT '+href)}
 }
}
let manifest;
async function staticCheck(){
 const files=JSON.parse(await fs.readFile('qa/public-files.json'));assert(JSON.stringify(await filesUnder(base))===JSON.stringify(files.map(x=>x.path).sort()),'FILE_SET');for(const f of files){const b=await fs.readFile(path.join(base,f.path));assert(digest(b)===f.sha256&&b.length===f.bytes,'HASH '+f.path)}
 const m=manifest=JSON.parse(await fs.readFile(path.join(base,issue,'manifest.json'))),sources=JSON.parse(await fs.readFile(path.join(base,issue,'sources.json'))),visuals=JSON.parse(await fs.readFile(path.join(base,issue,'visuals.json')));
 const contract=JSON.parse(await fs.readFile('qa/weekly-content-contract.json'));assert(contract.reviewed===true&&contract.issue===issue&&JSON.stringify(contract.metrics)===JSON.stringify(m.metrics),'REVIEWED_WEEKLY_CONTENT_CONTRACT');assert(JSON.stringify(contract.units)===JSON.stringify(m.topics.map(t=>({id:t.id,type:t.unitType}))),'REVIEWED_WEEKLY_UNIT_SET');const productIds=m.topics.map(x=>x.id),sourceNumbers=sources.map(x=>x.number),metrics=m.metrics;
 assert(productIds.length===15&&new Set(productIds).size===productIds.length,'PRODUCT_MINIMUM_AND_UNIQUENESS');
 assert(sources.length>=12&&new Set(sources.map(x=>x.url)).size===sources.length&&sources.every(x=>/^https?:\/\//.test(x.url)),'SOURCE_MINIMUM_AND_UNIQUENESS');
 assert(JSON.stringify(sourceNumbers)===JSON.stringify(sources.map((_,i)=>i+1)),'SOURCE_NUMBERING');
 const illustrated=m.topics.filter(t=>!['jobs','talent'].includes(t.unitType)).map(t=>t.id);assert(visuals.length===illustrated.length&&visuals.length===13&&new Set(visuals.map(x=>x.product)).size===illustrated.length&&visuals.every(x=>illustrated.includes(x.product))&&new Set(visuals.map(x=>x.path)).size===visuals.length,'ONE_VISUAL_PER_PRODUCT_OR_EXISTING_ANALYSIS');assert(JSON.stringify(m.hiringSupplement)===JSON.stringify(contract.hiringSupplement)&&m.hiringSupplement.roles.length===11&&m.hiringSupplement.originalPublicationDatesVerified===0,'FROZEN_HIRING_SAMPLE');
 assert(metrics.products===productIds.length&&metrics.references===sources.length&&metrics.coreVisuals===visuals.length&&metrics.primaryProjectPages===productIds.length&&metrics.attachedProjectDetails===productIds.length,'MANIFEST_COUNTS');
 assert(Number.isInteger(metrics.slidesPerLocale)&&metrics.slidesPerLocale>productIds.length,'SLIDE_METRIC');
 for(const key of ['perProduct','primarySummaries'])assert(JSON.stringify(Object.keys(metrics[key]).sort())===JSON.stringify([...productIds].sort()),'METRIC_PROJECT_SET '+key);
 assert(m.cutoff==='2026-10-26T04:00:00Z'&&m.windowStart==='2026-10-19T04:00:00Z'&&m.type==='weekly'&&m.researchStartedAt==='2026-10-26T14:37:49Z'&&m.timezone==='America/Toronto'&&m.revision.originalCutoffRetained,'TIME');
 assert(!('laneScans' in m),'METHOD_AUDIT_REMAINS_PRIVATE');
 for(const v of visuals){assert(v.sourcePage&&v.originalUrl&&v.acquiredAt,'VISUAL_PROVENANCE');assert(digest(await fs.readFile(path.join(base,issue,v.path)))===v.sha256,'VISUAL_HASH')}
 const sourcePage=await fs.readFile(path.join(base,issue,'sources.html'),'utf8');await links(sourcePage,path.join(base,issue));
 const fullReferences=referenceRows(sourcePage),expectedReferences=sources.map(x=>({number:x.number,url:x.url}));
 assert(JSON.stringify(fullReferences)===JSON.stringify(expectedReferences)&&new Set(fullReferences.map(x=>x.url)).size===sources.length,'FULL_REFERENCE_LIST');
 const ids=[],stats={},perProduct={},details=[],primary={},primaryStructures=[],groupLinks=[];
 for(const l of ['zh','en']){
  const dir=path.join(base,issue,l),h=await fs.readFile(path.join(dir,'index.html'),'utf8');await links(h,dir);
  const si=[...h.matchAll(/<section\b[^>]*id="([^"]+)"[^>]*data-slide/g)].map(x=>x[1]);ids.push(si);assert(si.length===metrics.slidesPerLocale&&new Set(si).size===si.length,'SLIDES');assert(si[0]==='cover'&&si[1]==='overview','COVER_THEN_CONTENTS');
  assert(si.includes('evidence-1')&&!si.includes('coverage')&&!si.includes('timing')&&si.length===18,'READER_SLIDE_SET');
  const projects=[...h.matchAll(/<section id="(event-\d+-a)"([\s\S]*?)<\/section>/g)];assert(projects.length===productIds.length&&projects.every((x,i)=>x[1]===`event-${i+1}-a`),'ONE_PRIMARY_PAGE_PER_PROJECT');assert(!/id="event-\d+-[b-z]"/.test(h),'NO_PROJECT_FRAGMENT_SLIDES');assert((h.match(/<u>/g)||[]).length===3,'VISIBLE_KEY_TAKEAWAYS');assert((h.match(/class="action detail-link"/g)||[]).length===productIds.length,'DETAIL_ENTRIES');assert(paragraphs(h).length===0,'SUMMARY_EXCLUDED_FROM_BODY_COUNT');
  const pp={},structure=[],all=[],summaries={},primaryUnits=[];
  for(let i=0;i<productIds.length;i++){
   const t=m.topics[i],file=path.join(dir,'details',t.id+'.html'),d=await fs.readFile(file,'utf8');await links(d,path.dirname(file));assert(d.includes(`data-project-detail="${t.id}"`),'DETAIL_ID');assert(d.includes(`../#event-${i+1}-a`),'DETAIL_BACKLINK');
   const paras=paragraphs(d);assert(paras.length===contract.sections[t.id]&&paras.length>=4,'REVIEWED_DEPTH_SECTIONS');assert(!hiddenMarkup(d),'DETAIL_NOT_HIDDEN');all.push(...paras);pp[t.id]=counts(paras.join(' '),l);assert(pp[t.id]>0,'SUBSTANTIVE_UNIT '+l+t.id);assert(pp[t.id]===metrics.perProduct[t.id][l],'METRIC_PARITY');
   const detailUnits=units(d);assert(detailUnits.length===paras.length&&detailUnits.every(x=>x.id&&x.paragraphs===1)&&new Set(detailUnits.map(x=>x.id)).size===detailUnits.length,'DETAIL_UNIT_STRUCTURE');
   const refs=[...d.matchAll(/\[S(\d+)\]/g)].map(x=>+x[1]);assert(refs.length>0&&refs.every(n=>sourceNumbers.includes(n)),'REF_RANGE');structure.push({id:t.id,units:detailUnits,refs});
   const primaryHtml=projects[i][2],visual=visuals.find(v=>v.product===t.id);if(visual){assert((primaryHtml.match(/<figure\b/g)||[]).length===1&&(primaryHtml.match(/<img\b/g)||[]).length===1,'ONE_CORE_IMAGE_PER_PROJECT');assert(primaryHtml.includes(`src="../${visual.path}"`),'PROJECT_VISUAL_ID')}else{assert(['jobs','talent'].includes(t.unitType)&&!(primaryHtml.match(/<img\b/g)||[]).length,'TEXT_ONLY_HIRING');}assert(decode(primaryHtml).includes(t[l==='zh'?'zhHeadline':'enHeadline']),'TAKEAWAY_HEADLINE');
   const original=primaryHtml.match(/class="primary-source"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/);assert(original&&/^https?:/.test(decode(original[1]))&&sources.some(s=>s.url===decode(original[1]))&&/20\d{2}(?:-\d{2}){0,2}|Undated/.test(original[2]),'VISIBLE_PRIMARY_SOURCE_DATE_LINK');
   const summaryUnits=[...primaryHtml.matchAll(/class="summary-unit"[^>]*>[\s\S]*?<p>([\s\S]*?)<\/p>/g)].map(x=>decode(x[1])),judgment=primaryHtml.match(/class="judgment"[^>]*>[\s\S]*?<p>([\s\S]*?)<\/p>/);
   assert(summaryUnits.length===4&&judgment,'PRIMARY_UNIT_STRUCTURE');const jobLabels=[...primaryHtml.matchAll(/<span data-job-label>([\s\S]*?)<\/span>/g)].map(x=>decode(x[1]));summaries[t.id]=counts(summaryUnits.join('')+decode(judgment[1])+jobLabels.join(' '),l);assert(summaries[t.id]===metrics.primarySummaries[t.id][l],'PRIMARY_METRIC_PARITY');primaryUnits.push({id:t.id,summaryUnits:summaryUnits.length,judgmentUnits:1,refs:[...primaryHtml.matchAll(/\[S(\d+)\]/g)].map(x=>+x[1])});
   assert(primaryUnits.at(-1).refs.length>0&&primaryUnits.at(-1).refs.every(n=>sourceNumbers.includes(n)),'PRIMARY_REF_RANGE');
   if(visual){assert((d.match(/<figure\b/g)||[]).length===1&&(d.match(/<img\b/g)||[]).length===1&&d.includes(`src="../../${visual.path}"`),'ONE_DETAIL_IMAGE_PER_PROJECT')}else{assert(!(d.match(/<img\b/g)||[]).length,'HIRING_DETAIL_NO_FAKE_IMAGE');}if(t.unitType==='jobs'){const jl=[...primaryHtml.matchAll(/data-job-id="([^"]+)" data-conditional="([^"]+)"/g)].map(z=>({id:z[1],conditional:z[2]==='true'}));assert(JSON.stringify(jl)===JSON.stringify(m.hiringSupplement.roles.map(z=>({id:z.id,conditional:z.conditional}))),'JOB_LIST_MAIN_PARITY');const links=[...d.matchAll(/class="job-original" data-job-id="([^"]+)" href="([^"]+)"/g)].map(z=>({id:z[1],url:decode(z[2])}));assert(JSON.stringify(links)===JSON.stringify(m.hiringSupplement.roles.map(z=>({id:z.id,url:z.url}))),'JOB_DIRECT_ORIGINAL_LINKS');}
  }
  assert(new Set(all.map(x=>x.trim())).size===all.length,'DUPLICATE_BODY_PARAGRAPHS');stats[l]=counts(all.join(' '),l);assert(stats[l]>0,'WEEKLY_BODY_PRESENT');assert(stats[l]===metrics.body[l==='zh'?'zhDenseChars':'enWords'],'BODY_METRIC');perProduct[l]=pp;details.push(structure);primary[l]=summaries;primaryStructures.push(primaryUnits);
  const evidence=h.match(/<section id="evidence-1"([\s\S]*?)<\/section>/)?.[1];assert(evidence,'EVIDENCE_SLIDE');
  const grouped=[...evidence.matchAll(/href="([^"#]*sources\.html#[^"]+)"/g)].map(x=>decode(x[1]));assert(grouped.length===productIds.length&&new Set(grouped).size===productIds.length,'GROUPED_PROJECT_SOURCE_LINKS');groupLinks.push(grouped);
  assert(!h.includes('coverage.html')&&!files.some(f=>f.path===`${issue}/${l}/coverage.html`),'NO_READER_METHOD_PAGES');
 }
 assert(JSON.stringify(ids[0])===JSON.stringify(ids[1]),'BILINGUAL_SLIDE_PARITY');assert(JSON.stringify(groupLinks[0])===JSON.stringify(groupLinks[1]),'BILINGUAL_SOURCE_PARITY');assert(JSON.stringify(details[0])===JSON.stringify(details[1]),'BILINGUAL_DETAIL_SECTION_AND_SOURCE_PARITY');assert(JSON.stringify(primaryStructures[0])===JSON.stringify(primaryStructures[1]),'BILINGUAL_PRIMARY_UNIT_AND_SOURCE_PARITY');
 const archive=JSON.parse(await fs.readFile(path.join(base,'manifest.json')));assert(archive[0].date==='2026-10-26'&&archive.filter(x=>x.date==='2026-10-26').length===1,'DAILY_CURRENT_PRESERVED');const weeks=JSON.parse(await fs.readFile(path.join(base,'weekly/manifest.json')));assert(weeks.filter(w=>w.week_start==='2026-10-19'&&w.week_end==='2026-10-25'&&!w.partial_week&&w.path==='2026-10-19/').length===1&&weeks.some(w=>w.week_start==='2026-10-12'&&w.partial_week),'WEEKLY_ARCHIVE');for(const p of ['index.html','en/index.html'])assert((await fs.readFile(path.join(base,p),'utf8')).includes('data-time="latest y-2026 m-2026-10 d-2026-10-26"'),'LATEST');
 return {publicFiles:files.length,slidesPerLocale:metrics.slidesPerLocale,primaryProjectPages:productIds.length,attachedDetails:productIds.length,body:stats,perProduct,primarySummaries:primary,visuals:visuals.length,references:sources.length,products:productIds.length,counting:'Unique full detail paragraphs only; primary summaries, sources, figures and scan prose excluded',bilingualStructureAndSources:true};
}
// staticCheck verifies every byte before this read-only candidate fixture starts.
async function serve(){const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.txt':'text/plain','.svg':'image/svg+xml'};const server=http.createServer(async(req,res)=>{try{let p=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/ai-daily\//,'/');if(p.endsWith('/'))p+='index.html';const target=path.resolve(base,'.'+p);assert(target.startsWith(base+'/'),'PATH');const b=await fs.readFile(target);res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'public, max-age=3600'});res.end(b)}catch{res.writeHead(404);res.end()}});await new Promise(r=>server.listen(0,'127.0.0.1',r));return {server,url:`http://127.0.0.1:${server.address().port}/ai-daily/`}}
const report={edition:issue,startedAt:new Date().toISOString(),status:'started',completion:'in-progress',publishedCommit:cfg.phase==='live'?cfg.publicCommit:null,baselineCommit:cfg.baselineCommit,workflowBaselineCommit:process.env.QA_PUBLIC_COMMIT||null,mode:cfg.phase,checks:[],failures:[],screenshots:[],checkpoints:[]};
const out=path.join(process.env.RUNNER_TEMP||'/tmp','daily-qa-'+(process.env.QA_EVIDENCE_LOCALE||'zh'));let browser,server;
const check=(name,ok,details={})=>{report.checks.push({name,ok,...details});if(!ok)report.failures.push({name,...details})};
const controlChecks=new Set(['next-navigation','previous-navigation','keyboard-next-navigation','keyboard-previous-navigation','home-navigation','end-navigation','contents-navigation','toc-tab-state','primary-language-preserves-slide','primary-language-return-preserves-slide','citation-navigation','detail-navigation','detail-language-same-project','detail-language-return-same-project','detail-return-to-same-project','project-source-navigation','sources-return-to-edition','source-overview-navigation','edition-overview-navigation']);
function coverage(){
 return [1600,1920,390].map(width=>{
  const checks=report.checks.filter(c=>c.viewport?.width===width),distinct=(name,field)=>new Set(checks.filter(c=>c.name===name&&c.ok).map(c=>c[field])).size;
  const controls=checks.filter(c=>controlChecks.has(c.name)),paths=new Set(controls.map(c=>JSON.stringify([c.name,c.project??c.projectSlide??c.id??c.tab??null,c.key??null,c.language??null,c.target??null])));
  return {width,scope:width===1600?'all layouts and all control paths':width===1920?'all layouts; TOC tabs opened for layout':'all layouts and representative control paths',expectedPrimaryPages:manifest?.metrics?.slidesPerLocale??null,expectedDetails:manifest?.metrics?.products??null,primaryPagesInspected:distinct(width===390?'mobile-primary-readability':'slide-bounds','id'),detailsInspected:distinct('detail-readable','project'),tocPanelsInspected:new Set(checks.filter(c=>['mobile-primary-readability','slide-bounds'].includes(c.name)&&c.tocTab!==undefined).map(c=>c.tocTab)).size,distinctLogicalControlPaths:paths.size,controlAssertions:controls.length,failedAssertions:checks.filter(c=>!c.ok).length};
 });
}
async function checkpoint(phase,details={}){
 report.coverage=coverage();const now=Date.now(),point={phase,at:new Date(now).toISOString(),elapsedMs:now-Date.parse(report.startedAt),sincePreviousMs:now-Date.parse(report.checkpoints.at(-1)?.at??report.startedAt),checks:report.checks.length,failures:report.failures.length,screenshots:report.screenshots.length,...details};report.checkpoints.push(point);
 await fs.mkdir(out,{recursive:true});await fs.writeFile(path.join(out,'report.json.tmp'),JSON.stringify(report,null,2));await fs.rename(path.join(out,'report.json.tmp'),path.join(out,'report.json'));
 console.log('QA_CHECKPOINT '+JSON.stringify(point));
}
report.timings={readyCalls:0,readyMs:0,imageDecodeCalls:0,imagesDecoded:0,imageDecodeMs:0,screenshotMs:0};
report.imageLog={eligible:[],maxImages:6,maxBase64CharsPerImage:1048576,maxBase64CharsTotal:4194304,encodedChars:0,emitted:[],artifactOnly:[]};
function previewNames(){return report.locale?(cfg.archiveRevision?['before','after','weekly','daily','empty','mobile'].map(n=>`${report.locale}-archive-${n}.jpg`):[`${report.locale}-toc-1.jpg`,`${report.locale}-event-14-a.jpg`,`${report.locale}-event-15-a.jpg`,`${report.locale}-detail-jobs-public-listings-top.jpg`,`${report.locale}-mobile-event-14-a.jpg`,`${report.locale}-mobile-detail-jobs-public-listings.jpg`]):[]}
async function emitPreview(name){
 const log=report.imageLog;if(!previewNames().includes(name)||log.emitted.includes(name)||log.artifactOnly.includes(name))return;
 log.eligible.push(name);const data=(await fs.readFile(path.join(out,name))).toString('base64');
 if(log.emitted.length>=log.maxImages||data.length>log.maxBase64CharsPerImage||log.encodedChars+data.length>log.maxBase64CharsTotal){log.artifactOnly.push(name);return}
 log.encodedChars+=data.length;log.emitted.push(name);const n=Math.ceil(data.length/4096);
 for(let i=0;i<n;i++)console.log(`QA_IMAGE ${name} ${i}/${n} ${data.slice(i*4096,(i+1)*4096)}`);
}
async function decodeImages(images){
 const start=Date.now(),n=await images.evaluateAll(els=>Promise.all(els.map(e=>e.decode())).then(()=>els.length));
 report.timings.imageDecodeCalls++;report.timings.imagesDecoded+=n;report.timings.imageDecodeMs+=Date.now()-start;
}
async function screen(page,name){const start=Date.now();await page.screenshot({path:path.join(out,name),type:'jpeg',quality:65,fullPage:name.includes('-mobile-')});report.timings.screenshotMs+=Date.now()-start;report.screenshots.push(name);await emitPreview(name)}
async function ready(page){
 const start=Date.now();
 await page.waitForLoadState('domcontentloaded');await page.evaluate(()=>document.fonts.ready);
 // Hidden slides and the source index are not the layout under inspection.
 // Each slide's own images are explicitly decoded again before its bounds check.
 await decodeImages(page.locator('[data-slide]:not([hidden]) img, main[data-project-detail] img'));
 report.timings.readyCalls++;report.timings.readyMs+=Date.now()-start;
}
async function visibleSlide(page,id){
 await page.waitForFunction(id=>location.hash==='#'+id&&document.getElementById(id)&&!document.getElementById(id).hidden,id);
 return page.locator('[data-slide]:visible').count().then(async n=>n===1&&await page.locator('#'+id).isVisible());
}
async function gotoSlide(page,id){await page.evaluate(id=>{location.hash=id},id);assert(await visibleSlide(page,id),'ACTIVE_SLIDE '+id)}
async function clickLocal(page,selector,target){
 const wanted=new URL(target),links=page.locator(selector),index=await links.evaluateAll((els,wanted)=>els.findIndex(el=>{const u=new URL(el.href);return u.origin===wanted.origin&&u.pathname===wanted.pathname}),{origin:wanted.origin,pathname:wanted.pathname});
 assert(index>=0,'ACTUAL_LOCAL_LINK '+selector+' '+target);await links.nth(index).click();await ready(page);
 return page.url();
}
async function inspectSlide(page,id,viewport,extra={}){
 await decodeImages(page.locator('#'+id+' img'));
 const mobile=viewport.width===390,bounds=await page.locator('#'+id).evaluate((el,mobile)=>{
  const r=el.getBoundingClientRect(),outside=[],clipped=[],images=[],fonts=[];
  for(const n of el.querySelectorAll('*')){
   const b=n.getBoundingClientRect(),s=getComputedStyle(n);if(!b.width||!b.height)continue;
   if(b.left<r.left-1||b.right>r.right+1||(!mobile&&(b.top<r.top-1||b.bottom>r.bottom+1)))outside.push(n.tagName+':'+n.textContent.slice(0,55));
   if(['hidden','clip','scroll','auto'].includes(s.overflowY)&&n.scrollHeight>n.clientHeight+1)clipped.push(n.tagName);
   if(n.tagName==='IMG')images.push({loaded:n.complete&&n.naturalWidth>0,contain:s.objectFit==='contain'});
   if(n.matches('.summary p,.judgment p,.contents-list strong,.signals p,[data-job-label]'))fonts.push(parseFloat(s.fontSize)*(mobile?1:r.width/1440));
  }
  let projectLayout=null;
  if(!mobile&&el.classList.contains('product-slide')){
   const caption=el.querySelector('.project-grid figure figcaption,.project-grid .job-index,.project-grid .job-sample'),summary=el.querySelector('.summary'),judgment=el.querySelector('.judgment'),foot=el.querySelector('.project-foot');
   const contentBottom=node=>Math.max(...[node,...node.querySelectorAll('*')].map(n=>n.getBoundingClientRect()).filter(b=>b.width&&b.height).map(b=>b.bottom));
   if(!caption||!summary||!judgment||!foot)projectLayout={overlaps:['missing project layout region']};
   else{
    projectLayout={captionBottom:contentBottom(caption),summaryBottom:contentBottom(summary),judgmentTop:judgment.getBoundingClientRect().top,judgmentBottom:contentBottom(judgment),footerTop:foot.getBoundingClientRect().top,overlaps:[]};
    if(projectLayout.captionBottom>projectLayout.judgmentTop+1)projectLayout.overlaps.push('figure caption overlaps judgment');
    if(projectLayout.summaryBottom>projectLayout.judgmentTop+1)projectLayout.overlaps.push('summary content overlaps judgment');
    if(projectLayout.judgmentBottom>projectLayout.footerTop+1)projectLayout.overlaps.push('judgment overlaps project footer');
   }
  }
  return {id:el.id,ratio:r.width/r.height,withinViewport:r.left>=-1&&r.right<=innerWidth+1&&(mobile||(r.top>=-1&&r.bottom<=innerHeight+1)),outside,clipped,images,projectLayout,minReadingFont:fonts.length?Math.min(...fonts):null,horizontalOverflow:document.documentElement.scrollWidth>innerWidth+1,verticalOverflow:document.documentElement.scrollHeight>innerHeight+1};
 },mobile);
 check(mobile?'mobile-primary-readability':'slide-bounds',bounds.withinViewport&&(mobile||Math.abs(bounds.ratio-16/9)<.001)&&!bounds.outside.length&&!bounds.clipped.length&&!bounds.horizontalOverflow&&(mobile||!bounds.verticalOverflow)&&bounds.images.every(x=>x.loaded&&x.contain)&&(bounds.minReadingFont===null||bounds.minReadingFont>=18),{viewport,...extra,...bounds});
 if(bounds.projectLayout)check('project-internal-no-overlap',bounds.projectLayout.overlaps.length===0,{viewport,id,...bounds.projectLayout});
}
async function checkToc(page,viewport,locale,fullControls){
 await gotoSlide(page,'overview');const tabs=page.locator('#overview button[data-toc-tab]'),panels=page.locator('#overview [data-toc-panel]'),n=await tabs.count();
 assert(n>0&&await panels.count()===n,'TOC_TABS_AND_PANELS');report.tocPanels=n;const targets=[];
 async function state(index,keyboard=false){
  const result=await page.locator('#overview').evaluate((el,{index,keyboard})=>{
   const tabs=[...el.querySelectorAll('button[data-toc-tab]')],panels=[...el.querySelectorAll('[data-toc-panel]')],tab=tabs[index],panel=panels[index];
   return {selected:tabs.map(t=>t.getAttribute('aria-selected')),hidden:panels.map(p=>p.hidden),linked:tab.getAttribute('aria-controls')?tab.getAttribute('aria-controls')===panel.id:tab.dataset.tocTab===panel.dataset.tocPanel,focused:!keyboard||document.activeElement===tab,hasContents:!!panel.querySelector('.contents-list')};
  },{index,keyboard});
  check('toc-tab-state',result.selected.every((v,i)=>v===(i===index?'true':'false'))&&result.hidden.every((v,i)=>v===(i!==index))&&result.linked&&result.focused&&result.hasContents&&await visibleSlide(page,'overview'),{viewport,tab:index,...result});
 }
 for(let i=0;i<n;i++){
  await tabs.nth(i).click();await state(i);await inspectSlide(page,'overview',viewport,{tocTab:i});
  const prefix=viewport.width===1600?locale:viewport.width===390?`${locale}-mobile`:`${locale}-${viewport.width}`;
  await screen(page,`${prefix}-toc-${i+1}.jpg`);
  const links=panels.nth(i).locator('.contents-list a'),tabTargets=await links.evaluateAll(els=>els.map(a=>({id:a.dataset.goSlide,hash:new URL(a.href).hash})));
  assert(tabTargets.length>0,'EMPTY_TOC_PANEL');for(const x of tabTargets){assert(x.id&&x.hash==='#'+x.id,'TOC_LINK_TARGET');targets.push(x.id)}
  const linkIndices=fullControls?tabTargets.map((_,i)=>i):viewport.width===390?[0]:[];
  for(const j of linkIndices){
   await tabs.nth(i).click();await links.nth(j).click();check('contents-navigation',await visibleSlide(page,tabTargets[j].id),{viewport,tab:i,projectSlide:tabTargets[j].id});await gotoSlide(page,'overview');
  }
  if(fullControls||viewport.width===390&&i===0){
   await tabs.nth(i).click();await tabs.nth(i).focus();await page.keyboard.press('ArrowRight');await state((i+1)%n,true);
   await page.keyboard.press('ArrowLeft');await state(i,true);
   await page.keyboard.press('ArrowLeft');await state((i+n-1)%n,true);
   await page.keyboard.press('ArrowRight');await state(i,true);
  }
 }
 const expected=manifest.topics.map((_,i)=>`event-${i+1}-a`);
 check('toc-all-projects-exactly-once',JSON.stringify(targets)===JSON.stringify(expected)&&new Set(targets).size===expected.length,{viewport,targets});
 await page.evaluate(()=>document.activeElement?.blur());
}
async function checkNavigation(page,ids,viewport,fullControls){
 if(!fullControls){
  await gotoSlide(page,ids[0]);await page.locator('[data-next-slide]').click();check('next-navigation',await visibleSlide(page,ids[1]),{viewport,id:ids[1]});
  await page.locator('[data-prev-slide]').click();check('previous-navigation',await visibleSlide(page,ids[0]),{viewport,id:ids[0]});await page.evaluate(()=>document.activeElement?.blur());
  for(const key of ['ArrowRight','PageDown']){await page.keyboard.press(key);check('keyboard-next-navigation',await visibleSlide(page,ids[1]),{viewport,key,id:ids[1]});await page.keyboard.press(key==='ArrowRight'?'ArrowLeft':'PageUp');check('keyboard-previous-navigation',await visibleSlide(page,ids[0]),{viewport,key:key==='ArrowRight'?'ArrowLeft':'PageUp',id:ids[0]})}
  await page.keyboard.press('End');check('end-navigation',await visibleSlide(page,ids.at(-1)),{viewport});await page.keyboard.press('Home');check('home-navigation',await visibleSlide(page,ids[0]),{viewport});return;
 }
 await gotoSlide(page,ids[0]);check('previous-disabled-at-cover',await page.locator('[data-prev-slide]').isDisabled(),{viewport});
 for(let i=1;i<ids.length;i++){await page.locator('[data-next-slide]').click();check('next-navigation',await visibleSlide(page,ids[i]),{viewport,id:ids[i]})}
 check('next-disabled-at-end',await page.locator('[data-next-slide]').isDisabled(),{viewport});
 for(let i=ids.length-2;i>=0;i--){await page.locator('[data-prev-slide]').click();check('previous-navigation',await visibleSlide(page,ids[i]),{viewport,id:ids[i]})}
 await page.evaluate(()=>document.activeElement?.blur());
 for(const key of ['ArrowRight','PageDown']){
  await page.keyboard.press('Home');check('home-navigation',await visibleSlide(page,ids[0]),{viewport,key});
  for(let i=1;i<ids.length;i++){await page.keyboard.press(key);check('keyboard-next-navigation',await visibleSlide(page,ids[i]),{viewport,key,id:ids[i]})}
 }
 for(const key of ['ArrowLeft','PageUp']){
  await page.keyboard.press('End');check('end-navigation',await visibleSlide(page,ids.at(-1)),{viewport,key});
  for(let i=ids.length-2;i>=0;i--){await page.keyboard.press(key);check('keyboard-previous-navigation',await visibleSlide(page,ids[i]),{viewport,key,id:ids[i]})}
 }
}
try{
 report.static=await staticCheck();console.log('STATIC_REPORT '+JSON.stringify(report.static));await checkpoint('static-complete');
 if(!process.argv.includes('--static-only')){
  if(cfg.acquireAssets) await import('./acquire.mjs');
  await fs.mkdir(out,{recursive:true});const {chromium}=await import('playwright');browser=await chromium.launch({executablePath:process.env.AI_DAILY_CHROMIUM_PATH||'/usr/bin/google-chrome',chromiumSandbox:true,headless:true,args:['--enable-automation']});
  const sp=await browser.newPage(),cdp=await sp.context().newCDPSession(sp);const args=(await cdp.send('Browser.getBrowserCommandLine')).arguments;assert(!args.some(x=>/^--(?:no-sandbox|disable-setuid-sandbox)(?:=|$)/.test(x)),'SANDBOX_DISABLED');await sp.goto('chrome://sandbox');const text=await sp.locator('body').innerText();report.sandbox={seccomp:/Seccomp-BPF sandbox\s+Yes/i.test(text),namespaceOrSuid:/(?:SUID sandbox|PID namespaces)\s+Yes/i.test(text),disabledFlags:false};assert(report.sandbox.seccomp&&report.sandbox.namespaceOrSuid,'SANDBOX_NOT_VERIFIED');await sp.close();
  await checkpoint('sandbox-verified');
  const live=process.env.QA_LIVE_BASE;assert(live==='https://purryc.github.io/ai-daily/','LIVE_TARGET');
  const liveFiles=JSON.parse(await fs.readFile(cfg.phase==='candidate'?'qa/baseline-public-files.json':'qa/public-files.json'));report.liveHashes=[];
  for(const f of liveFiles.filter(x=>x.path.startsWith(issue+'/')||(cfg.archiveRevision&&x.path.startsWith('weekly/'))||['index.html','en/index.html','manifest.json','assets/archive-filter.css','assets/archive-filter.mjs','weekly/index.html','weekly/manifest.json'].includes(x.path))){const r=await fetch(new URL(f.path,live),{cache:'no-store'});const match=r.status===200&&digest(Buffer.from(await r.arrayBuffer()))===f.sha256;report.liveHashes.push({path:f.path,status:r.status,match});check(cfg.phase==='candidate'?'baseline-live-byte-match':'live-byte-match',match,{path:f.path})}
  await checkpoint('live-hashes-complete');
  let url=live;if(cfg.phase==='candidate'){const s=await serve();server=s.server;url=s.url}report.browserTarget=cfg.phase==='candidate'?'local public candidate in existing cloud runner':'published Pages revision';
  const locale=process.env.QA_EVIDENCE_LOCALE||'zh';assert(['zh','en'].includes(locale),'LOCALE');report.locale=locale;
  const otherLocale=locale==='zh'?'en':'zh',representatives=["highlight-consumer-muse", "jobs-public-listings", "jobs-talent-demand"].filter(id=>manifest.topics.some(t=>t.id===id));
  report.representativeProjects=representatives;
  for(const viewport of [{width:1600,height:900},{width:1920,height:1080},{width:390,height:844}]){
   const mobile=viewport.width===390,fullControls=viewport.width===1600,context=await browser.newContext({viewport,serviceWorkers:'block'}),page=await context.newPage(),errors=[];
   await checkpoint('viewport-start',{viewport});
   page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(url))errors.push(r.status()+' '+r.url())});const entry=new URL(`${issue}/${locale}/`,url).href,otherEntry=new URL(`${issue}/${otherLocale}/`,url).href;
   const response=await page.goto(entry,{waitUntil:'domcontentloaded'});check('page-http',response.status()===200,{viewport});await ready(page);
   const ids=await page.locator('[data-slide]').evaluateAll(els=>els.map(x=>x.id));assert(ids.length===manifest.metrics.slidesPerLocale,'BROWSER_SLIDE_COUNT');
   for(const [slideIndex,id] of ids.entries()){
    await gotoSlide(page,id);await inspectSlide(page,id,viewport);
    await screen(page,`${locale}-${mobile?'mobile-':viewport.width===1600?'':viewport.width+'-'}${id}.jpg`);
    if(fullControls||mobile&&representatives.some(project=>id===`event-${manifest.topics.findIndex(t=>t.id===project)+1}-a`)){
     await clickLocal(page,'.reader > header nav a',otherEntry);
     check('primary-language-preserves-slide',page.url()===otherEntry+'#'+id&&await visibleSlide(page,id),{viewport,id,language:otherLocale});
     await clickLocal(page,'.reader > header nav a',entry);
     check('primary-language-return-preserves-slide',page.url()===entry+'#'+id&&await visibleSlide(page,id),{viewport,id,language:locale});
    }
    if((slideIndex+1)%10===0)await checkpoint('primary-progress',{viewport,completed:slideIndex+1,total:ids.length});
   }
   await checkpoint('primary-complete',{viewport});await checkToc(page,viewport,locale,fullControls);await checkpoint('toc-complete',{viewport});
   if(fullControls||mobile)await checkNavigation(page,ids,viewport,fullControls);await checkpoint('navigation-complete',{viewport});
   // Inspect every detail at every viewport. Exercise all project control paths
   // at 1600px and repeat representative paths on mobile.
   for(let i=0;i<manifest.topics.length;i++){
    const t=manifest.topics[i],id=`event-${i+1}-a`,exerciseControls=fullControls||mobile&&representatives.includes(t.id),currentDetail=new URL(`details/${t.id}.html`,entry).href;
    if(exerciseControls){
     if(new URL(page.url()).pathname!==new URL(entry).pathname){await page.goto(entry,{waitUntil:'domcontentloaded'});await ready(page)}
     await gotoSlide(page,id);await page.locator('#'+id+' .reference-marker').first().click();check('citation-navigation',await visibleSlide(page,'evidence-1'),{viewport,project:t.id});await gotoSlide(page,id);
     const link=page.locator('#'+id+' .detail-link');check('detail-entry-visible',await link.isVisible(),{viewport,project:t.id});await link.click();await ready(page);check('detail-navigation',page.url()===currentDetail,{viewport,project:t.id});
    }else{await page.goto(currentDetail,{waitUntil:'domcontentloaded'});await ready(page)}
    const readable=await page.evaluate(()=>{const paras=[...document.querySelectorAll('[data-product-unit] p')],bad=[];for(const p of paras){const r=p.getBoundingClientRect(),s=getComputedStyle(p);if(r.width<250||parseFloat(s.fontSize)<18||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.5||s.display==='none'||s.visibility==='hidden')bad.push('unreadable paragraph');for(let n=p;n&&n!==document.body;n=n.parentElement){const cs=getComputedStyle(n);if(['auto','scroll','clip','hidden'].includes(cs.overflowY)&&n.scrollHeight>n.clientHeight+1)bad.push('inner scrolling or clipping')}}return {paragraphs:paras.length,bad,horizontalOverflow:document.documentElement.scrollWidth>innerWidth+1,images:[...document.images].every(x=>x.complete&&x.naturalWidth>0&&getComputedStyle(x).objectFit==='contain'),languageLink:!!document.querySelector('.detail-header a:nth-child(2)'),landmark:!!document.querySelector('main[data-project-detail]')}});
    check('detail-readable',readable.paragraphs>=4&&!readable.bad.length&&!readable.horizontalOverflow&&readable.images&&readable.languageLink&&readable.landmark,{viewport,project:t.id,...readable});
    const last=page.locator('[data-product-unit]').last();await last.scrollIntoViewIfNeeded();check('detail-last-section-reachable',await last.isVisible(),{viewport,project:t.id});
    if(viewport.width===1600&&representatives.includes(t.id)){await screen(page,`${locale}-detail-${t.id}-end.jpg`);await page.evaluate(()=>scrollTo(0,0));await screen(page,`${locale}-detail-${t.id}-top.jpg`)}
    if(mobile&&representatives.includes(t.id)){await page.evaluate(()=>scrollTo(0,0));await screen(page,`${locale}-mobile-detail-${t.id}.jpg`)}
    if(exerciseControls){
     const otherDetail=new URL(`details/${t.id}.html`,otherEntry).href;
     await clickLocal(page,'.detail-header a',otherDetail);
     check('detail-language-same-project',page.url()===otherDetail&&await page.locator(`main[data-project-detail="${t.id}"]`).count()===1,{viewport,project:t.id,language:otherLocale});
     await clickLocal(page,'.detail-header a',currentDetail);
     check('detail-language-return-same-project',page.url()===currentDetail&&await page.locator(`main[data-project-detail="${t.id}"]`).count()===1,{viewport,project:t.id,language:locale});
     await page.locator('.detail-header .back-link').click();await ready(page);check('detail-return-to-same-project',page.url()===entry+'#'+id&&await visibleSlide(page,id),{viewport,project:t.id});
    }
    if((i+1)%10===0)await checkpoint('details-progress',{viewport,completed:i+1,total:manifest.topics.length});
   }
   await checkpoint('details-complete',{viewport});
   if(fullControls||mobile){
   await page.goto(entry+'#evidence-1',{waitUntil:'domcontentloaded'});await ready(page);const grouped=await page.locator('#evidence-1 a[href*="sources.html#"]').evaluateAll(els=>els.map(a=>a.href));
   assert(grouped.length===manifest.metrics.products&&new Set(grouped).size===grouped.length,'BROWSER_GROUPED_SOURCE_LINKS');
   for(let i=0;i<grouped.length;i++){
    if(!fullControls&&!representatives.includes(manifest.topics[i].id))continue;
    await page.locator('#evidence-1 a[href*="sources.html#"]').nth(i).click();await ready(page);
    const target=new URL(grouped[i]),anchor=decodeURIComponent(target.hash.slice(1));
    check('project-source-navigation',page.url()===target.href&&await page.locator('[id]').evaluateAll((els,id)=>els.some(el=>el.id===id&&el.getBoundingClientRect().height>0),anchor),{viewport,project:manifest.topics[i].id,target:target.href});
    const sourceCount=await page.locator('li').evaluateAll(els=>els.filter(el=>/^S\d+$/.test(el.querySelector('b')?.textContent?.trim()||'')&&el.querySelector('a')).length);
    check('full-source-list-reachable',sourceCount===manifest.metrics.references,{viewport,count:sourceCount});
    await clickLocal(page,'a',entry);check('sources-return-to-edition',new URL(page.url()).pathname===new URL(entry).pathname,{viewport});await gotoSlide(page,'evidence-1');
    if((i+1)%10===0)await checkpoint('sources-progress',{viewport,completed:i+1,total:grouped.length});
   }
   const fullSources=new URL('../sources.html',entry).href;await clickLocal(page,'#evidence-1 a',fullSources);
   const home=new URL(locale==='zh'?'':'en/',url).href;
   // The shared source index links to the root overview; follow the published link itself.
   await clickLocal(page,'a',url);check('source-overview-navigation',new URL(page.url()).pathname===new URL(url).pathname,{viewport});
   await page.goto(entry+'#overview');await clickLocal(page,'.reader > header .brand',home);check('edition-overview-navigation',new URL(page.url()).pathname===new URL(home).pathname,{viewport});
   }
   await checkpoint('sources-and-overview-complete',{viewport,exercised:fullControls||mobile});
   const actualCoverage=coverage().find(x=>x.width===viewport.width);
   check('viewport-full-layout-coverage',actualCoverage.primaryPagesInspected===ids.length&&actualCoverage.detailsInspected===manifest.topics.length&&actualCoverage.tocPanelsInspected===report.tocPanels,{viewport,...actualCoverage});
   if(fullControls||mobile){
    const expected=fullControls?{'primary-language-preserves-slide':ids.length,'primary-language-return-preserves-slide':ids.length,'detail-navigation':manifest.topics.length,'detail-language-same-project':manifest.topics.length,'detail-language-return-same-project':manifest.topics.length,'detail-return-to-same-project':manifest.topics.length,'project-source-navigation':manifest.topics.length,'contents-navigation':manifest.topics.length,'next-navigation':ids.length-1,'previous-navigation':ids.length-1,'keyboard-next-navigation':2*(ids.length-1),'keyboard-previous-navigation':2*(ids.length-1)}:{'primary-language-preserves-slide':representatives.length,'primary-language-return-preserves-slide':representatives.length,'detail-navigation':representatives.length,'detail-language-same-project':representatives.length,'detail-language-return-same-project':representatives.length,'detail-return-to-same-project':representatives.length,'project-source-navigation':representatives.length,'contents-navigation':report.tocPanels,'next-navigation':1,'previous-navigation':1,'keyboard-next-navigation':2,'keyboard-previous-navigation':2};
    const observed=Object.fromEntries(Object.keys(expected).map(name=>[name,report.checks.filter(c=>c.viewport?.width===viewport.width&&c.name===name&&c.ok).length]));
    check('viewport-control-coverage',Object.entries(expected).every(([name,n])=>observed[name]===n),{viewport,expected,observed});
   }
   check('runtime-errors',errors.length===0,{viewport,errors});await context.close();
   await checkpoint('viewport-complete',{viewport});
  }
  const {checkArchive}=await import('./archive-check.mjs');await checkArchive({browser,url,live,locale,phase:cfg.phase,check,screen,issue});
  await checkpoint('all-browser-phases-complete');
 }

 report.status=report.failures.length?'failed':'passed';
}catch(e){report.status='failed';report.failures.push({error:e.stack})}
finally{
 await checkpoint('finalizing');
 if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));
 report.finishedAt=new Date().toISOString();await fs.mkdir(out,{recursive:true});
 // All screenshots remain artifacts. Log previews are restricted to the TOC and
 // one original, hardware and DIY project, with independent per-image/total bounds.
 // Emit selected previews when captured so their logs survive a later timeout;
 // this final pass only covers a preview not already emitted by screen().
 if(!process.argv.includes('--static-only'))for(const name of previewNames().filter(name=>report.screenshots.includes(name)))await emitPreview(name);
 report.completion='complete';report.coverage=coverage();await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log('QA_REPORT '+JSON.stringify(report));if(report.status!=='passed')process.exitCode=1;
}
