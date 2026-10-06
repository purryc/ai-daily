import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const surveyRoot = "/Users/hmi/Documents/Survey";
const date = "2026-10-06";
const previousDate = "2026-10-05";
const dataPath = path.join(root, "data", "issues.json");
const issueDir = path.join(root, date);
const previousIssueDir = path.join(root, previousDate);
const deckDir = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${date}`);
const previousDeck = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${previousDate}`);
const fields = ["productName", "productType", "interactionFlow", "specsOrStack", "useCases", "painPointsSolved", "userVoice", "newTech", "availability", "limitsOrUnknowns", "productVerdict"];

const source = (label, url, type) => ({ label, url, type });
const visual = (file, altZh, altEn, captionZh, captionEn, sourceUrl, kind = "source-backed official page screenshot") => ({
  path: `assets/${file}`, width: 1600, height: 900, kind, altZh, altEn, captionZh, captionEn, sourceUrl
});
const product = (input) => ({ dossierKind: "product", ...input });
const zhTail = "来源未披露的价格、版本、地区、接口、续航、成功率、隐私和交付细节均保留为 source not stated；不能从产品图片或宣传语推断。";
const enTail = "Any price, version, region, interface, battery, success rate, privacy, or delivery detail not disclosed by the cited source remains source not stated; it is not inferred from product imagery or marketing language.";
const dossier = (zh, en) => ({
  zh: Object.fromEntries(fields.map((field) => [field, `${zh[field]} ${zhTail}`])),
  en: Object.fromEntries(fields.map((field) => [field, `${en[field]} ${enTail}`]))
});

const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = issues.find((item) => item.date === previousDate);
if (!previous) throw new Error(`Missing previous issue ${previousDate}`);

const intelVisual = visual(
  "intel-openshell-agent-governance-2026-10-06.png",
  "Intel AI for Enterprise Agent Toolkit 集成 NVIDIA OpenShell 的官方页面截图",
  "Official Intel page showing NVIDIA OpenShell integrated with the AI for Enterprise Agent Toolkit",
  "Intel 官方产品页截图：OpenShell 把文件、网络、进程和凭据策略放到模型上下文之外执行。",
  "Official Intel page screenshot: OpenShell enforces file, network, process, and credential policy outside the model context.",
  "https://www.intel.com/content/www/us/en/newsroom/news/data-center/intel-agent-toolkit-adds-nvidia-openshell-for-policy-enforced-sandboxes.html"
);
const asusVisual = visual(
  "asus-rog-zephyrus-g14-2026-official-2026-10-06.png",
  "ASUS ROG Zephyrus G14 2026 官方产品页截图",
  "ASUS ROG Zephyrus G14 2026 official product-page screenshot",
  "ASUS 官方产品页截图：G14 把 Virtual Assistant、Librarian、语音转写与轻薄硬件放到同一台 Windows AI PC。",
  "ASUS official product-page screenshot: the G14 combines Virtual Assistant, Librarian, transcription, and thin hardware in one Windows AI PC.",
  "https://rog.asus.com/us/laptops/rog-zephyrus/rog-zephyrus-g14-2026-gu405/"
);
const nvidiaVisual = visual(
  "nvidia-rtx-spark-pair-2026-10-06.png",
  "NVIDIA RTX Spark 与 PAIR 本地 Agent 官方博客截图",
  "NVIDIA official blog screenshot of RTX Spark and PAIR for local agents",
  "NVIDIA 官方博客截图：PAIR 把本地网络中的多台 RTX 机器变成可路由的 Agent 推理资源。",
  "NVIDIA official blog screenshot: PAIR routes agent inference across multiple RTX machines on a local network.",
  "https://blogs.nvidia.com/blog/local-ai-ifa-next-gen-agents-nv-pair-rtx-spark/"
);
const metaVisual = visual(
  "meta-ray-ban-display-review-2026-10-06.png",
  "Digital Camera World 对 Meta Ray-Ban Display 的上手评测截图",
  "Digital Camera World hands-on review screenshot of Meta Ray-Ban Display",
  "第三方上手截图：评测观察了 600×600 显示、字幕、翻译、导航与 12MP 相机，但没有完成自己的手机配对。",
  "Third-party hands-on screenshot: the review tested 600x600 display, captions, translation, navigation, and a 12MP camera, but did not complete personal-phone pairing.",
  "https://www.digitalcameraworld.com/tech/its-both-brilliant-and-profoundly-unsettling-at-the-same-time-i-finally-had-a-hands-on-test-of-the-new-meta-ray-ban-display-glasses",
  "source-backed third-party review visual"
);
const wuqiVisual = visual(
  "wuqi-hawk-dolphin-official-2026-10-06.png",
  "物奇微关于移远 Hawk/Dolphin AI+XR 参考设计的官方页面截图",
  "Wuqi Micro official page screenshot of Quectel Hawk/Dolphin AI+XR reference designs",
  "物奇微官方页面截图：Hawk AI+AR 眼镜与 Dolphin 算力单元覆盖光波导、BirdBath 和双架构芯片选型。",
  "Wuqi Micro official page screenshot: Hawk AI+AR glasses and Dolphin compute units cover waveguide, BirdBath, and dual-architecture options.",
  "https://www.wuqi-micro.com/about-wuqi/news-and-events/newss/85"
);

