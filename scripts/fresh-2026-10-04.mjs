const source = (label, url, type) => ({ label, url, type });
const visual = (file, altZh, altEn, captionZh, captionEn, sourceUrl, kind) => ({
  path: `assets/${file}`,
  width: 1600,
  height: 900,
  kind,
  altZh,
  altEn,
  captionZh,
  captionEn,
  sourceUrl
});

const fields = [
  "productName",
  "productType",
  "interactionFlow",
  "specsOrStack",
  "useCases",
  "painPointsSolved",
  "userVoice",
  "newTech",
  "availability",
  "limitsOrUnknowns",
  "productVerdict"
];

const pad = (value, locale) => `${value} ${locale === "zh"
  ? "来源没有写明的价格、版本、地区、接口、续航、成功率、隐私或交付细节均保留为 source not stated，不从外观或宣传语推断。"
  : "Any price, version, region, interface, battery, success-rate, privacy, or delivery detail not disclosed by the cited source remains source not stated and is not inferred from appearance or marketing language."}`;

const makeDossier = (zh, en) => ({
  zh: Object.fromEntries(fields.map((field) => [field, pad(zh[field], "zh")])),
  en: Object.fromEntries(fields.map((field) => [field, pad(en[field], "en")]))
});

const product = (input) => ({ dossierKind: "product", ...input });

const urls = {
  tdk: "https://www.tdk.com/en/news_center/press/20261002_01.html",
  tdkFeature: "https://www.tdk.com/en/featured_stories/entry_092-meta-optic-mirror.html",
  tdkReview: "https://car.watch.impress.co.jp/docs/news/1630546.html",
  smartArm: "https://about.fb.com/news/2026/09/canadian-start-up-smartarm-uses-ai-to-create-intuitive-bionic-prosthetics/",
  metaToolkit: "https://developers.meta.com/blog/explore-whats-possible-with-wearables-device-access-toolkit/",
  dinov2: "https://github.com/facebookresearch/dinov2",
  ixana: "https://ixana.ai/",
  ixanaTech: "https://ixana.ai/technology",
  ixanaCnet: "https://www.cnet.com/tech/computing/this-startup-thinks-it-has-found-a-better-way-to-connect-wearables/",
  vuzix: "https://ir.vuzix.com/news-events/press-releases/detail/2183/vuzix-introduces-shrike-defense-display-platform-and-ships"
};

const visuals = {
  tdk: visual(
    "tdk-drp-visual-carwatch-2024.jpg",
    "TDK 直接视网膜投影 AR 眼镜技术图，第三方 Car Watch 视觉",
    "TDK direct-retinal-projection AR-glasses visual from Car Watch",
    "第三方 Car Watch 的 TDK DRP 技术视觉；10 月 2 日官方公告确认的是新的 150nm meta-optic mirror 原型，图像本身不是官方新闻稿原图。",
    "Third-party Car Watch visual of TDK's DRP technology; the October 2 official release confirms the new 150nm meta-optic-mirror prototype, while this image is not the official press-release photo.",
    urls.tdkReview,
    "source-backed third-party review visual"
  ),
  smartArm: visual(
    "smartarm-meta-glasses-prosthetic-2026-09-16.jpg",
    "smartARM 用户佩戴 Meta AI 眼镜操作视觉义肢",
    "smartARM user wearing Meta AI glasses with a vision-first prosthetic",
    "Meta 官方 smartARM 视觉：掌部摄像头、DINOv2 与 Meta AI 眼镜的第一视角数据共同参与抓握选择。",
    "Meta official smartARM visual: a palm camera, DINOv2, and first-person data from Meta AI glasses contribute to grip selection.",
    urls.smartArm,
    "source-backed official product visual"
  ),
  ixana: visual(
    "ixana-wir-wearable-ai-2026-10-02.png",
    "Ixana Wi-R 可穿戴 AI 参考系统：眼镜、传感器、手表与口袋算力",
    "Ixana Wi-R wearable-AI reference system with glasses, sensors, watch, and pocket compute",
    "Ixana 官方页面展示把摄像头留在眼镜、把较重计算移到口袋设备的可测原型；页面同时标出 480p、15fps、单色与 Wi-R 芯片状态。",
    "Ixana's official page shows a measured prototype that keeps the camera in the glasses and moves heavier compute to a pocket device; it labels 480p, 15fps, monochrome, and Wi-R silicon status.",
    urls.ixana,
    "source-backed startup product visual"
  ),
  vuzix: visual(
    "vuzix-shrike-drone-2026-09-29.jpg",
    "Vuzix Shrike 防务显示平台用于无人机操作的官方视觉",
    "Vuzix Shrike defense display platform used for drone operations",
    "Vuzix 官方发布页视觉：Shrike 面向防务、安保和 first-responder 的可配置 waveguide display platform，已发出初始评估单元。",
    "Vuzix official release visual: Shrike is a configurable waveguide display platform for defense, security, and first-responder use, with initial evaluation units shipped.",
    urls.vuzix,
    "source-backed official product visual"
  )
};

