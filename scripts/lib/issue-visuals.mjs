const esc = (value) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const local = (object, locale, zh, en) => object?.[locale === "zh" ? zh : en] ?? "";
const external = (url) => /^https?:\/\//i.test(String(url ?? "")) ? String(url) : "#";
const chunks = (items, size) => Array.from({ length: Math.ceil(items.length / size) }, (_, i) => items.slice(i * size, (i + 1) * size));
const figures = (topic) => topic.visuals ?? (topic.visual ? [topic.visual] : []);
const title = (topic, locale) => local(topic, locale, "zhHeadline", "enHeadline");
const words = {
  zh: { overview: "今天值得看的变化", next: "下一页", prev: "上一页", contents: "目录", sources: "来源总表", pdf: "下载 PDF", what: "产品是什么", change: "这次变化", use: "什么时候用", limits: "限制与可用范围", history: "上次报道", original: "查看原图", official: "原始来源", evidence: "来源与证据说明", empty: "今天没有符合标准的新增进展", missing: "尚无可核实的产品图", date: "进展日期", cutoff: "截至", more: "继续看变化", reading: "先看新增，再看图与细节" },
  en: { overview: "Changes worth seeing", next: "Next", prev: "Previous", contents: "Contents", sources: "Source ledger", pdf: "Download PDF", what: "What it is", change: "What changed", use: "When to use it", limits: "Limits & availability", history: "Previous coverage", original: "View full image", official: "Original source", evidence: "Sources & evidence", empty: "No new advances met the evidence bar today", missing: "No verified product figure yet", date: "Event date", cutoff: "As of", more: "More changes", reading: "New advances first, then pictures and details" }
};

function imageFigure(issue, visual, locale, className = "") {
  if (!/^assets\/[^/]+$/.test(String(visual.path ?? ""))) throw new Error(`Invalid factual image path: ${visual.path}`);
  const image = `../${visual.path}`;
  const caption = local(visual, locale, "captionZh", "captionEn") || local(visual, locale, "altZh", "altEn");
  const alt = local(visual, locale, "altZh", "altEn");
  return `<figure class="product-figure ${className}">
    <a class="image-link" href="${esc(image)}" target="_blank" rel="noreferrer" aria-label="${esc(words[locale].original + ": " + alt)}"><img src="${esc(image)}" alt="${esc(alt)}"${visual.width ? ` width="${esc(visual.width)}"` : ""}${visual.height ? ` height="${esc(visual.height)}"` : ""} decoding="async"></a>
    <figcaption>${esc(caption)} <a class="figure-source" href="${esc(external(visual.sourceUrl))}" target="_blank" rel="noreferrer">${esc(words[locale].official)}</a></figcaption>
  </figure>`;
}

function missingFigure(topic, locale) {
  return `<p class="visual-unavailable"><strong>${esc(words[locale].missing)}</strong><span>${esc(topic.visualMissing?.[locale] ?? words[locale].missing)}</span></p>`;
}

function eventMeta(topic, locale) {
  return `<p class="event-meta"><span>${esc(topic.event?.productKey)}</span><time datetime="${esc(topic.event?.occurredAt)}">${esc(words[locale].date)} ${esc(topic.event?.occurredAt)}</time>${topic.event?.version ? `<span>v${esc(topic.event.version)}</span>` : ""}<span>${esc(topic.evidenceLabel ?? topic.event?.kind)}</span></p>`;
}

function sourceRow(topic, locale) {
  const sources = (topic.sources ?? []).filter((source) => source.isPrimary).slice(0, 2);
  const selected = sources.length ? sources : (topic.sources ?? []).slice(0, 2);
  const history = topic.event?.previousIssue;
  return `<div class="event-source-row">${selected.map((source) => `<a href="${esc(external(source.url))}" target="_blank" rel="noreferrer">${esc(source.label)}</a>`).join("")}${/^\d{4}-\d{2}-\d{2}$/.test(history ?? "") ? `<a href="../../${esc(history)}/${locale}/">${esc(words[locale].history)} · ${esc(history)}</a>` : ""}<a href="../sources.md">${esc(words[locale].sources)}</a></div>`;
}

function briefUnit(label, text, className = "") {
  return `<div class="brief-unit ${className}"><h3>${esc(label)}</h3><p>${esc(text)}</p></div>`;
}

function visualGallery(issue, topic, locale) {
  const images = figures(topic);
  if (!images.length) return missingFigure(topic, locale);
  return `<div class="visual-gallery count-${Math.min(images.length, 3)}">${images.map((image) => imageFigure(issue, image, locale)).join("")}</div>`;
}

