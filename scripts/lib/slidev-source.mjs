import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {buildVisualSlides,visualIssueCss} from './issue-visuals.mjs';
import {REPO} from './cloud-state.mjs';
import {chromium} from 'playwright';
import {createStaticServer} from './static-server.mjs';
const run=(args,cwd)=>new Promise((resolve,reject)=>{
  const child=spawn('npm',args,{cwd,stdio:'inherit',env:{...process.env,npm_config_cache:'/tmp/ai-daily-npm-cache'}});
  child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(new Error('Slidev npm command failed with '+code)));
});
export async function buildSlidevSource({issue,output,assetsDir,sources}) {
  const folder=path.join(output,'output/slidev','ai-product-morning-brief-'+issue.date);
  if(folder.startsWith(REPO+path.sep))throw new Error('Slidev dry source must stay outside public checkout');
  await fs.mkdir(path.join(folder,'public/assets'),{recursive:true});
  await fs.mkdir(path.join(folder,'styles'),{recursive:true});
  if(assetsDir)await fs.cp(assetsDir,path.join(folder,'public/assets'),{recursive:true,dereference:true});
  await fs.writeFile(path.join(folder,'sources.md'),sources);
  await fs.writeFile(path.join(folder,'package.json'),JSON.stringify({name:'ai-product-morning-brief-'+issue.date,private:true,type:'module',scripts:{build:'slidev build slides.md --base ./ --out dist', 'build:en':'slidev build slides-en.md --base ./ --out dist-en'},devDependencies:{'@slidev/cli':'53.0.0','@slidev/theme-default':'0.25.0',vue:'3.5.44'}},null,2)+'\n');
  for(const locale of ['zh','en']) {
    const pages=buildVisualSlides(issue,locale);
    const slides='---\ntheme: default\nlayout: none\naspectRatio: 16/9\ncanvasWidth: 1600\nfonts:\n  provider: none\ntitle: '+JSON.stringify(locale==='zh'?issue.zhTitle:issue.enTitle)+'\n---\n\n'+pages.map(p=>p.html.replace('<section ','<section v-pre ').replaceAll('../assets/','/assets/')).join('\n\n---\nlayout: none\n---\n\n')+'\n';
    await fs.writeFile(path.join(folder,locale==='zh'?'slides.md':'slides-en.md'),slides);
  }
  await fs.writeFile(path.join(folder,'styles/index.css'),visualIssueCss()+'\n.report-slide{display:block!important;width:1600px;height:900px;padding:24px 30px;overflow:visible;box-sizing:border-box;font-size:14px;background:#fffdfa}.report-slide h1{font-size:32px}.product-slide>h2{font-size:24px}.dossier-unit p{font-size:12px;line-height:1.35}.dossier-unit h3{font-size:12px}.dossier-body{grid-template-columns:180px minmax(0,1fr)}');
  await run(['install','--package-lock-only','--ignore-scripts'],folder);
  await run(['ci'],folder);
  await run(['run','build'],folder);await run(['run','build:en'],folder);
  for(const file of ['dist/index.html','dist-en/index.html'])await fs.access(path.join(folder,file));
  const browser=await chromium.launch({executablePath:process.env.AI_DAILY_CHROMIUM_PATH??'/usr/bin/chromium'});
  try {for(const [locale,dir] of [['zh','dist'],['en','dist-en']]) {
    const {server,origin}=await createStaticServer(path.join(folder,dir));
    const page=await browser.newPage({viewport:{width:1440,height:810}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    try {
      await page.goto(origin+'/',{waitUntil:'networkidle'});
      for(const slide of buildVisualSlides(issue,locale)) {
        await page.waitForFunction(id=>[...document.querySelectorAll('[data-slide]')].some(s=>s.id===id&&s.getBoundingClientRect().width>0),slide.id);
        const diagnostic=await page.evaluate(id=>{
          const s=[...document.querySelectorAll('[data-slide]')].find(s=>s.id===id&&s.getBoundingClientRect().width>0),r=s.getBoundingClientRect();
          return {id,h:s.scrollHeight-s.clientHeight,w:s.scrollWidth-s.clientWidth,bottom:r.bottom,right:r.right,broken:[...s.querySelectorAll('img')].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)};
        },slide.id);
        if(diagnostic.h>4||diagnostic.w>4||diagnostic.bottom>814||diagnostic.right>1444||diagnostic.broken.length)throw new Error('Slidev source layout failed: '+JSON.stringify(diagnostic));
        await page.keyboard.press('ArrowRight');
      }
      if(errors.length)throw new Error('Slidev runtime failed: '+errors.join('; '));
    }finally {await page.close();await new Promise(r=>server.close(r));}
  }}finally {await browser.close();}
  await fs.rm(path.join(folder,'node_modules'),{recursive:true,force:true});
  return folder;
}
