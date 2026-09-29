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
const scan = (input) => ({ dossierKind: "scan", ...input });

const urls = {
  advantech: "https://adv-www-jp.azurewebsites.net/en-us/resources/news/asr-d501-grand-launch",
  advantechSpec: "https://advantech.com/en-us/products/compact-companion-mission-computer-for-drone-powered-by-qualcomm-qcs6490/sub_1-2kw0l2",
  advantechSuite: "https://docs.robotic-suite.advantech.com/",
  sonosPress: "https://newsroom.sonos.com/269852-sonos-welcomes-beam-ultra-and-sonos-ace-ultra-to-its-system/",
  sonosAce: "https://www.sonos.com/en-ca/shop/sonos-ace-ultra",
  sonosBeam: "https://www.sonos.com/en-gb/shop/beam-ultra-black",
  sonosReview: "https://www.techradar.com/audio/multi-room/exclusive-sonos-ceo-tom-conrad-talks-ace-ultra-beam-ultra-ai-features",
  devday: "https://devday.openai.com/",
  agentsApi: "https://openai.com/index/introducing-the-agents-api/",
  openaiForum: "https://community.openai.com/"
};
const visuals = {
  advantech: visual("advantech-asr-d501-official-2026-09-29.png", "ASR-D501 官方发布页面截图", "ASR-D501 official launch page screenshot", "官方页面视觉：ASR-D501 无人机边缘 AI 伴随计算机；另有机制图作为辅助说明。", "Official page visual: ASR-D501 airborne edge-AI companion computer; the mechanism diagram is secondary explanatory material.", urls.advantech),
  sonos: visual("sonos-27-ace-beam-ultra-official-2026-09-29.png", "Sonos Beam Ultra 与 Ace Ultra 官方发布页面截图", "Sonos Beam Ultra and Ace Ultra official newsroom screenshot", "官方发布页面视觉：Beam Ultra、Ace Ultra 与 Sonos 27 系统；另有机制图作为辅助说明。", "Official newsroom visual: Beam Ultra, Ace Ultra, and Sonos 27; the mechanism diagram is secondary explanatory material.", urls.sonosPress),
  devday: visual("openai-devday-2026-official-2026-09-29.png", "OpenAI DevDay 2026 官方活动页面截图", "OpenAI DevDay 2026 official event page screenshot", "官方活动页视觉：9 月 29 日 DevDay、API/tool sessions 与 keynote；现场新品保持未确认。", "Official event-page visual: September 29 DevDay, API/tool sessions, and keynote; live products remain unconfirmed.", urls.devday, "source-backed official event page screenshot")
};

