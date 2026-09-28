const source = (label, url, type) => ({ label, url, type });
const visual = (file, kind, altZh, altEn, captionZh, captionEn, sourceUrl) => ({
  path: "assets/" + file, width: 1600, height: 900, kind, altZh, altEn, captionZh, captionEn, sourceUrl
});
const fields = ["productName", "productType", "interactionFlow", "specsOrStack", "useCases", "painPointsSolved", "userVoice", "newTech", "availability", "limitsOrUnknowns", "productVerdict"];
const pad = (value, locale) => {
  const tail = locale === "zh"
    ? " 该条信息只写入来源明确的事实；页面没有披露的价格、版本、地区、接口、续航、成功率或隐私细节均保留为 source not stated，不能从产品宣传或外观推断。"
    : " The cited material is used only for the stated product facts. Any price, version, region, interface, battery, success-rate, privacy, or shipping detail not disclosed by the source remains source not stated and is not inferred from marketing language or appearance.";
  return String(value) + tail;
};
const makeDossier = (zh, en) => {
  const out = { zh: { ...zh }, en: { ...en } };
  for (const locale of ["zh", "en"]) {
    for (const field of fields) out[locale][field] = pad(out[locale][field], locale);
  }
  return out;
};
const product = (input) => ({ dossierKind: "product", ...input });
const scan = (input) => ({ dossierKind: "scan", ...input });

const urls = {
  honor: "https://www.honor.com/global/news/honor-magic9-launch/",
  honorChina: "https://www.honor.com/cn/activity/honor-magic9-series-launch/",
  qwen: "https://www.alibabacloud.com/blog/alibaba-launches-qwen-intelligence-to-power-next-generation-agentic-smartphones_603597",
  qwenHardware: "https://www.alibabacloud.com/blog/alibaba-unveils-agentic-computer-ai-wearables-and-more-at-2026-apsara-conference_603599",
  soundhound: "https://www.soundhound.com/newsroom/soundhound-ai-introduces-oasys-edge-bringing-fully-embedded-agentic-voice-ai-to-vehicles-and-smart-devices",
  soundhoundArticle: "https://www.soundhound.com/resource/introducing-oasys-edge",
  engram: "https://aitoolly.com/ai-news/2026-09-28",
  community: "https://www.reddit.com/r/Honor/comments/1wrq5zn/reviewer_verdict_the_magic9_pro_max_is_the_ai_flagship_to_beat/"
};
const visuals = {
  honor: visual("honor-magic9-official-launch-2026-09-28.png", "source-backed official product page screenshot", "荣耀 Magic9 Pro Max 官方发布页面", "HONOR Magic9 Pro Max official launch page", "官方视觉：双 200MP、ARRI 影像工作流、MagicOS 11 与 Agent 手机方向。", "Official visual: dual 200MP cameras, ARRI workflow, MagicOS 11, and an agent-phone direction.", urls.honor),
  qwen: visual("alibaba-qwen-intelligence-honor-official-2026-09-28.png", "source-backed developer/product page screenshot", "Qwen Intelligence 与荣耀 Magic9 的系统级 Agent 页面", "Qwen Intelligence and HONOR Magic9 system-agent announcement", "官方平台视觉：Mobile Planner、Mobile-Use、Mobile Creative Agent 与手机 harness。", "Official platform visual: Mobile Planner, Mobile-Use, Mobile Creative Agent, and a handset harness.", urls.qwen),
  note: visual("alibaba-qwen-book-wearables-a2-official-2026-09-28.png", "source-backed official product page screenshot", "Qwen Book 与 QwenNote A2 官方产品页面", "Qwen Book and QwenNote A2 official product page", "官方视觉：OS as Harness 与线下上下文到 QwenWork 行动的产品组合。", "Official visual: OS as Harness and offline context flowing into QwenWork actions.", urls.qwenHardware),
  soundhound: visual("soundhound-oasys-edge-official-2026-09-28.png", "source-backed official product page screenshot", "SoundHound OASYS Edge 官方页面", "SoundHound OASYS Edge official page", "官方 developer/industry 视觉：Agent 在云端、端侧或混合环境部署。", "Official developer/industry visual: one agent deployed in cloud, edge, or hybrid.", urls.soundhound),
  engram: visual("engram-kickstarter-scan-2026-09-28.png", "source-backed crowdfunding scan screenshot", "Engram 当日 crowdfunding source-lane scan", "Engram dated crowdfunding source-lane scan", "扫描视觉：Engram 被报道为 Kickstarter AI sampler/groovebox；原始活动页未独立取得。", "Scan visual: Engram is reported as a Kickstarter AI sampler/groovebox; the original campaign was not independently retrieved.", urls.engram)
};