function topicSlide(issue, topic, locale, index) {
  const copy = topic.brief?.[locale] ?? {};
  const w = words[locale];
  const changeFirst = Boolean(topic.event?.previousIssue) || topic.event?.kind === "availability-change";
  const verifiedBaseline = topic.comparison?.sourceUrl && topic.comparison?.[locale]?.before;
  const baseline = verifiedBaseline ? topic.comparison[locale].before : copy.what;
  const baselineHeading = verifiedBaseline ? (locale === "zh" ? "此前 · 已核实背景" : "Before · verified baseline") : w.what;
  return {
    id: `event-${index + 1}`, type: changeFirst ? "change-first" : "illustrated", topicIds: [topic.id],
    html: `<section class="report-slide product-slide ${changeFirst ? "comparison-slide" : "illustrated-slide"}" id="event-${index + 1}" data-slide data-template="${changeFirst ? "change-first" : "illustrated"}" data-event-id="${esc(topic.id)}">
      ${eventMeta(topic, locale)}<h2>${esc(title(topic, locale))}</h2>
      ${changeFirst ? `<div class="change-columns">${briefUnit(baselineHeading, baseline, "baseline-unit")}${briefUnit(w.change, copy.change, "delta-unit")}</div>${visualGallery(issue, { ...topic, visuals: figures(topic).slice(0, 3) }, locale)}<div class="use-limit-grid">${briefUnit(w.use, copy.use)}${briefUnit(w.limits, copy.limits)}</div>` : `${visualGallery(issue, { ...topic, visuals: figures(topic).slice(0, 3) }, locale)}<div class="brief-grid">${briefUnit(w.what, copy.what)}${briefUnit(w.change, copy.change, "delta-unit")}${briefUnit(w.use, copy.use)}${briefUnit(w.limits, copy.limits)}</div>`}
      ${verifiedBaseline ? `<p class="baseline-source"><a href="${esc(external(topic.comparison.sourceUrl))}" target="_blank" rel="noreferrer">${locale === "zh" ? "历史证据" : "Baseline evidence"}</a></p>` : ""}
      ${sourceRow(topic, locale)}
    </section>`
  };
}

function quickPairSlide(issue, pair, locale, topics) {
  const indexes = pair.map(topic => topics.indexOf(topic));
  const id = `quick-${indexes.map(index => index + 1).join("-")}`;
  const w = words[locale];
  return { id, type: "quick-pair", topicIds: pair.map(topic => topic.id), html: `<section class="report-slide quick-pair-slide" id="${id}" data-slide data-template="quick-pair"><p class="slide-kicker">${locale === "zh" ? "其他快报" : "Quick briefs"}</p><div class="quick-pair">${pair.map((topic, i) => {
    const copy = topic.brief?.[locale] ?? {};
    return `<article class="quick-event" id="event-${indexes[i] + 1}" data-event-id="${esc(topic.id)}">${eventMeta(topic, locale)}<h2>${esc(title(topic, locale))}</h2><div class="quick-brief">${briefUnit(w.what, copy.what)}${briefUnit(w.change, copy.change, "delta-unit")}${briefUnit(w.use, copy.use)}${briefUnit(w.limits, copy.limits)}</div><p class="quick-visual-status">${esc(topic.visualMissing?.[locale] ?? w.missing)}</p>${sourceRow(topic, locale)}</article>`;
  }).join("")}</div></section>` };
}

function visualDetailSlides(issue, topic, locale, topicIndex, images, idPrefix = "figures") {
  return chunks(images, 3).map((group, index) => ({
    id: `event-${topicIndex + 1}-${idPrefix}-${index + 1}`, type: "visual-detail",
    html: `<section class="report-slide visual-detail-slide" id="event-${topicIndex + 1}-${idPrefix}-${index + 1}" data-slide data-template="illustrated" data-topic-ref="${esc(topic.id)}">${eventMeta(topic, locale)}<h2>${esc(title(topic, locale))} · ${locale === "zh" ? "图像与细节" : "Figures & details"}</h2>${visualGallery(issue, { visuals: group }, locale)}${sourceRow(topic, locale)}</section>`
  }));
}

function topicDetailSlides(issue, topic, locale, topicIndex) {
  return (topic.detailPages ?? []).flatMap((page, index) => {
    const id = `event-${topicIndex + 1}-detail-${index + 1}`;
    const images = figures(page);
    const separateFigures = topic.coverageKind === "first-inclusion-context" && images.length && page.points?.length;
    const core = {
      id, type: "detail",
      html: `<section class="report-slide detail-slide" id="${id}" data-slide data-template="detail" data-detail-id="${esc(page.id)}" data-topic-ref="${esc(topic.id)}">${eventMeta(topic, locale)}<h2>${esc(local(page, locale, "zhTitle", "enTitle"))}</h2>${images.length && !separateFigures ? visualGallery(issue, { visuals: images.slice(0, 3) }, locale) : ""}<div class="detail-points">${(page.points ?? []).map((point, pointIndex) => `<div class="detail-point"><span class="point-index">${String(pointIndex + 1).padStart(2, "0")}</span><p>${esc(point[locale])}</p><div class="point-sources">${(point.sourceUrls ?? []).map((url, i) => `<a href="${esc(external(url))}" target="_blank" rel="noreferrer">${locale === "zh" ? "依据" : "Evidence"}${i + 1}</a>`).join("")}</div></div>`).join("")}</div>${sourceRow(topic, locale)}</section>`
    };
    return [core, ...visualDetailSlides(issue, topic, locale, topicIndex, separateFigures ? images : images.slice(3), `detail-${index + 1}-figures`), ...mediaSlides(issue, topic, locale, topicIndex, page.media ?? [], `detail-${index + 1}-media`)];
  });
}

