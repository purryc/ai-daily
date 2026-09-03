import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const surveyRoot = "/Users/hmi/Documents/Survey";
const date = "2026-09-03";
const previousDate = "2026-09-01";
const dataPath = path.join(root, "data", "issues.json");
const issueDir = path.join(root, date);
const deckDir = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${date}`);

const visual = (file, altZh, altEn, captionZh, captionEn, sourceUrl) => ({
  path: `assets/${file}`,
  width: 1600,
  height: 1000,
  kind: "source-backed-screenshot",
  altZh,
  altEn,
  captionZh,
  captionEn,
  sourceUrl
});

const source = (label, url, type) => ({ label, url, type });

const metaUrl = "https://about.fb.com/ja/news/2026/08/meta-glasses-launch-in-japan/";
const metaGlobalUrl = "https://about.fb.com/news/2026/06/meta-essilorluxottica-partner-launch-meta-glasses/";
const vitureUrl = "https://www.viture.com/phantombeast";
const vitureNewsUrl = "https://www.prnewswire.com/news-releases/viture-and-s-game-unveil-phantom-beast--the-official-phantom-blade-zero-xr-glasses-302862007.html";
const j9Url = "https://jorjin.com/products/j9";
const loomosUrl = "https://loomos.ai/products/loomos-alwayson-ai-glasses";
const kickstarterUrl = "https://www.kickstarter.com/projects/loomos/loomos-ai-glasses";
const monakoUrl = "https://www.producthunt.com/products/monako-glass";
const rayneoReviewUrl = "https://www.techradar.com/pro/rayneo-x3-pro-ai-ar-smart-glasses-review";
const openPlatformUrl = "https://www.reddit.com/r/SmartGlasses/comments/1vr6cm3/need_some_help_finding_the_glasses_i_want_or/";
const arxivUrl = "https://arxiv.org/abs/2608.24877";

const metaVisual = visual(
  "meta-glasses-japan-official-2026-08.png",
  "Meta 日本官方公告中的 Meta Glasses 产品截图",
  "Meta Glasses product screenshot from Meta Japan announcement",
  "官方视觉：Meta Glasses 于日本销售的产品公告页面",
  "Official visual: Meta Glasses Japan launch announcement",
  metaUrl
);
const vitureVisual = visual(
  "viture-phantom-beast-official-2026-08.png",
  "VITURE Phantom Beast 官方产品页截图",
  "VITURE Phantom Beast official product page screenshot",
  "官方视觉：Phantom Beast 的 XR 模式与预购入口",
  "Official visual: Phantom Beast XR modes and preorder path",
  vitureUrl
);
const j9Visual = visual(
  "jorjin-j9-official-2026-08.png",
  "Jorjin J9 眼动 AR 眼镜官方产品页截图",
  "Jorjin J9 eye-tracking AR glasses official product page screenshot",
  "官方视觉：J9 的眼动模块、可选显示与规格表",
  "Official visual: J9 eye tracking, optional display, and specification table",
  j9Url
);
const loomosVisual = visual(
  "loomos-official-2026-08.png",
  "Loomos AI Glasses 官方产品页截图",
  "Loomos AI Glasses official product page screenshot",
  "官方视觉：Loomos 的 16MP 拍摄、GPT-4o 与电池主张",
  "Official visual: Loomos 16MP capture, GPT-4o, and battery claims",
  loomosUrl
);
const monakoVisual = visual(
  "monako-glass-producthunt-2026-08.png",
  "Product Hunt 上的 Monako Glass 产品页截图",
  "Monako Glass Product Hunt page screenshot",
  "Product Hunt 视觉：Monako Glass 的 48g、Linux 与 agent 编程定位",
  "Product Hunt visual: Monako Glass positioning around 48g, Linux, and agent coding",
  monakoUrl
);
const rayneoVisual = visual(
  "rayneo-x3-pro-techradar-2026-08.png",
  "TechRadar RayNeo X3 Pro 评测页面截图",
  "TechRadar RayNeo X3 Pro review screenshot",
  "媒体评测视觉：X3 Pro 的 MicroLED、76g 与续航摩擦",
  "Review visual: X3 Pro MicroLED, 76g design, and battery friction",
  rayneoReviewUrl
);
const arxivVisual = visual(
  "smart-glasses-first-person-arxiv-2026-08.png",
  "arXiv《From Seeing to Acting》论文页面截图",
  "arXiv page for From Seeing to Acting",
  "论文视觉：把智能眼镜拆成可验证的 first-person 能力轴",
  "Research visual: verifiable first-person capability axes for smart glasses",
  arxivUrl
);

function topic({ id, section, evidenceLabel, evidenceStrength, zhHeadline, enHeadline, zhFact, enFact, zhValue, enValue, zhHciLens, enHciLens, zhImplication, enImplication, sourceDate, visual: topicVisual, sources, dossier }) {
  return {
    id,
    section,
    dossierKind: "product",
    evidenceLabel,
    evidenceStrength,
    zhHeadline,
    enHeadline,
    zhFact,
    enFact,
    zhValue,
    enValue,
    zhHciLens,
    enHciLens,
    zhImplication,
    enImplication,
    sourceDate,
    visual: topicVisual,
    sources,
    dossier: { zh: dossier.zh, en: dossier.en }
  };
}

const newTopics = [
  topic({
    id: "meta-glasses-japan-launch", section: "official", evidenceLabel: "confirmed product", evidenceStrength: "official product announcement", sourceDate: "2026-08-26", visual: metaVisual,
    zhHeadline: "Meta Glasses 进入日本：AI 眼镜先把日常佩戴做成渠道问题",
    enHeadline: "Meta Glasses enter Japan: the AI-glasses problem becomes a daily-wear and channel problem",
    zhFact: "Meta 与 EssilorLuxottica 宣布 Meta Glasses 于 2026 年 8 月 26 日在日本销售，提供 26 种颜色、镜片和框型组合，支持度数镜片；官方列出 action button、开放式扬声器、多麦克风阵列、免手拍摄，以及 8 小时以上电池和最多增加 40 小时的充电盒。",
    enFact: "Meta and EssilorLuxottica announced Meta Glasses for sale in Japan from August 26, 2026, with 26 frame, colour, and lens combinations, prescription-lens support, an action button, open-ear speakers, a multi-mic array, hands-free capture, more than eight hours of battery life, and a case adding up to 40 hours.",
    zhValue: "这是一款已经进入真实零售和配镜流程的 displayless AI glasses。用户先选框型和镜片，再用 action button 或语音调用 AI、通话、音乐与拍摄；产品价值依赖眼镜是否自然地留在脸上，以及日本本地的售后、镜片更换和功能可用性是否完整。",
    enValue: "This is a displayless AI-glasses product entering real retail and optician workflows. A user selects a frame and lens, then invokes AI, calls, music, or capture through the action button or voice. Its value depends on the glasses remaining natural on the face and on local support for lenses, service, and feature availability.",
    zhHciLens: ["Input: action button + voice", "Context: wearer view + phone/cloud services", "Feedback: open-ear audio + capture LED", "Continuity: retail → app → everyday wear"],
    enHciLens: ["Input: action button + voice", "Context: wearer view + phone/cloud services", "Feedback: open-ear audio + capture LED", "Continuity: retail → app → daily wear"],
    zhImplication: "AI 眼镜的入门体验要把配镜、配对、权限、拍摄提示和退回手机的路径设计成一个连续状态机；只写“支持度数镜片”还不够，用户需要知道镜片更换、保修、地区功能和数据控制的后果。",
    enImplication: "The onboarding experience needs to treat fitting, pairing, permissions, capture cues, and handoff to the phone as one continuous state machine. Saying that prescription lenses are supported is not enough; users need clear consequences for lens swaps, warranty, regional features, and data controls.",
    sources: [source("Meta Japan newsroom", metaUrl, "official"), source("Meta product announcement", metaGlobalUrl, "official")],
    dossier: {
      zh: {
        productName: "Meta Glasses（Meta 与 EssilorLuxottica 合作的 displayless AI 眼镜）",
        productType: "它是把 Meta AI、开放式音频、相机和眼镜配戴结合起来的日常可穿戴产品。日本官方公告把它作为独立系列销售，提供 26 种颜色、镜片和框型组合，并支持度数镜片。它没有在公告中声明近眼显示，因此本文把它归为 audio/camera-first 的 AI 眼镜，而非 AR 显示产品。",
        interactionFlow: "用户先选择框型、镜片和是否安装度数镜片，戴上后通过 action button 快速调用 Meta AI 或将按钮改成常用功能；也可以用语音进行提问、通话、消息、翻译或拍摄。开放式扬声器把回答放回耳边，前置相机负责照片和视频，capture LED 为周围人提供拍摄状态提示，复杂内容继续回到手机端查看。",
        specsOrStack: "官方披露 action button、开放式扬声器、先进多麦克风阵列、风噪降低、免手拍摄、度数镜片兼容、三向可调鼻托、可调镜腿尾端和 over-extension hinges。日本公告写明电池续航超过 8 小时，充电盒最多额外提供 40 小时；相机像素、SoC、RAM、存储、麦克风数量和 API 版本 source not stated。",
        useCases: "具体使用包括走路时询问眼前物体、免手拍照录像、接听电话、听音乐或播客、实时翻译，以及在日本零售和眼镜店完成日常配镜。开放式音频适合需要保持环境感知的通勤、旅行和轻量工作；相机适合第一人称记录。涉及长文本、精细编辑、账户管理、付款和复杂隐私设置时，手机仍是更合适的确认界面。",
        painPointsSolved: "它减少频繁掏手机、在通勤中寻找语音入口、拍照时占用双手和佩戴普通耳机后隔绝环境的痛点。26 种框型和度数镜片路径降低了“科技产品外观”和视力矫正之间的冲突。它没有消除公共空间拍摄的社交压力、云端依赖、相机被遮挡时的行为不确定性、通知打扰或电量焦虑。",
        newTech: "新技术组合在于把 action button、开放式音频、风噪降低、多模态 AI、相机状态灯和可替换配镜流程绑定成一件日常物品。Meta 还把动态照片等软件更新放入同一产品线。关键创新并非单一传感器，而是把第一人称观察、语音调用、拍摄和镜片个性化放进连续佩戴链路。",
        availability: "Meta Japan 的公告写明 2026 年 8 月 26 日起可在 Meta.com 和 Meta 授权零售商购买，起价、具体门店库存和全部日本地区功能需以购买页面为准。公告同时说明度数范围和镜片店可用性会受地区影响。美国、加拿大和其他市场的发行范围沿用 Meta 全球产品公告，具体区域功能仍需单独核对。",
        limitsOrUnknowns: "相机分辨率、处理器、存储、持续录制时长、离线能力、端云分工、Meta AI 在日本的完整语言与功能范围、企业管理 API、录音和删除日志、实际佩戴重量以及不同镜片配置下的续航均未在日本公告中完整说明，均写作 source not stated。官方“8 小时以上”是主张，不等于独立实测。",
        productVerdict: "这是目前最清晰的“AI 眼镜进入眼镜零售系统”案例之一：产品形态、配镜、购买入口和地区上市都已落地。它的下一关不在概念演示，而在日本真实用户能否稳定完成配对、语音、拍摄、镜片服务和数据控制。判断为 confirmed product，真实续航、地区功能和第三方维修仍需复核。"
      },
      en: {
        productName: "Meta Glasses, the displayless AI-glasses line from Meta and EssilorLuxottica",
        productType: "This is a daily wearable that combines Meta AI, open-ear audio, cameras, and ordinary eyewear fit. Meta’s Japan announcement presents it as a product family with 26 combinations of colours, lenses, and frames, including prescription support. The announcement does not claim a near-eye display, so this dossier treats it as an audio-and-camera-first AI-glasses product rather than an AR display device.",
        interactionFlow: "The wearer selects a frame and lens configuration, fits the glasses, and uses the action button to invoke Meta AI or launch a preferred feature. Voice can handle questions, calls, messages, translation, or capture. Open-ear speakers return the response without sealing the ears; the forward camera handles photos and video; and the capture LED communicates recording state to people nearby. Long-form review, editing, account management, payment, and complex privacy choices still hand off to the phone.",
        specsOrStack: "The official material discloses an action button, open-ear speakers, an advanced multi-mic array, wind-noise reduction, hands-free capture, prescription compatibility, three-way adjustable nose pads, adjustable temple tips, and over-extension hinges. The Japan notice states more than eight hours of battery life and a case that adds up to 40 hours. Camera resolution, SoC, RAM, storage, microphone count, and API version are source not stated.",
        useCases: "Concrete jobs include asking about the scene while walking, taking hands-free photos and videos, answering calls, listening to music or podcasts, translating conversations, and completing an eyewear purchase and fitting workflow in Japan. Open-ear audio suits commuting, travel, and light work where environmental awareness matters. The camera suits first-person capture. Long text, detailed editing, account control, payment, and consequential privacy decisions remain better on the phone.",
        painPointsSolved: "The product targets repeated phone retrieval, the friction of finding a voice entry point while moving, the loss of both hands during capture, and the isolation created by ordinary earbuds. Twenty-six frame and lens combinations reduce the conflict between a technology product’s appearance and corrective-vision needs. It does not remove social pressure around public capture, cloud dependence, uncertainty when the camera is blocked, notification load, or battery anxiety.",
        newTech: "The technology is a product-level combination of an action button, open-ear audio, wind reduction, multimodal AI, a camera-state light, and a prescription-lens workflow. Meta also places dynamic photo and future software updates inside the same line. The notable innovation is the continuity between first-person observation, voice invocation, capture, and personal fitting, rather than a single newly disclosed sensor.",
        availability: "Meta Japan states that Meta Glasses became available from Meta.com and authorised retailers on August 26, 2026. Exact store inventory, local pricing, and the full Japanese feature set must be checked at the purchase surface. Meta also says prescription-lens availability can vary by region. Other markets follow the global product announcement, while region-specific feature access remains a separate verification task.",
        limitsOrUnknowns: "The Japan announcement does not fully specify camera resolution, processor, storage, continuous-recording length, offline behaviour, edge/cloud division, the complete Japanese Meta AI language and feature set, enterprise-management APIs, recording and deletion logs, actual wearing weight, or battery life across lens configurations. Those details remain source not stated. The official “more than eight hours” claim is not an independent endurance test.",
        productVerdict: "This is one of the clearest cases of AI glasses entering an eyewear retail system: the form factor, fitting path, purchase surface, and regional launch are real. The next test is operational rather than conceptual: can Japanese users pair, speak, capture, fit, service, and control data reliably? Verdict: confirmed product, with real endurance, regional feature scope, and third-party service still requiring verification."
      }
    }
  }),
  topic({
    id: "viture-phantom-beast-xr", section: "global", evidenceLabel: "confirmed product", evidenceStrength: "official preorder plus media report", sourceDate: "2026-08-31", visual: vitureVisual,
    zhHeadline: "Phantom Beast 把游戏联名做成 XR 的状态切换器",
    enHeadline: "Phantom Beast turns a game collaboration into an XR state switch",
    zhFact: "VITURE 官方页列出 Phantom Beast XR Glasses 售价 US$599、174 英寸虚拟屏、120Hz、16:10 Anchor、Ultra-Wide、沉浸式 3D 和 Side Mode，并用 electrochromic lenses 在游戏和现实之间切换；媒体报道预购后将于 10 月 29 日发售。",
    enFact: "VITURE lists Phantom Beast XR Glasses at US$599 with a 174-inch virtual screen, 120Hz, 16:10 Anchor, Ultra-Wide, Immersive 3D, and Side Mode; electrochromic lenses support transitions between game and physical context. Media coverage reports an October 29 launch after preorder.",
    zhValue: "它把 XR 眼镜的核心交互从“看大屏”推进到“在多个视图状态之间保持任务连续”。Side Mode 保留现实可见性，Auto-dimming 调整环境光，定制 OSD 把游戏世界延伸到设备控制层；联名包装负责把一次购买变成收藏与身份表达。",
    enValue: "The product pushes XR eyewear from simply watching a large virtual screen toward maintaining task continuity across multiple view states. Side Mode keeps the real world available, auto-dimming manages transmission, and the custom OSD extends the game world into device controls. The collector packaging turns a purchase into identity and fandom as well as hardware.",
    zhHciLens: ["Input: USB-C device + OSD modes", "Output: 174-inch virtual display", "Context: game ↔ real-world awareness", "Feedback: dimming + spatial audio"],
    enHciLens: ["Input: USB-C device + OSD modes", "Output: 174-inch virtual display", "Context: game ↔ real-world awareness", "Feedback: dimming + spatial audio"],
    zhImplication: "XR 产品的“沉浸”指标要与退出、侧视、透明度和现实协同一起设计。联名 UI 可以提升记忆点，但不能替用户解释当前画面模式、连接状态、延迟和安全边界。",
    enImplication: "XR immersion has to be designed together with exit, side-view, transparency, and real-world coordination. A themed UI can increase memorability, but it cannot replace clear communication of view mode, connection state, latency, and safety boundaries.",
    sources: [source("VITURE Phantom Beast product page", vitureUrl, "official"), source("LEDinside / PR Newswire report", vitureNewsUrl, "global")],
    dossier: {
      zh: {
        productName: "VITURE × S-GAME Phantom Beast XR Glasses",
        productType: "它是以 VITURE Beast 为基础、围绕《Phantom Blade Zero》设计的消费级 XR 显示眼镜。产品包含游戏主题外观、专属 OSD、收藏级包装和与游戏同步的发售节奏，核心仍是把来自手机、掌机、电脑或游戏主机的画面放到近眼虚拟大屏中。",
        interactionFlow: "用户通过 USB-C 把眼镜接到 Windows、macOS、iOS、Android 或 Steam Deck，也可以使用 VITURE Mobile Dock 连接主机。佩戴后选择 16:10 Anchor、Ultra-Wide、Immersive 3D 或 Side Mode；VisionPair 3DoF 维持空间感，用户用 OSD 调整视图和设备设置。Side Mode 提高透明度，让用户在保持游戏画面的同时查看周围环境。",
        specsOrStack: "官方页和发布报道披露 174 英寸（4 米处）虚拟屏、每眼 1200p、120Hz 刷新率、最高 1,250 nits、9 级 electrochromic dimming、VisionPair 3DoF、HARMAN AudioEFX 空间音效和 USB-C 连接。官方页还列出 16:10、Ultra-Wide、3D 与 Side Mode；眼镜重量、电池、摄像头、SoC 和独立运行能力 source not stated。",
        useCases: "最具体的场景是 Phantom Blade Zero、AAA 游戏、Steam Deck 和长途旅行中的私人观影；Side Mode 适合需要偶尔看现实环境的用户，Ultra-Wide 适合 PC 游戏，3D 模式适合有深度内容。它也可作为手机、电脑和主机的第二显示器。它不是显示外的 AI 眼镜，产品页面没有把视觉问答或 agent 交互作为核心。",
        painPointsSolved: "它减少小屏游戏、公共屏幕缺少隐私、长途移动场景中无法获得大画面，以及频繁在沉浸画面和现实环境之间摘戴眼镜的痛点。主题 OSD、盒子和地图把硬件与游戏世界连成一体。它没有解决颈部舒适性、视觉疲劳、线缆约束、平台适配、视力矫正、多人共享和持续佩戴的社交可见性。",
        newTech: "新技术重点在于把 120Hz Micro-OLED、棱镜光学、自动调光、3DoF、空间音效和 Side Mode 组合为一个可切换的视图系统。Auto-dimming 不只是画质功能，它也是现实环境进入交互状态的反馈；专属 OSD 则把软件主题与硬件状态绑定。产品未披露新的 AI 模型或机器人能力。",
        availability: "VITURE 官方页当前显示 US$599 和预购入口；LEDinside 转述 PR Newswire 称产品于 2026 年 10 月 29 日发售，预购渠道包括 VITURE.com 与 IGN Store。不同国家的库存、处方镜片、退换货、税费和主机 Dock 兼容性需要按销售地区核对，其他细节 source not stated。",
        limitsOrUnknowns: "实际视场角、边缘清晰度、重量、佩戴压力、长时间 120Hz 的发热、3D 内容兼容性、USB-C 设备供电、延迟、护眼表现、处方镜片和实际发售时间均需独立测试。官方描述的 174 英寸是观看距离相关的虚拟屏尺寸，不能直接等同于真实可视面积。",
        productVerdict: "Phantom Beast 是已进入预购的 confirmed product，产品创新主要在视图状态、现实协同和主题化设备层。它对 AI Daily 的价值在于提醒团队：沉浸式产品要把进入、保持、退出和恢复都做成可见状态。判断为适合重度游戏和移动显示用户；对需要全天 AI 助理的人，它仍是另一条产品路线。"
      },
      en: {
        productName: "VITURE × S-GAME Phantom Beast XR Glasses",
        productType: "This is a consumer XR display product built on VITURE’s Beast platform and designed around Phantom Blade Zero. It adds game-specific industrial design, a themed OSD, collector packaging, and a launch cadence tied to the game. The underlying job remains placing a private, large virtual display from a phone, handheld, computer, or console into near-eye view.",
        interactionFlow: "The wearer connects through USB-C to Windows, macOS, iOS, Android, or Steam Deck, or uses a VITURE Mobile Dock for console sources. After putting on the glasses, the user chooses 16:10 Anchor, Ultra-Wide, Immersive 3D, or Side Mode. VisionPair 3DoF maintains spatial presentation while the OSD exposes viewing and device settings. Side Mode raises transparency so the wearer can keep gameplay active while checking the physical environment.",
        specsOrStack: "The official page and launch coverage disclose a 174-inch virtual screen at four metres, 1200p per eye, 120Hz refresh, up to 1,250 nits, nine-level electrochromic dimming, VisionPair 3DoF, HARMAN AudioEFX spatial sound, and USB-C connectivity. The page lists 16:10, Ultra-Wide, 3D, and Side Mode. Weight, battery, camera, SoC, and standalone operation are source not stated.",
        useCases: "The strongest use cases are Phantom Blade Zero and other AAA games, Steam Deck sessions, private viewing while travelling, and a portable second display for phone or computer work. Side Mode suits users who need occasional environmental awareness; Ultra-Wide suits PC games; 3D suits compatible depth content. The product page does not position it as an AI-vision assistant or a general agentic wearable.",
        painPointsSolved: "Phantom Beast addresses small-screen gaming, the lack of privacy on public displays, limited screen real estate while travelling, and the need to remove a headset whenever the wearer wants to check the real world. The themed OSD, case, and map connect the physical product to the game world. It does not solve neck comfort, eye fatigue, cable dependence, platform fragmentation, prescription fit, shared viewing, or social visibility during extended wear.",
        newTech: "The technical story is the combination of 120Hz Micro-OLED panels, prism optics, auto-dimming, 3DoF, spatial audio, and a set of view states that can be switched in place. Auto-dimming is also a state cue for how much of the physical environment is entering the interaction. The themed OSD binds software identity to device state. No new AI model or robotics capability is claimed.",
        availability: "VITURE’s product page shows a US$599 preorder path. LEDinside, citing PR Newswire, reports an October 29, 2026 launch and preorder availability through VITURE.com and the IGN Store. Regional inventory, prescription-lens options, returns, taxes, and console-dock compatibility need to be checked per market; other details are source not stated.",
        limitsOrUnknowns: "Independent testing is still needed for actual field of view, edge clarity, weight, pressure, heat during long 120Hz sessions, 3D compatibility, USB-C power draw, latency, eye comfort, prescription fit, and delivery timing. The 174-inch claim depends on viewing distance and should not be read as a direct measurement of visible area.",
        productVerdict: "Phantom Beast is a confirmed product with an active preorder. Its product contribution is a view-state system for immersion, real-world coordination, and themed device control. For product teams it is a reminder that immersive hardware needs visible entry, persistence, exit, and recovery states. Verdict: compelling for gaming and portable display users; it is a different route from an all-day AI assistant."
      }
    }
  }),
  topic({
    id: "jorjin-j9-eye-tracking-ar", section: "china", evidenceLabel: "confirmed product", evidenceStrength: "official product page / regional hardware signal", sourceDate: "2026-08-31", visual: j9Visual,
    zhHeadline: "Jorjin J9 把眼动模块做成可演进的 AR 设备平台",
    enHeadline: "Jorjin J9 makes eye tracking a modular AR-device platform",
    zhFact: "Jorjin 官方产品页将 J9 定义为眼动 AR 眼镜，披露可选全彩单目近眼显示、低于 50g、13MP 相机、Wi‑Fi 6、Bluetooth 5.3、IMU、环境光/接近/磁力计、麦克风与扬声器，并标出 SDK 和模块化平台。",
    enFact: "Jorjin’s product page describes J9 as eye-tracking AR glasses with an optional full-colour monocular near-eye display, under 50g, a 13MP camera, Wi-Fi 6, Bluetooth 5.3, IMU, ambient-light, proximity and magnetometer sensing, microphone and speaker, an SDK, and a modular platform.",
    zhValue: "J9 的重点是把眼动从一个输入功能变成硬件集成和开发者入口：同一副眼镜可以按场景选择显示、处方镜片、相机和传感器组合。这样的平台路线适合工业、物流、远程协作和辅助交互，但也把校准、视线隐私和 SDK 完整度推到产品核心。",
    enValue: "J9 treats eye tracking as both an input capability and a hardware-integration and developer surface. The same frame can be configured around display, prescription optics, camera, and sensors for different jobs. That platform route fits industry, logistics, remote assistance, and accessibility, while making calibration, gaze privacy, and SDK completeness central product questions.",
    zhHciLens: ["Input: gaze + voice + sensor state", "Output: optional monocular NED", "Context: work scene + modular hardware", "Risk: calibration and gaze privacy"],
    enHciLens: ["Input: gaze + voice + sensor state", "Output: optional monocular NED", "Context: work scene + modular hardware", "Risk: calibration and gaze privacy"],
    zhImplication: "眼动产品要让用户看到校准质量、当前注视目标、误触保护和数据保存范围；SDK 不能只承诺 limitless applications，还要给出权限、采样、失败回退和无显示配置下的反馈合同。",
    enImplication: "Eye-tracking products need visible calibration quality, current target, accidental-trigger protection, and data-retention boundaries. An SDK cannot stop at “limitless applications”; it needs permission, sampling, failure fallback, and feedback contracts for display and displayless configurations.",
    sources: [source("Jorjin J9 official product page", j9Url, "china"), source("Jorjin company product index", "https://jorjin.com/products", "china")],
    dossier: {
      zh: {
        productName: "Jorjin J9 Eye-Tracking AR Glasses",
        productType: "它是面向 AR 应用的模块化眼镜平台，核心特征是超小型眼动模块，可选单目近眼显示，以及相机、无线连接、惯性和环境传感器。Jorjin 将它放在 AI-XR Solution 与 AR smart glasses 产品线中，官方页还提供 SDK 入口，目标更接近可配置的 B2B/开发者设备，而非已完成消费电子体验的单一 SKU。",
        interactionFlow: "用户佩戴并完成眼动校准，通过注视选择目标、语音或其他设备输入确认，再由单目近眼显示、扬声器或连接终端返回结果。13MP 相机和传感器为视觉、姿态、接近与环境状态提供上下文；如果选用无显示配置，结果需要回到声音、手机或外接系统。具体的 gaze dwell、blink、gesture 或 SDK 调用流程 source not stated。",
        specsOrStack: "官方页披露总重量低于 50g；可选全彩单目显示，FOV 25°，分辨率 SQVGA 500×380；13MP 相机，支持短视频；Wi‑Fi 6 与 Bluetooth 5.3（Classic 与 BLE）；IMU、环境光传感器、接近传感器、磁力计、麦克风和扬声器；可调光电致变色模块、处方镜片兼容和 SDK。处理器、RAM、存储、电池、采样率和操作系统 source not stated。",
        useCases: "可落地的场景包括仓储拣选、制造装配、远程专家指导、培训、维修、视线驱动的信息选择、需要双手工作的辅助交互，以及把相机视角与注视目标结合起来的 AR 应用。低于 50g 和处方镜片兼容有利于长时间佩戴，但工业噪声、汗液、强光和不同眼型会影响校准与可用性。",
        painPointsSolved: "眼动可以减少在移动工作中寻找按钮、重复触摸小屏、把双手从设备上移开，以及在视线已经指向目标后再次表达选择的痛点。模块化设计减少为每个行业重做整副眼镜的成本。它没有自动解决误注视、视线被当作意图、多人共享设备、眼动数据敏感性、相机隐私和现场网络中断。",
        newTech: "新技术组合包括 50% 更小的眼动模块、可选 NED 投影和波导、集成 electrochromic light control、处方镜片、短视频相机、完整 sensing hub 与 SDK。平台化的关键在于同一机械和软件边界可演进，而不是把眼动当成单独的 demo。Jorjin 没有公开眼动模型、校准算法或开发者权限细节。",
        availability: "官方页写明 J9 在 AWE USA 2026 Booth #851 展示，并开放 contact now 的销售入口；页面没有给出公开零售价、量产日期、购买链接、地区库存或开发包条款。本文将它视为官方产品/区域硬件信号，具体可获得性写作 source not stated。",
        limitsOrUnknowns: "眼动精度、校准时间、不同光线和处方镜片下的表现、持续续航、热管理、相机与麦克风的录像/录音控制、SDK 文档、企业管理、无线安全、显示与无显示版本的价格和重量分布都未披露。官方规格是产品页主张，尚无独立实测与部署案例。",
        productVerdict: "J9 的价值在于给 AR 眼镜提供一个可配置的眼动和传感器底座，适合开发者与行业试点。它不是“眼睛看哪里就自动做什么”的成熟交互，产品成败取决于校准可见性、注视意图确认、数据最小化和 SDK 真实开放程度。判断为 confirmed product / regional hardware signal，量产和可购买边界仍需核验。"
      },
      en: {
        productName: "Jorjin J9 Eye-Tracking AR Glasses",
        productType: "J9 is a modular AR-glasses platform built around a compact eye-tracking module, an optional monocular near-eye display, a camera, wireless connectivity, inertial sensing, and environmental sensors. Jorjin places it in its AI-XR and AR smart-glasses portfolio and exposes an SDK entry point. The positioning is closer to a configurable B2B and developer device than to a completed mass-market consumer SKU.",
        interactionFlow: "The wearer puts on the glasses and performs gaze calibration, then looks at a target and confirms through voice or another input before the display, speaker, phone, or connected system returns feedback. The 13MP camera and sensor hub provide visual, pose, proximity, and environmental context. In a displayless configuration, output must return through audio, a phone, or an external system. Exact dwell, blink, gesture, and SDK call flows are source not stated.",
        specsOrStack: "The official page lists a total weight under 50g; an optional full-colour monocular display with 25° FOV and SQVGA 500×380 resolution; a 13MP camera with short-video recording; Wi-Fi 6; Bluetooth 5.3 Classic and BLE; IMU, ambient-light, proximity, and magnetometer sensors; microphone and speaker; electrochromic light control; prescription-lens compatibility; and an SDK. Processor, RAM, storage, battery, sampling rate, and operating system are source not stated.",
        useCases: "Concrete applications include warehouse picking, manufacturing assembly, remote expert support, training, repair, gaze-driven information selection, hands-busy accessibility, and AR workflows that connect camera viewpoint to gaze target. A sub-50g claim and prescription fit support longer wear, while industrial noise, sweat, bright light, and different eye shapes remain direct tests of calibration and reliability.",
        painPointsSolved: "Eye tracking can reduce button hunting during mobile work, repeated touch on small surfaces, taking hands away from equipment, and expressing a selection after the wearer is already looking at the target. Modularity can lower the cost of creating industry-specific configurations. It does not automatically solve accidental gaze, gaze being mistaken for intent, shared-device use, sensitive gaze data, camera privacy, or network loss.",
        newTech: "The product combines a 50% smaller eye-tracking module, optional NED projector and waveguide optics, integrated electrochromic light control, prescription lenses, a short-video camera, a full sensing hub, and an SDK. The platform idea is that the mechanical and software boundary can evolve across use cases, rather than treating eye tracking as an isolated demo. Jorjin has not published the gaze model, calibration algorithm, or developer permission details.",
        availability: "The official page says J9 is being unveiled at AWE USA 2026, Booth #851, and provides a contact-for-sales path. It does not give a public retail price, mass-production date, purchase link, regional inventory, or developer-kit terms. This dossier therefore treats it as an official regional hardware signal and records specific availability as source not stated.",
        limitsOrUnknowns: "Gaze accuracy, calibration time, behaviour across lighting and prescription lenses, runtime, thermal limits, camera and microphone recording controls, SDK documentation, enterprise management, wireless security, and price and weight distribution between display and displayless variants remain undisclosed. The specifications are product-page claims without independent hands-on validation or deployment evidence.",
        productVerdict: "J9 contributes a configurable eye-tracking and sensing base for AR-glasses developers and industry pilots. It is not evidence that “look and the system automatically acts” is solved. Success depends on visible calibration, confirmation of gaze intent, data minimisation, and genuine SDK openness. Verdict: confirmed product and regional hardware signal, with production and purchase boundaries still needing verification."
      }
    }
  }),
  topic({
    id: "loomos-ai-glasses-crowdfunding", section: "wild", evidenceLabel: "crowdfunding signal", evidenceStrength: "official product page plus Kickstarter record", sourceDate: "2026-08-31", visual: loomosVisual,
    zhHeadline: "Loomos 把 16MP 相机、GPT‑4o 与 450mAh 电池写进众筹承诺",
    enHeadline: "Loomos puts a 16MP camera, GPT-4o, and a 450mAh battery into a crowdfunding promise",
    zhFact: "Loomos 官方页主张 16MP 眼镜相机、4K 照片、1080p 视频、GPT‑4o、Unisoc 四核 2.0GHz AI processor、49g、450mAh、40 小时待机和 6,500mAh neckband；Kickstarter 页面记录 8,516 名支持者和 US$2,064,433 认筹，项目性质仍是 crowdfunding signal。",
    enFact: "Loomos claims a 16MP glasses camera, 4K photos, 1080p video, GPT-4o, a Unisoc quad-core 2.0GHz AI processor, 49g weight, a 450mAh battery, 40 hours of standby, and a 6,500mAh neckband. Kickstarter records 8,516 backers and US$2,064,433 pledged; the product remains a crowdfunding signal.",
    zhValue: "Loomos 代表另一种 AI 眼镜路线：把高规格相机、开放式音频、长期记忆和大电池写成一件低价日常产品。它的产品风险也被写得很清楚：宣传页把 standby、拍摄时长、云端依赖、实际交付和 app 生命周期放在同一个“all-day”叙事里，用户需要逐项验证。",
    enValue: "Loomos represents a different AI-glasses route: combine a high-resolution camera, open-ear audio, persistent memory, and a large battery into an affordable daily product. Its risk is equally clear: the all-day story bundles standby, recording duration, cloud dependence, delivery, and app longevity together, so each claim needs separate verification.",
    zhHciLens: ["Input: Hey Loomos + camera + audio", "Context: episodic memory + visual scene", "Feedback: open-ear assistant response", "Risk: crowdfunding delivery and retention"],
    enHciLens: ["Input: Hey Loomos + camera + audio", "Context: episodic memory + visual scene", "Feedback: open-ear assistant response", "Risk: crowdfunding delivery and retention"],
    zhImplication: "众筹页的数字必须拆成可测试的用户状态：待机、拍照、录像、问答、上传、检索、没电和换电。只有把每一项的时间、数据路径和失败回退写清楚，all-day 才能成为产品能力。",
    enImplication: "Crowdfunding numbers need to be decomposed into testable states: standby, photo, video, questions, upload, retrieval, low battery, and power extension. “All-day” becomes a product capability only when time, data path, and failure fallback are specified for each state.",
    sources: [source("Loomos official product page", loomosUrl, "wild"), source("Kickstarter campaign", kickstarterUrl, "crowdfunding")],
    dossier: {
      zh: {
        productName: "Loomos AI Glasses（Loomos / Sharge 相关的众筹 AI 眼镜项目）",
        productType: "它是 camera-first 的 AI 眼镜，试图将第一人称拍摄、开放式音频、GPT‑4o 助手和记忆功能放进 49g 的普通眼镜外形。官方页以“all-day”描述相机、AI、音频、待机和 neckband power bank；Kickstarter 记录了项目的支持规模，但众筹支持不等于零售交付或独立验证。",
        interactionFlow: "用户通过“Hey Loomos”唤醒助手，使用眼镜拍摄照片或视频，再从开放式扬声器接收 AI 回答、建议、翻译、记录或记忆检索。官方页强调 4K 照片、1080p 视频和 GPT‑4o，neckband power bank 可在佩戴时补充电量。实际是本地处理还是手机/云端处理、如何删除和检索记忆、录制时长如何切换，source not stated。",
        specsOrStack: "官方页主张 16MP 相机、4K 照片、1080p 视频、单次录制最多 5 分钟、AAC 0920 speakers、Unisoc 四核 2.0GHz AI processor、49g、450mAh 电池、40 小时待机、6,500mAh neckband power bank、可调鼻托、柔性铰链和支持处方镜片。实际持续 AI、视频码率、存储、无线制式、传感器和 API 版本 source not stated。",
        useCases: "它面向旅行记录、第一人称短视频、会议或灵感笔记、实时翻译、视觉提问、日常记忆回顾、通话和音乐。高分辨率相机适合想减少掏手机次数的用户，开放式音频适合移动场景。隐私敏感的室内、医疗、金融和多人会议需要在拍摄、上传、记忆和删除之间增加明确确认。",
        painPointsSolved: "Loomos 试图解决手机取出频繁、相机错过瞬间、语音助手缺少视觉上下文、耳机阻隔环境和穿戴设备中途没电的问题。大电池和 neckband 解决了能量连续性的一部分；高像素相机提升了第一人称素材的可用性。它没有证明全天录像、全天联网 AI、长期记忆成本、社交可接受性或 app 维护一定能成立。",
        newTech: "新技术叙事是把 16MP 第一人称相机、开放式 AAC 0920 音频、GPT‑4o、Unisoc AI processor 和 450mAh 电池组合到眼镜中，并用 neckband 作为外置续航层。产品若能按状态把照片、视频、问答和记忆分级处理，会形成比普通 camera glasses 更完整的 observation loop；官方没有公开这种调度逻辑。",
        availability: "Loomos 官方页保留 $10 deposit、US$189 起的 VIP offer、US$299 MSRP 和 Kickstarter 路径；Kickstarter 页面记录 2025 年项目筹款，8,516 名支持者认筹 US$2,064,433。官方 FAQ 中的 shipping starting June 2025 已经过时或与页面更新时间不一致，因此当前库存、实际交付、地区售后和退款状态写作 source not stated。",
        limitsOrUnknowns: "Kickstarter 支持数和官方参数都不能替代量产实测。相机低光、音频漏音、风噪、单次和连续录像、AI 延迟、云端费用、模型可用性、记忆删除、儿童和旁观者隐私、手机兼容、IP 防护、真实重量分布与 neckband 佩戴体验均未被当前证据完整验证。官方待机数不能等同于混合使用续航。",
        productVerdict: "Loomos 是具体且有市场拉力的 crowdfunding signal：相机、音频、AI 和电池的承诺完整，支持规模也可核验。产品判断要保持克制：它值得进入 watchlist 和实际交付追踪，不能升级为 confirmed retail product。下一步应盯量产样机、第三方评测、数据删除路径、实际续航和 app/API 生命周期。"
      },
      en: {
        productName: "Loomos AI Glasses, a crowdfunded camera-first wearable project",
        productType: "Loomos is a camera-first AI-glasses project that tries to combine first-person capture, open-ear audio, a GPT-4o assistant, and memory in a 49g ordinary-eyewear form. Its product page uses an all-day narrative across camera, AI, audio, standby, and a neckband power bank. Kickstarter support demonstrates demand and campaign activity, not retail delivery or independent validation.",
        interactionFlow: "The user says “Hey Loomos,” captures photos or video, and receives assistant answers, suggestions, translation, notes, or memory retrieval through open-ear speakers. The product page claims 4K photos, 1080p video, and GPT-4o; the neckband power bank can add power while the glasses are worn. Whether processing happens locally, on a phone, or in the cloud; how memories are deleted and retrieved; and how recording modes switch are source not stated.",
        specsOrStack: "Loomos claims a 16MP camera, 4K photos, 1080p video, up to five minutes per take, AAC 0920 speakers, a Unisoc quad-core 2.0GHz AI processor, 49g weight, a 450mAh battery, up to 40 hours of standby, a 6,500mAh neckband power bank, adjustable nose pads, flexible hinges, and prescription support. Sustained AI runtime, video bitrate, storage, wireless radios, sensors, and API version are source not stated.",
        useCases: "The target jobs are travel memory, first-person short video, meeting or idea notes, live translation, visual questions, daily recall, calls, and music. A higher-resolution camera can reduce phone retrieval for users who want useful first-person media; open-ear audio supports mobile work. Sensitive indoor, medical, financial, and group settings require explicit control across capture, upload, memory, and deletion.",
        painPointsSolved: "Loomos targets frequent phone retrieval, missed moments, the lack of visual context in voice assistants, earbud isolation, and wearable battery anxiety. A large battery and neckband address part of energy continuity, while a higher-resolution camera improves the usefulness of first-person media. The evidence does not prove all-day recording, all-day connected AI, sustainable memory cost, social acceptability, or long-term app support.",
        newTech: "The technical proposition combines a 16MP first-person camera, open-ear AAC 0920 audio, GPT-4o, a Unisoc AI processor, and a 450mAh battery, with a neckband as an external power layer. If the product schedules photo, video, questions, and memory by state, it could form a fuller observation loop than ordinary camera glasses. The current official material does not disclose that scheduling logic.",
        availability: "The official page retains a $10 deposit, a VIP offer from US$189, a US$299 MSRP, and a Kickstarter path. Kickstarter records a 2025 campaign with 8,516 backers and US$2,064,433 pledged. The FAQ’s “shipping starting June 2025” statement is stale or inconsistent with the page’s current state, so current inventory, real fulfilment, regional service, and refund status remain source not stated.",
        limitsOrUnknowns: "Backer totals and marketing specifications do not replace production testing. Low-light capture, audio leakage, wind noise, per-take and continuous recording, AI latency, cloud cost, model availability, memory deletion, bystander and child privacy, phone compatibility, ingress protection, actual weight distribution, and neckband comfort remain unverified. Standby time cannot be treated as mixed-use endurance.",
        productVerdict: "Loomos is a concrete crowdfunding signal with a coherent market promise across camera, audio, AI, and power, and its backer count is traceable. The verdict must remain bounded: it belongs on the watchlist and delivery tracker, not in confirmed retail products. Next proof points are production hardware, independent reviews, deletion controls, real endurance, and app or API longevity."
      }
    }
  }),
  topic({
    id: "monako-glass-agent-coding", section: "wild", evidenceLabel: "startup signal", evidenceStrength: "Product Hunt launch page", sourceDate: "2026-08-31", visual: monakoVisual,
    zhHeadline: "Monako Glass 把 coding agent 的等待状态放到眼前",
    enHeadline: "Monako Glass puts a coding agent’s waiting state in front of the developer",
    zhFact: "Product Hunt 页面把 Monako Glass 描述为 48g、Buildroot Linux、waveguide、骨传导麦克风和手势输入的可穿戴电脑，面向 Claude Code、Codex 等 coding agents；页面写明 300mAh、4 小时亮屏、8 小时正常使用，以及 reservation-only、US$399 方向。",
    enFact: "Product Hunt describes Monako Glass as a 48g wearable computer with Buildroot Linux, a waveguide display, a bone-conduction microphone, and gesture input for Claude Code, Codex, and other coding agents. The page lists a 300mAh battery, four hours of screen-on time, eight hours of normal use, and a reservation-only path toward US$399.",
    zhValue: "它把 agentic coding 的核心问题从“如何输入 prompt”转成“如何持续知道 agent 在做什么”。HUD 可以显示状态、等待、错误或需要确认的节点，Lua app layer 让 agent 写入并运行界面；这条路线也把延迟、权限、热量和信息密度推到脸部设备上。",
    enValue: "The product reframes agentic coding from how to enter a prompt to how to remain aware of what the agent is doing. A HUD can surface waiting, error, or confirmation states, while the Lua app layer lets an agent write and run interface code. That route also puts latency, permissions, heat, and information density on the face.",
    zhHciLens: ["Input: voice + hand gesture", "Output: waveguide HUD", "Context: coding agent runtime", "Risk: status overload and permission"],
    enHciLens: ["Input: voice + hand gesture", "Output: waveguide HUD", "Context: coding-agent runtime", "Risk: status overload and permission"],
    zhImplication: "Agent UI 的最小可用单位是状态转换：queued、running、waiting、needs approval、failed、done。HUD 如果只显示结果，会让用户错过授权和恢复节点；如果显示太多日志，又会把脸变成终端。",
    enImplication: "The minimum useful unit of agent UI is a state transition: queued, running, waiting, needs approval, failed, and done. A HUD that only shows results hides authorization and recovery points; a HUD that shows every log turns the face into a terminal.",
    sources: [source("Product Hunt Monako Glass", monakoUrl, "wild"), source("Monako website", "https://www.monako.ai", "wild"), source("Product Hunt community discussion", monakoUrl, "community")],
    dossier: {
      zh: {
        productName: "Monako Glass",
        productType: "它是面向开发者的 HUD 可穿戴电脑，把 coding agents 放到眼镜里的 waveguide 显示和 Linux 运行时上。Product Hunt 页面将其与 Claude Code、Codex 和其他 coding agents 绑定，核心任务是让开发者在离开桌面时仍能观察和操控 agent 工作，而非提供普通通知型智能眼镜。",
        interactionFlow: "用户预订设备、运行 agent，并通过语音和手势查看或改变任务状态；waveguide 显示 agent 输出、等待和需要介入的节点，骨传导麦克风在噪声环境中接收输入。Product Hunt 社区说明 MonoOS 的 Lua app layer 可让 agents 写入并即时运行界面。具体认证、命令确认、代码审查、错误回滚和多 agent 切换流程 source not stated。",
        specsOrStack: "Product Hunt 页面披露 48g、Buildroot Linux、waveguide display、bone-conduction mic、手势输入、0.5 TOPS NPU、MonoOS Lua app layer、300mAh 电池、4 小时亮屏和 8 小时正常使用；页面还写明可支持 Claude Code、Codex 和其他 coding agents。屏幕分辨率、SoC、摄像头、无线、存储、热设计与 SDK 文档 source not stated。",
        useCases: "具体场景是等待后台编码、测试、构建或部署 agent 返回结果时保持可见，进行短语音指令、批准动作、检查错误、移动中查看 CI 或让 agent 继续执行。开发者在实验室、通勤或现场调试时可以减少反复回到桌面的动作。高风险生产发布仍需要大屏、完整 diff 和明确授权。",
        painPointsSolved: "产品试图解决 coding agent 的等待时间、离开桌面后失去状态感知、频繁查看终端和在移动中无法批准下一步的问题。HUD 提供了比手机通知更靠近任务的反馈，Lua layer 让 agent 能生成工作专用界面。它没有解决小视野代码审查、语音误命令、网络断开、隐私、眩晕、续航和开发者不愿绑定专有运行时。",
        newTech: "技术组合是 waveguide、骨传导麦克风、手势输入、0.5 TOPS NPU、Buildroot Linux 与 Lua app layer。值得关注的是 agent 不只调用工具，还可能写入和运行面向自身任务的可视界面；这使 UI 成为 runtime 的一部分。页面没有公开代码仓库、权限模型、模型执行位置或 agent 与设备之间的正式协议。",
        availability: "Product Hunt 标为 reservation-only，页面写明向 US$399 unit 预订、2026 年 7–8 月 shipping 方向；当前页面没有给出已发货数量或完整零售库存。Product Hunt 的 launch page 和社区评论说明了早期兴趣，但不等同于实机交付。价格、实际发货和地区可得性以最新官方信息为准，细节 source not stated。",
        limitsOrUnknowns: "亮屏续航只写 4 小时，正常使用写 8 小时，无法代表持续 agent、无线和手势全开时的体验。视野大小、文本可读性、噪声下骨传导效果、手势精度、输入延迟、agent 认证、代码与密钥保护、离线模式、错误恢复、更新策略和长期供应都需要实机验证。",
        productVerdict: "Monako 是一个有明确任务切口的 startup signal：它把 agent 的等待和状态反馈放到头戴显示里，适合验证“agent companion display”是否比手机通知更有用。当前证据来自 Product Hunt 页面与社区讨论，价格和交付仍未被独立验证。判断为可追踪的开发者原型/预订项目，不升级为 confirmed product。"
      },
      en: {
        productName: "Monako Glass",
        productType: "Monako Glass is a developer-oriented HUD computer that places coding agents on a waveguide display and Linux runtime in glasses. Product Hunt connects it to Claude Code, Codex, and other coding agents. The core job is keeping a developer aware of and able to steer an agent away from a desk, rather than offering ordinary notification-focused smart glasses.",
        interactionFlow: "The user reserves the device, runs an agent, and uses voice and gestures to inspect or change task state. The waveguide surfaces agent output, waiting, and intervention points; the bone-conduction microphone is intended to capture input in noisy environments. Product Hunt discussion describes a Lua app layer in MonoOS that agents can write to and run immediately. Authentication, command confirmation, code review, rollback, and multi-agent switching are source not stated.",
        specsOrStack: "Product Hunt lists a 48g frame, Buildroot Linux, a waveguide display, bone-conduction microphone, gesture input, a 0.5 TOPS NPU, a MonoOS Lua app layer, a 300mAh battery, four hours of screen-on time, and eight hours of normal use. It says Claude Code, Codex, and other coding agents are supported. Display resolution, SoC, camera, radio, storage, thermal design, and SDK documentation are source not stated.",
        useCases: "Concrete jobs include waiting for coding, test, build, or deployment agents while away from a terminal; issuing short voice commands; approving actions; checking errors; viewing CI state on the move; or letting an agent continue while the developer remains mobile. Lab, commute, and field-debugging scenarios could reduce trips back to a desk. High-consequence production release still needs a large display, full diff, and explicit authorization.",
        painPointsSolved: "The product targets coding-agent waiting time, loss of state awareness away from a desk, repeated terminal checking, and the inability to approve a next step while moving. A HUD is closer to the task than a phone notification, and the Lua layer lets an agent generate a task-specific interface. It does not solve small-view code review, voice miscommands, network loss, privacy, discomfort, battery limits, or lock-in to a proprietary runtime.",
        newTech: "The combination is waveguide display, bone-conduction microphone, gesture input, a 0.5 TOPS NPU, Buildroot Linux, and a Lua app layer. The notable direction is that an agent may write and run an interface for its own task, making UI part of the runtime rather than a fixed shell. The page does not publish a code repository, permission model, execution location, or formal agent-device protocol.",
        availability: "Product Hunt marks the product reservation-only and describes a reservation toward a US$399 unit with July–August 2026 shipping. The current page does not disclose units shipped or complete retail inventory. Launch-page attention and community comments demonstrate early interest, not hardware delivery. Price, actual shipping, and regional availability remain source not stated beyond the listing.",
        limitsOrUnknowns: "Four hours of screen-on time and eight hours of normal use do not describe an agent workload with wireless and gestures continuously active. Field of view, text legibility, bone-conduction performance in noise, gesture accuracy, input latency, agent authentication, code and secret protection, offline mode, failure recovery, update policy, and supply continuity require hands-on validation.",
        productVerdict: "Monako is a focused startup signal: it makes agent waiting and state feedback a head-worn display problem and can test whether an agent companion display is more useful than a phone notification. The evidence is a Product Hunt page plus community discussion; price and delivery are not independently verified. Verdict: a trackable developer prototype or reservation project, not a confirmed product."
      }
    }
  }),
  topic({
    id: "rayneo-x3-pro-review-friction", section: "reviews", evidenceLabel: "review/community friction", evidenceStrength: "TechRadar hands-on review", sourceDate: "2026-07-14", visual: rayneoVisual,
    zhHeadline: "RayNeo X3 Pro 的 MicroLED 很亮，续航和社交可见性更亮",
    enHeadline: "RayNeo X3 Pro’s MicroLED is bright; battery and social visibility are brighter problems",
    zhFact: "TechRadar 评测称 X3 Pro 重 76g、采用最高 6,000 nits MicroLED、Snapdragon AR1、4GB RAM 和 12MP Sony IMX681 相机；评测同时把 245mAh 电池、价格、侧载和公共场合显眼程度列为主要障碍。",
    enFact: "TechRadar reports a 76g X3 Pro with a MicroLED display rated up to 6,000 nits, Snapdragon AR1, 4GB RAM, and a 12MP Sony IMX681 camera. The review identifies the 245mAh battery, price, sideloading, and public conspicuousness as central obstacles.",
    zhValue: "它提供了一个重要的产品 reality check：显示、亮度和相机能力可以在技术上成立，但全天佩戴仍由电池、重量、软件生态、社交接受度和对英语/地区的理解共同决定。评测把“能不能买”从参数表拉回到连续使用。",
    enValue: "It is a useful product reality check: display, brightness, and camera capability can work technically while all-day wear remains governed by battery, weight, software ecosystem, social acceptance, and language or regional assumptions. The review moves the buying question beyond the spec sheet and into sustained use.",
    zhHciLens: ["Input: voice + touch + AR view", "Output: binocular MicroLED", "Constraint: 245mAh active runtime", "Friction: public wear and sideloading"],
    enHciLens: ["Input: voice + touch + AR view", "Output: binocular MicroLED", "Constraint: 245mAh active runtime", "Friction: public wear and sideloading"],
    zhImplication: "评测里的“技术最好”不能直接转译成“产品适合所有人”。AR 眼镜必须把电量、热量、通知、亮度和社交状态做成用户可读的降级路径，软件生态也要让非开发者能完成安装和恢复。",
    enImplication: "A review saying “technically impressive” cannot be translated into “right for everyone.” AR glasses need legible degraded paths for battery, heat, notifications, brightness, and social context, while the software ecosystem must make install and recovery accessible to non-developers.",
    sources: [source("TechRadar RayNeo X3 Pro review", rayneoReviewUrl, "reviews"), source("Tom's Guide smart-glasses testing", "https://www.tomsguide.com/computing/vr-ar/best-smart-glasses", "reviews")],
    dossier: {
      zh: {
        productName: "RayNeo X3 Pro AI+AR Smart Glasses",
        productType: "它是带双眼 MicroLED 显示、相机和 Gemini AI 的 AR 眼镜，定位在 display + AI 的高能力端。TechRadar 将它视为第一代 AR 产品：技术能力显著，但生态、续航和佩戴仍未达到大众全天候设备的稳定性。这里的产品事实和痛点来自独立评测，不能当作官方发布口径。",
        interactionFlow: "用户佩戴眼镜，通过语音、触控和 AR 视觉查看导航、翻译、会议转录或 Gemini 回答；相机可用于拍摄和视觉理解，显示把结果叠加在视野中。评测提到软件和侧载会影响使用，说明从开箱、安装到日常调用并非总是系统默认路径。具体手势映射、离线模式和权限流程 source not stated。",
        specsOrStack: "TechRadar 列出 76g、最高 6,000 nits MicroLED、Snapdragon AR1、4GB RAM、12MP Sony IMX681 相机和 245mAh 电池；评测还讨论双眼显示、Gemini、导航和拍摄。显示分辨率、存储、SoC 的完整配置、无线、充电时长、API 与系统更新承诺 source not stated。",
        useCases: "评测认为它适合早期采用者、AR 开发者，以及 live translation、heads-up navigation 和 meeting transcription 等明确场景。双眼显示适合在户外读取信息和观看空间内容，相机适合视觉问答。需要全天候轻量音频、隐形社交外观、长时间录像或简单 app 生态的用户会遇到更大摩擦。",
        painPointsSolved: "它减少在导航和翻译时反复低头看手机、把视觉上下文交给 AI、在户外查看近眼信息和用相机记录的步骤。76g 与高亮度让显示硬件更接近可用状态。评测暴露的痛点包括续航短、价格高、公共场合显眼、软件侧载、性能不稳定和非美国英语用户的理解偏差。",
        newTech: "产品把双眼 MicroLED、6,000 nits 级亮度、Snapdragon AR1、12MP 相机和 Gemini AI 组合进一副可购买的 AR 眼镜。真正的技术挑战是显示、相机、AI、热和 245mAh 电池同时运行时的系统调度；评测没有证明能够全天维持所有能力。",
        availability: "TechRadar 将其描述为可购买产品，并以评测给出价格和购买判断，但本次证据没有在统一市场页上核对当前库存、地区、处方镜片或售后条款，均写作 source not stated。评测日期为 2026 年 7 月 14 日，软件和固件可能随后更新。",
        limitsOrUnknowns: "独立证据最明确的是 245mAh 电池造成的主动使用限制；真实连续 AI、视频、导航和显示时长仍需按模式测试。户外亮度、眼疲劳、侧载安全、Gemini 地区与语言覆盖、数据上传、相机隐私、更新寿命、公共空间接受度和维修成本都没有被一篇评测完全回答。",
        productVerdict: "X3 Pro 是“技术上成立、日常仍有门槛”的 review/community friction 样本。对 AR 开发者和明确任务用户有价值，对期待全天候通用穿戴的主流用户不够成熟。产品判断应优先看 active runtime、软件恢复、语言覆盖和社交可见性，而不是只看亮度和相机像素。"
      },
      en: {
        productName: "RayNeo X3 Pro AI+AR Smart Glasses",
        productType: "This is an AR-glasses product with binocular MicroLED displays, a camera, and Gemini AI, positioned at the high-capability display-plus-AI end of the category. TechRadar treats it as a first-generation AR product: technically significant, yet still short of mainstream all-day reliability because of ecosystem, battery, and wearability constraints. These facts and frictions come from an independent review, not a company specification sheet.",
        interactionFlow: "The wearer uses voice, touch, and the AR view to access navigation, translation, meeting transcription, or Gemini answers. The camera supports capture and visual understanding; the display places results in the field of view. TechRadar’s discussion of software and sideloading indicates that setup, installation, and daily invocation are not always a default consumer path. Exact gesture mapping, offline mode, and permissions are source not stated.",
        specsOrStack: "TechRadar lists 76g weight, a MicroLED display rated up to 6,000 nits, Snapdragon AR1, 4GB RAM, a 12MP Sony IMX681 camera, and a 245mAh battery. The review also discusses binocular display, Gemini, navigation, and capture. Display resolution, full SoC configuration, storage, radios, charging time, API surface, and update commitment are source not stated.",
        useCases: "The review identifies early adopters, AR developers, live translation, heads-up navigation, and meeting transcription as credible use cases. Binocular display helps with outdoor information and spatial content; the camera supports visual questions. Users who need lightweight all-day audio, discreet social appearance, long recording, or a simple app ecosystem will encounter more friction.",
        painPointsSolved: "The product reduces repeated phone glances for navigation and translation, gives AI visual context, enables near-eye outdoor information, and makes capture available from the face. The 76g design and high brightness move display hardware toward practical use. The review exposes short active battery life, high price, public conspicuousness, software sideloading, patchy performance, and assumptions about English-speaking Americans.",
        newTech: "The product combines binocular MicroLED, up-to-6,000-nit brightness, Snapdragon AR1, a 12MP camera, and Gemini AI in a purchasable AR-glasses form. The hard systems problem is scheduling display, camera, AI, thermal load, and a 245mAh battery at once; the review does not establish that all capabilities can run all day.",
        availability: "TechRadar treats the device as available for purchase and evaluates its value, but this evidence set does not independently verify current inventory, region, prescription options, or service terms on a unified sales page. Those details remain source not stated. The review is dated July 14, 2026, so firmware and software may have changed after testing.",
        limitsOrUnknowns: "The clearest independent limit is the active-use constraint created by the 245mAh cell; continuous AI, video, navigation, and display time still need mode-by-mode testing. Outdoor brightness, eye fatigue, sideload security, Gemini language and region coverage, data upload, camera privacy, update longevity, public acceptance, and repair cost are not fully answered by one review.",
        productVerdict: "X3 Pro is a review/community friction sample of technology that works while daily use remains demanding. It is relevant to AR developers and focused tasks, less ready for mainstream users expecting an all-day general wearable. Product judgment should prioritise active runtime, software recovery, language coverage, and social visibility alongside brightness and camera pixels."
      }
    }
  }),
  topic({
    id: "first-person-intelligence-platforms-research", section: "research", evidenceLabel: "research signal", evidenceStrength: "arXiv survey / research framework", sourceDate: "2026-08-25", visual: arxivVisual,
    zhHeadline: "《From Seeing to Acting》把智能眼镜从功能表拆成证据等级",
    enHeadline: "From Seeing to Acting turns smart glasses from a feature list into evidence levels",
    zhFact: "arXiv 论文于 2026 年 8 月 25 日提交，提出 first-person data flow、八条可验证硬件/平台能力轴、七项基础能力和 L0–L5 证据等级，并把评估失败反馈到硬件、runtime、状态策略和能力声明。它是 research signal，不是产品发布。",
    enFact: "The arXiv paper submitted on August 25, 2026 formalizes first-person data flow, eight verifiable hardware and platform axes, seven foundational capabilities, and an L0–L5 evidence scale. It feeds observed failures back into hardware, runtime, state policy, and capability claims. It is a research signal, not a product launch.",
    zhValue: "这项研究直接提供了一种产品审计工具：相机、麦克风、IMU、显示、交互控制、SoC、连接、SDK 和数据接口可以逐项核验；capture、perception、context、memory、governed action 到 embodied coupling 不能被一句“AI glasses”抹平。",
    enValue: "The paper offers a practical audit tool for products: cameras, microphones, IMUs, displays, controls, SoC, connectivity, SDKs, and data interfaces can be checked separately. Capture, perception, context, memory, governed action, and embodied coupling should not be flattened into one “AI glasses” label.",
    zhHciLens: ["Input: egocentric sensor stream", "State: L0 capture → L5 coupling", "Evidence: capability-by-capability", "Risk: overclaiming autonomy"],
    enHciLens: ["Input: egocentric sensor stream", "State: L0 capture → L5 coupling", "Evidence: capability-by-capability", "Risk: autonomy overclaiming"],
    zhImplication: "产品评测和 PRD 应把“看见、理解、记住、建议、执行、与身体/机器人耦合”分开验收，并为每个状态留下失败样本、权限边界和回退路径；论文框架可以成为内部 QA 表，而不能直接替代用户研究。",
    enImplication: "Product reviews and PRDs should separately verify seeing, understanding, remembering, suggesting, acting, and coupling to bodies or robots, with failure samples, permission boundaries, and fallbacks for each state. The paper can inform an internal QA matrix; it cannot replace user research.",
    sources: [source("arXiv: From Seeing to Acting", arxivUrl, "research"), source("Project repository linked by authors", "https://github.com/jiangning-zhang/SmartGlasses-Survey", "research")],
    dossier: {
      zh: {
        productName: "From Seeing to Acting: Smart Glasses as First-Person Intelligence Platforms（研究框架）",
        productType: "它是一篇关于智能眼镜作为 first-person intelligence platform 的研究综述和评估框架，不是可购买产品。论文把硬件基础、数据流、能力轴、真实场景、责任结构和标准化评估连成闭环，适合作为产品审计、研究复现和能力声明的参考。",
        interactionFlow: "使用方式是先描述设备实际采集的第一人称视频、音频、IMU、显示和交互输入，再把系统能力定位到 L0–L5 证据等级，观察失败并反推硬件、runtime、权限和状态策略。产品团队可以用它检查“捕获→感知→上下文→记忆→受治理的行动→具身耦合”每一段是否有证据。它没有提供面向终端用户的 app 操作流程。",
        specsOrStack: "论文明确提出八条可验证硬件/平台能力轴，包括 camera、microphone、IMU、display、interaction controls、SoC、connectivity、SDK 和 data-access interfaces；又将能力分为七个基础方向，并用 L0–L5 表示证据等级。它引用 SuperGlasses、WearVQA、SAW-Bench、GLIMPSE、EgoSAT 等工作；具体产品的传感器规格不由论文统一定义。",
        useCases: "框架覆盖日常情境辅助、OCR/翻译、个性化 episodic memory、上下文检索、多模态对话、权限治理工具调用、社会协作、空间智能、移动安全和跨具身迁移。对产品团队而言，可用于定义每个场景需要什么传感器、反馈和责任人；对用户而言，它解释为什么同样叫 AI glasses 的设备能力差异很大。",
        painPointsSolved: "研究试图解决产品宣传把 capture、visual QA、memory、action 和 robot coupling 混成一个能力，导致评测不可比较、失败不可追踪、责任不清和用户预期过高的问题。逐轴验证帮助团队识别“模型会回答”与“系统能在现场完成动作”之间的差距。它不直接解决数据采集、隐私同意、标准落地或商业交付。",
        newTech: "新技术贡献是 first-person data-flow formalization、八轴 capability consolidation、七项基础能力、L0–L5 evidential level，以及将 evaluation failure 反馈到 design 的闭环。它还把 application scene 与 responsibility structure 连接起来。论文是方法和框架信号，不能把 L5 读成行业认证或任何产品已经达到的等级。",
        availability: "论文已在 arXiv 公开，提交日期为 2026 年 8 月 25 日，并链接了项目仓库。研究文本、引用和代码状态可能继续变化；它没有产品售价、设备供货、SDK 下载包或商业服务。本文将其作为 research signal 进入今日 issue，并保留独立复现和同行评审边界。",
        limitsOrUnknowns: "论文框架需要更多跨设备、跨语言、跨人群和真实部署验证；L0–L5 如何被不同实验室一致打分、失败样本如何公开、隐私与同意如何进入 benchmark、眼动和多方协作如何测量、研究代码是否长期维护都未确定。框架也不替代对具体设备电量、延迟、热和社会接受度的实测。",
        productVerdict: "这是一条高价值 research signal：它能帮助产品和 QA 把“看见到行动”拆成可追溯合同。它的产品结论是方法论层面的：任何 AI 眼镜 claim 都应带能力轴、证据等级和失败边界。保持 downgraded，不把论文框架升级成已验证产品、标准或商业 API。"
      },
      en: {
        productName: "From Seeing to Acting: Smart Glasses as First-Person Intelligence Platforms, a research framework",
        productType: "This is a research survey and evaluation framework for smart glasses as first-person intelligence platforms, not a purchasable product. It links hardware substrate, data flow, capability axes, real-world scenes, responsibility structures, and standardised evaluation into a loop. It can inform product audits, replication, and capability claims.",
        interactionFlow: "The framework starts by describing the device’s first-person video, audio, IMU, display, and interaction inputs, then maps system capability to L0–L5 evidence levels, observes failures, and feeds them back into hardware, runtime, permissions, and state policy. A product team can inspect capture, perception, context, memory, governed action, and embodied coupling separately. The paper does not provide an end-user app flow.",
        specsOrStack: "The paper defines eight verifiable hardware and platform axes, including camera, microphone, IMU, display, interaction controls, SoC, connectivity, SDKs, and data-access interfaces. It also identifies seven foundational capabilities and an L0–L5 evidence scale, referencing SuperGlasses, WearVQA, SAW-Bench, GLIMPSE, and EgoSAT. It does not standardise the sensor specification of one commercial device.",
        useCases: "The framework covers daily situated assistance, OCR and translation, episodic memory, context retrieval, multimodal dialogue, permission-governed tool use, social collaboration, spatial intelligence, mobility safety, and cross-embodiment transfer. For product teams, it can specify which sensors, feedback, and responsible actors a scene requires. For users, it explains why products labelled AI glasses vary widely in actual capability.",
        painPointsSolved: "The research addresses the tendency to collapse capture, visual question answering, memory, action, and robot coupling into one product claim, making comparison weak, failure hard to trace, responsibility unclear, and expectations too high. Capability-by-capability evidence distinguishes a model that can answer from a system that can complete an action in the field. It does not itself solve data consent, standard adoption, or commercial delivery.",
        newTech: "Its contribution is first-person data-flow formalisation, eight-axis capability consolidation, seven foundational capabilities, L0–L5 evidential levels, and a closed loop that feeds evaluation failures back into design. It also connects application scenes to responsibility structures. The work is a method signal; L5 must not be read as a certification or as proof that any commercial product has reached it.",
        availability: "The paper is public on arXiv with an August 25, 2026 submission date and a linked project repository. The text, citations, and code may continue to change. It has no product price, device inventory, SDK download, or commercial service. This issue treats it as a research signal and preserves the boundary of independent replication and peer review.",
        limitsOrUnknowns: "The framework still needs cross-device, cross-language, cross-population, and real-deployment validation. It is unresolved how different labs should score L0–L5 consistently, publish failure samples, include privacy and consent in benchmarks, measure gaze and multi-party collaboration, and maintain research code over time. It also cannot replace hands-on testing of battery, latency, heat, or social acceptance for a specific device.",
        productVerdict: "This is a valuable research signal because it helps product and QA teams turn “seeing to acting” into a traceable contract. Its product-level conclusion is methodological: every AI-glasses claim should carry capability axes, evidence level, and failure boundaries. Keep it downgraded; it is not a validated product, standard, or commercial API."
      }
    }
  }),
  topic({
    id: "smart-glasses-open-platform-friction", section: "community", evidenceLabel: "review/community friction", evidenceStrength: "community requirements signal", sourceDate: "2026-08-17", visual: monakoVisual,
    zhHeadline: "社区把“能不能离线、能不能换模型”列为购买条件",
    enHeadline: "Community turns offline control and model choice into buying requirements",
    zhFact: "r/SmartGlasses 的需求帖明确提出：用户希望控制软件和数据去向，能够在不连接外部服务器时使用，并期待接近 home-built PC 的开放源代码自由；这是一条社区需求和摩擦信号，不能代表普遍用户研究。",
    enFact: "A r/SmartGlasses requirements thread asks for control over software and data destinations, the ability to avoid external servers, and freedom closer to a home-built PC. It is a community demand and friction signal, not representative user research.",
    zhValue: "这条信号把 AI 眼镜的“智能”重新落到所有权和退出成本：用户不只想问模型会什么，还想知道设备是否会因 app 关停而变砖、数据是否能删除、模型能否替换、离线状态是否仍可用。",
    enValue: "The signal grounds AI-glasses intelligence in ownership and exit cost. Users are asking not only what the model can do, but whether an app shutdown can brick the device, whether data can be deleted, whether models can be swapped, and whether offline use remains possible.",
    zhHciLens: ["Input: buyer requirements", "Boundary: device ↔ cloud", "Feedback: offline/degraded state", "Risk: vendor lock-in"],
    enHciLens: ["Input: buyer requirements", "Boundary: device ↔ cloud", "Feedback: offline/degraded state", "Risk: vendor lock-in"],
    zhImplication: "开放性要变成可验收的产品字段：导出、删除、离线、换模型、维修、更新期限和恢复镜像。把这些写在 FAQ 之外，才能降低用户对长期支持的猜测成本。",
    enImplication: "Openness needs to become testable product fields: export, deletion, offline operation, model replacement, repair, update horizon, and recovery image. Publishing those fields beyond an FAQ reduces the user’s cost of guessing about long-term support.",
    sources: [source("r/SmartGlasses open-platform requirements thread", openPlatformUrl, "community"), source("r/SmartGlasses battery and privacy discussions", "https://www.reddit.com/r/SmartGlasses/", "community")],
    dossier: {
      zh: {
        productName: "智能眼镜开放平台需求（社区摩擦样本）",
        productType: "它不是单一硬件，而是一条来自 r/SmartGlasses 的购买要求：用户希望掌控软件和数据去向，能在需要时断开外部服务器，并获得接近自组电脑的开放源代码和可维修性。这属于 community friction / requirements signal，不能当作市场规模或代表性用户比例。",
        interactionFlow: "按照社区描述，理想流程是购买眼镜、选择软件和模型、决定数据是否离开设备、在离线时继续使用基础功能，并能导出或删除记录；当官方 app 停止维护时，用户希望保留诊断、刷写、替换模型或继续运行的路径。当前帖子没有提供可执行的设备 API 或协议，具体流程 source not stated。",
        specsOrStack: "社区没有给出某个产品的处理器、相机、无线、操作系统或 SDK 规格。它提出的系统字段包括本地处理、离线能力、模型可替换性、开源协议、数据导出/删除、固件诊断、维修和 app 生命周期。所有具体产品的实现方式 source not stated，不能从需求帖推断任何品牌已经具备这些能力。",
        useCases: "需求主要服务于开发者、隐私敏感用户、长期持有者、离线环境中的现场工作人员和想用自有模型做实验的人。它也影响普通消费者：如果设备必须依赖一个账户、一个 app 或一个云服务，用户会担心迁移、二手转让、维修和公司停止服务后的可用性。",
        painPointsSolved: "开放平台路线要解决云端锁定、服务关停、功能区域限制、无法排查故障、模型不能替换和数据无法带走的痛点。社区用户还担心购买多个最终失去支持的嵌入式设备。它不能自动解决安全更新、模型质量、相机隐私、功耗或开源项目维护责任。",
        newTech: "这里的新技术更像产品架构要求：本地/云端可切换 runtime、可审计的数据边界、可替换模型、可恢复固件、开放 SDK 和稳定的设备协议。社区没有证明某个产品已经提供完整开放栈，因此只能把它作为对各家 AI glasses 的验收清单，而非 confirmed technology。",
        availability: "需求帖公开可读，但没有对应的统一产品、购买入口、价格或开发包。它对 Monako、Loomos、Meta、RayNeo 等产品的启发需要回到各自官方文档和实机证据核验。社区账号、评论和需求表述的代表性、真实性、后续维护均未验证。",
        limitsOrUnknowns: "社区讨论无法回答离线 AI 的模型大小、功耗、更新安全、数据加密、密钥管理、旁观者隐私、售后责任或企业合规。也无法证明多数用户愿意牺牲便利来换取开放性。下一步需要产品级白皮书、API 文档、断网测试、数据删除演示和长期更新承诺。",
        productVerdict: "它是一条有用的 review/community friction signal：把“开放”从价值观变成购买验收项。产品团队应把离线、导出、删除、换模、维修和停止服务后的最低可用状态写清楚；研究和媒体则应避免把单个 Reddit 需求描述成普遍用户需求。"
      },
      en: {
        productName: "Open-platform requirements for smart glasses, a community-friction sample",
        productType: "This is not a single hardware product. It is a buying requirement captured in a r/SmartGlasses thread: users want control over software and data destinations, a way to disconnect from external servers, and an openness and repairability level closer to a home-built PC. It is a community-friction and requirements signal, not market-size or representative-user evidence.",
        interactionFlow: "The desired flow is to buy glasses, choose software and models, decide whether data leaves the device, retain basic functions offline, and export or delete records. If the official app is discontinued, the user wants diagnostics, flashing, model replacement, or continued operation. The thread provides no executable device API or protocol, so the concrete flow is source not stated.",
        specsOrStack: "The community post does not specify a processor, camera, radio, operating system, or SDK for one product. It asks for local processing, offline capability, replaceable models, open-source terms, data export and deletion, firmware diagnostics, repair, and app longevity. Implementation for any named product is source not stated; no brand should be inferred to provide the full stack.",
        useCases: "The requirements are most relevant to developers, privacy-sensitive users, long-term owners, field workers in disconnected environments, and people experimenting with their own models. They also affect ordinary consumers: if a device depends on one account, app, or cloud service, users worry about migration, resale, repair, and functionality after a vendor stops operating the service.",
        painPointsSolved: "An open-platform route would address cloud lock-in, service shutdown, regional feature restrictions, lack of diagnostics, non-replaceable models, and data that cannot leave the vendor’s system. The thread also describes frustration with buying embedded devices that lose support while remaining functional. It does not automatically solve security updates, model quality, camera privacy, power, or maintenance responsibility for open projects.",
        newTech: "The technical direction is architectural: a switchable local/cloud runtime, auditable data boundaries, replaceable models, recoverable firmware, open SDKs, and a stable device protocol. The community evidence does not show that one product has delivered this complete stack, so it is an acceptance checklist for AI glasses rather than confirmed technology.",
        availability: "The requirements thread is publicly readable but has no unified product, purchase surface, price, or developer kit attached. Its implications for Monako, Loomos, Meta, RayNeo, and other products must be checked against their own official documentation and hardware evidence. Account identity, comment accuracy, representativeness, and future maintenance are unverified.",
        limitsOrUnknowns: "Community discussion cannot answer offline-model size, power, update security, encryption, key management, bystander privacy, service responsibility, or enterprise compliance. It also cannot show that most users would trade convenience for openness. The next proof points are a product white paper, API documentation, offline test, deletion demonstration, and a support horizon.",
        productVerdict: "This is a useful review/community friction signal because it turns “openness” into a purchase acceptance test. Product teams should state offline, export, deletion, model replacement, repair, and minimum post-shutdown behaviour. Researchers and media should not generalise one Reddit requirement into universal user demand."
      }
    }
  })
];


const memoDevUrl = "https://www.prnewswire.com/news-releases/memomind-one-opens-developer-access-announces-kiwear-as-first-sdk-partner-302865894.html";
const memoBlogUrl = "https://www.memo-mind.com/blogs/news/memomind-one-kickstarter";
const memoHomeUrl = "https://www.memo-mind.com/";
const memoReviewUrl = "https://www.gizmodo.com/you-dont-want-smart-glasses-that-record-everything-you-say-trust-me-2000793058";
const memomindDeveloperVisual = visual(
  "memomind-one-developer-access-2026-09.jpg",
  "MemoMind One Developer Access 官方视觉",
  "MemoMind One Developer Access official visual",
  "官方视觉：MemoMind One 的 Developer Access、Bluetooth protocol 与 SDK partner 路线",
  "Official visual: MemoMind One Developer Access, Bluetooth protocol, and SDK partner roadmap",
  memoDevUrl
);
newTopics.unshift(topic({
  id: "memomind-one-developer-access",
  section: "official",
  evidenceLabel: "developer surface",
  evidenceStrength: "official developer-access announcement",
  sourceDate: "2026-09-01",
  visual: memomindDeveloperVisual,
  zhHeadline: "MemoMind One 打开 Developer Access：眼镜开始把协议交给开发者",
  enHeadline: "MemoMind One opens Developer Access: the glasses start handing their protocol to developers",
  zhFact: "MemoMind 今日宣布为 MemoMind One 开放 Developer Access，并公布 KiWear 为首个 SDK partner。首阶段路线是公开 Bluetooth communication protocol，让开发者围绕这副 AI smart glasses 开始构建新的 experiences；官方产品博客进一步写明，2026 年 9 月起将陆续提供 open-source reference library 与 working demo code。",
  enFact: "MemoMind announced Developer Access for MemoMind One today and named KiWear as its first SDK partner. Phase One is a published Bluetooth communication protocol for building new experiences around the AI smart glasses; the company’s product blog adds a September 2026 plan for an open-source reference library and working demo code.",
  zhValue: "这不是又一个“眼镜能做什么”的功能清单，而是把产品边界从 companion app 推到可调用的设备协议。用户仍通过眼镜、手机和云服务完成 AI、显示、音频与记忆工作流，但开发者终于有机会观察连接、控制和扩展的实际表面。开放程度仍由协议文档、示例代码、权限模型和版本承诺决定。",
  enValue: "This is not another feature list about what glasses might do; it moves the product boundary from a companion app toward a callable device protocol. The user still moves through glasses, phone, and cloud services for AI, display, audio, and memory workflows, but developers now have a chance to inspect the real surface for connection, control, and extension. The degree of openness will be decided by protocol documentation, examples, permissions, and version commitments.",
  zhHciLens: ["Input: Bluetooth protocol + companion phone", "Context: camera-free display glasses + AI services", "Feedback: HUD + open-ear audio", "Continuity: device → app → SDK extension"],
  enHciLens: ["Input: Bluetooth protocol + companion phone", "Context: camera-free display glasses + AI services", "Feedback: HUD + open-ear audio", "Continuity: device → app → SDK extension"],
  zhImplication: "开发者入口必须让连接状态、设备能力、权限、错误、固件版本和撤销路径可见；否则“开放协议”只会增加新的黑箱。对用户来说，第三方体验还必须说明数据去哪、哪些动作能离线完成、升级后旧 app 是否继续工作。",
  enImplication: "The developer surface must expose connection state, device capabilities, permissions, errors, firmware version, and revocation; otherwise an open protocol simply creates a new black box. For users, every third-party experience also needs to state where data goes, what can work offline, and whether an older app survives a device update.",
  sources: [
    source("MemoMind Developer Access announcement", memoDevUrl, "official"),
    source("MemoMind product blog", memoBlogUrl, "official"),
    source("MemoMind official site", memoHomeUrl, "official"),
    source("Gizmodo MemoMind review", memoReviewUrl, "reviews")
  ],
  dossier: {
    zh: {
      productName: "MemoMind One Developer Access（XGIMI 旗下 MemoMind One 的开发者开放路线）",
      productType: "它是围绕 MemoMind One camera-free display smart glasses 建立的 developer surface，不是另一款硬件。MemoMind One 的消费体验把 HUD、音频、AI、翻译、提醒和 Moments 记忆能力放进眼镜与 companion app；这次 Developer Access 把设备连接和扩展能力向开发者公开，KiWear 被宣布为首个 SDK partner。",
      interactionFlow: "开发者先获得 Developer Access，再通过 Bluetooth communication protocol 与 MemoMind One 建立连接，读取或触发文档允许的设备能力，并把结果回传到手机 app、眼镜 HUD 或音频输出。官方当前确认的是 protocol、SDK partner，以及后续 reference library 和 demo code 路线；具体 pairing、认证、命令、通知、断线重试、权限同意和应用发布流程 source not stated。用户侧仍然要先配对眼镜、授权 app，再决定是否启用第三方体验。",
      specsOrStack: "官方公告明确提到 Bluetooth communication protocol、Developer Access 和 KiWear SDK partner；官方产品博客写明 2026 年 9 月起将提供 open-source reference library 与 working demo code。MemoMind One 的产品资料和评测把它描述为无相机、带显示和音频的智能眼镜，并使用手机/云服务承接 AI 能力。Bluetooth profile、payload schema、OS/API 版本、芯片、加密、离线能力、可写入的设备状态、SDK license 和企业管理 API source not stated。",
      useCases: "最直接的开发场景是把第三方通知、导航、学习提示、会议辅助、无障碍信息或专用工作流送到眼镜的 HUD 与音频；KiWear 作为首个 SDK partner 说明厂商在尝试让外部团队进入产品链路。用户也可能用第三方 app 把手机上的任务压缩成眼前的短反馈。高风险动作、账户授权、完整文本编辑和长期记忆管理仍应回到手机确认，不能由一个 HUD 命令隐式完成。",
      painPointsSolved: "开放协议有机会减少单一 companion app 的功能锁定、厂商未覆盖的垂直场景、设备能力无法复用，以及硬件买回家后只能等待官方更新的痛点。它还可能让 camera-free glasses 的显示、音频和提醒能力获得更具体的工作流。它尚未解决云端依赖、订阅、数据导出、权限滥用、固件兼容、第三方 app 质量和服务停止后的最低可用状态。",
      newTech: "新技术信号不在一个新传感器，而在“可扩展的设备协议”成为产品承诺。Bluetooth protocol 把手机、眼镜和外部软件放入同一条控制链路；reference library 与 demo code 如果按计划公开，就能把 reverse engineering 变成有文档的开发路径。真正有价值的技术还包括能力发现、细粒度权限、版本协商、断线恢复、可撤销 token、事件审计和本地/云端边界，这些目前均未披露。",
      availability: "MemoMind 已宣布 Developer Access 和首个 SDK partner，官方博客写明 2026 年 9 月起逐步提供初始 Bluetooth protocol、open-source reference library 与 working demo code。公告没有给出公开注册入口、地区限制、开发者资格、SDK 下载地址、硬件购买条件、协议版本或 GA 日期，因此这些细节写作 source not stated。今天可确认的是路线已公开，不等于普通开发者已经拿到完整可生产 SDK。",
      limitsOrUnknowns: "目前未知项包括协议是否只读、能否控制 HUD/音频、是否暴露显示布局和通知队列、第三方 app 是否能访问 Moments 或记忆数据、配对和加密如何实现、用户如何逐项撤销权限、固件升级是否破坏兼容、API 是否稳定、SDK 是否允许商业分发，以及断网时哪些能力仍可用。官方“开放”措辞尚不足以证明可替换模型、可离线运行或完整数据导出。",
      productVerdict: "MemoMind One Developer Access 是一个明确的 developer surface，也是今天最值得追踪的产品边界变化：它把“智能眼镜应该开放吗”变成协议、代码和权限的交付问题。当前判断是 official developer surface，不能升级为 open platform 已完成。下一次验收应要求真实文档、可运行 demo、权限说明、版本兼容表和用户数据流图。"
    },
    en: {
      productName: "MemoMind One Developer Access, the developer-opening route for XGIMI’s MemoMind One",
      productType: "This is a developer surface around the MemoMind One camera-free display smart glasses, not a second hardware product. MemoMind One combines a HUD, audio, AI, translation, reminders, and Moments memory features across the glasses and companion app. The new Developer Access moves device connectivity and extension capability toward outside developers, with KiWear announced as the first SDK partner.",
      interactionFlow: "A developer first receives Developer Access, establishes a Bluetooth connection to MemoMind One, reads or triggers the capabilities permitted by the documentation, and returns the result to the phone app, the glasses HUD, or audio output. The official announcement confirms the protocol, the SDK partner, and a future reference-library and demo-code path; exact pairing, authentication, commands, notifications, reconnect behaviour, permission prompts, and publishing workflow are source not stated. On the user side, the wearer still pairs the glasses, authorises the app, and decides whether to enable a third-party experience.",
      specsOrStack: "The official announcement names a Bluetooth communication protocol, Developer Access, and KiWear as an SDK partner. The product blog says an initial open-source reference library and working demo code will arrive from September 2026. Product material and reviews describe MemoMind One as camera-free glasses with a display and audio, with the phone and cloud carrying parts of the AI experience. Bluetooth profile, payload schema, OS/API version, chip, encryption, offline behaviour, writable device state, SDK licence, and enterprise-management API are source not stated.",
      useCases: "The most direct developer use cases are third-party notifications, navigation, learning prompts, meeting assistance, accessibility information, and specialised work workflows delivered to the HUD or audio. KiWear’s position as the first SDK partner indicates an attempt to bring outside teams into the product chain. A third-party app could compress a phone task into a short cue in front of the wearer. High-risk actions, account authorisation, full-text editing, and long-term memory management should still return to the phone for confirmation rather than being completed implicitly by one HUD command.",
      painPointsSolved: "An open protocol could reduce lock-in to one companion app, the absence of vertical workflows, the inability to reuse device capabilities, and the frustration of buying hardware that can only wait for a vendor update. It may also give camera-free glasses a more concrete role in work through display, audio, and notification extensions. It does not yet solve cloud dependence, subscriptions, data export, permission abuse, firmware compatibility, third-party quality, or the minimum capability after service shutdown.",
      newTech: "The technology signal is not a newly disclosed sensor; it is the product commitment to an extensible device protocol. A Bluetooth protocol places phone, glasses, and external software in one control path. If the reference library and demo code arrive as promised, reverse engineering becomes a documented development route. The more consequential technical pieces would be capability discovery, granular permissions, version negotiation, reconnect recovery, revocable tokens, event auditing, and a local/cloud boundary, none of which has been disclosed yet.",
      availability: "MemoMind has announced Developer Access and its first SDK partner, while the official blog says an initial Bluetooth protocol, open-source reference library, and working demo code will be introduced from September 2026. The announcement does not provide a public registration path, regional limits, developer eligibility, SDK download, hardware requirement, protocol version, or GA date, so those details remain source not stated. The confirmed fact is a published roadmap, not proof that every developer already has a complete production SDK.",
      limitsOrUnknowns: "Open questions include whether the protocol is read-only, whether it can control HUD and audio, whether display layout and notification queues are exposed, whether third-party apps can reach Moments or memory data, how pairing and encryption work, how users revoke permissions individually, whether firmware updates preserve compatibility, whether the API is stable, whether commercial distribution is permitted, and what survives offline. The word “open” is not evidence of replaceable models, offline execution, or complete data export.",
      productVerdict: "MemoMind One Developer Access is a clear developer surface and the day’s most concrete boundary change: it turns “should smart glasses be open?” into a delivery test for protocol, code, and permissions. Verdict: official developer surface; do not upgrade it to a completed open platform. The next acceptance test needs real documentation, a runnable demo, permission details, a compatibility table, and a user-data-flow diagram."
    }
  }
}));


const rokidOfficialUrl = "https://global.rokid.com/products/rokid-glasses";
const rokidAustraliaUrl = "https://au.rokid.com/products/rokid-glasses";
const rokidReviewUrl = "https://www.tomsguide.com/computing/smart-glasses/i-tried-rokids-ai-ar-glasses-for-a-month-and-the-general-bad-vibes-i-have-around-wearables-are-slowly-subsiding-but-i-cant-stop-worrying-about-my-personal-data";
const rokidLongReviewUrl = "https://www.tomsguide.com/computing/smart-glasses/rokid-glasses-review";
const rokidVisual = visual(
  "rokid-glasses-official-2026-09.png",
  "Rokid Glasses 官方产品页截图，显示型 AI + AR 眼镜",
  "Rokid Glasses official product page screenshot for the display AI + AR glasses",
  "官方视觉：Rokid Glasses 的双眼显示、12MP POV 相机与当前销售入口",
  "Official visual: Rokid Glasses dual-eye display, 12MP POV camera, and current sales surface",
  rokidOfficialUrl
);
newTopics.unshift(topic({
  id: "rokid-glasses-september-review",
  section: "reviews",
  evidenceLabel: "review/community friction",
  evidenceStrength: "official product page + month-long independent review",
  sourceDate: "2026-09-02 / 2026-09-03 current source sweep",
  visual: rokidVisual,
  zhHeadline: "Rokid Glasses 把显示真正放进日常，也把数据与连接摩擦带到台面",
  enHeadline: "Rokid Glasses put a display into daily wear, then expose the data and connectivity tax",
  zhFact: "Rokid 官方产品页把 Glasses 定位成 49g 的全功能 AI + AR 眼镜，列出双眼 Micro-LED waveguide、12MP POV 相机、89 语言实时翻译、4 麦克风、开放式音频、Snapdragon AR1、210mAh、电池、SDK 与手机 app 依赖。Tom’s Guide 9 月 2 日的月度体验确认显示、相机、翻译和轻量佩戴有实际价值，同时记录了语音/位置数据留存、价格、隐私政策理解成本与生态边界。",
  enFact: "Rokid’s official product page positions Glasses as 49g full-function AI + AR eyewear and lists dual Micro-LED waveguides, a 12MP POV camera, real-time translation across up to 89 languages, four microphones, open-ear audio, Snapdragon AR1, a 210mAh battery, SDK support, and a companion-app dependency. Tom’s Guide’s September 2 month-long test found real value in the display, camera, translation, and lightweight wear, while documenting voice and location retention, price, privacy-policy comprehension cost, and ecosystem boundaries.",
  zhValue: "这条产品的关键变化是 HUD 不再只是演示层：导航、提词、实时字幕、AI 回复和相机取景都能在眼前形成反馈，用户不必频繁掏手机。代价同样具体：显示型眼镜需要手机 app 在后台运行，iOS 还要处理额外权限；相机在低光下会丢细节；AI 的语音和位置数据进入服务条款；价格与处方镜片会改变“日常佩戴”是否成立。",
  enValue: "The product’s important shift is that the HUD is no longer only a demo layer. Navigation, teleprompting, live subtitles, AI answers, and camera framing can all become in-view feedback, reducing the need to pull out a phone. The tax is equally concrete: the glasses depend on a companion app, iOS requires extra permission and background-app work, the camera loses detail in low light, voice and location data enter the service terms, and price plus prescription-lens cost can decide whether daily wear is viable.",
  zhHciLens: ["Input: voice + swipe + POV camera", "Context: phone-linked display glasses", "Feedback: HUD + open-ear audio", "Failure: low light, iOS background, privacy consent"],
  enHciLens: ["Input: voice + swipe + POV camera", "Context: phone-linked display glasses", "Feedback: HUD + open-ear audio", "Failure: low light, iOS background, privacy consent"],
  zhImplication: "对产品设计来说，Rokid 的验收重点不应停在“有没有显示”，而要看 HUD 是否能在导航、翻译、提词、AI 回复和取景之间保持清晰状态；同时把 app 在线、上传、录制、低电量、低光失败和数据删除做成可见且可恢复的状态。显示让眼镜减少手机打断，手机依赖又把系统责任拉回 companion app。",
  enImplication: "The product-design acceptance test should not stop at whether the glasses have a display. It should ask whether the HUD keeps state clear across navigation, translation, teleprompting, AI answers, and camera framing, while making app connectivity, upload, capture, low battery, low-light failure, and data deletion visible and recoverable. The display reduces phone interruption, but phone dependency moves system responsibility back into the companion app.",
  sources: [
    source("Rokid Glasses official global product page", rokidOfficialUrl, "official"),
    source("Rokid Glasses official Australia product details", rokidAustraliaUrl, "official"),
    source("Tom’s Guide month-long Rokid AI + AR glasses test", rokidReviewUrl, "reviews"),
    source("Tom’s Guide Rokid Glasses long-term review", rokidLongReviewUrl, "reviews")
  ],
  dossier: {
    zh: {
      productName: "Rokid Glasses（带显示的 AI + AR 智能眼镜）",
      productType: "Rokid Glasses 是一副把显示、相机、音频和 AI 叠在普通眼镜形态里的消费级 wearable。官方页面把它描述为 49g、双眼 Micro-LED waveguide、12MP 第一视角相机、实时翻译、提词、导航、会议转录和 hands-free AI assistant；它需要 Rokid app 连接、管理媒体、调整显示与调用工具。它的价值不在于新增一个聊天窗口，而在于把短文本、字幕、方向和取景反馈放进视野。",
      interactionFlow: "用户先通过 Rokid app 配对眼镜、登录并授予蓝牙、麦克风、相机、位置等权限，再用唤醒词、触控滑动或 app 控制开始 AI 问答、拍摄、翻译、导航、提词或转录。显示型任务把结果送到双眼 Micro-LED，音频任务通过开放式扬声器反馈，照片与视频进入手机/应用管理链路。官方确认了这些能力的产品入口，评测补充了真实使用方式；精确的状态机、权限逐项提示、断线重连、数据保留时长、导出格式和删除后的缓存行为 source not stated。",
      specsOrStack: "官方全球产品页当前展示 US$699 促销价（原价 US$799）；Tom’s Guide 的长期评测曾以 US$599 作为价格参考，9 月 2 日澳洲月测写到 AU$999，说明市场与时间会改变价格，不能合并成一个全球定价。官方/区域页面列出约 49g、双眼单色 Micro-LED waveguide、约 1,500 nits、约 480×398、约 23° FoV、12MP POV camera、四麦克风、双线性定向扬声器、IPX4、Snapdragon AR1、2GB RAM、32GB storage、210mAh、Wi‑Fi 6、Bluetooth 5.3、IMU、89 语言翻译、13 种 UI 语言、SDK supported 与手机 app。官方还列出磁吸处方镜片插入方案。具体模型路由、端云分工、加密方式、SDK 文档、API 版本、离线能力和相机/显示控制权限 source not stated。",
      useCases: "它覆盖了几类必须减少手机查看的任务：旅行时把双向翻译和导航放到视野中；演讲、直播或会议时用 teleprompter 和 transcription；走路、购物或维修时用 POV 相机询问物体、文字和环境；日常记录时直接拍照和 3K 级视频；通勤时用开放式音频听通知、音乐和 AI 回答。Tom’s Guide 的长测特别强调了显示在导航、翻译和取景上的帮助；9 月月测则把磁吸处方镜片和 49g 佩戴列为可用性条件。对于完整编辑、敏感确认、长期记忆管理和高风险动作，手机仍是更合适的确认面。",
      painPointsSolved: "它解决的是“频繁掏手机”与“只听不看”的双重摩擦：实时字幕、方向、提词与相机取景可以直接进入视野，AI 回答不必完全占用耳朵；49g、普通眼镜外形和磁吸处方方案降低了全天佩戴的门槛。它也把摄像头型眼镜的第一视角输入与显示型眼镜的可见反馈合在一件设备里。评测显示它没有解决低光成像、iOS 后台 app、权限设置、价格、处方镜片成本、特定地区功能和数据留存疑问；连续会议/字幕等重度任务的续航表现也不能用官方“8–10 小时日常使用”概括，实际取决于录制、亮度、连接与功能组合。",
      userVoice: "Tom’s Guide 9 月 2 日月测把隐私放在核心摩擦：Rokid app 要求至少 18 岁账户，设备会收集位置和使用时的语音内容，评论指出政策没有明确说明语音是否用于人工审查或模型训练；评测者因此建议用户理解条款，并知道可以通过邮件请求删除数据或删除账户。另一篇长期评测认为显示、翻译、导航、相机取景和轻量佩戴很有帮助，但指出低光相机、iOS 连接环节与处方镜片价格会降低体验。它们是独立评测信号，不代表所有用户的统计结论。",
      newTech: "Rokid 的新技术组合是把 Micro-LED waveguide、POV camera、开放式音频、手机/云 AI 和可选 SDK 放进接近普通眼镜的重量与外形。双眼显示让字幕、导航、提词和取景不必只靠声音；多模型/多服务能力让 AI 选择不被单一模型锁定，具体模型组合随地区和软件而变。产品层真正值得观察的是显示与相机是否共享同一条可见状态：用户需要知道当前是在看导航、录制、等待 AI、上传还是低电量降级。官方未公开完整的显示刷新、相机防抖、模型路由、事件日志或 SDK API，所以不能把“SDK supported”升级为开放平台已完成。",
      availability: "Rokid 全球官方页面当前提供产品购买入口，并显示 US$699 促销价；澳洲官方页面也提供产品与处方镜片信息，Tom’s Guide 9 月 2 日对澳洲价格给出 AU$999 的评测语境。官方页面的地区、折扣、库存和处方服务可能变化，不能把一个市场的价格扩展到全球。官方产品页列出 SDK supported，但没有公开完整 SDK 下载、资格、版本、开发者注册、商业授权或第三方 app 商店流程。因此可确认它是有销售入口的消费级产品，SDK 的可生产性、地区覆盖和长期服务边界仍 source not stated。",
      limitsOrUnknowns: "关键未知包括：双眼显示在强光、不同背景与长时间使用时的可读性；12MP 相机在低光、运动、逆光和社交场景的稳定性；AI 是否默认上传语音、图像与位置；删除账户后服务端、手机缓存、云端转录和设备存储如何清理；Rokid app 在 iOS 后台被系统挂起时哪些功能失效；210mAh 在录制、翻译、导航、亮度变化和会议转录组合下的真实续航；SDK 能否控制 HUD、音频、拍摄和通知；89 种语言是否全部支持同一显示/音频路径；IPX4、磁吸处方插片和镜架的长期维修成本。官方“8–10 小时”是条件化日常使用设计目标，评测中的重度字幕耗电不能被忽略。",
      productVerdict: "Rokid Glasses 是今天最强的 confirmed product + review friction 组合：显示、相机、翻译、导航和轻量佩戴已经形成可操作的日常闭环，HUD 的价值不再只是概念演示。它的产品判断也很清楚：显示确实减少手机打断，但 companion app、云端数据、iOS 后台、低光相机、处方镜片成本与区域服务决定了这条闭环能否长期成立。下一步应验收真实断网/断 app 行为、权限与数据删除、显示状态、连续录制续航、低光和 SDK 控制范围；在这些证据补齐前，不能把“开放生态”或“全天候”当成已证实事实。"
    },
    en: {
      productName: "Rokid Glasses, display-equipped AI + AR smart glasses",
      productType: "Rokid Glasses are consumer wearables that combine a display, camera, audio system, and AI inside a near-ordinary eyewear form. The official pages describe 49g frames, dual-eye Micro-LED waveguides, a 12MP first-person camera, real-time translation, teleprompting, navigation, meeting transcription, and a hands-free AI assistant. They require the Rokid app for connection, media management, display settings, and tools. The product value is not another chat window; it is the delivery of short text, subtitles, directions, and framing feedback inside the wearer’s view.",
      interactionFlow: "The user pairs the glasses through the Rokid app, signs in, and grants Bluetooth, microphone, camera, location, and related permissions. A wake phrase, touch swipe, or app control starts AI questions, capture, translation, navigation, teleprompting, or transcription. Display tasks return to the dual-eye Micro-LED system, audio tasks use open-ear speakers, and photos and video flow through the phone and app for management. The official pages confirm these entry points and the reviews add real usage context. Exact state transitions, per-permission prompts, reconnect behaviour, retention duration, export format, and post-deletion cache behaviour are source not stated.",
      specsOrStack: "The global product page currently shows a US$699 promotional price against US$799; Tom’s Guide’s longer review used US$599 as a price reference, while the September 2 Australian month-long test described AU$999. The difference is market and timing evidence, not one global price. Official and regional pages list approximately 49g, dual monochrome Micro-LED waveguides, about 1,500 nits, approximately 480×398 resolution, about 23° FoV, a 12MP POV camera, four microphones, dual linear directional speakers, IPX4, Snapdragon AR1, 2GB RAM, 32GB storage, 210mAh, Wi-Fi 6, Bluetooth 5.3, IMU, translation for up to 89 languages, 13 UI languages, SDK support, and a phone app. The official pages also describe a magnetic prescription insert. Model routing, edge/cloud split, encryption, SDK documentation, API version, offline capability, and camera/display permissions are source not stated.",
      useCases: "The product serves tasks where repeatedly checking a phone is costly: two-way translation and navigation while travelling; teleprompting and transcription for presentations, livestreams, or meetings; first-person questions about objects, text, and surroundings while walking, shopping, or repairing something; hands-free photos and 3K-class video for everyday capture; and open-ear notifications, music, and AI answers during commuting. Tom’s Guide’s long-term review highlights the display’s value for navigation, translation, and framing, while the September test treats magnetic prescription lenses and 49g wearability as practical conditions. Full editing, sensitive confirmation, long-term memory management, and high-risk actions should still return to the phone.",
      painPointsSolved: "Rokid addresses the combined friction of constantly pulling out a phone and relying on audio alone. Live subtitles, directions, teleprompting, and camera framing can appear in view, while AI answers do not have to occupy the wearer’s ears exclusively. The 49g ordinary-eyewear form and magnetic prescription solution also lower the barrier to all-day wear. It combines first-person camera input with the visible feedback of display glasses in one device. Reviews do not show that it has solved low-light imaging, iOS background-app dependence, permission work, price, prescription-lens cost, region-specific features, or data-retention questions. Heavy captioning or meeting use also cannot be reduced to the official “8–10 hours of daily use” design claim; actual endurance depends on capture, brightness, connection, and feature mix.",
      userVoice: "Tom’s Guide’s September 2 month-long test puts privacy at the centre of the friction. The Rokid app requires an account holder to be at least 18, and the device collects location and voice content during use. The reviewer notes that the policy does not clearly say whether voice content is used for human review or model training, recommends reading the terms, and notes that users can email the company to request deletion or delete the account. A separate long-term review finds the display, translation, navigation, camera framing, and light wearability useful, while calling out low-light camera performance, iOS connection work, and prescription-lens pricing. These are independent review signals, not population-level satisfaction data.",
      newTech: "Rokid’s technical combination places Micro-LED waveguides, a POV camera, open-ear audio, phone/cloud AI, and optional SDK support inside a near-normal weight and form. Dual-eye display makes subtitles, directions, teleprompting, and framing visible instead of purely audible. Multi-model or multi-service support can reduce dependence on one model, although the exact combination changes by software and region. The consequential product question is whether display and camera share one legible state model: the user should know whether the glasses are showing navigation, capturing, waiting for AI, uploading, or in a low-power mode. The official pages do not disclose full display refresh behaviour, camera stabilisation, model routing, event logs, or SDK APIs, so “SDK supported” cannot be upgraded to a completed open platform.",
      availability: "The global Rokid page currently provides a purchase surface and shows a US$699 promotional price. The Australian official page provides product and prescription-lens information, while Tom’s Guide’s September 2 review places the product in an AU$999 Australian context. Region, discount, inventory, and prescription service can change, so one market’s price cannot be extended globally. The official product page lists SDK support, but does not publish a complete SDK download, eligibility rules, version, developer registration, commercial licence, or third-party app-store workflow. The confirmed fact is a purchasable consumer product with a stated SDK capability; production readiness, region coverage, and long-term service boundaries remain source not stated.",
      limitsOrUnknowns: "Open questions include display readability in bright light, varied backgrounds, and extended use; 12MP camera stability in low light, motion, backlight, and social settings; whether voice, image, and location data are uploaded by default; how server records, phone cache, cloud transcription, and device storage are cleared after account deletion; which functions fail when iOS suspends the background app; actual 210mAh endurance under capture, translation, navigation, brightness changes, and meeting transcription; whether the SDK can control HUD, audio, capture, and notifications; whether all 89 translation languages share the same display and audio path; and the long-term repair cost of IPX4 protection, magnetic inserts, and the frame. The official “8–10 hours” is conditional daily-use guidance, and review evidence of heavy captioning drain must remain visible.",
      productVerdict: "Rokid Glasses are today’s strongest combined confirmed-product and review-friction item. Display, camera, translation, navigation, and lightweight wear now form an actionable daily loop; the HUD is more than a concept demo. The judgment is equally clear: the display reduces phone interruption, but the companion app, cloud data, iOS background behaviour, low-light camera, prescription-lens cost, and regional service decide whether the loop lasts. The next acceptance test should cover offline and app-disconnected behaviour, permission and deletion flows, display state, continuous-capture endurance, low light, and SDK control scope. Until those proofs exist, “open ecosystem” and “all-day” should not be treated as confirmed facts."
    }
  }
}));

const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = issues.find((issue) => issue.date === previousDate);
if (!previous) throw new Error(`missing base issue ${previousDate}`);

const issue = structuredClone(previous);
issue.date = date;
issue.zhPath = `/ai-daily/${date}/zh/`;
issue.enPath = `/ai-daily/${date}/en/`;
issue.sourcesPath = `/ai-daily/${date}/sources.md`;
issue.zhTitle = "AI Daily 2026-09-03：显示型眼镜开始进入日常，连接与数据成本浮出水面";
issue.enTitle = "AI Daily 2026-09-03: Display glasses enter daily life, and the connectivity and data tax surfaces";
issue.zhSummary = "Rokid Glasses 的月度实测把双眼显示、翻译、导航与相机取景推进到日常工作流，也把低光、iOS 后台、价格和语音/位置数据留存摆上台面；MemoMind、Meta、Phantom Beast、Jorjin、Loomos、Monako、RayNeo 与 first-person 研究继续追问眼镜如何保持可恢复的观察链路。";
issue.enSummary = "Rokid Glasses’ month-long test moves dual-eye display, translation, navigation, and camera framing into daily workflows while exposing low-light, iOS background, price, and voice/location-retention friction; MemoMind, Meta, Phantom Beast, Jorjin, Loomos, Monako, RayNeo, and first-person research keep testing whether glasses can maintain a recoverable observation loop.";
issue.sourceTypes = Array.from(new Set([...issue.sourceTypes, "crowdfunding", "Product Hunt", "arXiv", "regional product pages", "developer access", "Rokid Glasses"]));
issue.coverStory = {
  topicId: "rokid-glasses-september-review",
  zhTitle: "Rokid Glasses 把显示放进日常，随后暴露连接与数据成本",
  enTitle: "Rokid Glasses put display into daily life, then expose the connectivity and data tax",
  zhSummary: [
    "Rokid 官方页列出 49g、双眼 Micro-LED、12MP POV、89 语言翻译、Snapdragon AR1、210mAh 与 SDK supported。",
    "Tom’s Guide 9 月 2 日月测验证显示、翻译、相机和轻量佩戴的实际价值，也记录语音/位置数据、隐私政策、价格、低光和 app 依赖。",
    "今日封面判断：显示已形成日常反馈闭环，产品能否长期成立取决于手机依赖、权限、低光失败、数据删除和真实重度续航。"
  ],
  enSummary: [
    "Rokid’s official page lists 49g, dual-eye Micro-LED, a 12MP POV camera, translation for up to 89 languages, Snapdragon AR1, 210mAh, and SDK support.",
    "Tom’s Guide’s September 2 month-long test finds real value in display, translation, camera, and light wear, while recording data, privacy, price, low-light, and app friction.",
    "Cover judgment: display now forms a daily feedback loop; long-term viability depends on phone dependency, permissions, low-light recovery, deletion, and heavy-use endurance."
  ],
  imagePath: rokidVisual.path,
  imageWidth: rokidVisual.width,
  imageHeight: rokidVisual.height,
  imageSourceUrl: rokidOfficialUrl,
  primarySourceUrl: rokidReviewUrl,
  evidenceStrength: "confirmed product · review/community friction · 2026-09-02",
  whyCover: "A month-long review turns display glasses from a feature list into a test of daily feedback, app dependence, privacy, and recovery."
};
issue.topics = [
  ...newTopics,
  ...issue.topics.filter((topic) => !newTopics.some((item) => item.id === topic.id))
];
issue.designDesk = {
  zhTitle: "Design Desk：把显示、连接与数据链路做成可见、可断开、可恢复的状态机",
  enTitle: "Design Desk: make display, connectivity, and data loops visible, interruptible, and recoverable",
  zhIntro: "今天的主线从显示型眼镜的月度实测出发，覆盖销售、协议、眼动、众筹、agent HUD、评测和论文；设计判断落在具体状态。",
  enIntro: "Today starts with a month-long display-glasses test and spans retail, protocols, gaze, crowdfunding, agent HUDs, review friction, and research; the design read belongs in concrete states.",
  zhItems: [
    { label: "Retail state", body: "把配镜、配对、授权、录制灯、镜片更换和售后入口视为同一个 onboarding 状态机。" },
    { label: "View state", body: "XR 眼镜必须明确 Anchor、Wide、3D、Side、透明度和回到现实的动作，沉浸不能隐藏退出。" },
    { label: "Gaze state", body: "眼动选择需要校准质量、目标预览、确认门槛和误触回退；眼睛数据不能成为隐形遥控器。" },
    { label: "Power state", body: "把 standby、capture、AI thinking、upload、low battery、neckband 和 degraded mode 分开标注。" },
    { label: "Agent state", body: "HUD 最少要呈现 queued、running、waiting、approval、failed、done 和 undo，不要把终端日志整面搬到脸上。" },
    { label: "Ownership state", body: "离线、导出、删除、换模型、维修、更新期限和停止服务后的最低可用状态要进入产品规格。" }
  ],
  enItems: [
    { label: "Retail state", body: "Treat fitting, pairing, permission, capture light, lens swap, and service entry as one onboarding state machine." },
    { label: "View state", body: "XR glasses must expose Anchor, Wide, 3D, Side, transparency, and return-to-world actions; immersion cannot hide exit." },
    { label: "Gaze state", body: "Gaze selection needs calibration quality, target preview, confirmation thresholds, and accidental-trigger fallback; eye data cannot become an invisible remote." },
    { label: "Power state", body: "Separate standby, capture, AI thinking, upload, low battery, neckband, and degraded mode in the interface." },
    { label: "Agent state", body: "A HUD should at minimum show queued, running, waiting, approval, failed, done, and undo; do not paste the terminal onto the face." },
    { label: "Ownership state", body: "Offline use, export, deletion, model replacement, repair, update horizon, and minimum post-shutdown behaviour belong in the product spec." }
  ]
};
issue.watchlistZh = [
  "Rokid Glasses：低光、iOS 后台、210mAh 重度续航、语音/位置数据删除和 SDK 控制范围。",
  "MemoMind Developer Access：Bluetooth protocol、reference library、demo code、权限模型和首批第三方体验是否按路线公开。",
  "Meta Glasses 日本：首批真实评测、区域功能、镜片更换、相机状态灯和 8 小时以上续航的独立验证。",
  "Phantom Beast：10 月 29 日发售、实际视图模式、120Hz 发热、Side Mode 和主机 Dock 兼容。",
  "Jorjin J9：眼动校准、SDK 权限、量产/销售条款、处方镜片和无显示配置。",
  "Loomos：众筹交付、实际混合续航、GPT‑4o 数据路径、记忆删除和 app 生命周期。",
  "Monako Glass：US$399 预订是否交付、MonoOS 开放程度、agent 状态反馈和代码/密钥安全。",
  "RayNeo X3 Pro 与 first-person research：245mAh 主动使用、侧载恢复、L0–L5 复现和停止服务后的最低可用状态。"
];
issue.watchlistEn = [
  "Rokid Glasses: low-light performance, iOS background behaviour, heavy-use endurance from 210mAh, voice/location deletion, and SDK control scope.",
  "MemoMind Developer Access: whether the Bluetooth protocol, reference library, demo code, permissions, and first third-party experiences arrive on schedule.",
  "Meta Glasses Japan: independent testing of first reviews, regional features, lens swaps, capture light, and the more-than-eight-hour claim.",
  "Phantom Beast: October 29 delivery, real view modes, 120Hz heat, Side Mode, and console-dock compatibility.",
  "Jorjin J9: gaze calibration, SDK permissions, production and sales terms, prescription fit, and displayless configurations.",
  "Loomos: crowdfunding fulfilment, mixed-use endurance, GPT-4o data path, memory deletion, and app longevity.",
  "Monako Glass: whether the US$399 reservation ships, MonoOS openness, agent-state feedback, and code or secret protection.",
  "RayNeo X3 Pro and first-person research: active runtime from 245mAh, sideload recovery, L0–L5 replication, and post-shutdown minimum capability."
];

const existingIndex = issues.findIndex((item) => item.date === date);
if (existingIndex >= 0) issues[existingIndex] = issue;
else issues.push(issue);
await fs.writeFile(dataPath, `${JSON.stringify(issues, null, 2)}\n`);

await fs.mkdir(issueDir, { recursive: true });
await fs.cp(path.join(root, previousDate, "assets"), path.join(issueDir, "assets"), { recursive: true, force: true });
await fs.cp(path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${previousDate}`, "public", "assets"), path.join(deckDir, "public", "assets"), { recursive: true, force: true });
await fs.cp(path.join(root, date, "assets"), path.join(deckDir, "public", "assets"), { recursive: true, force: true });
await fs.mkdir(path.join(deckDir, "public", "assets"), { recursive: true });

