import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const surveyRoot = "/Users/hmi/Documents/Survey";
const date = "2026-09-05";
const previousDate = "2026-09-04";
const dataPath = path.join(root, "data", "issues.json");
const issueDir = path.join(root, date);
const deckDir = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${date}`);

const visual = (file, altZh, altEn, captionZh, captionEn, sourceUrl) => ({
  path: `assets/${file}`,
  width: 1280,
  height: 720,
  kind: "source-backed-screenshot",
  altZh,
  altEn,
  captionZh,
  captionEn,
  sourceUrl
});
const source = (label, url, type) => ({ label, url, type });

const gosightUrl = "https://www.globenewswire.com/news-release/2026/09/04/3356376/0/en/gosight-p1-moves-full-color-ar-into-continuous-use-with-binocular-display-and-seamless-battery-swapping.html";
const qiraUrl = "https://news.lenovo.com/pressroom/press-releases/lenovo-motorola-qira-expands-its-reach-across-devices-apps-and-markets/";
const qiraWorkatoUrl = "https://news.lenovo.com/pressroom/press-releases/lenovo-workato-expand-qira-ecosystem-with-new-cross-app-ai-experiences/";
const qiraCommunityUrl = "https://www.reddit.com/r/Lenovo/comments/1ur8qz5/any_issues_after_lenovo_qira_installation/";
const qiraReviewUrl = "https://www.windowscentral.com/artificial-intelligence/lenovo-qira-launch-mwc-2026";
const plaudUrl = "https://www.plaud.ai/products/plaud-one";
const plaudReviewUrl = "https://www.techradar.com/ai-platforms-assistants/exclusive-the-point-isnt-that-it-never-misunderstands-its-that-the-user-stays-in-control-plaud-tells-us-why-its-new-ai-earbuds-want-to-do-more-than-record-your-meetings";
const plaudChinaUrl = "https://www.ithome.com/0/996/945.htm";
const ultrahumanUrl = "https://www.ultrahuman.com/us/ring-pro/buy/";
const ultrahumanTechUrl = "https://techcrunch.com/2026/09/03/qualcomm-backs-ultrahuman-in-70m-round-on-bet-to-turn-smart-rings-into-computers/";
const viveUrl = "https://www.vive.com/tw/product/vive-eagle/overview/";
const viveReviewUrl = "https://www.t3.com/tech/vr/htcs-smart-glasses-are-coming-to-the-uk-and-now-we-know-their-price-at-last";
const viveTaiwanMobileUrl = "https://corp.taiwanmobile.com.tw/press-release/news/press_20260903_424724.html";
const doovaUrl = "https://www.tuya.com/news-details/Kfx9813ozlbff";
const sonosUrl = "https://newsroom.sonos.com/269843-sonos-introduces-sonos-27-the-next-generation-of-its-audio-operating-system/";
const sonosProductUrl = "https://www.sonos.com/en-ca/shop/sonos-ace-ultra-agave";
const sonosReviewUrl = "https://www.techradar.com/audio/speakers/i-think-sonos-just-fully-solved-home-audio-mostly-by-doing-exactly-what-we-want-even-with-ai";
const hisenseChinaUrl = "https://www.ithome.com/0/997/804.htm";

const gosightVisual = visual("gosight-p1-ifa-official-2026-09.png", "GOSIGHT P1 IFA 2026 发布页面截图", "GOSIGHT P1 IFA 2026 announcement screenshot", "公开发布材料：P1 的双目彩色 AR、取景器与隐私硬件", "Public launch material: P1 binocular full-color AR, viewfinder, and privacy hardware", gosightUrl);
const qiraVisual = visual("lenovo-qira-ifa-official-2026-09.png", "Lenovo Qira IFA 2026 官方公告截图", "Lenovo Qira IFA 2026 announcement screenshot", "官方公告：Qira 跨 PC、手机、手表与协作应用", "Official announcement: Qira across PCs, phones, watches, and work apps", qiraUrl);
const qiraCommunityVisual = visual("lenovo-qira-community-friction-2026-09.png", "Lenovo 社区中的 Qira 升级摩擦截图", "Lenovo community screenshot about Qira upgrade friction", "社区证据：升级后无法启动与维修等待的个案反馈", "Community evidence: individual reports of launch failure and repair waits after an upgrade", qiraCommunityUrl);
const plaudVisual = visual("plaud-one-official-2026-09.png", "Plaud One 官方产品页截图", "Plaud One official product page screenshot", "官方产品页：eSIM、录音按钮、Agent 按钮和续航规格", "Official product page: eSIM, record button, Agent button, and battery figures", plaudUrl);
const plaudChinaVisual = visual("plaud-one-china-ithome-2026-09.png", "IT之家 Plaud One 中国报道截图", "ITHome China report about Plaud One screenshot", "中国 lane：IT之家对 Plaud One 定价与 eSIM 形态的报道", "China lane: ITHome report on Plaud One pricing and eSIM form factor", plaudChinaUrl);
const ultrahumanVisual = visual("ultrahuman-ring-pro-official-2026-09.png", "Ultrahuman Ring PRO 官方预订页截图", "Ultrahuman Ring PRO official preorder screenshot", "官方预订页：Ring PRO、on-chip ML、存储与 Jade", "Official preorder page: Ring PRO, on-chip ML, storage, and Jade", ultrahumanUrl);

const viveVisual = visual("vive-eagle-official-2026-09.png", "T3 对 HTC VIVE Eagle 海外上市报道的页面截图", "T3 report on HTC VIVE Eagle regional launch", "独立报道：VIVE Eagle 的英国、美国与欧盟价格和上市节奏", "Independent report: VIVE Eagle pricing and rollout in the UK, US, and EU", viveReviewUrl);
const doovaVisual = visual("tuya-doova-official-2026-09.png", "Tuya Doova IFA 2026 官方公告截图", "Tuya Doova IFA 2026 official announcement screenshot", "官方公告：面向独居老人的移动陪伴、安全与智能家居机器人", "Official announcement: mobile companionship, safety, and smart-home robot for seniors living alone", doovaUrl);
const sonosVisual = visual("sonos-27-official-2026-09.png", "TechRadar 对 Sonos 27 与 Ace Ultra 的报道截图", "TechRadar report on Sonos 27 and Ace Ultra", "独立评测：Sonos 27、Fabric 与 Ace Ultra 的系统级迁移", "Independent review: Sonos 27, Fabric, and system-level Ace Ultra handoff", sonosReviewUrl);
const hisenseVisual = visual("hisense-juos-ithome-2026-09.png", "IT之家对海信 JUOS 与 Vidda AI 眼镜 G11 的报道截图", "ITHome report on Hisense JUOS and Vidda AI Glasses G11", "中国 lane 扫描：海信 JUOS 与 Vidda AI 眼镜 G11 的 IFA 展前信号", "China-lane scan: Hisense JUOS and Vidda AI Glasses G11 before IFA", hisenseChinaUrl);

function topic({ id, section, evidenceLabel, evidenceStrength, dossierKind = "product", zhHeadline, enHeadline, zhFact, enFact, zhValue, enValue, zhHciLens, enHciLens, zhImplication, enImplication, sourceDate, visual: topicVisual, sources, dossier }) {
  return { id, section, dossierKind, evidenceLabel, evidenceStrength, zhHeadline, enHeadline, zhFact, enFact, zhValue, enValue, zhHciLens, enHciLens, zhImplication, enImplication, sourceDate, visual: topicVisual, sources, dossier: { zh: dossier.zh, en: dossier.en } };
}

const newTopics = [
  topic({
    id: "gosight-p1-full-color-ar", section: "wild", evidenceLabel: "startup signal", evidenceStrength: "company launch release via GlobeNewswire; target values and delivery remain unverified", sourceDate: "2026-09-04", visual: gosightVisual,
    zhHeadline: "GOSIGHT P1 把全彩 AR 的难题改写成持续使用与交付", enHeadline: "GOSIGHT P1 reframes full-color AR around continuous use and delivery",
    zhFact: "GOSIGHT 在 9 月 4 日公开 P1：双目全彩 Micro-OLED、约 105 英寸等效视野、约 69g 目标、12MP 第一人称相机、1080p 视频、双麦克风、开放式扬声器、热插拔电源和硬件关联隐私指示灯。发布材料同时写明最终规格、价格、市场和交付时间尚未公布。",
    enFact: "GOSIGHT unveiled P1 on September 4 with binocular full-color Micro-OLED displays, a roughly 105-inch-equivalent view, a target of about 69g, a 12MP first-person camera, 1080p video, dual microphones, open-ear audio, hot-swappable power, and a hardware-linked privacy indicator. The release also says final specifications, pricing, supported markets, and delivery timing are not yet published.",
    zhValue: "它把显示眼镜的核心路径从“把画面放进眼前”推进到“取景、理解、反馈、换电和隐私状态能不能连续工作”。用户先在双目显示中确认画面，再拍照或录像；字幕、翻译、物体识别、提词、会议纪要和步行导航回到视野，开放式音频保留环境感知。这个组合很具体，但当前仍是 IFA 展示前的 startup signal。",
    enValue: "The product moves the display-glasses question from putting pixels in front of the eye to whether framing, understanding, feedback, power swapping, and privacy state can remain continuous. The wearer checks a live viewfinder before taking a photo or video; captions, translation, object recognition, teleprompter prompts, meeting notes, and walking navigation return to the view, while open-ear audio preserves awareness. The combination is concrete, but it remains a startup signal before the IFA demonstration and order surface.",
    zhHciLens: ["Input: 第一人称相机 + 语音", "Output: 双目 Micro-OLED 视野", "Feedback: 开放式音频 + 隐私指示灯", "Continuity: 取景 → AI → 换电 → 继续工作"],
    enHciLens: ["Input: first-person camera + voice", "Output: binocular Micro-OLED view", "Feedback: open-ear audio + privacy indicator", "Continuity: frame → AI → swap power → continue"],
    zhImplication: "全彩 AR 的产品验收不能只看视野、亮度或重量。必须把取景器是否可读、镜片透光、遮挡隐私灯后的停止行为、换电是否保持任务、网络断开后的降级，以及用户是否知道当前 AI 在听什么一起测试。",
    enImplication: "Full-color AR cannot be accepted on field of view, brightness, or weight alone. Teams need to test viewfinder legibility, optical transmission, camera stopping when the privacy indicator is compromised, task continuity across a power swap, degraded behaviour offline, and whether the wearer knows what the AI is currently hearing.",
    sources: [source("GOSIGHT P1 launch release", gosightUrl, "startup signal"), source("GOSIGHT company site", "https://www.gosightai.com/", "startup signal")],
    dossier: {
      zh: {
        productName: "GOSIGHT P1（双目全彩 AI+AR 眼镜，startup signal）",
        productType: "P1 是一套把双目全彩显示、第一人称相机、开放式音频、语音交互和机身计算组合在一起的 AR 眼镜。GOSIGHT 通过 GlobeNewswire 发布了产品叙事和若干目标值，公开材料把它定位为从演示走向持续使用的 all-in-one 设备。由于最终规格、价格、支持市场和交付时间尚未公开，本文不把它写成已上市产品。",
        interactionFlow: "佩戴者先通过双目显示查看第一人称 live viewfinder，确认构图后拍照或录制 1080p 视频；也可以用语音调用字幕、面对面翻译、照片翻译、物体识别、提词、会议纪要和导航。开放式扬声器返回语音反馈，硬件关联的隐私指示灯在相机工作时点亮；材料称指示灯被遮挡或失效时相机 intended to stop。电源用可热插拔架构续接，最终是否能在换电时保持任务还没有实机证据。",
        specsOrStack: "发布材料披露 12MP 相机、1080p 视频、双麦克风、全彩 Micro-OLED、约 105 英寸等效视野、约 69g 目标、超过 85% 目标透光率、开放式扬声器、机载计算、硬件关联指示灯和可选物理相机盖。镜片类型、亮度、FOV 的测量条件、SoC、RAM、存储、真实重量、电池容量、热插拔次数、API、系统版本和端云分工 source not stated；目标值在验证前仍是目标。",
        useCases: "已公开的使用场景是面对面字幕和翻译、看菜单或标识的照片翻译、物体识别、演讲提词、会议纪要、语音助手、步行和骑行导航，以及第一人称照片和视频。它适合需要双手自由、又希望保留环境感知的移动工作。真正的重度办公仍需确认输入法、长文本编辑、通知管理和手机回退；这些并未在发布材料中被完整演示。",
        painPointsSolved: "P1 针对三类具体摩擦：用户拍摄时无法确认第一人称构图、显示眼镜长时间工作时电量中断、以及相机工作状态对旁人不透明。把 viewfinder 放到双目显示可降低盲拍；可更换电源试图降低充电等待；硬件指示灯和物理盖试图把隐私控制变成可见、可理解的现场规则。它没有解决量产交付、价格、重量分布、网络依赖和旁人对 AI 处理的完整知情问题。",
        newTech: "新技术不是单一芯片，而是把双目全彩 Micro-OLED、第一人称取景器、开放式音频、热插拔供电和隐私硬件放进同一条状态机。发布材料还强调 GlaxReality 的波导和光学模块能力，并提出压制彩虹伪影、网格纹理和外泄光。由于这些仍处于产品准备阶段，光学目标与最终实测之间不能直接画等号。",
        availability: "P1 将在 IFA Berlin 2026 的 H5.2-429 展示；GOSIGHT 说众筹时间、最终规格、价格、支持市场和预计交付会在 gosightai.com 公布，并邀请用户注册更新。当前证据支持“已公开发布并计划展示”，不支持“已经可购买”或“已确定交付”。",
        limitsOrUnknowns: "最终售价、下单入口、发货时间、真实重量、视野测量、亮度、续航、换电后是否保留上下文、相机停止和恢复条件、离线能力、AI 模型、隐私日志、SDK、处方镜片、维修渠道和地区语言均 source not stated。公司还没有提供独立评测、完整规格表或真实用户回归，因此不能把目标值当成体验事实。",
        productVerdict: "P1 是今天最值得追踪的 AR 产品信号，因为它把显示、取景、持续供电和社会隐私放在一张产品合同里。现阶段判断为 startup signal：产品叙事和展示计划具体，交付与可用性仍未证实。下一关是 IFA 真机、订单页面、换电演示、隐私失败回退和独立续航。"
      },
      en: {
        productName: "GOSIGHT P1, a binocular full-color AI+AR glasses startup signal",
        productType: "P1 is an AR-glasses system that combines binocular full-color display, a first-person camera, open-ear audio, voice interaction, and onboard computing. GOSIGHT published the product story and several target values through GlobeNewswire, framing the device as a move from demonstrations toward continuous use. Because final specifications, pricing, markets, and delivery timing are unpublished, this dossier does not treat P1 as a retail product.",
        interactionFlow: "The wearer first sees a first-person live viewfinder in the binocular display and confirms the frame before taking a photo or recording 1080p video. Voice can invoke face-to-face captions, translation, photo translation, object recognition, teleprompter prompts, meeting notes, and navigation. Open-ear speakers return spoken feedback, while a hardware-linked privacy indicator illuminates when the camera is active; the release says the camera is intended to stop if the indicator is obstructed or compromised. Hot-swappable power is designed to keep the device going, but there is no hands-on evidence that a task context survives the swap.",
        specsOrStack: "The release discloses a 12MP camera, 1080p video, dual microphones, full-color Micro-OLED displays, a roughly 105-inch-equivalent view, a target weight of about 69g, a target optical transmission above 85 percent, open-ear speakers, onboard computing, a hardware-linked indicator, and an optional physical camera cover. Lens type, brightness, measurement conditions, SoC, RAM, storage, final weight, battery capacity, swap count, API, OS version, and edge/cloud division are source not stated; target values remain targets until verified.",
        useCases: "Published use cases include face-to-face captions and translation, photo translation for menus or signs, object recognition, teleprompter prompts, meeting notes, voice assistance, walking and cycling navigation, and first-person photo or video capture. These jobs fit mobile work where hands-free input and environmental awareness matter. Heavy office work still needs evidence for text entry, long-form editing, notification control, and phone handoff; the release does not show those flows in full.",
        painPointsSolved: "P1 targets three concrete frictions: a wearer cannot check a first-person composition before capture, display glasses interrupt work when power runs out, and bystanders may not understand when a camera is active. A live viewfinder can reduce blind capture; replaceable power aims to reduce charging downtime; and the indicator plus optional physical cover make privacy a visible field rule. The product does not yet solve manufacturing delivery, price, weight distribution, network dependence, or complete bystander understanding of AI processing.",
        newTech: "The novelty is a product-level state machine that joins binocular full-color Micro-OLEDs, a first-person viewfinder, open-ear audio, hot-swappable power, and privacy hardware. The release also points to GlaxReality waveguide and optical-module work intended to suppress rainbow artefacts, grid texture, and outward light leakage. Since the program is still in preparation, optical targets cannot be read as final measurements.",
        availability: "P1 will be shown at IFA Berlin 2026 at H5.2-429. GOSIGHT says crowdfunding timing, final specifications, price, supported markets, and estimated delivery will be announced through gosightai.com, with registration available for updates. The evidence supports a public announcement and planned demonstration; it does not support a claim that the product is purchasable or scheduled to ship.",
        limitsOrUnknowns: "Final price, order surface, shipping date, real weight, field-of-view measurement, brightness, endurance, context retention across a power swap, camera-stop and recovery conditions, offline behaviour, AI models, privacy logs, SDK, prescription fit, repair channel, and regional languages are source not stated. There is no independent review, complete specification sheet, or real-user regression, so target values must not be presented as experience facts.",
        productVerdict: "P1 is the most consequential AR signal today because it puts display, framing, continuous power, and social privacy inside one product contract. Verdict: startup signal. The narrative and demonstration plan are concrete, while delivery and usability remain unverified. The next gate is a real IFA unit, an order page, a power-swap demonstration, privacy-failure recovery, and independent endurance testing."
      }
    }
  }),
  topic({
    id: "lenovo-motorola-qira-cross-device", section: "official", evidenceLabel: "confirmed product", evidenceStrength: "official Lenovo announcement with developer/connectivity surface", sourceDate: "2026-09-03", visual: qiraVisual,
    zhHeadline: "Qira 把个人 AI 从一台设备扩展成跨设备工作入口", enHeadline: "Qira turns personal AI from one device into a cross-device work entry point",
    zhFact: "Lenovo 9 月 3 日宣布 Qira 扩展到满足条件的 16GB Lenovo PC、Android 17 升级后的部分 Motorola 设备和 moto watch ultra，并通过 Workato 连接 Gmail、Calendar、Contacts、Slack、Outlook Mail、Outlook Calendar、Microsoft 365、Google Workspace、Trello、Asana、Discord 与 Notion。",
    enFact: "On September 3, Lenovo said Qira would expand to eligible Lenovo PCs with 16GB memory, selected Motorola devices receiving Android 17, and moto watch ultra, while Workato would connect Gmail, Calendar, Contacts, Slack, Outlook Mail, Outlook Calendar, Microsoft 365, Google Workspace, Trello, Asana, Discord, and Notion.",
    zhValue: "Qira 的产品单位不再是聊天窗口，而是跨设备的 Catch Me Up、跨应用检索和允许用户从意图直接进入任务。手表用抬腕或 Hey Qira 提问，PC 继续上下文，连接器把“找邮件/日历信息”推进到创建任务、编辑 Notion 或分享会议纪要。权限、确认和撤销仍决定它到底是助手还是高风险自动化入口。",
    enValue: "Qira’s product unit is no longer a chat window; it is cross-device Catch Me Up, cross-app retrieval, and a path from intent into work. A watch user can raise a wrist or say Hey Qira, a PC can continue the context, and connectors can move from finding email or calendar information toward creating tasks, editing Notion, or sharing meeting notes. Permissions, confirmation, and undo will determine whether it is an assistant or a risky automation entry point.",
    zhHciLens: ["Input: 语音 + 抬腕 + PC 入口", "Context: 设备状态 + 个人信息", "Action: MCP/Workato 连接器", "Feedback: Catch Me Up + 权限控制"],
    enHciLens: ["Input: voice + wrist raise + PC entry", "Context: device state + personal data", "Action: MCP/Workato connectors", "Feedback: Catch Me Up + permission control"],
    zhImplication: "跨设备 agent 要让用户知道上下文从哪来、动作在哪台设备执行、哪些连接器被调用、何时需要确认，以及失败后如何撤销。把模型放到更多硬件上不等于体验已经连续。",
    enImplication: "A cross-device agent needs to show where context came from, which device performs an action, which connector was called, when confirmation is required, and how to undo failure. Putting a model on more hardware does not automatically create a continuous experience.",
    sources: [source("Lenovo Qira expansion", qiraUrl, "official"), source("Lenovo + Workato MCP layer", qiraWorkatoUrl, "developer surface"), source("Windows Central Qira hands-on", qiraReviewUrl, "hands-on review")],
    dossier: {
      zh: {
        productName: "Lenovo & Motorola Qira（跨设备个人 AI 与 MCP/Workato 连接层）",
        productType: "Qira 是 Lenovo 与 Motorola 把个人 AI 放进 PC、手机、平板、手表和应用连接器的系统级入口。9 月 3 日公告把它从单一设备扩展为跨设备知识、通知摘要和动作编排层；它不是一个只负责回答问题的聊天 app。Qira 的价值来自同一用户上下文能否在不同屏幕和不同输入方式之间继续。",
        interactionFlow: "用户可以在 Lenovo PC 上打开 Qira，通过自然语言问“我错过了什么”、查找邮件或日历，并用 Catch Me Up 获取跨设备摘要；在 moto watch ultra 上抬腕或说 Hey Qira 提问；在手机或平板上继续结果。Workato 作为连接层和 Qira 的 MCP server 基础设施，把 Gmail、Google Calendar、Contacts、Slack、Outlook、Microsoft 365、Google Workspace、Trello、Asana、Discord 和 Notion 接入，支持查询、编辑或创建动作，具体动作应受账户授权与产品确认约束。",
        specsOrStack: "官方披露符合条件的 Lenovo PC 从更高内存门槛扩展到 16GB，Qira 已覆盖 80 多种 PC 配置，并支持六种语言；部分 Motorola edge、signature 和 razr 设备会随 Android 17 逐步获得 Motorola Qira；moto watch ultra 是首个集成 Qira 的 wearable。Workato 公告明确把 MCP server 基础设施作为连接层。模型型号、端侧模型大小、设备间同步协议、离线可用范围、审计日志和 API 稳定性 source not stated。",
        useCases: "具体场景包括把平板上的想法带到 PC、用通知摘要回顾错过的邮件或群聊、询问日历变更、编辑 Notion 项目、创建 Trello 任务、在 Discord 分享会议纪要、从 Outlook 与 Gmail 里找上下文、在手表上获取简短信息。它适合跨设备工作者、会议密集型团队和需要移动中快速捕获的人。付款、删除、批量发送、权限变更和高影响决策仍需要清晰的确认界面。",
        painPointsSolved: "Qira 试图减少窗口切换、复制粘贴、在多个 inbox 中搜索、重新解释上下文和错过通知的成本。手表入口减少拿手机的动作，PC 入口承接复杂任务，连接器把检索和执行连起来。它没有自动解决账号授权分裂、设备间状态冲突、错误动作回滚、不同地区服务不可用或用户不信任跨设备记忆的问题。",
        newTech: "新技术集中在跨设备个人上下文、设备上的本地模型优化、moto watch ultra 的可穿戴入口，以及由 Workato 承载的 MCP server 连接层。Qira 把自然语言意图接到既有应用的动作表面，形成从“问”到“查”再到“做”的链路。这个方向的关键创新在路由和权限编排，具体 agent 计划、调用顺序、错误恢复与每次动作的用户确认尚未完全公开。",
        availability: "Lenovo 说明符合条件的 PC 用户可以从 Lenovo 网站下载 Qira，支持设备未来会预装；Motorola 设备会随 Android 17 按型号和市场逐步 rollout；moto watch ultra 的集成也在扩展中。支持地区、准确型号清单、应用连接器的逐步开放时间和完整语言覆盖需以设备与市场页面为准。",
        limitsOrUnknowns: "官方没有完整列出 80 多种配置的型号、每个连接器的读写权限、端侧与云端的边界、离线时的可用功能、跨设备记忆的保存和删除路径、动作前确认规则、undo、失败日志、企业 admin 控制、模型切换和实时延迟。Qira 的实际连续体验还受 Android 17 rollout、Workato 连接器权限和设备性能影响。",
        productVerdict: "Qira 已经是 confirmed product，且 developer surface 清晰地指向 MCP/Workato 连接器。它真正改变的是入口：个人 AI 被放进设备切换和工作服务之间。产品是否可信，取决于每个动作都能被看见、批准、撤销和追责；若这些状态仍隐藏，跨设备只会放大错误。"
      },
      en: {
        productName: "Lenovo & Motorola Qira, a cross-device personal AI with an MCP/Workato connectivity layer",
        productType: "Qira is Lenovo and Motorola’s system-level entry point for putting personal AI across PCs, phones, tablets, watches, and connected applications. The September 3 announcement extends it from a single-device assistant into a layer for cross-device knowledge, notification summaries, and action orchestration. It is not simply a chat app that answers questions; its value depends on whether one user context continues across screens and input modes.",
        interactionFlow: "A user can open Qira on a Lenovo PC, ask what they missed, search email or calendar, and use Catch Me Up for a cross-device summary. On moto watch ultra, the user can raise the wrist or say Hey Qira for a short answer; the result can continue on a phone, tablet, or PC. Workato acts as the connectivity layer and MCP-server infrastructure, connecting Gmail, Google Calendar, Contacts, Slack, Outlook, Microsoft 365, Google Workspace, Trello, Asana, Discord, and Notion. Query, edit, and create actions should remain bounded by account authorisation and product confirmation, although the exact rules are not fully disclosed.",
        specsOrStack: "Lenovo says eligible PCs now include systems with 16GB memory and that Qira has reached more than 80 PC configurations. It supports six languages. Selected Motorola edge, signature, and razr devices will receive Motorola Qira through a gradual Android 17 rollout, and moto watch ultra is the first wearable with the integration. The Workato announcement identifies an MCP-server infrastructure layer. Model identity, local-model size, cross-device sync protocol, offline scope, audit logs, and API stability are source not stated.",
        useCases: "Concrete jobs include carrying an idea from a tablet to a PC, catching up on email or group-chat notifications, asking about calendar changes, editing a Notion project, creating a Trello task, sharing meeting notes in Discord, finding context across Outlook and Gmail, and retrieving a short answer from a watch while moving. These flows suit cross-device workers, meeting-heavy teams, and people who capture ideas on the go. Payments, deletion, mass sending, permission changes, and consequential decisions still need explicit confirmation surfaces.",
        painPointsSolved: "Qira targets window switching, copy-paste, searching multiple inboxes, re-explaining context, and missing updates. A watch entry reduces phone retrieval, a PC entry can carry complex work, and connectors can join retrieval to execution. It does not automatically solve split account authorisation, conflicting device state, action rollback, regional service gaps, or distrust of cross-device memory.",
        newTech: "The new layer is the combination of cross-device personal context, local-model optimisation on devices, a wearable entry through moto watch ultra, and a Workato-backed MCP-server connectivity surface. Qira maps a natural-language intent onto existing application actions, creating a path from ask to retrieve to do. The important innovation is routing and permission orchestration; the exact agent plan, call order, error recovery, and per-action confirmation are not fully public.",
        availability: "Lenovo says eligible PC users can download Qira from Lenovo’s website and that supported devices will be preloaded later. Motorola devices will receive it gradually by model and market through Android 17, while moto watch ultra is the first wearable integration. Region, exact model lists, connector rollout timing, and full language coverage must be checked at the device and market surfaces.",
        limitsOrUnknowns: "The official material does not list every model among the 80-plus configurations, read/write permissions for each connector, the edge/cloud boundary, offline capabilities, retention and deletion for cross-device memory, pre-action confirmation, undo, failure logs, enterprise administration, model switching, or live latency. The continuity of the experience is also constrained by Android 17 rollout, Workato permissions, and device performance.",
        productVerdict: "Qira is a confirmed product with a meaningful developer surface in its MCP and Workato connectivity layer. Its real product change is the entry point: personal AI sits between device switching and work services. Trust will depend on every action being visible, approved, undoable, and attributable; if those states remain hidden, cross-device reach only amplifies mistakes."
      }
    }
  }),
  topic({
    id: "plaud-one-explorer-lte-agent", section: "global", evidenceLabel: "confirmed product", evidenceStrength: "official product page plus independent media interview", sourceDate: "2026-08-27", visual: plaudVisual,
    zhHeadline: "Plaud One 把会议捕获从手机附件推进到带 eSIM 的耳机", enHeadline: "Plaud One moves meeting capture from a phone accessory into eSIM earbuds",
    zhFact: "Plaud One Explorer Edition 以 US$249.99 预订，耳机与充电盒都可录音；充电盒带 4G LTE eSIM、4 个 MEMS 麦克风和 AI beamforming，耳机每只 3 MEMS + 1 VPU，支持 Agent button、语音激活、Skills/connectors/MCP-compatible workflows。",
    enFact: "Plaud One Explorer Edition is available for preorder at US$249.99. The earbuds and case can capture audio; the case adds 4G LTE eSIM, four MEMS microphones, and AI beamforming, while each earbud has three MEMS microphones and a VPU. The product exposes an Agent button, voice activation, and Skills, connectors, and MCP-compatible workflows.",
    zhValue: "它把“听到—转写—理解—行动”放到耳边，同时让充电盒成为一台能独立联网的桌面录音器。耳机覆盖电话、线上会议和移动中的对话，盒子覆盖面对面会议；Agent 从上下文生成笔记、文档、跟进或连接器动作。它的独立性依赖 4G 覆盖、订阅/credits 和对录音的社会许可。",
    enValue: "Plaud puts a hear-to-transcribe-to-understand-to-act loop at the ear while turning the case into a standalone connected recorder. The earbuds cover calls, online meetings, and conversations on the move; the case covers in-person meetings. Agent uses the context to produce notes, documents, follow-ups, or connector actions. Its independence depends on 4G coverage, credits or subscription economics, and social consent for recording.",
    zhHciLens: ["Input: 长按录音键 + Hey Plaud", "Context: 耳机/盒子双通道对话", "Action: Agent + Skills + connectors", "Feedback: 耳内回答 + 盒子扬声器"],
    enHciLens: ["Input: hold record + Hey Plaud", "Context: earbud/case dual capture", "Action: Agent + Skills + connectors", "Feedback: in-ear response + case speaker"],
    zhImplication: "录音型 agent 必须同时设计佩戴者控制、会议参与者知情、网络断开、转写错误、credits 用尽和数据删除。eSIM 消除了手机在场，却提高了用户理解“谁在联网、录音存哪里、何时会触发行动”的要求。",
    enImplication: "A recording agent needs wearer control, participant notice, offline behaviour, transcription correction, credit exhaustion, and deletion designed together. An eSIM removes the need for a nearby phone while raising the burden of explaining who is connected, where audio is stored, and when an action can be triggered.",
    sources: [source("Plaud One official product page", plaudUrl, "official"), source("TechRadar Plaud One interview", plaudReviewUrl, "hands-on review"), source("Plaud One launch update", "https://www.plaud.ai/blogs/news/plaud-one-ai-earbuds-sell-out-us-pre-sale-in-one-day", "official")],
    dossier: {
      zh: {
        productName: "Plaud One Limited Explorer Edition（带 4G LTE/eSIM 的 AI 耳机与录音盒）",
        productType: "Plaud One 是把半入耳耳机、带麦克风的充电盒、语音 agent 和 Plaud Intelligence 组合起来的 conversation-first wearable。它不只记录会议：耳机可处理电话、线上会议、音乐和移动中的对话，盒子可独立放在桌上捕获面对面谈话。Explorer Edition 是限量预订形态，产品功能仍包含 beta 和地区差异。",
        interactionFlow: "用户长按盒子的 record button 或说 Hey Plaud 开始捕获；耳机通过 force sensor 或语音激活可记录电话和线上会议，盒子则用四麦克风和 AI beamforming 录下房间对话。用户可以按键标记 highlight，随后在耳内或盒子扬声器询问上下文。Plaud Agent 根据转写与历史对话生成摘要、跟进邮件、文档、演示或通过 Skills、connectors 和 MCP-compatible workflows 执行动作；复杂结果回到 Plaud Mobile、Web 或 Desktop 审阅。",
        specsOrStack: "官方页列出耳机每只 3 MEMS + 1 VPU，盒子 4 MEMS + AI beamforming，耳机拾音最高 6.6 ft、盒子最高 16.4 ft；4G LTE/eSIM、Bluetooth 5.4、12mm driver、Adaptive ANC 最高 40dB、LDAC、IP54 耳机、IP52 盒子、830mAh 盒子电池。耳机听音 ANC off 最长 6 小时、ANC on 4.5 小时，连续录音最长 6 小时；盒子连续录音最长 25 小时、总听音最长 36 小时、待机最长 21 天。",
        useCases: "具体使用包括面对面客户会谈、线上会议、电话、通勤路上的灵感捕获、会后问“谁承诺了什么”、从全量对话生成项目摘要、拟写 follow-up、创建文档、把结果发送到连接的工具。耳机适合移动中的低摩擦入口，盒子适合放在会议桌中央。它不适合在没有同意的公共录音、强噪声或需要逐字法律记录的场景中直接依赖。",
        painPointsSolved: "它减少把 Plaud 设备贴在手机背面、会议中频繁拿手机、线上会议无法同时捕获双方音频，以及录音后还要手动把摘要转成行动的摩擦。内置 eSIM 让盒子不需要附近手机即可联网，Agent 将“记录”推进到“理解和执行”。它仍把用户带入一个新的设备账户、transcription minutes、credits 和数据保留体系。",
        newTech: "新的产品组合是耳机与盒子的双形态采集、盒子侧独立 4G LTE/eSIM、耳机 VPU、上下文记忆、Agent、Skills、connectors 和 MCP-compatible workflows。它把佩戴式麦克风、独立联网和可编排软件动作合在一起。真正的技术边界不在“能不能转写”，而在不同声道、语言、设备位置、网络和上下文如何合并，以及 Agent 何时获得执行权限。",
        availability: "官方产品页列出 Explorer Edition US$249.99，并说明是 pre-order、数量有限；页面列出美国、法国、德国、英国、意大利、西班牙、加拿大和荷兰的当前可用市场，具体 shipping timing 以 checkout 为准。Explorer Edition 含 Starter Plan 300 分钟和 US$200 Plaud credits；credits、beta 功能和 4G 覆盖会因地区、设备和软件版本变化。",
        limitsOrUnknowns: "Plaud 没有在产品页完整说明持续 agent 费用、credits 用完后的每个动作价格、端侧与云端处理边界、转写原文保存时长、企业 admin、会议参与者提示的产品化方式、批量删除审计、eSIM 未来计划和所有语言的 beta 覆盖。TechRadar 记录 Plaud 说用户可以访问、更正、导出和删除数据，但仍应等待实际 app 路径和地区政策验证。",
        productVerdict: "这是 confirmed product，也是今天最清楚的“设备脱离手机后仍能执行 agent”案例。它的价值在于把采集、上下文和行动串起来；它的风险同样具体：录音许可、订阅与 credits、4G 覆盖、耳机续航和错误动作。购买判断要看真实会议中断点、删除路径与 Agent 是否保持用户控制。"
      },
      en: {
        productName: "Plaud One Limited Explorer Edition, AI earbuds and a 4G LTE/eSIM recording case",
        productType: "Plaud One combines half-in-ear earbuds, a microphone-equipped case, a voice agent, and Plaud Intelligence around a conversation-first wearable. It does more than record meetings: the earbuds handle calls, online meetings, music, and conversations on the move, while the case can sit on a table and capture an in-person conversation on its own. Explorer Edition is a limited preorder form, and features still vary by beta status and region.",
        interactionFlow: "The user holds the case record button or says Hey Plaud to start capture. Earbud force sensors or voice can capture calls and online meetings; the case uses four microphones and AI beamforming for a room conversation. A button can mark a highlight, after which the user can ask about context through the earbuds or case speaker. Plaud Agent uses transcripts and prior context to create summaries, follow-up email, documents, presentations, or actions through Skills, connectors, and MCP-compatible workflows. Complex output returns to Plaud Mobile, Web, or Desktop for review.",
        specsOrStack: "The product page lists three MEMS microphones plus a VPU in each earbud, four MEMS microphones plus AI beamforming in the case, pickup up to 6.6 feet for the earbuds and 16.4 feet for the case, 4G LTE/eSIM, Bluetooth 5.4, a 12mm driver, adaptive ANC up to 40dB, LDAC, IP54 earbuds, IP52 case, and an 830mAh case battery. Listening is up to six hours with ANC off or 4.5 with ANC on; continuous earbud recording is up to six hours and case recording up to 25 hours, with up to 36 hours of total listening and up to 21 days standby.",
        useCases: "Concrete jobs include an in-person client meeting, an online meeting, a phone call, an idea captured while commuting, asking who committed to what, producing a project summary, drafting a follow-up, creating a document, and sending a result into a connected tool. The earbuds are the low-friction mobile entry; the case is designed for a meeting table. The system should not be trusted as an unnoticed public recorder, a high-noise transcription authority, or a verbatim legal record without consent and review.",
        painPointsSolved: "Plaud targets the need to attach a recorder to a phone, retrieve a phone during a meeting, the inability to capture both sides of an online call, and the manual work of turning a transcript into an action. Built-in eSIM lets the case stay connected without a nearby phone, while Agent moves from record to understand to do. The trade is a new account, transcription-minute allowance, credits, and retention system.",
        newTech: "The product combination is dual-form capture across earbuds and case, standalone 4G LTE/eSIM, earbud VPUs, contextual memory, Agent, Skills, connectors, and MCP-compatible workflows. It joins wearable microphones, independent connectivity, and programmable software actions. The hard technical boundary is not whether transcription exists; it is how channels, languages, device position, network, and context are merged, and when the Agent receives permission to act.",
        availability: "The official page lists Explorer Edition at US$249.99 and says it is a limited preorder. It currently names the United States, France, Germany, the United Kingdom, Italy, Spain, Canada, and the Netherlands as available markets, with shipping timing shown at checkout. The edition includes a Starter Plan with 300 transcription minutes and US$200 in Plaud credits; credits, beta features, and 4G coverage vary by region, device, and software version.",
        limitsOrUnknowns: "Plaud does not fully state ongoing Agent costs, the price of each action after credits are exhausted, edge/cloud processing boundaries, transcript retention duration, enterprise administration, how participant notice is surfaced, deletion auditability, future eSIM plans, or beta coverage for every language. TechRadar records Plaud’s statement that users can access, correct, export, and delete data, but the real app path and regional policy still need verification.",
        productVerdict: "This is a confirmed product and one of the clearest current examples of an Agent device that can operate away from a phone. Its value is the joined capture-context-action loop; its risks are equally concrete: recording consent, credits, 4G coverage, earbud endurance, and wrong actions. A buying decision should focus on failure points in real meetings, deletion controls, and whether Agent preserves user control."
      }
    }
  }),
  topic({
    id: "ultrahuman-ring-agent-surface", section: "global", evidenceLabel: "startup signal", evidenceStrength: "media-reported roadmap tied to product interface; future hardware and updates unverified", sourceDate: "2026-09-03", visual: ultrahumanVisual,
    zhHeadline: "Ultrahuman 想让智能戒指成为指针、控制器与 AI 入口", enHeadline: "Ultrahuman wants the smart ring to become a pointer, controller, and AI entry",
    zhFact: "TechCrunch 报道 Qualcomm Ventures 参与 Ultrahuman 9 月 3 日的 US$70M 融资，创始人称 Ring Air 与 Ring Pro 计划在 9 月底前获得游戏控制器、AI 应用交互和第三方开发能力；未来 Qualcomm silicon 戒指则计划把更多软件和算法放到戒指本体。",
    enFact: "TechCrunch reported on September 3 that Qualcomm Ventures joined Ultrahuman’s $70M round. The founder said Ring Air and Ring Pro are planned to gain game-controller, AI-application, and third-party developer capabilities by the end of September, while a future Qualcomm-silicon ring is intended to run more software and algorithms on the ring itself.",
    zhValue: "这个信号把戒指从被动健康数据源变成主动输入设备：手指位置带来指向精度，心率、体温和运动提供上下文，AI 应用可以把它当作低带宽控制器。官方 Ring PRO 页面已经列出 on-chip ML、BLE 5.3、最长 15 天电池和离线存储，但游戏/AI 更新与未来硬件仍未交付。",
    enValue: "The signal turns the ring from a passive health-data source into an active input device: finger position offers precise pointing, while heart rate, temperature, and movement provide context. AI applications could treat it as a low-bandwidth controller. The official Ring PRO page already lists on-chip ML, BLE 5.3, up to 15 days of battery, and offline storage, but the game/AI update and future hardware have not shipped.",
    zhHciLens: ["Input: 手指指向 + 生理上下文", "Compute: ring on-chip ML", "Output: pointer / controller / AI app", "Continuity: health state → interaction state"],
    enHciLens: ["Input: finger pointing + physiology", "Compute: ring on-chip ML", "Output: pointer / controller / AI app", "Continuity: health state → interaction state"],
    zhImplication: "可穿戴 agent 的新入口不一定需要屏幕。关键是把指向、确认、误触、传感器数据权限和健康推断分开，让用户知道一次手势是在控制游戏、车辆、AI 还是写入个人健康画像。",
    enImplication: "A wearable Agent entry does not need a screen. The product must separate pointing, confirmation, accidental activation, sensor-data permission, and health inference so users know whether a gesture controls a game, car, AI, or personal health profile.",
    sources: [source("TechCrunch Ultrahuman and Qualcomm report", ultrahumanTechUrl, "startup signal"), source("Ultrahuman Ring PRO preorder", ultrahumanUrl, "official")],
    dossier: {
      zh: {
        productName: "Ultrahuman Ring Air / Ring Pro agent surface（startup signal）",
        productType: "这是把智能戒指从健康追踪器扩展为软件平台和低带宽输入设备的产品路线。TechCrunch 报道 Ultrahuman 正与 Qualcomm 合作下一代戒指，并计划让现有 Ring Air、Ring Pro 通过软件更新接入游戏控制器、AI 应用和第三方开发。现有产品仍以健康数据为主，agent 能力属于即将到来的产品 surface。",
        interactionFlow: "预期流程是用户佩戴戒指，用手指的位置或手势完成指向、选择或控制，戒指的心率、体温和运动数据为 AI 提供生理上下文；应用通过手机或未来设备接收结果。TechCrunch 还提到 pointer/mouse、game controller、car key 和 AI interface 方向，但没有公布手势词典、确认手势、反馈方式或开发者 API。现阶段可确认的是软件路线被公开谈论，不能描述成已经可用的完整交互。",
        specsOrStack: "Ring PRO 官方页列出 unibody titanium、BLE 5.3、dual-core with on-chip machine learning、最长 15 天电池、戒指本体最长 250 天数据存储、充电盒最长 45 天和最长一年数据存储；Ring AIR 页面列出约 2.4g、4–6 天续航。TechCrunch 称当前戒指使用 Nordic Semiconductor，未来产品将使用 Qualcomm silicon。具体芯片型号、无线协议扩展、手势传感器、AI API 和游戏输入采样率 source not stated。",
        useCases: "路线中明确提到的场景包括用戒指作为游戏控制器、鼠标或指针、车钥匙、AI 应用入口，以及用生理数据增强个性化健康洞察。它可能适合手机不便拿出时的轻量确认、运动中控制、游戏中的低延迟选择和健康 agent 的状态询问。医疗判断、车辆解锁、支付或持续健康推断需要更高的确认、权限和误触门槛。",
        painPointsSolved: "戒指可以减少拿手机、抬腕看表或在小屏上完成低带宽选择的动作；它的位置比耳机更适合做指向器，持续佩戴又能提供人体状态。它没有解决手势学习成本、不同手指尺寸、左右手差异、运动噪声、充电、健康数据敏感性或跨应用权限冲突。",
        newTech: "新技术方向是把 on-chip ML 和更强的 Qualcomm silicon 与可编程输入结合，让戒指本体承担更多软件与算法，减少对手机和云端的依赖。健康数据不再只是 dashboard 的输出，也可能成为 agent 的 context。这个方向的关键不是把模型塞进戒指，而是定义什么计算留在戒指、什么数据能离开戒指、以及开发者如何在不暴露敏感生理信号的情况下使用输入。",
        availability: "Ring AIR 和 Ring PRO 是现有产品，Ring PRO 官方美国预订页标出 US$479、预计 9 月 15 日起发货；具体地区页面和税费会变化。TechCrunch 报道现有产品的游戏控制器、AI 应用和第三方开发更新目标为 9 月底前，未来 Qualcomm-powered ring 的时间、价格和上市市场 source not stated。",
        limitsOrUnknowns: "没有公开最终更新版本、手势/指向 API、开发者审核、数据权限、离线行为、延迟、误触回退、车钥匙安全、健康数据是否上传、第三方应用沙盒、未来 Qualcomm 戒指的尺寸和续航。融资本身不构成产品交付证据，因此本条保持 startup signal，不把路线图当成 confirmed feature。",
        productVerdict: "Ultrahuman 的价值在于把戒指放进 AI 输入栈，而不是再做一个健康 dashboard。当前判断为 startup signal：已有 Ring PRO 硬件和 on-chip ML 证据，agent/controller/developer surface 仍待更新和实测。下一关是 SDK、真机手势、权限边界和在运动状态下的误触率。"
      },
      en: {
        productName: "Ultrahuman Ring Air / Ring PRO agent surface, a startup signal",
        productType: "This is a product direction that expands a smart ring from a health tracker into a software platform and low-bandwidth input device. TechCrunch reported that Ultrahuman is working with Qualcomm on a next-generation ring and plans to bring game-controller, AI-application, and third-party developer capabilities to existing Ring Air and Ring PRO through a software update. The existing product remains health-first; the Agent surface is an upcoming direction.",
        interactionFlow: "The intended flow is that a wearer uses finger position or gestures for pointing, selection, or control, while heart rate, temperature, and movement provide physiological context to an AI. An application would receive the result through a phone or future device. TechCrunch mentions a pointer or mouse, game controller, car key, and AI interface, but no gesture vocabulary, confirmation gesture, feedback channel, or developer API has been published. The evidence supports a public roadmap, not a complete usable interaction.",
        specsOrStack: "Ultrahuman’s Ring PRO page lists a unibody titanium build, BLE 5.3, dual-core with on-chip machine learning, up to 15 days of battery, up to 250 days of on-ring storage, a case with up to 45 days of battery, and up to a year of case storage. Ring AIR is listed at about 2.4g with four to six days of battery. TechCrunch says current rings use Nordic Semiconductor and a future product will use Qualcomm silicon. Exact chip, wireless extensions, gesture sensors, AI API, and game-input sampling rate are source not stated.",
        useCases: "The reported direction covers a game controller, pointer or mouse, car key, AI-application entry, and personalised health insight using physiology as context. It could suit lightweight confirmation when a phone or watch is inconvenient, movement control, low-latency game selection, and questions to a health Agent. Medical decisions, vehicle unlock, payments, or continuous health inference require stronger confirmation, permission, and accidental-trigger boundaries.",
        painPointsSolved: "A ring could reduce phone retrieval, wrist-raising, and small-screen selection. Its finger position is promising for pointing, while continuous wear supplies body-state context. It does not solve gesture-learning cost, finger-size and handedness differences, motion noise, charging, sensitive health data, or cross-application permission conflicts.",
        newTech: "The new direction combines on-chip ML and stronger future Qualcomm silicon with programmable input so more software and algorithms can run on the ring, reducing dependence on a phone or cloud. Health data becomes potential Agent context rather than only dashboard output. The hard product question is which computation stays on-ring, what data may leave it, and how developers can use input without exposing sensitive physiology.",
        availability: "Ring AIR and Ring PRO are current products; the US Ring PRO preorder page lists US$479 with shipping from September 15, subject to regional tax and availability. TechCrunch reports a target of end-September for the existing-product game-controller, AI-app, and developer update. Timing, price, and markets for a Qualcomm-powered ring are source not stated.",
        limitsOrUnknowns: "No final update build, gesture or pointing API, developer review process, data permissions, offline behaviour, latency, accidental-trigger fallback, car-key safety, health-data upload rule, third-party sandbox, or Qualcomm-ring size and endurance has been published. Funding is not delivery evidence, so this remains a startup signal rather than a confirmed feature.",
        productVerdict: "Ultrahuman’s product opportunity is to put the ring into the AI input stack rather than build another health dashboard. Verdict: startup signal. Ring PRO hardware and on-chip ML are evidenced; the Agent, controller, and developer surfaces still need shipping and testing. The next gate is an SDK, real gestures, permission boundaries, and accidental-trigger rates during movement."
      }
    }
  }),
  topic({
    id: "lenovo-qira-upgrade-friction-scan", section: "community", dossierKind: "scan", evidenceLabel: "review/community friction", evidenceStrength: "community reports and prior hands-on context; no independent causal verification", sourceDate: "2026-09-01", visual: qiraCommunityVisual,
    zhHeadline: "社区扫描：Qira 的升级路径仍可能把 agent 变成系统维护事件", enHeadline: "Community scan: Qira’s upgrade path can still turn an Agent into a maintenance event",
    zhFact: "本期扫描 Lenovo 社区中 9 月 1 日关于 Qira 安装后无法进入 start menu 的个案，以及更早关于升级后无法启动、风扇异常和维修等待的帖子；这些是摩擦信号，不升级为 Qira 已造成故障的产品事实。",
    enFact: "This scan covers a September 1 Lenovo-community report that Qira could not get past the start menu, alongside earlier posts about boot failure, fan load, and repair waits after an upgrade. These are friction signals, not evidence that Qira caused a systemic product failure.",
    zhValue: "社区没有提供足够样本证明因果，因此本条不推广“Qira 会弄坏电脑”的结论。它真正暴露的是 agent 安装、系统更新、性能负载、回滚和保修之间缺少可见的恢复状态；用户需要知道更新是否完成、是否可回滚、数据是否安全和何时转人工支持。",
    enValue: "The community does not provide enough samples for causal claims, so this scan does not promote “Qira breaks computers.” It does expose an interaction gap between Agent installation, system update, performance load, rollback, and warranty: users need to know whether the update finished, whether rollback is safe, whether data is intact, and when to reach human support.",
    zhHciLens: ["Scanned: 安装/更新反馈", "Signal: 启动、风扇、维修", "Missing: 因果与样本", "Watch: 回滚与支持状态"],
    enHciLens: ["Scanned: install/update reports", "Signal: boot, fan, repair", "Missing: causality and sample", "Watch: rollback and support state"],
    zhImplication: "系统级 agent 的 onboarding 必须提供 preflight、备份提示、进度、回滚、错误码和人工支持入口；社区个案可以触发 QA，但不能替代版本化回归。",
    enImplication: "System-level Agent onboarding needs preflight, backup guidance, progress, rollback, error codes, and human support. A community anecdote can trigger QA, but it cannot replace versioned regression testing.",
    sources: [source("Lenovo community Qira installation report", qiraCommunityUrl, "community"), source("Windows Central Qira hands-on", qiraReviewUrl, "hands-on review")],
    dossier: {
      zh: {
        productName: "Lenovo Qira 升级路径（社区摩擦扫描，不是故障定论）",
        productType: "本条是 source-lane scan，扫描 Qira 从 Lenovo AI Now 或既有系统入口升级后的启动、性能和维修反馈。它不是一个新的硬件产品条目，也不把少数 Reddit 个案推导成普遍故障。扫描对象是 agent 被安装为系统体验后，用户如何理解、恢复和求助。",
        interactionFlow: "用户收到升级提示，安装 Qira，等待系统重启或进入 start menu，再在 PC 上使用 AI。社区帖子描述了个别用户在安装后无法进入 start menu、设备像无法启动、风扇高负载或需要维修的经历；其他回复也出现回滚、重装和主板维修讨论。帖子没有统一设备型号、版本、日志和复现步骤，因此无法建立因果链。",
        specsOrStack: "可确认的公开 stack 包括 Lenovo PC、Qira、原有 AI Now 入口以及 Windows/设备更新路径；官方另称符合条件的 PC 从 16GB memory 起。社区没有提供统一的 Qira build、BIOS、驱动、Windows 版本或硬件清单，具体资源消耗、更新包大小、回滚机制、日志位置和恢复分区 source not stated。",
        useCases: "扫描关注的场景是个人电脑升级、企业 IT 批量部署、用户在更新后恢复工作、遇到风扇噪声或启动失败时进入支持流程。它没有发现足够证据证明 Qira 在所有机器上触发这些问题，也没有发现正式的版本公告把这些社区案例归因于 Qira。下一步应按机型、版本和安装路径做可复现测试。",
        painPointsSolved: "社区信号指向安装透明度、失败恢复、回滚和维修等待的痛点，而非 Qira 的核心回答能力。对用户来说，系统 agent 的安装失败会让“便利的助手”变成工作中断；对企业来说，缺少可审计的 preflight 和 rollback 会增加部署风险。",
        newTech: "本扫描没有确认新的技术事实。它提示产品团队需要把 agent 更新当作系统状态机：下载、校验、安装、重启、可用、降级、回滚、支持和数据完整性都应该有可见状态。社区内容只能作为 QA 输入，不应升级为 confirmed product claim。",
        availability: "Qira 官方 rollout 正在扩展，符合条件的用户可从 Lenovo 下载；社区帖子表明至少有用户已看到升级提示。具体受影响版本、地区和设备覆盖 source not stated；没有证据支持“所有用户都可用”或“所有故障都由 Qira 引起”。",
        limitsOrUnknowns: "缺少样本量、设备清单、版本号、日志、复现率、维修结论和 Lenovo 正式 incident notice。社区投票数很小，回复也可能混入其他 Lenovo 更新或硬件故障。需要官方 release note、可回滚安装包、support runbook 和独立 QA 才能判断风险。",
        productVerdict: "这是 review/community friction scan：值得触发版本化回归与安装 UX 审计，不能成为 Qira 故障的事实定论。判断重点是恢复路径是否比安装宣传更清楚；如果用户不知道如何回滚、保数据和联系支持，系统 agent 的信任会先于功能建立失败。"
      },
      en: {
        productName: "Lenovo Qira upgrade path, a community-friction scan rather than a failure verdict",
        productType: "This is a source-lane scan of boot, performance, and support reports after Qira appeared as an upgrade from Lenovo AI Now or an existing system entry. It is not a new hardware dossier and it does not generalise a few Reddit reports into a systemic failure. The object of the scan is how users understand, recover from, and seek help after a system-level Agent install.",
        interactionFlow: "A user receives an upgrade prompt, installs Qira, waits through a restart or opens the start menu, and then uses the AI on the PC. Community posts describe individual cases in which the start menu did not work, a machine appeared not to boot, fans became loud, or a repair was required; replies discuss rollback, reinstall, and motherboard service. The posts do not share a consistent model, build, log, or reproduction path, so they cannot establish causality.",
        specsOrStack: "The public stack includes a Lenovo PC, Qira, the earlier AI Now entry, and the Windows/device update path; Lenovo separately says eligible PCs start at 16GB memory. The community material does not provide a consistent Qira build, BIOS, driver, Windows version, or hardware list. Resource use, package size, rollback mechanism, log location, and recovery partition are source not stated.",
        useCases: "The scan covers a personal-PC upgrade, enterprise IT deployment, work recovery after an update, fan-noise investigation, and support after a boot problem. It found no sufficient evidence that Qira causes these outcomes on all machines, and no formal release note attributing the anecdotes to Qira. The next step is reproducible testing by model, build, and install path.",
        painPointsSolved: "The signals point to install transparency, failure recovery, rollback, and repair-wait pain rather than Qira’s answer quality. For a user, a failed system Agent install turns a promised convenience into a work interruption. For IT, the absence of auditable preflight and rollback increases deployment risk.",
        newTech: "This scan confirms no new technical fact. It suggests treating an Agent update as a visible system state machine: download, verify, install, restart, ready, degraded, rollback, support, and data integrity. Community content can feed QA, but it should not be upgraded into a confirmed product claim.",
        availability: "Qira’s official rollout is expanding and eligible users can download it from Lenovo; community posts show that at least some users have received prompts. Affected builds, regions, and device coverage are source not stated. There is no evidence that every user has access or that every reported failure came from Qira.",
        limitsOrUnknowns: "Missing evidence includes sample size, device list, build number, logs, reproduction rate, repair conclusion, and an official Lenovo incident notice. Small vote counts and replies may combine Qira with other Lenovo updates or unrelated hardware faults. An official release note, rollback package, support runbook, and independent QA are needed to assess risk.",
        productVerdict: "This is a review/community friction scan: it should trigger versioned regression and installation-UX review, not a Qira failure verdict. The key question is whether recovery is clearer than the installation pitch. If users cannot see how to roll back, preserve data, or reach support, a system Agent will lose trust before its features earn it."
      }
    }
  }),
  topic({
    id: "plaud-one-china-market-scan", section: "china", dossierKind: "scan", evidenceLabel: "weak/unverified", evidenceStrength: "Chinese media scan; availability and local service boundary not independently verified", sourceDate: "2026-09-01", visual: plaudChinaVisual,
    zhHeadline: "中国 lane 扫描：Plaud One 的 eSIM 形态先进入价格与渠道讨论", enHeadline: "China lane scan: Plaud One’s eSIM form factor enters a price-and-channel discussion",
    zhFact: "IT之家 9 月 1 日报道 Plaud One 耳机与 4G LTE eSIM 形态，并引用 US$249.99 与限量 2,000 台；官方产品页同时列出加拿大等市场，但没有在该中国报道中给出中国大陆购买、运营商、售后或本地语言服务承诺。",
    enFact: "An ITHome report dated September 1 covered Plaud One’s earbuds plus 4G LTE eSIM form factor and cited US$249.99 and a 2,000-unit limit. The official product page names markets including Canada, but this China report does not establish mainland China sales, carrier, service, or local-language support.",
    zhValue: "本条不把海外定价当作中国可买价格，也不把中文媒体报道当作本地上市公告。它扫描到的产品信号是：独立联网耳机让“AI 纪要”从手机配件变成有通信成本的 wearable；渠道与数据合规会决定它能否进入会议、教育和企业场景。",
    enValue: "This scan does not treat an overseas price as a China retail price or a Chinese media report as a mainland launch notice. The product signal is that an always-connected AI note-taking earbud becomes a wearable with communications cost rather than a phone accessory; channel and data-compliance details will decide whether it can enter meetings, education, and enterprise workflows.",
    zhHciLens: ["Scanned: 中国媒体产品报道", "Signal: eSIM + 限量定价", "Missing: 本地购买与服务", "Watch: 运营商/合规/语言"],
    enHciLens: ["Scanned: Chinese product coverage", "Signal: eSIM + limited price", "Missing: local sale and service", "Watch: carrier/compliance/language"],
    zhImplication: "跨境 wearable 的产品页需要把地区、网络、数据路径、退货、发票、售后和语言单独写清；硬件形态进入中国讨论，不等于产品已经进入中国工作流。",
    enImplication: "A cross-border wearable needs separate disclosure for region, network, data path, returns, invoicing, service, and language. A hardware form factor entering China discussion does not mean the product has entered a China workflow.",
    sources: [source("IT之家 Plaud One report", plaudChinaUrl, "China"), source("Plaud One official product page", plaudUrl, "official")],
    dossier: {
      zh: {
        productName: "Plaud One 中国市场信号扫描（非大陆上市确认）",
        productType: "本条是中国 source lane 的扫描卡，关注 Plaud One 如何被中文媒体描述为带 eSIM 的 AI 纪要耳机。它不把报道里的美元价格、限量数量或海外预订自动转换成中国大陆销售事实，也不替 Plaud 推断运营商和数据合规路径。",
        interactionFlow: "报道呈现的核心流程是耳机佩戴后捕获电话、线上会议和移动对话，充电盒独立联网并记录面对面会议，再由 AI 转写、总结和生成行动。中国用户真正需要的额外步骤包括本地购买、SIM/eSIM 激活、中文识别、账号注册、发票、售后和数据导出；这些步骤在 IT之家报道与官方产品页中没有被完整确认。",
        specsOrStack: "可交叉确认的产品规格来自官方页：4G LTE/eSIM、Bluetooth 5.4、耳机与盒子麦克风、耳机最长 6 小时连续录音、盒子最长 25 小时连续录音，以及 US$249.99 Explorer Edition 预订价。IT之家报道提到限量 2,000 台。中国大陆频段、运营商、服务器区域、中文 Agent、备案、保修和本地支付 source not stated。",
        useCases: "扫描关注会议纪要、课堂记录、采访、销售拜访、通勤灵感和企业知识库入口。它可能吸引需要在没有手机时捕获上下文的用户，但录音同意、跨境数据、账号服务和耳机续航会直接决定能否在真实会议中使用。当前证据不足以确认中国大陆消费者能否下单或获得完整功能。",
        painPointsSolved: "eSIM 形态解决附近手机依赖，耳机形态解决手持录音器的携带和佩戴摩擦；Agent 试图减少会后整理。中国市场扫描暴露的痛点则转向渠道、运营商、数据处理、中文准确率和售后。产品信号进入讨论，不代表这些问题已有解决方案。",
        newTech: "本扫描确认的技术信号是将独立 4G 连接与 conversation-first agent 合在耳机/盒子组合中。它没有确认新的中国本地技术或合规能力。中国产品化的关键会是网络与云服务落点、中文/方言表现、数据删除、企业管理和离线降级。",
        availability: "IT之家报道时间为 2026 年 9 月 1 日；官方页显示 Explorer Edition 为海外限量预订，列出美国、法国、德国、英国、意大利、西班牙、加拿大和荷兰等市场。中国大陆是否销售、售价、发货、运营商支持和本地售后均 source not stated。",
        limitsOrUnknowns: "缺少中国大陆订单页、官方中文公告、网络覆盖说明、数据合规政策、中文/方言评测、发票和维修路径。媒体报道的限量 2,000 台也需要与官方 checkout 或正式公告交叉验证。这个扫描条目不应被引用为中国已上市产品。",
        productVerdict: "判断为 weak/unverified China scan：产品形态与海外规格可追踪，中文媒体已把它带入本地价格与渠道讨论，但大陆可购买性、服务和合规全部待核。下一步应等待官方中国页面或本地真实订单与售后证据。"
      },
      en: {
        productName: "Plaud One China-market signal scan, not a mainland-China launch confirmation",
        productType: "This is a China source-lane scan of how Chinese media describes Plaud One as an eSIM-enabled AI note-taking earbud. It does not convert a dollar price, a limited quantity, or an overseas preorder into a mainland-China sales fact, and it does not infer a carrier or data-compliance path for Plaud.",
        interactionFlow: "The reported flow is that earbuds capture calls, online meetings, and mobile conversations; the case stays connected and records an in-person meeting; AI then transcribes, summarises, and creates actions. A China user would also need local purchase, eSIM activation, Chinese recognition, account registration, invoice, service, and export. Those steps are not fully confirmed by the ITHome report or official product page.",
        specsOrStack: "Cross-checkable specs from the official page include 4G LTE/eSIM, Bluetooth 5.4, microphones in earbuds and case, up to six hours of continuous earbud recording, up to 25 hours of case recording, and a US$249.99 Explorer Edition preorder. ITHome cites a 2,000-unit limit. Mainland bands, carrier, server region, Chinese Agent, registration, warranty, and local payment are source not stated.",
        useCases: "The scan looks at meeting notes, classroom recording, interviews, sales visits, commuting ideas, and enterprise knowledge capture. The form could attract users who want context without a nearby phone, but consent, cross-border data, account service, Chinese accuracy, and endurance decide whether it works in a real meeting. The evidence is insufficient to establish that mainland consumers can order it or receive the full feature set.",
        painPointsSolved: "An eSIM addresses dependence on a nearby phone, an earbud form reduces the carrying friction of a handheld recorder, and Agent targets post-meeting organisation. The China-market scan shifts the pain points to channel, carrier, data handling, Chinese recognition, and service. Entering the discussion does not mean those problems are solved.",
        newTech: "The confirmed technology signal is the combination of independent 4G connectivity with a conversation-first Agent across earbuds and case. The scan confirms no new China-specific technology or compliance capability. Local productisation will depend on network and cloud location, Chinese and dialect performance, deletion, enterprise controls, and offline degradation.",
        availability: "The ITHome report is dated September 1, 2026. The official page presents Explorer Edition as a limited overseas preorder and names the United States, France, Germany, the United Kingdom, Italy, Spain, Canada, and the Netherlands among current markets. Mainland sales, price, shipping, carrier support, and local service are source not stated.",
        limitsOrUnknowns: "Missing evidence includes a mainland order page, official Chinese announcement, network coverage, data-compliance policy, Chinese or dialect testing, invoice, and repair path. The reported 2,000-unit limit also needs confirmation against an official checkout or release. This scan must not be cited as a China launch.",
        productVerdict: "Verdict: weak/unverified China scan. The form factor and overseas specifications are traceable, and Chinese media has brought it into a local price-and-channel conversation, but mainland availability, service, and compliance remain unverified. The next gate is an official China page or real local order and support evidence."
      }
    }
  })
];

const todayTopics = [
  topic({
    id: "htc-vive-eagle-regional-launch", section: "global", evidenceLabel: "confirmed product", evidenceStrength: "HTC product documentation plus regional launch report; service limits remain region-dependent", sourceDate: "2026-09-03", visual: viveVisual,
    zhHeadline: "HTC VIVE Eagle 把 AI 眼镜的竞争带到价格、订阅与隐私开关", enHeadline: "HTC VIVE Eagle brings the AI-glasses fight to price, subscriptions, and privacy switches",
    zhFact: "HTC 台湾产品页披露 VIVE Eagle 支持 1200 万像素相机、最高 3K 影片、90+ 种实时翻译语言、70+ 种图像翻译语言、235mAh 电池、IP54、Android 10+/iOS 17.6+；T3 报道美国售价 US$499、欧盟 €469、英国 £429，分区发货时间不同。",
    enFact: "HTC's Taiwan product page lists a 12MP camera, up to 3K video, 90-plus real-time-translation languages, 70-plus image-translation languages, a 235mAh battery, IP54, and Android 10+/iOS 17.6+. T3 reports US$499 in the US, €469 in the EU, and £429 in the UK, with different regional shipping dates.",
    zhValue: "VIVE Eagle 的产品合同很完整：镜腿快捷键或语音触发拍摄、翻译、场景识别、记忆和 Notes，开放式音频把结果送到耳边，手机 App 负责初次配对、内容管理、更新和部分 AI 连接。相机灯被遮挡、眼镜未佩戴时相机会停用；这让隐私规则从软件提示变成硬件联动。它的现实门槛也更清楚：核心 AI 依赖手机与网络，Plus/Pro 订阅、地区语言和额度会改变功能，价格还高于 Meta 的主流基线。",
    enValue: "VIVE Eagle has a relatively complete product contract: a temple shortcut or voice can trigger capture, translation, scene recognition, memory, and Notes; open-ear audio returns the result while a phone app handles first pairing, content management, updates, and some AI connectivity. The camera disables when the indicator is covered or the glasses are not worn, turning privacy from a software prompt into a hardware-linked rule. The real boundary is also clear: core AI depends on a phone and network, while Plus/Pro subscriptions, regional languages, and quotas change the feature set. The price sits above Meta's mainstream baseline.",
    zhHciLens: ["Input: 语音 + 镜腿快捷键", "Context: 相机 + 手机网络", "Output: 开放式音频", "Safety: 灯被遮挡即停用相机"],
    enHciLens: ["Input: voice + temple shortcut", "Context: camera + phone network", "Output: open-ear audio", "Safety: camera disabled when indicator is blocked"],
    zhImplication: "评测 VIVE Eagle 不能只测翻译准确率，还要记录订阅层级、手机依赖、录音授权、灯光失败、竖屏素材管理和长时间佩戴后的可恢复性。",
    enImplication: "Evaluating VIVE Eagle requires more than translation accuracy: teams should record subscription tier, phone dependence, recording consent, indicator failure, portrait-media handling, and recovery after long wear.",
    sources: [source("HTC VIVE Eagle Taiwan product page", viveUrl, "official"), source("T3 regional launch report", viveReviewUrl, "hands-on review"), source("Taiwan Mobile VIVE Eagle offer", viveTaiwanMobileUrl, "regional product page")],
    dossier: {
      zh: {
        productName: "HTC VIVE Eagle（AI 智慧眼鏡，confirmed product）",
        productType: "VIVE Eagle 是 HTC 的相机型开放式音频 AI 眼镜，面向日常、工作和旅行，把语音助手、第一人称拍摄、图像/实时翻译、AI Notes 与手机助手连接放在同一副眼镜里。它已经在台湾有官方产品与通路页面，T3 在 9 月 3 日报道美国、欧盟和英国的区域上市价格，因此可以按 confirmed product 记录；不同地区的服务、订阅和发货仍要分开看。",
        interactionFlow: "用户通过语音指令或自定义快捷键拍照、录像、询问眼前物体、翻译印刷文字、开启对话/聆听翻译、保存记忆或记录会议。VIVE AI Notes 可把对话转为逐字稿、区分说话者并生成摘要；手机上的 VIVE Connect 负责初次配对、内容管理、软件更新和部分 AI 连接。相机启动时拍摄指示灯亮起，眼镜未佩戴或指示灯遭遮蔽时相机自动停用。部分 AI 功能需要 HTC 账号、联网手机、授权或 Plus/Pro 方案，实际流程随地区和语言变化。",
        specsOrStack: "HTC 台湾页列出 1200 万像素超广角相机、3024×4032 照片、最高 3K 视频、默认 3 分钟且最长连续 10 分钟录像、235mAh 电池、超过 36 小时待机、约 4.5 小时连续音乐、超过 3 小时连续通话、磁吸快充、IP54，以及 Android 10+ 或 iOS 17.6+ 手机兼容。实时翻译列出 90+ 种语言、图像翻译 70+ 种语言。SoC、RAM、存储、麦克风数量、AI 端云分工、镜片参数、真实续航与 API source not stated。",
        useCases: "具体场景包括旅行中看菜单和路牌、与外语对象对话、会议/访谈/课程记录、骑行或移动工作时的第一人称视频、询问植物/动物/地标、免手拨号与提醒、以及用语音保存稍后可查的笔记。开放式音频保留环境感知，眼镜快捷键适合不方便拿手机的瞬时操作。重度办公、离线翻译、长文输入、企业设备管理、医疗或高风险沟通仍缺乏完整验证。",
        painPointsSolved: "VIVE Eagle 针对四个具体摩擦：拿手机才能拍摄或翻译、相机型眼镜缺少旁人可见的状态、会议内容需要会后手工整理、以及旅行时频繁切换翻译 App。语音与快捷键缩短进入路径，Notes 把录音和整理放在同一产品链路，指示灯与未佩戴检测给隐私提供硬件边界。它没有消除网络、订阅、手机配对、授权与地区差异，价格也可能抬高第一次尝试的门槛。",
        newTech: "产品新意集中在把多个模型服务、相机、开放式音频和隐私状态合成一个可穿戴入口。HTC 明确说不同地区可使用 Google Gemini 或 OpenAI GPT 等服务，并把 VIVE AI 与手机内建 Google Assistant/Siri 分开组织；实时翻译还有 Conversation Mode 与 Listening Mode。拍摄指示灯被遮蔽即停用相机，是把社会可见性写进设备状态机的设计。模型选择、调用路由、离线能力、个人数据是否离开手机和订阅后的额度控制 source not stated。",
        availability: "台湾官方页面提供官网与合作眼镜通路购买，台湾大哥大等通路也发布了 3K 录像与实时翻译方案。T3 报道美国 US$499、欧盟 €469、英国 £429；美国从 9 月 3 日起发货，英国 9 月 21 日上市，欧盟日期按区域安排。镜片更换需由合作门市评估，价格、度数、保固和完整功能因地区而异。",
        limitsOrUnknowns: "官方已提醒翻译质量会受语言组合、方言、口音、噪声、光线、网络和地区支援影响，Notes 可能需要授权、联网或订阅。没有公开 SoC、RAM、存储、隐私日志、完整开发者 API、离线模型、企业管理、真实连续拍摄续航和第三方长期佩戴测试。台湾页写明 AI 由第三方 LLM 生成，HTC 不保证内容正确；用户仍需遵守录音录像法律并取得必要同意。",
        productVerdict: "VIVE Eagle 是目前较完整的 AI 眼镜产品之一，优势在于拍摄、翻译、记忆、Notes 和隐私开关形成连续路径，短板在于手机/网络/订阅依赖以及地区差异。产品判断：confirmed product，适合把它当作可购买的工作与旅行入口评估；下一个关键问题是不同市场的订阅价值、翻译实测、灯光失败回退和长时间录像热/电量表现。"
      },
      en: {
        productName: "HTC VIVE Eagle, an AI smart-glasses confirmed product",
        productType: "VIVE Eagle is HTC's camera-equipped, open-ear AI-glasses product for everyday life, work, and travel. It combines voice assistance, first-person capture, image and live translation, AI Notes, and phone-assistant integration in one wearable. HTC has an official Taiwan product and retail-channel surface, while T3 reported regional launch pricing for the US, EU, and UK on September 3. It is therefore a confirmed product, although service, subscription, and shipping boundaries remain regional.",
        interactionFlow: "The wearer uses voice or a custom shortcut to take photos and videos, ask about a visible object, translate printed text, start conversation or listening translation, save a memory, or record a meeting. VIVE AI Notes can transcribe conversations, identify speakers, and produce summaries; the VIVE Connect phone app handles first pairing, content management, software updates, and parts of AI connectivity. A visible capture indicator turns on while the camera is used, and the camera is disabled when the glasses are not worn or the indicator is obstructed. Some AI features require a HTC account, a connected phone, network access, permission, or a Plus/Pro plan, so the flow changes by region and language.",
        specsOrStack: "HTC's Taiwan page lists a 12MP ultra-wide camera, 3024 by 4032 photos, up to 3K video, a default three-minute recording with up to ten minutes continuously, a 235mAh battery, more than 36 hours of standby, about 4.5 hours of continuous music, more than three hours of continuous calls, magnetic fast charging, IP54, and Android 10+ or iOS 17.6+ phone compatibility. Live translation is listed for more than 90 languages and image translation for more than 70. SoC, RAM, storage, microphone count, edge/cloud division, lens data, measured endurance, and developer API are source not stated.",
        useCases: "Concrete use cases include reading menus and signs while travelling, conducting a conversation with someone speaking another language, capturing meetings, interviews, and classes, recording first-person video while moving, asking about plants, animals, and landmarks, making calls, setting reminders, and storing notes to retrieve later. Open-ear audio preserves environmental awareness, and the shortcut is useful when retrieving a phone is inconvenient. Heavy office work, offline translation, long-form input, enterprise administration, and high-risk medical or legal conversations still lack full verification.",
        painPointsSolved: "VIVE Eagle targets four specific frictions: needing a phone to capture or translate, a camera wearable lacking a bystander-readable state, manually organising recorded conversations, and switching between translation apps while travelling. Voice and a shortcut shorten entry; Notes keeps capture and organisation in one chain; and the indicator plus not-worn detection provide a hardware privacy boundary. It does not remove network, subscription, phone-pairing, permission, or regional differences, and the price may raise the first-use barrier.",
        newTech: "The product novelty is a wearable entry point that combines several model services, a camera, open-ear audio, and a privacy state. HTC says different regions can use services such as Google Gemini or OpenAI GPT, while VIVE AI is organised separately from Google Assistant or Siri on the phone. Live translation has both Conversation Mode and Listening Mode. Disabling the camera when the indicator is obstructed writes social visibility into the device state machine. Model routing, offline capability, whether personal data leaves the phone, and post-subscription quota behaviour are source not stated.",
        availability: "The Taiwan official page exposes direct and partner-optician purchase paths, and Taiwan Mobile has published an offer covering 3K recording and live translation. T3 reports US$499 in the US, €469 in the EU, and £429 in the UK; US shipping began September 3, while the UK is scheduled for September 21 and EU timing varies by market. Prescription-lens replacement is assessed by partner stores, and price, supported prescriptions, warranty, and feature coverage vary regionally.",
        limitsOrUnknowns: "HTC warns that translation quality depends on language pair, dialect, accent, noise, lighting, network, and regional support, while Notes may require permission, a connection, or a subscription. There is no published SoC, RAM, storage, privacy log, complete developer API, offline model, enterprise control, real continuous-capture endurance test, or independent long-wear review. The Taiwan page says AI responses come from third-party LLMs and are not guaranteed; users remain responsible for consent and local recording law.",
        productVerdict: "VIVE Eagle is one of the more complete AI-glasses products currently available because capture, translation, memory, Notes, and privacy controls form one path. Its weaknesses are phone, network, subscription, and regional dependence. Verdict: confirmed product. It is ready for a real work-and-travel evaluation; the next questions are subscription value by market, translation in noise, indicator-failure recovery, and heat and battery behaviour during long recording."
      }
    }
  }),
  topic({
    id: "tuya-doova-senior-companion-robot", section: "official", evidenceLabel: "confirmed product", evidenceStrength: "Tuya official IFA 2026 announcement; price, order path, and delivery not stated", sourceDate: "2026-09-04", visual: doovaVisual,
    zhHeadline: "Tuya Doova 把独居老人的安全响应、陪伴与家居控制放进移动机器人", enHeadline: "Tuya Doova puts safety response, companionship, and home control into a mobile robot",
    zhFact: "Tuya 9 月 4 日在 IFA 2026 公布 Doova：LDS LiDAR、四麦克风声源定位、AI 视觉骨骼识别、双轮驱动、360 度房间扫描、自动回充、10.1 英寸高清屏，以及 60 秒无回应后向家人发起双向视频告警。",
    enFact: "Tuya unveiled Doova at IFA 2026 on September 4 with LDS LiDAR, four-microphone sound-source localisation, AI vision skeletal recognition, dual-wheel drive, 360-degree room scans, autonomous docking, a 10.1-inch HD display, and a two-way video alert to family after 60 seconds without a response.",
    zhValue: "Doova 的核心流程不是把聊天机器人装进轮子，而是让“发现异常—移动到人身边—判断是否回应—联系家人”成为一条现场状态链。它还把账单/信件解释、防诈骗提示、药物提醒、智能家居操作和远程安全报告连到 Tuya AIoT 生态。对老人来说，显示屏与动态表情降低设备感；对家人来说，节点式巡检比沿墙巡逻更直接。但跌倒识别、误报、隐私、夜间能力与紧急联络责任仍需要真机验证。",
    enValue: "Doova's core flow is not simply a chatbot on wheels. It makes “detect an anomaly, move to the person, check for a response, and contact family” one field-state chain. It also links bill and letter interpretation, scam warnings, medication reminders, smart-home operation, and remote safety reports to Tuya's AIoT ecosystem. A display and expressive face reduce the feeling of operating equipment for the older user; node-oriented scanning gives family members a more direct report than wall-following patrol. Fall detection, false alarms, privacy, night performance, and emergency responsibility still need hands-on evidence.",
    zhHciLens: ["Input: 声音 + LiDAR + 骨骼识别", "Action: 移动到用户身边", "Feedback: 10.1 英寸屏 + 视频告警", "Recovery: 自动回充 + 家人接管"],
    enHciLens: ["Input: sound + LiDAR + skeletal vision", "Action: move to the user", "Feedback: 10.1-inch display + video alert", "Recovery: auto-dock + family handoff"],
    zhImplication: "陪伴机器人要把异常判定、人工接管、误报撤销、家庭成员权限和健康建议边界做成可审计状态；“情感智能”不能替代医疗或急救承诺。",
    enImplication: "A companion robot needs auditable states for anomaly detection, human takeover, false-alarm cancellation, family permissions, and health-advice boundaries; emotional intelligence cannot substitute for medical or emergency guarantees.",
    sources: [source("Tuya Doova official IFA announcement", doovaUrl, "official"), source("Tuya developer platform", "https://developer.tuya.com/", "developer surface"), source("IFA Next 2026 robotics programme", "https://www.ifa-berlin.com/press-releases/ifa-next-2026", "global")],
    dossier: {
      zh: {
        productName: "Tuya Doova（独居老人 AI 家庭陪伴机器人，confirmed product）",
        productType: "Doova 是 Tuya 在 IFA 2026 公布的移动家庭机器人，目标用户是独居或希望保持独立生活的老人。它把安全巡检、紧急响应、对话陪伴、日常提醒、文件理解、反诈提示和智能家居控制合在一个有屏幕、有轮子、有感知器的家庭节点里。Tuya 的公告构成 confirmed product 证据，但仍没有给出价格、下单页或量产交付时间。",
        interactionFlow: "老人跌倒或遇到异常时可以呼叫“Hey Tuya, help”；系统用声音定位与视觉骨骼识别判断位置，机器人移动到身边并实时评估。如果 60 秒内没有检测到回应，Doova 会向家人发起双向 live video call 告警。日常交互可通过自然语言询问账单、信件、可疑诈骗、药物提醒、天气、日程、食谱、园艺或智能家电操作；家人不在家时，机器人按房间节点移动，每个位置做 360 度扫描，再把安全报告发到手机。",
        specsOrStack: "Tuya 披露 LDS LiDAR、四麦克风声源定位系统、AI 视觉骨骼识别、多模态大语言模型、双轮驱动加脚轮、360 度扫描、自动回充、10.1 英寸高清显示屏和动态表情。平台侧关联 Tuya AIoT、TuyaOS、TuyaOpen、IoT Core 与 AI Agent 开发平台。处理器、摄像头分辨率、内存、存储、网络制式、云端区域、续航、地图格式、API 权限与加密实现 source not stated。",
        useCases: "公开场景覆盖独居老人跌倒响应、家属远程查看、安全巡检、陪伴聊天、娱乐播放、复杂账单和信件解释、潜在诈骗识别、药物与日程提醒、轻量互动游戏、控制灯光/窗帘/厨房/浴室设备，以及未来的全屋找物。它适合需要低学习成本、可移动到人身边的家庭支持场景；医疗诊断、自动呼叫急救、替代护理人员、处理高风险财务或在停电断网时持续保护，都不能从公告中推断。",
        painPointsSolved: "Doova 试图解决的是“出事后多久有人知道”的时间差、老人面对复杂智能家居的操作门槛、固定摄像头带来的被监控感、以及家属无法持续了解家中状态。移动到用户身边、60 秒告警、节点式扫描和手机报告把关注点从单点摄像头转为事件响应。屏幕高度适配站立、坐下和躺卧，动态表情也降低了冷冰冰设备的距离感。它没有说明误报如何撤销、家属如何分级接管或老人如何拒绝一次监测。",
        newTech: "新技术组合是 LDS LiDAR、声音源定位、视觉骨骼识别和多模态对话模型共同驱动一个家庭移动体，而不是让单一传感器直接触发警报。节点式 coverage strategy 以房间中心为观察位置，减少沿墙巡逻对空间布局的依赖；Tuya AIoT 生态让灯光、窗帘、厨卫设备成为动作对象。公告未说明模型是在设备端、边缘网关还是云端运行，也未公开跌倒分类阈值、误报处理或跨家庭数据隔离。",
        availability: "Doova 于 2026 年 9 月 4 日在 IFA 2026 公开，公告称现场已获得关注，但没有公布价格、预订、销售地区、发货日期、服务合同、安装要求或消费者订单入口。Tuya 的开发者和 AIoT 平台可作为生态背景，不能替代 Doova 的具体交付证据。",
        limitsOrUnknowns: "价格、量产时间、实际续航、室内网络要求、摄像头规格、夜间和遮挡环境表现、跌倒识别准确度、60 秒计时规则、误报撤销、家庭成员权限、数据保存与删除、第三方护理机构接口、医疗责任和离线紧急模式均 source not stated。老人陪伴与反诈提示也需要评估语言、听力、认知差异和家庭文化，不应把公司描述当成疗效承诺。",
        productVerdict: "Doova 是少数把物理移动、家庭安全、对话陪伴和 IoT 控制放在同一产品叙事中的 IFA 信号。产品判断：confirmed product announcement，但尚未到 confirmed retail availability。下一关是量产样机的跌倒/误报测试、断网断电回退、家人权限与数据删除、以及老人是否愿意让它在家中持续观察。"
      },
      en: {
        productName: "Tuya Doova, an AI home companion robot for independently living seniors",
        productType: "Doova is a mobile home robot Tuya unveiled at IFA 2026 for seniors who live alone or want to remain independent. It combines safety patrol, emergency response, conversational companionship, reminders, document interpretation, scam warnings, and smart-home control in one wheeled, sensor-equipped household node with a display. Tuya's announcement supports a confirmed product announcement, but it does not publish a price, order page, or mass-delivery date.",
        interactionFlow: "If a senior falls or faces an emergency, they can call “Hey Tuya, help.” Sound localisation and vision-based skeletal recognition identify the user's location; the robot moves to the person and assesses the situation in real time. If no response is detected within 60 seconds, Doova initiates a two-way live video call alert to family. In daily use, natural language can request help interpreting bills and letters, identifying possible scams, setting medication, weather, and schedule reminders, or operating smart appliances. When the family is away, Doova moves through room nodes, performs a 360-degree scan at each location, and sends a safety report to a mobile phone.",
        specsOrStack: "Tuya discloses LDS LiDAR, a four-microphone sound-source localisation system, AI vision skeletal recognition, a multimodal large language model, dual-wheel drive with caster wheels, 360-degree scanning, autonomous docking, a 10.1-inch HD display, and dynamic facial expressions. The platform context includes Tuya AIoT, TuyaOS, TuyaOpen, IoT Core, and an AI Agent development platform. Processor, camera resolution, memory, storage, radio, cloud region, endurance, map format, API permissions, and encryption implementation are source not stated.",
        useCases: "Published use cases include fall response for a senior living alone, remote family check-in, safety scanning, conversational companionship, entertainment, explaining complex bills and letters, spotting potential scams, medication and schedule reminders, light games, and voice control of lights, curtains, kitchen, and bathroom devices. The product fits household support where low-learning-cost interaction and a robot that can move to a person matter. The announcement does not justify medical diagnosis, automatic ambulance dispatch, replacement of caregivers, high-risk financial decisions, or protection during a network or power outage.",
        painPointsSolved: "Doova targets the time gap between an incident and someone realising it happened, the difficulty of operating smart-home devices, the feeling of surveillance from fixed cameras, and the inability of family members to understand home conditions continuously. Moving to the user, issuing a 60-second alert, scanning room nodes, and returning a phone report shifts the product from a single camera to an event-response system. A height suited to standing, sitting, and reclining plus expressive feedback reduces the emotional distance of equipment. The release does not show false-alarm cancellation, tiered family takeover, or a way for a senior to decline a scan.",
        newTech: "The technical novelty is a combined state machine for LDS LiDAR, sound-source localisation, skeletal vision, and multimodal dialogue rather than a single sensor directly triggering an alert. A node-oriented coverage strategy places the robot at room centres, reducing dependence on wall-following routes; Tuya's AIoT ecosystem turns lights, curtains, and kitchen and bathroom devices into action targets. The announcement does not say whether models run on the device, an edge gateway, or the cloud, and it does not publish fall-classification thresholds, false-alarm handling, or household data isolation.",
        availability: "Doova was publicly unveiled at IFA 2026 on September 4, and Tuya says it attracted attention at the show. No price, preorder, sales regions, shipping date, service contract, installation requirement, or consumer order surface is published. Tuya's developer and AIoT platforms provide ecosystem context, not delivery evidence for Doova itself.",
        limitsOrUnknowns: "Price, production timing, measured endurance, indoor network requirements, camera details, night and occlusion performance, fall-detection accuracy, the exact 60-second rule, false-alarm cancellation, family permissions, data retention and deletion, care-provider integrations, medical liability, and offline emergency behaviour are source not stated. Companionship and scam guidance also need testing across language, hearing, cognitive, and family differences; the company description is not an efficacy claim.",
        productVerdict: "Doova is a notable IFA signal because it joins physical movement, home safety, conversation, and IoT control in one product contract. Verdict: confirmed product announcement, not confirmed retail availability. The next gate is a production sample tested for falls and false alarms, offline and power-loss recovery, family permissions and deletion, and whether seniors accept continuous observation in their home."
      }
    }
  }),
  topic({
    id: "sonos-27-ace-ultra-agent-audio-os", section: "official", evidenceLabel: "confirmed product", evidenceStrength: "Sonos official announcement and product page plus TechRadar hands-on; staged rollout remains in progress", sourceDate: "2026-09-01", visual: sonosVisual,
    zhHeadline: "Sonos 27 把音箱、耳机与 agent 连接器改写成家庭音频 OS", enHeadline: "Sonos 27 turns speakers, headphones, and agent connectors into a home audio OS",
    zhFact: "Sonos 官方 9 月 1 日公布 Sonos 27、Sonos 27voice、Sonos 27mcp、Fabric、Beam Ultra 与 Ace Ultra；Ace Ultra 官方页列出 US$599、ANC 开启最长 35 小时续航，预计 2026 年 9 月 29 日发货。",
    enFact: "Sonos announced Sonos 27, Sonos 27voice, Sonos 27mcp, Fabric, Beam Ultra, and Ace Ultra on September 1. The Ace Ultra product page lists US$599, up to 35 hours with ANC on, and estimated shipping on September 29, 2026.",
    zhValue: "这次更新的产品单位是“声音在家中如何移动”：用户可以从 ChatGPT 或其他 agent 直接控制播放，按一下把音箱正在播放的内容送到 Ace Ultra，再按一下送回；Move 2 或 Sonos Play 放到电视后方后，系统将它们变成便携环绕声。Sonos 27mcp 把操作面开放给外部 agent，Sonos Custom Agents 还计划让用户按模型、人格和声音创建专用 agent。风险落在权限、错误播放、账户边界、兼容设备和旧 app 的升级信任。",
    enValue: "The product unit is now how sound moves through a home. A user can control playback from ChatGPT or another agent, press once to move what a speaker is playing to Ace Ultra, and press again to send it back. Move 2 or Sonos Play can become portable surrounds when placed behind a television. Sonos 27mcp exposes a supported action surface to external agents, while Custom Agents are planned around a model, persona, and voice chosen by the user. The risks are permissions, wrong playback, account boundaries, compatible devices, and trust in a legacy app upgrade.",
    zhHciLens: ["Input: voice / MCP / Content Key", "Context: 房间 + 设备位置", "Action: 播放迁移 + surround", "Feedback: app + 音频状态"],
    enHciLens: ["Input: voice / MCP / Content Key", "Context: room + device position", "Action: playback handoff + surround", "Feedback: app + audio state"],
    zhImplication: "家庭 agent 的关键反馈不是回答文本，而是让用户知道声音去了哪台设备、哪个 agent 发起了动作、是否处于 Early Access、以及失败后如何恢复原播放。",
    enImplication: "The key feedback for a home Agent is not a text answer; it is showing where audio went, which Agent initiated the action, whether a feature is Early Access, and how to restore the previous playback after failure.",
    sources: [source("Sonos 27 official newsroom", sonosUrl, "official"), source("Sonos Ace Ultra product page", sonosProductUrl, "official"), source("TechRadar Sonos 27 hands-on", sonosReviewUrl, "hands-on review"), source("Sonos community Open House recap", "https://en.community.sonos.com/owners-cafe-228997/sonos-open-house-recap-sonos-27-beam-ultra-sonos-ace-ultra-6934668?postid=16896072", "community")],
    dossier: {
      zh: {
        productName: "Sonos 27 + Sonos Ace Ultra（家庭音频 OS 与耳机系统，confirmed product）",
        productType: "Sonos 27 是 Sonos 把现有联网音频系统重新命名并扩展为 OS 的软件层，Ace Ultra 是与它深度连接的新一代主动降噪耳机，Beam Ultra 是配套的中型 soundbar。三者共同构成一个能被自有语音助手、外部 agent 与房间设备状态控制的家庭音频系统。Sonos 官方已公布产品与分阶段 rollout，因此属于 confirmed product；Sonos 27mcp、耳机 linking 与 portable surrounds 仍有 Early Access 或特定设备限制。",
        interactionFlow: "用户可以在 Sonos 27app、Sonos 27voice、Sonos 27web 或外部 agent 中发出播放、暂停、房间选择和音乐风格请求；Sonos 27mcp 让 ChatGPT 等连接器从对话中控制系统。Ace Ultra 的 Content Key 负责音量、接打电话与声音迁移，一次按压把附近音箱的播放送到耳机，再按一次送回。把 Move 2 或 Sonos Play 移到电视后方后，Fabric 与 Sonos Positioning Technology 让它们成为便携环绕声；耳机取下会暂停，戴回会恢复。",
        specsOrStack: "官方 Ace Ultra 页列出 US$599、ANC 开启最长 35 小时、三分钟充电可播放最长 3 小时、十枚麦克风用于自适应 ANC、空间音频、Dolby Atmos、动态头部追踪、USB-C 与 3.5mm、Bluetooth、Content Key、Aware mode 与 Early Access headphone linking。Sonos 官方称 Sonos 27 支持多 assistant/agent、Sonos 27voice、Sonos 27mcp、Fabric 和 portable surrounds；Beam Ultra 提供 7.1.2 Dolby Atmos。芯片型号、无线拓扑、MCP schema、权限粒度、端云分工和完整兼容矩阵 source not stated。",
        useCases: "具体场景包括从正在聊天的 ChatGPT 对话里让客厅播放音乐、把电视音频转到耳机进行私人观影、在厨房/客厅之间迁移声音、移动两只音箱临时组成环绕声、用语音按情绪找音乐、以及用 Custom Agent 做特定的家庭音乐任务。Ace Ultra 也保留通用耳机的通话、降噪、Aware mode 和有线输入。用户需要同时管理 Sonos 账户、Wi-Fi、兼容设备、Early Access 状态和外部 agent 权限。",
        painPointsSolved: "Sonos 27 针对的是音频生态割裂：耳机听到的内容与家中音箱分开、移动音箱后要手动重配、外部 agent 只能依靠非官方 API、以及音乐控制被锁在独立 App。Fabric、MCP 与 Content Key 让设备位置、播放路由和外部对话成为同一条控制链；Ace Ultra 也补上了第一代 Ace 与 Sonos 家庭系统连接不足的痛点。它没有解决错误 agent 选歌、账号误授权、旧设备兼容、网络依赖或用户对 app 更新的担忧。",
        newTech: "新技术由产品级能力组成：Sonos Fabric 让设备感知彼此并适应当前场景；高频 Sonos Positioning Technology 判断音箱位置；MCP 提供外部 agent 的支持动作面；Custom Agents 让用户选择模型、人格和声音。这个方向的关键是把“空间中的设备状态”暴露给软件，而不是仅增加一个语音按钮。Sonos 没有公开 MCP 的完整 schema、写入动作的确认规则、日志/撤销能力和第三方 agent 数据处理边界。",
        availability: "Sonos 27app 新导航、Sonos 27mcp Early Access 与 portable surrounds 从 2026 年 9 月 8 日开始逐步推出，官方称面向所有 Sonos S2 产品的软件更新，但具体功能取决于设备。Ace Ultra 与 Beam Ultra 从 9 月 1 日开始预订，Ace Ultra 官方加拿大页列出 US$599 与 9 月 29 日预计发货；不同国家货币、税费、库存和销售渠道会变化。",
        limitsOrUnknowns: "用户需要验证旧设备是否获得同等功能、哪些动作需要确认、外部 agent 能否暂停/改歌/跨房间播放、MCP 是否记录与撤销、Wi-Fi 断开时的 fallback、Ace Ultra 与普通 Ace 的差异、ANC 实测、重量和长时间舒适度。Sonos 社区对旧 app 更新的信任仍是 review/community friction，不能用官方 rollout 替代真实回归。",
        productVerdict: "Sonos 27 是今天最清晰的“家庭设备成为 agent action surface”案例之一。产品判断：confirmed product，Ace Ultra 是可预订硬件，Sonos 27 是分阶段系统更新；价值在于跨设备声音状态迁移，风险在于权限与升级信任。下一关是把 MCP/voice 的错误动作、撤销、离线和旧设备兼容做成可观察 QA，而不止展示一次顺滑 demo。"
      },
      en: {
        productName: "Sonos 27 + Sonos Ace Ultra, a confirmed home-audio OS and headphone system",
        productType: "Sonos 27 is the software layer through which Sonos is naming and extending its connected-audio system as an operating system. Ace Ultra is a new active-noise-cancelling headphone designed to connect deeply to it, and Beam Ultra is the companion mid-size soundbar. Together they create a home-audio system controlled by Sonos' own voice assistant, outside agents, and room-device state. Sonos has published the products and a staged rollout, so this is a confirmed product; 27mcp, headphone linking, and portable surrounds still have Early Access or device constraints.",
        interactionFlow: "A user can issue playback, pause, room, and mood requests through the Sonos 27app, Sonos 27voice, Sonos 27web, or an external Agent; Sonos 27mcp lets connectors such as ChatGPT control the system from a conversation. Ace Ultra's Content Key controls volume, calls, and handoff: one press moves nearby-speaker playback to the headphones and another sends it back. When Move 2 or Sonos Play is placed behind a television, Fabric and Sonos Positioning Technology can make the units portable surrounds. Wear detection pauses music when the headphones are removed and resumes it when they are put back on.",
        specsOrStack: "The official Ace Ultra page lists US$599, up to 35 hours with ANC on, up to three hours after a three-minute charge, ten microphones for adaptive ANC, spatial audio, Dolby Atmos, dynamic head tracking, USB-C and 3.5mm, Bluetooth, a Content Key, Aware mode, and Early Access headphone linking. Sonos says Sonos 27 supports multiple assistants and agents, Sonos 27voice, Sonos 27mcp, Fabric, and portable surrounds; Beam Ultra provides 7.1.2 Dolby Atmos. Chipset, wireless topology, MCP schema, permission granularity, edge/cloud division, and full compatibility matrix are source not stated.",
        useCases: "Concrete flows include asking a ChatGPT conversation to play music in the living room, moving TV audio to headphones for private viewing, handing sound from a kitchen to a living room, carrying two speakers into position as temporary surrounds, requesting mood-based music by voice, and creating a Custom Agent for a household music task. Ace Ultra remains a general headphone with calls, ANC, Aware mode, and wired input. The user must also manage a Sonos account, Wi-Fi, compatible devices, Early Access status, and permissions for external agents.",
        painPointsSolved: "Sonos 27 targets a fragmented ecosystem: headphone listening is separate from home speakers, a moved speaker has to be configured manually, outside agents have relied on unofficial APIs, and music control is trapped inside a dedicated app. Fabric, MCP, and the Content Key make device position, playback routing, and an external conversation one control chain; Ace Ultra also addresses the first Ace's limited connection to the Sonos home system. It does not solve an Agent choosing the wrong song, accidental account permission, legacy-device compatibility, network dependence, or customer distrust of app updates.",
        newTech: "The novelty is product-level: Sonos Fabric lets devices sense one another and adapt to context; high-frequency Sonos Positioning Technology detects speaker location; MCP exposes a supported action surface to external agents; and Custom Agents let a user choose a model, persona, and voice. The hard step is exposing device state in a room to software rather than adding another voice button. Sonos has not published the full MCP schema, confirmation rules for write actions, logging or undo, or third-party Agent data boundaries.",
        availability: "New Sonos 27app navigation, Sonos 27mcp Early Access, and portable surrounds begin rolling out September 8, 2026. Sonos says the software update reaches S2 products, but features depend on the individual device. Ace Ultra and Beam Ultra opened for preorder September 1; the official Canadian Ace Ultra page lists US$599 and estimated shipping September 29. Currency, tax, inventory, and retail channel vary by country.",
        limitsOrUnknowns: "Users still need to verify whether old devices receive equivalent features, which actions require confirmation, whether an outside Agent can pause, change, or route music across rooms, whether MCP supports logs and undo, what happens offline, how Ace Ultra differs from ordinary Ace, and its measured ANC, weight, and long-wear comfort. Community caution around previous app updates remains a review/community friction signal; the official rollout is not a substitute for regression evidence.",
        productVerdict: "Sonos 27 is one of the clearest examples of a home-device system becoming an Agent action surface. Verdict: confirmed product; Ace Ultra is preorderable hardware and Sonos 27 is a staged system update. Its value is cross-device audio-state handoff; its risk is permission and upgrade trust. The next gate is observable QA for wrong actions, undo, offline behaviour, and legacy compatibility rather than another smooth demo."
      }
    }
  }),
  topic({
    id: "hisense-juos-vidda-g11-china-scan", section: "china", dossierKind: "scan", evidenceLabel: "weak/unverified", evidenceStrength: "Chinese media scan of an official poster; IFA hands-on, price, and delivery not independently verified", sourceDate: "2026-09-03", visual: hisenseVisual,
    zhHeadline: "中国 lane 扫描：海信 JUOS 与 Vidda G11 把家庭 AIOS 和眼镜放进同一张海报", enHeadline: "China-lane scan: Hisense JUOS and Vidda G11 put a home AIOS and glasses on one poster",
    zhFact: "IT之家 9 月 3 日报道海信将在 IFA 2026 展示 RGB 场序显示、家庭 AIOS 海信 JUOS 与 Vidda AI 智能眼镜 G11；本文只记录中国媒体对展前官方海报的扫描，不把海报升级成已上市、规格完整或已验证的产品事实。",
    enFact: "ITHome reported on September 3 that Hisense would show RGB field-sequential display, the JUOS home AIOS, and Vidda AI Glasses G11 at IFA 2026. This item records a Chinese-media scan of a pre-show official poster; it does not upgrade the poster into a shipped product, complete specification, or verified hands-on fact.",
    zhValue: "扫描到的产品信号是：海信尝试把电视、闺蜜机、投影、智能家电和 AI 入口放进同一套家庭操作层，并把“超级小聚”描述为能问答、生成个性桌面和一句话联动全屋设备的系统载体；同一张传播材料还把 Vidda G11 放入智能穿戴矩阵。缺失的是公开交互录像、OS/API、兼容设备、价格、发货、海外语言与真实用户测试，因此本条保持弱信号。",
    enValue: "The scanned product signal is that Hisense is trying to put televisions, companion displays, projectors, smart appliances, and an AI entry point into one home operating layer. The report describes “Super Xiaoju” as a system surface for questions, personalised desktops, and one-sentence control of connected devices, while placing Vidda G11 in the same smart-wearable matrix. Missing evidence includes interaction video, OS/API, compatible devices, price, shipping, overseas languages, and real-user testing, so the item remains weak.",
    zhHciLens: ["Scanned: 中国媒体展前报道", "Claim: 家庭 AIOS + 穿戴", "Missing: API / 真机", "Watch: IFA 现场与海外交付"],
    enHciLens: ["Scanned: Chinese pre-show report", "Claim: home AIOS + wearable", "Missing: API / hands-on", "Watch: IFA demo and overseas delivery"],
    zhImplication: "中国产品出海的验收要把海报叙事拆成设备清单、系统动作、数据流、语言、账号、渠道和售后；没有这些字段，不能把“全场景”当成可用闭环。",
    enImplication: "For China-origin products going global, evaluation should split poster language into device inventory, system actions, data flow, languages, accounts, channels, and service; without those fields, “full scenario” is not a usable loop.",
    sources: [source("IT之家 Hisense IFA report", hisenseChinaUrl, "China"), source("Hisense global site", "https://global.hisense.com/", "global")],
    dossier: {
      zh: {
        productName: "海信 JUOS / Vidda AI 眼镜 G11（中国 lane 扫描，weak/unverified）",
        productType: "这是对 IT之家 9 月 3 日展前报道的 source-lane scan。报道引用海信官方海报，称海信将在 IFA 展示 RGB 场序显示、家庭 AIOS 海信 JUOS、Vidda AI 智能眼镜 G11 等产品。它不是海信完整产品发布或真机评测，本文不把传播材料中的“全球首款”“行业首款”转写成已独立验证的市场事实。",
        interactionFlow: "媒体报道将 JUOS 描述为以“超级小聚”为系统级 AI 载体，用户可进行电视问答、生成个性化 AI 桌面，并用一句话联动全屋设备；Vidda G11 只被列为智能穿戴矩阵成员，没有公布完整操作流程。扫描中没有找到公开的配网、账号、语音唤醒、跨设备确认、家庭成员权限、错误回退或眼镜到电视的上下文转移演示，因此交互流只保留为待现场验证的产品主张。",
        specsOrStack: "IT之家报道涉及 RGB 场序显示、RGB-Mini LED、四芯真彩背光、海信星海大模型、原生引擎、家庭 AIOS、Vidda AI 眼镜 G11 等名称，但没有给出可复核的显示参数、芯片、内存、存储、镜片、相机、重量、电池、网络、OS 版本、SDK、API 或端云分工。所谓“全场景”覆盖的具体设备清单与互操作协议 source not stated。",
        useCases: "报道声称的场景包括电视问答、AI 个性桌面、一句话控制灯光或其他家庭设备，以及在智能穿戴中体验 AI。它可能服务家庭娱乐、家居控制、儿童/老人低门槛交互和海外展示，但没有证据证明 G11 已在中国或海外销售，也没有证明 JUOS 可以跨品牌、跨房间、跨账号稳定执行动作。",
        painPointsSolved: "扫描到的痛点叙事是家庭设备入口分散、遥控器与 App 复杂、显示设备只呈现内容却不理解家庭上下文，以及穿戴设备与家庭屏幕彼此割裂。这个信号有产品方向价值，但没有公开确认它如何解决确认、撤销、误触、隐私、断网和家庭成员权限，因此不能把“主动懂家”当作已完成体验。",
        newTech: "本扫描确认的只是产品传播层面把 RGB 显示、星海大模型、原生引擎、JUOS 与智能眼镜放进一张 IFA 矩阵。它没有确认新的技术实现、模型能力或跨设备协议。需要等待现场真机、开发者文档、系统更新说明或第三方拆解，才能判断新技术是否真的落在 OS、显示驱动、家庭感知或多设备 agent 层。",
        availability: "IT之家称相关产品将在 2026 年 9 月 4–8 日 IFA 柏林 23A 展位或展会期间亮相；该报道没有提供 JUOS 或 Vidda G11 的价格、订单、交付、海外市场、语言、售后或正式发布日期。展出与可购买是两个独立状态，当前只支持“展前宣传/待现场验证”。",
        limitsOrUnknowns: "缺失字段包括真实产品照片/视频、OS/API、支持品牌、账号体系、家庭数据保存、隐私开关、离线行为、显示与相机规格、重量、续航、价格、发货、海外认证、中文以外语言、开发者入口和售后。中国媒体报道与官方海报可以触发 research/QA，但不能替代产品页面或独立测试。",
        productVerdict: "判断为 weak/unverified China scan：它把家庭 AIOS 与 AI 眼镜放进了同一张明确的产品传播图，但尚未形成可核验的交互合同。下一步只看 IFA 真机、产品详情页、开发者接口、海外订单和跨设备动作的确认/撤销路径；在此之前不应把 JUOS 或 G11 写成已上市能力。"
      },
      en: {
        productName: "Hisense JUOS / Vidda AI Glasses G11, a China-lane weak or unverified scan",
        productType: "This is a source-lane scan of an ITHome pre-show report dated September 3. The report cites an official Hisense poster and says Hisense will show RGB field-sequential display, the JUOS home AIOS, and Vidda AI Glasses G11 at IFA. It is not a full Hisense product launch or hands-on review, so marketing claims such as “world first” or “industry first” are not treated as independently verified market facts.",
        interactionFlow: "The report describes JUOS as a system AI surface called “Super Xiaoju” for television questions, personalised AI desktops, and one-sentence control of connected home devices. Vidda G11 is only listed as part of the smart-wearable matrix; no complete flow is published. The scan found no public setup, account, wake-word, cross-device confirmation, household permission, error-recovery, or glasses-to-TV context handoff demo. The interaction therefore remains a claim to validate at the show rather than an established product behaviour.",
        specsOrStack: "ITHome names RGB field-sequential display, RGB Mini-LED, four-chip colour backlight, Hisense Xinghai large model, native engines, a home AIOS, and Vidda AI Glasses G11, but it does not give reproducible display values, chip, memory, storage, lens, camera, weight, battery, network, OS version, SDK, API, or edge/cloud division. The concrete device inventory covered by “full scenario” and its interoperability protocol are source not stated.",
        useCases: "Reported scenarios include asking a television questions, using an AI-personalised desktop, controlling lights or other home devices with one sentence, and experiencing AI through smart wearables. These could serve home entertainment, smart-home control, lower-friction interaction for children or seniors, and overseas demonstrations. There is no evidence here that G11 is shipping in China or abroad, or that JUOS can execute actions reliably across brands, rooms, and accounts.",
        painPointsSolved: "The scanned pain-point story is fragmented home entry points, complicated remotes and apps, displays that show content without understanding household context, and wearables that are disconnected from home screens. That has product-direction value, but the report does not verify confirmation, undo, accidental triggers, privacy, offline behaviour, or household permissions. “Understands the home” must not be treated as a completed experience.",
        newTech: "The scan confirms only that the communication layer puts RGB display, the Xinghai model, native engines, JUOS, and AI glasses in one IFA matrix. It does not confirm a new implementation, model capability, or cross-device protocol. Hands-on hardware, developer documentation, system notes, or third-party teardown is needed to determine whether the novelty sits in the OS, display driver, home sensing, or multi-device Agent layer.",
        availability: "ITHome says the products would appear at IFA Berlin from September 4 to 8, 2026, at booth 23A or during the exhibition period. The report does not publish price, order path, delivery, overseas markets, language, service, or formal release date for JUOS or Vidda G11. Exhibition presence and purchasability are separate states; the evidence supports only a pre-show announcement awaiting on-site validation.",
        limitsOrUnknowns: "Missing evidence includes real product photo or video, OS/API, supported brands, account model, household-data retention, privacy switch, offline behaviour, display and camera specifications, weight, endurance, price, shipping, overseas certification, non-Chinese languages, developer access, and service. A Chinese-media report and official poster can trigger research or QA; they cannot replace a product page or independent test.",
        productVerdict: "Verdict: weak/unverified China scan. The signal places a home AIOS and AI glasses in one clear product story, but it has not yet formed a verifiable interaction contract. The next evidence is an IFA unit, product detail page, developer surface, overseas order, and confirmed permission and undo path for cross-device actions. Until then, JUOS and G11 should not be written as shipped capabilities."
      }
    }
  })
];

const combinedTopics = [...todayTopics, ...newTopics];
const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = issues.find((item) => item.date === previousDate);
if (!previous) throw new Error(`missing base issue ${previousDate}`);
const issue = structuredClone(previous);
issue.date = date;
issue.zhPath = `/${date}/zh/`;
issue.enPath = `/${date}/en/`;
issue.sourcesPath = `/${date}/sources.md`;
issue.zhTitle = "AI Daily 2026-09-05：眼镜走向区域零售，家庭 agent 开始移动";
issue.enTitle = "AI Daily 2026-09-05: Glasses enter regional retail while the home Agent starts moving";
issue.zhSummary = "HTC VIVE Eagle 把相机、翻译、Notes、开放式音频与遮挡即停的隐私规则带到可购买市场，但订阅与手机依赖仍明显；Tuya Doova 把独居老人安全响应、陪伴和智能家居控制放进移动机器人；Sonos 27 用 MCP、Fabric 和 Ace Ultra 让声音在家庭设备之间迁移；海信 JUOS/Vidda G11 继续作为中国 lane 的弱信号扫描。";
issue.enSummary = "HTC VIVE Eagle brings camera capture, translation, Notes, open-ear audio, and indicator-linked privacy into purchasable regional markets, while subscription and phone dependence remain visible; Tuya Doova puts senior safety response, companionship, and smart-home control into a mobile robot; Sonos 27 uses MCP, Fabric, and Ace Ultra to move sound across the home; Hisense JUOS/Vidda G11 remains a weak China-lane scan.";
issue.sourceTypes = Array.from(new Set([...issue.sourceTypes, "confirmed product", "official", "hands-on review", "China", "community", "MCP", "Sonos 27", "VIVE Eagle", "Doova", "IFA 2026"]));
issue.coverStory = {
  topicId: "htc-vive-eagle-regional-launch",
  zhTitle: "HTC VIVE Eagle：AI 眼镜开始接受零售、订阅与隐私状态的现实检验",
  enTitle: "HTC VIVE Eagle: AI glasses meet the real test of retail, subscriptions, and privacy state",
  zhSummary: [
    "VIVE Eagle 已有台湾官方销售面、区域价格与上市节奏：美国 US$499、欧盟 €469、英国 £429。",
    "1200 万像素、最高 3K、实时/图像翻译、AI Notes、开放式音频与镜头灯遮挡即停，把 AI 入口写进硬件状态。",
    "AI 额度、手机/网络、地区语言和长期续航仍需逐市场验证；本期将它标为 confirmed product，不把宣传当成普遍可用。"
  ],
  enSummary: [
    "VIVE Eagle now has an official Taiwan sales surface plus regional pricing and rollout: US$499 in the US, €469 in the EU, and £429 in the UK.",
    "A 12MP camera, up to 3K, live and image translation, AI Notes, open-ear audio, and indicator-linked camera disable put the Agent entry into hardware state.",
    "Quotas, phone/network dependence, languages, and long-session endurance still need market-by-market testing; this issue calls it a confirmed product without treating marketing as universal availability."
  ],
  imagePath: viveVisual.path,
  imageWidth: viveVisual.width,
  imageHeight: viveVisual.height,
  imageSourceUrl: viveReviewUrl,
  primarySourceUrl: viveUrl,
  evidenceStrength: "confirmed product · 2026-09-03 · regional availability and service limits remain",
  whyCover: "The category is moving from prototype theatre to the harder contract of retail price, subscription, phone dependence, and a privacy state users can see."
};
issue.topics = [...combinedTopics, ...issue.topics.filter((item) => !combinedTopics.some((fresh) => fresh.id === item.id))];
issue.designDesk = {
  zhTitle: "Design Desk：把 agent 入口做成可见、可恢复的现场状态",
  enTitle: "Design Desk: make the Agent entry a visible, recoverable field state",
  zhIntro: "今天的产品更新把入口从屏幕推向眼前、耳边、手指和跨设备上下文；设计判断落在取景、联网、权限、回滚和停止这些可观察状态。",
  enIntro: "Today’s product updates push the entry point into the view, ear, finger, and cross-device context; the design read belongs in observable states for framing, connectivity, permission, rollback, and stopping.",
  zhItems: [
    { label: "Framing state", body: "相机型眼镜先让用户确认画面，再开始录制；取景、录制、停止和恢复都要有旁人可理解的反馈。" },
    { label: "Power state", body: "把 charging、capture、AI thinking、upload、hot-swap、low battery 和 degraded mode 分开显示。" },
    { label: "Connectivity state", body: "eSIM 或 MCP 连接器必须告诉用户当前网络、账户、数据去向和动作是否需要手机。" },
    { label: "Permission state", body: "跨设备 agent 把查询、编辑、发送、删除和解锁分级，危险动作提供确认、撤销和审计。" },
    { label: "Recovery state", body: "系统升级和 wearable 失败都要提供进度、回滚、数据完整性、错误码与人工支持入口。" },
    { label: "Input state", body: "戒指、耳机、手表、相机和语音的主动输入要区分手势、唤醒、持续监听和健康上下文。" }
  ],
  enItems: [
    { label: "Framing state", body: "Camera glasses should let the user confirm the frame before capture; framing, recording, stopping, and recovery need bystander-readable feedback." },
    { label: "Power state", body: "Separate charging, capture, AI thinking, upload, hot-swap, low battery, and degraded mode in the interface." },
    { label: "Connectivity state", body: "An eSIM or MCP connector must expose network, account, data destination, and whether the phone is still required." },
    { label: "Permission state", body: "A cross-device Agent should tier query, edit, send, delete, and unlock actions with confirmation, undo, and audit." },
    { label: "Recovery state", body: "System updates and wearable failures need progress, rollback, data integrity, error codes, and a human-support path." },
    { label: "Input state", body: "Separate deliberate gesture, wake word, continuous listening, and health context across ring, earbuds, watch, camera, and voice." }
  ]
};
issue.watchlistZh = [
  "VIVE Eagle：不同地区的订阅、翻译准确率、遮挡停机、长时间录像和处方镜片服务。",
  "Tuya Doova：跌倒/误报测试、家人接管、断网断电回退、数据删除与老人接受度。",
  "Sonos 27：9 月 8 日 MCP rollout、外部 agent 权限、撤销、旧设备兼容与 Ace Ultra 发货。",
  "海信 JUOS / Vidda G11：IFA 真机、API、海外订单、语言、跨设备确认与售后。",
  "GOSIGHT P1：IFA 真机、最终重量/亮度/视野、热插拔续接、价格、众筹与交付。",
  "Lenovo Qira：Android 17 rollout、moto watch ultra、Workato/MCP 权限、动作确认与撤销。",
  "Plaud One：Explorer Edition 发货、4G 覆盖、credits 用完后的费用、中文体验与数据删除。",
  "Ultrahuman Ring：Ring Air/Pro 的游戏与 AI 更新、SDK、手势误触和 Qualcomm silicon 戒指。",
  "Qira 社区摩擦：按机型、build、BIOS 与 Windows 版本复现安装、回滚和维修问题。",
  "Plaud 中国 lane：大陆订单、运营商、中文/方言、数据合规、发票与售后。",
  "RayNeo iO 与 GT：9 月 4 日真实零售、价格、续航、隐私灯和显示/无显示两条路径。",
  "First-person intelligence research：L0–L5 评估是否进入真实眼镜 SDK 与产品 QA。"
];
issue.watchlistEn = [
  "VIVE Eagle: regional subscription, translation accuracy, indicator shutdown, long capture, and prescription service.",
  "Tuya Doova: fall and false-alarm tests, family takeover, offline/power recovery, deletion, and senior acceptance.",
  "Sonos 27: September 8 MCP rollout, external-Agent permissions, undo, legacy compatibility, and Ace Ultra shipping.",
  "Hisense JUOS / Vidda G11: IFA hardware, API, overseas order, language, cross-device confirmation, and service.",
  "GOSIGHT P1: IFA hardware, final weight/brightness/view, hot-swap continuity, price, crowdfunding, and delivery.",
  "Lenovo Qira: Android 17 rollout, moto watch ultra, Workato/MCP permissions, confirmation, and undo.",
  "Plaud One: Explorer Edition shipping, 4G coverage, post-credit cost, Chinese experience, and deletion.",
  "Ultrahuman Ring: Ring Air/Pro game and AI update, SDK, gesture false triggers, and Qualcomm-silicon ring.",
  "Qira community friction: reproduce install, rollback, and repair issues by model, build, BIOS, and Windows version.",
  "Plaud China lane: mainland order, carrier, Chinese/dialect support, compliance, invoice, and service.",
  "RayNeo iO and GT: September 4 retail, price, endurance, privacy light, and display/displayless paths.",
  "First-person intelligence research: whether L0-L5 evaluation reaches real glasses SDKs and product QA."
];

const existingIndex = issues.findIndex((item) => item.date === date);
if (existingIndex >= 0) issues[existingIndex] = issue;
else issues.push(issue);
await fs.writeFile(dataPath, `${JSON.stringify(issues, null, 2)}\n`);

await fs.mkdir(issueDir, { recursive: true });
await fs.cp(path.join(root, previousDate, "assets"), path.join(issueDir, "assets"), { recursive: true, force: true });
await fs.cp(path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${previousDate}`, "public", "assets"), path.join(deckDir, "public", "assets"), { recursive: true, force: true });
await fs.cp(path.join(issueDir, "assets"), path.join(deckDir, "public", "assets"), { recursive: true, force: true });
await fs.mkdir(path.join(deckDir, "public", "assets"), { recursive: true });