const freshTopics = [
  product({
    id: "intel-openshell-enterprise-agent-governance-2026-10-06",
    section: "official",
    sourceDate: "2026-10-05",
    evidenceLabel: "developer surface",
    evidenceStrength: "Intel official integration announcement plus NVIDIA OpenShell repository; deployment is concrete, while production outcomes remain unverified",
    zhHeadline: "Intel + NVIDIA OpenShell：让 Agent 的每次外联先过策略闸门",
    enHeadline: "Intel + NVIDIA OpenShell puts an enforcement gate beside every agent action",
    zhFact: "Intel 宣布把 NVIDIA OpenShell 作为可选组件接入 AI for Enterprise Agent Toolkit。OpenShell 在 Agent 旁边、模型上下文之外执行文件、网络、进程和凭据策略；默认拒绝的出站规则可以细到程序、主机、HTTP 方法和路径，决策日志独立于 Agent 自己的叙述。它是开发与部署治理面，不是面向消费者的 Agent 产品。",
    enFact: "Intel announced NVIDIA OpenShell as an optional component of the AI for Enterprise Agent Toolkit. OpenShell sits beside the agent and outside the model context, enforcing file, network, process, and credential policies. Default-deny egress can be scoped to program, host, HTTP method, and path, with decision logs independent of the agent's own account. It is a developer and deployment surface, not a consumer agent product.",
    zhValue: "它把 Agent 安全从提示词和事后日志推进到动作发生前的执行层。一个排障 Agent 即使判断正确，也可能把带 token 的日志贴到外部服务；OpenShell 让管理员在网络请求离开前决定允许、拒绝、记录或注入仅绑定到批准端点的凭据。对企业用户，核心体验是失败原因可见、权限边界可审计、Agent 不需要直接持有秘密。",
    enValue: "It moves agent safety from prompts and after-the-fact transcripts to the enforcement layer before an action leaves. A troubleshooting agent can reason correctly and still post a token-bearing log to an outside service; OpenShell lets administrators allow, deny, log, or inject a credential bound to an approved endpoint before the request exits. For enterprise users, the product experience is visible failure, auditable boundaries, and agents that never hold raw secrets.",
    zhImplication: "验收重点不应是 Agent 能不能完成一次 happy path，而是它试图访问未授权主机、读取未授权文件、调用未批准方法或更换模型时是否被拒绝并留下可读原因。还要测试策略变更前的人工审查、凭据替换、模型预算和断网后的恢复。OpenShell 的开关默认关闭，部署要求 Agent Sandbox 与认证配置同时开启，配置复杂度本身也是产品摩擦。",
    enImplication: "Acceptance should not stop at a happy-path task. Test whether an agent is denied with a readable reason when it reaches an unapproved host, reads an unapproved file, calls an unapproved method, or switches providers. Also test human review before policy changes, credential substitution, model budgets, and recovery after network loss. OpenShell is off by default, and deployment requires Agent Sandbox plus an explicit authentication mode, so configuration complexity is itself product friction.",
    visual: intelVisual,
    sources: [
      source("Intel OpenShell integration announcement", "https://www.intel.com/content/www/us/en/newsroom/news/data-center/intel-agent-toolkit-adds-nvidia-openshell-for-policy-enforced-sandboxes.html", "official"),
      source("NVIDIA OpenShell repository and runtime", "https://github.com/NVIDIA/OpenShell", "developer docs"),
      source("Intel Enterprise Agent Toolkit", "https://github.com/intel/enterprise-agent-toolkit", "developer docs"),
      source("OpenShell integration guide", "https://github.com/intel/enterprise-agent-toolkit/blob/main/docs/openshell.md", "developer docs")
    ],
    dossier: dossier({
      productName: "Intel AI for Enterprise Agent Toolkit 是面向企业部署 Agent 的组合式工具栈，10 月 5 日的更新把 NVIDIA OpenShell 接成可选治理层。OpenShell 本身是 Apache-2.0 开源运行时，负责沙箱、策略、凭据和出站网络控制。用户购买或部署的不是一个聊天界面，而是一套让 Agent 在可审计边界内读文件、调 API、调用模型和完成任务的系统组件。",
      productType: "产品类型是 enterprise agent runtime / governance developer surface。Intel 的工具栈提供 sandbox controller、GenAI Gateway、推理、memory、observability 与部署脚本；OpenShell 增加 gateway、supervisor、filesystem/network/process rules、provider access 和 YAML policy。它可以与 Kubernetes Agent Sandbox API、LiteLLM、vLLM 或 SGLang 等组件协作。产品面向平台工程、IT、安全和模型运营团队，普通用户不会直接操作它。",
      interactionFlow: "管理员先完成硬件、SSH、DNS/TLS 与基础工具栈前置条件，在 agentic-config.cfg 中同时打开 deploy_openshell=on 与 deploy_agent_sandbox=on，选择认证模式，再运行 deploy-agentic-stack.sh。之后每个 Agent 在 sandbox 内工作，文件系统访问、进程调用和外联网络都通过 supervisor 与 policy engine；请求被允许、拒绝、记录或附加端点绑定凭据。策略变更需要在真正应用前被检查，用户侧看到的是任务成功、阻断原因和审计记录。",
      specsOrStack: "Intel 官方披露的栈包括 Kubernetes Agent Sandbox controller、OpenShell gateway、sandbox supervisor、GenAI Gateway、LiteLLM、Intel Xeon 上的 vLLM 或 SGLang、YAML policy 与 dedicated model key。OpenShell 还支持 Linux、Apple Silicon macOS，Windows WSL2 为 experimental；上游文档说明可通过 kernel-level enforcement 限制文件、系统调用和网络。部署性能、延迟、支持的模型数量、日志保留和企业 SLA 均为 source not stated。",
      useCases: "具体用例是让 triage agent 读取 nightly job 日志、定位内部服务 timeout、调用批准的分析 API，并阻止带 secret 的 stack trace 被发往未授权 paste service。企业也可用它限制 coding agent 的仓库、部署 agent 的云端 API、研究 agent 的数据目录和客服 agent 的第三方连接。Intel 的例子证明了治理路径，不证明所有行业规则已经有现成模板，也不证明模型判断本身正确。",
      painPointsSolved: "它解决 Agent 能做什么与管理员能验证什么之间的断层。容器隔离只防止越出运行环境，prompt guardrail 仍处在模型上下文内，普通网络规则又通常只控制是否能上网；OpenShell 把控制点放到程序、主机、方法和路径级别，凭据不直接交给 Agent，决策日志独立保存。它没有消除策略设计错误、误拒绝、策略维护成本、供应商差异和任务本身的模型风险。",
      userVoice: "公开材料主要是 Intel 的集成文章、GitHub 文档和上游 OpenShell README，没有足够独立的企业长期部署评测。官方给出的价值是默认拒绝、端点绑定凭据、独立决策日志和单独模型计量；这些是产品能力声明，不是所有企业在真实权限迁移中都能无摩擦获得的结果。应把它标为 developer surface，并继续观察 issue、升级路径和实战回退经验。",
      newTech: "新技术点在于把策略执行点放在模型上下文之外，并与 kernel-level sandbox、形式化检查、provider credential injection 和独立 gateway accounting 组合。上游 OpenShell 还描述在策略变更批准前检查新增访问风险。Intel 的集成复用了既有 Agent Sandbox、proxy、inference gateway 和部署框架，降低了迁移成本，但也意味着策略质量、组件版本和运维能力决定了真实效果。",
      availability: "Intel 官方文章、企业工具栈和 OpenShell GitHub 仓库均已公开，OpenShell 在 Intel 工具栈中是可选组件而非强制默认项。部署走 QuickStart 与 deploy-agentic-stack.sh，要求满足前置环境并显式启用相关开关。上游 README 支持 Linux、Apple Silicon macOS 与实验性的 Windows WSL2；公开资料没有托管版价格、商业支持等级、各地区服务和生产认证清单。",
      limitsOrUnknowns: "未知包括策略编写难度、误阻断后的用户恢复、跨云网络的观测完整性、GPU/模型请求的计费粒度、敏感数据日志脱敏、策略版本回滚、不同 Kubernetes 发行版的兼容性和性能开销。默认关闭说明治理层仍需组织主动接入；把‘请求被拦截’当成安全完成也不对，用户仍需要知道被拦截后如何改目标或手动接管。",
      productVerdict: "OpenShell 是具体的 developer surface，值得作为企业 Agent 的最小控制面跟踪。产品判断：它把‘模型说自己做了什么’与‘系统实际允许了什么’分开，向可验证的权限和网络状态迈了一步。下一关是把 YAML、日志和策略变成平台工程师与终端用户都能理解的反馈，并用真实任务证明阻断不会让 Agent 变得不可用。"
    }, {
      productName: "Intel's AI for Enterprise Agent Toolkit is a composable enterprise deployment stack, and its October 5 update makes NVIDIA OpenShell an optional governance layer. OpenShell is an Apache-2.0 runtime for sandboxes, policy, credentials, and egress control. The delivered product is not a chat surface; it is a system that lets agents read files, call APIs, use models, and complete work inside auditable boundaries.",
      productType: "The product is an enterprise-agent runtime and governance developer surface. Intel's toolkit provides a sandbox controller, GenAI Gateway, inference, memory, observability, and deployment scripts; OpenShell adds a gateway, supervisor, filesystem/network/process rules, provider access, and YAML policy. It can work with the Kubernetes Agent Sandbox API, LiteLLM, vLLM, and SGLang. Platform engineering, IT, security, and model-operations teams use it; ordinary users do not operate it directly.",
      interactionFlow: "An administrator completes hardware, SSH, DNS/TLS, and base-toolkit prerequisites, sets deploy_openshell=on and deploy_agent_sandbox=on in agentic-config.cfg with an explicit authentication mode, and runs deploy-agentic-stack.sh. An agent then works inside a sandbox; filesystem access, process calls, and network egress pass through the supervisor and policy engine. A request is allowed, denied, logged, or given an endpoint-bound credential. Policy changes are checked before application, while the user-facing state is task success, a block reason, and an audit record.",
      specsOrStack: "Intel names the Kubernetes Agent Sandbox controller, OpenShell gateway, sandbox supervisor, GenAI Gateway, LiteLLM, vLLM or SGLang on Intel Xeon, YAML policy, and a dedicated model key. OpenShell also describes kernel-level enforcement for files, system calls, and network connections; its upstream support matrix covers Linux and Apple-Silicon macOS, with Windows WSL2 experimental. Deployment performance, latency, supported-model count, log retention, and enterprise SLA are source not stated.",
      useCases: "A concrete example asks a triage agent to read a nightly-job log, identify an internal-service timeout, call an approved analysis API, and stop a token-bearing stack trace from reaching an unapproved paste service. Enterprises can similarly constrain a coding agent's repository, a deployment agent's cloud APIs, a research agent's data directories, or a support agent's third-party connections. The example proves a governance path, not that every industry policy has a ready template or that the model's diagnosis is correct.",
      painPointsSolved: "The system addresses the gap between what an agent can do and what an administrator can verify. Container isolation stops escape but not exfiltration, prompt guardrails share context with injected instructions, and ordinary network rules usually only say whether a workload can reach the internet. OpenShell scopes controls to program, host, method, and path, keeps raw credentials from the agent, and stores an independent decision log. It does not remove policy mistakes, false denials, maintenance cost, provider differences, or model risk.",
      userVoice: "The public evidence is Intel's integration article, GitHub documentation, and the upstream OpenShell README; this run found no independent long-term enterprise deployment review. Default-deny egress, endpoint-bound credentials, independent decision logs, and separate model accounting are official capability claims, not proof that every organisation will migrate permissions without friction. The item should remain a developer surface while issues, upgrade paths, and field rollback experience accumulate.",
      newTech: "The technical move is to put enforcement outside the model context and combine it with kernel-level sandboxing, policy-change verification, provider credential injection, and independent gateway accounting. Upstream OpenShell also describes checking risky new access before a policy change is approved. Intel reuses the existing Agent Sandbox, proxy, inference gateway, and deployment framework, lowering migration cost while making policy quality, versioning, and operations decisive to the actual experience.",
      availability: "Intel's article, enterprise toolkit, and OpenShell GitHub repository are public, and OpenShell is an optional component rather than a mandatory default inside the Intel toolkit. Deployment uses the QuickStart and deploy-agentic-stack.sh after prerequisites are met and the flags are enabled. The upstream README supports Linux and Apple-Silicon macOS and calls Windows WSL2 experimental. Hosted pricing, commercial-support tiers, regional service, and a production-certification list are source not stated.",
      limitsOrUnknowns: "Open questions include policy-authoring difficulty, user recovery after a false denial, observability across cloud networks, GPU and model billing granularity, sensitive-data redaction in logs, policy rollback, Kubernetes compatibility, and performance overhead. Off-by-default also means an organisation must actively adopt the governance layer. A blocked request is not the same as a safe task outcome; the user still needs to know how to change the goal or take over manually.",
      productVerdict: "OpenShell is a concrete developer surface worth tracking as a minimum control plane for enterprise agents. Verdict: it separates what the model says it did from what the system actually permitted, moving toward verifiable permission and network state. The next gate is making YAML, logs, and policy decisions legible to both platform engineers and end users, then proving with real tasks that blocking does not make agents unusable."
    })
  }),
  product({
    id: "asus-rog-zephyrus-g14-2026-virtual-assistant-2026-10-06",
    section: "official",
    sourceDate: "2026-10-05 current review and official page sweep",
    evidenceLabel: "confirmed product",
    evidenceStrength: "ASUS official product page plus independent hands-on review; model-specific regional pricing varies",
    zhHeadline: "ASUS ROG Zephyrus G14 2026：本地 AI PC 把助手、文档与游戏塞进一台薄机",
    enHeadline: "ASUS ROG Zephyrus G14 2026 makes local AI part of a thin gaming PC",
    zhFact: "ASUS 2026 G14 官方页面把 Virtual Assistant、Librarian 文档理解和语音转写放进一台 Windows 11 笔记本；页面披露部分配置采用 Intel Core Ultra 9 386H、最高 50 TOPS NPU、73Wh 电池、3.48 磅机身、0.72 英寸厚度和 Wi-Fi 7。Tom's Guide 的上手评测还测试了本地 Hermes Agent，但独立评测成绩不能扩展到所有 SKU。",
    enFact: "ASUS's 2026 G14 page puts Virtual Assistant, Librarian document understanding, and voice transcription inside a Windows 11 laptop. The regional specifications page lists configurations with Intel Core Ultra 9 386H, up to a 50-TOPS NPU, a 73Wh battery, a 3.48-pound chassis, 0.72-inch thickness, and Wi-Fi 7. A Tom's Guide hands-on also tried a local Hermes Agent, but review results do not generalise to every SKU.",
    zhValue: "G14 的产品信号不是又一个 AI 聊天框，而是把本地 Agent 作为游戏、创作和移动生产力机器的一部分。用户可在熟悉的 Windows 应用环境里让 Virtual Assistant 帮忙导航陌生程序，让 Librarian 总结文档上下文，让语音转写把会议或录音变成要点；本地运行降低了敏感文件离开设备的需求，但体验取决于模型、功耗和软件整合。",
    enValue: "The product signal is not another AI chat box but a local agent embedded in a gaming, creative, and mobile productivity machine. Within a familiar Windows environment, Virtual Assistant can help navigate unfamiliar programs, Librarian can summarise document context, and transcription can turn meetings or voice memos into key points. Local execution can reduce the need to send sensitive files away, but the experience depends on model choice, power, and software integration.",
    zhImplication: "验收应把 AI 能力和移动硬件放在同一条流程里：打开大型文档、切换游戏/创作应用、断网、拔电、唤醒助手，再观察系统是否解释当前模型在哪里运行、消耗多少资源、失败后怎样回到原应用。3.48 磅和 73Wh 解决的是携带与供电约束，不能直接证明全天 Agent 续航；Virtual Assistant 的权限、日志和本地/云端边界仍需实测。",
    enImplication: "Acceptance should test AI and mobility as one loop: open a large document, switch between game and creative apps, go offline, unplug power, invoke the assistant, and observe whether the system explains where the model runs, what resources it consumes, and how failure returns the user to the original app. A 3.48-pound chassis and 73Wh battery address portability and power constraints but do not prove all-day agent use; permission, logging, and local/cloud boundaries still need testing.",
    visual: asusVisual,
    sources: [
      source("ASUS ROG Zephyrus G14 2026 product page", "https://rog.asus.com/us/laptops/rog-zephyrus/rog-zephyrus-g14-2026-gu405/", "official"),
      source("ASUS Singapore G14 2026 specification page", "https://rog.asus.com/sg/laptops/rog-zephyrus/rog-zephyrus-g14-2026-gu405/spec/", "official"),
      source("Tom's Guide G14 2026 review", "https://www.tomsguide.com/computing/gaming-laptops/asus-rog-zephyrus-g14-2026-review", "reviews")
    ],
    dossier: dossier({
      productName: "ROG Zephyrus G14 (2026) GU405 是 ASUS 面向游戏、创作与移动生产力的轻薄 Windows AI PC。产品页把 Virtual Assistant、Librarian 和语音转写列为软件能力，硬件则把高性能 CPU/GPU、NPU、OLED 显示和大量端口压进 14 英寸级机身。它是已经公开销售路径的具体整机，不是概念 AI PC。​",
      productType: "产品类型是 thin-and-light gaming laptop with an integrated AI assistant surface。ASUS 的页面同时展示游戏、创作、文档总结、会议转写、AI noise cancellation 和 Armoury Crate 管理。不同配置会改变处理器、GPU、内存、存储、显示和价格；因此一个 SKU 的 NPU 或电池表现不能被扩展到全部 G14。",
      interactionFlow: "用户像使用普通 Windows 笔记本一样打开应用、文档或会议录音，然后通过 Virtual Assistant 的智能聊天、Librarian 或语音转写入口请求帮助。助手可以解释陌生程序、总结大文档的内容与上下文、把会议或 voice memo 转成要点；Slash Lighting 还能对 Virtual Assistant 行动给出灯效反馈。官方页面没有公开完整的确认、撤销、权限、后台任务状态和失败恢复流程。",
      specsOrStack: "ASUS 官方页面披露 Windows 11、部分区域 SKU 的 Intel Core Ultra 9 386H、16 核/16 线程、最高 50 TOPS NPU、73Wh 电池、0.72 英寸、3.48 磅、Wi-Fi 7、Thunderbolt 4/USB-C DisplayPort 2.1、HDMI 2.1、UHS-II SD 卡槽和 0–50% 约 30 分钟快充。模型、运行位置、内存/存储组合、端到端延迟和 AI 订阅均需按 SKU 核对。",
      useCases: "具体场景包括玩家在游戏和创作应用之间移动、内容创作者总结素材或大文档、学生和研究者整理长文件、会议后把录音转成要点，以及在不熟悉软件时询问操作路径。Tom's Guide 还描述了在这类硬件上运行本地 Hermes Agent 的体验。它适合作为本地 AI 工作站候选，但不等于所有模型、插件和办公软件都已针对 NPU 优化。",
      painPointsSolved: "它针对移动创作设备的三类痛点：性能与便携性冲突、AI 助手必须另开网页或 App、以及长文档和会议内容难以快速压缩。把助手与 NPU、GPU、摄像头、麦克风、显示和 Armoury Crate 放到同一系统，可减少切换成本。代价是高性能硬件、风扇、重量、续航和软件更新共同决定体验，轻薄机身没有自动消除热与电量问题。",
      userVoice: "Tom's Guide 提供了独立上手，认为 G14 的游戏、创作和 AI 性能很强但有成本，并实际运行了本地 Hermes Agent；ASUS 官方页面则提供 Virtual Assistant、Librarian、转写和硬件参数。评测是单机体验，不代表所有地区 SKU、驱动、模型和电池状态；公开材料也没有长期本地 Agent 续航或错误率数据。",
      newTech: "新技术组合是把 NPU、GPU 和 Windows AI PC 应用放在同一台轻薄游戏设备上，并用 Virtual Assistant、Librarian、转写与灯效反馈把模型结果嵌进系统工作流。它的创新更偏整合：同一设备既跑本地 Agent、游戏和创作，又通过端口与高速网络接入外设。真正的差异需要看模型是否能自动选择 NPU/GPU、任务是否可撤销，以及软件更新是否持续支持。",
      availability: "ASUS 已公开美国产品页和新加坡具体规格/购买路径，价格、库存和配置随地区变化；页面列出了多种 GU405 型号。产品是现有整机产品，Virtual Assistant 等能力由 ASUS 页面明确展示，但不同区域、语言、账号和软件版本的开放范围仍需以实际设备为准。公开资料没有统一的全球发售时间或所有地区 AI 服务清单。",
      limitsOrUnknowns: "未知包括 Virtual Assistant 的模型来源与联网方式、Librarian 的文件保留、NPU 调度、GPU 高负载时的风扇与电池、摄像头/麦克风权限、离线能力、失败提示、语音语言、订阅、第三方工具调用和长期驱动支持。官方规格能证明硬件存在，不能证明本地 Agent 在所有工作流中都能稳定闭环。",
      productVerdict: "G14 2026 是 confirmed product，价值在于把 AI PC 变成一台真实可携带的混合工作设备。产品判断：ASUS 已把助手、文档与转写放入硬件产品叙事，但用户是否得到更少的切换和更少的云上传，取决于软件边界与功耗管理。下一关是按 SKU 实测本地/云端路径、断网行为和电池成本，而不是只看 NPU TOPS。"
    }, {
      productName: "The ROG Zephyrus G14 (2026) GU405 is ASUS's thin Windows AI PC for gaming, creation, and mobile productivity. Its product page presents Virtual Assistant, Librarian, and voice transcription alongside high-performance CPU/GPU, an NPU, OLED display, and a full port set in a 14-inch-class chassis. It has a concrete retail path; it is not an AI-PC concept.",
      productType: "The product is a thin-and-light gaming laptop with an integrated AI-assistant surface. ASUS presents gaming, creation, document summarisation, meeting transcription, AI noise cancellation, and Armoury Crate management together. Configuration changes processor, GPU, memory, storage, display, and price, so one SKU's NPU or battery behaviour cannot be generalised across the G14 family.",
      interactionFlow: "A user opens an application, document, or recording as on a normal Windows laptop and invokes Virtual Assistant, Librarian, or transcription. The assistant can explain an unfamiliar program, summarise the content and context of a large document, or turn a meeting or voice memo into key points; Slash Lighting can also react to Virtual Assistant actions. The public page does not show complete confirmation, undo, permission, background-task state, or failure-recovery flows.",
      specsOrStack: "ASUS discloses Windows 11, and the regional specification page lists selected SKUs with an Intel Core Ultra 9 386H, 16 cores and 16 threads, up to a 50-TOPS NPU, 73Wh battery, 0.72-inch thickness, 3.48-pound weight, Wi-Fi 7, Thunderbolt 4/USB-C with DisplayPort 2.1, HDMI 2.1, a UHS-II SD reader, and roughly 0-to-50% charging in 30 minutes. Model, runtime location, memory/storage, latency, and AI subscription must be checked per SKU.",
      useCases: "Concrete scenarios include moving between games and creative applications, summarising research or production documents, converting meetings into notes, and asking for help when a user does not know an unfamiliar program. Tom's Guide also describes running a local Hermes Agent on the class of machine. The laptop is a candidate local AI workstation, but the sources do not establish that every model, plugin, or office application is NPU-optimised.",
      painPointsSolved: "The machine targets three problems: the portability/performance trade-off, the need to open a separate web app for assistance, and the time required to compress long documents and meetings. Placing the assistant alongside NPU, GPU, camera, microphone, display, and Armoury Crate can reduce switching. The trade-off is that high-performance hardware, fans, weight, battery, and software updates jointly shape the experience; a thin chassis does not remove thermal or power limits.",
      userVoice: "Tom's Guide provides an independent hands-on, describing strong gaming, creation, and AI performance with a cost, and trying a local Hermes Agent; ASUS supplies the Virtual Assistant, Librarian, transcription, and hardware disclosures. The review is one-machine evidence, not a statement about every regional SKU, driver, model, or battery condition. Public sources do not provide long-term local-agent battery or error-rate data.",
      newTech: "The technical combination is an NPU/GPU Windows AI PC with Virtual Assistant, Librarian, transcription, and lighting feedback embedded in the system workflow. Its differentiation is integration: one portable device runs local agents, games, and creative work while connecting to displays and peripherals. The real test is whether software chooses NPU versus GPU appropriately, tasks can be undone, and updates maintain support, rather than the TOPS number alone.",
      availability: "ASUS publishes a U.S. product page and a Singapore specification and purchase path, with models and prices varying by region. The GU405 family is a concrete laptop product, and ASUS explicitly presents its assistant functions, but availability by language, account, region, and software version must be checked on the actual device. A single global launch date and complete regional AI-service matrix are source not stated.",
      limitsOrUnknowns: "Open questions include the assistant's model and network path, Librarian retention, NPU scheduling, fan and battery behaviour under GPU load, camera and microphone permissions, offline capability, failure feedback, voice languages, subscription, third-party tools, and driver support. Hardware specifications prove that components exist; they do not prove that local agents close every workflow reliably.",
      productVerdict: "The G14 2026 is a confirmed product whose value is making the AI PC a genuinely portable mixed-work machine. Verdict: ASUS has put assistant, documents, and transcription into the hardware story, but less switching and less cloud upload depend on software boundaries and power management. The next gate is per-SKU testing of local/cloud paths, offline behaviour, and battery cost—not another NPU benchmark."
    })
  }),
  product({
    id: "meta-ray-ban-display-hands-on-review-2026-10-06",
    section: "reviews",
    sourceDate: "2026-10-03 review / 2026-10-06 follow-up",
    evidenceLabel: "review/community friction",
    evidenceStrength: "Independent hands-on review plus Meta's official availability and feature update; reviewer did not complete personal-phone pairing",
    zhHeadline: "Meta Ray-Ban Display 上手：字幕很有说服力，手机配对仍未被证明",
    enHeadline: "Meta Ray-Ban Display hands-on: captions convince, full phone pairing remains unproven",
    zhFact: "Digital Camera World 的上手文章观察到 Meta Ray-Ban Display 的 600×600 显示、实时字幕、翻译、导航、12MP 相机和手势缩放；评测称显示比只听语音更容易确认系统是否理解。评测是在受控演示中完成，作者没有把眼镜连接到自己的手机，因此完整的个人工作流、配对、续航和长期隐私体验仍未知。",
    enFact: "Digital Camera World's hands-on observed the Meta Ray-Ban Display's 600x600 display, live captions, translation, navigation, a 12MP camera, and gesture zoom. The reviewer found a visual layer easier to verify than an audio-only assistant. The test was a controlled demo and did not connect the glasses to the reviewer's own phone, so complete personal workflow, pairing, battery, and long-term privacy remain unknown.",
    zhValue: "这次上手把显示眼镜的价值落在一个很具体的交互问题上：用户不需要猜 AI 是否听懂，字幕、翻译和导航可以直接作为可见状态。Meta 官方同时宣布 Ray-Ban Display 扩大线上订购并进入英国、加拿大、法国、意大利和德国。产品仍处于早期规模化阶段，真正的门槛是信息是否在移动中保持可读、是否能在错误时退出，以及旁人如何理解拍摄与显示。",
    enValue: "The hands-on grounds the value of display glasses in a concrete interaction problem: users do not have to guess whether the AI understood them when captions, translation, and navigation become visible state. Meta also announced online ordering and expansion to the U.K., Canada, France, Italy, and Germany. The product is entering early scale; the real gates are readability in motion, recovery when it is wrong, and how bystanders interpret capture and display.",
    zhImplication: "验收应把 demo 的惊喜拆成一条连续任务：从手机配对开始，读取字幕，切换导航，查看相片，遇到翻译错误时暂停，再观察提示是否遮挡真实环境。评测的最大限制——没有自己的手机——本身就是产品事实：没有完成配对，就不能把受控演示升级成日常可用性。还应单独测量 600×600 信息层在不同光线和视野中的疲劳。",
    enImplication: "Acceptance should turn the demo into a continuous task: pair the phone, read captions, switch to navigation, review a photo, pause after a translation error, and observe whether prompts occlude the real scene. The biggest limitation of the review—no personal-phone pairing—is itself product evidence: a controlled demo cannot be upgraded into daily usability. Teams should also measure fatigue and information hierarchy across light conditions and the 600x600 visual layer.",
    visual: metaVisual,
    sources: [
      source("Digital Camera World Meta Ray-Ban Display hands-on", "https://www.digitalcameraworld.com/tech/its-both-brilliant-and-profoundly-unsettling-at-the-same-time-i-finally-had-a-hands-on-test-of-the-new-meta-ray-ban-display-glasses", "reviews"),
      source("Meta Connect 2026 product and availability update", "https://about.fb.com/news/2026/09/the-biggest-news-from-connect-2026/", "official"),
      source("Meta Ray-Ban Display product page", "https://www.meta.com/smart-glasses/meta-ray-ban-display/", "official")
    ],
    dossier: dossier({
      productName: "Meta Ray-Ban Display 是带有近眼显示、相机、音频和 AI 交互的智能眼镜。Digital Camera World 在受控上手中测试了字幕、翻译、导航、照片预览和手势缩放；Meta 官方则确认扩大在线订购并进入更多欧洲国家与加拿大。它是具体产品与评测对象，但本次评测没有完成个人手机配对。",
      productType: "产品类型是 display-equipped AI smart glasses。与没有显示的 Ray-Ban Meta 不同，它把一个 600×600 的可见信息层、12MP 相机、音频、手势输入和 Meta AI 组合在普通眼镜形态中。显示用来承载字幕、翻译、导航、照片预览和状态确认；官方没有在公开页面把所有模型、处理位置、眼动、应用 API 和续航细节一次列全。",
      interactionFlow: "用户佩戴眼镜，通过语音、相机和手势请求 AI 或相机功能；实时字幕和翻译直接出现在视野中，导航可以提示方向，用户也能在不拿手机时查看照片。评测中还观察到用手腕/手势进行相机缩放。完整产品应包含手机配对、权限、录制提示、错误解释、暂停、摘戴恢复和人工接管，但本次受控演示没有走完这些环节。",
      specsOrStack: "第三方评测披露 600×600 显示与 12MP 相机，并描述字幕、翻译、导航和照片预览；Meta 官方披露在线订购与英国、加拿大、法国、意大利和德国扩展，以及后续 hands-free navigation、personalized hologram 与空间音频捕捉更新。芯片、重量、续航、视场角、眼盒、显示亮度、OS、API、模型运行位置和价格均需以具体地区 SKU 页面为准。",
      useCases: "具体场景包括在对话中看实时字幕、把菜单或标识翻译成自己的语言、在陌生城市获得方向提示、查看刚拍摄的照片，以及在不拿手机时确认系统状态。它适合把短句和状态放入环境中的用户；长文本、强光、快速移动、多人对话、隐私敏感空间和复杂手机任务仍未被这次短时演示证明。",
      painPointsSolved: "显示层解决纯音频 Agent 的可验证性：用户可以看到字幕和翻译，而不是只听见一个可能理解错误的回答；照片预览减少反复掏手机，导航可以保持 heads-up。相机和显示同时提高了旁人隐私、视觉遮挡、注意力与疲劳的风险。眼镜还需要手机、网络和账号协同，不能把‘少拿手机’写成‘不依赖手机’。",
      userVoice: "评测者认为显示带来了比纯语音更安心的确认体验，并称字幕和菜单翻译有未来感；同时也提出自己还需要更长时间才能判断它是否比无显示眼镜或早期 Google Glass 更有用。评测没有连接私人手机，属于 hands-on signal，不是完整的耐用、续航、隐私或普遍可用性证明。",
      newTech: "新技术点在于把 AI 输出从耳朵拉到视野：字幕、翻译、导航、照片预览与动态提示成为可见反馈，并与相机、手势和音频整合。显示器的价值不是像手机一样承载所有内容，而是提供低字数、高确认度的即时状态。真正的产品创新还要看系统如何管理眼盒、信息层级、旁人可见性和错误恢复。",
      availability: "Meta 官方称 Ray-Ban Display 通过在线订购向更多人开放，并扩展到英国、加拿大、法国、意大利和德国；具体 SKU、等待时间、配对手机、地区语言和功能 rollout 仍需当地商品页核对。第三方评测只说明获得了受控体验，不说明该批次已经普遍可购或所有软件功能已经同步开放。",
      limitsOrUnknowns: "未知包括个人手机配对、真实续航、热、长时间视觉疲劳、强光可读性、视野遮挡、显示延迟、手势误触、相机与云端数据边界、旁人提示、处方适配、售后和应用开发接口。评测没有把设备带入自己的日常环境，因此不能据此确认旅行、会议、通勤或全天佩戴表现。",
      productVerdict: "Meta Ray-Ban Display 是产品已出现、体验证据仍不完整的 review/community friction item。产品判断：字幕和翻译证明显示层能让 AI 更可验证，评测对手机配对的缺失则提醒我们不能把发布会 demo 当作完整 workflow。下一关是个人设备闭环、移动可读性、隐私反馈和失败时的手动接管。"
    }, {
      productName: "Meta Ray-Ban Display is an AI smart-glasses product with near-eye display, camera, audio, and AI interaction. Digital Camera World tested captions, translation, navigation, photo review, and gesture zoom in a controlled hands-on; Meta officially confirmed online ordering and expansion into more European countries and Canada. It is a concrete product and review subject, but the review did not complete personal-phone pairing.",
      productType: "The product is display-equipped AI smart glasses. Unlike Ray-Ban Meta without a display, it combines a 600x600 visual layer, a 12MP camera, audio, gesture input, and Meta AI in an ordinary-eyewear form. The display carries captions, translation, navigation, photo preview, and state confirmation. Public pages do not expose every model, processing location, eye-tracking, app API, and battery detail in one place.",
      interactionFlow: "The wearer uses voice, camera, and gestures to ask for AI or camera functions; live captions and translations appear in view, navigation provides directions, and photos can be reviewed without reaching for the phone. The review observed wrist or gesture zoom. A finished product also needs pairing, permission, recording indicators, error explanation, pause, removal recovery, and takeover flows, but this controlled demo did not exercise them end to end.",
      specsOrStack: "The review reports a 600x600 display and 12MP camera and describes captions, translation, navigation, and photo preview. Meta discloses online ordering, expansion to the U.K., Canada, France, Italy, and Germany, and updates including hands-free navigation, a personalised hologram, and spatial-audio capture. Chip, weight, battery, field of view, eyebox, brightness, OS, API, model location, and price require the regional SKU page.",
      useCases: "Concrete scenarios include reading live captions in a conversation, translating a menu or sign, following directions in an unfamiliar city, reviewing a new photo, and checking system state without taking out a phone. It fits short text and state feedback embedded in the environment; long text, bright light, fast movement, multi-person conversation, sensitive spaces, and complex phone tasks remain unproven by this short demo.",
      painPointsSolved: "The display addresses the verifiability problem of an audio-only agent: a user can see captions and translation rather than only hear a possibly wrong response; photo preview reduces phone checking, and navigation preserves heads-up attention. The camera and display also increase bystander privacy, occlusion, attention, and fatigue risks. The glasses still require phone, network, and account collaboration; less phone handling is not phone independence.",
      userVoice: "The reviewer found the visual layer more reassuring than audio-only confirmation and described captions and menu translation as futuristic, while noting that longer use was needed to judge whether it was more useful than display-less glasses or early Google Glass. Because the reviewer did not connect a personal phone, this is a hands-on signal rather than proof of durability, battery, privacy, or general availability.",
      newTech: "The technical move pulls AI output from the ear into the field of view: captions, translation, navigation, photo preview, and dynamic prompts become visible feedback alongside camera, gesture, and audio. The display is not a phone replacement; it is a low-text, high-confirmation state layer. The product innovation still depends on eyebox, information hierarchy, bystander visibility, and error recovery.",
      availability: "Meta says Ray-Ban Display is becoming available to more people through online ordering and expansion into the U.K., Canada, France, Italy, and Germany. Exact SKU, wait time, required phone, language, and feature rollout must be checked on the local product page. The hands-on confirms a controlled experience, not that every software function is synchronised or the product is broadly stocked everywhere.",
      limitsOrUnknowns: "Open questions include personal-phone pairing, real battery life, heat, long-wear visual fatigue, sunlight readability, occlusion, display latency, gesture errors, camera and cloud-data boundaries, bystander indicators, prescription fit, support, and app APIs. The reviewer did not take the device into a personal daily environment, so travel, meetings, commuting, and all-day behaviour remain unverified.",
      productVerdict: "Meta Ray-Ban Display is a concrete product with incomplete experience evidence and a clear review/community friction label. Verdict: captions and translation show why a visual layer can make AI more verifiable, while the missing phone pairing warns against treating a launch demo as a complete workflow. The next gate is personal-device closure, readability in motion, privacy feedback, and manual takeover after failure."
    })
  }),
  product({
    id: "nvidia-rtx-spark-pair-local-agent-network-2026-10-06",
    section: "global",
    sourceDate: "2026-09-03 announcement / 2026-10-06 availability follow-up",
    evidenceLabel: "confirmed product",
    evidenceStrength: "NVIDIA official local-AI announcement; October partner availability and exact SKU pricing remain market dependent",
    zhHeadline: "NVIDIA RTX Spark + PAIR：把家里的多台机器变成 Agent 的本地路由",
    enHeadline: "NVIDIA RTX Spark + PAIR turns a local network into an agent router",
    zhFact: "NVIDIA 官方博客称 RTX Spark Windows PC 将在 2026 年 10 月由 Lenovo、Acer 等伙伴推出，并把 PAIR（Personal AI Router）用于在本地网络多台 RTX 机器间分配推理。Perplexity Portable Computer 可在至少 24GB VRAM 的 Linux RTX GPU 上运行，Windows 支持后续开放；Hermes Agent 计划提供自动识别 GPU、选择模型与配置的一键设置。",
    enFact: "NVIDIA says RTX Spark Windows PCs are arriving in October 2026 from partners including Lenovo and Acer, while PAIR, the Personal AI Router, distributes inference across multiple RTX machines on a local network. Perplexity Portable Computer runs on Linux RTX GPUs with at least 24GB VRAM, with Windows support coming, and Hermes Agent is adding one-click GPU detection, model selection, and configuration.",
    zhValue: "这条产品路线把‘本地 AI’从一台高端电脑的性能问题改成家庭/工作室网络的资源编排问题。用户可以让敏感文档默认留在本地，在需要更强推理时按权限升级到云端；多台机器可以分担模型、创作和 Agent 任务。体验难点变成谁在使用哪台机器、数据走不走网络、失败时任务在哪里继续，以及本地硬件的成本和噪音是否值得。",
    enValue: "The route reframes local AI from the performance of one expensive computer to resource orchestration across a home or studio network. Sensitive documents can stay local while selected reasoning escalates to the cloud with permission; multiple machines can share models, creation, and agent workloads. The hard UX questions become which machine is being used, whether data crosses the network, where work resumes after failure, and whether the cost and noise of local hardware are worth it.",
    zhImplication: "验收应从‘模型跑得快不快’转为网络状态设计：设备发现、任务路由、VRAM 不足、机器休眠、权限确认、云端升级和结果回收都应可见。PAIR 需要说明是路由了模型、上下文还是完整任务；Perplexity 的云端升级要在发送前询问；Hermes 的一键配置要告诉用户选择了哪种模型和量化。",
    enImplication: "Acceptance should move from model speed to network-state design: device discovery, task routing, insufficient VRAM, sleep, permission, cloud escalation, and result return must be visible. PAIR needs to explain whether it routed a model, context, or whole task; Perplexity's cloud escalation should ask before sending content; Hermes's one-click setup should disclose the selected model and quantisation.",
    visual: nvidiaVisual,
    sources: [
      source("NVIDIA local AI, PAIR, and RTX Spark announcement", "https://blogs.nvidia.com/blog/local-ai-ifa-next-gen-agents-nv-pair-rtx-spark/", "official"),
      source("NVIDIA RTX AI PC hub", "https://www.nvidia.com/en-us/ai-on-rtx/", "official"),
      source("Perplexity Portable Computer", "https://www.perplexity.ai/portable-computer", "developer surface"),
      source("Hermes Agent", "https://github.com/NousResearch/hermes-agent", "developer docs")
    ],
    dossier: dossier({
      productName: "NVIDIA RTX Spark 是面向本地 AI、游戏、创作和 Agent 工作负载的新一批 Windows PC 设计；PAIR 是 NVIDIA 描述的 Personal AI Router，用于把本地网络中的多台 RTX PC 组织成推理资源。Perplexity Portable Computer 与 Hermes Agent 是它的应用侧入口。整套产品更像硬件、路由工具和 Agent 软件组合，而不是单一盒子。",
      productType: "产品类型是 local-AI PC platform plus agent orchestration surface。RTX Spark 提供有 RTX GPU 的 Windows 端点，PAIR 负责在端点之间分配推理；Perplexity Portable Computer 将模型、编排和工具包装在应用体验中，Hermes Agent 负责本地通用 Agent。NVIDIA 官方说 RTX Spark 伙伴机型在 10 月到来，具体主机、显存、功耗、噪音、价格和地区需要按厂商 SKU 查证。",
      interactionFlow: "用户安装本地 Agent 应用并授权设备访问，系统发现本地 RTX 机器、判断显存与模型兼容性，再决定在哪一台设备运行。对需要更强推理的步骤，Perplexity 可以在内容发往云端前请求许可；PAIR 可能把负载路由到另一台本地机器；Hermes 通过一键流程自动识别 GPU 并选择模型和配置。公开材料没有展示跨设备任务列表、路由解释、机器离线、取消或回收结果的完整界面。",
      specsOrStack: "NVIDIA 披露 PAIR、RTX Spark、llama.cpp/vLLM 优化、LM Studio/Ollama 生态和与 Hermes、OpenClaw、Perplexity 的本地 Agent 适配。NVIDIA 说 Perplexity Portable Computer 在 Linux 上需要至少 24GB VRAM 的 RTX GPU，Windows 支持将到来；博客还提到最高 1.9x 的本地推理加速。具体 GPU、显存、内存、模型量化、网络协议、加密、任务延迟和整机规格均不是统一值。",
      useCases: "具体用例包括在连接 GitHub 仓库后本地审查 PR 并按状态分类、让 Agent 阅读两年经纪记录和税务文件并逐页引用、分析本地漏斗导出找出注册到首个任务的掉点，以及在创作机上运行视频和图像工作负载。示例说明本地数据与云端升级的产品路径，不证明每个任务都可在多机环境稳定运行。",
      painPointsSolved: "它解决本地模型设置复杂、单机显存不足、敏感文件不愿上传和多台闲置 GPU 无法协作的问题。将模型下载、推理服务器、量化与 Agent 编排打包，能降低第一次运行门槛；PAIR 再把局部资源变成共享池。代价是用户必须理解设备发现、权限、网络、散热、功耗、版本和结果归属，‘本地’并不自动等于‘不外传’。",
      userVoice: "本次证据主要是 NVIDIA 官方博客与相关开发者页面，没有独立的 RTX Spark 零售机长期评测。Perplexity 和 Hermes 的产品示例来自供应商，能证明目标交互与支持路径，不代表所有模型和应用都自动获得同样性能。随着 10 月伙伴机型上市，应继续搜集实际噪音、配置、路由失败、跨机一致性和云端升级提示的评测与社区反馈。",
      newTech: "新技术点是把本地 Agent 体验拆成端点硬件、推理优化、模型安装、路由和云端升级五层：RTX GPU 负责计算，llama.cpp/vLLM 提供优化，Hermes 或 Perplexity 降低配置门槛，PAIR 负责多机调度，权限提示守住敏感内容。产品创新从‘更大显存’转向‘让多台机器像一个可解释系统工作’，但路由策略和任务状态仍需产品化。",
      availability: "NVIDIA 官方表示 RTX Spark Windows PC 在 2026 年 10 月由 Lenovo、Acer 等厂商推出；Perplexity Portable Computer 已支持 Linux RTX GPU，Windows 支持 coming soon；Hermes 的一键配置由开发者项目推进。发布日期、地区、具体显存、售价、软件版本和支持的 GPU 型号要看合作伙伴与应用的实际页面，不能从‘RTX Spark’品牌统一推断。",
      limitsOrUnknowns: "未知包括 PAIR 的开放时间、支持端点数量、调度指标、跨机加密、网络断开、机器睡眠、任务迁移、模型缓存、显存碎片、云端升级的隐私提示和多用户隔离。最高 1.9x 是 NVIDIA 对优化路径的官方表述，不是所有工作负载的通用结果；Perplexity 的至少 24GB VRAM 门槛也不能代表 RTX Spark 的每种配置。",
      productVerdict: "RTX Spark + PAIR 是 confirmed product 方向，最值得跟踪的是本地 Agent 的系统交互而非单机跑分。产品判断：NVIDIA 正在把本地 AI 变成可路由、可组合的家庭/工作室算力层；下一关是把机器选择、数据去向、云端升级与失败恢复做成清晰的用户状态，避免多机网络把本地隐私变成新的不可见复杂度。"
    }, {
      productName: "NVIDIA RTX Spark is a family of Windows PC designs for local AI, games, creation, and agent workloads; PAIR is NVIDIA's Personal AI Router for organising multiple RTX PCs on a local network. Perplexity Portable Computer and Hermes Agent are application-side entry points. The product is a combination of hardware, routing, and agent software rather than one box.",
      productType: "The product is a local-AI PC platform plus agent orchestration surface. RTX Spark supplies RTX-equipped Windows endpoints, PAIR distributes inference across endpoints, Perplexity Portable Computer packages models, orchestration, and tools, and Hermes is a general local agent. NVIDIA says partner systems arrive in October; exact machine, VRAM, power, noise, price, and regional availability require each vendor SKU.",
      interactionFlow: "A user installs a local agent and grants device access; the system discovers RTX machines, checks VRAM and model compatibility, and selects an endpoint. For stronger reasoning, Perplexity can ask before content goes to the cloud; PAIR can route work to another local PC; Hermes can detect the GPU and choose a model and configuration in a one-click setup. The public materials do not show a complete cross-device task list, route explanation, offline recovery, cancellation, or result-ownership UI.",
      specsOrStack: "NVIDIA discloses PAIR, RTX Spark, llama.cpp and vLLM optimisations, LM Studio and Ollama support, and local-agent integrations with Hermes, OpenClaw, and Perplexity. NVIDIA says Perplexity Portable Computer on Linux needs an RTX GPU with at least 24GB VRAM, with Windows support coming; the blog also claims up to 1.9x faster local inference on the optimisation path. GPU, VRAM, memory, quantisation, network protocol, encryption, latency, and system specs are not one universal value.",
      useCases: "Examples include reviewing a connected GitHub repository locally and sorting pull requests, reading two years of brokerage and tax files with citations to exact pages, analysing a local funnel export to find activation drop-off, and running video or image workloads on a creator machine. These examples describe a local-data and cloud-escalation path; they do not prove that every workflow is stable across several PCs.",
      painPointsSolved: "The route addresses complex local-model setup, insufficient VRAM on one machine, reluctance to upload sensitive files, and idle GPUs that cannot cooperate. Packaging model downloads, inference servers, quantisation, and agent orchestration lowers the first-run barrier; PAIR turns local resources into a shared pool. The cost is that users must understand discovery, permission, network, heat, power, versions, and result ownership. Local does not automatically mean no data leaves the network.",
      userVoice: "The evidence is mainly NVIDIA's official blog and developer pages; this run found no long-term retail review of an RTX Spark partner system. Perplexity and Hermes examples come from their vendors and prove a target workflow, not equal performance for every model and application. As October systems reach buyers, the important review and community signals are noise, configuration, route failure, cross-machine consistency, and cloud-escalation prompts.",
      newTech: "The technical move splits local-agent experience into endpoint hardware, inference optimisation, model setup, routing, and cloud escalation: RTX computes, llama.cpp or vLLM accelerates, Hermes or Perplexity reduces setup, PAIR schedules across machines, and permission prompts protect sensitive content. The product innovation shifts from more VRAM in one box to several machines behaving like one explainable system, but routing policy and task state still require product work.",
      availability: "NVIDIA says RTX Spark Windows PCs arrive in October 2026 from partners including Lenovo and Acer; Perplexity Portable Computer supports Linux RTX GPUs with Windows support coming; and Hermes is moving toward one-click setup. Release date, region, VRAM, price, software version, and supported GPU list must be checked on the partner and application pages. The RTX Spark brand alone does not define every configuration.",
      limitsOrUnknowns: "Open questions include PAIR release timing, endpoint count, scheduling metrics, cross-machine encryption, network loss, sleep, migration, model caching, VRAM fragmentation, cloud-escalation privacy prompts, and multi-user isolation. Up to 1.9x is NVIDIA's official optimisation claim, not a universal workload result; Perplexy's 24GB VRAM threshold also does not describe every RTX Spark configuration.",
      productVerdict: "RTX Spark plus PAIR is a confirmed product direction whose key question is system interaction rather than a single benchmark. Verdict: NVIDIA is turning local AI into a routable, composable home or studio compute layer. The next gate is legible device choice, data destination, cloud escalation, and failure recovery so a multi-machine network does not turn local privacy into invisible complexity."
    })
  }),
  product({
    id: "wuqi-quectel-hawk-dolphin-ai-xr-reference-design-2026-10-06",
    section: "china",
    sourceDate: "2026 current XR ecosystem announcement",
    evidenceLabel: "confirmed product",
    evidenceStrength: "Wuqi Micro official ecosystem report; Hawk/Dolphin are reference designs and chip solutions, not a named consumer retail product",
    zhHeadline: "物奇微 + 移远 Hawk/Dolphin：国产 AI 眼镜开始把续航拆成双芯与 Wi-Fi 问题",
    enHeadline: "Wuqi Micro + Quectel Hawk/Dolphin splits AI-glasses endurance into chips and Wi-Fi",
    zhFact: "物奇微官方报道移远发布 Hawk AI+AR 眼镜系列与 Dolphin 算力单元，覆盖光波导和 BirdBath 参考设计，并提供高通第一代骁龙 AR1 + WQ7036、酷芯微 ARS45 + WQ7036 两种架构。WQ7036 被描述为负责语音唤醒、蓝牙音频、传感器值守和轻量调度的低功耗协处理器；WQ9002A 双频 Wi-Fi 6 芯片仍是即将推出的方案。",
    enFact: "Wuqi Micro reports that Quectel launched Hawk AI+AR glasses and Dolphin compute units across waveguide and BirdBath reference designs, with Qualcomm first-generation Snapdragon AR1 + WQ7036 and Archip ARS45 + WQ7036 options. WQ7036 is described as a low-power coprocessor for wake word, Bluetooth audio, sensor standby, and light scheduling; the WQ9002A dual-band Wi-Fi 6 chip is still an upcoming solution.",
    zhValue: "这不是一个单独的消费品牌，而是一条把 AI 眼镜的摄像、显示、无线、音频和待机拆成可组合模块的供应链产品面。主 SoC 负责高清拍摄、AR 渲染等重任务，WQ7036 让语音唤醒、蓝牙和传感器值守不必让高性能主芯片一直在线；对于产品团队，价值在于减少从参考设计到量产终端之间的重复工程。",
    enValue: "This is not one consumer brand but a supply-chain product surface that decomposes camera, display, wireless, audio, and standby into combinable modules. A main SoC handles high-resolution capture and AR rendering while WQ7036 keeps wake word, Bluetooth, and sensor standby off the heavy processor. For product teams, the value is reducing repeated engineering between reference design and a shippable terminal.",
    zhImplication: "验收不能只看芯片参数，而要看参考设计是否让用户感到更少的等待和更长的连续使用：唤醒是否稳定，音频切换是否打断 Agent，视频上传时 Wi-Fi 功耗是否可见，主 SoC 与协处理器切换是否有状态反馈，断链和低电量时能否退化为电话/音频功能。由于公开对象是参考设计，最终品牌的镜片、OS、模型和交互仍需单独验证。",
    enImplication: "Acceptance cannot stop at chip claims. Test whether the reference design actually creates less waiting and longer continuous use: reliable wake, audio switching without interrupting the agent, visible Wi-Fi power cost during video upload, clear state during main-SoC/coprocessor handoff, and graceful degradation to phone or audio when the link or battery fails. Because the public object is a reference design, the final brand's optics, OS, models, and interaction still need separate verification.",
    visual: wuqiVisual,
    sources: [
      source("Wuqi Micro Hawk/Dolphin AI+XR ecosystem report", "https://www.wuqi-micro.com/about-wuqi/news-and-events/newss/85", "china"),
      source("Quectel XR solutions and ecosystem context", "https://www.quectel.com/news-and-blog/", "official"),
      source("Wuqi Micro WQ7036 product family", "https://www.wuqi-micro.com/product/audio/wq7036", "developer docs")
    ],
    dossier: dossier({
      productName: "Hawk AI+AR 眼镜系列与 Dolphin 算力单元是移远在 XR 生态发布的参考设计，物奇微提供 WQ7036 等芯片方案。公开页面确认光波导和 BirdBath 两类眼镜方向，以及主 SoC + 低功耗音频协处理器的组合。它服务于设备厂商、方案商和垂直客户，不等同于某个已经以 Hawk 名称面向消费者销售的整机。",
      productType: "产品类型是 AI+AR glasses reference design plus companion compute and connectivity silicon。光波导设计可选第一代 Snapdragon AR1 + WQ7036 或 ARS45 + WQ7036，经典轻量路线则可用 WQ7036 + 独立 ISP。主芯片承担高清拍摄和 AR 渲染，WQ7036 承担唤醒、蓝牙音频、传感器值守和轻任务调度，最终品牌可根据成本、显示和场景组合。",
      interactionFlow: "用户佩戴眼镜后，低功耗协处理器长期监听唤醒、维持蓝牙音频并查看传感器；当用户拍照、调用视觉 AI、显示 AR 内容或执行复杂任务时，主 SoC 与 Dolphin/手机/云端协同。理想流程应让用户感知不到芯片切换，只在低电量、弱网、过热或模型不可用时得到可理解的降级反馈。官方报道未展示最终品牌的设置、权限、任务中止、数据删除和断链 UI。",
      specsOrStack: "物奇微公开 WQ7036 作为智能音频主控，负责语音算法处理与基础无线连接，并披露已应用于超过 10 个 AI 眼镜品牌；WQ9002A 双频 Wi-Fi 6 方案最高支持 MCS9、最高速率 230Mbps、DTIM10 保活功耗 40μA 和硬件加密引擎，这些是公司披露的芯片目标。具体制程、整机重量、续航、温升、镜片、ISP、OS、API、模型与量产价格均为 source not stated。",
      useCases: "参考设计可服务 AI 音频眼镜、拍照眼镜、AR 显示眼镜、实时语音、视频上传、翻译、会议记录、现场巡检和其他需要连续待机的穿戴终端。主 SoC + 协处理器适合把高负载视觉任务和低负载音频/传感器任务分开；WQ9002A 适合解决高清视频与 AI 交互的无线带宽/功耗冲突。来源没有证明任一终端已完成这些场景的用户级闭环。",
      painPointsSolved: "它针对 AI 眼镜的结构性痛点：高性能主芯片一直在线会耗电发热，蓝牙音频与唤醒又需要全天候待机，Wi-Fi 视频传输会进一步压缩电池。分层架构让重任务和轻任务各用合适的计算与无线模块，并把方案选择提前到参考设计阶段。它没有自动解决天线、佩戴动作、弱网、应用权限、模型成本、镜片适配和售后维修。",
      userVoice: "目前公开证据以物奇微官方生态报道为主，包含公司对芯片出货、性能与应用品牌的披露，没有独立品牌的长时间佩戴、续航或用户体验测试。‘超过 10 个品牌’和‘数十万颗’是企业自述；可以说明供应链落地信号，不能直接换算成活跃用户、任务成功率或终端满意度。应继续观察 Hawk/Dolphin 是否转化为具体品牌 SKU。",
      newTech: "新技术点是把 AI 眼镜的系统栈做成双芯/多架构参考设计：高性能 SoC 负责影像和 AR，WQ7036 负责音频、唤醒、传感器值守和轻量调度，未来 WQ9002A 处理低功耗双频 Wi-Fi。物奇微还描述 RISC-V CPU、存算一体 NPU、DSP、ISP 的异构计算方向。它的创新是可组合的底层工程，不是一个已经完成的消费者交互。",
      availability: "物奇微官方页面确认 Hawk/Dolphin 参考设计已在 XR 生态活动中发布，WQ7036 已有样品/产品信息入口，WQ9002A 被描述为即将推出。参考设计面向客户选型和集成，不提供消费者购买链接、统一品牌、零售价格、具体发货地区或最终 OS。方案商可以申请样品，但从样品到量产终端的时间和条件未披露。",
      limitsOrUnknowns: "未知包括主 SoC 与协处理器的切换延迟、真实待机/拍摄/联网续航、Wi-Fi 在人体遮挡下的表现、音频泄漏、双芯调试、OTA、加密实现、摄像头数据留存、镜片与光学适配、端侧模型能力和品牌之间的兼容性。芯片宣传数字不等于整机续航；参考设计也不等于安全认证或量产良率。",
      productVerdict: "Hawk/Dolphin 是 confirmed product 的供应链参考设计，证据强度适合写入中国 lane，但不能写成消费者已购买的 AI 眼镜。产品判断：它把 AI 眼镜续航问题拆成架构与通信问题，让设备厂商可以在显示、音频和算力之间做更细的组合。下一关是用真实整机证明唤醒、传输、降级和维修体验，而不是继续堆叠芯片名词。"
    }, {
      productName: "Hawk AI+AR glasses and Dolphin compute units are Quectel reference designs in the XR ecosystem, with Wuqi Micro supplying WQ7036 and related chips. The public page confirms waveguide and BirdBath directions and a main-SoC plus low-power audio-coprocessor architecture. It serves device makers, solution vendors, and vertical customers; it is not a retail headset already sold under the Hawk name.",
      productType: "The product is an AI+AR glasses reference design plus companion compute and connectivity silicon. The waveguide design can pair first-generation Snapdragon AR1 with WQ7036 or ARS45 with WQ7036, while a lighter route uses WQ7036 with an independent ISP. The main chip handles high-resolution capture and AR rendering; WQ7036 handles wake word, Bluetooth audio, sensor standby, and light scheduling.",
      interactionFlow: "After the user puts on the glasses, the low-power coprocessor maintains wake detection, Bluetooth audio, and sensor monitoring. When the user captures an image, invokes vision AI, displays AR content, or starts a heavier task, the main SoC works with the Dolphin unit, phone, or cloud. The ideal experience makes chip handoff invisible and provides clear degradation when battery, network, heat, or model access fails. The report does not show final-brand setup, permission, stop, deletion, or link-loss UI.",
      specsOrStack: "Wuqi describes WQ7036 as a smart-audio controller for voice algorithms and basic wireless connectivity and says it is used in more than ten AI-glasses brands. It describes the upcoming WQ9002A dual-band Wi-Fi 6 solution with MCS9, up to 230Mbps, DTIM10 keep-alive power of 40 microamps, and a hardware encryption engine. These are company disclosures about chip targets. Process node, system weight, battery, heat, lenses, ISP, OS, API, model, and retail price are source not stated.",
      useCases: "The reference design can support audio glasses, camera glasses, AR display glasses, speech, video upload, translation, meeting notes, field inspection, and other wearables requiring continuous standby. A main-SoC plus coprocessor architecture separates high-load vision from low-load audio and sensing; WQ9002A targets the bandwidth and power conflict of video and AI interaction. The source does not prove that any terminal has closed these user workflows.",
      painPointsSolved: "It targets a structural problem in AI glasses: a high-performance chip that stays awake wastes power and creates heat, while Bluetooth audio and wake detection need all-day standby and Wi-Fi video adds another battery load. Layering lets heavy and light tasks use different compute and wireless blocks and moves architecture choice into reference design. It does not automatically solve antennas, movement, weak networks, permissions, model cost, optical fit, or repair.",
      userVoice: "The available evidence is mainly Wuqi Micro's official ecosystem report, including company disclosures about chip shipment, performance, and brand adoption. This run found no independent long-wear, battery, or user-experience test of a final Hawk/Dolphin brand. 'More than ten brands' and 'hundreds of thousands of units' are company statements: they signal supply-chain adoption but do not translate directly into active users, task success, or satisfaction.",
      newTech: "The technical move is a dual-chip and multi-architecture reference design: a high-performance SoC for imaging and AR, WQ7036 for audio, wake, sensor standby, and light scheduling, and a future WQ9002A for low-power dual-band Wi-Fi. Wuqi also describes heterogeneous computing with RISC-V CPU, compute-in-memory NPU, DSP, and ISP. This is composable systems engineering, not a finished consumer interaction.",
      availability: "Wuqi's official page says Hawk/Dolphin reference designs were presented in the XR ecosystem event; WQ7036 has product and sample information, while WQ9002A is described as upcoming. Reference designs are for customer selection and integration, without a consumer purchase link, unified brand, retail price, shipping region, or final OS. Vendors can request samples, but the time and conditions from sample to production are not disclosed.",
      limitsOrUnknowns: "Open questions include handoff latency, real standby/capture/network battery, Wi-Fi behaviour around the body, audio leakage, dual-chip debugging, OTA, encryption implementation, camera-data retention, lens and optical fit, on-device models, and cross-brand compatibility. Chip claims do not equal system battery life; a reference design is not a safety certification or production-yield result.",
      productVerdict: "Hawk/Dolphin is a confirmed-product supply-chain reference design, strong enough for the China lane but not a consumer headset claim. Verdict: it decomposes AI-glasses endurance into architecture and communications so makers can choose more precisely across display, audio, and compute. The next gate is a real system proving wake, transfer, degradation, and repair experience—not another list of chip names."
    })
  })
];

