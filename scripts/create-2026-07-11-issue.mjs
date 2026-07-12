import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const date = "2026-07-11";
const issuesPath = path.join(root, "data", "issues.json");
const issues = JSON.parse(await fs.readFile(issuesPath, "utf8"));
const previous = issues.find((issue) => issue.date === "2026-07-10");
if (!previous) throw new Error("Missing 2026-07-10 source issue");

const clone = (value) => structuredClone(value);
const source = (label, url) => ({ label, url });

function visual(pathName, width, height, title, sourceUrl, captionZh, captionEn) {
  return {
    path: `assets/${pathName}`,
    width,
    height,
    kind: "source-backed screenshot",
    altZh: `真实来源截图：${title}`,
    altEn: `Source-backed screenshot: ${title}`,
    captionZh,
    captionEn,
    sourceUrl
  };
}

function productTopic({ id, section, zhHeadline, enHeadline, sourceDate, evidenceLabel, evidenceStrength, visual: itemVisual, sources, hciZh, hciEn, zh, en }) {
  return {
    id,
    section,
    zhHeadline,
    enHeadline,
    zhFact: `${zh.productName}：${zh.productType}。本条按 ${evidenceLabel} 处理；规格、价格、地区、日期只采用来源明示信息，未披露处写 source not stated。`,
    enFact: `${en.productName}: ${en.productType}. This item is handled as ${evidenceLabel}; specs, price, regions and dates use cited source claims only, and missing details remain source not stated.`,
    zhValue: zh.productVerdict,
    enValue: en.productVerdict,
    zhHciLens: hciZh,
    enHciLens: hciEn,
    zhImplication: zh.painPointsSolved,
    enImplication: en.painPointsSolved,
    sourceDate,
    evidenceLabel,
    evidenceStrength,
    visual: itemVisual,
    sources,
    dossierKind: "product",
    dossier: { zh, en }
  };
}

function scanTopic({ id, section, zhHeadline, enHeadline, sourceDate, evidenceLabel, evidenceStrength, visual: itemVisual, sources, zh, en }) {
  return {
    id,
    section,
    zhHeadline,
    enHeadline,
    zhFact: `${zh.productName}：${zh.productType}。这是 ${evidenceLabel}，用于记录具体信号与证据缺口，不作为已上市产品事实。`,
    enFact: `${en.productName}: ${en.productType}. This is a ${evidenceLabel} used to record a concrete signal and its evidence gap, not a confirmed product fact.`,
    zhValue: zh.productVerdict,
    enValue: en.productVerdict,
    zhHciLens: ["证据边界", "用户摩擦", "下一次验证"],
    enHciLens: ["evidence boundary", "user friction", "next verification"],
    zhImplication: zh.painPointsSolved,
    enImplication: en.painPointsSolved,
    sourceDate,
    evidenceLabel,
    evidenceStrength,
    visual: itemVisual,
    sources,
    dossierKind: "scan",
    dossier: { zh, en }
  };
}

const geminiVisual = visual(
  "gemini-spark-mac-source-2026-07-01.jpg",
  1600,
  814,
  "Gemini Spark on Mac",
  "https://blog.google/innovation-and-ai/products/gemini-app/gemini-spark-updates-june-2026/",
  "真实来源截图：Google Gemini Spark Mac 更新与本地文件自动化页面；画面来自 TechCrunch 产品报道，来源链见总表。",
  "Source-backed screenshot for Gemini Spark on Mac; the image is from TechCrunch product coverage and the official Google update is linked in the ledger."
);
const metaVisual = visual(
  "meta-ai-glasses-source-2026-07.png",
  1200,
  675,
  "Meta AI Glasses 2026",
  "https://about.fb.com/news/2026/07/metas-ai-glasses-your-questions-answered/amp/",
  "真实来源截图：Meta 官方 AI glasses 问答页，记录 2026 年产品功能、隐私和使用方式。",
  "Source-backed screenshot from Meta's official AI glasses Q&A covering 2026 product behavior and privacy."
);
const nvidiaVisual = visual(
  "nvidia-xr-ai-source-2026-06.png",
  2048,
  1152,
  "NVIDIA XR AI and VITURE Helix",
  "https://developer.nvidia.com/xr/xr-ai",
  "真实来源截图：NVIDIA XR AI developer page，展示眼镜将现场视觉与 agent guidance 连接起来的开发者产品表面。",
  "Source-backed screenshot from the NVIDIA XR AI developer page showing the developer surface for real-time, hands-free agent guidance."
);

const old = Object.fromEntries(previous.topics.map((topic) => [topic.id, clone(topic)]));

