#!/usr/bin/env python3
"""A separately laid-out, data-driven PDF fallback; no browser-print parity claim.

python3 scripts/export-pdfs-reportlab.py --issue data/editions/2026-10-06.json
The default root is the repository root and output is root/issue-date. All PDFs
are built and validated in a temporary directory before any output is replaced.
"""
import argparse
import hashlib
import json
import re
import sys
import tempfile
from pathlib import Path
from xml.sax.saxutils import escape

from PIL import Image as PILImage
from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont as RLTTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak, KeepTogether, Table, TableStyle

PAGE = landscape(A4)
MARGIN = 42
WIDTH = PAGE[0] - 2 * MARGIN
INK = colors.HexColor('#172e35')
TEAL = colors.HexColor('#087e83')
MUTED = colors.HexColor('#52666b')
WORDS = {
 'zh': {'overview':'今天值得看的变化','reading':'先看新增，再看图与细节','what':'产品是什么','change':'这次变化','use':'什么时候用','limits':'限制与可用范围','before':'此前 · 已核实背景','sources':'来源与证据说明','published':'来源发布日期','missing':'尚无可核实的产品图','context':'首次收录背景','event':'进展日期','included':'首次收录','demo':'演示','original':'原始来源','details':'图像与细节'},
 'en': {'overview':'Changes worth seeing','reading':'New advances first, then pictures and details','what':'What it is','change':'What changed','use':'When to use it','limits':'Limits & availability','before':'Before · verified baseline','sources':'Sources & evidence','published':'Published','missing':'No verified product figure yet','context':'First-inclusion context','event':'Event date','included':'First included','demo':'Demo','original':'Original source','details':'Figures & details'}
}

def local(obj, locale, stem):
    return obj.get(('zh' if locale == 'zh' else 'en') + stem, '')

def suffix(obj, locale, stem):
    return obj.get(stem + ('Zh' if locale == 'zh' else 'En'), '')

def all_text(value):
    if isinstance(value, dict):
        return ''.join(all_text(v) for v in value.values())
    if isinstance(value, list):
        return ''.join(all_text(v) for v in value)
    return str(value or '')

def register_font(issue, directory):
    """Subset official installed Noto SC CFF outlines, convert to embeddable TTF.

    ReportLab cannot embed CFF TTC directly. Cu2Qu converts only the required
    glyphs; no system font files are changed. ToUnicode remains searchable.
    """
    from fontTools.ttLib import TTFont
    from fontTools import subset
    from fontTools.fontBuilder import FontBuilder
    from fontTools.pens.ttGlyphPen import TTGlyphPen
    from fontTools.pens.cu2quPen import Cu2QuPen
    source = Path('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc')
    if not source.exists():
        raise RuntimeError('Installed Noto Sans CJK SC font is required')
    font = TTFont(source, fontNumber=2)
    text = all_text(issue) + all_text(WORDS) + Path(__file__).read_text()
    chars = set(map(ord, text))
    absent = chars - set(font.getBestCmap())
    # Whitespace/control characters need no visible glyph.
    absent = {c for c in absent if not chr(c).isspace() and c >= 32}
    if absent:
        raise RuntimeError('Noto font lacks text glyphs: ' + ', '.join(f'U+{c:04X}' for c in sorted(absent)))
    options = subset.Options()
    options.notdef_glyph = True
    sub = subset.Subsetter(options=options)
    sub.populate(unicodes=chars)
    sub.subset(font)
    glyph_order = font.getGlyphOrder()
    glyph_set = font.getGlyphSet()
    glyphs = {}
    for name in glyph_order:
        pen = TTGlyphPen(glyph_set)
        glyph_set[name].draw(Cu2QuPen(pen, max_err=1.0, reverse_direction=True))
        glyphs[name] = pen.glyph()
    fb = FontBuilder(font['head'].unitsPerEm, isTTF=True)
    fb.setupGlyphOrder(glyph_order)
    fb.setupCharacterMap(font.getBestCmap())
    fb.setupGlyf(glyphs)
    fb.setupHorizontalMetrics({name: font['hmtx'][name] for name in glyph_order})
    fb.setupHorizontalHeader(ascent=font['hhea'].ascent, descent=font['hhea'].descent)
    fb.setupNameTable({'familyName':'AI Daily Noto SC','styleName':'Regular','uniqueFontIdentifier':'AI-Daily-Noto-SC','fullName':'AI Daily Noto SC','psName':'AIDailyNotoSC'})
    os2 = font['OS/2']
    fb.setupOS2(sTypoAscender=os2.sTypoAscender, sTypoDescender=os2.sTypoDescender, usWinAscent=os2.usWinAscent, usWinDescent=os2.usWinDescent)
    fb.setupPost()
    fb.setupMaxp()
    path = directory / 'noto-sc-subset.ttf'
    fb.save(path)
    pdfmetrics.registerFont(RLTTFont('DailyNoto', str(path)))
    return 'DailyNoto'

