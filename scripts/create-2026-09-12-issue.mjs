import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const surveyRoot = "/Users/hmi/Documents/Survey";
const date = "2026-09-12";
const previousDate = "2026-09-11";
const dataPath = path.join(root, "data", "issues.json");
const previousDeck = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${previousDate}`);
const deckDir = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${date}`);

const source = (label, url, type) => ({ label, url, type });
const visual = (file, kind, altZh, altEn, captionZh, captionEn, sourceUrl, width = 1600, height = 900) => ({
  path: `assets/${file}`, width, height, kind, altZh, altEn, captionZh, captionEn, sourceUrl
});
const topic = (input) => ({ ...input, dossierKind: input.dossierKind ?? "product" });

const metaDevelopers = "https://developers.meta.com/wearables/";
const metaRepo = "https://github.com/facebook/meta-wearables-dat-ios";
const metaIssue = "https://github.com/facebook/meta-wearables-dat-ios/issues/239";
const metaDiscussion = "https://github.com/facebook/meta-wearables-dat-ios/discussions/226";
const antChina = "https://www.ithome.com/1/001/397.htm";
const iflytekChina = "https://www.ithome.com/1/001/374.htm";
const iflytekReport = "https://static.cninfo.com.cn/finalpage/2026-08-21/1225485550.PDF";
const openaiDaybreak = "https://openai.com/index/expanding-daybreak-as-the-cyber-defense-window-narrows/";
const memomindUrl = "https://www.prnewswire.com/news-releases/memomind-one-opens-developer-access-announces-kiwear-as-first-sdk-partner-302865894.html";
const patentUrl = "https://patents.google.com/patent/US20260087801A1/en";
const researchUrl = "https://arxiv.org/abs/2604.03486";

const metaVisual = visual(
  "meta-ai-glasses-capture-led-2026-08.png",
  "source-backed-developer-screenshot",
  "Meta AI 眼镜开发者能力与相机捕获说明截图",
  "Meta AI glasses developer and camera-capture surface",
  "官方开发者面：相机、音频、显示与移动端 Device Access Toolkit；这是开发者预览，不是完整零售 SDK 承诺。",
  "Official developer surface for camera, audio, display, and the mobile Device Access Toolkit; this is a developer preview, not a complete retail SDK promise.",
  metaDevelopers
);
const iflytekVisual = visual(
  "iflytek-ai-glasses-source-2026-05.png",
  "source-backed-product-image",
  "讯飞 AI 眼镜来源图",
  "iFLYTEK AI Glasses source image",
  "讯飞 AI 眼镜来源图；重量、发布日期与能力以公司半年度报告和中国媒体报道为准，灵影整合能力仍按逐步开放处理。",
  "Source image for iFLYTEK AI Glasses; weight, date, and capability claims follow the company report and China coverage, while Lingying integration is treated as staged rollout.",
  iflytekReport
);
const openaiVisual = visual(
  "codex-micro-openai-official-2026-07.png",
  "source-backed-product-image",
  "OpenAI Codex 官方产品图",
  "OpenAI Codex official product image",
  "OpenAI 官方产品图作为 Daybreak/Codex 控制面视觉锚点；具体 auto-review 行为以官方安全文章为准。",
  "OpenAI product image used as the visual anchor for the Daybreak/Codex control surface; auto-review behavior follows the official safety post.",
  openaiDaybreak
);
const memoVisual = visual(
  "memomind-one-developer-access-2026-09.jpg",
  "source-backed-product-image",
  "MemoMind One Developer Access 来源图",
  "MemoMind One Developer Access source image",
  "MemoMind One 开发者开放路线图来源图；蓝牙协议先行，完整 SDK 和量产扩展仍未全部公开。",
  "Source image for MemoMind One's developer-access roadmap; Bluetooth protocol comes first, while the full SDK and production extension remain incompletely disclosed.",
  memomindUrl
);

const svg = (title, subtitle, blocks, accent = "#8a5a00") => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#f7f5f0"/><rect x="58" y="58" width="1484" height="784" rx="30" fill="#fff" stroke="#e2ddd5" stroke-width="3"/><text x="104" y="138" font-family="Arial,sans-serif" font-size="48" font-weight="700" fill="#171413">${title}</text><text x="106" y="184" font-family="Arial,sans-serif" font-size="24" fill="#6f6a66">${subtitle}</text>${blocks.map((b, i) => { const x = 106 + (i % 3) * 480; const y = 276 + Math.floor(i / 3) * 232; return `<rect x="${x}" y="${y}" width="390" height="162" rx="20" fill="#f8f5ef" stroke="${accent}" stroke-width="3"/><text x="${x + 24}" y="${y + 48}" font-family="Arial,sans-serif" font-size="27" font-weight="700" fill="#171413">${b[0]}</text><text x="${x + 24}" y="${y + 89}" font-family="Arial,sans-serif" font-size="22" fill="#4f4a45">${b[1]}</text><text x="${x + 24}" y="${y + 124}" font-family="Arial,sans-serif" font-size="19" fill="#6f6a66">${b[2]}</text>`; }).join("")}<text x="106" y="790" font-family="Arial,sans-serif" font-size="19" fill="#8c837a">SELF-DRAWN SOURCE-TRACEABLE DIAGRAM · evidence lane is explicit</text></svg>`;

const communityVisual = visual(
  "meta-dat-friction-2026-09.svg",
  "self-drawn-source-traceable-diagram",
  "Meta DAT 社区摩擦自绘图",
  "Self-drawn Meta DAT community-friction diagram",
  "社区/开发者摩擦自绘图：连接、设备发现、权限和视频流故障是待复现问题，不是普遍缺陷结论。",
  "Self-drawn community-friction diagram: connection, device discovery, permission, and video-stream failures are reproduction questions, not universal defect claims.",
  metaIssue
);
const patentVisual = visual(
  "patent-conversational-glasses-watch-2026-09.svg",
  "self-drawn-source-traceable-diagram",
  "智能眼镜对话助手专利观察图",
  "Self-drawn patent watch for conversational smart glasses",
  "专利观察自绘图：Meta 申请涉及眼镜端对话助手；专利只表示法律/技术方向，不代表已出货功能。",
  "Self-drawn patent watch: the Meta application concerns conversational assistance on glasses; a patent signals a legal/technical direction, not a shipped feature.",
  patentUrl
);

