import test from "node:test";
import assert from "node:assert/strict";

const modulePath = "../scripts/lib/issue-visuals.mjs";
const fixture = {
  editorialVersion: 2, date: "2026-10-06", timezone: "America/Toronto", cutoff: "2026-10-06T11:00:00-04:00",
  zhTitle: "今日变化", enTitle: "Today's changes", zhSummary: "核实过的新增", enSummary: "Verified changes",
  topics: [{
    id: "north", zhHeadline: "North 2：工作流更新", enHeadline: "North 2: workflow update",
    evidenceLabel: "official release", event: { productKey: "cohere-north", kind: "release", version: "2", occurredAt: "2026-10-05", summaryZh: "企业工作台更新", summaryEn: "Workspace update", deltaZh: "新增工作流", deltaEn: "New workflows" },
    brief: { zh: { what: "企业工作台", change: "新增工作流", use: "可视化配置", limits: "价格未说明" }, en: { what: "Enterprise workspace", change: "New workflows", use: "Configure visually", limits: "Pricing unstated" } },
    sources: [{ label: "Official release", url: "https://example.com/north", publishedAt: "2026-10-05", isPrimary: true }],
    visuals: ["overall", "detail", "workflow"].map((role, i) => ({ path: `assets/north-${i}.png`, sourceUrl: "https://example.com/north", kind: "source-backed official feature illustration", role, altZh: `官方图${i}`, altEn: `Official figure ${i}`, captionZh: `官方示意${i}`, captionEn: `Official illustration ${i}` }))
  }, {
    id: "cloud", zhHeadline: "新任务改为云端", enHeadline: "New tasks move to cloud",
    evidenceLabel: "official effective change", event: { productKey: "cloud-task", kind: "availability-change", key: "cloud-only", occurredAt: "2026-10-06", summaryZh: "执行位置改变", summaryEn: "Execution location changes", deltaZh: "新任务云端运行", deltaEn: "New tasks run in cloud", previousIssue: "2026-10-05" },
    brief: { zh: { what: "长任务工具", change: "新任务云端运行", use: "跨设备查看", limits: "本机文件仍需设备在线" }, en: { what: "Long-task tool", change: "New tasks run in cloud", use: "Review across devices", limits: "Local files need an online device" } },
    sources: [{ label: "Official guide", url: "https://example.com/cloud", publishedAt: null, isPrimary: true }],
    visualMissing: { zh: "没有可核实原图", en: "No verified figure available" }
  }]
};

test("selected visual renderer module exists", async () => {
  await assert.doesNotReject(import(modulePath));
});

test("visual issue renders each event once and keeps multi-figure provenance", async () => {
  const { renderVisualIssue } = await import(modulePath);
  const output = renderVisualIssue(fixture, "zh");
  assert.equal((output.match(/data-event-id="north"/g) ?? []).length, 1);
  assert.equal((output.match(/data-event-id="cloud"/g) ?? []).length, 1);
  for (let i = 0; i < 3; i++) assert.match(output, new RegExp(`assets/north-${i}\\.png`));
  assert.match(output, /官方示意2/);
  assert.match(output, /https:\/\/example.com\/north/);
  assert.match(output, /data-template="illustrated"/);
  assert.match(output, /data-template="change-first"/);
  assert.match(output, /没有可核实原图/);
  assert.doesNotMatch(output, /概念示意|图片布局示意|产品 A|mockup|placeholder/i);
});

