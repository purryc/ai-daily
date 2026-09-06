import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const surveyRoot = "/Users/hmi/Documents/Survey";
const date = "2026-09-06";
const previousDate = "2026-09-05";
const dataPath = path.join(root, "data", "issues.json");
const issueDir = path.join(root, date);
const deckDir = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${date}`);

const source = (label, url, type) => ({ label, url, type });
const visual = (file, altZh, altEn, captionZh, captionEn, sourceUrl) => ({
  path: `assets/${file}`,
  width: 1600,
  height: 900,
  kind: "self-drawn-source-traceable-diagram",
  altZh,
  altEn,
  captionZh,
  captionEn,
  sourceUrl
});

const switchbotUrl = "https://us.switch-bot.com/products/switchbot-ai-mindclip";
const switchbotPressUrl = "https://www.prnewswire.com/news-releases/switchbot-launches-ai-mindclip-a-wearable-ai-assistant-that-captures-ideas-promises-and-to-dos-at-ifa-2026-302864881.html";
const switchbotPrivacyUrl = "https://us.switch-bot.com/pages/privacy-policy";
const viaimUrl = "https://store.viaim.ai/pages/viamrise-pre-launch-page";
const viaimPressUrl = "https://www.prnewswire.com/news-releases/viaim-rise-receives-two-2026-ifa-innovation-awards-indiegogo-campaign-launches-september-8-302870702.html";
const ifaUrl = "https://www.ifa-berlin.com/press-releases";
const rayneoUrl = "https://www.rayneo.com/pages/rayneo-io-ai-glasses";
const rayneoCommunityUrl = "https://www.reddit.com/r/SmartGlasses/comments/1w7685v/inside_the_hardware_ai_a_rayneo_ama_with_gt_io/";

const svg = (title, subtitle, blocks, accent = "#10b981") => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <rect width="1600" height="900" fill="#f7f8f4"/>
  <rect x="56" y="54" width="1488" height="792" rx="28" fill="#ffffff" stroke="#d9ded7" stroke-width="3"/>
  <text x="100" y="132" font-family="Arial, sans-serif" font-size="46" font-weight="700" fill="#10231b">${title}</text>
  <text x="100" y="180" font-family="Arial, sans-serif" font-size="24" fill="#53645d">${subtitle}</text>
  ${blocks.map((b, i) => {
    const x = 100 + (i % 3) * 480;
    const y = 270 + Math.floor(i / 3) * 245;
    return `<rect x="${x}" y="${y}" width="390" height="170" rx="20" fill="#f2f6f1" stroke="${accent}" stroke-width="3"/><text x="${x + 24}" y="${y + 52}" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#10231b">${b[0]}</text><text x="${x + 24}" y="${y + 94}" font-family="Arial, sans-serif" font-size="22" fill="#53645d">${b[1]}</text><text x="${x + 24}" y="${y + 128}" font-family="Arial, sans-serif" font-size="20" fill="#53645d">${b[2]}</text>`;
  }).join("\n")}
  <text x="100" y="795" font-family="Arial, sans-serif" font-size="20" fill="#7d8983">SELF-DRAWN MECHANISM DIAGRAM · claims trace to cited source ledger · not a product render</text>
