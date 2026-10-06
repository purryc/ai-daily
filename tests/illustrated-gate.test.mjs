import test from 'node:test';
import assert from 'node:assert/strict';
import {validateIllustratedIssue} from '../scripts/lib/issue-policy.mjs';
test('Final illustrated publication rejects a featured story with only a visualMissing explanation',()=>{
  assert.throws(()=>validateIllustratedIssue({topics:[{id:'text-only',visualMissing:{zh:'诚实缺图',en:'Honest missing image'}}]}),/verified.*visual|visual.*required/i);
});
test('Every fresh/context story needs a retained factual figure, while no-news remains valid',()=>{
  assert.equal(validateIllustratedIssue({topics:[]}),true);
  assert.equal(validateIllustratedIssue({topics:[{id:'real',visuals:[{path:'assets/real.png'}]}],contextTopics:[{id:'old',media:[{poster:{path:'assets/poster.png'}}]}]}),true);
  assert.throws(()=>validateIllustratedIssue({topics:[{id:'real',visuals:[{path:'assets/real.png'}]}],contextTopics:[{id:'unillustrated-context'}]}));
});
