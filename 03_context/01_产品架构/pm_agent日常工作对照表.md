# pm_agent 日常工作对照表

这份对照表用于把 `pm_agent` 中最常见的产品工作，映射到对应的 skill、agent 和目录落位。

核心原则：

- `skill` 解决“调用哪类能力”
- `agent` 解决“用什么角色做事”
- 目录落位解决“产出放哪里”

## 一、速查总表

| 日常工作 | 优先 skill | 对应 agent | 推荐目录落位 | 备注 |
| --- | --- | --- | --- | --- |
| 新需求刚出现，先想清楚值不值得做 | `context-engineer` | `01_agents/角色定义/产品策略顾问.md` | `05_drafts/方案探索/` 或 `04_workspace/discussions/` | 先做问题定义和目标澄清，不急着写 PRD |
| 把模糊需求整理成结构化分析 | `context-engineer` | `01_agents/角色定义/需求分析师.md` | `04_workspace/prd/某专题/analysis/` | 可先套 `02_tools/模板/需求分析输入卡.md` |
| 写正式 PRD | 无强制 skill，必要时配合 `context-engineer` 读上下文 | `01_agents/角色定义/PRD写作助手.md` | `04_workspace/prd/某专题/prd/` | 先有分析，再写 PRD |
| 先出页面结构和交互原型说明 | 无强制 skill | `01_agents/角色定义/原型设计助手.md` | `04_workspace/prd/某专题/prototype/` | 适合先写 `01-原型说明.md` |
| 直接做可运行 H5 / PC 原型 | `ui-ux-pro-max`、`browser-use:browser` | `01_agents/角色定义/原型设计助手.md` | `04_workspace/demos/` 或专题 `prototype/` | 先定页面结构和状态，再进入实现 |
| 画 Figma 原型 | `figma:figma-use`、`figma:figma-generate-design` | 可先用 `原型设计助手` 梳理结构 | Figma 为主；若需沉淀说明，同步到专题 `prototype/` | 适合评审稿、视觉稿 |
| 整理会议纪要 | `context-engineer` | `01_agents/角色定义/会议纪要整理员.md` | `04_workspace/关键会议纪要/` 或专题 `analysis/` | 若直接服务某需求，优先进对应专题 |
| 记录和梳理 Bug | 无强制 skill | `01_agents/角色定义/Bug归因助手.md` | `04_workspace/bugs/` 或专题 `analysis/` | 产品侧先梳理现象、复现、范围 |
| 验收 H5 / PC demo | `browser-use:browser` | `01_agents/角色定义/Demo验收助手.md` | 专题 `prototype/`、`04_workspace/discussions/` 或 `04_workspace/bugs/` | 问题清单按用途决定落位 |
| 做页面/UI体验优化 | `ui-ux-pro-max`、`browser-use:browser` | `01_agents/角色定义/原型设计助手.md` | 如果是规则说明，进专题 `prototype/`；如果是代码原型，在 `04_workspace/demos/` | UI 优化不要直接写进稳定 `03_context/` |
| 整理仓库结构、补索引、判断内容放哪 | `context-engineer` | `01_agents/角色定义/Context架构师.md` | 视内容而定：`05_drafts/`、`04_workspace/`、`03_context/` | 这是 `pm_agent` 的总管能力 |
| 做需求优先级表、排期表、数据表 | `spreadsheets:Spreadsheets` | 可先用 `产品策略顾问` 明确维度 | `04_workspace/prd/某专题/analysis/` 或单独专题目录 | 表格是附件，正文仍在专题文档里 |
| 做汇报 PPT | `presentations:Presentations` | 可先用 `PRD写作助手` 收敛内容 | `04_workspace/prd/某专题/` 或 `04_workspace/discussions/` | 汇报稿建议和专题放一起 |
| 做正式 Word 版方案 / PRD | `documents:documents` | `01_agents/角色定义/PRD写作助手.md` | `04_workspace/prd/某专题/prd/` | 适合对外版本或评审定稿 |
| 做文章配图、示意图、封面图 | `imagegen` | 视任务而定 | `04_workspace/公众号/` 或具体专题目录 | 视觉素材不进 `03_context/` |
| 查看 PR、CI、研发评论 | `github:github`、`github:gh-fix-ci`、`github:gh-address-comments` | 视任务而定，产品侧可先用 `Bug归因助手` 或 `需求分析师` 补业务背景 | 与代码专题或讨论专题放一起 | 只有你真的介入研发协作时才高频 |