function mediaFigure(media, locale) {
  const poster = media.poster;
  if (!poster || !/^assets\/[^/]+$/.test(String(poster.path ?? ""))) throw new Error("Media needs a verified factual poster");
  const imageUrl = `../${poster.path}`;
  const alt = local(poster, locale, "altZh", "altEn");
  const caption = local(media, locale, "captionZh", "captionEn");
  const guidance = local(media, locale, "whatToSeeZh", "whatToSeeEn");
  const play = locale === "zh" ? "播放" : "Play";
  let player;
  if (media.kind === "video") {
    player = `<video controls muted playsinline preload="none" poster="${esc(imageUrl)}" aria-label="${esc(caption)}"><source src="${esc(external(media.url))}"><a href="${esc(external(media.url))}" target="_blank" rel="noreferrer">${play}</a></video><img class="print-poster" src="${esc(imageUrl)}" alt="${esc(alt)}">`;
  } else if (media.kind === "gif") {
    player = `<div class="gif-player" data-media-url="${esc(external(media.url))}"><img class="media-poster" src="${esc(imageUrl)}" alt="${esc(alt)}"><div class="gif-frame" data-gif-frame></div><button type="button" class="media-play" data-media-toggle aria-pressed="false" data-play-label="${play}" data-pause-label="${locale === "zh" ? "暂停" : "Pause"}">${play}</button></div>`;
  } else if (media.kind === "official-link") {
    player = `<a class="official-media-link" href="${esc(external(media.url))}" target="_blank" rel="noreferrer"><img class="media-poster" src="${esc(imageUrl)}" alt="${esc(alt)}"><span class="media-play">${play}</span></a>`;
  } else throw new Error(`Unsupported verified media kind: ${media.kind}`);
  return `<figure class="media-figure">${player}<figcaption><strong>${esc(caption)}</strong>${guidance ? `<span>${esc(guidance)}</span>` : ""}<a href="${esc(external(media.sourceUrl))}" target="_blank" rel="noreferrer">${esc(words[locale].official)}</a><a class="media-original" href="${esc(external(media.url))}" target="_blank" rel="noreferrer">${locale === "zh" ? "官方演示" : "Official demo"}</a></figcaption></figure>`;
}

function mediaSlides(issue, topic, locale, topicIndex, media, prefix = "media") {
  return chunks(media, 2).map((group, index) => ({
    id: `event-${topicIndex + 1}-${prefix}-${index + 1}`, type: "media",
    html: `<section class="report-slide media-slide" id="event-${topicIndex + 1}-${prefix}-${index + 1}" data-slide data-template="media" data-topic-ref="${esc(topic.id)}">${eventMeta(topic, locale)}<h2>${esc(title(topic, locale))} · ${locale === "zh" ? "演示" : "Demo"}</h2><div class="media-gallery count-${group.length}">${group.map(item => mediaFigure(item, locale)).join("")}</div>${sourceRow(topic, locale)}</section>`
  }));
}

function overviewSlide(issue, locale, topics, startIndex, pageIndex) {
  const w = words[locale];
  return {
    id: pageIndex ? `overview-${pageIndex + 1}` : "overview", type: "digest",
    html: `<section class="report-slide digest-slide" id="${pageIndex ? `overview-${pageIndex + 1}` : "overview"}" data-slide data-template="digest">
      <p class="slide-kicker">${esc(issue.date)} · ${esc(issue.timezone)}</p>
      <div class="overview-heading"><h1>${esc(pageIndex ? w.more : w.overview)}</h1><p>${esc(w.reading)}</p></div>
      ${pageIndex ? "" : `<p class="issue-intro">${esc(local(issue, locale, "zhSummary", "enSummary"))}</p>`}
      <div class="digest-rows">${topics.map((topic, i) => {
        const images = figures(topic);
        return `<article class="digest-row ${images.length ? "has-visual" : "text-led"}">
          ${images.length ? `<div class="digest-images">${images.slice(0, 3).map((visual) => imageFigure(issue, visual, locale)).join("")}</div>` : `<div class="digest-text-visual"><span class="digest-index">${String(startIndex + i + 1).padStart(2, "0")}</span><time datetime="${esc(topic.event.occurredAt)}">${esc(topic.event.occurredAt)}</time><span>${esc(topic.evidenceLabel ?? topic.event.kind)}</span></div>`}
          <div class="digest-copy"><a class="digest-title" href="#event-${startIndex + i + 1}" data-go-slide="event-${startIndex + i + 1}"><h2>${esc(title(topic, locale))}</h2></a><p>${esc(local(topic.event, locale, "summaryZh", "summaryEn"))}</p><a class="read-event" href="#event-${startIndex + i + 1}" data-go-slide="event-${startIndex + i + 1}">${locale === "zh" ? "看变化与细节" : "See the change & details"}</a></div>
        </article>`;
      }).join("")}</div>
    </section>`
  };
}

function sourceDateLabel(source, locale) {
  if (source.publishedAt) return `${locale === "zh" ? "来源发布日期" : "Published"}: ${source.publishedAt}`;
  if (source.dateEvidence?.kind === "effective-date") return `${locale === "zh" ? "生效日期" : "Effective date"}: ${source.dateEvidence.date}`;
  return locale === "zh" ? "来源发布日期：未标注" : "Published: not stated";
}

