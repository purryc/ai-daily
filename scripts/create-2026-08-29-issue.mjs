import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const dataPath = path.join(root, "data", "issues.json");
const date = "2026-08-29";
const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = issues.find((entry) => entry.date === "2026-08-28");
if (!previous) throw new Error("Missing 2026-08-28 source issue");

const assetsDir = path.join(root, date, "assets");
await fs.mkdir(assetsDir, { recursive: true });
await fs.cp(path.join(root, "2026-08-28", "assets"), assetsDir, { recursive: true, force: true });

const screenshotJobs = [
  {
    url: "https://www.meta.com/ca/ai-glasses/camera-capture-photo-video/",
    file: "meta-ai-glasses-capture-led-2026-08.png"
  },
  {
    url: "https://www.quera.com/press-releases/quera-computing-uses-ai-to-automate-a-critical-quantum-computer-subsystem-enabling-the-acceleration-of-commercial-grade-quantum-computing-deployments-from-quera",
    file: "quera-mhs-laser-control-2026-08.png"
  },
  {
    url: "https://www.prnewswire.com/news-releases/pinea-pi-opens-pre-orders-defining-the-edge-ai-device-for-the-ai-native-generation-302860665.html",
    file: "pinea-pi-edge-ai-node-2026-08.png"
  },
  {
    url: "https://www.anthropic.com/news/model-hardware-standard-research-preview",
    file: "anthropic-model-hardware-standard-2026-08.png"
  },
  {
    url: "https://www.realwear.com/press-releases/ari-os",
    file: "realwear-ari-os-official-2026-08.png"
  },
  {
    url: "https://techcrunch.com/2026/08/26/hearing-tech-startup-legato-emerges-from-stealth-with-12m-and-a-peek-at-its-ai-hearing-glasses/",
    file: "legato-frames-techcrunch-2026-08.png"
  }
];

const browser = await chromium.launch({ headless: true });
try {
  for (const job of screenshotJobs) {
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
    await page.goto(job.url, { waitUntil: "domcontentloaded", timeout: 45_000 });
    await page.waitForTimeout(2_000);
    await page.screenshot({ path: path.join(assetsDir, job.file), fullPage: false });
    await page.close();
  }
} finally {
  await browser.close();
}

