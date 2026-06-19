import fs from "node:fs/promises";
import path from "node:path";

const siteRoot = path.resolve(new URL("..", import.meta.url).pathname);
const surveyRoot = "/Users/hmi/Documents/Survey";
const date = "2026-06-19";
const assetDir = path.join(siteRoot, date, "assets");
const slidevDir = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${date}`);
const slidevAssetDir = path.join(slidevDir, "public", "assets");

const sources = {
  snap: "https://www.spectacles.com/spectacles/",
  snapDev: "https://developers.snap.com/spectacles",
  snapVerge: "https://www.theverge.com/2026/6/10/24439740/snap-spectacles-ar-glasses-price-launch",
  xreal: "https://www.xreal.com/aura/",
  googleXr: "https://blog.google/products/android/android-xr-xreal-project-aura/",
  qualcomm: "https://www.qualcomm.com/news/releases/2026/06/qualcomm-unveils-snapdragon-reality-elite-platform",
  qualcommStart: "https://www.qualcomm.com/developer/software/snapdragon-spaces/start",
  metaBusiness: "https://developers.facebook.com/blog/post/2026/06/17/business-ai-agent/",
  metaWhatsApp: "https://www.whatsapp.com/business/ai",
  googleShopping: "https://blog.google/products/shopping/google-shopping-agentic-checkout-universal-cart/",
  googleAp2: "https://developers.googleblog.com/en/agent-payments-protocol-ap2/",
  wired: "https://www.wired.com/story/snap-spectacles-2026-hands-on/",
  uploadvr: "https://www.uploadvr.com/xreal-aura-android-xr-glasses/",
  redditXreal: "https://www.reddit.com/r/Xreal/",
  productHunt: "https://www.producthunt.com/products/viture-pro-xr-glasses",
  viture: "https://www.viture.com/product/viture-pro-xr-glasses",
  research: "https://arxiv.org/abs/2605.09612",
  patent: "https://patents.google.com/?q=(smart+glasses+ai+assistant+gesture+display)&dups=language",
  kr36: "https://36kr.com/search/articles/AI%E7%9C%BC%E9%95%9C",
  sspai: "https://sspai.com/search/article?q=AI%20%E7%9C%BC%E9%95%9C",
  hn: "https://news.ycombinator.com/item?id=44277548",
  androidCentral: "https://www.androidcentral.com/gaming/virtual-reality/xreal-project-aura-android-xr-announcement"
};

function svg(title, subtitle, chips) {
  const chipMarkup = chips
    .map((chip, index) => {
      const x = 70 + (index % 2) * 520;
      const y = 430 + Math.floor(index / 2) * 96;
      return `<rect x="${x}" y="${y}" width="450" height="58" rx="18" fill="#fff" stroke="#d8d2ca"/><text x="${x + 24}" y="${y + 37}" font-size="23" font-weight="700" fill="#2f2a26">${escapeXml(chip)}</text>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760">
  <rect width="1200" height="760" rx="46" fill="#fffdfa"/>
  <rect x="38" y="38" width="1124" height="684" rx="36" fill="#f6f4ef" stroke="#e5ded6"/>
  <circle cx="1010" cy="156" r="86" fill="#c7000b" opacity="0.12"/>
  <circle cx="960" cy="218" r="42" fill="#c7000b" opacity="0.16"/>
  <text x="70" y="140" font-family="Aptos, Arial, sans-serif" font-size="58" font-weight="900" fill="#171413">${escapeXml(title)}</text>
  <text x="70" y="202" font-family="Aptos, Arial, sans-serif" font-size="27" font-weight="650" fill="#5f5851">${escapeXml(subtitle)}</text>
  <rect x="70" y="268" width="330" height="90" rx="28" fill="#2f2234"/>
  <text x="100" y="324" font-family="Aptos, Arial, sans-serif" font-size="30" font-weight="850" fill="#fff">AI Daily Evidence</text>
  <path d="M430 312 C560 245 670 380 800 310 S1030 300 1110 230" fill="none" stroke="#c7000b" stroke-width="10" stroke-linecap="round"/>
  <path d="M430 350 C600 440 720 300 880 390 S1030 450 1110 392" fill="none" stroke="#2f2234" stroke-width="7" stroke-linecap="round" opacity="0.72"/>
  ${chipMarkup}
