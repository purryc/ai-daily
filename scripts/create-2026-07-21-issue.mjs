import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const issuesPath = path.join(root, "data", "issues.json");
const issues = JSON.parse(await fs.readFile(issuesPath, "utf8"));
const previous = issues.find((issue) => issue.date === "2026-07-20");
if (!previous) throw new Error("Missing 2026-07-20 source issue");

const clone = (value) => structuredClone(value);
const source = (label, url) => ({ label, url });
const visual = (file, width, height, title, url, zh, en, kind = "source-backed screenshot") => ({
  path: `assets/${file}`,
  width,
  height,
  kind,
  altZh: `真实来源视觉：${title}`,
  altEn: `Source-backed visual: ${title}`,
  captionZh: zh,
  captionEn: en,
  sourceUrl: url
});
const old = Object.fromEntries(previous.topics.map((topic) => [topic.id, clone(topic)]));
const carry = (id, section = null, visualPath = null) => {
  const topic = clone(old[id]);
  if (!topic) throw new Error(`Missing previous topic ${id}`);
  if (section) topic.section = section;
  topic.sourceDate = `${topic.sourceDate} · 2026-07-21 follow-up`;
  if (visualPath) topic.visual.path = `assets/${visualPath}`;
  return topic;
};

const makeProduct = (config) => ({
  id: config.id,
  section: config.section,
  zhHeadline: config.zhHeadline,
  enHeadline: config.enHeadline,
  zhFact: `${config.zh.productName}：${config.zh.productType} 本条按 ${config.evidenceLabel} 处理；来源未披露处写 source not stated。`,
  enFact: `${config.en.productName}: ${config.en.productType} This item is handled as ${config.evidenceLabel}; missing details remain source not stated.`,
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

const rayneoReview = "https://www.techradar.com/pro/rayneo-x3-pro-ai-ar-smart-glasses-review";
const rayneo = makeProduct({
  id: "rayneo-x3-pro-display-ar-glasses", section: "reviews",
  zhHeadline: "RayNeo X3 Pro 把显示型 AI 眼镜推进到‘能买，但还不够好用’",
  enHeadline: "RayNeo X3 Pro makes display AI glasses buyable, but not yet easy to use",
  sourceDate: "2026-07-14 TechRadar review · current RayNeo UK product page",
  evidenceLabel: "confirmed product", evidenceStrength: "confirmed product · official product page · hands-on review friction",
  visual: visual("rayneo-x3-pro-review-source-2026-07.png", 1600, 1000, "RayNeo X3 Pro TechRadar review", rayneoReview, "TechRadar 2026-07-14 实测页面截图：双目 MicroLED 的亮点与电池、重量、生态摩擦同页出现。", "TechRadar review page dated July 14, 2026: binocular MicroLED strengths and battery, weight, and ecosystem friction in one source."),
  hciZh: ["双目显示", "眼前状态反馈", "电池与工作节奏"], hciEn: ["binocular display", "in-field status feedback", "battery-shaped work rhythm"],
  sources: [
    source("RayNeo X3 Pro official UK product page", "https://uk.rayneo.com/collections/ai-smart-glasses/products/x3-pro-ai-display-glasses"),
    source("TechRadar Pro hands-on review", rayneoReview),
    source("TechRadar X3 Pro specifications", rayneoReview),
    source("RayNeo lens partner Lensology", "https://lensology.co.uk/rayneo/")
  ],
  zh: {
    productName: "RayNeo X3 Pro AI+AR Glasses",
    productType: "RayNeo X3 Pro 是可直接购买的独立式 AI+AR 眼镜，产品页把 Gemini Live、RayNeo AIOS、全彩 MicroLED、实时翻译、导航、五向触控和 Creator Mode 放在同一套硬件里。7 月 14 日 TechRadar 评测把它从发布页拉回日常使用：双目显示、户外可读性和空间定位很强，但 76 克重量、电池和 app 生态让它仍像第一代计算平台。",
    interactionFlow: "用户戴上眼镜，用 Hey RayNeo 语音或右侧五向触控发起问答、翻译、导航、通知和拍摄；双目显示把文字或导航叠到视野中心，开放式扬声器回传声音，手机和 RayNeo AIOS 负责补齐账户、网络与应用。评测描述 6DoF + SLAM 与 Falcon Image 做空间定位，真实流程却会受到 app 生态、地区、模型默认偏差和电池剩余的约束。用户需要在眼前读信息，同时决定何时转回手机。",
    specsOrStack: "官方页面列出 640×480 全彩 MicroLED、6,000 nits 峰值亮度、Snapdragon AR1、12MP 相机、Gemini Live、Bluetooth 5.3、Wi‑Fi 6 和 Creator Mode。TechRadar 的规格表补充 4GB LPDDR5、32GB 存储、30° FoV、60Hz、RayNeo AIOS（Android-based）、Google Gemini 2.5 Beta、Sony IMX681 12MP 加单色定位相机、6DoF + SLAM、76g、245mAh、电池约 1–5 小时随使用变化、USB‑C 约 38–45 分钟充满，以及 14 语言翻译约 2.1 秒响应。芯片以外的端云模型分工、录制码率和地区 API 权限为 source not stated。",
    useCases: "具体场景包括户外导航、街景和菜单翻译、免手拍摄、通知处理、视野内问答和把 AR 信息固定在真实空间。双目显示适合把路线、短文本和状态放在视野中心，不必一直低头看手机；Creator Mode 为开发者和创作者提供新的内容入口。评测也说明它不是用来看片的通用大屏，使用价值更依赖“短时间看一眼—做一个动作—回到环境”的节奏。",
    painPointsSolved: "它直接解决 camera-only 眼镜无法在视野内显示信息的问题，也减少导航、翻译和通知时频繁掏手机的动作。双目 MicroLED 和 6,000 nits 让户外可读性成为可测量卖点，空间定位让文字不必漂浮在错误位置。代价同样具体：76g 会加重鼻梁和镜腿，电池在显示、相机与 AI 混合负载下可能只撑一到数小时，官方应用和地区适配仍需要技术绕行。",
    newTech: "产品的新技术组合是双眼全彩 MicroLED + waveguide、RayNeo Firefly Optical Engine、Snapdragon AR1、6DoF/SLAM、AIOS、Gemini Live 和 Creator Mode 的统一入口。真正的交互变化不是多一个 chatbot，而是让模型输出成为视野中的定位对象：文字要稳定、短、可关闭，空间状态要能恢复，电量要进入任务设计。它把显示型 AI 眼镜从“能显示”推进到“显示是否值得持续佩戴”的产品测试。",
    availability: "RayNeo UK 产品页当前列出 £1,169 折后价、原价 £1,299，并显示 30-day price match、30-day return/exchange、one-year warranty 与预计 2–4 天配送；TechRadar 报道美国价格为 $1,169，早期售价曾为 $1,099、标准零售价 $1,299。处方镜片可通过 Lensology 另购，约 $49/£49。具体国家库存、软件版本、售后政策和 Gemini 功能地区差异以当地页面为准，未披露处为 source not stated。",
    limitsOrUnknowns: "评测明确把产品判为 3/5 的第一代路线，核心未知包括显示与相机混合负载的真实连续续航、在不同语言和地区使用 Gemini 的稳定性、app 生态能否摆脱技术绕行、户外高亮是否牺牲电量、76g 长时间佩戴是否可接受，以及 Creator Mode 的开放程度。官方参数不能替代对充电频率、热量、误识别、隐私提示和断网降级的独立测试。",
    productVerdict: "RayNeo X3 Pro 证明显示型 AI 眼镜已经可以作为独立产品购买：双目 MicroLED、空间定位和户外可读性提供了 camera-only 产品没有的能力。但它也把第一代硬件的硬约束暴露得很直白：重量、电池、价格和生态决定“看见未来”能否变成每天戴着完成任务。今天应把它当作技术完成度高、日常完成度仍不足的 confirmed product。"
  },
  en: {
    productName: "RayNeo X3 Pro AI+AR Glasses",
    productType: "RayNeo X3 Pro is a standalone, purchasable AI+AR glasses product that puts Gemini Live, RayNeo AIOS, full-colour MicroLED, real-time translation, navigation, five-way touch, and Creator Mode into one device. A July 14 TechRadar review brings the product back from launch language to daily use: the binocular display, outdoor legibility, and spatial positioning are strong, while 76-gram weight, battery life, and app-ecosystem friction still make it feel like a first-generation computer.",
    interactionFlow: "The wearer uses Hey RayNeo or the five-way touch panel on the right temple to start questions, translation, navigation, notifications, and capture. Binocular display places text and directions in the central field of view; open-ear speakers return audio; phone and RayNeo AIOS supply account, network, and application support. The review describes 6DoF plus SLAM and Falcon Image spatial positioning, but the real flow is constrained by app availability, region, model defaults, and remaining battery. The user reads in the field of view while deciding when to hand the task back to the phone.",
    specsOrStack: "RayNeo’s product page lists a 640 by 480 full-colour MicroLED display, 6,000-nit peak brightness, Snapdragon AR1, 12MP camera, Gemini Live, Bluetooth 5.3, Wi-Fi 6, and Creator Mode. TechRadar’s specification table adds 4GB LPDDR5 RAM, 32GB storage, 30-degree field of view, 60Hz, Android-based RayNeo AIOS, Google Gemini 2.5 Beta, a Sony IMX681 12MP colour camera plus a monochrome positioning camera, 6DoF and SLAM, 76 grams, a 245mAh battery rated at roughly one to five hours depending on use, USB-C charging in about 38 to 45 minutes, and translation across 14 languages with an approximately 2.1-second response. Edge/cloud split, recording bitrate, and regional API permissions are source not stated.",
    useCases: "Concrete jobs include outdoor navigation, street and menu translation, hands-free capture, notification handling, visual questions, and anchoring AR information to the physical scene. Binocular display is useful for routes, short text, and status cues without repeated phone pulls; Creator Mode opens a content and developer surface. The review also makes clear that this is not a general-purpose movie screen. Its value depends on a rhythm of glance briefly, act once, and return attention to the environment.",
    painPointsSolved: "The product addresses the limitation of camera-only glasses that cannot put information into the wearer’s view, reducing phone pulls for navigation, translation, and notifications. Binocular MicroLED and 6,000 nits make outdoor legibility a measurable claim, while spatial positioning keeps overlays from drifting. The costs are equally concrete: 76 grams add pressure to nose and temples; mixed display, camera, and AI use may reduce the battery to an hour or a few hours; and the official app ecosystem still requires technical workarounds in some flows.",
    newTech: "The technical combination is binocular full-colour MicroLED through waveguides, RayNeo’s Firefly Optical Engine, Snapdragon AR1, 6DoF/SLAM, AIOS, Gemini Live, and Creator Mode. The important interaction change is not another chatbot. It is making model output a spatial object: text must be stable, short, and dismissible; spatial state must recover; battery must become part of task design. The device moves display AI glasses from ‘can display’ to ‘is the display worth wearing continuously?’",
    availability: "The RayNeo UK product page lists £1,169 on sale from £1,299, with a 30-day price match, 30-day return and exchange, one-year warranty, and an estimated two-to-four-day delivery window. TechRadar reports a US price of $1,169, an early-bird price of $1,099, and a standard retail price of $1,299. Prescription inserts are available through Lensology from about $49/£49. Country inventory, software version, support policy, and Gemini feature differences vary by local page; missing details remain source not stated.",
    limitsOrUnknowns: "The review gives the product a 3/5 first-generation verdict. Unknowns include mixed-load continuous runtime with display, camera, and AI active; Gemini consistency across languages and regions; whether the app ecosystem can escape workarounds; the battery cost of outdoor brightness; long-term comfort at 76 grams; and how open Creator Mode really is. Official specifications do not replace independent tests of charging frequency, heat, recognition errors, privacy cues, and offline fallback.",
    productVerdict: "RayNeo X3 Pro proves that display AI glasses can be bought as a standalone product: binocular MicroLED, spatial positioning, and outdoor legibility deliver capabilities camera-only glasses cannot. It also exposes first-generation constraints with unusual clarity. Weight, battery, price, and ecosystem decide whether ‘seeing the future’ becomes a daily task surface. Treat it as a technically accomplished confirmed product whose everyday completion is still incomplete."
  }
});

const memoMindReview = "https://www.androidcentral.com/gaming/virtual-reality/memomind-one-camera-free-smart-glasses-review";
const memoMind = makeProduct({
  id: "memomind-one-camera-free-display-glasses", section: "wild",
  zhHeadline: "MemoMind One 用无相机显示换取更容易被接受的 AI 眼镜姿态",
  enHeadline: "MemoMind One trades the camera for a more socially acceptable display-glasses posture",
  sourceDate: "2026-06-28 Kickstarter · 2026-07 Android Central hands-on",
  evidenceLabel: "crowdfunding signal", evidenceStrength: "crowdfunding signal · hands-on review · official product page",
  visual: visual("memomind-one-review-source-2026-07.png", 1600, 1000, "MemoMind One Android Central hands-on", memoMindReview, "Android Central 实测页面截图：无相机、46g、通知/日历/待办/翻译和 Kickstarter 交付时间。", "Android Central hands-on page: camera-free design, 46g weight, notifications/calendar/to-do/translation, and Kickstarter delivery timing."),
  hciZh: ["无相机社会契约", "显示小组件", "众筹可用性"], hciEn: ["camera-free social contract", "display widgets", "crowdfunding availability"],
  sources: [
    source("MemoMind One official product page", "https://www.memo-mind.com/pages/memomind-one"),
    source("Android Central hands-on review", memoMindReview),
    source("Tom’s Guide hands-on review", "https://www.tomsguide.com/computing/smart-glasses/xgimi-memomind-one-skip-camera-and-i-dont-think-thats-a-bad-thing"),
    source("MemoMind Kickstarter / pre-order", "https://www.kickstarter.com/projects/memomind/memomind-one-ai-glasses")
  ],
  zh: {
    productName: "XGIMI MemoMind One",
    productType: "MemoMind One 是 XGIMI 旗下 MemoMind 的无相机显示型 AI 眼镜，核心卖点不是看见世界，而是在更接近日常眼镜的镜框里提供私密显示、开放式音频和 AI 小组件。官方页面列出约 46.6g、双 Micro‑LED 投影、2,000 nits、1–5 米可调虚拟距离、低漏光设计、Harman AudioEFX 和三向麦克风；媒体评测把它放进通知、日历、待办、语音记录、翻译和步行/骑行导航的真实流程中。",
    interactionFlow: "用户通过 MemoMind app 配置眼镜，把通知、日历、新闻、待办和 idea board 推到显示层，用语音记录想法，调用音频录制和实时翻译；导航需要先在 app 里输入目的地，之后以步行或骑行 turn-by-turn 提示显示。无相机意味着它不能直接看见菜单、路牌或手势，视觉理解和拍照不在产品闭环里。它用“主动配置 + 短显示 + 耳边提示”换取更清楚的摄像头边界。",
    specsOrStack: "官方产品页明确列出三种镜框风格、β-titanium/magnesium-aluminum/acetate 材料、46.6g、双 Micro‑LED 投影、2,000 nits、1–5m 可调显示距离、向下出光和高透明光栅、无相机、Harman AudioEFX 开放式音频、三向麦克风、ZEISS XRRX 处方镜片选项。Android Central 确认双 Micro‑LED waveguide、内置音频和 46g；电池容量、处理器、OS/API、显示分辨率、端云模型分工和实际续航为 source not stated。",
    useCases: "它适合镜面上扫读通知、日历、新闻和待办，在路上口述笔记、听音频、做实时翻译，以及步行或骑行时接收导航。无相机设计降低了公共空间里旁观者对隐形记录的担忧，也让产品更像一副日常眼镜；对需要视觉 AI 的用户，它无法替代相机型眼镜。产品选择很清楚：它优先解决信息提示和记忆输入，不承担“看见并理解眼前世界”。",
    painPointsSolved: "MemoMind One 针对两类摩擦：相机型眼镜难以被旁人信任，传统 HUD 又常常需要手机或专用遥控器。无相机让隐私边界更容易解释，双 Micro‑LED 把通知和短提示放回视线，语音记录降低把想法保存下来的动作成本。代价是它不能直接捕捉视觉上下文，导航仍要先在手机 app 输入目的地，AI 价值更依赖预先配置和手机连接。",
    newTech: "产品的新组合是无相机硬件、双 Micro‑LED waveguide、2,000 nits 显示、1–5 米虚拟距离、低漏光光学、Harman AudioEFX 和面向小组件的 AI 体验。这里的产品创新不是更强的视觉模型，而是把“我不拍摄你”变成形态选择，再用显示把通知、翻译和导航变成 glanceable layer。它把社会接受度、显示隐私和每日佩戴舒适度放在同一条体验链上。",
    availability: "Android Central 报道 MemoMind One 通过 Kickstarter 众筹，早鸟价 $399，处方镜片版本 $499，定制设计从 $449 起，预计 2026 年 8 月交付；Tom’s Guide 报道商业上市价格可能为 $599。官方页面展示预订入口并列出规格，尚不能把众筹承诺写成现货零售。可售地区、批量交付、保修、订阅、API 和最终零售价均以项目后续公告为准，未披露处写 source not stated。",
    limitsOrUnknowns: "目前最大未知不是产品有没有显示，而是众筹交付后的长期可用性：电池在显示、音频、麦克风、翻译和通知混合负载下能撑多久，手机断连时哪些功能保留，低漏光在不同角度是否成立，语音记录如何保存与删除，以及翻译和导航的延迟。评测还提醒它的导航只支持步行和骑行，AI 反应和音频表现需要继续观察。",
    productVerdict: "MemoMind One 把 AI 眼镜的社会问题转成产品策略：去掉相机，留下显示、音频和可配置的小组件。它不追求“看见一切”，所以场景更窄，也更可能融入公共空间。当前必须保留 crowdfunding signal 标签：硬件方向清楚，评测提供了早期体验，但交付、续航、手机依赖和长期软件支持仍未被消费级规模验证。"
  },
  en: {
    productName: "XGIMI MemoMind One",
    productType: "MemoMind One is a camera-free display AI glasses product from XGIMI’s MemoMind brand. Its core job is not to see the world, but to put private display, open-ear audio, and AI widgets into a frame that looks closer to everyday eyewear. The official page lists about 46.6 grams, dual Micro-LED projection, 2,000 nits, an adjustable one-to-five-metre virtual distance, reduced light leakage, Harman AudioEFX, and triple directional microphones. Reviews place it in concrete flows for notifications, calendar, to-do lists, voice notes, translation, and walking or cycling navigation.",
    interactionFlow: "The user configures the glasses through the MemoMind app, mirrors notifications, calendar, news, to-do items, and an idea board, dictates notes, and invokes audio recording or real-time translation. Navigation requires entering a destination in the app first, then presenting walking or cycling turn-by-turn cues. Because there is no camera, the product cannot directly see a menu, sign, or gesture; visual understanding and capture are outside its loop. It trades active configuration, short display cues, and whispered audio for a clearer camera boundary.",
    specsOrStack: "The official product page lists three frame styles, beta-titanium, magnesium-aluminium, or acetate materials, 46.6 grams, dual Micro-LED projectors, 2,000 nits, a one-to-five-metre adjustable display distance, downward light and a high-transparency grating, no camera, Harman AudioEFX open-ear audio, triple directional microphones, and ZEISS XRRX prescription lens options. Android Central confirms dual Micro-LED waveguides, built-in audio, and 46 grams. Battery capacity, processor, OS/API, display resolution, edge/cloud model split, and measured runtime are source not stated.",
    useCases: "The device is for glancing at notifications, calendar, news, and to-dos; dictating an idea while moving; listening to audio; translating speech in real time; and receiving navigation while walking or cycling. A camera-free design reduces bystander concern about invisible recording and makes the product easier to read as normal eyewear. For users who need visual AI, it is not a replacement for camera glasses. The product choice is explicit: it prioritizes prompts and memory capture over seeing and interpreting the world in front of the wearer.",
    painPointsSolved: "MemoMind One targets two frictions. Camera glasses are difficult to trust in public, while traditional HUD products often require a phone or dedicated controller. Removing the camera makes the privacy boundary easier to explain; dual Micro-LED puts short prompts back into the visual field; voice notes reduce the effort of saving an idea. The trade-off is a narrower context window: the glasses cannot capture visual context, navigation starts with phone setup, and the AI experience depends on configuration and connectivity.",
    newTech: "The product combination is camera-free hardware, dual Micro-LED waveguides, 2,000-nit display, adjustable one-to-five-metre virtual distance, low-leakage optics, Harman AudioEFX, and a widget-oriented AI experience. The innovation is not a stronger vision model. It is treating ‘I do not record you’ as a form-factor decision and using display to make notifications, translation, and navigation a glanceable layer. Social acceptance, display privacy, and all-day wearability become one product chain.",
    availability: "Android Central reports a Kickstarter campaign with a $399 early-bird pledge, a $499 prescription option, customized designs from $449, and expected delivery in August 2026. Tom’s Guide reports a possible $599 commercial price. The official page exposes a reservation path and specifications, but a crowdfunding promise is not current retail inventory. Regions, batch delivery, warranty, subscription, API access, and final retail pricing remain source not stated and should be rechecked after the campaign.",
    limitsOrUnknowns: "The main unknown is not whether it can display. It is whether the delivered product remains useful over time. Battery life under mixed display, audio, microphone, translation, and notification load is unverified; phone-disconnected behavior is unclear; leakage at different viewing angles needs testing; and the storage and deletion model for voice notes is not fully disclosed. Reviews also note that navigation is limited to walking and cycling, while AI response time and audio quality require continued observation.",
    productVerdict: "MemoMind One turns the social problem of AI glasses into a product strategy: remove the camera, keep display, audio, and configurable widgets. It does not try to see everything, which narrows the job but may improve public acceptance. Keep the label at crowdfunding signal: the hardware direction is concrete and early hands-on evidence exists, while delivery, battery, phone dependence, and long-term software support have not yet been validated at consumer scale."
  }
});

const iflytek = makeProduct({
  id: "iflytek-ai-glasses-glassclaw-china", section: "china",
  zhHeadline: "讯飞 AI 眼镜把翻译、提词和 GlassClaw 变成中国线的完整工作流",
  enHeadline: "iFlytek AI Glasses turn translation, prompting, and GlassClaw into a China-market workflow",
  sourceDate: "2026-05-28 launch · 2026-05-29 36Kr product report",
  evidenceLabel: "confirmed product", evidenceStrength: "confirmed product · China launch coverage · company annual-report disclosure",
  visual: visual("iflytek-ai-glasses-source-2026-05.png", 1600, 1000, "iFlytek AI Glasses 36Kr report", "https://36kr.com/p/3830205689357954", "36Kr 发布现场页面截图：40g、全场景翻译、5 麦 + 骨传导 + 唇动识别、GlassClaw 与价格/渠道。", "36Kr launch report: 40g body, translation, five air-conduction mics plus bone conduction and lip reading, GlassClaw, price, and retail channels."),
  hciZh: ["多人声场选择", "翻译与提词", "Agent 端到端交付"], hciEn: ["multi-speaker selection", "translation and prompting", "agent end-to-end delivery"],
  sources: [
    source("36Kr iFlytek AI Glasses launch report", "https://36kr.com/p/3830205689357954"),
    source("iFlytek 2025 annual report PDF", "https://static.cninfo.com.cn/finalpage/2026-04-29/1225233581.PDF"),
    source("IT Home launch report", "https://www.ithome.com/0/956/742.htm"),
    source("iFlytek official website", "https://www.iflytek.com/")
  ],
  zh: {
    productName: "讯飞 AI 眼镜 + GlassClaw",
    productType: "讯飞 AI 眼镜是科大讯飞在 2026 年 5 月 28 日于澳门发布的带显示多模态 AI 眼镜，产品定位是“眼前的超级 AI 助理”。36Kr 报道列出约 40g 机身、全场景翻译、多模态降噪、智能提词和 GlassClaw；科大讯飞年度报告补充了自研同传与多语言大模型、AI 视觉/语音翻译、唇动识别降噪和 5 月 28 日发布上市的信息。",
    interactionFlow: "用户在会议、展会或通话中佩戴眼镜，通过语音、视线和设备输入触发同声传译、面对面翻译、线上同传、通话翻译、视觉翻译、提词、会议记录和任务处理。资料描述“看谁、听谁、翻谁”：5 颗气导麦克风、1 颗骨传导麦克风、声源定位、视觉识别和唇动识别共同筛选目标发言人。GlassClaw 可基于已经看到和听到的内容检索资料、生成方案/邮件，并在演示中完成多端交接。",
    specsOrStack: "公开资料支持约 40g 镁铝合金镜架、树脂衍射光波导镜片、定制微型光机模组、5 颗气导麦克风 + 1 颗骨传导麦克风、唇动识别、多模态降噪、双目单色显示、GlassClaw、AstronClaw 架构与讯飞自研多语言大模型；36Kr 报道为 122 种语言实时互译。标准款售价 4299 元，续航款 4699 元。处理器、RAM、显示分辨率、摄像头型号、续航小时数、录音保存策略和端云切分为 source not stated。",
    useCases: "产品场景集中在跨语言商务：展会与机场中的面对面翻译、会议和演讲提词、通话翻译、采访记录、视觉翻译、复杂声场里的目标说话人捕捉，以及从活动海报提取信息后生成合作提案和邮件。它把“听懂—翻译—记录—生成—分发”串成一条工作流，面向经常跨语言沟通且不能持续盯手机的人。",
    painPointsSolved: "它要解决的是会议中多个人同时说话、翻译工具需要频繁切换、提词器与记录工具分离、以及沟通结束后还要手动整理材料的问题。唇动识别和声源选择把“谁在说话”变成系统输入，双目显示把译文/提词放入视野，GlassClaw 把内容整理延伸到提案和邮件。风险是多模态判断一旦选错人、翻译延迟或 Agent 生成越权，错误会直接进入商务沟通。",
    newTech: "产品新意在多模态降噪与 Agent 工作流的组合：声音阵列、骨传导、唇动和视觉共同锁定目标，再把识别结果交给同传、视觉翻译或 GlassClaw；GlassClaw 不是单一问答，而是支持信息采集、检索、文档生成和邮件分发的任务链。对 HCI 来说，关键交互从“翻译一句”变成“持续判断谁、听什么、显示什么、何时生成并发送”。",
    availability: "36Kr 报道称标准款 4299 元、续航款 4699 元，5 月 28 日开启预约、6 月 15 日开启 618 首发全款预售，全国约 1000 家门店提供体验、购买和验光配镜。科大讯飞年度报告写明产品定于 2026 年 5 月 28 日在澳门正式发布上市。国际销售、实际库存、续航款差异、软件订阅、API、数据保留和企业管理能力为 source not stated。",
    limitsOrUnknowns: "公开证据主要来自发布会、媒体现场和公司年报，缺少长时间独立评测。未知包括 122 种语言的逐语言质量、多人声场误选率、唇动识别在口罩/侧脸/弱光下的表现、显示户外可读性、连续翻译和 GlassClaw 混合负载续航、生成内容的确认与撤回、以及跨端发送前的权限界面。公司演示证明流程存在，不等于真实商务现场稳定。",
    productVerdict: "讯飞 AI 眼镜是中国线里工作流定义最完整的一款：它把翻译、提词、记录和 GlassClaw Agent 放在同一副约 40g 的显示眼镜里，价格和渠道也已公开。它的真正挑战不是功能数量，而是“看谁、听谁、翻谁、生成什么、发给谁”的连续状态能否被用户审阅和纠错。本文按 confirmed product 处理，但把体验质量与端云细节保留为待验证项。"
  },
  en: {
    productName: "iFlytek AI Glasses + GlassClaw",
    productType: "iFlytek AI Glasses are display-enabled multimodal AI glasses launched by iFlytek in Macau on May 28, 2026, positioned as a ‘super AI assistant in front of your eyes.’ The 36Kr launch report lists an approximately 40-gram frame, full-scenario translation, multimodal noise reduction, prompting, and GlassClaw. iFlytek’s annual report adds self-developed simultaneous interpretation and multilingual models, AI visual and speech translation, lip-motion noise reduction, and a May 28 market launch.",
    interactionFlow: "A wearer uses voice, gaze, and device controls during a meeting, exhibition, or call to start simultaneous interpretation, face-to-face translation, online interpretation, call translation, visual translation, prompting, meeting notes, and task processing. The reported interaction is ‘who to look at, who to listen to, who to translate’: five air-conduction microphones, one bone-conduction microphone, sound-source localization, visual recognition, and lip-motion recognition help select the target speaker. GlassClaw can use what the glasses have seen and heard to retrieve information, generate a proposal or email, and hand work across devices in the demonstrated flow.",
    specsOrStack: "Public sources support an approximately 40-gram magnesium-aluminium frame, resin diffractive waveguide lenses, a custom micro-optical engine, five air-conduction microphones plus one bone-conduction microphone, lip-motion recognition, multimodal noise reduction, binocular monochrome display, GlassClaw, AstronClaw architecture, and iFlytek multilingual models. The 36Kr report says real-time translation across 122 languages. The standard model is priced at RMB 4,299 and the longer-battery model at RMB 4,699. Processor, RAM, display resolution, camera model, runtime in hours, recording retention, and edge/cloud split are source not stated.",
    useCases: "The product focuses on cross-language business: face-to-face translation at an exhibition or airport, prompts for meetings and presentations, call translation, interview notes, visual translation, target-speaker capture in noisy rooms, and extracting information from an event poster to generate a partnership proposal and email. It connects ‘hear, translate, record, generate, distribute’ into one workflow for people who communicate across languages and cannot keep looking down at a phone.",
    painPointsSolved: "It targets multiple-speaker overlap, tool switching during translation, separate prompting and note-taking systems, and the manual cleanup required after a meeting. Lip-motion recognition and sound-source selection turn ‘who is speaking?’ into a system input; binocular display puts translation and prompts into view; GlassClaw extends capture into a proposal and email. The risk is direct: selecting the wrong speaker, delayed translation, or an overreaching agent can inject errors into a business interaction.",
    newTech: "The product combines multimodal noise reduction with an agent workflow. Microphones, bone conduction, lip motion, and vision help select a target, after which interpretation, visual translation, or GlassClaw acts. GlassClaw is framed as more than Q&A: it supports capture, retrieval, document generation, and email delivery. The HCI problem therefore becomes continuous: who is selected, what is heard, what is shown, what is generated, and when it is sent.",
    availability: "36Kr reports a RMB 4,299 standard model and RMB 4,699 longer-battery model, reservations from May 28, full-price 618 presale from June 15, and about 1,000 Chinese stores offering trial, purchase, and prescription fitting. iFlytek’s annual report says the product was scheduled to launch in Macau on May 28, 2026. International sales, inventory, the exact battery-model difference, subscriptions, API access, retention, and enterprise administration remain source not stated.",
    limitsOrUnknowns: "The evidence is mainly a launch event, media demonstrations, and company reporting; long-term independent review is missing. Unknowns include language-by-language quality across 122 languages, wrong-speaker rate, lip recognition with masks, profile faces, or low light, outdoor display legibility, mixed-load runtime during translation plus GlassClaw, confirmation and rollback for generated content, and permission UI before cross-device sending. A demonstration proves that the flow exists, not that it is reliable in a real business setting.",
    productVerdict: "iFlytek AI Glasses are one of the most complete China-market workflow products in this scan: translation, prompting, notes, and the GlassClaw agent sit in one roughly 40-gram display frame, with public price and retail channels. The real test is not feature count. It is whether the continuous state of who is heard, what is translated, what is generated, and who receives it remains reviewable and correctable. Treat it as a confirmed product with experience quality and edge/cloud details still to validate."
  }
});

const makeScan = (config) => ({
  id: config.id, section: config.section, zhHeadline: config.zhHeadline, enHeadline: config.enHeadline,
  zhFact: config.zhFact, enFact: config.enFact, zhValue: config.zhValue, enValue: config.enValue,
  zhHciLens: config.zhHciLens, enHciLens: config.enHciLens, zhImplication: config.zhImplication, enImplication: config.enImplication,
  sourceDate: config.sourceDate, evidenceLabel: config.evidenceLabel, evidenceStrength: config.evidenceStrength,
  visual: config.visual, sources: config.sources, dossierKind: "scan", dossier: { zh: config.zh, en: config.en }
});

const openGlass = makeScan({
  id: "openglass-on-device-event-vision-research", section: "research",
  zhHeadline: "研究扫描：OpenGlass 把端侧事件视觉与功耗管理做成可复用原型",
  enHeadline: "Research scan: OpenGlass makes event-based vision and power management a reusable prototype",
  zhFact: "OpenGlass 是 2026-06-05 提交、6 月 8 日修订的 arXiv research signal，不是已上市眼镜。论文公开模块化 FPC interposer、nRF5340 event-driven wake-up、GAP9 RISC-V SoC、Prophesee GENX320 event camera、200mAh 电池和开源硬件/固件/模型。",
  enFact: "OpenGlass is an arXiv research signal submitted June 5 and revised June 8, 2026, not a shipped glasses product. The paper exposes a modular FPC interposer, nRF5340 event-driven wake-up, a GAP9 RISC-V SoC, a Prophesee GENX320 event camera, a 200mAh battery, and open hardware, firmware, and models.",
  zhValue: "它值得看，因为它把“眼镜一直在看”拆成事件唤醒、端侧推理和功耗预算；但论文原型的 11.5 小时、83.94% 和 78.3ms 不能直接转译成消费产品续航、准确率或安全性。", enValue: "It matters as a hardware-software pattern: event wake-up, edge inference, and a power budget are designed together. The prototype’s 11.5-hour, 83.94%, and 78.3ms numbers cannot be promoted to consumer runtime, accuracy, or safety.",
  zhHciLens: ["事件唤醒", "端侧反馈", "研究到产品的证据边界"], enHciLens: ["event wake-up", "edge feedback", "research-to-product evidence boundary"],
  zhImplication: "研究信号提示：如果 AI 眼镜要长期工作，系统必须只在相关变化发生时唤醒，并把端侧推理完成/失败状态告诉用户；当前还没有真实佩戴者、社会接受度、隐私治理和量产成本证据。", enImplication: "The HCI implication is that always-on eyewear needs event-triggered sensing and visible edge-inference status; there is no evidence yet for real wearers, social acceptance, privacy governance, or production cost.",
  sourceDate: "2026-06-05 arXiv submission · 2026-06-08 revision", evidenceLabel: "research signal", evidenceStrength: "research signal · open hardware prototype · downgraded",
  visual: visual("openglass-research-source-2026-06.png", 1600, 1000, "OpenGlass arXiv paper", "https://arxiv.org/abs/2606.07431", "arXiv 论文页面截图；端侧事件视觉、功耗与开源范围均为研究证据。", "arXiv paper page; event-based vision, power management, and open-source scope are research evidence."),
  sources: [source("OpenGlass arXiv", "https://arxiv.org/abs/2606.07431"), source("OpenGlass HTML", "https://arxiv.org/html/2606.07431"), source("Prophesee GENX320", "https://www.prophesee.ai/event-based-sensor-genx320/")],
  zh: { productName: "OpenGlass research prototype", productType: "研究型开源智能眼镜平台，不能写成消费产品。", interactionFlow: "事件相机检测变化，nRF5340 触发 GAP9 进行端侧手势推理，系统在推理间歇保持低功耗；用户交互仍是论文演示，不包含完整日常佩戴流程。", specsOrStack: "FPC interposer、nRF5340、GAP9 RISC-V、Prophesee GENX320、200mAh 电池、LynX 数据集，论文报告最高 11.5 小时连续端侧 ML、83.94% accuracy 和 78.3ms latency。", useCases: "研究手势识别、开放式传感器实验和低功耗视觉交互。", painPointsSolved: "把持续感知的功耗和计算瓶颈拆成事件唤醒与端侧推理问题。", newTech: "事件相机、模块化摄像头接口和硬件软件协同功耗管理。", availability: "论文、硬件设计、固件和模型公开；没有消费级发货、价格、保修或用户支持。", limitsOrUnknowns: "缺少量产、长期佩戴、隐私、误触发和真实场景证据，所有结果保持研究信号。", productVerdict: "作为研究 watch item 保留，不能替代可购买产品证据。" },
  en: { productName: "OpenGlass research prototype", productType: "An open smart-glasses research platform, not a consumer product.", interactionFlow: "An event camera detects change, the nRF5340 wakes the GAP9 for on-device gesture inference, and the system sleeps between inferences; the paper does not provide a complete daily-wear interaction flow.", specsOrStack: "FPC interposer, nRF5340, GAP9 RISC-V, Prophesee GENX320, 200mAh battery, and the LynX dataset; the paper reports up to 11.5 hours of continuous edge ML, 83.94% accuracy, and 78.3ms latency.", useCases: "Gesture-recognition research, open sensor experiments, and low-power visual interaction.", painPointsSolved: "It separates the power and compute bottleneck of continuous sensing into event wake-up and edge inference problems.", newTech: "Event-based vision, a modular camera interface, and hardware-software co-designed power management.", availability: "Paper, hardware designs, firmware, and models are public; there is no consumer shipping, price, warranty, or support evidence.", limitsOrUnknowns: "Mass production, all-day wear, privacy, false wakes, and real-world performance are unverified; keep every claim at research-signal level.", productVerdict: "Keep as a research watch item, never as a substitute for shipping-product evidence." }
});

const community = makeScan({
  id: "community-ai-glasses-2026-07-20-scan", section: "community",
  zhHeadline: "社区扫描：眼镜 agent 开始被要求直接完成任务，信任问题随之上升",
  enHeadline: "Community scan: glasses agents are now asked to complete tasks, raising the trust burden",
  zhFact: "本次扫描查看 Reddit r/augmentedreality 的 2026-07-19 帖子：用户称把 Hermes agent 放到 Meta Ray-Bans 上，让它在健身房创建 workout app，并把导航和计时器放进眼镜工作流；这是单个用户叙述，不等于产品官方能力或独立复现。另保留 WAIC 展示帖，用来对照硬件、电池、舒适度和开发者工具缺口。",
  enFact: "This scan checked a July 19 Reddit r/augmentedreality post in which a user says Hermes, running through Meta Ray-Bans, created a workout app in a gym and put navigation and a timer into the glasses workflow. This is one user account, not an official capability claim or independent reproduction. The WAIC demo post remains as a contrast for hardware, battery, comfort, and developer-tool gaps.",
  zhValue: "这条社区信号把 AI 眼镜从“回答问题”推到了“执行任务”：一旦 agent 能创建 app、导航和计时，用户就需要知道它调用了什么工具、改了什么状态、如何撤销。当前证据不足以确认 Hermes、Meta Ray-Bans 或该 app 的具体实现。", enValue: "The signal moves glasses from answering questions toward executing tasks: once an agent can create an app, navigate, and run a timer, users need to know which tools were called, what state changed, and how to undo it. The evidence is insufficient to confirm the exact Hermes, Meta Ray-Bans, or app implementation.",
  zhHciLens: ["摩擦问题清单", "证据强度", "等待实测"], enHciLens: ["friction checklist", "evidence strength", "wait for hands-on evidence"],
  zhImplication: "社区讨论只能提示下一轮验证问题，不能证明 agent 已经安全地修改了眼镜端或手机端状态。", enImplication: "Community discussion can shape the next validation questions, but cannot prove that an agent safely changed glasses-side or phone-side state.",
  sourceDate: "2026-07-19 Reddit agent-use post · 2026-07-15 WAIC post", evidenceLabel: "review/community friction", evidenceStrength: "review/community friction · single-user account · downgraded",
  visual: visual("community-waic-glasses-source-2026-07.png", 1600, 1000, "Reddit AI glasses community scan", "https://www.reddit.com/r/augmentedreality/comments/1v0dbcy/my_ai_agent_lives_on_my_meta_raybans_i_asked_it/", "Reddit 社区页面截图作为摩擦证据：AI 眼镜 agent 被要求创建 app、导航和计时器；这是单个用户叙述，不代表官方能力或普遍可用性。", "Reddit community page used as friction evidence: a glasses agent is asked to create an app, navigate, and run a timer; it is one user account, not an official or broadly available capability."),
  sources: [source("Reddit r/augmentedreality agent-use post", "https://www.reddit.com/r/augmentedreality/comments/1v0dbcy/my_ai_agent_lives_on_my_meta_raybans_i_asked_it/"), source("Reddit r/augmentedreality WAIC post", "https://www.reddit.com/r/augmentedreality/comments/1uwu064/anyone_attending_waic_2026_well_be_demoing_our/"), source("Reddit smart-glasses navigation test", "https://www.reddit.com/r/SmartGlasses/comments/1t4z2kg/i_tested_7_smart_glasses_for_real-world_navigation_across_europe_and_the_u_s/")],
  zh: { productName: "AI glasses agent community scan", productType: "社区摩擦扫描，不是已确认产品。", interactionFlow: "一条 Reddit 叙述称 agent 在 Meta Ray-Bans 场景中创建 workout app、导航和计时器；另一条 WAIC 帖子列出硬件、软件、AI、电池、舒适度和开发者工具待验证。", specsOrStack: "社区材料没有提供 Hermes 版本、Meta API、手机端执行链、权限、芯片、OS、价格或出货信息；因此不能把实现细节补写进去。", useCases: "用于定义 agent 在眼镜上执行任务时的授权、状态反馈、撤销和失败恢复验证。", painPointsSolved: "把从“问答”进入“执行”的新摩擦显式化，同时保留硬件与开发者工具缺口。", newTech: "没有足够证据确认新技术；保持 weak/community signal。", availability: "帖子只描述个人使用和展会展示，没有确认公开 API、零售能力或可复现实验。", limitsOrUnknowns: "单个用户叙述、无独立复现、无 API 和工具调用日志；下一步应寻找可复现 demo、权限界面和撤销路径。", productVerdict: "保留为 review/community friction，不升级为产品事实。" },
  en: { productName: "AI glasses agent community scan", productType: "A community-friction scan, not a confirmed product.", interactionFlow: "One Reddit account says an agent in a Meta Ray-Bans context created a workout app, navigation, and a timer; a separate WAIC post lists hardware, software, AI, battery, comfort, and developer tools as open validation gaps.", specsOrStack: "The community material provides no Hermes version, Meta API, phone-side execution chain, permissions, chip, OS, price, or shipping evidence, so those implementation details cannot be filled in.", useCases: "It defines validation questions for agent actions on glasses: authorization, state feedback, undo, and failure recovery.", painPointsSolved: "It makes the new friction of moving from asking to executing explicit while retaining the hardware and developer-tool gap list.", newTech: "No new technology is confirmed; retain a weak/community signal.", availability: "The posts describe a personal use account and an exhibition preview, not a public API, retail capability, or reproducible experiment.", limitsOrUnknowns: "Single-user account, no independent reproduction, no API or tool-call logs; the next useful evidence is a reproducible demo with permission and undo surfaces.", productVerdict: "Keep it as review/community friction, not product fact." }
});

const topics = [
  rayneo, memoMind, iflytek,
  carry("android-xr-intelligent-eyewear-developer-surface", "official"),
  carry("meta-ai-glasses-capture-led-privacy-update", "official"),
  carry("rokid-smart-ai-glasses-yodaos", "china"),
  carry("htc-vive-eagle-local-ai-glasses", "reviews"),
  carry("brilliant-labs-halo-open-source-ai-glasses", "wild"),
  carry("snap-specs-agent-first-ar-glasses", "official"),
  carry("even-g2-camera-free-productivity-glasses", "reviews"),
  carry("qualcomm-snapdragon-reality-elite-on-device-xr", "global"),
  carry("microsoft-project-solara-mdep-agent-first-devices", "official"),
  community,
  carry("openai-gpt-live-voice-interface", "official"),
  carry("nvidia-xr-ai-viture-helix", "global"),
  carry("zai-zcode-china-global", "china"),
  openGlass,
  carry("patent-lane-glasses-ip-scan", "patent")
];

const currentSources = {
  metaFaq: "https://about.fb.com/news/2026/07/metas-ai-glasses-your-questions-answered/",
  googleTrust: "https://www.androidcentral.com/wearables/google-integrating-ai-glasses-anti-tampering-protections-into-android-xr-from-day-one",
  googleEyewear: "https://blog.google/products-and-platforms/platforms/android/android-xr-io-2026/",
  rokidWaic: "https://36kr.com/p/3899652787980167",
  visionClaw: "https://arxiv.org/abs/2604.03486",
  patent: "https://patents.google.com/patent/US20260086650A1/en",
  moonix: "https://moonix.cn/",
  moonixLaunch: "https://www.ithome.com/0/978/206.htm",
  monako: "https://www.producthunt.com/products/monako-glass",
  waic: "https://www.36kr.com/p/3904188372485763"
};
const currentMeta = topics.find((topic) => topic.id === "meta-ai-glasses-capture-led-privacy-update");
currentMeta.sourceDate = "2026-07-16 official Meta FAQ · 2026-07-17 Android Central trust interview · 2026-07-20 follow-up";
currentMeta.sources.push(source("Meta AI Glasses FAQ", currentSources.metaFaq), source("Android Central Android XR anti-tampering interview", currentSources.googleTrust));
const currentAndroid = topics.find((topic) => topic.id === "android-xr-intelligent-eyewear-developer-surface");
currentAndroid.sources.push(source("Google Android XR intelligent eyewear announcement", currentSources.googleEyewear), source("Android Central anti-tampering interview", currentSources.googleTrust));
const currentRokid = topics.find((topic) => topic.id === "rokid-smart-ai-glasses-yodaos");
currentRokid.sources.push(source("36Kr Rokid WAIC 2026 YodaOS launch", currentSources.rokidWaic));
const currentResearch = topics.find((topic) => topic.id === "openglass-on-device-event-vision-research");
currentResearch.sources.push(source("VisionClaw arXiv research signal", currentSources.visionClaw));
const currentPatent = topics.find((topic) => topic.id === "patent-lane-glasses-ip-scan");
currentPatent.sources.push(source("Google Patents conversational smart-glasses assistant", currentSources.patent));
const moonix = makeProduct({
  id: "moonix-ai-glasses-ultralight-memory", section: "china",
  zhHeadline: "MOONIX 把 AI 眼镜做成一副‘先正常佩戴，再谈智能’的眼镜",
  enHeadline: "MOONIX makes the AI glasses case start with normal wearability",
  sourceDate: "2026-07 official MOONIX product page · 2026-07-17 IT之家 launch report",
  evidenceLabel: "confirmed product", evidenceStrength: "confirmed product · official product page · China product report",
  visual: visual("moonix-official-source-2026-07.png", 1600, 1000, "MOONIX official product page", "https://moonix.cn/", "MOONIX 官网截图：14.9g、16h、AI 记录/总结、6 麦克风阵列和日常场景。", "MOONIX official page: 14.9g, 16h, AI capture and summary, six-microphone array, and everyday scenarios."),
  hciZh: ["重量即入口", "记录—总结闭环", "相机边界"], hciEn: ["weight as entry", "capture-to-summary loop", "camera boundary"],
  sources: [
    source("MOONIX official product page", "https://moonix.cn/"),
    source("MOONIX official English product page", "https://moonix.cn/en"),
    source("MOONIX downloads / companion app", "https://moonix.cn/download/"),
    source("IT之家 launch and availability report", "https://www.ithome.com/0/978/206.htm"),
    source("深圳湾 product interview", "https://www.shenzhenware.com/articles/16831")
  ],
  zh: {
    productName: "MOONIX 莫奈 AI 眼镜",
    productType: "MOONIX 是心眸科技推出的日常型音频/AI 眼镜，标准款官方强调约 14.9g 轻量、约 16 小时全天续航、主动式 AI、音频、麦克风、翻译、提醒、语音助手与 AI 记录/总结。它没有把显示、导航和视觉理解全部塞进第一代产品，而是先解决‘能不能每天戴着’与‘重要信息能不能被留下来’。官网 FAQ 还区分标准版与 Pro：Pro 扩展高清摄像头和音视频记录，标准版偏音频记录与 AI 问答。",
    interactionFlow: "用户先通过 iPhone、iPad 或 Android companion app 配对设备并管理 AI 能力和固件更新；佩戴中通过语音或眼镜上的控制入口触发记录、问答、翻译、提醒与回顾。官网给出的日常节奏是 9:00 灵感捕捉、11:00 课堂讲座、15:00 商务洽谈、20:00 信息回顾，产品把一次次短记录送进 AI 总结和长时个人知识库。标准版的核心路径是‘听见—记录—总结—回看’，而非‘看见—叠加—导航’。具体按键、唤醒词、总结等待时间和失败恢复流程 source not stated。",
    specsOrStack: "官方页面列出标准款约 14.9g、Pro 约 19.9g、约 16h 全天续航、6 麦克风阵列、音频、主动式 AI，以及 iPhone/iPad/Android app 和固件更新入口。官网 FAQ 明确标准版偏音频记录与 AI 问答，Pro 具有高清摄像头与音视频记录能力；官方未公开处理器、RAM、存储、OS/API 版本、网络协议、摄像头型号、音频编码、云端模型、端侧推理比例或具体充电结构。IT之家报道 2026-07-17 全球发售、官方定价 2299 元起；不同版本配置与地区库存仍以官方页面为准。",
    useCases: "具体场景集中在灵感、会议、讲座、面试和通勤信息回顾：用户不用掏手机就能先把语音记下来，之后通过 AI 总结提炼重点，形成可持续追加的个人知识库；翻译、提醒和语音助手承担短任务。6 麦克风阵列被官网放在嘈杂环境精准收音的产品叙述里，适合把‘先保存，再整理’作为主要工作流。标准款减少视觉和相机能力后，适合重视外观、轻量和低打扰的佩戴者；需要拍摄或视觉理解的人必须看 Pro 或其他相机型产品。",
    painPointsSolved: "MOONIX 解决的痛点不是‘手机没有 AI’，而是手机需要被拿出、解锁、找到录音入口，用户才不会丢掉刚发生的想法。14.9g 直接瞄准传统智能眼镜过重、镜腿厚和科技感太强的问题；音频和麦克风把记录入口放到脸上，AI 总结减少会后整理成本，16h 宣传把整天佩戴纳入目标。它也通过标准版不带相机、Pro 才扩展摄像头的产品分层，把隐私与功能选择前置。代价是没有显示或相机的版本无法把信息放回视野，也不能直接理解眼前菜单、路牌和物体。",
    newTech: "公开证据支持的新组合是极轻结构、六麦克风阵列、主动式 AI、语音记录与 AI 总结，以及与手机 app、固件和长期个人知识库相连的连续体验。产品创新更像交互取舍：把摄像头、显示和复杂视觉任务留在更高阶版本或其他设备，把标准版的计算预算集中到收音、记录、提醒和复盘。‘越用越灵’依赖长期信息积累，真正关键的是记录内容何时上传、如何分类、如何删除和是否能导出；这些数据生命周期与 API 细节 source not stated，不能把宣传语直接写成个性化效果保证。",
    availability: "MOONIX 官网已展示标准款与 Pro 的产品、下载、帮助和隐私入口；IT之家报道首款产品于 2026-07-17 全球同步发售，官方定价 2299 元起。官网列出 iPhone/iPad 与 Android 下载入口，但没有在当前页面完整列出每个国家的库存、税费、售后、订阅、AI 服务地区、处方镜片和交付时间。Pro 与标准版的准确价格、镜框组合、相机型号、续航差异和具体销售渠道，以官方结算页和用户指南为准；未披露处写 source not stated。",
    limitsOrUnknowns: "需要继续验证的不是轻量数字本身，而是长期闭环：6 麦克风在地铁、多人会议和风噪中的误收音率；AI 总结的等待、错记和说话人归属；16h 在 AI、蓝牙、持续记录和高音量混合负载下是否成立；标准版如何让用户确认正在记录、暂停和删除；手机断连或云服务不可用时能否继续保存；个人知识库如何检索、导出和清空。官网明确提醒相机、麦克风与云端 AI 的数据处理要看隐私政策，当前证据不足以推断数据默认是否长期保存。",
    productVerdict: "MOONIX 的产品判断很清楚：先把重量、外观、收音和记录做成日常习惯，再让 AI 总结在后台累积价值。它与显示型、相机型眼镜竞争的入口不同，14.9g 与标准版相机边界让社会接受度更容易讨论，也让能力范围更窄。作为 confirmed product，它值得关注的不是‘16h’一句宣传，而是用户是否真的愿意在一天中多次说‘记住这件事’，并且相信记录可见、可删、可回看。长期数据治理、准确率和断连体验仍需实测。"
  },
  en: {
    productName: "MOONIX AI Glasses",
    productType: "MOONIX is an everyday audio and AI glasses product from Xinmou Technology. The standard model is presented around approximately 14.9 grams, about 16 hours of all-day battery, proactive AI, audio, microphones, translation, reminders, a voice assistant, and AI capture plus summary. It does not try to put display, navigation, and visual understanding into the first product surface. It starts with whether people can wear the device every day and whether important information can be retained. The official FAQ distinguishes the standard and Pro models: Pro adds a high-definition camera and audio-video recording, while the standard model focuses on audio capture and AI questions.",
    interactionFlow: "The user first pairs the glasses through the iPhone, iPad, or Android companion app and manages AI capabilities and firmware updates there. During wear, voice and the glasses’ control entry points start capture, questions, translation, reminders, and review. The official page frames a daily rhythm of 9:00 inspiration capture, an 11:00 lecture, a 15:00 business conversation, and a 20:00 information review. Short recordings are turned into AI summaries and a longer-term personal knowledge base. The standard path is hear, capture, summarize, and review rather than see, overlay, and navigate. Exact buttons, wake phrase, summary latency, and failure recovery are source not stated.",
    specsOrStack: "The official product page supports approximately 14.9 grams for the standard model, about 19.9 grams for Pro, an advertised 16-hour all-day battery, a six-microphone array, audio, proactive AI, iPhone/iPad and Android apps, and a firmware-update entry point. The FAQ states that the standard model emphasizes audio capture and AI questions while Pro adds a high-definition camera and audio-video recording. The processor, RAM, storage, OS/API version, network protocol, camera model, audio codec, cloud model, edge-inference split, and charging structure are not published on the cited pages. IT之家 reports global sale from July 17, 2026, with official pricing starting at RMB 2,299; configuration and inventory remain region dependent.",
    useCases: "Concrete jobs are inspiration capture, meetings, lectures, interviews, and commuting review. The wearer can save a spoken thought before taking out a phone, then use AI to extract the important points and build a persistent personal knowledge base. Translation, reminders, and voice assistance cover shorter interventions. The six-microphone array is positioned as a way to capture speech in noisy environments, making ‘save first, organize later’ the central workflow. The camera-free standard model fits people who prioritize appearance, low weight, and low interruption. A person who needs photos or visual understanding must choose Pro or another camera-equipped product.",
    painPointsSolved: "MOONIX targets a problem beyond the lack of AI on a phone: a phone must be pulled out, unlocked, and navigated to a recording entry before the moment is saved. At 14.9 grams, the product directly targets heavy, thick-templed, visibly technological smart glasses. Audio and microphones move capture to the face, AI summaries reduce post-meeting cleanup, and the 16-hour claim makes all-day wear the intended frame. The standard-versus-Pro split also makes privacy and capability a product choice. The tradeoff is equally clear: without a display or camera, the standard model cannot put information back into the field of view or understand a menu, sign, or object in front of the user.",
    newTech: "The public evidence supports a combination of an ultra-light structure, a six-microphone array, proactive AI, voice capture, AI summary, and a continuous layer connected to a phone app, firmware, and a longer-term personal knowledge base. The innovation is an interaction allocation: camera, display, and complex visual jobs are left to the higher-tier model or another device, while the standard device concentrates its budget on listening, capture, reminders, and review. ‘The more you use it, the more it understands you’ depends on persistent information accumulation. The key unanswered questions are when recordings upload, how they are classified, how they are deleted, and whether they can be exported. Data lifecycle and API details are source not stated.",
    availability: "MOONIX’s official site presents standard and Pro products, downloads, help, privacy, and user-agreement entries. IT之家 reports that the first product went on global sale on July 17, 2026, with official pricing from RMB 2,299. The site exposes iPhone/iPad and Android download routes, but the cited pages do not provide a complete list of country inventory, taxes, support, subscriptions, regional AI-service availability, prescription options, or delivery windows. Exact Pro and standard pricing, frame combinations, camera model, runtime differences, and sales channels should be checked at checkout and in the user guide; missing details remain source not stated.",
    limitsOrUnknowns: "The next validation target is not the lightweight number alone but the daily loop: six-microphone false capture in trains, group meetings, and wind; summary latency, misremembered content, and speaker attribution; whether 16 hours holds under AI, Bluetooth, continuous capture, and high-volume mixed load; how the standard model shows recording, pause, and deletion; what remains when the phone or cloud service is unavailable; and how the personal knowledge base is searched, exported, and cleared. The official FAQ points users to privacy policy and agreements for camera, microphone, and cloud AI handling. There is not enough evidence to infer default retention.",
    productVerdict: "MOONIX makes a coherent product bet: establish weight, appearance, capture, and review as a daily habit before adding more visible intelligence. Its entry point differs from display and camera glasses. The 14.9-gram claim and camera boundary make social acceptance easier to discuss, while narrowing the capability surface. As a confirmed product, it is worth watching for whether people repeatedly say ‘remember this’ and trust that the recording is visible, deletable, and retrievable. Long-term data governance, accuracy, and disconnected behavior still require hands-on validation."
  }
});

const monako = makeProduct({
  id: "monako-glass-linux-coding-agent-hud", section: "wild",
  zhHeadline: "Monako Glass 把 coding agent 的‘监控屏’戴到脸上",
  enHeadline: "Monako Glass turns the coding agent monitor into a wearable HUD",
  sourceDate: "2026-06 Product Hunt launch · 2026-07 to 2026-08 announced shipping window",
  evidenceLabel: "startup signal", evidenceStrength: "startup signal · Product Hunt listing · reservation-only · downgraded",
  visual: visual("monako-producthunt-source-2026-07.png", 1600, 1000, "Monako Glass Product Hunt listing", "https://www.producthunt.com/products/monako-glass", "Product Hunt 页面截图：48g、Buildroot Linux、waveguide HUD、MonoOS、gesture input、$399 预订和交付窗口。", "Product Hunt listing: 48g, Buildroot Linux, waveguide HUD, MonoOS, gesture input, $399 reservation, and shipping window."),
  hciZh: ["Agent 状态可见", "离开桌面的反馈", "预订证据边界"], hciEn: ["agent state visibility", "feedback away from the desk", "reservation evidence boundary"],
  sources: [
    source("Monako official website", "https://www.monako.ai/"),
    source("Product Hunt Monako Glass listing", "https://www.producthunt.com/products/monako-glass"),
    source("Product Hunt launch discussion", "https://www.producthunt.com/products/monako-glass#monako-glass"),
    source("Buildroot official downloads", "https://buildroot.org/download.html")
  ],
  zh: {
    productName: "Monako Glass",
    productType: "Monako Glass 是面向开发者的可穿戴 Linux 电脑与 heads-up display，Product Hunt 将它描述为 48g、运行 Buildroot Linux、带 waveguide 显示、骨传导麦克风和手势输入的 coding-agent 设备。它不是把通知、音乐和拍照做得更轻，而是把 Claude Code、Codex 或其他 coding agent 的状态带到离开电脑之后的视野里。当前仍是 reservation-only 的 startup signal，页面没有独立发货评测。",
    interactionFlow: "开发者预订设备后，目标工作流是通过语音/骨传导麦克风提出任务，用手势或手部追踪查看 agent 状态，在 waveguide HUD 上读取短输出、等待、错误或需要确认的节点。Product Hunt 的产品说明称 MonoOS 提供 Lua app layer，agent 可以即时生成并运行 Lua app，不需要传统 build step；因此理论流程是‘描述任务—agent 生成界面—眼前运行—继续追问或确认’。具体语音唤醒、手势字典、代码执行权限、网络连接、错误回滚和手机/电脑伴随方式 source not stated。",
    specsOrStack: "公开页面支持 48g 机身、waveguide heads-up display、bone-conduction microphone、gesture input、0.5 TOPS NPU、Buildroot Linux、MonoOS、Lua app layer、embedded Rive animation runtime、300mAh battery、screen-on 约 4 小时、normal use 约 8 小时，以及 Claude Code、Codex 和其他 coding agent 支持。Product Hunt 还列出 $19 reservation、$399 unit 与 2026 年 7–8 月 shipping window。显示分辨率、FoV、摄像头、RAM、存储、CPU、agent API、权限沙箱、端云模型与安全更新策略 source not stated。",
    useCases: "最直接的场景是开发者离开桌面仍想知道 agent 是否完成、卡住、需要输入或产生错误：在实验室、展会、工位之间移动时用 HUD 监控长任务，必要时通过语音/手势追问。MonoOS 的 Lua app 设想还允许 agent 针对当前任务生成一个轻量界面，而不是让用户回到 IDE 打开新窗口。它更像 agent 的状态面板和控制台，不是完整代码编辑器；复杂 diff、权限确认、密钥输入和最终审查仍然需要更大屏幕。",
    painPointsSolved: "Monako Glass 瞄准 coding agent 的一个具体痛点：agent 可以长时间运行，但开发者必须盯着笔记本才能知道任务有没有继续、失败或等待确认。HUD 把等待与状态反馈从固定屏幕带到身体附近，骨传导麦克风试图保留环境听觉，手势输入为嘈杂环境提供备用控制。代价是把代码工作流放到一个更窄、更容易分心的视野里；如果 agent 输出太长、状态不透明或错误不可撤销，眼前的可见性只会增加焦虑。",
    newTech: "这里最特别的技术叙述不是单个模型，而是 Linux 设备、waveguide HUD、0.5 TOPS NPU、gesture input 与 Lua app runtime 的组合。让 agent 直接生成并运行 Lua app，意味着应用层可能成为动态产物，减少预编译和安装步骤；Rive runtime 则为状态反馈提供动画基础。这个方向把 coding agent 从 IDE plugin 推向可穿戴系统 surface，但公开资料没有证明 agent 真的能在设备端安全生成、签名、运行任意 app，也没有展示权限、网络、代码秘密和更新隔离。",
    availability: "Product Hunt 页面显示预订价 $19，可抵扣 $399 unit，并给出 2026 年 7–8 月发货窗口；页面同时标注 reservation-only、尚无 reviews。官方 Monako 网站是 JavaScript 应用，公开可见的独立技术规格与支持政策有限。当前没有可核验的量产库存、地区售后、退货、开发者 SDK 下载、源码仓库、操作系统版本或真实用户发货评测，因此不能写成已经普遍可买或已经验证的开发工具。",
    limitsOrUnknowns: "需要验证的核心包括：48g 是否包含完整镜架与电池；4 小时 screen-on/8 小时 normal use 如何测得；0.5 TOPS NPU 承担什么任务；Lua app 是否真能在无 build step 下稳定运行；Claude Code/Codex 接入是本地、远程还是通过用户已有电脑；HUD 能否显示长日志、diff 和安全确认；agent 失败时如何暂停、撤销与恢复；网络断开、密钥暴露和恶意生成 app 如何处理。Product Hunt 评论已经提出源码授权、延迟和可实现性的疑问，这些只是社区 friction，不能当作官方故障结论。",
    productVerdict: "Monako Glass 是一个清楚的 startup signal：它没有重新包装‘AI 眼镜能拍照’，而是针对 agent 长任务的等待与反馈做专用硬件。48g、Linux、HUD、Lua app 和 coding-agent 入口形成了值得观察的产品假设，但 reservation、无独立评测和安全细节缺口决定了它必须降级。设计团队可先研究‘agent 状态如何在移动中被理解’，暂时不要把它当作已验证的生产级 coding surface。"
  },
  en: {
    productName: "Monako Glass",
    productType: "Monako Glass is a wearable Linux computer and heads-up display for developers. Product Hunt describes a 48-gram device with a waveguide display, bone-conduction microphone, and gesture input running Buildroot Linux. It is not trying to make notifications, music, and photos smaller. It is trying to put the state of Claude Code, Codex, or another coding agent into the wearer’s field of view after leaving the computer. It remains a reservation-only startup signal, with no independent shipping review on the cited page.",
    interactionFlow: "The intended workflow is to describe a task through voice or the bone-conduction microphone, use gesture or hand tracking to inspect agent state, and read short output, waiting, error, or confirmation states in the waveguide HUD. Product Hunt says MonoOS provides a Lua application layer where an agent can generate and run a Lua app immediately without a traditional build step. The conceptual loop is describe a task, let the agent generate the surface, run it in view, and continue or confirm. Wake phrase, gesture vocabulary, code-execution permissions, network connection, rollback, and companion-computer behavior are source not stated.",
    specsOrStack: "The public listing supports a 48-gram frame, waveguide heads-up display, bone-conduction microphone, gesture input, a 0.5 TOPS NPU, Buildroot Linux, MonoOS, a Lua app layer, an embedded Rive animation runtime, a 300mAh battery, approximately four hours of screen-on use, approximately eight hours of normal use, and support for Claude Code, Codex, and other coding agents. Product Hunt also lists a $19 reservation toward a $399 unit and a July-to-August 2026 shipping window. Display resolution, field of view, camera, RAM, storage, CPU, agent API, permission sandbox, edge/cloud model, and security-update policy are source not stated.",
    useCases: "The immediate job is for a developer who wants to leave the desk while still knowing whether an agent completed, stalled, needs input, or produced an error. In a lab, exhibition hall, or moving workday, the HUD could monitor a long task and allow a voice or gesture follow-up. The Lua app concept could let an agent generate a lightweight task-specific interface instead of sending the user back to an IDE and another window. This is an agent status panel and control surface, not a complete code editor. Long diffs, permission review, secret entry, and final code inspection still need a larger screen.",
    painPointsSolved: "Monako Glass targets a specific coding-agent problem: an agent may run for a long time, but the developer must keep watching a laptop to know whether it is progressing, failing, or waiting for confirmation. A HUD moves waiting and state feedback from a fixed monitor closer to the body, while the bone-conduction microphone aims to preserve environmental hearing. The cost is putting a dense engineering workflow into a narrow and potentially distracting view. If output is too long, state is opaque, or errors cannot be undone, visibility becomes anxiety rather than control.",
    newTech: "The distinctive technical story is the combination of a Linux device, waveguide HUD, 0.5 TOPS NPU, gesture input, and a Lua application runtime. Letting an agent generate and run a Lua app could make the application layer a dynamic artifact and reduce pre-build and installation steps; the Rive runtime supplies an animation basis for status feedback. This moves coding agents from IDE plugins toward a wearable system surface. The public material does not prove that a device-side agent can safely generate, sign, and run arbitrary apps, nor does it show permission, network, code-secret, or update isolation.",
    availability: "Product Hunt lists a $19 reservation that can be applied toward a $399 unit and a July-to-August 2026 shipping window; it also marks the product reservation-only with no reviews. The official Monako site is a JavaScript application with limited independently visible technical specifications and support policy. There is no verifiable evidence in the cited sources for production inventory, regional support, returns, an SDK download, a public source repository, an OS version, or real user shipping reviews. It should not be described as broadly available or as a validated developer tool.",
    limitsOrUnknowns: "The key validation questions are whether 48 grams includes the full frame and battery; how four hours of screen-on and eight hours of normal use were measured; what the 0.5 TOPS NPU actually does; whether Lua apps really run reliably without a build step; whether Claude Code and Codex connect locally, remotely, or through the user’s existing computer; whether the HUD can show long logs, diffs, and security confirmations; and how the system pauses, undoes, and recovers from agent failure. Product Hunt comments raise source-licensing, latency, and feasibility questions. Those are community friction signals, not official failure findings.",
    productVerdict: "Monako Glass is a clear startup signal. It does not repackage the claim that AI glasses can take photos; it builds around the waiting and feedback problem of long-running agents. The 48-gram Linux/HUD/Lua/coding-agent combination is a useful product hypothesis, but reservation status, no independent review, and missing security surfaces require a downgrade. Product teams can study how agent state might be understood while moving, but should not treat this as a validated production coding surface."
  }
});

topics.unshift(moonix, monako);
const currentCommunity = topics.find((topic) => topic.id === "community-ai-glasses-2026-07-20-scan");
currentCommunity.sourceDate = `${currentCommunity.sourceDate} · 2026-07-21 follow-up`;
currentCommunity.sources.push(source("Reddit July 19 glasses-agent post", "https://www.reddit.com/r/augmentedreality/comments/1v0dbcy/my_ai_agent_lives_on_my_meta_raybans_i_asked_it/"));

const issue = {
  date: "2026-07-21", timezone: "America/Toronto",
  zhTitle: "AI Daily 2026-07-21：AI 眼镜开始做减法",
  enTitle: "AI Daily 2026-07-21: AI Glasses Start Subtracting",
  zhSummary: "今天的产品信号不再只比谁把更多模型塞进镜框：MOONIX 用 14.9g、无相机标准版和 AI 记录/总结押注全天佩戴；Monako Glass 用 48g Linux、waveguide HUD 和 Lua app layer 把 coding agent 的等待状态带离桌面。Meta/Android XR 继续补隐私硬件约束，RayNeo、讯飞、Rokid、OpenGlass 和社区材料把显示、翻译、端侧功耗与可撤销执行放进同一张验证表。",
  enSummary: "Today’s product signals are no longer only about which model fits into a frame. MOONIX bets on all-day wear with 14.9 grams, a camera-free standard model, and AI capture plus summary. Monako Glass bets on a 48-gram Linux computer, waveguide HUD, and Lua application layer to carry coding-agent waiting states away from the desk. Meta and Android XR keep adding hard privacy constraints, while RayNeo, iFlytek, Rokid, OpenGlass, and community evidence keep display, translation, edge power, and undo on one validation sheet.",
  tags: ["AI glasses", "wearability", "camera-free", "MOONIX", "coding agents", "Android XR", "privacy UX", "on-device AI"],
  sourceTypes: ["official", "reviews", "community", "wild", "research", "patent", "china", "global"],
  zhPath: "./2026-07-21/zh/", enPath: "./2026-07-21/en/", sourcesPath: "./2026-07-21/sources.md",
  coverStory: {
    topicId: "moonix-ai-glasses-ultralight-memory",
    zhTitle: "AI 眼镜开始做减法：先让人愿意一直戴",
    enTitle: "AI glasses start subtracting: make people willing to keep wearing them",
    imagePath: "assets/moonix-official-source-2026-07.png", imageWidth: 1600, imageHeight: 1000,
    primarySourceUrl: currentSources.moonix, imageSourceUrl: currentSources.moonix,
    evidenceStrength: "confirmed product · official MOONIX page · China launch report · comparison with camera/display routes",
    whyCover: "The strongest product question today is not how many capabilities can fit into smart glasses. It is which capability earns the right to stay on the face. MOONIX removes display from the standard product, keeps audio, six microphones, capture, summary, and a 14.9-gram frame. Monako makes the opposite bet by putting a Linux coding-agent HUD on the face. Meta’s anti-tamper work shows that even after weight and utility, social trust remains a hardware state.",
    zhSummary: ["MOONIX 官网把约 14.9g、约 16h、6 麦克风、AI 记录/总结和主动式 AI 放进日常佩戴闭环。", "标准版偏音频记录与 AI 问答，Pro 才扩展高清摄像头和音视频记录；能力边界被产品分层显式化。", "Monako、RayNeo、Meta 和 Android XR 分别代表 agent HUD、显示、相机隐私与平台信任的相反取舍。"],
    enSummary: ["MOONIX puts approximately 14.9 grams, about 16 hours, six microphones, AI capture and summary, and proactive AI into an everyday-wear loop.", "The standard model emphasizes audio capture and AI questions while Pro adds a high-definition camera and audio-video recording; capability boundaries become an explicit product split.", "Monako, RayNeo, Meta, and Android XR represent contrasting choices around agent HUDs, display, camera privacy, and platform trust." ]
  },
  designDesk: {
    zhTitle: "Design Desk：先设计‘值得一直戴’的状态",
    enTitle: "Design Desk: Design the state that earns continuous wear",
    zhIntro: "今天的证据把眼镜产品压缩成一条更具体的链：重量是否让人愿意戴、记录是否让人愿意反复说、显示是否值得占用视野、相机是否能被旁观者验证、agent 是否能在移动中反馈、任务失败时如何停，以及数据如何删除。",
    enIntro: "Today’s evidence compresses the glasses product into a more concrete chain: whether weight earns wear, whether capture earns repeated use, whether display deserves the field of view, whether camera state is verifiable to bystanders, whether an agent can report while the user moves, how failure stops, and how data is deleted.",
    zhItems: [
      { label: "重量要先变成习惯", body: "MOONIX 把标准款压到约 14.9g，RayNeo 则用 76g 换双目显示；两条路线都要求信息足够短、足够高频、足够值得把设备留在脸上。" },
      { label: "相机边界要可验证", body: "Meta 用 capture LED 和检测到篡改后禁用相机，MemoMind 直接去掉相机；公共信任需要旁观者可见、用户可验证、系统可强制执行。" },
      { label: "显示不是手机页面缩小", body: "双目 MicroLED、透明显示与 Compose Glimmer 都要求 glanceable hierarchy；每一条内容都要能停、退回、恢复。" },
      { label: "Agent 状态要能离桌面读懂", body: "Monako 把 coding agent 的等待、错误和确认想象成 HUD 状态；社区则讨论眼镜 agent 创建 app、导航和计时器，执行必须显示权限、工具调用、状态变化和撤销入口。" },
      { label: "端侧推理要补偿等待", body: "OpenGlass 的事件唤醒路线提示功耗预算；产品需要让用户知道何时在本地运行、何时上传、何时降级。" },
      { label: "记录数据要可删", body: "MOONIX 的 AI 记录、MemoMind 的语音记录、OpenGlass/VisionClaw 的研究感知和专利材料都只能生成验证问题；上传、保存、导出与清除必须成为可见状态。" }
    ],
    enItems: [
      { label: "Weight must become habit", body: "MOONIX targets approximately 14.9 grams while RayNeo spends 76 grams on binocular display; both routes require content that is short, frequent, and worth keeping on the face." },
      { label: "Camera boundaries must be verifiable", body: "Meta couples a capture LED to camera disablement on tamper; MemoMind removes the camera. Public trust needs visible state, user verification, and enforced behavior." },
      { label: "A display is not a shrunken phone", body: "Binocular MicroLED, optical see-through, and Compose Glimmer demand glanceable hierarchy; every cue needs a stop, return, and recovery path." },
      { label: "Agent state must travel off-screen", body: "Monako imagines coding-agent waiting, error, and confirmation as HUD states; community discussion asks glasses agents to create apps, navigate, and run timers, so execution needs permissions, tool visibility, state change, and undo." },
      { label: "Edge inference must explain waiting", body: "OpenGlass points to event-driven power budgets; products need to show when work stays local, when data leaves, and when the system degrades." },
      { label: "Captured data must be deletable", body: "MOONIX capture, MemoMind voice notes, OpenGlass/VisionClaw sensing, and patent material generate validation questions; upload, retention, export, and deletion must become visible states." }
    ]
  },
  watchlistZh: ["MOONIX：14.9g、16h 和 6 麦克风在连续记录混合负载下的实测；标准版记录状态、删除和断连回退。", "Monako Glass：7–8 月交付、Lua app 是否真能无 build step 运行、agent 权限/密钥隔离和 HUD 可读性。", "Meta/Android XR：LED 防篡改逐型号覆盖、误判恢复、旁观者日光可见性和公共场所提示。", "Google/Samsung Intelligent Eyewear：秋季真实硬件、权限确认、相机状态和断连回退。", "Rokid YodaOS：WAIC 发布后的真实设备、生态 API、模型路由和渠道交付。", "RayNeo X3 Pro：混合负载续航、76g 长时间佩戴、Creator Mode 与地区 Gemini 体验。", "MemoMind One 与讯飞 AI 眼镜：众筹交付、无相机隐私、122 语言质量、GlassClaw 发送前确认。", "社区 agent、OpenGlass/VisionClaw、智能眼镜专利：继续保持 community/research/patent 标签，等待可复现产品证据。"],
  watchlistEn: ["MOONIX: hands-on runtime for 14.9g, 16 hours, and six microphones under continuous mixed capture; recording state, deletion, and disconnected fallback on the standard model.", "Monako Glass: July-August delivery, whether Lua apps really run without a build step, agent permission and secret isolation, and HUD legibility.", "Meta/Android XR: model coverage for LED tamper safeguards, false-positive recovery, daylight bystander visibility, and public-space cues.", "Google/Samsung Intelligent Eyewear: actual autumn hardware, permission confirmation, camera state, and disconnect fallback.", "Rokid YodaOS: real devices after the WAIC launch, ecosystem APIs, model routing, and channel delivery.", "RayNeo X3 Pro: mixed-load runtime, long-term comfort at 76 grams, Creator Mode, and regional Gemini behavior.", "MemoMind and iFlytek: delivery, camera-free privacy, language-by-language quality across 122 languages, and GlassClaw send confirmation.", "Community agent use, OpenGlass/VisionClaw, and smart-glasses patents: keep community, research, and patent labels until reproducible product evidence appears."] ,
  topics
};

await fs.writeFile(issuesPath, JSON.stringify([issue, ...issues.filter((item) => item.date !== "2026-07-21")], null, 2) + "\n");
console.log(`Created 2026-07-21: ${topics.length} topics, ${new Set(topics.flatMap((topic) => topic.sources.map((item) => item.url))).size} unique sources.`);