const mhs = {
  id: "anthropic-model-hardware-standard",
  section: "research",
  dossierKind: "product",
  evidenceLabel: "research signal",
  evidenceStrength: "Anthropic research preview with early lab/manufacturing partners; open-source release and broad deployment remain unverified",
  zhHeadline: "Anthropic MHS：让 agent 先学会读懂一台机器",
  enHeadline: "Anthropic’s MHS gives agents a hardware grammar before they touch a machine",
  zhFact: "Anthropic 于 2026 年 8 月 27 日发布 Model Hardware Standard 研究预览，与 HHMI Janelia Research Campus 合作，面向科学、机器人、电子与制造伙伴。MHS 用标准化 driver 把操作系统与设备连接起来，用 read/write 原语、可发现设备描述、自然语言标签和 reference file 告诉 agent 一台机器能测什么、能调什么、有哪些安全边界；控制面同时支持 MCP、命令行和代码文件。",
  enFact: "Anthropic published a research preview of the Model Hardware Standard on August 27, 2026, developed with HHMI Janelia Research Campus for partners in science, robotics, electronics, and manufacturing. MHS uses a standardized driver between an operating system and a device, read/write primitives, discoverable device descriptions, natural-language tags, and a generated reference file to tell an agent what a machine can measure, adjust, and safely allow. The control surface supports MCP, a command-line interface, and code files.",
  zhValue: "MHS 把物理 AI 的关键前置工作显性化：agent 不能只拿到一个模糊的工具名，还需要知道设备的重量、测量范围、可调整参数和不能越过的限制。Anthropic 描述的试验包括让 Claude 调整激光、通过相机观察光束变化、继续迭代，再把学到的过程写成确定性脚本。对产品团队而言，这个标准把“接入硬件”从一次性定制集成变成可描述、可发现、可审计的设备层；对操作者而言，风险点也从“模型会不会说错”扩展到“驱动是否准确描述机器”。",
  enValue: "MHS makes the hidden prerequisite of physical AI explicit: an agent should not receive only a vague tool name. It needs to know a device’s weight, measurement range, adjustable parameters, and hard safety limits. Anthropic describes Claude adjusting a laser, observing the beam through a camera, iterating, and then packaging what it learned into a deterministic script. For product teams, the standard turns hardware integration from a one-off custom project into a describable, discoverable, auditable device layer. For operators, the risk question expands from whether the model says the wrong thing to whether the driver describes the machine correctly.",
  zhHciLens: ["输入：设备接口、机器特性、自然语言标签与安全限制", "计算：driver、MCP、CLI、代码文件与 agent orchestration", "反馈：传感器结果、相机观察、可回放脚本与拒绝动作"],
  enHciLens: ["Input: device interfaces, machine characteristics, natural-language tags, and safety limits", "Compute: drivers, MCP, CLI, code files, and agent orchestration", "Feedback: sensor results, camera observations, replayable scripts, and refused actions"],
  zhImplication: "如果 agent 要操作实验室或工厂设备，界面必须同时展示设备身份、能力描述、当前状态、动作前置条件、已授权范围和实际反馈。一个自然语言标签不能替代硬性互锁；一个成功的脚本也不能自动获得下一次高风险动作的授权。产品应把“agent 计划”“设备执行”“安全门控”“人类批准”分成可见阶段。",
  enImplication: "If an agent is going to operate laboratory or factory equipment, the interface must expose device identity, capability descriptions, current state, action preconditions, authorization scope, and observed feedback together. A natural-language tag cannot replace a hard interlock, and a successful script should not automatically authorize the next high-risk action. The product should make agent plan, device execution, safety gating, and human approval visible as separate stages.",
  sourceDate: "2026-08-27 official research preview; 2026-08-28 current source sweep",
  visual: {
    path: "assets/anthropic-model-hardware-standard-2026-08.png",
    width: 1600,
    height: 900,
    kind: "source-backed official page screenshot",
    altZh: "Anthropic Model Hardware Standard 研究预览官方页面截图",
    altEn: "Anthropic Model Hardware Standard research preview official page",
    captionZh: "来源追踪视觉：Anthropic 官方研究预览页面；MHS 仍是早期伙伴预览，不代表开放标准或广泛商用部署。",
    captionEn: "Source-traceable visual: Anthropic’s official research-preview page; MHS is still an early partner preview, not proof of an open standard or broad commercial deployment.",
    sourceUrl: "https://www.anthropic.com/news/model-hardware-standard-research-preview"
  },
  sources: [
    { label: "Anthropic · Model Hardware Standard research preview", url: "https://www.anthropic.com/news/model-hardware-standard-research-preview", type: "research signal" },
    { label: "Anthropic · Model Context Protocol", url: "https://modelcontextprotocol.io/", type: "developer surface" },
    { label: "HHMI Janelia Research Campus", url: "https://www.janelia.org/", type: "research" }
  ],
  dossier: {
    zh: {
      productName: "Anthropic Model Hardware Standard（MHS）",
      productType: "MHS 是面向 AI agent 操作物理设备的早期标准与 driver 方案，服务科学实验室、机器人、电子与制造场景。它不是面向消费者销售的硬件，也不是已经开放注册的通用产品；当前证据是 Anthropic 与 HHMI Janelia 合作、向第一批研究机构和先进制造商开放的 research preview。",
      interactionFlow: "设备先通过标准化 driver 暴露接口，再以 discoverable format 描述自己能测量什么、能调整什么、有哪些安全限制。操作者可以手写自然语言标签，也可以让 agent 访谈硬件配置；driver 据此生成 reference file。agent 随后通过 MCP、命令行或代码文件发出 read/write 命令，接收传感器或相机反馈，按条件调整参数，并把稳定流程封装为可重复的确定性脚本。多设备任务由 agent 在高层编排，具体动作仍需要设备能力检查和安全门控。",
      specsOrStack: "Anthropic 公开的栈包括标准化 driver、read/write 原语、设备可发现描述、自然语言 tags、reference file、MCP、command-line interface、code files/API，以及可跨网络编排的 agent harness。官方示例覆盖显微镜、液体处理器、机械臂和激光校准。MHS 可以与任何有 programmable interface 的设备协作，并宣称 model-agnostic；具体协议 schema、认证、权限模型、错误码、实时性、硬件清单、SDK 版本和数据驻留均为 source not stated。",
      useCases: "具体场景包括让 agent 读取实验设备温度并调整设定值；在药物发现流程中串联显微镜、液体处理器和其他仪器；通过相机观察激光光束，迭代校准量，再将成功过程转成一条命令；让机器人根据重量、可达范围和安全限制选择动作；以及让制造工程师把设备间的碎片化接口接成一条可监控的实验或生产流程。它适合多设备、长时间、需要实时参数调整的工作。",
      painPointsSolved: "MHS 针对的是硬件集成周期长、每台设备都有私有接口、说明知识藏在纸质手册或专家脑中、设备接入后仍缺少统一 agent 控制方式等问题。标准化描述可以减少为每台机器手写 translator 的重复工作；reference file 让设备特性更容易被 agent 检索；代码文件让高频、已验证的步骤脱离逐步推理。它仍没有解决传感器校准、坏设备、未知环境、物理安全责任、供应商协议变化和实验结果是否科学有效。",
      newTech: "新的组合在于把机器的“可做什么”和“不能做什么”作为 agent 可读的设备知识层，并把自然语言标注、标准 driver、MCP/CLI/API 控制和确定性脚本串起来。Anthropic 描述的激光例子显示，agent 可以先探索、观察结果、调整，再把经验沉淀为不必每一步重新推理的代码。MHS 因而把物理 AI 从单个 demo 的工具调用推进到可发现设备、跨设备编排和受约束执行的基础设施方向。",
      availability: "Anthropic 于 2026 年 8 月 27 日发布 research preview，向第一批科学研究实验室和先进制造商开放，并计划在协作后开源标准。当前公开材料没有给出公众注册入口、商业价格、正式版本、认证机构、可直接下载的完整规范或普遍可用的产品 SLA；因此应标记为 research signal，不应写成已完成的行业标准。",
      limitsOrUnknowns: "最大未知是标准落地的边界：driver 如何证明设备描述真实，标签错误时谁承担责任，read/write 是否有强制权限和速率限制，MCP 之外的兼容性如何处理，设备故障和网络中断如何回退，长时间实验如何保留审计轨迹，以及多个 agent 是否能安全共享同一设备。官方示例是早期预览，尚无独立评测证明它在真实生产环境中的可靠性、成本或安全事件率。",
      productVerdict: "MHS 是今天最值得降级阅读的 research signal：它把 agent 操作物理设备所缺失的设备语义层讲清楚，也给出了从探索到确定性脚本的具体路径。产品判断：对机器人、实验室和制造软件架构有启发，短期不能当作可采购平台、开放标准或安全认证。下一步应看公开 schema、驱动生态、失败/拒绝日志、权限模型、独立实验和开源时间表。"
    },
    en: {
      productName: "Anthropic Model Hardware Standard (MHS)",
      productType: "MHS is an early standard and driver approach for letting AI agents operate physical equipment in scientific, robotic, electronics, and manufacturing settings. It is not consumer hardware and is not yet an open, generally available product. The evidence is Anthropic’s research preview, developed with HHMI Janelia and offered to an initial group of research labs and advanced manufacturers.",
      interactionFlow: "A device first exposes its interface through a standardized driver and describes what it can measure, what it can adjust, and which safety limits apply in a discoverable format. An operator can write natural-language tags or ask an agent to interview them about the setup; the driver then generates a reference file. The agent uses MCP, a command-line interface, or code files to issue read/write commands, receive sensor or camera feedback, adjust parameters conditionally, and package a stable procedure as a deterministic script. The agent can orchestrate a multi-device task at a high level, while each action still needs capability checks and safety gating.",
      specsOrStack: "Anthropic discloses a stack of standardized drivers, read/write primitives, discoverable device descriptions, natural-language tags, generated reference files, MCP, a command-line interface, code files/APIs, and an agent harness that can orchestrate devices across networks. The examples include microscopes, liquid handlers, robotic arms, and laser calibration. MHS is described as working with any device that has a programmable interface and as model-agnostic. The protocol schema, authentication, permissions, error codes, real-time behavior, hardware inventory, SDK versions, and data residency are source not stated.",
      useCases: "Concrete uses include asking an agent to read a temperature from laboratory equipment and adjust a set point; sequencing microscopes, liquid handlers, and other instruments in a drug-discovery workflow; watching a laser beam through a camera, iterating on an alignment value, and turning the successful process into one command; allowing a robot to choose an action based on weight, reach, and safety limits; and connecting fragmented equipment interfaces into a monitored experiment or production workflow. The pattern fits multi-device, long-running tasks that need parameter changes as conditions evolve.",
      painPointsSolved: "MHS targets long hardware-integration cycles, private interfaces for every device, operational knowledge trapped in paper manuals or expert memory, and the absence of a common control surface once equipment is connected to an agent. Standardized descriptions can reduce bespoke translator work; a reference file makes device characteristics easier for an agent to retrieve; and code files let frequent, verified procedures run without step-by-step reasoning every time. It does not solve sensor calibration, broken equipment, unknown environments, physical safety accountability, changing vendor protocols, or whether an experiment’s result is scientifically valid.",
      newTech: "The new combination treats what a machine can and cannot do as an agent-readable device knowledge layer, then connects natural-language annotation, standardized drivers, MCP/CLI/API control, and deterministic scripts. In Anthropic’s laser example, the agent explores, observes the result, adjusts, and then turns the learned procedure into code that no longer needs fresh reasoning at every step. MHS therefore pushes physical AI beyond a single demo tool call toward discoverable devices, cross-device orchestration, and constrained execution infrastructure.",
      availability: "Anthropic published MHS as a research preview on August 27, 2026, for an initial group of scientific research labs and advanced manufacturers, with an intention to open-source the standard after collaboration. The public material does not provide a public signup, commercial pricing, formal version, certification body, downloadable complete specification, or general product SLA. It should remain a research signal, not be described as a finished industry standard.",
      limitsOrUnknowns: "The largest unknown is how the standard becomes trustworthy in deployment: how a driver proves that its device description is accurate, who is responsible when a tag is wrong, whether read/write operations have mandatory permission and rate controls, how non-MCP compatibility works, how device faults and network interruptions recover, how long experiments retain an audit trail, and whether multiple agents can safely share one instrument. The examples are an early preview; independent evidence has not established production reliability, cost, or safety-incident rates.",
      productVerdict: "MHS is the day’s most useful research signal to read with an explicit downgrade. It names the missing device-semantics layer for physical agents and shows a concrete path from exploration to deterministic scripts. Verdict: it is architecturally relevant to robotics, lab, and manufacturing software, but not yet a purchasable platform, open standard, or safety certification. Watch the public schema, driver ecosystem, failure and refusal logs, permission model, independent trials, and open-source timeline."
    }
  }
};

