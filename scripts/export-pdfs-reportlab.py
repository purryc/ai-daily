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
from io import BytesIO
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
from reportlab.pdfgen import canvas as pdfcanvas
from types import SimpleNamespace
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode

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
            embedded=image.copy()
        # Preserve the complete factual frame, embedding at ample print resolution
        # rather than retaining multi-megapixel originals in every PDF.
        embedded.thumbnail((1400,1400),PILImage.Resampling.LANCZOS)
        buffer=BytesIO()
        if 'A' in embedded.getbands():embedded.save(buffer,format='PNG',optimize=True)
        else:embedded.convert('RGB').save(buffer,format='JPEG',quality=92,subsampling=0,optimize=True)
        buffer.seek(0)
        scale = min(width / iw, height / ih)
        flow = Image(buffer, width=iw*scale, height=ih*scale, hAlign='LEFT')
        caption = suffix(visual,self.locale,'caption') or suffix(visual,self.locale,'alt')
        items = [flow, Spacer(1,5), self.p(caption,'caption')]
        url = visual.get('sourceUrl')
        if url:
            items.append(self.link(self.w['original'],url))
            self.remember(url)
        return items

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

def canonical_url(value):
    u=urlsplit(str(value or ''))
    host=re.sub(r'^www\.','',u.netloc.lower())
    query=urlencode(sorted((k,v) for k,v in parse_qsl(u.query,keep_blank_values=True) if not re.match(r'^(utm_|fbclid$|gclid$|mc_|ref$|ref_src$)',k,re.I)))
    return urlunsplit((u.scheme,host,u.path.rstrip('/'),query,''))

def editorial_plan(issue, supplied=None):
    topics=issue.get('topics',[])+issue.get('contextTopics',[])
    ids=[t['id'] for t in topics]
    if len(ids)!=len(set(ids)):
        raise ValueError('Editorial page plan has duplicate story IDs')
    contexts={t['id'] for t in issue.get('contextTopics',[])}
    plan=supplied or ([{'id':'overview','type':'contents','topicIds':ids}]+[
        {'id':f'event-{i+1}','type':'context' if t['id'] in contexts else 'product','topicIds':[t['id']]} for i,t in enumerate(topics)
    ]+[{'id':'evidence-1','type':'references','topicIds':ids}])
    if len(plan)!=len(ids)+2 or plan[0].get('type')!='contents' or plan[-1].get('type')!='references':
        raise ValueError('Editorial page plan needs one contents page, one references page and one page per story')
    stories=plan[1:-1]
    actual=[p.get('topicIds',[None])[0] if len(p.get('topicIds',[]))==1 else None for p in stories]
    if sorted(actual,key=str)!=sorted(ids) or len(set(actual))!=len(ids) or any(p.get('type') not in ('product','context') for p in stories):
        raise ValueError('Editorial page plan repeats, omits or combines a story')
    if len({p.get('id') for p in plan})!=len(plan):
        raise ValueError('Editorial page plan has duplicate page IDs')
    return plan

