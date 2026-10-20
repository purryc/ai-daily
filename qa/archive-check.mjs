import fs from 'node:fs/promises';
export async function checkArchive({browser, url, live, locale, phase, check, screen, issue}) {
  const records=JSON.parse(await fs.readFile('public/manifest.json','utf8'));
  const allDates=records.map(r=>r.date).sort().reverse();
  const home=new URL(locale==='zh'?'':'en/',url).href;
  const other=new URL(locale==='zh'?'en/':'',url).href;
  const p=await browser.newPage({viewport:{width:1600,height:900}});
  const errors=[];p.on('pageerror',e=>errors.push(e.message));
  if(phase==='candidate'){
    await p.goto(new URL(locale==='zh'?'':'en/',live).href,{waitUntil:'networkidle'});
    await screen(p,`${locale}-archive-before.jpg`);
  }
  async function ready(){
    await p.locator('[data-archive-filters][data-ready="true"]').waitFor();
    await p.evaluate(()=>document.fonts.ready);
  }
  const visibleDates=()=>p.locator('.issue-card:visible').evaluateAll(els=>els.map(e=>e.dataset.time.match(/d-(\d{4}-\d{2}-\d{2})/)[1]));
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  const res=await p.goto(home,{waitUntil:'domcontentloaded'});await ready();
  check('overview',res.status()===200&&same(await visibleDates(),allDates));
  check('archive-all-months',await p.locator('[data-archive-month]').count()===13);
  const expectedYears=[...new Set(allDates.map(d=>d.slice(0,4)))].sort().reverse();
  check('archive-years',same(await p.locator('[data-archive-year] option').evaluateAll(els=>els.map(e=>e.value)),['all',...expectedYears]));
  await screen(p,`${locale}-archive-after.jpg`);
  for(const viewport of [{width:1600,height:900},{width:390,height:844}]){
    await p.setViewportSize(viewport);await p.goto(home,{waitUntil:'domcontentloaded'});await ready();
    const geometry=await p.locator('[data-archive-filters]').evaluate(root=>{
      const buttons=[...root.querySelectorAll('button')],labels=[...root.querySelectorAll('select')].map(e=>Boolean(document.querySelector(`label[for="${e.id}"]`)));
      return {overflow:document.documentElement.scrollWidth>innerWidth+1,buttons:buttons.map(b=>{const r=b.getBoundingClientRect();return {width:r.width,height:r.height,left:r.left,right:r.right}}),labels,
        status:root.querySelector('[role="status"]')?.getAttribute('aria-live')};
    });
    check('archive-responsive-controls',!geometry.overflow&&geometry.buttons.every(b=>b.width>=44&&b.height>=44&&b.left>=0&&b.right<=viewport.width+1)&&geometry.labels.every(Boolean)&&geometry.status==='polite',{viewport,...geometry});
    await p.locator('[data-archive-year]').selectOption('2026');
    const counts=await p.locator('[data-archive-month]').evaluateAll(els=>els.map(e=>({value:e.dataset.archiveMonth,label:e.getAttribute('aria-label')})));
    check('archive-real-month-counts',counts.every(x=>x.label.includes(String(x.value==='all'?allDates.filter(d=>d.startsWith('2026')).length:allDates.filter(d=>d.startsWith(`2026-${x.value}`)).length))),{viewport});
    for(const month of ['09','08']){
      const button=p.locator(`[data-archive-month="${month}"]`);
      await button.focus();await p.keyboard.press('Enter');
      const expected=allDates.filter(d=>d.startsWith('2026-'+month));
      check('archive-month-keyboard-filter',same(await visibleDates(),expected)&&await button.getAttribute('aria-pressed')==='true',{viewport,month,count:expected.length});
      if(viewport.width===1600)await screen(p,`${locale}-archive-${month}.jpg`);
    }
    await p.locator('[data-archive-order]').selectOption('oldest');
    const august=allDates.filter(d=>d.startsWith('2026-08')).reverse();
    check('archive-independent-sort',same(await visibleDates(),august)&&await p.locator('[data-archive-month="08"]').getAttribute('aria-pressed')==='true',{viewport});
    const selectedLink=p.locator(`.lang-switch a[href^="${other}"]`);
    const target=await selectedLink.getAttribute('href');await selectedLink.click();await ready();
    check('archive-language-state',new URL(p.url()).pathname===new URL(other).pathname&&await p.locator('[data-archive-year]').inputValue()==='2026'&&await p.locator('[data-archive-order]').inputValue()==='oldest'&&same(await visibleDates(),august),{viewport,target});
    await p.goto(home+'?year=2026&month=08&order=oldest',{waitUntil:'domcontentloaded'});await ready();
    check('archive-reload-state',same(await visibleDates(),august),{viewport});
    await p.locator('[data-archive-month="01"]').click();
    check('archive-empty-state',(await visibleDates()).length===0&&await p.locator('[data-archive-empty]').isVisible(),{viewport});
    if(viewport.width===1600)await screen(p,`${locale}-archive-empty.jpg`);
    await p.locator('[data-archive-empty] [data-archive-reset]').click();
    check('archive-empty-reset',same(await visibleDates(),[...allDates].reverse())&&!await p.locator('[data-archive-empty]').isVisible()&&await p.locator('[data-archive-year]').evaluate(e=>e===document.activeElement),{viewport});
    await p.locator('[data-archive-year]').selectOption('2026');
    const future=await p.evaluate(()=>{const d=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',year:'numeric',month:'2-digit'}).formatToParts(new Date());return {year:d.find(p=>p.type==='year').value,month:d.find(p=>p.type==='month').value}});
    if(future.year==='2026'){
      const checks=[];for(let month=Number(future.month)+1;month<=12;month++){const value=String(month).padStart(2,'0');if(!allDates.some(d=>d.startsWith(`2026-${value}`)))checks.push(await p.locator(`[data-archive-month="${value}"]`).isDisabled())}
      check('archive-future-unavailable',checks.every(Boolean),{viewport,checked:checks.length});
    }
    await p.locator('[data-archive-month="09"]').click();
    await p.locator('[data-archive-filters]').scrollIntoViewIfNeeded();
    if(viewport.width===390)await screen(p,`${locale}-archive-mobile.jpg`);
    await p.locator('[data-archive-filters] [data-archive-reset]').click();
    await p.locator('[data-archive-order]').selectOption('newest');
    check('overview-newest-sort-keeps-all',same(await visibleDates(),allDates),{viewport});
  }
  await p.setViewportSize({width:1600,height:900});await p.goto(home,{waitUntil:'domcontentloaded'});await ready();
  const latest=p.locator('.issue-card:visible').first();
  await latest.locator(`a[href*="/${issue}/${locale}/"]`).click();
  check('overview-latest-actual-navigation',new URL(p.url()).pathname===new URL(`${issue}/${locale}/`,url).pathname&&await p.locator('#cover').isVisible());
  check('archive-runtime-errors',errors.length===0,{errors});
  await p.close();
}