const dossierLabel = { zh: ["产品", "产品是什么", "怎么用", "规格 / 系统栈", "使用场景", "解决痛点", "新技术", "可用性", "限制 / 未知", "产品判断"], en: ["Product", "What it is", "How it works", "Specs / stack", "Use cases", "Pain points", "New tech", "Availability", "Limits / unknowns", "Product read"] };
const dossierFields = ["productName", "productType", "interactionFlow", "specsOrStack", "useCases", "painPointsSolved", "newTech", "availability", "limitsOrUnknowns", "productVerdict"];
const deckTopics = newTopics;
const deckImage = (t) => `./public/${t.visual.path}`;
const textBlock = (locale, t) => {
  const d = t.dossier[locale];
  return dossierFields.map((field, i) => `**${dossierLabel[locale][i]}** — ${d[field]}`).join("\n\n");
};
const sourceLine = (t) => t.sources.map((s) => `[${s.label}](${s.url})`).join(" · ");
const deckSlides = [
  `---\ntheme: default\ntitle: AI Daily ${date}\nlayout: cover\n---\n\n# AI Daily ${date}\n\n${issue.coverStory.zhTitle} / ${issue.coverStory.enTitle}\n\n<img src="${deckImage(newTopics[0])}" style="width:44%;height:56%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${issue.coverStory.evidenceStrength}**\n\n${issue.coverStory.zhSummary.join(" ")}\n\n${sourceLine(newTopics[0])}`,
  `# Issue map\n\n**Cover** — ${issue.coverStory.zhTitle}\n\n**Reported dossiers** — ${deckTopics.map((t) => t.zhHeadline).join("；")}。\n\n**Eight source lanes** — official · reviews · community · wild · research · patent · china · global。\n\n**Design Desk** — ${issue.designDesk.zhTitle}。\n\nThe public publisher carries the complete bilingual, paged 16:9 issue with source/date/evidence labels and PDF downloads.`,
  ...deckTopics.flatMap((t) => [
    `# ${t.zhHeadline}\n\n<img src="${deckImage(t)}" style="width:38%;height:46%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${t.evidenceLabel} · ${t.evidenceStrength} · ${t.sourceDate}**\n\n${textBlock("zh", t)}\n\n**Sources** — ${sourceLine(t)}`,
    `# ${t.enHeadline}\n\n<img src="${deckImage(t)}" style="width:38%;height:46%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${t.evidenceLabel} · ${t.evidenceStrength} · ${t.sourceDate}**\n\n${textBlock("en", t)}\n\n**Sources** — ${sourceLine(t)}`
  ]),
  `# Design Desk / 设计洞察\n\n${issue.designDesk.zhItems.map((item, i) => `${i + 1}. **${item.label}** — ${item.body}`).join("\n\n")}\n\n${issue.designDesk.enItems.map((item, i) => `${i + 1}. **${item.label}** — ${item.body}`).join("\n\n")}`,
  `# Watchlist / 继续观察\n\n${issue.watchlistZh.map((item, i) => `${i + 1}. ${item}`).join("\n")}\n\n${issue.watchlistEn.map((item, i) => `${i + 1}. ${item}`).join("\n")}`,
  `# Source ledger\n\nEight lanes: official · reviews · community · wild · research · patent · china · global.\n\n${Array.from(new Set(issue.topics.flatMap((t) => t.sources.map((s) => s.url)))).slice(0, 28).map((url, i) => `${i + 1}. ${url}`).join("\n")}\n\nVisual evidence uses local source-traceable screenshots with contain positioning and white backgrounds; speculative, community, crowdfunding, research, and patent signals remain explicitly downgraded.`
];
await fs.mkdir(deckDir, { recursive: true });
await fs.writeFile(path.join(deckDir, "package.json"), JSON.stringify({ scripts: { build: "slidev build --base ./ --out dist" }, dependencies: { "@slidev/cli": "^0.50.0", "@slidev/theme-default": "^0.25.0", vue: "^3.4.0" } }, null, 2) + "\n");
await fs.writeFile(path.join(deckDir, "slides.md"), deckSlides.join("\n\n---\n\n") + "\n");
const allSources = Array.from(new Map(issue.topics.flatMap((t) => t.sources).map((s) => [s.url, s])).values());
const laneRows = ["official", "reviews", "community", "wild", "research", "patent", "china", "global"].map((lane) => `| ${lane} | ${issue.topics.some((t) => t.section === lane) ? "covered" : "scan required"} | ${issue.topics.filter((t) => t.section === lane).map((t) => t.id).join(", ") || "source-lane scan"} |`).join("\n");
const visualRows = issue.topics.map((t) => `| ${t.id} | \`${t.visual.path}\` | ${t.visual.sourceUrl} | ${t.evidenceLabel} |`).join("\n");
await fs.writeFile(path.join(deckDir, "sources.md"), `# AI Daily ${date} source ledger\n\n## Source index\n\n${allSources.map((s, i) => `${i + 1}. ${s.label} — ${s.url} — ${s.type || "source not stated"}`).join("\n")}\n\n## Source-lane coverage\n\n| lane | status | topics |\n| --- | --- | --- |\n${laneRows}\n\n## Visual asset index\n\n| topic | asset | source | evidence |\n| --- | --- | --- | --- |\n${visualRows}\n\n## Evidence rules\n\n- Official product pages and announcements support confirmed product and developer surface claims only where stated.\n- Reviews and community pages provide friction and requirements signals, not universal behaviour.\n- Startup, crowdfunding, research, and patent material remains explicitly downgraded.\n- Specs, prices, dates, availability, quotes, and API details use source not stated when the source does not disclose them.\n- Visuals are local source-traceable screenshots or inherited source-backed evidence assets; display uses object-fit: contain, object-position: center, white backgrounds, and no page-internal scrolling.\n- Chinese and English dossier fields carry the same product information units; the English issue is not a compressed summary.\n`);

console.log(JSON.stringify({ date, topics: issue.topics.length, newTopics: newTopics.length, sources: new Set(issue.topics.flatMap((t) => t.sources.map((s) => s.url))).size, visuals: new Set([issue.coverStory.imagePath, ...issue.topics.map((t) => t.visual.path)]).size, deckDir }));
