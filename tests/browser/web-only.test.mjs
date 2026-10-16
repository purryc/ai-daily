import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {chromium} from 'playwright';
import {generateIssue} from '../../scripts/create-issue.mjs';
import {createStaticServer} from '../../scripts/lib/static-server.mjs';
import {publicFiles} from '../../scripts/lib/release.mjs';
const exec=promisify(execFile);

test('isolated synthetic daily passes bilingual desktop/mobile web gate without PDF generation',async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'TEST-FIXTURE-daily-web-'));
  const date='2026-10-06',cutoff='2026-10-06T12:00:00-04:00';
  let server,browser;
  try {
    await fs.mkdir(path.join(root,'data'),{recursive:true});
    await fs.writeFile(path.join(root,'data/issues.json'),'[]');
    await fs.mkdir(path.join(root,date,'assets'),{recursive:true});
    browser=await chromium.launch({executablePath:process.env.AI_DAILY_CHROMIUM_PATH??'/usr/bin/chromium'});
    const imagePage=await browser.newPage({viewport:{width:600,height:240}});
    await imagePage.setContent('<body style="background:#eee;font:28px sans-serif;padding:40px">TEST FIXTURE ONLY</body>');
    await imagePage.screenshot({path:path.join(root,date,'assets/fixture.png')});await imagePage.close();
    const pair={zh:'隔离测试资料，非刊物。',en:'TEST FIXTURE ONLY. Not a publication.'};
    const topic={id:'test-fixture',section:'official',dossierKind:'product',evidenceLabel:'confirmed product',zhHeadline:pair.zh,enHeadline:pair.en,
      event:{productKey:'test-fixture',kind:'release',version:'1',occurredAt:'2026-10-05',summaryZh:pair.zh,summaryEn:pair.en,deltaZh:pair.zh,deltaEn:pair.en},
      sources:[{label:'TEST FIXTURE source',url:'https://example.com/test-fixture',publishedAt:'2026-10-05',verifiedAt:cutoff,isPrimary:true}],
      brief:Object.fromEntries(['zh','en'].map(l=>[l,Object.fromEntries(['what','change','use','limits'].map(k=>[k,pair[l]]))])),
      visuals:[{path:'assets/fixture.png',role:'overall',kind:'source-backed engineering test fixture ONLY',sourceUrl:'https://example.com/test-fixture',altZh:pair.zh,altEn:pair.en,captionZh:pair.zh,captionEn:pair.en,capturedAt:cutoff}]};
    const {issue}=await generateIssue({root,input:{date,cutoff,timezone:'America/Toronto',publicationFormat:'web-only',zhTitle:pair.zh,enTitle:pair.en,zhSummary:pair.zh,enSummary:pair.en,candidates:[topic],laneScans:[]}});
    const env={...process.env,AI_DAILY_ROOT:root,AI_DAILY_DATES:date,AI_DAILY_CHROMIUM_PATH:process.env.AI_DAILY_CHROMIUM_PATH??'/usr/bin/chromium'};
    await exec(process.execPath,['scripts/render-site.mjs'],{env});
    const checked=await exec(process.execPath,['scripts/check-site.mjs'],{env,timeout:90000});
    assert.match(checked.stdout,/web-only/);console.log(checked.stdout.trim());
    assert.ok(!publicFiles('daily',date,issue).some(f=>f.endsWith('.pdf')||f.endsWith('pdf-export.json')));
    assert.ok(publicFiles('daily',date,{...issue,publicationFormat:undefined}).some(f=>f.endsWith('.pdf')));
    const started=await createStaticServer(root);server=started.server;
    for(const lang of ['zh','en'])for(const viewport of [{width:1920,height:1080},{width:390,height:844}]) {
      const page=await browser.newPage({viewport});
      try {
        await page.goto(started.origin+'/'+date+'/'+lang+'/',{waitUntil:'networkidle'});
        assert.equal(await page.locator('a[href$=".pdf"]').count(),0);
        for(const link of await page.locator('.header-actions a').evaluateAll(as=>as.map(a=>a.href)))assert.equal((await page.request.get(link)).status(),200);
        if(process.env.AI_DAILY_TEST_EVIDENCE_DIR){
          await page.screenshot({path:path.join(process.env.AI_DAILY_TEST_EVIDENCE_DIR,`TEST-FIXTURE-daily-${lang}-${viewport.width}.png`),fullPage:true});
          await page.locator('[data-next-slide]').click();
          await page.screenshot({path:path.join(process.env.AI_DAILY_TEST_EVIDENCE_DIR,`TEST-FIXTURE-daily-${lang}-${viewport.width}-product.png`),fullPage:true});
        }
      }finally{await page.close();}
    }
    assert.ok(!(await fs.readdir(path.join(root,date))).some(f=>f.endsWith('.pdf')));
  }finally{
    if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));
    await fs.rm(root,{recursive:true,force:true});
  }
});
