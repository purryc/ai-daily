import fs from 'node:fs/promises';
export async function checkArchive({browser, url, live, locale, phase, check, screen, issue}) {
  const records=JSON.parse(await fs.readFile('public/manifest.json','utf8'));
  const weeks=JSON.parse(await fs.readFile('public/weekly/manifest.json','utf8'));
  const allDates=[...records.map(r=>r.date),...weeks.map(r=>r.week_start)].sort().reverse();
  const home=new URL(locale==='zh'?'':'en/',url).href;
  const other=new URL(locale==='zh'?'en/':'',url).href;
  const p=await browser.newPage({viewport:{width:1600,height:900}});
  const errors=[];p.on('pageerror',e=>errors.push(e.message));
  async function capture(name){
    const image=p.locator('.issue-card:visible img').first();
    if(await image.count()){await image.evaluate(async img=>{img.loading='eager';await Promise.race([img.decode(),new Promise((_,reject)=>setTimeout(()=>reject(Error('Preview image did not decode')),10000))]);});}
    await screen(p,name);
  }
  if(phase==='candidate'){
    await p.goto(new URL(locale==='zh'?'':'en/',live).href,{waitUntil:'networkidle'});
    await capture(`${locale}-archive-before.jpg`);
  }
  async function ready(){
    await p.locator('[data-archive-filters][data-ready="true"]').waitFor();
    await p.evaluate(()=>document.fonts.ready);
  }
  const visibleDates=()=>p.locator('.issue-card:visible').evaluateAll(els=>els.map(e=>e.dataset.time.match(/d-(\d{4}-\d{2}-\d{2})/)[1]));
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  const res=await p.goto(home,{waitUntil:'domcontentloaded'});await ready();
  check('overview',res.status()===200&&same(await visibleDates(),allDates));
  const populated=[...new Set(allDates.map(d=>d.slice(5,7)))].sort();
  check('archive-populated-months-only',same(await p.locator('[data-archive-month]').evaluateAll(els=>els.map(e=>e.dataset.archiveMonth)),['all',...populated])&&await p.locator('[data-archive-month]:disabled').count()===0);
  check('archive-types-present',await p.locator('[data-archive-filters] button[data-archive-type]').count()===3&&await p.locator('nav a').filter({hasText:locale==='zh'?/^(日报|周报)$/:/^(Daily|Weekly)$/}).count()===0);
  check('archive-reset-hidden-default',!await p.locator('[data-archive-filters] [data-archive-reset]').isVisible());
  const expectedYears=[...new Set(allDates.map(d=>d.slice(0,4)))].sort().reverse();
  check('archive-years',same(await p.locator('[data-archive-year] option').evaluateAll(els=>els.map(e=>e.value)),['all',...expectedYears]));
  for(const width of [320,390,768,1600]){
    await p.setViewportSize({width,height:900});
    const header=await p.locator('.archive-head').evaluate(root=>{
      const title=root.querySelector('h1'),languages=root.querySelector('.lang-switch');
      const t=title.getBoundingClientRect(),l=languages.getBoundingClientRect();
      return {sameRow:title.parentElement===languages.parentElement,overlap:t.right>l.left-7,
        titleLeft:t.left,languageRight:l.right,overflow:document.documentElement.scrollWidth>innerWidth+1,
        fontSize:parseFloat(getComputedStyle(title).fontSize),languageLabel:languages.getAttribute('aria-label'),
        current:languages.querySelectorAll('[aria-current="page"]').length,
        targets:[...languages.querySelectorAll('a')].map(a=>{const r=a.getBoundingClientRect();return {width:r.width,height:r.height,href:a.getAttribute('href'),hreflang:a.hreflang}})};
    });
    check('archive-unified-title-language-header',header.sameRow&&!header.overlap&&!header.overflow&&header.titleLeft>=0&&header.languageRight<=width&&header.fontSize>=22&&Boolean(header.languageLabel)&&header.current===1&&header.targets.length===2&&header.targets.every(t=>t.width>=44&&t.height>=44&&t.hreflang),{width,...header});
    check('archive-redundant-topbar-removed',await p.locator('.topbar,.search-pill,.nav-links').count()===0,{width});
  }
  await p.setViewportSize({width:1600,height:900});
  await capture(`${locale}-archive-after.jpg`);
  for(const viewport of [{width:1600,height:900},{width:390,height:844}]){
    await p.setViewportSize(viewport);await p.goto(home,{waitUntil:'domcontentloaded'});await ready();
    const geometry=await p.locator('[data-archive-filters]').evaluate(root=>{
      const buttons=[...root.querySelectorAll('button')].filter(b=>b.getClientRects().length),labels=[...root.querySelectorAll('select')].map(e=>Boolean(document.querySelector(`label[for="${e.id}"]`)));
      return {height:root.getBoundingClientRect().height,overflow:document.documentElement.scrollWidth>innerWidth+1,buttons:buttons.map(b=>{const r=b.getBoundingClientRect();return {width:r.width,height:r.height,left:r.left,right:r.right}}),labels,
        status:root.querySelector('[role="status"]')?.getAttribute('aria-live')};
    });
    check('archive-responsive-controls',!geometry.overflow&&geometry.height<=(viewport.width>720?110:220)&&geometry.buttons.every(b=>b.width>=44&&b.height>=44&&b.left>=0&&b.right<=viewport.width+1)&&geometry.labels.every(Boolean)&&geometry.status==='polite',{viewport,...geometry});
    await p.locator('[data-archive-year]').selectOption('2026');
    const counts=await p.locator('[data-archive-month]').evaluateAll(els=>els.map(e=>({value:e.dataset.archiveMonth,label:e.getAttribute('aria-label')})));
    check('archive-real-month-counts',counts.every(x=>x.label.includes(String(x.value==='all'?allDates.filter(d=>d.startsWith('2026')).length:allDates.filter(d=>d.startsWith(`2026-${x.value}`)).length))),{viewport});
    for(const month of ['09','08']){
      const button=p.locator(`[data-archive-month="${month}"]`);
      await button.focus();await p.keyboard.press('Enter');
      const expected=allDates.filter(d=>d.startsWith('2026-'+month));
      check('archive-month-keyboard-filter',same(await visibleDates(),expected)&&await button.getAttribute('aria-pressed')==='true'&&await button.evaluate(e=>document.activeElement===e),{viewport,month,count:expected.length});

    }
    await p.locator('button[data-archive-type="daily"]').focus();await p.keyboard.press('Enter');
    check('archive-daily-august-intersection',(await visibleDates()).length===19&&await p.locator('.issue-card[data-archive-type="weekly"]:visible').count()===0&&await p.locator('button[data-archive-type="daily"]').evaluate(e=>e===document.activeElement),{viewport});
    if(viewport.width===1600)await capture(`${locale}-archive-daily.jpg`);
    await p.locator('button[data-archive-type="weekly"]').focus();await p.keyboard.press('Space');
    check('archive-type-change-valid-months',same(await visibleDates(),weeks.map(w=>w.week_start))&&same(await p.locator('[data-archive-month]').evaluateAll(els=>els.map(e=>e.dataset.archiveMonth)),['all','10'])&&await p.locator('button[data-archive-type="weekly"]').evaluate(e=>e===document.activeElement)&&!new URL(p.url()).searchParams.has('month'),{viewport});
    await p.locator('[data-archive-month="10"]').click();
    check('archive-weekly-october-intersection',same(await visibleDates(),weeks.map(w=>w.week_start))&&await p.locator('.issue-card:visible').evaluateAll(els=>els.length>0&&els.every(e=>e.dataset.archiveType==='weekly')),{viewport});
    if(viewport.width===1600)await capture(`${locale}-archive-weekly.jpg`);
    await p.locator('.lang-switch').getByRole('link',{name:locale==='zh'?'English':'中文',exact:true}).click();await ready();
    check('archive-weekly-language-state',new URL(p.url()).searchParams.get('type')==='weekly'&&new URL(p.url()).searchParams.get('month')==='10'&&same(await visibleDates(),weeks.map(w=>w.week_start)),{viewport});
    await p.goto(home+'?type=weekly&year=2026&month=10',{waitUntil:'domcontentloaded'});await ready();
    check('archive-weekly-reload',same(await visibleDates(),weeks.map(w=>w.week_start)),{viewport});
    await p.locator('button[data-archive-type="daily"]').click();
    check('archive-same-date-types-distinct',(await visibleDates()).length===records.filter(r=>r.date.startsWith('2026-10')).length&&await p.locator('.issue-card[data-archive-type="weekly"]:visible').count()===0,{viewport});
    await p.locator('button[data-archive-type="all"]').click();await p.locator('[data-archive-month="08"]').click();
    await p.locator('[data-archive-order]').selectOption('oldest');
    const august=allDates.filter(d=>d.startsWith('2026-08')).reverse();
    check('archive-independent-sort',same(await visibleDates(),august)&&await p.locator('[data-archive-month="08"]').getAttribute('aria-pressed')==='true',{viewport});
    const selectedLink=p.locator('.lang-switch').getByRole('link',{name:locale==='zh'?'English':'中文',exact:true});
    const target=await selectedLink.getAttribute('href');await selectedLink.click();await ready();
    check('archive-language-state',new URL(p.url()).pathname===new URL(other).pathname&&await p.locator('[data-archive-year]').inputValue()==='2026'&&await p.locator('[data-archive-order]').inputValue()==='oldest'&&same(await visibleDates(),august),{viewport,target});
    await p.goto(home+'?year=2026&month=08&order=oldest',{waitUntil:'domcontentloaded'});await ready();
    check('archive-reload-state',same(await visibleDates(),august),{viewport});
    await p.goto(home+'?year=2026&month=01&order=oldest',{waitUntil:'domcontentloaded'});await ready();
    check('archive-empty-state',(await visibleDates()).length===0&&await p.locator('[data-archive-empty]').isVisible(),{viewport});
    if(viewport.width===1600){await p.locator('[data-archive-empty]').scrollIntoViewIfNeeded();await capture(`${locale}-archive-empty.jpg`);}
    await p.locator('[data-archive-empty] [data-archive-reset]').click();
    check('archive-empty-reset',same(await visibleDates(),[...allDates].reverse())&&!await p.locator('[data-archive-empty]').isVisible()&&await p.locator('[data-archive-year]').evaluate(e=>e===document.activeElement),{viewport});
    await p.locator('[data-archive-year]').selectOption('2026');
    const future=await p.evaluate(()=>{const d=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',year:'numeric',month:'2-digit'}).formatToParts(new Date());return {year:d.find(p=>p.type==='year').value,month:d.find(p=>p.type==='month').value}});
    if(future.year==='2026'){
      const checks=[];for(let month=Number(future.month)+1;month<=12;month++){const value=String(month).padStart(2,'0');if(!allDates.some(d=>d.startsWith(`2026-${value}`)))checks.push(await p.locator(`[data-archive-month="${value}"]`).count()===0)}
      check('archive-empty-future-months-absent',checks.every(Boolean),{viewport,checked:checks.length});
    }
    await p.locator('[data-archive-month="09"]').click();
    await p.locator('[data-archive-filters]').scrollIntoViewIfNeeded();
    if(viewport.width===390)await capture(`${locale}-archive-mobile.jpg`);
    await p.locator('[data-archive-filters] [data-archive-reset]').focus();await p.keyboard.press('Enter');
    check('archive-toolbar-reset-focus',await p.locator('[data-archive-year]').evaluate(e=>e===document.activeElement)&&!await p.locator('[data-archive-filters] [data-archive-reset]').isVisible(),{viewport});
    await p.locator('[data-archive-order]').selectOption('newest');
    check('overview-newest-sort-keeps-all',same(await visibleDates(),allDates),{viewport});
  }
  await p.setViewportSize({width:1600,height:900});
  for(const week of weeks){
    await p.goto(home,{waitUntil:'domcontentloaded'});await ready();
    await p.locator('button[data-archive-type="weekly"]').click();
    const target=new URL(`weekly/${week.path}${locale}/`,url);
    await p.locator(`.issue-card:visible a.primary[href="${target.pathname}"]`).click();
    await p.locator('#cover').waitFor({state:'visible'});
    check('archive-weekly-actual-navigation',new URL(p.url()).pathname===target.pathname&&await p.locator('#cover').isVisible(),{week:week.week_start});
  }
  await p.goto(home,{waitUntil:'domcontentloaded'});await ready();
  const latestDaily=records[0].date,latest=p.locator('.issue-card:visible').first();
  await latest.locator(`a[href*="/${latestDaily}/${locale}/"]`).click();
  await p.locator('#cover').waitFor({state:'visible'});
  check('overview-latest-actual-navigation',new URL(p.url()).pathname===new URL(`${latestDaily}/${locale}/`,url).pathname&&await p.locator('#cover').isVisible());
  const weeklyIndex=await p.goto(new URL('weekly/',url).href,{waitUntil:'domcontentloaded'});
  check('weekly-index-http',weeklyIndex.status()===200);
  for(const width of [1600,390]){await p.setViewportSize({width,height:900});const state=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,heading:document.querySelector('h1')?.textContent,links:[...document.querySelectorAll('a')].map(a=>{const r=a.getBoundingClientRect();return r.width>0&&r.height>0})}));check('weekly-index-readable',!state.overflow&&Boolean(state.heading)&&state.links.every(Boolean),{width,...state});}
  for(const week of weeks){const target=new URL(`weekly/${week.path}${locale}/`,url).href;check('weekly-index-preserves-edition',await p.locator('a').evaluateAll((els,u)=>els.some(a=>a.href===u),target),{week:week.week_start});}
  check('archive-runtime-errors',errors.length===0,{errors});
  await p.close();
}
