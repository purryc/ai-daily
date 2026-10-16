import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import {createStaticServer} from './lib/static-server.mjs';
import {realDestination} from './lib/cloud-state.mjs';

export const PUBLIC_PRODUCT_URL='https://nodejs.org/en/download';
const REPO=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

export function safeProbeError(error) {
  const message=String(error?.message??'');
  const network=message.match(/net::ERR_[A-Z_]+/);
  if(network)return network[0];
  const http=message.match(/^Source returned HTTP (\d{3}|null)$/);
  if(http)return http[0];
  if(/timeout|timed out/i.test(message))return 'Browser operation timed out';
  const controlled=['Unexpected product-page redirect','Access/error page cannot be admitted as product UI','Expected real product page was not rendered','Product interaction surface is missing','Refused subresource; source host stopped without retry','Saved screenshot is not the expected readable PNG','Saved HTML cannot read the local screenshot','Probe exceeds its 2MiB artifact bound'];
  return controlled.includes(message)?message:'Public browser probe failed; detailed diagnostics omitted';
}

// Deliberately separate from daily/weekly publication, private rules and ledgers.
export async function capturePublicProduct({output,sourceUrl=PUBLIC_PRODUCT_URL,fixture=false}={}) {
  const source=new URL(sourceUrl);
  if (!fixture && sourceUrl!==PUBLIC_PRODUCT_URL) throw new Error('Only the fixed public product URL is permitted');
  if (fixture && (source.protocol!=='http:' || source.hostname!=='127.0.0.1')) throw new Error('Fixtures must use local loopback HTTP');
  if (!output) throw new Error('An isolated output directory is required');
  const dest=realDestination(output);
  if (dest===REPO || dest.startsWith(REPO+path.sep)) throw new Error('Output must be outside the public checkout');
  await fs.mkdir(dest,{recursive:true});
  if ((await fs.readdir(dest)).length) throw new Error('Output directory must be empty');
  const receipt={schemaVersion:1,kind:fixture?'engineering-fixture-only':'public-product-browser-probe',
    publication:false,sourceUrl,sourcePublishedAt:null,sourceDateNote:'Current public page; original publication date not established.',
    requestedAt:new Date().toISOString(),captureStatus:'started',visualReviewStatus:'pending-pixel-review',
    viewport:{width:1440,height:1080},captureRange:'top viewport; no crop or generated product imagery',
    github:{repository:process.env.GITHUB_REPOSITORY??null,commit:process.env.GITHUB_SHA??null,
      runId:process.env.GITHUB_RUN_ID??null,runAttempt:process.env.GITHUB_RUN_ATTEMPT??null},
    preventedExternalRequestCount:0,refusedStatuses:[],files:{}};
  let browser,server;
  try {
    browser=await chromium.launch({executablePath:process.env.AI_DAILY_CHROMIUM_PATH??'/usr/bin/chromium'});
    receipt.browser=browser.version();
    const context=await browser.newContext({viewport:receipt.viewport,serviceWorkers:'block'});
    const stopped=new Set();
    await context.route('**/*',async route=>{
      const u=new URL(route.request().url());
      const allowed=fixture ? u.origin===source.origin : u.protocol==='https:' && ['nodejs.org','www.nodejs.org'].includes(u.hostname);
      if (!allowed || stopped.has(u.hostname)) {receipt.preventedExternalRequestCount++;await route.abort('blockedbyclient');}
      else await route.continue();
    });
    const page=await context.newPage();
    page.on('response',response=>{
      if ([401,403].includes(response.status())) {
        stopped.add(new URL(response.url()).hostname);
        receipt.refusedStatuses.push({host:new URL(response.url()).hostname,status:response.status()});
      }
    });
    const response=await page.goto(sourceUrl,{waitUntil:'domcontentloaded',timeout:30000});
    receipt.httpStatus=response?.status()??null;
    if (receipt.httpStatus!==200) throw new Error('Source returned HTTP '+receipt.httpStatus);
    const final=new URL(page.url());
    if (fixture ? final.origin!==source.origin : !['nodejs.org','www.nodejs.org'].includes(final.hostname) || !/^\/en\/download\/?$/.test(final.pathname))
      throw new Error('Unexpected product-page redirect');
    receipt.finalUrl=page.url();
    await page.locator(fixture?'body':'main').waitFor({state:'visible',timeout:10000});
    await page.evaluate(()=>document.fonts.ready);
    receipt.title=await page.title();
    const body=await page.locator('body').innerText();
    if (/access denied|verify you are human|checking your browser|just a moment|captcha|proxy error|certificate.*invalid/i.test(body.slice(0,4000)))
      throw new Error('Access/error page cannot be admitted as product UI');
    if (fixture ? !/TEST FIXTURE ONLY/.test(receipt.title) : !/Node\.?js/i.test(receipt.title) || !/download/i.test(body))
      throw new Error('Expected real product page was not rendered');
    receipt.visibleInteractiveElements=await page.locator('a:visible,button:visible,select:visible,input:visible').count();
    if (receipt.visibleInteractiveElements<(fixture?1:3)) throw new Error('Product interaction surface is missing');
    if (receipt.refusedStatuses.length) throw new Error('Refused subresource; source host stopped without retry');
    const screenshot=path.join(dest,'product.png');
    await page.screenshot({path:screenshot,fullPage:false});
    receipt.capturedAt=new Date().toISOString();
    const png=await fs.readFile(screenshot);
    if (png.subarray(0,8).toString('hex')!=='89504e470d0a1a0a' || png.readUInt32BE(16)!==1440 || png.readUInt32BE(20)!==1080)
      throw new Error('Saved screenshot is not the expected readable PNG');
    receipt.files['product.png']={bytes:png.length,sha256:digest(png),width:1440,height:1080};
    const label=fixture?'TEST FIXTURE ONLY':'Node.js official download page';
    const html='<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>'+label+' — nonpublishing browser check</title><style>body{font:16px system-ui;max-width:1100px;margin:32px auto;padding:16px}img{display:block;width:100%;height:auto;border:1px solid #aaa}code{overflow-wrap:anywhere}</style><h1>'+label+'</h1><p>Nonpublishing browser check. No AI Daily edition, PDF or Pages deployment.</p><p>Source: <a href="'+escape(sourceUrl)+'">'+escape(sourceUrl)+'</a>. Captured '+escape(receipt.capturedAt)+'. Current page, not a historical snapshot. Original publication date unknown.</p><img src="product.png" alt="'+label+'; screenshot awaiting pixel review"><p>Pixel review remains pending until the saved screenshot is actually inspected.</p></html>';
    await fs.writeFile(path.join(dest,'index.html'),html);
    const started=await createStaticServer(dest);server=started.server;
    const localContext=await browser.newContext({viewport:{width:1440,height:1080},serviceWorkers:'block'});
    await localContext.route('**/*',route=>new URL(route.request().url()).origin===started.origin?route.continue():route.abort('blockedbyclient'));
    const local=await localContext.newPage();
    const localResponse=await local.goto(started.origin+'/',{waitUntil:'networkidle'});
    const loaded=await local.locator('img').evaluate(i=>i.complete&&i.naturalWidth===1440&&i.naturalHeight===1080);
    receipt.localHtmlCheck={status:localResponse.status(),imageLoaded:loaded,htmlPages:1,screenshotFiles:1};
    if (localResponse.status()!==200 || !loaded) throw new Error('Saved HTML cannot read the local screenshot');
    const htmlBytes=await fs.readFile(path.join(dest,'index.html'));
    receipt.files['index.html']={bytes:htmlBytes.length,sha256:digest(htmlBytes)};
    if (png.length+htmlBytes.length>2*1024*1024) throw new Error('Probe exceeds its 2MiB artifact bound');
    receipt.captureStatus='captured-and-browser-validated';
  } catch(error) {
    receipt.captureStatus='failed';receipt.error=safeProbeError(error);
    for (const name of ['product.png','index.html']) await fs.rm(path.join(dest,name),{force:true});
    receipt.files={};throw new Error(receipt.error);
  } finally {
    if(browser)await browser.close();
    if(server)await new Promise(resolve=>server.close(resolve));
    receipt.completedAt=new Date().toISOString();
    await fs.writeFile(path.join(dest,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
  }
  return receipt;
}

if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {
    const args=process.argv.slice(2);
    if(args.length!==2 || args[0]!=='--output') throw new Error('Usage: node scripts/public-browser-check.mjs --output <isolated-directory>');
    const receipt=await capturePublicProduct({output:args[1]});
    console.log(JSON.stringify(receipt));
  }catch(error){console.error(safeProbeError(error));process.exitCode=1;}
}