## 二、最常用的几条固定跑法

### 1. 新需求标准跑法

1. 用 `产品策略顾问` 明确问题、目标、优先级
2. 套 `02_tools/模板/需求分析输入卡.md`
3. 用 `需求分析师` 输出 `analysis/01-需求分析.md`
4. 用 `PRD写作助手` 输出 `prd/01-PRD.md`

推荐目录：

- 初步探索：`05_drafts/方案探索/`
- 进入正式推进：`04_workspace/prd/某专题/`

### 2. 原型标准跑法

分两种：

- 如果先要结构：直接在专题 `prototype/` 写原型说明
- 如果要页面可看：去 `04_workspace/demos/` 做可运行 demo

推荐组合：

- 文档原型：`原型设计助手`
- 浏览器原型：`ui-ux-pro-max` + `browser-use:browser`
- Figma 原型：`figma:figma-use` + `figma:figma-generate-design`

### 3. 会议到需求的跑法

1. 用 `会议纪要整理员` 整理原始会议内容
2. 如果已形成明确需求，迁入对应专题 `analysis/`
3. 再进入分析、原型、PRD 流程

### 4. Demo 验收到问题记录的跑法

1. 用 `browser-use:browser` 打开 H5 / PC 页面
2. 用 `Demo验收助手` 按 `02_tools/清单/Demo验收清单.md` 检查
3. 如果是体验问题，记到专题 `prototype/` 或 `04_workspace/discussions/`
4. 如果是明确缺陷，记到 `04_workspace/bugs/`

## 三、什么时候放 drafts、workspace、context

### 放 `05_drafts/`

- 还没想清楚
- 只是灵感、猜测、方向探索
- 暂时不适合当正式需求

### 放 `04_workspace/`

- 已经开始推进
- 需要评审、讨论、出原型、写 PRD
- 需要持续协作

### 放 `03_context/`

- 已经确认
- 后续会长期复用
- 更像规则、方法、术语、结构说明，而不是某次具体需求

## 四、最推荐你高频使用的组合

如果只保留最实用的 5 个组合，优先是：

1. `context-engineer` + `Context架构师`
   用于仓库治理、落位判断、索引维护

2. `context-engineer` + `需求分析师`
   用于启动和分析需求

3. `PRD写作助手` + `02_tools/模板/PRD骨架模板.md`
   用于正式输出 PRD

4. `原型设计助手` + `ui-ux-pro-max`
   用于页面结构、交互方案和 demo 设计

5. `browser-use:browser` + `Demo验收助手`
   用于 H5 / PC demo 查看和验收

## 五、最省事的触发句

下面这些说法，在 `pm_agent` 里最容易直接触发正确动作：

- `帮我把这个想法先整理成需求分析，建到 04_workspace/prd`
- `先别写 PRD，先做原型说明`
- `把这个后台需求做成可运行 demo 并打开`
- `打开 H5 医生开单，帮我验收一遍`
- `帮我整理进合适目录，并补索引`
- `把这份需求做成 Word 版`
- `把这组数据整理成 Excel`

## 六、补充原则

- 先判断任务类型，再选 skill，不要先背 skill 名
- 先判断产出是“内容”“页面”“素材”还是“知识规则”
- 先决定放哪，再决定怎么写
- 不确定时，优先放 `05_drafts/` 或 `04_workspace/`，不要污染 `03_context/`

