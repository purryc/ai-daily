import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const dataPath = path.join(root, "data", "issues.json");
const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = issues.find((entry) => entry.date === "2026-08-20");
if (!previous) throw new Error("Missing 2026-08-20 source issue");

const date = "2026-08-21";
const issue = structuredClone(previous);
issue.date = date;
issue.zhTitle = "AI Daily 2026-08-21：手机开始移动它的相机，具身 AI 进入拍摄链路";
issue.enTitle = "AI Daily 2026-08-21: The phone starts moving its camera, and embodied AI enters the capture loop";
issue.zhSummary = "HONOR Robot Phone 已在中国进入销售窗口：4-DoF 机械云台、200MP 主摄、YOYO Robot Mode 与 ARRI Image Science 把手机变成可移动的拍摄节点；上手评测证明机械结构可工作，也暴露低光、竖拍和 AI 价值的边界。今天的主线是：当 AI 从屏幕建议走向物理动作，用户能否看见动作意图、控制权、失败回退和耐久成本。";
issue.enSummary = "HONOR Robot Phone has entered a China sales window with a 4-DoF mechanical gimbal, a 200MP main camera, YOYO Robot Mode, and ARRI Image Science, turning the phone into a movable capture node. Hands-on reviews suggest the mechanism works while exposing low-light, vertical-video, and AI-value limits. Today’s test is whether users can see intent, control, recovery, and durability costs when AI moves from screen suggestions into physical motion.";
issue.zhPath = `/ai-daily/${date}/zh/`;
issue.enPath = `/ai-daily/${date}/en/`;
issue.sourcesPath = `/ai-daily/${date}/sources.md`;
issue.sourceTypes = [...new Set([...(issue.sourceTypes ?? []), "confirmed product", "review/community friction", "china", "global"])] ;
for (const topic of issue.topics) topic.sourceDate = `${topic.sourceDate} · 2026-08-21 current source sweep`;

