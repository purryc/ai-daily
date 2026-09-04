import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const surveyRoot = "/Users/hmi/Documents/Survey";
const date = "2026-09-04";
const previousDate = "2026-09-03";
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

const gosightVisual = visual("gosight-p1-ifa-official-2026-09.png", "GOSIGHT P1 IFA 2026 发布页面截图", "GOSIGHT P1 IFA 2026 announcement screenshot", "公开发布材料：P1 的双目彩色 AR、取景器与隐私硬件", "Public launch material: P1 binocular full-color AR, viewfinder, and privacy hardware", gosightUrl);
const qiraVisual = visual("lenovo-qira-ifa-official-2026-09.png", "Lenovo Qira IFA 2026 官方公告截图", "Lenovo Qira IFA 2026 announcement screenshot", "官方公告：Qira 跨 PC、手机、手表与协作应用", "Official announcement: Qira across PCs, phones, watches, and work apps", qiraUrl);
const qiraCommunityVisual = visual("lenovo-qira-community-friction-2026-09.png", "Lenovo 社区中的 Qira 升级摩擦截图", "Lenovo community screenshot about Qira upgrade friction", "社区证据：升级后无法启动与维修等待的个案反馈", "Community evidence: individual reports of launch failure and repair waits after an upgrade", qiraCommunityUrl);
const plaudVisual = visual("plaud-one-official-2026-09.png", "Plaud One 官方产品页截图", "Plaud One official product page screenshot", "官方产品页：eSIM、录音按钮、Agent 按钮和续航规格", "Official product page: eSIM, record button, Agent button, and battery figures", plaudUrl);
const plaudChinaVisual = visual("plaud-one-china-ithome-2026-09.png", "IT之家 Plaud One 中国报道截图", "ITHome China report about Plaud One screenshot", "中国 lane：IT之家对 Plaud One 定价与 eSIM 形态的报道", "China lane: ITHome report on Plaud One pricing and eSIM form factor", plaudChinaUrl);
const ultrahumanVisual = visual("ultrahuman-ring-pro-official-2026-09.png", "Ultrahuman Ring PRO 官方预订页截图", "Ultrahuman Ring PRO official preorder screenshot", "官方预订页：Ring PRO、on-chip ML、存储与 Jade", "Official preorder page: Ring PRO, on-chip ML, storage, and Jade", ultrahumanUrl);

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

const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = issues.find((item) => item.date === previousDate);
if (!previous) throw new Error(`missing base issue ${previousDate}`);
const issue = structuredClone(previous);
issue.date = date;
issue.zhPath = `/${date}/zh/`;
issue.enPath = `/${date}/en/`;
issue.sourcesPath = `/${date}/sources.md`;
issue.zhTitle = "AI Daily 2026-09-04：全彩 AR、联网耳机与跨设备 agent 把入口推向现场";
issue.enTitle = "AI Daily 2026-09-04: Full-color AR, connected earbuds, and cross-device agents push the entry point into the field";
issue.zhSummary = "GOSIGHT P1 把双目全彩 AR、第一人称取景、热插拔供电和隐私硬件放进同一条产品合同，但最终规格与交付仍未公开；Lenovo Qira 把个人 AI 接到 PC、手机、手表和 Workato/MCP 应用层；Plaud One 用 4G eSIM 让会议 agent 脱离手机，Ultrahuman 则把戒指推向指针、控制器和 AI 输入。社区升级摩擦与中国渠道扫描继续压低未经验证的结论。";
issue.enSummary = "GOSIGHT P1 puts binocular full-color AR, first-person framing, hot-swappable power, and privacy hardware into one product contract, while final specifications and delivery remain unpublished. Lenovo Qira connects personal AI across PCs, phones, watches, and Workato/MCP applications; Plaud One uses 4G eSIM to move a meeting Agent away from the phone; Ultrahuman pushes the ring toward pointing, control, and AI input. Community upgrade friction and the China channel scan keep unverified conclusions downgraded.";
issue.sourceTypes = Array.from(new Set([...issue.sourceTypes, "startup signal", "developer surface", "hands-on review", "China", "community", "MCP", "eSIM", "IFA 2026"]));
issue.coverStory = {
  topicId: "gosight-p1-full-color-ar",
  zhTitle: "GOSIGHT P1：全彩 AR 必须从“能显示”走向“能持续工作”",
  enTitle: "GOSIGHT P1: full-color AR has to move from showing pixels to staying at work",
  zhSummary: [
    "GOSIGHT 公开 P1：双目全彩 Micro-OLED、约 105 英寸等效视野、约 69g 目标、12MP 相机、1080p、开放式音频和热插拔电源。",
    "取景器让佩戴者在拍摄前看见画面，硬件关联隐私灯与可选物理盖试图把旁人可理解的安全规则写进相机状态机。",
    "最终规格、价格、市场、交付和真实续航尚未公开；本期将它标为 startup signal，不升级为已上市产品。"
  ],
  enSummary: [
    "GOSIGHT published P1 with binocular full-color Micro-OLEDs, a roughly 105-inch-equivalent view, a target near 69g, a 12MP camera, 1080p video, open-ear audio, and hot-swappable power.",
    "A live viewfinder lets the wearer see the frame before capture, while a hardware-linked privacy light and optional physical cover try to put a bystander-readable safety rule into the camera state machine.",
    "Final specifications, price, markets, delivery, and real endurance remain unpublished; this issue labels P1 a startup signal rather than a retail product."
  ],
  imagePath: gosightVisual.path,
  imageWidth: gosightVisual.width,
  imageHeight: gosightVisual.height,
  imageSourceUrl: gosightUrl,
  primarySourceUrl: gosightUrl,
  evidenceStrength: "startup signal · 2026-09-04 · final specs and delivery unverified",
  whyCover: "Full-color AR now has to prove a continuous loop of framing, feedback, power, privacy, and delivery—not only a display demo."
};
issue.topics = [...newTopics, ...issue.topics.filter((item) => !newTopics.some((fresh) => fresh.id === item.id))];
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
  `---\ntheme: default\ntitle: AI Daily ${date}\nlayout: cover\n---\n\n# AI Daily ${date}\n\n${issue.coverStory.zhTitle} / ${issue.coverStory.enTitle}\n\n<img src="${deckImage(newTopics[0])}" style="width:42%;height:54%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${issue.coverStory.evidenceStrength}**\n\n${issue.coverStory.zhSummary.join(" ")}\n\n${sourceLine(newTopics[0])}`,
  `# Issue map\n\n**Cover** — ${issue.coverStory.zhTitle}\n\n**Today’s additions** — ${newTopics.map((t) => t.zhHeadline).join("；")}。\n\n**Eight source lanes** — official · reviews · community · wild · research · patent · china · global。\n\n**Design Desk** — ${issue.designDesk.zhTitle}。\n\nThe public publisher carries the complete bilingual, paged 16:9 issue with source/date/evidence labels and PDF downloads.`,
  ...newTopics.flatMap((t) => [
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

console.log(JSON.stringify({ date, topics: issue.topics.length, newTopics: newTopics.length, sources: new Set(issue.topics.flatMap((t) => t.sources.map((s) => s.url))).size, visuals: new Set([issue.coverStory.imagePath, ...issue.topics.map((t) => t.visual.path)]).size, deckDir }));
