import test from 'node:test';
import assert from 'node:assert/strict';
import { coverFigureFallback } from '../scripts/lib/topic-content.mjs';
test('A fresh issue without lead imagery does not become a no-news issue on the homepage',()=>{
  const issue={topics:[{id:'real-new-event',visualMissing:{zh:'未取得官方图',en:'No official figure obtained'}}]};
  assert.equal(coverFigureFallback(issue,'zh'),'暂无可核实的封面图');
  assert.equal(coverFigureFallback(issue,'en'),'No verified cover figure available');
});
test('An empty main-news issue honestly says no verified new advances even with background context',()=>{
  const issue={topics:[],contextTopics:[{id:'dated-old-paper'}]};
  assert.equal(coverFigureFallback(issue,'zh'),'没有可核实的新进展');
  assert.equal(coverFigureFallback(issue,'en'),'No verified new advances');
});