const dossierLabel = { zh: ["产品", "产品是什么", "怎么用", "规格 / 系统栈", "使用场景", "解决痛点", "新技术", "可用性", "限制 / 未知", "产品判断"], en: ["Product", "What it is", "How it works", "Specs / stack", "Use cases", "Pain points", "New tech", "Availability", "Limits / unknowns", "Product read"] };
const dossierFields = ["productName", "productType", "interactionFlow", "specsOrStack", "useCases", "painPointsSolved", "newTech", "availability", "limitsOrUnknowns", "productVerdict"];
const deckImage = (t) => `./public/${t.visual.path}`;
const textBlock = (locale, t) => dossierFields.map((field, i) => `**${dossierLabel[locale][i]}** — ${t.dossier[locale][field]}`).join("\n\n");
const sourceLine = (t) => t.sources.map((s) => `[${s.label}](${s.url})`).join(" · ");
const deckSlides = [
  `---\ntheme: default\ntitle: AI Daily ${date}\nlayout: cover\n---\n\n# AI Daily ${date}\n\n${issue.coverStory.zhTitle} / ${issue.coverStory.enTitle}\n\n<img src="${deckImage(todayTopics[0])}" style="width:42%;height:54%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${issue.coverStory.evidenceStrength}**\n\n${issue.coverStory.zhSummary.join(" ")}\n\n${sourceLine(todayTopics[0])}`,
  `# Issue map\n\n**Cover** — ${issue.coverStory.zhTitle}\n\n**Today’s additions** — ${todayTopics.map((t) => t.zhHeadline).join("；")}。\n\n**Eight source lanes** — official · reviews · community · wild · research · patent · china · global。\n\n**Design Desk** — ${issue.designDesk.zhTitle}。\n\nThe public publisher carries the complete bilingual, paged 16:9 issue with source/date/evidence labels and PDF downloads.`,
  ...combinedTopics.flatMap((t) => [
    `# ${t.zhHeadline}\n\n<img src="${deckImage(t)}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${t.evidenceLabel} · ${t.evidenceStrength} · ${t.sourceDate}**\n\n${textBlock("zh", t)}\n\n**Sources** — ${sourceLine(t)}`,
    `# ${t.enHeadline}\n\n<img src="${deckImage(t)}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${t.evidenceLabel} · ${t.evidenceStrength} · ${t.sourceDate}**\n\n${textBlock("en", t)}\n\n**Sources** — ${sourceLine(t)}`
  ]),
  `# Design Desk / 设计洞察\n\n${issue.designDesk.zhItems.map((item, i) => `${i + 1}. **${item.label}** — ${item.body}`).join("\n\n")}\n\n${issue.designDesk.enItems.map((item, i) => `${i + 1}. **${item.label}** — ${item.body}`).join("\n\n")}`,
  `# Watchlist / 继续观察\n\n${issue.watchlistZh.map((item, i) => `${i + 1}. ${item}`).join("\n")}\n\n${issue.watchlistEn.map((item, i) => `${i + 1}. ${item}`).join("\n")}`,
  `# Source ledger\n\nEight lanes: official · reviews · community · wild · research · patent · china · global.\n\n${Array.from(new Set(issue.topics.flatMap((t) => t.sources.map((s) => s.url)))).slice(0, 32).map((url, i) => `${i + 1}. ${url}`).join("\n")}\n\nVisual evidence uses local source-traceable screenshots with contain positioning and white backgrounds; speculative, community, crowdfunding, research, and patent signals remain explicitly downgraded.`
];
await fs.mkdir(deckDir, { recursive: true });
await fs.writeFile(path.join(deckDir, "package.json"), JSON.stringify({ scripts: { build: "slidev build --base ./ --out dist" }, dependencies: { "@slidev/cli": "^0.50.0", "@slidev/theme-default": "^0.25.0", vue: "^3.4.0" } }, null, 2) + "\n");
await fs.writeFile(path.join(deckDir, "slides.md"), deckSlides.join("\n\n---\n\n") + "\n");
const allSources = Array.from(new Map(issue.topics.flatMap((t) => t.sources).map((s) => [s.url, s])).values());
const laneRows = ["official", "reviews", "community", "wild", "research", "patent", "china", "global"].map((lane) => `| ${lane} | ${issue.topics.some((t) => t.section === lane) ? "covered" : "scan required"} | ${issue.topics.filter((t) => t.section === lane).map((t) => t.id).join(", ") || "source-lane scan"} |`).join("\n");
const visualRows = issue.topics.map((t) => `| ${t.id} | \`${t.visual.path}\` | ${t.visual.sourceUrl} | ${t.evidenceLabel} |`).join("\n");
await fs.writeFile(path.join(deckDir, "sources.md"), `# AI Daily ${date} source ledger\n\n## Source index\n\n${allSources.map((s, i) => `${i + 1}. ${s.label} — ${s.url} — ${s.type || "source not stated"}`).join("\n")}\n\n## Source-lane coverage\n\n| lane | status | topics |\n| --- | --- | --- |\n${laneRows}\n\n## Visual asset index\n\n| topic | asset | source | evidence |\n| --- | --- | --- | --- |\n${visualRows}\n\n## Evidence rules\n\n- Official product pages and announcements support confirmed product and developer surface claims only where stated.\n- Reviews and community pages provide friction and requirements signals, not universal behaviour.\n- Startup, crowdfunding, research, and patent material remains explicitly downgraded.\n- Specs, prices, dates, availability, quotes, and API details use source not stated when the source does not disclose them.\n- Visuals are local source-traceable screenshots or inherited source-backed evidence assets; display uses object-fit: contain, object-position: center, white backgrounds, and no page-internal scrolling.\n- Chinese and English dossier fields carry the same product information units; the English issue is not a compressed summary.\n`);

console.log(JSON.stringify({ date, topics: issue.topics.length, todayTopics: todayTopics.length, sources: new Set(issue.topics.flatMap((t) => t.sources.map((s) => s.url))).size, visuals: new Set([issue.coverStory.imagePath, ...issue.topics.map((t) => t.visual.path)]).size, deckDir }));
