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

test("important topics get substantive sourced detail pages after their core page", async () => {
  const { buildVisualSlides, renderVisualIssue } = await import(modulePath);
  const rich = structuredClone(fixture);
  rich.topics[0].detailPages = [{ id: "workflow", zhTitle: "从提问到周期流程", enTitle: "From a question to a recurring workflow", points: [{ zh: "在原有工作台中配置周期流程", en: "Configure a recurring flow in the workspace", sourceUrls: ["https://example.com/north"] }], visuals: [rich.topics[0].visuals[2]] }];
  const slides = buildVisualSlides(rich, "zh");
  const core = slides.findIndex(s => s.id === "event-1");
  assert.equal(slides[core + 1].type, "detail");
  const output = renderVisualIssue(rich, "zh");
  assert.match(output, /从提问到周期流程/);
  assert.match(output, /在原有工作台中配置周期流程/);
  assert.match(output, /data-detail-id="workflow"/);
  assert.equal((output.match(/data-event-id="north"/g) ?? []).length, 1);
  assert.equal((output.match(/data-event-id="cloud"/g) ?? []).length, 1);
  assert.ok(slides[core + 1].html.includes("https://example.com/north"));
});

test("more than three real figures continue on a new page without dropping or copying brief text", async () => {
  const { buildVisualSlides } = await import(modulePath);
  const rich = structuredClone(fixture);
  rich.topics[0].visuals.push({ ...rich.topics[0].visuals[0], path: "assets/extra.png", captionZh: "额外关键细节" });
  const slides = buildVisualSlides(rich, "zh");
  const core = slides.find(s => s.id === "event-1");
  const continuation = slides.find(s => s.type === "visual-detail");
  assert.ok(continuation);
  assert.ok(continuation.html.includes("assets/extra.png"));
  assert.ok(!core.html.includes("assets/extra.png"));
  assert.ok(!continuation.html.includes(rich.topics[0].brief.zh.change));
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
  const overview=slides.filter(s=>s.type==="digest").map(s=>s.html).join("");
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

test("explicit small image-free briefs share a page while keeping every field and event anchor",async()=>{
  const {buildVisualSlides,renderVisualIssue}=await import(modulePath);
  const a=structuredClone(fixture.topics[1]);const b=structuredClone(a);b.id="other-brief";b.zhHeadline="另一条短报";b.enHeadline="Another short brief";
  const input={...fixture,topics:[a,b],editorialPlan:{quickBriefIds:[a.id,b.id]}};
  const pages=buildVisualSlides(input,"zh");const pair=pages.find(p=>p.type==="quick-pair");
  assert.ok(pair);assert.deepEqual(pair.topicIds,[a.id,b.id]);
  assert.match(pair.html,/id="event-1"/);assert.match(pair.html,/id="event-2"/);
  const output=renderVisualIssue(input,"zh");
  assert.equal((output.match(/data-event-id="cloud"/g)||[]).length,1);
  assert.equal((output.match(/data-event-id="other-brief"/g)||[]).length,1);
  for(const topic of input.topics)for(const text of Object.values(topic.brief.zh))assert.ok(pair.html.includes(text));
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

test("context details separate real figures from sourced explanation instead of clipping",async()=>{
  const {buildVisualSlides}=await import(modulePath); const context=structuredClone(fixture.topics[0]);
  context.id='old-context';context.coverageKind='first-inclusion-context';context.isNewToday=false;
  context.detailPages=[{id:'claims',zhTitle:'解释',enTitle:'Explanation',points:[{zh:'事实细节',en:'Factual details',sourceUrls:['https://example.com/proof']}],visuals:context.visuals.slice(0,2)}];
  const slides=buildVisualSlides({...fixture,contextTopics:[context]},'en');
  const detail=slides.find(s=>s.id==='event-3-detail-1');
  assert.ok(detail.html.includes('Factual details')); assert.ok(!detail.html.includes('<img'));
  assert.ok(slides.find(s=>s.id==='event-3-detail-1-figures-1'));
});

test("a longer quick brief is not forced into a narrow paired desktop column",async()=>{
  const {buildVisualSlides}=await import(modulePath);const a=structuredClone(fixture.topics[1]);const b=structuredClone(a);b.id='long-brief';b.brief.en.change='x'.repeat(500);
  const slides=buildVisualSlides({...fixture,topics:[a,b],editorialPlan:{quickBriefIds:[a.id,b.id]}},'en');
  assert.ok(!slides.some(s=>s.type==='quick-pair'));assert.ok(slides.find(s=>s.id==='event-2'));
});