const ari = {
  id: "realwear-ari-os",
  section: "official",
  dossierKind: "product",
  evidenceLabel: "confirmed product",
  evidenceStrength: "RealWear product announcement says Ari OS is available today on Navigator Z1; broader device support, pricing, and deployment terms remain undisclosed",
  zhHeadline: "RealWear Ari OS：把现场工作的下一步放进视野",
  enHeadline: "RealWear Ari OS turns frontline work into a voice-first, cross-device session",
  zhFact: "RealWear 于 2026 年 8 月 25 日发布 Ari OS，定位为面向真实工作环境的 voice-first operating system。官方描述它把语音、视觉上下文和 connected intelligence 组合起来，让技术员、工程师和现场工人在不低头、不切换应用的情况下查资料、获得下一步指引和访问企业服务；同一套 AI experience 也延伸到 Ari Mobile、Ari Chat、Ari Cloud 与 Ari Business。",
  enFact: "RealWear introduced Ari OS on August 25, 2026 as a voice-first operating system for real-world work. The company describes a combination of voice, visual context, and connected intelligence that lets technicians, engineers, and frontline workers find information, see the next step, and reach enterprise services without looking down or switching applications. The same AI experience extends through Ari Mobile, Ari Chat, Ari Cloud, and Ari Business.",
  zhValue: "Ari OS 的具体变化不是增加一个会说话的助手，而是把“现场任务—信息—下一步—记录”做成跨设备连续会话。用户可以在支持的 RealWear 眼镜上用语音工作，把需要看的信息显示在视野里；离开眼镜后，手机与浏览器继续保留 conversation history、skills 和 context；企业侧再通过 Ari Cloud 管理连接器、记忆、文档和设备。这个设计把硬件的 hands-free 优势与手机/浏览器的管理和输入能力接在一起。",
  enValue: "Ari OS’s concrete change is not simply adding a talking assistant. It makes field task, information, next step, and record one cross-device session. A user can work by voice on supported RealWear glasses and receive a concise visual response in the field of view; after removing the glasses, the phone and browser continue the conversation with context, skills, and history. Ari Cloud adds the management layer for connectors, memory, documents, and devices. The design connects the hands-free advantage of wearable hardware with the management and richer input available on a phone or browser.",
  zhHciLens: ["输入：语音、现场视觉上下文、文档、联系人与企业服务", "计算：Ari OS、Ari Cloud、skills、connectors 与 conversation history", "反馈：视野中的下一步、手机续接、浏览器会话与设备管理"],
  enHciLens: ["Input: voice, visual field context, documents, contacts, and enterprise services", "Compute: Ari OS, Ari Cloud, skills, connectors, and conversation history", "Feedback: next steps in view, phone continuation, browser sessions, and device management"],
  zhImplication: "现场 AI 的核心界面应把注意力成本纳入系统状态：什么时候只说一句，什么时候在视野中展示短答案，什么时候把任务转移到手机或浏览器，什么时候必须要求人工确认。Ari OS 的跨设备连续性值得跟踪，但真正决定可用性的还有声学噪声、连接中断、企业权限、敏感文档和错误指引的回退路径。",
  enImplication: "The core interface for frontline AI should treat attention cost as a system state: when to speak one sentence, when to show a short visual answer, when to move the task to a phone or browser, and when to require human confirmation. Ari OS’s cross-device continuity is worth watching, but usability will also depend on acoustic noise, connection loss, enterprise permissions, sensitive documents, and recovery when guidance is wrong.",
  sourceDate: "2026-08-25 official announcement; 2026-08-28 current source sweep",
  visual: {
    path: "assets/realwear-ari-os-official-2026-08.png",
    width: 1600,
    height: 900,
    kind: "source-backed official page screenshot",
    altZh: "RealWear Ari OS 官方产品公告页面截图",
    altEn: "RealWear Ari OS official product announcement",
    captionZh: "来源追踪视觉：RealWear 官方公告；Ari OS 已宣布在 Navigator Z1 可用，更多设备与企业部署细节仍未披露。",
    captionEn: "Source-traceable visual: RealWear’s official announcement; Ari OS is stated to be available on Navigator Z1, while broader device and enterprise details remain undisclosed.",
    sourceUrl: "https://www.realwear.com/press-releases/ari-os"
  },
  sources: [
    { label: "RealWear · Introducing Ari OS", url: "https://www.realwear.com/press-releases/ari-os", type: "official" },
    { label: "Ari OS product site", url: "https://www.ari-os.com/", type: "official" },
    { label: "RealWear · Navigator Z1", url: "https://www.realwear.com/", type: "official" }
  ],
  dossier: {
    zh: {
      productName: "RealWear Ari OS",
      productType: "Ari OS 是 RealWear 面向现场工作的 voice-first AI operating system，覆盖支持的智能眼镜、手机和浏览器。它把语音交互、视觉上下文、企业连接器、skills、memory、documents 与 connected devices 组合起来，目标用户是技术员、工程师和需要双手持续工作的 frontline worker。",
      interactionFlow: "用户在支持的 RealWear 设备上通过语音提出问题或请求指导，Ari 根据现场上下文和已连接的信息返回语音或视野中的简短视觉答案；需要时可请求联系人、读取资料、进入下一步。离开眼镜后，Ari Mobile 继续同一 conversation，Ari Chat 在浏览器中提供历史会话、文档和连接服务，Ari Cloud 管理 skills、connectors、memory、documents 与设备，Ari Business 供 IT/运营团队配置用户、推送更新和制作 custom skills。",
      specsOrStack: "官方公开的系统栈包括支持的 RealWear smart glasses、Ari OS、Ari Mobile、Ari Chat、Ari Cloud、Ari Business、conversation history、skills、connectors、memory、documents 与 connected devices。初始连接器包括 email、calendar、contacts 和 Microsoft Teams。公告没有披露具体模型、端侧/云端分工、网络要求、设备芯片、麦克风/显示规格、API/SDK、企业权限粒度、日志保留和离线能力，均为 source not stated。",
      useCases: "具体场景包括技术员在设备旁查询维修步骤；工程师在设施中请求下一步指导并把信息显示在视野里；现场工人不放下工具就访问邮箱、日历、联系人和 Teams；离开工位后通过手机继续同一任务；浏览器中回看文档和对话；企业管理员批量配置设备、用户、更新和面向流程的 skills。它的价值集中在需要移动、噪声、双手占用和频繁跨地点的工作。",
      painPointsSolved: "Ari OS 针对现场人员必须停工、掏手机、切换应用、记住复杂流程和重复回到桌面电脑的问题。语音减少手部操作，视觉上下文让下一步出现在工作视野中，跨设备会话减少重新解释任务的成本，企业连接器让信息不必在多个 app 之间搬运。它没有自动消除网络中断、语音误识、错误建议、视野拥挤、企业权限冲突或敏感现场信息被持续记录的风险。",
      newTech: "新技术点是把 voice-first interaction 与 visual context、跨设备 context carry-over 和企业级 cloud management 组合成同一条工作链。它不把眼镜当作孤立终端，而是让眼镜承担低注意力的现场入口，手机承担移动续接，浏览器承担更完整的会话与文档管理，云端承担 skills、connectors、memory 和设备治理。这个形态更接近一个跨 form factor 的 AI shell，而不是单一语音助手。",
      availability: "RealWear 公告明确写明 Ari OS available today on RealWear Navigator Z1，用户可以注册 Ari、Ari Mobile 和 Ari Chat，并获得 email、calendar、Microsoft Teams 的初始集成。官方说更多 RealWear 设备与新的 Ari Business skills 将在后续数月推出。价格、支持国家、语言、企业合同、试用期、服务等级和 Navigator Z1 的具体兼容版本为 source not stated。",
      limitsOrUnknowns: "当前未知包括具体支持的设备列表、摄像头/显示是否参与上下文、端侧还是云端处理、无网时能否工作、语音在工厂噪声中的识别率、错误建议如何回退、文档和会话保存多久、管理员能否查看完整操作轨迹、跨租户隔离、数据删除、技能权限和 connector scope。官方可用性声明证明产品表面存在，不等于每个现场流程已验证可靠。",
      productVerdict: "Ari OS 是今天最清晰的 confirmed product：它把 AI 从眼镜上的单次问答推进到现场任务的跨设备连续层。产品判断：对 RealWear 已有 frontline 场景有现实价值，尤其是语音、视野提示和企业服务连接；但用户体验是否成立取决于噪声、离线、权限、隐私和错误恢复。下一步看 Navigator Z1 实测、企业 admin/API、更多硬件支持和真实任务完成率。"
    },
    en: {
      productName: "RealWear Ari OS",
      productType: "Ari OS is RealWear’s voice-first AI operating system for frontline work across supported smart glasses, phones, and browsers. It combines voice interaction, visual context, enterprise connectors, skills, memory, documents, and connected devices for technicians, engineers, and workers who need to keep both hands on a task.",
      interactionFlow: "On a supported RealWear device, the user asks a question or requests guidance by voice. Ari uses available context and connected information to return spoken feedback or a concise visual response in the field of view; the user can request a contact, retrieve information, or see the next step. After the glasses come off, Ari Mobile continues the same conversation. Ari Chat provides browser access to history, documents, and connected services. Ari Cloud manages skills, connectors, memory, documents, and devices, while Ari Business gives IT and operations teams controls for users, updates, and custom workflow skills.",
      specsOrStack: "The public system stack includes supported RealWear smart glasses, Ari OS, Ari Mobile, Ari Chat, Ari Cloud, Ari Business, conversation history, skills, connectors, memory, documents, and connected devices. Initial integrations include email, calendar, contacts, and Microsoft Teams. The announcement does not disclose the model, edge/cloud split, network requirements, device chips, microphone or display specifications, API/SDK, enterprise permission granularity, log retention, or offline capability; those details are source not stated.",
      useCases: "Concrete uses include a technician retrieving a repair procedure beside equipment; an engineer asking for the next step while keeping instructions in view; a frontline worker reaching email, calendar, contacts, or Teams without putting down a tool; continuing the same task from a phone after leaving the work area; reviewing documents and conversations in a browser; and an enterprise administrator provisioning devices, users, updates, and workflow-specific skills. The product is aimed at work that is mobile, noisy, hands-occupied, and spread across locations.",
      painPointsSolved: "Ari OS targets the need for a field worker to stop, take out a phone, switch applications, remember a complex procedure, or return to a desktop for simple information. Voice reduces hand operations, visual context places the next step in the work view, cross-device continuity reduces the cost of explaining the task again, and enterprise connectors keep information from being manually moved between apps. It does not remove network outages, speech-recognition errors, incorrect guidance, visual clutter, permission conflicts, or the risk of continuously recording sensitive work context.",
      newTech: "The new product combination is voice-first interaction plus visual context, cross-device context carry-over, and enterprise cloud management in one work loop. The glasses act as a low-attention field entry point, the phone as a mobile continuation, the browser as a richer conversation and document surface, and the cloud as the layer for skills, connectors, memory, and device governance. This is closer to a cross-form-factor AI shell than to a standalone voice assistant.",
      availability: "RealWear explicitly says Ari OS is available today on the RealWear Navigator Z1. Users can sign up for Ari, Ari Mobile, and Ari Chat, with initial integrations for email, calendar, and Microsoft Teams. The company says support for additional RealWear devices and new Ari Business skills will follow in the coming months. Price, supported countries, languages, enterprise contracts, trial terms, service levels, and the exact compatible Navigator Z1 software version are source not stated.",
      limitsOrUnknowns: "Unknowns include the supported-device list, whether camera and display data are required for context, the edge-versus-cloud boundary, offline behavior, speech recognition in factory noise, recovery from incorrect guidance, retention of documents and conversations, whether administrators can inspect the full action trail, tenant isolation, deletion controls, skill permissions, and connector scope. The availability statement proves the product surface exists; it does not prove that every frontline workflow is reliable.",
      productVerdict: "Ari OS is the day’s clearest confirmed product: it moves AI on glasses from one-off questions toward a continuous, cross-device layer for field tasks. Verdict: it has practical relevance for existing RealWear frontline scenarios, especially voice, in-view guidance, and enterprise service access. The user experience will depend on noise, offline behavior, permissions, privacy, and recovery from wrong answers. Watch Navigator Z1 hands-on testing, enterprise admin/API details, broader hardware support, and real task-completion rates."
    }
  }
};