const newTopics = [
  topic({
    id: "meta-wearables-device-access-toolkit-live-frame", section: "global", evidenceLabel: "developer surface", sourceDate: "2026-09-12",
    evidenceStrength: "Meta official developer center and public iOS repository; preview status and hardware gating remain explicit",
    zhHeadline: "Meta 把 AI 眼镜开放成输入设备，但第一关仍是稳定拿到一帧",
    enHeadline: "Meta opens AI glasses as an input device, but the first gate is still a stable frame",
    zhFact: "Meta 的 Wearables Developer Center 现把 AI 眼镜的 camera、audio、display、移动端 Device Access Toolkit 与 Web Apps Starter Kit 放在同一开发入口；公开 iOS 仓库仍标注 developer preview，开发者需要 Developer Mode、Meta AI 配对、权限与 release channel。",
    enFact: "Meta's Wearables Developer Center now presents camera, audio, display, the mobile Device Access Toolkit, and a Web Apps Starter Kit as one developer entry point. The public iOS repository still describes the toolkit as a developer preview; developers need Developer Mode, Meta AI pairing, permissions, and a release channel.",
    zhValue: "这不是又一个眼镜宣传页，而是一个能把眼镜传感器接进手机应用的开发者 surface。产品边界从‘助手会不会回答’变成‘第三方 app 能不能在授权后稳定取得视频/照片、处理设备状态、理解断连并把结果反馈给佩戴者’。相机流、设备状态与显示能力一旦可组合，眼镜才从第一方功能变成平台。",
    enValue: "This is not another glasses marketing page; it is a developer surface that can bring wearable sensors into phone applications. The product boundary shifts from whether an assistant can answer to whether a third-party app can reliably obtain video or photos after consent, understand device state and disconnects, and return feedback to the wearer. Once camera, device state, and display can be composed, the glasses become a platform rather than a first-party feature bundle.",
    zhHciLens: ["入口：Developer Center / GitHub", "授权：Developer Mode + Meta AI", "输入：camera / audio / display", "失败：waitingForDevice / stream stop"],
    enHciLens: ["Entry: Developer Center / GitHub", "Consent: Developer Mode + Meta AI", "Input: camera / audio / display", "Failure: waitingForDevice / stream stop"],
    zhImplication: "对开发者而言，连接状态和视频连续性就是核心 UX，不是底层日志。文档应把注册、授权、设备发现、streaming、断线、恢复和隐私指示灯画成一条可观察状态机。",
    enImplication: "For developers, connection state and video continuity are the core UX, not backend logs. Documentation should expose registration, consent, discovery, streaming, disconnect, recovery, and privacy-indicator behavior as one observable state machine.",
    visual: metaVisual,
    sources: [source("Meta Wearables Developer Center", metaDevelopers, "official"), source("Meta Wearables DAT iOS repository", metaRepo, "developer surface"), source("Meta Wearables DAT iOS sample", "https://github.com/facebook/meta-wearables-dat-ios/tree/main/samples/CameraAccess", "official")],
    dossier: { zh: {
      productName: "Meta Wearables Device Access Toolkit + Web Apps Starter Kit（AI 眼镜开发者面，developer surface）",
      productType: "这是 Meta 面向 AI 眼镜开发者的工具组合：移动端通过 Device Access Toolkit 接入眼镜的相机、音频、设备状态和相关能力，Web Apps 路径则让开发者用熟悉的 web 技术创建显示体验。它不是面向普通消费者的新硬件型号，而是把眼镜从第一方 Meta AI 的封闭功能，向可被第三方应用编排的输入、输出和显示设备开放。公开仓库与开发者中心都把它放在 developer preview 语境下，因此不能写成已经开放给所有 App Store 产品的稳定公共 SDK。",
      interactionFlow: "开发者先在 Developer Center 注册组织、项目和 release channel，再在手机上启用 Developer Mode，把眼镜通过 Meta AI 配对并完成相机、麦克风或其他权限授权。应用进入注册状态后发现 eligible device，建立 stream session，读取视频或照片，再将识别结果、声音或显示内容反馈给用户；用户可以在 Meta AI 中撤回连接或关闭开发模式。Web Apps 需要另一条发布与访问路径。真实交互中的关键分支包括设备不在附近、授权未完成、waitingForDevice、连接断开、固件不兼容、画面流不连续和隐私指示状态变化。",
      specsOrStack: "官方公开的栈包括 Wearables Developer Center、iOS/Android Device Access Toolkit、Web Apps Starter Kit、Meta AI companion app、Developer Mode、release channel、camera/audio/display 能力、GitHub sample 与对设备状态的访问。iOS 集成使用 Swift Package Manager，公开 sample 包含 CameraAccess 与 WearablesViewModel。具体 SDK 版本、不同眼镜型号的能力表、Android 与 iOS 的完全对齐、视频编码/分辨率/帧率保证、云端依赖、商业发布资格、价格、SLA 和数据留存政策 source not stated。",
      useCases: "可验证的产品方向包括把第一视角视频送入移动端的视觉助手、在不掏手机的情况下捕获照片、用显示眼镜展示短提示、把眼镜的音频输入接到现场辅助、以及为特定行业创建 hands-free workflow。Meta 的开发者页面还把 Neural Band 的 EMG 手势列为显示体验方向。企业维修、导航、运动教练和无障碍辅助都可以利用这些通道，但每个场景都需要单独验证延迟、噪声、隐私、连续性和人工接管。",
      painPointsSolved: "它减少了从手机摄像头、蓝牙配对、权限桥接和专用硬件协议自建一套 wearable integration 的重复工作，也让开发者无需把所有交互压成语音。相机给应用提供第一视角输入，音频保持免手操作，显示路径可把短反馈放回视野。它没有消除 Meta AI 账户/应用依赖、开发者预览限制、硬件型号差异、配对失败、权限授权绕路或网络/固件造成的流中断。",
      newTech: "新的产品化点是把 wearables 传感器、设备状态、权限与发布通道组合成可迭代的开发者面，并同时提供原生移动路径与 web 路径。公开仓库里的 sample 把 registration、permission、device selection、stream session 和 decoder 组织成可学习的状态链；开发者中心再把相机、音频、显示、组织管理和社区放在一个入口。它是平台化和工具化创新，不代表 Meta 已公开全部系统接口。",
      availability: "Meta 官方开发者中心公开了文档、GitHub 下载路径、Developer Center 注册和社区入口；公开 iOS 仓库可读，工具仍是 developer preview。能否注册、获得测试设备、创建 release channel、使用某个显示或相机能力取决于账号、地区、固件、硬件型号和当前审核。消费端眼镜的销售可用性不能直接推导出第三方开发者发布资格。",
      limitsOrUnknowns: "当前未确认的关键项包括：每个硬件代际的能力矩阵、生产环境可用的 SDK 版本、显示眼镜与无显示眼镜的差异、视频流在噪声和高分辨率下的持续性、设备掉线后的自动恢复、权限撤回是否立即终止流、第三方 app 的上架限制、web app 能否获得同等相机能力、日志和视频是否离开手机、以及用户与旁观者如何理解录制状态。GitHub issue 和讨论提供的是复现线索，不是总体失败率。",
      productVerdict: "Meta 的真实产品进展在开发者入口，不在一句‘AI glasses’口号：它开始给第三方 app 一条从注册、授权到读取传感器的路径。产品判断是 developer surface 已成立，平台可靠性尚未成立；下一验收门应是同一设备在授权、断连、恢复、隐私提示和连续解码上的可重复测试。"
    }, en: {
      productName: "Meta Wearables Device Access Toolkit + Web Apps Starter Kit, an AI-glasses developer surface",
      productType: "This is Meta's developer tool combination for AI glasses. The mobile Device Access Toolkit exposes camera, audio, device state, and related capabilities to phone applications, while the Web Apps path lets developers create display experiences with familiar web technology. It is not a new consumer hardware model. It is the layer that moves glasses from a first-party Meta AI feature bundle toward a third-party-composable input, output, and display device. Both the public repository and developer center place it in a developer-preview context, so it should not be described as a stable public SDK available to every App Store product.",
      interactionFlow: "A developer registers an organization, project, and release channel in the Developer Center, enables Developer Mode on the phone, pairs glasses through the Meta AI app, and grants camera, microphone, or other permissions. The application reaches a registered state, discovers an eligible device, starts a stream session, reads video or photos, and returns recognition, audio, or display feedback. The user can revoke the connection or turn off Developer Mode in Meta AI. Web Apps use a separate access and publishing path. The important branches are a device out of range, incomplete consent, waitingForDevice, disconnects, firmware mismatch, discontinuous frames, and changes in the privacy indicator.",
      specsOrStack: "The public stack includes the Wearables Developer Center, iOS and Android Device Access Toolkit, the Web Apps Starter Kit, the Meta AI companion app, Developer Mode, release channels, camera, audio, and display capabilities, GitHub samples, and device-state access. The iOS integration uses Swift Package Manager; the public sample includes CameraAccess and WearablesViewModel. Exact SDK versions, a complete per-glasses capability matrix, iOS/Android parity, guaranteed video codec, resolution or frame rate, cloud dependence, commercial-release eligibility, pricing, SLA, and retention policy are source not stated.",
      useCases: "Supported product directions include feeding first-person video into a mobile visual assistant, capturing photos without reaching for a phone, showing short prompts on display glasses, routing audio input into an in-situ assistant, and creating hands-free workflows for a specific industry. Meta also presents EMG-based Neural Band gestures as a display-experience direction. Enterprise repair, navigation, sports coaching, and accessibility could use these channels, but each scenario needs its own validation for latency, noise, privacy, continuity, and human takeover.",
      painPointsSolved: "The toolkit reduces the repeated work of building a wearable integration around a phone camera, Bluetooth pairing, permission bridges, and proprietary device protocols. Camera provides first-person input, audio preserves hands-free use, and display can return short feedback into view. It does not remove Meta AI account and companion-app dependency, preview restrictions, hardware differences, pairing failure, permission detours, or stream interruptions caused by network and firmware.",
      newTech: "The productised idea is combining wearable signals, device state, permissions, and release channels into an iterative developer surface while offering both native mobile and web paths. The repository samples make registration, permission, device selection, stream sessions, and decoding into a learnable state chain; the developer center adds cameras, audio, display, organisation controls, and community in one entry point. This is a platform and tooling advance, not evidence that Meta has exposed every system interface.",
      availability: "Meta's official developer center exposes documentation, GitHub download paths, Developer Center registration, and community entry points; the public iOS repository is readable and the toolkit remains a developer preview. Registration, test-device access, release-channel creation, and individual display or camera capabilities depend on account, region, firmware, hardware model, and current review. Consumer retail availability cannot be used to infer third-party publishing eligibility.",
      limitsOrUnknowns: "Important unknowns include the capability matrix for each hardware generation, a production-ready SDK version, differences between display and non-display glasses, continuous streaming under noise and high-resolution settings, automatic recovery after disconnect, whether revoking permission immediately terminates a stream, third-party app-store limits, whether web apps can access the same camera capabilities, whether logs or video leave the phone, and how wearers and bystanders understand capture state. GitHub issues and discussions are reproduction leads, not population-level failure rates.",
      productVerdict: "Meta's real product progress is the developer entry point, not the phrase AI glasses: it now offers a path from registration and consent to sensor access for third-party apps. Verdict: the developer surface is real, but platform reliability is not yet proven. The next acceptance gate is repeatable testing of consent, disconnect, recovery, privacy indication, and continuous decoding on the same device."
    }}
  }),
  topic({
    id: "iflytek-lingying-ai-glasses-action-layer", section: "china", evidenceLabel: "confirmed product", sourceDate: "2026-09-11",
    evidenceStrength: "iFLYTEK company report plus China media coverage; Lingying service rollout is described as staged and not independently hands-on verified",
    zhHeadline: "讯飞 AI 眼镜接入灵影：眼镜从回答问题走向执行生活动作",
    enHeadline: "iFLYTEK AI Glasses join Lingying: from answering to acting on daily tasks",
    zhFact: "9 月 11 日中国媒体报道，讯飞 AI 眼镜接入蚂蚁灵影 AOS；公开描述的方向包括停车缴费、扫码支付、点咖啡和城市漫游等本地生活动作。讯飞半年度报告同时披露 AI 眼镜 40g、2026 年 5 月 28 日发布、6 月 15 日预售，以及翻译、唇动识别多模态降噪和 GlassClaw 等能力。",
    enFact: "China coverage on September 11 reported that iFLYTEK AI Glasses were connected to Ant's Lingying AOS, with described directions including parking payment, QR payment, coffee ordering, and city roaming. iFLYTEK's interim report discloses a 40g AI glasses product released on May 28, 2026, pre-sale from June 15, with translation, lip-motion multimodal noise reduction, and GlassClaw capabilities.",
    zhValue: "产品变化不在于又加了一个聊天入口，而是把眼镜的语音/视觉上下文接到身份、安全、支付和本地服务。用户说出需求，系统在授权范围内调用轻应用和服务，理想流程是‘表达意图→确认金额/目的地→执行→回报结果’，而不是把手机上的每个小应用原样搬到镜片上。",
    enValue: "The change is not another chat entry. It connects the glasses' voice and visual context to identity, security, payment, and local services. The intended flow is to express intent, confirm amount or destination, execute, and report the result within an authorised scope, rather than copying every phone app into the lens.",
    zhHciLens: ["入口：语音 / 多模态", "理解：翻译 + GlassClaw", "执行：灵影轻应用", "回报：结果 / 授权 / 风险"],
    enHciLens: ["Entry: voice / multimodal", "Understand: translation + GlassClaw", "Act: Lingying lightweight apps", "Return: result / consent / risk"],
    zhImplication: "无屏或小屏设备要执行支付和服务动作，确认、撤销、身份绑定和旁观者可理解性必须先于‘开口即办’的宣传。每一次外部写入都应让用户知道对象、金额、时限和失败后的回退。",
    enImplication: "When a screenless or small-screen device can execute payment and service actions, confirmation, undo, identity binding, and bystander legibility must come before the promise of voice-first convenience. Every external write should reveal target, amount, time limit, and fallback after failure.",
    visual: iflytekVisual,
    sources: [source("iFLYTEK 2026 interim report", iflytekReport, "official"), source("IT之家: iFLYTEK AI Glasses + Lingying", iflytekChina, "china"), source("IT之家: Ant Lingying open ecosystem", antChina, "china")],
    dossier: { zh: {
      productName: "讯飞 AI 眼镜 + 蚂蚁灵影 AOS 生态接入（中国智能眼镜服务系统，confirmed product / staged integration）",
      productType: "讯飞 AI 眼镜是已经发布并进入预售的轻量化 AI 眼镜，核心能力围绕语音交互、视觉理解、跨语言翻译、商务辅助和 GlassClaw 服务体系。9 月 11 日的中国媒体报道把它与蚂蚁灵影 AOS 连接起来，灵影被描述为面向 AI 眼镜等新终端的 Agent 原生操作系统及开放平台，提供自然交互、智能体运行、多端协同、安全可信、流程编排、界面组件、硬件插件和应用发布。公开材料表达的是生态接入与即将陆续开放，不等于所有支付和本地生活动作已经对每位用户上线。",
      interactionFlow: "用户戴上眼镜，通过语音和眼镜感知表达停车、支付、点单或城市漫游意图；GlassClaw 和端云服务理解上下文，灵影轻应用负责把意图映射到对应服务。涉及支付、订单、位置或身份的动作应在执行前展示或播报目标与关键参数，用户授权后再写入外部服务，完成后通过语音、提示或手机伴侣返回结果。当前公开报道没有给出完整确认 UI、撤销时间、失败重试、多人场景、旁观者提示或跨服务账户切换的具体交互，因此这些部分只能作为产品验收问题。",
      specsOrStack: "讯飞半年度报告披露整机约 40g，依托自研同传技术、多语言大模型、AI 视觉、智能语音翻译、唇动识别多模态降噪和 GlassClaw，产品于 2026 年 5 月 28 日在澳门 BEYOND Expo 发布，6 月 15 日预售。灵影公开材料披露 Agent 原生 AOS、可信连接、自然交互、智能体运行、多端协同、安全可信、流程编排、界面组件、硬件插件和应用发布。芯片、摄像头/麦克风具体规格、操作系统版本、API schema、支付 token 绑定、离线行为、数据驻留、服务价格和覆盖地区 source not stated。",
      useCases: "已公开的产品场景包括跨境商务沟通、实时交流同步、翻译、商务智能辅助、视觉内容抓取、文档生成和复杂噪声环境下的人声识别。灵影接入报道进一步提出停车缴费、扫码支付、点咖啡、城市漫游等生活动作。对用户来说，这把眼镜从‘听懂并回答’扩展到‘理解意图并调用服务’，适合双手被占用、正在步行或不希望频繁掏手机的场景；高风险付款、出行和位置动作仍需要可读确认和手机接管。",
      painPointsSolved: "讯飞眼镜试图降低跨语言沟通、多人嘈杂环境、商务记录和随身内容捕获的负担；灵影接入则瞄准手机操作链条过长、小屏设备输入困难和本地服务入口分散的问题。它可能让轻量任务更接近一次自然表达，但没有自动解决账号体系、支付安全、误识别、服务不可用、网络延迟、地区限制、售后和用户不愿在公共场所说出敏感意图的问题。",
      newTech: "新技术/系统点在于把语音、视觉、翻译、唇动识别降噪与一个可调用本地服务的 Agent 原生接入层组合起来，并强调‘轻应用、一次开发、多端分发、即用即走’。这会把眼镜应用从驻留式 app 目录转向按场景被唤起的服务能力。公开材料还提到与中国信通院泰尔终端实验室推进评测实验室和安全标准，但具体测试指标、授权模型和可审计接口尚未公开。",
      availability: "讯飞 AI 眼镜已有发布与预售事实，官方报告称其在多个电商平台首发当日取得智能眼镜品类销售额榜首；灵影与讯飞的接入由 9 月 11 日中国媒体报道确认，但公开报道把停车、支付、点单和漫游描述为‘即将陆续开放’。具体用户地区、服务城市、支付账户资格、硬件固件要求、正式上线时间、价格/订阅和售后路径 source not stated，应以实际设备和官方服务入口为准。",
      limitsOrUnknowns: "最重要的未知项是外部动作的授权与撤销：支付确认是否需要手机、是否支持金额/收款方口头复述、误触发如何赔付、断网或服务超时如何回退、家庭成员如何接管、位置和语音如何删除、不同城市服务是否一致。公司报告与媒体报道可以证明产品和生态方向，不能证明跨城市成功率、翻译准确率、端到端延迟、续航、长期佩戴舒适性或第三方服务覆盖。",
      productVerdict: "讯飞 AI 眼镜是确认存在的中国产品，灵影接入是一个明确的生态方向：AI 眼镜开始获得身份、支付和本地服务的行动层。产品判断是方向成立但‘可执行’仍处在分阶段开放期；下一步应优先验证每个高风险动作的确认、撤销、审计与接管，而不是只展示一次成功的语音演示。"
    }, en: {
      productName: "iFLYTEK AI Glasses + Ant Lingying AOS integration, a China smart-glasses service system",
      productType: "iFLYTEK AI Glasses are a released and pre-sale lightweight AI-glasses product centred on voice interaction, visual understanding, cross-language translation, business assistance, and the GlassClaw service system. China coverage on September 11 connected the glasses to Ant's Lingying AOS. Lingying is described as an Agent-native operating system and open platform for AI glasses and other terminals, with natural interaction, Agent runtime, multi-device coordination, trusted security, workflow orchestration, UI components, hardware plugins, and app publishing. The public material describes an ecosystem connection and staged opening; it does not mean every payment and local-service action is live for every user.",
      interactionFlow: "A wearer speaks a parking, payment, ordering, or city-walk intent. GlassClaw and cloud-edge services interpret the context, while Lingying lightweight apps map the intent to a service. For payment, ordering, location, or identity actions, the safe flow should expose or speak back the target and critical parameters, obtain consent, write to the external service, and return a result through audio, a prompt, or the companion phone. The public coverage does not specify the complete confirmation UI, undo window, retry behavior, multi-person flow, bystander cue, or account switching, so these remain acceptance questions rather than confirmed interaction details.",
      specsOrStack: "The iFLYTEK interim report discloses a roughly 40g product, self-developed simultaneous interpretation, multilingual models, AI vision, intelligent speech translation, lip-motion multimodal noise reduction, and GlassClaw. It was introduced at the BEYOND Expo in Macau on May 28, 2026, with pre-sale from June 15. Lingying material discloses an Agent-native AOS, trusted connection, natural interaction, Agent runtime, multi-device coordination, trusted security, workflow orchestration, UI components, hardware plugins, and app publishing. Chip, camera and microphone specifications, OS version, API schema, payment-token binding, offline behavior, residency, service pricing, and regional coverage are source not stated.",
      useCases: "The product materials cover cross-border business communication, real-time exchange, translation, business assistance, visual capture, document generation, and speech isolation in noisy multi-person environments. The Lingying integration coverage adds parking payment, QR payment, coffee ordering, and city roaming. For users, this expands the glasses from understanding and answering to interpreting intent and calling a service, especially when hands are occupied or a phone is inconvenient. High-consequence payment, navigation, and location actions still need readable confirmation and phone takeover.",
      painPointsSolved: "iFLYTEK targets the burden of cross-language communication, noisy conversations, business capture, and mobile note work; Lingying targets long phone interaction chains, difficult small-screen input, and fragmented local-service entry points. The combination could make a lightweight task feel like one natural utterance. It does not automatically solve account architecture, payment security, recognition error, service outages, network latency, regional coverage, support, or the social discomfort of speaking a sensitive intent in public.",
      newTech: "The system-level novelty is combining voice, vision, translation, lip-motion noise reduction, and an Agent-native connection layer that can call local services. The stated direction is lightweight, on-demand applications: one build, multiple terminals, and a service invoked by context rather than a resident app icon. The companies also mention an evaluation lab and safety-standard work with the China Academy of Information and Communications Technology's terminal laboratory, but test metrics, consent model, and audit interfaces are not public.",
      availability: "iFLYTEK AI Glasses have a confirmed release and pre-sale record; the company report says the product ranked first by sales value in the smart-glasses category on several Chinese e-commerce platforms on its launch day. The Lingying connection is confirmed by September 11 China coverage, while parking, payment, ordering, and roaming are described as rolling out. User region, service city, payment eligibility, firmware requirement, launch date, pricing or subscription, and support path are source not stated and must be checked at the live product entry point.",
      limitsOrUnknowns: "The central unknown is authorisation and revocation for external actions: whether a payment needs the phone, whether amount and payee are read back, how mistaken actions are compensated, how a timeout falls back, how family members take over, how voice and location are deleted, and whether city services behave consistently. A company report and media coverage establish product and ecosystem direction; they do not establish cross-city success, translation accuracy, end-to-end latency, battery, all-day comfort, or third-party service coverage.",
      productVerdict: "iFLYTEK AI Glasses are a confirmed Chinese product, and Lingying is a clear ecosystem direction: AI glasses are gaining an action layer for identity, payment, and local services. Verdict: the direction is real but execution remains staged. The next test should prioritise confirmation, undo, audit, and takeover for every high-consequence action rather than a single successful voice demo."
    }}
  }),
  topic({
    id: "openai-daybreak-codex-auto-review", section: "official", evidenceLabel: "confirmed product", sourceDate: "2026-08-06",
    evidenceStrength: "OpenAI official safety/product post; access is restricted to approved Daybreak customers and not a general Codex setting",
    zhHeadline: "Codex 的 auto-review 把高权限动作变成可审查的停顿点",
    enHeadline: "Codex auto-review turns high-permission actions into reviewable pauses",
    zhFact: "OpenAI 在 Daybreak 安全文章中建议使用 Codex 的客户从 full-access mode 切换到 auto-review mode；auto-review 会在执行需要提升权限的动作前评估，并可能阻止具有显著破坏性的请求。文章还要求 Daybreak 个人账户从 9 月 1 日起使用硬件安全密钥。",
    enFact: "In its Daybreak security post, OpenAI recommends that Codex customers switch from full-access mode to auto-review mode. Auto-review evaluates actions that require elevated permissions before execution and may block requests that pose significant destructive risk. The post also requires hardware security keys for individual Daybreak accounts from September 1.",
    zhValue: "这把‘安全’从后台 policy 变成 agent 工作流中的一个可见分支：模型可以继续规划，但外部写入、提权或破坏性动作需要回到审查点。对产品来说，关键不是多一个开关，而是用户能看到 agent 想做什么、为什么需要权限、系统阻止了什么、批准之后的结果和如何恢复。",
    enValue: "This turns safety from a backend policy into a visible branch in an Agent workflow: the model can keep planning, but an external write, privilege escalation, or destructive action returns to a review point. The product question is not another toggle; it is whether people can see what the Agent wants to do, why permission is needed, what was blocked, what happened after approval, and how to recover.",
    zhHciLens: ["运行：full-access / auto-review", "触发：提权或破坏性动作", "反馈：评估 / 阻断", "人控：批准 / 回退 / 监控"],
    enHciLens: ["Mode: full-access / auto-review", "Trigger: elevated or destructive action", "Feedback: evaluate / block", "Human control: approve / recover / monitor"],
    zhImplication: "高权限 agent 的 UX 要把‘模型判断’与‘系统授权’拆开，让人类批准成为一个带对象、范围、理由和结果的操作，而不是模糊的继续按钮。",
    enImplication: "High-permission Agent UX should separate model judgement from system authorisation. Human approval needs an object, scope, reason, and outcome, not an ambiguous Continue button.",
    visual: openaiVisual,
    sources: [source("OpenAI: Expanding Daybreak", openaiDaybreak, "official"), source("OpenAI: Agents API", "https://openai.com/index/introducing-the-agents-api/", "official"), source("OpenAI: misalignment incident disclosure", "https://openai.com/hugging-face-incident-and-misalignment/", "official")],
    dossier: { zh: {
      productName: "OpenAI Codex auto-review / Daybreak control path（高风险 Agent 审查能力，confirmed product）",
      productType: "auto-review 是 OpenAI 为 Daybreak 网络安全客户提出的 Codex 使用模式：在 full-access mode 之外，用一个更严格的执行路径评估需要提升权限的动作，必要时阻止高风险或显著破坏性的请求。它与硬件安全密钥、身份验证、授权使用限制和 action monitoring 共同组成一个面向高权限 agent 的控制面。它不是面向所有 ChatGPT 或普通 Codex 用户的默认功能，也不是一个独立销售的模型。",
      interactionFlow: "用户或团队先获得 Daybreak 访问资格，使用 Codex 规划与执行任务；当任务需要 elevated permission 或可能造成破坏性结果时，auto-review 对动作做额外评估。系统可以让安全审查继续、要求人批准、阻止请求或记录监控信息；用户随后需要检查目标、权限和预期结果，再决定是否继续。官方文章没有公开完整的批准卡片、拒绝原因 schema、回滚面板、事件日志导出、分级风险阈值或多人的审批链，因此公开可确认的是策略方向与模式选择，不是完整 UI 细节。",
      specsOrStack: "官方披露的栈包括 Codex、full-access mode、auto-review mode、elevated-permission action evaluation、对显著破坏性行为的阻断、Approved individuals/organizations、identity verification、account security、monitoring、approved-use restrictions、legal attestations，以及 2026 年 9 月 1 日起个人 Daybreak 账户的 hardware security keys。模型、策略引擎、风险阈值、日志 schema、密钥硬件型号、组织管理员 API、保留期限、价格和 SLA source not stated。",
      useCases: "具体场景是授权网络安全工作中的代码、脚本、配置和工具操作：agent 可以分析环境、提出修复或执行步骤，但涉及高权限、删除、写入、外部网络或潜在破坏性行为时，控制面需要插入 review。它也适合把生产部署、凭据使用、批量修改或安全响应拆成计划—审查—执行—验证的链条。文章没有证明 auto-review 在一般软件开发、普通 Codex 账户或所有工具上都可用。",
      painPointsSolved: "它针对 full-access agent 难以让安全团队放心的两个问题：动作可能越过预期边界，且人类很难在 agent 连续执行时判断何时应该接管。auto-review 通过模式切换与提权动作评估制造停顿点，硬件密钥降低账户被盗的风险，monitoring 保留行为可见性。它没有解决误判、审批疲劳、提示注入、错误回滚、密钥丢失、策略冲突或安全人员无法理解模型计划的问题。",
      newTech: "新的产品机制是把 Agent 的权限提升视为一个显式事件，而不是把所有工具调用放进同一自动执行带。它将身份、硬件密钥、模型运行、工具动作和人工审查组合成一条安全工作流。这个组合比单纯的内容过滤更接近执行层治理，但官方没有公开它的独立评测、误阻率、漏阻率或跨工具一致性。",
      availability: "Daybreak Blue/Red 面向经过批准的个人与组织，依赖身份验证、监控、授权使用限制和法律声明。OpenAI 强烈建议客户使用 auto-review，并要求个人账户使用硬件安全密钥；这不等于普通用户可以在 Codex 设置中直接打开同一功能。地区、价格、设备要求、企业租户配置、支持模型和完整管理员入口 source not stated。",
      limitsOrUnknowns: "未知项包括：什么动作算 elevated、什么条件触发阻断、审查是模型还是规则还是人工混合、批准是否绑定精确 payload、批准后计划改变如何重新审查、阻断是否可申诉、被阻断的任务如何恢复、是否支持分段批准、凭据是否进入模型上下文、日志是否可以独立导出，以及硬件密钥丢失后的恢复。文章是安全产品说明，不是可迁移到所有 agent 的性能基准。",
      productVerdict: "auto-review 是一个真实的高风险 Agent 控制面方向，把提权动作变成可审查的状态转移。产品判断：它比一个‘允许/拒绝’总开关更接近可用的 agent UX，但必须补齐动作预览、payload 绑定、解释、回滚和审计，才能把安全建议变成可依赖的生产界面。"
    }, en: {
      productName: "OpenAI Codex auto-review / Daybreak control path, a high-risk Agent review capability",
      productType: "Auto-review is the stricter Codex execution path described for OpenAI's Daybreak cybersecurity customers. Alongside full-access mode, it evaluates actions that require elevated permissions and may block requests with significant destructive risk. Together with hardware security keys, identity verification, approved-use restrictions, legal attestations, and action monitoring, it forms a control surface for high-privilege Agents. It is not a standalone model or a default setting for every ChatGPT or Codex user.",
      interactionFlow: "An approved user or team runs Codex to plan and execute a task. When the plan needs elevated permission or could produce destructive consequences, auto-review performs an additional evaluation. The system can let security review continue, require a human decision, block the request, or record monitoring information; the user then checks target, permission, and expected outcome before continuing. The official post does not expose a complete approval card, rejection-reason schema, rollback panel, exportable event log, risk-tier threshold, or multi-person approval chain. What is confirmed is the policy direction and operating mode, not the full UI contract.",
      specsOrStack: "The disclosed stack includes Codex, full-access mode, auto-review mode, evaluation of elevated-permission actions, blocking of requests that pose significant destructive risk, approved individuals and organisations, identity verification, account security, monitoring, approved-use restrictions, legal attestations, and hardware security keys for individual Daybreak accounts from September 1, 2026. Model, policy engine, risk threshold, log schema, key hardware, admin API, retention, price, and SLA are source not stated.",
      useCases: "The concrete setting is authorised cybersecurity work involving code, scripts, configuration, and tool operations. An Agent can inspect an environment, propose a remediation, or execute a step, but high-privilege, deletion, write, external-network, or potentially destructive actions need a review boundary. The same pattern could structure production deployment, credential use, batch changes, or incident response as plan, review, execution, and verification. The post does not establish that auto-review is available to ordinary software development, every Codex account, or every tool.",
      painPointsSolved: "It addresses two problems that make full-access Agents difficult for security teams to trust: actions can cross an intended boundary, and people cannot easily tell when to take over during continuous execution. Auto-review creates a pause through mode selection and elevated-action evaluation; hardware keys reduce account-compromise risk; monitoring preserves behavioural visibility. It does not solve false positives, approval fatigue, prompt injection, rollback, lost keys, policy conflicts, or a plan that reviewers cannot understand.",
      newTech: "The product mechanism is treating privilege elevation as an explicit Agent event rather than placing every tool call in one automatic lane. Identity, hardware keys, model execution, tool actions, and human review form one security workflow. That is closer to execution-layer governance than content filtering, but OpenAI has not published independent evaluations, block rates, false-allow rates, or cross-tool consistency.",
      availability: "Daybreak Blue and Red are for approved individuals and organisations and depend on identity verification, monitoring, approved-use restrictions, and legal attestations. OpenAI strongly encourages customers to use auto-review and requires hardware security keys for individual accounts; this does not mean any ordinary user can toggle on the same capability in Codex. Region, price, hardware requirements, tenant configuration, model support, and the complete admin surface are source not stated.",
      limitsOrUnknowns: "Unknowns include what qualifies as elevated, what triggers a block, whether review is model-based, rule-based, or human-assisted, whether approval binds to an exact payload, how plan changes are re-reviewed, whether a block can be appealed, how a blocked task resumes, whether staged approval exists, whether credentials enter model context, whether logs can be independently exported, and how a lost hardware key is recovered. The post is a safety-product description, not a benchmark transferable to every Agent.",
      productVerdict: "Auto-review is a real high-risk Agent control direction that turns privilege elevation into a reviewable state transition. Verdict: it is closer to usable Agent UX than a single allow/deny switch, but it needs action preview, payload binding, explanation, rollback, and audit to become a dependable production interface."
    }}
  }),
  topic({
    id: "memomind-one-bluetooth-developer-access", section: "wild", evidenceLabel: "developer surface", sourceDate: "2026-09-01",
    evidenceStrength: "company/PR Newswire developer-access announcement; full SDK, pricing, and general availability remain undisclosed",
    zhHeadline: "MemoMind One 先开放蓝牙协议：记忆眼镜从封闭设备试探 SDK 入口",
    enHeadline: "MemoMind One opens its Bluetooth protocol first, probing an SDK path for memory glasses",
    zhFact: "MemoMind One 在 9 月路线图中开启 Developer Access，第一阶段计划公开蓝牙通信协议，并宣布 KiWear 为首个 SDK 生态伙伴；完整 SDK 仍在后续路线图中。",
    enFact: "MemoMind One opened Developer Access in its September roadmap, with the first phase publishing a Bluetooth communication protocol and naming KiWear as its first SDK ecosystem partner. The full SDK remains on a later roadmap.",
    zhValue: "这类记忆眼镜的关键不是能否录音，而是第三方能否安全地读取、检索、标注和删除由眼镜产生的时间线资产。蓝牙协议是一个较低层的入口，能帮助伙伴做配件、控制器或场景应用，但不能自动证明已有完整的事件模型、隐私设置、数据导出和跨设备同步。",
    enValue: "For memory glasses, the key question is not whether audio can be recorded, but whether third parties can safely read, retrieve, annotate, and delete the timeline assets produced by the glasses. A Bluetooth protocol is a lower-level entry point that can support partners, accessories, controllers, or scenario apps; it does not prove that a full event model, privacy settings, export, or cross-device sync already exists.",
    zhHciLens: ["入口：Bluetooth protocol", "伙伴：KiWear SDK", "资产：记忆时间线", "缺口：权限 / 删除 / 导出"],
    enHciLens: ["Entry: Bluetooth protocol", "Partner: KiWear SDK", "Asset: memory timeline", "Gap: permission / delete / export"],
    zhImplication: "记忆设备的开发者接口必须把‘捕获’和‘可被第三方使用’分开，并把旁观者、敏感地点、多人同意、局部删除和事件级撤回做成 API 级能力。",
    enImplication: "A memory-device developer interface must separate capture from third-party use and make bystanders, sensitive places, multi-party consent, partial deletion, and event-level revocation API-level capabilities.",
    visual: memoVisual,
    sources: [source("MemoMind One Developer Access announcement", memomindUrl, "official"), source("MemoMind official site", "https://memomind.com/", "wild"), source("KiWear", "https://kiwear.com/", "wild")],
    dossier: { zh: {
      productName: "MemoMind One Developer Access（记忆眼镜开发者开放路线图，developer surface）",
      productType: "MemoMind One 是由 XGIMI 孵化的 AI 硬件品牌产品，公开路线图把它定位为围绕个人记忆和日常记录的智能眼镜。9 月 1 日公告开启 Developer Access，并将蓝牙通信协议作为第一阶段开放内容，KiWear 被列为首个 SDK 生态伙伴。它当前更准确的身份是硬件与生态开放计划，而不是完整、公开、稳定的通用 SDK。",
      interactionFlow: "已披露的交互是开发者进入开放计划，获取或使用蓝牙通信协议，让伙伴设备或应用与 MemoMind One 建立连接；后续可能围绕控制、数据读取或新场景做扩展，但官方公告没有给出完整的配对、权限、事件检索、同步、删除或第三方发布流程。对用户而言，记忆眼镜的安全交互应包含开始/停止捕获、旁观者提示、敏感区域处理、单条事件删除、导出和跨设备注销；这些都不能从‘开放蓝牙协议’推断已实现。",
      specsOrStack: "公告明确提到 Developer Access、第一阶段 Bluetooth communication protocol、KiWear SDK ecosystem partner 和后续 full SDK roadmap。没有公开完整协议版本、GATT/消息 schema、加密与密钥管理、音视频格式、时间戳模型、手机/云端分工、数据保留、API 认证、第三方审核、硬件型号覆盖或 SDK 价格。",
      useCases: "可合理观察的伙伴方向包括把眼镜作为随身记录器接到手机应用、做记忆时间线检索、把特定事件送入个人知识工具、开发辅助控制器或为某类垂直场景提供实时记录。公告没有给出已交付的具体第三方应用，因此这些是开发方向，不应写成现有用户可购买的功能。",
      painPointsSolved: "开放蓝牙协议可以减少伙伴面对完全封闭硬件时的逆向和连接成本，让产品有机会从‘品牌自己的记录体验’走向可扩展的记忆设备平台。它还可能降低配件、同步和场景集成的试错门槛。它没有解决记忆数据对旁观者的影响、敏感内容误收录、事件级删除、跨端复制、账号恢复或第三方滥用。",
      newTech: "技术方向是先开放连接层，再逐步开放更高层 SDK：这允许硬件合作伙伴在协议稳定前开始探索，而把完整的任务、记忆和应用语义留到后续。对记忆设备来说，真正的技术门槛并非 BLE 能否连上，而是如何定义事件、来源、时间、参与者、权限、删除和模型检索的可审计边界；这些目前 source not stated。",
      availability: "Developer Access 公告已公开，首个伙伴为 KiWear，第一阶段从 2026 年 9 月开始发布蓝牙协议。完整 SDK、开放申请、硬件购买、价格、地区、发货、开发者资格、API 限制和一般用户使用范围 source not stated。该产品应保持 developer surface 标签，不升级为已开放的成熟平台。",
      limitsOrUnknowns: "需要补证的项目包括协议文档、配对与认证、手机断连行为、缓存、上传与删除、旁观者同意、端侧/云端处理、检索是否默认全量、第三方是否能下载原始媒体、撤销是否可追溯、伙伴审核和数据驻留。没有这些信息，‘开放生态’只能说明方向，不能说明可安全规模化。",
      productVerdict: "MemoMind One 的开发者开放是一个值得追踪的生态信号：它把连接层先交给伙伴，但还没有把记忆资产的完整权限模型交代清楚。产品判断是路线图成立、平台能力未证实；下一步应看协议文档和删除/同意 API，而不是只看伙伴名单。"
    }, en: {
      productName: "MemoMind One Developer Access, a developer-access roadmap for memory glasses",
      productType: "MemoMind One is an AI hardware product incubated by XGIMI and positioned around personal memory and daily capture. Its September 1 announcement opened Developer Access, publishing a Bluetooth communication protocol in phase one and naming KiWear as the first SDK ecosystem partner. Its current status is better described as a hardware and ecosystem-access programme than a complete, public, stable general-purpose SDK.",
      interactionFlow: "The disclosed interaction is that a developer enters the access programme and uses the Bluetooth communication protocol to connect a partner device or application to MemoMind One. Future work may cover control, data access, or new scenarios, but the announcement does not provide a complete pairing, permission, event retrieval, sync, deletion, or third-party publishing flow. A safe memory-glasses experience would need start/stop capture, bystander cues, sensitive-place handling, item-level deletion, export, and cross-device sign-out; none can be inferred from opening Bluetooth alone.",
      specsOrStack: "The announcement names Developer Access, a phase-one Bluetooth communication protocol, KiWear as an SDK ecosystem partner, and a later full-SDK roadmap. It does not disclose a protocol version, GATT or message schema, encryption and key management, media format, timestamp model, phone/cloud split, retention, API authentication, third-party review, hardware coverage, or SDK price.",
      useCases: "Observable partner directions include connecting the glasses as a personal recorder to a phone application, retrieving a memory timeline, sending selected events to a personal knowledge tool, building an accessory controller, or creating a vertical real-time capture workflow. The announcement does not name a delivered third-party application, so these remain development directions, not current purchasable features.",
      painPointsSolved: "Opening Bluetooth can reduce reverse-engineering and connection cost for partners that would otherwise face a closed device. It gives accessories, sync, and scenario integrations a place to start and may shorten experimentation. It does not solve bystander impact, sensitive-content capture, event-level deletion, cross-device duplication, account recovery, or partner misuse.",
      newTech: "The route is to open the connection layer first and higher-level SDK semantics later. That lets hardware partners explore before the full memory and application model is ready. For memory devices, the hard problem is not BLE connectivity; it is an auditable definition of event, source, time, participant, permission, deletion, and model retrieval boundaries. Those details are source not stated.",
      availability: "The Developer Access announcement is public, with KiWear as the first partner and Bluetooth publication beginning in September 2026. Full SDK, access application, hardware purchase, price, region, shipping, eligibility, API limits, and general-user scope are source not stated. The item should remain a developer-surface signal, not a mature open platform.",
      limitsOrUnknowns: "Follow-up evidence needs to cover protocol documentation, pairing and authentication, phone-disconnect behavior, cache, upload and deletion, bystander consent, edge/cloud processing, default retrieval scope, raw-media download, revocation auditability, partner review, and residency. Without this, an open-ecosystem claim describes direction, not safe scale.",
      productVerdict: "MemoMind One Developer Access is a meaningful ecosystem signal: the connection layer is being offered to partners before the complete permission model for memory assets is explained. Verdict: the roadmap is real, platform capability is unproven; the next evidence should be the protocol and deletion/consent APIs, not a partner logo."
    }}
  }),
  topic({
    id: "meta-dat-community-friction-scan", section: "community", dossierKind: "scan", evidenceLabel: "review/community friction", sourceDate: "2026-07-09",
    evidenceStrength: "public GitHub issue and discussion; individual reports are directional and not a failure-rate study",
    zhHeadline: "社区摩擦扫描：眼镜平台的真正成本是连接、权限和连续视频流",
    enHeadline: "Community scan: the real cost of a glasses platform is connection, permission, and continuous video",
    zhFact: "Meta DAT 的公开 issue/讨论记录了设备注册后 devicesStream 为空、L2CAP 连接失败、视频流在高分辨率/特定固件下中断等问题；维护者回复也给出了固件 bug、降低设置、使用 hvc1 自行解码等方向。它们是开发者摩擦证据，不是 Meta 平台整体失败率。",
    enFact: "Public Meta DAT issues and discussions record empty devicesStream after registration, L2CAP connection failures, and video-stream interruption under high-resolution or specific firmware conditions. Maintainer replies mention a firmware bug, reducing pressure, and decoding hvc1 independently. These are developer-friction signals, not a platform-wide failure rate.",
    zhValue: "对一个眼镜平台，开发者要的不是一次 demo 能跑，而是权限、设备发现、流状态、关键帧恢复和升级后的兼容性可预测。社区问题把‘硬件可用’拆成可复现的状态机，也说明文档与诊断工具本身就是产品。",
    enValue: "For a glasses platform, developers need more than one successful demo. They need predictable permissions, discovery, stream state, keyframe recovery, and upgrade compatibility. The reports decompose hardware availability into a reproducible state machine and show that documentation and diagnostics are themselves product surfaces.",
    zhHciLens: ["症状：设备为空 / 断流", "环境：SDK + firmware + OS", "恢复：降码率 / 自解码", "结论：待复现，不泛化"],
    enHciLens: ["Symptom: empty device / stream drop", "Environment: SDK + firmware + OS", "Recovery: lower pressure / own decode", "Conclusion: reproduce, do not generalise"],
    zhImplication: "将社区 issue 里的 environment、症状、已排除项、临时 workaround 与最终修复时间直接沉淀进 SDK 的诊断面，开发者才不会把硬件问题误判成自己的代码问题。",
    enImplication: "SDK diagnostics should capture the environment, symptom, ruled-out causes, workaround, and fix ETA from the issue itself, so developers do not misdiagnose a hardware problem as their own code failure.",
    visual: communityVisual,
    sources: [source("Meta DAT iOS issue #239", metaIssue, "community"), source("Meta DAT v0.8 discussion", metaDiscussion, "community"), source("Meta DAT help discussions", "https://github.com/facebook/meta-wearables-dat-ios/discussions/categories/help", "community")],
    dossier: { zh: {
      productName: "Meta DAT 社区摩擦扫描（review/community friction）",
      productType: "这是对 Meta Wearables Device Access Toolkit 公开 GitHub issue 与 discussion 的摩擦扫描，不是一个单独产品。扫描对象是开发者把 AI 眼镜接入 iOS/Android 应用时遇到的设备发现、权限、蓝牙/L2CAP、视频流和固件兼容问题。",
      interactionFlow: "开发者遵循注册、Developer Mode、Meta AI 授权、设备发现和 stream session 流程；当设备已经配对却无法出现在 devicesStream、L2CAP channel 无法建立、视频在高分辨率或固件更新后不再显示时，他们在公开 issue 中附上 OS、SDK、firmware、App 版本和复现步骤，维护者再给出 workaround 或固件/SDK 修复方向。",
      specsOrStack: "公开摩擦材料提到 iOS、Xcode、Ray-Ban Meta、DAT 0.8、Meta AI、Developer Mode、BLE/L2CAP、CameraAccess sample、HVC1/raw 解码和 firmware v128 等组合。没有统一测试矩阵、总体失败率、平均恢复时间、版本支持 SLA 或所有设备型号覆盖。",
      useCases: "扫描对需要相机流、视觉助手、现场记录、无障碍辅助或显示体验的第三方开发者有用。它帮助团队把配对、授权、发现、流建立、丢帧、恢复和更新兼容作为端到端验收，而不是只测一个晴天 demo。",
      painPointsSolved: "扫描本身不解决痛点，只暴露：注册成功不代表设备可见，权限成功不代表 stream 可用，高分辨率不代表连续解码，固件升级可能改变可用状态，sample 能跑不代表自定义 app 能跑。",
      newTech: "没有新的确认技术事实；社区价值在于提供真实环境组合和维护者诊断线索，例如高压力传输导致关键帧丢失、raw 解码器遇到 missed frame 后不恢复、降低设置或自行处理 hvc1 是临时路径。",
      availability: "issue 与 discussion 公开可读；工具处于 developer preview。没有足够样本把这些报告转成平台缺陷率或上市承诺。",
      limitsOrUnknowns: "报告多为单个开发者环境，无法代表所有国家、型号、网络和固件。修复是否已经普遍部署、不同平台是否对齐、隐私状态是否在断流时保持清晰，都需要再次运行验证。",
      productVerdict: "这是 review/community friction：最值得带回产品的是诊断状态机与版本兼容矩阵，而不是把个别 issue 直接写成‘平台不可用’。"
    }, en: {
      productName: "Meta DAT community-friction scan",
      productType: "This is a friction scan of public Meta Wearables Device Access Toolkit GitHub issues and discussions, not a standalone product. It covers device discovery, permissions, Bluetooth/L2CAP, video streaming, and firmware compatibility when developers connect AI glasses to iOS or Android apps.",
      interactionFlow: "Developers follow registration, Developer Mode, Meta AI consent, device discovery, and stream-session steps. When a paired device does not appear in devicesStream, an L2CAP channel cannot be established, or video disappears under high-resolution settings or after a firmware update, they post OS, SDK, firmware, app versions, and reproduction steps. Maintainers then provide a workaround or point toward firmware and SDK fixes.",
      specsOrStack: "The public friction material names iOS, Xcode, Ray-Ban Meta, DAT 0.8, Meta AI, Developer Mode, BLE/L2CAP, the CameraAccess sample, HVC1/raw decoding, and firmware v128. It supplies no shared test matrix, population failure rate, mean recovery time, support SLA, or complete device coverage.",
      useCases: "The scan matters to third-party developers building camera-stream applications, visual assistants, field capture, accessibility, or display experiences. It encourages end-to-end acceptance across pairing, consent, discovery, stream start, frame loss, recovery, and upgrades instead of one successful demo.",
      painPointsSolved: "The scan does not solve the problem. It shows that registration does not guarantee discovery, permission does not guarantee streaming, high resolution does not guarantee continuous decoding, firmware can change availability, and a sample that works does not prove a custom app will work.",
      newTech: "There is no new confirmed technology fact. The community value is concrete environment combinations and maintainer diagnosis, such as keyframe loss under high transport pressure, raw-decoder freezes after a missed frame, and temporary paths involving lower settings or independent hvc1 handling.",
      availability: "The issues and discussions are public, and the toolkit is a developer preview. The sample is not large enough to turn the reports into a platform defect rate or a retail promise.",
      limitsOrUnknowns: "Most reports come from one developer environment and cannot represent every country, model, network, or firmware. Whether fixes are broadly deployed, whether iOS and Android remain aligned, and whether privacy state stays legible during a disconnect need fresh runs.",
      productVerdict: "Keep this as review/community friction: the product lesson is a diagnostic state machine and compatibility matrix, not a universal claim that the platform is unusable."
    }}
  }),
  topic({
    id: "conversational-smart-glasses-patent-watch", section: "patent", dossierKind: "scan", evidenceLabel: "patent signal", sourceDate: "2026-03-26",
    evidenceStrength: "Google Patents record for a Meta application; patent material is directional and not a product announcement",
    zhHeadline: "专利观察：眼镜端对话助手开始围绕时机、上下文和连续交流布局",
    enHeadline: "Patent watch: conversational glasses filings focus on timing, context, and continuity",
    zhFact: "Google Patents 记录了 Meta Platforms Technologies 的 US20260087801A1，标题为‘Methods for conversational interactions with an artificially intelligent assistant’；页面显示 2026 年 3 月公开、申请状态 pending。它只能说明专利方向，不能证明产品、功能、价格或发布日期。",
    enFact: "Google Patents records Meta Platforms Technologies' US20260087801A1, titled 'Methods for conversational interactions with an artificially intelligent assistant'; the page shows publication in March 2026 and a pending application. It indicates a patent direction, not a product, feature, price, or launch date.",
    zhValue: "专利关注点值得用作产品问题库：当用户戴着眼镜连续对话时，系统何时听、何时打断、如何把视线/手势/语音和上下文合并，以及如何在佩戴者与旁观者之间管理反馈。它不提供真实体验证据。",
    enValue: "The filing is useful as a product-question bank: when glasses are used for a continuing conversation, when should the system listen or interrupt, how should gaze, gesture, voice, and context combine, and how should feedback be managed between wearer and bystanders? It provides no real-world experience evidence.",
    zhHciLens: ["信号：对话方法专利", "关注：上下文 / 时序", "边界：pending", "降级：非产品事实"],
    enHciLens: ["Signal: conversational method patent", "Focus: context / timing", "Boundary: pending", "Downgrade: not product fact"],
    zhImplication: "专利线适合提醒团队提前设计对话时序和社交可见性，但所有功能仍须回到官方产品页、真机或独立测评验证。",
    enImplication: "The patent lane can prompt early design work on conversational timing and social legibility, but every capability must return to official product pages, hardware, or independent testing.",
    visual: patentVisual,
    sources: [source("Google Patents US20260087801A1", patentUrl, "patent"), source("Google Patents search: smart glasses assistant", "https://patents.google.com/?q=(smart+glasses+AI+assistant)&oq=smart+glasses+AI+assistant", "patent")],
    dossier: { zh: {
      productName: "Meta conversational smart-glasses patent watch（专利信号）",
      productType: "这是对 Google Patents 上 Meta 相关智能眼镜对话助手申请的专利观察，不是一个已确认的产品。申请标题指向人工智能助手在眼镜端的对话交互方法，法律状态和权利范围需要专业法律阅读，页面本身也不能替代产品发布证据。",
      interactionFlow: "专利标题和摘要层面的信号围绕佩戴者与 AI assistant 的 conversational interaction；可被产品团队转译成监听、唤醒、连续追问、上下文保持、打断、确认和结束等状态问题。但公开专利页面没有提供可用产品的完整 UI、语音样例、设备列表、上线地区或用户操作指南。",
      specsOrStack: "公开记录显示申请号 US20260087801A1、Meta Platforms Technologies LLC、2026 年 3 月公开、状态 pending，并关联智能眼镜端 AI assistant 的 conversational methods。模型、传感器、麦克风、显示、网络、OS、API、数据留存和实现是否进入产品 source not stated。",
      useCases: "可观察的研究方向包括连续对话、上下文保持、佩戴者在移动中与助手协作、可能的多模态触发和对话反馈。这里的 use case 是专利信号的解释，不是已交付的用户功能。",
      painPointsSolved: "专利可能试图处理眼镜对话中的唤醒摩擦、重复说明、上下文丢失和不自然的头部/手部操作，但申请不能证明这些痛点已经被解决，也不能证明用户会接受连续监听。",
      newTech: "专利的新颖性应由权利要求和审查文件决定；本刊只把它当作对话时序、上下文与眼镜交互编排的方向信号，不把任何图示或摘要升级成技术规格。",
      availability: "Google Patents 可查看该公开记录；没有购买页、开发者 SDK、价格、发布日期、设备清单或一般用户可用性。",
      limitsOrUnknowns: "需要进一步查看权利要求、同族、审查事件、是否授权、是否被产品团队采用，以及真实设备是否出现对应交互。专利法律状态不等于商业计划，申请人也可能放弃或修改方案。",
      productVerdict: "patent signal：保留为未来对话交互与社交可见性的观察线，不作为已上市产品或功能承诺。"
    }, en: {
      productName: "Meta conversational smart-glasses patent watch",
      productType: "This is a patent watch of a Meta-related smart-glasses assistant application on Google Patents, not a confirmed product. The title points to conversational interaction methods for an AI assistant on glasses. Legal status and claim scope require professional legal reading; the patent page cannot substitute for product evidence.",
      interactionFlow: "At the title and abstract level, the signal concerns conversational interaction between a wearer and an AI assistant. A product team could translate it into questions about listening, wake-up, follow-up, context retention, interruption, confirmation, and ending a conversation. The public patent record does not provide a usable product UI, voice sample, device list, launch region, or user guide.",
      specsOrStack: "The record identifies application US20260087801A1, Meta Platforms Technologies LLC, publication in March 2026, pending status, and conversational methods for an AI assistant at a head-wearable device. Model, sensors, microphones, display, network, OS, API, retention, and whether the idea entered a product are source not stated.",
      useCases: "Possible directions include continuous conversation, context retention, collaboration with an assistant while moving, multimodal triggers, and conversational feedback. These are interpretations of a patent signal, not shipped user functions.",
      painPointsSolved: "The filing may address wake-up friction, repeated explanation, lost context, and unnatural head or hand actions in glasses conversations. It cannot prove that these problems are solved or that users accept continuous listening.",
      newTech: "Novelty must be assessed through claims and prosecution records. This issue treats the filing only as a direction around conversational timing, context, and wearable interaction orchestration; no drawing or abstract is promoted to a specification.",
      availability: "The public record is viewable on Google Patents. There is no purchase page, developer SDK, price, launch date, device list, or general-user availability.",
      limitsOrUnknowns: "Follow-up needs the claims, family, prosecution events, grant status, evidence of product adoption, and real-device behaviour. Patent status is not a commercial plan; an applicant can abandon or amend a proposal.",
      productVerdict: "Patent signal: keep it as a watch item for future conversational interaction and social legibility, not as a shipped-product or feature promise."
    }}
  })
];

