import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createStaticServer} from '../scripts/lib/static-server.mjs';

const api = await import('../scripts/public-browser-check.mjs').catch(() => ({}));

test('public browser probe restricts live targets before launching a browser', async () => {
  assert.equal(typeof api.capturePublicProduct, 'function', 'public browser capture implementation is missing');
  await assert.rejects(api.capturePublicProduct({output:'/tmp/unused-public-probe',sourceUrl:'https://example.com/'}), /fixed public product/);
});

test('isolated public-browser fixture writes one readable PNG, one HTML and honest receipt', async () => {
  assert.equal(typeof api.capturePublicProduct, 'function', 'public browser capture implementation is missing');
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'TEST-FIXTURE-public-browser-'));
  let server;
  try {
    const source=path.join(root,'source'),output=path.join(root,'output');
    await fs.mkdir(source);
    await fs.writeFile(path.join(source,'index.html'), '<!doctype html><html><title>TEST FIXTURE ONLY</title><body style="font:30px sans-serif;padding:60px;background:#edf2fa"><h1>TEST FIXTURE ONLY</h1><p>Local browser capability probe. Not a real product UI.</p><button>Fixture control</button></body></html>');
    const started=await createStaticServer(source);server=started.server;
    const receipt=await api.capturePublicProduct({output,sourceUrl:started.origin+'/',fixture:true});
    assert.equal(receipt.kind,'engineering-fixture-only');
    assert.equal(receipt.captureStatus,'captured-and-browser-validated');
    assert.equal(receipt.visualReviewStatus,'pending-pixel-review');
    assert.equal(receipt.publication,false);
    assert.deepEqual((await fs.readdir(output)).sort(),['index.html','product.png','receipt.json']);
    const image=await fs.readFile(path.join(output,'product.png'));
    assert.equal(image.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
    assert.equal(image.readUInt32BE(16),1440);
    assert.equal(image.readUInt32BE(20),1080);
    assert.equal(receipt.localHtmlCheck.imageLoaded,true);
    assert.match(await fs.readFile(path.join(output,'index.html'),'utf8'),/TEST FIXTURE ONLY/);
    assert.equal(JSON.parse(await fs.readFile(path.join(output,'receipt.json'),'utf8')).files['product.png'].bytes,image.length);
  } finally {if(server)await new Promise(r=>server.close(r));await fs.rm(root,{recursive:true,force:true});}
});

test('a refused fixture response produces a failure receipt and no screenshot or HTML', async () => {
  assert.equal(typeof api.capturePublicProduct, 'function', 'public browser capture implementation is missing');
  const http=await import('node:http');
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'TEST-FIXTURE-public-browser-denial-'));
  const server=http.createServer((q,r)=>{r.writeHead(403);r.end('TEST FIXTURE refusal');});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  try {
    await assert.rejects(api.capturePublicProduct({output:root,sourceUrl:`http://127.0.0.1:${server.address().port}/`,fixture:true}),/HTTP 403/);
    assert.deepEqual(await fs.readdir(root),['receipt.json']);
    assert.equal(JSON.parse(await fs.readFile(path.join(root,'receipt.json'),'utf8')).captureStatus,'failed');
  } finally {await new Promise(r=>server.close(r));await fs.rm(root,{recursive:true,force:true});}
});
