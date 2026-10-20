import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
const dir=process.env.RUNNER_TEMP+'/daily-acquisition';
await fs.mkdir(dir,{recursive:true});
const plan=JSON.parse(await fs.readFile(new URL('./acquire.json',import.meta.url)));
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
     bytes=await p.locator('img').screenshot({type:'jpeg',quality:90});
    }finally{await b.close();}
   }
  }else{
   const b=await chromium.launch({executablePath:process.env.AI_DAILY_CHROMIUM_PATH,chromiumSandbox:true,headless:true});
   try{
    const p=await b.newPage({viewport:{width:1600,height:1000}});
    const r=await p.goto(item.url,{waitUntil:'networkidle',timeout:45000});
    if(!r?.ok())throw Error('HTTP '+r?.status());
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