const legato = {
  id: "legato-frames-ai-hearing-glasses",
  section: "wild",
  dossierKind: "product",
  evidenceLabel: "startup signal",
  evidenceStrength: "TechCrunch exclusive company disclosure; product is expected later this fall and has not yet been independently reviewed or broadly shipped",
  zhHeadline: "Legato Frames：把听力辅助藏进一副普通眼镜",
  enHeadline: "Legato Frames put hearing assistance inside a normal-looking pair of glasses",
  zhFact: "TechCrunch 于 2026 年 8 月 26 日报道，听力科技创业公司 Legato 从 stealth 状态出现，并展示 AI hearing glasses。Legato Frames 把其 patented hearing-assistance technology 放进眼镜镜腿，采用 open-ear 设计和 dual-speaker system；公司称声音会定向到佩戴者耳边，并在离耳几英寸处减少 99% 的外泄。产品预计 2026 年秋季通过全美部分眼科服务商推出。",
  enFact: "TechCrunch reported on August 26, 2026 that hearing-technology startup Legato emerged from stealth and showed its AI hearing glasses. Legato Frames place the company’s patented hearing-assistance technology in the arms of eyewear, using an open-ear design and a dual-speaker system. The company says sound is directed toward the wearer and leakage is reduced by 99% a few inches from the ear. The frames are expected to launch later in fall 2026 through select eye-care providers nationwide.",
  zhValue: "Legato 试图解决的是听力辅助设备的可见性、佩戴羞耻与日常切换成本。公司把眼镜当成一个同时承担视觉和听觉的长期佩戴入口，目标是让用户不需要摆弄复杂 controls，也不必在助听设备与普通眼镜之间做选择。这个路线的产品难点不在“能不能把声音送到耳边”，而在验配、不同听力损失、多人对话、风噪、反馈啸叫、续航、隐私和医疗/保险流程能否被一副普通眼镜承载。",
  enValue: "Legato is targeting the visibility, stigma, and daily-switching cost of hearing assistance. The company treats eyewear as a long-wear interface that can carry both vision and hearing support, with a goal of reducing the need to fiddle with controls or choose between assistive equipment and ordinary glasses. The product challenge is not simply whether sound can reach the wearer. It is whether fitting, different hearing-loss profiles, multi-speaker conversation, wind noise, feedback, battery life, privacy, and medical or insurance workflows can be carried by something that still feels like normal eyewear.",
  zhHciLens: ["输入：环境声音、佩戴者听力需求与眼镜位置", "计算：专利听力辅助技术、音频处理与双扬声器", "反馈：定向声音、泄漏控制、佩戴舒适度与验配结果"],
  enHciLens: ["Input: ambient sound, the wearer’s hearing needs, and frame position", "Compute: patented hearing assistance, audio processing, and dual speakers", "Feedback: directed sound, leakage control, comfort, and fitting outcome"],
  zhImplication: "无障碍硬件不能只用“更隐形”来定义成功。听力辅助产品还必须让用户知道系统何时在工作、是否正确适配自己的听力曲线、如何处理多人对话和危险环境，并能在不依赖销售人员的情况下完成维护和退出。普通眼镜外观可以降低社会摩擦，却也可能让旁人误判设备状态与隐私边界。",
  enImplication: "Accessible hardware cannot define success only as being more invisible. A hearing-assistance product must also help users understand when it is active, whether it fits their hearing profile, how it behaves in multi-speaker and safety-critical environments, and how maintenance or exit works without depending on a salesperson. A normal-glasses appearance may reduce social friction while making device state and privacy boundaries less legible to people nearby.",
  sourceDate: "2026-08-26 TechCrunch disclosure; 2026-08-28 current source sweep",
  visual: {
    path: "assets/legato-frames-techcrunch-2026-08.png",
    width: 1600,
    height: 900,
    kind: "source-backed media page screenshot",
    altZh: "TechCrunch 报道 Legato AI hearing glasses 的页面截图",
    altEn: "TechCrunch report on Legato AI hearing glasses",
    captionZh: "媒体证据视觉：TechCrunch 对 Legato Frames 的独家报道；产品尚未广泛出货，以下规格和能力保持 startup signal 边界。",
    captionEn: "Media-evidence visual: TechCrunch’s exclusive report on Legato Frames; the product has not broadly shipped, so its capabilities remain a startup signal.",
    sourceUrl: "https://techcrunch.com/2026/08/26/hearing-tech-startup-legato-emerges-from-stealth-with-12m-and-a-peek-at-its-ai-hearing-glasses/"
  },
  sources: [
    { label: "TechCrunch · Legato AI hearing glasses", url: "https://techcrunch.com/2026/08/26/hearing-tech-startup-legato-emerges-from-stealth-with-12m-and-a-peek-at-its-ai-hearing-glasses/", type: "startup signal" },
    { label: "Legato website", url: "https://www.legatohearing.com/", type: "startup signal" },
    { label: "Google Patents · wearable computer signal", url: "https://patents.google.com/patent/US20260141724A1/en", type: "patent signal" }
  ],
  dossier: {
    zh: {
      productName: "Legato Frames",
      productType: "Legato Frames 是一款把听力辅助技术放进眼镜镜腿的 AI hearing glasses 概念产品。TechCrunch 报道它采用 open-ear 形态、dual-speaker system，并由拥有 Bose Frames 与 hearing-aid 背景的团队创立；当前属于 startup signal，尚未完成大规模发货或独立长期评测。",
      interactionFlow: "公司对外描述的目标是让佩戴者像戴普通眼镜一样使用，不需要反复摆弄 controls，系统在日常环境中提供听力支持。声音通过双扬声器定向到佩戴者耳边，外泄控制让附近几英寸处的声音降低。真正的验配、首次设置、听力曲线调整、模式切换、音量控制、手机/应用连接、充电和无障碍反馈流程，公开报道没有完整说明，均为 source not stated。",
      specsOrStack: "已披露的信息包括 open-ear design、dual-speaker system、公司声称的几英寸处 99% sound reduction，以及位于镜腿中的 patented hearing-assistance technology。TechCrunch 转述公司希望产品能陪伴用户 16 小时，但这属于公司发言，不是独立续航测试。电池容量、芯片、麦克风数量、传感器、蓝牙协议、手机系统、IP 等级、是否需要听力测试或处方、AI 模型与 API 均为 source not stated。",
      useCases: "潜在具体场景包括佩戴者在家中、通勤、工作和社交中持续获得听力辅助；在看电视、与家人对话或户外行走时减少摘戴传统设备的摩擦；通过眼镜外形降低在公共场所使用助听设备的心理成本；以及在眼科服务商处完成购买、验配或保险流程。产品是否能处理多人交谈、风噪、音乐、危险警报、电话和不同听力损失类型，仍需要实测证据。",
      painPointsSolved: "Legato 试图解决传统助听器的可见性、社会 stigma、设备与普通眼镜分开佩戴、配置复杂和全天佩戴意愿不足。把听力功能隐藏在日常眼镜里，可能让用户更愿意长时间保持设备在身上；定向音频和泄漏抑制则针对旁人听见的问题。它没有证据证明已经解决验配准确性、声音自然度、风噪、啸叫、续航、维修、听力医疗责任或保险报销。",
      newTech: "技术组合是把专利听力辅助算法、open-ear 声学、双扬声器定向输出和普通眼镜外观放在同一硬件中。公司强调不需要复杂 controls 的 effortless experience，说明交互目标是自动适配与低注意力使用；这也提高了反馈设计要求，因为用户必须知道系统是否已识别环境、是否改变增益和何时需要人工调整。AI 的具体作用、端侧/云端边界和个性化模型均未公开。",
      availability: "TechCrunch 报道 Legato Frames 预计在 2026 年秋季推出，通过全美部分 eye-care providers 提供；公司称价格将是传统助听器的一小部分，并可能在眼科诊所购买时符合 vision insurance，但具体价格、资格、地区、验配流程、保修和发货日期均为 source not stated。当前证据支持“创业公司已展示产品”，不支持“用户今天可以买到”。",
      limitsOrUnknowns: "关键未知包括听力测试与处方要求、算法对不同听力损失的适配、是否需要手机或云端、对话分离、反馈啸叫、风噪、警报声、双耳平衡、16 小时续航的真实条件、镜架重量、镜片选择、维修与消毒、旁人隐私和医疗责任。TechCrunch 报道没有提供独立实验室结果、临床验证、真实用户长期体验或最终零售合同。",
      productVerdict: "Legato Frames 是有明确产品方向的 startup signal：它把听力辅助从专用设备的可见性问题，移到普通眼镜的长期佩戴与无障碍体验上。产品判断：形态和声学主张值得跟踪，当前不能当作已验证的助听器替代品或医疗结论。下一步看临床/听力学验证、验配流程、真实声学泄漏测试、续航、隐私和眼科渠道上市。"
    },
    en: {
      productName: "Legato Frames",
      productType: "Legato Frames are AI hearing glasses that place hearing-assistance technology in the arms of eyewear. TechCrunch reports an open-ear form and a dual-speaker system, from a team with Bose Frames and hearing-aid experience. The product is a startup signal: it has been shown publicly but has not completed broad shipping or independent long-term review.",
      interactionFlow: "The company presents the intended experience as wearing the frames like ordinary glasses, without repeatedly fiddling with controls, while the system provides hearing support throughout the day. The dual speakers direct sound toward the wearer and the company says leakage is reduced a few inches away. The public report does not fully describe fitting, onboarding, hearing-profile adjustment, mode switching, volume control, phone or app pairing, charging, or accessible feedback. Those interaction details remain source not stated.",
      specsOrStack: "Disclosed elements include an open-ear design, a dual-speaker system, the company’s claim of 99% sound reduction a few inches from the ear, and patented hearing-assistance technology in the frame arms. TechCrunch relays a company statement that the product should live on people for 16 hours, but that is not an independent battery test. Battery capacity, chipset, microphone count, sensors, Bluetooth protocol, phone operating systems, IP rating, hearing-test or prescription requirements, AI model, and API are source not stated.",
      useCases: "Potential concrete uses include continuous hearing support at home, during a commute, at work, and in social situations; reducing the need to remove or switch traditional assistive equipment while watching television or speaking with family; lowering the social cost of wearing hearing assistance in public; and completing purchase, fitting, or insurance steps through an eye-care provider. Whether the product handles multi-speaker conversation, wind, music, alarms, phone calls, and different hearing-loss profiles requires testing.",
      painPointsSolved: "Legato is targeting the visibility and stigma of traditional hearing aids, the need to wear separate hearing and ordinary glasses, configuration burden, and weak all-day adherence. Hiding assistance in familiar eyewear could make it easier for a user to keep the device on; directed audio and leakage reduction address the concern that nearby people hear the output. There is no evidence yet that it has solved fitting accuracy, natural sound, wind noise, feedback, battery, repair, clinical responsibility, or insurance reimbursement.",
      newTech: "The product combination is patented hearing assistance, open-ear acoustics, directional dual-speaker output, and a normal-glasses appearance in one device. The company’s promise of an effortless experience with few controls points toward automatic, low-attention adaptation. That promise also raises the feedback requirement: the wearer needs to know whether the system has recognized the environment, changed gain, or needs manual adjustment. The role of AI, the edge/cloud boundary, and personalization models have not been disclosed.",
      availability: "TechCrunch reports that Legato Frames are expected to launch later in fall 2026 through select eye-care providers nationwide. Legato says the frames will cost a fraction of traditional hearing aids and may be eligible for vision insurance when purchased through an eye-care clinic, but exact price, eligibility, regions, fitting process, warranty, and ship date are source not stated. The evidence supports “a startup has shown a product,” not “a user can buy it today.”",
      limitsOrUnknowns: "Important unknowns include hearing-test and prescription requirements, adaptation across hearing-loss profiles, phone or cloud dependence, speech separation, acoustic feedback, wind behavior, alarm audibility, left/right balance, real-world conditions for the claimed 16-hour use, frame weight, lens options, repair and cleaning, bystander privacy, and medical responsibility. The report provides no independent lab results, clinical validation, long-term user evidence, or final retail agreement.",
      productVerdict: "Legato Frames are a focused startup signal: they move hearing assistance from the visibility problem of a dedicated device into the long-wear and accessibility problem of ordinary eyewear. Verdict: the form and acoustic claims are worth tracking, but the product is not yet a validated hearing-aid replacement or medical conclusion. Watch clinical and audiology validation, fitting, independent leakage tests, battery life, privacy, and the eye-care channel launch."
    }
  }
};

