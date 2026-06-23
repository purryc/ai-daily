import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const surveyRoot = path.resolve(root, "..", "Survey");
const date = "2026-06-23";
const deckDir = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${date}`);
const assetDir = path.join(deckDir, "public", "assets");

const baseZh =
  "本条只采用来源明示信息；未披露的价格、地区、重量、续航、传感器、芯片、API 版本、发货节奏和用户原话均写 source not stated。产品评估以用户能否完成连续任务为准：启动、授权、感知、确认、执行、反馈、撤销和失败恢复必须形成闭环。若来源只给愿景或演示，本期把它当作产品方向，不把演示效果写成量产体验。";
const baseEn =
  "This dossier uses only source-stated facts. Any price, region, weight, battery, sensor, chipset, API version, shipment timing, or user quote not stated by the cited sources remains source not stated. The product read is based on task closure: invocation, permission, sensing, confirmation, execution, feedback, undo, and failure recovery must form a usable loop. If a source shows vision or demo language only, this issue treats it as product direction rather than confirmed shipped experience.";

function product({ id, section, zhHeadline, enHeadline, sourceDate, evidenceLabel, evidenceStrength, visualName, visualTitle, captionZh, captionEn, sources, productName, productTypeZh, productTypeEn, flowZh, flowEn, stackZh, stackEn, useZh, useEn, painZh, painEn, techZh, techEn, availabilityZh, availabilityEn, limitsZh, limitsEn, verdictZh, verdictEn }) {
  return {
    id,
    section,
    zhHeadline,
    enHeadline,
    zhFact: productTypeZh,
    enFact: productTypeEn,
    zhValue: painZh,
    enValue: painEn,
    zhHciLens: ["输入", "上下文", "反馈", "接管"],
    enHciLens: ["Input", "Context", "Feedback", "Takeover"],
    zhImplication: verdictZh,
    enImplication: verdictEn,
    sourceDate,
    evidenceLabel,
    evidenceStrength,
    visual: {
      path: `assets/${visualName}`,
      width: 1200,
      height: 760,
      altZh: `${productName} source-based diagram`,
      altEn: `${productName} source-based diagram`,
      captionZh,
      captionEn,
      sourceUrl: sources[0].url
    },
    sources,
    dossierKind: "product",
    dossier: {
      zh: {
        productName,
        productType: `${productTypeZh} ${baseZh}`,
        interactionFlow: `${flowZh} 用户触点必须把设备状态讲清楚：什么时候在听、什么时候在看、什么时候只是本地处理、什么时候把数据交给云端或第三方服务。`,
        specsOrStack: `${stackZh} 规格只记录来源明确写出的层级；其余写 source not stated，避免把芯片平台、参考设计或媒体推测混成最终 SKU。`,
        useCases: `${useZh} 真正的场景价值来自减少切换和解释，不是把同一件事搬到更贵、更贴脸或更自动的表面。`,
        painPointsSolved: `${painZh} 如果新硬件引入佩戴压力、隐私焦虑、误触、热量或售后不确定，原本被解决的痛点会以新形式回来。`,
        newTech: `${techZh} 新技术只有改变控制权才算产品进步：用户必须知道系统知道什么、正在做什么、何时需要确认、以及怎样撤销。`,
        availability: `${availabilityZh} 上线、预订、试点和地区信息按来源记录；未披露的售后、开发者资格、长期生态和企业采购条件为 source not stated。`,
        limitsOrUnknowns: `${limitsZh} 需要后续评测验证日常耐久、错误恢复、隐私提示、边缘场景和多设备连续性。`,
        productVerdict: `${verdictZh} 对设计团队的影响是把“AI 能力”翻译为状态语法、权限语法和恢复语法，而不是只做一个入口按钮。`
      },
      en: {
        productName,
        productType: `${productTypeEn} ${baseEn}`,
        interactionFlow: `${flowEn} The touchpoints must make device state legible: when it is listening, seeing, processing locally, sending data to cloud services, asking for confirmation, or handing control back to the user.`,
        specsOrStack: `${stackEn} The stack section records only layers stated by sources; everything else remains source not stated so that silicon platforms, reference designs, launch demos, and media inference do not collapse into a fake final SKU.`,
        useCases: `${useEn} The real scenario value is reducing switching, explanation, waiting, and cleanup after failure, not moving the same task onto a more expensive, more wearable, or more automated surface.`,
        painPointsSolved: `${painEn} If the new surface adds wear pressure, privacy anxiety, false triggers, heat, setup work, or unclear support policy, the original pain point returns in another form.`,
        newTech: `${techEn} The technology matters only if it changes the control model: what the system knows, what it is doing, when it asks, how it can be revised, and how a failed action can be undone.`,
        availability: `${availabilityEn} Launch, preorder, pilot, and region details follow the cited sources; support policy, developer eligibility, long-term ecosystem supply, and enterprise procurement terms remain source not stated unless explicitly disclosed.`,
        limitsOrUnknowns: `${limitsEn} Follow-up reviews must validate daily endurance, error recovery, privacy cues, edge cases, latency under load, and whether workflows survive outside curated demos.`,
        productVerdict: `${verdictEn} For product and HCI teams, the design implication is to translate AI capability into state grammar, permission grammar, and recovery grammar rather than another generic AI entry button.`
      }
    }
  };
}

function scan({ id, section, zhHeadline, enHeadline, sourceDate, evidenceLabel, evidenceStrength, visualName, visualTitle, captionZh, captionEn, sources, zh, en }) {
  return {
    id,
    section,
    zhHeadline,
    enHeadline,
    zhFact: zh,
    enFact: en,
    zhValue: zh,
    enValue: en,
    zhHciLens: ["证据缺口", "摩擦", "下一步"],
    enHciLens: ["Evidence gap", "Friction", "Next watch"],
    zhImplication: zh,
    enImplication: en,
    sourceDate,
    evidenceLabel,
    evidenceStrength,
    visual: {
      path: `assets/${visualName}`,
      width: 1200,
      height: 760,
      altZh: `${visualTitle} scan diagram`,
      altEn: `${visualTitle} scan diagram`,
      captionZh,
      captionEn,
      sourceUrl: sources[0].url
    },
    sources,
    dossierKind: "scan",
    dossier: {
      zh: {
        productName: visualTitle,
        productType: `${zh} 这是 source-lane scan，不是确认产品。`,
        interactionFlow: "本 lane 扫描公开页面、媒体报道、社区讨论和研究/专利索引，未发现足够强的新增可操作 product-interface 发布可以提升为产品 dossier。",
        specsOrStack: "规格、价格、SKU、API 或硬件栈没有形成独立可验证更新；相关数字若出现于社区或二级报道，均不写成 confirmed fact。",
        useCases: "用途只作为观察方向：看哪些用户任务被反复提到、哪些摩擦阻止日常使用、哪些生态缺口需要官方或评测补证。",
        painPointsSolved: "当前未证明解决了新的用户痛点；最多说明市场正在围绕隐私、佩戴、噪声、带宽、开发者工具或售后问题聚集。",
        newTech: "新技术未被提升为量产事实；若来自论文或专利，本期仅标为 research signal 或 patent signal。",
        availability: "source not stated。没有可靠来源证明新增地区、发货、试点或采购入口。",
        limitsOrUnknowns: "主要未知是证据不足：缺少官方页、可复测评测、真实用户长期体验、明确规格或可下载开发者接口。",
        productVerdict: "Verdict：保持观察，不上升为确认产品事实。下一步看官方发布、独立评测、开发者文档或稳定社区复现。"
      },
      en: {
        productName: visualTitle,
        productType: `${en} This is a source-lane scan, not a confirmed product dossier.`,
        interactionFlow: "This lane scanned public pages, media reports, community discussion, and research or patent indexes. It did not produce a strong enough new operable product-interface update to promote as a confirmed product item.",
        specsOrStack: "Specs, price, SKU, API, or hardware stack did not form an independently verifiable update. Numbers appearing only in community posts or secondary summaries are not written as confirmed facts.",
        useCases: "Use cases remain watch directions: which user tasks recur, which frictions block daily use, and which ecosystem gaps need official or review evidence.",
        painPointsSolved: "The lane does not yet prove a newly solved user pain point. It mainly shows market attention clustering around privacy, wearability, noise, bandwidth, developer tools, or support friction.",
        newTech: "No new technology is promoted as shipped fact. Paper and patent material is labeled research signal or patent signal only.",
        availability: "source not stated. No reliable source proves a new region, shipment, pilot, procurement path, or end-user availability.",
        limitsOrUnknowns: "The main unknown is evidence quality: missing official pages, repeatable reviews, long-term user experience, clear specs, or downloadable developer surface.",
        productVerdict: "Verdict: watch, do not promote. The next trigger is an official launch, independent hands-on review, developer documentation, or stable community reproduction."
      }
    }
  };
}

const topics = [
  product({
    id: "snap-specs-near-eye-os",
    section: "official",
    zhHeadline: "Snap Specs：AR 眼镜从拍摄配件变成眼前操作系统",
    enHeadline: "Snap Specs: AR glasses move from capture accessory toward near-eye operating system",
    sourceDate: "2026-06-16 / accessed 2026-06-23",
    evidenceLabel: "confirmed product",
    evidenceStrength: "high / official launch plus developer and media details",
    visualName: "snap-specs-near-eye-os.svg",
    visualTitle: "Snap Specs",
    captionZh: "自绘机制图：Specs、Snap OS、Lens、相机、录制提示与近眼显示；基于官方与媒体来源",
    captionEn: "Self-drawn mechanism diagram: Specs, Snap OS, Lens, cameras, recording cue, and near-eye display; source-based",
    sources: [
      { label: "Snap Newsroom: Introducing Specs", url: "https://newsroom.snap.com/introducing-specs-augmented-reality-glasses", type: "official" },
      { label: "Snap Spectacles developer surface", url: "https://developers.snap.com/spectacles", type: "developer docs" },
      { label: "The Verge: Snap Specs launch details", url: "https://www.theverge.com/tech/950492/snap-specs-ar-glasses-launch-date-preorder", type: "review/media" },
      { label: "Axios: Snap CEO on Specs strategy", url: "https://www.axios.com/2026/06/23/snap-specs-ceo-evan-spiegel", type: "media" }
    ],
    productName: "Snap Specs",
    productTypeZh: "确认产品：see-through AR glasses / wearable computer，官方称在 AWE 2026 推出并开放预订，开发者 surface 指向 Spectacles/Lens 生态。",
    productTypeEn: "Confirmed product: see-through AR glasses / wearable computer, introduced at AWE 2026 with preorder language and a Spectacles/Lens developer surface.",
    flowZh: "用户戴上 Specs 后通过语音、空间输入、相机感知和 Lens 应用完成导航、学习、协作、娱乐和第一视角任务；眼前显示提供反馈，LED/机身提示承担旁人隐私信号。",
    flowEn: "The wearer uses voice, spatial input, camera perception, and Lens apps for navigation, learning, collaboration, entertainment, and first-person tasks; near-eye display gives feedback while body LEDs or cues carry bystander privacy signals.",
    stackZh: "来源写明 Snap Specs、Snap OS / Spectacles developer ecosystem、相机、显示与 Lens 开发链路；价格、押金、发货地区、电池和芯片等细节按媒体来源标注。",
    stackEn: "Sources state Snap Specs, Snap OS / Spectacles developer ecosystem, cameras, display, and Lens development path; price, deposit, shipping regions, battery, and chipset details are attributed to media reporting.",
    useZh: "核心场景是把手机 AR 的拿起、解锁、打开 app、对准现实、再解释上下文，压缩成眼前直接发生的动作。",
    useEn: "The core scenario compresses phone AR friction: pick up phone, unlock, open app, aim at reality, and explain context, into a face-worn action loop.",
    painZh: "它解决手机 AR 启动摩擦和社交场景里的屏幕隔离，但高价、可见摄像头和佩戴外观也会制造新的社会阻力。",
    painEn: "It addresses phone-AR startup friction and screen separation in social settings, but high price, visible cameras, and the wearer's appearance create new social resistance.",
    techZh: "新技术信号是 AR display、AI/视觉感知、Snap OS、Lens runtime 和隐私提示被装进同一副消费级眼镜。",
    techEn: "The new technology signal is AR display, AI/vision perception, Snap OS, Lens runtime, and privacy cues packaged into one consumer glasses platform.",
    availabilityZh: "官方与媒体显示已开放预订，媒体报道 fall 2026、美国/英国/法国、2195 美元和 200 美元押金；最终交付以官方订单为准。",
    availabilityEn: "Official and media sources show preorder availability; media reports fall 2026, US/UK/France, $2,195, and $200 deposit; final fulfillment remains official-order bound.",
    limitsZh: "未知包括全天佩戴、热、电池、显示户外可读性、开发者供给、旁人接受度和失败时的接管方式。",
    limitsEn: "Unknowns include all-day wear, heat, battery, outdoor display legibility, developer supply, bystander acceptance, and takeover behavior after failure.",
    verdictZh: "Verdict：今天的封面产品，强在把 AI 眼镜推进可购买/可开发阶段，风险在社会可接受性和日常闭环。",
    verdictEn: "Verdict: today’s cover product, strong because it moves AI glasses into a buyable and developable phase, risky because social acceptance and daily closure remain unproven."
  }),
  product({
    id: "viture-helix-work-ai-glasses",
    section: "reviews",
    zhHeadline: "VITURE Helix：AI safety glasses 把眼镜定位成工位上的协作传感器",
    enHeadline: "VITURE Helix: AI safety glasses position eyewear as a collaborative workplace sensor",
    sourceDate: "2026-06-16 / accessed 2026-06-23",
    evidenceLabel: "confirmed product",
    evidenceStrength: "medium-high / company PR plus hands-on media report",
    visualName: "viture-helix-work-ai-glasses.svg",
    visualTitle: "VITURE Helix",
    captionZh: "自绘产品栈图：12MP camera、4 microphones、NVIDIA XR AI、industrial/clinical workflow；基于来源",
    captionEn: "Self-drawn product stack: 12MP camera, four microphones, NVIDIA XR AI, industrial/clinical workflow; source-based",
    sources: [
      { label: "VITURE newsroom", url: "https://www.viture.com/", type: "official" },
      { label: "PR Newswire / Morningstar: VITURE Helix", url: "https://www.morningstar.com/news/pr-newswire/20260616cn82418/viture-unveils-helix-the-first-ai-safety-glasses-built-on-nvidias-xr-ai-solution-at-awe-2026", type: "official/press" },
      { label: "Android Central: VITURE Helix report", url: "https://www.androidcentral.com/gaming/virtual-reality/viture-nvidia-xr-ai-partner-for-smart-safety-glasses-in-the-workforce-that-make-it-easy", type: "review/media" }
    ],
    productName: "VITURE Helix",
    productTypeZh: "确认产品/企业试点信号：面向工业、科研、临床等场景的 AI safety glasses，来源描述为基于 NVIDIA XR AI solution。",
    productTypeEn: "Confirmed product / enterprise-pilot signal: AI safety glasses for industrial, scientific, and clinical settings, described by sources as built on NVIDIA's XR AI solution.",
    flowZh: "佩戴者在实验室、工厂或临床流程中通过第一视角相机和麦克风把现场交给多模态 AI，AI 给出 coaching、workflow assistance 或安全提示。",
    flowEn: "A worker in lab, industrial, or clinical workflows gives a multimodal AI the scene through first-person camera and microphones; the AI returns coaching, workflow assistance, or safety guidance.",
    stackZh: "媒体来源写到 12MP front-facing camera、four microphones、standalone operation、Wi-Fi、Bluetooth 5.3、60+ minutes battery 和 Q1 2027 / 600 美元预期；以正式销售页为准。",
    stackEn: "Media sources state a 12MP front-facing camera, four microphones, standalone operation, Wi-Fi, Bluetooth 5.3, more than 60 minutes of battery, and expected Q1 2027 / $600; final sales page controls.",
    useZh: "用例包括湿实验流程提醒、设备操作指导、临床训练、现场检查、危险步骤提示和专家远程监督。",
    useEn: "Use cases include wet-lab workflow reminders, equipment operation guidance, clinical training, field inspection, hazardous-step alerts, and remote expert supervision.",
    painZh: "它解决工作现场双手被占用、流程复杂、培训依赖专家和错误成本高的问题，但也把隐私、责任归属和网络稳定性推到前台。",
    painEn: "It addresses occupied hands, complex procedures, expert-dependent training, and high error cost, while bringing privacy, accountability, and network reliability to the foreground.",
    techZh: "新技术是 XR AI library 与 workplace wearable 的结合：眼镜不只是显示器，而是把第一视角、声音和现场任务绑定到模型。",
    techEn: "The new technology is the coupling of XR AI library and workplace wearable: the glasses are not only a display but a way to bind first-person view, audio, and live task context to a model.",
    availabilityZh: "AWE 2026 展示和企业试点信号明确；公开零售、认证、采购、售后、医疗合规和批量交付 source not stated。",
    availabilityEn: "AWE 2026 demos and enterprise-pilot signals are clear; public retail, certification, procurement, support, medical compliance, and volume fulfillment are source not stated.",
    limitsZh: "最大未知是它在真实班次中的续航、清洁、佩戴、防护等级、延迟、误报和责任边界。",
    limitsEn: "The largest unknowns are shift-length battery, sanitation, comfort, protective rating, latency, false alerts, and accountability boundaries.",
    verdictZh: "Verdict：比消费 AR 更务实，因为它锚定高价值工作流；但必须证明 AI 建议可靠且可审计。",
    verdictEn: "Verdict: more pragmatic than consumer AR because it anchors high-value workflows, but it must prove that AI guidance is reliable and auditable."
  }),
  product({
    id: "qualcomm-reality-elite-start",
    section: "official",
    zhHeadline: "Qualcomm Reality Elite / START：AI 眼镜底座转向端侧模型、热设计和参考工具链",
    enHeadline: "Qualcomm Reality Elite / START: the AI-glasses base shifts to on-device models, thermals, and reference toolchains",
    sourceDate: "2026-06-16 / accessed 2026-06-23",
    evidenceLabel: "developer surface",
    evidenceStrength: "high / official silicon and developer-program announcements",
    visualName: "qualcomm-reality-elite-start.svg",
    visualTitle: "Snapdragon Reality Elite / START",
    captionZh: "自绘平台图：Reality Elite、48 TOPS、display pipeline、START reference tools；基于 Qualcomm 来源",
    captionEn: "Self-drawn platform diagram: Reality Elite, 48 TOPS, display pipeline, START reference tools; Qualcomm-source-based",
    sources: [
      { label: "Qualcomm Reality Elite release", url: "https://www.qualcomm.com/news/releases/2026/06/qualcomm-takes-spatial-computing-into-the-ai-era-with-snapdragon", type: "official" },
      { label: "Qualcomm Snapdragon START release", url: "https://www.qualcomm.com/news/releases/2026/06/qualcomm-launches-snapdragon-start-to-enable-the-next-phase-of-p", type: "official" },
      { label: "9to5Google: Snapdragon Reality Elite", url: "https://9to5google.com/2026/06/16/snapdragon-reality-elite/", type: "media" }
    ],
    productName: "Snapdragon Reality Elite / Snapdragon START",
    productTypeZh: "开发者/硬件平台 surface：XR 与 AI wearable 的芯片平台和 reference toolkit，不是终端消费产品。",
    productTypeEn: "Developer / hardware platform surface: a chipset platform and reference toolkit for XR and AI wearables, not an end-consumer device.",
    flowZh: "终端用户不会直接操作芯片，但会通过更低延迟的手势、空间显示、live translation、agent feedback 和本地视觉模型感受到它。",
    flowEn: "End users do not operate the chip directly, but they feel it through lower-latency gesture, spatial display, live translation, agent feedback, and local vision models.",
    stackZh: "官方写到 advanced on-device AI、up to 48 TOPS、LLM/LVM 支持、XR display pipeline 和 START 工具；媒体补充 CPU/GPU/NPU 与热效率提升。",
    stackEn: "Official sources state advanced on-device AI, up to 48 TOPS, LLM/LVM support, XR display pipeline, and START tools; media adds CPU/GPU/NPU and thermal-efficiency discussion.",
    useZh: "用例包括 photoreal avatars、spatial computing、AI agents、live translation、智能眼镜参考设计和 OEM 快速开发。",
    useEn: "Use cases include photoreal avatars, spatial computing, AI agents, live translation, smart-glasses reference design, and faster OEM development.",
    painZh: "它解决 XR 眼镜长期受制于云端、带宽、热、电池和开发碎片化的问题，但平台能力需要 OEM 产品证明。",
    painEn: "It addresses XR glasses being constrained by cloud dependence, bandwidth, heat, battery, and development fragmentation, but platform claims need OEM products to prove them.",
    techZh: "新技术是端侧 LLM/LVM、XR display pipeline、低功耗空间计算和 START reference design 被打包成一条设备制造路径。",
    techEn: "The new technology is packaging on-device LLM/LVM, XR display pipeline, low-power spatial computing, and START reference design into one device-making path.",
    availabilityZh: "平台已发布；具体终端、价格、地区、固件、SDK 版本和量产计划按各 OEM 后续官方发布。",
    availabilityEn: "The platform is announced; device SKUs, price, region, firmware, SDK version, and production plans depend on later OEM official announcements.",
    limitsZh: "未知是实际终端能否在轻量眼镜中同时满足性能、热、电池、重量和成本。",
    limitsEn: "The unknown is whether real devices can satisfy performance, heat, battery, weight, and cost at the same time in lightweight glasses.",
    verdictZh: "Verdict：这是今天所有眼镜产品的底层变量；它决定 AI eyewear 是否能从 demo 走向稳定日用。",
    verdictEn: "Verdict: this is the underlying variable for today’s glasses products; it determines whether AI eyewear can move from demo to stable daily use."
  }),
  product({
    id: "hush-voice-agent-noise",
    section: "wild",
    zhHeadline: "Hush：voice AI agent 的体验瓶颈从模型回答转到“听清谁在说话”",
    enHeadline: "Hush: voice-agent UX shifts from answer quality to hearing the right speaker",
    sourceDate: "2026-06-23",
    evidenceLabel: "startup signal",
    evidenceStrength: "medium / Product Hunt plus GitHub and model pages",
    visualName: "hush-voice-agent-noise.svg",
    visualTitle: "Hush",
    captionZh: "自绘音频管线图：speech enhancement、speaker suppression、CPU real-time、voice agent input；基于来源",
    captionEn: "Self-drawn audio pipeline: speech enhancement, speaker suppression, CPU real-time, voice-agent input; source-based",
    sources: [
      { label: "Product Hunt: Hush", url: "https://www.producthunt.com/products/hush-df34eafa-13f7-4d91-856f-162c2a9d81ee", type: "wild/startup" },
      { label: "GitHub: pulp-vision/Hush", url: "https://github.com/pulp-vision/Hush", type: "developer" },
      { label: "Hugging Face: weya-ai/hush", url: "https://huggingface.co/weya-ai/hush", type: "developer/model" }
    ],
    productName: "Hush",
    productTypeZh: "开源 startup/developer 产品：面向 voice AI agents 的 speech enhancement / background speaker suppression 模型。",
    productTypeEn: "Open-source startup / developer product: a speech-enhancement and background-speaker-suppression model for voice AI agents.",
    flowZh: "开发者把 Hush 放在实时通话或语音代理的音频输入前，先过滤背景说话人、环境噪声和干扰，再把更干净的语音交给 ASR/agent。",
    flowEn: "A developer places Hush before the audio input of a realtime call or voice agent, suppressing background speakers, environmental noise, and interference before ASR or agent processing.",
    stackZh: "来源写到 8 MB model、CPU real-time、10,000+ hours mixed audio、under 1 ms per 10 ms audio；部署细节和许可按仓库。",
    stackEn: "Sources state an 8 MB model, CPU realtime operation, 10,000+ hours of mixed audio, and under 1 ms processing per 10 ms audio; deployment and license details follow the repository.",
    useZh: "场景是客服、销售电话、医疗问诊、车内语音、会议代理、直播助手和任何多说话人/嘈杂环境里的 voice AI。",
    useEn: "Scenes include customer support, sales calls, healthcare intake, in-car voice, meeting agents, live assistants, and any multi-speaker or noisy voice-AI environment.",
    painZh: "它解决 voice agent 最基础但最容易被忽视的痛点：不是模型不会答，而是前端音频让模型听错人、漏听或把背景当指令。",
    painEn: "It addresses the most basic but often under-discussed voice-agent pain: the model may answer well, but the audio frontend makes it hear the wrong person, miss speech, or treat background talk as instruction.",
    techZh: "新技术信号是为 agent 输入而非普通降噪优化的小模型，把 cocktail-party problem 放进实时产品管线。",
    techEn: "The technology signal is a small model optimized for agent input rather than generic noise cancellation, bringing the cocktail-party problem into realtime product pipelines.",
    availabilityZh: "Product Hunt 今日发布；GitHub 和 Hugging Face 页面可访问。生产 SLA、企业支持、移动端 SDK、隐私合规 source not stated。",
    availabilityEn: "Launched on Product Hunt today; GitHub and Hugging Face pages are accessible. Production SLA, enterprise support, mobile SDKs, and privacy compliance are source not stated.",
    limitsZh: "未知是不同口音、重叠说话、电话压缩、远场麦克风、回声、端侧功耗和真实 agent 错误率。",
    limitsEn: "Unknowns include accents, overlapped speech, telephony compression, far-field microphones, echo, edge power consumption, and real agent error rates.",
    verdictZh: "Verdict：小而关键。AI voice 产品要先把“听见正确的人”做成可靠基础设施。",
    verdictEn: "Verdict: small but critical. Voice AI products must first make hearing the right speaker into reliable infrastructure."
  }),
  product({
    id: "openai-codex-windows-computer-use",
    section: "global",
    zhHeadline: "Codex Windows computer use：agent 从代码仓库走进真实桌面应用",
    enHeadline: "Codex Windows computer use: agents move from repositories into real desktop applications",
    sourceDate: "2026-05-29 / accessed 2026-06-23",
    evidenceLabel: "developer surface",
    evidenceStrength: "high / official changelog",
    visualName: "openai-codex-windows-computer-use.svg",
    visualTitle: "Codex Windows computer use",
    captionZh: "自绘流程图：Codex sees/clicks/types、Windows app、mobile/Mac remote steering；基于官方 changelog",
    captionEn: "Self-drawn flow: Codex sees/clicks/types, Windows app, mobile/Mac remote steering; official-changelog-based",
    sources: [
      { label: "OpenAI Developers: Codex changelog", url: "https://developers.openai.com/codex/changelog", type: "official/developer" },
      { label: "OpenAI: Codex for almost everything", url: "https://openai.com/index/codex-for-almost-everything/", type: "official" },
      { label: "Reddit r/codex: Windows update discussion", url: "https://www.reddit.com/r/codex/comments/1tras7t/codex_update_on_windows_seems_like_remote_and/", type: "community" }
    ],
    productName: "Codex computer use on Windows",
    productTypeZh: "开发者 surface：Codex app 在 Windows 上可看、点、输入并操作前台桌面应用，同时支持从移动端或 Mac 远程启动/查看进度。",
    productTypeEn: "Developer surface: the Codex app can see, click, and type in foreground Windows desktop apps, with remote start and progress checking from mobile or Mac.",
    flowZh: "用户给出任务，Codex 进入 Windows 前台应用，观察界面、点击控件、输入内容、运行验证，再把进度回传给移动端或 Mac 端。",
    flowEn: "The user gives a task; Codex enters foreground Windows apps, observes UI, clicks controls, types, runs verification, and reports progress back to mobile or Mac surfaces.",
    stackZh: "官方 changelog 写到 Windows 26.527、computer use、mobile remote control、profile usage stats；具体权限、隔离、日志保留和企业策略按产品文档。",
    stackEn: "The official changelog states Windows 26.527, computer use, mobile remote control, and profile usage stats; permission model, isolation, log retention, and enterprise policy depend on product docs.",
    useZh: "场景包括测试 Windows 桌面应用、调试没有 API 的 GUI、复现用户路径、跨设备启动任务和把前台操作交给 agent。",
    useEn: "Scenes include testing Windows desktop apps, debugging GUIs without APIs, reproducing user flows, starting work across devices, and delegating foreground operations to an agent.",
    painZh: "它解决开发者自动化无法触达真实桌面 UI 的问题，但把安全边界、前台占用和误操作恢复变得更重要。",
    painEn: "It solves the problem that developer automation cannot reach real desktop UI, while making security boundaries, foreground occupation, and recovery from wrong actions more important.",
    techZh: "新技术是视觉驱动 computer use 与 coding agent 工作流结合：agent 不只改文件，也能操作真实软件表面。",
    techEn: "The technology is visual computer use combined with coding-agent workflow: the agent no longer only edits files, it can operate real software surfaces.",
    availabilityZh: "官方 changelog 表示该功能已在 Windows Codex app 版本中上线；账号资格、地区和企业开关 source not stated。",
    availabilityEn: "The official changelog states availability in a Windows Codex app release; account eligibility, regions, and enterprise toggles are source not stated.",
    limitsZh: "未知是多窗口稳定性、权限提示、敏感数据处理、长任务恢复、错误点击撤销和用户同时操作冲突。",
    limitsEn: "Unknowns include multi-window stability, permission prompts, sensitive-data handling, long-task recovery, undo after wrong clicks, and conflict with simultaneous human operation.",
    verdictZh: "Verdict：这是软件产品里最接近 agentic OS 的真实进展；UX 关键是让用户知道 agent 正在哪里动手。",
    verdictEn: "Verdict: one of the clearest software moves toward an agentic OS; the UX key is letting the user know exactly where the agent is acting."
  }),
  product({
    id: "poke-messages-agent",
    section: "wild",
    zhHeadline: "Poke：AI agent 进入 Apple Messages for Business，把 agent 变成一条可验证的聊天线程",
    enHeadline: "Poke: AI agents enter Apple Messages for Business and become verifiable chat threads",
    sourceDate: "2026-06-04 / accessed 2026-06-23",
    evidenceLabel: "startup signal",
    evidenceStrength: "medium / startup page plus media report",
    visualName: "poke-messages-agent.svg",
    visualTitle: "Poke",
    captionZh: "自绘消息流：Apple Messages、SMS、Telegram、WhatsApp markets、rich actions；基于来源",
    captionEn: "Self-drawn message flow: Apple Messages, SMS, Telegram, WhatsApp markets, rich actions; source-based",
    sources: [
      { label: "Poke product page", url: "https://poke.com/", type: "startup/product" },
      { label: "TechCrunch: Poke approved for Apple Messages", url: "https://techcrunch.com/2026/06/04/apple-approves-poke-as-the-first-ai-agent-on-its-messages-for-business-platform/", type: "media" },
      { label: "TechCrunch: Poke agent over messages", url: "https://techcrunch.com/2026/04/08/poke-makes-ai-agents-as-easy-as-sending-a-text/", type: "media" }
    ],
    productName: "Poke",
    productTypeZh: "startup 产品：通过短信、Telegram、部分市场 WhatsApp 和 Apple Messages for Business 提供 AI agent 对话入口。",
    productTypeEn: "Startup product: an AI-agent conversational entry point over SMS, Telegram, selected-market WhatsApp, and Apple Messages for Business.",
    flowZh: "用户像发消息一样请求订餐、预约、购买、查询或执行小任务；agent 在同一线程里澄清、调用服务、给出选择和确认结果。",
    flowEn: "The user requests ordering, booking, purchasing, lookup, or small tasks as a message; the agent clarifies, calls services, presents options, and confirms outcome inside the same thread.",
    stackZh: "来源写到 Apple Messages for Business approval、SMS/Telegram、Linq 方案和部分 WhatsApp 受限市场；具体 API、支付、身份和数据保留 source not stated。",
    stackEn: "Sources state Apple Messages for Business approval, SMS/Telegram, Linq, and limited-market WhatsApp support; API, payments, identity, and data retention are source not stated.",
    useZh: "场景是用户不想下载 app 或打开网页时，把低频但高摩擦任务放进已经信任的消息渠道。",
    useEn: "The scene is when a user does not want another app or webpage and wants low-frequency but high-friction tasks inside an already trusted messaging channel.",
    painZh: "它解决 app fatigue 和 agent 入口分散的问题，但会遇到平台政策、验证身份、支付确认和人工转接。",
    painEn: "It addresses app fatigue and fragmented agent entry points, but faces platform policy, identity verification, payment confirmation, and human handoff issues.",
    techZh: "新技术不是模型本身，而是把 agent 绑定到 verified business messaging surface，让交互天然有历史记录和通知机制。",
    techEn: "The new technology is less the model than binding the agent to a verified business messaging surface, where interaction naturally has history and notification mechanics.",
    availabilityZh: "来源显示 Apple Messages for Business 入口已获批；具体国家、企业接入、费用和失败 SLA source not stated。",
    availabilityEn: "Sources show the Apple Messages for Business entry is approved; countries, merchant onboarding, pricing, and failure SLA are source not stated.",
    limitsZh: "未知是平台政策变化、跨渠道状态同步、付款安全、agent 越权和用户如何把任务交回真人。",
    limitsEn: "Unknowns include platform-policy changes, cross-channel state sync, payment safety, agent overreach, and handoff back to humans.",
    verdictZh: "Verdict：Poke 把 agent 放到用户已经每天打开的 thread 里，比独立 app 更接近真实分发。",
    verdictEn: "Verdict: Poke puts agents inside threads users already open every day, making distribution more plausible than a standalone app."
  }),
  product({
    id: "china-ai-glasses-privacy-market",
    section: "china",
    zhHeadline: "中国 AI 眼镜：显示、翻译、支付和隐私摩擦同时进入大众市场",
    enHeadline: "China AI glasses: display, translation, payment, and privacy friction enter the mass market together",
    sourceDate: "2026-06-23",
    evidenceLabel: "review/community friction",
    evidenceStrength: "medium / China media scan with product examples",
    visualName: "china-ai-glasses-privacy-market.svg",
    visualTitle: "China AI glasses market",
    captionZh: "自绘市场图：讯飞、千问、Rokid、雷鸟、隐私/考场/遮光贴摩擦；基于中文媒体来源",
    captionEn: "Self-drawn market map: iFLYTEK, Qianwen, Rokid, Thunderbird, privacy/exam/sticker friction; China-media-based",
    sources: [
      { label: "36Kr: 智能眼镜 618 期中考", url: "https://m.36kr.com/p/3848908181043845", type: "china/media" },
      { label: "36Kr: AI眼镜赛道全面起势", url: "https://m.36kr.com/p/3855201250507656", type: "china/media" },
      { label: "36Kr: 智能眼镜隐私摩擦", url: "https://www.36kr.com/p/3854356284134406", type: "china/media/community friction" }
    ],
    productName: "China AI glasses lane",
    productTypeZh: "中国市场产品 dossier：不是单一新品，而是讯飞、千问、Rokid、雷鸟等 AI 眼镜在显示、翻译、办公、生活服务和隐私上的集中信号。",
    productTypeEn: "China-market product dossier: not one new SKU, but a cluster of iFLYTEK, Qianwen, Rokid, Thunderbird and other AI glasses signals around display, translation, office work, local services, and privacy.",
    flowZh: "用户戴上眼镜后通过语音、近眼字幕、拍摄、翻译、导航、提词、扫码支付或生活服务完成碎片任务；部分产品强调商务会议、跨语言沟通和生态闭环。",
    flowEn: "A wearer uses voice, near-eye subtitles, capture, translation, navigation, teleprompter, QR payment, or local services to complete fragmented tasks; some products emphasize business meetings, cross-language communication, and ecosystem closure.",
    stackZh: "中文媒体写到双目单色显示、视觉唇动识别降噪、122 种语言互译、行业词库、生态服务接入等；具体单品规格须回到各厂商官方页。",
    stackEn: "Chinese media mentions binocular monochrome display, visual lip-movement noise reduction, translation across 122 languages, industry dictionaries, and ecosystem-service access; exact SKU specs must return to each maker's official pages.",
    useZh: "用例包括展会、采访、会议、跨语言商务、导航、外卖/快递/支付、内容记录和高频生活任务。",
    useEn: "Use cases include exhibitions, interviews, meetings, cross-language business, navigation, food delivery, parcel lookup, payment, content capture, and frequent local-life tasks.",
    painZh: "它解决手机翻译、会议记录和生活服务入口的切换问题，但也把偷拍、考试作弊、录制提示遮挡和公众不信任放大。",
    painEn: "It addresses switching across phone translation, meeting notes, and local-service entry points, but amplifies stealth recording, exam cheating, capture-light blocking, and public distrust.",
    techZh: "新技术在于光波导显示、多模态 AI、语音/视觉降噪与本地生活生态结合，而不是单纯堆硬件参数。",
    techEn: "The technology is waveguide display, multimodal AI, audio/visual noise reduction, and local-life ecosystem integration, not hardware spec stacking alone.",
    availabilityZh: "来源显示多品牌已进入线上销售和 618 节点；每个 SKU 的价格、库存、售后和地区以厂商/电商页面为准。",
    availabilityEn: "Sources indicate multiple brands are already in online sales and the 618 shopping-cycle context; each SKU's price, inventory, support, and region depend on maker or retailer pages.",
    limitsZh: "未知是长期复购、真实留存、隐私监管、学校/公共场景限制和生态服务是否足够高频。",
    limitsEn: "Unknowns include repeat purchase, retention, privacy regulation, school/public-space restrictions, and whether ecosystem services are frequent enough.",
    verdictZh: "Verdict：中国 lane 说明 AI 眼镜已经从科技尝鲜进入社会摩擦测试，隐私 UX 变成购买理由的一部分。",
    verdictEn: "Verdict: the China lane shows AI glasses moving from tech novelty into social-friction testing, where privacy UX becomes part of the purchase reason."
  }),
  product({
    id: "lorika-ontop-smart-glasses-fashion",
    section: "reviews",
    zhHeadline: "Lorika Ontop：智能眼镜开始出现“手机壳式”外观与保护配件",
    enHeadline: "Lorika Ontop: smart glasses get phone-case-like customization and protection",
    sourceDate: "2026-06-23",
    evidenceLabel: "startup signal",
    evidenceStrength: "medium / WIRED product report",
    visualName: "lorika-ontop-smart-glasses-fashion.svg",
    visualTitle: "Lorika Ontop",
    captionZh: "自绘配件图：Ray-Ban Meta Wayfarer cover、camera/speaker clearance、style/protection layer；基于 WIRED",
    captionEn: "Self-drawn accessory diagram: Ray-Ban Meta Wayfarer cover, camera/speaker clearance, style/protection layer; WIRED-based",
    sources: [
      { label: "WIRED: Lorika Ontop cases", url: "https://www.wired.com/story/lorika-ontop-cases-for-smart-glasses-now/", type: "review/media" },
      { label: "Meta AI glasses product page", url: "https://www.meta.com/ai-glasses/ray-ban-meta/", type: "official/product" },
      { label: "Ray-Ban Meta product page", url: "https://www.ray-ban.com/usa/ray-ban-meta-ai-glasses", type: "official/product" }
    ],
    productName: "Lorika Ontop",
    productTypeZh: "startup 配件产品：给 Ray-Ban Meta Wayfarer 智能眼镜使用的彩色 clip-on frame cover，定位类似手机壳。",
    productTypeEn: "Startup accessory product: colorful clip-on frame covers for Ray-Ban Meta Wayfarer smart glasses, positioned like phone cases for eyewear.",
    flowZh: "用户把 cover 卡到智能眼镜外框，改变颜色和保护外观，同时不遮挡相机和扬声器；本体 AI 功能仍由 Ray-Ban Meta/Meta AI glasses 提供。",
    flowEn: "The user clips the cover onto the smart-glasses frame to change color and protect the exterior while leaving cameras and speakers unobstructed; AI functions remain provided by Ray-Ban Meta / Meta AI glasses.",
    stackZh: "WIRED 写到 polycarbonate、elastic polymer、1mm thickness、35-40 美元、适配一二代 Wayfarer Ray-Ban Meta；其他型号计划 source not stated。",
    stackEn: "WIRED states polycarbonate, elastic polymer, one-millimeter thickness, $35-$40 pricing, and fit for first- and second-generation Wayfarer Ray-Ban Meta; other-model plans are source not stated.",
    useZh: "场景是把智能眼镜从黑色科技外观带入日常穿搭、保护和个性化，尤其面向已经把眼镜当每天配饰的人。",
    useEn: "The scene is moving smart glasses from black-tech look into everyday styling, protection, and personalization, especially for people who already treat eyewear as daily fashion.",
    painZh: "它解决智能眼镜外观单一、损坏焦虑和社交可接受性问题；这说明 wearable AI 的 UX 不只在屏幕和模型，也在物件审美。",
    painEn: "It addresses limited style choice, damage anxiety, and social acceptability; it shows wearable-AI UX is not only screens and models, but object aesthetics.",
    techZh: "新技术不在 AI，而在配件生态：相机、扬声器和传感器不能被遮挡，保护层必须服从智能硬件的感知边界。",
    techEn: "The new technology is not AI but accessory ecology: cameras, speakers, and sensors cannot be blocked, so the protective layer must respect sensing boundaries.",
    availabilityZh: "WIRED 今日报道上线；官网直销、库存、颜色、国际配送和售后 source not stated。",
    availabilityEn: "WIRED reports the launch today; direct-store availability, stock, colors, international shipping, and support are source not stated.",
    limitsZh: "未知是 fit 公差、长期刮擦、散热、麦克风影响、充电盒兼容和是否会遮挡隐私提示。",
    limitsEn: "Unknowns include fit tolerance, long-term scratches, heat, microphone impact, charging-case compatibility, and whether privacy cues can be obscured.",
    verdictZh: "Verdict：小配件释放大信号：AI 眼镜要大众化，必须进入时尚、保护和可替换外观生态。",
    verdictEn: "Verdict: a small accessory with a large signal: AI glasses need fashion, protection, and swappable appearance ecosystems to mainstream."
  }),
  product({
    id: "visionclaw-research-agent-glasses",
    section: "research",
    zhHeadline: "VisionClaw：论文把 always-on 眼镜 agent 的“感知 + 执行”链路做成可研究原型",
    enHeadline: "VisionClaw: research prototypes the perception-plus-execution loop for always-on glasses agents",
    sourceDate: "2026-04 / accessed 2026-06-23",
    evidenceLabel: "research signal",
    evidenceStrength: "medium / arXiv and ACM-adjacent HCI research",
    visualName: "visionclaw-research-agent-glasses.svg",
    visualTitle: "VisionClaw",
    captionZh: "自绘研究机制图：egocentric perception、Gemini Live、OpenClaw、speech delegation、task execution；基于 arXiv",
    captionEn: "Self-drawn research mechanism: egocentric perception, Gemini Live, OpenClaw, speech delegation, task execution; arXiv-based",
    sources: [
      { label: "arXiv: VisionClaw", url: "https://arxiv.org/abs/2604.03486", type: "research" },
      { label: "arXiv HTML: VisionClaw", url: "https://arxiv.org/html/2604.03486v2", type: "research" },
      { label: "ACM: Conversational breakdowns in smart glasses", url: "https://dl.acm.org/doi/10.1145/3772363.3798378", type: "research" }
    ],
    productName: "VisionClaw",
    productTypeZh: "研究原型：运行在 Meta Ray-Ban smart glasses 上的 always-on wearable AI agent，不是商业产品。",
    productTypeEn: "Research prototype: an always-on wearable AI agent running on Meta Ray-Ban smart glasses, not a commercial product.",
    flowZh: "眼镜持续感知第一视角上下文，用户用语音发起任务，系统通过 Gemini Live / OpenClaw 把物体加入购物车、从纸质文档生成笔记、从海报创建日程或控制 IoT。",
    flowEn: "The glasses continuously perceive egocentric context; the user starts tasks by speech; Gemini Live / OpenClaw can add objects to a cart, create notes from paper documents, create events from posters, or control IoT.",
    stackZh: "论文写到 Meta Ray-Ban smart glasses、live egocentric perception、Gemini Live、OpenClaw、controlled lab study 和 deployment study；研究样本和实现边界按论文。",
    stackEn: "The paper states Meta Ray-Ban smart glasses, live egocentric perception, Gemini Live, OpenClaw, controlled lab study, and deployment study; sample and implementation limits follow the paper.",
    useZh: "场景是 hands-free、situated、opportunistic task delegation：用户不必停下当前活动就能把现实中的对象和任务交给 agent。",
    useEn: "The scenario is hands-free, situated, opportunistic task delegation: the user does not stop the current activity to hand real-world objects and tasks to an agent.",
    painZh: "它解决可穿戴 AI 只能回答问题、不能执行任务的断层，但也暴露持续感知、误触发、隐私和用户控制权问题。",
    painEn: "It addresses the gap where wearable AI can answer questions but not execute tasks, while exposing continuous sensing, false triggers, privacy, and user-control issues.",
    techZh: "新技术是连续第一视角感知与通用 agentic execution 的耦合，使任务在现实上下文中被 opportunistically initiated。",
    techEn: "The new technology is coupling continuous egocentric perception with general-purpose agentic execution so tasks can be opportunistically initiated in real-world context.",
    availabilityZh: "研究论文可访问；代码、商业化、数据集许可、硬件兼容和长期部署 source not stated 或以论文为准。",
    availabilityEn: "The research paper is accessible; code, commercialization, dataset license, hardware compatibility, and long-term deployment are source not stated or paper-bound.",
    limitsZh: "未知是规模化、隐私合规、模型错误责任、能耗、长时间佩戴和用户是否愿意让眼镜 always-on。",
    limitsEn: "Unknowns include scale, privacy compliance, model-error accountability, energy use, long wear, and whether users accept always-on glasses.",
    verdictZh: "Verdict：不能写成产品发布，但它给 Snap、Meta、Google、XREAL 这类硬件提供了明确 HCI 压力测试。",
    verdictEn: "Verdict: not a product launch, but a clear HCI stress test for Snap, Meta, Google, XREAL and similar hardware."
  }),
  scan({
    id: "community-smart-glasses-friction-scan",
    section: "community",
    zhHeadline: "社区摩擦 scan：今天没有提升为确认产品的新硬件，但隐私、价格和佩戴焦虑继续升温",
    enHeadline: "Community friction scan: no new hardware promoted today, but privacy, price, and wear anxiety keep rising",
    sourceDate: "accessed 2026-06-23",
    evidenceLabel: "review/community friction",
    evidenceStrength: "low-medium / community only",
    visualName: "community-smart-glasses-friction-scan.svg",
    visualTitle: "Community smart-glasses friction",
    captionZh: "自绘摩擦雷达：privacy、price、battery、compatibility、recording cue；基于 Reddit/社区扫描",
    captionEn: "Self-drawn friction radar: privacy, price, battery, compatibility, recording cue; based on Reddit/community scan",
    sources: [
      { label: "Reddit: Snap Specs coming soon", url: "https://www.reddit.com/r/augmentedreality/comments/1ttq6jb/snap_specs_coming_soon/", type: "community" },
      { label: "Reddit: VITURE Helix discussion", url: "https://www.reddit.com/r/VITURE/comments/1u7m246/ai_safety_glasses_viture_helix/", type: "community" },
      { label: "Reddit: AI smart glasses wearable computers", url: "https://www.reddit.com/r/AIGuild/comments/1tztznn/smart_glasses_are_turning_into_wearable_ai/", type: "community" }
    ],
    zh: "扫描 Reddit/社区后，没有把任何社区帖提升为确认产品事实；社区价值是摩擦提示：价格是否过高、录制提示是否可信、佩戴是否尴尬、生态是否足够、以及 coding/agent workflow 放到眼镜是否真的减少负担。",
    en: "After scanning Reddit and community threads, no community post is promoted as confirmed product fact. The value is friction evidence: whether price is too high, recording cues are trustworthy, wearing the device is socially awkward, the ecosystem is sufficient, and glasses-based coding or agent workflow reduces burden."
  }),
  scan({
    id: "patent-xr-ai-companion-watch",
    section: "patent",
    zhHeadline: "专利 watch：XR AI companion 仍是方向信号，不是发布事实",
    enHeadline: "Patent watch: XR AI companions remain direction signals, not launch facts",
    sourceDate: "accessed 2026-06-23",
    evidenceLabel: "patent signal",
    evidenceStrength: "low / patent only",
    visualName: "patent-xr-ai-companion-watch.svg",
    visualTitle: "XR AI companion patent lane",
    captionZh: "自绘专利雷达：smartglasses、watch、phone、AI answer、XR content context；专利信号非产品确认",
    captionEn: "Self-drawn patent radar: smartglasses, watch, phone, AI answer, XR content context; patent signal only",
    sources: [
      { label: "Google Patents: smartglasses AI/AR", url: "https://patents.google.com/patent/US10908419B2/en", type: "patent" },
      { label: "Patentlyze: Google AI content companion for XR", url: "https://patentlyze.com/patent/google-ai-content-companion-xr-devices/", type: "patent/media" }
    ],
    zh: "专利 lane 扫描到 smartglasses、watch、phone 与 AI/AR context 的组合，以及 XR 内容 companion 的二级专利报道；这些只能说明公司在探索感知、解释和问答的保护范围，不能说明产品、价格、发布日期、地区或规格。",
    en: "The patent lane found smartglasses, watch, phone, and AI/AR-context combinations, plus secondary reporting on XR content companions. These signals show exploration of sensing, interpretation, and question-answering claim scope; they do not prove product, price, launch date, region, or specs."
  })
];

const issue = {
  date,
  timezone: "America/Toronto",
  zhTitle: "周二版：AI 眼镜进入社会压力测试，语音与桌面 agent 补齐真实输入层",
  enTitle: "Tuesday issue: AI glasses enter social stress tests while voice and desktop agents repair real input layers",
  zhSummary: "今天的主线不是模型参数，而是入口迁移：眼镜把 AI 放到脸上，语音 agent 先解决听清楚，桌面 agent 开始操作真实 Windows 应用。",
  enSummary: "Today’s main line is not model size but entry-point migration: glasses put AI on the face, voice agents first solve hearing, and desktop agents begin operating real Windows applications.",
  tags: ["HCI", "AI hardware", "smart glasses", "voice agents", "computer use", "on-device AI", "XR"],
  sourceTypes: ["official", "reviews", "community", "wild", "research", "patent", "china", "global"],
  zhPath: `/ai-daily/${date}/zh/`,
  enPath: `/ai-daily/${date}/en/`,
  sourcesPath: `/ai-daily/${date}/sources.md`,
  coverStory: {
    topicId: "snap-specs-near-eye-os",
    zhTitle: "封面故事：AI 眼镜不再只是拍摄配件，而是眼前的操作系统候选",
    enTitle: "Cover story: AI glasses are no longer camera accessories; they are candidates for a near-eye operating system",
    zhSummary: [
      "Snap Specs、VITURE Helix、Qualcomm Reality Elite 和中国 AI 眼镜信号共同指向同一件事：AI 的默认入口正在从手机屏幕移向眼镜。",
      "这会同时带来更低摩擦的上下文输入和更高风险的社会界面：旁人隐私、录制提示、价格、佩戴时长、热量和失败接管。",
      "本期把 confirmed product、developer surface、startup signal、research signal、patent signal 分开，避免把论文、社区热度或专利写成产品事实。"
    ],
    enSummary: [
      "Snap Specs, VITURE Helix, Qualcomm Reality Elite, and China AI-glasses signals point to one shift: the default AI entry point is moving from phone screen to eyewear.",
      "That brings lower-friction context input and a higher-risk social interface at the same time: bystander privacy, recording cues, price, wear time, heat, and failure takeover.",
      "This issue separates confirmed products, developer surfaces, startup signals, research signals, and patent signals so papers, community heat, and patents do not become false product facts."
    ],
    imagePath: "assets/snap-specs-near-eye-os.svg",
    imageWidth: 1200,
    imageHeight: 760,
    imageSourceUrl: "https://newsroom.snap.com/introducing-specs-augmented-reality-glasses",
    primarySourceUrl: "https://newsroom.snap.com/introducing-specs-augmented-reality-glasses",
    evidenceStrength: "confirmed product · official/developer/media sources",
    whyCover: "AI glasses concentrate today’s interface questions into one visible wearable boundary."
  },
  topics,
  watchlistZh: [
    "Snap Specs：等待 fall 2026 真机评测验证重量、续航、热量、旁人隐私提示和 Lens 生态。",
    "VITURE Helix：观察企业试点是否公开流程指标、合规边界和错误责任设计。",
    "Hush：跟踪 GitHub/Hugging Face 后续 release，重点看真实通话中的误听率和端侧部署。",
    "中国 AI 眼镜：继续区分销量/618 热度、隐私摩擦和确认产品规格。"
  ],
  watchlistEn: [
    "Snap Specs: wait for fall 2026 hands-on validation of weight, battery, heat, bystander cues, and Lens ecosystem.",
    "VITURE Helix: watch whether enterprise pilots publish workflow metrics, compliance boundaries, and error-accountability design.",
    "Hush: track GitHub/Hugging Face releases, especially real-call mishearing rates and edge deployment.",
    "China AI glasses: keep sales/618 heat, privacy friction, and confirmed SKU specs separate."
  ]
};

function svg(title, subtitle, cols) {
  const blocks = cols
    .map((col, i) => {
      const x = 70 + i * 365;
      return `<g><rect x="${x}" y="255" width="310" height="300" rx="18" fill="#ffffff" stroke="#111827" stroke-width="3"/><text x="${x + 24}" y="305" font-size="28" font-weight="700" fill="#111827">${col.title}</text>${col.items
        .map((item, j) => `<text x="${x + 24}" y="${360 + j * 52}" font-size="24" fill="#374151">${item}</text>`)
        .join("")}</g>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760"><rect width="1200" height="760" fill="#f8fafc"/><rect x="34" y="34" width="1132" height="692" rx="28" fill="#eef2ff" stroke="#111827" stroke-width="4"/><text x="70" y="115" font-size="48" font-weight="800" fill="#111827">${title}</text><text x="70" y="170" font-size="28" fill="#374151">${subtitle}</text>${blocks}<text x="70" y="655" font-size="22" fill="#475569">Source-based diagram for AI Daily ${date}; not a product render unless source states otherwise.</text></svg>`;
}