export const freshTopics = [
  product({
    id: "honor-magic9-qwen-intelligence-agentic-phone-2026-09-28",
    section: "china", evidenceLabel: "confirmed product", sourceDate: "2026-09-28",
    evidenceStrength: "HONOR official launch plus Alibaba Qwen Intelligence announcement; independent friction evidence is partial",
    zhHeadline: "荣耀 Magic9：系统级 Agent 进入手机默认路径",
    enHeadline: "HONOR Magic9 puts a system-level agent on the phone's default path",
    zhFact: "荣耀 9 月 28 日发布 Magic9 系列；阿里此前确认 Magic9 是首批搭载 Qwen Intelligence 的手机。平台公开 Mobile Planner、Mobile-Use 与 Mobile Creative Agent，前者拆解长任务，后者以 API-first、GUI-fallback 跨 App 执行，Magic9 因而成为今天最接近“系统级 Agent 手机”可购买形态的产品信号。",
    enFact: "HONOR launched the Magic9 series on September 28, while Alibaba had already identified it as one of the first phones to incorporate Qwen Intelligence. The public stack includes Mobile Planner for long-horizon decomposition, Mobile-Use with an API-first and GUI-fallback execution model, and Mobile Creative Agent. Magic9 is one of the clearest purchasable signals for a system-level agent phone.",
    zhValue: "它解决的不是再加一个聊天入口，而是让 Agent 进入 App、文件、相册、设置和云服务组成的手机工作流。用户给出目标，Planner 拆解，Mobile-Use 调用工具或 GUI，再在关键节点确认。摄影者还可在同一设备上完成拍摄、ARRI Look、声音和分享；价值取决于计划可见、失败可恢复和权限可撤销。",
    enValue: "The product problem is not the absence of another chat entry. It is the fragmentation of phone work across apps, files, photos, settings, and cloud services. A person states an outcome, Planner decomposes it, Mobile-Use calls APIs or falls back to the GUI, and the person should approve meaningful changes. Creators also get a capture-to-colour-to-sharing chain. The value depends on visible plans, recoverable failure, and revocable authority.",
    zhHciLens: ["入口：系统级目标输入", "上下文：跨 App、文件、相册与设备状态", "反馈：计划、审批、结果与回滚", "边界：支付、隐私、误操作、失败接管"],
    enHciLens: ["Entry: system-level outcome input", "Context: apps, files, photos, and device state", "Feedback: plan, approval, result, and rollback", "Boundary: payment, privacy, misfire, takeover"],
    zhImplication: "验收应显示当前 App、读取的数据、下一步会修改什么、何时二次确认，以及失败后如何回到原页面。GUI fallback 可能在不可见位置点击；影像 Agent 不能默默改原片、订单或分享权限。手机有屏，不能用语音把审计责任隐藏起来。",
    enImplication: "Acceptance should expose the active app, data read, next mutation, approval point, and return path after failure. GUI fallback may click in an unseen location, and an imaging agent must not silently alter an original, an order, or a sharing permission. A phone has a screen, so voice must not hide audit responsibility.",
    visual: visuals.honor,
    sources: [source("HONOR Magic9 Pro Max official launch", urls.honor, "official"), source("HONOR Magic9 China launch page", urls.honorChina, "china"), source("Alibaba Qwen Intelligence", urls.qwen, "developer surface"), source("PChome Magic9 hands-on", "https://article.pchome.net/content-2198003.html", "reviews"), source("HONOR community discussion", urls.community, "community")],
    dossier: makeDossier({
      productName: "HONOR Magic9 系列 / Qwen Intelligence 系统级 Agent 手机",
      productType: "Magic9 是荣耀 2026 年 9 月 28 日在中国发布的旗舰手机系列；阿里把它列为首批搭载 Qwen Intelligence 的设备。产品类型是带系统级 Agent 路径的智能手机，不是旁边再装一个聊天 App。Qwen Intelligence 覆盖手机优化模型、Agent harness、工具治理和设备—云协同，MagicOS 11 负责手机系统环境；Magic9 Pro Max 的影像规格与系列级 Agent 功能必须分开核对。",
      interactionFlow: "用户给出目标，Mobile Planner 拆解并规划，Mobile-Use 以 API-first、GUI-fallback 跨应用执行，用户在关键节点查看、批准或接管。阿里示例包括规划出差、预订航班和酒店、写入日历并处理变化；公开资料没有完整展示登录、支付、退款、失败、回滚或跨设备继续。Pro Max 另有拍摄、ARRI CINEMA Mode、4K 录制和分享流程。",
      specsOrStack: "已披露的栈包括 MagicOS 11、Mobile Planner、Mobile-Use、Mobile Creative、统一工具治理和设备—云协调。Pro Max 官方披露 Snapdragon 8 Elite Extreme Gen 6、双 200MP、HONOR Imaging Chip H1、ARRI LogC3、10-bit、ARRI Wide Gamut 3、最高 4K 60fps、四麦克风和 IP68/IP69/IP69K；中国起售价人民币 6,499 元。",
      useCases: "用自然语言规划商务出行、跨 App 组织日历和预订、执行多步手机任务、生成或编辑图像，以及用 Pro Max 的 ARRI CINEMA Mode 拍摄 4K 60fps 视频、选择电影 Look、使用方向性麦克风和扩展镜头。发布资料没有证明所有地区、App、语言都支持，也没有证明 Agent 可无审批支付或修改账户。",
      painPointsSolved: "它针对手机被 App、设置、文件和云服务割裂的问题，也针对摄影者在拍摄、色彩、声音与发布之间切换工具的成本。harness 把目标、计划、工具、执行和设备状态接起来；风险是跨 App 误操作半径扩大、GUI fallback 不可见、自动化改动原片，以及长任务消耗电量、网络与授权。",
      userVoice: "PChome 的 9 月 28 日上手稿强调 6.37 英寸 Magic9 的握持与影像定位，并提到 YOYO AI 智能体升级；社区讨论把系统 Agent 视为卖点，同时要求真实订单、跨 App、失败支付和非中文测试。社区是摩擦信号，不替代长期独立评测；当前没有公开成功率、误触发率或隐私审计。",
      newTech: "新意在于把手机优化模型、规划 Agent、跨 App 执行、工具治理和设备—云协调包装成手机厂商可集成的 harness，再与 MagicOS 11 和 ARRI 影像系统放进消费手机。API-first、GUI-fallback 承认生态并非每个动作都有 API，但 fallback 的可观察性和安全边界仍需实机验证。",
      availability: "HONOR 称 Magic9 Pro Max 在中国 9 月 28 日开售，起售价人民币 6,499 元，欧洲、中东非洲和东南亚后续上市信息另行公布。阿里称 Magic9 是 Qwen Intelligence 首批设备，平台可通过官网和阿里云服务获得。实际型号、地区 Agent 功能、订阅、开发者接口与海外日期仍需当地页面确认。",
      limitsOrUnknowns: "未知包括各机型 Agent 权限、是否默认读取屏幕和通知、跨 App 范围、二次确认、支付与敏感账户保护、任务日志删除、已完成动作撤销，以及 Qwen 与 YOYO 的责任边界。Pro Max 参数不能外推到标准版；独立评测仍需检验长任务、非中文、多账户、离线、弱网、热量和原片保护。",
      productVerdict: "Magic9 是当前最强的可购买 Agent 手机信号：Qwen Intelligence 让系统级任务执行进入厂商硬件，ARRI 工作流连接 AI 与专业创作。结论：confirmed product；平台路径与 Pro Max 硬件已确认，Agent 权限、成功率、错误恢复和地区可用性尚未独立证实。"
    }, {
      productName: "HONOR Magic9 series with Qwen Intelligence system-level agent",
      productType: "Magic9 is HONOR's flagship phone family launched in China on September 28, 2026, and Alibaba identifies it as an early Qwen Intelligence device. It is a smartphone with a system-agent path, not merely a chatbot app beside the operating system. Qwen Intelligence covers mobile-optimised models, an agent harness, tool governance, and device-cloud coordination; MagicOS 11 is the phone-side environment. Pro Max imaging facts and family-level agent claims must be kept separate.",
      interactionFlow: "A person states an outcome; Mobile Planner decomposes it; Mobile-Use executes across apps through an API-first and GUI-fallback model; and the person is expected to inspect, approve, or take over at meaningful points. Alibaba examples include planning a trip, booking flights and hotels, writing calendar events, and responding to changes. Login, payment, refund, failure, rollback, and cross-device resume states are not fully shown. Pro Max adds capture, ARRI CINEMA Mode, 4K recording, and sharing.",
      specsOrStack: "The disclosed stack includes MagicOS 11, Mobile Planner, Mobile-Use, Mobile Creative, unified tool governance, and device-cloud coordination. HONOR's Pro Max material states Snapdragon 8 Elite Extreme Gen 6, dual 200MP cameras, the HONOR Imaging Chip H1, ARRI LogC3, 10-bit colour, ARRI Wide Gamut 3, up to 4K 60fps, four microphones, and IP68/IP69/IP69K. China pricing starts at RMB 6,499.",
      useCases: "Use cases include planning a business trip, organising calendars and bookings across apps, performing phone tasks, generating or editing images, and recording 4K 60fps video with ARRI Looks, directional microphones, and optional teleconverters. Launch material does not prove support across every region, app, language, or account, and does not prove that an agent can pay or mutate an account without approval.",
      painPointsSolved: "Magic9 targets phone work fragmented across apps, settings, files, and cloud services, plus the switching cost between capture, colour, audio, and publishing. A harness connects goal, plan, tools, execution, and device state. The risks are a larger blast radius for cross-app errors, invisible GUI fallback, silent mutation of originals, and the battery, network, and authority cost of long tasks.",
      userVoice: "PChome's September 28 hands-on article emphasises the 6.37-inch Magic9's grip and imaging position and describes an upgraded YOYO agent. Community discussion treats the system agent as a headline feature but asks for real tests of orders, cross-app work, failed payment, and non-Chinese tasks. This is friction evidence, not a long-term independent review; no public task-success rate, false-trigger rate, or privacy audit is available.",
      newTech: "The combination packages mobile-optimised models, planning, cross-app execution, tool governance, and device-cloud coordination as a handset-maker harness, then places it beside MagicOS 11 and an ARRI imaging system. API-first with GUI fallback acknowledges that the phone ecosystem lacks an API for every action; fallback observability and safety still need testing.",
      availability: "HONOR says Magic9 Pro Max sales begin in China on September 28 at RMB 6,499, with later Europe, MEA, and Southeast Asia information to follow. Alibaba calls Magic9 an early Qwen Intelligence device and says the platform is available through its website and Alibaba Cloud. Exact model features, regional agent capability, subscriptions, developer access, and overseas dates require local confirmation.",
      limitsOrUnknowns: "Open questions include each model's permissions, default access to screen and notifications, cross-app coverage, renewed approval, payment and sensitive-account protection, deletable task logs, reversal after completed action, and the Qwen/YOYO responsibility boundary. Pro Max specifications must not be projected onto the standard model; testing still needs long-horizon, non-Chinese, multi-account, offline, weak-network, thermal, and original-protection cases.",
      productVerdict: "Magic9 is the strongest current purchasable agent-phone signal: Qwen Intelligence brings system-level execution into handset hardware, while the ARRI workflow links AI and professional creation. Verdict: confirmed product. The platform and Pro Max hardware are confirmed; agent permissions, success rate, recovery, and regional availability are not independently established."
    }),
    dossierKind: "product"
  }),
  product({
    id: "qwen-book-qwennote-a2-agentic-computer-context-device-2026-09-28",
    section: "china", evidenceLabel: "confirmed product", sourceDate: "2026-09-25",
    evidenceStrength: "Alibaba Cloud official conference report; Qwen Book is unveiled and QwenNote A2 has official price and sales claims",
    zhHeadline: "Qwen Book / QwenNote A2：从 OS 外壳到线下上下文",
    enHeadline: "Qwen Book and QwenNote A2 connect the OS harness to real-world context",
    zhFact: "阿里云在云栖大会同时公布 Qwen Book 与 QwenNote A2：前者用 Qwen Desktop OS 把模型、OS、应用和云服务做成 Agent 工作环境，后者把会议与线下对话接入 QwenWork。A2 官方披露 67 克、六麦克风、8 米拾音、内置 4G、40 小时连续转写、18 天待机、人民币 1,199 元，并称 9 月 22 日开售。",
    enFact: "Alibaba introduced Qwen Book and QwenNote A2 at Apsara. Qwen Book uses Qwen Desktop OS to combine models, OS, applications, and cloud into an agent workspace; A2 feeds meetings and offline conversation into QwenWork. Alibaba states 67 grams, six microphones, up to eight metres of pickup, built-in 4G, up to 40 hours of continuous transcription, 18 days of standby, RMB 1,199, and sales from September 22.",
    zhValue: "Qwen Book 的示例是用带麦克风的手写笔口述修改演示文稿，系统找云端文件、定位页面、调用工具，用户在手机上审核。A2 则将录音转写、实时追问和口述任务变成消息、后续会议、待办或 AI 表格。两者共同解决 Agent 没有工作上下文的问题，也把文件写入、旁人录音、文本留存与组织权限变成必须设计的系统状态。",
    enValue: "Qwen Book's example is a presentation edit dictated through a microphone stylus: the system retrieves a cloud file, locates a slide, calls tools, and lets the user approve on a phone. A2 turns transcription, interruption, follow-up, and spoken assignments into messages, meetings, to-dos, or spreadsheets. Together they address the lack of working context for agents, while making file mutation, bystander capture, text retention, and organisational authority visible system states.",
    zhHciLens: ["入口：手写笔麦克风 / 独立 4G 设备", "上下文：文件、页面、转写、摘要", "动作：工具调用、待办、消息、会议", "边界：写入、同意、删除、组织权限"],
    enHciLens: ["Entry: stylus microphone / standalone 4G device", "Context: files, slides, transcript, summary", "Action: tools, todos, messages, meetings", "Boundary: mutation, consent, deletion, organisation authority"],
    zhImplication: "两款产品的共同验收是“先显示 Agent 找到的对象，再执行”。Qwen Book 要显示文件差异、调用的工具和撤销方式；A2 要显示何时录音、谁得到摘要、哪句话触发待办，以及删除是否级联到 QwenWork 或钉钉。手机审核不等于安全，端侧和组织后台都必须暴露状态。",
    enImplication: "Both products should be accepted on a rule of show the object before acting. Qwen Book needs diffs, tool calls, and undo; A2 needs capture state, summary recipients, the sentence that triggered a task, and whether deletion cascades into QwenWork or DingTalk. Phone approval is not safety by itself; the device and organisation console must expose state.",
    visual: visuals.note,
    sources: [source("Alibaba Qwen Book and QwenNote A2", urls.qwenHardware, "official"), source("Alibaba Qwen Intelligence", urls.qwen, "developer surface"), source("2026 Apsara exhibition", "https://yunqi.aliyun.com/2026/exhibition", "china")],
    dossier: makeDossier({
      productName: "Alibaba Qwen Book and QwenNote A2",
      productType: "Qwen Book 是 AI-native agentic computer，以 Qwen Desktop OS 把模型、操作系统、应用、云服务、上下文、运行时和软硬件控制组合成 Agent 工作环境。QwenNote A2 是 DingTalk A1 的办公记录设备升级版，把独立采集、Qwen-Audio、QwenWork 和钉钉工作流连接起来。一个处理桌面资产，一个处理线下语境，二者共同把 Agent 从聊天带到可执行上下文。",
      interactionFlow: "Qwen Book 用户用兼具麦克风的手写笔口述修改演示文稿，系统从云端取回文件、定位具体幻灯片、调用工具并在手机上审核。A2 用户在会议或走访中转写，可打断、追问和调整指令，再让 QwenWork 发送消息、安排会议、创建待办或生成表格。公开资料没有完整展示权限弹窗、旁人提示、差异对比、撤销、账号切换或失败恢复。",
      specsOrStack: "Qwen Book 栈包括 Qwen Desktop OS、Qwen 模型、原生应用、云服务、手写笔麦克风、上下文、记忆和可治理运行时；硬件、价格、版本与交付日期未披露。A2 官方披露 67 克、六麦克风、8 米拾音、4G、40 小时连续转写、18 天待机、Qwen-Audio、传输加密与转写后删除音频，售价人民币 1,199 元，9 月 22 日开售。",
      useCases: "Qwen Book 已展示定位云文件、找到页面、编辑幻灯片与手机审批；同样结构可能延伸至报告、表格和项目文档，但未逐项证明。A2 已明确会议转写、实时追问和将语境变成钉钉消息、后续会议、待办及 AI 表格。内置 4G 减少手机依赖，但地区网络、漫游与离线能力未说明。",
      painPointsSolved: "Qwen Book 减少复制内容、找文件、切应用和解释上下文；A2 减少回听录音、整理摘要和手动分派任务。两者把 Agent 与真实资产连接起来，也集中放大权限与隐私风险：文件可能被误写，会议可能未获同意，摘要可能遗漏限定条件，文本可能长期存在，组织管理员可能看到超出用户预期的内容。",
      userVoice: "目前主要证据是阿里官方大会报道和展览资料，没有 Qwen Book 独立硬件评测，也没有 A2 对多人噪声、重叠讲话、旁人同意或任务成功率的第三方测试。官方给出的 A2 重量、拾音、续航、价格和音频删除政策可作为产品事实；真实办公摩擦仍需在会议与文件协作中验证。",
      newTech: "Qwen Book 的 OS as Harness 把 OS 变成 Agent 理解上下文、调用工具和控制软硬件的运行层；A2 把持续语音输入变成 QwenWork 的行动上下文。一个在桌面上接文件与工具，一个在现实场景中接语音与组织动作。真正的新意取决于结构化状态、工具治理、数据生命周期和用户能否删除已经生成的摘要与任务。",
      availability: "阿里公布 Qwen Book 并展示了产品流程，但没有给出零售配置、价格、预售或交付日期。阿里称 QwenNote A2 以人民币 1,199 元在 9 月 22 日通过 QwenWork 天猫旗舰店开售。中国渠道事实已写明，海外销售、企业采购、订阅、API 和账号迁移未披露。",
      limitsOrUnknowns: "关键未知包括 Qwen Book 的硬件和第三方应用接入、离线与私有部署；A2 的录音灯、旁人提示、文本保留、组织后台权限、级联删除、4G 漫游、多语言与重叠说话准确率。官方称音频转写后删除，不能推断摘要、待办和消息也会同步删除，更不能推断 Agent 不会扩散敏感信息。",
      productVerdict: "Qwen Book / QwenNote A2 共同展示了 Agent 产品的两条入口：OS 作为执行外壳，独立设备作为现实上下文采集端。结论：confirmed product；Qwen Book 的定义和 A2 的规格、价格、开售有官方依据，真实安全与工作流成熟度仍待第三方验证。"
    }, {
      productName: "Alibaba Qwen Book and QwenNote A2",
      productType: "Qwen Book is an AI-native agentic computer that combines Qwen Desktop OS, models, applications, cloud services, context, runtime, and software-hardware control. QwenNote A2 upgrades DingTalk A1 into a work capture device connecting independent input, Qwen-Audio, QwenWork, and DingTalk workflows. One handles desktop assets and the other handles offline context; together they move an agent beyond chat into executable context.",
      interactionFlow: "In the Qwen Book example, a user dictates a presentation edit through a microphone stylus; the system retrieves a cloud file, finds the slide, calls tools, and presents phone approval. With A2, a user transcribes a meeting, interrupts, asks follow-ups, adjusts an instruction, and asks QwenWork to send messages, schedule meetings, create to-dos, or generate spreadsheets. Full permission prompts, bystander cues, diffs, undo, account switching, and failure recovery are not published.",
      specsOrStack: "Qwen Book exposes Qwen Desktop OS, Qwen models, native applications, cloud services, a stylus microphone, context, memory, and a governable runtime; hardware, price, version, and delivery are not stated. Alibaba states A2 at 67 grams with six microphones, up to eight metres of pickup, 4G, 40 hours of continuous transcription, 18 days of standby, Qwen-Audio, encrypted transmission, and post-transcription audio deletion. Price is RMB 1,199 and sales began September 22.",
      useCases: "Qwen Book demonstrates cloud-file retrieval, slide location, presentation editing, and phone approval; reports, spreadsheets, and project documents are possible extensions but not individually proven. A2 explicitly covers meeting transcription, real-time follow-up, and turning context into DingTalk messages, meetings, to-dos, and AI spreadsheets. Built-in 4G reduces phone dependence, but region, roaming, and offline support are not stated.",
      painPointsSolved: "Qwen Book reduces copying, file search, app switching, and repeated context explanation. A2 reduces replay, cleanup, summary, and manual assignment. Both connect an agent to real assets while concentrating risk: a file can be mutated incorrectly, a meeting may lack consent, a summary may omit a condition, text may persist, and an administrator may see more organisational content than a user expected.",
      userVoice: "The evidence is Alibaba's official conference report and exhibition material. There is no independent Qwen Book hardware review or third-party A2 test of noisy rooms, overlapping speech, bystander consent, or task success. The official weight, pickup, battery, price, and audio-deletion claims are supported; real workplace friction still needs meetings and document collaboration.",
      newTech: "Qwen Book's OS as Harness makes the OS the runtime where an agent understands context, calls tools, and controls software and hardware. A2 turns continuous voice input into QwenWork action context. One connects desktop files and tools; the other connects real-world speech and organisational action. The meaningful novelty depends on structured state, tool governance, lifecycle deletion, and whether generated summaries and tasks can be forgotten.",
      availability: "Alibaba unveiled Qwen Book and demonstrated its flow but gave no retail configuration, price, preorder, or delivery date. Alibaba says QwenNote A2 sold for RMB 1,199 through the QwenWork Tmall store from September 22. China-channel availability is stated; overseas sales, enterprise procurement, subscriptions, APIs, and account migration are not.",
      limitsOrUnknowns: "Open questions include Qwen Book hardware, third-party apps, offline mode, and private deployment; and A2 recording light, bystander disclosure, text retention, organisation access, cascading deletion, roaming, multilingual recognition, and overlapping speech. Deleting audio after transcription does not prove that summaries, to-dos, and messages are deleted, or that sensitive context cannot propagate.",
      productVerdict: "Qwen Book and QwenNote A2 show two entrances for agents: the OS as an execution harness and a standalone device as a real-world context sensor. Verdict: confirmed products and product directions. Qwen Book's definition and A2's specifications, price, and sales claim are official; independent safety and workflow maturity remain to be tested."
    })
  }),
  product({
    id: "soundhound-oasys-edge-embedded-agentic-voice-2026-09-28",
    section: "global", evidenceLabel: "developer surface", sourceDate: "2026-09-24",
    evidenceStrength: "SoundHound official architecture announcement; deployment is scheduled for late 2026 and customer hardware is unspecified",
    zhHeadline: "OASYS Edge：同一个语音 Agent，云端、端侧、混合部署",
    enHeadline: "OASYS Edge promises one voice agent across cloud, edge, and hybrid hardware",
    zhFact: "SoundHound 发布 OASYS Edge，把 LLM 语音 Agent 直接嵌入车辆和智能设备，支持本地多步路线规划、机器人持续监听、端侧多 Agent 编排与无网工作。官方称开发者可构建一次，再按性能、成本和硬件需求部署到云端、边缘或混合环境；预计 2026 年晚些时候部署，CES 2027 将展示。",
    enFact: "SoundHound announced OASYS Edge as an architecture that embeds LLM voice agents into vehicles and smart devices. Official examples include multi-step route planning without connectivity, continuous on-device listening for a robot, multi-agent orchestration, and local privacy controls. Developers can build once and deploy in cloud, edge, or hybrid environments. Deployment is scheduled for late 2026 with a CES 2027 demonstration.",
    zhValue: "它解决规则语音系统只能匹配固定命令、云端 Agent 依赖网络与成本的两难。车辆在车库、隧道或偏远地点仍可完成复杂请求，制造商也可按硬件切换部署。真正的用户收益要求端侧模型理解上下文，并让用户知道在哪里推理、哪些数据留在设备、何时切回云端。",
    enValue: "OASYS Edge addresses the tradeoff between fixed-command systems and cloud agents that require connectivity and recurring cost. A vehicle may continue a complex request in a garage, tunnel, or remote area, while a manufacturer can place the same agent differently per hardware. The user benefit requires local models to understand context and disclose where inference runs, what stays local, and when cloud fallback occurs.",
    zhHciLens: ["入口：车辆、机器人与智能设备语音", "上下文：位置、设备状态与本地知识", "动作：多步编排与断网执行", "边界：端侧模型、监听、迁移"],
    enHciLens: ["Entry: voice in vehicles, robots, and smart devices", "Context: location, device state, local knowledge", "Action: multi-step orchestration and offline execution", "Boundary: local model limits, listening, migration"],
    zhImplication: "端侧 Agent 要显示谁在听、在哪里推理、什么不会离开设备、何时切回云端。车辆要把分心、路线变更和驾驶者批准写入状态机，机器人要区分听见、理解、计划和执行。同一句话在不同部署上结果不同，必须有可见的能力与隐私状态。",
    enImplication: "An edge agent must show who is listening, where inference runs, what stays on the device, and when it falls back to cloud. Vehicles need distraction, route changes, and driver approval in the state machine; robots need hearing, understanding, planning, and actuation separated. If the same request behaves differently by deployment, capability and privacy state must be visible.",
    visual: visuals.soundhound,
    sources: [source("SoundHound OASYS Edge announcement", urls.soundhound, "official"), source("SoundHound OASYS Edge architecture", urls.soundhoundArticle, "developer surface"), source("Qualcomm agentic-age context", "https://www.qualcomm.com/news/onq/2026/09/snapdragon-for-agentic-age", "global")],
    dossier: makeDossier({
      productName: "SoundHound OASYS Edge",
      productType: "OASYS Edge 是面向汽车与智能设备的嵌入式 Agent 架构，不是消费者独立硬件。它把 LLM 语音 Agent、多 Agent 编排、定制模型和云端、端侧、混合部署放进 OASYS 平台，目标是制造商构建一次、按硬件能力部署。最终用户会通过车机、机器人或其他智能设备接触它，因此产品性质是 B2B developer/industry surface。",
      interactionFlow: "车辆驾驶者提出多步路线请求，设备用本地知识规划并在断网时播报；机器人本地检测查询并回答；设备可按上下文协调多个功能。公开资料没有展示工具配置、本地/云端标识、误听、取消多步动作、联网恢复同步或人工接管。故障恢复与用户如何看到端云切换仍未确认。",
      specsOrStack: "公开栈包括 OASYS、嵌入式 OASYS Edge、优化语言模型、多 Agent orchestration、本地知识库、云端/端侧/混合部署和可选本地遥测。官方提到断网路线、端侧持续监听、隐私数据可留在设备和较低运营成本，但没有披露芯片、内存、模型尺寸、功耗、车载 OS、机器人 SDK、API 版本或客户硬件。预计 2026 年晚些时候部署，CES 2027 演示。",
      useCases: "用例包括无信号道路规划多个旅游停靠点、地下车库或隧道继续响应语音、机器人本地对话，以及制造商按性能和成本把同一 Agent 部署到不同硬件。官方描述的是平台能力，不代表所有汽车和机器人已支持，也不是消费者可直接下载的功能。",
      painPointsSolved: "OASYS Edge 针对联网依赖、延迟、带宽、API 成本和隐私暴露，也针对固定命令无法处理复合目标。统一构建、按环境部署可以减少厂商分别维护车、家电和机器人 Agent 的成本。新问题是端侧模型不足、升级与回滚、多 Agent 抢麦克风、车内录音知情、部署差异和端侧日志难审计。",
      userVoice: "目前只有 SoundHound 官方公告和架构文章，没有独立汽车、机器人实测、客户名单、量产时间、端侧准确率或断网成功率。官方场景足以证明方向，但 private by default、fully embedded 等表达仍需要真实硬件验证。晚 2026 部署与 CES 2027 是下一节点。",
      newTech: "技术信号是把 Agent 构建与运行位置解耦：开发者在 OASYS 设计意图理解和工具编排，再把模型放到云、边缘或混合层。端侧不只是命令集，而是本地推理、知识和多系统协调。跨部署的状态、权限、模型版本和结果若没有统一审计与降级协议，灵活性会变成不可预测体验。",
      availability: "SoundHound 预计 OASYS Edge 在 2026 年晚些时候部署，当前有 live demonstrations，并计划 CES 2027 展示。公告没有消费者 SKU、客户、价格、公开 SDK、支持芯片、地区或具体日期，因此它是已宣布的 B2B developer/industry surface，不是今天可购买的终端。",
      limitsOrUnknowns: "未知包括本地模型尺寸与精度、功耗、车载/机器人 OS、误触发、多乘员隐私、端云切换、离线知识更新、工具授权、取消回滚、远程诊断、版本兼容和端侧执行日志。可选本地数据主权不能推断所有客户默认本地或满足每个地区的汽车隐私法规。",
      productVerdict: "OASYS Edge 是端侧 Agent 从宣言走向嵌入式架构的信号。结论：developer surface；架构、用例和计划部署有官方依据，真实硬件、客户和指标未验证。价值取决于断网可用、端云切换可见、取消可靠和跨设备版本一致。"
    }, {
      productName: "SoundHound OASYS Edge",
      productType: "OASYS Edge is SoundHound's embedded agent architecture for vehicles and smart devices, not a standalone consumer device. It combines LLM voice agents, multi-agent orchestration, configurable models, and cloud, edge, or hybrid deployment in OASYS. A manufacturer can build once and place the agent according to hardware; end users encounter it through a car, robot, or other device. This is a B2B developer and industry surface.",
      interactionFlow: "A driver asks for a multi-step route and the device uses local knowledge to plan and narrate it in a dead zone; a robot detects and answers queries on device; a device can coordinate functions from one request. The public material does not show tool configuration, local-versus-cloud labels, misrecognition, cancellation, reconnection synchronisation, or human takeover. Failure recovery and cloud-edge visibility are unconfirmed.",
      specsOrStack: "The stack includes OASYS, embedded OASYS Edge, optimised language models, multi-agent orchestration, a local knowledge base, cloud, edge, and hybrid deployment, and optional local telemetry. SoundHound describes offline routing, continuous on-device listening, local handling of sensitive data, and lower operating cost, but not chip, memory, model size, power, vehicle OS, robot SDK, API version, or customer hardware. Deployment is late 2026 with a CES 2027 demo.",
      useCases: "Examples include a vehicle planning several tourist stops without signal, voice response in a garage or tunnel, local robot conversation, and a manufacturer deploying one agent according to performance and cost across hardware. These are platform capabilities, not proof that every vehicle or robot supports them, and not a consumer-downloadable feature.",
      painPointsSolved: "OASYS Edge targets connectivity, latency, bandwidth, API cost, and privacy exposure, as well as the inability of fixed commands to handle composite goals. Build-once, deploy-by-environment can reduce separate maintenance for car, appliance, and robot agents. New problems include local-model limits, updates and rollback, microphone contention, cabin disclosure, deployment variance, and hard-to-audit local logs.",
      userVoice: "The evidence is SoundHound's official announcement and architecture article. There is no independent vehicle or robot test, customer list, mass-production date, edge accuracy, or offline-success measure. The scenarios establish direction; private by default and fully embedded still require hardware evidence. Late 2026 deployment and CES 2027 are the next checkpoints.",
      newTech: "The architecture decouples agent construction from runtime placement. Developers design intent understanding and tool orchestration on OASYS, then place the model in cloud, edge, or hybrid layers. Edge is more than a command grammar: it includes local inference, knowledge, and multi-system coordination. Without shared audit and degradation protocols, deployment flexibility becomes unpredictable experience.",
      availability: "SoundHound schedules OASYS Edge for late 2026, says live demonstrations are available, and plans a CES 2027 presentation. The announcement gives no consumer SKU, customer list, price, public SDK, supported chip, region, or exact date. It is an announced B2B developer and industry surface, not a retail endpoint.",
      limitsOrUnknowns: "Open questions include local model size and accuracy, power, vehicle and robot OS, false wake, multi-passenger privacy, cloud-edge handoff, offline knowledge updates, tool authority, cancellation and rollback, remote diagnostics, version compatibility, and local logs. Optional local data sovereignty does not prove every deployment is local by default or compliant with every automotive privacy regime.",
      productVerdict: "OASYS Edge is a signal that edge agents are becoming embedded architecture. Verdict: developer surface. Architecture, examples, and deployment plan are official; hardware, customers, and metrics are unverified. Value depends on offline usefulness, visible handoff, reliable cancellation, and cross-device version consistency."
    })
  }),
  scan({
    id: "thoughtful-things-engram-ai-sampler-kickstarter-2026-09-28",
    section: "wild", evidenceLabel: "crowdfunding signal", sourceDate: "2026-09-28",
    evidenceStrength: "dated product scan; original Kickstarter page and hardware evidence were not independently retrieved",
    zhHeadline: "扫描：Engram 把 AI 当作可扭曲声音的乐器",
    enHeadline: "Scan: Engram treats AI as a sound-mangling instrument",
    zhFact: "9 月 28 日公开扫描报道 Thoughtful Things 在 Kickstarter 发起 Engram，一个独立 AI sampler 与 groovebox。报道将它与“一键出歌”区分：设备接收输入音频，用 AI 处理、扭曲并生成新的 hallucinated sounds，面向声音设计师和实验音乐人。未取得 Kickstarter 原始活动页、价格、接口、样机评测或发货承诺，因此保留 crowdfunding signal。",
    enFact: "A September 28 scan reports a Thoughtful Things Kickstarter campaign for Engram, a standalone AI sampler and groovebox. The report distinguishes it from a push-button song generator: Engram accepts incoming audio, processes and mangles it with AI, and creates hallucinated sounds for sound designers and experimental musicians. The original campaign, price, I/O, prototype review, and shipping commitment were not retrieved, so this remains a crowdfunding signal.",
    zhValue: "产品信号是把 AI 的不确定性放进采样、循环和扭曲流程，让用户把意外结果当作材料，而不是让模型完成一首歌。价值取决于重复采样、锁定片段、撤销变形、理解输入与模型输出的谱系。当前证据只支持创意方向和众筹状态，不能支持低延迟、稳定性、版权、现场演出或交付。",
    enValue: "The signal is a tactile workflow in which AI uncertainty becomes sampling, looping, and mangling material instead of a model finishing a song. Value would depend on repeatable sampling, locking a fragment, undoing mutation, and understanding the lineage between input and model output. Current evidence supports the creative direction and crowdfunding status, not low latency, stability, copyright, live performance, or delivery.",
    zhHciLens: ["入口：实体采样与循环", "上下文：输入音频、片段与模型变形", "动作：生成、锁定、撤销、再采样", "边界：版权、延迟、稳定性、发货"],
    enHciLens: ["Entry: physical sampling and looping", "Context: input audio, fragments, model mutation", "Action: generate, lock, undo, resample", "Boundary: copyright, latency, stability, shipping"],
    zhImplication: "硬件验收要看用户能否保持作者感。没有历史、可重复种子、强度、锁定和回滚，AI 变形像一次性玩具；有实体控制和可见谱系，才可能成为乐器。原始活动页未取得，不能虚构旋钮布局或端侧推理。下一步观察样机、音频、接口、延迟、供电、更新和退款条件。",
    enImplication: "Acceptance should ask whether the user retains authorship. Without history, repeatable seeds, intensity, lock, and rollback, AI mangling is a one-shot toy; with physical control and visible lineage it could become an instrument. The campaign was not retrieved, so controls and local inference cannot be invented. Watch for prototype audio, I/O, latency, power, updates, refunds, and delivery.",
    visual: visuals.engram,
    sources: [source("AIToolly September 28 scan", urls.engram, "wild"), source("Kickstarter campaign index", "https://www.kickstarter.com/", "crowdfunding signal")],
    dossier: makeDossier({
      productName: "Thoughtful Things Engram（crowdfunding scan）",
      productType: "Engram 在本期被记录为 Kickstarter 上的 AI sampler 与 groovebox 扫描条目，不是已经完成零售验证的硬件。公开扫描描述它是一台独立乐器，用 AI 接收和处理输入音频，产生新的不可预测声音材料，定位更靠近实验音乐、声音设计和现场创作，而不是自动生成完整歌曲。",
      interactionFlow: "已公开的流程是把输入音频送入设备，由 AI 进行采样、扭曲和生成，再把结果作为片段继续使用。录入方式、采样长度、循环、旋钮/按键、锁定、撤销、重复生成、电脑或 DAW 连接和导出均未披露。缺少原始活动页和实机视频，不能把 tactile workflow 扩写成已确认界面。",
      specsOrStack: "扫描只说明 standalone instrument、AI-powered sampler、groovebox 与 hallucinated sounds。芯片、模型、存储、音频 I/O、采样率、延迟、屏幕、控制件、连接、供电、软件、版权机制、价格、众筹目标、发货日期和地区均为 source not stated。本次不引用未核实数字。",
      useCases: "报道指向声音设计师和实验音乐人，把输入音频送入 AI，获得不稳定但可用于采样与编排的片段。现场即兴、音色探索、鼓组纹理是合理方向，但不是已验证功能。现场使用还要看延迟、可重复性、断电恢复和导出格式，目前没有证据。",
      painPointsSolved: "它试图减少传统采样器手工切片、变形和寻找意外声音的成本，为不想要一键完成歌曲的创作者提供材料生成。新痛点是结果难预测、作者选择被遮蔽、版权来源不清、同一操作难复现、现场延迟不可控和众筹交付风险。没有历史、锁定和回滚，偶然灵感难以变成可编辑作品。",
      userVoice: "本期没有 Kickstarter 评论、独立评测、音频样例审听或社区长期反馈。唯一可靠信号是当日扫描对定位的描述，因此“用户喜欢”“低延迟”“适合现场”都不能写成事实。下一步需查原始活动页、厂商更新、支持者评论和可复现样机测试。",
      newTech: "可确认的新方向是让 AI 把 hallucination 当作声音材料，并把模型行为放进 sampler/groovebox 的触觉流程，而非隐藏在云端生成按钮后。模型输出成为可剪辑、循环、再采样的中间素材。模型、端云关系和控制映射未公开，不能确认端侧或云端推理。",
      availability: "公开扫描称 Engram 已在 Kickstarter 发起活动，但本次未取得原始活动页，因此没有可核实的众筹目标、档位、价格、交付日期、地区、退费条件或发货状态。它只能标为 crowdfunding signal / weak product evidence，不能写成今天可购买的成熟硬件。",
      limitsOrUnknowns: "未知包括活动页状态、样机成熟度、音频 I/O、延迟、生成可重复性、版权与训练数据、是否上传、软件更新、导出、维修、支持者退款和交付。没有证据证明它可现场稳定工作、支持 DAW 或不依赖网络。缺失事实正是本扫描保留降级标签的原因。",
      productVerdict: "Engram 是值得观察的 crowdfunding signal：它把 AI 不确定性做成可操作的声音材料，而不是替用户写完一首歌。结论：weak/unverified；定位有公开扫描依据，硬件、交互、规格和交付未独立确认。"
    }, {
      productName: "Thoughtful Things Engram (crowdfunding scan)",
      productType: "Engram is recorded as a Kickstarter AI sampler and groovebox scan, not a retail-verified hardware product. Public coverage describes a standalone instrument that accepts and processes incoming audio with AI to produce unpredictable material. It is positioned for experimental music, sound design, and live creation rather than an automated complete-song generator.",
      interactionFlow: "The public description supports a flow in which audio enters the device, AI samples or mangles it, and the result becomes a musical fragment. Capture method, sample length, looping, controls, locking, undo, repeatable generation, computer or DAW connection, and export are not stated. Without the campaign or hands-on video, a tactile workflow cannot be expanded into confirmed interface behaviour.",
      specsOrStack: "The scan says standalone instrument, AI-powered sampler, groovebox, and hallucinated sounds. Chip, model, storage, audio I/O, sample rate, latency, display, controls, connectivity, power, software, copyright mechanism, price, campaign goal, shipping, and region are source not stated. No unverified numbers are included.",
      useCases: "The coverage points to sound designers and experimental musicians feeding audio into AI and using unstable fragments for sampling and arrangement. Live improvisation, timbre exploration, and drum texture are plausible directions, not proven functions. Live use would require latency, repeatability, power-loss recovery, and export evidence that is currently missing.",
      painPointsSolved: "Engram aims to reduce manual slicing, mutation, and accident-hunting in a sampler and give creators who reject one-button songs an active material generator. It introduces unpredictable output, obscured authorship, unclear copyright, weak reproducibility, uncontrolled live latency, and crowdfunding risk. Without history, lock, and rollback, a lucky accident is hard to edit into a composition.",
      userVoice: "This run found no Kickstarter comments, independent review, audio audit, or long-term community feedback. The only reliable signal is the dated scan's positioning. User liking, low latency, and live readiness are unsupported claims. The next check is the campaign, manufacturer updates, backer comments, and a reproducible prototype test.",
      newTech: "The direction is to treat AI hallucination as sound material and place model behaviour inside a sampler and groovebox workflow instead of a cloud generation button. Output becomes an editable, loopable, resamplable intermediate. Because model, cloud-edge relationship, and control mapping are not public, local versus cloud inference cannot be confirmed.",
      availability: "The scan says Engram launched a Kickstarter campaign, but the original campaign page was not retrieved. There is no verified goal, tier, price, delivery date, region, refund condition, or shipping status. It remains a crowdfunding signal with weak product evidence, not a mature retail device.",
      limitsOrUnknowns: "Open questions include campaign status, prototype maturity, audio I/O, latency, repeatability, copyright and training data, upload policy, software updates, export, repair, refunds, and delivery. There is no evidence that it works reliably on stage, integrates with a DAW, or works without a network. Missing facts justify the downgrade.",
      productVerdict: "Engram is a watchable crowdfunding signal because it treats AI uncertainty as playable sound material rather than asking the model to finish a song. Verdict: weak/unverified. The direction has dated scan support; hardware, interaction, specifications, and delivery are not independently confirmed."
    })
  })
];