const metaCapture = {
  id: "meta-ai-glasses-realtime-capture-led-safety",
  section: "official",
  dossierKind: "product",
  evidenceLabel: "review/community friction",
  evidenceStrength: "Meta official documentation covers blocked-LED camera disable; August 28 mid-recording behavior is reported by current media and community posts, not yet documented in a public Meta release note",
  zhHeadline: "Meta 眼镜：隐私灯从提示，变成录制中的硬门槛",
  enHeadline: "Meta’s glasses turn the privacy LED from a warning into a live recording gate",
  zhFact: "2026 年 8 月 28 日的媒体与社区信号显示，Meta 正把 capture LED 防篡改逻辑扩展到录制已经开始之后：如果系统检测到佩戴者遮住前方隐私灯，视频应停止。Meta 既有官方说明已经写明，第二代眼镜在 LED 被遮挡时会禁用相机；本次新增的中途停止行为由媒体转述 Meta AR 副总裁 Alex Himel 的 Threads 说明，公开 release note、固件版本、覆盖型号与全球 rollout 细节尚未完整出现。",
  enFact: "Current media and community signals on August 28, 2026 indicate that Meta is extending its capture-LED anti-tampering behavior to the middle of a recording session: if the system detects that the front privacy light has been covered after recording begins, the video should stop. Meta’s existing official documentation already says second-generation glasses disable the camera when the LED is blocked. The new mid-session behavior is reported through coverage of an Alex Himel Threads statement; a public release note, firmware version, complete model list, and global rollout detail have not yet appeared together.",
  zhValue: "这不是一个多一个隐私开关的小更新，而是把旁人可见的社会信号写进相机状态机。过去的逻辑主要发生在开始拍摄前：灯被遮住就不让拍。中途停止意味着系统需要持续判断灯、录制状态与篡改状态，并把拒绝动作反馈给佩戴者。它解决的是最具体的绕过路径，却也会把误报、灯光故障、遮挡通知、录制文件是否保存和用户如何恢复变成产品体验的一部分。",
  enValue: "This is not merely another privacy toggle. It puts a social signal visible to bystanders into the camera state machine. The earlier behavior mainly happened before capture: if the light was blocked, the camera would not start. Mid-session shutdown means the system must continuously evaluate the light, recording state, and possible tampering, then provide a refusal or interruption to the wearer. It closes a specific bypass route, but makes false positives, hardware-light failure, notices, clip preservation, and recovery part of the product experience.",
  zhHciLens: ["输入：capture LED 可见性、相机录制状态、遮挡/篡改检测", "计算：眼镜固件、相机控制器、Meta AI app 与策略更新", "反馈：录制停止、提示音/通知、灯状态与可恢复路径"],
  enHciLens: ["Input: capture-LED visibility, camera recording state, and blockage/tamper detection", "Compute: glasses firmware, camera controller, Meta AI app, and policy update", "Feedback: recording stop, tones or notices, LED state, and recovery path"],
  zhImplication: "隐私机制只有在现场可理解、可预测、可验证时才像安全功能。产品必须让佩戴者知道是主动录制被停止还是硬件故障，让旁人知道灯亮代表什么，并保留不依赖云端的安全拒绝。对 HCI 团队来说，隐私灯不是装饰性 affordance，而是输入、系统状态、物理反馈和社会协议的闭环；对 QA 来说，应测试开始前遮挡、开始后遮挡、部分遮挡、强光、灯损坏、网络离线和误报恢复。",
  enImplication: "A privacy mechanism works as a safety feature only when it is legible, predictable, and testable in the scene where it is used. The product should distinguish an intentional recording stop from a hardware fault, tell bystanders what the light means, and preserve the refusal path without depending on a cloud round trip. For HCI, the LED is not decorative affordance; it is a loop joining input, system state, physical feedback, and a social protocol. QA should test pre-capture blockage, mid-capture blockage, partial occlusion, bright light, damaged LEDs, offline behavior, and recovery from false positives.",
  sourceDate: "2026-08-28 current reports; 2026-08-29 source sweep",
  visual: {
    path: "assets/meta-ai-glasses-capture-led-2026-08.png",
    width: 1600,
    height: 900,
    kind: "source-backed official product page screenshot",
    altZh: "Meta AI glasses 相机捕捉与隐私灯官方产品页截图",
    altEn: "Meta AI glasses camera capture and privacy LED product page",
    captionZh: "来源追踪视觉：Meta 官方相机捕捉页面；中途停止录制的新增行为仍以媒体/社区报告为边界，未将其升级为完整 release-note 事实。",
    captionEn: "Source-traceable visual: Meta’s official camera-capture page; the new mid-recording behavior remains bounded by media/community reporting, not a complete public release note.",
    sourceUrl: "https://www.meta.com/ca/ai-glasses/camera-capture-photo-video/"
  },
  sources: [
    { label: "Meta · Camera capture and privacy LED", url: "https://www.meta.com/ca/ai-glasses/camera-capture-photo-video/", type: "official" },
    { label: "Meta · AI glasses privacy FAQ", url: "https://about.fb.com/news/2026/07/metas-ai-glasses-your-questions-answered/amp/", type: "official" },
    { label: "Tom’s Guide · blocked LED stops recording", url: "https://www.tomsguide.com/ai/less-pervert-y-meta-ai-glasses-will-now-stop-recording-if-you-cover-the-warning-light", type: "review/community friction" },
    { label: "Reddit · blocked LED detection is now in real time", url: "https://www.reddit.com/r/RayBanStories/comments/1vzmrxq/blocked_led_detection_is_now_in_real_time/", type: "review/community friction" }
  ],
  dossier: {
    zh: {
      productName: "Meta AI glasses capture-LED safety update",
      productType: "这是 Meta Ray-Ban、Oakley Meta 与相关 AI glasses 相机链路上的隐私安全更新，不是一款新硬件。产品通过镜架前方 capture LED 告知周围人相机正在采集，并用检测 LED 被遮挡或篡改的逻辑禁用相机。官方文档确认被遮挡时相机不能继续使用；2026 年 8 月 28 日新增的录制中途遮挡即停止来自媒体与社区对 Meta AR 负责人公开说明的转述，当前应标为 review/community friction，等待正式 release note 与固件范围。",
      interactionFlow: "用户按下实体拍摄键或用语音启动照片/视频，前方白色 capture LED 闪烁或持续亮起，周围人可以看到采集提示。系统持续检查 LED 是否可见；如果在录制开始前发现遮挡，产品提示用户清理灯后才能拍摄；如果新增逻辑在录制中发现用户覆盖 LED，系统停止相机，并通过设备提示让用户解除遮挡。拍摄完成后，素材先保存在眼镜内部，再由用户决定是否导入手机 Meta AI app。公开信息没有完整说明中途停止时片段是否保留、是否自动上传、是否影响直播，以及不同型号如何提示，均为 source not stated。",
      specsOrStack: "已披露栈包括 Meta AI glasses 的相机、capture LED、眼镜固件、Meta AI app 与用于检测遮挡/篡改的设备逻辑；Meta 官方产品页还说明 Gen 2 与 Oakley Meta 设备可录制最高 3K 视频，搭载 12MP ultra-wide camera 与内部存储。最高分辨率、型号与隐私灯能力必须按页面和地区核对；中途停止所需的传感器、模型、固件版本、功耗、延迟、离线行为、日志保存与 API 都是 source not stated。不要把 LED 检测写成能识别所有偷拍场景。",
      useCases: "具体场景包括在公共空间拍摄短视频时让旁人看到采集状态；在有人尝试贴住、涂黑或改造隐私灯时阻止相机工作；录制过程中灯被手、衣物或配件意外挡住时停止采集；用户在手机 app 中查看素材、导入并再决定分享；以及企业或场馆根据可见灯光判断是否允许使用相机设备。真实价值集中在多人环境、近距离对话、商店、学校、工作场所和活动现场，而不是用户独自拍摄时的便利性。",
      painPointsSolved: "更新针对的是 camera glasses 最具体的信任摩擦：相机可以工作，但旁人无法确认灯是否真的在亮；用户或第三方可以在开始后再遮挡 LED，形成设备仍在录制、社会提示已消失的绕过路径。把检测延长到录制中间，可以减少这条路径，让隐私承诺落到 camera off 的硬动作上。它没有解决拍摄者未获同意、旁人不知道灯的含义、远距离看不见 LED、音频采集、AI 对话处理、素材导入后的分享与云端治理。",
      newTech: "新交互在于把物理可见性变成持续的系统约束：capture LED 既是输出反馈，也是相机能否继续工作的条件。此前开始前检查是一次性 gate；中途检查把产品改成连续状态监测，要求固件在录制过程中检测遮挡、停止相机，并向用户给出可理解的恢复原因。这个机制比一条隐私政策更接近 hardware-enforced safety，但它的有效性取决于传感器/固件对部分遮挡、强光、灯损坏和正常佩戴的区分能力。",
      availability: "Meta 官方页面和 FAQ 说明 capture LED 以及被遮挡时禁用相机的机制；媒体在 2026 年 8 月 27–28 日报道 Meta 正逐步加入录制中途遮挡即停止的更新。公开材料没有给出统一的版本号、完整型号矩阵、国家/地区 rollout、强制更新窗口、用户是否能关闭或延迟更新、或中途停止后文件处理规则，因此今日只能说更新信号正在 rollout，不能声称所有设备已经具备。",
      limitsOrUnknowns: "核心未知包括中途停止是否覆盖所有 Meta AI glasses、检测由 LED 旁传感器还是相机/固件组合完成、部分遮挡如何判定、强光和低温如何影响、是否存在误报、视频片段是否保存、直播是否立即断流、用户提示是否有音频与视觉双重反馈、没有手机网络时是否仍然有效，以及系统能否记录可审计的为什么停止。社区已有用户报告关注版本差异与额外提示音，但个别帖子不能代表全球 rollout 或可靠性。",
      productVerdict: "这是一个值得今天单独报道的 confirmed-product 方向，但本次新增行为证据等级仍应下调到 review/community friction：它把隐私从一条可被绕过的提示，推进成录制状态机里的拒绝动作。产品判断：安全逻辑方向清晰，对 camera glasses 的社会可接受性有直接影响；交付质量要看正式版本、型号覆盖、误报恢复、片段处理和公开测试。后续应优先核对 Meta release notes、固件版本、实际设备回归测试和旁人可见的提示一致性。"
    },
    en: {
      productName: "Meta AI glasses capture-LED safety update",
      productType: "This is a privacy and safety update in the camera path of Meta Ray-Ban, Oakley Meta, and related AI glasses, not a new piece of hardware. A capture LED on the front of the frame tells nearby people that the camera is capturing, while blockage and tamper detection can disable the camera. Meta’s official documentation confirms that a blocked LED prevents camera use. The new behavior reported on August 28, 2026—stopping an already active recording when the LED is covered—comes through media and community reporting about a public statement from Meta’s AR leadership, so it remains a review/community friction signal pending a formal release note and firmware scope.",
      interactionFlow: "The user starts a photo or video with the physical capture button or a voice command. The white capture LED blinks briefly for a photo or remains active for video, giving people nearby a visible signal. The system checks whether that light is visible. If blockage is detected before capture, the glasses tell the user to clear the light before the camera can work. Under the newly reported behavior, if the LED becomes covered during an active recording, the system stops the camera and prompts the wearer to uncover it. Completed media is stored on the glasses until the user chooses to import it into the Meta AI app. Public material does not fully specify whether a stopped clip is preserved, uploaded, or used in a live stream, or how each model presents the interruption; those details are source not stated.",
      specsOrStack: "The disclosed stack includes Meta AI glasses cameras, the capture LED, glasses firmware, the Meta AI app, and device logic for detecting blockage or tampering. Meta’s product page also says Ray-Ban Meta Gen 2 and Oakley Meta devices can record up to 3K video with a built-in 12MP ultra-wide camera and internal storage. Resolution, model coverage, and privacy-light behavior must be checked against the page and region. The sensor path, model, firmware version, power cost, latency, offline behavior, logs, and API required for mid-session shutdown are source not stated. LED detection should not be described as detection of every form of covert recording.",
      useCases: "Concrete uses include recording a short clip in a public place while giving bystanders a visible capture signal; stopping the camera when someone tapes, paints over, or modifies the privacy light; interrupting a recording when a hand, clothing, or an accessory accidentally covers the LED; reviewing and importing media in the phone app before deciding whether to share it; and allowing a workplace or venue to judge camera use from the visible light. The value is concentrated in multi-person scenes, close conversations, stores, schools, workplaces, and events, rather than in the wearer’s solo capture workflow.",
      painPointsSolved: "The update targets a specific trust problem with camera glasses: the camera can be active while nearby people cannot tell whether the light is still working, and a user or third party can cover the LED after capture begins. That creates a bypass in which the device keeps recording after its social signal disappears. Extending detection into the recording session reduces that path and ties the privacy promise to a hard camera-off action. It does not solve consent, the fact that many people cannot see a small LED at a distance, audio capture, AI processing of conversations, sharing after import, or cloud governance.",
      newTech: "The new interaction turns physical visibility into a continuous system constraint. The capture LED is both output feedback and a condition for the camera to continue. A pre-capture check is a one-time gate; a mid-session check turns the product into continuous state monitoring that detects blockage, stops capture, and explains recovery. That is closer to hardware-enforced safety than a privacy-policy promise, but its quality depends on separating partial occlusion, bright light, a damaged LED, and ordinary wear. The most important technical surface is therefore false-positive and recovery behavior, not simply the presence of a light.",
      availability: "Meta’s official product and FAQ pages document the capture LED and camera disable behavior when the light is blocked. Media on August 27–28, 2026 reports that Meta is rolling out a further update that stops recording if the light is covered after recording has begun. Public material does not give one firmware version, a complete model matrix, country-by-country rollout, mandatory-update window, a choice to delay the update, or a rule for the stopped clip. The accurate status is a rollout signal is underway, not every device already has this behavior.",
      limitsOrUnknowns: "Key unknowns include whether mid-session shutdown covers every Meta AI glasses model, whether detection uses a dedicated sensor or a camera and firmware combination, how partial blockage is classified, how sunlight and temperature affect it, how often false positives occur, whether a stopped clip is retained, whether a live stream ends immediately, whether the wearer receives both audio and visual feedback, whether the protection works without a phone or network, and whether the system exposes an auditable reason for stopping. Community posts discuss version differences and extra tones, but individual reports cannot establish global rollout or reliability.",
      productVerdict: "This is a confirmed-product direction worth a separate report, while the newly added behavior should remain downgraded to review/community friction. It moves privacy from a bypassable warning toward a refusal action in the camera state machine. Verdict: the safety direction is clear and directly relevant to social acceptance of camera glasses; delivery quality depends on formal versioning, model coverage, false-positive recovery, clip handling, and public testing. Next, verify Meta release notes, firmware versions, real-device regression behavior, and whether the bystander-facing signal is consistent in the environments where the glasses are worn."
    }
  }
};

