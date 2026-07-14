import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const issuesPath = path.join(root, "data", "issues.json");
const issues = JSON.parse(await fs.readFile(issuesPath, "utf8"));
const previous = issues.find((issue) => issue.date === "2026-07-13");
if (!previous) throw new Error("Missing 2026-07-13 source issue");

const clone = (value) => structuredClone(value);
const source = (label, url) => ({ label, url });
const visual = (file, width, height, title, url, zh, en) => ({
  path: "assets/" + file,
  width,
  height,
  kind: "source-backed screenshot",
  altZh: "真实来源视觉：" + title,
  altEn: "Source-backed visual: " + title,
  captionZh: zh,
  captionEn: en,
  sourceUrl: url
});
const old = Object.fromEntries(previous.topics.map((topic) => [topic.id, clone(topic)]));
const carry = (id, section, visualPath) => {
  const topic = clone(old[id]);
  if (!topic) throw new Error("Missing previous topic " + id);
  if (section) topic.section = section;
  topic.sourceDate = topic.sourceDate + " · 2026-07-14 follow-up";
  if (visualPath) topic.visual.path = "assets/" + visualPath;
  return topic;
};
const makeProduct = (config) => ({
  id: config.id,
  section: config.section,
  zhHeadline: config.zhHeadline,
  enHeadline: config.enHeadline,
  zhFact: config.zh.productName + "：" + config.zh.productType + " 本条按 " + config.evidenceLabel + " 处理；未披露处写 source not stated。",
  enFact: config.en.productName + ": " + config.en.productType + " This item is handled as " + config.evidenceLabel + "; missing details remain source not stated.",
  zhValue: config.zh.productVerdict,
  enValue: config.en.productVerdict,
  zhHciLens: config.hciZh,
  enHciLens: config.hciEn,
  zhImplication: config.zh.painPointsSolved,
  enImplication: config.en.painPointsSolved,
  sourceDate: config.sourceDate,
  evidenceLabel: config.evidenceLabel,
  evidenceStrength: config.evidenceStrength,
  visual: config.visual,
  sources: config.sources,
  dossierKind: "product",
  dossier: { zh: config.zh, en: config.en }
});

