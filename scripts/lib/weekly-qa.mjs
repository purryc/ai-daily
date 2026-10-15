import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';
import {createStaticServer} from './static-server.mjs';
import {checkPdfPages} from './pdf-check.mjs';
import {atomic,sha,REPO} from './cloud-state.mjs';

export async function checkWeekly({root,weekStart,pdf=false,pilot=false,liveBase}) {
  const folder='weekly/'+weekStart+(pilot?'/pilot':'');
  const {server,origin}=await createStaticServer(root);
  const browser=await chromium.launch({executablePath:process.env.AI_DAILY_CHROMIUM_PATH??'/usr/bin/chromium'});
  const results=[],counts={};
  try {
    for(const lang of ['zh','en'])for(const viewport of [{width:1920,height:1080},{width:1440,height:810},{width:390,height:844}]) {
      const page=await browser.newPage({viewport});
      try {
        const response=await page.goto((liveBase??origin)+'/'+folder+'/'+lang+'/',{waitUntil:'networkidle'});
        if(response.status()!==200)throw new Error('Weekly HTTP '+response.status());
        await page.evaluate(()=>document.fonts.ready);
        const ids=await page.locator('.slide').evaluateAll(slides=>slides.map(s=>s.id));
        if(!ids.length||ids.length>50)throw new Error('Weekly page count outside 1–50');
        if(counts[lang]&&counts[lang]!==ids.length)throw new Error('Page count changes by viewport');
        counts[lang]=ids.length;
        const problems=[];
        for(let i=0;i<ids.length;i++) {
          await page.evaluate(id=>{location.hash=id;dispatchEvent(new HashChangeEvent('hashchange'));},ids[i]);
          const result=await page.locator('.slide').nth(i).evaluate(s=>{
            const content=s.querySelector('.content');
            return {id:s.id,vertical:s.scrollHeight-s.clientHeight,horizontal:s.scrollWidth-s.clientWidth,content:content?content.scrollHeight-content.clientHeight:0,ratio:s.getBoundingClientRect().width/s.getBoundingClientRect().height};
          });
          if(result.vertical>4||result.horizontal>4||(viewport.width>700&&(result.content>4||Math.abs(result.ratio-16/9)>.01)))problems.push(result);
        }
        const bodyOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
        const images=await page.locator('img').evaluateAll(images=>images.filter(i=>!i.complete||!i.naturalWidth||getComputedStyle(i).objectFit==='cover').map(i=>i.src));
        if(problems.length||bodyOverflow>4||images.length)throw new Error('Weekly layout/evidence failure: '+JSON.stringify({problems,bodyOverflow,images}));
        // Test real controls and language/source links rather than only switching CSS.
        await page.evaluate(()=>{location.hash='#'+document.querySelector('.slide').id;dispatchEvent(new HashChangeEvent('hashchange'));});
        if(viewport.width>700&&ids.length>1) {
          await page.locator('[data-next]').click();
          if(await page.locator('.slide.active').getAttribute('id')!==ids[1])throw new Error('Next navigation failed');
          await page.locator('[data-prev]').click();
          if(await page.locator('.slide.active').getAttribute('id')!==ids[0])throw new Error('Previous navigation failed');
        }
        const localLinks=await page.locator('a[href]').evaluateAll(as=>as.map(a=>a.getAttribute('href')).filter(h=>h&&!h.startsWith('#')&&!/^https?:/.test(h)));
        if(!liveBase)for(const link of new Set(localLinks)) {
          const resolved=new URL(link,page.url());
          // The dry output deliberately has no daily archive; its public URL is preserved.
          if(['/ai-daily/','/ai-daily/weekly/'].includes(resolved.pathname))continue;
          const res=await page.request.get(resolved.href);
          if(res.status()!==200)throw new Error('Broken weekly navigation '+link);
        }
        results.push({lang,viewport,pages:ids.length,overflow:0,images:images.length,navigation:'passed'});
        if(pdf&&viewport.width===1920) {
          if(liveBase)throw new Error('PDF export only accepts local reviewed output');
          await page.emulateMedia({media:'print'});
          const file=path.join(root,folder,'ai-weekly-'+weekStart+'-'+lang+'.pdf');
          const temporary=file+'.tmp';
          try {
            await page.pdf({path:temporary,preferCSSPageSize:true,printBackground:true});
            const pages=await checkPdfPages(temporary);
            if(pages!==ids.length)throw new Error('Weekly PDF/HTML page count mismatch: '+pages+'/'+ids.length);
            await fs.rename(temporary,file);
          } finally {await fs.rm(temporary,{force:true});}
        }
      } finally {await page.close();}
    }
    if(counts.zh!==counts.en)throw new Error('Bilingual weekly page plan differs');
    const manifestFile=path.join(root,folder,'manifest.json');
    const sourceBytes=await fs.readFile(manifestFile);
    const result={weekStart,counts,results,pdf:pdf?'chromium validated':'not requested',live:!!liveBase,manifestSha256:sha(sourceBytes)};
    if(!liveBase&&path.resolve(root)!==REPO)await atomic(path.join(root,folder,'qa.json'),result);
    return result;
  } finally {await browser.close();await new Promise(r=>server.close(r));}
}
