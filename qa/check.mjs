import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {createHash} from 'node:crypto';
const root=process.cwd(),base=path.join(root,'public'),issue='2026-10-20';
const digest=b=>createHash('sha256').update(b).digest('hex');
const assert=(v,m)=>{if(!v)throw Error(m)};
const cfg=JSON.parse(await fs.readFile('qa/acceptance-target.json'));
assert(['candidate','live'].includes(cfg.phase),'EXPLICIT_ACCEPTANCE_PHASE');
const counts=(s,l)=>l==='zh'?(s.match(/[\u3400-\u9fff]/g)||[]).length:(s.match(/\b[\w]+(?:[’'-][\w]+)*\b/g)||[]).length;
const decode=s=>s.replace(/&#x27;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const paragraphs=h=>[...h.matchAll(/data-product-unit[^>]*>[\s\S]*?<p>([\s\S]*?)<\/p>/g)].map(x=>decode(x[1]));
async function filesUnder(dir,prefix=''){const out=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){assert(!e.isSymbolicLink(),'SYMLINK');if(e.isDirectory())out.push(...await filesUnder(path.join(dir,e.name),prefix+e.name+'/'));else{assert(e.isFile(),'NONFILE');out.push(prefix+e.name)}}return out.sort()}
async function links(h,dir){
 assert(!/\/workspace\/|sk-proj-|PRIVATE_ROOT|TODO|Lorem ipsum/.test(h),'PRIVATE_OR_PLACEHOLDER');
 for(const a of h.matchAll(/(?:src|href)="([^"]+)"/g)){if(a[1].startsWith('#')||/^https?:/.test(a[1]))continue;let rel=a[1].split('#')[0],p=path.resolve(dir,rel);assert(p.startsWith(base+'/')||p===base,'PATH_ESCAPE');if(rel.endsWith('/'))p=path.join(p,'index.html');await fs.access(p)}
}
let manifest;
async function staticCheck(){
 const files=JSON.parse(await fs.readFile('qa/public-files.json'));assert(JSON.stringify(await filesUnder(base))===JSON.stringify(files.map(x=>x.path).sort()),'FILE_SET');for(const f of files){const b=await fs.readFile(path.join(base,f.path));assert(digest(b)===f.sha256&&b.length===f.bytes,'HASH '+f.path)}
 const m=manifest=JSON.parse(await fs.readFile(path.join(base,issue,'manifest.json'))),sources=JSON.parse(await fs.readFile(path.join(base,issue,'sources.json'))),visuals=JSON.parse(await fs.readFile(path.join(base,issue,'visuals.json')));
 assert(m.topics.length===7&&sources.length===20&&new Set(sources.map(x=>x.url)).size===20&&visuals.length===7,'COUNTS');assert(m.cutoff==='2026-10-20T14:08:00Z'&&m.timezone==='America/Toronto'&&m.revision.originalCutoffRetained,'TIME');
 const scans=m.laneScans.map(x=>({lane:x.lane,zh:counts(x.zh,'zh'),en:counts(x.en,'en')}));for(const x of scans)assert(x.zh>=180&&x.en>=140,'SCAN_DENSITY '+JSON.stringify(x));assert(scans.length===8&&new Set(scans.map(x=>x.lane)).size===8,'EIGHT_LANES');
 for(const v of visuals){assert(v.sourcePage&&v.originalUrl&&v.acquiredAt,'VISUAL_PROVENANCE');assert(digest(await fs.readFile(path.join(base,issue,v.path)))===v.sha256,'VISUAL_HASH')}
 const ids=[],stats={},perProduct={},references=[],details=[],primary={};
 for(const l of ['zh','en']){
  const dir=path.join(base,issue,l),h=await fs.readFile(path.join(dir,'index.html'),'utf8');await links(h,dir);
  const si=[...h.matchAll(/<section\b[^>]*id="([^"]+)"[^>]*data-slide/g)].map(x=>x[1]);ids.push(si);assert(si.length===m.metrics.slidesPerLocale&&si.length===12,'SLIDES');assert(si[0]==='cover'&&si[1]==='overview','COVER_THEN_CONTENTS');
  const projects=[...h.matchAll(/<section id="(event-\d+-a)"([\s\S]*?)<\/section>/g)];assert(projects.length===m.topics.length,'ONE_PRIMARY_PAGE_PER_PROJECT');assert(!/id="event-\d+-[b-z]"/.test(h),'NO_PROJECT_FRAGMENT_SLIDES');assert((h.match(/<u>/g)||[]).length===3,'VISIBLE_KEY_TAKEAWAYS');assert((h.match(/class="action detail-link"/g)||[]).length===7,'DETAIL_ENTRIES');assert(paragraphs(h).length===0,'SUMMARY_EXCLUDED_FROM_BODY_COUNT');
  const pp={},structure=[],all=[],summaries={};
  for(let i=0;i<m.topics.length;i++){
   const t=m.topics[i],file=path.join(dir,'details',t.id+'.html'),d=await fs.readFile(file,'utf8');await links(d,path.dirname(file));assert(d.includes(`data-project-detail="${t.id}"`),'DETAIL_ID');assert(d.includes(`../#event-${i+1}-a`),'DETAIL_BACKLINK');
   const paras=paragraphs(d);assert(paras.length>=4,'DEPTH_SECTIONS');assert(!/\bhidden\b|display:\s*none|visibility:\s*hidden/.test(d),'DETAIL_NOT_HIDDEN');all.push(...paras);pp[t.id]=counts(paras.join(' '),l);assert(pp[t.id]>=(l==='zh'?520:380),'PRODUCT_DENSITY '+l+t.id);assert(pp[t.id]===m.metrics.perProduct[t.id][l],'METRIC_PARITY');
   structure.push({id:t.id,sections:paras.length,refs:[...d.matchAll(/\[S(\d+)\]/g)].map(x=>+x[1])});assert(structure.at(-1).refs.every(n=>n>=1&&n<=20),'REF_RANGE');
   const primaryHtml=projects[i][2];assert((primaryHtml.match(/<figure>/g)||[]).length===1,'ONE_CORE_IMAGE_PER_PROJECT');assert(primaryHtml.includes(t[l==='zh'?'zhHeadline':'enHeadline'].replaceAll('&','&amp;')),'TAKEAWAY_HEADLINE');summaries[t.id]=m.metrics.primarySummaries[t.id][l];
  }
  assert(new Set(all.map(x=>x.trim())).size===all.length,'DUPLICATE_BODY_PARAGRAPHS');stats[l]=counts(all.join(' '),l);assert(stats[l]>=(l==='zh'?6000:4500),'BODY_DENSITY');assert(stats[l]===m.metrics.body[l==='zh'?'zhDenseChars':'enWords'],'BODY_METRIC');perProduct[l]=pp;details.push(structure);primary[l]=summaries;
  const r=[...h.matchAll(/<li><b>S\d+<\/b> <a href="([^"]+)"/g)].map(x=>x[1]);assert(r.length===20,'REFERENCE_LIST');references.push(r);
  const coverage=await fs.readFile(path.join(dir,'coverage.html'),'utf8');await links(coverage,dir);assert((coverage.match(/data-lane=/g)||[]).length===8,'REACHABLE_FULL_SCANS');for(const s of m.laneScans)assert(coverage.includes(s[l].slice(0,30)),'SCAN_CONTENT');
 }
 assert(JSON.stringify(ids[0])===JSON.stringify(ids[1]),'BILINGUAL_SLIDE_PARITY');assert(JSON.stringify(references[0])===JSON.stringify(references[1]),'BILINGUAL_SOURCE_PARITY');assert(JSON.stringify(details[0])===JSON.stringify(details[1]),'BILINGUAL_DETAIL_SECTION_AND_SOURCE_PARITY');
 const archive=JSON.parse(await fs.readFile(path.join(base,'manifest.json')));assert(archive[0].date===issue&&archive.filter(x=>x.date===issue).length===1,'ARCHIVE');for(const p of ['index.html','en/index.html'])assert((await fs.readFile(path.join(base,p),'utf8')).includes('data-time="latest y-2026 m-2026-10 d-2026-10-20"'),'LATEST');
 return {publicFiles:files.length,slidesPerLocale:12,primaryProjectPages:7,attachedDetails:7,body:stats,perProduct,primarySummaries:primary,scans,visuals:7,references:20,products:7,counting:'Unique full detail paragraphs only; primary summaries, sources, figures and scan prose excluded',bilingualStructureAndSources:true};
}
async function serve(){const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.txt':'text/plain'};const server=http.createServer(async(req,res)=>{try{let p=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/ai-daily\//,'/');if(p.endsWith('/'))p+='index.html';const target=path.resolve(base,'.'+p);assert(target.startsWith(base+'/'),'PATH');const b=await fs.readFile(target);res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream'});res.end(b)}catch{res.writeHead(404);res.end()}});await new Promise(r=>server.listen(0,'127.0.0.1',r));return {server,url:`http://127.0.0.1:${server.address().port}/ai-daily/`}}
const report={edition:issue,startedAt:new Date().toISOString(),status:'started',publishedCommit:cfg.phase==='live'?cfg.publicCommit:null,baselineCommit:cfg.baselineCommit,workflowBaselineCommit:process.env.QA_PUBLIC_COMMIT||null,mode:cfg.phase,checks:[],failures:[],screenshots:[]};
const out=path.join(process.env.RUNNER_TEMP||'/tmp','daily-qa-'+(process.env.QA_EVIDENCE_LOCALE||'zh'));let browser,server;
const check=(name,ok,details={})=>{report.checks.push({name,ok,...details});if(!ok)report.failures.push({name,...details})};
async function screen(page,name){await page.screenshot({path:path.join(out,name),type:'jpeg',quality:65});report.screenshots.push(name)}
try{
 report.static=await staticCheck();console.log('STATIC_REPORT '+JSON.stringify(report.static));
 if(!process.argv.includes('--static-only')){
  if(cfg.acquireAssets) await import('./acquire.mjs');
  await fs.mkdir(out,{recursive:true});const {chromium}=await import('playwright');browser=await chromium.launch({executablePath:process.env.AI_DAILY_CHROMIUM_PATH||'/usr/bin/google-chrome',chromiumSandbox:true,headless:true,args:['--enable-automation']});
  const sp=await browser.newPage(),cdp=await sp.context().newCDPSession(sp);const args=(await cdp.send('Browser.getBrowserCommandLine')).arguments;assert(!args.some(x=>/^--(?:no-sandbox|disable-setuid-sandbox)(?:=|$)/.test(x)),'SANDBOX_DISABLED');await sp.goto('chrome://sandbox');const text=await sp.locator('body').innerText();report.sandbox={seccomp:/Seccomp-BPF sandbox\s+Yes/i.test(text),namespaceOrSuid:/(?:SUID sandbox|PID namespaces)\s+Yes/i.test(text),disabledFlags:false};assert(report.sandbox.seccomp&&report.sandbox.namespaceOrSuid,'SANDBOX_NOT_VERIFIED');await sp.close();
  const live=process.env.QA_LIVE_BASE;assert(live==='https://purryc.github.io/ai-daily/','LIVE_TARGET');
  const liveFiles=JSON.parse(await fs.readFile(cfg.phase==='candidate'?'qa/baseline-public-files.json':'qa/public-files.json'));report.liveHashes=[];
  for(const f of liveFiles.filter(x=>x.path.startsWith(issue+'/')||['index.html','en/index.html','manifest.json'].includes(x.path))){const r=await fetch(new URL(f.path,live),{cache:'no-store'});const match=r.status===200&&digest(Buffer.from(await r.arrayBuffer()))===f.sha256;report.liveHashes.push({path:f.path,status:r.status,match});check(cfg.phase==='candidate'?'baseline-live-byte-match':'live-byte-match',match,{path:f.path})}
  let url=live;if(cfg.phase==='candidate'){const s=await serve();server=s.server;url=s.url}report.browserTarget=cfg.phase==='candidate'?'local public candidate in existing cloud runner':'published Pages revision';
  const locale=process.env.QA_EVIDENCE_LOCALE||'zh';assert(['zh','en'].includes(locale),'LOCALE');report.locale=locale;
  for(const viewport of [{width:1600,height:900},{width:1920,height:1080},{width:390,height:844}]){
   const mobile=viewport.width===390,context=await browser.newContext({viewport,serviceWorkers:'block'}),page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(url))errors.push(r.status()+' '+r.url())});const entry=new URL(`${issue}/${locale}/`,url).href;
   const response=await page.goto(entry,{waitUntil:'networkidle'});check('page-http',response.status()===200,{viewport});await page.evaluate(()=>document.fonts.ready);await page.locator('img').evaluateAll(els=>Promise.all(els.map(e=>e.decode())));
   const ids=await page.locator('[data-slide]').evaluateAll(els=>els.map(x=>x.id));
   for(const id of ids){await page.evaluate(id=>{location.hash=id},id);await page.waitForTimeout(50);const bounds=await page.locator('#'+id).evaluate((el,mobile)=>{
    const r=el.getBoundingClientRect(),outside=[],clipped=[],images=[],fonts=[];for(const n of el.querySelectorAll('*')){const b=n.getBoundingClientRect(),s=getComputedStyle(n);if(!b.width||!b.height)continue;if(b.left<r.left-1||b.right>r.right+1||(!mobile&&(b.top<r.top-1||b.bottom>r.bottom+1)))outside.push(n.tagName+':'+n.textContent.slice(0,55));if(['hidden','clip','scroll','auto'].includes(s.overflowY)&&n.scrollHeight>n.clientHeight+1)clipped.push(n.tagName);if(n.tagName==='IMG')images.push({loaded:n.complete&&n.naturalWidth>0,contain:s.objectFit==='contain'});if(n.matches('.summary p,.judgment p,.contents-list strong,.signals p'))fonts.push(parseFloat(s.fontSize)*(mobile?1:r.width/1440))}return {id:el.id,ratio:r.width/r.height,withinViewport:r.left>=-1&&r.right<=innerWidth+1&&(mobile||(r.top>=-1&&r.bottom<=innerHeight+1)),outside,clipped,images,minReadingFont:fonts.length?Math.min(...fonts):null,horizontalOverflow:document.documentElement.scrollWidth>innerWidth+1,verticalOverflow:document.documentElement.scrollHeight>innerHeight+1}},mobile);
    check(mobile?'mobile-primary-readability':'slide-bounds',bounds.withinViewport&&(mobile||Math.abs(bounds.ratio-16/9)<.001)&&!bounds.outside.length&&!bounds.clipped.length&&!bounds.horizontalOverflow&&(mobile||!bounds.verticalOverflow)&&bounds.images.every(x=>x.loaded&&x.contain)&&(bounds.minReadingFont===null||bounds.minReadingFont>=18),{viewport,...bounds});
    if(viewport.width===1600)await screen(page,`${locale}-${id}.jpg`);if(mobile&&['overview','event-7-a'].includes(id))await screen(page,`${locale}-mobile-${id}.jpg`);
   }
   await page.keyboard.press('Home');check('home-navigation',await page.locator('#cover').isVisible(),{viewport});await page.locator('[data-next-slide]').click();check('next-navigation',await page.locator('#overview').isVisible(),{viewport});await page.locator('.contents-list a').first().click();check('contents-navigation',await page.locator('#event-1-a').isVisible(),{viewport});await page.locator('#event-1-a .reference-marker').first().click();check('citation-navigation',await page.locator('#evidence-1').isVisible(),{viewport});
   // Each detail is opened from its actual project link, and returns to that project.
   for(let i=0;i<manifest.topics.length;i++){
    const t=manifest.topics[i],id=`event-${i+1}-a`;await page.goto(entry+'#'+id,{waitUntil:'networkidle'});const link=page.locator('#'+id+' .detail-link');check('detail-entry-visible',await link.isVisible(),{viewport,project:t.id});await link.click();await page.waitForLoadState('networkidle');await page.locator('img').evaluateAll(els=>Promise.all(els.map(e=>e.decode())));check('detail-navigation',page.url().endsWith(`/details/${t.id}.html`),{viewport,project:t.id});
    const readable=await page.evaluate(()=>{const paras=[...document.querySelectorAll('[data-product-unit] p')],bad=[];for(const p of paras){const r=p.getBoundingClientRect(),s=getComputedStyle(p);if(r.width<250||parseFloat(s.fontSize)<18||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.5||s.display==='none'||s.visibility==='hidden')bad.push('unreadable paragraph');for(let n=p;n&&n!==document.body;n=n.parentElement){const cs=getComputedStyle(n);if(['auto','scroll','clip','hidden'].includes(cs.overflowY)&&n.scrollHeight>n.clientHeight+1)bad.push('inner scrolling or clipping')}}return {paragraphs:paras.length,bad,horizontalOverflow:document.documentElement.scrollWidth>innerWidth+1,images:[...document.images].every(x=>x.complete&&x.naturalWidth>0&&getComputedStyle(x).objectFit==='contain'),languageLink:!!document.querySelector('.detail-header a:nth-child(2)'),landmark:!!document.querySelector('main[data-project-detail]')}});
    check('detail-readable',readable.paragraphs>=4&&!readable.bad.length&&!readable.horizontalOverflow&&readable.images&&readable.languageLink&&readable.landmark,{viewport,project:t.id,...readable});
    const last=page.locator('[data-product-unit]').last();await last.scrollIntoViewIfNeeded();check('detail-last-section-reachable',await last.isVisible(),{viewport,project:t.id});
    if(viewport.width===1600&&[0,6].includes(i)){await screen(page,`${locale}-detail-${i+1}-end.jpg`);await page.evaluate(()=>scrollTo(0,0));await screen(page,`${locale}-detail-${i+1}-top.jpg`)}
    if(mobile&&i===6){await page.evaluate(()=>scrollTo(0,0));await screen(page,`${locale}-mobile-detail-7.jpg`)}
    await page.locator('.detail-header .back-link').click();check('detail-return-to-same-project',await page.locator('#'+id).isVisible(),{viewport,project:t.id});
   }
   await page.goto(entry+'#coverage');await page.locator('#coverage .action').click();check('coverage-detail-navigation',await page.locator('[data-lane]').count()===8,{viewport});check('runtime-errors',errors.length===0,{viewport,errors});await context.close();
  }
  const p=await browser.newPage({viewport:{width:1600,height:900}});const home=new URL(locale==='zh'?'':'en/',url).href;const res=await p.goto(home,{waitUntil:'networkidle'});const latest=p.locator('.issue-card').first();check('overview',res.status()===200&&(await latest.getAttribute('data-time')).includes(issue)&&await latest.locator(`a[href*="/${issue}/${locale}/"]`).count()===1);await latest.locator('img').evaluate(e=>e.decode());await p.locator('[data-time-filter="latest"]').click();check('overview-latest-filter',await latest.isVisible());await screen(p,`${locale}-overview-home.jpg`);await p.close();
 }
 report.status=report.failures.length?'failed':'passed';
}catch(e){report.status='failed';report.failures.push({error:e.stack})}
finally{if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));report.finishedAt=new Date().toISOString();await fs.mkdir(out,{recursive:true});await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log('QA_REPORT '+JSON.stringify(report));if(!process.argv.includes('--static-only')){const selected=report.screenshots.filter(x=>report.locale==='zh'?/-(?:overview|event-7-a|detail-7-top|mobile-detail-7)\.jpg$/.test(x):/-(?:event-3-a|event-4-a|detail-1-end|mobile-event-7-a)\.jpg$/.test(x));for(const name of selected){const data=(await fs.readFile(path.join(out,name))).toString('base64'),n=Math.ceil(data.length/4096);for(let i=0;i<n;i++)console.log(`QA_IMAGE ${name} ${i}/${n} ${data.slice(i*4096,(i+1)*4096)}`)}}if(report.status!=='passed')process.exitCode=1}