const metaUrl = "https://about.fb.com/news/2026/07/metas-ai-glasses-your-questions-answered/";
const meta = makeProduct({
  id: "meta-ai-glasses-capture-led-privacy-update",
  section: "official",
  zhHeadline: "Meta 把 capture LED 防篡改写成相机级硬件约束",
  enHeadline: "Meta turns capture-LED tamper detection into a camera-level hardware constraint",
  sourceDate: "2026-07-08 official FAQ · 2026-07-12 regional update",
  evidenceLabel: "confirmed product",
  evidenceStrength: "confirmed product · official privacy control · review/community friction",
  visual: visual("meta-ai-glasses-privacy-source-2026-07.png", 1600, 1000, "Meta AI Glasses privacy FAQ", metaUrl, "Meta 官方 FAQ 页面截图；capture LED、相机禁用、设备端导入和旁观者隐私说明以原文为准。", "Meta official FAQ screenshot; capture LED, camera disabling, device-side import, and bystander privacy follow the source."),
  hciZh: ["可见录制状态", "防篡改恢复", "旁观者信任"],
  hciEn: ["visible capture state", "tamper recovery", "bystander trust"],
  sources: [
    source("Meta AI Glasses privacy FAQ", metaUrl),
    source("Meta glasses privacy approach", "https://www.meta.com/help/smart-glasses/articles/health-safety-and-privacy/privacy-glasses/"),
    source("Android Central hands-on", "https://www.androidcentral.com/wearables/meta-glasses-hands-on-review")
  ],
  zh: {
    productName: "Meta AI Glasses",
    productType: "Meta AI Glasses 是带摄像头、麦克风、扬声器和 Meta AI 的日常眼镜产品。今天值得记录的产品变化来自 Meta 7 月 FAQ：capture LED 变成相机工作状态的外部信号，第二代起，系统检测到 LED 被遮挡、关闭、物理改造或破坏时会禁用相机。产品焦点因此从“有没有隐私承诺”落到旁观者能看见什么、设备会允许什么。",
    interactionFlow: "用户通过语音、镜腿控制或手机 companion app 拍照、录视频、听音频、调用 Meta AI，再选择何时把内容导入手机图库。照片录制时 LED 短暂闪烁，视频录制时持续闪烁；用户佩戴者会听到快门声。Meta 说明设备上的图库内容先存于眼镜，导入手机后才进入手机图库；当 LED 被遮挡或检测到篡改，拍摄路径被系统阻断，恢复条件是 LED 未被遮挡且未处于篡改状态。",
    specsOrStack: "官方确认的栈包括 capture LED、相机、麦克风、扬声器、眼镜本地存储、手机导入、Meta AI 和 companion app。Meta 没有在这份 FAQ 中披露处理器、RAM、相机具体型号、录制码率、端云模型分工或 LED 的亮度与检测阈值，因此这些细节写 source not stated。第二代相机禁用、防篡改检测和数据导入路径是公开的行为约束，不应扩写成隐私绝对保证。",
    useCases: "已公开使用包括免手持拍照和视频、听音乐与播客、向 AI 提问、把所见场景交给 AI、再把选择的内容导入手机分享。对佩戴者，拍摄入口减少拿手机的动作；对周围人，LED 提供一个可见的录制提示。真实产品场景还包括多人聚会、公共交通、零售空间和工作现场，这些地方的可接受性取决于旁观者是否理解 LED、佩戴者是否能解释拍摄行为。",
    painPointsSolved: "系统处理两类痛点：佩戴者想要持续可用的相机/助手入口，旁观者不想面对不可见的录制。把 LED 和 camera permission 绑定，减少用户用胶带遮灯后仍能拍摄的灰色状态；设备端存储与用户主动导入减少“所有内容自动上云”的直觉风险。代价是硬件和系统需要识别篡改，用户在 LED 故障或误判时会失去相机能力。",
    newTech: "新意是把社会规范编码进硬件状态机：capture LED 不只是提示灯，也成为相机许可的一部分。Meta 还说明持续改进对物理改造的检测，并会处理售卖 LED 篡改服务的内容。产品设计上，这是一条“状态可见—能力联动—异常恢复”的链路；它把隐私从设置页移到佩戴者和旁观者共同能观察的物理反馈层。",
    availability: "Meta FAQ 已公开，相关 AI Glasses 产品持续销售；具体地区、代际和功能随产品而变。FAQ 没有给出新的统一售价、发货日、固件版本、LED 检测功能的逐型号覆盖或所有地区的开关路径，均为 source not stated。Android Central 报道早期 7 月软件更新会在检测到 LED 被篡改时禁用相机，但本文以 Meta 官方 FAQ 的行为描述为主。",
    limitsOrUnknowns: "公开资料没有说明误判率、检测延迟、LED 被自然遮挡时的恢复体验、是否存在无相机的 AI 请求路径，也没有独立测试证明旁观者确实能在日光、拥挤环境和远距离看到 LED。Meta 说相机禁用的是对录制能力的约束，不等于所有传感器、语音或云端数据处理都停止。用户仍需要理解每个功能的采集边界。",
    productVerdict: "Meta 把隐私争议转成一个可测试的产品动作：灯被遮或被破坏，相机停。它比一条隐私声明更接近真实交互，却仍需要独立评测、清晰的状态反馈和地区化规则来证明可信度。AI 眼镜接下来的竞争点，会包括能否让旁观者和佩戴者共享同一套录制状态，而非只让拥有者在 App 里看设置。"
  },
  en: {
    productName: "Meta AI Glasses",
    productType: "Meta AI Glasses are everyday glasses with cameras, microphones, speakers, and Meta AI. The product change worth recording today comes from Meta’s July FAQ: the capture LED becomes an external signal of camera activity, and from the second generation onward the camera is disabled when the system detects that the LED has been covered, disabled, physically modified, or destroyed. The product question moves from whether privacy is promised to what bystanders can see and what the device will allow.",
    interactionFlow: "The wearer uses voice, temple controls, or the companion app to take photos and video, listen to audio, ask Meta AI questions, and decide when to import captures to the phone gallery. The LED blinks briefly for a photo and continuously during video; the wearer hears a shutter sound. Meta says gallery captures are stored on the glasses until the user imports them to the phone. If the LED is blocked or tampering is detected, the capture path is blocked; recovery requires the LED to be unblocked and no longer in a tampered state.",
    specsOrStack: "The source confirms a capture LED, camera, microphones, speakers, local glasses storage, phone import, Meta AI, and a companion app. The FAQ does not state processor, RAM, camera model, recording bitrate, edge/cloud model split, or LED brightness and detection thresholds, so those details remain source not stated. Second-generation camera disabling and the tamper-detection behavior are public constraints; they should not be expanded into an absolute privacy guarantee.",
    useCases: "Documented uses include hands-free photos and video, music and podcasts, questions to the assistant, asking about a live scene, and importing selected captures for sharing. The wearer gets a lower-friction camera and assistant entry point; people nearby get a visible recording cue. Real settings include gatherings, public transit, retail, and workplaces, where acceptance depends on whether bystanders understand the LED and whether the wearer can explain the recording behavior.",
    painPointsSolved: "The system addresses two problems: the wearer wants an always-available camera and assistant, while bystanders do not want invisible recording. Binding the LED to camera permission reduces the ambiguous state in which a user covers the light yet keeps recording. Local capture storage and deliberate import reduce the intuitive risk of everything going to the cloud automatically. The cost is that hardware and software must judge tampering, and false positives can remove camera access.",
    newTech: "The product move is to encode a social norm in a hardware state machine: the capture LED is part of camera permission, not merely an indicator. Meta also says it is improving detection of physical modification and acting against services that sell LED-tampering methods. The design pattern is visible state, capability coupling, and recovery. Privacy moves out of a settings page into a physical feedback layer shared by wearer and bystanders.",
    availability: "Meta’s FAQ is public and the AI Glasses product family remains on sale, with details varying by region and generation. The FAQ does not provide a new universal price, shipping date, firmware version, model-by-model coverage, or every regional control path; those remain source not stated. Android Central reports an early-July software update that disables the camera when LED tampering is detected, while this dossier prioritizes Meta’s own behavior description.",
    limitsOrUnknowns: "The sources do not state false-positive rate, detection latency, recovery after natural obstruction, whether an AI query can run without camera access, or whether all sensors and cloud processing stop when the camera is disabled. Independent testing has not established that bystanders can see the LED in daylight, crowds, or at distance. A camera constraint is not the same thing as a complete data-processing boundary.",
    productVerdict: "Meta turns a privacy dispute into a testable product action: if the light is covered or damaged, the camera stops. That is closer to real interaction than a policy statement, while independent testing, clear status feedback, and local rules are still needed. The next contest for AI glasses includes whether wearer and bystander can share the same recording state, rather than leaving the boundary visible only inside an app."
  }
});

