import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { validatePdfExportMetadata } from '../scripts/lib/pdf-check.mjs';
const bytes=Buffer.from('{"date":"2026-10-06"}\n');
const sidecar={renderer:'reportlab',date:'2026-10-06',sourceDataSha256:createHash('sha256').update(bytes).digest('hex'),pages:{zh:33,en:33},note:'Independent static layout; not browser-print parity.'};
test('Independent PDF layout validates its real count and exact source hash without requiring HTML parity',()=>{
  assert.equal(validatePdfExportMetadata({metadata:sidecar,date:'2026-10-06',locale:'zh',sourceBytes:bytes,pdfPages:33,htmlPages:24}),'reportlab');
});
test('PDF sidecars cannot excuse stale source data, dates, incorrect page counts or unknown renderers',()=>{
  for(const metadata of [{...sidecar,date:'2026-10-05'},{...sidecar,sourceDataSha256:'0'.repeat(64)},{...sidecar,pages:{zh:32,en:33}},{...sidecar,renderer:'unverified'}])
    assert.throws(()=>validatePdfExportMetadata({metadata,date:'2026-10-06',locale:'zh',sourceBytes:bytes,pdfPages:33,htmlPages:24}));
});
test('Browser PDFs and exports without a sidecar still require HTML page parity and the 50-page ceiling',()=>{
  assert.equal(validatePdfExportMetadata({date:'2026-10-06',locale:'en',sourceBytes:bytes,pdfPages:24,htmlPages:24}),'chromium');
  assert.throws(()=>validatePdfExportMetadata({date:'2026-10-06',locale:'en',sourceBytes:bytes,pdfPages:33,htmlPages:24}));
  assert.throws(()=>validatePdfExportMetadata({metadata:{...sidecar,pages:{zh:51}},date:'2026-10-06',locale:'zh',sourceBytes:bytes,pdfPages:51,htmlPages:24}));
});