const robotPhone = {
  id: "honor-robot-phone-4dof-gimbal",
  section: "china",
  zhHeadline: "HONOR Robot Phone：让手机的相机真的开始移动",
  enHeadline: "HONOR Robot Phone makes the phone camera physically move",
  zhFact: "HONOR 官方宣布 Robot Phone 在中国上市，提供 12GB+512GB 与 16GB+1TB 两种配置，定价分别为 RMB 9,999 与 RMB 12,999；官方页披露 Titanium Agile Gimbal、YOYO Robot Mode 和 ARRI Image Science。T3、PetaPixel、Tom’s Guide、WIRED 与 Android Authority 的上手报道均把 4-DoF/机械云台作为核心体验。美国可得性、Google 服务、长期耐久与第三方应用控制接口仍需区分已知与未知。",
  enFact: "HONOR announced that the Robot Phone entered sales in China in two configurations: 12GB+512GB at RMB 9,999 and 16GB+1TB at RMB 12,999. The official product page names the Titanium Agile Gimbal, YOYO Robot Mode, and ARRI Image Science. Hands-on reports from T3, PetaPixel, Tom’s Guide, WIRED, and Android Authority treat the 4-DoF mechanical gimbal as the central experience. Availability outside China, Google services, long-term durability, and third-party camera control remain separate questions.",
  zhValue: "它不是把一个 AI 聊天入口塞进手机，而是把相机从固定模块变成可以转动、抬头、跟踪和改变取景的物理执行器。创作者可以把手机放在桌面上，让云台跟随人物；旅行者可以用手机完成比普通手机更稳定的移动拍摄；YOYO Robot Mode 则让机械结构用点头、转向或舞动表达状态。这个形态把计算摄影、机械控制、被摄主体识别与声音方向重新放进同一个产品回路，也让耐久、夹伤、遮挡、误跟踪和电量成为可见成本。",
  enValue: "This is not only a chat entry point placed inside a phone. It turns the camera from a fixed module into a physical actuator that can rotate, tilt, track, and change framing. A creator can place the phone on a table and let the gimbal follow a person; a traveler can get more stable moving footage without carrying a separate pocket gimbal; YOYO Robot Mode uses nods, turns, and motion as a playful state expression. The form reconnects computational photography, mechanical control, subject recognition, and audio direction in one product loop, while making durability, obstruction, mis-tracking, pinch risk, and battery cost visible.",
  zhHciLens: ["物理意图", "动作可见性", "单人拍摄"],
  enHciLens: ["physical intent", "motion legibility", "solo capture"],
  zhImplication: "具身 AI 的关键反馈不只在屏幕上。云台开始移动前，用户需要知道它将跟踪谁、转向哪里、是否会越过安全边界；移动中要看到目标锁定、人工接管和停止入口；失败时要回到固定镜头或手动取景。Robot Phone 把“动作”变成了系统输出，产品必须像展示按钮状态一样展示运动意图。",
  enImplication: "Embodied AI needs feedback beyond the screen. Before the gimbal moves, the user needs to know whom it will track, where it will turn, and whether it may cross a safety boundary. During motion, the target lock, manual takeover, and stop control need to remain legible. When tracking fails, the system should return to a fixed camera or manual framing. Robot Phone makes motion a system output, so the product must expose physical intent as clearly as it exposes a button state.",
  sourceDate: "2026-08-12 official launch · 2026-08-17 PetaPixel hands-on · 2026-08-19 T3 hands-on · 2026-08-21 current source sweep",
  evidenceLabel: "confirmed product",
  evidenceStrength: "confirmed product · official launch · independent hands-on · China availability",
  visual: {
    path: "assets/honor-robot-phone-official-2026-08.png",
    width: 1600,
    height: 1000,
    kind: "source-backed page screenshot",
    altZh: "HONOR Robot Phone 官方产品页截图",
    altEn: "HONOR Robot Phone official product page",
    captionZh: "来源追踪视觉：HONOR Robot Phone 官方产品页；页面展示 Titanium Agile Gimbal、YOYO Robot Mode、ARRI Image Science 与 Buy 入口。中国销售和海外可得性需分开记录。",
    captionEn: "Source-traceable visual: HONOR Robot Phone official product page. The page shows the Titanium Agile Gimbal, YOYO Robot Mode, ARRI Image Science, and a Buy entry; China sales and overseas availability are tracked separately.",
    sourceUrl: "https://www.honor.com/global/phones/honor-robot-phone/"
  },
  sources: [
    { label: "HONOR official launch announcement", url: "https://www.honor.com/global/news/honor-robot-phone-launch/" },
    { label: "HONOR Robot Phone official product page", url: "https://www.honor.com/global/phones/honor-robot-phone/" },
    { label: "HONOR China launch announcement", url: "https://www.honor.com/cn/news/honor-robot-phone-launch/" },
    { label: "PetaPixel hands-on review", url: "https://petapixel.com/2026/08/17/honor-robot-phone-hands-on-this-isnt-a-gimmick/" },
    { label: "T3 hands-on review", url: "https://www.t3.com/tech/android-phones/after-using-the-honor-robot-phones-basically-peerless-gimbal-camera-i-cant-work-out-if-its-the-future-or-not" },
    { label: "Tom's Guide hands-on", url: "https://www.tomsguide.com/phones/i-tried-the-honor-robot-phone-and-its-the-coolest-phone-in-years-thats-not-coming-to-the-us" },
    { label: "WIRED product report", url: "https://www.wired.com/story/honor-robot-phone/" },
    { label: "Android Authority hands-on", url: "https://www.androidauthority.com/honor-robot-phone-hands-on-3697387/" },
    { label: "HONOR Robot Phone community discussion", url: "https://www.reddit.com/r/Honor/comments/1vn7kot/honors_new_flagship_takes_smartphone_photography/" }
  ],
  dossierKind: "product",
  dossier: {
    zh: {
      productName: "HONOR Robot Phone 是荣耀面向中国市场推出的具身摄影型智能手机。它用可伸缩、可转动的 Titanium Agile Gimbal 取代固定主摄模块，把手机从被动记录工具变成能够改变镜头方向、跟踪主体和表达状态的物理系统。官方在 2026 年 8 月 12 日发布，官方销售从 8 月 18 日开始；媒体在中国进行了现场上手。",
      productType: "产品类型是 Android 智能手机、机械云台相机和 AI 拍摄系统的组合。手机主体仍然承担通讯、计算和显示，顶部的主摄则拥有独立的机械运动。官方称它采用 4-DoF mechanical gimbal，并把 ARRI Image Science、YOYO Robot Mode 和 AI-powered motion control 作为产品卖点。它的竞争边界同时触及传统旗舰手机、DJI Osmo Pocket 一类的口袋云台相机，以及需要自己架设三脚架或请人跟拍的内容创作工具。",
      interactionFlow: "用户可以像使用普通手机一样打开相机，也可以让机械云台弹出并通过屏幕方向控制、语音或 AI subject tracking 改变镜头姿态。拍摄者把手机放在桌面、支架或手中，选择人物、宠物或运动对象，系统再让相机持续跟随或保持构图。媒体上手还描述了云台的转动、滚转、追踪和 YOYO Robot Mode 的动作表达。公开证据没有完整展示第三方应用如何调用云台、动作开始前的确认、目标误锁时的接管、物理停止键、夹伤保护或断电收回流程；这些都属于使用前必须验证的控制面。",
      specsOrStack: "HONOR 官方发布信息列出 12GB+512GB 和 16GB+1TB 两个配置，价格为 RMB 9,999 与 RMB 12,999；官方称其拥有完全集成的 4-DoF mechanical gimbal、HONOR Titanium Agile Gimbal、AI-powered motion control 和 ARRI Image Science。PetaPixel、T3、Tom’s Guide 和 HardwareZone 的报道补充了 200MP、f/1.6 主摄与 Snapdragon 8 Elite Gen 5 等信息，但不同媒体对传感器尺寸、DoF 表述和完整相机组合的写法不完全一致，因此规格需按各自来源保留。官方与评测没有完整公开云台电机型号、运动范围、关节寿命、RAM 之外的存储策略、Camera2/CameraX API、第三方 app 支持、端云模型路由、续航与维修成本；未声明部分均为 source not stated。",
      useCases: "具体场景包括单人 vlog、桌面直播、旅行记录、家庭活动、宠物跟拍、运动拍摄、动态合影和需要稳定移动镜头的短视频生产。创作者可以把手机放在远处，让相机追踪自己，减少一只手拿手机或另带 pocket gimbal 的负担；旅行者可以在同一台设备上完成拍摄、剪辑、通讯和发布；普通用户可以把机械动作作为拍照反馈或陪伴式表情。手机形态还保留了传统手持拍摄路径，用户可以关闭跟踪并手动构图。中国限定、系统服务差异和大型机身的口袋携带成本，会直接影响这些场景是否成立。",
      painPointsSolved: "Robot Phone 试图解决单人拍摄需要额外三脚架、云台或第二个人操作的问题，也试图把稳定、跟踪和主体构图从拍摄者的手部操作中释放出来。机械云台让相机可以主动保持人物在画面里，减少走动时的抖动和反复回看；手机与云台合体则减少一个设备、一个电池和一次文件转移。它没有消除手机拍摄的光线、收音、取景和社交摩擦。T3 的上手判断对画面稳定和移动跟踪较积极，但 Tom’s Guide 指出低光表现和真正竖屏录制存在问题；WIRED 认为 YOYO 与机械动作的 AI 结合更像 gimmick。痛点解决程度因此集中在镜头控制，而非泛化的 AI 助手能力。",
      userVoice: "PetaPixel 认为这是一款已经完成、并且机械云台确实工作的产品，但也指出体验是在发布会和共享设备条件下完成，长期耐久仍待验证。Tom’s Guide 的早期判断肯定顺滑、无抖动的视频和 AI 主体跟踪，同时列出低光与竖拍局限。T3 的上手文章认为云台相机很有说服力，却对它是否代表未来保持犹豫。WIRED 对 YOYO Robot Mode 的评价更保守。Reddit 讨论则集中在中国限定、是否支持 Google 服务、价格与第三方相机 API；这些是社区摩擦信号，不能替代官方规格。",
      newTech: "新技术是把机械运动直接纳入手机相机的默认交互。4-DoF 云台让镜头可以做超出传统 OIS 的姿态变化，AI subject tracking 负责把运动目标转成控制命令，ARRI Image Science 负责向专业影像工作流靠拢，YOYO Robot Mode 则把机械动作变成可理解的角色反馈。真正的产品难点在控制闭环：视觉模型要识别目标，规划器要决定跟随速度和角度，电机要在热量与电量限制内执行，系统还要在遮挡、丢失、用户触碰和旁观者环境变化时及时停止。官方没有公开模型、控制频率或安全阈值。",
      availability: "HONOR 官方称中国预订从 2026 年 8 月 12 日开始，正式销售从 8 月 18 日开始；官方给出的配置和价格是 RMB 9,999 与 RMB 12,999。官方全球产品页存在 Buy 入口，但公开材料没有确认中国以外的正式销售地区、库存、发货、保修和 Google 移动服务。WIRED 报道它目前为 China-exclusive，并指出 HONOR 在美国没有销售存在。今天可以确认中国市场产品与独立上手，不应把全球可买或开发者 API 写成已确认事实。",
      limitsOrUnknowns: "长期使用的核心未知是云台机构的跌落、灰尘、进液、口袋挤压和反复伸缩寿命；单人拍摄的关键未知是误跟踪、遮挡、多人场景目标切换、低光和竖屏构图；系统层的关键未知是第三方相机 app 是否能调用云台、YOYO 是否依赖网络、Google 服务是否存在、数据是否上传以及用户能否导出或删除训练相关记录。大体积、价格、机械噪声、发热和电池消耗也可能抵消少带一个设备的收益。所有未被官方或独立评测明确说明的数字、地区、接口和寿命，均应保持 source not stated。",
      productVerdict: "HONOR Robot Phone 是本期最强的 confirmed product：它把具身 AI 的承诺落到可见的机械动作，并且已经有中国销售、官方规格与多家独立上手。它的真实价值集中在单人拍摄和移动构图，YOYO 的人格化动作目前更像加分项，不能替代稳定的控制、停止和恢复。产品判断：机械云台与拍摄链路值得关注，AI 助手叙事需要降权；下一步优先验证第三方应用接入、长周期耐久、低光/竖屏、误跟踪恢复与全球服务边界。"
    },
    en: {
      productName: "HONOR Robot Phone is a China-launched smartphone built around embodied photography. Its retractable, movable Titanium Agile Gimbal replaces the idea of a fixed main-camera module with a physical system that can change lens direction, track a subject, and express state through motion. HONOR announced it on August 12, 2026, and official sales began on August 18; independent outlets have handled the device in China.",
      productType: "The product combines an Android smartphone, a mechanical gimbal camera, and an AI-assisted capture system. The handset still provides communication, computation, and display, while the top-mounted main camera has its own mechanical movement. HONOR describes a fully integrated 4-DoF mechanical gimbal and positions ARRI Image Science, YOYO Robot Mode, and AI-powered motion control as product pillars. Its competitive boundary touches flagship phones, pocket gimbals such as DJI Osmo Pocket, and the tripod-or-second-person workflow used by solo creators.",
      interactionFlow: "A user can open the camera like a normal phone, then let the mechanical gimbal extend and change its pose through on-screen directional control, voice, or AI subject tracking. The creator places the phone on a table, stand, or in a hand, selects a person, pet, or moving object, and lets the camera maintain a target or composition. Hands-on reports describe the gimbal rolling, turning, tracking, and using YOYO Robot Mode for expressive movement. Public evidence does not expose the complete third-party app path, pre-motion confirmation, takeover after a wrong lock, physical stop control, pinch protection, or power-loss retraction. Those control surfaces need acceptance testing before the motion is treated as trustworthy.",
      specsOrStack: "HONOR’s launch information lists 12GB+512GB and 16GB+1TB configurations priced at RMB 9,999 and RMB 12,999, and names a fully integrated 4-DoF mechanical gimbal, HONOR Titanium Agile Gimbal, AI-powered motion control, and ARRI Image Science. PetaPixel, T3, Tom’s Guide, and HardwareZone add details including a 200MP f/1.6 main camera and Snapdragon 8 Elite Gen 5, but outlets do not describe every sensor size, DoF definition, or camera combination identically, so each specification stays tied to its source. HONOR and reviewers have not fully disclosed motor model, motion range, joint life, Camera2/CameraX access, third-party application support, edge-cloud model routing, runtime, or repair cost. Unstated details remain source not stated.",
      useCases: "Concrete use cases include solo vlogging, desk livestreams, travel capture, family activities, pet tracking, sports footage, dynamic group photos, and short-form video that needs a stable moving viewpoint. A creator can place the phone at a distance and let the camera follow, reducing the need to hold a phone or carry a second pocket gimbal. A traveler can capture, edit, communicate, and publish from the same device. A casual user can treat mechanical movement as a photo cue or companion-like expression. The conventional handheld path remains available when tracking is disabled. China-only availability, service differences, and pocket bulk directly affect whether these scenarios persist beyond a demo.",
      painPointsSolved: "Robot Phone targets the solo-creation problem of needing a tripod, gimbal, or second operator for stable tracking and framing. The mechanical head can keep a person in shot and reduce shake or repeated reframing; integrating phone and gimbal also removes one device, one battery, and one file-transfer step. It does not remove lighting, audio, framing, or social friction from mobile capture. T3 is positive about stability and subject tracking while remaining uncertain about the category’s future. Tom’s Guide highlights smooth video and tracking but lists weak low-light performance and the lack of true vertical video. WIRED treats the YOYO-plus-motion layer as more gimmicky. The strongest value is camera control, not a general-purpose AI assistant.",
      userVoice: "PetaPixel calls the product finished and says the mechanical gimbal genuinely works, while noting that the experience was a launch event with shared devices rather than long-term ownership. Tom’s Guide’s early verdict praises smooth, shake-free video and AI subject tracking, while listing low-light and vertical-video limits. T3 describes a compelling gimbal camera but remains unsure whether it represents the future. WIRED is more skeptical of YOYO’s robotic-AI presentation. Reddit discussions focus on China-only availability, Google-service questions, price, and third-party camera APIs. Those are community-friction signals and do not replace official specifications.",
      newTech: "The new technology is the inclusion of mechanical motion inside the default phone-camera interaction. A 4-DoF gimbal can change pose beyond traditional optical stabilization; AI subject tracking converts a visual target into control commands; ARRI Image Science connects the device to a professional-imaging narrative; and YOYO Robot Mode turns movement into legible character feedback. The real product challenge is the control loop: vision must identify the target, a planner must choose speed and angle, motors must execute within heat and power limits, and the system must stop when occlusion, loss, touch, or bystander conditions change. HONOR has not published the model, control frequency, or safety thresholds.",
      availability: "HONOR says China pre-orders began on August 12, 2026, with official sales beginning on August 18; the company lists 12GB+512GB at RMB 9,999 and 16GB+1TB at RMB 12,999. A global product page contains a Buy entry, but public material does not confirm formal sales regions outside China, inventory, shipping, warranty, or Google Mobile Services. WIRED describes the phone as China-exclusive and notes that HONOR has no US presence. The confirmed surface today is a China-market product with independent hands-on evidence, not global availability or a public developer API.",
      limitsOrUnknowns: "The main long-term unknown is the gimbal mechanism’s resistance to drops, dust, liquid, pocket pressure, and repeated extension. Solo-capture questions include wrong tracking, occlusion, multi-person target switching, low light, and vertical framing. System questions include third-party camera access, YOYO’s network dependency, Google services, upload behavior, and export or deletion of training-related records. Bulk, price, mechanical noise, heat, and battery drain can also erase the benefit of carrying one fewer device. Any number, region, interface, or lifetime not explicitly stated by the official or independent sources remains source not stated.",
      productVerdict: "HONOR Robot Phone is the issue’s strongest confirmed product because it puts embodied-AI claims into visible mechanical action, with China sales, official product facts, and multiple independent hands-on reports. Its defensible value is solo capture and moving composition; YOYO’s personality layer is an accessory to reliable control, stop, and recovery rather than a substitute for them. Verdict: the gimbal and capture loop deserve serious attention, while the AI-assistant story should be discounted until third-party access, long-cycle durability, low-light and vertical capture, wrong-target recovery, and global service boundaries are verified."
    }
  }
};