const gemini = productTopic({
  id: "google-gemini-spark-mac-agent",
  section: "official",
  zhHeadline: "Gemini Spark 把 Mac 变成可被远程委派的个人工作环境",
  enHeadline: "Gemini Spark turns the Mac into a remotely delegated work environment",
  sourceDate: "2026-06-30 official update · 2026-07-01 Mac availability",
  evidenceLabel: "confirmed product",
  evidenceStrength: "confirmed product · Mac app · local-file automation",
  visual: geminiVisual,
  sources: [
    source("Google: Gemini Spark updates", "https://blog.google/innovation-and-ai/products/gemini-app/gemini-spark-updates-june-2026/"),
    source("Google Gemini app updates", "https://gemini.google.com/updates"),
    source("TechCrunch: Gemini Spark on Mac", "https://techcrunch.com/2026/07/01/gemini-spark-googles-agentic-assistant-is-now-available-on-mac/"),
    source("T3: Gemini Spark Mac rollout", "https://www.t3.com/tech/apps/gemini-spark-ai-is-now-on-mac-and-this-is-how-it-can-help-your-life")
  ],
  hciZh: ["远程委派本地任务", "文件权限边界", "后台工作可见性"],
  hciEn: ["remote delegation", "local-file permissions", "background work visibility"],
  zh: {
    productName: "Google Gemini Spark for Mac",
    productType: "Gemini Spark 是 Google 在 Gemini 体系中推出的 agentic assistant；6 月 30 日官方更新明确加入 Mac 端能力，7 月初媒体报道其 Mac app 可把 Gemini 从聊天窗口推向本机任务执行。它不是单纯的模型换代：用户可以从手机或 Web 把多步任务委派给 Mac，例如查找本地销售报告、读取数字、发邮件；任务在电脑上持续执行，即使用户暂时离开 Mac。官方更新把它放进 Gemini app、connected apps 和个人电脑工作流，而不是只作为浏览器问答。",
    interactionFlow: "用户先在 Gemini app 中描述一个目标，不必把每个点击步骤写成脚本。Spark 识别需要本机文件、浏览器或邮件的步骤，获得对应权限后在 Mac 上执行。Google 给出的例子是：从手机要求它在 Mac 上找到指定销售报告、提取总收入并邮件发送；系统在电脑端完成工作，用户可在远端等待结果或继续安排下一项任务。当前来源还提到未来可从 Web 或 mobile 直接 command Spark 运行 Mac 任务或访问本地文件，实际 rollout 仍需看账户状态。",
    specsOrStack: "官方来源明确：Gemini Spark 可通过 Gemini Mac app 工作；更新包含 connected apps、macOS launch，以及从手机委派多步 Mac 任务的方向；Gemini 更新页写明 2026-06-30 起 Mac app 英文可用，面向支持国家、18 岁以上 Google AI Ultra 订阅者。任务栈涉及 Gemini app、Google Cloud 托管的 agent 执行环境与用户自己的 Mac 文件/应用；来源没有披露本地模型、芯片要求、文件索引方式、权限 API、沙箱隔离、后台时长、价格以外的完整层级或企业管理策略，均写 source not stated。",
    useCases: "真实场景是远程找文件、整理本地资料、从表格读取一个数字、把结果发给同事、跨应用收集信息、安排会议前的准备工作，以及用户离开电脑后仍要完成的多步骤任务。它对设计师、销售、研究员和需要频繁处理本地文件的人尤其有吸引力，因为用户可以用手机发起，但结果落在真正拥有文件和应用上下文的 Mac 上。产品价值取决于它能否把“我想完成的事”变成可观察、可暂停、可恢复的工作状态。",
    painPointsSolved: "Gemini Spark 解决的是两种割裂：聊天 agent 能理解目标，却拿不到本机文件；桌面自动化能操作电脑，却要求用户预先写流程。把远程委派、Mac 本地上下文和多步 agent 放在一起后，用户少了复制文件、上传截图和逐步说明的成本。但风险也更具体：一旦权限范围过宽，agent 可能读取不该读的文件；一旦执行状态不可见，用户很难判断它是否真的发了邮件、是否读错版本、是否还在后台运行。",
    userVoice: "当前证据来自 Google 官方更新、Gemini 更新页和媒体产品报道，尚无足够长期用户评测。TechCrunch 与 T3 的价值是把 Mac app、远程委派和本地文件自动化转化为可理解的使用流程；实际错误率、权限弹窗可读性、文件选择准确率、Mac 休眠后的任务恢复和企业用户接受度仍需观察，source not stated。",
    newTech: "新技术点是把 agent 的执行位置从云端聊天窗口扩展到用户的个人电脑。手机或 Web 成为委派入口，Mac 成为拥有文件、应用和登录状态的执行现场，云端负责理解目标、调度与反馈。这个形态会把权限、任务锁、执行日志、撤销和“当前正在操作哪一个窗口”推到产品前台；agent 的质量不再只由回答文本决定。",
    availability: "Google Gemini 更新页标注 2026-06-30 起 Gemini Spark 在 macOS app 中以英文向支持国家的 Google AI Ultra、18 岁以上用户开放；Google 另提供 gemini.google/mac 下载入口。Web 或 mobile 直接访问本地 Mac 文件的完整可用范围、国家列表、企业工作区策略、免费层级和 API 形态为 source not stated。",
    limitsOrUnknowns: "核心未知包括：本地文件权限是否按任务最小化、是否有可审计的操作时间线、任务失败后能否回滚、Mac 休眠/断网时如何续跑、多个用户账户如何隔离、敏感文件是否会离开设备，以及用户能否在远端一键停止。多步 agent 一旦进入真实桌面，误操作的代价会高于聊天窗口中的错误文本。",
    productVerdict: "Gemini Spark 的产品意义在于把“个人电脑”变成 agent 的执行现场，而不只是运行模型的硬件。它抓住了一个真实缺口：用户想委派目标，却不想把本地上下文搬到云端再手工复原。Google 需要证明的不是它会不会点 Mac，而是用户能否看见权限、步骤、风险和完成状态。只要这些控制面做得清楚，Mac 会从应用容器变成个人 agent 的工作台。"
  },
  en: {
    productName: "Google Gemini Spark for Mac",
    productType: "Gemini Spark is Google’s agentic assistant inside the Gemini product family. Google’s June 30 update adds Mac capabilities, and early-July reporting describes a native Mac app that moves Gemini beyond a chat window into local-computer work. This is not simply a model refresh. A user can delegate a multi-step goal from a phone or web surface to a Mac, such as finding a sales report on the computer, extracting a revenue number, and emailing it. The computer keeps working while the user is away. Google frames Spark around the Gemini app, connected apps, and personal-computer workflows rather than only browser Q&A.",
    interactionFlow: "The user describes an outcome in Gemini instead of scripting each click. Spark identifies steps that require local files, apps, or email, requests the relevant permissions, and executes on the Mac. Google’s example is explicit: from a phone, ask Spark to find a specific sales report on a Mac, pull out the total revenue, and email it. The computer performs the work while the user is away, and the user can wait for the result or queue another goal. Google’s update also says that web or mobile control of Mac tasks and local files is coming, so exact rollout should be checked against the account’s current behavior.",
    specsOrStack: "The official sources support a Gemini Mac app, connected-app updates, Mac availability, and the ability to delegate multi-step Mac work from a phone. The Gemini updates page says that from June 30, 2026, Gemini Spark is available in English in the macOS app to Google AI Ultra subscribers aged 18 and over in supported countries. The workflow spans the Gemini app, a cloud-hosted agent execution environment, and the user’s own Mac files and applications. Local-model behavior, chip requirements, file indexing, permission APIs, sandbox boundaries, background duration, complete pricing tiers, and enterprise administration are source not stated.",
    useCases: "Concrete jobs include finding a local file from a phone, extracting a number from a spreadsheet, collecting information across apps, sending a prepared result to a colleague, preparing meeting materials, and completing a multi-step task after the user leaves the desk. The appeal is strongest for designers, sales teams, researchers, and anyone who repeatedly works across local files and desktop applications. The user can initiate from a mobile surface while the result is produced where the real context lives. The product succeeds only if the work remains observable, pausable, and recoverable.",
    painPointsSolved: "Spark attacks a familiar split. A chat agent understands goals but cannot see the user’s local files; desktop automation can operate a computer but usually requires a prewritten procedure. Remote delegation plus local Mac context reduces copying, uploading, and step-by-step explanation. The risk is equally concrete. Broad permissions could expose the wrong files. An invisible background run could leave the user unsure whether an email was actually sent, which file version was read, or whether the agent is still active.",
    userVoice: "The current evidence is Google’s official update, Gemini’s release page, and media product coverage rather than long-term independent reviews. TechCrunch and T3 make the Mac app, remote delegation, and local-file automation legible as a product flow. Error rates, permission-copy clarity, file selection accuracy, recovery after sleep or network loss, and enterprise acceptance remain open; source not stated.",
    newTech: "The new product pattern is moving the agent’s execution site from a cloud chat window into the user’s personal computer. Phone or web becomes the delegation surface; the Mac becomes the execution site that has files, applications, and logged-in context. The cloud layer handles intent understanding, scheduling, and feedback. Permissions, task locks, execution logs, undo, and a clear indication of which window is being operated become front-stage product requirements. Agent quality is no longer measured only by the text of its answer.",
    availability: "Google’s Gemini updates page marks Gemini Spark as available in English in the macOS app from June 30, 2026, for Google AI Ultra subscribers aged 18 and over in supported countries. Google provides a gemini.google/mac download path. The complete availability of web or mobile access to local Mac files, country list, enterprise policy, free tier, and developer API surface is source not stated where the cited sources do not specify it.",
    limitsOrUnknowns: "The important unknowns are whether permissions are minimized per task, whether the user gets an auditable action timeline, whether failed work can be rolled back, what happens during Mac sleep or network loss, how multiple accounts are isolated, whether sensitive files leave the device, and whether the user can stop a run remotely. Once an agent operates a real desktop, a wrong action can cost more than a wrong sentence in a chat.",
    productVerdict: "Gemini Spark matters because it treats the personal computer as an agent execution site, not merely as hardware that runs a model. It addresses a real gap: users want to delegate outcomes without moving their local context into the cloud and reconstructing the task by hand. Google still has to prove not that Spark can click through a Mac, but that users can see permissions, steps, risk, and completion state. If that control surface is legible, the Mac becomes a personal agent workbench."
  }
});

