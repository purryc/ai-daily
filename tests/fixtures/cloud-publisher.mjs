import {LANES,DIMENSIONS} from '../../scripts/lib/cloud-state.mjs';
import {installNotionRules} from '../../scripts/lib/notion-rules.mjs';
export const RULE_PAGE_ID='11111111111111111111111111111111';
export const nativeRuleFixture=(editedAt=new Date(Date.now()-60000).toISOString())=>({id:RULE_PAGE_ID,page_last_edited_at:editedAt,url:'https://app.notion.com/p/'+RULE_PAGE_ID,text:'<page><content>v1.4 America/Toronto\n'+Array.from({length:12},(_,i)=>'## '+(i+1)+'. Synthetic rule fixture\nTest only.').join('\n')+'</content></page>'});
export const installRuleFixture=root=>installNotionRules({root,record:nativeRuleFixture(),pageId:RULE_PAGE_ID});
export const pair=(zh='测试说明：这是隔离测试资料，不是刊物。',en='TEST FIXTURE: isolated validation material, not a publication.')=>({zh,en});
export const batch={
 queries:[{query_id:'test-query',source_lane:'official',platform:'fixture',query:'test',region:'CA',window:{start:'2026-10-12',end:'2026-10-19'},observed_at:'2026-10-19T14:00:00Z',access_status:'accessible',panel_type:'fixed',inspected_count:1,sampling_limit:1}],
 observations:[{schema_version:1,signal_id:'test-signal',product_key:'test-product',event_key:'test-product:v1',event_type:'release',event_at:'2026-10-13',event_time_precision:'date',published_at:'2026-10-13',first_seen_at:'2026-10-13T14:00:00Z',observed_at:'2026-10-19T14:00:00Z',research_cutoff:'2026-10-19T14:00:00Z',source_url:'https://example.com/fixture',canonical_url:'https://example.com/fixture',origin_group:'test-origin',query_id:'test-query',source_lane:'official',region:'CA',organization:'test-org',signal_dimensions:['feasibility'],evidence_label:'developer surface',claim:'TEST FIXTURE',evidence_locator:'fixture paragraph',verification_status:'verified',user_task:'test',interaction_before:'test',interaction_after:'test',hardware_api_stack_delta:'test',availability_stage:'test',limitations:'test',counterevidence:[],visual_provenance:[],independence_status:'independent'}],
 decisions:[{issue_date:'2026-10-19',signal_id:'test-signal',decision:'selected',reason:'test only',freshness_class:'weekly-lookback'}]
};
export const weekly={
 weekStart:'2026-10-12',timezone:'America/Toronto',windowStart:'2026-10-12T00:00:00-04:00',windowEnd:'2026-10-19T00:00:00-04:00',cutoff:'2026-10-19T14:00:00Z',partialWeek:false,title:pair(),summary:pair(),baselineStatus:'establishing',coverageLimitations:pair(),watchlist:pair(),
 sources:[{id:'S1',label:'Test fixture',url:'https://example.com/fixture',publishedAt:'2026-10-13',signalId:'test-signal'}],
 laneScans:LANES.map(lane=>({lane,status:'incomplete',note:pair()})),
 highlights:[{id:'H1',title:pair(),signalIds:['test-signal'],pages:[{title:pair(),paragraphs:[pair()],sourceIds:['S1']}]}],
 trends:[{id:'T1',title:pair(),state:'new',classification:'emerging',confidence:'low',claimType:'interface-supply',signalIds:['test-signal'],pages:[{title:pair(),paragraphs:[pair()],sourceIds:['S1'],analysisFields:['thisWeek','baseline','counterevidence','alternativeExplanation']},{title:pair(),paragraphs:[pair()],sourceIds:['S1'],analysisFields:['confidenceReason','hciImpact','experiment','falsifiableWatch']}],...Object.fromEntries(['thisWeek','baseline','counterevidence','alternativeExplanation','confidenceReason','hciImpact','experiment','falsifiableWatch'].map(k=>[k,pair()])),matrix:Object.fromEntries(DIMENSIONS.map(d=>[d,{status:d==='feasibility'?'support':'unknown',signalIds:d==='feasibility'?['test-signal']:[],note:pair()}]))}]
};
