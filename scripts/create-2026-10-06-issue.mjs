// Compatibility entrypoint for the existing daily task. Curated, verified
// candidates are required; yesterday's issue is never copied forward.
import { main } from './create-issue.mjs';
await main(process.argv.slice(2).length?process.argv.slice(2):['--input','data/candidates/2026-10-06.json']);