class DenseExporter(Exporter):
    """One editorial page per plan entry, without hidden flow/spill or tiny type."""
    def __init__(self, issue, locale, root, font, plan, reference_index=None, contents_labels=None, contents_updates=None):
        super().__init__(issue,locale,root,font)
        self.plan=plan
        self.contents_labels=contents_labels or {}
        self.contents_updates=contents_updates or {}
        self.topics={t['id']:t for t in issue.get('topics',[])+issue.get('contextTopics',[])}
        self.context_ids={t['id'] for t in issue.get('contextTopics',[])}
        self.styles['title'].fontSize=21;self.styles['title'].leading=26;self.styles['title'].spaceAfter=8
        self.styles['body'].fontSize=11.5;self.styles['body'].leading=16;self.styles['body'].spaceAfter=5
        self.styles['label'].spaceAfter=2
        self.styles['caption'].leading=12.5;self.styles['caption'].spaceAfter=4
        self.styles['heading'].fontSize=14;self.styles['heading'].leading=18;self.styles['heading'].spaceAfter=5
        self.ledger_url=f"https://purryc.github.io/ai-daily/{issue['date']}/sources.md"
        for topic in self.topics.values():
            self.source_row(topic);self.story=[]
            for page in topic.get('detailPages',[]):
                for point in page.get('points',[]):
                    for url in point.get('sourceUrls',[]):self.remember(url)
            for media in self.topic_media(topic):
                for url in [media.get('sourceUrl'),media.get('url')]:
                    self.remember(url,local(topic,locale,'Headline')+' · '+self.w['demo'])
            for visual in self.topic_figures(topic):self.remember(visual.get('sourceUrl'))
            if topic.get('comparison',{}).get('sourceUrl'):self.remember(topic['comparison']['sourceUrl'])
        if reference_index is not None:
            expected={canonical_url(url) for url in self.ledger}
            provided={canonical_url(s['url']) for s in reference_index}
            if expected!=provided:raise ValueError('Shared reference index omits or invents a provenance URL')
            original={canonical_url(url):s for url,s in self.ledger.items()}
            self.ledger={s['url']:{**original.get(canonical_url(s['url']),{}),**s} for s in reference_index}
        else:
            grouped={}
            for url,s in self.ledger.items():
                key=canonical_url(url)
                if key not in grouped:grouped[key]=s
            self.ledger={s['url']:s for s in grouped.values()}
        self.source_numbers={canonical_url(url):i+1 for i,url in enumerate(self.ledger)}

    def topic_media(self,topic):
        return topic.get('media',[])+[m for p in topic.get('detailPages',[]) for m in p.get('media',[])]

    def remember(self,url,label='',published=None,effective_date=None):
        if hasattr(self,'source_numbers'):
            if url and canonical_url(url) not in self.source_numbers:
                raise ValueError('Shared reference index omits an image/media provenance URL')
            return
        super().remember(url,label,published,effective_date)

    def topic_figures(self,topic):
        items=(topic.get('visuals',[]) or ([topic['visual']] if topic.get('visual') else []))+[v for p in topic.get('detailPages',[]) for v in p.get('visuals',[])]+[m['poster'] for m in self.topic_media(topic) if m.get('poster')]
        by_path={}
        for v in items:
            if v.get('path') not in by_path:by_path[v['path']]={**v,'_captions':[]}
            caption=suffix(v,self.locale,'caption') or suffix(v,self.locale,'alt')
            if caption and caption not in by_path[v['path']]['_captions']:by_path[v['path']]['_captions'].append(caption)
        return list(by_path.values())

    def block(self,c,flows,x,top,width,bottom,page_id):
        y=top
        for flow in flows:
            _,height=flow.wrap(width, max(1,y-bottom))
            gap=flow.getSpaceAfter() if hasattr(flow,'getSpaceAfter') else 4
            if height>y-bottom+0.1:
                raise ValueError(f'Editorial page fit error on {page_id} ({self.locale}): revise this story/grid; do not spill, truncate or shrink body type')
            flow.drawOn(c,x,y-height);y-=height+gap
        return y

    def linked_paragraph(self,text,urls=(),style='body'):
        text=str(text or '')
        if text:self.required.append(text)
        refs=' '.join(f'<link href="#evidence-1" color="#087e83">[{self.source_numbers[canonical_url(url)]}]</link>' for url in dict.fromkeys(urls) if canonical_url(url) in self.source_numbers)
        return Paragraph(escape(text)+((' '+refs) if refs else ''),self.styles[style])

    def is_context(self,t):
        return t['id'] in self.context_ids or t.get('isNewToday') is False or t.get('event',{}).get('kind') in ('first-inclusion-context','context')

    def meta_text(self,t):
        event=t.get('event',{})
        label=f"{event.get('productKey','')} · {self.w['event']} {event.get('occurredAt','')} · {t.get('evidenceLabel','')}"
        if self.is_context(t):label=('非今日新增 · 首次收录背景' if self.locale=='zh' else 'Not new today · First-inclusion context')+' · '+label+' · '+self.w['included']+' '+t.get('firstIncludedOn',self.issue['date'])
        return label

    def contents(self,c,p):
        top=PAGE[1]-36
        header=[self.p(local(self.issue,self.locale,'Title'),'title'),self.p(self.issue['date']+' · '+self.issue.get('timezone','')+' · '+self.issue.get('cutoff',''),'meta'),self.p('目录' if self.locale=='zh' else 'Contents','heading'),self.p(local(self.issue,self.locale,'Summary'),'caption')]
        top=self.block(c,header,MARGIN,top,WIDTH,48,p['id'])-10
        ids=[q['topicIds'][0] for q in self.plan[1:-1]]
        if not ids:self.block(c,[self.p('今天没有可核实的新进展' if self.locale=='zh' else 'No verified new advances today')],MARGIN,top,WIDTH,48,p['id']);return
        columns=2;rows=(len(ids)+1)//2;col_width=(WIDTH-24)/2;row_height=(top-52)/rows
        if row_height<38:raise ValueError('Editorial contents page fit error: select a readable 15-minute route')
        for i,ident in enumerate(ids):
            topic=self.topics[ident];col=i//rows;row=i%rows;x=MARGIN+col*(col_width+24);y=top-row*row_height
            contents_style=ParagraphStyle('contents',parent=self.styles['body'],fontSize=10.5,leading=13.5,spaceAfter=3)
            label=self.contents_labels.get(ident,{}).get(self.locale) or topic.get('contentsLabel',{}).get(self.locale) or local(topic,self.locale,'Headline')
            state=('背景 · 非今日新增 · ' if self.locale=='zh' else 'Background · not new today · ') if self.is_context(topic) else ''
            text=f'{i+1:02d}  '+label+' · '+state+topic.get('event',{}).get('occurredAt','');self.required.append(text)
            title=Paragraph(escape(text),contents_style)
            update=self.contents_updates.get(ident,{}).get(self.locale) or topic.get('contentsUpdate'+self.locale.title())
            flows=[title]
            if update:
                self.required.append(update)
                flows.append(Paragraph(escape(update),contents_style))
            self.block(c,flows,x,y,col_width,y-row_height+4,p['id'])
            c.linkAbsolute('',ident,(x,y-row_height+3,x+col_width,y),thickness=0)

    def figure_grid(self,c,figures,x,top,width,bottom,page_id):
        n=len(figures)
        if n>4:raise ValueError(f'Editorial figure fit error on {page_id}: select informative figures or explicitly revise the spread')
        if n==1:slots=[(x,top,width,top-bottom)]
        elif n==2:
            h=(top-bottom-12)/2;slots=[(x,top-i*(h+12),width,h) for i in range(2)]
        else:
            h=(top-bottom-14)/2;w=(width-12)/2
            slots=[(x+(i%2)*(w+12),top-(i//2)*(h+14),width if n==3 and i==2 else w,h) for i in range(n)]
        for visual,(sx,sy,sw,sh) in zip(figures,slots):
            caption='；'.join(visual['_captions']) if self.locale=='zh' else '; '.join(visual['_captions'])
            cap=self.linked_paragraph(caption,[visual.get('sourceUrl')],'caption');_,ch=cap.wrap(sw,sh)
            image_height=sh-ch-8
            if image_height<60:raise ValueError(f'Editorial figure/caption fit error on {page_id}')
            image=self.image(visual,width=sw,height=image_height)[0]
            iw,ih=image.drawWidth,image.drawHeight
            image.drawOn(c,sx+(sw-iw)/2,sy-ih)
            cap.drawOn(c,sx,sy-ih-5-ch)

    def product(self,c,p):
        topic=self.topics[p['topicIds'][0]]
        top=self.block(c,[self.p(self.meta_text(topic),'meta'),self.p(local(topic,self.locale,'Headline'),'title')],MARGIN,PAGE[1]-36,WIDTH,48,p['id'])-8
        figures=self.topic_figures(topic);left_width=WIDTH*.40;gap=25;x=MARGIN+left_width+gap;width=WIDTH-left_width-gap
        if figures:self.figure_grid(c,figures,MARGIN,top,left_width,66,p['id'])
        else:x=MARGIN;width=WIDTH
        flows=[];copy=topic.get('brief',{}).get(self.locale,{})
        comparison=topic.get('comparison',{});before=comparison.get(self.locale,{}).get('before')
        if before and comparison.get('sourceUrl'):flows += [self.p(self.w['before'],'label'),self.linked_paragraph(before,[comparison['sourceUrl']])]
        order=['change','what','use','limits'] if topic.get('event',{}).get('previousIssue') or topic.get('event',{}).get('kind')=='availability-change' else ['what','change','use','limits']
        for key in order:
            paragraph=self.linked_paragraph(copy.get(key,''),[topic.get('eventSourceUrl')]) if key=='change' else self.p(copy.get(key,''))
            flows += [self.p(self.w[key],'label'),paragraph]
        for detail in topic.get('detailPages',[]):
            flows.append(self.p(local(detail,self.locale,'Title'),'heading'))
            for point in detail.get('points',[]):flows.append(self.linked_paragraph(point.get(self.locale,''),point.get('sourceUrls',[])))
        for media in self.topic_media(topic):
            if media.get('kind') not in ('video','gif','official-link') or not media.get('poster'):raise ValueError('Media needs a verified factual poster and supported kind')
            flows += [self.linked_paragraph(('播放原始演示 · ' if self.locale=='zh' else 'Play original demo · ')+suffix(media,self.locale,'caption'),[media.get('url'),media.get('sourceUrl')]),self.p(suffix(media,self.locale,'whatToSee'),'caption')]
        if not figures:flows.append(self.p(topic.get('visualMissing',{}).get(self.locale) or self.w['missing'],'caption'))
        self.block(c,flows,x,top,width,66,p['id'])

    def references(self,c,p):
        header=[self.p('参考与证据索引' if self.locale=='zh' else 'References & evidence index','title'),self.link('完整日期、图源、筛选记录 → sources.md' if self.locale=='zh' else 'Full dates, figure provenance & selection notes → sources.md',self.ledger_url,'body'),self.p('n.d.：来源未标注发布日期；生效日期单独标明' if self.locale=='zh' else 'n.d. = publication date not stated; effective dates are labeled separately','caption')]
        top=self.block(c,header,MARGIN,PAGE[1]-36,WIDTH,48,p['id'])-10
        entries=list(self.ledger.values());cols=2 if len(entries)<=32 else 3;rows=(len(entries)+cols-1)//cols;width=(WIDTH-(cols-1)*20)/cols
        if not entries:self.block(c,[self.p('没有新增引用' if self.locale=='zh' else 'No new citations')],MARGIN,top,WIDTH,48,p['id']);return
        cells=[]
        for i,s in enumerate(entries):
            date=s.get('dateLabel') or (('生效 ' if self.locale=='zh' else 'Effective ')+s['effectiveDate'] if s.get('effectiveDate') else str(s.get('publishedAt') or ('未标注' if self.locale=='zh' else 'Not stated')))
            label=f'{i+1:02d} '+s.get('compactLabel',s['label'])+' · '+date
            cell=self.link(label,s['url'],'caption');_,h=cell.wrap(width,top-48);cells.append((cell,h+8))
        col_heights=[sum(h for _,h in cells[i*rows:(i+1)*rows]) for i in range(cols)]
        if max(col_heights)>top-48:raise ValueError('Editorial references page fit error: compact source labels without dropping URLs; full ledger stays external')
        for col in range(cols):
            self.block(c,[f for f,_ in cells[col*rows:(col+1)*rows]],MARGIN+col*(width+20),top,width,48,p['id'])

    def render(self,dest):
        c=pdfcanvas.Canvas(str(dest),pagesize=PAGE,pageCompression=1)
        c.setTitle(local(self.issue,self.locale,'Title'));c.setAuthor('AI Daily')
        for i,p in enumerate(self.plan):
            c.bookmarkPage(p['id'])
            if p['type'] in ('product','context'):c.bookmarkPage(p['topicIds'][0])
            if p['type']=='contents':self.contents(c,p)
            elif p['type']=='references':self.references(c,p)
            else:self.product(c,p)
            self.footer(c,SimpleNamespace(page=i+1));c.showPage()
        c.save()

def export(args):
    args.root = args.root.resolve()
    output = (args.output_dir or args.root / 'pending').resolve()
    if 'Users' in args.root.parts or 'Users' in output.parts:
        raise ValueError('Cloud-only exporter refuses /Users/ paths')
    if not output.is_relative_to(args.root):
        raise ValueError('PDF output must stay inside the specified cloud root')
    issue_bytes = args.issue.read_bytes()
    issue = json.loads(issue_bytes)
    plan=editorial_plan(issue,json.loads(args.page_plan.read_text()) if args.page_plan else None)
    if len(plan)>args.max_pages:raise ValueError(f'PDF exceeds hard page limit: {len(plan)} > {args.max_pages}')
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
    shared_references=json.loads(args.reference_index.read_text()) if args.reference_index else None
    shared_labels=json.loads(args.contents_labels.read_text()) if args.contents_labels else None
    shared_updates=json.loads(args.contents_updates.read_text()) if args.contents_updates else None
    with tempfile.TemporaryDirectory(prefix='ai-daily-reportlab-') as temp:
        temp = Path(temp)
        font = register_font({'issue':issue,'references':shared_references,'labels':shared_labels,'updates':shared_updates},temp)
        ready = []
        for locale in locales:
            renderer = DenseExporter(issue,locale,args.root,font,plan,shared_references,shared_labels,shared_updates)
            dest = temp / f"ai-daily-{issue['date']}-{locale}.pdf"
            renderer.render(dest)
            reader = PdfReader(dest)
            count = len(reader.pages)
            if count!=len(plan):raise ValueError('PDF editorial page plan mismatch')
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
        sidecar = {'renderer':'reportlab', 'date':issue['date'], 'pages':{s['locale']:s['pages'] for s in summaries}, 'sourceDataSha256':hashlib.sha256(issue_bytes).hexdigest(), 'editorialPagePlan':plan, 'note':'Independent static ReportLab layout with shared editorial pagination; not browser-print pixel parity. Verified media posters link to originals.'}
        (output/'pdf-export.json').write_text(json.dumps(sidecar,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(summaries,ensure_ascii=False))

if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--issue',type=Path,required=True)
    parser.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1])
    parser.add_argument('--output-dir',type=Path)
    parser.add_argument('--locales',default='zh,en')
    parser.add_argument('--max-pages',type=int,default=50)
    parser.add_argument('--page-plan',type=Path)
    parser.add_argument('--reference-index',type=Path)
    parser.add_argument('--contents-labels',type=Path)
    parser.add_argument('--contents-updates',type=Path)
    args=parser.parse_args()
    if not 1<=args.max_pages<=50:
        parser.error('--max-pages must be between 1 and 50')
    try: export(args)
    except Exception as error:
        print(f'PDF export failed: {error}',file=sys.stderr)
        sys.exit(1)
