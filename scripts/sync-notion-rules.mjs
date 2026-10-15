import fs from 'node:fs/promises';
import {privateRoot} from './lib/cloud-state.mjs';
import {installNotionRules} from './lib/notion-rules.mjs';
const args=process.argv.slice(2),file=args[args.indexOf('--input')+1];
if(!args.includes('--input')||!file)throw new Error('Usage: cloud:rules -- --input NATIVE_NOTION_FETCH_JSON [--page-id AUTHORIZED_PAGE_ID] [--fetched-at ISO_TIMESTAMP]');
const i=args.indexOf('--fetched-at');
const p=args.indexOf('--page-id');
console.log(JSON.stringify(await installNotionRules({root:privateRoot(),record:JSON.parse(await fs.readFile(file,'utf8')),pageId:p>=0?args[p+1]:undefined,fetchedAt:i>=0?args[i+1]:undefined})));
