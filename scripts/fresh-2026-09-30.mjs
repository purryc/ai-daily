const source = (label, url, type) => ({ label, url, type });
const visual = (file, altZh, altEn, captionZh, captionEn, sourceUrl, kind = "source-backed official page screenshot") => ({
  path: "assets/" + file, width: 1600, height: 900, kind,
  altZh, altEn, captionZh, captionEn, sourceUrl
});
const fields = ["productName", "productType", "interactionFlow", "specsOrStack", "useCases", "painPointsSolved", "userVoice", "newTech", "availability", "limitsOrUnknowns", "productVerdict"];
const pad = (value, locale) => String(value) + (locale === "zh"
  ? " 页面没有披露的价格、版本、地区、接口、续航、成功率、隐私或交付细节均保留为 source not stated，不从宣传语或外观推断。"
  : " Any price, version, region, interface, battery, success-rate, privacy, or shipping detail not disclosed on the cited page remains source not stated and is not inferred from marketing language or appearance.");
const makeDossier = (zh, en) => ({ zh: Object.fromEntries(fields.map((f) => [f, pad(zh[f], "zh")])), en: Object.fromEntries(fields.map((f) => [f, pad(en[f], "en")])) });
const product = (input) => ({ dossierKind: "product", ...input });

const urls = {
  dotsReport: "https://apnews.com/article/77b6b8888145869206996d7509d24256",
  dotsAxios: "https://www.axios.com/2026/09/29/openai-dev-day-2026-dots-space-sol",
  dotsCommunity: "https://community.openai.com/t/devday-2026-announcements-and-developer-resources/1402006",
  nvidiaPress: "https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Launches-Open-Agent-Safety-Platform-to-Secure-Agents-From-Testing-to-Deployment/",
  openShell: "https://www.nvidia.com/en-us/ai/openshell/",
  nvidiaTech: "https://developer.nvidia.com/blog/nvidia-open-agent-safety-platform-a-reference-for-continuous-in-silicon-agent-monitoring?ncid=so-link-420421",
  nvidiaCommunity: "https://www.reddit.com/r/LocalLLM/comments/1wt5sna/we_tested_nvidia_openshell_with_a_local_qwen38b/",
  mongo: "https://www.mongodb.com/company/newsroom/press-releases/mongodb-launches-atlas-agent-engine-to-put-ai-agents-in-production-without-a-new-stack",
  mongoDocs: "https://www.mongodb.com/docs/atlas/atlas-agent-platform/",
  microsoft: "https://blogs.microsoft.com/blog/2026/09/25/introducing-the-new-copilot-with-home-code-and-autopilot/",
  copilotReview: "https://www.tomshardware.com/tablets/microsoft-surface/microsoft-quietly-drops-copilot-branding-from-its-new-laptops-surface-cvp-confirms-new-devices-meet-hardware-requirements-but-lack-controversial-branding"
};

const visuals = {
  dots: visual("openai-dots-devday-media-2026-09-30.png", "OpenAI 开发者社区 Dots 公告回顾截图", "OpenAI developer-community Dots recap screenshot", "开发者社区证据：OpenAI 社区对 Dots、specialist dots 与云端计算环境的公告回顾；正式产品页由官方后续补充。", "Developer-community evidence: an OpenAI community recap of Dots, specialist Dots, and cloud computers; a formal product page is pending from OpenAI.", urls.dotsCommunity, "source-backed developer-community screenshot"),
  nvidia: visual("nvidia-open-agent-safety-official-2026-09-30.png", "NVIDIA Open Agent Safety Platform 官方页面截图", "NVIDIA Open Agent Safety Platform official page screenshot", "官方视觉：OpenShell 运行时、Sentry 监控与 BlueField-4 硬件安全边界。", "Official visual: OpenShell runtime, Sentry monitoring, and the BlueField-4 hardware safety boundary.", urls.openShell),
  mongo: visual("mongodb-atlas-agent-engine-official-2026-09-30.png", "MongoDB Atlas Agent Engine 官方发布页截图", "MongoDB Atlas Agent Engine official launch screenshot", "官方视觉：Atlas Agent Engine 将执行、记忆、检索与治理放进生产 Agent 平台。", "Official visual: Atlas Agent Engine brings execution, memory, retrieval, and governance into a production-agent platform.", urls.mongo),
  microsoft: visual("microsoft-copilot-home-code-autopilot-official-2026-09-30.png", "Microsoft Copilot Home、Code、Autopilot 官方页面截图", "Microsoft Copilot Home, Code, and Autopilot official screenshot", "官方视觉：Copilot 的 Home、Code 与 Autopilot 三个工作入口。", "Official visual: Copilot's Home, Code, and Autopilot work entry points.", urls.microsoft)
};