const meta = productTopic({
  id: "meta-ai-glasses-privacy-controls",
  section: "reviews",
  zhHeadline: "Meta AI 眼镜把“持续在场”与防篡改隐私灯绑在一起",
  enHeadline: "Meta AI Glasses pair continuous presence with tamper-resistant privacy cues",
  sourceDate: "2026-07-08 official Q&A · 2026-07-09 review follow-up",
  evidenceLabel: "confirmed product",
  evidenceStrength: "confirmed product · official Q&A · review/community friction",
  visual: metaVisual,
  sources: [
    source("Meta: AI Glasses questions answered", "https://about.fb.com/news/2026/07/metas-ai-glasses-your-questions-answered/amp/"),
    source("Meta + EssilorLuxottica product launch", "https://about.fb.com/news/2026/06/meta-essilorluxottica-partner-launch-meta-glasses/"),
    source("Android Central hands-on review", "https://www.androidcentral.com/wearables/meta-glasses-hands-on-review"),
    source("TechRadar on super-sensing glasses", "https://www.techradar.com/computing/virtual-reality-augmented-reality/metas-super-sensing-ai-glasses-are-still-in-the-works-and-i-dont-know-if-i-should-be-excited-or-terrified")
  ],
  hciZh: ["相机状态反馈", "持续感知边界", "佩戴者与旁观者"],
  hciEn: ["camera-state feedback", "continuous-sensing boundary", "wearer and bystander"],
  zh: {
    productName: "Meta AI Glasses 2026",
    productType: "Meta AI Glasses 是 Meta 与 EssilorLuxottica 推出的消费级 AI 眼镜产品线，包含相机、开放式音频、语音控制和 Meta AI。Meta 官方 7 月问答页把它描述成可用于听音乐和播客、免提拍照/录像、快速访问 AI 助手以及日常辅助的产品；媒体评测补充了 2026 年新款的实际佩戴和软件体验。这里的产品重点不是“眼镜里有一个 chatbot”，而是它把相机、麦克风、开放式扬声器、手机连接和云端 AI 绑成持续在场的 agent 入口。",
    interactionFlow: "用户先通过手机 App 完成配对和设置，再把眼镜当成日常镜框佩戴。按键或语音唤醒后，用户可以拍照/录像、听音频、问 Meta AI、理解眼前内容、处理提醒或在免手状态下完成通讯。相机工作时，正面的 LED 负责向旁观者提供录制提示；Meta 官方问答和评测还提到，早期 7 月更新会在检测到 LED 被篡改时永久禁用相机。用户感知到的是“眼镜一直在场”，旁观者感知到的则是一个需要被解释和信任的传感器系统。",
    specsOrStack: "来源支持的系统栈包括 Meta AI Glasses、EssilorLuxottica 眼镜硬件、相机、开放式音频、语音控制、手机配套 App、Meta AI 服务和录制状态 LED；Meta 官方材料还描述了日常问答、视觉理解、音乐/播客、免提影像和生活管理。Android Central 报道 2026 年新款产品起价 299 美元，并指出镜片定制仍与 EssilorLuxottica 体系相关。电池容量、芯片型号、相机分辨率、麦克风数量、完整地区列表、云端处理边界、存储时长和 API 开放方式为 source not stated。",
    useCases: "可验证的使用场景包括免手拍照和录像、听播客与音乐、走路时问问题、识别或解释眼前内容、日程与生活管理、通话以及在双手忙碌时获取快速信息。对专业使用者，眼镜可以作为现场记录与语音查询入口；对普通消费者，它必须先像一副可长时间佩戴的眼镜。产品体验的关键在于：相机和麦克风要在真实环境中持续可用，同时不把旁观者变成未同意的传感器数据来源。",
    painPointsSolved: "Meta 解决的是屏幕依赖和手部占用，让用户在行走、购物、做家务或工作现场获得低摩擦 AI 入口；它也试图用 LED 和防篡改机制降低“隐形拍摄”的风险。问题是持续在场会放大隐私和控制成本：用户可能忘记眼镜仍在听，旁观者未必理解 LED，云端处理也可能让录制范围超出佩戴者的直觉。越接近日常眼镜，越需要把传感器状态做得比手机更清楚。",
    userVoice: "评测信号显示 2026 年新款眼镜延续了相机、开放音频和 AI 语音入口，Android Central 给出“值得推荐但并非适合所有人”的判断；社区帖则持续讨论相机灯、Wi-Fi/配对、只能使用 Meta AI、退货和售后摩擦。这些材料可以作为 review/community friction，不能替代大规模留存或长期隐私研究；用户满意度、跨地区功能差异和真实续航仍需继续跟踪。",
    newTech: "技术增量集中在“持续感知 + 可见信任信号”的组合，而不是某一项单独的模型指标。Meta 把视觉问答、语音、相机、开放音频与手机/云端服务放进日常镜框；防篡改后禁用相机则把隐私规则从建议变成设备状态。未来如果进入更强的 super-sensing 版本，持续记录和持续聆听会让同一个设计问题扩大：设备怎样表达正在收集什么、为谁收集、何时停止。",
    availability: "Meta 官方 7 月问答页和合作发布页可访问；Android Central 报道 2026 新款起价 299 美元并已在市场上销售。具体国家、门店、镜片定制、订阅、企业管理、功能 rollout 和不同地区可用的 Meta AI 能力，以账户和市场页面为准；未由当前来源明确的部分写 source not stated。",
    limitsOrUnknowns: "未知项包括真实电池与发热、连续视觉理解的默认开关、音频和影像是否上传、第三方能否审计录制状态、LED 被遮挡后的提示、未联网时能否使用、视障辅助的可靠性、儿童和公共场所规则，以及 Meta 是否会把未来 super-sensing 研究推进到消费产品。持续感知产品的错误恢复和旁观者同意仍没有成熟范式。",
    productVerdict: "Meta AI Glasses 说明 AI 眼镜的核心竞争已从“能不能回答”转到“能否被社会接受地一直在场”。官方把拍摄、音频、视觉理解和日常助手做成完整入口，评测则把隐私灯、配对、功能边界和地区差异拉回现实。Meta 的下一步不能只增加感知能力，还要让佩戴者和旁观者都能读懂相机、麦克风、云端处理与停止机制。"
  },
  en: {
    productName: "Meta AI Glasses 2026",
    productType: "Meta AI Glasses are a consumer AI-eyewear line made with EssilorLuxottica. The product combines a camera, open-ear audio, voice controls, and Meta AI. Meta’s July Q&A describes everyday listening to music and podcasts, hands-free photo and video capture, quick access to an AI assistant, and help with daily life. Review coverage adds hands-on evidence about the 2026 frames and software. The product signal is not simply 'a chatbot inside glasses'; it is a persistent entry point that binds camera, microphones, speakers, phone connectivity, and cloud AI into an always-available wearable system.",
    interactionFlow: "The user pairs the glasses through a phone app, wears them like ordinary frames, and wakes the system with a button or voice. They can capture photos or video, listen to audio, ask Meta AI questions, interpret what is in front of them, handle reminders, or communicate without reaching for a phone. When the camera is active, a front LED provides a recording cue to nearby people. Meta’s official material and review coverage also describe a July software change that permanently disables the camera if tampering with the LED is detected. The wearer experiences continuous presence; bystanders experience a sensor system that needs to be legible and trusted.",
    specsOrStack: "The cited sources support Meta AI Glasses, EssilorLuxottica eyewear hardware, a camera, open-ear audio, voice control, a companion phone app, Meta AI services, and a recording-status LED. Meta describes everyday questions, visual understanding, music and podcasts, hands-free imaging, and life-management assistance. Android Central reports a $299 starting price for the 2026 frames and says lens customization remains connected to EssilorLuxottica’s eyewear system. Battery capacity, chipset, camera resolution, microphone count, complete country list, cloud-processing boundary, retention period, and API access are source not stated.",
    useCases: "The supported jobs include hands-free photos and video, music and podcasts, asking questions while walking, interpreting what the wearer sees, reminders and life management, calls, and quick information while both hands are occupied. For professional users the glasses can serve as a field-recording and voice-query surface; for ordinary buyers they first need to function as comfortable everyday eyewear. The design challenge is double-sided: cameras and microphones must remain useful in real environments without turning bystanders into unconsenting sensor data.",
    painPointsSolved: "Meta attacks screen dependence and hand occupation, giving users a low-friction AI entry point while walking, shopping, doing chores, or working in the field. It also tries to reduce covert-recording anxiety through the LED and anti-tamper behavior. Continuous presence raises the control cost. A wearer may forget that the glasses are still listening, bystanders may not understand an LED, and cloud processing can exceed an intuitive sense of where capture ends. The closer the product looks to ordinary glasses, the clearer its sensor state needs to be.",
    userVoice: "Review evidence describes the 2026 glasses as worth recommending but not suitable for everyone, with the camera, open audio, and AI voice entry preserved. Community posts continue to discuss the recording LED, Wi-Fi and pairing, the Meta-AI-only constraint, returns, and support friction. These are review/community signals, not large-scale retention or privacy studies. Satisfaction, regional feature differences, and real battery performance still require observation.",
    newTech: "The technical increment is the combination of continuous sensing and visible trust cues, not one isolated model benchmark. Meta puts visual Q&A, voice, camera, open audio, phone connectivity, and cloud services inside an everyday frame. Camera disablement after tampering turns privacy guidance into a device state. If future super-sensing versions move toward constant recording or listening, the same design problem becomes larger: the product must show what it is collecting, for whom, and when it stops.",
    availability: "Meta’s official July Q&A and partnership announcement are live. Android Central reports that the 2026 frames start at $299 and are already sold in the market. Exact countries, retailers, prescription options, subscriptions, enterprise management, feature rollout, and region-specific Meta AI capabilities depend on account and market; details not explicitly stated by the current sources remain source not stated.",
    limitsOrUnknowns: "Open questions include real battery and thermal behavior, the default for continuous visual understanding, whether audio and images are uploaded, whether third parties can audit recording state, how LED obstruction is communicated, offline behavior, reliability for accessibility use, rules for children and public spaces, and whether Meta’s super-sensing work will become a consumer product. Continuous-perception error recovery and bystander consent still lack a mature pattern.",
    productVerdict: "Meta AI Glasses show that the core competition in AI eyewear is moving from 'can it answer?' to 'can it stay present in society?' Meta has assembled capture, audio, visual understanding, and everyday assistance into a coherent entry point, while reviews pull privacy LEDs, pairing, feature boundaries, and regional differences back into reality. The next step is not only more perception; it is making camera, microphone, cloud processing, and stop behavior legible to both wearer and bystander."
  }
});

