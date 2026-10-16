import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {capturePublicProduct} from '../scripts/public-browser-check.mjs';
import {createStaticServer} from '../scripts/lib/static-server.mjs';
const api=await import('../scripts/public-browser-log.mjs').catch(()=>({}));

async function fixture(fn) {
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'TEST-FIXTURE-public-log-'));
  const source=path.join(root,'source'),output=path.join(root,'capture');let server;
  try {
    await fs.mkdir(source);
    await fs.writeFile(path.join(source,'index.html'), '<!doctype html><html><title>TEST FIXTURE ONLY</title><body style="font:28px sans-serif;padding:50px"><h1>TEST FIXTURE ONLY</h1><p>Log transport test, not a real product.</p><button>Fixture control</button></body></html>');
    const started=await createStaticServer(source);server=started.server;
    await capturePublicProduct({output,sourceUrl:started.origin+'/',fixture:true});
    await fn({root,output});
  }finally{if(server)await new Promise(r=>server.close(r));await fs.rm(root,{recursive:true,force:true});}
}

test('bounded log transport round-trips timestamped output with exact public file bytes',async()=>{
  assert.equal(typeof api.createPublicProbeLog,'function','bounded public log transport missing');
  await fixture(async({root,output})=>{
    await assert.rejects(api.createPublicProbeLog({input:output}),/fixture/);
    const log=await api.createPublicProbeLog({input:output,allowFixture:true});
    assert.ok(Buffer.byteLength(log)<3*1024*1024);
    const timestamped=log.split('\n').map(l=>'2026-10-16T18:00:00.000Z '+l).join('\n');
    const restored=path.join(root,'restored');
    const result=await api.decodePublicProbeLog({text:'unrelated log\n'+timestamped,output:restored});
    assert.equal(result.kind,'engineering-fixture-only');
    for(const name of ['product.png','index.html','receipt.json'])assert.deepEqual(await fs.readFile(path.join(restored,name)),await fs.readFile(path.join(output,name)));
  });
});

test('extra private files and oversized output are rejected before anything is emitted',async()=>{
  assert.equal(typeof api.createPublicProbeLog,'function','bounded public log transport missing');
  await fixture(async({output})=>{
    await fs.writeFile(path.join(output,'private-ledger.json'),'PRIVATE FIXTURE ONLY');
    await assert.rejects(api.createPublicProbeLog({input:output,allowFixture:true}),/unexpected file/i);
    await fs.rm(path.join(output,'private-ledger.json'));
    await fs.writeFile(path.join(output,'index.html'),Buffer.alloc(2*1024*1024));
    await assert.rejects(api.createPublicProbeLog({input:output,allowFixture:true}),/size limit/);
  });
});

test('tampering and duplicate bundles fail before restored files are written',async()=>{
  assert.equal(typeof api.createPublicProbeLog,'function','bounded public log transport missing');
  await fixture(async({root,output})=>{
    const log=await api.createPublicProbeLog({input:output,allowFixture:true});
    const altered=log.replace(/(PUBLIC_BROWSER_FILE product\.png 0\/\d+ )[A-Za-z0-9+/]/,'$1A');
    await assert.rejects(api.decodePublicProbeLog({text:altered,output:path.join(root,'bad')}),/hash|PNG|bytes/);
    assert.equal(await fs.stat(path.join(root,'bad')).then(()=>true,()=>false),false);
    await assert.rejects(api.decodePublicProbeLog({text:log+log,output:path.join(root,'duplicate')}),/one complete bundle/);
  });
});

test('symlink files and unexpected receipt fields cannot enter the public log',async()=>{
  assert.equal(typeof api.createPublicProbeLog,'function','bounded public log transport missing');
  await fixture(async({root,output})=>{
    const receiptPath=path.join(output,'receipt.json');const original=await fs.readFile(receiptPath);
    const receipt=JSON.parse(original);receipt.privateRule='PRIVATE FIXTURE ONLY';
    await fs.writeFile(receiptPath,JSON.stringify(receipt));
    await assert.rejects(api.createPublicProbeLog({input:output,allowFixture:true}),/receipt field/);
    await fs.writeFile(path.join(root,'outside.json'),original);await fs.rm(receiptPath);await fs.symlink(path.join(root,'outside.json'),receiptPath);
    await assert.rejects(api.createPublicProbeLog({input:output,allowFixture:true}),/regular file/);
  });
});

test('failed captures transport only a sanitized receipt, never an image or HTML',async()=>{
  assert.equal(typeof api.createPublicProbeLog,'function','bounded public log transport missing');
  await fixture(async({root,output})=>{
    const p=path.join(output,'receipt.json'),r=JSON.parse(await fs.readFile(p,'utf8'));
    r.captureStatus='failed';r.error='net::ERR_TUNNEL_CONNECTION_FAILED';r.files={};
    await fs.writeFile(p,JSON.stringify(r));
    await fs.rm(path.join(output,'product.png'));await fs.rm(path.join(output,'index.html'));
    const log=await api.createPublicProbeLog({input:output,allowFixture:true});
    assert.doesNotMatch(log,/PUBLIC_BROWSER_FILE product\.png|PUBLIC_BROWSER_FILE index\.html/);
    const restored=path.join(root,'failed-restored');
    const result=await api.decodePublicProbeLog({text:log,output:restored});
    assert.equal(result.captureStatus,'failed');assert.deepEqual(await fs.readdir(restored),['receipt.json']);
  });
});