const issue = structuredClone(previous);
issue.date = date;
issue.zhTitle = "OpenShell 把 Agent 的动作放到模型之外验收";
issue.enTitle = "OpenShell puts agent actions outside the model for acceptance";
issue.zhSummary = "Intel 将 NVIDIA OpenShell 接入企业 Agent 工具栈，把文件、网络、进程和凭据策略放到模型上下文之外。ASUS G14 与 NVIDIA RTX Spark 把本地推理推进到真实硬件和多机路由；Meta Ray-Ban Display 的上手则提醒，显示层很有说服力，但个人手机闭环仍需验证。中国 lane 继续跟踪 Hawk/Dolphin 参考设计如何把 AI 眼镜续航拆成双芯与 Wi-Fi。";
issue.enSummary = "Intel's integration of NVIDIA OpenShell puts file, network, process, and credential policy outside the model context. ASUS G14 and NVIDIA RTX Spark push local inference into real hardware and multi-machine routing, while a Meta Ray-Ban Display hands-on shows that visual feedback is persuasive but the personal-phone loop remains unproven. China's lane follows Hawk/Dolphin reference designs as they split AI-glasses endurance across chips and Wi-Fi.";
issue.tags = [...new Set(["agent governance", "OpenShell", "local AI PC", "AI glasses display", "XR reference design", ...(issue.tags || [])])];
issue.topics = [...freshTopics, ...issue.topics.filter((item) => !freshTopics.some((candidate) => candidate.id === item.id))];
issue.coverStory = {
  topicId: freshTopics[0].id,
  zhTitle: "OpenShell 把 Agent 的动作放到模型之外验收",
  enTitle: "OpenShell puts agent actions outside the model for acceptance",
  zhSummary: ["企业 Agent 的关键问题从‘模型说自己做了什么’转向‘系统实际允许了什么’。", "Intel + NVIDIA 把沙箱、网络、凭据和独立决策日志接到 Agent 旁边，阻断发生在请求离开之前。", "今天的产品验收应优先测权限、路由、失败恢复和用户接管，再谈任务成功率。"],
  enSummary: ["The enterprise-agent question shifts from what the model says it did to what the system actually allowed.", "Intel and NVIDIA place sandbox, network, credential, and independent decision logging beside the agent, before a request leaves.", "Today's product acceptance should test permission, routing, recovery, and takeover before task success rates."],
  imagePath: intelVisual.path,
  imageWidth: intelVisual.width,
  imageHeight: intelVisual.height,
  imageSourceUrl: intelVisual.sourceUrl,
  primarySourceUrl: freshTopics[0].sources[0].url,
  evidenceStrength: freshTopics[0].evidenceStrength,
  whyCover: "An agent becomes a product when its permissions, failures, and actions are observable outside its own context."
};
issue.watchlistZh = Array.from(new Set(["OpenShell 0.1.x 升级与真实部署：策略写作、误阻断、日志脱敏、回滚与 Kubernetes 兼容性。", "RTX Spark/PAIR 伙伴机型：显存、噪音、价格、设备发现、跨机路由和云端升级提示。", "Meta Ray-Ban Display：个人手机配对、移动可读性、旁人提示、续航与手动接管。", "Hawk/Dolphin：参考设计转化为具体 SKU、整机续航、WQ9002A 样品与真实弱网表现。", ...issue.watchlistZh])).slice(0, 20);
issue.watchlistEn = Array.from(new Set(["OpenShell 0.1.x deployment: policy authoring, false denials, log redaction, rollback, and Kubernetes compatibility.", "RTX Spark and PAIR partner systems: VRAM, noise, price, discovery, cross-machine routing, and cloud-escalation prompts.", "Meta Ray-Ban Display: personal-phone pairing, readability in motion, bystander indicators, battery, and takeover.", "Hawk/Dolphin: named retail SKUs, system battery, WQ9002A samples, and weak-network behaviour.", ...issue.watchlistEn])).slice(0, 20);
issue.sourcesPath = `./${date}/sources.md`;
issue.zhPath = `./${date}/zh/`;
issue.enPath = `./${date}/en/`;
const index = issues.findIndex((item) => item.date === date);
if (index >= 0) issues[index] = issue; else issues.unshift(issue);
issues.sort((a, b) => b.date.localeCompare(a.date));
await fs.writeFile(dataPath, JSON.stringify(issues, null, 2) + "\n");

