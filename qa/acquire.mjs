import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
const dir=process.env.RUNNER_TEMP+'/daily-acquisition';
await fs.mkdir(dir,{recursive:true});
const plan=JSON.parse(await fs.readFile(new URL('./acquire.json',import.meta.url))).filter(x=>!x.locale||x.locale===process.env.QA_EVIDENCE_LOCALE);
const report=[];
for(const item of plan){
 try {
  let bytes;
  if(item.kind==='image'){
   const r=await fetch(item.url);if(!r.ok)throw Error('HTTP '+r.status);
   if(!r.headers.get('content-type')?.startsWith('image/'))throw Error('Not an image');
   bytes=Buffer.from(await r.arrayBuffer());
   if(item.renderImage){
    const b=await chromium.launch({executablePath:process.env.AI_DAILY_CHROMIUM_PATH,chromiumSandbox:true,headless:true});
    try{
     const p=await b.newPage({viewport:{width:1400,height:1200}});
     await p.setContent('<style>body{margin:0}img{display:block;max-width:1400px;max-height:1100px;object-fit:contain}</style><img>');
     await p.locator('img').evaluate((el,data)=>{el.src=data},'data:'+r.headers.get('content-type')+';base64,'+bytes.toString('base64'));
     await p.locator('img').evaluate(el=>el.decode());
     if(item.captureDelayMs)await p.waitForTimeout(item.captureDelayMs);
     bytes=await p.locator('img').screenshot({type:'jpeg',quality:90});
    }finally{await b.close();}
   }
  }else if(item.kind==='inventory'){
   const b=await chromium.launch({executablePath:process.env.AI_DAILY_CHROMIUM_PATH,chromiumSandbox:true,headless:true});
   try{
    const p=await b.newPage({viewport:{width:1600,height:1000}});
    await p.goto(item.url,{waitUntil:'domcontentloaded',timeout:45000});await p.waitForTimeout(1500);
    const data=await p.evaluate(()=>{
     const ancestors=n=>{const a=[];for(let i=0;n&&i<5;i++,n=n.parentElement)a.push({tag:n.tagName,id:n.id,class:String(n.className).slice(0,200),text:(n.innerText||'').slice(0,700)});return a};
     return {url:location.href,title:document.title,dates:[...document.querySelectorAll('time,meta[property*="published"],meta[property*="modified"]')].map(n=>({tag:n.tagName,datetime:n.getAttribute('datetime'),content:n.getAttribute('content'),text:n.textContent})),jsonDates:[...document.querySelectorAll('script[type="application/ld+json"]')].flatMap(n=>[...n.textContent.matchAll(/"(?:datePublished|dateModified)"\s*:\s*"[^"]+"/g)].map(m=>m[0])),videos:[...document.querySelectorAll('video')].map((v,i)=>({index:i,src:v.currentSrc||v.src,poster:v.poster,sources:[...v.querySelectorAll('source')].map(s=>s.src),attributes:Object.fromEntries([...v.attributes].map(a=>[a.name,a.value])),ancestors:ancestors(v)})),images:[...document.images].map(i=>({src:i.currentSrc||i.src,alt:i.alt,width:i.naturalWidth,height:i.naturalHeight})),inputs:[...document.querySelectorAll('input[placeholder]')].map(n=>({placeholder:n.placeholder,ancestors:ancestors(n)}))};
    });bytes=Buffer.from(JSON.stringify(data,null,2));
   }finally{await b.close();}
  }else{
   const b=await chromium.launch({executablePath:process.env.AI_DAILY_CHROMIUM_PATH,chromiumSandbox:true,headless:true});
   try{
    const p=await b.newPage({viewport:{width:1600,height:1000}});
    let r;if(item.kind==='html'){r=await fetch(item.url);if(!r.ok)throw Error('HTTP '+r.status);await p.setContent(await r.text(),{waitUntil:'networkidle'});}else{r=await p.goto(item.url,{waitUntil:'networkidle',timeout:45000});if(!r?.ok())throw Error('HTTP '+r?.status());}
    await p.evaluate(()=>document.fonts.ready);
    if(item.selector){
     const target=p.locator(item.selector).first();await target.scrollIntoViewIfNeeded();
     if(item.url.includes('mirrorship')){await target.getByRole('tab').last().click();await p.waitForTimeout(1000);}
     bytes=await target.screenshot({type:'jpeg',quality:90});
    } else bytes=await p.screenshot({fullPage:false,type:'jpeg',quality:90});
   }finally{await b.close();}
  }
  if(bytes.length>8000000)throw Error('Too large');
  await fs.writeFile(dir+'/'+item.name,bytes);
  report.push({...item,status:'success',bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),acquiredAt:new Date().toISOString()});
 }catch(e){report.push({...item,status:'failed',error:e.message});}
}
await fs.writeFile(dir+'/acquisition.json',JSON.stringify(report,null,2));
console.log('ACQUISITION_REPORT '+JSON.stringify(report));
for(const name of [...report.filter(x=>x.status==='success').map(x=>x.name),'acquisition.json']){
 const data=(await fs.readFile(dir+'/'+name)).toString('base64'),count=Math.ceil(data.length/4096);
 for(let i=0;i<count;i++)console.log(`PUBLIC_ASSET ${name} ${i}/${count} ${data.slice(i*4096,(i+1)*4096)}`);
}
