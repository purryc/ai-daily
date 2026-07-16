import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const issuesPath = path.join(root, "data", "issues.json");
const issues = JSON.parse(await fs.readFile(issuesPath, "utf8"));
const previous = issues.find((issue) => issue.date === "2026-07-15");
if (!previous) throw new Error("Missing 2026-07-15 source issue");

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
  topic.sourceDate = `${topic.sourceDate} · 2026-07-16 follow-up`;
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
  id: "community-ai-glasses-2026-07-16-scan", section: "community",
  zhHeadline: "社区扫描：WAIC 讨论把电池、舒适度和开发者工具重新列为缺口",
  enHeadline: "Community scan: WAIC discussion puts battery, comfort, and developer tools back on the gap list",
  zhFact: "本次扫描查看 Reddit r/augmentedreality 的 2026-07-15 WAIC 展示帖。帖子列出 AR99 PRO、AI+AR ODM 和 enterprise wearable solutions，并直接询问社区还缺什么：硬件、软件、AI、电池、舒适度和开发者工具；截至抓取时没有评论，因此只作为 friction prompt，不升级为用户共识。",
  enFact: "This scan checked a July 15, 2026 Reddit r/augmentedreality post about a WAIC demo. The post lists AR99 PRO, an AI+AR ODM platform, and enterprise wearable solutions, then asks what is still missing: hardware, software, AI, battery, comfort, or developer tools. At capture time it had no comments, so it is a friction prompt, not user consensus.",
  zhValue: "社区信号没有给出产品事实，却把评测与购买判断的同一组变量说得很直白：续航、佩戴、开发者工具和硬件完成度必须一起过关。接下来应看是否出现真实试用帖、返修/发货反馈或可复现开发文档。", enValue: "The signal adds no product fact, but makes the same variables visible as the reviews: runtime, wearability, developer tools, and hardware completion must pass together. Watch for hands-on posts, shipping or repair reports, and reproducible developer documentation.",
  zhHciLens: ["摩擦问题清单", "证据强度", "等待实测"], enHciLens: ["friction checklist", "evidence strength", "wait for hands-on evidence"],
  zhImplication: "社区讨论只能提示下一轮验证问题，不能证明 WAIC 展示产品已经解决了这些问题。", enImplication: "Community discussion can shape the next validation questions, but cannot prove that the WAIC demo products solve them.",
  sourceDate: "2026-07-15 Reddit post", evidenceLabel: "review/community friction", evidenceStrength: "review/community friction · no comments at capture · downgraded",
  visual: visual("community-waic-glasses-source-2026-07.png", 1600, 1000, "Reddit WAIC AI glasses discussion", "https://www.reddit.com/r/augmentedreality/comments/1uwu064/anyone_attending_waic_2026_well_be_demoing_our/", "Reddit 社区页面截图：发帖人把硬件、软件、AI、电池、舒适度和开发者工具列为待回答缺口；无评论，不代表共识。", "Reddit community page: the poster lists hardware, software, AI, battery, comfort, and developer tools as open gaps; no comments, so not consensus."),
  sources: [source("Reddit r/augmentedreality WAIC post", "https://www.reddit.com/r/augmentedreality/comments/1uwu064/anyone_attending_waic_2026_well_be_demoing_our/"), source("Reddit smart-glasses navigation test", "https://www.reddit.com/r/SmartGlasses/comments/1t4z2kg/i_tested_7_smart_glasses_for_real-world_navigation_across_europe_and_the_u_s/")],
  zh: { productName: "WAIC AI-glasses community scan", productType: "社区摩擦扫描，不是已确认产品。", interactionFlow: "发帖人展示或预告 AI+AR/企业穿戴方案，并邀请社区指出硬件、软件、AI、电池、舒适度和开发者工具缺口。", specsOrStack: "帖子只列出 AR99 PRO、AI+AR ODM platform 和 enterprise AI wearable solutions，没有芯片、相机、OS、价格或出货信息。", useCases: "用于定义下一轮展会试戴和开发者验证问题。", painPointsSolved: "把购买者和开发者真正会问的缺口显式化。", newTech: "没有足够证据确认新技术；保持 weak/community signal。", availability: "帖子称将在 WAIC 展示，但没有确认零售或开发者可用性。", limitsOrUnknowns: "无评论、无独立实测、无规格与出货证据。", productVerdict: "保留为 review/community friction，不升级为产品事实。" },
  en: { productName: "WAIC AI-glasses community scan", productType: "A community-friction scan, not a confirmed product.", interactionFlow: "The poster shows or previews AI+AR and enterprise-wearable solutions and asks the community to identify gaps across hardware, software, AI, battery, comfort, and developer tools.", specsOrStack: "The post lists AR99 PRO, an AI+AR ODM platform, and enterprise AI wearable solutions, but provides no chip, camera, OS, price, or shipping evidence.", useCases: "It is useful for defining the next round of exhibition and developer validation questions.", painPointsSolved: "It makes the gaps that buyers and developers will ask about explicit.", newTech: "No new technology is confirmed; retain a weak/community label.", availability: "The post says the products will be shown at WAIC, not that they are available for retail or developers.", limitsOrUnknowns: "No comments, independent hands-on test, specifications, or shipping evidence; the next useful step is a real hands-on report.", productVerdict: "Keep it as review/community friction, not product fact." }
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

