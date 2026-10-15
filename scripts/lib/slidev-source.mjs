import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {buildVisualSlides,visualIssueCss} from './issue-visuals.mjs';
import {REPO} from './cloud-state.mjs';
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
    const slides='---\ntheme: default\nlayout: none\naspectRatio: 16/9\nfonts:\n  provider: none\ntitle: '+JSON.stringify(locale==='zh'?issue.zhTitle:issue.enTitle)+'\n---\n\n'+pages.map(p=>p.html.replace('<section ','<section v-pre ').replaceAll('../assets/','/assets/')).join('\n\n---\nlayout: none\n---\n\n')+'\n';
    await fs.writeFile(path.join(folder,locale==='zh'?'slides.md':'slides-en.md'),slides);
  }
  await fs.writeFile(path.join(folder,'styles/index.css'),visualIssueCss()+'\n.slidev-layout{padding:0;background:#fffdfa}.report-slide{display:block!important;height:100%;padding:24px 30px;overflow:visible;box-sizing:border-box}.report-slide h1{font-size:32px}.product-slide>h2{font-size:24px}.dossier-unit p{font-size:12px;line-height:1.35}.dossier-unit h3{font-size:12px}.dossier-body{grid-template-columns:180px minmax(0,1fr)}');
  await run(['install','--package-lock-only','--ignore-scripts'],folder);
  await run(['ci'],folder);
  await run(['run','build'],folder);await run(['run','build:en'],folder);
  for(const file of ['dist/index.html','dist-en/index.html'])await fs.access(path.join(folder,file));
  await fs.rm(path.join(folder,'node_modules'),{recursive:true,force:true});
  return folder;
}