</svg>`;

const mindClipVisual = {
  path: "assets/switchbot-ai-mindclip-official-2026-09.jpg",
  width: 1200,
  height: 1200,
  kind: "source-backed-product-image",
  altZh: "SwitchBot AI MindClip 官方产品图",
  altEn: "SwitchBot AI MindClip official product image",
  captionZh: "官方产品图：SwitchBot AI MindClip；机制图另列为补充视觉。",
  captionEn: "Official product image: SwitchBot AI MindClip; the mechanism diagram is listed as supplementary visual evidence.",
  sourceUrl: switchbotUrl
};
const viaimVisual = visual(
  "viaim-rise-agent-earbuds-mechanism-2026-09.svg",
  "viaim Rise AI Agent 耳机与充电盒录音入口自绘图",
  "Self-drawn mechanism diagram for viaim Rise AI Agent Earbuds and recording case",
  "自绘机制图：耳机、充电盒、录音与 Agent 工作流，依据 viaim 预热页与 IFA 发布材料",
  "Self-drawn mechanism diagram: earbuds, case, recording, and Agent workflow based on viaim pre-launch and IFA release material",
  viaimUrl
);

const topic = ({ id, section, evidenceLabel, evidenceStrength, zhHeadline, enHeadline, zhFact, enFact, zhValue, enValue, zhHciLens, enHciLens, zhImplication, enImplication, sourceDate, visual: topicVisual, sources, dossier }) => ({
  id, section, dossierKind: evidenceLabel === "crowdfunding signal" ? "scan" : "product", evidenceLabel, evidenceStrength, zhHeadline, enHeadline, zhFact, enFact, zhValue, enValue, zhHciLens, enHciLens, zhImplication, enImplication, sourceDate, visual: topicVisual, sources, dossier: { zh: dossier.zh, en: dossier.en }
});

const todayTopics = [
  topic({
    id: "switchbot-ai-mindclip-wearable-memory", section: "official", evidenceLabel: "confirmed product", evidenceStrength: "official SwitchBot product page plus IFA launch release; plan and regional service limits remain", sourceDate: "2026-09-03", visual: mindClipVisual,
    zhHeadline: "SwitchBot AI MindClip 把‘记住’拆成可暂停、可检索的随身工作流", enHeadline: "SwitchBot AI MindClip turns remembering into a pausable, searchable wearable workflow",
    zhFact: "SwitchBot 在 IFA 2026 公布并开售 AI MindClip：夹式可穿戴录音设备，使用 Qwen，官方页列出 64GB、20 小时录音、300 分钟免费转写、任务与日历、AI Memory Search，并标注 USD 119.99 / CAD 159.99 / GBP 119.99 的 MSRP。",
    enFact: "SwitchBot announced and made AI MindClip available at IFA 2026: a clip-on wearable recorder using Qwen. Its official page lists 64GB, 20 hours of recording, 300 free transcription minutes, tasks and calendar, and AI Memory Search, with MSRP of USD 119.99, CAD 159.99, and GBP 119.99.",
    zhValue: "MindClip 的产品单位是‘把稍纵即逝的对话变成之后能找回的任务’，而非单纯录音。用户按设备或 App 开始、暂停、停止录制，闪烁灯显示状态；语音被转写成摘要、承诺、待办和提醒，随后通过 AI Memory Search 回到某个说法或上下文。它把夹式设备、手机 App、Qwen、日历与任务系统连成一条记忆链，也把隐私控制放在录制入口。但 300 分钟后的费用、语音上传位置、团队/家庭权限与长时间佩戴舒适度仍需实测。",
    enValue: "MindClip is a product for turning fleeting conversation into a task that can be retrieved later, not merely a recorder. The user starts, pauses, and stops recording on the device or in the app; a blinking light exposes the state. Speech becomes summaries, promises, to-dos, and reminders, while AI Memory Search brings back a phrase or context later. The clip, phone app, Qwen, calendar, and task system form one memory chain, with privacy controls placed at the recording entry. The cost after 300 free minutes, upload location, team or family permissions, and long-wear comfort still need testing.",
    zhHciLens: ["Input: 设备按键 + App", "State: 录制 / 暂停 / 停止", "Output: 摘要 + 待办", "Recovery: Memory Search + 日历"],
    enHciLens: ["Input: device control + app", "State: record / pause / stop", "Output: summaries + tasks", "Recovery: Memory Search + calendar"],
    zhImplication: "任何‘随身记忆’产品都要让用户知道录制是否在进行、免费额度还剩多少、内容去了哪里、哪些人可检索，以及错误摘要如何删除或改回原文。",
    enImplication: "Any wearable-memory product must show whether recording is active, how many free minutes remain, where content goes, who can search it, and how a wrong summary can be deleted or corrected back to source.",
    sources: [source("SwitchBot AI MindClip official product page", switchbotUrl, "official"), source("SwitchBot IFA 2026 launch release", switchbotPressUrl, "official"), source("SwitchBot privacy policy", switchbotPrivacyUrl, "official")],
    dossier: { zh: {
      productName: "SwitchBot AI MindClip（夹式可穿戴 AI 记录器，confirmed product）",
      productType: "MindClip 是一枚夹在衣物或随身物品上的 AI 录音与记忆设备，官方把它定位为工作、家庭、学习和日常生活中的 wearable AI assistant。它由设备、手机 App、Qwen、转写/摘要服务、AI Memory Search、任务和日历组成；官方发布材料称它在 IFA 2026 发布并从 9 月 3 日起可在 SwitchBot 官网购买。",
      interactionFlow: "用户按设备按钮或在 App 中开始、暂停、停止录音，设备闪烁灯显示 recording status。录音内容进入转写和摘要流程，系统提取 ideas、promises、to-dos、reminders 和 searchable memories；用户随后通过 AI Memory Search 查询某段对话或某个承诺，并把结果送入任务或日历。官方强调 user control，但没有完整展示录音前的同意提醒、多人会话授权、错误摘要的逐字回放和批量删除路径。",
      specsOrStack: "官方页列出 64GB、20 小时录音、300 分钟免费转写、Qwen、录音/暂停/停止、设备与 App 双入口、任务与日历、AI Memory Search 和多种颜色。MSRP 为 USD 119.99、CAD 159.99、GBP 119.99；购买后 Pro Plan 会按页面说明自动续订。芯片、麦克风数量、尺寸、重量、电池容量、充电时间、网络连接、模型端云分工、导出格式和 API source not stated。",
      useCases: "产品页覆盖会议、课堂、接送孩子、客户临时要求、通勤灵感、家庭承诺、待办提醒和日后查找上下文。夹式形态降低拿手机和佩戴耳机的动作成本，任务提取让录音不止停留在文件。需要更高谨慎的场景包括医疗、法律、敏感工作会议和多人对话；这些场景的同意、地区录音法和企业留存策略不能由产品页替用户决定。",
      painPointsSolved: "MindClip 针对三个可见摩擦：人会忘掉当下听到的承诺、录音文件很难在事后定位、以及会议后把内容手工整理为任务。按键、闪灯和 App 控制缩短进入与停止路径；Qwen 转写、摘要、任务和日历把一次捕捉接到后续执行；AI Memory Search 试图降低‘我记得说过，但找不到’的成本。它没有解决转写错误、额度收费、旁人同意、云端数据边界或持续佩戴舒适度。",
      newTech: "新技术是把 Qwen-powered conversational capture 与 memory retrieval、task extraction、calendar action 放进轻量夹式设备，并把录音控制做成设备与 App 双入口。它体现的产品趋势是‘记忆’不再是一个长期存档页，而是一个可搜索、可触发动作的个人数据层。官方没有披露模型版本、端侧能力、离线模式、数据保留和企业管理接口，不能把 Qwen 标注扩展成完整技术栈。",
      availability: "官方 IFA 发布材料写明 AI MindClip 9 月 3 日在 SwitchBot 官网可购买，MSRP 为 USD 119.99、CAD 159.99、GBP 119.99。美国官方产品页还标注 300 分钟免费转写，并说明 Pro Plan 会按促销条款自动续订；不同地区价格、税费、配送、语言和功能可能不同。",
      limitsOrUnknowns: "免费额度耗尽后的实际价格、录音是否持续依赖手机、网络断开后的缓存、数据处理地区、多人授权、企业账号、删除/导出、误识别率、真实 20 小时条件、麦克风与防风表现均 source not stated。产品存在录音法律与社会关系风险，闪灯是状态提示，不等于所有旁人都理解或同意。",
      productVerdict: "MindClip 是当前可购买的 wearable-memory product，产品链路比‘AI 录音笔’更完整，因为它把录音、摘要、任务、日历和检索接在一起。产品判断：confirmed product；价值取决于用户能否随时暂停、清楚理解费用与数据流，并在错误摘要后回到原始录音。下一关是连续佩戴、噪声转写、额度耗尽、多人同意和删除审计。"
    }, en: {
      productName: "SwitchBot AI MindClip, a clip-on wearable AI recorder and memory layer",
      productType: "MindClip is a clip-on AI recording and memory device for clothing or personal items. SwitchBot positions it as a wearable AI assistant for work, family, study, and daily life. The system includes the device, phone app, Qwen, transcription and summarisation, AI Memory Search, tasks, and calendar. The launch release says it became available through SwitchBot's website on September 3 at IFA 2026.",
      interactionFlow: "The user starts, pauses, and stops recording with the device or the app, while a blinking light exposes the recording state. The content enters transcription and summarisation, where the system extracts ideas, promises, to-dos, reminders, and searchable memories. The user can later ask AI Memory Search for a conversation or promise and send the result into a task or calendar. The official material emphasises user control, but it does not fully show pre-recording consent, multi-party permission, word-level replay, or bulk deletion.",
      specsOrStack: "The official page lists 64GB, 20 hours of recording, 300 free transcription minutes, Qwen, device and app controls for recording, tasks and calendar, and AI Memory Search. MSRP is USD 119.99, CAD 159.99, and GBP 119.99; the purchase page says the Pro Plan renews automatically under its promotional terms. Chip, microphone count, dimensions, weight, battery capacity, charge time, network path, edge/cloud split, export format, and API are source not stated.",
      useCases: "The product materials cover meetings, classes, school pickup, a client's last-minute request, commuting ideas, family promises, reminders, and later context retrieval. A clip reduces the action cost of reaching for a phone or wearing earbuds, while task extraction keeps a recording from remaining a dead file. Medical, legal, sensitive workplace meetings, and multi-party conversations require a higher bar: consent, local recording law, and enterprise retention policy cannot be delegated to the product page.",
      painPointsSolved: "MindClip targets three visible frictions: people forget promises, recordings are hard to locate later, and post-meeting organisation is manual. A button, light, and app shorten the start and stop path; Qwen transcription, summaries, tasks, and calendar connect capture to follow-through; and AI Memory Search reduces the cost of remembering that something was said but not finding it. It does not solve transcription error, quota billing, bystander consent, cloud boundaries, or all-day comfort.",
      newTech: "The novelty is product-level: Qwen-powered conversational capture joins memory retrieval, task extraction, and calendar action inside a small clip-on device, with recording control available on both hardware and app. It reflects a move from a static archive to a searchable personal-data layer that can trigger work. SwitchBot does not disclose the model version, edge capability, offline mode, retention policy, or enterprise controls, so Qwen must not be expanded into an invented stack.",
      availability: "SwitchBot's IFA release says AI MindClip became available through its website on September 3, with MSRP of USD 119.99, CAD 159.99, and GBP 119.99. The US product page lists 300 free transcription minutes and automatic Pro Plan renewal under the promotion terms. Regional tax, shipping, languages, and feature coverage may differ.",
      limitsOrUnknowns: "The actual post-quota price, whether recording works without a nearby phone, offline buffering, processing region, multi-party consent, enterprise accounts, deletion and export, recognition error, real 20-hour conditions, microphone performance, and wind handling are source not stated. Recording law and social trust remain part of the product risk; a blinking light is a status cue, not proof that every bystander understands or agrees.",
      productVerdict: "MindClip is a purchasable wearable-memory product with a more complete chain than an AI recorder because capture, summaries, tasks, calendar, and retrieval are connected. Verdict: confirmed product. Its value depends on pausing easily, understanding cost and data flow, and returning to source audio after a wrong summary. The next gate is long wear, noisy transcription, quota exhaustion, multi-party consent, and deletion auditability."
    }}
  }),
  topic({
    id: "viaim-rise-agent-earbuds-crowdfunding", section: "wild", evidenceLabel: "crowdfunding signal", evidenceStrength: "company pre-launch and PRNewswire announcement; Indiegogo campaign and retail delivery are future/unverified", sourceDate: "2026-09-05", visual: viaimVisual,
    zhHeadline: "viaim Rise 把充电盒变成录音入口，先把 agent 耳机放进众筹验证", enHeadline: "viaim Rise turns the charging case into a recording entry before crowdfunding validation",
    zhFact: "viaim 9 月 5 日宣布 Rise 获 IFA Innovation Awards，并确认 9 月 8 日 9:00 ET 在 Indiegogo 启动全球消费者众筹。其预热页把 Rise 定义为 AI Agent Earbuds：耳机或充电盒可开启录音，目标是把会议、电话和承诺转成可执行工作。",
    enFact: "On September 5, viaim said Rise had received IFA Innovation Awards and confirmed a global consumer crowdfunding campaign on Indiegogo for September 8 at 9:00 ET. Its pre-launch page calls Rise AI Agent Earbuds: either the earbuds or the charging case can start recording, with the goal of turning meetings, calls, and promises into actionable work.",
    zhValue: "Rise 的硬件判断很具体：用户不必打开盒子或拿手机，至少放入一只耳机时，充电盒就能成为录音入口；耳机再把反馈、通话和 Agent 结果送回耳边。它想解决的是‘关键内容发生在手边，但录音入口太远’与‘录音之后仍要手工拆任务’两层摩擦。由于众筹尚未开启，价格、最终规格、发货、软件额度、数据边界和真实准确率都不能写成已确认产品事实。",
    enValue: "Rise makes a concrete hardware bet: without opening the case or reaching for a phone, the user can start recording from the case when at least one earbud is inside; the earbuds then return calls, feedback, and Agent results to the ear. It targets the friction that important context happens while the recording entry is too far away, followed by the manual work of turning a recording into tasks. Because the crowdfunding campaign has not opened, price, final specifications, shipping, software quotas, data boundaries, and real accuracy cannot be treated as confirmed product facts.",
    zhHciLens: ["Input: 耳机 / 充电盒", "Context: 通话 + 会议", "Output: 耳边反馈", "Gate: Indiegogo 众筹"],
    enHciLens: ["Input: earbuds / charging case", "Context: calls + meetings", "Output: in-ear feedback", "Gate: Indiegogo campaign"],
    zhImplication: "耳机 agent 的关键 QA 是入口距离、录音可见性、双耳/单耳与盒子状态、通话和会议切换、Agent 动作确认，以及众筹延期后的退款与软件服务承诺。",
    enImplication: "The critical QA for earbud Agents is entry distance, recording visibility, one-earbud and case states, call/meeting switching, Agent action confirmation, and refund and service promises if crowdfunding slips.",
    sources: [source("viaim Rise pre-launch page", viaimUrl, "crowdfunding signal"), source("viaim Rise IFA announcement", viaimPressUrl, "crowdfunding signal"), source("IFA 2026 press releases", ifaUrl, "official")],
    dossier: { zh: {
      productName: "viaim Rise（AI Agent Earbuds，crowdfunding signal）",
      productType: "Rise 是 viaim 计划通过 Indiegogo 验证的 AI Agent 耳机系统，包含左右耳机与带录音入口的智能充电盒。官方叙事把它放在通话、会议、语音记录、摘要、任务和 Agent 执行之间；它获得 IFA 2026 音频与设计荣誉，但奖项和预热页都不能替代众筹后的交付证据。",
      interactionFlow: "用户可从耳机或充电盒开始录音，至少一只耳机放在盒中时，不必打开盒盖或拿手机就能触发。耳机负责听、说、通话与 Agent 反馈；系统目标是把语音内容转成转写、摘要、承诺、任务和后续动作。预热材料还强调 recording without gaps，但没有给出不同状态下的精确按键、灯光、声音反馈、取消、恢复或多人同意流程。",
      specsOrStack: "目前来源支持的栈是双耳耳机、智能充电盒、录音入口、AI Agent 工作流，以及 viaim 与 Bose 在主动降噪/声学方向的合作叙事。官方预热页没有稳定公开芯片、麦克风数量、存储、录音时长、电池、重量、蓝牙版本、编解码器、模型、端云分工、订阅或 API。众筹页面、最终 SKU、价格、地区和发货条件 source not stated。",
      useCases: "产品目标覆盖会议、电话、课堂、客户拜访、通勤灵感、承诺记录与需要快速跟进的语音片段。充电盒成为录音入口，适合手机不在手上或耳机尚未完整佩戴的瞬间；耳机可以把 Agent 结果放回耳边，减少查看屏幕。敏感会议、多人通话、医疗/法律信息和无网络场景需要单独验证，不能从 IFA 奖项推断合规或准确率。",
      painPointsSolved: "Rise 试图解决两层断裂：第一，录音入口离用户太远，等拿到手机时关键信息已经过去；第二，会议转写结束后还要人工找承诺、拆待办、回到工具。把录音按钮放进耳机和盒子可以缩短入口距离；Agent 则尝试把内容推向任务和执行。它没有证明续航、收音、旁人知情、误触、额度和延期后的服务边界。",
      newTech: "最具体的新交互是‘case-as-recorder’：智能充电盒从被动收纳变成可触发的工作入口。耳机、盒子、通话状态和 Agent 结果形成双设备状态机，这比把语音模型单独放在耳机里更强调入口连续性。由于产品仍在众筹前，Bose 声学合作、Agent 能力和未来工具连接只能按公开叙事记录，不能写成已经交付的技术指标。",
      availability: "viaim 在 9 月 5 日宣布 Indiegogo 将于 9 月 8 日 9:00 ET 启动 Rise 的全球消费者众筹。当前是预热与发布阶段，来源没有给出最终售价、批次、预计发货、退款政策、支持国家、运营商、语言、订阅或零售上架。",
      limitsOrUnknowns: "众筹是否按时开启、最终 SKU、价格、续航、录音条件、隐私指示、通话切换、模型费用、数据保存、中文与方言能力、Agent 可执行工具、Bose 合作的具体交付内容、独立评测和实际发货均 source not stated。奖项是设计/展会信号，不等于用户满意或产品可用性。",
      productVerdict: "Rise 是值得观察的 crowdfunding signal：入口设计很具体，充电盒录音让‘随手记’从耳边延伸到手边；但它还没有通过众筹、交付、退款、准确率和长期续航的现实关口。产品判断：保留在 wild lane，下一关是 Indiegogo 条款、最终价格、实机样品、状态反馈与录音/Agent 的撤销路径。"
    }, en: {
      productName: "viaim Rise, AI Agent Earbuds as a crowdfunding signal",
      productType: "Rise is an AI Agent Earbuds system that viaim plans to validate through Indiegogo, combining left and right earbuds with a smart case that also acts as a recording entry. The public story connects calls, meetings, voice capture, summaries, tasks, and Agent execution. It received IFA 2026 audio and design recognition, but an award and pre-launch page do not replace delivery evidence.",
      interactionFlow: "The user can start recording from an earbud or the case; with at least one earbud inside, the case can start a recording without opening it or reaching for a phone. The earbuds handle listening, calls, and Agent feedback. The intended flow turns speech into transcription, summaries, promises, tasks, and follow-up actions. The pre-launch material mentions recording without gaps but does not specify every button, light, sound cue, cancellation, recovery, or multi-party-consent state.",
      specsOrStack: "The current sources support a two-earbud system, a smart charging case, a recording entry, an AI Agent workflow, and a Bose collaboration narrative around active noise cancellation and acoustics. The pre-launch page does not provide stable chip, microphone count, storage, recording duration, battery, weight, Bluetooth version, codec, model, edge/cloud split, subscription, or API details. The campaign page, final SKU, price, regions, and shipping terms are source not stated.",
      useCases: "Target use cases include meetings, calls, classes, client visits, commuting ideas, promises, and voice fragments that need quick follow-through. A recording case is useful when the phone is not in hand or the earbuds are not fully worn; the earbuds can return Agent results to the ear without a screen. Sensitive meetings, multi-party calls, medical or legal information, and offline operation need separate verification and cannot be inferred from an IFA award.",
      painPointsSolved: "Rise addresses two breaks in the current chain: the recording entry is too far away and the finished transcript still requires manual extraction of promises and tasks. Putting the trigger in both earbuds and case shortens the first distance; the Agent attempts to move the content toward work. The product has not yet proved endurance, capture quality, bystander understanding, accidental triggers, quota economics, or service if the campaign slips.",
      newTech: "The concrete interaction novelty is case-as-recorder: a charging case becomes an active work entry instead of passive storage. Earbuds, case, call state, and Agent output form a two-device state machine, placing more emphasis on continuity than on putting a model inside an earbud alone. Because the product is pre-crowdfunding, the Bose acoustic collaboration and Agent tools remain public narratives, not delivered technical specifications.",
      availability: "On September 5, viaim said the global consumer Indiegogo campaign for Rise would launch on September 8 at 9:00 ET. The product is currently in a pre-launch and announcement phase; sources do not state final price, tiers, expected shipping, refund policy, supported countries, carrier, languages, subscription, or retail availability.",
      limitsOrUnknowns: "Whether the campaign opens on time, final SKU, price, endurance, recording conditions, privacy indicator, call switching, model cost, retention, Chinese and dialect performance, executable Agent tools, the exact delivered Bose collaboration, independent review, and real shipping are source not stated. An award is a design and show signal, not evidence of user satisfaction or product availability.",
      productVerdict: "Rise is a useful crowdfunding signal: the entry design is concrete, and a recording case extends quick capture from the ear to the hand. It has not passed the reality gates of crowdfunding terms, delivery, refunds, accuracy, and long endurance. Verdict: keep in the wild lane; the next gate is the Indiegogo contract, final price, a working sample, status feedback, and undo paths for recording and Agent actions."
    }}
  })
];

const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = structuredClone(issues.find((item) => item.date === previousDate));
if (!previous) throw new Error(`Missing previous issue ${previousDate}`);
const issue = structuredClone(previous);
issue.date = date;
issue.zhTitle = "AI Daily 2026-09-06：录音入口开始长在设备上，agent 进入现场状态";
issue.enTitle = "AI Daily 2026-09-06: Recording entries move into the device while Agents enter field state";
issue.zhSummary = "今天的新增把 IFA 的现场信号压缩成两条可验证产品路径：SwitchBot AI MindClip 已经把录音、Qwen 转写、任务、日历和 AI Memory Search 接到可购买的夹式设备；viaim Rise 则把智能充电盒做成录音入口，但要到 9 月 8 日才进入 Indiegogo，仍是 crowdfunding signal。VIVE Eagle、Doova、Sonos 27、RayNeo iO 和中国 lane 继续追踪零售、家庭安全、音频 OS、显示眼镜和社区摩擦。";
issue.enSummary = "Today’s additions reduce IFA’s field signal to two verifiable product paths: SwitchBot AI MindClip connects recording, Qwen transcription, tasks, calendar, and AI Memory Search in a purchasable clip-on device; viaim Rise turns its smart case into a recording entry but does not reach Indiegogo until September 8, so it remains a crowdfunding signal. VIVE Eagle, Doova, Sonos 27, RayNeo iO, and the China lane continue to track retail, home safety, audio OS, display glasses, and community friction.";
issue.tags = Array.from(new Set(["wearable memory", "AI earbuds", "AI hardware", "agentic devices", "HCI", ...issue.tags]));
issue.sourceTypes = Array.from(new Set([...issue.sourceTypes, "wearable memory", "AI Agent Earbuds", "crowdfunding signal"]));
issue.topics = [...todayTopics, ...issue.topics.filter((item) => !todayTopics.some((fresh) => fresh.id === item.id))];
issue.coverStory = {
  topicId: todayTopics[0].id,
  zhTitle: "MindClip 把‘记住’写成设备状态：录音、暂停、检索与下一步",
  enTitle: "MindClip writes remembering into device state: record, pause, retrieve, act",
  zhSummary: ["SwitchBot AI MindClip 已公开售价、容量、录音时长、免费转写与 Memory Search。", "录音状态可由设备闪灯和 App 控制，摘要结果继续流入任务与日历。", "免费额度、数据去向、多人同意和错误回放仍需真实使用验证。"],
  enSummary: ["SwitchBot AI MindClip publishes price, capacity, recording duration, free transcription, and Memory Search.", "The device light and app expose recording state while summaries flow into tasks and calendar.", "Quota cost, data destination, multi-party consent, and source-audio recovery still need real-use testing."],
  imagePath: mindClipVisual.path,
  imageWidth: mindClipVisual.width,
  imageHeight: mindClipVisual.height,
  imageSourceUrl: mindClipVisual.sourceUrl,
  primarySourceUrl: switchbotUrl,
  evidenceStrength: "confirmed product · official product page and IFA launch release · 2026-09-03",
  whyCover: "The wearable-memory category is moving from a passive recorder to a device state that must show capture, pause, search, cost, and recovery."
};
issue.designDesk = {
  zhTitle: "Design Desk：把‘记忆’与‘录音’做成可审计的现场状态",
  enTitle: "Design Desk: make memory and recording auditable field states",
  zhIntro: "MindClip 与 Rise 把一个很小的入口问题放大：系统何时在听、何时在整理、何时在执行，以及用户如何停止、纠错和删除。",
  enIntro: "MindClip and Rise enlarge a small entry problem: when the system is listening, organising, or acting, and how the user stops, corrects, and deletes it.",
  zhItems: [
    { label: "Record state", body: "录制、暂停、停止、上传、转写与搜索分开显示；闪灯不能替代可见的历史记录与删除入口。" },
    { label: "Quota state", body: "每次录音都要告诉用户免费分钟、付费触发、自动续订和组织账户限制。" },
    { label: "Consent state", body: "多人对话、电话、课堂和工作会议提供旁人知情与停止机制，不能只依赖设备外壳。" },
    { label: "Agent state", body: "摘要、待办、日历动作和外部工具调用分级确认，错误结果回到原始音频。" },
    { label: "Crowdfunding state", body: "众筹产品把目标、样机、批次、退款、延迟与软件服务分开写清楚。" },
    { label: "Memory state", body: "搜索、关系推断、导出和删除都留下审计；用户能暂停长期记忆，不必停用全部设备。" }
  ],
  enItems: [
    { label: "Record state", body: "Separate record, pause, stop, upload, transcription, and search; a light cannot replace visible history and deletion." },
    { label: "Quota state", body: "Every capture should expose free minutes, paid triggers, auto-renewal, and organisational-account limits." },
    { label: "Consent state", body: "Multi-party conversations, calls, classes, and meetings need bystander awareness and a stop path beyond the device shell." },
    { label: "Agent state", body: "Tier summaries, tasks, calendar actions, and external tools with confirmation; let wrong output return to source audio." },
    { label: "Crowdfunding state", body: "Crowdfunded products should separate targets, samples, batches, refunds, delays, and software service commitments." },
    { label: "Memory state", body: "Search, inference, export, and deletion need audit; users should pause long-term memory without disabling every device." }
  ]
};
issue.watchlistZh = ["SwitchBot MindClip：免费额度、自动续订、数据处理地区、多人同意、20 小时条件与删除审计。", "viaim Rise：9 月 8 日 Indiegogo 条款、最终价格、样机、退款、发货和 Agent 撤销。", ...issue.watchlistZh];
issue.watchlistEn = ["SwitchBot MindClip: free quota, auto-renewal, processing region, multi-party consent, 20-hour conditions, and deletion audit.", "viaim Rise: September 8 Indiegogo terms, final price, sample, refunds, shipping, and Agent undo.", ...issue.watchlistEn];
issue.sourcesPath = `./${date}/sources.md`;
issue.zhPath = `./${date}/zh/`;
issue.enPath = `./${date}/en/`;

const index = issues.findIndex((item) => item.date === date);
if (index >= 0) issues[index] = issue; else issues.unshift(issue);
await fs.writeFile(dataPath, `${JSON.stringify(issues, null, 2)}\n`);

await fs.mkdir(issueDir, { recursive: true });
await fs.cp(path.join(root, previousDate, "assets"), path.join(issueDir, "assets"), { recursive: true, force: true });
await fs.mkdir(path.join(issueDir, "assets"), { recursive: true });
await fs.writeFile(path.join(issueDir, "assets", "switchbot-ai-mindclip-mechanism-2026-09.svg"), svg("SwitchBot AI MindClip", "record → transcribe → remember → act", [["RECORD", "device + app", "light exposes state"], ["UNDERSTAND", "Qwen", "transcript + summary"], ["ACT", "tasks + calendar", "follow-through"], ["SEARCH", "AI Memory", "retrieve context"], ["CONTROL", "pause / stop", "user takeover"], ["BOUNDARY", "quota + consent", "source not stated"]]));
await fs.writeFile(path.join(issueDir, "assets", "viaim-rise-agent-earbuds-mechanism-2026-09.svg"), svg("viaim Rise", "earbud / case recording entry → Agent output", [["ENTRY", "earbud or case", "no phone reach"], ["CAPTURE", "calls + meetings", "recording state"], ["PROCESS", "Agent", "summary + tasks"], ["RETURN", "in-ear audio", "feedback"], ["GATE", "Indiegogo", "Sep 8 · future"], ["UNKNOWN", "price + ship", "source not stated"],], "#2563eb"));

await fs.mkdir(path.join(deckDir, "public", "assets"), { recursive: true });
await fs.cp(path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${previousDate}`, "public", "assets"), path.join(deckDir, "public", "assets"), { recursive: true, force: true });
await fs.cp(path.join(issueDir, "assets"), path.join(deckDir, "public", "assets"), { recursive: true, force: true });

