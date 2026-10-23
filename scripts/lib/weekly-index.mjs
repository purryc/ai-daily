import fs from 'node:fs/promises';
import path from 'node:path';
const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export async function writeWeeklyIndex({repo,output,input}) {
  let entries=[];
  try{entries=JSON.parse(await fs.readFile(path.join(repo,'weekly/manifest.json'),'utf8'));}
  catch(e){if(e.code!=='ENOENT')throw e;}
  if(entries.some(e=>e.week_start===input.weekStart&&e.type==='weekly'&&!e.partial_week))throw new Error('Completed weekly already exists');
  entries=[{week_start:input.weekStart,type:'weekly',partial_week:false,path:input.weekStart+'/',cutoff:input.cutoff,title:input.title},...entries];
  const weekly=path.join(output,'weekly');await fs.mkdir(weekly,{recursive:true});
  await fs.writeFile(path.join(weekly,'manifest.json'),JSON.stringify(entries,null,2)+'\n');
  await fs.writeFile(path.join(weekly,'index.html'),'<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AI Product Weekly</title><style>body{font-family:Arial,sans-serif;background:#fffdfa;color:#171413;max-width:960px;margin:50px auto;padding:24px}article{border-top:1px solid #ddd;padding:20px 0}a{color:#a9000b}p{line-height:1.8}</style><a href="/ai-daily/">AI Daily 日报</a><h1>AI Product Weekly 周报</h1>'+entries.map(e=>'<article><h2>'+esc(e.week_start)+' · '+esc(e.partial_week?'试刊 / Partial pilot':'完整周报 / Complete week')+'</h2><p>'+esc(e.title?.zh??'周报试刊')+'<br>'+esc(e.title?.en??'Weekly pilot')+'</p><a href="'+esc(e.path)+'zh/">中文</a> · <a href="'+esc(e.path)+'en/">English</a></article>').join('')+'</html>');
}