const nvidia = productTopic({
  id: "nvidia-xr-ai-viture-helix",
  section: "global",
  zhHeadline: "NVIDIA XR AI 把眼镜从消费入口推到现场作业指导",
  enHeadline: "NVIDIA XR AI moves glasses from consumer entry point to field guidance",
  sourceDate: "2026-06-16 developer release · 2026-06 Helix product reveal",
  evidenceLabel: "developer surface",
  evidenceStrength: "developer surface · confirmed partner product",
  visual: nvidiaVisual,
  sources: [
    source("NVIDIA Developer: XR AI Platform", "https://developer.nvidia.com/xr/xr-ai"),
    source("NVIDIA Blog: XR AI brings agents to AR glasses", "https://blogs.nvidia.com/blog/nvidia-xr-ai/"),
    source("VITURE: Helix with NVIDIA XR AI", "https://www.viture.com/en-US/blog/viture-unveils-helix-the-first-ai-safety-glasses-built-on-nvidia-s-xr-ai-solution-at-awe-2026"),
    source("VITURE Helix product page", "https://www.viture.com/en-US/helix")
  ],
  hciZh: ["现场视觉上下文", "免手指导", "专业安全边界"],
  hciEn: ["situated visual context", "hands-free guidance", "professional safety boundary"],
  zh: {
    productName: "NVIDIA XR AI / VITURE Helix",
    productType: "NVIDIA XR AI 是面向开发者的库与平台，用于把实时视觉、语音交互和 agent guidance 连接到 AR 眼镜；VITURE Helix 是采用该方案的 AI safety glasses 产品。NVIDIA 的示例包括工程师通过眼镜询问可编程逻辑控制器问题、连接数字孪生和自动化工作流；开发者页还展示实验室和基因编辑场景。它与消费级眼镜的差异在于，价值不只在拍照或问答，而在工作现场把下一步操作、标准作业程序和设备状态带到视线与语音里。",
    interactionFlow: "佩戴者在现场戴上兼容眼镜，眼镜或配套计算设备获取第一视角画面和语音问题。XR AI 组件帮助 agent 识别眼前设备、工作步骤或实验上下文，系统通过语音或眼前显示给出解释、提醒、下一步指导或远程协作信号。VITURE Helix 被定位为 eyes-on、hands-free 的 AI co-pilot；LabOS 等示例则把现场感知接到数字孪生、自动化或实验流程。真正执行高风险动作时，用户仍需遵循专业 SOP，不能把演示中的 guidance 当成自动控制授权。",
    specsOrStack: "来源明确的是 NVIDIA XR AI developer library、LabOS、与 Meta/Rokid/VITURE 等眼镜的兼容性，以及 VITURE Helix 采用 NVIDIA XR AI 解决方案的合作关系。开发者页强调实时、免手的 AI guidance，案例覆盖工业 PLC、实验室和基因编辑等场景；VITURE 负责智能硬件与 edge software。来源没有披露 Helix 的芯片、摄像头参数、显示规格、重量、电池、网络协议、模型名称、端云分工、具体 SDK 版本、上市价格或购买地区，均为 source not stated。",
    useCases: "使用场景包括维修人员查看设备时获取 SOP 提示、工程师排查 PLC 或自动化系统、实验人员在操作台上读取上下文、培训人员远程指导新手、质量巡检和需要双手保持工作的现场协作。对企业来说，眼镜不必替代电脑，而是把计算机视觉、知识库、数字孪生和 agent 的下一步建议放到实际工作发生的地方。价值判断应看它是否减少查手册、离开工位和反复确认的时间，同时不引入更大的安全风险。",
    painPointsSolved: "它解决的是“知道答案但手上不能离开工作”的摩擦。传统现场人员要停下动作、拿手机或平板、搜索文档、确认型号，再把注意力切回设备；XR AI 试图把这一回路压缩成看、问、听、做。代价是错误指导的安全后果更高，且视觉 agent 必须理解遮挡、光线、设备差异和当前步骤。专业场景不能只展示流畅 demo，还要提供引用、置信度、人工接管和停止机制。",
    userVoice: "当前证据主要是 NVIDIA、VITURE 官方产品页和开发者示例，以及现场演示语境；没有足够独立长期用户评测证明它在真实工厂或实验室的节拍、误报和维护成本。VITURE 社区讨论已出现对 Android 支持、产品定位和是否真的能提供实时 SOP 的疑问，这些属于 early friction signal，source not stated。",
    newTech: "新技术点是把 XR 设备当作 agent 的第一视角传感器与反馈终端，而不是只做远程显示器。NVIDIA 提供 XR AI library，LabOS 将视觉输入、领域工具和 agent orchestration 连接起来，VITURE 把它落到 safety glasses 形态。这个栈把 HCI 重点从“界面怎么摆”推进到“现场上下文如何进入模型、模型如何给出可执行但可审计的下一步”。",
    availability: "NVIDIA XR AI developer page 与博客已公开；VITURE Helix 的产品页和发布文章可访问，且明确为 AWE 2026 的合作产品。兼容眼镜、开发者申请、购买渠道、客户行业、交付时间、服务价格和地区供应情况，当前来源没有完整披露，写 source not stated。",
    limitsOrUnknowns: "关键未知包括现场网络、端侧延迟、遮挡和光照鲁棒性、不同工厂设备的知识接入、模型幻觉、合规记录、操作员隐私、多人协作、佩戴疲劳以及发生错误时谁负责。安全眼镜如果只给建议，仍需把“建议”和“允许执行”分开；如果未来接入自动化控制，权限和双人确认会成为硬要求。",
    productVerdict: "NVIDIA XR AI / Helix 是今天最值得关注的现场型 agent 信号：它把眼镜从消费电子的轻量入口变成专业工作系统的一部分。产品机会成立的前提不是 demo 看起来像未来，而是系统能在现场给出有来源、可暂停、可交接的下一步指导。对 HCI 团队而言，显示面积只是表层，真正困难的是上下文、责任、置信度和人工接管。"
  },
  en: {
    productName: "NVIDIA XR AI / VITURE Helix",
    productType: "NVIDIA XR AI is a developer library and platform for connecting real-time vision, voice interaction, and agent guidance to AR glasses. VITURE Helix is an AI safety-glasses product built with that solution. NVIDIA’s examples include an engineer asking an agent about a programmable-logic-controller issue through glasses while connecting industrial systems, digital twins, and automation workflows. The developer page also shows laboratory and gene-editing scenarios. Unlike a consumer glasses pitch, the value is not only capture or Q&A; it is putting the next step, procedure, and equipment context into the worker’s view and voice loop.",
    interactionFlow: "A worker wears compatible glasses in the field. The glasses or companion compute captures first-person visual context and the user’s spoken question. XR AI components help an agent interpret equipment, work steps, or experiment context, then return an explanation, reminder, next-step instruction, or remote-collaboration signal through audio or an in-view display. VITURE positions Helix as an eyes-on, hands-free AI co-pilot; LabOS examples connect perception to digital twins, automation, or experiment workflows. A high-risk action still requires professional SOP and human authorization; a guidance demo is not automatic control permission.",
    specsOrStack: "The cited sources support the NVIDIA XR AI developer library, LabOS, compatibility with Meta, Rokid, and VITURE glasses, and VITURE Helix’s partnership with NVIDIA XR AI. The developer page emphasizes real-time, hands-free guidance and examples involving industrial PLCs, laboratories, and gene editing. VITURE supplies the smart hardware and edge software. The sources do not specify Helix’s chip, camera parameters, display specifications, weight, battery, network protocol, model name, edge/cloud split, SDK version, price, or purchase regions; those details are source not stated.",
    useCases: "Concrete jobs include maintenance workers receiving procedure prompts while looking at equipment, engineers diagnosing PLC or automation systems, lab staff retrieving context at the bench, trainers guiding a new operator remotely, quality inspection, and any field task where both hands need to stay on the work. For enterprises, glasses do not need to replace a computer. They can place computer vision, a knowledge base, digital twins, and agent recommendations where the work actually occurs. The product should be judged by time saved on manuals, workstation switching, and repeated confirmation without creating a larger safety risk.",
    painPointsSolved: "The product attacks the friction of knowing what to do while being unable to leave the task. A field worker traditionally stops, picks up a phone or tablet, searches documentation, confirms the model, and returns attention to the machine. XR AI attempts to compress that loop into look, ask, hear, and act. The cost is higher consequence for wrong guidance. The visual agent must handle occlusion, lighting, equipment variation, and step state. A professional product needs citations, confidence, human takeover, and stop controls rather than only a smooth demo.",
    userVoice: "Current evidence is NVIDIA and VITURE product material plus demonstration context, not enough independent long-term evidence from factories or labs. Early VITURE community discussion raises questions about Android support, product positioning, and whether real-time SOP guidance works outside the demo. Those are early friction signals, not validated performance data; source not stated.",
    newTech: "The new technology pattern treats XR hardware as an agent’s first-person sensor and feedback endpoint, not merely as a remote display. NVIDIA provides an XR AI library; LabOS connects visual input, domain tools, and agent orchestration; VITURE brings the pattern into safety-glasses hardware. The HCI challenge moves from 'where should the UI sit?' to 'how does field context enter the model, and how does the model produce an executable but auditable next step?'",
    availability: "The NVIDIA XR AI developer page and blog are public. VITURE’s Helix product page and launch article are live and identify the product as an AWE 2026 collaboration. Compatible glasses, developer access, purchase channels, customer industries, delivery timing, service pricing, and regional supply are not fully disclosed by the current sources; source not stated.",
    limitsOrUnknowns: "Open questions include field connectivity, edge latency, occlusion and lighting robustness, knowledge integration for different factories, hallucination, compliance logging, operator privacy, multi-user coordination, wear fatigue, and responsibility after an error. If safety glasses provide advice, the product must separate advice from permission to execute. If they later control automation, permissions and two-person confirmation become hard requirements.",
    productVerdict: "NVIDIA XR AI and Helix are the strongest field-agent signal in this issue because they move glasses from a lightweight consumer entry point into a professional work system. The opportunity is real only if the system produces sourced, pausable, handoff-ready next steps in the field. For HCI teams, display area is the surface problem; context, responsibility, confidence, and human takeover are the system problem."
  }
});