</svg>`;
}

function escapeXml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

const topics = [
  {
    id: "snap-specs-standalone-ar",
    section: "official",
    label: "confirmed product",
    strength: "high / official product and developer surface",
    date: "accessed 2026-06-19",
    image: ["snap-specs-ar.svg", "Snap Specs AR glasses", "standalone AR glasses · Snap OS · developer kit"],
    sources: [
      ["Snap Specs", sources.snap, "official"],
      ["Snap Spectacles developers", sources.snapDev, "developer docs"],
      ["The Verge", sources.snapVerge, "review/media"]
    ],
    zhHeadline: "Snap Specs：把 AR 眼镜从手机外设推向独立 AI 设备",
    enHeadline: "Snap Specs: AR glasses move from phone accessory toward standalone AI device",
    productName: "Snap Specs",
    productType: ["面向开发者和早期消费者的独立 AR 眼镜，来源显示它运行 Snap OS，面向 Lens / Spectacles 开发者，并以眼镜本体作为相机、显示、语音和空间输入的入口。", "A standalone AR glasses product for developers and early consumers. The source set presents Snap OS, Lens/Spectacles developer tooling, and the glasses body as the camera, display, voice, and spatial input surface."],
    flow: ["用户戴上眼镜后，通过语音、手势、空间内容和相机感知调用 Lens 或 AR 应用；手机不是主要界面，眼前显示负责结果，开发者通过 Snap 的 Spectacles tooling 打包体验。", "The user wears the glasses, invokes Lens or AR apps through voice, hand or spatial input, and sees results in the near-eye display. The phone is not the primary interaction surface; developer tooling packages the experience for Spectacles."],
    stack: ["已披露栈包括 Snap OS、Spectacles developer surface、相机/显示/空间交互能力；具体芯片、重量、电池、显示亮度和量产区域以来源页面为准，未在来源中明确的规格写作 source not stated。", "The disclosed stack includes Snap OS, the Spectacles developer surface, cameras, display, and spatial interaction. Exact chipset, weight, battery, brightness, and launch-region details are source-bound; any missing specification remains source not stated."],
    cases: ["适合 hands-free messaging、空间导航、协作式 Lens、实时捕捉、轻量创作和面向开发者的 AR prototyping；HCI 价值在于用户不用先掏出手机再选择应用。", "Concrete uses include hands-free messaging, spatial navigation, collaborative Lens experiences, real-time capture, lightweight creation, and AR prototyping. The HCI value is reducing the phone-unlock and app-picking step."],
    pain: ["它解决的是“手机先行”的 AR 摩擦：拿起设备、打开 App、对准环境、再解释上下文。眼镜把输入和环境绑定，降低了从看到问题到触发操作的路径长度。", "It addresses phone-first AR friction: pick up device, open app, aim at the scene, then explain context. Glasses bind input to environment and shorten the path from noticing something to acting on it."],
    tech: ["新技术信号是 OS 级 AR shell 与开发者 Lens surface 合并，AI/视觉/空间输入进入同一个 wearable loop；这不是单个 camera gadget，而是 wearable app platform。", "The new technology signal is the merge of OS-level AR shell and developer Lens surface, placing AI, vision, and spatial input in one wearable loop. It is closer to a wearable app platform than to a camera gadget."],
    availability: ["官方页面和开发者页面为确认来源；具体购买资格、地区、交付批次、价格和消费者开放节奏需以 Snap 当前页面为准，来源未声明处不推断。", "The official and developer pages confirm the product surface. Purchase eligibility, regions, delivery batches, price, and consumer rollout must follow the current Snap page; unstated details are not inferred."],
    limits: ["最大未知是全天佩戴、电池、散热、社交接受、旁人隐私、开发者供给和失败反馈。社区/评测信号应重点看佩戴时间、录制提示、显示可读性和是否真的替代手机。", "The largest unknowns are all-day wear, battery, thermals, social acceptance, bystander privacy, developer supply, and failure feedback. Review/community signals should watch wear time, recording indicators, display legibility, and whether it replaces phone use."],
    verdict: ["产品判断：这是今天最强 cover story，因为它把 AI hardware、AR display、developer ecosystem 和 wearable HCI 绑在一个明确设备上；成功标准不是功能数量，而是用户愿意戴多久、开发者能做多少日常闭环。", "Product verdict: this is the strongest cover story because it binds AI hardware, AR display, developer ecosystem, and wearable HCI into one device. Success is not feature count; it is wear time and how many daily loops developers can close."]
  },
  {
    id: "xreal-aura-android-xr",
    section: "global",
    label: "confirmed product",
    strength: "high / official product and Android XR partner signal",
    date: "accessed 2026-06-19",
    image: ["xreal-aura-android-xr.svg", "XREAL Aura Android XR glasses", "Android XR · glasses form factor · partner ecosystem"],
    sources: [
      ["XREAL Aura", sources.xreal, "official"],
      ["Google Android XR partner note", sources.googleXr, "official"],
      ["UploadVR", sources.uploadvr, "review/media"]
    ],
    zhHeadline: "XREAL Aura：Android XR 的第一波眼镜形态开始变得具体",
    enHeadline: "XREAL Aura: Android XR's first glasses form factor becomes concrete",
    productName: "XREAL Aura",
    productType: ["Android XR 生态中的眼镜产品信号，重点不是单个眼镜参数，而是 Google XR 平台、XREAL 光学硬件和移动应用生态之间的连接。", "A glasses product signal inside the Android XR ecosystem. The core is not one isolated spec; it is the connection among Google's XR platform, XREAL optics, and mobile app ecosystem."],
    flow: ["用户戴上眼镜后，把手机/Android XR 服务作为内容和权限来源，用眼前显示、语音、控制器或手机输入完成导航、内容、AI 辅助和 app 扩展；实际手势细节以官方 SDK/评测为准。", "The user wears the glasses, uses phone or Android XR services as content and permission source, and completes navigation, content viewing, AI assistance, and app extension through near-eye display, voice, controller, or phone input. Gesture details remain source-bound."],
    stack: ["来源披露 Android XR 伙伴关系和 XREAL 眼镜形态；具体 SoC、重量、视场角、电池、亮度、传感器组合和价格若当前页面未列出，则写 source not stated。", "The sources disclose Android XR partnership and the XREAL glasses form factor. Exact SoC, weight, field of view, battery, brightness, sensors, and price are source not stated unless listed on the current product page."],
    cases: ["典型场景是多屏办公、视频/游戏大屏、空间化通知、Gemini/Android XR 辅助、轻量导航和开发者早期试配；它服务的是“手机屏幕不够但头显太重”的中间层。", "Typical use cases are multi-screen work, video or game viewing, spatial notifications, Gemini/Android XR assistance, lightweight navigation, and early developer adaptation. It serves the middle layer between a small phone screen and a heavy headset."],
    pain: ["它尝试解决 VR headset 的佩戴成本和手机屏幕的空间不足：让用户在更轻的眼镜形态中获得可扩展显示，但又能沿用 Android 账户、应用和权限系统。", "It tries to solve the wear cost of VR headsets and the spatial limits of phones: a lighter glasses form provides expandable display while retaining Android account, app, and permission systems."],
    tech: ["新技术信号是 Android XR 从 headset narrative 下沉到 glasses narrative；如果平台能力一致，开发者可能为同一 XR shell 设计更短、更可扫视的界面。", "The new technology signal is Android XR moving from a headset narrative into a glasses narrative. If platform capabilities stay coherent, developers may design shorter, more glanceable interfaces for the same XR shell."],
    availability: ["官方页面是确认入口；预订、发货地区和消费者上市节奏以 XREAL 当前页面为准。评测页面只作为媒体/上手信号，不替代官方 availability。", "The official page is the confirmation surface. Reservation, shipping regions, and consumer timeline follow XREAL's current page. Review pages are media/hands-on signals and do not replace official availability."],
    limits: ["未知包括眼镜是否能长期舒适佩戴、Android XR 应用是否足够、户外可读性、隐私提示、热量和电源方案。用户是否把它当显示器还是 agent shell 仍未确定。", "Unknowns include long-wear comfort, Android XR app depth, outdoor legibility, privacy cues, heat, and power. It is not yet clear whether users treat it as a display accessory or an agent shell."],
    verdict: ["产品判断：Aura 代表全球 XR 平台落地速度的关键样本。它不必一次替代手机，但必须证明 glasses form factor 能承接 Android XR 的真实日常任务。", "Product verdict: Aura is a key sample for global XR platform landing speed. It does not need to replace the phone immediately, but must prove that a glasses form factor can carry real Android XR daily tasks."]
  },
  {
    id: "qualcomm-reality-elite-start",
    section: "official",
    label: "developer surface",
    strength: "high / platform announcement and developer tooling",
    date: "accessed 2026-06-19",
    image: ["qualcomm-reality-elite-start.svg", "Qualcomm Reality Elite and START", "XR SoC · developer kit · input pipeline"],
    sources: [
      ["Qualcomm Reality Elite", sources.qualcomm, "official"],
      ["Snapdragon Spaces START", sources.qualcommStart, "developer docs"]
    ],
    zhHeadline: "Qualcomm Reality Elite + START：XR 入口竞争先落到开发者栈",
    enHeadline: "Qualcomm Reality Elite + START: XR entry competition lands first in developer stack",
    productName: "Snapdragon Reality Elite + START",
    productType: ["XR 硬件平台和开发者工具组合，服务对象是做智能眼镜、MR 头显和空间应用的 OEM / developer，而不是最终用户 App。", "An XR hardware platform and developer tooling combination for OEMs and developers building smart glasses, MR headsets, and spatial apps, not an end-user app by itself."],
    flow: ["用户最终看到的是更轻设备、更稳定 tracking、更低延迟显示和 app 兼容；开发者侧则通过 START / Spaces 类工具把输入、场景理解和渲染管线接进目标设备。", "End users experience lighter devices, steadier tracking, lower-latency display, and app compatibility. Developers use START or Spaces-like tooling to connect input, scene understanding, and rendering pipelines to target hardware."],
    stack: ["官方信号包括 Snapdragon XR 平台、Reality Elite 命名和 START developer surface；具体 OEM 设备、传感器数量、显示模组、内存、电池和价格不是本条来源直接确认的终端规格。", "Official signals include the Snapdragon XR platform, Reality Elite naming, and START developer surface. Specific OEM devices, sensor count, display module, memory, battery, and price are not terminal-device facts confirmed by this source."],
    cases: ["适用于智能眼镜 reference design、企业培训、远程协作、工业辅助、轻量 MR app、手势/眼动/空间感知 demo 和软硬件团队的原型验证。", "Use cases include smart-glasses reference designs, enterprise training, remote collaboration, industrial assistance, lightweight MR apps, gesture/eye/spatial demos, and prototype validation for soft/hardware teams."],
    pain: ["它解决的是 XR 生态碎片化：硬件厂商缺 SoC/SDK/示例，开发者缺稳定设备抽象，体验团队缺可预期的输入和反馈能力。", "It addresses XR ecosystem fragmentation: hardware makers need SoC, SDK, and samples; developers need stable device abstraction; experience teams need predictable input and feedback capabilities."],
    tech: ["新技术是把芯片能力、reference implementation 和开发工具包装为一个更完整的 platform handoff，让眼镜/头显不必每家从零定义 agentic spatial stack。", "The new technology is packaging silicon capability, reference implementation, and developer tooling as a more complete platform handoff, so each glasses or headset maker does not define an agentic spatial stack from zero."],
    availability: ["这是 developer/platform surface，不等于消费者今天能买到某一台 Reality Elite 终端。可用性应分开写：平台发布已确认，终端设备 availability source not stated。", "This is a developer/platform surface, not proof that consumers can buy a specific Reality Elite device today. Availability should be split: platform announcement confirmed; terminal device availability source not stated."],
    limits: ["风险是平台能力如果没有足够 OEM 设计和应用生态，只会停在 demo 层；HCI 上还要验证输入延迟、校准流程、失败状态和佩戴反馈是否一致。", "The risk is that platform capability without enough OEM designs and app ecosystem stays at demo level. HCI still needs validation around input latency, calibration, failure state, and consistent wear feedback."],
    verdict: ["产品判断：这条不是消费产品新闻，但它改变了 XR product surface 的供给端。对设计团队来说，值得跟踪 START 如何把空间输入变成可复用控件。", "Product verdict: this is not consumer product news, but it changes the supply side of XR product surfaces. Design teams should track how START turns spatial input into reusable controls."]
  },
  {
    id: "meta-business-ai-agent",
    section: "official",
    label: "developer surface",
    strength: "high / official business and messaging surface",
    date: "accessed 2026-06-19",
    image: ["meta-business-agent.svg", "Meta Business AI Agent", "WhatsApp · Messenger · business workflow"],
    sources: [
      ["Meta for Developers Business AI Agent", sources.metaBusiness, "official"],
      ["WhatsApp Business AI", sources.metaWhatsApp, "official"]
    ],
    zhHeadline: "Meta Business AI Agent：agentic commerce 先从消息线程里长出来",
    enHeadline: "Meta Business AI Agent: agentic commerce grows first inside messaging threads",
    productName: "Meta Business AI Agent",
    productType: ["面向商家的消息式 AI agent surface，连接 WhatsApp / Messenger 这类已有对话入口，把客服、商品解释、线索收集和购买前咨询放进一个线程。", "A messaging AI agent surface for businesses, connected to existing conversation entry points such as WhatsApp and Messenger, putting support, product explanation, lead capture, and pre-purchase advice into one thread."],
    flow: ["用户从广告、商家主页或现有聊天进入对话，agent 回答商品/服务问题，收集偏好，必要时交给人工或引导购买；商家侧配置知识、政策、handoff 和后续运营。", "A user enters from an ad, business profile, or existing chat. The agent answers product or service questions, collects preferences, hands off to a human when needed, or guides purchase. The business configures knowledge, policies, handoff, and operations."],
    stack: ["来源确认 Meta business messaging / AI agent surface；底层模型、训练数据、RAG 管线、支付覆盖、地区和行业限制未全部在公开源中明确，未披露处为 source not stated。", "Sources confirm the Meta business messaging and AI agent surface. Underlying model, training data, RAG pipeline, payment coverage, regions, and industry constraints are not fully specified in public sources, so unstated details remain source not stated."],
    cases: ["适合小商家客服、跨时区问答、商品对比、预约、售后入口、广告线索过滤和高频重复问题自动化；用户不需要下载新 App。", "Concrete uses include small-business support, cross-time-zone Q&A, product comparison, appointment booking, after-sales entry, ad-lead filtering, and automation of repetitive questions. Users do not need to install a new app."],
    pain: ["它解决商家无法实时回复、用户不愿填表、客服知识分散和购买前信息不足的问题。对用户来说，熟悉的聊天线程降低了启动成本。", "It addresses slow merchant response, user aversion to forms, scattered support knowledge, and missing pre-purchase information. For users, a familiar chat thread lowers start cost."],
    tech: ["新技术不只是 chatbot，而是 business workflow agent：它要理解商品上下文、保持对话状态、管理 handoff，并在消息平台内承接下一步动作。", "The new technology is not merely a chatbot but a business workflow agent: it must understand product context, retain conversational state, manage handoff, and carry next actions inside a messaging platform."],
    availability: ["官方页面确认产品方向；具体国家、商家资格、语言、接入方式、收费和合规限制以 Meta / WhatsApp 当前文档为准。", "Official pages confirm the product direction. Countries, merchant eligibility, languages, integration path, pricing, and compliance limits follow current Meta and WhatsApp documentation."],
    limits: ["核心未知是 hallucination、售后责任、隐私边界、支付/退款路径、人工接管时机和不同地区政策。对用户体验来说，错误答案比延迟回复更伤害信任。", "Core unknowns are hallucination, support liability, privacy boundary, payment/refund path, handoff timing, and regional policy. In UX terms, a wrong answer damages trust more than a slow reply."],
    verdict: ["产品判断：这是 agentic commerce 的低摩擦入口，因为用户已经在消息 App 里。短期重点不是炫技，而是把客服、商品事实、人工接管和交易责任设计清楚。", "Product verdict: this is a low-friction entry for agentic commerce because users are already in messaging apps. Near-term success depends on support facts, human handoff, and transaction responsibility, not showy autonomy."]
  },
  {
    id: "google-universal-cart-ap2",
    section: "official",
    label: "developer surface",
    strength: "high / official shopping and payment protocol surface",
    date: "accessed 2026-06-19",
    image: ["google-universal-cart-ap2.svg", "Google Universal Cart and AP2", "agentic checkout · payment protocol · merchant surface"],
    sources: [
      ["Google Shopping Universal Cart", sources.googleShopping, "official"],
      ["Google Developers AP2", sources.googleAp2, "developer docs"]
    ],
    zhHeadline: "Google Universal Cart / AP2：购物 agent 的关键不是推荐，而是可授权付款",
    enHeadline: "Google Universal Cart / AP2: shopping agents need authorized payment, not just recommendations",
    productName: "Google Universal Cart / Agent Payments Protocol",
    productType: ["面向 agentic shopping 的产品和开发者协议组合：前台是可跨商家汇总的购物/结账体验，后台是让 agent 能被授权执行支付的协议层。", "A product and developer-protocol combination for agentic shopping: the front end is a cross-merchant shopping and checkout experience, while the back end lets agents execute payments under authorization."],
    flow: ["用户表达购买条件，agent 比较商品、加入购物车、解释商家/价格/配送差异，并在授权边界内触发付款；商家和支付方需要把可验证意图、金额、对象和用户同意传递清楚。", "The user states purchase constraints, the agent compares items, adds to cart, explains merchant, price, and delivery differences, and triggers payment inside an authorization boundary. Merchants and payment parties must pass verifiable intent, amount, object, and user consent clearly."],
    stack: ["来源披露 Google Shopping / Universal Cart surface 和 AP2 developer protocol。具体支持商家、支付网络、地区、费用、退款流程和风控规则按官方文档；未列细节为 source not stated。", "Sources disclose the Google Shopping / Universal Cart surface and AP2 developer protocol. Supported merchants, payment networks, regions, fees, refunds, and risk rules follow official docs; unstated details are source not stated."],
    cases: ["适合补货、旅行/活动采购、多商家比价、家庭采购清单、企业低额采购和用户有清晰约束的重复购买。它把 agent 从“给建议”推向“帮我完成交易”。", "Use cases include replenishment, travel or event purchasing, multi-merchant comparison, family shopping lists, small business purchasing, and repeat buys with clear constraints. It moves agents from advising to completing transactions."],
    pain: ["它解决用户在多个商家间复制条件、重复填地址、比较配送和确认价格的摩擦；对商家则解决 agent 流量如何可信进入结账的问题。", "It addresses copying constraints across merchants, re-entering addresses, comparing delivery, and confirming prices. For merchants, it answers how agent-driven traffic enters checkout with trust."],
    tech: ["新技术是把 consent、intent、cart、payment 和 merchant state 协议化。HCI 难点是把机器可执行授权翻译成用户可读的确认和可撤销状态。", "The new technology is protocolizing consent, intent, cart, payment, and merchant state. The HCI challenge is translating machine-executable authorization into user-readable confirmation and reversible state."],
    availability: ["官方发布和开发者页面确认方向；实际商家覆盖、API 开放、国家/地区和消费者可用性取决于 Google 当前 rollout，不从协议存在推断全面上线。", "The official announcement and developer page confirm the direction. Merchant coverage, API access, countries, and consumer availability depend on Google's current rollout; the protocol's existence does not imply universal launch."],
    limits: ["未知包括退货、错买、替代商品、价格变化、库存变化、未成年人/家庭授权和 disputing flow。agent shopping 最大 UX 风险是用户以为自己授权了 A，系统执行成 B。", "Unknowns include returns, mistaken purchase, substitutions, price changes, inventory changes, minors or family authorization, and dispute flow. The largest UX risk is a user believing they authorized A while the system executes B."],
    verdict: ["产品判断：这是软件产品里最值得盯的接口变化。agent commerce 的分水岭不是推荐质量，而是付款前后的解释、授权、审计和补救是否可信。", "Product verdict: this is the software interface change to watch. The dividing line for agent commerce is not recommendation quality; it is trustworthy explanation, authorization, audit, and remedy around payment."]
  },
  {
    id: "viture-pro-xr-wild",
    section: "wild",
    label: "startup signal",
    strength: "medium / startup product and Product Hunt signal",
    date: "accessed 2026-06-19",
    image: ["viture-wild-xr.svg", "VITURE Pro XR glasses", "startup XR glasses · creator workflow · weak market signal"],
    sources: [
      ["VITURE Pro XR", sources.viture, "startup"],
      ["Product Hunt VITURE", sources.productHunt, "wild/startup"]
    ],
    zhHeadline: "VITURE Pro XR：野生 XR 眼镜继续测试“随身大屏”的真实需求",
    enHeadline: "VITURE Pro XR: wild XR glasses keep testing the real demand for portable big screens",
    productName: "VITURE Pro XR glasses",
    productType: ["创业公司/消费硬件信号，主打可携带显示和 XR glasses 体验。它不是平台级 AI OS，但它暴露用户是否愿意为眼镜形态承担佩戴、线缆、电源和隐私成本。", "A startup and consumer-hardware signal around portable display and XR glasses. It is not an AI OS platform, but it exposes whether users will accept wear, cable, power, and privacy costs for a glasses form."],
    flow: ["用户连接手机、掌机、电脑或内容设备，把画面投到眼前；交互通常仍依赖外部设备、线缆/适配器和系统输入，而不是完全自主的眼镜 agent。", "The user connects a phone, handheld console, computer, or media device and projects the screen into near-eye display. Interaction usually depends on the external device, cable or adapter, and system input rather than a fully autonomous glasses agent."],
    stack: ["公开来源用于确认产品/市场信号；具体光学参数、重量、刷新率、调光、音频、配件和价格需要按 VITURE 当前页面逐项核对。Product Hunt 只代表发布/讨论信号。", "Public sources confirm product and market signal. Optical parameters, weight, refresh, dimming, audio, accessories, and price must be checked on VITURE's current page. Product Hunt only indicates launch and discussion signal."],
    cases: ["场景是旅行观影、掌机游戏、远程办公第二屏、酒店/飞机隐私大屏、创作者预览和空间显示尝鲜。它服务的是“我想要大屏但不想带显示器”。", "Use cases are travel viewing, handheld gaming, second-screen work, private big screen in hotels or flights, creator preview, and spatial-display trial. It serves the need for a big screen without carrying a monitor."],
    pain: ["它解决屏幕尺寸和便携冲突，但没有完全解决输入和上下文问题。用户仍要处理连接、供电、设备兼容和长时间佩戴舒适性。", "It solves the screen-size versus portability conflict, but not the full input and context problem. Users still handle connection, power, device compatibility, and long-wear comfort."],
    tech: ["新技术信号较弱：更多是消费 XR optics / display packaging 的迭代，而不是 agentic autonomy。它对 AI Daily 的价值是作为 wild lane 校准大厂眼镜叙事。", "The new technology signal is weaker: more iteration in consumer XR optics and display packaging than agentic autonomy. Its value for AI Daily is calibrating big-company glasses narratives through a wild-market lane."],
    availability: ["产品页和 Product Hunt 可访问；库存、发货地区、价格和保修政策以 VITURE 当前页面为准，众筹/社区热度不能当作稳定供给证据。", "The product page and Product Hunt listing are accessible. Stock, shipping regions, price, and warranty follow VITURE's current page; crowdfunding or community heat is not stable supply evidence."],
    limits: ["未知是留存、退货、屏幕晕动、鼻梁压力、处方适配、连接可靠性和长期使用。它不能证明 AI glasses 已经 PMF，只说明 portable screen demand 仍在被验证。", "Unknowns include retention, returns, motion discomfort, nose pressure, prescription support, connection reliability, and long-term use. It does not prove AI glasses PMF; it shows portable-screen demand is still being tested."],
    verdict: ["产品判断：这是野生市场里有用但必须降权的信号。它提醒我们，眼镜入口先要通过佩戴与显示价值测试，AI 能力只是第二层。", "Product verdict: this is useful but downgraded wild-market evidence. It reminds us that glasses first need to pass wearability and display-value tests; AI capability is the second layer."]
  }
];

const scans = [
  {
    id: "review-lane-xr-hands-on",
    section: "reviews",
    label: "review/community friction",
    strength: "medium / media and hands-on scan",
    date: "accessed 2026-06-19",
    image: ["review-lane-scan.svg", "Review lane scan", "hands-on reviews · friction checks · not official specs"],
    sources: [["WIRED Snap hands-on", sources.wired, "review/media"], ["UploadVR XREAL Aura", sources.uploadvr, "review/media"]],
    zhHeadline: "评测线扫描：今天没有把媒体体验当作 confirmed spec",
    enHeadline: "Review lane scan: hands-on reports were not promoted into confirmed specs",
    productName: "Review lane scan",
    zh: "今天的 review lane 主要扫描 Snap Specs、XREAL Aura 和 Android XR 眼镜的上手/媒体报道。可提升为产品事实的只有来源明确写出的界面边界：眼镜显示、开发者 surface、Android XR 伙伴关系和佩戴/显示相关体验。没有把媒体推测的续航、价格、量产时间或未确认参数写进 confirmed dossier。缺失证据是长时间佩戴、户外可读性、热量、实际 app 生态和失败反馈。明天继续看是否出现独立评测、拆解、开发者 demo 或退货/售后讨论。",
    en: "The review lane scanned hands-on and media reports around Snap Specs, XREAL Aura, and Android XR glasses. Only interface boundaries clearly stated by the sources were promoted: glasses display, developer surface, Android XR partnership, and wear/display experience. Media guesses about battery, price, production timing, or unstated parameters were not converted into confirmed dossier facts. Missing evidence remains long-wear comfort, outdoor legibility, thermals, real app ecosystem, and failure feedback. Next watch: independent reviews, teardowns, developer demos, and return or support discussions."
  },
  {
    id: "community-friction-glasses",
    section: "community",
    label: "review/community friction",
    strength: "low / community friction only",
    date: "accessed 2026-06-19",
    image: ["community-friction-glasses.svg", "Community friction scan", "Reddit · Hacker News · support risk"],
    sources: [["Reddit r/Xreal", sources.redditXreal, "community"], ["Hacker News discussion", sources.hn, "community"]],
    zhHeadline: "社区摩擦扫描：眼镜产品的抱怨集中在佩戴、兼容和信任",
    enHeadline: "Community friction scan: glasses complaints cluster around wear, compatibility, and trust",
    productName: "Community friction scan",
    zh: "今天社区线只作为 friction/risk 证据，不作为规格来源。扫描 Reddit / Hacker News 相关讨论后，可信用的产品信号是用户会追问：能不能戴一整天、是否需要线缆和适配器、处方/鼻托是否舒服、录制提示是否让旁人安心、连接手机/电脑是否稳定。缺失证据是可量化留存、真实退货率和跨地区售后。明天若出现官方 support FAQ、用户长贴或评测对照，再把具体痛点回填到相应产品 dossier。",
    en: "The community lane is used only as friction and risk evidence, not as a specification source. Reddit and Hacker News discussions provide a useful product signal: users ask whether the glasses can be worn all day, whether cables or adapters are required, whether prescription and nose support are comfortable, whether recording indicators reassure bystanders, and whether phone/computer connection is stable. Missing evidence is quantified retention, real return rate, and regional support quality. If official support FAQs, long user posts, or comparative reviews appear, specific friction should be attached to the relevant product dossier."
  },
  {
    id: "research-visionclaw-agency",
    section: "research",
    label: "research signal",
    strength: "low / research signal, not product launch",
    date: "accessed 2026-06-19",
    image: ["research-visionclaw-agency.svg", "VisionClaw research signal", "wearable control · human agency · speculative"],
    sources: [["arXiv wearable AI agent search", sources.research, "research"]],
    zhHeadline: "研究线扫描：可穿戴 agent 的核心变量仍是 human agency",
    enHeadline: "Research lane scan: human agency remains the core variable for wearable agents",
    productName: "Research lane scan",
    zh: "研究线没有推广为 confirmed product。今天保留的是 wearable / vision / agent control 方向：当输入越来越低摩擦，用户更容易触发任务，也更容易失去过程控制。论文或预印本只能说明实验系统、交互假设和评估方法，不能说明消费者产品会发布。缺失证据包括样本规模、真实环境噪声、长期使用、隐私/旁人影响和商业可用性。明天重点看 CHI/CUI/HCI lab 是否有可复用设计模式：暂停、撤销、状态可见、错误纠正和低打扰反馈。",
    en: "The research lane was not promoted into confirmed product. The retained signal is the wearable, vision, and agent-control direction: lower-friction input makes task initiation easier but can remove process control. A paper or preprint can show an experimental system, interaction hypothesis, and evaluation method; it does not prove a consumer product will ship. Missing evidence includes sample size, real-world noise, long-term use, privacy/bystander impact, and commercial availability. Next watch: CHI, CUI, and HCI lab patterns for pause, undo, visible state, error correction, and low-interruption feedback."
  },
  {
    id: "patent-smart-glasses-watch",
    section: "patent",
    label: "patent signal",
    strength: "low / patent search only",
    date: "accessed 2026-06-19",
    image: ["patent-smart-glasses-watch.svg", "Patent signal scan", "patent only · not roadmap · not confirmed product"],
    sources: [["Google Patents smart glasses search", sources.patent, "patent"]],
    zhHeadline: "专利线扫描：智能眼镜专利只能读成交互空间防守",
    enHeadline: "Patent lane scan: smart-glasses patents only indicate defended interaction space",
    productName: "Patent lane scan",
    zh: "今天没有把专利线提升为产品事实。Google Patents 的 smart glasses / AI assistant / gesture / display 查询只能说明行业在防守哪些输入和反馈空间，例如手势、显示提示、视觉理解和端侧处理；它不说明某家公司一定发布、何时发布、以什么价格发布。缺失证据是产品页、SDK、硬件认证、开发者招募和真实上手。明天继续把 patent signal 和 official / developer / community 证据交叉，只有多源重合才提高权重。",
    en: "No patent item was promoted into product fact today. A Google Patents query for smart glasses, AI assistant, gesture, and display only suggests which input and feedback spaces the industry is defending, such as gesture, display cues, visual understanding, and on-device processing. It does not prove a company will ship, when it will ship, or at what price. Missing evidence is product page, SDK, hardware certification, developer recruitment, and hands-on use. Next watch: cross the patent signal with official, developer, and community evidence; raise weight only when multiple lanes overlap."
  },
  {
    id: "china-ai-glasses-scan",
    section: "china",
    label: "weak/unverified",
    strength: "low / China source-lane scan",
    date: "accessed 2026-06-19",
    image: ["china-ai-glasses-scan.svg", "China AI glasses scan", "36Kr · 少数派 · comparison lane"],
    sources: [["36Kr AI glasses search", sources.kr36, "china/media"]],
    zhHeadline: "中国线扫描：AI 眼镜仍是形态与渠道竞争，不只是谁模型更强",
    enHeadline: "China lane scan: AI glasses remain a form-factor and channel contest, not only a model contest",
    productName: "China lane scan",
    zh: "中国线今天没有提升出新的 confirmed product dossier，因此保留为扫描卡。扫描 36Kr、少数派等中文来源时，最有价值的不是单条传闻，而是产品维度：价格带、渠道、眼镜形态、音频/拍摄/翻译场景、手机生态绑定和用户对隐私提示的接受度。缺失证据包括官方规格、第三方长测、真实销量、退货原因和开发者生态。明天若出现明确新品发布、众筹页或评测，再拆成独立 dossier。",
    en: "The China lane did not yield a new confirmed product dossier today, so it remains a scan card. In 36Kr, 少数派, and similar Chinese sources, the useful signal is not one rumor but the product dimensions: price band, channel, glasses form, audio/capture/translation scenes, phone ecosystem binding, and user acceptance of privacy cues. Missing evidence includes official specifications, third-party long tests, real sales, return reasons, and developer ecosystem. If a clear launch, crowdfunding page, or review appears tomorrow, it should become a separate dossier."
  }
];

function dossier(topic) {
  return {
    zh: {
      productName: topic.productName,
      productType: topic.productType[0],
      interactionFlow: topic.flow[0],
      specsOrStack: topic.stack[0],
      useCases: topic.cases[0],
      painPointsSolved: topic.pain[0],
      newTech: topic.tech[0],
      availability: topic.availability[0],
      limitsOrUnknowns: topic.limits[0],
      productVerdict: topic.verdict[0]
    },
    en: {
      productName: topic.productName,
      productType: `${topic.productType[1]} The important product boundary is the default entry point: whether the user starts from a device, a chat thread, a cart, or a developer runtime. That boundary determines what context can be collected, what feedback can be shown, and how much recovery the interface must provide.`,
      interactionFlow: `${topic.flow[1]} The flow should be judged at task level, not feature level: what the user asks, what context is captured, where the result appears, when the system asks for confirmation, and how the user returns to manual control if the agent is wrong.`,
      specsOrStack: `${topic.stack[1]} This issue treats every missing number conservatively. If a source does not state battery, weight, sensor layout, display capability, price, region, API maturity, or supported payment rail, the field remains source not stated instead of inferred from adjacent products.`,
      useCases: `${topic.cases[1]} The useful HCI question is whether those scenes happen often enough to justify a new entry point. A product can look impressive in launch video but still fail if it does not reduce repeated daily friction.`,
      painPointsSolved: `${topic.pain[1]} The pain point is meaningful only when the product removes a step the user already dislikes. Extra autonomy is not automatically value; it must reduce explanation, switching, waiting, setup, or post-error cleanup.`,
      newTech: `${topic.tech[1]} The design risk is that new technical capability can make the interface less legible. Each product therefore needs explicit visible state, source/date labels, permission boundaries, and a path back to user-controlled interaction.`,
      availability: `${topic.availability[1]} Availability is separated from capability because early hardware, developer previews, and protocol announcements often mix shipping facts with roadmap language. The dossier does not treat a demo, SDK, or partner mention as broad consumer availability.`,
      limitsOrUnknowns: `${topic.limits[1]} The unknowns are not secondary details; they are the product. Wear time, privacy cues, merchant liability, payment reversibility, developer supply, and support policy decide whether the new interface becomes a habit or a novelty.`,
      productVerdict: `${topic.verdict[1]} The practical product read is to watch whether the interface closes real loops under user control. A credible AI product should say what it knows, what it is doing, what remains uncertain, and how the user can stop, edit, undo, escalate, or audit the action.`
    }
  };
}

function scanDossier(scan) {
  return {
    zh: {
      productName: scan.productName,
      productType: `${scan.zh} 本卡是 source-lane scan，不是 confirmed product。`,
      interactionFlow: "扫描方式：按来源类型读取官方、媒体、社区或研究页面，只抽取可回填到产品交互的信号。",
      specsOrStack: "规格 / 系统栈：source not stated；scan item 不推断硬件参数、价格、地区或量产节奏。",
      useCases: "使用场景：用于决定明天是否升级为完整 dossier，或作为风险项回填到已有产品。",
      painPointsSolved: "解决痛点：防止日报静默跳过弱证据 lane，也防止把弱信号误写成已确认事实。",
      newTech: "新技术：本卡只记录交互方向，不声明已发布新技术。",
      availability: "可用性：source-lane coverage only；无消费者可购买事实。",
      limitsOrUnknowns: "限制 / 未知：证据不足，需等待官方、评测、社区长测或开发者文档。",
      productVerdict: "产品判断：保留为低权重雷达；除非多源交叉，不进入 confirmed product。"
    },
    en: {
      productName: scan.productName,
      productType: `${scan.en} This card is a source-lane scan, not a confirmed product.`,
      interactionFlow: "Scan method: read the relevant official, media, community, or research lane and extract only signals that can be mapped back to product interaction.",
      specsOrStack: "Specs / stack: source not stated; scan items do not infer hardware parameters, price, region, or production timing.",
      useCases: "Use case: decide whether the signal should become tomorrow's full dossier or be attached as a risk item to an existing product.",
      painPointsSolved: "Pain point solved: prevents a weak evidence lane from being silently skipped and prevents weak evidence from being written as confirmed fact.",
      newTech: "New technology: this card records interaction direction only; it does not claim a shipped technology.",
      availability: "Availability: source-lane coverage only; no consumer purchase fact is asserted.",
      limitsOrUnknowns: "Limits / unknowns: evidence is insufficient until official pages, reviews, long community tests, or developer docs appear.",
      productVerdict: "Product verdict: keep as low-weight radar; do not promote into confirmed product without cross-source support."
    }
  };
}

function topicRecord(topic) {
  const [file, alt, caption] = topic.image;
  return {
    id: topic.id,
    section: topic.section,
    zhHeadline: topic.zhHeadline,
    enHeadline: topic.enHeadline,
    zhFact: topic.productType[0],
    enFact: topic.productType[1],
    zhValue: topic.verdict[0],
    enValue: topic.verdict[1],
    zhHciLens: ["输入/反馈", "权限/上下文", "可恢复控制", "日常任务闭环"],
    enHciLens: ["Input/feedback", "Permission/context", "Recoverable control", "Daily task closure"],
    zhImplication: topic.verdict[0],
    enImplication: topic.verdict[1],
    sourceDate: topic.date,
    evidenceStrength: topic.strength,
    evidenceLabel: topic.label,
    dossierKind: "product",
    visual: {
      path: `assets/${file}`,
      width: 1200,
      height: 760,
      altZh: alt,
      altEn: alt,
      captionZh: `自绘机制图：${caption}；基于来源，不是产品渲染`,
      captionEn: `Self-drawn mechanism diagram: ${caption}; source-based, not a product render`,
      sourceUrl: topic.sources[0][1]
    },
    sources: topic.sources.map(([label, url, type]) => ({ label, url, type })),
    dossier: dossier(topic)
  };
}

function scanRecord(scan) {
  const [file, alt, caption] = scan.image;
  return {
    id: scan.id,
    section: scan.section,
    zhHeadline: scan.zhHeadline,
    enHeadline: scan.enHeadline,
    zhFact: scan.zh,
    enFact: scan.en,
    zhValue: "这是扫描卡，不是已确认产品事实；只用于标记证据缺口和下一步观察。",
    enValue: "This is a scan card, not a confirmed product fact; it marks evidence gaps and next watch items.",
    zhHciLens: ["证据缺口", "弱信号降权", "明日观察", "不要推断规格"],
    enHciLens: ["Evidence gap", "Downgraded signal", "Next watch", "Do not infer specs"],
    zhImplication: "弱证据需要留痕，但不能替代官方或评测事实。",
    enImplication: "Weak evidence needs a trace, but cannot replace official or review facts.",
    sourceDate: scan.date,
    evidenceStrength: scan.strength,
    evidenceLabel: scan.label,
    dossierKind: "scan",
    visual: {
      path: `assets/${file}`,
      width: 1200,
      height: 760,
      altZh: alt,
      altEn: alt,
      captionZh: `自绘扫描图：${caption}`,
      captionEn: `Self-drawn scan diagram: ${caption}`,
      sourceUrl: scan.sources[0][1]
    },
    sources: scan.sources.map(([label, url, type]) => ({ label, url, type })),
    dossier: scanDossier(scan)
  };
}

const issue = {
  date,
  timezone: "America/Toronto",
  zhTitle: "AI 入口今天集中转向眼镜、消息线程与可授权交易",
  enTitle: "AI entry points shift into glasses, messaging threads, and authorized transactions",
  zhSummary: "今天的强信号来自 Snap Specs、XREAL Aura、Qualcomm XR developer stack、Meta Business AI Agent 和 Google agentic checkout。共同变化不是模型更大，而是 AI 正进入可佩戴显示、商家消息、支付协议和 XR 平台。",
  enSummary: "Today's strongest signals come from Snap Specs, XREAL Aura, Qualcomm's XR developer stack, Meta Business AI Agent, and Google's agentic checkout work. The common change is not a larger model; AI is entering wearable displays, merchant messaging, payment protocols, and XR platforms.",
  tags: ["HCI", "AI hardware", "smart glasses", "agentic commerce", "Android XR", "developer surface", "wearable AI"],
  sourceTypes: ["official", "developer docs", "reviews", "community", "startup", "research", "patent", "China"],
  zhPath: `/ai-daily/${date}/zh/`,
  enPath: `/ai-daily/${date}/en/`,
  sourcesPath: `/ai-daily/${date}/sources.md`,
  coverStory: {
    topicId: "snap-specs-standalone-ar",
    zhTitle: "Snap Specs 把今天的 AI hardware 焦点拉回“可戴多久、能做什么、谁来开发”",
    enTitle: "Snap Specs pulls today's AI hardware question back to wear time, task closure, and developer supply",
    zhSummary: [
      "今天不是又一个聊天框日，而是 AI 入口进入眼镜、消息、支付和 XR developer stack 的日子。",
      "Snap Specs 是封面，因为它把 AR 显示、相机、语音、空间输入和开发者生态放进一个独立设备。",
      "产品判断要看可佩戴性、权限反馈、开发者闭环和弱证据 lane，而不是只看发布话术。"
    ],
    enSummary: [
      "Today is not another chat-box day; AI entry points are moving into glasses, messaging, payments, and XR developer stacks.",
      "Snap Specs is the cover because it puts AR display, camera, voice, spatial input, and developer ecosystem into one standalone device.",
      "The product read depends on wearability, permission feedback, developer closure, and downgraded weak-signal lanes, not launch language alone."
    ],
    imagePath: "assets/snap-specs-ar.svg",
    imageWidth: 1200,
    imageHeight: 760,
    imageSourceUrl: sources.snap,
    primarySourceUrl: sources.snap,
    evidenceStrength: "confirmed product · official/developer surface",
    whyCover: "It changes the interface boundary: glasses become a wearable AI app platform, not only a camera accessory."
  },
  topics: [...topics.map(topicRecord), ...scans.map(scanRecord)],
  watchlistZh: [
    "Snap Specs：继续看价格/资格/开发者供给、全天佩戴、录制提示和第三方长测。",
    "Android XR / XREAL Aura：继续看是否出现真实 SDK demo、app 移植和消费者发货节奏。",
    "Google AP2：继续看商家覆盖、支付授权 UI、退款/争议流程和用户可撤销状态。",
    "Meta Business AI Agent：继续看地区、语言、handoff、错误责任和 WhatsApp Business 落地。",
    "China lane：继续等待明确新品、众筹、官方规格或长测，不把搜索热度写成产品事实。"
  ],
  watchlistEn: [
    "Snap Specs: watch price/eligibility, developer supply, all-day wear, recording indicators, and independent long tests.",
    "Android XR / XREAL Aura: watch real SDK demos, app migration, and consumer shipping cadence.",
    "Google AP2: watch merchant coverage, payment authorization UI, refund/dispute flow, and reversible user state.",
    "Meta Business AI Agent: watch regions, languages, handoff, answer liability, and WhatsApp Business deployment.",
    "China lane: wait for clear launch, crowdfunding page, official specs, or long review; do not treat search heat as product fact."
  ]
};

async function writeAssets(records) {
  await fs.mkdir(assetDir, { recursive: true });
  await fs.mkdir(slidevAssetDir, { recursive: true });
  for (const record of records) {
    const title = record.id.replaceAll("-", " ");
    const caption = record.visual.captionEn.replace("Self-drawn mechanism diagram: ", "").replace("Self-drawn scan diagram: ", "");
    const content = svg(title, caption, record.enHciLens);
    const file = path.basename(record.visual.path);
    await fs.writeFile(path.join(assetDir, file), content);
    await fs.writeFile(path.join(slidevAssetDir, file), content);
  }
}

function slidevSlides() {
  const cards = issue.topics
    .map((topic) => `- **${topic.section} / ${topic.evidenceLabel}**: ${topic.enHeadline}`)
    .join("\n");
  const sourceLinks = issue.topics.flatMap((topic) => topic.sources).map((source) => `- ${source.label}: ${source.url}`).join("\n");
  return `---
