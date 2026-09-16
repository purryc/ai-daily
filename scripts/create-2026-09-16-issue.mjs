import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const surveyRoot = "/Users/hmi/Documents/Survey";
const date = "2026-09-16";
const previousDate = "2026-09-15";
const dataPath = path.join(root, "data", "issues.json");
const deckDir = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${date}`);
const previousDeck = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${previousDate}`);
const source = (label, url, type) => ({ label, url, type });
const visual = (file, kind, altZh, altEn, captionZh, captionEn, sourceUrl, width = 1600, height = 900) => ({ path: `assets/${file}`, width, height, kind, altZh, altEn, captionZh, captionEn, sourceUrl });
const product = (input) => ({ dossierKind: "product", ...input });
const scan = (input) => ({ dossierKind: "scan", ...input });

const fanucUrl = "https://www.fanuc.co.jp/en/profile/pr/newsrelease/2026/notice20260911.html";
const perplexityUrl = "https://www.perplexity.ai/sr-Latn/hub/blog/portable-computer-for-windows-is-here";
const hpPerplexityUrl = "https://www.perplexity.ai/en-GB/hub/blog/perplexity-comes-to-more-windows-pcs-with-hp";
const huaweiUrl = "https://www.ithome.com/1/002/926.htm";
const snapUrl = "https://newsroom.snap.com/specs-launch-date";
const fanucVisual = visual("fanuc-ai-welding-agent-2026-09.png", "source-backed page screenshot", "FANUC AI Welding Agent 官方公告截图", "FANUC AI Welding Agent official announcement screenshot", "FANUC 官方公告：图纸进入 CRX 平板，AI 生成焊接参数与机器人动作。", "FANUC official announcement: a drawing enters the CRX tablet and AI generates welding parameters and robot motion.", fanucUrl);
const perplexityVisual = visual("perplexity-portable-windows-2026-09.png", "source-backed page screenshot", "Perplexity Portable Computer for Windows 官方页面截图", "Perplexity Portable Computer for Windows official page screenshot", "Perplexity 官方页面：本地模型、agent harness、orchestrator 与 scheduler 在 Windows 设备运行。", "Perplexity official page: the local model, agent harness, orchestrator, and scheduler run on the Windows device.", perplexityUrl);
const hpVisual = visual("perplexity-hp-windows-2026-09.png", "source-backed page screenshot", "Perplexity 与 HP 本地 AI 合作页面截图", "Perplexity and HP local AI partnership page screenshot", "Perplexity 官方页面：HP ZBook Ultra G3a 预装 Perplexity，并把本地 agent 延伸到 Revit MCP。", "Perplexity official page: HP ZBook Ultra G3a preloads Perplexity and extends the local agent to Revit MCP.", hpPerplexityUrl);
const huaweiVisual = visual("huawei-xiaoyi-work-2026-09.png", "source-backed page screenshot", "IT之家关于华为小艺 Work 内测的页面截图", "ITHome page on Huawei Xiaoyi Work beta", "中国 lane 页面截图：小艺 Work 跨鸿蒙手机、平板与电脑，支持进度查看与关键节点审核。", "China-lane page capture: Xiaoyi Work spans HarmonyOS phone, tablet, and PC with progress visibility and review gates.", huaweiUrl);
const snapVisual = visual("snap-specs-launch-2026-09.png", "source-backed page screenshot", "Snap SPECS 发布日官方页面截图", "Snap SPECS launch-day official page screenshot", "Snap 官方发布预告：9 月 16 日首次深入展示 SPECS；最终规格与发货仍需发布会核验。", "Snap official launch notice: SPECS gets its first deep reveal on September 16; final specifications and shipping still need verification.", snapUrl);