const diagrams = {
  "snap-specs-near-eye-os.svg": svg("Snap Specs", "Near-eye OS candidate: display, camera, Lens runtime, privacy cue", [
    { title: "Wearer", items: ["voice + spatial input", "near-eye feedback", "phone less central"] },
    { title: "Platform", items: ["Snap OS", "Lens developer surface", "AI assistance"] },
    { title: "Trust", items: ["recording cue", "bystander visibility", "failure takeover"] }
  ]),
  "viture-helix-work-ai-glasses.svg": svg("VITURE Helix", "Work AI glasses: first-person sensing plus NVIDIA XR AI", [
    { title: "Sensors", items: ["12MP camera", "4 microphones", "standalone signal"] },
    { title: "AI", items: ["NVIDIA XR AI", "workflow coaching", "safety guidance"] },
    { title: "Work", items: ["lab", "industrial", "clinical"] }
  ]),
  "qualcomm-reality-elite-start.svg": svg("Reality Elite / START", "On-device AI and reference tools for XR wearables", [
    { title: "Silicon", items: ["up to 48 TOPS", "LLM/LVM", "thermal budget"] },
    { title: "XR", items: ["display pipeline", "tracking", "translation"] },
    { title: "OEM", items: ["START toolkit", "reference design", "device partners"] }
  ]),
  "hush-voice-agent-noise.svg": svg("Hush", "Voice agent input layer: suppress background speakers before ASR", [
    { title: "Audio", items: ["real-time call", "background voices", "noise"] },
    { title: "Model", items: ["8 MB", "CPU realtime", "speech enhancement"] },
    { title: "Agent", items: ["cleaner ASR", "fewer false commands", "better handoff"] }
  ]),
  "openai-codex-windows-computer-use.svg": svg("Codex Windows Computer Use", "Agent sees, clicks, and types in foreground desktop apps", [
    { title: "User", items: ["mobile/Mac start", "progress check", "approval"] },
    { title: "Codex", items: ["see", "click", "type"] },
    { title: "Windows", items: ["desktop apps", "tests", "debug flows"] }
  ]),
  "poke-messages-agent.svg": svg("Poke", "AI agent inside verified messaging threads", [
    { title: "Entry", items: ["Apple Messages", "SMS", "Telegram"] },
    { title: "Agent", items: ["clarify", "book/order", "confirm"] },
    { title: "Risk", items: ["identity", "payment", "handoff"] }
  ]),
  "china-ai-glasses-privacy-market.svg": svg("China AI Glasses", "Display, translation, local services, and privacy friction", [
    { title: "Products", items: ["iFLYTEK", "Qianwen", "Rokid/Thunderbird"] },
    { title: "Flows", items: ["translation", "payment", "meetings"] },
    { title: "Friction", items: ["privacy", "exam bans", "recording cue"] }
  ]),
  "lorika-ontop-smart-glasses-fashion.svg": svg("Lorika Ontop", "Smart-glasses cases: style layer without blocking sensors", [
    { title: "Accessory", items: ["clip-on frame", "polycarbonate", "elastic polymer"] },
    { title: "Constraints", items: ["camera clear", "speaker clear", "case fit"] },
    { title: "UX", items: ["fashion", "protection", "acceptance"] }
  ]),
  "visionclaw-research-agent-glasses.svg": svg("VisionClaw", "Always-on wearable agent: perception plus execution", [
    { title: "Perception", items: ["egocentric view", "Meta Ray-Ban", "continuous context"] },
    { title: "Agent", items: ["Gemini Live", "OpenClaw", "speech delegation"] },
    { title: "Tasks", items: ["cart", "notes", "calendar/IoT"] }
  ]),
  "community-smart-glasses-friction-scan.svg": svg("Community Friction", "Community evidence is friction, not confirmed fact", [
    { title: "Topics", items: ["price", "privacy", "wearability"] },
    { title: "Signals", items: ["Reddit threads", "skepticism", "use cases"] },
    { title: "Need", items: ["official proof", "reviews", "long-term use"] }
  ]),
  "patent-xr-ai-companion-watch.svg": svg("Patent Watch", "Patent signals are directions, not launches", [
    { title: "Claims", items: ["smartglasses", "watch/phone", "XR content"] },
    { title: "AI", items: ["context", "answer", "companion"] },
    { title: "Boundary", items: ["no product", "no price", "no launch date"] }
  ])
};

