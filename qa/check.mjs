import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {createHash} from 'node:crypto';
const root=process.cwd(),base=path.join(root,'public'),issue='2026-10-20';
const digest=b=>createHash('sha256').update(b).digest('hex');
const assert=(v,m)=>{if(!v)throw Error(m)};
async function filesUnder(dir,prefix=''){
 const out=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){
  assert(!e.isSymbolicLink(),'SYMLINK');
  if(e.isDirectory())out.push(...await filesUnder(path.join(dir,e.name),prefix+e.name+'/'));
  else{assert(e.isFile(),'NONFILE');out.push(prefix+e.name);}
 }return out.sort();
}
const counts=(s,lang)=>lang==='zh'?(s.match(/[\u3400-\u9fff]/g)||[]).length:(s.match(/\b[\w]+(?:[’'-][\w]+)*\b/g)||[]).length;
async function staticCheck(){
 const files=JSON.parse(await fs.readFile('qa/public-files.json'));
 assert(JSON.stringify(await filesUnder(base))===JSON.stringify(files.map(x=>x.path).sort()),'FILE_SET');
 for(const f of files){const b=await fs.readFile(path.join(base,f.path));assert(digest(b)===f.sha256&&b.length===f.bytes,'HASH '+f.path);}
 const m=JSON.parse(await fs.readFile(path.join(base,issue,'manifest.json'))),sources=JSON.parse(await fs.readFile(path.join(base,issue,'sources.json'))),visuals=JSON.parse(await fs.readFile(path.join(base,issue,'visuals.json')));
 assert(m.topics.length===6&&sources.length===20&&new Set(sources.map(x=>x.url)).size===20&&visuals.length===6,'COUNTS');
 assert(m.cutoff==='2026-10-20T14:08:00Z'&&m.timezone==='America/Toronto','TIME');
 const scans=m.laneScans.map(x=>({lane:x.lane,zh:counts(x.zh,'zh'),en:counts(x.en,'en')}));
 for(const x of scans)assert(x.zh>=180&&x.en>=140,'SCAN_DENSITY '+JSON.stringify(x));
 assert(scans.length===8,'EIGHT_LANES');
 for(const v of visuals){assert(v.sourcePage&&v.originalUrl&&v.acquiredAt,'VISUAL_PROVENANCE');assert(digest(await fs.readFile(path.join(base,issue,v.path)))===v.sha256,'VISUAL_HASH');}
 const ids=[],stats={},perProduct={},refs=[];
 for(const lang of ['zh','en']){
  const h=await fs.readFile(path.join(base,issue,lang,'index.html'),'utf8');
  const slideIds=[...h.matchAll(/<section\b[^>]*id="([^"]+)"[^>]*data-slide/g)].map(x=>x[1]);ids.push(slideIds);assert(slideIds.length===m.metrics.slidesPerLocale,'SLIDES');
  const paragraphs=[...h.matchAll(/data-product-unit[^>]*>[\s\S]*?<p>([\s\S]*?)<\/p>/g)].map(x=>x[1].replace(/&#x27;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
  stats[lang]=counts(paragraphs.join(' '),lang);assert(stats[lang]>=(lang==='zh'?6000:4500),'BODY_DENSITY');
  perProduct[lang]={};for(let i=1;i<=6;i++){
   const sections=[...h.matchAll(new RegExp(`<section id="event-${i}-[^\"]+"[\\s\\S]*?<\\/section>`,'g'))].map(x=>x[0]).join('');
   const pp=[...sections.matchAll(/data-product-unit[^>]*>[\s\S]*?<p>([\s\S]*?)<\/p>/g)].map(x=>x[1].replace(/&#x27;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
   perProduct[lang][i]=counts(pp.join(' '),lang);assert(perProduct[lang][i]>=(lang==='zh'?520:380),'PRODUCT_DENSITY '+lang+i);
  }
  const r=[...h.matchAll(/<li><b>S\d+<\/b> <a href="([^"]+)"/g)].map(x=>x[1]);assert(r.length===20,'REFERENCE_LIST');refs.push(r);
  assert((h.match(/<figure>/g)||[]).length===6,'FIGURES');
  for(const a of h.matchAll(/(?:src|href)="([^"]+)"/g)){
   if(a[1].startsWith('#')||/^https?:/.test(a[1]))continue;
   let target=path.resolve(base,issue,lang,a[1]);assert(target.startsWith(base+'/')||target===base,'PATH_ESCAPE');if(a[1].endsWith('/'))target=path.join(target,'index.html');await fs.access(target);
  }
  assert(!/\/workspace\/|sk-proj-|PRIVATE_ROOT|TODO|Lorem ipsum/.test(h),'PRIVATE_OR_PLACEHOLDER');
 }
 assert(JSON.stringify(ids[0])===JSON.stringify(ids[1]),'BILINGUAL_SLIDE_PARITY');
 assert(JSON.stringify(refs[0])===JSON.stringify(refs[1]),'BILINGUAL_SOURCE_PARITY');
 const archive=JSON.parse(await fs.readFile(path.join(base,'manifest.json')));assert(archive[0].date===issue&&archive.filter(x=>x.date===issue).length===1,'ARCHIVE');
 for(const p of ['index.html','en/index.html'])assert((await fs.readFile(path.join(base,p),'utf8')).includes('data-time="latest y-2026 m-2026-10 d-2026-10-20"'),'LATEST');
 return {publicFiles:files.length,slidesPerLocale:ids[0].length,body:stats,perProduct,scans,visuals:6,references:20,products:6,bilingualStructureAndSources:true};
}
async function serve(){
 const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg'};
 const server=http.createServer(async(req,res)=>{try{
  let p=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/ai-daily\//,'/');if(p.endsWith('/'))p+='index.html';
  const target=path.resolve(base,'.'+p);assert(target.startsWith(base+'/'),'PATH');const b=await fs.readFile(target);res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream'});res.end(b);
 }catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));return {server,url:`http://127.0.0.1:${server.address().port}/ai-daily/`};
}
const report={edition:issue,startedAt:new Date().toISOString(),status:'started',publishedCommit:process.env.QA_PUBLIC_COMMIT||null,mode:process.env.QA_LIVE_BASE?'live':'candidate',checks:[],failures:[],screenshots:[]};
let browser,server;
const out=path.join(process.env.RUNNER_TEMP||'/tmp','daily-qa-'+(process.env.QA_EVIDENCE_LOCALE||'zh'));
const check=(name,ok,details={})=>{report.checks.push({name,ok,...details});if(!ok)report.failures.push({name,...details});};
try{
 report.static=await staticCheck();console.log('STATIC_REPORT '+JSON.stringify(report.static));
 if(!process.argv.includes('--static-only')){
  await fs.mkdir(out,{recursive:true});
  const {chromium}=await import('playwright');
  browser=await chromium.launch({executablePath:process.env.AI_DAILY_CHROMIUM_PATH||'/usr/bin/google-chrome',chromiumSandbox:true,headless:true,args:['--enable-automation']});
  const sp=await browser.newPage();const cdp=await sp.context().newCDPSession(sp);const args=(await cdp.send('Browser.getBrowserCommandLine')).arguments;
  assert(!args.some(x=>/^--(?:no-sandbox|disable-setuid-sandbox)(?:=|$)/.test(x)),'SANDBOX_DISABLED');
  await sp.goto('chrome://sandbox');const text=await sp.locator('body').innerText();
  report.sandbox={seccomp:/Seccomp-BPF sandbox\s+Yes/i.test(text),namespaceOrSuid:/(?:SUID sandbox|PID namespaces)\s+Yes/i.test(text),disabledFlags:false};assert(report.sandbox.seccomp&&report.sandbox.namespaceOrSuid,'SANDBOX_NOT_VERIFIED');await sp.close();
  let url=process.env.QA_LIVE_BASE;
  if(!url){const s=await serve();server=s.server;url=s.url;}
  else{
   assert(url==='https://purryc.github.io/ai-daily/','LIVE_TARGET');
   const files=JSON.parse(await fs.readFile('qa/public-files.json'));
   const selected=files.filter(x=>x.path.startsWith(issue+'/')||['index.html','en/index.html','manifest.json'].includes(x.path));
   report.liveHashes=[];
   for(const f of selected){const r=await fetch(new URL(f.path,url),{cache:'no-store'});const hash=digest(Buffer.from(await r.arrayBuffer()));const ok=r.status===200&&hash===f.sha256;report.liveHashes.push({path:f.path,status:r.status,match:ok});check('live-byte-match',ok,{path:f.path});}
  }
  const locale=process.env.QA_EVIDENCE_LOCALE||'zh';assert(['zh','en'].includes(locale),'LOCALE');report.locale=locale;
  for(const viewport of [{width:1600,height:900},{width:1920,height:1080},{width:390,height:844}]){
   const context=await browser.newContext({viewport,serviceWorkers:'block'});const page=await context.newPage();const errors=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(url))errors.push(r.status()+' '+r.url());});
   const response=await page.goto(new URL(`${issue}/${locale}/`,url).href,{waitUntil:'networkidle'});check('page-http',response.status()===200,{viewport});await page.evaluate(()=>document.fonts.ready);await page.locator('img').evaluateAll(els=>Promise.all(els.map(e=>e.decode())));
   const ids=await page.locator('[data-slide]').evaluateAll(els=>els.map(x=>x.id));
   const visit=viewport.width===390?[ids[0],ids[2],ids.at(-1)]:ids;
   for(const id of visit){
    await page.evaluate(id=>{location.hash=id},id);await page.waitForTimeout(40);
    const bounds=await page.locator('#'+id).evaluate(el=>{
     const r=el.getBoundingClientRect(),outside=[],clipped=[],images=[];
     for(const n of el.querySelectorAll('*')){
      const b=n.getBoundingClientRect(),s=getComputedStyle(n);if(!b.width||!b.height)continue;
      if(b.left<r.left-1||b.top<r.top-1||b.right>r.right+1||b.bottom>r.bottom+1)outside.push(n.tagName+':'+n.textContent.slice(0,55));
      if(['hidden','clip','scroll','auto'].includes(s.overflowY)&&n.scrollHeight>n.clientHeight+1)clipped.push(n.tagName);
      if(n.tagName==='IMG')images.push({loaded:n.complete&&n.naturalWidth>0,contain:s.objectFit==='contain'});
     }
     return {id:el.id,ratio:r.width/r.height,withinViewport:r.left>=-1&&r.top>=-1&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1,outside,clipped,images,documentOverflow:document.documentElement.scrollWidth>innerWidth+1||document.documentElement.scrollHeight>innerHeight+1};
    });
    check('slide-bounds',bounds.withinViewport&&Math.abs(bounds.ratio-16/9)<0.001&&bounds.outside.length===0&&bounds.clipped.length===0&&!bounds.documentOverflow&&bounds.images.every(x=>x.loaded&&x.contain),{viewport,...bounds});
    if(viewport.width===1600){
     const name=`${locale}-${id}.jpg`;await page.screenshot({path:path.join(out,name),type:'jpeg',quality:60});report.screenshots.push(name);
    }
   }
   await page.keyboard.press('Home');check('home-navigation',await page.locator('#overview').isVisible(),{viewport});
   await page.locator('[data-next-slide]').click();check('next-navigation',await page.locator('#timing').isVisible(),{viewport});
   await page.locator('[data-prev-slide]').click();await page.locator('.contents-list a').first().click();check('contents-navigation',await page.locator('#event-1-a').isVisible(),{viewport});
   await page.locator('#event-1-a .reference-marker').first().click();check('citation-navigation',await page.locator('#evidence-1').isVisible(),{viewport});
   check('runtime-errors',errors.length===0,{viewport,errors});await context.close();
  }
  const p=await browser.newPage({viewport:{width:1600,height:900}});const home=new URL(locale==='zh'?'':'en/',url).href;const res=await p.goto(home,{waitUntil:'networkidle'});
  const latest=p.locator('.issue-card').first();check('overview',res.status()===200&&(await latest.getAttribute('data-time')).includes(issue)&&await latest.locator(`a[href*="/${issue}/${locale}/"]`).count()===1);
  await latest.locator('img').evaluate(e=>e.decode());await p.locator('[data-time-filter="latest"]').click();check('overview-latest-filter',await latest.isVisible());
  const name=`${locale}-overview-home.jpg`;await p.screenshot({path:path.join(out,name),type:'jpeg',quality:60});report.screenshots.push(name);await p.close();
 }
 report.status=report.failures.length?'failed':'passed';
}catch(e){report.status='failed';report.failures.push({error:e.stack});}
finally{
 if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));
 report.finishedAt=new Date().toISOString();await fs.mkdir(out,{recursive:true});await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2));
 console.log('QA_REPORT '+JSON.stringify(report));
 if(!process.argv.includes('--static-only')){
  // Bounded public screenshots for visual review; all pages remain in the artifact.
  const selected=report.screenshots.filter(x=>report.locale==='en'?/-(?:event-4-d|event-5-c|event-5-d|overview-home)\.jpg$/.test(x):/-(?:event-3-a|event-5-b|evidence-1|overview-home)\.jpg$/.test(x));
  for(const name of selected){const data=(await fs.readFile(path.join(out,name))).toString('base64');const n=Math.ceil(data.length/4096);for(let i=0;i<n;i++)console.log(`QA_IMAGE ${name} ${i}/${n} ${data.slice(i*4096,(i+1)*4096)}`);}
 }
 if(report.status!=='passed')process.exitCode=1;
}