const freshTopics = [
  product({
    id: "fanuc-ai-welding-agent-physical-ai", section: "official", evidenceLabel: "confirmed product", sourceDate: "2026-09-16",
    evidenceStrength: "FANUC official announcement; live demonstration begins September 16, shipment is scheduled for end of December 2026",
    zhHeadline: "FANUC AI Welding Agent：把工程图纸变成可审阅的焊接动作",
    enHeadline: "FANUC AI Welding Agent turns an engineering drawing into reviewable robot motion",
    zhFact: "FANUC 宣布与 Google 协作开发 AI Welding Agent：读取弧焊部件工程图，自动生成电流、电压等焊接参数与机器人动作程序。它将在 9 月 16 日东京国际焊接展演示，计划于 2026 年 12 月底出货；操作员可以直接执行，也可以微调后再焊接。",
    enFact: "FANUC says its AI Welding Agent, developed with Google, reads an engineering drawing for an arc-welding part and generates welding parameters such as current and voltage together with robot motion programs. It is demonstrated at the International Welding Show from September 16 and is scheduled to ship at the end of December 2026; operators can run the result as-is or fine-tune it before welding.",
    zhValue: "这不是把聊天机器人放进工厂，而是把图纸作为第一输入，把参数和动作作为中间产物，再把焊接执行留在熟悉的 CRX tablet teach pendant 上。用户要审核的对象从一组难读的机器人代码，变成图纸、参数、轨迹、材料和最终焊缝之间的对应关系。",
    enValue: "This is not a chatbot placed next to a factory. The drawing becomes the first input, parameters and motion become intermediate artefacts, and execution stays in the familiar CRX tablet teach pendant. The review object shifts from opaque robot code to the relationship among drawing, material, parameters, trajectory, and the resulting weld.",
    zhHciLens: ["进入：CRX 平板内置摄像头拍摄图纸", "委托：读取材料与成形要求", "产物：焊接参数 + 机器人动作", "接管：操作员执行或微调"],
    enHciLens: ["Entry: drawing captured by the CRX tablet camera", "Delegation: interpret material and final shape", "Artefact: welding parameters plus robot motion", "Takeover: operator executes or fine-tunes"],
    zhImplication: "物理 agent 的关键界面不是生成按钮，而是让工程师看到图纸证据、参数理由、动作边界和执行前的接管点。",
    enImplication: "The key interface for a physical agent is not a generate button; it is an engineer-facing view of drawing evidence, parameter rationale, motion boundaries, and a takeover point before execution.",
    visual: fanucVisual,
    sources: [source("FANUC AI Welding Agent official announcement", fanucUrl, "official"), source("FANUC Japanese product release", "https://www.fanuc.co.jp/ja/profile/pr/newsrelease/2026/news20260911.html", "official"), source("FANUC CRX arc-welding package background", "https://www.fanuc.co.jp/en/profile/news/pdf/fanucnews2022iv_e.pdf", "official")],
    dossier: { zh: {
      productName: "FANUC AI Welding Agent",
      productType: "这是 FANUC 面向 CRX 机器人弧焊场景的新产品系统，和 Google 的 Gemini Enterprise 协作，把工程图纸、焊接参数与机器人动作放进同一条物理 AI 工作流。它针对汽车、卡车部件、建材和造船等使用弧焊的工厂，补足熟练焊工短缺带来的参数设定与机器人教示负担。官方当前证据是正式产品公告加展会演示安排，不能把演示直接扩大为所有工厂都已部署。",
      interactionFlow: "操作员使用 CRX 机器人平板 teach pendant 的内置摄像头拍摄或输入弧焊部件工程图。AI Welding Agent 读取图纸，理解材料与部件最终形状，生成电流、电压等焊接条件和机器人动作程序。操作员可以接受生成结果直接执行，也可以在焊接前微调参数或动作。官方没有公开图纸格式兼容矩阵、低质量图纸处理、置信度界面、碰撞检查、人工审批模板、失败回退、急停联动或每次修改的审计记录。",
      specsOrStack: "已披露堆栈包括 FANUC CRX 机器人、CRX tablet teach pendant 内置摄像头、FANUC AI Welding Agent、Google Gemini Enterprise、连接到 FANUC 机器人的任意焊接电源，以及企业安全机制。官方称不需要额外的图纸摄像头或专用设备，也不一定需要与 Google Cloud 单独签订企业合同。模型版本、推理位置、网络要求、延迟、训练数据、焊缝传感器、内存、API、文件协议与具体 CRX 型号支持范围 source not stated。",
      useCases: "具体场景是把新部件工程图交给系统，自动得到焊接条件和机器人轨迹，用于减少零设置、零教示的初始配置；如果工程师已有经验，则可以把 AI 生成结果当作起稿，再手工微调。官方将其放在技能焊工短缺与生产交付周期压力的背景下。它不等于无需专业焊工，也没有公开不同材料、姿态、厚度、焊缝形式和夹具条件下的成功率。",
      painPointsSolved: "产品试图减少传统 robot teach-and-playback 中逐点示教、焊接参数查表、反复试焊和跨经验人员交接的时间。把摄像头放进既有平板，避免新增现场采集设备；让操作员选择直接执行或微调，保留熟练工的判断入口。它没有解决工件定位误差、夹具变化、耗材与电源差异、焊缝质量检测、危险区域安全、责任追溯和异常恢复，这些仍是上线前的工程问题。",
      userVoice: "本日没有独立用户评测或社区长时间使用反馈。FANUC 官方把‘操作员可直接执行或微调’写成产品能力，但这不是第三方对易用性、焊缝质量或长期稳定性的验证。",
      newTech: "技术创新在于把视觉读取工程图、生成式 AI 对材料与最终形状的解释、焊接参数生成、机器人运动规划和工业控制执行接成一个链路，并用 CRX 平板摄像头承接输入。相比只生成代码，它把中间结果映射到物理动作；但官方没有公布生成程序的中间表示、碰撞/可达性验证、仿真环境、模型评估集、云边分工或安全证明。",
      availability: "FANUC 公告确认 2026 年 9 月 16 日起在东京国际焊接展演示，计划于 2026 年 12 月底开始出货。具体价格、首发国家、订阅费用、支持的 CRX 配置、焊接电源清单、安装服务、培训和软件更新合同 source not stated。当前可把它视为已宣布、待出货的工业产品，而非当天可购买的消费软件。",
      limitsOrUnknowns: "需要现场核验：图纸拍摄角度与光线容错、材料识别、参数建议的可解释性、机器人轨迹可视化、碰撞和可达性检查、夹具偏差、焊缝质量闭环、断网行为、日志导出、权限分级、人工急停、错误动作回滚以及不同 CRX 型号的兼容性。没有这些证据，‘zero setup / zero teaching’只能作为官方产品主张。",
      productVerdict: "这是一个证据强度较高、但仍处于演示到出货过渡期的 physical AI 产品。它的产品价值在于把工程图转为可审阅的参数和动作，真正的验收门槛则是安全验证、焊缝质量和工程师能否在执行前有效接管。"
    }, en: {
      productName: "FANUC AI Welding Agent",
      productType: "This is FANUC's new physical-AI system for arc welding with CRX robots. Developed with Google, it places an engineering drawing, welding parameters, and robot motion inside one industrial workflow. The target environments include automotive and truck components, construction materials, and shipbuilding, where the company frames parameter setup and robot teaching as a skilled-labour bottleneck. The evidence is a formal product announcement and a scheduled trade-show demonstration; it does not prove deployment in every factory.",
      interactionFlow: "An operator uses the camera built into the CRX tablet teach pendant to capture or input an engineering drawing for an arc-welded part. AI Welding Agent reads the drawing, interprets material and final shape, then generates welding conditions such as current and voltage plus a robot motion program. The operator can run the generated result as-is or fine-tune parameters and motion before welding. FANUC does not publish the drawing-format matrix, low-quality-image handling, confidence UI, collision checking, approval template, failure recovery, emergency-stop linkage, or audit record for each edit.",
      specsOrStack: "The disclosed stack is a FANUC CRX robot, the CRX tablet teach pendant with a built-in camera, FANUC AI Welding Agent, Google Gemini Enterprise, and any welding power source connected to the FANUC robot, backed by enterprise security controls described by the announcement. FANUC says no extra drawing camera or dedicated device is required and a separate Google Cloud enterprise agreement may not be necessary. Model version, inference location, network requirement, latency, training data, weld sensors, memory, API, file protocol, and exact CRX compatibility remain source not stated.",
      useCases: "The concrete use case is to show the system a new component drawing and receive initial welding conditions and robot motion, reducing the setup and teaching required before a job. An experienced engineer can treat the AI result as a first draft and refine it. FANUC positions this against the shortage of skilled welders and the resulting production lead-time pressure. The announcement gives no success rate across materials, poses, thicknesses, joint types, fixtures, or power-source configurations.",
      painPointsSolved: "The system targets point-by-point teach-and-playback work, parameter lookup, repeated test welds, and handover between workers with different levels of experience. Reusing the CRX tablet camera avoids another site device; allowing direct execution or fine-tuning preserves a skilled operator's review entry. It does not solve workpiece-location error, fixture variation, consumable or power-source variation, weld-quality inspection, hazardous-area safety, responsibility tracing, or exception recovery. Those remain commissioning and deployment problems.",
      userVoice: "There is no independent user review or long-run community evidence in today's sweep. FANUC's statement that an operator can execute or fine-tune is a published capability claim, not third-party validation of usability, weld quality, or operational stability.",
      newTech: "The technical move is to connect visual engineering-drawing interpretation, generative understanding of material and final shape, welding-parameter generation, robot-motion planning, and industrial execution. The CRX tablet camera becomes the input surface and the motion program becomes a physical artefact. Unlike code-only generation, the system maps a drawing into an executable action, but FANUC does not publish the intermediate representation, collision or reachability proof, simulator, evaluation set, model configuration, edge/cloud split, or safety case.",
      availability: "FANUC confirms a live demonstration at the International Welding Show in Tokyo beginning September 16, 2026, with shipments scheduled to start at the end of December 2026. Price, launch countries, subscription fee, supported CRX configurations, welding-power-source list, installation service, training, and software-update terms are source not stated. It is best read as an announced industrial product moving from demo to shipment, not as a product available for immediate consumer purchase.",
      limitsOrUnknowns: "The field check needs to cover drawing angle and lighting tolerance, material identification, explanation of parameter suggestions, trajectory visualisation, collision and reachability checking, fixture deviation, weld-quality feedback, offline behaviour, log export, permission levels, human emergency stop, rollback, and compatibility across CRX models. Until these are documented or observed, ‘zero setup / zero teaching’ remains an official product claim.",
      productVerdict: "This is a relatively strong-evidence physical-AI product in the transition from demonstration to shipment. Its value is the conversion of an engineering drawing into reviewable parameters and motion. The acceptance gate is safety validation, weld quality, and whether an engineer can effectively take over before execution."
    }}
  }),
  product({
    id: "perplexity-portable-computer-windows-local-agent", section: "global", evidenceLabel: "confirmed product", sourceDate: "2026-09-14",
    evidenceStrength: "Perplexity official product announcement; Windows availability and hardware gate are explicitly published",
    zhHeadline: "Perplexity Portable Computer：Windows 电脑获得本地长任务 agent",
    enHeadline: "Perplexity Portable Computer brings a local long-running agent to Windows",
    zhFact: "Perplexity 9 月 14 日宣布 Portable Computer for Windows 在 Windows 应用中可用：模型、agent harness、orchestrator 与 scheduler 在本机运行，面向 Pro/Max 个人与企业订阅；本地推理要求至少 24GB VRAM 的 NVIDIA GeForce RTX 或 RTX PRO GPU。",
    enFact: "Perplexity announced Portable Computer for Windows on September 14. Its model, agent harness, orchestrator, and scheduler run on the Windows device for Pro and Max subscribers on individual and enterprise plans; on-device inference requires an NVIDIA GeForce RTX or RTX PRO GPU with at least 24GB of VRAM.",
    zhValue: "它把‘本地文件问答’推进到可计划、可重复、可调用本机工具的长任务。用户可以让 agent 每天核对运费发票、检查本地代码和 PR、处理文档，只有需要搜索或更强推理时才授权上云；本地任务不消耗 Computer credits。",
    enValue: "It moves beyond local-file Q&A toward scheduled, repeatable, tool-using work. A user can reconcile freight invoices, review local code and pull requests, or process documents, then authorise a cloud escalation only for search or stronger reasoning. Work handled locally does not consume Computer credits.",
    zhHciLens: ["进入：Windows app / model dropdown", "范围：授权文件夹 + 本地 MCP", "过程：planner、tool router、scheduler", "接管：跨到云端前询问许可"],
    enHciLens: ["Entry: Windows app / model dropdown", "Scope: permitted folders plus local MCP", "Process: planner, tool router, scheduler", "Takeover: permission before cloud escalation"],
    zhImplication: "本地 agent 的 UX 重点不是宣称‘更私密’，而是明确显示哪些步骤留在设备、哪一步要出网、会带走什么数据以及如何停止计划任务。",
    enImplication: "The UX of a local agent is not simply claiming more privacy; it must show which steps stay on device, when work leaves, what data moves, and how a scheduled task is stopped.",
    visual: perplexityVisual,
    sources: [source("Portable Computer for Windows official announcement", perplexityUrl, "official"), source("Portable Computer local-first launch", "https://www.perplexity.ai/en-GB/hub/blog/introducing-portable-computer-for-local-first-ai", "official"), source("Perplexity Windows app with HP", hpPerplexityUrl, "global")],
    dossier: { zh: {
      productName: "Perplexity Portable Computer for Windows",
      productType: "这是 Perplexity Computer 的本地运行版本，面向需要处理敏感文件、代码和长任务的 Windows 用户。它不是一个独立硬件，而是现有 Perplexity Windows app 里的本地 agent harness：模型、规划器、工具路由、调度器和任务编排都在用户自己的 Windows 设备上工作，并可以在用户许可后调用云端搜索或 frontier model。",
      interactionFlow: "用户安装或更新 Perplexity Windows app，在模型下拉菜单中选择并一键下载本地模型，再把允许访问的文件夹、本地工具和 MCP server 接入任务。用户可以提出一次性任务，也可以安排重复任务，例如每天比对本地运费发票、处理文档或审阅代码。Agent 在设备上读取文件、搜索索引、调用本地工具并生成结果；如果需要最新网页信息、浏览器、连接 app 或更强推理，系统会在把内容送入云端前请求用户许可。",
      specsOrStack: "官方披露的组件包括本地模型、agent harness、planner、tool router、orchestrator、scheduler、durable task queue、本地搜索索引、隔离执行环境和本地 MCP server。Windows 本地推理要求 NVIDIA GeForce RTX 或 RTX PRO GPU 至少 24GB VRAM；产品面向 Pro 和 Max 的个人与企业计划。官方没有说明 Windows 支持的具体 GPU 型号、模型文件大小、显存占用、量化方式、CPU/RAM 下限、离线可用范围、MCP 权限沙箱细节或本地数据加密方式。",
      useCases: "具体用例包括把物流发票与本地费率表逐张比对并生成异常队列；在本地代码库基础上审阅 GitHub pull requests，再经批准向 Slack 发布分类与负责人；处理文档、表格、演示、PDF、代码和图像；通过本地 MCP 驱动桌面应用创建或修改文件。Perplexity 还说明可以调用 Gmail、Outlook、Slack、GitHub、Perplexity Search 与 15+ frontier models，但每个连接的读写权限与地区限制需要单独核对。",
      painPointsSolved: "它试图解决敏感资料不能随意上云、云端 agent 需要按 credit 计费、重复文件工作耗时以及本地桌面工具难以接入 agent 的问题。调度器把‘每天重复做一次’变成持续任务，本地执行降低数据外发和长任务成本；本地 MCP 让 agent 不只读文件，也能使用桌面软件工具。它没有消除本地 GPU 购买门槛、模型能力差距、耗电、散热、任务失败、权限误配和云端升级时的泄露风险。",
      userVoice: "本日证据以 Perplexity 官方产品页为主，尚无独立 Windows 长任务评测可支持稳定性、速度、功耗或本地模型质量结论。官方给出的物流、设计和代码场景是产品示例，不是第三方成功率。",
      newTech: "新技术不是单独的本地模型，而是把完整 agent runtime 搬到个人 Windows 设备：本地模型负责多数工作，orchestrator 决定何时使用文件、MCP、搜索、连接器或云端模型，并用权限询问把跨边界动作显性化。‘不消耗 credits’改变了长任务的成本模型；但官方没有披露本地与云端之间的具体数据最小化、上下文裁剪、模型切换和重试语义。",
      availability: "Perplexity 官方称 Portable Computer for Windows 已在现有 Windows app 中提供，面向个人与企业计划的 Pro 和 Max 订阅用户。下载 app 后可在模型下拉菜单一键下载本地模型；本地推理硬件门槛为至少 24GB VRAM 的 NVIDIA GeForce RTX 或 RTX PRO GPU。具体国家、Windows 版本、企业管理部署、模型下载大小、可用模型清单和价格 source not stated。",
      limitsOrUnknowns: "需要继续验证 Windows 首次下载与更新、显存不足提示、长任务中断恢复、电脑睡眠、计划任务冲突、本地 MCP 的权限边界、连接器数据外发、用户撤销云端升级、日志删除、多个用户共享设备和企业管理员审计。‘整个 stack 在本机’是官方描述，但云端搜索、15+ 模型与连接 app 仍意味着部分任务会跨出设备。",
      productVerdict: "这是本地优先 agent 的确认产品：它把隐私边界、任务调度和本地工具组合到 Windows app，而不是停留在离线聊天。产品判断：它适合有高显存 Windows 工作站、重复知识任务和明确数据边界的团队；普遍用户的首要门槛仍是 GPU、耗电、模型质量和跨云授权。"
    }, en: {
      productName: "Perplexity Portable Computer for Windows",
      productType: "This is a local-running version of Perplexity Computer for Windows users who need to work with sensitive files, code, and long tasks. It is not a new piece of hardware; it is a local agent harness inside the existing Perplexity Windows app. The model, planner, tool router, scheduler, and orchestration run on the user's own Windows machine, with cloud search or frontier-model escalation available when the user authorises it.",
      interactionFlow: "The user installs or updates the Perplexity Windows app, selects a local model in the model dropdown, downloads it with one click, and grants access to permitted folders, local tools, and MCP servers. A task can be one-off or scheduled, such as reconciling freight invoices, processing files, or reviewing code. The agent reads local files, searches its local index, calls local tools, and returns a result. If it needs current web information, browser use, connected apps, or stronger reasoning, it asks permission before sending work to the cloud.",
      specsOrStack: "Perplexity names a local model, agent harness, planner, tool router, orchestrator, scheduler, durable task queue, local search index, isolated execution environments, and local MCP servers. Windows on-device inference requires an NVIDIA GeForce RTX or RTX PRO GPU with at least 24GB of VRAM, and the product is for Pro and Max subscribers on individual and enterprise plans. Exact supported GPU models, model-file size, memory use, quantisation, CPU/RAM floor, offline scope, MCP sandbox detail, and local encryption are source not stated.",
      useCases: "Published examples include matching freight invoices against local rate sheets and producing an exception queue; reviewing GitHub pull requests against a local codebase and, after approval, posting categories and owners to Slack; processing documents, spreadsheets, presentations, PDFs, code, and images; and using a local MCP server to create or revise a file in a desktop application. Perplexity also names Gmail, Outlook, Slack, GitHub, Perplexity Search, and 15+ frontier models, but read/write scope and territory vary by connection.",
      painPointsSolved: "The product targets sensitive material that cannot casually move to the cloud, credit costs for long-running cloud agents, repetitive file work, and the difficulty of connecting an agent to desktop tools. Scheduling turns ‘do this every morning’ into a persistent task; local execution reduces data transfer and credit use; local MCP extends the agent from reading files to using application tools. It does not remove the cost of a high-VRAM GPU, model-quality differences, power and heat, task failure, permission mistakes, or leakage risk when a task escalates.",
      userVoice: "Today's evidence is primarily Perplexity's official product material. There is no independent Windows long-task review in the sweep to support claims about stability, speed, power draw, or local-model quality. The logistics, design, and coding scenarios are product examples, not third-party success rates.",
      newTech: "The technical move is not simply shipping a local model; it moves an agent runtime onto a personal Windows machine. The local model handles most work while the orchestrator decides when to use files, MCP, search, connectors, or cloud models, and permission prompts make boundary crossings visible. Avoiding Computer credits changes the economics of long tasks. Perplexity does not publish exact data minimisation, context trimming, model-switching, or retry semantics between local and cloud execution.",
      availability: "Perplexity says Portable Computer for Windows is available in the existing Windows app for Pro and Max subscribers on individual and enterprise plans. Users download the app and then download a local model from the model dropdown. The hardware gate is an NVIDIA GeForce RTX or RTX PRO GPU with at least 24GB of VRAM. Country coverage, Windows-version support, managed enterprise deployment, download size, model list, and pricing are source not stated.",
      limitsOrUnknowns: "The next pass should test first download and update, insufficient-VRAM messaging, interruption recovery, sleep and wake, schedule conflicts, local MCP permissions, connector egress, user cancellation of cloud escalation, log deletion, multi-user machines, and enterprise audit. ‘The entire stack runs on device’ is the official description, but cloud search, 15+ models, and connected apps mean some tasks still cross the device boundary.",
      productVerdict: "This is a confirmed local-first agent product: it joins a privacy boundary, task scheduling, and local tools inside a Windows app rather than stopping at offline chat. Verdict: it fits teams with high-VRAM Windows workstations, repetitive knowledge work, and explicit data boundaries. For general users, GPU cost, power, model quality, and cloud-authorisation friction remain the main gate."
    }}
  }),
  product({
    id: "perplexity-hp-zbook-revit-mcp-local-workflow", section: "global", evidenceLabel: "developer surface", sourceDate: "2026-09-15",
    evidenceStrength: "Perplexity official partnership announcement; HP hardware and Revit MCP details are published as a supported configuration / tech preview",
    zhHeadline: "Perplexity × HP：本地 agent 进入 ZBook 与 Revit 的模型上下文",
    enHeadline: "Perplexity and HP put a local agent beside ZBook and Revit's model context",
    zhFact: "Perplexity 9 月 15 日宣布与 HP 扩大合作：Perplexity Windows app 将预装到 HP 设备，首批从 HP ZBook Ultra G3a 开始；支持配置可用 Portable Computer 本地运行，并通过 Revit 2027 Multi Context Protocol 技术预览读取建筑模型。",
    enFact: "On September 15, Perplexity announced an expanded HP partnership: the Perplexity Windows app will be preloaded on HP devices, beginning with the HP ZBook Ultra G3a. Supported configurations can run Portable Computer locally and connect to building models through the Revit 2027 Multi Context Protocol tech preview.",
    zhValue: "这条产品信号把本地 agent 从‘文件夹权限’推进到专业应用的结构化模型。建筑师可以问一栋楼有多少扇门、哪些门有特定防火等级，agent 在 Revit 中定位对象并导出视图、PDF 和 schedules；当前 MCP 是只读，减少了直接改模型的风险。",
    enValue: "The signal moves local agents from folder permissions into a professional application's structured model. An architect can ask how many doors a building has or which doors have a fire rating, see matching objects in Revit, and export views, PDFs, and schedules. The current MCP preview is read-only, reducing direct model mutation risk.",
    zhHciLens: ["入口：预装 Windows app", "上下文：本地文件 + Revit 模型", "反馈：Revit 定位与导出产物", "边界：MCP tech preview，read-only"],
    enHciLens: ["Entry: preloaded Windows app", "Context: local files plus Revit model", "Feedback: Revit selection and exports", "Boundary: MCP tech preview, read-only"],
    zhImplication: "专业 agent 的可信度来自对象级回指：回答必须能把自然语言问题落回模型对象、视图和导出文件，而不是只给一段文字。",
    enImplication: "Trust in a professional agent comes from object-level return paths: an answer should map back to model objects, views, and exported files rather than ending as prose.",
    visual: hpVisual,
    sources: [source("Perplexity comes to more Windows PCs with HP", hpPerplexityUrl, "official"), source("Perplexity Portable Computer for Windows", perplexityUrl, "official"), source("Autodesk Revit 2027 product page", "https://www.autodesk.com/products/revit/overview", "developer surface")],
    dossier: { zh: {
      productName: "Perplexity Windows app on HP ZBook Ultra G3a + Revit 2027 MCP Tech Preview",
      productType: "这是 Perplexity、HP 与 Autodesk Revit 生态连接起来的本地 agent 配置，不是一个单独的新模型。HP 设备预装 Perplexity Windows app，HP ZBook Ultra G3a 作为面向 AI 与图形工作的移动工作站提供本地计算基础；Perplexity 通过 Revit 2027 Multi Context Protocol 技术预览读取打开的建筑信息模型。证据等级是 developer surface：硬件合作已宣布，Revit MCP 明确还是 tech preview。",
      interactionFlow: "用户在支持的 HP Windows 设备打开预装的 Perplexity app，选择本地或云端 Computer 工作路径，再向 agent 提问。对于 Revit，用户需要有 Revit 2027 和对应的 MCP add-on，打开一个模型后询问楼层门数量、防火等级或对象位置。Agent 读取模型上下文，定位匹配项目，回到 Revit 显示对象，并可导出 views、PDFs 和 schedules，继续用于报告或 RFI 草稿。当前公开配置中的 Revit MCP 为只读，不修改模型。",
      specsOrStack: "官方披露 HP ZBook Ultra G3a 使用 AMD Ryzen AI Max PRO 400 系列处理器，并提供面向高级 AI 与图形工作负载的配置；Perplexity app 连接 Microsoft 365、400+ app/data sources 和本地文件，Portable Computer 在满足条件时于设备上运行。Revit 2027 MCP server 是独立 add-on，当前为 Tech Preview 且 read-only。确切 CPU SKU、GPU、内存、模型版本、MCP schema、认证流、网络依赖和输出格式 source not stated。",
      useCases: "建筑师、工程师或 BIM 协调人员可以用自然语言查找模型事实：一层有多少门、哪些门满足某防火等级、门在建筑中的位置；之后让 agent 在 Revit 中显示匹配对象，导出视图、PDF 或 schedules，作为报告、核查或 request for information 的起点。Perplexity 也把本地文件、Microsoft 365、连接 app、web 与模型编排放在同一 app，但没有证明所有企业账户都已获得相同接入。",
      painPointsSolved: "它试图减少在 Revit 复杂模型、表格、图纸和报告之间手动筛选、定位、截图与复制的时间。对象级定位比一段无法核对的摘要更接近专业工作，read-only 也限制了 agent 直接破坏模型的能力。它没有解决模型命名不一致、版本冲突、权限、规则解释、几何理解、遗漏对象、导出后人工复核和工程责任，这些决定了它能否进入真实交付。",
      userVoice: "本日没有独立建筑行业评测，也没有社区证据证明 Revit MCP 在大模型、复杂族、链接模型或多人协作中稳定。官方用问门数量与防火等级作为示例；这些是功能路径，不是项目级准确率。",
      newTech: "关键技术是把 agent 的自然语言入口接到专业应用的结构化上下文，而不是只对文件做 OCR。MCP server 使 Revit 模型对象、属性和位置成为工具可读的上下文，并让结果回到原应用进行可见定位。只读设计是重要的控制边界，但官方没有公开对象选择的引用格式、变更检测、模型版本锁定、审计和未来写入动作的审批模型。",
      availability: "Perplexity 表示 Windows app 将预装在 HP 设备，首先从 HP ZBook Ultra G3a 开始，更多 HP Windows 设备将在之后推出；支持配置可使用 Portable Computer。Revit 2027 MCP 是 Tech Preview，需要 Revit 2027 与单独 add-on。具体 HP 销售地区、价格、出货日、Portable eligibility、Revit MCP 下载入口和企业许可条件 source not stated。",
      limitsOrUnknowns: "下一步需验证本地模型能否理解链接模型与自定义族，MCP 返回是否包含对象 ID 和来源，Revit 视图定位是否跨版本稳定，导出文件是否保留模型版本，read-only 权限是否真正阻止写入，以及断网、模型锁定、权限不足、查询歧义和大模型上下文过长时如何恢复。",
      productVerdict: "这是把本地 agent 放进专业软件工作流的开发者面案例。产品判断：其强项是对象级回指与只读边界，弱项是 tech preview、硬件配置依赖和尚未公开的 schema/审计；它值得作为 BIM 研究与原型入口，不应提前当作生产级自动建模助手。"
    }, en: {
      productName: "Perplexity Windows app on HP ZBook Ultra G3a + Revit 2027 MCP Tech Preview",
      productType: "This is a local-agent configuration connecting Perplexity, HP, and the Autodesk Revit ecosystem, not a standalone new model. HP will preload the Perplexity Windows app, with the HP ZBook Ultra G3a as a mobile workstation foundation for AI and graphics workloads. Perplexity connects to an open building-information model through the Revit 2027 Multi Context Protocol tech preview. The evidence is a developer surface: the hardware partnership is announced, while the Revit MCP is explicitly a tech preview.",
      interactionFlow: "On a supported HP Windows device, the user opens the preloaded Perplexity app and chooses a local or cloud Computer path. For Revit, the user needs Revit 2027 and its MCP add-on, opens a model, and asks about doors, fire ratings, or object location. The agent reads model context, identifies matching objects, shows them in Revit, and can export views, PDFs, and schedules for reports or an RFI draft. The published Revit configuration is read-only and does not modify the model.",
      specsOrStack: "Perplexity says the HP ZBook Ultra G3a uses AMD Ryzen AI Max PRO 400-series processors and offers configurations for advanced AI and graphics workloads. The Perplexity app connects Microsoft 365, 400+ apps and data sources, local files, and, where eligible, Portable Computer. The Revit 2027 MCP server is a separate add-on, currently a read-only Tech Preview. Exact CPU SKU, GPU, memory, model version, MCP schema, authentication, network dependency, and export format are source not stated.",
      useCases: "Architects, engineers, and BIM coordinators can ask natural-language questions about a model: how many doors are on a floor, which doors meet a fire rating, or where those doors appear. The agent can show matching items in Revit and export views, PDFs, or schedules as a starting point for reports, checking, or a request for information. Perplexity also joins local files, Microsoft 365, connected apps, web, and model orchestration in one app, but it does not prove identical access for every enterprise account.",
      painPointsSolved: "The workflow targets manual filtering, locating, screenshotting, and copying across a complex Revit model, spreadsheets, drawings, and reports. Object-level selection is easier to verify than an unsupported paragraph, while read-only access reduces the risk of direct model damage. It does not solve inconsistent naming, version conflicts, permission, rule interpretation, geometry understanding, missed objects, post-export review, or engineering responsibility. Those determine whether it can enter real delivery work.",
      userVoice: "There is no independent architecture-industry review in today's sweep and no community evidence for stability across large models, custom families, linked models, or multi-user coordination. Perplexity's door-count and fire-rating examples describe a path, not project-level accuracy.",
      newTech: "The notable move is connecting a natural-language agent to structured professional-app context rather than applying OCR to files. The MCP server makes Revit objects, properties, and locations available as tool context and returns results to the source application for visible selection. Read-only is an important control boundary. Perplexity does not publish the object-citation format, change detection, model-version locking, audit trail, or approval model for future write actions.",
      availability: "Perplexity says the Windows app will be preloaded on HP devices, beginning with the HP ZBook Ultra G3a, with more HP Windows devices to follow; supported configurations can use Portable Computer. Revit 2027 MCP is a Tech Preview and requires Revit 2027 plus a separate add-on. HP sales territories, price, shipping date, Portable eligibility, MCP download path, and enterprise licence terms are source not stated.",
      limitsOrUnknowns: "The next verification should test linked models and custom families, object IDs and provenance in MCP responses, cross-version view selection, model-version retention in exports, whether read-only truly blocks writes, and recovery from offline state, model locks, permission failures, ambiguous questions, and overlong context.",
      productVerdict: "This is a developer-surface example of placing a local agent inside a professional software workflow. Verdict: its strengths are object-level return paths and a read-only boundary; its weaknesses are tech-preview status, hardware dependence, and unpublished schema and audit detail. It is worth exploring for BIM research and prototyping, not yet treating as a production autonomous-modelling assistant."
    }}
  }),
  product({
    id: "huawei-xiaoyi-work-cross-device-beta", section: "china", evidenceLabel: "confirmed product", sourceDate: "2026-09-16",
    evidenceStrength: "IT之家 report on Huawei beta announcement; current status is internal beta and public specifications are limited",
    zhHeadline: "华为小艺 Work：把工作 agent 放进鸿蒙手机、平板与电脑",
    enHeadline: "Huawei Xiaoyi Work puts a cross-device work agent across HarmonyOS phone, tablet, and PC",
    zhFact: "IT之家 9 月 16 日报道，华为小艺 Work 开启内测，定位为面向办公、代码开发与创意创作的 AI 工作助理，支持鸿蒙手机、平板和电脑；Windows 客户端版本号为 0.6.9，鸿蒙电脑用户可预约鸿蒙版。",
    enFact: "ITHome reports on September 16 that Huawei Xiaoyi Work has entered internal beta as an AI work assistant for office tasks, coding, and creative work across HarmonyOS phones, tablets, and PCs. A Windows client is listed at version 0.6.9, while HarmonyOS computer users can reserve the HarmonyOS build.",
    zhValue: "小艺 Work 的交互主张是用户给目标，系统自行拆解、安排步骤、调用工具并推进执行，用户能查看进度并在关键节点审核；手机可以远程下发任务、看过程、验收结果。它的产品竞争点是跨设备的委托与接管，而不是单端聊天。",
    enValue: "Xiaoyi Work's interaction claim is goal in, with the system decomposing work, arranging steps, calling tools, and progressing execution while the user sees progress and reviews key gates. A phone can remotely issue a task, watch progress, and accept the result. The competitive surface is cross-device delegation and takeover, not single-device chat.",
    zhHciLens: ["进入：工作模式 / Windows client", "委托：目标 → 拆解 → 工具调用", "过程：手机远程查看进度", "接管：关键节点审核与验收"],
    enHciLens: ["Entry: Work mode / Windows client", "Delegation: goal → plan → tool calls", "Process: remote progress from phone", "Takeover: review gates and acceptance"],
    zhImplication: "跨端 agent 需要把任务身份、当前步骤、待审核动作和最终产物保持在一个可迁移的状态里，否则远程查看只是通知，不是接管。",
    enImplication: "A cross-device agent needs task identity, current step, pending action, and final artefact to remain one portable state; otherwise remote viewing is only notification, not takeover.",
    visual: huaweiVisual,
    sources: [source("IT之家：华为小艺 Work 开启内测", huaweiUrl, "china"), source("Huawei Cloud AgentArts product documentation", "https://support.huaweicloud.com/productdesc-agentarts/agentarts-productdesc-pdf.pdf", "developer surface")],
    dossier: { zh: {
      productName: "华为小艺 Work",
      productType: "这是华为面向工作任务的 AI 助理内测产品，覆盖日常办公、代码开发和创意创作，并把鸿蒙手机、平板、电脑放进同一条跨端任务路径。当前证据来自 9 月 16 日 IT之家报道及华为相关 Agent 文档线索，状态是内测，不应写成面向所有用户稳定开放的商业产品。",
      interactionFlow: "用户在小艺 Work 中输入一个目标，系统据报道会自主拆解任务、安排步骤、调用工具并推进执行；界面提供任务进度，关键节点由用户审核。手机、平板和电脑之间可以协同：用户在移动设备远程下发任务、查看进度并验收结果。公开报道没有展示任务创建、计划修改、工具授权、单步暂停、失败重试、审批卡片、产物版本、回滚和退出的完整界面，所以这些状态仍是待验证。",
      specsOrStack: "IT之家报道华为提供 Windows 客户端，版本号 0.6.9；鸿蒙电脑用户可在小艺 App 左侧切换到‘工作’并预约鸿蒙版。覆盖的操作系统、模型版本、端云分工、文件权限、应用调用协议、是否使用本地推理、任务队列、后台运行限制、设备发现和同步机制 source not stated。隐私声明提到会收集设备信息、应用基本信息、系统属性、华为账号信息，以及用户主动上传的文件、视频、音频、图片、文本和文档，并在服务器加密保存。",
      useCases: "报道把产品定位在办公、代码开发、设计等多种 AI 任务，并强调跨端下发、查看和验收。可以合理记录的用例是从手机发起一个工作目标，在电脑上调用文件或工具执行，再回手机查看进度与结果；具体办公软件、代码仓库、设计工具、支持的文件类型、并行任务数和可执行动作没有被本日来源完整列出。",
      painPointsSolved: "小艺 Work 试图解决用户不在电脑旁时无法启动长任务、任务过程不可见、手机与电脑之间重复传递上下文以及工作 agent 只停留在问答的问题。进度查看与关键节点审核为远程协作提供了接管位置。它没有解决内测稳定性、跨设备登录、敏感文件上传、应用权限误授、任务卡住、手机端信息密度、产物冲突和撤销，这些直接影响真实工作流。",
      userVoice: "本日没有公开的内测用户样本、独立评测或社区失败统计。IT之家报道支持跨端与任务审核的产品描述，但不能推断内测覆盖规模、成功率、延迟或所有设备均已可用。",
      newTech: "技术信号在于把目标拆解、工具调用、进度状态和跨设备控制面组合起来。手机不是第二个聊天窗口，而是远程委托与验收端；电脑承担更复杂的文件与工具工作。华为相关 AgentArts 文档展示了 agent runtime、工具增强和多渠道接入等企业能力，但当前来源没有证明这些组件全部属于小艺 Work，不能自动合并成产品规格。",
      availability: "小艺 Work 当前为内测。IT之家称 Windows 客户端可下载，版本 0.6.9；鸿蒙电脑用户可预约鸿蒙版。内测申请条件、支持地区、鸿蒙设备清单、Windows 最低配置、正式发布时间、价格、企业部署、数据保留期限与删除入口 source not stated。",
      limitsOrUnknowns: "需要继续观察任务状态机是否真的可暂停、接管与回滚，手机远程操作能否区分查看与批准，关键节点的风险解释是否具体，跨设备断连如何恢复，文件是否逐项显示上传范围，服务器加密是否伴随可见删除机制，以及代码、设计与办公工具的真实可用矩阵。",
      productVerdict: "这是中国 lane 的已宣布内测产品，产品判断应保持克制：它把跨端委托、过程反馈和人工审核放到一个工作助理叙事里，最值得验证的是‘远程看见进度’能否真正转化为‘远程安全接管’，而不是只增加一个工作模式入口。"
    }, en: {
      productName: "Huawei Xiaoyi Work",
      productType: "This is Huawei's internal-beta AI assistant for work tasks across HarmonyOS phone, tablet, and PC. It is positioned for office work, coding, and creative production, with one cross-device task path. Today's evidence comes from an ITHome report dated September 16 plus a Huawei Agent documentation lead. Its status is beta; it should not be written as a stable, universally open commercial product.",
      interactionFlow: "The user enters a goal in Xiaoyi Work. According to the report, the system decomposes the goal, arranges steps, calls tools, and progresses the task; the interface exposes progress and asks the user to review key gates. A phone, tablet, and PC can collaborate: the user can issue a task remotely, check progress, and accept the result from a mobile device. The report does not show the full UI for task creation, plan edits, tool authorisation, pause-by-step, retry, approval cards, artefact versions, rollback, or exit, so those states remain to be tested.",
      specsOrStack: "ITHome reports a Windows client at version 0.6.9; HarmonyOS computer users can switch to Work in the Xiaoyi app and reserve the HarmonyOS build. Supported OS matrix, model version, edge/cloud split, file permissions, app-call protocol, local inference, task queue, background limits, device discovery, and sync mechanism are source not stated. The privacy notice is reported to cover device information, basic app information, system properties, Huawei-account information, and files, video, audio, images, text, and documents actively uploaded by the user, stored encrypted on servers.",
      useCases: "The report positions the product for office, coding, and design-related AI tasks and highlights cross-device issuing, progress viewing, and acceptance. The safe concrete flow is: start a work goal from a phone, let the PC use files or tools, and return to the phone to inspect progress and the result. Specific office apps, repositories, design tools, file types, parallel-task limits, and executable actions are not fully enumerated by today's sources.",
      painPointsSolved: "Xiaoyi Work targets the inability to start a long task away from the computer, invisible progress, repeated context transfer between phone and PC, and work agents that stop at Q&A. Progress visibility and review gates create a takeover point for remote work. It does not yet solve beta stability, cross-device identity, sensitive-file upload, permission mistakes, stuck tasks, mobile information density, artefact conflicts, or undo, all of which affect real workflows.",
      userVoice: "There is no public beta-user sample, independent review, or community failure statistic in today's sweep. The ITHome report supports the cross-device and review-gate description, but not beta scale, success rate, latency, or availability on every device.",
      newTech: "The product signal is the combination of goal decomposition, tool calls, progress state, and a cross-device control surface. The phone is not merely a second chat window; it is a remote delegation and acceptance endpoint while the PC handles richer files and tools. Huawei AgentArts documentation mentions agent runtime, tool enhancement, and multi-channel access, but today's evidence does not prove all of those components belong to Xiaoyi Work and they should not be merged into its specification.",
      availability: "Xiaoyi Work is in internal beta. ITHome says the Windows client can be downloaded at version 0.6.9 and HarmonyOS computer users can reserve the HarmonyOS build. Beta eligibility, territories, HarmonyOS device list, Windows minimums, general-release date, price, enterprise deployment, retention, and deletion controls are source not stated.",
      limitsOrUnknowns: "The next pass should test whether the task state machine truly supports pause, takeover, and rollback; whether mobile control distinguishes viewing from approval; whether key gates explain risk; how disconnect recovery works; whether upload scope is shown item by item; whether encrypted server storage has a visible deletion path; and what office, coding, and design tools actually work.",
      productVerdict: "This is an announced China-lane beta product. The restrained read is that it joins cross-device delegation, process feedback, and human review in one work-assistant surface. The important test is whether ‘see progress remotely’ becomes ‘take over safely remotely’, rather than simply adding a Work mode."
    }}
  }),
  scan({
    id: "snap-specs-launch-day-evidence-scan", section: "wild", evidenceLabel: "weak/unverified", sourceDate: "2026-09-16",
    evidenceStrength: "Snap official launch notice confirms the event and themes; final hardware, user flow, availability, and specifications require post-event verification",
    zhHeadline: "Snap SPECS 发布日：先记录入口，暂不把演示当成产品事实",
    enHeadline: "Snap SPECS launch day: record the entry point, not an unverified product verdict",
    zhFact: "Snap 官方确认 9 月 16 日在洛杉矶首次深入展示 SPECS AR glasses，主题包括 AI assistance、工作工具、娱乐与共享体验；当前可核验材料仍不足以写出最终规格、价格、SDK、隐私灯、销售与发货。",
    enFact: "Snap confirms a September 16 first in-depth look at SPECS AR glasses in Los Angeles, covering AI assistance, work tools, entertainment, and shared experiences. The currently verifiable material is still insufficient for final specifications, price, SDK, privacy light, sales, or shipping claims.",
    zhValue: "这是一条 launch-day source-lane scan：扫描对象是发布会入口、主题与之后应核验的产品边界，不把发布前预告、渲染图或媒体转述升级成 confirmed product。",
    enValue: "This is a launch-day source-lane scan: it records the event entry, published themes, and the product boundaries that need checking afterward. Pre-launch notices, renders, or media paraphrases are not upgraded to a confirmed product.",
    zhHciLens: ["入口：specs.com/launch", "待看：显示、音频、AI、共享", "证据缺口：规格 / SDK / 价格", "状态：weak/unverified"],
    enHciLens: ["Entry: specs.com/launch", "To inspect: display, audio, AI, sharing", "Gap: specs / SDK / price", "Status: weak/unverified"],
    zhImplication: "发布日的产品判断必须以可重复用户流程、可见权限、硬件边界和真实可用性为准。",
    enImplication: "A launch-day product read should wait for a repeatable user flow, visible permissions, hardware boundaries, and real availability.",
    visual: snapVisual,
    sources: [source("Snap official SPECS launch notice", snapUrl, "official"), source("Snap SPECS June announcement", "https://investor.snap.com/news/news-details/2026/Snap-Inc--Debuts-SPECS-Augmented-Reality-Glasses-to-Make-Computing-More-Human/default.aspx", "global")],
    dossier: { zh: {
      productName: "Snap SPECS launch-day scan",
      productType: "这是对 Snap SPECS 发布日材料的 source-lane scan，不把它写成已确认销售的产品 dossier。官方确认发布会时间、地点和将展示的主题，说明产品方向涉及 AR glasses、AI assistance、工作工具、娱乐和共享体验；但在完整发布内容、可购买页面和独立评测出现前，规格与用户流程仍需逐项核验。",
      interactionFlow: "当前可以确认的入口是访问 specs.com/launch，注册或观看 9 月 16 日太平洋时间下午 4 点的直播，并等待首次深入演示与 hands-on。官方预告没有给出设备唤醒、AI 调用、显示/音频反馈、共享权限、录制提示、旁观者告知、动作确认、失败接管或退出流程。",
      specsOrStack: "已公开的只有 AR glasses 与产品主题。重量、显示技术、FoV、相机、麦克风、扬声器、SoC、模型、存储、续航、连接、OS、SDK、API、价格与 IP 等级在本扫描的官方预告中均为 source not stated。",
      useCases: "Snap 预告的方向是让 AI assistance、工作工具、娱乐和 shared experiences 出现在用户周围，服务 create、connect、learn 和 get things done，同时保持 presence。没有完整演示录像、任务清单或上市版本前，本日不把任何具体动作写成已交付用例。",
      painPointsSolved: "如果发布主张兑现，SPECS 可能减少手机屏幕切换，把计算放回用户所在环境；当前证据没有证明它解决重量、电池、热量、隐私、处方、开发者入口、社交接受或长时间佩戴。",
      userVoice: "本日没有独立用户评测或社区长时间反馈可以验证舒适度、延迟、误触、录制边界或续航。",
      newTech: "目前只能确认 Snap 把 AR display、AI assistance、工作与共享体验组织成一个硬件发布叙事；不能从预告推断具体模型、传感器、端云分工或开发者能力。",
      availability: "Snap 确认 2026 年 9 月 16 日洛杉矶发布会与线上直播注册；预告没有确认价格、预购、销售地区、开发者套件、用户资格或发货。",
      limitsOrUnknowns: "发布后需要同时核验官方产品页、开发者文档、媒体 hands-on 与社区反馈：最终硬件、显示可见性、相机与隐私指示、入口、权限、SDK、网络、续航、售后、价格、地区、发货和连续任务表现。",
      productVerdict: "今天的判断保持为 weak/unverified：SPECS 有明确发布入口，但尚未有足够公开证据支持产品结论。它留在 watchlist，直到真实硬件和可重复流程出现。"
    }, en: {
      productName: "Snap SPECS launch-day scan",
      productType: "This is a source-lane scan of Snap SPECS launch-day material, not a confirmed shipping-product dossier. Snap confirms the event time, location, and themes around AR glasses, AI assistance, work tools, entertainment, and shared experiences. Until the full launch material, a purchase page, and independent hands-on evidence appear, specifications and user flows must be checked one by one.",
      interactionFlow: "The confirmed entry is specs.com/launch: register for or watch the September 16 livestream at 4:00 p.m. Pacific and wait for the first in-depth demonstration and hands-on access. The official preview does not show device wake, AI invocation, display or audio feedback, sharing permissions, recording cues, bystander notice, action confirmation, failure takeover, or exit.",
      specsOrStack: "The notice confirms AR glasses and product themes. Weight, display technology, field of view, cameras, microphones, speakers, SoC, model, storage, battery, connectivity, OS, SDK, API, price, and ingress rating are source not stated in this launch preview.",
      useCases: "Snap previews AI assistance, work tools, entertainment, and shared experiences around the user for creating, connecting, learning, and getting things done while staying present. Without a complete demo recording, task list, or shipping build, today's issue does not promote any specific action as delivered.",
      painPointsSolved: "If the claims hold, SPECS may reduce phone-screen switching and put computing back in the user's environment. Current evidence does not show whether it solves weight, battery, heat, privacy, prescriptions, developer access, social acceptance, or long-duration wear.",
      userVoice: "There is no independent user review or long-run community feedback today to verify comfort, latency, false activation, recording boundaries, or battery.",
      newTech: "The only safe read is that Snap groups AR display, AI assistance, work, and shared experience into one hardware-launch narrative. The preview does not support an inference about a particular model, sensor, edge/cloud split, or developer capability.",
      availability: "Snap confirms the September 16, 2026 Los Angeles event and livestream registration. The preview does not confirm price, preorder, sales territories, developer kit, eligibility, or shipping.",
      limitsOrUnknowns: "After the event, verify official product pages, developer docs, media hands-on, and community reports for final hardware, display visibility, camera and privacy indicators, entry, permissions, SDK, network, battery, service, price, territory, shipping, and continuous-task behaviour.",
      productVerdict: "Today's verdict remains weak/unverified: SPECS has a clear launch entry but not enough public evidence for a product conclusion. Keep it on the watchlist until real hardware and a repeatable flow appear."
    }}
  })
];