## 七、一句话触发口令表

这一节用于把“你怎么说一句话”和“我实际会怎么跑”直接对应起来。

| 你可以直接这样说 | 我会自动走的流程 | 最终落位 |
| --- | --- | --- |
| `帮我把这个想法先整理一下` | `产品策略顾问` -> 判断问题、目标、优先级 -> 输出探索结论 | `05_drafts/方案探索/` |
| `帮我把这个需求建专题并先做分析` | 新建 `04_workspace/prd/某专题/` -> 套 `需求分析输入卡` -> 用 `需求分析师` 写分析 | `04_workspace/prd/某专题/analysis/` |
| `先别写 PRD，先做原型说明` | 用 `原型设计助手` 整理页面结构、模块、流程和交互说明 | `04_workspace/prd/某专题/prototype/` |
| `把这个需求写成正式 PRD` | 先读取已有分析 -> 用 `PRD写作助手` 按骨架输出 | `04_workspace/prd/某专题/prd/` |
| `把这个后台页面做成 demo 并打开` | 先用 `原型设计助手` 梳理页面结构 -> 用 `ui-ux-pro-max` 组织页面 -> 在 `04_workspace/demos/` 实现 -> 用 `browser-use:browser` 打开 | `04_workspace/demos/` |
| `打开 H5 医生开单帮我验收一遍` | 用 `browser-use:browser` 打开页面 -> 用 `Demo验收助手` 按清单检查 -> 归档问题 | `04_workspace/bugs/` 或专题 `prototype/` |
| `把这段会议记录整理一下` | 用 `会议纪要整理员` 提炼结论、分歧、行动项 | `04_workspace/关键会议纪要/` 或专题 `analysis/` |
| `这个 bug 帮我梳理成标准问题单` | 用 `Bug归因助手` 整理现象、复现、影响范围、怀疑链路 | `04_workspace/bugs/` |
| `帮我看看这批内容该放哪里` | 用 `Context架构师` 判断是 `05_drafts/`、`04_workspace/` 还是 `03_context/`，必要时补索引 | 按内容性质决定 |
| `把这份 PRD 做成 Word` | 读取专题现有内容 -> 用 `documents` 生成正式文档 | `04_workspace/prd/某专题/prd/` |
| `把这组数据整理成 Excel` | 先明确字段和维度 -> 用 `spreadsheets` 生成表格 | 专题 `analysis/` 或专题附件目录 |
| `帮我做个汇报 PPT` | 先收敛汇报结构 -> 用 `presentations` 生成演示稿 | `04_workspace/prd/某专题/` 或 `04_workspace/discussions/` |
| `帮我画成 Figma 原型` | 先用 `原型设计助手` 梳理页面结构 -> 用 `figma:figma-use` / `figma:figma-generate-design` 画稿 | Figma 为主；说明同步进专题 `prototype/` |
| `帮我做张公众号配图` | 明确主题、风格、尺寸 -> 用 `imagegen` 生成素材 | `04_workspace/公众号/` |

## 八、默认理解规则

为了让你少解释，我会默认这样理解：

- 你说“整理一下”，优先理解为先做结构化分析，不直接写 PRD
- 你说“做原型”，优先区分是文档原型、浏览器 demo 还是 Figma 原型
- 你说“打开看看”，优先用应用内浏览器，不用系统浏览器
- 你说“帮我放到合适目录”，优先走 `Context架构师` 的落位判断
- 你没明确说放 `03_context/` 时，我不会把未确认内容直接沉淀成稳定知识

## 九、你最省事的说法

如果你想尽量少打字，下面这些最省事：

- `建专题，先分析`
- `先做原型说明`
- `直接做 demo 并打开`
- `打开 H5，帮我验收`
- `整理成会议纪要`
- `梳理成 bug 单`
- `做成 Word`
- `做成 Excel`
- `做成 PPT`
- `帮我归档到合适目录`
