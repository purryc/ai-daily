import test from 'node:test';
import assert from 'node:assert/strict';
import {validateDailyCandidateEvidence} from '../scripts/cloud-run.mjs';
const cutoff='2026-10-16T14:58:03Z',actual='2026-10-16T16:17:22Z';
const fixture=()=>({input:{cutoff},topic:{event:{productKey:'fixture',occurredAt:'2026-10-15'},sources:[{url:'https://example.com/original',publishedAt:'2026-10-15',verifiedAt:actual}]},observations:[{product_key:'fixture',event_at:'2026-10-15',verification_status:'verified',research_cutoff:cutoff,source_url:'https://example.com/original',canonical_url:'https://example.com/original',published_at:'2026-10-15',observed_at:actual,first_seen_at:actual}]});
test('daily evidence retains actual full-reading time after the fixed research cutoff',()=>{
 const {topic,observations,input}=fixture(),before=JSON.stringify(observations);
 assert.doesNotThrow(()=>validateDailyCandidateEvidence(topic,observations,input));assert.equal(JSON.stringify(observations),before);
});
test('daily evidence rejects backfilled source verification time',()=>{
 const {topic,observations,input}=fixture();topic.sources[0].verifiedAt=cutoff;
 assert.throws(()=>validateDailyCandidateEvidence(topic,observations,input),/actual observation time/);
});
test('daily evidence preserves null publication dates and rejects invented dates',()=>{
 const {topic,observations,input}=fixture();observations[0].published_at=null;topic.sources[0].publishedAt=null;
 assert.doesNotThrow(()=>validateDailyCandidateEvidence(topic,observations,input));topic.sources[0].publishedAt='2026-10-15';
 assert.throws(()=>validateDailyCandidateEvidence(topic,observations,input),/matching shared original/);
});
test('daily evidence rejects inconsistent discovery chronology and changed research cutoff',()=>{
 for(const patch of [{first_seen_at:'2026-10-16T17:00:00Z'},{research_cutoff:'2026-10-16T15:00:00Z'},{observed_at:'2026-10-16T14:00:00Z',first_seen_at:'2026-10-16T14:00:00Z'}]) {
  const {topic,observations,input}=fixture();Object.assign(observations[0],patch);assert.throws(()=>validateDailyCandidateEvidence(topic,observations,input),/mismatch|inconsistent/);
 }
});
test('daily evidence cannot use current counts as historical measurements',()=>{
 const {topic,observations,input}=fixture();observations[0].metric={name:'current downloads',value:12};
 assert.throws(()=>validateDailyCandidateEvidence(topic,observations,input),/measurement/);
 observations[0].measurement_at='2026-10-16T16:00:00Z';assert.throws(()=>validateDailyCandidateEvidence(topic,observations,input),/measurement/);
 observations[0].measurement_at='2026-10-15T12:00:00Z';assert.doesNotThrow(()=>validateDailyCandidateEvidence(topic,observations,input));
});