function evidenceSlides(issue, locale) {
  const entries = new Map();
  for (const topic of [...(issue.topics ?? []), ...(issue.contextTopics ?? [])]) for (const source of topic.sources ?? []) if (!entries.has(source.url)) entries.set(source.url, source);
  const rows = [...entries.values()];
  return chunks(rows, 12).map((group, pageIndex) => ({
    id: `evidence-${pageIndex + 1}`, type: "sources",
    html: `<section class="report-slide evidence-slide" id="evidence-${pageIndex + 1}" data-slide data-template="sources"><p class="slide-kicker">${esc(issue.date)}</p><h2>${esc(words[locale].evidence)}</h2>${pageIndex ? "" : `<p class="evidence-policy">${locale === "zh" ? "只把有明确日期、来源和实质变化的进展列为新增。旧背景链接回原报道；研究、演示与可用范围分别标明。图像来自原始来源，缺图如实说明。" : "Only advances with explicit dates, sources and a substantive change are promoted. Previous coverage is linked. Research, demos and availability are distinguished. Figures come from their sources; missing imagery is disclosed."}</p>`}<ol class="evidence-list" start="${pageIndex * 12 + 1}">${group.map((source) => `<li><a href="${esc(external(source.url))}" target="_blank" rel="noreferrer">${esc(source.label)}</a><span>${esc(sourceDateLabel(source, locale))}</span></li>`).join("")}</ol><p class="source-ledger-link"><a href="../sources.md">${esc(words[locale].sources)} · ${locale === "zh" ? "日期、图源与筛选记录" : "dates, image provenance & selection notes"}</a></p></section>`
  }));
}

export function buildVisualSlides(issue, locale = "zh") {
  if (!words[locale]) throw new Error(`Unsupported locale: ${locale}`);
  const mainTopics = issue.topics ?? [];
  const overview = mainTopics.length ? chunks(mainTopics, 3).map((group, index) => overviewSlide(issue, locale, group, index * 3, index)) : [{ id: "overview", type: "empty", html: `<section class="report-slide no-news-slide" id="overview" data-slide data-template="empty"><p class="slide-kicker">${esc(issue.date)} · ${esc(issue.timezone)}</p><h1>${esc(words[locale].empty)}</h1><p class="issue-intro">${esc(local(issue, locale, "zhSummary", "enSummary"))}</p><p class="empty-explanation">${locale === "zh" ? "已有进展留在归档。没有新证据时不重复旧内容，也不为凑页数补图。" : "Earlier advances remain in the archive. Without new evidence, old stories aren't repeated and no visuals are added to fill pages."}</p><a href="../../">${locale === "zh" ? "查看历史日报" : "Browse earlier editions"}</a><a href="../sources.md">${esc(words[locale].sources)}</a></section>` }];
  const storyPages = (topic, index) => [topicSlide(issue, topic, locale, index), ...visualDetailSlides(issue, topic, locale, index, figures(topic).slice(3)), ...topicDetailSlides(issue, topic, locale, index), ...mediaSlides(issue, topic, locale, index, topic.media ?? [])];
  const quickIds = new Set(issue.editorialPlan?.quickBriefIds ?? []);
  const quick = mainTopics.filter(topic => quickIds.has(topic.id) && !figures(topic).length && !topic.detailPages?.length && !topic.media?.length && ["zh", "en"].every(language => Object.values(topic.brief?.[language] ?? {}).join(" ").length <= 450));
  const pairs = chunks(quick, 2).filter(pair => pair.length === 2);
  const paired = new Map(pairs.flatMap(pair => pair.map(topic => [topic.id, pair])));
  const renderedPairs = new Set();
  const product = mainTopics.flatMap((topic, index) => {
    const pair = paired.get(topic.id);
    if (!pair) return storyPages(topic, index);
    if (renderedPairs.has(pair)) return [];
    renderedPairs.add(pair); return [quickPairSlide(issue, pair, locale, mainTopics)];
  });
  const context = (issue.contextTopics ?? []).flatMap((topic, index) => storyPages(topic, mainTopics.length + index).map((slide, pageIndex) => ({
    ...slide, type: pageIndex ? "context-detail" : "context",
    html: slide.html.replace("data-slide", 'data-slide data-coverage-kind="first-inclusion-context" data-is-new-today="false"').replace("data-event-id=", "data-context-id=").replace(/(data-topic-ref="[^"]*"|data-context-id="[^"]*")>/, `$1><h2 class="context-section-heading">${locale === "zh" ? "补充背景 · 首次收录" : "Background · first inclusion"}</h2><p class="context-label">${locale === "zh" ? "非今日新增" : "Not new today"} · ${esc(topic.event?.occurredAt)}</p>`)
  })));
  return [...overview, ...product, ...context, ...evidenceSlides(issue, locale)];
}

