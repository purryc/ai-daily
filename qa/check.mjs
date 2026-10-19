import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
export const digest=b=>createHash('sha256').update(b).digest('hex');
export const DOCUMENT='https://api-docs.deepseek.com/guides/search/';
const issue='2026-10-19';
const captions={
 en:'Official DeepSeek API documentation screenshot; not a client test. The image shows the Search request example, not a request executed by this task. Captured after the editorial cutoff; it does not prove the earlier page state.',
 zh:'DeepSeek 官方 API 文档截图，非客户端实测。图示为 Search 请求示例，并非本次实际调用结果。截图在事件截止后取得，不证明截止时页面状态。'
};
const assert=(condition,code)=>{if(!condition)throw new Error(code);};
export async function filesUnder(dir,prefix='') {
 const out=[];
 for(const e of await fs.readdir(dir,{withFileTypes:true})) {
  assert(!e.isSymbolicLink(),'SYMLINK_REFUSED');
  const name=prefix+e.name;
  if(e.isDirectory())out.push(...await filesUnder(path.join(dir,e.name),name+'/'));
  else {assert(e.isFile(),'NON_REGULAR_FILE');out.push(name);}
 }
 return out.sort();
}
export function replaceDeepSeek(h,locale,width,height) {
 let count=0;
 const out=h.replace(/<figure\b[^>]*>[\s\S]*?<\/figure>/g,figure=>{
  if(!figure.includes('src="../assets/deepseek.webp"'))return figure;
  count++;
  return `<figure class="product-figure"><a class="image-link" href="../assets/deepseek-api-docs.png" target="_blank" rel="noreferrer"><img src="../assets/deepseek-api-docs.png" width="${width}" height="${height}" alt="${captions[locale]}" decoding="async"></a><figcaption>${captions[locale]} <a class="reference-marker" href="#evidence-1" data-go-slide="evidence-1" aria-label="Reference S14">[S14]</a></figcaption></figure>`;
 });
 assert(count===1,'DEEPSEEK_FIGURE_NOT_UNIQUE');return out;
}
export async function staticCheck(base=path.join(root,'public')) {
 const allowed=JSON.parse(await fs.readFile(path.join(root,'qa/public-files.json'),'utf8'));
 const actual=await filesUnder(base);
 assert(JSON.stringify(actual)===JSON.stringify(allowed.map(x=>x.path).sort()),'PUBLIC_FILE_SET_MISMATCH');
 for(const f of allowed) {
  const b=await fs.readFile(path.join(base,f.path));assert(b.length===f.bytes&&digest(b)===f.sha256,'PUBLIC_BYTES_MISMATCH');
 }
 const ids=[];
 for(const locale of ['zh','en']) {
  const h=await fs.readFile(path.join(base,issue,locale,'index.html'),'utf8');
   const slides=[...h.matchAll(/<section\b[^>]*\bid="([^"]+)"[^>]*\bdata-slide\b/g)].map(x=>x[1]);
  assert(slides.length===28&&new Set(slides).size===28,'SLIDE_COUNT');ids.push(slides);
  assert((h.match(/class="dossier-source-row"/g)||[]).length>=24,'DOSSIERS_MISSING');
  const references=new Set([...h.matchAll(/\[S(\d{2})\]/g)].map(x=>x[1]));
  assert(references.size===34,'SOURCE_COUNT');
  for(const m of h.matchAll(/(?:src|href)="([^"]+)"/g)) {
   if(m[1].startsWith('#')||/^https?:/.test(m[1]))continue;
   let target=path.resolve(base,issue,locale,m[1]);
   assert(target===base||target.startsWith(base+'/'),'LOCAL_LINK_ESCAPE');
   if(m[1].endsWith('/'))target=path.join(target,'index.html');
   await fs.access(target);
  }
  assert(!/\/workspace\/|ruleSnapshotSha256|source-index-|PRIVATE_ROOT|original tool receipt|not recovered|原始工具回执|未恢复/.test(h),'PRIVATE_TEXT_IN_PUBLIC_HTML');
 }
 assert(JSON.stringify(ids[0])===JSON.stringify(ids[1]),'BILINGUAL_SLIDE_MISMATCH');
 return {publicFileCount:actual.length,locales:2,slidesPerLocale:28,sources:34};
}
async function serve(base) {
 const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg'};
 const server=http.createServer(async(req,res)=>{
  try {
   assert(['GET','HEAD'].includes(req.method),'METHOD');
   const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
   let file=path.resolve(base,'.'+pathname);
   if(pathname.endsWith('/'))file=path.join(file,'index.html');
   file=await fs.realpath(file);assert(file.startsWith(base+'/'),'PATH_ESCAPE');
   const bytes=await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(req.method==='HEAD'?undefined:bytes);
  }catch{res.writeHead(404);res.end();}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 return {server,url:`http://127.0.0.1:${server.address().port}`};
}
async function captureSection(page,id,destination) {
 const anchor=page.locator('#'+id);await anchor.waitFor({state:'visible'});
 await anchor.evaluate(el=>window.scrollTo(0,window.scrollY+el.getBoundingClientRect().top-100));
 await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 const rect=await anchor.evaluate(el=>{
  let next=el.nextElementSibling;
  while(next&&!next.querySelector('pre')&&next.tagName!=='PRE')next=next.nextElementSibling;
  if(!next)return null;
  const pre=next.tagName==='PRE'?next:next.querySelector('pre');
  const a=el.getBoundingClientRect(),b=pre.getBoundingClientRect();
  return {x:Math.max(0,Math.floor(Math.min(a.left,b.left)-8)),y:Math.max(0,Math.floor(a.top-8)),width:Math.ceil(Math.max(a.right,b.right)-Math.min(a.left,b.left)+16),height:Math.ceil(b.bottom-a.top+16)};
 });
 assert(rect&&rect.height>80&&rect.height<2000&&rect.width>300,'DOC_SECTION_BOUNDS');
 assert(rect.y+rect.height<=1400,'DOC_SECTION_EXCEEDS_VIEWPORT');
 await page.screenshot({path:destination,clip:rect});
 const b=await fs.readFile(destination);
 assert(b.readUInt32BE(16)===rect.width&&b.readUInt32BE(20)===rect.height,'DOC_CAPTURE_CLIPPED');
 return {anchor:'#'+id,width:b.readUInt32BE(16),height:b.readUInt32BE(20),bytes:b.length,sha256:digest(b)};
}
async function browserCheck(output) {
 assert(output&&path.isAbsolute(output)&&!output.startsWith(root+'/'),'OUTPUT_MUST_BE_ISOLATED');
 await fs.mkdir(output,{recursive:true});assert((await fs.readdir(output)).length===0,'OUTPUT_NOT_EMPTY');
 const report={schema:1,publication:false,status:'started',pixelReview:'pending',checks:[],failures:[],screenshots:[],documentation:null};
 let browser,server,phase='setup';
 const check=(name,ok,details={})=>{report.checks.push({name,ok,...details});if(!ok)report.failures.push(name);};
 try {
  await staticCheck();
  const base=path.join(output,'candidate');await fs.cp(path.join(root,'public'),base,{recursive:true});
  const {chromium}=await import('playwright');
  browser=await chromium.launch({executablePath:process.env.AI_DAILY_CHROMIUM_PATH||'/usr/bin/google-chrome',chromiumSandbox:true,headless:true,args:['--enable-automation']});
  phase='sandbox';
  const sandboxPage=await browser.newPage();
  const cdp=await sandboxPage.context().newCDPSession(sandboxPage);
  const args=(await cdp.send('Browser.getBrowserCommandLine')).arguments;
  assert(!args.some(x=>/^--(?:no-sandbox|disable-setuid-sandbox)(?:=|$)/.test(x)),'SANDBOX_DISABLED');
  await sandboxPage.goto('chrome://sandbox');
  const status=await sandboxPage.locator('body').innerText();
  const sandbox={seccomp:/Seccomp-BPF sandbox\s+Yes/i.test(status),namespaceOrSuid:/(?:SUID sandbox|PID namespaces)\s+Yes/i.test(status),disabledFlags:false};
  assert(sandbox.seccomp&&sandbox.namespaceOrSuid,'SANDBOX_NOT_VERIFIED');report.sandbox=sandbox;await sandboxPage.close();
  phase='official-document';
  const docs=await browser.newContext({viewport:{width:2400,height:1400},serviceWorkers:'block'});
  const stopped=new Set();let blocked=0,refused=false;
  await docs.route('**/*',async route=>{
   const request=route.request(),u=new URL(request.url());
   if(u.protocol!=='https:'||u.hostname!=='api-docs.deepseek.com'||request.method()!=='GET'||stopped.has(u.hostname)){blocked++;await route.abort();}
   else await route.continue();
  });
  const doc=await docs.newPage();
  doc.on('response',r=>{if([401,403].includes(r.status())){refused=true;stopped.add(new URL(r.url()).hostname);}});
  const response=await doc.goto(DOCUMENT,{waitUntil:'networkidle',timeout:45000});
  assert(response?.status()===200&&doc.url()===DOCUMENT&&!refused,'DOC_HTTP_OR_REDIRECT');
  await doc.evaluate(()=>document.fonts.ready);
  assert(await doc.locator('#search-api').count()===1&&await doc.locator('#fetch-api').count()===1,'DOC_ANCHORS_MISSING');
  assert(!/access denied|verify you are human|checking your browser/i.test((await doc.locator('body').innerText()).slice(0,3000)),'DOC_ACCESS_PAGE');
  report.documentation={url:DOCUMENT,acquiredAt:new Date().toISOString(),htmlSha256:digest(await response.body()),httpStatus:200,blockedOtherRequests:blocked,executedApiCalls:false,captures:[]};
  await fs.mkdir(path.join(output,'screenshots'),{recursive:true});
  for(const [id,name] of [['search-api','deepseek-search-request'],['response','deepseek-search-response'],['fetch-api','deepseek-fetch-request'],['response-1','deepseek-fetch-response']]) {
   report.documentation.captures.push({file:'screenshots/'+name+'.png',...await captureSection(doc,id,path.join(output,'screenshots',name+'.png'))});
  }
  const first=report.documentation.captures[0];
  await fs.copyFile(path.join(output,first.file),path.join(base,issue,'assets/deepseek-api-docs.png'));
  for(const locale of ['zh','en']) {
   const file=path.join(base,issue,locale,'index.html');await fs.writeFile(file,replaceDeepSeek(await fs.readFile(file,'utf8'),locale,first.width,first.height));
  }
  const sources=path.join(base,issue,'sources.html');
  let sourceHtml=await fs.readFile(sources,'utf8');
  sourceHtml=sourceHtml.replace(/<li>官方3D宫殿演示帧；[\s\S]*?<\/li>/,`<li>${captions.zh}<p>${captions.en}</p><a href="${DOCUMENT}">Official source / 来源</a></li>`);
  sourceHtml=sourceHtml.replace(/<\/body>/,`<section id="deepseek-document-capture"><h2>DeepSeek document capture</h2><p>${captions.en}</p><p>${captions.zh}</p><a href="${DOCUMENT}">${DOCUMENT}</a><p>Captured ${report.documentation.acquiredAt}; PNG SHA-256 ${first.sha256}</p></section></body>`);
  await fs.writeFile(sources,sourceHtml);await fs.rm(path.join(base,issue,'assets/deepseek.webp'));
  await docs.close();
  phase='bilingual-decks';
  const local=await serve(base);server=local.server;
  const ctx=await browser.newContext({viewport:{width:1600,height:900},serviceWorkers:'block'});
  await ctx.route('**/*',route=>{const r=route.request();return new URL(r.url()).origin===local.url&&['GET','HEAD'].includes(r.method())?route.continue():route.abort();});
  const page=await ctx.newPage();let pageErrors=0;page.on('pageerror',()=>pageErrors++);
  let referenceSets=[];
  for(const locale of ['zh','en']) {
   for(const viewport of [{width:1600,height:900},{width:1920,height:1080}]) {
    await page.setViewportSize(viewport);await page.goto(`${local.url}/${issue}/${locale}/`,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    if(locale==='zh'&&viewport.width===1600) {
     const fontSession=await ctx.newCDPSession(page);await fontSession.send('DOM.enable');await fontSession.send('CSS.enable');
     const {root:dom}=await fontSession.send('DOM.getDocument');const {nodeId}=await fontSession.send('DOM.querySelector',{nodeId:dom.nodeId,selector:'h1'});
     const {fonts}=await fontSession.send('CSS.getPlatformFontsForNode',{nodeId});
     check('chinese-glyph-font',fonts.some(f=>/Noto.*CJK/i.test(f.familyName)&&f.glyphCount>0));await fontSession.detach();
    }
    check(`${locale}-${viewport.width}-slide-count`,await page.locator('[data-slide]').count()===28);
    check(`${locale}-${viewport.width}-previous-boundary`,await page.locator('[data-prev-slide]').isDisabled());
    for(let index=0;index<28;index++) {
     const slide=page.locator('[data-slide]:not([hidden])');await slide.waitFor({state:'visible'});
     await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
     const metrics=await slide.evaluate(el=>{
      const b=el.getBoundingClientRect(),badText=[];
      const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;
      while(n=walker.nextNode())if(n.textContent.trim()) {const r=document.createRange();r.selectNodeContents(n);for(const q of r.getClientRects())if(q.width&&q.height&&(q.left<b.left-3||q.right>b.right+3||q.top<b.top-3||q.bottom>b.bottom+3)){badText.push(n.parentElement.tagName);break;}}
      return {id:el.id,width:b.width,height:b.height,overflowX:Math.max(0,el.scrollWidth-el.clientWidth),overflowY:Math.max(0,el.scrollHeight-el.clientHeight),outsideViewport:b.left<-2||b.top<-2||b.right>innerWidth+2||b.bottom>innerHeight+2,textOutside:badText.length,images:[...el.querySelectorAll('img')].map(i=>({loaded:i.complete&&i.naturalWidth>0,fit:getComputedStyle(i).objectFit,src:i.getAttribute('src')}))};
     });
     const ok=Math.abs(metrics.width/metrics.height-16/9)<.015&&metrics.overflowX<=2&&metrics.overflowY<=2&&!metrics.outsideViewport&&metrics.textOutside===0&&metrics.images.every(i=>i.loaded&&i.fit!=='cover');
     check(`${locale}-${viewport.width}-${metrics.id}`,ok,metrics);
     if(viewport.width===1600){const name=`screenshots/${locale}-${String(index+1).padStart(2,'0')}.jpg`;await page.screenshot({path:path.join(output,name),type:'jpeg',quality:65,fullPage:false});report.screenshots.push(name);}
     if(index<27)await page.locator('[data-next-slide]').click();
    }
    check(`${locale}-${viewport.width}-next-boundary`,await page.locator('[data-next-slide]').isDisabled());
   }
   const refs=await page.locator('.evidence-list').innerText();const sourceIds=[...new Set(refs.match(/S\d{2}/g))].sort();referenceSets.push(sourceIds);
   check(`${locale}-source-ids`,sourceIds.length===34);
   const links=await page.locator('[data-go-slide]').evaluateAll(els=>els.map(e=>e.dataset.goSlide));
   for(const id of new Set(links)){check(`${locale}-target-${id}`,await page.locator('#'+id).count()===1);}
   await page.locator('[data-go-slide="overview"]').last().click();
   await page.locator('.contents-list [data-go-slide]').first().click();check(`${locale}-contents-navigation`,await page.locator('#event-1-a').isVisible());
   await page.locator('#event-1-a .reference-marker').first().click();check(`${locale}-citation-navigation`,await page.locator('#evidence-1').isVisible());
   for(const target of [`/${issue}/sources.html`,`/${issue}/${locale==='zh'?'en':'zh'}/`,'/','/en/']){const r=await page.goto(local.url+target,{waitUntil:'domcontentloaded'});check(`${locale}-link-${target}`,r?.status()===200);}
  }
  check('bilingual-source-parity',JSON.stringify(referenceSets[0])===JSON.stringify(referenceSets[1]));
  check('javascript-errors',pageErrors===0,{count:pageErrors});
  report.status=report.failures.length?'failed':'automated-checks-passed';
  report.scope='Two 28-slide editions at 1600x900 and 1920x1080; 56 slide screenshots and 4 actual official documentation captures. Historical archive targets excluded. Editorial and pixel review remain required.';
 }catch(e){
  report.status='failed';report.failures.push(phase+':'+(/^[A-Z_]+$/.test(e.message)?e.message:/timeout/i.test(e.message)?'TIMEOUT':'OPERATION_FAILED'));
  report.failureKind=String(e.name).replace(/[^A-Za-z]/g,'').slice(0,40);
  report.failureSummary=String(e.message).split('\n')[0].replace(/https?:\/\/\S+/g,'[URL]').replace(/\/(?:home|tmp|usr|opt|run)\/\S+/g,'[path]').slice(0,200);
  report.sandboxFailureCodes=[...new Set(String(e.message).match(/No usable sandbox|Operation not permitted|Failed to move to new namespace|SUID sandbox helper binary was found|Target page, context or browser has been closed|ERR_[A-Z_]+/g)||[])];
 }
 finally {
  if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));
  report.files=[];
  for(const name of await filesUnder(output)){const b=await fs.readFile(path.join(output,name));report.files.push({path:name,bytes:b.length,sha256:digest(b)});}
  await fs.writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');
 }
 console.log(JSON.stringify({status:report.status,checks:report.checks.length,failures:report.failures,screenshots:report.screenshots.length}));
 if(report.status!=='automated-checks-passed')process.exitCode=1;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 try {if(process.argv.includes('--static-only'))console.log(JSON.stringify(await staticCheck()));else {const i=process.argv.indexOf('--output');assert(i>=0,'OUTPUT_REQUIRED');await browserCheck(process.argv[i+1]);}}
 catch(e){console.error(/^[A-Z_]+$/.test(e.message)?e.message:'STATIC_CHECK_FAILED');process.exitCode=1;}
}