const issue = {
  date: "2026-07-16", timezone: "America/Toronto",
  zhTitle: "AI Daily 2026-07-16：AI 眼镜进入真实佩戴审判",
  enTitle: "AI Daily 2026-07-16: AI Glasses Enter the Wearability Trial",
  zhSummary: "RayNeo X3 Pro 的最新实测把双目 MicroLED、户外亮度和空间定位的技术优势，与 76g、1–5 小时电池和生态摩擦放在同一张产品账单上；MemoMind One 用无相机显示换取更清楚的社会边界；讯飞、Meta、Android XR 和 OpenGlass 则把翻译、隐私、开发面和端侧功耗的不同路线拉到一起。",
  enSummary: "RayNeo X3 Pro’s latest hands-on review puts binocular MicroLED, outdoor brightness, and spatial positioning on the same product bill as 76 grams, one-to-five-hour runtime, and ecosystem friction. MemoMind One trades the camera for a clearer social boundary; iFlytek, Meta, Android XR, and OpenGlass expose different routes through translation, privacy, developer surfaces, and edge power.",
  tags: ["AI glasses", "RayNeo X3 Pro", "MemoMind One", "iFlytek", "wearability", "display AR", "privacy UX", "on-device AI"],
  sourceTypes: ["official", "reviews", "community", "wild", "research", "patent", "china", "global"],
  zhPath: "./2026-07-16/zh/", enPath: "./2026-07-16/en/", sourcesPath: "./2026-07-16/sources.md",
  coverStory: {
    topicId: "rayneo-x3-pro-display-ar-glasses",
    zhTitle: "AI 眼镜进入真实佩戴审判",
    enTitle: "AI glasses enter the wearability trial",
    imagePath: "assets/rayneo-x3-pro-review-source-2026-07.png", imageWidth: 1600, imageHeight: 1000,
    primarySourceUrl: rayneoReview, imageSourceUrl: rayneoReview,
    evidenceStrength: "confirmed product · TechRadar hands-on review · source-backed specs",
    whyCover: "RayNeo X3 Pro is a buyable display AI glasses product whose review exposes the complete trade: better field-of-view computing against weight, battery, price, ecosystem, and daily wear. MemoMind, iFlytek, Meta, Android XR, community, and OpenGlass show the routes competing around that trade.",
    zhSummary: ["RayNeo X3 Pro 把双目 MicroLED、6,000 nits、空间定位和 Gemini Live 变成可购买硬件。", "TechRadar 实测同时记录 76g、约 1–5 小时电池、3/5 第一代评价和 app 生态摩擦。", "MemoMind、讯飞、Meta、Android XR 与 OpenGlass 分别从相机边界、翻译工作流、隐私状态、开发者契约和端侧功耗回应日常佩戴问题。"],
    enSummary: ["RayNeo X3 Pro makes binocular MicroLED, 6,000 nits, spatial positioning, and Gemini Live a purchasable device.", "TechRadar records 76 grams, roughly one-to-five-hour runtime, a 3/5 first-generation verdict, and app-ecosystem friction.", "MemoMind, iFlytek, Meta, Android XR, and OpenGlass answer daily-wear constraints through camera boundaries, translation workflows, privacy state, developer contracts, and edge power." ]
  },
  designDesk: {
    zhTitle: "Design Desk：把佩戴成本做成第一等产品状态",
    enTitle: "Design Desk: Make the cost of wearing the product a first-class state",
    zhIntro: "今天的新证据把眼镜产品问题压缩成一条可执行的交互链：用户为什么戴、何时看、谁能看见、设备撑多久、失败时怎么停，以及任务结束后如何回到手机或现实环境。",
    enIntro: "Today’s new evidence compresses the glasses problem into an actionable interaction chain: why the user wears it, when they look, who can see the state, how long the device lasts, how it stops on failure, and how the user returns to the phone or physical environment.",
    zhItems: [
      { label: "佩戴收益要抵过重量", body: "RayNeo 的显示价值很强，但 76g 和电池把每天佩戴变成产品变量；信息必须足够短、足够高频、足够值得抬眼。" },
      { label: "相机边界要可解释", body: "Meta 用 capture LED 和检测到篡改后禁用相机，MemoMind 直接去掉相机；社会信任是硬件架构与状态反馈的共同产物。" },
      { label: "显示不是手机页面缩小", body: "双目 MicroLED、透明显示与 Compose Glimmer 都要求 glanceable hierarchy；每一条内容都要能停、退回、恢复。" },
      { label: "翻译是持续选择，不是一键能力", body: "讯飞的“看谁、听谁、翻谁”说明多说话人声场需要目标选择、置信度和纠错，而不是只展示语言数量。" },
      { label: "端侧推理要补偿等待", body: "OpenGlass 的事件唤醒路线提示功耗预算；产品需要让用户知道何时在本地运行、何时上传、何时降级。" },
      { label: "众筹与研究继续降级", body: "MemoMind 的交付、OpenGlass 的量产、WAIC 社区讨论和专利材料都只能生成下一轮验证问题。" }
    ],
    enItems: [
      { label: "Wearability must earn the weight", body: "RayNeo’s display is compelling, but 76 grams and battery turn daily wear into a product variable; content must be short, frequent, and worth a glance." },
      { label: "Camera boundaries must be explainable", body: "Meta couples a capture LED to camera disablement on tamper; MemoMind removes the camera. Trust is jointly produced by architecture and feedback." },
      { label: "A display is not a shrunken phone", body: "Binocular MicroLED, optical see-through, and Compose Glimmer demand glanceable hierarchy; every cue needs a stop, return, and recovery path." },
      { label: "Translation is continuous selection", body: "iFlytek’s ‘who to look at, who to listen to, who to translate’ shows that noisy rooms need target selection, confidence, and correction, not just language counts." },
      { label: "Edge inference must explain waiting", body: "OpenGlass points to event-driven power budgets; products need to show when work stays local, when data leaves, and when the system degrades." },
      { label: "Crowdfunding and research stay downgraded", body: "MemoMind delivery, OpenGlass production, WAIC discussion, and patent material generate validation questions, not confirmed consumer evidence." }
    ]
  },
  watchlistZh: ["RayNeo X3 Pro：混合负载续航、76g 长时间佩戴、Creator Mode 与地区 Gemini 体验。", "MemoMind One：Kickstarter 8 月交付、无相机隐私设计、显示漏光、语音记录保存与手机断连。", "讯飞 AI 眼镜：122 语言逐语种质量、多人声场误选率、GlassClaw 发送前确认和续航款差异。", "Meta AI Glasses：LED 防篡改逐型号覆盖、误判恢复、旁观者日光可见性。", "Android XR：秋季硬件真实型号、Projected/Glimmer 生态、权限确认和断连回退。", "Rokid YodaOS、HTC VIVE Eagle、Even G2：模型路由、渠道交付、日常佩戴和数据路径。", "OpenGlass、社区 WAIC、智能眼镜专利：继续保持 research/community/patent 标签，等待可复现产品证据。"],
  watchlistEn: ["RayNeo X3 Pro: mixed-load runtime, long-term comfort at 76 grams, Creator Mode, and regional Gemini behavior.", "MemoMind One: August Kickstarter delivery, camera-free privacy, optical leakage, voice-note retention, and phone-disconnected behavior.", "iFlytek AI Glasses: language-by-language quality across 122 languages, wrong-speaker rate, GlassClaw send confirmation, and battery-model differences.", "Meta AI Glasses: model coverage for LED tamper safeguards, false-positive recovery, and daylight bystander visibility.", "Android XR: actual autumn hardware, Projected/Glimmer ecosystem, permission confirmation, and disconnect fallback.", "Rokid YodaOS, HTC VIVE Eagle, and Even G2: model routing, delivery, daily wear, and data paths.", "OpenGlass, WAIC community, and smart-glasses patents: keep research, community, and patent labels until reproducible product evidence appears."] ,
  topics
};

await fs.writeFile(issuesPath, JSON.stringify([issue, ...issues.filter((item) => item.date !== "2026-07-16")], null, 2) + "\n");
console.log(`Created 2026-07-16: ${topics.length} topics, ${new Set(topics.flatMap((topic) => topic.sources.map((item) => item.url))).size} unique sources.`);
