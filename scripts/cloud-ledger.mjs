import fs from 'node:fs/promises';
import {ingest, privateRoot} from './lib/cloud-state.mjs';
const file=process.argv[2];
if(!file)throw new Error('Usage: AI_DAILY_PRIVATE_ROOT=... npm run ledger:ingest -- batch.json');
console.log(JSON.stringify(await ingest(privateRoot(),JSON.parse(await fs.readFile(file,'utf8')))));