class Exporter:
    def __init__(self, issue, locale, root, font):
        self.issue, self.locale, self.root = issue, locale, root
        self.w = WORDS[locale]
        common = dict(fontName=font, textColor=INK, alignment=TA_LEFT, wordWrap='CJK' if locale == 'zh' else None, splitLongWords=True)
        self.styles = {
          'title': ParagraphStyle('title', fontSize=24, leading=31, spaceAfter=14, **common),
          'heading': ParagraphStyle('heading', fontSize=17, leading=23, spaceAfter=8, keepWithNext=True, **common),
          'body': ParagraphStyle('body', fontSize=11.5, leading=17, spaceAfter=9, **common),
          'label': ParagraphStyle('label', fontSize=10.5, leading=14, spaceAfter=3, keepWithNext=True, **{**common, 'textColor':TEAL}),
          'caption': ParagraphStyle('caption', fontSize=9.5, leading=13.5, spaceAfter=6, **{**common, 'textColor':MUTED}),
          'meta': ParagraphStyle('meta', fontSize=9, leading=13, spaceAfter=7, **{**common, 'textColor':MUTED}),
        }
        self.story = []
        self.required = []
        self.ledger = {}

    def p(self, text, style='body', required=True):
        text = str(text or '')
        if required and text:
            self.required.append(text)
        return Paragraph(escape(text), self.styles[style])

    def link(self, label, url, style='caption'):
        if not re.match(r'^https?://', str(url or '')):
            raise ValueError(f'Invalid source URL: {url}')
        return Paragraph(f'<link href="{escape(url, {chr(34): "&quot;"})}" color="#087e83">{escape(label)}</link>', self.styles[style])

    def add(self, text, style='body'):
        if text:
            self.story.append(self.p(text, style))

    def remember(self, url, label='', published=None, effective_date=None):
        if not url:
            return
        if url not in self.ledger:
            self.ledger[url] = {'url':url, 'label':label or url, 'publishedAt':published, 'effectiveDate':effective_date}
        else:
            # Figure provenance can be encountered before the source record.
            # Preserve the official label/date when it becomes available.
            if label:
                self.ledger[url]['label'] = label
            if published:
                self.ledger[url]['publishedAt'] = published
            if effective_date:
                self.ledger[url]['effectiveDate'] = effective_date

    def meta(self, topic):
        e = topic.get('event', {})
        text = f"{e.get('productKey','')} · {self.w['event']} {e.get('occurredAt','')}"
        if e.get('version'):
            text += f" · v{e['version']}"
        text += ' · ' + str(topic.get('evidenceLabel') or e.get('kind',''))
        context = e.get('kind') in ('first-inclusion-context', 'context') or topic.get('freshness') == 'first-inclusion-context' or topic.get('isNewToday') is False
        # An event explicitly older than this issue's freshness window is context.
        from datetime import date
        if e.get('occurredAt') and self.issue.get('date'):
            context |= (date.fromisoformat(self.issue['date']) - date.fromisoformat(e['occurredAt'])).days > self.issue.get('lookbackDays', 2)
        if context:
            text += f" · {self.w['context']} · {self.w['included']} {topic.get('firstIncludedOn', self.issue['date'])}"
        self.add(text, 'meta')

    def image(self, visual, width=WIDTH, height=215):
        rel = str(visual.get('path',''))
        if not re.fullmatch(r'assets/[^/]+', rel):
            raise ValueError(f'Invalid factual image path: {rel}')
        path = self.root / self.issue['date'] / rel
        if not path.exists():
            raise ValueError(f'Missing factual image: {path}')
        with PILImage.open(path) as image:
            iw, ih = image.size
        scale = min(width / iw, height / ih)
        flow = Image(str(path), width=iw*scale, height=ih*scale, hAlign='LEFT')
        caption = suffix(visual,self.locale,'caption') or suffix(visual,self.locale,'alt')
        items = [flow, Spacer(1,5), self.p(caption,'caption')]
        url = visual.get('sourceUrl')
        if url:
            items.append(self.link(self.w['original'],url))
            self.remember(url)
        return items

    def gallery(self, visuals, height=215):
        # One-column figures preserve readable screenshots. Content is never
        # discarded to fit a page; Platypus paginates image-caption groups.
        for visual in visuals:
            self.story.append(KeepTogether(self.image(visual, height=height)))
            self.story.append(Spacer(1,5))

    def source_row(self, topic):
        for source in topic.get('sources',[]):
            evidence = source.get('dateEvidence', {})
            effective = None
            if source.get('isPrimary') is True and evidence.get('kind') == 'effective-date' and evidence.get('quote') and re.fullmatch(r'\d{4}-\d{2}-\d{2}',str(evidence.get('date',''))):
                from datetime import date
                try:
                    effective = date.fromisoformat(evidence['date']).isoformat()
                except ValueError:
                    pass
            self.remember(source.get('url'), source.get('label',''), source.get('publishedAt'),effective)
        selected = [s for s in topic.get('sources',[]) if s.get('isPrimary')][:2] or topic.get('sources',[])[:2]
        for s in selected:
            self.story.append(self.link(s.get('label') or s['url'], s['url']))
        history = topic.get('event',{}).get('previousIssue')
        if history:
            self.add(('上次报道' if self.locale=='zh' else 'Previous coverage') + ' · ' + history,'meta')

    def media(self, topic, items):
        for item in items:
            if item.get('kind') not in ('video','gif','official-link') or not item.get('poster'):
                raise ValueError('Media needs a verified factual poster and supported kind')
            self.story.append(PageBreak())
            self.meta(topic)
            self.add(local(topic,self.locale,'Headline') + ' · ' + self.w['demo'],'title')
            self.gallery([item['poster']])
            self.add(suffix(item,self.locale,'caption'))
            self.add(suffix(item,self.locale,'whatToSee'))
            self.add('PDF 使用已核验的静态海报；点击链接观看原始演示' if self.locale=='zh' else 'PDF uses a verified static poster; follow the link for the original demo','caption')
            for label, url in [(self.w['original'],item.get('sourceUrl')),('官方演示' if self.locale=='zh' else 'Official demo',item.get('url'))]:
                if url:
                    self.story.append(self.link(label,url)); self.remember(url)
            self.source_row(topic)

    def overview_summary(self, topic):
        summary = suffix(topic.get('event',{}),self.locale,'summary')
        headline = local(topic,self.locale,'Headline')
        # The headline is already visible above. Omit identical body copy;
        # full brief units remain in the corresponding story section.
        return '' if norm(summary) == norm(headline) else summary

    def build(self):
        fresh_topics = self.issue.get('topics',[])
        context_topics = self.issue.get('contextTopics',[])
        topics = fresh_topics + context_topics
        for start in range(0,max(1,len(fresh_topics)),3):
            if start: self.story.append(PageBreak())
            self.add(self.issue['date'] + ' · ' + self.issue.get('timezone','') + ' · ' + self.issue.get('cutoff',''),'meta')
            self.add(local(self.issue,self.locale,'Title') if not start else self.w['overview'],'title')
            if not start:
                self.add(local(self.issue,self.locale,'Summary'))
                self.add('约15分钟（编辑估算）· 插图短报与变化优先比较' if self.locale=='zh' else 'About 15 minutes (editorial estimate) · Illustrated digest & change-first comparisons','caption')
                self.add('PDF 为独立排版，静态海报链接到原始媒体' if self.locale=='zh' else 'PDF has a separate layout; static posters link to original media','caption')
            for i, topic in enumerate(fresh_topics[start:start+3], start+1):
                visuals = topic.get('visuals',[]) or ([topic['visual']] if topic.get('visual') else [])
                copy = [self.p(f"{i:02d}  {local(topic,self.locale,'Headline')}",'heading')]
                summary = self.overview_summary(topic)
                if summary:
                    copy.append(self.p(summary))
                copy.append(self.p(self.w['event']+' '+topic.get('event',{}).get('occurredAt',''),'meta'))
                if visuals:
                    image = self.image(visuals[0],width=180,height=75)[0]
                    row = Table([[image,copy]],colWidths=[195,WIDTH-195],hAlign='LEFT')
                    row.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8)]))
                    self.story.append(row)
                else:
                    self.story.extend(copy)
        if not fresh_topics:
            self.add('今天没有符合标准的新增进展' if self.locale=='zh' else 'No new advances met the evidence bar today')
        if context_topics:
            self.story.append(PageBreak())
            self.add('非今日新增 · 首次收录背景' if self.locale == 'zh' else 'Background · first inclusion', 'title')
            self.add('以下为较早公开、今天首次纳入的背景，未计入今日新增。' if self.locale == 'zh' else 'These earlier publications are newly included as background, and are not counted as fresh advances today.')
            for topic in context_topics:
                self.meta(topic)
                self.add(local(topic,self.locale,'Headline'),'heading')
                self.add(self.overview_summary(topic))
        for topic in topics:
            self.story.append(PageBreak())
            self.meta(topic)
            self.add(local(topic,self.locale,'Headline'),'title')
            copy = topic.get('brief',{}).get(self.locale,{})
            comparison = topic.get('comparison',{})
            baseline = comparison.get(self.locale,{}).get('before')
            change_first = topic.get('event',{}).get('previousIssue') or topic.get('event',{}).get('kind') == 'availability-change'
            # Preserve all four brief units even when a verified comparison exists.
            if change_first and baseline and comparison.get('sourceUrl'):
                self.add(self.w['before'],'label'); self.add(baseline)
                self.story.append(self.link('历史证据' if self.locale=='zh' else 'Baseline evidence', comparison['sourceUrl']))
                self.remember(comparison['sourceUrl'])
            if change_first:
                order = ['change','what','use','limits']
            else:
                order = ['what','change','use','limits']
            visuals = topic.get('visuals',[]) or ([topic['visual']] if topic.get('visual') else [])
            if visuals:
                # Hero figure plus complete brief units; additional figures receive
                # their own logical continuation and remain at useful image sizes.
                self.gallery(visuals[:1],height=115)
            else:
                self.add(topic.get('visualMissing',{}).get(self.locale) or self.w['missing'],'caption')
            for key in order:
                self.add(self.w[key],'label'); self.add(copy.get(key,''))
            self.source_row(topic)
            if len(visuals)>1:
                self.story.append(PageBreak()); self.meta(topic)
                self.add(local(topic,self.locale,'Headline')+' · '+self.w['details'],'title')
                self.gallery(visuals[1:])
            for page in topic.get('detailPages',[]):
                self.story.append(PageBreak()); self.meta(topic)
                self.add(local(page,self.locale,'Title'),'title')
                self.gallery(page.get('visuals',[]) or ([page['visual']] if page.get('visual') else []))
                for index, point in enumerate(page.get('points',[]),1):
                    self.add(f'{index:02d}','label'); self.add(point.get(self.locale,''))
                    for i,url in enumerate(point.get('sourceUrls',[]),1):
                        self.story.append(self.link(('依据' if self.locale=='zh' else 'Evidence')+f' {i}',url))
                        self.remember(url)
                self.source_row(topic)
                self.media(topic,page.get('media',[]))
            self.media(topic,topic.get('media',[]))
        if self.ledger:
            self.story.append(PageBreak());self.add(self.w['sources'],'title')
            self.add('只将有明确日期、来源和实质变化的进展列为新增；旧背景单独标明。研究、演示、融资与可售产品不等同。图像来自核验来源，静态海报不声称复现视频帧。' if self.locale=='zh' else 'Only dated, sourced substantive advances count as new. Older context is labeled separately. Research, demos, funding and shipping products are distinct. Figures come from verified sources; static posters do not claim to reproduce video frames.')
            for i,source in enumerate(self.ledger.values(),1):
                self.story.append(KeepTogether([self.link(f"{i:02d}  {source['label']}",source['url'],'caption'), self.p(self.source_date_label(source),'caption'), self.link(source['url'],source['url'],'caption')]))
        return self.story

    def source_date_label(self, source):
        label = self.w['published'] + ': ' + str(source.get('publishedAt') or ('未标注' if self.locale == 'zh' else 'not stated'))
        if source.get('effectiveDate'):
            label += ('；生效日期: ' if self.locale == 'zh' else '; effective date: ') + source['effectiveDate']
        return label

    def footer(self, canvas, doc):
        canvas.saveState()
        canvas.setFillColor(MUTED);canvas.setFont('DailyNoto',8)
        canvas.drawString(MARGIN,22,f"AI Daily · {self.issue['date']} · {self.locale.upper()} · PDF / ReportLab")
        canvas.drawRightString(PAGE[0]-MARGIN,22,str(doc.page))
        canvas.setStrokeColor(colors.HexColor('#d8e3e5'))
        canvas.line(MARGIN,34,PAGE[0]-MARGIN,34)
        canvas.restoreState()

