import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const hash=value=>createHash('sha256').update(value).digest('hex');
function nativePage(record,pageId) {
  const page=record.structuredContent??record;
  if(!/^[a-f0-9]{32}$/.test(pageId??'')||page.id?.replaceAll('-','')!==pageId||typeof page.text!=='string')throw new Error('Wrong native Notion rule page; configure the authorized page ID privately');
  if(page.truncated===true||page.unknown_block_count>0||page.unknown_block_ids?.length)throw new Error('Notion rules are incomplete; resolve missing blocks first');
  const start=page.text.indexOf('<content>'),end=page.text.lastIndexOf('</content>');
  if(start<0||end<=start||!page.text.includes('</page>'))throw new Error('Incomplete native Notion content envelope');
  const text=page.text.slice(start+9,end);
  if(!text.includes('v1.4')||!text.includes('America/Toronto'))throw new Error('Unsupported Notion rule contract/version');
  const sections=new Set([...text.matchAll(/^## (\d+)\./gm)].map(m=>+m[1]));
  if(Array.from({length:12},(_,i)=>i+1).some(n=>!sections.has(n)))throw new Error('Notion rule sections are incomplete');
  if(!Number.isFinite(Date.parse(page.page_last_edited_at)))throw new Error('Missing native Notion edit timestamp');
  return {page,text};
}
export async function installNotionRules({root,record,pageId=process.env.AI_DAILY_RULE_PAGE_ID,fetchedAt=new Date().toISOString()}) {
  pageId=pageId?.replaceAll('-','');
  const {page,text}=nativePage(record,pageId);
  if(!Number.isFinite(Date.parse(fetchedAt))||Date.parse(page.page_last_edited_at)>Date.parse(fetchedAt))throw new Error('Invalid Notion fetch chronology');
  const directory=path.join(root,'rules');await fs.mkdir(directory,{recursive:true,mode:0o700});
  const configFile=path.join(directory,'notion-config.json');
  try{await fs.writeFile(configFile,JSON.stringify({pageId})+'\n',{flag:'wx',mode:0o600});}
  catch(error){if(error.code!=='EEXIST')throw error;if(JSON.parse(await fs.readFile(configFile,'utf8')).pageId!==pageId)throw new Error('Configured rule page changed; inspect private configuration before replacing');}
  const source={kind:'notion-page',pageId,url:page.url??'https://app.notion.com/p/'+pageId,contractVersion:'v1.4',editedAt:page.page_last_edited_at,fetchedAt,contentSha256:hash(text),
    nativeCompletenessFlagsProvided:Object.hasOwn(page,'truncated'),structuralCheck:'all 12 sections and closing native envelope present',
    libraryMigrationStatus:'separate legacy/reference bundle; not claimed materialized'};
  const snapshotSha256=hash(JSON.stringify({pageId:source.pageId,editedAt:source.editedAt,contractVersion:source.contractVersion,contentSha256:source.contentSha256}));
  await fs.writeFile(path.join(directory,'notion-rulebook.md'),text,{mode:0o600});
  await fs.writeFile(path.join(directory,'notion-source.json'),JSON.stringify({...source,snapshotSha256},null,2)+'\n',{mode:0o600});
  return {...source,snapshotSha256,bytes:Buffer.byteLength(text)};
}
export async function readNotionRules(root,now=Date.now()) {
  const {pageId}=JSON.parse(await fs.readFile(path.join(root,'rules/notion-config.json'),'utf8'));
  const source=JSON.parse(await fs.readFile(path.join(root,'rules/notion-source.json'),'utf8'));
  if(!/^[a-f0-9]{32}$/.test(pageId??'')||source.kind!=='notion-page'||source.pageId!==pageId||source.contractVersion!=='v1.4')throw new Error('Unexpected Notion rule source');
  const text=await fs.readFile(path.join(root,'rules/notion-rulebook.md'),'utf8');
  if(hash(text)!==source.contentSha256)throw new Error('Notion rule content hash mismatch');
  const expected=hash(JSON.stringify({pageId:source.pageId,editedAt:source.editedAt,contractVersion:source.contractVersion,contentSha256:source.contentSha256}));
  if(source.snapshotSha256!==expected)throw new Error('Notion rule snapshot identity mismatch');
  const fetched=Date.parse(source.fetchedAt);
  if(!Number.isFinite(fetched)||fetched>now+60000||now-fetched>24*3600000)throw new Error('Refresh current Notion rules through the authorized connector before running');
  return {...source,bytes:Buffer.byteLength(text)};
}