export function renderVisualIssue(issue, locale = "zh") {
  const slides = buildVisualSlides(issue, locale);
  const w = words[locale];
  const pageTitle = local(issue, locale, "zhTitle", "enTitle");
  const minutes = Number(issue.editorialPlan?.targetMinutes);
  const readingTarget = Number.isFinite(minutes) && minutes > 0 ? `<span class="reading-target">${locale === "zh" ? `约 ${esc(minutes)} 分钟` : `About ${esc(minutes)} minutes`}</span>` : "";
  return `<!doctype html>
<html lang="${locale === "zh" ? "zh-CN" : "en"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(pageTitle)} · AI Daily</title><meta name="description" content="${esc(local(issue, locale, "zhSummary", "enSummary"))}"><link rel="stylesheet" href="../../assets/issue-v2.css"></head>
<body class="visual-issue"><main class="visual-reader">
  <header class="report-header"><a class="brand" href="../../">AI Daily</a><span class="header-date">${esc(issue.date)} · ${esc(issue.timezone)}</span>${readingTarget}<nav class="header-actions" aria-label="${locale === "zh" ? "语言与来源" : "Language & sources"}"><a href="../zh/"${locale === "zh" ? ' aria-current="page"' : ""}>中文</a><a href="../en/"${locale === "en" ? ' aria-current="page"' : ""}>English</a><a href="../sources.md">${esc(w.sources)}</a><a class="primary" href="../ai-daily-${esc(issue.date)}-${locale}.pdf" download>${esc(w.pdf)}</a></nav></header>
  <div class="report-stage" data-deck aria-label="${esc(pageTitle)}">${slides.map((slide) => slide.html).join("\n")}</div>
  <footer class="report-controls" aria-label="${locale === "zh" ? "日报翻页" : "Issue navigation"}"><button type="button" class="contents-button" data-go-slide="overview">${esc(w.contents)}</button><button type="button" data-prev-slide>${esc(w.prev)}</button><div class="progress-track" aria-hidden="true"><span data-deck-progress></span></div><output data-deck-counter aria-live="polite">1 / ${slides.length}</output><button type="button" class="primary" data-next-slide>${esc(w.next)}</button></footer>
</main>
<script>
(() => {
 const deck = document.querySelector('[data-deck]');
 const slides = Array.from(deck.querySelectorAll('[data-slide]'));
 const previous = document.querySelector('[data-prev-slide]');
 const next = document.querySelector('[data-next-slide]');
 const count = document.querySelector('[data-deck-counter]');
 const progress = document.querySelector('[data-deck-progress]');
 let current = 0;
 function checkCurrentFit() {
   const slide = slides[current]; if (!slide || window.matchMedia('(max-width:900px)').matches) return;
   slide.dataset.fitOverflow = String(slide.scrollHeight > slide.clientHeight + 2 || slide.scrollWidth > slide.clientWidth + 2);
 }
 const indexForTarget = (id) => slides.findIndex(slide => slide.id === id || Array.from(slide.querySelectorAll('[id]')).some(element => element.id === id));
 const hashIndex = () => indexForTarget(location.hash.slice(1));
 function show(index, push = true, targetId = null) {
   current = Math.max(0, Math.min(slides.length - 1, index));
   slides.forEach((slide, i) => { slide.hidden = i !== current; slide.setAttribute('aria-hidden', i === current ? 'false' : 'true'); });
   count.textContent = (current + 1) + ' / ' + slides.length;
   progress.style.width = ((current + 1) / slides.length * 100) + '%';
   previous.disabled = current === 0; next.disabled = current === slides.length - 1;
   deck.scrollTop = 0;
   const target = targetId || slides[current].id;
   if (push && location.hash !== '#' + target) history.pushState(null, '', '#' + target);
   if (window.matchMedia('(max-width:900px)').matches) { window.scrollTo(0,0); const nested = Array.from(slides[current].querySelectorAll('[id]')).find(element => element.id === target); if(nested) nested.scrollIntoView({block:'start'}); }
   requestAnimationFrame(checkCurrentFit);
 }
 document.body.classList.add('js-deck');
 window.addEventListener('resize', checkCurrentFit);
 document.fonts.ready.then(checkCurrentFit);
 document.querySelectorAll('img').forEach(image => image.addEventListener('load', checkCurrentFit));
 previous.addEventListener('click', () => show(current - 1));
 next.addEventListener('click', () => show(current + 1));
 document.querySelectorAll('[data-go-slide]').forEach((button) => button.addEventListener('click', (event) => { event.preventDefault(); const target=button.dataset.goSlide; const index=indexForTarget(target); if (index >= 0) show(index,true,target); }));
 document.querySelectorAll('[data-media-toggle]').forEach((button) => button.addEventListener('click', () => {
   const player = button.closest('.gif-player'); const frame = player.querySelector('[data-gif-frame]');
   const playing = button.getAttribute('aria-pressed') !== 'true';
   frame.replaceChildren();
   if (playing) { const image = new Image(); image.alt = player.querySelector('.media-poster').alt; image.src = player.dataset.mediaUrl; frame.append(image); }
   player.classList.toggle('is-playing', playing); button.setAttribute('aria-pressed', String(playing)); button.textContent = playing ? button.dataset.pauseLabel : button.dataset.playLabel;
 }));
 window.addEventListener('beforeprint', () => {
   document.querySelectorAll('video').forEach(video => video.pause());
   document.querySelectorAll('.gif-player.is-playing [data-media-toggle]').forEach(button => button.click());
 });
 window.addEventListener('hashchange', () => show(Math.max(0, hashIndex()), false, location.hash.slice(1)));
 window.addEventListener('popstate', () => show(Math.max(0, hashIndex()), false, location.hash.slice(1)));
 window.addEventListener('keydown', (event) => {
   if (event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT|BUTTON|A/.test(event.target.tagName) || event.target.isContentEditable) return;
   if (event.key === 'ArrowRight' || event.key === 'PageDown') { event.preventDefault(); show(current + 1); }
   if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); show(current - 1); }
   if (event.key === 'Home') show(0); if (event.key === 'End') show(slides.length - 1);
 });
 show(Math.max(0, hashIndex()), false, location.hash.slice(1));
})();
</script></body></html>`;
}