const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = issues.find((item) => item.date === previousDate);
if (!previous) throw new Error(`Missing previous issue ${previousDate}`);
const issue = structuredClone(previous);
issue.date = date;
issue.zhTitle = "AI Daily 2026-09-12：AI 眼镜的下一关，是把输入做成平台";
issue.enTitle = "AI Daily 2026-09-12: The next AI-glasses test is making input a platform";
issue.zhSummary = "Meta 把 AI 眼镜的相机、音频、显示和发布路径放进开发者面；讯飞 AI 眼镜接入蚂蚁灵影，把语音意图推向支付与本地生活动作；Codex auto-review 把高权限动作变成审查停顿。社区连接摩擦、MemoMind 协议开放与对话助手专利均按开发者/专利信号降级，等待真机、完整 API 和更广泛复现。";
issue.enSummary = "Meta puts AI-glasses camera, audio, display, and publishing paths into a developer surface; iFLYTEK connects to Ant Lingying to move voice intent toward payments and local services; Codex auto-review turns high-privilege actions into review pauses. Community connection friction, MemoMind protocol access, and a conversational-assistant patent remain downgraded pending hardware, complete APIs, and broader reproduction.";
issue.tags = Array.from(new Set(["Meta Wearables DAT", "AI glasses platform", "iFLYTEK AI Glasses", "Lingying AOS", "Codex auto-review", "memory glasses", "developer surface", "community friction", "patent signal", ...issue.tags]));
issue.sourceTypes = Array.from(new Set(["confirmed product", "developer surface", "review/community friction", "patent signal", "china", "global", "official", "community", "wild", ...issue.sourceTypes]));
issue.topics = [...newTopics, ...issue.topics.filter((item) => !newTopics.some((fresh) => fresh.id === item.id))];
issue.coverStory = {
  topicId: newTopics[0].id,
  zhTitle: "AI 眼镜的下一关：先把‘一帧真实输入’做成可靠平台",
  enTitle: "The next AI-glasses test: make one real frame a reliable platform",
  zhSummary: ["Meta 将 camera、audio、display、Developer Mode、权限和发布通道放进同一开发者入口。", "社区 issue 显示，注册成功不等于设备可见，授权成功不等于视频连续。", "眼镜平台的第一性产品指标，是连接、流状态、恢复和隐私提示能否被开发者看懂并复现。"],
  enSummary: ["Meta brings camera, audio, display, Developer Mode, permissions, and release channels into one developer entry point.", "Community issues show that registration does not guarantee discovery, and consent does not guarantee continuous video.", "The first-principles platform metric is whether connection, stream state, recovery, and privacy indication are legible and repeatable."],
  imagePath: metaVisual.path, imageWidth: metaVisual.width, imageHeight: metaVisual.height, imageSourceUrl: metaVisual.sourceUrl, primarySourceUrl: metaDevelopers,
  evidenceStrength: "developer surface · Meta official developer center · 2026-09-12",
  whyCover: "AI glasses become a platform only when third-party developers can obtain, understand, and recover the real-world signal after consent."
};
issue.designDesk = {
  zhTitle: "Design Desk：把‘开口即办’与‘一帧可用’拆成可验收状态机",
  enTitle: "Design Desk: turn voice-first action and one usable frame into state machines",
  zhIntro: "今天的产品信号横跨眼镜输入平台、生活服务执行、高权限 agent 审查和记忆设备开放；共同的 UX 任务是让状态、授权、外部写入、失败恢复和证据边界可读。",
  enIntro: "Today's signals span glasses input platforms, local-service actions, high-privilege Agent review, and memory-device access; the shared UX task is making state, consent, external writes, recovery, and evidence boundaries legible.",
  zhItems: [
    { label: "Frame truth", body: "把注册、授权、发现、stream、关键帧、断连和恢复做成可观测状态机。" },
    { label: "Action consent", body: "支付、订单、位置写入必须展示对象、金额、期限、撤销和接管路径。" },
    { label: "Privilege pause", body: "auto-review 让提权动作回到批准点，payload 与结果要绑定。" },
    { label: "Memory boundary", body: "蓝牙开放不等于记忆开放；事件、旁观者和删除权限需要 API 化。" },
    { label: "Evidence ladder", body: "官方、社区、路线图、研究、专利分别标注，不能混成同一产品事实。" },
    { label: "Recovery UX", body: "把 workaround、固件差异和修复 ETA 带进开发者诊断面。" }
  ],
  enItems: [
    { label: "Frame truth", body: "Expose registration, consent, discovery, streaming, keyframes, disconnect, and recovery as a state machine." },
    { label: "Action consent", body: "Payment, ordering, and location writes need target, amount, time limit, undo, and takeover." },
    { label: "Privilege pause", body: "Auto-review returns elevated actions to an approval point and binds payload to outcome." },
    { label: "Memory boundary", body: "Opening Bluetooth is not opening memory; events, bystanders, and deletion need APIs." },
    { label: "Evidence ladder", body: "Official, community, roadmap, research, and patent signals cannot become one product fact." },
    { label: "Recovery UX", body: "Bring workarounds, firmware differences, and fix ETAs into developer diagnostics." }
  ]
};
issue.watchlistZh = [
  "Meta DAT：0.9/后续 SDK、display 与 camera 的型号矩阵、v128 后视频流、生产发布资格、断连恢复与隐私状态。",
  "讯飞 × 灵影：停车/支付/点单实际开放城市、确认/撤销/赔付、账户绑定、端云边界与数据删除。",
  "Codex auto-review：动作预览、payload 绑定、阻断解释、审批链、回滚、误阻率与硬件密钥恢复。",
  "MemoMind One：Bluetooth 协议文档、full SDK、事件模型、旁观者同意、删除 API、数据驻留与发货。",
  "Meta conversational-glasses patent：权利要求、审查事件、是否授权、产品采用证据与真实设备行为。",
  ...issue.watchlistZh
];
issue.watchlistEn = [
  "Meta DAT: later SDKs, display/camera capability matrix, v128 video streaming, production eligibility, disconnect recovery, and privacy state.",
  "iFLYTEK x Lingying: live cities for payment and ordering, confirmation/undo/compensation, account binding, edge-cloud split, and deletion.",
  "Codex auto-review: action preview, payload binding, block explanation, approval chain, rollback, false-block rate, and key recovery.",
  "MemoMind One: Bluetooth documentation, full SDK, event model, bystander consent, deletion API, residency, and shipping.",
  "Meta conversational-glasses patent: claims, prosecution, grant status, product adoption, and real-device behaviour.",
  ...issue.watchlistEn
];
issue.sourcesPath = `./${date}/sources.md`;
issue.zhPath = `./${date}/zh/`;
issue.enPath = `./${date}/en/`;
const index = issues.findIndex((item) => item.date === date);
if (index >= 0) issues[index] = issue; else issues.unshift(issue);
issues.sort((a, b) => b.date.localeCompare(a.date));
await fs.writeFile(dataPath, `${JSON.stringify(issues, null, 2)}\n`);