def norm(text):
    return re.sub(r'\s+','',text)

def export(args):
    args.root = args.root.resolve()
    output = (args.output_dir or args.root / 'pending').resolve()
    if 'Users' in args.root.parts or 'Users' in output.parts:
        raise ValueError('Cloud-only exporter refuses /Users/ paths')
    if not output.is_relative_to(args.root):
        raise ValueError('PDF output must stay inside the specified cloud root')
    issue_bytes = args.issue.read_bytes()
    issue = json.loads(issue_bytes)
    if not re.fullmatch(r'\d{4}-\d{2}-\d{2}',issue.get('date','')):
        raise ValueError('Issue requires an ISO date')
    locales = args.locales.split(',')
    if not locales or any(l not in WORDS for l in locales):
        raise ValueError('Locales must be zh,en')
    output = (args.output_dir or args.root / issue['date']).resolve()
    if not output.is_relative_to(args.root) or 'Users' in output.parts:
        raise ValueError('PDF output must stay inside the specified cloud root, outside /Users/')
    for name in [f"ai-daily-{issue['date']}-{locale}.pdf" for locale in locales] + ['pdf-export.json']:
        target = (output / name).resolve()
        if not target.is_relative_to(args.root) or 'Users' in target.parts:
            raise ValueError('PDF output target must stay inside the specified cloud root, outside /Users/')
    summaries = []
    with tempfile.TemporaryDirectory(prefix='ai-daily-reportlab-') as temp:
        temp = Path(temp)
        font = register_font(issue,temp)
        ready = []
        for locale in locales:
            renderer = Exporter(issue,locale,args.root,font)
            dest = temp / f"ai-daily-{issue['date']}-{locale}.pdf"
            doc = SimpleDocTemplate(str(dest),pagesize=PAGE,rightMargin=MARGIN,leftMargin=MARGIN,topMargin=36,bottomMargin=48,title=local(issue,locale,'Title'),author='AI Daily',pageCompression=1)
            doc.build(renderer.build(),onFirstPage=renderer.footer,onLaterPages=renderer.footer)
            reader = PdfReader(dest)
            count = len(reader.pages)
            if count>args.max_pages:
                raise ValueError(f'{locale} PDF exceeds hard page limit: {count} > {args.max_pages}; revise the editorial plan, never silently truncate')
            parts = []
            for page in reader.pages:
                page.extract_text(visitor_text=lambda text, cm, tm, font_dict, font_size: parts.append(text) if font_size != 8 else None)
            extracted = norm(''.join(parts))
            missing = [s for s in renderer.required if norm(s) not in extracted]
            if missing:
                raise ValueError(f'{locale} PDF text completeness failed: {missing[0][:100]}')
            ready.append(dest)
            summaries.append({'locale':locale,'pages':count,'file':str(output/dest.name),'layout':'independent ReportLab layout','font':'embedded Noto Sans CJK SC subset'})
        output.mkdir(parents=True,exist_ok=True)
        for dest in ready:
            target=output/dest.name
            target.write_bytes(dest.read_bytes())
        sidecar = {'renderer':'reportlab', 'date':issue['date'], 'pages':{s['locale']:s['pages'] for s in summaries}, 'sourceDataSha256':hashlib.sha256(issue_bytes).hexdigest(), 'note':'Independent static ReportLab layout; not browser-print parity. Verified media posters link to originals.'}
        (output/'pdf-export.json').write_text(json.dumps(sidecar,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(summaries,ensure_ascii=False))

if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--issue',type=Path,required=True)
    parser.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1])
    parser.add_argument('--output-dir',type=Path)
    parser.add_argument('--locales',default='zh,en')
    parser.add_argument('--max-pages',type=int,default=50)
    args=parser.parse_args()
    if not 1<=args.max_pages<=50:
        parser.error('--max-pages must be between 1 and 50')
    try: export(args)
    except Exception as error:
        print(f'PDF export failed: {error}',file=sys.stderr)
        sys.exit(1)