const htcUrl = "https://www.vive.com/us/newsroom/2025-08-14/";
const htc = makeProduct({
  id: "htc-vive-eagle-local-ai-glasses",
  section: "reviews",
  zhHeadline: "HTC VIVE Eagle 把相机、翻译和本地数据放进一副生活化眼镜",
  enHeadline: "HTC VIVE Eagle puts camera, translation, and local data into lifestyle eyewear",
  sourceDate: "2025-08-14 official launch · 2026-07-01 HardwareZone review",
  evidenceLabel: "confirmed product",
  evidenceStrength: "confirmed product · official product · review/community friction",
  visual: visual("htc-vive-eagle-source-2026-07.png", 1600, 1000, "HTC VIVE Eagle", htcUrl, "HTC VIVE 官方产品页截图；12MP 相机、VIVE AI、13 语言翻译、电池与隐私说明以官方资料为准。", "HTC VIVE official product-page screenshot; 12MP camera, VIVE AI, 13-language translation, battery, and privacy follow the source."),
  hciZh: ["语音作为主入口", "本地数据边界", "翻译反馈"],
  hciEn: ["voice as primary entry", "local-data boundary", "translation feedback"],
  sources: [
    source("HTC VIVE Eagle official launch", htcUrl),
    source("HTC VIVE Eagle product page", "https://www.vive.com/us/product/vive-eagle/overview/"),
    source("HardwareZone hands-on review", "https://www.hardwarezone.com.sg/mobile/wearables/htc-vive-eagle-ai-smart-glasses-review"),
    source("HTC security and privacy whitepaper", "https://dl.htc.com/report_materials/htc_security_and_privacy_whitepaper.pdf")
  ],
  zh: {
    productName: "HTC VIVE Eagle",
    productType: "VIVE Eagle 是 HTC 的相机型 AI 眼镜系统，配套 VIVE Connect 手机应用和 VIVE AI 云服务。它把语音助手、免手拍照、音乐、提醒、笔记、餐厅推荐和拍照翻译放进日常镜框，产品形态更接近音频眼镜加视觉输入，适合旅行和快速记录。",
    interactionFlow: "用户佩戴眼镜，通过“Hey VIVE”等语音指令或快捷键拍照、录制、记提醒、做笔记、询问推荐、播放音乐和调用翻译。相机捕获的内容交给 VIVE AI，翻译结果通过开放式音频播放；用户也可以在手机应用中管理内容和设置。官方支持 OpenAI GPT 与 Google Gemini 等第三方模型，模型切换、网络可用性和结果质量成为实际流程的一部分。",
    specsOrStack: "HTC 官方列出 12MP ultra-wide camera、低于 49 g 的镜框、235mAh 电池、最高 36 小时待机、约 4.5 小时连续音乐播放、10 分钟充至约 50%、开放式音频、ZEISS sun lenses、LED 录制指示、AES-256 加密和 13 种翻译语言。系统由眼镜、VIVE Connect 和 cloud AI service platform 构成。芯片、RAM、录制分辨率、Wi-Fi/蜂窝方式与 VIVE AI 的端云分工为 source not stated。",
    useCases: "已公开场景包括旅行时拍摄街景和翻译菜单、用语音记录提醒、在路上听音乐和接听电话、寻找餐厅、给眼前内容做语音翻译，以及第一人称记录。它面向需要保留双手、保持环境感知和减少掏手机次数的人。开放式音频保留环境声，视觉捕获则让翻译和内容理解比纯音频眼镜更具体。",
    painPointsSolved: "VIVE Eagle 试图消除“看到之后还要掏手机”的动作，把相机、语音和翻译放在同一入口；本地存储和匿名化声明处理用户对照片和语音被训练的担心。评测指出，AI 眼镜仍受手机配对、应用设置、网络与回答准确度影响。产品把流程变短，却把第三方模型、云服务和数据边界带到眼镜体验里。",
    newTech: "主要组合是 12MP ultra-wide camera、开放式音频、VIVE AI 多模型接入、13 语言拍照翻译、眼镜端本地数据存储与 AES-256。HTC 还把 LED 遮挡和移除时的自动停录写入隐私设计。新技术的产品价值取决于反馈：用户必须知道照片是否拍到、翻译是否开始、结果来自哪个模型，以及网络中断后如何恢复。",
    availability: "HTC 官方宣布 VIVE Eagle 首发台湾，官方价格 NT$15,600，提供 Berry、Coffee、Grey、Black 四色；美国页面公开了产品信息，实际零售地区和交付仍需按当地页面核对。发布资料还提到两年 VIVE AI Plus，订阅覆盖和地区资格为 source not stated。2026 年 7 月的 HardwareZone 评测提供了真实使用摩擦，但不是 HTC 的规格替代品。",
    limitsOrUnknowns: "官方的“本地存储”“不用于训练”和“匿名化”仍需要技术审计与独立测试；第三方模型请求会改变数据路径。公开资料没有给出拍照上传延迟、翻译准确率、开放式音频漏音测量、连续 AI 续航、处方镜片区域或手机断连时的降级模式。评测对 AI 眼镜的准确性、连接和日常价值保持保留。",
    productVerdict: "VIVE Eagle 是一条完整可购买的相机型 AI 眼镜路线：语音负责触发，相机负责看见，开放式音频负责回传，手机和云负责补齐能力。它的优势是场景具体，风险是体验高度依赖连接、第三方模型和清晰的数据说明。对产品设计而言，最重要的交互仍是“正在拍什么、谁在处理、何时结束”。"
  },
  en: {
    productName: "HTC VIVE Eagle",
    productType: "VIVE Eagle is HTC’s camera-based AI glasses system, paired with the VIVE Connect mobile app and a VIVE AI cloud service. It puts voice assistance, hands-free photos, music, reminders, notes, restaurant recommendations, and photo translation into an everyday frame. The form factor is closer to audio glasses with visual input than to an immersive display product, aimed at travel and fast capture.",
    interactionFlow: "The wearer uses a phrase such as ‘Hey VIVE’ or a shortcut to take a photo, record, create a reminder, write a note, ask for a recommendation, play music, or translate. The camera capture is sent to VIVE AI and translation comes back through open-ear audio; the phone app manages content and settings. HTC supports third-party model platforms including OpenAI GPT and Google Gemini, so model availability, network access, and response quality are part of the real interaction flow.",
    specsOrStack: "HTC lists a 12MP ultra-wide camera, a frame under 49 grams, a 235mAh battery, up to 36 hours of standby, about 4.5 hours of continuous music playback, roughly 50% charge after ten minutes, open-ear audio, ZEISS sun lenses, a recording LED, AES-256 encryption, and translation across 13 languages. The system consists of the glasses, VIVE Connect, and a cloud AI service platform. Chip, RAM, recording resolution, connectivity method, and the edge/cloud split are source not stated.",
    useCases: "Documented jobs include photographing a street scene and translating a menu while traveling, recording reminders by voice, listening to music and taking calls outdoors, finding a restaurant, translating what the camera sees into speech, and creating first-person records. The product targets users who want free hands, environmental awareness, and fewer phone pulls. Open-ear audio preserves ambient sound while the camera makes translation and visual understanding more concrete than an audio-only device.",
    painPointsSolved: "VIVE Eagle targets the action of seeing something and then reaching for a phone by putting camera, voice, and translation behind one entry point. Local storage and anonymization claims address concern about photos and voice being used for training. The review evidence shows that pairing, app setup, network conditions, and answer quality still shape the experience. The flow is shorter, while third-party models, cloud services, and data boundaries become part of the glasses product.",
    newTech: "The combination is a 12MP ultra-wide camera, open-ear audio, multi-model VIVE AI access, 13-language photo translation, local glasses storage, and AES-256. HTC also makes recording stop when the LED is obstructed or the glasses are removed. The design value depends on feedback: users need to know whether a photo was captured, whether translation started, which model supplied the answer, and what happens after a network failure.",
    availability: "HTC announced an initial Taiwan launch at NT$15,600 in Berry, Coffee, Grey, and Black. The US product page is public, while actual retail regions and delivery should be checked locally. Launch material mentions two years of VIVE AI Plus, but subscription coverage and regional eligibility are source not stated. HardwareZone’s July 2026 review supplies hands-on friction and does not replace HTC’s specification pages.",
    limitsOrUnknowns: "Claims about local storage, no training use, and anonymization still need technical audit and independent testing; third-party model requests change the data path. Public sources do not state capture upload latency, translation accuracy, measured audio leakage, continuous AI runtime, prescription availability by region, or a phone-disconnected fallback mode. Review evidence remains cautious about accuracy, connectivity, and everyday value.",
    productVerdict: "VIVE Eagle is a complete, purchasable camera-AI glasses route: voice triggers, the camera sees, open-ear audio returns the answer, and phone plus cloud services fill the gaps. Its strength is concrete use cases; its risk is dependence on connectivity, third-party models, and clear data explanations. The key product interaction remains: what is being captured, who is processing it, and when does it stop?"
  }
});