const communityScan = scanTopic({
  id: "community-ai-glasses-friction-scan",
  section: "community",
  zhHeadline: "社区摩擦扫描：AI 眼镜的配对、网络与唯一助手限制仍在前台",
  enHeadline: "Community scan: pairing, connectivity, and assistant lock-in remain front-stage friction",
  sourceDate: "2026-06-20 to 2026-07-10 community signals",
  evidenceLabel: "review/community friction",
  evidenceStrength: "community signal · not independent benchmark",
  visual: metaVisual,
  sources: [
    source("Reddit: Meta glasses customer support friction", "https://www.reddit.com/r/MetaGlasses/comments/1ua72yc/my_experience_with_rayban_meta/"),
    source("Reddit: Meta glasses privacy and setup friction", "https://www.reddit.com/r/HearingAids/comments/1tykkjo/beware_meta_ai_glasses/"),
    source("Android Central Meta glasses hands-on", "https://www.androidcentral.com/wearables/meta-glasses-hands-on-review")
  ],
  zh: {
    productName: "AI glasses community friction scan",
    productType: "这是对 Reddit 公开讨论、媒体 hands-on 和支持摩擦的 source-lane scan，不代表一款新产品，也不把个别帖子当作总体用户结论。今天扫描到的具体问题集中在配对、门店网络、售后/退货、相机隐私灯、地区功能差异，以及眼镜是否只能锁定一个 AI 助手。",
    interactionFlow: "用户购买眼镜后需要连接手机、登录账户、完成蓝牙/Wi-Fi 或 App 设置，再在真实场景里调用语音、相机和 AI。如果门店不能提供可用网络、设备无法完成初始化，或用户期待的第三方助手不可用，产品价值会在第一次佩戴前就被削弱。社区讨论描述的是体验断点，尚不足以证明某个问题的发生率。",
    specsOrStack: "扫描材料没有可靠地给出新的硬件规格、API 版本、芯片或电池数据；可确认的堆栈仍是相机眼镜、手机 App、无线连接、账户服务和云端 AI。所有具体故障比例、地区分布、售后 SLA 和数据保存规则均为 source not stated。",
    useCases: "该扫描只服务一个具体任务：判断 AI 眼镜是否能从购买、配对、第一次问答一路进入日常使用。下一轮应继续看离线行为、配对失败恢复、家庭成员共享、企业账户、第三方助手选择和 LED 被遮挡时的提示。",
    painPointsSolved: "社区摩擦说明，产品团队解决的不能只是一条功能路线图，还包括网络不可用时如何初始化、用户想退货时如何处理、助手受限时如何解释、以及旁观者如何理解相机状态。缺少这些反馈路径，硬件能力越多，首次失败越难恢复。",
    newTech: "本条没有确认新技术；它的价值在于把配对、连接和控制权视为 agent wearable 的系统级交互，而不是售后细节。",
    availability: "社区页面和媒体评测可访问；它们是公开摩擦信号，不构成产品可用性或性能保证。",
    limitsOrUnknowns: "缺少样本量、用户画像、复现步骤、版本号和独立统计，不能把个别帖子升级为普遍结论。",
    productVerdict: "今天没有从社区 lane 晋级新的确认产品；保留这张 scan，是因为 AI 眼镜最容易失去用户的地方仍是首次设置、连接和信任解释。下一步要找带版本、步骤和结果的可复现报告。"
  },
  en: {
    productName: "AI-glasses community friction scan",
    productType: "This is a source-lane scan of public Reddit discussion, hands-on coverage, and support friction. It is not a new product, and individual posts are not treated as a population-level conclusion. The concrete issues visible today are pairing, store connectivity, returns and support, camera privacy cues, regional feature differences, and whether a user is locked to one assistant.",
    interactionFlow: "After buying glasses, a user must connect a phone, sign into an account, complete Bluetooth or Wi-Fi and app setup, and then invoke voice, camera, or AI features in a real environment. If a store cannot provide usable connectivity, initialization fails, or the expected third-party assistant is unavailable, the product loses value before the first useful interaction. The community posts describe breakpoints, not prevalence.",
    specsOrStack: "The scan does not provide reliable new hardware specifications, API versions, chips, or battery data. The confirmed stack remains camera eyewear, a companion phone app, wireless connectivity, account services, and cloud AI. Failure rates, regional distribution, support SLAs, and retention rules are source not stated.",
    useCases: "The scan serves one concrete job: checking whether AI glasses can move from purchase and pairing to the first useful question and then into daily use. The next pass should track offline behavior, pairing recovery, household sharing, enterprise accounts, third-party assistant choice, and what happens when the recording LED is obstructed.",
    painPointsSolved: "The friction says product teams cannot ship only a feature roadmap. They also need initialization without store connectivity, a clear return path, an explanation when assistant choice is limited, and a bystander-readable camera state. Without those recovery paths, more hardware capability can make a first failure harder to recover from.",
    newTech: "This scan confirms no new technology. Its product value is treating pairing, connectivity, and control as system-level interactions for agent wearables rather than support afterthoughts.",
    availability: "The community pages and review coverage are accessible. They are public friction signals, not guarantees of product availability or performance.",
    limitsOrUnknowns: "There is no sample size, user profile, reproducible step sequence, version number, or independent statistic. Individual posts must not be upgraded into a universal conclusion.",
    productVerdict: "No new confirmed product is promoted from the community lane today. The scan stays because first setup, connectivity, and trust explanation remain where AI glasses can lose users fastest. The next pass needs reports with versions, steps, and reproducible outcomes."
  }
});