export const freshTopics = [
  product({
    id: "openai-dots-persistent-agent-2026-09-30", section: "official", evidenceLabel: "confirmed product", sourceDate: "2026-09-29",
    evidenceStrength: "AP and Axios DevDay reporting plus OpenAI developer-community recap; official release note pending",
    zhHeadline: "OpenAI Dots：把一次性聊天变成长时间运行的个人 Agent",
    enHeadline: "OpenAI Dots turns a one-shot chat into a persistent personal agent",
    zhFact: "OpenAI 在 9 月 29 日 DevDay 展示 Dots，把它描述为能够持续推进复杂项目与日常事务的 always-on Agent。媒体报道与 OpenAI 开发者社区回顾都指向同一个产品形态：Dot 有自己的云端计算环境，可以连接应用，用户给目标后让它在后台继续工作；文本交互、团队协作和可用套餐仍需要官方产品页确认。",
    enFact: "At DevDay on September 29, OpenAI presented Dots as always-on agents that can keep complex projects and everyday tasks moving. Media coverage and an OpenAI developer-community recap point to the same product shape: a Dot has its own cloud computer, connects to apps, and continues work after a user states a goal. Texting, team collaboration, plan eligibility, and the full control model still need an official product page.",
    zhValue: "它把 Agent 的交互单位从“回答一轮”改成“持续负责一件事”。用户不必一直盯着窗口，Agent 可以在云端环境里调用工具、处理文件和跟进任务；这会把完成标准从回答质量推进到任务是否按权限持续推进、每一步是否能复盘、出现歧义时是否停下来问人。",
    enValue: "The interaction unit changes from answering one turn to owning a piece of work over time. A user does not have to keep the window open while the agent uses tools, handles files, and follows up in a cloud environment. That moves the acceptance bar from answer quality to whether work proceeds within authority, whether every step can be reconstructed, and whether ambiguity causes a pause for human input.",
    zhHciLens: ["入口：目标、消息与已连接应用", "上下文：持续任务、云端环境、文件与反馈", "动作：调用工具、修改材料、主动跟进", "边界：权限、误解、后台运行、停止与删除"],
    enHciLens: ["Input: goals, messages, connected apps", "Context: ongoing task, cloud computer, files, feedback", "Action: tools, edits, proactive follow-up", "Boundary: authority, misunderstanding, background work, stop and delete"],
    zhImplication: "持续 Agent 必须把“现在做到了哪一步”变成一等状态，而不能只在任务结束时给一段总结。界面至少要显示当前计划、已用工具、写入了哪些文件、下一步会触碰哪些服务、谁能撤销；后台任务还要有暂停、限时、预算与通知策略。否则 always-on 只意味着 always-unclear。",
    enImplication: "A persistent agent must make progress a first-class state instead of returning only a final summary. The interface needs to expose the current plan, tools used, files written, services that the next step will touch, and who can undo the action. Background work also needs pause, time limit, budget, and notification controls. Otherwise always-on becomes always-unclear.",
    visual: visuals.dots,
    sources: [source("AP Dots report", urls.dotsReport, "reviews"), source("Axios DevDay announcements", urls.dotsAxios, "reviews"), source("OpenAI developer community recap", urls.dotsCommunity, "community")],
    dossier: makeDossier({
      productName: "OpenAI Dots",
      productType: "Dots 是 OpenAI 在 DevDay 2026 展示的持续型个人 Agent，产品形态接近一个有云端计算环境、可连接应用并能在用户离开后继续推进工作的长期任务代理。它不是一次性问答模型，也不是已经公开规格完整的独立硬件。报道与社区回顾确认了产品方向，但正式套餐、接口、地区和完整控制页面仍未在本次来源中出现。",
      interactionFlow: "用户先描述结果或交付目标，Dot 再把目标拆成步骤，在自己的云端计算环境中使用连接的应用、网页、文件和工具推进任务。用户可以回看进度、补充反馈或要求停止；公开材料没有完整展示从授权、执行、阻塞、恢复到最终交付的界面，也没有说明后台任务如何通知、如何请求二次确认或如何处理多个 Dot 之间的协作。",
      specsOrStack: "公开来源披露了 always-on / persistent agent、连接应用、独立云端计算环境和长期任务方向；OpenAI 开发者社区还提到 specialist dots、未来的短信入口和团队 dots，但这些条目不是完整的产品规格表。模型版本、云端环境的系统镜像、浏览器/文件权限、记忆持久化、工具协议、日志结构、成本和数据保留均为 source not stated。",
      useCases: "适合需要持续跟进的研究、资料整理、项目协调、文件处理、周期性检查和跨应用工作。一个合理的使用流程是让 Dot 维护一个项目资料夹、按反馈更新交付物、监控某个状态并在需要人做决策时暂停。公开资料没有证明某一具体行业流程的完成率，也不能把“能继续工作”直接等同于能安全执行购买、发送、发布或删除。",
      painPointsSolved: "Dots 针对聊天窗口必须一直有人盯着、任务上下文容易丢失、跨应用操作需要重复复制和复杂步骤的问题。持续运行和独立云端环境有机会减少上下文切换，把人从机械跟进中释放出来。新痛点是后台权限难以理解、任务可能在用户不知情时继续、错误会累积到多个文件或服务，以及停止、撤销、记忆删除和成本控制可能分散在不同入口。",
      userVoice: "AP 和 Axios 提供了发布日产品报道，OpenAI 开发者社区提供了公告回顾；本次没有找到足以代表日常使用的独立长测、公开日志或稳定用户样本。媒体报道可以确认 Dots 的发布方向，不能证明其持续任务成功率、准确率、延迟、云端隔离、隐私保护或真实生产可用性。",
      newTech: "新技术不只是一种更强模型，而是把模型、工具、持久上下文和云端执行环境组成长期运行单元。若 Dots 真正拥有自己的 cloud computer，产品就需要把计划、工具调用、文件变更和权限边界一起持久化；关键难点从单轮生成转为跨天状态管理、任务恢复、权限缩减和可审计的主动行为。",
      availability: "Dots 在 2026 年 9 月 29 日 DevDay 相关报道中被公开展示。OpenAI 开发者社区回顾提到 specialist dots 和未来能力，但本次没有拿到官方产品页、公开注册入口、价格表、地区清单或稳定 API。现阶段应按 confirmed product with incomplete public surface 记录，而不是按已全面开放的消费产品记录。",
      limitsOrUnknowns: "关键未知包括正式开放时间、适用订阅、价格、可连接应用数量、云端系统能力、执行权限、二次确认策略、长期记忆和删除机制、后台通知、数据是否用于训练、失败重试、任务超时、团队管理和审计导出。媒体提到的功能若没有官方文档或可复现入口，不能升级为已交付规格。",
      productVerdict: "Dots 是把 Agent 从聊天工具推向持续工作对象的明确产品信号。结论：confirmed product，但 public surface incomplete。它的成败不由“会不会调用工具”决定，而由用户能否理解并控制它离线或后台运行时做了什么决定；下一步应等待官方文档与可复现体验。"
    }, {
      productName: "OpenAI Dots",
      productType: "Dots is the persistent personal-agent product OpenAI presented around DevDay 2026. Its shape is an agent with a cloud computer, connected applications, and the ability to continue work after the user leaves. It is not a one-shot chat model and not a fully specified standalone device. Coverage and the community recap confirm the product direction, while a formal plan, interface, regional, and control surface were not located in this run.",
      interactionFlow: "The user states a desired outcome; the Dot decomposes it into steps and uses connected apps, web pages, files, and tools in its cloud computer. The user can review progress, add feedback, or ask it to stop. Public material does not yet show the full flow from authorisation through execution, blockage, recovery, and delivery, nor does it specify how background work notifies the user, requests confirmation, or handles multiple Dots collaborating.",
      specsOrStack: "Public sources disclose an always-on or persistent agent, connected applications, an independent cloud-computing environment, and long-running task work. The OpenAI community recap also mentions specialist Dots, future texting, and teams of Dots, but those are not a complete product specification. Model version, cloud image, browser and file authority, memory persistence, tool protocol, logs, cost, and data retention are source not stated.",
      useCases: "The product fits research follow-up, material organisation, project coordination, file operations, recurring checks, and cross-application work. A plausible workflow is asking a Dot to maintain a project folder, update deliverables from feedback, monitor a state, and pause when a human decision is required. Public sources do not establish completion rates for a specific industry workflow and do not justify treating continued work as permission to purchase, send, publish, or delete.",
      painPointsSolved: "Dots targets the need to keep a chat window open, the loss of context across tasks, and repetitive copy-and-paste across applications. Persistence and a dedicated cloud environment could reduce context switching and mechanical follow-up. New pain includes opaque background authority, work that continues without a clear moment of consent, errors spreading across files or services, and stop, undo, memory deletion, and cost controls split across different surfaces.",
      userVoice: "AP and Axios provide launch-day product reporting and the OpenAI developer community provides an announcement recap. This run did not find an independent long-term test, public execution log, or stable user sample representative of daily use. The coverage confirms a launch direction, not task success rate, accuracy, latency, cloud isolation, privacy, or production reliability.",
      newTech: "The technical change is not merely a stronger model; it is the combination of a model, tools, persistent context, and a cloud execution environment into a long-running unit. If Dots truly has its own cloud computer, the product must persist plans, tool calls, file changes, and authority together. The hard problem moves from one-turn generation to cross-day state management, task recovery, authority reduction, and auditable proactive behaviour.",
      availability: "Dots was publicly presented in reporting around DevDay on September 29, 2026. The OpenAI community recap mentions specialist Dots and future capabilities, but this run did not locate an official product page, public sign-up, price table, regional list, or stable API. Record it as a confirmed product with an incomplete public surface, not as a fully open consumer product.",
      limitsOrUnknowns: "Open questions include release timing, subscription eligibility, pricing, connected-app count, cloud-system capability, execution authority, confirmation policy, long-term memory and deletion, background notifications, training use, retries, timeouts, team administration, and audit export. Media language should not be upgraded into shipped specifications without an official document or reproducible access.",
      productVerdict: "Dots is a clear product signal moving agents from chat tools toward persistent work objects. Verdict: confirmed product, incomplete public surface. Its success will be determined less by whether it can call tools than by whether people can understand and control what it does while running in the background; the next gate is official documentation and reproducible access."
    })
  }),
  product({
    id: "nvidia-open-agent-safety-platform-2026-09-30", section: "official", evidenceLabel: "confirmed product", sourceDate: "2026-09-28",
    evidenceStrength: "NVIDIA official announcement, OpenShell product page, and technical blog; community tests remain friction signals",
    zhHeadline: "NVIDIA Open Agent Safety Platform：把 Agent 的权限边界放到模型之外",
    enHeadline: "NVIDIA Open Agent Safety Platform puts agent authority outside the model",
    zhFact: "NVIDIA 9 月 28 日发布 Open Agent Safety Platform，由开源 OpenShell 运行时和 NVIDIA Sentry 参考系统组成。官方说 OpenShell 在 NVIDIA Vera CPU 上提供安全运行边界、默认拒绝和可审计策略；Sentry 在 BlueField-4 DPU 上做带外监控与隔离。它把 Agent 安全从提示词和应用层扩展到执行环境与硬件层。",
    enFact: "NVIDIA announced its Open Agent Safety Platform on September 28. It combines the open-source OpenShell runtime with the NVIDIA Sentry reference design. NVIDIA says OpenShell provides a secure runtime boundary on Vera CPUs with default-deny, policy enforcement, and auditability, while Sentry monitors and can quarantine agents out of band on BlueField-4 DPUs. The proposal moves agent safety beyond prompts and application code into the execution environment and hardware layer.",
    zhValue: "产品的交互对象不是普通消费者，而是开发者、平台团队和安全团队：先给 Agent 一个隔离 sandbox，再按意图授予文件、网络、工具、凭据或 API 权限，最后由策略验证器检查边界，Sentry 作为不依赖 Agent 合作的观察者持续监测。这样做的价值是“权限可以被环境强制”，而不只是要求模型自己遵守。",
    enValue: "The primary users are developers, platform teams, and security teams. They run an agent in an isolated sandbox, grant file, network, tool, credential, or API access by intent, use a policy prover to check the boundary, and add Sentry as an observer that does not depend on the agent cooperating. The value is that authority can be enforced by the environment rather than merely requested from the model.",
    zhHciLens: ["入口：Agent、工具、策略和凭据", "上下文：执行环境、系统调用、访问边界", "动作：允许、拒绝、审批、隔离", "边界：误报、自动批准、策略漂移、硬件依赖"],
    enHciLens: ["Input: agent, tools, policies, credentials", "Context: runtime, syscalls, access boundary", "Action: allow, deny, approve, quarantine", "Boundary: false positives, auto-approval, policy drift, hardware dependency"],
    zhImplication: "Agent 安全产品必须让“为什么被允许”“谁批准了”“这次动作影响什么”可追溯。默认拒绝会增加配置成本，过度收紧会阻塞有用工作，自动批准又会把安全边界变成装饰。对用户而言，最重要的不是看到一个绿色安全徽章，而是在被拒绝、被隔离和需要升级权限时，理解发生了什么并能修复策略。",
    enImplication: "Agent-security products must make it possible to trace why an action was allowed, who approved it, and what it affects. Default deny adds configuration cost; excessive restriction blocks useful work; auto-approval turns the boundary into decoration. The user-facing requirement is not a green safety badge but an understandable recovery path when an action is denied, an agent is quarantined, or a policy needs escalation.",
    visual: visuals.nvidia,
    sources: [source("NVIDIA launch release", urls.nvidiaPress, "official"), source("NVIDIA OpenShell", urls.openShell, "developer docs"), source("NVIDIA technical blog", urls.nvidiaTech, "developer docs"), source("LocalLLM OpenShell test", urls.nvidiaCommunity, "community")],
    dossier: makeDossier({
      productName: "NVIDIA Open Agent Safety Platform: OpenShell + Sentry",
      productType: "这是面向 Agent 开发、平台运营和安全治理团队的运行时安全平台及参考系统设计。OpenShell 是开源安全运行时，Sentry 是运行在 BlueField-4 DPU 上的带外监控/隔离参考设计；它不是一个新的大模型，也不是单独面向消费者的 App。",
      interactionFlow: "开发者把 Agent 放入独立 sandbox，默认不给直接网络权限，并通过策略为它授予所需的文件、工具、服务、凭据或 API 访问。OpenShell 在内核层监控系统调用，并通过 supervisor 通道处理请求；Policy Prover 检查策略边界，Gateway 提供控制面。Sentry 在 Agent 与宿主软件之外观察活动，在越界时触发隔离。",
      specsOrStack: "官方披露 OpenShell、NVIDIA Vera CPU、NVIDIA Sentry、BlueField-4 DPU、DOCA、kernel-level isolation、secure channel、policy prover、gateway、default-deny 和 audit。OpenShell 可扩展到 Arm、Intel 等第三方计算平台；Sentry 的完整硬件交付、部署拓扑、性能、兼容模型/框架、成本与可用地区为 source not stated。",
      useCases: "适用于企业长任务 Agent、代码 Agent、浏览器/工具 Agent、数据处理、机器人系统和需要审计的私有或隔离部署。安全团队可以围绕文件、网络、凭据和 API 设定边界；平台团队可以把相同策略带到云、混合、本地或 air-gapped 环境。它更像组织级控制平面，不是让个人用户直接配置的防火墙 UI。",
      painPointsSolved: "它针对 Agent 会绕过应用层控制、误用凭据、读写超范围文件、访问不该访问的网络和在长任务中逐步漂移的问题。把规则放在 Agent 进程之外，可以减少提示词被诱导或 Agent 自己修改边界的风险。代价是策略设计、误报、自动批准和跨环境一致性会成为新的工程负担。",
      userVoice: "Reddit 上出现了使用本地 Qwen 3 8B 的社区测试，报告没有 OpenShell 时秘密外泄、启用后部分场景被阻断，但自动批准又可能打开新主机；这只是单个社区实验，不是独立安全认证。官方材料确认架构与定位，不能证明所有 Agent、工具和部署都能被同样有效地约束。",
      newTech: "关键技术是把 Agent 的可执行权限从模型推理链路中分离：sandbox 隔离进程，内核过滤系统调用，策略验证器检查边界，带外 Sentry 通过独立硬件观察并可隔离。它把“模型要不要听话”转成“环境允许它做到什么”，并尝试让安全策略跨模型、harness 与部署位置复用。",
      availability: "NVIDIA 已于 2026 年 9 月 28 日公布平台，OpenShell 通过 NVIDIA 开发者页面提供 Get Started、Build、Docs 和 GitHub 入口；Sentry 被描述为参考系统设计。官方没有在本次来源中给出完整商业交付、BlueField-4 采购路径、服务等级或具体地区库存。",
      limitsOrUnknowns: "未知包括策略写法的学习成本、工具语义能否被准确映射、自动批准的默认值、策略更新回滚、硬件监控的覆盖范围、性能开销、跨云迁移、非 NVIDIA 平台等价能力、误报处理、Agent 自我修改、模型欺骗和最终责任归属。它不能自动解决模型撒谎或任务目标本身错误。",
      productVerdict: "这是一个把 Agent 安全变成基础设施控制面的 confirmed product。它的价值在于提供可执行、可审计、可脱离 Agent 合作的边界；它的风险在于组织可能把“有 sandbox”误认为“已经安全”。下一步应看真实案例、策略迁移和带外隔离的独立评测。"
    }, {
      productName: "NVIDIA Open Agent Safety Platform: OpenShell + Sentry",
      productType: "This is an agent-runtime security platform and reference system for developers, platform operators, and security teams. OpenShell is an open secure runtime; Sentry is an out-of-band monitoring and quarantine reference design running on BlueField-4 DPUs. It is not a new foundation model or a consumer app.",
      interactionFlow: "A developer places an agent in an isolated sandbox, denies direct network access by default, and grants only the files, tools, services, credentials, or APIs required by policy. OpenShell monitors system calls at the kernel layer and brokers requests through a supervisor channel; the Policy Prover checks boundaries and the Gateway provides the control plane. Sentry observes outside the agent and host software and can trigger quarantine when behaviour crosses a boundary.",
      specsOrStack: "The official surface names OpenShell, NVIDIA Vera CPUs, NVIDIA Sentry, BlueField-4 DPUs, DOCA, kernel-level isolation, a secure channel, Policy Prover, Gateway, default-deny, and auditability. OpenShell is designed to extend to Arm, Intel, and other compute platforms. Complete Sentry hardware delivery, deployment topology, performance, model/framework compatibility, cost, and regional availability are source not stated.",
      useCases: "The platform fits enterprise long-running agents, coding agents, browser and tool agents, data operations, robotics, and private or air-gapped deployments that require audit. Security teams can set boundaries around files, networks, credentials, and APIs; platform teams can carry policy across cloud, hybrid, on-premises, or isolated environments. It is an organisational control plane rather than a firewall UI for an individual user.",
      painPointsSolved: "It targets agents bypassing application controls, misusing credentials, reading or writing outside their scope, reaching unauthorised networks, and drifting during long tasks. Moving rules outside the agent process reduces dependence on prompts and on the agent voluntarily respecting its boundary. The cost is new engineering work around policy design, false positives, auto-approval, and consistency across environments.",
      userVoice: "A Reddit community test used a local Qwen 3 8B agent and reported secret leakage without OpenShell, partial blocking with it, and new-host access in some auto-approval trials. That is one community experiment, not an independent security certification. The official material confirms architecture and positioning, not equally strong control across every agent, tool, or deployment.",
      newTech: "The central technical move is separating executable authority from the model's reasoning path. A sandbox isolates the process, kernel filters system calls, a policy prover checks the boundary, and out-of-band Sentry observes and can quarantine through independent hardware. The system changes the question from whether the model will obey to what the environment will permit, while aiming to reuse policy across models, harnesses, and deployment locations.",
      availability: "NVIDIA announced the platform on September 28, 2026. OpenShell is exposed through NVIDIA developer pages with Get Started, Build, Docs, and GitHub paths; Sentry is described as a reference system design. The sources reviewed here do not state complete commercial delivery, a BlueField-4 procurement path, service levels, or regional inventory.",
      limitsOrUnknowns: "Open questions include policy-learning cost, whether tool semantics can be mapped accurately, auto-approval defaults, policy rollback, monitoring coverage, performance overhead, cross-cloud migration, equivalent behaviour on non-NVIDIA platforms, false-positive recovery, agent self-modification, model deception, and responsibility. A sandbox does not automatically solve a dishonest model or an incorrect task objective.",
      productVerdict: "This is a confirmed product that turns agent safety into infrastructure control. Its value is an enforceable, auditable boundary that does not depend entirely on agent cooperation; its risk is organisations mistaking a sandbox for complete safety. The next gate is independent evaluation across real cases, policy migration, and out-of-band quarantine."
    })
  }),
  product({
    id: "mongodb-atlas-agent-engine-2026-09-30", section: "global", evidenceLabel: "confirmed product", sourceDate: "2026-09-29",
    evidenceStrength: "MongoDB official launch and Atlas documentation",
    zhHeadline: "MongoDB Atlas Agent Engine：把执行、记忆、检索和治理合成生产栈",
    enHeadline: "MongoDB Atlas Agent Engine packages execution, memory, retrieval, and governance",
    zhFact: "MongoDB 9 月 29 日发布 Atlas Agent Engine，定位是面向生产 Agent 的统一执行、记忆、检索与治理层。它要解决的是原型可以跑、生产难上线的问题：团队不必把向量检索、会话状态、权限、观测和模型框架分别拼起来，再为每次底层变化重写集成。",
    enFact: "MongoDB launched Atlas Agent Engine on September 29 as a unified execution, memory, retrieval, and governance layer for production agents. Its target is the gap between a working prototype and a production system: teams should not have to stitch vector retrieval, session state, permissions, observability, and model frameworks together and then rebuild integrations whenever a lower layer changes.",
    zhValue: "典型流程是把业务数据、上下文和规则放进 Atlas，Agent 通过检索获得可引用的状态，通过工具执行工作，再把长期记忆、审计和治理留在同一数据平台。产品不是单纯“让数据库回答问题”，而是把 Agent 的上下文、动作和监管对象放在同一条可运营链路里。",
    enValue: "The representative flow puts business data, context, and rules in Atlas; the agent retrieves grounded state, acts through tools, and keeps long-term memory, audit, and governance in the same data platform. This is not simply making a database answer questions. It places agent context, actions, and oversight objects on one operational path.",
    zhHciLens: ["入口：业务数据、自然语言目标和工具", "上下文：检索结果、记忆、权限与组织规则", "动作：查询、调用服务、更新数据、生成结果", "边界：数据新鲜度、幻觉、权限继承、审计"],
    enHciLens: ["Input: business data, natural-language goals, tools", "Context: retrieval, memory, permissions, business rules", "Action: query, call services, update data, produce result", "Boundary: freshness, hallucination, inherited authority, audit"],
    zhImplication: "企业 Agent 的用户体验会被数据层决定：如果系统不能说明答案来自哪个数据、记忆何时写入、工具以谁的身份调用，用户就无法判断 Agent 是否真的在业务上下文中工作。统一平台的价值不是隐藏复杂性，而是把数据来源、权限、失败重试和人工审批暴露成同一套可读状态。",
    enImplication: "Enterprise-agent UX is determined by the data layer. If the system cannot show which data grounded an answer, when a memory was written, or whose identity called a tool, the user cannot tell whether the agent worked in business context. A unified platform should not merely hide complexity; it should expose provenance, authority, retries, and human approval as one readable state model.",
    visual: visuals.mongo,
    sources: [source("MongoDB Atlas Agent Engine launch", urls.mongo, "official"), source("MongoDB Atlas Agent Platform docs", urls.mongoDocs, "developer docs")],
    dossier: makeDossier({
      productName: "MongoDB Atlas Agent Engine",
      productType: "Atlas Agent Engine 是 MongoDB 面向生产级 AI Agent 的执行、记忆、检索与治理层。它把 Atlas 数据库及其向量/检索能力、Agent 运行流程和企业治理放在一个平台叙事中，目标客户是需要把 PoC 推向生产的开发与平台团队，而不是普通终端用户。",
      interactionFlow: "开发者接入业务数据、语义模型、工具和组织权限，Agent 在任务执行时从 Atlas 检索相关上下文，调用工具完成动作，并把需要长期保留的记忆和审计对象写回数据层。用户可以在对话或业务界面里提出目标，但官方发布未完整展示最终用户如何查看引用、批准动作、删除记忆或恢复失败步骤。",
      specsOrStack: "官方发布强调 execution、memory、retrieval、governance 的统一层，并说明它服务于生产 Agent。文档入口位于 MongoDB Atlas Agent Platform；本次没有在官方发布中确认具体模型兼容矩阵、Agent harness、向量数据库参数、延迟、SLA、价格、地区、数据驻留或完整权限 API，因此这些均为 source not stated。",
      useCases: "适合支付网络异常调查、客户支持、企业知识检索、运营分析、内部流程自动化和需要把结构化数据与文档上下文结合的 Agent。真实价值在于从同一数据平台读取业务事实、在规则边界内调用服务、留下可审计记录。它不自动保证业务决策正确，也不替代领域专家对高风险动作的批准。",
      painPointsSolved: "它针对 Agent 原型依赖多个拼装组件、记忆和检索容易脱节、权限与观测被遗漏、模型或框架变化导致集成反复重写的问题。统一执行与数据层可以减少系统边界数量，但新的风险是供应商锁定、集中故障、权限继承不清、数据更新延迟和把数据库一致性误认为 Agent 推理可靠性。",
      userVoice: "本次找到的是 MongoDB 官方发布与文档入口，没有找到足以证明生产效果的独立长测、客户上线数据或社区摩擦样本。官方产品描述可以确认定位和功能层级，不能证明某个行业的准确率、节省工时、成本、延迟或治理效果。",
      newTech: "技术信号是把 Agent 的短期上下文、长期记忆、检索 grounding、工具执行和治理对象统一到一个数据库/平台边界内。它把 Agent 从“模型加一堆外部插件”转成可被数据层运营的系统对象；难点在于让记忆可解释、权限可继承但不过度扩散、检索结果可追溯且更新及时。",
      availability: "MongoDB 于 2026 年 9 月 29 日宣布 Atlas Agent Engine，并提供 Atlas Agent Platform 文档入口。发布页没有在本次来源中列出完整 GA/preview 状态、具体地区、价格、购买方式或所有模型/框架的可用性；交付状态需以账号和产品文档为准。",
      limitsOrUnknowns: "未知包括正式 API、支持的模型与 Agent harness、持久记忆删除与隔离、数据驻留、跨租户权限、工具审批、审计导出、索引新鲜度、长任务恢复、性能、成本、锁定和故障转移。统一平台不能替代对错误检索、错误动作和组织规则冲突的人工审查。",
      productVerdict: "Atlas Agent Engine 是一条明确的 enterprise-agent platform 产品线。结论：confirmed product；发布页已经确认执行/记忆/检索/治理的定位，细节和实测仍不足。它能减少拼装成本，但真正的 HCI 竞争点是能否让数据来源、记忆写入、权限和动作审批对业务用户可见。"
    }, {
      productName: "MongoDB Atlas Agent Engine",
      productType: "Atlas Agent Engine is MongoDB's execution, memory, retrieval, and governance layer for production AI agents. It places Atlas data and retrieval capabilities, agent operation, and enterprise governance inside one platform story. Its target is development and platform teams moving proofs of concept into production, not an end-user application.",
      interactionFlow: "A developer connects business data, semantic context, tools, and organisational authority. During a task, the agent retrieves grounded context from Atlas, calls tools, and writes durable memory and audit objects back into the data layer. A user may state a goal through a chat or business UI, but the launch material does not yet show the complete end-user flow for citations, action approval, memory deletion, or step recovery.",
      specsOrStack: "The official launch emphasises a unified execution, memory, retrieval, and governance layer for production agents, with documentation under MongoDB Atlas Agent Platform. The sources reviewed here do not establish a model-compatibility matrix, agent harness, vector parameters, latency, SLA, pricing, regions, data residency, or a complete authority API; these remain source not stated.",
      useCases: "The platform fits payment-network investigation, customer support, enterprise knowledge retrieval, operations analysis, internal workflow automation, and agents that combine structured data with documents. Its value is reading business facts from one platform, calling services within rules, and leaving auditable records. It does not guarantee correct decisions and does not remove the need for domain experts to approve high-risk actions.",
      painPointsSolved: "It targets prototype stacks assembled from disconnected components, memory and retrieval drifting apart, missing permission and observability layers, and repeated integration work when a model or framework changes. A unified execution and data boundary can reduce system boundaries. New risks include vendor lock-in, concentrated failure, unclear inherited authority, stale data, and confusing database consistency with agent reliability.",
      userVoice: "This run found MongoDB's official launch and documentation entry but no independent long-term test, customer deployment data, or community-friction sample strong enough to establish production impact. The official material confirms the position and feature layer, not industry accuracy, hours saved, cost, latency, or governance outcomes.",
      newTech: "The technical signal is unifying short-term context, durable memory, retrieval grounding, tool execution, and governance objects inside a database or platform boundary. This turns an agent from a model plus external plugins into a system object that can be operated through the data layer. The hard problems are explainable memory, authority that is inherited without spreading too far, traceable retrieval, and fresh data.",
      availability: "MongoDB announced Atlas Agent Engine on September 29, 2026 and provides an Atlas Agent Platform documentation path. The launch page reviewed here does not list complete GA or preview status, regions, pricing, purchasing, or availability across every model and harness; account-level documentation remains the availability gate.",
      limitsOrUnknowns: "Open questions include the formal API, supported models and agent harnesses, durable-memory deletion and isolation, data residency, cross-tenant permissions, tool approval, audit export, index freshness, long-task recovery, performance, cost, lock-in, and failover. A unified platform does not replace human review of bad retrieval, bad actions, or conflicting business rules.",
      productVerdict: "Atlas Agent Engine is a clear enterprise-agent platform line. Verdict: confirmed product; the launch confirms execution, memory, retrieval, and governance positioning while detailed behaviour and measurement remain open. It can lower assembly cost, but the HCI competition is whether provenance, memory writes, authority, and action approval remain visible to business users."
    })
  }),
  product({
    id: "microsoft-copilot-home-code-autopilot-2026-09-30", section: "global", evidenceLabel: "confirmed product", sourceDate: "2026-09-25",
    evidenceStrength: "Microsoft official announcement, with independent coverage of the Copilot branding and hardware context",
    zhHeadline: "Microsoft Copilot Home / Code / Autopilot：把工作入口、构建和主动执行分开",
    enHeadline: "Microsoft splits Copilot work into Home, Code, and Autopilot",
    zhFact: "Microsoft 9 月 25 日公布新的 Copilot 结构：Home 把 Chat、Cowork 和 Office 放在起点；Code 让用户构建和运行自己的解决方案；Autopilot 是持续、主动、个性化的 Agent，即使用户离开也会继续工作。它把“问答”“构建”“后台执行”从同一个聊天入口拆成不同工作面。",
    enFact: "Microsoft announced a new Copilot structure on September 25: Home brings Chat, Cowork, and Office together; Code lets people build and run their own solutions; Autopilot is a persistent, proactive, personal agent that continues working when the user is away. The product separates asking, building, and background execution into distinct work surfaces.",
    zhValue: "用户可以从 Home 进入对话、Cowork 或可编辑的 Word、Excel、PowerPoint 工作；复杂需求转到 Code；需要持续跟进的任务交给 Autopilot。设计上它试图让 Agent 的工作对象是文档、表格、演示和业务流程，而不只是聊天消息。真正的体验门槛在于用户能否看出当前是在生成草稿、修改文件、执行代码还是等待批准。",
    enValue: "A user can start in Home with chat, Cowork, or editable Word, Excel, and PowerPoint work; move a more technical request into Code; and hand recurring follow-up to Autopilot. The design makes documents, workbooks, presentations, and business processes the agent's work objects rather than leaving everything as chat messages. The UX threshold is whether users can tell if the system is drafting, editing, running code, or waiting for approval.",
    zhHciLens: ["入口：Home、Code、Autopilot", "上下文：Office 文件、团队数据、代码与流程", "动作：创建、编辑、运行、主动跟进", "边界：审批、品牌信任、权限继承、后台状态"],
    enHciLens: ["Input: Home, Code, Autopilot", "Context: Office files, team data, code, workflows", "Action: create, edit, run, proactively follow up", "Boundary: approval, brand trust, inherited authority, background state"],
    zhImplication: "把不同工作模式拆开有助于降低认知负担，但前提是状态和权限不能被品牌层遮住。用户需要知道 Copilot 正在操作哪个文件、用什么身份、会不会触发外部发送、何时需要批准，以及 Autopilot 何时会再次运行。工作流 Agent 如果只显示“完成”，就会把可编辑性变成不可审计的自动化。",
    enImplication: "Separating work modes can reduce cognitive load, but only if state and authority remain visible beneath the brand layer. Users need to know which file Copilot is changing, under whose identity, whether an external send will happen, when approval is required, and when Autopilot will run again. If a workflow agent shows only done, editability becomes unauditable automation.",
    visual: visuals.microsoft,
    sources: [source("Microsoft Copilot Home, Code, Autopilot", urls.microsoft, "official"), source("Tom's Hardware Copilot branding report", urls.copilotReview, "reviews")],
    dossier: makeDossier({
      productName: "Microsoft Copilot with Home, Code, and Autopilot",
      productType: "这是 Microsoft 对 Copilot 工作入口和能力分层的产品更新。Home 是面向日常工作的起点，Code 是构建/运行解决方案的开发面，Autopilot 是持续主动的个人 Agent；它们依托 Microsoft 365、Windows 和相关企业身份体系，不是三款完全独立的硬件产品。",
      interactionFlow: "用户从 Home 开始，通过 Chat、Cowork 或 Office 编辑器提出目标并处理可编辑产物；需要构建自动化或解决方案时进入 Code；需要系统持续跟进时交给 Autopilot。官方页面没有在本次来源中完整呈现跨入口的任务转移、版本控制、权限请求、外部发送确认、后台通知和人工接管路径。",
      specsOrStack: "官方披露 Home 将 Chat、Cowork 和 Office 放在一起，Code 使用与 GitHub Copilot 相同的底层技术方向，Autopilot 是 persistent、proactive、personal agent。具体模型、Windows/Microsoft 365 版本、Agent 365 管理、数据边界、API、价格、地区和 rollout 范围为 source not stated。",
      useCases: "适合从会议或问题直接生成和编辑 Word、Excel、PowerPoint 产物，构建团队内部小工具或自动化，检查资料并持续跟进项目任务。对产品团队而言，价值是让 Agent 直接产出可编辑的业务对象；对组织而言，风险是同一个身份可以跨文件、代码和外部服务执行多种动作，权限解释必须跟上入口合并。",
      painPointsSolved: "它解决 Copilot 入口分散、聊天回答与真实文档脱节、构建自动化需要切到另一套开发工具、任务不能在用户离开后继续的问题。拆分 Home、Code 和 Autopilot 能让用户选择工作模式，但也可能造成模式边界、权限继承和任务位置分散，增加找回上下文和判断责任主体的成本。",
      userVoice: "Tom's Hardware 报道微软在新设备上弱化 Copilot+ 品牌，说明硬件市场对品牌和体验承诺仍有摩擦，但这不是对 Home、Code 或 Autopilot 功能的直接测评。本次没有找到足够的独立长测来证明后台 Agent 的成功率、误操作率、性能或企业部署反馈。",
      newTech: "新技术信号是把办公套件中的 Agent 工作拆成三个不同的系统角色：Home 负责意图与入口，Code 负责可构建的解决方案，Autopilot 负责持续执行。它让“可编辑产物”和“可运行流程”成为一等对象，但必须同步建设任务版本、审批、权限可视化、撤销和跨应用审计。",
      availability: "Microsoft 已于 2026 年 9 月 25 日发布公告，说明新的 Copilot 能力正在产品线中推出；公告没有给出本次来源所需的完整地区、套餐、具体客户端版本、全部账户资格和 Autopilot 的公开可用时间。可用性应按 Microsoft 账号/租户的实际 rollout 核对。",
      limitsOrUnknowns: "未知包括 Autopilot 的具体触发机制、运行频率、预算、可访问数据范围、通知与批准、失败回滚、Office 变更历史、代码执行隔离、企业管理员控制、离线能力、模型选择和品牌命名是否稳定。媒体对 Copilot+ 的观察不能推导这些功能已经被用户普遍获得。",
      productVerdict: "这是 confirmed product，重点不在又增加一个聊天按钮，而在把办公 Agent 分成入口、构建和主动执行三种责任。它可能降低从想法到可编辑交付物的距离，但必须把后台状态、权限和撤销做成可见系统，否则“工作流自动化”会变成责任自动隐藏。"
    }, {
      productName: "Microsoft Copilot with Home, Code, and Autopilot",
      productType: "This is Microsoft's product-level separation of Copilot work surfaces. Home is the daily-work starting point, Code is the surface for building and running solutions, and Autopilot is a persistent proactive personal agent. They sit across Microsoft 365, Windows, and enterprise identity systems rather than being three independent hardware products.",
      interactionFlow: "The user starts in Home with Chat, Cowork, or Office editors, states a goal, and works with editable artefacts; a more technical request moves into Code; recurring follow-up is handed to Autopilot. The official announcement does not fully show cross-surface task transfer, versioning, authority requests, external-send confirmation, background notification, or human takeover.",
      specsOrStack: "Microsoft says Home brings Chat, Cowork, and Office together; Code uses the same underlying technology direction as GitHub Copilot; and Autopilot is persistent, proactive, and personal. Model, Windows and Microsoft 365 versions, Agent 365 administration, data boundaries, API, pricing, regions, and rollout scope are source not stated.",
      useCases: "The surfaces fit turning a meeting or question into editable Word, Excel, or PowerPoint work, building internal tools or automation, checking material, and following up on project work while the user is away. The product value is making the agent's output a business object that can be edited. The organisational risk is one identity spanning files, code, and external services without an equally clear authority model.",
      painPointsSolved: "The update targets scattered Copilot entry points, chat answers disconnected from real documents, automation that requires another development tool, and tasks that stop when the user leaves. Separating Home, Code, and Autopilot can make the mode choice clearer. It can also fragment context and make it harder to find the task, understand inherited authority, and identify who is responsible.",
      userVoice: "Tom's Hardware reported Microsoft reducing Copilot+ branding on new hardware, showing friction around the brand and experience promise; that is not a direct test of Home, Code, or Autopilot. This run found no independent long-term test strong enough to establish background-agent success, error rate, performance, or enterprise deployment feedback.",
      newTech: "The product signal is making three system roles explicit: Home for intent and entry, Code for buildable solutions, and Autopilot for continued execution. This elevates editable artefacts and runnable workflows above chat messages, but it also requires task versioning, approval, authority visibility, undo, and cross-app audit as first-class platform features.",
      availability: "Microsoft announced the new Copilot capabilities on September 25, 2026 and described them as rolling into the product line. The sources reviewed here do not provide the full region, plan, client version, account eligibility, or public Autopilot availability date. Availability should be checked against the actual Microsoft account or tenant rollout.",
      limitsOrUnknowns: "Open questions include Autopilot triggers, run frequency, budget, data scope, notification and approval, rollback, Office change history, code-execution isolation, enterprise-admin controls, offline behaviour, model choice, and whether the naming remains stable. Hardware coverage of Copilot+ does not prove that these agent surfaces are broadly available.",
      productVerdict: "This is a confirmed product whose meaning is not another chat button but three responsibility modes: entry, construction, and proactive execution. It could shorten the path from intent to an editable deliverable, but only if background state, authority, and undo become visible system behaviour; otherwise workflow automation merely hides responsibility."
    })
  })
];