const haloUrl = "https://brilliant.xyz/products/halo";
const halo = makeProduct({
  id: "brilliant-labs-halo-open-source-ai-glasses",
  section: "wild",
  zhHeadline: "Brilliant Labs Halo 把开源硬件、端侧 NPU 和长期记忆 agent 放在开发者入口",
  enHeadline: "Brilliant Labs Halo puts open hardware, an edge NPU, and a memory agent behind a developer entry point",
  sourceDate: "2026-03 Alif partnership · 2026-07 official product/developer pages",
  evidenceLabel: "startup signal",
  evidenceStrength: "startup signal · developer surface · source-backed product page",
  visual: visual("brilliant-labs-halo-source-2026-07.png", 1600, 1000, "Brilliant Labs Halo", haloUrl, "Brilliant Labs Halo 官方产品页截图；开源、Noa、Vibe Mode、价格和规格以官方页为准。", "Brilliant Labs Halo official product-page screenshot; open source, Noa, Vibe Mode, price, and specifications follow the source."),
  hciZh: ["开发者可改造", "记忆可控性", "端侧 AI 反馈"],
  hciEn: ["developer modification", "memory control", "edge-AI feedback"],
  sources: [
    source("Brilliant Labs Halo product page", haloUrl),
    source("Brilliant Labs developer page", "https://brilliant.xyz/pages/developers"),
    source("Halo developer documentation", "https://docs.brilliant.xyz/halo/halo/"),
    source("Brilliant Labs and Alif partnership", "https://www.businesswire.com/news/home/20260311666274/en/Brilliant-Labs-and-Alif-Semiconductor-Partner-on-Development-of-New-Technologies-for-Next-Generation-AI-Powered-Smart-Glasses"),
    source("Brilliant community shipping discussion", "https://www.reddit.com/r/SmartGlasses/comments/1spf1l6/are_brilliant_labs_halo_glasses_shipping_now/")
  ],
  zh: {
    productName: "Brilliant Labs Halo",
    productType: "Halo 是 Brilliant Labs 面向创作者和开发者的开放式 AI 眼镜。官方售价 349 美元，产品页把 Noa 私人对话 agent、长期记忆、Vibe Mode、彩色显示、开源硬件和软件放在一起。它选择“可拆解、可开发”的路径，目标是让眼镜成为可编程的 embodied interface，而不是只消费一个封闭助手。",
    interactionFlow: "用户可以通过语音或触控唤醒 Noa，围绕所见、所听和想法进行对话；Vibe Mode 允许用自然语言描述想做的体验。开发者使用 Brilliant SDK、Flutter SDK 和官方文档构建应用，硬件与软件仓库提供更深层改造入口。产品页还描述记忆增强、视觉/音频对话和翻译，具体触发手势、显示反馈、第三方 agent 权限和应用分发路径需要开发者资料继续确认。",
    specsOrStack: "官方资料列出略高于 40g、Micro Color OLED、2 个骨传导扬声器、Alif Balletto B1 低功耗 AI 处理器、Cortex-M55 CPU 与 Ethos-U55 NPU、低功耗光学传感器、双麦克风、6-axis IMU、tap detection、Bluetooth 5.3、ZephyrOS with Lua interface、跨平台移动 App、cloud-based AI agent，以及官网规格页标出的 14 小时 all-day battery。Alif 合作资料支持 B1/NPU 的端侧 AI 方向；RAM、摄像头规格、模型参数和端云切分为 source not stated。",
    useCases: "Halo 适用于把看到的物体、听到的语句和个人记忆连接起来，做翻译、免手问答、创意原型、HUD 小应用和实验性 agent。开发者可以利用光学传感器、麦克风、IMU、显示和骨传导音频创建自己的反馈回路。对用户，它把“记得我见过什么”作为持续价值；对创作者，它把硬件、SDK、Lua/Flutter 和社区项目放在同一试验场。",
    painPointsSolved: "开放平台降低了封闭眼镜无法改造、无法接入自有模型、无法研究传感器反馈的门槛；端侧 NPU 路线则试图降低持续视觉/语音任务对云端的依赖。长期记忆解决的是用户反复解释背景的痛点。代价是用户要承担隐私、模型选择、应用质量和硬件维护，记忆 agent 还会扩大“设备记住了什么”的解释与删除需求。",
    newTech: "组合亮点是 Alif B1 的 Cortex-M55 加 NPU、低功耗 optical sensor、彩色 Micro OLED、开源硬件/软件和 Noa memory agent。Vibe Mode 把自然语言变成开发入口，SDK 把眼镜从单一 App 变成可编程平台。真正的新交互问题是端侧推理完成时如何反馈、云端 agent 介入时如何提示、长期记忆写入前如何获得同意。",
    availability: "Halo 产品页公开 349 美元价格，并写明 shipping starts Q1 2026；开发者页、文档和产品页可访问，处方/太阳镜镜片通过合作伙伴提供，显示 optic 调节范围写为 +2 到 -6 diopters。当前页面没有给出所有国家的库存、交付状态、Noa+ 覆盖、完整应用商店和 SDK 开放资格；这些保持 source not stated。社区仍在讨论实际发货与等待时间，因此本条保留 startup signal。",
    limitsOrUnknowns: "官方规格与实际量产体验之间仍有证据空缺：没有独立评测证明 14 小时在显示、麦克风、记忆和云请求混合负载下成立，也没有公开的 NPU 模型、摄像头能力、误唤醒率、数据保留实测或开发者 marketplace。官方条款还说明目前没有公开 developer marketplace，社区存在等待发货的讨论。",
    productVerdict: "Halo 代表开发者优先的 AI 眼镜路线：它把能量预算、开放源码、传感器和 agent 记忆同时交给实验者。349 美元降低试错门槛，开源与端侧 NPU提高了研究价值；量产、发货、应用分发和记忆治理仍决定它是可用平台还是有吸引力的开发套件。产品判断应保持 startup signal，不提前升级为成熟消费生态。"
  },
  en: {
    productName: "Brilliant Labs Halo",
    productType: "Halo is Brilliant Labs’ open AI glasses for creators and developers. The official page lists a $349 price and combines Noa, a private conversational agent with long-term memory, Vibe Mode, a color display, open hardware, and open software. The bet is that glasses become a programmable embodied interface rather than a closed assistant that users merely consume.",
    interactionFlow: "A user can wake Noa by voice or touch and talk about what they see, hear, or imagine; Vibe Mode lets a person describe an experience in natural language. Developers use the Brilliant SDK, Flutter SDK, and documentation to build applications, while open hardware and software repositories provide deeper modification paths. The product page describes memory enhancement, visual and audio dialogue, and translation, while exact gestures, display feedback, third-party agent permissions, and distribution remain to be confirmed in developer material.",
    specsOrStack: "Brilliant lists a little over 40 grams, a Micro Color OLED, two bone-conduction speakers, an Alif Balletto B1 low-power AI processor with a Cortex-M55 CPU and Ethos-U55 NPU, a low-power optical sensor, dual microphones, a six-axis IMU, tap detection, Bluetooth 5.3, ZephyrOS with a Lua interface, a cross-platform mobile app, a cloud AI agent, and a 14-hour all-day battery claim on its specifications page. The Alif partnership supports the edge-AI direction; RAM, camera details, model parameters, and edge/cloud split are source not stated.",
    useCases: "Halo is positioned for connecting objects seen, speech heard, and personal memory, as well as translation, hands-free questions, small HUD applications, creative prototypes, and experimental agents. A developer can combine the optical sensor, microphones, IMU, display, and bone-conduction audio into a custom feedback loop. For users, the promise is remembering what they encountered; for creators, the value is a shared experimental surface for hardware, SDKs, Lua/Flutter, and community projects.",
    painPointsSolved: "An open platform lowers the barrier created by closed glasses that cannot be modified, connected to a preferred model, or used for sensor research. The edge-NPU route tries to reduce dependence on the cloud for continuous visual and audio tasks. Long-term memory reduces the need to restate context. The cost is that users take on privacy, model choice, app quality, and hardware maintenance, while memory agents create stronger requirements to explain and delete what the device remembers.",
    newTech: "The combination is an Alif B1 Cortex-M55 plus NPU, low-power optical sensing, a color Micro OLED, open hardware and software, and the Noa memory agent. Vibe Mode turns natural language into a development entry point, while the SDK turns glasses from one app into a platform. The hard interaction questions are how edge inference is signaled, how cloud-agent involvement is disclosed, and how consent is obtained before long-term memory is written.",
    availability: "Halo’s product page lists $349 and says shipping starts in Q1 2026. The developer page, documentation, and product page are public; prescription and sunglass options are offered through a partner, with the display optic listed as adjustable from +2 to -6 diopters. The current page does not state inventory and delivery for every country, Noa+ coverage, a complete app store, or general SDK eligibility. Community discussion still questions actual shipping and wait times, so this remains a startup signal.",
    limitsOrUnknowns: "There is an evidence gap between the published specification and a mass-produced experience. Independent testing has not established that 14 hours survives mixed display, microphone, memory, and cloud-request load. Public sources do not state the NPU models, camera capability, false-wake rate, measured data retention, or a developer marketplace. Brilliant’s terms say it does not currently operate a public developer marketplace, and community posts report shipping uncertainty.",
    productVerdict: "Halo represents a developer-first AI-glasses route that hands the energy budget, source access, sensors, and agent memory to experimenters. The $349 price lowers the cost of trying the form factor, while open design and an edge NPU make it valuable for research. Production, shipping, distribution, and memory governance decide whether it is a usable platform or an attractive kit. Keep the verdict at startup signal rather than mature consumer ecosystem."
  }
});