await fs.mkdir(path.join(issueDir, "assets"), { recursive: true });
await fs.cp(path.join(previousIssueDir, "assets"), path.join(issueDir, "assets"), { recursive: true, force: false, errorOnExist: false });
await fs.rm(deckDir, { recursive: true, force: true });
await fs.mkdir(path.join(deckDir, "public", "assets"), { recursive: true });
for (const file of ["package.json", "package-lock.json"]) await fs.cp(path.join(previousDeck, file), path.join(deckDir, file));
await fs.cp(path.join(issueDir, "assets"), path.join(deckDir, "public", "assets"), { recursive: true, force: true });
let slides = await fs.readFile(path.join(previousDeck, "slides.md"), "utf8");
slides = slides.replaceAll(previousDate, date);
slides = slides.replace(/Googlebook 上架：系统级 AI 的第一天，先验收跨设备闭环 \/ Googlebook reaches shelves: on day one, test the cross-device loop/g, `${issue.coverStory.zhTitle} / ${issue.coverStory.enTitle}`);
slides = slides.replace(/Googlebook 上架：系统级 AI 的第一天，先验收跨设备闭环/g, issue.coverStory.zhTitle);
slides = slides.replace(/Googlebook reaches shelves: on day one, test the cross-device loop/g, issue.coverStory.enTitle);
slides = slides.replace(/\.\/public\/assets\/googlebook[^\s)"']+/g, `./public/${intelVisual.path}`);
slides = slides.replace(/\*\*Today’s additions\*\* — .*\n/g, `**Today’s additions** — ${freshTopics.map((item) => item.zhHeadline).join("；")}。\n`);
slides = slides.replace(/当 AI 进入镜片与身体：显示、辅助与端侧连接开始合流/g, issue.coverStory.zhTitle);
slides = slides.replace(/When AI enters lenses and bodies: displays, assistance, and edge links converge/g, issue.coverStory.enTitle);
const dossierText = (locale, item) => fields.map((field, i) => `**${locale === "zh" ? ["产品", "产品是什么", "怎么用", "规格 / 系统栈", "使用场景", "解决痛点", "用户原声", "新技术", "可用性", "限制 / 未知", "产品判断"][i] : ["Product", "What it is", "How it works", "Specs / stack", "Use cases", "Pain points", "User voice", "New tech", "Availability", "Limits / unknowns", "Product read"][i]}** — ${item.dossier[locale][field]}`).join("\n\n");
const links = (item) => item.sources.map((s) => `[${s.label}](${s.url})`).join(" · ");
const freshSlides = freshTopics.flatMap((item) => [
  `# ${item.zhHeadline}\n\n<img src="./public/${item.visual.path}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${item.evidenceLabel} · ${item.evidenceStrength} · ${item.sourceDate}**\n\n${dossierText("zh", item)}\n\n**Sources** — ${links(item)}`,
  `# ${item.enHeadline}\n\n<img src="./public/${item.visual.path}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${item.evidenceLabel} · ${item.evidenceStrength} · ${item.sourceDate}**\n\n${dossierText("en", item)}\n\n**Sources** — ${links(item)}`
]);
const parts = slides.split("\n\n---\n\n");
parts.splice(2, 0, ...freshSlides);
await fs.writeFile(path.join(deckDir, "slides.md"), parts.join("\n\n---\n\n"));

const allSources = Array.from(new Map(issue.topics.flatMap((item) => item.sources).map((s) => [s.url, s])).values());
const lanes = ["official", "reviews", "community", "wild", "research", "patent", "china", "global"];
const laneRows = lanes.map((lane) => `| ${lane} | ${issue.topics.some((item) => item.section === lane) ? "covered" : "scan required"} | ${issue.topics.filter((item) => item.section === lane).map((item) => item.id).join(", ") || "source-lane scan"} |`).join("\n");
const visualRows = issue.topics.map((item) => `| ${item.id} | ${item.visual.path} | ${item.visual.sourceUrl} | ${item.evidenceLabel} |`).join("\n");
await fs.writeFile(path.join(deckDir, "sources.md"), `# AI Daily ${date} source ledger\n\n## Source index\n\n${allSources.map((s, i) => `${i + 1}. ${s.label} — ${s.url} — ${s.type || "source not stated"}`).join("\n")}\n\n## Source-lane coverage\n\n| lane | status | topics |\n| --- | --- | --- |\n${laneRows}\n\n## Visual asset index\n\n| topic | asset | source | evidence |\n| --- | --- | --- | --- |\n${visualRows}\n\n## Evidence rules\n\n- Official pages support confirmed product or developer-surface claims only where stated.\n- Reviews and community pages provide friction signals, not universal behaviour.\n- Startup, research, patent, pre-launch, crowdfunding, and weak material remains explicitly downgraded.\n- Missing specs, prices, dates, availability, quotes, and APIs are written as source not stated.\n- Visuals use object-fit: contain, object-position: center, white backgrounds, and no page-internal scrolling.\n- Chinese and English dossier fields carry the same information units; English is not a compressed summary.\n- Design Desk is a product/HCI synthesis layer, not a substitute for source evidence.\n`);
console.log(JSON.stringify({ date, topics: issue.topics.length, fresh: freshTopics.length, sources: allSources.length, visuals: new Set(issue.topics.map((item) => item.visual.path)).size, deckDir }));
