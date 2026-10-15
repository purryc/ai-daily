import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {installNotionRules,readNotionRules} from '../scripts/lib/notion-rules.mjs';
import {preflight} from '../scripts/lib/cloud-state.mjs';
import {nativeRuleFixture,RULE_PAGE_ID} from './fixtures/cloud-publisher.mjs';

test('native Notion rule import binds source, edit version and content without claiming Library transfer',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'ai-notion-rules-'));
 try{
  const record=nativeRuleFixture('2026-10-15T10:00:00Z');
  const first=await installNotionRules({root,pageId:RULE_PAGE_ID,record:{structuredContent:record},fetchedAt:'2026-10-15T11:00:00Z'});
  const refreshed=await installNotionRules({root,pageId:RULE_PAGE_ID,record,fetchedAt:'2026-10-15T12:00:00Z'});
  assert.equal(first.snapshotSha256,refreshed.snapshotSha256);
  assert.equal(first.nativeCompletenessFlagsProvided,false);
  assert.match(first.libraryMigrationStatus,/not claimed materialized/);
  assert.equal((await readNotionRules(root,Date.parse('2026-10-15T13:00:00Z'))).snapshotSha256,first.snapshotSha256);
  await fs.appendFile(path.join(root,'rules/notion-rulebook.md'),'tampered');
  await assert.rejects(readNotionRules(root,Date.parse('2026-10-15T13:00:00Z')),/content hash/);
 }finally{await fs.rm(root,{recursive:true,force:true});}
});
test('rule import refuses wrong page, missing sections, incomplete native blocks and inverted timestamps',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'ai-notion-invalid-'));
 try{
  const page=nativeRuleFixture('2026-10-15T10:00:00Z'),install=record=>installNotionRules({root,pageId:RULE_PAGE_ID,record,fetchedAt:'2026-10-15T11:00:00Z'});
  await assert.rejects(installNotionRules({root,record:page,pageId:''}),/configure/);
  await assert.rejects(install({...page,id:'wrong'}),/Wrong native/);
  await assert.rejects(install({...page,truncated:true}),/incomplete/);
  await assert.rejects(install({...page,unknown_block_count:1}),/incomplete/);
  await assert.rejects(install({...page,text:page.text.replace('## 12.','## missing.')}),/sections/);
  await assert.rejects(install({...page,text:page.text.replace('</page>','')}),/envelope/);
  await assert.rejects(install({...page,page_last_edited_at:'2026-10-16T00:00:00Z'}),/chronology/);
 }finally{await fs.rm(root,{recursive:true,force:true});}
});
test('formal preflight requires fresh native rules, and rule reads reject stale and future fetches',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'ai-notion-fresh-'));
 try{
  await assert.rejects(preflight(root,{requireCurrentNotion:true}),/ENOENT/);
  await installNotionRules({root,pageId:RULE_PAGE_ID,record:nativeRuleFixture('2026-10-14T10:00:00Z'),fetchedAt:'2026-10-14T11:00:00Z'});
  await assert.rejects(readNotionRules(root,Date.parse('2026-10-15T11:00:01Z')),/Refresh/);
  await assert.rejects(readNotionRules(root,Date.parse('2026-10-14T10:58:00Z')),/Refresh/);
  const metaFile=path.join(root,'rules/notion-source.json'),source=JSON.parse(await fs.readFile(metaFile,'utf8'));
  await fs.writeFile(metaFile,JSON.stringify({...source,editedAt:'2026-10-14T10:01:00Z'}));
  await assert.rejects(readNotionRules(root,Date.parse('2026-10-14T12:00:00Z')),/snapshot identity/);
 }finally{await fs.rm(root,{recursive:true,force:true});}
});
