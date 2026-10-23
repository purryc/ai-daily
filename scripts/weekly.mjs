import fs from 'node:fs/promises';
import path from 'node:path';
import {buildWeekly} from './lib/weekly.mjs';
import {checkWeekly} from './lib/weekly-qa.mjs';
import {privateRoot} from './lib/cloud-state.mjs';
const args=process.argv.slice(2),arg=k=>args[args.indexOf(k)+1],command=args[0];
if(command==='build') {
  if(!args.includes('--input')||!args.includes('--output'))throw new Error('Usage: weekly build --input reviewed.json --output NEW_DRY_DIRECTORY [--assets DIR]');
  console.log(JSON.stringify(await buildWeekly({input:JSON.parse(await fs.readFile(arg('--input'),'utf8')),privateDir:privateRoot(),output:arg('--output'),assetsDir:args.includes('--assets')?arg('--assets'):undefined})));
} else if(command==='check') {
  if(!args.includes('--root')||!args.includes('--week'))throw new Error('Usage: weekly check --root DRY_DIRECTORY --week YYYY-MM-DD [--pdf] [--pilot] [--live BASE]');
  console.log(JSON.stringify(await checkWeekly({root:path.resolve(arg('--root')),weekStart:arg('--week'),pdf:args.includes('--pdf'),pilot:args.includes('--pilot'),liveBase:args.includes('--live')?arg('--live'):undefined})));
} else throw new Error('weekly command must be build or check');