const issue = structuredClone(previous);
issue.date = date;
issue.zhTitle = "AI Daily 2026-08-29：隐私灯开始成为相机的实时安全门";
issue.enTitle = "AI Daily 2026-08-29: The privacy LED becomes a live safety gate for cameras";
issue.zhSummary = "今天的封面信号来自 Meta AI glasses 的 capture LED 更新：录制中途检测到隐私灯被遮挡时，系统据报道会停止相机。它把旁人可见的社会提示写进设备状态机，也暴露出误报、恢复、版本和旁人理解成本。QuEra 把 Anthropic MHS 落到量子计算机激光控制，Pinea Pi 则以 crowdfunding signal 推出 local-first 桌面 AI 节点；其余版面继续追踪现场 OS、具身采集、端侧计算、中国与海外产品，以及研究、专利和社区摩擦的证据边界。";
issue.enSummary = "Today’s cover signal is a Meta AI glasses capture-LED update: reports say the camera will stop if the privacy light is covered during an active recording. It puts a bystander-visible social cue inside the device state machine while exposing the cost of false positives, recovery, version scope, and public understanding. QuEra applies Anthropic’s MHS to quantum-computer laser control, while Pinea Pi brings a local-first desk AI node into the crowdfunding pipeline. The rest of the issue follows frontline OS, embodied capture, edge compute, China and global products, and the evidence boundaries around research, patents, and community friction.";
issue.zhPath = "./" + date + "/zh/";
issue.enPath = "./" + date + "/en/";
issue.sourcesPath = "./" + date + "/sources.md";
issue.sourceTypes = [...new Set([...(issue.sourceTypes || []), "confirmed product", "research signal", "startup signal", "crowdfunding signal", "developer surface", "review/community friction", "patent signal", "china", "global"] )];
for (const topic of issue.topics) topic.sourceDate = `${topic.sourceDate} · 2026-08-29 current source sweep`;
issue.topics = [metaCapture, mhs, ari, legato, ...issue.topics.filter((topic) => ![metaCapture.id, mhs.id, ari.id, legato.id].includes(topic.id))];
issue.coverStory = {
  topicId: metaCapture.id,
  zhTitle: metaCapture.zhHeadline,
  enTitle: metaCapture.enHeadline,
  zhSummary: ["Meta AI glasses 的 capture LED 检测据报道从“开始前不让拍”扩展到“录制中途遮挡即停止”。", "隐私灯成为相机状态机的连续输入，安全反馈必须同时服务佩戴者和旁人。", "新增行为仍待正式 release note、固件版本、型号覆盖和真实设备回归测试。"],
  enSummary: ["Reports say Meta AI glasses are extending capture-LED detection from pre-capture refusal to stopping an active recording when the light is covered.", "The privacy light becomes a continuous input to the camera state machine, with safety feedback serving both wearer and bystander.", "The new behavior still needs a formal release note, firmware scope, model coverage, and real-device regression testing."],
  imagePath: metaCapture.visual.path,
  imageWidth: metaCapture.visual.width,
  imageHeight: metaCapture.visual.height,
  imageSourceUrl: metaCapture.visual.sourceUrl,
  primarySourceUrl: metaCapture.visual.sourceUrl,
  evidenceStrength: metaCapture.evidenceStrength,
  whyCover: "The privacy LED is becoming a live camera gate: a small physical cue now governs whether a wearable can continue recording, making social trust part of the device state machine."
};
issue.designDesk.zhTitle = "设计台：把隐私提示做成可验证的实时状态";
issue.designDesk.enTitle = "Design Desk: make privacy cues verifiable live state";
issue.designDesk.zhIntro = "今天的新增把观察链路推进到社会现场：设备既要读懂机器，也要让佩戴者和旁人看懂相机何时工作、为何停止、如何恢复。";
issue.designDesk.enIntro = "Today’s additions move the observation loop into the social scene: a device must understand machines while helping wearer and bystander see when a camera works, why it stops, and how it recovers.";
issue.designDesk.zhItems.unshift({ label: "设备语义", body: "把可测量、可调整、不可越过的限制做成 agent 可读且人可审计的设备描述。" });
issue.designDesk.enItems.unshift({ label: "Device semantics", body: "Make what a device measures, adjusts, and refuses visible to both the agent and the human reviewer." });
issue.designDesk.zhItems.unshift({ label: "现场续接", body: "语音、视野、手机和浏览器应共享任务状态，同时保留错误恢复与人工接管。" });
issue.designDesk.enItems.unshift({ label: "Field continuity", body: "Voice, view, phone, and browser should share task state while preserving recovery and human takeover." });
issue.watchlistZh = ["Meta AI glasses 更新：正式 release note、固件版本、型号覆盖、中途停止后的片段处理与误报恢复。", "Anthropic MHS：公开 schema、driver 生态、权限、拒绝日志、独立实验与开源时间表。", "RealWear Ari OS：Navigator Z1 实测、噪声/离线、企业 admin/API 与更多硬件支持。", "Legato Frames：听力学验证、验配、泄漏测试、续航、隐私与眼科渠道上市。", "Pinea Pi：Kickstarter 是否按时、最终 SKU/价格、物理 mute、网络审计与本地模型更新。", ...issue.watchlistZh];
issue.watchlistEn = ["Meta AI glasses update: formal release note, firmware version, model scope, stopped-clip handling, and false-positive recovery.", "Anthropic MHS: public schema, driver ecosystem, permissions, refusal logs, independent trials, and open-source timeline.", "RealWear Ari OS: Navigator Z1 hands-on testing, noise/offline behavior, enterprise admin/API, and broader hardware support.", "Legato Frames: audiology validation, fitting, leakage tests, battery, privacy, and eye-care channel launch.", "Pinea Pi: Kickstarter timing, final SKU/price, physical mute, network audit, and local-model updates.", ...issue.watchlistEn];