theme: default
title: AI Product Morning Brief ${date}
class: ai-daily
canvasWidth: 1280
aspectRatio: 16/9
transition: fade
---

# AI Daily · ${date}

${issue.zhTitle}

${issue.zhSummary}

![cover](./public/${issue.coverStory.imagePath})

---

# Issue Map

${cards}

---

# Cover Story · Snap Specs

![snap](./public/assets/snap-specs-ar.svg)

${issue.topics[0].dossier.en.productVerdict}

---

# Product Dossiers

${issue.topics.slice(1, 6).map((topic) => `## ${topic.enHeadline}\n${topic.dossier.en.productVerdict}`).join("\n\n")}

---

# Source Lane Scans

${issue.topics.slice(6).map((topic) => `## ${topic.section}\n${topic.dossier.en.productType}`).join("\n\n")}

---

# Sources

${sourceLinks}
`;
}

async function writeSlidev() {
  await fs.mkdir(slidevDir, { recursive: true });
  await fs.writeFile(path.join(slidevDir, "package.json"), JSON.stringify({
    name: `ai-product-morning-brief-${date}`,
    version: "1.0.0",
    private: true,
    type: "module",
    scripts: { dev: "slidev", build: "slidev build --base ./" },
    dependencies: { "@slidev/cli": "^52.3.4", "@slidev/theme-default": "^0.25.0" }
  }, null, 2));
  await fs.writeFile(path.join(slidevDir, "slides.md"), slidevSlides());
  await fs.writeFile(path.join(slidevDir, "sources.md"), `# Sources\n\n${issue.topics.flatMap((topic) => topic.sources).map((source) => `- ${source.label}: ${source.url}`).join("\n")}\n`);
}

async function updateIssues() {
  const dataPath = path.join(siteRoot, "data", "issues.json");
  const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
  const next = issues.filter((item) => item.date !== date);
  next.push(issue);
  next.sort((a, b) => a.date.localeCompare(b.date));
  await fs.writeFile(dataPath, `${JSON.stringify(next, null, 2)}\n`);
}

await writeAssets(issue.topics);
await writeSlidev();
await updateIssues();

console.log(`Created AI Daily issue ${date}`);
console.log(`Slidev: ${slidevDir}`);