issue.topics.unshift(robotPhone);
issue.coverStory = {
  topicId: robotPhone.id,
  zhTitle: "HONOR Robot Phone：当 AI 开始移动相机，手机还是手机吗？",
  enTitle: "HONOR Robot Phone: when AI moves the camera, is the phone still a phone?",
  zhSummary: [
    "HONOR Robot Phone 把 4-DoF Titanium Agile Gimbal、YOYO Robot Mode 与 ARRI Image Science 集成进手机，并已在中国进入销售。",
    "多家独立上手确认云台确实能转动、跟踪和稳定拍摄，同时指出低光、竖拍、AI 价值与长期耐久仍有边界。",
    "今天的验收点是物理意图、目标锁定、人工接管、停止入口和失败回退，而不是机械动作看起来有多像机器人。"
  ],
  enSummary: [
    "HONOR integrates a 4-DoF Titanium Agile Gimbal, YOYO Robot Mode, and ARRI Image Science into a phone already on sale in China.",
    "Independent hands-ons confirm that the gimbal can move, track, and stabilize footage while exposing low-light, vertical-video, AI-value, and durability limits.",
    "The acceptance test is physical intent, target lock, manual takeover, stop control, and recovery—not how robotic the motion looks."
  ],
  imagePath: robotPhone.visual.path,
  imageWidth: robotPhone.visual.width,
  imageHeight: robotPhone.visual.height,
  imageSourceUrl: robotPhone.visual.sourceUrl,
  primarySourceUrl: robotPhone.visual.sourceUrl,
  evidenceStrength: robotPhone.evidenceStrength,
  whyCover: "It is a shipped product that makes physical camera motion part of the phone’s user interface, with both strong hands-on evidence and clear failure costs."
};
issue.watchlistZh = [
  "HONOR Robot Phone：第三方 Camera2/CameraX 接入、海外服务、云台耐久、误跟踪回退与真实续航。",
  "Razer Project Motoko：Q2 developer kit 的开放范围、录制提示、模型路由、价格与量产时间。",
  "摄像头 AirPods 弱信号：是否出现 Apple 官方公告、录制指示、权限与删除路径。",
  ...issue.watchlistZh.filter((item) => !item.includes("HONOR") && !item.includes("Razer Project Motoko") && !item.includes("AirPods"))
];
issue.watchlistEn = [
  "HONOR Robot Phone: third-party Camera2/CameraX access, overseas services, gimbal durability, wrong-target recovery, and real runtime.",
  "Razer Project Motoko: real Q2 developer-kit access, capture indicators, model routing, pricing, and production timing.",
  "Camera-equipped AirPods weak signal: whether Apple publishes an official announcement, recording cue, permissions, and deletion path.",
  ...issue.watchlistEn.filter((item) => !item.includes("HONOR") && !item.includes("Razer Project Motoko") && !item.includes("AirPods"))
];
issue.designDesk = {
  ...issue.designDesk,
  zhTitle: "设计台：让物理动作也能被看懂、接管和停止",
  enTitle: "Design Desk: make physical action legible, interruptible, and recoverable",
  zhIntro: "当设备开始移动镜头、追踪主体或切换传感器时，把意图、权限、目标和回退都放进可见的交互链路。",
  enIntro: "When a device moves a camera, tracks a subject, or changes sensors, keep intent, permission, target, and recovery visible in the interaction loop."
};

const nextIssues = [issue, ...issues.filter((entry) => entry.date !== date)];
await fs.writeFile(dataPath, `${JSON.stringify(nextIssues, null, 2)}\n`);
console.log(`Prepared ${date}: ${issue.topics.length} topics, ${new Set(issue.topics.flatMap((topic) => topic.sources.map((source) => source.url))).size} unique topic sources, ${new Set([issue.coverStory.imagePath, ...issue.topics.map((topic) => topic.visual.path)]).size} visuals.`);