await fs.writeFile(dataPath, JSON.stringify([issue, ...issues.filter((entry) => entry.date !== date)], null, 2) + "\n");

const deck = path.join("/Users/hmi/Documents/Survey/output/slidev", `ai-product-morning-brief-${date}`);
await fs.rm(deck, { recursive: true, force: true });
await fs.mkdir(path.join(deck, "public", "assets"), { recursive: true });
await fs.cp(assetsDir, path.join(deck, "public", "assets"), { recursive: true, force: true });
await fs.writeFile(path.join(deck, "package.json"), JSON.stringify({ scripts: { build: "slidev build --base ./ --out dist" }, dependencies: { "@slidev/cli": "^0.50.0", "@slidev/theme-default": "^0.25.0", vue: "^3.4.0" } }, null, 2) + "\n");
await fs.writeFile(path.join(deck, "slides.md"), [
  "---", "theme: default", `title: AI Daily ${date}`, "layout: cover", "---", "",
  `# AI Daily ${date}`, "", "隐私灯开始成为相机的实时安全门 / The privacy LED becomes a live safety gate for cameras", "",
  `<img src=\"./public/assets/meta-ai-glasses-capture-led-2026-08.png\" style=\"width:42%;height:56%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px\" />`, "",
  "**Cover evidence · Meta official camera-capture page · review/community friction · 2026-08-28 / 2026-08-29 sweep**", "",
  "---", "", "# Issue map", "",
  "- Cover story: Meta’s privacy LED becomes a live camera gate when recording is in progress.",
  "- Frontline OS: RealWear Ari OS carries voice, visual context, and enterprise state across form factors.",
  "- Accessibility hardware: Legato Frames brings a startup hearing-assistance signal into ordinary eyewear.",
  "- System layer: real-device testing, inference chips, embodied capture, edge compute, China/global routes, community friction, and downgraded research/patent signals.", "",
  "The publisher version contains the complete bilingual dossiers, all required source lanes, evidence ledger, watchlist, source index, and paged 16:9 controls.", "",
  "---", "", "# Meta capture-LED safety", "",
  `<img src=\"./public/assets/meta-ai-glasses-capture-led-2026-08.png\" style=\"width:42%;height:56%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px\" />`, "",
  "**review/community friction · Meta official product page plus current reports · August 28, 2026**", "",
  "Reports say the glasses will stop an active recording if the capture LED becomes covered. Meta’s official pages already document camera disable when the light is blocked; the mid-session behavior still needs formal release notes and firmware verification.", "",
  "The interaction question is now concrete: does the device stop, tell the wearer why, preserve the clip, and recover predictably? Test the LED before capture, during capture, under partial blockage, and offline.", "",
  `<img src=\"./public/assets/anthropic-model-hardware-standard-2026-08.png\" style=\"width:42%;height:56%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px\" />`, "",
  "**research signal · official preview · August 27, 2026**", "",
  "Model Hardware Standard uses drivers, read/write primitives, natural-language tags, MCP, CLI, and code files to make physical equipment discoverable and controllable. Anthropic describes Claude adjusting a laser, observing the result through a camera, and turning the learned sequence into a deterministic script.", "",
  "**Boundary** — The preview is limited to early partners. Public schema, permissions, device inventory, independent safety evidence, and the open-source timeline remain source not stated.", "",
  "---", "", "# RealWear Ari OS", "",
  `<img src=\"./public/assets/realwear-ari-os-official-2026-08.png\" style=\"width:42%;height:56%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px\" />`, "",
  "**confirmed product · official announcement · August 25, 2026**", "",
  "Ari OS is available today on Navigator Z1. Voice, visual context, Ari Mobile, Ari Chat, Ari Cloud, and Ari Business form a single work surface for field technicians and engineers, with initial email, calendar, contacts, and Microsoft Teams integrations.", "",
  "The product promise is continuity: a worker can ask in the field, continue on a phone, and review the same conversation in a browser. Noise, offline behavior, enterprise permissions, privacy, and recovery from wrong guidance still need evidence.", "",
  "---", "", "# Legato Frames", "",
  `<img src=\"./public/assets/legato-frames-techcrunch-2026-08.png\" style=\"width:42%;height:56%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px\" />`, "",
  "**startup signal · TechCrunch company disclosure · August 26, 2026**", "",
  "Legato’s hearing glasses put patented hearing assistance in the arms of open-ear eyewear with a dual-speaker system. The company claims directed sound and 99% lower leakage a few inches away, with a later-fall launch through select eye-care providers.", "",
  "This is a product direction, not a validated medical replacement. Fitting, audiology evidence, battery, wind/noise behavior, privacy, price, and insurance eligibility remain open.", "",
  "---", "", "# Source lanes and watchlist", "",
  "official · reviews · community · wild · research · patent · china · global · watchlist", "",
  "The public publisher surface includes all source-lane scans, concrete dossiers, bilingual density, source/date/evidence labels, full evidence visuals, and 16:9 page controls.", ""
].join("\n"));
await fs.writeFile(path.join(deck, "sources.md"), [
  `# AI Daily ${date} source ledger`, "", "## New focus sources", "",
  "- Meta AI glasses camera capture: https://www.meta.com/ca/ai-glasses/camera-capture-photo-video/",
  "- Meta AI glasses privacy FAQ: https://about.fb.com/news/2026/07/metas-ai-glasses-your-questions-answered/amp/",
  "- Tom’s Guide current report: https://www.tomsguide.com/ai/less-pervert-y-meta-ai-glasses-will-now-stop-recording-if-you-cover-the-warning-light",
  "- Reddit current friction signal: https://www.reddit.com/r/RayBanStories/comments/1vzmrxq/blocked_led_detection_is_now_in_real_time/",
  "- Anthropic Model Hardware Standard: https://www.anthropic.com/news/model-hardware-standard-research-preview",
  "- Model Context Protocol: https://modelcontextprotocol.io/",
  "- RealWear Ari OS: https://www.realwear.com/press-releases/ari-os",
  "- Ari OS product site: https://www.ari-os.com/",
  "- TechCrunch Legato Frames: https://techcrunch.com/2026/08/26/hearing-tech-startup-legato-emerges-from-stealth-with-12m-and-a-peek-at-its-ai-hearing-glasses/",
  "- Legato website: https://www.legatohearing.com/", "",
  "## Required lanes", "", "official · reviews · community · wild · research · patent · china · global · watchlist", "",
  "## Visual asset index", "",
  "- public/assets/meta-ai-glasses-capture-led-2026-08.png — Meta official camera-capture page screenshot, 1600×900",
  "- public/assets/anthropic-model-hardware-standard-2026-08.png — Anthropic official research-preview screenshot, 1600×900",
  "- public/assets/realwear-ari-os-official-2026-08.png — RealWear official announcement screenshot, 1600×900",
  "- public/assets/legato-frames-techcrunch-2026-08.png — TechCrunch media-evidence screenshot, 1600×900", "",
  "Evidence screenshots use local paths, white backgrounds, and contain-fit rendering. Research, startup, patent, community, and weak signals remain explicitly labeled. Undisclosed facts stay source not stated.", ""
].join("\n"));
console.log(`Created ${date}: ${issue.topics.length} topics, ${issue.watchlistZh.length} watchlist entries`);