const topics = [
  meta,
  htc,
  halo,
  carry("snap-specs-agent-first-ar-glasses", "official"),
  carry("even-g2-camera-free-productivity-glasses", "reviews"),
  carry("qualcomm-snapdragon-reality-elite-on-device-xr", "global"),
  carry("microsoft-project-solara-mdep-agent-first-devices", "official"),
  carry("community-ai-glasses-friction-scan", "community", "meta-ai-glasses-privacy-source-2026-07.png"),
  carry("openai-gpt-live-voice-interface", "official"),
  carry("acti-agentic-keyboard", "wild"),
  carry("nvidia-xr-ai-viture-helix", "global"),
  carry("zai-zcode-china-global", "china"),
  carry("china-ai-glasses-os-scan", "china"),
  carry("wearable-agent-research-patent-watch-scan", "research"),
  carry("patent-lane-glasses-ip-scan", "patent")
];

const issue = {
  date: "2026-07-14",
  timezone: "America/Toronto",
  zhTitle: "AI Daily 2026-07-14：隐私边界开始成为 AI 眼镜的硬件 API",
  enTitle: "AI Daily 2026-07-14: Privacy Boundaries Become a Hardware API for AI Glasses",
  zhSummary: "Meta 把 capture LED 防篡改做成相机禁用机制；HTC VIVE Eagle 把相机、翻译、第三方模型和本地存储落到生活化产品；Brilliant Labs Halo 用开源、端侧 NPU 与长期记忆 agent 抢开发者入口。今天的产品问题从“AI 能看见什么”推进到“谁能看见、何时停止、数据如何恢复”。",
  enSummary: "Meta turns capture-LED tamper detection into camera disabling; HTC VIVE Eagle puts camera, translation, third-party models, and local storage into lifestyle eyewear; Brilliant Labs Halo targets developers with open hardware, an edge NPU, and a memory agent. The product question moves from what AI can see to who can see it, when capture stops, and how data recovers.",
  tags: ["AI glasses", "privacy hardware", "on-device AI", "Brilliant Labs Halo", "HTC VIVE Eagle", "Meta AI Glasses", "agent UX", "HCI"],
  sourceTypes: ["official", "reviews", "community", "wild", "research", "patent", "china", "global"],
  zhPath: "./2026-07-14/zh/",
  enPath: "./2026-07-14/en/",
  sourcesPath: "./2026-07-14/sources.md",
  coverStory: {
    topicId: "meta-ai-glasses-capture-led-privacy-update",
    zhTitle: "隐私边界开始成为 AI 眼镜的硬件 API",
    enTitle: "Privacy boundaries become a hardware API for AI glasses",
    imagePath: "assets/meta-ai-glasses-privacy-source-2026-07.png",
    imageWidth: 1600,
    imageHeight: 1000,
    primarySourceUrl: metaUrl,
    imageSourceUrl: metaUrl,
    evidenceStrength: "confirmed product · Meta capture LED · hardware privacy control",
    whyCover: "Meta’s capture LED couples visible recording state to camera permission; HTC makes local storage and model routing part of a camera glasses product; Halo opens the stack to developers. Together they expose privacy as a physical, runtime, and developer-surface problem.",
    zhSummary: [
      "Meta 把遮挡或破坏 capture LED 与相机禁用绑定，隐私状态进入硬件状态机。",
      "HTC VIVE Eagle 让相机、翻译、开放式音频和第三方模型在同一日常眼镜流程中相遇。",
      "Brilliant Labs Halo 用开源与端侧 NPU 降低开发门槛，同时把长期记忆的控制责任交给产品。"
    ],
    enSummary: [
      "Meta binds a covered or damaged capture LED to camera disabling, moving privacy into a hardware state machine.",
      "HTC VIVE Eagle brings camera, translation, open-ear audio, and third-party models into one everyday flow.",
      "Brilliant Labs Halo lowers the development barrier with open design and an edge NPU, while making memory control a product responsibility."
    ]
  },
  designDesk: {
    zhTitle: "Design Desk：把隐私做成状态、能力与恢复链路",
    enTitle: "Design Desk: Make privacy a chain of state, capability, and recovery",
    zhIntro: "今天的产品资料共同指向一个可执行的 HCI 要求：用户和旁观者都要知道设备是否在采集、哪个模型在处理、数据是否离开设备、能力何时停止，以及误判后怎样恢复。",
    enIntro: "Today’s product evidence points to an actionable HCI requirement: wearers and bystanders need to know whether capture is active, which model is processing, whether data leaves the device, when capability stops, and how to recover from a false positive.",
    zhItems: [
      { label: "LED 不是装饰", body: "Meta 把 capture LED 绑定到相机许可；产品需要把录制状态做成可见、可解释、可恢复的硬件反馈。" },
      { label: "模型路由要可见", body: "VIVE Eagle 支持第三方模型，眼镜必须告诉用户请求是否上云、由谁处理、结果是否可追溯。" },
      { label: "记忆写入前要有门", body: "Halo 的 Noa 记忆把价值延长到未来，也把同意、删除、导出和错误记忆恢复推到交互前台。" },
      { label: "低摩擦入口需要低成本撤销", body: "语音、镜腿触控和显示都让触发更快；停止、取消、重试和回到原上下文必须同样近。" },
      { label: "无相机仍然有边界", body: "Even G2 用无相机换取社交接受度，但麦克风、手机连接和显示内容仍需要清晰的状态说明。" },
      { label: "研究、专利和中国线索继续降级", body: "VisionClaw、专利与中国 AIOS 线索提出问题，却缺少运行与长期用户证据，保留 research/patent/scan 标签。" }
    ],
    enItems: [
      { label: "The LED is not decoration", body: "Meta couples the capture LED to camera permission. Recording state must be visible, explainable, and recoverable in hardware feedback." },
      { label: "Model routing needs a surface", body: "VIVE Eagle supports third-party models. The glasses need to show whether a request leaves the device, who processes it, and whether the answer is traceable." },
      { label: "Memory needs a gate", body: "Halo’s Noa extends value into the future while pushing consent, deletion, export, and wrong-memory recovery into the primary interaction." },
      { label: "Low-friction triggers need cheap reversal", body: "Voice, temple touch, and displays make triggering fast. Stop, cancel, retry, and return to context must be just as close." },
      { label: "Camera-free still has boundaries", body: "Even G2 trades the camera for social acceptability, but microphones, phone connectivity, and display content still need clear state." },
      { label: "Research, patents, and China stay downgraded", body: "VisionClaw, patent, and China AIOS signals frame questions, while runtime and long-term user evidence are missing." }
    ]
  },
  watchlistZh: [
    "Meta AI Glasses：capture LED 防篡改更新的逐型号覆盖、误判恢复和旁观者可见性。",
    "HTC VIVE Eagle：实际地区发货、AI Plus 订阅、第三方模型数据路径和连续 AI 续航。",
    "Brilliant Labs Halo：Q1 2026 发货兑现、14 小时混合负载、B1/NPU 开发面与 Noa 记忆控制。",
    "Snap SPECS / Even G2：秋季发货、显示节奏、手机依赖、日常佩戴与隐私状态。",
    "Qualcomm、Project Solara、Android XR：合作设备、公开 API、端侧模型和企业管理面。",
    "China、VisionClaw、专利：保持 scan/research/patent 降级，等待可复现产品证据。"
  ],
  watchlistEn: [
    "Meta AI Glasses: model-by-model coverage, false-positive recovery, and bystander visibility for LED tamper updates.",
    "HTC VIVE Eagle: regional shipping, AI Plus subscription, third-party model data paths, and continuous AI runtime.",
    "Brilliant Labs Halo: Q1 2026 shipping, mixed-load battery, B1/NPU development surface, and Noa memory controls.",
    "Snap SPECS and Even G2: fall shipping, display pacing, phone dependence, daily wear, and privacy state.",
    "Qualcomm, Project Solara, and Android XR: partner hardware, public APIs, edge models, and enterprise management.",
    "China, VisionClaw, and patents: keep scan, research, and patent downgrades until reproducible product evidence appears."
  ],
  topics
};

await fs.writeFile(issuesPath, JSON.stringify([issue, ...issues.filter((item) => item.date !== "2026-07-14")], null, 2) + "\n");
console.log(`Created 2026-07-14: ${topics.length} topics, ${new Set(topics.flatMap((topic) => topic.sources.map((item) => item.url))).size} unique sources.`);