const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = issues.find((item) => item.date === previousDate);
if (!previous) throw new Error(`Missing previous issue ${previousDate}`);
const issue = structuredClone(previous);
issue.date = date;
issue.zhTitle = "AI Daily 2026-09-16：本地 agent 与 physical AI 进入可执行的工作界面";
issue.enTitle = "AI Daily 2026-09-16: Local agents and physical AI enter executable work surfaces";
issue.zhSummary = "FANUC AI Welding Agent 把工程图变成可微调的焊接参数与机器人动作，Perplexity Portable Computer 把长任务、调度器和本地 MCP 带到 Windows；华为小艺 Work 让手机成为跨设备的委托与验收端，HP × Revit 则把本地 agent 接进结构化 BIM 模型。Snap SPECS 在发布日仍先按 weak/unverified 记录，研究、专利、社区与野生 lane 继续作为边界信号。";
issue.enSummary = "FANUC AI Welding Agent turns engineering drawings into tunable welding parameters and robot motion, while Perplexity Portable Computer brings long tasks, scheduling, and local MCP to Windows. Huawei Xiaoyi Work makes the phone a cross-device delegation and acceptance endpoint, and HP × Revit puts a local agent beside structured BIM models. Snap SPECS remains a weak/unverified launch-day scan, with research, patent, community, and wild lanes retained as boundary signals.";
issue.tags = Array.from(new Set(["physical AI", "industrial robotics", "local-first AI", "Windows agents", "BIM MCP", "HarmonyOS", "cross-device agent", "smart glasses", "HCI", "permissions", "takeover", ...issue.tags])).slice(0, 32);
issue.sourceTypes = Array.from(new Set(["confirmed product", "developer surface", "weak/unverified", "official", "china", "global", "physical AI", "local inference", "MCP", "industrial robotics", ...issue.sourceTypes]));
issue.topics = [...freshTopics, ...issue.topics.filter((item) => !freshTopics.some((fresh) => fresh.id === item.id))];
issue.coverStory = {
  topicId: freshTopics[0].id,
  zhTitle: "从图纸到动作：physical AI 开始把‘执行前接管’写进产品",
  enTitle: "From drawing to motion: physical AI makes pre-execution takeover a product surface",
  zhSummary: ["FANUC 把工程图、参数、机器人动作和操作员微调放进一条弧焊工作流。", "Perplexity 把本地 agent 的模型、调度与 MCP 放进 Windows，但高显存与云端升级仍是门槛。", "今天的验收点是：agent 生成什么中间产物，谁在执行前接管，失败如何恢复。"],
  enSummary: ["FANUC joins drawing, parameters, robot motion, and operator tuning in one welding workflow.", "Perplexity moves the local model, scheduler, and MCP into Windows, with high-VRAM and cloud-escalation gates.", "The acceptance test is what intermediate artefact the agent creates, who takes over before execution, and how failure recovers."],
  imagePath: fanucVisual.path, imageWidth: fanucVisual.width, imageHeight: fanucVisual.height, imageSourceUrl: fanucVisual.sourceUrl, primarySourceUrl: fanucUrl,
  evidenceStrength: "confirmed product · FANUC official · 2026-09-11 announcement / 2026-09-16 demonstration",
  whyCover: "Physical AI becomes a product when generated plans, visible intermediate artefacts, and human takeover sit before an irreversible action."
};
issue.designDesk = {
  zhTitle: "Design Desk：把 agent 的中间产物放到接管点之前",
  enTitle: "Design Desk: put the agent's intermediate artefact before takeover",
  zhIntro: "今天的产品从工程图、文件夹、BIM 模型和跨端目标出发，生成参数、异常队列、对象定位、计划步骤或机器人动作。共同的 UX 任务是让人看到 agent 正在依据什么、准备改变什么，以及在执行前怎样接管。",
  enIntro: "Today's products start from engineering drawings, folders, BIM models, and cross-device goals, then produce parameters, exception queues, object selections, plans, or robot motion. The shared UX task is to show what the agent used, what it is about to change, and how a person takes over before execution.",
  zhItems: [
    { label: "Show the artefact", body: "不要只显示‘已完成’，展示参数、对象、轨迹、payload 或导出文件。" },
    { label: "Name the boundary", body: "本地、云端、MCP、企业连接器和物理执行要分层标出。" },
    { label: "Gate action", body: "焊接、发送、改模型、发布前，给出对象、影响与确认。" },
    { label: "Keep state portable", body: "跨设备查看必须保留任务身份、当前步骤、待审动作和版本。" },
    { label: "Recover", body: "断连、睡眠、图纸误读、模型锁定和错误轨迹都要有恢复路径。" },
    { label: "Declare missing evidence", body: "没有独立评测、最终规格或真实发货时，界面与编辑都要降级标注。" }
  ],
  enItems: [
    { label: "Show the artefact", body: "Do not say only ‘complete’; show parameters, objects, trajectories, payloads, or exports." },
    { label: "Name the boundary", body: "Separate local, cloud, MCP, enterprise connectors, and physical execution." },
    { label: "Gate action", body: "Before weld, send, model edit, or publish, show target, impact, and confirmation." },
    { label: "Keep state portable", body: "Cross-device viewing must retain task identity, step, pending action, and version." },
    { label: "Recover", body: "Disconnect, sleep, bad drawing, model lock, and wrong motion need recovery." },
    { label: "Declare missing evidence", body: "Downgrade the UI and editorial label when review, final specs, or shipping evidence is absent." }
  ]
};
issue.watchlistZh = [
  "FANUC AI Welding Agent：图纸格式、轨迹/碰撞验证、焊缝质量、急停、日志与 12 月出货配置。",
  "Perplexity Portable Computer：Windows 模型清单、显存/耗电、调度恢复、本地 MCP 权限与云端外发提示。",
  "HP × Revit MCP：对象 ID 来源、链接模型、read-only 真实性、schema、版本锁定与企业审计。",
  "华为小艺 Work：内测覆盖、鸿蒙/Windows 设备矩阵、任务暂停/回滚、文件上传范围与删除。",
  "Snap SPECS：发布会后最终规格、显示/相机隐私、AI 入口、SDK、价格、地区与发货。",
  ...issue.watchlistZh.slice(0, 14)
];
issue.watchlistEn = [
  "FANUC AI Welding Agent: drawing formats, trajectory/collision validation, weld quality, emergency stop, logs, and December shipment configuration.",
  "Perplexity Portable Computer: Windows model list, VRAM/power, schedule recovery, local MCP permissions, and cloud-egress prompts.",
  "HP × Revit MCP: object provenance, linked models, real read-only enforcement, schema, version locking, and enterprise audit.",
  "Huawei Xiaoyi Work: beta coverage, HarmonyOS/Windows matrix, pause/rollback, upload scope, and deletion.",
  "Snap SPECS: post-launch final specs, display/camera privacy, AI entry, SDK, price, territory, and shipping.",
  ...issue.watchlistEn.slice(0, 14)
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
await fs.cp(previousDeck, deckDir, { recursive: true, filter: (sourcePath) => !sourcePath.includes(`${path.sep}dist${path.sep}`) && !sourcePath.endsWith(`${path.sep}dist`) });
await fs.mkdir(path.join(deckDir, "public", "assets"), { recursive: true });
for (const file of ["fanuc-ai-welding-agent-2026-09.png", "perplexity-portable-windows-2026-09.png", "perplexity-hp-windows-2026-09.png", "huawei-xiaoyi-work-2026-09.png", "snap-specs-launch-2026-09.png"]) {
  const src = path.join(root, date, "assets", file);
  await fs.copyFile(src, path.join(deckDir, "public", "assets", file));
}
const labels = { zh: ["产品", "产品是什么", "怎么用", "规格 / 系统栈", "使用场景", "解决痛点", "用户原声", "新技术", "可用性", "限制 / 未知", "产品判断"], en: ["Product", "What it is", "How it works", "Specs / stack", "Use cases", "Pain points", "User voice", "New tech", "Availability", "Limits / unknowns", "Product read"] };
const fields = ["productName", "productType", "interactionFlow", "specsOrStack", "useCases", "painPointsSolved", "userVoice", "newTech", "availability", "limitsOrUnknowns", "productVerdict"];
const dossierText = (locale, item) => fields.map((field, i) => `**${labels[locale][i]}** — ${item.dossier[locale][field]}`).join("\n\n");
const links = (item) => item.sources.map((s) => `[${s.label}](${s.url})`).join(" · ");
const slides = [
  `---\ntheme: default\ntitle: AI Daily ${date}\nlayout: cover\n---\n\n# AI Daily ${date}\n\n${issue.coverStory.zhTitle} / ${issue.coverStory.enTitle}\n\n<img src="./public/${fanucVisual.path}" style="width:42%;height:54%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${issue.coverStory.evidenceStrength}**\n\n${issue.coverStory.zhSummary.join(" ")}\n\n${links(freshTopics[0])}`,
  `# Issue map\n\n**Cover** — ${issue.coverStory.zhTitle}\n\n**Today’s additions** — ${freshTopics.map((item) => item.zhHeadline).join("；")}。\n\n**Eight source lanes** — official · reviews · community · wild · research · patent · china · global。\n\n**Design Desk** — ${issue.designDesk.zhTitle}。\n\nThe public publisher carries the complete bilingual, paged 16:9 issue with source/date/evidence labels and PDF downloads.`,
  ...freshTopics.flatMap((item) => [`# ${item.zhHeadline}\n\n<img src="./public/${item.visual.path}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${item.evidenceLabel} · ${item.evidenceStrength} · ${item.sourceDate}**\n\n${dossierText("zh", item)}\n\n**Sources** — ${links(item)}`, `# ${item.enHeadline}\n\n<img src="./public/${item.visual.path}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${item.evidenceLabel} · ${item.evidenceStrength} · ${item.sourceDate}**\n\n${dossierText("en", item)}\n\n**Sources** — ${links(item)}`]),
  `# Design Desk / 设计洞察\n\n${issue.designDesk.zhItems.map((x, i) => `${i + 1}. **${x.label}** — ${x.body}`).join("\n\n")}\n\n${issue.designDesk.enItems.map((x, i) => `${i + 1}. **${x.label}** — ${x.body}`).join("\n\n")}`,
  `# Watchlist / 继续观察\n\n${issue.watchlistZh.map((x, i) => `${i + 1}. ${x}`).join("\n")}\n\n${issue.watchlistEn.map((x, i) => `${i + 1}. ${x}`).join("\n")}`,
  `# Source ledger\n\nEight lanes: official · reviews · community · wild · research · patent · china · global.\n\n${Array.from(new Set(issue.topics.flatMap((item) => item.sources.map((s) => s.url)))).slice(0, 100).map((url, i) => `${i + 1}. ${url}`).join("\n")}\n\nVisual evidence uses local source-traceable images with contain positioning, white backgrounds, and no page-internal scrolling.`
];
await fs.writeFile(path.join(deckDir, "package.json"), JSON.stringify({ scripts: { build: "slidev build --base ./ --out dist" }, dependencies: { "@slidev/cli": "^0.50.0", "@slidev/theme-default": "^0.25.0", vue: "^3.4.0" } }, null, 2) + "\n");
await fs.writeFile(path.join(deckDir, "slides.md"), slides.join("\n\n---\n\n") + "\n");
const allSources = Array.from(new Map(issue.topics.flatMap((item) => item.sources).map((s) => [s.url, s])).values());
const laneRows = ["official", "reviews", "community", "wild", "research", "patent", "china", "global"].map((lane) => `| ${lane} | ${issue.topics.some((item) => item.section === lane) ? "covered" : "scan required"} | ${issue.topics.filter((item) => item.section === lane).map((item) => item.id).join(", ") || "source-lane scan"} |`).join("\n");
const visualRows = issue.topics.map((item) => `| ${item.id} | \`${item.visual.path}\` | ${item.visual.sourceUrl} | ${item.evidenceLabel} |`).join("\n");
await fs.writeFile(path.join(deckDir, "sources.md"), `# AI Daily ${date} source ledger\n\n## Source index\n\n${allSources.map((s, i) => `${i + 1}. ${s.label} — ${s.url} — ${s.type || "source not stated"}`).join("\n")}\n\n## Source-lane coverage\n\n| lane | status | topics |\n| --- | --- | --- |\n${laneRows}\n\n## Visual asset index\n\n| topic | asset | source | evidence |\n| --- | --- | --- | --- |\n${visualRows}\n\n## Evidence rules\n\n- Official pages support confirmed product or developer-surface claims only where stated.\n- Reviews and community pages provide friction signals, not universal behaviour.\n- Startup, research, patent, pre-launch, and weak material remains explicitly downgraded.\n- Missing specs, prices, dates, availability, quotes, and APIs are written as source not stated.\n- Visuals use object-fit: contain, object-position: center, white backgrounds, and no page-internal scrolling.\n- Chinese and English dossier fields carry the same information units; English is not a compressed summary.\n`);
console.log(JSON.stringify({ date, topics: issue.topics.length, fresh: freshTopics.length, sources: new Set(issue.topics.flatMap((item) => item.sources.map((s) => s.url))).size, visuals: new Set(issue.topics.map((item) => item.visual.path)).size, deckDir }));
