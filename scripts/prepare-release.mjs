import {prepareRelease} from './lib/release.mjs';
const args=process.argv.slice(2),arg=k=>{const i=args.indexOf(k);if(i<0||!args[i+1])throw new Error('Missing '+k);return args[i+1];};
if(!args.includes('--reviewed'))throw new Error('Run source, privacy and bilingual editorial review first; then explicitly pass --reviewed');
console.log(JSON.stringify(await prepareRelease({receiptFile:arg('--receipt'),inputFile:arg('--input')})));