const labels = { zh: ["产品", "产品是什么", "怎么用", "规格 / 系统栈", "使用场景", "解决痛点", "新技术", "可用性", "限制 / 未知", "产品判断"], en: ["Product", "What it is", "How it works", "Specs / stack", "Use cases", "Pain points", "New tech", "Availability", "Limits / unknowns", "Product read"] };
const fields = ["productName", "productType", "interactionFlow", "specsOrStack", "useCases", "painPointsSolved", "newTech", "availability", "limitsOrUnknowns", "productVerdict"];
const image = (t) => `./public/${t.visual.path}`;
const text = (locale, t) => fields.map((field, i) => `**${labels[locale][i]}** — ${t.dossier[locale][field]}`).join("\n\n");
const links = (t) => t.sources.map((s) => `[${s.label}](${s.url})`).join(" · ");
const slides = [
  `---\ntheme: default\ntitle: AI Daily ${date}\nlayout: cover\n---\n\n# AI Daily ${date}\n\n${issue.coverStory.zhTitle} / ${issue.coverStory.enTitle}\n\n<img src="${image(todayTopics[0])}" style="width:42%;height:54%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${issue.coverStory.evidenceStrength}**\n\n${issue.coverStory.zhSummary.join(" ")}\n\n${links(todayTopics[0])}`,
  `# Issue map\n\n**Cover** — ${issue.coverStory.zhTitle}\n\n**Today’s additions** — ${todayTopics.map((t) => t.zhHeadline).join("；")}。\n\n**Eight source lanes** — official · reviews · community · wild · research · patent · china · global。\n\n**Design Desk** — ${issue.designDesk.zhTitle}。\n\nThe public publisher carries the complete bilingual, paged 16:9 issue with source/date/evidence labels and PDF downloads.`,
  ...todayTopics.flatMap((t) => [`# ${t.zhHeadline}\n\n<img src="${image(t)}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${t.evidenceLabel} · ${t.evidenceStrength} · ${t.sourceDate}**\n\n${text("zh", t)}\n\n**Sources** — ${links(t)}`, `# ${t.enHeadline}\n\n<img src="${image(t)}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${t.evidenceLabel} · ${t.evidenceStrength} · ${t.sourceDate}**\n\n${text("en", t)}\n\n**Sources** — ${links(t)}`]),
  `# Design Desk / 设计洞察\n\n${issue.designDesk.zhItems.map((x, i) => `${i + 1}. **${x.label}** — ${x.body}`).join("\n\n")}\n\n${issue.designDesk.enItems.map((x, i) => `${i + 1}. **${x.label}** — ${x.body}`).join("\n\n")}`,
  `# Watchlist / 继续观察\n\n${issue.watchlistZh.map((x, i) => `${i + 1}. ${x}`).join("\n")}\n\n${issue.watchlistEn.map((x, i) => `${i + 1}. ${x}`).join("\n")}`,
  `# Source ledger\n\nEight lanes: official · reviews · community · wild · research · patent · china · global.\n\n${Array.from(new Set(issue.topics.flatMap((t) => t.sources.map((s) => s.url)))).slice(0, 40).map((url, i) => `${i + 1}. ${url}`).join("\n")}\n\nVisual evidence uses local source-traceable screenshots or clearly labelled self-drawn diagrams with contain positioning and white backgrounds.`
];
await fs.writeFile(path.join(deckDir, "package.json"), JSON.stringify({ scripts: { build: "slidev build --base ./ --out dist" }, dependencies: { "@slidev/cli": "^0.50.0", "@slidev/theme-default": "^0.25.0", vue: "^3.4.0" } }, null, 2) + "\n");
await fs.writeFile(path.join(deckDir, "slides.md"), slides.join("\n\n---\n\n") + "\n");
const allSources = Array.from(new Map(issue.topics.flatMap((t) => t.sources).map((s) => [s.url, s])).values());
const laneRows = ["official", "reviews", "community", "wild", "research", "patent", "china", "global"].map((lane) => `| ${lane} | ${issue.topics.some((t) => t.section === lane) ? "covered" : "scan required"} | ${issue.topics.filter((t) => t.section === lane).map((t) => t.id).join(", ") || "source-lane scan"} |`).join("\n");
const visualRows = issue.topics.map((t) => `| ${t.id} | \`${t.visual.path}\` | ${t.visual.sourceUrl} | ${t.evidenceLabel} |`).join("\n");
await fs.writeFile(path.join(deckDir, "sources.md"), `# AI Daily ${date} source ledger\n\n## Source index\n\n${allSources.map((s, i) => `${i + 1}. ${s.label} — ${s.url} — ${s.type || "source not stated"}`).join("\n")}\n\n## Source-lane coverage\n\n| lane | status | topics |\n| --- | --- | --- |\n${laneRows}\n\n## Visual asset index\n\n| topic | asset | source | evidence |\n| --- | --- | --- | --- |\n${visualRows}\n\n## Evidence rules\n\n- Official product pages support confirmed product claims only where stated.\n- Reviews and community pages provide friction signals, not universal behaviour.\n- Startup, crowdfunding, research, and patent material remains explicitly downgraded.\n- Missing specs, prices, dates, availability, quotes, and APIs are written as source not stated.\n- Visuals use object-fit: contain, object-position: center, white backgrounds, and no page-internal scrolling.\n- Chinese and English dossier fields carry the same information units; English is not a compressed summary.\n`);
console.log(JSON.stringify({ date, topics: issue.topics.length, added: todayTopics.length, sources: new Set(issue.topics.flatMap((t) => t.sources.map((s) => s.url))).size, visuals: new Set(issue.topics.map((t) => t.visual.path)).size, deckDir }));