await fs.rm(deckDir, { recursive: true, force: true });
await fs.mkdir(path.join(deckDir, "public", "assets"), { recursive: true });
await fs.cp(path.join(previousDeck, "public", "assets"), path.join(deckDir, "public", "assets"), { recursive: true });
await fs.writeFile(path.join(deckDir, "public", "assets", "meta-dat-friction-2026-09.svg"), svg("Meta DAT friction", "Community signal · reproduction required", [["REGISTER", "success", "not discovery"], ["PERMIT", "granted", "not streaming"], ["STREAM", "frame drops", "firmware / codec"], ["RECOVER", "workaround", "lower pressure"], ["DIAGNOSE", "logs", "environment"], ["LABEL", "evidence", "community"]], "#8a5a00"));
await fs.writeFile(path.join(deckDir, "public", "assets", "patent-conversational-glasses-watch-2026-09.svg"), svg("Conversational glasses patent", "Patent signal · not a shipped feature", [["LISTEN", "when?", "timing"], ["CONTEXT", "what?", "continuity"], ["INTERRUPT", "how?", "social"], ["CONFIRM", "before act", "consent"], ["STATUS", "pending", "legal record"], ["LABEL", "evidence", "patent"]], "#3d6fa3"));

const labels = { zh: ["产品", "产品是什么", "怎么用", "规格 / 系统栈", "使用场景", "解决痛点", "新技术", "可用性", "限制 / 未知", "产品判断"], en: ["Product", "What it is", "How it works", "Specs / stack", "Use cases", "Pain points", "New tech", "Availability", "Limits / unknowns", "Product read"] };
const fields = ["productName", "productType", "interactionFlow", "specsOrStack", "useCases", "painPointsSolved", "newTech", "availability", "limitsOrUnknowns", "productVerdict"];
const dossierText = (locale, item) => fields.map((field, i) => `**${labels[locale][i]}** — ${item.dossier[locale][field]}`).join("\n\n");
const links = (item) => item.sources.map((s) => `[${s.label}](${s.url})`).join(" · ");
const slides = [
  `---\ntheme: default\ntitle: AI Daily ${date}\nlayout: cover\n---\n\n# AI Daily ${date}\n\n${issue.coverStory.zhTitle} / ${issue.coverStory.enTitle}\n\n<img src="./public/${metaVisual.path}" style="width:42%;height:54%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${issue.coverStory.evidenceStrength}**\n\n${issue.coverStory.zhSummary.join(" ")}\n\n${links(newTopics[0])}`,
  `# Issue map\n\n**Cover** — ${issue.coverStory.zhTitle}\n\n**Today’s additions** — ${newTopics.map((item) => item.zhHeadline).join("；")}。\n\n**Eight source lanes** — official · reviews · community · wild · research · patent · china · global。\n\n**Design Desk** — ${issue.designDesk.zhTitle}。\n\nThe public publisher carries the complete bilingual, paged 16:9 issue with source/date/evidence labels and PDF downloads.`,
  ...newTopics.flatMap((item) => [`# ${item.zhHeadline}\n\n<img src="./public/${item.visual.path}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${item.evidenceLabel} · ${item.evidenceStrength} · ${item.sourceDate}**\n\n${dossierText("zh", item)}\n\n**Sources** — ${links(item)}`, `# ${item.enHeadline}\n\n<img src="./public/${item.visual.path}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${item.evidenceLabel} · ${item.evidenceStrength} · ${item.sourceDate}**\n\n${dossierText("en", item)}\n\n**Sources** — ${links(item)}`]),
  `# Design Desk / 设计洞察\n\n${issue.designDesk.zhItems.map((x, i) => `${i + 1}. **${x.label}** — ${x.body}`).join("\n\n")}\n\n${issue.designDesk.enItems.map((x, i) => `${i + 1}. **${x.label}** — ${x.body}`).join("\n\n")}`,
  `# Watchlist / 继续观察\n\n${issue.watchlistZh.map((x, i) => `${i + 1}. ${x}`).join("\n")}\n\n${issue.watchlistEn.map((x, i) => `${i + 1}. ${x}`).join("\n")}`,
  `# Source ledger\n\nEight lanes: official · reviews · community · wild · research · patent · china · global.\n\n${Array.from(new Set(issue.topics.flatMap((item) => item.sources.map((s) => s.url)))).slice(0, 80).map((url, i) => `${i + 1}. ${url}`).join("\n")}\n\nVisual evidence uses local source-traceable screenshots or clearly labelled self-drawn diagrams with contain positioning and white backgrounds.`
];
await fs.writeFile(path.join(deckDir, "package.json"), JSON.stringify({ scripts: { build: "slidev build --base ./ --out dist" }, dependencies: { "@slidev/cli": "^0.50.0", "@slidev/theme-default": "^0.25.0", vue: "^3.4.0" } }, null, 2) + "\n");
await fs.writeFile(path.join(deckDir, "slides.md"), slides.join("\n\n---\n\n") + "\n");
const allSources = Array.from(new Map(issue.topics.flatMap((item) => item.sources).map((s) => [s.url, s])).values());
const laneRows = ["official", "reviews", "community", "wild", "research", "patent", "china", "global"].map((lane) => `| ${lane} | ${issue.topics.some((item) => item.section === lane) ? "covered" : "scan required"} | ${issue.topics.filter((item) => item.section === lane).map((item) => item.id).join(", ") || "source-lane scan"} |`).join("\n");
const visualRows = issue.topics.map((item) => `| ${item.id} | \`${item.visual.path}\` | ${item.visual.sourceUrl} | ${item.evidenceLabel} |`).join("\n");
await fs.writeFile(path.join(deckDir, "sources.md"), `# AI Daily ${date} source ledger\n\n## Source index\n\n${allSources.map((s, i) => `${i + 1}. ${s.label} — ${s.url} — ${s.type || "source not stated"}`).join("\n")}\n\n## Source-lane coverage\n\n| lane | status | topics |\n| --- | --- | --- |\n${laneRows}\n\n## Visual asset index\n\n| topic | asset | source | evidence |\n| --- | --- | --- | --- |\n${visualRows}\n\n## Evidence rules\n\n- Official pages support confirmed product or developer-surface claims only where stated.\n- Reviews and community pages provide friction signals, not universal behaviour.\n- Startup, research, patent, and weak material remains explicitly downgraded.\n- Missing specs, prices, dates, availability, quotes, and APIs are written as source not stated.\n- Visuals use object-fit: contain, object-position: center, white backgrounds, and no page-internal scrolling.\n- Chinese and English dossier fields carry the same information units; English is not a compressed summary.\n`);
console.log(JSON.stringify({ date, topics: issue.topics.length, added: newTopics.length, sources: new Set(issue.topics.flatMap((item) => item.sources.map((s) => s.url))).size, visuals: new Set(issue.topics.map((item) => item.visual.path)).size, deckDir }));