export function visualIssueCss() {
  return `:root { --paper:#fffdf8; --ink:#171413; --red:#c7000b; --muted:#68666a; --line:#ddd7cf; color-scheme:light; }
* { box-sizing:border-box; }
body.visual-issue { margin:0; background:var(--paper); color:var(--ink); font-family:system-ui,-apple-system,"Noto Sans CJK SC","Microsoft YaHei",sans-serif; font-size:16px; line-height:1.5; }
a { color:inherit; text-underline-offset:4px; }
a:hover { color:var(--red); }
button,a { -webkit-tap-highlight-color:transparent; }
button { font:inherit; cursor:pointer; }
button:disabled { opacity:.4; cursor:default; }
a:focus-visible,button:focus-visible { outline:3px solid #3464c8; outline-offset:4px; }
.visual-reader { max-width:1680px; margin:0 auto; padding:20px 32px 16px; }
.report-header { display:flex; align-items:center; flex-wrap:wrap; gap:18px; padding-bottom:18px; }
.brand { font-size:34px; font-weight:850; letter-spacing:-1.8px; text-decoration:none; color:var(--red); }
.header-date { font-size:13px; letter-spacing:1.2px; color:var(--muted); }
.reading-target { color:var(--muted); font-size:13px; white-space:nowrap; }
.product-slide .context-section-heading,.report-slide .context-section-heading { font-size:20px; letter-spacing:0; margin-bottom:7px; color:var(--muted); }
.context-label { color:var(--muted); font-size:13px; margin:0 0 14px; }
.header-actions { margin-left:auto; display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
.header-actions a,.report-controls button { text-decoration:none; border:1px solid var(--line); padding:9px 17px; border-radius:999px; background:#fff; font-size:14px; font-weight:650; white-space:nowrap; }
.header-actions [aria-current] { background:#2f2336; color:#fff; border-color:#2f2336; }
.header-actions a.primary { background:#2f2336; color:#fff; border-color:#2f2336; }
.report-stage { padding:0; }
.report-slide { padding:8px 0 20px; }
.report-slide h1,.report-slide h2 { margin:0; font-weight:800; letter-spacing:-.8px; line-height:1.18; overflow-wrap:anywhere; }
.report-slide h1 { font-size:clamp(32px,3.5vw,52px); }
.product-slide>h2 { font-size:clamp(28px,2.6vw,42px); max-width:1400px; margin-bottom:22px; }
.slide-kicker,.event-meta { font-size:13px; color:var(--muted); margin:0 0 10px; }
.event-meta { display:flex; flex-wrap:wrap; align-items:center; gap:8px 18px; }
.event-meta>span:first-child { color:var(--red); font-weight:700; }
.overview-heading { display:flex; flex-wrap:wrap; align-items:baseline; gap:12px 28px; margin-bottom:14px; }
.overview-heading>p { color:var(--muted); font-size:18px; margin:0; }
.issue-intro { color:var(--muted); margin:0 0 18px; max-width:1100px; font-size:15px; }
.digest-rows { border-top:1px solid var(--line); }
.digest-row { display:grid; grid-template-columns:minmax(0,1.15fr) minmax(0,1fr); gap:28px; padding:18px 0; border-bottom:1px solid var(--line); align-items:center; }
.digest-images { display:flex; gap:10px; min-width:0; }
.digest-images .product-figure { flex:1; min-width:0; }
.digest-images .product-figure:first-child { flex:1.35; }
.digest-images .product-figure img { max-height:140px; width:100%; object-fit:contain; }
.digest-images .product-figure figcaption { font-size:11px; margin-top:5px; line-height:1.35; }
.digest-images .figure-source { display:none; }
.digest-copy h2 { font-size:clamp(22px,1.9vw,30px); }
.digest-title { text-decoration:none; }
.digest-copy>p { margin:10px 0; font-size:15px; color:var(--muted); }
.read-event { font-size:13px; font-weight:650; }
.text-led { grid-template-columns:180px minmax(0,1fr); }
.digest-text-visual { display:flex; flex-direction:column; gap:3px; color:var(--muted); font-size:12px; }
.digest-index { font-size:36px; font-weight:750; letter-spacing:-1px; color:var(--red); }
.visual-gallery { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:20px; margin:0 0 22px; align-items:start; }
.visual-gallery.count-1 { grid-template-columns:minmax(0,1fr); }
.visual-gallery.count-2 { grid-template-columns:repeat(2,minmax(0,1fr)); }
.product-figure { margin:0; min-width:0; }
.product-figure img { display:block; width:100%; height:auto; max-height:270px; object-fit:contain; object-position:center; }
.visual-gallery.count-1 img { max-height:255px; }
.image-link { display:block; }
.product-figure figcaption { margin-top:9px; font-size:13px; line-height:1.5; color:var(--muted); }
.figure-source { margin-left:5px; font-weight:600; }
.brief-grid,.use-limit-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px 34px; margin-bottom:18px; }
.brief-unit { min-width:0; }
.brief-unit h3 { margin:0 0 6px; font-size:14px; font-weight:750; }
.brief-unit p { margin:0; line-height:1.6; max-width:65ch; font-size:16px; }
.delta-unit h3 { color:var(--red); }
.change-columns { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:36px; margin:4px 0 24px; }
.change-columns .brief-unit { border-top:1px solid var(--line); padding-top:14px; }
.change-columns .delta-unit { border-top:3px solid var(--red); padding-top:12px; }
.change-columns h3 { font-size:23px; margin-bottom:10px; }
.visual-unavailable { margin:0 0 24px; padding:16px 0; border-top:1px solid var(--line); border-bottom:1px solid var(--line); color:var(--muted); font-size:14px; }
.visual-unavailable strong { display:block; margin-bottom:5px; font-weight:600; }
.visual-unavailable span { display:block; max-width:85ch; }
.event-source-row { display:flex; flex-wrap:wrap; gap:8px 20px; padding-top:14px; border-top:1px solid var(--line); font-size:12px; color:var(--muted); }
.event-source-row a:last-child { margin-left:auto; }
.baseline-source { font-size:12px; }
.detail-slide>h2,.visual-detail-slide>h2 { font-size:clamp(28px,2.6vw,42px); margin-bottom:22px; }
.detail-points { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:20px 34px; margin:0 0 22px; }
.detail-point { border-top:1px solid var(--line); padding-top:12px; }
.point-index { font-size:13px; font-weight:750; color:var(--red); }
.detail-point p { font-size:16px; line-height:1.6; margin:5px 0 8px; max-width:65ch; }
.point-sources { display:flex; gap:12px; flex-wrap:wrap; font-size:12px; color:var(--muted); }
.media-slide>h2 { font-size:clamp(28px,2.6vw,42px); margin-bottom:24px; }
.media-gallery { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:28px; margin:0 0 24px; }
.media-gallery.count-1 { grid-template-columns:minmax(0,1fr); max-width:1100px; }
.media-figure { margin:0; min-width:0; }
.media-figure video,.media-figure img { display:block; width:100%; max-height:420px; height:auto; object-fit:contain; background:#f3f1ec; }
.media-figure .print-poster { display:none; }
.media-figure figcaption { font-size:14px; color:var(--muted); margin-top:12px; line-height:1.6; }
.media-figure figcaption strong,.media-figure figcaption span { display:block; margin-bottom:5px; }
.media-figure figcaption a { margin-right:18px; }
.gif-player,.official-media-link { display:block; position:relative; }
.gif-frame { display:none; }
.gif-player.is-playing .media-poster { display:none; }
.gif-player.is-playing .gif-frame { display:block; }
.media-play { display:inline-block; border:1px solid var(--red); padding:9px 20px; color:#fff; background:var(--red); border-radius:999px; font-size:14px; font-weight:650; margin-top:10px; }
.official-media-link { text-decoration:none; }
.report-controls { display:none; align-items:center; gap:12px; padding-top:12px; border-top:1px solid var(--line); }
.report-controls .primary { color:#fff; background:var(--red); border-color:var(--red); }
.report-controls output { font-size:12px; min-width:48px; color:var(--muted); text-align:center; }
.progress-track { height:5px; background:#ebe7e2; border-radius:4px; flex:1; min-width:30px; overflow:hidden; }
.progress-track span { display:block; height:100%; background:var(--red); transition:width .18s; }
.js-deck .visual-reader { height:100dvh; display:flex; flex-direction:column; }
.js-deck .report-stage { flex:1; min-height:0; overflow:hidden; container-type:size; display:grid; place-items:center; }
.js-deck .report-slide { width:min(100cqw,calc(100cqh * 16 / 9)); height:min(100cqh,calc(100cqw * 9 / 16)); aspect-ratio:16 / 9; padding:12px 18px; overflow:hidden; }
.js-deck .report-controls { display:flex; flex-shrink:0; }
.js-deck .report-slide[hidden] { display:none; }
.quick-pair { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:28px; }
.quick-event { min-width:0; }
.quick-event+.quick-event { border-left:1px solid var(--line); padding-left:28px; }
.quick-event h2 { font-size:26px; margin:0 0 14px; }
.quick-brief { display:grid; gap:11px; }
.quick-visual-status { font-size:12px; color:var(--muted); margin:12px 0; }
.quick-event .event-source-row a:last-child { margin-left:0; }
.evidence-slide>h2 { font-size:36px; margin-bottom:18px; }
.evidence-policy { font-size:15px; line-height:1.7; max-width:100ch; color:var(--muted); }
.evidence-list { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px 35px; padding-left:22px; margin:24px 0; }
.evidence-list li { font-size:14px; padding-right:14px; }
.evidence-list span { display:block; color:var(--muted); font-size:12px; margin-top:3px; }
.source-ledger-link { font-size:14px; }
.no-news-slide { padding:60px 0; max-width:950px; }
.no-news-slide h1 { margin-bottom:24px; }
.no-news-slide>a { display:inline-block; margin:20px 28px 0 0; }
@media (max-width:900px) { .visual-reader { padding:16px 20px; } .header-date { display:none; } .header-actions a { padding:8px 12px; } .brand { font-size:29px; } .digest-row { gap:20px; } .product-slide>h2 { font-size:30px; } .brief-unit p { font-size:15px; } .visual-gallery { gap:14px; } }
@media (max-width:600px) { .visual-reader { padding:12px 16px; } .report-header { gap:8px; padding-bottom:12px; } .brand { font-size:28px; } .header-actions { width:100%; margin:0; gap:6px; } .header-actions a { font-size:12px; padding:7px 11px; } .digest-row,.text-led { grid-template-columns:minmax(0,1fr); gap:14px; } .digest-text-visual { flex-direction:row; align-items:baseline; gap:14px; flex-wrap:wrap; } .digest-index { font-size:25px; } .digest-images img { max-height:180px; } .digest-images figcaption { font-size:11px; } .digest-copy h2 { font-size:24px; } .overview-heading>p { font-size:15px; } .brief-grid,.use-limit-grid,.change-columns { grid-template-columns:1fr; gap:18px; } .visual-gallery,.visual-gallery.count-2 { grid-template-columns:1fr; } .product-figure img { max-height:320px; } .report-controls { gap:6px; } .report-controls button { padding:8px 11px; font-size:12px; } .progress-track { min-width:20px; } .report-controls output { min-width:40px; } .evidence-list { grid-template-columns:1fr; } .no-news-slide { padding:28px 0; } }
@media (prefers-reduced-motion:reduce) { .progress-track span { transition:none; } }
@media print { .report-stage,.js-deck .report-stage { container-type:normal; } .js-deck .report-slide { width:16in; height:9in; aspect-ratio:auto; max-width:none; padding:30px 40px; } }
@media screen and (min-width:901px) { .js-deck .report-slide .context-section-heading { font-size:18px; line-height:1.2; margin-bottom:4px; } .js-deck .context-label { margin-bottom:6px; } .js-deck .report-slide h1 { font-size:34px; } .js-deck .product-slide>h2,.js-deck .detail-slide>h2,.js-deck .visual-detail-slide>h2,.js-deck .media-slide>h2 { font-size:28px; margin-bottom:14px; } .js-deck .event-meta { font-size:12px; margin-bottom:7px; gap:5px 14px; } .js-deck .brief-unit p,.js-deck .detail-point p { font-size:14.5px; line-height:1.45; } .js-deck .brief-unit h3 { font-size:13px; margin-bottom:4px; } .js-deck .brief-grid,.js-deck .use-limit-grid { gap:12px 24px; margin-bottom:12px; } .js-deck .product-figure img { max-height:clamp(170px,30cqh,230px); } .js-deck .product-figure figcaption { font-size:12px; line-height:1.35; margin-top:6px; } .js-deck .visual-gallery { margin-bottom:14px; gap:14px; } .js-deck .digest-images .product-figure img { max-height:90px; } .js-deck .digest-images .product-figure figcaption { font-size:11px; line-height:1.25; margin-top:4px; } .js-deck .digest-row { padding:6px 0; gap:22px; } .js-deck .digest-copy h2 { font-size:21px; } .js-deck .digest-copy>p { font-size:14px; margin:7px 0; } .js-deck .overview-heading { gap:8px 22px; margin-bottom:9px; } .js-deck .overview-heading>p { font-size:15px; } .js-deck .issue-intro { font-size:14px; line-height:1.4; margin-bottom:11px; } .js-deck .slide-kicker { font-size:12px; margin-bottom:6px; } .js-deck .event-source-row { font-size:11px; padding-top:9px; gap:5px 14px; } .js-deck .change-columns { margin:0 0 15px; gap:28px; } .js-deck .change-columns h3 { font-size:21px; } .js-deck .visual-unavailable { padding:10px 0; margin-bottom:15px; font-size:13px; } .js-deck .quick-event h2 { font-size:24px; } .js-deck .quick-event .brief-unit p { font-size:14px; } .js-deck .detail-points { gap:14px 26px; margin-bottom:14px; } .js-deck .detail-point { padding-top:8px; } .js-deck .media-figure video,.js-deck .media-figure img { max-height:43cqh; } .js-deck .media-figure figcaption { font-size:13px; } }
@media (max-width:900px) { .js-deck .visual-reader { height:auto; min-height:100dvh; } .js-deck .report-stage { overflow:visible; container-type:normal; display:block; flex:none; } .js-deck .report-slide { width:100%; height:auto; aspect-ratio:auto; overflow:visible; padding:8px 0 20px; } .js-deck .report-controls { position:sticky; bottom:0; background:var(--paper); z-index:2; margin-top:16px; padding-bottom:8px; } .quick-pair { grid-template-columns:1fr; } .quick-event+.quick-event { border-left:0; border-top:1px solid var(--line); padding:20px 0 0; } }
@media (max-width:600px) { .detail-points,.media-gallery { grid-template-columns:1fr; } .detail-slide>h2,.visual-detail-slide>h2,.media-slide>h2 { font-size:28px; } .media-figure video,.media-figure img { max-height:300px; } }
@media print { .detail-slide>h2,.visual-detail-slide>h2,.media-slide>h2 { font-size:34px; } .detail-point p { font-size:14px; } .media-figure video,.gif-frame,.media-play { display:none!important; } .media-figure .print-poster,.gif-player.is-playing .media-poster { display:block!important; } .media-figure img { max-height:380px; background:transparent; } .media-gallery { margin-top:24px; } }
@page { size:16in 9in; margin:0; }
@media print { body.visual-issue { background:#fffdf8; font-size:14px; } .visual-reader,.js-deck .visual-reader { display:block; height:auto; width:16in; max-width:none; padding:0; } .report-header,.report-controls,.js-deck .report-controls { display:none; } .report-stage,.js-deck .report-stage { display:block; overflow:visible; } .report-slide,.js-deck .report-slide[hidden] { display:block!important; width:16in; height:9in; padding:30px 40px; break-after:page; page-break-after:always; overflow:hidden; } .report-slide:last-child { break-after:auto; page-break-after:auto; } .report-slide h1 { font-size:42px; } .product-slide>h2 { font-size:34px; margin-bottom:18px; } .event-meta { font-size:12px; } .visual-gallery { margin-bottom:18px; gap:16px; } .product-figure img { max-height:260px; } .visual-gallery.count-1 img { max-height:250px; } .brief-unit p { font-size:14px; line-height:1.55; } .brief-grid,.use-limit-grid { gap:14px 30px; } .change-columns h3 { font-size:22px; } .digest-row { padding:16px 0; } .digest-images img { max-height:145px; } .digest-copy h2 { font-size:26px; } .digest-copy>p { font-size:14px; } .issue-intro { font-size:14px; } .read-event,.figure-source { font-size:11px; } .event-source-row { font-size:11px; } .no-news-slide { padding:80px 60px; } a { text-decoration:none; } }`;
}