await fs.mkdir(assetDir, { recursive: true });
for (const [name, contents] of Object.entries(diagrams)) {
  await fs.writeFile(path.join(assetDir, name), contents);
}

const slides = `---
theme: default
title: AI Product Morning Brief ${date}
aspectRatio: 16/9
---

# AI Daily ${date}

Chinese-first magazine issue with equally dense English publication.

- Cover: Snap Specs and near-eye operating systems
- Lanes: official, reviews, community, wild, research, patent, china, global
- Truth surface: GitHub Pages paged magazine

---

# Source Radar

Snap Specs, VITURE Helix, Qualcomm Reality Elite / START, Hush, Codex Windows computer use, Poke, China AI glasses, Lorika Ontop, VisionClaw, community friction, and patent watch.

---

# Evidence Rules

Confirmed products, developer surfaces, startup signals, community friction, research signals, and patent signals remain separated. Specs, prices, regions, and availability are source-backed or marked source not stated.
`;
await fs.mkdir(deckDir, { recursive: true });
await fs.writeFile(path.join(deckDir, "slides.md"), slides);
await fs.writeFile(
  path.join(deckDir, "package.json"),
  JSON.stringify({ scripts: { build: "slidev build --base ./ --out dist" }, dependencies: { "@slidev/cli": "^0.50.0", "@slidev/theme-default": "^0.25.0", "vue": "^3.4.0" }, devDependencies: {} }, null, 2)
);
await fs.writeFile(path.join(deckDir, "sources.md"), "# AI Daily Slidev source ledger\n\nThe public source ledger is generated in /Users/hmi/Documents/ai-daily after render.\n");

const issuesPath = path.join(root, "data", "issues.json");
const issues = JSON.parse(await fs.readFile(issuesPath, "utf8"));
const nextIssues = [issue, ...issues.filter((item) => item.date !== date)].sort((a, b) => a.date.localeCompare(b.date));
await fs.writeFile(issuesPath, `${JSON.stringify(nextIssues, null, 2)}\n`);

console.log(`Created ${date} issue with ${topics.length} topics and ${Object.keys(diagrams).length} diagrams.`);