const carry = (id, section = null) => {
  const topic = clone(old[id]);
  if (!topic) throw new Error(`Missing previous topic ${id}`);
  if (section) topic.section = section;
  topic.sourceDate = `${topic.sourceDate} · 2026-07-11 follow-up`;
  return topic;
};

const topics = [
  gemini,
  carry("openai-gpt-live-voice-interface"),
  carry("cloudflare-agent-crawler-controls"),
  meta,
  carry("memomind-one-review-friction"),
  communityScan,
  carry("acti-agentic-keyboard", "wild"),
  nvidia,
  carry("zai-zcode-china-global", "china"),
  carry("china-ai-glasses-os-scan", "china"),
  carry("wearable-agent-research-patent-watch-scan", "research"),
  carry("patent-lane-glasses-ip-scan", "patent")
];

const issue = {
  date,
  timezone: "America/Toronto",
  zhTitle: "AI Daily 2026-07-11：Agent 开始占据你的工作现场",
  enTitle: "AI Daily 2026-07-11: Agents Move Into the Worksite",
  zhSummary: "Gemini Spark 把 Mac 变成可远程委派的执行现场；Meta、NVIDIA、VITURE、MemoMind 与 Solos 把眼镜的持续感知、隐私和专业指导放到同一条产品链上，Cloudflare、Acti、ZCode 与研究/专利 lane 补齐 agent 从本地电脑、键盘、Web 到现场设备的入口迁移。",
  enSummary: "Gemini Spark turns the Mac into a remotely delegated execution site; Meta, NVIDIA, VITURE, MemoMind, and Solos place continuous perception, privacy, and field guidance on one product chain, while Cloudflare, Acti, ZCode, and research/patent lanes map agent entry points from local computers and keyboards to the open web and physical worksite.",
  tags: ["Gemini Spark", "AI glasses", "NVIDIA XR AI", "agent worksite", "privacy UX", "local computer", "agent access", "HCI"],
  sourceTypes: ["official", "reviews", "community", "wild", "research", "patent", "china", "global"],
  zhPath: `./${date}/zh/`,
  enPath: `./${date}/en/`,
  sourcesPath: `./${date}/sources.md`,
  coverStory: {
    topicId: gemini.id,
    zhTitle: "个人电脑正在变成 agent 的执行现场",
    enTitle: "The personal computer is becoming an agent execution site",
    imagePath: gemini.visual.path,
    imageWidth: gemini.visual.width,
    imageHeight: gemini.visual.height,
    primarySourceUrl: gemini.visual.sourceUrl,
    imageSourceUrl: gemini.visual.sourceUrl,
    evidenceStrength: "confirmed product · Gemini Spark Mac · local-file automation",
    whyCover: "Gemini Spark connects remote delegation with local Mac context; the other lanes show the same agent shift spreading into glasses, field work, keyboards, and web permissions.",
    zhSummary: [
      "Gemini Spark 把手机或 Web 变成委派入口，把 Mac 文件和应用变成 agent 真正工作的地方。",
      "AI 产品的关键问题从“会不会回答”变成“谁能访问什么、正在做什么、如何停止”。",
      "眼镜、现场指导、键盘、Web crawler、研究和专利 lane 共同显示 agent 正在从聊天框迁移到环境。"
    ],
    enSummary: [
      "Gemini Spark makes phone or web a delegation surface and the Mac the place where the agent actually works.",
      "The product question shifts from whether an AI can answer to who it can access, what it is doing, and how it stops.",
      "Glasses, field guidance, keyboards, web crawlers, research, and patent lanes show agents moving from chat into environments."
    ]
  },
  designDesk: {
    zhTitle: "Design Desk：Agent 进入环境后，控制权就是界面",
    enTitle: "Design Desk: Once agents enter environments, control becomes the interface",
    zhIntro: "今天的设计问题不在于再加一个 AI 入口，而在于 agent 一旦拿到本地文件、相机、麦克风、键盘或现场设备，用户如何持续看见边界、证据、进度和停止方式。",
    enIntro: "Today’s design problem is not adding another AI entry point. Once an agent can reach local files, cameras, microphones, keyboards, or field equipment, users need continuous visibility into boundaries, evidence, progress, and stop controls.",
    zhItems: [
      { label: "委派入口必须显示执行现场", body: "Gemini Spark 把手机委派和 Mac 执行分开；用户需要知道任务在哪台机器上运行、访问了哪个文件、是否仍在后台继续。" },
      { label: "传感器状态要同时对佩戴者和旁观者可读", body: "Meta、Solos 和 MemoMind 的差异说明，AI 眼镜的相机、麦克风、显示和隐私边界不能只藏在 App 设置里。" },
      { label: "现场指导要把建议和授权分开", body: "NVIDIA XR AI / Helix 可以给下一步提示，但专业场景必须区分“建议做什么”和“系统允许你执行什么”，并保留人工接管。" },
      { label: "低摩擦入口需要短确认与可撤销", body: "Acti 把 action 放进键盘；Cloudflare 把访问目的拆成 Search、Agent、Training。两者都要求产品把权限、失败原因和撤销路径讲清楚。" },
      { label: "社区摩擦是主流程的一部分", body: "配对、网络、助手锁定和退货不是售后尾巴；它们决定用户能否完成第一次有价值的交互。" },
      { label: "研究和专利只能提出下一轮假设", body: "VisionClaw 与专利 lane 可以提示持续感知、context preview、audit trail 和旁观者同意，但不能替代可用产品证据。" }
    ],
    enItems: [
      { label: "Delegation must show the execution site", body: "Gemini Spark separates phone delegation from Mac execution. Users need to know which computer is acting, which file was accessed, and whether work is still running." },
      { label: "Sensor state must be legible to wearer and bystander", body: "Meta, Solos, and MemoMind show that camera, microphone, display, and privacy boundaries cannot live only inside app settings." },
      { label: "Field guidance must separate advice from authorization", body: "NVIDIA XR AI and Helix can suggest the next step, but professional systems must distinguish what the agent recommends from what the worker is allowed to execute." },
      { label: "Low-friction entry needs short confirmation and undo", body: "Acti places actions inside the keyboard; Cloudflare separates Search, Agent, and Training access. Both require clear permissions, failure reasons, and recovery." },
      { label: "Community friction is part of the main flow", body: "Pairing, connectivity, assistant lock-in, and returns are not support tail work. They determine whether a user reaches a first valuable interaction." },
      { label: "Research and patents create the next hypothesis", body: "VisionClaw and patent signals suggest continuous perception, context preview, audit trails, and bystander consent, but cannot replace usable product evidence." }
    ]
  },
  watchlistZh: [
    "Gemini Spark：远程访问本地 Mac 文件的完整 rollout、权限最小化与失败恢复。",
    "Meta super-sensing：持续拍摄/聆听是否会进入消费产品，以及 LED 防篡改是否形成可验证的社会信号。",
    "VITURE Helix / NVIDIA XR AI：真实工业部署、端侧延迟、SOP 引用与人工接管。",
    "中国 AI 眼镜：7 月升级、鸿蒙/夸克/小米生态的可购买体验与地区差异。",
    "VisionClaw 与专利：持续感知、旁观者同意和 wearable agent 审计链仍保持 research/patent signal 降级。"
  ],
  watchlistEn: [
    "Gemini Spark: full remote-to-local Mac rollout, least-privilege access, and failure recovery.",
    "Meta super-sensing: whether continuous capture enters a consumer product, and whether anti-tamper LEDs become a verifiable social cue.",
    "VITURE Helix / NVIDIA XR AI: real industrial deployments, edge latency, SOP citations, and human takeover.",
    "China AI glasses: July upgrades, purchasable HarmonyOS/Quark/Xiaomi ecosystem behavior, and regional differences.",
    "VisionClaw and patents: continuous perception, bystander consent, and wearable-agent audit trails remain research/patent signals."
  ],
  topics
};

const nextIssues = [issue, ...issues.filter((item) => item.date !== date)];
await fs.writeFile(issuesPath, `${JSON.stringify(nextIssues, null, 2)}\n`);
console.log(`Created ${date}: ${topics.length} topics, ${new Set(topics.flatMap((topic) => topic.sources.map((item) => item.url))).size} unique sources.`);