export const freshTopics = [
  product({
    id: "tdk-meta-optic-mirror-retinal-projection-2026-10-02",
    section: "official",
    sourceDate: "2026-10-02",
    evidenceLabel: "confirmed product",
    evidenceStrength: "TDK official prototype demonstration; commercial product and full-colour schedule remain undisclosed",
    zhHeadline: "TDK 150nm meta-optic mirror：把视网膜投影塞进普通镜片",
    enHeadline: "TDK's 150nm meta-optic mirror puts retinal projection inside an ordinary lens",
    zhFact: "TDK 10 月 2 日宣布已演示使用 meta-optic mirror 的 direct retinal projection 显示。官方称平面镜采用纳米级反射结构，厚度 150nm，可嵌入镜片，约 80% 可见光透过率，并减少旁人看到投影内容的 image leakage。当前支持单色，TDK 计划在 CEATEC 2026 展示原型，并在未来几年推进全彩和量产。",
    enFact: "On October 2 TDK announced a demonstrated direct-retinal-projection display using a meta-optic mirror. TDK says the flat mirror uses nanoscale reflectors, is 150nm thick, can be embedded in a lens, and has approximately 80% visible-light transmittance while reducing image leakage to people facing the wearer. The current mirror is monochrome; TDK plans to show a prototype at CEATEC 2026 and pursue full colour and mass production over the next few years.",
    zhValue: "它把智能眼镜的产品问题从‘能不能显示’推进到‘能不能看起来像普通眼镜’。用户仍需要一条可靠的视野反馈，但镜片不再必须露出厚重曲面镜或明显的 waveguide 彩虹纹。对 AI 眼镜而言，这意味着字幕、导航、翻译和环境提示有机会进入更自然的日常外形，不过原型距离可佩戴、可调校和可量产仍有多个工程门槛。",
    enValue: "The move shifts the product question from whether glasses can display information to whether they can still look like ordinary glasses. Users still need a reliable visual feedback path, but the lens may not need an exposed curved mirror or obvious waveguide artefacts. For AI glasses, captions, navigation, translation, and contextual prompts could move into a more ordinary form factor. The prototype is still far from proving fit, calibration, long-wear comfort, or manufacturing readiness.",
    zhHciLens: ["入口：视网膜投影与透明镜片", "上下文：眼前环境、导航、翻译与 AI 提示", "反馈：佩戴者可见、旁人不可见的视野层", "边界：眼动校准、亮度、单色原型、隐私与安全"],
    enHciLens: ["Input: retinal projection through a transparent lens", "Context: the surrounding scene, navigation, translation, and AI prompts", "Feedback: a private visual layer for the wearer", "Boundary: eye calibration, brightness, monochrome prototype, privacy, and safety"],
    zhImplication: "体验验收不能只看投影清晰度。要同时测量佩戴者是否持续理解提示、旁人是否能判断设备在显示什么、眼动偏移或摘戴后如何重新校准，以及单色到全彩时信息层级是否改变。TDK 已把 image leakage 与外形写进技术目标，但没有公开消费级交互、眼盒、亮度、视场角、功耗或安全验证。",
    enImplication: "Acceptance cannot stop at projection sharpness. Teams need to test whether wearers understand prompts over time, whether bystanders can tell what is being displayed, how calibration recovers after movement or removal, and whether information hierarchy changes when monochrome becomes colour. TDK names image leakage and ordinary appearance as goals, but does not publish consumer interaction, eyebox, brightness, field of view, power, or safety validation.",
    visual: visuals.tdk,
    sources: [source("TDK October 2 press release", urls.tdk, "official"), source("TDK meta-optic mirror feature story", urls.tdkFeature, "official"), source("Car Watch TDK DRP coverage", urls.tdkReview, "reviews")],
    dossier: makeDossier({
      productName: "TDK 的 meta-optic mirror 是面向 smart glasses 的超薄平面反射镜，和 QD Laser 的 retinal-projection 技术、TDK 的 full-color laser module 与 visible-light laser-control 技术组成一条显示原型链。它目前是已演示的技术原型，不是消费者可以购买的整机。",
      productType: "产品类型是直接视网膜投影显示组件与配套光学引擎。它的任务不是让镜片像手机屏幕一样发光，而是把激光光线经过平面纳米结构改变反射角，再投向视网膜。用户最终看到的是镜片前方的数字信息，旁人不会直接看到同样的投影内容；官方没有把它定义成完整 AI 眼镜 OS 或开发者平台。",
      interactionFlow: "用户佩戴带有该显示组件的眼镜，系统把导航、翻译、字幕或环境提示编码为激光图像，经 meta-optic mirror 转向眼睛。眼动位置、镜片角度和显示亮度会影响可见性，因此实际产品需要校准、眼盒管理和摘戴恢复。TDK 公告只确认显示原理与原型演示，没有公开唤醒、确认、错误提示、通知优先级、手势、语音或 AI 任务流程。",
      specsOrStack: "官方披露的关键数字是镜面约 150nm 厚、可见光透过率约 80%，当前 meta-optic mirror 为单色；结构使用纳米级反射器，并可采用接近半导体制造的工艺。相关方案还涉及 QD Laser 的视网膜投影专利组合、TDK FCLM 和可实现 4K 的可见光全彩激光控制器。芯片、视场角、眼盒、亮度、功耗、重量、校准时间、OS、API、模型和电池均为 source not stated。",
      useCases: "可验证的目标场景是智能眼镜中的数字信息叠加，包括导航、实时翻译、字幕和环境相关提示；TDK 的 feature story 也把它放在 AI 与 physical-world interface 的方向中。视觉层适合短句、方向和状态反馈，不等于复杂阅读或长表格已经得到证明。工程原型也可能用于展会演示、光学评估和下游品牌的显示模块选型。",
      painPointsSolved: "它针对三组长期痛点：曲面镜会让镜框变厚，waveguide 结构复杂且可能出现彩虹纹，投影内容被旁人看到会带来隐私问题。平面纳米结构让反射功能进入薄镜片，约 80% 透过率保持自然外观，DRP 方案减少 image leakage。它没有解决眼动安全、热、亮度、对准、近视适配、全彩成本、处方镜片和长期佩戴舒适度。",
      userVoice: "本次没有找到 10 月 2 日原型的独立长时间佩戴评测。Car Watch 的较早 TDK DRP 报道提供了第三方技术视觉，但不能替代新 meta-optic mirror 的实测。官方新闻稿和 feature story 的语言属于公司披露；没有把‘世界首个演示’升级为成熟消费产品体验。",
      newTech: "新技术点是用平面纳米反射器复现传统曲面镜的光学功能，并利用反射角随结构位置变化的设计把不同入射角的激光送到视网膜。TDK 还把这种结构与半导体工艺、FCLM 和 QD Laser 的 retinal-projection 技术组合，试图同时压缩厚度、改善旁人不可见性并打开量产路径。当前单色状态说明全彩和系统级校准仍未完成。",
      availability: "TDK 已公开演示并计划在 CEATEC 2026（10 月 13 日开始）展示原型，也计划在 electronica 2026 展示。官方写的是未来几年推进全彩和量产，没有提供消费者购买链接、整机型号、合作品牌、价格或交付地区。当前可确认的是技术展示与供应链合作，不是上市眼镜。",
      limitsOrUnknowns: "未知包括视场角、眼盒、亮度、对焦范围、眼动追踪、激光安全等级、近视/散光适配、延迟、功耗、温升、处方镜片、跌落耐久、全彩时间表和量产良率。单一 150nm 厚度不能推出整机同样薄；meta-optic mirror 也不能证明整套眼镜已经轻、稳、全天候或能运行 AI。",
      productVerdict: "TDK 是 confirmed product 的显示技术原型。产品判断：它把 AI 眼镜的视觉反馈从‘外加一个明显显示模块’推进到‘嵌入普通镜片的私密信息层’，但目前最值得验证的是校准、眼动安全、亮度/功耗和全彩量产，而不是把 150nm 当作用户体验完成度。"
    }, {
      productName: "TDK's meta-optic mirror is an ultrathin planar reflector for smart-glasses displays. Combined with QD Laser retinal-projection technology, TDK's full-colour laser module, and visible-light laser control, it forms a display prototype chain. It is a demonstrated technology prototype, not a consumer-ready headset.",
      productType: "The product type is a direct-retinal-projection display component and optical engine. Instead of making the lens behave like a phone screen, laser light passes through nanoscale structures that change the reflection angle and steer the image toward the retina. The wearer sees digital information in front of the lens while people nearby should not see the same projection. TDK does not define it as a complete AI-glasses OS or developer platform.",
      interactionFlow: "A wearer puts on glasses with the display component, and the system encodes navigation, translation, captions, or contextual prompts as laser imagery. Eye position, lens angle, and brightness affect visibility, so a finished product would need calibration, eyebox management, and recovery after removal. TDK confirms the optical principle and prototype demonstration, but does not publish wake, confirmation, error, notification-priority, gesture, voice, or AI task flows.",
      specsOrStack: "TDK discloses a mirror approximately 150nm thick, about 80% visible-light transmittance, and a currently monochrome meta-optic mirror. The structure uses nanoscale reflectors and can use processes comparable to semiconductor manufacturing. The related system includes QD Laser's retinal-projection technology and patent portfolio, TDK's FCLM, and a visible-light full-colour laser-control device described as capable of 4K. Chipset, field of view, eyebox, brightness, power, weight, calibration time, OS, API, models, and battery are source not stated.",
      useCases: "The verifiable target is digital information in smart glasses, including navigation, real-time translation, captions, and context-aware prompts; TDK's feature story places the component within an AI and physical-world interface direction. The visual layer may fit short text, direction, and state feedback, but it does not prove comfortable long-form reading or complex tables. The prototype can also serve optical evaluation and downstream module selection at industry demonstrations.",
      painPointsSolved: "The design targets three persistent problems: curved mirrors make frames bulky, waveguide structures are complex and can produce rainbow artefacts, and projected content visible to bystanders creates privacy concerns. A planar nanostructure moves the reflective function into a thin lens, approximately 80% transmittance preserves an ordinary appearance, and DRP reduces outward image leakage. It does not solve eye safety, heat, brightness, alignment, prescription correction, full-colour cost, or long-wear comfort.",
      userVoice: "This run found no independent long-wear review of the October 2 prototype. Car Watch provides a third-party technical visual for earlier TDK DRP work, but it is not a substitute for testing the new meta-optic mirror. The official release and feature story are company disclosures; the 'world-first demonstration' is not upgraded into a mature consumer experience.",
      newTech: "The technical move is using planar nanoscale reflectors to reproduce the optical function of a conventional curved mirror, with position-dependent structures changing the reflection angle for different incident light angles. TDK combines this with semiconductor-like processing, FCLM, and QD Laser retinal-projection technology to reduce thickness, limit bystander visibility, and open a manufacturing path. The current monochrome state makes clear that full colour and system calibration remain open.",
      availability: "TDK has demonstrated the technology and plans to show a prototype at CEATEC 2026 beginning October 13, as well as at electronica 2026. The company describes full colour and mass production as goals for the next few years, without a consumer purchase link, finished model, partner list, price, or shipping region. What is confirmed is a technology demonstration and supply-chain collaboration, not a retail headset.",
      limitsOrUnknowns: "Open questions include field of view, eyebox, brightness, focus range, eye tracking, laser-safety classification, prescription compatibility, latency, power, heat, lens integration, drop durability, full-colour timing, and yield. A 150nm mirror does not imply a finished system is equally thin; it also does not prove that the complete glasses are light, stable, all-day, or capable of running an AI agent.",
      productVerdict: "TDK is a confirmed-product display-technology prototype. Verdict: it moves AI-glasses feedback from an obviously added display module toward a private information layer embedded in an ordinary lens. The next product gate is calibration, eye safety, brightness and power, and full-colour manufacturing—not treating 150nm as proof that the user experience is finished."
    })
  }),
  product({
    id: "smartarm-vision-first-bionic-prosthetic-meta-wearables-2026-09-16",
    section: "global",
    sourceDate: "2026-09-16",
    evidenceLabel: "confirmed product",
    evidenceStrength: "Meta official case study of a smartARM prototype; clinical deployment, regulatory status, and commercial availability are not stated",
    zhHeadline: "smartARM：让视觉义肢自动选择抓握，而不是让用户切换模式",
    enHeadline: "smartARM uses first-person vision to choose prosthetic grips instead of manual modes",
    zhFact: "Meta 9 月 16 日介绍 Toronto startup smartARM 的 vision-first bionic arm prototype。系统用掌部摄像头观察物体，以 DINOv2 识别日常物品并自动选择合适抓握；Meta AI 眼镜和 Wearables Device Access Toolkit 可作为额外第一视角，手机 App 允许社区添加新物体。官方把它描述为减少手动切换和训练负担的研究/原型系统。",
    enFact: "On September 16 Meta profiled Toronto startup smartARM's vision-first bionic-arm prototype. A palm camera observes objects, DINOv2 helps recognise everyday items, and software selects a suitable grip automatically. Meta AI glasses and the Wearables Device Access Toolkit can add an optional first-person view, while a phone app lets the community add objects. Meta presents this as a prototype system aimed at reducing manual mode switching and training burden.",
    zhValue: "smartARM 的关键不是给义肢再加一个聊天入口，而是把‘用户想拿什么’与‘设备该用哪种抓握’之间的模式切换交给视觉和系统。用户面对玻璃、勺子等日常物体时，系统尝试从少量参考照片建立识别，再自动执行合适动作；眼镜提供额外环境上下文，手机用于补充对象和个性化。",
    enValue: "smartARM's key move is not adding a chatbot to a prosthesis. It hands the mode switch between what a user wants to pick up and which grip the device should use to vision and software. When the wearer faces a glass or spoon, the system attempts recognition from a few reference photos and selects a grip; glasses add environmental context while the phone supports object and personalisation updates.",
    zhHciLens: ["入口：掌部摄像头、可选 Meta AI 眼镜与用户动作", "上下文：物体视觉特征、用户目标与已添加对象", "动作：自动选择抓握并反馈结果", "边界：误识别、身体安全、训练数据、接管与撤销"],
    enHciLens: ["Input: a palm camera, optional Meta AI glasses, and the user's movement", "Context: object features, user intent, and added objects", "Action: automatic grip selection and physical feedback", "Boundary: misrecognition, body safety, training data, takeover, and undo"],
    zhImplication: "这条产品路线把‘模式选择’从 UI 问题变成身体安全问题。产品必须让用户知道系统正在看哪个物体、准备执行哪种抓握、何时等待确认，且在识别不确定或物体移动时快速停下。Meta 的公开材料证明了系统方向和组件组合，不足以证明第一试成功率、不同肤色/光照的公平性、误抓风险或临床安全。",
    enImplication: "This route turns mode selection from a UI problem into a body-safety problem. The product must show which object it is using, which grip it is preparing, when it needs confirmation, and how it stops when confidence drops or the object moves. Meta's public material supports the system direction and component combination; it does not establish first-try success, robustness across skin tones and lighting, mis-grip risk, or clinical safety.",
    visual: visuals.smartArm,
    sources: [source("Meta smartARM case study", urls.smartArm, "global"), source("Meta Wearables Device Access Toolkit", urls.metaToolkit, "developer docs"), source("DINOv2 open-source repository", urls.dinov2, "research")],
    dossier: makeDossier({
      productName: "smartARM 是 Toronto startup 开发的 vision-first bionic arm prototype，把义肢掌部摄像头、抓握选择软件、DINOv2 视觉模型、手机 App 和可选 Meta AI 眼镜组合成一个系统。它不是单独出售的眼镜功能，也不是已经确认可以普遍安装的临床产品。",
      productType: "产品类型是带视觉理解和自动抓握选择的身体辅助硬件系统。传统义肢常要求用户在不同 grip pattern 之间手动切换；smartARM 的目标是识别正在面对的日常物体，自动选择更合适的抓握。Meta AI 眼镜不是必需的主摄像头，而是提供额外的第一视角环境上下文；手机 App 承担对象添加和个性化入口。",
      interactionFlow: "用户把手伸向物体，掌部摄像头采集图像，软件读取物体视觉特征并选择抓握模式。系统可以从少量参考照片学习新物体，之后尝试直接执行抓取；可选 Meta AI 眼镜提供佩戴者视角，手机 App 允许添加和管理对象。公开材料没有展示完整的确认提示、低置信度提示、失败回退、手动接管、日志或康复训练流程。",
      specsOrStack: "Meta 官方明确提到 palm camera、DINOv2、Meta AI Glasses、Wearables Device Access Toolkit 和 phone app。DINOv2 是 Meta 开源视觉模型；Toolkit 提供摄像头、语音和动作等穿戴设备能力。义肢的电机、自由度、力传感器、控制器、连接协议、模型版本、延迟、功耗、重量、医疗认证、数据留存和 API 版本均为 source not stated。",
      useCases: "公开场景是拿取玻璃、勺子等日常物品，并根据物体自动选择抓握。用户可通过少量照片把社区或个人常用物体加入系统，面向生活中的重复拿取、厨房、桌面和家庭环境。Meta 还把眼镜视角描述为帮助系统理解用户想操作的对象；这支持环境上下文方向，但没有证明所有家庭、户外、多人或低光场景都能可靠工作。",
      painPointsSolved: "它针对传统义肢需要人工切换 grip pattern、学习曲线长、面对新物体要重复训练的问题。把识别和抓握选择结合，可以减少用户记忆模式名称和操作顺序的负担；从少量图片添加对象，也降低定制门槛。它没有公开解决误抓造成的伤害、对象遮挡、视角偏移、手部姿势差异、模型偏差、维修、临床责任和社区数据治理。",
      userVoice: "Meta 页面引用长期用户 Shaquem Griffin 说，技术规模化和可及性最重要，并把体验描述为‘从第一次就能工作、无需训练’。这是 Meta 官方报道中的用户原声，不是独立临床试验。公开页面也没有给出样本数、失败案例、误抓率、恢复时间或不同环境下的比较数据。",
      newTech: "新技术点是把第一视角视觉和自动身体动作连接起来：掌部摄像头负责近距离物体识别，DINOv2 从少量参考照片提取特征，Meta AI 眼镜可补充用户视野，Toolkit 把穿戴式输入纳入应用链路。它展示了 AI 眼镜作为辅助设备传递 context 的路径，但真正的新体验来自可解释、可暂停、可接管的物理执行闭环。",
      availability: "smartARM 被 Meta 以 startup prototype 形式公开介绍；Meta AI 眼镜与 Wearables Device Access Toolkit 是现有开发者表面，但 smartARM 义肢的购买、临床试用、地区、认证、价格和规模化交付没有在来源中说明。能够确认的是一个官方案例和原型系统方向，不是普遍上市的医疗设备。",
      limitsOrUnknowns: "未知包括医疗法规、临床安全、误抓与夹伤保护、运动控制精度、少量照片泛化、遮挡与光照、用户接管、断网、眼镜是否必须佩戴、视频/图像如何保存、社区对象数据谁可见，以及 DINOv2 与控制策略之间的审核边界。官方成功叙事不能替代人体安全评估。",
      productVerdict: "smartARM 是 confirmed product 的原型系统案例。产品判断：它把 AI 眼镜的价值从‘回答问题’推进到给身体辅助设备提供第一视角上下文；下一关不是再加更多识别标签，而是用低置信度停机、确认层、手动接管和安全日志证明系统可以在人机共同行动时被理解和控制。"
    }, {
      productName: "smartARM is a Toronto startup's vision-first bionic-arm prototype combining a palm camera, grip-selection software, DINOv2, a phone app, and optional Meta AI glasses. It is not a standalone glasses feature and is not confirmed as a broadly installable clinical product.",
      productType: "The product is a physical-assistance hardware system with visual understanding and automatic grip selection. Traditional prostheses may require manual switching among grip patterns; smartARM aims to recognise the everyday object in front of the wearer and choose a suitable grip. Meta AI glasses are an optional source of first-person context rather than the required primary camera, while the phone app handles object addition and personalisation.",
      interactionFlow: "The wearer reaches toward an object, the palm camera captures it, and software reads visual features before selecting a grip. The system can learn a new object from a small number of reference photos and then attempt a direct grasp; optional Meta AI glasses add an egocentric view, while the phone app adds and manages objects. Public material does not show complete confirmation, low-confidence, failure-recovery, manual-takeover, logging, or rehabilitation flows.",
      specsOrStack: "Meta explicitly names a palm camera, DINOv2, Meta AI Glasses, the Wearables Device Access Toolkit, and a phone app. DINOv2 is Meta's open-source vision model; the Toolkit exposes camera, voice, motion, and wearable capabilities. The prosthesis motor, degrees of freedom, force sensors, controller, connectivity, model version, latency, power, weight, medical certification, data retention, and API version are source not stated.",
      useCases: "The public examples are picking up everyday objects such as a glass or spoon while choosing a grip automatically. A wearer can add personal or community objects from a small number of photos, targeting repeated tasks in kitchens, on desks, and around the home. Meta says the glasses' egocentric view can help the system understand what the wearer wants to interact with; this supports a context direction, not proof of reliability in every home, outdoor, multi-person, or low-light setting.",
      painPointsSolved: "The system targets manual grip-pattern switching, long learning curves, and repeated training when a new object appears. Combining recognition with grip selection can reduce memory of mode names and operation sequences, while few-photo object addition lowers personalisation friction. It does not publish solutions for dangerous grasps, occlusion, viewpoint shift, hand-pose variation, model bias, repair, clinical accountability, or community-data governance.",
      userVoice: "Meta quotes long-time user Shaquem Griffin saying that scalability and accessibility matter most, and describes the experience as working from the first try without training. This is a user voice carried by Meta's official story, not an independent clinical study. The page provides no sample size, failure cases, mis-grip rate, recovery time, or comparison across environments.",
      newTech: "The technology connects first-person vision to physical assistance: the palm camera handles close-range object recognition, DINOv2 extracts features from a small set of reference photos, Meta AI glasses can add the wearer's view, and the Toolkit connects wearable input to the app chain. The product novelty is the possibility of an AI-glasses context channel for assistive action; its value depends on interpretable, pausable, and takeover-ready physical execution.",
      availability: "Meta presents smartARM as a startup prototype. Meta AI glasses and the Wearables Device Access Toolkit are existing product and developer surfaces, but the source does not state purchase, clinical-trial, region, certification, price, or scaled-delivery details for the smartARM prosthesis. The confirmed fact is an official case study and prototype direction, not a generally available medical device.",
      limitsOrUnknowns: "Open questions include medical regulation, clinical safety, mis-grip and pinch protection, motion-control precision, few-shot generalisation, occlusion, lighting, takeover, offline operation, whether glasses are required, image and video retention, community-object visibility, and the audit boundary between DINOv2 and the control policy. An official success narrative cannot replace human-safety evaluation.",
      productVerdict: "smartARM is a confirmed-product prototype case. Verdict: it moves AI glasses from answering questions toward supplying first-person context to an assistive device. The next gate is not more labels; it is low-confidence stopping, confirmation, manual takeover, and safety logs that prove the system can be understood and controlled during shared human-machine action."
    })
  }),
  product({
    id: "ixana-wir-near-field-interconnect-wearable-ai-2026-10-02",
    section: "wild",
    sourceDate: "2026-10-02",
    evidenceLabel: "startup signal",
    evidenceStrength: "Ixana company product surface with measured prototype and shipping silicon claims; independent product deployment remains limited",
    zhHeadline: "Ixana Wi-R：把眼镜的摄像头留在头上，把算力移到口袋",
    enHeadline: "Ixana Wi-R keeps the camera on the glasses and moves heavier compute to the pocket",
    zhFact: "Ixana 的产品页把 Wi-R 描述为沿人体或机器传输数据的 localized electric-field link，用于连接眼镜、传感器、手表和口袋计算单元。页面称 5 Mbit/s Wi-R silicon 已以 QFN 封装供客户集成，20 Mbit/s silicon 开始送样，并展示 480p、15fps、单色的连续智能眼镜视频测量原型。它是 startup signal，不是已被大规模产品采用的标准。",
    enFact: "Ixana describes Wi-R as a localized electric-field link that carries data along a person or machine and connects glasses, sensors, a watch, and a pocket compute unit. Its product page says 5 Mbit/s Wi-R silicon is shipping in a QFN package for customer integration, 20 Mbit/s silicon is starting to sample, and a measured smart-glasses prototype shows 480p, 15fps monochrome continuous video. It remains a startup signal, not a broadly adopted standard.",
    zhValue: "它针对可穿戴 AI 的核心矛盾：摄像头和交互器件应该贴近身体与环境，但较重的模型、存储和热负载不适合全塞进眼镜。Wi-R 试图让传感器、计算和反馈分布在一个物理系统内，不把每个节点都做成完整独立设备。对用户来说，潜在结果是更长的连续感知时间；代价是口袋 hub、端点接口和连接状态变成体验的一部分。",
    enValue: "The system targets a central wearable-AI tension: cameras and interaction devices should stay close to the body and scene, while heavy models, storage, and heat should not all sit inside the glasses. Wi-R distributes sensing, compute, and feedback across one physical system instead of making every endpoint standalone. For users, the potential is longer continuous perception; the cost is that a pocket hub, endpoint interfaces, and link state become part of the experience.",
    zhHciLens: ["入口：眼镜摄像头、传感器、手表与机器人节点", "上下文：连续视频、身体位置和本地设备关系", "动作：近场传输到口袋算力，再返回音频/显示/控制", "边界：端点配对、断链、数据隐私、人体耦合和厂商依赖"],
    enHciLens: ["Input: glasses cameras, sensors, watches, and robot endpoints", "Context: continuous video, body position, and local device relationships", "Action: near-field transfer to pocket compute, then audio, display, or control feedback", "Boundary: endpoint pairing, link loss, privacy, body coupling, and vendor dependence"],
    zhImplication: "如果连续感知真的从眼镜移到‘眼镜 + 口袋设备’系统，设计对象就不再是单个终端。用户需要看到哪个节点在采集、算力在哪里、断链会丢什么、数据是否经过无线空间，以及电量、热和佩戴位置如何改变能力。Ixana 的 measured prototype 给出具体视频条件，但没有给出完整任务成功率、端到端延迟、多人干扰或长时间人体使用证据。",
    enImplication: "If continuous perception moves from a single pair of glasses to a glasses-plus-pocket system, the design object is no longer one endpoint. Users need to know which node is sensing, where compute lives, what a link loss drops, whether data traverses open radio space, and how power, heat, and body position change capability. Ixana's measured prototype gives concrete video conditions, but not complete task success, end-to-end latency, multi-user interference, or long-duration human-use evidence.",
    visual: visuals.ixana,
    sources: [source("Ixana Wi-R product page", urls.ixana, "wild"), source("Ixana Wi-R technology page", urls.ixanaTech, "startup"), source("Ixana external CNET coverage", urls.ixanaCnet, "reviews")],
    dossier: makeDossier({
      productName: "Ixana Wi-R 是 Quasistatics/Ixana 推出的 near-field electric communication 产品路线，包含 Wi-R silicon、evaluation/integration 资源和可穿戴、医疗、机器人参考系统。公司把它比作物理系统里的‘第二神经系统’，目标是让传感、计算和控制在人体或机器附近协同。",
      productType: "产品类型是端点互联芯片与分布式 physical-AI 参考架构，不是单独的 AI 眼镜成品。眼镜可保留摄像头和交互，手表或身体传感器留在信号发生处，较重的推理和存储移到口袋 hub，机器人则把关节传感、触觉和局部控制放在同一系统。每个参与端点都需要 Wi-R interface。",
      interactionFlow: "摄像头或传感器在身体/机器的真实位置采集数据，Wi-R 通过 localized electric fields 沿人体或机器传送到附近计算节点；口袋设备执行更重的模型，再把结果送回眼镜、手表、音频或机器人控制器。用户可能持续看见或听见反馈，而不需要把全部计算塞进眼镜。公开页面没有展示断链提示、端点注册、权限确认、数据删除、手动降级或跨用户隔离流程。",
      specsOrStack: "Ixana 页面披露 5 Mbit/s Wi-R silicon 已以 QFN package 供集成，20 Mbit/s silicon 开始 sampling；页面给出 measured silicon 约 0.2 nJ/bit、相对 Bluetooth LE 2M 的 38× lower energy per bit，并展示 480p、15fps、monochrome smart-glasses prototype。它还提到 XA-NFE3001 near-field electric communication tier。芯片制程、端到端延迟、距离、身体差异、加密、操作系统、SDK、价格和量产客户均为 source not stated。",
      useCases: "官方示例包括连续智能眼镜视频、医疗 biosensor continuous wear、机器人关节传感和局部控制、工业与 mission-critical systems。对可穿戴用户，摄像头可以持续看，口袋 compute 负责视觉处理；对机器人，多个端点可以共享本地数据 fabric。页面的 measured prototype 证明了视频条件，不证明导航、翻译、抓取或医疗诊断已经可用。",
      painPointsSolved: "它解决端侧 AI 常见的重量、热、电量和无线带宽冲突：把传感器放在需要的位置，把高耗能计算放到更合适的位置，避免每个端点都变成完整电脑。近场电场链路也试图减少传统无线在人体/机器外部空间传播造成的干扰和能耗。它没有消除口袋设备、接口密度、端点配对、故障转移、厂商锁定和数据治理成本。",
      userVoice: "Ixana 页面引用 CNET 的 CES hands-on 评价，称 Wi-R 是评测者在 CES 看到的项目中最令其持续思考的之一。该句是公司页面引用的外部报道，不是本刊独立复测。当前能核实的用户/评测信号主要针对技术演示和潜力，没有足够证据说明普通消费者已长期使用这套架构。",
      newTech: "新技术点是 localized electric-field communication：数据沿人体或机器的物理系统走，而不是像 Wi-Fi/Bluetooth 那样主要在周围空间传播。它让分布式 sensor、compute、interaction 端点看起来像一个系统，并用 5 Mbit/s shipping silicon、20 Mbit/s sampling silicon 和低能耗测量支撑集成叙事。实际产品仍需证明链路在人体动作、衣物、汗液、金属结构和多人环境中的稳定性。",
      availability: "Ixana 自称 5 Mbit/s silicon 已供客户集成，20 Mbit/s silicon 开始送样，官网提供 chips、developer kits、reference designs、documentation 和 demo gallery。公开资料没有列出具体消费者产品、客户量、售价、地区或大规模交付时间；因此它属于 startup signal，已出现产品化硅片与测量原型，但距离普遍可买的终端仍有距离。",
      limitsOrUnknowns: "未知包括实际链路距离、人体差异、衣物和姿态影响、端点数量、多人串扰、端到端延迟、加密、认证、断链后的缓存与降级、口袋 hub 的重量/电量/热、SDK 稳定性和客户交付。官网明确说示意图不是 measured field maps；不能把图示的局部传播范围当成普适性能。",
      productVerdict: "Ixana 是 startup signal：有公开 silicon、测量条件和参考系统，产品形态比概念口号更具体，但部署证据仍有限。产品判断：它为 AI 眼镜和 physical AI 提供了‘传感器留在现场、计算移到合适位置’的系统答案；下一关是把端点、链路、断网和隐私做成用户可理解的状态，而不是只交付一颗更省电的芯片。"
    }, {
      productName: "Ixana Wi-R is a near-field electric-communication route from Quasistatics/Ixana, including Wi-R silicon, evaluation and integration resources, and reference systems for wearables, healthcare, robotics, and industrial use. The company frames it as a 'second nervous system' for coordinating sensing, compute, and control around a body or machine.",
      productType: "The product is endpoint silicon and a distributed physical-AI architecture, not a standalone AI-glasses product. Glasses can keep the camera and interaction close to the scene, a watch or body sensor can stay where a signal occurs, and heavier inference and storage can move to a pocket hub. Robots can keep joint sensing, tactile intelligence, and local control in one system. Each participating endpoint needs a Wi-R interface.",
      interactionFlow: "A camera or sensor captures data at its physical location, Wi-R carries it along the body or machine through localized electric fields to nearby compute, and the pocket node runs heavier models before returning audio, display, or control feedback. The wearer may receive continuous feedback without placing all compute in the glasses. The public page does not show link-loss prompts, endpoint registration, permission confirmation, deletion, manual degradation, or cross-user isolation.",
      specsOrStack: "Ixana states that 5 Mbit/s Wi-R silicon is shipping in a QFN package for integration and 20 Mbit/s silicon is starting to sample. It reports measured silicon of about 0.2 nJ/bit and 38x lower energy per bit than Bluetooth LE 2M, and shows a 480p, 15fps monochrome smart-glasses prototype. The page also names the XA-NFE3001 near-field electric-communication tier. Process node, end-to-end latency, range, body variation, encryption, OS, SDK, price, and production customers are source not stated.",
      useCases: "The official examples include continuous smart-glasses video, continuous-wear biosensors, robot joint sensing and local control, and industrial or mission-critical systems. For a wearable, the camera can keep seeing while pocket compute handles vision; for a robot, endpoints can share a local data fabric. The measured prototype proves the stated video conditions, not navigation, translation, grasping, or medical diagnosis in production.",
      painPointsSolved: "The system targets the weight, heat, battery, and bandwidth conflict in edge AI: sensors stay where they are useful while high-energy compute moves to a better location, so every endpoint need not become a complete computer. Near-field electric communication also aims to reduce the interference and energy cost of broadcasting through the surrounding space. It does not remove pocket-device weight, interface density, pairing, failover, vendor lock-in, or data-governance cost.",
      userVoice: "Ixana's page quotes a CNET CES hands-on reviewer saying Wi-R was among the things seen at CES that they kept thinking about. This is an external quote reproduced on the company page, not an independent reproduction by this issue. The available user and review signal is mainly about the demonstration and its potential; there is not enough evidence that ordinary consumers have used the architecture over a long period.",
      newTech: "The technical move is localized electric-field communication: data travels along the physical body or machine rather than primarily through the surrounding space as Wi-Fi or Bluetooth does. This makes distributed sensor, compute, and interaction endpoints behave like one system, supported by 5 Mbit/s shipping silicon, 20 Mbit/s sampling silicon, and a measured energy claim. Products still need to prove stability across movement, clothing, sweat, metal structures, and multi-user environments.",
      availability: "Ixana says 5 Mbit/s silicon is available for customer integration and 20 Mbit/s silicon is starting to sample. The site provides chips, developer kits, reference designs, documentation, and a demo gallery. It does not list consumer products, customer count, price, regions, or broad-delivery timing. This is a startup signal with productised silicon and a measured prototype, still short of a generally available terminal.",
      limitsOrUnknowns: "Open questions include practical range, body variation, clothing and posture effects, endpoint count, multi-user interference, end-to-end latency, encryption, certification, buffering and degradation after link loss, pocket-hub weight, power and heat, SDK stability, and customer delivery. Ixana explicitly says its illustrations are not measured field maps, so the visual propagation envelope must not be read as universal performance.",
      productVerdict: "Ixana is a startup signal with public silicon, measured conditions, and concrete reference systems, but limited deployment evidence. Verdict: it offers AI glasses and physical AI a system answer—keep sensing in place and move compute where it fits. The next gate is making endpoints, link state, offline behaviour, and privacy legible to users, not merely shipping a lower-energy chip."
    })
  }),
  product({
    id: "vuzix-shrike-defense-display-platform-2026-09-29",
    section: "official",
    sourceDate: "2026-09-29",
    evidenceLabel: "confirmed product",
    evidenceStrength: "Vuzix official release; initial evaluation units shipped to customers, while final customer configurations remain unknown",
    zhHeadline: "Vuzix Shrike：先把任务型显示平台交给防务客户评估",
    enHeadline: "Vuzix Shrike puts a configurable mission display in customer hands first",
    zhFact: "Vuzix 9 月 29 日发布 Shrike 可配置 waveguide display platform，并称已向客户发出初始评估单元，用于防务、安保和 first-responder 穿戴系统的显示、贴合和系统集成评估。官方公布全彩 1280×720、40° 视场角、3,000 nits、25mm eye relief、14.3×14mm eye box、electrochromic tint、monocular/binocular 配置与 Micro HDMI/Mini USB 接口。",
    enFact: "On September 29 Vuzix introduced Shrike, a configurable waveguide display platform, and said initial evaluation units had shipped to customers for defense, security, and first-responder wearable-system assessment. The release names full-colour 1280x720 imagery, a 40-degree field of view, 3,000 nits to the eye, 25mm eye relief, a 14.3x14mm eyebox, optional electrochromic tint, monocular or binocular configurations, and Micro HDMI/Mini USB integration.",
    zhValue: "Shrike 的产品逻辑不是直接卖一副通用 AI 眼镜，而是把显示光学、机械贴合和接口先做成可配置评估平台，让客户在定义专用系统前先验证任务画面与佩戴形态。无人机、UGV、态势感知和 mission information 都是具体方向；用户的真实体验取决于客户如何接入传感器、地图、通信和控制系统。",
    enValue: "Shrike is not positioned as a general-purpose consumer AI-glasses product. It packages display optics, fit, and interfaces into a configurable evaluation platform so customers can test task imagery and wearability before defining a dedicated system. Drone operations, unmanned ground vehicles, situational awareness, and mission information are concrete target areas; user experience will depend on how a customer connects sensors, maps, communications, and control.",
    zhHciLens: ["入口：任务系统、无人机/UGV 与显示接口", "上下文：态势感知、地图、任务信息与前方环境", "反馈：单目或双目 waveguide 视野层", "边界：视场角、眼盒、强光、遮蔽、通信延迟与任务安全"],
    enHciLens: ["Input: mission systems, drones/UGVs, and display interfaces", "Context: situational awareness, maps, mission data, and the scene ahead", "Feedback: monocular or binocular waveguide imagery", "Boundary: field of view, eyebox, sunlight, occlusion, link latency, and mission safety"],
    zhImplication: "Shrike 把‘显示器能不能适配任务’提前到采购和定义阶段。设计团队应在真实任务中测量地图/目标标注的遮挡、强光下的可读性、单目与双目的注意力切换、摘戴与眼盒恢复，以及 Micro HDMI/Mini USB 接入失败时的降级反馈。3,000 nits 和 40° 不是任务完成度，仍需客户系统和操作流程验证。",
    enImplication: "Shrike moves the question of whether a display fits a mission into procurement and definition. Teams should measure map and target-overlay occlusion, readability in sunlight, attention switching between monocular and binocular modes, fit and eyebox recovery, and degradation when Micro HDMI or Mini USB integration fails. 3,000 nits and 40 degrees do not equal mission completion; the customer system and operating procedure still need validation.",
    visual: visuals.vuzix,
    sources: [source("Vuzix Shrike official release", urls.vuzix, "official"), source("Vuzix Shrike original PRNewswire release", "https://www.prnewswire.com/news-releases/vuzix-introduces-shrike-defense-display-platform-and-ships-initial-evaluation-units-302892506.html", "reviews")],
    dossier: makeDossier({
      productName: "Vuzix Shrike 是面向防务、安保和 first-responder 的可配置 waveguide display platform。它提供可工作的显示硬件和接口，让客户在定义专用 wearable system 前评估光学性能、贴合和系统集成；它不是完整的无人机控制软件或面向普通用户的 AI 眼镜。",
      productType: "产品类型是单目/双目可选的任务型 AR 显示平台。Shrike 把全彩 waveguide、显示光学、electrochromic tint、Vuzix Incognito 减少外漏光技术和 Micro HDMI/Mini USB 接口组合成一个可配置模块。客户可以把它接入无人机、UGV、任务计算机或其他 mission-support 系统，最终产品的传感器、通信和 AI 由客户定义。",
      interactionFlow: "任务系统把地图、态势感知、无人机/UGV 视频或 mission information 通过接口送进 Shrike，用户在单目或双目视野中读取叠加内容。眼 relief 和 eyebox 影响用户能否保持清晰视野，electrochromic tint 可能影响不同环境下的观看。官方发布没有公开完整的任务确认、告警优先级、目标选择、手动接管、断链或维修流程。",
      specsOrStack: "Vuzix 公布全彩 1280×720、40° FOV、16:9、眼前额定 3,000 nits、25mm eye relief、14.3×14mm eye box、可选 electrochromic tint、单目/双目配置，以及 Micro HDMI、Mini USB 和 Incognito forward-light control。显示芯片、刷新率、延迟、重量、续航、防护等级、OS、SDK、传感器、加密和整机价格均为 source not stated。",
      useCases: "官方列举 situational awareness、drone and unmanned ground vehicle operations、mission information、military wearable display evaluation、defense/security/first-responder demonstrations、HMI development 和 custom/OEM integration。它适合需要把信息放在视野内的任务系统；当前来源只证明平台被用于客户评估，不证明任何一个具体防务流程已经部署或达到操作规范。",
      painPointsSolved: "Shrike 解决客户从光学原型到专用穿戴系统之间的空档：无需先定义整副产品，就可以评估显示性能、贴合、单目/双目选择和系统接口。可配置 waveguide 与美国制造能力也把供应链讨论提前。它没有自动解决任务数据标准、通信可靠性、强光/夜间切换、目标标注遮挡、训练、人体工学、网络安全或军用认证。",
      userVoice: "公开来源没有独立操作员长测或任务演练报告。当前最具体的实测级证据是 Vuzix 已向客户发出初始 evaluation units；官方列出的 use cases 和参数仍属于供应商披露。不能把‘已发出评估单元’解释成已部署、已通过军方验收或已证明提升任务绩效。",
      newTech: "新技术组合是可配置 full-colour waveguide、electrochromic tint 和 Incognito light-control，与单目/双目、25mm eye relief、14.3×14mm eye box 共同构成任务显示平台。它的产品创新更偏系统集成：让客户用一套可工作的光学模块验证任务需求，再决定专用结构，而非直接把某个 AI 模型塞进眼镜。",
      availability: "Vuzix 说 Shrike 已开始向客户发出初始评估单元，并计划在 AUSA 2026（10 月 12–14 日）和 Modern Warfare Week（11 月 16–19 日）展示。公开资料没有消费者购买链接、公开售价、客户名称、交付批量或最终配置；当前可确认的是 B2B evaluation platform 和客户集成路径。",
      limitsOrUnknowns: "未知包括实际亮度在不同环境的可读性、双目重量、刷新率、端到端延迟、热、续航、抗冲击、防水、夜视兼容、地图/视频编码、Micro HDMI/Mini USB 的协议、军用认证、软件更新和客户数据安全。官方 release 也含有 forward-looking statements，商业化和未来订单不应当写成已发生事实。",
      productVerdict: "Shrike 是 confirmed product 的 B2B 显示平台，证据强度高于概念稿但低于具体客户部署。产品判断：它把防务 AR 的关键决策前移到可评估的光学和佩戴层；下一关是任务级遮挡、断链、强光和安全接管，而不是只比较亮度和视场角。"
    }, {
      productName: "Vuzix Shrike is a configurable waveguide display platform for defense, security, and first-responder applications. It provides working display hardware and interfaces for testing optics, fit, and system integration before a customer defines a purpose-built wearable system; it is not complete drone-control software or a consumer AI-glasses product.",
      productType: "The product is a task-oriented AR display platform with monocular or binocular options. Shrike combines full-colour waveguides, display optics, electrochromic tint, Vuzix Incognito technology for reduced outward light, and Micro HDMI/Mini USB interfaces. A customer can connect it to drones, UGVs, mission computers, or other support systems; the customer defines sensors, communications, and AI.",
      interactionFlow: "A mission system sends maps, situational-awareness data, drone or UGV video, or mission information through the interface, and the wearer reads overlays in a monocular or binocular view. Eye relief and the eyebox affect whether the wearer maintains a clear view, while tint can affect viewing in different environments. The release does not publish complete mission confirmation, alert priority, target-selection, takeover, link-loss, or maintenance flows.",
      specsOrStack: "Vuzix lists full-colour 1280x720 imagery, a 40-degree FOV, 16:9 aspect ratio, 3,000 nits to the eye, 25mm eye relief, a 14.3x14mm eyebox, optional electrochromic tint, monocular or binocular configuration, Micro HDMI, Mini USB, and Incognito forward-light control. Display chip, refresh rate, latency, weight, battery, protection rating, OS, SDK, sensors, encryption, and complete system price are source not stated.",
      useCases: "The release names situational awareness, drone and unmanned-ground-vehicle operations, mission information, military wearable-display evaluation, defense/security/first-responder demonstrations, HMI development, and custom/OEM integration. It fits systems that need information in the field of view. The source proves a customer-evaluation platform, not that a particular defense workflow is deployed or meets an operational standard.",
      painPointsSolved: "Shrike addresses the gap between an optical prototype and a dedicated wearable system. Customers can evaluate display performance, fit, monocular/binocular choices, and interfaces without defining the entire product first. A configurable waveguide platform and U.S. manufacturing also move supply-chain decisions earlier. It does not solve mission-data standards, link reliability, sunlight/night transition, overlay occlusion, training, ergonomics, cybersecurity, or military certification.",
      userVoice: "There is no independent long-term operator test or mission exercise report in the public sources. The strongest concrete evidence is Vuzix's statement that initial evaluation units have shipped to customers; use cases and performance numbers remain vendor disclosures. Shipping evaluation units must not be read as deployment, military acceptance, or proof of improved mission performance.",
      newTech: "The product combines configurable full-colour waveguides, electrochromic tint, and Incognito light control with monocular/binocular choices, 25mm eye relief, and a 14.3x14mm eyebox. The innovation is primarily systems integration: customers can validate mission requirements with a working optical module and then define dedicated hardware, rather than placing a particular AI model inside a finished consumer frame.",
      availability: "Vuzix says initial Shrike evaluation units have shipped to customers and plans demonstrations at AUSA 2026 on October 12–14 and Modern Warfare Week on November 16–19. The public material does not give a consumer purchase link, public price, customer names, batch size, or final configuration. What is confirmed is a B2B evaluation platform and a customer-integration path.",
      limitsOrUnknowns: "Open questions include readability in different light, binocular weight, refresh rate, end-to-end latency, heat, battery, impact and water resistance, night-vision compatibility, map/video encoding, Micro HDMI/Mini USB protocols, military certification, software updates, and customer-data security. The release also contains forward-looking statements; commercialization and future orders should not be written as completed facts.",
      productVerdict: "Shrike is a confirmed-product B2B display platform, with stronger evidence than a concept brief but less than a named customer deployment. Verdict: it moves defense AR decisions toward testable optics and wearability. The next gate is mission-level occlusion, link loss, sunlight, and safe takeover—not simply comparing brightness and field of view."
    })
  })
];