export const freshTopics = [
  product({
    id: "advantech-asr-d501-autonomous-drone-edge-computer-2026-09-29",
    section: "official", evidenceLabel: "confirmed product", sourceDate: "2026-09-29",
    evidenceStrength: "Advantech official launch and product specification surface",
    zhHeadline: "Advantech ASR-D501：把无人机的感知、定位与任务推理压到机载边缘",
    enHeadline: "Advantech ASR-D501 puts drone perception and mission reasoning on the edge",
    zhFact: "Advantech 9 月 29 日发布 ASR-D501，一块面向自主无人机的 AI companion / mission computer。官方给出的产品链是 Qualcomm QCS6490、最高 12 TOPS、低于 10W、多相机视觉、传感器连接、飞控接口和 Robotic Suite for Drone；它把视觉感知、定位、传感器融合与任务级处理放到机载计算层。",
    enFact: "Advantech announced the ASR-D501 on September 29 as an AI companion and mission computer for autonomous UAVs. Its official product chain combines Qualcomm QCS6490, up to 12 TOPS within a sub-10W envelope, multi-camera vision, sensor connectivity, flight-controller interfaces, and the Robotic Suite for Drone, moving perception, localisation, sensor fusion, and mission processing onto the aircraft.",
    zhValue: "产品重点不是让无人机多一个聊天入口，而是让它在没有持续云连接时仍能做目标检测、视觉定位、VIO、SLAM、避障和 GNSS-denied navigation。飞控继续负责实时稳定与执行器，ASR-D501 负责理解环境和任务；这把 AI 的可见边界从模型输出移到飞行安全状态机。",
    enValue: "The point is not to add a chat entry to a drone. It is to keep object detection, visual localisation, VIO, SLAM, obstacle awareness, and GNSS-denied navigation available without continuous cloud connectivity. The primary flight controller remains responsible for real-time stabilisation and actuators while ASR-D501 handles environment and mission understanding, moving the AI boundary into a flight-safety state machine.",
    zhHciLens: ["入口：多相机与传感器", "上下文：位置、地图、目标与任务", "动作：规划、跟踪、飞控协同", "边界：失联、误检、接管、降级"],
    enHciLens: ["Input: cameras and sensors", "Context: pose, map, targets, mission", "Action: planning, tracking, flight-control coordination", "Boundary: link loss, false detection, takeover, degradation"],
    zhImplication: "自主飞行产品要把“看见”“定位”“规划”“发给飞控”拆成可审计阶段。用户需要看到当前感知置信度、地图/定位状态、GNSS 是否可用、何时由飞控接管，以及断电或模型异常后的安全动作。边缘推理减少云依赖，但不等于允许 AI 直接获得全部飞行权。",
    enImplication: "Autonomous-flight products should separate seeing, localising, planning, and sending commands to the flight controller into auditable stages. Operators need the current perception confidence, map and pose state, GNSS availability, the handoff point to the flight controller, and the safe action after power loss or model failure. Edge inference reduces cloud dependence; it does not grant the AI unrestricted flight authority.",
    visual: visuals.advantech,
    sources: [source("Advantech ASR-D501 launch", urls.advantech, "official"), source("ASR-D501 product/specification page", urls.advantechSpec, "official"), source("Advantech Robotic Suite for Drone", urls.advantechSuite, "developer docs")],
    dossier: makeDossier({
      productName: "Advantech ASR-D501 AI companion / mission computer",
      productType: "ASR-D501 是面向自主无人机开发和工业部署的紧凑型机载 AI 伴随计算机，不是消费者无人机，也不是独立飞控。它把感知、定位、传感器融合和任务级处理放在主飞控旁边，让飞控继续专注实时稳定和执行器控制。官方产品定位覆盖从自主飞行原型到生产化 UAV 系统的开发链。",
      interactionFlow: "摄像头、惯性与其他传感器把环境输入送入机载计算；ASR-D501 在本地做目标检测、视觉定位、VIO、SLAM、避障和任务级处理，再通过飞控接口与主飞控及执行器协同。开发者用 Robotic Suite for Drone 把感知、地图、跟踪、路径规划和飞行控制接起来。官方没有展示完整的操作员界面、人工批准、模型异常接管或失联后的逐步提示。",
      specsOrStack: "官方发布披露 Qualcomm QCS6490、最高 12 TOPS AI 性能、低于 10W 功耗、多相机视觉、传感器连接、飞控接口、无线扩展和 Robotic Suite。官方还给出 100×60 mm、约 50 g（不含散热片）、5–12V DC、无风扇被动散热、-20°C 至 70°C、3.5 Grms 振动、锁紧连接器和长期产品生命周期支持。公开规格页列出 8GB LPDDR5、128GB UFS、MIPI-CSI、CAN-FD、UART、ROS2 与 MAVLink/MAVROS/MAVSDK 支持。",
      useCases: "目标场景包括工业巡检、测绘、仓储或农业无人机的实时视觉感知、GNSS 不可用环境导航、障碍物感知、目标跟踪、视觉定位、路径规划和任务级推理。它也适合开发团队把硬件 bring-up、模型部署、传感器融合与飞控接线放进同一套参考工作流，减少每个项目重新拼装边缘计算层的成本。",
      painPointsSolved: "ASR-D501 针对无人机持续依赖云端、无线链路延迟、带宽限制、机载功耗和多传感器/飞控集成复杂度。把 AI 放到本地可以在断联或 GNSS-denied 场景继续运行，并让主飞控与任务计算分工。新增痛点是边缘模型能力有限、热量与电池预算、误检造成的任务风险、模型更新回滚、日志审计和人工接管设计。",
      userVoice: "本期没有找到独立飞行测试、客户部署报告或长期社区反馈。官方发布足以确认硬件定位、公开规格和参考软件链，但不能证明某一型号无人机的实际飞行成功率、障碍物识别准确率、续航损耗、在风雨环境中的表现或生产认证状态。用户原声与第三方 benchmark 均为 source not stated。",
      newTech: "新技术信号是把 QCS6490 的异构 CPU/GPU/NPU、传感器融合、定位与 Robotic Suite 组合成一个可复用的 UAV autonomy foundation。与把模型单独塞进无人机不同，它明确把 perception-to-flight-control 的软件硬件通路产品化，并把边缘推理放进尺寸、重量、功耗受限的航空载荷约束中。",
      availability: "Advantech 已于 2026 年 9 月 29 日公布 ASR-D501，并提供产品与报价入口；官方未在发布页给出公开零售价、面向普通消费者的购买渠道或具体地区库存。产品更接近工业 OEM、无人机开发者和系统集成商的采购/定制路线；量产交期和完整认证状态为 source not stated。",
      limitsOrUnknowns: "未知包括具体镜头/传感器兼容清单、实际模型与框架、NPU 利用率、热设计在机身内的余量、飞行续航影响、断联时的安全策略、模型升级/回滚、驾驶员接管、数据留存、远程日志、出口/航空法规和真实生产客户。12 TOPS 不能直接换算成某种导航成功率。",
      productVerdict: "ASR-D501 是今天最清晰的 physical-AI infrastructure 产品：它把“端侧 AI”落到无人机的功耗、接口、定位和飞控边界，而非只讲模型能力。结论：confirmed product；硬件定位和官方规格已确认，实际飞行效果、客户部署与安全认证仍需独立实测。"
    }, {
      productName: "Advantech ASR-D501 AI companion / mission computer",
      productType: "ASR-D501 is a compact airborne AI companion and mission computer for autonomous UAV development and industrial deployment. It is not a consumer drone and not a standalone flight controller. It sits beside the primary controller, placing perception, localisation, sensor fusion, and mission processing on an edge computer while the controller remains focused on real-time stabilisation and actuators. The official position spans UAV prototyping through production-oriented systems.",
      interactionFlow: "Cameras, inertial input, and other sensors feed the airborne computer; ASR-D501 performs local detection, visual localisation, VIO, SLAM, obstacle awareness, and mission processing, then coordinates with the primary flight controller through flight-control interfaces. Developers use the Robotic Suite for Drone to connect perception, mapping, tracking, path planning, and control. The official material does not show the complete operator UI, human approval, model-failure takeover, or step-by-step link-loss feedback.",
      specsOrStack: "The announcement discloses Qualcomm QCS6490, up to 12 TOPS of AI performance, a sub-10W envelope, multi-camera vision, sensor connectivity, flight-controller interfaces, wireless expansion, and the Robotic Suite. It also gives a 100 by 60 mm form factor, approximately 50 g board weight without heatsink, 5–12V DC input, fanless passive cooling, -20°C to 70°C operation, 3.5 Grms vibration resistance, lockable connectors, and long-term lifecycle support. The product surface lists 8GB LPDDR5, 128GB UFS, MIPI-CSI, CAN-FD, UART, ROS2, and MAVLink/MAVROS/MAVSDK support.",
      useCases: "Target scenarios include industrial inspection, mapping, warehouse or agricultural UAV perception, navigation when GNSS is unavailable, obstacle awareness, target tracking, visual localisation, path planning, and mission-level reasoning. It also serves development teams that want one reference path from hardware bring-up and model deployment through sensor fusion and flight-controller wiring, reducing the need to rebuild the edge-computing layer for every airframe.",
      painPointsSolved: "ASR-D501 addresses continuous cloud dependence, wireless latency, bandwidth, airborne power limits, and the integration burden across sensors and flight control. Local inference can keep working through a link outage or GNSS-denied segment while separating mission computation from stabilisation. New pain includes limited edge models, thermal and battery budgets, false detections, update and rollback safety, audit logs, and human takeover design.",
      userVoice: "This run found no independent flight test, customer deployment report, or long-term community feedback. The official release confirms the hardware position, public specifications, and reference software path, but it does not prove flight success rate, obstacle-recognition accuracy, endurance impact, performance in weather, or production certification for a particular airframe. User voice and third-party benchmarks remain source not stated.",
      newTech: "The new product signal is a reusable UAV-autonomy foundation combining QCS6490 heterogeneous compute, sensor fusion, localisation, and the Robotic Suite. Instead of dropping a model into a drone as an isolated component, it productises a perception-to-flight-control path and places edge inference inside the size, weight, and power constraints of an airborne payload.",
      availability: "Advantech announced ASR-D501 on September 29, 2026 and provides a product and quotation path. The launch page does not state a public retail price, consumer purchase channel, or regional inventory. The product is closer to an industrial OEM, drone developer, and systems-integrator procurement path; lead time and complete certification status are source not stated.",
      limitsOrUnknowns: "Open questions include compatible cameras and sensors, actual models and frameworks, NPU utilisation, in-airframe thermal margin, endurance impact, safe behaviour during link loss, model update and rollback, pilot takeover, data retention, remote logs, export and aviation regulation, and real production customers. Twelve TOPS cannot be converted into a navigation success rate without testing.",
      productVerdict: "ASR-D501 is the clearest physical-AI infrastructure signal today: it places edge AI inside the power, interface, localisation, and flight-control boundaries of a drone rather than stopping at model capability. Verdict: confirmed product. Hardware position and official specifications are confirmed; flight performance, customer deployment, and safety certification still require independent tests."
    })
  }),
  product({
    id: "sonos-27-ace-beam-ultra-system-2026-09-29",
    section: "global", evidenceLabel: "confirmed product", sourceDate: "2026-09-29",
    evidenceStrength: "Sonos official launch and product pages; independent product coverage adds system friction context",
    zhHeadline: "Sonos 27 + Ace Ultra / Beam Ultra：AI 音频系统从单个设备转向房间间接力",
    enHeadline: "Sonos 27 and the Ace / Beam Ultra turn audio AI into a room-to-person system",
    zhFact: "Sonos 9 月 29 日开始提供 Beam Ultra 与 Ace Ultra；两者与 Sonos 27 音频操作系统一起发布。Beam Ultra 将九个单元、两个向上发声单元和 7.1.2 Dolby Atmos 放进中型 soundbar；Ace Ultra 用 Headphone Engine 2、40mm 驱动、十麦克风 Adaptive ANC 和最长 35 小时 ANC 续航，支持一键在家庭系统与耳机间切换。",
    enFact: "Sonos makes Beam Ultra and Ace Ultra generally available on September 29 alongside Sonos 27. Beam Ultra puts nine drivers, two upward-firing drivers, and true 7.1.2 Dolby Atmos into a mid-size soundbar. Ace Ultra adds Headphone Engine 2, a Sonos-designed 40mm driver, ten-microphone Adaptive ANC, up to 35 hours with ANC on, and one-press handoff between the home system and headphones.",
    zhValue: "这里的产品变化不在“音箱多了 AI”，而在系统知道声音正在房间还是耳边。用户可以在客厅看电影，按一下把内容转到 Ace Ultra，或把耳机里的内容切回 soundbar；Beam Ultra 还用 AI Speech Enhancement 与 Night Sound 处理对话清晰度和夜间收听。Sonos 27voice、27mcp 的系统表述把语音和 Agent 控制面放进同一平台，但具体能力要按公开版本验证。",
    enValue: "The shift is not simply adding AI to a speaker. It is making the system understand whether sound belongs in a room or at a person's ears. A listener can watch in the living room, press once to move playback to Ace Ultra, or bring headphone playback back to the soundbar. Beam Ultra adds AI Speech Enhancement and Night Sound for dialogue and late listening. Sonos presents 27voice and 27mcp as platform control surfaces, but each capability still has to be verified against the shipped release.",
    zhHciLens: ["入口：电视、音乐、语音与按键", "上下文：房间、耳机、内容与聆听状态", "动作：切换、分组、调音、Agent 控制", "边界：网络、账号、权限、系统稳定性"],
    enHciLens: ["Input: TV, music, voice, buttons", "Context: room, headphones, content, listening state", "Action: handoff, grouping, tuning, agent control", "Boundary: network, account, authority, system reliability"],
    zhImplication: "音频 Agent 的核心不是会说话，而是正确判断“输出应该在哪个空间”。反馈要让用户知道声音要移动到哪里、谁会听到、系统是否改变了房间分组，以及失败后如何回到上一状态。跨设备自动化如果不显示目标房间、账号和权限，便利会迅速变成社交尴尬或误播风险。",
    enImplication: "The core of an audio agent is not speech; it is choosing the right output space. Feedback should show where sound will move, who can hear it, whether the room group changes, and how to return to the previous state. Cross-device automation that hides the target room, account, or authority quickly becomes social embarrassment or accidental-playback risk.",
    visual: visuals.sonos,
    sources: [source("Sonos Beam Ultra and Ace Ultra newsroom", urls.sonosPress, "official"), source("Sonos Ace Ultra product page", urls.sonosAce, "official"), source("Sonos Beam Ultra product page", urls.sonosBeam, "official"), source("TechRadar Sonos 27 / Ace Ultra interview", urls.sonosReview, "reviews")],
    dossier: makeDossier({
      productName: "Sonos 27 with Beam Ultra and Sonos Ace Ultra",
      productType: "这是 Sonos 的联网音频系统更新，不是一个单独的 AI 音箱。Beam Ultra 是面向家庭影院的中型 soundbar，Ace Ultra 是面向个人聆听的无线头戴耳机，Sonos 27 则是把房间、扬声器、耳机、语音和第三方内容放在一起的音频操作层。产品价值来自系统协同，而不是单一硬件参数。",
      interactionFlow: "用户通过电视、Sonos App、语音或实体按键开始播放；Beam Ultra 作为房间中心提供 Dolby Atmos、Speech Enhancement 和 Night Sound；Ace Ultra 可以通过 Headphone Engine 2 直接连接 Sonos 系统，按一下把正在播放的内容推送到耳机，再按一下切回。Trueplay 调整房间，TrueCinema 为从 soundbar 转到耳机的体验做适配。",
      specsOrStack: "官方披露 Beam Ultra 有九个定制单元、两个向上发声单元、7.1.2 Dolby Atmos、四档 AI Speech Enhancement、Night Sound、Wi-Fi、Bluetooth、HDMI eARC 和 Trueplay。Ace Ultra 有 Sonos 设计的 40mm 驱动、十麦克风 Adaptive ANC、Headphone Engine 2、最长 35 小时 ANC 续航、USB-C、3.5mm、Bluetooth、空间音频与动态头部追踪。Sonos 27 是音频操作系统；27voice 与 27mcp 的实际公开权限边界仍需版本核对。",
      useCases: "典型流程是客厅看电影后将声音带到耳机、在深夜用 Night Sound 保留对白、在多人房间中调整清晰度、把音乐从一个房间切换到另一个房间，以及让兼容设备组成家庭影院。对产品团队而言，Sonos 27 还提供一个观察点：语音或 Agent 未来是否能替用户选择房间、内容和设备，并且让用户在播放前看到目标。",
      painPointsSolved: "组合产品减少了家庭听音中“内容跟着房间走、耳机与音箱是两套系统”的切换成本，也用 Speech Enhancement 处理对白难听清的痛点。它同时放大网络、账户、设备发现、房间分组、误播放和系统升级的摩擦；过去 Sonos App 的稳定性问题会让用户对新的系统层能力更谨慎，独立媒体对发布节奏的提醒属于 review friction，不是普遍结论。",
      userVoice: "TechRadar 的 CEO 访谈与产品报道确认 Ace Ultra 的系统连接、Sonos 27、27voice 和 27mcp 方向，但它不是长期第三方评测。社区长期对 Sonos App 更新、连接可靠性和系统迁移敏感；本期没有把社区抱怨计为 Ace Ultra 的质量事实。真实的跨房间切换延迟、恢复、多人账号和 Agent 控制反馈仍需发货后复测。",
      newTech: "新技术在于 Headphone Engine 2 让耳机直接成为 Sonos 系统节点，而不是只通过手机蓝牙播放；Beam Ultra 则把房间校准、上发声声道和语音清晰度放在同一系统里。Sonos 27voice / 27mcp 表明音频生态正在向 OS 与 Agent 控制面扩展，但公开来源没有给出完整 API、权限模型或第三方 Agent 清单。",
      availability: "Sonos 官方称 Beam Ultra 与 Ace Ultra 于 2026 年 9 月 29 日正式可用，预订自 9 月 1 日开始；美国官方价格分别为 699 美元与 449 美元。不同国家页面的价格和发货时间可能不同，Ace Ultra 的直接系统连接处于 Early Access 表述下。Sonos 27 的软件覆盖、27voice 与 27mcp 的地区和账户条件需以当前版本为准。",
      limitsOrUnknowns: "未知包括 27voice 的实际语音模型、27mcp 的工具与权限、离线能力、端侧/云端处理、第三方 Agent 是否能控制分组、房间切换失败后的恢复、多人账号、隐私提示、持续更新策略和 Ace Ultra 直接连接的正式开放时间。官方的 17 million households 是公司自述，不等于本期独立市场验证。",
      productVerdict: "Sonos 把 AI 音频的竞争从“单个设备有多少功能”拉到“声音能否在房间、耳机与 Agent 控制之间保持连续”。结论：confirmed product；硬件与发售已确认，系统级 AI 控制的真实权限、可靠性和跨账号体验仍是发货后关键验证点。"
    }, {
      productName: "Sonos 27 with Beam Ultra and Sonos Ace Ultra",
      productType: "This is a connected Sonos audio-system update rather than one AI speaker. Beam Ultra is a mid-size home-theatre soundbar, Ace Ultra is a personal wireless headphone, and Sonos 27 is the audio operating layer that brings rooms, speakers, headphones, voice, and content into one system. The value comes from coordination, not a single hardware number.",
      interactionFlow: "Playback begins through a television, the Sonos app, voice, or physical control. Beam Ultra anchors the room with Dolby Atmos, Speech Enhancement, and Night Sound. Ace Ultra connects directly to the Sonos system through Headphone Engine 2; one press moves current playback to the headphones and another returns it. Trueplay tunes the room, while TrueCinema adapts the experience when sound moves from a soundbar to the headphones.",
      specsOrStack: "Sonos lists nine custom drivers, two upward-firing drivers, 7.1.2 Dolby Atmos, four levels of AI Speech Enhancement, Night Sound, Wi-Fi, Bluetooth, HDMI eARC, and Trueplay for Beam Ultra. Ace Ultra has a Sonos-designed 40mm driver, ten-microphone Adaptive ANC, Headphone Engine 2, up to 35 hours with ANC on, USB-C, 3.5mm, Bluetooth, spatial audio, and dynamic head tracking. Sonos 27 is the audio operating system; the shipped authority boundaries of 27voice and 27mcp still require version-level checking.",
      useCases: "The concrete flow is to move a film from the living room to headphones, preserve dialogue at night with Night Sound, improve speech clarity in a busy room, move music between rooms, and assemble compatible devices into home theatre. For product teams, Sonos 27 is also a test of whether a voice or agent can choose room, content, and device while showing the target before playback begins.",
      painPointsSolved: "The bundle reduces the switching cost between room-based listening and personal listening, and uses Speech Enhancement to address hard-to-hear dialogue. It also amplifies network, account, discovery, room-group, accidental-playback, and upgrade friction. Long-running sensitivity around Sonos app updates means users may scrutinise a new system layer; that is review friction, not a universal quality claim about Ace Ultra.",
      userVoice: "TechRadar's CEO interview and product coverage confirm the Ace Ultra system connection, Sonos 27, and the direction of 27voice and 27mcp, but do not constitute a long-term independent review. The community has historically been sensitive to Sonos app updates, connectivity, and migration; this issue does not convert those complaints into an Ace Ultra defect. Handoff latency, recovery, multi-account behaviour, and agent-control feedback need post-shipment testing.",
      newTech: "The new stack is Headphone Engine 2 making the headphone a direct Sonos-system node rather than a Bluetooth endpoint mediated by a phone, combined with room tuning, upward-firing channels, and speech clarity in the soundbar. Sonos 27voice and 27mcp show the ecosystem moving toward OS and agent control surfaces, but the public material gives no complete API, authority model, or third-party agent list.",
      availability: "Sonos says Beam Ultra and Ace Ultra become generally available on September 29, 2026, after preorders opened September 1; the US prices are $699 and $449. Prices and shipping vary by country, and Ace Ultra's direct system connection is described as Early Access. Sonos 27 software coverage and regional or account conditions for 27voice and 27mcp must be read from the current release.",
      limitsOrUnknowns: "Open questions include the actual voice model behind 27voice, tools and permissions in 27mcp, offline behaviour, edge-versus-cloud processing, third-party agent control, recovery after room-handoff failure, multi-account privacy, update policy, and when direct Ace Ultra linking exits Early Access. Sonos's statement about 17 million households is company-reported, not independent market validation for this issue.",
      productVerdict: "Sonos moves the AI-audio contest from how many features one device has to whether sound stays continuous across room, headphones, and agent control. Verdict: confirmed product. Hardware and availability are confirmed; real system-level AI authority, reliability, and multi-account experience remain the critical post-shipment tests."
    })
  }),
  scan({
    id: "openai-devday-2026-api-tools-live-scan-2026-09-29",
    section: "official", evidenceLabel: "developer surface", sourceDate: "2026-09-29",
    evidenceStrength: "official event page; no unannounced keynote product claim promoted in this issue",
    zhHeadline: "OpenAI DevDay：API 与工具是今日已确认的入口，现场新品暂不代写",
    enHeadline: "OpenAI DevDay: APIs and tools are the confirmed surface; the keynote stays a scan",
    zhFact: "OpenAI 官方页面确认 9 月 29 日在旧金山举行 DevDay，安排包括 API 与工具技术分会、动手 demo、workshop 和 keynote，并开放线上观看。页面没有在本次读取时公布具体新品清单，因此本条只记录已确认的开发者入口，不把传闻硬件、模型或现场预告写成产品事实。",
    enFact: "OpenAI's official page confirms DevDay in San Francisco on September 29, with technical sessions on APIs and tools, hands-on demos, workshops, and a keynote available online. At this read, the page does not publish a concrete new-product list, so this item records the confirmed developer surface without turning hardware, model, or keynote speculation into product facts.",
    zhValue: "今天能落地的产品信号是开发者可以围绕 API、tooling、Agents API 与托管 sandbox 构建长任务 Agent；现场事件本身不是一个已发货产品。扫描要观察的是新工具是否改变 Agent 的权限、环境、可观测性、上下文压缩、子 Agent 和 API 版本，而不是把活动标题当作发布会结论。",
    enValue: "The actionable product signal is a developer surface around APIs, tools, the Agents API, and managed sandboxes for long-running agents; the event itself is not a shipped product. The scan should watch whether new tools change authority, environments, observability, context compaction, subagents, or API versioning, rather than treating an event title as a launch conclusion.",
    zhHciLens: ["入口：API、tool、sandbox", "上下文：长任务与多 Agent", "动作：调用、并行、产出 artifact", "边界：权限、成本、版本、可撤销"],
    enHciLens: ["Input: APIs, tools, sandboxes", "Context: long tasks and subagents", "Action: calls, parallel work, artifacts", "Boundary: authority, cost, versioning, undo"],
    zhImplication: "开发者产品的验收点是：工具调用前是否显示权限和成本，sandbox 是否能清理文件与 secret，长任务是否能恢复，版本升级是否可回滚，子 Agent 是否有独立上下文和审计。若现场只增加模型能力而没有这些控制面，用户体验不会因此完成。",
    enImplication: "The acceptance test for a developer product is whether authority and cost appear before tool use, whether a sandbox can clean files and secrets, whether long tasks can resume, whether upgrades can roll back, and whether subagents have separate context and audit. A keynote that adds model capability without these control surfaces does not complete the user experience.",
    visual: visuals.devday,
    sources: [source("OpenAI DevDay 2026 official event page", urls.devday, "official"), source("OpenAI Agents API", urls.agentsApi, "developer docs"), source("OpenAI Developer Community", urls.openaiForum, "community")],
    dossier: makeDossier({
      productName: "OpenAI DevDay 2026 / API and tools source-lane scan",
      productType: "这不是一个新的终端产品，而是对 OpenAI DevDay 2026 开发者活动与 API/tooling 入口的 source-lane scan。官方页面确认活动时间、地点、API 与工具分会、demo、workshop、keynote 和线上观看；本期不把尚未公开的现场发布、硬件、模型名称或价格写成 confirmed product。",
      interactionFlow: "开发者进入活动或线上 keynote，随后通过 API 与 tools session、demo 和 workshop 了解如何构建 Agent。已公开的 Agents API 路线支持托管或自选 sandbox、工具搜索、程序化 tool calling、MCP、自定义函数、web search、上下文压缩与多 Agent。DevDay 页面没有给出一条新的用户端操作流，因此现场流程仍是待观察证据。",
      specsOrStack: "已确认的 developer stack 来自 Agents API 页面：OpenAI-managed sandbox 或合作方环境、文件与 secret 存储选项、CPU/GPU/内存配置、自动 context compaction、tool search、programmatic tool calling、MCP、custom functions、web search 与 multi-agent support。DevDay 活动页没有披露当天新增 API 版本、SDK、价格变更、模型规格或硬件接口。",
      useCases: "已公开入口覆盖需要运行代码、处理文件、调用工具、跨多个 context window 持续工作、并行分解任务、生成 artifact 或在自有 VPC/伙伴环境部署的 Agent。DevDay 的 demo 与 workshop 可能展示更多开发流，但在页面更新前不能扩写为已上线能力。",
      painPointsSolved: "这条开发者路线针对长任务 Agent 需要自己维护 context、sandbox、工具发现、并行编排与环境配置的问题。它把 harness 能力产品化，减少每个团队从零搭建运行时的成本。未解决的问题包括权限可见性、工具误调用、成本预测、secret 清理、版本漂移、跨环境差异和失败后的人工接管。",
      userVoice: "本期只有 OpenAI Developer Community 作为观察入口，没有把活动前后的社区猜测当作新产品反馈。真实开发者摩擦应观察 sandbox 冷启动、context compaction 后的连续性、tool search 误选、MCP 授权、子 Agent 成本和生产回滚；若没有独立复现，成功率与用户评价均为 source not stated。",
      newTech: "已确认的技术方向是把 Codex harness 级别的上下文管理、工具协调、sandbox 和多 Agent 运行能力开放成 API。真正值得观察的不是一个新模型名称，而是 Agent 是否从一次性请求变成长时间、可恢复、可审计的运行对象。DevDay 是否新增硬件或更深的系统界面，在官方页面更新前保持未知。",
      availability: "DevDay 2026 的线上 keynote 对公众开放，现场报名已关闭；相关 Agents API 页面称 API 处于 public beta。活动发生在 9 月 29 日，其他 sessions 会在之后发布。具体现场发布、地区、套餐、SDK 和硬件可用性在本次读取中未公布，因此不作推断。",
      limitsOrUnknowns: "扫描缺口包括 keynote 实际发布、API/SDK 版本、定价、权限与审计模型、sandbox 数据清理、模型升级兼容、硬件计划、开发者反馈和第三方实测。活动页的“what teams are building”与“more”不是产品清单；只有官方更新或可复现文档出现后，才升级为 reported product item。",
      productVerdict: "DevDay 是一个需要持续刷新页面的 developer-surface scan：已确认 API、工具、sandbox 和技术活动入口，未确认本次现场会发布什么。结论：developer surface / weak on new-product detail；今天的编辑动作是保留事实边界，下一次以官方 release note 和可用文档为准。"
    }, {
      productName: "OpenAI DevDay 2026 / API and tools source-lane scan",
      productType: "This is not a new end-user product. It is a source-lane scan of OpenAI DevDay 2026 and its API and tooling entry points. The official page confirms the date, venue, API and tools sessions, demos, workshops, keynote, and online access. This issue does not turn an unpublished live announcement, hardware, model name, or price into a confirmed product.",
      interactionFlow: "A developer joins the event or online keynote, then uses API and tools sessions, demos, and workshops to learn how to build agents. The public Agents API route already supports managed or chosen sandboxes, tool search, programmatic tool calling, MCP, custom functions, web search, context compaction, and multi-agent support. The DevDay page does not provide a new end-user flow, so the live sequence remains evidence to watch.",
      specsOrStack: "The confirmed developer stack comes from the Agents API page: OpenAI-managed or partner environments, file and secret storage options, CPU/GPU/memory configurations, automatic context compaction, tool search, programmatic tool calling, MCP, custom functions, web search, and multi-agent support. The DevDay page does not disclose a same-day API version, SDK, pricing change, model specification, or hardware interface.",
      useCases: "The public surface covers agents that run code, handle files, call tools, span multiple context windows, split work across subagents, produce artifacts, or deploy in a customer VPC or partner environment. DevDay demos and workshops may show more, but the event page cannot support expanding those possibilities into shipped capabilities before an official update.",
      painPointsSolved: "This developer route targets the need to build context management, sandboxes, tool discovery, parallel orchestration, and runtime configuration from scratch. It productises parts of an agent harness and can reduce repeated infrastructure work. It does not resolve authority visibility, accidental tool calls, cost prediction, secret cleanup, version drift, cross-environment variance, or human takeover after failure.",
      userVoice: "This run uses the OpenAI Developer Community only as an observation entry, not as evidence for a new product reaction. Concrete friction to watch includes sandbox cold starts, continuity after compaction, bad tool selection, MCP authority, subagent cost, and production rollback. Without independent reproduction, success rates and user praise remain source not stated.",
      newTech: "The confirmed direction is exposing Codex-harness-level context management, tool coordination, sandboxing, and multi-agent runtime behaviour through an API. The product question is whether an agent becomes a long-running, recoverable, auditable object rather than a one-shot request. Hardware or deeper system interfaces at DevDay remain unknown until an official page changes.",
      availability: "The DevDay 2026 online keynote is open to the public while in-person applications are closed; the Agents API page describes a public beta. The event is on September 29 and other sessions will be posted later. The live announcement list, region, plan, SDK, and hardware availability were not published in this read and are not inferred.",
      limitsOrUnknowns: "The scan gap includes the actual keynote releases, API and SDK versions, pricing, authority and audit model, sandbox cleanup, upgrade compatibility, hardware plans, developer feedback, and third-party testing. Phrases such as what teams are building and more are not a product list. Only an official release note or reproducible document should upgrade an item to a reported product.",
      productVerdict: "DevDay is a developer-surface scan that needs a page refresh: APIs, tools, sandboxes, and the technical event are confirmed, while the live product list is not. Verdict: developer surface with weak new-product detail. The editorial choice today is to preserve the boundary and use official release notes and usable documentation for the next update."
    })
  })
];