test("comparison requires a verified baseline and never invents old screenshots", async () => {
  const { renderVisualIssue } = await import(modulePath);
  const output = renderVisualIssue(fixture, "zh");
  assert.match(output, /2026-10-05\/zh\//);
  assert.match(output, /产品是什么/);
  assert.match(output, /这次变化/);
  assert.doesNotMatch(output, /此前 ·|旧操作入口|旧步骤|before-image|baseline-image/);
});

test("both languages preserve all four brief fields and event dates", async () => {
  const { renderVisualIssue } = await import(modulePath);
  for (const locale of ["zh", "en"]) {
    const output = renderVisualIssue(fixture, locale);
    for (const topic of fixture.topics) for (const value of Object.values(topic.brief[locale])) assert.ok(output.includes(value));
    assert.match(output, /2026-10-05/);
    assert.match(output, /2026-10-06/);
    assert.equal((output.match(/class="evidence-policy"/g) ?? []).length, 1);
    assert.match(output, /data-slide/);
    assert.match(output, /data-next-slide/);
    assert.match(output, /data-deck-progress/);
    assert.match(output, /issue-v2\.css/);
  }
});

test("no-news edition has a useful honest empty state and no fabricated cover", async () => {
  const { renderVisualIssue } = await import(modulePath);
  const output = renderVisualIssue({ ...fixture, coverStory: null, topics: [] }, "zh");
  assert.match(output, /今天没有符合标准的新增进展/);
  assert.doesNotMatch(output, /<img|data-event-id/);
  assert.ok((output.match(/data-slide(?:\s|>)/g) ?? []).length <= 2);
});

test("unsafe markup is escaped and unsafe URLs are not executable", async () => {
  const { renderVisualIssue } = await import(modulePath);
  const unsafe = structuredClone(fixture);
  unsafe.topics[0].zhHeadline = '<img src=x onerror="alert(1)">';
  unsafe.topics[0].sources[0].url = "javascript:alert(1)";
  unsafe.topics[0].visuals[0].sourceUrl = "javascript:alert(2)";
  const output = renderVisualIssue(unsafe, "zh");
  assert.doesNotMatch(output, /href="javascript:|<img src=x/);
  assert.match(output, /&lt;img/);
});

test("scoped visual stylesheet preserves complete images and bounded print layout", async () => {
  const { visualIssueCss } = await import(modulePath);
  const css = visualIssueCss();
  assert.match(css, /object-fit:\s*contain/);
  assert.doesNotMatch(css, /object-fit:\s*cover/);
  assert.match(css, /@media print/);
  assert.match(css, /@page/);
  assert.match(css, /focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
});

test("digest figure sizes override the full product gallery without cropping", async () => {
  const { visualIssueCss } = await import(modulePath);
  const css = visualIssueCss();
  assert.match(css, /\.digest-images \.product-figure img\s*\{[^}]*max-height:\s*140px[^}]*object-fit:\s*contain/);
  assert.match(css, /\.digest-images \.product-figure figcaption\s*\{[^}]*font-size:\s*11px/);
});

test("official video starts muted with no autoplay or preload and keeps a factual PDF poster", async () => {
  const { renderVisualIssue } = await import(modulePath);
  const rich = structuredClone(fixture);
  rich.topics[0].media = [{kind:"video",url:"https://example.com/demo.mp4",sourceUrl:"https://example.com/north",poster:rich.topics[0].visuals[0],captionZh:"官方流程演示",captionEn:"Official workflow demo",whatToSeeZh:"配置后运行周期流程",whatToSeeEn:"Configure then run a recurring flow",verifiedAt:"2026-10-06T12:00:00Z"}];
  const output = renderVisualIssue(rich,"zh");
  assert.match(output, /<video[^>]*controls[^>]*muted[^>]*playsinline[^>]*preload="none"/);
  assert.doesNotMatch(output, /<video[^>]*autoplay/);
  assert.match(output, /class="print-poster"/);
  assert.match(output, /poster="\.\.\/assets\/north-0\.png"/);
  assert.match(output, /官方流程演示/);
  assert.doesNotMatch(output, /看这里/);
});

test("GIF requires an explicit play button and official-link media does not create an unverified embed", async () => {
  const { renderVisualIssue } = await import(modulePath);
  const rich = structuredClone(fixture);
  rich.topics[0].media = [{kind:"gif",url:"https://example.com/demo.gif",sourceUrl:"https://example.com/north",poster:rich.topics[0].visuals[0],captionZh:"官方动图",captionEn:"Official animation"},{kind:"official-link",url:"https://example.com/watch",sourceUrl:"https://example.com/north",poster:rich.topics[0].visuals[1],captionZh:"官方视频",captionEn:"Official video"}];
  const output = renderVisualIssue(rich,"zh");
  assert.match(output, /data-media-toggle/);
  assert.match(output, />播放<\/button>/);
  assert.doesNotMatch(output, /<img[^>]*src="https:\/\/example.com\/demo.gif"/);
  assert.match(output, /href="https:\/\/example.com\/watch"/);
  assert.doesNotMatch(output, /<iframe/);
});

test("unknown source publication dates do not imply an effective-date proof", async () => {
  const {renderVisualIssue}=await import(modulePath);
  const output=renderVisualIssue(fixture,"en");
  assert.doesNotMatch(output,/not stated; see effective-date evidence/);
  const effective=structuredClone(fixture);
  effective.topics[1].sources[0].dateEvidence={kind:"effective-date",date:"2026-10-06",quote:"effective October 6"};
  assert.match(renderVisualIssue(effective,"en"),/Effective date: 2026-10-06/);
});

test("first-inclusion context is dated separately and never mixed into fresh overview",async()=>{
  const {buildVisualSlides,renderVisualIssue}=await import(modulePath);
  const expanded=structuredClone(fixture);
  const background=structuredClone(fixture.topics[0]);
  background.id="context-old-hardware";background.zhHeadline="背景设备";background.enHeadline="Background device";
  background.event.occurredAt="2026-09-30";background.coverageKind="first-inclusion-context";background.isNewToday=false;
  background.sources=[{label:"Dated background source",url:"https://example.com/background",publishedAt:"2026-09-30",isPrimary:true}];
  expanded.contextTopics=[background];expanded.editorialPlan={targetMinutes:15};
  const slides=buildVisualSlides(expanded,"zh");
  const overview=slides.filter(s=>s.type==="contents").map(s=>s.html.split('class="contents-context"')[0]).join("");
  assert.ok(!overview.includes("背景设备"));
  const context=slides.find(s=>s.type==="context");assert.ok(context);assert.match(context.html,/非今日新增/);
  const output=renderVisualIssue(expanded,"zh");
  assert.match(output,/data-context-id="context-old-hardware"/);
  assert.match(output,/2026-09-30/);assert.match(output,/https:\/\/example.com\/background/);
  assert.match(output,/约 15 分钟/);
  assert.match(renderVisualIssue(expanded,"en"),/About 15 minutes/);
});

test("a no-news issue can include explicitly labeled older first-inclusion context",async()=>{
  const {renderVisualIssue}=await import(modulePath);
  const background={...structuredClone(fixture.topics[0]),id:"older-context",coverageKind:"first-inclusion-context",isNewToday:false};
  const output=renderVisualIssue({...fixture,topics:[],contextTopics:[background]},"zh");
  assert.match(output,/今天没有符合标准的新增进展/);
  assert.match(output,/data-context-id="older-context"/);
});

test("desktop pages are fixed16:9 with no internal scrolling; narrow screens use natural vertical flow",async()=>{
  const {visualIssueCss}=await import(modulePath);const css=visualIssueCss();
  assert.match(css,/\.js-deck \.report-stage\s*\{[^}]*overflow:hidden[^}]*container-type:size/);
  assert.match(css,/\.js-deck \.report-slide\s*\{[^}]*aspect-ratio:16\s*\/\s*9/);
  assert.match(css,/@media\s*\(max-width:900px\)[^{]*\{[\s\S]*?\.js-deck \.report-stage\s*\{[^}]*overflow:visible/);
});

test("dense desktop media and dated context reserve sufficient visible space",async()=>{
  const {visualIssueCss}=await import(modulePath); const css=visualIssueCss();
  assert.match(css,/\.js-deck \.media-figure video,\.js-deck \.media-figure img\s*\{[^}]*max-height:43cqh/);
  assert.match(css,/\.js-deck \.report-slide \.context-section-heading\s*\{[^}]*font-size:18px/);
});



test("one contents and one reference page surround exactly one complete story per product",async()=>{
 const {buildVisualSlides}=await import(modulePath); const rich=structuredClone(fixture);
 rich.topics[0].detailPages=[{id:'workflow',zhTitle:'深入理解',enTitle:'Understand the flow',points:[{zh:'流程的真实细节',en:'Factual flow detail',sourceUrls:['https://example.com/detail']}],visuals:[{...rich.topics[0].visuals[0],path:'assets/extra.png'}]}];
 rich.topics[0].media=[{kind:'official-link',url:'https://example.com/demo',sourceUrl:'https://example.com/north',poster:rich.topics[0].visuals[0],captionZh:'官方演示',captionEn:'Official demo'}];
 rich.editorialPlan={quickBriefIds:['north','cloud']};
 const pages=buildVisualSlides(rich,'en');assert.equal(pages.length,4);assert.deepEqual(pages.map(p=>p.type),['contents','product','product','references']);
 const story=pages.find(p=>p.topicIds?.includes('north')&&p.type==='product');
 assert.ok(story.html.includes('Factual flow detail'));assert.ok(story.html.includes('assets/extra.png'));assert.ok(story.html.includes('Official demo'));
 for(const v of Object.values(rich.topics[0].brief.en))assert.ok(story.html.includes(v));
 assert.deepEqual(story.topicIds,['north']);assert.equal((story.html.match(/assets\/north-0.png/g)||[]).length,1);
});

test("reference index remains one page and retains every source plus full ledger link",async()=>{
 const {buildVisualSlides}=await import(modulePath); const rich=structuredClone(fixture);
 rich.topics[0].sources=Array.from({length:28},(_,i)=>({label:'Source '+i,url:'https://example.com/source/'+i,publishedAt:'2026-10-05',isPrimary:true}));
 const references=buildVisualSlides(rich,'en').filter(p=>p.type==='references');assert.equal(references.length,1);
 for(const source of rich.topics[0].sources)assert.ok(references[0].html.includes(source.url));
 assert.match(references[0].html,/sources.md/);
});

test("context stays a complete dated story while contents separates it from fresh entries",async()=>{
 const {buildVisualSlides}=await import(modulePath);const rich=structuredClone(fixture); const context=structuredClone(rich.topics[0]);
 context.id='patent-context';context.zhHeadline='旧专利背景';context.enHeadline='Older patent background';context.coverageKind='first-inclusion-context';context.isNewToday=false;context.event.occurredAt='2026-10-01';
 rich.contextTopics=[context];const pages=buildVisualSlides(rich,'en');assert.equal(pages.length,5);
 const story=pages.find(p=>p.type==='context');assert.match(story.html,/Not new today/);assert.match(story.html,/2026-10-01/);assert.deepEqual(story.topicIds,['patent-context']);
 const contents=pages.find(p=>p.type==='contents');assert.match(contents.html,/contents-context/);
});

test("all figure and media provenance is indexed once on the final reference page",async()=>{
 const {buildVisualSlides,buildReferenceIndex}=await import(modulePath);const rich=structuredClone(fixture);
 rich.topics[0].visuals[0].sourceUrl='https://example.com/figure-proof';
 rich.topics[0].media=[{kind:'official-link',url:'https://example.com/watch',sourceUrl:'https://example.com/clip-proof',poster:rich.topics[0].visuals[0],captionZh:'演示',captionEn:'Demo'}];
 const rows=buildReferenceIndex(rich);for(const url of ['https://example.com/figure-proof','https://example.com/watch','https://example.com/clip-proof'])assert.ok(rows.some(r=>r.url===url));
 const pages=buildVisualSlides(rich,'en'),story=pages.find(p=>p.type==='product'),refs=pages.at(-1);
 assert.equal(refs.type,'references');for(const row of rows)assert.ok(refs.html.includes(row.url));
 assert.ok(!story.html.includes('Official release'));assert.ok(!story.html.includes('Original source'));
 assert.match(story.html,/class="reference-marker"/);assert.match(story.html,/href="#evidence-1"/);
});

test("reference aliases share a number while dated event anchors remain in final links",async()=>{
 const {buildReferenceIndex,renderVisualIssue}=await import(modulePath);const rich=structuredClone(fixture);
 rich.topics[0].sources[0].url='https://example.com/proof/#october-5';rich.topics[0].visuals[0].sourceUrl='https://www.example.com/proof?utm_source=demo';
 const rows=buildReferenceIndex(rich);assert.equal(rows.filter(r=>r.url.includes('/proof')).length,1);assert.equal(rows.find(r=>r.url.includes('/proof')).url,'https://example.com/proof/#october-5');
 const html=renderVisualIssue(rich,'en');assert.ok(!html.split('</header>')[0].includes('sources.md'));assert.match(html,/class="reference-marker"/);
});

test("compact reference labels keep full provenance and clear effective dates",async()=>{
 const {buildReferenceIndex,renderVisualIssue}=await import(modulePath);const rich=structuredClone(fixture);
 rich.topics[0].sources[0].label='An unusually long precise original document title that must remain available';
 rich.topics[0].sources[0].url='https://github.com/example/project/releases/tag/v1.2.3';
 rich.topics[1].sources[0].dateEvidence={kind:'effective-date',date:'2026-10-06'};
 const rows=buildReferenceIndex(rich);assert.ok(rows.every(r=>r.compactLabel.length<=32));assert.ok(rows[0].label.includes('unusually long'));
 assert.equal(rows[0].dateLabel,'2026-10-05');assert.match(rows[1].dateLabel,/Effective date: 2026-10-06/);
 assert.ok(renderVisualIssue(rich,'en').includes('title="An unusually long precise original document title'));
});

test("contents uses compact product names while retaining full titles for accessible links",async()=>{
 const {buildVisualSlides,topicContentsLabel}=await import(modulePath);const rich=structuredClone(fixture);
 rich.topics[0].zhHeadline='North 2：这是一段完整的变化标题';rich.topics[0].enHeadline='North 2 adds a fully explained change to its workflow';
 assert.equal(topicContentsLabel(rich.topics[0],'en'),'North 2');const contents=buildVisualSlides(rich,'en')[0];
 assert.match(contents.html,/>North 2<\/strong>/);assert.ok(contents.html.includes('title="North 2 adds a fully explained change to its workflow"'));
});

test("contents subtitles describe the update once using persisted bilingual overrides",async()=>{
 const {contentsSubtitle,buildVisualSlides}=await import(modulePath);const rich=structuredClone(fixture);
 rich.topics[0].contentsUpdateZh='新增跨会话记忆与花费控制。';rich.topics[0].contentsUpdateEn='Adds cross-session memory and spending controls.';
 assert.equal(contentsSubtitle(rich.topics[0],'zh'),rich.topics[0].contentsUpdateZh);
 assert.equal(contentsSubtitle(rich.topics[0],'en'),rich.topics[0].contentsUpdateEn);
 const page=buildVisualSlides(rich,'en')[0];assert.ok(page.html.includes('class="contents-update"'));assert.ok(page.html.includes(rich.topics[0].contentsUpdateEn));
 assert.equal((page.html.match(/Adds cross-session memory/g)||[]).length,1);
 assert.equal(contentsSubtitle(rich.topics[1],'en'),rich.topics[1].event.deltaEn);
});

test("the exact editorial cutoff survives in escaped metadata for freshness checks",async()=>{
 const {renderVisualIssue}=await import(modulePath);
 assert.ok(renderVisualIssue(fixture,'en').includes(`<meta name="editorial-cutoff" content="${fixture.cutoff}">`));
 const unsafe={...fixture,cutoff:'2026-10-06T11:00:00-04:00"><script>alert(1)</script>'};
 const html=renderVisualIssue(unsafe,'en');assert.ok(!html.includes('<script>alert(1)</script>'));assert.match(html,/editorial-cutoff" content="[^>]*&quot;&gt;&lt;script&gt;/);
});
