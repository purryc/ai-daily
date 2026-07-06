import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const issueDate = "2026-07-05";
const assetDir = path.join(root, "assets");
const issueDir = path.join(root, issueDate);

const lanes = ["official", "reviews", "community", "wild", "research", "patent", "china", "global"];

function source(label, url) {
  return { label, url };
}

function visual(name, title, lanesText, bullets) {
  const file = `assets/${name}.svg`;
  return {
    path: file,
    width: 1200,
    height: 760,
    altZh: `自绘证据图：${title}`,
    altEn: `Self-drawn evidence diagram: ${title}`,
    captionZh: "自绘机制图：依据来源页面整理，非产品渲染；完整来源见 source ledger。",
    captionEn: "Self-drawn mechanism diagram based on cited sources; not a product render. Full source ledger included.",
    sourceUrl: `https://purryc.github.io/ai-daily/${issueDate}/sources.md`,
    svg: diagramSvg(title, lanesText, bullets)
  };
}

function diagramSvg(title, lanesText, bullets) {
  const safe = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const palette = ["#0f766e", "#1d4ed8", "#7c3aed", "#be123c", "#a16207"];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760">
  <rect width="1200" height="760" fill="#f8fafc"/>
  <rect x="44" y="42" width="1112" height="676" rx="28" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="82" y="104" font-family="Inter, Arial, sans-serif" font-size="38" font-weight="800" fill="#0f172a">${safe(title)}</text>
  <text x="84" y="148" font-family="Inter, Arial, sans-serif" font-size="20" fill="#475569">${safe(lanesText)}</text>
  <g transform="translate(84 194)">
    ${bullets
      .map((item, index) => {
        const y = index * 90;
        const color = palette[index % palette.length];
        return `<g transform="translate(0 ${y})">
          <rect x="0" y="0" width="1030" height="66" rx="18" fill="#f8fafc" stroke="#e2e8f0"/>
          <circle cx="36" cy="33" r="14" fill="${color}"/>
          <text x="72" y="27" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700" fill="#111827">${safe(item[0])}</text>
          <text x="72" y="52" font-family="Inter, Arial, sans-serif" font-size="17" fill="#475569">${safe(item[1])}</text>
        </g>`;
      })
      .join("")}
  </g>
  <text x="84" y="690" font-family="Inter, Arial, sans-serif" font-size="16" fill="#64748b">AI Daily evidence diagram · product facts require cited source support · speculative lanes are downgraded</text>
</svg>`;
}

function topic({ id, section, zhHeadline, enHeadline, sourceDate, evidenceLabel, evidenceStrength, visual, sources, zh, en, hciZh, hciEn }) {
  return {
    id,
    section,
    zhHeadline,
    enHeadline,
    zhFact: `${zh.productName}：${zh.productType}。本条按 ${evidenceLabel} 处理；规格、价格、地区、日期只采用来源明示信息，未披露处写 source not stated。`,
    enFact: `${en.productName}: ${en.productType}. This item is handled as ${evidenceLabel}; specs, price, regions and dates use cited source claims only, and missing details remain source not stated.`,
    zhValue: zh.productVerdict,
    enValue: en.productVerdict,
    zhHciLens: hciZh,
    enHciLens: hciEn,
    zhImplication: zh.painPointsSolved,
    enImplication: en.painPointsSolved,
    sourceDate,
    evidenceLabel,
    evidenceStrength,
    visual: Object.fromEntries(Object.entries(visual).filter(([key]) => key !== "svg")),
    sources,
    dossierKind: id.includes("scan") || evidenceLabel.includes("research") || evidenceLabel.includes("patent") ? "scan" : "product",
    dossier: {
      zh,
      en
    }
  };
}

const visuals = {
  cloudflare: visual("cloudflare-agent-crawler-controls-2026-07-05", "Cloudflare AI traffic controls", "official · global · developer surface", [
    ["Three traffic intents", "Search, Agent and Training crawlers become separate controls."],
    ["Publisher-facing switchboard", "Free-tier site owners can tune crawler access instead of using one block."],
    ["Agent UX consequence", "AI products must explain whether they browse, act, train or summarize."],
    ["Unknowns", "Downstream agent compliance and economic settlement remain unsettled."]
  ]),
  acti: visual("acti-agentic-keyboard-2026-07-05", "Acti agentic keyboard", "wild · official · community", [
    ["Keyboard as command layer", "Intent starts inside any text field instead of a separate AI app."],
    ["Acti Bar and Skill Keys", "Hold gestures trigger actions, custom skills and dictation flows."],
    ["Cross-app promise", "Messaging, email, social and productivity apps become execution surfaces."],
    ["Risk", "Permissions and full-access keyboard trust must be legible."]
  ]),
  memomind: visual("memomind-one-friction-2026-07-05", "MemoMind One glasses friction", "reviews · community · crowdfunding signal", [
    ["Camera-free display glasses", "Floating green micro-LED information panel, phone-connected assistant."],
    ["Review friction", "Outdoor visibility, app dependence, audio privacy and slow AI are repeated concerns."],
    ["Useful jobs", "Teleprompter, captioning, translation and voice notes are concrete workflows."],
    ["Unknowns", "Crowdfunding delivery and final retail experience remain unproven."]
  ]),
  anthropic: visual("claude-sonnet-5-agent-surface-2026-07-05", "Claude Sonnet 5 agent surface", "developer surface · official · global", [
    ["Agentic model floor", "Planning, browser, terminal and tool use move into a cheaper default tier."],
    ["Developer surface", "Claude Code and API workflows become less model-showcase, more task handoff."],
    ["Product burden", "Autonomy needs progress, checkpointing, permission and rollback UI."],
    ["Unknowns", "Exact enterprise adoption and long-run reliability are source not stated."]
  ]),
  cursor: visual("cursor-mobile-agent-control-2026-07-05", "Cursor web and mobile agents", "global · developer surface", [
    ["Remote agent control", "Coding agents can be started or monitored away from the desktop IDE."],
    ["Mission-control pattern", "Developer work shifts from typing code to supervising parallel tasks."],
    ["Friction", "Mobile review must show diffs, tests, risk and stop controls in a compact surface."],
    ["Unknowns", "Detailed mobile platform availability is source not stated unless shown by source."]
  ]),
  zcode: visual("zai-zcode-glm-coding-harness-2026-07-05", "Z.ai ZCode and GLM coding plan", "china · global · developer surface", [
    ["Agentic Development Environment", "ZCode packages GLM-5.2 into planning, coding, review and iteration."],
    ["China/global price signal", "Lower plan pricing pressures Cursor, Copilot and Claude Code comparison."],
    ["Remote control", "Docs mention WeChat, Feishu and Telegram bot control as workflow channels."],
    ["Unknowns", "Quality, clone accusations and production reliability need independent review."]
  ]),
  chinaScan: visual("china-ai-glasses-os-scan-2026-07-05", "China AI glasses OS scan", "china · source-lane scan", [
    ["Rokid/YodaOS signal", "Chinese coverage frames glasses as AIOS-native rather than phone accessory."],
    ["RayNeo/Rokid market context", "Domestic sales, subsidies and channel momentum lower trial cost."],
    ["Missing evidence", "Hands-on latency, privacy controls and battery behavior are not fully shown."],
    ["Watch next", "Whether AIUI standards survive outside demo and retail bundles."]
  ]),
  researchPatent: visual("wearable-agent-research-patent-watch-2026-07-05", "Wearable agent research and patent watch", "research · patent · weak/unverified", [
    ["VisionClaw research", "Always-on egocentric perception plus speech-driven agent delegation."],
    ["Smart-glasses patents", "IP filings show medical, display and assistant directions, not shipping facts."],
    ["HCI question", "When the camera watches continuously, feedback and bystander consent become UI."],
    ["Downgrade", "Use as watch item only until a product team ships and documents behavior."]
  ])
};

const topics = [
  topic({
    id: "cloudflare-agent-crawler-controls",
    section: "official",
    zhHeadline: "Cloudflare 把 AI 爬虫拆成 Search、Agent、Training 三种入口",
    enHeadline: "Cloudflare splits AI crawlers into Search, Agent, and Training controls",
    sourceDate: "2026-07-01 official release",
    evidenceLabel: "developer surface",
    evidenceStrength: "developer surface · confirmed control surface",
    visual: visuals.cloudflare,
    sources: [
      source("Cloudflare Blog: new AI traffic options", "https://blog.cloudflare.com/content-independence-day-ai-options/"),
      source("Cloudflare Blog: pay per crawl", "https://blog.cloudflare.com/introducing-pay-per-crawl/"),
      source("TechCrunch: Cloudflare AI crawler policy", "https://techcrunch.com/2026/07/01/cloudflares-new-policy-pushes-ai-companies-to-pay-for-publishers-content/"),
      source("Help Net Security: Cloudflare AI crawler controls", "https://www.helpnetsecurity.com/2026/07/02/cloudflare-ai-crawler-controls/")
    ],
    hciZh: ["意图分类可见", "站点控制面板", "agent 访问边界"],
    hciEn: ["visible crawler intent", "publisher control panel", "agent access boundary"],
    zh: {
      productName: "Cloudflare AI traffic controls",
      productType: "面向网站所有者和开发者的 AI bot 管理界面，不是消费端聊天产品。Cloudflare 将 AI 流量按 Search、Agent、Training 三类拆开，让站点可以分别允许、限制或阻挡不同用途的 crawler；Pay Per Crawl 则把授权访问与补偿机制放进同一套边缘网络规则。对产品团队来说，这是一种新的 agent 基础设施：当 AI 代表用户访问页面时，网站不再只看到一个 bot，而要识别它是在搜索、执行任务还是训练模型。",
      interactionFlow: "站点管理员进入 Cloudflare 控制台，在 AI bot traffic 相关选项中选择默认策略，再按用途调整 Search、Agent、Training 的访问。AI 产品侧的实际流程会变成：用户让 agent 读取网页或完成购买/研究任务，agent 请求目标站点，Cloudflare 根据 crawler 类型、站点规则和可能的付费授权决定放行、阻挡或进入补偿路径。终端用户未必直接看到 Cloudflare，但会感受到 agent 是否能访问页面、是否被要求登录、是否返回访问失败。",
      specsOrStack: "来源明确的是三类用途分类、所有客户包括 Free tier 可使用的更细粒度控制、Pay Per Crawl 的补偿方向，以及 Cloudflare 边缘网络对 bot traffic 的识别和策略执行。具体收费结算比例、每个 AI 公司 crawler 的合规接入细节、终端 agent 应用如何展示被阻挡原因、以及所有国家和行业的默认策略为 source not stated。它不是一个单一 API SDK，而是 CDN/WAF/bot management 与内容授权策略结合的系统层。",
      useCases: "最直接场景是媒体、论坛、电商、文档站和独立创作者决定 AI crawler 能否读取内容：传统搜索可以继续进入，代表用户执行任务的 agent 可以被单独评估，训练用途可以被拒绝或收费。对 AI 浏览器、研究助手、购物 agent 来说，它会影响任务成功率和错误解释；对 publisher 来说，它让“被 AI 摘走内容”和“允许用户代理访问”不再混在一个开关里。",
      painPointsSolved: "它解决的不是模型能力，而是 AI 访问 Web 的权限混乱。过去网站很难区分搜索索引、用户代理、训练抓取和摘要生成，导致粗暴封锁或默认放行。新控制把意图分类前置，给站点一个能解释的选择界面，也迫使 AI 产品把访问失败、授权不足、付费墙、训练禁用等状态做成用户可理解的反馈，而不是只报一个网络错误。",
      userVoice: "社区和媒体讨论集中在 publisher 是否真的能获得公平补偿、AI 公司是否会注册清晰 crawler，以及 agent 被阻挡时用户体验会不会碎裂。具体用户 quote 未在官方来源中作为产品证据披露；source not stated。",
      newTech: "新技术点在于把 crawler 用途作为产品协议的一部分，而不是只依赖 robots.txt 的粗粒度允许/禁止。Search、Agent、Training 的拆分把“AI 替用户行动”承认为不同于“AI 训练”的访问类型，这会影响未来 agent browser、AI search、content API 与支付授权的接口设计。",
      availability: "Cloudflare 官方称新选项面向所有客户，包括 Free tier。Pay Per Crawl 和相关市场机制的地区、结算、AI 公司接入名单、默认阻挡节奏需按官方更新确认；source not stated。",
      limitsOrUnknowns: "未知点包括 AI 公司是否会稳定申报 crawler 类型、恶意或混合 crawler 如何处理、用户代理访问与训练数据抓取在日志中如何分离、publisher 是否能在不伤害真实用户的前提下开启强策略，以及 agent 产品如何把 403/402/robots 状态解释成下一步行动。",
      productVerdict: "这是今天最重要的产品基础设施信号：它不炫模型，却重写 AI agent 与开放 Web 的握手方式。若执行成熟，用户会看到更清楚的访问原因和授权路径；若执行粗糙，agent 浏览会变成大量不可解释的失败。产品团队应把 crawler identity、访问目的、失败恢复和内容授权当作 agent UX 的一部分。"
    },
    en: {
      productName: "Cloudflare AI traffic controls",
      productType: "A publisher and developer control surface for AI bot traffic, not a consumer chatbot. Cloudflare separates AI traffic into Search, Agent, and Training use cases so a site owner can allow, restrict, or block different crawler intents instead of relying on a single blunt switch. Pay Per Crawl adds a compensation path for authorized access. For product teams, the important shift is infrastructural: when an AI system visits a page on behalf of a person, the site can ask whether that visit is search indexing, user-directed task execution, or model training.",
      interactionFlow: "A site administrator uses Cloudflare's dashboard to choose AI bot traffic settings and tune policies for Search, Agent, and Training crawlers. On the AI product side, the user asks an agent to read, compare, buy, summarize, or research. The agent requests the target page; Cloudflare evaluates the declared crawler category, the publisher rule, and any paid authorization path, then allows, blocks, or routes the request into a compensation model. The end user may never see Cloudflare directly, but will feel the result as successful access, login friction, a blocked task, or a need for a clearer explanation.",
      specsOrStack: "The cited official material supports the three intent categories, broader availability including Free-tier customers, the Pay Per Crawl direction, and policy enforcement through Cloudflare's edge and bot-management stack. Exact revenue shares, settlement details, how every AI company must register crawlers, how consumer agents should display a blocked reason, and country-by-country defaults are source not stated. This is not a standalone SDK; it is a control plane that combines CDN, WAF, bot classification, content authorization, and emerging economic rules for agent access.",
      useCases: "The immediate use cases are media sites, forums, ecommerce catalogs, documentation sites, and independent publishers deciding which AI uses are allowed. A publisher can keep traditional search visibility, separately evaluate agents acting for users, and refuse or monetize training crawls. For AI browsers, research assistants, shopping agents, and enterprise knowledge tools, the control changes task success rates and error recovery. For publishers, it separates 'a user asked an agent to access my page' from 'a model vendor harvested my content for training,' which used to be collapsed into one operational problem.",
      painPointsSolved: "The product solves permission ambiguity, not model intelligence. Before this kind of control, site owners had difficulty distinguishing search indexing, user-delegated access, AI answer generation, and training collection, so the practical choices were often broad blocking or broad acceptance. By making crawler intent visible, Cloudflare gives publishers a more explainable interface and pressures AI products to expose access failure, authorization gaps, paywall status, and training restrictions as user-facing states instead of reducing everything to a generic network error.",
      userVoice: "Media and community discussion centers on whether publishers will receive meaningful compensation, whether AI companies will honestly identify crawlers, and whether user-delegated agents will break when access rules tighten. The official sources do not provide direct end-user quotes for this control surface; source not stated.",
      newTech: "The new technology is not a new model but a protocol-like product distinction: crawler purpose becomes a first-class interface variable. Search, Agent, and Training are treated as different product intents. That distinction will matter for agent browsers, AI search, content APIs, crawler identity, payment authorization, and future UX copy explaining why a task can or cannot proceed.",
      availability: "Cloudflare says the new options are available to all customers, including the Free tier. The full Pay Per Crawl market, geographic terms, settlement mechanics, AI-company participation, and default enforcement timing must be checked against current Cloudflare updates; source not stated where the cited sources do not specify.",
      limitsOrUnknowns: "The open questions are operational: whether AI companies consistently declare crawler type, how mixed-use crawlers are classified, how malicious bots are handled, how logs separate user delegation from training, whether publishers can use strong controls without harming legitimate users, and whether agent products translate HTTP or policy failures into useful next actions.",
      productVerdict: "This is the strongest product-infrastructure signal of the day because it changes the handshake between agents and the open web. If it works, users get clearer reasons, permissions, and paths to access. If it fails, agentic browsing becomes a landscape of unexplained blocks. Product teams building agents should treat crawler identity, access purpose, failure recovery, and content authorization as core UX, not back-office compliance."
    }
  }),
  topic({
    id: "acti-agentic-keyboard",
    section: "wild",
    zhHeadline: "Acti 把 agent 放进手机键盘，而不是另开一个 AI App",
    enHeadline: "Acti puts agents inside the smartphone keyboard instead of another AI app",
    sourceDate: "2026-06-30 launch coverage",
    evidenceLabel: "startup signal",
    evidenceStrength: "startup signal · app-store surface · community claim",
    visual: visuals.acti,
    sources: [
      source("Acti official site", "https://openacti.com/"),
      source("Apple App Store: Acti Agentic Keyboard", "https://apps.apple.com/us/app/acti-agentic-keyboard/id6745523677"),
      source("TechCrunch: Acti agentic keyboard", "https://techcrunch.com/2026/06/30/acti-puts-ai-agents-directly-into-your-smartphone-keyboard/"),
      source("Reddit r/SideProject: Acti creator post", "https://www.reddit.com/r/SideProject/comments/1ukorbc/i_got_tired_of_constantly_switching_between_apps/")
    ],
    hciZh: ["输入法即入口", "长按触发行动", "权限信任成本"],
    hciEn: ["keyboard as entry point", "hold gesture to act", "permission trust cost"],
    zh: {
      productName: "Acti Agentic Keyboard",
      productType: "面向 iOS 和 Android 的 agentic keyboard。它把传统输入法从“打字/改写”扩展成“命令层”：用户在任意文本输入场景里调出键盘，通过 Acti Bar、Skill Keys、AI Dictation 或自然语言技能触发行动。官方称它是 Unified Command Layer commanding Apps & APIs；App Store 文案显示 2.0.x 版本强调 new keyboard-native AI action layer、Press to type、Hold to act、自定义 Skills 和 Liquid Glass Design。",
      interactionFlow: "典型流程是用户留在当前 App，比如聊天、邮件、社交或任务工具，不切到独立 AI App。用户输入意图或长按 Acti Bar，让键盘读取当前文字环境并执行动作：生成回复、分享位置、调用外部服务、创建日程、从 Notion 等工具取信息、运行用户自定义 Skill。执行后结果回填到当前文本框或以可发送内容呈现。社区帖描述的交互是 type what you want, long-press the spacebar, then the keyboard acts。",
      specsOrStack: "来源明确的是 iOS App Store 页面、官方站点、iOS/Android 方向、Acti Bar、Skill Keys、AI Dictation、自定义 Skills、自然语言创建技能、跨文本框使用，以及它把 Apps & APIs 作为可命令对象。具体模型供应商、Android 商店链接、每个 API connector 清单、权限弹窗细节、端侧/云侧边界、数据保存周期、价格、企业版管理能力和地区可用性为 source not stated。",
      useCases: "具体场景包括在聊天里直接插入位置或实时信息，在邮件里生成或改写回复，在社交 App 中把想法转成可发布内容，在工作流里创建会议、查询 Notion、调用小工具，或把常用重复动作保存成 Skill Keys。它的关键不是更聪明的自动补全，而是把“我现在想做什么”变成不用离开当前 App 的动作入口。",
      painPointsSolved: "它解决的是移动端 AI 的切换成本。今天很多 AI 助手要求用户复制文本、打开独立 App、解释上下文、复制结果、回到原 App。键盘天然处在每个输入场景的最低层，Acti 借这个位置把 agent 放在用户已经准备表达意图的地方。对 UX 来说，少一次 App 切换就少一次上下文丢失，但代价是键盘权限非常敏感，用户必须理解它能读什么、传什么、执行什么。",
      userVoice: "Reddit 创作者帖把痛点描述为 tired of constantly switching between apps，并强调 unlike most AI keyboards that only rewrite text, Acti turns the keyboard into an active agent。该帖属于社区/创作者信号，不能替代独立评测。实际普通用户留存、错误率、隐私投诉和 App Store 评论分布需要继续观察。",
      newTech: "新技术点是 keyboard-native agent layer：用长按、键位、文本场景和自然语言 Skill 编排代替 app-to-app automation。它把手机系统里最稳定的输入入口变成 programmable command layer，比单独的 chatbot 更接近“软硬件入口”的产品形态。",
      availability: "App Store 页面可访问，TechCrunch 报道称产品面向 iOS 和 Android。具体 Android 下载渠道、地区限制、收费层级、企业部署、后台权限和 API partner 清单未由当前来源完整披露；source not stated。",
      limitsOrUnknowns: "最大限制是信任。第三方键盘常常需要 Full Access 或类似权限，用户会担心敏感输入、验证码、密码、企业聊天内容被处理。其次是执行失败：如果 Skill 调用外部 API 失败、当前 App 不支持回填、或用户误触长按，界面必须有确认、撤销、权限解释和错误恢复。当前来源未给出足够独立评测。",
      productVerdict: "Acti 是典型的野生但值得跟的产品信号。它抓住了手机上最强入口之一：键盘。产品判断取决于两件事：一是执行能力是否真的跨 App 稳定，二是权限解释是否足够短、可信、可撤销。若这两点成立，agent 不必等 OS 级 Siri/Gemini 改造，也能在输入层获得日常使用频率。"
    },
    en: {
      productName: "Acti Agentic Keyboard",
      productType: "An agentic keyboard for iOS and Android. Instead of treating the keyboard as a typing and rewriting utility, Acti positions it as a command layer. The user stays in any text field and triggers actions through the Acti Bar, Skill Keys, AI Dictation, and natural-language skills. The official site describes a unified command layer for apps and APIs, while the App Store listing emphasizes a rebuilt keyboard-native AI action layer, 'press to type,' 'hold to act,' custom Skills, AI dictation, and a redesigned keyboard experience.",
      interactionFlow: "The intended flow begins inside the current app, not inside a separate assistant. A user is in a messaging thread, email composer, social app, note, or work tool. They type an intent, hold the Acti Bar or a Skill Key, and the keyboard interprets the instruction in the current writing context. It can generate a reply, insert location or live information, create a meeting, fetch content from a connected tool such as Notion, or run a custom skill. The result is returned to the text field or prepared as sendable text. The creator's Reddit description summarizes the flow as typing what you want, long-pressing the spacebar, and letting the keyboard act.",
      specsOrStack: "The cited sources support the iOS App Store surface, an iOS and Android direction, Acti Bar, Skill Keys, AI Dictation, custom skills, natural-language skill creation, operation across text fields, and the idea that apps and APIs can be commanded. The model providers, complete Android distribution, API connector catalog, keyboard permission screens, on-device versus cloud boundary, data retention, pricing, enterprise administration, and country availability are source not stated in the sources used here.",
      useCases: "The concrete jobs are mobile-first: inserting location or live information in a chat, drafting or rewriting email, turning rough intent into a social post, creating a meeting from a message, fetching data from a workspace tool, and turning repeated mobile actions into reusable Skill Keys. The product is not merely a better autocomplete layer. Its claim is that 'I want to do this now' can be expressed where the user is already typing, then executed without copying context into a separate AI app.",
      painPointsSolved: "Acti attacks the switching cost of mobile AI. Many mobile assistants still require selecting text, copying it, opening a chatbot, explaining context, waiting for output, copying the answer, and returning to the original app. The keyboard sits beneath nearly every mobile writing workflow, so it is a natural but sensitive place to put an agent. The UX benefit is fewer app switches and less context reconstruction. The cost is trust: users need a clear understanding of what the keyboard can read, transmit, store, and execute.",
      userVoice: "The Reddit creator post frames the pain as being tired of constantly switching between apps and contrasts Acti with AI keyboards that only rewrite text. That is useful community and founder signal, not an independent quality review. Ordinary-user retention, error rates, privacy complaints, keyboard latency, and App Store review patterns still need to be watched.",
      newTech: "The new product idea is a keyboard-native agent layer. Long-press gestures, keys, text context, and natural-language skills become a lightweight automation surface. That is different from a chatbot and different from OS-level shortcuts because it appears at the exact moment of expression. In HCI terms, the keyboard becomes a programmable command layer rather than a passive input device.",
      availability: "The App Store page is live, and TechCrunch reports an iOS and Android launch direction. The exact Android store path, country restrictions, paid tiers, enterprise controls, background permissions, and API partner list are source not stated where the current sources do not specify them.",
      limitsOrUnknowns: "The main limit is trust. Third-party keyboards often need broad access, and users may worry about sensitive messages, passwords, verification codes, workplace content, or private drafts. The second limit is recovery. If a skill calls the wrong API, fails inside the current app, inserts the wrong text, or is triggered accidentally, the interface needs confirmation, undo, permission explanation, and a short path back to the user's original draft. The current sources do not yet provide enough independent hands-on evidence.",
      productVerdict: "Acti is a strong wild signal because it chooses one of the most durable mobile entry points: the keyboard. The product will be judged on whether cross-app execution is reliable and whether permission explanations are short, credible, and reversible. If both hold, agentic mobile workflows do not have to wait for a full OS assistant redesign; they can start at the input layer users already touch hundreds of times per day."
    }
  }),
  topic({
    id: "memomind-one-review-friction",
    section: "reviews",
    zhHeadline: "MemoMind One 证明无摄像头眼镜有位置，也暴露了 AI 眼镜的日常摩擦",
    enHeadline: "MemoMind One shows a place for camera-free glasses and the friction of daily AI eyewear",
    sourceDate: "2026-07-01 to 2026-07-02 hands-on/review scan",
    evidenceLabel: "review/community friction",
    evidenceStrength: "review/community friction · crowdfunding signal",
    visual: visuals.memomind,
    sources: [
      source("MemoMind official site", "https://www.memo-mind.com/"),
      source("The Verge: MemoMind One hands-on", "https://www.theverge.com/tech/957933/xgimi-memomind-one-ai-smart-glasses-kickstarter-hands-on"),
      source("TechRadar: 48 hours with MemoMind One", "https://www.techradar.com/tech/48-hours-with-the-memomind-one-xr-glasses-a-slow-ai-lack-of-a-camera-and-disappointing-audio-left-me-desperate-for-more"),
      source("Reddit r/SmartGlasses: MemoMind Kickstarter discussion", "https://www.reddit.com/r/SmartGlasses/comments/1uhxihg/memomind_one_kickstarter_goes_live_today/")
    ],
    hciZh: ["无摄像头信任", "显示可读性", "手机依赖"],
    hciEn: ["camera-free trust", "display legibility", "phone dependence"],
    zh: {
      productName: "XGIMI MemoMind One",
      productType: "无摄像头 AI/XR 智能眼镜，定位是隐私友好的信息显示与轻量助手，而不是拍摄眼镜。来源显示它通过手机连接显示提醒、任务、通知、AI assistant 答案等；评测提到绿色 micro-LED/近眼显示、天气/日历/新闻模块、录音转写、提词器、字幕和翻译等能力。Kickstarter 预购和零售价格在不同来源中有不同表述，具体以项目页为准；未由来源统一确认的价格写 source not stated。",
      interactionFlow: "用户佩戴眼镜后，通过手机 App 配置可见模块、连接通知、启动翻译/导航/提词等功能。日常操作不是举起相机拍摄，而是把小块信息放到视野边缘：看日程、读提醒、听语音、记录会议、做演讲提词、在对话中查看字幕或翻译。评测指出部分功能仍需从手机 App 启动，完整消息阅读、回复和导航/翻译流程并非完全脱离手机。也就是说，它更像手机伴随显示器，而不是独立 AI OS。",
      specsOrStack: "来源支持 camera-free design、连接手机、AI assistant、提醒/任务/通知、提词/字幕/翻译、录音转写、绿色显示、Kickstarter/preorder 语境，以及评测中的 outdoor visibility、audio、mobile app friction 等体验问题。具体芯片、传感器组合、光学参数、亮度数值、重量、续航、认证、批量交付时间、最终 App 稳定性和多模型后端细节在当前可用来源中不完整或互相不一致；source not stated。",
      useCases: "最自然的使用场景不是拍 vlog，而是办公室和通勤：演讲时显示提词，会议中记录语音并转写，多语言对话中看字幕，走路时看天气/日程/提醒，做饭或搬运时不用拿手机查看简单信息。无摄像头也让它适合对旁人隐私敏感的环境，例如办公室、课堂、展会或会议室，用户更容易解释“这不是在拍你”。",
      painPointsSolved: "它解决的是智能眼镜的社会接受问题和低频拿手机问题。很多拍摄眼镜因为摄像头带来旁观者压力；MemoMind One 把相机拿掉，换来更明确的显示/提醒/记录定位。它降低的是快速查看信息和演讲/翻译辅助的操作成本，但不能解决拍照、视觉问答、环境识别等需要摄像头的任务。对于用户，少一个相机也是少一类能力。",
      userVoice: "The Verge 与 TechRadar 的摩擦点一致：室外可读性、音频隐私/音质、AI 速度、App 依赖和缺少摄像头带来的能力边界。Reddit 讨论里有早期测试者和 Kickstarter 关注者表达兴趣，但这属于社区/众筹信号，不等于大规模用户验证。具体退货率、交付满意度和长期佩戴舒适度仍未知。",
      newTech: "新技术不是单点模型，而是把低侵入显示、语音记录、翻译、字幕和手机通知合成一个 camera-free eyewear workflow。它把 AI 眼镜从“记录世界”转向“在眼前放少量及时信息”，这对 HCI 很重要：显示层越小，信息层级、启动路径和错误恢复越要克制。",
      availability: "官方站点与媒体报道指向 Kickstarter/preorder 阶段。具体众筹价格、零售价、处方镜片价格、地区发货、售后保障和最终交付日期以 Kickstarter/官方更新为准；当前 issue 不把未统一来源确认的数字当作最终事实。",
      limitsOrUnknowns: "限制很清楚：无摄像头意味着不能做第一人称视觉理解；手机依赖削弱独立性；显示在强光下可能不可读；开放式音频可能影响隐私；App 若不稳定，眼镜入口会被拖垮。未知项包括量产质量、光学一致性、处方适配、长时间佩戴重量感、隐私录音提示和众筹交付风险。",
      productVerdict: "MemoMind One 值得放在封面级眼镜讨论里，因为它反向回答了一个问题：AI 眼镜一定要摄像头吗？答案是未必，但无摄像头路线必须把显示可读性、手机依赖和具体工作流做到极稳。今天的评测信号偏谨慎：概念成立，日常产品完成度还未完全成立。"
    },
    en: {
      productName: "XGIMI MemoMind One",
      productType: "A camera-free AI/XR smart-glasses product positioned around privacy-friendly information display and lightweight assistance rather than capture. The official site describes phone-connected reminders, daily tasks, notifications, AI assistant answers, and more. Hands-on coverage describes a green micro-LED or near-eye display, configurable information modules, voice recording with transcription, teleprompter use, captioning, and translation. Pricing and delivery details vary across Kickstarter-oriented coverage, so numbers not consistently supported by the cited sources are treated as source not stated.",
      interactionFlow: "The wearer connects the glasses to a phone, configures visible modules through an app, and starts workflows such as translation, navigation, teleprompter, or notification display. The everyday interaction is not raising a camera to capture the world; it is glancing at small pieces of information near the field of view. A user can check calendar context, listen to audio, record a meeting, read captions, or use a script while presenting. Reviews report that some actions still need to be initiated from the phone app and that full message reading, replies, navigation, and translation are not completely independent. In practice, the product reads more like a companion display than a standalone AI operating system.",
      specsOrStack: "The sources support a camera-free design, phone connection, AI assistant positioning, reminders, tasks, notifications, teleprompter, captioning, translation, recording/transcription, a green display experience, Kickstarter or preorder context, and review friction around outdoor visibility, audio, and app dependence. Chipset, sensor package, detailed optical specs, exact brightness, weight, battery, certification, final shipping timing, final app reliability, and the complete model-backend stack are incomplete or inconsistent in the available sources; source not stated where not directly supported.",
      useCases: "The strongest use cases are workday and mobility tasks: presenter notes during a talk, meeting capture and transcription, multilingual captions during conversation, quick reminders while walking, and glanceable weather or calendar information without taking out a phone. The absence of a camera also makes the product easier to explain in privacy-sensitive spaces such as offices, classrooms, trade shows, and meeting rooms. The wearer can credibly say the glasses are not filming bystanders, which is a real social-design advantage.",
      painPointsSolved: "MemoMind One addresses two pain points: social acceptance of smart glasses and the small but constant cost of checking a phone. Camera-equipped eyewear often creates bystander discomfort. By removing the camera, MemoMind narrows the product to display, reminders, translation, and note capture. That can reduce phone checks and make meeting or presentation workflows smoother. The tradeoff is capability: camera-free glasses cannot do spontaneous capture, visual Q&A, object recognition, or context-aware scene interpretation in the same way camera-based glasses can.",
      userVoice: "The review friction is consistent across The Verge and TechRadar: outdoor legibility, audio privacy or quality, slow AI behavior, app dependence, and the missing-camera boundary. Reddit discussion shows early tester and Kickstarter interest, but that is community and crowdfunding signal, not broad-market validation. Return rates, long-term comfort, delivery satisfaction, and everyday retention are not yet available from the cited sources.",
      newTech: "The new product pattern is the combination of low-intrusion display, voice memory, translation, captions, and phone notifications in a camera-free eyewear workflow. It moves AI glasses away from 'record the world' and toward 'place a small amount of timely information in front of the wearer.' That is an HCI challenge because the display surface is tiny. Information hierarchy, initiation path, and recovery from error have to be restrained and obvious.",
      availability: "The official and media sources point to a Kickstarter or preorder-stage product. Exact pledge prices, final retail price, prescription-lens pricing, country shipping, warranty, and delivery dates should be verified from the live Kickstarter or official updates. This issue does not treat inconsistent third-party pricing claims as final product facts.",
      limitsOrUnknowns: "The limits are substantial. No camera means no first-person visual understanding. Phone dependence weakens independence. The display may be hard to read outdoors. Open audio can reduce privacy. A buggy app can undermine the entire entry point. Unknowns include production quality, optical consistency, prescription fit, long-wear comfort, recording disclosure, final software stability, and crowdfunding delivery risk.",
      productVerdict: "MemoMind One belongs in today's issue because it answers a design question from the opposite direction: do AI glasses have to include cameras? Not always. But if the camera-free path is chosen, display legibility, phone dependence, and a few concrete workflows must be excellent. The current review signal is cautious: the concept is valuable, the everyday product still appears unfinished."
    }
  }),
  topic({
    id: "claude-sonnet-5-agent-surface",
    section: "global",
    zhHeadline: "Claude Sonnet 5 把 agentic work 从旗舰模型下放到日常开发入口",
    enHeadline: "Claude Sonnet 5 moves agentic work from flagship demos into everyday developer entry points",
    sourceDate: "2026-06-30 official release",
    evidenceLabel: "developer surface",
    evidenceStrength: "developer surface · model/product release",
    visual: visuals.anthropic,
    sources: [
      source("Anthropic: Introducing Claude Sonnet 5", "https://www.anthropic.com/news/claude-sonnet-5"),
      source("Anthropic: Claude Sonnet 5 system card", "https://www.anthropic.com/claude-sonnet-5-system-card"),
      source("Axios: Anthropic Sonnet 5 agents", "https://www.axios.com/2026/06/30/anthropic-sonnet-5-agents-mythos-fable"),
      source("TechRadar: Claude Sonnet 5 agentic shift", "https://www.techradar.com/ai-platforms-assistants/claude/claude-sonnet-5-is-here-and-the-most-agentic-sonnet-yet-shows-that-the-ai-war-is-shifting-from-chat-to-agents")
    ],
    hciZh: ["进度反馈", "工具权限", "长期任务监督"],
    hciEn: ["progress feedback", "tool permission", "long-running supervision"],
    zh: {
      productName: "Claude Sonnet 5",
      productType: "Anthropic 的 Sonnet 级模型与开发者/Claude Code 产品入口更新，官方定位为 most agentic Sonnet model yet。来源称它能计划、使用浏览器和终端等工具，并以更低成本把几个月前需要更大模型的自主工作能力带到更日常的层级。本期按 developer surface 处理，因为用户触到的不只是模型名，而是 Claude、Claude Code、API 与工具调用工作流的执行边界。",
      interactionFlow: "用户在 Claude 或开发者工具里给出任务，例如研究网页、修改代码、运行终端、整理文件或完成多步骤知识工作。模型先拆解计划，再调用浏览器、终端、代码环境或外部工具，过程中需要向用户展示进度、工具调用、潜在风险和完成状态。对开发者，Claude Code 中的体验从“问模型怎么写”变成“交给 agent 做一段工作，再审查 diff、日志、测试和解释”。",
      specsOrStack: "来源明确的是 Sonnet 5、agentic positioning、计划能力、浏览器/终端/工具使用、自主运行能力、Claude Free/Pro/Max/Team/Enterprise 或 Claude Code 等可用面向的报道，以及 system card 的安全边界。具体 token 价格、所有 API 参数、上下文长度、地区可用性、企业默认策略、所有 benchmark 数值和工具调用限制需以 Anthropic 当前文档为准；未在当前来源明确处写 source not stated。",
      useCases: "具体用例包括软件开发中的多文件修改、终端排查、测试运行、代码审查准备、研究任务、网页信息收集、文档整理、计划生成和一般专业任务自动化。它对产品的影响不在“回答更聪明”，而在让中价位/主力模型承担更长链路的行动，使更多团队愿意把 agent 放进真实工作流，而不是只用旗舰模型做演示。",
      painPointsSolved: "它解决的是 agentic work 的成本和可获得性。若自主计划和工具使用只能由最贵模型稳定完成，产品很难默认开启长任务。Sonnet 5 试图把能力下放到更常用层级，让用户把重复研究、代码操作、文件整理和浏览器任务交给系统。但能力下放也会放大 UX 问题：agent 运行越久，用户越需要知道它在做什么、花了多少钱、还能不能中止。",
      userVoice: "媒体报道把这次发布解读为从 chat 转向 agents 的竞争信号。当前来源没有提供大规模终端用户原声；source not stated。实际摩擦应继续看 Claude Code 社区、企业开发者反馈、长任务失败案例和安全评估更新。",
      newTech: "新技术点是把计划、工具调用、浏览器/终端操作和自主执行组合成模型默认能力，并通过 system card 把安全评估公开化。HCI 的重点不是模型榜单，而是 agent runtime UI：进度、checkpoint、权限、日志、人工接管、失败恢复、成本提示和结果验证。",
      availability: "Anthropic 官方发布页与媒体报道显示 Sonnet 5 面向 Claude 和开发者生态推出。具体区域、API rate limit、模型版本名、企业开关、Claude Code 默认模型和价格以 Anthropic 当前控制台/文档为准；source not stated。",
      limitsOrUnknowns: "未知点包括复杂工具链中的稳定性、浏览器任务成功率、终端误操作防护、长任务上下文漂移、企业审计日志、成本可预测性和用户能否理解 agent 的中间状态。安全 card 提供评估面，但不能替代每个产品团队自己的权限和回滚设计。",
      productVerdict: "Sonnet 5 的产品意义是 agentic baseline 下移。更多用户会把 AI 当执行者而不是顾问，这要求界面从聊天记录升级为任务控制台。最值得看的是 Claude Code 和 API 产品是否把中间步骤、失败恢复和人工接管做清楚；模型能力越接近日常默认，UX 债越不能藏在控制台后面。"
    },
    en: {
      productName: "Claude Sonnet 5",
      productType: "Anthropic's Sonnet-class model and associated Claude, Claude Code, and API product surface. Anthropic describes it as the most agentic Sonnet model yet, with planning, browser use, terminal use, tool use, and autonomous execution at a level that previously required larger or more expensive models. This issue treats it as a developer surface because the user-facing product is not only a model name; it is a workflow boundary across Claude, Claude Code, API calls, tools, logs, and task delegation.",
      interactionFlow: "A user gives Claude or Claude Code a multi-step task: research a website, modify code, run a terminal workflow, organize files, prepare a report, or complete a professional knowledge task. The model forms a plan, invokes tools such as browser and terminal environments, and returns intermediate progress and final output. In developer workflows, the experience shifts from asking a model how to write code to handing a bounded task to an agent, then reviewing diffs, logs, tests, and explanations. That makes the review surface as important as the prompt box.",
      specsOrStack: "The sources support the Sonnet 5 release, agentic positioning, planning capability, browser and terminal tool use, autonomous operation, Claude and Claude Code availability reporting, and the existence of a system card. Exact API prices, all parameter names, context length, regional availability, enterprise defaults, every benchmark value, and the full list of tool limits should be checked against current Anthropic documentation; where not explicitly stated in the cited sources, this issue marks them source not stated.",
      useCases: "The concrete use cases are multi-file software changes, terminal debugging, test execution, code-review preparation, web research, document synthesis, planning, and general professional-task automation. The product impact is not simply smarter answers. It is the ability to let a more mainstream model tier handle longer chains of action, which can make teams more willing to put agents into production workflows rather than reserving them for flagship demos.",
      painPointsSolved: "The release addresses the cost and availability problem of agentic work. If only the most expensive model can reliably plan, browse, use tools, and run long tasks, agent features remain exceptional and expensive. Sonnet 5 attempts to move those capabilities into a more common tier. That solves a product-availability problem while making UX problems more visible: the longer an agent runs, the more the user needs progress, cost visibility, stop controls, checkpoints, and an understandable path to recovery.",
      userVoice: "Media coverage reads the launch as evidence that competition is moving from chat to agents. The cited sources do not provide broad end-user quotes for everyday Claude Sonnet 5 workflows; source not stated. The next useful evidence will come from Claude Code communities, enterprise developer feedback, long-running task failures, and follow-up safety updates.",
      newTech: "The new technology is the bundling of planning, tool use, browser and terminal operation, autonomous execution, and published safety evaluation into a mainstream model surface. The HCI issue is the runtime UI, not the benchmark headline. Users need to see progress, checkpoints, permissions, logs, human handoff, failure recovery, cost impact, and verification output.",
      availability: "Anthropic's launch page and reporting indicate rollout across Claude and developer surfaces. Exact regions, rate limits, API model names, enterprise switches, Claude Code defaults, and pricing must be verified in current Anthropic documentation and console pages; source not stated where the issue sources do not specify them.",
      limitsOrUnknowns: "Open questions include reliability in complex toolchains, browser-task success rate, terminal safety, context drift during long tasks, enterprise audit logs, predictable cost, and whether users can understand the agent's intermediate state. A system card gives useful safety context, but it does not replace product-level permission design and rollback.",
      productVerdict: "The product meaning is that the agentic baseline moves downward into everyday use. More users will treat AI as an executor rather than an adviser. That requires interfaces to become task-control systems instead of longer chat transcripts. The next thing to watch is whether Claude Code and the API surface make intermediate steps, failure recovery, and human takeover clear enough for real work."
    }
  }),
  topic({
    id: "cursor-mobile-agent-control",
    section: "community",
    zhHeadline: "Cursor Web/Mobile 把 coding agent 变成可远程监督的工作对象",
    enHeadline: "Cursor web and mobile make coding agents something developers supervise remotely",
    sourceDate: "2026-06-29 to 2026-07-05 scan",
    evidenceLabel: "review/community friction",
    evidenceStrength: "community friction · developer surface",
    visual: visuals.cursor,
    sources: [
      source("Cursor official site", "https://cursor.com/"),
      source("Cursor blog: agents on web and mobile", "https://cursor.com/blog/agent-web"),
      source("TechCrunch: Cursor mobile app", "https://techcrunch.com/2026/06/29/cursor-now-has-a-mobile-app-for-guiding-your-coding-agent-on-the-go/"),
      source("Cursor Forum: Compile 2026 announcements", "https://forum.cursor.com/t/latest-announcments-from-compile-2026/163460")
    ],
    hciZh: ["移动监督", "diff 风险摘要", "停止/接管"],
    hciEn: ["mobile supervision", "diff risk summary", "stop and takeover"],
    zh: {
      productName: "Cursor web and mobile agents",
      productType: "面向开发者的 coding-agent 控制界面。Cursor 官方站点强调 coding agent 和 Mission Control Interface；官方 blog 说明 web/mobile agents 可以写代码、回答复杂问题、搭建工作；TechCrunch 报道 Cursor Mobile 让用户在手机上 prompt coding agents 或与桌面启动的 agents 互动。它不是单纯移动 IDE，而是把 agent 变成可远程启动、监督、继续或停止的工作对象。",
      interactionFlow: "用户在桌面 Cursor 中启动一个 coding agent，或在 web/mobile 入口提交任务。agent 在远端或工作环境中生成代码、修改文件、回答问题或 scaffold 项目。用户离开电脑后通过手机查看 agent 状态，追加 prompt、决定是否继续、检查结果、阅读差异和测试状态。理想体验是手机像任务调度台：不是在小屏幕里写大量代码，而是做决策、批准、阻止、要求补测或把任务交回桌面。",
      specsOrStack: "来源支持 web/mobile agent、Cursor coding agent、Mission Control Interface、agentic development、TechCrunch 对移动 App 的描述、论坛中 iOS beta/远程控制桌面会话等社区信息。具体移动端正式平台、Android 计划、远程执行架构、企业权限、代码托管深度、离线能力、通知粒度、价格和安全审计范围为 source not stated，不能从当前来源推断。",
      useCases: "具体场景包括通勤时启动小型修复、会议间隙检查 agent 完成状态、在手机上给远端任务追加约束、审查 generated diff、确认测试失败后要求 agent 修复、或把桌面端已启动任务带到移动端继续监督。对管理者或独立开发者来说，它把“等待代码生成”变成可并行处理的后台任务。",
      painPointsSolved: "它解决的是 coding agent 的时间与空间错位。AI 写代码往往需要几分钟到几十分钟，用户不想坐在 IDE 前干等，但也不能完全放任 agent 修改代码。移动控制面让用户在不打开电脑的情况下保持监督。真正的 UX 难点是把复杂工程状态压缩成小屏可读：哪些文件变了、测试是否跑过、风险在哪里、能否安全 merge、何时必须回到桌面。",
      userVoice: "Cursor 论坛和媒体报道显示开发者关心移动控制、远程 session 和 agentic era 的工作流，但这仍是社区/发布信号。当前来源未提供大规模满意度、误 merge 率、移动审查失败案例或企业安全反馈；source not stated。",
      newTech: "新技术点是 mission-control pattern。开发者 UI 从编辑器中心转向 agent orchestration：任务队列、状态、diff、测试、日志、审批和接管成为主界面。手机不是完整替代桌面，而是把监督动作从写代码动作中拆出来。",
      availability: "Cursor 官方 web/mobile agents 页面可访问；TechCrunch 报道移动 App；论坛提到 iOS beta 等信息。具体公开下载、地区、平台、企业开关和账号权限需以 Cursor 当前官方渠道为准。",
      limitsOrUnknowns: "限制在于手机端审查天然薄弱。大 diff、复杂测试、依赖变更、安全敏感文件和产品行为变更很难在移动端完全判断。若界面只给“完成/继续”按钮而不给风险摘要、测试证据和一键停止，用户会被推向草率批准。远程 agent 还需要清楚处理 secrets、权限、分支和回滚。",
      productVerdict: "Cursor Mobile/Web 的意义不是把 IDE 缩进手机，而是把开发者变成 agent supervisor。产品成败看它能否把工程风险压成可行动的移动决策：现在要不要停、要不要补测、要不要打开桌面、能不能合并。这个方向会影响所有 coding agent 产品。"
    },
    en: {
      productName: "Cursor web and mobile agents",
      productType: "A developer-facing control surface for coding agents. Cursor's official site emphasizes coding agents and a Mission Control Interface, while its blog describes agents on web and mobile that can write code, answer complex questions, and scaffold work. TechCrunch reports a Cursor Mobile app for prompting coding agents from a phone or interacting with agents started on the desktop. The product is not simply a mobile IDE; it turns agents into remote work objects that can be started, supervised, redirected, or stopped.",
      interactionFlow: "A developer starts a coding agent in desktop Cursor or submits a task from web or mobile. The agent works in a remote or local project context, generates code, edits files, answers questions, or scaffolds a feature. After leaving the computer, the developer checks status from a phone, adds constraints, reviews the result, inspects diffs and tests, and decides whether the agent should continue. The ideal mobile experience is a task-control surface, not a cramped coding environment: the phone is for decisions, approvals, stop commands, requests for more tests, and handoff back to desktop.",
      specsOrStack: "The sources support Cursor web and mobile agents, the coding-agent positioning, Mission Control language, agentic development, TechCrunch's mobile-app coverage, and community/forum references to iOS beta and remote desktop-session control. Formal mobile platform availability, Android plans, remote execution architecture, enterprise permissions, repository integration depth, offline behavior, notification granularity, pricing, and security-audit scope are source not stated in the cited material.",
      useCases: "The concrete jobs are starting a small fix while commuting, checking whether a background agent finished, adding a constraint between meetings, reviewing generated diffs from a phone, asking the agent to repair failing tests, and supervising a desktop-launched task without staying at the desk. For an independent developer or engineering manager, it turns the waiting time of code generation into a background task that can be monitored in parallel with other work.",
      painPointsSolved: "The product addresses the time-and-place mismatch of coding agents. AI coding tasks can take minutes or longer. Users do not want to sit in front of an IDE waiting, but they also cannot responsibly let an agent modify a codebase without oversight. A mobile control surface preserves human supervision while reducing desk lock-in. The UX problem is compression: changed files, test status, risk, branch context, and merge readiness must be made legible on a small screen.",
      userVoice: "Cursor forum posts and media coverage show developer interest in mobile control, remote sessions, and agentic workflows, but that remains community and launch signal. The cited sources do not provide broad satisfaction data, false-merge rates, mobile-review failure cases, or enterprise security feedback; source not stated.",
      newTech: "The new pattern is mission-control development. The primary interface shifts from editor-only to agent orchestration: task queues, status, diffs, tests, logs, approvals, and takeover become first-class. The phone does not replace the desktop; it separates supervisory actions from code-writing actions.",
      availability: "Cursor's official web/mobile agent page is available, TechCrunch reports the mobile app, and forum discussion references iOS beta behavior. Public download status, regions, platforms, enterprise switches, and account permissions should be verified through current Cursor channels.",
      limitsOrUnknowns: "The limit is mobile review quality. Large diffs, complex tests, dependency changes, security-sensitive files, and product-behavior changes are hard to judge from a phone. If the interface provides only 'done' and 'continue' without risk summaries, test evidence, and a clear stop command, users will be nudged into careless approval. Remote agents also need transparent handling of secrets, permissions, branches, and rollback.",
      productVerdict: "Cursor web and mobile matter because they define the developer as an agent supervisor. The product should be judged by whether it turns engineering risk into actionable mobile decisions: stop now, add tests, open the desktop, request explanation, or approve. That pattern will influence every serious coding-agent product."
    }
  }),
  topic({
    id: "zai-zcode-china-global",
    section: "china",
    zhHeadline: "Z.ai ZCode 把 GLM-5.2 包装成中国/全球开发者工具竞争信号",
    enHeadline: "Z.ai ZCode packages GLM-5.2 as a China/global developer-tool signal",
    sourceDate: "2026-07-02 to 2026-07-05 scan",
    evidenceLabel: "developer surface",
    evidenceStrength: "developer surface · China/global product signal",
    visual: visuals.zcode,
    sources: [
      source("ZCode docs: welcome", "https://zcode.z.ai/en/docs"),
      source("ZCode docs: configuration", "https://zcode.z.ai/en/docs/configuration"),
      source("Business Insider: Z.ai ZCode launch", "https://www.businessinsider.com/z-ai-zcode-ai-coding-tool-chinese-startup-lower-cost-2026-7"),
      source("DevOps.com: Z.ai debuts ZCode", "https://devops.com/z-ai-debuts-zcode-to-compete-with-github-copilot-cursor-and-anthropic/")
    ],
    hciZh: ["ADE 竞争", "长任务控制", "中国模型出海"],
    hciEn: ["ADE competition", "long-task control", "China model globalization"],
    zh: {
      productName: "Z.ai ZCode",
      productType: "面向 GLM-5.2 的 Agentic Development Environment。ZCode 文档称它把 GLM-5.2 的 long-context、long-horizon、agentic coding 能力带进稳定桌面体验，覆盖 planning、coding、reviewing、iterating across complex development tasks。媒体将其放在 Cursor、GitHub Copilot、Claude Code 竞争语境中，并提到较低订阅价格。价格、版本和优惠需以 Z.ai/ZCode 当前官方页为准。",
      interactionFlow: "用户安装 ZCode 桌面应用，连接 Z.ai 或 BigModel 账号与 GLM Coding Plan，然后在项目中发起 coding goal。工具负责规划、修改代码、审查、迭代，并通过长期任务或多 agent 协作处理复杂开发工作。文档/报道还提到远程 bot control，例如 WeChat、Feishu、Telegram 等通道，意味着开发者可以从常用通讯工具触发或监督任务，而不只在 IDE 内操作。",
      specsOrStack: "来源支持 ZCode、GLM-5.2、Agentic Development Environment、macOS/Windows/Linux beta 语境、GLM Coding Plan、长上下文/长任务、planning/coding/reviewing/iterating，以及通过账号计划计量的 quota 说明。具体 IDE 内核、插件协议、repo 权限模型、完整多 agent 架构、企业 SSO、代码隐私、地区限制、价格稳定性、模型 benchmark 与安全评估细节为 source not stated 或需官方实时确认。",
      useCases: "具体使用场景包括用 GLM-5.2 做大型代码库理解、生成实现计划、自动修改多文件、审查改动、迭代修复、通过通讯工具远程控制 agent，以及以较低价格尝试中国大模型驱动的 coding workflow。对中国开发者，它可能降低本地模型/账号/支付/沟通工具接入成本；对全球开发者，它是 Cursor/Claude Code 之外的价格和模型路线对照。",
      painPointsSolved: "它解决的是 GLM 模型从 API/聊天框到实际开发环境的落地问题。强模型如果没有稳定编辑器、权限、文件上下文、长期任务和审查流程，很难进入真实工程。ZCode 把模型能力包装成开发者可操作的桌面工具，也把价格、计划、远程控制和 agent 协作放进产品层，让用户不必自己拼接脚本。",
      userVoice: "媒体报道提到在线讨论中有低价竞争和 cloning 争议，但当前来源不能验证这些评价的代表性。独立开发者对输出质量、代码安全、UI 相似度、长期维护和国际化体验的实测还不足；source not stated。",
      newTech: "新技术点是 ADE 而非插件：把模型、计划、执行、审查、quota、远程 bot 控制和多 agent 协作打包成一个开发环境。它反映中国 AI 工具不只发布模型，也开始争夺开发者工作台入口。",
      availability: "ZCode 文档页面可访问，媒体报道称桌面应用可用于 Windows 等并有 macOS/Linux beta 语境。实际下载、价格、优惠、平台支持、地区账号和企业能力以 Z.ai/ZCode 当前官方文档为准。",
      limitsOrUnknowns: "未知和风险包括：是否稳定处理大型私有仓库，是否有清楚权限/secret 防护，是否能解释每一步改动，是否支持本地测试和回滚，是否会被 UI/工作流相似性争议拖累，以及 GLM-5.2 在英文、中文、跨语言代码库中的真实表现是否稳定。",
      productVerdict: "ZCode 是今天中国 lane 最具体的开发者产品信号。它不是抽象模型新闻，而是模型公司开始做 agentic IDE/ADE 的入口战。对用户的影响是价格和本地生态可能更友好，但必须用真实 repo、测试通过率、权限设计和长任务失败恢复来验证，不能只看低价和发布页。"
    },
    en: {
      productName: "Z.ai ZCode",
      productType: "An Agentic Development Environment for GLM-5.2. ZCode documentation says it brings GLM-5.2's long-context, long-horizon, and agentic coding capabilities into a stable desktop experience for planning, coding, reviewing, and iterating across complex development tasks. Media coverage positions it against Cursor, GitHub Copilot, and Claude Code, with lower plan pricing reported. Prices, versions, and promotions should be checked against current Z.ai or ZCode official pages.",
      interactionFlow: "A developer installs ZCode, connects a Z.ai or BigModel account and an active GLM Coding Plan, then starts a coding goal inside a project. The tool plans, edits code, reviews changes, and iterates across longer development tasks. Documentation and coverage also mention remote bot control through channels such as WeChat, Feishu, and Telegram, suggesting that a developer can trigger or supervise work from familiar communication tools instead of staying only inside an IDE.",
      specsOrStack: "The sources support ZCode, GLM-5.2, Agentic Development Environment positioning, macOS/Windows/Linux beta context, GLM Coding Plan, long-context and long-horizon work, planning/coding/reviewing/iterating, and account-plan quota metering. The IDE core, plugin protocol, repository permission model, full multi-agent architecture, enterprise SSO, code-privacy guarantees, regional restrictions, price stability, benchmark details, and safety evaluations are source not stated or require live official verification.",
      useCases: "The practical jobs are understanding large codebases with GLM-5.2, producing implementation plans, editing multiple files, reviewing changes, iterating on failures, remotely controlling agents from messaging tools, and trying a Chinese-model coding workflow at a lower reported price. For Chinese developers, it may reduce friction around local accounts, model access, payment, and communication channels. For global developers, it becomes a comparison point against Cursor, Claude Code, and Copilot.",
      painPointsSolved: "ZCode addresses the gap between a capable coding model and an actual development workflow. A strong model is hard to use in real engineering if users must manually connect file context, permissions, long-running tasks, review steps, and quotas. ZCode packages those pieces into a desktop tool, so users do not have to assemble scripts around GLM-5.2 themselves. It also makes pricing, remote control, and multi-agent collaboration product-level choices.",
      userVoice: "Media coverage notes online debate about low-cost competition and cloning accusations, but the cited sources do not establish representative user sentiment. Independent evidence on output quality, code safety, UI originality, long-term maintenance, and international experience is still thin; source not stated.",
      newTech: "The product idea is an ADE rather than a small editor plugin. Model access, planning, execution, review, quota, remote bot control, and multi-agent coordination are combined into a development environment. It signals that Chinese AI companies are not only releasing models; they are competing for the developer workbench.",
      availability: "ZCode documentation is available, and media reports describe a desktop application with Windows availability and macOS/Linux beta context. Actual downloads, pricing, promotions, platform support, account regions, and enterprise features should be verified through current Z.ai/ZCode documentation.",
      limitsOrUnknowns: "Open risks include large private-repository reliability, permission and secret handling, whether every change is explainable, support for local tests and rollback, whether UI similarity controversy affects trust, and whether GLM-5.2 performs consistently across English, Chinese, and mixed-language codebases.",
      productVerdict: "ZCode is the most concrete China-lane developer-product signal today. It is not abstract model news; it is a model company entering the agentic IDE/ADE doorway. The user impact could be better pricing and better local ecosystem fit, but it must be validated on real repositories, test pass rates, permission design, and long-task recovery rather than launch-page claims."
    }
  }),
  topic({
    id: "china-ai-glasses-os-scan",
    section: "official",
    zhHeadline: "中国 AI 眼镜扫描：从手机配件走向 AIOS 原生眼镜的说法正在升温",
    enHeadline: "China AI glasses scan: the narrative is moving from phone accessory to AIOS-native eyewear",
    sourceDate: "2026-06 to 2026-07 source-lane scan",
    evidenceLabel: "weak/unverified",
    evidenceStrength: "weak/unverified · source-lane scan",
    visual: visuals.chinaScan,
    sources: [
      source("量子位：AI眼镜不再依赖手机", "https://www.qbitai.com/2026/07/441491.html"),
      source("36氪：AI眼镜赛道全面起势", "https://m.36kr.com/p/3855201250507656"),
      source("量子位：雷鸟创新 2026 上半年成绩单", "https://www.qbitai.com/2026/06/437489.html"),
      source("WIPO Global Awards 2026: Rokid", "https://www.wipo.int/en/web/awards/global/2026")
    ],
    hciZh: ["AIOS 叙事", "补贴降低试错", "缺少 hands-on 证据"],
    hciEn: ["AIOS narrative", "subsidies lower trial cost", "hands-on evidence missing"],
    zh: {
      productName: "China AI glasses OS lane scan",
      productType: "这是 source-lane scan，不是单一确认产品 dossier。今天中国来源里最强的产品接口信号是 AI 眼镜正在从“手机配件/拍摄眼镜”叙事转向“AIOS 原生终端”。量子位报道提到 Rokid/YodaOS 与主动管理意图能力、跳出传统 GUI 的 AIUI 标准；36氪和量子位提供市场、补贴和雷鸟等厂商增长背景；WIPO 对 Rokid 的资料提供国际 IP/出货和应用场景信号。",
      interactionFlow: "可见的交互主张是：用户不再把眼镜只当蓝牙耳机、相机或手机通知屏，而是在眼镜上通过语音、显示、传感、翻译、导航、会议、导览等任务直接表达意图。系统层尝试主动管理意图，决定何时提示、何时显示、何时调用手机或云端。由于许多报道是行业/公司材料转述，实际 hands-on 流程、失败反馈、权限弹窗、续航和延迟还没有足够独立验证。",
      specsOrStack: "来源支持的事实包括中国 AI/AR 眼镜市场升温、部分消费补贴降低试错成本、厂商把 AIOS/AIUI/YodaOS 作为产品语言、雷鸟等品牌的销售/机构认证报道、Rokid 在 WIPO 材料中的重量、专利/商标/出货和行业应用陈述。具体每款眼镜的芯片、传感器、OS API、模型、价格、上市地区、电池、重量、显示规格和隐私机制必须逐款看官方来源；本 scan 不合并推断。",
      useCases: "可观察场景集中在翻译字幕、会议记录、景区/博物馆导览、工业现场提示、骑行/步行导航、拍摄分享、通知与语音助手。中国生态的特殊性在于本地生活、支付、地图、办公通讯和电商服务可能更快闭环，眼镜若能接入这些服务，用户就少一次拿手机。但今天可用材料还不足以证明这些闭环在零售用户手中稳定成立。",
      painPointsSolved: "它试图解决 AI 眼镜长期依赖手机的问题。手机依赖会让眼镜变成昂贵通知屏，用户仍要掏手机确认、授权、输入和修正。AIOS 叙事想把意图识别、任务管理和服务调用前移到眼镜。但如果没有成熟权限、显示层级和失败恢复，所谓 AIOS 只会把手机上的复杂性搬到更小的视野里。",
      userVoice: "今天扫描到的公开材料更多是媒体/行业叙事、厂商成绩单和 IP 资料，缺少足够普通用户长期佩戴反馈。排队体验、销量增长和补贴不能直接等于满意度；source not stated。",
      newTech: "新技术信号是 AIOS/AIUI 从营销词变成厂商开始争夺的接口语言：谁定义眼镜上的意图、状态、通知密度、翻译文本位置、相机/麦克风权限和跨服务调用，谁就更接近下一代轻量 AI 终端入口。",
      availability: "各品牌和型号可用性差异很大。Rokid、雷鸟等已有产品/市场资料，YodaOS/AIOS 具体版本、API 开放、升级计划、地区和售后需逐项核对官方页面；本 scan 不把行业趋势当作单品可购买事实。",
      limitsOrUnknowns: "缺失证据包括独立评测的亮度/续航/延迟、真实噪声环境识别、隐私提示、佩戴舒适度、处方适配、App 崩溃率、服务接入失败率和售后数据。中国眼镜赛道很热，但热度本身不是产品完成度。",
      productVerdict: "今天中国 lane 的判断是：方向值得跟，结论要降级。AIOS 原生眼镜如果成立，会改变眼镜从手机外设到任务入口的地位；但没有足够 hands-on 和官方 API 证据前，只能作为 watch signal。下一步重点看 Rokid/YodaOS、雷鸟、夸克/通义生态是否给出稳定、可复现、可购买的用户流程。"
    },
    en: {
      productName: "China AI glasses OS lane scan",
      productType: "A source-lane scan rather than a single confirmed product dossier. The strongest China-interface signal today is the shift in narrative from smart glasses as phone accessories or camera glasses toward AIOS-native eyewear. QbitAI coverage frames Rokid/YodaOS around active intent management and AIUI standards beyond traditional GUI logic. 36Kr and QbitAI provide market, subsidy, and RayNeo/Rokid momentum context. WIPO's Rokid material adds an international IP, shipment, and deployment signal.",
      interactionFlow: "The claimed interaction flow is that users do not treat glasses merely as Bluetooth audio, a camera, or a notification mirror. They speak intent directly into the glasses and receive display, translation, navigation, meeting, guide, or service feedback. The system layer is supposed to manage intent, decide when to prompt, when to display, and when to call a phone or cloud service. Because much of the material is industry reporting or company-context coverage, hands-on evidence for failure states, permissions, battery life, latency, and everyday recovery is still limited.",
      specsOrStack: "The cited sources support a warming Chinese AI/AR glasses market, consumer subsidies that may lower trial cost, vendor language around AIOS, AIUI, and YodaOS, RayNeo sales and certification reporting, and WIPO's statements about Rokid's weight, IP portfolio, shipments, and deployments. Chipsets, sensors, OS APIs, models, prices, launch regions, battery, weight, display specs, and privacy mechanisms must be checked product by product through official sources. This scan does not merge those claims into one inferred product.",
      useCases: "The visible jobs include translation subtitles, meeting capture, museum or industrial guidance, walking or cycling navigation, camera sharing, notifications, and voice assistance. The China-specific product opportunity is service closure: local life, payments, maps, workplace messaging, ecommerce, and office tools can potentially be connected faster inside domestic ecosystems. If glasses call those services directly, users may take out phones less often. The available evidence does not yet prove stable retail-user closure.",
      painPointsSolved: "The narrative addresses phone dependence. If glasses still require phone confirmation, phone authorization, phone typing, and phone correction, they are expensive notification screens. AIOS language tries to move intent recognition, task management, and service invocation into the eyewear layer. But without mature permission design, display hierarchy, and recovery states, AIOS will simply move phone complexity into a smaller visual field.",
      userVoice: "The scanned public material is mostly media narrative, vendor performance reporting, and IP context. It does not provide enough long-term ordinary-user feedback. Queues, sales momentum, and subsidies do not equal satisfaction; source not stated for durable user sentiment.",
      newTech: "The signal is that AIOS and AIUI are becoming interface language vendors want to own. Whoever defines intent, state, notification density, translation placement, camera and microphone permissions, and cross-service calls on glasses gets closer to owning a lightweight AI terminal.",
      availability: "Availability varies by brand and model. Rokid, RayNeo, and other vendors have product and market materials, but YodaOS/AIOS versions, API openness, upgrade paths, regions, and support terms must be checked against official pages. This scan does not treat an industry trend as a directly purchasable product fact.",
      limitsOrUnknowns: "Missing evidence includes independent brightness, battery, latency, noisy-environment recognition, privacy indicators, long-wear comfort, prescription support, app crash rate, service failure rate, and after-sales data. The China smart-glasses lane is hot, but heat is not product completion.",
      productVerdict: "The China lane is directionally important but must be downgraded. If AIOS-native glasses become real, eyewear moves from accessory to task entry point. Until there is stronger hands-on and official API evidence, it remains a watch signal. The next checks are Rokid/YodaOS, RayNeo, Quark/Tongyi, and whether any of them show stable, reproducible, purchasable user flows."
    }
  }),
  topic({
    id: "wearable-agent-research-patent-watch-scan",
    section: "research",
    zhHeadline: "VisionClaw 与智能眼镜专利提醒：连续感知 agent 还只是研究/专利信号",
    enHeadline: "VisionClaw and smart-glasses patents: continuous-perception agents remain research and patent signals",
    sourceDate: "2026 research/patent watch",
    evidenceLabel: "research signal",
    evidenceStrength: "research signal · patent signal downgraded",
    visual: visuals.researchPatent,
    sources: [
      source("arXiv: VisionClaw always-on AI agents through smart glasses", "https://arxiv.org/html/2604.03486v2"),
      source("arXiv: conversational successes and breakdowns in smart glasses", "https://arxiv.org/html/2602.22340v1"),
      source("Google Patents: AI-supported smart glasses", "https://patents.google.com/patent/WO2024129004A1/en"),
      source("Google Patents: AI Smart Glasses GS1 design", "https://patents.google.com/patent/CN309755008S/en")
    ],
    hciZh: ["连续感知", "旁观者同意", "专利不等于产品"],
    hciEn: ["continuous perception", "bystander consent", "patent is not product"],
    zh: {
      productName: "Wearable agent research and patent watch",
      productType: "这是 research/patent watch，不是确认上市产品。VisionClaw 论文描述 always-on wearable AI agent，把 Meta Ray-Ban smart glasses 的 egocentric perception 与 Gemini Live、OpenClaw AI agents 结合，支持语音驱动的 in-situ action delegation。另有智能眼镜对话 breakdown 研究和 AI-supported smart glasses、AI Smart Glasses 外观专利作为方向信号。本期明确降级：论文/专利不能当作产品事实。",
      interactionFlow: "研究原型的交互是眼镜持续感知第一人称环境，用户用语音委派任务，系统把看到的上下文与 agent 执行能力连接起来，例如识别环境、记录信息、调用工具、执行后续动作。对话 breakdown 研究提醒，voice-only 或 non-display glasses 在日常环境中会遇到误解、时机、社会尴尬和反馈不足。专利材料则更多描述可能的硬件/医疗/外观方向，不提供可购买流程。",
      specsOrStack: "VisionClaw 来源支持 Meta Ray-Ban smart glasses、Gemini Live、OpenClaw、always-on perception、controlled lab study N=12、自传式 deployment N=4 等研究信息。专利来源支持 AI-supported smart glasses 在医疗诊断/治疗流程语境的权利要求，以及 CN 外观设计名称和用途。商业产品规格、量产硬件、售价、上市日期、隐私方案、监管许可、医疗有效性和真实用户规模均为 source not stated。",
      useCases: "潜在场景包括现场任务辅助、购物/维修/烹饪时的手眼协作、会议与生活记录、无障碍支持、医疗现场信息提示、工业作业和实时翻译。但这些是研究和专利启发的 watchlist，不是今天可购买产品的承诺。产品团队只能把它们当作未来交互需求：看见、理解、委派、确认、执行和撤销。",
      painPointsSolved: "连续感知 agent 试图解决今天 AI 助手缺少环境上下文的问题。手机/桌面 chatbot 需要用户描述世界，眼镜 agent 可以直接看到一部分世界，从而减少解释成本。但这同时制造更重的隐私和社会成本：旁观者是否同意、何时录制、何时分析、错误识别如何纠正、用户如何知道 agent 正在用哪段环境信息。",
      userVoice: "论文中的 N=12 与 N=4 是研究样本，不代表市场用户。专利没有用户原声。当前公开证据不能证明普通消费者愿意长期佩戴 always-on 感知眼镜；source not stated。",
      newTech: "新技术点是把 egocentric perception 与 general-purpose agent execution 接上。它不只是记录视频，也不是只做字幕，而是让 agent 用第一人称环境作为任务上下文。HCI 的新问题是感知状态本身要可见：用户和旁观者都需要知道摄像头/麦克风/模型何时在工作、做了什么判断、能否撤销。",
      availability: "VisionClaw 是研究原型/论文。专利是公开法律文件。两者都不等于商业上市。任何公司是否将这些方案产品化、何时上市、在哪些地区、经过哪些监管和隐私审查，均 source not stated。",
      limitsOrUnknowns: "限制包括小样本研究、实验环境偏差、硬件续航、热量、网络依赖、模型延迟、错误执行、旁观者隐私、医疗监管和专利覆盖范围不确定。专利还可能从未实施；研究代码也可能与消费级体验差距很大。",
      productVerdict: "这条是必要的降级 watch。连续感知眼镜 agent 可能是未来 AI hardware 的关键形态，但今天不能把论文和专利写成产品发布。对产品团队的实用结论是提前设计 consent、recording indicator、context preview、permission boundary、undo 和 audit trail，否则 always-on agent 会先输给信任问题。"
    },
    en: {
      productName: "Wearable agent research and patent watch",
      productType: "A research and patent watch item, not a confirmed shipping product. The VisionClaw paper describes an always-on wearable AI agent that combines egocentric perception from Meta Ray-Ban smart glasses with Gemini Live and OpenClaw AI agents for speech-driven in-situ action delegation. Related research on conversational breakdowns in smart glasses and patent documents for AI-supported or designed smart glasses provide directional signals. This item is explicitly downgraded: papers and patents are not product facts.",
      interactionFlow: "The research prototype flow is continuous first-person perception through glasses, followed by spoken task delegation. The system connects what the wearer sees with agent execution: recognizing context, recording information, invoking tools, and taking follow-up action. Research on voice-only or non-display smart glasses warns that everyday use involves misunderstanding, timing problems, social awkwardness, and insufficient feedback. Patent documents mostly describe possible hardware, medical, or design directions rather than purchasable workflows.",
      specsOrStack: "VisionClaw sources support Meta Ray-Ban smart glasses, Gemini Live, OpenClaw, always-on perception, a controlled laboratory study with N=12, and an autobiographical deployment study with N=4. Patent sources support AI-supported smart glasses in a medical diagnosis or treatment context and a CN design patent for AI smart glasses. Commercial specs, production hardware, price, launch date, privacy design, regulatory clearance, medical validity, and market user scale are source not stated.",
      useCases: "Potential jobs include in-situ assistance during repair, shopping, cooking, meetings, life logging, accessibility support, medical context prompts, industrial work, and real-time translation. These are research- and patent-inspired watchlist scenarios, not promises about products available today. Product teams should treat them as future interaction requirements: seeing, understanding, delegating, confirming, executing, and undoing.",
      painPointsSolved: "Continuous-perception agents address a real limitation of current assistants: they often lack environmental context. A phone or desktop chatbot requires the user to describe the world. Glasses can observe part of the world directly, reducing explanation cost. The same capability creates privacy and social cost. Bystanders may not consent. Users need to know when recording happens, when analysis happens, what environmental context was used, and how to correct a wrong interpretation.",
      userVoice: "The N=12 and N=4 results are research samples, not market-user evidence. Patents do not provide user voice. The current public evidence does not prove that ordinary consumers will accept always-on perception glasses for long-term daily use; source not stated.",
      newTech: "The technical signal is the connection between egocentric perception and general-purpose agent execution. The glasses are not just recording video and not just displaying captions; they turn first-person environment into task context for an agent. The HCI requirement is that perception state itself becomes visible. Wearers and bystanders need indicators for camera, microphone, model analysis, decision state, and auditability.",
      availability: "VisionClaw is a research prototype and paper. The patents are public legal documents. Neither equals a commercial launch. Whether any company productizes the techniques, where, when, and under what regulatory and privacy reviews is source not stated.",
      limitsOrUnknowns: "Limits include small research samples, laboratory bias, battery, heat, network dependence, latency, erroneous execution, bystander privacy, medical regulation, and uncertain patent scope. A patent may never be implemented. Research code may be far from a consumer-grade experience.",
      productVerdict: "This is a necessary downgraded watch item. Continuous-perception eyewear agents may become a key AI hardware form, but today's evidence should not be written as product launch. The practical product lesson is to design consent, recording indicators, context preview, permission boundaries, undo, and audit trails early. Without those, always-on agents will fail on trust before they win on capability."
    }
  }),
  topic({
    id: "patent-lane-glasses-ip-scan",
    section: "patent",
    zhHeadline: "专利 lane：智能眼镜 IP 很热，但只能提示方向，不能替代产品证据",
    enHeadline: "Patent lane: smart-glasses IP is active, but it signals direction rather than product evidence",
    sourceDate: "2026 patent/source scan",
    evidenceLabel: "patent signal",
    evidenceStrength: "patent signal · explicitly speculative",
    visual: visuals.researchPatent,
    sources: [
      source("WIPO Global Awards 2026: Rokid", "https://www.wipo.int/en/web/awards/global/2026"),
      source("Google Patents: AI-supported smart glasses", "https://patents.google.com/patent/WO2024129004A1/en"),
      source("Google Patents: AI Smart Glasses GS1 design", "https://patents.google.com/patent/CN309755008S/en"),
      source("Android Central: Solos smart-glasses patent lawsuit", "https://www.androidcentral.com/wearables/solos-is-taking-aim-at-meta-essilorluxottica-for-alleged-smart-glasses-patent-infringement-in-pivotal-case")
    ],
    hciZh: ["IP 战场", "诉讼风险", "不等于上市"],
    hciEn: ["IP battlefield", "litigation risk", "not a launch"],
    zh: {
      productName: "Smart-glasses patent lane scan",
      productType: "这是 patent signal scan。WIPO 对 Rokid 的资料显示智能眼镜企业正在用专利、商标、出货和行业应用建立全球可信度；Google Patents 中的医疗 AI 智能眼镜和 GS1 外观设计显示形态/IP 方向；Android Central 报道 Solos 与 Meta/EssilorLuxottica 的专利纠纷，说明眼镜赛道的 IP 摩擦会影响产品路线。所有专利/诉讼信息都不能当作功能上市事实。",
      interactionFlow: "专利本身没有用户流程。它能提示未来产品可能重视的组件：医疗诊断辅助、外观形态、传感/音频/显示、波导、环境理解或多模态输入。诉讼报道则提示用户可能遇到的间接影响：产品停售风险、品牌合作变化、授权成本上升或某些功能受限。但这些都属于外部信号，不能替代官方产品页或 hands-on 测试。",
      specsOrStack: "来源支持 WIPO 对 Rokid 重量、专利数量、商标、国家/地区和部署场景的陈述；Google Patents 支持专利/外观设计文档名称、用途和摘要；Android Central 支持 Solos 起诉 Meta/EssilorLuxottica 的报道语境。具体权利要求有效性、法院结果、实际侵权判断、产品停售可能性、授权费用、每项专利是否实施、以及终端规格均为 source not stated。",
      useCases: "作为 product magazine 的专利 lane，它服务于风险和方向判断：哪些交互能力正在被圈地，哪些硬件形态可能成为竞争壁垒，哪些诉讼可能改变智能眼镜渠道和定价。对产品团队，它提醒不要只看发布会，还要看 IP、标准、供应链和法律风险对路线图的影响。",
      painPointsSolved: "专利扫描解决的是产品研究里的盲区。很多团队只追踪新闻发布，忽略一个硬件品类在上市前会被专利和诉讼塑形。智能眼镜尤其如此，因为光学、音频、传感、外观和隐私提示都可能有专利约束。提前看 IP 信号可以避免把不可控组件当作低风险设计基础。",
      userVoice: "专利文件没有用户原声。诉讼报道中的用户影响也多为推测，当前没有证据说明消费者已因这些专利文件直接改变购买行为；source not stated。",
      newTech: "新技术信号不是某个确定功能，而是多条方向同时被保护：更轻眼镜、医疗/工业场景、AI 辅助诊断、外观设计、音频/传感架构和显示路径。这说明 smart glasses 竞争会从单品参数扩展到 IP portfolio 与生态授权。",
      availability: "专利公开不代表产品上市；诉讼提起不代表法院判决；WIPO 案例资料不代表所有地区都可购买同款产品。任何可用性都必须回到具体品牌官方商店、开发者文档或监管公告。",
      limitsOrUnknowns: "限制是专利语言宽泛、翻译可能粗糙、权利要求复杂、实施状态不明。许多专利会防御性持有而不进入产品。诉讼报道也会随法院进展变化。今天只能作为 watchlist，不能写成 confirmed product。",
      productVerdict: "专利 lane 的结论很克制：智能眼镜 IP 已经足够密集，产品经理需要把专利/诉讼风险纳入竞品扫描；但用户价值仍要靠可购买产品、真实交互和来源背书证明。今天没有把任何专利当作发布事实。"
    },
    en: {
      productName: "Smart-glasses patent lane scan",
      productType: "A patent-signal scan. WIPO's Rokid material shows how smart-glasses companies use patents, trademarks, shipments, and deployments to build global credibility. Google Patents documents around AI-supported smart glasses and a GS1 design patent show possible medical and form-factor directions. Android Central's coverage of the Solos lawsuit against Meta and EssilorLuxottica shows that IP friction may affect the smart-glasses market. None of this is treated as a shipped feature.",
      interactionFlow: "A patent has no user workflow. It can only indicate components and directions future products might emphasize: medical assistance, industrial use, form factor, sensing, audio, display, waveguides, environmental understanding, or multimodal input. Lawsuit coverage suggests possible indirect user impact such as sales risk, brand partnership changes, licensing costs, or feature constraints. These are external signals and cannot replace official product pages or hands-on testing.",
      specsOrStack: "The sources support WIPO's statements about Rokid's weight, patent count, trademarks, countries, and deployment examples; Google Patents supports document titles, intended use, abstracts, and publication records; Android Central supports the reporting context for Solos suing Meta and EssilorLuxottica. Claim validity, court outcomes, actual infringement, product injunction risk, licensing fees, whether a patent is implemented, and final device specs are source not stated.",
      useCases: "The role of the patent lane in a product magazine is directional and risk-oriented. It helps identify which interaction capabilities are being fenced, which hardware forms might become competitive barriers, and which lawsuits could influence channel, price, or availability. For product teams, it is a reminder that launch coverage is not enough. IP, standards, supply chain, and legal risk can shape the roadmap before users see a device.",
      painPointsSolved: "Patent scanning addresses a blind spot in product research. Teams often track announcements and reviews but miss the way a hardware category is shaped by patents and litigation before launch. Smart glasses are especially exposed because optics, audio, sensing, exterior design, and privacy indicators may all be constrained. Reading IP signals early prevents teams from treating a legally or technically constrained component as a low-risk design foundation.",
      userVoice: "Patent documents do not contain user voice. The user impact of lawsuits is also speculative at this stage. The cited sources do not show consumers changing purchase behavior directly because of these patent documents; source not stated.",
      newTech: "The signal is not one confirmed feature. It is the clustering of protected directions: lighter glasses, medical and industrial assistance, AI-supported diagnosis, exterior design, audio/sensing architecture, and display paths. Smart-glasses competition is expanding from device specs into IP portfolios and ecosystem licensing.",
      availability: "Patent publication does not equal product launch. A filed lawsuit does not equal a court decision. WIPO profile material does not mean the same product is purchasable in every region. Availability must be verified through specific brand stores, official developer docs, or regulatory notices.",
      limitsOrUnknowns: "Patent language is broad, translations can be rough, claims are complex, and implementation status is often unknown. Many patents are defensive and never appear in products. Lawsuit reporting also changes as courts move. This issue treats the lane as watchlist only, not confirmed product evidence.",
      productVerdict: "The patent-lane read is deliberately conservative: smart-glasses IP is dense enough that product managers should include patents and litigation in competitive scanning, but user value still has to be proven through purchasable products, real interactions, and source-backed claims. No patent in today's issue is presented as a launch fact."
    }
  })
];

const issue = {
  date: issueDate,
  timezone: "America/Toronto",
  zhTitle: "AI Daily 2026-07-05：Agent 开始争夺入口、权限和眼前屏幕",
  enTitle: "AI Daily 2026-07-05: Agents Fight for Entry Points, Permissions, and Screens in Front of Your Eyes",
  zhSummary: "Cloudflare 把 AI crawler 拆成 Search、Agent、Training；Acti 把 agent 放进键盘；MemoMind One、ZCode 与中国 AI 眼镜 OS 信号共同说明入口之争正在从 App 转向系统层。",
  enSummary: "Cloudflare separates AI crawler intent into Search, Agent, and Training; Acti puts agents into the keyboard; MemoMind One, ZCode, and China AI-glasses OS signals show the entry-point fight moving from apps into system layers.",
  tags: ["AI hardware", "agent UX", "smart glasses", "AI keyboard", "developer surface", "crawler policy", "China scan", "patent watch"],
  sourceTypes: lanes,
  zhPath: `./${issueDate}/zh/`,
  enPath: `./${issueDate}/en/`,
  sourcesPath: `./${issueDate}/sources.md`,
  coverStory: {
    topicId: "cloudflare-agent-crawler-controls",
    zhTitle: "Agent 不是一个按钮，而是一套新的访问关系",
    enTitle: "An agent is not a button; it is a new access relationship",
    imagePath: visuals.cloudflare.path,
    imageWidth: visuals.cloudflare.width,
    imageHeight: visuals.cloudflare.height,
    primarySourceUrl: "https://blog.cloudflare.com/content-independence-day-ai-options/",
    evidenceStrength: "developer surface · official product control",
    whyCover: "Cloudflare's Search/Agent/Training split turns AI access intent into product infrastructure.",
    zhSummary: [
      "今天的主线不是模型，而是入口：crawler、键盘、开发者 IDE、眼镜显示和 AIOS。",
      "Cloudflare 把 agent 访问从训练抓取里拆出来，迫使 AI 产品解释自己在替用户做什么。",
      "Acti、Cursor、ZCode 和 MemoMind One 显示 agent 正在进入键盘、手机、桌面和眼前屏幕。"
    ],
    enSummary: [
      "Today's main line is entry point, not model size: crawlers, keyboards, developer IDEs, eyewear displays, and AIOS.",
      "Cloudflare separates agent access from training crawls, forcing AI products to explain what they are doing for users.",
      "Acti, Cursor, ZCode, and MemoMind One show agents moving into keyboards, phones, desktops, and screens in front of the eyes."
    ],
    imageSourceUrl: "https://blog.cloudflare.com/content-independence-day-ai-options/"
  },
  topics,
  watchlistZh: [
    "Cloudflare 的 Search/Agent/Training 分类是否被主要 AI 公司稳定采用，尤其是用户代理访问被阻挡时的错误解释。",
    "Acti 是否能把第三方键盘权限、API skill、长按触发和结果回填做成普通用户敢用的低摩擦流程。",
    "MemoMind One Kickstarter 后续交付、户外显示、App 稳定性和无摄像头路线是否能形成真实日用场景。",
    "ZCode 是否用真实 repo、测试通过率、权限设计和长任务恢复证明 GLM-5.2 的 agentic coding 不是低价噱头。",
    "Rokid/YodaOS、雷鸟、夸克/通义等中国 AI 眼镜生态是否发布可复现的 AIOS API、隐私提示和服务闭环。"
  ],
  watchlistEn: [
    "Whether Cloudflare's Search/Agent/Training categories are adopted consistently by major AI companies, especially when user-delegated access is blocked.",
    "Whether Acti can make third-party keyboard permissions, API skills, hold gestures, and result insertion trustworthy for ordinary users.",
    "Whether MemoMind One's Kickstarter delivery, outdoor display, app stability, and camera-free positioning become a durable daily workflow.",
    "Whether ZCode proves GLM-5.2 agentic coding on real repositories through test pass rates, permission design, and long-task recovery.",
    "Whether Rokid/YodaOS, RayNeo, Quark/Tongyi, and other China AI-glasses ecosystems publish reproducible AIOS APIs, privacy indicators, and service closure."
  ]
};

await fs.mkdir(assetDir, { recursive: true });
await fs.mkdir(issueDir, { recursive: true });
for (const item of Object.values(visuals)) {
  await fs.writeFile(path.join(root, item.path), item.svg, "utf8");
}

const dataPath = path.join(root, "data", "issues.json");
const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const next = [...issues.filter((item) => item.date !== issueDate), issue].sort((a, b) => a.date.localeCompare(b.date));
await fs.writeFile(dataPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");

console.log(`Created ${issueDate}: ${topics.length} topics, ${new Set(topics.flatMap((item) => item.sources.map((source) => source.url))).size} unique sources, ${Object.keys(visuals).length} visuals.`);
